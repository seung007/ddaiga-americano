import type { Metadata } from "next";
import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, H3, Warn, Num, KeyPoints, Steps, OneLine, Caveat, Sources, Src, Ref } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

/**
 * 달리기 후 정리운동 — 「달린 뒤에 뭘 하면 되나」를 찾아온 사람이 읽는 글
 *
 * 이 글의 과거 (2026-10-08 재검증에서 뒤집힌 것들)
 *   · 「달리고 바로 앉거나 누우면 혈액이 다리에 몰린 상태가 유지된다」 → 반대였다. 멈춘 뒤 다리에 피가 고여
 *     생기는 일시적 저혈압이 원인이고, 처치는 누워서 다리를 높이는 것이다(Asplund 2011, Speedy 2003)
 *   · 「바로 멈추면 회복이 늦어질 수 있다」 → 반대(Van Hooren 2018). 삭제
 *   · 제목의 「꼭 해야 할」 → Afonso 2021 과 반대. 제거
 *   · 러닝화 수명 500~800km → 연구로 정해진 교체 기준이 아니다. Cook 1985 의 실측 범위로 낮췄다
 *
 * 2026-11-18 확정 틀로 바꿈 (AGENTS.md 「가이드 글 틀 — 2026-11-18 확정」, 견본 app/injury/start-running/page.tsx)
 *   · 말투 「~니다」 → 「~요」. 날짜 한 줄 · 3줄 요약 · 번호 붙은 큰 질문 4개 · 절 끝 한 줄 요약 · 글 끝 접힌 「근거와 출처」 6편.
 *     옛 부품 일곱 개(머리 요약 상자 · 근거 접힘 상자 · 근거 수준 딱지 · 별표 단서 줄 · 할 일 상자 · 글 끝 문헌 목록 · 공유 단추와
 *     글 안 질문 입력칸)를 걷어냈다. 옛 부품 이름을 주석에 그대로 적으면 check:geo 가 글에 남은 것으로 세므로 풀어서 적는다
 *   · 「할 일이 먼저」 — 다섯 동작을 1절로 올렸다(전에는 4절이었다). 어지럼 설명과 동적·정적 구분을 먼저 읽어야
 *     동작이 나왔다. 앵커는 그대로 둔다: routine 은 준비운동 글이 걸고(app/injury/warmup/page.tsx:228),
 *     recover·dizzy·nutrition·dynamic-static 은 저장소 안에서 거는 곳이 없지만 바깥에서 올 수 있어 유지했다
 *   · 정적·동적 스트레칭 설명이 다섯 군데에 흩어져 있던 것을 1절 작은 제목 한 곳으로 모았다.
 *     동적·정적 비교 표를 지웠다 — 네 줄 중 셋이 사이트가 정한 관행이고, 표는 문장보다 사실처럼 읽힌다(AGENTS 신뢰 규칙 4).
 *     달리기 전에 할 일은 준비운동 글이 답한다. 여기서는 상황 문장 링크만 건다
 *   · 동작 다섯 개를 그대로 옮겨 적던 FAQ 문항을 지웠다. 동작을 고치면 두 곳이 갈라지는 자리였다
 *   · 다섯 동작의 글을 모듈 바깥 데이터 배열에서 본문 속 속성으로 옮겼다 — 배열에 두면 check:geo 의 본문 범위
 *     바깥이라 말투·따옴표 검사를 받지 않는다(검사기가 안 보는 자리에 문제가 고인다는 규칙)
 *
 *   고친 것 — 주장을 초록으로 다시 판정한 결과 (2026-11-18, QxMD read.qxmd.com/read/<PMID> 로 직접 열어 대조)
 *   · **「다음 날 근육통을 줄인다는 근거도 약합니다」 → 「근육통도 거의 줄지 않았어요」로 올렸다.**
 *     이 항목은 근거가 약한 것이 아니라 효과가 거의 없다는 근거가 확실한 쪽이다(코크런 고찰 12편, 100점 척도 −0.52·−1.04점).
 *     글이 근거를 실제보다 약하게 적고 있었다. 판정 근거는 Project 문서 「처음 달리기 글 근거 판정」 26번
 *   · **부상 예방을 근육통과 다른 문장으로 떼어 적었다.** 코크런의 부상 쪽 결과는 위험비 0.85(0.65–1.12)이고 대상이
 *     주로 군인이라 「막는다는 근거는 없어요」까지만 쓴다. 두 결론을 한 문장에 섞지 않는다
 *   · **「근력 회복과 근육통 모두 차이가 없었습니다」의 세기를 낮췄다.** Afonso 2021 은 모은 연구가 열 편·229명이고
 *     연구진이 확실성을 매우 낮다고 적었다. 본문은 「비슷했어요」로 쓰고 사람 수와 확실성은 출처로 내렸다
 *   · **쓰러짐 처치를 결승선 뒤와 달리는 도중으로 갈라 적었다.** 두 초록이 그렇게 갈라 말한다 —
 *     결승선 뒤는 기립성 저혈압으로 설명되고, 달리는 도중은 다른 중한 원인을 먼저 본다
 *
 *   확인한 초록 (2026-11-18, 직접 열어 대조)
 *   · Afonso 2021 — 무작위 시험 10편 229명(17~38세, 대부분 남성). 근력 회복 ES −0.08(−0.54~0.39, p=0.750),
 *     24·48·72시간 근육통 −0.09~−0.24, 모두 유의하지 않음. 비교군은 주로 수동 휴식. 약 70%가 비뚤림 위험 높음.
 *     GRADE 확실성 매우 낮음. 학술지는 Front Physiol — 저장소에는 학술지가 비어 있었다
 *   · Van Hooren & Peake 2018 — 능동 쿨다운은 혈중 젖산 회복을 앞당기지만 근육 속 젖산은 아님. 근육통은 대부분의
 *     근거에서 줄지 않음, 부상을 막는 것으로도 보이지 않음, 운동 후 실신·심혈관 문제를 줄이는지는 알 수 없음. 숫자 없음
 *   · Asplund 2011 — 탈수·고체온이 아니라 일시적 기립성 저혈압이 주된 설명. 멈추면 다리에 피가 고여 압수용체 반사가
 *     떨어진다. 생명을 위협하는 원인(심정지·열사병·운동 관련 저나트륨혈증)을 배제한 뒤 처치는 경구 수분과 다리를 높인 자세.
 *     전신 냉각이나 수액은 대개 필요하지 않음
 *   · Speedy 2003 — 쓰러짐은 대개 결승선을 지난 뒤. 달리는 도중이면 다른 중한 원인일 가능성이 더 크다.
 *     처치는 다리와 골반 올리기. 학술지는 Phys Sportsmed — 저장소에는 비어 있었다
 *   · Cook 1985 — 기계 시험 50마일 약 75%, 100~150마일 약 67%, 250~500마일 60% 미만. 실제로 신은 신발은
 *     500마일에 약 70%. 모델 사이 초기 흡수력 차이 약 33%. 가격·제조사는 흡수력을 예측하지 못했다
 *   · Herbert 2011 코크런 — 다시 조회하지 않았다. 판정요약 8번의 판정을 그대로 쓴다(견본 글이 2026-11-18 에 판정한 주장)
 *
 *   확인 못 한 것 — 비워 두지 않고 적어 둔다
 *   · **정운경(하이닥) 기사를 또 열지 못했다.** 2026-10-08 에도 열람하지 못했고, 오늘은 그 호스트 조회에 승인이 필요해
 *     사람이 없는 동안은 열 수 없었다. 이 기사가 받치던 주장(달리기 전에는 동적, 후에는 정적을 병행)은 사이트가 정한 관행으로
 *     쓰고 전문가 이름을 빼고 출처에서도 내렸다 — 「연구 N편과 대조」에 논문 아닌 자료를 섞어 세지 않기 위해서다.
 *     기사가 열리는 날 다시 넣으면 된다
 *   · 권·호·쪽: Afonso·Van Hooren·Speedy 세 편은 학술지 이름까지만 확인됐다(QxMD 가 권·호·쪽을 보여 주지 않는다).
 *     Van Hooren 의 Sports Med 48(7):1575-95, Asplund 의 BJSM 45(14):1157-62, Herbert 의 CD004577,
 *     Cook 의 Am J Sports Med 13(4):248-53 은 저장소의 기존 값을 그대로 뒀다. 새로 지어내지 않았다
 *   · 운동 뒤 영양·잠의 효과를 받치는 자료는 여전히 없다(2026-08-31 에 무관한 논문으로 판명돼 내린 자리).
 *     4절에 그렇게 적어 뒀다. 대체 주장을 만들지 않았다
 *   · 다섯 동작의 폼·순서·시간(30초 × 2)과 마무리 걷기 5분은 논문에서 온 값이 아니라 사이트가 정한 예시다
 *   · 「동적 스트레칭」을 check:geo 의 TERMS 에 더하지 않았다 — 더하면 초보 가이드 글의 제3자 영상 제목이 풀이 없는
 *     전문어로 걸린다(그 제목은 고칠 것이 아니다). 이 글 안에서는 처음 나올 때 문장으로 풀어 썼다
 */

