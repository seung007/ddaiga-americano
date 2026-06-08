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
