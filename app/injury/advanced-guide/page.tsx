import type { Metadata } from "next";
import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, Num, KeyPoints, Steps, OneLine, Caveat, Sources, Src, Ref } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

/**
 * 2026-10-08 재검증 · 2026-10-13 가독성 재설계 — 경위는 git 기록(이 아래 판정이 그 결과를 다시 확인했다).
 *   (2026-09-14: 「Bahr & Mæhlum (2004)에 따르면」 · 「Bompa & Haff (2009) 주기화 3단계」 · Fredericson 서지 · Plews 2013 「VO₂max 향상폭 2배」를
 *    확인 못 한 인용으로 내린 기록은 그대로 남긴다)
 *
 * 2026-11-23 확정 틀로 바꿈 (docs/운영/가이드_틀.md, 견본 app/injury/start-running/page.tsx)
 *   판정 전부: docs/판정/advanced-guide.jsonl (26줄). 초록 14편은 2026-11-23 크롬으로 PubMed 를 직접 열어 읽었다(요약만).
 *   틀 — 옛 부품(한눈에 상자 · 할 일 상자 · 근거 접힘 · 글 끝 문헌 목록 · 근거 수준 딱지 · 단서 상자)을 걷어냈다.
 *     (옛 부품 이름을 주석에 적으면 check:geo 가 글에 남은 것으로 세므로 풀어서 적는다.)
 *     큰 절 3개(부상 셋을 작은 제목으로 · 주기화 · 심박변이도) → 번호 붙은 큰 질문 5개. 다른 글이 이 글의 #id 로 거는 곳은 없다(grep 2026-11-23).
 *     #periodization·#hrv 는 북마크를 위해 그대로 두고, #who·#injuries 의 대상 상자는 FAQ 로 내렸다.
 *
 *   고친 것 — 무엇이 틀렸고 왜
 *   · **Honert 2020 숫자(3년 초과 · 주 5회 이상 · 주 50km 초과)를 뺐다** — 초록에 숫자가 없다(intermediate-guide 와 같은 판정).
 *     대체 숫자를 만들지 않고 단계 이름 「4~5단계 · 풀코스와 기록 단축」으로. 출처 목록에서도 내렸다.
 *     lib/guide/stages.ts 310·311행에 같은 숫자가 남아 있다(손대지 않음, 보고에 적음).
 *   · **Lauersen 2014 의 세기를 낮췄다** — FAQ 가 「근력 훈련은 … 부상을 줄였습니다」로 러너에게 단정했다. 여러 종목을 모은 분석이다.
 *     intermediate-guide·training-types 와 같은 말 「달리기에서는 뚜렷하지 않아요 … 여러 종목을 모은 분석에서는 3분의 1 수준」으로.
 *   · **Meeusen 2013 에 「심박변이도」를 붙여 적은 것을 뺐다** — 초록의 지표 목록(호르몬·수행 검사·심리·생화학·면역)에 심박변이도가 없다.
 *     「원인이 아니라 징후」라는 대비, 「훈련 목표 달성을 방해한다고 알려져」도 초록에 없어 뺐다. 「지표로 인정된 것이 아직 없다」만 남겼다.
 *   · **Dizon 2023 을 「단일 최선을 가릴 근거 불충분」으로 적은 것을 고쳤다** — 초록은 연구가 부족하다고 하면서도 힘줄에 힘을 주는 운동을
 *     중심에 둔 방식을 권한다. 「치료 효과를 따진 연구는 아직 적어요」와 운동 중심까지만 썼다.
 *   · **Nasser 2021 「딱딱한 자리에 오래 앉지 않기」를 좁혔다** — 초록은 눌리는 자세와 고관절 굽힘을 줄이라고까지만 한다. 앉기는 초록에 없다.
 *   · **사이트 숫자를 뺐다** — 주기화 표의 기간(8~12주 · 4~6주 · 2~4주), 심박변이도 규칙의 1~3분 · 평균보다 5% · 2주 이상. 출처 없는 정밀 숫자다.
 *     표째 걷어내고 「기간을 나눠 짜는 방식이 부상을 줄인다는 연구는 찾지 못했어요」만 남겼다. 앱 이름도 뺐다.
 *   · Fredericson 2006 「일반 엑스레이는 놓칠 수 있다」 → 초록 말에 가깝게 「잘 잡아내지 못하는 편」. 0.7~20% 는 할 일로 이어지지 않아 접힌 출처에만.
 *     피로골절 풀이와 「콕 집어 아프면 멈추고 진료」는 shin-splints·marathon-training 과 같은 문장. 「수영·자전거 대체훈련(저희 제안)」은 근거가 없어 뺐다.
 *   · 통증 신호를 it-band·achilles 와 같은 표준 문구(아픔이 커지면 멈춤 · 다음 날 아침 더 아프면 줄임 · 쉬어도 안 나으면 진료)로.
 *   · Plews 2013 링크를 DOI 에서 PubMed(23479420)로 — PubMed 검색으로 같은 논문임을 확인했다.
 *   · 말투 「~니다」 → 「~요」, ※ 문구를 견본 문구로. 본문에서 연구 인원·나라·대상을 내렸다(10명 · 13명 · 720명 · 철인3종 선수 · 경쟁 선수 27편).
 *
 *   덜어낸 것
 *   · 유튜브 영상 5편 — 전부 케이던스·착지 영상이라 이 글의 질문(부상 · 대회 전 줄이기 · 심박변이도)과 맞지 않았다. 같은 영상이 cadence·midfoot 글에 있다.
 *     「신정식 RUN_TV」 채널명의 영문 약어와 제목 속 케이던스·미드풋·힐스트라이크가 풀이 검사에 걸리는데, 채널명·제목은 원문이라 고칠 수 없다. 근거로 쓰인 영상은 없었다.
 *   · Francis 2019(러닝은 다른 유산소 운동보다 과사용 부상이 많다 — 초록 배경 문장이라 「주의」) · Hynynen 2006(곁가지) — 할 일로 이어지지 않아 내렸다(틀려서 뺀 것 아님).
 *   · 「비기능적 오버리칭」 용어와 설명 — 같은 합의문으로 같은 이야기를 /injury/rest-day#full-rest 가 한다. 이 글은 한 문장과 링크로.
 *
 *   확인 못 한 것
 *   · 14편 모두 본문은 열지 않았다(요약만). Honert 2020 본문 Table 3 도 열지 않았다.
 */
