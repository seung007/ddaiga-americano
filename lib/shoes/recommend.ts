/**
 * 러닝화 추천 로직 v4 — 2026-10-06 체중 경로 중립화
 *
 * ⚠️ v4 에서 바뀐 것 (인용 전수 대조 + council 심의 → hyun 결정)
 *  · **체중은 순위에 쓰지 않는다.** Malisoux 2020(AJSM 48(2):473-480, 848명 RCT, PubMed 초록 확인):
 *    딱딱한 신발은 부상 위험 ↑(SHR 1.52, 1.07–2.16), 체중 자체는 부상과 무관(SHR 1.00).
 *    체중 중앙값으로 나누면 쿠션의 보호 효과는 가벼운 군에서만 유의(1.80 vs 1.23 (0.75–2.03)).
 *    「무거우면 쿠션을 더」는 저자가 시험한 통념이고 지지되지 않았다. 그런데 v3 는 체중이 무거울수록
 *    최소 쿠션 등급을 올리고(등급당 −7) 권장 체중 범위(+14)·체형 태그(+25)로 같은 가정을 세 번 실었다.
 *    그리고 우리 쿠션 등급은 뒤꿈치 스택 높이 분류라 논문의 밑창 경도와 다른 변수다(data.ts 주석).
 *    → 세 경로를 모두 껐다. 체형(bodyType)은 화면 표시용으로만 남는다.
 *  · **동점 규칙을 공개한다.** 100점 상한 때문에 1위 100점이 대부분이었고 동점 순위는 신발 배열 순서가
 *    정했다(신발을 추가하면 추천이 조용히 바뀜). 이제 잘리기 전 점수 → 정가 낮은 순 → id 순.
 *  · 근거가 없는 가점은 지우지 않은 것도 이유 문구에 「사이트 기준」이라고 적는다.
 *  · 출력 회귀 검사: scripts/check-engine.mjs (체중 독립 불변식 + 스냅샷)
 *
 * 참고 문헌 (역할을 정확히):
 * 1. Malisoux et al. (2020) Am J Sports Med — 위 설명. **체중별 쿠션 처방의 근거가 아니다.**
 * 2. 신장·드롭 매칭 — 자체 설계 휴리스틱 (뒷받침하는 논문 없음)
 * 3. Malisoux et al. (2016) BJSM 50(8):481-7 — 모션컨트롤화 RCT 372명. 전체 부상 HR 0.55(0.36–0.85),
 *    회내 발(Foot Posture Index) 층에서 0.34(0.13–0.84). 2026-10-06 까지 저장소에 없던 1차 RCT.
 *    Willems et al. (2021) JOSPT — 같은 계열 RCT 의 2차 분석, 회내 관련 병변 HR 0.41(0.17–0.98).
 *    (사이트가 오래 「Malisoux 2021」로 잘못 불렀다 — 제1저자는 Willems TM)
 *    ⚠️ 사용자 입력 「평발」은 자가보고(「발이 안쪽으로 쏠리는 편」)라 FPI 측정과 같지 않다.
 * 4. van Gent et al. (2007) Br J Sports Med — 러닝 부상 발생률·결정요인 체계적 고찰
 *    (이 논문은 쿠셔닝을 다루지 않는다. 부상 빈도의 배경 자료로만 인용할 것)
 *
 * ⚠️ 여기에 다시 달지 말 것 — 2026-08-27 감사에서 걸러낸 것들
 *
 *  · Richards et al. (2009) Br J Sports Med — **결론이 정반대다.**
 *    발 타입으로 회내 제어화를 처방하는 관행에 근거가 없다("not evidence-based")는 것이
 *    논지이고, 8개 DB를 뒤져 지지 연구를 한 건도 찾지 못했다고 보고했다.
 *    이 사이트는 그 논문을 오랫동안 '발 타입별 안정화 매칭'의 지지 근거로 인용해왔다.
 *    단 Richards 2009 이후 1차 RCT(Malisoux 2016)가 나왔다 — 「지지 연구 0건」은 2009년 기준이다.
 *    아래 3항의 발 타입×안정화 점수는 그 약한 지지 위에 서 있다(2026-10-06 hyun 결정: 유지).
 *
 *  · Sinclair et al. (2014) J Hum Kinet — 신장과 관절 하중을 연결한 논문이 아니다.
 *    맨발·미니멀 신발의 무릎·발목 부하를 다룬다. 신장×드롭 로직에 근거로 쓸 수 없다.
 *
 * 성별·한국 발 보정 근거 (2026-10-06 초록 재확인 — 할 수 있는 말만):
 * 6. Ferber, Davis & Williams (2003) Clin Biomech — 남녀 각 20명, 고관절·무릎만 측정. 여성의 고관절
 *    내전·내회전·무릎 외전 각도가 컸다. **회내·Q앵글·신발은 초록에 없다.** → v4 에서 성별 안정화/중립화
 *    가점(여성 +3·모션컨트롤 −3, 남성 +5)을 모두 뺐다. 점수에 쓰지 않는다.
 * 7. Taunton et al. (2002) Br J Sports Med — 「일부 부상은 한 성별에서 더 잦았다」까지. 「여성 PFPS 2배」는
 *    초록에 없고, 대조군이 다른 부상자라 발생률 비교 설계도 아니다.
 * 8. Wunderlich & Cavanagh (2001) MSSE 33(4):605-611 — 여성 발은 남성 발의 축소판이 아니고
 *    아치·발 바깥쪽·엄지·볼에서 모양이 다르다. 「좁은 뒤꿈치·낮은 발등」은 초록에 없다.
 * 9. 사이즈코리아 — 「한국인은 서양인보다 발볼이 넓다」 같은 국가 간 비교는 확인한 자료가 없다.
 *
 * ⚠️ 주의: 성별·골격 차이는 잘 입증돼 있으나, '성별 전용 신발이 부상을 예방한다'는
 *    무작위 대조시험(RCT) 근거는 제한적. 본 로직은 '핏·생체역학 적합도' 보정이며 의료 조언이 아님.
 */

