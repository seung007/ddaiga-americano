import type { Metadata } from "next";
import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, H3, Num, KeyPoints, Steps, OneLine, Caveat, Warn, Sources, Src, Ref } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

/**
 * 발뒤꿈치·발바닥 통증 — 아파서 찾아온 사람이 읽는 글
 *
 * 2026-10-07 재검증 — 고친 것
 *   · 「스테로이드 주사 … 지방패드 위축 위험이 보고」: 174명 코호트(Hansen 2018)에서 초음파 유도 주사군의 지방패드 두께는
 *     주사 안 맞은 군과 차이가 없었다. Cochrane(David 2017)은 1개월까지 통증을 약간 줄이고 그 뒤로는 차이가 없었다고 정리한다.
 *   · 「대부분 좋아지지만」: 병원 진단 174명 코호트에서 1년 뒤에도 80.5%, 10년 뒤에도 45.6%가 증상이 있었다. 「대부분」을 뺐다.
 *   · 「2주 해보고 갈아타는 것이 가장 흔한 실수」: 근거 없음. 뺐다.
 *   · 「BMI 관련성은 운동하는 사람에게서 약해진다고 알려져」: 출처가 없었다 → van Leeuwen 2016 메타분석으로 출처를 달았다.
 *   · Nielsen 2014 링크가 journals.plos.org 형식이라 인용 검사기에 안 잡혔다 → PubMed 링크로.
 *
 * 2026-11-18 확정 틀로 바꿈 (AGENTS.md 「가이드 글 틀 — 2026-11-18 확정」, 견본 app/injury/start-running/page.tsx)
 *   · 말투 「~니다」 → 「~요」. 날짜 한 줄 · 3줄 요약 · 번호 붙은 큰 질문 5개 · 절 끝 한 줄 요약 · 글 끝 접힌 「근거와 출처」 7편.
 *     옛 부품 여섯 개(머리 요약 상자 · 근거 접힘 상자 · 근거 수준 딱지 · 별표 단서 줄 · 글 끝 문헌 목록 · 질문 입력창과 공유 단추)를 걷어냈다.
 *     (옛 부품 이름을 주석에 그대로 적으면 check:geo 가 글에 남은 것으로 세므로 풀어서 적는다.)
 *   · 제목 아래 「협찬 없이 작성」 띠를 뺐다 — 같은 내용이 글 끝 글쓴이 소개에 있고 첫 화면을 차지했다
 *   · 큰 절 6개(병원 신호 · 염증이 아니다 · 누가 걸리나 · 뭘 하면 낫나 · 주사 · 얼마나) → 번호 붙은 큰 질문 5개로 다시 짰다:
 *     병원 신호 / 뭘 하면 줄어드나 / 계속 뛰어도 되나 / 주사 / 얼마나 걸리나. 「염증이 아니라 퇴행」은 설명만 하는 절이었어서
 *     할 일 절(2번) 안의 두 문장으로 내렸고, 위험 요인은 할 일로 이어지지 않아 FAQ 로 내렸다 — 「할 일이 먼저, 이유는 뒤」.
 *   · id 는 red-flags·what-works·injection·how-long 을 그대로 두고 run-or-rest 를 더했다. 다른 글이 이 글의 #id 를 거는 곳은 없다
 *     (grep -rn "plantar-fasciitis#" app lib components → 0건, 2026-11-18 확인).
 *   · 빵부스러기(구조화 데이터) 이름을 「족저근막염」에서 「발뒤꿈치 통증」으로 바꿨다 — 본문 첫 등장 전에 전문어가 나와
 *     풀이 검사를 통과할 수 없는 자리였고, 글 자체가 「염증이 아니다」를 설명하므로 증상 이름이 더 맞다
 *   · 안전 정보는 접지 않는다는 규칙을 유지했다 — 병원에 가야 할 신호는 빨간 주의 상자에 그대로 있다
 *
 *   고친 것 — 주장을 초록으로 다시 판정한 결과 (QxMD read.qxmd.com/read/<PMID>, 2026-11-18 직접 열어 대조)
 *   · **「통증 점수를 기준으로 거리를 조절하는 방법은 부상 후 복귀 글에 있다」는 안내를 뺐다.** 그 글이 2026-11-18 에
 *     0~2 / 2~5 / 5 초과 구간을 지웠다(Ullern 2025 초록에 그 구간이 없다). 가리키는 내용이 사라진 안내였다.
 *     점수 없는 기준(달리는 중에 아픔이 커지는가 · 다음 날 아침에 더 아픈가 · 쉬는데도 나아지는 느낌이 없나)으로 바꿨고,
 *     **대체 숫자를 만들지 않았다.** knee-pain·return-to-running 이 쓰는 표준 문구와 같다.
 *     복귀 글 링크는 성격을 바꿔 남겼다 — 「다른 곳을 다쳐 쉬었다가 돌아오는 중이라면」(knee-pain 선례).
 *   · **Koc 2023(미국 물리치료학회 발뒤꿈치 통증 진료지침 2023 개정)을 출처에서 내렸다.** 초록에 권고 내용이 없고
 *     (「비관절성 발뒤꿈치 통증에 대한 권고를 만들었다」까지만 적혀 있다) 본문은 2026-10-07 에도 오늘도 열지 못했다.
 *     날짜 줄이 「연구 N편과 하나씩 대조」라서 대조하지 못한 자료를 세면 숫자가 어긋난다. 「지침이 스트레칭을 권고한다」는
 *     문장도 같이 뺐고, **대체 주장을 만들지 않았다.** 스트레칭 이야기는 Rathleff 2015 가 직접 비교한 결과로만 적었다.
 *     (서지는 이번에 확인됐다: J Orthop Sports Phys Ther 53(12):CPG1-CPG39, PMID 38037331. 본문을 열면 되살릴 수 있다.)
 *   · **주사 효과의 세기를 초록에 맞췄다.** 「1개월까지 통증을 약간 줄였다」는 맞지만, 그 차이(0~100점에서 평균 6.38점)가
 *     리뷰 저자들이 임상적으로 의미 있다고 본 8점보다 작았다는 서술이 빠져 있었다. 그 문장을 넣었다 — 숫자를 지운 것이 아니다.
 *   · **Nielsen 2014 의 「5%」에 분모와 나라를 문장에 넣었다** — 「달리기를 처음 시작한 덴마크 성인 933명 중 다친 254명에서」.
 *     수치 자체는 이번에 초록에서 다시 확인했다. 「덴마크」는 초록에 없고 저장소가 DANO-RUN 코호트라고 써 온 표현이라
 *     이 글 안에서만 쓰고 여러 글이 함께 쓰는 데이터에는 보태지 않았다(knee-pain 선례).
 *   · **발목 오즈비 23.3 을 본문에서 내렸다** — 신뢰구간 4.3~124.4 로 범위가 지나치게 넓다. 출처 항목에 구간과 함께 남겼고,
 *     본문·FAQ 에서는 「관련이 있었지만 범위가 매우 넓은 수치였어요」까지만 적었다.
 *   · **신발·깔창은 판정을 넘지 않았다.** 「쿠션·뒤꿈치 높이가 낫게 한다는 근거를 찾지 못했다」(근거 없음)와
 *     「발·발목의 모양·기능이 원인이라는 통념은 근거가 부족했다」(van Leeuwen 2016, 51편)까지만 쓰고,
 *     **회내 제어화로 넓히지 않았다** — 연구가 갈리는 지점이라 평발 글이 맡는다. 깔창은 Rathleff 2015 에서 두 쪽 모두 썼으므로
 *     그 시험으로는 깔창의 효과를 가를 수 없다고 단서에 적었다.
 *   · 한 연구에 기댄 단정문의 세기를 낮췄다: Rathleff(한 무작위 시험) · Lemont(한 조직 연구, 수술까지 간 만성 사례) ·
 *     Riddle(한 환자-대조군 연구) · Hansen(병원까지 온 사람들의 자료)에 대상을 문장에 넣었다.
 *   · 운동 횟수·세트 수는 초록에 없어서 쓰지 않았다(지어내지 않는다). 「석 달」은 Rathleff 2015 의 1차 평가 시점에서 가져온
 *     저희 기준이라고 문장에 드러냈다.
 *
 *   확인한 초록 (2026-11-18, 직접 열어서 대조)
 *   · Rathleff 2015 — 초음파로 확인된 48명 무작위 배정. 3개월 발 기능 지수 29점 차(95% CI 6~52, P=0.016), 1·6·12개월 차이 없음(P>0.34).
 *     근력 쪽: 깔창 + 이틀에 한 번 수건을 발가락 밑에 넣고 한 발 뒤꿈치 들기. 비교 쪽: 깔창 + 매일 족저근막 스트레칭. 세트·횟수는 초록에 없음
 *   · Hansen 2018 — 269명 중 174명 추적(여 91·남 83). 증상 잔존 위험 1년 80.5% · 5년 50.0% · 10년 45.6% · 15년 44.0%.
 *     없어진 사람도 평균 725일. 여성(P<.01)·양쪽(P<.01) 예후 나쁨. 근막 두께(P=.49)·뒤꿈치 뼈 돌기(P=.88)는 관계 없음.
 *     초음파 유도 스테로이드 주사군 지방패드 9.0mm 대 비주사군 9.4mm(P=.66)
 *   · David 2017 — 코크런, 39편(RCT 36·준RCT 3) 2,492명. 위약·무치료 대비 1개월까지 0~100 척도 평균차 −6.38(−11.13~−1.64, 5편 350명),
 *     저자들이 최소 중요 차이로 본 8점보다 작음. 1~6개월 −3.47(−8.43~1.48, 6편 382명). 둘 다 확실성 낮음.
 *     주사군 699명(21편)에서 족저근막 파열 2건·주사 자리 감염 3건, 보고가 선택적이라 더 높은 위험 배제 불가
 *   · Lemont 2003 — 뒤꿈치 뼈 돌기 수술 50례 조직. 점액성 변화와 조각남, 골수 혈관 확장. 염증 없음 → 퇴행으로 봐야 한다는 결론
 *   · Riddle 2003 — 한쪽 족저근막염 50명 대 나이·성별 맞춘 대조군 100명. 발등쪽 굽힘 0도 이하 대 10도 초과 오즈비 23.3(4.3~124.4),
 *     체질량지수 30 초과 대 25 이하 5.6(1.9~16.6), 하루 대부분 서서 일하기 3.6(1.3~10.1)
 *   · van Leeuwen 2016 — 51편(전향 1·환자-대조군 46·횡단면 4), 변수 104개 중 12개 통합. 유의한 임상 요인은 높은 체질량지수뿐
 *     (27 초과 오즈비 3.7, 2.93~5.62), 운동 안 하는 하위군에서 가장 강함. 발·발목 기능 측정치 통념은 근거 없음
 *   · Nielsen 2014 PLOS ONE — 초보 933명 코호트(DANO-RUN)의 다친 254명: 정강이 15% · 무릎 앞 10% · 내측 반월판 9% ·
 *     아킬레스 7% · 족저근막 5%. 회복한 220명(87%) 회복 기간 중앙값 71일(9~617일). 초록에 나라 표기는 없음
 */

