import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import { ArticleRows, Pager } from "@/components/guide/ArticleRows";
import { ARTICLES } from "@/lib/guide/articles";
import { ALL_PAGE_SIZE, byLatest, latestEnabled, pageOf } from "@/lib/guide/listRules";

/**
 * 모든 글 · 최신순 /injury/all (2026-10-13, lib/guide/listRules.ts)
 *
 * 운영자 아이디어 「전체는 1·2·3 페이지」 — 글이 ALL_LATEST_MIN 개가 되기 전에는 404 다(주제별 묶음에 이미 다 보인다).
 * 그 수를 넘는 날 빌드부터 저절로 열리고, 허브에 「최신 글」 띠가 생기고, 사이트맵에 들어간다.
 * 날짜가 없는 글(원장에 published·updated 가 없는 글)은 뒤로 간다.
 */
export const metadata: Metadata = {
  title: "러닝 가이드 모든 글 — 최신순 | 뛰다가 아메리카노",
  description: "러닝 가이드 글을 최근에 올리거나 고친 순서로 모았습니다.",
  alternates: { canonical: "/injury/all" },
};

export default async function AllGuidesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  if (!latestEnabled()) notFound();
  const p = pageOf(byLatest(), Number((await searchParams).page ?? "1"), ALL_PAGE_SIZE);
  if (!p) notFound();
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-10">
      <BreadcrumbJsonLd trail={[["러닝 가이드", "/injury"], ["모든 글", "/injury/all"]]} />
      <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
        ← 러닝 가이드
      </Link>
      <h1 className="text-[28px] font-bold text-gray-900">모든 글 · 최신순</h1>
      <p className="mb-6 mt-2 text-gray-600">
        글 {ARTICLES.length}개 · {p.page}/{p.pages}쪽
      </p>
      <ArticleRows items={p.items} />
      <Pager base="/injury/all" page={p.page} pages={p.pages} />
    </main>
  );
}
