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
export const pageUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
