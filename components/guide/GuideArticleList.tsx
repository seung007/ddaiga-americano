"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ARTICLES, TOPICS, topicOf, type GuideArticle, type Topic } from "@/lib/guide/articles";
import { STAGES, type StageId } from "@/lib/guide/stages";

/**
 * 허브 글 목록 — 단계 칩 × 주제 칩 (AND).
 *
 * 2026-10-06: 수준 칩(초심자/중급자/숙련자)을 단계 칩으로 바꿨다. 이유는 `lib/guide/stages.ts` 머리말.
 * GA 이벤트 이름(`injury_filter`·`injury_topic`)은 그대로 둔다 — 9/03 부터 쌓인 값과 이어서 보려고.
 * 파라미터만 `level` → `stage` 로 바뀌었다.
 *
 * 2026-10-13: 단계 칩 줄을 뺐다 — 허브 맨 위 「지금 어디쯤인가요?」가 단계를 이미 묻는다. 칩 두 줄(11개)이 목록보다 먼저 눈에 걸렸다.
 *   `stage` 상태는 「필터 지우기」 호환을 위해 남긴다(항상 「전체」).
 *
 * 칩마다 개수를 붙이는 이유(9/03): 개수가 화면에 있으면 그 자체가 검사기다.
 * 「전체」를 빼지 않는 이유(9/03): 빼면 되돌아올 길이 막힌다.
 */

type StageFilter = "전체" | StageId;

function inStage(a: GuideArticle, s: StageFilter): boolean {
  if (s === "전체") return true;
  return a.stages === "all" || a.stages.includes(s);
}

function stageBadge(a: GuideArticle): string {
  if (a.stages === "all") return "모든 단계";
  if (a.stages.length === 0) return "읽을거리";
  const steps = a.stages.map((id) => STAGES.find((s) => s.id === id)!.step).sort((x, y) => x - y);
  return `${steps.join("·")}단계`;
}

function track(name: string, params: Record<string, unknown>) {
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof g === "function") g("event", name, params);
}

export default function GuideArticleList() {
  const [stage, setStage] = useState<StageFilter>("전체");
  const [topic, setTopic] = useState<Topic>("전체");

  // 단계 카드의 「이 단계에 맞는 글 전체」(StageListButton) 또는 주소 ?stage= 로 거른다
  useEffect(() => {
    const valid = (v: string | null): v is StageId => !!v && STAGES.some((s) => s.id === v);
    const q = new URLSearchParams(location.search).get("stage");
    if (valid(q)) setStage(q);
    const on = (e: Event) => {
      const v = (e as CustomEvent<string>).detail;
      if (valid(v)) {
        setStage(v);
        setTopic("전체");
        track("injury_filter", { stage: v, from: "stage_card" });
      }
    };
    window.addEventListener("guide:stage", on);
    return () => window.removeEventListener("guide:stage", on);
  }, []);

  const stageInfo = stage === "전체" ? null : STAGES.find((s) => s.id === stage);

  const filtered = ARTICLES.filter(
    (a) => inStage(a, stage) && (topic === "전체" || topicOf(a.tag) === topic),
  );

  const topicChips = (["전체", ...Object.keys(TOPICS), "기타"] as Topic[])
    .map((t) => ({
      t,
      n: t === "전체" ? ARTICLES.length : ARTICLES.filter((a) => topicOf(a.tag) === t).length,
    }))
    .filter((x) => x.n > 0);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {topicChips.map(({ t, n }) => (
          <button
            key={t}
            onClick={() => {
              setTopic(t);
              track("injury_topic", { topic: t, count: n });
            }}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              topic === t
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {t}
            <span className={topic === t ? "ml-1.5 text-gray-300" : "ml-1.5 text-gray-400"}>{n}</span>
          </button>
        ))}
      </div>

      {stageInfo && (
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-700">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-800">
            {stageInfo.step}단계 · {stageInfo.from} → {stageInfo.to}에 맞는 글만
          </span>
          <button
            onClick={() => {
              setStage("전체");
              const u = new URL(location.href);
              u.searchParams.delete("stage");
              history.replaceState(null, "", u);
            }}
            className="text-emerald-700 underline underline-offset-2"
          >
            전체 보기
          </button>
        </p>
      )}

      {filtered.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">
          이 조합에는 글이 없습니다.{" "}
          <button
            onClick={() => {
              setStage("전체");
              setTopic("전체");
            }}
            className="font-medium text-emerald-600 underline underline-offset-2"
          >
            필터 지우기
          </button>
        </p>
      )}

      {/* 2026-10-13: 카드(설명 2~3줄) 27장이 4,500px 를 차지했다 → 제목 한 줄 목록. 설명은 글 첫머리에 있다 */}
      <ul className="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
        {filtered.map((a) => (
          <li key={a.href}>
            <Link href={a.href} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
              <span className="min-w-0 flex-1">
                <span className="block break-keep text-[15px] font-medium leading-snug text-gray-900">{a.title}</span>
                <span className="mt-0.5 block text-xs text-gray-400">
                  {a.tag} · {stageBadge(a)} · {a.readTime}
                </span>
              </span>
              <span aria-hidden className="shrink-0 text-gray-300">›</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
