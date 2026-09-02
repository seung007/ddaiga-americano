import { hasAnyAffiliate } from "@/lib/shoes/affiliate";

/**
 * 공정위 경제적 이해관계 고지.
 *
 * 규정 근거
 * ─────────
 * 「추천·보증 등에 관한 표시·광고 심사지침」 2024-12-01 시행 개정에서
 * 문자 중심 매체는 **게시물의 제목 또는 첫 부분**에 경제적 이해관계를 밝히도록 바뀌었다.
 * 이전에 허용되던 "끝 부분 표시"는 폐지됐다. 그래서 이 배너는 페이지 맨 위에 둔다.
 *
 * 왜 스위치가 없는가
 * ──────────────────
 * `hasAnyAffiliate()`가 제휴 링크 등록 여부를 보고 스스로 켜진다.
 * 수동 플래그를 두면 링크를 넣고 고지를 잊는 순간 **표시 없는 광고**가 된다.
 * 반대로 링크를 다 뺐는데 고지가 남으면 하지도 않은 제휴를 밝히는 셈이라
 * 그것도 정확하지 않다. 데이터에서 파생시키면 둘 다 생기지 않는다.
 *
 * 문구에 대해
 * ───────────
 * "추천 순서는 광고비로 바뀌지 않습니다"는 기존 문구이고 여전히 참이다 —
 * 추천 알고리즘은 제휴 여부를 보지 않는다(lib/shoes/recommend.ts 어디에도
 * 제휴 관련 가중치가 없다). 다만 그 문장은 **수수료를 받는다는 사실 자체를
 * 밝히지 않으므로** 고지로는 부족하다. 그래서 둘을 함께 적는다.
 */
export default function AffiliateNotice() {
  if (!hasAnyAffiliate()) return null;

  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <p className="text-sm font-semibold text-amber-900">
        이 페이지의 일부 구매 링크는 제휴 링크입니다
      </p>
      <p className="mt-1 text-xs leading-relaxed text-amber-800">
        해당 링크를 통해 구매가 일어나면 저희가 <strong>일정액의 수수료</strong>를 받습니다.
        구매자가 더 내는 금액은 없습니다.
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-amber-800">
        <strong>추천 순서는 수수료로 바뀌지 않습니다.</strong> 추천 알고리즘은 제휴 여부를
        아예 보지 않습니다 — 체형·발볼·발 타입·부상 이력·예산만 계산합니다.
        제휴가 없는 신발이 1순위로 나오는 경우가 많고, 그게 정상입니다.
      </p>
    </div>
  );
}
