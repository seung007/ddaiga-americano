/**
 * ArticleJsonLd — schema.org Article 구조화 데이터
 * 구글 리치스니펫 및 AI 검색(ChatGPT, Perplexity 등) 인용을 위해
 * injury 콘텐츠 페이지에 삽입.
 *
 * 사용법:
 *   <ArticleJsonLd
 *     headline="러너 무릎 예방법"
 *     description="..."
 *     url="https://ddaiga-americano.vercel.app/injury/knee-pain"
 *   />
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ddaiga-americano.vercel.app";

const PUBLISHER = {
  "@type": "Organization",
  name: "뛰다가 아메리카노",
  url: SITE_URL,
};

type Props = {
  headline: string;
  description: string;
  url: string;
  /** 페이지 최초 발행일 (ISO 8601). 생략 시 현재 날짜 사용 */
  datePublished?: string;
  /** 이미지 URL (절대 경로). 생략 시 OG 이미지 사용 */
  image?: string;
};

export default function ArticleJsonLd({
  headline,
  description,
  url,
  datePublished,
  image,
}: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url,
    inLanguage: "ko",
    image: image ?? `${SITE_URL}/opengraph-image`,
    publisher: PUBLISHER,
    author: PUBLISHER,
    datePublished: datePublished ?? "2025-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
