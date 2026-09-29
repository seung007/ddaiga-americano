/**
 * 히어로 배경 — 한강 산책로 (2026-09-03, 3차)
 *
 * 왜 세 번 만들었나
 * ────────────────
 * 1차: 참고를 안 보고 막대 그림으로 만들었다. 배경으로 쓸 물건이 아니었다.
 * 2차: 참고를 봤지만 **좌표를 눈으로 확인하지 않고** 넘겼다. 브라우저에서 보니 —
 *   · **다리가 강 위가 아니라 스카이라인 한가운데** 떠 있었다
 *   · 강이 너무 얇고 옅어 스카이라인과 구분되지 않았다
 *   · 사람이 너무 크고 뭉툭해서 "ㅅ자 덩어리"로 보였다
 *   · 스카이라인이 본문 텍스트 뒤까지 올라왔다
 *
 * **그림은 좌표만 맞다고 되는 게 아니라 눈으로 봐야 한다.**
 * 이 파일의 좌표는 실제 렌더를 보고 잡은 것이다.
 *
 * 레이어 (viewBox 1200×400, 아래가 기준선)
 * ────────────────────────────────────────
 *   y   0~150   비움 — **글자가 놓이는 자리**
 *   y 150~256   스카이라인 (뒤 → 앞 두 겹)
 *   y 208~262   다리 주탑·케이블 — 밑동이 강에 닿는다
 *   y 256~316   강 (60px. 확실히 보이게)
 *   y 316~330   강변 둔치
 *   y 330~346   산책로
 *   y 346~400   잔디
 *
 * 사람은 산책로(y=346)에 발을 딛고 키 24단위 — **전체 높이의 1/16**이다.
 * 2차에서는 이게 2배였다.
 */

import type { CSSProperties } from "react";

/**
 * 걷거나 뛰는 사람. **모든 자세는 오른쪽(+x)을 향한다.**
 *
 * 2026-09-03: 3차본이 "뒤로 뛰는 것처럼 보인다"는 지적을 받았다. 원인은 둘이었다.
 *   ① 몸이 **좌우 대칭**이라 방향 자체가 없었다. `flip`을 걸어도 아무 변화가 없었고,
 *      보는 사람은 진행 방향과 무관하게 읽는다.
 *   ② 자전거는 **핸들이 왼쪽**에 붙어 있는데 앞바퀴는 오른쪽이었다. 거꾸로 굴러갔다.
 *
 * 그래서 방향 신호 셋을 넣었다 — **상체를 진행 방향으로 기울이고, 머리를 앞으로 내고,
 * 앞다리는 무릎을 굽혀 앞으로·뒷다리는 뒤로 뻗는다.** 이 셋이 있으면 대칭이 깨져
 * 방향이 읽힌다. 왼쪽을 향하게 하려면 `flip`으로 뒤집는다.
 */
/**
 * 달리기 동작 — 발 궤적을 정하고 역기구학(IK)으로 관절 각도를 계산한다. (2026-09-30)
 *
 * 1차(09-29)는 허벅지·정강이 각도를 눈대중 키프레임으로 흔들었다. 다리는 움직였지만
 * **디딘 발이 땅에서 미끄러지고, 몸이 뜨는 시점이 다리와 따로 놀았다.**
 * 그래서 순서를 뒤집었다 — 각도가 아니라 **발목이 어디 있어야 하는가**를 먼저 정한다.
 *
 *   지지기(stance) — 착지 → 몸 아래 → 밀어내기. 발은 땅에 붙어 있고, 몸이 앞으로 가는 만큼
 *                    정확히 뒤로 밀린다(몸 속도 = 발이 쓸리는 속도). 끝에서 뒤꿈치가 들린다
 *   유각기(swing)  — 밀어낸 발의 뒤꿈치가 엉덩이 쪽으로 올라오고(heel recovery),
 *                    무릎이 앞으로 나온 뒤(knee drive) 정강이가 펴지며 몸 바로 앞에 착지
 *   두 발이 다 뜨는 구간 — 한 발이 땅에 있는 비율(DS)을 0.5 보다 작게 둬서 생긴다. 걷기와 달리기의 차이
 *   상하 움직임 — 한 걸음에 한 번. 지지기 가운데서 가장 낮고, 두 발이 뜬 구간 가운데서 가장 높다
 *   팔 — 같은 쪽 다리와 반대로
 *
 * 발목 위치 → 두 마디(허벅지 L1, 정강이 L2) 역기구학 → 허벅지·정강이 각도, 무릎은 항상 앞으로 굽는다.
 * 발 각도는 따로 준다(착지 때 발끝 살짝 위, 지지기 평평, 밀어낼 때 발끝으로).
 *
 * 수치는 실측이 아니라 그림이 자연스러워 보이도록 잡은 값이다. 단위는 이 그림의 좌표(사람 키 약 24).
 * 모든 러너가 같은 키프레임을 쓰므로 **이동 속도 × stride(로컬 좌표) 가 같아야** 발이 안 미끄러진다
 * — 아래 RUN_TRAVEL 과 .m1/.m2 이동 시간·scale 이 그 관계다.
 */
