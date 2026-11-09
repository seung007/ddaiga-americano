import Link from "next/link";
import type { Shoe } from "@/lib/shoes/types";
import { hasWide } from "@/lib/shoes/labels";

/**
 * 신발 데이터로 고르는 「관련 가이드」 링크 (2026-11-06)
 *
 * 왜: 구글 서치콘솔에서 사이트맵 주소 249개 중 227개가 「발견됨 - 현재 색인이 생성되지 않음」(2026-10-23 갱신분)이고,
 *   방문의 35%가 들어오는 가이드 글도 대부분 여기에 있다. 구글은 링크가 적은 페이지의 크롤링을 뒤로 미룬다
 *   (Search Central Community 「Discovered - currently not indexed」 안내: internal links · site structure).
 *   러닝화 상세 107개·비교 35개에서 가이드로 가는 문맥 링크가 1개(카본) 또는 0개였다.
 *
 * 규칙: **데이터가 그 글과 관련 있다고 말할 때만** 링크를 건다 — 2E·4E 가 있으면 발볼 글, 안정화면 평발 글, 카본이면 카본 글.
 *   해당 없으면 아무것도 그리지 않는다. 글 제목은 lib/guide/articles.ts 의 제목을 줄인 것.
 */
const GUIDES = {
  wide: { href: "/injury/wide-foot", label: "2E 와이드 뜻, 내 발볼도 넓은 편일까요?" },
  stability: { href: "/injury/flat-feet", label: "평발 러닝화, 안정화를 꼭 신어야 하나요?" },
  carbon: { href: "/injury/carbon-plate", label: "카본화, 초보가 느리게 뛰어도 효과 있나요?" },
} as const;

export function guidesFor(shoes: Shoe[]) {
  const out: { href: string; label: string }[] = [];
  if (shoes.some(hasWide)) out.push(GUIDES.wide);
  if (shoes.some((s) => s.stability !== "neutral")) out.push(GUIDES.stability);
  if (shoes.some((s) => s.hasCarbon)) out.push(GUIDES.carbon);
  return out;
}

export default function ShoeGuideLinks({ shoes, className = "" }: { shoes: Shoe[]; className?: string }) {
  const links = guidesFor(shoes);
  if (links.length === 0) return null;
  return (
    <section aria-labelledby="shoe-guides-h" className={className}>
      <h2 id="shoe-guides-h" className="text-base font-bold text-gray-900">고르기 전에 읽어 보세요</h2>
      <ul className="mt-2">
        {links.map((g) => (
          <li key={g.href}>
            <Link href={g.href} className="flex min-h-11 items-center justify-between gap-3 border-t border-gray-200 py-2 text-sm text-gray-900 hover:underline">
              <span>{g.label}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
