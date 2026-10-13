import Link from "next/link";
import type { GuideArticle } from "@/lib/guide/articles";

/**
 * 주제 페이지·「모든 글」 페이지가 같이 쓰는 목록 + 번호 페이지 (2026-10-13, lib/guide/listRules.ts)
 * 번호는 실제 주소(?page=2)라 검색엔진이 끝까지 따라가고, 공유한 링크가 같은 화면을 연다.
 */
export function ArticleRows({ items }: { items: GuideArticle[] }) {
  return (
    <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white px-4">
      {items.map((a) => (
        <li key={a.href}>
          <Link href={a.href} className="group flex items-start gap-3 py-3.5">
            <span className="min-w-0 flex-1">
              <span className="block break-keep text-[15px] font-semibold leading-snug text-gray-900 group-hover:text-emerald-700">
                {a.title}
              </span>
              <span className="mt-0.5 line-clamp-2 break-keep text-sm text-gray-500">{a.desc}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Pager({ base, page, pages }: { base: string; page: number; pages: number }) {
  if (pages <= 1) return null;
  const href = (n: number) => (n === 1 ? base : `${base}?page=${n}`);
  return (
    <nav aria-label="페이지" className="mt-6 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={href(page - 1)} rel="prev" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-300">
          ← 이전
        </Link>
      )}
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          href={href(n)}
          aria-current={n === page ? "page" : undefined}
          className={`min-w-9 rounded-lg border px-3 py-1.5 text-center text-sm ${
            n === page ? "border-emerald-600 bg-emerald-600 font-semibold text-white" : "border-gray-200 text-gray-700 hover:border-emerald-300"
          }`}
        >
          {n}
        </Link>
      ))}
      {page < pages && (
        <Link href={href(page + 1)} rel="next" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-300">
          다음 →
        </Link>
      )}
    </nav>
  );
}
