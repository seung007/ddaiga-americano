#!/usr/bin/env node
/**
 * 제휴 링크 확인표 — **어느 링크가 어느 신발인지 사람이 30초에 확인하는 화면**
 *
 *   npm run check:affiliate          터미널에 요약
 *   npm run check:affiliate:sheet    outputs/affiliate-check.html 생성
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 만들었나 (2026-09-08)
 *
 * 쿠팡 파트너스 링크는 `link.coupang.com/a/gSElJNk9Js` 형태다.
 * **주소에 어느 상품인지가 안 적혀 있다.** 그래서 신발과 링크를 짝지은 근거가
 * 코드에 남지 않는다 — 내가 넣은 근거는 "대화에서 이 순서로 주고받았다"뿐이었다.
 *
 * 뒤바뀌면 어떻게 되나: 아드레날린 페이지의 쿠팡 버튼이 **본디 검색 결과**로 간다.
 * 화면은 멀쩡하고, 링크는 200 으로 열리고, `check:links` 도 통과한다.
 * 방문자만 엉뚱한 상품을 본다. **이 저장소가 반복해서 당한 조용한 실패다.**
 *
 * ⚠️ Claude 는 이걸 대신 확인할 수 없다.
 * `coupang.com` 과 `link.coupang.com` 이 **안전 제한으로 차단**돼 있고(2026-09-08 실측),
 * 우회 수단은 쓰지 않는다. 그래서 이 확인은 **사람이 하는 일**이다.
 * 대신 그 일을 최대한 짧게 만든다 — 링크와 기대 검색어를 한 화면에 나란히 둔다.
 *
 * 이 설계는 `image-sheet.mjs` 와 같다. 기계가 못 하는 판정을 흉내내지 않고,
 * 사람이 1분 안에 끝내도록 화면을 만든다.
 *
 * 확인하면 `lib/shoes/affiliate.ts` 의 `verifiedAt` 에 날짜를 적는다.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { stripComments } from "./lib/strip-comments.mjs";

/**
 * ⚠️ `new URL(import.meta.url).pathname` 을 쓰지 마라 — **윈도우에서 깨진다.**
 *
 * 2026-09-09: 처음에 이렇게 썼다.
 *   const ROOT = resolve(dirname(new URL(import.meta.url).pathname), "..");
 *
 * 리눅스에서는 `/sessions/.../scripts` 라 잘 돌아간다. 윈도우에서는
 * `pathname` 이 **`/C:/planing/.../scripts`** — 앞에 슬래시가 붙는다.
 * 거기에 `resolve` 를 걸면 이렇게 된다:
 *
 *   Error: ENOENT: no such file or directory,
 *   open 'C:\C:\planing\ddaiga-americano\lib\shoes\affiliate.ts'
 *
 * **내 실행 환경(리눅스)에서는 절대 안 걸리는 버그다.** hyun 님은 윈도우에서
 * 돌리므로 `npm run ship` 이 검사 단계에서 멈췄다. 내가 "검사 11개 통과"를
 * 확인하고 넘긴 직후였다 — **통과를 봤다는 것이 상대 환경의 통과는 아니다.**
 *
 * 이 저장소의 다른 스크립트 8개는 전부 `import.meta.dirname` 을 쓴다.
 * 새 스크립트를 쓸 때 기존 것을 보고 맞추면 이 실수는 안 난다.
 */
const ROOT = resolve(import.meta.dirname, "..");
const AFF = join(ROOT, "lib", "shoes", "affiliate.ts");
const DATA = join(ROOT, "lib", "shoes", "data.ts");
const OUT_DIR = join(ROOT, "outputs");
const OUT = join(OUT_DIR, "affiliate-check.html");

const SHEET = process.argv.includes("--sheet");

const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;

// ── 등록된 링크 읽기 ────────────────────────────────────────
// 주석을 걷고 읽는다 — 주석 안의 예시 링크를 등록된 것으로 세면 안 된다.
// 2026-09-08 에 같은 실수를 세 번 했다(`scripts/lib/strip-comments.mjs` 주석 참고).
const affSrc = stripComments(readFileSync(AFF, "utf8"));

const entries = [];
{
  const re =
    /"([a-z0-9-]+)":\s*\{\s*url:\s*"([^"]+)",\s*sourceQuery:\s*"([^"]+)",\s*addedAt:\s*"([^"]+)",\s*verifiedAt:\s*(null|"[^"]*")/g;
  for (const m of affSrc.matchAll(re)) {
    entries.push({
      id: m[1],
      url: m[2],
      sourceQuery: m[3],
      addedAt: m[4],
      verifiedAt: m[5] === "null" ? null : m[5].slice(1, -1),
    });
  }
}

// ── 신발 이름 붙이기 ────────────────────────────────────────
const dataSrc = stripComments(readFileSync(DATA, "utf8"));
const marks = [...dataSrc.matchAll(/\n    id: "([^"]+)",/g)];
const nameOf = new Map();
for (let i = 0; i < marks.length; i++) {
  const block = dataSrc.slice(marks[i].index, marks[i + 1]?.index ?? dataSrc.length);
  const brand = /brand:\s*"([^"]+)"/.exec(block)?.[1] ?? "?";
  const model = /model:\s*"([^"]+)"/.exec(block)?.[1] ?? "?";
  nameOf.set(marks[i][1], `${brand} ${model}`);
}

for (const e of entries) e.name = nameOf.get(e.id) ?? `(data.ts 에 없는 id: ${e.id})`;

