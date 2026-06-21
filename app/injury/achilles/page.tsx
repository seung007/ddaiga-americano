import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import type { Metadata } from "next";

const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/achilles";

export const metadata: Metadata = {
  title: "미드풋 전환 후 아킬레스건·종아리 통증 스트레칭 — 뛰다가 아메리카노",
  description: "주법을 바꾼 뒤 아킬레스건이나 종아리가 당긴다면? 전환 초기에 꼭 해야 할 스트레칭 루틴을 알려드립니다.",
};

export default function AchillesPage() {
  return (
    <>
      <ArticleJsonLd
        headline="미드풋 전환 후 아킬레스건·종아리 통증 스트레칭"
        description="주법을 바꾼 뒤 아킬레스건이나 종아리가 당긴다면? 전환 초기에 꼭 해야 할 스트레칭 루틴을 알려드립니다."
        url={PAGE_URL}
        datePublished="2025-03-01"
      />
      <SiteHeader />
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 부상 예방 가이드
        </Link>

        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full mb-3">
            아킬레스
          </span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
            미드풋 전환 후 아킬레스건·종아리<br />통증 스트레칭
          </h1>
          <p className="text-gray-500 text-sm">4분 읽기</p>
        </header>

        <p className="text-lg leading-relaxed mb-8 text-gray-700">
          유튜브에서 "미드풋으로 달려야 무릎이 안 아프다"는 영상을 보고 바로 따라 했다가
          일주일 뒤 종아리와 아킬레스건에 통증이 생기는 경우가 많습니다.
          문제는 주법이 잘못된 게 아니라, 전환 속도가 너무 빠른 것입니다.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">왜 아킬레스건이 아픈가요?</h2>
          <p className="leading-relaxed text-gray-700 mb-4">
            힐스트라이크(뒤꿈치 착지)로 달리던 사람이 미드풋으로 바꾸면,
            종아리 근육과 아킬레스건이 기존보다 훨씬 더 많은 일을 하게 됩니다.
            이 근육들이 새 자극에 적응하기 전에 너무 많이 쓰면 건증(Tendinopathy)이 생깁니다.
          </p>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm text-orange-900">
            <strong>적응 기간 가이드:</strong> 힐스트라이크 → 미드풋 전환은 최소 6~8주에 걸쳐 천천히 해야 합니다.
            처음 2주는 전체 달리기의 20~30%만 미드풋으로 달리세요.
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">전환 중 꼭 해야 할 스트레칭 루틴</h2>

          <div className="space-y-6">
            <div className="border border-gray-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">1</span>
                <h3 className="font-bold text-gray-900">벽 카프 스트레칭 (종아리 앞쪽 늘리기)</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                달리기 후, 아킬레스건이 당길 때 가장 먼저 해야 하는 스트레칭입니다.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                <ol className="space-y-1 list-decimal list-inside">
                  <li>벽에 손을 짚고 한 발을 뒤로 뺍니다</li>
                  <li>뒤쪽 발 뒤꿈치를 바닥에 완전히 붙인 채 앞쪽 무릎을 굽힙니다</li>
                  <li>종아리가 당기는 느낌이 날 때 30초 유지합니다</li>
                  <li>반대쪽도 반복 / 양쪽 각 3세트</li>
                </ol>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">2</span>
                <h3 className="font-bold text-gray-900">솔리어스 스트레칭 (종아리 깊은 근육)</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                아킬레스건에 직접 붙어 있는 솔리어스 근육입니다. 무릎을 구부린 상태에서만 늘어납니다.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                <ol className="space-y-1 list-decimal list-inside">
                  <li>벽에 손을 짚고 스트레칭할 발을 뒤로 반 발자국만 뺍니다</li>
                  <li>뒤쪽 발 뒤꿈치를 바닥에 붙인 채 <strong>뒤쪽 무릎도 같이 굽힙니다</strong></li>
                  <li>아킬레스건 바로 위가 당기는 느낌이 나면 성공입니다 / 30초 유지</li>
                  <li>양쪽 각 3세트</li>
                </ol>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">3</span>
                <h3 className="font-bold text-gray-900">편심성 힐 드롭 (아킬레스건 강화)</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                스트레칭만으로는 부족합니다. 아킬레스건을 강하게 만드는 운동을 함께 해야 재발을 막습니다.
                통증이 사라진 뒤 예방 목적으로 계속하세요.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                <ol className="space-y-1 list-decimal list-inside">
                  <li>계단 끝에 발 앞부분만 걸칩니다</li>
                  <li>양발로 올라간 뒤, 한 발로만 천천히(3~5초) 내려옵니다</li>
                  <li>한쪽 15회 × 3세트 / 하루 1~2회</li>
                  <li>처음엔 살짝 당기는 느낌이 정상 — 날카로운 통증이 오면 중단</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">드롭이 낮은 신발도 영향을 줍니다</h2>
          <p className="leading-relaxed text-gray-700">
            힐-투-토 드롭이 낮은 신발(4mm 이하)은 미드풋 착지를 유도하지만,
            동시에 아킬레스건에 가해지는 부하를 늘립니다.
            전환 초기에는 드롭 8~12mm의 신발을 유지하고, 몸이 적응한 뒤 낮은 드롭으로 바꾸는 것을 권장합니다.
          </p>
        </section>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8 text-sm text-amber-900">
          <strong>병원에 가야 할 신호:</strong> 아침에 첫 발걸음을 뗄 때 아킬레스건이 극심하게 아프거나,
          아킬레스건 자체가 붓고 열감이 있다면 아킬레스건염이나 파열 가능성이 있습니다. 즉시 달리기를 멈추고 진료를 받으세요.
        </div>


        <YoutubeSection links={[
          { label: "아킬레스건이 아픈 원인과 치료, 스트레칭 방법까지! (골통 의사 윤재웅)", channel: "골통 의사 윤재웅", url: "https://www.youtube.com/watch?v=aKWMUcOL4bE" },
          { label: "아킬레스건 통증! 순식간에 사라지는 운동 루틴", channel: "재활운동TV", url: "https://www.youtube.com/watch?v=gj8XiInamMw" },
          { label: "아킬레스건 통증 해결을 위한 5분 운동", channel: "피지컬 갤러리", url: "https://www.youtube.com/watch?v=SJ_DtvsdNlo" },
          { label: "달리기 후 아킬레스건 통증 해결하는 3분 운동", channel: "재활운동TV", url: "https://www.youtube.com/shorts/2BsTWOvhmPg" },
        ]} />

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">과학적 근거 및 참고 논문</h2>
          <ul className="flex flex-col gap-2">
            <li className="text-sm text-gray-700">
              <strong>Prudêncio et al. (2023, J Hum Kinet)</strong> — 아킬레스건병 치료에서 편심성 운동이 다른 운동보다 효과적임을 확인한 체계적 고찰 및 메타분석. Alfredson 프로토콜(주 7일, 3세트 15회 × 12주) 권고.{" "}
              <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9878810/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PMC 원문 →</a>
            </li>
            <li className="text-sm text-gray-700">
              <strong>Beyer et al. (2023, Frontiers Sports)</strong> — 아킬레스건 중부 건병증 재활 운동 효과에 대한 체계적 고찰. 점진적 부하 운동이 통증 및 기능 회복에 유의미한 개선 효과.{" "}
              <a href="https://www.frontiersin.org/articles/10.3389/fspor.2023.1144484/full" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">Frontiers 원문 →</a>
            </li>
          </ul>
          <p className="text-xs text-gray-400 mt-2">※ 이 콘텐츠는 의학적 진단이나 치료를 대체하지 않습니다. 지속적 통증은 전문의 상담을 권장합니다.</p>
        </section>

        <FaqSection items={[
          {
            q: "미드풋으로 바꾼 뒤 아킬레스건이 당기는 게 정상인가요?",
            a: "미드풋 착지는 아킬레스건과 종아리에 가는 부하를 늘리기 때문에 전환 초기의 가벼운 당김은 흔합니다. 힐스트라이크에서 미드풋 전환은 최소 6~8주에 걸쳐 천천히 해야 합니다. 다만 날카로운 통증이 오거나 아침 첫 발걸음에 극심한 통증이 있다면 중단하고 진료를 받아야 합니다.",
          },
          {
            q: "아킬레스건·종아리 통증에 어떤 스트레칭이 효과적인가요?",
            a: "세 가지를 권장합니다. ① 벽 카프 스트레칭 30초 ② 솔리어스(종아리 깊은 근육) 스트레칭 30초 ③ 편심성 카프 레이즈 — 양발로 올라가 한 발로 3~5초에 걸쳐 천천히 내려오기, 한쪽 15회×3세트 하루 1~2회. 메타분석(Prudêncio 2023)에서 편심성 운동이 아킬레스건병에 가장 효과적인 운동으로 확인됐습니다.",
          },
          {
            q: "아킬레스건이 약하면 신발 드롭은 몇 mm가 좋나요?",
            a: "드롭(뒤꿈치와 앞발 높이 차)이 높을수록 아킬레스건 부담이 줄어듭니다. 주법 전환 중이거나 아킬레스건에 통증 이력이 있다면 드롭 8mm 이상을 추천합니다. 드롭 4mm 이하의 낮은 신발은 부담을 키울 수 있습니다.",
          },
        ]} />

        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl">
          <p className="font-medium text-emerald-900 mb-2">드롭 높이까지 고려한 신발이 필요하다면</p>
          <p className="text-sm text-emerald-800 mb-4">
            추천 결과에 드롭(mm)과 쿠셔닝 정보가 함께 표시됩니다. 전환 중이라면 드롭 8mm 이상을 추천합니다.
          </p>
          <Link
            href="/shoe-finder"
            className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            내 러닝화 찾기 →
          </Link>
        </div>
      </article>
    </>
  );
}
