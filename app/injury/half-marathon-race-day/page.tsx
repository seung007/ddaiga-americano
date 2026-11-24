import type { Metadata } from "next";
import Link from "next/link";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, Warn, Num, KeyPoints, Steps, OneLine, Caveat, Sources, Src, Ref } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

/**
 * 하프 대회 당일 체크리스트
 *
 * 2026-10-08 PubMed 초록 재검증 · 2026-10-13 가독성 재설계(체크리스트 카드 · 필수/추천/취향 × 근거 배지) — 경위는 git 기록.
 *
 * 2026-11-23 확정 틀로 바꿈 (docs/운영/가이드_틀.md, 견본 app/injury/start-running/page.tsx)
 *   판정 전부: docs/판정/half-marathon-race-day.jsonl. 초록 12편은 2026-11-23 크롬으로 PubMed 를 직접 열어 읽었다(요약만).
 *   de Oliveira 2014 전문(PMC4008808)은 크롬에서 글자가 나오지 않아 열지 못했다.
 *
 *   틀 — 카드 25장(필수/추천/취향 · 연구/관행/경험 배지 26개, paper 7)과 카드 읽는 법 상자를 걷어냈다.
 *     근거의 무게는 배지 대신 말의 세기로: 리뷰 두 편이 같은 방향(목마를 때 마시기) → 단정 / 연구 한두 편 → 「~편이에요」「한 시험에서」 /
 *     관행·경험(바세린 자리 · 첫 5km · 도착 · 옷) → 「권해요·해 보세요」. 큰 절 9개 → 큰 질문 6개.
 *     작은 질문 둘(더운 날 · 누가 위험한가)은 물 절 안 문장과 할 일로 합쳤다. 날씨별 복장 절은 옷 절 할 일 하나 + FAQ(비 오는 날)로,
 *     대회장 도착 절은 페이스 절 할 일로, 페이스메이커·카페인은 FAQ 로 내렸다. 옛 FAQ 넷은 본문과 같은 질문이라 지우고 새로 썼다.
 *     id 는 water·carb·during·gear·pace·after 를 그대로 뒀다(이 글의 #id 를 거는 곳은 없었다 — grep 2026-11-23). food·arrival·weather 는 없어졌다.
 *   덜어낸 것 — RaceGraphics 그림 셋(코스 · 쓸리는 자리 · 페이스 곡선): 그림 캡션이 근거 딱지(통용 관행 · 직접 경험)와 「~니다」를 달고 있고
 *     코스 그림은 경험 숫자(15~18km 고비)를 그린다. 부품은 고치지 않고(작업 범위 밖) 이 글에서 뺐다 — 이제 쓰는 곳이 없다.
 *     영상 검색 링크 둘(임시 검색 주소, 확인한 영상 없음) · 공유 버튼 · 글 끝 신발 찾기 띠(옷 절의 상황 문장 링크로)도 다른 확정 틀 글처럼 뺐다.
 *
 *   고친 것 — 무엇이 틀렸고 왜
 *   · **Hew-Butler 2017 에 붙어 있던 「갈증대로 마시기는 안전하고 효과적 · 코스 급수를 줄인 대회에서 발생 감소」 ✗(초록에 없음)** —
 *     초록은 「목마른 것보다 더 마시기와 항이뇨호르몬이 가장 흔한 원인」까지다. 「목마를 때 마시기」 권고는 Altieri 2026 초록 문장으로 받친다.
 *   · **de Oliveira 2014 에 붙어 있던 「섬유질·지방·단백질이 증상과 연관 · 전날 고섬유 음식 피하기는 일화적 지침」 — 초록에 없음(확인 못 함)** —
 *     연구로 쓰지 않고 음식 목록은 「권해요」 + 「특정 음식을 시험한 연구는 확인하지 못했어요」로.
 *   · **「에너지젤 하나가 보통 20~30g 이니 시간당 1~2개」를 뺐다** — 출처 없는 숫자. 「포장에 적힌 탄수화물 양으로 계산」으로.
 *   · **경험 숫자를 뺐다** — 15~18km 고비 · 첫 대회 1km당 20초 → 후반 3분 · 종이컵 2~3모금 · 1시간~1시간 30분 전 도착 ·
 *     기온보다 5~10도 따뜻한 날 옷 · 아침은 3시간 전 · 롱런 두세 번. 정밀해 보이는 숫자라 할 일만 「권해요」로 남겼다. 「첫 5km」는 권고로 남김.
 *   · **손발 부기를 저나트륨혈증 신호로 단정하지 않는다** — Gauckler 2021 은 초장거리 사이클 설문에서 「많이 마시기」와 부기의 관련을 본 연구다.
 *     경고 상자에는 「물을 더 마시지 말 신호」로만 둔다(판정: 주의).
 *   · Burke 2019 의 경기 전 냉각 문장은 달리는 중 물 끼얹기의 근거가 아니라서 그 할 일은 「해 보세요」로만.
 *   · Almond 2005 13% · 0.6% · OR 4.2 · 7.4, Hawley 20%, de Oliveira 30~50% 는 본문에서 내려 접힌 출처로(풀코스·초장거리 연구가 섞여 있다).
 *   · 말투 「~니다」 → 「~요」, 따옴표·※·문장 속 화살표를 풀었다. 「저나트륨혈증」「카보로딩」「페이스메이커」를 처음 나올 때 풀이(TERMS 에 더함).
 *   · 출처 목록에서 내림: Hew-Butler 2015 합의문(초록 없음, 본문 대조 못 함) · Thomas 2016(본문에 쓰인 곳 없음).
 *
 *   확인 못 한 것
 *   · 12편 모두 본문은 열지 않았다(요약만). de Oliveira 2014 의 음식별 연관은 전문을 열면 다시 판정한다
 *   · 「테이퍼」는 이 글에 나오지 않는다 — 풀이할 자리가 없다(지시서에는 처리 항목으로 있었다)
 */

