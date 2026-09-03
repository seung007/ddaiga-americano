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
 */

const GREEN = "#059669";
const GRAY = "#9ca3af";
const AMBER = "#d97706";

function Caption({ children, basis }: { children: React.ReactNode; basis: "practice" | "experience" }) {
  return (
    <figcaption className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
      <span
        className={`rounded-md px-2 py-0.5 font-medium ${
          basis === "experience" ? "bg-purple-50 text-purple-700" : "bg-amber-50 text-amber-700"
        }`}
      >
        {basis === "experience" ? "직접 경험" : "통용 관행"}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </figcaption>
  );
}

/** ① 21.1km를 네 구간으로 나눈 지도 */
export function CourseMap() {
  const segs = [
    { from: 0, to: 5, label: "초반 억제", note: "느린 듯하게" },
    { from: 5, to: 15, label: "유지", note: "목표 페이스" },
    { from: 15, to: 18, label: "고비", note: "여기가 제일 힘듦", hot: true },
    { from: 18, to: 21.0975, label: "마무리", note: "3km 단위로 쪼개기" },
  ];
  const X = (km: number) => 30 + (km / 21.0975) * 580;

  return (
    <figure className="my-6 rounded-2xl border border-gray-200 p-5">
      <svg viewBox="0 0 640 150" className="w-full" role="img" aria-label="하프마라톤 21.1km 구간 지도">
        {segs.map((s) => (
          <g key={s.from}>
            <rect
              x={X(s.from)} y={54} width={X(s.to) - X(s.from)} height={22} rx={4}
              fill={s.hot ? AMBER : GREEN} opacity={s.hot ? 0.85 : 0.18 + (s.from / 21) * 0.35}
            />
            <text x={(X(s.from) + X(s.to)) / 2} y={69} textAnchor="middle"
              fontSize="11" fontWeight="600" fill={s.hot ? "#fff" : "#065f46"}>
              {s.label}
            </text>
            <text x={(X(s.from) + X(s.to)) / 2} y={94} textAnchor="middle" fontSize="10" fill={GRAY}>
              {s.note}
            </text>
          </g>
        ))}
        {[0, 5, 10, 15, 18, 21.0975].map((km) => (
          <g key={km}>
            <line x1={X(km)} y1={44} x2={X(km)} y2={80} stroke="#d1d5db" strokeWidth="1" />
            <text x={X(km)} y={38} textAnchor="middle" fontSize="10" fill="#6b7280">
              {km === 21.0975 ? "21.1" : km}
            </text>
          </g>
        ))}
        <text x={30} y={20} fontSize="11" fill="#374151" fontWeight="600">거리(km)</text>
        {/* 90분 이상 걸릴 때만 해당하는 보급 안내 */}
        <text x={30} y={122} fontSize="11" fill="#374151">
          완주에 90분 넘게 걸린다면 — 시간당 탄수화물 30~60g (젤 1~2개)
        </text>
        <text x={30} y={139} fontSize="10" fill={GRAY}>
          급수대 위치는 대회마다 다릅니다. 이 그림에 표시하지 않았으니 참가 안내문에서 확인하세요.
        </text>
      </svg>
      <Caption basis="experience">
        구간 나눔과 &ldquo;15~18km가 고비&rdquo;는 직접 뛰어본 경험입니다. 사람마다 무너지는 지점이 다릅니다.
      </Caption>
    </figure>
  );
}

