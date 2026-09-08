import type { Metadata } from "next";
import Link from "next/link";
import { SHOES } from "@/lib/shoes/data";
import FinderCta from "@/components/FinderCta";
import InlineAsk from "@/components/InlineAsk";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ShareButtons from "@/components/ShareButtons";
import ArticleJsonLd from "@/components/ArticleJsonLd";

/**
 * 카본화 — 검색 수요 3위(카본화 관련 20%)에 답하는 페이지.
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 만들었나 (2026-09-08)
 *
 * 네이버 실측 검색 의도 상위 셋 중 둘은 이미 페이지가 생겼다
 * (브랜드 비교 73% → `/compare/hoka-vs-brooks`, 발 조건 33% → `/injury/flat-feet`).
 * 카본화 20% 만 남아 있었다. 블로그 글(`네이버블로그_카본화입문자.md`)은 있는데
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
 */

const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/carbon-plate";

export const metadata: Metadata = {
  title: "카본화 살까 말까 — 논문이 시험한 속도는 4:17/km부터입니다 | 뛰다가 아메리카노",
  description:
    "카본 플레이트 러닝화의 근거가 어디까지인지, 실제 가격이 얼마인지 정리했습니다. 가장 많이 인용되는 논문은 14km/h 이상에서만 측정했습니다.",
  alternates: { canonical: "/injury/carbon-plate" },
};

const CARBON = SHOES.filter((s) => s.hasCarbon && s.gender !== "female");
const CARBON_NOW = CARBON.filter((s) => !s.successor);
const NON_CARBON = SHOES.filter((s) => !s.hasCarbon && s.gender !== "female");

const won = (n: number) => n.toLocaleString() + "원";
const avg = (ns: number[]) => (ns.length ? ns.reduce((a, b) => a + b, 0) / ns.length : 0);

const NOW_MIN = Math.min(...CARBON_NOW.map((s) => s.priceKrw));
const NOW_MAX = Math.max(...CARBON_NOW.map((s) => s.priceKrw));
const CARBON_W = avg(CARBON_NOW.map((s) => s.weightGramsM9));
const NORMAL_W = avg(NON_CARBON.map((s) => s.weightGramsM9));

const FAQ: FaqItem[] = [
  {
    q: "카본화를 신으면 정말 빨라지나요?",
    a: "가장 많이 인용되는 연구(Hoogkamer 2018, Sports Medicine)는 시험한 신발이 대사 에너지 비용을 약 4% 낮췄다고 보고했습니다. 다만 4%는 기록이 4% 빨라진다는 뜻이 아니라 같은 속도로 달릴 때 드는 에너지가 적었다는 뜻입니다. 그리고 그 연구는 14·16·18km/h 세 속도에서만 측정했고, 카본 플레이트 단독 효과를 중창 폼과 분리하지 않았습니다.",
  },
  {
    q: "느리게 뛰어도 효과가 있나요?",
    a: "그 연구로는 알 수 없습니다. 가장 느린 시험 속도가 14km/h로 약 4:17/km인데, 그보다 느린 속도는 아예 측정하지 않았습니다. 효과가 없다는 뜻이 아니라 확인된 바가 없다는 뜻입니다. 인터넷에 도는 '몇 분 페이스 이하부터 효과' 같은 경계선은 대부분 그 논문에 없는 숫자입니다.",
  },
  {
    q: "입문자가 카본화를 신으면 위험한가요?",
    a: "'위험하다'고 단정할 근거도 부족합니다. 다만 카본화는 밑창이 단단하고 불안정한 편이라 발목·아킬레스에 부담이 갈 수 있고, 무엇보다 지금 시점에 국내 정가가 36만원대라 얻는 것에 비해 비용이 큽니다. 이 사이트의 추천 로직은 입문자 프로필에 카본화 점수를 낮춥니다.",
  },
  {
    q: "이 사이트는 카본화를 추천하나요?",
    a: `추천 로직에서 카본화는 입문자 프로필일 때 점수가 깎입니다. 다만 목표 기록이 있고 훈련량이 쌓인 경우에는 후보에 남습니다. 이 사이트가 스펙을 확인한 카본화는 ${CARBON.length}개이고 그중 후속이 안 나온 현행 모델은 ${CARBON_NOW.length}개입니다.`,
  },
];

