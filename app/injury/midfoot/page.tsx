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
 * 2026-11-23 본문에 남아 있던 연구 인원(러너 N명)을 뺐다 — 인원은 접힌 출처에만(가이드 틀 「연구 대상·인원·나라는 접힌 출처에만」). 주장·숫자는 그대로
 *
 * 착지 방식 — 뒤꿈치로 닿는 게 잘못된 건지 신경 쓰여서 찾아온 사람이 읽는 글
 *
 * 2026-10-08 재검증 — 「착지 위치가 더 중요」 단정 삭제 · 「억지로 바꾸면 아킬레스가 아프다」를 부하 증가로 낮춤 ·
 *   「퍽 소리 = 발이 몸 앞」 삭제(반대 근거) · 「2023년 기준 연구들」·「보폭이 길지 않으면 부상률 차이 없음」 삭제(근거 못 찾음)
 *
 * 2026-11-18 확정 틀로 바꿈 (AGENTS.md 「가이드 글 틀 — 2026-11-18 확정」, 견본 app/injury/start-running/page.tsx)
 *   말투 「~니다」 → 「~요」. 날짜 한 줄 · 3줄 요약 · 번호 붙은 큰 질문 4개 · 절 끝 한 줄 요약 · 글 끝 접힌 「근거와 출처」 11편.
 *   걷어낸 옛 부품 여섯 종: 머리 요약 상자 · 접히는 근거 상자 · 근거 수준 딱지 · 별표 단서 줄 · 글 끝 문헌 목록 · 글 중간 이어서 볼 글 카드.
 *   (옛 부품 이름을 주석에 그대로 적으면 check:geo 가 글에 남은 것으로 세므로 풀어서 적는다.)
 *   · 큰 절 5개(세 착지 비교 · 확인법 · 무릎 · 오버스트라이드 · 바꾸는 법) → 번호 붙은 큰 질문 4개.
 *     세 착지의 뜻은 표 대신 첫 문단으로 올렸고(제목이 약속한 답이 첫 화면에 있게), 「무릎이 망가지나요」는 1절과 FAQ 로 합쳤다.
 *     오버스트라이드와 걸음 수는 할 일이 하나라서 3절로 묶었다 — 「할 일이 먼저, 이유는 뒤」
 *   · id 는 check·how-to 를 그대로 두고 change·transition 을 더했다. compare·injury·overstride·next 는 없앴다
 *     (grep -rn "midfoot#" app lib components → 0건, 2026-11-18 확인)
 *   · 빵부스러기(구조화 데이터) 이름을 「미드풋 착지」에서 「착지 방식」으로 바꿨다 — 본문 첫 등장보다 먼저 나와
 *     풀이 검사를 통과할 자리가 없었다(발뒤꿈치 통증·걸음 수 글 선례). 제목 아래 「협찬 없이 작성」 띠는 글 끝 글쓴이 소개와 겹쳐서 뺐다
 *   · 글 중간 이어서 볼 글 카드를 상황 문장 링크로 바꿨다. 그 카드의 자세 글 설명이 「상체·팔 자세가 착지에 미치는 것」으로
 *     단정형이었는데, 자세가 착지를 바꾼다는 판정은 자세 글이 하지 않는다 — 주장을 없애고 상황 문장만 남겼다.
 *     GA 계측(guide_mid_next_click)이 이 글에서는 빠진다. 걸음 수·자세 글도 같은 선택을 했다
 *
 *   고친 것 — 주장을 초록으로 다시 판정한 결과 (QxMD read.qxmd.com/read/<PMID>, 2026-11-18 직접 열어 대조)
 *   · **착지 방식 판정은 이 글이 전담한다** — 걸음 수 글과 자세 글은 주장하지 않고 링크만 건다. 그래서 여기서 답이 끝나게 썼다
 *   · **「미드풋·포어풋이 더 좋다」·「뒤꿈치 착지는 나쁘다」·「바꾸면 덜 다친다」는 쓰지 않았다.**
 *     Anderson 2020(53편)은 착지 방식과 부상 위험의 관계를 결정할 수 없었다고 적었고, 그 이유가 후향 연구뿐이었다는 것이다.
 *     Burke 2021(13편)은 관계의 근거 수준을 낮게 봤다. 확인되는 것은 부담이 어디로 옮겨 가는지까지다
 *   · **걸음 수 5~10% 의 세기를 걸음 수 글과 맞췄다.** 연구가 시험한 폭이 평소보다 5~10% 올린 조건이라 그대로 따라 쓰는 것이고,
 *     더 올리면 어떻게 되는지를 잰 자료는 없다. 무릎 쪽 효과는 이 글에서 말하지 않고 걸음 수 글로 보낸다 —
 *     그 고찰(Anderson 2022)이 무릎·고관절 흡수 에너지 감소를 「근거 제한적」으로 등급 지었다.
 *     **「부담이 무릎에서 고관절로 옮겨 간다」로는 쓰지 않았다** — 두 지표는 다른 양이다
 *   · **아킬레스 쪽은 숫자를 받치는 쪽으로 바꿨다.** Lyght 2016 초록에서 새로 확인: 앞꿈치 착지가 아킬레스 최대 응력·변형·변형률이
 *     모두 더 컸다(P<.001). 그리고 걸음 수 5% 증가는 **두 착지 모두에서** 응력·변형을 줄였다 — 이 글의 할 일과 바로 이어지는 결과다
 *   · **Almonroeder 2013 의 표본을 적었다** — 여성 러너 19명(뒤꿈치 11 · 비뒤꿈치 8), 맨발. 걸음당 충격량 11% 는 p=0.05 이고
 *     마일당 충격량(p=0.06)·부하율(p=0.06)은 통계적으로 분명하지 않아 본문에 쓰지 않았다
 *   · **Almeida 2015 를 부하 근거로 쓰지 않았다.** 초록에 있는 것은 뒤꿈치 착지의 수직 부하율이 더 높다는 것과
 *     발목·무릎의 각도·가동범위 차이까지다. 발목·종아리 쪽 부담 증가는 Anderson 2020 초록의 서술이다(최대 발목 족저굴곡 모멘트)
 *   · **Lieberman 2010 을 「힐스트라이크가 무릎을 망가뜨린다」의 근거로 읽지 않게 적었다.** 비교한 것은 맨발 앞꿈치 착지와
 *     신발 뒤꿈치 착지이고, 발바닥 중간 착지는 따로 비교하지 않았으며 **부상이 얼마나 생기는지는 재지 않았다**
 *   · **밑창 마모는 사이트의 눈대중이라고 적었다.** 연구로 확인한 자료를 찾지 못했다. 표의 「밑창이 닳는 곳」 열은 없앴다 —
 *     근거 없는 열은 표로 만들지 않는다(AGENTS 신뢰 규칙 4)
 *   · **하이닥 기사(걸음 수와 아킬레스 부담)를 내렸다.** 같은 내용을 Lyght 2016 초록이 더 정확하게 받친다.
 *     현대건강신문 기사는 논문이 아니므로 출처 목록(연구 N편 대조)에서 내리고 본문에 링크와 누가 한 말인지를 남겼다
 *     (정리운동·자세·첫 10km 글 선례)
 *
 *   확인한 초록 (2026-11-18, 11편 전부 직접 열어서 대조)
 *   · Anderson 2020 — 체계적 고찰·메타분석 53편. 다치지 않은 뒤꿈치 착지 러너에게 착지 방식 변경을 권할 수 없다.
 *     착지 방식과 부상 위험의 관계는 결정 불가(부상 근거가 후향 연구뿐). 후향 연구에서 비뒤꿈치 착지가 반복 부상 보고가 적었으나 근거 제한적.
 *     생체역학: 수직 부하율·무릎 굽힘 가동범위·슬개대퇴 응력 감소. 바꾼 직후 느린·중간 속도에서 러닝 이코노미 저하, 개선 근거 없음.
 *     발목·족저굴곡근 쪽으로 부하 이동(최대 내적 발목 족저굴곡 모멘트 증가)
 *   · Burke 2021 — 체계적 고찰 13편, GRADE. 착지 기술과 부상 관계의 근거 수준 낮음. 관계를 보고한 연구들은 후향·소표본·측정 부실로 질이 매우 낮다고 평가
 *   · Burke 2023 — 레크리에이션 러너 258명 1년 전향(RISC). 단변량에서 비뒤꿈치 착지가 부상과 유의하게 연관.
 *     다변량에서는 빠지고 이전 부상·마라톤 훈련·무릎 외반 작음·반대쪽 흉부 하강 큼이 남았다. 가장 많이 다친 곳은 종아리
 *   · Almeida 2015 — 체계적 고찰·메타분석 16편. 뒤꿈치 착지가 앞꿈치 착지보다 수직 부하율 높음. 접지 순간 발목·무릎 각도와
 *     무릎 굽힘 가동범위 차이. 발목 족저굴곡근 부하·슬개대퇴 부하에 대한 서술은 초록에 없음
 *   · Lieberman 2010 — 습관적 맨발 러너(대부분 앞꿈치) vs 습관적 신발 러너(대부분 뒤꿈치). 단단한 바닥에서도 맨발 앞꿈치 쪽 충돌력이 작음.
 *     발바닥 중간 착지는 별도 비교군이 아니고, 부상률은 측정하지 않았다(앞꿈치·중간 착지가 보호적일 수 있다는 추정만)
 *   · Lieberman 2015 — 러너 14명, 초속 3.0m, 분당 75·80·85·90·95 스트라이드. 고관절보다 앞에 착지할 때 제동력 커짐(P=0.0005,
 *     무릎 기준은 P=0.54 로 아님). 무릎보다 앞에 착지할 때 수직 충격 정점 커짐(P<0.0001), 부하율은 P=0.07 로 유의하지 않음.
 *     스트라이드 5 증가마다 최대 고관절 굽힘 모멘트 +5.8%, 고관절 기준 착지 위치 -5.9%
 *   · Heiderscheit 2011 — 건강한 일반 러너 45명, 같은 속도 트레드밀, 평소와 ±5%·±10%. 걸음 수가 오르자 보폭·무게중심 상하 이동·제동 충격량 감소.
 *     무릎 흡수 에너지는 +5%·+10%에서, 고관절은 +10%에서만 감소
 *   · Lyght 2016 — 여성 러너 19명, 두 착지(뒤꿈치·앞꿈치) × 세 걸음 수(평소·+5%·-5%). 뒤꿈치 착지가 앞꿈치보다 아킬레스 최대 응력·
 *     변형·변형률 모두 낮음(P<.001). +5%는 두 착지 모두에서 응력·변형 감소(뒤꿈치 P<.001, 앞꿈치 P=.005). -5% 결과는 초록에 없음
 *   · Almonroeder 2013 — 여성 러너 19명(뒤꿈치 11 · 비뒤꿈치 8), 맨발. 비뒤꿈치 쪽 걸음당 아킬레스 충격량 11% 큼(p=0.05),
 *     마일당 p=0.06(마일당 체중 47.7배 추가), 부하율 약 15% 큼(p=0.06), 최대 힘 발생 시점이 더 이름(p=0.007)
 *   · Rice 2017 — 습관적 뒤꿈치 착지 22명(남 11), 초속 3.6m 지면 주행, 신발 3조건(일반·미니멀·맨발) × 착지 2조건.
 *     미니멀 신발에서 앞꿈치 착지가 아킬레스 충격량 더 큼. 미니멀·맨발은 착지 방식과 무관하게 아킬레스 부하율 더 큼.
 *     무릎·슬개대퇴 결과는 초록에 없음
 *   · Hung Au 2021 — 러너 30명(여 15 · 남 15) 지면 주행. 발바닥 중간·앞꿈치 착지가 뒤꿈치보다 소리 최대 진폭 큼(P<.001),
 *     소리 길이는 짧고 중간 주파수는 높음. 수직 부하율과 소리 특성 사이에 유의한 관계 없음(P>.115).
 *     저자 결론: 소리만으로 충격 부하를 추정하지 말 것
 *
 *   확인 못 한 것 — 권·호·쪽. QxMD 는 학술지 이름까지만 보여 준다. 저장소에 값이 있던 세 편(Almeida 2015 과, 아킬레스 글에 적혀 있던 Almonroeder 2013·Lyght 2016)만 옮기고,
 *   나머지 여덟 편은 학술지 이름까지만 적었다. 지어내지 않았다
 */

