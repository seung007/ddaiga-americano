#!/usr/bin/env node
/**
 * 가이드 화면 비교 — 새 틀로 바꾼 글을 견본(start-running)과 같은 휴대폰 화면에서 나란히 잰다 (2026-11-18)
 *
 *   npm run dev                                   # 다른 창에서 먼저
 *   npm run guide:compare -- first-10k            # http://localhost:3000
 *   npm run guide:compare -- first-10k --base http://localhost:3111
 *
 * 왜: 검사(check:geo)는 부품이 있는지만 본다. 오늘 견본에서 「글이 길다」「FAQ 가 본문과 겹친다」는
 * 화면을 보고서야 잡혔다. 그래서 글마다 같은 자로 재서 견본과 다른 곳만 표시한다.
 * 결과: 표(터미널) + shots/compare-<글>-첫두화면.png · shots/compare-start-running-첫두화면.png — Claude 가 이미지로 읽고 판단한다.
 *
 * 「살펴볼 것」 기준은 견본에서 잰 값을 바탕으로 사이트가 정한 것이다(연구 근거 아님). 걸리면 실패가 아니라 사람이 보고 정한다.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
const bi = args.indexOf("--base");
const BASE = bi >= 0 ? args[bi + 1] : "http://localhost:3000";
if (!slug) { console.error("사용법: npm run guide:compare -- <글 이름> [--base http://localhost:3000]"); process.exit(2); }
const SHOTS = path.resolve(import.meta.dirname, "../shots");
mkdirSync(SHOTS, { recursive: true });
const VW = { width: 390, height: 844 };

async function measure(page, s) {
  const res = await page.goto(`${BASE}/injury/${s}`, { waitUntil: "networkidle" });
  if (!res || res.status() !== 200) throw new Error(`${s}: HTTP ${res?.status()} — 개발 서버가 켜져 있는지, 글 이름이 맞는지 확인`);
  await page.screenshot({ path: path.join(SHOTS, `compare-${s}-첫두화면.png`), clip: { x: 0, y: 0, width: VW.width, height: VW.height * 2 } });
  return page.evaluate((vh) => {
    const a = document.querySelector("article") || document.querySelector("main");
    const flat = (t) => (t || "").replace(/\s+/g, "");
    const h2s = [...a.querySelectorAll("h2")].filter((h) => /^\d+\./.test(h.innerText.trim()));
    const secs = h2s.map((h) => {
      let n = h.nextElementSibling, chars = 0, end = h.getBoundingClientRect().bottom;
      while (n && n.tagName !== "H2" && !n.querySelector?.("h2")) { chars += flat(n.innerText).length; end = n.getBoundingClientRect().bottom; n = n.nextElementSibling; }
      return { title: h.innerText.replace(/\s+/g, " ").slice(0, 24), chars, screens: (end - h.getBoundingClientRect().top) / vh };
    });
    const sourcesTop = [...a.querySelectorAll("details")].pop()?.getBoundingClientRect().top ?? a.getBoundingClientRect().bottom;
    const bodyEnd = sourcesTop + scrollY;
    const strongs = [...a.querySelectorAll("strong")].filter((x) => !x.closest("details")).length;
    // FAQ 는 「자주 묻는 질문」 제목이 든 묶음 안의 접힘만 센다(목차·출처도 접힘이라 전체를 세면 틀린다)
    const faqH = [...a.querySelectorAll("h2")].find((h) => /자주 묻는 질문/.test(h.innerText));
    const faq = faqH ? faqH.parentElement.querySelectorAll("details").length : 0;
    return {
      screens: (bodyEnd - (a.getBoundingClientRect().top + scrollY)) / vh,
      bodyChars: secs.reduce((n, x) => n + x.chars, 0),
      questions: secs.length,
      longest: secs.reduce((m, x) => (x.screens > m.screens ? x : m), { screens: 0, title: "-" }),
      strongs,
      faq: Math.max(0, faq),
      keypoints: !!a.querySelector("ol") && /요약/.test(a.innerText.slice(0, 400)),
      images: a.querySelectorAll("img, svg[role=img], figure").length,
    };
  }, VW.height);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: VW, deviceScaleFactor: 2 });
let ref, cur;
try {
  ref = await measure(page, "start-running");
  cur = await measure(page, slug);
} catch (e) {
  console.error(`실패: ${e.message}`);
  await browser.close();
  process.exit(1);
}
await browser.close();

const f1 = (n) => n.toFixed(1);
const rows = [
  ["본문 화면 수(출처 앞까지)", f1(ref.screens), f1(cur.screens), cur.screens > ref.screens * 1.3 ? "견본보다 30% 넘게 김 — 겹치는 내용·곁가지 확인" : ""],
  ["질문 절 글자 수", ref.bodyChars, cur.bodyChars, ""],
  ["큰 질문 수", ref.questions, cur.questions, cur.questions < 4 || cur.questions > 6 ? "틀은 4~6개" : ""],
  ["가장 긴 절(화면)", `${f1(ref.longest.screens)} ${ref.longest.title}`, `${f1(cur.longest.screens)} ${cur.longest.title}`, cur.longest.screens > 2.5 ? "한 절이 2.5화면 넘음 — 나누거나 줄이기" : ""],
  ["굵은 글씨 수", ref.strongs, cur.strongs, cur.strongs > ref.strongs * 1.5 ? "굵은 글씨가 많음 — 할 일·핵심 숫자만" : ""],
  ["FAQ 문항", ref.faq, cur.faq, cur.faq < 3 ? "3문항 이상" : ""],
  ["3줄 요약", ref.keypoints ? "있음" : "없음", cur.keypoints ? "있음" : "없음", cur.keypoints ? "" : "없음"],
  ["그림", ref.images, cur.images, ""],
];
console.log(`\n${slug} ↔ 견본 start-running (휴대폰 ${VW.width}px, 1화면 ${VW.height}px)\n`);
for (const [k, a, b, note] of rows) console.log(`${note ? "△" : "·"} ${k.padEnd(18)} 견본 ${String(a).padEnd(22)} 이 글 ${String(b).padEnd(22)} ${note}`);
const flagged = rows.filter((r) => r[3]).length;
console.log(`\n살펴볼 것 ${flagged}개 · 첫 두 화면: shots/compare-${slug}-첫두화면.png · shots/compare-start-running-첫두화면.png`);
