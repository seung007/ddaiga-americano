"use client";

import Link from "next/link";
import { gtagEvent } from "@/lib/gtag";

/**
 * 대회까지 순서 — 접수 → 준비 → 2주 전 → 전날·당일 → 끝난 뒤 (2026-10-13)
 *
 * 러닝위키가 대회 도움말을 「접수 → 대회 전 → 당일 → 회복」으로 묶는 것을 보고 만들었다.
 * 대회 상세에서 나가는 길이 「같은 달 다른 대회」와 신발 찾기뿐이라, 이미 있는 가이드로 순서만 세운다.
 *
 * 원칙
 *  - 링크는 `app/injury/*` 에 **이미 있는 글만.** 앵커는 그 글에 실제 있는 h2 id 만 쓴다
 *    (first-10k#race-week, marathon-training#taper, half-marathon-training#ramp — 주차 표에 「대회 2주 전」 감량 줄).
 *  - 당일 체크리스트는 하프 글 하나뿐이다. 하프가 아닌 대회에는 「하프 기준」이라고 적는다.
 *  - 시점 표시는 **대회 날짜에서 계산한 D-day 만.** 날짜가 없으면 아무 시점도 표시하지 않는다.
 *    D-day 는 서버가 `daysUntil()`(KST)로 계산해 넘긴다 — 상세 헤더의 D-day 와 같은 값이다.
 */

type Group = "full" | "half" | "10k" | "short";

const SHORT: Record<Group, string> = { full: "풀코스", half: "하프", "10k": "10km", short: "5km 이하" };

const GUIDE: Record<Group, { prep: [string, string]; taper: [string, string] }> = {
  full: { prep: ["/injury/marathon-training", "풀코스 준비 훈련"], taper: ["/injury/marathon-training#taper", "풀코스 테이퍼"] },
  half: { prep: ["/injury/half-marathon-training", "하프 준비 훈련"], taper: ["/injury/half-marathon-training#ramp", "하프 주차 표(2주 전 감량)"] },
  "10k": { prep: ["/injury/first-10k", "첫 10km 준비"], taper: ["/injury/first-10k#race-week", "10km 대회 2주 전부터"] },
  short: { prep: ["/injury/start-running", "달리기 처음 시작하는 법"], taper: ["/injury/rest-day", "휴식일에 할 것"] },
};

function groupOf(km: number): Group {
  if (km >= 30) return "full";
  if (km >= 16) return "half";
  if (km >= 8) return "10k";
  return "short";
}

function JLink({ step, href, children }: { step: string; href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={() => gtagEvent("race_journey_click", { step, to: href })}
      className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
    >
      {children}
    </Link>
  );
}

export default function RaceJourney({
  distancesKm,
  dday,
}: {
  /** 비어 있으면(대회 목록 페이지) 거리별 링크를 전부 보여준다 */
  distancesKm?: number[];
  /** 대회까지 남은 날. 날짜 미정이거나 목록 페이지면 null */
  dday?: number | null;
}) {
  const groups: Group[] = distancesKm && distancesKm.length
    ? (["full", "half", "10k", "short"] as Group[]).filter((g) => distancesKm.some((k) => groupOf(k) === g))
    : ["short", "10k", "half", "full"];
  const generic = !distancesKm || distancesKm.length === 0;
  const hasHalf = generic || distancesKm.some((k) => groupOf(k) === "half");

  // 지금 단계 — 날짜에서만. 14일 이내 = 2주 전, 1일 이내 = 전날·당일, 지남 = 끝난 뒤
  const d = dday ?? null;
  const now: string | null =
    d === null ? null : d < 0 ? "after" : d <= 1 ? "day" : d <= 14 ? "taper" : "prep";

  const steps: { key: string; title: string; when: string | null; body: React.ReactNode }[] = [
    {
      key: "prep",
      title: "접수 후 · 준비 기간",
      when: d !== null ? "~ D-15" : null,
      body: groups.map((g, i) => (
        <span key={g}>
          {i === 0 && generic && "거리별 "}
          {i > 0 && " · "}
          <JLink step="prep" href={GUIDE[g].prep[0]}>{generic ? SHORT[g] : GUIDE[g].prep[1]}</JLink>
        </span>
      )),
    },
    {
      key: "taper",
      title: "2주 전 · 테이퍼·컨디션",
      when: d !== null ? "D-14 ~ D-2" : null,
      body: groups.map((g, i) => (
        <span key={g}>
          {i === 0 && generic && "거리별 "}
          {i > 0 && " · "}
          <JLink step="taper" href={GUIDE[g].taper[0]}>{generic ? SHORT[g] : GUIDE[g].taper[1]}</JLink>
        </span>
      )),
    },
    {
      key: "day",
      title: "전날 · 당일",
      when: d !== null ? "D-1 · D-day" : null,
      body: (
        <JLink step="day" href="/injury/half-marathon-race-day">
          {hasHalf ? "하프 대회 당일 체크리스트" : "당일 체크리스트(하프 기준)"}
        </JLink>
      ),
    },
    {
      key: "after",
      title: "끝난 뒤",
      when: null,
      body: <JLink step="after" href="/injury/cooldown">달린 뒤 정리 운동</JLink>,
    },
    {
      key: "pain",
      title: "아프면",
      when: null,
      body: <JLink step="pain" href="/injury/return-to-running">부상 후 언제 다시 뛰나</JLink>,
    },
  ];

  return (
    <section className="mb-10 rounded-2xl border border-gray-200 p-4">
      <h2 className="mb-3 flex flex-wrap items-baseline gap-x-2 text-lg font-bold text-gray-900">
        대회까지 순서
        {d !== null && d >= 0 && (
          <span className="text-sm font-semibold text-emerald-700">{d === 0 ? "오늘" : `D-${d}`}</span>
        )}
      </h2>
      <ol className="space-y-2.5">
        {steps.map((s, i) => {
          const active = now === s.key;
          return (
            <li key={s.key} className="flex gap-3 text-sm">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  active ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {i + 1}
              </span>
              <div className="min-w-0 break-keep">
                <p className="font-semibold text-gray-900">
                  {s.title}
                  {s.when && <span className="ml-1.5 text-xs font-normal text-gray-400">{s.when}</span>}
                  {active && <span className="ml-1.5 text-xs font-semibold text-emerald-700">지금</span>}
                </p>
                <p className="mt-0.5 leading-relaxed text-gray-700">{s.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
