import { sourceKind } from "@/lib/races";

/**
 * 대회 상세 페이지 맨 아래에 붙이는 접수처 링크.
 *
 * 2026-09-16: 상세 페이지는 kormarathon 내용을 우리 글로 옮긴 것이지 접수처가 아니다.
 * 실제 접수/최신 확인은 여기서 출처로 내보낸다 — `/races` 카드와 같은 원칙
 * (출처가 공식인지 모음인지 라벨로 구분해서 보여준다).
 */
export default function RaceSourceCta({
  sourceUrl,
  checkedAt,
}: {
  sourceUrl: string;
  checkedAt: string;
}) {
  const kind = sourceKind(sourceUrl);
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
          kind === "공식"
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "border border-gray-300 bg-white text-gray-700 hover:border-gray-400"
        }`}
      >
        {kind === "공식" ? "대회 공식 사이트에서 접수 ↗" : "대회 정보 (KorMarathon)에서 접수 ↗"}
      </a>
      <span className="text-xs text-gray-400">{checkedAt} 확인 · 접수 전 다시 확인하세요</span>
    </div>
  );
}
