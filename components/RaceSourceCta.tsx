import { currentStatus, raceLink, type Race } from "@/lib/races";

const LABEL = {
  공식: "공식 홈페이지",
  접수대행: "접수 페이지",
  SNS: "주최 측 채널",
  접수폼: "신청서",
} as const;

/**
 * 대회 공식 링크 버튼 (2026-09-17 단순화)
 *
 * hyun 님 결정: **공식 홈페이지만.** 일정 모음 사이트(KorMarathon) 링크·출처 라벨을 전부 뺐다.
 * 버튼은 상세 페이지 **정보표 바로 위**에 한 번만 둔다 — 스크롤해서 찾게 하지 않는다.
 * 공식 링크를 못 찾은 대회는 버튼을 그리지 않는다(다른 사이트로 대신 보내지 않는다).
 */
export default function RaceSourceCta({ race }: { race: Race }) {
  const link = raceLink(race);
  if (!link) return null;
  const open = currentStatus(race) !== "마감";
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
    >
      {LABEL[link.kind]}
      {open ? "에서 신청" : ""} ↗
    </a>
  );
}
