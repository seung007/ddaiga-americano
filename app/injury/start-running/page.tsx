import type { Metadata } from "next";
import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, H3, Warn, Num, KeyPoints, Steps, OneLine, Sources, Src, Ref } from "@/components/guide/Read";
import { WALK_RUN } from "@/lib/guide/walkRun";
import { pageUrl } from "@/lib/site";

/**
 * 1단계 — 처음 → 30분 연속 (2026-10-06)
 *
 * 사용자 요청: "아예 처음부터 숙련자까지 실제로 겪는 병목이 무엇이고, 실제로 어떻게 해야 하는지 모르잖아."
 * 이 사이트에는 「처음 시작한 사람」이 읽을 글이 없었다. 초보 가이드는 이미 달리는 사람의 주간 계획부터 시작한다.
 *
 * 각도: **사람들이 멈추는 이유**에서 출발한다. 체력이 아니라 부상과 진도다(Fokkema 2019, Relph 2023).
 *
 * 규칙
 *   · 숫자는 PubMed 초록에서 확인한 값만 (2026-10-06 대조). 각 숫자 옆에 출처.
 *   · 걷기-달리기 진도표·「넘어가는 조건」·주 3회는 **이 사이트의 예시**라고 표에 적는다 —
 *     특정 진도를 검증한 연구는 찾지 못했다. 오히려 정해진 진도가 중도 포기와 관련 있었다(Relph 2023).
 *   · 연구끼리 엇갈리는 지점(정해진 프로그램이 낫다 vs 정해진 진도가 포기를 부른다)은 엇갈린다고 적는다.
 *   · 「110%」는 초보만 모은 연구가 아니다(평균 45.8세). 거리 기준을 시간으로 바꿔 쓰는 건 사이트의 단순화.
 *
 * 2026-10-13 가독성 재설계 — 섹션마다 답 → 할 일 → 근거(접힘).
 *
 * 2026-11-18 새 틀 시범 글 (사용자: "한 편을 예시로 만들어서 그 틀로 가이드 글을 다 바꾸자")
 *   근거: docs/조사/벤치마킹_2026-09-12.md 「가이드 글 부분 구성」 1·2 (러닝위키·브런치·토스뱅크·닥터나우·러너스레터 실측).
 *   · 제목 아래는 날짜 한 줄. 글쓴이 소개는 글 끝으로
 *   · 「한눈에」 4줄 → 「3줄 요약」 번호 3개. 「가장 긴 날 110%」는 3절 본문에 그대로 있다
 *   · 큰 절 8개 → 번호 붙은 큰 질문 6개. 옆구리(→2절)·가장 긴 날·체중(→3절)은 작은 질문으로. id 는 그대로(다른 글이 #long-day·#pace·#progression 을 건다)
 *   · 「이렇게 하세요」 상자 → 본문 안 ①②③(<Steps>). 「저희 제안」 표시는 그대로
 *   · 「근거 보기」 접힘 9개 → 문장 끝 [n] + 글 끝 「근거와 출처」 13개(펼침). 접혀 있던 숫자는 각 출처의 「확인한 것」으로 옮겼다 — 지운 숫자 없음
 *   · 절 끝 「한 줄 요약」
 *   · (같은 날 사용자 지적) 「[7] · 따옴표 · ※ 다 빼는 게 낫지 않을까」 → 문장 끝 [n]·따옴표·※·문장 속 → 를 뺐다.
 *   · (같은 날 사용자 지적) 「저희 제안·연구끼리 엇갈려서 빼고, 확실한 것을 보여주자. 논문으로 판정해 봐야 하지 않나」
 *     → 주장 27개를 논문으로 다시 판정(보고서: /home/claude/reports/처음 달리기 글 근거 판정.md, 저장소 밖 작업 노트).
 *       확실 → 단정 / 근거 있음 → 「한 연구에서」처럼 대상을 문장에 / 근거 없음(진도표·넘어가는 법·멈춤 신호 일부) → 「권해요·해 보세요」 말투.
 *       「저희 제안」 딱지와 「엇갈려서」 단서는 그래서 필요 없어졌다(딱지 대신 문장이 무게를 진다).
 *       고친 것: 「체력이 아니라」(확인 못 함) 삭제 · Relph 「정해진 진도가 포기와 관련」(통계 아님, 면담 주제) → 면담 주제로 ·
 *       Relph OR 7.56(논문 안에서 뜻이 갈리고 CI 2.06–27.75) 삭제 · 「환기역치 아래」(15명 실험과 어긋남) 삭제 ·
 *       Morton 출처의 「상체 자세·코어 강화」「잘 훈련된 선수」(초록에서 확인 못 함) 삭제 ·
 *       스트레칭 근육통 「근거 약함」 → 코크런으로 「거의 줄지 않음」(근거를 실제보다 약하게 적었었다) ·
 *       「비싼 신발」(가격 연구 확인 못 함) → 「발 모양에 맞춰 고른 신발」(코크런). 회내 제어화로 넓히지 않는다(Malisoux 2016 과 충돌).
 *       Linton 86% 는 2026-11-18 PubMed 초록에서 86% 로 직접 확인(저자 원고 94% 와 다름 — 출판본이 86%).
 *   · (같은 날 사용자) 「논문 내용을 다 적을 필요가 있나. 니즈는 논문이 아니라 실제로 잘 달리는 것」 + 국내 글 3편 실측
 *     (브런치·GQ·쿼트레터: 연구 언급 0~2문장, 굵은 글씨는 할 일에만. 우리는 54문장 중 12문장이 연구 이야기였다)
 *     → 본문의 주어를 연구에서 「독자가 할 일」로. 연구 대상·인원·나라는 접힌 출처로 내리고, 근거의 무게는 말의 세기로만
 *       (단정 / 「~경향이 있었어요·많아요」 / 「해 보세요·권해요」). 굵은 글씨는 할 일과 핵심 숫자에만.
 *       본문에서 내린 숫자: 532·749·5천여·18개월·2천여(연구 규모) — 주장 숫자(셋 중 하나·2배·110%·3km·20.8/20.3%)는 그대로.
 *   · (같은 날) 분량 정리: 휴대폰 8.7화면이 길다는 지적. 글자 수는 국내 참고 글(토스 2,202·닥터나우 2,662·브런치 4,049자)과 비슷했고,
 *     길게 느껴진 이유는 본문과 FAQ의 같은 내용 반복(5문항 중 3개)과 할 일보다 앞에 놓인 「왜 그만두나」 절이었다.
 *     → 1절을 빼고 두 문장은 진도표 절 도입으로, 옆구리·체중 소제목은 FAQ에만, 2절 제목과 같은 FAQ 문항 삭제. 큰 질문 6→5개.
 *     근거: NN/g 시선 추적(2018) 보는 시간의 74%가 첫 두 화면 → 할 일(속도·진도표)을 앞으로.
 *     NN/g(2013) 글은 여러 쪽으로 나누지 말 것 → 페이지 넘기기는 하지 않음.
 *   · (같은 날) 냉정한 점검에서 나온 것: 판정 「근거 있음」인데 단정한 3곳의 세기를 낮춤(셋 중 하나 → 「한 연구에서」, 2배 → 「더 많이 다치는 편」,
 *     열 명 중 일곱 → 「~쯤 … 겪는다고 해요」). 수집한 양식 중 안 넣었던 것 적용: 작은 제목을 결론형으로(GQ·러닝위키, 큰 제목은 질문형 유지),
 *     아픈 곳별 상황 문장 링크(브런치), 쉬운 말 먼저 「체질량지수(BMI)」(러너스레터).
 *     「첫 주 3km」를 하루 분량으로 환산하는 예시는 넣지 않았다 — 연구에 없는 값이라.
 *     어느 연구가 어디에 쓰였는지는 「근거와 출처」 각 항목의 「쓰인 곳」으로 옮겼다(문장→출처 대신 출처→절). 단서는 <Caveat>(※ 없이 회색 작은 글씨)
 *   · 문장 끝 「~요」(사이트 화면 문구·토스·닥터나우와 같게)
 *   · 첫 문단에는 숫자·예고 문장을 쓰지 않는다(running-guide-writing 규칙)
 */

