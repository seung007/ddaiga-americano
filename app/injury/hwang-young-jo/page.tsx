import Link from "next/link";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, Num, KeyPoints, Steps, OneLine, Sources, Src, Ref } from "@/components/guide/Read";
import type { Metadata } from "next";
import { pageUrl } from "@/lib/site";

/**
 * 2026-10-08 재검증 — 기사 원문과 대조(서울신문 1992-08-11 두 기사·매일신문 2024-10-22 은 원문 페이지에서 직접 확인)
 *   · 「당시 24세」 → 22세. 1970-03-22 출생, 서울신문 「황영조(22·코오롱)」, olympics.com 「at age 22」
 *   · 「한국 마라톤 처음이자 유일한 올림픽 금」 → 손기정(1936, 일장기) 이후 「태극기를 달고는 처음」(서울신문 사설), 2024 파리까지 유일
 *   · 「고통은 피하는 것이 아니라 읽어야 하는 신호」, 「통증을 참고 달리는 게 아니라…」 두 인용 — 출처를 찾지 못해 삭제.
 *     《나는 달린다》라는 황영조 저서도 찾지 못했고, 출처 링크는 책이 아니라 백과사전 항목이었다(열람 차단).
 *     실존 인물에게 말을 지어 붙인 것이라 제목·h1·메타·FAQ 의 「고통을 읽는다」 축을 버렸다.
 *     대신 매일신문 강연 기사에서 원문 확인한 본인 발언(「달리기는 지옥…」)을 싣고,
 *     「통증을 신호로 읽자」는 이 글의 제안이지 선수의 말이 아님을 명시했다.
 *   · 「훈련 기록을 보면 초기엔 지속 가능한 페이스부터」, 「몬주익 역전 이유 중 하나는 오르막 훈련」 — 출처 못 찾음, 삭제
 *   · 「주 3회·48시간이 더 효과적」, 「내리막은 부담이 커짐」 — 근거 못 찾음, 경험칙으로 낮춤. 그는 매주 360km 를 달렸다(서울신문 1992)
 *   · 참고 자료의 kaaf.or.kr·worldathletics.org 루트 링크 → 실제 기사·기록 URL
 *
 * 2026-10-13 가독성 재설계 — 선수 이야기 페이지라 **인용문·출처 표기·기사로 확인한 사실 문장은 그대로** 두고
 *   구조(Lead·Summary·섹션 제목·참고 자료 접기)만 맞췄다. 「3가지」 카드는 할 일 한 줄 + 「저희 제안」 배지 + 단서로 나눴다.
 *   기사 사실 줄(Summary 1번)에는 배지를 달지 않았다 — 논문도 저희 제안도 아니어서.
 *   참고 자료는 map 대신 <li> 를 풀어 적었다(「References n」 검사가 <li> 를 센다). 제목·URL 은 한 글자도 안 바꿨다.
 *
 * 2026-11-10 제목·문장 다시 쓰기 — 오픈채팅(21,649건)에서 「황영조」는 1명, 「몬주익」「금메달」 각 2명뿐이라
 *   이름 검색으로 오는 글로 보고 이름·몬주익·금메달을 앞에 뒀다. 「가져갈 것」(takeaway 직역)과 줄표를 뺐다.
 *   첫 문단에는 숫자를 두지 않는다는 규칙에 따라 Lead·DESC 의 「1992」를 뺐다(본문·한눈에·FAQ 에는 그대로 있다).
 *   기사로 확인한 사실·인용문·출처 표기는 그대로 두고 문장 순서와 끊기만 바꿨다.
 *
 * 2026-11-23 확정 틀로 바꿈 (hyun 님 결정: 「인물 글 2편도 확정 틀 그대로」 — Project 문서 「세션 지시서 (2026-11-23)」 1절)
 *   기사 원문 다시 대조 — 크롬으로 직접 열어 읽음. 판정은 docs/판정/hwang-young-jo.jsonl
 *     · 서울신문 1992-08-11 3면: 「황영조(22·코오롱)」, 「마지막 2㎞.몬주익비탈길을 오르며」, 모리시타(일본), 92년 2월 벳푸­오이타 뒤 「매주 3백60㎞씩」 — 지지
 *     · 서울신문 1992-08-11 사설: 손기정 이후 「태극기를 달고는 처음으로 올림픽을 제패」 — 지지
 *     · 매일신문 2024-10-22: 본인 발언 「나에게 있어서 달리기는 지옥이라고 …그만두는 일뿐이었다」 원문 그대로 — 지지(인용 글자 안 바꿈)
 *     · Wikipedia(보조) 1992 남자 마라톤: 8월 9일, 2위 모리시타 / 남녀 메달리스트 목록: 1996~2024 남자·1984~2024 여자 마라톤 금에 한국 없음 — 지지
 *     · Olympics.com: 「At the age of 22」, 마지막 오르막에서 모리시타를 앞섬 — 지지
 *   바꾼 것
 *     · 한눈에·「3가지」 카드·저희 제안 배지·※ 단서 → 3줄 요약 + 번호 붙은 큰 질문 5개 + 절 끝 한 줄 요약. 딱지 없이 말의 세기(「권해요」)로
 *     · 주어를 선수에서 독자가 할 일로. 선수 이야기는 1절(몬주익)과 2절(고통) 맥락에만
 *     · 「옆 사람과 대화가 가능한 속도」(따옴표) → 「옆 사람과 이야기할 수 있을 만큼 천천히」(문장 규칙 용어 통일표)
 *     · 「주 3회」 → 처음 달리기 글 진도표와 같은 말(주 3회, 달리는 날 사이 하루 쉬기, 권해요). 사이트가 정한 기준이다
 *     · 「48시간 간격이 더 효과적이라는 연구는 확인 못 함」 → 숫자 자체를 뺐다. 중급 글·쉬는 날 글에서도 48시간은 같은 이유로 지웠다
 *     · 오르막 카드의 「완만한 오르막은 무릎 부담이 적다」「내리막은 무릎 부담이 커진다」(둘 다 확인한 자료 없음) → 뺐다. 대체 주장을 만들지 않았다.
 *       「보폭을 줄여 천천히 · 내리막은 속도를 낮춰」는 사이트가 권하는 방법으로만 남겼다(근거를 대지 않는다)
 *     · 「처음부터 빠르게 달리려는 초보가 많다」(통계 없음) → 뺐다
 *     · 손기정·56년·2024 파리까지 유일 → FAQ 1번으로 옮겼다(본문 1절과 겹치지 않게). 글자는 말끝만 「~요」로
 *     · 지운 옛 인용(「고통은 읽어야 하는 신호」) 안내 → ※ 단서 부품 대신 FAQ 2번에만. 본문 2절은 「선수가 한 말이 아니에요」 한 문장
 *     · 선수 발언 인용: blockquote 의 곡선 따옴표(&ldquo;&rdquo;)를 「」로. 인용 글자·출처 줄(매일신문 링크)은 그대로
 *     · 날짜 줄과 출처 머리: 출처가 논문이 아니어서 「연구 7편」 대신 「자료 7건」(ArticleMeta·Sources 에 records 를 더했다. 없으면 「연구」 그대로라 다른 글은 바뀌지 않는다)
 *     · 유튜브: 「한문철 TV」 「JTBC News」 두 건은 채널명의 영문 약어(TV·JTBC)가 풀이 검사에 걸려 뺐다 — 채널명은 고칠 수 없다.
 *       스탐(MBC 재업로드) 한 건은 남겼다. 아래 2026-08-31 메모의 교체 조건은 그대로다
 *     · 2026-10-13 기록 한 줄에서 옛 참고 문헌 부품 이름 앞의 꺾쇠(<)만 「」로 바꿨다 — check-geo 가 주석까지 옛 부품 이름을 찾아 막아서. 뜻은 그대로
 *     · 참고 자료 제목·URL 은 한 글자도 안 바꿨다. 괄호 속 「확인한 것」만 각 항목 첫 줄로 옮겼다
 */
