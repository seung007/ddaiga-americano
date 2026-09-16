import { currentStatus, raceLink, sourceKind, type Race } from "@/lib/races";

/** 접수가 끝난 대회에 「접수」 버튼을 달지 않는다 */
const LABEL_CLOSED = {
  공식: "대회 공식 사이트 ↗",
  접수대행: "접수 사이트 ↗",
  SNS: "주최 측 채널 ↗",
  모음: "대회 정보 (KorMarathon) ↗",
} as const;

const LABEL = {
  공식: "대회 공식 사이트에서 접수 ↗",
  접수대행: "접수 사이트에서 신청 ↗",
  SNS: "주최 측 채널에서 확인 ↗",
  모음: "대회 정보 (KorMarathon)에서 확인 ↗",
} as const;

/**
 * 대회 상세 페이지 맨 아래 접수처 링크.
 *
 * 2026-09-16: 주최 측 주소(`officialUrl`)가 있으면 그쪽을 먼저 보낸다.
 * 모음 사이트는 늦게 반영된다 — 마스터즈 하프는 KorMarathon 에 9/21 마감,
 * 공식 사이트에 9/27 연장으로 적혀 있었다.
 *
 * 접수 대행 사이트·인스타를 「공식 사이트」라고 부르지 않는다. 반만 맞는 말이 된다.
 * 주최 측 주소가 따로 있으면 **모음 페이지도 같이** 남긴다 — 둘을 비교할 수 있게.
 */
export default function RaceSourceCta({ race }: { race: Race }) {
  const main = raceLink(race);
  const showSource = main.url !== race.sourceUrl;
  const closed = currentStatus(race) === "마감";
  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={main.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            main.kind === "모음"
              ? "border border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
        >
          {(closed ? LABEL_CLOSED : LABEL)[main.kind]}
        </a>
        {showSource && (
          <a
            href={race.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 underline underline-offset-2 hover:text-gray-900"
          >
            {sourceKind(race.sourceUrl) === "모음" ? "KorMarathon 정보 ↗" : "출처 페이지 ↗"}
          </a>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-400">{race.checkedAt} 확인 · 접수 전 다시 확인하세요</p>
    </div>
  );
}
