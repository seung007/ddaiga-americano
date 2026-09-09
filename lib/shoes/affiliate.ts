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
 * ⚠️ `coupang.com` 은 Claude 브라우저에서 **차단**돼 있다 (2026-09-08 확인).
 * `partners.coupang.com` 도, `www.coupang.com` 도 열리지 않는다. 우회하지 않는다.
 * 그래서 이 절차는 **전부 사람 손**이고, Claude 는 결과 링크만 받아 적는다.
 *
 * 입력 URL 형태 — 조립하지 말고 쿠팡이 만든 것을 복사한다
 * ────────────────────────────────────────────────────────
 * 2026-09-08: 내가 URL 을 손으로 조립해서 파트너스에 넣었더니 거부됐다.
 *   넣은 것: `https://www.coupang.com/np/search?q=Nike%20Pegasus%2042`
 *   응답:    "이 URL은 지원하지 않는 형태입니다"
 *
 * 그리고 원인을 세 가지로 추측했는데(`component=` 누락 / `channel=` 누락 /
 * `%20` 인코딩) **두 개가 틀렸다.** 쿠팡이 실제로 만든 URL 들은 이랬다:
 *   · `…/np/search?component=&q=페가수스+42&traceId=…&channel=user`
 *   · `…/np/search?q=브룩스 아드레날린 gts25&channel=auto&traceId=…`   (%20 인코딩)
 *   · `…/np/search?q=호카 본디9&channel=auto&traceId=…`
 * `%20` 은 문제가 아니었고 `component=` 은 필수가 아니었다. 공통된 것은
 * **`channel=`** 뿐이다. 다만 이것도 검증한 게 아니라 관찰에서 남은 후보다.
 *
 * 교훈 — **URL 을 조립하지 말고 쿠팡 검색창에서 만들어진 것을 주소창에서 복사한다.**
 * 그러면 형태를 추측할 필요가 없다. 사이트가 만든 URL 은 정의상 지원된다.
 *
 * 넣는 법
 * ───────
 *   1. `coupang.com` 에서 신발을 검색한다(또는 상품 페이지를 연다)
 *   2. **주소창 URL 을 그대로 복사한다** — 손으로 만들지 않는다
 *   3. 파트너스 → 링크 생성 → 붙여넣고 생성
 *   4. 나온 `https://link.coupang.com/a/...` 를 아래 표의 신발 id 아래 넣는다
 *
 * 상품 상세 페이지 대신 검색 결과 URL 을 써도 된다(파트너스가 명시적으로 허용).
 * 러닝화는 사이즈별 재고가 자주 빠져서 상세 페이지 링크는 죽을 수 있다 —
 * 검색 링크는 안 죽는다. 유입이 적은 단계에서는 **관리가 필요 없는 쪽**이 낫다.
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

/**
 * 등록된 제휴 링크 하나의 이력.
 *
 * ⚠️ 왜 문자열 하나가 아니라 객체인가 (2026-09-08)
 * ─────────────────────────────────────────────
 * 처음에는 `신발id → URL` 문자열 맵이었다. 그런데 **틀려도 아무도 모르는 구조**였다.
 *
 * `link.coupang.com/a/gSElJNk9Js` 라는 주소에는 **어느 상품인지가 안 적혀 있다.**
 * 내가 이 값을 넣은 근거는 "내가 URL 을 이 순서로 줬고 hyun 님이 그 순서로
 * 링크를 돌려줬다"는 **대화 순서**뿐이었다. 그 근거는 코드에 안 남는다.
 *
 * 매핑이 뒤바뀌면 아드레날린 페이지의 쿠팡 버튼이 **본디 검색 결과**로 간다.
 * 화면은 멀쩡하고, 링크도 200 으로 열리고, 검사기도 통과한다.
 * **이 저장소가 반복해서 당한 종류의 실패다 — 조용한 실패.**
 *
 * 그래서 두 가지를 같이 적는다.
 *   · `sourceQuery` — 이 링크를 만들 때 넣은 쿠팡 검색어. **확인의 기준**이다.
 *     클릭해서 이 검색어의 결과가 나오면 맞고, 아니면 틀린 것이다.
 *   · `verifiedAt` — 사람이 실제로 클릭해서 확인한 날. 확인 전에는 `null`.
 *
 * `npm run check:affiliate` 가 확인 안 된 항목을 세어 보여준다.
 * Claude 는 `coupang.com` 에 접근할 수 없어서(도메인 차단) **이 확인을 대신할 수 없다.**
 * 그래서 사람이 하는 일이라고 적어 두고, 그 일을 30초로 줄이는 화면을 만든다.
 */
