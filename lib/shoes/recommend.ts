/**
 * 러닝화 추천 로직 v3 — 체형 8분류 + 성별 골격 + 한국인 발
 *
 * 핵심 참고 문헌:
 * 1. Malisoux et al. (2013) Scand J Med Sci Sports — 쿠셔닝·체중 상관관계
 * 2. Heiderscheit et al. (2011) Med Sci Sports Exerc — 키·보폭·드롭
 * 3. Richards et al. (2009) Br J Sports Med — 발 타입·안정화
 * 4. van Gent et al. (2007) Br J Sports Med — 체중·부상률
 * 5. Sinclair et al. (2014) J Hum Kinet — 신장·관절 하중
 *
 * 성별·한국 발 보정 근거:
 * 6. Ferber, Davis & Williams (2003) Clin Biomech — 여성 고관절 내전·무릎 외전 ↑ (동적 Q앵글)
 * 7. Taunton et al. (2002) Br J Sports Med — 여성 슬개대퇴 통증(PFPS) 발생률 남성의 약 2배
 * 8. Wunderlich & Cavanagh (2001) MSSE 33(4):605-611 — 여성 발 ≠ 남성 발 축소판(전용 라스트)
 * 9. 사이즈코리아(Size Korea) + 아시아 인체 스캔 — 한국인 발: 넓은 앞볼·높은 발등 경향
 *
 * ⚠️ 주의: 성별·골격 차이는 잘 입증돼 있으나, '성별 전용 신발이 부상을 예방한다'는
 *    무작위 대조시험(RCT) 근거는 제한적. 본 로직은 '핏·생체역학 적합도' 보정이며 의료 조언이 아님.
 */

import { SHOES } from "./data";
import type {
  BodyType, FootType, FootWidth, Gender, Recommendation,
  RunnerProfile, Shoe, WidthOption,
} from "./types";
import { getBodyType, INJURY_LABEL } from "./types";

const WIDTH_MATCH: Record<FootWidth, WidthOption[]> = {
  narrow: ["B", "D"],
  normal: ["D", "B"],
  wide: ["2E", "4E"],
};

/** 한국인 발 특성 안내 문구 (사이즈코리아·아시아 스캔 데이터) */
export const KOREAN_FOOT_NOTE =
  "한국인 발은 평균적으로 앞볼이 넓고 발등이 높은 편(사이즈코리아 인체치수). 같은 길이라도 넓은 폭·높은 볼륨 모델이 잘 맞습니다.";

/** 신발의 앞볼이 '넓은' 쪽인지 — forefootFit 우선, 없으면 폭 옵션으로 추론 */
function isWideForefoot(shoe: Shoe): boolean {
  if (shoe.forefootFit) return shoe.forefootFit === "wide";
  return shoe.widthOptions.includes("2E") || shoe.widthOptions.includes("4E");
}

/**
 * 성별 핏 자격 판정 — 여성 전용 라스트는 여성 선택 시에만 후보에 포함.
 * 성별 미선택/남성에게 여성 전용 모델이 노출되지 않도록 함.
 */
function isGenderEligible(shoe: Shoe, gender?: Gender): boolean {
  const fit = shoe.genderFit ?? "unisex";
  if (fit === "womens_last") return gender === "female";
  return true;
}

/** 체중별 최소 쿠셔닝 등급 (van Gent 2007 + Malisoux 2013) */
export function getMinCushioning(weightKg: number): number {
  if (weightKg < 50) return 1;
  if (weightKg < 60) return 2;
  if (weightKg < 72) return 3;
  if (weightKg < 85) return 4;
  return 5;
}

/** 신장별 권장 드롭 범위 (Heiderscheit 2011) */
function idealDropRange(heightCm: number): [number, number] {
  if (heightCm <= 163) return [4, 8];
  if (heightCm <= 177) return [6, 10];
  return [8, 14];
}

function hasMatchingWidth(shoe: Shoe, fw: FootWidth): boolean {
  return shoe.widthOptions.some((w) => WIDTH_MATCH[fw].includes(w));
}

interface Scored {
  shoe: Shoe;
  score: number;
  reasons: string[];
  widthOk: boolean;
  useOk: boolean;
  bodyTypeMatch: boolean;
  eligible: boolean;
  genderFitMatch: boolean;
  genderFitNote?: string;
}

