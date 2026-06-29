"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Post = {
  id: string;
  nickname: string;
  question: string;
  tag: string;
  answer: string | null;
  created_at: string;
};

const TAG_COLORS: Record<string, string> = {
  신발추천: "bg-emerald-50 text-emerald-700",
  무릎:     "bg-red-50 text-red-600",
  발볼:     "bg-blue-50 text-blue-600",
  족저근막: "bg-orange-50 text-orange-600",
  아킬레스: "bg-purple-50 text-purple-600",
  기타:     "bg-gray-100 text-gray-600",
};

// 닉네임 첫 글자 아바타
function Avatar({ name }: { name: string }) {
  return (
    <div className="shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
      {name.slice(0, 1)}
    </div>
  );
}

export default function HomeCommunitySection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("community_posts")
      .select("id, nickname, question, tag, answer, created_at")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setPosts(data as Post[]);
        setLoading(false);
      });
  }, []);

  // 실 데이터가 없으면 예시 카드
  const FALLBACK: Post[] = [
    { id: "1", nickname: "런린이", question: "오른쪽 무릎만 달리면 아픈데 왜 그럴까요?", tag: "무릎", answer: "네, 이는 골반 비대칭이나 중둔근 약화로 인한 경우가 많아요.", created_at: "" },
    { id: "2", nickname: "초보러너", question: "발볼이 넓어서 신발이 항상 끼는데 어떤 걸 사야 하나요?", tag: "발볼", answer: null, created_at: "" },
    { id: "3", nickname: "박런런", question: "아침에 첫발 내딛을 때 발바닥이 너무 아파요.", tag: "족저근막", answer: "족저근막염 증상이에요. 기상 직후 스트레칭이 도움이 돼요.", created_at: "" },
    { id: "4", nickname: "김철수", question: "미드풋으로 바꿨더니 종아리가 너무 당겨요.", tag: "아킬레스", answer: null, created_at: "" },
    { id: "5", nickname: "이달리기", question: "평발인데 일반 러닝화 신으면 안 되나요?", tag: "신발추천", answer: "평발은 모션 컨트롤 or 스태빌리티 카테고리 신발이 안전해요.", created_at: "" },
  ];

  const displayPosts = !loading && posts.length > 0 ? posts : FALLBACK;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">런린이 Q&A</h2>
        <div className="flex items-center gap-3">
          <Link href="/community" className="text-sm text-emerald-600 hover:underline">
            전체 질문 →
          </Link>
          <a
            href="https://blog.naver.com/whwlsdn10"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            블로그
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {displayPosts.map((post) => (
          <Link
            key={post.id}
            href="/community"
            className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-emerald-300 transition-colors group"
          >
            <Avatar name={post.nickname} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 leading-snug line-clamp-1">{post.question}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${TAG_COLORS[post.tag] ?? TAG_COLORS["기타"]}`}>
                  {post.tag}
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

      <Link
        href="/community"
        className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-emerald-300 hover:text-emerald-600 transition-colors bg-white"
      >
        💬 질문 올리기
      </Link>
    </div>
  );
}
