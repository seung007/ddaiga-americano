import type { Metadata } from "next";
import Link from "next/link";
import { HOKA, BROOKS, dropOverlap, currentShoes, type BrandStats } from "@/lib/brands";
import type { Shoe } from "@/lib/shoes/types";
import FinderCta from "@/components/FinderCta";
import FaqSection, { type FaqItem } from "@/components/FaqSection";

/**
 * 호카 vs 브룩스 — 브랜드 단위 비교.
 *
 * 이 라우트가 정적이라 `app/compare/[slug]` 보다 **우선한다**(Next.js 라우팅 규칙:
 * 같은 깊이에서 정적 세그먼트가 동적 세그먼트를 이긴다). `[slug]` 는
 * `hoka-vs-brooks` 를 신발 id 두 개로 파싱하려다 실패할 뿐이므로 충돌은 없다.
 *
 * URL 을 `/compare/brand/...` 로 한 단계 넣지 않은 이유는 검색어가
 * `호카 브룩스 비교` 라서다 — URL 이 질문을 그대로 담는 편이 낫다.
 *
 * 숫자는 전부 `lib/brands.ts` 가 `SHOES` 에서 **계산한다.** 이 파일에 스펙 상수를
 * 적지 않는다 — 적으면 데이터가 바뀔 때 조용히 어긋난다.
 */

const TITLE = "호카 vs 브룩스 — 검증한 스펙으로 비교 | 뛰다가 아메리카노";
const DESC =
  "호카와 브룩스, 브랜드 인상이 아니라 실제 스펙으로 비교했어요. 드롭·스택·무게·발볼 옵션을 집계해서 어느 쪽이 내 조건에 맞는지 알려드려요.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  openGraph: { title: TITLE, description: DESC },
  alternates: { canonical: "/compare/hoka-vs-brooks" },
};

const n1 = (v: number) => v.toFixed(1);
const n0 = (v: number) => Math.round(v).toLocaleString();

const STABILITY_KO: Record<string, string> = {
  neutral: "중립",
  stability: "안정화",
  motion_control: "모션컨트롤",
};

