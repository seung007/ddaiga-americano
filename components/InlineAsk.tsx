"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase, supabaseConfigured } from "@/lib/supabase";

/**
 * 글 안에서 바로 질문하는 입력창 — 2026-09-06
 *
 * 왜 별도 페이지가 아니라 글 안인가
 * ────────────────────────────────
 * `/community`는 **두 달 넘게 질문 0건**이었다. 페이지가 고장난 게 아니다 —
 * 라이브에서 확인했고 "아직 질문이 없어요"(조회 성공 + 0건)를 정상 출력한다.
 *
 * 문제는 **거리**다. 네이버 검색 유입 46명이 도착하는 곳은 `/injury/*`이고,
 * 거기서 Q&A로 가려면 **클릭 한 번**이 필요하다. 그 한 번에서 대부분을 잃는다.
 *
 * 그래서 질문창을 사람이 이미 서 있는 자리로 옮긴다. **클릭 0회로 질문이 된다.**
 *
 * 이 저장소가 금지한 것 (반드시 지킬 것)
 * ─────────────────────────────────────
 * 2026-08에 홈 Q&A에 **하드코딩된 가짜 질문 5건**이 있었고, 그게 백엔드 사망을
 * 두 달간 가렸다. 실패·빈 상태·정상이 화면에서 전부 같아 보였기 때문이다.
 *
 *   · **예시 데이터를 절대 넣지 않는다.**
 *   · **실패를 성공처럼 보이게 하지 않는다.** 등록 실패는 실패라고 말하고 입력을 보존한다.
 *   · 미설정(`supabaseConfigured === false`)이면 **입력창을 아예 렌더하지 않는다** —
 *     눌러도 안 되는 버튼을 보여주는 게 더 나쁘다.
 *
 * 출처 추적
 * ─────────
 * `community_posts`에 `source` 컬럼이 없다. 컬럼을 추가하려면 마이그레이션이 필요하고
 * 그건 지금 배포를 막는다. 대신 **GA 이벤트에 `from`을 실어** 어느 글에서 질문이
 * 왔는지 가른다. 나중에 필요하면 컬럼을 추가한다.
 */

const DEFAULT_NICKNAME = "런린이";

export default function InlineAsk({
  from,
  tag,
  heading = "이 글 읽고 궁금한 게 남았나요?",
  placeholder = "예) 평발인데 지금 신는 신발 계속 신어도 되나요?",
}: {
  /** 출처 페이지 슬러그. GA에서 어느 글이 질문을 만드는지 가른다 */
  from: string;
  /** community_posts.tag 값. 이 글의 주제를 그대로 넣는다 */
  tag: string;
  heading?: string;
  placeholder?: string;
}) {
  const [question, setQuestion] = useState("");
  const [nickname, setNickname] = useState("");
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // 설정이 안 됐으면 아무것도 그리지 않는다.
  // 눌러도 안 되는 입력창은 없는 것만 못하다.
  if (!supabaseConfigured) return null;

  const tooShort = question.trim().length < 5;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (tooShort || state === "sending") return;
    setState("sending");
    setErrorMsg("");

    const { error } = await supabase.from("community_posts").insert({
      nickname: nickname.trim() || DEFAULT_NICKNAME,
      question: question.trim(),
      body: null,
      tag,
    });

    if (error) {
      // **입력을 지우지 않는다.** 다시 치게 만들면 그 사람은 떠난다.
      setState("error");
      setErrorMsg(error.message || "등록에 실패했어요.");
      return;
    }

    setState("done");
    setQuestion("");
    setNickname("");
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof g === "function") g("event", "inline_ask_submit", { from, tag });
  }

  if (state === "done") {
    return (
      <section className="my-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="font-medium text-emerald-900">질문이 올라갔어요.</p>
        <p className="mt-1 text-sm leading-relaxed text-emerald-800">
          답변이 달리면 Q&amp;A 목록에 표시됩니다. 확인은 언제든 가능해요.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/community"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            내 질문 보러 가기 →
          </Link>
          <button
            onClick={() => setState("idle")}
            className="rounded-lg border border-emerald-300 px-4 py-2 text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-100"
          >
            하나 더 묻기
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="my-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">
      <h2 className="mb-1 text-base font-bold text-gray-900">{heading}</h2>
      <p className="mb-3 text-sm text-gray-500">
        가입도 닉네임도 필요 없어요. 한 줄만 적으면 됩니다.
      </p>

      <form onSubmit={submit}>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={question}
            onChange={(e) => { setQuestion(e.target.value); if (state === "error") setState("idle"); }}
            placeholder={placeholder}
            maxLength={300}
            aria-label="질문 내용"
            className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={tooShort || state === "sending"}
            className="shrink-0 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:bg-gray-300"
          >
            {state === "sending" ? "올리는 중…" : "질문 올리기 →"}
          </button>
        </div>

        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-2 text-xs text-gray-500 underline hover:text-gray-700"
          >
            닉네임 남기기 (선택)
          </button>
        ) : (
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={`비우면 '${DEFAULT_NICKNAME}'으로 표시돼요`}
            maxLength={20}
            aria-label="닉네임"
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none sm:w-64"
          />
        )}

        {state === "error" && (
          <p role="alert" className="mt-2 text-xs text-red-600">
            등록에 실패했어요 — {errorMsg} 입력한 내용은 지우지 않았으니 다시 눌러보세요.
          </p>
        )}

        <p className="mt-2 text-xs text-gray-400">
          개인정보는 적지 마세요. 의료 상담이 아니며, 통증이 지속되면 병원 진료를 권합니다.
        </p>
      </form>
    </section>
  );
}
