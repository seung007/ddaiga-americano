import { KR_AVAILABILITY_LABEL, withFootTypes } from "@/lib/shoes/types";
import type { Shoe } from "@/lib/shoes/types";

/**
 * 두 신발 스펙 비교 — 러닝화 찾기 비교 칸과 /compare 페이지가 같이 쓴다.
 *
 * 2026-11-18 (3차): 다른 비교 화면을 직접 열어 재고 다시 짰다(docs/조사/벤치마킹_2026-09-12.md 「비교 화면」).
 * - 어느 칸이 어느 신발인지: RTINGS·versus 는 신발마다 색을 하나 주고 이름 띠를 화면 위에 붙여 둔다.
 *   우리 2차는 이름이 맨 위에만 있어 스크롤하면 왼쪽·오른쪽이 누구인지 잊었다.
 *   → 이름 띠를 머리글 아래에 붙이고, 아래 두께 그림(ShoeSideProfile)과 같은 색(초록·남색)을 준다.
 * - 더 나은 쪽 표시: versus 는 나은 값만 굵게, 차이(+1600 nits)는 오른쪽에 나은 쪽 색 딱지로.
 *   우리 2차는 값 아래에 같은 초록 딱지를 붙여서 딱지가 어느 신발 편인지 색으로 안 갈렸고 줄만 늘었다.
 *   → 차이는 항목 이름 줄 오른쪽에, 값은 두 칸에 깔끔하게.
 * - 좋고 나쁨은 방향이 분명한 것(가격·무게)만 매긴다. 두께·굽 차이·쿠션은 큰 쪽이 좋다는 근거를
 *   이 사이트가 확인하지 못했으므로 「8mm 차이」처럼 크기만 적고 어느 쪽도 굵게 하지 않는다.
 * - 색만으로 가르지 않는다: 나은 값은 색 + 굵기, 차이 딱지는 글자로 「저렴」「가벼움」을 말한다.
 * - 같은 점은 상자 속 상자를 없애고 한 줄 목록으로(애플·삼성처럼 같은 값은 한 번).
 */

type Better = "low" | null; // 낮을수록 나은 것만 있다(가격·무게)
type Row = {
  label: string;
  va: string;
  vb: string;
  na?: number;
  nb?: number;
  better?: Better;
  unit?: string;
  word?: string; // 나은 쪽 차이 딱지 끝말(저렴·가벼움)
};

const WIDTH_KR: Record<string, string> = { B: "좁음", D: "보통", "2E": "넓음", "4E": "아주 넓음" };
const STAB_KR: Record<string, string> = { neutral: "중립", stability: "안정화", motion_control: "모션컨트롤" };
const FOOT_KR: Record<string, string> = { flat: "평발", neutral: "중립 아치", high_arch: "높은 아치" };
const USE_KR: Record<string, string> = { daily: "데일리", long: "장거리", tempo: "템포", racing: "레이싱" };

// 이어진 폭이 셋 이상이면 「좁음~아주 넓음」처럼 범위로 — 다 늘어놓으면 390px 에서 두 줄이 된다
const WIDTH_ORDER = ["B", "D", "2E", "4E"];
function widthText(opts: string[]): string {
  const idx = opts.map(w => WIDTH_ORDER.indexOf(w)).filter(i => i >= 0).sort((x, y) => x - y);
  const contiguous = idx.length === opts.length && idx.every((v, k) => k === 0 || v === idx[k - 1] + 1);
  if (contiguous && idx.length >= 3) return `${WIDTH_KR[WIDTH_ORDER[idx[0]]]}~${WIDTH_KR[WIDTH_ORDER[idx[idx.length - 1]]]}`;
  return opts.map(w => WIDTH_KR[w] ?? w).join("·");
}

