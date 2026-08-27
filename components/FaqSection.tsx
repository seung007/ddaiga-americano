export type FaqItem = { q: string; a: string };

/**
 * FAQ 섹션 + FAQPage JSON-LD (schema.org)
 * 구글 리치 결과 및 AI 검색(ChatGPT 등) 인용 노출을 위한 구조화 데이터.
 */
/**
 * 구조화 데이터로 나가는 답변에 붙는 면책.
 *
 * 화면의 면책 문구는 리치 결과나 AI 인용에 따라오지 않는다 — 발췌되는 건 acceptedAnswer.text 뿐이다.
 * 이 사이트의 답변 상당수가 증상·통증을 다루므로, 문맥이 잘려나가는 경로에도 같은 한 줄이 붙어야 한다.
 */
const SCHEMA_DISCLAIMER =
  " (이 답변은 일반적인 정보이며 의학적 진단이나 치료를 대체하지 않습니다. 통증이 지속되면 전문의와 상담하세요.)";

export default function FaqSection({ items }: { items: FaqItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a + SCHEMA_DISCLAIMER },
    })),
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">자주 묻는 질문</h2>
      <div className="flex flex-col gap-3">
        {items.map((i) => (
          <details key={i.q} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <summary className="cursor-pointer font-semibold text-sm text-gray-900 hover:text-emerald-700">
              {i.q}
            </summary>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{i.a}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
