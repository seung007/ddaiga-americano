"use client";

import Link from "next/link";
import { useState } from "react";
import {
  HONERT_CITE,
  HONERT_HREF,
  LEVEL_LABEL,
  type Level,
} from "@/lib/guide/stages";

/**
 * 내 수준 비교 — 경력·횟수·주간 거리 (2026-10-13, StageFinder 에서 분리)
 *
 * 전에는 「내 단계 찾기」 한 상자 안에 ① 지금 어디까지 달리나(단계) ② 경력·빈도·거리(참고)가 같이 있었다.
 * 허브 재설계에서 ①은 단계 카드 자체가 맡고(눌러서 펼침), ②만 여기 남겨 맨 아래 「초보·중급·숙련」 접힘 안에 둔다.
 *
 * Honert 2020 의 세 축 — **참고로만** 보여준다. 범위가 겹치고 공인 분류가 아니라서
 * 결과를 하나로 뭉개지 않고 축마다 어느 범위에 드는지를 그대로 보여준다.
 * 종합 표시 규칙(이 사이트가 정함): 경력을 우선한다. 고수준은 세 축이 모두 맞을 때만.
 *
 * 경고는 근거가 있는 것만 낸다.
 *   · 지난 12개월 부상 → Saragiotto 2014 (가장 일관된 위험 요인)
 *   · 경력 1년 미만인데 주 30km 이상 → Videbæk 2015 (초보의 시간당 부상이 더 많음).
 *     「위험하다」고 단정하지 않는다 — 그 조합을 직접 시험한 연구는 없다.
 *
 * GA 이벤트 이름(guide_stage_finder)은 그대로 — 10/06 부터 쌓인 값과 이어 보려고. stage 는 "none".
 */
type Years = "none" | "lt1" | "1to3" | "gt3";
type Sessions = "0-1" | "2-3" | "4" | "5+";
type Km = "lt5" | "5-15" | "15-30" | "30-50" | "gt50";
type Pain = "none" | "shin" | "knee-front" | "knee-out" | "heel" | "achilles";

const YEARS_Q: { id: Years; label: string; fits: Level[] }[] = [
  { id: "none", label: "없음·쉬다 다시", fits: ["novice"] },
  { id: "lt1", label: "1년 미만", fits: ["novice"] },
  { id: "1to3", label: "1~3년", fits: ["recreational"] },
  { id: "gt3", label: "3년 넘게", fits: ["recreational", "high"] },
];

const SESSIONS_Q: { id: Sessions; label: string; fits: Level[] }[] = [
  { id: "0-1", label: "0~1회", fits: ["novice", "recreational"] },
  { id: "2-3", label: "2~3회", fits: ["novice", "recreational"] },
  { id: "4", label: "4회", fits: ["recreational"] },
  { id: "5+", label: "5회 이상", fits: ["recreational", "high"] },
];

const KM_Q: { id: Km; label: string; fits: Level[] }[] = [
  { id: "lt5", label: "5km 미만", fits: [] },
  { id: "5-15", label: "5~15km", fits: ["novice"] },
  { id: "15-30", label: "15~30km", fits: ["novice", "recreational"] },
  { id: "30-50", label: "30~50km", fits: ["recreational"] },
  { id: "gt50", label: "50km 넘게", fits: ["high"] },
];

const PAIN_Q: { id: Pain; label: string; href?: string; page?: string }[] = [
  { id: "none", label: "없음" },
  { id: "shin", label: "정강이", href: "/injury/shin-splints", page: "정강이 통증(신스플린트)" },
  { id: "knee-front", label: "무릎 앞", href: "/injury/knee-pain", page: "러너 무릎(슬개대퇴)" },
  { id: "knee-out", label: "무릎 바깥", href: "/injury/it-band", page: "장경인대염" },
  { id: "heel", label: "발바닥·뒤꿈치", href: "/injury/plantar-fasciitis", page: "족저근막염" },
  { id: "achilles", label: "아킬레스·종아리", href: "/injury/achilles", page: "아킬레스건·종아리 통증" },
];

function track(field: string, value: string) {
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof g === "function") g("event", "guide_stage_finder", { field, value, stage: "none" });
}

function fitsLabel(fits: Level[]): string {
  if (fits.length === 0) return "입문 범위(주 5~20km)보다 적음";
  return fits.map((l) => LEVEL_LABEL[l]).join("·");
}

