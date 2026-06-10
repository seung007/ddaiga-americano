export type FaqItem = { q: string; a: string };

/**
 * FAQ 섹션 + FAQPage JSON-LD (schema.org)
 * 구글 리치 결과 및 AI 검색(ChatGPT 등) 인용 노출을 위한 구조화 데이터.
 */
export default function FaqSection({ items }: { items: FaqItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
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
