#!/usr/bin/env node
/**
 * 화면 캡처 — Claude 가 실제 화면을 보게 하는 장치
 *
 *   npm run shot              # 배포된 사이트의 주요 화면을 shots/ 에 저장
 *   npm run shot:local        # http://localhost:3000 을 찍는다 (다른 창에서 npm run dev 먼저)
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
 * 시작 전에 대상이 살아 있는지 **한 번** 확인한다.
 *
 * 2026-09-08: 개발 서버가 꺼진 채로 돌렸더니 **똑같은 ERR_CONNECTION_REFUSED
 * 8줄**이 나왔다(목표 4개 × 화면 2개). 사람이 해야 할 일은 "dev 를 켜라" 한 줄인데
 * 화면에는 8줄이 찍히고 그게 대화로 붙여넣어진다.
 *
 * **실패 메시지는 사람이 다음에 무엇을 할지 정하는 유일한 입력이다.**
 * 같은 원인의 실패를 여러 번 반복해 찍는 것은 정보가 아니라 잡음이다.
 */
try {
  await fetch(BASE, { method: "GET", signal: AbortSignal.timeout(LOCAL ? 8_000 : 15_000) });
} catch {
  if (LOCAL) {
    console.log(red("\n개발 서버가 안 켜져 있습니다 (http://localhost:3000).\n"));
    console.log("  창을 하나 더 열고 거기서 켜 두세요:\n");
    console.log("    npm run dev\n");
    console.log(dim("  `npm run dev` 는 끝나지 않는 명령입니다 — 같은 창에서 다음 명령을"));
    console.log(dim("  이어 실행하면 dev 가 꺼진 뒤에야 돌아갑니다.\n"));
  } else {
    console.log(red(`\n${BASE} 에 연결할 수 없습니다. 네트워크나 배포 상태를 확인하세요.\n`));
  }
  process.exit(1);
}

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

/**
 * 실패해도 화면에 영향이 없는 요청 — 분석·측정 비콘.
 * 이들은 fire-and-forget 이라 페이지를 닫을 때 취소되는 것이 **정상 동작**이다.
 * 오류 목록에 넣으면 매 실행마다 뜨고, 그러면 사람이 목록 전체를 무시하게 된다.
 */
const BENIGN_FAIL =
  /(google-analytics\.com|googletagmanager\.com|analytics\.google\.com|vitals\.vercel-insights\.com|va\.vercel-scripts\.com|clarity\.ms|c\.bing\.com\/c\.gif)/;

/**
 * ⚠️ 2026-09-12 — 이 목록을 **한 번 더 늘렸다.** 남는 오류가 또 비콘이었다.
 *
 *   image  https://c.bing.com/c.gif?...&RedC=c.clarity.ms
 *
 * Microsoft Clarity 가 Bing 과 세션을 맞추는 픽셀이다. 화면과 무관하다.
 *
 * 목록을 늘릴 때마다 **진짜 실패를 덮을 위험**이 커진다. 그래서 규칙을 적어 둔다:
 *   · 여기 넣어도 되는 것 — **실패해도 화면이 그대로인 것**(분석·측정 비콘)
 *   · 넣으면 안 되는 것 — 이미지·폰트·스크립트처럼 **화면을 바꾸는 것**
 * 판단이 애매하면 넣지 마라. 시끄러운 편이 조용히 틀린 것보다 낫다.
 */

