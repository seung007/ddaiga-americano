"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

/**
 * 신고 버튼 (2026-09-23) — 비로그인 게시판이라 필수.
 * 마라톤온라인도 게시판 상단에 「불량게시물신고」를 고정해 둠.
 *
 * `reports` 는 insert 전용(anon 은 못 읽음). 운영자는 대시보드에서 확인.
 * 신고해도 글이 자동으로 숨지 않음 — 월 100명대에서 자동 숨김은 한 사람이 남의 글을 지우는 버튼이 됨.
 */
export default function ReportButton({
  targetType,
  targetId,
}: {
  targetType: "post" | "comment" | "shoe_reaction" | "race_reaction";
  targetId: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function report() {
    if (state !== "idle" && state !== "error") return;
    const reason = window.prompt("신고 이유를 짧게 적어주세요 (광고·욕설·개인정보 등). 비워도 돼요.");
    if (reason === null) return; // 취소
    setState("sending");
    const { error } = await supabase
      .from("reports")
      .insert({ target_type: targetType, target_id: targetId, reason: reason.trim().slice(0, 200) || null });
    if (error) {
      console.error("[report] 신고 실패", error);
      setState("error");
      return;
    }
    setState("done");
  }

  return (
    <button
      type="button"
      onClick={report}
      disabled={state === "sending" || state === "done"}
      className="text-xs text-gray-400 hover:text-red-500 disabled:hover:text-gray-400"
    >
      {state === "done" ? "신고됨" : state === "error" ? "신고 실패 · 다시" : state === "sending" ? "…" : "신고"}
    </button>
  );
}