import { SHOES } from "./data";
import type {
  BodyType, FootType, FootWidth, Gender, Recommendation,
  RecommendableShoe, RunnerProfile, Shoe, WidthOption,
} from "./types";
import { getBodyType, INJURY_LABEL, isRecommendable } from "./types";

/**
 * 추천이 보는 후보 — **`SHOES` 를 직접 쓰지 말 것.**
 *
 * 2026-09-21: 러닝화를 늘리면서 판단 필드(발 타입·권장 체중·체형)를 못 채운 신발이
 * 목록에 들어온다. 그런 신발은 **"당신에게 맞습니다"라고 말할 근거가 없다.**
 * 여기서 한 번 걸러서 `recommendShoes` 와 `rankAllShoes` 가 같은 후보를 보게 한다.
 * 두 함수가 다른 배열을 쓰면 폼 결과와 목록 정렬이 어긋난다.
 */
const RECOMMENDABLE: RecommendableShoe[] = SHOES.filter(isRecommendable);

const WIDTH_MATCH: Record<FootWidth, WidthOption[]> = {
  narrow: ["B", "D"],
  normal: ["D", "B"],
  wide: ["2E", "4E"],
};

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

/*
 * 2026-10-06: getMinCushioning(체중별 최소 쿠션 등급)을 지웠다. 맨 위 v4 설명 참고.
 * 다시 넣으려면 「무거운 러너에게 쿠션이 더 이롭다」를 보인 연구부터 가져와야 한다.
 */

/**
 * 신장별 권장 드롭 범위.
 *
 * ⚠️ 논문 근거 없음 — 자체 휴리스틱이다. 이전에 Heiderscheit 2011을 달아뒀는데,
 * 그 논문은 스텝빈도 ±5/10% 조작 시 관절역학을 본 것이지 신발 드롭도 신장도 다루지 않는다.
 */
function idealDropRange(heightCm: number): [number, number] {
  if (heightCm <= 163) return [4, 8];
  if (heightCm <= 177) return [6, 10];
  return [8, 14];
}

function hasMatchingWidth(shoe: Shoe, fw: FootWidth): boolean {
  return shoe.widthOptions.some((w) => WIDTH_MATCH[fw].includes(w));
}

interface Scored {
  shoe: RecommendableShoe;
  /** 화면 표시용(0~100으로 자름) */
  score: number;
  /** 정렬용 — 자르기 전 점수. 100점 동점을 줄이려고 둔다(2026-10-06) */
  rawScore: number;
  reasons: string[];
  widthOk: boolean;
  useOk: boolean;
  bodyTypeMatch: boolean;
  eligible: boolean;
  genderFitMatch: boolean;
  genderFitNote?: string;
}

