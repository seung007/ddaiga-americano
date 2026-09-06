import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

/**
 * GA4는 프로덕션 배포에서만 로드한다.
 *
 * 이전에는 GA_ID만 보고 무조건 주입했다. 그래서 preview 배포(브랜치·PR)에서 찍힌
 * 이벤트가 프로덕션 속성에 그대로 섞였다. 2026-08-27 감사에서 28일간 사용자 67명 중
 * 65명이 first_visit으로 잡히는 이상 패턴이 나왔는데, 개발용 트래픽이 매번 신규
 * 사용자로 카운트된 것이 원인 후보 중 하나다.
 * VERCEL_ENV는 서버에서만 읽히며 이 파일은 서버 컴포넌트라 빌드 시점에 평가된다.
 */
const IS_PROD_DEPLOY = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
const GA_ID = IS_PROD_DEPLOY ? process.env.NEXT_PUBLIC_GA_ID : undefined;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ddaiga-americano.vercel.app";

const SITE_TITLE = "뛰다가 아메리카노 — 초보 러너를 위한 러닝화 추천";
const SITE_DESC = "키·체중·발볼·발 타입에 맞는 러닝화를 1분 만에 찾고, 무릎·발목·아킬레스건 부상 예방법을 확인하세요.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESC,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    url: SITE_URL,
    siteName: "뛰다가 아메리카노",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "뛰다가 아메리카노 — 초보 러너를 위한 러닝화 추천",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ["/opengraph-image"],
  },
  /**
   * 2026-09-06: 구글 인증 자리를 환경변수로 열어 뒀다.
   *
   * 구글 유입이 **2.7%**다. 한국 구글 점유율은 측정 방식에 따라 28~47%인데
   * 어떤 기준으로 봐도 2.7%는 비정상이다. 그런데 **원인을 모른다** —
   * 색인이 안 된 것(노출 0)인지 순위가 낮은 것(노출은 있는데 클릭 0)인지
   * Search Console을 봐야 갈린다. `유입_설정_기준선.md`에 미확인으로 3주째 적혀 있다.
   *
   * 값이 없으면 이 메타태그는 아예 렌더되지 않는다(undefined면 Next가 생략한다).
   * Vercel 환경변수에 `GOOGLE_SITE_VERIFICATION`을 넣고 재배포하면 켜진다.
   * **코드를 고칠 필요가 없다** — 절차는 `설정_안내.md` 참고.
   */
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: { "naver-site-verification": "2d395d28fe901aa9b5db7136be81a47665ba57a2" },
  },
};

// schema.org WebSite — 구글 및 AI 검색의 사이트 인식용 구조화 데이터
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "뛰다가 아메리카노",
  alternateName: "ddaiga-americano",
  url: SITE_URL,
  description: "키·체중·발볼·발 타입에 맞는 러닝화를 1분 만에 찾고, 무릎·발목·아킬레스건 부상 예방법을 확인하세요.",
  inLanguage: "ko",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* 2026-09-06: 헤더를 여기로 올렸다.
            그전에는 페이지마다 <SiteHeader /> 를 직접 넣는 방식이었고,
            **5개 페이지에서 빠져 있었다** — /courses 와 계산기 3개 전부, /login.
            로고가 없으니 홈으로 돌아갈 길이 없었고, 더 나쁜 건 **그 페이지에서
            나가는 내부 링크가 하나도 없었다**는 것이다. `/tools` 에는
            "각각이 별개의 검색 입구가 된다"고 주석까지 달아 놓고 정작 출구가 없었다.
            같은 날 GSC 가 "참조 페이지: 감지된 페이지 없음"이라고 한 것과 같은 병이다.
            푸터처럼 전역으로 두면 **다음 페이지를 만들 때 기억할 필요가 없다.** */}
        <SiteHeader />
        {children}
        <SiteFooter />
        <Analytics />
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "x43c7slqpi");`}
        </Script>
      </body>
    </html>
  );
}
