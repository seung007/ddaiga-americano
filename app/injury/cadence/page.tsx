import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "케이던스 180은 거짓말? 키별 적정 기준값 — 뛰다가 아메리카노",
  description: "모든 사람에게 케이던스 180 spm이 정답이라는 건 틀렸습니다. 키에 따라 달라지는 적정 케이던스 기준값을 알아봅니다.",
};

export default function CadencePage() {
  return (
    <>
      <SiteHeader />
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 주법 & 달리기 기술
        </Link>

        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full mb-3">케이던스</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
            케이던스 180은 거짓말?<br />키별 적정 기준값
          </h1>
          <p className="text-gray-500 text-sm mb-4">5분 읽기</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            광고·협찬 없음 — 스포츠의학 연구 및 공개 데이터 기반
          </div>
        </header>

        <p className="text-lg leading-relaxed mb-8 text-gray-700">
          유튜브와 러닝 커뮤니티에는 "케이던스 180 spm을 유지해야 부상을 막을 수 있다"는 조언이 넘쳐납니다.
          하지만 이 숫자는 키 175cm 전후의 남성 엘리트 선수들에게서 관찰된 평균값입니다.
          키가 다르면 적정 케이던스도 달라집니다.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">180 spm의 출처</h2>
          <p className="leading-relaxed text-gray-700 mb-4">
            1984년 스포츠 과학자 잭 다니엘스(Jack Daniels)가 LA 올림픽 마라톤 선수들을 관찰한 결과,
            대부분이 분당 180보 이상을 유지하는 것을 발견했습니다. 이 관찰이 "180 법칙"으로 퍼졌지만,
            당시 분석 대상은 세계 정상급 엘리트 선수들이었고, 키 분포도 제한적이었습니다.
          </p>
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-sm text-purple-900">
            <strong>핵심:</strong> 케이던스는 달리기 효율의 결과물이지, 목표값이 아닙니다.
            무리하게 케이던스를 높이면 보폭이 줄어 오히려 피로도가 올라갈 수 있습니다.
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">키별 적정 케이던스 기준값</h2>
          <p className="text-sm text-gray-600 mb-4">
            아래 값은 데이터 기반 권장 범위입니다. 개인 보폭·체력에 따라 ±5 spm 편차는 정상입니다.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  {["키", "적정 케이던스", "비고"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["~160cm", "175~185 spm", "키 작을수록 보폭 짧아 걸음수 많아짐"],
                  ["160~175cm", "170~180 spm", "\"180 법칙\"이 유효한 키 범위"],
                  ["175~185cm", "165~175 spm", "보폭이 길어지면서 자연스럽게 낮아짐"],
                  ["185cm~", "160~170 spm", "키 큰 러너는 160대도 효율적"],
                ].map(([height, cadence, note], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-medium text-gray-900">{height}</td>
                    <td className="px-4 py-3 font-bold text-purple-700">{cadence}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            출처: Heiderscheit BC et al., "Effects of step rate manipulation on joint mechanics during running." Med Sci Sports Exerc. 2011 /
            <a href="https://pubmed.ncbi.nlm.nih.gov/21085030/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700 ml-1">PubMed ↗</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">케이던스를 높이면 실제로 좋아지는 것</h2>
          <p className="leading-relaxed text-gray-700 mb-4">
            케이던스를 현재보다 5~10% 높이면 착지 시 무릎과 고관절에 가해지는 충격이 줄어든다는 연구 결과는 있습니다.
            하지만 이는 "180 spm으로 맞춰라"가 아니라 "현재 케이던스에서 조금씩 높여보라"는 의미입니다.
          </p>
          <div className="border border-gray-100 rounded-xl p-4 text-sm text-gray-700">
            <p className="font-semibold mb-2">현재 케이던스 측정 방법</p>
            <ol className="space-y-1 list-decimal list-inside text-gray-600">
              <li>편안한 페이스로 1분 달립니다</li>
              <li>오른발이 땅에 닿는 횟수를 30초 동안 셉니다</li>
              <li>그 숫자에 4를 곱하면 분당 케이던스(spm)입니다</li>
            </ol>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            {[
              { title: "Heiderscheit et al. (2011) — Step rate & joint mechanics (PubMed)", url: "https://pubmed.ncbi.nlm.nih.gov/21085030/" },
              { title: "Jack Daniels' Running Formula (3rd Ed.) — 케이던스 관찰 원전", url: "https://www.worldathletics.org" },
              { title: "British Journal of Sports Medicine — Cadence review", url: "https://bjsm.bmj.com" },
            ].map((ref, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-gray-400 shrink-0">•</span>
                <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">{ref.title} ↗</a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-gray-400">광고·협찬 없이 공적 연구 자료와 러너의 이익을 위해 작성되었습니다.</p>
        </section>


        <YoutubeSection links={[
          { label: "케이던스·보폭의 진실 — 내 몸에 맞는 리듬 찾기", channel: "굿러너TV", url: "https://www.youtube.com/watch?v=2RBeakkyw7c" },
          { label: "초보러너에게 맞는 케이던스 찾기 (보폭, 리듬) | 존2 러닝", channel: "러닝코치", url: "https://www.youtube.com/watch?v=bbgqFviCdd8" },
          { label: "케이던스는 무조건 빠른 게 좋을까? [달리기 보폭과 케이던스]", channel: "달리기연구소", url: "https://www.youtube.com/watch?v=9XIpX69kW2c" },
          { label: "직접 180 케이던스로 뛰어보며 비교 — 러닝 트렌드", channel: "러닝 트렌드", url: "https://www.youtube.com/watch?v=iGeS1N1eYJQ" },
          { label: "러닝 케이던스 180으로 고정하지 마세요", channel: "러닝코치", url: "https://www.youtube.com/shorts/FoMWaZKMTMU" },
          { label: "러닝 케이던스 올리는 법", channel: "달리기TV", url: "https://www.youtube.com/shorts/AYcPMquGIds" },
          { label: "이상적인 러닝 케이던스는? (서울대 스포츠공학)", channel: "서울대 스포츠공학", url: "https://www.youtube.com/shorts/c0mtXc3Twmo" },
          { label: "케이던스 180이 정답일까요?", channel: "달리기연구소", url: "https://www.youtube.com/shorts/PUBWGbEuTSg" },
        ]} />

        <FaqSection items={[
          {
            q: "케이던스 180 spm을 꼭 맞춰야 하나요?",
            a: "아니요. 180은 키 175cm 전후 남성 엘리트 선수들에게서 관찰된 평균값입니다(1984년 잭 다니엘스가 LA 올림픽 마라톤 선수를 관찰). 키가 다르면 적정 케이던스도 달라지고, 개인 보폭·체력에 따라 ±5 spm 편차는 정상입니다.",
          },
          {
            q: "내 케이던스는 어떻게 측정하나요?",
            a: "한쪽 발(예: 오른발)이 땅에 닿는 횟수를 30초 동안 센 뒤 4를 곱하면 분당 케이던스(spm)입니다.",
          },
          {
            q: "케이던스를 높이면 뭐가 좋아지나요?",
            a: "현재보다 5~10% 높이면 착지 시 무릎·고관절에 가해지는 충격이 줄어든다는 연구(Heiderscheit 2011)가 있습니다. 단 '180으로 맞춰라'가 아니라 '현재 케이던스에서 조금씩 높여라'가 핵심입니다.",
          },
        ]} />

        <p className="text-xs text-gray-400 mb-4">※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 통증이 지속되면 전문의 상담을 권장합니다.</p>

        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl">
          <p className="font-medium text-emerald-900 mb-2">내 체형에 맞는 신발도 중요합니다</p>
          <Link href="/shoe-finder" className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            내 러닝화 찾기 →
          </Link>
        </div>
      </article>
    </>
  );
}
