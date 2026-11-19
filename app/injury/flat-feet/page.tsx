import type { Metadata } from "next";
import { withFootTypes } from "@/lib/shoes/types";
import Link from "next/link";
import { SHOES } from "@/lib/shoes/data";
import FinderCta from "@/components/FinderCta";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import ShoeJsonLd, { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, H3, Warn, Num, KeyPoints, Steps, OneLine, Caveat, Sources, Src, Ref } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

/**
 * 평발 러닝화 — 검색 수요 2위(발 조건 + 브랜드, 33%)에 답하는 페이지.
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 이 각도인가 (2026-09-08)
 *
 * 검색하면 나오는 답은 거의 다 같다: **"평발이면 안정화를 신어라."**
 * 이 저장소는 그 관행에 근거가 없다는 논문을 이미 알고 있었다(Richards 2009).
 * 그런데 정작 평발을 검색해서 오는 사람이 읽을 페이지가 없었다 —
 * **가장 많이 묻는 질문에 이 사이트의 결론이 없었다.**
 * 그래서 각도는 "평발용 신발 추천"이 아니라 **"평발이라는 이유만으로 신발을 정할 수 없다"** 다.
 *
 * 우리 데이터도 관행을 따르고 있다는 점을 숨기지 않는다 — footTypes 에 flat 이 든 신발 대부분이
 * 안정화·모션컨트롤이고, 추천 엔진도 평발에 가점을 준다. 5절에서 점수까지 공개한다.
 *
 * ─────────────────────────────────────────────────────────────
 * 2026-11-18 확정 틀로 바꿈 (AGENTS.md 「가이드 글 틀 — 2026-11-18 확정」, 견본 app/injury/start-running/page.tsx)
 *
 * 이 글이 사이트에서 맡는 몫: **발 아치·평발 판정은 여기서 끝난다.**
 *   wide-foot · plantar-fasciitis · knee-pain · shin-splints · midfoot 는 아무 주장도 하지 않고 이 글로 링크만 건다.
 *
 * 이번에 판정하고 고친 것
 *   · 회내 제어화는 **연구가 서로 다른 답을 낸 자리**다(Project 문서 「처음 달리기 글 근거 판정」 #27). 어느 쪽으로도 단정하지 않는다.
 *     전에는 그 사실을 「흔한 말 / 확인된 것 / 반대쪽 신호 / 남는 결론」 네 줄 표와 딱지·회색 단서로 표시했는데,
 *     표는 사실을 말하는 것처럼 보이고 딱지는 문장보다 세게 읽힌다(AGENTS 신뢰 규칙 4). **문장으로 풀어 적었다.**
 *   · 코크런 고찰을 2026-11-18 초록에서 직접 열어 **두 비교가 다른 비교라는 것을 분명히 했다.**
 *     발 모양으로 처방한 신발(3편 7,203명, 비율비 1.03, 중간 확실성)과 모션컨트롤화 대 일반 신발(2편 421명, 0.92, 가장 낮은 확실성)은 다른 줄이다.
 *     판정요약의 「발 모양에 맞춘 특수 신발은 부상을 줄이지 않는다」(확실)를 쓰면서 **회내 제어화로 넓히지 않았다.**
 *   · 코크런의 발 모양 처방 3편이 **전부 군 훈련생 대상**이라는 단서를 새로 넣었다. 초록에 있는 말인데 사이트 어디에도 없었다.
 *   · Willems 2021(HR 0.41, 95% CI 0.17–0.98)은 판정요약에 「원문 열지 못함」으로 적혀 있었다. 오늘 QxMD 로 열렸다 —
 *     상한이 0.98 로 간신히 1을 안 넘으므로 본문에서는 단정하지 않고 숫자는 출처 목록에만 뒀다.
 *   · 글 중간 링크 글자 「2E·4E 와이드 규격 보기」를 상황 문장으로 바꿨다(「신발에 발볼이 눌린다면」).
 *   · 병원 신호에서 특정 힘줄 질환 이름을 뺐다 — 그 이름을 확인한 자료가 없다. 증상과 「진료를 받아 보세요」만 남겼다.
 *   · 신발 목록에서 드롭·폭 표기를 뺐다. 이 목록의 목적은 「우리 분류가 업계 분류를 따른다」를 보여 주는 것이고,
 *     그 두 값은 전문어 풀이 없이 화면에 뜨던 값이다. 폭은 발볼 글이, 드롭은 아킬레스 글이 맡는다.
 *   · 글 끝 공유 단추와 질문 상자를 뺐다(앞선 새 틀 16편과 같다).
 *   · 현대건강신문 기사(안지용 정형외과 실장)는 논문이 아니라서 출처 목록에서 내리고 본문에 링크와 누가 한 말인지만 남겼다 —
 *     날짜 줄이 「연구 N편 대조」라서 논문 아닌 자료를 섞어 세면 그 숫자가 거짓이 된다(cooldown·posture·first-10k 선례).
 *
 * 2026-11-18 읽은 초록 요약 — 다음 차례가 다시 조회하지 않게 (전부 QxMD 에서 직접 열었다)
 *   · Richards, Magin & Callister 2009, Br J Sports Med 43(3):159-162: MEDLINE(1950~2007-05)·CINAHL·EMBASE·PsychInfo·
 *     코크런 고찰 DB·코크런 등록부·SPORTSDiscus·AMED 여덟 곳, 영어 논문 한정. 뒤꿈치가 올라간 쿠션화 + 발 타입별 회내 제어를
 *     성인 러너에서 평가한 대조시험·고찰을 찾았고 **조건에 맞는 원 연구가 없었다.** 찾아낸 고찰 6편도 근거가 못 됐다.
 *     결과 항목에 부상률뿐 아니라 **기록·관절염 위험·활동량·전반적 건강**이 들어 있었다. 결론은 "not evidence-based".
 *   · Malisoux 2016, Br J Sports Med 50(8):481-487: 취미 러너 372명, 참가자·평가자 눈가림 RCT, 6개월. 같은 모델의
 *     모션컨트롤 판과 일반 판. 전체 HR 0.55(0.36–0.85). Foot Posture Index 로 가른 하위군에서 회내 94명 HR 0.34(0.13–0.84),
 *     중립 218명 0.78(0.44–1.37), 외측 60명 0.59(0.20–1.73). 일반 신발을 신은 회내 러너는 중립 발보다 HR 1.80(1.01–3.22) —
 *     **상한이 1.01 이라 이 숫자는 글에 쓰지 않았다.**
 *   · Willems 2021, J Orthop Sports Phys Ther 51(3):135-143: 같은 372명의 2차 분석(경쟁위험 분석). 과회내 관련 부상 25건,
 *     다른 부상 68건. 과회내 관련 HR 0.41(0.17–0.98), 다른 부상 0.68(0.41–1.10).
 *   · Relph 2022 코크런: 12편 11,240명, 6~26주, 북미·유럽·호주·남아프리카. 발 모양으로 처방 대 아무 신발 3편 7,203명
 *     비율비 1.03(0.94–1.13) 중간 확실성이고 **3편 모두 군 집단**. 모션컨트롤 대 중립·쿠션 2편 421명 0.92(0.30–2.81) 가장 낮은 확실성.
 *     안정화 대 중립 1편 57명 0.49(0.18–1.31), 모션컨트롤 대 안정화 1편 56명 3.47(1.43–8.40), 소프트 대 하드 2편 1,095명 0.82(0.61–1.10),
 *     중립·쿠션 대 미니멀 5편 766명 0.77(0.59–1.01). 저자들은 **신발 종류의 합의된 정의**와 RCT 추가를 요구했다.
 *   · Malisoux 2020, Am J Sports Med 48(2):473-480: 848명 RCT, 쿠션 경도만 다른 두 시제품, 6개월. 딱딱한 쪽 SHR 1.52(1.07–2.16).
 *     체중 자체는 관련 없음 1.00(0.99–1.01). 체중 중앙값(남 78.2kg·여 62.8kg) 기준 가벼운 쪽 1.80(1.09–2.98),
 *     무거운 쪽 1.23(0.75–2.03).
 *   · van Leeuwen 2016, Br J Sports Med 50(16):972-81: 51편(전향 1·환자-대조군 46·횡단면 4), 변수 104개 중 12개 통합.
 *     유의한 임상 요인은 체질량지수뿐(27 초과 오즈비 3.7, 2.93–5.62), 운동 안 하는 하위군에서 가장 강함.
 *     **발·발목의 기능 측정치가 원인이라는 통념에 근거가 없다**고 적었다. 초록은 아치 높이·평발을 따로 보고하지 않는다 —
 *     그래서 「평발은 원인이 아니다」로 좁혀 쓰지 않고 「발과 발목의 모양·기능」까지만 썼다.
 */

