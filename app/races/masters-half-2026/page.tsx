import Link from "next/link";
import type { Metadata } from "next";
import RaceSourceCta from "@/components/RaceSourceCta";
import { ALL_RACES, distanceLabel } from "@/lib/races";

/**
 * 2026 마스터즈 하프 마라톤 — 상세 페이지 (2026-09-16, Cowork)
 *
 * 사실 확인: 2026-09-16 에 두 곳을 직접 열었다.
 *   · 공식 사이트 https://mastershalf.kr
 *   · KorMarathon https://www.kormarathon.com/ko/races/2026-masters-half-marathon
 *
 * ⚠️ 두 곳의 접수 마감이 다르다.
 *   · KorMarathon: 2026-09-21
 *   · 공식: "변경된 접수마감일 9월 27일(일) 까지 접수 가능합니다!"
 * → 공식 기준으로 적는다. KorMarathon 값을 그대로 옮겼으면 아직 접수가 되는 대회를
 *   닫힌 것처럼 안내했을 것이다 (MBN 서울마라톤 "마감" 표기와 같은 유형).
 *
 * 확인 못 한 것 — 지어내지 않고 본문에 "확인 못 함"으로 둔다:
 *   · 코스 경로 (공식 사이트에 코스 안내 문구 없음, 영상·지도 링크만 있음)
 *   · 종목별 제한시간, 시상 기준, 환불 조건
 *   · KorMarathon 의 "환불 9/13까지" — 공식 사이트 문구로는 확인 못 함
 */
const race = ALL_RACES.find((r) => r.id === "masters-half-2026")!;

const OFFICIAL_URL = "https://mastershalf.kr";

export const metadata: Metadata = {
  title: `${race.name} — 뛰다가 아메리카노`,
  description:
    "10월 3일(토) 상암 월드컵공원 평화광장 출발. 5km·10km·하프 참가비가 모두 같고, 공식 사이트 기준 접수는 9월 27일까지로 연장됐습니다.",
};

const FACTS: { label: string; value: string }[] = [
  { label: "일시", value: "2026년 10월 3일(토) 08:00 출발" },
  { label: "출발지", value: "상암 월드컵공원 평화광장 (서울 마포구)" },
  { label: "종목", value: "5km · 10km · 하프" },
  { label: "참가비", value: "50,000원 — 세 종목 모두 같음" },
  { label: "접수 마감", value: "9월 27일(일) — 공식 사이트 연장 공지 기준" },
  { label: "기념품", value: "기념 티셔츠(블랙/네이비 랜덤 발송), 메달(공식 사이트에 「준비중」), 간식" },
  { label: "주최", value: "(사)사회안전예방중앙회" },
  { label: "문의", value: "02-2636-6543 · start@mastershalf.kr · 카카오톡 문의" },
];

const UNKNOWN = ["코스 경로", "종목별 제한시간", "시상 기준", "환불 조건"];

export default function RacePage() {
  return (
    <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
      <Link href="/races" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
        ← 대회 일정
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">{race.name}</h1>
        <p className="text-gray-600 text-sm">
          {race.date} · {race.region} · {race.distancesKm.map(distanceLabel).join(" / ")}
        </p>
      </header>

      <p className="text-lg leading-relaxed mb-8 text-gray-700">
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
          2026-09-16 공식 사이트(mastershalf.kr)와 KorMarathon을 직접 열어 확인했습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">접수 마감이 두 곳에서 다르게 적혀 있어요</h2>
        <p className="leading-relaxed mb-4">
          일정 모음 사이트인 KorMarathon에는 접수 마감이 <strong>9월 21일</strong>로 적혀 있습니다.
          그런데 대회 공식 사이트에는 <strong>9월 27일(일)까지로 마감이 변경됐다</strong>는 공지가 올라와 있습니다.
        </p>
        <p className="leading-relaxed mb-4">
          이 페이지는 공식 사이트 기준으로 적었습니다. 모음 사이트는 대회 측 변경이 늦게 반영될 수 있으니,
          접수 직전에는{" "}
          <a
            href={OFFICIAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:underline"
          >
            공식 사이트
          </a>
          를 한 번 더 확인하세요.
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
            신발 찾기
          </Link>
          에서 1분이면 후보를 좁힐 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">확인 못 한 것</h2>
        <p className="leading-relaxed mb-3">
          아래 항목은 공식 사이트에서 구체적인 안내 문구를 찾지 못했습니다. 짐작으로 채우지 않았습니다.
        </p>
        <ul className="space-y-2 pl-4">
          {UNKNOWN.map((item) => (
            <li key={item} className="flex gap-2 text-gray-700">
              <span className="text-gray-400 shrink-0 mt-0.5">•</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
          특히 환불은 KorMarathon에 &quot;9월 13일까지&quot;로 적혀 있지만 공식 사이트 문구로는 확인하지 못했습니다.
          필요하면 대회 측 문의처로 직접 확인하세요.
        </p>
      </section>

      <RaceSourceCta race={race} />
    </article>
  );
}
