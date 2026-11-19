import type { Metadata } from "next";
import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import WideShoeList, { wideSummary } from "@/components/WideShoeList";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, H3, Num, KeyPoints, Steps, OneLine, Caveat, Sources, Src, Ref } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

/**
 * 발볼 넓은 발 — 와이드 규격
 *
 * 검색어(네이버 2026-08 실측): 이 페이지가 받는 질의 7개·노출 373. 「2e 와이드 뜻」 255 가 가장 크다 —
 * 그래서 제목 맨 앞의 그 말은 바꾸지 않는다. 「발볼 와이드 기준」은 CTR 50%.
 *
 * 2026-09-14 고친 것: 제목이 「내 발볼 재는 법」을 약속하는데 본문에 재는 법이 없었다(midfoot 과 같은 결함).
 *   mm 기준 표는 만들지 않았다 — 브랜드마다 같은 2E 의 실제 너비가 다르고, 기억으로 표를 만들면 지어낸 숫자가 된다.
 *   재는 법만 주고 기준은 브랜드 사이즈표로 보낸다.
 *
 * 2026-10-08 재검증(건강·발 형태 주장만 PubMed 초록과 대조):
 *   · 「달리는 동안 발이 붓고 퍼져 커진다」 → 반대 근거(Mo 2024). 연구마다 갈린다고 고침
 *   · 「붓기·물집·눌림이면 규격이 안 맞는 것」 단정 → Buldt 2018 로 「신호일 수 있음」으로 낮춤
 *   · 표의 「달릴 때 많이 붓는 편」「평발로 퍼짐」, 하루 중 붓기·좌우 차이 정상 → 근거 못 찾아 경험칙으로 낮추거나 뺌
 *
 * 2026-11-18 확정 틀로 바꿈 (AGENTS.md 「가이드 글 틀」). 이번에 판정하고 고친 것:
 *   · 「발 모양에 맞춘 신발은 부상을 줄이지 않는다」(코크런, 확실)를 5절에 넣었다. 단, **발볼이 좁아서 눌리는 것은
 *     착용감 문제**이고 부상 예방과 다른 결론이라 한 문단 안에서 섞지 않았다(판정요약 #7 의 「회내 제어화로 넓히지 않는다」도 지킴).
 *   · 발 아치 이야기는 하지 않는다 — Mo 2024 의 아치 높이 감소는 쓰지 않고 flat-feet 로 보낸다. 그 글 차례가 받는다.
 *   · 「엄지 앞 손가락 하나(1cm)」의 1cm 을 뺐다. 그 숫자를 받치는 자료를 찾지 못했고 브랜드 규격마다 달라 일반화하면 틀린다.
 *     손가락 하나가 들어가는지는 사이트가 쓰는 눈대중이라고 문장에 드러냈다.
 *   · 한국생활과학회지 사이즈코리아 논문(권은순 외 2024, 33(2):251-264)을 출처 목록에서 내렸다. KCI 는 이 환경에서 열리지 않고
 *     2026-10-08 재검증에서도 원문 대조를 못 했다. 날짜 줄이 「연구 N편과 대조」라서 열지 못한 논문을 섞어 세면 그 숫자가 거짓이 된다.
 *     그 논문이 받치던 「나이 많은 그룹이 더 넓다」는 Reeves 2024(초록에서 직접 확인)가 그대로 받친다 — 주장은 남고 분모만 영국 연구로 좁아졌다.
 *   · 글 중간 「이어서 볼 글」 카드를 상황 문장 링크로 바꿨다. 그 부품을 쓰는 마지막 글이어서 GA 이벤트 guide_mid_next_click 이
 *     사이트에서 사라진다. 부품 파일(components/guide/MidNext.tsx)은 지우지 않고 남겨 뒀다.
 *   · 유튜브 3편은 그대로 뒀다. 채널 이름이 대문자뿐인 영상(FORDY RUNS)이 대문자 약어 검사에 걸릴 것으로 보고 한 편을 내렸다가,
 *     실제로 넣고 돌려 보니 통과했다 — 검사는 한글이 든 글자 조각만 보기 때문에 영문만 있는 이름은 애초에 세지 않는다.
 *     cadence 가 영상을 내린 것은 채널 이름에 한글이 섞여 있었기 때문이다(신정식 RUN_TV). 영문만 있는 채널명은 내릴 필요가 없다.
 *   · 읽은 초록 요약 (다음 차례가 다시 조회하지 않게):
 *     - Buldt & Menz 2018, J Foot Ankle Res: Ovid MEDLINE·CINAHL 검색 1,681건에서 18편 서술 리뷰.
 *       참가자 63~72% 가 발 폭·길이에 맞지 않는 신발. 다운증후군 아동·고령자·당뇨인은 너무 좁은 신발 46~81%.
 *       발 통증, 작은발가락 변형, 티눈, 굳은살과 연관. 결론은 신발 맞춤 교육과 폭 선택 확대 요구. 권·호·쪽 확인 못 함
 *     - Mo et al. 2024, Front Bioeng Biotechnol: 남성 레크리에이션 러너 19명, 10km 전후 3D 스캔.
 *       발 길이 증가 p=0.007(η²=0.18), 볼 둘레 감소 p=0.038(η²=0.11), 둘 다 절대 변화 2mm 미만.
 *       주상골·발등·아치 높이 감소 p<0.001, 아치 강성 증가 p<0.001. 권·호·쪽 확인 못 함
 *     - Reeves et al. 2024, Gerontology: 영국에서 라켓·팀 스포츠를 하는 여성 374명, 50% 체중 부하 스캔, 오른발 분석.
 *       10년 단위 연령대(18-29 ~ 70-79). 18-29 그룹이 발너비·볼 둘레·짧은 뒤꿈치 둘레가 더 나이 많은 그룹보다 유의하게 작음
 *       (p<0.05, η²=0.042~0.056). 같은 사람을 추적한 설계가 아니다. 권·호·쪽 확인 못 함
 *     - Relph et al. 2022 코크런은 견본에서 이미 판정한 주장이라 다시 조회하지 않았다(판정요약 「확실」).
 */