const PAGE_URL = pageUrl("/injury/hwang-young-jo");
const TITLE = "황영조 몬주익 금메달, 초보 러너가 배울 점은?";
// 원장 lib/guide/articles.ts 의 desc 와 같은 문장 (2026-11-23 「저희 제안」 딱지 말을 뺐다)
const DESC =
  "황영조 선수가 몬주익 언덕에서 금메달을 딴 과정은 기사로 확인해 적었어요. 선수 시절의 고통과 훈련량 대신, 초보 러너가 천천히 뛰고 쉬는 날을 두는 법을 담았어요.";

export const metadata: Metadata = {
  title: `${TITLE} — 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/hwang-young-jo" },
};

const FAQ: FaqItem[] = [
  {
    q: "황영조 선수의 금메달이 한국 첫 올림픽 마라톤 금메달인가요?",
    a: "**태극기를 달고는 처음**이에요. 1936년 베를린 올림픽에서 손기정 선수가 일장기를 달고 우승한 지 56년 만이었어요. **2024년 파리 대회까지** 한국 선수의 올림픽 마라톤 금메달은 이것뿐이에요.",
  },
  {
    q: "통증을 신호로 읽는다는 건 황영조 선수가 한 말인가요?",
    a: "아니에요. 예전에 이 페이지에 실렸던 「고통은 읽어야 하는 신호」라는 문장은 출처를 찾지 못해 지웠어요. **통증을 참지 말고 몸이 보내는 신호로 보자**는 건 저희가 권하는 거예요.",
  },
  {
    q: "달리다 아프면 어떻게 하나요?",
    a: "**걸을 때도 아프면 그날은 쉬는 걸** 권해요. 다음 날 아침이 전날보다 더 아프면 거리를 줄여요. 이런 신호가 며칠 이어지면 **진료를 받으세요.**",
  },
];

const linkCls = "text-emerald-700 underline";

export default function HwangYoungJoPage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["황영조", "/injury/hwang-young-jo"],
        ]}
      />
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700">황영조</span>
          {/* 규약은 app/injury/page.tsx 상단 주석 */}
          {/* 비광고 표기 */}
          <span className="text-xs text-gray-400">협찬 없이 작성</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/hwang-young-jo" compact checked={7} records />

        <KeyPoints
          items={[
            <>선수 시절의 고통과 훈련량은 <strong>따라 할 기준이 아니에요.</strong> 걸을 때도 아프면 그날은 쉬어요.</>,
            <>옆 사람과 <strong>이야기할 수 있을 만큼 천천히</strong> 뛰어요. 처음엔 달리는 날 사이에 하루 쉬는 걸 권해요.</>,
            <>오르막에서는 <strong>보폭을 줄이고 천천히</strong> 올라가 보세요.</>,
          ]}
        />

        <Lead>
          몬주익 언덕을 넘던 장면을 보고 참고 달려야 한다고 느꼈다면, 선수 본인의 말부터 들어 볼 만해요. 황영조 선수는 선수
          시절 달리기가 지옥 같을 만큼 고통스러웠다고 돌아봤어요.
        </Lead>

        <TableOfContents
          items={[
            { id: "montjuic", label: "몬주익에서 무슨 일이 있었나요?" },
            { id: "pain", label: "선수의 고통도 따라 해야 하나요?" },
            { id: "pace", label: "얼마나 천천히 뛰나요?" },
            { id: "rest", label: "일주일에 몇 번 뛰나요?" },
            { id: "hill", label: "오르막은 어떻게 뛰나요?" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="montjuic" className={H2}>
          <Num n={1} />1992년 몬주익에서 무슨 일이 있었나요?
        </h2>
        <P>
          황영조 선수는 1992년 8월 9일 바르셀로나 올림픽 마라톤에서 <strong>금메달</strong>을 땄어요. 결승 약 2km 전 몬주익 언덕
          비탈길을 오르며 끝까지 따라붙던 일본의 모리시타 고이치를 떼어냈어요.
        </P>
        <P>당시 그의 나이는 22세였어요. 태극기를 달고 딴 첫 올림픽 마라톤 금메달이에요.</P>

        <OneLine>22세의 황영조 선수는 마지막 몬주익 오르막에서 승부를 냈어요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="pain" className={H2}>
          <Num n={2} />선수 시절의 고통도 따라 해야 하나요?
        </h2>
        <P>
          <strong>따라 할 이유는 없어요.</strong> 황영조 선수는 2024년 강연에서 선수 시절을 이렇게 돌아봤어요.
        </P>
        <blockquote className="my-4 border-l-4 border-yellow-300 py-1 pl-5 text-gray-700">
          「나에게 있어서 달리기는 지옥이라고 서술할 수 있을 정도로 고통스러웠고,
          이 고통을 멈추는 일은 운동을 그만두는 일뿐이었다」
        </blockquote>
        <p className="mb-4 text-xs text-gray-400">
          황영조, 매일 탑 리더스 아카데미 강연 · 출처
          <a href="https://www.imaeil.com/page/view/2024102212575542554" target="_blank" rel="noopener noreferrer" className="ml-1 underline hover:text-gray-700">
            매일신문 2024-10-22 ↗
          </a>
        </p>
        <P>
          당시 기사에 따르면 그는 1992년 2월 벳푸·오이타 대회 이후 매주 360km씩 달렸어요. 엘리트 선수가 견딘 고통과 훈련량은
          초보 러너의 기준이 아니에요.
        </P>
        <Steps
          items={[
            { t: "걸을 때도 아프면 그날은 쉬어요." },
            { t: "다음 날 아침이 전날보다 더 아프면 거리를 줄여요." },
            { t: "이런 신호가 며칠 이어지면 진료를 받으세요." },
          ]}
        />
        <P>
          통증을 참지 말고 몸이 보내는 신호로 보자는 건 저희가 권하는 거예요. <strong>황영조 선수가 한 말이 아니에요.</strong>
        </P>

        <OneLine>선수의 고통은 따라 할 기준이 아니에요. 걸을 때도 아프면 그날은 쉬어요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="pace" className={H2}>
          <Num n={3} />초보 러너는 얼마나 천천히 뛰어야 하나요?
        </h2>
        <P>
          <strong>옆 사람과 이야기할 수 있을 만큼 천천히</strong> 뛰는 걸 권해요. 숨이 차면 걸어도 괜찮아요.
        </P>
        <Steps
          items={[
            { t: "말이 단어 단위로 끊기면 걸어요.", d: "숨이 돌아오면 다시 뛰어요." },
            { t: "걷는 속도와 비슷해져도 괜찮아요.", d: "처음엔 속도보다 시간이에요." },
          ]}
        />
        <P>
          걷기와 달리기를 섞어 늘리는 순서는{" "}
          <Link href="/injury/start-running" className={linkCls}>처음 달리기 글</Link>에 있어요.
        </P>

        <OneLine>숨이 찰 만큼이 아니라, 이야기할 수 있을 만큼 천천히 뛰어요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="rest" className={H2}>
          <Num n={4} />일주일에 몇 번 뛰고, 언제 쉬어야 하나요?
        </h2>
        <P>
          처음엔 <strong>주 3회</strong> 달리고, <strong>달리는 날 사이에 하루 쉬는 걸</strong> 권해요.
        </P>
        <Steps
          items={[
            { t: "다음 날 다리가 무겁거나 아프면 쉬는 날을 하루 더 넣어요." },
            { t: "쉬는 날에는 달리지 않길 권해요.", d: "몸이 뻣뻣하면 숨이 차지 않을 만큼 걸어도 돼요." },
          ]}
        />
        <P>
          쉬는 날 무엇을 하면 좋은지는{" "}
          <Link href="/injury/rest-day" className={linkCls}>쉬는 날 글</Link>에 있어요.
        </P>

        <OneLine>처음엔 달리는 날 사이에 하루 쉬고, 다음 날 몸을 보고 쉬는 날을 더해요.</OneLine>

        {/* ── 5 ─────────────────────────────────────────── */}
        <h2 id="hill" className={H2}>
          <Num n={5} />몬주익 같은 오르막은 어떻게 뛰나요?
        </h2>
        <P>
          <strong>오르막은 보폭을 줄여 천천히, 내리막은 속도를 낮춰</strong> 내려오는 걸 권해요. 오르막에서도 옆 사람과 이야기할 수
          있을 만큼이면 충분해요.
        </P>
        <P>
          황영조 선수는 결승 약 2km 전 몬주익 비탈길에서 승부를 냈어요. 그가 언덕 대비 훈련을 따로 했다는 기록은 저희가 찾지
          못했어요.
        </P>

        <OneLine>오르막은 보폭을 줄여 천천히, 내리막은 속도를 낮춰 내려와요.</OneLine>

        <div className="mt-14">
          <YoutubeSection links={[
            // 2026-08-31 검증 완료. 다만 출처 맥락에 문제가 있어 남겨둔다.
            //  · 스탐 은 MBC 방송 영상의 재업로드다. 권리자가 아니라 언제든 내려갈 수 있고
            //    저작권 문제도 있다. MBC 공식 채널 영상을 찾으면 교체할 것.
            // 2026-11-23: 한문철 TV(교통사고·법률 채널, 황영조 게스트 출연)·JTBC News 두 건은 뺐다 — 머리 주석 참고
            { label: "몬주익의 언덕을 극복한 몬주익의 영웅 — 1992 바르셀로나 올림픽 남자 마라톤", channel: "스탐", url: "https://www.youtube.com/watch?v=YuEVcF9Ivi0" },
          ]} />
        </div>

        <FaqSection items={FAQ} />

        <Sources records>
          <Src n={1}>
            <strong>서울신문 (1992)</strong> 22세, 마지막 2km 몬주익 비탈길, 1992년 2월 이후 매주 360km를 확인했어요.
            <Ref><a href="https://www.seoul.co.kr/news/1992/08/11/19920811003001" target="_blank" rel="noopener noreferrer">서울신문 1992-08-11 — 「마라톤 코리아」… 「몬주익신화」창조/월계관을 조국에 바친 황영조 ↗</a></Ref>
          </Src>
          <Src n={2}>
            <strong>서울신문 (1992)</strong> 손기정 이후, 태극기를 달고는 처음이라는 것을 확인했어요.
            <Ref><a href="https://www.seoul.co.kr/news/1992/08/11/19920811002001" target="_blank" rel="noopener noreferrer">서울신문 1992-08-11 — 사설 「마라톤의 빛나는 금자탑」 ↗</a></Ref>
          </Src>
          <Src n={3}>
            <strong>매일신문 (2024)</strong> 선수 시절을 돌아본 본인 발언을 원문 그대로 옮겼어요.
            <Ref><a href="https://www.imaeil.com/page/view/2024102212575542554" target="_blank" rel="noopener noreferrer">매일신문 2024-10-22 — 황영조 강연 기사 ↗</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Olympics.com</strong> 22세에 우승했고 마지막 오르막에서 모리시타를 앞섰다는 기록이에요.
            <Ref><a href="https://olympics.com/it/atleti/young-cho-hwang" target="_blank" rel="noopener noreferrer">Olympics.com — Young-Cho HWANG 선수 기록 ↗</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Wikipedia(보조)</strong> 경기일 1992년 8월 9일과 순위를 확인했어요.
            <Ref><a href="https://en.wikipedia.org/wiki/Athletics_at_the_1992_Summer_Olympics_%E2%80%93_Men%27s_marathon" target="_blank" rel="noopener noreferrer">Wikipedia(보조) — 1992 바르셀로나 올림픽 남자 마라톤 (경기일·순위) ↗</a></Ref>
          </Src>
          <Src n={6}>
            <strong>Wikipedia(보조)</strong> 1996~2024년 남자 마라톤 금메달에 한국 선수가 없어요.
            <Ref><a href="https://en.wikipedia.org/wiki/List_of_Olympic_medalists_in_athletics_(men)" target="_blank" rel="noopener noreferrer">Wikipedia(보조) — 올림픽 육상 메달리스트 목록 (남자, 1996~2024 마라톤) ↗</a></Ref>
          </Src>
          <Src n={7}>
            <strong>Wikipedia(보조)</strong> 여자 마라톤 금메달에도 한국 선수가 없어요.
            <Ref><a href="https://en.wikipedia.org/wiki/List_of_Olympic_medalists_in_athletics_(women)" target="_blank" rel="noopener noreferrer">Wikipedia(보조) — 올림픽 육상 메달리스트 목록 (여자 마라톤) ↗</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">
          선수 관련 사실은 위 기사와 기록으로 확인한 것만 적었어요. 이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면
          전문의와 상담하세요.
        </p>

        <div className="mt-10 rounded-2xl bg-emerald-50 p-6">
          <p className="mb-2 font-medium text-emerald-900">내 발에 맞는 신발 찾기</p>
          <Link href="/shoe-finder" className="inline-block rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
            나에게 맞는 신발 찾기 →
          </Link>
        </div>
      </article>
      </main>
    </>
  );
}
