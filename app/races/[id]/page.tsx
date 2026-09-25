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
import RaceReactions from "@/components/RaceReactions";

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
      <dt className="w-24 shrink-0 font-medium text-gray-500">{label}</dt>
      <dd className="text-gray-800">{children}</dd>
    </div>
  );
}

/** 같은 달 다른 대회 — 페이지를 나가는 대신 옆으로 가게 */
function sameMonth(r: Race): Race[] {
  if (!r.date) return [];
  const month = r.date.slice(0, 7);
  const t = new Date(r.date).getTime();
  // 같은 달 중 날짜가 가까운 순 — 10/31 대회에서 10/3 대회가 먼저 나오지 않게
  return upcomingRaces()
    .filter((x) => x.id !== r.id && x.date?.startsWith(month))
    .sort((a, b) => Math.abs(new Date(a.date!).getTime() - t) - Math.abs(new Date(b.date!).getTime() - t))
    .slice(0, 4);
}

export default async function RaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = raceById(id);
  if (!r) notFound();

  const status = currentStatus(r);
  const d = daysUntil(r.date);
  const ended = d !== null && d < 0;
  const others = sameMonth(r);

  return (
    <>
      <BreadcrumbJsonLd trail={[["대회 일정", "/races"], [r.name, `/races/${r.id}`]]} />
      <article className="mx-auto max-w-2xl px-6 py-10 text-gray-800">
        <Link href="/races" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 대회 일정
        </Link>

        {/* 2026-09-17 단순화 — 제목·상태·공식 링크를 첫 화면에. 반복되는 날짜 줄·「준비하기」·「확인 못 한 것」 목록을 뺐다 */}
        <header className="mb-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <RaceStatusBadge status={ended ? "대회종료" : status} />
            {!ended && d !== null && (
              <span className="text-sm font-semibold text-emerald-700">{d === 0 ? "오늘" : `D-${d}`}</span>
            )}
          </div>
          <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900">{r.name}</h1>
          <RaceSourceCta race={r} />
        </header>

        {r.note && <p className="mb-6 rounded-xl bg-amber-50 p-3 text-sm leading-relaxed text-amber-900">{r.note}</p>}

        <dl className="mb-6 divide-y divide-gray-100 rounded-2xl border border-gray-200">
          <Row label="날짜">
            {r.date ? withWeekday(r.date) : "날짜 미정"}
            {r.startTime ? ` · ${r.startTime}` : ""}
          </Row>
          <Row label="장소">{r.venue ? `${r.region} · ${r.venue}` : r.region}</Row>
          {r.fees && r.fees.length > 0 ? (
            <Row label="종목·참가비">
              <ul className="space-y-0.5">
                {r.fees.map((f) => (
                  <li key={f.label}>
                    {f.label} <span className="text-gray-500">{f.krw.toLocaleString("ko-KR")}원</span>
                  </li>
                ))}
              </ul>
            </Row>
          ) : (
            <Row label="종목">{r.distancesKm.map(distanceLabel).join(" · ")}</Row>
          )}
          {(r.registrationStart || r.registrationEnd) && (
            <Row label="접수">
              {r.registrationStart ?? ""} ~ {r.registrationEnd ?? ""}
            </Row>
          )}
          {/* 2026-09-26 제한시간 — 요강에서 확인한 대회만. 비어 있으면 줄 자체를 안 그린다 */}
          {r.cutoff && <Row label="제한시간">{r.cutoff}</Row>}
          {r.capacity && <Row label="정원">{r.capacity}</Row>}
          {r.organizer && <Row label="주최">{r.organizer}</Row>}
        </dl>
        <p className="mb-10 text-xs text-gray-400">{r.checkedAt} 확인 · 코스·제한시간은 공식 홈페이지에서 확인하세요</p>

        {/* 2026-09-23 — 나가요 / 다녀왔어요. 근거·경위는 components/RaceReactions.tsx 주석 */}
        <RaceReactions raceId={r.id} ended={ended} distances={r.distancesKm.map(distanceLabel)} />

        {others.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 text-lg font-bold text-gray-900">같은 달 다른 대회</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {others.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/races/${o.id}`}
                    className="block h-full rounded-xl border border-gray-200 p-3 transition-colors hover:border-emerald-400"
                  >
                    <p className="font-semibold leading-snug text-gray-900">{o.name}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {o.date?.slice(5).replace("-", "/")} · {o.region} · {o.distancesKm.map(distanceLabel).join(" / ")}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <FinderCta
          from="race-detail"
          headline="대회 날 신을 신발 고르기"
          sub="키·체중·발 모양으로 1분 안에 3개를 골라드려요."
        />
      </article>
    </>
  );
}
