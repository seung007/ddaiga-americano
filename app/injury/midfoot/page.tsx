import Link from "next/link";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import { Up, S } from "@/components/guide/Up";
import { Lead, P, H2, Summary, Evidence, References, Basis, Note } from "@/components/guide/Read";
import type { Metadata } from "next";

/**
 * 2026-10-08 재검증 — 초록과 대조
 *   · 「핵심은 착지 부위가 아니라 발이 몸 앞에서 닿는지」 → 둘 다 부하와 관련, 어느 쪽이 더 중요한지는 미정
 *     (Lieberman 2015, 14명). 「착지 위치가 더 중요」 단정 삭제
 *   · 「억지로 미드풋 → 아킬레스건이 아픕니다」 → 확인된 것은 부하 증가(Almonroeder 2013, Rice 2017)
 *   · 「5~10% 올리면 아킬레스 장력 감소」 → Lyght 2016 은 ±5%만 시험(여성 19명). 5%까지로
 *   · 「퍽 소리 = 발이 몸 앞」 → 반대 근거(Hung Au 2021: 앞쪽 착지가 더 시끄럽고, 소리와 부하율 무관)
 *   · 「2023년 기준 연구들」·「보폭이 길지 않으면 부상률 차이 없음」 → 근거 못 찾음.
 *     체계적 고찰(Anderson 2020, Burke 2021)은 「관계 불분명」. Burke 2023 전향 연구 추가
 *   · Lieberman 2010 → 비교 대상은 맨발 포어풋 vs 신발 신은 뒤꿈치 착지. 미드풋은 비교하지 않음
 *   · Almeida 2015 인용 안 JSX 주석이 저자명을 URL 에서 488자 밀어내 검사기가 「미검출」 → 주석을 <li> 위로
 *   · 밑창 마모 확인법 → (경험칙) 표기
 *
 * 2026-10-13 가독성 재설계 — 「먼저 결론」 → <Summary>. 섹션마다 답 → 근거(접힘).
 *   숫자·인원·인용은 <Evidence> 안으로. 「경험칙」 → 「저희 제안」 배지. 참고 자료는 기본 접힘.
 *   표본 크기(14명·19명)는 보이는 본문/<Note> 에 남겼다.
 */
const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/midfoot";
const TITLE = "미드풋 착지란? 힐스트라이크와 차이";
const DESC = "미드풋이 무엇인지, 힐스트라이크와 뭐가 다른지, 그리고 초보 러너가 굳이 바꿔야 하는지까지 정리했습니다.";

