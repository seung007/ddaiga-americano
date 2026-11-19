import type { Metadata } from "next";
import Link from "next/link";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, H3, Num, KeyPoints, Steps, OneLine, Caveat, Sources, Src, Ref } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

/**
 * 3단계 — 10km → 하프 (2026-10-06)
 *
 * 사용자 질문 「한 달 마일리지·기간 같은 기준점이 나와 있을 것 같은데」에 가장 직접 답하는 자료가
 * Fokkema 2020(Scand J Med Sci Sports) 이었다. 하프 참가자 556명의 준비량과 기록·부상 관계를 다룬다.
 *
 * 2026-10-13 가독성 재설계 — 섹션마다 답 → 할 일 → 근거(접힘).
 * 2026-11-10 제목·소제목을 채팅 말로 — 오픈채팅에서 「하프」는 33명이 쓰고 「하프마라톤」은 4명이다.
 *
 * 2026-11-18 확정 틀로 바꿈 (AGENTS.md 「가이드 글 틀 — 2026-11-18 확정」, 견본 app/injury/start-running/page.tsx)
 *   · 말투 「~니다」 → 「~요」. 날짜 한 줄 · 3줄 요약 · 번호 붙은 큰 질문 5개 · 절 끝 한 줄 요약 · 글 끝 접힌 「근거와 출처」.
 *     옛 부품 여섯 개(한눈에 상자 · 이렇게 하세요 상자 · 근거 보기 접힘 · 글 끝 문헌 목록 · 근거 수준 딱지 · 별표 단서)를 걷어냈다.
 *     (옛 부품 이름을 주석에 적으면 check:geo 가 글에 남은 것으로 세므로 풀어서 적는다.)
 *   · 큰 절 6개 → 5개. id 는 그대로 유지했다 — 다른 글과 부품이 #ramp 를 건다
 *     (app/injury/training-types/page.tsx, components/RaceJourney.tsx). 주차 표도 #ramp 절에 그대로 뒀다.
 *   · 근력운동 절은 곁가지라 FAQ 로 내렸다. 본문 큰 질문과 FAQ 문항이 글자까지 같았던 중복이 이걸로 사라졌다.
 *
 *   고친 것 — 주장을 초록으로 다시 판정한 결과(판정 기준: Project 문서 「처음 달리기 글 근거 판정」 + 견본 머리 주석)
 *   · **준비량 중앙값(주 26km · 주 3회 · 최장 18.5km)과 구간별 완주 시간·후반 감속 표를 지웠다.**
 *     이 값들은 Fokkema 2020 의 초록이 아니라 본문 표 1·2 에만 있다. 2026-11-18 에 초록(QxMD)은 열렸지만
 *     본문(PMC)은 승인 대기로 막히고 Europe PMC 는 프록시가 막아 **세 경로 다 다시 열지 못했다.**
 *     초록으로 확인되는 것은 「주 32km 초과·최장 21km 초과가 더 빠른 완주와 적은 후반 감속과 관련 있었다」와
 *     「훈련량과 부상의 관련은 나타나지 않았다」까지다. 그래서 숫자 표는 빼고 그 두 문장만 남겼다.
 *     숫자를 뺀 자리를 다른 숫자로 메우지 않았다. 같은 중앙값이 lib/guide/stages.ts 에 남아 있다(보고에 적었다).
 *   · **「말하기 테스트는 환기역치 아래 강도를 가려낸다」는 단정을 뺐다.** 리뷰 두 편은 그렇게 보지만 15명 실험과 어긋난다
 *     (판정: 엇갈림). 생리 용어를 쓰지 않고 「운동 강도를 가늠하는 믿을 만한 방법」까지만 적었다. lib/guide/stages.ts 84행도 같이 고쳤다.
 *   · **Linton 2018 「86%」의 분모를 문장에 넣었다.** 본문은 「지금 다친 러너 대부분」으로, 숫자(570명 중 86%)는 접힌 출처에만 뒀다.
 *     견본이 2026-11-18 에 출판본 초록에서 86% 로 확인한 값이다. 모든 러너가 아니다.
 *   · **Frandsen 2025 의 1.52~2.28배를 뺐다.** 늘린 정도별 값이 차례로 커지지 않아(1.64 → 1.52 → 2.28) 범위로 적으면
 *     「많이 늘릴수록 비례해서 위험」으로 읽힌다. 「10% 넘게 길게 뛴 날에 부상이 늘었다」까지만 적고,
 *     초보나 복귀 러너만 모은 연구가 아니라는 단서를 출처에 뒀다.
 *   · **부상 후 복귀 글로 보내던 「통증 점수로 거리를 조절하는 법」 안내를 고쳤다.** 그 글이 2026-11-18 에 점수 표를 지워서
 *     가리키는 내용이 없어졌다. 점수를 쓰지 않는 기준(아픔이 커지는가 · 다음 날 아침에 더 아픈가)으로 바꿨다.
 *   · 한 연구에 기댄 문장의 세기를 낮췄다: 주간 거리 20%(신뢰구간 0.9~44.3 으로 넓다)·심박 구간·강도 배분에
 *     「한 연구에서」「한 시험에서」를 붙였다. 지난 12개월 부상(Saragiotto, 확실)과 말하기 테스트(Reed, 확실)만 단정으로 뒀다.
 *   · 무릎 바깥 통증이 국내 커뮤니티에서 가장 많이 언급된 부위라는 저희 집계는 뺐다 — 아픈 곳 안내는 상황 문장 링크로 옮겼고,
 *     부위별 설명은 각 부상 글이 진다(본문과 FAQ 중복 금지).
 *   · 풀코스 준비량(주 40km · 최장 32km)도 본문 표 값이라 뺐다. 4단계 안내는 링크만 남겼다.
 *
 *   확인 못 한 것 (2026-11-18, 다음에 네트워크가 되면 여기부터) — 비워 두지 않고 적어 둔다
 *   · Fokkema 2020 본문 표 1·2(준비량 중앙값, 구간별 완주 시간·후반 감속, 하프 참가자의 지난 12개월 부상 52.3%).
 *     2026-10-06 에 이 저장소가 대조해 둔 값이지만 이번에 다시 열지 못해 글에서 뺐다. 열리면 되살릴지 판단한다.
 *   · 권·호·쪽은 열한 편 모두 다시 열지 못했다(QxMD 는 초록만 보여 준다). 저장소가 2026-10-06 에 대조해 둔 값을
 *     그대로 뒀다 — 새로 지어낸 값이 아니다. 다음에 한 번 더 대조한다.
 */

