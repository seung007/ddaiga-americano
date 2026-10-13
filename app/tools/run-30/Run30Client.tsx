"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { gtagEvent } from "@/lib/gtag";
import {
  WALK_RUN_STEPS,
  SESSIONS_PER_STEP,
  MAX_REPEATS_BEFORE_STEP_DOWN,
  PHASE_LABEL,
  WARMUP_SEC,
  COOLDOWN_SEC,
  describeMain,
  fmtDuration,
  sessionPhases,
  sessionTotalSec,
  type Phase,
  type WalkRunStep,
} from "@/lib/guide/walkRun";

/**
 * 30분 달리기 따라 하기 — 클라이언트 (2026-10-13)
 *
 * 왜 이렇게 만들었나
 *   · 진도표는 lib/guide/walkRun.ts 하나에서 온다. 회차 총 시간도 거기서 계산한다(손으로 적은 숫자 없음).
 *   · 「넘어가는 조건」은 start-running 페이지의 저희 예시 그대로 — 3회 → 두 질문(대화·다음 날 아침) →
 *     둘 다 예면 다음 단계, 아니면 반복, 두 번 반복해도 안 되면 한 단계 내려가기를 **권한다**(강제하지 않는다).
 *   · 진행은 이 브라우저 localStorage(KEY)에만. 읽기·쓰기 전부 try/catch — 사생활 모드·저장소 차단에서도 화면은 뜬다.
 *     읽은 값은 믿지 않고 범위를 다시 맞춘다(sanitize). 다른 탭에서 바꾸면 storage 이벤트로 따라간다.
 *   · 타이머는 틱 수를 세지 않는다. 틱마다 Date.now() 차이를 더한다 — 백그라운드에서 setInterval 이
 *     1분에 한 번으로 느려져도 시간이 밀리지 않는다. 다만 한 틱의 차이가 MAX_TICK_JUMP_MS 를 넘으면
 *     (화면이 꺼져 JS 가 멈췄다 깨어난 경우·시계가 바뀐 경우) 그만큼만 더하고 「실제 시간과 다를 수 있다」고 화면에 알린다.
 *     멈춘 사이 사람이 계속 뛰었는지 우리는 모른다 — 모르는 것을 맞는 척 채우지 않는다.
 *   · 음성(speechSynthesis ko-KR)·진동·화면 켜짐 유지(wakeLock)는 있을 때만 쓴다. 화면이 꺼지면 소리가 멈출 수 있다고 적는다.
 *   · 「처음부터 다시」는 window.confirm 없이 두 번 눌러야 지워진다.
 *   · GA 에는 단계·회차 번호만 보낸다. 수료증 이름은 보내지도 저장하지도 않는다.
 */

const KEY = "run30-progress-v1";
const TOTAL_SESSIONS = WALK_RUN_STEPS.length * SESSIONS_PER_STEP;
const LAST = WALK_RUN_STEPS.length - 1;
/** 한 틱에 더할 최대 시간. 이보다 크면 JS 가 멈춰 있었던 것으로 본다(위 주석). */
const MAX_TICK_JUMP_MS = 5 * 60 * 1000;

type Entry = { s: number; n: number; d: string };
type Progress = {
  /** 지금 단계(0=A … 7=H) */
  step: number;
  /** 지금 단계에서 이번 시도에 한 회차 수(0~3) */
  done: number;
  /** 지금 단계에서 조건을 못 넘겨 반복한 횟수 */
  repeats: number;
  /** 한 회차 기록(반복 포함) */
  log: Entry[];
  /** H 단계 조건까지 통과한 날 */
  finishedOn: string | null;
};

const INITIAL: Progress = { step: 0, done: 0, repeats: 0, log: [], finishedOn: null };
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function intIn(v: unknown, lo: number, hi: number, fallback: number): number {
  return typeof v === "number" && Number.isInteger(v) && v >= lo && v <= hi ? v : fallback;
}