const PAGE_URL = pageUrl("/injury/midfoot");
const TITLE = "미드풋 착지란? 힐스트라이크면 바꿔야 할까요?";
// 2026-11-04 네이버 30일: 「미드풋」 노출 421 · CTR 1.2%, 「힐스트라이크」 148 · 1.4% — 설명은 예고가 아니라 답으로 둔다
const DESC =
  "미드풋은 발바닥 중간이 먼저 닿는 착지입니다. 지금 뒤꿈치로 닿아도 아픈 데가 없다면 바꾸지 않아도 된다는 고찰이 있고, 바꾸면 아킬레스와 종아리가 받는 부담이 커집니다.";

export const metadata: Metadata = {
  // 네이버 서치어드바이저 실측(2026-08): "미드풋" 질의로 노출 329 · 클릭 2 · CTR 0.6%.
  // 전체 키워드 중 노출 1위인데 CTR은 최하위였다. 이전 제목이 "무조건 좋은 게 아닌 이유"로
  // 부정부터 시작해, "미드풋이 뭔지" 알고 싶어 검색한 사람에게 답을 약속하지 못했다.
  title: "미드풋 착지란? 힐스트라이크면 바꿔야 할까요? | 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/midfoot" },
};

const FAQ: FaqItem[] = [
  {
    q: "포어풋이 미드풋보다 좋은가요?",
    a: "어느 쪽이 더 좋다고 말할 근거는 아직 없어요. 포어풋은 앞꿈치부터, 미드풋은 발바닥 중간부터 닿는 착지예요. 확인된 것은 **닿는 곳이 앞으로 갈수록 발목과 종아리 부담이 커진다**는 것까지예요.",
  },
  {
    q: "무릎이 아픈데 착지를 바꾸면 나아질까요?",
    a: "덜 아파진다고 말하기는 어려워요. 착지를 바꿔서 통증이 줄었는지 시험한 자료는 찾지 못했어요. **먼저 할 일은 무릎 앞 통증 글**에 있어요.",
  },
  {
    q: "맨발이나 미니멀 신발로 달리면 착지가 저절로 좋아지나요?",
    a: "그렇게 말할 근거는 찾지 못했어요. 뒤꿈치로 닿던 러너가 미니멀 신발과 맨발로 달린 실험에서는 **아킬레스에 부담이 걸리는 속도가 올라갔어요.**",
  },
];

