import type { Metadata } from "next";
import Link from "next/link";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, Num, KeyPoints, Steps, OneLine, Caveat, Sources, Src, Ref } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

/**
 * 5단계 — 완주 → 기록 단축 (2026-10-07)
 *
 * 커뮤니티 질문 800건 중 「X분 가능할까요?」가 8%였다. 이 글은 「어떻게 빨라지나」와 「예측을 얼마나 믿나」를 같이 다룬다.
 * 2026-10-13 가독성 재설계 · 2026-11-10 제목을 채팅 말로 — 경위는 git 기록.
 *
 * 2026-11-23 확정 틀로 바꿈 (docs/운영/가이드_틀.md, 견본 app/injury/start-running/page.tsx)
 *   판정 전부: docs/판정/get-faster.jsonl. 초록 13편은 2026-11-23 크롬으로 PubMed 를 직접 열어 읽었다(요약만).
 *
 *   틀 — 옛 부품 여섯 개(한눈에 상자 · 이렇게 하세요 상자 · 근거 보기 접힘 · 글 끝 문헌 목록 · 근거 수준 딱지 · 단서 상자)를 걷어냈다.
 *     (옛 부품 이름을 주석에 적으면 check:geo 가 글에 남은 것으로 세므로 풀어서 적는다.)
 *     큰 절 6개는 그대로 6개. id(volume·intensity·strength·week·race·injury)도 그대로 — 이 글의 앵커를 거는 곳은 없다(grep 2026-11-23).
 *     작은 질문 넷 중 기록 예측·후반 붕괴는 FAQ 로(본문과 FAQ 에 같은 내용을 두지 않는다), 인터벌 대 이어 달리기는 2절 안으로,
 *     카본화는 5절 끝 링크로. 옛 FAQ 다섯 개 중 셋(뭐부터 · 인터벌이 나은가 · 근력운동)은 본문 큰 질문과 겹쳐 뺐다.
 *     일주일 예시 표는 근거 없는 칸이 사실처럼 읽혀서(「표는 문장보다 위험하다」) 할 일 목록으로 바꿨다.
 *
 *   고친 것 — 무엇이 틀렸고 왜
 *   · **「더 많이 뛴 사람이 빨랐습니다」 단정** — Fokkema 2020 · Vickers 2016 모두 설문(관찰)이다.
 *     「더 빨리 완주하는 경향이 있었어요」로 낮추고, 원래 빠른 사람이 더 뛰었을 수 있다는 단서를 붙였다.
 *   · **Frandsen 2025 「1.52~2.28배」를 뺐다** — 늘린 정도별 값이 1.64 → 1.52 → 2.28 로 차례로 커지지 않는데 범위로 적어
 *     가장 작은 늘림(1.64)을 빠뜨리고 비례 위험처럼 읽혔다. 다른 확정 틀 글과 같은 말
 *     「한 번에 가장 길게 뛴 거리보다 10% 넘게 길게 뛴 날에 부상이 늘었어요」로.
 *   · **근력운동과 부상** — 옛 글은 Toresdahl 2020 한 시험만 들어 「부상 예방은 별개, 줄이지 못했다」고 적었다.
 *     여러 종목을 모은 Lauersen 2014 는 반대 방향이라 training-types·intermediate-guide·advanced-guide 와 같은 말
 *     「부상을 줄이는지는 달리기에서 뚜렷하지 않아요」로 바꾸고 Lauersen 을 출처에 더했다.
 *   · **근력운동과 기록** — Llanos-Lagos 2024 의 근거 확실성이 매우 낮음~중간이라 「중간 크기 효과를 보였습니다」 단정을
 *     「좋아지는 경향이 있었어요」로. 80% 기준은 출처로 내렸다.
 *   · **테이퍼(Bosquet 2007)** — 「2~3주 테이퍼를 둡니다」 단정 → advanced-guide·marathon-training 과 같은 판정·같은 말
 *     「~두는 편이 좋아요」, 「2주 결과는 경기 선수들」 단서. 취미 마라토너 3주 결과는 관찰이라 「경향」.
 *   · 통증 신호를 it-band·achilles·marathon-training 과 같은 표준 문구(아픔이 커지면 멈춤 · 다음 날 아침 더 아프면 줄임 ·
 *     쉬어도 안 나으면 진료)로. 옛 글은 복귀 글 링크뿐이었다.
 *   · 빠른 날 예시(400m × 8 · 1km × 5 · 20분 템포)를 training-types 와 같은 값(400m 여섯에서 여덟 번 · 1km 네 번에서 다섯 번 ·
 *     템포런 15~25분)으로 맞추고 저희가 정한 값이라고 단서에 적었다.
 *   · 말투 「~니다」 → 「~요」. 본문에서 연구 인원·나라·대상을 내렸다(556명 · 441명 · 2,303명 · 720명 · 4,621명 · 400만 건 · 네덜란드).
 *
 *   덜어낸 것
 *   · Rosenblat 2025 하위 분석(경쟁 선수는 양극화형, 취미는 피라미드형이 최대산소섭취량에 나았을 수 있다)과
 *     Muñoz 2014 하위 분석(배분을 잘 지킨 12명) — 할 일로 이어지지 않는 단서라 본문에서 뺐다. 판정은 jsonl 에.
 *   · 「최대산소섭취량」 낱말 — 본문에서 「심장과 폐가 산소를 쓰는 능력」으로(training-types 와 같은 말).
 *
 *   다른 글과 어긋난 것 (손대지 않음, 보고)
 *   · training-types 머리 주석은 Milanović 의 1.2 mL/kg/min 과 Muñoz 의 77/3/20 을 「초록에서 확인 못 함」으로 적었다(QxMD 열람).
 *     PubMed 초록에는 둘 다 있다. 그 글 본문은 숫자를 쓰지 않아 틀린 곳은 없다.
 *
 *   확인 못 한 것
 *   · 13편 모두 본문은 열지 않았다(요약만). 권·호·쪽은 PubMed 초록 페이지의 서지와 대조했다.
 */