function sanitize(raw: unknown): Progress {
  if (!raw || typeof raw !== "object") return INITIAL;
  const r = raw as Record<string, unknown>;
  const log: Entry[] = Array.isArray(r.log)
    ? r.log
        .filter((e): e is Entry => {
          if (!e || typeof e !== "object") return false;
          const x = e as Record<string, unknown>;
          return (
            intIn(x.s, 0, LAST, -1) >= 0 &&
            intIn(x.n, 1, SESSIONS_PER_STEP, -1) >= 1 &&
            typeof x.d === "string" &&
            DATE_RE.test(x.d)
          );
        })
        .map((e) => ({ s: e.s, n: e.n, d: e.d }))
        .slice(-300)
    : [];
  const finishedOn = typeof r.finishedOn === "string" && DATE_RE.test(r.finishedOn) ? r.finishedOn : null;
  if (finishedOn) return { step: LAST, done: SESSIONS_PER_STEP, repeats: 0, log, finishedOn };
  return {
    step: intIn(r.step, 0, LAST, 0),
    done: intIn(r.done, 0, SESSIONS_PER_STEP, 0),
    repeats: intIn(r.repeats, 0, MAX_REPEATS_BEFORE_STEP_DOWN, 0),
    log,
    finishedOn: null,
  };
}

/*
 * 저장소 — useSyncExternalStore 로 읽는다(서버 렌더는 INITIAL, 마운트 뒤 실제 값. 다른 탭은 storage 이벤트).
 * localStorage 가 막혔거나 가득 차면 메모리에만 두고 이 화면에서만 유지한다.
 */
const listeners = new Set<() => void>();
let memoryRaw: string | null = null;
let useMemory = false;

function getRaw(): string | null {
  if (useMemory) return memoryRaw;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return memoryRaw;
  }
}

function setRaw(v: string) {
  try {
    window.localStorage.setItem(KEY, v);
    useMemory = false;
  } catch {
    useMemory = true;
  }
  memoryRaw = v;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) l();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

function parseRaw(raw: string | null): Progress {
  if (!raw) return INITIAL;
  try {
    return sanitize(JSON.parse(raw));
  } catch {
    return INITIAL;
  }
}

const noopSubscribe = () => () => {};

