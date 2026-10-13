"use client";

/**
 * 단계 카드 안 「이 단계 글 전체 (N) →」 (2026-10-13, council Product 지적)
 *
 * 목록의 단계 칩 줄을 빼자 「2단계에 맞는 글 15개」를 볼 길이 카드 안 링크 3~4개뿐이 됐다.
 * 누르면 아래 「전체 글」을 그 단계로 거르고 그 자리로 내려간다.
 * 주소에 ?stage= 를 남겨 공유·새로고침에도 유지된다(GuideArticleList 가 처음 그릴 때 읽는다).
 * useSearchParams 를 안 쓰는 이유: 정적 페이지에서 Suspense 경계가 생겨 서버 HTML 에서 목록이 빠진다(검색엔진이 링크를 못 봄).
 */
export default function StageListButton({ stage, n }: { stage: string; n: number }) {
  return (
    <button
      type="button"
      onClick={() => {
        const u = new URL(location.href);
        u.searchParams.set("stage", stage);
        u.hash = "articles";
        history.replaceState(null, "", u);
        window.dispatchEvent(new CustomEvent("guide:stage", { detail: stage }));
        document.getElementById("articles")?.scrollIntoView({ block: "start" });
      }}
      className="mt-3 text-sm font-medium text-emerald-700 underline underline-offset-2"
    >
      이 단계에 맞는 글 전체 ({n}) ↓
    </button>
  );
}
