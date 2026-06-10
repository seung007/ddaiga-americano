import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "휴식일에 뭘 해야 할까? 액티브 리커버리 — 뛰다가 아메리카노",
  description: "완전히 누워 쉬는 것보다 가벼운 움직임이 회복을 빠르게 합니다. 액티브 리커버리 가이드.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 부상 예방 가이드
        </Link>
        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-3">회복</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">휴식일에 뭘 해야 할까? 액티브 리커버리</h1>
          <p className="text-gray-500 text-sm mb-4">3분 읽기</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            광고·협찬 없음 — 공개 연구 및 의학 자료 기반
          </div>
        </header>
        <p className="text-lg leading-relaxed mb-8 text-gray-700">쉬는 날 아무것도 안 하면 근육이 굳어 다음 훈련이 더 힘들어집니다. 연구에 따르면 저강도 유산소 운동(심박수 최대치의 50~60%)은 완전 휴식보다 회복을 20~30% 빠르게 합니다.</p>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">액티브 리커버리란?</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">격렬한 운동 다음 날, 몸을 완전히 쉬는 대신 가벼운 활동으로 혈류를 유지하는 방법입니다. 혈류가 유지되면 근육의 젖산이 더 빠르게 제거되고, 염증 반응이 줄어듭니다.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">휴식일 추천 활동</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">① 20~30분 빠른 걷기 (대화 가능한 속도) → ② 수영 또는 아쿠아 조깅 → ③ 자전거 가볍게 타기 → ④ 요가 또는 필라테스. 핵심은 숨이 차지 않는 강도입니다. 달리기는 하지 않습니다.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">완전 휴식이 필요한 신호</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">극심한 피로, 수면 장애, 안정시 심박수 평소보다 7회 이상 상승, 달리기 의욕 완전 소실 — 이 4가지 중 2개 이상이면 오버트레이닝 신호입니다. 이때는 2~3일 완전 휴식이 필요합니다.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://pubmed.ncbi.nlm.nih.gov/15233597/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Active recovery vs passive rest — NCBI ↗</a></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://bjsm.bmj.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Overtraining syndrome — British Journal of Sports Medicine ↗</a></li>

          </ul>
          <p className="mt-3 text-xs text-gray-400">광고·협찬 없이 공적 연구 자료와 러너의 이익을 위해 작성되었습니다.</p>
        </section>

        <YoutubeSection links={[
          { label: "러닝 후 회복 — 쉬는 날 이렇게 보내세요", channel: "러닝코치TV", url: "https://www.youtube.com/watch?v=ddJ9JUcIHvU" },
          { label: "오버트레이닝 신호 & 회복 전략 — 러너를 위한 가이드", channel: "피지컬TV", url: "https://www.youtube.com/watch?v=sfF4f-QGRn8" },
          { label: "Active Recovery vs 완전 휴식 — 러너를 위한 정답", channel: "Ben Parkes Running", url: "https://www.youtube.com/watch?v=YgNsGODqSVA" },
        ]} />

        <FaqSection items={[
          {
            q: "휴식일에는 완전히 쉬는 게 좋나요?",
            a: "대개는 아닙니다. 저강도 유산소 운동(최대 심박수의 50~60%)인 액티브 리커버리가 완전 휴식보다 회복을 20~30% 빠르게 한다는 연구가 있습니다. 쉬는 날 아무것도 안 하면 근육이 굳어 다음 훈련이 더 힘들어집니다.",
          },
          {
            q: "휴식일에 어떤 활동을 하면 좋나요?",
            a: "① 20~30분 빠른 걷기(대화 가능한 속도) ② 수영 또는 아쿠아 조깅 ③ 가벼운 자전거 ④ 요가·필라테스. 핵심은 숨이 차지 않는 강도이며, 달리기는 하지 않습니다.",
          },
          {
            q: "완전 휴식이 필요한 신호는 무엇인가요?",
            a: "극심한 피로, 수면 장애, 안정시 심박수가 평소보다 7회 이상 상승, 달리기 의욕 완전 소실 — 이 4가지 중 2개 이상이면 오버트레이닝 신호입니다. 이때는 2~3일 완전 휴식이 필요합니다.",
          },
        ]} />

        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl">
          <p className="font-medium text-emerald-900 mb-2">내 체형에 맞는 러닝화를 찾으세요</p>
          <Link href="/shoe-finder" className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            내 러닝화 찾기 →
          </Link>
        </div>
      </article>
    </>
  );
}
