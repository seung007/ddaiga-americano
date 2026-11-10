import Link from "next/link";
import HeaderFinderLink from "@/components/HeaderFinderLink";

/** 768px 이상 머리글 글자 메뉴. 휴대폰은 MobileNav(같은 넷 + 순서). 코스·도구는 푸터에 있다 */
const NAV: [string, string][] = [
  ["/shoes", "러닝화"],
  ["/races", "대회"],
  ["/injury", "가이드"],
  ["/community", "게시판"],
];

export default function SiteHeader() {
  return (
    // z-[1100] 인 이유 — Leaflet 때문이다.
    // Leaflet은 자기 내부 요소에 z-index 400(타일·마커)~1000(컨트롤·팝업)을 직접 박는다.
    // 헤더가 z-10 이면 /courses 에서 스크롤할 때 **지도가 헤더 위로 올라와 덮는다.**
    // 헤더를 전역으로 올린 오늘(2026-09-06) 전까지는 /courses 에 헤더가 아예 없어서
    // 이 충돌이 드러날 일이 없었다. 1000보다 큰 값이어야 한다.
    // 2026-11-05: 디자인 「H01 수정안」 머리글 — 높이 60, 로고 왼쪽(16px·900), 검색 44px 오른쪽.
    // 검색은 사이트 전체 검색이 없어 러닝화 목록의 검색창(/shoes#shoe-q)으로 보낸다.
    // 휴대폰 메뉴는 MobileNav, 768px 이상은 아래 글자 메뉴.
    <header className="sticky top-0 z-[1100] border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-[60px] max-w-5xl items-center justify-between gap-4 pl-5 pr-2 md:pr-5">
        {/* whitespace-nowrap 이 없어서 390px 에서 "뛰다가 아메리 / 카노" 로 쪼개졌다.
            로고가 두 줄이면 사이트가 고장난 것처럼 보인다. */}
        {/* 2026-11-06 운영자: 로고는 새로 만들기 전까지 원래 로고(🏃 + 이름, 마우스를 올리면 초록)를 그대로 쓴다 — main 의 머리글에서 옮겼다 */}
        <Link
          href="/"
          className="flex h-11 shrink-0 items-center whitespace-nowrap text-base font-bold text-[#111111] transition-colors hover:text-emerald-600 max-[359px]:text-sm sm:text-xl"
        >
          🏃 뛰다가 아메리카노
        </Link>
        <nav aria-label="주 메뉴" className="flex items-center gap-2 md:gap-6">
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} className="hidden h-11 items-center text-base text-[#111111] hover:underline md:flex">
              {label}
            </Link>
          ))}
          <HeaderFinderLink />
          <Link href="/shoes#shoe-q" aria-label="러닝화 검색" className="press grid h-11 w-11 place-items-center text-[#111111]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  );
}
