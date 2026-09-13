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
        {items.map((i, idx) => (
          <details
            key={i.q}
            /**
             * 첫 항목만 펼쳐 둔다 (2026-09-13).
             *
             * 감사에서 나온 것: **FAQ 답변이 본문보다 구체적인 경우가 많다.**
             * `/injury/midfoot` 본문에는 없는 실행 지시("케이던스를 5~10% 높이세요")가
             * FAQ 안에만 있었다. 그런데 이 블록은 논문 목록과 유튜브 아래에,
             * 그것도 **전부 접힌 채로** 있었다.
             *
             * 네이버 유입의 79.55%가 모바일이다. 영상 8개를 지나 접힌 상자를
             * 열어 볼 사람은 없다. 좋은 답을 써 놓고 안 보이게 둔 것이다.
             *
             * 전부 펼치지 않는 이유 — 그러면 목록의 훑어보기 기능이 사라진다.
             * 하나만 펼쳐 두면 "여기 답이 들어 있다"는 신호가 되면서 목록도 남는다.
             */
            open={idx === 0}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3"
          >
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