const PAGE_URL = pageUrl("/injury/wide-foot");
const TITLE = "2E 와이드 뜻, 내 발볼도 넓은 편일까요?";
// 원장 lib/guide/articles.ts 의 desc 와 같은 문장이어야 한다(허브 카드·검색 결과가 어긋나지 않게)
const DESC =
  "2E는 넓음, 4E는 매우 넓음을 뜻하는 폭 표시입니다. 내 발볼을 집에서 재는 법과 와이드가 필요한지 확인하는 법을 봅니다.";

export const metadata: Metadata = {
  title: `${TITLE} | 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/wide-foot" },
};

const FAQ: FaqItem[] = [
  {
    q: "275mm 신는 사람의 표준 발볼은 몇 mm인가요?",
    a: "모든 브랜드에 통하는 숫자는 없어요. 같은 표준 폭이라도 브랜드마다 실제 너비가 달라요. **집에서 발볼을 재고, 사려는 브랜드 사이즈표와 맞춰** 보길 권해요.",
  },
  {
    q: "와이드 옵션이 많은 러닝화 브랜드는 어디인가요?",
    a: wideSummary(),
  },
  {
    q: "넓은 폭을 신어도 새끼발가락이 눌리면 더 넓은 폭으로 가야 하나요?",
    a: "폭을 더 올리기 전에 **같은 폭의 다른 브랜드**를 신어 보길 권해요. 같은 넓은 폭이라도 브랜드마다 실제 너비가 달라요. 길이가 짧아 발이 앞으로 밀려도 옆이 눌리는 느낌이 나니, **발볼과 길이를 같이 재** 보세요.",
  },
  {
    q: "폭이 맞지 않는 신발을 신으면 어떻게 되나요?",
    a: "발 통증, 티눈, 굳은살과 관련이 있었어요. 여러 연구를 모은 리뷰의 결과예요. 다만 러너만 본 자료는 아니에요. **눌리거나 붉어진 자리가 남으면 폭을 한 단계 넓혀** 보세요.",
  },
];

const pill = "rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400";

export default function WideFootPage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} datePublished="2025-03-01" />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["발볼 넓은 발", "/injury/wide-foot"],
        ]}
      />
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        {/* 규약은 app/injury/page.tsx 상단 주석 */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">발볼</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/wide-foot" compact checked={4} />

        {/* 첫 줄이 2E·4E 의 첫 등장이라 여기서 뜻을 밝힌다 — 태그를 끼우면 풀이 문장이 끊긴다 */}
        <KeyPoints
          items={[
            <>2E는 넓은 폭을 뜻해요. 4E는 그보다 더 넓은 폭이에요. 아무 표시가 없으면 보통 폭이에요.</>,
            <>몇 mm부터 와이드인지 정해진 기준은 없어요. 잰 숫자를 <strong>사려는 브랜드 사이즈표</strong>와 맞춰 봐요.</>,
            <>밑창 끝보다 발이 옆으로 삐져나오면 <strong>폭을 한 단계 넓혀</strong> 보기를 권해요.</>,
          ]}
        />

        <Lead>
          달리고 나서 새끼발가락이 눌리거나 발 바깥쪽이 쓸린다면, 발 길이가 아니라 폭이 안 맞는 걸 수 있어요. 와이드 표시는
          길이가 아니라 폭을 가리켜요.
        </Lead>

        <TableOfContents
          items={[
            { id: "what", label: "2E, 4E 뜻" },
            { id: "need", label: "와이드가 필요한가요?" },
            { id: "measure", label: "집에서 재는 법" },
            { id: "change", label: "발볼이 달라지나요?" },
            { id: "injury", label: "덜 다치나요?" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="what" className={H2}>
          <Num n={1} />2E, 4E는 무슨 뜻인가요?
        </h2>
        <P>
          같은 길이라도 폭이 다른 규격으로 나와요. 미국 규격 기준으로 좁은 쪽부터 <strong>B, D, 2E, 4E</strong> 순서예요.
          신발에 아무 표시가 없으면 D, 곧 표준 폭이에요.
        </P>
        <P>같은 모델이라도 넓은 폭은 따로 나와요. 어느 모델에 넓은 폭이 있는지는 이 글 아래쪽 표에서 셌어요.</P>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full overflow-hidden rounded-xl border border-gray-200 text-base">
            <thead className="bg-gray-50">
              <tr>
                {["표시", "뜻"].map((h) => (
                  <th key={h} className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["B", "좁음"],
                ["D", "표준 (표시가 없으면 이것)"],
                ["2E", "넓음"],
                ["4E", "매우 넓음"],
              ].map(([code, width], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 font-mono font-bold text-blue-700">{code}</td>
                  <td className="break-keep px-4 py-3 text-gray-700">{width}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <OneLine>와이드는 길이가 아니라 폭 표시예요. 표시가 없으면 표준 폭이에요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="need" className={H2}>
          <Num n={2} />발볼이 넓은 편이면 와이드를 신어야 하나요?
        </h2>
        <P>
          폭 표기를 찾기 전에 <strong>지금 신는 신발이 눌리는지</strong>부터 보세요. 저희가 쓰는 확인법은 셋이에요.
        </P>
        <Steps
          title="이렇게 확인해 보세요"
          items={[
            { t: "신발을 벗고 밑창을 봐요.", d: "밑창 끝보다 발이 옆으로 삐져나와 있으면 폭이 좁은 거예요." },
            { t: "5km 넘게 달린 뒤 발을 봐요.", d: "새끼발가락이나 발 바깥쪽에 눌린 자리나 붉어진 자리가 남으면 폭을 넓혀 볼 신호예요." },
            { t: "앞코 여유를 따로 봐요.", d: "엄지발가락 앞에 손가락 하나가 들어가는데도 옆이 눌리면 길이가 아니라 폭 문제예요. 손가락 하나는 저희가 쓰는 눈대중이에요." },
          ]}
        />
        <P>
          폭이나 길이가 맞지 않는 신발은 <strong>발 통증, 작은발가락 변형, 티눈, 굳은살</strong>과 연관이 있었어요. 연구 18편을
          모은 리뷰에서 참가자의 <strong>63~72%</strong>가 그런 신발을 신고 있었어요.
        </P>
        <Caveat>러너를 모은 연구는 아니에요. 일반 성인과 고령자, 당뇨가 있는 사람을 본 연구들을 모은 리뷰예요.</Caveat>

        <OneLine>밑창 밖으로 발이 삐져나오면, 폭을 한 단계 넓혀 보기를 권해요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="measure" className={H2}>
          <Num n={3} />발볼은 집에서 어떻게 재나요?
        </h2>
        <P>
          종이 한 장과 자만 있으면 돼요. <strong>저녁에 재는 것</strong>이 흔한 요령이에요.
        </P>
        <Caveat>하루 중에 발 크기가 얼마나 달라지는지 확인한 자료는 찾지 못했어요.</Caveat>
        <Steps
          title="이렇게 재 보세요"
          items={[
            { t: "종이 위에 서서 체중을 실어요.", d: "신발을 신고 달릴 때처럼 체중이 실린 상태로 재요." },
            { t: "연필을 바닥과 수직으로 세워 발 윤곽을 그려요." },
            { t: "가장 넓은 곳을 가로로 재요.", d: "엄지발가락 아래 튀어나온 뼈에서 새끼발가락 아래 뼈까지예요." },
            { t: "양발 다 재서 넓은 쪽을 써요.", d: "발뒤꿈치에서 가장 긴 발가락까지 길이도 같이 재 두면 사이즈표를 볼 때 함께 쓸 수 있어요." },
          ]}
        />
        <P>
          <strong>몇 mm부터 와이드라는 절대 기준은 없어요.</strong> 사려는 브랜드 사이즈표에서 내 발 길이에 해당하는 줄을 찾아
          폭을 맞춰 보세요. 같은 2E라도 브랜드마다 실제 너비가 다를 수 있고, 브랜드별 실측을 모아 비교한 자료는 저희가
          확인하지 못했어요.
        </P>
        <Caveat>
          한국 산업 표준에 발 너비 규격이 있다는 언급은 확인했지만, 원문을 열어 보지 못했어요. 그래서 본문에 수치 기준을 적지
          않았어요.
        </Caveat>

        <OneLine>저녁에 종이 위에 서서 재고, 그 숫자를 사려는 브랜드 사이즈표와 맞춰 봐요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="change" className={H2}>
          <Num n={4} />달리거나 나이가 들면 발볼이 달라지나요?
        </h2>
        <P>
          달리면 발이 커져서 눌린다는 말이 흔하지만, 한 연구에서는 10km를 달린 뒤 발 길이는 조금 늘고 볼 둘레는 오히려
          줄었어요. 차이는 둘 다 <strong>2mm 미만</strong>이었어요.
        </P>
        <Caveat>남성 러너만 모은 작은 연구 하나라 단정하기는 어려워요.</Caveat>
        <P>
          그러니 달린 뒤의 눌림을 발이 커진 탓으로만 넘기지 말고, <strong>폭을 한 번 재 보세요.</strong>
        </P>

        <h3 className={H3}>나이 많은 그룹의 발너비가 더 넓었어요</h3>
        <P>
          한 연구에서 18~29세 그룹의 발너비와 볼 둘레가 더 나이 많은 그룹보다 좁은 편이었어요. 예전에 신던 사이즈를 그대로
          쓰고 있다면 <strong>한 번 다시 재 보세요.</strong>
        </P>
        <Caveat>
          영국에서 운동하는 여성을 나이대로 나눠 비교한 연구예요. 같은 사람을 오래 추적한 설계가 아니라 나이가 들면서
          넓어진다고까지는 말할 수 없어요.
        </Caveat>

        <OneLine>발이 커졌다고 생각하기 전에, 지금 발볼을 한 번 재 보기를 권해요.</OneLine>

        {/* ── 5 ─────────────────────────────────────────── */}
        <h2 id="injury" className={H2}>
          <Num n={5} />와이드로 바꾸면 덜 다치나요?
        </h2>
        <P>
          부상이 줄어들 거라고 기대하지는 마세요. <strong>발 모양에 맞춰 고른 신발도 부상을 거의 줄이지 못했어요.</strong>{" "}
          여러 연구를 빠짐없이 모아 본 코크런 고찰의 결론이에요.
        </P>
        <P>
          폭을 넓히는 건 다른 이유로 하는 거예요. <strong>눌림, 티눈, 굳은살처럼 신으면서 바로 느끼는 불편</strong>을 줄이려는
          쪽이고, 덜 다치려는 쪽이 아니에요. 두 가지는 다른 이야기예요.
        </P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/flat-feet" className={pill}>발 아치가 낮은 편이라면 →</Link>
          <Link href="/injury/plantar-fasciitis" className={pill}>발바닥 뒤꿈치가 아프다면 →</Link>
        </div>

        <OneLine>와이드는 덜 다치려고 신는 게 아니라, 눌리지 않으려고 신는 거예요.</OneLine>

        {/* 2026-10-12: 손으로 쓴 브랜드 표가 신발 원장과 어긋나(On·Hoka·Nike) 원장에서 계산하는 표로 바꿨다 — components/WideShoeList.tsx */}
        <div className="mt-14">
          <WideShoeList />
        </div>
        <p className="mt-3 break-keep text-xs leading-relaxed text-gray-400">추천 순서는 광고비로 바뀌지 않아요. 브랜드별 와이드 옵션은 각 브랜드 공식 정보 기준이고, 모델과 연식에 따라 달라질 수 있어요.</p>

        <FinderCta
          from="wide-foot"
          variant="inline"
          headline="발볼 조건을 켜면 넓은 폭 옵션이 있는 신발만 볼 수 있어요."
        />

        <YoutubeSection links={[
          { label: "Best Running Shoes for Wide Feet 2024: Top 3 Picks Revealed!", channel: "FORDY RUNS", url: "https://www.youtube.com/watch?v=hv9V9D51cFU" },
          { label: "The Best Wide-Fitting Neutral Running Shoes: Expert Review", channel: "Run and Become", url: "https://www.youtube.com/watch?v=g9BGWko7e9M" },
          { label: "Running Shoes for Wide Feet — My Top 5 Picks", channel: "Find My Footwear", url: "https://www.youtube.com/watch?v=CALXqH6mhsw" },
        ]} />

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Buldt &amp; Menz (2018)</strong> 연구 18편을 모은 리뷰예요. 참가자의 63~72%가 발 폭이나 길이에 맞지 않는
            신발을 신었고, 맞지 않는 신발은 발 통증·작은발가락 변형·티눈·굳은살과 연관됐어요.
            <Ref>J Foot Ankle Res · <a href="https://pubmed.ncbi.nlm.nih.gov/30065787/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Mo et al. (2024)</strong> 남성 레크리에이션 러너 19명이 10km를 달린 뒤 발 길이는 늘고 볼 둘레는 줄었어요.
            변화는 둘 다 2mm 미만이었어요.
            <Ref>Front Bioeng Biotechnol · <a href="https://pubmed.ncbi.nlm.nih.gov/39193231/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Reeves et al. (2024)</strong> 영국에서 운동하는 여성 374명을 나이대로 나눠 보니 18~29세 그룹의 발너비와 볼
            둘레가 더 나이 많은 그룹보다 작았어요.
            <Ref>Gerontology · <a href="https://pubmed.ncbi.nlm.nih.gov/39369693/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Relph et al. (2022)</strong> 발 모양에 맞춰 고른 신발도 부상에 거의 차이가 없었어요.
            <Ref>Cochrane Database Syst Rev · <a href="https://pubmed.ncbi.nlm.nih.gov/35993829/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 발 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
