/**
 * 하프마라톤 페이지용 그림 3종 — 2026-09-03
 *
 * 왜 그림인가
 * ──────────
 * 이 페이지는 8분 읽기짜리 순수 텍스트였다. 그런데 여기서 다루는 것 중 셋은
 * **글로 설명하면 길고 그림이면 한눈에 들어오는** 종류다 —
 * 구간별 언제 뭘 먹나, 바세린을 어디에 바르나, 페이스를 어떻게 배분하나.
 *
 * ExerciseFigure와 같은 원칙을 따른다: **직접 그린다.** 남의 CDN도 저작권도 없고,
 * 링크가 죽지 않고, 클릭해서 사이트를 떠나지도 않는다.
 *
 * 지어내지 않기 위해 지킨 선
 * ─────────────────────────
 * **급수대 위치를 그리지 않았다.** 대회마다 다르고, "5km마다"라고 그리는 순간
 * 확인하지 않은 것을 사실처럼 보여주게 된다. 대신 "대회 안내문에서 확인하라"고 적는다.
 *
 * **페이스 그래프에 숫자 축을 넣지 않았다.** 개인마다 절대값이 다르므로
 * 세로축은 "빠름/느림"의 상대 관계만 보여준다. 눈금을 그리면 없는 정밀도가 생긴다.
 *
 * 고비 구간(15~18km)은 **직접 경험**이지 논문이 아니다. 그림에도 그렇게 표시한다.
 *
 * 2026-11-24 다시 그림(hyun 님 「도움 되도록 쓰게」) — 2026-11-23 확정 틀 변환 때 이 글에서 뺐던 그림이다.
 *   뺀 이유와 고친 것:
 *   · 근거 딱지(「직접 경험」「통용 관행」)와 「~니다」 → 딱지 없이 「~요」. 근거가 없다는 말은 본문 단서에 이미 있다
 *   · 「15~18km 고비」 구간과 「시간당 30~60g(젤 1~2개)」 줄 → 출처가 없어 뺐다. 구간은 본문이 말하는 「처음 5km」만 나눈다
 *   · 가로 640 그림이 휴대폰(390px)에서 절반으로 줄어 글자가 5px 로 보였다 → 가로 320 으로 다시 그려 글자가 그대로 읽힌다
 *   · 「오버페이스」「균등 배분」 → 「처음에 빠르게」「고르게」
 */

const GREEN = "#059669";
const GRAY = "#6b7280";
const AMBER = "#d97706";

function Caption({ children }: { children: React.ReactNode }) {
  return <figcaption className="mt-2 break-keep text-sm leading-relaxed text-gray-500">{children}</figcaption>;
}

/** ① 21.1km 를 처음 5km 와 그 뒤로 나눈 그림 */
export function CourseMap() {
  const X = (km: number) => 10 + (km / 21.0975) * 300;
  return (
    <figure className="my-5 rounded-2xl border border-gray-200 p-4">
      <svg viewBox="0 0 320 96" className="w-full" role="img" aria-label="하프마라톤 21.1km에서 처음 5km는 조금 느리게, 그 뒤는 내 속도로">
        {[0, 5, 10, 15, 21.0975].map((km) => (
          <g key={km}>
            <line x1={X(km)} y1={22} x2={X(km)} y2={58} stroke="#d1d5db" strokeWidth="1" />
            <text x={X(km)} y={15} textAnchor={km === 0 ? "start" : km > 21 ? "end" : "middle"} fontSize="12" fill={GRAY}>
              {km > 21 ? "21.1km" : km}
            </text>
          </g>
        ))}
        <rect x={X(0)} y={28} width={X(5) - X(0)} height={24} rx={4} fill={AMBER} opacity={0.9} />
        <rect x={X(5) + 2} y={28} width={X(21.0975) - X(5) - 2} height={24} rx={4} fill={GREEN} opacity={0.85} />
        <text x={(X(0) + X(5)) / 2} y={45} textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">느리게</text>
        <text x={(X(5) + X(21.0975)) / 2} y={45} textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">내 속도로</text>
        <text x={X(0)} y={78} fontSize="12" fill="#374151">처음 5km</text>
        <text x={X(21.0975)} y={78} textAnchor="end" fontSize="12" fill="#374151">힘들면 몇 km씩 끊어서</text>
      </svg>
      <Caption>급수대 자리는 대회마다 달라서 그리지 않았어요. 참가 안내문에서 확인해 보세요.</Caption>
    </figure>
  );
}

