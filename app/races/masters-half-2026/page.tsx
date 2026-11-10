import Link from "next/link";
import type { Metadata } from "next";
import RaceSourceCta from "@/components/RaceSourceCta";
import { ALL_RACES, daysUntil, distanceLabel } from "@/lib/races";
import RaceReactions from "@/components/RaceReactions";

/**
 * 2026 마스터즈 하프 마라톤 — 글로 더한 상세 페이지 (정적 경로가 `[id]` 템플릿보다 우선)
 *
 * 2026-09-16 공식 사이트(mastershalf.kr) 확인. 공식 공지로 접수 마감이 9/27 로 연장됐다.
 * 2026-09-17: 일정 모음 사이트와 비교하던 문단·「확인 못 한 것」 목록을 뺐다(공식 홈페이지만 기준 — hyun 님).
 */
const found = ALL_RACES.find((r) => r.id === "masters-half-2026");
// 못 찾으면 빌드를 멈추되 **이유를 적는다** — 2026-10-04 에 `undefined.name` 한 줄로만 실패해 원인을 찾는 데 시간이 걸렸다
if (!found) throw new Error("masters-half-2026 이 lib/races.json · lib/races.past.json 어디에도 없음 — 이 정적 페이지를 지우거나 데이터를 되돌릴 것");
const race = found;


/**
 * 2026-11-06: `revalidate = 21600` 을 뺐다. 「하루 네 번 다시 만든다」고 적어 뒀지만 실제로는
 * 6시간이 지난 뒤 **첫 방문자에게 옛 화면을 주고** 그 뒤에 다시 만든다(방문이 드물면 며칠 전 화면).
 * 미리보기 홈에서 11/6 에 「11/05 마감 · 오늘 마감」이 실제로 떴다. 마감이 지난 대회를 「오늘 마감」으로 보이는 건 틀린 정보라
 * 날짜로 계산하는 페이지는 요청마다 그린다. 방문이 월 수백 건이라 서버 부담은 작다.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${race.name} — 뛰다가 아메리카노`,
  description:
    "10월 3일(토) 상암 월드컵공원 평화광장 출발. 5km·10km·하프 참가비가 모두 같고, 접수는 9월 27일까지로 연장됐습니다.",
};

const FACTS: { label: string; value: string }[] = [
  { label: "일시", value: "2026년 10월 3일(토) 08:00 출발" },
  { label: "출발지", value: "상암 월드컵공원 평화광장 (서울 마포구)" },
  { label: "종목", value: "5km · 10km · 하프" },
  { label: "참가비", value: "50,000원 — 세 종목 모두 같음" },
  { label: "접수 마감", value: "9월 27일(일) — 연장됨" },
  { label: "기념품", value: "기념 티셔츠(블랙/네이비 랜덤 발송), 메달(공식 사이트에 「준비중」), 간식" },
  { label: "주최", value: "(사)사회안전예방중앙회" },
  { label: "문의", value: "02-2636-6543 · start@mastershalf.kr · 카카오톡 문의" },
];


export default function RacePage() {
  return (
    <main>
    <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
      <Link href="/races" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
        ← 대회 일정
      </Link>

      <header className="mb-8">
        <h1 className="text-[32px] tracking-[-0.5px] md:text-[40px] font-black text-gray-900 leading-tight mb-4">{race.name}</h1>
        <p className="text-gray-600 text-sm">
          {race.date} · {race.region} · {race.distancesKm.map(distanceLabel).join(" / ")}
        </p>
        <div className="mt-4">
          <RaceSourceCta race={race} />
        </div>
      </header>

      <p className="text-base leading-relaxed mb-8 text-gray-700">
        개천절 아침, 상암 월드컵공원에서 출발하는 대회입니다. 5km부터 하프까지 세 종목이 있고
        <strong> 참가비가 종목과 상관없이 같습니다.</strong>
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">한눈에 보기</h2>
        <dl className="divide-y divide-gray-100 rounded-2xl border border-gray-200">
          {FACTS.map((f) => (
            <div key={f.label} className="flex gap-4 px-4 py-3 text-sm">
              <dt className="w-20 shrink-0 font-medium text-gray-500">{f.label}</dt>
              <dd className="text-gray-800">{f.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-xs text-gray-400">
          2026-09-16 공식 홈페이지 확인 · 코스·제한시간은 공식 홈페이지에서 확인하세요
        </p>
      </section>


      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">종목은 가격 말고 거리로 고르세요</h2>
        <p className="leading-relaxed mb-4">
          세 종목 참가비가 같으면 &quot;같은 돈이면 긴 거리&quot;로 마음이 기울기 쉽습니다.
          하지만 참가비가 같다는 건 거리를 고를 이유가 아닙니다.
          기준은 <strong>대회 전에 연습으로 끝까지 뛰어 본 거리</strong>로 두세요.
        </p>
        <p className="leading-relaxed mb-4">
          목표 기록이 있다면{" "}
          <Link href="/tools/pace" className="text-emerald-600 hover:underline">
            페이스 계산기
          </Link>
          로 km당 페이스를 먼저 확인해 보세요. 대회용 신발이 고민이면{" "}
          <Link href="/shoe-finder" className="text-emerald-600 hover:underline">
            나에게 맞는 신발 찾기
          </Link>
          에서 질문 8개로 후보를 좁힐 수 있습니다.
        </p>
      </section>

      {/* 2026-09-23 — 나가요 / 다녀왔어요. `ended` 가 날짜로 바뀌어야 해서 아래 revalidate 를 같이 넣음 */}
      <RaceReactions
        raceId={race.id}
        ended={(daysUntil(race.date) ?? 0) < 0}
        distances={race.distancesKm.map(distanceLabel)}
      />
    </article>
    </main>
  );
}
