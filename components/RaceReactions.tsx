"use client";

import { useEffect, useRef, useState } from "react";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { gtagEvent } from "@/lib/gtag";
import { hasReacted, rememberReaction, timeAgo } from "@/lib/community";
import ReportButton from "@/components/ReportButton";

/**
 * 대회 상세 「나가요 / 다녀왔어요」 (2026-09-23)
 *
 * 근거: 마라톤온라인 대회참가기(2026-09-23 실측) 1,970건을 거리별로 분류하고,
 * 글은 월 1건 이하인데 조회가 500~1,200 — 대회 후기는 오래 읽힘.
 * 우리는 대회 55건 상세가 이미 있어서 게시판 대신 그 페이지에 붙임.
 *
 * · 대회 전: 「나가요」 1클릭 → 「N명이 나간다고 했어요」
 * · 대회 후: 「다녀왔어요」 + 종목 + (선택) 한 줄
 * `ended` 는 서버가 날짜로 계산해 넘김(페이지 revalidate 6시간). 날짜 미정이면 false.
 *
 * ⚠️ 인원 수는 이 사이트에서 누른 사람 수일 뿐 실제 참가자 수가 아님 — 문구에 그렇게 적음.
 * ⚠️ 빈 상태·실패 상태 분리, 예시 데이터 금지 (ShoeReactions 와 같은 원칙)
 */

type Kind = "going" | "done";
type Row = { id: string; kind: Kind; distance: string | null; note: string | null; created_at: string };
const NOTE_MAX = 200;

export default function RaceReactions({
  raceId,
  ended,
  distances,
}: {
  raceId: string;
  ended: boolean;
  /** 종목 라벨 (예: 풀코스·하프·10km) */
  distances: string[];
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState<"loading" | "failed" | "ok">("loading");
  const [open, setOpen] = useState(false);
  const [distance, setDistance] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const seq = useRef(0);
  const kind: Kind = ended ? "done" : "going";
  const key = `race:${raceId}:${kind}`;

  async function load() {
    const my = ++seq.current;
    setStatus("loading");
    try {
      const { data, error } = await supabase
        .from("race_reactions")
        .select("id, kind, distance, note, created_at")
        .eq("race_id", raceId)
        .order("created_at", { ascending: false })
        .limit(500);
      if (my !== seq.current) return;
      if (error || !data) {
        console.error("[race_reactions] 조회 실패", error);
        setStatus("failed");
        return;
      }
      setRows(data as Row[]);
      setStatus("ok");
    } catch (e) {
      if (my !== seq.current) return;
      console.error("[race_reactions] 조회 예외", e);
      setStatus("failed");
    }
  }

  useEffect(() => {
    if (!supabaseConfigured) return;
    setDone(hasReacted(key));
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raceId, kind]);

  if (!supabaseConfigured) return null;

  async function send(withDetail: boolean) {
    if (sending) return;
    setSending(true);
    setError("");
    const trimmed = withDetail ? note.trim() : "";
    const { error } = await supabase.from("race_reactions").insert({
      race_id: raceId,
      kind,
      distance: withDetail && distance ? distance : null,
      note: trimmed || null,
    });
    setSending(false);
    if (error) {
      console.error("[race_reactions] 등록 실패", error);
      setError("저장하지 못했어요. 잠시 후 다시 눌러주세요.");
      return;
    }
    gtagEvent(kind === "going" ? "race_going" : "race_done", { from: "race-detail", tag: distance || "없음" });
    rememberReaction(key);
    setDone(true);
    setOpen(false);
    setNote("");
    load();
  }

  const going = rows.filter((r) => r.kind === "going").length;
  const doneRows = rows.filter((r) => r.kind === "done");
  const notes = doneRows.filter((r) => r.note);

  return (
    <section className="mb-10 rounded-2xl border border-gray-200 p-5" aria-labelledby="race-react-h">
      <h2 id="race-react-h" className="text-lg font-bold text-gray-900">
        {ended ? "다녀오셨나요?" : "이 대회 나가세요?"}
      </h2>

      {status === "failed" ? (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800" role="alert">
          불러오지 못했어요.{" "}
          <button onClick={load} className="font-medium underline">
            다시 시도
          </button>
        </div>
      ) : (
        <p className="mt-2 text-sm text-gray-700" aria-live="polite">
          {status === "loading"
            ? "불러오는 중…"
            : ended
              ? doneRows.length === 0
                ? "아직 후기 0개 — 다녀오셨다면 첫 후기를 남겨주세요."
                : `이 사이트에서 ${doneRows.length}명이 다녀왔다고 남겼어요.`
              : going === 0
                ? "아직 아무도 안 눌렀어요."
                : `이 사이트에서 ${going}명이 나간다고 했어요.`}
        </p>
      )}

      {done ? (
        <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          {ended ? "후기 고마워요. 내년에 나갈 사람들이 봐요." : "눌러주셨어요. 대회 끝나고 후기도 남겨주세요."}
        </p>
      ) : !ended ? (
        <button
          type="button"
          onClick={() => send(false)}
          disabled={sending}
          className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400"
        >
          {sending ? "…" : "🙋 나가요"}
        </button>
      ) : !open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          🏅 다녀왔어요
        </button>
      ) : (
        <div className="mt-3 flex flex-col gap-3">
          {distances.length > 0 && (
            <fieldset>
              <legend className="mb-1.5 text-xs font-medium text-gray-500">종목 (선택)</legend>
              <div className="flex flex-wrap gap-2">
                {distances.map((d) => (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={distance === d}
                    onClick={() => setDistance(distance === d ? "" : d)}
                    className={`rounded-full border px-3 py-1 text-sm ${
                      distance === d ? "border-emerald-600 bg-emerald-600 text-white" : "border-gray-300 text-gray-700"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <div>
            <label htmlFor={`race-note-${raceId}`} className="mb-1 block text-xs font-medium text-gray-500">
              한 줄 후기 <span className="text-gray-400">(코스·급수·혼잡도 등, 안 써도 돼요)</span>
            </label>
            <textarea
              id={`race-note-${raceId}`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={NOTE_MAX}
              rows={2}
              placeholder="예: 후반 언덕이 생각보다 길었어요"
              className="w-full resize-y rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={() => send(true)}
            disabled={sending}
            className="self-start rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400"
          >
            {sending ? "남기는 중…" : "남기기"}
          </button>
        </div>
      )}
      {error && !open && (
        <p className="mt-2 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      {notes.length > 0 && (
        <ul className="mt-5 divide-y divide-gray-100 border-t border-gray-100">
          {notes.slice(0, 10).map((r) => (
            <li key={r.id} className="py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-gray-500">
                  {r.distance ? `${r.distance} · ` : ""}
                  {timeAgo(r.created_at)}
                </span>
                <ReportButton targetType="race_reaction" targetId={r.id} />
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{r.note}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
