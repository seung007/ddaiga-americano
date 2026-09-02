/**
 * 제휴(어필리에이트) 링크 — 여기 한 곳에만 넣는다.
 *
 * 왜 별도 파일인가
 * ────────────────
 * `data.ts`는 2,100줄이고 신발 52종 × 구매 링크 250개가 들어 있다.
 * 그 안에서 제휴 링크를 찾아 고치는 건 실수하기 좋은 작업이고,
 * 무엇보다 **"어디에 제휴 링크가 있는지"가 한눈에 안 보인다.**
 * 공정위 고지는 제휴 링크의 존재 여부에 달려 있으므로, 그 목록이
 * 흩어져 있으면 고지가 실제와 어긋나기 쉽다. 그래서 한 파일로 모은다.
 *
 * 쿠팡 파트너스 링크는 URL 조합으로 만들 수 없다
 * ──────────────────────────────────────────────
 * 2026-09-01 확인. 파트너스 "간편 링크 만들기"에서 상품 URL을 넣고
 * 생성 버튼을 눌러야 `link.coupang.com/a/XXXXXX` 형태가 나온다.
 * 추적 코드를 기존 URL에 붙이는 방식은 확인되지 않았다.
 * 따라서 **사람이 생성해서 아래 표에 붙여넣는 수밖에 없다.**
 *
 * 넣는 법
 * ───────
 *   1. 쿠팡에서 해당 신발 상품 페이지를 연다
 *   2. 파트너스 → 간편 링크 만들기 → URL 붙여넣고 생성
 *   3. 나온 `https://link.coupang.com/a/...` 를 아래 표의 신발 id 아래 넣는다
 *
 * 넣는 순간 그 신발의 "쿠팡 검색" 링크가 제휴 링크로 바뀌고,
 * **해당 페이지 상단에 공정위 고지가 자동으로 뜬다.** (components/AffiliateNotice.tsx)
 * 고지를 따로 켜는 스위치는 없다 — 잊어버릴 수 없게 하려고 일부러 그렇게 했다.
 *
 * ⚠️ 처음부터 52개를 다 하지 마세요
 * ─────────────────────────────────
 * 28일 실측으로 `buy_link_click`이 9건 / 사용자 4명이다. 낙관적으로 잡아도
 * 월 수천 원 규모다. 몇 개만 넣어 **파이프가 실제로 도는지 먼저 확인**하고,
 * 수익이 0이 아닌 것이 확인된 뒤에 늘리는 편이 낫다.
 */

/** 신발 id → 쿠팡 파트너스 간편 링크 */
export const COUPANG_PARTNER_LINKS: Record<string, string> = {
  // 예시 (실제 링크로 교체할 것):
  // "hoka-clifton-10": "https://link.coupang.com/a/XXXXXX",
};

/** 제휴 링크가 하나라도 등록돼 있는가 — 공정위 고지 노출 조건 */
export function hasAnyAffiliate(): boolean {
  return Object.keys(COUPANG_PARTNER_LINKS).length > 0;
}

/** 이 신발에 제휴 링크가 있는가 */
export function affiliateFor(shoeId: string): string | undefined {
  return COUPANG_PARTNER_LINKS[shoeId];
}

/**
 * 화면에 그릴 구매 링크 — 쿠팡 항목이 있고 제휴 링크가 등록돼 있으면 갈아끼운다.
 *
 * data.ts를 건드리지 않는다. 제휴 관계는 상업적 사정으로 자주 바뀌는데
 * 신발 스펙 데이터와 같은 파일에 섞이면 서로의 이력을 더럽힌다.
 *
 * `isAffiliate`가 붙은 링크는 화면에서 표시를 달아야 한다 —
 * 페이지 상단 고지(AffiliateNotice)와 별개로, **어느 링크가 제휴인지**를
 * 링크 옆에서도 알 수 있어야 읽는 사람이 스스로 판단할 수 있다.
 */
export function resolveBuyLinks<T extends { label: string; url: string; isOfficial: boolean }>(
  shoeId: string,
  links: readonly T[]
): Array<T & { isAffiliate?: boolean }> {
  const partner = affiliateFor(shoeId);
  if (!partner) return links as Array<T & { isAffiliate?: boolean }>;
  return links.map((l) =>
    l.url.includes("coupang.com") ? { ...l, url: partner, isAffiliate: true } : l
  );
}