function scoreShoe(shoe: Shoe, profile: RunnerProfile, bodyType: BodyType): Scored {
  const reasons: string[] = [];
  let score = 0;

  // ── 1. 체형 분류 매칭 (25점) — 핵심 차별화 ─────────────────
  const bodyTypeMatch = shoe.primaryBodyTypes.includes(bodyType);
  if (bodyTypeMatch) {
    score += 25;
    reasons.push(`체형(키 ${profile.heightCm}cm·체중 ${profile.weightKg}kg)에 최적화된 모델`);
  }

  // ── 2. 발볼 (20점) ─────────────────────────────────────────
  const widthOk = hasMatchingWidth(shoe, profile.footWidth);
  if (widthOk) {
    score += 20;
    reasons.push(`${profile.footWidth === "wide" ? "넓은" : profile.footWidth === "narrow" ? "좁은" : "보통"} 발볼에 맞는 폭 옵션`);
  }

  // ── 3. 발 타입 + 안정화 (20점) ─────────────────────────────
  if (shoe.footTypes.includes(profile.footType)) {
    score += 12;
    reasons.push(`${profile.footType === "flat" ? "평발" : profile.footType === "high_arch" ? "높은 아치" : "중립"} 발에 적합`);
  }
  if (profile.footType === "flat") {
    if (shoe.stability !== "neutral") { score += 8; reasons.push("과회내 제어 안정화 구조"); }
    else { score -= 6; reasons.push("중립화 — 평발에 지지력 부족 가능"); }
  } else if (profile.footType === "high_arch") {
    if (shoe.stability === "neutral") { score += 8; reasons.push("고아치에 적합한 중립화"); }
    else { score -= 4; reasons.push("안정화는 고아치 러너에게 과교정 위험"); }
  } else {
    score += 4;
  }

  // ── 3b. 성별 골격·생체역학 보정 (최대 ±18점) ───────────────
  // 근거: Ferber 2003(고관절 내전·무릎 외전 ↑) · Taunton 2002(여성 PFPS 2배)
  //       Wunderlich & Cavanagh 2001(여성 발 = 좁은 힐·낮은 발등, 전용 라스트 필요)
  const fit = shoe.genderFit ?? "unisex";
  let genderFitMatch = false;
  let genderFitNote: string | undefined;

  if (profile.gender === "female") {
    // (1) 여성 전용 라스트 — 가장 큰 가점
    if (fit === "womens_last") {
      score += 12;
      genderFitMatch = true;
      genderFitNote = "여성 전용 라스트(좁은 힐·낮은 발등 볼륨) — Wunderlich & Cavanagh 2001";
      reasons.push("여성 전용 라스트 — 좁은 뒤꿈치·낮은 발등에 맞춘 골격 설계(Wunderlich 2001)");
    } else if (fit === "mens_last") {
      score -= 5;
      genderFitNote = "남성 기준 라스트 — 뒤꿈치가 헐렁할 수 있어요";
      reasons.push("남성 기준 라스트 — 여성 발엔 힐 고정력이 떨어질 수 있음");
    }
    // (2) 동적 Q앵글 ↑ → 평발·중립발 여성에게 안정화 가점 (Ferber 2003 / Taunton 2002)
    if (shoe.stability === "stability") {
      score += 8;
      reasons.push("여성 동적 Q앵글·과회내 경향(Ferber 2003, PFPS 2배 Taunton 2002)에 맞는 안정화");
    } else if (shoe.stability === "motion_control") {
      score -= 3; // 극단 안정화는 과교정 위험
    }
    // (3) 한국 여성 흔한 '좁은 힐 + 넓은 앞볼' 콤비네이션 발 — 넓은 앞볼 옵션이면 가점
    //     (서구 여성 라스트는 앞볼도 좁아 한국 여성에겐 끼일 수 있음 → 넓은 앞볼 우대)
    if (profile.footWidth === "wide" && isWideForefoot(shoe)) {
      score += 4;
      reasons.push("좁은 힐 + 넓은 앞볼(한국 여성 흔한 콤비네이션 발)에 대응하는 폭");
    }
    // (4) 경량 가점
    if (shoe.weightGramsM9 <= 230) {
      score += 2;
      reasons.push("경량 설계 — 여성 평균 체중대에 적합");
    }
  } else if (profile.gender === "male") {
    // 남성: 과회내가 상대적으로 적어 중립화 우선, 남성 기준 라스트 적합
    if (shoe.stability === "neutral" && profile.footType !== "flat") {
      score += 5;
      reasons.push("중립 발 남성에게 적합한 중립화(여성 대비 Q앵글 작음)");
    }
    if (fit === "mens_last") {
      score += 3;
      genderFitMatch = true;
      genderFitNote = "남성 기준 라스트";
    }
  }

  // ── 3c. 한국인 발 매칭 (최대 6점) ──────────────────────────
  // 사이즈코리아·아시아 스캔: 한국인 발 = 넓은 앞볼·높은 발등 경향.
  if (isWideForefoot(shoe) && profile.footWidth !== "narrow") {
    score += 4;
    reasons.push("넓은 앞볼 설계 — 한국인 평균 발볼(사이즈코리아)에 여유 있는 핏");
  }
  if (shoe.instepVolume === "high") {
    score += 2;
    reasons.push("높은 발등 볼륨 — 한국인 높은 발등에 압박 적음");
  }

  // ── 4. 체중 × 쿠셔닝 (20점) ───────────────────────────────
  const minCush = getMinCushioning(profile.weightKg);
  const [minW, maxW] = shoe.weightRangeKg;
  if (profile.weightKg >= minW && profile.weightKg <= maxW) {
    score += 14;
    reasons.push(`권장 체중 범위(${minW}~${maxW}kg) 내 — 쿠션 내구성 적합`);
  } else if (profile.weightKg < minW) {
    score += 7;
    reasons.push(`쿠션이 다소 과할 수 있음(권장 ${minW}kg 이상)`);
  } else {
    const over = profile.weightKg - maxW;
    score += over <= 8 ? 4 : 0;
    reasons.push(`체중(${profile.weightKg}kg)이 권장 상한(${maxW}kg) 초과 — 쿠션 붕괴 위험`);
  }
  if (shoe.cushioning >= minCush) {
    const diff = shoe.cushioning - minCush;
    score += diff === 0 ? 6 : diff === 1 ? 4 : 2;
    if (diff === 0) reasons.push(`체중에 정확히 맞는 쿠셔닝 ${shoe.cushioning}/5`);
  } else {
    score -= (minCush - shoe.cushioning) * 7;
    reasons.push(`쿠셔닝 ${shoe.cushioning}/5 — 체중 ${profile.weightKg}kg에 부족(권장 ${minCush}/5 이상)`);
  }

  // ── 5. 신장 × 드롭 (10점) ─────────────────────────────────
  const [dMin, dMax] = idealDropRange(profile.heightCm);
  if (shoe.heelDropMm >= dMin && shoe.heelDropMm <= dMax) {
    score += 10;
    reasons.push(`키 ${profile.heightCm}cm에 맞는 드롭(${shoe.heelDropMm}mm)`);
  } else if (Math.abs(shoe.heelDropMm - (dMin + dMax) / 2) <= 3) {
    score += 5;
  }

  // ── 6. 용도 (15점) ────────────────────────────────────────
  let useOk = true;
  if (profile.use) {
    useOk = shoe.uses.includes(profile.use);
    if (useOk) { score += 15; reasons.push("선택 용도에 맞음"); }
    else score -= 5;
  } else {
    score += 6;
  }

  // ── 7. 경험 수준 (PRD F-01) ───────────────────────────────
  if (profile.level === "beginner") {
    // 초심자에게 카본·레이싱화는 부상 위험 ↑ → 강한 감점
    if (shoe.uses.includes("racing")) { score -= 12; reasons.push("초심자에겐 레이싱화 비권장 — 안정적 데일리화부터"); }
    if (shoe.cushioning >= 3 && shoe.uses.includes("daily")) { score += 4; reasons.push("초심자에게 충분한 쿠션의 데일리화"); }
  } else if (profile.level === "advanced") {
    if (shoe.uses.includes("tempo") || shoe.uses.includes("racing")) { score += 3; }
  }

  // ── 8. 주 평균 거리 (PRD F-01) ────────────────────────────
  if (profile.distance === "long") {
    if (shoe.cushioning >= 4 || shoe.uses.includes("long")) { score += 6; reasons.push("장거리에 맞는 쿠션·내구 설계"); }
    if (shoe.cushioning <= 2) { score -= 6; reasons.push("쿠션이 얇아 장거리엔 피로 누적 위험"); }
  } else if (profile.distance === "short") {
    if (shoe.weightGramsM9 <= 250) { score += 3; reasons.push("단거리에 경쾌한 경량"); }
  }

  // ── 9. 부상 이력 (PRD F-01 수용기준) ──────────────────────
  for (const inj of profile.injuryHistory ?? []) {
    if (inj === "knee") {
      if (shoe.stability !== "neutral") { score += 6; reasons.push("무릎 이력 — 과회내 제어 안정화가 슬개대퇴 부담 완화"); }
      if (shoe.cushioning >= 3) { score += 3; }
    } else if (inj === "achilles") {
      // 낮은 드롭은 아킬레스 부하 ↑ → 높은 드롭 우대
      if (shoe.heelDropMm >= 8) { score += 6; reasons.push(`아킬레스 이력 — 드롭 ${shoe.heelDropMm}mm가 종아리·아킬레스 부하 감소`); }
      else if (shoe.heelDropMm <= 4) { score -= 6; reasons.push("드롭이 낮아 아킬레스 이력자에겐 부담"); }
    } else if (inj === "plantar") {
      if (shoe.cushioning >= 4) { score += 5; reasons.push("족저근막 이력 — 두꺼운 쿠션이 발바닥 충격 완화"); }
      if (shoe.stability !== "neutral") { score += 2; }
    } else if (inj === "ankle") {
      if (shoe.stability !== "neutral") { score += 4; reasons.push("발목 이력 — 안정화 구조가 좌우 흔들림 억제"); }
    }
  }

  // ── 10. 예산 (PRD F-01 수용기준) — 하드 필터는 recommendShoes에서 처리 ──
  // 여기서는 예산 내 모델에 소폭 가점만 (초과 모델은 이미 후보에서 제외됨)
  if (profile.budgetKrw && profile.budgetKrw > 0 && shoe.priceKrw <= profile.budgetKrw) {
    score += 5;
    reasons.push(`예산(${profile.budgetKrw.toLocaleString()}원) 이내`);
  }

  return {
    shoe,
    score: Math.max(0, Math.min(100, score)),
    reasons,
    widthOk,
    useOk,
    bodyTypeMatch,
    eligible: isGenderEligible(shoe, profile.gender),
    genderFitMatch,
    genderFitNote,
  };
}

