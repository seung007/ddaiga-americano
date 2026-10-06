import type { Metadata } from "next";
import Link from "next/link";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Up, S } from "@/components/guide/Up";

/**
 * 3단계 — 10km → 하프 (2026-10-06)
 *
 * 사용자 질문 「한 달 마일리지·기간 같은 기준점이 나와 있을 것 같은데」에 가장 직접 답하는 자료가
 * Fokkema 2020(Scand J Med Sci Sports) 이었다. 하프 참가자 556명의 실제 준비량(중앙값)과
 * 주간 거리·최장 거리 구간별 완주 시간이 본문 표 1·2 에 있다(PMC7496388 대조).
 *
 * 규칙
 *   · 표 숫자는 그 논문의 본문 표 값 그대로. 관찰 연구라 「더 뛰면 빨라진다」가 아니라 「더 뛴 사람이 빨랐다」로 적는다.
 *   · 주간 거리 증가율은 연구끼리 엇갈린다(Damsted 2019 vs Frandsen 2025) — 엇갈린다고 적는다.
 *   · 긴 달리기 진도표는 사이트 예시다. 하프 준비 기간을 정한 연구는 찾지 못했다.
 */

const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/half-marathon-training";
const TITLE = "하프마라톤 준비 — 10km에서 21km로 늘릴 때 막히는 곳";
const DESC =
  "하프 참가자 556명은 주 26km, 주 3회, 가장 긴 달리기 18.5km(중앙값)로 준비했습니다. 주간 거리와 긴 달리기를 얼마나, 얼마나 빨리 늘릴지, 어디서 다치는지 논문 수치로 정리했습니다.";

export const metadata: Metadata = {
  title: "하프마라톤 준비 훈련 — 주간 거리·긴 달리기 얼마나? 논문 기준 | 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/half-marathon-training" },
};

const BY_VOLUME: [string, string, string, string][] = [
  ["주 20km 미만", "129명", "2:05:32", "12.1%"],
  ["주 20~32km", "233명", "2:02:03", "12.0%"],
  ["주 32km 초과", "193명", "1:55:26", "9.7%"],
];
const BY_LONGEST: [string, string, string, string][] = [
  ["15km 미만", "94명", "2:06:48", "10.3%"],
  ["15~21km", "310명", "2:03:28", "12.1%"],
  ["21km 초과", "152명", "1:51:31", "9.4%"],
];

/** 긴 달리기 예시 — 매주 직전 30일 최장 거리의 110% 이하. 4주마다 줄이는 주는 경험칙. */
const LONG_RUNS: [string, string, string][] = [
  ["1", "11km", ""],
  ["2", "12km", ""],
  ["3", "13km", ""],
  ["4", "10km", "줄이는 주"],
  ["5", "14km", "최근 30일 최장 13km × 1.1"],
  ["6", "15km", ""],
  ["7", "16.5km", ""],
  ["8", "12km", "줄이는 주"],
  ["9", "18km", "최근 30일 최장 16.5km × 1.1"],
  ["10", "19.5km", ""],
  ["11", "21km", "선택 — 아래 표 참고"],
  ["12", "14km", "대회 2주 전"],
  ["13", "대회", ""],
];