function stabilityLine(s: BrandStats) {
  return (
    Object.entries(s.stability)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${STABILITY_KO[k] ?? k} ${v}`)
      .join(" · ") || "—"
  );
}

/** 두 값 중 어느 쪽을 굵게 볼지 — "좋다"가 아니라 "크다/작다"만 표시한다. */
type Row = {
  label: string;
  a: string;
  b: string;
  note: string;
};

const HOKA_SIDE = HOKA;
const BROOKS_SIDE = BROOKS;

const ROWS: Row[] = [
  {
    label: "힐드롭 평균",
    a: `${n1(HOKA_SIDE.dropAvg)}mm`,
    b: `${n1(BROOKS_SIDE.dropAvg)}mm`,
    note: `범위 ${HOKA_SIDE.dropMin}~${HOKA_SIDE.dropMax} / ${BROOKS_SIDE.dropMin}~${BROOKS_SIDE.dropMax}mm`,
  },
  {
    label: "스택 높이 평균",
    a: `${n1(HOKA_SIDE.stackAvg)}mm`,
    b: `${n1(BROOKS_SIDE.stackAvg)}mm`,
    note: "바닥에서 뒤꿈치까지의 두께",
  },
  {
    label: "무게 평균 (M9)",
    a: `${n1(HOKA_SIDE.weightAvg)}g`,
    b: `${n1(BROOKS_SIDE.weightAvg)}g`,
    note: `차이 ${n1(Math.abs(HOKA_SIDE.weightAvg - BROOKS_SIDE.weightAvg))}g`,
  },
  {
    label: "쿠션 등급 평균",
    a: `${n1(HOKA_SIDE.cushionAvg)} / 5`,
    b: `${n1(BROOKS_SIDE.cushionAvg)} / 5`,
    note: "이 사이트 자체 등급",
  },
  {
    label: "4E(초광폭) 제공",
    a: `${HOKA_SIDE.wide4E}개 모델`,
    b: `${BROOKS_SIDE.wide4E}개 모델`,
    note: `2E 이상은 ${HOKA_SIDE.wide2EPlus} / ${BROOKS_SIDE.wide2EPlus}개`,
  },
  {
    label: "안정성 분류",
    a: stabilityLine(HOKA_SIDE),
    b: stabilityLine(BROOKS_SIDE),
    note: "중립 · 안정화 · 모션컨트롤",
  },
  {
    label: "정가 평균",
    a: `${n0(HOKA_SIDE.priceAvg)}원`,
    b: `${n0(BROOKS_SIDE.priceAvg)}원`,
    note: "한국 권장소비자가",
  },
];

const OVERLAP = dropOverlap(HOKA, BROOKS);

const FAQ: FaqItem[] = [
  {
    q: "호카와 브룩스, 뭐가 가장 크게 다른가요?",
    a: OVERLAP
      ? `이 사이트가 검증한 모델 기준으로 힐드롭 평균이 호카 ${n1(HOKA.dropAvg)}mm, 브룩스 ${n1(BROOKS.dropAvg)}mm입니다. 다만 두 브랜드의 드롭 범위가 겹치므로 브랜드만으로 갈리지는 않고 모델을 봐야 합니다.`
      : `힐드롭입니다. 이 사이트가 검증한 모델 기준으로 호카는 ${HOKA.dropMin}~${HOKA.dropMax}mm, 브룩스는 ${BROOKS.dropMin}~${BROOKS.dropMax}mm이고 두 범위가 겹치지 않습니다. 드롭은 뒤꿈치와 앞발의 높이 차이로, 높으면 종아리·아킬레스 부담이 줄고 낮으면 발 앞쪽 부담이 늘어납니다.`,
  },
  {
    q: "아킬레스나 종아리가 자주 아픈데 어느 쪽이 나을까요?",
    a: `드롭이 높은 쪽이 종아리·아킬레스 부담이 적습니다. 이 사이트가 검증한 브룩스는 전부 ${BROOKS.dropMin}mm 이상이고 호카는 ${HOKA.dropMax}mm 이하입니다. 다만 이건 신발 선택이고 치료가 아닙니다 — 통증이 지속되면 전문의와 상담하세요.`,
  },
  {
    q: "발볼이 넓으면 어느 브랜드가 좋나요?",
    a: `폭 옵션 수로만 보면 4E(초광폭)를 제공하는 모델이 브룩스 ${BROOKS.wide4E}개, 호카 ${HOKA.wide4E}개입니다. 브랜드보다 개별 모델의 폭 옵션을 확인하는 게 정확합니다.`,
  },
  {
    q: "호카가 브룩스보다 좋은 브랜드인가요?",
    a: "그렇게 말할 수 있는 데이터가 없습니다. 이 페이지의 숫자는 어느 쪽이 우수한지가 아니라 어느 쪽이 어떤 조건에 맞는지를 가릅니다. 표본도 브랜드당 몇 개 수준이라 브랜드 전체를 대표하지 않습니다.",
  },
];

function ShoeList({ s }: { s: BrandStats }) {
  const cur = currentShoes(s);
  const old = s.shoes.filter((x) => x.successor);
  return (
    <div>
      <ul className="space-y-1.5">
        {cur.map((x) => (
          <ShoeRow key={x.id} x={x} />
        ))}
      </ul>
      {old.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs text-gray-500">
            후속 모델이 나온 {old.length}개도 보기
          </summary>
          <ul className="mt-2 space-y-1.5">
            {old.map((x) => (
              <ShoeRow key={x.id} x={x} old />
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function ShoeRow({ x, old = false }: { x: Shoe; old?: boolean }) {
  return (
    <li className="text-sm">
      <span className={old ? "text-gray-500" : "font-medium text-gray-900"}>{x.model}</span>
      <span className="ml-1.5 text-xs text-gray-500">
        드롭 {x.heelDropMm}mm · {x.weightGramsM9}g · 쿠션 {x.cushioning}
      </span>
      {old && x.successor && (
        <span className="ml-1.5 text-xs text-amber-700">후속 {x.successor}</span>
      )}
    </li>
  );
}

export default function HokaVsBrooks() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">호카 vs 브룩스</h1>
        <p className="mt-3 text-gray-600">
          브랜드 인상이 아니라 <strong>이 사이트가 검증한 스펙을 집계</strong>했습니다.
          호카 {HOKA.sampleSize}개, 브룩스 {BROOKS.sampleSize}개 기준입니다.
        </p>

        {/* 결론을 맨 위에 둔다. 스크롤해서 찾게 만들면 대부분 안 찾는다. */}
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">한 줄 결론</p>
          {OVERLAP ? (
            <p className="mt-2 text-emerald-900">
              두 브랜드의 드롭 범위가 <strong>겹칩니다</strong>. 브랜드로 고르는 것보다 모델 단위로
              보는 게 맞습니다.
            </p>
          ) : (
            <p className="mt-2 text-emerald-900">
              힐드롭 범위가 <strong>겹치지 않습니다</strong> — 호카 {HOKA.dropMin}~{HOKA.dropMax}mm,
              브룩스 {BROOKS.dropMin}~{BROOKS.dropMax}mm. 취향이 아니라{" "}
              <strong>조건으로 갈립니다.</strong> 종아리·아킬레스가 약하면 드롭이 높은 브룩스, 발
              앞쪽이 편한 쪽을 원하면 호카입니다.
            </p>
          )}
        </div>

        {/* ── 스펙 집계 표 ─────────────────────────────────── */}
        <h2 className="mt-10 text-2xl font-bold text-gray-900">스펙 집계</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">항목</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-900">호카</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-900">브룩스</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ROWS.map((r) => (
                <tr key={r.label}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{r.label}</div>
                    <div className="text-xs text-gray-500">{r.note}</div>
                  </td>
                  {/**
                   * whitespace-nowrap — 390px 에서 `234,167 원` 이 두 줄로 쪼개졌다.
                   * `globals.css` 의 `overflow-wrap: anywhere` 가 숫자 뒤 단위를 넘겨 버린다.
                   * 값 칸은 짧으니 줄바꿈을 아예 막는 편이 낫다.
                   */}
                  <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums text-gray-900">
                    {r.a}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums text-gray-900">
                    {r.b}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <FinderCta
          from="hoka-vs-brooks"
          variant="inline"
          headline="키·체중·발볼을 넣으면 두 브랜드를 섞어 조건에 맞는 3개를 골라드려요."
        />

        {/* ── 브랜드별 모델 ────────────────────────────────── */}
        <h2 className="mt-10 text-2xl font-bold text-gray-900">집계에 들어간 모델</h2>
        <p className="mt-2 text-sm text-gray-600">
          위 숫자는 이 목록에서 계산한 값입니다. 여성 전용 라스트는 같은 신발의 변형이라
          중복 계산을 피하려고 뺐습니다.
        </p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900">
              호카 <span className="text-sm font-normal text-gray-500">현행 {HOKA.currentCount}개</span>
            </h3>
            <div className="mt-3">
              <ShoeList s={HOKA} />
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900">
              브룩스{" "}
              <span className="text-sm font-normal text-gray-500">현행 {BROOKS.currentCount}개</span>
            </h3>
            <div className="mt-3">
              <ShoeList s={BROOKS} />
            </div>
          </div>
        </div>

        {/* ── 모델쌍 비교로 보내기 ─────────────────────────── */}
        <h2 className="mt-10 text-2xl font-bold text-gray-900">모델끼리 붙여보기</h2>
        <ul className="mt-4 space-y-2">
          {[
            { slug: "hoka-clifton-10-vs-brooks-ghost-17", label: "호카 클리프턴 10 vs 브룩스 고스트 17" },
            { slug: "brooks-ghost-17-vs-brooks-glycerin-22", label: "브룩스 고스트 17 vs 글리세린 22" },
            { slug: "hoka-clifton-10-vs-hoka-bondi-9", label: "호카 클리프턴 10 vs 본디 9" },
            {
              slug: "asics-gel-kayano-32-vs-brooks-adrenaline-gts-25",
              label: "아식스 카야노 32 vs 브룩스 아드레날린 25",
            },
          ].map((c) => (
            <li key={c.slug}>
              <Link
                href={`/compare/${c.slug}`}
                className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50"
              >
                <span className="text-gray-900">{c.label}</span>
                <span className="ml-2 shrink-0 text-xs font-semibold text-emerald-600">비교 →</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* ── 근거의 한계를 숨기지 않는다 ──────────────────── */}
        <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <p className="font-semibold">이 페이지가 말하지 않는 것</p>
          <ul className="mt-2 space-y-1.5">
            <li>
              · 표본이 호카 {HOKA.sampleSize}개, 브룩스 {BROOKS.sampleSize}개입니다.{" "}
              <strong>브랜드 전체를 대표하지 않습니다.</strong>
            </li>
            <li>
              · 드롭·쿠션이 특정 부상을 <strong>낫게 한다는 근거는 없습니다.</strong> 아킬레스·종아리
              부담과 드롭의 관계만 비교적 분명합니다.
            </li>
            <li>
              · 키에 맞는 드롭을 계산하는 이 사이트의 추천 로직은{" "}
              <strong>뒷받침하는 논문이 없는 자체 휴리스틱</strong>입니다. 참고용으로만 쓰세요.
            </li>
            <li>· 후속 모델이 나온 신발은 나쁜 신발이 아닙니다 — 보통 재고 할인이 붙습니다.</li>
          </ul>
        </div>

        <div className="mt-10">
          <FaqSection items={FAQ} />
        </div>

        <div className="mt-10">
          <FinderCta
            from="hoka-vs-brooks"
            headline="브랜드로 못 고르겠으면 조건으로 고르세요"
            sub="키·체중·발볼·부상 이력을 넣으면 두 브랜드를 섞어 3개를 골라드려요."
          />
        </div>
      </div>
    </main>
  );
}
