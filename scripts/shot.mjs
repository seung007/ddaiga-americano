#!/usr/bin/env node
/**
 * 화면 캡처 — Claude 가 실제 화면을 보게 하는 장치
 *
 *   npm run shot              # 배포된 사이트의 주요 화면을 shots/ 에 저장
 *   npm run shot -- --local   # http://localhost:3000 을 대신 찍는다 (npm run dev 먼저)
 *   npm run shot -- /courses  # 특정 경로만
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 만들었나 (2026-09-08) — 이 세션에서 가장 큰 낭비였다
 *
 * 사용자 지적: *"이런 병목현상이 엄청 많잖아? 토큰도 낭비되고 시간도 낭비된다."*
 * 맞다. 그리고 가장 비싼 병목은 **내가 화면을 볼 수 없다**는 것이었다.
 *
 * 실제로 일어난 일:
 *   · 지도가 안 뜬다고 진단 → **틀렸다.** 내가 몰던 브라우저 탭이 숨은 탭이라
 *     IntersectionObserver 가 안 울린 것이었다. 커밋 하나 + 정정 커밋 하나 낭비.
 *   · 핀 디자인·경로선이 실제로 어떻게 보이는지 매번 사용자에게 물어봐야 했다.
 *     왕복 한 번에 화면 캡처 하나. 그 사이 나는 추측으로 코드를 고쳤다.
 *   · 스크린샷 도구는 30초 타임아웃과 이상한 배율로 자주 실패했다.
 *
 * 내 샌드박스로는 못 푼다 — 확인해 봤다:
 *   · 외부 네트워크가 npm 레지스트리 말고 전부 403 (vercel.app 도 못 부른다)
 *   · `npx playwright install chromium` 도 다운로드가 막힌다
 *
 * 그래서 **역할을 바꾼다.** 렌더링은 네트워크와 화면이 있는 hyun님 PC 가 하고,
 * 결과 PNG 는 이 저장소 폴더에 떨어진다. 나는 그 파일을 **이미지로 직접 읽는다.**
 * "사용자가 화면을 설명한다" → "내가 화면을 본다" 로 바뀐다.
 *
 * 왕복 계산: 전에는 [내 추측 → 사용자 캡처 → 내 정정] 이 3턴이었다.
 * 지금은 [npm run shot → 내가 읽고 판단] 1턴이다.
 *
 * ─────────────────────────────────────────────────────────────
 * Playwright 를 package.json 에 넣지 않은 이유
 *
 * `playwright` 패키지는 설치 후 브라우저 바이너리를 내려받는데, 그 다운로드가
 * **내 샌드박스에서 막힌다.** dependencies 에 넣으면 내가 `npm i` 를 못 한다.
 * 그래서 동적 import 로 두고, 없으면 설치 명령을 안내한다.
 * **CI 도 이 스크립트를 부르지 않는다** — 사람이 필요할 때만 쓴다.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "shots";
const args = process.argv.slice(2);
const LOCAL = args.includes("--local");
const BASE = LOCAL ? "http://localhost:3000" : "https://ddaiga-americano.vercel.app";

/** 기본으로 찍는 화면. 인수로 경로를 주면 그것만 찍는다. */
const DEFAULT_TARGETS = [
  { path: "/", name: "home" },
  { path: "/courses", name: "courses" },
  { path: "/shoe-finder", name: "finder" },
  { path: "/tools", name: "tools" },
];

const paths = args.filter((a) => a.startsWith("/"));
const targets = paths.length
  ? paths.map((p) => ({ path: p, name: p.replace(/\W+/g, "_").replace(/^_|_$/g, "") || "root" }))
  : DEFAULT_TARGETS;

/**
 * 두 폭을 찍는다. 네이버 유입이 76% 고 그쪽은 모바일 비중이 높다 —
 * **데스크톱만 보고 판단하면 대부분의 방문자가 보는 화면을 못 본다.**
 */
const VIEWPORTS = [
  { name: "mobile", width: 390, height: 900 },
  { name: "desktop", width: 1280, height: 900 },
];

const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.log(red("\nplaywright 가 없습니다. 한 번만 설치하면 됩니다:\n"));
  console.log("  npm i -D playwright");
  console.log("  npx playwright install chromium\n");
  console.log(dim("  (일부러 package.json 에 안 넣었습니다 — Claude 샌드박스에서는"));
  console.log(dim("   브라우저 내려받기가 막혀서 npm i 자체가 실패합니다.)\n"));
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

/**
 * 실행 로그를 **항상** 남긴다 — 2026-09-08 에 이걸로 한 번 막혔다.
 *
 * `npm run shot -- --local` 을 돌렸는데 Claude 쪽에서는 **아무 변화가 없었다.**
 * PNG 도 안 생기고 `console.txt` 도 옛 내용(프로덕션 것) 그대로였다.
 * 그래서 "실행했는데 왜 결과가 없나"를 알아내는 데 왕복이 또 들었다.
 *
 * 원인: 콘솔 오류가 **하나도 없을 때만** 파일을 안 쓰게 돼 있었고,
 * 모든 목표가 실패하면 오류 배열도 비어서 파일이 안 갱신됐다.
 * **결과물은 자기 출처를 기록해야 한다** — 언제, 어디를, 몇 장, 성공/실패.
 */
