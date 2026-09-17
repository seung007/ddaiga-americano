import type { Metadata } from "next";
import Link from "next/link";
import { upcomingRaces, daysUntil, distanceLabel, currentStatus, regionGroup } from "@/lib/races";
import RaceFilterList, { type RaceItem } from "@/components/RaceFilterList";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import FinderCta from "@/components/FinderCta";

/**
 * 마라톤 대회 일정 — **재방문을 만드는 축.**
 *
 * 신발은 1년에 한 번 사지만 대회는 계속 찾는다.
 * 자세한 설계 의도는 `lib/races.ts` 주석에.
 *
 * ⚠️ 이 페이지는 **데이터가 비어 있어도 정상 동작해야 한다.**
 * 아직 등록된 대회가 0건인 상태로 배포된다. 빈 화면에 "준비 중"만 띄우면
 * 방문자가 고장으로 읽으므로, **왜 비어 있고 무엇을 대신 볼 수 있는지** 적는다.
 */

const PAGE_URL = "https://ddaiga-americano.vercel.app/races";

export const metadata: Metadata = {
  title: "2026 마라톤 대회 일정 — 10·11월 접수중 대회 정리 | 뛰다가 아메리카노",
  description:
    "전국 마라톤·러닝 대회 일정을 접수 상태·참가비와 함께 정리하고, 대회 공식 홈페이지로 바로 연결합니다.",
  alternates: { canonical: "/races" },
};

/** 접수 상태를 날짜로 계산하므로, 빌드 때 값에 굳지 않게 하루 네 번 다시 만든다 (2026-09-16) */
export const revalidate = 21600;

export default function RacesPage() {
  const races = upcomingRaces();
  const items: RaceItem[] = races.map((r) => ({
    race: r,
    status: currentStatus(r),
    group: regionGroup(r.region),
    dday: daysUntil(r.date),
    distances: r.distancesKm.map(distanceLabel).join(" / "),
  }));

  return (
    <>
      <BreadcrumbJsonLd trail={[["대회 일정", "/races"]]} />
      <main className="mx-auto max-w-3xl px-6 py-12 text-gray-800">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">마라톤 대회 일정</h1>
        {/* 2026-09-17: 설명 문단과 노란 경고 상자를 한 줄로. 출처 설명은 화면에서 뺐다(공식 홈페이지만 링크) */}
        <p className="mt-2 text-sm text-gray-500">접수 상태는 날짜에 맞춰 바뀝니다. 신청 전 공식 홈페이지를 한 번 더 확인하세요.</p>

        {races.length === 0 ? (
          /* 빈 상태 — "준비 중"만 띄우면 고장으로 읽힌다. 이유와 대안을 적는다. */
          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <p className="font-semibold text-gray-900">아직 등록된 대회가 없습니다</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              일정은 <strong>접수처를 직접 열어 확인한 것만</strong> 올립니다. 다른 곳의 목록을
              그대로 복제하면 빨리 채울 수 있지만, 그건 저희가 확인한 정보가 아닙니다.
              날짜가 틀리면 참가비와 시간이 날아갑니다.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              그동안 대회 준비에 도움이 될 글을 모아 뒀습니다.
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <Link href="/injury/first-10k" className="text-emerald-600 hover:underline">
                첫 10km 준비물과 페이스 전략 →
              </Link>
              <Link
                href="/injury/half-marathon-race-day"
                className="text-emerald-600 hover:underline"
              >
                하프 대회 당일 체크리스트 →
              </Link>
              <Link href="/tools/pace" className="text-emerald-600 hover:underline">
                목표 기록 · 구간 통과 시간 계산 →
              </Link>
            </div>
          </div>
        ) : (
          <RaceFilterList items={items} />
        )}

        <div className="mt-10">
          <FinderCta
            from="races"
            headline="대회 날 신을 신발, 지금 신는 것과 달라야 할 수도 있습니다"
            sub="거리·목표·부상 이력을 넣으면 조건에 맞는 3개를 골라드려요."
          />
        </div>
      </main>
    </>
  );
}
