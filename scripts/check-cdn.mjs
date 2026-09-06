#!/usr/bin/env node
/**
 * 손으로 꽂는 외부 CDN 스크립트를 금지한다.
 *
 * 왜 (2026-09-07)
 * ──────────────
 * 코스 페이지의 지도 4개 중 3개가 안 떴다. 남는 화면은 "지도 불러오는 중…" 한 줄.
 * 실측하니:
 *   · leaflet.min.js 요청은 **200으로 성공**했다 (37KB, 417ms).
 *   · 그런데 `window.L` 은 undefined 였고, 내가 head 에 넣은 <script> 태그는
 *     **DOM 에서 사라져 있었다.** 실행되기 전에 치워진 것이다.
 *   · 그러면 onload 도 onerror 도 안 와서 Promise 가 영원히 pending 이다.
 *     **영원한 로딩 표시는 오류보다 나쁘다** — 기다리면 될 것처럼 보인다.
 *
 * 원인은 React 가 관리하는 문서에 내가 직접 노드를 꽂았다는 것이다.
 * npm 의존성 + `await import()` 로 바꾸면 번들러가 코드 분할까지 해주고,
 * 이 경쟁 자체가 사라진다.
 *
 * 그래서 이 검사는 **cdnjs·unpkg·jsdelivr 를 코드에 적는 것을 막는다.**
 * 예외가 필요하면 ALLOW 에 이유와 함께 적는다. 이유 없이는 통과하지 않는다.
 *
 * 참고 — 이 저장소의 기존 교훈과 같은 종류다: **"차단도 결품도 200으로 온다."**
 * 상태코드만 보고 성공으로 읽으면 이 실패는 안 보인다.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const DIRS = ["app", "components", "lib"];
const CDN = /(cdnjs\.cloudflare\.com|unpkg\.com|cdn\.jsdelivr\.net|ajax\.googleapis\.com)/;

/**
 * 허용 목록 — 파일별로 이유를 적는다.
 * 태그 삽입이 아니라 이미지·폰트처럼 실패해도 화면이 죽지 않는 것만 허용한다.
 */
const ALLOW = {
  // 예: "components/Foo.tsx": "폰트 프리로드. 실패해도 대체 폰트로 읽힌다",
};

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?|css)$/.test(name)) out.push(p);
  }
  return out;
}

const hits = [];
for (const d of DIRS) {
  for (const f of walk(join(ROOT, d))) {
    const rel = relative(ROOT, f).replace(/\\/g, "/");
    if (ALLOW[rel]) continue;
    const src = readFileSync(f, "utf8");
    src.split("\n").forEach((line, i) => {
      if (CDN.test(line)) hits.push({ rel, n: i + 1, line: line.trim().slice(0, 100) });
    });
  }
}

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

if (hits.length) {
  console.log(red(`\n외부 CDN 참조 ${hits.length}건 — npm 의존성 + await import() 로 바꾸세요\n`));
  for (const h of hits) console.log(`  ✗ ${h.rel}:${h.n}  ${h.line}`);
  console.log(
    dim("\n  요청이 200으로 성공해도 스크립트가 실행되지 않을 수 있습니다.")
  );
  console.log(dim("  꼭 필요하면 scripts/check-cdn.mjs 의 ALLOW 에 이유를 적으세요.\n"));
  process.exit(1);
}
console.log(green("통과 — 손으로 꽂는 외부 CDN 스크립트 없음"));
