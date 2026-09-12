"use client";

import Link from "next/link";

/**
 * 답 바로가기 — **방문자가 들고 온 질문을 첫 화면에 그대로 놓는다.**
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 만들었나 (2026-09-12)
 *
 * 사용자 지적: *"유입이 왔을 때 최대한 클릭을 적게 해서 원하는 정보를 얻게."*
 *
 * 실측과 맞춰보니 홈이 그 반대였다. 네이버 유입 검색어를 의도별로 묶으면
 * **브랜드 비교 73% · 발 조건 33% · 카본화 20%** 인데, 홈 첫 화면에는
 * 그 셋 중 **어느 입구도 없었다.**
 *
 *   · 「인기 러닝화 비교」 — 스크롤 3화면 아래
 *   · 평발 — 「부상 예방」 목록 안, 4화면 아래
 *   · 카본화 — 홈에 입구 자체가 없었다
 *
 * 첫 화면이 주는 유일한 행동은 **신발 찾기 도구**였다. 그건 키·체중·발볼을
 * 고르는 여러 단계 폼이다. **읽으러 온 사람에게 작성을 시키는 구조**다.
 * 「호카 브룩스 비교」로 들어온 사람에게 폼은 답이 아니라 장애물이다.
 *
 * 그래서 도구를 치우지 않고 **옆에 답을 놓는다.** 도구는 조건이 애매한 사람에게,
 * 이 칸들은 질문이 분명한 사람에게. 지금 유입의 대부분은 후자다.
 *
 * ─────────────────────────────────────────────────────────────
 * 문구를 카테고리가 아니라 **질문**으로 쓴 이유
 *
 * "비교", "부상 예방" 같은 분류명은 **사이트 구조의 언어**다. 방문자는
 * "호카 브룩스 뭐가 달라?", "평발인데 뭐 신지?" 를 들고 온다.
 * 검색창에 친 말과 화면의 말이 같아야 자기 질문인 줄 알아본다.
 *
 * ⚠️ 항목을 늘리지 마라. 다섯 개가 넘으면 고르는 것 자체가 일이 되고,
 * 그러면 클릭을 줄이려던 것이 **판단을 늘리는 것**으로 바뀐다.
 * 실측 상위 세 의도 + 그 다음 하나까지다.
 */

const ITEMS = [
  {
    href: "/compare/hoka-vs-brooks",
    q: "호카 vs 브룩스",
    a: "드롭이 두 배 차이",
  },
  {
    href: "/injury/flat-feet",
    q: "평발인데 뭐 신지",
    a: "안정화화가 정답일까",
  },
  {
    href: "/injury/carbon-plate",
    q: "카본화 살까",
    a: "논문이 시험한 속도",
  },
  {
    href: "/injury/wide-foot",
    q: "발볼이 넓어요",
    a: "2E · 4E 뜻과 재는 법",
  },
] as const;

export default function QuickAnswers() {
  function fire(href: string) {
    if (typeof window === "undefined") return;
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    // 어느 질문이 눌리는지 알아야 다음에 무엇을 쓸지 정할 수 있다.
    if (typeof g === "function") g("event", "quick_answer_click", { target: href });
  }

  return (
    <section className="mx-auto max-w-3xl px-6 pb-10">
      <p className="mb-3 text-center text-sm font-medium text-gray-500">
        이걸 찾아 오셨나요? — 바로 갑니다
      </p>
      {/**
       * 모바일 2열. 방문자의 80%가 390px 이고, 세로 목록으로 네 칸을 쌓으면
       * 신발 띠가 화면 밖으로 밀린다. 2×2 가 첫 화면 안에 들어가는 최대치다.
       */}
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {ITEMS.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              onClick={() => fire(it.href)}
              className="flex h-full flex-col rounded-xl border border-gray-200 bg-white px-3.5 py-3 transition-colors hover:border-emerald-400 hover:bg-emerald-50"
            >
              <span className="text-sm font-semibold leading-snug text-gray-900">{it.q}</span>
              <span className="mt-1 text-xs leading-snug text-gray-500">{it.a}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
