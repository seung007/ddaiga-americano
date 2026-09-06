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
        <Link href="/" className="text-lg font-bold text-gray-900 hover:text-emerald-600 transition-colors">
          🏃 뛰다가 아메리카노
        </Link>
        {/* 2026-09-06: 코스가 들어와 모바일 항목이 3 → 4개가 됐다.
            헤더에서 빼면 클릭이 한 번 늘고, 그 한 번에서 대부분을 잃는다.
            대신 간격을 좁혀 감당한다(gap-3 sm:gap-5). 375px에서 넘치면
            줄일 것은 항목 수가 아니라 로고 쪽이다. */}
        <nav className="flex items-center gap-3 sm:gap-5">
          <Link href="/injury" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            부상 예방
          </Link>
          <Link href="/courses" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            코스
          </Link>
          <Link href="/tools" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            계산기
          </Link>
          <Link href="/community" className="hidden text-sm text-gray-600 transition-colors hover:text-gray-900 sm:block">
            Q&amp;A
          </Link>
          {/* 2026-09-02: 계산기를 추가하면서 헤더가 5개가 됐다.
              모바일에서 넘치지 않게 Q&A와 블로그는 sm 이상에서만 보인다.
              둘 다 푸터에 남아 있어 접근 경로가 사라지지는 않는다. */}
          <a
            href="https://blog.naver.com/coffee_study_"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm text-gray-600 transition-colors hover:text-gray-900 sm:block"
          >
            블로그
          </a>
          <Link
            href="/shoe-finder"
            className="text-sm font-medium bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            신발 찾기
          </Link>
        </nav>
      </div>
    </header>
  );
}
