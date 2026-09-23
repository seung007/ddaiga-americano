"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import FinderCta from "@/components/FinderCta";
import { insertPost, myPosts, rememberMyPost, type MyPost } from "@/lib/community";
import RecentReactions from "@/components/RecentReactions";
import type { ReactionNames } from "@/lib/reaction-names";

/**
 * 2026-09-15: **Q&A → 자유게시판.** 태그 6개가 전부 증상이었다
 * (`신발추천 · 무릎 · 발볼 · 족저근막 · 아킬레스 · 기타`).
 *
 * 그 자체가 "아픈 사람만, 질문만 쓰는 곳"이라는 신호였다. 글을 읽고 드는 생각은 대개
 * *"도움 됐어요" · "이건 틀린 것 같은데" · "○○도 다뤄주세요"* 인데 **쓸 자리가 없었다.**
 *
 * 왜 지금 바꾸나 — 원인 후보 셋 중 둘이 실측으로 제거됐다.
 *   · 거리: 입력창을 글 안으로 옮겨 클릭 0회로 만들었는데 `inline_ask_submit` 28일 **0건**
 *   · 문턱: 로그인 없음, 필수는 textarea 하나뿐 (2026-09-15 배포본 DOM 실측)
 * 남은 것이 형식이고, 그게 이 태그와 문구다.
 *
 * 바꿔도 되는 근거: 2026-09-15 로컬에서 목록을 열어 **글 0건**을 직접 확인했다
 * (조회 실패가 아니라 실제 0건 — 태그 카운트 전부 0). 마이그레이션할 기존 글이 없다.
 */
const TAGS = ["전체", "이런 게 있으면", "좋았던 점", "틀린 것 같아요", "신발 고민", "부상 고민", "기타"] as const;
type Tag = (typeof TAGS)[number];

/** 글 폼의 태그 선택지 — 목록 필터의 "전체"는 제외한다. */
const FORM_TAGS = TAGS.filter((t) => t !== "전체");

const QUESTION_MAX = 300;

/** 닉네임을 비워도 등록되게 한다. community_posts.nickname 이 NOT NULL 이라 빈 값 대신 이걸 넣는다. */
const DEFAULT_NICKNAME = "런린이";

const TAG_COLORS: Record<string, string> = {
  "이런 게 있으면":  "bg-blue-50 text-blue-600 border-blue-200",
  "좋았던 점":       "bg-emerald-50 text-emerald-700 border-emerald-200",
  "틀린 것 같아요":  "bg-amber-50 text-amber-700 border-amber-200",
  "신발 고민":       "bg-purple-50 text-purple-600 border-purple-200",
  "부상 고민":       "bg-red-50 text-red-600 border-red-200",
  기타:              "bg-gray-100 text-gray-600 border-gray-200",
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

/**
 * GA4 이벤트.
 *
 * ⚠️ 조용히 버리지 않는다. `recommend_form_start` 가 **gtag 로드 전에 발화해 통째로
 * 유실**된 적이 있다(`유입_설정_기준선.md §4-7` — 그래서 완주율을 계산할 수 없다).
 * gtag 가 아직 없으면 짧게 기다렸다 다시 시도하고, 5초를 넘기면 포기한다.
 */
function sendGa(name: string, params: Record<string, string>, attempt = 0) {
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof g === "function") {
    g("event", name, params);
    return;
  }
  if (attempt < 10) setTimeout(() => sendGa(name, params, attempt + 1), 500);
}

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "방금";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

/**
 * 2026-09-23 탭 — 「이야기」(게시판 글) · 「신발 후기」 · 「대회 후기」.
 * 후기 탭은 새 입력칸이 아니라 신발·대회 상세에서 남긴 한 줄을 모아 보여주는 뷰.
 * 마라톤온라인이 자유게시판 · 용품후기 · 대회참가기를 따로 두는 구조를 한 페이지 탭으로 줄임
 * (모바일 약 80% — 메뉴 항목을 늘리지 않으려고).
 */
const VIEWS = [
  ["talk", "이야기"],
  ["shoe", "👟 신발 후기"],
  ["race", "🏅 대회 후기"],
] as const;
type View = (typeof VIEWS)[number][0];

