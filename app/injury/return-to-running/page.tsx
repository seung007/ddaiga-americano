import type { Metadata } from "next";
import Link from "next/link";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, H3, Warn, Num, KeyPoints, Steps, OneLine, Caveat, Sources, Src, Ref } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

/**
 * 부상 후 복귀 (2026-10-06)
 *
 * 왜 이 글인가
 *   DC 러닝 갤러리 「부상관리」 말머리 300건(2025-10~2026-10)을 제목으로 분류했더니
 *   「쉬어야 하나·언제 복귀하나」가 25건으로 병원·진단(15건)보다 많았다. 이 사이트에는 그 질문에 답하는 글이 없었다.
 *   (집계는 건수만 남겼다. 원 제목·닉네임은 저장하지 않는다.)
 *
 * 규칙
 *   · 숫자는 초록에서 직접 확인한 값만. 복귀 진도는 사이트 예시라고 적는다.
 *   · 그 모델은 힘줄·무릎 통증 연구에서 쓰였다. 뼈 부상(피로골절)에 쓰라는 근거는 없어서 따로 떼어 적는다.
 *
 * 2026-10-13 가독성 재설계 — 섹션마다 답 → 할 일 → 근거(접힘).
 *
 * 2026-11-18 확정 틀로 바꿈 (AGENTS.md 「가이드 글 틀 — 2026-11-18 확정」, 견본 app/injury/start-running/page.tsx)
 *   · 말투 「~니다」 → 「~요」. 날짜 한 줄 · 3줄 요약 · 번호 붙은 큰 질문 · 절 끝 한 줄 요약 · 글 끝 접힌 「근거와 출처」.
 *     옛 부품(한눈에 상자 · 이렇게 하세요 상자 · 근거 보기 접힘 · 참고 문헌 · ※ 단서 · 근거 딱지) 여섯 개를 걷어냈다.
 *     (옛 부품 이름을 주석에 적으면 check:geo 가 글에 남은 것으로 세므로 풀어서 적는다.)
 *   · 큰 절 6개 → 5개. id 는 그대로 유지했다(다른 글이 #bone·#rest-or-run·#comeback 을 건다).
 *     체력 절과 「근력운동을 하면 덜 다치나요?」 소제목은 곁가지라 FAQ 로 내렸다(본문과 FAQ 중복 금지).
 *
 *   고친 것 — 주장을 초록으로 다시 판정한 결과(판정 기준: Project 문서 「처음 달리기 글 근거 판정」 + 견본 머리 주석)
 *   · **통증 모니터링 모델 0~2 / 2~5 / 5 초과 표를 지웠다.** 2026-11-18 Ullern 2025 초록을 직접 열어 확인한 결과
 *     초록에는 숫자 구간이 없다. 있는 말은 「허용 기준이 연구마다 제각각이고 합의와 근거가 없다」까지다.
 *     견본 판정표의 「통증 감시 모델의 숫자 규칙(예: 10점 중 5점) — 초록에 없음, 쓰지 않는다」와 같은 판정이다.
 *     대신 멈출 신호를 사이트 기준(「권해요」 말투)으로 적었다. 숫자를 뺀 자리를 다른 숫자로 메우지 않았다.
 *   · **Relph 2023 OR 7.56 을 뺐다.** 논문 안에서 뜻이 둘(완주 예측 / 새 부상 위험)이고 신뢰구간 2.06–27.75 로 넓다.
 *     방향 진술도 하지 않았고, 이 글에서 Relph 출처 자체를 뺐다(같은 자리를 Saragiotto 2014 가 받친다).
 *   · **Linton 2018 「86%」의 분모를 문장에 넣었다.** 「지금 다친 러너 대부분」으로, 모든 러너가 아니다.
 *     숫자(570명 중 86%)는 접힌 출처에만 뒀다 — 견본이 2026-11-18 에 출판본 초록에서 86% 로 확인한 값이다.
 *   · **엑스레이가 초기에 안 보인다는 문장을 뺐다.** 이번에 초록으로 확인하지 못했다. 대체 설명을 만들지 않았다.
 *   · **「쉬어도 2주 넘게 나아지지 않으면 진료」의 날짜 숫자를 뺐다.** 멈춤 신호의 기간은 판정 보류여서
 *     날짜 숫자를 쓰지 않는다(견본과 같은 판정). 「나아지는 느낌이 없으면」으로 바꿨다.
 *   · 한 연구에 기댄 단정문의 세기를 낮췄다: 회복 기간·아킬레스 시험·110%·부위별 복귀 기간에 「한 연구에서」
 *     「한 무작위 시험에서」「한 메타분석에서」를 붙였다. 지난 12개월 부상(Saragiotto, 확실)만 단정으로 뒀다.
 *   · Silbernagel 2011(5년 추적 80%)·Wilber 1996(물속 달리기)은 같은 결론을 두 번 말해서 뺐다 — 숫자를 고친 게 아니라 덜어낸 것이다.
 *
 *   확인 못 한 것 (2026-11-18, 다음에 네트워크가 되면 여기부터) — 비워 두지 않고 적어 둔다
 *   · 출처의 **숫자와 주장은 전부 이번에 초록을 직접 열어 대조했다**(QxMD·Europe PMC). 다만 아래 여섯 편은
 *     권·호·쪽까지는 다시 못 열었다 — PubMed 가 봇 확인 페이지로 막혔고 Europe PMC 는 요청 한도에 걸렸다.
 *     Fokkema 2019 · Hoenig 2023 · Lauersen 2014 · Toresdahl 2020 · Mujika 2000 · Eyestone 1993.
 *     서지는 이 저장소가 2026-10-06 에 대조해 둔 값을 그대로 뒀다(새로 지어낸 값이 아니다). 다음에 한 번 더 대조한다.
 *   · Ullern 2025 는 권·호·쪽을 아예 확인하지 못해 **학술지 이름까지만 적었다.** 숫자를 지어내 채우지 않는다.
 *   · Schroeder 2024(AAFP)는 이번에 직접 열지 않았다 — 판정 보고서 「처음 달리기 글 근거 판정」에서 확인된 서지를 그대로 썼다.
 */

