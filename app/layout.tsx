import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import SiteFooter from "@/components/SiteFooter";
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
  verification: {
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
