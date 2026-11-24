import type { Metadata } from "next";
import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, H3, Num, KeyPoints, Steps, OneLine, Sources, Src, Ref } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

/**
 * 2026-10-08 재검증 — PubMed 초록과 대조
 *   · 「자신감이 부상의 씨앗」 → 근거 없음. 경력자는 시간당 부상이 오히려 적다(Kemler 2018)로 교체
 *   · 「가장 흔한 원인은 훈련 오류」 → 체계적 고찰이 특정하지 못함(Nielsen 2012), 일관된 위험 요인은 부상 이력(Saragiotto 2014)
 *   · 「중급자에게 흔한 Top 3」 → 수준별 순위 자료 없음. 제목을 낮추고 클리닉 자료(Taunton 2002) 순서만 적음
 *   · 장경인대 원인(외전근 약화·거리 급증·내리막) → 근거 못 찾음. Aderem & Louw 2015 의 운동학 소견으로 교체. 폼롤러 삭제
 *   · 족저근막 원인 「아침 통증·편평족·높은 아치」 → 반대(van Leeuwen 2016: BMI 만 일관). 아침 통증은 증상
 *   · Meeusen 「순으로 진행」 → 합의문 초록대로 「구분이 매우 어렵다」. 「48시간」 삭제
 *   · 「장거리 30%」 → Frandsen 2025 110% 로 교체
 *   (2026-09-14: 장경인대 「22%·1위」 → 인용 초록의 약 10% 로, 아킬레스 「11%」·족저근막 「8~10%」 → 역학 논문 값으로,
 *    「Alfredson 프로토콜 수치」 「드롭 높은 신발·쿠션 인솔」 삭제 — 이 기록은 그대로 남긴다)
 *
 * 2026-11-23 확정 틀로 바꿈 (docs/운영/가이드_틀.md, 견본 app/injury/start-running/page.tsx)
 *   판정 전부: docs/판정/intermediate-guide.jsonl (22줄). 초록은 2026-11-23 직접 열어 읽었다 —
 *   PubMed 를 크롬으로 연 것(Nielsen 2012 · Clement 1981 · Honert 2020 · Sanchez-Alvarado 2024 · Lagas 2020 · Toresdahl 2020 · Aderem 2015)과
 *   PubMed 가 이 환경 WebFetch 에서 빈 페이지라 출판사·대학 저장소의 초록 페이지에서 읽은 것(Saragiotto · Kemler · Taunton · Lauersen ·
 *   van Leeuwen · Frandsen)이 있다. 어디서 읽었는지는 판정 파일 note 칸에.
 *
 *   고친 것 — 무엇이 틀렸고 왜
 *   · **「평발이나 높은 아치 같은 발 구조와의 관련은 근거가 없습니다」 ✗** — van Leeuwen 2016 초록은 「발과 발목 기능 측정치가 원인이라는
 *     통념에 근거가 부족하다」까지만 말하고 아치 높이·평발을 따로 보고하지 않는다. 초록보다 넓게 썼었다.
 *     「발과 발목의 모양·기능」까지만 쓰고 평발 판정은 /injury/flat-feet 로 넘겼다(flat-feet·plantar-fasciitis 와 같은 판정).
 *   · **족저근막 「신발 교체는 근거가 약합니다」의 출처** — 옛 주석의 근거(Koc 2023 진료지침)는 plantar-fasciitis 가 초록 확인 실패로 내린 자료다.
 *     van Leeuwen 초록에도 신발 이야기는 없다. 그래서 plantar-fasciitis 와 같은 문장 「신발을 바꿔서 낫는다는 연구는 찾지 못했어요」로 쓰고,
 *     van Leeuwen 은 발 모양 통념 부분의 출처로만 달았다. 신발이 효과 없다고 단정하지 않는다.
 *   · **Frandsen 2025 「1.52~2.28배」를 뺐다** — 늘린 정도별 값이 1.64 → 1.52 → 2.28 로 차례로 커지지 않아 범위로 쓰면 비례 위험으로 읽힌다.
 *     「한 대형 연구에서 그보다 10% 넘게 길게 뛴 날에 부상이 늘었어요」(training-types·half-marathon-training 과 같은 말)로,
 *     평균 45.8세 단서는 접힌 출처에만.
 *   · **Lauersen 2014 의 세기를 낮췄다** — 「근력 훈련은 부상 위험을 줄였습니다」라는 단정이 러너 글에 붙어 있었다. 여러 종목을 모은 분석이다.
 *     training-types 와 같은 말 「달리기에서는 뚜렷하지 않아요 … 여러 종목을 모은 한 분석에서는 3분의 1 수준」으로.
 *   · **「언제 쉬어야 하나」 절을 rest-day 글 링크로 바꿨다** — 같은 합의문(Meeusen 2013)과 같은 신호 목록이 /injury/rest-day#full-rest 에 있다
 *     (본문·다른 글 중복 금지). 「흔히 함께 말하는 신호」 셋(초록에 없음)도 이 글에서 사라졌다. 이번에 Meeusen 초록은 열지 않았다.
 *   · **Honert 2020 숫자(1년 초과·주 1~5회·주 15~50km)를 뺐다** — 초록에 숫자가 없다(세 수준을 합의했다는 말만). 옛 주석은 본문 Table 3 이라고 적었지만
 *     이번에 본문은 열지 않았다. 대체 숫자를 만들지 않고 「10km 는 뛰어 봤고 하프를 준비하며 거리를 늘리는 분」이라는 말로 바꿨다. 출처 목록에서도 내렸다.
 *   · **「4주차는 이전 주보다 20~30% 줄이는 방식」의 「20~30%」를 뺐다** — 출처가 없던 정밀 숫자다. 3주 늘리고 1주 줄이기는 「권해요」로.
 *   · **Lagas 2020 「훈련 계획표 사용(오즈비 1.8)」을 뺐다** — 같은 초록이 「훈련 관련 요인은 관련 없음」이라고도 적어 해석이 갈린다.
 *   · **Sanchez-Alvarado 2024 「약 10%」는 출처에만** — 이 고찰의 서론이 인용한 값이지 고찰이 센 숫자가 아니다.
 *     장경인대 대처 「긴 달리기를 한꺼번에 늘리지 않기」는 이 초록에 없어 그 항목에서 뺐다(2절 110% 기준이 대신한다).
 *   · 본문에서 연구 인원·나라·대상을 내렸다(접힌 출처로). 초보 기준 숫자(Nielsen 2014 의 7%·5%)와 아킬레스 대처 시험(Silbernagel 2007·Prudêncio 2023)은
 *     이 글의 질문(거리를 늘릴 때)과 멀어 내리고 아킬레스·족저근막 글 링크로 넘겼다 — 틀려서 뺀 것이 아니다.
 *   · 말투 「~니다」 → 「~요」, 옛 부품(근거 딱지·접힘·문헌 목록·한눈에 상자) 걷어냄, ※ 문구를 견본 문구로.
 *
 *   확인 못 한 것
 *   · Honert 2020 본문 Table 3(위 숫자의 원래 자리) — 이번에 열지 않았다. lib/guide/stages.ts·첫 화면 수준 비교 표에 같은 숫자가 남아 있다(보고에 적음)
 *   · Clement 1981 본문 — 초록만 열었다. 그래서 「초록에서 확인하지 못했어요」로 범위를 한정했다
 */
