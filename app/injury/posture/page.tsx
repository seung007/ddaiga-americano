import type { Metadata } from "next";
import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, Num, KeyPoints, Steps, OneLine, Sources, Src, Ref } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

/**
 * 달리는 자세 — 2026-11-18 확정 틀로 바꿈 (AGENTS.md 「가이드 글 틀」)
 *
 * 주장 판정 — 네 편 모두 2026-11-18 에 QxMD 로 초록을 직접 열어 대조했다
 *   · 몸통을 기울이면 무릎 부하가 줄고 고관절 부하가 는다 — 근거 있음(실험실 한 편, 일반 러너 30명, Braun).
 *     초록에 기울기 1도당 고관절 누적 3.26, 무릎 1.08 Nm·s/kg/1000m 가 있다. 본문에는 방향만 쓰고 숫자는 글 끝 출처로 내렸다
 *   · 많이 숙이면 착지 부하율이 커진다 — 근거 있음(23명, Warrener. 부하율 약 29%, 보폭 약 6% 짧아지고 걸음 수 약 7% 늘었다)
 *   · 등을 구부리면 숨 쉬는 부담이 조금 는다 — 근거 있음이지만 약함(젊은 남성 10명 예비 연구, Chiba.
 *     달릴 때 분당 환기량 증가는 유의하지 않은 경향이고 산소섭취량은 차이가 없었다). 본문에서 빼고 FAQ 한 문항에만 뒀다
 *   · 팔은 몸통·머리가 돌아가는 것을 줄인다 — 근거 있음(10명, Pontzer. 팔을 묶어도 이동 비용은 달라지지 않았다)
 *   · 어깨·팔꿈치·손·턱 기준 — 근거 없음. 국민건강보험공단 건강보험 웹진(2022년 3월호, 손용국)을 옮긴 사이트 관행이다.
 *     2026-10-08 에도 2026-11-18 에도 웹진 원문을 다시 열지 못했다(이번에는 승인 요구로 막혔다).
 *     그래서 숫자는 출처를 문장에 드러내고 권하는 말투로만 쓴다. 논문이 아니라서 글 끝 출처 목록에는 넣지 않았다 —
 *     날짜 줄이 「연구 N편 대조」라서 논문 아닌 자료를 섞어 세면 숫자가 어긋난다(cooldown 2026-11-18 과 같은 처리)
 *   · 시선 10~15m — 근거를 못 찾았다. 값은 그대로 쓰고 「근거를 확인하지 못한 값」이라고 적는다
 *   · 자세를 고치면 덜 다친다 — 확인한 자료가 없다. 단정하지 않는다. 실험실에서 부하가 달라진 것까지만 확인됐다
 *
 * 뺀 것
 *   · 「지치면 어깨가 귀 쪽으로 올라간다」 — 근거를 못 찾은 경험칙이라 뺐다. 중간중간 어깨를 내려 보라는 할 일만 남겼다
 *   · 발이 닿는 방식과 걸음 수는 /injury/midfoot · /injury/cadence 가 답한다 — 여기서는 상황 문장 링크만 둔다
 *
 * 2026-10-08 재검증에서 바로잡은 것(그대로 유지): 메타 설명의 「사실」 단정 삭제 ·
 *   「어깨가 말리면 호흡이 얕아진다」는 보고되지 않은 말 · 「팔이 크게 흔들리면 골반도 흔들린다」는 근거를 못 찾음
 *   (Pontzer 는 오히려 팔이 몸통 회전을 줄인다고 봤다) · 「5km마다」 삭제
 */
const PAGE_URL = pageUrl("/injury/posture");
const TITLE = "달리기 자세, 상체를 숙이면 무릎에 안 좋나요?";
const DESC =
  "상체를 숙이면 무릎과 고관절에 걸리는 힘이 어떻게 달라지는지 연구로 확인한 부분과, 어깨·팔·시선 기준에서 근거가 없는 부분을 나눠 적었습니다.";

export const metadata: Metadata = {
  title: "달리기 자세, 상체를 숙이면 무릎에 안 좋나요? — 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/posture" },
};

const FAQ: FaqItem[] = [
  {
    q: "팔꿈치 각도나 시선 거리 같은 숫자를 꼭 맞춰야 하나요?",
    a: "맞추려 애쓰지 않아도 돼요. 숫자보다 **어깨와 손에서 힘을 빼는 것**을 먼저 권해요. 팔꿈치 90~110도는 건강보험 웹진에 실린 트레이너의 설명이고, 10~15m 앞을 보라는 거리는 근거를 찾지 못했어요.",
  },
  {
    q: "발이 땅에 닿는 방식도 자세에 들어가나요?",
    a: "들어가요. 다만 발이 어디부터 닿는지와 걸음 수는 다른 글에 따로 정리했어요. 이 글은 **상체와 팔, 머리**까지만 다뤄요.",
  },
  {
    q: "숨이 차는데 상체를 세우면 도움이 되나요?",
    a: "등을 말면 숨이 조금 더 힘들어질 수 있어요. 작은 실험에서 그렇게 나왔고, 더 확인이 필요해요. **가슴을 펴고 달려 보되**, 숨이 차면 속도를 낮추거나 걸어도 괜찮아요.",
  },
];

