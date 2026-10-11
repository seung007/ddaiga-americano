import Link from "next/link";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import { Up, S } from "@/components/guide/Up";
import type { Metadata } from "next";

/**
 * 2026-10-08 재검증 — PubMed 초록과 대조
 *   · 「자신감이 부상의 씨앗」 → 근거 없음. 경력자는 시간당 부상이 오히려 적다(Kemler 2018)로 교체
 *   · 「가장 흔한 원인은 훈련 오류」 → 체계적 고찰이 특정하지 못함(Nielsen 2012), 일관된 위험 요인은 부상 이력(Saragiotto 2014)
 *   · 「중급자에게 흔한 Top 3」 → 수준별 순위 자료 없음. 제목을 낮추고 클리닉 자료(Taunton 2002) 순서만 적음
 *   · 장경인대 원인(외전근 약화·거리 급증·내리막) → 근거 못 찾음. Aderem & Louw 2015 의 운동학 소견으로 교체. 폼롤러 삭제
 *   · 아킬레스·족저근막 빈도 → 출처가 「부상당한 초보 254명」이라 범위 표기. 아킬레스 원인은 Lagas 2020, 대처는 Silbernagel 2007
 *   · 족저근막 원인 「아침 통증·편평족·높은 아치」 → 반대(van Leeuwen 2016: BMI 만 일관). 아침 통증은 증상
 *   · 근거 줄의 Buchbinder 2004 → 초록이 없어 내용 확인 불가. Nielsen 2014 PLOS ONE·van Leeuwen 2016 으로 교체
 *   · Meeusen 「순으로 진행」 → 합의문 초록대로 「구분이 매우 어렵다」. 징후 중 초록에 없는 것은 경험칙 표기, 「48시간」 삭제
 *   · 3주+1주 → 경험칙 표기. 근력 → 러너 RCT(Toresdahl 2020) 무효 병기. 「장거리 30%」 → Frandsen 2025 110% 로 교체
 */
const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/intermediate-guide";
const TITLE = "중급자 부상 예방 가이드 (꾸준히 1년+)";
const DESC =
  "꾸준히 달린 지 1년이 넘었고 하프를 준비하는 러너를 위한 부상 예방 가이드. IT밴드, 아킬레스건, 오버트레이닝 징후.";

export const metadata: Metadata = {
  title: "중급자 부상 예방 가이드 (꾸준히 1년+) — 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/intermediate-guide" },
};

