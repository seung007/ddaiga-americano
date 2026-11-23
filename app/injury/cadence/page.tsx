import type { Metadata } from "next";
import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, Num, KeyPoints, Steps, OneLine, Caveat, Sources, Src, Ref } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

/**
 * 2026-11-23 본문에 남아 있던 연구 인원(러너 N명)을 뺐다 — 인원은 접힌 출처에만(가이드 틀 「연구 대상·인원·나라는 접힌 출처에만」). 주장·숫자는 그대로
 *
 * 걸음 수(케이던스) — 워치 숫자가 낮아 보여 찾아온 사람이 읽는 글
 *
 * 2026-10-08 재검증 — 키별 기준표를 내렸다(Cavanagh & Kram 1989: 신체 치수로 개인 걸음 수를 처방할 수 없다).
 *   제목·메타의 「키별 적정 기준값」 전제도 같이 버렸다.
 *
 * 2026-11-18 확정 틀로 바꿈 (AGENTS.md 「가이드 글 틀 — 2026-11-18 확정」, 견본 app/injury/start-running/page.tsx)
 *   말투 「~니다」 → 「~요」. 날짜 한 줄 · 3줄 요약 · 번호 붙은 큰 질문 4개 · 절 끝 한 줄 요약 · 글 끝 접힌 「근거와 출처」 5편.
 *   옛 부품 여섯 개(머리 요약 상자 · 접히는 근거 상자 · 할 일 상자 · 근거 수준 딱지 · 별표 단서 줄 · 글 끝 문헌 목록)를 걷어냈다.
 *   (옛 부품 이름을 주석에 그대로 적으면 check:geo 가 글에 남은 것으로 세므로 풀어서 적는다.)
 *   · 큰 절 3개(180은 어디서 · 키 · 높을수록 좋나) → 번호 붙은 큰 질문 4개. 재는 법을 1절 안의 할 일로 올렸고
 *     「어떻게 올리나요」를 절로 세웠다 — 「할 일이 먼저, 이유는 뒤」. id 는 where-180·height·raise 를 그대로 두고 how-to 를 더했다
 *     (grep -rn "cadence#" app lib components → 0건, 2026-11-18 확인)
 *   · 빵부스러기(구조화 데이터) 이름을 「케이던스」에서 「걸음 수」로 바꿨다 — 본문 첫 등장보다 먼저 나와 풀이 검사를 통과할 자리가 없었고,
 *     일상어 이름이 읽기도 쉽다(발뒤꿈치 통증 글 선례). 제목 아래 「협찬 없이 작성」 띠는 글 끝 글쓴이 소개와 같은 내용이라 뺐다
 *
 *   고친 것 — 주장을 초록으로 다시 판정한 결과 (QxMD read.qxmd.com/read/<PMID>, 2026-11-18 직접 열어 대조)
 *   · **180의 유래(1984년 · 잭 다니엘스 · 올림픽 선수 관찰)를 뺐다.** 2026-10-08 에 「원 기록을 확인하지 못했다」고 적어 두고
 *     41일을 그대로 넘겼다(AGENTS 신뢰 규칙 5가 말하는 그 상황이다). 이름·연도·대회는 확인되지 않은 채 구체적이라
 *     작화 신호에 해당한다 → 유래를 지우고, 초록에서 확인되는 것만 남겼다: 분당 180보를 권하는 조언이 흔하다는 서술
 *     (Lieberman 2015 초록 "Endurance runners are often advised to use 90 strides min(-1)").
 *     **대체 유래를 만들지 않았다.**
 *   · **180 대신 쓸 수 있는 확인된 숫자를 넣었다.** Lieberman 2015 에서 에너지가 가장 적게 드는 값의 평균이
 *     분당 84.8 스트라이드(표준편차 3.6) = 걸음으로 약 170보였다. 분당 보폭을 걸음으로 바꾼 2배는 계산이지 추정이 아니다
 *     (코스 왕복 거리와 같은 처리). 개인차는 표준편차까지만 근거라서 「사람마다 달라요」로 쓰고 범위를 지어내지 않았다
 *   · **무릎 쪽 결과의 세기를 낮췄다.** Heiderscheit 2011 의 결과는 맞지만, 그것을 포함한 고찰(Anderson 2022)이
 *     무릎·고관절이 흡수하는 에너지 감소를 「근거 제한적」으로 등급 지었다 → 「한 트레드밀 실험에서」 + 고찰 등급을 단서로
 *   · **부하가 어디로 옮겨 가는지를 적었다.** Lieberman 2015: 분당 보폭 5 증가마다 고관절을 굽히는 최대 힘 +5.8%,
 *     착지 위치는 고관절 기준 -5.9%. 「부담이 무릎에서 고관절로 옮겨 간다」로는 쓰지 않았다 — Heiderscheit 의 고관절 지표는
 *     오히려 줄었고(흡수 에너지·모음 모멘트), 둘은 다른 양이다. 두 결과를 각각 적고 합치지 않았다
 *   · **「걸음 수를 올리면 덜 다친다」를 쓰지 않았다.** Anderson 2022 결론은 부상·기록 모두 「결론 낼 근거 부족」이다.
 *     고찰 안에 무릎 앞 통증 러너에서 4·12주 통증·기능이 나아졌다는 보고가 있지만 등급이 「매우 제한적」이고,
 *     무릎 앞 통증 글이 이미 한 무작위 시험으로 「통증이 더 줄지는 않았다」고 판정했다. 더 센 쪽으로 쓰지 않고 그 판정을 따랐다
 *   · **Van Oeveren 2019 의 다리 길이 방향을 쓰지 않았다.** 같은 쪽 초록과 요약이 음·양으로 엇갈려서 방향을 확인할 수 없다.
 *     키·다리 길이 질문의 답은 Cavanagh & Kram 이 지고, 다리 길이에 대한 방향 진술은 넣지 않았다
 *   · **착지 방식(앞발·중간발·뒤꿈치) 주장은 이 글에서 하지 않는다** — 미드풋 글 차례가 받는다. 상황 문장 링크만 둔다.
 *     걸음 수를 올리면 보폭이 줄고 착지 위치가 몸 쪽으로 가까워지는 것까지는 이 글의 답이다
 *   · 영상 목록에서 두 편을 내렸다 — 제3자 제목·채널명에 이 글에서 풀이할 자리가 없는 글자가 들어 있어 풀이 검사에 걸렸다.
 *     하나는 제목 속 심박 구간 이름, 하나는 채널 이름 속 영문 대문자다. 검사는 채널 이름과 전문어를 가리지 못한다 —
 *     채널 이름을 고치면 실제 업로더와 어긋나므로(영상 검사가 대조한다) 영상을 내리는 쪽을 골랐다. 검사는 느슨하게 고치지 않았다
 *
 *   확인한 초록 (2026-11-18, 직접 열어서 대조)
 *   · Heiderscheit 2011 — 건강한 일반 러너 45명, 같은 속도 트레드밀, 평소 걸음 수와 ±5%·±10%. 무릎 흡수 에너지는 +5%·+10%에서 감소,
 *     고관절은 +10%에서만 감소. -10%에서는 모든 관절이 더 많이 흡수. 보폭·무게중심 상하 이동·제동 충격량·최대 무릎 굽힘 각도 감소.
 *     +10%에서 최대 고관절 모음 각도와 모음·내회전 모멘트 감소
 *   · Anderson 2022 — 체계적 고찰 37편(부상 2 · 기록 5 · 생체역학 36). 걸음 수를 올릴 때 최대 무릎 굽힘 각도 감소는 근거 강함,
 *     보폭·최대 고관절 모음·무릎 신전 모멘트·착지 각도 감소는 중간, 제동 충격량·슬개대퇴 관절 응력·고관절·무릎 음의 일 감소는 제한적.
 *     부상·기록은 "insufficient evidence to conclusively determine the effects". 대부분 즉각 효과만 측정
 *   · Cavanagh & Kram 1989 — 남성 일반 러너, 트레드밀 초속 3.15~4.12m. 키·다리 길이·분절 질량과 선호 보빈도·보폭의 상관 r≤0.36,
 *     0과 유의하게 다르지 않음. 속도 증가 시 보빈도 약 4% · 보폭 약 28% 증가. 발목 양쪽 1.1kg 추가는 변화 없음.
 *     결론: 개인 단위로 보빈도·보폭을 예측하거나 처방할 수 없다. 참가자 수는 초록에 없음
 *   · Van Oeveren 2019 — 러너 256명(남 85.5%), 평균 44.1±9.8세, 가민 기록 16,128시간. 집단 수준에서 분당 보빈도 72.82~94.73 이
 *     속도 초속 1.64~4.68m 에 직선 비례(SF = 75.01 + 3.006V), 개인 수준은 2차식이 더 맞음. 다리 길이 방향은 초록과 요약이 엇갈림
 *   · Lieberman 2015 — 키·체중이 다양한 러너 14명, 초속 3.0m 에서 분당 보빈도 75·80·85·90·95. 에너지가 가장 적게 드는 보빈도
 *     평균 84.8±3.6. 보빈도 5 증가마다 최대 고관절 굽힘 모멘트 +5.8% · 고관절 기준 착지 위치 -5.9%. 제동력은 고관절보다 앞에
 *     착지할 때 커지고(무릎 기준으로는 아님), 무릎보다 앞에 착지하면 수직 충격 정점이 커짐(부하율은 P=0.07 로 유의하지 않음)
 *
 *   확인 못 한 것 — 권·호·쪽. QxMD 는 학술지 이름까지만 보여 주고, Europe PMC 는 오늘 첫 호출부터 한도에 걸렸다.
 *   저장소에도 이 다섯 편의 권·호·쪽이 없어서 학술지 이름까지만 적었다. 지어내지 않았다
 */

