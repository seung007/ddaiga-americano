import type { Metadata } from "next";
import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, Warn, Num, KeyPoints, Steps, OneLine, Caveat, Sources, Src, Ref } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

/**
 * 아킬레스건·종아리 통증
 *
 * 2026-09-21 제목 교체 — 「미드풋 전환 후 아킬레스건·종아리 통증 스트레칭」이 들어오는 사람(대부분 주법을 바꾼 적 없음)을
 *   잘못 고르고 있었다. CTR 이 오른다고 예측하지 않았다(docs/운영/유입_설정_기준선.md §0). 미드풋은 원인 목록의 하나로 내렸다.
 * 2026-10-07 초록 재검증 · 2026-10-13 가독성 재설계 (경위는 git 기록)
 *
 * 2026-11-23 확정 틀로 바꿈 (docs/운영/가이드_틀.md, 견본 app/injury/start-running/page.tsx)
 *   판정 전부: docs/판정/achilles.jsonl. 초록 9편은 2026-11-23 크롬으로 PubMed 를 직접 열어 읽었다(요약만, 본문은 열지 않음).
 *
 *   고친 것 — 무엇이 틀렸고 왜
 *   · **「분당 160보라면 168~175보」 ✗** — 160×1.10 = 176 이다. 걸음 수 글과 같은 말 「지금 분당 160보라면 168~176보예요」로.
 *     올리는 폭 5~10% 는 걸음 수 글과 같은 사이트 기준(「권해요」)이고, 아킬레스 쪽을 잰 실험(Lyght 2016)은 +5% 만 시험했다 — 그 단서를 본문에 남겼다.
 *   · **하이닥 기사(정형외과 전문의, 걸음 수 5~10%)를 출처 목록에서 내렸다** — 논문이 아니고, 같은 내용을 Lyght 2016 초록이 받친다
 *     (midfoot 글 2026-11-18 과 같은 처리). 기사는 이번에 다시 열지 않았다.
 *   · **「한쪽 15회 × 3세트 / 하루 1~2회 / 3~5초」를 뺐다** — 읽은 초록 세 편(Alfredson 1998·Prudêncio 2023·Kim 2023) 어디에도 없다.
 *     「몇 번씩 하라는 기준은 확인한 자료가 없어요」로. 처음 이 운동을 시험한 연구(Alfredson 1998)를 PubMed 에서 찾아 읽고 「12주」만 FAQ 에 썼다.
 *     스트레칭 두 가지의 「30초 · 3세트」도 같은 이유로 뺐고, 단계별 상자는 FAQ 한 문항으로 줄였다(스트레칭 단독 효과를 본 연구가 이 글에 없다).
 *   · **「통증 몇 점까지 괜찮은지는 복귀 글에」 ✗** — 그 글의 점수 표가 2026-11-18 에 사라졌다. 점수 없는 표준 문구
 *     (달리는 중 아픔이 커지면 멈춤 · 다음 날 아침 더 아프면 거리 줄임 · 쉬어도 안 나으면 진료)로 — it-band·intermediate-guide 와 같은 말.
 *   · **「편심 운동이 근거가 가장 많다」를 낮췄다** — 받치는 것은 고찰 한 편(Prudêncio 2023)이고 합친 것은 통증 5편, 8편 모두 편향 우려·높음.
 *     「다른 운동보다 통증이 더 줄어드는 편이었어요 · 모은 연구들의 질이 높지 않았어요」로.
 *   · **Silbernagel 2007 「회복이 같았습니다」 → 「뚜렷한 차이가 없었어요」** — 초록은 「차이가 없었다」까지다. 시험 한 편이라 「꼭 완전히 쉬지 않아도 되는 편」.
 *   · **「아침 첫 발걸음 극심·붓고 열감이면 아킬레스건염이나 파열 가능성」을 뺐다** — 읽은 초록 어디에도 없는 진단 문장이다.
 *     대체 진단을 만들지 않고, 진료 신호는 it-band 와 같은 사이트 목록으로.
 *   · 「통증이 줄어든 뒤에도 계속하는 경우가 많다」「처음엔 당기는 느낌이 정상」을 뺐다(출처 없음). Almonroeder 「11%」(p=0.05)는 출처에만.
 *   · 본문에서 연구 인원·나라·대상(38명·19명·여성 러너·네덜란드·덴마크)을 내렸다(접힌 출처로). 「편심성」「솔리어스」「케이던스」 같은 말을 본문에서 풀어 썼다.
 *   · 말투 「~니다」 → 「~요」, 옛 부품(한눈에 상자·근거 딱지·근거 접힘·할 일 상자·문헌 목록) 걷어냄, 문장 속 화살표를 풀었다.
 *     글 안 질문창·공유 버튼·글 끝 신발 찾기 띠는 다른 확정 틀 글(knee-pain 등)처럼 뺐다. id 는 why·exercises·drop·rest-or-run 을 그대로 두고 doctor 를 더했다
 *     (shoe-finder 가 #drop 을 건다).
 *
 *   확인 못 한 것
 *   · 하이닥 기사 원문(이번에 다시 열지 않음 — 출처 목록에서 내렸다)
 *   · 9편 모두 본문은 열지 않았다(요약만). Kim 2023 의 2024 정정문(PMID 39170687) 내용은 열지 않았다
 *   · 드롭과 아킬레스 부담, 착지를 바꾸는 기간·비율 — 연구를 확인하지 못해 「권해요」 말투로만 둔다
 */

