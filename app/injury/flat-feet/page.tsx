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
import { Up, S } from "@/components/guide/Up";
import { Lead, P, H2, Summary, Todo, Evidence, References, Basis, Warn, Note } from "@/components/guide/Read";
import { pageUrl } from "@/lib/site";

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
 *
 * ─────────────────────────────────────────────────────────────
 * 2026-10-13 가독성 재설계 — 섹션마다 답 → 할 일 → 근거(접힘). start-running 본보기를 따름.
 *   · 핵심 결론(발 타입 처방은 근거가 약하다)과 「연구끼리 엇갈림」 단서는 본문(<Summary>·<P>·<Note>)에 둔다
 *   · 「흔한 말 / 확인된 것 / 반대쪽 신호 / 남는 결론」 표는 접지 않고 그대로 둔다(숫자·출처 포함)
 *   · 딱딱함 연구의 「가벼운 러너에서만」 단서는 <Note> 로 본문에
 *   · 병원 신호 → <Warn>. 참고 문헌은 맨 끝 기본 접힘
 */

const PAGE_URL = pageUrl("/injury/flat-feet");

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
  // 2026-09-21: footTypes 가 선택 필드가 됐다. 비어 있으면 「평발에 맞는다」고 판단한 적이
  // 없는 신발이므로 이 글의 개수 집계에서 빠진다 — 본문 숫자가 판단한 것만 세게 한다.
  (s) => s.footTypes?.includes("flat") && s.gender !== "female"
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
    a: "반드시 그렇지는 않습니다. 2009년 체계적 고찰(Richards 2009, Br J Sports Med)은 발 타입에 맞춘 신발 처방을 뒷받침하는 연구를 찾지 못했습니다. 그 뒤 나온 무작위 대조시험(Malisoux 2016, Br J Sports Med, 372명)에서는 모션컨트롤화를 받은 쪽의 부상 위험이 낮았고, 그 효과는 발이 안쪽으로 쏠리는(회내) 러너에서만 나타났습니다. 같은 시험의 2차 분석(Willems 2021)도 과회내 관련 부상이 줄었다고 보고했습니다. 다만 회내는 측정 도구로 판정했고 연구가 1건이라, 스스로 평발이라고 느끼는 것만으로 '안정화화가 정답'이라고 하기엔 이릅니다.",
  },
  {
    q: "그럼 평발은 무엇을 기준으로 골라야 하나요?",
    a: "발볼에 맞는 폭 규격, 너무 딱딱하지 않은 신발(848명 무작위 대조시험에서 딱딱한 신발이 부상 위험이 높았음, Malisoux 2020), 그리고 지금 아픈 곳이 있다면 그 부위입니다. 무엇보다 신어보고 편한 신발이 낫습니다.",
  },
  {
    q: "안정화 러닝화를 신으면 해로운가요?",
    a: "그런 근거도 없습니다. 편하다면 계속 신어도 됩니다. 이 글의 요지는 안정화화가 나쁘다는 것이 아니라, 평발이라는 이유만으로 다른 선택지를 제외할 근거가 약하다는 것입니다.",
  },
  {
    q: "저희는 평발에 안정화화를 추천하나요?",
    // 2026-10-06: 「소폭 가점」이라고 적었는데 실제는 평발 분류 +12, 안정화 +3, 중립화 −2 였다(측정).
    a: `네, 기울어 있습니다. 평발을 고르면 저희가 평발로 분류한 신발에 +12, 안정화 구조에 +3, 중립화에 −2를 줍니다. 다만 근거가 약한 만큼 추천 3개 중 1개는 항상 중립 신발로 채웁니다. 평발로 분류한 신발 ${FLAT_SHOES.length}개 중 ${FLAT_STABILITY}개가 안정화 또는 모션컨트롤입니다. 근거는 회내 발에서 모션컨트롤화가 부상 위험을 낮춘 무작위 대조시험 1건(Malisoux 2016)과 그 2차 분석(Willems 2021)이고, 스스로 고른 '평발'과 연구의 측정 기준은 같지 않다는 점을 추천 결과에도 함께 적습니다.`,
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
          ["러닝 가이드", "/injury"],
          ["평발 러닝화", "/injury/flat-feet"],
        ]}
      />
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        {/* 태그·읽기 시간은 허브 카드(lib/guide/articles.ts)의 값 그대로 */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">평발</span>
          <span className="text-xs text-gray-400">4분 읽기</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">
          평발 러닝화, 안정화화가 정답일까
        </h1>
        <Lead>
          &ldquo;평발이면 안정화화&rdquo;라는 말이 널리 퍼져 있습니다. 논문이 확인한 것과 확인하지 못한 것을 나눠 정리했습니다.
        </Lead>

        {/* 결론을 맨 위에. 스크롤해서 찾게 만들면 대부분 안 찾는다. */}
        <Summary
          items={[
            <>
              <strong>평발이라는 이유만으로 신발을 정할 수는 없습니다.</strong> 2009년에 기존 연구를 모아 검토한 논문은 발 타입
              맞춤 처방을 뒷받침하는 연구를 <strong>한 건도 찾지 못했습니다.</strong>
              <Basis kind="paper" />
            </>,
            <>
              그 뒤 나온 무작위 시험 1건에서는 발이 안쪽으로 쏠리는(회내) 러너에게 모션컨트롤화가 <strong>도움이 됐습니다.</strong>
              <Basis kind="paper" />
            </>,
            <>
              안정화화가 해롭다는 뜻은 아닙니다. 편하면 신어도 됩니다. 다만 그것 때문에 다른 선택지를 지울 필요는 없습니다.
              <Basis kind="rule" />
            </>,
            <>
              고를 때는 <strong>딱딱하지 않은지, 발볼, 지금 아픈 곳, 신어 봐서 편한지</strong>를 봅니다.
              <Basis kind="rule" />
            </>,
          ]}
        />
        <Note>
          연구끼리 엇갈립니다. 도움이 됐다는 연구는 1건이고, 스스로 평발이라고 느끼는 것과 연구의 측정 기준은 다릅니다.
        </Note>

        {/* 2026-09-12: 목차. 모바일에서 이 글이 7,700px 넘는다 — "그래서 뭘 신어?"만
            궁금한 사람이 그걸 찾아 내려가야 했다. 러닝위키는 긴 글마다 갖고 있다. */}
        <TableOfContents
          items={[
            { id: "evidence", label: "안정화화를 신어야 하나" },
            { id: "how-to-choose", label: "무엇으로 고르나" },
            { id: "shoe-list", label: `저희가 분류한 ${FLAT_SHOES.length}개` },
          ]}
        />

        {/* ── ① ─────────────────────────────────────────── */}
        <h2 id="evidence" className={H2}>
          평발이면 안정화화를 신어야 하나요?
        </h2>
        <P>
          <strong>반드시 그렇지는 않습니다.</strong> 발 타입에 맞춰 회내 제어 신발을 처방하는 관행은 근거가 약합니다.
        </P>
        <P>
          다만 <strong>연구끼리 엇갈립니다.</strong> 처방 관행을 뒷받침하는 연구를 찾지 못했다는 검토가 있고, 회내 러너에게는
          모션컨트롤화가 도움이 됐다는 시험이 1건 있습니다. 아래 표에 나눠 적었습니다.
        </P>
        <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full text-[15px]">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="w-28 break-keep bg-gray-50 px-4 py-3 align-top font-medium text-gray-700">
                  흔한 말
                </td>
                <td className="break-keep px-4 py-3 text-gray-800">
                  &ldquo;평발은 발이 안으로 무너지니까 안정화·모션컨트롤화로 잡아야 한다&rdquo;
                </td>
              </tr>
              <tr>
                <td className="w-28 break-keep bg-gray-50 px-4 py-3 align-top font-medium text-gray-700">
                  확인된 것
                </td>
                <td className="break-keep px-4 py-3 text-gray-800">
                  발 타입 기반 신발 처방이 <strong>근거 기반이 아니다</strong>. 8개 데이터베이스를
                  검색해 지지 연구를 찾지 못했다(2009년 기준).
                  <span className="mt-1 block text-xs text-gray-500">
                    Richards, Magin &amp; Callister (2009) Br J Sports Med 43(3):159-162
                  </span>
                </td>
              </tr>
              <tr>
                <td className="w-28 break-keep bg-gray-50 px-4 py-3 align-top font-medium text-gray-700">
                  반대쪽 신호
                </td>
                <td className="break-keep px-4 py-3 text-gray-800">
                  {/* 2026-10-06: 1차 RCT(Malisoux 2016)가 이 페이지에 없었다 — 2차 분석만 있었다.
                      PubMed 초록(PMID 26746907) 직접 확인. */}
                  372명 무작위 대조시험에서 모션컨트롤화를 받은 쪽의 부상 위험이 낮았고(HR 0.55),
                  그 효과는 <strong>발이 안쪽으로 쏠리는(회내) 러너</strong>에서만 나타났다(HR 0.34).
                  같은 시험의 2차 분석도 과회내 관련 부상이 줄었다고 보고했다. 회내는 측정 도구(Foot
                  Posture Index)로 판정했다.
                  <span className="mt-1 block text-xs text-gray-500">
                    Malisoux et al. (2016) Br J Sports Med 50(8):481-487 · Willems, Ley, Goetghebeur, Theisen, Malisoux (2021) J Orthop Sports Phys Ther 51(3):135-143
                  </span>
                </td>
              </tr>
              <tr>
                <td className="w-28 break-keep bg-gray-50 px-4 py-3 align-top font-medium text-gray-700">
                  남는 결론
                </td>
                <td className="break-keep px-4 py-3 text-gray-800">
                  <strong>회내 발에는 도움이 될 수 있다 — 다만 연구 1건이다.</strong> 스스로 느끼는
                  평발이 연구의 회내 발과 같은지는 모르고, 평발을 이유로 중립화를 배제할 근거는 더 약하다.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── ② ─────────────────────────────────────────── */}
        <h2 id="how-to-choose" className={H2}>
          그럼 뭘 보고 고르나요?
        </h2>
        <P>발 타입보다 먼저 볼 조건이 있습니다. 딱딱함은 연구가 있고, 나머지는 저희 제안입니다.</P>
        <Todo
          title="이 순서로 보세요"
          items={[
            <>
              <strong>너무 딱딱하지 않은 신발</strong>
              <Basis kind="paper" />
            </>,
            <>
              <strong>발볼에 맞는 폭</strong> — 평발이면서 발볼이 넓은 경우가 흔합니다. 폭이 안 맞는 신발은 어떤 안정화 구조로도
              보정되지 않습니다.{" "}
              <Link href="/injury/wide-foot" className="font-medium text-emerald-600 hover:underline">
                2E·4E 와이드 규격 보기
              </Link>
              <Basis kind="rule" />
            </>,
            <>
              {/* 2026-09-14: "드롭이 높은 쪽이 부담이 적습니다" 에 인용이 없었다.
                  같은 주장이 achilles 페이지에도 있었고 거기서도 근거를 못 찾았다. 방향만 남긴다. */}
              <strong>지금 아픈 곳</strong> — 통증 이력이 있으면 그게 발 타입보다 우선입니다. 아킬레스·종아리 이력이 있다면 드롭이
              지금보다 낮은 신발로 갑자기 바꾸지 않는 편이 낫습니다.{" "}
              <Link href="/injury/achilles" className="font-medium text-emerald-600 hover:underline">
                아킬레스 통증 보기
              </Link>
              <Basis kind="rule" />
            </>,
            <>
              <strong>신어봤을 때 편한지</strong> — 가장 저평가된 기준입니다. 매장에서 신어보고 불편한 신발이 &ldquo;평발용&rdquo;이라는
              이유로 맞을 가능성은 낮습니다.
              <Basis kind="rule" />
            </>,
          ]}
        />
        {/* 2026-10-06: 「체중에 맞는 쿠셔닝 — 근거 등급이 높다」였다. 논문 결론은 보호 효과가
            가벼운 러너에서만 나왔다는 것이고, 「무거우면 쿠션을 더」는 저자가 시험해 지지하지 않은 통념이다. */}
        <Note>딱딱함 연구의 보호 효과는 가벼운 러너에서 뚜렷했고, 무거운 러너에서는 확인되지 않았습니다.</Note>
        <Evidence n={1}>
          <p>
            848명 무작위 대조시험에서 딱딱한 신발을 신은 쪽의 부상 위험이 높았습니다. 보호 효과는 가벼운 러너에서 뚜렷했고 무거운
            러너에서는 확인되지 않았습니다 — 「체중이 무거우면 쿠션을 더」라는 통념은 이 연구에서 지지되지 않았습니다.{" "}
            <S>(Malisoux et al. (2020) <Up h="https://pubmed.ncbi.nlm.nih.gov/31877062/" />)</S>
          </p>
        </Evidence>

        <FinderCta
          from="flat-feet"
          variant="inline"
          headline="발볼·부상 이력·용도를 넣으면 평발 여부만이 아니라 여러 조건을 함께 계산합니다."
        />

        {/* ── 우리 데이터의 상태를 그대로 공개한다 ─────────── */}
        <h2 id="shoe-list" className={H2}>
          저희가 평발 대응으로 분류한 {FLAT_SHOES.length}개
        </h2>
        <P>
          이 중 <strong>{FLAT_STABILITY}개가 안정화 또는 모션컨트롤</strong>입니다. 저희 데이터도 업계 분류를 그대로 받아 적은
          것이고, <strong>그 자체가 근거는 아닙니다.</strong> 위 내용을 읽고 나서 이 목록을 보시는 게 맞습니다.
        </P>
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
        <Warn title="병원에 가야 할 신호">
          발 안쪽 아치나 발바닥이 달리지 않을 때도 아프거나, 한쪽만 갑자기 무너진 느낌이 들면 후경골근 기능장애 등 다른 원인일 수
          있습니다. 이 글은 신발 선택에 관한 정보이며 진단이나 치료가 아닙니다.
        </Warn>

        <div className="mt-14">
          <FaqSection items={FAQ} />
        </div>

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
            sub="발볼·부상 이력·예산을 함께 계산해서 3개를 골라드려요."
          />
        </div>

        <References n={5}>
          <ul>
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
              <strong>Malisoux et al. (2016)</strong> — 일반 러닝화 대 모션컨트롤화 무작위 대조시험(372명, 6개월).
              전체 부상 위험 HR 0.55, 회내 발에서 HR 0.34. Br J Sports Med 50(8):481-487.{" "}
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/26746907/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 underline"
              >
                PubMed →
              </a>
            </li>
            <li>
              <strong>Malisoux et al. (2020)</strong> — 쿠셔닝 경도 무작위 대조시험(848명). 딱딱한 신발에서 부상 위험이
              높았고(SHR 1.52), 보호 효과는 가벼운 러너에서만 유의했다. Am J Sports Med 48(2):473-480.{" "}
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/31877062/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 underline"
              >
                PubMed →
              </a>
            </li>
            <li>
              {/* 2026-09-14 서지 정정: 제1저자가 Malisoux 가 아니라 **Willems TM** 이다.
                  (Willems TM, Ley C, Goetghebeur E, Theisen D, Malisoux L.)
                  권호·쪽·내용은 초록과 일치한다. AGENTS.md 의 "Beyer → 실제 Kim" 과 같은 형태였다. */}
              <strong>Willems et al. (2021)</strong> — 모션컨트롤화와 과회내 관련 부상, 무작위
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
            {/**
             * 2026-09-15 추가 — **한국어 전문의가 같은 말을 한다.**
             *
             * 이 페이지는 Richards 2009(영문)만으로 "발 타입 맞춤은 근거가 약하다"를 주장해 왔다.
             * 국내 정형외과 전문의가 같은 결론을 말하고, JOSPT 2014 군 기초훈련 연구까지
             * 짚는다는 것은 **이 입장이 국내 임상에서도 통용된다**는 뜻이다.
             */}
            <li>
              <strong>안지용 (서울부민병원 정형외과 실장)</strong> — 발 모양에 맞춘 러닝화를
              신어야 부상을 막는다는 근거는 아직 충분하지 않다. 군 기초훈련 연구(아치 유형별
              맞춤 지급 vs 동일 안정화 지급)에서 부상률 차이가 없었다는 점을 함께 든다.{" "}
              <a
                href="https://www.hnews.kr/news/view.php?no=68992"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 underline"
              >
                현대건강신문 →
              </a>
            </li>
          </ul>
        </References>
      </article>
    </>
  );
}
