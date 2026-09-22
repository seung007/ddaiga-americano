"use client";

import { useEffect, useRef, useState } from "react";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { gtagEvent } from "@/lib/gtag";
import { hasReacted, rememberReaction, timeAgo } from "@/lib/community";
import ReportButton from "@/components/ReportButton";

/**
 * 신발 상세 「신어본 사람」 반응 (2026-09-23)
 *
 * 왜 게시판이 아니라 여기인가
 *   마라톤온라인 용품후기 게시판(2026-09-23 실측)은 2년간 18건뿐인데 조회 상위 5개가
 *   전부 신발 후기(886~990)였음. 사람들은 신발 이야기를 **그 신발을 보는 자리에서** 찾음.
 *   우리 게시판은 글 0건 — 빈 방을 하나 더 만드는 대신 이미 방문자가 있는 52개 상세에 붙임.
 *
 * 문턱: 판정 버튼 1개 + (선택) 한 줄 → 「남기기」. 글쓰기보다 낮음. 그래도 0건일 수 있음.
 *
 * ⚠️ 지키는 것
 *   · 빈 상태는 「아직 0개」 그대로. 예시 반응 금지 (2026-08 가짜 Q&A 사건)
 *   · 조회 실패를 0개로 위장하지 않음 — 실패 패널을 따로 둠
 *   · `recommend.ts` 에 반영하지 않음. 표본이 작고, 로그인이 없어 한 사람이 여러 번 누를 수 있음
 */

type Verdict = "good" | "meh" | "bad";
const VERDICTS: [Verdict, string][] = [
  ["good", "잘 맞았어요"],
  ["meh", "그저 그래요"],
  ["bad", "안 맞았어요"],
];
const LABEL: Record<Verdict, string> = { good: "잘 맞았어요", meh: "그저 그래요", bad: "안 맞았어요" };
const NOTE_MAX = 200;

type Row = { id: string; verdict: Verdict; note: string | null; created_at: string };

export default function ShoeReactions({ shoeId, shoeName }: { shoeId: string; shoeName: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState<"loading" | "failed" | "ok">("loading");
  const [picked, setPicked] = useState<Verdict | null>(null);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const seq = useRef(0);
  const key = `shoe:${shoeId}`;

  async function load() {
    const my = ++seq.current;
    setStatus("loading");
    try {
      const { data, error } = await supabase
        .from("shoe_reactions")
        .select("id, verdict, note, created_at")
        .eq("shoe_id", shoeId)
        .order("created_at", { ascending: false })
        .limit(500);
      if (my !== seq.current) return;
      if (error || !data) {
        console.error("[shoe_reactions] 조회 실패", error);
        setStatus("failed");
        return;
      }
      setRows(data as Row[]);
      setStatus("ok");
    } catch (e) {
      if (my !== seq.current) return;
      console.error("[shoe_reactions] 조회 예외", e);
      setStatus("failed");
    }
  }

  useEffect(() => {
    if (!supabaseConfigured) return;
    setDone(hasReacted(key));
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shoeId]);

  // 눌러도 안 되는 입력창은 없는 것만 못함 (InlineAsk 와 같은 원칙)
  if (!supabaseConfigured) return null;

  async function submit() {
    if (!picked || sending) return;
    setSending(true);
    setError("");
    const trimmed = note.trim();
    const { error } = await supabase
      .from("shoe_reactions")
      .insert({ shoe_id: shoeId, verdict: picked, note: trimmed || null });
    setSending(false);
    if (error) {
      console.error("[shoe_reactions] 등록 실패", error);
      setError("저장하지 못했어요. 잠시 후 다시 눌러주세요. 적은 내용은 그대로 있어요.");
      return;
    }
    gtagEvent("shoe_reaction", { from: "shoe-detail", tag: picked });
    if (trimmed) gtagEvent("shoe_reaction_note", { from: "shoe-detail", tag: picked });
    rememberReaction(key);
    setDone(true);
    setPicked(null);
    setNote("");
    load();
  }

  const count = (v: Verdict) => rows.filter((r) => r.verdict === v).length;
  const notes = rows.filter((r) => r.note);

  return (
    <section className="mt-10 rounded-2xl border border-gray-200 p-5" aria-labelledby="shoe-react-h">
      <h2 id="shoe-react-h" className="text-lg font-bold text-gray-900">
        {shoeName} 신어보셨나요?
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-gray-500">
        신어본 사람들의 반응이에요. 발 모양마다 다르고, 추천 순위에는 반영하지 않아요.
      </p>

      {status === "failed" ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800" role="alert">
          반응을 불러오지 못했어요.{" "}
          <button onClick={load} className="font-medium underline">
            다시 시도
          </button>
        </div>
      ) : (
        <p className="mt-3 text-sm text-gray-700" aria-live="polite">
          {status === "loading"
            ? "불러오는 중…"
            : rows.length === 0
              ? "아직 반응 0개 — 첫 번째로 남겨주세요."
              : VERDICTS.map(([v, l]) => `${l} ${count(v)}`).join(" · ")}
        </p>
      )}

      {done ? (
        <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          남겨주셔서 고마워요. 이 브라우저에서는 이미 남기셨어요.
        </p>
      ) : (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="착용 판정">
            {VERDICTS.map(([v, l]) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={picked === v}
                onClick={() => setPicked(v)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  picked === v
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-emerald-400"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          {picked && (
            <div className="mt-3">
              <label htmlFor={`shoe-note-${shoeId}`} className="mb-1 block text-xs font-medium text-gray-500">
                한 줄 덧붙이기 <span className="text-gray-400">(안 써도 돼요)</span>
              </label>
              <textarea
                id={`shoe-note-${shoeId}`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={NOTE_MAX}
                rows={2}
                placeholder="예: 발볼 넓은 편인데 반 치수 크게 샀어요"
                className="w-full resize-y rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <p className="mt-1 text-xs text-gray-400">개인정보는 적지 마세요.</p>
              {error && (
                <p className="mt-2 text-sm text-red-500" role="alert">
                  {error}
                </p>
              )}
              <button
                type="button"
                onClick={submit}
                disabled={sending}
                className="mt-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400"
              >
                {sending ? "남기는 중…" : "남기기"}
              </button>
            </div>
          )}
        </div>
      )}

      {notes.length > 0 && (
        <ul className="mt-5 divide-y divide-gray-100 border-t border-gray-100">
          {notes.slice(0, 10).map((r) => (
            <li key={r.id} className="py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-gray-500">
                  {LABEL[r.verdict]} · {timeAgo(r.created_at)}
                </span>
                <ReportButton targetType="shoe_reaction" targetId={r.id} />
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{r.note}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
