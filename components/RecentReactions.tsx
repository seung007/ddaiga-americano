"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { timeAgo } from "@/lib/community";
import type { ReactionNames } from "@/lib/reaction-names";

/**
 * 최근 한 줄 후기 — 신발 상세·대회 상세에 남긴 반응을 모아 보여줌 (2026-09-23)
 *
 * 게시판 글은 0건이어도 반응은 문턱이 낮아 먼저 쌓일 수 있음(추론, 측정 아님).
 * 흩어진 반응을 홈·게시판에 모아야 "여기 사람이 있다"가 보임.
 *
 * · 한 줄(note)을 쓴 반응만 보여줌. 버튼만 누른 건 내용이 없어 목록에 의미가 없음
 * · 빈 상태·실패 상태 분리, 예시 데이터 금지
 * · 이름표에 없는 id(삭제된 신발·대회)는 목록에서 뺌 — 끊긴 링크를 만들지 않음
 */

type Kind = "all" | "shoe" | "race";
type Item = {
  id: string;
  kind: "shoe" | "race";
  targetId: string;
  label: string;
  note: string;
  created_at: string;
};

const SHOE_LABEL: Record<string, string> = { good: "잘 맞았어요", meh: "그저 그래요", bad: "안 맞았어요" };

export default function RecentReactions({
  names,
  kind = "all",
  limit = 5,
  emptyText,
}: {
  names: ReactionNames;
  kind?: Kind;
  limit?: number;
  emptyText?: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [status, setStatus] = useState<"loading" | "failed" | "ok">("loading");
  const seq = useRef(0);

  async function load() {
    const my = ++seq.current;
    setStatus("loading");
    try {
      const [s, r] = await Promise.all([
        kind === "race"
          ? Promise.resolve({ data: [], error: null })
          : supabase
              .from("shoe_reactions")
              .select("id, shoe_id, verdict, note, created_at")
              .not("note", "is", null)
              .order("created_at", { ascending: false })
              .limit(limit),
        kind === "shoe"
          ? Promise.resolve({ data: [], error: null })
          : supabase
              .from("race_reactions")
              .select("id, race_id, distance, note, created_at")
              .not("note", "is", null)
              .order("created_at", { ascending: false })
              .limit(limit),
      ]);
      if (my !== seq.current) return;
      if (s.error || r.error) {
        console.error("[recent_reactions] 조회 실패", s.error ?? r.error);
        setStatus("failed");
        return;
      }
      const shoes = ((s.data ?? []) as { id: string; shoe_id: string; verdict: string; note: string; created_at: string }[])
        .filter((x) => names.shoes[x.shoe_id])
        .map((x) => ({
          id: x.id,
          kind: "shoe" as const,
          targetId: x.shoe_id,
          label: `${names.shoes[x.shoe_id]} · ${SHOE_LABEL[x.verdict] ?? ""}`,
          note: x.note,
          created_at: x.created_at,
        }));
      const races = ((r.data ?? []) as { id: string; race_id: string; distance: string | null; note: string; created_at: string }[])
        .filter((x) => names.races[x.race_id])
        .map((x) => ({
          id: x.id,
          kind: "race" as const,
          targetId: x.race_id,
          label: `${names.races[x.race_id]}${x.distance ? ` · ${x.distance}` : ""}`,
          note: x.note,
          created_at: x.created_at,
        }));
      setItems(
        [...shoes, ...races].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, limit)
      );
      setStatus("ok");
    } catch (e) {
      if (my !== seq.current) return;
      console.error("[recent_reactions] 조회 예외", e);
      setStatus("failed");
    }
  }

  useEffect(() => {
    if (!supabaseConfigured) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, limit]);

  if (!supabaseConfigured) return null;

  if (status === "loading") return <p className="py-6 text-center text-sm text-gray-400">불러오는 중…</p>;

  if (status === "failed")
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800" role="alert">
        후기를 불러오지 못했어요.{" "}
        <button onClick={load} className="font-medium underline">
          다시 시도
        </button>
      </p>
    );

  if (items.length === 0)
    return (
      <p className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-500">
        {emptyText ?? "아직 한 줄 후기가 없어요. 신발·대회 페이지 아래에서 남길 수 있어요."}
      </p>
    );

  return (
    <ul className="flex flex-col gap-2">
      {items.map((it) => (
        <li key={`${it.kind}-${it.id}`}>
          <Link
            href={it.kind === "shoe" ? `/shoes/${it.targetId}` : `/races/${it.targetId}`}
            className="block rounded-xl border border-gray-100 bg-white px-4 py-3 transition-colors hover:border-emerald-300"
          >
            <p className="text-xs text-gray-500">
              <span className="mr-1">{it.kind === "shoe" ? "👟" : "🏅"}</span>
              {it.label} · {timeAgo(it.created_at)}
            </p>
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-800">{it.note}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