const FAQ: FaqItem[] = [
  {
    q: "하프마라톤은 몇 주 준비해야 하나요?",
    a: "준비 기간을 정한 연구는 찾지 못했습니다. 10km를 달릴 수 있는 사람이 긴 달리기를 매번 지난 30일 최장 거리의 110% 안에서 늘리고(Frandsen 2025) 4주마다 한 번 줄이면, 이 사이트 예시로는 약 13주가 걸립니다.",
  },
  {
    q: "일주일에 몇 km 뛰어야 하나요?",
    a: "네덜란드 하프 참가자 556명의 중앙값은 주 26km, 주 3회였습니다. 주 32km 넘게 준비한 그룹이 평균 1:55:26으로 가장 빨랐고 후반 감속도 적었습니다. 훈련량과 부상 사이의 관련은 나타나지 않았습니다(Fokkema 2020). 관찰 연구라 원래 빠른 사람이 더 많이 뛰었을 가능성은 남습니다.",
  },
  {
    q: "대회 전에 21km를 한 번 뛰어봐야 하나요?",
    a: "필수는 아닙니다. 같은 연구의 최장 거리 중앙값은 18.5km였습니다. 다만 21km 넘게 뛰어본 그룹이 평균 1:51:31로 가장 빨랐고 후반 감속도 적었습니다(Fokkema 2020).",
  },
  {
    q: "하프 준비 중에 무릎 바깥이 아파요.",
    a: "장경인대 증후군일 수 있습니다. 내리막을 피하고 엉덩이 외전근 강화를 시작하세요. 국내 러닝 커뮤니티 부상 글에서 가장 많이 언급된 부위이기도 합니다. 자세한 내용은 장경인대 글에 있습니다.",
  },
  {
    q: "근력운동을 하면 덜 다치나요?",
    a: "결과가 엇갈립니다. 스포츠 전반 메타분석에서는 근력운동이 부상을 3분의 1 수준으로 줄였지만(Lauersen 2014), 첫 풀마라톤 러너 720명에게 주 3회 10분 자가 근력 프로그램을 준 시험에서는 차이가 없었습니다(Toresdahl 2020). 기록에는 고중량 근력운동이 도움이 됐다는 메타분석이 있습니다(Llanos-Lagos 2024).",
  },
];

