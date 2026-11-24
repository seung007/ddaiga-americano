import type { Shoe, ShoeUse, Softness, StabilityType } from "./types";
import VERIFIED from "./verified.json";

/** 러닝화 화면 공용 라벨 — `/shoes` 목록·상세가 같이 쓴다 (2026-09-16) */
export const USE_KO: Record<ShoeUse, string> = { daily: "데일리", long: "장거리", tempo: "템포", racing: "레이싱" };
export const STABILITY_KO: Record<StabilityType, string> = { neutral: "중립", stability: "안정화", motion_control: "모션컨트롤" };

/** 값을 못 찾은 칸 (2026-11-24) — 화면에는 설명 없이 「—」만 */
export const NONE = "—";

/**
 * ── 신발 스펙 말 — 화면 전체가 여기서만 가져간다 (2026-11-24 hyun 님 확정) ──────────────
 * 쓰는 말: 밑창 두께 · 푹신함 · 앞뒤 굽 차이 · 무게. 용어 통일표: docs/운영/가이드_문장_규칙.md 3절
 *
 * 밑창 두께 구간 — 35mm 이하 얇은 편 / 36~40mm 중간 / 41mm 이상 두꺼운 편
 *   35: RunRepeat 이 잰 신발 전체의 평균 뒤꿈치 두께 35.6mm(2026-11-24 확인, runrepeat.com 신발 페이지 「Heel stack … 35.6 mm」)
 *   40: 세계육상연맹 도로 경기 신발 규정 「The sole must be no thicker than 40mm」(2020-01-31,
 *       https://worldathletics.org/news/press-release/modified-rules-shoes)
 * 푹신함 — RunRepeat 의 Soft · Balanced · Firm 그대로(lib/shoes/specs.ts)
 */
export type Thickness = "thin" | "mid" | "thick";
export const THICK_KO: Record<Thickness, string> = { thin: "얇은 편", mid: "중간", thick: "두꺼운 편" };
export const SOFT_KO: Record<Softness, string> = { soft: "푹신한 편", balanced: "중간", firm: "단단한 편" };
export const THICK_ORDER: Thickness[] = ["thin", "mid", "thick"];
export const SOFT_ORDER: Softness[] = ["soft", "balanced", "firm"];

export function thicknessOf(mm?: number): Thickness | undefined {
  if (mm == null) return undefined;
  if (mm <= 35) return "thin";
  if (mm <= 40) return "mid";
  return "thick";
}

/**
 * 한 줄 문장 — 「밑창 두께는 ○○, 눌렀을 때는 △△이에요.」 둘 다 중간이면 「…, 눌렀을 때도 중간이에요.」
 * 푹신함을 모르면 「밑창 두께는 ○○이에요.」 두께도 모르면 null
 */
export function feelText(s: { stackHeightMm?: number; softness?: Softness }): string | null {
  const t = thicknessOf(s.stackHeightMm);
  if (!t) return null;
  if (!s.softness) return `밑창 두께는 ${THICK_KO[t]}이에요.`;
  if (t === "mid" && s.softness === "balanced") return "밑창 두께는 중간, 눌렀을 때도 중간이에요.";
  return `밑창 두께는 ${THICK_KO[t]}, 눌렀을 때는 ${SOFT_KO[s.softness]}이에요.`;
}

/** 밑창 두께 — 「38mm」, 없으면 「—」 */
export function stackText(s: { stackHeightMm?: number }): string {
  return s.stackHeightMm != null ? `${s.stackHeightMm}mm` : NONE;
}

/** 앞뒤 굽 차이 — 「8mm」, 없으면 「—」 */
export function dropText(s: { heelDropMm?: number }): string {
  return s.heelDropMm != null ? `${s.heelDropMm}mm` : NONE;
}

/** 무게 — 「275g · 270mm」. 사이즈를 모르면 「275g」 */
export function weightText(s: { weightG: number; weightSizeMm?: number }): string {
  return s.weightSizeMm != null ? `${s.weightG}g · ${s.weightSizeMm}mm` : `${s.weightG}g`;
}

/** 무게를 서로 비교해도 되나 — 같은 사이즈(mm)로 잰 값끼리만 */
export function sameWeightBasis(a: { weightSizeMm?: number }, b: { weightSizeMm?: number }): boolean {
  return a.weightSizeMm != null && a.weightSizeMm === b.weightSizeMm;
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
