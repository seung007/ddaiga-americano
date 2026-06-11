import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "생애 첫 10km 대회 준비물과 페이스 전략 — 뛰다가 아메리카노",
  description: "출발선에 서기 전에 알아야 할 것들. 장비·페이스·멘탈 관리까지 생애 첫 10km 완주 가이드.",
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
          <span className="inline-block text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mb-3">첫 대회</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">생애 첫 10km 대회 준비물과 페이스 전략</h1>
          <p className="text-gray-500 text-sm mb-4">7분 읽기</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            광고·협찬 없음 — 공개 연구 및 의학 자료 기반
          </div>
        </header>
        <p className="text-lg leading-relaxed mb-8 text-gray-700">첫 10km 대회는 단순한 달리기가 아닙니다. 수백~수천 명이 함께 달리는 에너지, 응원 소리, 그리고 결승선을 밟는 순간은 달리기를 평생 즐기게 만드는 경험입니다. 하지만 준비가 부족하면 부상이나 완주 실패로 첫 경험이 나쁜 기억이 될 수 있습니다.</p>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">준비물 체크리스트</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">① 러닝화 — 대회 2주 전에 미리 달려서 물집 없는지 확인 ② 러닝 양말 — 면 양말 금지, 기능성 러닝 양말 ③ 번호표 핀 4개 또는 번호표 클립 ④ 심박수 측정 가능한 워치 또는 스마트폰 페이스 앱 ⑤ 에너지 젤 (7km 이후 필요 시). 새 장비는 절대 대회날 처음 쓰지 않습니다.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">페이스 전략</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">초보 러너의 가장 흔한 실수는 출발 시 주변 분위기에 휩쓸려 첫 1~2km를 너무 빠르게 달리는 것입니다. 목표 페이스보다 10~15초/km 느리게 출발하세요. 5km 이후 여유가 있으면 속도를 높입니다. '음의 분할(Negative Split)'이 완주율과 기록 모두에 유리합니다.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">멘탈 관리 — 7km의 벽</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">대부분의 초보 러너는 7~8km 구간에서 멘탈이 무너집니다. 이때 '지금 고통이 최고조다, 2km만 더 가면 끝'이라고 생각하세요. 달리기의 고통은 선형으로 증가하지 않습니다 — 종반 1km는 의외로 잘 달려집니다.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://pubmed.ncbi.nlm.nih.gov/24100287/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Pacing strategy in 10km running — NCBI ↗</a></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://www.seoul-marathon.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">서울마라톤 공식 사이트 ↗</a></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://www.kaaf.or.kr" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">대한육상연맹 대회 일정 ↗</a></li>

          </ul>
          <p className="mt-3 text-xs text-gray-400">광고·협찬 없이 공적 연구 자료와 러너의 이익을 위해 작성되었습니다.</p>
        </section>

        <YoutubeSection links={[
          { label: "10km 대회, 이 영상으로 종결 — 완벽 준비 가이드 #초보러너", channel: "러닝코치TV", url: "https://www.youtube.com/watch?v=3oS5VzHTW3A" },
          { label: "10km 대회를 준비하는 방법 #초보러너", channel: "달리기TV", url: "https://www.youtube.com/watch?v=nevTzDZhAa4" },
          { label: "초보자~10km 맞춤 Q&A — 페이스·훈련 완전 정리", channel: "러닝궁금증", url: "https://www.youtube.com/watch?v=B4A61x6T3ao" },
          { label: "10km 1시간 이내 완주! 같이 뛰어요", channel: "달리기 유튜버", url: "https://www.youtube.com/watch?v=vuxhV314PqE" },
        ]} />

        <FaqSection items={[
          {
            q: "첫 10km 대회 준비물은 무엇이 필요한가요?",
            a: "미리 길들인 러닝화(대회 2주 전 미리 신어 물집 확인), 기능성 러닝 양말(면 양말 금지), 번호표 핀 4개나 클립, 페이스 측정용 워치·앱, 7km 이후용 에너지 젤. 새 장비는 절대 대회날 처음 쓰지 마세요.",
          },
          {
            q: "첫 대회에서 페이스 전략은 어떻게 잡나요?",
            a: "출발 분위기에 휩쓸려 첫 1~2km를 너무 빠르게 달리는 게 가장 흔한 실수입니다. 목표 페이스보다 10~15초/km 느리게 출발하고, 5km 이후 여유가 있으면 속도를 올리세요. 이런 '음의 분할(Negative Split)'이 완주율과 기록 모두에 유리합니다.",
          },
          {
            q: "7~8km에서 너무 힘들 때는 어떻게 하나요?",
            a: "대부분의 초보 러너가 이 구간에서 멘탈이 무너집니다. '지금이 고통의 최고조이고 2km만 더 가면 끝'이라고 생각하세요. 달리기의 고통은 선형으로 증가하지 않아 종반 1km는 의외로 잘 달려집니다.",
          },
        ]} />

        <p className="text-xs text-gray-400 mb-4">※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 통증이 지속되면 전문의 상담을 권장합니다.</p>

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
