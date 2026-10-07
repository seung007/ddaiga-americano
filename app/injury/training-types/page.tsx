import type { Metadata } from "next";
import Link from "next/link";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Up, S } from "@/components/guide/Up";

/**
 * 훈련 종류 한눈에 (2026-10-07)
 *
 * 사용자 요청: "쉬다가 다시 달릴 때 어떻게 해야 하는지, 걷고 뛰고 하는 훈련 등 다양한 훈련이 있잖아 —
 * 인터벌 등 그것도 한 페이지로 따로 분류해서 알려주자."
 *
 * 단계 글(start-running … get-faster)이 「언제 무엇이 막히나」라면 이 글은 「도구 상자」다.
 * 훈련마다 같은 틀 — 무엇 / 근거 / 이렇게(사이트 예시) / 몇 단계부터 — 로 적는다.
 *
 * 규칙
 *   · 근거가 러너가 아닌 사람(건강한 성인·잘 훈련된 선수)에게서 나왔으면 그렇게 적는다.
 *   · 연구를 찾지 못한 훈련(파틀렉·스트라이드 단독)은 「연구 못 찾음」이라고 적는다. 빈칸을 숨기지 않는다.
 *   · 강도 구분은 말하기 테스트 3단계로 통일한다(Bok 2022: 애매한 단계 ≈ 환기역치, 말이 안 되는 단계 ≈ 호흡보상점).
 *   · 세트·거리 예시는 전부 사이트 예시.
 */

const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/training-types";
const TITLE = "러닝 훈련 종류 — 쉬었다 다시 달리기부터 인터벌까지";
const DESC =
  "쉬었다 다시 달릴 때, 걷기-달리기, 쉬운 달리기, 장거리, 템포, 인터벌, 언덕, 크로스 트레이닝, 근력운동까지. 훈련마다 무엇인지, 연구가 확인한 것, 실제로 하는 법, 몇 단계부터인지 정리했습니다.";

export const metadata: Metadata = {
  title: "러닝 훈련 종류 총정리 — 인터벌·템포·LSD·걷뛰기·복귀, 논문 기준 | 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/training-types" },
};

type Row = { id: string; name: string; what: string; stage: string; evidence: "중간" | "약함" | "못 찾음" | "관찰" };
const OVERVIEW: Row[] = [
  { id: "restart", name: "쉬었다 다시 달리기", what: "끊긴 뒤 안전하게 되돌아가기", stage: "모든 단계", evidence: "관찰" },
  { id: "run-walk", name: "걷기-달리기", what: "달리기와 걷기를 번갈아", stage: "1단계·풀코스", evidence: "약함" },
  { id: "easy", name: "쉬운 달리기", what: "대화가 되는 속도로 오래", stage: "모든 단계", evidence: "중간" },
  { id: "long", name: "장거리(LSD)", what: "주에 한 번 가장 길게", stage: "2단계부터", evidence: "관찰" },
  { id: "tempo", name: "템포·역치", what: "말이 끊기기 시작하는 속도로 지속", stage: "3단계부터", evidence: "관찰" },
  { id: "interval", name: "인터벌", what: "빠르게 뛰고 쉬기를 반복", stage: "3단계부터", evidence: "중간" },
  { id: "hill", name: "언덕 인터벌", what: "오르막을 빠르게 반복", stage: "4단계부터", evidence: "약함" },
  { id: "strides", name: "스트라이드·점프", what: "짧은 질주와 점프", stage: "3단계부터", evidence: "약함" },
  { id: "fartlek", name: "파틀렉", what: "느낌대로 빠르게·느리게 섞기", stage: "2단계부터", evidence: "못 찾음" },
  { id: "cross", name: "크로스 트레이닝", what: "자전거·물속 달리기로 대체", stage: "부상·휴식 중", evidence: "약함" },
  { id: "strength", name: "근력운동", what: "무거운 하체 운동", stage: "모든 단계", evidence: "중간" },
];

