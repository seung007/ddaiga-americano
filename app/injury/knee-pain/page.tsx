import type { Metadata } from "next";
import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, Num, KeyPoints, Steps, OneLine, Caveat, Warn, Sources, Src, Ref } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

/**
 * 무릎 앞 통증 — 아파서 찾아온 사람이 읽는 글
 *
 * 2026-09-14 위치별 분기 추가 — 이 페이지로 들어오는 검색어가 「러닝 후 무릎 옆 통증」인데 본문은 전부 무릎 앞 얘기였다.
 *   들어온 사람이 틀린 답을 받고 있었다. 그래서 맨 앞에서 아픈 자리로 가른다(진단이 아니라 길 안내).
 * 2026-10-07 재검증 — 「원인」 절이 전향 연구 메타분석과 반대였다.
 *   본문의 「약한 고관절 외전근 · 딱딱한 신발」은 Neal 2019 에서 위험 요인이 아니었다. 나이·키·체중·체질량지수·체지방·Q각도 아니었다.
 *   Esculier 2018(러너 69명 무작위 시험)을 글의 중심으로 올렸다.
 * 2026-10-13 가독성 재설계 — 절마다 답 먼저, 숫자는 접힌 상자로.
 * 2026-11-10 제목을 증상 말투로 — 오픈채팅에서 「러너 무릎」은 0명, 「무릎 + 아프다·통증」은 9명이었다.
 *
 * 2026-11-18 확정 틀로 바꿈 (AGENTS.md 「가이드 글 틀 — 2026-11-18 확정」, 견본 app/injury/start-running/page.tsx)
 *   · 말투 「~니다」 → 「~요」. 날짜 한 줄 · 3줄 요약 · 번호 붙은 큰 질문 6개 · 절 끝 한 줄 요약 · 글 끝 접힌 「근거와 출처」 7편.
 *     옛 부품 여섯 개(머리 요약 상자 · 근거 접힘 상자 · 근거 수준 딱지 · 별표 단서 줄 · 글 끝 문헌 목록 · 질문 입력창과 공유 단추)를 걷어냈다.
 *     (옛 부품 이름을 주석에 그대로 적으면 check:geo 가 글에 남은 것으로 세므로 풀어서 적는다.)
 *   · 제목 아래 「협찬 없이 작성」 띠를 뺐다 — 같은 내용이 글 끝 글쓴이 소개에 있고 첫 화면을 차지했다
 *   · 큰 절 4개(원인 · 무엇이 효과 · 얼마나 걸리나 · 신발) → 번호 붙은 큰 질문 6개로 다시 짰다:
 *     자리 가르기 / 멈춤·진료 / 달린 양 / 운동 / 엉덩이 근력 / 신발. 할 일(달린 양·운동)을 오해 바로잡기(엉덩이)보다 앞에 뒀다 —
 *     「할 일이 먼저, 이유는 뒤」. 예후(얼마나 걸리나)는 할 일로 이어지지 않아 FAQ 로 내렸다.
 *     id 는 cause·what-works·shoes 를 그대로 두고 where·stop·exercise 를 더했다. 다른 글이 이 글의 #id 를 거는 곳은 없다(grep 확인).
 *   · 위치 분기 상자를 상황 문장 링크 두 개로 줄였다 — 견본이 아픈 곳별 링크에 쓰는 모양과 같게. 길 안내라는 점은 단서 줄에 남겼다
 *   · 안전 정보는 접지 않는다는 규칙을 유지했다 — 멈춤·진료 신호는 빨간 주의 상자에 그대로 있다
 *
 *   고친 것 — 주장을 초록으로 다시 판정한 결과 (QxMD read.qxmd.com/read/<PMID>, 2026-11-18 직접 열어 대조)
 *   · **「통증 점수를 기준으로 조절한다」와 부상 후 복귀 글의 점수 표 링크를 뺐다.** 그 글이 2026-11-18 에
 *     0~2 / 2~5 / 5 초과 구간을 지웠다(Ullern 2025 초록에 그 구간이 없다). 가리키던 내용이 사라진 안내였다.
 *     점수 없는 기준(달리는 중에 아픔이 커지는가 · 다음 날 아침에 더 아픈가 · 쉬는데도 나아지는 느낌이 없나)으로 바꿨고,
 *     **대체 숫자를 만들지 않았다.** 벽 기대 반 스쿼트 설명의 「통증 점수가 5를 넘으면」도 같은 이유로 뺐다(「아프지 않은 각도까지만」).
 *   · **멈춤 신호의 「쉬었는데도 2주 넘게 그대로다」에서 날짜 숫자를 뺐다.** 멈춤 신호의 기간은 판정 보류다(견본과 같은 판정).
 *     「쉬는데도 나아지는 느낌이 없다」로 바꿨다.
 *   · **뼈 한 점의 압통을 멈춤 목록에서 따로 떼어 「기다리지 말고 진료」로 올렸다**(판정요약 11번, AAFP 2024 기준 「근거 있음」).
 *     다른 신호와 묶어 「며칠 이어지면」으로 쓰지 않고, 날짜 숫자도 넣지 않았다. 정강이 글이 같은 판정을 쓰고 있다.
 *   · **Nielsen 2014 의 정강이 15%·무릎 앞 10% 에 분모와 나라를 문장에 넣었다** — 「달리기를 처음 시작한 덴마크 성인을
 *     따라간 연구에서 다친 254명 중」. 숫자 자체는 이번에 초록에서 다시 확인했다.
 *   · 한 연구에 기댄 단정문의 세기를 낮췄다: Esculier·Lankhorst·Kemler 에 「한 무작위 시험에서」「한 조사에서」를 붙였다.
 *     Neal 2019(전향 연구 18편 메타분석)의 「위험 요인이 아니었다」만 단정으로 뒀고, 「취미 러너는 세 하위 그룹 중 하나」라는 단서를 붙였다.
 *   · 평발·회내 제어 신발 이야기는 이 글에서 주장하지 않고 평발 글로 상황 문장 링크만 걸었다 — 연구가 갈리는 지점이라 그 글이 맡는다.
 *   · 정강이 위험 요인은 설명하지 않고 정강이 글로 링크만 걸었다(그 글이 전담한다). 반대로 무릎 앞 통증 대처는 이 글에서 끝낸다.
 *
 *   확인한 초록 (2026-11-18, 직접 열어서 대조)
 *   · Neal 2019 — 전향 연구 18편 4,818명 중 483명이 무릎 앞 통증이 생겼다. 나이·키·체중·체질량지수·체지방·Q각은 위험 요인이 아님.
 *     엉덩이 근력 약화도 아님. 군인에서 대퇴사두근 약화(표준화 평균차 -0.69), 청소년에서 높은 엉덩이 외전 근력(0.71)만 위험 요인.
 *     하위 그룹은 군인·청소년·취미 러너 셋. 저자들은 바꿀 수 있는 위험 요인을 찾는 것이 시급하다고 했다
 *   · Esculier 2018 — 러너 69명을 교육만 / 교육+운동 / 교육+주법 교정으로 나눈 단일맹검 무작위 시험. 4·8·20주 모두 세 군이 비슷하게 좋아졌고
 *     군×시간 상호작용은 유의하지 않았다. 운동군만 무릎 펴는 근력 증가, 주법 교정군만 분당 걸음 수 +7.0%·수직 부하율 -25.4%.
 *     저자 결론: 증상과 훈련량 관리 교육이 치료의 중심이어야 한다
 *   · Collins 2018 — 41명 전문가 국제 합의문(치료, 예방 아님). 권고: 운동치료(엉덩이+무릎 조합)·여러 중재 병행·발 보조기.
 *     권고하지 않음: 무릎·허리 도수 가동술 단독, 전기치료. 불확실: 테이핑·보조기·침·연부조직 기법·혈류제한 훈련·주법 교정
 *   · Lankhorst 2016 — 무작위 시험 두 개(310명)의 참가자를 5~8년 뒤 조사. 응답 60명(응답률 19.3%), 그중 34명(57%)이 회복이 충분하지 않다고 답했다.
 *     엑스레이 50명 중 48명(98%)은 관절염 소견 없음. 기저 통증 기간 12개월 초과가 추적 시 통증을 예측(R²=0.22)
 *   · Nielsen 2014 PLOS ONE — 933명 코호트 중 부상 254명. 정강이 통증 15%, 무릎 앞 통증 10%, 반월판 9%, 아킬레스 7%, 족저근막 5%.
 *     220명(87%) 회복, 중앙값 71일(9~617일)
 *   · Kemler 2018 — 네덜란드 러너 4,621명(초보 1,405명), 부상 416건. 무릎 30.5%, 아래다리 17.8%. 1,000시간당 초보 8.78 대 경력자 4.24
 *
 *   확인 못 한 것 — 비워 두지 않고 적어 둔다
 *   · 권·호·쪽: QxMD 는 학술지 이름까지만 보여 준다. 여섯 편 모두 저장소가 2026-10-07 에 대조해 둔 값을 그대로 뒀다 — 새로 지어낸 값이 아니다
 *   · Schroeder 2024(AAFP)는 이번에 직접 열지 않았다 — 조회가 막힌 경로다. 부상 후 복귀 글이 쓰는 서지를 그대로 가져왔다
 *   · 세 가지 운동 동작과 횟수는 합의문에 없는 사이트 예시다. 합의문은 엉덩이·무릎 운동의 조합까지만 권고했다
 */

