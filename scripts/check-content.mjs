#!/usr/bin/env node
/**
 * 내용 파일 가이드 검사 — lib/guide/content/<slug>.json (2026-11-07)
 *
 * 무엇을 막나: 틀(components/guide/GuideArticle.tsx)이 그리기 전에, 글 양식(AGENTS.md 「새 글·페이지 규칙」·계획 문서
 * 「글 양식」)에서 **기계로 셀 수 있는 빠뜨림**. 문장이 출처와 맞는지는 여기서 보지 않는다 — 그건 비공개 저장소의
 * 검증기(ddaiga-pipeline pipeline/verify, 판정 2회 + 숫자·서지 대조)가 하고, 저자·연도는 verify-citations 가 본다.
 *
 *  ① 원장(lib/guide/articles.ts)에 그 글 줄이 있고 updated 날짜가 있다 · 같은 주소의 손으로 쓴 폴더가 없다
 *  ② 소제목 3~6개, 모두 질문형 · 소제목마다 답 첫 문장 · 「한눈에」 3~4줄 · FAQ 3~6문항 · 표 1개 이상
 *  ③ **숫자가 든 문장은 출처(cite)나 「저희 제안」(basis: rule) 표시가 있다** — 출처 없는 숫자를 막는다(AGENTS 출처 규칙 1).
 *     주의 박스(warn)·단서(note)의 숫자는 보지 않는다(119·응급 기준은 안전 문구)
 *  ④ cite 가 가리키는 참고 문헌이 있고, 참고 문헌은 모두 어딘가에서 쓰인다 · 주소는 PubMed·PMC·DOI 만
 *  ⑤ 본문 링크는 내부 경로만, 그 경로가 실제로 있다 · 이어서 볼 글 2개가 원장에 있다
 *  ⑥ 부상·통증 글은 주의 박스(멈출 신호·진료 신호)가 있다
 *  ⑦ 만든 방법(made) — AI 초안이면 대조 날짜와 검증기 이름
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIR = path.join(ROOT, "lib/guide/content");
const QUESTION = /(\?|나요|까요|인가요|할까|일까|는가)\s*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const REF_URL = /^https:\/\/(pubmed\.ncbi\.nlm\.nih\.gov\/\d+\/?|pmc\.ncbi\.nlm\.nih\.gov\/articles\/PMC\d+\/?|doi\.org\/10\.\S+)$/;
const TYPES = new Set(["injury", "concept", "race-prep", "training", "compare"]);
const articles = readFileSync(path.join(ROOT, "lib/guide/articles.ts"), "utf8");
const errors = [];

/** 숫자가 들었나 — 「1편」 같은 군더더기도 숫자다. 서지(권·쪽)는 본문에 쓰지 않으니 따로 빼지 않는다 */
const hasNumber = (t) => /\d/.test(t.replace(/\]\(\/[^)]*\)/g, "]").replace(/[A-Za-z]+\d+/g, "")); // VT1·LT2·H7 같은 이름은 숫자로 안 본다
const routeExists = (p) => {
  const clean = p.split("#")[0].replace(/\/$/, "");
  if (existsSync(path.join(ROOT, "app", clean, "page.tsx"))) return true;
  const m = clean.match(/^\/injury\/([a-z0-9-]+)$/);
  return !!m && existsSync(path.join(DIR, `${m[1]}.json`));
};

