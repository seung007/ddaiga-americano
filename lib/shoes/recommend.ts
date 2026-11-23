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
 *    정했다(신발을 추가하면 추천이 조용히 바뀜). 이제 잘리기 전 점수 → 정가 → id 순.
 *    2026-11-23 hyun 님 결정: 예산 「상관없음」이면 정가 **높은** 순(같은 정도로 맞으면 상위 모델 먼저), 예산을 고르면 낮은 순.
 *  · 2026-11-23 hyun 님 결정: 화면에는 확실한 것만 이유로 보여 준다. 근거가 약하거나 사이트가 정한 가점은 점수에만 두고
 *    이유 문구(reasons)에 올리지 않는다 — 전에는 「사이트 기준」「근거는 약해요」를 붙여 보여 줬다. 점수 자체를 무엇으로 바꿀지는 별도 보고.
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

import { MANUAL_SHOES, SHOES } from "./data";
import { officialOf } from "./official";
import type {
  BodyType, FootType, FootWidth, Gender, Recommendation,
  RecommendableShoe, RunnerProfile, Shoe, WidthOption,
} from "./types";
import { getBodyType, INJURY_LABEL, isRecommendable, withFootTypes } from "./types";

/**
 * 추천이 보는 후보 — **`SHOES` 를 직접 쓰지 말 것.**
 *
 * 2026-09-21: 러닝화를 늘리면서 판단 필드(발 타입·권장 체중·체형)를 못 채운 신발이
 * 목록에 들어온다. 그런 신발은 **"당신에게 맞습니다"라고 말할 근거가 없다.**
 * 여기서 한 번 걸러서 `recommendShoes` 와 `rankAllShoes` 가 같은 후보를 보게 한다.
 * 두 함수가 다른 배열을 쓰면 폼 결과와 목록 정렬이 어긋난다.
 */
// 2026-11-10: 106종 전부 후보 — footTypes 가 빈 신발은 안정성 구조에서 정한다(types.ts footTypesFromStability 머리말)
// 2026-11-10: 공식몰 자동 확인 다음 세대(lib/shoes/auto.ts)도 후보다 — 이전 세대 분류를 물려받는다.
//   단 추천 엔진 회귀 검사(scripts/check-engine.mjs)는 사람 원장만 본다(ENGINE_MANUAL_ONLY=1). 자동 신발이 들어올 때마다
//   스냅샷이 바뀌어 수집기 푸시가 막히면 안 되기 때문이다. 화면(브라우저·빌드)에서는 이 값이 없어 전체를 본다
const POOL = typeof process !== "undefined" && process.env?.ENGINE_MANUAL_ONLY === "1" ? MANUAL_SHOES : SHOES;
const RECOMMENDABLE: RecommendableShoe[] = POOL.map(withFootTypes).filter(isRecommendable);
/** 추천 계산에 들어가는 신발 수 — 화면 문구(「러닝화 N종의 스펙 데이터로…」)는 이 값을 쓴다. 손으로 숫자를 적지 않는다 */
export const RECOMMENDABLE_COUNT = RECOMMENDABLE.length;

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
 * 성별 후보 (2026-11-23 hyun 님 결정 「남녀 같이 팔면 같이 보여주고, 진짜 여성 전용이면 여성만」)
 *
 * 같은 모델의 여성판(`variantOf` 가 있는 신발)과 남녀 공용판이 따로 들어 있다. 한 사람에게는 한 모델에 한 카드만 보인다.
 *  · 여성을 고르면: 여성판이 있는 모델은 여성판으로(여성 무게·폭·구매처), 공용판은 뺀다
 *  · 남성·미선택: 여성판은 뺀다
 *  · 여성판이 없는 여성 전용 모델(genderFit womens_last, variantOf 없음)은 지금처럼 여성에게만
 */