const PAGE_URL = pageUrl("/injury/cadence");
const TITLE = "케이던스 높을수록 좋나요? 꼭 180이어야 하나요";
const DESC =
  "분당 180보는 모두의 목표값이 아닙니다. 지금 내 걸음 수를 세는 법, 올렸을 때 연구에서 실제로 달라진 것과 달라지지 않은 것을 담았습니다.";

export const metadata: Metadata = {
  title: "케이던스 높을수록 좋나요? 꼭 180이어야 하나요 | 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/cadence" },
};

const FAQ: FaqItem[] = [
  {
    q: "워치에 찍힌 케이던스가 170인데 낮은 건가요?",
    a: "낮다고 보기 어려워요. 케이던스는 1분에 발이 땅에 닿는 횟수예요. 한 실험에서 에너지가 가장 적게 드는 걸음 수가 **평균 170쯤**이었고 사람마다 달랐어요. 빨리 달릴수록 올라가니 **천천히 달린 날과 대회 날 숫자를 비교하지 않아도 돼요.**",
  },
  {
    q: "걸음 수를 올리면 더 빨라지나요?",
    a: "그렇다고 말할 근거가 아직 부족해요. 속도는 걸음 수보다 **보폭에서 더 많이** 나와요. 한 실험에서 속도를 올렸을 때 보폭은 약 28% 늘었는데 걸음 수는 약 4%만 늘었어요.",
  },
  {
    q: "무릎이 아픈데 걸음 수를 올리면 나아질까요?",
    a: "덜 아파진다고 말하기는 어려워요. 걸음 수를 바꾸는 게 나쁘다는 뜻은 아니고, **아플 때 가장 먼저 할 일은 아니에요.** 먼저 할 일은 무릎 앞 통증 글에 있어요.",
  },
];

