import Link from "next/link";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ShareButtons from "@/components/ShareButtons";
import { CourseMap, ChafingMap, PaceCurve } from "@/components/RaceGraphics";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Up, S } from "@/components/guide/Up";
import { Lead, P, H2, Summary, Evidence, References, Basis, Warn, Note } from "@/components/guide/Read";
import type { Metadata } from "next";

/**
 * 2026-10-08 재검증 — PubMed 초록(일부 PMC 전문)과 대조
 *   · 저나트륨혈증: 「90분 이내 러너는 과음이 더 흔한 문제」 삭제 — Almond 2005 는 4시간 넘는 완주자가 위험군(OR 7.4).
 *     「7~15%」 출처 못 찾음 → Almond 2005 의 13% / 0.6%. 위험군을 Almond 대로(체중 증가·긴 완주 시간·BMI 양극단, NSAID 무관).
 *     기전은 Altieri 2026(과음 + 항이뇨호르몬, 땀 나트륨은 작은 요인). 2015 합의문은 초록·PMC 전문이 없어 내용 대조 불가 → 본문 인용은 Hew-Butler 2017 로.
 *   · 카보로딩 「글리코겐 75~90분 분량」 출처 없음 → Hawley 1997(60~90분은 이득 없음, 90분 초과 시 피로 약 20% 지연).
 *   · 레이스 중 탄수화물 → Jeukendrup 2014(2~3시간 약 60g/h, 초장거리 약 90g/h). 「2시간 이상이면 60g 이상」은 과장이라 낮춤.
 *   · 카페인 9mg/kg → Guest 2021 문구대로(「필요하지 않은 것으로 보임」).
 *   · 배지 상향: 새 음식 금지(Burke 2019), 면 양말(Herring 1990, 별도 카드로 분리), 완주 후 쓰러짐(Asplund 2011).
 *     물 붓기 카드는 「붓는 방식」이 경험이라 배지는 그대로 두고 냉각 문장에만 Burke 2019 를 붙였다.
 *   · 근거 못 찾은 단정(고용량 로딩은 몸만 무거움·대기 중 체온과 오버페이스·15~18km·5~10분·물집의 가장 흔한 원인) → 경험칙으로 낮춤.
 *
 * 2026-10-13 가독성 재설계 — 체크리스트 카드(필수/추천/취향 × 근거 배지)·그림·페이스 계산기는 그대로 두고,
 *   카드 안 설명 문단만 「할 일 → 근거(접힘)」로 바꿨다. 숫자·저자·연구 설계는 카드 안 <Evidence> 로 옮겼다.
 *   **저나트륨혈증 신호·「물을 더 마시지 말고 의료진에게」·완주 후 쓰러짐·「의식이 흐리면 의료진」·
 *   신장 질환/이뇨제는 의사와 상의 — 전부 접지 않는다.** (<Warn> 또는 본문)
 *   쓰러짐 기전 문장도 안전 정보라 본문에 남기고, 근거 안에는 출처만 다시 적었다.
 *   「인과는 확인 안 됨」「일화적 지침」「한국 식단에 옮긴 것은 저희」「1시간 운동에서도 소량 섭취 도움 보고」 단서는 본문에.
 *   배지 라벨 「논문 근거」 → 「연구로 확인」(다른 글의 <Basis> 와 같은 말). 「통용 관행」「직접 경험」은
 *   RaceGraphics 그림 캡션과 맞추려고 그대로 둔다.
 */
const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/half-marathon-race-day";
const TITLE = "하프마라톤 대회 당일 체크리스트";
const DESC =
  "하프마라톤 당일에 실제로 필요한 것만. 탄수화물 로딩이 하프에 필요한지, 젤은 언제 몇 개, 물은 얼마나, 바세린은 어디에. 논문 근거와 직접 뛰어본 경험을 구분해서 적었습니다.";

export const metadata: Metadata = {
  title: "하프마라톤 대회 당일 체크리스트 — 페이스·급수·젤·바세린 총정리 | 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/half-marathon-race-day" },
};

/**
 * 표시 체계 — 이 페이지의 핵심 설계
 *
 * 이 사이트의 다른 페이지는 전부 논문 근거로 굴러간다. 그런데 대회 당일 실전
 * 요령은 상당 부분 논문이 없다. 바세린을 어디에 바르는지 RCT를 한 사람은 없다.
 *
 * 그렇다고 빼면 정작 필요한 내용이 사라지고, 그렇다고 논문인 척하면
 * 2026-08에 인용 26건이 틀렸던 그 실패를 반복한다. 그래서 항목마다
 * **무게(필수/추천/취향)와 근거(논문/관행/경험)를 따로 표시**한다.
 * 읽는 사람이 스스로 가중치를 매길 수 있어야 한다.
 *
 * 2026-10-13: 근거 타입 이름 Basis → Ground (components/guide/Read 의 <Basis> 배지와 이름이 겹쳐서).
 * prop 이름 `basis="paper"` 는 그대로 — verify-citations 배지 감사가 이 문자열을 센다.
 */
type Weight = "must" | "should" | "optional";
type Ground = "paper" | "practice" | "experience";

const WEIGHT_STYLE: Record<Weight, { label: string; cls: string }> = {
  must:     { label: "필수",  cls: "bg-red-100 text-red-700" },
  should:   { label: "추천",  cls: "bg-amber-100 text-amber-800" },
  optional: { label: "취향",  cls: "bg-gray-100 text-gray-600" },
};

const GROUND_STYLE: Record<Ground, { label: string; cls: string }> = {
  paper:      { label: "연구 근거", cls: "border-emerald-300 text-emerald-700 bg-emerald-50" },
  practice:   { label: "통용 관행", cls: "border-blue-200 text-blue-700 bg-blue-50" },
  experience: { label: "직접 경험", cls: "border-violet-200 text-violet-700 bg-violet-50" },
};

/**
 * 배지 한 쌍. Item 카드 밖(예: 급수 경고 절)에서도 같은 경로를 쓰게 분리했다.
 *
 * 손으로 span을 박으면 소스에 `basis="paper"`가 남지 않아
 * verify-citations의 배지 감사가 그 배지를 못 본다.
 * 검사기 밖에 근거 표시를 두지 않는다 — AGENTS.md 출처 규칙 3번.
 */
function Badges({ weight, basis }: { weight: Weight; basis: Ground }) {
  const w = WEIGHT_STYLE[weight];
  const b = GROUND_STYLE[basis];
  return (
    <>
      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${w.cls}`}>{w.label}</span>
      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${b.cls}`}>{b.label}</span>
    </>
  );
}

/**
 * 체크리스트 카드 (2026-10-13 접기) — 제목이 곧 할 일이다. 설명은 눌러서 펼친다.
 * 「필수」 카드와 병원·의료진 문장이 든 카드는 처음부터 펼쳐 둔다(안전 정보는 접지 않는다).
 * 운영자: "글자가 너무 많아서 읽히지가 않는다" — 이 글은 카드 25장이 전부 펼쳐져 12분 분량이었다.
 */
