"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { gtagEvent } from "@/lib/gtag";
import { ARTICLES } from "@/lib/guide/articles";

/**
 * 가이드 글 측정 두 가지 (2026-10-13)
 *
 * ① 「근거 보기」·참고 문헌을 실제로 여는지 — 가독성 재설계 council 에서 끝까지 갈린 질문
 *    ("근거를 접으면 차별점이 사라진다" vs "첫 화면 이득")을 가를 숫자가 열람률이다. 그걸 잰다.
 *    toggle 은 거품이 안 올라가서 capture 로 받는다. 같은 상자는 한 번만 센다.
 * ② 「이 글이 도움이 됐나요?」 — 벤치마킹: NHS 는 모든 글 끝에 "Is this page useful?" 를 둔다.
 *    개인정보는 보내지 않는다(글 주소와 예/아니요만).
 */
export default function GuideSignals() {
  const path = usePathname();
  const [voted, setVoted] = useState<"yes" | "no" | null>(null);

  useEffect(() => {
    setVoted(null);
    const seen = new WeakSet<Element>();
    const on = (e: Event) => {
      const d = e.target;
      if (!(d instanceof HTMLDetailsElement) || !d.open || seen.has(d)) return;
      if (d.dataset.ev !== undefined) {
        seen.add(d);
        gtagEvent("guide_evidence_open", { page: path, label: d.dataset.ev || "근거 보기" });
      } else if (d.dataset.refs) {
        seen.add(d);
        gtagEvent("guide_refs_open", { page: path });
      }
    };
    document.addEventListener("toggle", on, true);
    return () => document.removeEventListener("toggle", on, true);
  }, [path]);

  // 글 페이지에만 — 허브·주제 페이지·모든 글 목록에는 「이 글이 도움이 됐나요?」를 붙이지 않는다
  if (!path || !ARTICLES.some((a) => a.href === path)) return null;

  return (
    <aside aria-label="이 글 평가" className="mx-auto mt-2 max-w-2xl px-5">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3">
        {voted ? (
          <p className="text-sm text-gray-600">
            고맙습니다.{" "}
            {voted === "no" && (
              <>
                부족했던 점은{" "}
                <a href="/community" className="text-emerald-700 underline">
                  게시판
                </a>
                에 남겨 주시면 고치겠습니다.
              </>
            )}
          </p>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-800">이 글이 도움이 됐나요?</p>
            {(["yes", "no"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  setVoted(v);
                  gtagEvent("guide_helpful", { page: path, value: v });
                }}
                className="rounded-full border border-gray-200 px-3.5 py-1 text-sm text-gray-700 hover:border-emerald-400"
              >
                {v === "yes" ? "네" : "아니요"}
              </button>
            ))}
          </>
        )}
      </div>
    </aside>
  );
}
