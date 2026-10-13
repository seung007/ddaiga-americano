/**
 * 걷기-달리기 8단계 진도표 — 단일 출처 (2026-10-13)
 *
 * 왜 따로 뺐나
 *   이 표는 원래 app/injury/start-running/page.tsx 안의 문자열 배열이었다.
 *   /tools/run-30(따라 하기 플랜·타이머)이 같은 표를 써야 하는데, 복사하면 한쪽만 고쳐지는 날이 온다
 *   (AGENTS.md 「한 곳에서 정정했으면 전부 찾아서 고친다」). 그래서 구조로 적고 글자는 여기서 만든다.
 *
 * 무엇이 근거고 무엇이 아닌가
 *   · 8단계·앞뒤 5분 걷기·주 3회·달리는 날 사이 하루 쉬기·「같은 단계 3번 → 대화 됐고 다음 날 아침 안 아프면 다음 단계」·
 *     「두 번 반복해도 안 되면 한 단계 내려가기」·「최소 8주」는 **이 사이트의 예시**다.
 *     특정 진도표를 검증한 연구는 찾지 못했다(start-running 페이지 본문·주석 참고). 화면에도 그렇게 적는다.
 *   · 시간 합계는 손으로 적지 않고 아래 구조에서 계산한다. start-running 표의 「시간」 열(준비·정리 걷기 제외)과
 *     /tools/run-30 의 회차 총 시간(준비·정리 걷기 포함)이 같은 계산에서 나온다.
 *
 * ⚠️ 이 파일을 바꾸면 start-running 표 글자가 바뀐다. 2026-10-13 옮길 때 이전 문자열 8줄과 한 글자씩 대조했다.
 */

export type StepKey = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

type Part = { kind: "run" | "walk"; sec: number };

type Pattern =
  /** 달리기 run초 + 걷기 walk초 를 reps 번 */
  | { type: "repeat"; run: number; walk: number; reps: number }
  /** 적힌 순서대로 한 번씩 */
  | { type: "sequence"; parts: Part[] };

export type WalkRunStep = { key: StepKey; pattern: Pattern };

const m = (min: number) => min * 60;

export const WALK_RUN_STEPS: readonly WalkRunStep[] = [
  { key: "A", pattern: { type: "repeat", run: m(1), walk: m(2), reps: 8 } },
  { key: "B", pattern: { type: "repeat", run: m(2), walk: m(2), reps: 6 } },
  { key: "C", pattern: { type: "repeat", run: m(3), walk: 90, reps: 5 } },
  { key: "D", pattern: { type: "repeat", run: m(5), walk: 90, reps: 4 } },
  { key: "E", pattern: { type: "repeat", run: m(8), walk: m(1), reps: 3 } },
  { key: "F", pattern: { type: "repeat", run: m(12), walk: m(1), reps: 2 } },
  {
    key: "G",
    pattern: {
      type: "sequence",
      parts: [
        { kind: "run", sec: m(20) },
        { kind: "walk", sec: m(1) },
        { kind: "run", sec: m(8) },
      ],
    },
  },
  { key: "H", pattern: { type: "sequence", parts: [{ kind: "run", sec: m(30) }] } },
];

/** 앞뒤 걷기 — 저희 예시 */
export const WARMUP_SEC = m(5);
export const COOLDOWN_SEC = m(5);
/** 같은 단계를 몇 번 하고 조건을 묻나 — 저희 예시 */
export const SESSIONS_PER_STEP = 3;
/** 두 번 반복해도 안 되면 한 단계 내려간다 — 저희 예시 */
export const MAX_REPEATS_BEFORE_STEP_DOWN = 2;

/** 90 → "1분 30초", 1350 → "22분 30초", 30 → "30초" */
export function fmtDuration(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  if (mm && ss) return `${mm}분 ${ss}초`;
  if (mm) return `${mm}분`;
  return `${ss}초`;
}

const LABEL = { run: "달리기", walk: "걷기" } as const;

/** "달리기 1분 + 걷기 2분 × 8" — start-running 표의 「한 번에 할 것」 */
export function describeMain(step: WalkRunStep): string {
  const p = step.pattern;
  if (p.type === "repeat") return `달리기 ${fmtDuration(p.run)} + 걷기 ${fmtDuration(p.walk)} × ${p.reps}`;
  return p.parts.map((x) => `${LABEL[x.kind]} ${fmtDuration(x.sec)}`).join(" + ");
}

/** 준비·정리 걷기를 뺀 본운동 순서 */
export function mainParts(step: WalkRunStep): Part[] {
  const p = step.pattern;
  if (p.type === "sequence") return p.parts.map((x) => ({ ...x }));
  const out: Part[] = [];
  for (let i = 0; i < p.reps; i++) out.push({ kind: "run", sec: p.run }, { kind: "walk", sec: p.walk });
  return out;
}

/** 본운동 시간(초) — start-running 표의 「시간」 */
export function mainSec(step: WalkRunStep): number {
  return mainParts(step).reduce((a, x) => a + x.sec, 0);
}

export type PhaseKind = "warmup" | "run" | "walk" | "cooldown";
export type Phase = { kind: PhaseKind; sec: number };

export const PHASE_LABEL: Record<PhaseKind, string> = {
  warmup: "준비 걷기",
  run: "달리기",
  walk: "걷기",
  cooldown: "정리 걷기",
};

/** 한 회차 전체 — 준비 걷기 → 본운동 → 정리 걷기 */
export function sessionPhases(step: WalkRunStep): Phase[] {
  return [{ kind: "warmup", sec: WARMUP_SEC }, ...mainParts(step), { kind: "cooldown", sec: COOLDOWN_SEC }];
}

/** 한 회차 총 시간(초) — 준비·정리 걷기 포함 */
export function sessionTotalSec(step: WalkRunStep): number {
  return WARMUP_SEC + mainSec(step) + COOLDOWN_SEC;
}

/** start-running 표가 그리는 모양 그대로: [단계, 한 번에 할 것, 시간] */
export const WALK_RUN: [string, string, string][] = WALK_RUN_STEPS.map((s) => [
  s.key,
  describeMain(s),
  fmtDuration(mainSec(s)),
]);
