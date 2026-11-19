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
 * 훈련 종류 한눈에 (2026-10-07)
 *
 * 사용자 요청: "쉬다가 다시 달릴 때 어떻게 해야 하는지, 걷고 뛰고 하는 훈련 등 다양한 훈련이 있잖아 —
 * 인터벌 등 그것도 한 페이지로 따로 분류해서 알려주자."
 *
 * 단계 글(start-running … get-faster)이 「언제 무엇이 막히나」라면 이 글은 「도구 상자」다.
 *
 * 2026-10-13 가독성 재설계 — 훈련마다 「무엇인지 → 할 일 → 언제부터 → 근거」로 통일.
 * 2026-11-10 제목·문장 다시 쓰기 — 오픈채팅(21,649건)에서 「인터벌」 23명, 「템포」 18명, 「LSD」 16명이 썼고
 *   「훈련 종류」는 1명이었다. 걱정은 「이 정도면 인터벌인가요」 같은 구분 질문과 「템포런 몇 분」 같은 양 질문이다.
 *
 * 2026-11-18 확정 틀로 바꿈 (AGENTS.md 「가이드 글 틀 — 2026-11-18 확정」, 견본 app/injury/start-running/page.tsx)
 *   · 말투 「~니다」 → 「~요」. 날짜 한 줄 · 3줄 요약 · 번호 붙은 큰 질문 6개 · 절 끝 한 줄 요약 · 글 끝 접힌 「근거와 출처」.
 *     옛 부품 여섯 개(한눈에 상자 · 할 일 상자 · 근거 접힘 상자 · 글 끝 문헌 목록 · 근거 수준 딱지 · 별표 단서)를 걷어냈다.
 *     (옛 부품 이름을 주석에 적으면 check:geo 가 글에 남은 것으로 세므로 풀어서 적는다.)
 *   · 큰 절 13개 → 큰 질문 6개. 훈련 11가지는 그대로 다루고, 묶는 방식만 바꿨다 —
 *     강도 구분 / 언제부터(표) / 평소에 뛰는 날 / 빠르게 뛰는 날 / 쉬었다 다시 / 달리기 말고.
 *     곁가지 세 가지(파틀렉 · 스트라이드와 점프 · 언덕 인터벌)는 FAQ 로 내렸다 — 본문과 FAQ 에 같은 내용을 두지 않는다.
 *   · 다른 글이 거는 #run-walk 는 그대로 유지했다(app/injury/first-10k/page.tsx:217, app/injury/shin-splints/page.tsx:258).
 *     #restart·#easy·#long·#tempo·#interval·#strength·#cross 도 작은 제목 id 로 남겼다. 거는 글은 없지만 북마크가 살아 있을 수 있어서다.
 *   · 한 표에 모았던 「근거」 열(중간·약함·관찰·못 찾음)은 뺐다. 저희의 거친 분류를 표로 보여 주면 딱지와 같은 일을 한다 —
 *     확정 틀에서는 근거의 무게를 문장의 세기가 진다. 「연구를 찾지 못했다」는 말은 해당 훈련 문장과 FAQ 에 그대로 남겼다.
 *
 *   고친 것 — 주장을 초록으로 다시 판정한 결과 (QxMD read.qxmd.com/read/<PMID>, 2026-11-18)
 *   · **「말하기 테스트의 애매한 단계는 환기역치, 말이 안 되는 단계는 호흡보상점」 서술을 옮기지 않았다.**
 *     Bok 2022 초록의 서술 자체는 맞지만, 「편히 말할 수 있으면 환기역치 아래」라는 대응은 15명 실험과 어긋난다(판정: 엇갈림).
 *     견본과 하프 글이 같은 주장을 「강도를 가늠하는 믿을 만한 방법」까지만 적었으므로 같은 판정을 썼다. 생리 용어를 본문에서 뺐다.
 *     (/home/claude/brief/이어받는일.md 5번 — 이 글에 남아 있던 두 곳을 이렇게 처리했다.)
 *   · **Relph 2023 「진도가 경직되면 중도 포기와 관련이 있었다」를 느낌으로 낮췄다.** 통계로 확인한 관련이 아니라
 *     그만둔 사람들의 면담 응답이다 → 「그만둔 사람들은 진도가 너무 빠르다고 느꼈어요」. (이어받는일 2번)
 *   · **Linton 2018 「정해진 프로그램이 첫해 부상이 적었다」에 「한 설문에서 … 경향」을 붙였다.** 한 시점에 한 번 물은
 *     횡단면 설문이고 최종 분석 모형에 이 변수가 없다. 단정하지 않는다. (이어받는일 4번)
 *   · **Frandsen 2025 의 「1.52~2.28배」를 뺐다.** 늘린 정도별 값이 차례로 커지지 않아(1.64 → 1.52 → 2.28) 범위로 적으면
 *     「많이 늘릴수록 비례해서 위험」으로 읽힌다. 「10% 넘게 길게 뛴 날에 부상이 늘었다」까지만 적고,
 *     초보나 복귀 러너만 모은 연구가 아니라는 단서를 본문 단서와 출처에 뒀다. (이어받는일 6번)
 *   · **Hottenrott 2016 의 완주 시간 「4:14:25 대 4:07:40」을 뺐다.** 초록에 없는 값이다(초록은 「유의한 차이 없음」까지).
 *     42명·근육 통증·피로·심장 부담 지표는 초록에서 확인했다.
 *   · **Milanović 2015 의 「인터벌이 평균 1.2 mL/kg/min 더」를 뺐다.** 초록에서 확인하지 못했다. 방향(인터벌 쪽이 더 올랐다)만 남겼다.
 *   · **Muñoz 2014 의 「쉬운 달리기 77%」를 뺐다.** 초록에서 배분 비율을 확인하지 못했다. 30명·10주·5.0%·3.6%·차이 유의하지 않음은 확인했다.
 *   · **Fokkema 2020 의 「최장 21km 초과 그룹 평균 1:51:31」을 뺐다.** 본문 표 값이고 초록에 없다.
 *     초록으로 확인되는 것은 하프 556명·풀코스 441명, 하프 최장 21km 초과가 더 빠른 완주, 풀코스 최장 25km 미만이 더 느린 완주,
 *     훈련량과 부상의 관련 없음까지다. (하프 글이 열지 못했던 값 중 441명·25km 는 이번에 초록에서 확인됐다 — 중앙값은 여전히 본문 표에만 있다.)
 *   · Reed & Pipe 2014 를 출처에 더했다. 말하기 테스트를 단정하는 근거가 이 글에는 Bok 하나뿐이었다(견본·하프 글은 둘을 같이 쓴다).
 *   · 한 연구에 기댄 문장에 「한 설문에서」「한 시험에서」「한 메타분석에서」를 붙였다. 단정으로 둔 것은 말하기 테스트 하나다.
 *   · 세트·거리·주 횟수 예시(1분 달리고 2분 걷기, 400m 여섯에서 여덟 번, 15~25분, 네다섯 번씩 세 세트 등)는 전부 저희가 정한 값이다 —
 *     그 조합을 시험한 연구는 찾지 못했다고 단서에 적었다. 연구에서 온 숫자는 접힌 출처에만 뒀다.
 *
 *   확인 못 한 것 (2026-11-18) — 비워 두지 않고 적어 둔다
 *   · 권·호·쪽은 스물두 편 모두 다시 확인하지 못했다. QxMD 는 초록만 보여 주고 권·호·쪽을 띄우지 않는다
 *     (Balsalobre-Fernández 2016 만 30(8):2361-2368 로 보였고 저장소 값과 같았다).
 *     저장소가 2026-10-07 에 대조해 둔 값을 그대로 뒀다 — 새로 지어낸 값이 아니다.
 *   · Fokkema 2020 본문 표 1·2(준비량 중앙값, 구간별 완주 시간). 이 글에서는 쓰지 않는다.
 *     같은 중앙값이 lib/guide/stages.ts:152·155 에 남아 있다 — 본 세션이 hyun 님께 물을 항목이라 손대지 않았다.
 */