const RUN_LOG = join(OUT_DIR, "run.txt");
const startedAt = new Date().toISOString();

const browser = await chromium.launch();
const results = [];
const consoleErrors = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    locale: "ko-KR",
  });
  const page = await ctx.newPage();

  /**
   * 콘솔 오류를 같이 모은다. 화면만 보면 하이드레이션 오류 같은 건 안 보인다.
   *
   * ⚠️ 2026-09-08 — 여기서 `.slice(0, 200)` 으로 잘랐다가 **정작 필요한 부분을
   * 잘라 버렸다.** 개발 모드 하이드레이션 오류는 앞 200자가 일반 설명이고
   * **뒤에 서버/클라이언트 DOM 차이(어느 요소가 다른가)가 붙는다.**
   * 토큰을 아끼려고 자른 것이 답을 자른 셈이다.
   *
   * 규칙: **파일에는 전문을 넣고, 터미널에만 줄여 찍는다.**
   * 파일은 Claude 가 필요한 부분만 골라 읽을 수 있다 — 자르는 것은 읽는 쪽의 몫이다.
   */
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(`[${vp.name}] ${m.text()}`);
  });
  page.on("pageerror", (e) =>
    consoleErrors.push(`[${vp.name}] ${String(e.stack ?? e.message)}`)
  );

  for (const t of targets) {
    const url = BASE + t.path;
    try {
      /**
       * 로컬(`--local`)은 **먼저 한 번 불러서 컴파일을 깨운다.**
       * Next 개발 서버는 라우트를 **첫 요청 때 컴파일**하고, 이 저장소에서는
       * 그게 30~90초 걸린다. 45초 타임아웃으로는 전부 실패한다 — 실제로 그랬다.
       * fetch 로 워밍업하면 두 번째 요청(브라우저)은 즉시 뜬다.
       */
      if (LOCAL) {
        try {
          await fetch(url, { signal: AbortSignal.timeout(150_000) });
        } catch {
          /* 워밍업 실패는 무시하고 브라우저로 한 번 더 시도한다 */
        }
      }
      await page.goto(url, { waitUntil: "networkidle", timeout: LOCAL ? 120_000 : 45_000 });

      /**
       * **끝까지 한 번 내려갔다 온다.**
       * 이 사이트는 지도와 신발 띠를 IntersectionObserver 로 지연 로드한다.
       * 스크롤 없이 찍으면 "지도 불러오는 중…" 만 찍힌다 —
       * 내가 그걸 "지도가 고장났다"고 오진한 바로 그 상황이다.
       */
      await page.evaluate(async () => {
        const step = Math.round(innerHeight * 0.8);
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 350));
        }
        scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 600));
      });
      await page.waitForTimeout(1200);

      const file = join(OUT_DIR, `${t.name}-${vp.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      results.push({ ok: true, file, url });
    } catch (e) {
      // message 를 찍는다. name 만 남기면 원인이 사라진다(AGENTS.md 사례).
      results.push({ ok: false, url, err: `${e.name}: ${e.message.split("\n")[0]}` });
    }
  }
  await ctx.close();
}
await browser.close();

// ── 보고 — 짧게. 통과한 것은 한 줄, 실패만 자세히 ──────────
console.log(`\n${BASE}`);
for (const r of results) {
  if (r.ok) console.log(green(`  ✓ ${r.file}`));
  else console.log(red(`  ✗ ${r.url} — ${r.err}`));
}

const uniq = [...new Set(consoleErrors)];
const okCount = results.filter((r) => r.ok).length;

// **항상 쓴다.** 실패해도 쓴다. 그래야 "실행했나"를 파일로 알 수 있다.
writeFileSync(
  RUN_LOG,
  [
    `# npm run shot`,
    `base=${BASE}`,
    `local=${LOCAL}`,
    `시작=${startedAt}`,
    `끝=${new Date().toISOString()}`,
    `성공=${okCount} 실패=${results.length - okCount}`,
    ``,
    ...results.map((r) => (r.ok ? `OK   ${r.file}` : `FAIL ${r.url} — ${r.err}`)),
    ``,
    `# 브라우저 콘솔 오류 ${uniq.length}종 (전문)`,
    ...uniq.flatMap((e, i) => [`--- 오류 ${i + 1} ---`, e]),
    ``,
  ].join("\n"),
  "utf8"
);

if (uniq.length) {
  console.log(red(`\n브라우저 콘솔 오류 ${uniq.length}종`));
  // 터미널에는 첫 줄만. 전문은 파일에 있다.
  for (const e of uniq.slice(0, 5))
    console.log(dim(`  ${e.split("\n")[0].slice(0, 160)}`));
}

console.log(dim(`\n결과 요약 → ${RUN_LOG}`));
console.log(dim(`Claude 에게 "shots 봐" 라고 하면 됩니다.\n`));
