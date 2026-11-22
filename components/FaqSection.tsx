export type FaqItem = { q: string; a: string };

/**
 * 답 안의 **굵게** (2026-11-18): 본문처럼 할 일과 핵심 숫자를 굵게 — FAQ 만 맨글이라 읽기 어려웠다.
 * 화면에서는 <strong>, 구조화 데이터(JSON-LD)에서는 표시만 지운다(AI·검색 인용에 별표가 섞이지 않게).
 */
const plain = (t: string) => t.replace(/\*\*(.+?)\*\*/g, "$1");
function rich(t: string) {
  return t.split(/(\*\*.+?\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong> : part,
  );
}

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
  " (이 답변은 일반적인 정보이고 의사의 진단이나 치료를 대신하지 않아요. 통증이 계속되면 전문의와 상담하세요.)";

/**
 * schemaNote: 구조화 데이터 답변 뒤에 붙는 한 줄. 기본은 의학 면책.
 * 대회·러닝화 상세처럼 증상과 무관한 답에는 그 페이지에 맞는 한 줄을 넘긴다 (2026-11-02, lib/faq.ts).
 */
export default function FaqSection({ items, schemaNote = SCHEMA_DISCLAIMER, title = "자주 묻는 질문" }: { items: FaqItem[]; schemaNote?: string; title?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: plain(i.a) + schemaNote },
    })),
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
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
            className="group/faq rounded-xl border border-gray-200 bg-white px-4 py-3"
          >
            {/* 2026-11-18: 질문(14px)이 답(16px)보다 작았고 ▶▼ 기본 표시가 붙었다 — 목차와 같은 오른쪽 › 로, 질문도 16px */}
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 break-keep text-base font-semibold text-gray-900 hover:text-emerald-700 [&::-webkit-details-marker]:hidden">
              <span>{i.q}</span>
              <span aria-hidden className="shrink-0 text-gray-400 transition-transform group-open/faq:rotate-90">›</span>
            </summary>
            <p className="mt-2 text-base text-gray-700 leading-relaxed">{rich(i.a)}</p>
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
