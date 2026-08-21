"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase, supabaseConfigured } from "@/lib/supabase";

type Post = {
  id: string;
  nickname: string | null;
  question: string;
  tag: string | null;
  answer: string | null;
  created_at: string;
};

type LoadState = "loading" | "ok" | "failed";

const TAG_COLORS: Record<string, string> = {
  신발추천: "bg-emerald-50 text-emerald-700",
  무릎:     "bg-red-50 text-red-600",
  발볼:     "bg-blue-50 text-blue-600",
  족저근막: "bg-orange-50 text-orange-600",
  아킬레스: "bg-purple-50 text-purple-600",
  기타:     "bg-gray-100 text-gray-600",
};

// 닉네임 첫 글자 아바타
function Avatar({ name }: { name: string | null }) {
  return (
    <div className="shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
      {name?.slice(0, 1) || "?"}
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3">
      <div className="shrink-0 w-7 h-7 rounded-full bg-gray-100 animate-pulse" />
      <div className="flex-1 min-w-0">
        <div className="h-3.5 w-3/4 rounded bg-gray-100 animate-pulse" />
        <div className="h-3 w-16 rounded-full bg-gray-100 animate-pulse mt-2" />
      </div>
    </div>
  );
}

export default function HomeCommunitySection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const reqSeq = useRef(0);

  const load = useCallback(async () => {
    const seq = ++reqSeq.current;
    setState("loading");

    if (!supabaseConfigured) {
      setState("failed");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("community_posts")
        .select("id, nickname, question, tag, answer, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      if (seq !== reqSeq.current) return; // 늦게 도착한 응답은 버린다

      if (error || !data) {
        // 예시 데이터로 덮지 않는다. 실패는 실패로 보여야 다음 고장을 즉시 알 수 있다.
        console.error("[community] 질문 목록을 불러오지 못했습니다.", error);
        setState("failed");
        return;
      }
      setPosts(data as Post[]);
      setState("ok");
    } catch (e) {
      if (seq !== reqSeq.current) return;
      console.error("[community] 질문 목록 조회 중 예외", e);
      setState("failed");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">런린이 Q&amp;A</h2>
        <Link href="/community" className="text-sm text-emerald-600 hover:underline">
          전체 질문 →
        </Link>
      </div>

      <div aria-live="polite" aria-busy={state === "loading"}>
        {state === "loading" && (
          <div className="flex flex-col gap-2">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        )}

        {state === "failed" && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-5 text-center" role="alert">
            <p className="text-sm font-medium text-amber-800">질문 목록을 불러오지 못했어요</p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              일시적인 문제일 수 있어요.
            </p>
            <button
              onClick={() => void load()}
              className="mt-3 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100 transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {state === "ok" && posts.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-8 text-center">
            <p className="text-2xl mb-2">💬</p>
            <p className="text-sm text-gray-500">아직 올라온 질문이 없어요.</p>
            <p className="text-xs text-gray-400 mt-1">첫 번째 질문을 남겨주시면 직접 답변 드릴게요.</p>
          </div>
        )}

        {state === "ok" && posts.length > 0 && (
          <div className="flex flex-col gap-2">
            {posts.map((post) => (
              <Link
                key={post.id}
                href="/community"
                className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-emerald-300 transition-colors group"
              >
                <Avatar name={post.nickname} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 leading-snug line-clamp-1">{post.question}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${TAG_COLORS[post.tag ?? "기타"] ?? TAG_COLORS["기타"]}`}>
                      {post.tag || "기타"}
                    </span>
                    {post.answer && (
                      <span className="text-xs text-emerald-600 font-medium">✓ 답변 완료</span>
                    )}
                  </div>
                </div>
                <span className="shrink-0 text-xs text-gray-300 group-hover:text-emerald-500 mt-1">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Link
        href="/community"
        className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-emerald-300 hover:text-emerald-600 transition-colors bg-white"
      >
        💬 질문 올리기
      </Link>
    </div>
  );
}