const PAGE_URL = pageUrl("/injury/start-running");
const TITLE = "러닝 처음 시작하면 얼마나 뛰어야 하나요?";
const DESC =
  "러닝을 처음 시작한 사람이 그만두는 가장 큰 이유는 부상입니다. 숨이 차지 않는 속도와 걷기를 섞어 늘리는 순서, 그날은 멈춰야 할 신호를 담았습니다.";

export const metadata: Metadata = {
  title: `러닝 처음 시작하면 얼마나 뛰어야 하나요? | 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/start-running" },
};

// 2026-11-18: 「연구 근거·저희 제안」 딱지는 쓰지 않는다 — 근거 무게는 문장(「한 연구에서」「권해요」)이 진다(머리말 참고).
// 진도표는 lib/guide/walkRun.ts 가 단일 출처 — /tools/run-30 과 같은 표를 쓴다 (2026-10-13)

const FAQ: FaqItem[] = [
  {
    q: "처음엔 하루에 얼마나, 일주일에 몇 번 달려야 하나요?",
    a: "처음엔 걷기를 섞어 20~30분, 주 3회, 달리는 날 사이 하루 쉬기를 권해요. 다음 단계로 넘어갈지는 횟수보다 달리는 동안 대화가 됐는지, 다음 날 통증이 없는지로 정해 보세요.",
  },
  {
    q: "10% 규칙을 지켜야 하나요?",
    a: "꼭 지킬 필요는 없어요. 10% 규칙을 지킨 쪽과 안 지킨 쪽의 부상률은 20.8%와 20.3%로 비슷했어요. 대신 가장 길게 뛰는 날을 지난 30일 최장 기록의 110% 안에서 늘려 보세요.",
  },
  {
    q: "달리면 옆구리가 결려요.",
    a: "흔해요. 러너의 약 70%가 지난 1년 사이 겪었다고 답했어요. 대회 한 번에는 약 5명 중 1명이 겪어요. 먹은 직후, 특히 진한 음료 뒤에 심해져요. 달리기 2시간 전에는 많이 먹고 마시지 않는 것이 흔한 조언이에요.",
  },
  {
    q: "체중이 많이 나가도 달리기를 시작해도 되나요?",
    a: "돼요. 다만 BMI가 30을 넘으면 첫 주는 3km 미만으로 시작하길 권해요. 첫 주에 그보다 많이 달린 쪽에서 부상이 더 많았어요.",
  },
];

const linkCls = "text-emerald-700 underline";

export default function StartRunningPage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} datePublished="2026-10-06" />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["처음 달리기", "/injury/start-running"],
        ]}
      />
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Link
            href="/injury#stage-start"
            className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800"
          >
            1단계 · 처음 → 30분
          </Link>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/start-running" compact checked={15} />

        <KeyPoints
          items={[
            <>옆 사람과 <strong>이야기할 수 있을 만큼 천천히</strong> 뛰어요. 숨이 차면 걸어도 괜찮아요.</>,
            <>걷기와 달리기를 섞어 조금씩 늘려요. 다음 날 아프면 <strong>더 늘리지 말고, 같은 양으로 다시</strong> 뛰어요.</>,
            <>걸을 때도 아프면 <strong>그날은 쉬는 걸 권해요.</strong></>,
          ]}
        />

        <Lead>
          러닝을 막 시작해 조금만 뛰어도 숨이 찬다면, 걸어도 괜찮아요. 처음 시작한 사람이 그만두는 가장 큰 이유는{" "}
          <strong>부상</strong>이었어요.
        </Lead>

        <TableOfContents
          items={[
            { id: "pace", label: "숨이 너무 차요" },
            { id: "progression", label: "걷기와 달리기는 어떻게 섞나요?" },
            { id: "pain", label: "어디가 아프면 멈추나요?" },
            { id: "not-proven", label: "효과가 없던 방법" },
            { id: "next", label: "언제 다음 단계로 가나요?" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="pace" className={H2}>
          <Num n={1} />조금만 뛰어도 숨이 너무 차요, 어떡하나요?
        </h2>
        <P>
          <strong>짧은 문장을 끊지 않고 말할 수 있는 속도</strong>로 뛰세요. 이걸 말하기 테스트라고 해요.
          숨이 찰 만큼 뛰어야 운동이 된다고 생각하기 쉽지만, 처음엔 반대예요.
        </P>
        <Steps
          items={[
            { t: "말이 단어 단위로 끊기면 걸어요.", d: "숨이 돌아오면 다시 뛰어요." },
            { t: "걷는 속도와 비슷해져도 괜찮아요.", d: "처음엔 속도보다 시간이에요." },
            { t: "심박계는 없어도 돼요." },
          ]}
        />

        <OneLine>숨이 찰 만큼이 아니라, 말할 수 있을 만큼 뛰어요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="progression" className={H2}>
          <Num n={2} />걷기와 달리기는 어떻게 섞어서 늘리나요?
        </h2>
        <P>
          처음엔 <strong>정해진 진도표를 따라가 보세요.</strong> 혼자 계획을 짠 사람이 더 많이 다치는 경향이 있었어요.
          숨이 편해졌다고 다리도 준비된 건 아니에요. 같은 시간을 달려도 초보가 더 많이 다치는 편이에요.
        </P>
        <P>
          아래는 처음 시작하는 분께 권하는 8단계 진도표예요. A부터 차례로 해 보세요. 앞뒤로 5분씩 걷고, <strong>주 3회</strong> 하면서 달리는 날 사이에 하루 쉬어요.
        </P>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-base">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="whitespace-nowrap p-2.5">단계</th>
                <th className="p-2.5">한 번에 할 것</th>
                <th className="p-2.5">시간</th>
              </tr>
            </thead>
            <tbody>
              {WALK_RUN.map(([k, what, t]) => (
                <tr key={k} className="border-t border-gray-100">
                  <td className="p-2.5 font-semibold text-gray-900">{k}</td>
                  <td className="break-keep p-2.5 text-gray-700">{what}</td>
                  <td className="whitespace-nowrap p-2.5 text-gray-500">{t}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 2026-10-13: 표를 읽고 끝나지 않게 — 회차별 순서·타이머·진행 저장이 있는 따라 하기 도구로 잇는다 */}
        <Link
          href="/tools/run-30"
          className="mt-4 flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-center text-base font-semibold text-white break-keep hover:bg-emerald-700"
        >
          이 표대로 따라 하기 →
        </Link>

        <Steps
          title="다음 단계로 넘어가는 법"
          items={[
            { t: "같은 단계를 3번 해요.", d: "달리는 동안 대화가 됐고, 다음 날 아침 아프지 않으면 다음 단계로 가요." },
            { t: "하나라도 아니면 같은 단계를 반복해요." },
            { t: "두 번 반복해도 안 되면 한 단계 내려가요.", d: "진도가 버거우면 늦춰도 돼요. 프로그램을 그만둔 사람들은 부상과 너무 빠른 진도를 이유로 들었어요." },
            { t: "H까지 최소 8주예요.", d: "더 걸려도 정상이에요." },
          ]}
        />
        <P>
          기간을 길게 잡는다고 덜 다치지는 않았어요. 그래서 날짜보다 <strong>몸이 지금 단계를 받아들였는지</strong> 보고 넘어가세요.
        </P>

        <h3 id="long-day" className={`${H3} scroll-mt-20`}>가장 길게 뛰는 날은 한 달 최장 기록의 110%까지</h3>
        <P>
          <strong>지난 30일 중 가장 길게 뛴 기록의 110%</strong> 안에서 늘려 보세요. 한 대형 연구에서 그보다 길게 뛴 날에 부상이 늘었어요.
        </P>
        <P>원래는 거리 기준이지만, 처음엔 시간으로 봐도 돼요.</P>
        <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-base leading-[1.7] text-emerald-900">
          예를 들어 지난 한 달 가장 오래 달린 날이 <strong>20분</strong>이었다면, 다음 긴 날은 <strong>22분까지</strong>예요.
        </div>

        <OneLine>기간이 아니라, 지금 단계를 몸이 받아들였는지 보고 넘어가요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="pain" className={H2}>
          <Num n={3} />어디가 어떻게 아프면 그날은 멈춰야 하나요?
        </h2>
        <Warn title="이럴 땐 그날은 멈추세요">
          <ul className="list-disc space-y-1 pl-5">
            <li>통증 때문에 걸음걸이가 바뀐다</li>
            <li>다음 날 아침이 전날보다 더 아프다</li>
            <li>뼈의 한 지점을 누르면 콕 집어 아프다, 또는 쉬어도 아프다</li>
            <li>붓거나 열감이 있다</li>
          </ul>
          <p className="mt-2">이런 신호가 며칠 이어지면 진료를 받으세요.</p>
        </Warn>
        <P>
          뼈 한 지점이 콕 집어 아프면 피로골절일 수 있어요. 피로골절은 같은 충격이 반복돼 뼈에 생기는 가는 금이에요.
        </P>
        <P>
          아파도 참고 뛰는 러너가 많아요. 하지만 <strong>최근 1년 안에 다친 적이 있으면 또 다치기 쉬워요.</strong>
        </P>
        <P>
          초보는 정강이와 무릎 앞이 아픈 경우가 많아요. 아픈 곳에 따라 멈출 신호와 대처가 달라요.
        </P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/shin-splints" className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400">정강이가 아프다면 →</Link>
          <Link href="/injury/knee-pain" className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400">무릎 앞이 아프다면 →</Link>
          <Link href="/injury/plantar-fasciitis" className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400">발바닥이 아프다면 →</Link>
        </div>

        <OneLine>걸을 때도 아프면, 참지 말고 그날은 쉬는 걸 권해요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="not-proven" className={H2}>
          <Num n={4} />부상을 막는다는 방법, 다 효과가 있나요?
        </h2>
        <P>아니요. 아래 네 가지는 <strong>효과가 없었어요.</strong></P>
        <Steps
          title="효과가 없었던 방법"
          items={[
            {
              t: "주간 거리 10% 규칙",
              d: (
                <>
                  지킨 쪽도 부상이 줄지 않았어요. 이 규칙은 일주일 전체 거리를 보는 기준이라, 가장 긴 하루를 보는 110% 기준과는 달라요.
                </>
              ),
            },
            {
              t: "예방 정보를 읽기만 하기",
              d: (
                <>
                  정보를 받은 쪽과 안 받은 쪽의 부상이 비슷했어요.
                </>
              ),
            },
            {
              t: "스트레칭으로 근육통 막기",
              d: (
                <>
                  근육통이 거의 줄지 않았어요. 자세한 내용은{" "}
                  <Link href="/injury/cooldown" className={linkCls}>쿨다운 글</Link>에 있어요.
                </>
              ),
            },
            {
              t: "발 모양에 맞춰 고른 신발로 부상 막기",
              d: (
                <>
                  부상이 거의 줄지 않았어요. 발볼과 사이즈부터 보세요. 재는 법은 <Link href="/injury/wide-foot" className={linkCls}>발볼 글</Link>에 있어요.
                </>
              ),
            },
          ]}
        />

        <FinderCta
          from="start-running"
          variant="inline"
          headline="첫 신발은 발볼·사이즈가 맞는지가 먼저예요. 발볼·발 타입으로 좁혀 보세요."
        />

        {/* ── 5 ─────────────────────────────────────────── */}
        <h2 id="next" className={H2}>
          <Num n={5} />언제 다음 단계로 넘어가면 되나요?
        </h2>
        <P>
          대화가 되는 속도로 <strong>30분을 쉬지 않고</strong> 달렸고 <strong>다음 날 아프지 않았고</strong>, 그걸 주 2~3회씩 2주 넘게
          유지했다면 2단계(30분에서 10km까지)로 넘어가 보세요.
        </P>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/injury#stage-to10k" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            2단계에서 자주 겪는 문제 →
          </Link>
          <Link href="/injury/first-10k" className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:border-gray-300">
            생애 첫 10km 대회
          </Link>
          <Link href="/injury/beginner-guide" className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:border-gray-300">
            초보 러너 뛰는 법
          </Link>
        </div>

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Fokkema et al. (2019)</strong> 초보 774명 중 29.5%가 반년 안에 그만뒀고, 이유의 48%가 부상이었어요.
            <Ref>J Sci Med Sport 22(1):106-111 · <a href="https://pubmed.ncbi.nlm.nih.gov/29934211/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Relph et al. (2023)</strong> 9주 걷기-달리기 프로그램을 끝까지 마친 사람은 27.3%였어요(110명).
            <Ref>Int J Environ Res Public Health 20(17):6682 · <a href="https://pubmed.ncbi.nlm.nih.gov/37681822/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Videbæk et al. (2015)</strong> 1,000시간당 부상은 초보 17.8건, 취미 러너 7.7건이었어요.
            <Ref>Sports Med 45(7):1017-26 · <a href="https://pubmed.ncbi.nlm.nih.gov/25951917/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Linton &amp; Valentin (2018)</strong> 지금 다친 러너 570명 중 86%가 아픈 채로 계속 달렸어요.
            <Ref>J Sci Med Sport 21(12):1221-1225 · <a href="https://pubmed.ncbi.nlm.nih.gov/29853263/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Reed &amp; Pipe (2014)</strong> 말하기 테스트는 타당하고 믿을 만한 강도 기준이에요.
            <Ref>Curr Opin Cardiol 29(5):475-80 · <a href="https://pubmed.ncbi.nlm.nih.gov/25010379/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={6}>
            <strong>Bok et al. (2022)</strong> 몸의 느낌으로 강도를 나누는 방법들을 검토한 고찰이에요.
            <Ref>Sports Med 52(9):2085-2109 · <a href="https://pubmed.ncbi.nlm.nih.gov/35507232/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={7}>
            <strong>Morton &amp; Callister (2015)</strong> 러너의 약 70%가 1년 안에 옆구리 통증을 겪었어요.
            <Ref>Sports Med 45(1):23-35 · <a href="https://pubmed.ncbi.nlm.nih.gov/25178498/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={8}>
            <strong>Buist et al. (2008)</strong> 10% 규칙 13주와 일반 8주의 부상률은 20.8% 대 20.3%였어요.
            <Ref>Am J Sports Med 36(1):33-9 · <a href="https://pubmed.ncbi.nlm.nih.gov/17940147/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={9}>
            <strong>Frandsen et al. (2025)</strong> 30일 최장 거리보다 10% 넘게 길게 뛴 날 부상이 늘었어요(5,205명).
            <Ref>Br J Sports Med 59(17):1203-1210 · <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={10}>
            <strong>Nielsen et al. (2014)</strong> BMI 30 초과면 첫 주를 3km 미만으로 권했어요(초보 749명).
            <Ref>Int J Sports Phys Ther 9(3):338-45 · <a href="https://pubmed.ncbi.nlm.nih.gov/24944852/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={11}>
            <strong>Saragiotto et al. (2014)</strong> 지난 12개월 안의 부상이 가장 일관된 위험 요인이었어요.
            <Ref>Sports Med 44(8):1153-63 · <a href="https://pubmed.ncbi.nlm.nih.gov/24809248/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={12}>
            <strong>Nielsen et al. (2014)</strong> 다친 초보 254명 중 정강이 15%, 무릎 앞 10%였어요.
            <Ref>PLOS ONE 9(6):e99877 · <a href="https://doi.org/10.1371/journal.pone.0099877" target="_blank" rel="noopener noreferrer">DOI</a></Ref>
          </Src>
          <Src n={13}>
            <strong>Fokkema et al. (2019)</strong> 예방 정보를 받은 쪽과 안 받은 쪽의 부상률은 37.5% 대 36.7%였어요.
            <Ref>Br J Sports Med 53(23):1479-1485 · <a href="https://pubmed.ncbi.nlm.nih.gov/30954948/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={14}>
            <strong>Herbert et al. (2011)</strong> 스트레칭은 근육통을 임상적으로 의미 있게 줄이지 못했어요.
            <Ref>Cochrane Database Syst Rev (7):CD004577 · <a href="https://pubmed.ncbi.nlm.nih.gov/21735398/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={15}>
            <strong>Relph et al. (2022)</strong> 발 모양에 맞춰 고른 신발도 부상에 거의 차이가 없었어요.
            <Ref>Cochrane Database Syst Rev · <a href="https://pubmed.ncbi.nlm.nih.gov/35993829/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
