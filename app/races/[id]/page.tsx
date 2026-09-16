import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ALL_RACES,
  currentStatus,
  daysUntil,
  distanceLabel,
  raceById,
  upcomingRaces,
  type Race,
} from "@/lib/races";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import RaceSourceCta from "@/components/RaceSourceCta";
import RaceStatusBadge from "@/components/RaceStatusBadge";
import FinderCta from "@/components/FinderCta";

/**
 * 대회 상세 — **템플릿 하나로 전 대회** (2026-09-16)
 *
 * 처음 계획은 대회마다 `app/races/{id}/page.tsx` 를 손으로 쓰는 것이었다(서울 24건).
 * 러닝라이프가 정보표 + 참가비 + 같은 달 대회 + 공식 링크만으로 161건을 덮는 것을 보고 바꿨다.
 * 손으로 쓰면 몇 주 걸리고, 그동안 나머지 대회는 계속 밖으로 나간다.
 *
 * 글로 더할 게 있는 대회는 **정적 폴더가 이 템플릿보다 우선**한다
 * (`app/races/masters-half-2026/page.tsx`).
 *
 * 러닝라이프와 다르게 하는 것 — 「주최 미정」「후원사 미정」으로 칸을 채우지 않는다.
 * 모르는 것은 맨 아래 「확인 못 한 것」에 모은다.
 */

/** 글로 따로 쓴 정적 폴더가 있는 대회는 여기서 만들지 않는다 — 같은 주소를 두 번 만들지 않게 */
export function generateStaticParams() {
  return ALL_RACES.filter((r) => !existsSync(join(process.cwd(), "app", "races", r.id, "page.tsx"))).map(
    (r) => ({ id: r.id })
  );
}

export const dynamicParams = false;

/** 접수 상태·D-day 를 날짜로 계산하므로 하루 네 번 다시 만든다 */
export const revalidate = 21600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const r = raceById(id);
  if (!r) return {};
  const bits = [
    r.date ? `${r.date}` : null,
    r.venue ?? r.region,
    r.distancesKm.map(distanceLabel).join("·"),
  ].filter(Boolean);
  return {
    title: `${r.name} — 일정·참가비·접수 | 뛰다가 아메리카노`,
    description: `${bits.join(" · ")}. 접수 기간과 참가비를 확인 날짜와 출처를 붙여 정리했습니다.`,
    alternates: { canonical: `/races/${r.id}` },
  };
}

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];
function withWeekday(iso: string): string {
  return `${iso} (${WEEKDAY[new Date(iso + "T00:00:00Z").getUTCDay()]})`;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 px-4 py-3 text-sm">
      <dt className="w-20 shrink-0 font-medium text-gray-500">{label}</dt>
      <dd className="text-gray-800">{children}</dd>
    </div>
  );
}

/** 같은 달 다른 대회 — 페이지를 나가는 대신 옆으로 가게 */
function sameMonth(r: Race): Race[] {
  if (!r.date) return [];
  const month = r.date.slice(0, 7);
  return upcomingRaces()
    .filter((x) => x.id !== r.id && x.date?.startsWith(month))
    .slice(0, 4);
}

