import type { Metadata } from "next";
import Link from "next/link";
import { dropText, weightText } from "@/lib/shoes/labels";
import { SHOES } from "@/lib/shoes/data";
import FinderCta from "@/components/FinderCta";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta, { AuthorNote } from "@/components/ArticleMeta";
import ShoeJsonLd, { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Lead, P, H2, Num, KeyPoints, Steps, OneLine, Caveat, Sources, Src, Ref } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

/**
 * 카본화 — 검색 수요 3위(카본화 관련 20%)에 답하는 페이지.
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 만들었나 (2026-09-08)
 *
 * 네이버 실측 검색 의도 상위 셋 중 둘은 이미 페이지가 생겼다
 * (브랜드 비교 73% → `/compare/hoka-vs-brooks`, 발 조건 33% → `/injury/flat-feet`).
 * 카본화 20% 만 남아 있었다. 블로그 글(`docs/블로그/네이버블로그_카본화입문자.md`)은 있는데
 * **사이트에 받아 줄 페이지가 없어서** 글이 `/shoe-finder` 로만 보내고 있었다.
 *
 * ─────────────────────────────────────────────────────────────
 * 근거의 경계는 `lib/shoes/data.ts` 1900행 주석에 이미 감사돼 있다
 *
 * 그대로 따른다. 새로 해석하지 않는다:
 *   · Hoogkamer et al. (2018)은 **14 · 16 · 18 km/h 세 속도에서만** 측정했다.
 *     14 km/h ≈ 4:17/km. **그보다 느린 속도는 아예 시험하지 않았다.**
 *   · 시험한 것은 Nike 프로토타입(후일 Vaporfly 4%) · Zoom Streak 6 · Adios Boost 2 다.
 *     **이 사이트에 실린 카본화 중 그 논문이 실측한 모델은 없다.**
 *   · 4% 는 기록 향상이 아니라 **대사 에너지 비용 감소**다.
 *   · 카본 플레이트 단독 효과를 폼과 분리하지 않았다 → "플레이트 덕분"이라고 말할 수 없다.
 *   · 에너지 반환율(85% · 87% 등)은 **브랜드 발표 수치**이지 논문 수치가 아니다.
 *
 * 그 주석은 "5:30/km 경계"라는 **논문 밖 숫자**를 이 저장소가 한 번 퍼뜨렸다가
 * 감사에서 걷어낸 기록이기도 하다. 여기서 다시 만들어 내지 않는다.
 *
 * 숫자(개수·가격·무게)는 `SHOES` 에서 계산한다. 상수를 적지 않는다.
 *
 * 2026-11-23 「느린 속도는 확인 안 됨」 흐름을 고쳤다 — Bolliger 2026 Sports Med Open(PMID 41703164)이 1km 8분~5분 속도를 시험했고
 *   거기서도 카본 대회화가 산소를 덜 썼다. Bruneau 2026 PM&R(doi:10.1002/pmrj.70153)은 뼈 피로 부상과 관련된 움직임이 조금 늘었다고 했다.
 *   추천기(recommend.ts 「처음이라면 평소에는 쿠션화…」)와 같은 판정: 「평소엔 쿠션화, 카본화는 빠른 날에 조금씩」.
 *   FAQ 의 「밑창이 단단하고 불안정해 발목·아킬레스에 부담」은 근거를 찾지 못해 뺐다. 판정 전체: docs/판정/carbon-plate.jsonl
 *   위 「Hoogkamer 는 14·16·18km/h 만」 경계는 그대로 맞다 — 그 논문 하나로 느린 속도를 말하지 않는다는 뜻이다.
 *
 * 2026-10-13 가독성 재설계 — 「먼저 결론」 → 요약 상자, 참고 문헌은 맨 끝 기본 접힘.
 *   「4:17/km 보다 느린 속도는 시험하지 않았다 — 효과가 없다는 게 아니라 확인이 안 됐다」가 이 글의 결론이라
 *   접지 않는다(Lead·Summary·본문에 그대로). 「말한 것/말하지 않은 것」 박스와 가격 목록도 그대로.
 *   (2026-11-23 이후로는 결론이 아니다 — 위 11-23 줄과 아래 확정 틀 줄)
 *
 * 2026-11-23 확정 틀로 바꿈 (docs/운영/가이드_틀.md, 견본 app/injury/start-running/page.tsx)
 *   판정은 docs/판정/carbon-plate.jsonl 그대로 — 새로 읽은 논문 없음, 새 주장 없음. 이번 일은 틀과 말투다.
 *
 *   틀 — 옛 부품(한눈에 상자 · 근거 수준 딱지 · 글 끝 문헌 목록 · 「말한 것/말하지 않은 것」 두 상자 · 회색 출처 줄 ·
 *     추천 공개 상자 · 부상 단서 상자)을 걷어냈다. (옛 부품 이름을 주석에 적으면 check:geo 가 글에 남은 것으로 세므로 풀어서 적는다.)
 *     큰 질문 4개, id(evidence·pace·how·shoe-list)는 그대로 — 이 글의 앵커를 거는 곳은 없다(grep 2026-11-23).
 *     · 두 상자와 4:17/km 설명 → 1절은 「4% 는 기록이 아니라 에너지」 두 문장 + 단서 한 줄(시제품과 예전 신발).
 *       「4:17/km 보다 빠른 속도에서만」은 FAQ 첫 문항(1km 4분 17초 = 60/14 계산), 「판과 폼을 나누지 않음」은 FAQ 둘째 문항.
 *     · 브랜드 에너지 반환율 안내 → FAQ 셋째 문항(풀이 한 문장을 붙임).
 *     · 「저희 추천은 카본화를 이렇게 다룹니다」 상자 → FAQ 넷째 문항(점수 안 깎음 · 일상 달리기면 뒤로 · 처음이면 결과 화면 안내).
 *       옛 FAQ 「저희는 카본화를 추천하나요?」와 같은 내용이라 하나로 합쳤다.
 *     · 「카본화 신으면 다치지 않을까요?」 상자와 옛 FAQ 「초보가 카본화를 신으면 위험한가요?」 → 3절 본문(같은 내용을 두 곳에 두지 않는다).
 *     · 「신어 보고 편한 것」(Bolliger 편안함) → 4절(고르는 절)로 옮겨 3절은 연구 언급 한 번(Bruneau)만.
 *     · 글 끝 질문 상자 · 공유 단추 · 두 번째 신발 찾기 단추를 뺐다 — 다른 확정 틀 글과 같게 신발 찾기는 4절 안에 하나.
 *   말투 — 「~니다」 → 「~요」. 「저희가 확인한」「현행(후속 미출시)」「데일리화」 → 쉬운 말. 「드롭」은 목록 앞에서 풀이.
 *     말의 세기: Hoogkamer·Bolliger 두 편이 같은 방향 → 「힘이 덜 드는 편」, Bruneau 한 편 → 「~는 시험이 있어요」,
 *     쿠션화·조금씩은 사이트가 정한 안내 → 「권해요」.
 *   본문에서 내린 것 — 연구 인원·대상(Bolliger 14명, Bruneau 엘리트 23명, Hoogkamer 18명)과 속도 숫자(시속 14·16·18km)는 출처에만.
 *   다른 곳 — lib/shoes/recommend.ts · app/shoes/[id] · app/tier-list 는 손대지 않았고 같은 말을 쓴다.
 */

