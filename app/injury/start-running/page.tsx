import type { Metadata } from "next";
import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Up, S } from "@/components/guide/Up";
import { Lead, P, H2, H3, Summary, Todo, Evidence, References, Basis, Warn, Note } from "@/components/guide/Read";
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
 * 2026-10-13 가독성 재설계 — "글자가 너무 많아서 읽히지가 않는다". 섹션마다 답 → 할 일 → 근거(접힘).
 *   사실·숫자는 지우지 않고 <Evidence> 안으로 옮겼다. 멈출 신호는 접지 않는다. 참고 문헌은 기본 접힘.
 *   「경험칙」 → 「저희 제안」 배지(components/guide/Read.tsx).
 *
 * 2026-10-13 진도표(WALK_RUN)를 lib/guide/walkRun.ts 로 옮겼다 — /tools/run-30(따라 하기 플랜)과 같은 표를 쓰게.
 *   표 글자는 옮기기 전과 한 글자씩 같다(대조함). 표 바로 아래 「이 표대로 따라 하기 →」 버튼.
 */

const PAGE_URL = pageUrl("/injury/start-running");
const TITLE = "처음 달리기 — 30분 쉬지 않고 뛰기까지";
const DESC =
  "처음 달리기를 시작한 사람 거의 3명 중 1명이 반년 안에 그만둡니다. 가장 큰 이유는 부상. 속도·진도·긴 날·멈출 신호를 논문 수치로 정리했습니다.";