const browser = await chromium.launch();
const results = [];
const consoleErrors = [];
const benignFails = [];

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

  /**
   * **어느 자원이 실패했는지를 남긴다.** (2026-09-12 추가)
   *
   * 오늘 홈 캡처에서 이 한 줄만 나왔다:
   *   `Failed to load resource: net::ERR_CONNECTION_RESET`
   * **어느 URL인지가 없다.** 그러면 사람이 할 수 있는 건 추측뿐이다 —
   * 내가 방금 바꾼 나이키 사진일 수도, 폰트일 수도, 광고 차단일 수도 있다.
   *
   * 브라우저 콘솔의 이 메시지는 원래 URL을 안 담는다. Playwright 의
   * `requestfailed` 이벤트에는 있다. **묻고 싶은 것을 직접 물어야 한다.**
   *
   * 이 저장소의 기존 교훈과 같은 종류다 — `e.name` 만 찍어서 원인을 지웠던 일,
   * `?? 0` 으로 없는 값을 통과시킨 일. **식별자가 빠진 실패 메시지는
   * 실패를 알리기만 하고 고칠 수는 없게 만든다.**
   */
  page.on("requestfailed", (req) => {
    const why = req.failure()?.errorText ?? "(사유 없음)";
    /**
     * ⚠️ 2026-09-12 — **여기서 `net::ERR_ABORTED` 를 버렸다가 한 번 막혔다.**
     *
     * "사용자가 취소한 요청은 잡음"이라고 걸렀는데, `page.goto` 가 타임아웃되면
     * Playwright 가 **대기 중이던 요청을 전부 중단**시킨다. 그 순간 문제의 요청도
     * ERR_ABORTED 가 된다. 그래서 실패 원인을 잡으려고 넣은 핸들러가
     * **정작 실패했을 때 아무것도 안 남겼다.** `run.txt` 에 "콘솔 오류 0종".
     *
     * 이 저장소의 반복 실패와 같다 — `slice(0, 200)` 이 DOM diff 를 잘라먹었고,
     * `e.name` 이 원인을 지웠다. **내가 잡음이라고 정한 것이 답이었다.**
     *
     * 그래서 버리지 않고 **표시만 한다.** 자르는 것은 읽는 쪽의 몫이다.
     */
    /**
     * **무해한 실패를 오류로 찍지 않는다** (2026-09-12, 같은 날 두 번째 수정)
     *
     * URL 을 남기게 고치자마자 답이 나왔다 — 실패한 건 신발 사진이 아니라
     * **GA4 의 `page_view` 비콘**이었다(`google-analytics.com/g/collect`).
     * 분석 비콘은 fire-and-forget 이라 브라우저 컨텍스트를 닫을 때 취소되는 게
     * 정상이다. 화면에는 아무 영향이 없다.
     *
     * 나는 이걸 "나이키 사진이 깨졌다"고 추측했고 **틀렸다.** URL 을 찍게
     * 만들지 않았으면 멀쩡한 이미지를 되돌릴 뻔했다.
     *
     * 그런데 이대로 두면 매 실행마다 "오류 2종"이 뜬다. 그러면 사람이 곧
     * 무시하게 되고, **진짜 실패가 섞여 들어와도 안 본다.**
     * 이 저장소의 규칙과 같다 — *범위를 넓히면 오탐부터 잡아라.*
     *
     * 그래서 **버리지 않고 자리를 나눈다.** 무해한 것은 run.txt 하단에 개수와
     * 함께 따로 적고, 오류 목록에는 넣지 않는다.
     */
    const line = `[${vp.name}] 요청 실패 ${why}\n    ${req.resourceType()}  ${req.url()}`;
    if (BENIGN_FAIL.test(req.url())) benignFails.push(line);
    else consoleErrors.push(line);
  });

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
      /**
       * `networkidle` 을 **필수 조건에서 뺐다** (2026-09-12).
       *
       * 전에는 `waitUntil: "networkidle"` 하나였다. 그런데 이미지 한 장이
       * 응답을 안 주면 **네트워크가 영영 조용해지지 않는다** → 45초를 채우고
       * 캡처가 통째로 실패한다. 실제로 오늘 홈 모바일이 그렇게 날아갔고,
       * **사진 한 장 때문에 화면을 아예 못 보는 상태**가 됐다.
       *
       * 진단해야 할 대상(깨진 자원)이 진단 도구를 죽이는 구조였다.
       *
       * 그래서 두 단계로 나눈다:
       *   ① `domcontentloaded` — 여기까지는 반드시 기다린다
       *   ② `networkidle` — **되면 좋고, 안 되면 넘어간다**(지연 로드를 깨우는 용도)
       * 아래 스크롤 루프가 어차피 한 번 더 기다리므로 ②가 빠져도 지도·띠는 뜬다.
       */
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: LOCAL ? 120_000 : 45_000,
      });
      await page
        .waitForLoadState("networkidle", { timeout: LOCAL ? 30_000 : 15_000 })
        .catch(() => {
          // 조용해지지 않았다 = 어떤 요청이 매달려 있다.
          // 그게 무엇인지는 위 requestfailed 핸들러와 run.txt 가 말해준다.
          consoleErrors.push(
            `[${vp.name}] networkidle 미도달 — 매달린 요청이 있습니다 (${t.path})`
          );
        });

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
    // 무해한 실패는 **지우지 않고 자리를 나눈다.** 지우면 나중에
    // "정말 아무 일도 없었나"를 확인할 방법이 사라진다.
    `# 무해한 요청 실패 ${[...new Set(benignFails)].length}종 (분석 비콘 — 화면에 영향 없음)`,
    ...[...new Set(benignFails)].map((e) => `  ${e.split("\n")[0]}  ${e.split("\n")[1]?.trim() ?? ""}`),
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