const PAGE_URL = pageUrl("/injury/flat-feet");
const TITLE = "평발 러닝화, 안정화를 꼭 신어야 하나요?";
// 원장 lib/guide/articles.ts 의 desc 와 같은 문장이어야 한다(허브 카드·검색 결과가 어긋나지 않게)
const DESC =
  "평발이면 안정화를 신으라는 말이 흔하지만 발 모양만으로 신발을 정할 근거는 약합니다. 연구가 서로 다른 답을 낸 지점과 먼저 볼 조건을 적었습니다.";

export const metadata: Metadata = {
  // 검색 질의는 "평발 러닝화", "평발 러닝화 추천", "평발 안정화" 형태로 온다.
  // 2026-11-10: 채팅에서 신발 종류는 「안정화」로 부른다(14명). 「평발」 9명. 제목은 1절 질문 그대로.
  title: `${TITLE} | 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/flat-feet" },
};

/** `flat` 을 지원하는 신발 — 여성 전용 라스트는 같은 신발의 변형이라 뺀다. */
const flatShoes = SHOES.map(withFootTypes).filter(
  // 2026-09-21: footTypes 가 선택 필드가 됐다. 2026-11-10: 비면 안정성 구조로 정한다(추천 엔진과 같은 규칙,
  // lib/shoes/types.ts footTypesFromStability) — 추천 결과와 이 글의 목록이 서로 다른 기준을 쓰지 않게
  (s) => s.footTypes.includes("flat") && s.gender !== "female"
);
const flatCurrent = flatShoes.filter((s) => !s.successor);
const flatStability = flatShoes.filter((s) => s.stability !== "neutral").length;

const STABILITY_KO: Record<string, string> = {
  neutral: "중립",
  stability: "안정화",
  motion_control: "모션컨트롤",
};

const FAQ: FaqItem[] = [
  {
    q: "모션컨트롤화와 안정화 러닝화는 다른 건가요?",
    a: "업계에서는 발이 안쪽으로 쏠리는 움직임을 조금 잡아 주면 안정화, 더 강하게 잡으면 모션컨트롤이라고 불러요. 다만 합의된 정의는 없어요. 같은 이름이어도 **신어 보고 느낌을 보길** 권해요.",
  },
  {
    q: "안정화 러닝화를 신으면 해로운가요?",
    a: "해롭다는 근거는 확인하지 못했어요. **지금 신어서 편하다면 계속 신어도 돼요.** 평발이라는 이유만으로 다른 신발을 빼놓을 근거가 약하다는 뜻이에요.",
  },
  {
    q: "평발이면 깔창을 써야 하나요?",
    a: "꼭 그렇지는 않아요. 평발을 깔창으로 받쳐서 부상이 줄었다는 자료는 확인하지 못했어요. 아픈 곳이 없다면 깔창보다 **신어서 편한 신발을 먼저** 찾아 보세요. 무릎 앞이 아프다면 무릎 통증 글을 보세요.",
  },
  {
    q: "평발에 맞는 신발을 신으면 기록이 좋아지나요?",
    a: "그 효과를 확인한 연구는 없었어요. 기록은 신발보다 **달린 양과 속도**의 이야기예요.",
  },
];

const pill = "rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400";
const linkCls = "font-medium text-emerald-700 underline";

export default function FlatFeetPage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} datePublished="2026-09-08" />
      {/* 이 페이지에 목록으로 보이는 신발만. 화면과 구조화 데이터가 같아야 한다. */}
      <ShoeJsonLd shoes={flatShoes} name="평발 대응으로 분류한 러닝화" url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["평발 러닝화", "/injury/flat-feet"],
        ]}
      />
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        {/* 규약은 app/injury/page.tsx 상단 주석 */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">평발</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/flat-feet" compact checked={6} />

        <KeyPoints
          items={[
            <>평발이라고 꼭 안정화를 신어야 하는 건 아니에요. <strong>지금 신발이 편하면 그대로 신어요.</strong></>,
            <>고를 때는 발 모양보다 <strong>너무 딱딱하지 않은지, 발볼이 맞는지</strong>를 먼저 봐요.</>,
            <>덜 다치려고 평발용 신발을 찾는 거라면, 그 효과는 연구에서 나타나지 않았어요.</>,
          ]}
        />

        <Lead>
          평발이라는 말에 안정화부터 권유받았다면, 그 권유의 근거를 먼저 볼 만해요. 발 모양에 맞춰 신발을 정하는 관행은
          받치는 연구가 생각보다 적어요.
        </Lead>

        <TableOfContents
          items={[
            { id: "evidence", label: "안정화를 꼭 신어야 하나요?" },
            { id: "risk", label: "더 다치기 쉬운가요?" },
            { id: "how-to-choose", label: "무엇을 보고 고르나요?" },
            { id: "prevent", label: "바꾸면 덜 다치나요?" },
            { id: "shoe-list", label: "저희가 분류한 신발" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="evidence" className={H2}>
          <Num n={1} />평발이면 안정화를 꼭 신어야 하나요?
        </h2>
        <P>
          꼭 그렇지는 않아요. <strong>지금 신는 신발이 편하다면 그대로 신어도 돼요.</strong> 평발이라는 한 가지만 보고 신발을
          정할 만큼 근거가 모이지 않았어요.
        </P>
        <P>
          이 자리는 <strong>연구가 서로 다른 답을 낸 곳</strong>이에요. 2009년에 기존 연구를 모아 검토한 논문은 발 모양에 맞춰
          회내 제어 신발을 주는 관행을 받치는 연구를 한 건도 찾지 못했어요. 회내는 디딜 때 발이 안쪽으로 쏠리는 움직임을 말해요.
        </P>
        <P>
          반대로 한 시험에서는 모션컨트롤화를 받은 쪽의 부상이 적었어요. 다만 그 차이는 <strong>발이 안쪽으로 많이
          쏠리는 사람에서만</strong> 나타났어요. 그 시험까지 모아 본 코크런 고찰은 두 신발 사이에서 차이를 찾지 못했고, 이
          비교의 근거를 가장 낮은 확실성으로 봤어요.
        </P>
        <Caveat>
          스스로 평발이라고 느끼는 것과, 그 시험이 측정 도구로 가른 발 모양이 같은지는 알 수 없어요. 도움이 됐다는 쪽은 시험
          한 편이고, 그 안에서도 하위 집단을 따로 본 결과예요.
        </Caveat>

        <OneLine>지금 신발이 편하면 그대로 신어요. 평발이라는 이유만으로 바꿀 일은 아니에요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="risk" className={H2}>
          <Num n={2} />평발이면 더 다치기 쉬운가요?
        </h2>
        <P>
          발 모양으로 부상 위험이 정해진다고 보기는 어려워요. <strong>평발인 사람만 따로 모아 부상을 센 연구</strong>는 저희가
          확인하지 못했어요.
        </P>
        <P>
          발바닥 뒤꿈치 통증은 연구 51편을 모아 본 분석이 있어요. 거기서 꾸준히 관련이 나온 건 <strong>체질량지수(BMI)가
          높은 것</strong>이고, 발과 발목의 모양이나 기능이 원인이라는 통념은 근거가 부족했어요.
        </P>
        <P>그러니 평발을 미리 걱정하기보다, 지금 아픈 곳이 있으면 그곳부터 보세요. 아픈 곳마다 할 일이 달라요.</P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/shin-splints" className={pill}>정강이가 아프다면 →</Link>
          <Link href="/injury/plantar-fasciitis" className={pill}>발바닥 뒤꿈치가 아프다면 →</Link>
          <Link href="/injury/knee-pain" className={pill}>무릎 앞이 아프다면 →</Link>
        </div>

        <OneLine>평발이라서 더 다친다고 미리 걱정하지 말고, 지금 아픈 곳을 먼저 봐요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="how-to-choose" className={H2}>
          <Num n={3} />평발이면 러닝화를 뭘 보고 고르나요?
        </h2>
        <P>발 모양보다 먼저 볼 것이 있어요. 아래 순서로 보세요.</P>
        <Steps
          title="이 순서로 보세요"
          items={[
            {
              t: "너무 딱딱하지 않은 신발을 고르세요.",
              d: "한 시험에서 딱딱한 쪽을 신은 사람의 부상이 더 많았어요. 매장에서 밑창을 손으로 눌러 보면 차이가 느껴져요.",
            },
            {
              t: "발볼과 길이가 맞는지 보세요.",
              d: (
                <>
                  폭이 안 맞는 신발은 어떤 안정화 구조로도 보정되지 않아요.{" "}
                  <Link href="/injury/wide-foot" className={linkCls}>신발에 발볼이 눌린다면 재는 법이 있어요</Link>.
                </>
              ),
            },
            {
              t: "지금 아픈 곳이 있으면 그게 먼저예요.",
              d: "통증 이력이 있으면 발 모양보다 그쪽을 먼저 봐요. 아킬레스나 종아리가 당긴 적이 있다면 신발을 갑자기 바꾸지 않는 편이 좋아요.",
            },
            {
              t: "신어 보고 편한 신발을 고르세요.",
              d: "가장 저평가된 기준이에요. 매장에서 불편한 신발이 평발용이라는 이유로 맞을 가능성은 낮아요.",
            },
          ]}
        />
        <Caveat>
          딱딱함을 본 시험에서 보호 효과는 가벼운 러너 쪽에서 뚜렷했고, 무거운 러너에서는 확인되지 않았어요. 체중이
          무거우면 쿠션을 더 두껍게라는 통념은 그 시험에서 받쳐지지 않았어요.
        </Caveat>

        <OneLine>딱딱하지 않고 발볼이 맞고 신어서 편한 신발이, 평발용이라는 표시보다 앞서요.</OneLine>

        <FinderCta
          from="flat-feet"
          variant="inline"
          headline="발볼과 부상 이력, 용도를 넣으면 평발 여부만이 아니라 여러 조건을 함께 계산해요."
        />

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="prevent" className={H2}>
          <Num n={4} />평발용 신발로 바꾸면 덜 다치나요?
        </h2>
        <P>
          그 기대는 내려놓는 편이 좋아요. <strong>발 모양을 보고 신발을 정해 준 쪽과 그러지 않은 쪽을 비교한 시험 3편에서
          부상 차이가 없었어요.</strong> 여러 연구를 빠짐없이 모아 본 코크런 고찰의 결론이에요.
        </P>
        <Caveat>
          그 3편은 모두 군 훈련생을 대상으로 한 시험이에요. 취미로 달리는 사람에게 그대로 옮기기는 어려워요. 모션컨트롤화만
          따로 비교한 쪽은 결론이 갈리고, 그건 1절에 적었어요.
        </Caveat>
        <P>
          국내에서도 같은 이야기를 해요. 서울부민병원 정형외과 안지용 실장은 발 모양에 맞춘 러닝화로 부상을 막는다는 근거가
          아직 충분하지 않다고 설명하면서, 아치 유형별로 신발을 나눠 준 군 훈련 연구에서 부상률 차이가 없었다는 점을 함께
          들어요(
          <a href="https://www.hnews.kr/news/view.php?no=68992" target="_blank" rel="noopener noreferrer" className={linkCls}>
            현대건강신문
          </a>
          ).
        </P>

        <OneLine>신발을 바꾸는 건 덜 다치려고가 아니라, 발이 편하려고 하는 일이에요.</OneLine>

        {/* ── 5 ── 우리 데이터의 상태를 그대로 공개한다 ─────── */}
        <h2 id="shoe-list" className={H2}>
          <Num n={5} />저희가 평발 대응으로 분류한 신발은 뭔가요?
        </h2>
        <P>
          아래 {flatShoes.length}개예요. 이 중 <strong>{flatStability}개가 안정화 또는 모션컨트롤</strong>이에요. 저희
          데이터도 업계 분류를 그대로 받아 적은 거예요. <strong>그 자체가 근거는 아니에요.</strong> 위를 읽고 나서 이 목록을
          보시는 게 맞아요.
        </P>

        <h3 className={H3}>저희 추천도 평발 쪽으로 기울어 있어요</h3>
        <P>
          평발을 고르면 저희가 평발로 분류한 신발에 12점, 안정화 구조에 3점을 더하고 일반 신발에서 2점을 빼요. 근거가 약한
          만큼 <strong>추천 3개 중 1개는 늘 일반 신발로 채워요.</strong> 스스로 고른 평발과 연구의 측정 기준이 같지 않다는
          점도 추천 결과에 같이 적어요.
        </P>
        <ul className="mt-4 space-y-1.5">
          {flatCurrent.map((s) => (
            <li key={s.id} className="text-sm">
              <span className="font-medium text-gray-900">
                {s.brand} {s.model}
              </span>
              <span className="ml-1.5 text-xs text-gray-500">{STABILITY_KO[s.stability]}</span>
            </li>
          ))}
        </ul>
        {flatShoes.length > flatCurrent.length && (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-gray-500">
              후속 모델이 나온 {flatShoes.length - flatCurrent.length}개도 보기
            </summary>
            <ul className="mt-2 space-y-1.5">
              {flatShoes.filter((s) => s.successor).map((s) => (
                <li key={s.id} className="text-sm text-gray-500">
                  {s.brand} {s.model}
                  <span className="ml-1.5 text-xs">{STABILITY_KO[s.stability]}</span>
                </li>
              ))}
            </ul>
          </details>
        )}

        <OneLine>이 목록은 업계 분류를 옮긴 것이고, 그것 자체가 근거는 아니에요.</OneLine>

        <Warn title="병원에 가야 할 신호">
          발 안쪽 아치나 발바닥이 달리지 않을 때도 아프거나, 한쪽 발만 갑자기 내려앉은 느낌이 들면 진료를 받아 보세요. 이 글은
          신발을 고르는 정보이고 진단이나 치료가 아니에요.
        </Warn>

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Richards, Magin &amp; Callister (2009)</strong> 데이터베이스 여덟 곳을 뒤졌지만 조건에 맞는 연구를 한 건도
            찾지 못했어요. 부상률과 함께 기록·관절염 위험·활동량도 결과 항목이었어요.
            <Ref>Br J Sports Med 43(3):159-162 · <a href="https://pubmed.ncbi.nlm.nih.gov/18424485/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Malisoux et al. (2016)</strong> 취미 러너 372명 눈가림 무작위 시험이에요. 모션컨트롤화 쪽 부상 위험이
            HR 0.55(95% 신뢰구간 0.36–0.85)였고, 회내 발 94명에서만 HR 0.34(0.13–0.84)로 유의했어요. 중립 발과 외측 발에서는
            차이가 없었어요.
            <Ref>Br J Sports Med 50(8):481-487 · <a href="https://pubmed.ncbi.nlm.nih.gov/26746907/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Willems et al. (2021)</strong> 같은 372명을 다시 분석했어요. 과회내와 관련된 부상은 HR 0.41(0.17–0.98)로
            줄었고 다른 부상은 차이가 없었어요(0.68, 0.41–1.10). 상한이 0.98이라 단정하기는 어려워요.
            <Ref>J Orthop Sports Phys Ther 51(3):135-143 · <a href="https://pubmed.ncbi.nlm.nih.gov/33306927/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Relph et al. (2022)</strong> 시험 12편 11,240명을 모은 코크런 고찰이에요. 발 모양으로 처방한 신발은 3편
            7,203명에서 비율비 1.03(0.94–1.13)이었고 확실성은 중간, 세 시험 모두 군 집단이었어요. 모션컨트롤화 대 일반 신발은
            2편 421명에서 0.92(0.30–2.81)로 확실성이 가장 낮았어요.
            <Ref>Cochrane Database Syst Rev · <a href="https://pubmed.ncbi.nlm.nih.gov/35993829/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Malisoux et al. (2020)</strong> 848명 무작위 시험에서 딱딱한 쿠션 쪽 부상 위험이 SHR 1.52(1.07–2.16)였어요.
            가벼운 러너에서 1.80(1.09–2.98)이었고 무거운 러너에서는 차이가 없었어요(1.23, 0.75–2.03).
            <Ref>Am J Sports Med 48(2):473-480 · <a href="https://pubmed.ncbi.nlm.nih.gov/31877062/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={6}>
            <strong>van Leeuwen et al. (2016)</strong> 연구 51편을 모아 보니 꾸준히 관련이 나온 임상 요인은 높은 체질량지수뿐이었어요
            (27 초과에서 오즈비 3.7, 2.93–5.62). 발과 발목 기능 측정치가 원인이라는 통념은 근거가 부족했어요.
            <Ref>Br J Sports Med 50(16):972-81 · <a href="https://pubmed.ncbi.nlm.nih.gov/26644427/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
