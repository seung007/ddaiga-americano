import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import YoutubeSection from "@/components/YoutubeSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "달리기 전 5분 동적 스트레칭 루틴 — 뛰다가 아메리카노",
  description: "정적 스트레칭이 아닌 동적 워밍업이 필요한 이유와 구체적인 5분 루틴을 알려드립니다.",
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
          <span className="inline-block text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full mb-3">준비운동</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">달리기 전 5분 동적 스트레칭 루틴</h1>
          <p className="text-gray-500 text-sm mb-4">4분 읽기</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            광고·협찬 없음 — 공개 연구 및 의학 자료 기반
          </div>
        </header>
        <p className="text-lg leading-relaxed mb-8 text-gray-700">달리기 전에 앉아서 발목을 잡고 늘리는 정적 스트레칭은 오히려 근육 출력을 10~15% 낮춥니다. 달리기 전에는 관절을 움직이며 혈류를 올리는 동적 워밍업이 필요합니다.</p>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">왜 동적 워밍업인가?</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">근육은 차가울 때 탄성이 낮아 미세 파열 위험이 높습니다. 동적 스트레칭은 체온과 심박수를 서서히 올리면서 달리기에 쓰이는 관절 범위를 미리 활성화합니다. 정적 스트레칭은 달리기 후 쿨다운 단계에서 합니다.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">5분 동적 루틴</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">① 제자리 걷기 1분 → ② 레그 스윙 (앞뒤/옆) 각 10회 → ③ 힙 써클 각 10회 → ④ 워킹 런지 10보 → ⑤ 하이 니즈 30초 → ⑥ 버트 킥스 30초. 마지막 1분은 천천히 조깅으로 마무리.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">추운 날 주의사항</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">겨울에는 워밍업 시간을 2배로 늘립니다. 근육이 따뜻해지는 데 더 오랜 시간이 걸리며, 차가운 공기 자체가 호흡기에 부담을 줍니다. 마스크 착용 또는 실내 워밍업을 권장합니다.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://pubmed.ncbi.nlm.nih.gov/16985505/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Dynamic vs Static Stretching before running — NCBI ↗</a></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://www.nsca.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">NSCA — Warm-up guidelines for endurance athletes ↗</a></li>

          </ul>
          <p className="mt-3 text-xs text-gray-400">광고·협찬 없이 공적 연구 자료와 러너의 이익을 위해 작성되었습니다.</p>
        </section>

        <YoutubeSection links={[
          { label: "러닝 전 동적 스트레칭 — 워밍업 8분, 부상방지·퍼포먼스 향상", channel: "러닝스튜디오", url: "https://www.youtube.com/watch?v=ddJ9JUcIHvU" },
          { label: "러닝 전 꼭 해야 할 동적 스트레칭 #달리기준비운동", channel: "달리기준비", url: "https://www.youtube.com/watch?v=rEj3vyacaw4" },
          { label: "5분 워밍업 — 부상 없이 달리기 위한 필수 루틴", channel: "Sage Running", url: "https://www.youtube.com/watch?v=sfF4f-QGRn8" },
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