const PAGE_URL = pageUrl("/injury/knee-pain");
const TITLE = "달리면 무릎 앞이 아파요, 어떻게 해야 낫나요?";
const DESC =
  "계단을 내려갈 때 무릎 앞이 아프다면 달리는 양을 조절하는 것이 먼저입니다. 병원에 가야 할 신호와, 엉덩이 근력·신발이 무릎 통증과 실제로 어떤 관계인지 다룹니다.";

export const metadata: Metadata = {
  title: `${TITLE} | 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/knee-pain" },
};

// 2026-11-18: FAQ 는 본문 큰 질문과 겹치지 않는 것만 둔다. 네 문항 모두 본문에서 내려온 곁가지다.
// 전문어는 문항마다 다시 풀이한다 — 답 하나만 따로 인용되기 때문이다(check:geo 가 본다)
const FAQ: FaqItem[] = [
  {
    q: "무릎 앞 통증은 낫는 데 얼마나 걸리나요?",
    a: "며칠 만에 낫는 통증이 아닐 수 있어요. 진단받은 사람을 5~8년 뒤 다시 조사했더니 답한 사람의 절반 넘게 회복이 충분하지 않다고 했어요. 다만 답한 사람이 적어 그대로 믿기는 어려워요. **나아지는 느낌이 없으면 미루지 말고 진료를** 받길 권해요.",
  },
  {
    q: "초보 러너에게 무릎 앞 통증이 흔한 편인가요?",
    a: "흔한 편이에요. 다친 초보 러너 중 **10%가 무릎 앞 통증**이었고, 정강이 통증이 15%로 더 많았어요. 아픈 부위로 묶은 다른 조사에서는 무릎이 가장 많아서, 순위는 세는 방식에 따라 달라져요.",
  },
  {
    q: "테이핑이나 무릎 보호대, 폼롤러는 도움이 되나요?",
    a: "효과가 불확실하다고 정리됐어요. 전문가 합의문은 테이핑과 보호대, 근육을 손으로 푸는 방법을 불확실로 묶었어요. 권한 것은 **엉덩이 운동과 무릎 운동을 함께 하는 것**이에요.",
  },
  {
    q: "걸음 수를 늘리면 무릎 통증이 줄어드나요?",
    a: "통증이 더 줄지는 않았어요. 무릎 앞이 아픈 러너가 걸음 수를 늘리도록 주법을 고친 시험에서 착지 충격은 줄었지만, 증상이 좋아진 정도는 교육만 받은 사람들과 비슷했어요. 걸음 수를 바꾸는 게 나쁘다는 뜻은 아니고, **아플 때 먼저 할 일은 아니에요.**",
  },
];

const pill = "rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400";
const linkCls = "text-emerald-700 underline";

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} datePublished="2025-03-01" />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["무릎 앞 통증", "/injury/knee-pain"],
        ]}
      />
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">무릎</span>
          {/* 규약은 app/injury/page.tsx 상단 주석 */}
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/knee-pain" compact checked={7} />

        <KeyPoints
          items={[
            <>계단이나 내리막에서 아프기 시작했다면 <strong>달린 양부터 줄여 보세요.</strong> 운동을 더하는 것보다 이게 먼저예요.</>,
            <>무릎이 붓거나 힘이 빠지거나 걸리는 느낌이 들면, <strong>그날은 뛰지 말고 진료를 받아요.</strong></>,
            <>엉덩이 근육이 약해서 아픈 건 아니었어요. 신발을 바꿔서 낫는다는 근거도 약해요.</>,
          ]}
        />

        <Lead>
          계단을 내려갈 때나 오래 앉았다 일어날 때 무릎 앞이 아프다면, 먼저 아픈 자리를 손가락으로 짚어 보세요. 무릎의 어디가 아픈지에
          따라 지금 할 일이 달라져요.
        </Lead>

        <TableOfContents
          items={[
            { id: "where", label: "무릎 앞이 맞나요?" },
            { id: "stop", label: "언제 병원에 가나요?" },
            { id: "what-works", label: "무엇부터 해야 하나요?" },
            { id: "exercise", label: "어떤 운동을 하나요?" },
            { id: "cause", label: "엉덩이가 약해서일까" },
            { id: "shoes", label: "신발을 바꾸면 나을까" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="where" className={H2}>
          <Num n={1} />계단 내려갈 때 무릎 앞이 아픈데 무슨 문제인가요?
        </h2>
        <P>
          <strong>무릎 앞 통증</strong>일 때가 많아요. 무릎뼈 주변이 계단을 내려갈 때, 오래 앉았다 일어날 때, 쪼그려 앉을 때 아픈 것이
          특징이고, 이걸 슬개대퇴 증후군이라고 해요.
        </P>
        <P>
          아픈 자리가 앞쪽이 아니면 다른 문제이고 할 일도 달라져요. 아래 두 가지에 해당하면 그 글로 가세요.
        </P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/it-band" className={pill}>무릎 바깥쪽(옆)이 아프다면 →</Link>
          <Link href="/injury/shin-splints" className={pill}>무릎 아래 정강이가 아프다면 →</Link>
        </div>
        <Caveat>
          자리로 가르는 것은 진단이 아니라 길 안내예요. 같은 무릎 통증이라도 자리에 따라 다른 문제이고, 애매하면 다음 절의 신호를 보세요.
        </Caveat>

        <OneLine>앞쪽이 아니라 옆이나 아래가 아프면, 이 글이 아니라 그쪽 글로 가요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="stop" className={H2}>
          <Num n={2} />언제 달리기를 멈추고 병원에 가나요?
        </h2>
        <P>
          무릎 주변 뼈의 한 지점을 누를 때 콕 집어 아프면 <strong>기다리지 말고 진료를 받으세요.</strong> 피로골절을 의심할 신호예요.
          피로골절은 같은 충격이 반복돼 뼈에 생기는 가는 금이에요.
        </P>
        <Warn title="아래에 하나라도 해당하면 달리기를 멈추고 진료를 받으세요">
          <ul className="list-disc space-y-1 pl-5">
            <li>무릎 주변 뼈의 한 지점을 누르면 콕 집어 아프다</li>
            <li>달리지 않을 때도, 걸을 때도 아프다</li>
            <li>무릎이 붓거나 열감이 있다</li>
            <li>무릎에 힘이 갑자기 빠지거나 걸리는 느낌이 든다</li>
            <li>쉬는데도 나아지는 느낌이 없다</li>
          </ul>
        </Warn>
        <Caveat>
          이 목록은 진단 기준이 아니라, 다른 원인을 놓치지 않으려고 저희가 보수적으로 정한 기준이에요. 아래 할 일은 이런 신호가 없을 때
          하는 거예요. 이 글로 자가진단하지 마세요.
        </Caveat>

        <OneLine>뼈 한 지점이 콕 집어 아프거나 걸을 때도 아프면, 참고 뛰지 말고 진료를 받아요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="what-works" className={H2}>
          <Num n={3} />무릎 앞이 아프면 무엇부터 해야 하나요?
        </h2>
        <P>
          <strong>달린 양과 아팠던 상황을 줄이는 것</strong>부터예요. 무릎 앞이 아픈 러너를 세 쪽으로 나눈 한 무작위 시험에서, 증상과
          훈련량을 조절하는 법만 배운 쪽이 운동이나 주법 교정을 더한 쪽과 비슷하게 좋아졌어요.
        </P>
        <Steps
          title="아픈 정도를 보고 조절하는 법"
          items={[
            { t: "달리는 중에 아픔이 커지면 그날은 멈춰요.", d: "참고 더 뛰어서 얻는 건 없어요." },
            { t: "다음 날 아침에 전날보다 아프면 다음 번에 거리를 줄여요.", d: "계단이나 내리막에서 아팠다면 그 상황부터 빼 보세요." },
            { t: "쉬는데도 나아지는 느낌이 없으면 진료를 받아요." },
          ]}
        />
        <Caveat>
          이 세 가지는 저희가 정한 기준이에요. 아픈 정도를 점수로 매겨 가르는 기준은 연구에서 확인한 숫자가 아니라서 쓰지 않았어요.
        </Caveat>
        <P>
          다른 곳을 다쳐 쉬었다가 돌아오는 중이라면{" "}
          <Link href="/injury/return-to-running#rest-or-run" className={linkCls}>쉬었다가 다시 달리기 글</Link>에 순서가 있어요.
        </P>

        <OneLine>운동을 더하기 전에, 달린 양과 아팠던 상황을 먼저 줄여 봐요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="exercise" className={H2}>
          <Num n={4} />어떤 운동을 하면 되나요?
        </h2>
        <P>
          <strong>엉덩이 운동과 무릎 운동을 함께 해 보세요.</strong> 무릎 앞 통증 치료를 다룬 전문가 국제 합의문이 둘을 묶어서
          권고했고, 깔창형 교정구도 권고에 들었어요.
        </P>
        <Steps
          items={[
            { t: "클램셸 15회 × 3세트", d: "옆으로 누워 무릎을 굽힌 채 위쪽 다리를 조개껍데기처럼 벌려요. 엉덩이 쪽이에요." },
            { t: "스텝다운 10회 × 3세트", d: "계단 끝에 서서 한쪽 다리로 천천히 내려와요. 무릎이 발가락 방향을 보게 해요." },
            { t: "벽 기대 반 스쿼트 30초 × 3회", d: "벽에 등을 대고 아프지 않은 각도까지만 굽혀 버텨요. 아프면 각도를 줄여요." },
          ]}
        />
        <Caveat>
          세 동작과 횟수는 저희가 정한 예시예요. 합의문은 엉덩이 운동과 무릎 운동을 함께 하라고까지만 권고했고 어떤 동작을 몇 번 할지는
          정하지 않았어요. 이미 아픈 사람의 치료 권고이고 예방 권고는 아니에요.
        </Caveat>

        <OneLine>동작 종류를 고르는 것보다, 엉덩이와 무릎을 같이 쓰는 게 핵심이에요.</OneLine>

        {/* ── 5 ─────────────────────────────────────────── */}
        <h2 id="cause" className={H2}>
          <Num n={5} />엉덩이가 약해서 무릎이 아픈 건가요?
        </h2>
        <P>
          아니에요. 아프지 않은 사람을 미리 따라가 나중에 무릎 앞 통증이 생기는지 본 연구들을 모은 메타분석에서{" "}
          <strong>엉덩이 근력 약화는 위험 요인이 아니었어요.</strong> 나이와 키, 체중, 체질량지수(BMI), 체지방, 허벅지 근육이 무릎뼈를 당기는 각도(Q각)도
          아니었어요.
        </P>
        <P>
          엉덩이가 약해서 무릎이 안으로 쏠린다는 설명은 이미 아픈 사람을 치료할 때 쓰는 논리예요. 그래서 엉덩이 운동은 예방용이 아니라
          아플 때 하는 운동으로 생각하면 돼요.
        </P>
        <Caveat>
          취미 러너만 따로 본 결론은 약해요. 취미 러너는 세 하위 그룹 중 하나였고, 위험 요인으로 나온 것은 군인에서 허벅지 앞 근력이
          약한 것이었어요.
        </Caveat>
        <P>
          거리를 한꺼번에 늘린 뒤부터 아팠다면{" "}
          <Link href="/injury/start-running#long-day" className={linkCls}>한 번에 길게 뛰는 날</Link>을 보세요. 과사용 부상 전반의
          신호이고, 무릎 앞 통증만 따로 본 근거는 아니에요.
        </P>

        <OneLine>엉덩이가 약해서 생긴 게 아니에요. 그래도 아플 때 하는 운동에는 엉덩이가 들어가요.</OneLine>

        {/* ── 6 ─────────────────────────────────────────── */}
        <h2 id="shoes" className={H2}>
          <Num n={6} />러닝화를 바꾸면 무릎 통증이 나을까요?
        </h2>
        <P>
          <strong>신발로 무릎 통증을 해결한다는 근거는 약해요.</strong> 신발의 쿠션이나 안정화 기능은 앞의 합의문 권고에 없었어요.
          권고에 든 것은 운동과 깔창형 교정구이고, 교정구는 신발 등급과 다른 물건이에요.
        </P>
        <P>
          평발이면 안정화 신발이라는 말도 무릎 통증 해법으로 볼 근거는 없어요. 평발이 걱정된다면{" "}
          <Link href="/injury/flat-feet" className={linkCls}>평발 글</Link>에 연구가 갈리는 지점까지 정리해 뒀어요.
        </P>
        <P>
          다만 <strong>쿠션이 다 닳은 신발은 바꾸는 게 맞아요.</strong> 발볼이나 사이즈가 안 맞는 신발도 그래요. 무릎 정렬과는 다른
          얘기예요.
        </P>

        <OneLine>신발로 무릎 통증이 낫지는 않아요. 다 닳았거나 안 맞는 신발이면 그때 바꿔요.</OneLine>

        <FinderCta
          from="knee-pain"
          variant="inline"
          headline="신발로 무릎 통증이 낫는다는 근거는 약해요. 발볼과 사이즈가 맞는지부터 보세요."
        />

        <div className="mt-14">
          <YoutubeSection links={[
            { label: "무릎 앞 통증 한방에 해결! 슬개대퇴통증증후군 마사지·운동법", channel: "알쓸물치", url: "https://www.youtube.com/watch?v=69TZ8_yYDp4" },
            { label: "무릎통증 러너 필수 시청 — 이것만 풀어도 사라집니다", channel: "통증요정 김학조", url: "https://www.youtube.com/watch?v=kCYjn49dJm0" },
            { label: "무릎 통증 세 가지만 기억하라! (명지병원 정형외과)", channel: "명지병원-MYONGJI HOSPITAL", url: "https://www.youtube.com/watch?v=bKcjVC3jus0" },
            { label: "무릎 부상 후 재활 운동 5단계", channel: "피지오스튜디오 PHYSIOSTUDIO", url: "https://www.youtube.com/shorts/Ixvh9w5uEYs" },
          ]} />

          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Esculier et al. (2018)</strong> 러너 69명을 교육만 · 교육+운동 · 교육+주법 교정으로 나눴더니 4·8·20주 모두 세 군이 비슷하게 좋아졌어요. 저자들은 증상과 훈련량 관리 교육을 치료의 중심에 두라고 결론 냈어요.
            <Ref>Br J Sports Med 52(10):659-666 · <a href="https://pubmed.ncbi.nlm.nih.gov/28476901/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Collins et al. (2018)</strong> 전문가 41명의 국제 합의문이 엉덩이·무릎 운동의 조합과 여러 중재 병행, 발 보조기를 권고했어요. 테이핑·보조기·침·연부조직 기법·혈류제한 훈련·주법 교정은 불확실로, 도수 가동술 단독과 전기치료는 권고하지 않는 쪽으로 분류했어요.
            <Ref>Br J Sports Med 52(18):1170-1178 · <a href="https://pubmed.ncbi.nlm.nih.gov/29925502/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Neal et al. (2019)</strong> 나이·키·체중·체질량지수·체지방·Q각은 위험 요인이 아니었고 엉덩이 근력 약화도 아니었어요. 군인에서 대퇴사두근 약화, 청소년에서 높은 엉덩이 외전 근력만 위험 요인이었어요(전향 연구 18편 4,818명, 그중 483명에게 통증이 생겼어요).
            <Ref>Br J Sports Med 53(5):270-281 · <a href="https://pubmed.ncbi.nlm.nih.gov/30242107/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Lankhorst et al. (2016)</strong> 응답한 60명 중 34명(57%)이 5~8년 뒤에도 회복이 충분하지 않다고 답했어요. 엑스레이를 찍은 50명 중 48명은 관절염 소견이 없었고, 기저 통증 기간이 12개월을 넘은 사람의 예후가 나빴어요. 응답률 19.3%라는 한계가 있어요.
            <Ref>Br J Sports Med 50(14):881-6 · <a href="https://pubmed.ncbi.nlm.nih.gov/26463119/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Nielsen et al. (2014)</strong> 다친 초보 254명 중 무릎 앞 통증이 10%, 정강이 통증이 15%였어요(덴마크 초보 933명 코호트).
            <Ref>PLOS ONE 9(6):e99877 · <a href="https://pubmed.ncbi.nlm.nih.gov/24923269/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={6}>
            <strong>Kemler et al. (2018)</strong> 아픈 부위로 묶으니 무릎 30.5%, 아래다리 17.8%였어요(네덜란드 러너 4,621명, 부상 416건).
            <Ref>Phys Sportsmed 46(4):485-491 · <a href="https://pubmed.ncbi.nlm.nih.gov/30071170/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={7}>
            <strong>Schroeder et al. (2024)</strong> 뼈의 한 지점을 누를 때 아픈 것이 피로골절 진찰에서 가장 중요한 소견이에요. 그냥 두면 완전 골절로 갈 수 있어요.
            <Ref>Am Fam Physician 110(6):592-600 · <a href="https://www.aafp.org/afp/2024/1200/bone-stress-injuries" target="_blank" rel="noopener noreferrer">AAFP</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
