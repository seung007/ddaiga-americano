import type { FootType, FootWidth, RunnerProfile, ShoeUse } from "./types";

/**
 * 신발 찾기 폼의 선택지와 저장 형식 — `/shoe-finder` 와 `/shoes`(내 조건으로 보기)가 같이 쓴다.
 * 2026-09-16 에 `app/shoe-finder/page.tsx` 에서 옮겼다. 두 곳이 다른 표를 쓰면 같은 답에 다른 결과가 나온다.
 */

// ── 범위 선택 옵션 (체형 8분류 — 자체 설계 구간) ──────────
export type HeightRange = "small" | "mid" | "tall";
export type WeightRange = "very_light" | "light" | "mid_w" | "heavy";

export const HEIGHT_OPTIONS: { value: HeightRange; label: string; cm: number; desc: string }[] = [
  { value: "small", label: "163cm 이하", cm: 160, desc: "발이 땅에 닿는 느낌 살리는 신발이 잘 맞아요" },
  { value: "mid",   label: "164 – 177cm", cm: 171, desc: "균형 잡힌 쿠션과 반응성" },
  { value: "tall",  label: "178cm 이상", cm: 182, desc: "충격 흡수가 우선인 신발" },
];

export const WEIGHT_OPTIONS: Record<HeightRange, { value: WeightRange; label: string; kg: number; desc: string }[]> = {
  small: [
    { value: "very_light", label: "50kg 미만", kg: 45,  desc: "정말 가벼운 쿠션으로도 충분해요" },
    { value: "light",      label: "50 – 55kg", kg: 52,  desc: "가벼운 쿠션으로 충분해요" },
    { value: "mid_w",      label: "56 – 75kg", kg: 65,  desc: "중간 쿠션이 딱 맞아요" },
    { value: "heavy",      label: "76kg 이상", kg: 82,  desc: "두꺼운 쿠션이 무릎을 지켜줘요" },
  ],
  mid: [
    { value: "very_light", label: "50kg 미만", kg: 46,  desc: "정말 가벼운 쿠션으로도 충분해요" },
    { value: "light",      label: "50 – 60kg", kg: 55,  desc: "가벼운 쿠션으로 충분해요" },
    { value: "mid_w",      label: "61 – 80kg", kg: 70,  desc: "중간 쿠션이 딱 맞아요" },
    { value: "heavy",      label: "81kg 이상", kg: 87,  desc: "두꺼운 쿠션이 무릎을 지켜줘요" },
  ],
  tall: [
    { value: "light", label: "85kg 이하", kg: 77,  desc: "두꺼운 쿠션이 필요해요" },
    { value: "heavy", label: "86kg 이상", kg: 93,  desc: "맥스 쿠션으로 무릎을 보호해요" },
  ],
};

export const FOOT_OPTIONS: { id: string; category: "width" | "type"; label: string; desc: string; width?: FootWidth; footType?: FootType }[] = [
  { id: "narrow",     category: "width", label: "좁은 발볼",       desc: "신발이 항상 헐렁한 편",             width: "narrow" },
  { id: "normal",     category: "width", label: "보통 발볼",       desc: "대부분의 신발이 잘 맞아요",           width: "normal" },
  { id: "wide",       category: "width", label: "넓은 발볼 2E/4E", desc: "신발 옆이 자주 눌리거나 물집 생겨요", width: "wide" },
  { id: "flat",       category: "type",  label: "평발",            desc: "발이 안쪽으로 쏠리는 편이에요",       footType: "flat" },
  { id: "neutral",    category: "type",  label: "중립 아치",       desc: "특별한 지지대 없어도 괜찮아요",       footType: "neutral" },
  { id: "high_arch",  category: "type",  label: "높은 아치",       desc: "발바닥 가운데가 뜨는 편이에요",       footType: "high_arch" },
];

export const USES: { value: ShoeUse; label: string }[] = [
  { value: "daily",  label: "데일리 (매일 달리기)" },
  { value: "long",   label: "장거리 (하프·풀 마라톤)" },
  { value: "tempo",  label: "템포 / 인터벌" },
  { value: "racing", label: "레이싱 (기록 단축)" },
];

export const USE_LABEL: Record<ShoeUse, string> = { daily: "데일리", long: "장거리", tempo: "템포", racing: "레이싱" };
export const STABILITY_LABEL = { neutral: "중립", stability: "안정화", motion_control: "모션컨트롤" } as const;
export const CUSH_DOTS = ["", "●○○○○", "●●○○○", "●●●○○", "●●●●○", "●●●●●"] as const;

export const STORAGE_KEY = "ddaiga:lastProfile";

export type SavedProfile = {
  g: string; h: string; w: string; f: string[]; u: string; b: number;
  lv: string; d: string; inj: string[]; t: number;
};

/**
 * 저장된 답 → 추천 입력. 키·체중을 모르면 null.
 * 폼과 **같은 규칙**이다(발볼 미선택 = 보통, 아치 미선택 = 중립).
 */
export function profileFromSaved(p: SavedProfile): RunnerProfile | null {
  const h = HEIGHT_OPTIONS.find((o) => o.value === p.h);
  const w = h ? WEIGHT_OPTIONS[h.value].find((o) => o.value === p.w) : undefined;
  if (!h || !w) return null;
  const f = Array.isArray(p.f) ? p.f : [];
  const width: FootWidth = FOOT_OPTIONS.find((o) => o.category === "width" && f.includes(o.id))?.width ?? "normal";
  const type: FootType = FOOT_OPTIONS.find((o) => o.category === "type" && f.includes(o.id))?.footType ?? "neutral";
  return {
    heightCm: h.cm,
    weightKg: w.kg,
    footWidth: width,
    footType: type,
    use: (p.u || undefined) as ShoeUse | undefined,
    gender: (p.g || undefined) as RunnerProfile["gender"],
    budgetKrw: p.b || undefined,
    level: (p.lv || undefined) as RunnerProfile["level"],
    distance: (p.d || undefined) as RunnerProfile["distance"],
    injuryHistory: Array.isArray(p.inj) && p.inj.length ? (p.inj as RunnerProfile["injuryHistory"]) : undefined,
  };
}

/** 저장된 답을 사람이 읽는 한 줄로 */
export function describeSaved(p: SavedProfile): string {
  const h = HEIGHT_OPTIONS.find((o) => o.value === p.h);
  const w = h ? WEIGHT_OPTIONS[h.value].find((o) => o.value === p.w) : undefined;
  const feet = (Array.isArray(p.f) ? p.f : []).map((id) => FOOT_OPTIONS.find((o) => o.id === id)?.label).filter(Boolean);
  return [h?.label, w?.label, ...feet, p.u ? USE_LABEL[p.u as ShoeUse] : null].filter(Boolean).join(" · ");
}
