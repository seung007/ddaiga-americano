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
 * 4단계 — 하프 → 풀 (2026-10-07)
 *
 * 2026-10-13 가독성 재설계 · 2026-11-10 제목·소제목을 채팅 말로(오픈채팅 「풀코스」 25명·「장거리·LSD」 32명,
 * 처음 풀코스를 접수한 사람의 질문 「몇 키로까지 연습해야」) — 경위는 git 기록.
 *
 * 2026-11-23 확정 틀로 바꿈 (docs/운영/가이드_틀.md, 견본 app/injury/start-running/page.tsx)
 *   판정 전부: docs/판정/marathon-training.jsonl. 초록 10편은 2026-11-23 크롬으로 PubMed 를 직접 열어 읽었다(요약만).
 *   Altieri 2026 · Almond 2005 는 같은 날 half-marathon-race-day 판정에서 읽은 구절을 그대로 썼다(이 세션에서 다시 열지 못함).
 *
 *   틀 — 옛 부품 여섯 개(한눈에 상자 · 이렇게 하세요 상자 · 근거 보기 접힘 · 글 끝 문헌 목록 · 근거 수준 딱지 · 엇갈림 상자)를 걷어냈다.
 *     (옛 부품 이름을 주석에 적으면 check:geo 가 글에 남은 것으로 세므로 풀어서 적는다.)
 *     큰 절 7개 → 번호 붙은 큰 질문 6개. 다음 단계 절은 6절 끝 링크로 합쳤다.
 *     id 는 benchmark·injury·long-run·wall·fuel·taper 를 그대로 뒀다 — components/RaceJourney.tsx 가 #taper 를 건다(grep 2026-11-23).
 *     작은 질문 넷(거리를 갑자기 늘린 주 · 뼈 부상 · 훈련량이 적으면 · 짧은 근력운동)은 할 일과 한 문장으로 합치고, 근력운동은 FAQ 로 내렸다.
 *
 *   고친 것 — 무엇이 틀렸고 왜
 *   · **Fokkema 2020 의 준비량 중앙값(주 40km · 주 3회 · 가장 긴 달리기 32km), 평균 완주 4:17:54, 후반 감속 25.0%,
 *     구간별 인원·완주 시간·감속 표 두 개를 지웠다.** 초록에는 없고 본문 표 1·2 에만 있는 값이다(확인 못 함).
 *     초록으로 확인되는 것은 「일주일 40km 미만·가장 길게 뛴 거리 25km 미만이면 더 느린 완주, 65km 초과면 더 빠른 완주」와
 *     「준비량과 부상의 관련은 없었다」까지라 그것만 남겼다. half-marathon-training 이 하프 값을 뺀 것과 같은 판정.
 *     뺀 자리를 다른 숫자로 메우지 않았다.
 *   · **「장거리는 32km까지」를 뺐다** — 큰 제목과 긴 달리기 예시 표의 끝값이 위 중앙값에 기대고 있었다.
 *     예시 표는 21km 에서 110% 씩 늘려 30km 에서 멈추는 사이트 예시로 바꾸고, 어디까지 늘릴지 정한 연구는 찾지 못했다고 적었다.
 *   · **Frandsen 2025** — 다른 확정 틀 글과 같은 말 「한 번에 가장 길게 뛴 거리보다 10% 넘게 길게 뛴 날에 부상이 늘었어요」로.
 *     「1.52~2.28배」는 쓰지 않는다(값이 차례로 커지지 않는다). 일주일 거리 비율은 Toresdahl 2023 과 Frandsen 2025 가
 *     반대 방향이라 「긴 날 기준만큼 확실하지 않아요」로만.
 *   · **Rasmussen 2013 2.02배**는 완주자만 본 회고 연구라 본문에서 숫자를 내리고 「결과가 갈렸어요」로 Fokkema 와 나란히 뒀다.
 *   · **물** — 옛 글에는 없었다. 풀코스 보급 절에 half-marathon-race-day 판정과 같은 말로 넣었다:
 *     「목마를 때 마셔요」(Altieri 2026 초록) · 저나트륨혈증 풀이 · 체중이 늘 만큼 마신 사람과 오래 걸린 사람에게 많았다(Almond 2005).
 *     Hew-Butler 2017 초록에는 「목마를 때 마시기」 문장이 없어 그 출처로 받치지 않는다. 젤 개수(20~30g · 시간당 1~2개)는 쓰지 않는다.
 *   · **젤** — Burke 2019 의 75~90g 은 가장 긴 경기 기준이라 「도움이 될 수 있다는 리뷰」로 낮추고,
 *     2~3시간 운동의 약 60g(Jeukendrup 2014)을 먼저 적었다.
 *   · **벽은 32km 이후 에너지 고갈** — Smyth 2021 서론의 설명이지 그 연구가 잰 값이 아니다 → 「~온다고 설명해요」.
 *   · **테이퍼** — Bosquet 2007 은 여러 종목 경기 선수, Smyth & Lawlor 2021 은 취미 마라토너 기록 관찰이라 「~편이 좋아요」로.
 *     「중앙값 5분 32초」는 출처로 내렸다(통일표: 중앙값 금지). 처음 나올 때 풀이를 붙였다.
 *   · 통증 신호를 it-band·achilles 와 같은 표준 문구(아픔이 커지면 멈춤 · 다음 날 아침 더 아프면 줄임 · 쉬어도 안 나으면 진료)로.
 *   · 말투 「~니다」 → 「~요」, 따옴표(‘벽’)·※ 를 풀었다. 본문에서 연구 인원·나라·대상을 내렸다(441명 · 735명 · 720명 · 662명 · 5,205명 · 네덜란드 · 뉴욕).
 *
 *   덜어낸 것
 *   · March 2011(나이·성별·빠르기와 페이스 유지) — 할 일로 이어지지 않는 곁가지라 글과 출처 목록에서 내렸다.
 *   · 큰 절 「다음 단계」 — 6절 끝 링크로.
 *
 *   확인 못 한 것
 *   · Fokkema 2020 본문 표 1·2 — 열면 되살릴지 다시 판정한다. 같은 중앙값이 lib/guide/stages.ts 205·208행에 남아 있다(보고에 적음).
 *   · 13편 모두 본문은 열지 않았다(요약만). 권·호·쪽은 PubMed 초록 페이지의 서지와 대조했다.
 */

