import type { Metadata } from "next";
import Link from "next/link";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Up, S } from "@/components/guide/Up";
import { Lead, P, H2, H3, Summary, Todo, Evidence, References, Basis, Note } from "@/components/guide/Read";

/**
 * 4단계 — 하프 → 풀 (2026-10-07)
 *
 * 규칙은 3단계 글(half-marathon-training)과 같다.
 *   · 표 숫자는 Fokkema 2020 본문 표 2 (PMC7496388) 그대로.
 *   · 훈련량과 부상의 관계는 연구끼리 엇갈린다 — Rasmussen 2013(주 30km 미만 RR 2.02, 완주자 회고) vs
 *     Fokkema 2020(회귀에서 관련 없음). 둘 다 적는다.
 *   · 테이퍼 근거 하나(Bosquet 2007)는 경쟁 선수 대상이다. 레크리에이션 자료(Smyth & Lawlor 2021)는 관찰이다. 둘 다 표시.
 *   · 장거리 진도표는 사이트 예시.
 *
 * 2026-10-13 가독성 재설계 — 섹션마다 답 → 할 일 → 근거(접힘). 숫자는 <Evidence> 안으로 옮겼고 지우지 않았다.
 *   급성:만성 비율(ACWR)은 Toresdahl 2023 과 Frandsen 2025 가 반대 방향 → 「엇갈림」을 본문 <Note> 로.
 *   테이퍼 근거의 대상(경쟁 선수 / 관찰 연구)도 <Note> 로. 제목의 「막히는 곳」 → 「자주 겪는 문제」.
 */

const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/marathon-training";
const TITLE = "풀코스 준비 — 하프에서 42.195km로 늘릴 때 자주 겪는 문제";
const DESC =
  "풀코스 참가자 441명은 주 40km, 주 3회, 가장 긴 달리기 32km(중앙값)로 준비했습니다. 준비 중 다치는 이유, 후반에 무너지는 이유, 테이퍼와 보급까지 논문 수치로 정리했습니다.";

export const metadata: Metadata = {
  title: "풀코스 마라톤 준비 훈련 — 주간 거리·장거리·테이퍼, 논문 기준 | 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/marathon-training" },
};

const BY_VOLUME: [string, string, string, string][] = [
  ["주 40km 미만", "158명", "4:31:03", "29.1%"],
  ["주 40~65km", "239명", "4:19:04", "23.9%"],
  ["주 65km 초과", "43명", "3:43:03", "21.9%"],
];
const BY_LONGEST: [string, string, string, string][] = [
  ["25km 미만", "91명", "4:37:43", "28.8%"],
  ["25~30km", "111명", "4:25:07", "26.2%"],
  ["30~35km", "200명", "4:15:26", "24.5%"],
  ["35km 초과", "38명", "3:50:18", "20.1%"],
];

/** 하프를 달려 본 사람이 21km 에서 시작 — 매주 직전 30일 최장의 110% 이하, 4주마다 줄이는 주(경험칙). */
const LONG_RUNS: [string, string, string][] = [
  ["1", "21km", "하프 완주 직후 기준"],
  ["2", "23km", "21 × 1.1"],
  ["3", "25km", "23 × 1.1"],
  ["4", "18km", "줄이는 주"],
  ["5", "27.5km", "25 × 1.1"],
  ["6", "30km", "27.5 × 1.1"],
  ["7", "32km", "30 × 1.1 = 33 이하"],
  ["8", "20km", "줄이는 주"],
  ["9", "32km", "최장 유지"],
  ["10", "24km", "테이퍼 시작"],
  ["11", "16km", ""],
  ["12", "대회", ""],
];

