"use client";

import { useEffect } from "react";

/**
 * `#stage-start`·`#levels` 같은 앵커로 왔을 때 그 접힌 카드(<details>)를 펼친다 (2026-10-13).
 *
 * 허브의 단계 카드를 기본 접힘으로 바꾸면서 생긴 구멍을 막는다 — 글마다 「2단계에서 자주 겪는 문제 →」
 * 링크가 `/injury#stage-to10k` 로 오는데, 카드가 접혀 있으면 제목만 보이고 끝난다(조용한 실패).
 * 처음 들어올 때(hash), 같은 페이지 안 앵커를 누를 때(click — 같은 해시면 hashchange 가 안 난다) 둘 다 본다.
 */
/**
 * 단계 카드를 펼칠 때 GA 이벤트 — 예전 「내 단계 찾기」 버튼과 같은 이름(guide_stage_finder, field=stage)으로 보낸다.
 * toggle 이벤트는 거품이 안 올라가서 capture 로 받는다.
 */
function trackOpen(id: string) {
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  const stage = id.replace(/^stage-/, "");
  if (typeof g === "function") g("event", "guide_stage_finder", { field: "stage", value: stage, stage });
}

const OPENABLE = /^(stage-|levels$)/;

export default function OpenOnHash() {
  useEffect(() => {
    // 코드로 펼친 것(링크 진입·앞으로 가기)은 GA 에 안 보낸다 — 사람이 누른 것과 섞이지 않게 (council Dev 지적)
    const programmatic = new WeakSet<HTMLDetailsElement>();
    const open = (id: string) => {
      if (!OPENABLE.test(id)) return;
      const el = document.getElementById(id);
      const d = el instanceof HTMLDetailsElement ? el : el?.querySelector("details");
      if (d && !d.open) {
        programmatic.add(d);
        d.open = true;
      }
      el?.scrollIntoView({ block: "start" });
    };
    if (location.hash) open(decodeURIComponent(location.hash.slice(1)));
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // 새 탭 열기
      const a = (e.target as HTMLElement | null)?.closest?.("a[href^='#']");
      if (a) open(decodeURIComponent((a.getAttribute("href") ?? "").slice(1)));
    };
    const onHash = () => open(decodeURIComponent(location.hash.slice(1)));
    const onToggle = (e: Event) => {
      const d = e.target;
      if (!(d instanceof HTMLDetailsElement) || !d.open || !d.id.startsWith("stage-")) return;
      if (programmatic.has(d)) {
        programmatic.delete(d);
        return;
      }
      trackOpen(d.id);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("toggle", onToggle, true);
    window.addEventListener("hashchange", onHash);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("toggle", onToggle, true);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);
  return null;
}
