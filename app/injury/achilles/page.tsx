import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import InlineAsk from "@/components/InlineAsk";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ShareButtons from "@/components/ShareButtons";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import type { Metadata } from "next";

const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/achilles";

/**
 * 제목 (2026-09-21 교체)
 *
 * 전: 「미드풋 전환 후 아킬레스건·종아리 통증 스트레칭」
 *
 * 왜 바꿨나 — **제목이 독자를 잘못 고르고 있었다.**
 * 네이버 90일 실측 노출 588 · 클릭 5 · CTR 0.9% 로 사이트에서 가장 크게 새는 페이지였는데,
 * 「아킬레스건염」·「아킬레스건 통증」으로 들어오는 사람 대다수는 **주법을 바꾼 적이 없다.**
 * 그 사람에게 제목이 "당신은 미드풋으로 바꾼 사람"이라고 먼저 말하고 있었다.
 * 게다가 「미드풋」이 들어가 있어 `/injury/midfoot`(노출 351)과 같은 검색어를 놓고 겹쳤다 —
 * 그 검색어에서 이 페이지는 **틀린 답**이다.
 *
 * ⚠️ **CTR 이 오른다고 예측하지 않는다.** 2026-08-28 제목 교체 실험에서 제목을 바꿔도
 * CTR 은 움직이지 않았다(클릭이 1~3건이라 CTR ≈ 1/노출). 이건 성과 개선이 아니라
 * **안 맞는 약속을 고치는 일**이다. 숫자로 판정하지 않는다 — `유입_설정_기준선.md §0`.
 *
 * 미드풋은 원인 목록의 하나로 본문에 남는다. 제목에서 뺐을 뿐 내용을 지우지 않았다.
 */
export const metadata: Metadata = {
  title: "달리기 아킬레스건·종아리 통증 스트레칭 3가지 — 뛰다가 아메리카노",
  description: "달린 뒤 아킬레스건이나 종아리가 당긴다면. 왜 아픈지와 무엇을 하면 되는지, 스트레칭 3가지로 정리했습니다. 주법을 바꾼 경우도 함께 다룹니다.",
};