const PAGE_URL = pageUrl("/injury/get-faster");
// 2026-11-10 제목: 오픈채팅 21,649건에서 「빨라지」 13명·「페이스 올리」 7명·「기록 단축」 3명·「기록 줄이」 0명,
// 「러닝」 98명 대 「달리기」 22명. 걱정은 「인터벌」 23명(질문자 9)·「서브3·싱글 목표」 31명·「근력」 17명.
const TITLE = "러닝 더 빨라지려면 뭐부터 해야 하나요?";
// 원장 lib/guide/articles.ts 의 desc 와 같은 문장이어야 한다(허브 카드·검색 결과가 어긋나지 않게)
const DESC =
  "기록을 줄이려면 빠른 훈련보다 뛰는 양부터 늘리는 편이 좋습니다. 빠르게 뛰는 날을 넣는 법, 근력운동, 대회 전 훈련 줄이기, 다치지 않는 기준을 논문으로 확인해 정리했습니다.";

export const metadata: Metadata = {
  title: `${TITLE} | 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/get-faster" },
};

// FAQ 는 본문 큰 질문과 겹치지 않는 곁가지만 둔다. 전문어는 문항마다 다시 풀이한다(check:geo 가 본다)
const FAQ: FaqItem[] = [
  {
    q: "80:20 훈련, 꼭 지켜야 하나요?",
    a: "꼭 지킬 필요는 없어요. 80:20 훈련은 달리는 시간 대부분을 쉽게, 일부만 힘들게 뛰는 배분이에요. **대부분은 쉽게, 빠른 날은 주 한 번부터** 넣어 보세요. 여러 연구를 모아 보니 배분 방식끼리 기록 차이가 없었어요.",
  },
  {
    q: "10km 기록으로 풀코스 기록을 예측할 수 있나요?",
    a: "하프까지는 잘 맞는 편이지만 풀코스는 빠르게 나오기 쉬워요. 흔히 쓰는 리겔 공식은 러너 절반에게서 실제보다 **10분 이상 빠르게** 나왔어요. **목표 페이스는 계산 값보다 느리게** 잡기를 권해요.",
  },
  {
    q: "기록을 노리면 후반에 더 무너지나요?",
    a: "그런 편이에요. 개인 기록을 세운 해 전후 3년에 후반에 크게 느려진 러너가 더 많았어요. **전반을 목표 페이스보다 빠르게** 달리지 않기를 권해요.",
  },
  {
    q: "인터벌과 템포런은 어떻게 달라요?",
    a: "인터벌은 말이 거의 안 나올 만큼 빠르게 뛰고 쉬기를 반복하는 훈련이에요. 템포런은 말이 끊기기 시작하는 속도로 이어서 뛰는 훈련이에요. **둘 다 주 한 번부터** 넣어 보세요.",
  },
];

const pill = "rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400";

export default function GetFasterPage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} datePublished="2026-10-07" />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["기록 단축", "/injury/get-faster"],
        ]}
      />
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Link href="/injury#stage-faster" className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
            5단계 · 완주 → 기록
          </Link>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/get-faster" compact checked={13} />

        <KeyPoints
          items={[
            <>빨라지고 싶다면 <strong>빠르게 뛰기보다 뛰는 양부터</strong> 다치지 않게 늘려 보세요.</>,
            <>대부분은 이야기할 수 있을 만큼 천천히 뛰고, <strong>빠르게 뛰는 날은 주 한 번부터</strong> 넣어요.</>,
            <>대회 2~3주 전에는 <strong>거리만 줄이고</strong> 빠르게 뛰는 날은 남겨 두는 편이 좋아요.</>,
          ]}
        />

        <Lead>
          완주는 했는데 기록이 그대로라면, 빠르게 뛰는 훈련부터 찾기 쉬워요. 그보다 먼저 볼 것은 <strong>얼마나 뛰고 있는지</strong>예요.
        </Lead>

        <TableOfContents
          items={[
            { id: "volume", label: "뛰는 양부터" },
            { id: "intensity", label: "빠르게 뛰는 날" },
            { id: "strength", label: "근력운동" },
            { id: "week", label: "일주일 짜기" },
            { id: "race", label: "대회 전 줄이기" },
            { id: "injury", label: "다치지 않으려면" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="volume" className={H2}>
          <Num n={1} />빠르게 뛰는 것보다 많이 뛰는 게 먼저인가요?
        </h2>
        <P>
          네. <strong>일주일에 뛰는 양을 다치지 않게 늘리는 것부터</strong> 해 보세요. 일주일에 많이 뛰고 길게 뛴 사람이 하프와
          풀코스를 더 빨리 완주하는 경향이 있었어요.
        </P>
        <Steps
          items={[
            { t: "쉬운 달리기를 하루 더 하거나 조금 더 길게 뛰는 것부터 늘려요." },
            { t: "다음 날 아침 아프면 더 늘리지 말고, 같은 양으로 다시 뛰어요." },
          ]}
        />
        <Caveat>
          원래 빠른 사람이 더 많이 뛰었을 수도 있어요. 같은 설문에서 많이 뛴 것과 부상의 관련은 나타나지 않았어요.
        </Caveat>

        <OneLine>빠른 훈련보다, 다치지 않고 뛰는 양을 늘리는 게 먼저예요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="intensity" className={H2}>
          <Num n={2} />빠르게 뛰는 날은 얼마나, 어떻게 넣나요?
        </h2>
        <P>
          <strong>대부분은 쉽게, 빠르게 뛰는 날은 주 한 번부터</strong> 넣어 보세요. 쉬운 날은 옆 사람과 이야기할 수 있을 만큼
          천천히 뛰어요.
        </P>
        <P>
          인터벌은 말이 거의 안 나올 만큼 빠르게 뛰고 쉬기를 반복하는 훈련이에요. 템포런은 말이 끊기기 시작하는 속도로 이어서 뛰는
          훈련이에요. 빠른 날에는 아래 중 하나를 골라 보세요.
        </P>
        <Steps
          items={[
            { t: "템포런은 한 번에 15~25분 이어서 뛰어요." },
            { t: "인터벌은 400m를 여섯 번에서 여덟 번, 또는 1km를 네 번에서 다섯 번 해요.", d: "사이에는 조깅이나 걷기로 숨을 돌려요." },
            { t: "앞뒤로 10분씩 쉬운 달리기를 붙여요." },
          ]}
        />
        <P>
          이어 달리기와 비교한 여러 연구를 모아 보니 둘 다 심장과 폐가 산소를 쓰는 능력을 크게 올렸고, 인터벌이 조금 더 올렸어요.
        </P>
        <Caveat>러너만 모은 연구가 아니에요. 거리와 횟수 예시는 저희가 정한 것이에요.</Caveat>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/training-types" className={pill}>훈련마다 자세히 보려면 →</Link>
        </div>

        <OneLine>대부분은 천천히, 빠르게 뛰는 날은 주 한 번부터 넣어요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="strength" className={H2}>
          <Num n={3} />근력운동하면 기록이 좋아지나요?
        </h2>
        <P>
          좋아지는 편이에요. <strong>무거운 하체 근력운동을 주 한두 번</strong> 넣어 보세요. 중장거리 러너 연구를 모은 한 분석에서
          무거운 무게로 한 사람들이 기록이 좋아지는 경향이 있었어요.
        </P>
        <Steps
          items={[
            { t: "주 1~2회, 달리기가 가벼운 날에 붙여요." },
            { t: "스쿼트, 데드리프트, 한 발 런지, 카프 레이즈 중 두세 가지를 골라요." },
            { t: "무거운 무게로 네다섯 번씩 세 세트 해요.", d: "처음엔 가벼운 무게로 동작부터 익혀요." },
          ]}
        />
        <P>
          다만 부상을 줄이는지는 달리기에서 뚜렷하지 않아요. <strong>근력운동을 한다고 거리를 서둘러 늘리지는 마세요.</strong>
        </P>
        <Caveat>종목과 횟수 예시는 저희가 정한 것이에요.</Caveat>

        <OneLine>무거운 하체 운동을 주 한두 번 넣되, 그걸 믿고 거리를 서둘러 늘리지는 않아요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="week" className={H2}>
          <Num n={4} />일주일은 어떻게 짜나요?
        </h2>
        <P>
          아래처럼 짜 보기를 권해요. <strong>한 번에 하나만 바꿔요.</strong> 거리를 늘리는 주에는 빠르게 뛰는 날을 새로 넣지 않는
          식이에요.
        </P>
        <Steps
          items={[
            { t: "쉬운 달리기 주 2~3회", d: "옆 사람과 이야기할 수 있을 만큼 천천히 뛰어요." },
            { t: "빠르게 뛰는 날 주 1회", d: "템포런이나 인터벌 중 하나를 골라요." },
            { t: "긴 달리기 주 1회", d: "쉬운 속도로, 지난 30일 중 가장 길게 뛴 거리의 110% 안에서 뛰어요." },
            { t: "하체 근력운동 주 1~2회" },
          ]}
        />
        <Caveat>이 짜임은 저희가 정한 예시이고, 이 조합을 시험한 연구는 찾지 못했어요.</Caveat>

        <OneLine>쉬운 날 위주로 짜고, 한 번에 하나만 바꿔요.</OneLine>

        {/* ── 5 ─────────────────────────────────────────── */}
        <h2 id="race" className={H2}>
          <Num n={5} />대회 전에는 훈련을 얼마나 줄이나요?
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
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/tools/pace#predict-h" className={pill}>목표 기록을 계산해 보려면 →</Link>
          <Link href="/injury/carbon-plate" className={pill}>카본화가 궁금하다면 →</Link>
        </div>

        <OneLine>대회 2~3주 전부터는 거리만 줄이고, 빠르게 뛰는 날은 그대로 둬요.</OneLine>

        {/* ── 6 ─────────────────────────────────────────── */}
        <h2 id="injury" className={H2}>
          <Num n={6} />빨라지려다 다치지 않으려면 어떻게 하나요?
        </h2>
        <P>
          <strong>가장 길게 뛰는 날은 지난 30일 중 가장 길게 뛴 거리의 110% 안에서</strong> 늘리기를 권해요. 한 대형 연구에서 한 번에
          가장 길게 뛴 거리보다 10% 넘게 길게 뛴 날에 부상이 늘었어요.
        </P>
        <P>
          오래 달린 러너는 다친 곳 가운데 아킬레스건이 차지하는 몫이 초보보다 큰 편이었어요.
        </P>
        <Steps
          items={[
            { t: "달리는 중에 아픔이 커지면 그날은 멈춰요." },
            { t: "다음 날 아침에 더 아프면 거리를 줄여요." },
            { t: "쉬어도 나아지는 느낌이 없으면 진료를 받아 보세요." },
          ]}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/achilles" className={pill}>아킬레스건이나 종아리가 아프다면 →</Link>
          <Link href="/injury/return-to-running" className={pill}>다쳤다가 다시 뛴다면 →</Link>
        </div>

        <OneLine>긴 날은 한 달 기록의 110% 안에서 늘리고, 달리다 아픔이 커지면 그날은 멈춰요.</OneLine>

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Fokkema et al. (2020)</strong> 네덜란드 하프 참가자 556명과 풀코스 참가자 441명 설문이에요. 하프는 일주일 32km 초과·가장 긴 달리기 21km 초과, 풀코스는 일주일 65km 초과가 더 빠른 완주와 관련 있었고, 훈련량과 부상의 관련은 나타나지 않았어요.
            <Ref>Scand J Med Sci Sports 30(9):1692-1704 · <a href="https://pubmed.ncbi.nlm.nih.gov/32421886/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Vickers &amp; Vertosick (2016)</strong> 취미 러너 2,303명 설문이에요. 일주일 거리와 인터벌은 모든 거리에서 비슷하게 속도와 관련 있었어요. 리겔 공식은 하프까지는 잘 맞았지만 풀코스는 러너 절반에게서 적어도 10분 빠르게 예측했어요.
            <Ref>BMC Sports Sci Med Rehabil 8(1):26 · <a href="https://pubmed.ncbi.nlm.nih.gov/27570626/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Rosenblat et al. (2025)</strong> 지구력 종목 선수 348명, 13편의 참가자 자료를 모은 메타분석이에요. 양극화형과 피라미드형 사이에 기록 차이가 없었어요.
            <Ref>Sports Med 55(3):655-673 · <a href="https://pubmed.ncbi.nlm.nih.gov/39888556/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Muñoz et al. (2014)</strong> 취미 러너 30명을 10주 나눈 시험이에요. 10km 기록이 양극화 배분에서 5.0%, 역치 사이 배분에서 3.6% 줄었고 두 쪽의 차이는 유의하지 않았어요.
            <Ref>Int J Sports Physiol Perform 9(2):265-72 · <a href="https://pubmed.ncbi.nlm.nih.gov/23752040/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Milanović et al. (2015)</strong> 건강한 성인 723명, 28편을 모은 메타분석이에요. 인터벌과 지속 훈련 모두 최대산소섭취량을 크게 올렸고, 인터벌이 평균 1.2 mL/kg/min 더 올렸어요(작은 차이).
            <Ref>Sports Med 45(10):1469-81 · <a href="https://pubmed.ncbi.nlm.nih.gov/26243014/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={6}>
            <strong>Llanos-Lagos et al. (2024)</strong> 중장거리 러너 근력운동 메타분석이에요. 한 번 들 수 있는 최대 무게의 80% 이상으로 한 쪽이 기록에 중간 크기 효과를, 여러 방법을 섞은 쪽이 큰 효과를 보였어요. 6~40주, 주 1~4회 연구였고 근거 확실성은 매우 낮음에서 중간이었어요.
            <Ref>Sports Med 54(7):1801-1833 · <a href="https://pubmed.ncbi.nlm.nih.gov/38627351/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={7}>
            <strong>Lauersen et al. (2014)</strong> 여러 종목의 무작위 시험 25편(26,610명)을 모은 메타분석이에요. 근력운동을 한 쪽의 부상이 3분의 1 수준이었어요(상대위험 0.315, 0.207~0.480). 달리기만 모은 분석은 아니에요.
            <Ref>Br J Sports Med 48(11):871-7 · <a href="https://pubmed.ncbi.nlm.nih.gov/24100287/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={8}>
            <strong>Toresdahl et al. (2020)</strong> 첫 풀코스 러너 720명에게 12주 동안 주 3회 10분짜리 근력 프로그램을 준 무작위 시험이에요. 부상으로 완주하지 못한 비율이 7.1%와 7.3%였어요(상대위험 0.97, 0.57~1.63).
            <Ref>Sports Health 12(1):74-79 · <a href="https://pubmed.ncbi.nlm.nih.gov/31642726/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={9}>
            <strong>Bosquet et al. (2007)</strong> 여러 종목의 경기 선수 연구 27편을 모은 메타분석이에요. 2주 동안 훈련량을 41~60% 줄이고 강도와 빈도는 그대로 두는 방식이 기록에 가장 효과적이었어요.
            <Ref>Med Sci Sports Exerc 39(8):1358-65 · <a href="https://pubmed.ncbi.nlm.nih.gov/17762369/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={10}>
            <strong>Smyth &amp; Lawlor (2021)</strong> 취미 마라토너 15만 8천여 명의 훈련 기록에서 3주 동안 꾸준히 줄인 사람이 최소한으로 줄인 사람보다 완주가 중앙값 5분 32초(2.6%) 빨랐어요(관찰 분석).
            <Ref>Front Sports Act Living 3:735220 · <a href="https://pubmed.ncbi.nlm.nih.gov/34651125/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={11}>
            <strong>Smyth (2021)</strong> 400만 건 넘는 마라톤 기록에서 후반에 크게 느려진 비율이 개인 기록을 세우기 전 3년에 36%, 그 이전에 23%였어요(페이스로 정의한 대리 지표).
            <Ref>PLOS ONE 16(5):e0251513 · <a href="https://pubmed.ncbi.nlm.nih.gov/34010308/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={12}>
            <strong>Frandsen et al. (2025)</strong> 한 번 달린 거리가 지난 30일 최장 거리보다 10% 넘게 길면 부상이 늘었어요(성인 러너 5,205명, 평균 45.8세 — 기록을 노리는 러너만 모은 연구가 아니에요).
            <Ref>Br J Sports Med 59(17):1203-1210 · <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={13}>
            <strong>Kemler et al. (2018)</strong> 네덜란드 러너 4,621명 설문에서 다친 곳 가운데 아킬레스건은 1년 넘게 달린 러너 8.4%, 초보 2.3%였어요. 두 그룹 모두 무릎(30.5%)과 종아리·정강이(17.8%)가 가장 많았어요.
            <Ref>Phys Sportsmed 46(4):485-491 · <a href="https://pubmed.ncbi.nlm.nih.gov/30071170/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
