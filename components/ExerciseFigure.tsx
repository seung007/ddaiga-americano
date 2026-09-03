"use client";

import { useId, useState } from "react";

/**
 * 준비운동 동작 그림 — 2026-09-03
 *
 * 왜 직접 그리나
 * ─────────────
 * 신발 이미지 52개 중 40개가 경쟁사(RunRepeat) CDN 핫링크다. 남의 대역폭을 쓰고,
 * 그쪽이 referer를 막으면 한꺼번에 깨진다. **같은 부채를 동작 그림으로 또 만들지 않는다.**
 * 직접 그린 SVG는 링크가 죽지 않고, 저작권 문제가 없고, 클릭해서 사이트를 떠나지도 않는다.
 *
 * 근거에 대한 정직한 위치
 * ─────────────────────
 * **이 그림은 논문 근거가 아니다.** 동적 워밍업 루틴의 개별 동작 폼은 통용 관행이고,
 * "무릎을 몇 도까지 올려야 한다" 같은 수치를 뒷받침하는 연구를 확인하지 않았다.
 * 그래서 배지를 `practice`로 단다. 그림은 **동작을 알아보게 하는 도식**이지
 * 자세를 교정해주는 자료가 아니며, 페이지에 그렇게 적는다.
 *
 * 접근성
 * ──────
 * `prefers-reduced-motion`을 존중한다. 움직임에 민감한 사람에게 반복 애니메이션은
 * 실제로 불편을 준다. 이 경우 정지 상태로 보이고, 재생 버튼으로 직접 켤 수 있다.
 */

export type Move =
  | "march"        // 제자리 걷기
  | "legSwing"     // 레그 스윙 (앞뒤)
  | "hipCircle"    // 힙 써클
  | "lunge"        // 워킹 런지
  | "highKnees"    // 하이 니즈
  | "buttKicks";   // 버트 킥스

/**
 * 발이 땅에 붙어 있어야 하는 동작인가.
 *
 * 2026-09-03: 브라우저로 실제 렌더를 보고 나서 추가했다.
 * 힙 써클이 **발까지 좌우로 12px 미끄러지고 있었다** — 몸 전체(`.body`)를 옮겼기 때문이다.
 * 힙 써클은 발을 붙이고 골반만 돌리는 동작이라 그건 오류다.
 *
 * 반대로 **워킹 런지는 발이 실제로 이동하는 동작**이다. 여기에 "발 고정" 규칙을
 * 들이대면 맞는 것을 틀렸다고 하게 된다. 그래서 동작마다 선언하고, 검사기가 그 선언을 읽는다.
 *
 *   planted  — 접지한 발은 좌우로 움직이면 안 된다. 드는 발은 **땅에서 떠야** 이동할 수 있다
 *   stepping — 발이 이동해도 된다 (제자리 동작이 아님)
 */
export const FOOT_MODE: Record<Move, "planted" | "stepping"> = {
  march: "planted",
  legSwing: "planted",
  hipCircle: "planted",
  lunge: "stepping",
  highKnees: "planted",
  buttKicks: "planted",
};

/**
 * 동작별 키프레임. 관절 회전만 쓴다 — 막대 그림이라 그 이상은 과장이 된다.
 *
 * **부호 규칙: 오른쪽을 보는 측면 뷰. 음수 = 앞(오른쪽)으로.**
 * 처음에는 다리를 좌우로 벌린 정면 뷰로 그려놓고 측면 동작(레그 스윙·버트 킥스)을
 * 넣었더니, 회전이 "앞뒤로 흔들기"가 아니라 "옆으로 뻗기"로 보였다.
 * 다리를 거의 수직으로 모아 측면 뷰로 바꾸고 각도를 전부 다시 풀었다.
 *
 * 각도는 눈대중이 아니라 `scripts/check-figures.mjs`와 같은 기하로 수치 계산해서 뽑았다 —
 * 처음에 눈대중으로 넣었을 때 런지의 두 발이 바닥선을 뚫었다.
 */
