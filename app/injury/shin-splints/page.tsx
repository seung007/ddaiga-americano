import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "정강이 통증(신스플린트) — 초보 러너에게 가장 흔한 부상 | 뛰다가 아메리카노",
  description:
    "초보 러너 부상 1위인 정강이 통증(MTSS). 피로골절과 어떻게 구별하는지, 무엇이 근거 있는 대처인지 논문 링크와 함께 정리했습니다.",
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
          <span className="inline-block text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full mb-3">부상 부위</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">정강이 통증(신스플린트) — 초보 러너 부상 1위</h1>
          <p className="text-gray-500 text-sm mb-4">5분 읽기</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            협찬 없이 작성 — 아래 모든 주장에 논문 링크를 답니다
          </div>
        </header>

        <p className="text-lg leading-relaxed mb-8 text-gray-700">
          초보 러너 254명의 부상을 1년간 추적한 연구에서 <strong>정강이 통증이 15%로 1위</strong>였습니다.
          2위 슬개대퇴 통증(10%)보다도 많습니다. 정식 이름은 <strong>내측 경골 스트레스 증후군(MTSS)</strong>이고,
          정강이뼈 안쪽 가장자리를 따라 넓게 아픈 것이 특징입니다.
        </p>

        {/* 안전 정보를 맨 위에 둔다 — 이 페이지의 존재 이유 */}
        <section className="mb-8 p-5 bg-red-50 rounded-2xl border border-red-200">
          <h2 className="text-lg font-bold text-red-900 mb-3">먼저 — 피로골절인지 구별하세요</h2>
          <p className="text-sm text-red-900 leading-relaxed mb-3">
            정강이 통증과 <strong>경골 피로골절</strong>은 증상이 비슷하지만 대처가 완전히 다릅니다.
            피로골절을 참고 계속 뛰면 완전골절로 진행할 수 있습니다. 구별의 핵심은 <strong>아픈 범위의 넓이</strong>입니다.
          </p>
          <ul className="text-sm text-red-900 space-y-2">
            <li>
              <strong>MTSS(정강이 통증)</strong> — 정강이뼈 안쪽을 따라 <strong>5cm 이상 넓게</strong> 아픕니다.
              손가락으로 짚으면 &ldquo;이 근처 전체&rdquo;가 아픕니다.
            </li>
            <li>
              <strong>피로골절 의심</strong> — 아픈 곳이 <strong>손가락 하나로 덮이는 2~3cm 한 점</strong>에 몰려 있습니다.
              그 자리를 누르면 유독 아픕니다.
            </li>
          </ul>
          <p className="text-sm font-semibold text-red-900 mt-3 mb-1">아래에 하나라도 해당하면 달리기를 멈추고 병원에 가세요</p>
          <ul className="text-sm text-red-900 space-y-1">
            <li>• 아픈 곳이 한 점에 몰려 있고 손가락 하나로 짚을 수 있다</li>
            <li>• 한 발로 제자리 뛰기(호핑)를 못 할 정도로 아프다</li>
            <li>• 밤에 자다가 아파서 깬다 / 쉬고 있어도 아프다</li>
            <li>• 그 부위가 눈에 띄게 붓는다</li>
            <li>• 저리거나 감각이 이상하다, 발이 툭 떨어지는 느낌이 있다</li>
            <li>• 뛰다 보면 오히려 더 심해진다 (MTSS는 보통 몸이 풀리며 나아졌다가 나중에 다시 아픕니다)</li>
          </ul>
          <p className="text-xs text-red-700 mt-3 leading-relaxed">
            저리거나 감각이 이상하면 만성 운동유발 구획증후군 같은 다른 원인일 수 있습니다. 이 페이지로 자가진단하지 마세요.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">왜 생기나 — 솔직한 답</h2>
          <p className="leading-relaxed text-gray-700">
            정확한 기전은 <strong>아직 정리되지 않았습니다.</strong> 오랫동안 &ldquo;근막이 뼈를 잡아당겨서&rdquo;라고 설명해왔지만,
            현재는 반복 하중에 대한 뼈 자체의 반응(골 스트레스 반응) 쪽에 무게가 실립니다. 확정된 설명은 없습니다.
            그래서 아래 위험 요인은 &ldquo;원인&rdquo;이 아니라 <strong>통계적으로 같이 관찰되는 것</strong>으로 읽어야 합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">근거가 있는 위험 요인</h2>
          <p className="leading-relaxed text-gray-700 mb-3">
            메타분석에서 실제로 유의하게 나온 것들입니다. 효과 크기는 크지 않습니다.
          </p>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• <strong>높은 BMI</strong> — 평균 차이 0.79 (95% CI 0.38~1.20)</li>
            <li>• <strong>주상골 하강(navicular drop)이 큼</strong> — 평균 차이 1.19mm (95% CI 0.54~1.84). 발 아치가 체중을 받을 때 많이 내려앉는 정도입니다</li>
            <li>• <strong>이전에 정강이 통증을 겪은 적 있음</strong></li>
            <li>• <strong>여성</strong></li>
            <li>• <strong>러닝 경력이 짧음</strong> — 그래서 초보에게 1위 부상입니다</li>
            <li>• <strong>발목 발바닥굽힘·고관절 외회전 가동범위</strong></li>
          </ul>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            자주 이야기되지만 메타분석에서 일관되게 확인되지 않은 것: 특정 발 모양, 다리 길이 차이, 특정 신발 종류.
            &ldquo;평발이라서 생긴다&rdquo;는 설명은 근거보다 앞서 나간 것입니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">대처 — 그리고 근거가 약하다는 사실</h2>
          <p className="leading-relaxed text-gray-700 mb-3">
            <strong>MTSS 치료법 중 효과가 확실하게 입증된 것은 거의 없습니다.</strong> 충격파, 깔창, 특정 스트레칭 모두
            근거가 약합니다. 이 사실을 먼저 말해두는 이유는, 어떤 제품이나 시술이 &ldquo;신스플린트에 효과&rdquo;라고 하면
            그게 대체로 근거 없는 주장이기 때문입니다.
          </p>
          <p className="leading-relaxed text-gray-700">
            현재 합의에 가장 가까운 것은 <strong>부하 조절</strong>입니다. 아픈 활동을 줄이고, 통증 없는 범위에서
            천천히 다시 늘리는 것. 걷기·수영·자전거로 유산소를 유지하면서 달리기만 줄이는 방식이 현실적입니다.
            종아리 근력 운동은 부상 예방 전반에 효과가 확인됐지만(근력 운동군 부상 위험비 0.32, Lauersen 2014),
            MTSS만 따로 본 강한 근거는 아닙니다.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0099877" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Nielsen et al. (2014) PLOS ONE — 초보 러너 부상 분포, MTSS 15%로 1위 ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://pubmed.ncbi.nlm.nih.gov/25185588/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Hamstra-Wright et al. (2015) BJSM — MTSS 위험 요인 메타분석 (BMI·주상골 하강) ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://www.tandfonline.com/doi/full/10.2147/OAJSM.S39331" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Newman et al. (2013) Open Access J Sports Med — 러너 MTSS 위험 요인 체계적 고찰 ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://www.ncbi.nlm.nih.gov/books/NBK538479/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                StatPearls — Medial Tibial Stress Syndrome (감별진단·임상 소견) ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://pubmed.ncbi.nlm.nih.gov/24100287/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Lauersen et al. (2014) BJSM — 근력 운동의 부상 예방 효과 메타분석 ↗
              </a>
            </li>
          </ul>
          <p className="mt-3 text-xs text-gray-400">추천 순서는 광고비로 바뀌지 않습니다. 공개된 연구 자료를 근거로 작성했습니다.</p>
        </section>

        <YoutubeSection links={[
          // 2026-08-31: 검색 URL을 실제 영상으로 교체.
          // channel은 일부러 비워둔다 — 실제 업로더를 확인하지 않았고,
          // 짐작으로 채우는 것이 이 저장소에서 40건 오류를 만든 원인이다.
          // npm run check:youtube 가 확인해준 이름으로 채울 것.
          { label: "정강이 통증, 신스프린트 vs 피로골절! 러너 필수 체크", channel: "연세이음정형외과", url: "https://www.youtube.com/watch?v=JfAEEhy5iEg" },
          { label: "정강이 피로골절 — 정의, 진단, 감별진단", channel: "선수촌병원", url: "https://www.youtube.com/watch?v=eAgBvQWuifA" },
        ]} />

        <FaqSection items={[
          {
            q: "정강이 통증과 피로골절은 어떻게 구별하나요?",
            a: "아픈 범위의 넓이로 구별합니다. 정강이 통증(MTSS)은 정강이뼈 안쪽을 따라 5cm 이상 넓게 아픕니다. 피로골절은 손가락 하나로 덮이는 2~3cm 한 점에 통증이 몰립니다. 한 발로 제자리 뛰기를 못 할 정도로 아프거나, 밤에 아파서 깨거나, 붓거나, 저린 느낌이 있으면 피로골절 등 다른 문제일 수 있으니 달리기를 멈추고 병원에 가세요.",
          },
          {
            q: "초보 러너에게 가장 흔한 부상은 무엇인가요?",
            a: "정강이 통증(내측 경골 스트레스 증후군, MTSS)입니다. 초보 러너 254명을 1년간 추적한 연구(Nielsen 2014, PLOS ONE)에서 15%로 1위였고, 2위는 슬개대퇴 통증 10%, 족저근막염은 5%였습니다.",
          },
          {
            q: "신스플린트에 좋은 깔창이나 치료가 있나요?",
            a: "솔직히 말하면 효과가 확실하게 입증된 치료법은 거의 없습니다. 충격파, 깔창, 특정 스트레칭 모두 근거가 약합니다. 현재 합의에 가장 가까운 것은 부하 조절 — 아픈 활동을 줄이고 통증 없는 범위에서 천천히 다시 늘리는 것입니다. '신스플린트에 효과'라고 광고하는 제품은 대체로 근거보다 앞서 나간 주장입니다.",
          },
        ]} />

        <p className="text-xs text-gray-400 mb-4">
          ※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 작성자는 의료인이 아닙니다. 통증이 지속되면 전문의 상담을 권장합니다.
        </p>

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
