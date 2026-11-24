import type { Shoe, ShoeUse, StabilityType } from "./types";
import VERIFIED from "./verified.json";

/** 러닝화 화면 공용 라벨 — `/shoes` 목록·상세가 같이 쓴다 (2026-09-16) */
export const USE_KO: Record<ShoeUse, string> = { daily: "데일리", long: "장거리", tempo: "템포", racing: "레이싱" };
export const STABILITY_KO: Record<StabilityType, string> = { neutral: "중립", stability: "안정화", motion_control: "모션컨트롤" };

/** 쿠셔닝 5단계 → 사람 말. 1–2 가벼움 / 3 보통 / 4–5 푹신 */
/** 공식 페이지에 값이 없을 때 화면에 쓰는 말 (2026-11-23) — 지어내지 않고 없다고 적는다 */
export const NO_SPEC = "공식 표기 없음";

/** 밑창 두께 — 없으면 「공식 표기 없음」 */
export function stackText(s: { stackHeightMm?: number }): string {
  return s.stackHeightMm != null ? `${s.stackHeightMm}mm` : NO_SPEC;
}

/** 쿠션 — 1~5 단계가 있으면 「3/5」, 없으면 브랜드 표기 원문(「높음(온 표기)」), 그것도 없으면 「공식 표기 없음」 */
export function cushionText(s: { cushioning?: number; cushionLabel?: string }): string {
  return s.cushioning != null ? `${s.cushioning}/5` : (s.cushionLabel ?? NO_SPEC);
}

export function cushionKo(level: number): "가벼움" | "보통" | "푹신" {
  if (level <= 2) return "가벼움";
  if (level === 3) return "보통";
  return "푹신";
}

/** 넓은 발볼 옵션(2E·4E)이 있나 */
export function hasWide(s: Shoe): boolean {
  return s.widthOptions.some((w) => w === "2E" || w === "4E");
}

/** 스펙을 사람이 마지막으로 확인한 날. 원장은 `verified.json` */
export function verifiedAt(id: string): string | null {
  return (VERIFIED as Record<string, string>)[id] ?? null;
}

export function won(n: number): string {
  return `${n.toLocaleString("ko-KR")}원`;
}
