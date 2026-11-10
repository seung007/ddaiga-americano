import OFFICIAL from "./official.json";
import AUTO from "./auto.json";

/**
 * 공식몰 자동 확인 (2026-11-02)
 *
 * `official.json` 은 비공개 저장소 ddaiga-pipeline 의 신발 수집기만 쓴다. 사람이 고치지 않는다.
 * 한국 공식몰 9곳(아식스·써코니·브룩스·미즈노, 2026-11-10 뉴발란스·온·아디다스·푸마·나이키 추가) 목록을 매일 읽고, 같은 값이 **서로 다른 날 2번** 읽혀야 반영한다.
 * 사람이 쓴 `data.ts`(가격·후속작 등)는 수집기가 건드리지 않는다 — 다르면 수집기 보고에만 남는다.
 * 규칙 원본: ddaiga-pipeline `pipeline/shoes/project.py` 머리말, 검사: `scripts/check-official.mjs`
 */
export type OfficialCheck = {
  brand: string;
  /** 공식몰 정가 — 판매 중인 변형에서 가장 흔한 정가 */
  priceKrw?: number;
  /** false 면 이전엔 있었는데 공식몰 목록에서 2일 연속 안 보였다 */
  listed: boolean;
  url?: string;
  widths?: string[];
  /** 공식몰 목록에 있는 다음 세대 이름 (예: "GT-2000 15") */
  newerModel?: string;
  checkedAt: string;
  checkedBy: "수집기";
};

export function officialOf(id: string): OfficialCheck | null {
  const hit = (OFFICIAL as unknown as Record<string, OfficialCheck>)[id];
  if (hit) return hit;
  // 2026-11-10: 자동 추가 신발(auto.json)은 공식몰에서 읽은 값 자체라 같은 모양으로 돌려준다 — 목록·홈·구매처가 같은 규칙을 쓰게
  const a = (AUTO as unknown as Record<string, { brand: string; priceKrw: number; url: string; checkedAt: string }>)[id];
  return a ? { brand: a.brand, priceKrw: a.priceKrw, listed: true, url: a.url, checkedAt: a.checkedAt, checkedBy: "수집기" } : null;
}