const linkCls = "text-emerald-700 underline";
const chipCls = "rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400";

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["달리기 자세", "/injury/posture"],
        ]}
      />
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-600">자세</span>
          {/* 규약은 app/injury/page.tsx 상단 주석 */}
          <span className="text-xs text-gray-400">협찬 없이 작성</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/posture" compact checked={4} />

        <KeyPoints
          items={[
            <>상체는 <strong>살짝만</strong> 기울여요. 많이 숙이면 무릎은 편해지는 대신 엉덩이 쪽이 더 일해요.</>,
            <>어깨와 손에서 <strong>힘을 빼요.</strong> 팔은 몸이 비틀리지 않게 잡아 주는 쪽이에요.</>,
            <>자세를 고쳐서 덜 다쳤다는 자료는 저희가 찾지 못했어요. <strong>지금 아프지 않다면 그대로 달려도 괜찮아요.</strong></>,
          ]}
        />

        <Lead>
          달릴 때 상체가 앞으로 숙여져 무릎이 걱정된다면, 숙인 정도에 따라 무릎과 엉덩이에 걸리는 힘이 달라져요. 다만 자세를
          고쳐서 부상이 줄었다는 자료는 저희가 찾지 못했어요.
        </Lead>

        <TableOfContents
          items={[
            { id: "lean", label: "상체를 숙이면 무릎에 안 좋나요?" },
            { id: "shoulder-arm", label: "어깨와 팔은 어떻게 두나요?" },
            { id: "head", label: "시선은 어디를 보나요?" },
            { id: "change", label: "자세를 고치면 덜 다치나요?" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="lean" className={H2}>
          <Num n={1} />상체를 숙이고 달리면 무릎에 안 좋나요?
        </h2>
        <P>
          <strong>허리를 접지 말고 몸 전체를 살짝만 기울여요.</strong> 한 실험에서 몸통을 많이 숙일수록 무릎에 걸리는 힘은
          줄고, 고관절(엉덩이 관절)에 걸리는 힘은 늘었어요. 한쪽이 편해지는 만큼 다른 쪽이 더 일하는 셈이에요.
        </P>
        <P>
          많이 숙인 자세에서는 발이 닿는 순간 힘이 실리는 속도도 빨라지는 편이었어요. 그래서 무릎이 아플 때 상체를 더 숙여서
          풀어 보는 건 권하지 않아요.
        </P>
        <Steps
          items={[
            { t: "서 있는 자세부터 잡아요.", d: "귀와 어깨, 엉덩이가 한 선에 오게 서 봐요." },
            { t: "거기서 몸 전체를 앞으로 살짝 기울여요.", d: "가슴부터 나가는 느낌이면 돼요." },
            { t: "허리가 접히면 기울인 게 아니라 숙인 거예요.", d: "다시 펴고 가슴을 열어요." },
          ]}
        />

        <OneLine>허리를 접지 말고, 몸 전체를 살짝만 기울여요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="shoulder-arm" className={H2}>
          <Num n={2} />달릴 때 어깨와 팔은 어떻게 두나요?
        </h2>
        <P>
          <strong>힘을 빼는 게 먼저예요.</strong> 팔을 가슴에 묶고 달리게 한 실험에서 에너지 소비는 달라지지 않았고, 팔은
          몸통과 머리가 돌아가는 것을 줄여 주는 쪽으로 보였어요. 팔로 몸을 밀어내려 애쓸 이유는 없다는 뜻이에요.
        </P>
        <P>
          아래 기준은 국민건강보험공단 건강보험 웹진에 실린{" "}
          <a
            href="https://www.nhis.or.kr/static/alim/paper/oldpaper/202203/sub/10.html"
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
          >
            전 육상 국가대표 트레이너의 설명
          </a>
          을 옮긴 거예요. 연구로 확인한 값이 아니라 저희가 그대로 쓰는 기준이에요.
        </P>
        <Steps
          items={[
            { t: "어깨는 힘을 빼고 자연스럽게 뒤로 당겨요.", d: "귀와 어깨가 한 선에 오게 두세요." },
            { t: "팔꿈치는 90~110도로 굽혀요." },
            { t: "팔은 몸 중앙의 세로선에서 30도쯤 안쪽 사선으로 흔들어요." },
            { t: "손은 달걀을 가볍게 쥔 정도만 힘을 줘요." },
            { t: "달리는 중간중간 어깨를 한 번 내려 봐요." },
          ]}
        />

        <OneLine>팔은 세게 흔드는 것보다, 힘을 빼고 가볍게 흔드는 걸 권해요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="head" className={H2}>
          <Num n={3} />달릴 때 시선은 어디를 봐야 하나요?
        </h2>
        <P>
          <strong>턱을 가볍게 당기고</strong> 머리는 척추 위에 그냥 얹어 두세요. 발밑을 보려고 고개를 숙이면 목이 앞으로
          빠져요.
        </P>
        <P>
          10~15m 앞 지면을 보라는 말이 자주 보이는데, 그 거리는 위 웹진 자료에도 저희가 찾은 연구에도 없었어요.{" "}
          <strong>근거를 확인하지 못한 값</strong>이라 그대로 적어 둘게요. 숫자를 맞추려 애쓰지 않아도 돼요.
        </P>

        <OneLine>시선 거리를 맞추기보다, 목이 앞으로 빠지지 않게만 신경 써요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="change" className={H2}>
          <Num n={4} />자세를 고치면 덜 다치나요?
        </h2>
        <P>
          <strong>덜 다쳤다는 자료는 저희가 찾지 못했어요.</strong> 지금까지 확인된 건 실험실에서 자세를 바꿨을 때 관절에
          걸리는 힘의 크기가 달라졌다는 것까지예요. 그 변화가 부상으로 이어졌는지 따라가 본 자료는 못 찾았어요.
        </P>
        <P>
          그래서 아프지 않은데 자세부터 손보는 것보다 <strong>달리는 양을 늘리는 속도와 아픈 신호</strong>를 먼저 보는 걸
          권해요. 늘리는 순서는 <Link href="/injury/start-running" className={linkCls}>처음 달리기 글</Link>에 있어요.
        </P>
        <P>발이 닿는 방식과 걸음 수는 자세와 같이 묻는 이야기라 따로 정리해 뒀어요.</P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/midfoot" className={chipCls}>발이 어디로 닿는 게 맞는지 →</Link>
          <Link href="/injury/cadence" className={chipCls}>걸음 수(케이던스)를 올리고 싶다면 →</Link>
          <Link href="/injury/shin-splints" className={chipCls}>정강이가 아프다면 →</Link>
          <Link href="/injury/knee-pain" className={chipCls}>무릎 앞이 아프다면 →</Link>
        </div>

        <OneLine>자세보다 늘리는 양과 아픈 신호를 먼저 챙기는 걸 권해요.</OneLine>

        <FinderCta
          from="posture"
          variant="inline"
          headline="자세를 고쳐도 신발이 발볼을 누르면 계속 불편해요. 발볼과 사이즈부터 좁혀 보세요."
        />

        <div className="mt-14">
          <YoutubeSection links={[
            { label: "달리기 자세 완벽 정리 — 착지, 케이던스, 보폭, 무게중심", channel: "지니코치", url: "https://www.youtube.com/watch?v=Bph9EsM-24I" },
            { label: "달리기 전후 필요한 스트레칭 — 운동 강도별 루틴", channel: "엔듀로레이스 ENDURORACE", url: "https://www.youtube.com/watch?v=kBluJKveigU" },
            { label: "What Is Perfect Running Form? — Run Technique Tips", channel: "Global Triathlon Network", url: "https://www.youtube.com/watch?v=brFHyOtTwH4" },
          ]} />

          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Braun et al. (2025)</strong> 일반 러너 30명이 몸통 기울기를 다섯 조건으로 바꿔 달렸어요. 기울기 1도당
            고관절 누적 부하는 3.26 Nm·s/kg/1000m 늘고 무릎 누적 부하는 1.08 Nm·s/kg/1000m 줄었어요. 실험실 트레드밀에서
            부하만 잰 연구예요.
            <Ref>J Sport Health Sci · <a href="https://pubmed.ncbi.nlm.nih.gov/39251186/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Warrener et al. (2021)</strong> 23명이 평소 자세와 더 숙인 세 자세로 달렸어요. 많이 숙인 자세에서 부하율이
            약 29% 커지고, 보폭은 약 6% 짧아지고 걸음 수는 약 7% 늘었어요. 고관절 신전 모멘트는 약 70% 늘고 무릎은 약 22%
            줄었어요.
            <Ref>Hum Mov Sci · <a href="https://pubmed.ncbi.nlm.nih.gov/34000575/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Chiba et al. (2025)</strong> 젊은 남성 10명이 등을 둥글게 만 자세와 평소 자세로 걷고 달렸어요. 숨 쉬는
            부담이 작지만 일관되게 늘었고, 달릴 때 분당 환기량 증가는 통계적으로 유의하지 않은 경향이었어요. 산소섭취량은
            차이가 없었고 연구진은 예비 결과라고 밝혔어요.
            <Ref>Cureus · <a href="https://pubmed.ncbi.nlm.nih.gov/41164020/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Pontzer et al. (2009)</strong> 10명이 평소대로, 팔을 가슴에 묶은 상태, 팔꿈치에 무게를 단 상태로 걷고
            달렸어요. 팔은 몸통과 머리의 회전을 줄여 주는 쪽으로 움직였고, 팔 흔들기를 막아도 이동에 드는 에너지는 달라지지
            않았어요.
            <Ref>J Exp Biol · <a href="https://pubmed.ncbi.nlm.nih.gov/19181900/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
