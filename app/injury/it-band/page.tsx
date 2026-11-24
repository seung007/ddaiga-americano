import type { Metadata } from "next";
import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, Warn, Num, KeyPoints, Steps, OneLine, Caveat, Sources, Src, Ref } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

/**
 * 장경인대 증후군 — 2026-10-06 전면 개편
 *
 * 왜 다시 썼나
 *   · DC 러닝 갤러리 「부상관리」 말머리 300건(2025-10~2026-10)을 제목으로 분류하니, 부위가 나온 글의
 *     **작성자 기준 1위가 무릎 바깥·장경인대(37명)** 였다. 사이트에서 가장 짧은 축(3분)의 글이었다.
 *   · 기존 본문에 인용 없는 단정이 여럿 있었다 —
 *       「달리기를 시작한 지 한두 달」「이미 인대에 염증이 시작된 것」「억지로 달리면 회복에 4~6주」
 *       「즉시 거리를 30% 줄인다」「폼롤러로 주변 근육을 풀면 인대 장력이 줄어든다」
 *     그리고 FAQ 가 「거리 증가와 관련 있다는 보고(Sanchez-Alvarado 2024)」라고 적었는데 그 초록에 그런 내용이 없다.
 *   · 「마찰」 설명도 낡았다 — 해부 연구(Fairclough 2006)는 마찰보다 압박을 지목한다.
 *
 * 2026-10-13 가독성 재설계 · 2026-11-10 제목·소제목을 사람들이 쓰는 말로(오픈채팅 「장경인대」 2명, 「무릎」 23명 — 증상 문장을 앞에)
 *
 * 2026-11-23 확정 틀로 바꿈 (docs/운영/가이드_틀.md, 견본 app/injury/start-running/page.tsx)
 *   판정 전부: docs/판정/it-band.jsonl. 초록 10편은 2026-11-23 크롬으로 PubMed 를 직접 열어 읽었다(요약만, 본문은 열지 않음).
 *
 *   고친 것 — 무엇이 틀렸고 왜
 *   · **Falvey 2010 「스트레칭 동작에서 장경인대가 0.5% 미만 늘었다(사체 실험)」 ✗** — 초록의 0.5% 미만은 20명이 엉덩이를 옆으로
 *     미는 힘을 줄 때 잰 값이고, 스트레칭 세 동작은 사체 5구에서 따로 잰 변형률이다. 두 측정을 섞어 적었었다(본문·FAQ·근거 접힘 세 곳).
 *     본문·FAQ 에서 숫자를 빼고 「허벅지뼈에 길게 붙어 잘 늘어나지 않는다는 해부 연구」로, 측정 조건은 출처에만.
 *   · **「폼롤러로 장경인대 증후군이 낫는다는 연구는 찾지 못했습니다」 ✗** — 2026-10 에 근육 운동에 폼롤러·스트레칭을 더한 무작위 시험
 *     (Naderi & Azizi 2026, 20명)이 나왔다. 다만 초록의 통증 감소율이 결론과 거꾸로(79.7% 대 81.0%)라 숫자는 쓰지 않고
 *     「작은 시험이 있었지만 통증이 줄어든 정도는 비슷했다(79.7% 대 81.0%) · 아직 확실하지 않다」로(본 세션 검토로 한 단계 낮춤). 폼롤러만으로 낫는다고는 쓰지 않는다.
 *   · **Fairclough 2006 「마찰보다 압박입니다」 단정 ✗** — 저자도 may be more likely 로 썼다(사체 15구·MRI 자원자 6명·환자 2명).
 *     「~일 수 있다는 해부 연구가 있어요」로 낮췄다.
 *   · **Frandsen 2025 「1.52~2.28배」를 뺐다** — 늘린 정도별 값이 1.64 → 1.52 → 2.28 로 차례로 커지지 않아(옛 글은 1.64 도 빠뜨렸다)
 *     범위로 쓰면 비례 위험으로 읽힌다. intermediate-guide 와 같은 문장 「한 번에 가장 길게 뛴 거리보다 10% 넘게 길게 뛴 날에 부상이
 *     늘었어요」로, 평균 45.8세 단서는 접힌 출처에만.
 *   · **부상 후 복귀 글의 「통증 모니터링 모델(0~10점 중 5 이하)」 안내를 고쳤다** — 그 글이 2026-11-18 에 점수 표를 지워 가리키는 내용이
 *     없어졌고, 장경인대에서 시험된 모델도 아니었다. 점수 없는 표준 문구(달리는 중 아픔이 커지면 멈춤 · 다음 날 아침 더 아프면 거리 줄임 ·
 *     쉬어도 안 나으면 진료)로 — intermediate-guide 1절 할 일과 같은 말.
 *   · **「2주 이상 쉬어도 통증이 줄지 않으면 진료」의 「2주」를 뺐다** — 어느 초록에도 없는 사이트 숫자였다.
 *   · **예시 운동의 「15회 × 3세트」「10회 × 3세트」를 뺐다** — 특정 연구의 프로토콜이 아니라고 옛 글이 스스로 적어 둔 정밀 숫자다.
 *   · **Sanchez-Alvarado 「약 10%」 · Aderem 「두 번째로 흔한 부상」은 출처에만** — 두 초록 모두 서론·배경 문장이지 그 고찰이 센 결과가 아니다
 *     (intermediate-guide 와 같은 판정). 「얼마나 흔한가」 절은 그래서 없앴다.
 *   · 커뮤니티 집계(무릎 바깥·장경인대 37명으로 1위)를 화면에서 내렸다 — 틀려서가 아니라, 원자료가 노트북(ddaiga-pipeline)에 있어
 *     이번에 다시 세지 못했다(half-marathon-training 도 같은 집계를 뺐다). 다시 세면 되살릴 수 있다.
 *   · 영상 둘을 뺐다 — 「…통증질환 TOP3」(제목)와 「러닝 자세 Before & After」(채널명 EINZ)의 영문 약어가 풀이 검사에 걸리고,
 *     제목·채널명은 원문이라 고칠 수 없다(intermediate-guide 와 같은 처리). 틀려서 뺀 것이 아니다.
 *   · 본문에서 연구 인원·대상(9명·18명·24명 중 22명·여성 러너)을 내렸다(접힌 출처로). 「외전근」은 「엉덩이 옆 근육」으로(intermediate-guide 와 같은 말).
 *   · 말투 「~니다」 → 「~요」, 옛 부품(근거 딱지·접힘·문헌 목록·한눈에 상자) 걷어냄, ※ 문구를 견본 문구로.
 *
 *   확인 못 한 것
 *   · 커뮤니티 집계(위) — 원자료가 이 저장소에 없다
 *   · 10편 모두 본문은 열지 않았다(요약만). 그래서 본문에서 숫자는 초록에 있는 2~8주·6주·30도·10%·110% 만 쓴다
 *   · 셀프 체크 네 줄(아픈 자리·한참 뛴 뒤·내리막·비슷한 거리)은 이번에 읽은 초록에서 확인한 것이 아니다 — 진단이 아니라고 적고 「의심해 보세요」로만
 */