export const metadata: Metadata = {
  title: `달리기 처음 시작하는 법 — 30분 쉬지 않고 뛰기까지 | 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/start-running" },
};

// 진도표는 lib/guide/walkRun.ts 가 단일 출처 — /tools/run-30 과 같은 표를 쓴다 (2026-10-13)

const FAQ: FaqItem[] = [
  {
    q: "처음엔 하루에 얼마나, 일주일에 몇 번 달려야 하나요?",
    a: "연구로 정해진 최적값은 찾지 못했습니다. 저희는 걷기를 섞어 20~30분, 주 3회, 달리는 날 사이 하루 쉬기를 기본으로 둡니다. 다음 단계로 넘어가는 기준은 횟수가 아니라 '달리는 동안 대화가 됐는가'와 '다음 날 통증이 없는가'입니다.",
  },
  {
    q: "10% 규칙을 지켜야 하나요?",
    a: "6.7km 대회를 준비하는 초보 532명을 일반 8주 프로그램과 10% 규칙 기반 13주 프로그램으로 나눈 무작위 시험에서 부상률은 20.3%와 20.8%로 차이가 없었습니다(Buist 2008). 숫자 하나보다, 한 번에 길게 뛰는 날을 지난 30일 최장 거리의 110% 안에서 늘리고 다음 날 통증을 확인하는 쪽이 근거가 있습니다.",
  },
  {
    q: "조금만 뛰어도 숨이 너무 차요.",
    a: "속도가 빠른 것입니다. 짧은 문장을 끊지 않고 편하게 말할 수 있는 속도(말하기 테스트)가 처음엔 기준입니다. 걷는 속도와 비슷해져도 괜찮고, 그래도 숨이 차면 걷기 구간을 늘립니다.",
  },
  {
    q: "달리면 옆구리가 결려요.",
    a: "흔합니다. 러너의 약 70%가 지난 1년 사이 겪었다고 답했고, 대회 한 번에 약 5명 중 1명이 겪습니다(Morton & Callister 2015). 먹은 직후, 특히 진한 음료 뒤에 심해집니다. 달리기 2시간 전에는 많이 먹고 마시지 않는 것이 흔한 조언이지만, 관리법 대부분은 아직 경험담 수준입니다.",
  },
  {
    q: "체중이 많이 나가도 달리기를 시작해도 되나요?",
    a: "됩니다. 다만 시작 첫 주의 양을 낮게 잡으세요. 초보 749명을 3주 관찰한 연구에서 BMI 30 초과인 사람이 첫 주에 3km 넘게 달리면 부상이 더 많았고, 저자들은 첫 주 3km 미만으로 시작하라고 권했습니다(Nielsen 2014). 탐색적 연구라 더 큰 연구로 확인이 필요합니다.",
  },
];

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
        <Lead>
          처음 달리기를 시작한 사람이 그만두는 가장 큰 이유는 체력이 아니라 <strong>부상</strong>입니다. 아프지 않게 30분까지 가는
          방법만 추렸습니다.
        </Lead>

        <Summary
          items={[
            <>속도는 <strong>말하면서 뛸 수 있을 만큼</strong>. 숨이 차면 걸어도 됩니다.<Basis kind="paper" /></>,
            <>걷기와 달리기를 섞어 시작하고, <strong>다음 날 아프지 않을 때만</strong> 다음 단계로.<Basis kind="rule" /></>,
            <>가장 오래 뛰는 날은 <strong>지난 한 달 중 가장 오래 뛴 날의 110%까지만</strong>.<Basis kind="rule" /></>,
            <>걸음이 바뀔 만큼 아프면 <strong>그날은 멈춥니다.</strong><Basis kind="rule" /></>,
          ]}
        />

        <TableOfContents
          items={[
            { id: "why-stop", label: "왜 금방 그만두게 될까" },
            { id: "pace", label: "숨이 너무 차요" },
            { id: "progression", label: "걷기·달리기 진도표" },
            { id: "long-day", label: "긴 날은 얼마나 늘릴까" },
            { id: "pain", label: "이러면 멈추세요" },
            { id: "stitch", label: "옆구리가 결려요" },
            { id: "not-proven", label: "효과가 확인 안 된 것" },
            { id: "next", label: "다음 단계로" },
          ]}
        />

        {/* ── ① ─────────────────────────────────────────── */}
        <h2 id="why-stop" className={H2}>
          왜 처음엔 금방 그만두게 될까
        </h2>
        <P>
          6주 초보 프로그램 참가자 <strong>거의 셋 중 하나가 반년 안에 그만뒀습니다.</strong> 가장 큰 이유는 부상이었습니다.
        </P>
        <P>같은 시간을 달려도 초보가 더 많이 다칩니다. 숨이 편해졌다고 다리도 준비된 것은 아닙니다.</P>
        <Evidence n={3}>
          <p>
            6주 초보 프로그램 참가자 774명 중 29.5%가 26주 안에 그만뒀고, 그만둔 이유의 48%가 부상이었습니다. 프로그램 뒤에도 계속할지
            확신이 없던 사람은 그만둘 가능성이 약 2배(OR 2.06)였습니다. <S>(Fokkema et al. (2019) <Up h="https://pubmed.ncbi.nlm.nih.gov/29934211/" />)</S>
          </p>
          <p>
            9주 걷기-달리기 프로그램(Couch-to-5k 변형) 참가자 110명 중 끝까지 마친 사람은 27.3%. 19%가 부상을 보고했고, 예전에 다친
            적이 있으면 새 부상 오즈가 7.56배였습니다. 그만둔 사람들은 부상·부정적 감정·프로그램 설계를 이유로 들었고, 저자들은 더 유연한
            설계를 권했습니다. 표본이 작은 연구입니다. <S>(Relph et al. (2023) <Up h="https://pubmed.ncbi.nlm.nih.gov/37681822/" />)</S>
          </p>
          <p>
            13개 연구를 모은 메타분석에서 달린 시간 1,000시간당 부상은 초보 17.8건, 취미 러너 7.7건이었습니다. 부상 정의가 연구마다
            달라 정확한 배수보다는 방향으로 읽으세요. <S>(Videbæk et al. (2015) <Up h="https://pubmed.ncbi.nlm.nih.gov/25951917/" />)</S>
          </p>
        </Evidence>

        <h3 className={H3}>정해진 프로그램을 따를까, 내 마음대로 할까</h3>
        <P>
          <strong>순서는 프로그램을 따르고, 다음 단계로 넘어가는 날은 몸 상태로 정하세요.</strong>
          <Basis kind="rule" />
        </P>
        <P>
          파크런 러너 설문에서는 스스로 짠 계획이 부상이 더 많았고, 반대로 한 소규모 걷기-달리기 연구에서는 정해진 진도가 중간에
          그만두는 것과 관련이 있었습니다. 연구끼리 엇갈려서, 두 결과를 합친 저희 결론입니다.
        </P>
        <Evidence n={2}>
          <p>
            영국 파크런 러너 1,145명 설문에서 달리기 첫해에 스스로 짠 계획을 따른 사람이 Couch to 5K 같은 정해진 프로그램을 따른
            사람보다 부상이 많았습니다. <S>(Linton & Valentin (2018) <Up h="https://pubmed.ncbi.nlm.nih.gov/29853263/" />)</S>
          </p>
          <p>
            반면 위 걷기-달리기 연구에서는 정해진 진도가 중도 포기와 관련이 있었습니다. <S>(Relph et al. (2023) <Up h="https://pubmed.ncbi.nlm.nih.gov/37681822/" />)</S>
          </p>
        </Evidence>

        {/* ── ② ─────────────────────────────────────────── */}
        <h2 id="pace" className={H2}>
          숨이 너무 차요 — 속도는 대화가 될 만큼
        </h2>
        <P>
          처음엔 &lsquo;숨이 찰 만큼 뛰어야 운동&rsquo;이라고 생각하기 쉽습니다. 기준은 반대입니다.{" "}
          <strong>짧은 문장을 끊지 않고 말할 수 있는 속도</strong>로 뛰세요. 이걸 &lsquo;말하기 테스트&rsquo;라고 합니다.
        </P>
        <Todo
          basis="rule"
          items={[
            "말이 단어 단위로 끊기면 걷습니다. 숨이 돌아오면 다시 뜁니다.",
            "걷는 속도와 비슷해져도 괜찮습니다. 처음엔 속도보다 시간입니다.",
            "심박계는 없어도 됩니다.",
          ]}
        />
        <Evidence n={2}>
          <p>
            짧은 문장을 편하게 말할 수 있으면 대략 숨이 갑자기 가빠지기 시작하는 지점(환기역치) 아래이고, 말이 편하지 않으면 그 위입니다.
            건강한 성인부터 심장질환자, 선수까지 타당하고 재현성 있는 방법으로 평가됩니다.{" "}
            <S>(Reed & Pipe (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/25010379/" />)</S>
          </p>
          <p>
            운동 강도를 나누는 주관적 방법들을 검토한 고찰도 말하기 테스트가 환기역치를 가려내는 데 타당하다고 봤습니다.{" "}
            <S>(Bok et al. (2022) <Up h="https://pubmed.ncbi.nlm.nih.gov/35507232/" />)</S>
          </p>
        </Evidence>

        {/* ── ③ ─────────────────────────────────────────── */}
        <h2 id="progression" className={H2}>
          걷기와 달리기를 섞어서 — 8단계 진도표
        </h2>
        <P>
          A부터 차례로 합니다. 앞뒤로 5분씩 걷고, <strong>주 3회</strong>, 달리는 날 사이에 하루 쉽니다.
        </P>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-[15px]">
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
          className="mt-4 flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-center text-[15px] font-semibold text-white break-keep hover:bg-emerald-700"
        >
          이 표대로 따라 하기 →
        </Link>

        <Todo
          title="다음 단계로 넘어가는 조건"
          basis="rule"
          items={[
            <>같은 단계를 3번 해서 <strong>① 달리는 동안 대화가 됐고 ② 다음 날 아침 아프지 않으면</strong> 다음 단계로.</>,
            "하나라도 아니면 같은 단계를 반복합니다.",
            "두 번 반복해도 안 되면 한 단계 내려갑니다.",
            "H까지 최소 8주. 더 걸려도 정상입니다.",
          ]}
        />
        <P className="text-sm text-gray-500">
          이 표와 조건은 저희 예시입니다. 특정 진도표나 &lsquo;주 3회가 최적&rsquo;이라는 근거는 찾지 못했습니다.
        </P>
        <Evidence n={1} label="기간을 길게 잡으면 덜 다칠까?">
          <p>
            &lsquo;천천히 늘리면 안 다친다&rsquo;도 생각만큼 단순하지 않습니다. 6.7km 대회를 준비하는 초보 532명을 일반 8주 프로그램과
            10% 규칙에 맞춘 13주 프로그램으로 나눴더니 부상률은 20.3% 대 20.8%로 차이가 없었습니다.{" "}
            <S>(Buist et al. (2008) <Up h="https://pubmed.ncbi.nlm.nih.gov/17940147/" />)</S> 그래서 기간보다, 지금 단계를 몸이
            받아들였는지 확인하고 넘어가는 쪽에 무게를 둡니다.
          </p>
        </Evidence>

        {/* ── ④ ─────────────────────────────────────────── */}
        <h2 id="long-day" className={H2}>
          가장 길게 뛰는 날은 얼마나 늘려도 될까
        </h2>
        <P>
          저희 기준은 <strong>지난 30일 중 가장 길게 뛴 기록의 110%</strong>까지입니다. <Basis kind="rule" />
        </P>
        <P>성인 러너를 따라간 한 관찰 연구에서, 그보다 길게 뛴 날에 부상이 더 많았습니다.</P>
        <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-[15px] leading-[1.7] text-emerald-900">
          예) 지난 한 달 가장 오래 달린 날이 <strong>20분</strong> → 다음 긴 날은 <strong>22분까지</strong>.
        </div>
        <Evidence n={1}>
          <p>
            성인 러너 5,205명(평균 45.8세)의 가민 기록 58만여 회를 18개월 동안 따라간 연구에서, 한 번 달린 거리가 지난 30일 중 가장 긴
            거리보다 10% 넘게 길면 과사용 부상 비율이 올라갔습니다 — 10~30% 길면 1.64배, 30~100% 1.52배, 두 배가 넘으면 2.28배. 반면
            전주 대비 주간 거리 비율은 부상과 관계가 없었습니다.{" "}
            <S>(Frandsen et al. (2025) <Up h="https://pubmed.ncbi.nlm.nih.gov/40623829/" />)</S>
          </p>
        </Evidence>
        <Note>초보만 모은 연구가 아니고(평균 45.8세), 연구는 거리로 쟀습니다. 시간으로 바꿔 쓰는 것은 저희의 단순화입니다.</Note>

        <h3 className={H3}>체중이 많이 나간다면 첫 주는 더 적게</h3>
        <P>
          시작해도 됩니다. 연구진은 BMI 30이 넘으면 <strong>첫 주를 3km 미만</strong>으로 시작하라고 권했습니다.
        </P>
        <Note>3주만 관찰한 탐색적 연구라, 저자들도 더 큰 연구로 확인이 필요하다고 적었습니다.</Note>
        <Evidence n={1}>
          <p>
            초보 749명을 3주 관찰한 연구에서 BMI 30 초과인 사람이 첫 주에 3~6km를 달리면 부상 위험이 14.3%p, 6km를 넘기면 16.2%p
            높았습니다(비교 기준: BMI 30 이하·첫 주 3km 미만). 저자들은 BMI 30 초과라면 첫 주를 3km 미만으로 시작하라고 권했고, 탐색적
            연구라 더 큰 연구가 필요하다고 적었습니다. <S>(Nielsen et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/24944852/" />)</S>
          </p>
        </Evidence>

        {/* ── ⑤ ─────────────────────────────────────────── */}
        <h2 id="pain" className={H2}>
          아플 때 — 이러면 그날은 멈추세요
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
          아파도 참고 뛰는 사람이 대부분입니다. 하지만 <strong>최근 1년 안에 다친 적이 있으면 또 다치기 쉽습니다.</strong>
        </P>
        <P>
          처음 달리는 사람이 많이 아픈 곳은 정강이와 무릎 앞입니다. 위치별로 멈출 신호와 대처를 따로 정리했습니다.
        </P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/shin-splints" className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400">정강이 통증 →</Link>
          <Link href="/injury/knee-pain" className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400">무릎 앞 통증 →</Link>
          <Link href="/injury/plantar-fasciitis" className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400">발바닥 통증 →</Link>
        </div>
        <Evidence n={3}>
          <p>
            파크런 러너 설문에서 지금 부상이 있는 570명 중 86%가 통증을 안고, 기록이 떨어지고 거리를 줄여 가면서도 달리고 있었습니다.{" "}
            <S>(Linton & Valentin (2018) <Up h="https://pubmed.ncbi.nlm.nih.gov/29853263/" />)</S>
          </p>
          <p>
            지난 12개월 안의 부상은 여러 전향 연구에서 가장 일관된 부상 위험 요인이었습니다.{" "}
            <S>(Saragiotto et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/24809248/" />)</S>
          </p>
          <p>
            부상당한 초보 254명 중 정강이 통증 15%, 무릎 앞(슬개대퇴) 통증 10%.{" "}
            <S>(Nielsen et al. (2014) <Up h="https://doi.org/10.1371/journal.pone.0099877" />)</S>
          </p>
        </Evidence>

        {/* ── ⑥ ─────────────────────────────────────────── */}
        <h2 id="stitch" className={H2}>
          옆구리가 결려요
        </h2>
        <P>흔한 일입니다. 먹은 직후, 특히 진한 음료를 마신 뒤에 심해집니다.</P>
        <Todo
          basis="rule"
          items={["달리기 2시간 전에는 많이 먹고 마시지 않습니다.", "결리면 속도를 줄이거나 걷습니다."]}
        />
        <P className="text-sm text-gray-500">예방법·완화법 대부분은 아직 경험담 수준이고, 결렸을 때 푸는 방법은 근거가 엇갈립니다.</P>
        <Evidence n={1}>
          <p>
            러너의 약 70%가 지난 1년 사이 겪었다고 답했고, 대회 한 번에 약 5명 중 1명이 겪습니다. 먹은 직후, 특히 진한(고장성) 음료를
            마신 뒤에 심해집니다. 흔히 권하는 예방법은 달리기 2시간 전 많은 음식·음료 피하기, 상체 자세, 코어 강화인데 관리법 대부분은
            아직 경험담 수준이고 통증 중 완화법은 근거가 엇갈립니다. 잘 훈련된 선수도 겪지만 빈도는 낮은 편입니다.{" "}
            <S>(Morton & Callister (2015) <Up h="https://pubmed.ncbi.nlm.nih.gov/25178498/" />)</S>
          </p>
        </Evidence>

        {/* ── ⑦ ─────────────────────────────────────────── */}
        <h2 id="not-proven" className={H2}>
          해도 되지만 효과가 확인 안 된 것
        </h2>
        <ul className="mt-4 space-y-3 break-keep text-base leading-[1.8]">
          <li>
            <strong>주간 거리 10% 규칙</strong> — 한 무작위 시험에서 부상을 줄이지 못했습니다. (위의 110%는 &lsquo;가장 긴 하루&rsquo;
            기준이라 다른 이야기입니다.)
          </li>
          <li>
            <strong>예방 정보를 읽기만 하기</strong> — 한 무작위 시험에서 부상이 줄지 않았습니다. 이 글도 마찬가지입니다. 위 기준을
            지키면 줄어드는지도 아직 시험되지 않았습니다.
          </li>
          <li>
            <strong>스트레칭으로 근육통 막기</strong> — 근거가 약합니다 →{" "}
            <Link href="/injury/cooldown" className="text-emerald-700 underline">쿨다운 글</Link>
          </li>
          <li>
            <strong>비싼 신발로 부상 막기</strong> — 근거가 약합니다. 발볼과 사이즈부터 →{" "}
            <Link href="/injury/wide-foot" className="text-emerald-700 underline">발볼 재는 법</Link>
          </li>
        </ul>
        <Evidence n={2}>
          <p>
            10% 규칙에 맞춘 13주 프로그램과 일반 8주 프로그램의 부상률은 20.8% 대 20.3%였습니다.{" "}
            <S>(Buist et al. (2008) <Up h="https://pubmed.ncbi.nlm.nih.gov/17940147/" />)</S>
          </p>
          <p>
            대회 참가자 2,378명을 무작위로 나눠 한쪽에만 온라인 예방 프로그램(위험 요인 정보와 조언)을 줬더니 부상률은 37.5% 대
            36.7%였습니다. <S>(Fokkema et al. (2019) <Up h="https://pubmed.ncbi.nlm.nih.gov/30954948/" />)</S>
          </p>
        </Evidence>

        <FinderCta
          from="start-running"
          variant="inline"
          headline="첫 신발은 발볼·사이즈가 맞는지가 먼저입니다. 발볼·발 타입으로 좁혀 보세요."
        />

        {/* ── 다음 ─────────────────────────────────────────── */}
        <h2 id="next" className={H2}>
          다음 단계로
        </h2>
        <P>
          대화가 되는 속도로 <strong>30분을 쉬지 않고</strong> 달렸고, <strong>다음 날 아프지 않고</strong>, 그걸 주 2~3회씩 2주 넘게
          유지했다면 2단계(30분 → 10km)입니다. <Basis kind="rule" />
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

        <References n={13} note="2026-10-06 PubMed 초록과 대조했습니다.">
          <ul>
          <li>
            <strong>Fokkema et al. (2019)</strong> — 6주 초보 프로그램 774명, 26주 안 중단 29.5%·이유 1위 부상. J Sci Med Sport
            22(1):106-111. <a href="https://pubmed.ncbi.nlm.nih.gov/29934211/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Relph et al. (2023)</strong> — 9주 Couch-to-5k 변형 110명, 완주 27.3%·부상 19%. Int J Environ Res Public Health
            20(17):6682. <a href="https://pubmed.ncbi.nlm.nih.gov/37681822/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Videbæk et al. (2015)</strong> — 1,000시간당 부상 메타분석, 초보 17.8·레크리에이션 7.7. Sports Med
            45(7):1017-26. <a href="https://pubmed.ncbi.nlm.nih.gov/25951917/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Linton &amp; Valentin (2018)</strong> — 파크런 러너 1,145명 설문, 부상 중 86% 계속 달림. J Sci Med Sport
            21(12):1221-1225. <a href="https://pubmed.ncbi.nlm.nih.gov/29853263/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Reed &amp; Pipe (2014)</strong> — 말하기 테스트의 타당도·신뢰도 고찰. Curr Opin Cardiol 29(5):475-80.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/25010379/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Bok et al. (2022)</strong> — 말하기 테스트·RPE 등 주관적 강도 판정법 고찰. Sports Med 52(9):2085-2109.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/35507232/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Buist et al. (2008)</strong> — 초보 532명 무작위 시험, 10% 규칙 13주 대 일반 8주 부상률 20.8% 대 20.3%. Am J Sports
            Med 36(1):33-9. <a href="https://pubmed.ncbi.nlm.nih.gov/17940147/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Frandsen et al. (2025)</strong> — 5,205명 18개월, 30일 최장 거리 대비 10% 초과 시 부상 증가. Br J Sports Med
            59(17):1203-1210. <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Nielsen et al. (2014)</strong> — 초보 749명 3주, BMI 30 초과·첫 주 3km 초과 시 부상 증가. Int J Sports Phys Ther
            9(3):338-45. <a href="https://pubmed.ncbi.nlm.nih.gov/24944852/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Nielsen et al. (2014)</strong> — 부상당한 초보 254명의 회복 기간, 부상 종류별 비율. PLOS ONE 9(6):e99877.{" "}
            <a href="https://doi.org/10.1371/journal.pone.0099877" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">DOI →</a>
          </li>
          <li>
            <strong>Saragiotto et al. (2014)</strong> — 전향 코호트 11편 체계적 고찰, 주된 위험 요인은 지난 12개월 부상. Sports Med
            44(8):1153-63. <a href="https://pubmed.ncbi.nlm.nih.gov/24809248/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Morton &amp; Callister (2015)</strong> — 운동 중 옆구리 통증(ETAP) 고찰. Sports Med 45(1):23-35.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/25178498/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Fokkema et al. (2019)</strong> — 온라인 부상 예방 프로그램 무작위 시험 2,378명, 37.5% 대 36.7%. Br J Sports Med
            53(23):1479-1485. <a href="https://pubmed.ncbi.nlm.nih.gov/30954948/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          </ul>
        </References>
        <p className="mt-6 text-xs text-gray-400">※ 이 글은 의학적 진단을 대체하지 않습니다. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
    </>
  );
}