export default async function RaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = raceById(id);
  if (!r) notFound();

  const status = currentStatus(r);
  const d = daysUntil(r.date);
  const ended = d !== null && d < 0;
  const factsLabel = r.factsFrom === "공식" ? "대회 공식 사이트 기준" : "KorMarathon 기준";

  const unknown = [
    !r.startTime && "출발 시간",
    !r.venue && "출발지",
    !r.registrationEnd && !r.note && "접수 마감일",
    !r.fees?.length && "참가비",
    !r.organizer && "주최",
    "코스 경로 · 제한시간 · 기념품",
  ].filter(Boolean) as string[];

  const longest = Math.max(...r.distancesKm);
  const others = sameMonth(r);

  return (
    <>
      <BreadcrumbJsonLd trail={[["대회 일정", "/races"], [r.name, `/races/${r.id}`]]} />
      <article className="mx-auto max-w-2xl px-6 py-12 text-gray-800">
        <Link href="/races" className="mb-6 inline-block text-sm text-emerald-600 hover:underline">
          ← 대회 일정
        </Link>

        <header className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <RaceStatusBadge status={ended ? "대회종료" : status} />
            {!ended && d !== null && (
              <span className="text-sm font-semibold text-emerald-700">{d === 0 ? "오늘" : `D-${d}`}</span>
            )}
          </div>
          <h1 className="mb-3 text-3xl font-bold leading-tight text-gray-900">{r.name}</h1>
          <p className="text-sm text-gray-600">
            {r.date ? withWeekday(r.date) : "날짜 미정"} · {r.region} ·{" "}
            {r.distancesKm.map(distanceLabel).join(" / ")}
          </p>
        </header>

        {ended && (
          <p className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            이미 끝난 대회입니다. 내년 일정은 아직 확인하지 못했습니다.
          </p>
        )}

        {r.note && (
          <p className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
            {r.note}
          </p>
        )}

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-gray-900">대회 정보</h2>
          <dl className="divide-y divide-gray-100 rounded-2xl border border-gray-200">
            <Row label="개최일">{r.date ? withWeekday(r.date) : "날짜 미정"}</Row>
            {r.startTime && <Row label="출발">{r.startTime}</Row>}
            {r.venue && <Row label="출발지">{r.venue}</Row>}
            {(r.registrationStart || r.registrationEnd) && (
              <Row label="접수">
                {r.registrationStart ?? ""} ~ {r.registrationEnd ?? "마감일 확인 못 함"}
              </Row>
            )}
            {r.capacity && <Row label="정원">{r.capacity}</Row>}
            {r.organizer && <Row label="주최">{r.organizer}</Row>}
          </dl>
        </section>

        {r.fees && r.fees.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-gray-900">종목별 참가비</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {r.fees.map((f) => (
                <li
                  key={f.label}
                  className="flex items-baseline justify-between rounded-xl border border-gray-200 px-4 py-3"
                >
                  <span className="font-semibold text-gray-900">{f.label}</span>
                  <span className="text-gray-800">{f.krw.toLocaleString("ko-KR")}원</span>
                </li>
              ))}
            </ul>
            {/* 모음 사이트 값이 공식과 다른 사례가 이미 두 건이다(산불조심 참가비, 중랑 출발 시간). 숨기지 않는다. */}
            <p className="mt-2 text-xs text-gray-400">
              {factsLabel} · {r.checkedAt} 확인. 할인·옵션 요금은 빠져 있습니다.
            </p>
          </section>
        )}

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-gray-900">준비하기</h2>
          <div className="flex flex-col gap-2 text-sm">
            {longest >= 21 ? (
              <Link href="/injury/half-marathon-race-day" className="text-emerald-600 hover:underline">
                하프 대회 당일 체크리스트 →
              </Link>
            ) : (
              <Link href="/injury/first-10k" className="text-emerald-600 hover:underline">
                첫 10km 준비물과 페이스 전략 →
              </Link>
            )}
            <Link href="/tools/pace" className="text-emerald-600 hover:underline">
              목표 기록으로 km당 페이스 계산 →
            </Link>
            <Link href="/tier-list" className="text-emerald-600 hover:underline">
              내 수준에 맞는 러닝화 칸 →
            </Link>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-gray-900">확인 못 한 것</h2>
          <p className="mb-2 text-sm text-gray-600">짐작으로 채우지 않았습니다. 접수처에서 확인하세요.</p>
          <ul className="space-y-1 pl-4 text-sm text-gray-700">
            {unknown.map((u) => (
              <li key={u} className="flex gap-2">
                <span className="mt-0.5 shrink-0 text-gray-400">•</span>
                {u}
              </li>
            ))}
          </ul>
        </section>

        <RaceSourceCta race={r} />

        {others.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-3 text-xl font-bold text-gray-900">같은 달 다른 대회</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {others.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/races/${o.id}`}
                    className="block h-full rounded-xl border border-gray-200 p-4 transition-colors hover:border-emerald-400"
                  >
                    <p className="font-bold leading-snug text-gray-900">{o.name}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {o.date} · {o.region} · {o.distancesKm.map(distanceLabel).join(" / ")}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-10">
          <FinderCta
            from="race-detail"
            headline="대회 날 신을 신발, 지금 신는 것과 달라야 할 수도 있습니다"
            sub="거리·목표·부상 이력을 넣으면 조건에 맞는 3개를 골라드려요."
          />
        </div>
      </article>
    </>
  );
}