/**
 * 판매 종료 — 추천에서만 뺀다 (2026-11-23 hyun 님 결정: 「지우지 않고 숨김. 서로 다른 날 2번 안 보임 + 후속 모델이 사이트에 있음」)
 * 「2번 안 보임」은 수집기가 official.json 의 listed:false 로 적는다(official.ts — 「2일 연속 안 보였다」). 후속 모델은 이 사이트 목록에 있어야 한다.
 * 목록·상세에는 그대로 남는다. ⚠️ 2026-11-23 지금 수집기는 이름이 똑같이 맞는 신발만 기록해서 구형 모델에는 listed 기록이 없다 —
 * 그래서 지금은 이 규칙에 걸리는 신발이 0이다. 수집기 쪽 할 일은 세션 지시서 「코드 ①」.
 */
function successorOnSite(shoe: Shoe): boolean {
  if (!shoe.successor) return false;
  const name = shoe.successor.replace(/ \(여성\)$/, "");
  return POOL.some((x) => x.brand === shoe.brand && x.model.replace(/ \(여성\)$/, "") === name);
}
function isEnded(shoe: Shoe): boolean {
  return officialOf(shoe.id)?.listed === false && successorOnSite(shoe);
}
const HAS_WOMENS = new Set(POOL.map((s) => s.variantOf).filter((v): v is string => !!v));
function isGenderEligible(shoe: Shoe, gender?: Gender): boolean {
  if (isEnded(shoe)) return false;
  if (shoe.variantOf) return gender === "female";
  if (gender === "female" && HAS_WOMENS.has(shoe.id)) return false;
  if ((shoe.genderFit ?? "unisex") === "womens_last") return gender === "female";
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
  /** 이 프로필이 받을 수 있는 최고점 (화면 점수의 분모) */
  possible: number;
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
  // 이 프로필이 받을 수 있는 최고점. 규칙마다 그 자리에서 같이 더한다 — 가점을 고치면 바로 옆 줄도 같이 고친다.
  // **프로필만 보고 정한다(신발 값을 보지 않는다).** 그래야 한 사람의 모든 신발이 같은 값으로 나뉘어 순위가 안 바뀐다.
  let possible = 0;
  // 맞춰 보지 않고 모든 신발에 똑같이 주는 점수를 화면 점수에서 빼는 자리(2026-11-18). 2026-11-23 근거 정리로
  // 그런 점수(보통 발 +4, 용도 미선택 +6)가 모두 없어져 지금은 0 이다. 같은 종류의 점수를 다시 넣으면 여기에 더한다.
  let free = 0;

  // ── 1. 체형 분류 매칭 — 2026-10-06 점수에서 뺐다 ───────────
  // 체형 태그는 키×체중 조합이고 출처 기록이 없다(types.ts 판단 필드). 키 부분만 남기는 안도 봤지만
  // tall_heavy 같은 태그가 체중 가정을 그대로 실어 나른다. 키도 2026-11-23부터 점수에 쓰지 않는다(아래 5번).
  // bodyTypeMatch 는 화면 표시와 하위 호환을 위해 false 로 둔다.
  void bodyType;
  const bodyTypeMatch = false;

  // ── 2. 발볼 (20점) ─────────────────────────────────────────
  const widthOk = hasMatchingWidth(shoe, profile.footWidth);
  possible += 20;
  if (widthOk) {
    score += 20;
    reasons.push(`${profile.footWidth === "wide" ? "넓은" : profile.footWidth === "narrow" ? "좁은" : "보통"} 발볼에 맞는 폭이 있어요`);
  }

  // ══ 3~9. 점수마다 근거를 붙였다 (2026-11-23, 세션 지시서 5절 가 — hyun 님 「근거 없는 점수는 근거가 되게」) ══
  //
  // 규칙: 점수마다 그 점수가 말하는 것을 한 문장으로 적고, 그 문장을 직접 시험한 논문의 초록을 읽었다(QxMD, 2026-11-23).
  //   · 근거가 있으면 근거의 세기에 맞춰 점수 크기를 정했다(여러 연구 일치 > 시험 1건 > 하위 집단 분석)
  //   · 근거가 다른 말을 하면 근거대로 바꿨다(굽 차이: 키 → 뛰는 빈도)
  //   · 찾았는데 없거나 근거가 반대면 0점. 찾은 범위를 아래에 남겼다. 화면에는 아무 말도 하지 않는다
  // 전체 점수 표: PR #26 본문(feat/recommend-evidence).
  //
  // 이 묶음 전체에 걸리는 고찰: Cochrane 2022(PMID 35993829) — 신발 종류(최소·중립·모션컨트롤·안정화·쿠션 경도)가
  //   다리 부상을 줄인다는 근거는 「대부분 없음」(확실성 매우 낮음~낮음). 「발 모양으로 신발을 처방해도 부상이 줄지 않았다」
  //   (확실성 중간, 군인 대상 시험 3건). 그래서 부상 예방을 이유로 큰 점수를 주지 않는다.

  // ── 3. 발 모양 ───────────────────────────────────────────
  // (옛) 발 모양에 맞춘 신발 +12 — 0점. 발 모양으로 신발을 고르는 것을 직접 시험한 무작위 시험(Knapik 2009 J Strength Cond Res,
  //   신병 3,062명, PMID 19387413)이 위험비 남 1.01·여 1.07 로 차이가 없었고, Cochrane 2022 도 같은 결론(확실성 중간).
  // (옛) 높은 아치 → 일반 신발 +3 / 안정화 −2 — 0점. 높은 아치만 따로 본 시험·코호트를 찾지 못했다
  //   (검색: 「high arch pes cavus runners injury risk footwear prospective cohort randomized shoe」, 2026-11-23).
  // 평발(본인이 「안쪽으로 쏠리는 편」을 고름) → 안정화 +3 — 유지. Malisoux 2016 Br J Sports Med(372명 무작위 시험, PMID 26746907):
  //   모션컨트롤화가 전체 부상 위험을 낮췄고(HR 0.55, 0.36–0.85) 회내 발 하위 집단에서 0.34(0.13–0.84, 94명 — 2차 분석).
  //   반대쪽 근거: Nielsen 2014 Br J Sports Med(초보 927명 코호트) — 중립화를 신은 회내 발이 부상이 더 많지 않았다
  //   (위험 차 −8.1%, −17.6~1.3%). 그래서 가점만 작게 두고, 평발인데 일반 신발이라고 감점하던 −2 는 뺐다.
  //   ⚠️ 사용자 입력은 자가 보고라 논문의 발 자세 측정(FPI)과 같지 않다.
  possible += profile.footType === "flat" ? 3 : 0;
  if (profile.footType === "flat" && shoe.stability !== "neutral") score += 3;

  // ── 3b. 성별 ────────────────────────────────────────────
  // (옛) 여성 전용 라스트 +12 / 남성 라스트 −5(여성) / +3(남성) — 0점. 근거로 든 Wunderlich & Cavanagh 2001(Med Sci Sports Exerc,
  //   PMID 11283437)은 남녀 발 모양이 다르다는 측정 연구이고, 신발 착용감·부상을 시험하지 않았다(초록 확인).
  //   +12 때문에 여성 입력 216개 전부에서 1위가 여성판 7종이었다(2026-11-23 실측). 대신 여성에게는 같은 모델의
  //   **여성판 자체**(여성 무게·폭·구매처)를 보여 준다 — 아래 recommendShoes 의 성별별 후보(variantOf).
  const genderFitMatch = false;
  const genderFitNote: string | undefined = undefined;

  // ── 3c. 넓은 앞볼 ───────────────────────────────────────
  // 본인이 발볼 「넓음」을 고르면 앞볼이 넓은 신발 +4. Buldt & Menz 2018 J Foot Ankle Res(체계적 검색, PMID 30065787):
  //   발 폭·길이에 안 맞는 신발을 신는 사람이 63~72%였고, 맞지 않는 신발은 발 통증·질환과 관련이 있었다(달리기만의 연구는 아님).
  // (옛) 「한국인 발」 — 보통 발볼에도 앞볼 넓은 신발 +4, 발등 높은 신발 +2 — 0점. 나라끼리 비교한 자료를 찾지 못했고,
  //   발등은 사용자에게 묻지 않는 값이라 그 사람에게 맞는지 알 수 없다. 여성 넓은 앞볼 +4 와 겹치던 것도 하나로 합쳤다.
  possible += profile.footWidth === "wide" ? 4 : 0;
  if (profile.footWidth === "wide" && isWideForefoot(shoe)) {
    score += 4;
    reasons.push("앞쪽이 넉넉한 편이에요");
  }

  // ── 4. 체중 × 쿠셔닝 — 2026-10-06 삭제 ─────────────────────
  // 권장 체중 범위(+14/+7/+4)와 최소 쿠션 등급(+6/+4/+2, 미달 시 등급당 −7)을 모두 뺐다. 맨 위 v4 설명 참고.

  // ── 5. 앞뒤 굽 차이 — 키 기준 → 뛰는 빈도 기준 (2026-11-23) ──────────
  // (옛) 키별 굽 차이 10/5점 — 키와 굽 차이를 잇는 자료를 찾지 못했다.
  // Malisoux 2016 Am J Sports Med(553명 무작위 시험 6개월, 굽 차이 10·6·0mm, PMID 27501833): 전체 부상 위험은 굽 차이와 무관.
  //   하위 집단에서 「가끔 뛰는 사람」(지난 12개월 중 매주 뛴 기간 6개월 미만)은 낮은 굽(6·0mm)이 위험이 낮았고(HR 0.48, 0.23–0.98),
  //   「꾸준히 뛰는 사람」(6개월 이상)은 높았다(HR 1.67, 1.07–2.62).
  //   하위 집단 분석이고 한쪽 신뢰구간 상한이 0.98 이라 점수는 작게(4). 이유로 보여 주지 않는다.
  //   ⚠️ 프록시: 경험 「이제 막 시작했어요」 → 가끔 뛰는 사람, 「하프까지 뛰어 봤어요」·「기록을 줄이는 중이에요」 → 꾸준히 뛰는 사람.
  //   경험을 고르지 않으면 이 점수는 없다. 논문의 두 묶음(6mm 이하 / 10mm)에 맞춰 6mm 이하 / 8mm 이상으로 나눴다(7mm 는 어느 쪽도 아님).
  const occasional = profile.level === "beginner";
  const regular = profile.level === "intermediate" || profile.level === "advanced";
  possible += occasional || regular ? 4 : 0;
  if (occasional && shoe.heelDropMm <= 6) score += 4;
  if (regular && shoe.heelDropMm >= 8) score += 4;

  // ── 6. 용도 (15점) — 사용자가 고른 목적에 맞는지. 건강 효과를 주장하는 점수가 아니라 선택과의 일치라 유지 ──
  let useOk = true;
  possible += profile.use ? 15 : 0;
  if (profile.use) {
    useOk = shoe.uses.includes(profile.use);
    if (useOk) { score += 15; reasons.push("고른 용도에 맞아요"); }
    else score -= 5;
  }

  // ── 7. 경험 수준 ─────────────────────────────────────────
  // (옛) 입문자 카본화 −12 — 0점. 느린 속도에서는 효과가 없다는 전제는 틀렸다: Bolliger 2026 Sports Med Open(14명 교차 시험,
  //   PMID 41703164) — 시속 7.5~12km 에서도 산소 비용이 낮았고 차이는 속도와 무관했다. 입문자에게 해롭다는 시험은 찾지 못했다
  //   카본화 사용자 뼈 피로 손상 사례 보고(Tenforde 2023 Sports Med, doi:10.1007/s40279-023-01818-z)는 엘리트·대회 선수 5명의
  //   사례 묶음이고 저자도 원인이라고 말하지 않았다(「위험을 따져 봐야 한다」). 입문자 감점의 근거가 되지 못한다.
  //   입문자가 「일상 달리기」를 고르면 대회 전용화는 이미 용도 점수(−5)로 뒤로 간다.
  // (옛) 입문자 쿠션 있는 일상화 +4 — 0점. 쿠션 근거인 Malisoux 2020 Am J Sports Med(848명, PMID 31877062)는 밑창의 **딱딱한 정도**
  //   (61.3 vs 94.9 N/mm)를 비교했다. 우리 쿠션 단계는 밑창 **두께** 분류라 같은 변수가 아니다(data.ts 주석).
  // (옛) 고급 → 템포·레이싱 +3 — 0점. 효과를 주장할 근거가 없고 용도 질문이 같은 일을 한다.

  // ── 8. 주 평균 거리 ──────────────────────────────────────
  // (옛) 장거리 → 쿠션 4 이상 +6 / 쿠션 2 이하 −6, 단거리 → 250g 이하 +3 — 0점. 주간 거리와 쿠션·무게의 관계를 시험한 연구를
  //   찾지 못했다(검색: 「weekly running distance mileage shoe cushioning injury risk interaction study」, 2026-11-23).
  //   거리 질문은 화면에 남는다(질문 교체는 세션 ⑥에서 오픈채팅 집계를 보고 정한다).

  // ── 9. 부상 이력 ─────────────────────────────────────────
  // 무릎 · 발목 · 아킬레스 · 발바닥 이력 가점 — 모두 0점.
  //   · 무릎: 달리기 무릎 부상 예방·관리 무작위 시험 체계적 고찰(Br J Sports Med 2022, PMID 36150753) — 여러 신발이 무릎 부상
  //     위험을 바꾸지 않았다(확실성 매우 낮음~낮음)
  //   · 발목: 안정화·모션컨트롤화 효과는 불확실(Cochrane 2022)
  //   · 아킬레스: 신발 구조 체계적 고찰(J Sports Sci Med 2020, PMID 32132824) — 굽 차이는 「지침을 만들기 전에 더 연구가 필요」.
  //     흔들의자형 밑창이 아킬레스 부하를 줄인 연구(PMID 24636129, 13명)는 굽 차이가 아니라 다른 구조라 쓰지 않았다
  //   · 발바닥: 발뒤꿈치 통증 진료 지침 2023 개정(JOSPT, PMID 38037331, orthopt.org PDF 전문 확인) — 신발·쿠션·흔들의자형 밑창
  //     권고가 하나도 없다. 깔창은 단독 치료로 쓰지 말 것(B등급), 다른 치료와 함께는 쓸 수 있음(C등급)뿐이다
  //   질문은 화면에 남고 「지금 아프면 병원부터」 안내에 쓰인다.

  // ── 10. 예산 (PRD F-01 수용기준) — 하드 필터는 recommendShoes에서 처리 ──
  // 여기서는 예산 내 모델에 소폭 가점만 (초과 모델은 이미 후보에서 제외됨)
  if (profile.budgetKrw && profile.budgetKrw > 0) possible += 5;
  if (profile.budgetKrw && profile.budgetKrw > 0 && shoe.priceKrw <= profile.budgetKrw) {
    score += 5;
    reasons.push(`예산 ${profile.budgetKrw.toLocaleString()}원 안이에요`);
  }

  return {
    shoe,
    // 2026-11-18: 화면 점수 = 받을 수 있는 최고점 대비 %.
    // 이전에는 가점 합계를 그대로 보여 줬다. 근거가 약한 가점을 줄여 오면서(안정화 +8→+3, 체중 점수 삭제 등)
    // 조건이 다 맞아도 60~75 에 머물렀다(648 프로필 1위 점수: 최고 75·중앙값 66·80 이상 0건). 추천이 나빠진 게 아니라 눈금이 틀어진 것.
    // 100 은 「완벽한 신발」이 아니라 「고른 조건에 모두 맞음(사이트 기준)」이다 — 화면 문구도 그렇게 쓴다.
    // 순위는 rawScore 로 정한다(rankBy). possible·free 가 프로필 고정값이라 % 순서와 같다.
    score: Math.max(0, Math.min(100, Math.round(((score - free) / possible) * 100))),
    rawScore: score,
    possible,
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
}

/**
 * 공개 동점 규칙 (2026-10-06) — 잘리기 전 점수 → 정가 → id 순.
 * 2026-11-23 hyun 님 결정: 예산 「상관없음」이면 정가 높은 순(맞는 정도가 같으면 상위 모델 먼저), 예산을 고르면 정가 낮은 순.
 * 약관 3항에 같은 규칙을 적는다. 바꾸면 약관도 바꿀 것.
 */
function rankBy(hasBudget: boolean) {
  return (a: Scored, b: Scored): number =>
    b.rawScore - a.rawScore ||
    (hasBudget ? a.shoe.priceKrw - b.shoe.priceKrw : b.shoe.priceKrw - a.shoe.priceKrw) ||
    a.shoe.id.localeCompare(b.shoe.id);
}

/**
 * 상위 N개 고르기 (2026-10-06 hyun 결정)
 *
 * 체중·체형 점수를 빼자 점수 차이를 만들던 요소가 줄어 두 가지가 생겼다(648 프로필 실측).
 *  ① 평발 가점이 결정권을 가져 평발 사용자 상위 3개가 **100% 안정화**가 됐다(전 56%).
 *     근거 수준(회내 발 RCT 1건, 자가보고 ≠ FPI)에 비해 너무 세다 → **평발이면 안정화 최대 limit−1 + 중립 1**(4켤레면 3 + 1, 2026-11-23 전 3켤레일 때 2 + 1).
 *  ② 1·2위 동점이 80% — 정가 낮은 순만 쓰면 같은 브랜드 싼 모델이 줄줄이 차지한다
 *     → **상위 N개는 브랜드가 겹치지 않게**(후보가 모자라면 그때만 겹침 허용).
 * 약관 3항에 같은 규칙을 적는다(2026-11-10 화면 문구에서는 뺐다). 바꾸면 거기도 바꿀 것.
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

export function recommendShoes(profile: RunnerProfile, limit = 4): RecommendResult {
  const bodyType = getBodyType(profile.heightCm, profile.weightKg);
  const profileComment = buildProfileComment(profile);
  const evidenceNote = buildEvidenceNote(profile);

  // 성별 자격(여성 전용 라스트는 여성에게만) 통과한 후보만 사용
  const scoredAll = RECOMMENDABLE
    .map((shoe) => scoreShoe(shoe, profile, bodyType))
    .filter((s) => s.eligible);

  // 예산은 '하드 필터' — 선택 시 예산 초과 모델은 후보에서 제외
  const budget = profile.budgetKrw && profile.budgetKrw > 0 ? profile.budgetKrw : null;
  const scored = budget ? scoredAll.filter((s) => s.shoe.priceKrw <= budget) : scoredAll;
  const byRank = rankBy(budget !== null);

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
    return { primary, usedFallback: false, fallbackNote: "", profileComment, evidenceNote, bodyType };
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
      fallbackNote: `${budget.toLocaleString()}원 이하 신발은 아직 없어요. 가장 싼 신발이 약 ${cheapest.toLocaleString()}원이라 그 근처 가격으로 보여 드려요.`,
      profileComment, evidenceNote, bodyType,
    };
  }

  const note = pool.length === 1
    ? "조건에 꼭 맞는 신발이 1켤레뿐이라 비슷한 신발을 더 보여 드려요."
    // 2026-11-10: 영문 값('daily')이 화면에 그대로 나오던 문구를 고쳤다
    : `고른 용도와 발볼${budget ? ", 예산" : ""}에 모두 맞는 신발이 없어서 가장 가까운 순으로 보여 드려요.`;

  // 폴백도 예산은 지킴(가능할 때) — scored(예산 적용)에서 우선
  const fallback = pickTop(scored.sort(byRank), profile, limit)
    .map((s) => toRec(s, true));

  return { primary: fallback, usedFallback: true, fallbackNote: note, profileComment, evidenceNote, bodyType };
}

/**
 * 내 분석 결과 — 쉬운 말 (일반인/런린이용)
 * 전문용어(Q앵글·과회내·드롭·라스트)는 괄호로 풀어서 설명.
 */
function buildProfileComment(profile: RunnerProfile): string {
  // 2026-11-10 운영자 「왜 이렇게 길어, 고객이 이해만 되게」: 연구 이름·수치·「반영 안 한 것」 설명을 뺐다.
  //   남긴 것은 **이 사람의 결과를 바꾼 것**만, 한 줄씩. 2026-11-23: 근거가 약한 것은 보여 주지 않는다(「사이트 기준」 표시도 하지 않는다).
  //   예전 문구(체중 미반영의 근거 Malisoux 2020, 성별 근거 Wunderlich 2001)는 맨 위 v4 설명에 남아 있다.
  const lines: string[] = [];
  if (profile.footWidth === "wide") lines.push("발볼이 넓어서 앞쪽이 넉넉한 신발을 먼저 골랐어요.");
  if (profile.footType === "flat") lines.push("평발이라 안정화 신발을 넣고, 1켤레는 일반 신발로 골랐어요.");
  if (profile.gender === "female") lines.push("여성용이 따로 나오는 신발은 여성용 무게와 발볼로 보여 드려요.");
  // 2026-11-23: 키 → 굽 차이 줄(「사이트 기준」)을 뺐다. 근거 없는 가점은 이유로 보여 주지 않는다(맨 위 v4 설명)
  const injuries = (profile.injuryHistory ?? []).filter((i) => i !== "none");
  if (injuries.length) {
    const EASY: Record<string, string> = { knee: "무릎", ankle: "발목", achilles: "종아리·뒤꿈치 위", plantar: "발바닥" };
    lines.push(`다친 적 있는 곳(${injuries.map((i) => EASY[i] ?? INJURY_LABEL[i]).join("·")})이 지금 아프다면 신발보다 병원 진료가 먼저예요.`);
  }
  return lines.join(" ");
}

/** 결과 하단 안내 — 학술 인용 대신 편안한 참고용 한 줄(부담↓·중립성 유지) */
function buildEvidenceNote(profile: RunnerProfile): string {
  void profile;
  // 2026-11-10: 점수 자르기·동점·브랜드 규칙과 제휴 문구를 뺐다(운영자 「쓸데없는 말」). 규칙은 약관 3항과 이 파일 주석에 그대로 있다.
  //   쿠팡 파트너스 고지는 링크가 있는 화면의 AffiliateNotice 가 따로 한다 — 법적 표시라 지우지 않는다.
  return "신어 보고 가장 편한 걸 고르세요.";
}

/**
 * 전 신발을 이 프로필 기준으로 줄 세운다 — `/shoes` 「내 조건으로 보기」 (2026-09-16)
 *
 * `recommendShoes` 는 4개(2026-11-23 전에는 3개)를 고르는 함수라 조건 밖 신발을 버린다. 목록은 **버리지 않고 나눈다** —
 * 조건에 맞는 것(발볼·용도·예산 통과)을 점수순으로 먼저, 나머지는 뒤에 따로.
 * 점수와 이유는 `recommendShoes` 와 **같은 `scoreShoe`** 를 쓴다. 두 화면이 다른 순서를 내면 안 된다.
 */
export function rankAllShoes(
  profile: RunnerProfile
): { id: string; score: number; reason: string | null; fits: boolean }[] {
  const bodyType = getBodyType(profile.heightCm, profile.weightKg);
  const budget = profile.budgetKrw && profile.budgetKrw > 0 ? profile.budgetKrw : null;
  const byRank = rankBy(budget !== null);
  return RECOMMENDABLE.map((shoe) => scoreShoe(shoe, profile, bodyType))
    .filter((s) => s.eligible)
    .sort(byRank)
    .map((s) => ({
      // 목록은 여성판을 공용판 카드 하나로 보여 준다 — 여성판 점수는 공용판 카드 자리로 (2026-11-23)
      id: s.shoe.variantOf ?? s.shoe.id,
      score: s.score,
      // 모든 카드가 「체형에 최적화」로 같아 보이지 않게, 체형 말고 다른 이유가 있으면 그걸 먼저 낸다
      reason: s.reasons[0] ?? null,
      fits: s.widthOk && s.useOk && (!budget || s.shoe.priceKrw <= budget),
    }))
    .sort((a, b) => Number(b.fits) - Number(a.fits) || b.score - a.score);
}