const PAGE_URL = pageUrl("/injury/achilles");
const TITLE = "아킬레스건 통증, 달리기를 쉬어야 하나요?";
// 원장 lib/guide/articles.ts 의 desc 와 같은 문장이어야 한다(허브 카드·검색 결과가 어긋나지 않게)
const DESC =
  "달린 뒤 아킬레스건이나 종아리가 당겨도 꼭 완전히 쉬지 않아도 되는 편입니다. 아픔을 보며 줄여 뛰는 법, 계단에서 뒤꿈치를 천천히 내리는 운동, 진료가 필요한 신호를 담았습니다.";

export const metadata: Metadata = {
  title: `${TITLE} | 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/achilles" },
};

// 2026-11-23: FAQ 는 본문 큰 질문과 겹치지 않는 것만 둔다
const FAQ: FaqItem[] = [
  {
    q: "뒤꿈치 내리기 운동은 몇 번씩, 얼마나 해야 하나요?",
    a: "정해진 횟수를 확인한 자료는 없어요. **살짝 당기는 정도에서 꾸준히** 해 보세요. 이 운동을 처음 시험한 연구는 **12주** 동안 했어요.",
  },
  {
    q: "착지를 앞꿈치 쪽으로 바꾼 뒤 아킬레스건이 당겨요, 괜찮나요?",
    a: "**새 착지로 달리는 구간을 줄여** 보세요. 앞꿈치로 닿으면 아킬레스건이 받는 힘이 더 컸다는 실험이 있어요. 다음 날 아침 더 아프면 **바꾸던 것을 멈춰요.**",
  },
  {
    q: "종아리 스트레칭만 해도 낫나요?",
    a: "스트레칭만으로 낫는다는 자료는 확인하지 못했어요. **뒤꿈치 천천히 내리기**를 먼저 하고, 스트레칭은 **당기는 느낌이 편할 만큼** 더해 보세요.",
  },
];

const pill = "rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400";

export default function AchillesPage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} datePublished="2025-03-01" />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["아킬레스·종아리 통증", "/injury/achilles"],
        ]}
      />
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">아킬레스</span>
          {/* 규약은 app/injury/page.tsx 상단 주석. 허브 카드(lib/guide/articles.ts)도 같이 고친다 */}
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/achilles" compact checked={9} />

        <KeyPoints
          items={[
            <>아킬레스건이 아파도 <strong>꼭 완전히 쉬지 않아도 되는 편</strong>이에요. 달리다 아픔이 커지면 그날은 멈춰요.</>,
            <>운동은 <strong>계단에서 뒤꿈치를 천천히 내리는 운동</strong>부터 해 보세요.</>,
            <>쉬어도 나아지는 느낌이 없으면 <strong>진료</strong>를 받아 보세요.</>,
          ]}
        />

        <Lead>
          달리고 나면 뒤꿈치 위쪽이나 종아리가 당기고 뻐근할 때가 있어요. 아킬레스건은 종아리 근육과 발뒤꿈치뼈를 잇는 굵은
          힘줄이에요. 아프다고 바로 달리기를 끊기보다 <strong>아픔을 보며 양을 줄이는 법</strong>부터 알아 두면 좋아요.
        </Lead>

        <TableOfContents
          items={[
            { id: "rest-or-run", label: "달리기를 쉬어야 하나요?" },
            { id: "exercises", label: "어떤 운동을 하나요?" },
            { id: "why", label: "왜 아프고, 무엇을 줄이나요?" },
            { id: "drop", label: "신발이나 걸음 수를 바꾸면요?" },
            { id: "doctor", label: "언제 병원에 가나요?" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="rest-or-run" className={H2}>
          <Num n={1} />아킬레스건이 아프면 달리기를 완전히 쉬어야 하나요?
        </h2>
        <P>
          <strong>꼭 완전히 쉬지 않아도 되는 편이에요.</strong> 한 시험에서 아픔을 보며 달리기를 이어 간 사람들과 6주 쉰
          사람들의 회복에 뚜렷한 차이가 없었어요. 두 쪽 다 같은 재활 운동을 했어요.
        </P>
        <Steps
          items={[
            { t: "달리는 중에 아픔이 커지면 그날은 멈춰요." },
            { t: "다음 날 아침에 더 아프면 거리를 줄여요." },
            { t: "쉬어도 나아지는 느낌이 없으면 진료를 받아 보세요." },
          ]}
        />
        <P>쉬든 계속 뛰든, 아래 2절의 운동은 같이 해 보길 권해요.</P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/return-to-running#comeback" className={pill}>쉬었다가 다시 거리를 늘린다면 →</Link>
        </div>

        <OneLine>완전히 쉬기보다, 아픔을 보며 줄여 뛰어요. 다음 날 아침 더 아프면 더 줄여요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="exercises" className={H2}>
          <Num n={2} />아킬레스건이 아플 때 어떤 운동을 하나요?
        </h2>
        <P>
          <strong>계단에서 뒤꿈치를 천천히 내리는 운동</strong>을 해 보세요. 여러 연구를 모아 보니 다른 운동보다 통증이 더
          줄어드는 편이었고, 종아리 힘도 좋아졌어요. 다만 모은 연구들의 질이 높지 않았어요.
        </P>
        <Steps
          items={[
            { t: "계단 끝에 발 앞부분만 걸쳐요.", d: "난간이나 벽을 짚어 균형을 잡아요." },
            { t: "두 발로 뒤꿈치를 올린 뒤, 아픈 쪽 발 하나로 천천히 내려와요.", d: "올라갈 때는 다시 두 발을 써요." },
            { t: "살짝 당기는 정도에서 해 보세요.", d: "날카롭게 아프면 그날은 멈춰요." },
          ]}
        />
        <Caveat>몇 번씩 하라는 기준은 확인한 자료가 없어요. 아프지 않은 만큼 꾸준히 해 보세요.</Caveat>

        <OneLine>계단에서 뒤꿈치를 천천히 내리는 운동부터, 살짝 당기는 정도로 꾸준히 해 봐요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="why" className={H2}>
          <Num n={3} />아킬레스건은 왜 아프고, 무엇을 줄여야 하나요?
        </h2>
        <P>
          <strong>많이 써서 생기는 부상</strong>으로 흔해요. 그래서 최근에 무엇이 늘었는지부터 돌아보고, 늘어난 것을 줄여 보세요.
        </P>
        <Steps
          title="최근에 이런 게 바뀌었는지 돌아봐요"
          items={[
            { t: "거리나 속도를 갑자기 늘렸어요.", d: "늘린 만큼을 먼저 되돌려 보세요." },
            { t: "언덕이나 계단 달리기를 새로 넣었어요.", d: "아픈 동안은 평지에서 뛰어 보세요." },
            { t: "착지를 앞꿈치 쪽으로 바꾸는 중이에요.", d: "새 착지는 짧은 구간에서만 해 보길 권해요." },
          ]}
        />
        <P>
          처음 달리는 사람도 겪지만, 오래 달린 사람도 예외가 아니에요. 한 조사에서는 오래 달린 사람의 부상 가운데 아킬레스건이
          차지하는 몫이 처음 달리는 사람보다 컸어요.
        </P>

        <OneLine>최근에 늘어난 것을 찾아 먼저 되돌려요. 오래 달린 사람도 예외가 아니에요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        {/* 2026-09-14: 「드롭 8~12mm 유지」는 근거 없는 mm 처방이라 뺐다. shoe-finder 가 #drop 을 가리킨다 — id 를 바꾸지 않는다 */}
        <h2 id="drop" className={H2}>
          <Num n={4} />신발이나 걸음 수를 바꾸면 나아지나요?
        </h2>
        <P>
          <strong>걸음 수를 조금 올리는 건 해 볼 만해요.</strong> 한 실험에서 평소보다 걸음 수를 올리자 착지 방식과 상관없이
          아킬레스건이 받는 힘이 줄었어요.
        </P>
        <Steps
          items={[
            { t: "지금 걸음 수에서 5~10%쯤만 올려 보길 권해요.", d: "지금 분당 160보라면 168~176보예요." },
            { t: "보폭을 억지로 좁히지 말고, 발을 조금 더 자주 놓는다고 생각해요." },
          ]}
        />
        <Caveat>아킬레스건 쪽을 잰 실험은 5% 올린 조건만 시험했어요. 올리는 폭은 걸음 수 글과 같은 기준이에요.</Caveat>
        <P>
          드롭은 신발 뒤꿈치와 앞꿈치의 굽 높이 차이예요. 드롭이 낮은 신발이 아킬레스건 부담을 키운다는 말이 흔하지만,{" "}
          <strong>확인한 자료가 없어요.</strong> 그래서 몇 mm를 신으라고는 적지 않아요.
        </P>
        <Steps
          items={[
            { t: "지금보다 드롭이 많이 낮은 신발로 갑자기 바꾸지 않길 권해요." },
            { t: "신발을 바꾼 뒤 아프기 시작했다면 원래 신발로 돌아가 봐요." },
          ]}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/cadence" className={pill}>걸음 수를 올리는 법이 궁금하다면 →</Link>
        </div>

        {/* 2026-10-07: 「걸러서」도 틀렸다 — 엔진은 거르지 않고 점수만 조정한다.
            2026-11-23: 부상 이력 점수를 0으로 바꿨다(굽 차이가 아킬레스에 맞는다는 시험을 찾지 못함 — recommend.ts 9번 블록). 문구도 맞췄다. */}
        <FinderCta from="achilles" variant="inline" headline="부상 이력은 신발 순서에 넣지 않아요. 신발 구조가 아킬레스 부담을 줄인다는 시험을 찾지 못했어요." />

        <OneLine>걸음 수는 오늘 조금 올려 볼 수 있어요. 신발은 갑자기 바꾸지 않는 게 먼저예요.</OneLine>

        {/* ── 5 ─────────────────────────────────────────── */}
        <h2 id="doctor" className={H2}>
          <Num n={5} />언제 병원에 가야 하나요?
        </h2>
        <P>
          <strong>쉬어도 나아지는 느낌이 없으면</strong> 진료를 받아 보세요. 운동만으로 치료한 사람들을 5년 뒤에 보니 80%가
          완전히 나았다는 연구가 있어요.
        </P>
        <Warn title="이럴 땐 진료를 받아 보세요">
          <ul className="list-disc space-y-1 pl-5">
            <li>쉬어도 나아지는 느낌이 없다</li>
            <li>걸을 때도 아킬레스건이 아프다</li>
            <li>아킬레스건이 붓거나 열감이 있다</li>
          </ul>
        </Warn>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/plantar-fasciitis" className={pill}>발바닥 뒤꿈치가 아프다면 →</Link>
        </div>

        <OneLine>운동으로 나아지는 경우가 많아요. 쉬어도 그대로면 진료를 받아요.</OneLine>

        <div className="mt-14">
          <YoutubeSection
            links={[
              { label: "아킬레스건이 아픈 원인과 치료, 스트레칭 방법까지! (골통 의사 윤재웅)", url: "https://www.youtube.com/watch?v=aKWMUcOL4bE" },
              { label: "아킬레스건 통증! 순식간에 사라지는 운동 루틴", channel: "몸수리 (구 운동한입)", url: "https://www.youtube.com/watch?v=gj8XiInamMw" },
              { label: "아킬레스건 통증 해결을 위한 5분 운동", channel: "피지오스튜디오 PHYSIOSTUDIO", url: "https://www.youtube.com/watch?v=SJ_DtvsdNlo" },
              { label: "달리기 후 아킬레스건 통증 해결하는 3분 운동", channel: "피지오스튜디오 PHYSIOSTUDIO", url: "https://www.youtube.com/shorts/2BsTWOvhmPg" },
            ]}
          />
        </div>

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Silbernagel et al. (2007)</strong> 아킬레스건병증 환자 38명을 나눠, 통증을 보며 달리기·점프를 이어 간 사람들과 처음 6주 동안 멈춘 사람들을 비교한 시험이에요. 재활 운동은 같았고, 12개월 동안 나아지는 정도에 뚜렷한 차이가 없었어요.
            <Ref>Am J Sports Med 35(6):897-906 · <a href="https://pubmed.ncbi.nlm.nih.gov/17307888/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Prudêncio et al. (2023)</strong> 연구 8편을 모았고, 통증만 5편을 합쳐 보니 뒤꿈치를 천천히 내리는 운동이 다른 운동보다 통증이 더 줄었어요. 8편 모두 편향 우려가 있거나 높았고, 저자들도 더 잘 설계된 시험이 필요하다고 적었어요.
            <Ref>BMC Sports Sci Med Rehabil 15(1):9 · <a href="https://pubmed.ncbi.nlm.nih.gov/36698184/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Kim et al. (2023)</strong> 운동 치료가 종아리 기능에 주는 효과를 본 연구 10편을 정리했어요. 뒤꿈치를 천천히 내리는 운동으로 근력이 좋아졌어요. 통증은 이 정리의 대상이 아니었어요.
            <Ref>Front Sports Act Living 5:1144484 · <a href="https://pubmed.ncbi.nlm.nih.gov/37265492/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Alfredson et al. (1998)</strong> 오래 아팠던 운동선수 15명이 12주 동안 뒤꿈치를 천천히 내리는 운동을 한 뒤 모두 달리기로 돌아갔어요. 무작위로 나누지 않은 작은 비교 연구예요.
            <Ref>Am J Sports Med 26(3):360-6 · <a href="https://pubmed.ncbi.nlm.nih.gov/9617396/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Lyght et al. (2016)</strong> 여성 러너 19명이 두 착지와 세 가지 걸음 수로 달렸어요. 앞꿈치 착지에서 아킬레스건 최대 응력과 변형이 더 컸고, 걸음 수를 5% 올리면 두 착지 모두에서 줄었어요. 부상을 센 연구는 아니에요.
            <Ref>J Appl Biomech 32(4):365-72 · <a href="https://pubmed.ncbi.nlm.nih.gov/26955843/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={6}>
            <strong>Almonroeder et al. (2013)</strong> 여성 러너 19명이 맨발로 달렸을 때, 뒤꿈치가 아닌 착지 쪽의 걸음당 아킬레스건 충격량이 11% 컸어요(통계적으로 경계선).
            <Ref>Ann Biomed Eng 41(8):1758-66 · <a href="https://pubmed.ncbi.nlm.nih.gov/23640524/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={7}>
            <strong>Kemler et al. (2018)</strong> 네덜란드 러너 4,621명 설문에서 부상 가운데 아킬레스건이 차지하는 몫이 처음 달리는 사람 2.3%, 오래 달린 사람 8.4%였어요.
            <Ref>Phys Sportsmed 46(4):485-491 · <a href="https://pubmed.ncbi.nlm.nih.gov/30071170/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={8}>
            <strong>Nielsen et al. (2014)</strong> 덴마크에서 처음 달리기를 시작한 933명 가운데 다친 254명의 진단을 보니, 아킬레스건병증이 7%였어요.
            <Ref>PLoS One 9(6):e99877 · <a href="https://pubmed.ncbi.nlm.nih.gov/24923269/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={9}>
            <strong>Silbernagel et al. (2011)</strong> 운동 치료만 받은 34명을 5년 뒤에 보니 80%가 완전히 나았어요(그중 일부는 증상이 다시 생겼어요). 움직이기를 두려워할수록 까치발 들기 회복이 더뎠어요. 대조군 없는 추적 연구예요.
            <Ref>Am J Sports Med 39(3):607-13 · <a href="https://pubmed.ncbi.nlm.nih.gov/21084657/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
