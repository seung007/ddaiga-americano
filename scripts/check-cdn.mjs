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
import { stripComments } from "./lib/strip-comments.mjs";

const ROOT = process.cwd();
const DIRS = ["app", "components", "lib"];
const CDN = /(cdnjs\.cloudflare\.com|unpkg\.com|cdn\.jsdelivr\.net|ajax\.googleapis\.com)/;

/**
 * 실패 경로에 숨은 외부 의존 (2026-09-08 추가)
 *
 * `onError` 대체 이미지가 세 곳에서 `placehold.co` 를 불렀다.
 * 즉 **사진 실패의 대비책이 또 다른 외부 요청**이었다.
 *
 * 왜 위험한가 — 신발 사진 48장 중 40장이 같은 CDN(`cdn.runrepeat.com`)에 있다.
 * 그쪽이 막히는 날에는 `onError` 가 40번 터지고 그 순간 placehold.co 로
 * 40개 요청이 나간다. 그게 느리거나 죽어 있으면 **대비책마저 실패한다.**
 *
 * 그리고 이건 위 CDN 목록에 안 걸렸다 — **평소에는 아무 일도 안 하는 코드라
 * 눈에 띌 이유가 없었다.** 그래서 검사에 넣는다.
 * data URI 로 그리면 요청이 0이다(`lib/shoes/placeholder.ts`).
 */
const FALLBACK_CDN = /(placehold\.co|placeholder\.com|dummyimage\.com|picsum\.photos)/;

/**
 * SVG 안의 `<title>` 금지 (2026-09-08 추가)
 *
 * `components/CourseFigure.tsx` 의 `<svg><title>` 하나가 **사이트 전체
 * 하이드레이션 오류(React #418)** 를 만들고 있었다. React 19 는 `<title>` 을
 * 문서 메타데이터로 보고 `<head>` 로 올리는데, SVG 안이라도 클라이언트
 * 경로에서 그 구분을 못 한다. 결과적으로 React 가 서버 HTML 을 버리고
 * 다시 그렸고, 그 과정에서 head 에 꽂은 스크립트가 날아간 적도 있다.
 *
 * **화면은 정상으로 보인다.** 그래서 3주 넘게 아무도 몰랐다.
 * 접근성 이름은 `aria-label` 로 주면 된다.
 */
const SVG_TITLE = /<title[\s>]/;

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


// 주석 제거는 `scripts/lib/strip-comments.mjs` 로 뺐다 —
// `check-internal-links.mjs` 가 2026-09-08 에 똑같은 오탐을 맞았기 때문이다.

const hits = [];
for (const d of DIRS) {
  for (const f of walk(join(ROOT, d))) {
    const rel = relative(ROOT, f).replace(/\\/g, "/");
    if (ALLOW[rel]) continue;
    const src = stripComments(readFileSync(f, "utf8"));
    src.split("\n").forEach((line, i) => {
      if (CDN.test(line))
        hits.push({ rel, n: i + 1, why: "외부 CDN", line: line.trim().slice(0, 100) });
      if (FALLBACK_CDN.test(line))
        hits.push({
          rel,
          n: i + 1,
          why: "대체 이미지에 외부 요청 — lib/shoes/placeholder.ts 의 shoePlaceholder() 를 쓰세요",
          line: line.trim().slice(0, 100),
        });
      if (SVG_TITLE.test(line))
        hits.push({
          rel,
          n: i + 1,
          why: "<title> — React 19 가 head 로 올려 하이드레이션을 깨뜨린다. aria-label 을 쓰세요",
          line: line.trim().slice(0, 100),
        });
    });
  }
}

/**
 * 스크립트의 윈도우 경로 버그 (2026-09-09 추가)
 *
 * `new URL(import.meta.url).pathname` 은 윈도우에서 `/C:/...` 처럼 앞에 슬래시가
 * 붙는다. `resolve()` 를 걸면 `C:\C:\...` 가 되고 **파일을 못 찾는다.**
 *
 * 내 실행 환경은 리눅스라 **절대 재현되지 않는다.** hyun 님은 윈도우에서 돌린다.
 * 즉 내가 "검사 통과"를 확인하고 넘겨도 상대 화면에서는 멈춘다 —
 * 실제로 `npm run ship` 이 이걸로 한 번 멈췄다.
 *
 * 내가 볼 수 없는 실패는 **검사가 대신 봐야 한다.** `import.meta.dirname` 을 쓰면 된다.
 */
const WIN_PATH = /new URL\(import\.meta\.url\)\.pathname/;
const SCRIPT_DIR = "scripts";

// scripts/*.mjs 는 위 DIRS 스캔 대상이 아니라 따로 훑는다.
for (const name of readdirSync(join(ROOT, SCRIPT_DIR))) {
  if (!name.endsWith(".mjs")) continue;
  const rel = `${SCRIPT_DIR}/${name}`;
  const src = stripComments(readFileSync(join(ROOT, SCRIPT_DIR, name), "utf8"));
  src.split("\n").forEach((line, i) => {
    if (WIN_PATH.test(line))
      hits.push({
        rel,
        n: i + 1,
        why: "윈도우에서 C:\\C:\\… 가 된다 — import.meta.dirname 을 쓰세요",
        line: line.trim().slice(0, 100),
      });
  });
}

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

if (hits.length) {
  console.log(red(`\n금지 패턴 ${hits.length}건\n`));
  for (const h of hits) console.log(`  ✗ ${h.rel}:${h.n}  [${h.why}]\n      ${h.line}`);
  if (hits.some((h) => h.why === "외부 CDN")) {
    console.log(dim("\n  CDN: 요청이 200으로 성공해도 스크립트가 실행되지 않을 수 있습니다."));
    console.log(dim("       꼭 필요하면 scripts/check-cdn.mjs 의 ALLOW 에 이유를 적으세요."));
  }
  console.log("");
  process.exit(1);
}
console.log(green("통과 — 외부 CDN 주입·SVG <title> 없음"));