// 판단 필드가 다 찬 신발만 받는다 — 타입으로 막아 둔다(2026-09-21)
function scoreShoe(shoe: RecommendableShoe, profile: RunnerProfile, bodyType: BodyType): Scored {
  const reasons: string[] = [];
  let score = 0;

  // ── 1. 체형 분류 매칭 — 2026-10-06 점수에서 뺐다 ───────────
  // 체형 태그는 키×체중 조합이고 출처 기록이 없다(types.ts 판단 필드). 키 부분만 남기는 안도 봤지만
  // tall_heavy 같은 태그가 체중 가정을 그대로 실어 나르고, 키는 아래 5번(드롭)에서 따로 본다.
  // bodyTypeMatch 는 화면 표시와 하위 호환을 위해 false 로 둔다.
  void bodyType;
  const bodyTypeMatch = false;

  // ── 2. 발볼 (20점) ─────────────────────────────────────────
  const widthOk = hasMatchingWidth(shoe, profile.footWidth);
  if (widthOk) {
    score += 20;
    reasons.push(`${profile.footWidth === "wide" ? "넓은" : profile.footWidth === "narrow" ? "좁은" : "보통"} 발볼에 맞는 폭 옵션`);
  }

  // ── 3. 발 타입 + 안정화 (가중치 축소, 2026-08-31) ───────────
  //
  // ⚠️ 여기를 낮춘 이유를 남겨둔다. 다시 올리려면 이 문단을 먼저 반박해야 한다.
  //
  // 이 블록은 오랫동안 Richards et al. (2009) Br J Sports Med를 근거로 달고 있었다.
  // 그 논문은 **결론이 정반대다** — 발 타입으로 회내 제어화를 처방하는 관행에
  // 근거가 없다("not evidence-based")는 것이 논지이고, 8개 DB를 뒤져 지지 연구를
  // 한 건도 찾지 못했다고 보고했다.
  //
  // 2026-08-27에 인용을 Malisoux et al. (2021) JOSPT로 교체했는데, **점수는 그대로 뒀다.**
  // 그건 정정이 아니라 근거만 갈아끼운 것이었다. 2026-08-31 심의에서 지적받아 여기를 고친다.
  //
  // Malisoux 2021이 실제로 지탱할 수 있는 무게:
  //   · RCT의 **2차 분석**이다 (사전 등록된 주 가설이 아니다)
  //   · HR 0.41, 95% CI 0.17–0.98 — **상한이 0.98로 간신히 1을 안 넘는다**
  //   · 즉 "효과가 거의 없음"이 신뢰구간 안에 들어 있다
  //
  // 그래서 이 축의 가중치를 약 1/3로 줄이고, 사용자에게 보이는 문구도
  // 확정된 사실("과회내 제어 안정화 구조")에서 갈리는 사항으로 바꾼다.
  // 발볼(20점)·체형(25점)은 물리적 치수 매칭이라 근거의 성질이 다르므로 유지한다.
  if (shoe.footTypes.includes(profile.footType)) {
    score += 12;
    reasons.push(`${profile.footType === "flat" ? "평발" : profile.footType === "high_arch" ? "높은 아치" : "중립"} 발로 분류한 모델(사이트 분류)`);
  }
  if (profile.footType === "flat") {
    // 2026-10-06 hyun 결정: 유지 + 근거 교체(Malisoux 2016). 자가보고 평발 ≠ FPI 측정이라는 점을 같이 말한다.
    if (shoe.stability !== "neutral") { score += 3; reasons.push("안정화 구조 — 발이 안쪽으로 쏠리는 러너에서 모션컨트롤화가 부상 위험을 낮춘 RCT가 1건 있어요(Malisoux 2016). 다만 스스로 고른 「평발」과 같은 기준은 아니에요"); }
    else { score -= 2; }
  } else if (profile.footType === "high_arch") {
    if (shoe.stability === "neutral") { score += 3; reasons.push("중립화 — 높은 아치에 흔히 권장되지만 강한 근거는 없습니다"); }
    else { score -= 2; }
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
      genderFitNote = "여성 전용 라스트 — 여성 발은 남성 발의 축소판이 아니라는 연구(Wunderlich & Cavanagh 2001)";
      reasons.push("여성 전용 라스트 — 여성 발은 아치·볼·엄지 모양이 남성 발과 다르다는 연구가 있어요(Wunderlich 2001)");
    } else if (fit === "mens_last") {
      score -= 5;
      genderFitNote = "남성 기준 라스트 — 뒤꿈치가 헐렁할 수 있어요";
      reasons.push("남성 기준 라스트 — 여성 발엔 힐 고정력이 떨어질 수 있음");
    }
    // (2) 여성 안정화 +3 / 모션컨트롤 −3 — 2026-10-06 삭제(hyun 결정).
    //     근거로 든 Ferber 2003 은 고관절·무릎 각도만 측정했고 신발을 다루지 않는다. 체중 점수를 빼자
    //     이 +3 이 결정권을 가져 중립 발 여성의 상위 3개 중 안정화가 24% → 68% 가 됐다(648 프로필 실측).
    // (3) 한국 여성 흔한 '좁은 힐 + 넓은 앞볼' 콤비네이션 발 — 넓은 앞볼 옵션이면 가점
    //     (서구 여성 라스트는 앞볼도 좁아 한국 여성에겐 끼일 수 있음 → 넓은 앞볼 우대)
    if (profile.footWidth === "wide" && isWideForefoot(shoe)) {
      score += 4;
      reasons.push("넓은 앞볼 옵션 — 발볼 넓음 선택");
    }
    // (4) 경량 가점 — 2026-10-06 삭제. 근거가 「여성 평균 체중대」였다(체중 경로 중립화).
  } else if (profile.gender === "male") {
    // 남성: 과회내가 상대적으로 적어 중립화 우선, 남성 기준 라스트 적합
    // 남성 중립화 +5 — 2026-10-06 삭제(hyun 결정). 위 여성 +3 과 같은 Ferber 유래 가정이고,
    // 체중 점수를 빼자 중립 발 남성의 상위 3개 중 안정화가 16% → 0% 가 됐다.
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
    reasons.push("넓은 앞볼 설계 — 앞쪽이 넉넉한 핏");
  }
  if (shoe.instepVolume === "high") {
    score += 2;
    reasons.push("높은 발등 볼륨 — 발등 압박이 적은 편");
  }

  // ── 4. 체중 × 쿠셔닝 — 2026-10-06 삭제 ─────────────────────
  // 권장 체중 범위(+14/+7/+4)와 최소 쿠션 등급(+6/+4/+2, 미달 시 등급당 −7)을 모두 뺐다. 맨 위 v4 설명 참고.

  // ── 5. 신장 × 드롭 (10점) ─────────────────────────────────
  const [dMin, dMax] = idealDropRange(profile.heightCm);
  if (shoe.heelDropMm >= dMin && shoe.heelDropMm <= dMax) {
    score += 10;
    reasons.push(`키 ${profile.heightCm}cm 기준 드롭 ${shoe.heelDropMm}mm(사이트 기준 — 근거 논문 없음)`);
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
    // 카본화 감점.
    //
    // 이전 문구는 "카본 플레이트는 고속에서만 효과(Hoogkamer 2018)"였는데 논문이 그걸 말하지 않는다.
    // Hoogkamer 2018은 14·16·18 km/h만 시험했고 그보다 느린 속도는 아예 측정하지 않았으며,
    // 카본 플레이트 단독 효과를 폼과 분리하지도 않았다(신소재 미드솔+플레이트 결합 완제품 비교).
    // 즉 "느린 속도에서 효과 없음"은 데이터 부재를 반증으로 쓴 것이다.
    // 감점 자체는 유지한다 — 근거는 논문이 아니라 레이싱화의 낮은 안정성·짧은 수명·높은 가격이라는
    // 실무적 이유이고, 그 이유를 그대로 사용자에게 말한다.
    // (레이싱화지만 카본 없는 모델 — 예: Endorphin Speed — 은 패널티 없음)
    // 2026-10-06: 「밑창이 얇고」는 사실과 반대(카본화 스택 27–42mm). 「부상 위험」도 근거 없음 — 실무 이유만.
    if (shoe.hasCarbon === true) { score -= 12; reasons.push("초심자에겐 카본 레이싱화 감점(사이트 기준) — 밑창이 높고 단단해 안정감이 덜하고, 수명이 짧고 비쌉니다. 데일리화부터"); }
    if (shoe.cushioning >= 3 && shoe.uses.includes("daily")) { score += 4; reasons.push("초심자에게 충분한 쿠션의 데일리화"); }
  } else if (profile.level === "advanced") {
    if (shoe.uses.includes("tempo") || shoe.uses.includes("racing")) { score += 3; }
  }

  // ── 8. 주 평균 거리 (PRD F-01) ────────────────────────────
  if (profile.distance === "long") {
    if (shoe.cushioning >= 4 || shoe.uses.includes("long")) { score += 6; reasons.push("장거리에 맞는 쿠션·내구 설계"); }
    if (shoe.cushioning <= 2) { score -= 6; reasons.push("쿠션이 얇아 장거리용으로는 감점(사이트 기준)"); }
  } else if (profile.distance === "short") {
    if (shoe.weightGramsM9 <= 250) { score += 3; reasons.push("단거리에 경쾌한 경량"); }
  }

  // ── 9. 부상 이력 (PRD F-01 수용기준) ──────────────────────
  for (const inj of profile.injuryHistory ?? []) {
    if (inj === "knee") {
      // 2026-08-31 축소(6 → 2). "안정화화가 슬개대퇴 부담을 완화한다"는 문장을
      // 지지하는 근거가 이 저장소에 없다. 위 3번 블록과 같은 축인데 부상 이력에서
      // 한 번 더 가점되어 평발 + 무릎 이력 조합에 중복 누적되고 있었다.
      if (shoe.stability !== "neutral") { score += 2; }
      if (shoe.cushioning >= 3) { score += 3; }
    } else if (inj === "achilles") {
      // 2026-10-06: 가점은 유지(결정 보류), 문구만 정직하게. 드롭이 아킬레스 부담을 줄인다는 출처를
      // 저장소에서 찾지 못했다(flat-feet 주석). 아킬레스 가이드도 「몇 mm라고 말하지 않겠다」는 입장.
      if (shoe.heelDropMm >= 8) { score += 6; reasons.push(`아킬레스 이력 — 드롭 ${shoe.heelDropMm}mm 우선(사이트 기준, 드롭이 부담을 줄인다는 근거는 확인 못 함)`); }
      else if (shoe.heelDropMm <= 4) { score -= 6; reasons.push("아킬레스 이력 — 드롭 4mm 이하 감점(사이트 기준)"); }
    } else if (inj === "plantar") {
      // 2026-10-06: 문구만 정직하게. 족저근막 가이드 결론은 「쿠셔닝·드롭에 좋은 근거 없음」.
      if (shoe.cushioning >= 4) { score += 5; reasons.push("족저근막 이력 — 쿠션 4 이상 우선(사이트 기준, 쿠션이 회복을 돕는다는 근거는 확인 못 함)"); }
      if (shoe.stability !== "neutral") { score += 2; }
    } else if (inj === "ankle") {
      // 2026-08-31 축소(4 → 2). 같은 축의 중복 누적.
      if (shoe.stability !== "neutral") { score += 2; }
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
    rawScore: score,
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

/**
 * 공개 동점 규칙 (2026-10-06) — 잘리기 전 점수 → 정가 낮은 순 → id 순.
 * 화면(evidenceNote)에도 같은 규칙을 적는다. 바꾸면 거기도 바꿀 것.
 */
function byRank(a: Scored, b: Scored): number {
  return b.rawScore - a.rawScore || a.shoe.priceKrw - b.shoe.priceKrw || a.shoe.id.localeCompare(b.shoe.id);
}

/**
 * 상위 N개 고르기 (2026-10-06 hyun 결정)
 *
 * 체중·체형 점수를 빼자 점수 차이를 만들던 요소가 줄어 두 가지가 생겼다(648 프로필 실측).
 *  ① 평발 가점이 결정권을 가져 평발 사용자 상위 3개가 **100% 안정화**가 됐다(전 56%).
 *     근거 수준(회내 발 RCT 1건, 자가보고 ≠ FPI)에 비해 너무 세다 → **평발이면 안정화 최대 2 + 중립 1.**
 *  ② 1·2위 동점이 80% — 정가 낮은 순만 쓰면 같은 브랜드 싼 모델이 줄줄이 차지한다
 *     → **상위 N개는 브랜드가 겹치지 않게**(후보가 모자라면 그때만 겹침 허용).
 * 화면(evidenceNote)과 약관 3항에 같은 규칙을 적는다. 바꾸면 거기도 바꿀 것.
 */
function pickTop(sorted: Scored[], profile: RunnerProfile, limit: number): Scored[] {
  const isNeutral = (x: Scored) => x.shoe.stability === "neutral";
  const flat = profile.footType === "flat";
  const picked: Scored[] = [];
  const brands = new Set<string>();
  const ok = (x: Scored, distinctBrand: boolean, capFlat: boolean) =>
    !picked.includes(x) &&
    (!distinctBrand || !brands.has(x.shoe.brand)) &&
    (!flat || !capFlat || isNeutral(x) || picked.filter((p) => !isNeutral(p)).length < limit - 1);
  // 조건을 점점 풀어 가며 채운다: 브랜드 구분+평발 상한 → 평발 상한만 → 아무 조건 없이(후보가 모자랄 때)
  for (const [distinctBrand, capFlat] of [[true, true], [false, true], [false, false]] as const) {
    for (const x of sorted) {
      if (picked.length >= limit) break;
      if (ok(x, distinctBrand, capFlat)) { picked.push(x); brands.add(x.shoe.brand); }
    }
  }
  // 평발인데 중립화가 하나도 안 들어갔으면(위 조건은 「안정화 최대 limit−1」만 막는다) 마지막 자리를 중립화로
  if (flat && limit >= 2 && picked.length === limit && !picked.some(isNeutral)) {
    const n = sorted.find((x) => isNeutral(x) && !picked.includes(x) && !brands.has(x.shoe.brand))
      ?? sorted.find((x) => isNeutral(x) && !picked.includes(x));
    if (n) picked[limit - 1] = n;
  }
  return picked;
}

export function recommendShoes(profile: RunnerProfile, limit = 3): RecommendResult {
  const bodyType = getBodyType(profile.heightCm, profile.weightKg);
  const profileComment = buildProfileComment(profile);
  const evidenceNote = buildEvidenceNote(profile);
  const cadenceSpm = getCadenceRange(profile.heightCm);

  // 성별 자격(여성 전용 라스트는 여성에게만) 통과한 후보만 사용
  const scoredAll = RECOMMENDABLE
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
    const primary = pickTop(pool.sort(byRank), profile, limit)
      .map((s) => toRec(s, false));
    return { primary, usedFallback: false, fallbackNote: "", profileComment, evidenceNote, bodyType, cadenceSpm };
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
      profileComment, evidenceNote, bodyType, cadenceSpm,
    };
  }

  const note = pool.length === 1
    ? "조건에 딱 맞는 모델이 1개뿐이라 조건을 완화해 추가 제안합니다."
    : profile.use
    ? `'${profile.use}' 용도 + 발볼 조건을 동시에 만족하는 모델이 ${budget ? "예산 내에 " : ""}없어 완화했습니다.`
    : "조건을 모두 만족하는 모델이 없어 가장 근접한 순으로 제시합니다.";

  // 폴백도 예산은 지킴(가능할 때) — scored(예산 적용)에서 우선
  const fallback = pickTop(scored.sort(byRank), profile, limit)
    .map((s) => toRec(s, true));

  return { primary: fallback, usedFallback: true, fallbackNote: note, profileComment, evidenceNote, bodyType, cadenceSpm };
}

