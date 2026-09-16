import type { Shoe, ShoeUse, StabilityType } from "./types";
import VERIFIED from "./verified.json";

/** 러닝화 화면 공용 라벨 — `/shoes` 목록·상세가 같이 쓴다 (2026-09-16) */
export const USE_KO: Record<ShoeUse, string> = { daily: "데일리", long: "장거리", tempo: "템포", racing: "레이싱" };
export const STABILITY_KO: Record<StabilityType, string> = { neutral: "중립", stability: "안정화", motion_control: "모션컨트롤" };

/** 쿠셔닝 5단계 → 사람 말. 1–2 가벼움 / 3 보통 / 4–5 푹신 */
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
