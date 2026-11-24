import SPECS_JSON from "./specs.json";
import type { Shoe, Softness } from "./types";

/**
 * 신발 스펙 원장 (2026-11-24) — 무게·밑창 두께·앞뒤 굽 차이·푹신함
 *
 * 값을 고르는 순서(hyun 님 결정): 브랜드 공식 페이지 → RunRepeat(신발을 직접 재서 공개) → 공식 판매처.
 * 앞선 출처에 값이 있으면 그 값을 쓴다. 칸마다 원문(quote)·주소(url)·확인한 날(checkedAt)을 남긴다. 화면에는 값만.
 *
 * - 밑창 두께·앞뒤 굽 차이는 정수 mm 로 반올림해 저장한다. 원장(ledger)이 소수를 잘라 저장하기 때문. 원문 소수는 quote 에
 * - 무게는 사이즈(mm)와 짝으로 쓴다. 출처가 사이즈를 적지 않은 무게는 쓰지 않고 다음 출처로 내려간다
 *   (2026-11-24 hyun 님 「기준 있는 출처로」). RunRepeat 실측은 남성 US 9 → 브랜드 사이즈표 270mm
 * - 푹신함은 RunRepeat 경도계 값. 2026-02 부터 Asker C(AC), 그 전 Shore A(HA). 낮을수록 푹신하다. 두 눈금은 서로 바꾸지 않는다
 *   화면 말은 RunRepeat 이 AC 값에 붙인 Soft·Balanced·Firm 을 그대로 쓴다. HA 값만 있는 신발은 label 이 비어 있다
 *   RunRepeat 값이 없는 신발은 브랜드가 적은 말(Soft · soft cushioning · Plush)만 「푹신한 편」으로 옮긴다.
 *   쿠션 양을 말하는 표기(높음 · Medium · Max Cushion)는 푹신함으로 옮기지 않는다
 * - 같은 모델의 여성판·넓은 판은 두께·굽 차이·푹신함이 같다. 무게만 따로 찾고, 못 찾으면 그 사실을 note 에 적는다
 */

export interface SpecSource {
  from: "brand" | "runrepeat" | "retailer";
  url: string;
  quote: string;
  checkedAt: string;
  note?: string;
}

export interface ShoeSpec {
  weight: { g: number; sizeMm: number | null; src: SpecSource } | null;
  stack: { mm: number; src: SpecSource } | null;
  drop: { mm: number; src: SpecSource } | null;
  softness: { label: Softness | null; value?: number; unit?: "AC" | "HA"; src: SpecSource } | null;
}

export const SPECS: Record<string, ShoeSpec> = SPECS_JSON as unknown as Record<string, ShoeSpec>;

/** data.ts 에 적지 않는 칸 — specs.json 에서만 온다 */
export type SpecKey = "heelDropMm" | "stackHeightMm" | "weightG" | "weightSizeMm" | "softness";
export type ShoeEntry = Omit<Shoe, SpecKey>;

/** 사람 원장(data.ts)에 스펙 칸을 채운다. 스펙 원장에 없는 신발이 있으면 바로 실패한다(조용히 빈 칸이 되지 않게) */
export function withSpecs(entries: ShoeEntry[]): Shoe[] {
  return entries.map((e) => {
    const sp = SPECS[e.id];
    if (!sp?.weight) throw new Error(`lib/shoes/specs.json 에 ${e.id} 의 무게가 없다`);
    return {
      ...e,
      heelDropMm: sp.drop?.mm,
      stackHeightMm: sp.stack?.mm,
      weightG: sp.weight.g,
      weightSizeMm: sp.weight.sizeMm ?? undefined,
      softness: sp.softness?.label ?? undefined,
    };
  });
}
