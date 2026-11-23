import type { Metadata } from "next";
import Link from "next/link";
import { SHOES } from "@/lib/shoes/data";
import FinderCta from "@/components/FinderCta";
import InlineAsk from "@/components/InlineAsk";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ShareButtons from "@/components/ShareButtons";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ArticleMeta from "@/components/ArticleMeta";
import ShoeJsonLd, { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Up, S } from "@/components/guide/Up";
import { Lead, P, H2, Summary, References, Basis, Note } from "@/components/guide/Read";
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
 * 2026-10-13 가독성 재설계 — 「먼저 결론」 → <Summary>, 참고 문헌은 맨 끝 기본 접힘.
 *   「4:17/km 보다 느린 속도는 시험하지 않았다 — 효과가 없다는 게 아니라 확인이 안 됐다」가 이 글의 결론이라
 *   접지 않는다(Lead·Summary·본문에 그대로). 「말한 것/말하지 않은 것」 박스와 가격 목록도 그대로.
 */

const PAGE_URL = pageUrl("/injury/carbon-plate");

export const metadata: Metadata = {
  title: "카본화, 초보가 느리게 뛰어도 효과 있나요? | 뛰다가 아메리카노",
  description:
    "1km 8분~5분으로 천천히 달려도 카본화가 힘이 덜 들었다는 시험이 있습니다. 처음이라면 어떻게 섞어 쓰면 좋은지, 지금 가격은 얼마인지 근거와 함께 봅니다.",
  alternates: { canonical: "/injury/carbon-plate" },
};

const CARBON = SHOES.filter((s) => s.hasCarbon && s.gender !== "female");
const CARBON_NOW = CARBON.filter((s) => !s.successor);
// 2026-11-23: 무게 사이즈 기준이 다른 신발(weightBasis)은 평균에서 뺀다 — 남성 US9 끼리만 비교
const NON_CARBON = SHOES.filter((s) => !s.hasCarbon && s.gender !== "female" && !s.weightBasis);

const won = (n: number) => n.toLocaleString() + "원";
const avg = (ns: number[]) => (ns.length ? ns.reduce((a, b) => a + b, 0) / ns.length : 0);

const NOW_MIN = Math.min(...CARBON_NOW.map((s) => s.priceKrw));
const NOW_MAX = Math.max(...CARBON_NOW.map((s) => s.priceKrw));
const CARBON_W = avg(CARBON_NOW.map((s) => s.weightGramsM9));
const NORMAL_W = avg(NON_CARBON.map((s) => s.weightGramsM9));

const FAQ: FaqItem[] = [
  {
    q: "카본화를 신으면 정말 빨라지나요?",
    a: "시험한 신발이 대사 에너지 비용을 약 4% 낮췄다는 연구가 가장 많이 인용됩니다(Hoogkamer 2018, Sports Medicine). 다만 4%는 기록이 4% 빨라진다는 뜻이 아닙니다. 같은 속도로 달릴 때 드는 에너지가 적었다는 뜻입니다. 그 연구는 14, 16, 18km/h 세 속도에서만 측정했습니다. 카본 플레이트 단독 효과를 중창 폼과 분리하지도 않았습니다.",
  },
  {
    q: "느리게 뛰어도 효과가 있나요?",
    a: "힘이 덜 드는 편이었습니다. 1km를 8분에서 5분 사이로 달리는 속도에서도 카본 대회화가 일반 신발보다 산소를 덜 썼고, 그 차이는 속도와 관계없었습니다(Bolliger 2026). 가장 많이 인용되는 Hoogkamer 2018 연구는 약 4:17/km보다 느린 속도를 시험하지 않았습니다.",
  },
  {
    q: "초보가 카본화를 신으면 위험한가요?",
    a: `위험하다고 단정할 근거는 부족합니다. 다만 카본화에서 뼈에 부담이 가는 움직임이 조금 늘었다는 시험이 있습니다(Bruneau 2026). 그래서 평소에는 쿠션화로 달리고, 카본화는 빠르게 달리는 날에 조금씩 섞어 쓰기를 권합니다. 현행 카본화는 ${won(NOW_MIN)}부터입니다.`,
  },
  {
    q: "저희는 카본화를 추천하나요?",
    a: `입문자라고 카본화 점수를 깎지 않습니다. 용도를 대회나 빠른 훈련으로 고르면 후보에 오르고, 일상 달리기로 고르면 뒤로 갑니다. 저희가 스펙을 확인한 카본화는 ${CARBON.length}개이고 그중 후속이 안 나온 현행 모델은 ${CARBON_NOW.length}개입니다.`,
  },
];