const pill = "rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400";

export default function MidfootPage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["착지 방식", "/injury/midfoot"],
        ]}
      />
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-600">착지법</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/midfoot" compact checked={11} />

        <KeyPoints
          items={[
            <>지금 뒤꿈치로 닿아도 아픈 데가 없다면 <strong>착지를 바꾸지 않아도 돼요.</strong></>,
            <>바꾸면 좋아지는 것만 있는 게 아니에요. <strong>아킬레스와 종아리가 받는 부담이 커져요.</strong></>,
            <>바꾸기 전에 <strong>걸음 수를 조금 올려</strong> 발이 몸에서 멀리 앞에 닿지 않게 해 보길 권해요.</>,
          ]}
        />

        <Lead>
          뒤꿈치부터 닿는 내 착지가 잘못된 건 아닌지 신경 쓰인다면, 이름부터 구분해 볼 만해요. 미드풋은 발바닥 중간이 먼저 땅에
          닿는 착지예요. 뒤꿈치부터 닿는 것은 힐스트라이크라고 해요. 앞꿈치부터 닿는 것은 포어풋이라고 해요.
        </Lead>

        <TableOfContents
          items={[
            { id: "change", label: "꼭 바꿔야 하나요?" },
            { id: "check", label: "내 착지 확인하는 법" },
            { id: "how-to", label: "바꾸는 대신 할 것" },
            { id: "transition", label: "바꿀 때 조심할 것" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="change" className={H2}>
          <Num n={1} />뒤꿈치로 닿는데 꼭 바꿔야 하나요?
        </h2>
        <P>
          아니요. <strong>지금 아픈 데가 없다면 그대로 달려도 돼요.</strong> 연구 53편을 모은 고찰은 다치지 않은 뒤꿈치 착지
          러너에게 착지 방식을 바꾸라고 권할 수 없다고 결론 냈어요.
        </P>

        <h3 className={H3}>착지 방식과 부상의 관계는 아직 정리되지 않았어요</h3>
        <P>
          그 고찰은 착지 방식이 부상 위험을 바꾸는지 자체를 결정할 수 없었어요. 부상을 본 연구가 다친 뒤에 거꾸로 물은 것뿐이었기
          때문이에요. 연구 13편을 모은 다른 고찰도 관계의 근거 수준을 낮게 봤어요.
        </P>
        <P>
          러너들을 1년 따라간 연구에서는 오히려 뒤꿈치가 아닌 착지가 부상과 연관된 결과가 나왔어요. 이 결과는 요인을 하나씩
          본 분석에서만 나왔고, 여러 요인을 함께 넣은 분석에서는 빠졌어요.
        </P>
        <Caveat>
          뒤꿈치 착지가 무릎을 망가뜨린다는 말의 출처로 자주 꼽히는 연구는 맨발로 앞꿈치로 닿는 사람과 신발을 신고 뒤꿈치로 닿는
          사람을 비교한 것이에요. 발바닥 중간으로 닿는 경우는 따로 비교하지 않았고, 부상이 얼마나 생기는지도 재지 않았어요.
        </Caveat>

        <h3 className={H3}>바꾸면 부담이 다른 곳으로 옮겨 가요</h3>
        <P>
          어느 쪽이 더 좋다는 이야기가 아니에요. <strong>닿는 곳을 바꾸면 몸이 받는 부담의 위치가 바뀌어요.</strong> 발 앞쪽으로
          닿으면 땅에 닿는 순간 충격이 올라가는 속도는 낮았고, <strong>발목과 종아리가 받는 부담은 커졌어요.</strong>
        </P>
        <P>어디로 얼마나 옮겨 가는지는 연구마다 달라서, 저희가 숫자 하나로 말할 수는 없어요.</P>

        <OneLine>지금 아픈 데가 없으면 그대로 달려요. 바꿔서 덜 다친다는 근거는 아직 없어요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="check" className={H2}>
          <Num n={2} />내 착지는 어떻게 확인하나요?
        </h2>
        <P>
          <strong>옆에서 찍은 영상이 가장 분명해요.</strong> 발이 어디로 닿는지와 함께, 발이 몸보다 얼마나 앞에서 닿는지도 같이
          보세요.
        </P>
        <Steps
          items={[
            { t: "누군가에게 옆에서 느린 영상으로 찍어 달라고 해요.", d: "요즘 휴대폰은 대부분 돼요." },
            { t: "발의 어느 쪽이 먼저 땅에 닿는지 보세요.", d: "뒤꿈치, 발바닥 중간, 앞꿈치 중 하나예요." },
            { t: "발이 무릎보다 앞에서 닿는지 보세요.", d: "몸 가까이 닿을수록 충격과 제동이 작았어요." },
          ]}
        />
        <P>
          오래 신은 러닝화를 뒤집어 보는 것도 단서가 돼요. <strong>뒤꿈치 바깥쪽만 닳아 있으면 뒤꿈치로 닿는 편</strong>이라고
          흔히 봐요. 저희가 쓰는 눈대중이고, 연구로 확인한 자료는 찾지 못했어요.
        </P>
        <P>
          <strong>발소리로는 판단하기 어려워요.</strong> 달리기 실험에서 발바닥 중간이나 앞꿈치로 닿을 때 소리가 더
          컸고, 소리 크기는 착지 충격과 관련이 없었어요. 소리가 크다고 잘못 뛰는 것이 아니에요.
        </P>

        <OneLine>옆에서 찍은 영상으로 보세요. 발소리가 큰지 작은지는 답을 알려 주지 않아요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="how-to" className={H2}>
          <Num n={3} />바꾸는 대신 먼저 뭘 해 볼까요?
        </h2>
        <P>
          <strong>걸음 수를 지금보다 5~10%쯤 올려 보길 권해요.</strong> 발이 몸에서 멀리 앞에 닿는 게 마음에 걸릴 때 먼저 해
          볼 수 있는 일이에요. 발을 몸보다 한참 앞에 놓는 것을 오버스트라이드라고 해요.
        </P>
        <P>
          같은 속도로 달린 실험에서 <strong>발이 무릎보다 앞에서 닿을수록 충격이 컸고,</strong> 엉덩이보다 앞에서
          닿을수록 제동이 컸어요. 그리고 걸음 수를 올리자 보폭이 줄고 착지 위치가 몸 쪽으로 가까워졌어요.
        </P>
        <Steps
          items={[
            { t: "지금 내 걸음 수를 세고, 거기서 5~10% 올린 숫자를 목표로 적어요.", d: "분당 160보라면 168~176보예요." },
            { t: "달리기 전체가 아니라 짧은 구간에서만 해 봐요.", d: "한 번에 몇 분이면 충분해요." },
            { t: "다음 날 아프면 되돌려요.", d: "원래 걸음 수로 달리고, 다음에 더 작게 올려요." },
          ]}
        />
        <Caveat>
          5~10% 는 연구에서 시험한 폭이라 그대로 따라 쓰는 거예요. 더 올리면 어떻게 되는지를 잰 자료는 찾지 못했어요.
        </Caveat>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/cadence" className={pill}>걸음 수를 얼마로 맞출지 모르겠다면 →</Link>
          <Link href="/injury/posture" className={pill}>상체가 숙여지는 게 신경 쓰이면 →</Link>
        </div>

        <OneLine>착지를 바꾸는 것보다, 걸음 수를 조금 올려 발을 몸 가까이 놓는 쪽이 쉬워요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="transition" className={H2}>
          <Num n={4} />그래도 바꾸고 싶다면 뭘 조심해야 하나요?
        </h2>
        <P>
          <strong>아킬레스와 종아리예요.</strong> 두 착지를 번갈아 달린 실험에서 앞꿈치로 닿을 때 아킬레스가
          받는 힘이 더 컸어요. 맨발로 달린 다른 실험에서는 뒤꿈치가 아닌 착지 쪽이 <strong>걸음당 아킬레스 충격량이 11%</strong>{" "}
          컸어요. 부담이 커졌다는 것이지, 더 많이 다쳤다는 결과는 아니에요.
        </P>
        <Steps
          items={[
            { t: "한꺼번에 바꾸지 말고 짧은 구간에서만 새 착지로 달려 보길 권해요.", d: "나머지는 평소대로 달려요." },
            { t: "신발까지 한꺼번에 바꾸지 마세요.", d: "뒤꿈치로 닿던 러너들의 실험에서 착지와 상관없이 아킬레스가 부하를 받는 속도가 올라갔어요." },
            { t: "종아리나 발뒤꿈치 위쪽이 아프면 바꾸던 것을 멈춰요.", d: "다음 날 아침에 더 아프면 그 주는 늘리지 않아요." },
          ]}
        />
        <P>
          바꾸면 더 잘 달려진다는 기대는 접어 두는 편이 좋아요. 고찰에 따르면 바꾼 직후에는 같은 속도로 달리는 데 드는 힘이
          오히려 늘었고, 좋아졌다는 근거는 없었어요.
        </P>
        <P>
          정형외과 전문의도 착지 방식을 억지로 바꾸기보다 훈련량을 조금씩 늘리는 쪽을 권해요(서울부민병원 안지용 실장,{" "}
          <a href="https://www.hnews.kr/news/view.php?no=68992" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">
            현대건강신문
          </a>
          ).
        </P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/achilles" className={pill}>발뒤꿈치 위쪽이 아프다면 →</Link>
          <Link href="/injury/knee-pain" className={pill}>무릎 앞이 아프다면 →</Link>
        </div>

        <OneLine>바꾸기로 했다면 짧은 구간부터, 신발은 그대로 두고 해 보세요.</OneLine>

        <FinderCta
          from="midfoot"
          variant="inline"
          headline="착지를 바꾸는 것보다 발볼과 사이즈가 맞는 신발이 먼저예요."
        />

        <div className="mt-14">
          <YoutubeSection links={[
            { label: "착지법 전쟁 종결 — 미드풋 vs 리어풋 vs 힐스트라이크", channel: "러닝비하인드 RunningBehind 쟐쌤", url: "https://www.youtube.com/watch?v=FWXS4q-34w8" },
            { label: "수십 년째 논쟁 — 힐스트라이크 vs 미드풋 vs 포어풋", channel: "애슬레틱 라이프 Athletic Life", url: "https://www.youtube.com/watch?v=b20-GrHPMWI" },
          ]} />
        </div>

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Anderson et al. (2020)</strong> 연구 53편을 모은 체계적 고찰이에요. 다치지 않은 뒤꿈치 착지 러너에게 착지
            방식 변경을 권할 수 없고, 착지 방식과 부상 위험의 관계는 결정할 수 없다고 적었어요(부상을 본 연구가 후향 연구뿐).
            바꾼 직후 러닝 이코노미는 떨어졌고, 부하는 발목과 족저굴곡근 쪽으로 옮겨 갔어요.
            <Ref>Sports Med · <a href="https://pubmed.ncbi.nlm.nih.gov/31823338/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Burke et al. (2021)</strong> 연구 13편을 모은 체계적 고찰이에요. 착지 기술과 러닝 부상의 관계를 받치는 근거
            수준이 낮았어요. 관계를 보고한 연구들은 후향 설계·작은 표본·부실한 착지 측정으로 질이 매우 낮다고 평가했어요.
            <Ref>Orthop J Sports Med · <a href="https://pubmed.ncbi.nlm.nih.gov/34527750/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Burke et al. (2023)</strong> 레크리에이션 러너 258명을 1년 따라간 전향 연구예요. 요인을 하나씩 본 분석에서는
            뒤꿈치가 아닌 착지가 부상과 유의하게 연관됐지만, 여러 요인을 함께 넣은 분석에서는 빠졌어요(남은 것은 이전 부상·마라톤
            훈련 등). 가장 많이 다친 곳은 종아리였어요.
            <Ref>Sports Med Open · <a href="https://pubmed.ncbi.nlm.nih.gov/37310517/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Almeida et al. (2015)</strong> 연구 16편을 모은 메타분석이에요. 뒤꿈치 착지가 앞꿈치 착지보다 수직 부하율이
            높았고, 접지 순간의 발목·무릎 각도와 무릎 굽힘 가동범위도 달랐어요. 발목이나 무릎이 받는 힘에 대한 서술은 초록에
            없어요.
            <Ref>J Orthop Sports Phys Ther 45(10):738-755 · <a href="https://pubmed.ncbi.nlm.nih.gov/26304644/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Lieberman et al. (2010)</strong> 습관적으로 맨발로 달리는 러너와 신발을 신고 달리는 러너를 비교했어요. 맨발
            앞꿈치 착지 쪽이 충돌력이 작았어요. 발바닥 중간 착지는 별도 비교군이 아니고, 부상이 얼마나 생기는지는 재지 않았어요.
            <Ref>Nature · <a href="https://pubmed.ncbi.nlm.nih.gov/20111000/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={6}>
            <strong>Lieberman et al. (2015)</strong> 러너 14명이 초속 3.0m 로 달린 실험이에요. 엉덩이보다 앞에 닿을수록 제동력이
            커졌고(무릎 기준으로는 아님), 무릎보다 앞에 닿을수록 수직 충격 정점이 커졌어요. 충격이 올라가는 속도는 통계적으로
            분명하지 않았어요. 분당 스트라이드 5 를 올릴 때마다 착지 위치가 엉덩이 쪽으로 5.9% 가까워졌어요.
            <Ref>J Exp Biol · <a href="https://pubmed.ncbi.nlm.nih.gov/26538175/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={7}>
            <strong>Heiderscheit et al. (2011)</strong> 건강한 일반 러너 45명이 같은 속도 트레드밀에서 평소 걸음 수와 ±5%·±10%로
            달렸어요. 걸음 수가 오르자 보폭·무게중심 상하 이동·제동 충격량이 줄었어요. 이 글이 쓰는 5~10% 라는 폭은 이 실험이
            시험한 조건이에요.
            <Ref>Med Sci Sports Exerc · <a href="https://pubmed.ncbi.nlm.nih.gov/20581720/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={8}>
            <strong>Lyght et al. (2016)</strong> 여성 러너 19명이 두 착지와 세 가지 걸음 수로 달렸어요. 앞꿈치 착지가 뒤꿈치
            착지보다 아킬레스 최대 응력과 변형이 더 컸어요. 걸음 수를 5% 올렸을 때는 두 착지 모두에서 응력과 변형이 줄었어요.
            <Ref>J Appl Biomech 32(4):365-72 · <a href="https://pubmed.ncbi.nlm.nih.gov/26955843/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={9}>
            <strong>Almonroeder et al. (2013)</strong> 여성 러너 19명(뒤꿈치 11명 · 뒤꿈치가 아닌 착지 8명)이 맨발로 달렸어요.
            뒤꿈치가 아닌 착지 쪽이 걸음당 아킬레스 충격량이 11% 컸어요(p=0.05). 마일당 충격량과 부하율 차이는 통계적으로
            분명하지 않았어요(p=0.06).
            <Ref>Ann Biomed Eng 41(8):1758-66 · <a href="https://pubmed.ncbi.nlm.nih.gov/23640524/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={10}>
            <strong>Rice et al. (2017)</strong> 습관적으로 뒤꿈치로 닿는 러너 22명이 일반 신발·미니멀 신발·맨발로, 각각 두 착지로
            달렸어요. 미니멀 신발에서 앞꿈치로 닿을 때 아킬레스 충격량이 더 컸고, 미니멀 신발과 맨발은 착지 방식과 무관하게
            아킬레스 부하율이 더 컸어요.
            <Ref>Am J Sports Med · <a href="https://pubmed.ncbi.nlm.nih.gov/28460179/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={11}>
            <strong>Hung Au et al. (2021)</strong> 러너 30명이 지면에서 달렸어요. 발바닥 중간과 앞꿈치 착지가 뒤꿈치 착지보다
            소리 최대 진폭이 컸어요. 수직 부하율과 소리 특성 사이에는 유의한 관계가 없었고, 저자들은 소리만으로 충격 부하를
            추정하지 말라고 적었어요.
            <Ref>J Athl Train · <a href="https://pubmed.ncbi.nlm.nih.gov/34911076/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