const PAGE_URL = pageUrl("/injury/half-marathon-race-day");
const TITLE = "하프마라톤 당일, 페이스와 젤은 어떻게 하나요?";
// 원장 lib/guide/articles.ts 의 desc 와 같은 문장이어야 한다(허브 카드·검색 결과가 어긋나지 않게)
const DESC =
  "하프 대회 날 물은 목마를 때 마시고, 음식과 젤은 연습 때 먹어 본 것만 씁니다. 처음 5km 페이스, 쓸리는 자리, 결승선을 지난 뒤 할 일까지 담았습니다.";

export const metadata: Metadata = {
  title: `${TITLE} | 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/half-marathon-race-day" },
};

// 2026-11-23: FAQ 는 본문 큰 질문과 겹치지 않는 것만 둔다. 카페인·비 오는 날·페이스메이커는 본문에서 내려온 곁가지다
const FAQ: FaqItem[] = [
  {
    q: "물 대신 스포츠음료를 마시면 괜찮나요?",
    a: "**목마를 때 마신다는 기준은 같아요.** 한 마라톤 연구에서 마신 음료의 종류는 저나트륨혈증(피 속 나트륨이 묽어진 상태)과 관련이 없었어요. 음료는 **연습 때 마셔 본 것**으로 골라요.",
  },
  {
    q: "대회 날 카페인을 먹으면 도움이 되나요?",
    a: "쓴다면 **체중 1kg당 3~6mg**을 출발 약 60분 전에 먹는 방식이 흔해요. 60kg이면 180~360mg이에요. 더 많이 먹는다고 낫지 않고 부작용이 잦았어요. 평소 커피를 안 마신다면 **대회 날 처음 시도하지 마세요.**",
  },
  {
    q: "비 오는 날엔 뭘 입고 뛰나요?",
    a: "**면 옷을 피하고**, 마찰 방지제를 평소보다 넓게 발라 보세요. 젖은 옷은 무거워지고 봉제선이 닿는 곳이 새로 쓸릴 수 있어요. 비닐 우의는 **출발 직전에 벗기를** 권해요.",
  },
  {
    q: "페이스메이커를 따라가도 되나요?",
    a: "페이스메이커는 목표 기록 풍선을 달고 그 속도로 뛰는 사람이에요. 따라가면 시계를 덜 봐도 돼요. 급수대에서는 사람이 몰리니 **가장자리로 빠졌다가 다시 붙기를** 권해요.",
  },
];

const pill = "rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400";

export default function HalfMarathonRaceDayPage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["하프 대회 당일", "/injury/half-marathon-race-day"],
        ]}
      />
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">대회 실전</span>
          {/* 규약은 app/injury/page.tsx 상단 주석. 허브 카드(lib/guide/articles.ts)도 같이 고친다 */}
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/half-marathon-race-day" compact checked={12} />

        <KeyPoints
          items={[
            <>물은 <strong>목마를 때</strong> 마셔요. 급수대마다 억지로 채워 마시지 않아도 돼요.</>,
            <>음식과 젤은 <strong>연습 때 먹어 본 것만</strong> 가져가고, 대회 날 새로 시도하지 않아요.</>,
            <>처음 5km는 <strong>조금 느리다 싶게</strong> 출발하길 권해요.</>,
          ]}
        />

        <Lead>
          하프 대회 날엔 페이스와 젤에 신경이 쏠리기 쉬워요. 그런데 몸에 탈이 나는 건 물을 너무 많이 마셔서일 때도 있어요.
          무엇을 먹고 마시고 입을지는 <strong>연습 때 해 본 대로</strong> 가는 게 기본이에요.
        </Lead>

        <TableOfContents
          items={[
            { id: "pace", label: "페이스는 어떻게 잡나요?" },
            { id: "water", label: "물은 얼마나 마시나요?" },
            { id: "during", label: "젤은 언제, 몇 개 먹나요?" },
            { id: "carb", label: "전날과 아침엔 뭘 먹나요?" },
            { id: "gear", label: "옷과 양말, 바세린은요?" },
            { id: "after", label: "결승선을 지나면요?" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="pace" className={H2}>
          <Num n={1} />하프 페이스는 어떻게 잡나요?
        </h2>
        <P>
          <strong>처음 5km는 조금 느리다 싶게</strong> 출발하길 권해요. 출발 신호가 울리면 주변 분위기에 끌려 빨라지기 쉬워서,
          시계를 보며 일부러 눌러야 해요.
        </P>
        <Steps
          items={[
            { t: "목표 시간이 대회 제한시간 안에 드는지 접수 전에 확인해요.", d: "제한시간과 중간 통제 지점은 대회마다 달라서 참가 안내문을 봐요." },
            { t: "대회장엔 넉넉히 일찍 가서 화장실과 물품보관소부터 들러요.", d: "출발이 가까울수록 화장실 줄이 길어지기 쉬워요." },
            { t: "출발 구역은 자기 기록대로 서요.", d: "앞쪽에 서면 빠른 사람들에게 밀려 처음부터 빨라지기 쉬워요." },
            { t: "후반에 힘들면 남은 거리를 몇 km씩 끊어서 넘겨 보세요.", d: "하프는 21.0975km라 20km 표지를 지나도 1km 남짓 더 남아요." },
          ]}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/tools/pace" className={pill}>목표 시간으로 5km마다 지날 시간을 뽑아 보려면 →</Link>
        </div>

        <OneLine>처음엔 조금 느리다 싶게 나가고, 시계를 보며 일부러 눌러요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        {/* 안전 정보(신호·의료진·신장 질환과 이뇨제)는 접지 않는다 — 2026-10-13 원칙 그대로 */}
        <h2 id="water" className={H2}>
          <Num n={2} />대회 중 물은 얼마나 마셔야 하나요?
        </h2>
        <P>
          <strong>목마를 때 마시면 돼요.</strong> 목이 마르지 않은데 급수대마다 채워 마실 필요는 없어요.
        </P>
        <P>
          필요 이상으로 마시면 저나트륨혈증(물을 너무 많이 마셔 피 속 나트륨이 묽어진 상태)이 올 수 있어요. 한 마라톤
          연구에서는 달리는 동안 체중이 늘 만큼 마신 사람과 오래 걸려 들어온 사람에게 더 많았어요.
        </P>
        <Steps
          items={[
            { t: "목이 마를 때 마셔요.", d: "급수대 개수를 채우려고 마시지 않아요." },
            { t: "더운 날 목이 마르면 참지 말고 마셔요.", d: "목마를 때 마시라는 건 참으라는 뜻이 아니에요." },
            { t: "종이컵은 한 번에 들이키지 말고 몇 모금씩 나눠 마셔 보세요." },
            { t: "출발 전에 코스의 의료진 위치를 안내문에서 확인해 둬요." },
          ]}
        />
        <Warn title="이런 신호가 있으면 물을 더 마시지 말고 의료진에게">
          <ul className="list-disc space-y-1 pl-5">
            <li>메스껍거나 토한다</li>
            <li>머리가 심하게 아프다</li>
            <li>머리가 멍하고 헷갈린다</li>
            <li>손발이 부어 반지나 시계가 꽉 낀다</li>
            <li>완주 뒤 체중이 오히려 늘었다</li>
          </ul>
          <p className="mt-2">
            열사병이나 저혈당과 증상이 겹쳐서 스스로 가리기 어려워요. 탈수인 줄 알고 물을 더 마시면 반대로 갈 수 있으니
            <strong> 의료진에게 가세요.</strong>
          </p>
        </Warn>
        <Caveat>신장 질환이 있거나 이뇨제를 먹고 있다면 대회 전에 의사와 상의하세요.</Caveat>

        <OneLine>목마를 때 마시고, 더운 날엔 참지 않아요. 메스껍고 머리가 아프면 물 대신 의료진을 찾아요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="during" className={H2}>
          <Num n={3} />젤은 언제, 몇 개 먹나요?
        </h2>
        <P>
          <strong>90분 안팎에 들어온다면 젤이 꼭 필요하지는 않아요.</strong> 그만큼 달린 뒤에도 근육에 저장된 탄수화물이 꽤
          남아 있었어요. 그래도 1시간 남짓 운동에서 조금 먹으면 기록에 도움이 되는 편이었어요.
        </P>
        <P>
          <strong>2시간 넘게 걸린다면 시간당 약 60g까지</strong>가 권하는 탄수화물 양이에요. 시간당 약 90g은 훨씬 긴 경기
          기준이라 하프에 그대로 가져오지 않아요.
        </P>
        <Steps
          items={[
            { t: "젤 포장에 적힌 탄수화물 양으로 몇 개가 필요한지 계산해 봐요.", d: "제품마다 양이 달라요." },
            { t: "대회 때 먹을 젤을 길게 뛰는 연습 날 같은 방식으로 먹어 봐요.", d: "연습에서 해 보지 않은 양으로 늘리지 않아요." },
            { t: "급수대 바로 앞에서 젤을 까 두고, 물과 함께 넘겨 보세요." },
            { t: "젤은 손이 바로 가는 자리에 넣고 개수를 미리 세어 둬요." },
          ]}
        />

        <OneLine>90분 안팎이면 젤이 꼭 필요하지는 않아요. 더 걸린다면 연습 때 먹어 본 젤을 포장의 탄수화물 양으로 나눠 챙겨요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="carb" className={H2}>
          <Num n={4} />대회 전날과 당일 아침엔 뭘 먹나요?
        </h2>
        <P>
          <strong>대회 주에 처음 먹는 음식과 젤, 보충제는 쓰지 않아요.</strong> 대회 날 배탈은 흔하고, 연습해 둔 대로 먹는 게
          탈을 줄이는 길이에요.
        </P>
        <P>
          90분 안팎에 들어온다면 탄수화물 채우기(카보로딩)는 <strong>꼭 하지 않아도 되는 편</strong>이에요. 더 오래 걸린다면
          대회 전날까지 끼니를 탄수화물 위주로 먹어 보세요.
        </P>
        <Steps
          items={[
            { t: "전날 저녁과 아침은 흰쌀밥, 흰빵, 바나나처럼 소화가 편한 것을 권해요.", d: "현미, 잡곡, 튀김, 삼겹살이나 아침 우유, 요거트는 줄여 보세요." },
            { t: "아침을 먹는 시간은 길게 뛰는 연습 날에 미리 맞춰 봐요.", d: "속이 편한 간격은 사람마다 달라요." },
            { t: "배번표는 전날 밤 상의에 달고, 기록칩은 신발에 미리 달아 둬요.", d: "안전핀은 여분을 챙겨요." },
          ]}
        />
        <Caveat>음식 목록은 저희가 한국 식단에 맞춰 정한 거예요. 특정 음식을 시험한 연구는 확인하지 못했어요.</Caveat>

        <OneLine>대회 주엔 새로 먹는 게 없게 해요. 90분 안팎이면 평소대로 먹어도 돼요.</OneLine>

        {/* ── 5 ─────────────────────────────────────────── */}
        <h2 id="gear" className={H2}>
          <Num n={5} />옷과 양말은 뭘 입고, 어디에 바세린을 바르나요?
        </h2>
        <P>
          <strong>길게 뛰는 연습 날 입어 본 옷과 신발, 양말로 나가요.</strong> 대회 기념 티셔츠나 새 신발에 쓸리거나 물집이 생겨도
          대회 중엔 바꿀 수 없어요.
        </P>
        <Steps
          items={[
            { t: "겨드랑이, 유두, 사타구니, 발가락 사이에 출발 직전 마찰 방지제를 발라요.", d: "바르기 전에 그 자리의 물기를 닦고 말려요." },
            { t: "양말은 면보다 합성섬유로 골라 보세요.", d: "한 시험에서 아크릴 양말이 면 양말보다 물집이 덜, 작게 생겼어요." },
            { t: "옷은 출발선에서 살짝 서늘한 정도로 입기를 권해요.", d: "추운 날엔 버릴 헌 옷 한 겹을 걸쳤다가 출발 직전 수거함에 넣어요." },
            { t: "더운 날 물을 끼얹는다면 머리 뒤쪽으로 부어, 양말과 신발이 젖지 않게 해 보세요." },
          ]}
        />
        <Caveat>바르는 자리와 옷 고르는 법은 러너들이 흔히 쓰는 방법이에요. 효과를 시험한 연구는 확인하지 못했어요.</Caveat>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/shoe-finder" className={pill}>대회용 신발을 아직 못 정했다면 →</Link>
        </div>

        <OneLine>연습 때 입어 본 그대로 나가고, 쓸리는 자리엔 출발 직전에 발라요.</OneLine>

        {/* ── 6 ─────────────────────────────────────────── */}
        <h2 id="after" className={H2}>
          <Num n={6} />결승선을 지나면 뭘 해야 하나요?
        </h2>
        <P>
          <strong>바로 멈춰 서지 말고 몇 분 천천히 걷기를 권해요.</strong> 달리기를 멈춘 순간 다리에 피가 고여 혈압이 잠깐
          떨어지면서 쓰러지는 일이 결승선에서 흔해요.
        </P>
        <P>
          어지러워 서 있기 힘들면 <strong>억지로 걷지 말고 누워서 다리를 올려요.</strong>
        </P>
        <Warn title="이럴 땐 바로 의료진을 불러요">
          <ul className="list-disc space-y-1 pl-5">
            <li>의식이 흐리거나 말이 어눌하다</li>
            <li>메스꺼움, 두통, 헷갈림이 함께 있다</li>
          </ul>
          <p className="mt-2">단순 어지럼처럼 보여도 심장 문제나 열사병, 저나트륨혈증일 수 있어요.</p>
        </Warn>
        <Steps
          items={[
            { t: "물품보관소에서 마른 옷부터 꺼내 갈아입어요.", d: "멈추면 젖은 옷이 금방 차가워져요." },
            { t: "양말을 벗고 발가락 사이까지 물집과 발톱을 봐요.", d: "발톱 밑에 피가 고여 부풀었다면 직접 뚫지 말고 진료를 받아 보세요." },
            { t: "쉬어도 나아지는 느낌이 없으면 진료를 받아 보세요.", d: "다시 뛰기 시작한 다음 날 아침에 더 아프면 거리를 줄여요." },
          ]}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/cooldown" className={pill}>완주 뒤 정리 운동이 궁금하다면 →</Link>
        </div>

        <OneLine>결승선에선 걷거나 눕고, 의식이 흐리면 바로 의료진을 불러요.</OneLine>

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Altieri et al. (2026)</strong> 운동 중 저나트륨혈증의 원인은 과하게 마신 물과 운동 중 항이뇨호르몬 분비이고, 땀으로 잃는 나트륨은 작은 요인으로 봤어요. 증상은 메스꺼움·구토·두통·혼란에서 혼수까지이고, 저혈당·기립성 저혈압·열사병과 가려야 해요. 가벼우면 처치는 물 제한이고, 목마르기 전에 마시라는 권고는 목마를 때 마시기로 바꿔야 한다고 적었어요.
            <Ref>J Endocrinol Invest 49(1):1-10 · <a href="https://pubmed.ncbi.nlm.nih.gov/40913680/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Hew-Butler et al. (2017)</strong> 운동 중 저나트륨혈증의 가장 흔한 원인은 목마른 것보다 더 마시는 것과 항이뇨호르몬 분비라고 정리한 리뷰예요.
            <Ref>Front Med (Lausanne) 4:21 · <a href="https://pubmed.ncbi.nlm.nih.gov/28316971/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Almond et al. (2005)</strong> 2002년 보스턴 마라톤 완주 직후 피를 뽑은 488명 중 13%가 저나트륨혈증, 0.6%가 위험 수준이었어요. 여러 요인을 함께 따지니 달리는 중 체중 증가(OR 4.2), 4시간 넘는 완주(3시간 30분 미만 대비 OR 7.4), 체질량지수가 아주 낮거나 높은 것과 관련 있었고, 성별·마신 음료 종류·소염진통제는 관련이 없었어요.
            <Ref>N Engl J Med 352(15):1550-6 · <a href="https://pubmed.ncbi.nlm.nih.gov/15829535/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Martinez-Cano et al. (2018)</strong> 덥고 습한 날 열린 콜롬비아 칼리 하프에서 81명을 분석하니 저나트륨혈증은 없었고, 증상 없는 고나트륨혈증이 6명(7.4%)이었어요. 덜 자주, 적게 마신 것과 관련 있었어요.
            <Ref>BMJ Open Sport Exerc Med 4(1):e000351 · <a href="https://pubmed.ncbi.nlm.nih.gov/29955376/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Gauckler et al. (2021)</strong> 초장거리 사이클 선수 919명 설문에서 최대한 많이 마시는 전략은 부기 증상과 함께 늘었고, 목마를 때 마시는 전략은 반대였어요. 저나트륨혈증을 잰 연구는 아니에요.
            <Ref>J Int Soc Sports Nutr 18(1):73 · <a href="https://pubmed.ncbi.nlm.nih.gov/34863204/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={6}>
            <strong>Hawley et al. (1997)</strong> 60~90분 중강도 달리기·사이클에서는 시작 전 근육 글리코겐을 평소 이상 채워도 이득이 없었고, 끝날 때도 상당량이 남아 있었어요. 90분을 넘는 종목에서는 피로가 약 20% 늦게 왔어요.
            <Ref>Sports Med 24(2):73-81 · <a href="https://pubmed.ncbi.nlm.nih.gov/9291549/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={7}>
            <strong>Jeukendrup (2014)</strong> 1시간 안팎 운동에서도 입 헹굼이나 소량 섭취가 기록에 도움이 됐다는 연구들이 있고, 2~3시간 운동은 시간당 약 60g, 초장거리는 약 90g을 권했어요.
            <Ref>Sports Med 44 Suppl 1:S25-33 · <a href="https://pubmed.ncbi.nlm.nih.gov/24791914/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={8}>
            <strong>Burke et al. (2019)</strong> 장거리 육상 선수 영양 리뷰예요. 대회 전 몇 시간에서 며칠은 탄수화물 위주로 먹어 글리코겐을 채우고, 대회 영양 계획은 개인에 맞춰 미리 연습해 둔 것으로 하라고 적었어요. 시간당 75~90g은 가장 긴 경기에 해당해요.
            <Ref>Int J Sport Nutr Exerc Metab 29(2):117-129 · <a href="https://pubmed.ncbi.nlm.nih.gov/30747558/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={9}>
            <strong>de Oliveira et al. (2014)</strong> 지구성 선수의 30~50%가 운동 중 위장 증상을 겪고, 영양 연습과 알맞은 음식 선택이 위험을 줄일 수 있다고 정리한 리뷰예요.
            <Ref>Sports Med 44 Suppl 1:S79-85 · <a href="https://pubmed.ncbi.nlm.nih.gov/24791919/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={10}>
            <strong>Guest et al. (2021)</strong> 국제스포츠영양학회 입장문이에요. 체중 1kg당 3~6mg에서 기록이 꾸준히 좋아졌고, 운동 60분 전이 가장 흔한 시점이에요. 9mg/kg 같은 고용량은 부작용이 잦고 효과에 필요하지 않아 보였어요. 평소 섭취량도 반응 차이에 영향을 줄 수 있어요.
            <Ref>J Int Soc Sports Nutr 18(1):1 · <a href="https://pubmed.ncbi.nlm.nih.gov/33388079/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={11}>
            <strong>Herring &amp; Richie (1990)</strong> 장거리 러너 35명 이중맹검 시험에서 아크릴 100% 양말이 면 100% 양말보다 물집이 덜 생기고 작았어요.
            <Ref>J Am Podiatr Med Assoc 80(2):63-71 · <a href="https://pubmed.ncbi.nlm.nih.gov/2304016/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={12}>
            <strong>Asplund et al. (2011)</strong> 완주 뒤 쓰러짐은 장거리 대회 뒤 흔하고, 달리기를 멈출 때 다리에 피가 고여 생기는 일시적 저혈압으로 봐요. 심정지·열사병·저나트륨혈증을 먼저 가린 뒤, 입으로 마시는 수분과 누워서 다리를 올린 자세로 처치해요.
            <Ref>Br J Sports Med 45(14):1157-62 · <a href="https://pubmed.ncbi.nlm.nih.gov/21948122/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 지병이 있거나 약을 먹고 있다면 대회 전에 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
