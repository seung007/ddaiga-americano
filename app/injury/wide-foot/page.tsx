import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "발볼 넓은 러너 와이드 규격 총정리 — 뛰다가 아메리카노",
  description: "2E·4E 규격이 필요한지 판단하는 방법과 발볼 넓은 러너에게 맞는 러닝화를 알려드립니다.",
};

export default function WideFootPage() {
  return (
    <>
      <SiteHeader />
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 부상 예방 가이드
        </Link>

        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-3">
            발볼
          </span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
            발볼 넓은 러너를 위한<br />와이드 규격 총정리
          </h1>
          <p className="text-gray-500 text-sm">4분 읽기</p>
        </header>

        <p className="text-lg leading-relaxed mb-8 text-gray-700">
          달리고 나면 발이 붓고, 발 바깥쪽에 물집이 생기거나, 새끼발가락이 신발에 눌린다면
          발볼 규격이 안 맞는 것입니다. 달리기가 힘들어서가 아니라, 신발이 맞지 않아서 포기하는 경우가 생각보다 많습니다.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">신발 폭 규격이란?</h2>
          <p className="leading-relaxed mb-4 text-gray-700">
            러닝화는 같은 길이라도 폭이 다른 여러 규격으로 출시됩니다. 미국 규격 기준으로
            B(좁음) → D(표준) → 2E(넓음) → 4E(매우 넓음) 순으로 넓어집니다.
            국내에서 팔리는 대부분의 신발은 D 규격(표준)이며, 와이드 버전은 따로 구매해야 합니다.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  {["규격", "너비", "해당하는 발"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["B", "좁음", "발폭이 좁고 발등이 낮은 편"],
                  ["D", "표준", "대부분의 사람 (기본값)"],
                  ["2E", "넓음", "발볼이 넓거나 달릴 때 발이 많이 붓는 편"],
                  ["4E", "매우 넓음", "발볼이 매우 넓거나 평발로 발이 바닥에 퍼짐"],
                ].map(([code, width, desc], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-mono font-bold text-blue-700">{code}</td>
                    <td className="px-4 py-3 text-gray-700">{width}</td>
                    <td className="px-4 py-3 text-gray-600">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">내가 와이드 규격이 필요한지 확인하는 법</h2>
          <div className="space-y-4">
            {[
              {
                title: "방법 1. 현재 신발 밑창 확인",
                desc: "신발을 벗고 바닥을 보세요. 밑창 끝보다 발이 삐져나와 있다면 폭이 좁은 겁니다.",
              },
              {
                title: "방법 2. 달린 뒤 체크",
                desc: "5km 이상 달린 후 발 바깥쪽·새끼발가락 부위에 압박이나 발적이 생긴다면 와이드가 필요합니다. 발은 달릴수록 최대 1cm 정도 길어지고 넓어집니다.",
              },
              {
                title: "방법 3. 엄지발가락 여유 공간",
                desc: "신발 앞코와 엄지 사이에 손가락 하나(1cm)가 들어가는데도 옆이 눌린다면 길이가 아닌 폭 문제입니다.",
              },
            ].map((item, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">브랜드별 와이드 옵션 현황</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  {["브랜드", "와이드 옵션", "추천 이유"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["New Balance", "B / D / 2E / 4E", "국내 브랜드 중 폭 옵션 가장 다양"],
                  ["Brooks", "B / D / 2E / 4E", "Ghost·Adrenaline 전 시리즈 와이드 제공"],
                  ["Asics", "D / 2E / 4E", "카야노·님버스 와이드 옵션 있음"],
                  ["Hoka", "D / 2E", "봉디·클리프턴 2E 있음, 4E는 없음"],
                  ["Nike", "D / 4E 일부", "페가수스 4E 있지만 모델 제한적"],
                  ["On", "D만", "와이드 옵션 없음 — 발볼 넓다면 비추"],
                ].map(([brand, options, reason], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-medium text-gray-900">{brand}</td>
                    <td className="px-4 py-3 font-mono text-blue-700">{options}</td>
                    <td className="px-4 py-3 text-gray-600">{reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">* 2026년 기준. 모델별로 다를 수 있으니 구매 전 확인하세요.</p>
        </section>


        <YoutubeSection links={[
          { label: "Best Running Shoes for Wide Feet 2024: Top 3 Picks Revealed!", channel: "The Run Experience", url: "https://www.youtube.com/watch?v=hv9V9D51cFU" },
          { label: "The Best Wide-Fitting Neutral Running Shoes: Expert Review", channel: "Doctors of Running", url: "https://www.youtube.com/watch?v=g9BGWko7e9M" },
          { label: "Running Shoes for Wide Feet — My Top 5 Picks", channel: "Ben Parkes Running", url: "https://www.youtube.com/watch?v=CALXqH6mhsw" },
        ]} />

        <FaqSection items={[
          {
            q: "와이드(2E·4E) 규격이 필요한지 어떻게 판단하나요?",
            a: "세 가지로 확인합니다. ① 신발 밑창보다 발이 옆으로 삐져나와 있다 ② 5km 이상 달린 뒤 새끼발가락·발 바깥쪽에 압박이나 물집이 생긴다 ③ 앞코 길이는 여유가 있는데 옆이 눌린다 — 길이가 아닌 폭 문제입니다. 발은 달릴수록 최대 1cm 정도 길어지고 넓어집니다.",
          },
          {
            q: "러닝화 폭 규격 B·D·2E·4E는 무슨 뜻인가요?",
            a: "미국 규격 기준 폭 표기입니다. B(좁음) → D(표준) → 2E(넓음) → 4E(매우 넓음) 순으로 넓어집니다. 국내에서 팔리는 대부분의 러닝화는 D 규격이며, 와이드 버전은 따로 구매해야 합니다.",
          },
          {
            q: "와이드 옵션이 많은 러닝화 브랜드는 어디인가요?",
            a: "New Balance와 Brooks가 B부터 4E까지 폭 옵션이 가장 다양합니다. Asics는 주요 모델에 2E·4E 옵션이 있고, Hoka는 2E까지만 제공합니다. On은 와이드 옵션이 없어 발볼이 넓다면 피하는 게 좋습니다. (2026년 기준, 모델별로 다를 수 있음)",
          },
        ]} />

        <p className="text-xs text-gray-400 mb-4">※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 발 통증이 지속되면 전문의 상담을 권장합니다.</p>

        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl">
          <p className="font-medium text-emerald-900 mb-2">발볼 넓은 내 발에 맞는 신발 찾기</p>
          <p className="text-sm text-emerald-800 mb-4">
            발볼 조건을 선택하면 2E·4E 옵션이 있는 신발만 필터링해서 추천합니다.
          </p>
          <Link
            href="/shoe-finder"
            className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            내 러닝화 찾기 →
          </Link>
        </div>
      </article>
    </>
  );
}
