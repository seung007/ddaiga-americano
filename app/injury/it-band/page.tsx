import Link from "next/link";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Up, S } from "@/components/guide/Up";
import { Lead, P, H2, H3, Summary, Todo, Evidence, References, Basis, Warn, Note } from "@/components/guide/Read";
import type { Metadata } from "next";

/**
 * 장경인대 증후군 — 2026-10-06 전면 개편
 *
 * 왜 다시 썼나
 *   · DC 러닝 갤러리 「부상관리」 말머리 300건(2025-10~2026-10)을 제목으로 분류하니, 부위가 나온 글의
 *     **작성자 기준 1위가 무릎 바깥·장경인대(37명)** 였다. 사이트에서 가장 짧은 축(3분)의 글이었다.
 *   · 기존 본문에 인용 없는 단정이 여럿 있었다 —
 *       「달리기를 시작한 지 한두 달」「이미 인대에 염증이 시작된 것」「억지로 달리면 회복에 4~6주」
 *       「즉시 거리를 30% 줄인다」「폼롤러로 주변 근육을 풀면 인대 장력이 줄어든다」
 *     그리고 FAQ 가 「거리 증가와 관련 있다는 보고(Sanchez-Alvarado 2024)」라고 적었는데 그 초록에 그런 내용이 없다.
 *   · 「마찰」 설명도 낡았다 — 해부 연구(Fairclough 2006)는 마찰보다 압박을 지목한다.
 *
 * 규칙: 숫자는 PubMed 초록에서 확인한 값만(2026-10-06). 예시 운동·셀프 체크는 사이트 기준이라고 표시한다.
 * 커뮤니티 집계는 건수만 남기고 원 제목·닉네임은 저장하지 않는다.
 *
 * 2026-10-13 가독성 재설계 — 「먼저 결론」 → <Summary>. 섹션마다 답 → 할 일 → 근거(접힘).
 *   숫자·인원·인용은 <Evidence> 안으로. 단서(표본 수·대조군 없음·여성 러너만·힘줄 연구 모델)는 본문/<Note> 에 남김.
 *   진료 신호는 <Warn>. 참고 논문은 기본 접힘.
 */

const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/it-band";
const TITLE = "장경인대 증후군 — 무릎 바깥 통증, 왜 생기고 무엇이 효과 있나";
const DESC =
  "달리다 무릎 바깥이 아프고 내리막에서 심해진다면. 마찰이 아니라 압박이라는 해부 연구, 장경인대는 거의 늘어나지 않는다는 측정, 엉덩이 외전근 강화로 6주 만에 24명 중 22명이 복귀한 연구까지 정리했습니다.";

export const metadata: Metadata = {
  title: "장경인대염 대처법 — 무릎 바깥 통증, 논문으로 확인한 것 | 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/it-band" },
};

const FAQ: FaqItem[] = [
  {
    q: "달릴 때 무릎 바깥쪽이 아픈 이유는 뭔가요?",
    a: "가장 흔한 원인 중 하나가 장경인대 증후군입니다. 러닝 부상의 약 10%로 보고됩니다(Sanchez-Alvarado 2024). 무릎을 30도쯤 굽힐 때 장경인대가 그 아래 지방 조직을 누르는 것이 원인으로 지목됩니다(Fairclough 2006). 다만 무릎 바깥 통증은 반월상연골·인대 문제일 수도 있어 확정은 진료로 합니다.",
  },
  {
    q: "장경인대 스트레칭과 폼롤러가 효과 있나요?",
    a: "장경인대가 늘어나는 정도는 0.5% 미만으로 측정됐고, 연구진은 장경인대를 늘리는 치료의 근거에 의문을 제기했습니다(Falvey 2010). 장경인대 자체를 늘린다는 기대는 근거가 약합니다. 폼롤러로 장경인대 증후군이 낫는다는 연구는 찾지 못했습니다. 근거가 있는 것은 엉덩이 외전근 강화입니다.",
  },
  {
    q: "장경인대 증후군이면 달리기를 완전히 쉬어야 하나요?",
    a: "장경인대 증후군만 따로 시험한 연구는 찾지 못했습니다. 힘줄 부상 연구에서 쓰는 통증 모니터링 모델(0~10점 중 5 이하, 다음 날 아침엔 가라앉을 것)을 참고할 수 있고, 내리막은 피하세요. 내리막에서는 착지할 때 무릎이 덜 굽어 자극받는 각도에 더 머뭅니다(Orchard 1996).",
  },
  {
    q: "얼마나 걸려야 낫나요?",
    a: "치료 연구들의 기간은 2~8주였습니다(Sanchez-Alvarado 2024). 엉덩이 외전근을 중심으로 6주 재활한 장거리 러너 24명 중 22명이 통증 없이 달리기로 돌아갔다는 보고가 있지만 대조군이 없는 사례 연구입니다(Fredericson 2000).",
  },
];

