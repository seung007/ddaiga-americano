#!/usr/bin/env node
/**
 * 가이드 읽기 구조 검사 (2026-10-13 가독성 재설계와 같이 만듦)
 *
 * 재설계로 「근거 보기」(<Evidence>)·참고 문헌(<References>)·허브 단계 카드가 **기본 접힘**이 됐다.
 * 접힘은 조용히 실패한다 — 안전 문장이 접혀 들어가도, 개수가 틀려도, 앵커가 사라져도 화면은 멀쩡하다.
 * council 검토(Steward·Dev)가 짚은 네 가지를 막는다.
 *
 *   ① 실패: <Evidence> 안에 안전 문장(멈추·진료·119·병원·응급) — 안전 정보는 접지 않는다
 *   ② 실패: <References n={N}> 의 N 과 안의 <li> 개수가 다르다
 *   ③ 실패: <Evidence n={N}> 의 N 과 안의 서로 다른 출처 URL 개수가 다르다
 *   ④ 실패: 다른 파일이 가리키는 /injury#앵커 가 허브에 없다(접힌 단계 카드 id 포함)
 *   ⑤ 알림: <Evidence> 안에 단서(단순화·표본이 작·탐색적·…가 아니고) — <Note> 로 본문에 꺼낼지 보라
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { stripComments } from "./lib/strip-comments.mjs";

const ROOT = process.cwd();
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name.startsWith(".")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx|ts)$/.test(name)) out.push(p);
  }
  return out;
}
const lineOf = (src, idx) => src.slice(0, idx).split("\n").length;

const fails = [];
const notes = [];
const files = [...walk(join(ROOT, "app")), ...walk(join(ROOT, "components")), ...walk(join(ROOT, "lib"))];

const SAFETY = /멈추|멈춥|멈춰|진료|(?<!\d)119(?!\d)|병원|응급/;
const CAVEAT = /단순화|표본이 작|탐색적|모은 연구가 아니|대상이 아니|엇갈/;

for (const f of files) {
  const src = stripComments(readFileSync(f, "utf8")); // 머리말 주석의 「<Evidence> 안으로」 같은 글이 잡히지 않게
  const rel = relative(ROOT, f);
  if (rel === "components/guide/Read.tsx") continue;

  for (const m of src.matchAll(/<Evidence\b([^>]*)>([\s\S]*?)<\/Evidence>/g)) {
    const [, attrs, body] = m;
    const at = `${rel}:${lineOf(src, m.index)}`;
    const text = body.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
    // URL 안 숫자(PMID 11916889 의 「119」)가 잡히지 않게 주소를 지우고 본다 — 롤아웃 중 실제 오탐 2건
    const s = text.replace(/https?:\/\/[^"\s]+/g, "").match(SAFETY);
    if (s) fails.push(`${at}  근거(접힘) 안에 안전 문장 「${s[0]}」 — 본문이나 <Warn> 으로`);
    const c = text.match(CAVEAT);
    if (c) notes.push(`${at}  근거(접힘) 안에 단서 「${c[0]}」 — 지시가 본문에 있다면 <Note> 로 꺼낼 것`);
    const n = attrs.match(/\bn=\{(\d+)\}/);
    if (n) {
      const urls = new Set([...text.matchAll(/h(?:ref)?="(https?:[^"]+)"/g)].map((x) => x[1]));
      if (Number(n[1]) !== urls.size) fails.push(`${at}  <Evidence n={${n[1]}}> 인데 출처 URL ${urls.size}개`);
    }
  }

  for (const m of src.matchAll(/<References\b([^>]*)>([\s\S]*?)<\/References>/g)) {
    const [, attrs, body] = m;
    const n = attrs.match(/\bn=\{(\d+)\}/);
    const li = (body.match(/<li[\s>]/g) || []).length;
    if (n && Number(n[1]) !== li) fails.push(`${rel}:${lineOf(src, m.index)}  <References n={${n[1]}}> 인데 항목 ${li}개`);
  }
}

// ④ 허브 앵커
const hub = readFileSync(join(ROOT, "app/injury/page.tsx"), "utf8");
const stages = readFileSync(join(ROOT, "lib/guide/stages.ts"), "utf8");
const ids = new Set([...hub.matchAll(/\bid="([^"]+)"/g)].map((x) => x[1]));
if (hub.includes("id={`stage-${s.id}`}")) {
  const block = stages.slice(stages.indexOf("export const STAGES"));
  for (const x of block.matchAll(/^\s{4}id: "([^"]+)"/gm)) ids.add(`stage-${x[1]}`);
}
for (const f of files) {
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(/["'`]\/injury#([\w-]+)/g)) {
    if (!ids.has(m[1])) fails.push(`${relative(ROOT, f)}:${lineOf(src, m.index)}  /injury#${m[1]} — 허브에 그 id 가 없음`);
  }
}

for (const n of notes) console.log(yellow("알림 ") + n);
if (fails.length) {
  for (const f of fails) console.log(red("실패 ") + f);
  console.log(red(`\n가이드 읽기 구조 ${fails.length}건 실패`));
  process.exit(1);
}
console.log(green(`가이드 읽기 구조 통과`) + ` (허브 앵커 ${ids.size}개, 알림 ${notes.length})`);
