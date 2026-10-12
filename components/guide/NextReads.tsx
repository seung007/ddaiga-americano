"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ARTICLES, topicOf } from "@/lib/guide/articles";
import { STAGES } from "@/lib/guide/stages";
import { gtagEvent } from "@/lib/gtag";

/**
 * 글 끝 「이어서 볼 것」 — 모든 /injury/* 글에 붙는다 (app/injury/layout.tsx, 2026-10-12)
 *
 * 왜: GA4 28일(9/13~10/10) 방문 페이지 상위가 홈(43세션)·wide-foot(30)·first-10k(16)·midfoot(14)·achilles(8)인데
 * 1인당 페이지 수가 1.94 다. 검색으로 글 하나에 들어와서 그 글만 읽고 나간다.
 * 글마다 끝 링크가 제각각이라(없거나, 몇 개만) **같은 규칙으로** 다음 걸음을 보여준다.
 *
 * 규칙(지어낸 추천이 아니라 원장에서 도출)
 *   · 같은 단계: lib/guide/stages.ts 의 그 단계 guides (지금 글 제외) — 단계 원장이 정한 순서
 *   · 다음 단계: 그 단계 다음 단계의 첫 글
 *   · 같은 주제: lib/guide/articles.ts 의 같은 주제 글 2개
 *   · 도구 1개: 주제에 맞는 것
 * 클릭은 GA 이벤트 guide_next_click 으로 센다 — 이 블록이 실제로 다음 페이지로 데려가는지 보려고.
 */

const TOOL_BY_TOPIC: Record<string, { href: string; label: string }> = {
  "신발 고르기": { href: "/tools/shoe-side", label: "러닝화 두께 비교" },
  대회: { href: "/tools/pace", label: "페이스·구간 시간 계산기" },
  "아픈 곳": { href: "/injury/return-to-running", label: "쉬었다가 다시 달리기" },
  "달리는 법": { href: "/courses", label: "한강 코스 가상 달리기" },
  "단계 가이드": { href: "/injury/training-types", label: "훈련 종류 한눈에" },
  "훈련 방법": { href: "/courses", label: "한강 코스 가상 달리기" },
  "선수 이야기": { href: "/injury#finder", label: "내 단계 찾기" },
  기타: { href: "/injury#finder", label: "내 단계 찾기" },
};

type L = { href: string; label: string; kind: string };

export default function NextReads() {
  const path = usePathname();
  const me = ARTICLES.find((a) => a.href === path);
  if (!me) return null; // 허브(/injury) 등 글이 아닌 곳

  const seen = new Set<string>([me.href]);
  const pick = (l: L | null, out: L[]) => {
    if (!l) return;
    const base = l.href.split("#")[0];
    if (seen.has(base)) return;
    seen.add(base);
    out.push(l);
  };

  const links: L[] = [];
  const stageId = Array.isArray(me.stages) ? me.stages[0] : undefined;
  const stageIdx = stageId ? STAGES.findIndex((s) => s.id === stageId) : -1;
  const stage = stageIdx >= 0 ? STAGES[stageIdx] : null;

  if (stage) {
    for (const g of stage.guides.filter((g) => g.href.startsWith("/injury/") && g.href !== me.href).slice(0, 2)) {
      pick({ href: g.href, label: g.label, kind: `같은 단계 · ${stage.short}` }, links);
    }
    const nextStage = STAGES[stageIdx + 1];
    if (nextStage) {
      const g = nextStage.guides.find((x) => x.href.startsWith("/injury/") && !seen.has(x.href));
      if (g) pick({ href: g.href, label: g.label, kind: `다음 단계 · ${nextStage.short}` }, links);
    }
  }

  const topic = topicOf(me.tag);
  for (const a of ARTICLES.filter((a) => a.href !== me.href && topicOf(a.tag) === topic).slice(0, 2)) {
    pick({ href: a.href, label: a.title, kind: `같은 주제 · ${topic}` }, links);
  }
  const tool = TOOL_BY_TOPIC[topic] ?? TOOL_BY_TOPIC["기타"];
  pick({ ...tool, kind: "해 보기" }, links);
  if (!stage) pick({ href: "/injury#finder", label: "내 단계 찾기 — 지금 나에게 맞는 글", kind: "단계" }, links);

  if (!links.length) return null;

  return (
    <aside className="mx-auto mb-12 max-w-2xl px-6" aria-label="이어서 볼 것">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <p className="mb-3 text-sm font-semibold text-gray-900">이어서 볼 것</p>
        <ul className="space-y-2">
          {links.slice(0, 6).map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => gtagEvent("guide_next_click", { from: me.href, to: l.href, kind: l.kind.split(" · ")[0] })}
                className="group flex items-baseline gap-2 rounded-lg px-2 py-1.5 hover:bg-emerald-50"
              >
                <span className="shrink-0 text-[11px] text-gray-400">{l.kind}</span>
                <span className="text-sm text-gray-800 group-hover:text-emerald-800">{l.label} →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