export interface RecommendResult {
  primary: Recommendation[];
  usedFallback: boolean;
  fallbackNote: string;
  minCushioningRequired: number;
  /** 쉬운 말로 푼 내 분석 결과 (일반인용) */
  profileComment: string;
  /** 근거 논문 — 작은 글씨로 별도 표시 */
  evidenceNote: string;
  bodyType: BodyType;
  /** 키 기준 권장 케이던스(분당 걸음 수 spm) [최소, 최대] — PRD 추천 로직 §9 */
  cadenceSpm: [number, number];
}

/**
 * 키 → 권장 케이던스(분당 걸음 수, spm). PRD 추천 로직 §9 키×케이던스 기준값
 *  - ~160cm → 175~185 / 160~175cm → 170~180 / 175~185cm → 165~175 / 185cm~ → 160~170
 */
export function getCadenceRange(heightCm: number): [number, number] {
  if (heightCm <= 160) return [175, 185];
  if (heightCm <= 175) return [170, 180];
  if (heightCm <= 185) return [165, 175];
  return [160, 170];
}

export function recommendShoes(profile: RunnerProfile, limit = 3): RecommendResult {
  const bodyType = getBodyType(profile.heightCm, profile.weightKg);
  const minCush = getMinCushioning(profile.weightKg);
  const profileComment = buildProfileComment(profile, minCush, bodyType);
  const evidenceNote = buildEvidenceNote(profile);
  const cadenceSpm = getCadenceRange(profile.heightCm);

  // 성별 자격(여성 전용 라스트는 여성에게만) 통과한 후보만 사용
  const scoredAll = SHOES
    .map((shoe) => scoreShoe(shoe, profile, bodyType))
    .filter((s) => s.eligible);

  // 예산은 '하드 필터' — 선택 시 예산 초과 모델은 후보에서 제외
  const budget = profile.budgetKrw && profile.budgetKrw > 0 ? profile.budgetKrw : null;
  const scored = budget ? scoredAll.filter((s) => s.shoe.priceKrw <= budget) : scoredAll;

  // 1차: 발볼 + 용도 통과
  const pool = scored.filter((s) => s.widthOk && s.useOk);

  const toRec = (s: typeof scoredAll[0], fb: boolean): Recommendation => ({
    shoe: s.shoe, score: s.score, reasons: s.reasons,
    isFallback: fb, bodyTypeMatch: s.bodyTypeMatch,
    genderFitMatch: s.genderFitMatch, genderFitNote: s.genderFitNote,
  });

  if (pool.length >= 2) {
    const primary = pool
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => toRec(s, false));
    return { primary, usedFallback: false, fallbackNote: "", minCushioningRequired: minCush, profileComment, evidenceNote, bodyType, cadenceSpm };
  }

  // 예산 내 후보가 아예 없으면 — 솔직하게 알리고 예산 초과 근접 모델을 보여줌
  if (budget && scored.length === 0) {
    const overBudget = scoredAll
      .sort((a, b) => a.shoe.priceKrw - b.shoe.priceKrw)
      .slice(0, limit)
      .map((s) => toRec(s, true));
    const cheapest = Math.min(...scoredAll.map((s) => s.shoe.priceKrw));
    return {
      primary: overBudget,
      usedFallback: true,
      fallbackNote: `${budget.toLocaleString()}원 이하 모델이 현재 추천 목록에 없어요. 가장 저렴한 모델이 약 ${cheapest.toLocaleString()}원이라, 예산을 조금 올리거나 아래 근접 가격대를 참고하세요.`,
      minCushioningRequired: minCush, profileComment, evidenceNote, bodyType, cadenceSpm,
    };
  }

  const note = pool.length === 1
    ? "조건에 딱 맞는 모델이 1개뿐이라 조건을 완화해 추가 제안합니다."
    : profile.use
    ? `'${profile.use}' 용도 + 발볼 조건을 동시에 만족하는 모델이 ${budget ? "예산 내에 " : ""}없어 완화했습니다.`
    : "조건을 모두 만족하는 모델이 없어 가장 근접한 순으로 제시합니다.";

  // 폴백도 예산은 지킴(가능할 때) — scored(예산 적용)에서 우선
  const fallback = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => toRec(s, true));

  return { primary: fallback, usedFallback: true, fallbackNote: note, minCushioningRequired: minCush, profileComment, evidenceNote, bodyType, cadenceSpm };
}

