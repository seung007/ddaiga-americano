import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import type { Metadata } from "next";

const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/beginner-guide";

export const metadata: Metadata = {
  title: "초심자 부상 예방 완전 가이드 (0~6개월) — 뛰다가 아메리카노",
  description: "러닝 시작 6개월 이내 초보 러너를 위한 부상 예방 완전 가이드. 10% 규칙, 준비운동, 흔한 부상 대처법.",
};

export default function BeginnerGuidePage() {
  return (
    <>
      <ArticleJsonLd
        headline="초심자 부상 예방 완전 가이드 (0~6개월)"
        description="러닝 시작 6개월 이내 초보 러너를 위한 부상 예방 완전 가이드. 10% 규칙, 준비운동, 흔한 부상 대처법."
        url={PAGE_URL}
        datePublished="2025-03-01"
      />
      <SiteHeader />
      <article className="max-w-3xl mx-auto px-6 py-12 text-gray-900">

        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">🟢 초심자</span>
            <span className="text-xs text-gray-400">러닝 0~6개월 · 주간거리 ≤15km</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">초심자 부상 예방 완전 가이드</h1>
          <p className="text-gray-600 leading-relaxed">
            연구마다 편차가 크지만, 러너의 연간 하지 부상 발생률은 19.4~79.3%로 보고됩니다(van Gent et al., 2007).
            처음 6개월이 가장 위험하고, 가장 예방하기 쉬운 시기이기도 합니다.
          </p>
        </div>

        {/* 레벨 기준 */}
        <section className="mb-8 p-5 bg-green-50 rounded-2xl border border-green-100">
          <h2 className="text-base font-bold text-green-900 mb-3">초심자 기준</h2>
          <ul className="text-sm text-green-800 space-y-1.5">
            <li>• 러닝 경력 <strong>0~6개월</strong></li>
            <li>• 주간 달리기 거리 <strong>15km 이하</strong></li>
            <li>• 5km 완주 경험 없거나 최근 6개월 이내</li>
            <li>• 1km 페이스 7~9분대</li>
          </ul>
          <p className="text-xs text-green-700 mt-3">
            위 구간은 이 사이트가 정한 기준입니다. 러닝 경력·주간 거리로 초심자를 정의하는 공인된 분류는 없습니다.
          </p>
        </section>

        {/* 10% 규칙 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">① 10% 규칙 — 가장 중요한 한 가지</h2>
          <p className="text-gray-700 mb-3 leading-relaxed">
            주간 달리기 거리는 <strong>전주 대비 10% 이상 늘리지 않아야</strong> 합니다.
            예: 이번 주 10km였다면 다음 주 최대 11km.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 border border-gray-200">
            <p className="font-semibold mb-1">왜 10%인가?</p>
            <p>
              솔직히 말하면 <strong>10%라는 숫자 자체를 뒷받침하는 연구는 없습니다.</strong> 초보 러너 874명을
              1년간 추적한 연구에서 주간 거리를 30% 넘게 늘린 그룹과 10% 미만으로 늘린 그룹의 전체 부상률은
              통계적으로 유의한 차이가 없었습니다. 거리와 관련된 부상만 따로 보면 위험이 1.59배로 나왔지만
              이것도 통계적 유의성에는 못 미쳤습니다(HR 1.59, 95% CI 0.96–2.66, P=.07).
            </p>
            <p className="mt-2">
              그래도 10% 규칙을 권하는 이유는, 뼈·힘줄·연골이 심폐 능력보다 적응이 느리다는 점과
              위 연구가 <em>안전하다고 증명한 것이 아니라 차이를 찾지 못한 것</em>이기 때문입니다.
              확실한 근거가 있는 규칙이 아니라 <strong>보수적인 경험칙</strong>으로 받아들이세요.
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            출처: Nielsen RØ et al. (2014){" "}
            <a href="https://doi.org/10.2519/jospt.2014.5164" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
              JOSPT 44(10): 739–747
            </a>
          </p>
        </section>

        {/* 초심자 흔한 부상 Top 3 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">② 초심자에게 흔한 부상 Top 3</h2>
          <div className="flex flex-col gap-4">
            {[
              {
                name: "슬개대퇴 증후군 (러너 무릎)",
                freq: "전체 러닝 부상의 16~25%",
                cause: "약한 대퇴사두근, 과도한 계단 오르기 포함",
                fix: "대퇴사두근·둔근 강화, 경사 구간 줄이기, 주간 거리 10% 이내 증가",
                color: "border-red-200 bg-red-50",
                ref: "van Gent et al. (2007) BJSM"
              },
              {
                name: "정강이 통증 (신스플린트)",
                freq: "초심자 부상의 10~15%",
                cause: "포장도로·딱딱한 노면, 쿠셔닝 부족 신발, 갑작스런 거리 증가",
                fix: "부드러운 노면으로 전환, 쿠셔닝 신발 선택, 3일 이상 휴식",
                color: "border-orange-200 bg-orange-50",
                ref: "Galbraith & Lavallee (2009) Curr Rev MSK"
              },
              {
                name: "물집·흑색 발톱",
                freq: "초심자 85%가 경험",
                cause: "사이즈 미스매치, 양말 소재 불량, 긴 발톱",
                fix: "러닝화는 엄지발가락 1cm 여유, 기술성 양말 착용, 발톱 짧게 유지",
                color: "border-yellow-200 bg-yellow-50",
                ref: "Lipman & Haddad (2016) Foot Ankle Clin"
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

        {/* 준비운동 & 쿨다운 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">③ 초심자 필수 루틴</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <p className="font-semibold text-emerald-900 mb-2">달리기 전 (5분)</p>
              <ul className="text-sm text-emerald-800 space-y-1">
                <li>• 제자리 걷기 1분</li>
                <li>• 레그 스윙 10회 × 양발</li>
                <li>• 힙 써클 10회 × 양발</li>
                <li>• 런지 워크 10보</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="font-semibold text-blue-900 mb-2">달리기 후 (5분)</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 종아리 스트레칭 30초 × 2</li>
                <li>• 햄스트링 스트레칭 30초 × 2</li>
                <li>• 고관절 굴곡근 30초 × 2</li>
                <li>• 천천히 걷기 2분</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            출처: Behm & Chaouachi (2011) <a href="https://pubmed.ncbi.nlm.nih.gov/21302337/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">EJAP — 동적 워밍업 효과</a>
          </p>
        </section>

        {/* 주간 훈련 계획 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">④ 초심자 권장 주간 훈련 패턴</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 rounded-tl-xl">요일</th>
                  <th className="text-left p-3">활동</th>
                  <th className="text-left p-3 rounded-tr-xl">비고</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["월", "휴식", "완전 휴식 또는 가벼운 스트레칭"],
                  ["화", "달리기 20~30분", "편한 페이스 (대화 가능한 속도)"],
                  ["수", "휴식 or 걷기", "30분 빠른 걷기 가능"],
                  ["목", "달리기 20~30분", "화요일과 동일 페이스"],
                  ["금", "휴식", "완전 휴식"],
                  ["토", "달리기 30~40분", "이번 주 가장 긴 거리"],
                  ["일", "휴식 or 가벼운 걷기", "회복"],
                ].map(([day, act, note]) => (
                  <tr key={day} className="border-t border-gray-100">
                    <td className="p-3 font-medium text-gray-900">{day}</td>
                    <td className="p-3 text-gray-700">{act}</td>
                    <td className="p-3 text-gray-500 text-xs">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            위 빈도는 이 사이트가 정한 기준입니다. '주 3회가 최적'이라는 특정 논문 근거는 확인하지 못했습니다.
          </p>
        </section>

        <YoutubeSection links={[
          { label: "러닝 전 꼭 해야 할 동적 스트레칭 — 초심자 5분 루틴", channel: "달리기준비TV", url: "https://www.youtube.com/watch?v=rEj3vyacaw4" },
          { label: "10km 대회, 이 영상으로 종결 — 완벽 준비 가이드", channel: "러닝코치TV", url: "https://www.youtube.com/watch?v=3oS5VzHTW3A" },
          { label: "무릎 앞 통증 한방에 해결 — 슬개대퇴통증증후군", channel: "재활운동TV", url: "https://www.youtube.com/watch?v=69TZ8_yYDp4" },
          { label: "5분만에 끝나는 러닝 후 스트레칭", channel: "러닝TV", url: "https://www.youtube.com/watch?v=bsWU6ata_tw" },
          { label: "초보러너 10km 준비 Q&A — 페이스·훈련 완전 정리", channel: "러닝궁금증", url: "https://www.youtube.com/watch?v=B4A61x6T3ao" },
          { label: "달리기 전 꼭 해야 할 동적 스트레칭 #Shorts", channel: "달리기준비", url: "https://www.youtube.com/shorts/rEj3vyacaw4" },
        ]} />

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">과학적 근거 논문</h2>
          <ul className="flex flex-col gap-2 text-sm text-gray-700">
            <li><strong>van Gent et al. (2007)</strong> — 러닝 부상 발생률 및 결정요인 체계적 고찰. 하지 부상 발생률 19.4~79.3%. BJSM 41(8):469-480. <a href="https://pubmed.ncbi.nlm.nih.gov/17473005/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Nielsen RØ et al. (2014)</strong> — 주간 거리 증가폭과 부상. 초보 러너 874명 1년 추적. 전체 부상률에서 유의차 없음. JOSPT 44(10):739-747. <a href="https://doi.org/10.2519/jospt.2014.5164" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">DOI →</a></li>
            <li><strong>Behm & Chaouachi (2011)</strong> — 동적 워밍업 운동 능력 향상 효과. Eur J Appl Physiol. <a href="https://pubmed.ncbi.nlm.nih.gov/21302337/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
          </ul>
          <p className="text-xs text-gray-400 mt-2">※ 이 콘텐츠는 의학적 진단을 대체하지 않습니다. 지속적 통증은 전문의 상담을 권장합니다.</p>
        </section>

        <FaqSection items={[
          {
            q: "초보 러너가 가장 먼저 지켜야 할 한 가지는?",
            a: "거리를 천천히 늘리는 것입니다. 흔히 '10% 규칙'(주간 거리를 전주 대비 10% 넘게 늘리지 않기)이라고 부르는데, 이 숫자 자체를 입증한 연구는 없습니다. 뼈·힘줄·연골이 심폐 능력보다 적응이 느리다는 점에 근거한 보수적인 경험칙으로 받아들이세요.",
          },
          {
            q: "거리를 급하게 늘리면 정말 위험한가요?",
            a: "생각보다 근거가 약합니다. 초보 러너 874명을 1년간 추적한 연구(Nielsen 2014, JOSPT)에서 주간 거리를 30% 넘게 늘린 그룹과 10% 미만으로 늘린 그룹의 전체 부상률은 통계적으로 유의한 차이가 없었습니다. 거리 관련 부상만 보면 1.59배였지만 이것도 유의성에는 못 미쳤습니다(P=.07). 다만 '차이가 없다고 증명된 것'이 아니라 '차이를 찾지 못한 것'이므로, 급격한 증가는 여전히 피하는 편이 안전합니다.",
          },
          {
            q: "달리기 시작 후 언제가 가장 부상 위험이 큰가요?",
            a: "처음 6개월입니다. 가장 위험한 시기이자 가장 예방하기 쉬운 시기이기도 합니다. 10% 규칙을 지키고 워밍업·쿨다운을 챙기면 대부분의 초기 부상을 막을 수 있습니다.",
          },
        ]} />

        <div className="p-6 bg-emerald-50 rounded-2xl text-center">
          <p className="font-medium text-emerald-900 mb-2">초심자에게 맞는 신발이 부상 위험을 줄입니다</p>
          <Link href="/shoe-finder" className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            내 체형·발볼 맞춤 신발 추천 →
          </Link>
        </div>

      </article>
    </>
  );
}
