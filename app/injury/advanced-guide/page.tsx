import Link from "next/link";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import { Up, S } from "@/components/guide/Up";
import { Lead, P, H2, H3, Summary, Todo, Evidence, References, Basis, Warn, Note } from "@/components/guide/Read";
import type { Metadata } from "next";

/**
 * 2026-10-08 재검증 — PubMed 초록과 대조
 *   · 「누적 부하가 한 번의 사고보다 흔한 부상 경로」 → 비율 자료 못 찾음. Francis 2019 의 「러닝은 과사용 부상 위험이 높다」로 낮춤
 *   · 「숙련자에게 특유한 Top 3」 → 근거 없음. 「주의할 세 가지」로
 *   · 피로골절 원인의 「뼈 재형성 속도 초과·비타민D·칼슘」 → 초록에 없음. Fredericson 2006 초록 문장으로 교체, 링크 추가
 *   · 비기능적 오버리칭 「원인: HRV 감소·코르티솔 상승」 → 원인이 아니라 징후이고 진단 지표로 인정된 것 없음(Meeusen 2013, Hynynen 2006).
 *     「최소 2주·수면 8시간·HRV 도입」 → 경험칙 표기
 *   · 햄스트링 건병증 「Top 3」·원인 → 근거 못 찾음. 노르딕은 건병증이 아니라 햄스트링 부상 예방 근거(van Dyk 2019) → 점진 부하(Nasser 2021)로 교체
 *   · 주기화 「부상 없이」 → 근거 못 찾음. 테이퍼 행만 Bosquet 2007(경기력 기준)로 출처 표기, 「2~3주·40%」 → 「약 2주·41~60%」
 *   · 「HRV는 수면·음주·자세로 흔들린다」 → 경험칙 표기. 주 3회 측정 근거(Plews 2014) 추가
 *   · FAQ 「근력 훈련 효과 메타분석으로 입증」 → 러너 RCT(Toresdahl 2020) 무효 병기
 *
 * 2026-10-13 가독성 재설계 — 부상 카드 3개를 섹션(h3)으로 풀고, 답 → 할 일 → 근거(접힘).
 *   피로 골절의 「러닝 중단·진단」은 <Warn> 으로 펼친 채. HRV 「2주 이상 저하 → 의사 상담」도 본문 목록에.
 *   「10명짜리 상관 연구」「철인3종 선수 연구」「경쟁 선수·기록 기준」「인터뷰에서 나온 방법」 단서는 <Note> 로 본문에.
 *   `/injury#levels` 링크는 유지(허브에 있음).
 */
const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/advanced-guide";
const TITLE = "숙련자 부상 예방 가이드 (3년+·주 50km+)";
const DESC =
  "꾸준히 3년 넘게, 주 50km 넘게 달리며 풀코스·기록을 준비하는 러너를 위한 부상 예방 가이드. 피로 골절, 건병증, 주기화 훈련.";

export const metadata: Metadata = {
  title: "숙련자 부상 예방 가이드 (3년+·주 50km+) — 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/advanced-guide" },
};

const PERIODS: [string, string, string, string][] = [
  ["기초 준비기", "8~12주", "유산소 기반, 근력 강화", "저강도 ↑ / 볼륨 ↑"],
  ["특이 준비기", "4~6주", "레이스 페이스 훈련", "중강도 / 볼륨 유지"],
  ["경쟁기 (테이퍼)", "약 2주", "피로 해소, 컨디션 정점", "강도 유지 / 볼륨 41~60%↓"],
  ["회복기 (전환기)", "2~4주", "완전 회복, 재충전", "저강도 / 볼륨 최소화"],
];

