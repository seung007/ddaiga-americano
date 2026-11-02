#!/usr/bin/env node
/**
 * 글 구조 검사 — 생성형 AI·검색이 답을 바로 찾을 수 있는 모양인지 (2026-11-02)
 *
 * 규칙 원본: AGENTS.md 「새 글·페이지 규칙」. 출발점은 hyun 님이 공유한 카드뉴스의 다섯 원칙
 * (질문형 제목 · 한 문단 한 내용 · 개념은 뜻부터 · 표/FAQ · 누가·언제). 원칙의 효과는 우리가 측정하지 않았다.
 * 그래서 이 검사는 「효과」가 아니라 **빠뜨림**만 잡는다 — 기계로 셀 수 있는 것만.
 *
 * 러닝 가이드 (app/injury/<글>/page.tsx, 목록 페이지 제외)
 *  ① FAQ(FaqSection) 3문항 이상
 *  ② ArticleJsonLd(구조화 데이터) + ArticleMeta(제목 아래 「최종 수정 · 작성」 한 줄)
 *  ③ 원장 lib/guide/articles.ts 에 그 글이 있고 updated 날짜가 있음 — 날짜는 원장에서만 나온다
 *  ④ 질문형 소제목(<h2> 가 「?」「~나요」「~까요」로 끝남) 1개 이상
 *     지금 없는 글은 DEBT 에 적어 둔다. 새 글은 DEBT 에 넣지 않는다. 고쳐서 통과하면 DEBT 에서 빼야 통과한다
 * 블로그 원고 (docs/블로그/네이버블로그_*.md · 블로그_*.md — 노트북에만 있다. .gitignore 대상)
 *  ⑤ 「최종 수정: YYYY-MM-DD」 줄 · 「## 자주 묻는 질문」 절 · 질문형 소제목 1개 이상
 *     규칙 이전(2026-11-02)에 쓴 원고는 LEGACY_POSTS — 이미 네이버에 올라간 글이라 새 규칙으로 막지 않는다.
 *     원고가 아닌 파일(발행_일정.md 등)은 보지 않는다
 *     2026-11-02 고침: 처음엔 폴더의 .md 전부를 봐서 노트북에서 기존 원고 15편 + 발행 일정이 41건으로 실패했다
 *     (샌드박스에는 원고 폴더가 없어 통과로 보였다)
 *
 * 「한 문단 한 내용」「개념은 뜻부터」는 기계로 판정하지 않는다 — 작성 규칙(AGENTS.md)으로만 지킨다.
 * 대회·러닝화 상세의 FAQ 는 데이터에서 자동으로 만들어진다(lib/faq.ts) — 여기서 보지 않는다.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const LIST_PAGES = new Set(["all", "topic"]);
/** 2026-11-02 기준 질문형 소제목이 없는 글. 고치면 여기서 뺀다 */
const DEBT = new Set(["hwang-young-jo", "knee-pain", "start-running"]);
/** 규칙 이전에 쓴 블로그 원고 (2026-11-02 노트북 목록). 새 원고는 여기 넣지 않는다 */
const LEGACY_POSTS = new Set([
  "네이버블로그_11월마라톤_2026-10-15.md", "네이버블로그_2편.md", "네이버블로그_3편_2026-09-15.md",
  "네이버블로그_3편_2026-09-22.md", "네이버블로그_글.md", "네이버블로그_무릎통증러닝화.md", "네이버블로그_미드풋.md",
  "네이버블로그_발타입러닝화.md", "네이버블로그_소개글.md", "네이버블로그_아라히8후기모음_2026-10-15.md",
  "네이버블로그_정강이통증.md", "네이버블로그_족저근막염러닝화.md", "네이버블로그_카본화입문자.md",
  "네이버블로그_한쪽무릎통증.md", "네이버블로그_호카브룩스비교.md",
]);
const POST_RE = /^(네이버블로그|블로그)_.+\.md$/;

const articles = readFileSync(path.join(ROOT, "lib/guide/articles.ts"), "utf8");
const errors = [];
const QUESTION = /(\?|나요|까요|인가요|할까|일까|는가)\s*$/;

const guideDir = path.join(ROOT, "app/injury");
let guides = 0;
for (const slug of readdirSync(guideDir)) {
  const file = path.join(guideDir, slug, "page.tsx");
  if (LIST_PAGES.has(slug) || slug.startsWith("[") || !existsSync(file)) continue;
  guides++;
  const s = readFileSync(file, "utf8");
  const bad = (m) => errors.push(`app/injury/${slug}: ${m}`);
  const faqCount = (s.match(/\bq:\s*["`']/g) || []).length;
  if (!s.includes("<FaqSection")) bad("FAQ(FaqSection) 없음");
  else if (faqCount < 3) bad(`FAQ ${faqCount}문항 — 3문항 이상`);
  if (!s.includes("<ArticleJsonLd")) bad("ArticleJsonLd 없음");
  if (!s.includes("<ArticleMeta")) bad("제목 아래 ArticleMeta(최종 수정 · 작성) 없음");
  const entry = articles.split("\n").find((l) => l.includes(`href: "/injury/${slug}"`));
  if (!entry) bad("원장 lib/guide/articles.ts 에 없음");
  else if (!/updated:\s*"\d{4}-\d{2}-\d{2}"/.test(entry)) bad("원장에 updated 날짜 없음");
  const h2 = [...s.matchAll(/<h2[^>]*>\s*([^<{]+)/g)].map((m) => m[1].trim());
  const q = h2.filter((h) => QUESTION.test(h)).length;
  if (q === 0 && !DEBT.has(slug)) bad("질문형 소제목(<h2> …?/~나요/~까요) 없음");
  if (q > 0 && DEBT.has(slug)) bad("질문형 소제목이 생겼으니 scripts/check-geo.mjs 의 DEBT 에서 빼세요");
}

const blogDir = path.join(ROOT, "docs/블로그");
let posts = 0, legacy = 0;
if (existsSync(blogDir)) {
  for (const name of readdirSync(blogDir).filter((n) => POST_RE.test(n.normalize("NFC")))) {
    if (LEGACY_POSTS.has(name.normalize("NFC"))) { legacy++; continue; }
    posts++;
    const s = readFileSync(path.join(blogDir, name), "utf8");
    const bad = (m) => errors.push(`docs/블로그/${name}: ${m}`);
    if (!/최종 수정:\s*\d{4}-\d{2}-\d{2}/.test(s)) bad("「최종 수정: YYYY-MM-DD」 줄 없음");
    if (!/^##\s*자주 묻는 질문/m.test(s)) bad("「## 자주 묻는 질문」 절 없음");
    if (![...s.matchAll(/^#{2,3}\s+(.+)$/gm)].some((m) => QUESTION.test(m[1].trim()))) bad("질문형 소제목 없음");
  }
}

if (errors.length) {
  console.error(`글 구조 검사 실패 ${errors.length}건 (규칙: AGENTS.md 「새 글·페이지 규칙」)`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log(`글 구조: 가이드 ${guides}편 · 새 블로그 원고 ${posts}편 통과 (질문형 소제목 보강 대기 ${DEBT.size}편 · 규칙 이전 원고 ${legacy}편 제외)`);
