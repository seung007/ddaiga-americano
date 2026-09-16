"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DisplayStatus, Race } from "@/lib/races";
import RaceStatusBadge from "@/components/RaceStatusBadge";

export type RaceItem = {
  race: Race;
  status: DisplayStatus;
  group: string;
  dday: number | null;
  distances: string;
};

const STATUS_FILTERS = ["전체", "접수중", "마감임박", "접수예정", "마감"] as const;
const GROUPS = ["전체", "수도권", "충청권", "강원권", "전라권", "경상권", "제주권"] as const;
const DISTANCES = ["전체", "5km", "10km", "하프", "풀코스", "기타"] as const;

function distanceClass(km: number): (typeof DISTANCES)[number] {
  if (Math.abs(km - 42.195) < 0.01) return "풀코스";
  if (Math.abs(km - 21.0975) < 0.01) return "하프";
  if (km === 10) return "10km";
  if (km <= 5) return "5km";
  return "기타";
}

function Chips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="w-10 shrink-0 text-xs font-medium text-gray-500">{label}</span>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          aria-pressed={value === o}
          className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
            value === o
              ? "border-emerald-500 bg-emerald-50 font-semibold text-emerald-700"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/**
 * 대회 목록 + 필터 (2026-09-16, 러닝라이프 벤치마킹)
 *
 * 필터 축은 러닝라이프와 같다 — 접수 상태 · 월 · 권역 · 거리.
 * 서버가 계산한 상태를 받는다. 클라이언트에서 날짜를 다시 계산하면 서버와 하루 어긋날 수 있다.
 */
export default function RaceFilterList({ items }: { items: RaceItem[] }) {
  const months = useMemo(() => {
    const set = new Set(items.map((i) => i.race.date?.slice(0, 7)).filter(Boolean) as string[]);
    return ["전체", ...[...set].sort()];
  }, [items]);

  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("전체");
  const [month, setMonth] = useState("전체");
  const [group, setGroup] = useState<(typeof GROUPS)[number]>("전체");
  const [dist, setDist] = useState<(typeof DISTANCES)[number]>("전체");

  const shown = items.filter((i) => {
    if (status === "접수중" && !(i.status === "접수중" || i.status === "마감임박")) return false;
    if (status !== "전체" && status !== "접수중" && i.status !== status) return false;
    if (month !== "전체" && !i.race.date?.startsWith(month)) return false;
    if (group !== "전체" && i.group !== group) return false;
    if (dist !== "전체" && !i.race.distancesKm.some((k) => distanceClass(k) === dist)) return false;
    return true;
  });

  return (
    <>
      <div className="mt-8 space-y-2 rounded-2xl border border-gray-200 p-4">
        <Chips label="상태" options={STATUS_FILTERS} value={status} onChange={setStatus} />
        <Chips
          label="월"
          options={months}
          value={month}
          onChange={setMonth}
        />
        <Chips label="지역" options={GROUPS} value={group} onChange={setGroup} />
        <Chips label="거리" options={DISTANCES} value={dist} onChange={setDist} />
      </div>

      <p className="mt-4 text-sm text-gray-600">
        <strong>{shown.length}개</strong> 대회
      </p>

      {shown.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
          조건에 맞는 대회가 없습니다. 필터를 하나 풀어 보세요.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {shown.map(({ race: r, status: s, dday, distances }) => (
            <li key={r.id}>
              <Link
                href={`/races/${r.id}`}
                className="block rounded-2xl border border-gray-200 p-5 transition-colors hover:border-emerald-400"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-bold text-gray-900">{r.name}</h3>
                  <RaceStatusBadge status={s} />
                </div>
                <p className="mt-1.5 text-sm text-gray-700">
                  {r.date ? (
                    <>
                      <strong>{r.date}</strong>
                      {dday !== null && dday >= 0 && (
                        <span className="ml-1.5 text-emerald-700">{dday === 0 ? "오늘" : `D-${dday}`}</span>
                      )}
                    </>
                  ) : (
                    <span className="text-amber-700">날짜 미정</span>
                  )}
                  <span className="mx-1.5 text-gray-300">·</span>
                  {r.venue ? `${r.region} · ${r.venue}` : r.region}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {distances}
                  {r.registrationEnd && s !== "마감" && (
                    <>
                      <span className="mx-1.5 text-gray-300">·</span>
                      접수 ~{r.registrationEnd.slice(5).replace("-", "/")}
                    </>
                  )}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