const PAGE_URL = pageUrl("/injury/cooldown");
// 2026-11-10 제목: 검색어 「정적 스트레칭」(63노출)·「달리기 후 스트레칭」(23노출)을 앞에 둔다.
// 오픈채팅 21,649건에서 이 주제의 걱정은 「회복」 32명·「근육통·뭉침·뻐근」 10명이고 「쿨다운」은 4명뿐이라 걱정 쪽으로 물었다.
const TITLE = "달리기 후 정적 스트레칭, 회복이 빨라지나요?";
const DESC =
  "달린 뒤 스트레칭이 회복을 앞당긴다는 근거는 확인되지 않았습니다. 유연성을 위해 할 다섯 동작과 멈춰 서 있다 어지러울 때 할 일을 담았습니다.";

export const metadata: Metadata = {
  title: `${TITLE} | 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/cooldown" },
};

// 2026-11-18: FAQ 는 본문 큰 질문과 겹치지 않는 곁가지만 둔다. 전문어는 문항마다 다시 풀이한다 — 답 하나만 따로 인용되기 때문이다
const FAQ: FaqItem[] = [
  {
    q: "달린 뒤에 얼마나 걸으며 마무리하면 되나요?",
    a: "저희는 **5분쯤 천천히 걷기**를 권해요. 걷는 시간을 정한 연구는 찾지 못했어요. 가볍게 움직이며 마무리하면 혈액 속 젖산이 더 빨리 내려갔지만, 어지럼이나 실신을 막아 주는지는 알 수 없어요.",
  },
  {
    q: "다음 날 근육통이 심한데 또 달려도 되나요?",
    a: "**가볍게 달리거나 쉬길** 권해요. 달리는 중에 아픔이 커지면 그날은 멈추고, 다음 날 아침에 더 아프면 거리를 줄여요. **뼈의 한 지점을 누를 때 콕 집어 아프면** 기다리지 말고 진료를 받으세요.",
  },
  {
    q: "달리기 전에도 정적 스트레칭을 해도 되나요?",
    a: "해도 되지만 **한 군데를 오래 붙들지 않는 게** 요점이에요. 달리기 전에는 관절을 움직이며 몸을 데우길 권해요. 얼마나 붙들어도 되는지는 준비운동 글에 근거와 함께 있어요.",
  },
];

const pill = "rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400";
const linkCls = "text-emerald-700 underline";

/** 동작 한 칸 — 글은 본문 속 속성으로 둔다(모듈 바깥 배열에 두면 글 검사 범위를 벗어난다) */
function Stretch({ n, name, how, feel }: { n: string; name: string; how: string; feel: string }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="flex items-baseline gap-2">
        <span className="font-bold text-gray-400">{n}</span>
        <h3 className="font-bold text-gray-900">{name}</h3>
        <span className="ml-auto shrink-0 text-sm font-semibold text-emerald-700">30초 × 2</span>
      </div>
      <p className="mt-2 break-keep text-base leading-[1.7] text-gray-700">{how}</p>
      <p className="mt-1 text-sm text-gray-500">{feel}</p>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["쿨다운", "/injury/cooldown"],
        ]}
      />
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-600">쿨다운</span>
          {/* 규약은 app/injury/page.tsx 상단 주석 */}
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/cooldown" compact checked={6} />

        <KeyPoints
          items={[
            <>달린 뒤에는 <strong>다섯 군데를 30초씩</strong> 늘려 보세요. 몸이 굳지 않게 하려고 하는 거예요.</>,
            <>스트레칭을 해도 <strong>근육통은 거의 줄지 않았어요.</strong></>,
            <>달리다 멈춰 서서 어지러우면 바로 <strong>누워서 다리를 올려요.</strong></>,
          ]}
        />

        <Lead>
          달리고 나서 스트레칭을 하면 회복이 빨라진다고 들었다면, 그 기대는 접어도 돼요. 대신{" "}
          <strong>몸이 뻣뻣해지지 않게</strong> 하는 데는 쓸모가 있어요.
        </Lead>

        <TableOfContents
          items={[
            { id: "routine", label: "달린 뒤에 할 동작" },
            { id: "recover", label: "회복이 빨라지나요?" },
            { id: "dizzy", label: "멈추면 어지러워요" },
            { id: "nutrition", label: "음식이나 잠은 어떤가요?" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="routine" className={H2}>
          <Num n={1} />달린 뒤에 어떤 동작을 하면 되나요?
        </h2>
        <P>
          <strong>아래 다섯 동작을 30초씩 두 번, 양쪽 다 해 보세요.</strong> 한 자세로 멈춰서 근육을 늘린 채 버티는 것을 정적
          스트레칭이라고 해요.
        </P>
        <Caveat>
          동작과 순서, 시간은 저희가 정한 예시예요. 이 순서가 회복을 앞당긴다는 근거는 찾지 못했어요.
        </Caveat>

        <div className="mt-5 space-y-3">
          <Stretch
            n="1"
            name="종아리 벽 스트레칭"
            how="벽에 손을 짚고 한 발을 뒤로 빼요. 뒤쪽 발뒤꿈치를 바닥에 완전히 붙인 채 앞쪽 무릎을 굽혀요."
            feel="종아리 뒤쪽이 당기면 맞아요"
          />
          <Stretch
            n="2"
            name="햄스트링"
            how="한 발을 앞으로 내밀고 뒤꿈치만 바닥에 대요. 발끝은 위로 세우고, 엉덩이를 뒤로 빼면서 상체를 천천히 숙여요."
            feel="허벅지 뒤쪽이 당기면 맞아요"
          />
          <Stretch
            n="3"
            name="고관절 굴근"
            how="한 발을 크게 앞으로 내딛고 뒤쪽 무릎을 바닥에 대요. 상체를 세운 채 골반만 앞으로 밀어요."
            feel="뒤쪽 다리의 사타구니와 허벅지 앞이 당기면 맞아요"
          />
          <Stretch
            n="4"
            name="장경인대"
            how="장경인대는 허벅지 바깥쪽을 지나 무릎까지 이어지는 질긴 띠예요. 선 자세에서 늘릴 쪽 다리를 반대쪽 다리 뒤로 교차시키고, 그대로 상체를 반대 방향으로 기울여요."
            feel="허벅지 바깥쪽 선이 당기면 맞아요"
          />
          <Stretch
            n="5"
            name="엉덩이"
            how="등을 대고 누워 한쪽 무릎을 두 손으로 가슴 쪽으로 당겨요. 반대쪽 다리는 바닥에 붙여 둬요."
            feel="엉덩이 뒤쪽이 당기면 맞아요"
          />
        </div>

        <Steps
          items={[
            { t: "통증이 아니라 당기는 느낌에서 멈춰요." },
            { t: "반동을 주며 튕기지 않아요.", d: "같은 자세로 30초를 버텨요." },
            { t: "양쪽 다 해요.", d: "한쪽만 하면 좌우가 달라져요." },
          ]}
        />

        <h3 id="dynamic-static" className={`${H3} scroll-mt-20`}>달리기 전에는 움직이면서, 달린 뒤에는 멈춰서</h3>
        <P>
          달리기 전에는 다리를 흔들거나 무릎을 올리듯 <strong>관절을 움직이며</strong> 몸을 데우는 쪽을 권해요. 그렇게 움직이면서
          하는 것을 동적 스트레칭이라고 해요. 위의 다섯 동작은 반대로 <strong>달린 뒤에</strong> 하는 거예요.
        </P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/warmup#routine" className={pill}>뛰기 전에 할 동작을 찾는다면 →</Link>
        </div>

        <OneLine>다섯 군데를 30초씩, 아프지 않을 만큼만 늘려요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="recover" className={H2}>
          <Num n={2} />스트레칭하면 회복이 빨라지나요?
        </h2>
        <P>
          <strong>빨라진다는 근거는 없어요.</strong> 운동을 마치고 스트레칭한 쪽과 그냥 쉰 쪽을 비교한 연구들에서 근력이 돌아오는
          속도가 비슷했어요.
        </P>
        <Caveat>다만 모은 연구가 적고, 연구진도 근거의 확실성이 매우 낮다고 적었어요.</Caveat>
        <P>
          <strong>근육통도 거의 줄지 않았어요.</strong> 여러 연구를 빠짐없이 모아 본 결론이라 이 부분은 꽤 분명해요.
        </P>
        <P>
          부상 예방은 다른 이야기예요. <strong>달린 뒤 정리운동이 부상을 막는다는 근거는 없어요.</strong> 덜 다치고 싶다면 한 번에
          늘리는 양을 먼저 보세요. 한꺼번에 길게 뛴 뒤부터 아프기 시작했다면{" "}
          <Link href="/injury/start-running#long-day" className={linkCls}>가장 길게 뛰는 날</Link>을 보세요.
        </P>
        <P>
          그래도 할 이유는 있어요. 달린 뒤 스트레칭은 <strong>몸이 굳지 않게 하는 쪽</strong>으로 권해요. 뻐근해서 하고 싶으면 해도
          괜찮고, 건너뛰었다고 회복이 늦어지는 것도 아니에요.
        </P>

        <OneLine>회복을 앞당기려고 하는 게 아니라, 몸이 굳지 않게 하려고 하는 거예요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="dizzy" className={H2}>
          <Num n={3} />달리고 멈춰 서면 어지러운데 괜찮나요?
        </h2>
        <P>
          <strong>멈춰 서 있지 말고 걸으면서 마무리해 보세요.</strong> 그래도 어지러우면 <strong>바로 누워서 다리를 올려요.</strong>
        </P>
        <P>
          달리다 멈추면 다리에 피가 고여 혈압이 잠깐 떨어져요. 대회 결승선을 지난 뒤 쓰러지는 일도 대개 이것으로 설명해요. 그래서
          처치가 물 마시기와 다리를 높여 눕히기예요.
        </P>
        <Warn title="이럴 땐 119, 대회라면 의료진">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              장거리를 달린 뒤 <strong>두통이나 구토, 혼란, 손발 부기</strong>가 있으면 <strong>물을 더 마시지 말고</strong> 119를
              부르세요.{" "}
              <Link href="/injury/half-marathon-race-day" className="underline">
                저나트륨혈증 신호
              </Link>
            </li>
            <li>결승선에서 의식을 잃었거나 달리는 도중에 쓰러졌다면 다른 원인일 수 있으니 바로 119를 부르세요.</li>
          </ul>
        </Warn>

        <OneLine>멈춰 서 있기보다 걸으면서 마무리하고, 어지러우면 눕고 다리를 올려요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="nutrition" className={H2}>
          <Num n={4} />회복에 좋다는 음식이나 잠은 어떤가요?
        </h2>
        <P>
          운동 뒤에 단백질과 탄수화물을 같이 먹고 충분히 자라는 말을 많이 들어요. <strong>저희는 그 효과를 확인한 자료를 찾지
          못했어요.</strong>
        </P>
        <P>
          예전에 이 자리에 달아 둔 자료는 다른 주제의 논문이어서 내렸어요. 확인하면 그때 적을게요. 쉬는 날을 어떻게 보낼지는{" "}
          <Link href="/injury/rest-day" className={linkCls}>쉬는 날 글</Link>에 근거까지 적어 뒀어요.
        </P>

        <OneLine>먹는 것과 잠에 대해서는 아직 저희가 확인한 자료가 없어요.</OneLine>

        <FinderCta
          from="cooldown"
          variant="inline"
          headline="쿠션이 닳은 신발은 스트레칭으로 못 메워요. 흔히 500~800km를 교체 시점으로 말하지만 연구로 정해진 기준은 아니에요."
        />

        <div className="mt-14">
          <YoutubeSection links={[
            { label: "러닝 후 쿨다운 스트레칭, 5분만 투자하세요 #초보러너", channel: "달려라하나", url: "https://www.youtube.com/watch?v=4Vbiu6RdpkE" },
            { label: "5분만에 끝나는 러닝 후 스트레칭", channel: "지니코치", url: "https://www.youtube.com/watch?v=bsWU6ata_tw" },
            { label: "러닝 스트레칭 종결 l 달리기 전후 제발 5분씩만 따라하세요", channel: "부부물리치료사", url: "https://www.youtube.com/watch?v=qoPyfVxqpQc" },
          ]} />

          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Afonso et al. (2021)</strong> 운동 뒤 스트레칭은 그냥 쉰 쪽과 근력 회복에 차이가 없었어요(−0.08, −0.54~0.39). 24·48·72시간 근육통도 차이가 없었어요. 무작위 시험 10편 229명(17~38세, 대부분 남성)이고 연구진은 근거의 확실성을 매우 낮다고 봤어요.
            <Ref>Front Physiol · <a href="https://pubmed.ncbi.nlm.nih.gov/34025459/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Herbert et al. (2011)</strong> 코크런 고찰 12편에서 다음 날 근육통이 100점 척도로 운동 전 스트레칭 0.52점, 운동 후 스트레칭 1.04점 줄어 임상적으로 의미 있는 감소가 아니었어요. 부상 쪽 결과는 위험비 0.85(0.65–1.12)였고 대상이 주로 군인이었어요.
            <Ref>Cochrane Database Syst Rev (7):CD004577 · <a href="https://pubmed.ncbi.nlm.nih.gov/21735398/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Van Hooren &amp; Peake (2018)</strong> 가볍게 움직이며 마무리하면 혈액 속 젖산 회복이 빨라지지만 근육 속 젖산은 아니었어요. 근육통은 줄지 않고 부상을 막는 것으로도 보이지 않으며, 운동 뒤 실신이나 심혈관 문제를 줄이는지는 알 수 없다고 정리했어요.
            <Ref>Sports Med 48(7):1575-95 · <a href="https://pubmed.ncbi.nlm.nih.gov/29663142/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Asplund et al. (2011)</strong> 결승선을 지난 뒤 쓰러지는 일의 주된 설명은 멈춘 뒤 다리에 피가 고여 생기는 일시적 기립성 저혈압이었어요. 심정지와 열사병, 운동 관련 저나트륨혈증을 먼저 배제한 뒤 처치는 물 마시기와 다리를 높인 자세예요.
            <Ref>Br J Sports Med 45(14):1157-62 · <a href="https://pubmed.ncbi.nlm.nih.gov/21948122/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Speedy et al. (2003)</strong> 쓰러짐은 대개 결승선을 지난 뒤에 생기고, 달리는 도중에 쓰러졌다면 다른 중한 원인일 가능성이 더 커요. 처치는 다리와 골반을 올리는 것이에요.
            <Ref>Phys Sportsmed · <a href="https://pubmed.ncbi.nlm.nih.gov/20086459/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={6}>
            <strong>Cook et al. (1985)</strong> 실제로 신은 신발은 500마일(약 800km)에 처음 충격흡수 능력의 약 70%가 남아 있었어요. 기계 시험에서는 250~500마일에 60% 미만이었어요. 쿠션이 줄어드는 정도를 잰 연구이고 언제 바꿀지나 부상과의 관계를 정한 연구는 아니에요.
            <Ref>Am J Sports Med 13(4):248-53 · <a href="https://pubmed.ncbi.nlm.nih.gov/4025676/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