const PAGE_URL = pageUrl("/injury/advanced-guide");
const TITLE = "마일리지 많이 뛰는 러너, 조심할 부상은 뭔가요?";
// 원장 lib/guide/articles.ts 의 desc 와 같은 문장이어야 한다(허브 카드·검색 결과가 어긋나지 않게)
const DESC =
  "풀코스와 기록을 준비하며 많이 뛰는 러너가 조심할 피로골절과 엉덩이 아래 힘줄 통증, 대회 전 훈련 줄이기, 심박변이도를 보는 법을 논문으로 확인해 정리했습니다.";

export const metadata: Metadata = {
  title: `${TITLE} | 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/advanced-guide" },
};

// 2026-11-23: FAQ 는 본문 큰 질문과 겹치지 않는 것만 둔다.
const FAQ: FaqItem[] = [
  {
    q: "숙련자는 어느 정도 달린 러너를 말하나요?",
    a: "공인된 기준은 없어요. 이 글은 **하프를 넘어 풀코스나 기록 단축을 준비하는 분**께 맞춰 썼어요. 달린 기간보다 지금 준비하는 대회로 보는 편이 맞아요.",
  },
  {
    q: "근력운동을 하면 덜 다치나요?",
    a: "달리기에서는 **뚜렷하지 않아요.** 여러 종목을 모은 분석에서는 부상이 3분의 1 수준이었지만, 첫 풀코스 러너에게 짧은 프로그램을 준 시험에서는 차이가 없었어요. 해도 좋지만 **그걸 믿고 거리를 서둘러 늘리지는 마세요.**",
  },
  {
    q: "노르딕 햄스트링 운동이 엉덩이 아래 힘줄 통증도 낫게 하나요?",
    a: "**치료 근거는 아니에요.** 무릎을 꿇고 상체를 천천히 앞으로 내리는 이 운동은 여러 종목에서 허벅지 뒤 근육 부상을 절반쯤 줄였어요. 이미 힘줄이 아프다면 **조금씩 힘을 늘리는 운동**부터 해 보세요.",
  },
];

const pill = "rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400";

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
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        {/* 2026-11-23: 「꾸준히 3년+ · 주 5회+ · 주 50km+」를 뺐다 — Honert 2020 초록에 없는 숫자(머리 주석). 단계 이름으로 */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Link
            href="/injury#stage-to-full"
            className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800"
          >
            4~5단계 · 풀코스와 기록 단축
          </Link>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/advanced-guide" compact checked={11} />

        <KeyPoints
          items={[
            <>뼈 한 곳이 콕 집어 아프면 <strong>달리기를 멈추고 진료부터</strong> 받으세요.</>,
            <>대회 전에는 <strong>거리만 줄이고 빠르게 뛰는 날은 남겨 두는</strong> 편이 기록에 좋았어요.</>,
            <>아침에 재는 심박 수치는 하루치에 흔들리지 말고 <strong>일주일 평균</strong>을 봐요.</>,
          ]}
        />

        <Lead>
          풀코스와 기록 단축을 준비하면 마일리지(쌓은 달리기 거리)가 크게 늘어요. 그만큼 뼈와 힘줄이 같은 힘을 더 자주
          받아요.
        </Lead>

        <TableOfContents
          items={[
            { id: "injuries", label: "훈련량이 많으면 무엇부터 살피나요?" },
            { id: "bone", label: "뼈 한 곳이 콕 집어 아프면요?" },
            { id: "hamstring", label: "엉덩이 아래가 아프면요?" },
            { id: "periodization", label: "대회 전에는 얼마나 줄이나요?" },
            { id: "hrv", label: "심박 수치로 훈련을 바꿔야 하나요?" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="injuries" className={H2}>
          <Num n={1} />훈련량이 많으면 어떤 부상부터 살펴야 하나요?
        </h2>
        <P>
          <strong>최근 1년 안에 다쳤던 곳</strong>부터 살펴보세요. 러너가 다시 다치는 가장 일관된 신호였어요.
        </P>
        <P>
          숙련자에게만 많은 부상을 순서대로 보여 준 자료는 찾지 못했어요. 이 글은 훈련량이 클 때 알아 둘 세 가지, 뼈의 금과 엉덩이 아래
          힘줄 통증과 쉬어도 풀리지 않는 피로를 다뤄요.
        </P>
        <Steps
          items={[
            { t: "달리는 중에 아픔이 커지면 그날은 멈춰요." },
            { t: "다음 날 아침에 더 아프면 거리를 줄여요." },
            { t: "쉬어도 나아지는 느낌이 없으면 진료를 받아 보세요." },
          ]}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/achilles" className={pill}>발뒤꿈치 위가 아프다면 →</Link>
          <Link href="/injury/it-band" className={pill}>무릎 바깥이 아프다면 →</Link>
        </div>

        <OneLine>다쳤던 곳부터 살피고, 달리다 아픔이 커지면 그날은 멈춰요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="bone" className={H2}>
          <Num n={2} />뼈 한 곳이 콕 집어 아프면 어떻게 하나요?
        </h2>
        <P>
          <strong>달리기를 멈추고 진료부터 받으세요.</strong> 피로골절일 수 있어요. 피로골절은 같은 충격이 반복돼 뼈에 생기는 가는
          금이에요.
        </P>
        <P>
          한 번에 부러질 만큼 크지 않은 힘이 되풀이되며 생겨서, 누가 다칠지 미리 가려내기 어려워요. 장거리 러너에게는 정강이뼈와 그
          바깥쪽 종아리뼈에 많다고 정리돼 있어요.
        </P>
        <Steps
          items={[
            { t: "뼈 한 지점을 눌러 콕 집어 아프면 그날부터 달리지 않아요." },
            {
              t: "진료를 받고, 다시 뛸 시점은 의사와 정해요.",
              d: "일반 엑스레이는 피로골절을 잘 잡아내지 못하는 편이에요. 엑스레이가 깨끗해도 아픔이 그대로면 다시 상의해 보세요.",
            },
          ]}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/shin-splints" className={pill}>정강이 안쪽이 아프다면 →</Link>
        </div>

        <OneLine>뼈 한 곳이 콕 집어 아프면 참고 뛰지 말고, 멈춘 뒤 진료부터 받아요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="hamstring" className={H2}>
          <Num n={3} />엉덩이 아래 힘줄이 아프면 어떻게 하나요?
        </h2>
        <P>
          <strong>힘줄에 조금씩 힘을 늘려 주는 운동</strong>을 중심에 두고, 처음에는 <strong>엉덩이를 깊이 굽히는 자세를 줄여요.</strong>{" "}
          앉을 때 닿는 엉덩이 아래 뼈에 붙은 허벅지 뒤 근육의 힘줄이 아픈 것을 근위 햄스트링 건병증이라고 해요.
        </P>
        <P>
          물리치료사들이 이렇게 관리한다고 답했고, 치료 연구를 모은 분석도 같은 운동을 중심에 뒀어요. 다만 치료 효과를 따진 연구는
          아직 적어요.
        </P>
        <Steps
          items={[
            { t: "허벅지 뒤 근육 운동을 가볍게 시작해 조금씩 무게를 늘려요." },
            { t: "아픈 동안에는 엉덩이를 깊이 굽히는 동작을 줄여요.", d: "힘줄이 눌리는 자세가 아픔을 키운다고 봐서요." },
            { t: "달리기는 짧게 다시 시작해 단계적으로 늘려요." },
          ]}
        />

        <OneLine>쉬기만 하기보다, 힘줄에 조금씩 힘을 주며 달리기를 다시 늘려요.</OneLine>

        <FinderCta
          from="advanced-guide"
          variant="inline"
          headline="신발은 발볼과 사이즈가 맞는지가 먼저예요. 발볼과 용도로 좁혀 보세요."
        />

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="periodization" className={H2}>
          <Num n={4} />기록을 노린다면 대회 전에 얼마나 줄이나요?
        </h2>
        <P>
          <strong>대회 전 2주는 거리를 줄이고, 빠르게 뛰는 날과 달리는 횟수는 그대로</strong> 두는 편이 좋아요. 이렇게 대회 전에
          훈련을 줄이는 기간을 테이퍼라고 해요.
        </P>
        <P>
          경기 선수들의 연구를 모아 보니 2주 동안 거리를 41~60% 줄이고 강도와 횟수는 그대로 둔 방식이 기록에 가장 좋았어요. 그 전
          몇 달을 기간별로 나눠 짜는 방식이 부상을 줄인다는 연구는 찾지 못했어요.
        </P>
        <Steps
          items={[
            { t: "대회 2주 전부터 일주일 거리를 점점 줄여요.", d: "마지막 며칠에 한꺼번에 줄이지 않아요." },
            { t: "빠르게 뛰는 날은 빼지 말고 거리만 짧게 해요." },
          ]}
        />
        <Caveat>경기 선수들의 기록을 본 결과라 취미 러너에게 꼭 맞는다고 단정하긴 어려워요. 부상을 줄이는지는 보지 않았어요.</Caveat>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/marathon-training#taper" className={pill}>풀코스 대회 전이라면 →</Link>
          <Link href="/injury/get-faster" className={pill}>기록을 줄이고 싶다면 →</Link>
        </div>

        <OneLine>대회 전 2주는 거리만 줄이고, 빠르게 뛰는 날은 남겨 둬요.</OneLine>

        {/* ── 5 ─────────────────────────────────────────── */}
        <h2 id="hrv" className={H2}>
          <Num n={5} />아침에 잰 심박 수치를 보고 훈련을 바꿔야 하나요?
        </h2>
        <P>
          하루 수치만 보고 바꾸지 말고 <strong>일주일 평균</strong>을 보세요. 심박변이도는 심장 박동 사이 간격이 조금씩 달라지는
          정도예요. 영어 약자로 HRV라고 해요.
        </P>
        <P>
          한 연구에서 하루치보다 일주일 평균이 기록 변화와 더 잘 맞았어요. 지친 상태를 수치 하나로 가려내는 기준은 아직 없어요.
        </P>
        <Steps
          items={[
            { t: "재려면 날마다 같은 시각, 같은 자세로 재요." },
            { t: "매일 못 재면 일주일에 3번 이상 재서 평균을 봐요." },
            { t: "피로가 풀리지 않고 기록도 떨어지면 수치와 상관없이 훈련을 줄여요." },
          ]}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/rest-day#full-rest" className={pill}>쉬어도 피로가 안 풀린다면 →</Link>
        </div>

        <OneLine>하루 수치에 흔들리지 말고, 일주일 평균과 몸 상태를 함께 봐요.</OneLine>

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Saragiotto et al. (2014)</strong> 전향 연구 11편(4,671명)을 모아 보니 가장 일관된 위험 요인은 지난 12개월 안의 부상이었어요.
            <Ref>Sports Med 44(8):1153-63 · <a href="https://pubmed.ncbi.nlm.nih.gov/24809248/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Fredericson et al. (2006)</strong> 운동선수 피로골절 리뷰예요. 러너마다 소인·훈련·식사·근력·유연성이 달라 미리 가려내기 어렵고, 장거리 러너는 정강이뼈와 종아리뼈에 많았어요. 스포츠의학 클리닉 부상의 0.7~20%였고, 일반 엑스레이는 민감도가 낮다고 적었어요.
            <Ref>Top Magn Reson Imaging 17(5):309-25 · <a href="https://pubmed.ncbi.nlm.nih.gov/17414993/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Nasser et al. (2021)</strong> 전문 물리치료사 13명 면담이에요. 근위 햄스트링 건병증을 교육과 점진적인 부하 운동, 초중기에 눌리는 자세 피하기, 단계적 복귀로 관리한다고 답했어요.
            <Ref>Phys Ther Sport 48:67-75 · <a href="https://pubmed.ncbi.nlm.nih.gov/33378733/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Dizon et al. (2023)</strong> 치료 연구 13편을 모았어요. 효과를 따진 연구가 부족하다고 하면서, 힘줄에 점진적으로 부하를 주는 운동과 허리·골반 안정화 운동, 충격파 치료를 함께 쓰는 방식을 권했어요.
            <Ref>Sports (Basel) 11(3):53 · <a href="https://pubmed.ncbi.nlm.nih.gov/36976939/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={5}>
            <strong>van Dyk et al. (2019)</strong> 15편(8,459명)을 모아 보니 노르딕 햄스트링 운동을 넣은 예방 프로그램에서 햄스트링 부상이 절반 수준이었어요(위험비 0.49, 0.32~0.74). 부상 예방 연구이고 건병증 치료 연구는 아니에요.
            <Ref>Br J Sports Med 53(21):1362-1370 · <a href="https://pubmed.ncbi.nlm.nih.gov/30808663/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={6}>
            <strong>Bosquet et al. (2007)</strong> 여러 종목의 경기 선수 연구 27편을 모은 메타분석이에요. 2주 동안 훈련량을 41~60% 줄이고 강도와 빈도는 그대로 두는 방식이 기록에 가장 효과적이었어요. 부상은 보지 않았어요.
            <Ref>Med Sci Sports Exerc 39(8):1358-65 · <a href="https://pubmed.ncbi.nlm.nih.gov/17762369/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={7}>
            <strong>Plews et al. (2013)</strong> 9주 훈련에 반응한 러너 10명에서 심박변이도 변화와 기록 변화를 비교했어요. 하루 값보다 일주일 평균이 기록 변화와 더 강하게 맞았어요.
            <Ref>Int J Sports Physiol Perform 8(6):688-91 · <a href="https://pubmed.ncbi.nlm.nih.gov/23479420/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={8}>
            <strong>Plews et al. (2014)</strong> 훈련된 철인3종 선수 자료로, 일주일 평균을 내려면 무작위로 고른 유효 측정이 주 3회 이상 필요하다고 결론 냈어요.
            <Ref>Int J Sports Physiol Perform 9(5):783-90 · <a href="https://pubmed.ncbi.nlm.nih.gov/24334285/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={9}>
            <strong>Meeusen et al. (2013)</strong> 오버트레이닝 증후군 국제 합의문이에요. 훈련과 회복의 균형이 무너지면 비기능적 오버리칭이 생길 수 있고, 호르몬·수행 검사·심리·생화학·면역 지표 가운데 기준을 다 채워 널리 인정된 것은 아직 없다고 봤어요.
            <Ref>Med Sci Sports Exerc 45(1):186-205 · <a href="https://pubmed.ncbi.nlm.nih.gov/23247672/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={10}>
            <strong>Lauersen et al. (2014)</strong> 여러 종목의 무작위 시험 25편(26,610명)을 모은 메타분석이에요. 근력운동을 한 사람들의 부상이 3분의 1 수준이었어요(상대위험 0.315, 0.207~0.480). 달리기만 모은 분석은 아니에요.
            <Ref>Br J Sports Med 48(11):871-7 · <a href="https://pubmed.ncbi.nlm.nih.gov/24100287/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={11}>
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