/** ② 바세린 바르는 자리 */
export function ChafingMap() {
  // 몸을 캔버스 가운데(x=150)에 두고 라벨을 좌우로 번갈아 배치한다.
  // 처음에는 몸을 왼쪽(x=90)에 두고 라벨을 오른쪽에 몰았더니
  // **라벨이 잘리고, 겨드랑이와 유두가 같은 높이라 서로 겹쳤다.**
  const dots = [
    [134, 84], [166, 84],     // 겨드랑이
    [138, 106], [162, 106],   // 유두
    [150, 150],               // 사타구니
    [134, 236], [166, 236],   // 발가락 사이
  ];
  const labels = [
    { text: "겨드랑이", x: 10, y: 84, to: [134, 84], anchor: "start" as const },
    { text: "유두", x: 290, y: 110, to: [162, 106], anchor: "end" as const },
    { text: "사타구니·허벅지 안쪽", x: 290, y: 154, to: [150, 150], anchor: "end" as const },
    { text: "발가락 사이", x: 10, y: 240, to: [134, 236], anchor: "start" as const },
  ];
  return (
    <figure className="my-6 rounded-2xl border border-gray-200 p-5">
      <svg viewBox="0 0 300 264" className="mx-auto w-full max-w-sm" role="img" aria-label="마찰이 잘 생기는 부위">
        <g stroke={GRAY} strokeWidth="2.5" fill="none" strokeLinecap="round">
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
              x1={l.anchor === "start" ? l.x + 52 : l.x - 108}
              y1={l.y - 4}
              x2={l.to[0]} y2={l.to[1]}
              stroke="#fca5a5" strokeWidth="1" strokeDasharray="2 2"
            />
            <text x={l.x} y={l.y} fontSize="11" fill="#374151" textAnchor={l.anchor}>{l.text}</text>
          </g>
        ))}
        {dots.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="5" fill="#ef4444" opacity="0.75" />
        ))}
      </svg>
      <Caption basis="practice">
        러너들 사이에 널리 쓰이는 자리입니다. <strong className="text-gray-700">바르는 위치나 효과를
        검증한 논문은 확인하지 못했습니다.</strong> 바르기 전에 물기를 닦고 말리세요 — 젖은 채로 바르면 겉돕니다.
      </Caption>
    </figure>
  );
}

/** ③ 오버페이스 vs 균등 배분 */
export function PaceCurve() {
  const X = (km: number) => 40 + (km / 21.0975) * 560;
  // y는 "느려짐"을 아래로. 절대 페이스가 아니라 상대 관계만 보여준다.
  const even = [0, 5, 10, 15, 18, 21.0975].map((km) => `${X(km)},${86}`).join(" ");
  const over = [
    [0, 62], [5, 66], [10, 78], [15, 104], [18, 126], [21.0975, 134],
  ].map(([km, y]) => `${X(km)},${y}`).join(" ");

  return (
    <figure className="my-6 rounded-2xl border border-gray-200 p-5">
      <svg viewBox="0 0 640 175" className="w-full" role="img" aria-label="오버페이스와 균등 배분 비교">
        <text x={8} y={62} fontSize="10" fill={GRAY}>빠름</text>
        <text x={8} y={140} fontSize="10" fill={GRAY}>느림</text>
        <line x1={36} y1={52} x2={36} y2={142} stroke="#e5e7eb" strokeWidth="1" />
        <line x1={36} y1={142} x2={614} y2={142} stroke="#e5e7eb" strokeWidth="1" />

        <polyline points={even} fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
        <polyline points={over} fill="none" stroke={AMBER} strokeWidth="3" strokeLinecap="round" strokeDasharray="6 4" />

        <text x={X(21.0975) - 4} y={80} textAnchor="end" fontSize="11" fontWeight="600" fill="#065f46">균등 배분</text>
        <text x={X(15)} y={100} fontSize="11" fontWeight="600" fill="#92400e">오버페이스</text>

        {[0, 5, 10, 15, 21.0975].map((km) => (
          <text key={km} x={X(km)} y={158} textAnchor="middle" fontSize="10" fill="#6b7280">
            {km === 21.0975 ? "21.1" : km}
          </text>
        ))}
        <text x={320} y={172} textAnchor="middle" fontSize="10" fill={GRAY}>거리(km)</text>
      </svg>
      <Caption basis="experience">
        세로축에 눈금을 넣지 않았습니다 — 절대 페이스는 사람마다 달라서
        <strong className="text-gray-700"> 없는 정밀도를 만들지 않으려고</strong> 상대 관계만 그렸습니다.
        초반에 번 30초가 후반에 3분으로 돌아온다는 건 제 경험입니다.
      </Caption>
    </figure>
  );
}
