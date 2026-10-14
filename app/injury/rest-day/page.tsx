import Link from "next/link";
import FaqSection from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import { Up, S } from "@/components/guide/Up";
import { Lead, P, H2, H3, Summary, Todo, Evidence, References, Basis, Warn, Note } from "@/components/guide/Read";
import type { Metadata } from "next";
import { pageUrl } from "@/lib/site";

/**
 * 2026-10-08 재검증 — PubMed 초록과 대조
 *   · 「아침 안정시 심박수가 뚜렷하게 높다」 → 과장. Bosquet 2008 메타분석: 단기 과부하에선 중간 정도 상승(SMD 0.55),
 *     장기 과부하에선 안정시 값 변화 없음, 다른 신호와 함께 봐야 함. 단독 신호로 쓰지 않게 고침
 *   · 「수면 장애」 → Meeusen 2013 초록에 없음. 경험칙 표기
 *   · 48~72시간을 적어 놓고 바로 아래에서 「며칠 같은 숫자 기준은 적지 않는다」고 쓴 모순 → 출처를 나눠 적음
 *   · 「2주 넘게 이어지면 진료」 → 근거 못 찾음. 「몇 주씩」(경험칙)으로
 *   · 「20~30분 걷기면 충분」 「숨이 차면 휴식 아님」 → 경험칙 표기
 *   · 이재엽 2024·박찬호 2013(KCI)은 이번에 원문을 열람하지 못했다. 문장은 유지하고,
 *     젖산 쪽은 같은 방향의 PubMed 근거(Van Hooren 2018)를 덧붙였다.
 *
 * 2026-10-13 가독성 재설계 — 섹션마다 답 → 할 일 → 근거(접힘). start-running 본보기를 따름.
 *   · 「먼저 결론」 → <Summary>. 보이는 본문의 「경험칙」 → 「저희 제안」 배지·문구
 *   · 「휴식일을 직접 비교한 연구 없음」「젖산 메타분석 8편·편차 큼」「경쟁 선수 연구」「48~72시간은 합의문 기준 아님」 단서는 본문에
 *   · 오버트레이닝 신호·진료 문장은 <Warn> 으로 접지 않음. 참고 자료는 맨 끝 기본 접힘
 *   · 48~72시간·주 1일(박찬호·곽이섭 2013, 국내 논문 일반 권고)은 「연구로 확인」 배지를 달지 않고 출처를 글로 적음
 */
const PAGE_URL = pageUrl("/injury/rest-day");
const TITLE = "휴식일에 뭘 해야 할까? 액티브 리커버리";
// 2026-09-14: "가벼운 움직임이 회복을 빠르게 합니다" 였다. 이 페이지가 인용한
// Zouhal 2024 체계적 고찰이 바로 그 차이를 확인하지 못했다 — 근거가 부정하는 문장이었다.
const DESC =
  "쉬는 날 꼭 뭘 해야 하는 건 아닙니다. 가볍게 움직이는 쪽이 완전히 쉬는 쪽보다 낫다는 근거는 약합니다. 오버트레이닝 신호를 보는 법까지 정리했습니다.";