// ── 터미널 보고 ─────────────────────────────────────────────
const unknownId = entries.filter((e) => !nameOf.has(e.id));
const unverified = entries.filter((e) => !e.verifiedAt);

console.log(`\n제휴 링크 ${entries.length}개`);
for (const e of entries) {
  const mark = e.verifiedAt ? green("✓") : yellow("?");
  console.log(
    `  ${mark} ${e.name.padEnd(28)} ${dim(e.url.replace("https://link.coupang.com/a/", ".../"))}`
  );
  console.log(`      ${dim(`기대 검색어: ${e.sourceQuery}`)}`);
}

if (unknownId.length) {
  console.log(red(`\n${unknownId.length}개가 data.ts 에 없는 신발 id 입니다`));
  for (const e of unknownId) console.log(`  ✗ ${e.id}`);
  process.exit(1);
}

if (unverified.length) {
  console.log(yellow(`\n확인 안 된 링크 ${unverified.length}개`));
  console.log(
    dim("  링크 주소에는 상품 정보가 없습니다. 클릭해서 기대 검색어의 결과가 나오는지")
  );
  console.log(dim("  봐야 알 수 있고, Claude 는 쿠팡 도메인이 차단돼 대신 못 합니다."));
  console.log(dim("\n  npm run check:affiliate:sheet   ← 한 화면에서 확인하기"));
} else if (entries.length) {
  console.log(green("\n전부 확인됨"));
}

// ── 확인용 화면 ─────────────────────────────────────────────
if (!SHEET) {
  console.log("");
  process.exit(0);
}

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const rows = entries
  .map(
    (e) => `
  <li class="${e.verifiedAt ? "ok" : "todo"}">
    <div class="head">
      <b>${esc(e.name)}</b>
      ${e.verifiedAt ? `<em class="ok">확인됨 ${esc(e.verifiedAt)}</em>` : `<em class="todo">확인 필요</em>`}
    </div>
    <p class="q">이 링크를 열면 <b>&ldquo;${esc(e.sourceQuery)}&rdquo;</b> 검색 결과가 나와야 합니다.</p>
    <a class="go" href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">열어서 확인 ↗</a>
    <code>${esc(e.url)}</code>
    <p class="fix">맞으면 <code>lib/shoes/affiliate.ts</code> 의 <code>"${esc(e.id)}"</code> 항목에서
      <code>verifiedAt: null</code> → <code>verifiedAt: "${new Date().toISOString().slice(0, 10)}"</code></p>
  </li>`
  )
  .join("");

const html = `<!doctype html>
<meta charset="utf-8">
<title>제휴 링크 확인 — ${entries.length}개</title>
<style>
  body{font:15px/1.6 -apple-system,"Segoe UI",system-ui,sans-serif;margin:0;padding:24px;background:#fafafa;color:#111}
  h1{margin:0 0 4px;font-size:22px}
  .lead{color:#555;max-width:72ch;margin:0 0 20px}
  .lead b{color:#111}
  ul{list-style:none;padding:0;margin:0;display:grid;gap:14px;max-width:70ch}
  li{background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:16px}
  li.todo{border-color:#f59e0b;background:#fffbeb}
  li.ok{opacity:.6}
  .head{display:flex;align-items:baseline;justify-content:space-between;gap:12px}
  .head b{font-size:16px}
  em{font-style:normal;font-size:12px;font-weight:700;white-space:nowrap}
  em.todo{color:#b45309}
  em.ok{color:#059669}
  .q{margin:8px 0 12px;font-size:14px;color:#374151}
  a.go{display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:8px 16px;border-radius:8px}
  code{display:block;margin-top:8px;font-size:11px;color:#9ca3af;word-break:break-all}
  .fix{margin:10px 0 0;font-size:12px;color:#6b7280}
  .fix code{display:inline;font-size:12px;color:#374151;background:#f3f4f6;padding:1px 4px;border-radius:3px}
  .note{margin:24px 0 0;padding:14px 16px;border-left:3px solid #f59e0b;background:#fffbeb;font-size:14px;max-width:72ch}
</style>
<h1>제휴 링크 확인 — ${entries.length}개</h1>
<p class="lead">
  쿠팡 파트너스 링크(<code style="display:inline">link.coupang.com/a/…</code>)에는
  <b>어느 상품인지가 적혀 있지 않습니다.</b> 그래서 신발과 링크가 뒤바뀌어도
  화면은 멀쩡하고 검사기도 통과합니다 — 방문자만 엉뚱한 상품을 봅니다.<br><br>
  각 링크를 열어서 <b>기대 검색어의 결과가 나오는지</b>만 보시면 됩니다.
</p>
<ul>${rows}</ul>
<p class="note">
  <b>Claude 는 이 확인을 대신 못 합니다.</b> <code style="display:inline">coupang.com</code> 과
  <code style="display:inline">link.coupang.com</code> 이 안전 제한으로 차단돼 있고,
  우회 수단은 쓰지 않습니다. 그래서 이 화면을 만들었습니다.<br><br>
  뒤바뀌었다면 <code style="display:inline">lib/shoes/affiliate.ts</code> 에서 두 항목의
  <code style="display:inline">url</code> 값을 서로 바꾸세요.
</p>
`;

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`\n확인 화면을 만들었습니다`);
console.log(`  ${OUT}`);
console.log(dim(`  브라우저로 열어서 링크 ${unverified.length}개만 눌러보시면 됩니다.\n`));
