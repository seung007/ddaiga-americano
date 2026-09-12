import type { Metadata } from "next";
import Link from "next/link";
import { upcomingRaces, daysUntil, distanceLabel, sourceKind, type Race } from "@/lib/races";
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
    "전국 마라톤·러닝 대회 일정을 접수 상태와 함께 정리했습니다. 각 대회의 확인 날짜와 출처를 그대로 표시합니다.",
  alternates: { canonical: "/races" },
};

const STATUS_STYLE: Record<string, string> = {
  접수중: "bg-emerald-100 text-emerald-800 border-emerald-200",
  접수예정: "bg-blue-100 text-blue-800 border-blue-200",
  마감: "bg-gray-100 text-gray-600 border-gray-200",
  예정: "bg-amber-100 text-amber-800 border-amber-200",
};

function RaceCard({ r }: { r: Race }) {
  const d = daysUntil(r.date);
  return (
    <li className="rounded-2xl border border-gray-200 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-bold text-gray-900">{r.name}</h3>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold ${
            STATUS_STYLE[r.status] ?? STATUS_STYLE["예정"]
          }`}
        >
          {r.status}
        </span>
      </div>

      <p className="mt-1.5 text-sm text-gray-700">
        {r.date ? (
          <>
            <strong>{r.date}</strong>
            {d !== null && d >= 0 && (
              <span className="ml-1.5 text-emerald-700">
                {d === 0 ? "오늘" : `D-${d}`}
              </span>
            )}
          </>
        ) : (
          /* 날짜를 모르면 모른다고 쓴다. 그럴듯한 달을 적지 않는다. */
          <span className="text-amber-700">날짜 미정</span>
        )}
        <span className="mx-1.5 text-gray-300">·</span>
        {r.region}
        <span className="mx-1.5 text-gray-300">·</span>
        {r.distancesKm.map(distanceLabel).join(" / ")}
      </p>

      {r.note && <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{r.note}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        {/* 공식이냐 모음이냐를 **버튼 글자에 담는다.** 눌러보고 알게 하지 않는다. */}
        <a
          href={r.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            sourceKind(r.sourceUrl) === "공식"
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "border border-gray-300 text-gray-700 hover:border-gray-400"
          }`}
        >
          {sourceKind(r.sourceUrl) === "공식" ? "대회 공식 사이트 ↗" : "대회 정보 (KorMarathon) ↗"}
        </a>
        {/* 언제 확인했는지를 숨기지 않는다 — 이 값이 신뢰의 전부다. */}
        <span className="text-xs text-gray-400">{r.checkedAt} 확인</span>
      </div>
    </li>
  );
}

export default function RacesPage() {
  const races = upcomingRaces();

  return (
    <>
      <BreadcrumbJsonLd trail={[["대회 일정", "/races"]]} />
      <main className="mx-auto max-w-3xl px-6 py-12 text-gray-800">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">마라톤 대회 일정</h1>
        <p className="mt-3 leading-relaxed text-gray-600">
          <strong>{races.length}개 대회</strong>를 확인한 날짜와 함께 싣습니다.
          대부분은 일정 모음 사이트 <strong>KorMarathon</strong> 에서 확인했고, 일부는
          대회 공식 사이트에서 직접 확인했습니다 — <strong>버튼에 어느 쪽인지 적어
          뒀습니다.</strong>
        </p>

        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          <strong>접수 전에 대회 공식 사이트에서 한 번 더 확인하세요.</strong> 일정과 접수
          기간은 주최 측 사정으로 바뀝니다. 저희는 확인한 날짜까지만 보증할 수 있고,{" "}
          <strong>그 뒤의 변경은 알 수 없습니다.</strong> 실제로 MBN 서울마라톤은 모음
          사이트에 &ldquo;마감&rdquo;으로 돼 있었지만 공식 사이트에는 추가 접수가 열려
          있었습니다.
        </div>

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
          <ul className="mt-8 space-y-3">
            {races.map((r) => (
              <RaceCard key={r.id} r={r} />
            ))}
          </ul>
        )}

        <h2 className="mt-12 text-xl font-bold text-gray-900">대회 정하고 나면</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href="/tier-list" className="text-emerald-600 hover:underline">
            내 수준에 맞는 러닝화 칸 →
          </Link>
          <Link href="/courses" className="text-emerald-600 hover:underline">
            한강 러닝 코스 4곳 →
          </Link>
          <Link href="/injury" className="text-emerald-600 hover:underline">
            부상 없이 준비하기 →
          </Link>
        </div>

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
