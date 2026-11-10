import PHOTOS from "./photos.json";

/**
 * 공식몰 옆모습 제품 사진 원장 (2026-11-10~)
 * 파일: public/shoes/photo/<id>.webp — scripts/photos/import-official.py 가 만든다(배경 지움, 여백 6%).
 * src 는 사진을 받은 공식몰 주소, checkedAt 은 받은 날.
 */
export type ShoePhoto = { src: string; w: number; h: number; checkedAt: string };

const LEDGER = PHOTOS as Record<string, ShoePhoto>;

export function photoOf(id: string): ShoePhoto | undefined {
  return LEDGER[id];
}
