"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { gtagEvent } from "@/lib/gtag";
import { authorToken, hasReacted, isMyPost, markSeen, rememberReaction, timeAgo } from "@/lib/community";
import ReportButton from "@/components/ReportButton";
import FinderCta from "@/components/FinderCta";

/**
 * 게시판 글 상세 + 댓글 (2026-09-23)
 *
 * 댓글을 넣은 이유 — 마라톤온라인 자유게시판 실측(2026-09-23)에서 댓글이 가장 많은 글은
 * 글쓴이가 댓글 단 사람을 한 명씩 부르며 답례하는 구조였음. 글쓴이가 **다시 들어옴.**
 * 우리 게시판은 운영자 답 1:1 이라 그 고리가 없었음.
 *
 * 「글쓴이」 표시는 add_comment() RPC 가 서버에서 판정(토큰 해시 비교). 클라이언트가
 * is_author 를 보낼 수 없게 comments 테이블엔 insert 정책을 두지 않음 (supabase/2026-09-23_community.sql).
 */

type Post = {
  id: string;
  nickname: string;
  question: string;
  body: string | null;
  tag: string;
  created_at: string;
  answer: string | null;
  answered_at: string | null;
  likes: number;
};
type Comment = { id: string; nickname: string; body: string; is_author: boolean; created_at: string };
type ListItem = { id: string; question: string; tag: string; created_at: string };

const COMMENT_MAX = 500;