const KEYFRAMES: Record<Move, string> = {
  // 한쪽 무릎을 들어올리고 반대쪽으로 교대. 드는 발은 17px 떠 있어 미끄러지지 않는다.
  march: `
    @keyframes ef-thighL { 0%,100% { transform: rotate(0deg) }   50% { transform: rotate(-56deg) } }
    @keyframes ef-shinL  { 0%,100% { transform: rotate(0deg) }   50% { transform: rotate(78deg) } }
    @keyframes ef-thighR { 0%,100% { transform: rotate(-56deg) } 50% { transform: rotate(0deg) } }
    @keyframes ef-shinR  { 0%,100% { transform: rotate(78deg) }  50% { transform: rotate(0deg) } }
    @keyframes ef-armL   { 0%,100% { transform: rotate(20deg) }  50% { transform: rotate(-20deg) } }
    @keyframes ef-armR   { 0%,100% { transform: rotate(-20deg) } 50% { transform: rotate(20deg) } }
    @keyframes ef-upper  { 0%,100% { transform: translateY(0) } }
    @keyframes ef-body   { 0%,100% { transform: translateY(0) } }
  `,
  // 한 다리만 앞뒤로 흔든다. 반대 다리는 완전히 고정(지지발), 팔 하나로 벽을 짚는다.
  legSwing: `
    @keyframes ef-thighL { 0%,100% { transform: rotate(28deg) }  50% { transform: rotate(-40deg) } }
    @keyframes ef-shinL  { 0%,100% { transform: rotate(-6deg) }  50% { transform: rotate(8deg) } }
    @keyframes ef-thighR { 0%,100% { transform: rotate(0deg) } }
    @keyframes ef-shinR  { 0%,100% { transform: rotate(0deg) } }
    @keyframes ef-armL   { 0%,100% { transform: rotate(-72deg) } }
    @keyframes ef-armR   { 0%,100% { transform: rotate(8deg) } }
    @keyframes ef-upper  { 0%,100% { transform: translateY(0) } }
    @keyframes ef-body   { 0%,100% { transform: translateY(0) } }
  `,
  // **다리는 건드리지 않는다.** 상체(`.upper`)만 원을 그린다 —
  // 예전에는 `.body` 전체를 옮겨서 발이 12px 미끄러졌다.
  hipCircle: `
    @keyframes ef-thighL { 0%,100% { transform: rotate(0deg) } }
    @keyframes ef-shinL  { 0%,100% { transform: rotate(0deg) } }
    @keyframes ef-thighR { 0%,100% { transform: rotate(0deg) } }
    @keyframes ef-shinR  { 0%,100% { transform: rotate(0deg) } }
    @keyframes ef-armL   { 0%,100% { transform: rotate(-38deg) } }
    @keyframes ef-armR   { 0%,100% { transform: rotate(38deg) } }
    @keyframes ef-upper {
      0%,100% { transform: translate(0, 0) rotate(0deg) }
      25%     { transform: translate(9px, -2px) rotate(7deg) }
      50%     { transform: translate(0, 3px) rotate(0deg) }
      75%     { transform: translate(-9px, -2px) rotate(-7deg) }
    }
    @keyframes ef-body   { 0%,100% { transform: translateY(0) } }
  `,
  // **워킹 런지는 발이 실제로 이동하는 동작**이라 FOOT_MODE가 "stepping"이다.
  // 두 발이 바닥(y 153·156)에 닿은 채 보폭 65px이 나오는 각도를 수치로 풀었다.
  lunge: `
    @keyframes ef-thighL { 0%,100% { transform: rotate(0deg) }   50% { transform: rotate(-46deg) } }
    @keyframes ef-shinL  { 0%,100% { transform: rotate(0deg) }   50% { transform: rotate(20deg) } }
    @keyframes ef-thighR { 0%,100% { transform: rotate(0deg) }   50% { transform: rotate(42deg) } }
    @keyframes ef-shinR  { 0%,100% { transform: rotate(0deg) }   50% { transform: rotate(-26deg) } }
    @keyframes ef-armL   { 0%,100% { transform: rotate(4deg) }   50% { transform: rotate(-16deg) } }
    @keyframes ef-armR   { 0%,100% { transform: rotate(-4deg) }  50% { transform: rotate(16deg) } }
    @keyframes ef-upper  { 0%,100% { transform: translateY(0) } }
    @keyframes ef-body   { 0%,100% { transform: translateY(0) }  50% { transform: translateY(8px) } }
  `,
  // 무릎이 골반 높이(y≈101)까지 올라오고 발은 21px 떠 있다.
  highKnees: `
    @keyframes ef-thighL { 0%,100% { transform: rotate(0deg) }   50% { transform: rotate(-65deg) } }
    @keyframes ef-shinL  { 0%,100% { transform: rotate(0deg) }   50% { transform: rotate(60deg) } }
    @keyframes ef-thighR { 0%,100% { transform: rotate(-65deg) } 50% { transform: rotate(0deg) } }
    @keyframes ef-shinR  { 0%,100% { transform: rotate(60deg) }  50% { transform: rotate(0deg) } }
    @keyframes ef-armL   { 0%,100% { transform: rotate(36deg) }  50% { transform: rotate(-30deg) } }
    @keyframes ef-armR   { 0%,100% { transform: rotate(-30deg) } 50% { transform: rotate(36deg) } }
    @keyframes ef-upper  { 0%,100% { transform: translateY(0) } }
    @keyframes ef-body   { 0%,100% { transform: translateY(0) }  50% { transform: translateY(-3px) } }
  `,
  // 뒤꿈치가 엉덩이 쪽으로 접힌다. 정강이만 크게 돌리고 허벅지는 거의 제자리.
  buttKicks: `
    @keyframes ef-thighL { 0%,100% { transform: rotate(0deg) }   50% { transform: rotate(5deg) } }
    @keyframes ef-shinL  { 0%,100% { transform: rotate(0deg) }   50% { transform: rotate(105deg) } }
    @keyframes ef-thighR { 0%,100% { transform: rotate(5deg) }   50% { transform: rotate(0deg) } }
    @keyframes ef-shinR  { 0%,100% { transform: rotate(105deg) } 50% { transform: rotate(0deg) } }
    @keyframes ef-armL   { 0%,100% { transform: rotate(30deg) }  50% { transform: rotate(-24deg) } }
    @keyframes ef-armR   { 0%,100% { transform: rotate(-24deg) } 50% { transform: rotate(30deg) } }
    @keyframes ef-upper  { 0%,100% { transform: translateY(0) } }
    @keyframes ef-body   { 0%,100% { transform: translateY(0) }  50% { transform: translateY(-2px) } }
  `,
};

