import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import InlineAsk from "@/components/InlineAsk";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ShareButtons from "@/components/ShareButtons";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import { Up, S } from "@/components/guide/Up";
import { Lead, P, H2, H3, Summary, Todo, Evidence, References, Basis, Note } from "@/components/guide/Read";
import type { Metadata } from "next";
import { pageUrl } from "@/lib/site";

/**
 * 2026-10-07 — 2단계(30분 → 10km) 근거로 다시 정리
 *
 * 9/13 판단은 「인용을 넣지 않는다(14/21 오류 이력)」였다. 지금은 대조 절차가 있어서 확인된 것만 넣는다.
 * 고친 단정(근거 없음):
 *   · 「3km를 뛸 수 있다면 8~10주면 완주합니다」 → 경험칙 표기 + 초보 프로그램 기간 비교 연구(Buist 2008)
 *   · 「주간 총 거리 10%」 → 무작위 시험에서 효과 없었음(Buist 2008), 근거 있는 기준은 긴 날 110%(Frandsen 2025)
 *   · 「제일 흔한 실패는 … 출발 2km」 「대부분의 초보가 7~8km에서 무너진다」 「음의 분할이 완주율·기록 모두에 유리」
 *     「고통은 선형으로 증가하지 않는다」 → 출처 없는 일반화라 경험칙으로 낮추거나 뺐다
 *   · 「젤 — 7km 이후」 → 1시간 안팎 경기는 소량이면 충분하다는 리뷰(Burke 2019)
 *   · 「새 신발이 물집의 가장 흔한 원인」 「체형과 발 조건을 넣으면」(엔진 v4 에서 체형 축 제거) → 정정
 *
 * 2026-10-13 가독성 재설계 — 섹션마다 답 → 할 일 → 근거(접힘). 숫자는 <Evidence> 안으로 옮겼고 지우지 않았다.
 *   「경험칙」 → 「저희 제안」 배지. 준비물 목록·페이스 표는 그대로. 참고 자료는 기본 접힘.
 *   「풀코스 연구」(걷뛰기)·「10km에서 확인한 연구 없음」(음의 분할)·「초보만 모은 연구 아님」(110%) 단서는 <Note> 로 본문에.
 */
const PAGE_URL = pageUrl("/injury/first-10k");
const TITLE = "생애 첫 10km 대회 준비물과 페이스 전략";
const DESC = "출발선에 서기 전에 알아야 할 것들. 얼마나 준비하고 어떻게 늘릴지, 준비물과 페이스까지 — 연구로 확인된 것과 저희 제안을 구분해 정리했습니다.";

