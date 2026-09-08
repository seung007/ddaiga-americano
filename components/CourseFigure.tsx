/**
 * 한강 코스 개략 도식
 *
 * 왜 지도가 아니라 도식인가 (2026-09-06)
 * ──────────────────────────────────────
 * 1) **지도를 베끼지 않기 위해.** 카카오맵·네이버지도 화면을 따라 그리면
 *    2차적 저작물 소지가 있다. 이 도식이 담는 건 `lib/courses.ts`의 사실
 *    — **다리 이름과 상류→하류 순서** — 뿐이다. 축척도 좌표도 실제와 다르다.
 *    그래서 "지도"라고 부르지 않고 도식이라고 부른다. 현장에서 길찾기용이 아니다.
 *
 * 2) **텍스트가 크롤링되기 때문에.** 지도 SDK는 JS로 캔버스를 그려서
 *    네이버·구글 크롤러가 아무것도 못 읽는다. 우리 유입은 네이버 76%다.
 *    여기 다리 이름은 전부 진짜 `<text>` 요소라 그대로 색인된다.
 *    `aria-label`·`<desc>`로 스크린리더와 크롤러가 같은 걸 읽게 했다.
 *    (`<title>`은 React 19 가 head 로 올려서 하이드레이션을 깨뜨린다 — 아래 주석 참고)
 *
 * 3) 키도 할당량도 없다. 배포 즉시 작동하고 앞으로도 깨질 일이 없다.
 *
 * ⚠️ 애니메이션 주의 — `ExerciseFigure`에서 겪은 사고가 여기도 적용된다.
 *    `@keyframes` 이름은 **문서 전역**이라 컴포넌트가 여러 개 렌더되면 마지막 정의가
 *    전부를 덮는다. 그래서 이 파일은 아예 `@keyframes`를 쓰지 않는다 —
 *    움직이는 건 강물 한 줄뿐이고 그건 `<animate>`로 처리한다(요소에 종속된다).
 */

const W = 640;
const H = 150;

/** 강 띠 */
const RIVER_TOP = 58;
const RIVER_BOT = 96;
/** 다리 눈금이 놓이는 x 범위 — 양끝에 여백을 둬 라벨이 잘리지 않게 한다 */
const X0 = 64;
const X1 = W - 64;

export default function CourseFigure({
  name,
  bridges,
  lengthKm,
}: {
  name: string;
  /** 상류 → 하류 순서 */
  bridges: string[];
  lengthKm: number;
}) {
  const n = bridges.length;
  const step = n > 1 ? (X1 - X0) / (n - 1) : 0;
  const xs = bridges.map((_, i) => X0 + step * i);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      role="img"
      /**
       * ⚠️ `<title>` 을 쓰지 마라. `aria-label` 을 쓴다. (2026-09-08)
       *
       * 전에는 `<svg><title id=...>` 였고, 그것이 **사이트 전체 하이드레이션
       * 오류(React #418)의 원인**이었다. React 19 는 `<title>` 을 문서
       * 메타데이터로 보고 `<head>` 로 올리는데, **SVG 안이라도 클라이언트
       * 경로에서 그 구분을 못 한다.** 서버는 SVG 안에 그리고 클라이언트는
       * 올려버려서 트리가 어긋난다.
       *
       * 증상이 컸다 — React 가 **서버 HTML 을 통째로 버리고 다시 그린다.**
       * 그 과정에서 내가 head 에 꽂은 Leaflet 스크립트가 날아간 적도 있다.
       * 그런데 화면은 정상으로 보여서 **3주 넘게 아무도 몰랐다.**
       *
       * 접근성은 잃지 않는다 — 이름은 `aria-label`, 설명은 `<desc>` +
       * `aria-describedby` 로 그대로 있다. `<desc>` 는 메타데이터 태그가
       * 아니어서 올려지지 않는다(크롤되는 텍스트도 그대로 남는다).
       */
      aria-label={`${name} 구간 도식`}
      aria-describedby={`cf-${name}-d`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <desc id={`cf-${name}-d`}>
        상류에서 하류 순서로 {bridges.join(", ")}가 이어집니다. 공원 공식 길이는{" "}
        {lengthKm}km입니다. 실제 지도가 아니라 다리 순서만 나타낸 개략 도식입니다.
      </desc>

      {/* ── 강 ── */}
      <rect x="0" y={RIVER_TOP} width={W} height={RIVER_BOT - RIVER_TOP} fill="#dbeafe" />
      {/* 물결 한 줄. transform 애니메이션이 아니라 x 이동이라 레이아웃에 영향이 없다 */}
      <path
        d={`M0 ${RIVER_TOP + 19} q 20 -5 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0`}
        fill="none"
        stroke="#bfdbfe"
        strokeWidth="2"
      >
        <animate
          attributeName="transform"
          attributeType="XML"
          type="translate"
          from="0 0"
          to="-80 0"
          dur="6s"
          repeatCount="indefinite"
        />
      </path>

      {/* ── 산책로: 강 아래쪽 둔치 ── */}
      <line
        x1={X0 - 40}
        y1={RIVER_BOT + 14}
        x2={X1 + 40}
        y2={RIVER_BOT + 14}
        stroke="#059669"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <text x={X0 - 40} y={RIVER_BOT + 34} fontSize="10" fill="#047857">
        산책로 (포장·평탄)
      </text>

      {/* ── 흐름 방향 ── */}
      <text x={X0 - 44} y={RIVER_TOP - 10} fontSize="10" fill="#64748b">
        상류
      </text>
      <text x={X1 + 8} y={RIVER_TOP - 10} fontSize="10" fill="#64748b">
        하류
      </text>
      <line
        x1={X0 - 20}
        y1={RIVER_TOP - 14}
        x2={X1 + 2}
        y2={RIVER_TOP - 14}
        stroke="#cbd5e1"
        strokeWidth="1"
        markerEnd="url(#cf-arrow)"
      />
      <defs>
        <marker id="cf-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#cbd5e1" />
        </marker>
      </defs>

      {/* ── 다리 ── */}
      {bridges.map((b, i) => (
        <g key={b}>
          <line
            x1={xs[i]}
            y1={RIVER_TOP - 6}
            x2={xs[i]}
            y2={RIVER_BOT + 6}
            stroke="#475569"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* 라벨을 위·아래로 번갈아 두어 이름이 길어도 겹치지 않게 한다 */}
          <text
            x={xs[i]}
            y={i % 2 === 0 ? RIVER_TOP - 22 : RIVER_BOT + 30}
            fontSize="11"
            fill="#334155"
            textAnchor="middle"
          >
            {b}
          </text>
        </g>
      ))}

      {/* ── 공식 길이 ── */}
      <text x={W / 2} y={H - 6} fontSize="10" fill="#94a3b8" textAnchor="middle">
        서울시 고시 공원 길이 {lengthKm}km · 실제 지도가 아닌 개략 도식입니다
      </text>
    </svg>
  );
}
