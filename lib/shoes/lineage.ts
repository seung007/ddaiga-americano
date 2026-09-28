import { SHOES } from "./data";
import type { Shoe } from "./types";

/**
 * 세대 연결 — 구형 ↔ 후속작 (2026-09-28)
 *
 * 왜: 2026-09-26~27 에 후속작을 49종 넣으면서 `successor` 가 가리키는 신발이 DB 안에 21종 생겼다.
 * 그런데 상세 페이지는 후속작 **이름만** 적고 있어서, 사용자가 「고스트 18 은 어떤데?」를 보려면
 * 검색을 다시 해야 했다. 같은 DB 안에 있으면 링크로 잇는다.
 *
 * 매칭은 **브랜드 + 모델명이 글자 그대로 같을 때만**. 비슷한 이름으로 짐작해서 잇지 않는다 —
 * 틀린 신발로 보내면 없는 것보다 나쁘다. 못 찾으면 지금처럼 이름만 나간다.
 */

/** 이 신발의 후속작이 DB 에 있으면 그 신발. 남성·공용 쪽을 먼저 고른다 */
export function successorOf(s: Shoe): Shoe | undefined {
  if (!s.successor) return undefined;
  const hits = SHOES.filter((x) => x.brand === s.brand && x.model === s.successor);
  return hits.find((x) => x.gender === s.gender) ?? hits.find((x) => x.gender !== "female") ?? hits[0];
}

/** 이 신발을 후속작으로 가리키는 구형. 여성 전용 변형(-w)은 빼고, 같은 성별을 먼저 */
export function predecessorOf(s: Shoe): Shoe | undefined {
  const hits = SHOES.filter((x) => x.brand === s.brand && x.successor === s.model && x.id !== s.id);
  return hits.find((x) => x.gender === s.gender) ?? hits.find((x) => x.gender !== "female");
}