const PAGE_URL = pageUrl("/injury/half-marathon-training");
const TITLE = "하프마라톤 준비, 얼마나 뛰어야 하나요?";
const DESC =
  "하프를 준비할 때 주간 거리와 긴 달리기를 얼마나 빨리 늘릴지, 어떤 속도로 뛸지, 준비 중에 아프면 무엇을 할지 논문으로 확인해 정리했습니다.";

export const metadata: Metadata = {
  title: "하프마라톤 준비, 얼마나 뛰어야 하나요? | 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/half-marathon-training" },
};

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
  ["11", "21km", "넣어도 되고 빼도 되는 주"],
  ["12", "14km", "대회 2주 전"],
  ["13", "대회", ""],
];

// 2026-11-18: FAQ 는 본문 큰 질문과 겹치지 않는 것만 둔다. 근력운동은 본문에서 내려온 곁가지다.
// 전문어는 문항마다 다시 풀이한다 — 답 하나만 따로 인용되기 때문이다(check:geo 가 본다)

const FAQ: FaqItem[] = [
  {
    q: "하프마라톤은 몇 주 준비해야 하나요?",
    a: "정해진 주 수는 없어요. 준비 기간을 정한 연구는 찾지 못했어요. 10km를 달릴 수 있다면 저희 예시로는 **13주쯤** 걸려요. 더 걸려도 괜찮으니 **주 수를 맞추려고 거리를 당기지는 마세요.**",
  },
  {
    q: "대회 전에 21km를 한 번 뛰어봐야 하나요?",
    a: "꼭 필요하지는 않아요. 다만 하프 참가자 설문에서 **준비 중 가장 긴 달리기가 21km를 넘은 사람**이 더 빨리 완주하고 후반에도 덜 느려졌어요. 원래 빠른 사람이 더 길게 뛰었을 수도 있어서, 꼭 해야 한다는 뜻은 아니에요.",
  },
  {
    q: "근력운동을 하면 덜 다치나요?",
    a: "달리기에서는 부상을 줄이는 효과가 뚜렷하지 않았어요. 해도 되지만 **근력운동을 했다고 거리를 더 늘리지는 마세요.** 첫 풀마라톤을 준비하는 러너에게 근력 프로그램을 준 시험에서, 부상으로 완주하지 못한 비율이 7.1%와 7.3%로 거의 같았어요.",
  },
];