const files = existsSync(DIR) ? readdirSync(DIR).filter((f) => f.endsWith(".json")) : [];
for (const f of files) {
  const slug = f.slice(0, -5);
  const bad = (m) => errors.push(`lib/guide/content/${f}: ${m}`);
  let c;
  try {
    c = JSON.parse(readFileSync(path.join(DIR, f), "utf8"));
  } catch (e) {
    bad(`JSON 이 아님 — ${e.message}`);
    continue;
  }
  if (!/^[a-z0-9-]+$/.test(slug)) bad("파일 이름은 영문 소문자·숫자·- 만 (주소가 된다)");

  // ①
  const entry = articles.split("\n").find((l) => l.includes(`href: "/injury/${slug}"`));
  if (!entry) bad("원장 lib/guide/articles.ts 에 줄이 없음 — 제목·설명·태그·날짜는 원장에만 적는다");
  else if (!/updated:\s*"\d{4}-\d{2}-\d{2}"/.test(entry)) bad("원장에 updated 날짜 없음");
  if (existsSync(path.join(ROOT, "app/injury", slug))) bad(`app/injury/${slug} 폴더가 이미 있음 — 같은 주소의 글이 둘`);

  // ②
  if (!TYPES.has(c.type)) bad(`type 은 ${[...TYPES].join("·")} 중 하나`);
  const secs = c.sections ?? [];
  if (secs.length < 3 || secs.length > 6) bad(`소제목 ${secs.length}개 — 3~6개`);
  const ids = new Set();
  for (const s of secs) {
    if (!QUESTION.test(s.q ?? "")) bad(`질문형이 아닌 소제목 「${s.q}」`);
    if (!s.answer?.trim()) bad(`「${s.q}」 아래 첫 문장(answer) 없음`);
    if (!/^[a-z0-9-]+$/.test(s.id ?? "") || ids.has(s.id)) bad(`소제목 id 「${s.id}」 — 영문 소문자, 겹치지 않게`);
    ids.add(s.id);
  }
  if ((c.summary ?? []).length < 3 || c.summary.length > 4) bad(`「한눈에」 ${(c.summary ?? []).length}줄 — 3~4줄`);
  if ((c.faq ?? []).length < 3 || c.faq.length > 6) bad(`FAQ ${(c.faq ?? []).length}문항 — 3~6문항`);
  const blocks = secs.flatMap((s) => s.blocks ?? []);
  if (!blocks.some((b) => b.table)) bad("표 없음 — 1개 이상(근거 있는 열만)");
  if (c.type === "injury" && !blocks.some((b) => b.warn)) bad("부상·통증 글인데 주의 박스(warn: 멈출 신호·진료 신호) 없음");

  // ③ ④ 문장 하나하나
  const refIds = new Set((c.references ?? []).map((r) => r.id));
  const used = new Set();
  const texts = []; // [위치, 글, cite, basis, 숫자 검사 여부]
  for (const s of c.summary ?? []) texts.push(["한눈에", s.t, s.cite, s.basis, true]);
  texts.push(["첫 문단", c.lead ?? "", undefined, undefined, true]);
  for (const s of secs) {
    texts.push([`「${s.q}」 답`, s.answer ?? "", s.cite, s.basis, true]);
    for (const b of s.blocks ?? []) {
      if (b.p !== undefined) texts.push([`「${s.q}」 문단`, b.p, b.cite, b.basis, true]);
      else if (b.todo) for (const t of b.todo) texts.push([`「${s.q}」 할 일`, t.t, t.cite, t.basis, true]);
      else if (b.table) {
        b.table.rows.forEach((row, r) =>
          // 첫 열은 줄 이름(「30세」 「1구간」)이라 숫자 검사를 하지 않는다. 값은 둘째 열부터
          row.forEach((cell, i) => texts.push([`「${s.q}」 표 ${r + 1}행 ${i + 1}열`, cell.t, cell.cite, cell.basis, i > 0])),
        );
      } else if (b.evidence) {
        for (const e of b.evidence) {
          if (!e.cite?.length) bad(`「${s.q}」 근거 문단에 출처 없음 — 「${e.t.slice(0, 30)}…」`);
          texts.push([`「${s.q}」 근거`, e.t, e.cite, undefined, true]);
        }
      } else if (b.note !== undefined) texts.push([`「${s.q}」 단서`, b.note, undefined, undefined, false]);
      else if (b.warn) for (const t of b.warn.items) texts.push([`「${s.q}」 주의`, t, undefined, undefined, false]);
      else bad(`「${s.q}」 알 수 없는 블록 ${JSON.stringify(b).slice(0, 40)}`);
    }
  }
  for (const q of c.faq ?? []) texts.push([`FAQ 「${q.q}」`, q.a, q.cite, undefined, true]);

  for (const [where, t, cite, basis, numbers] of texts) {
    for (const id of cite ?? []) {
      if (!refIds.has(id)) bad(`${where}: 없는 참고 문헌 ${id}`);
      used.add(id);
    }
    if (numbers && hasNumber(t) && !(cite?.length) && basis !== "rule")
      bad(`${where}: 숫자가 있는데 출처(cite)도 「저희 제안」(basis: rule)도 없음 — 「${t.slice(0, 40)}」`);
    if (/\]\((?!\/)/.test(t)) bad(`${where}: 본문 바깥 링크 — 출처는 참고 문헌으로`);
    for (const m of t.matchAll(/\]\((\/[^)\s]*)\)/g)) if (!routeExists(m[1])) bad(`${where}: 없는 경로 ${m[1]}`);
  }
  for (const r of c.references ?? []) {
    if (!used.has(r.id)) bad(`참고 문헌 ${r.id} 를 쓰는 문장이 없음`);
    if (!REF_URL.test(r.url ?? "")) bad(`참고 문헌 ${r.id} 주소는 PubMed·PMC·DOI 만 — ${r.url}`);
    if (!/^(19|20)\d{2}$/.test(r.year ?? "")) bad(`참고 문헌 ${r.id} 연도 「${r.year}」`);
    if (!r.authors?.trim() || !r.note?.trim()) bad(`참고 문헌 ${r.id} 저자·한 줄 설명 없음`);
  }

  // ⑤
  if ((c.related ?? []).length !== 2) bad("이어서 볼 글(related) 2개");
  for (const h of c.related ?? []) if (!articles.includes(`href: "${h}"`)) bad(`이어서 볼 글 ${h} 가 원장에 없음`);

  // ⑦
  if (!["ai-draft", "human"].includes(c.made?.by)) bad("made.by 는 ai-draft 또는 human");
  if (!DATE.test(c.made?.verified ?? "")) bad("made.verified — 출처 원문과 대조한 날짜");
  if (c.made?.by === "ai-draft" && !c.made?.checker) bad("AI 초안이면 made.checker(검증기 이름·판정 횟수)");
}

if (errors.length) {
  console.log(`\x1b[31m내용 파일 가이드 ${errors.length}건\x1b[0m`);
  for (const e of errors) console.log("  " + e);
  process.exit(1);
}
console.log(`\x1b[32m내용 파일 가이드 ${files.length}편 통과\x1b[0m`);
