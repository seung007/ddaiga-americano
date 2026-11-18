import type { Metadata } from "next";
import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ExerciseFigure from "@/components/ExerciseFigure";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, Num, KeyPoints, OneLine, Caveat, Sources, Src, Ref } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

/**
 * 달리기 전 준비운동 — 동작을 찾아온 사람이 읽는 글
 *
 * 이 글의 과거 (AGENTS.md 「신뢰」 규칙 5번이 사례로 든 글이다)
 *   2026-09-03 에 「정적 스트레칭이 근육 출력을 10~15% 낮춘다」를 고치면서 조건을 「자세당 60초」로 적었다.
 *   그 조건을 초록에서 확인하지 못한 상태였고, 주석에만 「확인 못 했다」고 적어 뒀다.
 *   11일 뒤(2026-09-14) 다시 열어 보니 Behm & Chaouachi 2011 의 조건은 자세당 60초가 아니었다 —
 *   그동안 틀린 조건이 본문에 사실처럼 살아 있었다. 2026-10-08 에 「근육군당 60초」 기준은
 *   다른 논문(Behm 2016)에 실제로 있는 것을 확인해 출처를 나눠 적었다.
 *
 * 2026-10-08 재검증에서 이미 처리한 것
 *   · 「근육은 차가울 때 탄성이 낮아 미세 파열 위험이 높다」 → 사람 대상 근거 못 찾음, 삭제
 *   · 겨울에 워밍업을 몇 배로 늘려야 하는지 → 근거 못 찾음. 사이트가 정한 기준으로만 적는다
 *   · 찬 공기·마스크 → Frischhut 2020·Beuther 2006 의 범위로 낮춤. 일반 마스크 효과는 확인 못 함
 *   · 영상 제목의 「부상방지」는 제3자 영상 제목이라 그대로 둔다(본문 주장 아님)
 *
 * 2026-11-18 확정 틀로 바꿈 (AGENTS.md 「가이드 글 틀 — 2026-11-18 확정」, 견본 app/injury/start-running/page.tsx)
 *   · 말투 「~니다」 → 「~요」. 날짜 한 줄 · 3줄 요약 · 번호 붙은 큰 질문 4개 · 절 끝 한 줄 요약 · 글 끝 접힌 「근거와 출처」 6편.
 *     옛 부품 여섯 개(머리 요약 상자 · 근거 접힘 상자 · 근거 수준 딱지 · 별표 단서 줄 · 글 끝 문헌 목록 · 공유 단추)를 걷어냈다.
 *     (옛 부품 이름을 주석에 그대로 적으면 check:geo 가 글에 남은 것으로 세므로 풀어서 적는다.)
 *   · 제목 아래 「협찬 없이 작성」 띠를 뺐다 — 같은 내용이 글 끝 글쓴이 소개에 있고 첫 화면을 차지했다
 *   · 「할 일이 먼저」 — 동작 목록을 1절로 올렸다(전에는 3절이었다). 정적 스트레칭 설명이 먼저 나와서
 *     「무슨 동작을 하면 되나」를 찾아온 사람이 두 화면을 읽어야 했다. id 는 routine·static·injury·cold 를 그대로 둔다
 *   · 「이 동작들은 근거가 있나요?」 절을 없애고, 같은 내용을 1절 단서 줄과 FAQ 한 문항으로 옮겼다 —
 *     근거 수준만 설명하는 절을 따로 두지 않는다는 규칙. 지운 내용은 없다
 *   · 동작 6개를 그대로 옮겨 적던 FAQ 문항을 지웠다. 2026-09-03 주석이 「동작을 고치면 두 곳이 갈라진다」고
 *     경고해 둔 자리다 — 한 곳만 남겨 갈라질 자리를 없앴다
 *   · 정리운동(달린 뒤) 쪽 내용은 이 글에서 빼고 쿨다운 글로 상황 문장 링크를 걸었다. 근육통·회복 주장은 그 글이 맡는다
 *
 *   고친 것 — 주장을 초록으로 다시 판정한 결과 (2026-11-18, QxMD read.qxmd.com/read/<PMID> 와 Europe PMC 단건 조회로 직접 열어 대조)
 *   · **「영하 15도 아래에서 강하게 달리면 기관지가 좁아질 수 있다」를 대상과 함께 적었다.** 전에는 대상 없이 사실처럼 적혀 있었다.
 *     이 문장은 Frischhut 2020 초록의 배경 서술이고, 실험은 영하 20도 실험실의 동계 종목 선수 13명이다. 그래서 그 대상을 문장에 넣었다
 *   · **「스트레칭만으로는 부상 예방 효과가 확인되지 않았다」 → 「스트레칭만으로 부상을 막는다는 근거는 없어요」**
 *     (판정요약 8번. 부상 예방과 근육통은 다른 결론이라 섞지 않는다 — 근육통 쪽은 이 글에서 주장하지 않고 쿨다운 글로 보냈다)
 *   · **근거의 무게를 딱지가 아니라 문장이 지게 했다.** 머리 요약의 「연구 근거 / 저희 제안」 꼬리표를 떼고,
 *     사이트가 정한 것(동작·순서·겨울에 길게)은 「해 보세요·권해요」로, 고찰로 확인된 것(60초·근력운동)은 단정으로 적었다
 *   · 워밍업과 부상은 연구가 실제로 갈리는 자리라 갈린다고 그대로 적었다(Fradkin 2006: 5편 중 3편 감소·2편 무효)
 *
 *   확인한 초록 (2026-11-18, 직접 열어서 대조)
 *   · Behm 2016 — 정적 −3.7%, 동적 +1.3%, 전신성 신경근 촉진 −4.4%. 한 근육군당 60초 이상 −4.6% vs 60초 미만 −1.1%.
 *     정적·전신성 신경근 촉진은 부상에 뚜렷한 효과 없음, 동적은 부상 자료 없음. 가동범위 증가는 대개 30분 안쪽.
 *     Europe PMC 단건 조회로 권·호·쪽까지 확인: Appl Physiol Nutr Metab 41(1):1-11 (저장소에는 학술지가 비어 있었다)
 *   · Behm & Chaouachi 2011 — 짧고 약한 강도의 정적 스트레칭은 저하가 없거나 작았고, 동적은 효과가 없거나 조금 올랐다.
 *     권한 순서는 가벼운 유산소 운동, 큰 범위의 동적 스트레칭, 종목별 동적 활동
 *   · Fradkin 2006 — 무작위 시험 5편(전부 질 높음) 중 3편 감소·2편 무효, 근거 불충분하나 감소 쪽에 무게. J Sci Med Sport
 *   · Lauersen 2014 — 무작위 시험 25편 26,610명. 스트레칭 0.963(0.846–1.095), 근력운동 0.315(0.207–0.480),
 *     고유감각 0.550, 복합 0.655. Br J Sports Med
 *   · Frischhut 2020 — 영하 20도 실험실, 동계 종목 선수 13명. 마스크 없이 달렸을 때 노력성 폐활량 −5.9%·1초간 날숨량 −4.2%,
 *     마스크를 쓰면 증상이 적었다(p=0.046). Scand J Med Sci Sports
 *   · Beuther & Martin 2006 — 영하 25~15도, 천식이 있는 15명. 1초간 날숨량 저하가 위약 마스크 19% vs 열교환 마스크 4.3%. Chest
 *
 *   확인 못 한 것 — 비워 두지 않고 적어 둔다
 *   · **Behm & Chaouachi 2011 의 「총 90초 미만」 조건을 오늘 다시 확인하지 못했다.** 저장소가 2026-09-14 에 초록에서 확인해
 *     적어 둔 값인데, 오늘 QxMD 는 인용 글자 수 제한으로 숫자를 생략했고 Europe PMC 는 요청 한도, 다른 두 경로는 막혔다.
 *     그래서 본문과 출처에서 이 숫자를 빼고 「짧게, 아프지 않은 강도로」까지만 적었다 — 대신할 숫자를 만들지 않았다.
 *     초록이 열리는 날 다시 확인해서 넣으면 된다. 실행 가능한 숫자(근육군당 60초)는 오늘 확인된 Behm 2016 쪽에 있다
 *   · 권·호·쪽: Fradkin·Lauersen·Frischhut·Beuther 네 편은 학술지 이름까지만 확인됐다(QxMD 가 권·호·쪽을 보여 주지 않는다).
 *     저장소에도 없던 값이라 지어내지 않고 학술지 이름까지만 적었다. Behm 2011 은 저장소의 2026-10-08 값을 그대로 뒀다
 *   · 개별 동작의 폼·순서·횟수와 「마지막 1분 조깅」은 논문에서 온 값이 아니라 사이트가 정한 예시다. 글에 그렇게 적었다
 *   · 「동적 스트레칭」을 check:geo 의 TERMS 에 더하지 않았다 — 더하면 초보 가이드 글의 제3자 영상 제목이 풀이 없는
 *     전문어로 걸린다(그 제목은 고칠 것이 아니다). 이 글 안에서는 두 말을 처음 나올 때 풀어 썼다
 */

