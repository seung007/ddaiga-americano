import { SHOES } from "@/lib/shoes/data";
import type { Shoe } from "@/lib/shoes/types";

/**
 * 브랜드 비교 — 검색 수요 1위에 답하는 페이지의 데이터층.
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 만들었나 (2026-09-08)
 *
 * 네이버 실측 유입 검색어에서 **`호카 브룩스 비교` 가 11.36%** 로 1위였다.
 * 두 번째 검색어의 5배다. 그런데 이 사이트에는 **브랜드 단위 비교 페이지가
 * 없었다** — `/compare/[slug]` 는 모델쌍(`clifton-10-vs-ghost-17`)만 다룬다.
 * 사람들이 묻는 단위와 사이트가 답하는 단위가 달랐다.
 *
 * ─────────────────────────────────────────────────────────────
 * 숫자를 **계산한다.** 브랜드 인상을 적지 않는다.
 *
 * "호카는 푹신하고 브룩스는 단단하다" 같은 문장은 어디에나 있고, 근거가 없다.
 * 이 사이트가 내놓을 수 있는 유일하게 다른 것은 **자기가 검증한 스펙의 집계**다.
 * 그래서 이 파일에는 상수가 없다 — 전부 `SHOES` 에서 계산한다.
 * 데이터가 바뀌면 페이지 숫자가 따라 바뀐다. 손으로 적으면 곧 어긋난다.
 *
 * ⚠️ 표본이 작다(브랜드당 4~6개). 그래서 `sampleSize` 를 **화면에 같이 내보낸다.**
 * `AGENTS.md` §5 — 근거의 무게를 넘겨 쓰지 않는다. "호카는 ~다"가 아니라
 * "이 사이트가 검증한 호카 6개는 ~다"로 쓴다.
 *
 * ⚠️ 그리고 **주장할 수 없는 것**이 있다. `lib/shoes/recommend.ts` 는 신장×드롭
 * 휴리스틱에 **뒷받침 논문이 없다**고 스스로 적어 뒀고(같은 파일 6·82~85행),
 * `app/injury/plantar-fasciitis` 는 특정 드롭·쿠션이 족저근막 통증을 낫게 한다는
 * 좋은 근거가 없다고 적었다. 그러니 이 페이지도 그 선을 넘지 않는다 —
 * 근거가 있는 것은 **아킬레스 이력 시 드롭 8mm 이상**(recommend.ts 304~306) 뿐이다.
 */

/** 여성 전용 라스트(`-w`)는 같은 신발의 변형이라 집계에서 뺀다 — 안 빼면 브랜드 평균이 중복 계산된다. */
function brandShoes(brand: string): Shoe[] {
  return SHOES.filter((s) => s.brand === brand && s.gender !== "female");
}

/**
 * 평균을 낼 대상 — **카본 레이싱화를 뺀 데일리 트레이너만.**
 *
 * ⚠️ 2026-09-08 정정. 처음에는 브랜드의 모든 신발을 한 통에 넣고 평균을 냈다.
 * 그게 틀렸다는 걸 나이키를 넣어 보고 알았다:
 *
 *   나이키 6개 중 **3개가 카본 레이싱화**다 — Vaporfly 4(166g), Alphafly 3(198g),
 *   Pegasus Plus. 그래서 무게 평균이 240.7g 으로 나온다.
 *   같은 계산으로 호카는 268.5g 이다. "나이키가 28g 가볍다"고 쓰면
 *   **레이싱화 셋과 데일리화 다섯을 비교한 것**이 된다.
 *
 * 호카 vs 브룩스에도 같은 오염이 있었다 — 호카 쪽에 Rocket X 2(카본, 224g)가
 * 하나 들어가서 무게 평균이 268.5g 이었다. 데일리만 보면 **277.4g** 이고,
 * 브룩스와의 차이가 43.8g 에서 **34.9g** 으로 줄어든다.
 * 결론(드롭 범위가 안 겹친다)은 그대로지만 **내가 배포한 숫자가 틀렸다.**
 *
 * 교훈: **평균을 내기 전에 같은 종류인지 먼저 확인한다.**
 * 이 저장소에 이미 있는 규칙과 같다 — 검사를 만들 때도 같은 것끼리 비교하는지 본다.
 * 카본화는 용도·무게·가격이 다른 제품군이라 브랜드의 "보통 신발"을 대표하지 않는다.
 *
 * 카본화 자체가 궁금한 사람도 있으니 개수는 따로 내보낸다(`carbonCount`).
 */