function localDate(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function koDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

function mmss(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** 준비 걷기 5분 → 본운동 → 정리 걷기 5분 */
function SessionSteps({ step }: { step: WalkRunStep }) {
  const items = [
    `${PHASE_LABEL.warmup} ${fmtDuration(WARMUP_SEC)}`,
    describeMain(step),
    `${PHASE_LABEL.cooldown} ${fmtDuration(COOLDOWN_SEC)}`,
  ];
  return (
    <ol className="mt-2 space-y-1">
      {items.map((t, i) => (
        <li key={i} className="flex min-w-0 gap-2 break-keep text-[15px] leading-[1.6] text-gray-800">
          <span
            aria-hidden
            className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-800"
          >
            {i + 1}
          </span>
          <span className="min-w-0">{t}</span>
        </li>
      ))}
    </ol>
  );
}

export default function Run30Client({ safety }: { safety: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getRaw, () => null);
  const p = useMemo(() => parseRaw(raw), [raw]);
  const today = useSyncExternalStore(noopSubscribe, () => localDate(), () => null);

  const commit = useCallback((next: Progress) => setRaw(JSON.stringify(next)), []);

  const finished = p.finishedOn !== null;
  const awaiting = !finished && p.done >= SESSIONS_PER_STEP;
  const current = !finished && !awaiting ? { s: p.step, n: p.done + 1 } : null;
  const position = finished ? TOTAL_SESSIONS : p.step * SESSIONS_PER_STEP + p.done;

  function markDone() {
    if (!current) return;
    const d = localDate();
    commit({ ...p, done: p.done + 1, log: [...p.log, { s: current.s, n: current.n, d }].slice(-300) });
    gtagEvent("run30_session_done", { step: WALK_RUN_STEPS[current.s].key, n: current.n });
  }

  function undoLast() {
    if (finished || p.done === 0) return;
    const last = p.log[p.log.length - 1];
    const log = last && last.s === p.step && last.n === p.done ? p.log.slice(0, -1) : p.log;
    commit({ ...p, done: p.done - 1, log });
  }

  function stepUp() {
    if (p.step >= LAST) {
      commit({ ...p, step: LAST, done: SESSIONS_PER_STEP, repeats: 0, finishedOn: localDate() });
      gtagEvent("run30_step_up", { step: "finish" });
      return;
    }
    commit({ ...p, step: p.step + 1, done: 0, repeats: 0 });
    gtagEvent("run30_step_up", { step: WALK_RUN_STEPS[p.step + 1].key });
  }

  function repeatStep() {
    commit({ ...p, done: 0, repeats: Math.min(p.repeats + 1, MAX_REPEATS_BEFORE_STEP_DOWN) });
  }

  function stepDown() {
    commit({ ...p, step: Math.max(0, p.step - 1), done: 0, repeats: 0 });
  }

  // 「처음부터 다시」 — 두 번 눌러야 지워진다
  const [confirmReset, setConfirmReset] = useState(false);
  useEffect(() => {
    if (!confirmReset) return;
    const t = setTimeout(() => setConfirmReset(false), 5000);
    return () => clearTimeout(t);
  }, [confirmReset]);
  function onReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    setConfirmReset(false);
    commit(INITIAL);
  }

  // 달리는 날 사이 하루 쉬기 — 마지막 기록 날짜로 안내만 한다
  const lastDay = p.log.length ? p.log[p.log.length - 1].d : null;
  let restHint: string | null = null;
  if (today && lastDay && !finished) {
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);
    if (lastDay === today) restHint = "오늘 이미 한 회차를 했습니다. 다음 회차는 하루 쉬고 합니다.";
    else if (lastDay === localDate(yest)) restHint = "어제 달렸습니다. 달리는 날 사이에 하루 쉬기를 권합니다.";
  }

  const timerStepIdx = current ? current.s : finished ? LAST : null;

  return (
    <div className="mt-8 min-w-0">
      {/* ── 오늘 할 회차 / 조건 확인 / 완주 ─────────────────────── */}
      {current && (
        <section
          aria-label="오늘 할 회차"
          className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/60 px-4 py-4 print:hidden"
        >
          <p className="text-xs font-bold text-emerald-700">오늘 할 회차</p>
          <h2 className="mt-1 break-keep text-[22px] font-bold text-gray-900">
            {WALK_RUN_STEPS[current.s].key}단계 {current.n}회차
          </h2>
          <SessionSteps step={WALK_RUN_STEPS[current.s]} />
          <p className="mt-2 text-sm text-gray-600">
            총 <strong className="text-gray-900">{fmtDuration(sessionTotalSec(WALK_RUN_STEPS[current.s]))}</strong> (준비·정리
            걷기 포함)
          </p>
          {restHint && <p className="mt-2 break-keep text-sm text-amber-800">※ {restHint}</p>}
        </section>
      )}

      {awaiting && (
        <ConditionCheck
          key={`${p.step}-${p.repeats}`}
          stepIdx={p.step}
          repeats={p.repeats}
          onUp={stepUp}
          onRepeat={repeatStep}
          onDown={stepDown}
          onUndo={undoLast}
        />
      )}

      {finished && p.finishedOn && <Certificate finishedOn={p.finishedOn} />}

      {timerStepIdx !== null && (
        <IntervalTimer
          key={current ? `${current.s}-${current.n}` : "finished"}
          step={WALK_RUN_STEPS[timerStepIdx]}
          sessionLabel={
            current ? `${WALK_RUN_STEPS[current.s].key}단계 ${current.n}회차` : `${WALK_RUN_STEPS[LAST].key}단계 다시 달리기`
          }
          n={current ? current.n : 0}
          onMarkDone={current ? markDone : undefined}
        />
      )}

      {current && (
        <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-3 text-[15px] font-semibold text-emerald-800 hover:bg-emerald-50 print:hidden">
          <input type="checkbox" checked={false} onChange={markDone} className="h-5 w-5 accent-emerald-600" />
          {WALK_RUN_STEPS[current.s].key}단계 {current.n}회차 했어요
        </label>
      )}

      {/* ── 진행 ─────────────────────────────────────────── */}
      <section aria-label="진행 상황" className="mt-6">
        <div className="flex min-w-0 items-baseline justify-between gap-3">
          <p className="text-[15px] font-semibold text-gray-900">
            {TOTAL_SESSIONS}회 중 <span className="text-emerald-700">{position}회</span>
          </p>
          {p.log.length !== position && (
            <p className="shrink-0 text-xs text-gray-500">반복 포함 {p.log.length}회 달림</p>
          )}
        </div>
        <div
          className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-gray-100"
          role="progressbar"
          aria-label="플랜 진행"
          aria-valuemin={0}
          aria-valuemax={TOTAL_SESSIONS}
          aria-valuenow={position}
        >
          <div className="h-full rounded-full bg-emerald-500 transition-[width]" style={{ width: `${(position / TOTAL_SESSIONS) * 100}%` }} />
        </div>
        <p className="mt-2 break-keep text-sm leading-[1.7] text-gray-600">
          <strong className="text-gray-800">반복해도 괜찮습니다.</strong> 같은 단계를 여러 번 하거나 한 단계 내려가는 것도 계획의
          일부입니다. H까지 8주보다 오래 걸려도 정상입니다.
        </p>
      </section>

      {/* ── 멈추는 신호 — 접지 않는다 ───────────────────────── */}
      {safety}

      {/* ── 전체 플랜 ─────────────────────────────────────── */}
      <section aria-label="전체 플랜" className="mt-10">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
          <h2 className="break-keep text-[20px] font-bold text-gray-900">전체 플랜 — 8단계 24회</h2>
          <button
            type="button"
            onClick={() => window.print()}
            className="shrink-0 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 print:hidden"
          >
            인쇄하기
          </button>
        </div>
        <p className="mt-1 break-keep text-sm text-gray-500">회차마다 같은 순서로 합니다. 시간은 준비·정리 걷기 5분씩을 포함합니다.</p>

        <div className="mt-4 space-y-3">
          {WALK_RUN_STEPS.map((st, si) => {
            const total = fmtDuration(sessionTotalSec(st));
            const isCurrentStep = !finished && si === p.step;
            return (
              <div
                key={st.key}
                className={`min-w-0 rounded-xl border px-4 py-3 break-inside-avoid ${
                  isCurrentStep ? "border-emerald-300 bg-emerald-50/40" : "border-gray-200"
                }`}
              >
                <p className="flex min-w-0 flex-wrap items-baseline gap-x-2 text-[15px] font-bold text-gray-900">
                  {st.key}단계
                  <span className="text-sm font-normal text-gray-500">한 회차 총 {total}</span>
                  {isCurrentStep && p.repeats > 0 && (
                    <span className="text-xs font-medium text-amber-700">반복 {p.repeats}번째</span>
                  )}
                </p>
                <SessionSteps step={st} />
                <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
                  {Array.from({ length: SESSIONS_PER_STEP }, (_, i) => i + 1).map((n) => {
                    const isDone = finished || si < p.step || (si === p.step && n <= p.done);
                    const isToday = !!current && current.s === si && current.n === n;
                    const canUndo = !finished && si === p.step && n === p.done && p.done > 0;
                    const enabled = isToday || canUndo;
                    return (
                      <li key={n}>
                        <label
                          className={`flex min-w-0 items-center gap-2 rounded-lg px-2.5 py-2 text-sm ${
                            isToday
                              ? "bg-emerald-100 font-semibold text-emerald-900 ring-1 ring-emerald-400"
                              : isDone
                                ? "text-gray-700"
                                : "text-gray-400"
                          } ${enabled ? "cursor-pointer" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={isDone}
                            disabled={!enabled}
                            onChange={isToday ? markDone : undoLast}
                            aria-label={`${st.key}단계 ${n}회차 했어요`}
                            className="h-4 w-4 shrink-0 accent-emerald-600"
                          />
                          <span className="min-w-0 break-keep">
                            {st.key}단계 {n}회차
                            <span className="ml-1 text-xs font-normal text-gray-500">· {total}</span>
                            {isToday && <span className="ml-1 text-xs font-bold text-emerald-700">오늘</span>}
                            {isDone && !isToday && <span className="ml-1 text-xs font-normal text-emerald-700">했어요</span>}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 저장 안내 · 처음부터 다시 ───────────────────────── */}
      <div className="mt-8 flex min-w-0 flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <p className="break-keep text-xs leading-relaxed text-gray-500">
          진행 상황은 이 브라우저에만 저장됩니다. 다른 기기와 이어지지 않고, 사이트 데이터를 지우면 사라집니다.
        </p>
        <button
          type="button"
          onClick={onReset}
          className={`shrink-0 rounded-lg border px-3 py-2 text-sm ${
            confirmReset ? "border-red-300 bg-red-50 font-semibold text-red-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {confirmReset ? "한 번 더 누르면 기록이 지워집니다" : "처음부터 다시"}
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── */

function ConditionCheck({
  stepIdx,
  repeats,
  onUp,
  onRepeat,
  onDown,
  onUndo,
}: {
  stepIdx: number;
  repeats: number;
  onUp: () => void;
  onRepeat: () => void;
  onDown: () => void;
  onUndo: () => void;
}) {
  const [talk, setTalk] = useState<boolean | null>(null);
  const [noPain, setNoPain] = useState<boolean | null>(null);
  const key = WALK_RUN_STEPS[stepIdx].key;
  const isLast = stepIdx === LAST;
  const answered = talk !== null && noPain !== null;
  const pass = talk === true && noPain === true;
  const suggestDown = answered && !pass && repeats >= MAX_REPEATS_BEFORE_STEP_DOWN;

  const question = (q: string, v: boolean | null, set: (b: boolean) => void) => (
    <div className="mt-3">
      <p className="break-keep text-[15px] font-semibold text-gray-900">{q}</p>
      <div className="mt-1.5 flex gap-2">
        {[true, false].map((b) => (
          <button
            key={String(b)}
            type="button"
            aria-pressed={v === b}
            onClick={() => set(b)}
            className={`min-w-[72px] rounded-lg border px-4 py-2 text-sm font-medium ${
              v === b
                ? b
                  ? "border-emerald-500 bg-emerald-600 text-white"
                  : "border-amber-500 bg-amber-500 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {b ? "예" : "아니요"}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <section aria-label="다음 단계 확인" className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/60 px-4 py-4 print:hidden">
      <p className="text-xs font-bold text-emerald-700">{key}단계 3회를 마쳤습니다</p>
      <h2 className="mt-1 break-keep text-[20px] font-bold text-gray-900">다음 단계로 넘어가도 될까요?</h2>
      <p className="mt-1 break-keep text-sm text-gray-600">3회차 다음 날 아침에 답하세요.</p>
      {question("① 달리는 동안 대화가 됐나요?", talk, setTalk)}
      {question("② 다음 날 아침 아프지 않았나요?", noPain, setNoPain)}

      {answered && pass && (
        <div className="mt-4">
          <p className="break-keep text-[15px] text-gray-800">
            {isLast ? "H단계까지 마쳤습니다. 30분을 쉬지 않고 달렸습니다." : `${WALK_RUN_STEPS[stepIdx + 1].key}단계로 넘어갑니다.`}
          </p>
          <button
            type="button"
            onClick={onUp}
            className="mt-2 w-full rounded-xl bg-emerald-600 px-4 py-3 text-[15px] font-semibold text-white hover:bg-emerald-700"
          >
            {isLast ? "완주 — 수료증 만들기" : `${WALK_RUN_STEPS[stepIdx + 1].key}단계 시작`}
          </button>
        </div>
      )}

      {answered && !pass && !suggestDown && (
        <div className="mt-4">
          <p className="break-keep text-[15px] text-gray-800">
            같은 {key}단계를 한 번 더 합니다. 반복해도 괜찮습니다.
          </p>
          <button
            type="button"
            onClick={onRepeat}
            className="mt-2 w-full rounded-xl bg-emerald-600 px-4 py-3 text-[15px] font-semibold text-white hover:bg-emerald-700"
          >
            {key}단계 다시 하기
          </button>
        </div>
      )}

      {suggestDown && (
        <div className="mt-4">
          {stepIdx > 0 ? (
            <>
              <p className="break-keep text-[15px] text-gray-800">
                두 번 반복해도 안 됐습니다. 한 단계 내려가 {WALK_RUN_STEPS[stepIdx - 1].key}단계부터 다시 하기를 권합니다.
              </p>
              <button
                type="button"
                onClick={onDown}
                className="mt-2 w-full rounded-xl bg-emerald-600 px-4 py-3 text-[15px] font-semibold text-white hover:bg-emerald-700"
              >
                {WALK_RUN_STEPS[stepIdx - 1].key}단계로 내려가기
              </button>
              <button
                type="button"
                onClick={onRepeat}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                그래도 {key}단계를 한 번 더
              </button>
            </>
          ) : (
            <>
              <p className="break-keep text-[15px] text-gray-800">
                A단계는 더 내려갈 단계가 없습니다. 같은 단계를 이어서 하셔도 괜찮습니다.
              </p>
              <button
                type="button"
                onClick={onRepeat}
                className="mt-2 w-full rounded-xl bg-emerald-600 px-4 py-3 text-[15px] font-semibold text-white hover:bg-emerald-700"
              >
                A단계 다시 하기
              </button>
            </>
          )}
        </div>
      )}

      {answered && noPain === false && (
        <p className="mt-3 break-keep text-sm text-red-800">아픈 게 이어지면 아래 「그날은 멈추는 신호」를 먼저 확인하세요.</p>
      )}

      <button type="button" onClick={onUndo} className="mt-3 text-xs text-gray-500 underline">
        3회차를 잘못 눌렀어요 (되돌리기)
      </button>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────── */

function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
}

function speak(text: string) {
  if (!canSpeak()) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ko-KR";
    window.speechSynthesis.speak(u);
  } catch {
    /* 음성이 안 되면 화면만 */
  }
}

function vibrate(pattern: number | number[]) {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") navigator.vibrate(pattern);
  } catch {
    /* 진동 미지원 */
  }
}

function phaseCue(ph: Phase): string {
  return `${PHASE_LABEL[ph.kind]} ${fmtDuration(ph.sec)}`;
}

function IntervalTimer({
  step,
  sessionLabel,
  n,
  onMarkDone,
}: {
  step: WalkRunStep;
  sessionLabel: string;
  n: number;
  onMarkDone?: () => void;
}) {
  const phases = useMemo(() => sessionPhases(step), [step]);
  /** 각 구간이 끝나는 시점(ms) */
  const ends = useMemo(
    () => phases.reduce<number[]>((a, ph) => [...a, (a.length ? a[a.length - 1] : 0) + ph.sec * 1000], []),
    [phases],
  );
  const totalMs = ends[ends.length - 1];

  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [gap, setGap] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const voiceSupported = useSyncExternalStore(noopSubscribe, canSpeak, () => true);
  const wakeSupported = useSyncExternalStore(noopSubscribe, () => "wakeLock" in navigator, () => false);
  const [wakeActive, setWakeActive] = useState(false);

  const elapsedRef = useRef(0);
  const lastTickRef = useRef(0);
  const phaseRef = useRef(-1);
  const voiceRef = useRef(true);
  const wakeRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    voiceRef.current = voiceOn;
  }, [voiceOn]);

  const phaseAt = useCallback(
    (ms: number) => {
      const i = ends.findIndex((e) => ms < e);
      return i === -1 ? phases.length - 1 : i;
    },
    [ends, phases.length],
  );

  const releaseWake = useCallback(() => {
    const s = wakeRef.current;
    wakeRef.current = null;
    setWakeActive(false);
    if (s) s.release().catch(() => {});
  }, []);

  const requestWake = useCallback(async () => {
    if (typeof navigator === "undefined" || !("wakeLock" in navigator) || wakeRef.current) return;
    try {
      const s = await navigator.wakeLock.request("screen");
      wakeRef.current = s;
      setWakeActive(true);
      s.addEventListener("release", () => {
        if (wakeRef.current === s) wakeRef.current = null;
        setWakeActive(false);
      });
    } catch {
      /* 배터리 절약 모드 등에서 거절될 수 있다 */
    }
  }, []);

  const cue = useCallback((text: string, pattern: number | number[]) => {
    if (voiceRef.current) speak(text);
    vibrate(pattern);
  }, []);

  const tick = useCallback(() => {
    if (elapsedRef.current >= totalMs) return; // 이미 끝남 — 정리 전 남은 틱이 「끝」을 두 번 말하지 않게
    const now = Date.now();
    let delta = now - lastTickRef.current;
    lastTickRef.current = now;
    if (delta < 0) delta = 0;
    if (delta > MAX_TICK_JUMP_MS) {
      delta = MAX_TICK_JUMP_MS;
      setGap(true);
    }
    const next = Math.min(totalMs, elapsedRef.current + delta);
    elapsedRef.current = next;
    setElapsed(next);

    if (next >= totalMs) {
      setRunning(false);
      releaseWake();
      phaseRef.current = phases.length;
      cue("끝났습니다. 수고하셨습니다.", [400, 150, 400, 150, 400]);
      return;
    }
    const idx = phaseAt(next);
    if (idx !== phaseRef.current) {
      phaseRef.current = idx;
      // 여러 구간을 한 번에 건너뛰었으면 지금 구간만 알린다
      const ph = phases[idx];
      cue(phaseCue(ph), ph.kind === "run" ? [300, 120, 300] : [600]);
    }
  }, [totalMs, phases, phaseAt, cue, releaseWake]);

  useEffect(() => {
    if (!running) return;
    lastTickRef.current = Date.now();
    const id = setInterval(tick, 250);
    const onVis = () => {
      if (document.visibilityState === "visible") {
        tick();
        // 화면이 숨으면 wake lock 은 브라우저가 풀어 버린다 — 돌아오면 다시 잡는다
        void requestWake();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [running, tick, requestWake]);

  // 화면을 떠나면 화면 켜짐 유지를 푼다
  useEffect(() => () => releaseWake(), [releaseWake]);

  const ended = elapsed >= totalMs;

  function start() {
    let base = elapsedRef.current;
    if (base >= totalMs) {
      base = 0;
      elapsedRef.current = 0;
      setElapsed(0);
      phaseRef.current = -1;
    }
    const fresh = base === 0;
    const idx = phaseAt(base);
    phaseRef.current = idx;
    // 클릭 안에서 바로 말해야 iOS 가 음성을 허락한다
    if (fresh) cue(`시작합니다. ${phaseCue(phases[idx])}`, [200]);
    else cue(`다시 시작합니다. ${PHASE_LABEL[phases[idx].kind]}`, [200]);
    lastTickRef.current = Date.now();
    setRunning(true);
    void requestWake();
    if (fresh) gtagEvent("run30_timer_start", { step: step.key, n });
  }

  function pause() {
    tick();
    setRunning(false);
    releaseWake();
    if (canSpeak()) window.speechSynthesis.cancel();
  }

  function reset() {
    setRunning(false);
    releaseWake();
    if (canSpeak()) window.speechSynthesis.cancel();
    elapsedRef.current = 0;
    phaseRef.current = -1;
    setElapsed(0);
    setGap(false);
  }

  const idx = ended ? phases.length - 1 : phaseAt(elapsed);
  const ph = phases[idx];
  const phaseRemain = ended ? 0 : ends[idx] - elapsed;
  const nextPh = !ended && idx + 1 < phases.length ? phases[idx + 1] : null;
  const isRun = ph.kind === "run";

  return (
    <section aria-label="인터벌 타이머" className="mt-4 rounded-2xl border border-gray-200 bg-white px-4 py-4 print:hidden">
      <div className="flex min-w-0 items-center justify-between gap-2">
        <p className="min-w-0 break-keep text-sm font-semibold text-gray-700">타이머 · {sessionLabel}</p>
        {voiceSupported && (
          <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-gray-600">
            <input type="checkbox" checked={voiceOn} onChange={(e) => setVoiceOn(e.target.checked)} className="accent-emerald-600" />
            음성 안내
          </label>
        )}
      </div>

      <div
        className={`mt-3 rounded-xl px-4 py-5 text-center ${
          ended ? "bg-gray-50" : isRun ? "bg-emerald-600 text-white" : "bg-sky-50 text-sky-950"
        }`}
        aria-live="polite"
      >
        {ended ? (
          <p className="text-[28px] font-bold text-gray-900">끝났습니다</p>
        ) : (
          <>
            <p className="text-[32px] font-extrabold leading-none">{PHASE_LABEL[ph.kind]}</p>
            <p className="mt-2 font-mono text-[56px] font-bold leading-none tabular-nums" aria-label={`남은 시간 ${mmss(phaseRemain)}`}>
              {mmss(phaseRemain)}
            </p>
            <p className={`mt-3 text-sm ${isRun ? "text-emerald-50" : "text-sky-800"}`}>
              다음: {nextPh ? phaseCue(nextPh) : "끝"}
            </p>
          </>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500 tabular-nums">
        <span>
          구간 {Math.min(idx + 1, phases.length)}/{phases.length}
        </span>
        <span>
          {mmss(elapsed)} / {mmss(totalMs)}
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div className="h-full bg-emerald-500" style={{ width: `${(elapsed / totalMs) * 100}%` }} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {running ? (
          <button type="button" onClick={pause} className="rounded-xl bg-gray-900 px-4 py-3 text-[15px] font-semibold text-white">
            일시정지
          </button>
        ) : (
          <button
            type="button"
            onClick={start}
            className="rounded-xl bg-emerald-600 px-4 py-3 text-[15px] font-semibold text-white hover:bg-emerald-700"
          >
            {elapsed === 0 || ended ? "시작" : "이어서"}
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          disabled={elapsed === 0 && !running}
          className="rounded-xl border border-gray-200 px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          처음으로
        </button>
      </div>

      {ended && onMarkDone && (
        <button
          type="button"
          onClick={onMarkDone}
          className="mt-2 w-full rounded-xl border border-emerald-400 bg-emerald-50 px-4 py-3 text-[15px] font-semibold text-emerald-800"
        >
          {sessionLabel} 했어요 표시
        </button>
      )}

      {gap && (
        <p className="mt-3 break-keep text-sm text-amber-800">
          ※ 화면이 꺼져 있던 동안 타이머가 멈췄습니다. 표시된 시간이 실제와 다를 수 있습니다.
        </p>
      )}
      <ul className="mt-3 space-y-1 break-keep text-xs leading-relaxed text-gray-500">
        <li>※ 화면이 꺼지면 소리가 멈출 수 있습니다. 가능하면 화면을 켜 둔 채로 쓰세요.</li>
        {wakeSupported ? (
          <li>※ 타이머가 도는 동안 화면 꺼짐을 막습니다{wakeActive ? " (지금 켜짐 유지 중)" : ""}.</li>
        ) : (
          <li>※ 이 브라우저는 화면 켜짐 유지를 지원하지 않습니다.</li>
        )}
        {!voiceSupported && <li>※ 이 브라우저는 음성 안내를 지원하지 않습니다. 화면과 진동으로만 알립니다.</li>}
      </ul>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────── */

const FONT = `system-ui, -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif`;

function Certificate({ finishedOn }: { finishedOn: string }) {
  const [name, setName] = useState("");

  function download() {
    const W = 1200;
    const H = 848;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#059669";
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, W - 80, H - 80);
    ctx.strokeStyle = "#a7f3d0";
    ctx.lineWidth = 2;
    ctx.strokeRect(58, 58, W - 116, H - 116);

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "#047857";
    ctx.font = `600 26px ${FONT}`;
    ctx.fillText("뛰다가 아메리카노 · 30분 달리기 따라 하기", W / 2, 150);

    ctx.fillStyle = "#111827";
    ctx.font = `800 76px ${FONT}`;
    ctx.fillText("수료증", W / 2, 260);

    ctx.fillStyle = "#10b981";
    ctx.fillRect(W / 2 - 50, 292, 100, 6);

    const who = name.trim().slice(0, 20);
    if (who) {
      let size = 56;
      ctx.fillStyle = "#111827";
      do {
        ctx.font = `700 ${size}px ${FONT}`;
        size -= 4;
      } while (ctx.measureText(`${who} 님`).width > W - 260 && size > 24);
      ctx.fillText(`${who} 님`, W / 2, 400);
    }

    ctx.fillStyle = "#374151";
    ctx.font = `400 32px ${FONT}`;
    ctx.fillText("걷기와 달리기를 섞은 8단계를 차례로 마치고", W / 2, who ? 490 : 440);
    ctx.fillText("30분을 쉬지 않고 달렸습니다.", W / 2, who ? 540 : 490);

    ctx.fillStyle = "#6b7280";
    ctx.font = `400 26px ${FONT}`;
    ctx.fillText(koDate(finishedOn), W / 2, 650);

    ctx.fillStyle = "#9ca3af";
    ctx.font = `400 20px ${FONT}`;
    ctx.fillText("ddaiga-americano.vercel.app", W / 2, H - 100);

    const filename = `running-30min-${finishedOn}.png`;
    const save = (href: string, revoke: boolean) => {
      const a = document.createElement("a");
      a.href = href;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      if (revoke) setTimeout(() => URL.revokeObjectURL(href), 1000);
    };
    if (typeof c.toBlob === "function") {
      c.toBlob((blob) => {
        if (blob) save(URL.createObjectURL(blob), true);
        else save(c.toDataURL("image/png"), false);
      }, "image/png");
    } else {
      save(c.toDataURL("image/png"), false);
    }
    gtagEvent("run30_certificate", {});
  }

  return (
    <section aria-label="수료증" className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/60 px-4 py-4">
      <p className="text-xs font-bold text-emerald-700">{koDate(finishedOn)} 완주</p>
      <h2 className="mt-1 break-keep text-[22px] font-bold text-gray-900">30분을 쉬지 않고 달렸습니다</h2>
      <p className="mt-1 break-keep text-sm text-gray-600">이름을 넣으면 수료증 그림(PNG)을 내려받습니다. 이름은 저장하지도 보내지도 않습니다.</p>
      <div className="mt-3 flex min-w-0 flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={name}
          maxLength={20}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름 (선택)"
          aria-label="수료증에 넣을 이름"
          className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-[15px]"
        />
        <button
          type="button"
          onClick={download}
          className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2.5 text-[15px] font-semibold text-white hover:bg-emerald-700"
        >
          수료증 내려받기
        </button>
      </div>
    </section>
  );
}