/**
 * 내 분석 결과 — 쉬운 말 (일반인/런린이용)
 * 전문용어(Q앵글·과회내·드롭·라스트)는 괄호로 풀어서 설명.
 */
function buildProfileComment(profile: RunnerProfile, minCush: number, bodyType: BodyType): string {
  void bodyType;
  const bmi = profile.weightKg / ((profile.heightCm / 100) ** 2);
  const bmiNote =
    bmi < 18.5 ? "가벼운 신발로도 충분히 편하게 달릴 수 있어요." :
    bmi < 23   ? "쿠션은 취향대로 자유롭게 골라도 좋아요." :
    bmi < 27   ? `쿠션은 5단계 중 ${minCush}단계 이상이면 무릎이 한결 편할 거예요.` :
                 `쿠션은 ${minCush}단계 이상을 추천해요. 너무 얇은 신발보다 푹신한 쪽이 무릎·발목에 편해요.`;

  const heightNote =
    profile.heightCm <= 163 ? "키가 작은 편이라, 앞뒤 굽 차이가 작은 신발이 자연스럽게 달리기 좋아요." :
    profile.heightCm >= 178 ? "키가 큰 편이라, 뒤꿈치가 살짝 높은 신발이 보폭과 충격 분산에 유리해요." : "";

  const genderNote = profile.gender === "female"
    ? "여성은 보통 골반이 넓어 달릴 때 무릎이 안쪽으로 쏠리기 쉬워요. 그래서 무릎을 잡아주는 ‘안정화’ 신발과, 여성 발 모양(좁은 뒤꿈치)에 맞춘 모델에 점수를 더 줬어요."
    : profile.gender === "male"
    ? "남성은 여성보다 무릎이 안쪽으로 쏠리는 정도가 덜한 편이라, 자연스러운 ‘중립’ 신발을 우선했어요."
    : "";

  const koreaNote = profile.footWidth !== "narrow"
    ? "한국인은 보통 발볼이 넓고 발등이 높아서, 앞쪽이 넉넉한 신발을 먼저 골랐어요."
    : "";

  const injuries = (profile.injuryHistory ?? []).filter((i) => i !== "none");
  const injuryNote = injuries.length
    ? `예전에 다친 부위(${injuries.map((i) => INJURY_LABEL[i]).join("·")})를 고려해서, 그 부위에 부담이 덜한 신발을 우선했어요. (참고용이에요. 아프면 병원부터 가보세요.)`
    : "";

  const levelNote = profile.level === "beginner"
    ? "이제 막 시작한 단계라, 부상 위험이 큰 카본·레이싱화는 빼고 안정적인 데일리화를 골랐어요."
    : "";

  return [bmiNote, heightNote, genderNote, koreaNote, levelNote, injuryNote].filter(Boolean).join(" ");
}

/** 결과 하단 안내 — 학술 인용 대신 편안한 참고용 한 줄(부담↓·중립성 유지) */
function buildEvidenceNote(profile: RunnerProfile): string {
  void profile;
  return "이 추천은 입력한 정보로 계산한 참고 가이드예요. 발 모양과 취향은 사람마다 달라서 100% 정답은 아니니, 마음에 드는 후보를 신어보고 가장 편한 걸 고르면 돼요. 광고·협찬 없이 입력값만으로 계산했어요.";
}