const PAGE_URL = pageUrl("/injury/it-band");
const TITLE = "달리면 무릎 바깥쪽이 아파요, 장경인대일까요?";
// 원장 lib/guide/articles.ts 의 desc 와 같은 문장이어야 한다(허브 카드·검색 결과가 어긋나지 않게)
const DESC =
  "무릎 바깥이 아프고 내리막에서 심해진다면 장경인대 증후군일 수 있습니다. 내 증상인지 확인하는 법과 스트레칭보다 근거가 있는 엉덩이 근력 운동을 다룹니다.";

export const metadata: Metadata = {
  title: `${TITLE} | 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/it-band" },
};

// 2026-11-23: FAQ 는 본문 큰 질문과 겹치지 않는 것만 둔다. 「장경인대」를 쓰면 답마다 다시 풀이해야 해서 「무릎 바깥」으로 묻는다.
const FAQ: FaqItem[] = [
  {
    q: "무릎 바깥 통증에 주사 치료는 효과가 있나요?",
    a: "아픈 지 2주가 안 됐다면 도움이 됐다는 작은 시험이 있어요. **스테로이드 주사를 맞은 러너가 달릴 때 통증이 더 줄었어요.** 맞을지는 **진료에서 정해요.**",
  },
  {
    q: "엉덩이 근육 운동은 몇 번씩, 얼마나 해야 하나요?",
    a: "정해진 횟수를 확인한 자료는 없어요. **아프지 않은 만큼 꾸준히** 해 보세요. 낫는 데 쓰인 운동 기간은 연구마다 **2~8주**였어요.",
  },
  {
    q: "달리는 자세를 바꾸면 나아지나요?",
    a: "아직 확실하지 않아요. 치료 결과를 모아 보니 자세를 바꾸는 방법은 더 시험해 봐야 한다고 했어요. 먼저 **엉덩이 옆 근육 운동**과 **내리막 피하기**부터 해 보세요.",
  },
];

const pill = "rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400";

export default function ITBandPage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} datePublished="2025-03-01" />
      {/* 2026-11-23: 이동 경로 이름을 「무릎 바깥 통증」으로 — 「장경인대」가 풀이보다 먼저 나오지 않게(풀이 검사는 읽는 순서로 본다) */}
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["무릎 바깥 통증", "/injury/it-band"],
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
        <ArticleMeta href="/injury/it-band" compact checked={10} />

        <KeyPoints
          items={[
            <>무릎 바깥이 아프고 내리막에서 더 아프다면, 나을 때까지는 <strong>평지에서 짧게</strong> 뛰어 보세요.</>,
            <>낫는 데 가장 많이 쓰인 방법은 <strong>엉덩이 옆 근육을 키우는 운동</strong>이에요.</>,
            <>달리다 아픔이 커지면 그날은 멈추고, <strong>쉬어도 나아지지 않으면 진료</strong>를 받아 보세요.</>,
          ]}
        />

        <Lead>
          달리다 무릎 바깥이 아프고 내리막에서 더 심해진다면 장경인대 증후군일 수 있어요. 장경인대는 허벅지 바깥쪽을 지나 무릎까지
          이어지는 질긴 띠예요. 스트레칭보다 먼저 할 일은 <strong>엉덩이 근육</strong>을 챙기는 거예요.
        </Lead>

        <TableOfContents
          items={[
            { id: "check", label: "장경인대 증후군인가요?" },
            { id: "why", label: "왜 내리막에서 더 아픈가요?" },
            { id: "what-works", label: "어떻게 해야 낫나요?" },
            { id: "rest-or-run", label: "완전히 쉬어야 하나요?" },
            { id: "stretch", label: "스트레칭과 폼롤러는요?" },
            { id: "how-long", label: "얼마나 걸리고, 언제 병원에 가나요?" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="check" className={H2}>
          <Num n={1} />달릴 때 무릎 바깥쪽이 아프면 장경인대 증후군인가요?
        </h2>
        <P>
          <strong>무릎 바깥, 관절보다 조금 위가 아프고 내리막에서 더 아프면</strong> 의심해 볼 수 있어요. 무릎 바깥 통증은 다른 원인일
          수도 있어서, 확정은 진료에서 해요.
        </P>
        <Steps
          title="이런 모습이면 의심해 보세요"
          items={[
            { t: "아픈 곳이 무릎 바깥, 관절보다 조금 위예요.", d: "뼈가 살짝 튀어나온 자리 근처예요." },
            { t: "달리기 시작하자마자보다 한참 뛴 뒤에 아파져요." },
            { t: "내리막이나 계단을 내려갈 때 더 아파요." },
            { t: "쉬면 가라앉았다가 비슷한 거리에서 다시 아파요." },
          ]}
        />
        <Caveat>이 네 가지는 저희가 정리한 모습이고, 진단을 대신하지 않아요.</Caveat>
        <Warn title="이럴 땐 다른 원인일 수 있어요">
          무릎이 붓거나, 걸리거나 잠기는 느낌이 있거나, 비틀린 뒤 아파졌다면 무릎 속 연골이나 인대 문제일 수 있어요. 진료를 받아 보세요.
        </Warn>

        <OneLine>무릎 바깥이 아프고 내리막에서 더 아프면 의심해요. 붓거나 잠기면 진료부터 받아요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="why" className={H2}>
          <Num n={2} />왜 내리막에서 더 아픈가요?
        </h2>
        <P>
          <strong>내리막에서는 발이 땅에 닿을 때 무릎이 덜 굽어서</strong>, 장경인대가 자극받는 각도에 더 오래 머문다는 설명이 있어요.
          평지에서 빠르게 뛸 때는 무릎이 더 굽어 덜 자극된다고 봐요.
        </P>
        <P>
          예전에는 장경인대가 뼈 위를 문질러서 아프다고 설명했어요. 지금은 무릎을 30도쯤 굽힐 때 장경인대가 그 아래 지방층을 누르기
          때문일 수 있다는 해부 연구도 있어요.
        </P>
        <Steps
          items={[
            { t: "아픈 동안은 내리막을 피하고 평지에서 뛰어 보세요." },
            { t: "아프기 시작하는 거리보다 짧게 끊어요.", d: "아프기 전에 멈추면 다음 날 상태를 보기도 쉬워요." },
          ]}
        />

        <OneLine>내리막에서는 무릎이 자극받는 각도에 오래 머물러요. 나을 때까지는 평지에서 뛰어요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="what-works" className={H2}>
          <Num n={3} />어떻게 해야 낫나요?
        </h2>
        <P>
          <strong>엉덩이 옆 근육을 키우는 운동</strong>을 해 보세요. 치료에서 가장 흔히 쓰였고 통증과 기능이 나아졌어요. 엉덩이 옆 근육은
          다리를 옆으로 벌릴 때 쓰는 근육이에요.
        </P>
        <Steps
          title="이런 운동부터 해 보세요"
          items={[
            { t: "옆으로 누워 다리 들기", d: "위쪽 다리를 곧게 편 채 천천히 들었다 내려요. 발끝은 앞을 향하게 해요." },
            { t: "옆으로 누워 무릎 벌리기", d: "무릎을 굽히고 발은 붙인 채, 위쪽 무릎만 조개가 열리듯 벌려요." },
            { t: "계단 끝에서 골반 내리기", d: "한 발로 계단 끝에 서서 반대쪽 골반을 천천히 내렸다 올려요." },
          ]}
        />
        <Caveat>몇 번씩 하라는 기준은 확인한 자료가 없어요. 아프지 않은 만큼 꾸준히 해 보세요.</Caveat>
        <P>
          다만 엉덩이 근육이 약해서 이 통증이 생긴다고 단정할 수는 없어요. 관련을 본 연구가 적고 차이도 작았어요.
        </P>

        <OneLine>엉덩이 옆 근육 운동부터 해 보세요. 낫는 데 가장 많이 쓰인 방법이에요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="rest-or-run" className={H2}>
          <Num n={4} />장경인대가 아프면 달리기를 완전히 쉬어야 하나요?
        </h2>
        <P>
          꼭 완전히 쉬어야 하는지는 <strong>확인한 자료가 없어요.</strong> 대신 아픔이 커지는지를 보면서 줄여 뛰는 걸 권해요.
        </P>
        <Steps
          items={[
            { t: "달리는 중에 아픔이 커지면 그날은 멈춰요." },
            { t: "다음 날 아침에 더 아프면 거리를 줄여요." },
            { t: "쉬어도 나아지는 느낌이 없으면 진료를 받아 보세요." },
          ]}
        />
        <P>
          다시 늘릴 때는 <strong>지난 30일 중 가장 길게 뛴 거리의 110% 안에서</strong> 늘리기를 권해요. 한 대형 연구에서 한 번에 가장
          길게 뛴 거리보다 10% 넘게 길게 뛴 날에 부상이 늘었어요.
        </P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/return-to-running#comeback" className={pill}>다시 거리를 늘린다면 →</Link>
        </div>

        <OneLine>아픔이 커지면 멈추고, 다음 날 더 아프면 줄여요. 다시 늘릴 땐 한 달 기록의 110% 안에서 늘려요.</OneLine>

        {/* ── 5 ─────────────────────────────────────────── */}
        <h2 id="stretch" className={H2}>
          <Num n={5} />스트레칭과 폼롤러로 풀면 낫나요?
        </h2>
        <P>
          <strong>스트레칭이나 폼롤러만으로 낫는다고 보기는 어려워요.</strong> 장경인대는 허벅지뼈에 길게 붙어 있어서 잘 늘어나지 않는다는
          해부 연구가 있어요.
        </P>
        <P>
          {/* 2026-11-23 본 세션 검토: 「더 나아졌다는 작은 시험」은 근거보다 셌다 — 주 결과인 통증 감소가 79.7% 대 81.0%로 비슷했고
              20명 시험이다(PMID 42945197 초록 직접 확인). 결론이 아니라 잰 값을 따른다 */}
          엉덩이 근육 운동에 폼롤러와 스트레칭을 더한 작은 시험이 하나 있었지만, 통증이 줄어든 정도는 근육 운동만 한 사람들과
          비슷했어요. 폼롤러가 더 도움이 되는지는 아직 확실하지 않아요.
        </P>
        <Steps
          items={[
            { t: "엉덩이 옆 근육 운동을 먼저 해요." },
            { t: "폼롤러와 스트레칭은 몸이 편해지면 더해도 괜찮아요." },
          ]}
        />

        <OneLine>스트레칭과 폼롤러는 더해도 되지만, 엉덩이 근육 운동이 먼저예요.</OneLine>

        {/* ── 6 ─────────────────────────────────────────── */}
        <h2 id="how-long" className={H2}>
          <Num n={6} />얼마나 걸리고, 언제 병원에 가야 하나요?
        </h2>
        <P>
          낫는 데 걸리는 기간을 잰 자료는 확인하지 못했어요. 치료에서 운동한 기간은 <strong>2~8주</strong>였고, 엉덩이 근육 중심으로{" "}
          <strong>6주</strong> 재활한 한 연구에서는 대부분이 통증 없이 달리기로 돌아갔어요.
        </P>
        <Warn title="이럴 땐 진료를 받아 보세요">
          <ul className="list-disc space-y-1 pl-5">
            <li>쉬어도 나아지는 느낌이 없다</li>
            <li>걸을 때도 무릎 바깥이 아프다</li>
            <li>무릎이 붓거나 열감이 있다</li>
            <li>무릎이 걸리거나 잠긴다</li>
          </ul>
        </Warn>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/knee-pain" className={pill}>무릎 앞이 아프다면 →</Link>
          <Link href="/injury/intermediate-guide" className={pill}>거리를 늘리는 중이라면 →</Link>
        </div>

        <OneLine>날짜보다 나아지는지를 봐요. 쉬어도 그대로면 진료를 받아요.</OneLine>

        {/* 2026-10-06: 「장경인대염 예방에 적합한 신발」은 본문(신발로 해결한다는 근거 없음)과 반대였다. 2026-11-23 효과 주장 없는 문구로 */}
        <FinderCta
          from="it-band"
          variant="inline"
          headline="신발은 발볼과 사이즈가 맞는지가 먼저예요. 발볼과 용도로 좁혀 보세요."
        />

        {/* 2026-11-23: 두 영상을 뺐다 — 「[장경인대증후군] 러너에게 흔한 통증질환 TOP3」(화이팅!통증피디아, 제목의 영문 약어)와
            「무릎 통증(장경인대 통증) 해결! 러닝 자세 Before & After」(채널 「아인즈 러닝랩 / EINZ Runninglab」의 영문 약어).
            둘 다 풀이 검사에 걸리는데 제목·채널명은 원문이라 고칠 수 없다(채널명은 verify-youtube 가 실제 업로더와 대조한다). */}
        <div className="mt-14">
          <YoutubeSection
            links={[
              { label: "러닝할 때 무릎 바깥쪽이 아픈 이유는? 장경인대증후군이란?", channel: "닥터내비", url: "https://www.youtube.com/watch?v=vqe3vSYP3jo" },
              { label: "무릎 통증, 치료법 다 모여라! 장경인대증후군 자가 운동법", channel: "이정표의 레그웰", url: "https://www.youtube.com/watch?v=c7-JDyYg4c0" },
              { label: "정형외과 의사가 생각하는 달리기 부상과 장경인대염", channel: "러너의 풍경", url: "https://www.youtube.com/watch?v=z3UUVQf57m0" },
              { label: "자전거·러닝 전 이거 안 하면 무릎 나갑니다! 3분 장경인대증후군", channel: "이정표의 레그웰", url: "https://www.youtube.com/shorts/uNI9DtqCy6M" },
              { label: "장경인대 스트레칭", channel: "알쓸참본", url: "https://www.youtube.com/shorts/HPsUUJlEiKk" },
            ]}
          />
        </div>

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Orchard et al. (1996)</strong> 장경인대 증후군 러너 9명은 발이 닿을 때 무릎이 평균 21.4도 굽어 있어, 자극이 생긴다고 알려진 30도 부근이었어요. 내리막은 이 각도를 줄여 자극받기 쉽다고 설명했어요(러너 동작 분석과 사체 무릎 11개로 세운 설명이에요).
            <Ref>Am J Sports Med 24(3):375-9 · <a href="https://pubmed.ncbi.nlm.nih.gov/8734891/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Fairclough et al. (2006)</strong> 사체 15구에서 장경인대는 허벅지뼈에 섬유로 고정돼 있었고, 자원자 MRI에서는 무릎을 30도 굽힐 때 뼈 쪽으로 눌렸어요. 저자들은 마찰보다 그 아래 지방층이 눌리는 것과 관련 있을 수 있다고 봤어요.
            <Ref>J Anat 208(3):309-16 · <a href="https://pubmed.ncbi.nlm.nih.gov/16533314/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Sanchez-Alvarado et al. (2024)</strong> 장경인대 증후군 치료 연구 13편(201명, 그중 6편은 사례 보고)을 모았어요. 엉덩이 옆 근육 강화가 흔히 쓰였고, 2~8주 동안 통증이 27~100%, 기능이 10~57% 나아졌어요. 연구끼리 차이가 커서 하나로 합쳐 계산하지는 못했어요. 자세를 바꾸는 방법은 더 시험해 봐야 한다고 적었어요. 서론에서 이 부상을 러닝 부상의 약 10%로 적었어요.
            <Ref>Front Sports Act Living 6:1386456 · <a href="https://pubmed.ncbi.nlm.nih.gov/39247485/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Aderem &amp; Louw (2015)</strong> 연구 13편을 모아 보니 나중에 아파진 여성 러너는 착지 때 고관절이 안쪽으로 더 모이고 무릎이 안쪽으로 더 돌았어요. 저자들은 연구 수가 적고 차이가 작다고 적었어요. 서론에서 러닝에서 두 번째로 흔한 부상이라고 적었어요.
            <Ref>BMC Musculoskelet Disord 16:356 · <a href="https://pubmed.ncbi.nlm.nih.gov/26573859/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Foch et al. (2023)</strong> 17편을 검토하고 횡단 연구 10편을 합쳐 보니, 지금 아픈 여성 러너만 엉덩이 옆 근육 근력이 낮았어요. 남녀의 위험 요인도 달랐어요. 이미 아픈 사람을 잰 연구라 약해서 아픈 건지 아파서 약해진 건지는 가릴 수 없어요.
            <Ref>Gait Posture 101:73-81 · <a href="https://pubmed.ncbi.nlm.nih.gov/36758425/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={6}>
            <strong>Frandsen et al. (2025)</strong> 한 번 달린 거리가 지난 30일 중 가장 길게 뛴 거리보다 10% 넘게 길면 과사용 부상이 늘었어요(성인 러너 5,205명, 평균 45.8세 — 장경인대 증후군만 본 연구가 아니에요).
            <Ref>Br J Sports Med 59(17):1203-1210 · <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={7}>
            <strong>Falvey et al. (2010)</strong> 사체 20구에서 장경인대는 허벅지를 둘러싼 근막이 바깥쪽에서 두꺼워진 것으로, 허벅지뼈에 길게 단단히 붙어 있었어요. 20명이 엉덩이를 옆으로 미는 힘을 줄 때 장경인대가 늘어난 정도는 평균 0.5% 미만이었어요(스트레칭 세 동작은 사체 5구에서 따로 쟀어요). 저자들은 장경인대를 늘리는 치료의 근거에 의문을 제기하고, 근육 쪽을 봐야 한다고 했어요.
            <Ref>Scand J Med Sci Sports 20(4):580-7 · <a href="https://pubmed.ncbi.nlm.nih.gov/19706004/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={8}>
            <strong>Naderi &amp; Azizi (2026)</strong> 장경인대 증후군 운동선수 20명을 나눠 8주 동안 근육 운동만 한 사람들과 폼롤러·스트레칭을 더한 사람들을 비교한 시험이에요. 더한 사람들이 통증과 기능이 더 나아졌다고 결론 냈지만, 초록의 통증 감소율은 79.7%와 81.0%로 결론과 거꾸로 적혀 있어요. 저자들도 더 큰 연구가 필요하다고 했어요.
            <Ref>PLoS One 21(10):e0360760 · <a href="https://pubmed.ncbi.nlm.nih.gov/42945197/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={9}>
            <strong>Fredericson et al. (2000)</strong> 장경인대 증후군 장거리 러너 24명이 엉덩이 옆 근육 중심으로 6주 재활한 뒤 22명이 통증 없이 달리기로 돌아갔고, 6개월 뒤 재발 보고가 없었어요. 근력은 여성 34.9%, 남성 51.4% 늘었어요. 재활에 대조군이 없는 사례 연구예요.
            <Ref>Clin J Sport Med 10(3):169-75 · <a href="https://pubmed.ncbi.nlm.nih.gov/10959926/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={10}>
            <strong>Gunter &amp; Schwellnus (2004)</strong> 증상이 생긴 지 2주가 안 된 러너 18명을 나눈 시험에서, 스테로이드 주사를 맞은 사람들의 달릴 때 통증이 14일째까지 더 줄었어요(대조군은 국소마취제만).
            <Ref>Br J Sports Med 38(3):269-72 · <a href="https://pubmed.ncbi.nlm.nih.gov/15155424/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