/** ② 마찰 방지제를 바르는 자리 */
export function ChafingMap() {
  const dots = [
    [134, 84], [166, 84],     // 겨드랑이
    [138, 106], [162, 106],   // 유두
    [150, 150],               // 사타구니
    [134, 236], [166, 236],   // 발가락 사이
  ];
  const labels = [
    { text: "겨드랑이", x: 8, y: 84, to: [134, 84], anchor: "start" as const, w: 56 },
    { text: "유두", x: 292, y: 110, to: [162, 106], anchor: "end" as const, w: 30 },
    { text: "사타구니", x: 292, y: 154, to: [150, 150], anchor: "end" as const, w: 56 },
    { text: "발가락 사이", x: 8, y: 240, to: [134, 236], anchor: "start" as const, w: 72 },
  ];
  return (
    <figure className="my-5 rounded-2xl border border-gray-200 p-4">
      <svg viewBox="0 0 300 264" className="mx-auto w-full max-w-xs" role="img" aria-label="쓸리기 쉬운 자리: 겨드랑이, 유두, 사타구니, 발가락 사이">
        <g stroke="#9ca3af" strokeWidth="2.5" fill="none" strokeLinecap="round">
          <circle cx="150" cy="42" r="15" />
          <line x1="150" y1="57" x2="150" y2="152" />
          <line x1="150" y1="76" x2="124" y2="124" />
          <line x1="150" y1="76" x2="176" y2="124" />
          <line x1="150" y1="152" x2="134" y2="234" />
          <line x1="150" y1="152" x2="166" y2="234" />
        </g>
        {labels.map((l) => (
          <g key={l.text}>
            <line
              x1={l.anchor === "start" ? l.x + l.w : l.x - l.w}
              y1={l.y - 5}
              x2={l.to[0]} y2={l.to[1]}
              stroke="#fca5a5" strokeWidth="1" strokeDasharray="2 2"
            />
            <text x={l.x} y={l.y} fontSize="14" fill="#374151" textAnchor={l.anchor}>{l.text}</text>
          </g>
        ))}
        {dots.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="5.5" fill="#ef4444" opacity="0.8" />
        ))}
      </svg>
      <Caption>빨간 점이 쓸리기 쉬운 자리예요. 물기를 닦고 말린 뒤에 발라요.</Caption>
    </figure>
  );
}

/** ③ 처음에 빠르게 나갔을 때와 고르게 달렸을 때 */
export function PaceCurve() {
  const X = (km: number) => 34 + (km / 21.0975) * 276;
  // y 는 아래로 갈수록 느림. 잰 값이 아니라 두 방식의 차이만 보여 준다 — 그래서 세로축에 숫자가 없다
  const even = [0, 21.0975].map((km) => `${X(km)},${62}`).join(" ");
  const fast = [[0, 34], [5, 40], [10, 58], [15, 90], [21.0975, 116]].map(([km, y]) => `${X(km)},${y}`).join(" ");
  return (
    <figure className="my-5 rounded-2xl border border-gray-200 p-4">
      <svg viewBox="0 0 320 160" className="w-full" role="img" aria-label="처음에 빠르게 나가면 뒤에서 크게 느려지고, 고르게 달리면 끝까지 같은 속도">
        <text x={0} y={38} fontSize="12" fill={GRAY}>빠름</text>
        <text x={0} y={120} fontSize="12" fill={GRAY}>느림</text>
        <line x1={30} y1={24} x2={30} y2={128} stroke="#e5e7eb" strokeWidth="1" />
        <line x1={30} y1={128} x2={312} y2={128} stroke="#e5e7eb" strokeWidth="1" />
        <polyline points={even} fill="none" stroke={GREEN} strokeWidth="3.5" strokeLinecap="round" />
        <polyline points={fast} fill="none" stroke={AMBER} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="7 5" />
        <text x={X(21.0975)} y={54} textAnchor="end" fontSize="13" fontWeight="700" fill="#065f46">고르게</text>
        <text x={X(10) + 6} y={100} textAnchor="end" fontSize="13" fontWeight="700" fill="#92400e">처음에 빠르게</text>
        {[0, 5, 10, 15, 21.0975].map((km) => (
          <text key={km} x={X(km)} y={146} textAnchor={km > 21 ? "end" : "middle"} fontSize="12" fill={GRAY}>
            {km > 21 ? "21.1km" : km}
          </text>
        ))}
      </svg>
      <Caption>처음에 빠르게 나가면 뒤에서 더 크게 느려지기 쉬워요. 잰 값이 아니라 처음을 눌러 가길 권하는 이유를 그린 그림이에요.</Caption>
    </figure>
  );
}
