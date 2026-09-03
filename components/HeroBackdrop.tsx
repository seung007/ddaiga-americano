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

/** 걷거나 뛰는 사람. 전부 면(fill)으로, 가늘게. */
function Person({
  x, s = 1, color, flip = false, run = false,
}: { x: number; s?: number; color: string; flip?: boolean; run?: boolean }) {
  return (
    <g transform={`translate(${x},346) scale(${flip ? -s : s},${s})`} fill={color}>
      <circle cx="0" cy="-21.6" r="2.6" />
      {/* 몸통 — 어깨가 넓고 골반이 좁은 사다리꼴 */}
      <path d="M-2.3,-18.8 h4.6 l-0.5,9 h-3.6 z" />
      {run ? (
        <>
          <path d="M-1.8,-9.8 l-3.4,9.8 1.7,0.6 4,-9.2 z" />
          <path d="M1.4,-9.8 l3.6,9.4 -1.7,0.7 -3.7,-9.4 z" />
          <path d="M-2.2,-18 l-3.4,4.6 1.2,1.1 3.2,-4 z" />
          <path d="M2.2,-18 l3.2,3.4 -1.2,1.2 -3,-3.2 z" />
        </>
      ) : (
        <>
          <path d="M-1.8,-9.8 l-1.4,9.8 1.7,0 1.4,-9.4 z" />
          <path d="M1.4,-9.8 l1.6,9.8 -1.7,0 -1.5,-9.4 z" />
          <path d="M-2.2,-18 l-1.6,6.4 1.3,0.4 1.8,-6 z" />
        </>
      )}
    </g>
  );
}

/** 자전거 */
function Cyclist({ x, s = 1, color }: { x: number; s?: number; color: string }) {
  return (
    <g transform={`translate(${x},346) scale(${s})`}>
      <g fill="none" stroke="#b6c2d1" strokeWidth="1">
        <circle cx="-5" cy="-4" r="4" />
        <circle cx="6" cy="-4" r="4" />
        <path d="M-5,-4 L-0.5,-10 L6,-4 M-0.5,-10 L1.5,-4 M-0.5,-10 L-2,-11.5" />
      </g>
      <g fill={color}>
        <circle cx="-1" cy="-19" r="2.4" />
        <path d="M-3,-17 q3,-1.2 5.6,1 l-1.2,2.4 q-2.4,-1.5 -4.8,-0.5 z" />
        <path d="M0.4,-13.6 l2.4,3.4 -1.8,1.2 -2.2,-3.2 z" />
        <path d="M1.4,-16 l3.2,3.6 -1.4,1.2 -3,-3.4 z" />
      </g>
    </g>
  );
}

export default function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes hb-move { from { transform: translateX(-120px) } to { transform: translateX(1320px) } }
        @keyframes hb-bob  { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-1px) } }
        @keyframes hb-flow { from { transform: translateX(0) } to { transform: translateX(-120px) } }
        @keyframes hb-boat { from { transform: translateX(-80px) } to { transform: translateX(1280px) } }
        .hb .m1 { animation: hb-move 27s linear infinite; }
        .hb .m2 { animation: hb-move 36s linear infinite; animation-delay: -14s; }
        .hb .m3 { animation: hb-move 20s linear infinite; animation-delay: -7s; }
        .hb .bob1 { animation: hb-bob .44s ease-in-out infinite; }
        .hb .bob2 { animation: hb-bob .5s ease-in-out infinite; }
        .hb .flow { animation: hb-flow 20s linear infinite; }
        .hb .boat { animation: hb-boat 110s linear infinite; }
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
        <g className="m1"><g className="bob1"><Person x={0} s={1} color="#34d399" run /></g></g>
        <g className="m2"><g className="bob2"><Person x={0} s={0.94} color="#6ee7b7" run /></g></g>
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
