#!/usr/bin/env node
/**
 * 외부 후기 수집 — **hyun 님 PC 의 Chrome 으로** 네이버 블로그 검색 상위 N 건을 긁어 원문 텍스트를 떨어뜨린다.
 *
 *   npm run reviews:collect -- asics-gel-cumulus-27              data.ts 의 brand+model 로 검색어를 만든다
 *   npm run reviews:collect -- asics-gel-cumulus-27 --q="젤 쿠물러스 27 후기"   검색어를 직접
 *   npm run reviews:collect -- asics-gel-cumulus-27 --n=10 --headed
 *   npm run reviews:collect -- asics-gel-cumulus-27 --kw="큐물러스,쿠물러스,큐뮬러스"   본문 언급 판정에 쓸 한글 표기
 *
 * 「언급 N회」: 본문에 모델명이 몇 번 나오나. 라인업 소개 글(한 줄 언급)과 후기를 가르는 기계적 기준이다.
 * reviews.json 의 rule 은 「상위 10건 중 본문에서 이 모델을 3회 이상 다룬 글 전부」처럼 적는다 — 고르지 않되 무관한 글은 뺀다.
 *
 * 결과: outputs/reviews-raw-<id>.json  — Claude 가 읽고 lib/shoes/reviews.json 의 facts 를 쓴다.
 *       원문 전체가 들어 있으므로 **저장소에 넣지 않는다** (outputs/ 는 .gitignore). 화면에는 우리가 쓴 요약만 나간다.
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 이 모양인가 (2026-10-14)
 *   Claude 는 네이버를 못 연다 — 샌드박스 프록시도, 크롬 확장도 막는다(check-links-browser.mjs 와 같은 벽).
 *   그래서 check:links:kr 과 같은 구조: PC 가 긁고, JSON 을 Claude 가 읽는다. 사람이 10편을 복사해 붙이는 일을 없앤다.
 *
 * 지키는 것
 *   · **순서대로 전부.** 검색 결과 상위 N 건을 고르지 않고 그대로 담는다. 이 순서가 reviews.json 의 `rule` 이 된다
 *   · 한 글당 2초 쉰다. 10건이면 30초 — 사람이 넘기는 속도다. 수백 건을 돌리는 도구가 아니다
 *   · 사진은 받지 않는다. 텍스트만, 그것도 Claude 가 사실을 뽑는 용도로만 쓴다
 *   · 네이버 검색 결과 구조는 자주 바뀐다. 링크를 0건 찾으면 셀렉터가 바뀐 것이다 — --headed 로 보고 고친다
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const id = args.find((a) => !a.startsWith("-"));
const opt = (k, d) => { const m = args.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const N = Number(opt("n", 10));
const HEADED = args.includes("--headed");
if (!id) { console.log("신발 id 를 주세요. 예: npm run reviews:collect -- asics-gel-cumulus-27"); process.exit(1); }

// data.ts 에서 brand·model 을 뽑아 검색어를 만든다 (한글 별칭이 있으면 aliases.ts 가 더 낫지만, 우선 영문)
const dataTs = readFileSync(path.join(ROOT, "lib/shoes/data.ts"), "utf8");
const block = dataTs.slice(dataTs.indexOf(`id: "${id}"`));
if (block === dataTs) { console.log(`data.ts 에 ${id} 가 없습니다`); process.exit(1); }
const brand = /brand:\s*"([^"]+)"/.exec(block)?.[1] ?? "";
const model = /model:\s*"([^"]+)"/.exec(block)?.[1] ?? "";
const query = opt("q", `${brand} ${model} 후기`);

let chromium;
try { ({ chromium } = await import("playwright")); } catch { console.log("playwright 가 없습니다: npm i"); process.exit(1); }
const browser = await chromium.launch({ channel: "chrome", headless: !HEADED }).catch(() => chromium.launch({ headless: !HEADED }));
const ctx = await browser.newContext({ locale: "ko-KR", viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

// 1) 블로그 탭 검색
// 2026-10-14 첫 실행: 1.5초만 기다려 링크 1건만 잡혔다. 네이버는 스크롤해야 결과를 더 그린다 → 스크롤하며 모은다.
// 링크 형식도 두 가지다: blog.naver.com/<id>/<글번호>  ·  blog.naver.com/PostView.naver?blogId=..&logNo=..
const searchUrl = `https://search.naver.com/search.naver?ssc=tab.blog.all&query=${encodeURIComponent(query)}`;
await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
const norm = (h) => {
  let m = /(?:m\.)?blog\.naver\.com\/([A-Za-z0-9_-]+)\/(\d{6,})/.exec(h);
  if (m) return `https://blog.naver.com/${m[1]}/${m[2]}`;
  m = /blogId=([A-Za-z0-9_-]+).*?logNo=(\d{6,})/.exec(h) || /logNo=(\d{6,}).*?blogId=([A-Za-z0-9_-]+)/.exec(h);
  if (m) return /^\d+$/.test(m[1]) ? `https://blog.naver.com/${m[2]}/${m[1]}` : `https://blog.naver.com/${m[1]}/${m[2]}`;
  return null;
};
let urls = [];
for (let round = 0; round < 6 && urls.length < N; round++) {
  const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.href));
  for (const h of hrefs) { const u = norm(h); if (u && !urls.includes(u)) urls.push(u); }
  await page.mouse.wheel(0, 2500);
  await page.waitForTimeout(1200);
}
urls = urls.slice(0, N);
mkdirSync(path.join(ROOT, "outputs"), { recursive: true });
if (urls.length < N) {
  // 다음 실패 때 캡처 없이 Claude 가 직접 고칠 수 있게 — 검색 결과 HTML 과 링크 도메인 분포를 남긴다
  const dbg = path.join(ROOT, "outputs", "reviews-debug-search.html");
  writeFileSync(dbg, await page.content(), "utf8");
  const hosts = await page.$$eval("a[href]", (as) => as.map((a) => { try { return new URL(a.href).host; } catch { return ""; } }));
  const cnt = {}; for (const h of hosts) cnt[h] = (cnt[h] || 0) + 1;
  console.log(`블로그 글 링크 ${urls.length}건 (목표 ${N}). 진단 파일: outputs/reviews-debug-search.html`);
  console.log("  링크 도메인 상위: " + Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([h, n]) => `${h} ${n}`).join(" · "));
}
if (!urls.length) { await browser.close(); process.exit(1); }
console.log(`검색어 「${query}」 → 상위 ${urls.length}건`);

// 모델 언급 판정용 키워드. 한글 표기가 갈린다(쿠물러스·큐물러스·큐뮬러스…) → --kw 로 더한다
const KW = [...new Set([model, ...model.split(/[\s-]+/).filter((w) => w.length >= 4), ...opt("kw", "").split(",")]
  .map((w) => w.trim().toLowerCase()).filter(Boolean))];

// 2) 글마다 본문 텍스트
const DATE_RE = /^(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\./;
const items = [];
for (const [i, url] of urls.entries()) {
  const m = url.replace("https://blog.naver.com/", "https://m.blog.naver.com/");
  const row = { rank: i + 1, url, title: "", author: "", date: "", mentions: 0, text: "", error: null };
  try {
    await page.goto(m, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1200);
    row.title = (await page.title()).replace(/\s*:\s*네이버 블로그\s*$/, "").trim();
    const body = await page.$eval(".se-main-container, #postViewArea, .post_ct, article", (e) => e.innerText).catch(() => "");
    const all = await page.evaluate(() => document.body.innerText).catch(() => "");
    // 작성자·날짜: 셀렉터가 「신고하기」를 집은 적이 있다(첫 실행). 화면 머리의 「제목 → 닉네임 → 날짜」 줄 순서로 읽는다
    const lines = all.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 30);
    const di = lines.findIndex((l) => DATE_RE.test(l));
    if (di > 0) {
      const d = DATE_RE.exec(lines[di]);
      row.date = `${d[1]}-${d[2].padStart(2, "0")}-${d[3].padStart(2, "0")}`;
      row.author = lines[di - 1];
    } else {
      row.date = lines.find((l) => /전$|어제/.test(l)) ?? ""; // 「3시간 전」 같은 상대 날짜 — 사람이 확인
    }
    row.text = (body || all).replace(/\n{3,}/g, "\n\n").trim().slice(0, 12000);
    const low = row.text.toLowerCase();
    row.mentions = KW.reduce((n, k) => n + (low.split(k).length - 1), 0);
    if (!row.text) row.error = "본문 셀렉터 불일치 또는 비공개";
    if (/존재하지 않는 게시물|삭제된 게시물|비공개 글/.test(row.text + row.title)) row.error = "삭제·비공개";
  } catch (e) { row.error = e?.message?.split("\n")[0] ?? String(e); }
  console.log(`  ${String(row.rank).padStart(2)}. ${row.error ? "✗ " + row.error : `✓ 언급 ${row.mentions}회`}  ${row.author ? row.author + " · " : ""}${row.title.slice(0, 40)}`);
  items.push(row);
  await page.waitForTimeout(2000);
}
await browser.close();

mkdirSync(path.join(ROOT, "outputs"), { recursive: true });
const out = path.join(ROOT, "outputs", `reviews-raw-${id}.json`);
writeFileSync(out, JSON.stringify({ id, query, keywords: KW, searchUrl, collectedAt: new Date().toISOString().slice(0, 10), items }, null, 2), "utf8");
console.log(`\n→ ${path.relative(ROOT, out)}  (${items.filter((r) => !r.error).length}/${items.length} 건 본문 확보). 이제 Claude 에게 「reviews-raw 정리해」`);
