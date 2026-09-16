import Link from "next/link";

export default function SiteHeader() {
  return (
    // z-[1100] 인 이유 — Leaflet 때문이다.
    // Leaflet은 자기 내부 요소에 z-index 400(타일·마커)~1000(컨트롤·팝업)을 직접 박는다.
    // 헤더가 z-10 이면 /courses 에서 스크롤할 때 **지도가 헤더 위로 올라와 덮는다.**
    // 헤더를 전역으로 올린 오늘(2026-09-06) 전까지는 /courses 에 헤더가 아예 없어서
    // 이 충돌이 드러날 일이 없었다. 1000보다 큰 값이어야 한다.
    <header className="border-b border-gray-100 bg-white sticky top-0 z-[1100]">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* whitespace-nowrap 이 없어서 390px 에서 "뛰다가 아메리 / 카노" 로 쪼개졌다.
            로고가 두 줄이면 사이트가 고장난 것처럼 보인다. */}
        <Link
          href="/"
          className="shrink-0 whitespace-nowrap text-base font-bold text-gray-900 transition-colors hover:text-emerald-600 sm:text-lg"
        >
          🏃 뛰다가 아메리카노
        </Link>
        {/**
         * 2026-09-08: **모바일에서 메뉴 항목을 전부 숨긴다.**
         *
         * 전에는 항목 4개가 모바일에도 보였고, 390px 에서 이렇게 나왔다:
         *   "부상 예 / 방"   "코 / 스"   "계산 / 기"   "신발 찾 / 기"
         * 전부 두 줄로 쪼개졌다. **방문자의 80%가 보는 화면이 이랬다.**
         *
         * 폭 계산: 로고 164px + 버튼 102px + 좌우 패딩 48px = 314px.
         * 390px 에서 남는 건 76px 이고, 거기에 항목 4개는 들어가지 않는다.
         * gap 을 좁히는 것으로는 해결되지 않는다 — 전에 `gap-3 sm:gap-5` 로
         * 좁혀 봤고, 그래서 **양쪽이 다 짜부라졌다.**
         *
         * 이전 주석은 "헤더에서 빼면 클릭이 한 번 늘고 그 한 번에서 대부분을
         * 잃는다"고 했다. 맞는 걱정이지만 **읽을 수 없는 메뉴는 없는 메뉴보다
         * 나쁘다** — 글자가 쪼개져 있으면 사이트가 깨진 것으로 읽힌다.
         *
         * 진입로는 사라지지 않는다: 세 페이지 모두 **푸터**에 있고, 홈에도
         * 각각의 섹션 링크가 있다. `npm run check:internal` 이 고아를 감시한다.
         */}
        <nav className="flex items-center gap-3 sm:gap-5">
          {/* 2026-09-16: 「계산기」 자리를 「러닝화」로 바꿨다(러닝라이프 메뉴 순서). 같은 3글자라 폭은 그대로 — 계산기는 푸터에 있다 */}
          <Link href="/shoes" className="hidden text-sm text-gray-600 transition-colors hover:text-gray-900 md:block">
            러닝화
          </Link>
          <Link href="/injury" className="hidden text-sm text-gray-600 transition-colors hover:text-gray-900 md:block">
            러닝 가이드
          </Link>
          <Link href="/courses" className="hidden text-sm text-gray-600 transition-colors hover:text-gray-900 md:block">
            코스
          </Link>
          <Link href="/races" className="hidden text-sm text-gray-600 transition-colors hover:text-gray-900 md:block">
            대회 일정
          </Link>
          <Link href="/community" className="hidden text-sm text-gray-600 transition-colors hover:text-gray-900 md:block">
            자유게시판
          </Link>
          {/**
           * 2026-09-15: 「대회 일정」을 넣으면서 **둘을 같이 바꿨다 — 「블로그」 제거 + `sm:` → `md:`**
           *
           * 전부 playwright 로 재고 정했다(로컬, 폭별 링크 높이 측정):
           *   · 대회 일정만 추가 → 640·672px 에서 **링크 6개가 전부 두 줄로 쪼개졌다.**
           *     2026-09-08 주석이 390px 에서 기록한 그 고장이 640px 로 올라온 것이다
           *   · 블로그를 빼니 640px 은 살아났는데(간격 21px), 「Q&A」를 「자유게시판」으로
           *     바꾸자 **640px 이 다시 쪼개졌다**(간격 0px). 「이야기방」(4글자)으로 줄여도 같았다 —
           *     **병목은 글자 길이가 아니라 항목 수였다**
           *   · `sm:`(640px) → `md:`(768px) 로 올리니 전 구간 쪼개짐 0개.
           *     768px 에서 로고와 간격 113px 로 여유가 있다
           *
           * 그래서 **640~767px 에서는 메뉴가 안 보인다.** 위 2026-09-08 의 판단을 그대로 따른다 —
           * *"읽을 수 없는 메뉴는 없는 메뉴보다 나쁘다."* 진입로는 푸터와 홈 섹션에 있다.
           *
           * 블로그를 고른 이유: **외부 링크라 이탈이고, 대회 일정은 내부 재방문 축이다.**
           * 블로그는 `components/SiteFooter.tsx` 에 그대로 있다.
           */}
          <Link
            href="/shoe-finder"
            className="shrink-0 whitespace-nowrap rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 sm:px-4"
          >
            신발 찾기
          </Link>
        </nav>
      </div>
    </header>
  );
}
