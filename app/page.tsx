import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

// 사전 렌더링된 인기 비교 페어 (app/compare/[slug] generateStaticParams와 일치)
const POPULAR_COMPARES = [
  { slug: "hoka-clifton-10-vs-brooks-ghost-17", label: "호카 클리프턴 10", vs: "브룩스 고스트 17" },
  { slug: "nike-pegasus-42-vs-hoka-clifton-10", label: "나이키 페가수스 42", vs: "호카 클리프턴 10" },
  { slug: "asics-gel-nimbus-27-vs-hoka-bondi-9", label: "아식스 님버스 27", vs: "호카 본디 9" },
  { slug: "brooks-adrenaline-gts-25-vs-nb-860-v15", label: "브룩스 아드레날린 25", vs: "뉴발란스 860 v15" },
];

const LEVEL_GUIDES = [
  { href: "/injury/beginner-guide", label: "입문 (0~6개월)" },
  { href: "/injury/intermediate-guide", label: "중급 (6~24개월)" },
  { href: "/injury/advanced-guide", label: "숙련 (2년+)" },
];

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
        <p className="mt-4 text-xs text-gray-400">가입 없이 무료 · 광고·협찬 없는 중립 추천</p>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">어떻게 추천하나요?</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { n: "1", t: "내 정보 선택", d: "키·체중·발볼·발 타입을 버튼으로 고르면 끝. 숫자 입력 없이 1분." },
            { n: "2", t: "맞춤 추천 3개", d: "수십 개 모델 중 내 체형 조건을 통과한 신발만 골라드려요." },
            { n: "3", t: "부상 예방까지", d: "내 발 타입에 맞는 부상 예방 가이드를 함께 연결해드려요." },
          ].map((s) => (
            <div key={s.n} className="border border-gray-100 rounded-xl p-5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mb-3">
                {s.n}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{s.t}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
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

      {/* 인기 러닝화 비교 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">인기 러닝화 비교</h2>
            <Link href="/shoe-finder" className="text-sm text-emerald-600 hover:underline">
              내 신발 찾기 →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {POPULAR_COMPARES.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-5 py-4 hover:border-emerald-300 transition-colors"
              >
                <span className="text-sm font-medium text-gray-800 leading-snug">
                  {c.label}
                  <span className="text-gray-400 mx-1.5">vs</span>
                  {c.vs}
                </span>
                <span className="shrink-0 text-xs text-emerald-600 font-semibold ml-2">비교 →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Injury preview */}
      <section className="py-16">
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

          {/* 수준별 가이드 링크 */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 mr-1">경력별 가이드:</span>
            {LEVEL_GUIDES.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"
              >
                {g.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 마무리 CTA */}
      <section className="bg-emerald-600">
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">아직 어떤 신발이 맞는지 모르겠다면</h2>
          <p className="text-emerald-50 mb-6">키·체중·발 타입만 고르면 1분 안에 알려드려요.</p>
          <Link
            href="/shoe-finder"
            className="inline-block bg-white text-emerald-700 font-semibold px-8 py-4 rounded-xl hover:bg-emerald-50 transition-colors"
          >
            내 발에 맞는 러닝화 찾기 →
          </Link>
        </div>
      </section>
    </main>
  );
}
