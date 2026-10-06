import type { Metadata } from "next";
import Link from "next/link";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Up, S } from "@/components/guide/Up";

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
 */

const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/get-faster";
const TITLE = "기록 단축 — 완주 다음에 막히는 곳";
const DESC =
  "더 많이 뛴 사람이 빨랐고, 강도 배분 공식은 생각보다 차이가 작았습니다. 인터벌·근력운동·테이퍼가 실제로 얼마나 효과 있었는지, 기록 예측은 얼마나 믿을 수 있는지 논문 수치로 정리했습니다.";

export const metadata: Metadata = {
  title: "러닝 기록 단축 훈련 — 인터벌·근력·테이퍼, 논문이 확인한 것 | 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/get-faster" },
};

const WEEK: [string, string][] = [
  ["쉬운 달리기", "주 2~3회, 대화가 되는 속도"],
  ["인터벌 또는 템포", "주 1회 (예: 1km × 5 · 400m × 8 · 20분 템포 중 하나)"],
  ["긴 달리기", "주 1회, 쉬운 속도, 지난 30일 최장의 110% 안"],
  ["하체 근력운동", "주 1~2회, 무거운 무게로 적은 횟수"],
];

const FAQ: FaqItem[] = [
  {
    q: "기록을 줄이려면 뭐부터 해야 하나요?",
    a: "관찰 연구에서는 주간 거리가 많은 사람이 하프·풀 모두 더 빨랐고(Fokkema 2020), 레크리에이션 러너 2,303명 연구에서도 주간 거리와 인터벌이 모든 거리의 속도와 비슷한 크기로 관련 있었습니다(Vickers 2016). 다치지 않고 주간 거리를 늘리는 것이 먼저이고, 그다음이 강도입니다.",
  },
  {
    q: "80:20(양극화) 훈련이 정답인가요?",
    a: "13개 연구 개별 자료 메타분석에서 양극화형과 피라미드형은 전체로 기록 차이가 없었습니다(Rosenblat 2025). 레크리에이션 러너 30명 10주 연구에서는 두 방식 모두 10km 기록이 좋아졌고(5.0% 대 3.6%) 차이는 유의하지 않았습니다(Muñoz 2014). 비율보다 '대부분은 쉽게, 일부만 빠르게'를 지키는 게 중요합니다.",
  },
  {
    q: "인터벌이 지속주보다 낫나요?",
    a: "건강한 성인 723명(28개 연구) 메타분석에서 둘 다 최대산소섭취량을 크게 올렸고, 인터벌이 평균 1.2 mL/kg/min 더 올렸습니다(Milanović 2015). 러너만 대상으로 한 연구는 아닙니다.",
  },
  {
    q: "근력운동은 어떻게 하나요?",
    a: "중장거리 러너 메타분석에서 1RM의 80% 이상인 고중량 근력운동이 기록에 중간 크기 효과를, 여러 방법을 섞으면 큰 효과를 보였습니다. 포함된 연구들은 6~40주, 주 1~4회였고 근거 확실성은 매우 낮음~중간이었습니다(Llanos-Lagos 2024).",
  },
  {
    q: "10km 기록으로 하프·풀 기록을 예측할 수 있나요?",
    a: "리겔 공식은 하프까지는 잘 맞았지만 풀코스는 러너 절반에게서 실제보다 10분 이상 빠르게 예측했습니다(Vickers 2016). 페이스 계산기의 풀코스 값은 상한으로 보세요.",
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
      <article className="mx-auto max-w-2xl px-6 py-12 text-gray-800">
        <Link href="/injury" className="mb-6 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Link href="/injury#stage-faster" className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
            5단계 · 완주 → 기록
          </Link>
          <span className="text-xs text-gray-400">7분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight text-gray-900">{TITLE}</h1>

        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">먼저 결론</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-emerald-900">
            <li><strong>더 많이 뛴 사람이 빨랐습니다</strong>(관찰). 다치지 않고 주간 거리를 늘리는 게 첫째.</li>
            <li>강도는 <strong>대부분 쉽게, 일부만 빠르게</strong>. 양극화·피라미드 같은 배분 공식끼리는 전체로 차이가 없었습니다.</li>
            <li>인터벌은 지속주보다 최대산소섭취량을 조금 더 올렸습니다. <strong>무거운 근력운동</strong>은 기록에 중간 크기 효과.</li>
            <li>대회 전 <strong>2~3주 테이퍼</strong>. 기록 예측은 풀코스에서 낙관적입니다.</li>
          </ol>
        </div>

        <TableOfContents
          items={[
            { id: "volume", label: "주간 거리" },
            { id: "intensity", label: "강도 — 무엇을 얼마나 빠르게" },
            { id: "strength", label: "근력운동" },
            { id: "week", label: "주간 구성 예시" },
            { id: "race", label: "대회 — 테이퍼·페이스·예측" },
            { id: "injury", label: "빨라지려다 다치지 않으려면" },
            { id: "refs", label: "참고 문헌" },
          ]}
        />

        {/* ── 주간 거리 ─────────────────────────────────────── */}
        <h2 id="volume" className="mt-10 text-xl font-bold text-gray-900">
          주간 거리
        </h2>
        <ul className="mt-3 space-y-3 text-[15px] leading-relaxed">
          <li>
            하프 참가자 556명과 풀 참가자 441명을 본 연구에서, 하프는 주 32km 초과·최장 21km 초과, 풀은 주 65km 초과 그룹이 더 빨랐습니다. 그
            훈련량과 부상의 관련은 나타나지 않았습니다.{" "}
            <S>(Fokkema et al. (2020) <Up h="https://pubmed.ncbi.nlm.nih.gov/32421886/" />)</S>
          </li>
          <li>
            레크리에이션 러너 2,303명 설문에서 주간 거리와 인터벌 훈련은 모든 거리에서 비슷한 크기로 속도와 관련 있었고, 템포런은 짧은 거리일수록
            관련이 컸습니다.{" "}
            <S>(Vickers &amp; Vertosick (2016) <Up h="https://pubmed.ncbi.nlm.nih.gov/27570626/" />)</S>
          </li>
        </ul>
        <p className="mt-2 text-sm text-gray-600">두 연구 모두 관찰 연구입니다. 원래 빠른 사람이 더 많이 뛰었을 가능성은 남습니다.</p>

        {/* ── 강도 ─────────────────────────────────────────── */}
        <h2 id="intensity" className="mt-10 text-xl font-bold text-gray-900">
          강도 — 무엇을 얼마나 빠르게
        </h2>
        <ul className="mt-3 space-y-3 text-[15px] leading-relaxed">
          <li>
            <strong>배분 공식.</strong> 13개 연구 348명의 개별 자료를 모은 네트워크 메타분석에서 양극화형(쉬움 위주 + 고강도)과 피라미드형(쉬움 &gt;
            중간 &gt; 고강도)은 전체로 최대산소섭취량·기록 차이가 없었습니다. 최대산소섭취량만 보면 경쟁 선수는 양극화형, 레크리에이션 선수는
            피라미드형에서 더 좋아졌을 가능성이 있었습니다.{" "}
            <S>(Rosenblat et al. (2025) <Up h="https://pubmed.ncbi.nlm.nih.gov/39888556/" />)</S>
          </li>
          <li>
            <strong>레크리에이션 10km.</strong> 러너 30명을 10주 동안 양극화형(쉬움 77%·중간 3%·고강도 20%)과 역치 사이 위주형(46/35/19)으로
            나눴더니 둘 다 10km 기록이 좋아졌고(5.0% 대 3.6%) 차이는 유의하지 않았습니다. 배분을 실제로 잘 지킨 사람만 보면 양극화형이 더
            좋아졌습니다.{" "}
            <S>(Muñoz et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/23752040/" />)</S>
          </li>
          <li>
            <strong>인터벌 대 지속주.</strong> 건강한 성인 723명(28개 연구) 메타분석에서 둘 다 최대산소섭취량을 크게 올렸고(지속주 +4.9, 인터벌 +5.5
            mL/kg/min), 인터벌이 평균 1.2 mL/kg/min 더 올렸습니다. 러너만 대상으로 한 연구는 아닙니다.{" "}
            <S>(Milanović et al. (2015) <Up h="https://pubmed.ncbi.nlm.nih.gov/26243014/" />)</S>
          </li>
        </ul>
        <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">
          정리하면, 비율 공식보다 <strong>쉬운 날은 정말 쉽게, 빠른 날은 주 1회 정도 확실히</strong>가 실천 기준입니다(경험칙). 쉬운 날의 기준은
          말하기 테스트 —{" "}
          <Link href="/injury/start-running#pace" className="text-emerald-700 underline">처음 달리기 글</Link>.
        </p>

        {/* ── 근력 ─────────────────────────────────────────── */}
        <h2 id="strength" className="mt-10 text-xl font-bold text-gray-900">
          근력운동
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed">
          중장거리 러너 근력운동 메타분석에서 <strong>고중량(1RM 80% 이상)</strong>은 기록(타임트라이얼·탈진까지 시간)에 중간 크기 효과, 여러 방법을
          섞은 경우는 큰 효과를 보였고, 플라이오메트릭만 한 경우는 유의하지 않았습니다. 최대산소섭취량 같은 지표는 거의 바뀌지 않았습니다. 포함
          연구는 6~40주, 주 1~4회였고 근거 확실성은 매우 낮음~중간이었습니다.{" "}
          <S>(Llanos-Lagos et al. (2024) <Up h="https://pubmed.ncbi.nlm.nih.gov/38627351/" />)</S>
        </p>
        <p className="mt-2 text-sm text-gray-600">
          부상 예방 효과는 별개입니다 — 첫 풀코스 러너 720명에게 주 3회 10분 자가 근력 프로그램을 준 시험에서는 부상이 줄지 않았습니다.{" "}
          <S>(Toresdahl et al. (2020) <Up h="https://pubmed.ncbi.nlm.nih.gov/31642726/" />)</S>
        </p>

        {/* ── 주간 예시 ─────────────────────────────────────── */}
        <h2 id="week" className="mt-10 text-xl font-bold text-gray-900">
          주간 구성 예시
        </h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <tbody>
              {WEEK.map(([k, v]) => (
                <tr key={k} className="border-t border-gray-100 first:border-t-0">
                  <td className="whitespace-nowrap p-2.5 font-semibold text-gray-900">{k}</td>
                  <td className="p-2.5 text-gray-700">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          이 사이트의 예시입니다. 한 번에 하나만 바꾸세요 — 주간 거리를 늘리는 주에는 인터벌을 새로 넣지 않는 식입니다(경험칙).
        </p>

        {/* ── 대회 ─────────────────────────────────────────── */}
        <h2 id="race" className="mt-10 text-xl font-bold text-gray-900">
          대회 — 테이퍼·페이스·예측
        </h2>
        <ul className="mt-3 space-y-3 text-[15px] leading-relaxed">
          <li>
            <strong>테이퍼.</strong> 경쟁 선수 연구 27편 메타분석: 2주 동안 훈련량을 41~60% 줄이고 강도·빈도는 유지.{" "}
            <S>(Bosquet et al. (2007) <Up h="https://pubmed.ncbi.nlm.nih.gov/17762369/" />)</S>{" "}
            레크리에이션 마라토너 15만 8천여 명 분석: 3주 동안 꾸준히 줄인 그룹이 최소 테이퍼보다 중앙값 5분 32초 빨랐습니다(관찰).{" "}
            <S>(Smyth &amp; Lawlor (2021) <Up h="https://pubmed.ncbi.nlm.nih.gov/34651125/" />)</S>
          </li>
          <li>
            <strong>기록을 노리는 해에 더 무너집니다.</strong> 400만 건 넘는 마라톤 기록 분석에서 후반 붕괴는 최근 개인 기록 전후 3년에 더 잦았습니다
            (36% 대 그 이전 23%).{" "}
            <S>(Smyth (2021) <Up h="https://pubmed.ncbi.nlm.nih.gov/34010308/" />)</S>{" "}
            목표를 높인 대회일수록 전반 페이스를 조심하세요.
          </li>
          <li>
            <strong>예측은 낙관적입니다.</strong> 리겔 공식은 하프까지는 잘 맞았지만 풀코스는 러너 절반에게서 실제보다 10분 이상 빠르게 예측했습니다.
            이전 대회 기록 하나 또는 둘을 쓴 연구진의 모델이 더 정확했습니다.{" "}
            <S>(Vickers &amp; Vertosick (2016) <Up h="https://pubmed.ncbi.nlm.nih.gov/27570626/" />)</S>{" "}
            →{" "}
            <Link href="/tools/pace#predict-h" className="text-emerald-700 underline">페이스 계산기의 기록 예측</Link>
          </li>
          <li>
            <strong>신발.</strong> 카본 플레이트 신발의 효과는 연구가 시험한 속도에서 확인된 것입니다 →{" "}
            <Link href="/injury/carbon-plate" className="text-emerald-700 underline">카본화 살까 말까</Link>
          </li>
        </ul>

        {/* ── 부상 ─────────────────────────────────────────── */}
        <h2 id="injury" className="mt-10 text-xl font-bold text-gray-900">
          빨라지려다 다치지 않으려면
        </h2>
        <ul className="mt-3 space-y-3 text-[15px] leading-relaxed">
          <li>
            거리를 늘릴 때의 기준은 같습니다 — 한 번 달린 거리가 지난 30일 최장 거리보다 10% 넘게 길면 과사용 부상 비율이 1.52~2.28배였습니다.{" "}
            <S>(Frandsen et al. (2025) <Up h="https://pubmed.ncbi.nlm.nih.gov/40623829/" />)</S>
          </li>
          <li>
            경력이 쌓이면 아픈 곳이 바뀝니다. 네덜란드 러너 4,621명 조사에서 아킬레스건 부상 비중이 초보 2.3%, 경력자 8.4%였습니다. 두 그룹 모두
            무릎(30.5%)과 종아리·정강이(17.8%)가 가장 많았습니다.{" "}
            <S>(Kemler et al. (2018) <Up h="https://pubmed.ncbi.nlm.nih.gov/30071170/" />)</S>{" "}
            →{" "}
            <Link href="/injury/achilles" className="text-emerald-700 underline">아킬레스·종아리 글</Link>
          </li>
          <li>
            아프면{" "}
            <Link href="/injury/return-to-running" className="text-emerald-700 underline">부상 후 복귀 글</Link>의 통증 기준으로 조절합니다.
          </li>
        </ul>

        <div className="mt-10">
          <FaqSection items={FAQ} />
        </div>

        <h2 id="refs" className="mt-10 text-xl font-bold text-gray-900">
          참고 문헌
        </h2>
        <p className="mt-1 text-xs text-gray-400">2026-10-07 PubMed 초록과 대조했습니다.</p>
        <ul className="mt-3 space-y-2 text-sm text-gray-700">
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
      </article>
    </>
  );
}
