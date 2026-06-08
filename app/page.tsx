import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-sm font-medium text-emerald-600 mb-4">모든 러너를 위한 러닝 큐레이션</p>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-5">
          내 몸에 맞는 러닝화,<br />1분 만에 찾아보세요
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          키·체중 범위를 선택하면, 무릎 안 아프게 달릴 수 있는<br />
          러닝화와 부상 예방법을 알려드립니다.
        </p>
        <Link
          href="/shoe-finder"
          className="inline-block bg-emerald-600 text-white font-medium px-8 py-4 rounded-xl hover:bg-emerald-700 transition-colors"
        >
          내 신발 찾기 시작 →
        </Link>
      </section>

      {/* Feature 3-grid */}
      <section className="max-w-3xl mx-auto px-6 pb-16 grid gap-4 md:grid-cols-3">
        {[
          { t: "신체 데이터 기반", d: "키·체중·발볼·발 타입·성별까지 반영한 논문 기반 추천" },
          { t: "부상 예방 가이드", d: "무릎·발목·아킬레스건 증상별 대처법" },
          { t: "광고 아닌 중립 추천", d: "광고비가 아닌 내 데이터 기준으로만 선정" },
        ].map((x, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-1">{x.t}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{x.d}</p>
          </div>
        ))}
      </section>

      {/* Injury preview */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">부상 예방 가이드</h2>
            <Link href="/injury" className="text-sm text-emerald-600 hover:underline">
              전체 보기 →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                href: "/injury/it-band",
                tag: "무릎",
                title: "장경인대염 초기 대처법 3가지",
                desc: "달릴 때마다 무릎 바깥쪽이 아프다면 읽어보세요.",
              },
              {
                href: "/injury/wide-foot",
                tag: "발볼",
                title: "발볼 넓은 러너 와이드 규격 총정리",
                desc: "2E·4E 규격이 필요한지 판단하는 방법.",
              },
              {
                href: "/injury/achilles",
                tag: "아킬레스",
                title: "미드풋 전환 후 아킬레스건 스트레칭",
                desc: "주법 바꾼 뒤 종아리·아킬레스가 당긴다면.",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block bg-white border border-gray-100 rounded-xl p-5 hover:border-emerald-300 transition-colors"
              >
                <span className="inline-block text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mb-2">
                  {item.tag}
                </span>
                <h3 className="font-semibold text-gray-900 mb-1 leading-snug">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
