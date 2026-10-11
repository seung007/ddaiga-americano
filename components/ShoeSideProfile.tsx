import type { Shoe } from "@/lib/shoes/types";

/**
 * 러닝화 단면 비교 — 브랜드 공개 스펙(뒤꿈치 두께·드롭·무게)만으로 그린 개략도 (2026-10-12)
 *
 * 왜 「착용감 체험」이 아니라 이것인가
 * ─────────────────────────────────
 * hyun 님 아이디어는 「러닝화를 고르면 착용감을 알려주는」 것이었다. 착용감은 발과 신발이 만나야
 * 생기는 것이라 화면이 말해줄 수 없다. 만들면 그 자리를 지어낸 형용사가 채운다 — 이 저장소가
 * 판단 필드를 비워 둔 이유와 같다(lib/shoes/types.ts 「판단 필드 4개」).
 * 대신 **숫자로 공개된 것만 같은 축척으로 겹쳐** 보여준다. 두께 차이는 표의 숫자보다 그림으로 볼 때 잘 보인다.
 *
 * 그리는 규칙
 *   · 세로(두께)만 실제 비율이다. 1mm = 같은 픽셀 수
 *   · 가로(길이)·모양은 **임의**다. 브랜드가 길이·락커 형상을 공개하지 않는다
 *   · 앞꿈치 두께 = 뒤꿈치 두께(stackHeightMm) − 드롭(heelDropMm)
 *   · 좋고 나쁨을 표시하지 않는다. 두께·드롭과 부상 위험의 관계를 이 사이트는 확인하지 못했다
 *
 * 서버·클라이언트 어디서나 렌더된다(상태 없음). 고르는 UI 는 /tools/shoe-side 에 있다.
 */

export const PROFILE_COLORS = [
  { stroke: "#059669", fill: "rgba(5,150,105,0.18)", text: "text-emerald-700", dot: "bg-emerald-600" },
  { stroke: "#4f46e5", fill: "rgba(79,70,229,0.16)", text: "text-indigo-700", dot: "bg-indigo-600" },
  { stroke: "#d97706", fill: "rgba(217,119,6,0.16)", text: "text-amber-700", dot: "bg-amber-600" },
] as const;

const W = 420; // 휴대폰 폭에서 글자가 읽히도록 좁게(글자는 viewBox 단위라 화면 폭에 비례해 줄어든다)
const H = 250;
const PAD_L = 40;
const PAD_R = 16;
const GROUND = 220; // 지면 y
const MAX_MM = 55; // 위쪽 눈금 끝(데이터 최대 50mm)
const PX_PER_MM = (GROUND - 20) / MAX_MM;
const HEEL_X = PAD_L + 30;
const TOE_X = W - PAD_R - 30;

function forefootMm(s: Shoe) {
  return Math.max(0, s.stackHeightMm - s.heelDropMm);
}

/** 여성 전용 모델은 W8 무게가 원장에 있으면 그걸 쓴다. 사이즈 기준이 다르면 같이 비교하지 않는다고 적는다. */
export function weightOf(s: Shoe): { g: number; basis: "M9" | "W8" } {
  if (s.gender === "female" && s.weightGramsW8) return { g: s.weightGramsW8, basis: "W8" };
  return { g: s.weightGramsM9, basis: "M9" };
}

export default function ShoeSideProfile({ shoes }: { shoes: Shoe[] }) {
  const list = shoes.slice(0, 3);
  const y = (mm: number) => GROUND - mm * PX_PER_MM;
  const weights = list.map(weightOf);
  const maxG = Math.max(...weights.map((w) => w.g), 1);
  const mixedBasis = new Set(weights.map((w) => w.basis)).size > 1;

  return (
    <figure className="rounded-2xl border border-gray-200 p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="러닝화 미드솔 두께 비교 개략도">
        {/* 눈금 — 10mm 간격 */}
        {[0, 10, 20, 30, 40, 50].map((mm) => (
          <g key={mm}>
            <line x1={PAD_L} x2={W - PAD_R} y1={y(mm)} y2={y(mm)} stroke={mm === 0 ? "#9ca3af" : "#e5e7eb"} strokeWidth={mm === 0 ? 1.5 : 1} />
            <text x={PAD_L - 6} y={y(mm) + 4} textAnchor="end" fontSize="14" fill="#9ca3af">
              {mm}
            </text>
          </g>
        ))}
        <text x={PAD_L - 6} y={14} textAnchor="end" fontSize="13" fill="#9ca3af">
          mm
        </text>
        <text x={HEEL_X} y={GROUND + 24} textAnchor="middle" fontSize="15" fill="#6b7280">
          뒤꿈치
        </text>
        <text x={TOE_X} y={GROUND + 24} textAnchor="middle" fontSize="15" fill="#6b7280">
          앞꿈치
        </text>

        {list.map((s, i) => {
          const c = PROFILE_COLORS[i];
          const heel = y(s.stackHeightMm);
          const fore = y(forefootMm(s));
          // 뒤꿈치 끝을 살짝 둥글린 쐐기. 모양은 임의, 두 높이만 실제 값
          const d = [
            `M ${HEEL_X - 18} ${GROUND}`,
            `L ${TOE_X + 18} ${GROUND}`,
            `Q ${TOE_X + 26} ${GROUND} ${TOE_X + 22} ${(GROUND + fore) / 2}`,
            `L ${TOE_X} ${fore}`,
            `L ${HEEL_X} ${heel}`,
            `Q ${HEEL_X - 22} ${heel} ${HEEL_X - 18} ${GROUND}`,
            "Z",
          ].join(" ");
          return (
            <g key={s.id}>
              <path d={d} fill={c.fill} stroke={c.stroke} strokeWidth={2} strokeLinejoin="round" />
              <circle cx={HEEL_X} cy={heel} r={3.5} fill={c.stroke} />
              <circle cx={TOE_X} cy={fore} r={3.5} fill={c.stroke} />
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-3 space-y-3">
        <ul className="space-y-2">
          {list.map((s, i) => {
            const c = PROFILE_COLORS[i];
            const w = weights[i];
            return (
              <li key={s.id} className="text-sm">
                <div className="flex items-center gap-2">
                  <span className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${c.dot}`} />
                  <span className="font-medium text-gray-900">
                    {s.brand} {s.model}
                  </span>
                </div>
                <p className="ml-[18px] text-xs text-gray-600">
                  뒤꿈치 {s.stackHeightMm}mm · 앞꿈치 {forefootMm(s)}mm · 드롭 {s.heelDropMm}mm · 무게 {w.g}g({w.basis})
                </p>
                <div className="ml-[18px] mt-1 h-1.5 rounded-full bg-gray-100">
                  <div className={`h-1.5 rounded-full ${c.dot}`} style={{ width: `${(w.g / maxG) * 100}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
        <p className="text-xs leading-relaxed text-gray-500">
          세로(두께)만 실제 비율이고, 길이와 모양은 임의로 그렸습니다. 수치는 브랜드 공개 스펙이며 신발 상세 페이지에 출처가 있습니다.
          두께나 드롭이 클수록 좋다·나쁘다는 표시는 하지 않았습니다 — 그 관계를 저희가 확인하지 못했습니다.
          {mixedBasis && " 무게는 사이즈 기준(M9·W8)이 달라 직접 비교할 수 없습니다."}
        </p>
      </figcaption>
    </figure>
  );
}
