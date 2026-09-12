import type { Metadata } from "next";
import Link from "next/link";
import { SHOES } from "@/lib/shoes/data";
import FinderCta from "@/components/FinderCta";
import InlineAsk from "@/components/InlineAsk";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ShareButtons from "@/components/ShareButtons";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import ShoeJsonLd, { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";

/**
 * 평발 러닝화 — 검색 수요 2위(발 조건 + 브랜드, 33%)에 답하는 페이지.
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 이 각도인가 (2026-09-08)
 *
 * 검색하면 나오는 답은 거의 다 같다: **"평발이면 안정화화를 신어라."**
 * 그런데 이 저장소는 이미 그 관행에 근거가 없다는 논문을 알고 있다 —
 * `lib/shoes/recommend.ts` 2026-08-27 감사 기록:
 *
 *   Richards et al. (2009) Br J Sports Med — 발 타입으로 회내 제어화를
 *   처방하는 관행이 근거 기반이 아니라는 것이 논지이고, 8개 DB 를 뒤져
 *   지지 연구를 **한 건도** 찾지 못했다고 보고했다.
 *
 * 이 사이트는 그 논문을 오랫동안 **정반대 방향으로** 인용해 왔다(감사에서 걸러냄).
 * `/terms` 는 이미 올바른 요약을 싣고 있는데, 정작 평발을 검색해서 오는 사람이
 * 읽을 페이지가 없었다. **가장 많이 묻는 질문에 이 사이트의 결론이 없었다.**
 *
 * 그래서 이 페이지의 각도는 "평발용 신발 추천"이 아니라
 * **"평발이라는 이유만으로 신발을 정할 수 없다"** 다.
 * 남들과 다른 말을 하려고 고른 각도가 아니라, 이 저장소가 이미 확인해 둔 사실이다.
 *
 * ─────────────────────────────────────────────────────────────
 * 숫자는 계산한다. 그리고 **우리 데이터도 관행을 따르고 있다는 점을 숨기지 않는다.**
 *
 * `footTypes` 에 `flat` 이 들어간 신발 13개 중 11개가 안정화/모션컨트롤이다.
 * 즉 이 사이트의 데이터도 업계 분류를 그대로 받아 적은 것이다.
 * 그걸 감추고 "근거 없다"고만 쓰면 자기 데이터에 대한 고지를 빠뜨리는 셈이다.
 */

const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/flat-feet";

export const metadata: Metadata = {
  // 검색 질의는 "평발 러닝화", "평발 러닝화 추천", "평발 안정화" 형태로 온다.
  // 제목 앞쪽에 그 단어들을 두고, 뒤에 이 페이지만의 결론을 붙인다.
  title: "평발 러닝화, 안정화화가 정답일까 — 논문이 말하는 것 | 뛰다가 아메리카노",
  description:
    "평발이면 안정화화를 신으라는 말이 널리 퍼져 있지만, 발 타입으로 신발을 처방하는 관행에는 근거가 없다는 체계적 고찰이 있습니다. 무엇이 확인됐고 무엇이 안 됐는지 정리했습니다.",
  alternates: { canonical: "/injury/flat-feet" },
};

/** `flat` 을 지원하는 신발 — 여성 전용 라스트는 같은 신발의 변형이라 뺀다. */
const FLAT_SHOES = SHOES.filter(
  (s) => s.footTypes.includes("flat") && s.gender !== "female"
);
const FLAT_CURRENT = FLAT_SHOES.filter((s) => !s.successor);
const FLAT_STABILITY = FLAT_SHOES.filter((s) => s.stability !== "neutral").length;

const STABILITY_KO: Record<string, string> = {
  neutral: "중립",
  stability: "안정화",
  motion_control: "모션컨트롤",
};

const FAQ: FaqItem[] = [
  {
    q: "평발이면 안정화 러닝화를 신어야 하나요?",
    a: "반드시 그렇지는 않습니다. 발 타입에 맞춰 회내 제어 기능이 있는 신발을 처방하는 관행을 검토한 체계적 고찰(Richards 2009, Br J Sports Med)은 그 관행을 뒷받침하는 연구를 8개 데이터베이스에서 한 건도 찾지 못했다고 보고했습니다. 이후 무작위 대조시험의 2차 분석(Malisoux 2021, JOSPT)에서 모션컨트롤화가 과회내 관련 부상 위험을 낮추는 결과가 나왔지만, 2차 분석이라 근거 등급이 낮고 다른 부상에는 효과가 없었습니다. 정리하면 도움이 될 수는 있으나 '평발이니까 안정화화'라고 단정할 근거는 약합니다.",
  },
  {
    q: "그럼 평발은 무엇을 기준으로 골라야 하나요?",
    a: "발 타입보다 근거가 분명한 조건들이 있습니다. 체중에 맞는 쿠셔닝 경도(Malisoux 2020, 848명 무작위 대조시험), 발볼에 맞는 폭 규격, 그리고 지금 아픈 곳이 있다면 그 부위입니다. 무엇보다 신어보고 편한 신발이 낫습니다.",
  },
  {
    q: "안정화 러닝화를 신으면 해로운가요?",
    a: "그런 근거도 없습니다. 편하다면 계속 신어도 됩니다. 이 글의 요지는 안정화화가 나쁘다는 것이 아니라, 평발이라는 이유만으로 다른 선택지를 제외할 근거가 약하다는 것입니다.",
  },
  {
    q: "이 사이트는 평발에 안정화화를 추천하나요?",
    a: `추천 로직은 평발에 안정화 구조가 있으면 소폭 가점을 주지만, 그 가점에 "연구가 갈리는 사항"이라고 함께 표시합니다. 그리고 이 사이트가 평발 대응으로 분류한 신발 ${FLAT_SHOES.length}개 중 ${FLAT_STABILITY}개가 안정화 또는 모션컨트롤입니다 — 업계 분류를 그대로 받아 적은 결과이며, 그 자체가 근거는 아닙니다.`,
  },
];

export default function FlatFeetPage() {
  return (
    <>
      <ArticleJsonLd
        headline="평발 러닝화, 안정화화가 정답일까"
        description="평발이면 안정화화를 신으라는 관행에 근거가 있는지, 논문이 확인한 것과 확인하지 못한 것을 정리했습니다."
        url={PAGE_URL}
        datePublished="2026-09-08"
      />
      {/* 이 페이지에 목록으로 보이는 신발만. 화면과 구조화 데이터가 같아야 한다. */}
      <ShoeJsonLd
        shoes={FLAT_SHOES}
        name="평발 대응으로 분류한 러닝화"
        url={PAGE_URL}
      />
      <BreadcrumbJsonLd
        trail={[
          ["부상 예방", "/injury"],
          ["평발 러닝화", "/injury/flat-feet"],
        ]}
      />
      <article className="mx-auto max-w-2xl px-6 py-12 text-gray-800">
        <Link href="/injury" className="mb-6 inline-block text-sm text-emerald-600 hover:underline">
          ← 부상 예방
        </Link>

        <h1 className="text-3xl font-bold leading-tight text-gray-900">
          평발 러닝화, 안정화화가 정답일까
        </h1>

        {/* 결론을 맨 위에. 스크롤해서 찾게 만들면 대부분 안 찾는다. */}
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">먼저 결론</p>
          <p className="mt-2 leading-relaxed text-emerald-900">
            <strong>평발이라는 이유만으로 신발을 정할 수는 없습니다.</strong> 발 타입에 맞춰
            회내 제어 신발을 처방하는 관행을 검토한 체계적 고찰은, 그 관행을 뒷받침하는
            연구를 <strong>한 건도 찾지 못했다</strong>고 보고했습니다.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-800">
            안정화화가 해롭다는 뜻은 아닙니다. 편하면 신어도 됩니다. 다만 그것 때문에
            다른 선택지를 지울 필요는 없습니다.
          </p>
        </div>

        {/* 2026-09-12: 목차. 모바일에서 이 글이 7,700px 넘는다 — "그래서 뭘 신어?"만
            궁금한 사람이 그걸 찾아 내려가야 했다. 러닝위키는 긴 글마다 갖고 있다. */}
        <TableOfContents
          items={[
            { id: "evidence", label: "흔한 말과 실제 근거" },
            { id: "how-to-choose", label: "그럼 무엇으로 고르나" },
            { id: "shoe-list", label: `평발 대응으로 분류한 ${FLAT_SHOES.length}개` },
            { id: "refs", label: "참고 문헌" },
          ]}
        />

        <h2 id="evidence" className="mt-10 text-xl font-bold text-gray-900">
          널리 퍼진 말과 실제 근거
        </h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="w-28 bg-gray-50 px-4 py-3 align-top font-medium text-gray-700">
                  흔한 말
                </td>
                <td className="px-4 py-3 text-gray-800">
                  &ldquo;평발은 발이 안으로 무너지니까 안정화·모션컨트롤화로 잡아야 한다&rdquo;
                </td>
              </tr>
              <tr>
                <td className="w-28 bg-gray-50 px-4 py-3 align-top font-medium text-gray-700">
                  확인된 것
                </td>
                <td className="px-4 py-3 text-gray-800">
                  발 타입 기반 신발 처방이 <strong>근거 기반이 아니다</strong>. 8개 데이터베이스를
                  검색해 지지 연구를 찾지 못했다.
                  <span className="mt-1 block text-xs text-gray-500">
                    Richards, Magin &amp; Callister (2009) Br J Sports Med 43(3):159-162
                  </span>
                </td>
              </tr>
              <tr>
                <td className="w-28 bg-gray-50 px-4 py-3 align-top font-medium text-gray-700">
                  반대쪽 신호
                </td>
                <td className="px-4 py-3 text-gray-800">
                  모션컨트롤화가 <strong>과회내 관련</strong> 부상 위험을 낮췄다. 단
                  무작위 대조시험의 <strong>2차 분석</strong>이고, 다른 부상에는 효과가 없었다.
                  <span className="mt-1 block text-xs text-gray-500">
                    Malisoux et al. (2021) J Orthop Sports Phys Ther 51(3):135-143
                  </span>
                </td>
              </tr>
              <tr>
                <td className="w-28 bg-gray-50 px-4 py-3 align-top font-medium text-gray-700">
                  남는 결론
                </td>
                <td className="px-4 py-3 text-gray-800">
                  <strong>도움이 될 수는 있지만 단정할 근거는 약하다.</strong> 평발을 이유로
                  중립화를 배제할 근거는 더 약하다.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="how-to-choose" className="mt-10 text-xl font-bold text-gray-900">
          그럼 무엇으로 고르나
        </h2>
        <p className="mt-3 leading-relaxed text-gray-700">
          발 타입보다 근거가 분명한 조건이 있습니다.
        </p>
        <ol className="mt-4 space-y-3">
          <li className="rounded-xl border border-gray-200 p-4">
            <strong className="text-gray-900">1. 체중에 맞는 쿠셔닝</strong>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">
              848명 무작위 대조시험에서 쿠셔닝 경도와 체중의 조합이 부상 위험과 관련이 있었습니다.
              발 타입 연구보다 근거 등급이 높습니다.
              <span className="mt-1 block text-xs text-gray-500">
                Malisoux et al. (2020) Am J Sports Med
              </span>
            </p>
          </li>
          <li className="rounded-xl border border-gray-200 p-4">
            <strong className="text-gray-900">2. 발볼에 맞는 폭</strong>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">
              평발이면서 발볼이 넓은 경우가 흔합니다. 폭이 안 맞는 신발은 어떤 안정화 구조로도
              보정되지 않습니다.{" "}
              <Link href="/injury/wide-foot" className="font-medium text-emerald-600 hover:underline">
                2E·4E 와이드 규격 보기
              </Link>
            </p>
          </li>
          <li className="rounded-xl border border-gray-200 p-4">
            <strong className="text-gray-900">3. 지금 아픈 곳</strong>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">
              통증 이력이 있으면 그게 발 타입보다 우선입니다. 예를 들어 아킬레스·종아리
              이력에는 드롭이 높은 쪽이 부담이 적습니다.{" "}
              <Link href="/injury/achilles" className="font-medium text-emerald-600 hover:underline">
                아킬레스 통증 보기
              </Link>
            </p>
          </li>
          <li className="rounded-xl border border-gray-200 p-4">
            <strong className="text-gray-900">4. 신어봤을 때 편한지</strong>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">
              가장 저평가된 기준입니다. 매장에서 신어보고 불편한 신발이 &ldquo;평발용&rdquo;이라는
              이유로 맞을 가능성은 낮습니다.
            </p>
          </li>
        </ol>

        <FinderCta
          from="flat-feet"
          variant="inline"
          headline="체중·발볼·부상 이력을 넣으면 평발 여부만이 아니라 네 조건을 함께 계산합니다."
        />

        {/* ── 우리 데이터의 상태를 그대로 공개한다 ─────────── */}
        <h2 id="shoe-list" className="mt-10 text-xl font-bold text-gray-900">
          이 사이트가 평발 대응으로 분류한 {FLAT_SHOES.length}개
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          이 중 <strong>{FLAT_STABILITY}개가 안정화 또는 모션컨트롤</strong>입니다. 즉 이
          사이트의 데이터도 업계 분류를 그대로 받아 적은 것이고,{" "}
          <strong>그 자체가 근거는 아닙니다.</strong> 위 논문을 읽고 나서 이 목록을 보시는 게
          맞습니다.
        </p>
        <ul className="mt-4 space-y-1.5">
          {FLAT_CURRENT.map((s) => (
            <li key={s.id} className="text-sm">
              <span className="font-medium text-gray-900">
                {s.brand} {s.model}
              </span>
              <span className="ml-1.5 text-xs text-gray-500">
                {STABILITY_KO[s.stability]} · 드롭 {s.heelDropMm}mm · {s.widthOptions.join("/")}
              </span>
            </li>
          ))}
        </ul>
        {FLAT_SHOES.length > FLAT_CURRENT.length && (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-gray-500">
              후속 모델이 나온 {FLAT_SHOES.length - FLAT_CURRENT.length}개도 보기
            </summary>
            <ul className="mt-2 space-y-1.5">
              {FLAT_SHOES.filter((s) => s.successor).map((s) => (
                <li key={s.id} className="text-sm text-gray-500">
                  {s.brand} {s.model}
                  <span className="ml-1.5 text-xs">
                    {STABILITY_KO[s.stability]} · 드롭 {s.heelDropMm}mm · 후속 {s.successor}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        )}

        {/* ── 의료 면책 ────────────────────────────────────── */}
        <div className="mt-8 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>병원에 가야 할 신호:</strong> 발 안쪽 아치나 발바닥이 달리지 않을 때도
          아프거나, 한쪽만 갑자기 무너진 느낌이 들면 후경골근 기능장애 등 다른 원인일 수
          있습니다. 이 글은 신발 선택에 관한 정보이며 진단이나 치료가 아닙니다.
        </div>

        <div className="mt-10">
          <FaqSection items={FAQ} />
        </div>

        <h2 id="refs" className="mt-10 text-xl font-bold text-gray-900">
          참고 문헌
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-gray-700">
          <li>
            <strong>Richards, Magin &amp; Callister (2009)</strong> — 장거리 러닝화 처방이 근거
            기반인지 검토한 체계적 고찰. Br J Sports Med 43(3):159-162.{" "}
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/18424485/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 underline"
            >
              PubMed →
            </a>
          </li>
          <li>
            <strong>Malisoux et al. (2021)</strong> — 모션컨트롤화와 과회내 관련 부상, 무작위
            대조시험의 2차 분석. J Orthop Sports Phys Ther 51(3):135-143.{" "}
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/33306927/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 underline"
            >
              PubMed →
            </a>
          </li>
        </ul>

        <div className="mt-10">
          <InlineAsk from="flat-feet" tag="평발" />
        </div>

        <div className="mt-10">
          <ShareButtons
            title="평발 러닝화, 안정화화가 정답일까"
            description="발 타입으로 신발을 처방하는 관행에 근거가 있는지 논문으로 확인했습니다."
            from="flat-feet"
          />
        </div>

        <div className="mt-10">
          <FinderCta
            from="flat-feet"
            headline="평발 여부만으로 고르지 마세요"
            sub="체중·발볼·부상 이력·예산을 함께 계산해서 3개를 골라드려요."
          />
        </div>
      </article>
    </>
  );
}
