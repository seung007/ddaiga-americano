#!/usr/bin/env node
/**
 * ⚠️ 2026-09-17 폐기 — 9/14 제목 실험 판정은 하지 않는다. 노출 수백·클릭 한 자리 수에서
 * CTR 차이는 우연과 못 가린다. 기록용으로 남긴다 (`유입_설정_기준선.md` §0).
 *
 * 9/14 제목 실험 판정 — **기준을 데이터보다 먼저 코드에 박는다.**
 *
 *   npm run ctr:verdict -- 340,7 120,2 80,2
 *                          └ 미드풋  └ 2e   └ 초보
 *                          (노출,클릭)
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 만들었나 (2026-09-13)
 *
 * `유입_설정_기준선.md` 에 판정 기준이 **이미 표로 적혀 있다.** 문서는 잘 썼다.
 * 문제는 판정하는 사람(나)이다. 숫자를 본 뒤에 기준을 다시 읽으면
 * **기준이 숫자에 맞춰 읽힌다.** 2.0% 가 나오면 "기준 충족", 1.9% 가 나오면
 * "사실상 충족"이라고 쓰게 된다. 이 저장소에서 이미 여러 번 그랬다.
 *
 * 그래서 기준을 **읽는 것이 아니라 실행하는 것**으로 바꾼다.
 * 숫자를 넣으면 판정이 나온다. 내가 문장을 고르지 않는다.
 *
 * ─────────────────────────────────────────────────────────────
 * ⚠️ 기준표에 있는 구멍 — 판정 전에 먼저 적어 둔다
 *
 * 기준은 "3개 중 2개 이상이 2% 이상이면 제목이 먹혔다" 이다.
 * 그런데 검색어마다 **2% 를 넘는 데 필요한 클릭 수가 다르다.**
 *
 *   · 미드풋      329노출 2클릭 → 2% 가 되려면 클릭 7개.  기준선의 3.5배
 *   · 2e 와이드   134노출 1클릭 → 2% 가 되려면 클릭 3개
 *   · 초보 러너    73노출 1클릭 → 2% 가 되려면 클릭 **2개**  ← 하나 더 눌리면 끝
 *
 * 클릭은 포아송이라 기댓값 1 에서 2 가 나올 확률이 26% 다. 즉 **초보 러너는
 * 제목과 무관하게 4번에 1번꼴로 "성공"한다.** 2e 도 3클릭이 8% 확률로 그냥 나온다.
 * 둘이 동시에 우연히 넘을 확률이 한 자릿수 % 대이므로, "3개 중 2개" 를
 * 그대로 쓰면 **아무것도 안 했어도 가끔 성공 판정이 난다.**
 *
 * 그래서 판정을 둘로 나눠 출력한다:
 *   ① 문서에 적힌 원래 기준 (약속했으니 그대로 실행한다)
 *   ② 각 검색어가 **잡음으로 설명되는지** — 포아송 상측 확률
 *
 * ②가 ①을 덮어쓰지 않는다. 사후에 기준을 바꾸는 게 바로 이 도구가 막으려는 짓이다.
 * 둘을 나란히 보여주고, **엇갈리면 엇갈렸다고 적는다.**
 */

/**
 * ⚠️ 판정일 방어 (2026-09-13 추가)
 *
 * 네이버 공식 가이드 「콘텐츠 노출 및 클릭」:
 *   *"노출·클릭 정보의 업데이트 기준일은 1주 전의 검색 데이터를 기준으로 산정되며,
 *     최근 7일치를 조회하면 현재일로부터 2주 전 ~ 3주 전 데이터를 보는 셈"*
 *   https://searchadvisor.naver.com/guide/report-expose-ctr
 *
 * **제목을 8/28 에 바꿨는데 판정일을 9/14 로 잡은 것이 잘못이었다.**
 * 9/14 에 보이는 가장 최근 데이터는 8/31 언저리다. 제목 변경 후 데이터가
 * 사흘치뿐이다. 그 숫자로 판정하면 **바꾸기 전 성적을 보고 "제목이 안 먹혔다"** 고
 * 결론 내게 된다. 실험을 죽이는 가장 조용한 방법이다.
 *
 * 이 저장소의 기존 실수와 같은 모양이다 — 프록시를 답으로 썼다.
 * 알고 싶은 건 "제목 바꾼 뒤의 CTR"인데 "화면에 보이는 CTR"을 물었다.
 *
 * 그래서 날짜를 검사한다. 데이터가 덜 찼으면 **판정을 거부한다.**
 */
