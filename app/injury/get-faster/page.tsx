import type { Metadata } from "next";
import Link from "next/link";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Up, S } from "@/components/guide/Up";
import { Lead, P, H2, H3, Summary, Todo, Evidence, References, Basis, Note } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

/**
 * 5단계 — 완주 → 기록 단축 (2026-10-07)
 *
 * 커뮤니티 질문 800건 중 「X분 가능할까요?」가 8%였다. 이 글은 「어떻게 빨라지나」와 「예측을 얼마나 믿나」를 같이 다룬다.
 *
 * 규칙
 *   · 강도 배분은 공식 하나를 정답처럼 적지 않는다 — 메타분석(Rosenblat 2025)이 전체로는 차이를 못 찾았다.
 *   · Milanović 2015 는 러너가 아니라 건강한 성인 일반이 대상이다. 그렇게 적는다.
 *   · Vickers 2016·Fokkema 2020 은 관찰 연구다. 「~한 사람이 빨랐다」로 적는다.
 *   · 주간 구성 예시는 사이트 예시.
 *
 * 2026-10-13 가독성 재설계 — "글자가 너무 많아서 읽히지가 않는다". 섹션마다 답 → 할 일 → 근거(접힘).
 *   사실·숫자는 지우지 않고 <Evidence> 안으로 옮겼다. 「먼저 결론」 → <Summary>. 참고 문헌은 기본 접힘.
 *   강도 배분이 연구끼리 엇갈리는 지점(선수 수준별·배분 준수자만 본 결과)은 본문 <Note> 로 남겼다.
 *   관찰 연구·경쟁 선수 연구·러너 아닌 대상이라는 단서도 <Note> 로 본문에.
 *   제목의 「막히는 곳」 → 「더 빨라지려면」(쓰지 않는 말 목록). 허브 제목(lib/guide/articles.ts)은 메인 세션에 반영 요청.
 */

const PAGE_URL = pageUrl("/injury/get-faster");
// 2026-11-10 제목: 오픈채팅 21,649건에서 「빨라지」 13명·「페이스 올리」 7명·「기록 단축」 3명·「기록 줄이」 0명,
// 「러닝」 98명 대 「달리기」 22명. 걱정은 「인터벌」 23명(질문자 9)·「서브3·싱글 목표」 31명·「근력」 17명.
const TITLE = "러닝 더 빨라지려면 뭐부터 해야 하나요?";
const DESC =
  "더 많이 뛴 사람이 빨랐고 강도 배분 공식끼리는 차이가 작았습니다. 인터벌과 근력운동, 테이퍼가 얼마나 도움이 됐는지와 기록 예측을 믿어도 될지 다룹니다.";

export const metadata: Metadata = {
  title: "러닝 더 빨라지려면 뭐부터 해야 하나요? | 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/get-faster" },
};

const WEEK: [string, string][] = [
  ["쉬운 달리기", "주 2~3회, 대화가 되는 속도"],
  ["인터벌 또는 템포", "주 1회 (예: 1km × 5, 400m × 8, 20분 템포 중 하나)"],
  ["긴 달리기", "주 1회, 쉬운 속도, 지난 30일 최장의 110% 안"],
  ["하체 근력운동", "주 1~2회, 무거운 무게로 적은 횟수"],
];