export default function IntermediateGuidePage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["중급자 부상 예방", "/injury/intermediate-guide"],
        ]}
      />
      <article className="max-w-3xl mx-auto px-6 py-12 text-gray-900">

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">🟡 중급자</span>
            <span className="text-xs text-gray-400">꾸준히 1년+ · 주 1~5회 · 주 15~50km</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">중급자 부상 예방 가이드</h1>
          <p className="text-gray-500 text-sm mb-4">8분 읽기</p>
          <p className="text-gray-600 leading-relaxed mb-3">
            경력이 쌓이면 달린 시간당 부상은 줄어듭니다. 네덜란드 러너 4,621명 조사에서 1,000시간당 부상은 1년 넘게 달린 러너 4.24건,
            초보 8.78건이었습니다. 다만 다치는 부위가 달라져, 부상 가운데 아킬레스건 비중이 경력자 8.4%, 초보 2.3%였습니다{" "}
            <S>(Kemler et al. (2018) <Up h="https://pubmed.ncbi.nlm.nih.gov/30071170/" />)</S>
          </p>
          <p className="text-gray-600 leading-relaxed mb-3">
            러닝 부상의 60~70%가 훈련 오류(too much, too soon)에서 온다는 수치가 널리 돌아다닙니다. 흔히 원출처로 꼽히는 Clement 외(1981) 조사의 초록에서는 그 수치를 확인하지 못했습니다.
            훈련 특성과 부상을 다룬 연구 31편을 모은 체계적 고찰도 어떤 훈련 오류가 부상과 이어지는지 가려내지 못했습니다{" "}
            <S>(Nielsen et al. (2012) <Up h="https://pubmed.ncbi.nlm.nih.gov/22389869/" />)</S>
          </p>
          <p className="text-gray-600 leading-relaxed">
            전향 연구를 모은 고찰에서 가장 일관된 위험 요인은 지난 12개월 안의 부상 이력이었습니다{" "}
            <S>(Saragiotto et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/24809248/" />)</S>.
            한 번 다쳤던 곳이 있다면 그 부위부터 신경 쓰세요.
          </p>
        </div>

        {/* 2026-10-06: 경력 개월·주간 km·페이스로 적던 구간은 사이트가 정한 값이었고 근거가 없었다.
            공인 분류는 여전히 없어서, 가장 가까운 정의(Honert 2020 델파이, 본문 Table 3)의 세 축으로 바꿨다.
            페이스는 뺐다 — 그 정의에서 속도 기준은 입문 수준에만 있다. 자세한 이유: lib/guide/stages.ts */}
        <section className="mb-8 p-5 bg-amber-50 rounded-2xl border border-amber-100">
          <h2 className="text-base font-bold text-amber-900 mb-3">중급자 기준 — 레크리에이션 정의</h2>
          <ul className="text-sm text-amber-800 space-y-1.5">
            <li>• 주 1회 이상 꾸준히 달린 기간 <strong>1년 초과</strong></li>
            <li>• 일주일에 <strong>1~5회</strong></li>
            <li>• 주간 거리 <strong>15~50km</strong></li>
          </ul>
          <p className="text-xs text-amber-700 mt-3">
            공인된 분류는 없습니다. 신발 연구 전문가 합의에서 쓴 정의를 옮겼고(출처: Honert et al. (2020) PLOS ONE 15(7):e0236047{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/32673375/" target="_blank" rel="noopener noreferrer" className="underline">↗</a>),
            범위가 다른 수준과 겹칩니다.
            지금 넘으려는 거리로 보면 이 글은 3단계(10km → 하프)에 맞습니다.{" · "}<Link href="/injury#levels" className="underline">세 수준 비교 표</Link>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">① 러너에게 흔한 부상 중 세 가지</h2>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            중급자만 따로 센 부상 순위 자료는 찾지 못했습니다. 스포츠의학 클리닉의 러닝 부상 2,002건 분석에서는 슬개대퇴 통증 다음으로
            장경인대 증후군, 족저근막염 순이었습니다{" "}
            <S>(Taunton et al. (2002) <Up h="https://pubmed.ncbi.nlm.nih.gov/11916889/" />)</S>
          </p>
          <div className="flex flex-col gap-4">
            {[
              {
                name: "장경인대 증후군 (IT Band Syndrome)",
                // ⚠️ 2026-09-14: "중급자 러닝 부상 1위, 전체의 22%" 였다.
                // 바로 아래 ref 로 단 Sanchez-Alvarado 2024 초록은 **약 10%** 라고 적는다
                // ("constituting about 10% of all running-related injuries").
                // 자기 인용의 숫자를 두 배로 올리고 "1위"까지 붙인 것이다. 인용값으로 되돌린다.
                freq: "러닝 부상의 약 10%",
                cause: (
                  <>
                    확실하지 않습니다. 착지할 때 고관절이 안쪽으로 많이 모이고 무릎이 안쪽으로 많이 도는 여성 러너에게서 관련이
                    보고됐지만, 연구 수가 적고 효과 크기도 작습니다{" "}
                    <S>(Aderem &amp; Louw (2015) <Up h="https://pubmed.ncbi.nlm.nih.gov/26573859/" />)</S>
                  </>
                ),
                fix: "고관절 외전근(중둔근) 강화 운동, 긴 달리기를 한꺼번에 늘리지 않기",
                color: "border-amber-200 bg-amber-50",
                ref: "빈도·대처 Sanchez-Alvarado et al. (2024) Frontiers in Sports"
              },
              {
                name: "아킬레스건병증 (Achilles Tendinopathy)",
                // ⚠️ 2026-09-14: freq 가 "중급자 이상 부상의 11%" 였고 근거로 Prudêncio 2023 을
                // 달아 뒀다. 그 논문은 **편심성 운동 메타분석**이지 역학 조사가 아니다 —
                // 그 숫자가 초록에 없다. 저장소 자신의 shin-splints:158 은 Nielsen 2014 로
                // **7%** 를 적는다. 역학 수치는 역학 논문에서 가져온다.
                freq: "부상당한 초보 러너의 약 7% (경력자는 부상 중 비중이 더 높음)",
                cause: (
                  <>
                    러너 2,378명을 추적한 연구에서 가장 강한 위험 요인은 지난 1년 안의 아킬레스건병증 이력이었고(오즈비 6.3),
                    인구학·생활습관·훈련 관련 요인은 관계가 없었습니다{" "}
                    <S>(Lagas et al. (2020) <Up h="https://pubmed.ncbi.nlm.nih.gov/31892510/" />)</S>
                  </>
                ),
                // ⚠️ 2026-09-14: "Alfredson 프로토콜(주 7일 3×15회 12주)" 이 붙어 있었는데
                // Prudêncio 2023 초록에 그 프로토콜 수치가 없다. 수치를 빼고 방향만 남긴다.
                fix: (
                  <>
                    편심성 힐드롭 운동(자세한 방법은 전용 글 참고). 환자 38명 무작위 시험에서 통증을 지켜보며 달리기를 계속한 그룹도
                    쉰 그룹과 회복에 차이가 없었습니다{" "}
                    <S>(Silbernagel et al. (2007) <Up h="https://pubmed.ncbi.nlm.nih.gov/17307888/" />)</S>
                  </>
                ),
                color: "border-orange-200 bg-orange-50",
                // 저널명도 틀렸다 — 실제는 BMC Sports Sci Med Rehabil 이다.
                ref: "빈도 Nielsen et al. (2014) PLOS ONE · 대처 Prudêncio et al. (2023)"
              },
              {
                name: "족저근막염 (Plantar Fasciitis)",
                // ⚠️ 2026-09-14: freq 가 "8~10%" 였다. 저장소 자신의 plantar-fasciitis:34 는
                // Nielsen 2014 기반으로 **약 5%** 라고 적는다. 전용 페이지 값으로 맞춘다.
                freq: "부상당한 초보 러너의 약 5%",
                cause: (
                  <>
                    체중(BMI)이 높은 것이 일관되게 관련됩니다(BMI 27 초과 오즈비 3.7, 운동선수가 아닌 사람에게서 더 뚜렷).
                    평발·높은 아치 같은 발 구조와의 관련은 근거가 없습니다{" "}
                    <S>(van Leeuwen et al. (2016) <Up h="https://pubmed.ncbi.nlm.nih.gov/26644427/" />)</S>.
                    아침 첫 발걸음 통증은 원인이 아니라 대표 증상입니다.
                  </>
                ),
                // ⚠️ 2026-09-14: fix 에 "드롭 높은 신발로 교체, 쿠션 인솔" 이 있었다.
                // plantar-fasciitis:98 이 이미 못 박았다 — 특정 드롭이나 쿠셔닝이 족저근막
                // 통증을 낫게 한다는 좋은 근거는 없다(Koc 2023 JOSPT 임상진료지침).
                fix: "종아리·족저근막 스트레칭 (신발 교체는 근거가 약합니다 — 전용 글 참고)",
                color: "border-red-200 bg-red-50",
                // 2026-10-08: 「Buchbinder (2004) N Engl J Med」였다. 초록이 없어 내용을 확인할 수 없었고,
                // 빈도 5% 의 실제 출처(Nielsen 2014)가 빠져 있었다.
                ref: "빈도 Nielsen et al. (2014) PLOS ONE · 위험 요인 van Leeuwen et al. (2016)"
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
            Meeusen et al. (2013, MSSE)의 합의문은 과부하를 <strong>기능적 과부하(Functional Overreaching)·비기능적 과부하·오버트레이닝 증후군</strong>으로 나눕니다.
            기능적 과부하는 회복하면 오히려 기록이 좋아지는 단계입니다. 뒤의 둘은 증상이 비슷해 <strong>구분이 매우 어렵다</strong>고 적습니다.
          </p>
          <p className="text-sm font-semibold text-gray-900 mb-2">합의문 초록에 있는 징후</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              ["수행 능력 저하", "평소 페이스가 갑자기 느려짐"],
              ["지속되는 피로", "쉬어도 피곤함이 풀리지 않음"],
              ["기분 변화", "짜증·의욕 저하"],
            ].map(([title, desc]) => (
              <div key={title} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <p className="font-semibold text-sm text-gray-900 mb-1">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
          {/* 2026-10-08: 아래 셋은 Meeusen 2013 초록에서 확인하지 못했다. 「48시간 이상 지속」 같은 숫자는 뺐다.
              (2026-09-14: 안정 심박 「+5~10bpm」도 출처 없는 숫자라 이미 뺐다.) */}
          <p className="text-sm font-semibold text-gray-900 mb-2">흔히 함께 말하는 신호 (경험칙 — 초록에서 확인하지 못함)</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["수면 질 저하", "피곤한데 잠이 안 옴"],
              ["안정 심박수 상승", "평소 내 아침 맥박보다 뚜렷하게 높음"],
              ["잦은 감기", "훈련 후 자주 아픔"],
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
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="font-semibold text-gray-900 mb-1">3주 증가 + 1주 회복 주기 (경험칙)</p>
              <p className="text-sm text-gray-600">
                3주간 점진적으로 거리·강도를 높인 뒤 4주차는 이전 주 대비 20~30% 줄이는 방식이 흔히 쓰입니다.
                부상을 줄인다고 검증된 주기나 비율은 아닙니다.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="font-semibold text-gray-900 mb-1">근력 훈련 병행 — 러너에서는 효과가 갈림</p>
              <p className="text-sm text-gray-600">
                여러 종목 무작위 시험을 모은 메타분석에서 근력 훈련군의 부상 위험비는 0.32였고, 스트레칭은 효과가 확인되지 않았습니다{" "}
                <S>(Lauersen et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/24100287/" />)</S>.
                다만 첫 마라톤 러너 720명 무작위 시험에서는 12주 자가 근력 프로그램(주 3회 10분)이 과사용 부상을 줄이지 못했습니다
                (7.1% 대 7.3%){" "}
                <S>(Toresdahl et al. (2020) <Up h="https://pubmed.ncbi.nlm.nih.gov/31642726/" />)</S>
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              {/* 2026-10-08: 「장거리는 주간 거리의 30% 이내」였다. 근거를 찾지 못했다. 근거가 있는 기준으로 바꾼다. */}
              <p className="font-semibold text-gray-900 mb-1">긴 날은 지난 30일 최장 거리의 110% 안에서</p>
              <p className="text-sm text-gray-600">
                성인 러너 5,205명을 18개월 추적한 연구에서 한 번 달린 거리가 지난 30일 최장 거리보다 10% 넘게 길면 과사용 부상 비율이
                1.52~2.28배였고, 전주 대비 주간 거리 비율은 관계가 없었습니다{" "}
                <S>(Frandsen et al. (2025) <Up h="https://pubmed.ncbi.nlm.nih.gov/40623829/" />)</S>
              </p>
            </div>
          </div>
        </section>

        <YoutubeSection links={[
          { label: "러닝할 때 무릎 바깥쪽이 아픈 이유 — 장경인대증후군이란?", channel: "닥터내비", url: "https://www.youtube.com/watch?v=vqe3vSYP3jo" },
          { label: "아킬레스건이 아픈 원인과 치료, 스트레칭 방법 (골통 의사 윤재웅)", url: "https://www.youtube.com/watch?v=aKWMUcOL4bE" },
          { label: "[장경인대증후군] 러너에게 흔한 통증질환 TOP3", channel: "화이팅!통증피디아", url: "https://www.youtube.com/watch?v=4Y7xKZc6KtE" },
          { label: "정형외과 의사가 생각하는 달리기 부상과 장경인대염", channel: "러너의 풍경", url: "https://www.youtube.com/watch?v=z3UUVQf57m0" },
          { label: "자전거·러닝 전 이거 안하면 무릎 나갑니다! 3분 장경인대 #Shorts", channel: "이정표의 레그웰", url: "https://www.youtube.com/shorts/uNI9DtqCy6M" },
          { label: "달리기 후 아킬레스건 통증 해결하는 3분 운동 #Shorts", channel: "피지오스튜디오 PHYSIOSTUDIO", url: "https://www.youtube.com/shorts/2BsTWOvhmPg" },
        ]} />

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">과학적 근거 논문</h2>
          <ul className="flex flex-col gap-2 text-sm text-gray-700">
            <li><strong>Taunton et al. (2002)</strong> — 러닝 부상 2,002건 후향적 환자-대조군 분석. BJSM 36(2):95-101. <a href="https://pubmed.ncbi.nlm.nih.gov/11916889/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Sanchez-Alvarado et al. (2024)</strong> — IT밴드 증후군 보존적 치료 체계적 고찰. Front Sports Act Living 6:1386456. <a href="https://pubmed.ncbi.nlm.nih.gov/39247485/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Prudêncio et al. (2023)</strong> — 아킬레스건병증 편심성 운동 메타분석. 편심 운동이 다른 운동보다 통증 개선에 효과적이라는 결론(포함 연구의 편향 위험은 높은 편). BMC Sports Sci Med Rehabil 15(1):9. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9878810/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PMC →</a></li>
            <li><strong>Meeusen et al. (2013)</strong> — 오버트레이닝 증후군 합의문. MSSE 45(1):186-205. <a href="https://pubmed.ncbi.nlm.nih.gov/23247672/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Clement, Taunton, Smart &amp; McNicol (1981)</strong> — 과사용 러닝 부상 1,650명 기록 조사(무릎·슬개대퇴 통증이 가장 많음). Phys Sportsmed 9(5):47-58. 「훈련 오류 60~70%」는 초록에서 확인하지 못했습니다. <a href="https://pubmed.ncbi.nlm.nih.gov/27453020/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Nielsen et al. (2012)</strong> — 훈련 특성과 러닝 부상 체계적 고찰(31편). 어떤 훈련 오류가 부상과 관련되는지 특정하지 못함. <a href="https://pubmed.ncbi.nlm.nih.gov/22389869/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Saragiotto et al. (2014)</strong> — 러닝 부상 위험 요인 체계적 고찰(전향 코호트 11편, 4,671명). 주된 위험 요인은 12개월 안의 이전 부상. <a href="https://pubmed.ncbi.nlm.nih.gov/24809248/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Kemler et al. (2018)</strong> — 초보와 경력 러너 부상 비교(4,621명). 1,000시간당 8.78건 대 4.24건. <a href="https://pubmed.ncbi.nlm.nih.gov/30071170/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Nielsen et al. (2014)</strong> — 부상당한 초보 러너 254명의 진단·회복 기간. 아킬레스건병증 7%, 족저근막염 5%. <a href="https://pubmed.ncbi.nlm.nih.gov/24923269/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Aderem &amp; Louw (2015)</strong> — 장경인대 증후군 생체역학 위험 요인 체계적 고찰(13편). 여성 러너의 고관절 내전·무릎 내회전 증가. <a href="https://pubmed.ncbi.nlm.nih.gov/26573859/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Lagas et al. (2020)</strong> — 레크리에이션 러너 아킬레스건병증 코호트(2,378명). 이전 아킬레스건병증 오즈비 6.3, 훈련 관련 요인 무관. <a href="https://pubmed.ncbi.nlm.nih.gov/31892510/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Silbernagel et al. (2007)</strong> — 아킬레스건병증 환자 38명 무작위 시험. 통증을 지켜보며 달리기를 계속해도 회복에 불리하지 않음. <a href="https://pubmed.ncbi.nlm.nih.gov/17307888/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>van Leeuwen et al. (2016)</strong> — 족저근막염 위험 요인 메타분석(51편). 일관된 임상 요인은 높은 BMI뿐. <a href="https://pubmed.ncbi.nlm.nih.gov/26644427/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Lauersen et al. (2014)</strong> — 운동 중재의 스포츠 부상 예방 메타분석(무작위 시험 25편, 26,610명). 근력 훈련 위험비 0.32, 스트레칭 효과 없음. <a href="https://pubmed.ncbi.nlm.nih.gov/24100287/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Toresdahl et al. (2020)</strong> — 첫 마라톤 러너 720명 근력 훈련 무작위 시험. 과사용 부상 7.1% 대 7.3%, 차이 없음. <a href="https://pubmed.ncbi.nlm.nih.gov/31642726/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Frandsen et al. (2025)</strong> — 성인 러너 5,205명 18개월 추적. 한 번 달린 거리가 30일 최장 거리의 110%를 넘으면 과사용 부상 증가. <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
          </ul>
          <p className="text-xs text-gray-400 mt-2">※ 이 콘텐츠는 의학적 진단을 대체하지 않습니다.</p>
        </section>

        <FaqSection items={[
          {
            q: "중급자는 어느 단계의 러너를 말하나요?",
            a: "공인된 정의는 없습니다. 이 사이트는 신발 연구 전문가 합의(Honert 2020)의 레크리에이션 정의 — 꾸준히 1년 넘게, 주 1~5회, 주 15~50km — 를 따릅니다. 범위가 초심자·숙련자와 겹치므로, 지금 넘으려는 거리(10km → 하프)로 보는 편이 더 정확합니다.",
          },
          {
            q: "중급자가 부상당하는 가장 흔한 원인은?",
            a: "어떤 훈련 습관이 부상을 부르는지는 아직 가려지지 않았습니다. 훈련 특성을 다룬 연구 31편을 모은 고찰도 특정 훈련 오류를 원인으로 짚지 못했습니다(Nielsen 2012). '60~70%가 훈련 오류'라는 수치도 흔히 원출처로 꼽히는 1981년 조사(Clement et al.) 초록에서 확인하지 못했습니다. 지금까지 가장 일관된 위험 요인은 지난 1년 안의 부상 이력입니다(Saragiotto 2014).",
          },
          {
            q: "언제 쉬어야 하는지 어떻게 아나요?",
            a: "오버트레이닝 합의문(Meeusen 2013) 초록이 드는 징후는 피로, 수행력 저하, 기분 변화입니다. 수면 장애나 안정시 심박수 상승도 흔히 신호로 말하지만 그 초록에서는 확인하지 못했습니다(경험칙). 이런 신호가 이어지면 부하를 줄이고 회복일을 늘리세요.",
          },
        ]} />

        <div className="p-6 bg-emerald-50 rounded-2xl text-center">
          <p className="font-medium text-emerald-900 mb-2">신발이 부상을 막는다는 근거는 약합니다. 발볼·사이즈가 맞는지는 확인해 보세요</p>
          <Link href="/shoe-finder" className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            내 발에 맞는 신발 찾기 →
          </Link>
        </div>

      </article>
    </>
  );
}
