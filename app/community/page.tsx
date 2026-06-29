"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { supabase } from "@/lib/supabase";

const TAGS = ["전체", "신발추천", "무릎", "발볼", "족저근막", "아킬레스", "기타"] as const;
type Tag = (typeof TAGS)[number];

const TAG_COLORS: Record<string, string> = {
  신발추천:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  무릎:       "bg-red-50 text-red-600 border-red-200",
  발볼:       "bg-blue-50 text-blue-600 border-blue-200",
  족저근막:   "bg-orange-50 text-orange-600 border-orange-200",
  아킬레스:   "bg-purple-50 text-purple-600 border-purple-200",
  기타:       "bg-gray-100 text-gray-600 border-gray-200",
};

type Post = {
  id: string;
  nickname: string;
  question: string;
  body: string | null;
  tag: string;
  height_cm: number | null;
  weight_kg: number | null;
  budget_krw: number | null;
  created_at: string;
  answer: string | null;
  answered_at: string | null;
  likes: number;
};

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "방금";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<Tag>("전체");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  // 질문 폼 상태
  const [nickname, setNickname] = useState("");
  const [question, setQuestion] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("신발추천");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [budget, setBudget] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  async function fetchPosts() {
    setLoading(true);
    const { data } = await supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPosts(data as Post[]);
    setLoading(false);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  const filtered = activeTag === "전체"
    ? posts
    : posts.filter(p => p.tag === activeTag);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nickname.trim()) { setFormError("닉네임을 입력해주세요."); return; }
    if (!question.trim()) { setFormError("질문을 입력해주세요."); return; }
    setFormError("");
    setSubmitting(true);
    const { error } = await supabase.from("community_posts").insert({
      nickname: nickname.trim(),
      question: question.trim(),
      body: body.trim() || null,
      tag,
      height_cm: heightCm ? parseInt(heightCm) : null,
      weight_kg: weightKg ? parseInt(weightKg) : null,
      budget_krw: budget ? parseInt(budget) * 10000 : null,
    });
    setSubmitting(false);
    if (error) { setFormError("등록에 실패했어요. 다시 시도해주세요."); return; }
    setSubmitted(true);
    setNickname(""); setQuestion(""); setBody(""); setHeightCm(""); setWeightKg(""); setBudget("");
    fetchPosts();
    setTimeout(() => setSubmitted(false), 4000);
  }

  async function handleLike(post: Post) {
    if (likedIds.has(post.id)) return;
    setLikedIds(prev => new Set([...prev, post.id]));
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p));
    await supabase.from("community_posts").update({ likes: post.likes + 1 }).eq("id", post.id);
  }

  return (
    <>
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-6 py-10">

        {/* 헤더 */}
        <header className="mb-8">
          <p className="text-sm font-medium text-emerald-600 mb-1">런린이 Q&A</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">달리기 질문, 여기서 해결해요</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            신발 추천, 부상 고민, 달리기 자세까지 — 닉네임만 있으면 바로 질문할 수 있어요.
          </p>
        </header>

        {/* 질문 폼 */}
        <section className="mb-10 border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">질문 올리기</h2>
          {submitted ? (
            <div className="text-center py-6">
              <p className="text-2xl mb-2">🙌</p>
              <p className="font-semibold text-emerald-700">질문이 등록됐어요!</p>
              <p className="text-sm text-gray-500 mt-1">최대한 빠르게 답변 달아드릴게요.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* 닉네임 + 태그 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">닉네임</label>
                  <input
                    value={nickname} onChange={e => setNickname(e.target.value)}
                    placeholder="런린이123"
                    maxLength={20}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">태그</label>
                  <select
                    value={tag} onChange={e => setTag(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white"
                  >
                    {["신발추천", "무릎", "발볼", "족저근막", "아킬레스", "기타"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 질문 */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">질문 <span className="text-red-400">*</span></label>
                <input
                  value={question} onChange={e => setQuestion(e.target.value)}
                  placeholder="예: 평발인데 장거리 달릴 때 무릎이 아파요. 어떤 신발이 좋을까요?"
                  maxLength={150}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>

              {/* 상세 내용 */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">상세 내용 <span className="text-gray-400">(선택)</span></label>
                <textarea
                  value={body} onChange={e => setBody(e.target.value)}
                  placeholder="지금 신고 있는 신발, 달리는 거리, 통증 위치 등 알려주시면 더 정확하게 답변 드릴 수 있어요."
                  rows={3} maxLength={500}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
                />
              </div>

              {/* 선택 정보 */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">체형 정보 <span className="text-gray-400">(선택 — 신발 추천에 도움이 돼요)</span></p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">키 (cm)</label>
                    <input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)}
                      placeholder="170" min={140} max={220}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">체중 (kg)</label>
                    <input type="number" value={weightKg} onChange={e => setWeightKg(e.target.value)}
                      placeholder="65" min={30} max={200}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">예산 (만원)</label>
                    <input type="number" value={budget} onChange={e => setBudget(e.target.value)}
                      placeholder="20" min={5} max={100}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                  </div>
                </div>
              </div>

              {formError && <p className="text-sm text-red-500">{formError}</p>}

              <button
                type="submit" disabled={submitting}
                className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors disabled:bg-gray-200 disabled:text-gray-400"
              >
                {submitting ? "등록 중…" : "질문 올리기 →"}
              </button>
              <p className="text-xs text-gray-400 text-center -mt-1">닉네임은 익명으로 표시돼요. 개인정보는 입력하지 마세요.</p>
            </form>
          )}
        </section>

        {/* 태그 필터 */}
        <div className="flex gap-2 flex-wrap mb-6">
          {TAGS.map(t => (
            <button key={t} onClick={() => setActiveTag(t)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors
                ${activeTag === t
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
              {t}
              {t !== "전체" && <span className="ml-1 text-xs opacity-70">
                {posts.filter(p => p.tag === t).length}
              </span>}
            </button>
          ))}
        </div>

        {/* 질문 목록 */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">불러오는 중…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">아직 질문이 없어요. 첫 번째 질문을 올려보세요!</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {filtered.map(post => (
              <li key={post.id} className="border border-gray-100 rounded-2xl bg-white overflow-hidden hover:border-emerald-200 transition-colors">
                <button
                  className="w-full text-left p-5"
                  onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${TAG_COLORS[post.tag] ?? TAG_COLORS["기타"]}`}>
                          {post.tag}
                        </span>
                        {post.answer && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                            ✓ 답변 완료
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-gray-900 leading-snug mb-1">{post.question}</p>
                      {post.body && (
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{post.body}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400">{post.nickname}</span>
                        <span className="text-xs text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{timeAgo(post.created_at)}</span>
                        {(post.height_cm || post.weight_kg || post.budget_krw) && (
                          <>
                            <span className="text-xs text-gray-300">·</span>
                            <span className="text-xs text-gray-400">
                              {[
                                post.height_cm && `${post.height_cm}cm`,
                                post.weight_kg && `${post.weight_kg}kg`,
                                post.budget_krw && `${post.budget_krw / 10000}만원`,
                              ].filter(Boolean).join(" · ")}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 text-gray-400 text-sm mt-1">
                      {expandedId === post.id ? "▲" : "▼"}
                    </div>
                  </div>
                </button>

                {expandedId === post.id && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                    {post.body && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{post.body}</p>
                      </div>
                    )}
                    {post.answer ? (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-emerald-700">☕ 뛰다가 아메리카노 답변</span>
                          <span className="text-xs text-emerald-500">{post.answered_at ? timeAgo(post.answered_at) : ""}</span>
                        </div>
                        <p className="text-sm text-emerald-900 leading-relaxed whitespace-pre-wrap">{post.answer}</p>
                      </div>
                    ) : (
                      <div className="text-center py-4 border border-dashed border-gray-200 rounded-xl">
                        <p className="text-sm text-gray-400">답변 준비 중이에요. 보통 1~2일 내로 달아드려요 🙏</p>
                      </div>
                    )}
                    <div className="mt-3 flex items-center justify-end">
                      <button
                        onClick={() => handleLike(post)}
                        disabled={likedIds.has(post.id)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors
                          ${likedIds.has(post.id)
                            ? "border-red-200 bg-red-50 text-red-500"
                            : "border-gray-200 bg-white text-gray-500 hover:border-red-200 hover:text-red-500"}`}
                      >
                        {likedIds.has(post.id) ? "❤️" : "🤍"} 도움됐어요 {post.likes > 0 && post.likes}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