const PAGE_URL = pageUrl("/injury/carbon-plate");
const TITLE = "카본화, 초보가 느리게 뛰어도 효과 있나요?";
// 원장 lib/guide/articles.ts 의 desc 와 같은 문장이어야 한다(허브 카드·검색 결과가 어긋나지 않게)
const DESC =
  "1km 8분~5분으로 천천히 달려도 카본화가 힘이 덜 들었다는 시험이 있습니다. 처음이라면 어떻게 섞어 쓰면 좋은지, 지금 가격은 얼마인지 근거와 함께 봅니다.";

export const metadata: Metadata = {
  title: `${TITLE} | 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/carbon-plate" },
};

const CARBON = SHOES.filter((s) => s.hasCarbon && s.gender !== "female");
const CARBON_NOW = CARBON.filter((s) => !s.successor);
const NON_CARBON = SHOES.filter((s) => !s.hasCarbon && s.gender !== "female");
// 2026-11-24: 무게 평균은 270mm 로 잰 신발끼리만(잰 사이즈가 다른 무게를 섞지 않는다)
const at270 = (s: (typeof SHOES)[number]) => s.weightSizeMm === 270;

const won = (n: number) => n.toLocaleString() + "원";
const avg = (ns: number[]) => (ns.length ? ns.reduce((a, b) => a + b, 0) / ns.length : 0);

const NOW_MIN = Math.min(...CARBON_NOW.map((s) => s.priceKrw));
const NOW_MAX = Math.max(...CARBON_NOW.map((s) => s.priceKrw));
const CARBON_W = avg(CARBON_NOW.filter(at270).map((s) => s.weightG));
const NORMAL_W = avg(NON_CARBON.filter(at270).map((s) => s.weightG));
// 본문에 넣는 값은 소문자 이름으로 — check:geo 가 화면 글자 조각 속 대문자 2~5자(NOW·MIN)를 약어로 읽는다.
// 비교식의 「<」도 조각을 끊어 뒤 문장(드롭 풀이)을 못 읽게 하므로 밖에서 계산한다.
const nowCount = CARBON_NOW.length;
const oldCount = CARBON.length - CARBON_NOW.length;
const priceFrom = won(NOW_MIN);
const priceTo = won(NOW_MAX);
const carbonG = CARBON_W.toFixed(0);
const normalG = NORMAL_W.toFixed(0);
const weightWord = CARBON_W < NORMAL_W ? "가벼워요." : "무거워요.";

// FAQ 는 본문 큰 질문과 겹치지 않는 곁가지만 둔다. 전문어는 문항마다 다시 풀이한다(check:geo 가 본다)
const FAQ: FaqItem[] = [
  {
    q: "카본화 4% 효과는 어느 속도에서 잰 건가요?",
    a: "**1km 4분 17초와 그보다 빠른 속도**에서만 잰 값이에요. 4%는 기록이 아니라 같은 속도에서 드는 에너지가 줄어든 정도예요. 더 느린 1km 8분~5분 속도는 다른 시험이 쟀고, 거기서도 **힘이 덜 드는 편**이었어요.",
  },
  {
    q: "카본화는 탄소 판 덕분에 힘이 덜 드나요?",
    a: "어느 쪽 덕분인지는 나뉘지 않았어요. 가장 많이 인용되는 시험은 **탄소 판과 밑창 소재의 효과를 따로 재지 않았어요.** 신발 전체를 비교한 결과예요.",
  },
  {
    q: "에너지 반환율 85%, 믿어도 되나요?",
    a: "에너지 반환율은 밑창이 눌릴 때 받은 힘을 얼마나 되돌려 주는지 나타낸 숫자예요. 85%나 87% 같은 값은 **브랜드가 발표한 값**이고 논문 수치가 아니에요. 브랜드마다 재는 방법이 달라 **서로 비교할 수도 없어요.**",
  },
  {
    q: "맞춤 추천은 입문자에게 카본화를 빼나요?",
    a: "빼지 않아요. 입문자라고 **카본화 점수를 깎지 않아요.** 용도를 **대회나 빠른 훈련**으로 고르면 후보에 오르고, 일상 달리기로 고르면 뒤로 가요. 처음 달리는 분께는 결과 화면에서 쿠션화와 섞어 쓰는 법을 함께 안내해요.",
  },
];

const pill = "rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-400";

export default function CarbonPlatePage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} datePublished="2026-09-08" />
      <ShoeJsonLd shoes={CARBON} name="카본 플레이트 러닝화" url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["카본화", "/injury/carbon-plate"],
        ]}
      />
      <main>
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-600">카본화</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <ArticleMeta href="/injury/carbon-plate" compact checked={3} />

        <KeyPoints
          items={[
            <>천천히 달려도 카본화를 신으면 <strong>힘이 덜 드는 편</strong>이었어요. 기록이 그만큼 빨라진다는 뜻은 아니에요.</>,
            <>처음이라면 <strong>평소엔 쿠션화로 달리고</strong>, 카본화는 빠르게 달리는 날에 조금씩 섞어 신기를 권해요.</>,
            <>여러 켤레 중에서 고를 때는 <strong>신어 보고 편한 것</strong>으로 골라 보세요.</>,
          ]}
        />

        <Lead>
          카본화는 밑창에 탄소 판이 든 신발이에요. 천천히 뛰는데 카본화가 도움이 될지 고민이라면,{" "}
          <strong>힘은 덜 들 수 있어요.</strong> 다만 처음부터 카본화만 신기보다는 쿠션화와 나눠 신는 편이 좋아요.
        </Lead>

        <TableOfContents
          items={[
            { id: "evidence", label: "카본화 신으면 빨라지나요?" },
            { id: "pace", label: "천천히 뛰어도 힘이 덜 드나요?" },
            { id: "how", label: "처음이라면 어떻게 신나요?" },
            { id: "shoe-list", label: "얼마고, 어떻게 고르나요?" },
          ]}
        />

        {/* ── 1 ─────────────────────────────────────────── */}
        <h2 id="evidence" className={H2}>
          <Num n={1} />카본화 신으면 정말 빨라지나요?
        </h2>
        <P>
          같은 속도로 달릴 때 <strong>힘이 덜 드는 편이지만, 기록이 그만큼 빨라진다고 확인된 건 아니에요.</strong>
        </P>
        <P>
          흔히 말하는 4%는 시험한 신발이 같은 속도에서 드는 에너지를 약 4% 줄였다는 뜻이에요.{" "}
          <strong>기록이 4% 빨라진다는 뜻이 아니에요.</strong>
        </P>
        <Caveat>그 시험은 지금 파는 모델이 아니라 시제품과 예전 신발 두 켤레를 비교했어요.</Caveat>

        <OneLine>카본화는 힘을 덜 쓰게 돕는 신발이지, 기록을 정해 주는 신발은 아니에요.</OneLine>

        {/* ── 2 ─────────────────────────────────────────── */}
        <h2 id="pace" className={H2}>
          <Num n={2} />천천히 뛰어도 카본화가 힘이 덜 드나요?
        </h2>
        <P>
          덜 드는 편이었어요. <strong>1km를 8분에서 5분 사이</strong>로 달리는 속도에서도 카본화가 일반 러닝화보다 산소를 덜
          썼고, 그 차이는 속도와 관계없었어요.
        </P>
        <Caveat>시험한 카본화는 한 모델이었고, 이 사이트에 있는 모델은 아니에요. 기록이 얼마나 빨라지는지도 재지 않았어요.</Caveat>

        <OneLine>천천히 달려도 카본화는 힘이 덜 드는 편이었어요.</OneLine>

        {/* ── 3 ─────────────────────────────────────────── */}
        <h2 id="how" className={H2}>
          <Num n={3} />처음이라면 카본화를 어떻게 쓰면 좋나요?
        </h2>
        <P>
          <strong>평소에는 쿠션화로 달리고, 카본화는 대회나 빠르게 달리는 날에 조금씩</strong> 섞어 쓰기를 권해요.
        </P>
        <Steps
          items={[
            { t: "평소 달리기는 쿠션화로 해요." },
            { t: "카본화는 대회나 빠르게 달리는 날에 신어요.", d: "처음 신을 땐 짧은 거리부터 늘려 가요." },
          ]}
        />
        <P>
          카본화가 부상을 늘리는지 줄이는지는 아직 근거가 부족해요. 다만 카본화에서 뼈에 부담이 가는 움직임이 조금 늘었다는
          시험이 있어요. 부상 수를 센 시험은 아니고, 늘어난 폭도 작았어요.
        </P>

        <OneLine>평소엔 쿠션화로 달리고, 카본화는 빠르게 달리는 날에 조금씩 신어요.</OneLine>

        {/* ── 4 ─────────────────────────────────────────── */}
        <h2 id="shoe-list" className={H2}>
          <Num n={4} />카본화는 얼마고, 어떻게 고르나요?
        </h2>
        <P>
          후속 모델이 아직 안 나온 카본화 {nowCount}개는 <strong>{priceFrom}부터</strong> {priceTo}까지예요.
          고를 때는 <strong>신어 보고 편한 것</strong>으로 골라 보세요.
        </P>
        <P>
          천천히 달리는 속도를 잰 시험에서도 사람들이 신발을 고를 때는 편안함이 더 크게 작용했어요.
        </P>
        <P>
          270mm 로 잰 무게끼리 보면 카본화 평균은 {carbonG}g으로, 카본 판이 없는 러닝화 평균 {normalG}g보다 {weightWord} 목록의 드롭은 뒤꿈치와 앞꿈치의 밑창 높이 차이예요.
        </P>
        <ul className="mt-4 space-y-1.5">
          {CARBON_NOW.sort((a, b) => a.priceKrw - b.priceKrw).map((s) => (
            <li key={s.id} className="break-keep text-base">
              <span className="font-medium text-gray-900">
                {s.brand} {s.model}
              </span>
              <span className="ml-1.5 text-xs text-gray-500">
                {won(s.priceKrw)} · {weightText(s)} · 드롭 {dropText(s)}
              </span>
            </li>
          ))}
        </ul>
        {CARBON.length > CARBON_NOW.length && (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-gray-500">
              후속 모델이 나온 {oldCount}개도 보기(보통 재고 할인이 붙어요)
            </summary>
            <ul className="mt-2 space-y-1.5">
              {CARBON.filter((s) => s.successor)
                .sort((a, b) => a.priceKrw - b.priceKrw)
                .map((s) => (
                  <li key={s.id} className="text-sm text-gray-500">
                    {s.brand} {s.model}
                    <span className="ml-1.5 text-xs">
                      {won(s.priceKrw)} · {weightText(s)} · 후속 {s.successor}
                    </span>
                  </li>
                ))}
            </ul>
          </details>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/tier-list" className={pill}>내 단계에 맞는 신발 칸이 궁금하다면 →</Link>
        </div>
        <FinderCta
          from="carbon-plate"
          variant="inline"
          headline="지금 내 수준에 맞는 신발이 뭔지 모르겠다면 조건을 넣어 보세요."
        />

        <OneLine>값과 무게를 본 뒤에는, 신어 보고 편한 카본화를 골라요.</OneLine>

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <Sources>
          <Src n={1}>
            <strong>Hoogkamer et al. (2018)</strong> 러너 18명이 시속 14·16·18km(1km 약 4분 17초·3분 45초·3분 20초)에서 달린 시험이에요. 시제품 신발이 Zoom Streak 6·Adios Boost 2보다 같은 속도의 에너지 비용을 평균 4% 낮췄어요. 기록은 재지 않았고, 탄소 판과 밑창 소재의 효과를 나누지 않았어요.
            <Ref>Sports Med 48(4):1009-1019 · <a href="https://pubmed.ncbi.nlm.nih.gov/29143929/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={2}>
            <strong>Bolliger et al. (2026)</strong> 14명(남 6·여 8)이 시속 7.5~12km(1km 8분~5분)에서 달린 시험이에요. 카본 대회화(On Cloudboom Echo 3)가 일반 러닝화보다 산소 비용이 낮았고 속도에 따라 달라지지 않았어요. 신발 선호는 편안함이 더 크게 좌우했어요.
            <Ref>Sports Med Open 12(1):12 · <a href="https://pubmed.ncbi.nlm.nih.gov/41703164/" target="_blank" rel="noopener noreferrer">PubMed</a></Ref>
          </Src>
          <Src n={3}>
            <strong>Bruneau et al. (2026)</strong> 엘리트 러너 23명이 카본 대회화로 달릴 때 뼈 피로 부상과 관련된 움직임 몇 가지가 조금 늘었어요. 변화는 작았고, 부상 수를 센 연구는 아니에요.
            <Ref>PM&amp;R · <a href="https://doi.org/10.1002/pmrj.70153" target="_blank" rel="noopener noreferrer">DOI</a></Ref>
          </Src>
        </Sources>
        <AuthorNote />
        <p className="mt-3 text-xs text-gray-400">이 글은 의학적 진단을 대체하지 않아요. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
      </main>
    </>
  );
}