/** 동작마다 리듬이 다르다. 하이 니즈는 빠르고 런지는 느리다. */
const DURATION: Record<Move, number> = {
  march: 1.4,
  legSwing: 1.8,
  hipCircle: 2.4,
  lunge: 2.6,
  highKnees: 0.7,
  buttKicks: 0.8,
};

export default function ExerciseFigure({
  move,
  title,
  reps,
  cue,
}: {
  move: Move;
  title: string;
  /** 횟수·시간 */
  reps: string;
  /** 이 동작에서 가장 흔한 실수 한 줄 */
  cue: string;
}) {
  // `useId()`는 ":r0:" 같은 값이라 CSS 클래스로 쓰려면 기호를 걷어내야 하고,
  // 숫자로 시작하면 무효한 선택자가 되므로 반드시 글자를 앞에 붙인다.
  const uid = "ef" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const [playing, setPlaying] = useState(true);
  const dur = DURATION[move];
  const state = playing ? "running" : "paused";

  // ⚠️ `@keyframes` 이름은 **문서 전역**이다.
  // 인스턴스마다 `ef-thighL`을 서로 다른 내용으로 정의하면 마지막 정의가 전부를 덮어써서
  // **6개 동작이 전부 같은 모양으로 움직인다.** 그래서 이름에 동작명을 넣어 분리한다.
  // 같은 동작이 두 번 쓰이면 정의가 중복되지만 내용이 같으므로 무해하다.
  const kf = KEYFRAMES[move].replace(/ef-/g, `ef-${move}-`);
  const anim = (n: string) => `ef-${move}-${n}`;

  return (
    <figure className="rounded-2xl border border-gray-200 p-4">
      <style>{`
        ${kf}
        .${uid} g { transform-box: view-box; }
        .${uid} .body   { transform-origin: 60px 88px;  animation: ${anim("body")}   ${dur}s ease-in-out infinite; }
        /* .upper = 머리·몸통·팔만. 다리를 건드리지 않고 상체만 움직일 때 쓴다(힙 써클). */
        .${uid} .upper  { transform-origin: 60px 88px;  animation: ${anim("upper")}  ${dur}s ease-in-out infinite; }
        .${uid} .thighL { transform-origin: 60px 88px;  animation: ${anim("thighL")} ${dur}s ease-in-out infinite; }
        .${uid} .shinL  { transform-origin: 57px 122px; animation: ${anim("shinL")}  ${dur}s ease-in-out infinite; }
        .${uid} .thighR { transform-origin: 60px 88px;  animation: ${anim("thighR")} ${dur}s ease-in-out infinite; }
        .${uid} .shinR  { transform-origin: 63px 122px; animation: ${anim("shinR")}  ${dur}s ease-in-out infinite; }
        .${uid} .armL   { transform-origin: 60px 42px;  animation: ${anim("armL")}   ${dur}s ease-in-out infinite; }
        .${uid} .armR   { transform-origin: 60px 42px;  animation: ${anim("armR")}   ${dur}s ease-in-out infinite; }
        .${uid} * { animation-play-state: ${state}; }
        /* 움직임에 민감한 사람에게 반복 애니메이션은 실제로 불편을 준다.
           기본은 정지이고, 재생 버튼으로 본인이 켤 수 있다. */
        @media (prefers-reduced-motion: reduce) {
          .${uid} * { animation: none !important; }
        }
      `}</style>

      <div className="flex items-start gap-4">
        <svg
          viewBox="0 0 120 170"
          className={`${uid} h-40 w-28 shrink-0`}
          role="img"
          aria-label={`${title} 동작 그림`}
        >
          {/* 바닥선 */}
          <line x1="10" y1="160" x2="110" y2="160" stroke="#e5e7eb" strokeWidth="2" />
          <g
            stroke="#059669"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          >
            {/* 측면 뷰(오른쪽을 봄). 다리를 거의 수직으로 모아야 회전이
                "앞뒤로 흔들기"로 읽힌다 — 벌려 놓으면 "옆으로 뻗기"가 된다.
                먼 쪽 팔·다리는 흐리게 그려 앞뒤를 구분한다. */}
            <g className="body">
              {/* 먼 쪽 다리 — 상체보다 뒤에 그린다 */}
              <g className="thighR" opacity="0.4">
                <line x1="60" y1="88" x2="63" y2="122" />
                <g className="shinR"><line x1="63" y1="122" x2="64" y2="156" /></g>
              </g>
              <g className="upper">
                <g className="armR" opacity="0.4"><line x1="60" y1="42" x2="68" y2="70" /></g>
                <circle cx="60" cy="22" r="10" fill="#059669" stroke="none" />
                <line x1="60" y1="32" x2="60" y2="88" />
                <g className="armL"><line x1="60" y1="42" x2="52" y2="70" /></g>
              </g>
              {/* 가까운 쪽 다리 */}
              <g className="thighL">
                <line x1="60" y1="88" x2="57" y2="122" />
                <g className="shinL"><line x1="57" y1="122" x2="56" y2="156" /></g>
              </g>
            </g>
          </g>
        </svg>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {reps}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-gray-600">{cue}</p>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="mt-3 rounded-lg border border-gray-300 px-3 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-50"
            aria-pressed={!playing}
          >
            {playing ? "정지" : "재생"}
          </button>
        </div>
      </div>
    </figure>
  );
}
