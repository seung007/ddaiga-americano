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

  /**
   * 정렬 — **마감된 대회는 맨 아래로.** (2026-09-22)
   *
   * 전에는 대회 날짜순이라 목록 **첫 카드가 「마감」**이었다(2026-09-22 배포본 실측:
   * 1위 천사데이 마라톤 = 마감). 55개 중 17개가 이미 마감인데 날짜가 빨라서 위로 올라온다.
   *
   * 이 페이지에 오는 사람의 용건은 **"지금 신청할 수 있는 게 뭔가"** 다.
   * 못 내는 대회를 먼저 보여주면 그 용건을 방해한다.
   *
   * **숨기지는 않는다.** 마감된 대회도 정보로서 값이 있고(내년 참고·코스 확인),
   * 이 저장소는 지난 정보를 지우지 않고 거르는 쪽을 택해 왔다(`lib/races.ts` 주석).
   * 그래서 순서만 뒤로 민다.
   *
   * `sort` 는 안정 정렬이라 **같은 묶음 안에서는 원래의 날짜순이 유지된다.**
   */
  const shown = items
    .filter((i) => {
      if (status === "접수중" && !(i.status === "접수중" || i.status === "마감임박")) return false;
      if (status !== "전체" && status !== "접수중" && i.status !== status) return false;
      if (month !== "전체" && !i.race.date?.startsWith(month)) return false;
      if (group !== "전체" && i.group !== group) return false;
      if (dist !== "전체" && !i.race.distancesKm.some((k) => distanceClass(k) === dist)) return false;
      return true;
    })
    .sort((a, b) => (a.status === "마감" ? 1 : 0) - (b.status === "마감" ? 1 : 0));

  /** 마감 7일 이내(`currentStatus` 가 「마감임박」으로 계산한 것) */
  const closingSoon = items.filter((i) => i.status === "마감임박").length;

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

      {/**
        * 마감 임박 바로가기 (2026-09-22)
        *
        * 55개 중 **33개가 9월 안에 접수를 닫는다**(`lib/races.json` 기준: 9월 33 · 10월 19 · 11월 2).
        * 그런데 목록에서는 「마감임박」 배지가 카드 안에 흩어져 있어, 몇 개가 급한지 세어 봐야 안다.
        *
        * 필터를 하나 더 만들지 않고 **이미 있는 상태 필터를 눌러 주는 버튼**으로 둔다.
        * 0건이면 렌더하지 않는다 — 빈 박스를 만들지 않는다.
        */}
      {closingSoon > 0 && status !== "마감임박" && (
        <button
          type="button"
          onClick={() => setStatus("마감임박")}
          className="mt-4 flex w-full items-center justify-between rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-left transition-colors hover:border-amber-400"
        >
          <span className="text-sm font-semibold text-amber-900">
            일주일 안에 접수가 닫히는 대회 {closingSoon}개
          </span>
          <span className="shrink-0 text-sm text-amber-700">먼저 보기 →</span>
        </button>
      )}

      <p className="mt-4 text-sm text-gray-600">
        <strong>{shown.length}개</strong> 대회
        {status === "전체" && (
          <span className="text-gray-400"> · 마감된 대회는 아래쪽에 있습니다</span>
        )}
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
