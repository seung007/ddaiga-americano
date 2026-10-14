#!/usr/bin/env node
/**
 * 외부 후기 데이터 검사 — lib/shoes/reviews.json (2026-10-14)
 *
 *   node scripts/check-reviews.mjs          형식·신발 id·평가어·중복 (오프라인, npm run check 포함)
 *   node scripts/check-reviews.mjs --live   링크 생존까지 (주간 CI). 블로그 글은 비공개·삭제가 잦다
 *
 * 평가어 금지는 「고르지 않는다」와 한 쌍이다 — facts 에 「좋다」가 들어가는 순간 요약이 추천이 된다.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const LIVE = process.argv.includes("--live");
const data = JSON.parse(readFileSync(path.join(ROOT, "lib/shoes/reviews.json"), "utf8"));
const dataTs = readFileSync(path.join(ROOT, "lib/shoes/data.ts"), "utf8");
const shoeIds = new Set([...dataTs.matchAll(/^\s*id:\s*"([^"]+)"/gm)].map((m) => m[1]));

const SOURCES = new Set(["blog", "youtube", "community"]);
const HOST_OK = {
  blog: /^(blog|m\.blog)\.naver\.com$|^(brunch\.co\.kr|velog\.io|tistory\.com)$|\.tistory\.com$/,
  youtube: /^(www\.|m\.)?youtube\.com$|^youtu\.be$/,
  community: /./,
};
// 평가어 — 사실 진술이 아닌 말. 걸리면 문장을 사실로 다시 쓴다
const OPINION = /(좋|최고|추천|별로|실망|만족|훌륭|대박|꼭 사|사세요|가성비|갓|강추|비추)/;

const problems = [];
const seenUrl = new Set();
let total = 0;

for (const [id, r] of Object.entries(data)) {
  const at = `reviews.json[${id}]`;
  if (!shoeIds.has(id)) problems.push(`${at}: data.ts 에 없는 신발 id`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(r?.collectedAt ?? "")) problems.push(`${at}: collectedAt 은 YYYY-MM-DD`);
  if (!r?.rule || r.rule.length < 10) problems.push(`${at}: rule(수집 기준)을 적어야 한다 — 화면에 그대로 보인다`);
  if (!Array.isArray(r?.items) || !r.items.length) problems.push(`${at}: items 가 비었다 — 안 모았으면 항목을 지운다`);
  for (const [i, it] of (r?.items ?? []).entries()) {
    const a = `${at}.items[${i}]`;
    total++;
    if (!SOURCES.has(it.source)) problems.push(`${a}: source 는 blog|youtube|community`);
    if (!it.title) problems.push(`${a}: title 없음`);
    if (!it.author) problems.push(`${a}: author 없음`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(it.date ?? "")) problems.push(`${a}: date 는 YYYY-MM-DD`);
    let host = "";
    try { host = new URL(it.url).hostname; } catch { problems.push(`${a}: url 형식 아님`); }
    if (host && HOST_OK[it.source] && !HOST_OK[it.source].test(host)) problems.push(`${a}: ${it.source} 출처인데 host 가 ${host}`);
    if (seenUrl.has(it.url)) problems.push(`${a}: url 중복`); seenUrl.add(it.url);
    if (!Array.isArray(it.facts)) problems.push(`${a}: facts 는 배열`);
    if (it.commercial !== undefined && (typeof it.commercial !== "string" || it.commercial.length > 30 || OPINION.test(it.commercial)))
      problems.push(`${a}: commercial 은 30자 이하 사실 문구 — 「${it.commercial}」`);
    for (const f of it.facts ?? []) {
      if (f.length > 40) problems.push(`${a}: fact 가 40자 넘음 — 「${f.slice(0, 20)}…」 (한 줄 사실만)`);
      if (OPINION.test(f)) problems.push(`${a}: 평가어 — 「${f}」. 사실로 다시 쓴다`);
    }
  }
}

if (LIVE && !problems.length) {
  const urls = [...seenUrl];
  const dead = [];
  await Promise.all(urls.map(async (u) => {
    try {
      const r = await fetch(u, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(15000),
        headers: { "User-Agent": "Mozilla/5.0 ddaiga-americano link-check" } });
      // 네이버 블로그는 비공개·삭제도 200 을 주고 본문에 안내를 띄운다 — 본문 문구로 판정
      const t = r.ok ? await r.text() : "";
      if (!r.ok || /존재하지 않는 게시물|삭제된 게시물|비공개|This video isn't available|Video unavailable/.test(t)) dead.push(`${r.status} ${u}`);
    } catch (e) { dead.push(`${e?.cause?.code ?? e?.name} ${u}`); }
  }));
  for (const d of dead) problems.push(`죽은 링크: ${d}`);
}

if (problems.length) {
  console.log(`외부 후기 데이터 문제 ${problems.length}건:\n`);
  for (const p of problems) console.log("  " + p);
  process.exit(1);
}
if (!total) console.log("외부 후기: 아직 모은 신발 없음 (reviews.json 비어 있음) — 형식 검사만 통과");