function Chips<T extends string>({
  options,
  value,
  onPick,
}: {
  options: { id: T; label: string }[];
  value: T | null;
  onPick: (v: T) => void;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onPick(o.id)}
          className={`rounded-full border px-3 py-1.5 text-left text-sm transition-colors ${
            value === o.id
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function LevelCheck() {
  const [years, setYears] = useState<Years | null>(null);
  const [sessions, setSessions] = useState<Sessions | null>(null);
  const [km, setKm] = useState<Km | null>(null);
  const [injured, setInjured] = useState<"yes" | "no" | null>(null);
  const [pain, setPain] = useState<Pain | null>(null);

  const yq = YEARS_Q.find((x) => x.id === years);
  const sq = SESSIONS_Q.find((x) => x.id === sessions);
  const kq = KM_Q.find((x) => x.id === km);
  const pq = PAIN_Q.find((x) => x.id === pain);

  let overall: Level | null = null;
  if (years === "none" || years === "lt1") overall = "novice";
  else if (years === "gt3" && sessions === "5+" && km === "gt50") overall = "high";
  else if (years) overall = "recreational";

  const axesDisagree =
    overall !== null &&
    [sq?.fits, kq?.fits].some((f) => f !== undefined && !f.includes(overall as Level));

  const fastRamp = (years === "none" || years === "lt1") && (km === "30-50" || km === "gt50");

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-700">주 1회 이상 꾸준히 달린 기간</p>
        <Chips options={YEARS_Q} value={years} onPick={(v) => { setYears(v); track("years", v); }} />
      </div>
      <div>
        <p className="text-sm text-gray-700">요즘 일주일에 달리는 횟수</p>
        <Chips options={SESSIONS_Q} value={sessions} onPick={(v) => { setSessions(v); track("sessions", v); }} />
      </div>
      <div>
        <p className="text-sm text-gray-700">요즘 일주일에 달리는 거리</p>
        <Chips options={KM_Q} value={km} onPick={(v) => { setKm(v); track("km", v); }} />
      </div>
      <div>
        <p className="text-sm text-gray-700">지난 12개월 안에 달리기 때문에 쉬어야 했던 부상이 있었나요?</p>
        <Chips
          options={[{ id: "yes" as const, label: "있었다" }, { id: "no" as const, label: "없었다" }]}
          value={injured}
          onPick={(v) => { setInjured(v); track("injured", v); }}
        />
      </div>
      <div>
        <p className="text-sm text-gray-700">지금 달릴 때 아픈 곳</p>
        <Chips options={PAIN_Q} value={pain} onPick={(v) => { setPain(v); track("pain", v); }} />
      </div>

      {(yq || sq || kq) && (
        <div className="rounded-xl border border-gray-200 bg-white p-4" aria-live="polite">
          <p className="text-xs font-semibold text-gray-700">참고 정의와 비교 (항목마다 따로)</p>
          <ul className="mt-1.5 space-y-0.5 text-sm text-gray-700">
            {yq && <li>경력 {yq.label} → {fitsLabel(yq.fits)}</li>}
            {sq && <li>주 {sq.label} → {fitsLabel(sq.fits)}</li>}
            {kq && <li>주 {kq.label} → {fitsLabel(kq.fits)}</li>}
          </ul>
          {overall && (
            <p className="mt-1.5 text-sm text-gray-900">
              종합(참고): <strong>{LEVEL_LABEL[overall]}</strong>
              <span className="text-xs text-gray-500"> — 경력 우선, 고수준은 세 가지가 모두 맞을 때만(저희 규칙)</span>
            </p>
          )}
          {axesDisagree && (
            <p className="mt-1 text-xs text-gray-500">
              항목끼리 가리키는 수준이 다릅니다. 이 정의는 범위가 겹치므로, 읽을 글은 위의 단계로 고르세요.
            </p>
          )}
          <p className="mt-1.5 text-xs text-gray-400">
            공인 분류는 없습니다. 신발 연구 전문가 합의에서 쓴 정의 — {HONERT_CITE}{" "}
            <a href={HONERT_HREF} target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
              ↗
            </a>
          </p>
        </div>
      )}

      {fastRamp && (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          경력 1년 미만인데 주간 거리가 참고 정의의 입문 범위(주 5~20km)보다 많습니다. 초보는 같은 시간을 달려도
          부상이 더 많았습니다 — Videbæk et al. (2015){" "}
          <a href="https://pubmed.ncbi.nlm.nih.gov/25951917/" target="_blank" rel="noopener noreferrer" className="underline">
            ↗
          </a>
          . 늘리는 속도는 <a href="#stage-to10k" className="underline">2단계</a>의 「110%」 기준을 보세요.
        </p>
      )}

      {injured === "yes" && (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          지난 12개월 안의 부상은 여러 연구에서 가장 일관된 위험 요인이었습니다 — Saragiotto et al. (2014){" "}
          <a href="https://pubmed.ncbi.nlm.nih.gov/24809248/" target="_blank" rel="noopener noreferrer" className="underline">
            ↗
          </a>
          . 다 나은 뒤 돌아오고, 복귀 첫 몇 주는 거리를 낮게 잡으세요(저희 제안) →{" "}
          <Link href="/injury/return-to-running" className="font-medium underline">부상 후 복귀</Link>
        </p>
      )}

      {pq?.href && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-900">
          먼저 <Link href={pq.href} className="font-medium underline">{pq.page}</Link> 글에서 멈춰야 하는 신호를 확인하세요.
          통증 때문에 걸음이 바뀌거나 쉬어도 낫지 않으면 진료를 받으세요. 이 도구는 진단이 아닙니다.
        </p>
      )}
    </div>
  );
}
