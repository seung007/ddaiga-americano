#!/usr/bin/env node
/**
 * 목차 앵커 검사 — `<TableOfContents items>` 의 id 가 실제 `<h2 id>` 와 맞는지 본다.
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 만들었나 (2026-09-12)
 *
 * 목차를 서버 컴포넌트로 두면서 `id` 를 손으로 맞추게 됐다.
 * 그런데 **앵커는 틀려도 아무 일도 안 일어난다.**
 *
 *   · 404 가 안 난다
 *   · 콘솔 오류가 안 난다
 *   · `npm run shot` 캡처에도 안 보인다 (클릭해야 아는 일이다)
 *   · 그냥 눌러도 화면이 그대로다
 *
 * 이 저장소가 반복해서 당한 바로 그 형태다 — **조용한 실패.**
 * 제휴 링크가 뒤바뀌어도 화면이 멀쩡했던 것, `check:cdn` 이 URL 을 못 보고
 * 통과를 찍던 것과 같다. 그래서 만들자마자 검사를 붙인다.
 *
 * 반대 방향도 본다: `<h2 id>` 를 달아 놓고 목차에 안 넣은 경우.
 * 그건 실패는 아니지만 **목차가 불완전하다**는 신호라 알림만 낸다.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { stripComments } from "./lib/strip-comments.mjs";

const ROOT = process.cwd();

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith(".tsx")) out.push(p);
  }
  return out;
}

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;

const broken = [];
const unlisted = [];
const skipped = [];
let pages = 0;

for (const f of walk(join(ROOT, "app"))) {
  const raw = readFileSync(f, "utf8");
  if (!raw.includes("<TableOfContents")) continue;
  const rel = relative(ROOT, f).replace(/\\/g, "/");
  pages++;

  // 주석 안의 예시 id 를 세지 않는다 — 이 저장소에서 세 번 당한 실수다.
  const src = stripComments(raw);

  /**
   * ⚠️ 2026-09-12 — **처음 만들자마자 오탐을 냈다.**
   *
   * `/tier-list` 는 목차 항목도 제목 id 도 **데이터에서 생성한다**:
   *   items={[...GROUPS.map((g) => ({ id: g.id, ... }))]}
   *   <h2 id={g.id}>
   * 정규식은 둘 다 못 본다. 그런데 소스 어딘가에 있던 `{ id: "racing", label: ... }`
   * (분류 규칙 정의)를 **목차 항목으로 잘못 읽고** 4건을 실패로 신고했다.
   *
   * 즉 **한쪽만 보이는 상태**였다 — 원하는 id 는 (엉뚱하게) 잡고 실제 id 는 못 잡았다.
   * 그 조합은 반드시 오탐을 만든다.
   *
   * 이 저장소의 규칙: **범위를 넓히면 오탐부터 잡아라.**
   * 오탐이 남은 검사는 사람이 곧 무시하고, 그러면 검사가 없는 것과 같다.
   *
   * 그래서 **id 를 동적으로 만드는 페이지는 판정하지 않고 그렇게 말한다.**
   * "판정 불가"를 "통과"로 위장하지 않는다.
   */
  const dynamicHeading = /<h[1-6][^>]*\sid=\{/.test(src);
  const dynamicItems = /\bid:\s*[A-Za-z_$][\w$.]*\s*,\s*label:/.test(src);
  if (dynamicHeading || dynamicItems) {
    skipped.push({ rel, why: dynamicHeading ? "제목 id 가 동적" : "목차 항목이 동적" });
    continue;
  }

  // 목차가 가리키는 id
  const wanted = [...src.matchAll(/\{\s*id:\s*"([^"]+)"\s*,\s*label:/g)].map((m) => m[1]);
  // 실제로 달려 있는 id
  const have = new Set([...src.matchAll(/<h[1-6][^>]*\sid="([^"]+)"/g)].map((m) => m[1]));

  for (const id of wanted) {
    if (!have.has(id)) broken.push({ rel, id });
  }
  for (const id of have) {
    if (!wanted.includes(id)) unlisted.push({ rel, id });
  }
}

if (pages === 0) {
  console.log(dim("목차를 쓰는 페이지가 없습니다."));
  process.exit(0);
}

if (broken.length) {
  console.log(red(`\n목차가 없는 곳을 가리킵니다 — ${broken.length}건\n`));
  for (const b of broken) console.log(`  ✗ ${b.rel}  →  #${b.id}  (그런 id 의 제목이 없음)`);
  console.log(
    dim("\n  앵커는 틀려도 404 도 콘솔 오류도 안 납니다. 눌러도 아무 일이 안 일어날 뿐입니다.\n")
  );
  process.exit(1);
}

if (skipped.length) {
  console.log(yellow(`판정 불가 ${skipped.length}개 — id 를 코드에서 만드는 페이지`));
  for (const s2 of skipped) console.log(dim(`  · ${s2.rel}  (${s2.why})`));
  console.log(dim("  정규식으로는 못 봅니다. 통과로 위장하지 않고 그대로 적습니다.\n"));
}
if (unlisted.length) {
  console.log(yellow(`목차에 안 들어간 제목 ${unlisted.length}개`));
  for (const u of unlisted) console.log(dim(`  · ${u.rel}  #${u.id}`));
  console.log(dim("  실패는 아닙니다. 일부러 뺀 것이면 그대로 두세요.\n"));
}

console.log(green(`통과 — 목차 ${pages}개 페이지 중 ${pages - skipped.length}개 검사, 앵커 전부 연결됨`));