function rowsFor(a: Shoe, b: Shoe): Row[] {
  const foot = (s: Shoe) => withFootTypes(s).footTypes.map(f => FOOT_KR[f] ?? f).join(" · ");
  return [
    { label: "가격", va: a.priceKrw.toLocaleString() + "원", vb: b.priceKrw.toLocaleString() + "원",
      na: a.priceKrw, nb: b.priceKrw, better: "low", unit: "원", word: "저렴" },
    { label: "무게", va: a.weightGramsM9 + "g", vb: b.weightGramsM9 + "g",
      na: a.weightGramsM9, nb: b.weightGramsM9, better: "low", unit: "g", word: "가벼움" },
    { label: "밑창 두께", va: a.stackHeightMm + "mm", vb: b.stackHeightMm + "mm",
      na: a.stackHeightMm, nb: b.stackHeightMm, unit: "mm" },
    { label: "앞뒤 굽 차이", va: a.heelDropMm + "mm", vb: b.heelDropMm + "mm",
      na: a.heelDropMm, nb: b.heelDropMm, unit: "mm" },
    { label: "쿠션", va: `${a.cushioning} / 5`, vb: `${b.cushioning} / 5`,
      na: a.cushioning, nb: b.cushioning, unit: "단계" },
    { label: "발볼 폭", va: widthText(a.widthOptions), vb: widthText(b.widthOptions) },
    { label: "안정화", va: STAB_KR[a.stability] ?? "", vb: STAB_KR[b.stability] ?? "" },
    { label: "맞는 발", va: foot(a), vb: foot(b) },
    { label: "용도", va: a.uses.map(u => USE_KR[u] ?? u).join(" · "), vb: b.uses.map(u => USE_KR[u] ?? u).join(" · ") },
    { label: "국내 구매", va: KR_AVAILABILITY_LABEL[a.krAvailability], vb: KR_AVAILABILITY_LABEL[b.krAvailability] },
  ];
}