const PAGE_URL = pageUrl("/injury/intermediate-guide");
// 2026-11-10: 채팅에서 「중급자」는 0명, 「오버트레이닝·과훈련」 0명. 「부상」 27명, 「쉬어야·휴식」 18명, 「마일리지」 16명.
const TITLE = "러닝 거리를 늘릴 때, 부상은 어떻게 피하나요?";
// 원장 lib/guide/articles.ts 의 desc 와 같은 문장이어야 한다(허브 카드·검색 결과가 어긋나지 않게)
const DESC =
  "거리를 늘리는 중이라면 다쳤던 곳과 가장 길게 뛰는 날부터 봐야 합니다. 경력이 쌓이면 자주 다치는 곳, 근력운동이 부상을 줄이는지까지 논문으로 확인해 정리했습니다.";

export const metadata: Metadata = {
  title: `${TITLE} | 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/intermediate-guide" },
};

// 2026-11-18: FAQ 는 본문 큰 질문과 겹치지 않는 것만 둔다.
const FAQ: FaqItem[] = [
  {
    q: "중급자는 어느 정도 달린 러너를 말하나요?",
    a: "공인된 기준은 없어요. 이 글은 **10km는 뛰어 봤고, 하프를 준비하며 거리를 늘리는 분**께 맞춰 썼어요. 달린 기간보다 지금 넘으려는 거리로 보는 편이 맞아요.",
  },
  {
    q: "부상의 60~70%가 훈련 실수 때문이라는 말은 맞나요?",
    a: "확인하지 못했어요. 흔히 원출처로 꼽히는 1981년 조사의 초록에 그 숫자가 없었어요. 어떤 훈련 실수가 부상을 부르는지도 아직 가려지지 않았어요. 그보다 **다쳤던 곳부터** 챙겨 보세요.",
  },
  {
    q: "스트레칭을 하면 덜 다치나요?",
    a: "스트레칭으로 부상이 줄지는 않았어요. 여러 종목의 연구를 모아 보니 **스트레칭을 한 사람과 안 한 사람의 부상이 비슷했어요.** 몸이 편해지면 해도 되지만, 부상을 막으려면 **거리를 천천히 늘리는 게** 먼저예요.",
  },
];

const pill = "rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400";
const linkCls = "font-medium text-emerald-700 underline";

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
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        {/* 2026-11-23: 「꾸준히 1년+ · 주 1~5회 · 주 15~50km」를 뺐다 — Honert 2020 초록에 없는 숫자(머리 주석). 단계 이름으로 */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Link
            href="/injury#stage-to-half"
            className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800"
          >
            3단계 · 10km → 하프
          </Link>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/intermediate-guide" compact checked={12} />

        <KeyPoints
          items={[
            <>최근 1년 안에 다친 적이 있으면 <strong>또 다치기 쉬워요.</strong> 다쳤던 곳부터 챙겨요.</>,
            <>가장 길게 뛰는 날은 <strong>지난 한 달 가장 길게 뛴 거리보다 10% 넘게 늘리지 않기를</strong> 권해요.</>,
            <>근력운동을 했다고 <strong>거리를 더 빨리 늘리지는 마세요.</strong> 달리기에서는 부상을 줄인다는 결과가 뚜렷하지 않았어요.</>,
          ]}
        />

        <Lead>
          거리를 늘려 가는데 한 번씩 다친다면, 무엇을 잘못했는지부터 찾게 돼요. 그런데 다치는 이유보다 먼저 볼 것은{" "}
          <strong>예전에 다쳤던 곳</strong>과 <strong>가장 길게 뛰는 날</strong>이에요.
        </Lead>

        <TableOfContents
          items={[
            { id: "why", label: "훈련을 잘못해서 다치나요?" },
            { id: "load", label: "거리는 얼마나 늘려도 되나요?" },
            { id: "common", label: "어디를 자주 다치나요?" },
            { id: "strength", label: "근력운동을 하면 덜 다치나요?" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="why" className={H2}>
          <Num n={1} />거리를 늘리다 다치는 건 훈련을 잘못해서인가요?
        </h2>
        <P>
          어떤 훈련 실수가 부상을 부르는지는 <strong>아직 가려지지 않았어요.</strong> 연구마다 거리·횟수·강도와 부상의 관계가
          서로 다르게 나왔어요.
        </P>
        <P>
          확실한 건 하나예요. <strong>최근 1년 안에 다친 적이 있으면 또 다치기 쉬워요.</strong> 그래서 거리를 늘릴 때는 예전에
          아팠던 곳부터 살펴보세요.
        </P>
        <Steps
          items={[
            { t: "지난 1년 안에 아팠던 곳을 적어 둬요.", d: "무릎 바깥, 발뒤꿈치 위, 발바닥처럼 자리로 적으면 돼요." },
            { t: "거리를 늘린 주에는 그곳이 어떤지 먼저 봐요.", d: "달리는 중에 아픔이 커지거나 다음 날 아침에 더 아프면 거리를 줄여요." },
            { t: "쉬어도 나아지는 느낌이 없으면 진료를 받아 보세요." },
          ]}
        />

        <OneLine>무엇을 잘못했는지보다, 예전에 다친 곳이 다시 아픈지를 먼저 봐요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="load" className={H2}>
          <Num n={2} />거리는 얼마나 늘려도 되나요?
        </h2>
        <P>
          가장 길게 뛰는 날을 <strong>지난 30일 중 가장 길게 뛴 거리의 110% 안에서</strong> 늘리기를 권해요. 한 대형 연구에서
          그보다 10% 넘게 길게 뛴 날에 부상이 늘었어요.
        </P>
        <P>
          같은 연구에서 일주일 거리를 전주보다 얼마나 늘렸는지는 부상과 관계가 없었어요. 그래서 일주일 합계보다{" "}
          <strong>가장 긴 하루</strong>를 보세요.
        </P>
        <Steps
          items={[
            { t: "지난 30일 중 가장 길게 뛴 거리를 확인해요.", d: "10km였다면 다음 긴 날은 11km까지예요." },
            { t: "3주 늘렸으면 1주는 거리를 줄여요.", d: "이 주기가 부상을 줄인다고 확인한 연구는 찾지 못했어요. 몸을 돌아볼 틈을 두는 저희 기준이에요." },
            { t: "다음 날 아침 다리가 무거우면 쉬는 날을 하루 더 넣어요." },
          ]}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/rest-day#full-rest" className={pill}>쉬어도 피로가 안 풀린다면 →</Link>
          <Link href="/injury/half-marathon-training" className={pill}>하프를 준비한다면 →</Link>
        </div>

        <OneLine>일주일 합계보다, 가장 길게 뛰는 하루를 한 달 기록의 110% 안에 둬요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="common" className={H2}>
          <Num n={3} />경력이 쌓이면 어디를 자주 다치나요?
        </h2>
        <P>
          한 연구에서는 <strong>무릎 앞, 무릎 바깥, 발바닥</strong> 순으로 부상이 많았어요. 달린 지 1년이 넘으면 달린 시간에 비해 덜 다치는
          편이었지만, 다친 곳 가운데 <strong>아킬레스건</strong> 비중은 더 높았어요.
        </P>
        <P>아래 세 곳은 거리를 늘리는 시기에 특히 챙겨 보세요. 자리마다 할 일이 달라요.</P>

        <h3 className={H3}>무릎 바깥이 아프면 엉덩이 옆 근육부터</h3>
        <P>
          장경인대는 허벅지 바깥쪽을 지나 무릎까지 이어지는 질긴 띠예요. 여기가 아픈 장경인대 증후군에는{" "}
          <strong>엉덩이 옆 근육을 키우는 운동</strong>을 해 보세요. 치료 연구에서 가장 흔히 쓰였고 통증이 줄었어요. 원인으로 꼽힌
          자세는 연구가 적고 차이도 작아서 아직 확실하지 않아요.
        </P>

        <h3 className={H3}>발뒤꿈치 위가 아팠던 적이 있다면 그게 가장 큰 신호</h3>
        <P>
          지난 1년 안에 아킬레스건이 아팠던 사람이 <strong>다시 아플 위험이 가장 컸어요.</strong> 한 번 아팠다면 거리를 늘리는 주마다
          그 자리를 먼저 살펴보세요.
        </P>

        <h3 className={H3}>발바닥 통증은 발 모양보다 체중과 관련이 컸어요</h3>
        <P>
          족저근막은 발바닥을 받치는 단단한 막이에요. 이 통증과 꾸준히 관련이 나온 건{" "}
          <strong>체질량지수(BMI)가 높은 것</strong>이었어요. 발과 발목의 모양이나 기능이 원인이라는 통념은 근거가 부족했고,
          신발을 바꿔서 낫는다는 연구는 찾지 못했어요.
        </P>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/injury/it-band" className={pill}>무릎 바깥이 아프다면 →</Link>
          <Link href="/injury/achilles" className={pill}>발뒤꿈치 위가 아프다면 →</Link>
          <Link href="/injury/plantar-fasciitis" className={pill}>발바닥 뒤꿈치가 아프다면 →</Link>
          <Link href="/injury/knee-pain" className={pill}>무릎 앞이 아프다면 →</Link>
          <Link href="/injury/flat-feet" className={pill}>평발이 걱정된다면 →</Link>
        </div>

        <OneLine>아픈 자리마다 할 일이 달라요. 지금 아픈 곳의 글부터 보세요.</OneLine>

        <FinderCta
          from="intermediate-guide"
          variant="inline"
          headline="신발은 발볼과 사이즈가 맞는지가 먼저예요. 발볼과 용도로 좁혀 보세요."
        />

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="strength" className={H2}>
          <Num n={4} />근력운동을 하면 덜 다치나요?
        </h2>
        <P>
          부상을 줄이는지는 <strong>달리기에서 뚜렷하지 않아요.</strong> 여러 종목의 연구를 모은 한 분석에서는 근력운동을 한 사람들의
          부상이 3분의 1 수준이었지만, 첫 풀코스를 준비하는 러너에게 짧은 프로그램을 준 한 시험에서는 차이가 없었어요.
        </P>
        <Steps
          items={[
            { t: "해도 괜찮아요.", d: "다만 근력운동을 했다고 거리를 더 빨리 늘리지는 마세요." },
            { t: "무릎 바깥이 아팠던 적이 있다면 엉덩이 옆 근육 운동을 넣어 보세요." },
            { t: "기록을 위한 근력운동은 훈련 방법 글에 있어요.", d: <Link href="/injury/training-types#strength" className={linkCls}>훈련 종류 글 보기</Link> },
          ]}
        />

        <OneLine>근력운동은 해도 좋지만, 그걸 믿고 거리를 서둘러 늘리지는 않아요.</OneLine>

        {/* 2026-11-23: 「…통증질환 TOP3」 영상(화이팅!통증피디아)을 이 글에서 뺐다 — 영상 제목의 영문 약어가 풀이 검사에 걸리고,
            제목은 원문이라 고칠 수 없다. 같은 영상이 장경인대 글(it-band)에 그대로 있다. */}
        <div className="mt-14">
          <YoutubeSection links={[
            { label: "러닝할 때 무릎 바깥쪽이 아픈 이유 — 장경인대증후군이란?", channel: "닥터내비", url: "https://www.youtube.com/watch?v=vqe3vSYP3jo" },
            { label: "아킬레스건이 아픈 원인과 치료, 스트레칭 방법 (골통 의사 윤재웅)", url: "https://www.youtube.com/watch?v=aKWMUcOL4bE" },
            { label: "정형외과 의사가 생각하는 달리기 부상과 장경인대염", channel: "러너의 풍경", url: "https://www.youtube.com/watch?v=z3UUVQf57m0" },
            { label: "자전거·러닝 전 이거 안하면 무릎 나갑니다! 3분 장경인대 #Shorts", channel: "이정표의 레그웰", url: "https://www.youtube.com/shorts/uNI9DtqCy6M" },
            { label: "달리기 후 아킬레스건 통증 해결하는 3분 운동 #Shorts", channel: "피지오스튜디오 PHYSIOSTUDIO", url: "https://www.youtube.com/shorts/2BsTWOvhmPg" },
          ]} />
        </div>

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Saragiotto et al. (2014)</strong> 전향 연구 11편(4,671명)을 모아 보니 가장 일관된 위험 요인은 지난 12개월 안의 부상이었어요.
            <Ref>Sports Med 44(8):1153-63 · <a href="https://pubmed.ncbi.nlm.nih.gov/24809248/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Nielsen et al. (2012)</strong> 훈련 특성과 부상을 다룬 31편을 모았지만 어떤 훈련 실수가 부상과 이어지는지 가려내지 못했어요. 연구끼리 결과가 달랐어요.
            <Ref>Int J Sports Phys Ther 7(1):58-75 · <a href="https://pubmed.ncbi.nlm.nih.gov/22389869/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Clement et al. (1981)</strong> 환자 1,650명의 기록에서 부상 1,819건을 셌고, 가장 흔한 부상은 무릎 앞 통증이었어요. 훈련 실수 60~70%라는 숫자는 초록에 없었어요.
            <Ref>Phys Sportsmed 9(5):47-58 · <a href="https://pubmed.ncbi.nlm.nih.gov/27453020/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Frandsen et al. (2025)</strong> 한 번 달린 거리가 지난 30일 최장 거리보다 10% 넘게 길면 부상이 늘었고, 전주 대비 일주일 거리 비율은 관계가 없었어요(성인 러너 5,205명, 평균 45.8세 — 거리를 늘리는 중급 러너만 모은 연구가 아니에요).
            <Ref>Br J Sports Med 59(17):1203-1210 · <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Kemler et al. (2018)</strong> 1,000시간당 부상은 1년 넘게 달린 러너 4.24건, 초보 8.78건이었어요. 다친 곳 가운데 아킬레스건은 경력자 8.4%, 초보 2.3%였어요(네덜란드 러너 4,621명 설문).
            <Ref>Phys Sportsmed 46(4):485-491 · <a href="https://pubmed.ncbi.nlm.nih.gov/30071170/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={6}>
            <strong>Taunton et al. (2002)</strong> 한 스포츠의학 클리닉의 러닝 부상 2,002건에서 무릎 앞 통증이 가장 많았고 장경인대 증후군, 족저근막염이 뒤를 이었어요. 수준별로 나눈 순위는 아니에요.
            <Ref>Br J Sports Med 36(2):95-101 · <a href="https://pubmed.ncbi.nlm.nih.gov/11916889/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={7}>
            <strong>Sanchez-Alvarado et al. (2024)</strong> 장경인대 증후군 치료 연구 13편(201명)을 모았어요. 엉덩이 옆 근육 강화가 가장 흔히 쓰였고 통증과 기능이 나아졌어요. 연구끼리 차이가 커서 하나로 합쳐 계산하지는 못했어요. 서론에서 이 부상을 러닝 부상의 약 10%로 적었어요.
            <Ref>Front Sports Act Living 6:1386456 · <a href="https://pubmed.ncbi.nlm.nih.gov/39247485/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={8}>
            <strong>Aderem &amp; Louw (2015)</strong> 연구 13편을 모아 보니 여성 러너에게서 착지 때 고관절이 안쪽으로 모이고 무릎이 안쪽으로 도는 정도가 컸어요. 저자들은 연구 수가 적고 차이가 작다고 적었어요.
            <Ref>BMC Musculoskelet Disord 16:356 · <a href="https://pubmed.ncbi.nlm.nih.gov/26573859/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={9}>
            <strong>Lagas et al. (2020)</strong> 러너 2,378명을 따라가 보니 지난 12개월 안의 아킬레스건병증이 가장 강한 위험 요인이었어요(오즈비 6.3, 3.9~10.0).
            <Ref>J Sci Med Sport 23(5):448-452 · <a href="https://pubmed.ncbi.nlm.nih.gov/31892510/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={10}>
            <strong>van Leeuwen et al. (2016)</strong> 연구 51편을 모아 보니 꾸준히 관련이 나온 임상 요인은 높은 체질량지수뿐이었어요(27 초과에서 오즈비 3.7, 2.93~5.62). 발과 발목 기능 측정치가 원인이라는 통념은 근거가 부족했어요. 신발은 다루지 않았어요.
            <Ref>Br J Sports Med 50(16):972-81 · <a href="https://pubmed.ncbi.nlm.nih.gov/26644427/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={11}>
            <strong>Lauersen et al. (2014)</strong> 여러 종목의 무작위 시험 25편(26,610명)을 모은 메타분석이에요. 근력운동을 한 쪽의 부상이 3분의 1 수준이었어요(상대위험 0.315, 0.207~0.480). 스트레칭은 줄이지 못했어요(0.963, 0.846~1.095). 달리기만 모은 분석은 아니에요.
            <Ref>Br J Sports Med 48(11):871-7 · <a href="https://pubmed.ncbi.nlm.nih.gov/24100287/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={12}>
            <strong>Toresdahl et al. (2020)</strong> 첫 풀코스 러너 720명에게 12주 동안 주 3회 10분짜리 근력 프로그램을 준 무작위 시험이에요. 부상으로 완주하지 못한 비율이 7.1%와 7.3%였어요(상대위험 0.97, 0.57~1.63).
            <Ref>Sports Health 12(1):74-79 · <a href="https://pubmed.ncbi.nlm.nih.gov/31642726/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