const PAGE_URL = pageUrl("/injury/return-to-running");
const TITLE = "부상 후 러닝, 언제까지 쉬어야 하나요?";
const DESC =
  "다친 뒤 꼭 완전히 쉬어야 하는지, 통증이 어느 정도면 달려도 되는지, 다시 뛸 때 얼마부터 시작할지 다룹니다. 회복은 생각보다 오래 걸립니다.";

export const metadata: Metadata = {
  title: "부상 후 러닝, 언제까지 쉬어야 하나요? | 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/return-to-running" },
};

// 2026-11-18: FAQ 는 본문 큰 질문과 겹치지 않는 것만 둔다. 체력·근력운동은 본문에서 내려온 곁가지다.
// 전문어는 문항마다 다시 풀이한다 — 답 하나만 따로 인용되기 때문이다(check:geo 가 본다)

const FAQ: FaqItem[] = [
  {
    q: "쉬는 동안 체력이 다 빠지나요?",
    a: "다 빠지지는 않아요. 쉬는 동안 **아프지 않은 운동**(물속 달리기, 자전거)을 해 보세요. 그렇게 6주를 대신한 연구에서 **약 3.2km 달리기 기록은 그대로**였어요. 다만 꾸준히 훈련해 온 사람은 **4주만 쉬어도** 심폐 체력 수치가 빠르게 떨어지는 편이에요.",
  },
  {
    q: "근력운동을 하면 덜 다치나요?",
    a: "달리기에서는 효과가 뚜렷하지 않았어요. 해도 되지만 **근력운동을 했다고 거리를 더 늘리지는 마세요.** 첫 풀마라톤을 준비하는 러너에게 근력 프로그램을 준 시험에서, 부상으로 완주하지 못한 비율이 7.1%와 7.3%로 거의 같았어요.",
  },
  {
    q: "통증이 몇 점이면 달려도 되나요?",
    a: "몇 점까지 괜찮다고 정해진 기준은 없어요. 점수 대신 **달리는 중에 아픔이 커지면 그날은 멈추고, 다음 날 아침에 전날보다 아프면 다음 번 거리를 줄이길** 권해요. 운동 중 통증 기준을 모은 리뷰에서도 기준이 연구마다 제각각이었어요.",
  },
  {
    q: "다시 뛰기 시작했는데 같은 곳이 또 아파요.",
    a: "**한 단계 뒤로 돌아가는** 편이 좋아요. 다친 곳이 또 아픈 건 아직 덜 나았다는 쪽에 가까워요. **쉬는데도 나아지지 않으면 진료를** 받아 보세요. 지난 12개월 안에 다친 적이 있으면 또 다치기 쉽다는 건 여러 연구에서 가장 꾸준히 나온 결과예요.",
  },
];

