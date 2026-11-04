import { Barlow_Condensed } from "next/font/google";

/**
 * 홈 추천 카드·가이드 카드의 영문 꼬리표(SHOE FINDER · WIDE FOOT …) 전용 글꼴 (2026-11-05, 디자인 「H01 수정안」).
 * 한글은 지금처럼 Pretendard 계열을 쓴다. 굵기 하나·기울임 하나만 받는다.
 */
export const barlow = Barlow_Condensed({ subsets: ["latin"], weight: "700", style: "italic", display: "swap" });
