/**
 * 러닝화 추천 도메인 타입
 *
 * 체형 8분류 기준:
 *   키 3단계(소형 ≤163 / 중형 164-177 / 대형 178+) × 체중 2-3단계
 *   → 각 분류마다 최적 신발이 다르게 설계됨
 */

export type WidthOption = "B" | "D" | "2E" | "4E";
export type FootWidth = "narrow" | "normal" | "wide";
export type FootType = "flat" | "neutral" | "high_arch";
export type StabilityType = "neutral" | "stability" | "motion_control";
export type ShoeUse = "daily" | "long" | "tempo" | "racing";

/**
 * 체형 8분류
 * small  = 키 ≤163cm
 * mid    = 키 164-177cm
 * tall   = 키 178+cm
 * light  = 체중 ≤55kg (small) / ≤60kg (mid) / ≤70kg (tall)
 * mid_w  = 체중 56-75kg (small) / 61-80kg (mid) / 71-85kg (tall)
 * heavy  = 체중 76+kg (small) / 81+kg (mid·tall)
 */
export type BodyType =
  | "small_light"
  | "small_mid"
  | "small_heavy"
  | "mid_light"
  | "mid_mid"
  | "mid_heavy"
  | "tall_mid"
  | "tall_heavy";

export function getBodyType(heightCm: number, weightKg: number): BodyType {
  if (heightCm <= 163) {
    if (weightKg <= 55) return "small_light";
    if (weightKg <= 75) return "small_mid";
    return "small_heavy";
  }
  if (heightCm >= 178) {
    if (weightKg <= 85) return "tall_mid";
    return "tall_heavy";
  }
  if (weightKg <= 60) return "mid_light";
  if (weightKg <= 80) return "mid_mid";
  return "mid_heavy";
}

export const BODY_TYPE_LABEL: Record<BodyType, string> = {
  small_light: "키 163cm 이하, 55kg 이하",
  small_mid:   "키 163cm 이하, 56–75kg",
  small_heavy: "키 163cm 이하, 76kg 이상",
  mid_light:   "키 164–177cm, 60kg 이하",
  mid_mid:     "키 164–177cm, 61–80kg",
  mid_heavy:   "키 164–177cm, 81kg 이상",
  tall_mid:    "키 178cm 이상, 85kg 이하",
  tall_heavy:  "키 178cm 이상, 86kg 이상",
};

/** 쿠셔닝 1=미니멀 ~ 5=맥시멀 */
export type CushioningLevel = 1 | 2 | 3 | 4 | 5;

/**
 * 성별 라스트(골격) 설계
 * Wunderlich & Cavanagh (2001, MSSE 33(4):605-611):
 *   "여성 발은 남성 발의 축소판이 아니다(should not be simply scaled-down versions)."
 *   같은 발 길이 기준 여성은 뒤꿈치가 좁고, 발등·볼 둘레가 작으며 아치가 높다.
 *
 * unisex      = 남녀 공용 라스트 (대부분 모델)
 * womens_last = 여성 전용 라스트 (좁은 힐 + 낮은 발등 볼륨 + 다른 폼 경도)
 * mens_last   = 남성 기준 라스트 (여성에겐 힐이 헐렁할 수 있음)
 */
export type GenderFit = "unisex" | "womens_last" | "mens_last";

export const GENDER_FIT_LABEL: Record<GenderFit, string> = {
  unisex: "남녀 공용 라스트",
  womens_last: "여성 전용 라스트",
  mens_last: "남성 기준 라스트",
};

/** 앞볼(전족부) 핏 — 한국인 발(넓은 앞볼) 매칭용 */
export type ForefootFit = "narrow" | "standard" | "wide";

/** 발등(인스텝) 볼륨 — 한국인 발(높은 발등) 매칭용 */
export type InstepVolume = "low" | "standard" | "high";

/** 한국 구매 가능 여부 */
export type KrAvailability =
  | "kr_official"
  | "kr_parallel"
  | "direct_import";

export const KR_AVAILABILITY_LABEL: Record<KrAvailability, string> = {
  kr_official:   "🇰🇷 국내 공식 판매",
  kr_parallel:   "🛒 국내 병행수입 구매 가능",
  direct_import: "✈️ 해외 직구 권장",
};