export const metadata: Metadata = {
  // 네이버 서치어드바이저 실측(2026-08): "미드풋" 질의로 노출 329 · 클릭 2 · CTR 0.6%.
  // 전체 키워드 중 노출 1위인데 CTR은 최하위였다. 이전 제목이 "무조건 좋은 게 아닌 이유"로
  // 부정부터 시작해, "미드풋이 뭔지" 알고 싶어 검색한 사람에게 답을 약속하지 못했다.
  // 질의어를 앞에 두고 무엇을 알게 되는지 먼저 밝히는 쪽으로 교체.
  title: "미드풋 착지란? 힐스트라이크와 차이, 나한테 맞는지 판단하는 법 — 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/midfoot" },
};

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["미드풋 착지", "/injury/midfoot"],
        ]}
      />
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-600">착지법</span>
          {/* 규약은 app/injury/page.tsx 상단 주석 */}
          <span className="text-xs text-gray-400">4분 읽기</span>
          <span className="text-xs text-gray-400">· 협찬 없이 작성</span>
        </div>
        {/* h1은 <title>과 같은 말을 해야 한다. 검색결과에서 "미드풋 착지란?"을 보고 들어왔는데
            화면에 "무조건 좋은 게 아닌 이유"가 있으면 약속한 답이 아니라 반박부터 만나게 된다. */}
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        {/**
         * 먼저 결론 (2026-09-13 추가) → 2026-10-13 <Lead>·<Summary> 로
         *
         * 감사에서 나온 것: **이 페이지에 "미드풋이 무엇인가"가 없었다.**
         * 「미드풋」은 이 사이트 노출 1위 검색어다. 제목은 더 만지지 않고,
         * 검색한 사람이 찾던 한 문장을 맨 위에 둔다.
         */}
        <Lead>
          <strong>미드풋 착지는 발바닥 중간이 먼저 땅에 닿는 방식</strong>입니다. 뒤꿈치부터 닿으면 힐스트라이크, 앞꿈치부터 닿으면
          포어풋입니다.
        </Lead>

        <Summary
          items={[
            <>초보라면 <strong>굳이 바꾸지 않아도 됩니다.</strong> 연구 53편을 모은 고찰은 부상 없는 뒤꿈치 착지 러너에게 착지법 변경을 권할 수 없다고 봤습니다.<Basis kind="paper" /></>,
            <>바꾸고 싶다면 착지법보다 <strong>케이던스(분당 걸음 수)를 지금보다 조금(5~10%) 올려 보세요.</strong><Basis kind="rule" /></>,
            <>억지로 미드풋으로 바꾸면 <strong>아킬레스건과 종아리가 받는 부하가 커집니다.</strong><Basis kind="paper" /></>,
            <>발소리로는 착지가 잘됐는지 판단하기 어렵습니다.<Basis kind="paper" /></>,
          ]}
        />

        {/**
         * 세 착지법 비교표 (2026-09-14 추가). 2026-09-14 에 근거 없는 「부하가 몰리는 곳」 열을 뺐다.
         * 남은 두 열은 정의와 관찰(밑창)이다.
         */}
        <h2 id="compare" className={H2}>
          힐스트라이크 · 미드풋 · 포어풋, 뭐가 달라요?
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-[15px]">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="py-2 pr-3 font-semibold text-gray-900">착지법</th>
                <th className="py-2 pr-3 font-semibold text-gray-900">먼저 닿는 곳</th>
                <th className="py-2 font-semibold text-gray-900">
                  밑창이 닳는 곳<Basis kind="rule" />
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-3 font-medium text-gray-900">힐스트라이크</td>
                <td className="break-keep py-2 pr-3">뒤꿈치</td>
                <td className="break-keep py-2">뒤꿈치 바깥쪽</td>
              </tr>
              <tr className="border-b border-gray-100 bg-violet-50">
                <td className="py-2 pr-3 font-medium text-gray-900">미드풋</td>
                <td className="break-keep py-2 pr-3">발바닥 중간</td>
                <td className="break-keep py-2">중간~앞쪽이 고르게</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 font-medium text-gray-900">포어풋</td>
                <td className="break-keep py-2 pr-3">앞꿈치</td>
                <td className="break-keep py-2">앞쪽</td>
              </tr>
            </tbody>
          </table>
        </div>
        <P>
          <strong>어느 쪽이 더 좋다는 표가 아닙니다.</strong> 착지 부위를 바꾸면 몸이 받는 부담의 <strong>위치도 바뀝니다</strong>.
        </P>
        <P>
          체계적 고찰에서 앞쪽 착지는 수직 부하율이 낮은 대신 발목(종아리) 쪽 부하가 컸습니다. 어디로 얼마나 옮겨 가는지는 연구마다
          달라서, 저희가 숫자 하나로 말할 수 있는 부분은 아닙니다.
        </P>

        {/* 「미드풋」 검색자가 다음으로 묻는 것 — 그럼 나는 지금 뭘로 뛰고 있나 */}
        <h2 id="check" className={H2}>
          나는 지금 뭘로 착지하고 있을까
        </h2>
        <div className="mt-5 space-y-3">
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-1 text-[15px] font-semibold text-gray-900">
              1. 신발 밑창을 본다 (제일 쉬움)
              <Basis kind="rule" />
            </p>
            <p className="break-keep text-[15px] leading-[1.7] text-gray-700">
              오래 신은 러닝화를 뒤집어 보세요. <strong>뒤꿈치 바깥쪽만 닳아 있으면 힐스트라이크에 가깝다</strong>고 흔히 봅니다.
              연구로 확인된 방법은 아니고 대략의 단서입니다. 그렇다고 잘못 뛰고 있는 건 아닙니다.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-1 text-[15px] font-semibold text-gray-900">2. 옆에서 영상을 찍는다</p>
            <p className="break-keep text-[15px] leading-[1.7] text-gray-700">
              누군가에게 옆에서 슬로우모션으로 찍어 달라고 하세요. 요즘 폰은 대부분 됩니다. 어디로 닿는지와 함께 발이{" "}
              <strong>몸보다 얼마나 앞에서 닿는지</strong>도 보세요.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-1 text-[15px] font-semibold text-gray-900">3. 발소리로는 판단하기 어렵습니다</p>
            <p className="break-keep text-[15px] leading-[1.7] text-gray-700">
              발소리가 크면 착지가 잘못됐다고 생각하기 쉽습니다. 하지만 러너 30명의 실험에서는 미드풋·포어풋 착지가 뒤꿈치 착지보다
              소리가 더 컸습니다. <strong>소리만으로 착지 위치나 충격을 판단하지 마세요.</strong>
            </p>
            <Evidence n={1}>
              <p>
                러너 30명의 실험에서 미드풋·포어풋 착지가 뒤꿈치 착지보다 소리가 더 컸고, 소리 크기와 수직 부하율은 관련이
                없었습니다. <S>(Hung Au et al. (2021) <Up h="https://pubmed.ncbi.nlm.nih.gov/34911076/" />)</S>
              </p>
            </Evidence>
          </div>
        </div>

        <h2 id="injury" className={H2}>
          힐스트라이크로 달리면 무릎이 망가지나요?
        </h2>
        <P>
          &ldquo;힐스트라이크로 달리면 무릎이 망가진다&rdquo;는 말, 한 번쯤 들어보셨을 겁니다.{" "}
          <strong>착지법과 부상의 관계는 아직 연구로 정리되지 않았습니다.</strong>
        </P>
        <P>
          연구 13편, 53편을 각각 모은 체계적 고찰 둘 다 근거가 부족하다고 봤습니다. 일반 러너 258명을 1년간 추적한 연구에서는
          오히려 뒤꿈치가 아닌 착지가 부상과 연관된 결과가 나왔습니다.
        </P>
        <Note>그 연구에서도 여러 요인을 함께 넣은 분석에서는 착지법이 빠졌습니다.</Note>
        <Evidence n={4}>
          <p>
            하버드 대학교 다니엘 리버만 교수팀의 2010년 연구에서는 맨발로 앞꿈치 착지하는 러너가 신발 신고 뒤꿈치 착지하는 러너보다
            충돌력이 작았습니다. <S>(Lieberman et al. (2010) <Up h="https://pubmed.ncbi.nlm.nih.gov/20111000/" />)</S> 이 연구는
            미드풋을 따로 비교하지 않았고, 충돌력 차이가 부상률 차이로 이어지는지는 별개의 문제입니다.
          </p>
          <p>
            착지법과 부상의 관계를 다룬 연구 13편을 모은 체계적 고찰은 관계를 뒷받침하는 근거 수준이 낮다고 결론 냈습니다.{" "}
            <S>(Burke et al. (2021) <Up h="https://pubmed.ncbi.nlm.nih.gov/34527750/" />)</S>
          </p>
          <p>
            53편을 모은 다른 체계적 고찰도 전향 연구가 부족해 착지법과 부상 위험의 관계를 판단하지 못했고, 부상 없는 뒤꿈치 착지
            러너에게 착지법 변경을 권할 수 없다고 결론 냈습니다.{" "}
            <S>(Anderson et al. (2020) <Up h="https://pubmed.ncbi.nlm.nih.gov/31823338/" />)</S>
          </p>
          <p>
            일반 러너 258명을 1년간 추적한 연구에서는 오히려 뒤꿈치가 아닌 착지가 부상과 연관된 결과가 나왔습니다(단변량 분석, 여러
            요인을 함께 넣은 분석에서는 빠짐). 가장 많이 다친 부위는 종아리였습니다.{" "}
            <S>(Burke et al. (2023) <Up h="https://pubmed.ncbi.nlm.nih.gov/37310517/" />)</S>
          </p>
        </Evidence>

        <h2 id="overstride" className={H2}>
          발이 몸보다 멀리 앞에서 닿으면 — 오버스트라이드
        </h2>
        <P>
          러너 14명의 실험에서 발이 몸보다 멀리 앞에서 닿을수록 충격과 제동이 컸습니다. 다만{" "}
          <strong>착지 위치와 착지 부위 중 어느 쪽이 더 중요한지는 아직 정해지지 않았습니다.</strong>
        </P>
        <Evidence n={1}>
          <p>
            러너 14명이 같은 속도에서 케이던스를 바꿔 달린 실험에서, 발이 무릎보다 앞에서 닿을수록 충격 피크가 컸고 엉덩이보다
            앞에서 닿을수록 제동력이 컸습니다.{" "}
            <S>(Lieberman et al. (2015) <Up h="https://pubmed.ncbi.nlm.nih.gov/26538175/" />)</S>
          </p>
        </Evidence>

        <h2 id="how-to" className={H2}>
          그럼 초보는 어떻게 할까
        </h2>
        <P>
          착지 방식을 바꾸기보다 <strong>케이던스를 지금보다 5~10% 높이는 것</strong>을 먼저 시도해 보세요.
          <Basis kind="rule" /> 케이던스를 올리면 보폭이 줄고 착지 위치가 몸 쪽으로 가까워졌다는 실험이 있습니다.
        </P>
        <P>
          앞쪽 착지는 아킬레스건 부하를 키웁니다. 그래서 저희는 착지법을 바꾸더라도 <strong>한꺼번에 바꾸지 않기</strong>를
          권합니다.
          <Basis kind="rule" />
        </P>
        <Note>아킬레스건 부하 근거는 여성 러너 맨발 실험과 뒤꿈치 착지 러너 22명 실험입니다. 부하가 커졌다는 것이지 부상이 늘었다는 결과는 아닙니다.</Note>
        <P>
          {/* 2026-10-08: 「5~10% 올리면 아킬레스건 장력이 준다」는 따옴표 인용을 뺐다. 실험(Lyght 2016)은 +5%만 시험했다. */}
          정형외과 전문의도 <strong>&ldquo;착지 방식을 억지로 바꾸기보다 훈련량을 점진적으로&rdquo;</strong>라고 말합니다(아래 참고
          자료).
        </P>
        <Note>걸음 수를 올렸을 때 아킬레스건 최대 응력이 줄었다는 실험은 5% 증가만 시험했습니다(여성 러너 19명).</Note>
        <Evidence n={5}>
          <p>
            케이던스를 올리면 보폭이 줄었고{" "}
            <S>(Heiderscheit et al. (2011) <Up h="https://pubmed.ncbi.nlm.nih.gov/20581720/" />)</S>, 분당 5보폭(10걸음) 올릴
            때마다 엉덩이 대비 착지 위치가 5.9% 가까워졌습니다.{" "}
            <S>(Lieberman et al. (2015) <Up h="https://pubmed.ncbi.nlm.nih.gov/26538175/" />)</S>
          </p>
          <p>
            걸음 수를 5% 올렸을 때 아킬레스건 최대 응력이 줄었다는 실험(여성 러너 19명)이 있습니다.{" "}
            <S>(Lyght et al. (2016) <Up h="https://pubmed.ncbi.nlm.nih.gov/26955843/" />)</S>
          </p>
          <p>
            여성 러너를 비교한 맨발 실험에서 뒤꿈치가 아닌 착지를 쓰는 러너는 걸음당 아킬레스건 충격량이 11% 컸고{" "}
            <S>(Almonroeder et al. (2013) <Up h="https://pubmed.ncbi.nlm.nih.gov/23640524/" />)</S>, 뒤꿈치 착지 러너 22명의
            실험에서는 미니멀 신발을 신고 앞꿈치로 착지시켰을 때 아킬레스건 충격량이 커졌습니다.{" "}
            <S>(Rice et al. (2017) <Up h="https://pubmed.ncbi.nlm.nih.gov/28460179/" />)</S>
          </p>
        </Evidence>

        <YoutubeSection links={[
          { label: "착지법 전쟁 종결 — 미드풋 vs 리어풋 vs 힐스트라이크", channel: "러닝비하인드 RunningBehind 쟐쌤", url: "https://www.youtube.com/watch?v=FWXS4q-34w8" },
          { label: "수십 년째 논쟁 — 힐스트라이크 vs 미드풋 vs 포어풋", channel: "애슬레틱 라이프 Athletic Life", url: "https://www.youtube.com/watch?v=b20-GrHPMWI" },
        ]} />

        <FaqSection items={[
          {
            q: "미드풋 착지가 힐스트라이크보다 무조건 좋은가요?",
            a: "아니요. 착지법과 부상의 관계는 아직 연구로 정리되지 않았습니다. 체계적 고찰들은 근거가 부족하다고 결론 냈고, 부상 없는 뒤꿈치 착지 러너에게 착지법 변경을 권할 수 없다고 봤습니다.",
          },
          {
            q: "그럼 착지에서 신경 쓸 건 뭔가요?",
            a: "발이 몸보다 멀리 앞에서 닿지 않게 하는 것입니다. 러너 14명의 실험에서 발이 무릎보다 앞에서 닿을수록 충격 피크가 컸고, 엉덩이보다 앞에서 닿을수록 제동력이 컸습니다. 다만 착지 위치와 착지 부위 중 어느 쪽이 더 중요한지는 정해지지 않았습니다.",
          },
          {
            q: "초보는 착지법을 어떻게 바꿔야 하나요?",
            a: "착지법을 강제로 바꾸기보다 케이던스를 현재보다 5~10% 높여 보세요. 케이던스를 올리면 보폭이 줄고 착지 위치가 몸 쪽으로 가까워졌다는 실험이 있습니다. 앞쪽 착지는 아킬레스건 부하가 커지므로 강제로 한꺼번에 바꾸지 않는 편이 낫습니다(저희 기준).",
          },
        ]} />

        {/* 다음에 읽을 것 — first-10k 에 이어 두 번째 시험. from=midfoot 으로 계측된다. */}
        <h2 id="next" className={H2}>
          다음에 읽을 것
        </h2>
        <div className="mt-4 space-y-2">
          <Link
            href="/injury/cadence"
            className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
          >
            <p className="text-sm font-semibold text-gray-900">케이던스 180이 모두의 정답은 아닙니다 →</p>
            <p className="mt-1 text-sm text-gray-600">착지법 대신 먼저 만져야 할 것.</p>
          </Link>
          <Link
            href="/injury/achilles"
            className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
          >
            <p className="text-sm font-semibold text-gray-900">미드풋으로 바꾼 뒤 아킬레스건이 아프다면 →</p>
            <p className="mt-1 text-sm text-gray-600">전환 속도가 너무 빨랐을 때 생기는 일.</p>
          </Link>
          <Link
            href="/injury/knee-pain"
            className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
          >
            <p className="text-sm font-semibold text-gray-900">달릴 때 무릎이 아프다면 →</p>
            <p className="mt-1 text-sm text-gray-600">착지법을 의심하기 전에 볼 것들.</p>
          </Link>
        </div>

        <References
          n={14}
          title="참고 자료"
          note="추천 순서는 광고비로 바뀌지 않습니다. 연구로 확인한 문장에는 출처를 붙였고, 저희 제안은 그렇게 표시했습니다."
        >
          <ul>
            {/* ⚠️ 2026-09-14 정정 — Almeida 설명문이 초록보다 세게 말하고 있었다(「무릎·슬개대퇴 부하」는 논문에 없는 말).
                2026-10-08: 이 주석이 <a> 안에 있어 저자명이 URL 에서 488자 밀려 검사기가 「미검출」로 잡았다 → <li> 위로 옮김. */}
            <li><strong>Almeida et al. (2015)</strong> J Orthop Sports Phys Ther 45(10):738-755 — 착지 패턴별 생체역학 메타분석(16편). 뒤꿈치 착지는 수직 부하율이 앞발 착지보다 높았고, 발목·무릎 각도와 가동범위에도 차이. <a href="https://pubmed.ncbi.nlm.nih.gov/26304644/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed ↗</a></li>
            <li><strong>Anderson et al. (2020)</strong> — 착지법 변경의 이득과 위험 체계적 고찰(53편). 부상 없는 뒤꿈치 착지 러너에게 변경 권고 불가. <a href="https://pubmed.ncbi.nlm.nih.gov/31823338/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed ↗</a></li>
            <li><strong>Burke et al. (2021)</strong> — 착지법과 러닝 부상 체계적 고찰(13편). 관계의 근거 수준 낮음. <a href="https://pubmed.ncbi.nlm.nih.gov/34527750/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed ↗</a></li>
            <li><strong>Burke et al. (2023)</strong> — 일반 러너 258명 1년 전향 추적. <a href="https://pubmed.ncbi.nlm.nih.gov/37310517/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed ↗</a></li>
            <li><strong>Lieberman et al. (2010)</strong> — 맨발 러너와 신발 신은 러너의 착지와 충돌력(Nature). <a href="https://pubmed.ncbi.nlm.nih.gov/20111000/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed ↗</a></li>
            <li><strong>Lieberman et al. (2015)</strong> — 보빈도·착지 위치와 제동력·충격 피크(14명). <a href="https://pubmed.ncbi.nlm.nih.gov/26538175/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed ↗</a></li>
            <li><strong>Heiderscheit et al. (2011)</strong> — 케이던스 조작과 하지 관절 역학(일반 러너 45명). <a href="https://pubmed.ncbi.nlm.nih.gov/20581720/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed ↗</a></li>
            <li><strong>Lyght et al. (2016)</strong> — 착지법·걸음 수(±5%)와 아킬레스건 응력(여성 러너 19명). <a href="https://pubmed.ncbi.nlm.nih.gov/26955843/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed ↗</a></li>
            <li><strong>Almonroeder et al. (2013)</strong> — 착지법과 아킬레스건 부하(여성 러너, 맨발). <a href="https://pubmed.ncbi.nlm.nih.gov/23640524/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed ↗</a></li>
            <li><strong>Rice et al. (2017)</strong> — 착지법·신발 조작과 아킬레스건 부하(뒤꿈치 착지 러너 22명). <a href="https://pubmed.ncbi.nlm.nih.gov/28460179/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed ↗</a></li>
            <li><strong>Hung Au et al. (2021)</strong> — 착지법별 발소리와 수직 부하율(30명). <a href="https://pubmed.ncbi.nlm.nih.gov/34911076/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed ↗</a></li>
            {/* 2026-09-15 추가 — 한국어 · 정형외과 전문의. */}
            <li>
              <a href="https://www.hnews.kr/news/view.php?no=68992" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
                안지용 (서울부민병원 정형외과 실장) — <strong>&ldquo;착지 방식을 억지로 바꾸기보다 훈련량을 점진적으로 늘리는 것이 중요&rdquo;</strong>. 현대건강신문 ↗
              </a>
            </li>
            <li>
              <a href="https://news.hidoc.co.kr/news/articleView.html?idxno=61267" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
                선상규 (코끼리정형외과의원 정형외과 전문의) — 걸음 수를 늘리면 아킬레스건 부담이 줄어든다는 설명. 하이닥 ↗
              </a>
            </li>
            <li className="text-gray-500">오버스트라이드 관련 자료 — 검증기가 무관한 논문을 가리키는 것을 확인해 링크를 내렸습니다 (2026-08-31)</li>
          </ul>
        </References>

        <p className="mt-6 text-xs text-gray-400">※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 통증이 지속되면 전문의 상담을 권장합니다.</p>

        <div className="mt-10 rounded-2xl bg-emerald-50 p-6">
          <p className="mb-2 font-medium text-emerald-900">내 발에 맞는 러닝화를 찾으세요</p>
          <Link href="/shoe-finder" className="inline-block rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
            내 러닝화 찾기 →
          </Link>
        </div>
      </article>
    </>
  );
}
