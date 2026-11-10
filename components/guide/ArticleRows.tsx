import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { topicOf, type GuideArticle } from "@/lib/guide/articles";
import { STAGES } from "@/lib/guide/stages";
import { look } from "@/lib/guide/listRules";

/**
 * 주제 페이지·「모든 글」 페이지가 같이 쓰는 목록 + 번호 페이지 (2026-10-13, lib/guide/listRules.ts)
 * 번호는 실제 주소(?page=2)라 검색엔진이 끝까지 따라가고, 공유한 링크가 같은 화면을 연다.
 *
 * 2026-11-10: 허브 목록(GuideArticleList)과 같은 줄 모양(GuideRow)을 쓴다.
 *   사이트 주인 — 「신발 고르기 3」처럼 제목+설명 줄만 이어져 "들어가면 구분이 안 된다, 표처럼".
 *   그래서 한 줄 = [부위·주제 칩 · 단계] / 질문 제목(16px 굵게) / 오른쪽 화살표, 줄 전체가 링크(44px 이상).
 *   칩·단계는 원장(lib/guide/articles.ts 의 tag·stages)에서만 만든다 — 지어낸 값 없음.
 *   읽기 시간은 넣지 않는다 — 2026-10-13 운영자 "분은 왜 넣은 거야? 굳이?" 로 뺀 값이다.
 */

/** 원장의 stages → 「1·2단계」 「모든 단계」. 선수 이야기처럼 [] 이면 비운다 */
export function stageLabel(a: GuideArticle): string | null {
  if (a.stages === "all") return "모든 단계";
  const steps = STAGES.filter((s) => (a.stages as string[]).includes(s.id)).map((s) => s.step);
  return steps.length ? `${steps.join("·")}단계` : null;
}

export function GuideRow({
  a,
  showDesc = false,
  onClick,
}: {
  a: GuideArticle;
  showDesc?: boolean;
  onClick?: () => void;
}) {
  const topic = topicOf(a.tag);
  const L = look(topic);
  // 태그가 묶음 이름과 같으면(단계 가이드·훈련 방법) 칩이 제목 줄을 되풀이할 뿐이라 뺀다
  const chip = a.tag !== topic ? a.tag : null;
  const stage = stageLabel(a);
  return (
    <Link href={a.href} onClick={onClick} className="group flex min-h-14 items-center gap-3 py-3">
      <span className="min-w-0 flex-1">
        {(chip || stage) && (
          <span className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            {chip && <span className={`rounded px-1.5 py-0.5 font-bold ${L.chip}`}>{chip}</span>}
            {stage && <span className="text-[#4B5059]">{stage}</span>}
          </span>
        )}
        <span className="block break-keep text-base font-bold leading-snug text-[#111111] group-hover:text-emerald-700">
          {a.title}
        </span>
        {showDesc && <span className="mt-1 line-clamp-2 break-keep text-sm text-[#4B5059]">{a.desc}</span>}
      </span>
      <ChevronRight aria-hidden className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-emerald-700" />
    </Link>
  );
}

export function ArticleRows({ items }: { items: GuideArticle[] }) {
  return (
    <ul className="divide-y divide-gray-200 border-y border-gray-200">
      {items.map((a) => (
        <li key={a.href}>
          <GuideRow a={a} showDesc />
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
        <Link href={href(page - 1)} rel="prev" className="flex min-h-11 items-center rounded-lg border border-gray-200 px-3 text-sm text-gray-700 hover:border-emerald-300">
          ← 이전
        </Link>
      )}
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          href={href(n)}
          aria-current={n === page ? "page" : undefined}
          className={`flex min-h-11 min-w-11 items-center justify-center rounded-lg border px-3 text-sm ${
            n === page ? "border-emerald-600 bg-emerald-600 font-semibold text-white" : "border-gray-200 text-gray-700 hover:border-emerald-300"
          }`}
        >
          {n}
        </Link>
      ))}
      {page < pages && (
        <Link href={href(page + 1)} rel="next" className="flex min-h-11 items-center rounded-lg border border-gray-200 px-3 text-sm text-gray-700 hover:border-emerald-300">
          다음
        </Link>
      )}
    </nav>
  );
}
