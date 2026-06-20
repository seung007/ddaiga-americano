"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface FeedbackFormProps {
  shoeIds: string[];   // 추천받은 신발 id 목록
  bodyType: string;    // 체형 분류
}

export default function FeedbackForm({ shoeIds, bodyType }: FeedbackFormProps) {
  const [rating, setRating]     = useState<number>(0);
  const [hovered, setHovered]   = useState<number>(0);
  const [content, setContent]   = useState("");
  const [status, setStatus]     = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;

    setStatus("submitting");

    const { error } = await supabase.from("feedback").insert({
      rating,
      content: content.trim() || null,
      shoe_ids: shoeIds.join(","),
      body_type: bodyType,
    });

    setStatus(error ? "error" : "done");
  }

  if (status === "done") {
    return (
      <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-8 text-center">
        <p className="text-2xl mb-2">🙏</p>
        <p className="font-semibold text-emerald-800">의견 감사해요!</p>
        <p className="text-sm text-emerald-600 mt-1">더 좋은 추천을 만드는 데 쓸게요.</p>
      </div>
    );
  }

  const activeRating = hovered || rating;
  const LABELS = ["", "별로예요", "아쉬워요", "괜찮아요", "좋아요", "최고예요"];

  return (
    <div className="mt-10 rounded-2xl border border-gray-200 bg-white px-6 py-7">
      <h3 className="font-semibold text-gray-900 text-base mb-1">이 추천이 도움이 됐나요?</h3>
      <p className="text-sm text-gray-500 mb-5">별점 하나면 충분해요. 의견이 있으면 남겨주셔도 좋아요.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* 별점 */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                aria-label={`${n}점`}
                className="text-3xl leading-none transition-transform hover:scale-110 focus:outline-none"
              >
                <span className={n <= activeRating ? "text-amber-400" : "text-gray-200"}>★</span>
              </button>
            ))}
          </div>
          <span className={`text-sm font-medium h-5 transition-colors ${activeRating ? "text-amber-600" : "text-gray-300"}`}>
            {LABELS[activeRating]}
          </span>
        </div>

        {/* 텍스트 (선택) */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="추가로 하고 싶은 말이 있으면 여기에 (선택)"
          rows={3}
          maxLength={500}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
        />

        {status === "error" && (
          <p className="text-sm text-red-500">저장에 실패했어요. 잠시 후 다시 시도해주세요.</p>
        )}

        <button
          type="submit"
          disabled={rating === 0 || status === "submitting"}
          className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "전송 중…" : "의견 보내기"}
        </button>
      </form>
    </div>
  );
}