const FAQ: FaqItem[] = [
  {
    q: "풀코스는 일주일에 몇 km 뛰어야 하나요?",
    a: "네덜란드 풀코스 참가자 441명의 중앙값은 주 40km, 주 3회였습니다. 주 40km 미만은 더 느린 완주와 관련 있었습니다(Fokkema 2020). 부상과의 관계는 연구마다 다릅니다 — 완주자 662명 회고 연구에서는 주 30km 미만이 부상 위험 2.02배(Rasmussen 2013), 위 441명 연구의 회귀 분석에서는 관련이 없었습니다.",
  },
  {
    q: "32km 장거리를 꼭 뛰어야 하나요?",
    a: "필수라는 연구는 찾지 못했습니다. 다만 같은 연구에서 가장 긴 달리기 중앙값이 32km였고, 25km 미만은 더 느린 완주와 관련 있었습니다(Fokkema 2020). 늘릴 때는 지난 30일 최장 거리의 110% 안에서 늘리세요(Frandsen 2025).",
  },
  {
    q: "테이퍼는 몇 주가 좋나요?",
    a: "경쟁 선수 연구를 모은 메타분석에서는 2주 동안 훈련량을 41~60% 줄이고 강도·빈도는 유지하는 방식이 가장 효과적이었습니다(Bosquet 2007). 레크리에이션 러너 15만 8천여 명의 기록 분석에서는 3주 동안 꾸준히 줄인 그룹이 최소 테이퍼보다 완주 시간이 중앙값 5분 32초 빨랐습니다(Smyth & Lawlor 2021, 관찰 연구).",
  },
  {
    q: "젤은 얼마나 먹어야 하나요?",
    a: "장거리 종목 영양 리뷰는 가장 긴 레이스에서 시간당 75~90g의 탄수화물이 이득이 될 수 있다고 정리하고, 개인에 맞춰 미리 연습한 계획을 권합니다. 위장 불편 위험과 함께 저울질해야 합니다(Burke 2019). 젤 하나의 탄수화물 양을 확인해 시간당 개수로 바꿔 보세요.",
  },
  {
    q: "하프 기록으로 풀코스 기록을 예측할 수 있나요?",
    a: "널리 쓰이는 리겔 공식은 하프까지는 잘 맞았지만, 풀코스는 레크리에이션 러너 절반에게서 실제보다 10분 이상 빠르게 예측했습니다(Vickers 2016). 목표 페이스는 공식 값보다 보수적으로 잡으세요.",
  },
];