export default function CarbonPlatePage() {
  return (
    <>
      <ArticleJsonLd
        headline="카본화 살까 말까 — 논문이 시험한 속도는 4:17/km부터"
        description="카본 플레이트 러닝화의 근거가 어디까지인지, 실제 가격이 얼마인지 정리했습니다."
        url={PAGE_URL}
        datePublished="2026-09-08"
      />
      <article className="mx-auto max-w-2xl px-6 py-12 text-gray-800">
        <Link href="/injury" className="mb-6 inline-block text-sm text-emerald-600 hover:underline">
          ← 부상 예방
        </Link>

        <h1 className="text-3xl font-bold leading-tight text-gray-900">카본화 살까 말까</h1>

        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">먼저 결론</p>
          <p className="mt-2 leading-relaxed text-emerald-900">
            가장 많이 인용되는 연구가 시험한 속도는{" "}
            <strong>14km/h — 약 4:17/km 부터</strong>입니다. 그보다 느린 속도는{" "}
            <strong>아예 측정하지 않았습니다.</strong>
          </p>
          <p className="mt-2 leading-relaxed text-emerald-900">
            그리고 지금 살 수 있는 현행 카본화는 <strong>{won(NOW_MIN)} ~ {won(NOW_MAX)}</strong>{" "}
            입니다. 효과가 확인되지 않은 구간에서 뛰는 사람에게는 비용이 큽니다.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-800">
            효과가 없다는 뜻이 아닙니다. <strong>확인된 바가 없다</strong>는 뜻입니다.
          </p>
        </div>

        {/* ── 논문이 말한 것 / 말하지 않은 것 ───────────────── */}
        <h2 className="mt-10 text-xl font-bold text-gray-900">논문이 말한 것과 말하지 않은 것</h2>
        <p className="mt-2 text-sm text-gray-600">
          Hoogkamer et al. (2018) Sports Medicine 48:1009-1019
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-bold text-emerald-900">말한 것</p>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-emerald-900">
              <li>· 시험한 신발이 <strong>대사 에너지 비용을 약 4% 낮췄다</strong></li>
              <li>· 측정 속도는 <strong>14 · 16 · 18 km/h</strong></li>
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-bold text-amber-900">말하지 않은 것</p>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-amber-900">
              <li>· <strong>4:17/km 보다 느린 속도</strong> — 시험 자체를 안 했다</li>
              <li>· <strong>기록이 4% 빨라진다</strong> — 에너지 비용이지 기록이 아니다</li>
              <li>· <strong>플레이트 덕분이다</strong> — 중창 폼과 분리하지 않았다</li>
              <li>· <strong>지금 파는 모델</strong> — 시험한 건 프로토타입과 구형 두 켤레다</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
          <strong className="text-gray-900">에너지 반환율 85% · 87% 같은 숫자는</strong> 브랜드가
          발표한 값이지 논문 수치가 아닙니다. 브랜드마다 측정 방법이 달라 서로 비교할 수도 없습니다.
        </div>

        {/* ── 4:17/km 이 어느 정도인가 ──────────────────────── */}
        <h2 className="mt-10 text-xl font-bold text-gray-900">4:17/km 이 어느 정도냐면</h2>
        <p className="mt-3 leading-relaxed text-gray-700">
          10km를 <strong>43분</strong>, 하프를 <strong>1시간 30분</strong>, 풀코스를{" "}
          <strong>3시간 1분</strong>에 완주하는 속도입니다.
        </p>
        <p className="mt-3 leading-relaxed text-gray-700">
          이보다 느리게 달린다면 그 연구의 결과가 나에게 적용된다고 말할 근거가 없습니다.
          다시 말하지만 <strong>효과가 없다는 게 아니라 확인이 안 됐다</strong>는 겁니다.
          그 구간에서 효과를 본 사람도 있을 수 있고, 그건 아직 데이터가 아닙니다.
        </p>

        <FinderCta
          from="carbon-plate"
          variant="inline"
          headline="지금 내 수준에 맞는 신발이 뭔지 모르겠다면 조건을 넣어보세요."
        />

        {/* ── 실제 가격 ────────────────────────────────────── */}
        <h2 className="mt-10 text-xl font-bold text-gray-900">
          이 사이트가 확인한 카본화 {CARBON.length}개
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          현행(후속 미출시) {CARBON_NOW.length}개는 <strong>{won(NOW_MIN)}부터</strong>입니다.
          평균 무게는 {CARBON_W.toFixed(0)}g 으로 일반 데일리화 {NORMAL_W.toFixed(0)}g 보다
          가볍습니다.
        </p>
        <ul className="mt-4 space-y-1.5">
          {CARBON_NOW.sort((a, b) => a.priceKrw - b.priceKrw).map((s) => (
            <li key={s.id} className="text-sm">
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
              후속 모델이 나온 {CARBON.length - CARBON_NOW.length}개도 보기 — 보통 재고 할인이 붙습니다
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
          <p className="font-bold text-gray-900">이 사이트의 추천 로직은 이렇게 다룹니다</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            입문자 프로필에서는 카본화 점수를 <strong>깎습니다.</strong> 근거가 확인된 속도
            구간 밖이고 가격이 높기 때문입니다. 목표 기록이 있고 훈련량이 쌓인 프로필에서는
            후보에 남습니다.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            이건 논문에서 도출한 규칙이 아니라 <strong>제가 정한 기준</strong>입니다. 그렇게
            표시해 두는 게 맞다고 봤습니다.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>부상 얘기:</strong> 카본화가 부상을 늘린다는 근거도, 줄인다는 근거도 충분하지
          않습니다. 다만 밑창이 단단하고 높아 발목이 불안정하게 느껴질 수 있으니, 처음 신는다면
          짧은 거리부터 늘려가세요. 통증이 지속되면 전문의와 상담하세요.
        </div>

        <div className="mt-10">
          <FaqSection items={FAQ} />
        </div>

        <h2 className="mt-10 text-xl font-bold text-gray-900">참고 문헌</h2>
        <ul className="mt-3 space-y-2 text-sm text-gray-700">
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
        </ul>

        <div className="mt-10">
          <InlineAsk from="carbon-plate" tag="카본화" />
        </div>

        <div className="mt-10">
          <ShareButtons
            title="카본화 살까 말까 — 논문이 시험한 속도는 4:17/km부터"
            description="카본 플레이트 러닝화의 근거가 어디까지인지 확인했습니다."
            from="carbon-plate"
          />
        </div>

        <div className="mt-10">
          <FinderCta
            from="carbon-plate"
            headline="지금 수준에 맞는 신발부터 보시는 게 낫습니다"
            sub="키·체중·발볼·부상 이력·목표를 넣으면 3개를 골라드려요."
          />
        </div>
      </article>
    </>
  );
}