export default function ReturnToRunningPage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} datePublished="2026-10-06" />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["부상 후 복귀", "/injury/return-to-running"],
        ]}
      />
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">회복 · 모든 단계</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/return-to-running" compact checked={13} />

        <KeyPoints
          items={[
            <>낫는 데 <strong>두 달쯤</strong> 걸린 사람이 절반이었어요. 한두 주로 계획을 잡으면 조바심만 나요.</>,
            <>힘줄이 아픈 거라면 꼭 완전히 쉬지 않아도 괜찮았어요. 뼈가 콕 집어 아프면 <strong>달리기를 멈추고 진료부터</strong> 받으세요.</>,
            <>다시 뛸 때는 다치기 전 거리를 기준으로 삼지 말고, <strong>요즘 뛴 거리에서</strong> 늘리기를 권해요.</>,
          ]}
        />

        <Lead>
          다친 뒤 언제 다시 뛸 수 있을지 조바심이 난다면, 회복이 <strong>생각보다 오래 걸린다</strong>는 것부터 알아 두세요. 초보
          러너를 따라간 한 연구에서 낫는 데 걸린 기간은 주 단위가 아니라 달 단위였어요.
        </Lead>

        <TableOfContents
          items={[
            { id: "how-long", label: "얼마나 걸리나요?" },
            { id: "rest-or-run", label: "무조건 쉬어야 하나요?" },
            { id: "bone", label: "뼈가 아픈 거라면" },
            { id: "comeback", label: "다시 뛸 때 얼마부터" },
            { id: "again", label: "또 다치지 않으려면" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="how-long" className={H2}>
          <Num n={1} />다 나으려면 얼마나 걸리나요?
        </h2>
        <P>
          <strong>복귀 날짜를 먼저 못 박지 말고, 달 단위로 생각해 보세요.</strong> 다친 초보 러너를 나을 때까지 따라간 한 연구에서
          낫는 데 <strong>두 달쯤</strong> 걸린 사람이 절반이었고, 한 해 넘게 걸린 사람도 있었어요.
        </P>
        <P>
          예전에 다친 적이 있으면 더 오래 가는 편이었어요. 그래서 같은 곳을 또 다친 거라면 처음보다 느긋하게 봐야 해요.
        </P>
        <Steps
          items={[
            { t: "다음 대회 날짜부터 바꿔요.", d: "날짜를 지키려고 진도를 당기면 그 자리에서 다시 다쳐요." },
            { t: "아픈 정도를 날마다 한 줄씩 적어요.", d: "좋아지는 중인지는 기억보다 기록이 정확해요." },
            { t: "쉬는데도 나아지는 느낌이 없으면 진료를 받아요." },
          ]}
        />

        <OneLine>복귀 날짜를 먼저 정하지 말고, 낫는 속도를 보고 정해요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="rest-or-run" className={H2}>
          <Num n={2} />아프면 무조건 쉬어야 하나요?
        </h2>
        <P>
          <strong>힘줄이 아픈 거라면 꼭 완전히 쉬지 않아도 괜찮아요.</strong> 아킬레스 힘줄이 아픈 사람을 두 쪽으로 나눈 한 무작위
          시험에서, 아픈 정도를 보면서 달리기와 점프를 이어간 쪽과 6주 쉰 쪽의 회복이 비슷했어요.
        </P>
        <P>
          그렇다고 아픈 걸 참고 뛰라는 말은 아니에요. 아픔이 커지는 날에 멈추는 것이 이어가는 조건이에요.
        </P>
        <Steps
          items={[
            { t: "달리는 중에 아픔이 커지면 그날은 멈춰요.", d: "참고 더 뛰어서 얻는 건 없어요." },
            { t: "다음 날 아침에 전날보다 아프면 다음 번에 거리를 줄여요." },
            { t: "걸을 때도 아프면 그날은 그만둬요." },
          ]}
        />
        <Caveat>이 세 가지는 저희가 정한 기준이고, 진단을 대신하지 않아요.</Caveat>

        <OneLine>힘줄이 아픈 거라면 완전히 멈추지 않아도 괜찮았어요. 대신 아픔이 커지는 날은 쉬어요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="bone" className={H2}>
          <Num n={3} />뼈가 아픈 거라면 어떻게 하나요?
        </h2>
        <P>
          <strong>뼈의 한 지점을 누르면 콕 집어 아프면, 달리기를 멈추고 진료부터 받으세요.</strong> 피로골절은 같은 충격이 반복돼
          뼈에 생기는 가는 금이에요. 누르면 콕 집어 아픈 그 한 점이 피로골절을 의심하는 핵심 신호예요.
        </P>
        <Warn title="이럴 땐 달리기를 멈추고 진료를 받으세요">
          <ul className="list-disc space-y-1 pl-5">
            <li>뼈의 한 지점을 누르면 콕 집어 아프다</li>
            <li>쉬어도 아프다, 밤에도 아프다</li>
            <li>붓거나 열감이 있다</li>
          </ul>
        </Warn>
        <P>
          낫는 기간은 뼈의 위치에 따라 크게 달랐어요. 한 메타분석에서 운동으로 돌아가기까지 정강이뼈 뒤안쪽은{" "}
          <strong>44일</strong>, 발 주상골은 <strong>127일</strong>이었어요. 전체로는 열 명 중 아홉 넘게 운동으로 돌아갔어요.
        </P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/shin-splints" className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400">정강이가 아픈 거라면 →</Link>
          <Link href="/injury/achilles" className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400">아킬레스가 아픈 거라면 →</Link>
        </div>

        <OneLine>뼈 한 점이 콕 집어 아프면 기다리지 말고 진료부터 받아요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="comeback" className={H2}>
          <Num n={4} />다시 뛸 때 얼마부터 시작하나요?
        </h2>
        <P>
          <strong>기준은 다치기 전 기록이 아니라 요즘 뛴 거리예요.</strong> 한 번에 뛰는 거리를 지난 30일 가장 길게 뛴 거리의{" "}
          <strong>110%</strong> 안에서 늘려 보세요. 한 대형 연구에서 그보다 10% 넘게 길게 뛴 날에 부상이 늘었어요.
        </P>
        <P>
          한 달을 쉬었다면 지난 30일 가장 길게 뛴 거리는 0에 가까워요. 다치기 전에 15km를 뛰었어도 기준은 지금이에요.
        </P>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-base">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="whitespace-nowrap p-2.5">단계</th>
                <th className="p-2.5">할 것</th>
                <th className="p-2.5">넘어가는 조건</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1", "빠르게 걷기 30분", "걷는 동안·다음 날 아침 아프지 않음"],
                ["2", "걷기와 달리기 섞기 (1분 달리고 2분 걷기부터)", "같은 조건으로 3회"],
                ["3", "달리는 구간을 늘려 20~30분 이어 달리기", "같은 조건으로 3회"],
                ["4", "가장 긴 날을 지난 30일 최장 거리의 110% 안에서", "다치기 전 거리까지"],
              ].map(([k, what, cond]) => (
                <tr key={k} className="border-t border-gray-100">
                  <td className="p-2.5 font-semibold text-gray-900">{k}</td>
                  <td className="break-keep p-2.5 text-gray-700">{what}</td>
                  <td className="break-keep p-2.5 text-gray-500">{cond}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Caveat>
          표는 저희가 만든 예시예요. 복귀 진도를 검증한 연구는 찾지 못했어요. 110% 연구도 복귀하는 러너만 모은 것이 아니라,
          복귀에 적용하는 건 저희 판단이에요. 진료를 받았다면 의료진의 계획이 먼저예요.
        </Caveat>
        <P>
          2~3단계는 처음 달리기 글의 <Link href="/injury/start-running#progression" className="text-emerald-700 underline">걷기와 달리기를 섞는 표</Link>를 그대로 써도 돼요.
        </P>

        <OneLine>다치기 전 거리가 아니라, 요즘 뛴 거리에서 조금씩 늘려요.</OneLine>

        {/* ── 5 ─────────────────────────────────────────── */}
        <h2 id="again" className={H2}>
          <Num n={5} />또 다치지 않으려면 어떻게 하나요?
        </h2>
        <P>
          <strong>다 낫기 전에 돌아가지 마세요.</strong> 지난 12개월 안에 다친 적이 있으면 또 다치기 쉬워요. 여러 연구를 모은
          고찰에서 가장 꾸준한 위험 요인이었어요.
        </P>
        <P>
          그런데 한 설문에서는 지금 다친 러너 대부분이 아픈 채로 계속 달리고 있었어요. 조바심이 드는 게 보통이라는 뜻이기도 해요.
        </P>
        <Steps
          items={[
            { t: "아프지 않은 날이 이어진 다음에 거리를 늘려요.", d: "한 번 괜찮았다고 늘리지 않아요." },
            { t: "다친 곳이 다시 아프면 한 단계 뒤로 가요." },
            { t: "속도는 가장 마지막에 올려요.", d: "거리와 속도를 같은 주에 같이 올리지 않는 것을 권해요." },
          ]}
        />

        <h3 className={H3}>아픈 곳별 대처는 그 글에서 더 자세히</h3>
        <P>
          <Link href="/injury/it-band" className="text-emerald-700 underline">무릎 바깥이 아프다면 →</Link>
          {" · "}
          <Link href="/injury/knee-pain" className="text-emerald-700 underline">무릎 앞이 아프다면 →</Link>
          {" · "}
          <Link href="/injury/shin-splints" className="text-emerald-700 underline">정강이가 아프다면 →</Link>
          {" · "}
          <Link href="/injury/plantar-fasciitis" className="text-emerald-700 underline">발바닥이 아프다면 →</Link>
          {" · "}
          <Link href="/injury/achilles" className="text-emerald-700 underline">아킬레스가 아프다면 →</Link>
        </P>

        <OneLine>덜 다치려면, 다 낫고 나서 돌아가는 편이 좋아요.</OneLine>

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Nielsen et al. (2014)</strong> 다친 초보 러너 254명 중 나은 220명의 회복 기간 중앙값은 71일(9~617일)이었어요. 10주가 지나도 절반은 통증 없이 500m를 두 번 달리지 못했고, 약 5%는 수술을 받았어요.
            <Ref>PLOS ONE 9(6):e99877 · <a href="https://pubmed.ncbi.nlm.nih.gov/24923269/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Fokkema et al. (2019)</strong> 초보 프로그램 참가자 중 다친 347명의 부상 기간 중앙값은 8주(1~52주)였어요. 예전에 다친 적이 있으면 10주 넘게 가는 쪽이 많았어요(오즈비 2.31, 1.12~4.79).
            <Ref>J Sci Med Sport 22(3):259-263 · <a href="https://pubmed.ncbi.nlm.nih.gov/30268637/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Silbernagel et al. (2007)</strong> 아킬레스 힘줄이 아픈 38명을 나눠, 아픈 정도를 보며 달리기와 점프를 이어간 쪽과 6주 쉰 쪽을 12개월 비교했어요. 두 쪽 모두 좋아졌고 차이는 없었어요.
            <Ref>Am J Sports Med 35(6):897-906 · <a href="https://pubmed.ncbi.nlm.nih.gov/17307888/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Ullern et al. (2025)</strong> 운동 중 통증을 어디까지 허용하는지 모은 리뷰예요. 기준이 연구마다 넓게 갈렸고, 합의와 근거가 없다고 적혀 있어요. 초록에는 점수 구간이 없어서 이 글은 숫자를 쓰지 않았어요.
            <Ref>BMC Musculoskelet Disord · <a href="https://read.qxmd.com/read/39987051" target="_blank" rel="noopener noreferrer">초록</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Schroeder et al. (2024)</strong> 뼈의 한 지점을 누를 때 아픈 것이 피로골절 진찰에서 가장 중요한 소견이에요. 그냥 두면 완전 골절로 갈 수 있어요.
            <Ref>Am Fam Physician 110(6):592-600 · <a href="https://www.aafp.org/afp/2024/1200/bone-stress-injuries" target="_blank" rel="noopener noreferrer">AAFP</a></Ref>
          </Src>
          <Src n={6}>
            <strong>Hoenig et al. (2023)</strong> 뼈 스트레스 부상 2,974건을 모은 메타분석이에요. 운동 복귀까지 정강이뼈 뒤안쪽 44일, 종아리뼈 56일, 대퇴골 경부 107일, 발 주상골 127일이었고, 전체로는 90%가 넘게 복귀했어요.
            <Ref>Br J Sports Med 57(7):427-432 · <a href="https://pubmed.ncbi.nlm.nih.gov/36720584/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={7}>
            <strong>Frandsen et al. (2025)</strong> 한 번 달린 거리가 지난 30일 최장 거리보다 10% 넘게 길면 부상이 늘었어요(성인 러너 5,205명, 평균 45.8세 — 복귀하는 러너만 모은 연구가 아니에요).
            <Ref>Br J Sports Med 59(17):1203-1210 · <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={8}>
            <strong>Saragiotto et al. (2014)</strong> 가장 일관된 부상 위험 요인은 지난 12개월 안의 부상이었어요.
            <Ref>Sports Med 44(8):1153-63 · <a href="https://pubmed.ncbi.nlm.nih.gov/24809248/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={9}>
            <strong>Linton &amp; Valentin (2018)</strong> 지금 다친 러너 570명 중 86%가 아픈 채로 계속 달렸어요(파크런 러너 설문).
            <Ref>J Sci Med Sport 21(12):1221-1225 · <a href="https://pubmed.ncbi.nlm.nih.gov/29853263/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={10}>
            <strong>Eyestone et al. (1993)</strong> 훈련된 32명을 물속 달리기, 자전거, 달리기로 나눠 6주 훈련했어요. 세 쪽 모두 최대산소섭취량이 조금 줄었지만 약 3.2km(2마일) 달리기 기록은 그대로였고, 쪽끼리 차이도 없었어요.
            <Ref>Am J Sports Med 21(1):41-4 · <a href="https://pubmed.ncbi.nlm.nih.gov/8427367/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={11}>
            <strong>Mujika &amp; Padilla (2000)</strong> 4주가 안 되는 휴식을 다룬 고찰이에요. 잘 훈련된 사람은 최대산소섭취량과 혈액량이 빠르게 줄고, 최근에 훈련을 시작한 사람은 변화가 더 작았어요.
            <Ref>Sports Med 30(2):79-87 · <a href="https://pubmed.ncbi.nlm.nih.gov/10966148/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={12}>
            <strong>Lauersen et al. (2014)</strong> 여러 종목의 무작위 시험 25편(26,610명)을 모은 메타분석이에요. 근력운동을 한 쪽의 부상이 3분의 1 수준이었어요(상대위험 0.315, 0.207~0.480). 달리기만 모은 분석은 아니에요.
            <Ref>Br J Sports Med 48(11):871-7 · <a href="https://pubmed.ncbi.nlm.nih.gov/24100287/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={13}>
            <strong>Toresdahl et al. (2020)</strong> 첫 풀마라톤 러너 720명에게 12주 동안 주 3회 10분짜리 근력 프로그램을 준 무작위 시험이에요. 부상으로 완주하지 못한 비율이 7.1%와 7.3%로 차이가 없었어요(상대위험 0.97, 0.57~1.63).
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
