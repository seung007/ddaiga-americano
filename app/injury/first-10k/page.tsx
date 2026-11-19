import type { Metadata } from "next";
import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, H3, Num, KeyPoints, Steps, OneLine, Sources, Src, Ref } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

/**
 * 첫 10km 대회 — 2026-11-18 확정 틀로 바꿈 (AGENTS.md 「가이드 글 틀」)
 *
 * 주장 판정 — 2026-11-18 에 QxMD(read.qxmd.com/read/<PMID>)로 초록을 직접 열어 대조한 세 편과,
 * 견본 글에서 이미 판정해 둔 세 편(/home/claude/brief/판정요약.md)을 같은 판정으로 썼다.
 *   · 준비 기간 표(12~16주·8~10주·6~8주·4주) · 주 3회 · 한 번만 늘리기 · 출발 10~15초 느리게 ·
 *     대회 2주 전부터의 일정 · 남은 거리 쪼개기 — 전부 근거 없음(사이트가 정한 기준)이라 「권해요·해 보세요」로만 쓴다.
 *     표 위 문장에 「저희가 정한 기준」이라고 드러냈다 — 표는 문장보다 사실처럼 읽힌다
 *   · 기간을 길게 잡아도 덜 다치지 않았다 — 근거 있음(초보 532명 무작위 시험 한 편, Buist 2008) → 「한 무작위 시험에서」
 *   · 긴 날 110% — 근거 있음(성인 러너 5,205명 관찰 한 편, Frandsen 2025) → 「한 대형 연구에서」
 *   · 주간 10% 규칙은 부상을 줄이지 못했다 — 근거 있음(같은 무작위 시험) → 「10% 규칙이 무의미하다」까지 넓히지 않는다
 *   · 정강이·무릎 앞이 많다 — 근거 있음(덴마크 초보 코호트, Nielsen 2014) → 나라와 분모를 밝힌다
 *   · 걷기를 섞어도 완주 시간이 비슷했다 — 근거 있음(아마추어 마라토너 42명, Hottenrott 2016. 완주 시간 p=0.377,
 *     근육 통증·피로 p=0.006). 10km 가 아니라 풀코스 연구라 그 사실을 적는다
 *   · 젤이 필수가 아니다 — 근거 있음(장거리 영양 리뷰, Burke 2019. 「짧은 종목에서는 소량, 입 헹굼 포함」).
 *     초록은 어느 정도를 짧다고 하는지 적지 않았다 → 「1시간 안팎」은 10km 를 6분/km 로 나눈 우리 계산이라고 따로 쓴다
 *   · 후반을 더 빨리 뛰면 좋다 — 10km 에서 확인한 자료를 못 찾았다. 풀코스 319명을 본 한 연구에서 느린 러너일수록
 *     후반 감속이 컸다는 방향까지만 적는다(March 2011. 나이·성별·기록이 각각 독립 예측 변수, p<0.01)
 *
 * 이어받는일 3건 처리 (/home/claude/brief/이어받는일.md 「posture 끝난 뒤」)
 *   · Frandsen 「1.52~2.28배」를 뺐다 — 늘린 정도별 값이 1.64 → 1.52 → 2.28 로 차례로 커지지 않아
 *     범위로 적으면 비례 위험으로 읽힌다. 110% 기준 자체는 맞다. 「초보나 복귀 러너만 모은 연구는 아니에요」를 붙였다
 *   · Nielsen 에 「덴마크 초보 연구에서」를 붙였다. 다만 덴마크는 초록에서 확인한 값이 아니라 저장소가 그 코호트를
 *     그렇게 불러 온 표현이라, 여러 글이 함께 쓰는 lib/guide/stages.ts 에는 보태지 않았다
 *   · 정적 스트레칭과 몸을 데우는 동작의 차이는 이 글에서 덜어내고 준비운동·정리운동 글로 보냈다(상황 문장 링크)
 *
 * 덜어낸 것 — 다른 글이 이미 답을 맡는다
 *   · 걷기-달리기 하는 법 → /injury/training-types#run-walk (완주 여부만 FAQ 한 문항으로 남겼다)
 *   · 주간 계획 짜기 → /injury/beginner-guide · 처음 30분까지 늘리는 순서 → /injury/start-running
 *   · 출발 전 데우기 → /injury/warmup · 대회 뒤 스트레칭 → /injury/cooldown
 *   · 「다음에 읽을 것」 카드 묶음·글 안 질문 상자·공유 단추는 뺐다(확정 틀 글 10편과 같은 모양)
 *   · 서울마라톤·대한육상연맹 링크는 출처 목록에서 내렸다 — 날짜 줄이 「연구 N편 대조」라서 논문 아닌 자료를
 *     섞어 세면 숫자가 어긋난다(cooldown·posture 와 같은 처리). 대회 일정은 /races 링크가 맡는다
 *
 * 2026-10-07 재검증에서 바로잡은 것(그대로 유지): 「8~10주면 완주합니다」 단정 · 「주간 총 거리 10%」 ·
 *   「출발 2km 가 가장 흔한 실패」·「대부분 7~8km 에서 무너진다」·「음의 분할이 완주율에 유리」 같은 출처 없는 일반화.
 */
