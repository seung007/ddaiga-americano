import { SHOES } from "@/lib/shoes/data";
import { ALL_RACES } from "@/lib/races";

/**
 * 반응 목록에 이름을 붙이기 위한 id → 이름 표 (2026-09-23)
 *
 * **서버 컴포넌트에서만 부른다.** `data.ts` 는 12만 바이트라 클라이언트에서 import 하면
 * 홈·게시판 번들에 통째로 실린다. 서버가 이름만 뽑아 props 로 넘긴다(수 KB).
 */
export type ReactionNames = { shoes: Record<string, string>; races: Record<string, string> };

export function reactionNames(): ReactionNames {
  return {
    shoes: Object.fromEntries(SHOES.map((s) => [s.id, `${s.brand} ${s.model}`])),
    races: Object.fromEntries(ALL_RACES.map((r) => [r.id, r.name])),
  };
}