export const metadata: Metadata = {
  title: "휴식일에 뭘 해야 할까? 액티브 리커버리 — 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/rest-day" },
};

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["휴식일", "/injury/rest-day"],
        ]}
      />
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">회복</span>
          <span className="text-xs text-gray-400">3분 읽기</span>
          <span className="text-xs text-gray-400">· 협찬 없이 작성</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        {/* 2026-09-14: "연구에 따르면 … 회복을 20~30% 빠르게 합니다" 였다.
            그 「연구」로 달아 둔 Zouhal 2024 는 **차이를 확인하지 못했다**고 결론 낸 고찰이다.
            수치도 출처도 없는 문장이라 대체 주장 없이 뺐다. */}
        <Lead>
          쉬는 날 몸이 굳는 느낌이 들면 가볍게 움직여도 됩니다. 다만 그쪽이 완전히 쉬는 쪽보다 낫다는 근거는 생각보다 약합니다.
        </Lead>

        {/**
         * ⚠️ 2026-09-14 — **본문이 자기 인용과 반대로 말하고 있었다.**
         * 원문: *"혈류가 유지되면 근육의 젖산이 더 빠르게 제거되고, 염증 반응이 줄어듭니다."*
         * 그런데 아래 참고자료의 Zouhal et al. (2024) 체계적 고찰은 **능동회복과 수동휴식의 효과 차이를
         * 확인하지 못했다.** 근거 없는 문장을 **빼고**, 논문이 실제로 말한 것을 적었다.
         */}
        <Summary
          items={[
            <>
              <strong>쉬는 날 꼭 뭘 해야 하는 건 아닙니다.</strong> 가볍게 움직이는 쪽이 완전히 눕는 쪽보다 낫다는 증거는{" "}
              <strong>생각보다 약합니다.</strong>
              <Basis kind="paper" />
            </>,
            <>
              몸이 뻣뻣하면 <strong>20~30분 걷는 정도</strong>면 됩니다.
              <Basis kind="rule" />
            </>,
            <>
              <strong>숨이 찰 정도면 휴식이라 보기 어렵습니다.</strong> 쉬는 날 달리기는 하지 않습니다.
              <Basis kind="rule" />
            </>,
            <>
              쉬어도 풀리지 않는 피로가 <strong>몇 주씩 이어지면 진료</strong>를 받아 보세요.
              <Basis kind="rule" />
            </>,
          ]}
        />

        {/* ── ① ─────────────────────────────────────────── */}
        <h2 id="active-recovery" className={H2}>
          가볍게 움직이면 회복이 빨라질까?
        </h2>
        <P>
          &ldquo;이걸 해야 회복이 빠르다&rdquo;가 아니라 <strong>&ldquo;쉬는 날 몸이 뻣뻣하면 가볍게 움직여도 된다&rdquo;</strong>{" "}
          정도로 보는 게 맞습니다.
        </P>
        {/* 2026-10-06: 두 연구 모두 「휴식일」이 아니라 **운동 중·직후 회복**을 본 것이다.
            Zouhal 2024 = 인터벌 세트 사이에 쉬느냐 가볍게 움직이느냐(PubMed 초록 확인),
            이재엽 2024 = 운동 직후 회복 구간의 젖산. 휴식일 연구처럼 쓰던 것을 범위를 밝혀 고쳤다. */}
        <P>
          <strong>훈련 없는 날(휴식일)을 직접 비교한 연구는 저희가 찾지 못했습니다.</strong> 가장 가까운 연구 두 가지는 운동
          중·직후의 회복 방식을 본 것이고, 재는 지표에 따라 답이 갈립니다.
        </P>
        <ul className="mt-4 space-y-2 break-keep text-base leading-[1.8]">
          <li>
            · <strong>운동 직후 혈중 젖산</strong> — 가볍게 움직이는 회복이 가만히 쉬는 것보다 빠르게 낮췄을 가능성이 있습니다.
          </li>
          <li>
            · <strong>인터벌 세트 사이 회복 → 체력 향상</strong> — 3주 이상 훈련 프로그램에서{" "}
            <strong>회복 방식에 따른 차이가 확인되지 않았습니다.</strong>
          </li>
        </ul>
        {/**
         * 2026-09-15 — 이재엽·노기웅·박석 (2024) 한국체육과학회지 33(1):533-543.
         * ⚠️ **Zouhal 2024 와 모순이 아니다.** 재는 것이 다르다 — 젖산 농도(급성) vs 체력 향상(3주 이상).
         * 하나만 인용하고 다른 쪽을 안 쓰면 그게 체리피킹이다. 둘 다 쓴다.
         * ⚠️ 이 메타분석의 **지표는 젖산 하나뿐**이고 연구도 8편, I² 69~88%로 이질성이 높다.
         */}
        <Note>젖산 연구는 포함 연구가 8편이고 연구 간 편차가 큽니다. 젖산이 빨리 빠지는 것과 다음 날 잘 뛰는 것은 같은 말이 아닙니다.</Note>
        <Evidence n={3}>
          <p>
            운동 직후 혈중 젖산은 가볍게 움직이는 회복이 가만히 쉬는 것보다 빠르게 낮췄을 가능성이 있습니다(한국체육과학회지
            메타분석). <S>(이재엽 외 (2024) <Up h="https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003059778" />)</S>
          </p>
          <p>
            같은 방향으로, 운동 직후 가벼운 쿨다운이 혈중 젖산을 더 빨리 낮춘다는 리뷰가 있습니다 — 근육 속 젖산까지는 아닙니다.{" "}
            <S>(Van Hooren &amp; Peake (2018) <Up h="https://pubmed.ncbi.nlm.nih.gov/29663142/" />)</S>
          </p>
          <p>
            인터벌 세트 사이에 쉬느냐 가볍게 움직이느냐를 본 고찰에서, 3주 이상 훈련 프로그램의 체력 향상은 회복 방식에 따른
            차이가 확인되지 않았습니다. <S>(Zouhal et al. (2024) <Up h="https://doi.org/10.1186/s40798-024-00673-0" />)</S>
          </p>
        </Evidence>

        {/* ── ② ─────────────────────────────────────────── */}
        <h2 id="what-to-do" className={H2}>
          쉬는 날 뭘 하면 좋을까
        </h2>
        <P>
          핵심은 <strong>숨이 차지 않는 강도</strong>입니다. 달리기는 하지 않습니다.
        </P>
        {/* 2026-09-14: 「① → ② → ③」이 한 문단이던 것을 목록으로. 문구는 유지. */}
        <Todo
          basis="rule"
          items={[
            <><strong>빠른 걷기 20~30분</strong> — 대화가 가능한 속도로</>,
            <><strong>수영</strong> 또는 아쿠아 조깅</>,
            <><strong>자전거</strong> 가볍게 타기</>,
            <><strong>요가</strong> 또는 필라테스</>,
          ]}
        />
        <P className="text-sm text-gray-500">저희 기준입니다. 연구로 정해진 강도는 아닙니다.</P>

        {/* ── ③ ─────────────────────────────────────────── */}
        {/**
         * ⚠️ 2026-09-14 — **이 박스의 숫자에 출처가 없다.**
         * Meeusen 2013(오버트레이닝 국제 합의문) 초록에는 **bpm·일수·개수 기준이 하나도 없다.**
         * 신호 자체(피로·수면·심박수·의욕)는 합의문이 서술하는 방향과 맞으므로 남기고,
         * **정밀해 보이는 임계값만 뺐다.** 대신 "평소 내 값과 비교하라"로 바꿨다.
         */}
        <h2 id="full-rest" className={H2}>
          이럴 땐 완전히 쉬세요 — 오버트레이닝 신호
        </h2>
        <Warn title="아래가 여러 개 겹쳐서 나타나면 오버트레이닝 신호로 봅니다">
          <ul className="list-disc space-y-1 pl-5">
            <li>쉬어도 풀리지 않는 극심한 피로</li>
            <li>이유 없이 기록이 떨어진다</li>
            <li>달리기 의욕이 사라지고 기분이 평소와 다르다</li>
            <li>잠이 평소와 다르다 (저희 제안 — 아래 합의문 초록에는 없는 항목)</li>
          </ul>
          {/* 2026-10-06: 「가벼운 활동도 하지 마세요」를 뺐다. 같은 인용(박찬호·곽이섭 2013) 초록은
              크로스트레이닝도 효과적이라고 적는다 — 인용과 반대 방향의 금지였다. */}
          <p className="mt-2">
            이때는 <strong>48~72시간 이상</strong> 달리기를 쉬는 쪽이 낫습니다(과도한 훈련 뒤 휴식에 대한 국내 논문의 일반 권고).
            피로가 몇 주씩 이어지면 진료를 받아 보세요(저희 제안).
          </p>
        </Warn>
        <P>
          평소에도 <strong>주 1일 이상</strong>은 쉬는 날로 두세요(같은 국내 논문의 일반 권고).
        </P>
        {/* 2026-09-15: "며칠"이라고만 적었던 자리에 근거가 생겼다.
            박찬호·곽이섭 (2013) 코칭능력개발지 — 과도한 훈련 후 48~72시간 이상 휴식, 주 1일 이상 휴식.
            ⚠️ 같은 논문에 **안정시 심박수 기준은 없다.** 검색하면 "분당 5회"가 이 논문에
            붙어 나오는데 초록에 그런 문장이 없다. 그래서 위 목록에서 숫자를 뺀 채로 둔다. */}
        <Note>
          &ldquo;몇 bpm부터&rdquo; 같은 숫자 기준은 오버트레이닝 국제 합의문(Meeusen 2013) 초록에 나오지 않습니다. 위 48~72시간도
          합의문이 정한 기준이 아니라 국내 논문 한 편(박찬호·곽이섭 2013)의 일반 권고입니다.
        </Note>

        <h3 className={H3}>아침 심박수로 알 수 있나요?</h3>
        <P>
          평소보다 높은 날이 이어질 수도 있지만, <strong>이것 하나로는 판단할 수 없습니다.</strong> 다른 신호와 함께 봐야
          합니다.
          <Basis kind="paper" />
        </P>
        <P>심박은 평소 자기 값을 알고 있어야 비교가 됩니다.</P>
        <Note>경쟁 선수를 모은 연구입니다.</Note>
        <Evidence n={1}>
          <p>
            경쟁 선수를 모은 메타분석에서 2주 미만 훈련량을 늘렸을 때 안정시 심박은 중간 정도 올랐지만, 더 긴 과부하에서는 안정시
            값이 변하지 않았습니다. 변화 폭이 하루하루의 변동 안에 들 수 있어 다른 신호와 함께 봐야 한다고 결론 냈습니다.{" "}
            <S>(Bosquet et al. (2008) <Up h="https://pubmed.ncbi.nlm.nih.gov/18308872/" />)</S>
          </p>
        </Evidence>

        {/* 2026-10-06: 영상 0개인데 「실제 영상 링크입니다」 문구만 뜨던 빈 섹션을 뺐다. */}

        <div className="mt-14">
          <FaqSection items={[
            {
              q: "휴식일에는 완전히 쉬는 게 좋나요?",
              a: "둘 중 하나가 낫다고 말할 만한 근거가 약합니다. 휴식일 자체를 비교한 연구는 저희가 찾지 못했고, 가까운 연구(Zouhal 2024)는 인터벌 세트 사이에 쉬느냐 가볍게 움직이느냐를 비교해 체력 향상에서 차이를 확인하지 못했습니다. 몸이 뻣뻣하면 20~30분 걷는 정도로 가볍게 움직여도 되고, 완전히 쉬어도 됩니다. 다만 숨이 찰 정도면 휴식이라 보기 어렵습니다(저희 제안).",
            },
            {
              q: "휴식일에 어떤 활동을 하면 좋나요?",
              a: "① 20~30분 빠른 걷기(대화 가능한 속도) ② 수영 또는 아쿠아 조깅 ③ 가벼운 자전거 ④ 요가·필라테스. 핵심은 숨이 차지 않는 강도이며, 달리기는 하지 않습니다(저희 기준).",
            },
            {
              q: "완전 휴식이 필요한 신호는 무엇인가요?",
              a: "피로가 쉬어도 풀리지 않고, 기록이 이유 없이 떨어지고, 기분이 평소와 다르면 의심해 볼 신호입니다. 오버트레이닝 국제 합의문(Meeusen 2013)은 이를 확정하는 단일 지표가 없다고 봅니다 — 그래서 저희도 「몇 bpm」, 「몇 개 중 몇 개」 같은 기준을 적지 않습니다. 안정시 심박도 단독으로는 판단하기 어렵다는 메타분석이 있습니다(Bosquet 2008). 이럴 땐 48~72시간 이상 달리기를 쉬는 쪽이 낫다는 국내 논문의 일반 권고가 있고(박찬호·곽이섭 2013), 피로가 몇 주씩 이어지면 진료를 받아 보세요(저희 제안).",
            },
          ]} />
        </div>

        <div className="mt-10 rounded-2xl bg-emerald-50 p-6">
          <p className="mb-2 font-medium text-emerald-900">내 발에 맞는 러닝화를 찾으세요</p>
          <Link href="/shoe-finder" className="inline-block rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
            나에게 맞는 신발 찾기 →
          </Link>
        </div>

        <References n={7} title="참고 자료" note="2026-10-08 PubMed 초록과 대조했습니다.">
          <ul className="space-y-2 text-sm">
            {/* 2026-09-15 추가 — 한국어 메타분석. 8/31에 내린 자리를 이걸로 채웠다. */}
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003059778" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                이재엽·노기웅·박석 (2024) 한국체육과학회지 33(1):533-543 — 회복 방법에 따른 혈중 젖산 감소 체계적 문헌고찰·메타분석(2003~2023, 8편). 효과크기 마사지 −4.00 &gt; 동적 회복 −3.37 &gt; 정적 회복 −1.60. <strong>지표는 젖산 하나이고 연구 간 이질성이 큽니다(I² 69~88%)</strong> ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><span className="text-gray-500">능동회복 관련 자료 1건 — 검증기가 무관한 논문을 가리키는 것을 확인해 링크를 내렸습니다 (2026-08-31)</span></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://doi.org/10.1186/s40798-024-00673-0" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Zouhal et al. (2024) Sports Med Open 10(1):21 — 장기(3주 이상) 인터벌 훈련에서 능동회복과 수동휴식의 체력 향상 효과 차이가 확인되지 않았다는 체계적 고찰 ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://pubmed.ncbi.nlm.nih.gov/23247672/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Meeusen et al. (2013) MSSE 45(1):186-205 — 오버트레이닝 증후군 국제 합의문. 피로·수행 저하·기분 변화를 꼽고, 일반적으로 인정되는 단일 지표는 없다고 봄. <strong>심박수·일수 같은 수치 기준은 초록에 없습니다</strong> ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Bosquet et al. (2008)</strong> — 경쟁 선수 대상 심박·심박변이도 메타분석. 단기 과부하 안정시 심박 SMD 0.55 상승, 장기 과부하 안정시 값 변화 없음. Br J Sports Med 42(9):709-14. <a href="https://pubmed.ncbi.nlm.nih.gov/18308872/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Van Hooren &amp; Peake (2018)</strong> — 쿨다운 서술적 리뷰. 능동 쿨다운은 혈중 젖산 회복을 앞당기지만 근육 속 젖산은 아님, 회복 지표 대부분은 개선 못 함. Sports Med 48(7):1575-95. <a href="https://pubmed.ncbi.nlm.nih.gov/29663142/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            {/* 2026-09-15 추가 — 휴식 기간에 처음으로 근거가 붙었다. */}
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART001759970" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                박찬호·곽이섭 (2013) 코칭능력개발지 15(1):91-97 — 과도한 훈련 후 48~72시간 이상 휴식, 주 1일 이상 휴식 권고 ↗
              </a>
            </li>
          </ul>
          <p className="mt-3 text-xs text-gray-400">추천 순서는 광고비로 바뀌지 않습니다. 공개된 연구 자료를 근거로 작성했습니다.</p>
        </References>
        <p className="mt-6 text-xs text-gray-400">※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 통증이 지속되면 전문의 상담을 권장합니다.</p>
      </article>
    </>
  );
}
