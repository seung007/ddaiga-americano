import type { DisplayStatus } from "@/lib/races";

const STYLE: Record<string, string> = {
  접수중: "bg-emerald-100 text-emerald-800 border-emerald-200",
  마감임박: "bg-red-100 text-red-700 border-red-200",
  접수예정: "bg-blue-100 text-blue-800 border-blue-200",
  마감: "bg-gray-100 text-gray-600 border-gray-200",
  예정: "bg-amber-100 text-amber-800 border-amber-200",
  대회종료: "bg-gray-100 text-gray-500 border-gray-200",
};

/** 대회 접수 상태 배지 — 목록·상세·홈이 같은 색을 쓰게 한 곳에 둔다 */
export default function RaceStatusBadge({ status }: { status: DisplayStatus | "대회종료" }) {
  return (
    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold ${STYLE[status] ?? STYLE["예정"]}`}>
      {status}
    </span>
  );
}
