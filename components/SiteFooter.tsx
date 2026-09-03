import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-800">🏃 뛰다가 아메리카노</p>
            <p className="text-xs text-gray-400 mt-1">공개 연구 기반 러닝화 추천. 추천 순서는 광고비로 바뀌지 않습니다.</p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-1">
            {/* 2026-09-02: 헤더에 계산기를 넣으면서 Q&A·블로그를 모바일에서 숨겼다.
                푸터에 없으면 작은 화면에서 접근 경로가 아예 사라지므로 여기에 추가한다. */}
            <Link href="/shoe-finder" className="text-xs text-gray-500 hover:text-gray-800 transition-colors">신발 찾기</Link>
            <Link href="/tools"       className="text-xs text-gray-500 hover:text-gray-800 transition-colors">계산기</Link>
            <Link href="/injury"      className="text-xs text-gray-500 hover:text-gray-800 transition-colors">부상 예방</Link>
            <Link href="/community"   className="text-xs text-gray-500 hover:text-gray-800 transition-colors">Q&amp;A</Link>
            <a href="https://blog.naver.com/coffee_study_" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-gray-800 transition-colors">블로그</a>
            <Link href="/terms"       className="text-xs text-gray-500 hover:text-gray-800 transition-colors">이용약관</Link>
            <Link href="/privacy"     className="text-xs text-gray-500 hover:text-gray-800 transition-colors">개인정보처리방침</Link>
          </nav>
        </div>
        <p className="text-xs text-gray-400 mt-6">
          © 2026 뛰다가 아메리카노. 본 서비스는 의료 조언이 아닙니다.{" "}
          <Link href="/terms" className="underline hover:text-gray-600">면책 고지</Link>
        </p>
      </div>
    </footer>
  );
}
