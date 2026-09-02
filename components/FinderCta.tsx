"use client";

import Link from "next/link";

/**
 * 신발 찾기로 보내는 CTA — 맥락 문구 + 출처 계측.
 *
 * 왜 만들었나 (2026-09-02)
 * ───────────────────────
 * 28일 퍼널 실측에서 가장 큰 누수가 여기였다.
 *
 *   GA 사용자 87명 → /shoe-finder 도달 17명 (19.5%)
 *
 * **87명 중 70명이 도구를 아예 안 본다.** 원인으로 보이는 것 둘.
 *
 *   ① CTA가 페이지 맨 아래에만 있었다. 그런데 평균 참여 시간이
 *      cooldown 19초, first-10k 48초다. 19초면 끝까지 안 내려간다 —
 *      **CTA를 볼 기회 자체가 없다.**
 *   ② 문구가 맥락과 무관했다. 전 페이지가 "내 체형에 맞는 러닝화를 찾으세요"로
 *      같았다. 정강이 통증을 읽던 사람에게는 연결이 약하다.
 *
 * 그리고 **어느 페이지가 도구로 보내는지 측정이 아예 없었다.**
 * 고치기 전에 재는 장치부터 붙인다 — 안 그러면 고쳤는지 알 수 없다.
 *
 * variant
 * ───────
 *   inline  본문 중간용. 읽는 흐름을 끊지 않게 얇게.
 *   block   페이지 끝용. 기존 박스와 같은 무게.
 */
export default function FinderCta({
  from,
  headline,
  sub,
  variant = "block",
}: {
  /** 출처 페이지 슬러그. GA에서 어느 글이 도구로 보내는지 가른다 */
  from: string;
  /** 그 페이지 맥락에 맞는 한 줄 */
  headline: string;
  sub?: string;
  variant?: "inline" | "block";
}) {
  function fire() {
    if (typeof window === "undefined") return;
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof g === "function") g("event", "finder_cta_click", { from, variant });
  }

  if (variant === "inline") {
    return (
      <div className="my-6 flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <p className="min-w-0 flex-1 text-sm font-medium text-emerald-900">{headline}</p>
        <Link
          href="/shoe-finder"
          onClick={fire}
          className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          1분 만에 찾기 →
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-2xl bg-emerald-50 p-6">
      <p className="mb-2 font-medium text-emerald-900">{headline}</p>
      {sub && <p className="mb-4 text-sm text-emerald-800">{sub}</p>}
      <Link
        href="/shoe-finder"
        onClick={fire}
        className="inline-block rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
      >
        내 러닝화 찾기 →
      </Link>
    </div>
  );
}