export default function CommunityBoard({ names }: { names: ReactionNames }) {
  const [view, setView] = useState<View>("talk");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [activeTag, setActiveTag] = useState<Tag>("전체");
  /** post_id → 댓글 수. 댓글 테이블 조회가 실패하면 비어 있고, 목록에 숫자를 안 띄운다(0으로 위장 안 함) */
  const [commentCounts, setCommentCounts] = useState<Record<string, number> | null>(null);
  /** 이 브라우저에서 쓴 글 (lib/community.ts) */
  const [mine, setMine] = useState<MyPost[]>([]);
  const reqSeq = useRef(0);
  /** `board_write_start` 는 글 하나당 한 번만 보낸다. */
  const writeStarted = useRef(false);

  // 글 폼 상태
  const [nickname, setNickname] = useState("");
  const [question, setQuestion] = useState("");
  const [body, setBody] = useState("");
  // 기본 선택 없음(""). 전에는 "신발추천"이 미리 골라져 있어서 **안 고른 사람도 그 태그로
  // 저장됐다** — 태그가 신호가 아니라 잡음이 된다. 비워 두고 저장 때만 "기타"로 채운다.
  const [tag, setTag] = useState("");
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
        // 2026-09-23 댓글 수 — 글 목록과 별개 경로. 실패해도 목록은 그대로 보여준다
        const cc = await supabase.from("community_comments").select("post_id");
        if (seq !== reqSeq.current) return;
        if (cc.error || !cc.data) {
          console.error("[community] 댓글 수 조회 실패", cc.error);
          setCommentCounts(null);
        } else {
          const m: Record<string, number> = {};
          for (const r of cc.data as { post_id: string }[]) m[r.post_id] = (m[r.post_id] ?? 0) + 1;
          setCommentCounts(m);
        }
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
    setMine(myPosts());
    fetchPosts();
  }, []);

  /** 내 글 중 마지막으로 본 뒤 새 댓글이 달린 것 */
  const newOnMine = commentCounts
    ? mine
        .map((m) => ({ ...m, now: commentCounts[m.id] ?? 0 }))
        .filter((m) => m.now > m.seen && posts.some((p) => p.id === m.id))
    : [];

  const filtered = activeTag === "전체"
    ? posts
    : posts.filter(p => p.tag === activeTag);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // 필수는 글 하나뿐이다. 닉네임은 비워도 되고, 실패 시 해당 칸으로 포커스를 옮긴다.
    if (!question.trim()) {
      setFormError("내용을 입력해주세요.");
      questionRef.current?.focus();
      return;
    }
    setFormError("");
    setSubmitting(true);
    const finalTag = tag || "기타";
    // 2026-09-23: insertPost — author_hash 를 붙이고 새 글 id 를 돌려줌 (lib/community.ts)
    const { id: createdId, error } = await insertPost(supabase, {
      nickname: nickname.trim() || DEFAULT_NICKNAME,
      question: question.trim(),
      body: body.trim() || null,
      tag: finalTag,
      height_cm: heightCm ? parseInt(heightCm) : null,
      weight_kg: weightKg ? parseInt(weightKg) : null,
      budget_krw: budget ? parseInt(budget) * 10000 : null,
    });
    setSubmitting(false);
    if (error) {
      // 폼을 치우지 않는다 — 사용자가 입력한 내용을 잃지 않게 그대로 두고 메시지만 보여준다.
      console.error("[community] 글 등록 실패", error);
      setFormError("글을 저장하지 못했어요. 잠시 후 다시 시도해주세요.");
      return;
    }
    // 매개변수는 `from`·`tag` 를 재사용한다 — GA4 맞춤 측정기준에 이미 등록돼 있어서
    // 새 이름을 쓰면 또 등록해야 하고 소급 적용이 안 된다 (2026-09-13).
    sendGa("board_write_complete", { from: "community", tag: finalTag });
    if (createdId) {
      rememberMyPost(createdId);
      setMine(myPosts());
    }
    setSubmitted(true);
    setNickname(""); setQuestion(""); setBody(""); setHeightCm(""); setWeightKg(""); setBudget("");
    fetchPosts();
    setTimeout(() => setSubmitted(false), 4000);
  }


  return (
    <main className="max-w-3xl mx-auto px-6 py-10">

      {/* 헤더 */}
      <header className="mb-8">
        {/* 2026-09-23 사이트 주인 판단: 「런린이 이야기방 / 뭐든 남겨주세요」보다 「러닝 게시판」이 낫다 — 무엇을 하는 곳인지 바로 읽힘 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">러닝 게시판</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          질문도 좋고, 후기도 좋고, &ldquo;이런 게 있으면 좋겠다&rdquo;도 좋아요. 가입도, 닉네임도 필요 없어요.
        </p>
      </header>

      {/* 글 폼 */}
      <section className="mb-10 border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">글 남기기</h2>
        {submitted ? (
          <div className="py-6 text-center">
            <p className="text-2xl mb-2">🙌</p>
            <p className="font-semibold text-emerald-700">글이 올라갔어요!</p>
            <p className="text-sm text-gray-500 mt-1">운영자가 직접 읽습니다. 답이 필요한 글은 답을 달지만 기한은 약속드리기 어려워요.</p>
            {/* 글을 쓴 사람을 실제 서비스로 보낸다. 여기서 끝나면 재방문할 이유가 없다. */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link
                href="/shoe-finder"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                내 신발 찾기 →
              </Link>
              <Link
                href="/injury"
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:border-gray-400"
              >
                러닝 가이드 보기
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/*
              목록 조회가 실패해도 폼은 계속 연다. 조회 실패와 등록 실패는 별개이고,
              등록이 실패하면 handleSubmit 이 입력 내용을 지우지 않고 메시지만 띄운다.
            */}
            {!loading && loadFailed && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 leading-relaxed" role="status">
                지금 기존 글 목록을 불러오지 못하고 있어요. 글 등록은 시도할 수 있지만,
                저장에 실패하면 안내 메시지가 뜨고 입력하신 내용은 그대로 남습니다.
              </p>
            )}
            {/* 글 — 유일한 필수 항목.
                ⚠️ placeholder 예시는 **질문이 아닌 것을 먼저** 둔다. 예시가 질문뿐이면
                "질문만 쓰는 곳"으로 읽히고, 그게 지금까지 0건이던 이유로 지목된 형식이다. */}
            <div>
              <label htmlFor="q-question" className="text-sm font-semibold text-gray-800 mb-1.5 block">
                무슨 얘기든 좋아요
              </label>
              <textarea
                id="q-question"
                ref={questionRef}
                value={question}
                onChange={e => {
                  setQuestion(e.target.value);
                  if (!writeStarted.current && e.target.value.trim()) {
                    writeStarted.current = true;
                    sendGa("board_write_start", { from: "community", tag: tag || "기타" });
                  }
                }}
                required
                aria-required="true"
                aria-invalid={formError ? true : undefined}
                aria-describedby="q-question-help"
                rows={3}
                maxLength={QUESTION_MAX}
                placeholder={"예: 이 글 도움 됐어요\n예: 발볼 넓은 신발도 다뤄주세요\n예: 평발인데 10km 넘게 뛰면 무릎이 아파요"}
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

            {/* 태그 — 클릭 한 번, **안 골라도 등록된다.** 문턱을 낮추려는 작업이라 새 문턱을 만들지 않는다. */}
            <fieldset className="min-w-0">
              <legend className="text-xs font-medium text-gray-500 mb-2">
                어떤 글인가요? <span className="text-gray-400">(안 골라도 돼요)</span>
              </legend>
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
              {submitting ? "올리는 중…" : "남기기 →"}
            </button>
            <p className="text-xs text-gray-400 text-center -mt-1">
              닉네임을 비우면 &lsquo;{DEFAULT_NICKNAME}&rsquo;으로 표시돼요. 개인정보는 입력하지 마세요.
            </p>
          </form>
        )}
      </section>

      {/* 2026-09-23 내 글에 새 댓글 — 로그인 없이 이 브라우저 기록으로만 (lib/community.ts) */}
      {newOnMine.length > 0 && (
        <Link
          href={`/community/${newOnMine[0].id}`}
          className="mb-4 block rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          💬 내 글에 새 댓글이 {newOnMine.reduce((n, m) => n + (m.now - m.seen), 0)}개 달렸어요 →
        </Link>
      )}

      {/* 2026-09-23 운영규정 — 마라톤온라인도 게시판 맨 위에 고정. 비로그인 게시판이라 규칙이 먼저 보여야 함 */}
      <details className="mb-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
        <summary className="cursor-pointer font-medium text-gray-700">📌 게시판 규칙</summary>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed">
          <li>광고·홍보, 욕설·비방, 다른 사람의 개인정보는 운영자가 지웁니다.</li>
          <li>연락처·주소 같은 내 개인정보도 적지 마세요.</li>
          <li>부상·통증 이야기는 경험 공유예요. 진단이나 치료를 대신하지 않아요.</li>
          <li>문제 있는 글·댓글은 「신고」를 눌러주세요. 운영자가 직접 확인합니다.</li>
        </ul>
      </details>

      <div className="mb-5 flex gap-1 border-b border-gray-200" role="tablist" aria-label="게시판 보기">
        {VIEWS.map(([v, label]) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={`-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              view === v ? "border-emerald-600 text-emerald-700" : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {view === "talk" ? (
        <>
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
            <p className="text-sm font-semibold text-amber-800">글 목록을 불러오지 못했어요</p>
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
            <p className="text-gray-400 text-sm">아직 아무도 안 남겼어요. 첫 글을 남겨보세요!</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">
              <span className="font-medium text-gray-500">{activeTag}</span> 에는 아직 글이 없어요.
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
            {/*
              2026-09-23: 펼침 → 글별 주소(/community/[id]). 특정 글로 링크·공유할 수 있게.
              좋아요·답변·댓글은 상세에서. 경위는 app/community/[id]/page.tsx 주석.
            */}
            {filtered.map(post => {
              const cc = commentCounts?.[post.id];
              const isMine = mine.some(m => m.id === post.id);
              const fresh = newOnMine.find(m => m.id === post.id);
              return (
              <li key={post.id}>
                <Link
                  href={`/community/${post.id}`}
                  className="block border border-gray-100 rounded-2xl bg-white p-5 hover:border-emerald-200 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${TAG_COLORS[post.tag] ?? TAG_COLORS["기타"]}`}>
                      {post.tag}
                    </span>
                    {post.answer && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                        ✓ 운영자 답변
                      </span>
                    )}
                    {isMine && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">내 글</span>
                    )}
                    {fresh && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500 text-white">
                        새 댓글 {fresh.now - fresh.seen}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900 leading-snug mb-1">{post.question}</p>
                  {post.body && (
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{post.body}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <span>{post.nickname || "익명"}</span>
                    <span className="text-gray-300">·</span>
                    <span>{timeAgo(post.created_at)}</span>
                    {cc !== undefined && cc > 0 && (
                      <>
                        <span className="text-gray-300">·</span>
                        <span>💬 {cc}</span>
                      </>
                    )}
                    {post.likes > 0 && (
                      <>
                        <span className="text-gray-300">·</span>
                        <span>🤍 {post.likes}</span>
                      </>
                    )}
                  </div>
                </Link>
              </li>
              );
            })}
          </ul>
        )}

        </>
      ) : (
        <div className="mb-10">
          <p className="mb-3 text-xs text-gray-500">
            {view === "shoe"
              ? "러닝화 상세 페이지 아래에 남긴 한 줄이에요. 발 모양마다 다르고, 추천 순위에는 반영하지 않아요."
              : "대회 상세 페이지 아래에 남긴 한 줄이에요. 다녀온 대회가 있다면 그 대회 페이지에서 남겨주세요."}
          </p>
          <RecentReactions
            names={names}
            kind={view}
            limit={30}
            emptyText={
              view === "shoe"
                ? "아직 신발 후기가 없어요. 신어본 신발의 상세 페이지 아래에서 남길 수 있어요."
                : "아직 대회 후기가 없어요. 다녀온 대회의 상세 페이지 아래에서 남길 수 있어요."
            }
          />
          <Link
            href={view === "shoe" ? "/shoes" : "/races"}
            className="mt-4 inline-block text-sm text-emerald-600 hover:underline"
          >
            {view === "shoe" ? "러닝화 목록 →" : "대회 일정 →"}
          </Link>
        </div>
      )}

      {/* 글만 쓰고 끝나면 재방문할 이유가 없다. 목록 밑에서 실제 서비스로 보낸다. */}
      <FinderCta
        from="community"
        headline="글 남기는 김에, 내 발에 맞는 신발도 찾아보세요"
        sub="키·체중·발볼만 고르면 조건을 통과한 신발 3개를 골라드려요. 가입 없이 1분."
      />
    </main>
  );
}