const PAGE_URL = pageUrl("/injury/training-types");
const TITLE = "인터벌과 템포런, 뭐가 다르고 언제부터 하나요?";
const DESC =
  "쉬었다 다시 달릴 때부터 인터벌과 템포런까지, 훈련마다 무엇이고 어떻게 하는지, 연구로 확인된 것과 언제부터 하면 되는지 담았습니다.";

export const metadata: Metadata = {
  title: `${TITLE} | 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/training-types" },
};

/**
 * 훈련 11가지와 시작 시점 — 「언제부터」의 단계는 러닝 가이드의 1~5단계이고 저희가 정한 기준이다(표 아래 단서).
 * 2026-11-18: 「무엇」 열을 뺐다 — 각 절 첫 문장과 같은 말이라 390px 에서 표가 두 배로 높아지기만 했다.
 */
type Row = { name: string; stage: string };
const OVERVIEW: Row[] = [
  { name: "쉬었다 다시 달리기", stage: "모든 단계" },
  { name: "걷기-달리기", stage: "1단계와 풀코스" },
  { name: "쉬운 달리기", stage: "모든 단계" },
  { name: "장거리", stage: "2단계부터" },
  { name: "템포런", stage: "3단계부터" },
  { name: "인터벌", stage: "3단계부터" },
  { name: "언덕 인터벌", stage: "4단계부터" },
  { name: "스트라이드와 점프", stage: "3단계부터" },
  { name: "파틀렉", stage: "2단계부터" },
  { name: "크로스 트레이닝", stage: "못 뛰는 동안" },
  { name: "근력운동", stage: "모든 단계" },
];

// 2026-11-18: FAQ 는 본문 큰 질문과 겹치지 않는 것만 둔다. 세 문항 모두 본문에서 내려온 곁가지다.
// 전문어는 문항마다 다시 풀이한다 — 답 하나만 따로 인용되기 때문이다(check:geo 가 본다)

const FAQ: FaqItem[] = [
  {
    q: "파틀렉은 효과가 있나요?",
    a: "파틀렉은 정해진 거리 없이 느낌대로 빠르게, 느리게를 섞어 달리는 훈련이에요. 파틀렉만 따로 시험한 연구는 찾지 못했어요. 쉬운 달리기 중에 **가로등 두세 개 거리를 빠르게** 달리고, 숨이 돌아올 때까지 천천히 달려 보세요.",
  },
  {
    q: "스트라이드와 점프는 꼭 해야 하나요?",
    a: "꼭 할 필요는 없어요. 스트라이드는 쉬운 달리기 끝에 짧게, 빠르지만 편하게 달리는 거예요. 스트라이드만 따로 시험한 연구는 찾지 못했어요. 하고 싶으면 쉬운 달리기 끝에 **80~100m를 4~6번** 넣고, 점프는 근력운동 날에 묶어 보세요.",
  },
  {
    q: "언덕 인터벌은 꼭 해야 하나요?",
    a: "꼭 할 필요는 없어요. 언덕 인터벌(오르막을 빠르게 오르고 걸어 내려오기를 반복)은 **평지 인터벌이 익숙해진 다음에** 넣어 보세요. 잘 훈련된 러너의 5km 기록이 6주 뒤 평균 2.0% 줄었다는 작은 연구가 있어요. **내려올 때는 걸어** 보세요.",
  },
];

const linkCls = "text-emerald-700 underline";

export default function TrainingTypesPage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} datePublished="2026-10-07" />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["훈련 종류", "/injury/training-types"],
        ]}
      />
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">훈련 방법 · 모든 단계</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/training-types" compact checked={22} />

        <KeyPoints
          items={[
            <>대부분의 날은 <strong>옆 사람과 이야기할 수 있을 만큼</strong> 천천히 뛰어요.</>,
            <>빠르게 뛰는 날은 <strong>주 한 번부터</strong> 늘려 보세요. 거리와 속도를 같은 주에 같이 올리지 않기를 권해요.</>,
            <>쉬었다 돌아올 때는 쉰 기간이 길수록 더 짧게 시작해요. <strong>쉬기 전 기록은 기준이 아니에요.</strong></>,
          ]}
        />

        <Lead>
          빠르게 뛰고 나서 이게 어떤 훈련이었는지 헷갈린다면, 말해 보면 알 수 있어요. 숨이 얼마나 찼는지가 아니라 말이 나오는지가
          기준이에요.
        </Lead>

        <TableOfContents
          items={[
            { id: "intensity", label: "강도 나누기" },
            { id: "overview", label: "어떤 훈련을 언제부터" },
            { id: "easy", label: "평소에 뛰는 날" },
            { id: "tempo", label: "빠르게 뛰는 날" },
            { id: "restart", label: "쉬었다 다시" },
            { id: "strength", label: "달리기 말고" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="intensity" className={H2}>
          <Num n={1} />이 정도면 인터벌인가요, 템포런인가요?
        </h2>
        <P>
          <strong>달리는 중에 한 문장을 소리 내어 말해 보세요.</strong> 인터벌은 말이 거의 안 나올 만큼 빠르게 뛰고 쉬기를
          반복하는 훈련이에요. 템포런은 말이 끊기기 시작하는 속도로 이어서 뛰는 훈련이에요.
        </P>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-lg bg-emerald-50 p-3">
            <p className="font-bold text-emerald-800">쉬움</p>
            <p className="mt-1 break-keep text-xs text-emerald-900">문장이 편하게 나와요</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-3">
            <p className="font-bold text-amber-800">템포런</p>
            <p className="mt-1 break-keep text-xs text-amber-900">말이 끊기기 시작해요</p>
          </div>
          <div className="rounded-lg bg-red-50 p-3">
            <p className="font-bold text-red-800">인터벌</p>
            <p className="mt-1 break-keep text-xs text-red-900">말이 거의 안 나와요</p>
          </div>
        </div>
        <P>
          이걸 말하기 테스트라고 해요. 강도를 가늠하는 믿을 만한 방법이어서 <strong>심박계는 없어도 돼요.</strong>
        </P>
        <P>
          심박계가 있으면 심박으로 정한 구간을 보세요. 한 시험에서 대회 기록으로 정한 구간보다 목표 강도에 더 오래 머물렀어요.
        </P>
        <Caveat>
          그 시험은 실험실 검사로 구간을 정했어요. 시계가 추정한 최대 심박으로 정한 구간은 이보다 부정확할 수 있어요.
        </Caveat>

        <OneLine>시계가 없어도 괜찮아요. 말이 끊기는지로 강도를 나눠요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="overview" className={H2}>
          <Num n={2} />어떤 훈련을 언제부터 하면 되나요?
        </h2>
        <P>
          <strong>지금 하는 훈련에 하나만 더하세요.</strong> 아래는 저희가 정한 훈련 11가지의 시작 시점이에요.
        </P>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-base">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="p-2.5">훈련</th>
                <th className="whitespace-nowrap p-2.5">언제부터</th>
              </tr>
            </thead>
            <tbody>
              {OVERVIEW.map((r) => (
                <tr key={r.name} className="border-t border-gray-100">
                  <td className="break-keep p-2.5 font-medium text-gray-900">{r.name}</td>
                  <td className="whitespace-nowrap p-2.5 text-gray-600">{r.stage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Caveat>
          「언제부터」의 단계는{" "}
          <Link href="/injury#stages" className="underline">러닝 가이드의 1~5단계</Link>이고 저희가 정한 기준이에요. 이 순서를
          시험한 연구는 찾지 못했어요.
        </Caveat>
        <Steps
          items={[
            { t: "새 훈련은 한 번에 하나만 넣어요.", d: "거리를 늘리는 주에는 빠른 훈련을 새로 넣지 않아요." },
            { t: "대화가 되는 속도로 30분을 꾸준히 뛸 수 있을 때 빠른 훈련을 넣기를 권해요.", d: "익숙해진 다음에 주 두 번으로 늘려요." },
          ]}
        />
        <P>
          한 주를 짜는 예시는 단계마다 달라요. 막 시작하는 중이라면{" "}
          <Link href="/injury/start-running" className={linkCls}>1단계 글</Link>, 10km라면{" "}
          <Link href="/injury/first-10k" className={linkCls}>2단계 글</Link>, 하프라면{" "}
          <Link href="/injury/half-marathon-training" className={linkCls}>3단계 글</Link>을 보세요.
        </P>

        <OneLine>지금 하는 것에 하나만 더해요. 한꺼번에 바꾸지 않아요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="easy" className={H2}>
          <Num n={3} />평소에 뛰는 날은 어떻게 뛰나요?
        </h2>
        <P>
          <strong>대화가 되는 속도로 뛰어요.</strong> 쉬운 달리기가 한 주의 대부분을 차지해요. 느리다고 느껴질 만큼 천천히 뛰어도
          괜찮아요.
        </P>
        <P>
          쉬운 날과 빠른 날의 비율을 공식으로 맞추지 않아도 돼요. 여러 시험의 참가자 자료를 모아 본 분석에서 배분 방식에 따른
          기록 차이가 없었어요.
        </P>
        <Steps
          items={[
            { t: "주 2~3회부터 시작해 보세요.", d: "달리는 날 사이에 하루를 비워요." },
            { t: "속도를 올리고 싶으면 빠른 훈련을 따로 넣어요.", d: "쉬운 날을 빠르게 만들지 않아요." },
          ]}
        />

        <h3 id="long" className={`${H3} scroll-mt-20`}>가장 길게 뛰는 날은 주에 한 번, 지난 한 달 가장 길게 뛴 거리의 110%까지</h3>
        <P>
          장거리 달리기(LSD)는 주에 한 번 쉬운 속도로 가장 길게 뛰는 날이에요.{" "}
          <strong>지난 30일 중 가장 길게 뛴 거리의 110% 안에서</strong> 늘리기를 권해요. 성인 러너를 18개월 따라간 한 대형
          연구에서 그보다 10% 넘게 길게 뛴 날에 부상이 늘었어요.
        </P>
        <P>
          <strong>4주마다 한 번은 짧게 줄이는 주를 넣어</strong> 보세요. 길게 준비한 사람이 더 빨리 완주했어요. 하프와 풀코스
          참가자에게 준비량을 물은 한 연구에서 하프는 가장 긴 달리기가 21km를 넘은 쪽이 더 빨랐고, 풀코스는 25km 미만인 쪽이 더
          느렸어요.
        </P>
        <Caveat>
          줄이는 주는 저희가 정한 주기예요. 준비량을 물은 쪽은 관찰 연구라서 더 길게 뛰면 빨라진다는 뜻은 아니에요. 같은 연구에서
          훈련량과 부상의 관련은 나타나지 않았어요. 110% 기준이 나온 연구는 초보나 복귀 러너만 모은 연구가 아니에요.
        </Caveat>

        <OneLine>평소에는 이야기가 되는 속도로, 긴 날은 지난 한 달 가장 길게 뛴 거리에서 조금만 늘려요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="tempo" className={H2}>
          <Num n={4} />템포런과 인터벌은 어떻게 뛰나요?
        </h2>
        <P>
          <strong>둘 다 주 한 번부터 넣어 보세요.</strong> 템포런은 끊지 않고 이어서 뛰고, 인터벌은 끊어서 반복해요. 앞뒤로
          10분씩 쉬운 달리기를 붙여요.
        </P>

        <h3 className={H3}>템포런은 말이 끊기기 시작하는 속도로 15~25분</h3>
        <P>
          한 번에 15~25분을 이어서 뛰거나, 8분씩 세 번으로 나누고 사이에 2분씩 조깅해 보세요. 취미 러너 2,303명에게 훈련 내용을
          물은 한 설문에서 템포런은 짧은 거리 기록과의 관련이 더 컸어요.
        </P>

        <h3 id="interval" className={`${H3} scroll-mt-20`}>인터벌은 빠르게 뛰고 쉬기를 번갈아 반복</h3>
        <P>
          말이 거의 안 나오는 강도로 뛰고, 사이에는 조깅이나 걷기로 숨을 돌려요. 아래 셋 중 하나를 골라 보세요.
        </P>
        <Steps
          items={[
            { t: "400m를 여섯 번에서 여덟 번.", d: "사이에 200m를 조깅해요." },
            { t: "1km를 네 번에서 다섯 번.", d: "사이에 2~3분 조깅해요." },
            { t: "30초 전력으로 네 번에서 여섯 번.", d: "사이에 2~4분 걸어요. 짧고 강한 방식이에요." },
          ]}
        />
        <P>
          인터벌과 같은 속도로 이어 달리기를 비교한 여러 연구를 모은 한 분석에서 둘 다 심장과 폐가 산소를 쓰는 능력을 크게 올렸고, 평균으로는
          인터벌 쪽이 더 올랐어요.
        </P>
        <Caveat>
          두 분석 모두 러너만 모은 연구가 아니에요(건강한 성인 등). 거리와 횟수 예시는 저희가 정한 것이고, 그 조합을 시험한
          연구는 찾지 못했어요.
        </Caveat>

        <OneLine>이어서 뛰면 템포런, 끊어서 반복하면 인터벌이에요. 둘 다 주 한 번부터 해 보세요.</OneLine>

        {/* ── 5 ─────────────────────────────────────────── */}
        <h2 id="restart" className={H2}>
          <Num n={5} />쉬었다 다시 달릴 때는 얼마나 줄여야 하나요?
        </h2>
        <P>
          <strong>쉬기 전 기록이 아니라 지금 뛸 수 있는 거리에서 시작해요.</strong> 지난 30일 가장 길게 뛴 거리의 110%라는 기준을 그대로
          쓰면, 쉬는 동안 그 거리가 줄어 있어서 자연스럽게 짧게 시작하게 돼요.
        </P>
        <P>
          <strong>4주 넘게 쉬면 최근에 달리기를 시작한 사람은 얻은 것을 거의 다 잃어요.</strong> 오래 훈련한 사람은 크게 떨어져도
          운동하지 않는 사람보다 높게 남는다고 한 고찰이 정리했어요.
        </P>
        <Steps
          items={[
            { t: "1~2주 쉬었으면 평소 거리의 절반쯤으로 돌아와요." },
            { t: "3~4주 쉬었으면 20~30분 쉬운 달리기를 주 3회부터 해 보세요." },
            { t: "한두 달 넘게 쉬었으면 걷기와 달리기를 섞는 단계부터 다시 시작하기를 권해요." },
          ]}
        />
        <Caveat>이 세 가지는 저희가 정한 기준이고, 쉰 기간별 복귀량을 시험한 연구는 찾지 못했어요.</Caveat>
        <P>
          아파서 쉬었다면 돌아오는 방법이 달라요. 부상 뒤에 다시 시작하는 중이라면{" "}
          <Link href="/injury/return-to-running" className={linkCls}>부상 후 복귀 글</Link>을 먼저 보세요.
        </P>

        <h3 id="run-walk" className={`${H3} scroll-mt-20`}>걷기를 섞어도 완주 시간은 비슷했어요</h3>
        <P>
          걷기-달리기는 달리기와 걷기를 번갈아 하는 방법이에요. 아마추어 마라토너 42명을 두 쪽으로 나눈 한 시험에서 걷기를 섞은
          쪽과 계속 달린 쪽의 완주 시간에 유의한 차이가 없었고, 걷기를 섞은 쪽이 대회 뒤 근육 통증과 피로를 덜 느꼈어요.
        </P>
        <Steps
          items={[
            { t: "1분 달리고 2분 걷기를 여덟 번 반복하는 식으로 시작해 보세요." },
            { t: "달리는 동안 대화가 되고 다음 날 아프지 않으면 달리는 시간을 늘려요." },
            { t: "풀코스에서는 급수대마다 1분 걷기처럼 미리 정해 두고 써요." },
          ]}
        />
        <P>
          처음 시작하는 단계라면{" "}
          <Link href="/injury/start-running#progression" className={linkCls}>처음 달리기 글의 진도표</Link>를 따라가 보세요. 한
          설문에서 정해진 순서가 있는 프로그램을 따른 입문자가 스스로 계획을 짠 쪽보다 첫해 부상이 적은 경향이 있었어요. 다만
          그만둔 사람들은 진도가 너무 빠르다고 느꼈어요.
        </P>
        <Caveat>
          설문과 면담 응답이고, 정해진 진도와 몸에 맞춘 진도를 직접 비교한 연구는 찾지 못했어요.
        </Caveat>

        <OneLine>쉰 기간이 길수록 더 짧게 시작해요. 쉬기 전 기록은 기준이 아니에요.</OneLine>

        {/* ── 6 ─────────────────────────────────────────── */}
        <h2 id="strength" className={H2}>
          <Num n={6} />달리기 말고 뭘 더 하면 되나요?
        </h2>
        <P>
          <strong>무거운 하체 근력운동을 주 한두 번 넣어 보세요.</strong> 중장거리 러너 연구를 모은 여러 연구를 모은 한 분석에서 무거운 무게로
          한 쪽이 기록에 중간 크기 효과를 보였어요.
        </P>
        <P>
          부상을 줄이는지는 달리기에서 뚜렷하지 않아요. 여러 종목의 연구를 모은 한 분석에서는 근력운동을 한 쪽의 부상이 3분의 1
          수준이었지만, 첫 풀코스를 준비하는 러너에게 짧은 프로그램을 준 한 시험에서는 차이가 없었어요.
        </P>
        <Steps
          items={[
            { t: "주 1~2회 해요.", d: "달리기가 가벼운 날에 붙여요." },
            { t: "스쿼트, 데드리프트, 한 발 런지, 카프 레이즈 중 두세 가지를 골라요." },
            { t: "무거운 무게로 네다섯 번씩 세 세트 해요.", d: "처음엔 가벼운 무게로 동작부터 익혀요." },
          ]}
        />
        <Caveat>
          기록 효과의 근거 확실성은 매우 낮음에서 중간으로 평가됐어요. 종목과 횟수 예시는 저희가 정한 것이에요.
        </Caveat>

        <h3 id="cross" className={`${H3} scroll-mt-20`}>못 뛰는 동안은 자전거나 물속 달리기로 버텨요</h3>
        <P>
          크로스 트레이닝은 자전거나 물속 달리기로 달리기를 대신하는 거예요. <strong>아픈 곳에 통증이 없는 운동을</strong>
          고르세요. 훈련된 사람을 6주 따라간 두 연구에서 약 3.2km 달리기 기록과 유산소 능력이 유지됐어요.
        </P>

        <OneLine>무거운 하체 운동을 주 한두 번 넣어요. 못 뛰는 동안은 자전거나 물속 달리기로 버텨요.</OneLine>

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Reed &amp; Pipe (2014)</strong> 말하기 테스트는 타당하고 믿을 만한 강도 기준이에요.
            <Ref>Curr Opin Cardiol 29(5):475-80 · <a href="https://pubmed.ncbi.nlm.nih.gov/25010379/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Bok et al. (2022)</strong> 몸의 느낌으로 강도를 나누는 방법들을 검토한 고찰이에요.
            <Ref>Sports Med 52(9):2085-2109 · <a href="https://pubmed.ncbi.nlm.nih.gov/35507232/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Ranieri et al. (2026)</strong> 45분 저강도 달리기에서 목표 구간에 머문 시간이 심박으로 정했을 때 85%, 대회 기록으로 정했을 때 69%였어요(취미 러너 37명 교차 시험). 고강도 구간에서는 41%와 27%로 둘 다 낮았어요.
            <Ref>Int J Sports Physiol Perform 21(8):902-909 · <a href="https://pubmed.ncbi.nlm.nih.gov/41875873/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Rosenblat et al. (2025)</strong> 13편의 참가자 자료 348명을 모은 메타분석이에요. 강도 배분 방식에 따른 기록 차이가 없었어요.
            <Ref>Sports Med 55(3):655-673 · <a href="https://pubmed.ncbi.nlm.nih.gov/39888556/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Muñoz et al. (2014)</strong> 취미 러너 30명을 10주 나눈 시험이에요. 10km 기록이 양극화 배분에서 5.0%, 역치 사이 배분에서 3.6% 줄었고 두 쪽의 차이는 유의하지 않았어요.
            <Ref>Int J Sports Physiol Perform 9(2):265-72 · <a href="https://pubmed.ncbi.nlm.nih.gov/23752040/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={6}>
            <strong>Frandsen et al. (2025)</strong> 한 번 달린 거리가 지난 30일 최장 거리보다 10% 넘게 길면 부상이 늘었어요(성인 러너 5,205명, 평균 45.8세 — 초보나 복귀 러너만 모은 연구가 아니에요).
            <Ref>Br J Sports Med 59(17):1203-1210 · <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={7}>
            <strong>Fokkema et al. (2020)</strong> 하프 참가자 556명과 풀코스 참가자 441명 설문이에요. 하프는 가장 긴 달리기 21km 초과가 더 빠른 완주와, 풀코스는 25km 미만이 더 느린 완주와 관련 있었고, 훈련량과 부상의 관련은 나타나지 않았어요.
            <Ref>Scand J Med Sci Sports 30(9):1692-1704 · <a href="https://pubmed.ncbi.nlm.nih.gov/32421886/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={8}>
            <strong>Vickers &amp; Vertosick (2016)</strong> 취미 러너 2,303명 설문이에요. 템포런은 짧은 거리에서 속도와의 관련이 더 컸고, 주간 거리와 인터벌은 모든 거리에서 비슷했어요.
            <Ref>BMC Sports Sci Med Rehabil 8(1):26 · <a href="https://pubmed.ncbi.nlm.nih.gov/27570626/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={9}>
            <strong>Milanović et al. (2015)</strong> 건강한 성인 723명, 28편을 모은 메타분석이에요. 인터벌과 지속 훈련 모두 최대산소섭취량을 크게 올렸고 인터벌 쪽이 더 올랐어요.
            <Ref>Sports Med 45(10):1469-81 · <a href="https://pubmed.ncbi.nlm.nih.gov/26243014/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={10}>
            <strong>Gist et al. (2014)</strong> 30초 전력을 반복하는 방식을 모은 무작위 시험 16편(318명) 메타분석이에요. 최대산소섭취량이 약 8% 올랐고, 중강도 지속 훈련과 차이가 없었어요.
            <Ref>Sports Med 44(2):269-79 · <a href="https://pubmed.ncbi.nlm.nih.gov/24129784/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={11}>
            <strong>Coyle et al. (1984)</strong> 지구력 훈련을 오래 한 7명이 훈련을 중단한 뒤 최대산소섭취량이 21일에 7%, 56일에 16% 낮아졌고 84일 뒤에도 운동하지 않는 사람보다 높았어요.
            <Ref>J Appl Physiol 57(6):1857-64 · <a href="https://pubmed.ncbi.nlm.nih.gov/6511559/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={12}>
            <strong>Mujika &amp; Padilla (2000)</strong> 4주 넘게 쉬면 최근에 훈련을 시작한 사람은 얻은 것을 거의 다 잃고, 선수는 크게 떨어져도 훈련하지 않는 사람보다 높게 남는다고 정리한 고찰이에요. 강도를 유지하고 빈도만 조금 줄이면 손실을 줄일 수 있다고 봤어요.
            <Ref>Sports Med 30(3):145-54 · <a href="https://pubmed.ncbi.nlm.nih.gov/10999420/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={13}>
            <strong>Hottenrott et al. (2016)</strong> 아마추어 마라토너 42명을 걷기를 섞는 쪽과 계속 달리는 쪽으로 나눈 시험이에요. 완주 시간에 유의한 차이가 없었고, 걷기를 섞은 쪽이 근육 통증과 피로를 덜 느꼈어요. 심장 부담 지표는 두 쪽이 같았어요.
            <Ref>J Sci Med Sport 19(1):64-8 · <a href="https://pubmed.ncbi.nlm.nih.gov/25467199/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={14}>
            <strong>Linton &amp; Valentin (2018)</strong> 영국 파크런 러너 1,145명 설문이에요. 정해진 순서가 있는 프로그램을 따른 입문자가 스스로 계획을 짠 쪽보다 첫해 부상이 적은 경향이 있었어요. 한 시점에 한 번 물은 설문이라 원인과 결과를 가릴 수 없어요.
            <Ref>J Sci Med Sport 21(12):1221-1225 · <a href="https://pubmed.ncbi.nlm.nih.gov/29853263/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={15}>
            <strong>Relph et al. (2023)</strong> 9주 걷기-달리기 프로그램 110명 중 끝까지 마친 사람은 27.3%였고, 그만둔 사람들은 진도가 너무 빠르다고 느꼈다고 답했어요. 통계로 확인한 관련이 아니라 면담 응답이에요.
            <Ref>Int J Environ Res Public Health 20(17):6682 · <a href="https://pubmed.ncbi.nlm.nih.gov/37681822/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={16}>
            <strong>Barnes et al. (2013)</strong> 잘 훈련된 러너 20명이 강도가 다른 다섯 가지 오르막 인터벌로 6주 훈련했어요. 5km 기록이 평균 2.0% 줄었고, 가장 높은 강도에서 같은 속도로 달릴 때 쓰는 산소가 2.4% 줄었어요.
            <Ref>Int J Sports Physiol Perform 8(6):639-47 · <a href="https://pubmed.ncbi.nlm.nih.gov/23538293/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={17}>
            <strong>Balsalobre-Fernández et al. (2016)</strong> 최상위 중장거리 러너 93명, 5편을 모은 메타분석이에요. 하체 근력운동에 점프(한 번에 최대 200회)와 짧은 질주(5~10회)를 섞어 주 2~3회, 8~12주 한 프로그램이 같은 속도로 달릴 때 쓰는 산소를 크게 줄였어요.
            <Ref>J Strength Cond Res 30(8):2361-8 · <a href="https://pubmed.ncbi.nlm.nih.gov/26694507/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={18}>
            <strong>Llanos-Lagos et al. (2024)</strong> 중장거리 러너의 근력운동 방법을 비교한 메타분석이에요. 무거운 무게로 한 쪽이 기록에 중간 크기 효과를, 여러 방법을 섞은 쪽이 큰 효과를 보였고, 점프만 한 쪽은 유의한 효과가 없었어요. 근거 확실성은 매우 낮음에서 중간이었어요.
            <Ref>Sports Med 54(7):1801-1833 · <a href="https://pubmed.ncbi.nlm.nih.gov/38627351/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={19}>
            <strong>Lauersen et al. (2014)</strong> 여러 종목의 무작위 시험 25편(26,610명)을 모은 메타분석이에요. 근력운동을 한 쪽의 부상이 3분의 1 수준이었어요(상대위험 0.315, 0.207~0.480). 달리기만 모은 분석은 아니에요.
            <Ref>Br J Sports Med 48(11):871-7 · <a href="https://pubmed.ncbi.nlm.nih.gov/24100287/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={20}>
            <strong>Toresdahl et al. (2020)</strong> 첫 풀코스 러너 720명에게 12주 동안 주 3회 10분짜리 근력 프로그램을 준 무작위 시험이에요. 부상으로 완주하지 못한 비율이 7.1%와 7.3%였어요(상대위험 0.97, 0.57~1.63).
            <Ref>Sports Health 12(1):74-79 · <a href="https://pubmed.ncbi.nlm.nih.gov/31642726/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={21}>
            <strong>Eyestone et al. (1993)</strong> 훈련된 32명을 물속 달리기, 자전거, 달리기로 나눠 6주 훈련한 시험이에요. 세 쪽 모두 최대산소섭취량이 조금 줄었고 약 3.2km(2마일) 달리기 기록은 그대로였어요.
            <Ref>Am J Sports Med 21(1):41-4 · <a href="https://pubmed.ncbi.nlm.nih.gov/8427367/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={22}>
            <strong>Wilber et al. (1996)</strong> 훈련된 러너 16명을 트레드밀 달리기와 물속 달리기로 나눠 6주 본 연구예요. 두 쪽 모두 유산소 능력과 같은 속도의 산소 소비가 유지됐어요.
            <Ref>Med Sci Sports Exerc 28(8):1056-62 · <a href="https://pubmed.ncbi.nlm.nih.gov/8871917/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