function dailyShoes(shoes: Shoe[]): Shoe[] {
  return shoes.filter((s) => !s.hasCarbon);
}

function avg(ns: number[]): number {
  return ns.length ? ns.reduce((a, b) => a + b, 0) / ns.length : 0;
}

export type BrandStats = {
  brand: string;
  /** 화면에 쓰는 한글 이름 */
  ko: string;
  /** **평균에 들어간 개수** — 카본 레이싱화를 뺀 데일리 트레이너 수다. */
  sampleSize: number;
  /** 평균에서 제외한 카본화 수. 화면에 같이 밝힌다. */
  carbonCount: number;
  /** 후속 모델이 안 나온 것 = 현행 */
  currentCount: number;
  dropAvg: number;
  dropMin: number;
  dropMax: number;
  stackAvg: number;
  weightAvg: number;
  cushionAvg: number;
  priceAvg: number;
  /** 4E(초광폭) 옵션을 제공하는 모델 수 */
  wide4E: number;
  /** 2E(광폭) 이상을 제공하는 모델 수 */
  wide2EPlus: number;
  /** neutral / stability / motion_control 별 개수 */
  stability: Record<string, number>;
  shoes: Shoe[];
};

export function brandStats(brand: string, ko: string): BrandStats {
  const all = brandShoes(brand);
  // 평균은 데일리 트레이너만으로 낸다. 이유는 `dailyShoes` 주석에.
  const shoes = dailyShoes(all);
  const stability: Record<string, number> = {};
  for (const s of shoes) stability[s.stability] = (stability[s.stability] ?? 0) + 1;

  const has = (s: Shoe, w: "2E" | "4E") => s.widthOptions.includes(w);

  return {
    brand,
    ko,
    sampleSize: shoes.length,
    carbonCount: all.length - shoes.length,
    currentCount: shoes.filter((s) => !s.successor).length,
    dropAvg: avg(shoes.map((s) => s.heelDropMm)),
    dropMin: Math.min(...shoes.map((s) => s.heelDropMm)),
    dropMax: Math.max(...shoes.map((s) => s.heelDropMm)),
    stackAvg: avg(shoes.map((s) => s.stackHeightMm)),
    weightAvg: avg(shoes.map((s) => s.weightGramsM9)),
    cushionAvg: avg(shoes.map((s) => s.cushioning)),
    priceAvg: avg(shoes.map((s) => s.priceKrw)),
    wide4E: shoes.filter((s) => has(s, "4E")).length,
    wide2EPlus: shoes.filter((s) => has(s, "2E") || has(s, "4E")).length,
    stability,
    shoes,
  };
}

/**
 * 두 브랜드의 드롭 범위가 겹치는지.
 *
 * 겹치지 않는다는 것은 **취향이 아니라 조건으로 갈린다**는 뜻이라 결론이 세진다.
 * 겹치면 그렇게 말해야 한다 — 계산해서 화면이 문장을 고르게 한다.
 */
export function dropOverlap(a: BrandStats, b: BrandStats): boolean {
  return a.dropMin <= b.dropMax && b.dropMin <= a.dropMax;
}

/** 현행(후속 미출시) 모델만. 구형을 첫 화면에 앞세우지 않는다. */
export function currentShoes(s: BrandStats): Shoe[] {
  return s.shoes.filter((x) => !x.successor);
}

export const HOKA = brandStats("Hoka", "호카");
export const BROOKS = brandStats("Brooks", "브룩스");