const CHANGE_DATE = "2026-08-28"; // 제목 교체 커밋 c4f0714

/**
 * ⚠️ 2026-09-13 정정 — 처음에 14일로 잡았는데 **화면과 안 맞았다.**
 *
 * 사용자가 보내준 서치어드바이저 화면의 「노출/클릭 현황」 그래프는
 * **9/12 까지** 점이 찍혀 있었다. 2주 시차라면 8/30 에서 끊겼어야 한다.
 *
 * 나는 공식 문서의 "2~3주 전 데이터" 문장을 읽고 **관측 없이 14를 적었다.**
 * 문서를 읽은 것과 화면을 본 것은 다르다. 이 저장소가 반복해서 배운 것이다.
 *
 * 그래서 공식 문서가 명시한 값(1주)만 쓰고, 그 이상은 추정하지 않는다.
 * 다만 그래프 끝의 며칠은 값이 덜 찼을 수 있으므로 NEED_DAYS 로 흡수한다.
 */
const LAG_DAYS = 7; // 네이버 공식: "1주 전의 검색 데이터를 기준으로 산정"
const NEED_DAYS = 21; // 최소 3주치는 쌓여야 클릭 수가 의미를 갖는다

/**
 * 기준선 — `유입_설정_기준선.md` §3 (2026-08-28 측정, 30일치)
 * 이 값은 **고치지 않는다.** 고치면 실험이 사라진다.
 */
const BASELINE = [
  { key: "미드풋", impressions: 329, clicks: 2 },
  { key: "2e 와이드 뜻", impressions: 134, clicks: 1 },
  { key: "초보 러너 뛰는법", impressions: 73, clicks: 1 },
];

/** 성공선 — 문서 표에 적힌 값 */
const SUCCESS_CTR = 0.02; // 2%
const FAILURE_CTR = 0.01; // 1% 미만이 3개 다면 순위 문제

const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;

/** P(X >= k | λ) — 포아송 상측. "이 정도는 그냥 나올 수 있나"를 잰다. */
function poissonAtLeast(k, lambda) {
  if (k <= 0) return 1;
  // P(X < k) 를 더해서 뺀다. k 가 작아서 정확도 문제 없음.
  let term = Math.exp(-lambda);
  let cdf = term;
  for (let i = 1; i < k; i++) {
    term *= lambda / i;
    cdf += term;
  }
  return Math.max(0, 1 - cdf);
}

const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const force = process.argv.includes("--force");

/** 오늘(KST) 기준으로 제목 변경 후 며칠치가 화면에 보이는가 */
function visibleDaysSinceChange() {
  const todayKst = new Date(Date.now() + 9 * 3_600_000);
  const latestVisible = new Date(todayKst.getTime() - LAG_DAYS * 86_400_000);
  const change = new Date(CHANGE_DATE + "T00:00:00Z");
  return Math.floor((latestVisible - change) / 86_400_000);
}

