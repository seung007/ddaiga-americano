import type { Metadata } from "next";
import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, H3, Num, KeyPoints, Steps, OneLine, Caveat, Sources, Src, Ref } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

/**
 * 초보 러너 — 주 횟수와 거리 늘리기 (2025-03-01 첫 작성)
 *
 * 2026-10-08 재검증 — 슬개대퇴 원인 「약한 대퇴사두근·계단」 삭제(군 훈련병 결과였다), 신스플린트 원인은 메타분석 위험 요인으로,
 *   치료는 「권할 만큼 검증된 것 없음」으로, 「초심자 필수 루틴」에서 「필수」 삭제.
 * 2026-10-13 가독성 재설계 — 절마다 답 먼저, 숫자와 인용은 접힌 상자로.
 *
 * 2026-11-18 확정 틀로 바꿈 (AGENTS.md 「가이드 글 틀 — 2026-11-18 확정」, 견본 app/injury/start-running/page.tsx)
 *   · 말투 「~니다」 → 「~요」. 날짜 한 줄 · 3줄 요약 · 번호 붙은 큰 질문 5개 · 절 끝 한 줄 요약 · 글 끝 접힌 「근거와 출처」.
 *     옛 부품 다섯 개(한눈에 요약 상자 · 근거 접힘 상자 · 근거 수준 딱지 · 별표 단서 줄 · 글 끝 문헌 목록)를 걷어냈다.
 *     (옛 부품 이름을 주석에 적으면 check:geo 가 글에 남은 것으로 세므로 풀어서 적는다.)
 *   · 큰 절 5개 → 번호 붙은 큰 질문 5개: 주 횟수 / 거리 늘리기 / 아픈 곳 / 전후 루틴 / 신발.
 *     id(week·distance·injuries·routine)는 그대로 두고 신발 절에 shoes 를 더했다. 다른 글이 거는 #id 는 없다(grep 확인).
 *
 *   견본(처음 달리기)과 겹쳐서 이 글에서 덜어낸 것 — 같은 말을 두 글에 두지 않는다
 *   · 걷기-달리기로 30분까지 늘리는 순서, 말하기 테스트 설명, 그날 멈출 신호 목록 → 상황 문장으로 견본에 링크.
 *   · 달리기 전 5분·후 5분 동작 목록 → 러닝 전 스트레칭 글과 러닝 후 스트레칭 글에 이미 같은 순서가 있다. 상황 문장으로 링크.
 *   · 물집·발톱, 주간 거리 30% 증가, 초보의 범위는 곁가지라 FAQ 로 내렸다.
 *
 *   고친 것 — 주장을 초록으로 다시 판정한 결과 (QxMD read.qxmd.com/read/<PMID> · Europe PMC, 2026-11-18)
 *   · **Frandsen 2025 의 「1.52~2.28배」를 뺐다.** 늘린 정도별 값이 차례로 커지지 않아(1.64 → 1.52 → 2.28) 범위로 적으면
 *     「많이 늘릴수록 비례해서 위험」으로 읽힌다. 「10% 넘게 길게 뛴 날에 부상이 늘었다」까지만 적고,
 *     초보나 복귀 러너만 모은 연구가 아니라는 단서를 붙였다. 같은 범위가 있던 lib/guide/stages.ts:110 도 함께 고쳤다.
 *     (/home/claude/brief/이어받는일.md 6번)
 *   · **초보의 범위(규칙적 러닝 1년 미만 · 주 0~3회 · 주 5~20km)를 본문에서 뺐다.** Honert 2020 초록에 이 숫자가 없다 —
 *     본문 Table 3 값이다(QxMD 로 초록 확인: 전문가 24명 델파이, 세 수준의 정의를 합의했다는 서술까지만 있다).
 *     FAQ 는 숫자 대신 「지금 넘으려는 거리로 본다」로 답한다. 같은 숫자가 아직 남은 곳: app/injury/intermediate-guide/page.tsx:97·365,
 *     app/injury/advanced-guide/page.tsx:99, lib/guide/stages.ts:284·303(여러 글이 함께 쓰는 데이터). 다음 차례에서 같이 볼 일이다.
 *   · **van Gent 2007 을 뺐다.** 쓰고 있던 두 주장 중 「하지 부상 19.4~79.3%」는 이 글에서 할 일로 이어지지 않고,
 *     「경력과 부상의 관계는 연구마다 갈린다」는 초록에서 확인하지 못했다(초록은 발생률·무릎이 가장 흔한 부위·과거 부상까지다).
 *   · **신스플린트 위험 요인 목록(체질량지수·주상골 하강·가동 범위, Hamstra-Wright 2015)을 뺐다.** 초록으로 확인은 됐지만
 *     초보가 당장 할 일로 이어지지 않는다 — 정강이 글(app/injury/shin-splints/page.tsx:188·298)에 같은 인용이 그대로 있다.
 *   · **달리기 전후 동작 목록과 Behm & Chaouachi 2011 을 뺐다.** 같은 목록이 러닝 전·후 스트레칭 글에 있어 겹친다.
 *   · 한 연구에 기댄 문장의 세기를 낮췄다 — 「초보가 더 자주 다쳐요」 → 「더 자주 다치는 편이에요」(한 메타분석 약 2배),
 *     10% 규칙과 주간 30% 증가는 「한 무작위 시험에서」「한 연구에서」를 문장에 넣었다.
 *   · 주 3회·요일 배치·긴 날 하나는 전부 저희가 정한 기준이다 — 표 아래 단서와 문장 안에 드러냈다.
 *
 *   확인한 초록 (2026-11-18, 직접 열어서 대조)
 *   · van Mechelen 1993 — 남성 취미 러너 421명 16주 무작위 시험, 1,000시간당 5.5건 대 4.9건, 부상 감소 없음. 지식은 늘었다
 *   · Neal 2019 — 18편 4,818명. 나이·키·체중·체질량지수·체지방·Q각은 위험 요인이 아니었고, 대퇴사두근 약화는 군 훈련병에서만
 *   · van der Heijden 2016 — 31편 1,690명, 근거의 질은 매우 낮지만 통증 감소는 일관. 엉덩이 운동을 더하면 더 줄었다
 *   · Winters 2013 — 11편. 편향이 적어 권할 수 있는 치료는 없다
 *   · Nielsen 2014 JOSPT — 초보 874명 1년, 202명 부상. 전체 부상률 차이 없음, 거리 관련 부상만 HR 1.59(0.96~2.66, P=.07).
 *     저자들은 2주 사이 30% 미만으로 늘릴 것을 권했다. Europe PMC 에서 PMID 25155475 · 44(10):739-747 확인
 *
 *   확인 못 한 것 — 비워 두지 않고 적어 둔다
 *   · 권·호·쪽: Neal 2019 · van der Heijden 2016 · van Mechelen 1993 은 QxMD 가 학술지 이름까지만 보여 준다.
 *     저장소에 값이 없던 셋은 학술지 이름만 적었다(각각 Br J Sports Med · Eur J Phys Rehabil Med · Am J Sports Med, 2026-11-18 확인).
 *     Hamstra-Wright 2015 와 Winters 2013 의 권·호·쪽은 정강이 글에 있던 값을 그대로 옮겼다 — 새로 지어낸 값이 아니다.
 *   · Honert 2020 본문 Table 3(세 수준의 경력·빈도·주간 거리). 초록에 없어 이 글에서는 쓰지 않는다
 */

