import ShoeThumb from "@/components/ShoeThumb";
import { NEW_FAMILIES } from "@/lib/shoes/auto";

/**
 * 「공식몰에 새로 올라온 신발」 (2026-11-10)
 *
 * 수집기가 공식몰 러닝 목록에서 찾은 **새 계열** 신발(lib/shoes/auto.ts newFamily). 쿠션·안정성·용도를 판단할 근거가 없어
 * 추천·비교·상세 페이지를 만들지 않고, 공식몰 값(가격·무게·드롭)과 공식몰 링크만 보인다.
 * 모양은 목록 카드와 같은 테두리·모서리를 쓴다(디자인을 새로 만들지 않는다).
 */
export default function NewFamilyList() {
  if (NEW_FAMILIES.length === 0) return null;
  return (
    <section aria-labelledby="new-family" className="mt-12">
      <h2 id="new-family" className="text-xl font-bold text-gray-900">
        공식몰에 새로 올라온 신발
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        공식몰 러닝 목록에서 자동으로 확인한 신발이에요. 아직 쿠션·안정성·용도를 분류하지 않아서 추천에는 넣지 않았어요.
      </p>
      <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        {NEW_FAMILIES.map((s) => (
          <li key={s.id} className="flex flex-col rounded-2xl border border-gray-200 p-3">
            <ShoeThumb src={s.imageUrl} alt={`${s.brand} ${s.model}`} model={s.model} className="aspect-square w-full" />
            <p className="mt-2 text-xs text-gray-500">{s.brand}</p>
            <p className="text-base font-semibold text-gray-900">{s.model}</p>
            <p className="mt-1 text-sm text-gray-600">
              {s.weightG}g{s.weightBasis ? ` (${s.weightBasis})` : ""} · 드롭 {s.dropMm}mm
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {s.priceKrw.toLocaleString()}원 <span className="text-xs font-normal text-gray-500">공식몰 정가</span>
            </p>
            <p className="mt-1 text-xs text-gray-400">{s.checkedAt} 자동 확인</p>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex min-h-11 items-center justify-center rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              공식몰에서 보기 →
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
