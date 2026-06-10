import type { Metadata } from "next";
import Link from "next/link";
import { SHOES } from "@/lib/shoes/data";
import { KR_AVAILABILITY_LABEL } from "@/lib/shoes/types";
import type { Shoe } from "@/lib/shoes/types";
import SiteHeader from "@/components/SiteHeader";
import ShoeImage from "@/components/ShoeImage";

// ── 슬러그 파싱 ────────────────────────────────────────────────
// URL: /compare/nb-fuelcell-rebel-v4-vs-hoka-clifton-10
// 슬러그를 "-vs-" 기준으로 분리해 두 신발 ID를 추출
function parseSlug(slug: string): [string, string] | null {
  const idx = slug.indexOf("-vs-");
  if (idx === -1) return null;
  return [slug.slice(0, idx), slug.slice(idx + 4)];
}

// ── generateMetadata: SEO 타이틀·설명 ──────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ids = parseSlug(slug);
  if (!ids) return { title: "신발 비교 — 뛰다가 아메리카노" };

  const a = SHOES.find((s) => s.id === ids[0]);
  const b = SHOES.find((s) => s.id === ids[1]);
  if (!a || !b) return { title: "신발 비교 — 뛰다가 아메리카노" };

  const title = `${a.brand} ${a.model} vs ${b.brand} ${b.model} 비교 — 뛰다가 아메리카노`;
  const description = `${a.brand} ${a.model}과 ${b.brand} ${b.model}을 힐드롭, 쿠션, 가격, 무게 등 핵심 스펙으로 비교했어요. 어떤 신발이 내 달리기에 맞는지 확인하세요.`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

// ── generateStaticParams: 실제 검색 수요가 있는 페어만 사전 렌더링 ──
export async function generateStaticParams() {
  const FEATURED_PAIRS = [
    "hoka-clifton-10-vs-brooks-ghost-17",
    "hoka-clifton-10-vs-nb-1080-v15",
    "brooks-ghost-17-vs-nb-1080-v15",
    "asics-gel-nimbus-27-vs-hoka-bondi-9",
    "asics-gt-2000-14-vs-brooks-adrenaline-gts-25",
    "asics-gt-2000-14-vs-saucony-guide-18",
    "brooks-adrenaline-gts-25-vs-nb-860-v15",
    "hoka-clifton-10-vs-asics-gt-2000-14",
    "nike-pegasus-42-vs-brooks-ghost-17",
    "nike-pegasus-42-vs-hoka-clifton-10",
    "nb-fuelcell-rebel-v4-vs-saucony-endorphin-speed-5",
    "adidas-adizero-adios-pro-4-vs-nike-vaporfly-4",
  ];

  return FEATURED_PAIRS.map((slug) => ({ slug }));
}

// 사전 렌더링 목록에 없는 URL도 허용 — 요청 시 서버에서 렌더링
export const dynamicParams = true;

// ── 스펙 비교 항목 정의 ─────────────────────────────────────────
type SpecRow = {
  label: string;
  explain: string;
  getValue: (s: Shoe) => string | number;
  unit?: string;
  lowerIsBetter?: boolean;
  higherIsBetter?: boolean;
};

const STABILITY_LABEL: Record<string, string> = {
  neutral: "중립",
  stability: "안정화",
  motion_control: "모션컨트롤",
};