const PAGE_URL = pageUrl("/injury/beginner-guide");
// 2026-11-10 제목: 오픈채팅 21,649건에서 「초보」 28명·「런린이」 10명·「초보 러너」 6명·「뛰는 법」 1명,
// 걱정은 「주 몇 번·매일 뛰어도」 15명, 「거리·마일리지 늘리기」 9~10명. 「처음 6개월」은 본문이 근거 없다고 뺀 말이라 제목에서도 뺐다.
const TITLE = "초보 러너, 일주일에 몇 번 얼마나 뛰나요?";
const DESC =
  "일주일에 몇 번 뛰고 거리는 얼마나 늘려도 되는지, 초보가 자주 아픈 곳은 어떻게 할지 다룹니다. 흔한 주간 거리 규칙보다 근거 있는 기준도 봅니다.";

export const metadata: Metadata = {
  // 네이버 실측(2026-08): "초보 러너 뛰는법" 노출 73 · CTR 1.4%.
  // 사용자는 '뛰는 법'을 찾는데 제목은 '부상 예방'을 내놓아 의도가 어긋났다.
  title: `${TITLE} | 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/beginner-guide" },
};

/** 요일 배치는 저희가 정한 예시다 — 특정 배치를 시험한 연구는 찾지 못했다(표 아래 단서) */
const WEEK: [string, string, string][] = [
  ["월", "휴식", "완전 휴식이나 가벼운 걷기"],
  ["화", "달리기 20~30분", "이야기할 수 있는 속도"],
  ["수", "휴식이나 걷기", "빠르게 걷기 30분까지"],
  ["목", "달리기 20~30분", "화요일과 같은 속도"],
  ["금", "휴식", "완전 휴식"],
  ["토", "달리기 30~40분", "이번 주에 가장 긴 날"],
  ["일", "휴식이나 가벼운 걷기", "회복"],
];

// 2026-11-18: FAQ 는 본문 큰 질문과 겹치지 않는 것만 둔다. 세 문항 모두 본문에서 내려온 곁가지다.
// 전문어는 문항마다 다시 풀이한다 — 답 하나만 따로 인용되기 때문이다(check:geo 가 본다)
const FAQ: FaqItem[] = [
  {
    q: "초보 러너는 어디까지가 초보인가요?",
    a: "공인된 분류는 없어요. 저희는 **지금 넘으려는 거리**로 봐요. 30분을 쉬지 않고 못 뛰면 처음 달리기 글, 30분은 뛰고 10km를 바라보면 이 글, 10km를 넘겨 더 늘리는 중이면 거리 늘리기 글이 맞아요.",
  },
  {
    q: "주간 거리를 30% 넘게 늘리면 위험한가요?",
    a: "위험하다고 확인되지는 않았어요. 초보를 1년 따라간 연구에서 전체 부상률 차이를 찾지 못했어요. 다만 차이가 없다고 증명된 건 아니라서, **2주 사이에 30% 넘게 늘리지 않길** 권해요.",
  },
  {
    q: "물집이 잡히고 발톱이 까맣게 변해요.",
    a: "초보에게 흔해요. **신발이 작지 않은지, 양말이 미끄러지지 않는지, 발톱이 길지 않은지**부터 보길 권해요. 얼마나 흔한지 정확한 비율은 확인된 자료를 찾지 못했어요.",
  },
];

const pill = "rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400";

export default function BeginnerGuidePage() {
  return (
    <>
      {/**
        * 2026-09-21: headline 이 폐기된 옛 제목이었다. <title>·h1 은 2026-08 에
        * 「초보 러너 뛰는 법」으로 바꿨는데 구조화 데이터만 안 따라왔다 —
        * 구글에 보내는 제목과 사람이 보는 제목이 한 달 넘게 달랐다.
        *
        * description 의 「10% 규칙」도 뺐다. 이 페이지 본문이 *"10%라는 숫자를
        * 뒷받침하는 연구는 없습니다"* 라고 적고 있는데 요약이 그걸 근거처럼 내보내고 있었다.
        */}
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} datePublished="2025-03-01" />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["초보 러너 뛰는 법", "/injury/beginner-guide"],
        ]}
      />
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Link
            href="/injury#levels"
            className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800"
          >
            1~2단계 · 처음 → 10km
          </Link>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/beginner-guide" compact checked={10} />

        <KeyPoints
          items={[
            <>일주일에 <strong>세 번</strong>, 옆 사람과 이야기할 수 있을 만큼 천천히 뛰는 걸 권해요.</>,
            <>늘릴 때는 <strong>가장 길게 뛰는 날</strong>만 봐요. 지난 한 달에 제일 길게 뛴 거리에서 조금씩 늘려요.</>,
            <>정강이나 무릎 앞이 아프면 <strong>거리부터 줄이고</strong>, 쉬어도 그대로면 진료를 받아 보세요.</>,
          ]}
        />

        <Lead>
          얼마나 자주, 얼마나 더 뛰어도 될지 헷갈린다면 횟수를 먼저 정하고 거리는 가장 긴 날만 보고 늘려 보세요. 초보는 같은 시간을
          달려도 더 자주 다치는 편이에요.
        </Lead>

        <TableOfContents
          items={[
            { id: "week", label: "일주일에 몇 번 뛰나요?" },
            { id: "distance", label: "거리는 얼마나 늘려도 되나요?" },
            { id: "injuries", label: "어디가 자주 아픈가요?" },
            { id: "routine", label: "전후 루틴은 꼭 해야 하나요?" },
            { id: "shoes", label: "신발은 어떻게 고르나요?" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="week" className={H2}>
          <Num n={1} />일주일에 몇 번, 얼마나 뛰면 되나요?
        </h2>
        <P>
          <strong>주 3회, 한 번에 20~30분</strong>부터 해 보세요. 속도는 옆 사람과 이야기할 수 있을 만큼 천천히요. 달리는 날 사이에는
          하루 쉬거나 걷는 걸 권해요.
        </P>
        <P>
          한 주에 긴 날은 하나만 둬요. 나머지 날은 늘리지 말고 그대로 둬요.
        </P>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-base">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="whitespace-nowrap p-2.5">요일</th>
                <th className="p-2.5">할 것</th>
                <th className="p-2.5">속도와 길이</th>
              </tr>
            </thead>
            <tbody>
              {WEEK.map(([day, act, note]) => (
                <tr key={day} className="border-t border-gray-100">
                  <td className="p-2.5 font-medium text-gray-900">{day}</td>
                  <td className="break-keep p-2.5 text-gray-700">{act}</td>
                  <td className="break-keep p-2.5 text-sm text-gray-500">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Caveat>
          주 3회와 한 번에 20~30분, 요일 배치는 저희가 정한 예시예요. 이 횟수와 배치가 덜 다친다는 연구는 찾지 못했어요.
        </Caveat>

        <P>
          30분을 아직 쉬지 않고 못 뛴다면 걷기를 섞어 늘리는 순서가 따로 있어요.
        </P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/start-running" className={pill}>처음 30분까지 늘리는 순서 →</Link>
          <Link href="/tools/run-30" className={pill}>표대로 따라 하기 →</Link>
        </div>

        <OneLine>주 세 번, 이야기가 되는 속도로 뛰고 달린 다음 날은 쉬어요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="distance" className={H2}>
          <Num n={2} />거리는 얼마나 늘려도 되나요?
        </h2>
        <P>
          지난 30일 중 <strong>가장 길게 뛴 거리</strong>를 기준으로 삼으세요. 한 대형 연구에서 그 거리보다 10% 넘게 길게 뛴 날에
          부상이 늘었어요.
        </P>
        <Steps
          title="이렇게 늘려 보세요"
          items={[
            { t: "지난 한 달에 가장 길게 뛴 거리를 적어 둬요." },
            { t: "다음 긴 날은 그 거리의 110%까지만 뛰어요.", d: "5km였다면 다음 긴 날은 5.5km까지예요." },
            { t: "다음 날 아픈 곳이 있으면 긴 날을 그대로 둬요.", d: "다음 날 통증으로 보는 건 저희가 정한 기준이에요." },
          ]}
        />
        <Caveat>
          110% 기준이 나온 연구는 성인 러너를 추적한 것이고, 초보나 복귀 러너만 모은 연구는 아니에요(평균 45.8세).
        </Caveat>

        <h3 id="ten-percent" className={`${H3} scroll-mt-20`}>주간 거리 10% 규칙은 부상을 줄이지 못했어요</h3>
        <P>
          10% 규칙은 일주일 거리를 전주보다 10% 넘게 늘리지 않는 거예요. 한 무작위 시험에서 이 규칙대로 13주에 걸쳐 늘린 쪽과 일반
          8주 프로그램의 부상률은 <strong>20.8%와 20.3%</strong>로 비슷했어요. 그래서 일주일 합계보다 하루에 가장 길게 뛴 거리를
          기준으로 삼았어요.
        </P>

        <OneLine>일주일 합계를 맞추기보다, 하루에 가장 길게 뛴 거리를 보고 조금씩 늘려요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="injuries" className={H2}>
          <Num n={3} />초보는 어디가 자주 아픈가요?
        </h2>
        <P>
          <strong>정강이와 무릎 앞</strong>이 많아요. 덴마크 초보 연구에서 다친 초보 가운데 정강이가 15%, 무릎 앞이 10%였어요.
        </P>

        <h3 id="shin" className={`${H3} scroll-mt-20`}>정강이가 아프면 아프지 않은 거리까지 줄여요</h3>
        <P>
          정강이 안쪽이 아픈 것을 신스플린트라고 해요. <strong>아프지 않은 거리까지 줄였다가</strong> 괜찮아지면 조금씩 다시 늘려
          보세요. 권할 만큼 효과가 확인된 치료는 아직 없어요.
        </P>

        <h3 id="knee" className={`${H3} scroll-mt-20`}>무릎 앞이 아프면 허벅지 앞과 엉덩이 근육 운동을 해 보세요</h3>
        <P>
          무릎 앞이 아픈 것을 슬개대퇴 증후군이라고 해요. 허벅지 앞(대퇴사두근)과 엉덩이 근육 운동으로 통증이 줄었다는 결과는 여러
          연구에서 비슷했어요. 다만 근거의 질은 매우 낮고, 왜 아픈지도 아직 분명하지 않아요.
        </P>
        <P>
          쉬었는데도 나아지는 느낌이 없으면 진료를 받아 보세요. 아픈 곳에 따라 할 일이 달라요.
        </P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/shin-splints" className={pill}>정강이가 아프다면 →</Link>
          <Link href="/injury/knee-pain" className={pill}>무릎 앞이 아프다면 →</Link>
          <Link href="/injury/start-running#pain" className={pill}>그날 멈출 신호가 궁금하다면 →</Link>
        </div>

        <OneLine>아픈 곳이 생기면 거리를 줄이고, 쉬어도 나아지지 않으면 진료를 받아요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="routine" className={H2}>
          <Num n={4} />달리기 전후 루틴은 꼭 해야 하나요?
        </h2>
        <P>
          부상을 막으려고 할 필요는 없어요. 한 무작위 시험에서 워밍업과 쿨다운, 스트레칭을 배워서 따라 한 쪽도 부상이 줄지 않았어요.
          <strong>몸을 풀고 마무리하는 용도</strong>로 가볍게 해 보세요.
        </P>
        <P>
          달리기 전에 어떤 동작을 할지, 끝나고 무엇을 할지는 따로 정리해 뒀어요.
        </P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/warmup" className={pill}>달리기 전 스트레칭 →</Link>
          <Link href="/injury/cooldown" className={pill}>달리기 후 스트레칭 →</Link>
        </div>

        <OneLine>전후 루틴은 부상을 막아 주지 않아요. 몸 푸는 용도로 가볍게 해요.</OneLine>

        {/* ── 5 ─────────────────────────────────────────── */}
        <h2 id="shoes" className={H2}>
          <Num n={5} />첫 신발은 어떻게 고르나요?
        </h2>
        <P>
          <strong>발볼과 발 길이</strong>가 맞는지부터 보세요. 신발 종류를 바꿔서 부상이 줄었다는 결과는 코크런 고찰에서 대부분
          확인되지 않았어요. 그래서 부상을 막아 줄 신발을 찾기보다, 발에 맞아서 오래 신을 수 있는 쪽을 권해요.
        </P>
        <FinderCta
          from="beginner-guide"
          variant="inline"
          headline="발볼과 발 길이로 좁혀 보세요. 부상 예방이 아니라 맞는 신발을 고르는 기준이에요."
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/wide-foot" className={pill}>발볼 재는 법 →</Link>
        </div>

        <OneLine>신발로 부상을 막기는 어려워요. 발볼과 길이가 맞는 걸 골라요.</OneLine>

        <div className="mt-10 flex flex-wrap gap-2">
          <Link href="/injury/first-10k" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            첫 10km 대회 준비 →
          </Link>
          <Link href="/injury/intermediate-guide" className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:border-gray-300">
            10km를 넘겨 거리 늘리기
          </Link>
        </div>

        <YoutubeSection links={[
          { label: "러닝 전 꼭 해야 할 동적 스트레칭 — 초심자 5분 루틴", url: "https://www.youtube.com/watch?v=rEj3vyacaw4" },
          { label: "10km 대회, 이 영상으로 종결 — 완벽 준비 가이드", channel: "달려라하나", url: "https://www.youtube.com/watch?v=3oS5VzHTW3A" },
          { label: "무릎 앞 통증 한방에 해결 — 슬개대퇴통증증후군", channel: "알쓸물치", url: "https://www.youtube.com/watch?v=69TZ8_yYDp4" },
          { label: "5분만에 끝나는 러닝 후 스트레칭", channel: "지니코치", url: "https://www.youtube.com/watch?v=bsWU6ata_tw" },
          { label: "초보러너 10km 준비 Q&A — 페이스·훈련 완전 정리", channel: "션과 함께", url: "https://www.youtube.com/watch?v=B4A61x6T3ao" },
        ]} />

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Videbæk et al. (2015)</strong> 1,000시간당 부상은 초보 17.8건, 취미 러너 7.7건이었어요.
            <Ref>Sports Med 45(7):1017-26 · <a href="https://pubmed.ncbi.nlm.nih.gov/25951917/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Frandsen et al. (2025)</strong> 30일 최장 거리보다 10% 넘게 길게 뛴 날 부상이 늘었어요(5,205명, 평균 45.8세).
            <Ref>Br J Sports Med 59(17):1203-1210 · <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Buist et al. (2008)</strong> 10% 규칙 13주와 일반 8주의 부상률은 20.8% 대 20.3%였어요(초보 532명).
            <Ref>Am J Sports Med 36(1):33-9 · <a href="https://pubmed.ncbi.nlm.nih.gov/17940147/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Nielsen RØ et al. (2014)</strong> 주간 거리를 30% 넘게 늘린 쪽의 전체 부상률 차이는 찾지 못했어요(초보 874명 1년, 거리 관련 부상 HR 1.59, 95% CI 0.96–2.66).
            <Ref>J Orthop Sports Phys Ther 44(10):739-747 · <a href="https://doi.org/10.2519/jospt.2014.5164" target="_blank" rel="noopener noreferrer">DOI</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Nielsen RO et al. (2014)</strong> 다친 초보 254명 중 정강이 15%, 무릎 앞 10%였어요.
            <Ref>PLOS ONE 9(6):e99877 · <a href="https://doi.org/10.1371/journal.pone.0099877" target="_blank" rel="noopener noreferrer">DOI</a></Ref>
          </Src>
          <Src n={6}>
            <strong>Winters et al. (2013)</strong> 정강이 통증에 권할 만큼 편향이 적은 치료는 없었어요(11편).
            <Ref>Sports Med 43(12):1315-33 · <a href="https://pubmed.ncbi.nlm.nih.gov/23979968/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={7}>
            <strong>van der Heijden et al. (2016)</strong> 운동 치료가 무릎 앞 통증을 줄였지만 근거의 질은 매우 낮았어요(31편 1,690명).
            <Ref>Eur J Phys Rehabil Med · <a href="https://pubmed.ncbi.nlm.nih.gov/26158920/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={8}>
            <strong>Neal et al. (2019)</strong> 무릎 앞 통증의 위험 요인 대부분이 확인되지 않았고, 대퇴사두근 약화는 군 훈련병에서만 나왔어요(18편 4,818명).
            <Ref>Br J Sports Med · <a href="https://pubmed.ncbi.nlm.nih.gov/30242107/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={9}>
            <strong>van Mechelen et al. (1993)</strong> 워밍업과 쿨다운, 스트레칭을 배운 쪽도 부상이 줄지 않았어요(남성 취미 러너 421명, 16주).
            <Ref>Am J Sports Med · <a href="https://pubmed.ncbi.nlm.nih.gov/8238713/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={10}>
            <strong>Relph et al. (2022)</strong> 신발 종류를 바꿔 부상이 줄었다는 결과는 대부분 확인되지 않았어요(12편 11,240명).
            <Ref>Cochrane Database Syst Rev · <a href="https://pubmed.ncbi.nlm.nih.gov/35993829/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
