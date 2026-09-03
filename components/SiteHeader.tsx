import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-gray-900 hover:text-emerald-600 transition-colors">
          🏃 뛰다가 아메리카노
        </Link>
        <nav className="flex items-center gap-5">
          <Link href="/injury" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            부상 예방
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