const visible = visibleDaysSinceChange();
if (visible < NEED_DAYS) {
  const readyOn = new Date(
    new Date(CHANGE_DATE + "T00:00:00Z").getTime() + (NEED_DAYS + LAG_DAYS) * 86_400_000
  )
    .toISOString()
    .slice(0, 10);
  console.log(`
${red(bold("판정하지 마세요 — 데이터가 아직 안 찼습니다."))}

  제목 교체일        ${CHANGE_DATE}
  네이버 데이터 시차   약 ${LAG_DAYS}일 ${dim("(공식 가이드: 2~3주)")}
  ${bold(`지금 보이는 건 제목 바꾼 뒤 ${visible < 0 ? 0 : visible}일치`)}입니다. ${dim(`최소 ${NEED_DAYS}일 필요`)}

  ${yellow("지금 화면의 숫자는 대부분 '제목 바꾸기 전' 성적입니다.")}
  ${yellow("그걸로 판정하면 제목이 안 먹혔다는 결론이 자동으로 나옵니다.")}

  ${green(`판정 가능일: ${readyOn} 이후`)}

  ${dim("그래도 지금 숫자를 보고 싶으면 --force 를 붙이세요.")}
  ${dim("단, 그 출력은 판정이 아니라 참고입니다.")}
`);
  if (!force) process.exit(2);
  console.log(red("  --force 로 진행합니다. 아래는 판정이 아닙니다.\n"));
}

if (args.length !== 3) {
  console.log(`
${bold("9/14 제목 실험 판정")}

  ${dim("네이버 서치어드바이저 → 검색어별 노출·클릭을 그대로 넣으세요.")}

  npm run ctr:verdict -- ${green("<미드풋>")} ${green("<2e 와이드 뜻>")} ${green("<초보 러너 뛰는법>")}
  ${dim("각 인수는 노출,클릭 형식입니다.")}

  ${dim("형식)")} npm run ctr:verdict -- ${dim("노출,클릭  노출,클릭  노출,클릭")}

  ${red("⚠ 예시 숫자를 넣지 마세요.")} ${dim("그럴듯한 예시를 적어 두면 그게 그대로")}
  ${dim("  문서에 붙습니다. 실제로 한 번 그럴 뻔했습니다 (2026-09-13).")}
  ${dim("  서치어드바이저 화면의 값만 넣으세요.")}

${bold("기준선 (2026-08-28, 30일)")}
${BASELINE.map(
  (b) =>
    `  ${b.key.padEnd(18)} 노출 ${String(b.impressions).padStart(4)} · 클릭 ${b.clicks} · CTR ${(
      (b.clicks / b.impressions) *
      100
    ).toFixed(1)}%`
).join("\n")}

  ${yellow("기간을 맞추세요")} — 기준선은 30일치입니다. 서치어드바이저에서도
  ${yellow("같은 길이의 최근 30일")}로 뽑아야 비교가 됩니다.
`);
  process.exit(1);
}

const now = args.map((a, i) => {
  const [imp, clk] = a.split(",").map((n) => Number(n.trim()));
  if (!Number.isFinite(imp) || !Number.isFinite(clk)) {
    console.error(red(`\n인수 ${i + 1} 을 "노출,클릭" 으로 읽을 수 없습니다: ${a}\n`));
    process.exit(1);
  }
  return { ...BASELINE[i], nowImpressions: imp, nowClicks: clk };
});

console.log(bold("\n9/14 제목 실험 판정") + dim("  (기준은 2026-08-28 에 미리 고정됨)\n"));

const rows = now.map((r) => {
  const baseRate = r.clicks / r.impressions;
  const nowRate = r.nowImpressions > 0 ? r.nowClicks / r.nowImpressions : 0;
  // 노출이 그대로라면 기준선 비율로 몇 클릭이 기대되나
  const lambda = baseRate * r.nowImpressions;
  const pNoise = poissonAtLeast(r.nowClicks, lambda);
  const needFor2pct = Math.ceil(SUCCESS_CTR * r.nowImpressions);
  return { ...r, baseRate, nowRate, lambda, pNoise, needFor2pct };
});

