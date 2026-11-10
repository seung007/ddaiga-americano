import { ARTICLES } from "@/lib/guide/articles";
import { AUTHOR_NOTE } from "@/lib/site";

/**
 * 글 제목 바로 아래 「누가 · 언제」 한 줄 (2026-11-02)
 *
 * 왜: 생성형 AI 는 오래돼 보이는 글을 출처로 덜 인용하고, 사람도 날짜 없는 건강 정보를 믿기 어렵다.
 * 날짜는 원장 `lib/guide/articles.ts` 의 updated·published 에서만 온다 — 페이지에 손으로 적지 않는다.
 * 글을 고치면 원장의 updated 를 같이 고친다 (규칙: AGENTS.md 「새 글·페이지 규칙」, 검사: scripts/check-geo.mjs).
 * 저자는 사이트 이름 + 운영자 소개(lib/site.ts AUTHOR_NOTE, 2026-11-09 사이트 주인 문구). 전문 자격을 지어내지 않는다 — 근거는 각 글의 인용이 진다.
 */
export function articleDates(href: string): { updated?: string; published?: string } {
  const a = ARTICLES.find((x) => x.href === href);
  return { updated: a?.updated, published: a?.published };
}

export default function ArticleMeta({ href }: { href: string }) {
  const { updated, published } = articleDates(href);
  if (!updated && !published) return null;
  return (
    <div className="mt-2 mb-4 space-y-1 text-xs text-gray-500">
      <p>
        {updated && <>최종 수정 {updated}</>}
        {updated && published && published !== updated && <> · 처음 작성 {published}</>}
        {!updated && published && <>작성 {published}</>}
        {" · "}뛰다가 아메리카노 · 근거는 본문 인용
      </p>
      <p className="break-keep">{AUTHOR_NOTE}</p>
    </div>
  );
}