export default function MarathonTrainingPage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} datePublished="2026-10-07" />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["풀코스 준비", "/injury/marathon-training"],
        ]}
      />
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Link
            href="/injury#stage-to-full"
            className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800"
          >
            4단계 · 하프 → 풀
          </Link>
          <span className="text-xs text-gray-400">4분 읽기</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <Lead>
          하프에서 풀코스로 넘어갈 때 자주 겪는 문제는 <strong>준비 중 부상</strong>과 <strong>후반에 크게 느려지는 것</strong>입니다.
          실제 완주자의 준비량부터 테이퍼·보급까지 추렸습니다.
        </Lead>

        <Summary
          items={[
            <>풀코스 참가자 441명의 준비량 중앙값은 <strong>주 40km · 주 3~4회 · 가장 긴 달리기 32km</strong>였습니다.<Basis kind="paper" /></>,
            <>한 마라톤 연구에서 <strong>준비 16주 동안 40%가 다쳤습니다.</strong><Basis kind="paper" /></>,
            <>하프 기록으로 리겔 공식을 쓰면 풀코스 예측이 취미 러너 절반에게서 <strong>10분 이상 낙관적</strong>이었습니다. 공식 값은 상한으로 보세요.<Basis kind="paper" /></>,
            <>테이퍼는 <strong>2~3주, 훈련량을 줄이고 강도는 유지</strong>(경쟁 선수 연구·취미 마라토너 관찰 연구 근거).<Basis kind="paper" /></>,
          ]}
        />

        <TableOfContents
          items={[
            { id: "benchmark", label: "다들 얼마나 뛰었나" },
            { id: "injury", label: "준비하다 다쳐요" },
            { id: "long-run", label: "장거리 늘리기" },
            { id: "wall", label: "후반에 무너져요" },
            { id: "fuel", label: "젤은 얼마나" },
            { id: "taper", label: "대회 전 줄이기" },
            { id: "next", label: "다음 단계" },
          ]}
        />

        {/* ── 기준점 ─────────────────────────────────────────── */}
        <h2 id="benchmark" className={H2}>
          다른 완주자들은 얼마나 뛰고 나갔을까
        </h2>
        <P>
          네덜란드 풀코스 참가자 441명의 중앙값은 <strong>주 40km, 주 3회, 가장 긴 달리기 32km</strong>였습니다.
        </P>
        <P>주 40km 미만이거나 가장 긴 달리기가 25km 미만이면 더 느린 완주와 관련 있었습니다.</P>
        <Note>관찰 연구라 원래 빠른 사람이 더 많이 뛰었을 가능성은 남습니다.</Note>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-[15px]">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="break-keep p-2.5">주간 거리</th>
                <th className="whitespace-nowrap p-2.5">인원</th>
                <th className="whitespace-nowrap p-2.5">평균 완주</th>
                <th className="whitespace-nowrap p-2.5">후반 감속</th>
              </tr>
            </thead>
            <tbody>
              {BY_VOLUME.map(([a, n, t, d]) => (
                <tr key={a} className="border-t border-gray-100">
                  <td className="break-keep p-2.5 font-medium text-gray-900">{a}</td>
                  <td className="whitespace-nowrap p-2.5 text-gray-600">{n}</td>
                  <td className="p-2.5 text-gray-700">{t}</td>
                  <td className="p-2.5 text-gray-700">{d}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-200 bg-gray-50 text-left text-sm">
                <th className="break-keep p-2.5">가장 긴 달리기</th>
                <th className="p-2.5" />
                <th className="p-2.5" />
                <th className="p-2.5" />
              </tr>
              {BY_LONGEST.map(([a, n, t, d]) => (
                <tr key={a} className="border-t border-gray-100">
                  <td className="break-keep p-2.5 font-medium text-gray-900">{a}</td>
                  <td className="whitespace-nowrap p-2.5 text-gray-600">{n}</td>
                  <td className="p-2.5 text-gray-700">{t}</td>
                  <td className="p-2.5 text-gray-700">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-gray-500">출처: 위 441명 연구 논문의 본문 표 2.</p>
        <Evidence n={1}>
          <p>
            네덜란드 마라톤 참가자 441명(평균 41.4세, 러닝 경력 중앙값 5년)에게 준비 기간과 대회 직후 설문을 받은 연구입니다. 대회 2~6주 전
            기준 준비량 중앙값은 주 40km(30~50km), 주 3회(3~4회), 가장 긴 달리기 32km(27~35km)였고, 평균 완주 시간은 4:17:54, 대회 중 페이스
            감속은 평균 25.0%였습니다. <S>(Fokkema et al. (2020) <Up h="https://pubmed.ncbi.nlm.nih.gov/32421886/" />)</S>
          </p>
          <p>
            회귀 분석에서 주 40km 미만은 더 느린 완주, 주 65km 초과는 더 빠른 완주, 최장 25km 미만은 더 느린 완주와 관련 있었습니다. 관찰
            연구라 원래 빠른 사람이 더 많이 뛰었을 가능성은 남습니다.
          </p>
        </Evidence>

        {/* ── 부상 ─────────────────────────────────────────── */}
        <h2 id="injury" className={H2}>
          준비하다가 다쳐요 — 얼마나 흔할까
        </h2>
        <P>
          <strong>흔합니다.</strong> 뉴욕마라톤 참가자를 16주 따라간 연구에서 훈련 중 40%가 다쳤습니다.
        </P>

        <h3 className={H3}>거리를 갑자기 늘린 주가 위험할까</h3>
        <P>
          최근 7일 거리를 28일 거리와 비교한 비율(급성:만성 비율)이 높은 날이 많을수록 부상이 많았다는 연구가 있습니다.
        </P>
        <Note>연구끼리 엇갈립니다. 5,205명 연구에서는 같은 지표가 반대 방향으로 나왔습니다.</Note>
        <P>
          그 연구에서 더 분명한 위험 신호는 <strong>한 번 달린 거리가 지난 30일 최장 거리보다 10% 넘게 긴 경우</strong>였습니다.
        </P>
        <Evidence n={2}>
          <p>
            뉴욕마라톤 참가자 735명을 16주 추적했더니 훈련 중 40.0%가 다쳤고, 대회 중·직후에 16.0%가 다쳤습니다. 최근 7일과 28일 거리로
            계산한 급성:만성 비율이 1.5 이상인 날이 많을수록 부상이 많았습니다(하루당 OR 1.06).{" "}
            <S>(Toresdahl et al. (2023) <Up h="https://pubmed.ncbi.nlm.nih.gov/36113976/" />)</S>
          </p>
          <p>
            다만 5,205명 연구에서는 같은 지표가 반대 방향으로 나왔고, 한 번 달린 거리가 지난 30일 최장 거리보다 10% 넘게 긴 경우가 더
            분명한 위험 신호였습니다. <S>(Frandsen et al. (2025) <Up h="https://pubmed.ncbi.nlm.nih.gov/40623829/" />)</S>
          </p>
        </Evidence>

        <h3 className={H3}>뼈를 조심하세요</h3>
        <P>
          첫 풀코스 러너 연구에서 완주를 막은 과사용 부상 52건 중 <strong>20건이 뼈 스트레스 부상</strong>이었습니다.
        </P>
        <P>
          뼈의 한 지점이 콕 집어 아프면{" "}
          <Link href="/injury/return-to-running#bone" className="text-emerald-700 underline">뼈 부상은 다르다</Link>를 보세요.
        </P>
        <Evidence n={1}>
          <p>
            첫 풀코스 러너 720명 연구에서 완주를 막은 큰 부상은 8.9%, 훈련·기록에 지장을 준 작은 부상은 48.5%였습니다. 큰 부상 64건 중
            52건이 과사용이었고 그중 20건이 뼈 스트레스 부상이었습니다.{" "}
            <S>(Toresdahl et al. (2020) <Up h="https://pubmed.ncbi.nlm.nih.gov/31642726/" />)</S>
          </p>
        </Evidence>

        <h3 className={H3}>훈련량이 적으면 더 다칠까</h3>
        <P>
          <strong>연구마다 다릅니다.</strong> 완주자 회고 연구에서는 주 30km 미만으로 준비한 사람이 더 다쳤지만, 위 441명 연구의 회귀
          분석에서는 훈련량과 부상의 관련이 나타나지 않았습니다.
        </P>
        <Evidence n={2}>
          <p>
            완주자 662명 회고 연구에서는 주 30km 미만으로 준비한 사람의 부상 위험이 30~60km보다 2.02배였고, 60km 초과는 차이가
            없었습니다. <S>(Rasmussen et al. (2013) <Up h="https://pubmed.ncbi.nlm.nih.gov/23593549/" />)</S>
          </p>
          <p>
            위 441명 연구에서도 원자료상 주 40km 미만 그룹의 부상 보고가 62.0%로 가장 높았지만, 회귀 분석에서는 훈련량과 부상의 관련이
            나타나지 않았습니다. <S>(Fokkema et al. (2020) <Up h="https://pubmed.ncbi.nlm.nih.gov/32421886/" />)</S>
          </p>
        </Evidence>

        <h3 className={H3}>근력운동만 하면 될까</h3>
        <P>
          한 무작위 시험에서는 짧은 자가 근력 프로그램만으로 완주를 막는 과사용 부상이 줄지 않았습니다.
        </P>
        <Evidence n={1}>
          <p>
            같은 첫 풀코스 러너 연구에서 12주 동안 주 3회 10분짜리 자가 근력 프로그램을 한 그룹과 안 한 그룹의 완주를 막은 과사용 부상은
            7.1% 대 7.3%로 같았습니다. <S>(Toresdahl et al. (2020) <Up h="https://pubmed.ncbi.nlm.nih.gov/31642726/" />)</S>
          </p>
        </Evidence>

        {/* ── 장거리 ─────────────────────────────────────────── */}
        <h2 id="long-run" className={H2}>
          장거리는 어떻게 32km까지 늘릴까
        </h2>
        <P>
          한 번에 늘리는 폭은 <strong>지난 30일 최장 거리의 110%</strong> 안이 기준입니다.<Basis kind="rule" /> 하프를 달려 본 사람이
          21km에서 시작하면 아래처럼 7주째에 32km에 닿습니다.
        </P>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-[15px]">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="whitespace-nowrap p-2.5">주</th>
                <th className="whitespace-nowrap p-2.5">가장 긴 날</th>
                <th className="p-2.5">메모</th>
              </tr>
            </thead>
            <tbody>
              {LONG_RUNS.map(([w, km, memo]) => (
                <tr key={w} className="border-t border-gray-100">
                  <td className="p-2.5 font-semibold text-gray-900">{w}</td>
                  <td className="p-2.5 text-gray-700">{km}</td>
                  <td className="break-keep p-2.5 text-sm text-gray-500">{memo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P className="text-sm text-gray-500">
          이 표는 저희 예시입니다. 4주마다 줄이는 주와 테이퍼 배분은 저희 제안이고, 풀코스 준비 기간이나 최장 거리를 정한 연구는 찾지
          못했습니다.
        </P>
        <Todo
          basis="rule"
          items={["주간 거리를 주 40km 안팎까지 함께 올릴 시간이 없다면 기간을 늘리세요."]}
        />

        {/* ── 벽 ─────────────────────────────────────────── */}
        <h2 id="wall" className={H2}>
          후반에 무너져요 — &lsquo;벽&rsquo;은 왜 올까
        </h2>
        <P>
          후반에 크게 느려지는 &lsquo;벽&rsquo;은 남성 28%, 여성 17%가 겪었습니다. 보통 32km쯤 이후, 대개 에너지가 바닥나서 생긴다고
          설명합니다.
        </P>
        <P>한 대회 기록 분석에서는 느린 러너일수록 후반 감속이 컸습니다.</P>
        <Todo
          basis="rule"
          items={[
            "전반을 목표 페이스보다 빠르게 달리지 않습니다.",
            "장거리 훈련에서 대회 페이스와 보급을 미리 맞춰 봅니다.",
          ]}
        />
        <Evidence n={2}>
          <p>
            400만 건 넘는 기록을 분석한 연구에서 후반에 크게 느려지는 &lsquo;벽&rsquo;을 겪은 비율은 남성 28%, 여성 17%였고, 보통 20마일(약
            32km) 이후, 대개 에너지 저장량이 바닥나서 생긴다고 설명합니다.{" "}
            <S>(Smyth (2021) <Up h="https://pubmed.ncbi.nlm.nih.gov/34010308/" />)</S>
          </p>
          <p>
            미국 한 대회의 3년치 구간 기록 319명 분석에서는 나이가 많을수록, 여성일수록, 빠를수록 페이스가 고르게 유지됐습니다. 느린
            러너일수록 후반 감속이 컸습니다. <S>(March et al. (2011) <Up h="https://pubmed.ncbi.nlm.nih.gov/20224445/" />)</S>
          </p>
        </Evidence>

        <h3 className={H3}>하프 기록으로 풀코스 목표를 잡아도 될까</h3>
        <P>
          리겔 공식으로 뽑은 풀코스 값은 취미 러너 절반에게서 실제보다 <strong>10분 이상 빨랐습니다</strong>.{" "}
          <Link href="/tools/pace#predict-h" className="text-emerald-700 underline">페이스 계산기</Link>의 풀코스 값은 상한으로 보세요.
        </P>
        <Evidence n={1}>
          <p>
            리겔 공식은 하프까지는 잘 맞았지만 풀코스는 취미 러너 절반에게서 실제보다 10분 이상 빠르게 예측했습니다.{" "}
            <S>(Vickers &amp; Vertosick (2016) <Up h="https://pubmed.ncbi.nlm.nih.gov/27570626/" />)</S>
          </p>
        </Evidence>

        {/* ── 보급 ─────────────────────────────────────────── */}
        <h2 id="fuel" className={H2}>
          젤은 얼마나 먹어야 하나요
        </h2>
        <P>
          가장 긴 레이스에서는 시간당 <strong>75~90g</strong>의 탄수화물이 이득이 될 수 있다고 정리한 리뷰가 있습니다. 다만{" "}
          <strong>미리 연습한 계획</strong>이어야 하고, 위장 불편 위험과 저울질해야 합니다.
        </P>
        <Todo
          basis="rule"
          items={["젤 하나의 탄수화물 양(포장에 표시)을 확인해 시간당 개수로 바꿔 보세요."]}
        />
        <P className="text-sm text-gray-600">
          젤·급수 운용은{" "}
          <Link href="/injury/half-marathon-race-day" className="text-emerald-700 underline">하프 대회 당일 체크리스트</Link>에 정리했습니다.
        </P>
        <Evidence n={1}>
          <p>
            장거리 육상 종목의 영양 전략을 정리한 리뷰는 대회 전 몇 시간~며칠 동안 탄수화물 위주로 먹어 글리코겐을 채우고, 가장 긴
            레이스에서는 시간당 75~90g의 탄수화물이 이득이 될 수 있다고 봤습니다. 개인에 맞춰 미리 연습한 계획이어야 하고, 위장 불편 위험과
            저울질해야 합니다. 카페인은 근거가 있는 보충제로 언급됩니다.{" "}
            <S>(Burke et al. (2019) <Up h="https://pubmed.ncbi.nlm.nih.gov/30747558/" />)</S>
          </p>
        </Evidence>

        {/* ── 테이퍼 ─────────────────────────────────────────── */}
        <h2 id="taper" className={H2}>
          대회 전엔 얼마나 줄일까 — 테이퍼
        </h2>
        <P>
          <strong>2~3주 동안 훈련량을 줄이고, 강도와 빈도는 그대로</strong> 둡니다.<Basis kind="paper" />
        </P>
        <Note>2주 근거는 경쟁 선수 연구를 모은 것이고, 3주 결과는 취미 마라토너 기록을 본 관찰 연구입니다.</Note>
        <Evidence n={2}>
          <p>
            경쟁 선수 연구 27편을 모은 메타분석에서는 2주 동안 훈련량을 41~60% 줄이고, 강도와 빈도는 그대로 두는 방식이 기록에 가장
            효과적이었습니다. <S>(Bosquet et al. (2007) <Up h="https://pubmed.ncbi.nlm.nih.gov/17762369/" />)</S>
          </p>
          <p>
            취미 마라토너 15만 8천여 명의 훈련 기록 분석에서는 3주 동안 꾸준히 줄인 그룹이 최소한으로 줄인 그룹보다 완주 시간이 중앙값
            5분 32초(2.6%) 빨랐습니다. 64%는 덜 엄격한 테이퍼를 하고 있었습니다(관찰 연구).{" "}
            <S>(Smyth &amp; Lawlor (2021) <Up h="https://pubmed.ncbi.nlm.nih.gov/34651125/" />)</S>
          </p>
        </Evidence>

        {/* ── 다음 ─────────────────────────────────────────── */}
        <h2 id="next" className={H2}>
          다음 단계
        </h2>
        <P>
          풀코스를 완주했다면 5단계(기록 단축)입니다. 거기서는 강도 배분·인터벌·근력운동이 관건입니다.
        </P>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/injury/get-faster" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            기록 단축 →
          </Link>
          <Link href="/injury/advanced-guide" className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:border-gray-300">
            숙련자 가이드
          </Link>
        </div>

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <References n={11} note="2026-10-07 PubMed 초록과 대조했습니다(Fokkema 2020 은 PMC 본문 표).">
          <ul>
          <li>
            <strong>Fokkema et al. (2020)</strong> — 하프 556명·풀 441명의 훈련량·최장 거리와 기록·부상. Scand J Med Sci Sports 30(9):1692-1704.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/32421886/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Toresdahl et al. (2023)</strong> — 뉴욕마라톤 735명 16주 훈련 패턴과 부상. Br J Sports Med 57(3):146-152.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/36113976/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Toresdahl et al. (2020)</strong> — 첫 풀코스 러너 720명 근력 프로그램 무작위 시험. Sports Health 12(1):74-79.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/31642726/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Rasmussen et al. (2013)</strong> — 마라톤 완주자 662명, 주간 거리와 부상. Int J Sports Phys Ther 8(2):111-20.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/23593549/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Frandsen et al. (2025)</strong> — 5,205명 18개월, 한 번의 긴 달리기와 과사용 부상. Br J Sports Med 59(17):1203-1210.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Smyth (2021)</strong> — 400만 건 이상 기록의 후반 페이스 붕괴 분석. PLOS ONE 16(5):e0251513.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/34010308/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>March et al. (2011)</strong> — 나이·성별·완주 시간과 마라톤 페이스 유지. J Strength Cond Res 25(2):386-91.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/20224445/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Vickers &amp; Vertosick (2016)</strong> — 레크리에이션 러너 2,303명 기록 예측, 리겔 공식의 풀코스 과소 예측. BMC Sports Sci Med
            Rehabil 8(1):26.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/27570626/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Burke et al. (2019)</strong> — 장거리 육상 영양 전략 리뷰. Int J Sport Nutr Exerc Metab 29(2):117-129.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/30747558/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Bosquet et al. (2007)</strong> — 테이퍼 효과 메타분석(경쟁 선수 27편). Med Sci Sports Exerc 39(8):1358-65.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/17762369/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Smyth &amp; Lawlor (2021)</strong> — 레크리에이션 마라토너 15만 8천여 명 테이퍼 분석. Front Sports Act Living 3:735220.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/34651125/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          </ul>
        </References>
        <p className="mt-6 text-xs text-gray-400">※ 이 글은 의학적 진단을 대체하지 않습니다.</p>
      </article>
    </>
  );
}