const FAQ: FaqItem[] = [
  {
    q: "한 달 쉬었다가 다시 달리면 얼마나 줄여야 하나요?",
    a: "잘 훈련된 사람도 3주 쉬면 최대산소섭취량이 약 7% 줄었고, 8주쯤 지나 16% 낮은 수준에서 멈췄습니다(Coyle 1984). 최근에 훈련을 시작한 사람은 오래 쉬면 얻은 것을 거의 다 잃습니다(Mujika 2000). 거리는 지난 30일 최장 거리의 110% 안에서 늘리는 것이 근거가 있는 기준입니다(Frandsen 2025). 한 달을 쉬었다면 그 기준이 0에 가까우니 짧게 시작하세요.",
  },
  {
    q: "걷뛰기는 실력이 없어서 하는 건가요?",
    a: "아닙니다. 아마추어 마라토너 42명을 나눈 시험에서 걷기를 섞은 그룹과 계속 달린 그룹의 완주 시간 차이는 통계적으로 없었고, 걷기를 섞은 그룹이 근육 통증과 피로를 덜 느꼈습니다(Hottenrott 2016).",
  },
  {
    q: "인터벌은 언제부터 하면 되나요?",
    a: "정해진 연구 기준은 없습니다. 이 사이트는 대화 속도로 30분 이상을 다치지 않고 꾸준히 뛰는 단계(3단계 이후)를 권합니다. 한 번에 하나만 바꾸세요 — 거리를 늘리는 주에는 인터벌을 새로 넣지 않는 식입니다.",
  },
  {
    q: "템포런과 인터벌은 강도가 어떻게 다른가요?",
    a: "말하기 테스트로 나누면 쉽습니다. 쉬운 달리기는 문장을 편하게 말할 수 있는 속도, 템포는 말이 끊기기 시작하는 애매한 속도, 인터벌은 말을 거의 못 하는 속도입니다. 애매한 단계는 대략 환기역치, 말을 못 하는 단계는 그 위 호흡보상점에 해당한다는 고찰이 있습니다(Bok 2022).",
  },
  {
    q: "파틀렉은 효과가 있나요?",
    a: "파틀렉만 따로 시험한 연구는 찾지 못했습니다. 인터벌과 템포를 정해진 거리 없이 느낌대로 섞는 방식이라, 위 두 훈련의 근거를 빌려 생각하는 수밖에 없습니다.",
  },
];

/** 제목은 호출하는 쪽에 문자열 id 로 직접 적는다 — 목차 검사기(check:toc)가 동적 id 를 판정하지 못한다. */
const H2 = "text-xl font-bold text-gray-900";

function Block({ stage, children }: { stage: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 scroll-mt-20">
      <span className="mb-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{stage}</span>
      <div className="space-y-3 text-[15px] leading-relaxed text-gray-700 [&>h2]:mb-1">{children}</div>
    </section>
  );
}

function How({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900">
      <p className="mb-1 font-semibold">이렇게 (사이트 예시)</p>
      {children}
    </div>
  );
}