const pill = "rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400";

export default function CadencePage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["걸음 수", "/injury/cadence"],
        ]}
      />
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-600">걸음 수</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/cadence" compact checked={5} />

        <KeyPoints
          items={[
            <>분당 180보는 모두의 목표값이 아니에요. <strong>먼저 지금 내 걸음 수를 세어 보세요.</strong></>,
            <><strong>키별 기준표는 찾지 않아도 돼요.</strong> 키나 다리 길이와 걸음 수의 관계는 약했어요.</>,
            <>올리고 싶다면 한 번에 180으로 맞추지 말고 <strong>지금 값에서 조금씩</strong> 올려 보길 권해요.</>,
          ]}
        />

        <Lead>
          워치에 찍힌 숫자가 남들보다 낮아 보여 신경 쓰인다면, 목표값을 찾기 전에 내 속도부터 볼 만해요.
          달릴 때 분당 발이 땅에 닿는 횟수를 케이던스라고 해요.
        </Lead>

        <TableOfContents
          items={[
            { id: "where-180", label: "180에 맞춰야 하나요?" },
            { id: "height", label: "키에 맞는 값이 있나요?" },
            { id: "raise", label: "올리면 뭐가 달라지나요?" },
            { id: "how-to", label: "어떻게 올리나요?" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="where-180" className={H2}>
          <Num n={1} />분당 180보에 꼭 맞춰야 하나요?
        </h2>
        <P>
          아니요. 180은 모두의 목표값이 아니에요. <strong>목표값을 정하기 전에 지금 내 걸음 수를 세어 보세요.</strong>
        </P>
        <Steps
          title="지금 내 걸음 수를 세는 법"
          items={[
            { t: "편안한 속도로 잠깐 달려요.", d: "숨이 고르게 쉬어지는 속도면 돼요." },
            { t: "한쪽 발이 땅에 닿는 횟수를 30초 동안 세어 보세요.", d: "오른발만 세면 편해요." },
            { t: "그 수에 4를 곱해요.", d: "그게 분당 걸음 수예요." },
          ]}
        />
        <P>
          분당 180보라는 숫자가 어디서 나왔는지는 저희가 확인하지 못했어요. 이 조언이 흔하다는 서술은 연구 논문에도 있지만,
          숫자의 출처를 밝힌 자료는 찾지 못했어요.
        </P>
        <P>
          대신 확인된 것이 있어요. 같은 속도로 달린 한 실험에서 <strong>에너지가 가장 적게 드는 걸음 수의 평균은
          분당 170보쯤</strong>이었고, 그 값은 사람마다 달랐어요.
        </P>
        <P>
          같은 사람도 <strong>빨리 달릴수록 걸음 수가 올라가요.</strong> 러너들의 워치 기록을 모은 연구에서 걸음 수는
          분당 약 146보에서 190보 사이에 퍼져 있었고, 속도에 따라 올라갔어요. 천천히 달리는 날의 숫자가 180보다 낮은 것은
          이상한 일이 아니에요.
        </P>

        <OneLine>180에 맞추기 전에, 지금 내 걸음 수와 속도를 먼저 봐요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="height" className={H2}>
          <Num n={2} />키나 다리 길이에 맞는 걸음 수가 따로 있나요?
        </h2>
        <P>
          없어요. <strong>키별 기준표는 찾지 않아도 돼요.</strong> 남성 일반 러너를 잰 한 실험에서 키·다리 길이와 평소 걸음 수의
          관계는 약했고, 통계적으로도 0과 다르다고 할 수 없었어요. 연구진은 신체 치수로 개인의 걸음 수를 예측하거나 처방할 수
          없다고 적었어요.
        </P>
        <P>
          그러니 기준으로 삼을 숫자는 남의 키가 아니라 <strong>방금 센 내 숫자</strong>예요.
        </P>
        <Caveat>
          예전에 이 자리에 키별 걸음 수 표가 있었어요. 근거가 없는 숫자여서 2026년 10월에 내렸어요.
        </Caveat>

        <OneLine>내게 맞는 걸음 수는 키에서 나오지 않아요. 내 숫자에서 시작해요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="raise" className={H2}>
          <Num n={3} />걸음 수를 올리면 몸에서 뭐가 달라지나요?
        </h2>
        <P>
          보폭이 줄고, <strong>무릎이 흡수하는 에너지가 줄었어요.</strong> 같은 속도로 달린 한 트레드밀
          실험에서 평소보다 5~10% 올렸을 때 그랬고, 10% 올렸을 때는 고관절도 같이 줄었어요.
        </P>
        <P>
          공짜는 아니에요. 다른 실험에서는 걸음 수를 올릴수록 <strong>다리를 앞으로 가져오는 고관절 근육의 힘이 커졌어요.</strong>{" "}
          분당 10보를 올릴 때마다 약 6%였어요.
        </P>
        <P>
          <strong>부상이 줄거나 기록이 좋아지는지는 아직 근거가 부족해요.</strong> 연구 37편을 모은 고찰이 그렇게 결론 냈어요.
          대부분 걸음 수를 바꾼 그 자리에서 달라지는 것만 본 연구였어요. 걸음 수를 올리면 어색하거나 더 힘들게 느껴진다는
          보고도 있었어요.
        </P>
        <Caveat>
          무릎이 흡수하는 에너지가 줄었다는 결과도 그 고찰은 근거가 제한적이라고 등급을 매겼어요.
        </Caveat>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/knee-pain" className={pill}>무릎 앞이 아프다면 →</Link>
          <Link href="/injury/midfoot" className={pill}>발이 어디로 닿는지가 고민이라면 →</Link>
          <Link href="/injury/achilles" className={pill}>아킬레스가 아프다면 →</Link>
        </div>

        <OneLine>무릎 쪽 부담은 줄었지만, 덜 다치거나 빨라진다는 근거는 아직 없어요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="how-to" className={H2}>
          <Num n={4} />걸음 수는 어떻게 올리나요?
        </h2>
        <P>
          <strong>지금 값에서 5~10%쯤만 올려 보길 권해요.</strong> 연구에서 시험한 폭이 평소보다 5~10% 올린 조건이라, 그 범위를
          그대로 따라 쓰는 거예요. 더 올리면 어떻게 되는지를 잰 자료는 찾지 못했어요.
        </P>
        <Steps
          items={[
            { t: "목표를 숫자로 적어요.", d: "지금 분당 160보라면 168~176보예요." },
            { t: "달리기 전체가 아니라 짧은 구간에서만 해 봐요.", d: "한 번에 몇 분이면 충분해요." },
            { t: "보폭을 억지로 좁히지 말고, 발을 조금 더 자주 놓는다고 생각해요." },
            { t: "다음 날 아프면 되돌려요.", d: "원래 걸음 수로 달리고, 다음에 더 작게 올려요." },
          ]}
        />
        <Caveat>
          며칠 만에 바뀌는 값은 아니에요. 몸에 익는 데 얼마나 걸리는지를 잰 자료는 찾지 못해서 기간을 적지 않았어요.
        </Caveat>

        <OneLine>지금 값에 5~10%만 더해, 짧은 구간에서 먼저 해 봐요.</OneLine>

        <FinderCta
          from="cadence"
          variant="inline"
          headline="걸음 수는 신발을 바꾸지 않아도 오늘 바꿀 수 있어요. 신발은 발볼과 사이즈가 맞는지부터 보세요."
        />

        <div className="mt-14">
          <YoutubeSection links={[
            { label: "케이던스는 무조건 빠른 게 좋을까? [달리기 보폭과 케이던스]", channel: "달려라주원", url: "https://www.youtube.com/watch?v=9XIpX69kW2c" },
            { label: "직접 180 케이던스로 뛰어보며 비교 — 러닝 트렌드", channel: "방구석 운동가 디어", url: "https://www.youtube.com/watch?v=iGeS1N1eYJQ" },
            { label: "러닝 케이던스 180으로 고정하지 마세요", channel: "런앤다이어트", url: "https://www.youtube.com/shorts/FoMWaZKMTMU" },
            { label: "러닝 케이던스 올리는 법", channel: "지니코치", url: "https://www.youtube.com/shorts/AYcPMquGIds" },
            { label: "이상적인 러닝 케이던스는? (서울대 스포츠공학)", channel: "엔듀로레이스 ENDURORACE", url: "https://www.youtube.com/shorts/c0mtXc3Twmo" },
            { label: "케이던스 180이 정답일까요?", channel: "엔듀로레이스 ENDURORACE", url: "https://www.youtube.com/shorts/PUBWGbEuTSg" },
          ]} />
        </div>

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Heiderscheit et al. (2011)</strong> 평소보다 걸음 수를 5%·10% 올렸을 때 무릎이 흡수하는 에너지가 줄었고,
            고관절은 10%에서만 줄었어요. 10% 낮췄을 때는 모든 관절이 더 많이 흡수했어요(건강한 일반 러너 45명, 같은 속도 트레드밀).
            <Ref>Med Sci Sports Exerc · <a href="https://pubmed.ncbi.nlm.nih.gov/20581720/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Anderson et al. (2022)</strong> 연구 37편을 모은 체계적 고찰이에요. 걸음 수를 올릴 때 무릎 굽힘 각도가
            줄어드는 것은 근거가 강했지만, 무릎·고관절이 흡수하는 에너지가 줄어드는 것은 근거가 제한적이었어요. 부상과 기록은
            결론을 내릴 근거가 부족하고, 대부분 바꾼 그 자리의 효과만 본 연구였어요.
            <Ref>Sports Med Open · <a href="https://pubmed.ncbi.nlm.nih.gov/36057913/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Cavanagh &amp; Kram (1989)</strong> 키·다리 길이·분절 무게와 평소 걸음 수의 상관이 0.36 이하였고 0과
            유의하게 다르지 않았어요. 속도를 올렸을 때 걸음 수는 약 4%, 보폭은 약 28% 늘었어요(남성 일반 러너, 트레드밀 초속
            3.15~4.12m). 연구진은 개인 단위로 걸음 수나 보폭을 예측하거나 처방할 수 없다고 적었어요. 참가자 수는 초록에 없어요.
            <Ref>Med Sci Sports Exerc · <a href="https://pubmed.ncbi.nlm.nih.gov/2674599/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Van Oeveren et al. (2019)</strong> 러너 256명의 워치 기록 16,128시간이에요. 논문은 걸음 수를 스트라이드(양발이
            한 번씩 닿는 한 주기)로 적어요. 집단 수준에서 분당 72.82~94.73 스트라이드가 속도 초속 1.64~4.68m 에 직선으로 비례했고,
            걸음으로 세면 약 146~190보예요. 다리 길이의 방향은 같은 쪽 초록과 요약이 엇갈려서 쓰지 않았어요.
            <Ref>J Sports Sci · <a href="https://pubmed.ncbi.nlm.nih.gov/31079578/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Lieberman et al. (2015)</strong> 키·체중이 다양한 러너 14명이 초속 3.0m 로 달리며 분당 75·80·85·90·95
            스트라이드를 시험했어요. 에너지가 가장 적게 드는 값은 평균 84.8 스트라이드(표준편차 3.6)로, 걸음으로 세면 약 170보예요.
            스트라이드를 분당 5 올릴 때마다 고관절을 굽히는 최대 힘이 5.8% 커졌고 착지 위치는 고관절 쪽으로 5.9% 가까워졌어요.
            지구력 러너에게 분당 90 스트라이드(걸음으로 180보)를 권하는 조언이 흔하다는 서술도 이 초록에 있어요.
            <Ref>J Exp Biol · <a href="https://pubmed.ncbi.nlm.nih.gov/26538175/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
