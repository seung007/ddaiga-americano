"use client";

import Link from "next/link";
import { gtagEvent } from "@/lib/gtag";
import { ARTICLES } from "@/lib/guide/articles";

/**
 * 글 중간 「이어서 볼 글」 (2026-11-10)
 *
 * 왜: GA4 28일(10/13~11/9) 가이드 착지 상위 세 글(넓은 발볼 19명·첫 10km 17명·미드풋 17명)의
 *   사용자당 조회가 1.11~1.12 — 거의 그 글 하나만 보고 나간다. 평균 참여 시간이 50초 안팎이라
 *   글 맨 끝(FAQ·참고 자료 뒤)의 「다음에 읽을 것」·NextReads 까지 내려가지 않는다.
 *   → 글 중간(세 번째 소제목 앞)에 다음 걸음 두 개와 신발 찾기를 한 번 더 둔다. 끝 블록은 그대로 둔다.
 * 글 제목은 원장(lib/guide/articles.ts)에서 가져온다 — 손으로 적은 옛 제목이 남는 일을 막는다(2026-11-10 가이드 제목 일괄 변경 때 겪음).
 * 모양은 기존 「다음에 읽을 것」 카드와 같다(디자인을 새로 만들지 않는다).
 * 클릭은 guide_mid_next_click 으로 센다 — 이 자리가 실제로 다음 페이지로 데려가는지 본다.
 */
export default function MidNext({
  from,
  links,
}: {
  from: string;
  /** title 은 글이 아닌 곳(대회·러닝화 목록)에만 적는다 */
  links: { href: string; title?: string; sub: string }[];
}) {
  return (
    <aside aria-labelledby={`mid-next-${from}`} className="mt-10 rounded-2xl border border-gray-200 p-4">
      <p id={`mid-next-${from}`} className="text-sm font-semibold text-gray-500">
        이어서 볼 글
      </p>
      <div className="mt-3 space-y-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => gtagEvent("guide_mid_next_click", { from, to: l.href })}
            className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
          >
            <p className="text-sm font-semibold text-gray-900">{l.title ?? ARTICLES.find((a) => a.href === l.href)?.title ?? l.href} →</p>
            <p className="mt-1 text-sm text-gray-600">{l.sub}</p>
          </Link>
        ))}
      </div>
      <Link
        href={`/shoe-finder?from=${from}-mid`}
        onClick={() => gtagEvent("guide_mid_next_click", { from, to: "/shoe-finder" })}
        className="mt-3 flex min-h-11 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        나에게 맞는 신발 찾기 →
      </Link>
    </aside>
  );
}
