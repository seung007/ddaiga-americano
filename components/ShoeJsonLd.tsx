import type { Shoe } from "@/lib/shoes/types";

/**
 * 신발 구조화 데이터 — `ItemList` 안에 `Product` 를 담는다.
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 만들었나 (2026-09-12)
 *
 * 경쟁 조사(`벤치마킹_2026-09-12.md`)에서 가장 큰 기술 구멍으로 나온 것.
 * 이 사이트는 신발 52종의 **브랜드·가격·무게·드롭·스택을 이미 전부 갖고 있는데**
 * 기계가 읽을 형식으로 내보내지 않고 있었다. 구조화 데이터는
 * `Article` · `FAQPage` · `Organization` · `WebSite` 넷뿐이었다.
 *
 * AI 답변이 상품을 인용할 때 찾는 게 정확히 이 형식이다. 그리고 이건
 * **새 콘텐츠를 하나도 안 만들고** 가진 데이터의 표현만 바꾸는 일이라,
 * 9/20 색인 판정에 영향을 주지 않는다(새 URL 이 안 생긴다).
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 `Product` 하나가 아니라 `ItemList` 인가
 *
 * 이 사이트에는 **신발 개별 페이지가 없다.** 신발은 `/compare/[slug]`(2종)와
 * `/shoe-finder`(추천 결과) 안에만 존재한다. schema.org 에서 한 페이지에
 * 여러 상품이 있을 때 쓰는 형식이 `ItemList` 다. 개별 `Product` 를 여러 개
 * 병렬로 두면 구글이 "이 페이지의 주제 상품"을 못 고른다.
 *
 * ─────────────────────────────────────────────────────────────
 * ⚠️ 지어내지 않은 것 — 이 목록이 이 파일의 핵심이다
 *
 * 스킬 문서의 `Product` 예시에는 `aggregateRating`(평점·리뷰 수)과
 * `availability`(재고)가 들어 있다. **둘 다 넣지 않았다.**
 *
 *   · `aggregateRating` — 이 사이트에는 평점이 없다. 넣으면 **없는 평점을
 *     지어내는 것**이고, 구글 구조화 데이터 정책 위반이다(수동 조치 대상).
 *     리치결과가 탐나서 넣고 싶어지는 자리라 여기 명시해 둔다.
 *   · `availability` — 재고를 추적하지 않는다. `InStock` 을 쓰면 거짓이 된다.
 *   · `url`(상품 페이지) — 개별 페이지가 없으므로 생략한다. 비교 페이지 URL 을
 *     상품 URL 로 쓰면 두 상품이 같은 주소를 가리켜 거짓이 된다.
 *   · `sku` · `gtin` — 없다.
 *
 * 스킬 문서도 같은 말을 한다: *"Never fabricate data"*, *"No empty string
 * values — omit optional fields instead."* 그래서 **없는 필드는 넣지 않는다.**
 *
 * 대신 우리가 **진짜로 가진 것**을 넣는다 — 무게·드롭·스택·쿠션 등급.
 * 그게 이 사이트의 값이고, 경쟁사 대부분이 기계가 읽을 형식으로 안 내놓는 것이다.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ddaiga-americano.vercel.app";

const STABILITY_KO: Record<string, string> = {
  neutral: "중립",
  stability: "안정화",
  motion_control: "모션컨트롤",
};

/** 값이 있을 때만 항목을 만든다. `undefined` 는 JSON.stringify 가 알아서 뺀다. */
function prop(name: string, value: string | number | undefined | null) {
  if (value === undefined || value === null || value === "") return undefined;
  return { "@type": "PropertyValue", name, value: String(value) };
}

function productOf(s: Shoe) {
  return {
    "@type": "Product",
    name: `${s.brand} ${s.model}`,
    brand: { "@type": "Brand", name: s.brand },
    description: s.blurb,
    image: s.imageUrl,
    category: "러닝화",
    // 가격은 실제 한국 권장소비자가다. 재고·평점은 모르므로 넣지 않는다(위 주석 참고).
    offers: {
      "@type": "Offer",
      price: s.priceKrw,
      priceCurrency: "KRW",
    },
    weight: {
      "@type": "QuantitativeValue",
      value: s.weightGramsM9,
      unitCode: "GRM",
      description: "남성 US9 기준",
    },
    // 스펙은 표준 필드가 없어 additionalProperty 로 낸다.
    // 이게 AI 답변이 "드롭 몇 mm?"에 답할 때 읽는 자리다.
    additionalProperty: [
      prop("힐드롭", `${s.heelDropMm}mm`),
      prop("스택 높이", `${s.stackHeightMm}mm`),
      prop("쿠셔닝", `${s.cushioning}/5`),
      prop("안정성 분류", STABILITY_KO[s.stability]),
      prop("폭 옵션", s.widthOptions.join(" · ")),
      prop("카본 플레이트", s.hasCarbon ? "있음" : "없음"),
      // 후속 모델은 있을 때만. 구형임을 기계도 알 수 있어야 한다.
      prop("후속 모델", s.successor),
    ].filter(Boolean),
  };
}

/**
 * @param shoes 이 페이지에 실제로 보이는 신발. **화면에 없는 것을 넣지 않는다** —
 *              구조화 데이터와 화면이 다르면 구글이 스팸으로 본다.
 * @param name  목록 이름 (예: "호카 클리프턴 10 vs 브룩스 고스트 17")
 * @param url   이 페이지의 절대 URL
 */
export default function ShoeJsonLd({
  shoes,
  name,
  url,
}: {
  shoes: readonly Shoe[];
  name: string;
  url: string;
}) {
  if (shoes.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url,
    numberOfItems: shoes.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: shoes.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: productOf(s),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * 빵부스러기 — 이 페이지가 사이트 어디에 있는지 알린다.
 *
 * 검색 결과의 URL 자리에 경로가 표시되고, AI 가 사이트 구조를 이해하는 데도 쓰인다.
 * 우리 사이트는 카테고리가 평면(`/injury` 하나에 20편)이라 깊이 2가 최대다.
 * 경쟁사(러닝위키)는 5대 × 3~6소 계층인데, 그건 콘텐츠가 더 쌓인 뒤 문제다.
 */
export function BreadcrumbJsonLd({
  trail,
}: {
  /** [이름, 경로] 순서대로. 홈은 자동으로 맨 앞에 붙는다. */
  trail: readonly [string, string][];
}) {
  const items = [["홈", "/"] as const, ...trail];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([label, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: label,
      item: `${SITE_URL}${path === "/" ? "" : path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
