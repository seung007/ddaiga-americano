import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import YoutubeSection from "@/components/YoutubeSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "미드풋 착지, 무조건 좋은 게 아닌 이유 — 뛰다가 아메리카노",
  description: "힐스트라이크가 나쁜 게 아닙니다. 초보 러너에게 맞는 착지법이 따로 있습니다.",
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
          <span className="inline-block text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full mb-3">착지법</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">미드풋 착지, 무조건 좋은 게 아닌 이유</h1>
          <p className="text-gray-500 text-sm mb-4">5분 읽기</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            광고·협찬 없음 — 공개 연구 및 의학 자료 기반
          </div>
        </header>
        <p className="text-lg leading-relaxed mb-8 text-gray-700">"힐스트라이크로 달리면 무릎이 망가진다"는 말, 한 번쯤 들어보셨을 겁니다. 하지만 2023년 기준 스포츠의학 연구들은 착지 방식 자체보다 '착지 위치'가 더 중요하다고 말합니다.</p>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">착지법 연구 현황</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">하버드 대학교 다니엘 리버만 교수의 2010년 연구는 맨발 러너(포어풋/미드풋 착지)가 충격이 적다고 발표했습니다. 하지만 이후 연구들에서는 힐스트라이크 러너도 보폭이 과도하게 길지 않으면 부상률 차이가 없다는 결과가 나왔습니다.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">진짜 중요한 것: 오버스트라이드 방지</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">착지 방식보다 '발이 무게중심 앞에서 땅에 닿는가(오버스트라이드)'가 핵심입니다. 힐스트라이드라도 발이 무게중심 바로 아래 또는 그 근처에서 닿으면 충격이 적습니다.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">초보 러너에게 권장하는 방법</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">착지 방식을 바꾸기보다 케이던스를 현재보다 5~10% 높이는 것을 먼저 시도하세요. 케이던스가 높아지면 자연스럽게 보폭이 줄고, 오버스트라이드가 교정됩니다. 강제적인 미드풋 전환은 아킬레스 부상으로 이어질 수 있습니다.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://pubmed.ncbi.nlm.nih.gov/20111000/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Lieberman et al. 2010 — Foot strike & impact (Nature) ↗</a></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://bjsm.bmj.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Foot strike pattern & injury — BJSM 2017 ↗</a></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://pubmed.ncbi.nlm.nih.gov/22504436/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Overstriding & running economy — NCBI ↗</a></li>

          </ul>
          <p className="mt-3 text-xs text-gray-400">광고·협찬 없이 공적 연구 자료와 러너의 이익을 위해 작성되었습니다.</p>
        </section>

        <YoutubeSection links={[
          { label: "착지법 전쟁 종결 — 미드풋 vs 리어풋 vs 힐스트라이크", channel: "달리기연구소", url: "https://www.youtube.com/watch?v=FWXS4q-34w8" },
          { label: "수십 년째 논쟁 — 힐스트라이크 vs 미드풋 vs 포어풋", channel: "굿러너TV", url: "https://www.youtube.com/watch?v=b20-GrHPMWI" },
          { label: "오버스트라이드 교정 — 부상 없이 달리는 발 착지법", channel: "Sage Running", url: "https://www.youtube.com/watch?v=b-4qnRhRBGs" },
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