const FAQ: FaqItem[] = [
  {
    q: "더 빨라지려면 뭐부터 해야 하나요?",
    a: "관찰 연구에서는 주간 거리가 많은 사람이 하프와 풀 모두 더 빨랐습니다(Fokkema 2020). 레크리에이션 러너 2,303명 연구에서도 주간 거리와 인터벌이 모든 거리의 속도와 비슷한 크기로 관련 있었습니다(Vickers 2016). 다치지 않고 주간 거리를 늘리는 것이 먼저입니다. 그다음이 강도입니다.",
  },
  {
    q: "80:20(양극화) 훈련, 꼭 지켜야 하나요?",
    a: "양극화형과 피라미드형은 전체로 기록 차이가 없었습니다(13개 연구 개별 자료 메타분석, Rosenblat 2025). 두 방식 모두 10km 기록이 좋아졌고(5.0% 대 3.6%) 차이는 유의하지 않았습니다(레크리에이션 러너 30명 10주 연구, Muñoz 2014). 비율보다 '대부분은 쉽게, 일부만 빠르게'를 지키는 게 중요합니다.",
  },
  {
    q: "인터벌이 지속주보다 낫나요?",
    a: "둘 다 최대산소섭취량을 크게 올렸습니다. 인터벌이 평균 1.2 mL/kg/min 더 올렸습니다(건강한 성인 723명, 28개 연구 메타분석, Milanović 2015). 러너만 대상으로 한 연구는 아닙니다.",
  },
  {
    q: "근력운동은 어떻게 하나요?",
    a: "1RM(한 번 들 수 있는 최대 무게)의 80% 이상인 고중량 근력운동이 기록에 중간 크기 효과를 보였습니다. 여러 방법을 섞으면 큰 효과를 보였습니다(중장거리 러너 메타분석). 포함된 연구들은 6~40주, 주 1~4회였습니다. 근거 확실성은 매우 낮음~중간이었습니다(Llanos-Lagos 2024).",
  },
  {
    q: "10km 기록으로 하프와 풀 기록을 예측할 수 있나요?",
    a: "리겔 공식은 하프까지는 잘 맞았습니다. 하지만 풀코스는 러너 절반에게서 실제보다 10분 이상 빠르게 예측했습니다(Vickers 2016). 페이스 계산기의 풀코스 값은 상한으로 보세요.",
  },
];

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
          <span className="text-xs text-gray-400">4분 읽기</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/get-faster" />
        <Lead>
          완주는 했는데 기록이 그대로라면, 빠르게 뛰는 훈련보다 뛰는 양부터 볼 만합니다. 관찰 연구에서는 더 많이 뛴 사람이
          빨랐습니다. 강도 배분 공식끼리는 생각보다 차이가 작았습니다.
        </Lead>

        <Summary
          items={[
            <><strong>더 많이 뛴 사람이 빨랐습니다</strong>(관찰 연구).<Basis kind="paper" /> 다치지 않고 주간 거리를 늘리는 게 먼저입니다.<Basis kind="rule" /></>,
            <>강도는 <strong>대부분 쉽게, 일부만 빠르게</strong> 합니다.<Basis kind="rule" /> 배분 공식끼리는 전체로 차이가 없었습니다.<Basis kind="paper" /></>,
            <>인터벌은 지속주보다 최대산소섭취량을 조금 더 올렸습니다. <strong>무거운 근력운동</strong>은 기록에 중간 크기 효과를 보였습니다.<Basis kind="paper" /></>,
            <>대회 전 <strong>2~3주 테이퍼</strong>를 둡니다. 경쟁 선수 연구와 취미 마라토너 관찰 연구를 합친 저희 정리입니다.<Basis kind="rule" /> 기록 예측 공식은 풀코스에서 러너 절반에게 10분 이상 빠르게 나왔습니다.<Basis kind="paper" /></>,
          ]}
        />

        <TableOfContents
          items={[
            { id: "volume", label: "많이 뛰면 빨라질까" },
            { id: "intensity", label: "얼마나 빠르게 뛸까" },
            { id: "strength", label: "근력운동" },
            { id: "week", label: "일주일 짜기 예시" },
            { id: "race", label: "대회 준비와 기록 예측" },
            { id: "injury", label: "다치지 않으려면" },
          ]}
        />

        {/* ── 주간 거리 ─────────────────────────────────────── */}
        <h2 id="volume" className={H2}>
          많이 뛰면 정말 빨라지나요?
        </h2>
        <P>
          주간 거리가 많은 사람이 더 빨랐습니다(하프와 풀 참가자를 본 연구, 취미 러너 2,303명 설문). 그래서{" "}
          <strong>다치지 않고 주간 거리를 늘리는 것이 먼저</strong>이고, 그다음이 강도입니다.<Basis kind="rule" />
        </P>
        <Note>두 연구 모두 관찰 연구입니다. 원래 빠른 사람이 더 많이 뛰었을 가능성은 남습니다.</Note>
        <Evidence n={2}>
          <p>
            하프는 주 32km 초과·최장 21km 초과, 풀은 주 65km 초과 그룹이 더 빨랐습니다(하프 참가자 556명, 풀 참가자 441명). 그
            훈련량과 부상의 관련은 나타나지 않았습니다.{" "}
            <S>(Fokkema et al. (2020) <Up h="https://pubmed.ncbi.nlm.nih.gov/32421886/" />)</S>
          </p>
          <p>
            주간 거리와 인터벌 훈련은 모든 거리에서 비슷한 크기로 속도와 관련 있었습니다(취미 러너 2,303명 설문). 템포런은 짧은
            거리일수록 관련이 컸습니다. <S>(Vickers &amp; Vertosick (2016) <Up h="https://pubmed.ncbi.nlm.nih.gov/27570626/" />)</S>
          </p>
        </Evidence>

        {/* ── 강도 ─────────────────────────────────────────── */}
        <h2 id="intensity" className={H2}>
          80:20 훈련, 꼭 지켜야 하나요?
        </h2>
        <P>
          비율 공식보다 <strong>쉬운 날은 정말 쉽게, 빠른 날은 주 1회 정도 확실히</strong>가 실천 기준입니다.
          <Basis kind="rule" />
        </P>
        <P>
          양극화형(쉬움 위주 + 고강도)과 피라미드형(쉬움 &gt; 중간 &gt; 고강도)은 전체로 기록 차이가 없었습니다(여러 연구를 모은
          분석).
        </P>
        <Note>
          세부 결과는 연구끼리 엇갈립니다. 최대산소섭취량은 운동할 때 몸이 분당 쓸 수 있는 산소의 최대량으로, 심폐 체력을 보는 값입니다. 이 값만 보면 경쟁 선수는 양극화형, 취미 선수는 피라미드형이 더 나았을 가능성이
          있었습니다. 한 10주 연구에서는 배분을 잘 지킨 사람만 보면 양극화형이 더 좋아졌습니다.
        </Note>
        <Todo
          basis="rule"
          items={[
            <>
              쉬운 날의 기준은 말하기 테스트 →{" "}
              <Link href="/injury/start-running#pace" className="text-emerald-700 underline">처음 달리기 글</Link>
            </>,
          ]}
        />
        <Evidence n={2}>
          <p>
            양극화형(쉬움 위주 + 고강도)과 피라미드형(쉬움 &gt; 중간 &gt; 고강도)은 전체로 최대산소섭취량과 기록 모두 차이가
            없었습니다(13개 연구 348명의 개별 자료를 모은 네트워크 메타분석). 최대산소섭취량만 보면 경쟁 선수는 양극화형, 취미 선수는
            피라미드형에서 더 좋아졌을 가능성이 있었습니다.{" "}
            <S>(Rosenblat et al. (2025) <Up h="https://pubmed.ncbi.nlm.nih.gov/39888556/" />)</S>
          </p>
          <p>
            양극화형(쉬움 77%, 중간 3%, 고강도 20%)과 역치 사이 위주형(46/35/19) 모두 10km 기록이 좋아졌습니다(5.0% 대 3.6%, 취미
            러너 30명 10주). 두 방식의 차이는 유의하지 않았습니다. 배분을 실제로 잘 지킨 사람만 보면 양극화형이 더 좋아졌습니다.{" "}
            <S>(Muñoz et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/23752040/" />)</S>
          </p>
        </Evidence>

        <h3 className={H3}>인터벌이 지속주보다 낫나요?</h3>
        <P>
          둘 다 최대산소섭취량을 크게 올렸습니다. <strong>인터벌이 조금 더</strong> 올렸습니다. 지속주는 쉬지 않고 이어 뛰는
          훈련입니다.
        </P>
        <Note>러너만 모은 연구가 아니라 건강한 성인 일반이 대상입니다.</Note>
        <Evidence n={1}>
          <p>
            둘 다 최대산소섭취량을 크게 올렸습니다(지속주 +4.9, 인터벌 +5.5 mL/kg/min). 인터벌이 평균 1.2 mL/kg/min 더
            올렸습니다(건강한 성인 723명, 28개 연구 메타분석). 러너만 대상으로 한 연구는 아닙니다.{" "}
            <S>(Milanović et al. (2015) <Up h="https://pubmed.ncbi.nlm.nih.gov/26243014/" />)</S>
          </p>
        </Evidence>

        {/* ── 근력 ─────────────────────────────────────────── */}
        <h2 id="strength" className={H2}>
          근력운동하면 기록이 좋아지나요?
        </h2>
        <P>
          <strong>무거운 무게</strong>로 하는 근력운동이 기록에 중간 크기 효과를 보였습니다(중장거리 러너 연구를 모은 분석). 무거운
          무게는 한 번 들 수 있는 최대 무게(1RM)의 80% 이상입니다. 여러 방법을 섞으면 효과가 컸습니다.
        </P>
        <Note>근거 확실성은 매우 낮음~중간입니다.</Note>
        <P>
          부상 예방은 별개입니다. 주 3회 10분 자가 근력 프로그램은 완주를 막은 과사용 부상을 줄이지 못했습니다(첫 풀코스 러너
          720명 대상 한 시험).
        </P>
        <Evidence n={2}>
          <p>
            고중량(1RM 80% 이상)은 기록(타임트라이얼과 탈진까지 시간)에 중간 크기 효과를 보였습니다(중장거리 러너 근력운동
            메타분석). 여러 방법을 섞은 경우는 큰 효과를 보였습니다. 플라이오메트릭(점프 위주 훈련)만 한 경우는 유의하지 않았습니다.
            최대산소섭취량 같은 지표는 거의 바뀌지 않았습니다. 포함 연구는 6~40주, 주 1~4회였습니다. 근거 확실성은 매우
            낮음~중간이었습니다.{" "}
            <S>(Llanos-Lagos et al. (2024) <Up h="https://pubmed.ncbi.nlm.nih.gov/38627351/" />)</S>
          </p>
          <p>
            주 3회 10분 자가 근력 프로그램을 준 시험에서 완주를 막은 과사용 부상은 7.1% 대 7.3%로 줄지 않았습니다(첫 풀코스 러너
            720명).{" "}
            <S>(Toresdahl et al. (2020) <Up h="https://pubmed.ncbi.nlm.nih.gov/31642726/" />)</S>
          </p>
        </Evidence>

        {/* ── 주간 예시 ─────────────────────────────────────── */}
        <h2 id="week" className={H2}>
          일주일은 어떻게 짜나요?
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-base">
            <tbody>
              {WEEK.map(([k, v]) => (
                <tr key={k} className="border-t border-gray-100 first:border-t-0">
                  <td className="whitespace-nowrap p-2.5 font-semibold text-gray-900">{k}</td>
                  <td className="break-keep p-2.5 text-gray-700">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Todo
          basis="rule"
          items={["한 번에 하나만 바꾸세요. 주간 거리를 늘리는 주에는 인터벌을 새로 넣지 않는 식입니다."]}
        />
        <Note>위 표는 저희 예시입니다.</Note>

        {/* ── 대회 ─────────────────────────────────────────── */}
        <h2 id="race" className={H2}>
          대회를 앞두고는 뭘 조심해야 하나요?
        </h2>

        <h3 className={H3}>대회 전엔 훈련을 얼마나 줄이나요?</h3>
        <P>
          <strong>대회 전 2~3주 동안 훈련량을 줄입니다.</strong> 강도와 빈도는 유지합니다. 이렇게 대회 전에 줄이는 것을 테이퍼라고
          합니다.<Basis kind="rule" />
        </P>
        <Note>2주와 41~60%는 경쟁 선수 연구에서 나온 값입니다. 취미 마라토너의 3주 결과는 관찰 연구입니다.</Note>
        <Evidence n={2}>
          <p>
            메타분석에서 나온 값은 2주 동안 훈련량을 41~60% 줄이고 강도와 빈도는 유지하는 것입니다(경쟁 선수 연구 27편).{" "}
            <S>(Bosquet et al. (2007) <Up h="https://pubmed.ncbi.nlm.nih.gov/17762369/" />)</S>
          </p>
          <p>
            3주 동안 꾸준히 줄인 그룹이 최소 테이퍼보다 중앙값 5분 32초 빨랐습니다(취미 마라토너 15만 8천여 명, 관찰).{" "}
            <S>(Smyth &amp; Lawlor (2021) <Up h="https://pubmed.ncbi.nlm.nih.gov/34651125/" />)</S>
          </p>
        </Evidence>

        <h3 className={H3}>기록을 노리면 후반에 더 무너지나요?</h3>
        <P>
          후반 붕괴는 최근 개인 기록 전후 3년에 더 잦았습니다(마라톤 기록 400만 건 넘게 분석). <strong>목표를 높인 대회일수록 전반 페이스를 조심하세요.</strong>
          <Basis kind="rule" />
        </P>
        <Evidence n={1}>
          <p>
            후반 붕괴는 최근 개인 기록 전후 3년에 더 잦았습니다(36% 대 그 이전 23%, 마라톤 기록 400만 건 넘게 분석).{" "}
            <S>(Smyth (2021) <Up h="https://pubmed.ncbi.nlm.nih.gov/34010308/" />)</S>
          </p>
        </Evidence>

        <h3 className={H3}>기록 예측, 믿어도 되나요?</h3>
        <P>
          리겔 공식은 한 거리의 기록으로 다른 거리의 기록을 계산하는 공식입니다. 하프까지는 잘 맞았습니다. 풀코스는{" "}
          <strong>러너 절반에게서 실제보다 10분 이상 빠르게</strong> 예측했습니다(취미 러너 2,303명 연구). 페이스 계산기의 풀코스 값은 상한으로 보세요 →{" "}
          <Link href="/tools/pace#predict-h" className="text-emerald-700 underline">페이스 계산기의 기록 예측</Link>
        </P>
        <Evidence n={1}>
          <p>
            리겔 공식은 하프까지는 잘 맞았습니다. 풀코스는 러너 절반에게서 실제보다 10분 이상 빠르게 예측했습니다. 이전 대회 기록 하나
            또는 둘을 쓴 연구진의 모델이 더 정확했습니다.{" "}
            <S>(Vickers &amp; Vertosick (2016) <Up h="https://pubmed.ncbi.nlm.nih.gov/27570626/" />)</S>
          </p>
        </Evidence>

        <h3 className={H3}>카본화를 신으면 빨라지나요?</h3>
        <P>
          카본 플레이트 신발의 효과는 연구가 시험한 속도에서 확인된 것입니다 →{" "}
          <Link href="/injury/carbon-plate" className="text-emerald-700 underline">카본화 살까 말까</Link>
        </P>

        {/* ── 부상 ─────────────────────────────────────────── */}
        <h2 id="injury" className={H2}>
          빨라지려다 다치지 않으려면 어떻게 하나요?
        </h2>
        <P>
          거리를 늘릴 때의 기준은 같습니다. 한 번 달린 거리가 <strong>지난 30일 중 가장 긴 거리의 110%를 넘으면</strong> 과사용
          부상이 늘었습니다(성인 러너를 추적한 한 연구).
        </P>
        <P>
          경력이 쌓이면 아픈 곳이 바뀝니다. 경력자는 초보보다 부상 가운데 아킬레스건 비중이 높았습니다(네덜란드 러너 4,621명
          조사) →{" "}
          <Link href="/injury/achilles" className="text-emerald-700 underline">아킬레스·종아리 글</Link>
        </P>
        <P>
          아프면{" "}
          <Link href="/injury/return-to-running" className="text-emerald-700 underline">부상 후 복귀 글</Link>의 통증 기준으로
          조절합니다.
        </P>
        <Evidence n={2}>
          <p>
            한 번 달린 거리가 지난 30일 최장 거리보다 10% 넘게 길면 과사용 부상 비율이 1.52~2.28배였습니다.{" "}
            <S>(Frandsen et al. (2025) <Up h="https://pubmed.ncbi.nlm.nih.gov/40623829/" />)</S>
          </p>
          <p>
            아킬레스건 부상 비중은 초보 2.3%, 경력자 8.4%였습니다(네덜란드 러너 4,621명 조사). 두 그룹 모두 무릎(30.5%)과
            종아리·정강이(17.8%)가 가장 많았습니다.{" "}
            <S>(Kemler et al. (2018) <Up h="https://pubmed.ncbi.nlm.nih.gov/30071170/" />)</S>
          </p>
        </Evidence>

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <References n={12} note="2026-10-07 PubMed 초록과 대조했습니다.">
          <ul>
          <li>
            <strong>Fokkema et al. (2020)</strong> — 하프·풀 참가자 훈련량·최장 거리와 기록·부상. Scand J Med Sci Sports 30(9):1692-1704.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/32421886/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Vickers &amp; Vertosick (2016)</strong> — 레크리에이션 러너 2,303명 기록 요인·예측. BMC Sports Sci Med Rehabil 8(1):26.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/27570626/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Rosenblat et al. (2025)</strong> — 강도 배분 개별 자료 네트워크 메타분석. Sports Med 55(3):655-673.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/39888556/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Muñoz et al. (2014)</strong> — 레크리에이션 러너 30명 10주, 양극화 대 역치 사이 위주. Int J Sports Physiol Perform 9(2):265-72.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/23752040/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Milanović et al. (2015)</strong> — 인터벌 대 지속주 최대산소섭취량 메타분석(28편). Sports Med 45(10):1469-81.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/26243014/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Llanos-Lagos et al. (2024)</strong> — 중장거리 러너 근력운동 방법별 메타분석. Sports Med 54(7):1801-1833.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/38627351/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Toresdahl et al. (2020)</strong> — 첫 풀코스 러너 근력 프로그램 무작위 시험. Sports Health 12(1):74-79.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/31642726/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Bosquet et al. (2007)</strong> — 테이퍼 효과 메타분석. Med Sci Sports Exerc 39(8):1358-65.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/17762369/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Smyth &amp; Lawlor (2021)</strong> — 레크리에이션 마라토너 테이퍼 분석. Front Sports Act Living 3:735220.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/34651125/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Smyth (2021)</strong> — 마라톤 후반 페이스 붕괴 대규모 분석. PLOS ONE 16(5):e0251513.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/34010308/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Frandsen et al. (2025)</strong> — 한 번의 긴 달리기와 과사용 부상. Br J Sports Med 59(17):1203-1210.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Kemler et al. (2018)</strong> — 초보·경력 러너 4,621명 4년 부상 비교. Phys Sportsmed 46(4):485-491.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/30071170/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          </ul>
        </References>
      </article>
      </main>
    </>
  );
}