for (const r of rows) {
  const impDelta = r.nowImpressions - r.impressions;
  const impMark =
    impDelta < -r.impressions * 0.2 ? red(`▼${impDelta}`) : dim(`${impDelta >= 0 ? "+" : ""}${impDelta}`);

  console.log(`  ${bold(r.key)}`);
  console.log(
    `    노출 ${String(r.impressions).padStart(4)} → ${String(r.nowImpressions).padStart(4)} ${impMark}` +
      `    클릭 ${r.clicks} → ${r.nowClicks}`
  );
  const ctrStr = `${(r.nowRate * 100).toFixed(1)}%`;
  const pass = r.nowRate >= SUCCESS_CTR;
  console.log(
    `    CTR  ${(r.baseRate * 100).toFixed(1)}% → ${pass ? green(ctrStr) : ctrStr}` +
      dim(`   (2% 되려면 클릭 ${r.needFor2pct}개 필요)`)
  );
  // 잡음 설명력 — 낮을수록 "우연으로는 보기 어렵다"
  const pStr = `${(r.pNoise * 100).toFixed(0)}%`;
  const noisy = r.pNoise > 0.1;
  console.log(
    `    ${dim("이 클릭 수가 제목과 무관하게 나올 확률")} ${noisy ? yellow(pStr) : green(pStr)}` +
      dim(`  (기준선 비율이면 ${r.lambda.toFixed(1)}클릭 기대)`)
  );
  console.log("");
}

// ── ① 문서에 적힌 원래 기준 ────────────────────────────────
const above2 = rows.filter((r) => r.nowRate >= SUCCESS_CTR).length;
const allBelow1 = rows.every((r) => r.nowRate < FAILURE_CTR);
const impressionsDropped = rows.some((r) => r.nowImpressions < r.impressions * 0.8);

console.log(bold("① 미리 적어 둔 기준"));
let verdict;
if (impressionsDropped) {
  verdict = "노출이 줄었다 — 순위가 떨어졌다. 제목 변경 되돌리기를 검토";
  console.log(`  ${red("✗")} ${verdict}`);
} else if (above2 >= 2) {
  verdict = "제목이 먹혔다 — 나머지 검색어 제목도 같은 방식으로";
  console.log(`  ${green("✓")} ${verdict} ${dim(`(2% 이상 ${above2}/3)`)}`);
} else if (allBelow1) {
  verdict = "제목 문제가 아니다 — 순위 문제. 제목 만지기를 멈추고 색인·백링크로";
  console.log(`  ${red("✗")} ${verdict}`);
} else {
  verdict = "어느 칸에도 안 들어감 — 판정 보류";
  console.log(`  ${yellow("—")} ${verdict} ${dim(`(2% 이상 ${above2}/3)`)}`);
}

// ── ② 잡음 검사 ────────────────────────────────────────────
console.log(bold("\n② 잡음으로 설명되나"));
const solid = rows.filter((r) => r.nowRate >= SUCCESS_CTR && r.pNoise <= 0.1);
const flimsy = rows.filter((r) => r.nowRate >= SUCCESS_CTR && r.pNoise > 0.1);

if (above2 === 0) {
  console.log(dim("  2% 를 넘은 검색어가 없어 검사할 것이 없습니다."));
} else {
  for (const r of solid) console.log(`  ${green("단단함")} ${r.key} ${dim(`— 우연 ${(r.pNoise * 100).toFixed(0)}%`)}`);
  for (const r of flimsy)
    console.log(`  ${yellow("약함")}   ${r.key} ${dim(`— 우연 ${(r.pNoise * 100).toFixed(0)}%. 클릭 한두 개 차이다`)}`);
}

// ── 엇갈리면 엇갈렸다고 적는다 ─────────────────────────────
if (above2 >= 2 && solid.length < 2 && !impressionsDropped) {
  console.log(
    yellow(
      `\n  ⚠ ①은 성공이라고 하지만 ②로는 ${solid.length}개만 단단합니다.\n` +
        `     "제목이 먹혔다"고 쓰되 ${flimsy.length}개는 잡음일 수 있다고 같이 쓰세요.\n` +
        `     기준을 지금 고치지 마세요 — 그게 이 실험을 없애는 방법입니다.`
    )
  );
}

console.log(dim("\n이 출력을 그대로 `유입_설정_기준선.md` 에 붙이세요.\n"));