export type PartnerLink = {
  /** 파트너스에서 생성한 단축 링크 */
  url: string;
  /** 이 링크를 만들 때 파트너스에 넣은 쿠팡 검색어 — 확인의 기준 */
  sourceQuery: string;
  /** 저장소에 넣은 날 */
  addedAt: string;
  /** 사람이 클릭해서 맞는 상품이 나오는 것을 확인한 날. 확인 전에는 null */
  verifiedAt: string | null;
};

/**
 * 신발 id → 쿠팡 파트너스 링크
 *
 * 2026-09-08 첫 등록. **현행(후속 미출시) 모델 2개로 시작한다** —
 * 28일 실측이 `buy_link_click` 9건 / 사용자 4명이라 52개를 다 넣을 이유가 없다.
 * 링크 클릭이 파트너스 대시보드에 실제로 잡히는지 확인하는 것이 이번 목표다.
 */
export const COUPANG_PARTNER_LINKS: Record<string, PartnerLink> = {
  // 2026-09-09 hyun 님이 두 링크를 직접 열어 검색 결과가 맞는 것을 확인했다.
  // 순서로 추측했던 매핑이 실제로 맞았다 — 다만 그건 결과이지 근거가 아니었다.
  "brooks-adrenaline-gts-25": {
    url: "https://link.coupang.com/a/gSElJNk9Js",
    sourceQuery: "브룩스 아드레날린 gts25",
    addedAt: "2026-09-08",
    verifiedAt: "2026-09-09",
  },
  "hoka-bondi-9": {
    url: "https://link.coupang.com/a/gSEmN7bIFU",
    sourceQuery: "호카 본디9",
    addedAt: "2026-09-08",
    verifiedAt: "2026-09-09",
  },
  /**
   * 페가수스 42 — 2026-09-09 새로 생성했다.
   *
   * 처음에 받은 링크 두 개(gSpUMkDHky / gSEc4w0nBc)는 **어느 것이 페가수스인지
   * 확인이 안 돼서 버렸다.** 둘 중 하나를 골라 넣는 것보다 하나 더 만드는 쪽이
   * 빠르고 확실했다 — 링크 생성은 30초, 잘못 넣으면 방문자가 엉뚱한 상품을 본다.
   *
   * **확인 안 된 값을 추측으로 채우느니 다시 만드는 게 싸다.**
   */
  "nike-pegasus-42": {
    url: "https://link.coupang.com/a/gSSb580Szc",
    sourceQuery: "페가수스 42",
    addedAt: "2026-09-09",
    verifiedAt: "2026-09-09",
  },
};

/** 제휴 링크가 하나라도 등록돼 있는가 — 공정위 고지 노출 조건 */
export function hasAnyAffiliate(): boolean {
  return Object.keys(COUPANG_PARTNER_LINKS).length > 0;
}

/** 이 신발에 제휴 링크가 있는가 */
export function affiliateFor(shoeId: string): string | undefined {
  return COUPANG_PARTNER_LINKS[shoeId]?.url;
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
/**
 * 좁은 자리에 **두 개만** 보여줄 때 무엇을 고를지.
 *
 * 2026-09-08: 비교 페이지가 `resolveBuyLinks(...).slice(0, 2)` 였다.
 * `data.ts` 의 쿠팡 항목은 3~4번째라 **제휴 링크가 잘려서 화면에 안 나왔다.**
 * 링크를 등록하고 배포했는데 **비교 페이지에서는 도달 자체가 불가능**했다.
 *
 * 화면으로 확인해서 알았다(`npm run shot`). 코드만 보면
 * `resolveBuyLinks` 가 제대로 갈아끼우고 있어서 정상으로 보인다 —
 * 자르는 쪽이 범인인데 자르는 코드에는 제휴라는 단어가 없다.
 *
 * 규칙: **① 공식 판매처 하나, ② 제휴 링크 하나.** 둘 중 없는 자리는 순서대로 채운다.
 * 공식을 먼저 두는 이유는 이 사이트가 "중립 추천"을 주장하기 때문이다 —
 * 수수료가 붙는 링크를 첫 자리에 두면 그 주장과 어긋난다.
 */
export function pickTwoBuyLinks<
  T extends { label: string; url: string; isOfficial: boolean; isAffiliate?: boolean },
>(links: readonly T[]): T[] {
  const official = links.find((l) => l.isOfficial);
  const affiliate = links.find((l) => l.isAffiliate);
  const picked: T[] = [];
  if (official) picked.push(official);
  if (affiliate && affiliate !== official) picked.push(affiliate);
  // 남는 자리는 순서대로 — 공식도 제휴도 없는 신발이 대부분이다.
  for (const l of links) {
    if (picked.length >= 2) break;
    if (!picked.includes(l)) picked.push(l);
  }
  return picked;
}

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
