"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * 머리글의 「내 신발 찾기」 (2026-11-05)
 *
 * 홈에서는 숨긴다 — 홈 첫 화면이 추천 카드라 같은 입구가 두 번 나온다(디자인 「H01 수정안」 머리글에는 이 버튼이 없다).
 * 다른 페이지에서는 남긴다. 가이드·대회에서 추천기로 가는 상시 입구가 이것뿐이라서다.
 */
export default function HeaderFinderLink() {
  const path = usePathname();
  if (path === "/" || path?.startsWith("/shoe-finder")) return null;
  return (
    <Link
      href="/shoe-finder"
      className="press flex h-11 shrink-0 items-center whitespace-nowrap rounded-full bg-[#111111] px-4 text-sm font-bold text-white max-[359px]:px-2.5 max-[359px]:text-xs"
    >
      내 신발 찾기
    </Link>
  );
}
