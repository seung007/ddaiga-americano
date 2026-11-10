/**
 * 사이트 주소 — **여기 한 곳만 본다.** (2026-10-14)
 *
 * 왜: 도메인 구매(`docs/운영/유입_설정_기준선.md §6`)를 미루던 이유 하나가
 *     `https://ddaiga-americano.vercel.app` 가 42곳에 글자로 박혀 있어서였다.
 *     이제 Vercel 환경변수 `NEXT_PUBLIC_SITE_URL` 하나를 바꾸면 전부 따라온다.
 *
 * 규칙
 *   · 페이지·JSON-LD·RSS·sitemap 의 절대 주소는 `SITE_URL` 또는 `pageUrl()` 로 만든다
 *   · 화면에 글자로 보여 주는 주소(OG 이미지·공유 카드)는 `SITE_HOST`
 *   · 주소를 글자로 다시 박지 않는다 — `scripts/check-site-url.mjs` 가 막는다
 *
 * 도메인을 바꿀 때 코드 밖에서 같이 바꿀 것 (코드는 안 바꿔도 된다):
 *   1. Vercel → Settings → Domains 에 새 도메인 추가, vercel.app 은 자동 301
 *   2. Vercel → Environment Variables → NEXT_PUBLIC_SITE_URL (Production)
 *   3. 로컬 .env 의 NEXT_PUBLIC_SITE_URL
 *   4. 카카오 개발자 콘솔 → JavaScript SDK 도메인 (코스 지도·공유 버튼이 멈춘다)
 *   5. 네이버 서치어드바이저·구글 서치콘솔에 새 주소 등록 + 사이트맵 재제출
 *   6. 네이버 블로그 글 안의 링크 (vercel.app 도 301 로 살아 있지만 새 주소로 바꾸는 게 맞다)
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ddaiga-americano.vercel.app").replace(/\/+$/, "");
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
/** `pageUrl("/injury/midfoot")` → 절대 주소 */
/**
 * 가이드 글 위에 보이는 글쓴이 소개 (사이트 주인 문구, 2026-11-09).
 * GEO 「누가, 언제 썼는지 밝히기」. 사실만 적는다 — 전문 자격은 쓰지 않는다(AGENTS 출처 규칙)
 */
export const AUTHOR_NOTE = "글쓴이 · 러닝을 좋아하고 AI로 체계적으로 훈련하는 운영자. 누구나 편하게 달리도록 돕고 싶어 이 사이트를 만들었습니다.";

/**
 * 공식몰이 아닌 판매처(오픈마켓·리셀·가격비교로 간 쇼핑몰) 링크 옆에 붙이는 안내 (2026-11-10 운영자 「가품 걱정, 우리 책임이 아니게」).
 * 저희는 판매처의 상품을 확인하지 않는다 — 사실이므로 그대로 적는다. 자세한 문장은 약관 5항.
 */
// 2026-11-10 운영자 「세 문장이면 보기도 전에 거부감」 → 한 줄. 책임 문장 전체는 약관 5항
export const SELLER_NOTE = "공식몰 외 판매처의 정품·교환은 각 판매처 기준이에요.";

export const pageUrl =(path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
