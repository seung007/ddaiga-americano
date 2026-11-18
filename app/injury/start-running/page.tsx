import type { Metadata } from "next";
import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, H3, Basis, Warn, Caveat, Num, KeyPoints, Steps, OneLine, Sources, Src, Found } from "@/components/guide/Read";
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

// 3줄 요약에는 「연구 근거·저희 제안」 표시를 달지 않는다 — 390px 에서 표시만 따로 줄을 차지했다(2026-11-18 화면 확인). 같은 표시는 각 절 본문에 그대로 있다.
// 진도표는 lib/guide/walkRun.ts 가 단일 출처 — /tools/run-30 과 같은 표를 쓴다 (2026-10-13)

const FAQ: FaqItem[] = [
  {
    q: "처음엔 하루에 얼마나, 일주일에 몇 번 달려야 하나요?",
    a: "연구로 정해진 최적값은 찾지 못했어요. 저희는 걷기를 섞어 20~30분, 주 3회, 달리는 날 사이 하루 쉬기를 기본으로 둬요. 다음 단계로 넘어가는 기준은 횟수가 아니라, 달리는 동안 대화가 됐는지와 다음 날 통증이 없는지예요.",
  },
  {
    q: "10% 규칙을 지켜야 하나요?",
    a: "일반 8주 프로그램과 10% 규칙 기반 13주 프로그램의 부상률은 20.3%와 20.8%로 차이가 없었어요. 6.7km 대회를 준비하는 초보 532명을 무작위로 나눈 시험이에요. 숫자 하나보다 근거가 있는 쪽은 한 번에 길게 뛰는 날을 지난 30일 최장 거리의 110% 안에서 늘리고 다음 날 통증을 확인하는 방법이에요.",
  },
  {
    q: "조금만 뛰어도 숨이 너무 차요.",
    a: "속도가 빠른 거예요. 처음엔 짧은 문장을 끊지 않고 편하게 말할 수 있는 속도가 기준이에요. 이걸 말하기 테스트라고 해요. 걷는 속도와 비슷해져도 괜찮아요. 그래도 숨이 차면 걷기 구간을 늘려요.",
  },
  {
    q: "달리면 옆구리가 결려요.",
    a: "흔해요. 러너의 약 70%가 지난 1년 사이 겪었다고 답했어요. 대회 한 번에는 약 5명 중 1명이 겪어요. 먹은 직후, 특히 진한 음료 뒤에 심해져요. 달리기 2시간 전에는 많이 먹고 마시지 않는 것이 흔한 조언이에요. 다만 관리법 대부분은 아직 경험담 수준이에요.",
  },
  {
    q: "체중이 많이 나가도 달리기를 시작해도 되나요?",
    a: "돼요. 다만 시작 첫 주의 양을 낮게 잡으세요. BMI 30 초과인 사람이 첫 주에 3km 넘게 달리면 부상이 더 많았어요(초보 749명 3주 관찰). 저자들은 첫 주 3km 미만으로 시작하라고 권했어요. 탐색적 연구라 더 큰 연구로 확인이 필요해요.",
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
          <span className="text-xs text-gray-400">4분 읽기</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/start-running" compact />

        <KeyPoints
          items={[
            <>속도는 <strong>말하면서 뛸 수 있을 만큼</strong>이에요. 숨이 차면 걸어도 돼요.</>,
            <>걷기와 달리기를 섞어 늘리고, <strong>다음 날 아프지 않을 때만</strong> 다음 단계로 가요.</>,
            <>걸음이 바뀔 만큼 아프면 <strong>그날은 멈춰요.</strong></>,
          ]}
        />

        <Lead>
          러닝을 막 시작해 조금만 뛰어도 숨이 찬다면, 걸어도 괜찮아요. 처음 시작한 사람이 그만두는 가장 큰 이유는 체력이 아니라{" "}
          <strong>부상</strong>이에요.
        </Lead>

        <TableOfContents
          items={[
            { id: "why-stop", label: "왜 금방 그만두게 될까요?" },
            { id: "pace", label: "숨이 너무 차요" },
            { id: "progression", label: "걷기와 달리기는 어떻게 섞나요?" },
            { id: "pain", label: "어디가 아프면 멈추나요?" },
            { id: "not-proven", label: "효과가 확인 안 된 방법" },
            { id: "next", label: "언제 다음 단계로 가나요?" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="why-stop" className={H2}>
          <Num n={1} />처음 달리면 왜 금방 그만두게 될까요?
        </h2>
        <P>
          <strong>가장 큰 이유는 부상이에요.</strong> 6주 초보 프로그램 참가자 거의 셋 중 하나가 반년 안에 그만뒀어요. 
        </P>
        <P>
          같은 시간을 달려도 초보가 더 많이 다쳐요.  숨이 편해졌다고 다리도 준비된 것은 아니에요.
        </P>

        <h3 className={H3}>정해진 프로그램을 따라야 하나요, 내 마음대로 해도 되나요?</h3>
        <P>
          <strong>순서는 프로그램을 따르고, 다음 단계로 넘어가는 날은 몸 상태로 정하세요.</strong>
          <Basis kind="rule" />
        </P>
        <P>
          스스로 짠 계획은 부상이 더 많았어요.  반대로 정해진 진도는 중간에 그만두는 것과 관련이 있었어요. 
        </P>
        <Caveat>연구끼리 엇갈려서 두 결과를 합친 저희 결론이에요.</Caveat>

        <OneLine>숨보다 다리가 늦게 따라와요. 그래서 처음엔 다치지 않는 것이 먼저예요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="pace" className={H2}>
          <Num n={2} />조금만 뛰어도 숨이 너무 차요, 어떡하나요?
        </h2>
        <P>
          <strong>짧은 문장을 끊지 않고 말할 수 있는 속도</strong>로 뛰세요.  이걸 말하기 테스트라고 해요.
          처음엔 숨이 찰 만큼 뛰어야 운동이 된다고 생각하기 쉽지만 기준은 반대예요.
        </P>
        <Steps
          basis="rule"
          items={[
            { t: "말이 단어 단위로 끊기면 걸어요.", d: "숨이 돌아오면 다시 뛰어요." },
            { t: "걷는 속도와 비슷해져도 괜찮아요.", d: "처음엔 속도보다 시간이에요." },
            { t: "심박계는 없어도 돼요." },
          ]}
        />

        <h3 id="stitch" className={`${H3} scroll-mt-20`}>달리면 옆구리가 결려요, 왜 그런가요?</h3>
        <P>
          흔한 일이에요.  먹은 직후, 특히 진한 음료를 마신 뒤에 심해져요.
        </P>
        <Steps
          basis="rule"
          items={[
            { t: "달리기 2시간 전에는 많이 먹고 마시지 않아요." },
            { t: "결리면 속도를 줄이거나 걸어요." },
          ]}
        />
        <Caveat>예방법과 완화법 대부분은 아직 경험담 수준이에요. 결렸을 때 푸는 방법은 근거가 엇갈려요.</Caveat>

        <OneLine>숨이 찰 만큼이 아니라, 말할 수 있을 만큼 뛰어요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="progression" className={H2}>
          <Num n={3} />걷기와 달리기는 어떻게 섞어서 늘리나요?
        </h2>
        <P>
          아래 8단계 진도표를 A부터 차례로 해요. 앞뒤로 5분씩 걸어요. <strong>주 3회</strong> 하고, 달리는 날 사이에 하루 쉬어요.
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
          title="다음 단계로 넘어가는 조건"
          basis="rule"
          items={[
            { t: "같은 단계를 3번 해요.", d: "달리는 동안 대화가 됐고, 다음 날 아침 아프지 않으면 다음 단계로 가요." },
            { t: "하나라도 아니면 같은 단계를 반복해요." },
            { t: "두 번 반복해도 안 되면 한 단계 내려가요." },
            { t: "H까지 최소 8주예요.", d: "더 걸려도 정상이에요." },
          ]}
        />
        <Caveat>이 표와 조건은 저희 예시예요. 특정 진도표가 낫다거나 주 3회가 가장 좋다는 근거는 찾지 못했어요.</Caveat>
        <P>
          기간을 길게 잡는다고 덜 다치지는 않았어요.  그래서 저희는 기간보다 지금 단계를 몸이 받아들였는지 확인하고 넘어가는 쪽에
          무게를 둬요.
        </P>

        <h3 id="long-day" className={`${H3} scroll-mt-20`}>가장 길게 뛰는 날은 얼마나 늘려도 되나요?</h3>
        <P>
          저희 기준은 <strong>지난 30일 중 가장 길게 뛴 기록의 110%</strong>까지예요. <Basis kind="rule" />
        </P>
        <P>그보다 길게 뛴 날에 부상이 더 많았어요(성인 러너를 따라간 한 관찰 연구). </P>
        <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-base leading-[1.7] text-emerald-900">
          예를 들어 지난 한 달 가장 오래 달린 날이 <strong>20분</strong>이었다면, 다음 긴 날은 <strong>22분까지</strong>예요.
        </div>
        <Caveat>초보만 모은 연구가 아니에요(평균 45.8세). 연구는 거리로 쟀어요. 시간으로 바꿔 쓰는 것은 저희의 단순화예요.</Caveat>

        <h3 className={H3}>체중이 많이 나가도 시작해도 되나요?</h3>
        <P>
          시작해도 돼요. 다만 첫 주는 더 적게 뛰어요. 연구진은 BMI(체질량지수) 30이 넘으면 <strong>첫 주를 3km 미만</strong>으로 시작하라고
          권했어요. 
        </P>
        <Caveat>3주만 관찰한 탐색적 연구라, 저자들도 더 큰 연구로 확인이 필요하다고 적었어요.</Caveat>

        <OneLine>기간이 아니라, 지금 단계를 몸이 받아들였는지 보고 넘어가요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="pain" className={H2}>
          <Num n={4} />어디가 어떻게 아프면 그날은 멈춰야 하나요?
        </h2>
        <Warn title="그날은 멈추는 신호 (저희 기준, 진단 아님)">
          <ul className="list-disc space-y-1 pl-5">
            <li>통증 때문에 걸음걸이가 바뀐다</li>
            <li>다음 날 아침이 전날보다 더 아프다</li>
            <li>뼈의 한 지점을 누르면 콕 집어 아프다, 또는 쉬어도 아프다</li>
            <li>붓거나 열감이 있다</li>
          </ul>
          <p className="mt-2">이런 신호가 며칠 이어지면 진료를 받으세요.</p>
        </Warn>
        <P>
          아파도 참고 뛰는 사람이 대부분이에요.  하지만 <strong>최근 1년 안에 다친 적이 있으면 또 다치기 쉬워요.</strong> 
        </P>
        <P>
          처음 달리는 사람이 많이 아픈 곳은 정강이와 무릎 앞이에요.  위치별 멈출 신호와 대처는 아래 글에 있어요.
        </P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/shin-splints" className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400">정강이 통증 →</Link>
          <Link href="/injury/knee-pain" className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400">무릎 앞 통증 →</Link>
          <Link href="/injury/plantar-fasciitis" className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400">발바닥 통증 →</Link>
        </div>

        <OneLine>걸음이 바뀔 만큼 아프면, 참지 말고 그날은 멈춰요.</OneLine>

        {/* ── 5 ─────────────────────────────────────────── */}
        <h2 id="not-proven" className={H2}>
          <Num n={5} />부상을 막는다는 방법, 다 효과가 있나요?
        </h2>
        <P>아니요. 아래 네 가지는 효과가 없었거나 근거가 약해요.</P>
        <Steps
          title="효과가 없었거나 근거가 약한 방법"
          items={[
            {
              t: "주간 거리 10% 규칙",
              d: (
                <>
                  한 무작위 시험에서 부상을 줄이지 못했어요. 위의 110%는 가장 긴 하루를 보는 기준이라 다른 이야기예요.
                </>
              ),
            },
            {
              t: "예방 정보를 읽기만 하기",
              d: (
                <>
                  한 무작위 시험에서 부상이 줄지 않았어요.  이 글도 마찬가지예요. 위 기준을 지키면 줄어드는지도 아직 시험되지
                  않았어요.
                </>
              ),
            },
            {
              t: "스트레칭으로 근육통 막기",
              d: (
                <>
                  근거가 약해요. 자세한 내용은 <Link href="/injury/cooldown" className={linkCls}>쿨다운 글</Link>에 있어요.
                </>
              ),
            },
            {
              t: "비싼 신발로 부상 막기",
              d: (
                <>
                  근거가 약해요. 발볼과 사이즈부터 보세요. 재는 법은 <Link href="/injury/wide-foot" className={linkCls}>발볼 글</Link>에 있어요.
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

        {/* ── 6 ─────────────────────────────────────────── */}
        <h2 id="next" className={H2}>
          <Num n={6} />언제 다음 단계로 넘어가면 되나요?
        </h2>
        <P>
          대화가 되는 속도로 <strong>30분을 쉬지 않고</strong> 달렸고 <strong>다음 날 아프지 않았고</strong>, 그걸 주 2~3회씩 2주 넘게
          유지했다면 2단계(30분에서 10km까지)로 넘어가요. <Basis kind="rule" />
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

        <Sources note="이 글에 쓴 연구 13편이에요. 2026-10-06 PubMed 초록과 대조했어요.">
          <Src n={1} where="1절">
            <strong>Fokkema et al. (2019)</strong> J Sci Med Sport 22(1):106-111{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/29934211/" target="_blank" rel="noopener noreferrer" className={linkCls}>PubMed ↗</a>
            <Found>
              6주 초보 프로그램 참가자 774명 중 29.5%가 26주 안에 그만뒀어요. 그만둔 이유의 48%가 부상이었어요. 프로그램 뒤에도 계속할지 확신이
              없던 사람은 그만둘 가능성이 약 2배(OR 2.06)였어요.
            </Found>
          </Src>
          <Src n={2} where="1절">
            <strong>Relph et al. (2023)</strong> Int J Environ Res Public Health 20(17):6682{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/37681822/" target="_blank" rel="noopener noreferrer" className={linkCls}>PubMed ↗</a>
            <Found>
              9주 걷기-달리기 프로그램(Couch-to-5k 변형, 참가자 110명)을 끝까지 마친 사람은 27.3%였어요. 19%가 부상을 보고했어요. 예전에 다친
              적이 있는 사람은 끝까지 마치지 못한 경우가 많았어요(오즈비 7.56. 초록은 새 부상 위험으로 적었지만 본문 분석은 완주 여부를
              봤어요). 그만둔 사람들은 부상과 부정적 감정, 프로그램 설계를 이유로 들었고, 정해진 진도가 중도 포기와 관련이 있었어요. 저자들은
              더 유연한 설계를 권했어요. 표본이 작은 연구예요.
            </Found>
          </Src>
          <Src n={3} where="1절">
            <strong>Videbæk et al. (2015)</strong> Sports Med 45(7):1017-26{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/25951917/" target="_blank" rel="noopener noreferrer" className={linkCls}>PubMed ↗</a>
            <Found>
              달린 시간 1,000시간당 부상은 초보 17.8건, 취미 러너 7.7건이었어요(13개 연구를 모은 메타분석). 부상 정의가 연구마다 달라 정확한
              배수보다는 방향으로 읽으세요.
            </Found>
          </Src>
          <Src n={4} where="1절과 4절">
            <strong>Linton &amp; Valentin (2018)</strong> J Sci Med Sport 21(12):1221-1225{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/29853263/" target="_blank" rel="noopener noreferrer" className={linkCls}>PubMed ↗</a>
            <Found>
              영국 파크런 러너 1,145명 설문이에요. 달리기 첫해에 스스로 짠 계획을 따른 사람이 Couch to 5K 같은 정해진 프로그램을 따른
              사람보다 부상이 많았어요. 지금 부상이 있는 570명 중 86%가 통증을 안고 기록이 떨어지고 거리를 줄여 가면서도 달리고 있었어요.
            </Found>
          </Src>
          <Src n={5} where="2절">
            <strong>Reed &amp; Pipe (2014)</strong> Curr Opin Cardiol 29(5):475-80{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/25010379/" target="_blank" rel="noopener noreferrer" className={linkCls}>PubMed ↗</a>
            <Found>
              짧은 문장을 편하게 말할 수 있으면 대략 숨이 갑자기 가빠지기 시작하는 지점(환기역치) 아래예요. 말이 편하지 않으면 그 위예요.
              건강한 성인부터 심장질환자, 선수까지 타당하고 재현성 있는 방법으로 평가돼요.
            </Found>
          </Src>
          <Src n={6} where="2절">
            <strong>Bok et al. (2022)</strong> Sports Med 52(9):2085-2109{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/35507232/" target="_blank" rel="noopener noreferrer" className={linkCls}>PubMed ↗</a>
            <Found>말하기 테스트는 환기역치를 가려내는 데 타당하다고 평가됐어요(운동 강도를 나누는 주관적 방법을 검토한 고찰).</Found>
          </Src>
          <Src n={7} where="2절">
            <strong>Morton &amp; Callister (2015)</strong> Sports Med 45(1):23-35{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/25178498/" target="_blank" rel="noopener noreferrer" className={linkCls}>PubMed ↗</a>
            <Found>
              운동 중 옆구리 통증(ETAP) 고찰이에요. 러너의 약 70%가 지난 1년 사이 겪었다고 답했어요. 대회 한 번에는 약 5명 중 1명이 겪어요.
              먹은 직후, 특히 진한(고장성) 음료를 마신 뒤에 심해져요. 흔히 권하는 예방법은 달리기 2시간 전 많은 음식과 음료 피하기, 상체 자세,
              코어 강화예요. 하지만 관리법 대부분은 아직 경험담 수준이고, 통증 중 완화법은 근거가 엇갈려요. 잘 훈련된 선수도 겪지만 빈도는 낮은
              편이에요.
            </Found>
          </Src>
          <Src n={8} where="3절과 5절">
            <strong>Buist et al. (2008)</strong> Am J Sports Med 36(1):33-9{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/17940147/" target="_blank" rel="noopener noreferrer" className={linkCls}>PubMed ↗</a>
            <Found>
              6.7km 대회를 준비하는 초보 532명을 무작위로 나눴어요. 일반 8주 프로그램과 10% 규칙에 맞춘 13주 프로그램의 부상률은 20.3% 대
              20.8%로 차이가 없었어요.
            </Found>
          </Src>
          <Src n={9} where="3절">
            <strong>Frandsen et al. (2025)</strong> Br J Sports Med 59(17):1203-1210{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer" className={linkCls}>PubMed ↗</a>
            <Found>
              성인 러너 5,205명(평균 45.8세)의 가민 기록 58만여 회를 18개월 동안 추적했어요. 한 번 달린 거리가 지난 30일 중 가장 긴 거리보다
              10% 넘게 길면 과사용 부상 비율이 올라갔어요. 10~30% 길면 1.64배, 30~100%는 1.52배, 두 배가 넘으면 2.28배였어요. 반면 전주 대비
              주간 거리 비율은 부상과 관계가 없었어요.
            </Found>
          </Src>
          <Src n={10} where="3절">
            <strong>Nielsen et al. (2014)</strong> Int J Sports Phys Ther 9(3):338-45{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/24944852/" target="_blank" rel="noopener noreferrer" className={linkCls}>PubMed ↗</a>
            <Found>
              초보 749명을 3주 관찰했어요. BMI 30 초과인 사람이 첫 주에 3~6km를 달리면 부상 위험이 14.3%p, 6km를 넘기면 16.2%p 높았어요(비교
              기준은 BMI 30 이하이면서 첫 주 3km 미만). 저자들은 BMI 30 초과라면 첫 주를 3km 미만으로 시작하라고 권했어요. 탐색적 연구라 더
              큰 연구가 필요하다고도 적었어요.
            </Found>
          </Src>
          <Src n={11} where="4절">
            <strong>Saragiotto et al. (2014)</strong> Sports Med 44(8):1153-63{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/24809248/" target="_blank" rel="noopener noreferrer" className={linkCls}>PubMed ↗</a>
            <Found>전향 코호트 11편 체계적 고찰이에요. 지난 12개월 안의 부상이 여러 전향 연구에서 가장 일관된 부상 위험 요인이었어요.</Found>
          </Src>
          <Src n={12} where="4절">
            <strong>Nielsen et al. (2014)</strong> PLOS ONE 9(6):e99877{" "}
            <a href="https://doi.org/10.1371/journal.pone.0099877" target="_blank" rel="noopener noreferrer" className={linkCls}>DOI ↗</a>
            <Found>부상당한 초보 254명 중 정강이 통증이 15%, 무릎 앞(슬개대퇴) 통증이 10%였어요. 부상 종류별 회복 기간도 봤어요.</Found>
          </Src>
          <Src n={13} where="5절">
            <strong>Fokkema et al. (2019)</strong> Br J Sports Med 53(23):1479-1485{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/30954948/" target="_blank" rel="noopener noreferrer" className={linkCls}>PubMed ↗</a>
            <Found>
              대회 참가자 2,378명을 무작위로 나눴어요. 온라인 예방 프로그램(위험 요인 정보와 조언)을 받은 쪽과 받지 않은 쪽의 부상률은 37.5%
              대 36.7%였어요.
            </Found>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