const PAGE_URL = pageUrl("/injury/plantar-fasciitis");
const TITLE = "족저근막염, 뭘 하면 낫고 얼마나 걸리나요?";
const DESC =
  "아침 첫 걸음에 발뒤꿈치가 아프다면, 스트레칭보다 3개월 시점에 더 나았던 고부하 근력 운동과 주사의 실제 효과, 생각보다 긴 회복 기간을 다룹니다.";

export const metadata: Metadata = {
  title: "족저근막염, 뭘 하면 낫고 얼마나 걸리나요? | 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/plantar-fasciitis" },
};

const FAQ: FaqItem[] = [
  {
    q: "아침 첫발이 아픈데 족저근막염인가요?",
    a: "가장 전형적인 모습이에요. 족저근막은 발바닥을 받치는 단단한 막이에요. 아침 첫 몇 걸음이 가장 아프고 걷다 보면 풀리는 편이에요. 다만 **양쪽이 같이 아프거나, 저리거나, 쉬어도 계속 아프면** 병원에서 확인하세요.",
  },
  {
    q: "족저근막염은 왜 생기나요?",
    a: "원인이 하나로 정리되지 않았어요. 족저근막은 발바닥을 받치는 단단한 막이에요. 여러 연구에서 꾸준히 관련이 나온 것은 **체질량지수(BMI)가 높은 것**뿐이었어요. 초보 러너가 가장 많이 다치는 곳은 아니에요.",
  },
  {
    q: "족저근막염에 좋은 러닝화가 따로 있나요?",
    a: "따로 없어요. 족저근막은 발바닥을 받치는 단단한 막이에요. 두꺼운 쿠션이나 높은 뒤꿈치가 이 통증을 낫게 한다는 연구는 찾지 못했어요. **편한 신발**이 통증을 견디는 데 도움이 될 수는 있지만 치료는 아니에요.",
  },
  {
    q: "양쪽 발이 다 아프면 더 오래 가나요?",
    a: "그런 경향이 있었어요. 진단받은 사람들을 길게 따라간 연구에서 양쪽 발뒤꿈치가 아픈 사람의 회복이 더 나빴어요. 양쪽이 같이 아프면 다른 원인도 있을 수 있어서 **병원에서 한 번 확인**하길 권해요.",
  },
];