// 두께 그림(ShoeSideProfile PROFILE_COLORS)과 같은 순서의 색이어야 한다 — 어긋나면 그림과 표가 서로 다른 신발을 가리킨다
const COLORS = [
  { text: "text-emerald-700", dot: "bg-emerald-600", chip: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  { text: "text-indigo-700", dot: "bg-indigo-600", chip: "bg-indigo-50 text-indigo-800 ring-indigo-200" },
];

export default function ShoeCompareSpecs({ shoes, stickyTop = "top-[61px]" }: { shoes: Shoe[]; stickyTop?: string }) {
  const [a, b] = shoes;
  if (!a || !b) return null;
  const rows = rowsFor(a, b);
  const diff = rows.filter(r => r.va !== r.vb);
  const same = rows.filter(r => r.va === r.vb);

  return (
    <div>
      {/* 이름 띠 — 머리글 바로 아래에 붙는다. 스크롤해도 왼쪽·오른쪽이 누구인지 보이게 */}
      <div className={`sticky ${stickyTop} z-10 -mx-1 grid grid-cols-2 gap-3 border-b border-gray-200 bg-white px-1 py-2 sm:grid-cols-[9rem_1fr_1fr]`}>
        <div className="hidden sm:block" />
        {[a, b].map((s, i) => (
          <div key={s.id} className="flex min-w-0 items-center gap-2">
            <span aria-hidden className={`h-2.5 w-2.5 shrink-0 rounded-full ${COLORS[i].dot}`} />
            <p className="min-w-0 truncate text-sm font-semibold text-gray-900">
              <span className="font-normal text-gray-500">{s.brand} </span>{s.model}
            </p>
          </div>
        ))}
      </div>

      <h4 className="mt-6 text-base font-bold text-gray-900">다른 점 {diff.length}개</h4>
      {diff.length === 0 ? (
        <p className="mt-2 text-sm text-gray-700">비교한 항목이 모두 같아요.</p>
      ) : (
        <ul className="mt-2 divide-y divide-gray-100">
          {diff.map(r => {
            const numeric = r.na !== undefined && r.nb !== undefined && r.na !== r.nb;
            const gap = numeric ? Math.abs(r.na! - r.nb!) : 0;
            const win = numeric && r.better === "low" ? (r.na! < r.nb! ? 0 : 1) : null;
            const gapText = numeric
              ? `${gap.toLocaleString()}${r.unit === "원" ? "원" : r.unit === "단계" ? "단계" : r.unit} ${win !== null ? r.word : "차이"}`
              : null;
            return (
              <li key={r.label} className="py-3 sm:grid sm:grid-cols-[9rem_1fr_1fr] sm:items-baseline sm:gap-3">
                <div className="flex items-center justify-between gap-2 sm:block">
                  <p className="text-sm text-gray-600">{r.label}</p>
                  {gapText && (
                    <span
                      className={`whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-semibold ring-1 ring-inset sm:mt-1 sm:inline-block ${
                        win !== null ? COLORS[win].chip : "bg-gray-50 text-gray-600 ring-gray-200"
                      }`}
                    >
                      {win !== null && <span className="sr-only">{(win === 0 ? a : b).model} </span>}
                      {gapText}
                    </span>
                  )}
                </div>
                <div className="mt-1 grid grid-cols-2 gap-3 sm:mt-0 sm:contents">
                  {[r.va, r.vb].map((v, i) => (
                    <p
                      key={i}
                      className={`text-base leading-snug ${
                        win === null ? "font-semibold text-gray-900" : win === i ? `font-bold ${COLORS[i].text}` : "font-normal text-gray-700"
                      }`}
                    >
                      {v}
                    </p>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {same.length > 0 && (
        <>
          <h4 className="mt-6 text-base font-bold text-gray-900">같은 점 {same.length}개</h4>
          <dl className="mt-2 grid grid-cols-[6rem_1fr] gap-x-3 gap-y-2 sm:grid-cols-[9rem_1fr]">
            {same.map(r => (
              <div key={r.label} className="contents">
                <dt className="text-sm text-gray-600">{r.label}</dt>
                <dd className="text-sm font-medium text-gray-900">{r.va}</dd>
              </div>
            ))}
          </dl>
        </>
      )}

      <p className="mt-4 text-xs leading-5 text-gray-500">
        색 딱지는 가격이 낮거나 무게가 가벼운 쪽이에요. 두께·굽 차이·쿠션은 많고 적음에 좋고 나쁨을 매기지 않았어요.
      </p>

      <details className="mt-2 border-t border-gray-100 pt-1 text-sm text-gray-700">
        <summary className="flex min-h-11 cursor-pointer items-center font-medium text-emerald-800 hover:text-emerald-900">용어 설명 보기</summary>
        <ul className="mt-1 space-y-2 leading-6">
          <li><strong>밑창 두께(스택)</strong> — 뒤꿈치 쪽 밑창 두께. 두꺼울수록 푹신하고, 얇을수록 바닥 느낌이 잘 와요.</li>
          {/* 2026-11-23 hyun 님 결정(화면에는 확실한 것만): 용어 설명은 뜻만 적는다. 예전에 붙였던 근거 설명(드롭 「근거 확인 못 함」, 쿠션 「근거는 생각보다 약해요」,
              안정화 「연구가 갈려요 — Malisoux 2016 RCT 1건」)은 뺐다. 근거의 무게는 추천 점수 쪽(recommend.ts 주석)과 약관 3항에 남아 있다 */}
          <li><strong>앞뒤 굽 차이(드롭)</strong> — 뒤꿈치가 앞발보다 높은 정도.</li>
          <li><strong>쿠션</strong> — 밑창 두께로 나눈 단계(1~5). 높을수록 밑창이 두꺼워요.</li>
          <li><strong>안정화</strong> — 발이 안쪽으로 쏠리는 걸 줄이는 구조.</li>
          <li><strong>발볼 폭</strong> — D 보통 · 2E 넓음 · 4E 아주 넓음.</li>
        </ul>
      </details>
    </div>
  );
}

export const COMPARE_BUTTON_COLORS = ["bg-emerald-700 hover:bg-emerald-800", "bg-indigo-700 hover:bg-indigo-800"];
