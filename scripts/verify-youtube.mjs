#!/usr/bin/env node
/**
 * 유튜브 링크 검증기 — 걸어둔 영상이 아직 살아 있는지, 라벨이 실제 영상과 맞는지 확인한다.
 *
 * 왜 만들었나
 * ───────────
 * 2026-08-31에 이런 대화가 있었다. 신발 DB의 유튜브 링크 156개가 전부
 * `youtube.com/results?search_query=`(검색 결과 페이지)인데 라벨은
 * "Kinvara 16 리뷰", "비교 영상"이었다. 나는 "특정 영상은 삭제되니 검색이 낫다"고
 * 주장했는데, 그건 틀린 논리였다 —
 *
 *   · 같은 논리면 논문도 검색 링크여야 한다. 그런데 그날 하루 종일 한 일이
 *     논문을 특정 PMID로 고정하는 것이었다.
 *   · 부상 가이드 페이지들은 이미 실제 watch?v= 링크에 채널명까지 달고 있다.
 *     같은 사이트에서 한쪽은 제대로 하고 한쪽은 검색으로 떠넘기고 있었다.
 *   · 무엇보다 "리뷰 검색"은 답이 아니라 숙제 떠넘기기다. 이 사이트의 주장은
 *     "검증된 큐레이션"이고, 검색창으로 보내는 건 그 주장과 어긋난다.
 *
 * 링크 썩음은 실재하는 비용이다. 답은 피하는 게 아니라 검사하는 것이다.
 *
 * 무엇을 보는가
 * ────────────
 *   1. watch?v= 링크가 아직 살아 있는가 (삭제·비공개·지역차단 감지)
 *   2. 페이지에 적은 채널명이 실제 업로더와 맞는가
 *   3. 아직 검색 결과 URL로 남아 있는 곳이 어디인가 (= 큐레이션 안 된 자리)
 *
 * YouTube oEmbed를 쓴다. API 키가 필요 없고, 삭제·비공개 영상에는 404를 준다.
 *
 * 사용법
 *   node scripts/verify-youtube.mjs           전체 검사
 *   node scripts/verify-youtube.mjs --todo    큐레이션 안 된 자리만 (오프라인)
 *   node scripts/verify-youtube.mjs --json    기계용 출력
 *
 * 죽은 링크가 있으면 exit 1.
 */

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SCAN = ["app", "lib", "components"];
const EXTS = new Set([".tsx", ".ts"]);
const DELAY_MS = 200;

const args = new Set(process.argv.slice(2));
const AS_JSON = args.has("--json");
const TODO_ONLY = args.has("--todo");