const PAGE_URL = pageUrl("/injury/warmup");
const TITLE = "러닝 전 스트레칭, 정적으로 해도 되나요?";
const DESC =
  "오래 붙들고 늘리는 정적 스트레칭은 짧게, 아프지 않게 하면 됩니다. 몸을 데우는 5분 동적 루틴과 워밍업이 부상을 줄이는지까지 근거와 함께 봅니다.";

export const metadata: Metadata = {
  title: `${TITLE} | 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/warmup" },
};

// 2026-11-18: FAQ 는 본문 큰 질문과 겹치지 않는 것만 둔다. 세 문항 모두 본문에서 내려온 곁가지다.
// 전문어는 문항마다 다시 풀이한다 — 답 하나만 따로 인용되기 때문이다(check:geo 가 본다)
const FAQ: FaqItem[] = [
  {
    q: "이 동작과 순서가 최선인가요?",
    a: "저희가 정한 예시예요. 연구로 확인된 것은 달리기 전에는 한 자세로 버티는 정적 스트레칭보다 관절을 움직이는 동적 스트레칭이 낫다는 방향까지예요. 이 순서가 가장 좋다거나 이 루틴이 부상을 줄인다고는 말하지 않아요. 개별 동작의 폼을 뒷받침하는 연구는 확인하지 못했고, 그림은 동작을 알아보게 그린 도식이에요.",
  },
  {
    q: "준비운동은 달리기 바로 전에 하는 게 좋나요?",
    a: "바로 전에 하는 편이 좋아요. 관절을 움직이면서 몸을 데우는 것을 동적 스트레칭이라고 해요. 여러 연구를 모은 고찰에서 동적 스트레칭은 활동 직전 몇 분 안에 했을 때 그날 수행능력이 조금 오른 편이었어요. 스트레칭으로 늘어난 관절 가동범위도 대개 30분 안쪽이었어요. 그러니 집에서 미리 해 두기보다 달리기 직전에 하는 쪽을 권해요.",
  },
  {
    q: "추운 날 마스크를 쓰면 도움이 되나요?",
    a: "숨에 든 열과 수분을 가두는 보온 마스크를 쓴 쪽에서 달린 뒤 폐 기능 저하와 기침 같은 증상이 적었어요. 다만 영하 20도 실험실에서 동계 종목 선수 13명을 본 연구와, 천식이 있는 15명을 본 연구예요. 둘 다 사람 수가 적고, 평소 쓰는 일반 마스크로 같은 효과가 나는지는 확인하지 못했어요.",
  },
];

const pill = "rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400";
const linkCls = "text-emerald-700 underline";

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
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">준비운동</span>
          {/* 규약은 app/injury/page.tsx 상단 주석 */}
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/warmup" compact checked={6} />

        <KeyPoints
          items={[
            <>뛰기 전에는 제자리 걷기부터 시작해서 <strong>관절을 움직이는 동작으로 5분</strong> 몸을 데워 보세요.</>,
            <>다리를 붙잡고 늘릴 거면 <strong>한 군데를 60초 넘게 붙들지 마세요.</strong> 오래 붙들면 그날 힘이 덜 들어갔어요.</>,
            <>준비운동이 부상을 막아 주는지는 연구마다 결과가 달랐어요. 막아 준다는 쪽이 조금 더 많았어요.</>,
          ]}
        />

        <Lead>
          뛰기 전에 다리를 붙잡고 늘리는 게 맞는지 헷갈린다면, 얼마나 오래 붙드는지만 보면 돼요. 달리기 전에는 한 자세로 버티는 것보다{" "}
          <strong>관절을 움직여 몸을 데우는 쪽</strong>이에요.
        </Lead>

        <TableOfContents
          items={[
            { id: "routine", label: "뛰기 전 5분에 할 동작" },
            { id: "static", label: "정적으로 해도 되나요?" },
            { id: "injury", label: "하면 덜 다치나요?" },
            { id: "cold", label: "추운 날엔 어떻게 하나요?" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="routine" className={H2}>
          <Num n={1} />뛰기 전 5분, 어떤 동작을 하면 되나요?
        </h2>
        <P>
          <strong>아래 여섯 동작을 위에서부터 차례로 해 보세요.</strong> 제자리 걷기로 체온을 올리고 뒤로 갈수록 심박이 올라가는
          순서예요. 마지막 1분은 천천히 조깅으로 마무리하면 돼요.
        </P>
        <P>
          몸을 데우는 게 목적이라 빨리 할 필요는 없어요. 동작마다 적어 둔 횟수는 기준일 뿐이고, 숨이 살짝 가빠지고 다리가 따뜻해지면
          충분해요.
        </P>
        <Caveat>
          동작과 순서, 횟수는 저희가 정한 예시예요. 개별 동작의 폼을 뒷받침하는 연구는 확인하지 못했어요. 그림은 동작을 알아보게 그린
          도식이고 자세를 교정해 주는 자료는 아니에요.
        </Caveat>

        <div className="mt-5 space-y-3">
          <ExerciseFigure
            move="march"
            title="① 제자리 걷기"
            reps="1분"
            cue="체온을 올리는 첫 단계예요. 빨리 할 필요는 없어요. 팔을 같이 흔들면서 숨이 살짝 가빠질 정도면 돼요."
          />
          <ExerciseFigure
            move="legSwing"
            title="② 레그 스윙 (앞뒤·옆)"
            reps="각 10회"
            cue="벽이나 기둥을 짚고 해요. 반동으로 크게 차는 게 흔한 실수예요. 허리가 같이 젖혀지면 범위를 줄이고, 골반은 정면에 둬요."
          />
          <ExerciseFigure
            move="hipCircle"
            title="③ 힙 써클"
            reps="양방향 각 10회"
            cue="손을 허리에 얹고 골반으로 원을 그려요. 상체를 크게 돌리는 게 아니라 골반만 움직이는 동작이에요."
          />
          <ExerciseFigure
            move="lunge"
            title="④ 워킹 런지"
            reps="10보"
            cue="앞으로 한 발 내딛고 내려앉았다가 일어나 반대 발로 이어가요. 앞 무릎이 발끝보다 많이 나가지 않게, 상체는 세운 채로 해요."
          />
          <ExerciseFigure
            move="highKnees"
            title="⑤ 하이 니즈"
            reps="30초"
            cue="무릎을 골반 높이까지 빠르게 올려요. 여기서부터 심박이 확 올라와요. 상체가 뒤로 젖혀지면 속도를 낮춰요."
          />
          <ExerciseFigure
            move="buttKicks"
            title="⑥ 버트 킥스"
            reps="30초"
            cue="뒤꿈치로 엉덩이를 차듯 올려요. 허벅지 앞쪽이 늘어나는 느낌이 나면 제대로 하고 있는 거예요."
          />
        </div>

        <OneLine>제자리 걷기부터 차례로 하고, 마지막은 천천히 조깅으로 마무리해요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="static" className={H2}>
          <Num n={2} />러닝 전에 정적 스트레칭하면 안 되나요?
        </h2>
        <P>
          하면 안 된다기보다 <strong>한 군데를 오래 붙들지 않는 것</strong>이 요점이에요. 정적 스트레칭은 한 자세로 근육을 늘린 채
          버티는 거예요.
        </P>
        <P>
          <strong>한 근육군을 60초 이상</strong> 붙들었을 때 힘이 더 떨어졌어요. 여러 연구를 모은 고찰에서 그보다 짧게 한 쪽은 차이가
          거의 없었고, 짧게 아프지 않은 강도로 하면 저하가 없거나 작았어요.
        </P>
        <P>
          그래서 달리기 전에는 관절을 움직이는 동적 스트레칭을 주로 해요. 다리를 흔들거나 무릎을 올리듯 움직이면서 관절을 쓰는 것을
          동적 스트레칭이라고 해요. 유연성을 늘리는 게 목적이라면 <strong>달린 뒤나 따로 시간을 내서</strong> 해 보세요.
        </P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/cooldown#routine" className={pill}>달린 뒤에 할 동작을 찾는다면 →</Link>
        </div>

        <OneLine>정적 스트레칭을 빼라는 게 아니라, 한 군데를 오래 붙들지 않는 거예요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="injury" className={H2}>
          <Num n={3} />워밍업을 하면 덜 다치나요?
        </h2>
        <P>
          <strong>아직 분명하지 않아요.</strong> 워밍업과 부상을 본 무작위 시험 다섯 편 중 세 편은 부상이 줄었고 두 편은 차이가
          없었어요. 검토한 연구진은 근거가 충분하지 않지만 줄이는 쪽에 무게가 있다고 정리했어요.
        </P>
        <P>
          <strong>스트레칭만으로 부상을 막는다는 근거는 없어요.</strong> 여러 종목의 무작위 시험을 모은 분석에서 스트레칭을 한 쪽과 안
          한 쪽의 부상이 비슷했어요. 같은 분석에서 근력운동을 한 쪽은 부상 위험이 3분의 1 수준이었어요.
        </P>
        <P>
          그러니 준비운동은 몸을 데우는 용도로 하고, 부상을 줄이려면 <strong>한 번에 늘리는 양</strong>을 먼저 챙겨 보세요. 달린 거리를
          한꺼번에 늘린 뒤부터 아프기 시작했다면{" "}
          <Link href="/injury/start-running#long-day" className={linkCls}>가장 길게 뛰는 날</Link>을 보세요.
        </P>

        <OneLine>준비운동으로 부상을 막기는 어려워요. 몸 데우는 용도로 하고, 늘리는 양을 챙겨요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="cold" className={H2}>
          <Num n={4} />추운 날엔 준비운동을 더 길게 해야 하나요?
        </h2>
        <P>
          <strong>몸이 데워졌다고 느낄 때까지 평소보다 길게</strong> 해 보세요. 얼마나 더 길게 해야 하는지 보여주는 연구는 찾지
          못했어요. 저희가 정한 기준이라 시계보다 몸의 느낌으로 보세요.
        </P>
        <P>
          찬 공기에서 세게 달리면 기관지가 일시적으로 좁아지고 기침이 날 수 있어요. 영하 20도 실험실에서 달린 동계 종목 선수들에게 그런
          변화가 있었어요.
        </P>
        <Caveat>
          선수 13명을 본 소규모 연구예요. 추운 날마다 숨쉬기가 힘들거나 기침이 오래 간다면 달리는 요령으로 풀 일이 아니라, 저희는
          진료를 권해요.
        </Caveat>

        <OneLine>추운 날은 몸이 데워진 느낌이 들 때까지 평소보다 길게 데워요.</OneLine>

        <FinderCta
          from="warmup"
          variant="inline"
          headline="준비운동으로 부상을 막기는 어려워요. 발볼과 사이즈가 맞는 신발부터 보세요."
        />

        <div className="mt-14">
          <YoutubeSection links={[
            { label: "러닝 전 동적 스트레칭 — 워밍업 8분, 부상방지·퍼포먼스 향상", channel: "빅씨스 Bigsis", url: "https://www.youtube.com/watch?v=ddJ9JUcIHvU" },
            { label: "러닝 전 꼭 해야 할 동적 스트레칭 #달리기준비운동", url: "https://www.youtube.com/watch?v=rEj3vyacaw4" },
          ]} />

          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Behm et al. (2016)</strong> 한 근육군을 60초 이상 늘리면 수행능력이 평균 −4.6%, 60초 미만이면 −1.1%였어요. 정적 스트레칭은 평균 −3.7%, 동적 스트레칭은 +1.3%였고, 늘어난 가동범위는 대개 30분 안쪽이었어요.
            <Ref>Appl Physiol Nutr Metab 41(1):1-11 · <a href="https://pubmed.ncbi.nlm.nih.gov/26642915/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Behm &amp; Chaouachi (2011)</strong> 짧게, 아프지 않은 강도로 한 정적 스트레칭은 수행능력 저하가 없거나 작았어요. 준비운동은 가벼운 유산소 운동 다음에 큰 범위의 동적 동작을 하는 순서를 권했어요.
            <Ref>Eur J Appl Physiol 111(11):2633-51 · <a href="https://pubmed.ncbi.nlm.nih.gov/21373870/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Fradkin et al. (2006)</strong> 무작위 시험 5편 중 3편은 부상이 줄었고 2편은 차이가 없었어요. 저자들은 근거가 충분하지 않지만 줄이는 쪽에 무게가 있다고 정리했어요.
            <Ref>J Sci Med Sport · <a href="https://pubmed.ncbi.nlm.nih.gov/16679062/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Lauersen et al. (2014)</strong> 스트레칭은 부상 위험비가 0.963(0.846–1.095)으로 줄지 않았고, 근력운동은 0.315(0.207–0.480)였어요(무작위 시험 25편, 26,610명).
            <Ref>Br J Sports Med · <a href="https://pubmed.ncbi.nlm.nih.gov/24100287/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Frischhut et al. (2020)</strong> 영하 20도 실험실에서 달린 동계 종목 선수 13명이 보온 마스크를 썼을 때 폐 기능 저하와 증상이 적었어요. 마스크 없이 달린 뒤에는 노력성 폐활량이 5.9% 떨어졌어요.
            <Ref>Scand J Med Sci Sports · <a href="https://pubmed.ncbi.nlm.nih.gov/31755166/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={6}>
            <strong>Beuther &amp; Martin (2006)</strong> 영하 25도에서 15도 사이 찬 공기에서 천식이 있는 15명을 봤어요. 1초간 날숨량 저하가 위약 마스크 19%, 열교환 마스크 4.3%였어요.
            <Ref>Chest · <a href="https://pubmed.ncbi.nlm.nih.gov/16685008/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
