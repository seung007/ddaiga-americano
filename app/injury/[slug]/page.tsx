import { notFound } from "next/navigation";
import type { Metadata } from "next";
import GuideArticle from "@/components/guide/GuideArticle";
import { ARTICLES } from "@/lib/guide/articles";
import { contentSlugs, loadContent } from "@/lib/guide/content";

/**
 * 내용 파일 가이드 — lib/guide/content/<slug>.json (2026-11-07, 설명은 lib/guide/content.ts)
 * 손으로 쓴 글 폴더(app/injury/cooldown 등)가 같은 주소면 그쪽이 이긴다. 빌드 때 전부 만들어 두고 없는 주소는 404.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return contentSlugs().map((slug) => ({ slug }));
}

const entryOf = (slug: string) => ARTICLES.find((a) => a.href === `/injury/${slug}`);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = entryOf(slug);
  if (!e) return {};
  return {
    title: `${e.title} — 뛰다가 아메리카노`,
    description: e.desc,
    alternates: { canonical: `/injury/${slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = loadContent(slug);
  const entry = entryOf(slug);
  if (!c || !entry) notFound();
  const related = c.related.map((h) => ARTICLES.find((a) => a.href === h)).filter((a): a is NonNullable<typeof a> => !!a);
  return <GuideArticle slug={slug} entry={entry} c={c} related={related} />;
}
