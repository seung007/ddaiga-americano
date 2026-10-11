import { SHOES } from "@/lib/shoes/data";
import { toProfileShoe } from "@/components/ShoeSideProfile";
import ShoeSideTool from "./ShoeSideTool";

/** 서버에서 그림에 필요한 필드만 추려 넘긴다(클라이언트 번들에 신발 원장 전체가 들어가지 않게 — 2026-10-12 council Dev) */
export default function ShoeSidePage() {
  return <ShoeSideTool catalog={SHOES.map(toProfileShoe)} />;
}
