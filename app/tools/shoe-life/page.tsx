import { SHOES } from "@/lib/shoes/data";
import ShoeLifeClient from "./ShoeLifeClient";

/** 기록장 신발 목록은 이름만 서버에서 넘긴다(클라이언트 번들에 신발 원장 전체가 들어가지 않게 — 2026-10-12 council Dev) */
export default function ShoeLifePage() {
  const catalog = [...SHOES]
    .sort((a, b) => (a.brand + a.model).localeCompare(b.brand + b.model))
    .map((s) => ({ id: s.id, brand: s.brand, model: s.model }));
  return <ShoeLifeClient catalog={catalog} />;
}