const SPEC_ROWS: SpecRow[] = [
  {
    label: "가격",
    explain: "한국 기준 권장소비자가격",
    getValue: (s) => s.priceKrw.toLocaleString() + "원",
    lowerIsBetter: true,
  },
  {
    label: "무게 (M9)",
    explain: "남성 9사이즈 기준 한 짝 무게. 가벼울수록 빠른 반응",
    getValue: (s) => s.weightGramsM9,
    unit: "g",
    lowerIsBetter: true,
  },
  {
    label: "힐 드롭",
    explain: "뒤꿈치-앞볼 높이 차. 높을수록 힐스트라이커 친화, 낮을수록 미드풋 유도",
    getValue: (s) => s.heelDropMm,
    unit: "mm",
  },
  {
    label: "스택 높이",
    explain: "발바닥과 지면 사이 쿠션 두께. 높을수록 충격 흡수 좋음",
    getValue: (s) => s.stackHeightMm,
    unit: "mm",
    higherIsBetter: true,
  },
  {
    label: "쿠셔닝",
    explain: "1(미니멀) ~ 5(맥시멀). 체중이 많이 나갈수록 높은 숫자 권장",
    getValue: (s) => `${s.cushioning}/5`,
  },
  {
    label: "안정화 유형",
    explain: "중립=과회내 없음, 안정화=과회내(평발) 제어, 모션컨트롤=심한 과회내 제어",
    getValue: (s) => STABILITY_LABEL[s.stability],
  },
  {
    label: "발볼 옵션",
    explain: "D=보통, 2E=넓음, 4E=아주 넓음",
    getValue: (s) => s.widthOptions.join(" · "),
  },
  {
    label: "권장 체중",
    explain: "이 신발의 쿠션 밀도가 최적인 체중 범위",
    getValue: (s) => `${s.weightRangeKg[0]}~${s.weightRangeKg[1]}kg`,
  },
  {
    label: "용도",
    explain: "daily=매일 달리기, long=장거리, tempo=속도훈련, racing=레이싱",
    getValue: (s) => s.uses.join(" · "),
  },
  {
    label: "국내 구매",
    explain: "국내 공식판매=정품+AS 보장, 병행수입=가격 저렴하나 AS 제한",
    getValue: (s) => KR_AVAILABILITY_LABEL[s.krAvailability],
  },
];

// ── 수치 비교 헬퍼 ──────────────────────────────────────────────
function numericWinner(
  a: Shoe,
  b: Shoe,
  row: SpecRow
): "a" | "b" | "tie" | null {
  const va = row.getValue(a);
  const vb = row.getValue(b);
  if (typeof va !== "number" || typeof vb !== "number") return null;
  if (va === vb) return "tie";
  if (row.lowerIsBetter) return va < vb ? "a" : "b";
  if (row.higherIsBetter) return va > vb ? "a" : "b";
  return null;
}