const L1 = 5.6;              // 엉덩이 → 무릎
const L2 = 5.1;              // 무릎 → 발목
const HIP = 10.2;            // 엉덩이 높이. 다리(L1+L2=10.7)가 이보다 길어서 디딘 무릎은 늘 조금 굽는다
const ANK = 0.6;             // 발을 평평하게 디뎠을 때 발목 높이
const DS = 0.34;             // 한 다리가 땅에 닿아 있는 비율(주기 대비)
const X_ON = 2.4;            // 착지 때 발목 x (엉덩이 기준, +가 앞) — 몸 바로 앞
const X_OFF = -5.2;          // 밀어낼 때 발목 x
const BOB = 1.0;             // 상하 움직임 폭
/** 한 주기(두 걸음) 동안 몸이 가야 하는 거리 = 지지기에 발이 쓸리는 거리 ÷ DS */
export const RUN_TRAVEL = (X_ON - X_OFF) / DS;

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const smooth = (t: number) => { const c = Math.min(1, Math.max(0, t)); return c * c * (3 - 2 * c); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 몸의 높이(위로 +). 한 걸음(주기의 절반)에 한 번 — 두 발이 뜬 구간 가운데서 가장 높다 */
function bob(u: number) {
  const p = (u * 2) % 1;
  const flightMid = (DS / 0.5 + 1) / 2;
  return BOB * (0.5 + 0.5 * Math.cos(2 * Math.PI * (p - flightMid)));
}

/** 점 몇 개를 부드럽게 잇는 곡선(3차 Hermite, 접선은 이웃 점에서) */
function curve(ts: number[], vs: number[], t: number) {
  let i = 0;
  while (i < ts.length - 2 && t > ts[i + 1]) i++;
  const tan = (k: number) => {
    const a = Math.max(0, k - 1), b = Math.min(ts.length - 1, k + 1);
    return (vs[b] - vs[a]) / (ts[b] - ts[a]);
  };
  const h = ts[i + 1] - ts[i], s = (t - ts[i]) / h;
  const s2 = s * s, s3 = s2 * s;
  return (2 * s3 - 3 * s2 + 1) * vs[i] + (s3 - 2 * s2 + s) * h * tan(i)
       + (-2 * s3 + 3 * s2) * vs[i + 1] + (s3 - s2) * h * tan(i + 1);
}

/** 주기 u(0~1)에서 가까운 쪽 다리의 발목 위치(엉덩이 기준, 아래로 +)와 발 각도 */
function ankle(u: number) {
  const ground = HIP + bob(u);             // 몸이 뜨면 땅은 엉덩이에서 멀어진다
  if (u < DS) {
    const s = u / DS;
    const lift = 1.2 * smooth((s - 0.6) / 0.4);          // 뒤꿈치 들림
    const foot = s < 0.15 ? lerp(-8, 0, s / 0.15) : s < 0.6 ? 0 : lerp(0, 39, smooth((s - 0.6) / 0.4));
    return { x: lerp(X_ON, X_OFF, s), y: ground - ANK - lift, foot };
  }
  const s = (u - DS) / (1 - DS);
  const ts = [0, 0.3, 0.62, 0.86, 1];
  const xs = [X_OFF, -4.9, 0.6, 3.6, X_ON];
  const ys = [HIP + bob(DS) - ANK - 1.2, 4.4, 7.2, 8.8, HIP + bob(1) - ANK];
  const fs = [39, 30, 15, 0, -8];
  return { x: curve(ts, xs, s), y: curve(ts, ys, s), foot: curve(ts, fs, s) };
}

/** 두 마디 역기구학. 각도는 CSS rotate 기준(아래를 0°, 양수 = 발이 뒤로) */
function legAngles(u: number) {
  const a = ankle(u);
  const d = Math.min(Math.hypot(a.x, a.y), L1 + L2 - 1e-3);
  const aim = deg(Math.atan2(-a.x, a.y));
  const bend = deg(Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)));
  const thigh = aim - bend;                               // 무릎이 앞으로
  const kx = -L1 * Math.sin(rad(thigh)), ky = L1 * Math.cos(rad(thigh));
  const shinAbs = deg(Math.atan2(-(a.x - kx), a.y - ky));
  return { thigh, shin: shinAbs - thigh, foot: a.foot - shinAbs };
}