export default function CarbonPlatePage() {
  return (
    <>
      <ArticleJsonLd
        headline="카본화, 초보가 느리게 뛰어도 효과 있나요?"
        description="1km 8분~5분으로 천천히 달려도 카본화가 힘이 덜 들었다는 시험이 있습니다. 처음이라면 어떻게 섞어 쓰면 좋은지, 지금 가격은 얼마인지 근거와 함께 봅니다."
        url={PAGE_URL}
        datePublished="2026-09-08"
      />
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
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">카본화, 초보가 느리게 뛰어도 효과 있나요?</h1>
        <ArticleMeta href="/injury/carbon-plate" />
        <Lead>
          천천히 뛰는데 카본화가 도움이 될지 고민이라면, <strong>힘은 덜 들 수 있습니다.</strong> 다만 처음이라면{" "}
          <strong>평소에는 쿠션화로 달리고, 카본화는 빠르게 달리는 날에 조금씩</strong> 섞어 쓰는 편이 좋습니다.
        </Lead>

        <Summary
          items={[
            <>
              1km 8분~5분으로 천천히 달려도 카본화가 <strong>산소를 덜 썼다</strong>는 시험이 있습니다. 기록이 빨라진다는 뜻은
              아닙니다.
              <Basis kind="paper" />
            </>,
            <>
              카본화에서 <strong>뼈에 부담이 가는 움직임이 조금 늘었다</strong>는 시험도 있습니다. 처음이라면 빠른 날에 조금씩
              섞어 쓰기를 권합니다.
              <Basis kind="paper" />
            </>,
            <>
              지금 살 수 있는 현행 카본화는 <strong>{won(NOW_MIN)} ~ {won(NOW_MAX)}</strong>입니다.
              <Basis kind="rule" />
            </>,
          ]}
        />

        <TableOfContents
          items={[
            { id: "evidence", label: "카본화 신으면 빨라지나요?" },
            { id: "pace", label: "천천히 뛰어도 힘이 덜 드나요?" },
            { id: "how", label: "처음이라면 어떻게 쓰면 좋나요?" },
            { id: "shoe-list", label: `카본화 ${CARBON.length}개, 얼마인가요?` },
          ]}
        />

        {/* ── ① 논문이 말한 것 / 말하지 않은 것 ───────────────── */}
        <h2 id="evidence" className={H2}>
          카본화 신으면 정말 빨라지나요?
        </h2>
        <P>
          가장 많이 인용되는 연구에서 시험한 신발은 <strong>에너지를 약 4% 덜 쓰게 했습니다.</strong> 기록이 4% 빨라진다는 뜻은
          아닙니다.
        </P>
        <P>
          그 연구는 <strong>약 4:17/km보다 느린 속도를 시험하지 않았습니다.</strong> 더 느린 속도는 다음 절의 시험이 쟀습니다.
        </P>
        <p className="mt-2 text-sm text-gray-500">
          <S>(Hoogkamer et al. (2018) <Up h="https://pubmed.ncbi.nlm.nih.gov/29143929/" />)</S> Sports Medicine 48:1009-1019
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-bold text-emerald-900">말한 것</p>
            <ul className="mt-2 space-y-2 break-keep text-base leading-relaxed text-emerald-900">
              <li>· 시험한 신발이 <strong>대사 에너지 비용을 약 4% 낮췄다</strong></li>
              <li>· 측정 속도는 <strong>14, 16, 18 km/h</strong></li>
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-bold text-amber-900">말하지 않은 것</p>
            <ul className="mt-2 space-y-2 break-keep text-base leading-relaxed text-amber-900">
              <li>· <strong>4:17/km보다 느린 속도</strong>는 시험 자체를 안 했다</li>
              <li>· <strong>기록이 4% 빨라진다</strong>고 하지 않았다. 잰 것은 에너지 비용이다</li>
              <li>· <strong>플레이트 덕분이다</strong>라고 하지 않았다. 중창 폼과 분리하지 않았다</li>
              <li>· <strong>지금 파는 모델</strong>은 시험하지 않았다. 시험한 건 프로토타입과 구형 두 켤레다</li>
            </ul>
          </div>
        </div>

        <div className="mt-5 break-keep rounded-xl border border-gray-200 bg-gray-50 p-4 text-base leading-relaxed text-gray-700">
          <strong className="text-gray-900">에너지 반환율 85%나 87% 같은 숫자는</strong> 브랜드가
          발표한 값이지 논문 수치가 아닙니다. 브랜드마다 측정 방법이 달라 서로 비교할 수도 없습니다.
        </div>

        {/* ── ② 천천히 뛰어도 힘이 덜 드나 (2026-11-23 Bolliger 2026) ─────────── */}
        <h2 id="pace" className={H2}>
          천천히 뛰어도 카본화가 힘이 덜 드나요?
        </h2>
        <P>
          덜 드는 편이었습니다. <strong>1km를 8분에서 5분 사이</strong>로 달리는 속도에서도 카본 대회화가 일반 신발보다 산소를
          덜 썼고, 그 차이는 속도와 관계없었습니다.
        </P>
        <P>
          다만 시험한 카본화는 한 모델이었고, 이 사이트에 있는 모델을 직접 시험한 것은 아닙니다. 기록이 얼마나 빨라지는지도
          재지 않았습니다.
        </P>
        <p className="mt-2 text-sm text-gray-500">
          <S>(Bolliger et al. (2026) <Up h="https://pubmed.ncbi.nlm.nih.gov/41703164/" />)</S> Sports Medicine - Open 12:12
        </p>

        {/* ── ③ 처음이라면 어떻게 (2026-11-23 Bruneau 2026 · 추천기 안내와 같은 판정) ─────────── */}
        <h2 id="how" className={H2}>
          처음이라면 카본화를 어떻게 쓰면 좋나요?
        </h2>
        <P>
          <strong>평소에는 쿠션화로 달리고, 카본화는 대회나 빠르게 달리는 날에 조금씩</strong> 섞어 쓰기를 권합니다.
        </P>
        <P>
          카본화에서 뼈 피로 부상과 관련된 움직임 몇 가지가 조금 늘었다는 시험이 있습니다. 부상 수를 센 연구는 아니고, 늘어난
          폭도 작았습니다.
        </P>
        <p className="mt-2 text-sm text-gray-500">
          <S>(Bruneau et al. (2026) <Up h="https://doi.org/10.1002/pmrj.70153" />)</S>{" "}PM&amp;R
        </p>
        <P>
          고를 때는 <strong>신어 보고 편한 것</strong>을 고르세요. 앞의 시험에서도 사람들이 신발을 고를 때 편안함이 더 크게
          작용했습니다.
        </P>
        <P>
          지금 내가 어느 단계인지 모르겠다면{" "}
          <Link href="/tier-list" className="font-medium text-emerald-600 hover:underline">
            러닝화 계급도
          </Link>
          에서 칸별로 &ldquo;이런 사람에게&rdquo;를 적어 뒀습니다. 카본화는 마지막 칸입니다.
        </P>
        <FinderCta
          from="carbon-plate"
          variant="inline"
          headline="지금 내 수준에 맞는 신발이 뭔지 모르겠다면 조건을 넣어보세요."
        />

        {/* ── ③ 실제 가격 ────────────────────────────────────── */}
        <h2 id="shoe-list" className={H2}>
          저희가 확인한 카본화 {CARBON.length}개, 얼마인가요?
        </h2>
        <P>
          현행(후속 미출시) {CARBON_NOW.length}개는 <strong>{won(NOW_MIN)}부터</strong>입니다. 평균 무게는 {CARBON_W.toFixed(0)}g 으로
          일반 데일리화 {NORMAL_W.toFixed(0)}g 보다 가볍습니다.
        </P>
        <ul className="mt-4 space-y-1.5">
          {CARBON_NOW.sort((a, b) => a.priceKrw - b.priceKrw).map((s) => (
            <li key={s.id} className="break-keep text-base">
              <span className="font-medium text-gray-900">
                {s.brand} {s.model}
              </span>
              <span className="ml-1.5 text-xs text-gray-500">
                {won(s.priceKrw)} · {s.weightGramsM9}g · 드롭 {s.heelDropMm}mm
              </span>
            </li>
          ))}
        </ul>
        {CARBON.length > CARBON_NOW.length && (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-gray-500">
              후속 모델이 나온 {CARBON.length - CARBON_NOW.length}개도 보기(보통 재고 할인이 붙습니다)
            </summary>
            <ul className="mt-2 space-y-1.5">
              {CARBON.filter((s) => s.successor)
                .sort((a, b) => a.priceKrw - b.priceKrw)
                .map((s) => (
                  <li key={s.id} className="text-sm text-gray-500">
                    {s.brand} {s.model}
                    <span className="ml-1.5 text-xs">
                      {won(s.priceKrw)} · {s.weightGramsM9}g · 후속 {s.successor}
                    </span>
                  </li>
                ))}
            </ul>
          </details>
        )}

        {/* ── 추천 로직이 무엇을 하는지 공개 ────────────────── */}
        <div className="mt-8 rounded-2xl border border-gray-200 p-5">
          <p className="font-bold text-gray-900">
            저희 추천은 카본화를 이렇게 다룹니다
          </p>
          {/* 2026-11-23: 「입문자 프로필에서는 카본화 점수를 깎습니다」 → 감점 0(recommend.ts 7번 블록, Bolliger 2026).
              「시험(14명)」「해롭다는 시험은 찾지 못했다」는 Bruneau 2026 을 읽고 추천기 안내와 같은 문장으로 바꿨다. */}
          <p className="mt-2 break-keep text-base leading-relaxed text-gray-700">
            입문자라고 카본화 점수를 <strong>깎지 않습니다.</strong> 대신 처음 달리는 분께는 결과 화면에서 「평소에는 쿠션화로 달리고,
            카본화는 빠르게 달리는 날에 조금씩」을 함께 안내합니다. 용도를 「일상 달리기」로 고르면 대회 전용 신발은 뒤로 갑니다.
          </p>
        </div>

        <div className="mt-8 break-keep rounded-xl border border-amber-100 bg-amber-50 p-4 text-base leading-relaxed text-amber-900">
          <strong>카본화 신으면 다치지 않을까요?</strong> 카본화가 부상을 늘린다는 근거도, 줄인다는 근거도 충분하지 않습니다. 다만 뼈에
          부담이 가는 움직임이 조금 늘었다는 시험이 있습니다. 처음 신는다면 짧은 거리부터 늘려가세요. 통증이 지속되면 전문의와 상담하세요.
        </div>

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

        <References n={3}>
          <ul>
            <li>
              <strong>Hoogkamer et al. (2018)</strong> — 마라톤 레이싱화의 러닝 에너지 비용 비교.
              Sports Medicine 48(4):1009-1019.{" "}
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/29143929/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 underline"
              >
                PubMed →
              </a>
            </li>
            <li>
              <strong>Bolliger et al. (2026)</strong> — 1km 8분~5분 속도에서도 카본 대회화가 일반 신발보다 산소를 덜 씀. 차이는 속도와 관계없음.
              Sports Medicine - Open 12(1):12.{" "}
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/41703164/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 underline"
              >
                PubMed →
              </a>
            </li>
            <li>
              <strong>Bruneau et al. (2026)</strong> — 카본 대회화에서 뼈 피로 부상과 관련된 움직임 몇 가지가 조금 늘어남. 부상 수를 센 연구는 아님.
              PM&amp;R.{" "}
              <a
                href="https://doi.org/10.1002/pmrj.70153"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 underline"
              >
                DOI →
              </a>
            </li>
          </ul>
        </References>

        <div className="mt-10">
          <InlineAsk from="carbon-plate" tag="카본화" />
        </div>

        <div className="mt-10">
          <ShareButtons
            title="카본화, 초보가 느리게 뛰어도 효과 있나요?"
            description="1km 8분~5분으로 천천히 달려도 카본화가 힘이 덜 들었다는 시험이 있습니다. 처음이라면 어떻게 섞어 쓰면 좋은지, 지금 가격은 얼마인지 근거와 함께 봅니다."
            from="carbon-plate"
          />
        </div>

        <div className="mt-10">
          <FinderCta
            from="carbon-plate"
            headline="지금 수준에 맞는 신발부터 보시는 게 낫습니다"
            sub="발볼과 발 모양, 용도를 넣으면 4켤레를 골라 드려요."
          />
        </div>
      </article>
      </main>
    </>
  );
}