const pill = "rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400";

export default function Page() {
  return (
    <>
      {/* 최초 게시일은 저장소 기록으로 확인되지 않아 비워 둔다(지어내지 않는다). */}
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["발뒤꿈치 통증", "/injury/plantar-fasciitis"],
        ]}
      />
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">부상 부위</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/plantar-fasciitis" compact checked={7} />

        <KeyPoints
          items={[
            <>수건을 발가락 밑에 깔고 <strong>한 발로 뒤꿈치를 천천히 드는 운동</strong>을 이틀에 한 번 해 보세요.</>,
            <>몇 주로는 판단이 안 돼요. 한 가지 방법을 <strong>3개월은 이어 가길 권해요.</strong></>,
            <>주사는 한 달쯤까지만 통증을 조금 줄였어요. 신발을 바꿔서 낫지는 않아요.</>,
          ]}
        />

        <Lead>
          아침에 침대에서 내려와 딛는 첫 걸음이 가장 아프고, 좀 걷다 보면 풀렸다가 오래 서 있으면 다시 아파지나요.
          족저근막은 발뒤꿈치뼈에서 발가락 쪽으로 발바닥을 받치는 단단한 막이에요.
        </Lead>

        <TableOfContents
          items={[
            { id: "red-flags", label: "병원에 먼저 가야 할 때" },
            { id: "what-works", label: "뭘 하면 줄어드나요?" },
            { id: "run-or-rest", label: "계속 뛰어도 되나요?" },
            { id: "injection", label: "주사 맞으면 낫나요?" },
            { id: "how-long", label: "얼마나 걸리나요?" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="red-flags" className={H2}>
          <Num n={1} />어떤 때 병원에 먼저 가야 하나요?
        </h2>
        <P>
          발뒤꿈치가 아프다고 모두 족저근막 문제는 아니에요. 아래 신호가 하나라도 있으면 <strong>운동을 시작하기 전에 진료를 받으세요.</strong>
        </P>
        <Warn title="아래에 하나라도 해당하면 진료를 먼저 받으세요">
          <ul className="list-disc space-y-1 pl-5">
            <li>양쪽 발뒤꿈치가 같이 아프다, 특히 젊은 나이에 그렇다</li>
            <li>발바닥이 저리거나 타는 듯하다, 또는 감각이 둔하다</li>
            <li>뒤꿈치를 양옆에서 눌렀을 때 아프거나, 쉬어도 계속 아프다</li>
            <li>다치고 나서 갑자기 시작됐다</li>
            <li>열이 나거나 붉게 붓는다</li>
          </ul>
        </Warn>
        <Caveat>
          이 목록은 진단 기준이 아니라, 다른 원인을 놓치지 않으려고 저희가 보수적으로 정한 기준이에요. 아래 할 일은 이런 신호가 없을 때
          하는 거예요. 이 글로 자가진단하지 마세요.
        </Caveat>
        <P>
          양옆에서 눌러 아픈 것은 뒤꿈치뼈에 금(피로골절)이 갔을 때도 나오는 신호라 저희는 진료를 권해요. 양쪽이 같이 아프거나 저린
          느낌이 있을 때도 발바닥 말고 다른 곳이 원인일 수 있어요.
        </P>

        <OneLine>양쪽이 같이 아프거나 쉴 때도 아프면, 운동보다 진료가 먼저예요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="what-works" className={H2}>
          <Num n={2} />뭘 하면 통증이 줄어드나요?
        </h2>
        <P>
          <strong>수건을 발가락 밑에 깔고 한 발로 뒤꿈치를 천천히 드는 운동</strong>을 이틀에 한 번 해 보세요. 초음파로 확인된 환자
          48명을 두 쪽으로 나눈 한 무작위 시험에서, 이 운동을 한 쪽이 <strong>3개월 시점</strong>에 매일 스트레칭한 쪽보다 발 기능이
          좋았어요.
        </P>
        <Steps
          title="시험에서 근력 운동 쪽이 한 방법"
          items={[
            { t: "발가락 밑에 수건을 말아 넣어요.", d: "발가락이 살짝 들린 상태에서 시작해요." },
            { t: "한 발로 서서 뒤꿈치를 천천히 들었다 내려요." },
            { t: "이틀에 한 번 해요.", d: "비교한 쪽은 매일 족저근막 스트레칭을 했어요." },
          ]}
        />
        <Caveat>
          횟수와 세트 수는 초록에 없어서 옮기지 않았어요. 두 쪽 모두 깔창을 함께 썼기 때문에, 이 시험만으로는 깔창이 얼마나 도움이
          됐는지 가를 수 없어요.
        </Caveat>
        <P>
          차이는 3개월 시점에만 났고, 1개월·6개월·12개월 시점에는 없었어요. 회복을 앞당기는 쪽이지, 마지막 결과를 바꾸는 쪽은 아니었어요.
        </P>
        <P>
          수술까지 간 만성 사례 50건의 조직을 본 한 연구에서는 염증 세포가 아니라 근막이 닳고 조각난 변화가 보였어요. 그래서 염증을
          가라앉히는 치료만으로는 부족할 수 있어요.
        </P>

        <h3 className={H3}>스트레칭도 12개월 시점에는 같은 수준까지 좋아졌어요</h3>
        <P>
          같은 시험에서 매일 스트레칭한 쪽도 12개월 시점에는 근력 운동 쪽과 비슷해졌어요. 지금 스트레칭을 하고 있다면 그대로 해도 되고,
          통증을 더 빨리 줄이고 싶다면 위 근력 운동 쪽을 권해요.
        </P>

        <h3 className={H3}>신발이나 깔창을 바꿔서 낫지는 않아요</h3>
        <P>
          쿠션이 두껍거나 뒤꿈치가 높은 신발이 이 통증을 낫게 한다는 근거는 찾지 못했어요. 발과 발목의 모양·기능이 원인이라는 통념도
          연구 51편을 모아 보니 근거가 부족했어요. 신발은 <strong>발볼과 사이즈가 맞는지</strong>만 보세요.
        </P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/wide-foot" className={pill}>신발에 발볼이 눌린다면 →</Link>
          <Link href="/injury/flat-feet" className={pill}>발 아치가 낮은 편이라면 →</Link>
        </div>

        <OneLine>수건을 깔고 한 발로 뒤꿈치 드는 운동을 이틀에 한 번 해 보세요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="run-or-rest" className={H2}>
          <Num n={3} />아픈데 계속 뛰어도 되나요?
        </h2>
        <P>
          발바닥만 두고 계속 달린 쪽과 쉰 쪽을 비교한 시험은 찾지 못했어요. 그래서 아래는 저희가 정한 기준이에요.
        </P>
        <Steps
          title="저희가 권하는 기준"
          items={[
            { t: "달리는 중에 아픔이 커지면 그날은 멈춰요." },
            { t: "다음 날 아침이 전날보다 더 아프면 다음에는 거리를 줄여요." },
            { t: "쉬는데도 나아지는 느낌이 없으면 진료를 받아요." },
          ]}
        />
        <Caveat>연구로 비교된 적이 없는 기준이라 숫자로 끊지 않았어요.</Caveat>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/injury/return-to-running" className={pill}>다른 곳을 다쳐 쉬었다가 돌아오는 중이라면 →</Link>
        </div>

        <OneLine>아픔이 커지면 그날은 멈추고, 다음 날 아침에 더 아프면 거리를 줄여요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="injection" className={H2}>
          <Num n={4} />주사 맞으면 낫나요?
        </h2>
        <P>
          스테로이드 주사는 <strong>한 달쯤까지만</strong> 통증을 조금 줄였어요. 무작위 시험 39편을 모은 한 코크런 리뷰에서 그 차이는
          리뷰 저자들이 의미 있다고 본 기준보다 작았고, 1~6개월에는 차이가 없었어요. 두 결과 모두 확실성이 낮다고 평가됐어요.
        </P>
        <P>
          같은 리뷰에서 족저근막 파열과 주사 자리 감염이 보고됐어요. 부작용 보고가 부실해 더 높은 위험을 배제할 수 없다고도 했어요.
        </P>
        <P>
          뒤꿈치 지방패드가 얇아진다는 걱정은 한 장기 추적 연구에서는 확인되지 않았어요. 초음파로 보며 주사한 사람과 안 맞은 사람의
          두께가 비슷했어요.
        </P>
        <P>
          <strong>맞을지는 의사와 상의하세요.</strong>
        </P>

        <OneLine>주사는 한 달쯤까지만 조금 도움이 됐어요. 맞을지는 진료에서 정해요.</OneLine>

        {/* ── 5 ─────────────────────────────────────────── */}
        <h2 id="how-long" className={H2}>
          <Num n={5} />얼마나 걸려야 낫나요?
        </h2>
        <P>
          <strong>몇 주로는 판단하지 마세요.</strong> 병원에서 진단받은 174명을 길게 따라간 한 연구에서 증상이 남아 있을 위험은 1년 뒤
          <strong> 80.5%</strong>, 10년 뒤 <strong>45.6%</strong>였어요. 증상이 사라진 사람도 평균 <strong>725일</strong>이 걸렸어요.
        </P>
        <Caveat>병원까지 온 사람들의 자료라 가벼운 사례보다 길게 나왔을 수 있어요.</Caveat>
        <P>
          그래서 한 가지 방법을 <strong>3개월은 이어 가길 권해요.</strong> 3개월은 위 근력 운동 시험이 첫 평가를 한 시점에서 가져온
          저희 기준이에요.
        </P>

        <OneLine>몇 주 해 보고 포기하지 말고, 한 가지 방법을 3개월은 이어 가요.</OneLine>

        <FinderCta
          from="plantar-fasciitis"
          variant="inline"
          headline="신발로 발바닥 통증이 낫지는 않아요. 발볼과 사이즈가 맞는지부터 보세요."
        />

        <div className="mt-14">
          <YoutubeSection links={[
            // 2026-08-31: 검색 URL을 실제 영상으로 교체.
            // channel은 npm run check:youtube 가 확인해준 이름만 적는다 — 짐작으로 채우는 것이 이 저장소에서 40건 오류를 만든 원인이다.
            { label: "발뒤꿈치 통증 대표 질환 족저근막염 — 환자 맞춤 자가 운동법", channel: "세림병원", url: "https://www.youtube.com/watch?v=-y9BZ3qE1vE" },
            { label: "족저근막염 재활 운동", channel: "헬스조선 Health Chosun", url: "https://www.youtube.com/watch?v=sQ1IdjdZkxk" },
          ]} />

          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Rathleff et al. (2015)</strong> 초음파로 확인된 환자 48명을 나눴더니, 이틀에 한 번 고부하 근력 운동을 한 쪽의 발 기능 지수가 3개월 시점에 29점 더 좋았어요(95% 신뢰구간 6~52, P=0.016). 1·6·12개월에는 차이가 없었어요. 두 쪽 모두 깔창을 썼고, 비교한 쪽은 매일 족저근막 스트레칭을 했어요.
            <Ref>Scand J Med Sci Sports 25(3):e292-300 · <a href="https://pubmed.ncbi.nlm.nih.gov/25145882/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Hansen et al. (2018)</strong> 진단받은 174명을 5~15년 추적했더니 증상이 남아 있을 위험이 1년 뒤 80.5%, 5년 뒤 50.0%, 10년 뒤 45.6%였어요. 증상이 사라진 사람도 평균 725일이 걸렸고, 여성과 양쪽 발이 아픈 사람의 예후가 나빴어요. 초음파로 보며 주사한 사람과 안 맞은 사람의 지방패드 두께는 9.0mm 대 9.4mm 였어요.
            <Ref>Orthop J Sports Med 6(3):2325967118757983 · <a href="https://pubmed.ncbi.nlm.nih.gov/29536022/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>David et al. (2017)</strong> 무작위 시험 39편 2,492명을 모은 코크런 리뷰예요. 스테로이드 주사는 한 달까지 통증을 조금 줄였지만(0~100점에서 평균 6.38점) 저자들이 의미 있다고 본 8점보다 작았고, 1~6개월에는 차이가 없었어요. 주사를 맞은 699명 중 파열 2건·감염 3건이 보고됐어요.
            <Ref>Cochrane Database Syst Rev 6:CD009348 · <a href="https://pubmed.ncbi.nlm.nih.gov/28602048/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Lemont et al. (2003)</strong> 수술까지 간 만성 사례 50건의 조직에서 염증 세포가 아니라 근막이 닳고 조각난 변화가 보였어요. 저자들은 염증이 아닌 퇴행으로 봐야 한다고 결론 냈어요.
            <Ref>J Am Podiatr Med Assoc 93(3):234-7 · <a href="https://pubmed.ncbi.nlm.nih.gov/12756315/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Riddle et al. (2003)</strong> 한쪽만 아픈 환자 50명과 나이·성별을 맞춘 대조군 100명을 비교했어요. 발목이 0도 이하로만 꺾이는 사람의 오즈비는 23.3(95% 신뢰구간 4.3~124.4)으로 범위가 매우 넓었고, 체질량지수 30 초과는 5.6(1.9~16.6), 하루 대부분 서서 일하기는 3.6(1.3~10.1)이었어요.
            <Ref>J Bone Joint Surg Am 85(5):872-7 · <a href="https://pubmed.ncbi.nlm.nih.gov/12728038/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={6}>
            <strong>van Leeuwen et al. (2016)</strong> 연구 51편을 모아 보니 꾸준히 관련이 나온 임상 요인은 높은 체질량지수뿐이었어요(27 초과에서 오즈비 3.7, 95% 신뢰구간 2.93~5.62). 그 관련은 운동하지 않는 쪽에서 가장 강했고, 발과 발목 기능 측정치가 원인이라는 통념은 근거가 부족했어요.
            <Ref>Br J Sports Med 50(16):972-81 · <a href="https://pubmed.ncbi.nlm.nih.gov/26644427/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={7}>
            <strong>Nielsen et al. (2014)</strong> 달리기를 처음 시작한 덴마크 성인 933명 중 다친 254명을 보니 발바닥 통증이 약 5%였어요(정강이 15%, 무릎 앞 10%). 회복한 220명의 회복 기간 중앙값은 71일이었어요.
            <Ref>PLOS ONE 9(6):e99877 · <a href="https://pubmed.ncbi.nlm.nih.gov/24923269/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