export default function ITBandPage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} datePublished="2025-03-01" />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["장경인대 증후군", "/injury/it-band"],
        ]}
      />
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">무릎 바깥 · 3~4단계</span>
          <span className="text-xs text-gray-400">5분 읽기</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <Lead>
          달리다 무릎 바깥이 아프고 내리막에서 심해진다면 장경인대 증후군일 수 있습니다. 왜 생기는지, 무엇이 실제로 효과 있는지만
          추렸습니다.
        </Lead>

        <Summary
          items={[
            <>무릎 바깥 뼈 돌출부 근처가 아프고 <strong>내리막에서 심해지면</strong> 의심합니다. 확정은 진료로.<Basis kind="rule" /></>,
            <>&lsquo;마찰&rsquo;보다 <strong>압박</strong>: 무릎을 30도쯤 굽힐 때 장경인대가 그 아래 지방 조직을 누릅니다.<Basis kind="paper" /></>,
            <>장경인대는 <strong>거의 늘어나지 않습니다</strong>. 스트레칭으로 늘린다는 기대는 근거가 약합니다.<Basis kind="paper" /></>,
            <>근거가 가장 많은 대처는 <strong>엉덩이 외전근 강화</strong>입니다. 치료 연구들의 기간은 2~8주였습니다.<Basis kind="paper" /></>,
          ]}
        />

        <TableOfContents
          items={[
            { id: "how-common", label: "얼마나 흔한가" },
            { id: "why", label: "왜 생기나" },
            { id: "check", label: "내 증상이 맞을까" },
            { id: "what-works", label: "무엇이 효과 있나" },
            { id: "how-long", label: "얼마나 걸리나" },
            { id: "doctor", label: "병원 갈 신호" },
          ]}
        />

        {/* ── 흔한가 ─────────────────────────────────────────── */}
        <h2 id="how-common" className={H2}>
          얼마나 흔한가요
        </h2>
        <P>러닝 부상의 약 10%로 보고됩니다. 러닝에서 두 번째로 흔한 부상이라고 적은 고찰도 있습니다.</P>
        <Evidence n={2}>
          <p>
            러닝 부상의 약 10%를 차지합니다.{" "}
            <S>(Sanchez-Alvarado et al. (2024) <Up h="https://pubmed.ncbi.nlm.nih.gov/39247485/" />)</S>
          </p>
          <p>
            러닝에서 두 번째로 흔한 부상이라고 적은 고찰도 있습니다.{" "}
            <S>(Aderem &amp; Louw (2015) <Up h="https://pubmed.ncbi.nlm.nih.gov/26573859/" />)</S>
          </p>
        </Evidence>
        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-[15px] leading-[1.7] text-gray-700">
          <p className="font-semibold text-gray-900">국내 러닝 커뮤니티에서는 1위</p>
          <p className="mt-1 break-keep">
            DC 러닝 마이너 갤러리의 「부상관리」 글 300건(2025년 10월~2026년 10월) 제목을 저희가 분류했더니, 부위가 나온 글의 작성자
            기준으로 <strong>무릎 바깥·장경인대가 37명으로 가장 많았습니다</strong>. 그다음이 무릎(그 외) 25명, 발바닥·발목 각 13명입니다.
          </p>
          <p className="mt-2 break-keep text-xs text-gray-500">
            한계: 제목만 본 분류이고, 진단이 아니라 본인이 적은 부위이며, 하프·풀코스를 준비하는 러너가 많은 커뮤니티입니다. 원 제목과 닉네임은
            저장하지 않았습니다.
          </p>
        </div>

        {/* ── 왜 ─────────────────────────────────────────── */}
        <h2 id="why" className={H2}>
          왜 생기나요
        </h2>
        <P>
          <strong>마찰보다 압박입니다.</strong> 사체와 MRI를 본 한 해부 연구는 무릎을 30도쯤 굽힐 때 장경인대가 그 아래의
          지방층을 누르는 것을 원인으로 봤습니다. 예전에는 뼈 위를 문지르는 &lsquo;마찰&rsquo;로 설명했습니다.
        </P>
        <P>
          <strong>내리막에서 더 아픈 이유</strong>는 착지 때 무릎이 덜 굽어 이 각도에 더 머물기 때문이라고, 장경인대 증후군 러너 9명을 분석한
          연구진은 설명합니다. 평지에서 빠르게 달릴 때는 무릎이 더 굽어 덜 자극된다고 봅니다.
        </P>
        <P>
          <strong>엉덩이 근력·움직임</strong>과 관련 있다는 연구가 있지만, 약해서 아픈 건지 아파서 약해진 건지는 가릴 수 없습니다.
        </P>
        <Note>
          연구 수가 적고 차이도 작았습니다. 엉덩이 외전근 근력이 낮았던 건 지금 증상이 있는 여성 러너뿐이었고, 남녀의 위험 요인이
          달랐습니다.
        </Note>
        <P>
          <strong>훈련량</strong>도 봅니다. 장경인대만 따로 본 연구는 아니지만, 한 번 달린 거리가 지난 30일 최장 거리보다 10% 넘게
          길면 과사용 부상이 더 많았습니다.
        </P>
        <Evidence n={5}>
          <p>
            오랫동안 장경인대가 허벅지뼈 바깥 돌출부 위를 앞뒤로 &lsquo;문지르는&rsquo; 마찰 증후군으로 설명됐습니다. 사체 15구와 MRI를
            본 해부 연구는 장경인대가 허벅지뼈에 섬유로 고정돼 있어 굴러 넘어가지 않고, 무릎을 30도쯤 굽힐 때 그 아래의 신경·혈관이
            풍부한 지방층을 누른다고 봤습니다. 환자의 MRI 변화도 그 지방층에 있었습니다.{" "}
            <S>(Fairclough et al. (2006) <Up h="https://pubmed.ncbi.nlm.nih.gov/16533314/" />)</S>
          </p>
          <p>
            장경인대 증후군 러너 9명을 분석한 연구에서 발이 닿는 순간 무릎 굽힘은 평균 21.4도로, 자극이 생기는 30도 부근에 걸려
            있었습니다. 내리막은 착지 때 무릎이 덜 굽어 이 각도에 더 머물고, 평지에서 빠르게 달릴 때는 무릎이 더 굽어 덜 자극된다고
            설명합니다. <S>(Orchard et al. (1996) <Up h="https://pubmed.ncbi.nlm.nih.gov/8734891/" />)</S>
          </p>
          <p>
            13개 연구를 모은 고찰에서 나중에 장경인대 증후군이 생긴 여성 러너는 착지 중 고관절이 안으로 더 모이고 무릎이 안으로 더
            돌았습니다. 다만 연구 수가 적고 효과 크기도 작았습니다.{" "}
            <S>(Aderem &amp; Louw (2015) <Up h="https://pubmed.ncbi.nlm.nih.gov/26573859/" />)</S>
          </p>
          <p>
            17편을 검토한 메타분석(정량 분석 10편)에서는 지금 증상이 있는 여성 러너만 엉덩이 외전근 근력이 낮았고, 남녀의 위험 요인이
            달랐습니다. <S>(Foch et al. (2023) <Up h="https://pubmed.ncbi.nlm.nih.gov/36758425/" />)</S> 약해서 아픈 건지 아파서
            약해진 건지는 이 연구들로 가릴 수 없습니다.
          </p>
          <p>
            장경인대만 따로 본 연구는 아니지만, 과사용 부상 전반에서 한 번 달린 거리가 지난 30일 최장 거리보다 10% 넘게 길면 부상
            비율이 1.52~2.28배였습니다.{" "}
            <S>(Frandsen et al. (2025) <Up h="https://pubmed.ncbi.nlm.nih.gov/40623829/" />)</S>
          </p>
        </Evidence>

        {/* ── 셀프 체크 ─────────────────────────────────────── */}
        <h2 id="check" className={H2}>
          내 증상이 맞을까 — 셀프 체크
        </h2>
        <Todo
          title="이런 패턴이면 의심합니다"
          basis="rule"
          items={[
            "아픈 곳이 무릎 바깥, 관절보다 조금 위의 뼈 돌출부 근처다",
            "달리기 시작하자마자보다 일정 시간·거리가 지나서 아파진다",
            "내리막이나 계단을 내려갈 때 더 아프다",
            "쉬면 가라앉았다가 다음에 비슷한 거리에서 다시 아프다",
          ]}
        />
        <Note>위 체크 항목은 저희가 정리한 것이며 진단이 아닙니다.</Note>
        <Warn title="다른 원인일 수 있는 신호">
          무릎이 붓거나, 걸리거나 잠기는 느낌이 있거나, 비틀린 뒤 아파졌다면 반월상연골·인대 등 다른 원인일 수 있습니다 — 진료를
          받으세요.
        </Warn>

        {/* ── 효과 ─────────────────────────────────────────── */}
        <h2 id="what-works" className={H2}>
          무엇이 효과 있나요
        </h2>

        <h3 className={H3}>1. 엉덩이 외전근 강화 — 근거가 가장 많은 것</h3>
        <P>
          치료 연구 13편을 모아 보니 <strong>엉덩이 외전근 강화</strong>가 공통 전략이었고, 2~8주 사이 통증과 기능이 좋아졌습니다.
        </P>
        <Note>연구끼리 차이가 커서 결과를 합쳐 계산하지는 못했고, 13편 중 6편은 사례 보고였습니다.</Note>
        <Evidence n={1}>
          <p>
            러너 장경인대 증후군의 보존적 치료 연구 13편(201명)을 모은 고찰에서 엉덩이 외전근 강화가 공통 전략으로 나타났고, 통증은
            27~100%, 기능은 10~57% 좋아졌습니다(2~8주). 연구끼리 차이가 커서 메타분석은 못 했고, 13편 중 6편은 사례 보고였습니다.
            체외충격파나 도수치료를 더하는 방식도 언급됩니다.{" "}
            <S>(Sanchez-Alvarado et al. (2024) <Up h="https://pubmed.ncbi.nlm.nih.gov/39247485/" />)</S>
          </p>
        </Evidence>
        <div className="mt-4 rounded-xl bg-yellow-50 p-4 text-[15px] leading-[1.7] text-gray-700">
          <p className="mb-2 text-sm font-bold text-gray-900">
            예시 운동
            <Basis kind="rule" />
          </p>
          <ol className="list-inside list-decimal space-y-1.5 break-keep">
            <li>옆으로 누워 다리 들기 — 위쪽 다리를 곧게 편 채 천천히 들고, 발끝은 앞을 향하게. 15회 × 3세트</li>
            <li>클램셸 — 옆으로 누워 무릎을 굽히고 발은 붙인 채 위쪽 무릎만 벌리기. 15회 × 3세트</li>
            <li>계단 골반 떨어뜨리기 — 한 발로 계단 끝에 서서 반대쪽 골반을 천천히 내렸다 올리기. 10회 × 3세트</li>
          </ol>
          <p className="mt-2 text-xs text-gray-500">위 연구들이 쓴 운동 구성은 연구마다 달랐습니다. 이 목록은 특정 연구의 프로토콜이 아닙니다.</p>
        </div>

        <h3 className={H3}>2. 달리기 조절 — 멈추기보다 고르기</h3>
        <Todo
          basis="rule"
          items={[
            "내리막을 피하고 평지에서 달립니다(위 내리막 설명).",
            "아프기 시작하는 시간·거리보다 짧게 끊습니다.",
            <>
              통증 기준은{" "}
              <Link href="/injury/return-to-running#rest-or-run" className="text-emerald-700 underline">
                부상 후 복귀 글의 통증 모니터링 모델
              </Link>
              을 참고합니다.
            </>,
          ]}
        />
        <Note>그 통증 모니터링 모델은 힘줄 연구에서 쓰였고, 장경인대에서 따로 시험된 것은 아닙니다.</Note>

        <h3 className={H3}>3. 스트레칭·폼롤러 — 기대를 낮추기</h3>
        <P>
          사체 해부 실험에서 흔한 스트레칭 동작을 했을 때 장경인대가 늘어난 정도는 <strong>평균 0.5% 미만</strong>이었습니다.
          연구진은 장경인대를 늘리는 치료의 근거에 의문을 제기했습니다.
        </P>
        <P>폼롤러로 장경인대 증후군이 낫는다는 연구는 찾지 못했습니다. 시원하면 해도 되지만 치료로 기대하지는 마세요.</P>
        <Evidence n={1}>
          <p>
            사체 20구 해부에서 장경인대는 허벅지를 둘러싼 근막이 바깥쪽에서 두꺼워진 것으로, 허벅지뼈에 길게 붙어 있었습니다. 흔한
            스트레칭 세 동작이 만드는 변형률은 동작마다 크게 달랐고, 측정된 장경인대 신장은 평균 0.5% 미만(효과 크기 0.04)이었습니다.
            저자들은 장경인대를 늘리는 치료의 근거에 의문을 제기하고, 근육 쪽(대퇴근막장근)을 봐야 한다고 했습니다.{" "}
            <S>(Falvey et al. (2010) <Up h="https://pubmed.ncbi.nlm.nih.gov/19706004/" />)</S>
          </p>
        </Evidence>

        <h3 className={H3}>4. 의료진이 쓰는 방법</h3>
        <P>
          증상이 생긴 지 2주가 안 된 러너 18명의 작은 무작위 시험에서, 스테로이드 주사가 14일째 달리기 중 통증을 더 많이
          줄였습니다. 주사 여부는 진료에서 정할 일입니다.
        </P>
        <Evidence n={1}>
          <p>
            증상이 생긴 지 2주가 안 된 러너 18명을 나눈 무작위 시험에서, 스테로이드 주사를 맞은 그룹이 14일째 달리기 중 통증이 더 많이
            줄었습니다. <S>(Gunter &amp; Schwellnus (2004) <Up h="https://pubmed.ncbi.nlm.nih.gov/15155424/" />)</S>
          </p>
        </Evidence>

        {/* ── 기간 ─────────────────────────────────────────── */}
        <h2 id="how-long" className={H2}>
          얼마나 걸려야 낫나요
        </h2>
        <P>
          치료 연구들의 기간은 2~8주였습니다. 엉덩이 외전근 중심 6주 재활 뒤 <strong>장거리 러너 24명 중 22명이 통증 없이 달리기로
          돌아갔다</strong>는 보고가 있습니다.
        </P>
        <Note>대조군이 없는 사례 연구입니다.</Note>
        <P>
          돌아올 때는 부상 전 거리가 아니라 <strong>지난 30일 최장 거리의 110%</strong> 안에서 늘립니다 →{" "}
          <Link href="/injury/return-to-running#comeback" className="text-emerald-700 underline">
            복귀 진도
          </Link>
          <Basis kind="rule" />
        </P>
        <Evidence n={1}>
          <p>
            장경인대 증후군이 있는 장거리 러너 24명이 엉덩이 외전근(중둔근) 중심의 6주 재활을 했더니 외전근 근력이 여성 34.9%, 남성
            51.4% 늘었고, 24명 중 22명이 통증 없이 달리기로 돌아갔으며 6개월 뒤 재발 보고가 없었습니다. 대조군이 없는 사례
            연구입니다. <S>(Fredericson et al. (2000) <Up h="https://pubmed.ncbi.nlm.nih.gov/10959926/" />)</S>
          </p>
        </Evidence>

        {/* ── 병원 ─────────────────────────────────────────── */}
        <h2 id="doctor" className={H2}>
          병원에 가야 할 신호
        </h2>
        <Warn title="이러면 진료를 받으세요 (저희 기준)">
          <ul className="list-disc space-y-1 pl-5">
            <li>2주 이상 쉬어도 통증이 줄지 않는다</li>
            <li>걷기만 해도 무릎 바깥이 아프다</li>
            <li>무릎이 붓거나 열감이 있다</li>
            <li>무릎이 걸리거나 잠긴다</li>
          </ul>
        </Warn>

        <YoutubeSection
          links={[
            { label: "러닝할 때 무릎 바깥쪽이 아픈 이유는? 장경인대증후군이란?", channel: "닥터내비", url: "https://www.youtube.com/watch?v=vqe3vSYP3jo" },
            { label: "무릎 통증, 치료법 다 모여라! 장경인대증후군 자가 운동법", channel: "이정표의 레그웰", url: "https://www.youtube.com/watch?v=c7-JDyYg4c0" },
            { label: "[장경인대증후군] 러너에게 흔한 통증질환 TOP3", channel: "화이팅!통증피디아", url: "https://www.youtube.com/watch?v=4Y7xKZc6KtE" },
            { label: "정형외과 의사가 생각하는 달리기 부상과 장경인대염", channel: "러너의 풍경", url: "https://www.youtube.com/watch?v=z3UUVQf57m0" },
            { label: "자전거·러닝 전 이거 안 하면 무릎 나갑니다! 3분 장경인대증후군", channel: "이정표의 레그웰", url: "https://www.youtube.com/shorts/uNI9DtqCy6M" },
            { label: "무릎 통증(장경인대 통증) 해결! 러닝 자세 Before & After", channel: "아인즈 러닝랩 / EINZ Runninglab", url: "https://www.youtube.com/shorts/Ar7Fijekr_8" },
            { label: "장경인대 스트레칭", channel: "알쓸참본", url: "https://www.youtube.com/shorts/HPsUUJlEiKk" },
          ]}
        />

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <div className="mt-10 rounded-2xl bg-emerald-50 p-6">
          {/* 2026-10-06: 「장경인대염 예방에 적합한 신발」은 같은 글 본문(신발로 해결한다는 근거 없음)과 반대였다. */}
          <p className="mb-2 font-medium text-emerald-900">지금 신발이 발에 맞는지 확인해 보세요</p>
          <p className="mb-4 break-keep text-sm text-emerald-800">
            장경인대 증후군을 신발로 고친다는 근거는 찾지 못했습니다. 다만 발볼·사이즈가 안 맞는 신발은 바꾸는 게 맞습니다.
          </p>
          <Link
            href="/shoe-finder"
            className="inline-block rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            내 러닝화 찾기 →
          </Link>
        </div>

        <References n={9} title="참고 논문" note="2026-10-06 PubMed 초록과 대조했습니다.">
          <ul>
            <li>
              <strong>Sanchez-Alvarado et al. (2024)</strong> — 러너 장경인대 증후군 보존적 치료 13편 체계적 고찰. Front Sports Act Living
              6:1386456.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/39247485/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
            <li>
              <strong>Fairclough et al. (2006)</strong> — 장경인대의 기능 해부, 마찰보다 지방층 압박. J Anat 208(3):309-16.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/16533314/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
            <li>
              <strong>Orchard et al. (1996)</strong> — 러너 장경인대 증후군의 생체역학, 내리막 위험. Am J Sports Med 24(3):375-9.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/8734891/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
            <li>
              <strong>Aderem &amp; Louw (2015)</strong> — 장경인대 증후군 생체역학 위험 요인 체계적 고찰(13편). BMC Musculoskelet Disord 16:356.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/26573859/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
            <li>
              <strong>Foch et al. (2023)</strong> — 장경인대 증후군 러너의 운동학·외전근 근력 메타분석(17편). Gait Posture 101:73-81.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/36758425/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
            <li>
              <strong>Falvey et al. (2010)</strong> — 장경인대 해부·스트레칭 변형률 측정, 신장 0.5% 미만. Scand J Med Sci Sports 20(4):580-7.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/19706004/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
            <li>
              <strong>Fredericson et al. (2000)</strong> — 장경인대 증후군 러너의 외전근 약화와 6주 재활(24명 중 22명 복귀). Clin J Sport Med
              10(3):169-75.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/10959926/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
            <li>
              <strong>Gunter &amp; Schwellnus (2004)</strong> — 발병 2주 내 러너 18명 스테로이드 주사 무작위 시험. Br J Sports Med 38(3):269-72.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/15155424/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
            <li>
              <strong>Frandsen et al. (2025)</strong> — 5,205명 18개월, 한 번의 긴 달리기와 과사용 부상. Br J Sports Med 59(17):1203-1210.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
          </ul>
        </References>
        <p className="mt-6 text-xs text-gray-400">※ 이 콘텐츠는 의학적 진단이나 치료를 대체하지 않습니다. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
    </>
  );
}
