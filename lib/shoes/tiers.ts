import type { Shoe, ShoeUse } from "./types";

/**
 * 러닝화 계급도 칸 정의 — `app/tier-list/page.tsx` 에서 옮김 (2026-09-26)
 *
 * 왜 옮겼나: 신발 상세의 「처음 러닝화로?」 한 줄이 계급도와 **다른 기준**으로 판정하고 있었다.
 * 상세는 「레이싱 용도가 있으면 대회용」으로 봤는데 계급도는 「장거리 용도가 먼저」라서,
 * 슈퍼블라스트 3(데일리·장거리·레이싱, 카본 없음)이 계급도에선 「오래 뛰는 날」인데
 * 상세에선 「대회용」으로 나갔다(배포본에서 확인). 같은 판정을 두 곳에 두면 이렇게 어긋난다 — 한 곳에만 둔다.
 */
export const has = (s: Shoe, u: ShoeUse) => s.uses.includes(u);
/** 데일리 "전용" — 장거리·템포·레이싱이 섞이면 그쪽 칸이 맞다. */
export const daily = (s: Shoe) =>
  has(s, "daily") && !has(s, "long") && !has(s, "tempo") && !has(s, "racing");

/**
 * 사다리 — **위에서 아래로 갈수록 훈련량이 쌓인 러너용**이다.
 * 첫 칸이 나쁜 신발이라는 뜻이 아니다. 대부분의 사람은 1~2칸에서 평생 달린다.
 *
 * `match` 는 위에서부터 **먼저 걸리는 칸**에 넣는다(배타적).
 */
export type Rung = {
  id: string;
  label: string;
  forWho: string;
  moveOn: string;
  rule: string;
  match: (s: Shoe) => boolean;
};

export const RUNGS: Rung[] = [
  {
    id: "first",
    label: "첫 신발",
    forWho: "이제 막 시작했거나, 아직 신발에 큰돈을 쓰기 망설여지는 사람",
    moveOn:
      "주 3회 이상 꾸준해지고 한 번에 30분 넘게 뛰기 시작하면 다음 칸이 편해집니다. 안 넘어가도 됩니다.",
    rule: "카본 없음 + 데일리 전용 + 17만원 이하",
    match: (s) => !s.hasCarbon && daily(s) && s.priceKrw <= 170_000,
  },
  {
    id: "everyday",
    label: "매일 신는 날",
    forWho: "주 3회 이상 30~60분씩 꾸준히 달리는 사람. 러닝화 한 켤레로 다 하는 단계",
    moveOn: "한 번에 10km를 넘기기 시작하면 쿠션이 두꺼운 다음 칸이 다리를 덜 힘들게 합니다.",
    rule: "카본 없음 + 데일리 전용 (가격 제한 없음)",
    match: (s) => !s.hasCarbon && daily(s),
  },
  {
    id: "long",
    label: "오래 뛰는 날",
    forWho: "10km 이상, 하프 이상을 준비하는 사람. 가장 많은 신발이 여기 있습니다",
    moveOn:
      "훈련을 강도별로 나누기 시작하면(빠른 날 / 느린 날) 다음 칸을 한 켤레 더 두게 됩니다.",
    rule: "카본 없음 + 장거리 용도",
    match: (s) => !s.hasCarbon && has(s, "long"),
  },
  {
    id: "fast",
    label: "빠르게 뛰는 날",
    forWho: "인터벌·템포 주를 따로 하는 사람. 빠른 날에만 신고 평소엔 앞 칸을 신습니다",
    moveOn: "대회에서 기록을 노리게 되면 마지막 칸을 검토할 수 있습니다.",
    rule: "카본 없음 + 템포 용도",
    match: (s) => !s.hasCarbon && has(s, "tempo"),
  },
  {
    id: "race",
    label: "대회 날",
    forWho: "대회 기록이 목표이고 훈련량이 쌓인 사람",
    moveOn:
      "여기가 끝입니다. 다만 이 칸은 훈련용이 아니라 대회용입니다 — 수명이 짧아 평소에 신으면 금방 죽습니다.",
    rule: "카본 있음 또는 레이싱 용도",
    match: (s) => s.hasCarbon || has(s, "racing"),
  },
];


/** 위에서부터 먼저 걸리는 칸(계급도와 같은 배타 규칙). 어디에도 안 걸리면 null */
export function rungOf(s: Shoe): Rung | null {
  return RUNGS.find((r) => r.match(s)) ?? null;
}
