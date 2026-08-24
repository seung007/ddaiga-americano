"use client";

import { useEffect, useRef, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { supabase, supabaseConfigured } from "@/lib/supabase";

const TAGS = ["전체", "신발추천", "무릎", "발볼", "족저근막", "아킬레스", "기타"] as const;
type Tag = (typeof TAGS)[number];

/** 질문 폼의 태그 선택지 — 목록 필터의 "전체"는 제외한다. */
const FORM_TAGS = TAGS.filter((t) => t !== "전체");

const QUESTION_MAX = 300;

/** 닉네임을 비워도 등록되게 한다. community_posts.nickname 이 NOT NULL 이라 빈 값 대신 이걸 넣는다. */
const DEFAULT_NICKNAME = "런린이";

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
  const [loadFailed, setLoadFailed] = useState(false);
  const [activeTag, setActiveTag] = useState<Tag>("전체");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const reqSeq = useRef(0);

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
  const [showMore, setShowMore] = useState(false);
  const questionRef = useRef<HTMLTextAreaElement>(null);

  async function fetchPosts() {
    const seq = ++reqSeq.current;
    setLoading(true);
    setLoadFailed(false);

    if (!supabaseConfigured) {
      setLoadFailed(true);
      setPosts([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: false });
      // 재시도를 연달아 누르면 요청이 경쟁한다. 마지막 요청의 결과만 반영한다.
      if (seq !== reqSeq.current) return;
      if (error || !data) {
        // 실패를 "질문이 없음"으로 위장하지 않는다.
        console.error("[community] 질문 목록 조회 실패", error);
        setLoadFailed(true);
        setPosts([]);
      } else {
        setPosts(data as Post[]);
      }
    } catch (e) {
      if (seq !== reqSeq.current) return;
      console.error("[community] 질문 목록 조회 중 예외", e);
      setLoadFailed(true);
      setPosts([]);
    }
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
    // 필수는 질문 하나뿐이다. 닉네임은 비워도 되고, 실패 시 해당 칸으로 포커스를 옮긴다.
    if (!question.trim()) {
      setFormError("질문을 입력해주세요.");
      questionRef.current?.focus();
      return;
    }
    setFormError("");
    setSubmitting(true);
    const { error } = await supabase.from("community_posts").insert({
      nickname: nickname.trim() || DEFAULT_NICKNAME,
      question: question.trim(),
      body: body.trim() || null,
      tag,
      height_cm: heightCm ? parseInt(heightCm) : null,
      weight_kg: weightKg ? parseInt(weightKg) : null,
      budget_krw: budget ? parseInt(budget) * 10000 : null,
    });
    setSubmitting(false);
    if (error) {
      // 폼을 치우지 않는다 — 사용자가 입력한 내용을 잃지 않게 그대로 두고 메시지만 보여준다.
      console.error("[community] 질문 등록 실패", error);
      setFormError("질문을 저장하지 못했어요. 잠시 후 다시 시도해주세요.");
      return;
    }
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
            신발 추천, 부상 고민, 달리기 자세까지 — 질문 한 줄만 쓰면 바로 올라가요. 가입도, 닉네임도 필요 없어요.
          </p>
        </header>

        {/* 질문 폼 */}
        <section className="mb-10 border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">질문 올리기</h2>
          {submitted ? (
            <div className="text-center py-6">
              <p className="text-2xl mb-2">🙌</p>
              <p className="font-semibold text-emerald-700">질문이 등록됐어요!</p>
              <p className="text-sm text-gray-500 mt-1">운영자가 직접 확인하고 답을 답니다. 기한은 약속드리기 어려워요.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/*
                목록 조회가 실패해도 폼은 계속 연다. 조회 실패와 등록 실패는 별개이고,
                등록이 실패하면 handleSubmit 이 입력 내용을 지우지 않고 메시지만 띄운다.
              */}
              {!loading && loadFailed && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 leading-relaxed" role="status">
                  지금 기존 질문 목록을 불러오지 못하고 있어요. 질문 등록은 시도할 수 있지만,
                  저장에 실패하면 안내 메시지가 뜨고 입력하신 내용은 그대로 남습니다.
                </p>
              )}
              {/* 질문 — 유일한 필수 항목 */}
              <div>
                <label htmlFor="q-question" className="text-sm font-semibold text-gray-800 mb-1.5 block">
                  무엇이 궁금하세요?
                </label>
                <textarea
                  id="q-question"
                  ref={questionRef}
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  required
                  aria-required="true"
                  aria-invalid={formError ? true : undefined}
                  aria-describedby="q-question-help"
                  rows={3}
                  maxLength={QUESTION_MAX}
                  placeholder="예: 평발인데 10km 넘게 뛰면 무릎 바깥쪽이 아파요. 어떤 신발이 좋을까요?"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-y"
                />
                <div className="flex items-start justify-between gap-3 mt-1">
                  <p id="q-question-help" className="text-xs text-gray-400 leading-relaxed">
                    이 칸만 채우면 등록돼요. 말하듯이 편하게 적어주세요.
                  </p>
                  <span className="text-xs text-gray-300 shrink-0 tabular-nums" aria-hidden="true">
                    {question.length}/{QUESTION_MAX}
                  </span>
                </div>
              </div>

              {/* 태그 — 클릭 한 번, 기본값 있음 */}
              <fieldset className="min-w-0">
                <legend className="text-xs font-medium text-gray-500 mb-2">어떤 주제인가요?</legend>
                <div className="flex flex-wrap gap-2">
                  {FORM_TAGS.map(t => (
                    <label key={t} className="cursor-pointer">
                      <input
                        type="radio" name="tag" value={t}
                        checked={tag === t}
                        onChange={() => setTag(t)}
                        className="sr-only peer"
                      />
                      <span
                        className={`block px-3 py-1.5 rounded-full text-sm border transition-colors
                          peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-300
                          ${tag === t
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
                      >
                        {t}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* 나머지는 전부 선택 — 기본으로 접어둔다 */}
              <div className="border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowMore(v => !v)}
                  aria-expanded={showMore}
                  aria-controls="q-more"
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-emerald-600 transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                >
                  <span aria-hidden="true">{showMore ? "▾" : "▸"}</span>
                  닉네임 · 상세 내용 · 체형 정보 <span className="text-gray-400">(선택)</span>
                </button>

                {showMore && (
                  <div id="q-more" className="flex flex-col gap-4 mt-4">
                    <div>
                      <label htmlFor="q-nickname" className="text-xs font-medium text-gray-500 mb-1 block">닉네임</label>
                      <input
                        id="q-nickname"
                        value={nickname} onChange={e => setNickname(e.target.value)}
                        placeholder={DEFAULT_NICKNAME}
                        maxLength={20}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    </div>

                    <div>
                      <label htmlFor="q-body" className="text-xs font-medium text-gray-500 mb-1 block">상세 내용</label>
                      <textarea
                        id="q-body"
                        value={body} onChange={e => setBody(e.target.value)}
                        placeholder="지금 신고 있는 신발, 달리는 거리, 통증 위치 등을 알려주시면 더 정확하게 답변 드릴 수 있어요."
                        rows={3} maxLength={500}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-y"
                      />
                    </div>

                    <fieldset>
                      <legend className="text-xs font-medium text-gray-500 mb-2">
                        체형 정보 <span className="text-gray-400">— 신발 추천에 도움이 돼요</span>
                      </legend>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label htmlFor="q-height" className="text-xs text-gray-400 mb-1 block">키 (cm)</label>
                          <input id="q-height" type="number" inputMode="numeric" value={heightCm} onChange={e => setHeightCm(e.target.value)}
                            placeholder="170" min={140} max={220}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                        </div>
                        <div>
                          <label htmlFor="q-weight" className="text-xs text-gray-400 mb-1 block">체중 (kg)</label>
                          <input id="q-weight" type="number" inputMode="numeric" value={weightKg} onChange={e => setWeightKg(e.target.value)}
                            placeholder="65" min={30} max={200}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                        </div>
                        <div>
                          <label htmlFor="q-budget" className="text-xs text-gray-400 mb-1 block">예산 (만원)</label>
                          <input id="q-budget" type="number" inputMode="numeric" value={budget} onChange={e => setBudget(e.target.value)}
                            placeholder="20" min={5} max={100}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                        </div>
                      </div>
                    </fieldset>
                  </div>
                )}
              </div>

              {formError && (
                <p className="text-sm text-red-500" role="alert">{formError}</p>
              )}

              <button
                type="submit" disabled={submitting}
                className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors disabled:bg-gray-200 disabled:text-gray-400"
              >
                {submitting ? "등록 중…" : "질문 올리기 →"}
              </button>
              <p className="text-xs text-gray-400 text-center -mt-1">
                닉네임을 비우면 &lsquo;{DEFAULT_NICKNAME}&rsquo;으로 표시돼요. 개인정보는 입력하지 마세요.
              </p>
            </form>
          )}
        </section>

        {/* 태그 필터 — 조회 실패 시에는 전부 0으로 표시되므로 숨긴다 */}
        <div className={`flex gap-2 flex-wrap mb-6 ${loadFailed ? "hidden" : ""}`}>
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
        ) : loadFailed ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-10 text-center" role="alert">
            <p className="text-2xl mb-2">🔌</p>
            <p className="text-sm font-semibold text-amber-800">질문 목록을 불러오지 못했어요</p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              일시적인 문제일 수 있어요. 새로고침해도 같으면 잠시 뒤에 다시 방문해 주세요.
            </p>
            <button
              onClick={() => fetchPosts()}
              disabled={loading}
              className="mt-4 rounded-xl border border-amber-300 bg-white px-4 py-2 text-xs font-medium text-amber-800 hover:bg-amber-100 transition-colors disabled:opacity-50"
            >
              다시 시도
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">아직 질문이 없어요. 첫 번째 질문을 올려보세요!</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">
              <span className="font-medium text-gray-500">{activeTag}</span> 태그에는 아직 질문이 없어요.
            </p>
            <button
              onClick={() => setActiveTag("전체")}
              className="mt-3 text-xs text-emerald-600 hover:underline"
            >
              전체 보기
            </button>
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
                        <span className="text-xs text-gray-400">{post.nickname || "익명"}</span>
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
                        {/* 답변자는 운영자 1명뿐이고 알림 경로도 없다. 지킬 수 없는 기한을 약속하지 않는다. */}
                        <p className="text-sm text-gray-400">아직 답변이 없어요. 운영자가 직접 답을 달기 때문에 시간이 걸릴 수 있어요.</p>
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
