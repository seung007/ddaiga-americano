import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "달리기 자세 체크리스트 — 어깨·팔·시선 — 뛰다가 아메리카노",
  description: "상체 자세가 하체 부상에 영향을 준다는 사실. 어깨·팔·시선 체크포인트를 알아봅니다.",
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
          <span className="inline-block text-xs font-medium text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full mb-3">자세</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">달리기 자세 체크리스트 — 어깨·팔·시선</h1>
          <p className="text-gray-500 text-sm mb-4">4분 읽기</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            광고·협찬 없음 — 공개 연구 및 의학 자료 기반
          </div>
        </header>
        <p className="text-lg leading-relaxed mb-8 text-gray-700">발과 다리에만 집중하기 쉽지만, 상체 자세가 달리기 효율과 부상에 큰 영향을 미칩니다. 어깨가 앞으로 말리면 호흡이 얕아지고, 팔이 흔들리면 불필요한 에너지를 씁니다.</p>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">어깨</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">어깨는 자연스럽게 뒤로 당겨 귀와 어깨가 수직선을 이루어야 합니다. 달리다 보면 피로로 어깨가 귀 쪽으로 올라가는 경향이 있습니다. 5km마다 한 번씩 어깨를 의식적으로 내리고 뒤로 당겨보세요.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">팔 흔들기</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">팔꿈치를 90도로 굽히고, 팔이 몸의 정중선을 넘지 않아야 합니다. 손은 달걀을 가볍게 쥔 정도의 힘만 줍니다. 팔이 좌우로 과도하게 흔들리면 골반도 같이 흔들려 에너지 낭비가 일어납니다.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">시선과 머리 위치</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">시선은 10~15m 앞 지면을 향합니다. 너무 발 밑을 보면 목이 앞으로 나오고 등이 굽어집니다. 머리는 척추 위에 중립 위치로 유지합니다. '머리 위에 줄이 달려 천장으로 당기는 느낌'으로 달리면 자세 교정에 도움이 됩니다.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://pubmed.ncbi.nlm.nih.gov/21659893/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Running form & economy review — NCBI ↗</a></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://pubmed.ncbi.nlm.nih.gov/24903761/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Upper body mechanics in distance running — Journal of Sports Sciences ↗</a></li>

          </ul>
          <p className="mt-3 text-xs text-gray-400">광고·협찬 없이 공적 연구 자료와 러너의 이익을 위해 작성되었습니다.</p>
        </section>

        <YoutubeSection links={[
          { label: "달리기 자세 완벽 정리 — 착지, 케이던스, 보폭, 무게중심", channel: "러닝코치TV", url: "https://www.youtube.com/watch?v=Bph9EsM-24I" },
          { label: "달리기 전후 필요한 스트레칭 — 운동 강도별 루틴", channel: "건강운동TV", url: "https://www.youtube.com/watch?v=kBluJKveigU" },
          { label: "러닝폼 상체 교정 — 팔 스윙·어깨·시선 체크리스트", channel: "James Dunne", url: "https://www.youtube.com/watch?v=brFHyOtTwH4" },
        ]} />

        <FaqSection items={[
          {
            q: "달릴 때 어깨는 어떻게 두어야 하나요?",
            a: "어깨를 자연스럽게 뒤로 당겨 귀와 어깨가 수직선을 이루게 하세요. 피로해지면 어깨가 귀 쪽으로 올라가기 쉬우니, 5km마다 한 번씩 의식적으로 내리고 뒤로 당겨줍니다.",
          },
          {
            q: "팔은 어떻게 흔드는 게 맞나요?",
            a: "팔꿈치를 90도로 굽히고 팔이 몸의 정중선을 넘지 않게 하세요. 손은 달걀을 가볍게 쥔 정도의 힘만 줍니다. 팔이 좌우로 과하게 흔들리면 골반도 같이 흔들려 에너지가 낭비됩니다.",
          },
          {
            q: "달릴 때 시선은 어디를 봐야 하나요?",
            a: "10~15m 앞 지면을 봅니다. 발밑을 보면 목이 앞으로 나오고 등이 굽습니다. 머리는 척추 위 중립 위치로, '머리 위에 줄이 달려 천장으로 당기는 느낌'으로 달리면 자세 교정에 도움이 됩니다.",
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
