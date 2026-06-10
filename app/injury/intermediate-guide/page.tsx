import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "중급자 부상 예방 가이드 (6~24개월) — 뛰다가 아메리카노",
  description: "러닝 6개월~2년 차 러너를 위한 부상 예방 가이드. IT밴드, 아킬레스건, 오버트레이닝 징후.",
};

export default function IntermediateGuidePage() {
  return (
    <>
      <SiteHeader />
      <article className="max-w-3xl mx-auto px-6 py-12 text-gray-900">

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">🟡 중급자</span>
            <span className="text-xs text-gray-400">러닝 6~24개월 · 주간거리 15~40km</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">중급자 부상 예방 가이드</h1>
          <p className="text-gray-600 leading-relaxed">
            중급자는 "이제 좀 달릴 만하다"는 자신감이 부상의 씨앗이 됩니다.
            Taunton et al.(2003) 연구에 따르면 러닝 부상의 70%는 훈련 오류(training error)로, 
            적절한 부하 관리와 회복이 부상 예방의 핵심입니다.
          </p>
        </div>

        <section className="mb-8 p-5 bg-amber-50 rounded-2xl border border-amber-100">
          <h2 className="text-base font-bold text-amber-900 mb-3">중급자 기준</h2>
          <ul className="text-sm text-amber-800 space-y-1.5">
            <li>• 러닝 경력 <strong>6~24개월</strong></li>
            <li>• 주간 달리기 거리 <strong>15~40km</strong></li>
            <li>• 5km 완주 경험 있음, 10km 준비 중 또는 완주</li>
            <li>• 1km 페이스 5~7분대</li>
          </ul>
          <p className="text-xs text-amber-700 mt-3">
            출처: Taunton et al. (2003) <em>Running injuries</em>, Br J Sports Med — 중급자 부상 패턴 분석
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">① 중급자에게 흔한 부상 Top 3</h2>
          <div className="flex flex-col gap-4">
            {[
              {
                name: "장경인대 증후군 (IT Band Syndrome)",
                freq: "중급자 러닝 부상 1위, 전체의 22%",
                cause: "고관절 외전근 약화, 갑작스런 주간 거리 증가, 내리막 훈련 과다",
                fix: "고관절 외전근(중둔근) 강화 운동, 폼롤러, 주간 거리 10% 규칙 유지",
                color: "border-amber-200 bg-amber-50",
                ref: "Sanchez-Alvarado et al. (2024) Frontiers in Sports"
              },
              {
                name: "아킬레스건병증 (Achilles Tendinopathy)",
                freq: "중급자 이상 부상의 11%",
                cause: "훈련량 급증, 주법 변경 후 부하 증가, 쿠션 부족 신발",
                fix: "편심성 힐드롭 운동(Alfredson 프로토콜, 주 7일 3×15회 12주), 로드 감소",
                color: "border-orange-200 bg-orange-50",
                ref: "Prudêncio et al. (2023) J Hum Kinet — PMC9878810"
              },
              {
                name: "족저근막염 (Plantar Fasciitis)",
                freq: "러닝 부상의 8~10%",
                cause: "아침 첫 발걸음 통증, 편평족·높은 아치, 딱딱한 신발",
                fix: "종아리 스트레칭, 발바닥 마사지, 드롭 높은 신발로 교체, 쿠션 인솔",
                color: "border-red-200 bg-red-50",
                ref: "Buchbinder (2004) N Engl J Med — 족저근막염 치료 근거"
              }
            ].map(item => (
              <div key={item.name} className={`rounded-xl border p-4 ${item.color}`}>
                <p className="font-semibold text-gray-900 mb-1">{item.name}</p>
                <p className="text-xs text-gray-500 mb-2">발생 빈도: {item.freq}</p>
                <p className="text-sm text-gray-700 mb-1"><span className="font-medium">원인:</span> {item.cause}</p>
                <p className="text-sm text-gray-700"><span className="font-medium">대처:</span> {item.fix}</p>
                <p className="text-xs text-gray-400 mt-2">근거: {item.ref}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">② 오버트레이닝 징후 — 언제 쉬어야 하나</h2>
          <p className="text-gray-700 mb-3 leading-relaxed">
            Meeusen et al. (2013, MSSE)의 합의문에 따르면, 오버트레이닝 증후군은 <strong>기능적 과부하(Functional Overreaching)→비기능적 과부하→오버트레이닝</strong> 순으로 진행됩니다.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["수행 능력 갑자기 저하", "평소 페이스가 갑자기 느려짐"],
              ["수면 질 저하", "피곤한데 잠이 안 옴"],
              ["안정 심박수 상승", "평소보다 아침 맥박 +5~10bpm"],
              ["기분 변화·짜증", "훈련에 대한 의욕 저하"],
              ["만성 근육통", "48시간 이상 지속되는 피로감"],
              ["반복 감기·면역 저하", "훈련 후 자주 아픔"],
            ].map(([title, desc]) => (
              <div key={title} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <p className="font-semibold text-sm text-gray-900 mb-1">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            출처: Meeusen et al. (2013) MSSE 45(1):186-205 — <a href="https://pubmed.ncbi.nlm.nih.gov/23247672/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">③ 중급자 부하 관리 원칙</h2>
          <div className="flex flex-col gap-3">
            {[
              { title: "3주 증가 + 1주 회복 주기", desc: "3주간 점진적으로 거리·강도를 높인 뒤, 4주차는 이전 주 대비 20~30% 줄이는 회복 주를 넣어야 합니다." },
              { title: "폴리메트릭 훈련 병행", desc: "주 1~2회 스쿼트·런지·힙힌지 등 근력 운동은 힘줄·뼈 적응 속도를 높여 부상을 예방합니다(Lauersen 2014, BJSM)." },
              { title: "장거리는 주간 거리의 30% 이내", desc: "1회 장거리 런은 주간 총 거리의 30%를 넘기지 않아야 합니다." },
            ].map(item => (
              <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-semibold text-gray-900 mb-1">{item.title}</p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <YoutubeSection links={[
          { label: "러닝할 때 무릎 바깥쪽이 아픈 이유 — 장경인대증후군이란?", channel: "정형외과TV", url: "https://www.youtube.com/watch?v=vqe3vSYP3jo" },
          { label: "아킬레스건이 아픈 원인과 치료, 스트레칭 방법 (골통 의사 윤재웅)", channel: "골통 의사 윤재웅", url: "https://www.youtube.com/watch?v=aKWMUcOL4bE" },
          { label: "[장경인대증후군] 러너에게 흔한 통증질환 TOP3", channel: "재활운동TV", url: "https://www.youtube.com/watch?v=4Y7xKZc6KtE" },
          { label: "정형외과 의사가 생각하는 달리기 부상과 장경인대염", channel: "정형외과 의사", url: "https://www.youtube.com/watch?v=z3UUVQf57m0" },
          { label: "자전거·러닝 전 이거 안하면 무릎 나갑니다! 3분 장경인대 #Shorts", channel: "재활운동TV", url: "https://www.youtube.com/shorts/uNI9DtqCy6M" },
          { label: "달리기 후 아킬레스건 통증 해결하는 3분 운동 #Shorts", channel: "재활운동TV", url: "https://www.youtube.com/shorts/2BsTWOvhmPg" },
        ]} />

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">과학적 근거 논문</h2>
          <ul className="flex flex-col gap-2 text-sm text-gray-700">
            <li><strong>Taunton et al. (2003)</strong> — 러닝 부상 2002건 후향 분석. BJSM 37(3):239-244. <a href="https://pubmed.ncbi.nlm.nih.gov/12782543/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Sanchez-Alvarado et al. (2024)</strong> — IT밴드 증후군 보존적 치료 체계적 고찰. Frontiers in Sports. <a href="https://pubmed.ncbi.nlm.nih.gov/39247485/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Prudêncio et al. (2023)</strong> — 아킬레스건병증 편심성 운동 메타분석. J Hum Kinet. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9878810/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PMC →</a></li>
            <li><strong>Meeusen et al. (2013)</strong> — 오버트레이닝 증후군 합의문. MSSE 45(1):186-205. <a href="https://pubmed.ncbi.nlm.nih.gov/23247672/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
          </ul>
          <p className="text-xs text-gray-400 mt-2">※ 이 콘텐츠는 의학적 진단을 대체하지 않습니다.</p>
        </section>

        <FaqSection items={[
          {
            q: "중급자는 어느 단계의 러너를 말하나요?",
            a: "보통 러닝 경험 6~24개월 구간의 러너입니다. '이제 좀 달릴 만하다'는 자신감이 생기는 시기인데, 이 자신감이 부상의 씨앗이 되곤 합니다.",
          },
          {
            q: "중급자가 부상당하는 가장 흔한 원인은?",
            a: "훈련 오류(training error)입니다. Taunton et al.(2003) 연구에 따르면 러닝 부상의 70%가 여기서 비롯됩니다. 즉 신체 능력보다 부하 관리와 회복이 부상 예방의 핵심입니다.",
          },
          {
            q: "언제 쉬어야 하는지 어떻게 아나요?",
            a: "오버트레이닝 징후를 살펴야 합니다. 누적 피로, 수행력 저하, 수면 장애, 안정시 심박수 상승, 달리기 의욕 감소 등이 신호이며, 이때는 부하를 줄이고 회복일을 늘려야 합니다.",
          },
        ]} />

        <div className="p-6 bg-emerald-50 rounded-2xl text-center">
          <p className="font-medium text-emerald-900 mb-2">주간 거리 늘릴 때 체중에 맞는 쿠셔닝이 중요합니다</p>
          <Link href="/shoe-finder" className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            내 체형 맞춤 신발 찾기 →
          </Link>
        </div>

      </article>
    </>
  );
}