export interface BuyLink {
  label: string;
  url: string;
  isOfficial: boolean;
}

export interface Shoe {
  id: string;
  brand: string;
  model: string;
  imageUrl: string;
  colorways: string[];
  widthOptions: WidthOption[];
  heelDropMm: number;
  stackHeightMm: number;
  weightGramsM9: number;
  priceUsd: number;
  priceKrw: number;
  krAvailability: KrAvailability;
  buyLinks: BuyLink[];
  /** 성별 — male·female·unisex. 성별 선택 시 해당 성별 신발만 표시 */
  gender: "male" | "female" | "unisex";
  /** 여성 기준 무게(W8, g) — gender=female 신발에 표기 */
  weightGramsW8?: number;
  sourceUrl: string;
  cushioning: CushioningLevel;
  stability: StabilityType;
  footTypes: FootType[];
  weightRangeKg: [number, number];
  heightRangeCm: [number, number];
  primaryBodyTypes: BodyType[];
  uses: ShoeUse[];
  blurb: string;
  scienceBasis: string;
  youtubeReviews: { label: string; url: string }[];

  // ── 성별·한국 발 매칭 필드 (선택) ─────────────────────────────
  /** 성별 라스트 설계. 미지정 시 unisex로 간주 */
  genderFit?: GenderFit;
  /** 여성 버전에서 제공되는 폭 옵션 (예: Brooks는 여성 B·D·2E 제공) */
  womensWidths?: WidthOption[];
  /** 앞볼 핏 — 한국인 넓은 앞볼 매칭. 미지정 시 폭 옵션으로 추론 */
  forefootFit?: ForefootFit;
  /** 발등 볼륨 — 한국인 높은 발등 매칭 */
  instepVolume?: InstepVolume;
  /** 성별/라스트 관련 추가 근거 설명 (상세 카드에 노출) */
  genderNote?: string;
}

export interface Recommendation {
  shoe: Shoe;
  score: number;
  reasons: string[];
  isFallback: boolean;
  bodyTypeMatch: boolean;
  /** 여성 전용 라스트 등 성별 핏이 입력 성별과 맞는지 */
  genderFitMatch?: boolean;
  /** 성별 핏 한 줄 설명 (카드 배지/툴팁용) */
  genderFitNote?: string;
}

/**
 * 성별 — 골격·생체역학 차이 기반 보정에 사용
 *  - Ferber et al. (2003): 여성은 고관절 내전·무릎 외전이 크다 → 동적 Q앵글 ↑
 *  - Taunton et al. (2002): 여성 슬개대퇴 통증(PFPS) 발생률 남성의 약 2배
 *  - Wunderlich & Cavanagh (2001): 여성 발 = 좁은 힐 + 낮은 발등 (전용 라스트 필요)
 */
export type Gender = "male" | "female";

/** 러닝 경험 (PRD F-01) — 초심자는 카본·레이싱화 제외 */
export type RunnerLevel = "beginner" | "intermediate" | "advanced";

/** 주 평균 거리대 (PRD F-01) */
export type RunDistance = "short" | "mid" | "long";

/** 부상 이력 (PRD F-01 수용기준) — 복수 선택 */
export type InjuryArea = "knee" | "ankle" | "achilles" | "plantar" | "none";

export const INJURY_LABEL: Record<InjuryArea, string> = {
  knee: "무릎(슬개대퇴)",
  ankle: "발목",
  achilles: "아킬레스·종아리",
  plantar: "족저근막",
  none: "없음",
};

export interface RunnerProfile {
  weightKg: number;
  heightCm: number;
  footWidth: FootWidth;
  footType: FootType;
  use?: ShoeUse;
  /** 성별 — 선택 사항. 입력 시 생체역학 기반 보정 점수 적용 */
  gender?: Gender;
  /** 러닝 경험 (PRD F-01) */
  level?: RunnerLevel;
  /** 주 평균 거리대 (PRD F-01) */
  distance?: RunDistance;
  /** 부상 이력 (PRD F-01 수용기준) */
  injuryHistory?: InjuryArea[];
  /** 예산 상한 (원). 초과 모델은 감점 (PRD F-01 수용기준) */
  budgetKrw?: number;
}
