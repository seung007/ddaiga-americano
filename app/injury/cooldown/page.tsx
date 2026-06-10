import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "달리기 후 꼭 해야 할 10분 정적 스트레칭 — 뛰다가 아메리카노",
  description: "종아리·햄스트링·엉덩이까지 풀어주는 쿨다운 루틴. 왜 달리고 나서 바로 앉으면 안 되는지 알아봅니다.",
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
          <span className="inline-block text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full mb-3">쿨다운</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">달리기 후 꼭 해야 할 10분 정적 스트레칭</h1>
          <p className="text-gray-500 text-sm mb-4">4분 읽기</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            광고·협찬 없음 — 공개 연구 및 의학 자료 기반
          </div>
        </header>
        <p className="text-lg leading-relaxed mb-8 text-gray-700">달리기를 마치고 바로 앉거나 눕는 것은 혈액이 다리에 몰린 상태를 유지시킵니다. 5분의 걷기와 10분의 정적 스트레칭은 심박수를 서서히 내리고 다음 날의 근육통을 줄입니다.</p>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">쿨다운이 중요한 이유</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">달리기 중 심장은 다리 근육에 많은 혈액을 보냅니다. 갑자기 멈추면 혈액이 다리에 정체되어 어지러움이 생기거나 회복이 늦어질 수 있습니다. 5분 걷기는 심장이 천천히 평상시 박동으로 돌아오게 도와줍니다.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">10분 정적 스트레칭 루틴</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">① 종아리 벽 스트레칭 30초×2 → ② 햄스트링 (서서 앞으로 굽히기) 30초×2 → ③ 고관절 굴근 (런지 자세 유지) 30초×2 → ④ 장경인대 (다리 꼬아 옆으로 기울기) 30초×2 → ⑤ 엉덩이 (누워서 무릎 당기기) 30초×2. 통증이 아닌 당기는 느낌에서 멈추세요.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">회복을 빠르게 하는 추가 팁</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">스트레칭 후 차가운 물이나 단백질+탄수화물 음료(초콜릿 밀크 등)를 섭취하면 근육 회복 속도가 빨라집니다. 수면의 질도 회복에 직접 영향을 미칩니다.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://pubmed.ncbi.nlm.nih.gov/20026990/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Post-exercise recovery nutrition — Journal of Sports Sciences ↗</a></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://www.nsca.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Static stretching after exercise — NSCA ↗</a></li>

          </ul>
          <p className="mt-3 text-xs text-gray-400">광고·협찬 없이 공적 연구 자료와 러너의 이익을 위해 작성되었습니다.</p>
        </section>

        <YoutubeSection links={[
          { label: "러닝 후 쿨다운 스트레칭, 5분만 투자하세요 #초보러너", channel: "러닝스튜디오", url: "https://www.youtube.com/watch?v=4Vbiu6RdpkE" },
          { label: "5분만에 끝나는 러닝 후 스트레칭", channel: "러닝TV", url: "https://www.youtube.com/watch?v=bsWU6ata_tw" },
          { label: "러닝 스트레칭 종결 l 달리기 전후 제발 5분씩만 따라하세요", channel: "피지컬TV", url: "https://www.youtube.com/watch?v=qoPyfVxqpQc" },
        ]} />

        <FaqSection items={[
          {
            q: "달리고 나서 바로 앉거나 누우면 안 되나요?",
            a: "바로 앉거나 누우면 혈액이 다리에 정체돼 어지러움이 생기거나 회복이 늦어질 수 있습니다. 먼저 5분 걷기로 심박수를 서서히 내린 뒤 10분 정적 스트레칭을 하는 게 좋습니다.",
          },
          {
            q: "쿨다운 정적 스트레칭은 어떤 순서로 하나요?",
            a: "① 종아리 벽 스트레칭 → ② 햄스트링(서서 앞으로 굽히기) → ③ 고관절 굴근(런지 자세) → ④ 장경인대(다리 꼬아 옆으로 기울기) → ⑤ 엉덩이(누워서 무릎 당기기), 각 30초씩 2회. 통증이 아니라 당기는 느낌에서 멈추세요.",
          },
          {
            q: "회복을 더 빠르게 하려면 뭘 하면 되나요?",
            a: "스트레칭 후 단백질+탄수화물 음료(초콜릿 밀크 등)를 섭취하면 근육 회복 속도가 빨라집니다. 수면의 질도 회복에 직접 영향을 줍니다.",
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
