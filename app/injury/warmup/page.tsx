import Link from "next/link";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ShareButtons from "@/components/ShareButtons";
import ExerciseFigure from "@/components/ExerciseFigure";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import { Up, S } from "@/components/guide/Up";
import { Lead, P, H2, Summary, Todo, Evidence, References, Basis, Note } from "@/components/guide/Read";
import type { Metadata } from "next";
import { pageUrl } from "@/lib/site";

/**
 * 2026-10-08 재검증 — PubMed 초록과 대조
 *   · 「근육은 차가울 때 탄성이 낮아 미세 파열 위험이 높습니다」 → 사람 대상 근거 못 찾음. 삭제하고
 *     Fradkin 2006(워밍업 RCT 5편, 3편 감소·2편 무효, 근거 불충분)과 Lauersen 2014(스트레칭 RR 0.963)로 대체
 *   · 정적 스트레칭 시간 효과에 Behm 2016 수치(근육군당 ≥60초 −4.6%, <60초 −1.1%) 추가
 *   · 「정적 스트레칭은 쿨다운에서」 → 목적(유연성)을 밝힘. 운동 후 스트레칭의 회복 효과는 확인 안 됨(cooldown 페이지)
 *   · 겨울 「워밍업 2배」 → 근거 못 찾음, 경험칙 표기
 *   · 찬 공기·마스크 → Frischhut 2020(−20°C, 동계 선수 13명)·Beuther 2006(천식 15명) 범위로 낮춤. 일반 마스크 효과는 확인 못 함
 *   · 영상 제목의 「부상방지」는 제3자 영상 제목이라 그대로 둔다(본문 주장 아님)
 *
 * 2026-10-13 가독성 재설계 — 섹션마다 답 → 할 일 → 근거(접힘). 숫자·연구 설계는 <Evidence> 안으로.
 *   「연구가 갈립니다」「동작 폼은 논문 근거 아님」「몇 배인지 연구 못 찾음」「소규모·일반 마스크 미확인」은 본문에 남겼다.
 *   「경험칙」 → 「저희 제안」 배지. 참고 자료는 기본 접힘.
 */
const PAGE_URL = pageUrl("/injury/warmup");
const TITLE = "달리기 전 5분 동적 스트레칭 루틴";
const DESC = "정적 스트레칭이 아닌 동적 워밍업이 필요한 이유와 구체적인 5분 루틴을 알려드립니다.";

