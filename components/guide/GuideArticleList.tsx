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
 * 2026-10-13 (2차): 운영자 — "UI랑 UX가 너무 호감이 안 가게 만들어졌다". 회색 한 줄 목록은 짧았지만 고를 단서가 없었다
 *   (제목만 27줄, 회색 메타, 큰 칩 두 줄). 그래서:
 *   · 주제마다 아이콘·색(카드 왼쪽 타일)으로 훑어보게, 설명은 두 줄까지(line-clamp) 다시 보이게
 *   · 칩은 한 줄 가로 스크롤(휴대폰), 고른 칩은 초록
 *   · 처음엔 6개만 보이고 「글 N개 더 보기」. 나머지도 HTML 에는 있다(검색엔진·AI 가 링크를 읽음 — CSS 로만 숨김)
 *   · 휴대폰 1열, 넓은 화면 2열
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

/** 주제별 아이콘·색 — 카드 왼쪽 타일과 칩에 같이 쓴다(Tailwind 가 읽도록 클래스 문자열을 그대로 적는다) */
const LOOK: Record<string, { icon: string; tile: string; text: string }> = {
  "단계 가이드": { icon: "🧭", tile: "bg-emerald-50", text: "text-emerald-700" },
  "훈련 방법": { icon: "⏱️", tile: "bg-indigo-50", text: "text-indigo-700" },
  "신발 고르기": { icon: "👟", tile: "bg-sky-50", text: "text-sky-700" },
  "아픈 곳": { icon: "🩹", tile: "bg-rose-50", text: "text-rose-700" },
  "달리는 법": { icon: "🏃", tile: "bg-amber-50", text: "text-amber-700" },
  대회: { icon: "🏁", tile: "bg-teal-50", text: "text-teal-700" },
  "선수 이야기": { icon: "🏅", tile: "bg-yellow-50", text: "text-yellow-700" },
  기타: { icon: "📄", tile: "bg-gray-100", text: "text-gray-600" },
};
const look = (t: string) => LOOK[t] ?? LOOK["기타"];
const FIRST = 6;

function track(name: string, params: Record<string, unknown>) {
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof g === "function") g("event", name, params);
}

export default function GuideArticleList() {
  const [stage, setStage] = useState<StageFilter>("전체");
  const [topic, setTopic] = useState<Topic>("전체");
  const [more, setMore] = useState(false);

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

  const matched = ARTICLES.filter(
    (a) => inStage(a, stage) && (topic === "전체" || topicOf(a.tag) === topic),
  );
  // 「전체」일 때는 주제를 번갈아 늘어놓는다 — 앞 6개가 전부 「단계 가이드」(같은 아이콘)라 단조로웠다. 주제 안 순서는 원장 그대로
  const filtered =
    topic !== "전체"
      ? matched
      : (() => {
          const groups = new Map<string, GuideArticle[]>();
          for (const a of matched) {
            const t = topicOf(a.tag);
            groups.set(t, [...(groups.get(t) ?? []), a]);
          }
          const lists = [...groups.values()];
          const out: GuideArticle[] = [];
          for (let i = 0; out.length < matched.length; i++) for (const l of lists) if (l[i]) out.push(l[i]);
          return out;
        })();

  const topicChips = (["전체", ...Object.keys(TOPICS), "기타"] as Topic[])
    .map((t) => ({
      t,
      n: t === "전체" ? ARTICLES.length : ARTICLES.filter((a) => topicOf(a.tag) === t).length,
    }))
    .filter((x) => x.n > 0);

  return (
    <>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
        {topicChips.map(({ t, n }) => (
          <button
            key={t}
            onClick={() => {
              setTopic(t);
              track("injury_topic", { topic: t, count: n });
            }}
            aria-pressed={topic === t}
            className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition-colors ${
              topic === t
                ? "border-emerald-600 bg-emerald-600 font-semibold text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300"
            }`}
          >
            {t !== "전체" && <span aria-hidden className="mr-1">{look(t).icon}</span>}
            {t}
            <span className={topic === t ? "ml-1 text-emerald-100" : "ml-1 text-gray-400"}>{n}</span>
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

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {filtered.map((a, i) => {
          const t = topicOf(a.tag);
          const L = look(t);
          const hide = !more && topic === "전체" && stage === "전체" && i >= FIRST;
          return (
            <li key={a.href} className={hide ? "hidden" : ""}>
              <Link
                href={a.href}
                className="group flex h-full gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-sm"
              >
                <span aria-hidden className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${L.tile}`}>
                  {L.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-xs font-medium ${L.text}`}>
                    {t === "기타" ? a.tag : t === a.tag ? t : `${t} · ${a.tag}`}
                  </span>
                  <span className="mt-0.5 line-clamp-2 break-keep font-semibold leading-snug text-gray-900 group-hover:text-emerald-700">
                    {a.title}
                  </span>
                  <span className="mt-1 line-clamp-2 break-keep text-sm leading-relaxed text-gray-500">{a.desc}</span>
                  <span className="mt-2 block text-xs text-gray-400">
                    {stageBadge(a)} · {a.readTime} 읽기
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {!more && topic === "전체" && stage === "전체" && filtered.length > FIRST && (
        <button
          type="button"
          onClick={() => {
            setMore(true);
            track("injury_more", { count: filtered.length });
          }}
          className="mt-3 w-full rounded-2xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 hover:border-emerald-300 hover:text-emerald-700"
        >
          글 {filtered.length - FIRST}개 더 보기 ↓
        </button>
      )}
    </>
  );
}