const FRAMES = 24;
const r1 = (n: number) => Math.round(n * 10) / 10;
function keyframes(name: string, value: (u: number) => string) {
  const rows = [];
  for (let i = 0; i <= FRAMES; i++) {
    const u = (i % FRAMES) / FRAMES;
    rows.push(`${r1((i / FRAMES) * 100)}%{transform:${value(u)}}`);
  }
  return `@keyframes ${name}{${rows.join("")}}`;
}
const GAIT_CSS = [
  keyframes("hb-thigh", (u) => `rotate(${r1(legAngles(u).thigh)}deg)`),
  keyframes("hb-shin", (u) => `rotate(${r1(legAngles(u).shin)}deg)`),
  keyframes("hb-foot", (u) => `rotate(${r1(legAngles(u).foot)}deg)`),
  keyframes("hb-arm", (u) => `rotate(${r1(-0.8 * legAngles(u).thigh - 4)}deg)`),
  keyframes("hb-runbob", (u) => `translateY(${(-bob(u)).toFixed(2)}px)`),
].join("\n");

/** 움직임 줄이기 설정일 때 보이는 정지 자세 — 가까운 다리는 지지기 가운데, 먼 다리는 유각기 */
const REST_NEAR = legAngles(0.17);
const REST_FAR = legAngles(0.67);

