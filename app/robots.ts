import type { MetadataRoute } from "next";

/**
 * 폴백은 실제로 서비스 중인 주소여야 한다. `app/sitemap.ts`와 같은 이유다.
 *
 * 2026-09-02: sitemap.ts는 이 폴백을 이미 `vercel.app`으로 고쳐놨는데
 * **robots.ts는 미구매 도메인(`ddaiga-americano.com`)으로 남아 있었다.**
 * 한 곳만 고치고 같은 문제가 있는 다른 곳을 안 본 것이다.
 * robots.txt의 Host는 검색엔진에 정본 주소를 알리는 자리라, 여기가 죽은 도메인이면
 * 사이트맵이 옳아도 색인이 흔들릴 수 있다.
 *
 * 라이브 확인(2026-09-02): 프로덕션 robots.txt는 `vercel.app`을 반환한다 —
 * Vercel 환경변수는 올바르게 설정돼 있다. 폴백은 환경변수가 빠지는 순간을 위한 안전망이다.
 * 도메인을 실제로 사면 이 폴백과 sitemap.ts, Vercel 환경변수를 **셋 다** 바꿀 것.
 */
const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ddaiga-americano.vercel.app").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 로그인 페이지는 색인 불필요
      disallow: ["/login"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