export default function HalfMarathonTrainingPage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} datePublished="2026-10-06" />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["하프마라톤 준비", "/injury/half-marathon-training"],
        ]}
      />
      <article className="mx-auto max-w-2xl px-6 py-12 text-gray-800">
        <Link href="/injury" className="mb-6 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Link
            href="/injury#stage-to-half"
            className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800"
          >
            3단계 · 10km → 하프
          </Link>
          <span className="text-xs text-gray-400">7분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight text-gray-900">{TITLE}</h1>

        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">먼저 결론</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-emerald-900">
            <li>
              실제 하프 참가자 556명의 준비량 중앙값: <strong>주 26km · 주 3회 · 가장 긴 달리기 18.5km</strong>.
            </li>
            <li>
              주 32km 넘게, 최장 21km 넘게 준비한 그룹이 더 빨랐고 후반 감속이 적었습니다. <strong>훈련량과 부상의 관련은 없었습니다</strong>
              (관찰 연구).
            </li>
            <li>
              늘리는 속도: 긴 날은 <strong>지난 30일 최장 거리의 110% 안</strong>. 주간 거리 증가율은 연구끼리 결과가 엇갈립니다.
            </li>
            <li>아프면 통증 기준으로 조절하고, 무릎 바깥 통증(장경인대)을 특히 조심합니다.</li>
          </ol>
        </div>

        <TableOfContents
          items={[
            { id: "benchmark", label: "실제 완주자는 얼마나 준비했나" },
            { id: "ramp", label: "얼마나 빨리 늘리나" },
            { id: "pace", label: "어떤 속도로" },
            { id: "pain", label: "아플 때" },
            { id: "strength", label: "근력운동" },
            { id: "next", label: "대회와 다음 단계" },
            { id: "refs", label: "참고 문헌" },
          ]}
        />

        {/* ── 기준점 ─────────────────────────────────────────── */}
        <h2 id="benchmark" className="mt-10 text-xl font-bold text-gray-900">
          실제 완주자는 얼마나 준비했나
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed">
          네덜란드 하프마라톤 참가자 556명에게 준비 기간과 대회 직후 설문을 받은 연구입니다. 참가자의 러닝 경력 중앙값은 5년, 평균 나이 42.8세,
          대회 2~6주 전 기준으로 <strong>주 26km(20~40km), 주 3회, 훈련 페이스 5:45/km, 가장 긴 달리기 18.5km</strong>였습니다(괄호는
          사분위 범위). 평균 완주 시간은 2:00:05였습니다.{" "}
          <S>(Fokkema et al. (2020) <Up h="https://pubmed.ncbi.nlm.nih.gov/32421886/" />)</S>
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2.5">주간 거리</th>
                <th className="whitespace-nowrap p-2.5">인원</th>
                <th className="whitespace-nowrap p-2.5">평균 완주</th>
                <th className="whitespace-nowrap p-2.5">후반 감속</th>
              </tr>
            </thead>
            <tbody>
              {BY_VOLUME.map(([a, n, t, d]) => (
                <tr key={a} className="border-t border-gray-100">
                  <td className="p-2.5 font-medium text-gray-900">{a}</td>
                  <td className="whitespace-nowrap p-2.5 text-gray-600">{n}</td>
                  <td className="p-2.5 text-gray-700">{t}</td>
                  <td className="p-2.5 text-gray-700">{d}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-200 bg-gray-50 text-left">
                <th className="p-2.5">가장 긴 달리기</th>
                <th className="p-2.5" />
                <th className="p-2.5" />
                <th className="p-2.5" />
              </tr>
              {BY_LONGEST.map(([a, n, t, d]) => (
                <tr key={a} className="border-t border-gray-100">
                  <td className="p-2.5 font-medium text-gray-900">{a}</td>
                  <td className="whitespace-nowrap p-2.5 text-gray-600">{n}</td>
                  <td className="p-2.5 text-gray-700">{t}</td>
                  <td className="p-2.5 text-gray-700">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-gray-500">
          출처: 같은 논문 본문 표 2. 후반 감속은 대회 중 페이스가 떨어진 정도. 회귀 분석에서도 주 32km 초과와 최장 21km 초과가 더
          빠른 완주·적은 감속과 관련 있었고, <strong>훈련량·최장 거리와 부상 사이에는 관련이 없었습니다</strong>. 관찰 연구라 원래 빠른 사람이
          더 많이 뛰었을 가능성은 남습니다.
        </p>

        {/* ── 늘리는 속도 ─────────────────────────────────────── */}
        <h2 id="ramp" className="mt-10 text-xl font-bold text-gray-900">
          얼마나 빨리 늘리나
        </h2>
        <ul className="mt-3 space-y-3 text-[15px] leading-relaxed">
          <li>
            <strong>긴 날.</strong> 성인 러너 5,205명을 18개월 추적한 연구에서 한 번 달린 거리가 지난 30일 최장 거리보다 10% 넘게 길면 과사용
            부상 비율이 1.52~2.28배였습니다. 전주 대비 주간 거리 비율은 관계가 없었습니다.{" "}
            <S>(Frandsen et al. (2025) <Up h="https://pubmed.ncbi.nlm.nih.gov/40623829/" />)</S>
          </li>
          <li>
            <strong>주간 거리.</strong> 하프를 준비하는 러너 261명을 14주 추적한 연구에서는 21일 시점에 주간 거리를 20~60% 늘린 사람이 20% 미만으로
            늘린 사람보다 부상 위험이 22.6%p 높았습니다. 56일·98일 시점에는 차이가 없었습니다. 14주 동안 21.5%가 다쳤습니다.{" "}
            <S>(Damsted et al. (2019) <Up h="https://pubmed.ncbi.nlm.nih.gov/30526231/" />)</S>
          </li>
        </ul>
        <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">
          두 연구가 주간 증가율에 대해 다른 결과를 냈습니다. 이 사이트는 둘 다 지키는 쪽을 권합니다 — <strong>준비 첫 3주는 주간 거리를 20%
          미만으로</strong> 늘리고, <strong>긴 날은 110% 안에서</strong>(경험칙).
        </p>

        <h3 className="mt-6 text-base font-bold text-gray-900">긴 달리기 예시 (10km에서 시작)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
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
                  <td className="p-2.5 text-xs text-gray-500">{memo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          이 사이트의 예시입니다. 매주 긴 날이 직전 30일 최장 거리의 110%를 넘지 않게 짰고, 4주마다 줄이는 주와 대회 2주 전 감량은 경험칙입니다.
          하프 준비 기간이나 최장 거리를 정한 연구는 찾지 못했습니다.
        </p>

        {/* ── 속도 ─────────────────────────────────────────── */}
        <h2 id="pace" className="mt-10 text-xl font-bold text-gray-900">
          어떤 속도로
        </h2>
        <ul className="mt-3 space-y-3 text-[15px] leading-relaxed">
          <li>
            <strong>대부분은 대화가 되는 속도.</strong> 말하기 테스트는 환기역치 아래 강도를 가려내는 타당한 방법으로 평가됩니다.{" "}
            <S>(Reed &amp; Pipe (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/25010379/" />)</S>
          </li>
          <li>
            <strong>심박계가 있다면.</strong> 레크리에이션 러너 37명을 교차 시험한 연구에서 45분 저강도 달리기 때 목표 구간에 머문 시간이 심박으로
            정했을 때 85%, 대회 페이스 비율로 정했을 때 69%였습니다. 고강도 인터벌에서는 두 방법 모두 낮았습니다(41%·27%).{" "}
            <S>(Ranieri et al. (2026) <Up h="https://pubmed.ncbi.nlm.nih.gov/41875873/" />)</S>{" "}
            이 연구의 심박 구간은 실험실 검사로 정했습니다. 손목 시계의 추정 최대심박으로 정한 구간은 이보다 부정확할 수 있습니다.
          </li>
          <li>
            <strong>강도 배분.</strong> 13개 연구 개별 자료를 모은 메타분석에서 양극화형과 피라미드형 배분은 전체로는 차이가 없었고,
            최대산소섭취량은 레크리에이션 선수가 피라미드형에서 더 좋아졌을 가능성이 있었습니다.{" "}
            <S>(Rosenblat et al. (2025) <Up h="https://pubmed.ncbi.nlm.nih.gov/39888556/" />)</S>{" "}
            특정 비율 공식보다 &lsquo;대부분은 쉽게, 일부만 빠르게&rsquo;가 실천 기준입니다(경험칙).
          </li>
        </ul>

        {/* ── 아플 때 ─────────────────────────────────────────── */}
        <h2 id="pain" className="mt-10 text-xl font-bold text-gray-900">
          아플 때
        </h2>
        <ul className="mt-3 space-y-3 text-[15px] leading-relaxed">
          <li>
            <strong>무릎 바깥.</strong> 국내 러닝 커뮤니티 부상 글에서 작성자 기준 가장 많이 언급된 부위였습니다(이 사이트 집계). 내리막에서
            심해지면 장경인대 증후군을 의심합니다 →{" "}
            <Link href="/injury/it-band" className="text-emerald-700 underline">장경인대 글</Link>
          </li>
          <li>
            <strong>아픈 채 계속 달리지 않기.</strong> 파크런 러너 설문에서 지금 부상이 있는 570명 중 86%가 통증을 안고 달리고 있었습니다.{" "}
            <S>(Linton &amp; Valentin (2018) <Up h="https://pubmed.ncbi.nlm.nih.gov/29853263/" />)</S>{" "}
            통증 점수로 조절하는 법은{" "}
            <Link href="/injury/return-to-running#rest-or-run" className="text-emerald-700 underline">부상 후 복귀 글</Link>에 있습니다.
          </li>
          <li>
            <strong>다쳤던 곳.</strong> 지난 12개월 안의 부상은 가장 일관된 부상 위험 요인이었습니다.{" "}
            <S>(Saragiotto et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/24809248/" />)</S>{" "}
            위 하프 참가자의 52.3%도 지난 12개월 안에 다친 적이 있었습니다.
          </li>
        </ul>

        {/* ── 근력 ─────────────────────────────────────────── */}
        <h2 id="strength" className="mt-10 text-xl font-bold text-gray-900">
          근력운동
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed">
          부상 예방 효과는 엇갈립니다. 스포츠 전반 무작위 시험 25편 메타분석에서는 근력운동이 부상을 3분의 1 수준으로 줄였지만(RR 0.315),{" "}
          <S>(Lauersen et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/24100287/" />)</S>{" "}
          첫 풀마라톤 러너 720명에게 주 3회 10분 자가 근력 프로그램을 준 시험에서는 완주를 막은 과사용 부상이 7.1% 대 7.3%로 같았습니다.{" "}
          <S>(Toresdahl et al. (2020) <Up h="https://pubmed.ncbi.nlm.nih.gov/31642726/" />)</S>{" "}
          기록에는 고중량(1RM 80% 이상) 근력운동이 중간 크기 효과를 보였고, 근거 확실성은 매우 낮음~중간이었습니다.{" "}
          <S>(Llanos-Lagos et al. (2024) <Up h="https://pubmed.ncbi.nlm.nih.gov/38627351/" />)</S>
        </p>

        {/* ── 대회와 다음 ─────────────────────────────────────── */}
        <h2 id="next" className="mt-10 text-xl font-bold text-gray-900">
          대회와 다음 단계
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed">
          대회 당일의 젤·급수·페이스는{" "}
          <Link href="/injury/half-marathon-race-day" className="text-emerald-700 underline">하프 대회 당일 체크리스트</Link>에 정리했습니다. 목표
          기록이 궁금하면 10km 기록으로{" "}
          <Link href="/tools/pace" className="text-emerald-700 underline">페이스 계산기</Link>의 예측을 참고하세요.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed">
          하프를 완주했다면 4단계(하프 → 풀)입니다. 풀코스 참가자 441명의 준비량 중앙값은 주 40km, 주 3회, 가장 긴 달리기 32km였고, 주 40km
          미만·최장 25km 미만은 더 느린 완주와 관련 있었습니다.{" "}
          <S>(Fokkema et al. (2020) <Up h="https://pubmed.ncbi.nlm.nih.gov/32421886/" />)</S>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury#stage-to-full" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            4단계에서 막히는 곳 →
          </Link>
          <Link href="/injury/intermediate-guide" className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:border-gray-300">
            중급자 가이드
          </Link>
        </div>

        <div className="mt-10">
          <FaqSection items={FAQ} />
        </div>

        <h2 id="refs" className="mt-10 text-xl font-bold text-gray-900">
          참고 문헌
        </h2>
        <p className="mt-1 text-xs text-gray-400">2026-10-06 PubMed 초록과 대조했습니다(Fokkema 2020 은 PMC 본문 표).</p>
        <ul className="mt-3 space-y-2 text-sm text-gray-700">
          <li>
            <strong>Fokkema et al. (2020)</strong> — 하프 556명·풀 441명의 훈련량·최장 거리와 기록·부상. Scand J Med Sci Sports 30(9):1692-1704.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/32421886/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Frandsen et al. (2025)</strong> — 5,205명 18개월, 30일 최장 거리 대비 10% 초과 시 부상 증가. Br J Sports Med 59(17):1203-1210.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Damsted et al. (2019)</strong> — 하프 준비 러너 261명 14주, 주간 거리 변화와 부상. J Orthop Sports Phys Ther 49(4):230-238.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/30526231/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Reed &amp; Pipe (2014)</strong> — 말하기 테스트 타당도 고찰. Curr Opin Cardiol 29(5):475-80.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/25010379/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Ranieri et al. (2026)</strong> — 심박 대 대회 페이스 기반 처방의 실행 정확도, 레크리에이션 러너 37명. Int J Sports Physiol
            Perform 21(8):902-909.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/41875873/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Rosenblat et al. (2025)</strong> — 강도 배분 개별 자료 네트워크 메타분석. Sports Med 55(3):655-673.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/39888556/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Linton &amp; Valentin (2018)</strong> — 파크런 러너 1,145명 설문, 부상 중 86% 계속 달림. J Sci Med Sport 21(12):1221-1225.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/29853263/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Saragiotto et al. (2014)</strong> — 부상 위험 요인 체계적 고찰. Sports Med 44(8):1153-63.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/24809248/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Lauersen et al. (2014)</strong> — 운동 중재 부상 예방 메타분석. Br J Sports Med 48(11):871-7.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/24100287/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Toresdahl et al. (2020)</strong> — 첫 풀마라톤 러너 근력 프로그램 무작위 시험. Sports Health 12(1):74-79.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/31642726/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Llanos-Lagos et al. (2024)</strong> — 중장거리 러너 근력운동 방법별 메타분석. Sports Med 54(7):1801-1833.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/38627351/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
        </ul>
        <p className="mt-3 text-xs text-gray-400">※ 이 글은 의학적 진단을 대체하지 않습니다.</p>
      </article>
    </>
  );
}