const PAGE_URL = pageUrl("/injury/first-10k");
const TITLE = "첫 10km 대회, 준비 기간과 페이스는?";
const DESC =
  "지금 뛰는 거리에서 준비 기간을 몇 주 잡을지, 가장 길게 뛰는 날은 어디까지 늘릴지, 대회 당일 출발을 얼마나 천천히 할지 담았습니다.";

export const metadata: Metadata = {
  title: "첫 10km 대회, 준비 기간과 페이스는? — 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/first-10k" },
};

const FAQ: FaqItem[] = [
  {
    q: "10km를 걷지 않고 끝까지 뛰어야 완주인가요?",
    a: "아니에요. **5분 뛰고 1분 걷기를 반복해도** 10km는 10km예요. 풀코스 시험에서 걷기를 섞은 사람들과 계속 달린 사람들의 완주 시간에 뚜렷한 차이가 없었어요. 풀코스 결과라 10km에 그대로 옮긴 건 아니에요.",
  },
  {
    q: "첫 10km 대회에서 목표 시간을 정해도 되나요?",
    a: "정해도 되지만 **첫 대회는 완주를 목표로** 잡길 권해요. 기록은 두 번째 대회부터 봐도 늦지 않아요. 저희가 정한 기준이고, 비교한 자료는 찾지 못했어요.",
  },
  {
    q: "7~8km에서 너무 힘들면 어떻게 하나요?",
    a: "남은 거리를 **1km씩 쪼개 다음 표지판까지만** 생각해 보세요. 숨이 너무 차면 1분 걷기를 섞어도 돼요. **걸을 때도 아프면** 그날은 멈추길 권해요.",
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
          ["첫 10km", "/injury/first-10k"],
        ]}
      />
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Link
            href="/injury#stage-to10k"
            className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800"
          >
            2단계 · 30분 → 10km
          </Link>
          {/* 규약은 app/injury/page.tsx 상단 주석 */}
          <span className="text-xs text-gray-400">협찬 없이 작성</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/first-10k" compact checked={6} />

        <KeyPoints
          items={[
            <>지금 <strong>쉬지 않고 뛸 수 있는 거리</strong>에서 시작해요. 처음부터 다시 할 필요는 없어요.</>,
            <>가장 길게 뛰는 날은 <strong>지난 한 달에 가장 길게 뛴 거리보다 10%쯤만</strong> 더 뛰어요.</>,
            <>첫 대회는 기록보다 완주예요. 출발 2km는 <strong>목표보다 조금 느리게</strong> 가 보세요.</>,
          ]}
        />

        <Lead>
          첫 대회를 신청해 두고 무엇부터 할지 막막하다면, 지금 뛸 수 있는 거리에서 시작하면 돼요. 준비 기간을 길게 잡는다고
          덜 다치지는 않았어요.
        </Lead>

        <TableOfContents
          items={[
            { id: "how-long", label: "몇 주 준비하면 되나요?" },
            { id: "long-day", label: "긴 날은 얼마나 늘려도 되나요?" },
            { id: "race-week", label: "대회 2주 전부터 당일까지" },
            { id: "gear", label: "준비물은 뭘 챙기나요?" },
            { id: "pace", label: "출발은 얼마나 천천히 뛰나요?" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="how-long" className={H2}>
          <Num n={1} />10km 대회, 몇 주 준비하면 되나요?
        </h2>
        <P>
          <strong>지금 쉬지 않고 뛸 수 있는 거리에서 시작해요.</strong> 처음부터 다시 쌓지 않아도 돼요. 아래 기간은 저희가
          정한 기준이에요. 기간을 정한 연구는 찾지 못했어요.
        </P>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-base">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="break-keep py-2 pr-4 font-semibold text-gray-900">지금 쉬지 않고</th>
                <th className="break-keep py-2 pr-4 font-semibold text-gray-900">준비 기간</th>
                <th className="break-keep py-2 font-semibold text-gray-900">첫 목표</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-gray-100">
                <td className="break-keep py-2 pr-4">거의 못 뜀</td>
                <td className="break-keep py-2 pr-4">12~16주</td>
                <td className="break-keep py-2">걷기를 섞어 30분 채우기</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="break-keep py-2 pr-4">3km</td>
                <td className="break-keep py-2 pr-4"><strong>8~10주</strong></td>
                <td className="break-keep py-2">완주</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="break-keep py-2 pr-4">5km</td>
                <td className="break-keep py-2 pr-4">6~8주</td>
                <td className="break-keep py-2">완주하고 페이스 유지</td>
              </tr>
              <tr>
                <td className="break-keep py-2 pr-4">7km 이상</td>
                <td className="break-keep py-2 pr-4">4주</td>
                <td className="break-keep py-2">목표 시간 도전</td>
              </tr>
            </tbody>
          </table>
        </div>
        <P>
          기간을 길게 잡는다고 덜 다치지는 않았어요. 초보를 두 쪽으로 나눈 한 시험에서 8주 프로그램과 13주
          프로그램의 부상률이 비슷했어요. 그러니 주차를 맞추기보다 <strong>지금 뛰는 거리에서 조금씩 늘리는 쪽</strong>을
          보세요.
        </P>

        <Steps
          title="일주일은 이렇게 해 보세요"
          items={[
            { t: "주 3회로 나눠 뛰어요.", d: "달리는 날 사이에 하루는 쉬어요." },
            { t: "그중 한 번만 거리를 늘려요.", d: "나머지 두 번은 편한 속도로 30분 안팎 뛰어요." },
            { t: "늘린 다음 날 아프면 그 거리를 한 주 더 유지해요.", d: "진도가 버거우면 늦춰도 돼요." },
          ]}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/injury/beginner-guide" className={chipCls}>주간 계획을 더 자세히 보려면 →</Link>
          <Link href="/injury/start-running" className={chipCls}>아직 30분이 안 된다면 →</Link>
          <Link href="/races" className={chipCls}>접수 중인 대회를 찾는다면 →</Link>
        </div>

        <OneLine>주차를 맞추기보다, 지금 뛸 수 있는 거리에서 조금씩 늘려요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="long-day" className={H2}>
          <Num n={2} />긴 날은 얼마나 늘려도 되나요?
        </h2>
        <P>
          <strong>지난 30일 중 가장 길게 뛴 거리의 110% 안에서</strong> 늘려 보세요. 한 대형 연구에서 그보다 10% 넘게 길게
          뛴 날에 과사용 부상이 늘었어요.
        </P>
        <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-base leading-[1.7] text-emerald-900">
          지난 한 달 가장 길게 뛴 거리가 <strong>5km</strong>였다면, 다음 긴 날은 <strong>5.5km까지</strong>예요.
        </div>
        <P>
          초보나 복귀 러너만 모은 연구는 아니에요. 평균 나이 45.8세인 성인 러너를 따라간 연구라, 많이 늘릴수록 위험이 비례해
          커진다고 읽지는 않아요.
        </P>
        <P>
          일주일 거리를 전주보다 10% 넘게 늘리지 않는 걸 10% 규칙이라고 해요. 한 시험에서는 이 규칙을 지킨 쪽도 부상이
          줄지 않았어요. 110%는 일주일 거리가 아니라 <strong>가장 긴 하루</strong>를 봐요.
        </P>

        <h3 className={H3}>이 단계에서 많이 아픈 곳은 정강이와 무릎 앞이에요</h3>
        <P>
          덴마크 초보 러너를 추적한 연구에서 다친 사람 가운데 정강이와 무릎 앞이 가장 많았어요. 아픈 곳에 따라 멈출 신호와
          대처가 달라요.
        </P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/shin-splints" className={chipCls}>정강이가 아프다면 →</Link>
          <Link href="/injury/knee-pain" className={chipCls}>무릎 앞이 아프다면 →</Link>
          <Link href="/injury/training-types#run-walk" className={chipCls}>중간에 걷기를 섞고 싶다면 →</Link>
        </div>

        <OneLine>긴 날은 지난 한 달에 가장 길게 뛴 거리에서 조금만 늘려요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="race-week" className={H2}>
          <Num n={3} />대회 2주 전부터 당일까지 뭘 하나요?
        </h2>
        <P>
          <strong>가장 긴 거리는 2주 전에 뛰어 두고, 남은 2주는 줄여요.</strong> 날짜별로 권하는 순서예요. 이 일정을 연구로
          확인한 건 아니에요.
        </P>
        <div className="mt-5 space-y-3">
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-1 text-sm font-semibold text-gray-900">2주 전</p>
            <p className="break-keep text-base leading-[1.7] text-gray-700">
              가장 긴 거리를 이때 뛰어 봐요. 8~10km를 한 번 가 보면 당일에 겁이 덜 나요. 신발도 이때 마지막으로 점검해요.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-1 text-sm font-semibold text-gray-900">마지막 1주</p>
            <p className="break-keep text-base leading-[1.7] text-gray-700">
              <strong>거리를 줄여요.</strong> 이 주에 무리해서 얻는 건 없고 잃을 건 있어요. 짧고 가볍게 2~3회만 뛰어요.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-1 text-sm font-semibold text-gray-900">전날</p>
            <p className="break-keep text-base leading-[1.7] text-gray-700">
              준비물을 미리 다 꺼내 놓고 번호표를 옷에 달아 둬요. 평소 안 먹던 음식은 피해요.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-1 text-sm font-semibold text-gray-900">당일 아침</p>
            <p className="break-keep text-base leading-[1.7] text-gray-700">
              출발 2~3시간 전에 평소 먹던 것으로 가볍게 먹어요. 출발 20분 전에는 몸을 데워요.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/injury/warmup" className={chipCls}>출발 전에 무슨 동작을 할지 →</Link>
          <Link href="/injury/cooldown" className={chipCls}>대회가 끝난 뒤 스트레칭은 →</Link>
        </div>

        <OneLine>마지막 주에는 더 뛰는 것보다 줄이는 쪽을 권해요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="gear" className={H2}>
          <Num n={4} />대회 준비물은 뭘 챙기나요?
        </h2>
        <Steps
          title="이것만 챙기면 돼요"
          items={[
            { t: "러닝화는 대회 2주 전에 미리 신고 달려 봐요.", d: "물집이 잡히는지 보려는 거예요." },
            { t: "양말은 면 대신 기능성 러닝 양말로 신어요." },
            { t: "번호표 핀 4개나 번호표 클립을 챙겨요." },
            { t: "페이스를 볼 워치나 앱을 준비해요.", d: "심박수까지 보이면 더 좋아요." },
            {
              t: "에너지 젤은 필수가 아니에요.",
              d: "한 영양 리뷰는 짧은 종목이라면 소량이나 입 헹굼으로도 된다고 봤어요. 얼마나 짧은 경기인지는 적혀 있지 않아, 10km를 1km에 6분으로 나눈 1시간 안팎은 저희 계산이에요.",
            },
          ]}
        />
        <P>
          <strong>새로 산 것은 대회날 처음 쓰지 않는 쪽을 권해요.</strong> 신발도 양말도 젤도 연습 때 한 번은 써 보세요.
        </P>

        <FinderCta
          from="first-10k"
          variant="inline"
          headline="첫 10km, 신발은 정하셨나요? 새 신발은 대회 전에 몇 번 신어 길들이세요."
        />

        <OneLine>대회날 처음 쓰는 물건을 만들지 않는 걸 권해요.</OneLine>

        {/* ── 5 ─────────────────────────────────────────── */}
        <h2 id="pace" className={H2}>
          <Num n={5} />출발은 얼마나 천천히 뛰어야 하나요?
        </h2>
        <P>
          <strong>목표 페이스보다 1km에 10~15초 느리게 출발해 보세요.</strong> 출발 분위기에 휩쓸려 첫 1~2km를 빠르게
          달리기 쉬워요. 아래 출발 구간 값은 저희가 정한 기준이에요.
        </P>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-base">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="break-keep py-2 pr-4 font-semibold text-gray-900">목표 시간</th>
                <th className="break-keep py-2 pr-4 font-semibold text-gray-900">필요 페이스</th>
                <th className="break-keep py-2 font-semibold text-gray-900">출발 2km는</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-gray-100">
                <td className="break-keep py-2 pr-4">70분</td>
                <td className="break-keep py-2 pr-4">7:00 /km</td>
                <td className="break-keep py-2">7:10~7:15</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="break-keep py-2 pr-4"><strong>60분</strong></td>
                <td className="break-keep py-2 pr-4"><strong>6:00 /km</strong></td>
                <td className="break-keep py-2">6:10~6:15</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="break-keep py-2 pr-4">55분</td>
                <td className="break-keep py-2 pr-4">5:30 /km</td>
                <td className="break-keep py-2">5:40~5:45</td>
              </tr>
              <tr>
                <td className="break-keep py-2 pr-4">50분</td>
                <td className="break-keep py-2 pr-4">5:00 /km</td>
                <td className="break-keep py-2">5:10~5:15</td>
              </tr>
            </tbody>
          </table>
        </div>
        <P className="text-sm text-gray-600">
          다른 목표 시간은{" "}
          <Link href="/tools/pace" className="font-medium text-emerald-600 hover:underline">
            페이스 계산기
          </Link>
          에서 구간 통과 시간까지 계산해 볼 수 있어요.
        </P>
        <P>
          5km를 지나 여유가 있으면 속도를 올려요. 이렇게 후반을 더 빨리 뛰는 걸 음의 분할이라고 해요. 10km에서 이 방법이
          더 나았는지 확인한 자료는 찾지 못했어요. 풀코스를 잰 한 연구에서 느린 러너일수록 후반에 더 많이 느려지는 편이었던
          것까지가 저희가 확인한 내용이에요.
        </P>

        <OneLine>출발 2km는 목표 페이스보다 조금 느리게 가는 걸 권해요.</OneLine>

        <div className="mt-14">
          <YoutubeSection links={[
            { label: "10km 대회, 이 영상으로 종결 — 완벽 준비 가이드 #초보러너", channel: "달려라하나", url: "https://www.youtube.com/watch?v=3oS5VzHTW3A" },
            { label: "10km 대회를 준비하는 방법 #초보러너", channel: "달려라하나", url: "https://www.youtube.com/watch?v=nevTzDZhAa4" },
            { label: "초보자~10km 맞춤 Q&A — 페이스·훈련 완전 정리", channel: "션과 함께", url: "https://www.youtube.com/watch?v=B4A61x6T3ao" },
            { label: "10km 1시간 이내 완주! 같이 뛰어요", channel: "힙으뜸", url: "https://www.youtube.com/watch?v=vuxhV314PqE" },
          ]} />

          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Buist et al. (2008)</strong> 대회를 준비하는 초보 532명을 두 쪽으로 나눈 무작위 시험이에요. 8주
            프로그램과 주간 거리를 10%씩 늘린 13주 프로그램의 부상률이 20.3%와 20.8%였어요.
            <Ref>Am J Sports Med 36(1):33-9 · <a href="https://pubmed.ncbi.nlm.nih.gov/17940147/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Frandsen et al. (2025)</strong> 성인 러너 5,205명을 18개월 추적했어요(평균 45.8세). 한 번에 달린 거리가
            지난 30일 최장 거리의 110%를 넘은 날에 과사용 부상이 늘었고, 전주 대비 주간 거리 비율은 관계가 없었어요.
            <Ref>Br J Sports Med 59(17):1203-1210 · <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Nielsen et al. (2014)</strong> 덴마크 초보 러너를 1년 추적한 코호트예요. 다친 초보 254명 중 정강이
            통증이 15%, 무릎 앞 통증이 10%였어요.
            <Ref>PLOS ONE 9(6):e99877 · <a href="https://pubmed.ncbi.nlm.nih.gov/24923269/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Hottenrott et al. (2016)</strong> 아마추어 마라토너 42명이 걷기를 섞거나 계속 달려서 풀코스를
            완주했어요. 완주 시간은 4시간 14분과 4시간 8분으로 차이가 유의하지 않았고(p=0.377), 걷기를 섞은 쪽이 대회 뒤
            근육 통증과 피로를 덜 느꼈어요(p=0.006). 심장에 걸리는 부담은 두 쪽이 비슷했어요.
            <Ref>J Sci Med Sport 19(1):64-8 · <a href="https://pubmed.ncbi.nlm.nih.gov/25467199/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Burke et al. (2019)</strong> 장거리 육상 영양 전략 리뷰예요. 짧은 종목에서는 소량이나 입 헹굼으로도
            된다고 봤고, 시간당 75~90g은 가장 긴 종목에만 뒀어요. 어느 정도를 짧은 종목으로 보는지는 초록에 없어요.
            <Ref>Int J Sport Nutr Exerc Metab 29(2):117-129 · <a href="https://pubmed.ncbi.nlm.nih.gov/30747558/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={6}>
            <strong>March et al. (2011)</strong> 풀코스를 뛴 319명의 전반 32.5km와 후반 9.7km 속도를 비교했어요. 나이가
            많을수록, 여성일수록, 기록이 빠를수록 페이스를 고르게 유지했어요(각각 p&lt;0.01).
            <Ref>J Strength Cond Res 25(2):386-91 · <a href="https://pubmed.ncbi.nlm.nih.gov/20224445/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
