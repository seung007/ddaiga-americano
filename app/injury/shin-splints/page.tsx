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
 * 정강이 통증 — 아파서 찾아온 사람이 읽는 글
 *
 * 2026-10-07 재검증 — 초록·임상 참고서 원문과 대조
 *   · 「254명을 1년간 추적」 → 933명 코호트 중 부상 254명의 진단 분포(Nielsen 2014). 기간 단정 삭제
 *   · 「2~3cm 한 점」 → 임상 참고서 기준 5cm 미만 국소 압통. 제자리 뛰기·야간통 목록은 이 사이트의 보수적 기준으로 표기
 *   · 기전 → 견인 가설과 경골 휨 가설 둘 다 제시, 확정 안 됨
 *   · 위험 요인 → 메타분석 2편을 출처별로 나눔. 「다리 길이 차이·특정 신발 종류」는 두 메타분석이 다루지 않아 삭제
 * 2026-10-13 가독성 재설계 — 답 → 할 일 → 근거. 위험비·95% CI·연구 수는 접힌 상자로 내렸다
 *
 * 2026-11-18 확정 틀로 바꿈 (AGENTS.md 「가이드 글 틀 — 2026-11-18 확정」, 견본 app/injury/start-running/page.tsx)
 *   · 말투 「~니다」 → 「~요」. 날짜 한 줄 · 3줄 요약 · 번호 붙은 큰 질문 5개 · 절 끝 한 줄 요약 · 글 끝 접힌 「근거와 출처」 7편.
 *     옛 부품 여섯 개(한눈에 요약 상자 · 근거 접힘 상자 · 할 일 상자 · 근거 수준 딱지 · 별표 단서 줄 · 글 끝 문헌 목록)를 걷어냈다.
 *     (옛 부품 이름을 주석에 그대로 적으면 check:geo 가 글에 남은 것으로 세므로 풀어서 적는다.)
 *   · 제목 아래 「협찬 없이 작성했고…」 띠를 뺐다 — 같은 내용이 글 끝 글쓴이 소개에 있고, 첫 화면을 차지했다
 *   · 큰 절 5개(피로골절 구별 · 흔한 정도 · 왜 생기나 · 위험 요인 · 치료) → 번호 붙은 큰 질문 5개로 다시 짰다:
 *     구별 / 멈춤·진료 / 할 일 / 위험 요인 / 다시 달리기. 「흔한 정도」와 「왜 생기나」는 할 일로 이어지지 않아 FAQ 로 내렸다.
 *     id(stress-fracture·risk·treatment)는 그대로 두고 stop·return 을 더했다. 다른 글이 이 글의 #id 를 거는 곳은 없다(grep 확인).
 *     이 글이 내보내는 앵커(return-to-running#bone · training-types#run-walk)는 그대로 살렸다.
 *   · 안전 정보는 접지 않는다는 규칙을 유지했다 — 멈춤·진료 신호는 빨간 주의 상자에 그대로 있다
 *
 *   고친 것 — 주장을 초록으로 다시 판정한 결과 (QxMD read.qxmd.com/read/<PMID> · Europe PMC, 2026-11-18 직접 열어 대조)
 *   · **「발 모양 분류(평발이나 요족) 자체도 Newman 2013 에서 유의하지 않았다」를 뺐다.** Newman 2013 초록은 유의하게 나온 요인만
 *     나열하고, 발 모양 분류를 다뤘다는 서술이 없다. 「확인 못 함」이라 뺐고 대체 문장을 만들지 않았다.
 *     함께 딸려 있던 「관련 있는 것은 평발이냐가 아니라 아치가 얼마나 내려앉느냐다」라는 대비도 같은 이유로 뺐다 —
 *     아치가 내려앉는 정도가 같이 관찰됐다는 쪽만 남기고, 평발 걱정은 평발 글로 상황 문장 링크를 걸었다.
 *     발목 등굽힘과 무릎 정렬 각도가 위험 요인이 아니었다는 쪽은 Hamstra-Wright 2015 초록에서 확인돼 그대로 뒀다.
 *   · **주상골 하강 10mm 초과(위험비 1.99, 95% CI 1.00~3.96)를 본문에서 뺐다.** 신뢰구간이 1.00 에 닿는다 —
 *     AGENTS 「근거의 무게를 넘겨 쓰지 않는다」에 따라 본문 문장으로 쓰지 않고 출처 항목에만 경계선이라고 적었다.
 *   · **예전 병력(위험비 3.74, 95% CI 1.17~11.91)의 세기를 낮췄다.** 구간이 1.17~11.91 로 매우 넓어 크기를 말할 수 없다.
 *     「가장 강한 위험 요인」이 아니라 「더 자주 생기는 편」까지만 쓰고, 크기는 말하기 어렵다고 문장에 적었다.
 *   · **위험 요인 목록을 「고칠 거리」가 아니라고 먼저 밝혔다.** 두 메타분석 다 원인을 가린 연구가 아니고,
 *     집단 사이 차이도 평균으로 보면 작은 편이었다(Newman 2013 의 표준화 평균차 0.24·0.26).
 *   · 치료 문장의 주어를 연구에서 독자가 할 일로 옮겼다 — 「권할 만큼 검증된 치료가 없다」가 결론이 아니라,
 *     「달린 양을 줄이는 것이 지금 할 수 있는 일」이 결론이 되게 했다.
 *   · 멈춤 신호에서 **뼈 한 점의 압통을 따로 떼어 「기다리지 말고 진료」로 올렸다**(판정요약 11번, AAFP 2024 기준 「근거 있음」).
 *     다른 신호와 묶어 「며칠 이어지면」으로 쓰지 않고, **날짜 숫자는 넣지 않았다.**
 *   · 낫는 데 걸리는 기간을 FAQ 에 더했다 — 중앙값 71일, 9~617일, 열 주 뒤에도 절반 가까이 통증.
 *     Nielsen 2014 초록에서 이번에 직접 확인한 값이다. 「쉬는 기간을 정한 권고는 없다」와 어긋나지 않는다(정해진 권고가 없고 실제로 넓게 퍼졌다).
 *
 *   beginner-guide 가 이 글로 넘긴 일 (그 글 머리 주석 참고)
 *   · 신스플린트 위험 요인 목록(체질량지수·아치 내려앉음·가동 범위, Hamstra-Wright 2015)을 그 글에서 덜어내고 이 글에 맡겼다.
 *     이 글에서 판정했다 — 메타분석 2편이라 단정하지 않고 「같이 관찰됐어요」로, 효과 크기는 작은 편이라고 적었다. 여기서 답이 끝난다.
 *
 *   확인한 초록 (2026-11-18, 직접 열어서 대조)
 *   · Hamstra-Wright 2015 — 21편, 메타분석 대상 위험 요인 9개 중 4개가 유의. 체질량지수 가중평균차 0.79(0.38~1.20),
 *     주상골 하강 1.19mm(0.54~1.84), 발목 발바닥굽힘 5.94°(3.65~8.24), 고관절 외회전 3.95°(1.78~6.13). 등굽힘·Q각은 위험 요인 아님.
 *     Europe PMC 에서 Br J Sports Med 49(6):362-369 까지 확인
 *   · Newman 2013 — 러너 연구 10편. 예전 병력 3.74(1.17~11.91), 깔창 사용 2.31(1.56~3.43), 여성 1.71(1.15~2.54),
 *     경력이 짧음 표준화 평균차 -0.74(-1.26~-0.23), 체질량지수 0.24, 주상골 하강 0.26, 10mm 초과 1.99(1.00~3.96).
 *     「오래 쉬는 것보다 분명히 나은 관리법은 확립되지 않았다」도 초록에 있다
 *   · Winters 2013 — 11편. 편향이 적어 권할 수 있는 치료는 없고, 체외충격파가 가장 가능성이 보였다. 스트레칭·근력 운동·보조기는 효과 미확인
 *   · Nielsen 2014 PLOS ONE — 933명 코호트 중 부상 254명. 정강이 통증 15%(1위), 무릎 앞 10%, 반월판 9%, 아킬레스 7%, 족저근막 5%.
 *     220명(87%) 회복, 회복까지 중앙값 71일(9~617일), 열 주 뒤에도 절반 가까이가 500m 두 번을 통증 없이 못 뛰었다
 *   · Kemler 2018 — 네덜란드 러너 4,621명(초보 1,405명), 부상 416건. 무릎 30.5%, 아래다리 17.8%. 초보 발생률 8.78 대 4.24(1,000시간당)
 *   · Lauersen 2014 — 무작위 시험 25편 26,610명. 근력 운동 위험비 0.315(0.207~0.480), 스트레칭 0.963(0.846~1.095)
 *
 *   확인 못 한 것 — 비워 두지 않고 적어 둔다
 *   · **임상 참고서(StatPearls NBK538479)를 이번에 다시 열지 못했다.** 조회에 승인이 필요했고 사람이 자리에 없어 답이 오지 않았다.
 *     5cm 압통 기준·원인 가설·예후는 2026-10-07 에 원문과 대조해 둔 값이라 **세기를 올리지도 내리지도 않고 그대로 뒀다.**
 *     새로 지어낸 값은 없다. 다음 차례에 이 세 가지를 다시 대조할 일이 남아 있다.
 *   · 권·호·쪽: QxMD 는 학술지 이름까지만 보여 준다. Hamstra-Wright 2015 만 Europe PMC 에서 49(6):362-369 를 새로 확인했고,
 *     나머지 다섯 편은 저장소에 있던 값을 그대로 뒀다 — 새로 지어낸 값이 아니다.
 *   · 「효과 크기가 작다」는 해석이다. 초록이 그 말을 쓰지는 않았고, Newman 2013 의 표준화 평균차 0.24·0.26 을 근거로 「작은 편」까지만 적었다.
 */

const PAGE_URL = pageUrl("/injury/shin-splints");
const TITLE = "정강이가 아파요, 신스플린트일까 피로골절일까?";
const DESC =
  "정강이뼈 안쪽을 따라 넓게 아프면 신스플린트, 한 점이 아프면 피로골절을 의심합니다. 병원에 가야 할 신호와 치료 연구가 실제로 말하는 것을 다룹니다.";

export const metadata: Metadata = {
  title: `${TITLE} | 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/shin-splints" },
};

// 2026-11-18: FAQ 는 본문 큰 질문과 겹치지 않는 것만 둔다. 네 문항 모두 본문에서 내려온 곁가지다.
// 전문어는 문항마다 다시 풀이한다 — 답 하나만 따로 인용되기 때문이다(check:geo 가 본다)
const FAQ: FaqItem[] = [
  {
    q: "초보 러너에게 정강이 통증이 가장 흔한 부상인가요?",
    a: "진단명으로 세면 가장 많았다는 연구가 있어요. 다친 초보 러너 중 **15%가 정강이 통증**이었고, 무릎 앞 통증이 10%로 그다음이었어요. 다만 아픈 부위로 묶은 다른 조사에서는 무릎이 가장 많아서, 순위는 세는 방식에 따라 달라져요.",
  },
  {
    q: "정강이 통증은 왜 생기나요?",
    a: "원인은 아직 확정되지 않았어요. 반복되는 충격으로 정강이뼈에 생긴 작은 손상이 **회복되기 전에 쌓인다**는 데까지는 대체로 의견이 같아요. 그다음은 근육이 뼈막을 잡아당긴다는 설명과 뼈가 조금씩 휜다는 설명으로 갈려요.",
  },
  {
    q: "정강이 통증은 낫는 데 얼마나 걸리나요?",
    a: "정해진 기간은 없고 사람마다 크게 달라요. 다친 초보를 따라간 연구에서 **절반이 71일 안에** 나았고, 짧게는 9일, 길게는 617일이 걸렸어요. 날짜를 정해 두기보다 **눌러도 아프지 않은지 보고** 늘리길 권해요.",
  },
  {
    q: "깔창이나 압박 스타킹이 정강이 통증에 도움이 되나요?",
    a: "효과가 확인된 것은 아직 없어요. 치료 연구를 모아 보니 압박 스타킹은 효과가 확인되지 않았어요. 깔창은 써 본 사람에게서 통증이 오히려 더 많이 보였는데, 원래 발에 문제가 있어서 썼을 수도 있어요. 돈을 쓰기 전에 **달리는 양부터 줄이길** 권해요.",
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
          ["정강이 통증", "/injury/shin-splints"],
        ]}
      />
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">부상 부위</span>
          {/* 규약은 app/injury/page.tsx 상단 주석 */}
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/shin-splints" compact checked={7} />

        <KeyPoints
          items={[
            <>정강이뼈 안쪽이 <strong>손가락 하나로 짚을 만큼 좁게</strong> 아프면 기다리지 말고 진료를 받아요.</>,
            <>넓게 퍼져 아픈 거라면 그날 달리기는 멈춰요. 걷기나 자전거로 바꾸고, <strong>아픈 활동부터 줄여 보세요.</strong></>,
            <>깔창이나 압박 스타킹에 돈을 쓰기 전에 <strong>달린 양을 줄이는 것</strong>부터 해 보세요. 검증된 치료는 아직 없어요.</>,
          ]}
        />

        <Lead>
          정강이 안쪽이 아파서 찾아왔다면, 먼저 아픈 자리를 손가락으로 짚어 보세요. 아픈 범위가 좁은지 넓은지에 따라 지금 할 일이
          달라져요.
        </Lead>

        <TableOfContents
          items={[
            { id: "stress-fracture", label: "넓게 아픈가, 한 점이 아픈가" },
            { id: "stop", label: "언제 병원에 가나요?" },
            { id: "treatment", label: "지금 할 수 있는 일" },
            { id: "risk", label: "어떤 사람이 더 잘 생기나요?" },
            { id: "return", label: "다시 달리기" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="stress-fracture" className={H2}>
          <Num n={1} />정강이 통증인지 피로골절인지 어떻게 아나요?
        </h2>
        <P>
          <strong>누르면 아픈 범위가 얼마나 넓은지</strong>로 가늠해요. 피로골절은 같은 충격이 반복돼 뼈에 생기는 가는 금이고,
          정강이 통증은 뼈 가장자리를 따라 넓게 아픈 것이에요.
        </P>
        <Steps
          items={[
            {
              t: "정강이뼈 안쪽 가장자리를 따라 넓게 아프면 정강이 통증이에요.",
              d: "이걸 신스플린트라고 해요. 손가락으로 짚으면 이 근처 전체가 아파요. 연구와 진료 기록에는 내측 경골 스트레스 증후군(MTSS)이라는 이름으로 나와요.",
            },
            {
              t: "아픈 곳이 한 점에 몰려 있으면 피로골절을 의심해요.",
              d: "손가락 하나로 짚을 수 있을 만큼 좁아요. 임상 참고서는 이 범위를 5cm 안쪽으로 봐요.",
            },
          ]}
          title="범위로 가늠하는 법"
        />
        <P>
          둘은 같은 뼈 스트레스 손상의 연속선 위에 있다고 봐요. 그래서 쉬지 않고 계속 뛰면 정강이 통증이 피로골절로 넘어갈 수
          있어요.
        </P>
        <Caveat>
          5cm 기준은 임상 참고서가 쓰는 구별 기준이고, 진단을 대신하지 못해요. 범위가 애매하면 다음 절의 신호를 보세요.
        </Caveat>

        <OneLine>넓게 아프면 정강이 통증, 한 점이 아프면 피로골절을 의심해요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="stop" className={H2}>
          <Num n={2} />언제 달리기를 멈추고 병원에 가나요?
        </h2>
        <P>
          뼈 한 지점이 콕 집어 아프면 <strong>기다리지 말고 진료를 받으세요.</strong> 피로골절을 의심할 신호이고, 그대로 두면
          완전히 부러지는 쪽으로 갈 수 있어요.
        </P>
        <Warn title="아래에 하나라도 해당하면 달리기를 멈추고 진료를 받으세요">
          <ul className="list-disc space-y-1 pl-5">
            <li>아픈 곳이 한 점에 몰려 있고 손가락 하나로 짚을 수 있다</li>
            <li>한 발로 제자리 뛰기를 못 할 정도로 아프다</li>
            <li>밤에 자다가 아파서 깬다, 또는 쉬고 있어도 아프다</li>
            <li>그 부위가 눈에 띄게 붓거나 붉다</li>
            <li>저리거나 감각이 이상하다, 발이 차갑거나 창백해진다</li>
            <li>뛰는 동안 점점 더 심해진다</li>
          </ul>
        </Warn>
        <Caveat>
          이 목록은 진단 기준이 아니라, 피로골절이나 다른 원인을 놓치지 않으려고 저희가 보수적으로 정한 기준이에요. 저림이나
          창백함은 종아리가 부풀어 혈관과 신경을 누르는 다른 질환일 수도 있어요. 이 글로 자가진단하지 마세요.
        </Caveat>
        <P>
          해당하는 것이 없고 넓게 뻐근한 정도라면, 그날 달리기를 멈추고 다음 절의 순서대로 해 보세요. 아픈 곳에 따라 할 일이 다르니,
          무릎 앞이 아프다면 <Link href="/injury/knee-pain" className={linkCls}>무릎 앞 통증 글</Link>이 맞아요.
        </P>

        <OneLine>손가락 하나로 짚을 만큼 좁게 아프면, 참고 뛰지 말고 진료를 받아요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="treatment" className={H2}>
          <Num n={3} />지금 할 수 있는 일은 뭔가요?
        </h2>
        <P>
          <strong>달린 양을 줄이는 것</strong>이에요. 치료 연구를 모은 한 고찰은 권할 만큼 편향이 적은 연구가 없다고 결론지었고,
          그래서 남는 것이 부하 조절이에요.
        </P>
        <Steps
          items={[
            { t: "아픈 활동을 줄여요.", d: "달린 뒤에 아픈 양이 어디부터였는지 떠올려 그 아래로 내려요." },
            { t: "걷기나 수영, 자전거로 체력을 유지해요.", d: "완전히 멈추지 않아도 돼요." },
            { t: "통증 없는 범위에서 천천히 다시 늘려요." },
          ]}
        />
        <P>
          쉬는 기간을 정해 둔 권고는 없고, 사람마다 크게 달라요. 그래서 날짜를 세는 대신 눌러도 아프지 않은지 보고 늘려 보세요.
        </P>
        <P>
          근력 운동은 스포츠 부상 예방 전반에서는 효과가 확인됐지만, <strong>정강이 통증 치료 효과로는 입증되지 않았어요.</strong>{" "}
          정강이 통증에 효과가 있다고 광고하는 제품이나 시술은 대체로 근거보다 앞서 나간 말이에요.
        </P>

        <OneLine>검증된 치료는 아직 없어요. 달린 양을 줄이는 것이 지금 할 수 있는 일이에요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="risk" className={H2}>
          <Num n={4} />어떤 사람이 더 잘 생기나요?
        </h2>
        <P>
          예전에 정강이가 아팠던 적이 있으면 <strong>늘리는 속도를 더 천천히 가져가 보세요.</strong> 한 메타분석에서 더 자주 생기는
          편으로 나왔는데, 값의 범위가 넓어 얼마나 더인지까지는 말하기 어려워요.
        </P>
        <P>
          아래는 <strong>고칠 거리를 찾는 목록이 아니에요.</strong> 원인을 가린 것이 아니라, 정강이 통증이 있는 사람에게서 같이
          관찰된 것들이에요.
        </P>
        <ul className="mt-4 space-y-2 break-keep text-base leading-[1.7] text-gray-800">
          <li>• 예전에 정강이 통증을 겪은 적이 있음</li>
          <li>• 러닝 경력이 짧음</li>
          <li>• 여성</li>
          <li>• 체질량지수(BMI)가 높음</li>
          <li>• 체중을 실었을 때 발 안쪽 아치가 많이 내려앉음</li>
          <li>• 발목을 아래로 펴는 범위, 고관절을 바깥으로 돌리는 범위가 큼</li>
          <li>• 깔창을 쓴 적 있음</li>
        </ul>
        <Caveat>
          집단 사이 차이는 평균으로 보면 작은 편이었어요. 깔창은 원래 발에 문제가 있어서 쓴 것인지 가를 수 없어요. 두 분석 중 첫
          분석은 러너와 군인 연구를 함께 모았어요.
        </Caveat>
        <P>
          반대로 <strong>무릎 정렬 각도(Q각)와 발목을 위로 당기는 범위는 위험 요인이 아니었어요.</strong> 평발인지가 걱정된다면{" "}
          <Link href="/injury/flat-feet" className={linkCls}>평발 글</Link>에 연구가 갈리는 지점까지 정리해 뒀어요.
        </P>

        <OneLine>목록에 들었다고 고칠 거리가 생기는 건 아니에요. 전에 아팠던 적이 있으면 더 천천히 늘려요.</OneLine>

        <FinderCta
          from="shin-splints"
          variant="inline"
          headline="신발이 정강이 통증을 막는다는 근거는 없어요. 발볼과 쿠션 취향으로 좁혀 보세요."
        />

        {/* ── 5 ─────────────────────────────────────────── */}
        <h2 id="return" className={H2}>
          <Num n={5} />다시 달리기는 어떻게 시작하나요?
        </h2>
        <P>
          <strong>눌러도 아프지 않은 날부터</strong> 걷기와 달리기를 섞어 짧게 시작해 보세요. 한 번에 예전 양으로 돌아가지 않는
          것이 핵심이에요.
        </P>
        <Steps
          items={[
            { t: "통증 없이 걷는 것부터 확인해요." },
            {
              t: "걷기와 달리기를 섞어 짧게 시작해요.",
              d: (
                <>
                  순서는 <Link href="/injury/training-types#run-walk" className={linkCls}>걷기-달리기 글</Link>에 있어요.
                </>
              ),
            },
            { t: "다음 날 아침에 더 아프면 늘리지 말고 같은 양으로 다시 해요." },
          ]}
        />
        <P>
          뼈 쪽 부상에서 돌아오는 순서를 알고 싶다면{" "}
          <Link href="/injury/return-to-running#bone" className={linkCls}>쉬었다가 다시 달리기 글</Link>을 보세요.
        </P>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/injury/start-running" className={pill}>처음부터 다시 쌓는다면 →</Link>
          <Link href="/injury/beginner-guide" className={pill}>주 횟수와 거리를 알고 싶다면 →</Link>
        </div>

        <OneLine>눌러도 아프지 않은 날부터, 걷기를 섞어 짧게 다시 시작해요.</OneLine>

        <div className="mt-14">
          <YoutubeSection links={[
            // 2026-08-31: 검색 URL을 실제 영상으로 교체.
            // channel은 일부러 비워둔다 — 실제 업로더를 확인하지 않았고,
            // 짐작으로 채우는 것이 이 저장소에서 40건 오류를 만든 원인이다.
            // npm run check:youtube 가 확인해준 이름으로 채울 것.
            { label: "정강이 통증, 신스프린트 vs 피로골절! 러너 필수 체크", channel: "연세이음정형외과", url: "https://www.youtube.com/watch?v=JfAEEhy5iEg" },
            { label: "정강이 피로골절 — 정의, 진단, 감별진단", channel: "선수촌병원", url: "https://www.youtube.com/watch?v=eAgBvQWuifA" },
          ]} />

          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Nielsen et al. (2014)</strong> 다친 초보 254명 중 정강이 통증이 15%로 가장 많았고 무릎 앞 통증이 10%였어요. 낫기까지 걸린 기간은 중앙값 71일, 범위 9~617일이었어요(초보 933명 코호트).
            <Ref>PLOS ONE 9(6):e99877 · <a href="https://pubmed.ncbi.nlm.nih.gov/24923269/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Kemler et al. (2018)</strong> 아픈 부위로 묶으니 무릎 30.5%, 아래다리 17.8%였어요(네덜란드 러너 4,621명).
            <Ref>Phys Sportsmed 46(4):485-491 · <a href="https://pubmed.ncbi.nlm.nih.gov/30071170/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Hamstra-Wright et al. (2015)</strong> 체질량지수 0.79, 주상골 하강 1.19mm, 발목 발바닥굽힘 5.94°, 고관절 외회전 3.95°만큼 차이가 났어요. 발목 등굽힘과 무릎 정렬 각도는 위험 요인이 아니었어요(러너와 군인 연구 21편).
            <Ref>Br J Sports Med 49(6):362-369 · <a href="https://pubmed.ncbi.nlm.nih.gov/25185588/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={4}>
            <strong>Newman et al. (2013)</strong> 예전 병력 위험비 3.74(1.17~11.91), 깔창 사용 2.31, 여성 1.71, 짧은 경력이 같이 나왔어요. 주상골 하강 10mm 초과는 1.99(1.00~3.96)로 경계선이라 본문에 쓰지 않았어요(러너 연구 10편).
            <Ref>Open Access J Sports Med 4:229-41 · <a href="https://pubmed.ncbi.nlm.nih.gov/24379729/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={5}>
            <strong>Winters et al. (2013)</strong> 권할 만큼 편향이 적은 치료는 없었고, 가장 가능성이 보인 것은 체외충격파였어요. 스트레칭·근력 운동·보조기는 효과가 확인되지 않았어요(치료 연구 11편).
            <Ref>Sports Med 43(12):1315-33 · <a href="https://pubmed.ncbi.nlm.nih.gov/23979968/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={6}>
            <strong>Lauersen et al. (2014)</strong> 근력 운동은 스포츠 부상을 3분의 1 아래로 줄였어요(위험비 0.32, 무작위 시험 25편). 스트레칭은 줄이지 못했어요.
            <Ref>Br J Sports Med 48(11):871-7 · <a href="https://pubmed.ncbi.nlm.nih.gov/24100287/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={7}>
            <strong>StatPearls</strong> 누르면 아픈 범위로 피로골절과 가르는 기준, 원인 가설, 예후를 여기서 확인했어요. 2026-10-07 에 원문과 대조한 값이고, 2026-11-18 에는 다시 열지 못해 그대로 뒀어요.
            <Ref><a href="https://www.ncbi.nlm.nih.gov/books/NBK538479/" target="_blank" rel="noopener noreferrer">StatPearls — Medial Tibial Stress Syndrome</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