/**
 * 내 분석 결과 — 쉬운 말 (일반인/런린이용)
 * 전문용어(Q앵글·과회내·드롭·라스트)는 괄호로 풀어서 설명.
 */
function buildProfileComment(profile: RunnerProfile): string {
  // 2026-10-06: 체중별 쿠션 문구(「푹신한 쪽이 무릎·발목에 편해요」 등)를 근거에 맞게 바꿨다 — 맨 위 v4 설명.
  const weightNote =
    "체중은 순위에 넣지 않았어요. 848명을 6개월 추적한 연구(Malisoux 2020)에서 딱딱한 신발은 체중과 상관없이 부상 위험이 높았고, 무거운 러너라고 두꺼운 쿠션의 추가 이득이 확인되지는 않았어요. 쿠션은 신어 보고 편한 쪽으로 고르면 돼요.";

  const heightNote =
    profile.heightCm <= 163 ? "키 기준으로 앞뒤 굽 차이(드롭)가 작은 신발에 점수를 조금 더 줬어요 — 근거 논문이 없는 사이트 기준이에요." :
    profile.heightCm >= 178 ? "키 기준으로 뒤꿈치가 조금 높은(드롭이 큰) 신발에 점수를 조금 더 줬어요 — 근거 논문이 없는 사이트 기준이에요." : "";

  const genderNote = profile.gender === "female"
    ? "여성 발은 남성 발의 축소판이 아니라는 연구(Wunderlich 2001)가 있어 여성 전용 라스트에 점수를 더 줬어요. 성별로 안정화·중립 신발을 나누지는 않았어요 — 그렇게 할 근거가 확인되지 않아서요."
    : profile.gender === "male"
    ? "성별로 안정화·중립 신발을 나누지는 않았어요 — 그렇게 할 근거가 확인되지 않아서요."
    : "";

  const widthNote = profile.footWidth !== "narrow"
    ? "발볼을 보통·넓음으로 고르셔서 앞쪽이 넉넉한 신발에 점수를 더 줬어요."
    : "";

  const injuries = (profile.injuryHistory ?? []).filter((i) => i !== "none");
  const injuryNote = injuries.length
    ? `예전에 다친 부위(${injuries.map((i) => INJURY_LABEL[i]).join("·")})를 사이트 기준으로 반영했어요. 신발로 부상이 낫는다는 근거는 약해요 — 아프면 병원부터 가보세요.`
    : "";

  const flatNote = profile.footType === "flat"
    ? "평발을 고르셔서 안정화 신발에 점수를 더 줬지만, 근거가 연구 1건이고 스스로 느끼는 평발과 연구의 측정 기준이 달라 3개 중 1개는 중립 신발로 채웠어요."
    : "";

  const levelNote = profile.level === "beginner"
    ? "이제 막 시작한 단계라 카본 레이싱화는 안정감·수명·가격 때문에 점수를 낮췄어요."
    : "";

  return [weightNote, flatNote, heightNote, genderNote, widthNote, levelNote, injuryNote].filter(Boolean).join(" ");
}