export default function AchillesPage() {
  return (
    <>
      <ArticleJsonLd
        headline="달리기 아킬레스건·종아리 통증 스트레칭 3가지"
        description="달린 뒤 아킬레스건이나 종아리가 당긴다면. 왜 아픈지와 무엇을 하면 되는지, 스트레칭 3가지로 정리했습니다. 주법을 바꾼 경우도 함께 다룹니다."
        url={PAGE_URL}
        datePublished="2025-03-01"
      />
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 러닝 가이드
        </Link>

        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full mb-3">
            아킬레스
          </span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
            달리기 아킬레스건·종아리 통증<br />스트레칭 3가지
          </h1>
          {/* 2026-09-21: 본문이 늘어 4분 → 5분. 허브 카드(app/injury/page.tsx)도 같이 고쳤다 */}
          <p className="text-gray-500 text-sm">5분 읽기</p>
        </header>

        {/**
         * 먼저 결론 (2026-09-13 추가)
         *
         * 이 페이지는 **노출 588에 클릭 5(0.9%)** 로 사이트에서 가장 크게 새는 곳이다.
         * 감사에서 나온 원인: 제목과 본문이 **"미드풋으로 주법을 바꾼 사람"이라는
         * 전제로 잠겨 있다.** 「아킬레스건염」으로 검색한 사람 대다수는 주법을
         * 바꾼 적이 없다. 그 사람에게 "전환 속도가 빠르다"는 진단은 처음부터 틀렸다.
         *
         * ⚠️ 2026-09-13 당시에는 **제목을 안 바꿨다.** 「미드풋」 검색어의 9/25 판정을
         * 앞두고 처방을 더할 수 없다는 이유였다.
         * **2026-09-21 에 바꿨다** — 그 판정 자체가 §0(2026-09-17)에서 폐기됐다.
         * 2주간 이 페이지를 막고 있던 제약이 없어진 것이다. 경위는 파일 맨 위 제목 주석.
         *
         * 아래는 그때 본문만 넓힌 기록이다. 스트레칭 3종은 원인과 무관하게 유효하다는 것을
         * 맨 위에서 밝혀, 전제에 안 맞는 사람이 되돌아가지 않게 한다.
         * 새 의학적 주장은 넣지 않았다 — 아래 본문에 이미 있는 기전
         * ("적응하기 전에 너무 많이 쓰면 건증")을 일반화했을 뿐이다.
         */}
        <div className="mt-2 mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">먼저 결론</p>
          <p className="mt-2 leading-relaxed text-emerald-900">
            아킬레스건이 아픈 건 <strong>종아리와 아킬레스건이 갑자기 더 많은 일을
            하게 됐기 때문</strong>입니다. 주법을 바꿔서일 수도 있고, 거리를 늘렸거나
            신발 드롭이 낮아져서일 수도 있습니다.
          </p>
          <p className="mt-2 leading-relaxed text-emerald-900">
            <strong>아래 스트레칭 3가지는 원인과 상관없이 같습니다.</strong> 주법을
            바꾼 적이 없어도 그대로 하시면 됩니다 — 벽 카프 · 솔리어스 · 편심성 힐 드롭.
          </p>
        </div>

        {/* 2026-09-21: 도입부가 「유튜브 보고 미드풋으로 바꾼 사람」으로 시작했다.
            제목과 같은 병이다 — 들어온 사람 대부분이 자기 얘기가 아니라고 느끼고 되돌아간다.
            시작을 증상으로 바꾸고, 미드풋은 원인 목록의 하나로 내린다. */}
        <p className="text-lg leading-relaxed mb-8 text-gray-700">
          달리고 나면 뒤꿈치 위쪽이나 종아리가 당기고 뻐근한 경우가 있습니다.
          아킬레스건과 종아리가 <strong>갑자기 더 많은 일을 하게 됐을 때</strong> 나타나는 모습입니다.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">왜 아킬레스건이 아픈가요?</h2>
          <p className="leading-relaxed text-gray-700 mb-4">
            종아리 근육과 아킬레스건이 <strong>새 자극에 적응하기 전에 너무 많이 쓰이면</strong>{" "}
            건증(Tendinopathy)이 생깁니다. 부하가 갑자기 늘어나는 상황은 여러 가지입니다.
          </p>
          <ul className="mb-4 space-y-1.5 text-gray-700">
            <li className="leading-relaxed">
              · <strong>주법을 바꿨을 때</strong> — 힐스트라이크로 달리던 사람이 미드풋으로 바꾸면
              종아리와 아킬레스건이 기존보다 훨씬 더 많은 일을 하게 됩니다
            </li>
            <li className="leading-relaxed">
              · <strong>거리나 속도를 갑자기 늘렸을 때</strong>
            </li>
            <li className="leading-relaxed">
              · <strong>언덕·계단 훈련을 새로 넣었을 때</strong>
            </li>
          </ul>
          {/**
           * ⚠️ 2026-09-21 — 이 목록에 「드롭이 낮은 신발로 바꿨을 때 — 드롭이 낮을수록
           * 아킬레스건이 받는 몫이 커집니다」를 썼다가 **지웠다.**
           *
           * 이 페이지 인용 2번(선상규 정형외과 전문의, 하이닥 2026-04-17)이 정확히 반대를 말한다 —
           * *"아킬레스건 장력은 신발 드롭이 아니라 케이던스로 줄인다."*
           * 그 인용은 2026-09-15 에 **드롭 주장을 뺀 자리를 대체하려고** 넣은 것이다(아래 주석).
           * 뺀 주장을 내가 4일 뒤에 도로 넣을 뻔했다.
           *
           * 이 페이지의 확정된 입장은 아래 FAQ 3번에 이미 적혀 있다 —
           * *"드롭이 낮으면 아킬레스건이 더 많은 일을 한다고 흔히 이야기되지만,
           * 이 글이 인용한 자료는 재활 운동 연구이고 드롭에 관한 것이 아닙니다."*
           * 즉 **들은 얘기로 다루되 사실로 적지 않는다.** 위 「먼저 결론」 상자의
           * *"신발 드롭이 낮아져서일 수도 있습니다"* 는 가능성 서술이라 이 입장과 어긋나지 않는다.
           * 내가 쓸 뻔한 문장은 그걸 **단정**으로 바꾸는 것이었다. 그래서 지웠다.
           */}
          <p className="leading-relaxed text-gray-700 mb-4">
            어느 쪽이든 <strong>대처는 같습니다.</strong> 부하를 줄이고, 아래 세 가지를 합니다.
          </p>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm text-orange-900">
            {/* 2026-09-14: "최소 6~8주", "처음 2주는 20~30%" 에 출처가 없다.
                이 페이지 인용 2건에 전환 기간 프로토콜이 없다. 숫자를 경험칙으로 표시한다. */}
            <strong>적응 기간 가이드:</strong> 힐스트라이크 → 미드풋 전환은 <strong>몇 주에 걸쳐 천천히</strong> 하고,
            처음에는 전체 달리기의 일부만 새 주법으로 달리는 것이 흔한 권고입니다.
            <br />
            <span className="text-xs">※ 구체적인 주차·비율을 정한 연구는 저희가 확인하지 못했습니다. 아프면 그게 기준입니다.</span>
          </div>
        </section>

        {/* 2026-09-14: headline 이 "드롭 8~12mm를 유지하세요" 였다 — 근거 없는 mm 처방이라 뺐다. */}
        <FinderCta from="achilles" variant="inline" headline="아킬레스건 통증 이력을 넣으면 드롭이 급격히 낮은 신발을 걸러서 보여드립니다." />

        <section className="mb-8">
          {/* 2026-09-21: 「전환 중 꼭 해야 할 스트레칭 루틴」이었다. 「전환」이 또 주법 전제다 */}
          <h2 className="text-xl font-bold text-gray-900 mb-6">아킬레스건 통증에 하는 스트레칭 3가지</h2>

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
          {/**
           * ⚠️ 2026-09-14 — **드롭 주장에 인용이 없다.**
           *
           * 이 페이지의 인용 2건(Prudêncio 2023 / Kim 2023)은 둘 다
           * **편심성·점진적 부하 재활 연구**다. 초록 어디에도 힐-투-토 드롭이 없다.
           * 그런데 본문은 "4mm 이하는 부하를 늘린다 / 8~12mm를 유지하라"고 mm 단위로 단정했다.
           * `/injury/flat-feet:221` 에도 같은 주장이 인용 없이 반복돼 있다.
           *
           * 기전 자체(드롭이 낮으면 발목 배측굴곡이 커진다)는 널리 이야기되지만,
           * **이 사이트가 근거를 대지 못하는 상태에서 mm 숫자를 처방으로 쓰면 안 된다.**
           * 방향만 남기고 처방을 뺐다.
           */}
          <h2 className="text-xl font-bold text-gray-900 mb-3">신발 드롭은 어떤가요</h2>
          <p className="leading-relaxed text-gray-700">
            드롭(뒤꿈치와 앞발의 높이 차)이 낮은 신발은 아킬레스건이 더 많은 일을 하게 만든다고
            흔히 이야기됩니다. 다만 <strong>저희가 이 글에서 인용한 자료는 재활 운동 연구이고,
            드롭에 관한 것이 아닙니다.</strong> 그래서 &ldquo;몇 mm를 신으세요&rdquo;라고는 말하지 않겠습니다.
          </p>
          <p className="mt-3 leading-relaxed text-gray-700">
            실용적인 선은 이렇습니다 — <strong>지금 신던 신발보다 드롭이 낮은 것으로 갑자기
            바꾸지 마세요.</strong> 바뀐 뒤 아프기 시작했다면 되돌려 보는 것도 방법입니다.
          </p>

          {/**
           * 2026-09-15 — 드롭 자리를 비워 둔 채로 끝내지 않기 위해 찾은 자료.
           *
           * 하이닥(2026-04-17) 선상규 — 코끼리정형외과의원 **정형외과 전문의**.
           * 요지: 아킬레스건 장력은 **드롭이 아니라 케이던스**로 줄인다.
           * 보폭을 줄이고 분당 걸음 수를 5~10% 올리면 최대 장력이 감소
           * (예: 160보 → 168~175보).
           *
           * 이게 중요한 이유 — 우리가 뺀 것("드롭 8~12mm를 유지하라")을 대체할 뿐 아니라
           * **`/injury/midfoot` 이 이미 말하는 것과 같다.** 착지법을 직접 건드리지 말고
           * 케이던스를 올리라는 것. 두 페이지가 처음으로 같은 처방으로 이어진다.
           */}
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900">
            <strong>드롭 대신 만질 게 있습니다 — 케이던스입니다.</strong>
            <br />
            정형외과 전문의(선상규, 아래 인용)는 아킬레스건 장력을 줄이는 방법으로 신발 드롭이
            아니라 <strong>보폭을 줄이고 분당 걸음 수를 5~10% 올리는 것</strong>을 듭니다.
            분당 160보로 뛰고 있다면 168~175보 정도입니다.
            <br />
            <br />
            드롭은 신발을 사야 바뀌지만 케이던스는 오늘 바로 바꿀 수 있습니다.{" "}
            <Link href="/injury/cadence" className="font-medium text-emerald-700 underline">
              케이던스 올리는 법
            </Link>
          </div>
          {/* 브랜드에 따라 드롭 범위가 갈린다. 이 글의 결론과 직접 이어지는 자료라 여기서 보낸다. */}
          <p className="mt-3 text-sm text-gray-600">
            브랜드마다 드롭 범위가 다릅니다 —{" "}
            <Link href="/compare/hoka-vs-brooks" className="font-medium text-emerald-600 hover:underline">
              호카 vs 브룩스 스펙 집계
            </Link>
            에서 실제 수치를 비교해 보세요.
          </p>
        </section>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8 text-sm text-amber-900">
          <strong>병원에 가야 할 신호:</strong> 아침에 첫 발걸음을 뗄 때 아킬레스건이 극심하게 아프거나,
          아킬레스건 자체가 붓고 열감이 있다면 아킬레스건염이나 파열 가능성이 있습니다. 즉시 달리기를 멈추고 진료를 받으세요.
        </div>


        <YoutubeSection links={[
          { label: "아킬레스건이 아픈 원인과 치료, 스트레칭 방법까지! (골통 의사 윤재웅)", url: "https://www.youtube.com/watch?v=aKWMUcOL4bE" },
          { label: "아킬레스건 통증! 순식간에 사라지는 운동 루틴", channel: "몸수리 (구 운동한입)", url: "https://www.youtube.com/watch?v=gj8XiInamMw" },
          { label: "아킬레스건 통증 해결을 위한 5분 운동", channel: "피지오스튜디오 PHYSIOSTUDIO", url: "https://www.youtube.com/watch?v=SJ_DtvsdNlo" },
          { label: "달리기 후 아킬레스건 통증 해결하는 3분 운동", channel: "피지오스튜디오 PHYSIOSTUDIO", url: "https://www.youtube.com/shorts/2BsTWOvhmPg" },
        ]} />

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">과학적 근거 및 참고 논문</h2>
          <ul className="flex flex-col gap-2">
            <li className="text-sm text-gray-700">
              {/* ⚠️ 2026-09-14 정정 — 이 설명문이 논문 초록과 어긋났다.
                  ① 저널명: J Hum Kinet 이 아니라 **BMC Sports Sci Med Rehabil**
                  ② "효과적임을 확인" → 초록은 정반대로 근거 공백을 명시한다:
                     "there is still a gap in the evidence for the efficacy of any modality"
                     (편향 위험도 62.5% some concerns / 37.5% high)
                  ③ "Alfredson 프로토콜(주 7일, 3세트 15회 × 12주) 권고" — 초록에 없다 */}
              <strong>Prudêncio et al. (2023, BMC Sports Sci Med Rehabil)</strong> — 아킬레스건병 운동치료 체계적 고찰 및 메타분석. <strong>어떤 방식이 더 낫다고 결론 내리기에는 근거가 부족하다</strong>고 보고했습니다(포함된 연구의 편향 위험이 높음). 즉 아래 운동은 &ldquo;검증된 최선&rdquo;이 아니라 널리 쓰이는 방법입니다.{" "}
              <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9878810/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PMC 원문 →</a>
            </li>
            {/* 2026-09-15 추가 — 드롭 주장을 뺀 자리를 대체한다. 한국어 · 정형외과 전문의. */}
            <li className="text-sm text-gray-700">
              <strong>선상규 (코끼리정형외과의원 정형외과 전문의)</strong> — 아킬레스건 장력은 신발 드롭이 아니라 케이던스로 줄인다. 보폭을 줄이고 분당 걸음 수를 5~10% 올리면 최대 장력 감소(160보 → 168~175보).{" "}
              <a href="https://news.hidoc.co.kr/news/articleView.html?idxno=61267" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">하이닥 (2026-04-17) →</a>
            </li>
            <li className="text-sm text-gray-700">
              {/* 2026-08-28 정정: 이 링크의 제1저자는 Beyer가 아니라 Kim이다.
                  링크와 내용은 맞았고 저자명만 틀렸다 — Beyer는 아킬레스 건병증
                  분야의 다른 유명 논문(2015 AJSM) 저자라 섞인 것으로 보인다. */}
              <strong>Kim et al. (2023, Front Sports Act Living)</strong> — 아킬레스건 중부 건병증 재활 운동 효과에 대한 체계적 고찰. 점진적 부하 운동이 통증 및 기능 회복에 유의미한 개선 효과.{" "}
              <a href="https://www.frontiersin.org/articles/10.3389/fspor.2023.1144484/full" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">Frontiers 원문 →</a>
            </li>
          </ul>
          <p className="text-xs text-gray-400 mt-2">※ 이 콘텐츠는 의학적 진단이나 치료를 대체하지 않습니다. 지속적 통증은 전문의 상담을 권장합니다.</p>
        </section>

        <FaqSection items={[
          {
            q: "미드풋으로 바꾼 뒤 아킬레스건이 당기는 게 정상인가요?",
            // 2026-09-21: 「최소 6~8주」를 뺐다. 2026-09-14 에 본문 상자에서 같은 숫자를
            // 출처 없음으로 판정해 지웠는데 **FAQ 는 안 고쳤다.** 한 군데만 고치고 끝낸
            // rest-day 와 같은 실수다(AGENTS.md — "한 곳이 아니라 전부 고친다").
            a: "미드풋 착지는 아킬레스건과 종아리에 가는 부하를 늘리기 때문에 전환 초기의 가벼운 당김은 흔합니다. 전환은 몇 주에 걸쳐 천천히 하는 것이 흔한 권고입니다 — 다만 구체적인 주차를 정한 연구는 저희가 확인하지 못했습니다. 날카로운 통증이 오거나 아침 첫 발걸음에 극심한 통증이 있다면 중단하고 진료를 받아야 합니다.",
          },
          {
            q: "아킬레스건·종아리 통증에 어떤 스트레칭이 효과적인가요?",
            a: "세 가지를 권장합니다. ① 벽 카프 스트레칭 30초 ② 솔리어스(종아리 깊은 근육) 스트레칭 30초 ③ 편심성 카프 레이즈 — 양발로 올라가 한 발로 3~5초에 걸쳐 천천히 내려오기, 한쪽 15회×3세트 하루 1~2회. 다만 어떤 운동이 더 낫다고 말하기에는 근거가 부족합니다 — 메타분석(Prudêncio 2023)은 포함된 연구의 편향 위험이 높아 효과를 단정할 수 없다고 보고했습니다.",
          },
          {
            q: "아킬레스건이 약하면 신발 드롭은 몇 mm가 좋나요?",
            a: "몇 mm라고 말하지 않겠습니다. 드롭이 낮으면 아킬레스건이 더 많은 일을 한다고 흔히 이야기되지만, 이 글이 인용한 자료는 재활 운동 연구이고 드롭에 관한 것이 아닙니다. 실용적인 선은 '지금 신던 것보다 드롭이 낮은 신발로 갑자기 바꾸지 않는다'입니다. 바꾼 뒤 아프기 시작했다면 되돌려 보세요.",
          },
        ]} />

        {/* 2026-09-06: 글 안에서 바로 묻게 한다.
            /community 로 보내면 클릭 한 번이 필요하고, 그 한 번에서 대부분을 잃는다 —
            두 달간 질문 0건이 그 증거다. */}
        <InlineAsk from="achilles" tag="아킬레스" placeholder="예) 아킬레스가 아침에만 뻣뻣한데 뛰어도 되나요?" />

        <FinderCta from="achilles" headline="아킬레스에 부담이 덜한 신발 찾기" sub="부상 이력에 '아킬레스·종아리'를 선택하면 드롭이 낮은 신발을 걸러냅니다." />
        <ShareButtons from="achilles" title="아킬레스건염 대처법" description="아킬레스가 아플 때 뭘 해야 하고 뭘 하면 안 되는지." />

      </article>
    </>
  );
}