// ── 메인 페이지 ─────────────────────────────────────────────────
export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ids = parseSlug(slug);

  if (!ids) {
    return (
      <NotFound message="올바른 비교 URL이 아니에요. /compare/신발A-vs-신발B 형식으로 접근해주세요." />
    );
  }

  const shoeA = SHOES.find((s) => s.id === ids[0]);
  const shoeB = SHOES.find((s) => s.id === ids[1]);

  if (!shoeA || !shoeB) {
    return <NotFound message="신발 데이터를 찾을 수 없어요. ID를 다시 확인해주세요." />;
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 py-12 text-gray-900">
        {/* ── 헤더 ── */}
        <header className="mb-8">
          <p className="text-xs font-medium text-emerald-600 mb-2 tracking-wide uppercase">
            러닝화 비교
          </p>
          <h1 className="text-2xl font-bold text-gray-900 leading-snug">
            {shoeA.brand} {shoeA.model}
            <span className="text-gray-400 mx-2">vs</span>
            {shoeB.brand} {shoeB.model}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            힐드롭·쿠션·무게·가격을 한눈에 비교했어요.
          </p>
        </header>

        {/* ── 이미지 + 한줄 요약 ── */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[shoeA, shoeB].map((shoe, idx) => (
            <div
              key={shoe.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col items-center text-center"
            >
              <ShoeImage
                src={shoe.imageUrl}
                alt={`${shoe.brand} ${shoe.model}`}
                model={shoe.model}
                side={idx === 0 ? "A" : "B"}
              />
              <p className="mt-3 text-xs font-semibold text-emerald-600">
                {shoe.brand}
              </p>
              <p className="font-bold text-gray-900 text-sm leading-tight">
                {shoe.model}
              </p>
              <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
                {shoe.blurb}
              </p>
              <p className="mt-3 text-base font-bold text-gray-900">
                {shoe.priceKrw.toLocaleString()}원
              </p>
            </div>
          ))}
        </div>

        {/* ── 스펙 비교 테이블 ── */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            스펙 비교
          </h2>
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 w-[30%]">
                    항목
                  </th>
                  <th className="text-center px-3 py-3 text-xs font-semibold text-gray-700 w-[35%]">
                    {shoeA.brand} {shoeA.model}
                  </th>
                  <th className="text-center px-3 py-3 text-xs font-semibold text-gray-700 w-[35%]">
                    {shoeB.brand} {shoeB.model}
                  </th>
                </tr>
              </thead>
              <tbody>
                {SPEC_ROWS.map((row, i) => {
                  const winner = numericWinner(shoeA, shoeB, row);
                  const va = row.getValue(shoeA);
                  const vb = row.getValue(shoeB);
                  const displayA =
                    typeof va === "number" ? `${va}${row.unit ?? ""}` : va;
                  const displayB =
                    typeof vb === "number" ? `${vb}${row.unit ?? ""}` : vb;

                  return (
                    <tr
                      key={row.label}
                      className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800 text-xs">
                          {row.label}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5 leading-relaxed hidden sm:block">
                          {row.explain}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`inline-block text-xs font-semibold px-2 py-1 rounded-lg ${
                            winner === "a"
                              ? "bg-emerald-100 text-emerald-700"
                              : "text-gray-700"
                          }`}
                        >
                          {displayA}
                          {winner === "a" && (
                            <span className="ml-1 text-emerald-500">✓</span>
                          )}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`inline-block text-xs font-semibold px-2 py-1 rounded-lg ${
                            winner === "b"
                              ? "bg-emerald-100 text-emerald-700"
                              : "text-gray-700"
                          }`}
                        >
                          {displayB}
                          {winner === "b" && (
                            <span className="ml-1 text-emerald-500">✓</span>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            ✓ 표시는 해당 항목에서 수치상 유리한 신발을 나타내요. 달리기 목적에 따라 맞는 신발은 달라질 수 있어요.
          </p>
        </section>

        {/* ── 어떤 체형에게 맞나? ── */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            어떤 체형에 최적인가?
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[shoeA, shoeB].map((shoe) => (
              <div
                key={shoe.id}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                <p className="text-xs font-bold text-gray-800 mb-2">
                  {shoe.brand} {shoe.model}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {shoe.blurb}
                </p>
                <div className="mt-3 space-y-1">
                  {shoe.footTypes.map((ft) => (
                    <span
                      key={ft}
                      className="inline-block text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full mr-1"
                    >
                      {ft === "flat"
                        ? "평발"
                        : ft === "neutral"
                          ? "중립 아치"
                          : "높은 아치"}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                  {shoe.scienceBasis}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 구매 링크 ── */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            구매하기
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[shoeA, shoeB].map((shoe) => (
              <div key={shoe.id} className="space-y-2">
                <p className="text-xs font-bold text-gray-700">
                  {shoe.brand} {shoe.model}
                </p>
                {shoe.buyLinks.slice(0, 2).map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                      link.isOfficial
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-gray-700 hover:bg-gray-800 text-white"
                    }`}
                  >
                    {link.isOfficial ? "🏪" : "🛒"} {link.label} ↗
                  </a>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center">
          <p className="text-xs font-medium text-emerald-600 mb-1">
            어떤 신발이 내 체형에 맞는지 모르겠다면?
          </p>
          <h3 className="text-base font-bold text-gray-900 mb-2">
            키·체중·발 타입만 입력하면 1분 안에 알려드려요
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            수십 개 데이터베이스에서 내 체형에 맞는 신발만 골라줘요.
          </p>
          <Link
            href="/shoe-finder"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            내 발에 맞는 러닝화 찾기 →
          </Link>
        </section>

        {/* ── 다른 비교 보기 ── */}
        <OtherCompares currentA={shoeA} currentB={shoeB} />
      </main>
    </>
  );
}

// ── 다른 비교 추천 ──────────────────────────────────────────────
function OtherCompares({ currentA, currentB }: { currentA: Shoe; currentB: Shoe }) {
  const others = SHOES.filter(
    (s) => s.id !== currentA.id && s.id !== currentB.id
  ).slice(0, 4);

  const pairs: [Shoe, Shoe][] = [];
  for (let i = 0; i + 1 < others.length; i += 2) {
    pairs.push([others[i], others[i + 1]]);
  }

  if (pairs.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
        다른 비교 보기
      </h2>
      <div className="flex flex-col gap-2">
        {pairs.map(([a, b]) => (
          <Link
            key={`${a.id}-${b.id}`}
            href={`/compare/${a.id}-vs-${b.id}`}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-800">
              {a.brand} {a.model}
              <span className="text-gray-400 mx-2">vs</span>
              {b.brand} {b.model}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">비교하기 →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── 404 폴백 ────────────────────────────────────────────────────
function NotFound({ message }: { message: string }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 py-24 text-center text-gray-900">
        <p className="text-lg font-semibold mb-2">신발을 찾을 수 없어요</p>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <Link
          href="/shoe-finder"
          className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-emerald-700 transition-colors"
        >
          내 발에 맞는 신발 찾기 →
        </Link>
      </main>
    </>
  );
}