const C = {
  red: s => `\x1b[31m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  green: s => `\x1b[32m${s}\x1b[0m`,
  dim: s => `\x1b[2m${s}\x1b[0m`,
  bold: s => `\x1b[1m${s}\x1b[0m`,
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── 수집 ──────────────────────────────────────────────────────
async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name.startsWith(".")) continue;
      yield* walk(p);
    } else if (EXTS.has(path.extname(e.name))) yield p;
  }
}

/** { label: "...", channel: "...", url: "..." } 또는 { label, url } 형태를 읽는다 */
const ENTRY_RE =
  /\{\s*label:\s*"([^"]*)"\s*,(?:\s*channel:\s*"([^"]*)"\s*,)?\s*url:\s*"(https:\/\/www\.youtube\.com\/[^"]+)"\s*\}/g;

async function collect() {
  const out = [];
  for (const dir of SCAN) {
    let it; try { it = walk(path.join(ROOT, dir)); } catch { continue; }
    for await (const file of it) {
      const text = await readFile(file, "utf8");
      const offsets = []; let acc = 0;
      for (const l of text.split("\n")) { offsets.push(acc); acc += l.length + 1; }
      for (const m of text.matchAll(ENTRY_RE)) {
        let line = 1;
        for (let i = 0; i < offsets.length; i++) { if (offsets[i] > m.index) break; line = i + 1; }
        const url = m[3];
        // watch?v=ID 와 /shorts/ID 를 모두 잡는다.
        // 첫 실전 실행에서 shorts만 조용히 검증에서 빠졌고, 하필 남아 있던
        // 가짜 채널명("재활운동TV", "러닝자세TV", "재활TV")이 거기 몰려 있었다.
        // 검사기가 안 보는 자리에 문제가 고인다.
        const vid =
          url.match(/[?&]v=([\w-]{11})/)?.[1] ??
          url.match(/\/shorts\/([\w-]{11})/)?.[1] ??
          null;
        out.push({
          file: path.relative(ROOT, file).replace(/\\/g, "/"),
          line,
          label: m[1],
          channel: m[2] ?? null,
          url,
          videoId: vid,
          isSearch: url.includes("/results?"),
        });
      }
    }
  }
  return out;
}

// ── 조회 ──────────────────────────────────────────────────────
async function oembed(videoId) {
  const u = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    `https://www.youtube.com/watch?v=${videoId}`
  )}&format=json`;
  const r = await fetch(u, { headers: { "User-Agent": "ddaiga-youtube-check/1.0" } });
  if (r.status === 404) throw new Error("삭제되었거나 비공개 영상");
  // 401은 죽은 링크가 아니다. 영상은 살아 있고 임베드만 막혀 있다.
  // 이 사이트는 임베드가 아니라 링크로 걸므로 사용자에게는 정상 작동한다.
  // 첫 실행에서 이 둘을 같이 세는 바람에 살아 있는 영상 4개를 죽었다고 보고했다.
  // 다만 oEmbed로 채널명을 확인할 수 없으므로 채널 주장은 달지 않는다.
  if (r.status === 401) { const e = new Error("임베드 차단 — 링크는 정상, 채널 확인 불가"); e.embedBlocked = true; throw e; }
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const j = await r.json();
  return { title: j.title, channel: j.author_name };
}

// ── 실행 ──────────────────────────────────────────────────────
const items = await collect();
const curated = items.filter(i => i.videoId);
const searches = items.filter(i => i.isSearch);

if (TODO_ONLY || !curated.length) {
  // 오프라인 모드 — 큐레이션이 비어 있는 자리를 파일별로 모아 보여준다
  const byFile = new Map();
  for (const s of searches) {
    if (!byFile.has(s.file)) byFile.set(s.file, []);
    byFile.get(s.file).push(s);
  }
  console.log(C.bold(`\n큐레이션 안 된 유튜브 자리 — ${searches.length}개\n`));
  for (const [file, rows] of byFile) {
    console.log(C.bold(file) + C.dim(`  (${rows.length}개)`));
    for (const r of rows) {
      const q = decodeURIComponent(r.url.split("search_query=")[1] ?? "");
      console.log(`  ${C.yellow("•")} ${r.label}  ${C.dim(`← 검색어: ${q}`)}`);
    }
  }
  console.log(C.dim(`\n실제 영상 링크는 ${curated.length}개. 검색 URL을 실제 영상으로 바꿔가면 이 목록이 줄어든다.\n`));
  process.exit(0);
}

console.log(C.bold(`\n유튜브 링크 검증 — 실제 영상 ${curated.length}개 · 검색 URL ${searches.length}개\n`));

const rows = [];
for (const it of curated) {
  let actual = null, error = null, blocked = false;
  try { actual = await oembed(it.videoId); }
  catch (e) { error = e.message; blocked = Boolean(e.embedBlocked); }
  await sleep(DELAY_MS);

  const issues = [];
  if (blocked) {
    // 링크는 살아 있다. 채널명을 주장하고 있으면 그것만 문제 삼는다.
    issues.push({
      level: it.channel ? "warn" : "info",
      msg: it.channel ? `${error} — 확인 못 한 채널명("${it.channel}")을 달아두면 안 된다` : error,
    });
  }
  else if (error) issues.push({ level: "error", msg: error });
  else if (it.channel && actual.channel && it.channel.trim() !== actual.channel.trim()) {
    issues.push({ level: "warn", msg: `채널 불일치 — 페이지 "${it.channel}" vs 실제 "${actual.channel}"` });
  }
  rows.push({ ...it, actual, issues });

  if (!AS_JSON) {
    const worst = issues.some(i => i.level === "error") ? "error" : issues.length ? "warn" : "ok";
    const mark = worst === "error" ? C.red("✗") : worst === "warn" ? C.yellow("!") : C.green("✓");
    console.log(`${mark} ${it.file}:${it.line}  ${it.label}`);
    if (actual) console.log(C.dim(`    실제: [${actual.channel}] ${actual.title.slice(0, 80)}`));
    for (const i of issues) console.log(`    ${i.level === "error" ? C.red("→") : C.yellow("→")} ${i.msg}`);
  }
}

const dead = rows.filter(r => r.issues.some(i => i.level === "error"));
const infos = rows.filter(r => r.issues.every(i => i.level === "info") && r.issues.length);
const mism = rows.filter(r => r.issues.some(i => i.level === "warn"));

if (AS_JSON) {
  console.log(JSON.stringify({ curated: rows.length, dead: dead.length, mismatched: mism.length, uncurated: searches.length, rows }, null, 2));
} else {
  console.log(C.bold("\n─────────────────────────────"));
  console.log(`실제 영상 ${rows.length}개 · ${C.red(`죽음 ${dead.length}`)} · ${C.yellow(`채널 불일치 ${mism.length}`)} · ${C.green(`정상 ${rows.length - dead.length - mism.length}`)}`);
  if (searches.length) console.log(C.yellow(`아직 검색 URL로 남은 자리 ${searches.length}개`) + C.dim("  — --todo 로 목록 확인"));
  console.log();
}

process.exit(dead.length ? 1 : 0);