export default function TrainingTypesPage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} datePublished="2026-10-07" />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["훈련 종류", "/injury/training-types"],
        ]}
      />
      <article className="mx-auto max-w-2xl px-6 py-12 text-gray-800">
        <Link href="/injury" className="mb-6 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">훈련 방법 · 모든 단계</span>
          <span className="text-xs text-gray-400">11분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight text-gray-900">{TITLE}</h1>

        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">먼저 결론</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-emerald-900">
            <li>
              강도는 <strong>말하기 테스트 3단계</strong>로 나눕니다 — 편하게 말함(쉬운 달리기) · 말이 끊기기 시작(템포) · 말을 거의 못 함(인터벌).
            </li>
            <li>대부분은 쉬운 달리기. 빠른 훈련은 주 1회 정도부터. <strong>한 번에 하나만</strong> 바꿉니다.</li>
            <li>
              쉬었다 돌아올 때 기준은 부상 전 기록이 아니라 <strong>지난 30일 최장 거리의 110%</strong>.
            </li>
            <li>파틀렉·스트라이드 단독처럼 연구를 찾지 못한 훈련도 있습니다. 표에 그대로 적었습니다.</li>
          </ol>
        </div>

        <TableOfContents
          items={[
            { id: "overview", label: "한눈에 보기" },
            { id: "intensity", label: "강도 나누는 법" },
            { id: "restart", label: "쉬었다 다시 달리기" },
            { id: "run-walk", label: "걷기-달리기" },
            { id: "easy", label: "쉬운 달리기" },
            { id: "long", label: "장거리(LSD)" },
            { id: "tempo", label: "템포·역치" },
            { id: "interval", label: "인터벌" },
            { id: "hill", label: "언덕 인터벌" },
            { id: "strides", label: "스트라이드·점프" },
            { id: "fartlek", label: "파틀렉" },
            { id: "cross", label: "크로스 트레이닝" },
            { id: "strength", label: "근력운동" },
            { id: "refs", label: "참고 문헌" },
          ]}
        />

        {/* ── 한눈에 ─────────────────────────────────────────── */}
        <h2 id="overview" className="mt-10 text-xl font-bold text-gray-900">
          한눈에 보기
        </h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2.5">훈련</th>
                <th className="p-2.5">무엇</th>
                <th className="whitespace-nowrap p-2.5">언제부터</th>
                <th className="whitespace-nowrap p-2.5">근거</th>
              </tr>
            </thead>
            <tbody>
              {OVERVIEW.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="p-2.5 font-medium">
                    <a href={`#${r.id}`} className="text-emerald-700 underline">
                      {r.name}
                    </a>
                  </td>
                  <td className="p-2.5 text-gray-700">{r.what}</td>
                  <td className="whitespace-nowrap p-2.5 text-gray-600">{r.stage}</td>
                  <td className="whitespace-nowrap p-2.5 text-gray-600">{r.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          「근거」는 이 사이트의 거친 분류입니다 — 중간: 무작위 시험 메타분석이 있음 · 약함: 작은 시험이나 러너가 아닌 집단 · 관찰: 관찰 연구 ·
          못 찾음: 해당 훈련만 따로 본 연구를 찾지 못함. 「언제부터」의 단계는{" "}
          <Link href="/injury#stages" className="underline">러닝 가이드의 1~5단계</Link>이고 사이트 기준입니다.
        </p>

        {/* ── 강도 ─────────────────────────────────────────── */}
        <h2 id="intensity" className="mt-10 text-xl font-bold text-gray-900">
          강도 나누는 법 — 말하기 테스트 3단계
        </h2>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-lg bg-emerald-50 p-3">
            <p className="font-bold text-emerald-800">쉬움</p>
            <p className="mt-1 text-xs text-emerald-900">문장을 편하게 말함</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-3">
            <p className="font-bold text-amber-800">템포</p>
            <p className="mt-1 text-xs text-amber-900">말이 끊기기 시작</p>
          </div>
          <div className="rounded-lg bg-red-50 p-3">
            <p className="font-bold text-red-800">인터벌</p>
            <p className="mt-1 text-xs text-red-900">말을 거의 못 함</p>
          </div>
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
          주관적 강도 판정법을 검토한 고찰은 말하기 테스트의 &lsquo;애매한&rsquo; 단계가 환기역치를, &lsquo;말이 안 되는&rsquo; 단계가 그 위
          호흡보상점을 반영한다고 봤습니다. 심박계 없이도 강도를 나눌 수 있습니다.{" "}
          <S>(Bok et al. (2022) <Up h="https://pubmed.ncbi.nlm.nih.gov/35507232/" />)</S>{" "}
          심박계가 있다면, 레크리에이션 러너 37명 연구에서 심박으로 정한 저강도 구간이 대회 페이스 비율로 정한 것보다 목표 구간을 더 잘 지켰습니다(85%
          대 69%).{" "}
          <S>(Ranieri et al. (2026) <Up h="https://pubmed.ncbi.nlm.nih.gov/41875873/" />)</S>
        </p>

        {/* ── 쉬었다 다시 ─────────────────────────────────── */}
        <Block stage="모든 단계">
          <h2 id="restart" className={H2}>
            쉬었다 다시 달리기
          </h2>
          <p>
            <strong>얼마나 빠지나.</strong> 지구력 훈련을 오래 한 7명이 운동을 멈추자 최대산소섭취량은 처음 21일에 7% 줄었고, 56일쯤 처음보다
            16% 낮은 수준에서 멈췄습니다. 84일 뒤에도 운동한 적 없는 사람보다는 높았고, 근육의 모세혈관은 줄지 않았습니다.{" "}
            <S>(Coyle et al. (1984) <Up h="https://pubmed.ncbi.nlm.nih.gov/6511559/" />)</S>
          </p>
          <p>
            <strong>누가 더 빠지나.</strong> 4주 넘게 쉬면 선수는 크게 떨어져도 일반인보다 높게 남지만, <strong>최근에 훈련을 시작한 사람은 얻은
            것을 거의 다 잃습니다.</strong> 같은 고찰은 쉬어야 할 때도 강도를 유지하고 빈도만 조금 줄이면 손실을 막거나 줄일 수 있고, 양은 크게
            줄여도 된다고 정리했습니다.{" "}
            <S>(Mujika &amp; Padilla (2000) <Up h="https://pubmed.ncbi.nlm.nih.gov/10999420/" />)</S>
          </p>
          <p>
            <strong>돌아오는 속도.</strong> 한 번 달린 거리가 지난 30일 최장 거리보다 10% 넘게 길면 과사용 부상 비율이 1.52~2.28배였습니다.{" "}
            <S>(Frandsen et al. (2025) <Up h="https://pubmed.ncbi.nlm.nih.gov/40623829/" />)</S>{" "}
            쉬는 동안 최근 30일 최장 거리가 줄어 있으니, 이 기준만 따라도 자연스럽게 짧게 시작하게 됩니다.
          </p>
          <How>
            <ul className="list-disc space-y-1 pl-4">
              <li>1~2주 쉼: 평소 거리의 절반쯤으로 시작해 지난 30일 최장의 110% 안에서 늘림</li>
              <li>3~4주 쉼: 20~30분 쉬운 달리기 주 3회로 시작</li>
              <li>
                1~2달 이상 또는 입문 1년 안: 걷기-달리기부터 →{" "}
                <Link href="/injury/start-running#progression" className="underline">처음 달리기 진도표</Link>
              </li>
              <li>부상으로 쉬었다면 → <Link href="/injury/return-to-running" className="underline">부상 후 복귀</Link></li>
            </ul>
          </How>
        </Block>

        {/* ── 걷기-달리기 ─────────────────────────────────── */}
        <Block stage="1단계 · 풀코스 전략">
          <h2 id="run-walk" className={H2}>
            걷기-달리기
          </h2>
          <p>
            아마추어 마라토너 42명을 걷기를 섞어 달리는 그룹과 계속 달리는 그룹으로 나눴더니, 완주 시간은 4:14:25와 4:07:40으로 통계적 차이가
            없었고 <strong>걷기를 섞은 그룹이 대회 뒤 근육 통증과 피로를 덜 느꼈습니다</strong>. 심장 부담 지표는 두 그룹이 같았습니다.{" "}
            <S>(Hottenrott et al. (2016) <Up h="https://pubmed.ncbi.nlm.nih.gov/25467199/" />)</S>
          </p>
          <p>
            입문자에게는 정해진 순서가 있는 프로그램이 스스로 짠 계획보다 첫해 부상이 적었고(설문 연구), 반대로 진도가 경직되면 중도 포기와
            관련이 있었습니다.{" "}
            <S>(Linton &amp; Valentin (2018) <Up h="https://pubmed.ncbi.nlm.nih.gov/29853263/" />)</S>{" "}
            <S>(Relph et al. (2023) <Up h="https://pubmed.ncbi.nlm.nih.gov/37681822/" />)</S>
          </p>
          <How>
            1분 달리기 + 2분 걷기 × 8에서 시작해, 달리는 구간에서 대화가 되고 다음 날 통증이 없으면 늘립니다 →{" "}
            <Link href="/injury/start-running#progression" className="underline">진도표 A~H</Link>. 풀코스에서는 급수대마다 1분 걷기 같은 식으로 씁니다.
          </How>
        </Block>

        {/* ── 쉬운 달리기 ─────────────────────────────────── */}
        <Block stage="모든 단계">
          <h2 id="easy" className={H2}>
            쉬운 달리기
          </h2>
          <p>
            주간 훈련의 대부분을 차지합니다. 13개 연구 개별 자료 메타분석에서 쉬운 달리기 위주의 두 배분 방식(양극화·피라미드)은 전체로 기록
            차이가 없었고,{" "}
            <S>(Rosenblat et al. (2025) <Up h="https://pubmed.ncbi.nlm.nih.gov/39888556/" />)</S>{" "}
            레크리에이션 러너 30명 10주 시험에서는 쉬운 달리기를 77%로 둔 그룹이 10km 기록을 5.0% 줄였습니다(역치 사이 위주 그룹 3.6%, 차이는
            유의하지 않음).{" "}
            <S>(Muñoz et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/23752040/" />)</S>
          </p>
          <How>말하기 테스트로 &lsquo;편하게 말함&rsquo;. 느리다고 느껴질 만큼. 주 2~3회.</How>
        </Block>

        {/* ── 장거리 ─────────────────────────────────────── */}
        <Block stage="2단계부터">
          <h2 id="long" className={H2}>
            장거리(LSD)
          </h2>
          <p>
            하프 참가자 556명 중 가장 긴 달리기가 21km를 넘은 그룹이 평균 1:51:31로 가장 빨랐고 후반 감속도 적었습니다. 풀 참가자 441명에서는 최장
            25km 미만이 더 느린 완주와 관련 있었습니다. 최장 거리와 부상의 관련은 나타나지 않았습니다(관찰 연구).{" "}
            <S>(Fokkema et al. (2020) <Up h="https://pubmed.ncbi.nlm.nih.gov/32421886/" />)</S>
          </p>
          <How>
            주 1회, 쉬운 속도로. 매번 지난 30일 최장 거리의 110% 안에서 늘리고 4주마다 한 번 줄입니다 →{" "}
            <Link href="/injury/half-marathon-training#ramp" className="underline">하프 예시</Link> ·{" "}
            <Link href="/injury/marathon-training#long-run" className="underline">풀 예시</Link>
          </How>
        </Block>

        {/* ── 템포 ─────────────────────────────────────────── */}
        <Block stage="3단계부터">
          <h2 id="tempo" className={H2}>
            템포·역치
          </h2>
          <p>
            레크리에이션 러너 2,303명 설문에서 템포런은 <strong>짧은 거리일수록</strong> 속도와의 관련이 컸습니다(관찰).{" "}
            <S>(Vickers &amp; Vertosick (2016) <Up h="https://pubmed.ncbi.nlm.nih.gov/27570626/" />)</S>{" "}
            위 10주 시험에서 역치 사이 강도를 35%까지 넣은 그룹도 10km 기록이 3.6% 줄었습니다.
          </p>
          <How>말이 끊기기 시작하는 속도로 15~25분 지속, 또는 8분 × 3(사이 2분 조깅). 주 1회.</How>
        </Block>

        {/* ── 인터벌 ─────────────────────────────────────── */}
        <Block stage="3단계부터">
          <h2 id="interval" className={H2}>
            인터벌
          </h2>
          <p>
            건강한 성인 723명(28개 연구) 메타분석에서 인터벌과 지속주 모두 최대산소섭취량을 크게 올렸고, 인터벌이 평균 1.2 mL/kg/min 더
            올렸습니다.{" "}
            <S>(Milanović et al. (2015) <Up h="https://pubmed.ncbi.nlm.nih.gov/26243014/" />)</S>{" "}
            30초 전력질주를 반복하는 방식(스프린트 인터벌)은 16개 무작위 시험에서 최대산소섭취량을 약 8% 올렸고, 훨씬 적은 운동량으로 지속주와
            비슷한 효과였습니다.{" "}
            <S>(Gist et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/24129784/" />)</S>{" "}
            두 연구 모두 러너만 대상은 아닙니다. 러너 설문에서는 인터벌이 모든 거리에서 속도와 비슷한 크기로 관련 있었습니다.
          </p>
          <How>
            <ul className="list-disc space-y-1 pl-4">
              <li>400m × 6~8 (사이 200m 조깅)</li>
              <li>1km × 4~5 (사이 2~3분 조깅)</li>
              <li>30초 전력 × 4~6 (사이 2~4분 걷기) — 짧고 강한 방식</li>
            </ul>
            <p className="mt-1">말을 거의 못 하는 강도. 앞뒤로 10분씩 쉬운 달리기. 주 1회.</p>
          </How>
        </Block>

        {/* ── 언덕 ─────────────────────────────────────────── */}
        <Block stage="4단계부터">
          <h2 id="hill" className={H2}>
            언덕 인터벌
          </h2>
          <p>
            잘 훈련된 러너 20명을 강도가 다른 다섯 가지 오르막 인터벌로 6주 훈련시켰더니, 강도와 관계없이 5km 기록이 평균 2.0% 줄었고, 가장 높은
            강도에서 러닝 이코노미가 2.4% 좋아졌습니다.{" "}
            <S>(Barnes et al. (2013) <Up h="https://pubmed.ncbi.nlm.nih.gov/23538293/" />)</S>{" "}
            소규모 연구이고 대상이 잘 훈련된 러너입니다.
          </p>
          <How>
            6~8% 오르막에서 30~60초 빠르게 × 6~10, 내려올 때는 걸어서. 내리막을 빠르게 뛰면 무릎 바깥(장경인대)이 자극될 수 있습니다 →{" "}
            <Link href="/injury/it-band#why" className="underline">장경인대 글</Link>
          </How>
        </Block>

        {/* ── 스트라이드·점프 ─────────────────────────────── */}
        <Block stage="3단계부터">
          <h2 id="strides" className={H2}>
            스트라이드·짧은 질주·점프
          </h2>
          <p>
            스트라이드만 따로 시험한 연구는 찾지 못했습니다. 최상위 중장거리 러너(최대산소섭취량 60 이상) 93명을 모은 메타분석에서는 하체
            근력운동에 <strong>점프(최대 200회)와 짧은 질주(5~10회)</strong>를 섞은 주 2~3회, 8~12주 프로그램이 러닝 이코노미를 크게 좋게
            했습니다.{" "}
            <S>(Balsalobre-Fernández et al. (2016) <Up h="https://pubmed.ncbi.nlm.nih.gov/26694507/" />)</S>{" "}
            다만 중장거리 러너 기록을 본 다른 메타분석에서 점프 훈련만 한 경우는 기록 효과가 유의하지 않았습니다.{" "}
            <S>(Llanos-Lagos et al. (2024) <Up h="https://pubmed.ncbi.nlm.nih.gov/38627351/" />)</S>
          </p>
          <How>쉬운 달리기 끝에 80~100m를 빠르지만 편하게 × 4~6. 점프는 근력운동 날에 묶어서.</How>
        </Block>

        {/* ── 파틀렉 ─────────────────────────────────────── */}
        <Block stage="2단계부터">
          <h2 id="fartlek" className={H2}>
            파틀렉
          </h2>
          <p>
            스웨덴어로 &lsquo;속도 놀이&rsquo;. 정해진 거리 없이 느낌대로 빠르게·느리게를 섞습니다. <strong>파틀렉만 따로 시험한 연구는 찾지
            못했습니다.</strong> 템포와 인터벌을 자유롭게 섞은 형태라 그 두 훈련의 근거를 빌려 생각할 수밖에 없습니다.
          </p>
          <How>쉬운 달리기 중 전봇대·가로등 두세 개 거리를 빠르게, 숨이 돌아올 때까지 천천히 — 20~30분.</How>
        </Block>

        {/* ── 크로스 ─────────────────────────────────────── */}
        <Block stage="부상·휴식 중">
          <h2 id="cross" className={H2}>
            크로스 트레이닝
          </h2>
          <p>
            훈련된 32명을 물속 달리기·자전거·달리기로 6주 나눠 훈련했더니 세 그룹 모두 최대산소섭취량이 조금 줄고 2마일 기록은 그대로였습니다.{" "}
            <S>(Eyestone et al. (1993) <Up h="https://pubmed.ncbi.nlm.nih.gov/8427367/" />)</S>{" "}
            훈련된 러너 16명의 6주 물속 달리기에서도 유산소 능력이 유지됐습니다.{" "}
            <S>(Wilber et al. (1996) <Up h="https://pubmed.ncbi.nlm.nih.gov/8871917/" />)</S>
          </p>
          <How>아픈 부위에 통증이 없는 운동으로. 강도는 평소 훈련처럼 쉬움·빠름을 섞습니다.</How>
        </Block>

        {/* ── 근력 ─────────────────────────────────────────── */}
        <Block stage="모든 단계">
          <h2 id="strength" className={H2}>
            근력운동
          </h2>
          <p>
            중장거리 러너 메타분석에서 <strong>고중량(1RM 80% 이상)</strong> 근력운동은 기록에 중간 크기 효과, 여러 방법을 섞으면 큰 효과였고 근거
            확실성은 매우 낮음~중간이었습니다.{" "}
            <S>(Llanos-Lagos et al. (2024) <Up h="https://pubmed.ncbi.nlm.nih.gov/38627351/" />)</S>{" "}
            부상 예방 쪽은 엇갈립니다 — 스포츠 전반 메타분석에서는 부상을 3분의 1로 줄였지만,{" "}
            <S>(Lauersen et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/24100287/" />)</S>{" "}
            첫 풀코스 러너 720명에게 10분짜리 자가 프로그램을 준 시험에서는 줄지 않았습니다.{" "}
            <S>(Toresdahl et al. (2020) <Up h="https://pubmed.ncbi.nlm.nih.gov/31642726/" />)</S>
          </p>
          <How>주 1~2회. 스쿼트·데드리프트·한 발 런지·카프 레이즈 중 2~4가지, 무거운 무게로 4~6회 × 3세트. 처음엔 가벼운 무게로 동작부터.</How>
        </Block>

        <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
          <p className="font-semibold text-gray-900">한 주에 어떻게 섞나</p>
          <p className="mt-1">
            단계별 주간 구성 예시는 각 단계 글에 있습니다 —{" "}
            <Link href="/injury/start-running" className="text-emerald-700 underline">1단계</Link> ·{" "}
            <Link href="/injury/first-10k" className="text-emerald-700 underline">2단계</Link> ·{" "}
            <Link href="/injury/half-marathon-training" className="text-emerald-700 underline">3단계</Link> ·{" "}
            <Link href="/injury/marathon-training" className="text-emerald-700 underline">4단계</Link> ·{" "}
            <Link href="/injury/get-faster#week" className="text-emerald-700 underline">5단계</Link>
          </p>
        </div>

        <div className="mt-10">
          <FaqSection items={FAQ} />
        </div>

        <h2 id="refs" className="mt-10 text-xl font-bold text-gray-900">
          참고 문헌
        </h2>
        <p className="mt-1 text-xs text-gray-400">2026-10-07 PubMed 초록과 대조했습니다.</p>
        <ul className="mt-3 space-y-2 text-sm text-gray-700">
          <li>
            <strong>Bok et al. (2022)</strong> — 말하기 테스트·RPE 등 주관적 강도 판정법 고찰. Sports Med 52(9):2085-2109.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/35507232/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Ranieri et al. (2026)</strong> — 심박 대 대회 페이스 처방의 실행 정확도. Int J Sports Physiol Perform 21(8):902-909.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/41875873/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Coyle et al. (1984)</strong> — 지구력 훈련 중단 후 적응 손실의 시간 경과. J Appl Physiol 57(6):1857-64.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/6511559/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Mujika &amp; Padilla (2000)</strong> — 장기(4주 초과) 디트레이닝 고찰. Sports Med 30(3):145-54.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/10999420/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Frandsen et al. (2025)</strong> — 5,205명 18개월, 한 번의 긴 달리기와 과사용 부상. Br J Sports Med 59(17):1203-1210.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Hottenrott et al. (2016)</strong> — 아마추어 마라토너 42명, 걷기-달리기 대 계속 달리기. J Sci Med Sport 19(1):64-8.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/25467199/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Linton &amp; Valentin (2018)</strong> — 파크런 러너 1,145명 설문. J Sci Med Sport 21(12):1221-1225.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/29853263/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Relph et al. (2023)</strong> — Couch-to-5k 변형 110명, 완주율과 중도 포기. Int J Environ Res Public Health 20(17):6682.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/37681822/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Rosenblat et al. (2025)</strong> — 강도 배분 개별 자료 네트워크 메타분석. Sports Med 55(3):655-673.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/39888556/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Muñoz et al. (2014)</strong> — 레크리에이션 러너 30명 10주 강도 배분 시험. Int J Sports Physiol Perform 9(2):265-72.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/23752040/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Fokkema et al. (2020)</strong> — 하프·풀 참가자 최장 거리와 기록·부상. Scand J Med Sci Sports 30(9):1692-1704.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/32421886/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Vickers &amp; Vertosick (2016)</strong> — 레크리에이션 러너 2,303명 훈련 요인과 기록. BMC Sports Sci Med Rehabil 8(1):26.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/27570626/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Milanović et al. (2015)</strong> — 인터벌 대 지속주 최대산소섭취량 메타분석. Sports Med 45(10):1469-81.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/26243014/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Gist et al. (2014)</strong> — 스프린트 인터벌 메타분석(무작위 시험 16편). Sports Med 44(2):269-79.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/24129784/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Barnes et al. (2013)</strong> — 오르막 인터벌 6주, 잘 훈련된 러너 20명. Int J Sports Physiol Perform 8(6):639-47.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/23538293/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Balsalobre-Fernández et al. (2016)</strong> — 최상위 러너 근력·점프 훈련과 러닝 이코노미 메타분석. J Strength Cond Res
            30(8):2361-8.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/26694507/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Llanos-Lagos et al. (2024)</strong> — 중장거리 러너 근력운동 방법별 메타분석. Sports Med 54(7):1801-1833.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/38627351/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Eyestone et al. (1993)</strong> — 물속 달리기·자전거·달리기 6주 비교. Am J Sports Med 21(1):41-4.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/8427367/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Wilber et al. (1996)</strong> — 훈련된 러너 6주 물속 달리기. Med Sci Sports Exerc 28(8):1056-62.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/8871917/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Lauersen et al. (2014)</strong> — 운동 중재 부상 예방 메타분석. Br J Sports Med 48(11):871-7.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/24100287/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Toresdahl et al. (2020)</strong> — 첫 풀코스 러너 근력 프로그램 무작위 시험. Sports Health 12(1):74-79.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/31642726/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
        </ul>
      </article>
    </>
  );
}
