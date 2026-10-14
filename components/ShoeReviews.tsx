import { reviewsFor, SOURCE_LABEL } from "@/lib/shoes/reviews";

/**
 * 「신어본 사람들 — 블로그·유튜브」 (2026-10-14). 데이터·원칙은 lib/shoes/reviews.ts 머리 주석.
 * 서버 컴포넌트 — JSON 을 빌드 시점에 읽는다. 안 모은 신발은 null 을 돌려 받고 아무것도 안 그린다.
 */
export default function ShoeReviews({ shoeId }: { shoeId: string }) {
  const r = reviewsFor(shoeId);
  if (!r) return null;
  return (
    <section className="mt-8">
      <h2 className="mb-1 text-xl font-bold text-gray-900">신어본 사람들 — 블로그·유튜브</h2>
      <p className="mb-3 text-xs text-gray-500">
        {r.rule} · {r.collectedAt} 기준 {r.items.length}건. 고르지 않고 전부 실었습니다. 요약은 이 사이트가 썼고 원문은 링크에서 읽으세요.
      </p>
      <ul className="flex flex-col gap-3">
        {r.items.map((it) => (
          <li key={it.url} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span className="rounded-full bg-gray-100 px-2 py-0.5">{SOURCE_LABEL[it.source]}</span>
              <span>{it.author}</span>
              <span>·</span>
              <time dateTime={it.date}>{it.date}</time>
              {it.commercial && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-800">{it.commercial}</span>
              )}
            </div>
            <a
              href={it.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="mt-1 block break-keep text-sm font-semibold text-gray-900 hover:underline"
            >
              {it.title} ↗
            </a>
            {it.facts.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {it.facts.map((f) => (
                  <li key={f} className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-gray-400">
        후기 작성자와 이 사이트는 금전 관계가 없습니다. 노란 표시는 원문에 보이는 쇼핑 링크·수수료 고지를 그대로 옮긴 것이고, 표시가 없어도 협찬 여부는 원문에서 확인하세요.
      </p>
    </section>
  );
}
