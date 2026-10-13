import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import { ArticleRows, Pager } from "@/components/guide/ArticleRows";
import { TOPIC_SLUG, TOPIC_PAGE_SIZE, articlesOf, look, pageOf, topicBySlug, topicsWithPage } from "@/lib/guide/listRules";

/**
 * 주제 페이지 /injury/topic/<slug> (2026-10-13, lib/guide/listRules.ts)
 *
 * 허브에서 한 주제가 TOPIC_INLINE_MAX 개를 넘을 때만 생긴다 — 글 1~3개짜리 주제 페이지는 만들지 않는다.
 * 지금(가장 큰 주제 7개)은 하나도 없다. 글이 늘면 빌드 때 저절로 생기고, 사이트맵에도 같은 규칙으로 들어간다.
 * TOPIC_PAGE_SIZE 개가 넘으면 ?page=2 … 로 나뉜다.
 */
export function generateStaticParams() {
  return topicsWithPage().map((t) => ({ slug: TOPIC_SLUG[t] }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = topicBySlug(slug);
  if (!t) return {};
  return {
    title: `${t} — 러닝 가이드 글 ${articlesOf(t).length}개 | 뛰다가 아메리카노`,
    description: `${t} 주제의 러닝 가이드 글 모음. ${articlesOf(t)
      .slice(0, 3)
      .map((a) => a.title)
      .join(" · ")}`.slice(0, 155),
    alternates: { canonical: `/injury/topic/${slug}` },
  };
}

export default async function TopicPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const t = topicBySlug(slug);
  if (!t || !topicsWithPage().includes(t)) notFound();
  const all = articlesOf(t);
  const p = pageOf(all, Number((await searchParams).page ?? "1"), TOPIC_PAGE_SIZE);
  if (!p) notFound();
  const L = look(t);
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-10">
      <BreadcrumbJsonLd trail={[["러닝 가이드", "/injury"], [t, `/injury/topic/${slug}`]]} />
      <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
        ← 러닝 가이드
      </Link>
      <h1 className="flex items-center gap-3 text-[28px] font-bold text-gray-900">
        <span aria-hidden className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${L.tile}`}>
          {L.icon}
        </span>
        {t}
      </h1>
      <p className="mb-6 mt-2 text-gray-600">글 {all.length}개{p.pages > 1 ? ` · ${p.page}/${p.pages}쪽` : ""}</p>
      <ArticleRows items={p.items} />
      <Pager base={`/injury/topic/${slug}`} page={p.page} pages={p.pages} />
    </main>
  );
}