export default function AdvancedGuidePage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["숙련자 부상 예방", "/injury/advanced-guide"],
        ]}
      />
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">🔴 숙련자</span>
          <span className="text-xs text-gray-400">꾸준히 3년+ · 주 5회+ · 주 50km+</span>
          <span className="text-xs text-gray-400">· 5분 읽기</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">숙련자 부상 예방 가이드</h1>
        {/* ⚠️ 2026-09-14: "Bahr & Mæhlum (2004)에 따르면" 이었다. 확인 불가 인용의 이름을 뺐다.
            2026-10-08: 「누적 부하가 한 번의 사고보다 흔한 부상 경로」도 비율 자료를 찾지 못해 낮췄다. */}
        <Lead>
          숙련자는 고강도·고볼륨 훈련을 감당할 수 있지만, 그만큼 반복 부하도 커집니다. 훈련량이 큰 러너가 알아 둘 부상 세 가지와
          훈련 배치·HRV 보는 법을 추렸습니다.
        </Lead>

        <Summary
          items={[
            <>피로 골절은 <strong>일반 엑스레이로 놓칠 수 있습니다.</strong><Basis kind="paper" /> 의심되면 러닝을 멈추고 진단부터.<Basis kind="rule" /></>,
            <>지친 상태(오버리칭)를 확실히 가려내는 <strong>진단 지표는 아직 없습니다.</strong><Basis kind="paper" /></>,
            <>경쟁 선수 연구에서 테이퍼는 <strong>약 2주, 볼륨 41~60%↓·강도 유지</strong>가 기록에 가장 좋았습니다.<Basis kind="paper" /></>,
            <>한 소규모 연구에서 HRV는 <strong>하루 수치보다 일주일 평균</strong>이 수행 변화와 잘 맞았습니다.<Basis kind="paper" /></>,
          ]}
        />

        {/* 2026-10-06: 경력 개월·주간 km·페이스로 적던 구간은 사이트가 정한 값이었고 근거가 없었다.
            공인 분류는 여전히 없어서, 가장 가까운 정의(Honert 2020 델파이, 본문 Table 3)의 세 축으로 바꿨다.
            페이스는 뺐다 — 그 정의에서 속도 기준은 입문 수준에만 있다. 자세한 이유: lib/guide/stages.ts */}
        <section className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-5">
          <h2 id="who" className="break-keep text-base font-bold text-red-900">이 글은 누구를 위한 글인가 — 고수준(high caliber) 정의</h2>
          <ul className="mt-3 space-y-1.5 text-[15px] text-red-800">
            <li>• 주 1회 이상 꾸준히 달린 기간 <strong>3년 초과</strong></li>
            <li>• 일주일에 <strong>5회 이상</strong></li>
            <li>• 주간 거리 <strong>50km 초과</strong></li>
          </ul>
          <p className="mt-3 break-keep text-sm leading-relaxed text-red-800">
            세 축이 모두 맞아야 이 수준으로 봅니다. 지금 넘으려는 거리로 보면 이 글은 4~5단계(하프 → 풀, 기록 단축)에 맞습니다.{" · "}
            <Link href="/injury#levels" className="underline">세 수준 비교 표</Link>
          </p>
          <p className="mt-2 break-keep text-xs text-red-700">
            공인된 분류는 없습니다. 신발 연구 전문가 합의에서 쓴 정의를 옮겼고(출처: Honert et al. (2020) PLOS ONE 15(7):e0236047{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/32673375/" target="_blank" rel="noopener noreferrer" className="underline">↗</a>),
            범위가 다른 수준과 겹칩니다.
          </p>
        </section>

        {/* ── ① ─────────────────────────────────────────── */}
        <h2 id="injuries" className={H2}>
          훈련량이 큰 러너가 조심할 부상 세 가지
        </h2>
        <P>러닝은 걷기·수영·자전거 같은 다른 유산소 운동보다 <strong>과사용 부상</strong> 위험이 높은 운동으로 보고됩니다.</P>
        <Note>
          숙련자에게만 해당하는 부상 원인을 수치로 보여 준 연구, 숙련자에게만 생기거나 가장 많다는 순위 자료는 찾지 못했습니다.
          훈련량·강도가 큰 러너가 알아 둘 부상을 골랐습니다.
        </Note>
        <Evidence n={1}>
          <p>
            러닝 부상 부위·진단별 비율을 모은 체계적 고찰(36편)에서 러닝은 다른 유산소 운동보다 과사용 부상 위험이 높은 운동으로
            보고됩니다. 숙련자에게만 해당하는 부상 원인을 수치로 보여 준 연구는 확인하지 못했습니다.{" "}
            <S>(Francis et al. (2019) <Up h="https://pubmed.ncbi.nlm.nih.gov/30787648/" />)</S>
          </p>
        </Evidence>

        <h3 className={H3}>피로 골절</h3>
        <P>
          한 번에 부러질 만큼 크지 않은 힘이 <strong>반복되면서</strong> 생깁니다. 사람마다 소인이 달라 미리 가려내기 어렵습니다.
        </P>
        {/* 2026-10-06: 「쿠셔닝 극대화 신발」을 뺐다. 「연간 1~7%」는 초록 값(클리닉 부상 중 0.7~20%)으로 교체.
            2026-10-08: 「비타민D·칼슘 확인」을 뺐다 — Fredericson 초록에 없다. */}
        <Warn title="피로 골절이 의심되면">
          <ul className="list-disc space-y-1 pl-5">
            <li>진단부터 받습니다. 일반 엑스레이는 민감도가 낮아 놓칠 수 있습니다.</li>
            <li>러닝을 중단하고, 의사와 상의해 단계적으로 복귀합니다.</li>
            <li>그동안 수영·자전거로 대체훈련을 합니다(저희 제안).</li>
          </ul>
        </Warn>
        <Evidence n={1}>
          <p>
            {/* ⚠️ 2026-09-14 서지 정정: "Fredericson & Jennings (2000) Clin Sports Med" → Top Magn Reson Imaging 2006;17:309-325 */}
            운동선수 피로골절 리뷰(Top Magn Reson Imaging 17(5):309-325)에서 피로 골절은 스포츠의학 클리닉 부상 중 0.7~20%였습니다.
            생체역학적 소인·훈련 방식·식사·근력·유연성이 사람마다 달라 미리 가려내기 어렵다고 적었습니다.{" "}
            <S>(Fredericson et al. (2006) <Up h="https://pubmed.ncbi.nlm.nih.gov/17414993/" />)</S>
          </p>
        </Evidence>

        <h3 className={H3}>비기능적 오버리칭 — 회복이 훈련을 못 따라갈 때</h3>
        <P>
          훈련 부하에 비해 <strong>회복이 부족한 상태가 이어지는 것</strong>입니다. 수행 저하·심박변이도·호르몬 변화는 원인이 아니라
          징후이고, 진단 지표로 인정된 것은 아직 없습니다.
        </P>
        <P className="text-sm text-gray-500">
          훈련 목표 달성을 방해한다고 알려져 있으나 근거는 확립되지 않았습니다.
        </P>
        <Todo
          basis="rule"
          items={["부하를 크게 줄이고 수면을 확보합니다.", "회복될 때까지 강도 훈련을 쉽니다."]}
        />
        <Note>기간·수면 시간 기준은 근거로 확인된 값이 아닙니다.</Note>
        <Evidence n={2}>
          <p>
            {/* ⚠️ 2026-09-14: "연간 훈련 목표 달성 실패의 주요 원인" 이었다. Meeusen 2013 초록은 그 주장을 확인할 근거가 없다고 적는다. */}
            오버트레이닝 증후군 합의문(MSSE 45(1):186)은 비기능적 오버리칭을 훈련 부하에 비해 회복이 부족한 상태가 이어지는 것으로 보고,
            수행 저하·심박변이도·호르몬 변화는 원인이 아니라 징후이고, 진단 지표로 인정된 것은 아직 없다고 정리합니다.{" "}
            <S>(Meeusen et al. (2013) <Up h="https://pubmed.ncbi.nlm.nih.gov/23247672/" />)</S>
          </p>
          <p>
            심하게 과훈련된 선수 12명 연구에서도 수면 중 심박변이도는 대조군과 차이가 없었고 기상 직후에만 조금 낮았습니다.{" "}
            <S>(Hynynen et al. (2006) <Up h="https://pubmed.ncbi.nlm.nih.gov/16531900/" />)</S>
          </p>
        </Evidence>

        {/* 2026-10-08: 「스피드 훈련 러너의 부상 Top 3」였다. 출처를 찾지 못했다. */}
        <h3 className={H3}>근위 햄스트링 건병증</h3>
        <P>
          러너에게 보고되는 부상이지만 빈도 자료와 원인을 밝힌 연구는 확인하지 못했습니다. 재활 초기에는 앉기처럼 힘줄이 눌리는 자세를
          피하게 합니다.
        </P>
        <Todo
          items={[
            "햄스트링 점진 부하 운동 (초기에는 고관절을 깊이 굽히는 자세 피하기)",
            "단계적 복귀",
            "딱딱한 자리에 오래 앉지 않기",
          ]}
        />
        <Note>전문 물리치료사 인터뷰에서 나온 방법입니다. 단일 최선 중재를 가릴 근거는 아직 불충분합니다.</Note>
        <P>
          노르딕 햄스트링 운동은 여러 종목에서 햄스트링 <strong>부상 예방</strong> 근거가 있지만, 건병증 치료 근거는 아닙니다.
        </P>
        <Evidence n={3}>
          <p>
            원인을 밝힌 연구는 확인하지 못했습니다. 전문 물리치료사 13명 인터뷰에서는 앉기처럼 힘줄이 눌리는 자세가 통증을 키운다고 보고
            재활 초기에 피하게 합니다. <S>(Nasser et al. (2021) <Up h="https://pubmed.ncbi.nlm.nih.gov/33378733/" />)</S>
          </p>
          <p>
            {/* 2026-08-28에 "Beyer et al. (2015) AJSM"이 붙어 있던 자리다(아킬레스건 RCT라 내렸다). */}
            보존적 중재를 비교한 체계적 고찰의 결론은 &ldquo;이게 최선이다&rdquo;가 아니라 단일 최선 중재를 가릴 근거가 불충분하다는 쪽에
            가깝습니다. <S>(Dizon et al. (2023) <Up h="https://pubmed.ncbi.nlm.nih.gov/36976939/" />)</S>
          </p>
          <p>
            노르딕 햄스트링 운동은 여러 종목에서 햄스트링 부상을 절반으로 줄인 예방 근거가 있지만 건병증 치료 근거는 아닙니다.{" "}
            <S>(van Dyk et al. (2019) <Up h="https://pubmed.ncbi.nlm.nih.gov/30808663/" />)</S>
          </p>
        </Evidence>

        {/* ── ② ─────────────────────────────────────────── */}
        {/* ⚠️ 2026-09-14: "Bompa & Haff (2009)의 주기화 이론에 따르면 … 3단계로 구성해야" 였다. 확인할 수 없는 인용이었다.
            2026-10-08: 제목의 「부상 없이」를 뺐다 — 주기화가 부상을 줄인다는 연구를 찾지 못했다. */}
        <h2 id="periodization" className={H2}>
          기록을 노린다면 훈련을 어떻게 나눌까 — 주기화
        </h2>
        <P>
          주기화(periodization)는 훈련을 <strong>단계로 나눠 강도와 볼륨을 번갈아 배치</strong>하는 방식입니다. 아래는 널리 쓰이는
          4단계 구성이고, 특정 문헌의 프로토콜은 아닙니다.
        </P>
        <Note>주기화가 부상을 줄인다는 연구는 찾지 못했습니다.</Note>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-[15px]">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="whitespace-nowrap p-2.5 text-left">단계</th>
                <th className="whitespace-nowrap p-2.5 text-left">기간</th>
                <th className="p-2.5 text-left">목표</th>
                <th className="p-2.5 text-left">강도</th>
              </tr>
            </thead>
            <tbody>
              {PERIODS.map((row) => (
                <tr key={row[0]} className="border-t border-gray-100">
                  {row.map((cell, i) => (
                    <td key={i} className="break-keep p-2.5 text-gray-700">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P className="text-sm text-gray-500">
          테이퍼 행만 연구 근거가 있습니다(부상이 아니라 기록 기준, 경쟁 선수 연구). 나머지 행의 기간은 저희가 정리한 관행입니다.
          <Basis kind="rule" />
        </P>
        <Evidence n={1}>
          <p>
            경쟁 선수 연구 27편 메타분석에서 2주 동안 훈련 볼륨을 41~60% 줄이고 강도·빈도는 유지한 방식이 경기력을 가장
            높였습니다(부상이 아니라 기록 기준). <S>(Bosquet et al. (2007) <Up h="https://pubmed.ncbi.nlm.nih.gov/17762369/" />)</S>
          </p>
        </Evidence>

        {/* ── ③ ─────────────────────────────────────────── */}
        <h2 id="hrv" className={H2}>
          HRV(심박변이도), 오늘 수치를 보고 훈련을 바꿔야 할까
        </h2>
        <P>
          <strong>오늘 하루 수치에 반응하지 마세요.</strong>
          <Basis kind="rule" /> 한 연구에서 하루치보다 <strong>일주일 평균</strong>이 수행능력 변화와 더 잘 맞았습니다.
        </P>
        <Note>
          러너 10명짜리 상관 연구입니다. &ldquo;HRV를 보고 훈련을 조절하면 더 좋아진다&rdquo;는 개입 효과를 증명한 논문이 아닙니다.
        </Note>
        <P>HRV는 수면·음주·측정 자세에 따라서도 흔들릴 수 있습니다.<Basis kind="rule" /></P>
        <Todo
          title="참고용 운영 규칙 — 논문이 검증한 프로토콜이 아닙니다"
          basis="rule"
          items={[
            "매일 아침 기상 직후 1~3분 측정 (Elite HRV, HRV4Training 앱)",
            <>매일 못 재도 주 3회 이상 재면 주 평균으로 쓸 만합니다<Basis kind="paper" /></>,
            "7일 평균 대비 당일 값 비교",
            "평균 대비 5% 이상 저하 → 저강도 조깅 or 휴식",
            <><strong>2주 이상 지속 저하 → 의사 상담</strong></>,
          ]}
        />
        <Note>주 3회 근거는 훈련된 철인3종 선수 연구입니다.</Note>
        <Evidence n={2}>
          <p>
            {/* 2026-08-28 전면 수정. 이전 문장은 "5ms 이상 하락 시 … VO₂max 향상폭 2배"라고 썼는데, 인용한 Plews 2013은
                그런 실험을 한 논문이 아니다(러너 10명 상관 연구, 서지도 8(6):688-691 이 맞다). */}
            러너 10명의 9주 훈련을 추적해, HRV를 하루치로 보는 것과 일주일 평균으로 보는 것 중 어느 쪽이 수행능력 변화와 잘 맞는지
            비교했습니다. 결과는 일주일 평균 쪽이었습니다(Int J Sports Physiol Perform).{" "}
            <S>(Plews et al. (2013) <Up h="https://doi.org/10.1123/ijspp.8.6.688" />)</S>
          </p>
          <p>
            훈련된 철인3종 선수 연구에서, 매일 못 재도 주 3회 이상 재면 주 평균으로 쓸 만했습니다.{" "}
            <S>(Plews et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/24334285/" />)</S>
          </p>
        </Evidence>

        <div className="mt-10">
          <YoutubeSection links={[
            { label: "케이던스·보폭의 진실 — 내 몸에 맞는 리듬 찾기", channel: "신정식 RUN_TV", url: "https://www.youtube.com/watch?v=2RBeakkyw7c" },
            { label: "직접 180 케이던스로 뛰어보며 비교 — 러닝 트렌드", channel: "방구석 운동가 디어", url: "https://www.youtube.com/watch?v=iGeS1N1eYJQ" },
            { label: "착지법 전쟁 종결 — 미드풋 vs 리어풋 vs 힐스트라이크", channel: "러닝비하인드 RunningBehind 쟐쌤", url: "https://www.youtube.com/watch?v=FWXS4q-34w8" },
            { label: "서울대 스포츠공학 연구원이 알려주는 이상적인 러닝 케이던스 #Shorts", channel: "엔듀로레이스 ENDURORACE", url: "https://www.youtube.com/shorts/c0mtXc3Twmo" },
            { label: "케이던스 180이 정답일까요? #Shorts", channel: "엔듀로레이스 ENDURORACE", url: "https://www.youtube.com/shorts/PUBWGbEuTSg" },
          ]} />
        </div>

        <FaqSection items={[
          {
            q: "숙련 러너의 부상 주원인은 무엇인가요?",
            a: "숙련자에게만 해당하는 원인을 수치로 보여 준 연구는 확인하지 못했습니다. 러닝은 다른 유산소 운동보다 과사용 부상 위험이 높은 운동으로 보고되고(Francis 2019), 훈련량이 많을수록 반복 부하도 커집니다. 여러 연구에서 가장 일관된 위험 요인은 지난 1년 안의 부상 이력입니다(Saragiotto 2014).",
          },
          {
            q: "HRV(심박변이도)는 어떻게 활용하나요?",
            a: "매일 아침 기상 직후 1~3분 측정(Elite HRV, HRV4Training 등)해서 7일 평균 대비 뚜렷하게 떨어진 날은 저강도 조깅이나 휴식으로 강도를 낮춥니다. 다만 이건 본문에 적어 둔 대로 참고용 운영 규칙이지 논문이 검증한 프로토콜이 아닙니다 — 근거로 든 Plews 2013은 러너 10명짜리 상관 연구이고, 개입 효과를 증명한 논문이 아닙니다.",
          },
          {
            q: "기록을 높이면서 부상을 막으려면?",
            a: "주기화(periodization)로 고강도·고볼륨과 회복 구간을 번갈아 배치하는 것이 일반적이지만, 주기화가 부상을 줄인다는 연구는 찾지 못했습니다. 근력 훈련은 여러 종목을 모은 메타분석에서 부상을 줄였지만(Lauersen 2014), 첫 마라톤 러너 720명 무작위 시험에서는 12주 근력 프로그램이 과사용 부상을 줄이지 못했습니다(Toresdahl 2020).",
          },
        ]} />

        <References n={12} note="2026-10-08 PubMed 초록과 대조했습니다.">
          <ul>
            <li><strong>Meeusen et al. (2013)</strong> — 오버트레이닝 증후군 합의문. MSSE 45(1):186-205. <a href="https://pubmed.ncbi.nlm.nih.gov/23247672/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Plews et al. (2013)</strong> — 훈련 적응을 HR·HRV로 평가하는 방법 비교(러너 10명). IJSPP 8(6):688-691. <a href="https://doi.org/10.1123/ijspp.8.6.688" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">DOI →</a></li>
            <li><strong>Plews et al. (2014)</strong> — HRV 주 평균에 필요한 측정 횟수(훈련된 철인3종 선수). 무작위로 고른 유효 측정 주 3회 이상. <a href="https://pubmed.ncbi.nlm.nih.gov/24334285/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Dizon et al. (2023)</strong> — 근위 햄스트링 건병증 보존적 중재 비교 체계적 고찰. Sports (Basel) 11(3):53. <a href="https://pubmed.ncbi.nlm.nih.gov/36976939/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed →</a></li>
            <li><strong>Lauersen et al. (2014)</strong> — 근력 훈련의 스포츠 부상 예방 효과 메타분석(여러 종목). BJSM 48(11):871-877. <a href="https://pubmed.ncbi.nlm.nih.gov/24100287/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Toresdahl et al. (2020)</strong> — 첫 마라톤 러너 720명 근력 훈련 무작위 시험. 과사용 부상 7.1% 대 7.3%, 차이 없음. <a href="https://pubmed.ncbi.nlm.nih.gov/31642726/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Francis et al. (2019)</strong> — 러닝 부상 부위·진단별 비율 체계적 고찰(36편). <a href="https://pubmed.ncbi.nlm.nih.gov/30787648/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Fredericson et al. (2006)</strong> — 운동선수 피로골절 리뷰. 스포츠의학 클리닉 부상의 0.7~20%, 일반 엑스레이는 민감도 낮음. Top Magn Reson Imaging 17(5):309-325. <a href="https://pubmed.ncbi.nlm.nih.gov/17414993/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Hynynen et al. (2006)</strong> — 과훈련 선수 12명과 대조군의 수면·기상 직후 HRV. 수면 중 차이 없음, 기상 직후 약간 낮음. <a href="https://pubmed.ncbi.nlm.nih.gov/16531900/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Nasser et al. (2021)</strong> — 근위 햄스트링 건병증에 대한 전문 물리치료사 13명 인터뷰. 점진 부하, 초기 압박 자세 회피. <a href="https://pubmed.ncbi.nlm.nih.gov/33378733/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>van Dyk et al. (2019)</strong> — 노르딕 햄스트링 운동 포함 예방 프로그램 메타분석(15편, 8,459명). 햄스트링 부상 위험비 0.49. <a href="https://pubmed.ncbi.nlm.nih.gov/30808663/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Bosquet et al. (2007)</strong> — 테이퍼 메타분석(경쟁 선수 연구 27편). 2주, 볼륨 41~60% 감소, 강도·빈도 유지. <a href="https://pubmed.ncbi.nlm.nih.gov/17762369/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
          </ul>
        </References>
        <p className="mt-6 text-xs text-gray-400">※ 이 콘텐츠는 의학적 진단을 대체하지 않습니다.</p>

        <div className="mt-10 rounded-2xl bg-emerald-50 p-6 text-center">
          <p className="mb-2 break-keep font-medium text-emerald-900">신발이 부상을 막는다는 근거는 약합니다. 발볼·사이즈가 맞는지는 확인해 보세요</p>
          <Link href="/shoe-finder" className="inline-block rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
            내 발에 맞는 신발 찾기 →
          </Link>
        </div>

      </article>
    </>
  );
}