const PAGE_URL = pageUrl("/injury/marathon-training");
const TITLE = "풀코스 준비, 장거리는 몇 km까지 뛰나요?";
// 원장 lib/guide/articles.ts 의 desc 와 같은 문장이어야 한다(허브 카드·검색 결과가 어긋나지 않게)
const DESC =
  "풀코스를 준비할 때 일주일 거리와 장거리를 얼마나 빨리 늘릴지, 준비 중 아플 때 할 일, 후반에 무너지지 않는 법과 대회 전 줄이기를 논문으로 확인해 정리했습니다.";

export const metadata: Metadata = {
  title: `${TITLE} | 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/marathon-training" },
};

/** 하프를 달려 본 사람이 21km 에서 시작 — 매주 직전 30일 가장 길게 뛴 거리의 110% 이하, 4주마다 줄이는 주. 30km 에서 멈추는 것은 사이트 예시. */
const LONG_RUNS: [string, string, string][] = [
  ["1", "21km", "하프 거리에서 시작"],
  ["2", "23km", "21 × 1.1 = 23.1 이하"],
  ["3", "25km", "23 × 1.1 = 25.3 이하"],
  ["4", "18km", "줄이는 주"],
  ["5", "27.5km", "25 × 1.1"],
  ["6", "30km", "27.5 × 1.1 = 30.25 이하"],
  ["7", "30km", "같은 거리로 한 번 더"],
  ["8", "20km", "줄이는 주"],
  ["9", "30km", ""],
  ["10", "24km", "대회 3주 전, 줄이기 시작"],
  ["11", "16km", ""],
  ["12", "대회", ""],
];

// 2026-11-23: FAQ 는 본문 큰 질문과 겹치지 않는 것만 둔다. 근력운동은 본문에서 내려온 곁가지다
const FAQ: FaqItem[] = [
  {
    q: "풀코스는 몇 주 준비해야 하나요?",
    a: "정해진 주 수는 없어요. 준비 기간을 정한 연구는 찾지 못했어요. 하프를 달려 봤다면 저희 예시로는 **12주쯤** 걸려요. 더 걸려도 괜찮으니 **주 수를 맞추려고 거리를 당기지는 마세요.**",
  },
  {
    q: "대회 전에 32km를 꼭 뛰어 봐야 하나요?",
    a: "꼭 그래야 한다는 근거는 찾지 못했어요. 늘린다면 **지난 30일 가장 길게 뛴 거리의 110% 안에서** 늘려요. 한 설문에서 **가장 길게 뛴 거리가 25km 미만**이면 더 느리게 완주했지만, 원래 빠른 사람이 더 길게 뛰었을 수도 있어요.",
  },
  {
    q: "근력운동을 하면 덜 다치나요?",
    a: "짧은 근력 프로그램만으로는 줄지 않았어요. 해도 되지만 **근력운동을 했다고 거리를 더 늘리지는 마세요.** 첫 풀코스를 준비하는 러너에게 근력 프로그램을 준 시험에서, 부상으로 완주하지 못한 비율이 **7.1%와 7.3%**로 거의 같았어요.",
  },
];

const pill = "rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400";
const linkCls = "text-emerald-700 underline";

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
      <main>
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
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/marathon-training" compact checked={13} />

        <KeyPoints
          items={[
            <>가장 길게 뛰는 날은 <strong>지난 한 달에 가장 길게 뛴 거리보다 10% 넘게 늘리지 않기를</strong> 권해요.</>,
            <>후반에 무너지지 않으려면 <strong>전반을 목표보다 빠르게 달리지 않는 것</strong>부터 지켜요.</>,
            <>대회 전 2~3주는 <strong>거리만 줄이고</strong> 빠르게 뛰는 날은 남겨 두는 편이 좋아요.</>,
          ]}
        />

        <Lead>
          하프는 뛰어 봤는데 풀코스는 얼마나 연습해야 할지 막막하다면, 기준은 거리보다 <strong>다치지 않고 늘리는 속도</strong>예요.
          풀코스 준비에서 자주 막히는 건 준비 중 부상과 후반에 크게 느려지는 일이에요.
        </Lead>

        <TableOfContents
          items={[
            { id: "benchmark", label: "일주일에 몇 km" },
            { id: "long-run", label: "장거리는 어디까지" },
            { id: "injury", label: "준비하다 아프면" },
            { id: "wall", label: "후반에 무너져요" },
            { id: "fuel", label: "젤과 물" },
            { id: "taper", label: "대회 전 줄이기" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="benchmark" className={H2}>
          <Num n={1} />일주일에 몇 km씩 뛰고 나가야 하나요?
        </h2>
        <P>
          <strong>지금 일주일에 뛰는 거리에서 천천히 늘리세요.</strong> 풀코스 참가자에게 준비량을 물은 한 연구에서, 일주일
          40km 미만으로 준비한 사람이 더 느리게 완주하는 경향이 있었어요.
        </P>
        <P>
          다치는 것과의 관계는 결과가 갈렸어요. 일주일 30km 미만으로 준비한 완주자가 더 많이 다쳤다는 조사가 있지만, 앞의
          설문에서는 준비량과 부상의 관련이 나타나지 않았어요.
        </P>
        <Steps
          items={[
            { t: "지금 한 주에 뛰는 거리를 적어 두세요.", d: "늘리는 기준은 남들 평균이 아니라 여기예요." },
            { t: "일주일 30km를 넘기지 못했다면 대회 날짜에 맞추기보다 준비 기간을 늘리기를 권해요." },
            { t: "거리와 속도는 같은 주에 같이 올리지 않기를 권해요.", d: "둘 중 하나만 올려요." },
          ]}
        />
        <Caveat>관찰한 결과라서 더 뛰면 빨라진다는 뜻은 아니에요. 원래 빠른 사람이 더 많이 뛰었을 가능성이 남아요.</Caveat>

        <OneLine>남들 평균이 아니라 지금 뛰는 거리에서 늘리고, 준비가 짧으면 기간을 늘려요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="long-run" className={H2}>
          <Num n={2} />장거리는 몇 km까지, 얼마나 빨리 늘리나요?
        </h2>
        <P>
          <strong>가장 길게 뛰는 날은 지난 30일 중 가장 길게 뛴 거리의 110% 안에서</strong> 늘리기를 권해요. 한 대형 연구에서 한 번에
          가장 길게 뛴 거리보다 10% 넘게 길게 뛴 날에 부상이 늘었어요.
        </P>
        <P>
          어디까지 늘려야 하는지는 정해진 답이 없어요. 다만 앞의 설문에서 가장 길게 뛴 거리가 <strong>25km 미만</strong>이면 더 느리게
          완주하는 경향이 있었어요.
        </P>
        <Steps
          items={[
            { t: "긴 날은 지난 30일 가장 길게 뛴 거리의 110% 안에서 늘려요." },
            {
              t: "일주일 거리도 한꺼번에 늘리지 않기를 권해요.",
              d: "최근 일주일을 갑자기 늘린 날이 많을수록 더 다쳤다는 결과와 반대 결과가 함께 있어서, 긴 날 기준만큼 확실하지는 않아요.",
            },
            { t: "4주마다 한 번은 줄이는 주를 넣어요.", d: "같은 주에 긴 날도 짧게 잡아요." },
          ]}
        />

        <h3 id="long-runs" className={`${H3} scroll-mt-20`}>하프를 달려 봤다면 긴 달리기는 6주에 30km까지</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-base">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="whitespace-nowrap p-2.5">주</th>
                <th className="whitespace-nowrap p-2.5">가장 길게 뛰는 날</th>
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
          이 표는 저희가 만든 예시예요. 매주 긴 날이 직전 30일 가장 길게 뛴 거리의 110%를 넘지 않게 짰어요. 30km에서 멈추는 것과
          줄이는 주도 저희가 정한 것이고, 풀코스 준비 기간이나 어디까지 늘릴지를 정한 연구는 찾지 못했어요.
        </Caveat>

        <OneLine>긴 날은 지난 한 달 가장 길게 뛴 거리에서 조금씩 늘리고, 4주마다 한 번은 줄여요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="injury" className={H2}>
          <Num n={3} />풀코스 준비하다 다치는 일, 흔한가요?
        </h2>
        <P>
          <strong>흔해요.</strong> 한 연구에서 풀코스를 준비하는 16주 동안 <strong>40%</strong>가 다쳤어요.
        </P>
        <P>
          처음 풀코스를 준비한 러너가 완주를 못 하게 된 부상 가운데는 뼈 스트레스 부상(같은 충격이 쌓여 뼈가 버티지 못해 생기는
          부상)도 적지 않았어요. 뼈의 한 지점이 콕 집어 아프다면 대처가 달라요.
        </P>
        <Steps
          items={[
            { t: "달리는 중에 아픔이 커지면 그날은 멈춰요." },
            { t: "다음 날 아침에 더 아프면 거리를 줄여요." },
            { t: "쉬어도 나아지는 느낌이 없으면 진료를 받아 보세요." },
          ]}
        />
        <Caveat>이 세 가지는 저희가 정한 기준이고, 진단을 대신하지 않아요.</Caveat>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/return-to-running#bone" className={pill}>뼈의 한 곳이 콕 집어 아프다면 →</Link>
          <Link href="/injury/it-band" className={pill}>무릎 바깥이 아프다면 →</Link>
          <Link href="/injury/achilles" className={pill}>아킬레스건이 아프다면 →</Link>
        </div>

        <OneLine>다치는 일은 흔해요. 아픔이 커지면 멈추고, 다음 날 더 아프면 줄여요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="wall" className={H2}>
          <Num n={4} />후반에 무너지는 벽은 왜 오나요?
        </h2>
        <P>
          흔히 약 32km 이후에 <strong>몸에 저장된 에너지가 바닥나서</strong> 온다고 설명해요. 이렇게 후반에 크게 느려지는 걸 벽이라고
          해요. 많은 기록을 분석해 보니 남자 러너의 28%, 여자 러너의 17%가 겪었어요.
        </P>
        <P>
          목표를 너무 빠르게 잡기도 쉬워요. 하프 기록으로 풀코스 기록을 계산하는 리겔 공식은 러너 절반에게서 실제보다{" "}
          <strong>10분 이상 빠르게</strong> 나왔어요.
        </P>
        <Steps
          items={[
            {
              t: "목표 페이스는 계산 값보다 느리게 잡기를 권해요.",
              d: <><Link href="/tools/pace#predict-h" className={linkCls}>페이스 계산기</Link>의 풀코스 값은 가장 빠른 쪽으로 보세요.</>,
            },
            { t: "전반을 목표 페이스보다 빠르게 달리지 않아요." },
            { t: "긴 달리기 연습 날 대회 페이스와 보급을 미리 맞춰 봐요." },
          ]}
        />

        <OneLine>목표는 계산 값보다 느리게 잡고, 전반은 누르고, 보급은 연습 날 맞춰 봐요.</OneLine>

        {/* ── 5 ─────────────────────────────────────────── */}
        {/* 물·저나트륨혈증 문장은 half-marathon-race-day 와 같은 판정·같은 말(docs/판정/half-marathon-race-day.jsonl) */}
        <h2 id="fuel" className={H2}>
          <Num n={5} />풀코스에서 젤과 물은 얼마나 챙기나요?
        </h2>
        <P>
          <strong>2~3시간 달린다면 시간당 약 60g까지</strong>가 권하는 탄수화물 양이에요. 가장 긴 경기에서는 시간당 75~90g이 도움이 될
          수 있다는 리뷰도 있지만, 배탈 위험과 함께 따져 연습으로 맞춰야 해요.
        </P>
        <P>
          <strong>물은 목마를 때 마셔요.</strong> 필요 이상으로 마시면 저나트륨혈증(물을 너무 많이 마셔 피 속 나트륨이 묽어진 상태)이 올
          수 있어요. 한 마라톤 연구에서는 달리는 동안 체중이 늘 만큼 마신 사람과 오래 걸려 들어온 사람에게 더 많았어요.
        </P>
        <Steps
          items={[
            { t: "젤 포장에 적힌 탄수화물 양으로 몇 개가 필요한지 계산해 봐요.", d: "제품마다 양이 달라요." },
            { t: "대회 때 먹을 젤을 긴 달리기 연습 날 같은 방식으로 먹어 봐요.", d: "연습에서 해 보지 않은 양으로 늘리지 않아요." },
            {
              t: "메스껍거나 머리가 심하게 아프면 물을 더 마시지 말고 의료진에게 가요.",
              d: "열사병이나 저혈당과 증상이 겹쳐서 스스로 가리기 어려워요.",
            },
          ]}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/half-marathon-race-day" className={pill}>대회 날 물과 젤을 더 자세히 보려면 →</Link>
        </div>

        <OneLine>젤은 연습 날 먹어 본 만큼만, 물은 목마를 때 마셔요.</OneLine>

        {/* ── 6 ─────────────────────────────────────────── */}
        <h2 id="taper" className={H2}>
          <Num n={6} />대회 전에는 훈련을 얼마나 줄이나요?
        </h2>
        <P>
          <strong>대회 2~3주 전부터 거리를 줄이고, 빠르게 뛰는 날과 달리는 횟수는 그대로</strong> 두는 편이 좋아요. 이렇게 대회 전에
          훈련을 줄이는 기간을 테이퍼라고 해요.
        </P>
        <P>
          경기 선수들의 연구를 모아 보니 2주 동안 거리를 41~60% 줄이고 강도와 횟수는 그대로 둔 방식이 기록에 가장 좋았어요. 취미
          마라토너의 훈련 기록에서도 3주 동안 꾸준히 줄인 사람들이 더 빨리 완주하는 경향이 있었어요.
        </P>
        <Steps
          items={[
            { t: "대회 3주 전부터 긴 날과 일주일 거리를 주마다 조금씩 줄여요.", d: "마지막 주에 한꺼번에 줄이지 않아요." },
            { t: "빠르게 뛰는 날은 빼지 말고 거리만 짧게 해요." },
          ]}
        />
        <Caveat>2주 결과는 경기 선수들, 3주 결과는 기록을 관찰한 것이라 취미 러너에게 꼭 맞는다고 단정하긴 어려워요.</Caveat>
        <P>풀코스를 완주했다면 다음은 기록 단축이에요.</P>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/injury/get-faster" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            기록 단축 →
          </Link>
          <Link href="/injury/advanced-guide" className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:border-gray-300">
            숙련자 가이드
          </Link>
        </div>

        <OneLine>대회 전 2~3주는 거리만 줄이고, 빠르게 뛰는 날은 남겨 둬요.</OneLine>

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Fokkema et al. (2020)</strong> 네덜란드 풀코스 참가자 441명 설문에서 일주일 40km 미만과 가장 길게 뛴 거리 25km 미만은 더 느린 완주, 65km 초과는 더 빠른 완주와 관련 있었어요. 훈련량·가장 긴 달리기와 부상의 관련은 나타나지 않았어요(하프 참가자 556명도 함께 분석).
            <Ref>Scand J Med Sci Sports 30(9):1692-1704 · <a href="https://pubmed.ncbi.nlm.nih.gov/32421886/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Rasmussen et al. (2013)</strong> 마라톤 완주자 662명 회고 연구에서 일주일 30km 미만으로 준비한 사람의 부상 위험이 30~60km보다 2.02배(1.26~3.24)였어요. 60km 초과는 차이가 없었어요. 완주한 사람만 본 연구예요.
            <Ref>Int J Sports Phys Ther 8(2):111-20 · <a href="https://pubmed.ncbi.nlm.nih.gov/23593549/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Frandsen et al. (2025)</strong> 한 번 달린 거리가 지난 30일 최장 거리보다 10% 넘게 길면 부상이 늘었어요. 최근 일주일과 그전 3주를 비교한 비율은 반대 방향이었고, 전주 대비 비율은 관계가 없었어요(성인 러너 5,205명, 평균 45.8세 — 풀코스를 준비하는 사람만 모은 연구가 아니에요).
            <Ref>Br J Sports Med 59(17):1203-1210 · <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Toresdahl et al. (2023)</strong> 뉴욕마라톤 참가자 735명을 대회 전 16주 따라가니 훈련 중 40.0%가 다쳤어요. 최근 7일 거리를 28일 거리와 비교한 비율이 1.5 이상인 날이 많을수록 부상이 많았어요(하루당 OR 1.06, 1.02~1.10).
            <Ref>Br J Sports Med 57(3):146-152 · <a href="https://pubmed.ncbi.nlm.nih.gov/36113976/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Toresdahl et al. (2020)</strong> 첫 풀코스 러너 720명에게 12주 동안 주 3회 10분짜리 근력 프로그램을 준 무작위 시험이에요. 부상으로 완주하지 못한 비율이 7.1%와 7.3%였어요(상대위험 0.97, 0.57~1.63). 완주를 막은 큰 부상 64건 중 52건이 과사용이었고, 그중 20건이 뼈 스트레스 부상이었어요.
            <Ref>Sports Health 12(1):74-79 · <a href="https://pubmed.ncbi.nlm.nih.gov/31642726/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={6}>
            <strong>Smyth (2021)</strong> 400만 건 넘는 마라톤 기록에서 후반에 크게 느려진 비율이 남성 28%, 여성 17%였어요(기록으로 정의한 대리 지표). 벽은 흔히 20마일(약 32km) 이후, 대개 에너지 저장이 바닥나서 온다는 설명은 논문 서론의 설명이에요.
            <Ref>PLOS ONE 16(5):e0251513 · <a href="https://pubmed.ncbi.nlm.nih.gov/34010308/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={7}>
            <strong>Vickers &amp; Vertosick (2016)</strong> 취미 러너 2,303명 설문에서 리겔 공식은 하프까지는 잘 맞았지만 풀코스는 러너 절반에게서 적어도 10분 빠르게 예측했어요.
            <Ref>BMC Sports Sci Med Rehabil 8(1):26 · <a href="https://pubmed.ncbi.nlm.nih.gov/27570626/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={8}>
            <strong>Jeukendrup (2014)</strong> 2~3시간 운동은 시간당 약 60g, 초장거리는 약 90g을 권했어요. 그만큼 많이 먹을 때는 여러 종류의 당이 섞인 것이어야 하고, 강도가 낮으면 양을 낮춰야 할 수 있다고 적었어요.
            <Ref>Sports Med 44 Suppl 1:S25-33 · <a href="https://pubmed.ncbi.nlm.nih.gov/24791914/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={9}>
            <strong>Burke et al. (2019)</strong> 장거리 육상 선수 영양 리뷰예요. 시간당 75~90g은 가장 긴 경기에 해당하고, 대회 영양 계획은 개인에 맞춰 미리 연습해 둔 것으로 하되 배탈 위험과 함께 따지라고 적었어요.
            <Ref>Int J Sport Nutr Exerc Metab 29(2):117-129 · <a href="https://pubmed.ncbi.nlm.nih.gov/30747558/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={10}>
            <strong>Altieri et al. (2026)</strong> 운동 중 저나트륨혈증의 원인은 과하게 마신 물과 운동 중 항이뇨호르몬 분비이고, 증상은 메스꺼움·구토·두통·혼란에서 혼수까지예요. 목마르기 전에 마시라는 권고는 목마를 때 마시기로 바꿔야 한다고 적었어요.
            <Ref>J Endocrinol Invest 49(1):1-10 · <a href="https://pubmed.ncbi.nlm.nih.gov/40913680/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={11}>
            <strong>Almond et al. (2005)</strong> 2002년 보스턴 마라톤 완주 직후 피를 뽑은 488명 중 13%가 저나트륨혈증이었어요. 여러 요인을 함께 따지니 달리는 중 체중 증가(OR 4.2), 4시간 넘는 완주(3시간 30분 미만 대비 OR 7.4)와 관련 있었어요.
            <Ref>N Engl J Med 352(15):1550-6 · <a href="https://pubmed.ncbi.nlm.nih.gov/15829535/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={12}>
            <strong>Bosquet et al. (2007)</strong> 여러 종목의 경기 선수 연구 27편을 모은 메타분석이에요. 2주 동안 훈련량을 41~60% 줄이고 강도와 빈도는 그대로 두는 방식이 기록에 가장 효과적이었어요.
            <Ref>Med Sci Sports Exerc 39(8):1358-65 · <a href="https://pubmed.ncbi.nlm.nih.gov/17762369/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={13}>
            <strong>Smyth &amp; Lawlor (2021)</strong> 취미 마라토너 15만 8천여 명의 훈련 기록에서 3주 동안 꾸준히 줄인 사람이 최소한으로 줄인 사람보다 완주가 중앙값 5분 32초(2.6%) 빨랐어요. 64%는 덜 엄격하게 줄이고 있었어요(관찰 분석).
            <Ref>Front Sports Act Living 3:735220 · <a href="https://pubmed.ncbi.nlm.nih.gov/34651125/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지거나 지병이 있다면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