/** 결과 하단 안내 — 학술 인용 대신 편안한 참고용 한 줄(부담↓·중립성 유지) */
function buildEvidenceNote(profile: RunnerProfile): string {
  void profile;
  return "이 추천은 입력한 정보로 계산한 참고 가이드예요. 근거가 있는 항목과 사이트 기준인 항목이 섞여 있어서, 각 이유 옆에 어느 쪽인지 적었어요. 마음에 드는 후보를 신어보고 가장 편한 걸 고르면 돼요. 적합도는 100에서 잘라 보여 주고, 같은 점수면 정가 낮은 순으로 줄 세운 뒤 3개는 브랜드가 겹치지 않게 골랐어요. 제휴 링크 여부는 점수에 들어가지 않아요.";
}

/**
 * 전 신발을 이 프로필 기준으로 줄 세운다 — `/shoes` 「내 조건으로 보기」 (2026-09-16)
 *
 * `recommendShoes` 는 3개를 고르는 함수라 조건 밖 신발을 버린다. 목록은 **버리지 않고 나눈다** —
 * 조건에 맞는 것(발볼·용도·예산 통과)을 점수순으로 먼저, 나머지는 뒤에 따로.
 * 점수와 이유는 `recommendShoes` 와 **같은 `scoreShoe`** 를 쓴다. 두 화면이 다른 순서를 내면 안 된다.
 */
export function rankAllShoes(
  profile: RunnerProfile
): { id: string; score: number; reason: string | null; fits: boolean }[] {
  const bodyType = getBodyType(profile.heightCm, profile.weightKg);
  const budget = profile.budgetKrw && profile.budgetKrw > 0 ? profile.budgetKrw : null;
  return RECOMMENDABLE.map((shoe) => scoreShoe(shoe, profile, bodyType))
    .filter((s) => s.eligible)
    .sort(byRank)
    .map((s) => ({
      id: s.shoe.id,
      score: s.score,
      // 모든 카드가 「체형에 최적화」로 같아 보이지 않게, 체형 말고 다른 이유가 있으면 그걸 먼저 낸다
      reason: s.reasons[0] ?? null,
      fits: s.widthOk && s.useOk && (!budget || s.shoe.priceKrw <= budget),
    }))
    .sort((a, b) => Number(b.fits) - Number(a.fits) || b.score - a.score);
}