function RunnerLimb({ far = false, arm = false }: { far?: boolean; arm?: boolean }) {
  const rest = far ? REST_FAR : REST_NEAR;
  if (arm) {
    return (
      <g transform="translate(1.2,-18)" opacity={far ? 0.7 : 1}>
        <g className={`arm${far ? " far" : ""}`} transform={`rotate(${r1(-0.8 * rest.thigh - 4)})`}>
          <path d="M-0.6,0 L0.6,0 L0.5,4.2 L-0.5,4.2 Z" />
          {/* 팔꿈치 — 앞으로 굽힌 채 고정 */}
          <path transform="translate(0,4.0) rotate(-80)" d="M-0.5,0 L0.5,0 L0.4,3.6 L-0.4,3.6 Z" />
        </g>
      </g>
    );
  }
  return (
    <g transform="translate(0,-10.2)" opacity={far ? 0.7 : 1}>
      <g className={`thigh${far ? " far" : ""}`} transform={`rotate(${r1(rest.thigh)})`}>
        <path d={`M-0.95,0 L0.95,0 L0.8,${L1 + 0.1} L-0.8,${L1 + 0.1} Z`} />
        <g transform={`translate(0,${L1})`}>
          <g className="shin" transform={`rotate(${r1(rest.shin)})`}>
            <path d={`M-0.8,0 L0.8,0 L0.55,${L2} L-0.55,${L2} Z`} />
            <g transform={`translate(0,${L2})`}>
              {/* 발 — 발목 기준, 앞(+x)으로. 발바닥이 발목보다 ANK 아래 */}
              <g className="foot" transform={`rotate(${r1(rest.foot)})`}>
                <path d={`M-0.6,-0.5 L1.9,-0.1 L1.9,${ANK} L-0.6,${ANK} Z`} />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

function Person({
  x, s = 1, color, flip = false, run = false,
}: { x: number; s?: number; color: string; flip?: boolean; run?: boolean }) {
  return (
    <g transform={`translate(${x},346) scale(${flip ? -s : s},${s})`} fill={color}>
      {run ? (
        // 달릴 때는 엉덩이를 HIP 높이로 낮춘다(무릎을 조금 굽힌 자세) — 그만큼 그림 전체를 내린다
        <g transform={`translate(0,${r1(10.2 - HIP)})`}>
          {/* 먼 쪽 팔·다리 — 몸통보다 먼저 그린다 */}
          <RunnerLimb far arm />
          <RunnerLimb far />
          {/* 머리 — 앞으로 살짝 내밀어 방향을 만든다 */}
          <circle cx="1.4" cy="-21.4" r="2.6" />
          {/* 상체 — 진행 방향으로 기울인다 */}
          <path d="M-0.6,-19.0 L2.8,-18.6 L1.6,-10.0 L-1.6,-10.0 Z" />
          {/* 가까운 쪽 다리·팔 */}
          <RunnerLimb />
          <RunnerLimb arm />
        </g>
      ) : (
        <>
          {/* 뒷다리 */}
          <path d="M-1.4,-10.2 L0.2,-10.2 L-2.0,-0.6 L-3.4,-0.6 Z" />
          <circle cx="0.9" cy="-21.5" r="2.6" />
          {/* 상체 — 걷기는 기울임을 작게 */}
          <path d="M-1.2,-19.0 L2.2,-18.8 L1.4,-10.0 L-1.6,-10.0 Z" />
          {/* 앞다리 */}
          <path d="M0.2,-10.2 L1.8,-10.2 L2.6,-0.6 L1.2,-0.6 Z" />
          {/* 팔 */}
          <path d="M1.0,-18.2 L2.2,-17.6 L-0.4,-12.6 L-1.6,-13.2 Z" />
        </>
      )}
    </g>
  );
}

/** 자전거 — 오른쪽을 향한다. 앞바퀴(+x)에 핸들이 붙어야 한다. */
function Cyclist({ x, s = 1, color }: { x: number; s?: number; color: string }) {
  return (
    <g transform={`translate(${x},346) scale(${s})`}>
      <g fill="none" stroke="#b6c2d1" strokeWidth="1">
        <circle cx="-6" cy="-4" r="4" />
        <circle cx="6" cy="-4" r="4" />
        {/* 뒷바퀴 → 안장 → 앞바퀴, 안장 → 크랭크, 앞바퀴 → 핸들(오른쪽 위) */}
        <path d="M-6,-4 L-2.4,-10.4 L6,-4 M-2.4,-10.4 L0.6,-4 M6,-4 L4.4,-11.2" />
        <path d="M3.4,-11.6 L5.8,-11.0" strokeWidth="1.2" />
      </g>
      <g fill={color}>
        {/* 머리 — 핸들 쪽으로 */}
        <circle cx="1.8" cy="-18.4" r="2.4" />
        {/* 상체 — 안장에서 핸들로 기울인다 */}
        <path d="M-2.6,-15.6 L0.4,-17.2 L2.4,-15.0 L-0.6,-13.2 Z" />
        {/* 팔 — 핸들을 잡는다 */}
        <path d="M1.4,-16.2 L2.6,-15.6 L4.8,-11.2 L3.6,-10.6 Z" />
        {/* 다리 — 안장에서 페달로 */}
        <path d="M-2.0,-14.0 L-0.2,-13.6 L1.2,-5.0 L-0.2,-4.6 Z" />
      </g>
    </g>
  );
}

export default function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes hb-move { from { transform: translateX(-120px) } to { transform: translateX(1320px) } }
        @keyframes hb-flow { from { transform: translateX(0) } to { transform: translateX(-120px) } }
        @keyframes hb-boat { from { transform: translateX(-80px) } to { transform: translateX(1280px) } }
        .hb .m1 { animation: hb-move 42s linear infinite; }
        .hb .m2 { animation: hb-move 48s linear infinite; animation-delay: -18s; }
        .hb .m3 { animation: hb-move 20s linear infinite; animation-delay: -7s; }
        /* 팔다리·상하 움직임 — 전부 같은 주기(--stride), 키프레임은 GAIT_CSS 가 계산 */
        .hb .runbob { animation: hb-runbob var(--stride) linear infinite; }
        .hb .thigh { animation: hb-thigh var(--stride) linear infinite; }
        .hb .shin  { animation: hb-shin  var(--stride) linear infinite; }
        .hb .foot  { animation: hb-foot  var(--stride) linear infinite; }
        .hb .arm   { animation: hb-arm   var(--stride) linear infinite; }
        .hb .far, .hb .far .shin, .hb .far .foot { animation-delay: calc(var(--stride) / -2); }
        .hb .flow { animation: hb-flow 20s linear infinite; }
        .hb .boat { animation: hb-boat 110s linear infinite; }
        ${GAIT_CSS}
        @media (prefers-reduced-motion: reduce) { .hb * { animation: none !important; } }
      `}</style>

      <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" className="hb h-full w-full">
        {/* ── 먼 스카이라인 (바닥 y=256) ── */}
        <g fill="#f1f5f9">
          {[[20,186],[54,168],[84,196],[128,178],[162,190],[220,172],[252,194],[306,180],
            [344,196],[404,176],[446,190],[512,184],[572,170],[614,192],[690,180],[730,194],
            [800,176],[836,190],[912,182],[950,194],[1014,172],[1050,190],[1120,180],[1160,192]]
            .map(([x,y],i)=>(
              <rect key={i} x={x} y={y} width={i%3===0?32:24} height={256-y} rx="1.5" />
          ))}
          {/* 63빌딩 자리 — 하나만 높게 */}
          <path d="M660,256 L660,152 q6,-9 12,0 L672,256 z" />
        </g>

        {/* ── 앞 스카이라인 (조금 진하게) ── */}
        <g fill="#e2e8f0">
          {[[0,212],[96,220],[186,210],[276,222],[368,212],[462,224],[548,214],[642,226],
            [736,212],[850,222],[962,214],[1064,224],[1152,212]].map(([x,y],i)=>(
            <rect key={i} x={x} y={y} width={i%2?34:44} height={256-y} rx="1.5" />
          ))}
        </g>

        {/* ── 강 — 넓고 확실하게. 스카이라인과 구분되어야 한다 ── */}
        <rect x="0" y="256" width="1200" height="60" fill="#e4eefb" />
        <g className="flow" stroke="#f3f8ff" strokeWidth="2.4" strokeLinecap="round">
          {[[-120,268,260],[180,282,200],[460,272,240],[780,286,220],[1040,270,280],[1220,280,200]]
            .map(([x,y,w],i)=>(<line key={i} x1={x} y1={y} x2={x+w} y2={y} />))}
        </g>

        {/* ── 다리 — 주탑 밑동이 강에 닿는다(y=262). 2차에서는 강 위에 떠 있었다 ── */}
        <g stroke="#c3d0de" strokeWidth="1" fill="none">
          {[290, 660, 1010].map((px) => (
            <g key={px}>
              <line x1={px} y1="262" x2={px} y2="208" strokeWidth="2.2" />
              {[-84,-56,-30,30,56,84].map((d,i)=>(
                <line key={i} x1={px} y1="211" x2={px+d} y2="262" />
              ))}
            </g>
          ))}
        </g>
        <rect x="0" y="261" width="1200" height="4" fill="#cfdae6" />

        {/* 유람선 */}
        <g className="boat">
          <g fill="#cfdae6">
            <path d="M0,296 h30 l-3.5,6 h-23 z" />
            <rect x="7" y="290" width="16" height="5.4" rx="1" />
            <rect x="12" y="286" width="5" height="4.4" rx="1" />
          </g>
        </g>

        {/* ── 둔치 · 산책로 · 잔디 ── */}
        <rect x="0" y="316" width="1200" height="14" fill="#dfe9f2" />
        <rect x="0" y="330" width="1200" height="16" fill="#eef2f7" />
        <rect x="0" y="346" width="1200" height="54" fill="#e7f8ef" />

        {/* 잔디 덤불 */}
        <g fill="#c9f0dc">
          {[40,168,300,436,560,700,830,960,1090,1180].map((x,i)=>(
            <g key={i}>
              <ellipse cx={x} cy="368" rx="20" ry="7" />
              <ellipse cx={x+22} cy="374" rx="13" ry="5" />
            </g>
          ))}
        </g>

        {/* 가로수 — 사람(키 24)보다 확실히 커야 한다.
            2차에서는 수관이 사람 머리만 해서 화분처럼 보였다. 총높이 약 42로 올린다. */}
        <g>
          {[112,296,486,668,858,1042,1170].map((x,i)=>(
            <g key={i}>
              <rect x={x} y="322" width="2.4" height="24" fill="#bfcddb" />
              <ellipse cx={x+1.2} cy="316" rx="13" ry="14" fill="#b6ead0" />
              <ellipse cx={x - 6} cy="322" rx="8" ry="8" fill="#c9f0dc" />
            </g>
          ))}
        </g>

        {/* ── 산책로 위 사람들 ── */}
        <g opacity="0.9">
          <Person x={58}   s={0.95} color="#9fb0c4" />
          <Person x={78}   s={0.9}  color="#b3c1d1" flip />
          <Person x={210}  s={0.98} color="#a7b7c9" />
          <Person x={228}  s={0.92} color="#bcc8d6" />
          <Person x={392}  s={0.95} color="#9fb0c4" flip />
          <Person x={520}  s={0.93} color="#b3c1d1" />
          <Person x={640}  s={0.97} color="#a7b7c9" flip />
          <Person x={658}  s={0.9}  color="#bcc8d6" flip />
          <Person x={790}  s={0.94} color="#9fb0c4" />
          <Person x={930}  s={0.96} color="#b3c1d1" flip />
          <Person x={1078} s={0.91} color="#a7b7c9" />
          {/* 강아지 */}
          <g fill="#c3d0de">
            <ellipse cx={252} cy={341} rx="4" ry="2" />
            <circle cx={256} cy={338.6} r="1.7" />
            <rect x={249} y={342} width="1" height="3.4" />
            <rect x={254} y={342} width="1" height="3.4" />
          </g>
        </g>

        {/* ── 지나가는 사람들 ── */}
        {/* 발이 안 미끄러지는 조건: (1440 ÷ 이동 시간) ÷ scale × stride = RUN_TRAVEL(약 22.4)
            m1: 34.3 ÷ 1 × .65 = 22.3 · m2: 30 ÷ .94 × .70 = 22.3 */}
        <g className="m1"><g className="runbob" style={{ "--stride": ".65s" } as CSSProperties}>
          <Person x={0} s={1} color="#34d399" run />
        </g></g>
        <g className="m2"><g className="runbob" style={{ "--stride": ".70s" } as CSSProperties}>
          <Person x={0} s={0.94} color="#6ee7b7" run />
        </g></g>
        <g className="m3"><Cyclist x={0} s={1} color="#5eead4" /></g>

        {/* ── 흰색 페이드 ──
            그림을 다 그린 뒤 위에서부터 흰색을 덮어 **글자가 놓이는 위쪽을 정리한다.**
            렌더를 보니 스카이라인이 본문 텍스트 뒤에서 어수선했다.
            그림을 지우는 대신 위쪽만 흐리게 하면 장면은 남고 가독성은 회복된다. */}
        <defs>
          <linearGradient id="hb-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#fff" stopOpacity="1" />
            <stop offset="55%"  stopColor="#fff" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1200" height="300" fill="url(#hb-fade)" />
      </svg>
    </div>
  );
}
