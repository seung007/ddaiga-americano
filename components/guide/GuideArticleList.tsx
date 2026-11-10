"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ARTICLES, topicOf, type GuideArticle } from "@/lib/guide/articles";
import { STAGES, type StageId } from "@/lib/guide/stages";
import { X } from "lucide-react";
import { TOPIC_ORDER, TOPIC_SLUG, TOPIC_NOTE, topicPreview, latestEnabled, byLatest, look } from "@/lib/guide/listRules";
import { GuideRow } from "@/components/guide/ArticleRows";

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
 * 2026-10-13 (3차): 운영자 — "처음부터 분류로 나눠 놓으면 안 돼? 전체 글 보기가 가독성이 떨어지고 두 줄(2열)이라 또 그렇다".
 *   주제 칩 + 섞인 카드 2열 → **주제별 묶음, 한 줄에 글 하나.** 칩·「더 보기」를 없앴다(분류 제목이 곧 길잡이).
 *   단계 카드의 「이 단계에 맞는 글 전체」(?stage=)로 오면 묶음 안에서 거르고, 빈 묶음은 숨긴다.
 * 2026-10-13 (4차): 글이 늘면 저절로 나뉜다 — 규칙과 숫자는 lib/guide/listRules.ts 한 곳.
 *   한 주제가 넘치면 앞 몇 개 + 「모두 보기」(주제 페이지), 전체가 많아지면 「최신 글」 띠. 지금(27개)은 둘 다 안 보인다.
 * 2026-10-13 (5차): 목록 오른쪽 「4분」을 뺐다 — 운영자 "분은 왜 넣은 거야? 굳이?". 글을 고르는 데 쓰이지 않는 정보였다.
 * 2026-11-10 (6차): 사이트 주인 — 「신발 고르기 3」 같은 묶음이 제목+설명 줄만 이어져 "들어가면 구분이 안 된다, 표처럼".
 *   · 묶음: 테두리 상자 대신 굵은 윗선(2px #111) + 20px 제목 + 선 아이콘 + 「글 N개」 + 무엇을 찾는 묶음인지 한 줄(TOPIC_NOTE)
 *   · 줄: GuideRow(ArticleRows.tsx) — [부위·주제 칩 · 단계] / 질문 제목 16px 굵게 / 화살표. 줄 전체가 링크, 높이 56px 이상
 *   · 설명은 허브에서 뺐다 — 제목이 이미 독자 질문이라 설명 한 줄(잘린 문장)이 줄 사이 경계를 흐렸다. 주제 페이지에서는 두 줄까지 보인다
 *   · 이모지 + 파스텔 타일 → lucide 선 아이콘(홈과 같은 묶음)
 *   ⚠️ 휴대폰 실기 화면은 이 세션에서 열지 못했다(npm run dev 금지) — 320px 넘침은 클래스(min-w-0·break-keep·flex-wrap)로만 막았다
 *
 * 칩마다 개수를 붙이는 이유(9/03): 개수가 화면에 있으면 그 자체가 검사기다.
 * 「전체」를 빼지 않는 이유(9/03): 빼면 되돌아올 길이 막힌다.
 */

type StageFilter = "전체" | StageId;

function inStage(a: GuideArticle, s: StageFilter): boolean {
  if (s === "전체") return true;
  return a.stages === "all" || a.stages.includes(s);
}


function track(name: string, params: Record<string, unknown>) {
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof g === "function") g("event", name, params);
}

export default function GuideArticleList() {
  const [stage, setStage] = useState<StageFilter>("전체");

  // 단계 카드의 「이 단계에 맞는 글 전체」(StageListButton) 또는 주소 ?stage= 로 거른다
  useEffect(() => {
    const valid = (v: string | null): v is StageId => !!v && STAGES.some((s) => s.id === v);
    const q = new URLSearchParams(location.search).get("stage");
    if (valid(q)) setStage(q);
    const on = (e: Event) => {
      const v = (e as CustomEvent<string>).detail;
      if (valid(v)) {
        setStage(v);
        track("injury_filter", { stage: v, from: "stage_card" });
      }
    };
    window.addEventListener("guide:stage", on);
    return () => window.removeEventListener("guide:stage", on);
  }, []);

  const stageInfo = stage === "전체" ? null : STAGES.find((s) => s.id === stage);
  const groups = TOPIC_ORDER.map((t) => ({
    t,
    items: ARTICLES.filter((a) => topicOf(a.tag) === t && inStage(a, stage)),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      {stageInfo && (
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          <span className="min-w-0 flex-1 break-keep font-bold">
            {stageInfo.step}단계 · {stageInfo.from} → {stageInfo.to}에 맞는 글만 보는 중
          </span>
          <button
            type="button"
            onClick={() => {
              setStage("전체");
              const u = new URL(location.href);
              u.searchParams.delete("stage");
              history.replaceState(null, "", u);
            }}
            className="flex min-h-11 items-center gap-1 font-bold text-emerald-700 underline underline-offset-2"
          >
            <X aria-hidden className="h-4 w-4" />
            전체 보기
          </button>
        </div>
      )}

      {stage === "전체" && latestEnabled() && (
        <section aria-label="최신 글" className="mb-8">
          <div className="flex items-end justify-between gap-3 border-t-2 border-[#111111] pt-3">
            <h3 className="text-xl font-bold text-[#111111]">최신 글</h3>
            <Link href="/injury/all" className="flex min-h-11 items-center text-sm font-bold text-emerald-700 hover:underline">
              모든 글 보기
            </Link>
          </div>
          <ul className="divide-y divide-gray-200">
            {byLatest().slice(0, 5).map((a, i) => (
              <li key={a.href}>
                <GuideRow a={a} onClick={() => track("injury_list_click", { topic: "최신 글", pos: i + 1, to: a.href })} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="space-y-8">
        {groups.map(({ t, items }) => {
          const L = look(t);
          // 단계로 거른 상태에서는 다 보여 준다(이미 좁혀졌다)
          const { shown, rest } = stage === "전체" ? topicPreview(items) : { shown: items, rest: 0 };
          return (
            <section key={t} aria-label={t}>
              <div className="border-t-2 border-[#111111] pt-3">
                <h3 className="flex items-center gap-2 text-xl font-bold text-[#111111]">
                  <L.Icon aria-hidden className={`h-5 w-5 shrink-0 ${L.text}`} />
                  <span className="break-keep">{t}</span>
                  <span className="text-sm font-normal text-[#4B5059]">글 {items.length}개</span>
                </h3>
                <p className="mt-1 break-keep text-sm text-[#4B5059]">{TOPIC_NOTE[t]}</p>
              </div>
              <ul className="mt-1 divide-y divide-gray-200">
                {shown.map((a, i) => (
                  <li key={a.href}>
                    <GuideRow a={a} onClick={() => track("injury_list_click", { topic: t, pos: i + 1, to: a.href })} />
                  </li>
                ))}
              </ul>
              {rest > 0 && (
                <Link
                  href={`/injury/topic/${TOPIC_SLUG[t]}`}
                  className="mt-2 flex min-h-11 items-center justify-center rounded-xl bg-[#F5F5F5] text-sm font-bold text-[#111111] hover:text-emerald-700"
                >
                  {t} 글 {items.length}개 모두 보기
                </Link>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
