import Link from "next/link";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Up, S } from "@/components/guide/Up";
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
      <article className="mx-auto max-w-2xl px-6 py-12 text-gray-800">
        <Link href="/injury" className="mb-6 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">무릎 바깥 · 3~4단계</span>
          <span className="text-xs text-gray-400">8분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight text-gray-900">{TITLE}</h1>

        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">먼저 결론</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-emerald-900">
            <li>달리다 보면 무릎 바깥 뼈 돌출부 근처가 아파지고, <strong>내리막에서 심해지면</strong> 의심합니다. 확정은 진료로.</li>
            <li>&lsquo;마찰&rsquo;보다 <strong>압박</strong>: 무릎을 30도쯤 굽힐 때 장경인대가 그 아래 지방 조직을 누릅니다.</li>
            <li>장경인대는 <strong>거의 늘어나지 않는 조직</strong>입니다(측정된 신장 0.5% 미만). 스트레칭으로 늘린다는 기대는 근거가 약합니다.</li>
            <li>
              근거가 있는 대처는 <strong>엉덩이 외전근 강화</strong>. 치료 연구들의 기간은 2~8주, 6주 재활 후 24명 중 22명이 복귀한 보고가
              있습니다(대조군 없음).
            </li>
          </ol>
        </div>

        <TableOfContents
          items={[
            { id: "how-common", label: "얼마나 흔한가" },
            { id: "why", label: "왜 생기나" },
            { id: "check", label: "셀프 체크" },
            { id: "what-works", label: "무엇이 효과 있나" },
            { id: "how-long", label: "얼마나 걸리나" },
            { id: "doctor", label: "병원에 가야 할 신호" },
            { id: "refs", label: "참고 논문" },
          ]}
        />

        {/* ── 흔한가 ─────────────────────────────────────────── */}
        <h2 id="how-common" className="mt-10 text-xl font-bold text-gray-900">
          얼마나 흔한가
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed">
          러닝 부상의 약 10%를 차지하고,{" "}
          <S>(Sanchez-Alvarado et al. (2024) <Up h="https://pubmed.ncbi.nlm.nih.gov/39247485/" />)</S>{" "}
          러닝에서 두 번째로 흔한 부상이라고 적은 고찰도 있습니다.{" "}
          <S>(Aderem &amp; Louw (2015) <Up h="https://pubmed.ncbi.nlm.nih.gov/26573859/" />)</S>
        </p>
        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
          <p className="font-semibold text-gray-900">국내 러닝 커뮤니티에서는 1위</p>
          <p className="mt-1">
            DC 러닝 마이너 갤러리의 「부상관리」 글 300건(2025년 10월~2026년 10월) 제목을 이 사이트가 분류했더니, 부위가 나온 글의 작성자
            기준으로 <strong>무릎 바깥·장경인대가 37명으로 가장 많았습니다</strong>. 그다음이 무릎(그 외) 25명, 발바닥·발목 각 13명입니다.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            한계: 제목만 본 분류이고, 진단이 아니라 본인이 적은 부위이며, 하프·풀코스를 준비하는 러너가 많은 커뮤니티입니다. 원 제목과 닉네임은
            저장하지 않았습니다.
          </p>
        </div>

        {/* ── 왜 ─────────────────────────────────────────── */}
        <h2 id="why" className="mt-10 text-xl font-bold text-gray-900">
          왜 생기나
        </h2>
        <ul className="mt-3 space-y-3 text-[15px] leading-relaxed">
          <li>
            <strong>마찰보다 압박.</strong> 오랫동안 장경인대가 허벅지뼈 바깥 돌출부 위를 앞뒤로 &lsquo;문지르는&rsquo; 마찰 증후군으로
            설명됐습니다. 사체 15구와 MRI를 본 해부 연구는 장경인대가 허벅지뼈에 섬유로 고정돼 있어 굴러 넘어가지 않고, 무릎을 30도쯤 굽힐 때
            그 아래의 신경·혈관이 풍부한 지방층을 누른다고 봤습니다. 환자의 MRI 변화도 그 지방층에 있었습니다.{" "}
            <S>(Fairclough et al. (2006) <Up h="https://pubmed.ncbi.nlm.nih.gov/16533314/" />)</S>
          </li>
          <li>
            <strong>내리막에서 심해지는 이유.</strong> 장경인대 증후군 러너 9명을 분석한 연구에서 발이 닿는 순간 무릎 굽힘은 평균 21.4도로,
            자극이 생기는 30도 부근에 걸려 있었습니다. 내리막은 착지 때 무릎이 덜 굽어 이 각도에 더 머물고, 평지에서 빠르게 달릴 때는 무릎이
            더 굽어 덜 자극된다고 설명합니다.{" "}
            <S>(Orchard et al. (1996) <Up h="https://pubmed.ncbi.nlm.nih.gov/8734891/" />)</S>
          </li>
          <li>
            <strong>몸의 움직임과 근력.</strong> 13개 연구를 모은 고찰에서 나중에 장경인대 증후군이 생긴 여성 러너는 착지 중 고관절이 안으로
            더 모이고 무릎이 안으로 더 돌았습니다. 다만 연구 수가 적고 효과 크기도 작았습니다.{" "}
            <S>(Aderem &amp; Louw (2015) <Up h="https://pubmed.ncbi.nlm.nih.gov/26573859/" />)</S>{" "}
            17편을 검토한 메타분석(정량 분석 10편)에서는 <strong>지금 증상이 있는 여성 러너</strong>만 엉덩이 외전근 근력이 낮았고, 남녀의 위험 요인이 달랐습니다.{" "}
            <S>(Foch et al. (2023) <Up h="https://pubmed.ncbi.nlm.nih.gov/36758425/" />)</S>{" "}
            약해서 아픈 건지 아파서 약해진 건지는 이 연구들로 가릴 수 없습니다.
          </li>
          <li>
            <strong>훈련량.</strong> 장경인대만 따로 본 연구는 아니지만, 과사용 부상 전반에서 한 번 달린 거리가 지난 30일 최장 거리보다 10%
            넘게 길면 부상 비율이 1.52~2.28배였습니다.{" "}
            <S>(Frandsen et al. (2025) <Up h="https://pubmed.ncbi.nlm.nih.gov/40623829/" />)</S>
          </li>
        </ul>

        {/* ── 셀프 체크 ─────────────────────────────────────── */}
        <h2 id="check" className="mt-10 text-xl font-bold text-gray-900">
          셀프 체크
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed">
          <li>아픈 곳이 무릎 바깥, 관절보다 조금 위의 뼈 돌출부 근처다</li>
          <li>달리기 시작하자마자보다 일정 시간·거리가 지나서 아파진다</li>
          <li>내리막이나 계단을 내려갈 때 더 아프다</li>
          <li>쉬면 가라앉았다가 다음에 비슷한 거리에서 다시 아프다</li>
        </ul>
        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm leading-relaxed text-amber-900">
          무릎이 붓거나, 걸리거나 잠기는 느낌이 있거나, 비틀린 뒤 아파졌다면 반월상연골·인대 등 다른 원인일 수 있습니다 — 진료를 받으세요.
        </p>
        <p className="mt-2 text-xs text-gray-400">위 체크 항목은 이 사이트가 정리한 것이며 진단이 아닙니다.</p>

        {/* ── 효과 ─────────────────────────────────────────── */}
        <h2 id="what-works" className="mt-10 text-xl font-bold text-gray-900">
          무엇이 효과 있나
        </h2>

        <h3 className="mt-5 text-base font-bold text-gray-900">1. 엉덩이 외전근 강화 — 근거가 가장 많은 것</h3>
        <p className="mt-2 text-[15px] leading-relaxed">
          러너 장경인대 증후군의 보존적 치료 연구 13편(201명)을 모은 고찰에서 엉덩이 외전근 강화가 공통 전략으로 나타났고, 통증은 27~100%,
          기능은 10~57% 좋아졌습니다(2~8주). 연구끼리 차이가 커서 메타분석은 못 했고, 13편 중 6편은 사례 보고였습니다. 체외충격파나 도수치료를
          더하는 방식도 언급됩니다.{" "}
          <S>(Sanchez-Alvarado et al. (2024) <Up h="https://pubmed.ncbi.nlm.nih.gov/39247485/" />)</S>
        </p>
        <div className="mt-3 rounded-xl bg-yellow-50 p-4 text-sm text-gray-700">
          <p className="mb-2 font-medium">예시 운동 (사이트 예시)</p>
          <ol className="list-inside list-decimal space-y-1">
            <li>옆으로 누워 다리 들기 — 위쪽 다리를 곧게 편 채 천천히 들고, 발끝은 앞을 향하게. 15회 × 3세트</li>
            <li>클램셸 — 옆으로 누워 무릎을 굽히고 발은 붙인 채 위쪽 무릎만 벌리기. 15회 × 3세트</li>
            <li>계단 골반 떨어뜨리기 — 한 발로 계단 끝에 서서 반대쪽 골반을 천천히 내렸다 올리기. 10회 × 3세트</li>
          </ol>
          <p className="mt-2 text-xs text-gray-500">위 연구들이 쓴 운동 구성은 연구마다 달랐습니다. 이 목록은 특정 연구의 프로토콜이 아닙니다.</p>
        </div>

        <h3 className="mt-6 text-base font-bold text-gray-900">2. 달리기 조절 — 멈추기보다 고르기</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed">
          <li>내리막을 피하고 평지에서 달립니다(위 Orchard 설명).</li>
          <li>아프기 시작하는 시간·거리보다 짧게 끊습니다.</li>
          <li>
            통증 기준은{" "}
            <Link href="/injury/return-to-running#rest-or-run" className="text-emerald-700 underline">부상 후 복귀 글의 통증 모니터링 모델</Link>을
            참고합니다. 그 모델은 힘줄 연구에서 쓰였고 장경인대에서 따로 시험된 것은 아닙니다.
          </li>
        </ul>
        <p className="mt-2 text-xs text-gray-400">2번 항목은 이 사이트의 경험칙입니다.</p>

        <h3 className="mt-6 text-base font-bold text-gray-900">3. 스트레칭·폼롤러 — 기대를 낮추기</h3>
        <p className="mt-2 text-[15px] leading-relaxed">
          사체 20구 해부에서 장경인대는 허벅지를 둘러싼 근막이 바깥쪽에서 두꺼워진 것으로, 허벅지뼈에 길게 붙어 있었습니다. 흔한 스트레칭
          세 동작이 만드는 변형률은 동작마다 크게 달랐고, 측정된 장경인대 신장은 <strong>평균 0.5% 미만</strong>(효과 크기 0.04)이었습니다. 저자들은 장경인대를 늘리는 치료의 근거에 의문을 제기하고, 근육 쪽(대퇴근막장근)을 봐야 한다고 했습니다.{" "}
          <S>(Falvey et al. (2010) <Up h="https://pubmed.ncbi.nlm.nih.gov/19706004/" />)</S>{" "}
          폼롤러로 장경인대 증후군이 낫는다는 연구는 찾지 못했습니다. 시원하면 해도 되지만 치료로 기대하지는 마세요.
        </p>

        <h3 className="mt-6 text-base font-bold text-gray-900">4. 의료진이 쓰는 방법</h3>
        <p className="mt-2 text-[15px] leading-relaxed">
          증상이 생긴 지 2주가 안 된 러너 18명을 나눈 무작위 시험에서, 스테로이드 주사를 맞은 그룹이 14일째 달리기 중 통증이 더 많이
          줄었습니다.{" "}
          <S>(Gunter &amp; Schwellnus (2004) <Up h="https://pubmed.ncbi.nlm.nih.gov/15155424/" />)</S>{" "}
          작은 연구이고, 주사 여부는 진료에서 정할 일입니다.
        </p>

        {/* ── 기간 ─────────────────────────────────────────── */}
        <h2 id="how-long" className="mt-10 text-xl font-bold text-gray-900">
          얼마나 걸리나
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed">
          장경인대 증후군이 있는 장거리 러너 24명이 엉덩이 외전근(중둔근) 중심의 6주 재활을 했더니 외전근 근력이 여성 34.9%, 남성 51.4%
          늘었고, <strong>24명 중 22명이 통증 없이 달리기로 돌아갔으며</strong> 6개월 뒤 재발 보고가 없었습니다. 대조군이 없는 사례
          연구입니다.{" "}
          <S>(Fredericson et al. (2000) <Up h="https://pubmed.ncbi.nlm.nih.gov/10959926/" />)</S>
        </p>
        <p className="mt-2 text-[15px] leading-relaxed">
          돌아올 때는 부상 전 거리가 아니라 <strong>지난 30일 최장 거리의 110%</strong> 안에서 늘립니다 →{" "}
          <Link href="/injury/return-to-running#comeback" className="text-emerald-700 underline">복귀 진도</Link>
        </p>

        {/* ── 병원 ─────────────────────────────────────────── */}
        <h2 id="doctor" className="mt-10 text-xl font-bold text-gray-900">
          병원에 가야 할 신호
        </h2>
        <ul className="mt-3 space-y-2 pl-1">
          {[
            "2주 이상 쉬어도 통증이 줄지 않는다",
            "걷기만 해도 무릎 바깥이 아프다",
            "무릎이 붓거나 열감이 있다",
            "무릎이 걸리거나 잠긴다",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-gray-700">
              <span className="shrink-0 text-red-500">⚠</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-gray-400">위 기준은 이 사이트가 정한 것입니다.</p>

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

        <div className="mt-10">
          <FaqSection items={FAQ} />
        </div>

        <h2 id="refs" className="mt-10 text-xl font-bold text-gray-900">
          참고 논문
        </h2>
        <p className="mt-1 text-xs text-gray-400">2026-10-06 PubMed 초록과 대조했습니다.</p>
        <ul className="mt-3 space-y-2 text-sm text-gray-700">
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
        <p className="mt-3 text-xs text-gray-400">※ 이 콘텐츠는 의학적 진단이나 치료를 대체하지 않습니다. 통증이 이어지면 전문의와 상담하세요.</p>

        <div className="mt-10 rounded-2xl bg-emerald-50 p-6">
          {/* 2026-10-06: 「장경인대염 예방에 적합한 신발」은 같은 글 본문(신발로 해결한다는 근거 없음)과 반대였다. */}
          <p className="mb-2 font-medium text-emerald-900">지금 신발이 발에 맞는지 확인해 보세요</p>
          <p className="mb-4 text-sm text-emerald-800">
            장경인대 증후군을 신발로 고친다는 근거는 찾지 못했습니다. 다만 발볼·사이즈가 안 맞는 신발은 바꾸는 게 맞습니다.
          </p>
          <Link
            href="/shoe-finder"
            className="inline-block rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            내 러닝화 찾기 →
          </Link>
        </div>
      </article>
    </>
  );
}
