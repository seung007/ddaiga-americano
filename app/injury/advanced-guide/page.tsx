import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "숙련자 부상 예방 가이드 (2년+) — 뛰다가 아메리카노",
  description: "러닝 2년 이상 숙련 러너를 위한 부상 예방 가이드. 피로 골절, 건병증, 주기화 훈련.",
};

export default function AdvancedGuidePage() {
  return (
    <>
      <SiteHeader />
      <article className="max-w-3xl mx-auto px-6 py-12 text-gray-900">

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700">🔴 숙련자</span>
            <span className="text-xs text-gray-400">러닝 2년+ · 주간거리 40km 이상</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">숙련자 부상 예방 가이드</h1>
          <p className="text-gray-600 leading-relaxed">
            숙련자는 고강도·고볼륨 훈련을 감당할 수 있지만, 피로 축적이 보이지 않게 진행됩니다.
            Bahr & Mæhlum (2004)에 따르면 엘리트에 가까울수록 <strong>누적 부하(Cumulative Load)</strong>가 
            부상의 주요 원인이 됩니다.
          </p>
        </div>

        <section className="mb-8 p-5 bg-red-50 rounded-2xl border border-red-100">
          <h2 className="text-base font-bold text-red-900 mb-3">숙련자 기준</h2>
          <ul className="text-sm text-red-800 space-y-1.5">
            <li>• 러닝 경력 <strong>2년 이상</strong></li>
            <li>• 주간 달리기 거리 <strong>40km 이상</strong></li>
            <li>• 하프마라톤 완주 경험, 풀마라톤 준비 or 완주</li>
            <li>• 1km 페이스 4~5분대</li>
          </ul>
          <p className="text-xs text-red-700 mt-3">
            출처: Bahr & Mæhlum (2004) — 스포츠 의학 교과서 기준 숙련 러너 정의
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">① 숙련자에게 특유한 부상 Top 3</h2>
          <div className="flex flex-col gap-4">
            {[
              {
                name: "피로 골절 (Stress Fracture)",
                freq: "장거리 러너 연간 1~7%",
                cause: "과도한 충격 반복, 뼈 재형성 속도 초과, 낮은 D 비타민·칼슘",
                fix: "4~8주 러닝 중단, 수영·자전거 대체훈련, 비타민D·칼슘 보충 확인, 쿠셔닝 극대화 신발",
                color: "border-red-200 bg-red-50",
                ref: "Fredericson & Jennings (2000) Clin Sports Med"
              },
              {
                name: "비기능적 오버리칭 (Non-Functional Overreaching)",
                freq: "연간 훈련 목표 달성 실패의 주요 원인",
                cause: "2~3주 이상 지속되는 퍼포먼스 저하, HRV 감소, 코르티솔 상승",
                fix: "최소 2주 완전 감량훈련(deload), 수면 8시간 확보, HRV 모니터링 도입",
                color: "border-orange-200 bg-orange-50",
                ref: "Meeusen et al. (2013) MSSE 45(1):186"
              },
              {
                name: "하마스트링 건병증 (Hamstring Tendinopathy)",
                freq: "스피드 훈련 러너의 부상 Top 3",
                cause: "인터벌·언덕 훈련 증가, 앉는 자세로 인한 건 압박",
                fix: "노르딕 햄스트링 운동, 인터벌 빈도 감소, 딱딱한 자리에 오래 앉기 금지",
                color: "border-purple-200 bg-purple-50",
                ref: "Beyer et al. (2015) Am J Sports Med — 편심성 운동 효과"
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
          <h2 className="text-xl font-bold mb-3">② 주기화 훈련 — 부상 없이 기록을 높이는 구조</h2>
          <p className="text-gray-700 mb-3 leading-relaxed">
            Bompa & Haff (2009)의 주기화 이론에 따르면 훈련은 <strong>준비기→경쟁기→회복기</strong> 3단계로 
            구성해야 누적 피로 없이 최대 성과를 낼 수 있습니다.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3">단계</th>
                  <th className="text-left p-3">기간</th>
                  <th className="text-left p-3">목표</th>
                  <th className="text-left p-3">강도</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["기초 준비기", "8~12주", "유산소 기반, 근력 강화", "저강도 ↑ / 볼륨 ↑"],
                  ["특이 준비기", "4~6주", "레이스 페이스 훈련", "중강도 / 볼륨 유지"],
                  ["경쟁기 (테이퍼)", "2~3주", "피로 해소, 컨디션 정점", "강도 유지 / 볼륨 40%↓"],
                  ["회복기 (전환기)", "2~4주", "완전 회복, 재충전", "저강도 / 볼륨 최소화"],
                ].map(row => (
                  <tr key={row[0]} className="border-t border-gray-100">
                    {row.map((cell, i) => (
                      <td key={i} className="p-3 text-gray-700">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">③ HRV(심박변이도) 모니터링</h2>
          <p className="text-gray-700 mb-3 leading-relaxed">
            Plews et al. (2013, IJSPP)에 따르면 아침 안정 HRV를 7일 평균과 비교해 <strong>5ms 이상 하락 시</strong> 
            훈련 강도를 자동으로 낮추는 HRV 기반 훈련 계획이 고정 계획 대비 VO₂max 향상폭 2배였습니다.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-sm">
            <p className="font-semibold mb-2">실용적 HRV 모니터링 방법</p>
            <ul className="space-y-1 text-gray-700">
              <li>• 매일 아침 기상 직후 1~3분 측정 (Elite HRV, HRV4Training 앱)</li>
              <li>• 7일 평균 대비 당일 값 비교</li>
              <li>• 평균 대비 5% 이상 저하 → 저강도 조깅 or 휴식</li>
              <li>• 2주 이상 지속 저하 → 의사 상담</li>
            </ul>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            출처: Plews et al. (2013) Int J Sports Physiol Perform. <a href="https://pubmed.ncbi.nlm.nih.gov/23479483/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </p>
        </section>

        <YoutubeSection links={[
          { label: "케이던스·보폭의 진실 — 내 몸에 맞는 리듬 찾기", channel: "굿러너TV", url: "https://www.youtube.com/watch?v=2RBeakkyw7c" },
          { label: "직접 180 케이던스로 뛰어보며 비교 — 러닝 트렌드", channel: "러닝 트렌드", url: "https://www.youtube.com/watch?v=iGeS1N1eYJQ" },
          { label: "착지법 전쟁 종결 — 미드풋 vs 리어풋 vs 힐스트라이크", channel: "달리기연구소", url: "https://www.youtube.com/watch?v=FWXS4q-34w8" },
          { label: "서울대 스포츠공학 연구원이 알려주는 이상적인 러닝 케이던스 #Shorts", channel: "서울대 스포츠공학", url: "https://www.youtube.com/shorts/c0mtXc3Twmo" },
          { label: "케이던스 180이 정답일까요? #Shorts", channel: "달리기연구소", url: "https://www.youtube.com/shorts/PUBWGbEuTSg" },
        ]} />

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">과학적 근거 논문</h2>
          <ul className="flex flex-col gap-2 text-sm text-gray-700">
            <li><strong>Meeusen et al. (2013)</strong> — 오버트레이닝 증후군 합의문. MSSE 45(1):186-205. <a href="https://pubmed.ncbi.nlm.nih.gov/23247672/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Plews et al. (2013)</strong> — HRV 기반 훈련 계획 효과. IJSPP 8(5):536-545. <a href="https://pubmed.ncbi.nlm.nih.gov/23479483/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Lauersen et al. (2014)</strong> — 근력 훈련의 스포츠 부상 예방 효과 메타분석. BJSM 48(11):871-877. <a href="https://pubmed.ncbi.nlm.nih.gov/23813543/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
          </ul>
          <p className="text-xs text-gray-400 mt-2">※ 이 콘텐츠는 의학적 진단을 대체하지 않습니다.</p>
        </section>

        <FaqSection items={[
          {
            q: "숙련 러너의 부상 주원인은 무엇인가요?",
            a: "보이지 않게 쌓이는 누적 부하(Cumulative Load)입니다. 고강도·고볼륨을 감당할 수 있더라도 피로가 눈에 띄지 않게 축적됩니다. Bahr & Mæhlum(2004)에 따르면 엘리트에 가까울수록 누적 부하가 부상의 주요 원인이 됩니다.",
          },
          {
            q: "HRV(심박변이도)는 어떻게 활용하나요?",
            a: "매일 아침 기상 직후 1~3분 측정(Elite HRV, HRV4Training 등)해서 평균 대비 5% 이상 떨어지면 그날은 저강도 조깅이나 휴식으로 강도를 낮춥니다. 컨디션을 객관적 수치로 관리하는 방법입니다.",
          },
          {
            q: "기록을 높이면서 부상을 막으려면?",
            a: "주기화(periodization) 훈련으로 고강도·고볼륨과 회복 구간을 구조적으로 번갈아 배치하세요. 근력 훈련도 스포츠 부상 예방 효과가 메타분석으로 입증돼 있습니다.",
          },
        ]} />

        <div className="p-6 bg-emerald-50 rounded-2xl text-center">
          <p className="font-medium text-emerald-900 mb-2">고볼륨 훈련엔 체중에 정확히 맞는 쿠셔닝이 필요합니다</p>
          <Link href="/shoe-finder" className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            내 체형 맞춤 신발 찾기 →
          </Link>
        </div>

      </article>
    </>
  );
}
