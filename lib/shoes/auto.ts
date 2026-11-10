import AUTO_JSON from "./auto.json";
import type { Shoe } from "./types";

/**
 * 공식몰 자동 확인으로 들어온 새 신발 (2026-11-10)
 *
 * `auto.json` 은 비공개 저장소 ddaiga-pipeline 의 신발 수집기만 쓴다. 사람이 고치지 않는다 —
 * 사람이 같은 신발을 data.ts 에 넣으면 수집기가 다음 회차에 auto.json 에서 지운다.
 *
 * 들어오는 조건(수집기 README 「자동 승인 규칙」): 한국 공식몰 러닝 목록 · 이름·가격·상품 주소·사진·무게·드롭이 다 있음 ·
 * 무게 150~400g · 드롭 0~14mm · 서로 다른 날 2번 같은 값. 검사는 scripts/check-official.mjs 가 마지막으로 한다.
 *
 * 두 갈래
 *   nextGen   이미 있는 신발의 다음 세대. 쿠션·안정성·용도·폭·스택은 이전 세대 값을 **물려받고 화면에 「이전 세대 기준」이라고 적는다.**
 *             무게·드롭·가격·사진·구매처는 공식몰에서 읽은 값. 그래서 목록·상세·추천에 들어간다
 *   newFamily 아는 계열 어디에도 안 붙는 새 이름. 분류할 근거가 없으니 **추천·비교·상세에 넣지 않고** /shoes 아래 목록에만 보인다
 *
 * 왜 이전 세대 분류를 물려받나 — 사용자 결정(2026-11-10 「먼저 파악하면 자동 승인」). 다음 세대는 보통 같은 용도·구조로 나오지만
 * 바뀌는 경우도 있다. 그래서 물려받은 값임을 숨기지 않는다(AGENTS.md 「모르면 모른다고 적는다」).
 */
export interface AutoEntry {
  kind: "nextGen" | "newFamily";
  brand: string;
  model: string;
  gender: "male" | "female" | "unisex";
  basedOn?: string;
  priceKrw: number;
  url: string;
  imageUrl: string;
  weightG: number;
  /** 공식몰이 적은 무게 기준(「UK 8 / 270mm 기준」「남성」). 없으면 공식몰이 기준을 안 적은 것 */
  weightBasis?: string;
  dropMm: number;
  checkedAt: string;
  checkedBy: "수집기";
}

export const AUTO: Record<string, AutoEntry> = AUTO_JSON as unknown as Record<string, AutoEntry>;

const BRAND_KO: Record<string, string> = {
  Asics: "아식스", Saucony: "써코니", Brooks: "브룩스", Mizuno: "미즈노",
  "New Balance": "뉴발란스", On: "온", Adidas: "아디다스", Puma: "푸마", Nike: "나이키",
};

/** 새 계열 — 목록에만 보이는 신발 */
export const NEW_FAMILIES: (AutoEntry & { id: string })[] = Object.entries(AUTO)
  .filter(([, e]) => e.kind === "newFamily")
  .map(([id, e]) => ({ id, ...e }))
  .sort((a, b) => b.checkedAt.localeCompare(a.checkedAt) || a.brand.localeCompare(b.brand));

/** 사람 원장(data.ts) + 다음 세대 자동 신발. 이전 세대에 successor 가 비어 있으면 새 세대 이름을 채운다 */
export function withAutoNextGen(manual: Shoe[]): Shoe[] {
  const out = manual.map((s) => ({ ...s }));
  const byId = new Map(out.map((s) => [s.id, s]));
  const pending = Object.entries(AUTO).filter(([, e]) => e.kind === "nextGen");
  // 이전 세대가 또 자동 신발일 수 있다(15 → 16 → 17) — 기반이 먼저 만들어지도록 몇 번 돈다
  for (let pass = 0; pass < 5 && pending.length; pass++) {
    for (let i = pending.length - 1; i >= 0; i--) {
      const [id, e] = pending[i];
      const base = e.basedOn ? byId.get(e.basedOn) : undefined;
      if (!base) continue;
      pending.splice(i, 1);
      if (byId.has(id)) continue;
      const shoe: Shoe = {
        ...base,
        id,
        model: e.model,
        imageUrl: e.imageUrl,
        colorways: [],
        heelDropMm: e.dropMm,
        weightGramsM9: e.weightG,
        weightGramsW8: undefined,
        priceKrw: e.priceKrw,
        krAvailability: "kr_official",
        buyLinks: [{ label: `${BRAND_KO[e.brand] ?? e.brand} 공식몰`, url: e.url, isOfficial: true }],
        sourceUrl: e.url,
        blurb: `${base.model}의 다음 세대예요. 무게·드롭·가격은 공식몰 값이고, 쿠션·안정성·용도·발볼·스택은 이전 세대 기준이에요.`,
        scienceBasis: `이 세대의 분류 근거는 아직 따로 확인하지 않았어요. 이전 세대(${base.model}) 기준으로 분류했어요.`,
        youtubeReviews: [],
        successor: undefined,
        auto: { basedOn: base.id, basedOnModel: base.model, checkedAt: e.checkedAt, weightBasis: e.weightBasis },
      };
      if (!base.successor) base.successor = e.model;
      out.push(shoe);
      byId.set(id, shoe);
    }
  }
  return out;
}