export const metadata: Metadata = {
  title: "달리기 전 5분 동적 스트레칭 루틴 — 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/warmup" },
};

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["준비운동", "/injury/warmup"],
        ]}
      />
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>
        <header>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">준비운동</span>
            {/* 규약은 app/injury/page.tsx 상단 주석 */}
            <span className="text-xs text-gray-400">4분 읽기</span>
          </div>
          <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">달리기 전 5분 동적 스트레칭 루틴</h1>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-500">
            <span className="text-emerald-600">✓</span>
            협찬 없이 작성 — 연구로 확인된 것과 저희 제안을 구분해 적었습니다
          </p>
        </header>
        <Lead>
          달리기 전에는 오래 붙들고 늘리는 정적 스트레칭보다 <strong>관절을 움직이는 동적 워밍업</strong>을 주로 합니다. 5분 루틴을
          그림으로 정리했습니다.
        </Lead>

        <Summary
          items={[
            <>
              달리기 전 정적 스트레칭은 <strong>짧게, 아프지 않게</strong>. 한 근육군을 60초 이상 붙들면 출력이 더 떨어졌습니다.
              <Basis kind="paper" />
            </>,
            <>
              달리기 전에는 <strong>정적보다 동적</strong>. 근거가 있는 것은 이 방향까지입니다.
              <Basis kind="paper" />
            </>,
            <>
              워밍업이 부상을 줄이는지는 <strong>연구가 갈립니다.</strong> 스트레칭만으로는 예방 효과가 확인되지 않았습니다.
              <Basis kind="paper" />
            </>,
            <>
              추운 날엔 <strong>몸이 데워질 때까지</strong> 평소보다 길게.
              <Basis kind="rule" />
            </>,
          ]}
        />

        {/* 2026-09-03 정정: "근육 출력을 10~15% 낮춥니다"라고 적혀 있었다.
            Behm & Chaouachi 2011이 보고한 것은 **-1.2% ~ -8.5%**이고, 상한도 10%에 못 미친다.
            그리고 더 중요한 조건이 통째로 빠져 있었다 — **용량-반응 관계**다.
            방향은 맞았지만 크기와 조건이 둘 다 틀렸으므로 둘 다 고친다.

            ⚠️ 2026-09-14 — Behm & Chaouachi 2011 초록의 조건은 **총 시간 90초 미만**이지 **자세당 60초**가 아니다.
            2026-10-08: 「근육군당 60초」 기준은 다른 논문(Behm 2016)에 실제로 있다. 출처를 나눠 적는다. */}
        <h2 id="static" className={H2}>
          달리기 전에 스트레칭하면 안 되나요?
        </h2>
        <P>
          하면 안 된다기보다 <strong>오래 붙들지 않는 것</strong>이 요점입니다. 전체를 짧게(총 90초 미만), 아프지 않은 강도로 하면
          영향이 거의 없다고 보고됩니다.
        </P>
        <P>
          그래서 달리기 전에는 관절을 움직이는 동적 워밍업을 주로 합니다. 정적 스트레칭은 유연성을 늘리려는 목적이라면 달린 뒤나 따로
          시간을 내서 합니다.
        </P>
        <Evidence n={2}>
          <p>
            달리기 전에 오래 붙들고 늘리는 정적 스트레칭은 근육 출력을 일시적으로 떨어뜨릴 수 있습니다. 다만 전체를 짧게(총 90초 미만) 하고
            아프지 않은 강도로 하면 영향이 거의 없다고 보고됩니다.{" "}
            <S>(Behm &amp; Chaouachi (2011) <Up h="https://pubmed.ncbi.nlm.nih.gov/21373870/" />)</S>
          </p>
          <p>
            여러 연구를 모은 고찰에서는 한 근육군을 60초 이상 늘렸을 때 평균 −4.6%, 60초 미만이면 −1.1%였습니다. 같은 고찰에서 정적
            스트레칭은 평균 −3.7%, 동적 스트레칭은 +1.3%였습니다. 동적 스트레칭은 관절 가동범위를 늘리고(대개 30분 안쪽 지속), 활동 직전 몇
            분 안에 하면 수행능력이 조금 오른다는 보고가 있습니다.{" "}
            <S>(Behm et al. (2016) <Up h="https://pubmed.ncbi.nlm.nih.gov/26642915/" />)</S>
          </p>
        </Evidence>

        <h2 id="injury" className={H2}>
          워밍업을 하면 덜 다치나요?
        </h2>
        <P>
          <strong>연구가 갈립니다.</strong> 무작위 시험 5편 중 3편은 줄었다고, 2편은 차이가 없다고 보고했습니다. 검토한 연구진은 근거가
          충분하지 않지만 줄이는 쪽에 무게가 있다고 정리했습니다.
        </P>
        <P>
          여러 종목의 무작위 시험을 모은 분석에서, 스트레칭만으로는 부상 예방 효과가 확인되지 않았습니다. 같은 분석에서 근력운동은
          부상 위험을 낮췄습니다.
        </P>
        <Evidence n={2}>
          <p>
            워밍업과 부상을 본 무작위 시험 5편 중 3편은 줄었다고, 2편은 차이가 없다고 보고했고, 검토한 연구진은 근거가 충분하지 않지만 줄이는
            쪽에 무게가 있다고 정리했습니다. <S>(Fradkin et al. (2006) <Up h="https://pubmed.ncbi.nlm.nih.gov/16679062/" />)</S>
          </p>
          <p>
            여러 종목의 무작위 시험 25편(26,610명)을 모은 메타분석에서 스트레칭은 부상 예방 효과가 확인되지 않았습니다(RR 0.96). 같은
            분석에서 근력운동은 부상 위험을 1/3 아래로 낮췄습니다.{" "}
            <S>(Lauersen et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/24100287/" />)</S>
          </p>
        </Evidence>

        <h2 id="routine" className={H2}>
          5분 동적 루틴
        </h2>
        <P>
          위에서부터 순서대로 하고, 마지막 1분은 천천히 조깅으로 마무리합니다. <Basis kind="rule" />
        </P>
        <Note>
          그림은 동작을 알아보게 하는 도식이지 자세를 교정해주는 자료가 아닙니다 — 아래 &ldquo;이 동작들의 근거&rdquo;를 함께 읽어주세요.
        </Note>

        <div className="mt-5 space-y-3">
            <div className="space-y-3">
              <ExerciseFigure
                move="march"
                title="① 제자리 걷기"
                reps="1분"
                cue="가장 먼저 체온을 올리는 단계입니다. 빨리 할 필요가 없어요. 팔을 같이 흔들면서 숨이 살짝 가빠질 정도면 충분합니다."
              />
              <ExerciseFigure
                move="legSwing"
                title="② 레그 스윙 (앞뒤·옆)"
                reps="각 10회"
                cue="벽이나 기둥을 짚고 합니다. 흔한 실수는 반동으로 크게 차는 것 — 허리가 같이 젖혀지면 범위를 줄이세요. 골반은 정면에 고정합니다."
              />
              <ExerciseFigure
                move="hipCircle"
                title="③ 힙 써클"
                reps="양방향 각 10회"
                cue="손을 허리에 얹고 골반으로 원을 그립니다. 상체를 크게 돌리는 게 아니라 골반만 움직이는 동작이에요."
              />
              <ExerciseFigure
                move="lunge"
                title="④ 워킹 런지"
                reps="10보"
                cue="앞으로 한 발 내딛고 내려앉았다가 일어나 반대 발로 이어갑니다. 앞 무릎이 발끝보다 많이 앞으로 나가지 않게, 상체는 세운 채로."
              />
              <ExerciseFigure
                move="highKnees"
                title="⑤ 하이 니즈"
                reps="30초"
                cue="무릎을 골반 높이까지 빠르게 올립니다. 여기서부터 심박이 확 올라와요. 상체가 뒤로 젖혀지면 속도를 낮추세요."
              />
              <ExerciseFigure
                move="buttKicks"
                title="⑥ 버트 킥스"
                reps="30초"
                cue="뒤꿈치로 엉덩이를 차듯 올립니다. 허벅지 앞쪽이 늘어나는 느낌이 나면 제대로 하고 있는 겁니다."
              />
            </div>
        </div>

        <h2 id="basis" className={H2}>
          이 동작들의 근거
        </h2>
        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">통용 관행</span>
            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">논문 근거 아님</span>
          </div>
          <p className="break-keep text-[15px] leading-[1.75] text-gray-700">
            <strong className="text-gray-900">개별 동작의 폼은 논문에서 가져온 것이 아닙니다.</strong> &ldquo;무릎을 몇 도까지 올려야
            한다&rdquo; 같은 수치를 뒷받침하는 연구를 확인하지 않았고, 그래서 그림에 각도를 적지 않았습니다. 러닝 코칭에서 널리 쓰이는
            동작을 알아보기 쉽게 그린 것입니다.
          </p>
          <p className="mt-3 break-keep text-[15px] leading-[1.75] text-gray-700">
            근거가 있는 쪽은 <strong className="text-gray-900">&ldquo;달리기 전에는 정적보다 동적&rdquo;이라는 방향</strong>까지입니다. 그
            이상으로 &ldquo;이 순서가 최적&rdquo;이라거나 &ldquo;이 루틴이 부상을 줄인다&rdquo;고는 말하지 않겠습니다 — 동적 스트레칭과
            부상의 관계는 위 고찰(Behm 2016)에도 자료가 없었습니다.
          </p>
        </div>

        <h2 id="cold" className={H2}>
          추운 날엔 어떻게 하나요?
        </h2>
        <P>
          <strong>몸이 데워졌다고 느낄 때까지 평소보다 길게</strong> 합니다. <Basis kind="rule" />
        </P>
        <Note>몇 배로 늘려야 하는지 보여주는 연구는 찾지 못했습니다.</Note>
        <P>
          영하 15도 아래에서 강하게 달리면 기관지가 좁아질 수 있습니다. 작은 연구들에서 열교환 마스크가 달린 뒤 폐 기능 저하를
          줄였습니다.
        </P>
        <Note>영하 20도 실험실의 동계 종목 선수 13명, 천식이 있는 15명을 본 소규모 연구입니다. 일반 마스크로 같은 효과가 나는지는 확인하지 못했습니다.</Note>
        <Evidence n={2}>
          <p>
            영하 20도 실험실에서 동계 종목 선수 13명을 본 연구에서, 열·수분 교환 마스크를 쓰면 달린 뒤 폐 기능 저하와 기침 같은 증상이
            줄었습니다. <S>(Frischhut et al. (2020) <Up h="https://pubmed.ncbi.nlm.nih.gov/31755166/" />)</S>
          </p>
          <p>
            천식이 있는 15명을 본 소규모 연구에서도 열교환 마스크가 찬 공기 운동 뒤 폐 기능 저하를 줄였습니다.{" "}
            <S>(Beuther &amp; Martin (2006) <Up h="https://pubmed.ncbi.nlm.nih.gov/16685008/" />)</S>
          </p>
        </Evidence>

        <div className="mt-14">
          <YoutubeSection links={[
            { label: "러닝 전 동적 스트레칭 — 워밍업 8분, 부상방지·퍼포먼스 향상", channel: "빅씨스 Bigsis", url: "https://www.youtube.com/watch?v=ddJ9JUcIHvU" },
            { label: "러닝 전 꼭 해야 할 동적 스트레칭 #달리기준비운동", url: "https://www.youtube.com/watch?v=rEj3vyacaw4" },
          ]} />

          <FaqSection items={[
            {
              q: "달리기 전에 정적 스트레칭을 하면 안 되나요?",
              a: "\"하면 안 된다\"보다는 \"오래 붙들지 마라\"가 정확합니다. Behm & Chaouachi(2011) 리뷰는 정적 스트레칭이 근육 출력을 떨어뜨릴 수 있다고 정리하면서, 전체를 짧게(총 90초 미만) 하고 아프지 않은 강도로 하면 저하가 없을 수 있다고 봅니다. Behm 등(2016) 고찰에서는 한 근육군을 60초 이상 늘리면 평균 −4.6%, 60초 미만이면 −1.1%였습니다. 그러니 달리기 전에는 관절을 움직이는 동적 워밍업을 주로 하고, 유연성을 늘리려는 정적 스트레칭은 달린 뒤나 따로 하세요.",
            },
            {
              // 2026-09-03: 본문을 동작 카드 6개로 바꾸면서 이 답변은 그대로 뒀다.
              // 지금은 내용이 같아 틀리진 않지만, **동작을 고치면 두 곳이 갈라진다.**
              q: "5분 동적 워밍업은 어떻게 구성하나요?",
              a: "① 제자리 걷기 1분 → ② 레그 스윙(앞뒤·옆) 각 10회 → ③ 힙 써클 각 10회 → ④ 워킹 런지 10보 → ⑤ 하이 니즈 30초 → ⑥ 버트 킥스 30초. 마지막 1분은 천천히 조깅으로 마무리합니다.",
            },
            {
              q: "추운 날에는 워밍업을 어떻게 해야 하나요?",
              a: "몸이 데워졌다고 느낄 때까지 평소보다 길게 하세요(저희 제안 — 몇 배로 늘려야 하는지 보여주는 연구는 찾지 못했습니다). 영하 15도 아래에서 강하게 달리면 기관지가 좁아질 수 있고, 동계 종목 선수와 천식 환자를 본 소규모 연구에서는 열교환 마스크가 이를 줄였습니다(Frischhut 2020, Beuther 2006). 일반 마스크로 같은 효과가 나는지는 확인하지 못했습니다.",
            },
          ]} />
        </div>

        <References
          n={7}
          title="참고 자료"
          note="추천 순서는 광고비로 바뀌지 않습니다. 연구 인용은 방향과 효과 크기에만 붙였고, 동작의 폼은 통용 관행입니다."
        >
          <ul className="space-y-2 text-sm">
            {/* 2026-09-03: "NSCA — Warm-up guidelines for endurance athletes ↗"라는 제목이 nsca.com 루트를
                가리키고 있어 내렸다(AGENTS.md §1 작화 신호). */}
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Behm &amp; Chaouachi (2011)</strong> — 정적·동적 스트레칭의 즉각적 효과 리뷰. 총 90초 미만·불편감 아래 강도면 저하가 없을 수 있음. Eur J Appl Physiol 111(11):2633-51. <a href="https://pubmed.ncbi.nlm.nih.gov/21373870/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Behm et al. (2016)</strong> — 건강하고 활동적인 사람 대상 체계적 고찰. 정적 −3.7%, 동적 +1.3%, 근육군당 60초 이상 −4.6% vs 미만 −1.1%. 정적 스트레칭은 부상에 뚜렷한 효과 없음, 동적은 부상 자료 없음. <a href="https://pubmed.ncbi.nlm.nih.gov/26642915/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Fradkin et al. (2006)</strong> — 워밍업과 부상 예방 RCT 5편 체계적 고찰. 3편 감소·2편 무효, 근거 불충분하나 감소 쪽에 무게. <a href="https://pubmed.ncbi.nlm.nih.gov/16679062/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Lauersen et al. (2014)</strong> — 운동 중재의 부상 예방 메타분석(RCT 25편, 26,610명). 스트레칭 RR 0.963(0.846–1.095), 근력운동 RR 0.315. <a href="https://pubmed.ncbi.nlm.nih.gov/24100287/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Frischhut et al. (2020)</strong> — −20°C 고강도 달리기, 동계 종목 선수 13명. 열·수분 교환 마스크가 폐 기능 저하·증상을 줄임. <a href="https://pubmed.ncbi.nlm.nih.gov/31755166/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Beuther &amp; Martin (2006)</strong> — 찬 공기(−25~−15°C) 운동 유발 천식 15명. 열교환 마스크가 폐 기능 저하를 막음. <a href="https://pubmed.ncbi.nlm.nih.gov/16685008/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><span className="text-gray-500">개별 동작의 폼과 겨울 워밍업 시간은 통용 관행·저희 제안이며 논문 출처가 없습니다. 위 &ldquo;이 동작들의 근거&rdquo; 참고</span></li>
          </ul>
        </References>

        <p className="mt-6 text-xs text-gray-400">※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 통증이 지속되면 전문의 상담을 권장합니다.</p>

        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl">
          <p className="font-medium text-emerald-900 mb-2">내 발에 맞는 러닝화를 찾으세요</p>
          <Link href="/shoe-finder" className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            나에게 맞는 신발 찾기 →
          </Link>
        </div>
        <ShareButtons from="warmup" title="달리기 전 5분 동적 스트레칭" description="동작 6개를 그림으로 정리했습니다." />

      </article>
    </>
  );
}