function Item({
  weight, basis, title, children, open,
}: {
  weight: Weight; basis: Ground; title: string; children: React.ReactNode; open?: boolean;
}) {
  return (
    <details open={open ?? weight === "must"} className="group/item rounded-xl border border-gray-200 px-4 py-3.5">
      <summary className="flex cursor-pointer list-none items-start gap-2 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1">
          <span className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <Badges weight={weight} basis={basis} />
          </span>
          <span className="block break-keep text-[15px] font-semibold text-gray-900">{title}</span>
        </span>
        <span aria-hidden className="mt-1 shrink-0 text-gray-400 transition-transform group-open/item:rotate-90">›</span>
      </summary>
      <div className="mt-2 space-y-2 break-keep text-[15px] leading-[1.75] text-gray-700">{children}</div>
    </details>
  );
}

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["하프 대회 당일", "/injury/half-marathon-race-day"],
        ]}
      />
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">대회 실전</span>
          {/* 규약은 app/injury/page.tsx 상단 주석 */}
          <span className="text-xs text-gray-400">8분 읽기 · 21.1km 기준</span>
          <span className="text-xs text-gray-400">· 협찬 없이 작성</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">하프마라톤 대회 당일 체크리스트</h1>
        <Lead>
          하프마라톤 당일에 실제로 필요한 것만 추렸습니다. 가장 먼저 알아둘 것은 <strong>목마르지 않은데 물을 억지로 마시지
          않는 것</strong>입니다.
        </Lead>

        <Summary
          items={[
            <>물은 <strong>목마를 때</strong> 마십니다. 급수대 개수를 채우려 들이키지 않습니다.<Basis kind="paper" /></>,
            <>90분 안팎에 끝난다면 <strong>풀 카보로딩은 대체로 필요 없습니다.</strong><Basis kind="paper" /></>,
            <>음식·젤·카페인은 <strong>연습 롱런에서 써 본 것만</strong>. 대회 날 처음 먹지 않습니다.<Basis kind="paper" /></>,
            <>첫 5km는 <strong>&lsquo;조금 느린데?&rsquo; 싶을 정도로</strong>.<Basis kind="rule" /></>,
          ]}
        />

        <TableOfContents
          items={[
            { id: "water", label: "물은 얼마나" },
            { id: "carb", label: "카보로딩" },
            { id: "food", label: "전날 밤·당일 아침" },
            { id: "during", label: "젤과 급수" },
            { id: "gear", label: "옷·마찰·날씨" },
            { id: "arrival", label: "대회장 도착 후" },
            { id: "pace", label: "페이스" },
            { id: "weather", label: "날씨별 복장" },
            { id: "after", label: "완주 후 30분" },
          ]}
        />

        {/* ── 표시 체계 안내 ── */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5">
          <p className="text-sm font-bold text-gray-900">카드 읽는 법</p>
          <p className="mt-1.5 break-keep text-sm leading-[1.7] text-gray-700">
            항목마다 <strong>얼마나 중요한지</strong>와 <strong>무엇을 근거로 하는지</strong>를 따로 답니다.
            바세린을 어디에 바르는지 시험한 임상연구는 찾지 못했기 때문입니다.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">필수</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">추천</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">취향</span>
            <span className="mx-1 text-gray-300">|</span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border border-emerald-300 text-emerald-700 bg-emerald-50">연구 근거</span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border border-blue-200 text-blue-700 bg-blue-50">통용 관행</span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border border-violet-200 text-violet-700 bg-violet-50">직접 경험</span>
          </div>
          <p className="mt-2.5 break-keep text-xs leading-relaxed text-gray-500">
            <strong>&lsquo;직접 경험&rsquo;은 한 사람의 표본 1입니다.</strong> 참고로 쓰되 연구로 확인한 것과 같은 무게로 읽지 마세요.
          </p>
        </div>

        {/* ── 국내 통념과 국제 합의가 갈리는 지점. 이 페이지에서 가장 중요한 부분 ──
            2026-08-31 심의 지적 반영 — 절 전체가 하나의 주장이라 카드로 쪼개지 않고 제목 옆에 배지를 단다.
            2026-10-13 — 안전 문장(신호·의료진·신장 질환/이뇨제)은 전부 본문/<Warn>. 숫자·저자만 근거로 접었다. */}
        <h2 id="water" className={H2}>
          대회 중 물은 얼마나 마셔야 하나요
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badges weight="must" basis="paper" />
        </div>
        <P>
          <strong>목마를 때 마시세요.</strong> 목마르지 않은데 급수대마다 채워 마실 필요는 없습니다.
        </P>
        <P>
          국내 가이드에서 자주 보이는 조언과는 다릅니다.{" "}
          <strong>&ldquo;갈증을 느끼면 이미 탈수다. 목마르지 않아도 급수대마다 규칙적으로 마셔라.&rdquo;</strong> 최근 전문가
          리뷰들은 이 조언을 &ldquo;목마를 때 마셔라&rdquo;로 바꾸라고 권합니다.
        </P>
        <P>
          필요 이상으로 마신 물이 잘 빠져나가지 못하면 혈중 나트륨이 묽어집니다. 이게 <strong>운동유발 저나트륨혈증</strong>이고,
          증상은 메스꺼움·구토·두통·혼란에서 심하면 혼수까지 갑니다.
        </P>
        <P>
          2002년 보스턴 마라톤에서 완주 직후 검사한 일반 참가자의 <strong>13%</strong>가 저나트륨혈증이었습니다.
        </P>
        <Evidence n={3}>
          <p>
            갈증대로 마시는 방식은 안전하고 효과적인 것으로 보이며, 코스 급수를 줄인 대회에서 저나트륨혈증 발생이 줄었다는 보고가
            있습니다. <S>(Hew-Butler et al. (2017) <Up h="https://pubmed.ncbi.nlm.nih.gov/28316971/" />)</S>
          </p>
          <p>
            필요 이상으로 마신 물이, 운동 중 분비되는 항이뇨호르몬 때문에 잘 빠져나가지 못하면 혈중 나트륨이 묽어집니다. 땀으로
            잃는 나트륨은 상대적으로 작은 요인으로 봅니다. 증상은 메스꺼움·구토·두통·혼란에서 심하면 혼수까지 갑니다.{" "}
            <S>(Altieri et al. (2026) <Up h="https://pubmed.ncbi.nlm.nih.gov/40913680/" />)</S>
          </p>
          <p>
            2002년 보스턴 마라톤에서 완주 직후 혈액을 검사한 일반 참가자 488명 중 13%가 저나트륨혈증(혈중 나트륨 135 이하)이었고,
            0.6%는 위험 수준(120 이하)이었습니다. <S>(Almond et al. (2005) <Up h="https://pubmed.ncbi.nlm.nih.gov/15829535/" />)</S>
          </p>
        </Evidence>
        <Note>
          처음 이 글에는 &ldquo;탈수보다 이쪽이 더 자주 문제가 된다&rdquo;고 썼다가 내렸습니다 — 둘의 빈도를 비교한 근거를 찾지
          못했습니다.
        </Note>

        <Warn title="이런 신호가 있으면 물을 더 마시지 말고 의료진에게">
          <p className="font-semibold">달리는 중에 알아챌 수 있는 신호</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            <li>메스꺼움·구토, 깨질 듯한 두통</li>
            <li>머리가 멍하고 방향 감각이 흐려진다</li>
            <li>손발이 부어서 반지나 시계가 꽉 낀다</li>
          </ul>
          <p className="mt-2 font-semibold">완주 후에야 확인되는 신호</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            <li>21km를 뛰고 왔는데 <strong>체중이 오히려 늘었다</strong></li>
          </ul>
          <p className="mt-2">
            체중은 코스에서 잴 수 없습니다. 달리는 중에는 위의 세 가지로 판단하고, 하나라도 있으면{" "}
            <b>물을 더 마시지 말고 의료진에게</b> 가세요. 코스 의료진 위치는 대회 안내문에 표시돼 있으니 출발 전에 확인해두면
            좋습니다.
          </p>
          <p className="mt-2">
            <strong>이게 특히 위험한 이유는 증상이 다른 응급 상황과 겹치기 때문입니다.</strong> 열사병·저혈당·기립성 저혈압과
            구별해야 하는데, 처치 방향이 다릅니다 — 가벼운 저나트륨혈증의 처치가 <b>수분 제한</b>일 만큼, 탈수인 줄 알고 물을 더
            넣는 것은 반대 방향입니다. 그래서 스스로 판단하지 말고 의료진에게 가야 합니다.
          </p>
        </Warn>
        <Evidence n={3}>
          <p>
            레이스 중 체중 증가는 보스턴 연구에서 저나트륨혈증과 가장 강하게 연관된 요인 중 하나였습니다(OR 4.2).{" "}
            <S>(Almond et al. (2005) <Up h="https://pubmed.ncbi.nlm.nih.gov/15829535/" />)</S>
          </p>
          <p>
            손발 부기는 초장거리 사이클 선수 919명 설문에서 &lsquo;최대한 많이 마시기&rsquo;와 함께 늘었습니다.{" "}
            <S>(Gauckler et al. (2021) <Up h="https://pubmed.ncbi.nlm.nih.gov/34863204/" />)</S>
          </p>
          <p>
            열사병·저혈당·기립성 저혈압과 구별해야 하고, 가벼운 저나트륨혈증의 처치는 수분 제한입니다.{" "}
            <S>(Altieri et al. (2026) <Up h="https://pubmed.ncbi.nlm.nih.gov/40913680/" />)</S>
          </p>
        </Evidence>

        <h3 className="mt-8 break-keep text-lg font-bold text-gray-900">더운 날에는 반대쪽 위험도 있습니다</h3>
        <P>
          덥고 습한 날 열린 한 하프마라톤에서는 적게·드물게 마신 쪽의 문제가 관찰됐습니다. 그래서 더운 날 갈증이 오면{" "}
          <b>참지 말고 마셔야 합니다.</b>
        </P>
        <P>
          이 절의 요점은 &ldquo;마시지 말라&rdquo;가 아니라 <b>목이 마르지도 않은데 급수대 개수를 채우려 들이키지 말라</b>는
          것입니다.
        </P>
        <Evidence n={1}>
          <p>
            덥고 습한 날 열린 하프마라톤(콜롬비아 칼리, 81명 분석)에서는 저나트륨혈증이 한 건도 없었고, 7.4%에서 고나트륨혈증이
            나왔는데 적게·드물게 마신 것과 연관이 있었습니다.{" "}
            <S>(Martinez-Cano et al. (2018) <Up h="https://pubmed.ncbi.nlm.nih.gov/29955376/" />)</S>
          </p>
        </Evidence>

        <h3 className="mt-8 break-keep text-lg font-bold text-gray-900">위험이 높았던 사람</h3>
        <P>
          보스턴 연구에서는 레이스 중 체중이 늘 만큼 마신 경우, 완주 시간이 긴 경우, 체질량지수가 아주 낮거나 높은 경우 위험이
          높았습니다.
        </P>
        <P>
          신장 질환이 있거나 이뇨제를 복용 중이라면 — 이 페이지에서 근거를 확인하지는 못했지만 —{" "}
          <b>대회 전에 의사와 상의하세요.</b> 이 페이지의 일반 원칙으로 갈음하지 마세요.
        </P>
        <Evidence n={1}>
          <p>
            완주 시간이 긴 경우(4시간 초과는 3시간 30분 미만보다 OR 7.4), 레이스 중 체중이 늘 만큼 마신 경우, 체질량지수가 아주
            낮거나 높은 경우 위험이 높았습니다. 같은 연구에서 소염진통제(NSAID) 복용과 성별은 관련이 없었습니다.{" "}
            <S>(Almond et al. (2005) <Up h="https://pubmed.ncbi.nlm.nih.gov/15829535/" />)</S>
          </p>
        </Evidence>

        {/* ── 대회 2~3일 전 ── */}
        <h2 id="carb" className={H2}>
          대회 2~3일 전 — 하프에도 카보로딩이 필요할까
        </h2>
        <div className="mt-5 space-y-3">
          <Item weight="optional" basis="paper" title="하프에는 풀 카보로딩이 대체로 필요 없습니다">
            <p>
              하프를 <strong>90분 안팎</strong>에 끝낸다면 평소대로 먹어도 됩니다. <strong>90분을 훌쩍 넘긴다면</strong> 대회 전에
              탄수화물 위주로 먹어 글리코겐을 채우는 것이 장거리 육상 영양 리뷰의 권고 방향입니다.
            </p>
            <p className="text-gray-500">
              풀코스용 고용량 로딩까지 하프에 가져오면 몸이 무겁게 느껴진다는 건 흔한 이야기일 뿐, 확인한 자료는 없습니다.
              (구체적인 g/kg 수치는 원문에서 확인하지 못해 적지 않습니다.)
            </p>
            <Evidence n={2}>
              <p>
                연구를 모은 리뷰에 따르면 60~90분 중강도 달리기·사이클에서는 근글리코겐을 평소 이상 채워도 이득이 없었습니다. 끝날
                때도 근육에 글리코겐이 상당량 남아 있었기 때문입니다. 반대로 90분을 넘는 종목에서는 피로가 약 20% 늦게 왔습니다.{" "}
                <S>(Hawley et al. (1997) <Up h="https://pubmed.ncbi.nlm.nih.gov/9291549/" />)</S>
              </p>
              <p>
                90분을 훌쩍 넘긴다면 대회 전에 탄수화물 위주로 먹어 글리코겐을 채우는 것이 권고 방향입니다.{" "}
                <S>(Burke et al. (2019) <Up h="https://pubmed.ncbi.nlm.nih.gov/30747558/" />)</S>
              </p>
            </Evidence>
          </Item>

          <Item weight="must" basis="paper" title="새로운 음식·젤·보충제를 대회 주간에 처음 쓰지 마세요">
            <p>
              젤 브랜드, 스포츠음료, 카페인 양까지 <strong>연습 롱런에서 똑같이</strong> 해보세요. 대회 당일 처음 먹는 것은 위험
              부담이 큽니다.
            </p>
            <p className="text-gray-500">
              현장에서 나눠주는 낯선 보급품이나 옆 사람이 건네는 젤도 마찬가지입니다.
              받아먹고 배탈 나면 남은 10km가 지옥입니다.
            </p>
            <Evidence n={1}>
              <p>
                장거리 육상 영양 리뷰는 대회 영양 계획을 개인에 맞춰 미리 연습해 둔 것으로 하라고 권합니다.{" "}
                <S>(Burke et al. (2019) <Up h="https://pubmed.ncbi.nlm.nih.gov/30747558/" />)</S>
              </p>
            </Evidence>
          </Item>
        </div>

        {/* ── 전날 밤 · 당일 아침 ── */}
        <h2 id="food" className={H2}>
          전날 밤·당일 아침, 뭘 피해야 하나요
        </h2>
        <div className="mt-5 space-y-3">
          <Item weight="must" basis="practice" title="섬유질·지방·단백질을 줄이세요">
            <p>
              대회 전날 저녁의 <strong>현미·잡곡·나물·샐러드·튀김·삼겹살</strong>, 당일 아침의{" "}
              <strong>우유·요거트·계란·견과류</strong>가 흔한 지뢰입니다. 흰쌀밥, 흰빵, 바나나처럼{" "}
              <strong>단순하고 소화 빠른 탄수화물</strong>이 무난합니다.
            </p>
            <p className="text-gray-500">
              ※ 연구에서 본 것은 섬유질·지방·단백질과 증상의 연관이고, 인과는 확인되지 않았습니다. 리뷰도 &ldquo;대회 전날 고섬유
              음식 피하기&rdquo;를 일화적으로 효과가 있어 보이는 지침으로 소개합니다. 위 음식 목록은 그 지침을 저희가 한국 식단에
              옮긴 것입니다.
            </p>
            <Evidence n={1}>
              <p>
                운동 중 위장 증상은 연구를 모아 보면 지구성 종목 선수의 30~50%가 겪습니다. 철인3종 레이스 중 섭취를 본 연구들에서
                섬유질, 지방, 단백질, 그리고 농도가 진한 당 용액이 증상과 연관돼 있었습니다(상관관계이고 인과는 확인되지
                않았습니다). 같은 리뷰는 &ldquo;대회 전날 고섬유 음식 피하기&rdquo;를 일화적으로 효과가 있어 보이는 지침으로
                소개합니다. <S>(de Oliveira et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/24791919/" />)</S>
              </p>
            </Evidence>
          </Item>

          <Item weight="should" basis="experience" title="아침 식사는 출발 3시간 전, 그 뒤엔 액체로만">
            <p>
              제가 쓰는 방식입니다. 출발 3시간 전에 밥·빵으로 제대로 먹고, 그 뒤로는 스포츠음료나 젤 같은{" "}
              <strong>액체·반액체만</strong> 넣습니다. 1시간 전에 고형식을 먹었을 때 5km 지점부터 옆구리가 결렸던 적이 있습니다.
            </p>
            <p className="text-gray-500">
              다만 이건 표본 1입니다. 사람마다 소화 속도가 달라서
              <strong> 연습 롱런에서 본인 간격을 찾는 게 맞습니다.</strong>
            </p>
          </Item>

          <Item weight="optional" basis="paper" title="카페인은 쓴다면 출발 60분 전, 체중 1kg당 3~6mg">
            <p>
              쓴다면 <strong>체중 1kg당 3~6mg</strong>(60kg이면 180~360mg)을, 운동 60분 전에 먹는 방식이 가장 흔합니다.{" "}
              <strong>9mg/kg 같은 고용량은 부작용이 잦고, 효과를 얻는 데 필요하지 않은 것으로 보입니다.</strong>
            </p>
            <p className="text-gray-500">
              평소 커피를 안 마신다면 대회 당일에 처음 시도하지 마세요 — 손 떨림이나 속쓰림이 올 수 있습니다.
              <Basis kind="rule" /> 평소 섭취량에 따라 반응이 다를 수 있다는 점은 아래 포지션 스탠드도 짚습니다.
            </p>
            <Evidence n={1}>
              <p>
                국제스포츠영양학회 포지션 스탠드는 유산소 지구력을 카페인 효과가 가장 일관되게 나타나는 운동으로 꼽습니다. 효과가
                일관되게 확인된 양은 체중 1kg당 3~6mg이고, 가장 흔히 쓰는 시점은 운동 60분 전입니다. 9mg/kg 같은 고용량은 부작용이
                잦고, 효과를 얻는 데 필요하지 않은 것으로 보입니다.{" "}
                <S>(Guest et al. (2021) <Up h="https://pubmed.ncbi.nlm.nih.gov/33388079/" />)</S>
              </p>
            </Evidence>
          </Item>
        </div>

        {/* ── 레이스 중 ── */}
        <h2 id="during" className={H2}>
          레이스 중 — 젤은 몇 개, 물은 어떻게
        </h2>
        <div className="mt-5">
          <CourseMap />
        </div>
        <div className="space-y-3">
          <Item weight="should" basis="paper" title="90분을 넘긴다면 시간당 탄수화물 최대 60g 안팎">
            <p>
              2~3시간 운동은 <strong>시간당 약 60g까지</strong>가 권고 범위입니다. 에너지젤 하나가 보통 20~30g이니{" "}
              <strong>시간당 1~2개</strong> 꼴입니다.
            </p>
            <p>
              시간당 약 90g은 초장거리 경기용 숫자라, 하프에 그대로 가져올 숫자는 아닙니다. 위장이 견디는지도 사람마다 다르니
              <strong> 연습에서 검증되지 않은 증량은 하지 마세요.</strong>
            </p>
            <p className="text-gray-500">
              90분 안팎에 끝나는 러너는 젤이 없어도 완주에 지장이 없습니다. 다만 1시간 안팎 운동에서도 입 헹굼이나 소량 섭취가
              기록에 도움이 됐다는 보고는 있습니다(Jeukendrup 2014).
            </p>
            <Evidence n={2}>
              <p>
                운동 시간별 권고를 정리한 리뷰에 따르면 2~3시간 운동은 시간당 약 60g까지입니다. 1시간 안팎 운동에서도 입 헹굼이나
                소량 섭취가 기록에 도움이 됐다는 보고가 있습니다.{" "}
                <S>(Jeukendrup (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/24791914/" />)</S>
              </p>
              <p>
                포도당+과당을 섞어 시간당 약 90g까지 올리는 권고는 초장거리 경기용이고, 장거리 육상 리뷰도 75~90g은 가장 긴 경기에
                해당한다고 적습니다. <S>(Burke et al. (2019) <Up h="https://pubmed.ncbi.nlm.nih.gov/30747558/" />)</S>
              </p>
              <p>60~90분 달리기는 끝날 때도 근글리코겐이 남아 있었습니다(Hawley 1997, 위 카보로딩 항목).</p>
            </Evidence>
          </Item>

          <Item weight="should" basis="experience" title="젤은 급수대 직전에 까고, 물과 함께 넘기기">
            <p>
              젤만 삼키면 농도가 진해서 속이 울렁거립니다.
              <strong> 급수대 100m쯤 앞에서 미리 까두고, 급수대에서 물과 같이 넘기는</strong> 순서가 편했습니다.
              젤을 스포츠음료로 넘기면 당이 겹쳐서 저는 피합니다.
            </p>
            <p className="text-gray-500">
              레이스 벨트에 넣어둔 젤을 꺼내느라 페이스가 흔들리는 것도 무시 못 합니다.
              <strong> 손이 바로 가는 자리</strong>에 넣고, 개수는 미리 세어두세요.
            </p>
          </Item>

          <Item weight="must" basis="practice" title="종이컵은 한 번에 들이키지 말고 2~3모금씩">
            <p>
              종이컵을 통째로 들이키면 위가 출렁거려서 그때부터 불편합니다.
              <strong> 2~3모금씩 나눠 마시는 것</strong>은 국내 러너들 사이에 널리 퍼진 요령입니다.
              위장 부담을 줄인다는 점에서 국제 권고와 어긋나지도 않습니다.
            </p>
            <p>
              <strong>다만 갈증이 없으면 그냥 지나가도 됩니다.</strong> 위의 저나트륨혈증 내용과 같습니다 —
              급수대 개수를 채워야 하는 게 아닙니다.
            </p>
            <p className="text-gray-500">
              이 항목은 처음에 논문 근거로 달아뒀다가 &lsquo;통용 관행&rsquo;으로 내렸습니다 —
              <strong>2~3모금이라는 숫자를 뒷받침하는 논문을 확인하지 못했습니다.</strong>
            </p>
          </Item>
        </div>

        {/* ── 날씨·복장·마찰 ── */}
        <h2 id="gear" className={H2}>
          옷·마찰·날씨 — 어디가 쓸리나요
        </h2>
        <div className="mt-5 space-y-3">
          <Item weight="should" basis="practice" title="바세린은 겨드랑이·가슴·사타구니·발가락 사이">
            <p>
              하프 거리에서도 <strong>겨드랑이, 유두, 사타구니, 발가락 사이</strong>가 흔히 까지는 자리입니다. 바세린이나 바디
              글라이드 같은 마찰 방지 제품을 <strong>출발 직전에</strong> 바릅니다.
            </p>
            <ChafingMap />
            <p>
              러너들이 공통으로 강조하는 요령이 하나 있습니다 —
              <strong> 바르기 전에 그 부위를 닦고 말리세요.</strong> 땀이나 물기가 남은 채로 바르면 겉돕니다.
            </p>
            <p className="text-gray-500">
              널리 쓰이는 방법이지만 <strong>바르는 위치나 효과를 검증한 논문은 확인하지 못했습니다.</strong>
              허벅지만 바르고 겨드랑이를 빼먹었다가 고생했다는 이야기가 커뮤니티에 자주 올라옵니다.
            </p>
          </Item>

          <Item weight="must" basis="experience" title="새 옷·새 신발로 대회에 나가지 마세요">
            <p>
              최소 두세 번의 롱런을 같이 뛴 옷·신발·양말로 나가는 게 제 원칙입니다. 대회 당일은 새 장비를 시험하는 날이 아닙니다.
            </p>
            <p className="text-gray-500">
              대회 기념 티셔츠를 그날 처음 입고 뛰었다가 <strong>봉제선에 겨드랑이가 까진 적</strong>이 있습니다.
              신발은 더 신경 쓰입니다 — 길들이지 않은 러닝화로는 물집과 발톱 멍이 생기기 쉬웠습니다.
            </p>
          </Item>

          <Item weight="should" basis="paper" title="양말은 면 말고 합성섬유로, 이미 신어본 것으로">
            <p>
              장거리 러너 35명 연구에서 <strong>아크릴 양말이 면 양말보다 물집이 덜 생겼습니다.</strong>
            </p>
            <p className="text-gray-500">
              &ldquo;면이 젖으면 마찰이 커져서&rdquo;라는 이유는 흔히 하는 설명이지만 초록에서 확인하지는 못했습니다.
              새것 말고 <strong>이미 신어본 것</strong>으로 가는 건 저희 제안입니다.
            </p>
            <Evidence n={1}>
              <p>
                장거리 러너 35명을 대상으로 한 이중맹검 연구에서 아크릴 100% 양말이 면 100% 양말보다 물집이 덜 생기고 크기도
                작았습니다. <S>(Herring & Richie (1990) <Up h="https://pubmed.ncbi.nlm.nih.gov/2304016/" />)</S>
              </p>
            </Evidence>
          </Item>

          <Item weight="should" basis="experience" title="더울 때 물 뿌리기 — 신발과 양말에는 닿지 않게">
            <p>
              더운 날 머리와 목덜미에 물을 끼얹으면 확실히 살 만해집니다. 다만
              <strong> 물이 양말과 신발로 들어가면 그때부터 물집 시계가 돌아갑니다.</strong>
            </p>
            <p>
              그래서 저는 <strong>컵을 얼굴 위쪽에서 뒤로 넘기듯</strong> 붓고, 몸통 앞쪽으로는 흘리지 않습니다.
              가슴으로 흘리면 결국 반바지와 신발까지 젖습니다.
            </p>
            <p className="text-gray-500">
              젖은 양말과 피부의 마찰은 마른 상태와 비교가 안 됩니다.
              <strong> 제가 쓰는 이 붓는 방식이 낫다는 비교 연구는 확인하지 못했습니다.</strong>
              그래서 이 카드는 &lsquo;직접 경험&rsquo;으로 둡니다.
            </p>
            <Evidence n={1}>
              <p>
                더운 환경에서는 경기 전 냉각 같은 전략이 작지만 쓸모 있는 도움이 될 수 있다고 장거리 육상 영양 리뷰는 적습니다.{" "}
                <S>(Burke et al. (2019) <Up h="https://pubmed.ncbi.nlm.nih.gov/30747558/" />)</S> 다만 그건 경기 전 냉각
                이야기입니다.
              </p>
            </Evidence>
          </Item>

          <Item weight="should" basis="practice" title="추운 날 출발 전 체온 — 버릴 옷 한 겹">
            <p>
              <strong>달리지 않고 출발선에서 기다리는 시간이 가장 춥게 느껴지기 쉽습니다.</strong>
              안 입는 헌 옷이나 비닐 우의를 걸치고 출발 직전에 벗는 게 흔한 방법이라
              &lsquo;버리는 옷&rsquo;이라고 부릅니다.
            </p>
            <p className="text-gray-500">
              대회에서 수거해 기부하는 경우가 많습니다. 아무 데나 던지지 말고 수거함에 넣으세요.
            </p>
          </Item>
        </div>

        {/* ── 현장 ── */}
        <h2 id="arrival" className={H2}>
          대회장 도착 후 — 사소한데 크게 망하는 것들
        </h2>
        <div className="mt-5 space-y-3">
          <Item weight="must" basis="practice" title="배번표와 기록칩은 전날 밤에 달아두세요">
            <p>
              <strong>배번표는 전날 상의에 달아두고, 기록칩은 신발 끈에 미리 끼워두세요.</strong> 당일 아침에 안전핀을 찾는
              순간부터 리듬이 깨집니다. 안전핀은 현장에서 모자라는 경우가 있으니 여분을 챙기는 게 안전합니다.
            </p>
          </Item>

          <Item weight="should" basis="practice" title="1시간~1시간 30분 전 도착, 도착하면 화장실부터">
            <p>
              워밍업보다 <strong>화장실·물품보관소·출발선 위치 파악이 먼저</strong>입니다.
              <strong> 출발이 가까워질수록 화장실 줄이 길어지기 쉽습니다.</strong> 일찍 한 번 다녀오세요.
            </p>
            <p className="text-gray-500">
              물품보관 가방은 맡기기 전에 <strong>번호표와 가방을 사진으로</strong> 찍어두면
              나중에 찾을 때 편합니다. 비슷한 가방이 정말 많습니다.
            </p>
          </Item>

          <Item weight="should" basis="practice" title="출발 위치는 자기 기록대로">
            <p>
              욕심내서 앞쪽에 서면 빠른 러너들에게 떠밀려 <strong>첫 1km부터 오버페이스</strong>가 납니다.
              반대로 너무 뒤에 서면 사람에 막혀 답답하고요.
              대회에서 그룹 구역을 나눠놨다면 그대로 따르는 게 맞습니다.
            </p>
          </Item>
        </div>

        {/* ── 페이스 ── */}
        <h2 id="pace" className={H2}>
          페이스 — 여기서 가장 많이 무너집니다
        </h2>
        <div className="mt-5">
          <PaceCurve />
        </div>

        {/* 페이스를 다루면서 정작 페이스 계산기로 보내지 않고 있었다.
            구간 통과 시간표는 대회 당일 손목에 적어가는 물건이라 여기가 제자리다. */}
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="min-w-0 flex-1 text-sm font-medium text-emerald-900">
            목표 시간을 넣으면 5km 단위 구간 통과 시간표를 만들어드립니다
          </p>
          <Link
            href="/tools/pace"
            className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            페이스 계산기 →
          </Link>
        </div>
        <div className="space-y-3">
          <Item weight="must" basis="experience" title="첫 5km는 &lsquo;조금 느린데?&rsquo; 싶을 정도로">
            <p>
              <strong>&ldquo;이 정도면 너무 느린가&rdquo; 싶은 게 대체로 맞는 페이스입니다.</strong> 오버페이스는 감으로 못
              잡습니다. <strong>워치를 보고 의식적으로 눌러야</strong> 합니다.
            </p>
            <p className="text-gray-500">
              출발 신호가 떨어지면 주변 분위기에 그냥 끌려갑니다.
              저는 첫 대회에서 목표보다 <strong>1km당 20초 빠르게</strong> 5km를 지났고,
              15km부터 <strong>다리가 안 올라갔습니다.</strong>
              {/* 2026-10-06: 「초반에 번 30초」였는데 1km당 20초 × 5km 면 100초다. 계산만 맞췄다 — 경험 수치는 hyun 확인 필요. */}
              초반 5km에서 번 1분 40초(1km당 20초 × 5km)는 후반에 3분으로 돌아왔습니다.
            </p>
          </Item>

          <Item weight="should" basis="experience" title="15~18km 고비를 미리 알아두세요">
            <p>
              제 경우 하프에서 가장 힘든 구간은 마지막이 아니라 <strong>15~18km</strong>였습니다.
              이 구간이 온다는 걸 미리 알고 있는 것만으로도 다릅니다.
            </p>
            <p>
              다리가 무거워지고 페이스가 퍼지기 시작하는데,
              <strong> 여기서 &ldquo;내가 뭘 잘못했나&rdquo; 싶어 패닉하면 그대로 걷기로 넘어갑니다.</strong>{" "}
              저는 <strong>남은 거리를 3km 단위로 쪼개서</strong> 넘겼습니다 —
              &ldquo;18km까지만&rdquo;, 그다음 &ldquo;골인까지만&rdquo;.
            </p>
            <p className="text-gray-500">
              그리고 하프는 20km가 아니라 <strong>21.0975km</strong>입니다.
              20km를 지나고도 1km가 더 남아 있고, 그 1km가 유난히 깁니다.
            </p>
          </Item>

          <Item weight="must" basis="practice" title="컷오프(제한시간)를 미리 확인하세요">
            <p>
              <strong>첫 하프라면 자기 예상 완주 시간이 컷오프 안에 들어오는지</strong>를 접수 전에 확인해두세요. 대부분의 하프
              대회에는 <strong>제한시간과 중간 통제 지점</strong>이 있고, 거기서 통과하지 못하면 회수 차량을 타야 합니다.
            </p>
            <p className="text-gray-500">
              대회마다 다르니 참가 안내문의 숫자를 보세요. 이 페이지에 일반값을 적지 않는 이유입니다.
            </p>
          </Item>

          <Item weight="optional" basis="practice" title="페이스메이커 활용">
            <p>
              목표 기록 풍선을 단 페이스메이커를 따라가면 페이스 관리가 훨씬 쉽습니다.
              워치를 계속 안 봐도 되고요. 다만 페메 그룹은 사람이 몰려서 급수대에서 엉킵니다.
              <strong> 급수 때는 그룹에서 살짝 빠져 가장자리로 붙었다가 다시 합류하는</strong> 편이 안전합니다.
            </p>
            <p className="text-gray-500">
              급수대에서 갑자기 멈추면 뒤에서 오는 사람과 부딪힙니다. 속도를 줄이면서 옆으로 빠지세요.
            </p>
          </Item>
        </div>

        {/* ── 날씨별 복장 ──
            2026-09-03 신설. 이 페이지에 "추운 날 버릴 옷" 항목만 있고
            더위·비에 대한 복장 이야기가 통째로 빠져 있었다. 대회 당일 변수 중 큰 축이다. */}
        <h2 id="weather" className={H2}>
          날씨별 복장 — 뭘 입고 뛰나요
        </h2>
        <div className="mt-5 space-y-3">
          <Item weight="should" basis="practice" title="기온보다 얇게 — 달리면 체감이 올라갑니다">
            <p>
              출발선에서 딱 좋은 옷은 5km 지점에서 덥습니다. 러너들 사이에서 흔히 쓰는 기준은
              <strong> 지금 기온보다 5~10도 따뜻한 날에 입을 옷</strong>을 고르라는 것입니다.
              출발 전 추위는 버리는 옷 한 겹으로 해결합니다.
            </p>
            <p className="text-gray-500">
              널리 통용되는 요령이고 <strong>구체적인 온도 폭을 검증한 자료는 확인하지 못했습니다.</strong>
              숫자보다 &ldquo;출발선에서 살짝 서늘한 정도&rdquo;라는 감각으로 잡는 편이 낫습니다.
            </p>
          </Item>

          <Item weight="should" basis="practice" title="비 오는 날 — 면은 피하고, 마찰 지점을 늘려 잡으세요">
            <p>
              <strong>면 소재를 피하고</strong>, 평소보다 마찰 방지제를 넓게 바르세요. 젖은 옷은 무거워지고 마찰이 크게
              늘어납니다. 위의 그림에서 표시한 자리 외에 옷 봉제선이 닿는 곳이 새로 문제가 됩니다.
            </p>
            <p>
              모자챙이 있으면 눈에 물이 들어오는 걸 크게 줄여줍니다.
              비닐 우의는 출발 전까지만 입고 벗는 쪽이 일반적입니다 — 달리면서 입으면 열이 갇힙니다.
            </p>
          </Item>
        </div>

        {/* ── 완주 후 ──
            2026-09-03 신설. 페이지가 결승선에서 끝나 있었는데,
            완주 직후 30분이 실제로는 사고가 잦은 구간이다.
            2026-10-13 — 쓰러짐·의료진 문장은 전부 본문. 근거 안에는 출처만. */}
        <h2 id="after" className={H2}>
          완주 후 30분 — 여기서 끝이 아닙니다
        </h2>
        <div className="mt-5 space-y-3">
          <Item weight="must" basis="paper" title="바로 멈춰 서지 말고 걸으세요 — 어지러우면 누워서 다리를 올리세요">
            <p>
              결승선을 지나자마자 멈춰 서지 말고 몇 분은 천천히 걸으세요(걷는 시간은 저희 제안입니다).
              <strong> 어지러워서 서 있기 힘들면 억지로 걷지 말고 누워서 다리를 올리세요.</strong>
            </p>
            <p>
              완주 직후 쓰러지는 일은 장거리 달리기 대회 결승선에서 흔하고, 지금은 주로{" "}
              <strong>달리기를 멈춘 순간 다리에 피가 고여 혈압이 일시적으로 떨어지는 것</strong>(운동 관련 허탈)으로 봅니다.
              처치도 <strong>누워서 다리를 올린 자세</strong>와 입으로 마시는 수분이 중심입니다.
            </p>
            <Warn title="단순 어지럼으로 넘기지 마세요">
              같은 리뷰는 의료진이 먼저 심정지·열사병·저나트륨혈증 같은 위험한 원인을 배제해야 한다고 강조합니다.
              <strong> 의식이 흐리거나 말이 어눌하면 단순 어지럼으로 넘기지 말고 바로 의료진을 부르세요.</strong>
            </Warn>
            <Evidence n={1}>
              <p>
                완주 후 쓰러짐(운동 관련 허탈)에 대한 근거 리뷰 — 기전, 누운 자세에서 다리 올리기와 입으로 마시는 수분 중심의
                처치, 위험한 원인 배제의 필요를 정리했습니다.{" "}
                <S>(Asplund et al. (2011) <Up h="https://pubmed.ncbi.nlm.nih.gov/21948122/" />)</S>
              </p>
            </Evidence>
          </Item>

          <Item weight="must" basis="practice" title="젖은 옷을 갈아입으세요 — 특히 추운 날">
            <p>
              <strong>물품보관소에서 마른 옷을 가장 먼저 꺼내세요.</strong> 달릴 때는 열이 나서 몰랐는데, 멈추는 순간 젖은 옷이
              체온을 빠르게 뺏어갑니다. 기온이 낮은 날에는 이게 생각보다 위험합니다.
            </p>
            <p>담요나 보온포를 나눠주는 대회라면 받아서 두르는 게 맞습니다.</p>
          </Item>

          <Item weight="should" basis="practice" title="물집·발톱은 그날 확인하세요" open>
            <p>
              <strong>양말을 벗고 발가락 사이까지</strong> 보세요. 집에 가서 씻을 때 처음 발견하면 이미 터져 있는 경우가
              많습니다.
            </p>
            <p>
              발톱 밑이 검게 변했다면 압박 때문일 수 있고, 다음 대회 전에 신발 사이즈를 다시 볼 신호입니다.
              통증이 심하거나 발톱 밑에 피가 고여 부풀었다면 직접 뚫지 말고 병원에 가세요.
            </p>
          </Item>
        </div>

        <div className="mt-14">
          <YoutubeSection links={[
            // 2026-08-31 신설. 검색 URL은 임시다 — 실제 영상으로 교체하고
            // npm run check:youtube 로 채널을 확인할 것. channel은 확인 전까지 비워둔다.
            { label: "하프마라톤 대회 준비 영상 검색", url: "https://www.youtube.com/results?search_query=하프마라톤+대회+준비+초보" },
            { label: "에너지젤 먹는 법 영상 검색", url: "https://www.youtube.com/results?search_query=마라톤+에너지젤+먹는법" },
          ]} />
        </div>

        <FaqSection items={[
          {
            q: "하프마라톤도 탄수화물 로딩을 해야 하나요?",
            a: "완주에 90분 안팎이 걸린다면 대체로 필요 없습니다. 연구를 모은 리뷰에서 60~90분 중강도 달리기는 근글리코겐을 평소 이상 채워도 이득이 없었고, 90분을 넘는 종목에서는 피로가 약 20% 늦게 왔습니다(Hawley 1997). 90분을 넘긴다면 대회 전 탄수화물 위주로 먹어 글리코겐을 채우는 것이 권고 방향입니다. 풀코스용 고용량 로딩까지는 필요 없다고 보지만, 이건 저희 제안입니다.",
          },
          {
            q: "하프마라톤에서 에너지젤은 몇 개 먹어야 하나요?",
            a: "90분 안팎에 들어온다면 없어도 완주에 지장이 없습니다. 그 이상 걸린다면 2~3시간 운동 기준 시간당 약 60g까지가 권고 범위이고(Jeukendrup 2014), 젤 하나가 보통 20~30g이라 시간당 1~2개 꼴입니다. 시간당 90g 같은 고용량은 초장거리 경기용입니다. 중요한 건 개수보다 연습 롱런에서 같은 제품으로 미리 시험해보는 것입니다.",
          },
          {
            // 2026-09-03 정정: 본문에서 이미 철회한 문장이 **FAQ에는 그대로 살아 있었다.**
            // "탈수보다 이쪽이 더 자주 문제가 됩니다" — 본문 160행에 "둘의 빈도를 비교한
            // 근거를 찾지 못해 내렸다"고 적어놓고 FAQ는 안 봤다.
            // **같은 페이지가 자기 자신과 모순하고 있었다.**
            // 같은 유형이 warmup 페이지에서도 나왔다(본문은 카드로 바꾸고 FAQ는 옛 요약 유지).
            // 본문을 고치면 **FAQ와 metadata도 같이 훑을 것.**
            q: "대회 중에 물은 얼마나 마셔야 하나요?",
            a: "목마를 때 마시는 것이 현재 전문가 리뷰의 권고입니다(Hew-Butler 2017). 급수대마다 무조건 마실 필요는 없습니다. 물을 과하게 마시면 혈중 나트륨이 희석되는 운동유발 저나트륨혈증 위험이 있고, 보스턴 마라톤 연구에서는 레이스 중 체중이 늘 만큼 마신 사람, 완주 시간이 긴 사람의 위험이 높았습니다(Almond 2005). 다만 탈수와 저나트륨혈증 중 어느 쪽이 더 흔한지는 이 페이지에서 근거를 확인하지 못했으니, 신호를 보고 판단하세요. 달리는 중 메스꺼움·두통·손발 부기가 있거나 완주 후 체중이 늘었다면 물을 더 마시지 말고 즉시 의료진에게 가세요. 반대로 덥고 습한 날 하프 대회에서는 적게 마신 쪽의 문제가 관찰됐으니(Martinez-Cano 2018), 갈증이 오면 참지 말고 마셔야 합니다.",
          },
          {
            q: "대회 전날 저녁과 당일 아침에 피해야 할 음식은 뭔가요?",
            a: "섬유질, 지방, 단백질, 농도가 진한 당 용액이 운동 중 위장 증상 위험을 높이는 것으로 보고됩니다. 전날 저녁의 현미·잡곡·나물·튀김·삼겹살, 당일 아침의 우유·요거트·계란·견과류가 흔한 지뢰입니다. 흰쌀밥·흰빵·바나나처럼 단순하고 소화가 빠른 탄수화물이 무난합니다.",
          },
        ]} />

        <References n={14} title="참고 자료" note="2026-10-08 PubMed 초록(일부 PMC 전문)과 대조했습니다.">
          <p className="mb-3 text-sm leading-relaxed text-gray-500">
            위에서 <strong>&lsquo;연구 근거&rsquo;</strong>으로 표시한 항목과 근거 보기 안 ↗ 표시의 출처입니다.
            &lsquo;통용 관행&rsquo;과 &lsquo;직접 경험&rsquo; 항목은 이 페이지에서 논문으로 확인하지 못한 것들이고,
            그 카드 안에 출처가 붙은 문장은 그 문장에만 해당합니다.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://pubmed.ncbi.nlm.nih.gov/26891166/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Thomas et al. (2016) Med Sci Sports Exerc 48(3):543-68 — ACSM·미국영양학회·캐나다영양사협회 합동 성명, 스포츠 영양 종합 권고 ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://pubmed.ncbi.nlm.nih.gov/26102445/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Hew-Butler et al. (2015) Clin J Sport Med 25(4):303-20 — 제3차 운동유발 저나트륨혈증 국제 합의문. PubMed에 초록이 없어 내용은 대조하지 못했습니다 ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Hew-Butler et al. (2017)</strong> — 운동유발 저나트륨혈증 리뷰. 갈증대로 마시기 권고, 코스 급수 축소 후 발생 감소 보고. <a href="https://pubmed.ncbi.nlm.nih.gov/28316971/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Altieri et al. (2026)</strong> — 운동유발 저나트륨혈증의 기전(과음·항이뇨호르몬)과 처치. <a href="https://pubmed.ncbi.nlm.nih.gov/40913680/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Almond et al. (2005)</strong> — 2002 보스턴 마라톤 참가자 488명 혈액검사. 저나트륨혈증 13%, 위험 수준 0.6%, 위험 요인. <a href="https://pubmed.ncbi.nlm.nih.gov/15829535/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Martinez-Cano et al. (2018)</strong> — 덥고 습한 날 하프마라톤 81명. 저나트륨혈증 0건, 고나트륨혈증 7.4%. <a href="https://pubmed.ncbi.nlm.nih.gov/29955376/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Gauckler et al. (2021)</strong> — 초장거리 사이클 선수 919명 설문. 부기 증상과 음수 전략·진통제의 연관. <a href="https://pubmed.ncbi.nlm.nih.gov/34863204/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Hawley et al. (1997)</strong> — 카보로딩 리뷰. 60~90분 운동은 이득 없음, 90분 초과 시 피로 약 20% 지연. <a href="https://pubmed.ncbi.nlm.nih.gov/9291549/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Jeukendrup (2014)</strong> — 운동 시간별 탄수화물 섭취 권고(2~3시간 약 60g/h, 초장거리 약 90g/h). <a href="https://pubmed.ncbi.nlm.nih.gov/24791914/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Burke et al. (2019)</strong> — 장거리 육상·경보 선수 영양 전략 리뷰. <a href="https://pubmed.ncbi.nlm.nih.gov/30747558/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Asplund et al. (2011)</strong> — 완주 후 쓰러짐(운동 관련 허탈) 근거 리뷰. <a href="https://pubmed.ncbi.nlm.nih.gov/21948122/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Herring & Richie (1990)</strong> — 장거리 러너 35명 이중맹검. 아크릴 양말이 면 양말보다 물집이 적고 작음. <a href="https://pubmed.ncbi.nlm.nih.gov/2304016/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://pubmed.ncbi.nlm.nih.gov/24791919/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                de Oliveira et al. (2014) Sports Med 44(Suppl 1):79-85 — 운동 중 위장 증상의 빈도·원인·영양 권고 ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://pubmed.ncbi.nlm.nih.gov/33388079/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Guest et al. (2021) J Int Soc Sports Nutr — 국제스포츠영양학회 카페인 포지션 스탠드 ↗
              </a>
            </li>
          </ul>
          <p className="mt-3 text-xs text-gray-400">추천 순서는 광고비로 바뀌지 않습니다. 공개된 연구 자료를 근거로 작성했습니다.</p>
        </References>

        <p className="mt-6 text-xs text-gray-400">
          ※ 이 콘텐츠는 일반적인 정보 제공 목적이며 의학적 진단이나 치료를 대체하지 않습니다.
          지병이 있거나 약을 복용 중이라면 대회 참가 전 전문의와 상담하세요.
        </p>

        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl">
          <p className="font-medium text-emerald-900 mb-2">대회용 신발은 정하셨나요?</p>
          <p className="text-sm text-emerald-800 mb-4">
            길들이지 않은 신발은 물집 위험을 키울 수 있습니다.<Basis kind="rule" />{" "}
            체형과 발 조건을 넣으면 맞는 신발을 추려드립니다.
          </p>
          <Link href="/shoe-finder" className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            나에게 맞는 신발 찾기 →
          </Link>
        </div>
        <ShareButtons from="half-marathon-race-day" title="하프마라톤 대회 당일 체크리스트" description="페이스·급수·젤·바세린을 근거와 경험으로 구분해 정리했습니다." />

      </article>
    </>
  );
}
