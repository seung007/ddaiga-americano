"use client";

import Link from "next/link";
import { useState } from "react";
import { ARTICLES, TOPICS, topicOf, type GuideArticle, type Topic } from "@/lib/guide/articles";
import { STAGES, type StageId } from "@/lib/guide/stages";

/**
 * 허브 글 목록 — 단계 칩 × 주제 칩 (AND).
 *
 * 2026-10-06: 수준 칩(초심자/중급자/숙련자)을 단계 칩으로 바꿨다. 이유는 `lib/guide/stages.ts` 머리말.
 * GA 이벤트 이름(`injury_filter`·`injury_topic`)은 그대로 둔다 — 9/03 부터 쌓인 값과 이어서 보려고.
 * 파라미터만 `level` → `stage` 로 바뀌었다.
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

  const filtered = ARTICLES.filter(
    (a) => inStage(a, stage) && (topic === "전체" || topicOf(a.tag) === topic),
  );

  const stageChips: { id: StageFilter; label: string; n: number }[] = [
    { id: "전체", label: "전체", n: ARTICLES.length },
    ...STAGES.map((s) => ({
      id: s.id as StageFilter,
      label: `${s.step} ${s.short}`,
      n: ARTICLES.filter((a) => inStage(a, s.id)).length,
    })),
  ];

  const topicChips = (["전체", ...Object.keys(TOPICS), "기타"] as Topic[])
    .map((t) => ({
      t,
      n: t === "전체" ? ARTICLES.length : ARTICLES.filter((a) => topicOf(a.tag) === t).length,
    }))
    .filter((x) => x.n > 0);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {stageChips.map(({ id, label, n }) => (
          <button
            key={id}
            onClick={() => {
              setStage(id);
              track("injury_filter", { stage: id, count: n });
            }}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              stage === id
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {label}
            <span className={stage === id ? "ml-1.5 text-emerald-100" : "ml-1.5 text-gray-400"}>{n}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
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

      <ul className="mt-5 flex flex-col gap-3">
        {filtered.map((a) => (
          <li key={a.href}>
            <Link
              href={a.href}
              className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-sm"
            >
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${a.tagColor}`}>{a.tag}</span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    {stageBadge(a)}
                  </span>
                </div>
                <h3 className="mb-1 font-semibold leading-snug text-gray-900">{a.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{a.desc}</p>
              </div>
              <span className="mt-1 shrink-0 whitespace-nowrap text-xs text-gray-400">{a.readTime}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