const chipCls = "rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400";

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
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Link
            href="/injury#stage-to-half"
            className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800"
          >
            3단계 · 10km → 하프
          </Link>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/half-marathon-training" compact checked={11} />

        <KeyPoints
          items={[
            <>주에 몇 km를 뛸지는 남들 평균이 아니라 <strong>지금 뛰는 양에서</strong> 정해요.</>,
            <>가장 길게 뛰는 날은 <strong>지난 한 달에 가장 길게 뛴 거리보다 10% 넘게 늘리지 않기를</strong> 권해요.</>,
            <>속도는 옆 사람과 이야기할 수 있을 만큼이면 돼요. 달리는 중에 아픔이 커지면 <strong>그날은 멈추는 걸 권해요.</strong></>,
          ]}
        />

        <Lead>
          하프를 신청해 놓고 얼마나 뛰어야 할지 막막하다면, 기준은 <strong>지금 뛰는 양</strong>이에요. 많이 준비한 사람이 더 빨리
          완주했지만, 많이 뛴 쪽이 더 다치지는 않았어요.
        </Lead>

        <TableOfContents
          items={[
            { id: "benchmark", label: "주에 몇 km 뛸까" },
            { id: "ramp", label: "얼마나 빨리 늘릴까" },
            { id: "pace", label: "어떤 속도로" },
            { id: "pain", label: "준비 중에 아프면" },
            { id: "next", label: "대회와 다음 단계" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="benchmark" className={H2}>
          <Num n={1} />주에 몇 km씩 뛰어야 하나요?
        </h2>
        <P>
          <strong>지금 한 주에 뛰는 거리에서 조금씩 늘리세요.</strong> 하프 참가자들에게 준비량을 물은 한 연구에서, 주 32km를 넘겨
          준비한 사람들이 더 빨리 완주하고 후반에도 덜 느려졌어요. 같은 연구에서 많이 준비한 쪽이 더 다치지는 않았어요.
        </P>
        <P>
          그래서 완주가 목표라면 지금 거리를 지키면서 긴 날만 늘려도 돼요. 기록이 목표라면 주간 거리를 더 길게 잡아 보세요.
        </P>
        <Steps
          items={[
            { t: "지금 한 주에 뛰는 거리를 적어 두세요.", d: "늘리는 기준이 남들 평균이 아니라 여기예요." },
            { t: "거리와 속도를 같은 주에 같이 올리지 않기를 권해요.", d: "둘 중 하나만 올려요." },
            { t: "주 3회로 시작해 보세요.", d: "달리는 날 사이에 하루를 비워요." },
          ]}
        />
        <Caveat>
          관찰 연구라서 더 뛰면 빨라진다는 뜻은 아니에요. 원래 빠른 사람이 더 많이 뛰었을 가능성은 남아요. 주 3회는 저희가 정한
          출발점이에요.
        </Caveat>

        <OneLine>남들 평균이 아니라, 지금 내가 뛰는 거리에서 늘려요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="ramp" className={H2}>
          <Num n={2} />거리는 얼마나 빨리 늘려도 되나요?
        </h2>
        <P>
          <strong>가장 길게 뛰는 날은 지난 30일 중 가장 길게 뛴 거리의 110% 안에서</strong> 늘리기를 권해요. 성인 러너를 18개월
          따라간 한 대형 연구에서 그보다 10% 넘게 길게 뛴 날에 부상이 늘었어요.
        </P>
        <P>
          주간 거리는 따로 봐요. 하프를 준비하는 러너를 추적한 한 연구에서, 준비 시작 3주 사이에 주간 거리를 20% 넘게 늘린
          사람들이 더 많이 다쳤어요. 그래서 저희는 <strong>첫 3주는 20% 미만</strong>으로 늘리기를 권해요.
        </P>
        <Steps
          items={[
            { t: "긴 날은 지난 30일 최장 거리의 110% 안에서 늘려요." },
            { t: "주간 거리는 준비 첫 3주에 20% 미만으로 늘려요.", d: "두 기준을 다 지키는 쪽을 권해요." },
            { t: "4주마다 한 번은 줄이는 주를 넣어요.", d: "같은 주에 긴 날도 짧게 잡아요." },
          ]}
        />

        <h3 id="long-runs" className={`${H3} scroll-mt-20`}>10km에서 시작하면 긴 달리기는 13주에 21km까지</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-base">
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
                  <td className="whitespace-nowrap p-2.5 text-gray-700">{km}</td>
                  <td className="break-keep p-2.5 text-xs text-gray-500">{memo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Caveat>
          이 표는 저희가 만든 예시예요. 매주 긴 날이 직전 30일 최장 거리의 110%를 넘지 않게 짰어요. 4주마다 줄이는 주와 대회 2주
          전 감량도 저희가 정한 것이고, 하프 준비 기간이나 최장 거리를 정한 연구는 찾지 못했어요.
        </Caveat>

        <OneLine>긴 날은 지난 한 달 최장 거리에서 조금만, 주간 거리는 준비 초반에 특히 천천히 늘려요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="pace" className={H2}>
          <Num n={3} />어떤 속도로 뛰어야 하나요?
        </h2>
        <P>
          <strong>대부분의 날은 옆 사람과 이야기할 수 있는 속도로</strong> 뛰세요. 이걸 말하기 테스트라고 해요. 강도를 가늠하는
          믿을 만한 방법이에요.
        </P>
        <P>
          쉬운 날과 빠른 날의 비율을 공식으로 맞추지 않아도 돼요. 여러 연구의 참가자 자료를 모은 한 메타분석에서 배분 방식에 따른
          차이가 없었어요.
        </P>
        <Steps
          items={[
            { t: "대부분의 날은 이야기가 되는 속도로 뛰어요.", d: "말이 단어 단위로 끊기면 속도를 줄여요." },
            { t: "빠른 날을 늘리기 전에 긴 날을 먼저 채우기를 권해요." },
            { t: "심박계가 있으면 심박으로 정한 구간을 보세요.", d: "한 시험에서 대회 페이스로 정한 구간보다 목표 강도에 더 오래 머물렀어요." },
          ]}
        />
        <Caveat>심박 구간을 쓴 그 시험은 실험실 검사로 구간을 정했어요. 시계가 추정한 최대심박으로 정한 구간은 이보다 부정확할 수 있어요.</Caveat>

        <OneLine>이야기가 되는 속도면 충분해요. 비율 공식은 안 따져도 돼요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="pain" className={H2}>
          <Num n={4} />준비 중에 아프면 어떻게 하나요?
        </h2>
        <P>
          <strong>아픈 채로 대회 날짜를 지키려 하지 마세요.</strong> 한 설문에서는 지금 다친 러너 대부분이 아픈 채로 계속 달리고
          있었어요. 흔한 일이라는 뜻이지, 괜찮다는 뜻은 아니에요.
        </P>
        <P>
          <strong>지난 12개월 안에 다친 적이 있으면</strong> 더 조심하세요. 여러 연구를 모은 고찰에서 가장 꾸준한 부상 위험
          요인이었어요.
        </P>
        <Steps
          items={[
            { t: "달리는 중에 아픔이 커지면 그날은 멈춰요.", d: "참고 더 뛰어서 얻는 건 없어요." },
            { t: "다음 날 아침에 전날보다 아프면 다음 번에 거리를 줄여요." },
            { t: "쉬는데도 나아지는 느낌이 없으면 진료를 받아요." },
          ]}
        />
        <Caveat>이 세 가지는 저희가 정한 기준이고, 진단을 대신하지 않아요.</Caveat>
        <P>
          아픈 곳에 따라 멈출 신호와 대처가 달라요. 쉬었다가 다시 시작하는 중이라면{" "}
          <Link href="/injury/return-to-running" className="text-emerald-700 underline">부상 후 복귀 글</Link>을 먼저 보세요.
        </P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/it-band" className={chipCls}>무릎 바깥이 아프다면 →</Link>
          <Link href="/injury/knee-pain" className={chipCls}>무릎 앞이 아프다면 →</Link>
          <Link href="/injury/shin-splints" className={chipCls}>정강이가 아프다면 →</Link>
          <Link href="/injury/achilles" className={chipCls}>아킬레스가 아프다면 →</Link>
        </div>

        <OneLine>아픔이 커지는 날은 멈춰요. 대회 날짜보다 다리가 먼저예요.</OneLine>

        {/* ── 5 ─────────────────────────────────────────── */}
        <h2 id="next" className={H2}>
          <Num n={5} />대회 당일과 그다음은 어떻게 하나요?
        </h2>
        <P>
          대회 전 2주는 새로 늘리지 말고 당일 준비로 넘어가기를 권해요. 젤과 급수, 출발 페이스는{" "}
          <Link href="/injury/half-marathon-race-day" className="text-emerald-700 underline">하프 대회 당일 체크리스트</Link>에
          정리했어요. 목표 기록은 10km 기록으로{" "}
          <Link href="/tools/pace" className="text-emerald-700 underline">페이스 계산기</Link>의 예측을 참고하세요.
        </P>
        <P>하프를 완주했다면 다음은 풀코스를 준비하는 4단계예요.</P>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/injury#stage-to-full" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            4단계에서 자주 겪는 문제 →
          </Link>
          <Link href="/injury/marathon-training" className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:border-gray-300">
            풀마라톤 준비
          </Link>
          <Link href="/injury/intermediate-guide" className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:border-gray-300">
            중급자 가이드
          </Link>
        </div>

        <OneLine>대회 전 2주는 새로 늘리지 말고, 당일 준비를 챙기는 걸 권해요.</OneLine>

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Fokkema et al. (2020)</strong> 하프 참가자 556명 설문에서 주 32km 초과와 가장 긴 달리기 21km 초과가 더 빠른 완주, 적은 후반 감속과 관련 있었어요. 훈련량과 부상의 관련은 나타나지 않았어요.
            <Ref>Scand J Med Sci Sports 30(9):1692-1704 · <a href="https://pubmed.ncbi.nlm.nih.gov/32421886/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Frandsen et al. (2025)</strong> 한 번 달린 거리가 지난 30일 최장 거리보다 10% 넘게 길면 부상이 늘었어요(성인 러너 5,205명, 평균 45.8세 — 하프를 준비하는 사람만 모은 연구가 아니에요).
            <Ref>Br J Sports Med 59(17):1203-1210 · <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Damsted et al. (2019)</strong> 하프를 준비하는 러너 261명을 14주 따라갔어요. 21일 시점에 주간 거리를 20~60% 늘린 쪽의 부상 위험이 20% 미만 쪽보다 22.6%p 높았어요(0.9~44.3). 56일과 98일 시점에는 차이가 없었어요.
            <Ref>J Orthop Sports Phys Ther 49(4):230-238 · <a href="https://pubmed.ncbi.nlm.nih.gov/30526231/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Reed &amp; Pipe (2014)</strong> 말하기 테스트는 타당하고 믿을 만한 강도 기준이에요.
            <Ref>Curr Opin Cardiol 29(5):475-80 · <a href="https://pubmed.ncbi.nlm.nih.gov/25010379/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Ranieri et al. (2026)</strong> 45분 저강도 달리기에서 목표 구간에 머문 시간이 심박으로 정했을 때 85%, 대회 페이스로 정했을 때 69%였어요(취미 러너 37명 교차 시험). 고강도 구간에서는 두 방법 모두 낮았어요(41%와 27%).
            <Ref>Int J Sports Physiol Perform 21(8):902-909 · <a href="https://pubmed.ncbi.nlm.nih.gov/41875873/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={6}>
            <strong>Rosenblat et al. (2025)</strong> 13편의 참가자 자료 348명을 모은 메타분석이에요. 강도 배분 방식에 따른 기록과 최대산소섭취량 차이가 없었어요. 취미 수준은 피라미드형에서 더 좋아질 수 있다고 봤어요.
            <Ref>Sports Med 55(3):655-673 · <a href="https://pubmed.ncbi.nlm.nih.gov/39888556/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={7}>
            <strong>Linton &amp; Valentin (2018)</strong> 지금 다친 러너 570명 중 86%가 아픈 채로 계속 달렸어요(파크런 러너 설문).
            <Ref>J Sci Med Sport 21(12):1221-1225 · <a href="https://pubmed.ncbi.nlm.nih.gov/29853263/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={8}>
            <strong>Saragiotto et al. (2014)</strong> 가장 일관된 부상 위험 요인은 지난 12개월 안의 부상이었어요.
            <Ref>Sports Med 44(8):1153-63 · <a href="https://pubmed.ncbi.nlm.nih.gov/24809248/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={9}>
            <strong>Lauersen et al. (2014)</strong> 여러 종목의 무작위 시험 25편(26,610명)을 모은 메타분석이에요. 근력운동을 한 쪽의 부상이 3분의 1 수준이었어요(상대위험 0.315, 0.207~0.480). 달리기만 모은 분석은 아니에요.
            <Ref>Br J Sports Med 48(11):871-7 · <a href="https://pubmed.ncbi.nlm.nih.gov/24100287/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={10}>
            <strong>Toresdahl et al. (2020)</strong> 첫 풀마라톤 러너 720명에게 12주 동안 주 3회 10분짜리 근력 프로그램을 준 무작위 시험이에요. 부상으로 완주하지 못한 비율이 7.1%와 7.3%였어요(상대위험 0.97, 0.57~1.63).
            <Ref>Sports Health 12(1):74-79 · <a href="https://pubmed.ncbi.nlm.nih.gov/31642726/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={11}>
            <strong>Llanos-Lagos et al. (2024)</strong> 중장거리 러너의 근력운동 방법을 비교한 메타분석이에요. 무거운 무게로 한 쪽이 기록에 중간 크기 효과를 보였어요. 근거 확실성은 매우 낮음에서 중간이었어요.
            <Ref>Sports Med 54(7):1801-1833 · <a href="https://pubmed.ncbi.nlm.nih.gov/38627351/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