export const metadata: Metadata = {
  title: "생애 첫 10km 대회 준비물과 페이스 전략 — 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/first-10k" },
};

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
          {/* 2026-09-22: 2,846자 ÷ 600. 규약은 app/injury/page.tsx 상단 주석 */}
          <span className="text-xs text-gray-400">5분 읽기</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        {/* ⚠️ 2026-09-14 — 배지가 "공개 연구 및 의학 자료 기반" 이었다(당시 논문 0건). 페이지 내용에 맞게 고친 문구를 유지한다. */}
        <p className="mt-3 text-xs text-gray-500">
          <span className="text-emerald-600">✓</span> 협찬 없이 작성 — 연구로 확인된 것과 저희 제안을 구분해 적었습니다
        </p>
        <Lead>
          첫 10km 대회의 결승선은 달리기를 오래 즐기게 만드는 경험이 되기도 합니다. 부상이나 완주 실패로 나쁜 기억이 되지 않게,
          얼마나 준비하고 어떻게 뛸지만 추렸습니다.
        </Lead>

        <Summary
          items={[
            <>긴 날은 <strong>지난 30일 중 가장 길게 뛴 거리의 110% 안에서</strong> 늘립니다. 성인 러너를 추적한 한 관찰 연구에서 나온 기준입니다.<Basis kind="rule" /></>,
            <>3km를 뛸 수 있다면 준비 기간은 <strong>8~10주</strong>를 잡는 경우가 많습니다.<Basis kind="rule" /></>,
            <>첫 대회의 목표는 기록이 아니라 <strong>완주</strong>. 기록은 두 번째 대회부터.<Basis kind="rule" /></>,
            <>대회 날에는 <strong>출발 2km를 너무 빨리 뛰지 않는 것</strong>이 핵심입니다.<Basis kind="rule" /></>,
          ]}
        />

        {/* 「10km 준비」「10km 러닝 준비」「10km 대회준비」가 들어오는데 답이 없던 자리 (2026-09-13 추가) */}
        <h2 id="how-long" className={H2}>
          10km 대회, 얼마나 준비해야 하나요
        </h2>
        <P>
          <strong>지금 뛸 수 있는 거리에서 시작합니다.</strong> 0에서 시작하는 게 아닙니다.
        </P>
        {/* ⚠️ 2026-09-14 — 표에 출처가 없다는 지적. 표는 사실처럼 보이기 때문에 고지가 더 필요한 자리다. */}
        <P className="text-sm text-gray-500">
          아래 기간은 연구로 검증된 수치가 아니라 통용되는 기준입니다.<Basis kind="rule" /> 한 무작위 시험에서는 기간을 길게 잡아도
          덜 다치지 않았습니다.
        </P>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-[15px]">
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
                <td className="break-keep py-2">걷뛰기로 30분 채우기</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="break-keep py-2 pr-4">3km</td>
                <td className="break-keep py-2 pr-4"><strong>8~10주</strong></td>
                <td className="break-keep py-2">완주</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="break-keep py-2 pr-4">5km</td>
                <td className="break-keep py-2 pr-4">6~8주</td>
                <td className="break-keep py-2">완주 + 페이스 유지</td>
              </tr>
              <tr>
                <td className="break-keep py-2 pr-4">7km 이상</td>
                <td className="break-keep py-2 pr-4">4주</td>
                <td className="break-keep py-2">목표 시간 도전</td>
              </tr>
            </tbody>
          </table>
        </div>
        <P className="text-sm text-gray-500">
          정확한 주차보다 &ldquo;지금 뛰는 거리에서 조금씩 늘린다&rdquo;가 요점입니다.
        </P>
        <Evidence n={1} label="기간을 길게 잡으면 덜 다칠까?">
          <p>
            6.7km 대회를 준비하는 초보 532명을 일반 8주 프로그램과 13주 프로그램으로 나눈 무작위 시험에서 부상률은 20.3%와 20.8%로
            같았습니다. <S>(Buist et al. (2008) <Up h="https://pubmed.ncbi.nlm.nih.gov/17940147/" />)</S>
          </p>
        </Evidence>

        <Todo
          title="일주일은 이렇게"
          basis="rule"
          items={[
            <><strong>주 3회</strong>가 기준입니다.</>,
            <>그중 <strong>한 번만</strong> 거리를 늘립니다.</>,
            "나머지 두 번은 편한 페이스로 30분 안팎을 뜁니다.",
          ]}
        />

        <h2 id="long-day" className={H2}>
          긴 날은 얼마나 늘려도 될까
        </h2>
        <P>
          기준은 <strong>지난 30일 동안 가장 길게 뛴 거리의 110%</strong>입니다.<Basis kind="rule" /> 성인 러너 5,205명을 18개월
          추적한 한 연구에서, 한 번에 그보다 길게 뛰면 과사용 부상이 더 많았습니다.
        </P>
        <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-[15px] leading-[1.7] text-emerald-900">
          예) 지난 한 달 최장이 <strong>5km</strong>였다면 → 다음 긴 날은 <strong>5.5km까지</strong>.
        </div>
        <P>
          흔히 말하는 &lsquo;주간 10% 규칙&rsquo;은 한 초보 무작위 시험에서 부상을 줄이지 못했습니다. 위 110%는 주간 거리가 아니라
          &lsquo;가장 긴 하루&rsquo; 기준이라 다른 이야기입니다.
        </P>
        <Note>110% 연구는 초보만 모은 연구가 아니라 성인 러너를 따라간 연구입니다.</Note>
        <Evidence n={2}>
          <p>
            성인 러너 5,205명을 18개월 추적한 연구에서 한 번 달린 거리가 지난 30일 최장 거리의 110%보다 길면 과사용 부상 비율이
            1.52~2.28배였고, 전주 대비 주간 거리 비율은 관계가 없었습니다.{" "}
            <S>(Frandsen et al. (2025) <Up h="https://pubmed.ncbi.nlm.nih.gov/40623829/" />)</S>
          </p>
          <p>
            &lsquo;주간 10% 규칙&rsquo;에 맞춘 13주 프로그램도 위 초보 532명 무작위 시험에서 부상을 줄이지 못했습니다.{" "}
            <S>(Buist et al. (2008) <Up h="https://pubmed.ncbi.nlm.nih.gov/17940147/" />)</S>
          </p>
        </Evidence>

        <h3 className={H3}>이 단계에서 많이 아픈 곳</h3>
        <P>
          부상당한 초보 254명을 본 한 연구에서, 부상 가운데 정강이와 무릎 앞이 많았습니다. 위치별로 따로 정리했습니다.
        </P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/shin-splints" className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400">정강이 통증 →</Link>
          <Link href="/injury/knee-pain" className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400">무릎 앞 통증 →</Link>
        </div>
        <Evidence n={1}>
          <p>
            부상당한 초보 254명 중 정강이 통증 15%, 무릎 앞 10%.{" "}
            <S>(Nielsen et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/24923269/" />)</S>
          </p>
        </Evidence>

        <h2 id="run-walk" className={H2}>
          중간에 걸으면 실패인가요
        </h2>
        <P>
          <strong>아닙니다.</strong> 5분 뛰고 1분 걷기를 반복해도 10km는 10km입니다.
        </P>
        <P>
          아마추어 마라토너 시험에서 걷기를 섞은 그룹은 계속 달린 그룹과 완주 시간 차이가 없었고, 근육 통증과 피로를 덜 느꼈습니다.
        </P>
        <Note>10km가 아니라 풀코스 연구입니다.</Note>
        <Evidence n={1}>
          <p>
            아마추어 마라토너 42명 시험에서 걷기를 섞은 그룹은 계속 달린 그룹과 완주 시간 차이가 없었고, 근육 통증과 피로를 덜
            느꼈습니다(풀코스 연구). <S>(Hottenrott et al. (2016) <Up h="https://pubmed.ncbi.nlm.nih.gov/25467199/" />)</S>
          </p>
        </Evidence>
        <P className="text-sm">
          <Link href="/injury/training-types#run-walk" className="text-emerald-700 underline">훈련 종류 — 걷기-달리기 →</Link>
        </P>

        <h2 id="gear" className={H2}>
          대회 준비물, 뭘 챙길까
        </h2>
        {/* 2026-09-13: 「①②③ →」로 한 문단에 뭉쳐 있던 것을 목록으로. 문구는 유지. */}
        <ol className="mt-4 list-inside list-decimal space-y-2 break-keep text-base leading-[1.8] text-gray-800">
          <li><strong>러닝화</strong> — 대회 2주 전에 미리 달려서 물집 없는지 확인</li>
          <li><strong>러닝 양말</strong> — 면 양말 금지, 기능성 러닝 양말</li>
          <li><strong>번호표 핀 4개</strong> 또는 번호표 클립</li>
          <li><strong>워치 또는 페이스 앱</strong> — 심박수까지 보이면 더 좋음</li>
          <li><strong>에너지 젤</strong> — 10km는 대개 1시간 안팎이라 필수는 아닙니다.</li>
        </ol>
        <Evidence n={1} label="젤은 왜 필수가 아닐까">
          <p>
            장거리 육상 영양 리뷰는 짧은 종목에서는 소량(입 헹굼 포함)으로도 충분하다고 봤습니다.{" "}
            <S>(Burke et al. (2019) <Up h="https://pubmed.ncbi.nlm.nih.gov/30747558/" />)</S>
          </p>
        </Evidence>
        <P>
          <strong>새 장비는 절대 대회날 처음 쓰지 않습니다.</strong> 신발도, 양말도, 젤도 연습 때 한 번은 써 보세요.
          <Basis kind="rule" />
        </P>

        <h2 id="pace" className={H2}>
          처음엔 얼마나 천천히 뛰어야 하나요
        </h2>
        <P>
          출발 분위기에 휩쓸려 첫 1~2km를 너무 빠르게 달리기 쉽습니다.{" "}
          <strong>목표 페이스보다 10~15초/km 느리게 출발하세요.</strong>
          <Basis kind="rule" />
        </P>
        <P>5km 이후 여유가 있으면 속도를 높입니다(&lsquo;음의 분할&rsquo;).</P>
        <Note>10km에서 이 전략의 이점을 따로 확인한 연구는 찾지 못했습니다.</Note>
        <Evidence n={1}>
          <p>
            풀코스 연구에서는 느린 러너일수록 후반 감속이 컸습니다.{" "}
            <S>(March et al. (2011) <Up h="https://pubmed.ncbi.nlm.nih.gov/20224445/" />)</S>
          </p>
        </Evidence>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-[15px]">
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
          에서 구간 통과 시간까지 계산할 수 있습니다.
        </P>

        {/* 「10km 대회준비」가 묻는 것 — 당일 전후 */}
        <h2 id="race-week" className={H2}>
          대회 2주 전부터 당일까지
        </h2>
        <P>
          날짜별로 할 일입니다.<Basis kind="rule" />
        </P>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-1 text-sm font-semibold text-gray-900">2주 전</p>
            <p className="break-keep text-[15px] leading-[1.7] text-gray-700">
              가장 긴 거리를 여기서 뜁니다. 8~10km를 한 번 가 보면 당일에 겁이 덜 납니다.
              신발도 이때 마지막으로 점검합니다.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-1 text-sm font-semibold text-gray-900">마지막 1주</p>
            <p className="break-keep text-[15px] leading-[1.7] text-gray-700">
              <strong>거리를 줄입니다.</strong> 이 주에 무리해서 얻는 건 없고 잃을 건 있습니다.
              짧고 가볍게 2~3회만.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-1 text-sm font-semibold text-gray-900">전날</p>
            <p className="break-keep text-[15px] leading-[1.7] text-gray-700">
              준비물을 미리 다 꺼내 놓습니다. 번호표를 옷에 미리 답니다.
              평소 안 먹던 음식은 피합니다.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-1 text-sm font-semibold text-gray-900">당일 아침</p>
            <p className="break-keep text-[15px] leading-[1.7] text-gray-700">
              출발 2~3시간 전에 평소 먹던 것으로 가볍게 먹습니다. 출발 20분 전{" "}
              <Link href="/injury/warmup" className="font-medium text-emerald-600 hover:underline">
                준비운동
              </Link>
              을 합니다 — 이때는 정적 스트레칭이 아니라 몸을 데우는 동작입니다.
            </p>
          </div>
        </div>

        <FinderCta from="first-10k" variant="inline" headline="첫 10km, 신발은 정하셨나요? 새 신발은 대회 전에 몇 번 신어 길들이세요." />

        <h2 id="wall" className={H2}>
          7km쯤에서 너무 힘들어요
        </h2>
        <P>7~8km 구간이 가장 힘들었다는 후기가 많습니다.</P>
        <P>
          남은 거리를 1km 단위로 쪼개 &lsquo;다음 표지판까지만&rsquo;이라고 생각하는 방법을 많이 씁니다.
          <Basis kind="rule" />
        </P>

        {/**
         * 다음에 읽을 것 (2026-09-13 추가)
         *
         * 감사에서 나온 것: 부상 페이지 21개 중 **20개가 서로 링크가 0건**이었다.
         * `from=first-10k` 로 계측되므로 클릭이 나는지 본다.
         */}
        <h2 id="next" className={H2}>
          다음에 읽을 것
        </h2>
        <div className="mt-4 space-y-2">
          <Link
            href="/injury/beginner-guide"
            className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
          >
            <p className="text-sm font-semibold text-gray-900">초보 러너 뛰는 법 — 처음 6개월 안 다치고 달리기 →</p>
            <p className="mt-1 text-sm text-gray-600">준비 기간을 어떻게 짤지 더 자세히.</p>
          </Link>
          <Link
            href="/injury/cooldown"
            className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
          >
            <p className="text-sm font-semibold text-gray-900">달리기 후 10분 정적 스트레칭 →</p>
            <p className="mt-1 text-sm text-gray-600">대회 끝나고 바로 앉지 마세요.</p>
          </Link>
          <Link
            href="/races"
            className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
          >
            <p className="text-sm font-semibold text-gray-900">10km 대회 일정 보기 →</p>
            <p className="mt-1 text-sm text-gray-600">접수 중인 대회를 확인한 날짜와 함께 모았습니다.</p>
          </Link>
        </div>

        <div className="mt-10">
          <YoutubeSection links={[
            { label: "10km 대회, 이 영상으로 종결 — 완벽 준비 가이드 #초보러너", channel: "달려라하나", url: "https://www.youtube.com/watch?v=3oS5VzHTW3A" },
            { label: "10km 대회를 준비하는 방법 #초보러너", channel: "달려라하나", url: "https://www.youtube.com/watch?v=nevTzDZhAa4" },
            { label: "초보자~10km 맞춤 Q&A — 페이스·훈련 완전 정리", channel: "션과 함께", url: "https://www.youtube.com/watch?v=B4A61x6T3ao" },
            { label: "10km 1시간 이내 완주! 같이 뛰어요", channel: "힙으뜸", url: "https://www.youtube.com/watch?v=vuxhV314PqE" },
          ]} />
        </div>

        <FaqSection items={[
          {
            q: "10km 대회는 얼마나 준비해야 하나요?",
            a: "준비 기간을 정한 연구는 찾지 못했습니다. 흔히 3km를 뛸 수 있으면 8~10주, 거의 못 뛰면 12~16주, 5km면 6~8주를 잡습니다(저희 제안). 긴 날은 지난 30일 최장 거리의 110% 안에서 늘리세요(Frandsen 2025). 6.7km 대회 초보 무작위 시험에서 8주와 13주 프로그램의 부상률은 같았습니다(Buist 2008).",
          },
          {
            q: "10km를 걷지 않고 뛰어야 완주인가요?",
            a: "아닙니다. 5분 뛰고 1분 걷기를 반복해도 10km는 10km입니다. 아마추어 마라토너 시험에서 걷기를 섞은 그룹은 완주 시간 차이 없이 근육 통증과 피로를 덜 느꼈습니다(Hottenrott 2016). 첫 대회의 목표는 기록이 아니라 완주입니다.",
          },
          {
            q: "10km를 1시간에 뛰려면 페이스가 어떻게 되나요?",
            a: "1km당 6분입니다. 다만 출발 2km는 6분 10~15초로 조금 느리게 가는 편이 낫습니다. 70분 목표면 7분/km, 55분이면 5분 30초/km, 50분이면 5분/km입니다.",
          },
          {
            q: "대회 일주일 전에는 뭘 해야 하나요?",
            a: "거리를 줄입니다. 마지막 주에 무리해서 얻는 건 없고 잃을 건 있습니다. 짧고 가볍게 2~3회만 뛰세요. 가장 긴 거리는 대회 2주 전에 뛰어 두는 게 좋습니다.",
          },
          {
            q: "첫 10km 대회 준비물은 무엇이 필요한가요?",
            a: "미리 길들인 러닝화(대회 2주 전 미리 신어 물집 확인), 기능성 러닝 양말, 번호표 핀 4개나 클립, 페이스 측정용 워치·앱. 젤은 1시간 안팎 경기라 필수는 아닙니다(Burke 2019). 새 장비는 대회날 처음 쓰지 마세요.",
          },
          {
            q: "첫 대회에서 페이스 전략은 어떻게 잡나요?",
            a: "출발 분위기에 휩쓸려 첫 1~2km를 너무 빠르게 달리기 쉽습니다. 목표 페이스보다 10~15초/km 느리게 출발하고, 5km 이후 여유가 있으면 속도를 올리세요. 10km에서 이 전략의 이점을 따로 확인한 연구는 찾지 못했고, 저희 제안입니다.",
          },
          {
            q: "7~8km에서 너무 힘들 때는 어떻게 하나요?",
            a: "이 구간이 가장 힘들었다는 후기가 많습니다. 남은 거리를 1km 단위로 쪼개 다음 표지판까지만 생각하는 방법을 많이 씁니다. 저희 제안입니다. 숨이 너무 차면 1분 걷기를 섞어도 됩니다.",
          },
        ]} />

        <References
          n={8}
          title="참고 자료"
          note="추천 순서는 광고비로 바뀌지 않습니다. 거리 늘리기·걷뛰기·젤은 위 논문으로 확인했고, 준비 기간 표·출발 페이스·당일 일정·멘탈 관리는 저희 제안입니다."
        >
          <ul>
            <li className="flex gap-2"><span className="text-gray-400">•</span><span><strong>Buist et al. (2008)</strong> — 초보 532명, 8주 대 13주(10% 규칙) 프로그램 부상률. Am J Sports Med 36(1):33-9. <a href="https://pubmed.ncbi.nlm.nih.gov/17940147/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><span><strong>Frandsen et al. (2025)</strong> — 5,205명 18개월, 30일 최장 거리 대비 10% 초과 시 부상 증가. Br J Sports Med 59(17):1203-1210. <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><span><strong>Nielsen et al. (2014)</strong> — 부상당한 초보 254명, 정강이 15%·무릎 앞 10%. PLOS ONE 9(6):e99877. <a href="https://pubmed.ncbi.nlm.nih.gov/24923269/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><span><strong>Hottenrott et al. (2016)</strong> — 아마추어 마라토너 42명, 걷기-달리기 대 계속 달리기. J Sci Med Sport 19(1):64-8. <a href="https://pubmed.ncbi.nlm.nih.gov/25467199/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><span><strong>Burke et al. (2019)</strong> — 장거리 육상 영양 전략 리뷰. Int J Sport Nutr Exerc Metab 29(2):117-129. <a href="https://pubmed.ncbi.nlm.nih.gov/30747558/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><span><strong>March et al. (2011)</strong> — 마라톤 페이스 유지의 결정 요인. J Strength Cond Res 25(2):386-91. <a href="https://pubmed.ncbi.nlm.nih.gov/20224445/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://www.seoul-marathon.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">서울마라톤 공식 사이트 ↗</a></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://www.kaaf.or.kr" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">대한육상연맹 대회 일정 ↗</a></li>
          </ul>
        </References>

        <p className="mb-4 mt-6 text-xs text-gray-400">※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 통증이 지속되면 전문의 상담을 권장합니다.</p>

        {/* 2026-09-06: 글 안에서 바로 묻게 한다. /community 로 보내면 클릭 한 번에서 대부분을 잃는다. */}
        <InlineAsk from="first-10k" tag="기타" placeholder="예) 10km 뛰고 나면 발바닥이 얼얼한데 괜찮은 건가요?" />

        <FinderCta from="first-10k" headline="대회 전에 신발부터 확인하세요" sub="새 신발은 대회 전에 길들이세요. 발볼과 발 조건을 넣으면 맞는 신발을 추려드립니다." />
        {/* 2026-09-14: description 이 "논문 근거와 함께 정리했습니다" 였다 — 논문 0건이다. */}
        <ShareButtons from="first-10k" title="첫 10km 완주 가이드" description="10km를 처음 뛸 때 얼마나 준비하고 어떤 페이스로 가야 하는지 정리했습니다." />

      </article>
    </>
  );
}