export default function CommunityPostView({ id }: { id: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [others, setOthers] = useState<ListItem[]>([]);
  const [status, setStatus] = useState<"loading" | "failed" | "missing" | "ok">("loading");
  const [commentsFailed, setCommentsFailed] = useState(false);
  const [mine, setMine] = useState(false);
  const [liked, setLiked] = useState(false);

  const [nickname, setNickname] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const seq = useRef(0);

  async function load() {
    const my = ++seq.current;
    setStatus("loading");
    if (!supabaseConfigured) {
      setStatus("failed");
      return;
    }
    try {
      const [p, c, o] = await Promise.all([
        supabase
          .from("community_posts")
          .select("id, nickname, question, body, tag, created_at, answer, answered_at, likes")
          .eq("id", id)
          .maybeSingle(),
        supabase
          .from("community_comments")
          .select("id, nickname, body, is_author, created_at")
          .eq("post_id", id)
          .order("created_at", { ascending: true }),
        supabase
          .from("community_posts")
          .select("id, question, tag, created_at")
          .neq("id", id)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);
      if (my !== seq.current) return;
      if (p.error) {
        // uuid 형식이 아닌 주소도 여기로 옴(22P02). 그건 "없는 글"
        if (p.error.code === "22P02") {
          setStatus("missing");
          return;
        }
        console.error("[community] 글 조회 실패", p.error);
        setStatus("failed");
        return;
      }
      if (!p.data) {
        setStatus("missing");
        return;
      }
      setPost(p.data as Post);
      if (c.error) {
        // 댓글 조회 실패를 "댓글 0개"로 위장하지 않음
        console.error("[community] 댓글 조회 실패", c.error);
        setCommentsFailed(true);
        setComments([]);
      } else {
        setCommentsFailed(false);
        setComments((c.data ?? []) as Comment[]);
        markSeen(id, (c.data ?? []).length);
      }
      setOthers(o.error ? [] : ((o.data ?? []) as ListItem[]));
      setStatus("ok");
    } catch (e) {
      if (my !== seq.current) return;
      console.error("[community] 글 조회 예외", e);
      setStatus("failed");
    }
  }

  useEffect(() => {
    setMine(isMyPost(id));
    setLiked(hasReacted(`like:${id}`));
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function like() {
    if (!post || liked) return;
    setLiked(true);
    rememberReaction(`like:${id}`);
    setPost({ ...post, likes: post.likes + 1 });
    const { data, error } = await supabase.rpc("like_post", { p_id: id });
    if (error) {
      console.error("[community] 공감 실패", error);
      return;
    }
    if (typeof data === "number") setPost((prev) => (prev ? { ...prev, likes: data } : prev));
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) {
      setFormError("내용을 입력해주세요.");
      return;
    }
    setSending(true);
    setFormError("");
    const { error } = await supabase.rpc("add_comment", {
      p_post_id: id,
      p_nickname: nickname.trim(),
      p_body: body.trim(),
      p_author_token: mine ? authorToken() : null,
    });
    setSending(false);
    if (error) {
      // 입력은 지우지 않음
      console.error("[community] 댓글 등록 실패", error);
      setFormError("댓글을 저장하지 못했어요. 잠시 후 다시 시도해주세요. 적은 내용은 그대로 있어요.");
      return;
    }
    gtagEvent("comment_submit", { from: mine ? "author" : "reader", tag: post?.tag ?? "기타" });
    setBody("");
    load();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/community" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
        ← 게시판
      </Link>

      {status === "loading" && <p className="py-16 text-center text-sm text-gray-400">불러오는 중…</p>}

      {status === "failed" && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-10 text-center" role="alert">
          <p className="text-sm font-semibold text-amber-800">글을 불러오지 못했어요</p>
          <button
            onClick={load}
            className="mt-4 rounded-xl border border-amber-300 bg-white px-4 py-2 text-xs font-medium text-amber-800 hover:bg-amber-100"
          >
            다시 시도
          </button>
        </div>
      )}

      {status === "missing" && (
        <div className="py-16 text-center">
          <p className="text-sm text-gray-500">없는 글이거나 지워진 글이에요.</p>
          <Link href="/community" className="mt-3 inline-block text-sm text-emerald-600 hover:underline">
            게시판으로
          </Link>
        </div>
      )}

      {status === "ok" && post && (
        <>
          <article className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-gray-200 px-2 py-0.5 text-gray-600">{post.tag}</span>
              {mine && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">내 글</span>}
            </div>
            <h1 className="text-xl font-bold leading-snug text-gray-900">{post.question}</h1>
            <p className="mt-2 text-xs text-gray-400">
              {post.nickname || "익명"} · {timeAgo(post.created_at)}
            </p>
            {post.body && (
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{post.body}</p>
            )}

            {post.answer && (
              <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="mb-2 text-xs font-bold text-emerald-700">
                  ☕ 운영자 답변 {post.answered_at ? `· ${timeAgo(post.answered_at)}` : ""}
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-emerald-900">{post.answer}</p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={like}
                disabled={liked}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  liked
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500"
                }`}
              >
                {liked ? "❤️" : "🤍"} 공감 {post.likes > 0 && post.likes}
              </button>
              <ReportButton targetType="post" targetId={post.id} />
            </div>
          </article>

          <section className="mt-6" aria-labelledby="comments-h">
            <h2 id="comments-h" className="mb-3 text-base font-bold text-gray-900">
              댓글 {commentsFailed ? "" : comments.length}
            </h2>
            {commentsFailed ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800" role="alert">
                댓글을 불러오지 못했어요.
              </p>
            ) : comments.length === 0 ? (
              <p className="text-sm text-gray-400">
                {mine
                  ? "아직 댓글이 없어요. 새 댓글이 달리면 게시판 목록에 표시돼요 (이 브라우저에서만)."
                  : "아직 댓글이 없어요. 첫 댓글을 남겨주세요."}
              </p>
            ) : (
              <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
                {comments.map((c) => (
                  <li key={c.id} className="px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-500">
                        <span className="font-medium text-gray-700">{c.nickname}</span>
                        {c.is_author && (
                          <span className="ml-1.5 rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                            글쓴이
                          </span>
                        )}
                        {" · "}
                        {timeAgo(c.created_at)}
                      </span>
                      <ReportButton targetType="comment" targetId={c.id} />
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{c.body}</p>
                  </li>
                ))}
              </ul>
            )}

            {!commentsFailed && (
              <form onSubmit={submitComment} className="mt-4 flex flex-col gap-2">
                <label htmlFor="c-body" className="sr-only">
                  댓글
                </label>
                <textarea
                  id="c-body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  maxLength={COMMENT_MAX}
                  rows={3}
                  placeholder={mine ? "댓글 남겨주신 분들께 답해보세요" : "경험이나 의견을 남겨주세요. 개인정보는 적지 마세요."}
                  className="w-full resize-y rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
                <div className="flex gap-2">
                  <label htmlFor="c-nick" className="sr-only">
                    닉네임
                  </label>
                  <input
                    id="c-nick"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={20}
                    placeholder="닉네임 (비우면 러너)"
                    className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400"
                  >
                    {sending ? "…" : "댓글 달기"}
                  </button>
                </div>
                {formError && (
                  <p className="text-sm text-red-500" role="alert">
                    {formError}
                  </p>
                )}
              </form>
            )}
          </section>

          {/* 마라톤온라인처럼 글 아래에 목록 — 다음 글로 이어 읽기 */}
          {others.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-3 text-base font-bold text-gray-900">다른 글</h2>
              <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
                {others.map((o) => (
                  <li key={o.id}>
                    <Link
                      href={`/community/${o.id}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50"
                    >
                      <span className="line-clamp-1 text-sm text-gray-800">{o.question}</span>
                      <span className="shrink-0 text-xs text-gray-400">{timeAgo(o.created_at)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <div className="mt-10">
        <FinderCta
          from="community"
          headline="내 발에 맞는 신발도 찾아보세요"
          sub="키·체중·발볼만 고르면 조건을 통과한 신발 3개를 골라드려요. 가입 없이 1분."
        />
      </div>
    </main>
  );
}
