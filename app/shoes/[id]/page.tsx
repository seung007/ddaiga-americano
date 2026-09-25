import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AffiliateNotice from "@/components/AffiliateNotice";
import BuyLinkButtons from "@/components/BuyLinkButtons";
import ShoeJsonLd, { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import ShoeThumb from "@/components/ShoeThumb";
import FinderCta from "@/components/FinderCta";
import ShoeReactions from "@/components/ShoeReactions";
import { nicknamesOf } from "@/lib/shoes/aliases";
import { rungOf } from "@/lib/shoes/tiers";
import type { Shoe } from "@/lib/shoes/types";
import { COMPARE_SLUGS } from "@/lib/compares";
import { affiliateFor } from "@/lib/shoes/affiliate";
import { SHOES } from "@/lib/shoes/data";
import { cushionKo, hasWide, STABILITY_KO, USE_KO, verifiedAt, won } from "@/lib/shoes/labels";
import { BODY_TYPE_LABEL, GENDER_FIT_LABEL, KR_AVAILABILITY_LABEL, isRecommendable } from "@/lib/shoes/types";

/**
 * 러닝화 상세 (2026-09-16) — `lib/shoes/data.ts` 한 켤레 = 한 페이지.
 *
 * 러닝라이프 상세는 스펙표 + 태그 + 별점이다. 우리는 별점이 없고(데이터가 없다),
 * 대신 **누구에게 맞는지 · 근거 · 확인 날짜**를 낸다.
 */

export function generateStaticParams() {
  return SHOES.map((s) => ({ id: s.id }));
}
export const dynamicParams = false;

const PAGE = (id: string) => `https://ddaiga-americano.vercel.app/shoes/${id}`;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const s = SHOES.find((x) => x.id === id);
  if (!s) return {};
  return {
    title: `${s.brand} ${s.model} 스펙·가격 — 무게 ${s.weightGramsM9}g · 드롭 ${s.heelDropMm}mm | 뛰다가 아메리카노`,
    description: `${s.brand} ${s.model}: ${s.blurb}`.slice(0, 155),
    alternates: { canonical: `/shoes/${s.id}` },
  };
}

/**
 * 「처음 러닝화로?」 한 줄 (2026-09-26)
 *
 * 왜: 오픈채팅 전수 분석에서 초보가 카본화(프로4·알파3·줌플라이6)를 사고 나서야 "초보한테는 아니다"를
 * 듣고 되팔지 고민하는 일이 반복됐고, 카본 로드가 든 보스턴을 입문화로 착각한 질문도 있었음.
 *
 * 새 판단을 만들지 않는다 — **계급도와 같은 칸 규칙**(`lib/shoes/tiers.ts` 의 `rungOf`)을 쓰고
 * 칸 설명(`forWho`)을 그대로 옮긴다. 카본화 문장은 카본화 가이드 FAQ 와 같은 내용.
 *
 * ⚠️ 2026-09-26 첫 배포본은 여기서 따로 판정해서 슈퍼블라스트 3을 「대회용」이라고 적었다
 * (계급도에선 「오래 뛰는 날」). 기준을 한 곳으로 합쳐 고쳤다.
 */
function beginnerLine(s: Shoe): { tone: "warn" | "ok" | "info"; text: string } {
  const r = rungOf(s);
  if (s.hasCarbon)
    return {
      tone: "warn",
      text: "첫 러닝화로는 권하지 않아요. 카본 플레이트가 든 신발은 밑창이 단단하고 불안정한 편이고 값도 비싸요. 이 사이트 추천은 입문자에게 카본화 점수를 낮춥니다(위험하다고 단정할 근거는 부족해요).",
    };
  if (!r) return { tone: "info", text: "계급도 칸에 분류되지 않은 신발이에요." };
  const head = `계급도 「${r.label}」 칸이에요 — ${r.forWho}.`;
  if (r.id === "first" || r.id === "everyday")
    return { tone: "ok", text: `${head} 첫 러닝화 후보가 모인 칸이에요. 내 몸에 맞는지는 신발 찾기로 확인해 보세요.` };
  return { tone: "info", text: `${head} 처음이라면 앞 칸(첫 신발·매일 신는 날)과 같이 비교해 보세요.` };
}

/** 한국어 조사 — 받침 있으면 「이라고도」, 없으면 「라고도」. 숫자는 읽는 소리로 판정(4=사, 6=육 …) */
function rago(word: string): string {
  const last = word.at(-1) ?? "";
  if (/\d/.test(last)) return "013678".includes(last) ? "이라고도" : "라고도";
  const code = last.charCodeAt(0) - 0xac00;
  if (code >= 0 && code <= 11171) return code % 28 ? "이라고도" : "라고도";
  return "라고도";
}

const FOOT_KO = { flat: "평발", neutral: "중립 아치", high_arch: "높은 아치" } as const;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 px-4 py-2.5 text-sm">
      <dt className="w-24 shrink-0 font-medium text-gray-500">{label}</dt>
      <dd className="text-gray-800">{children}</dd>
    </div>
  );
}

export default async function ShoeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = SHOES.find((x) => x.id === id);
  if (!s) notFound();

  const name = `${s.brand} ${s.model}`;
  const checked = verifiedAt(s.id);
  const compares = COMPARE_SLUGS.filter((slug) => slug.split("-vs-").includes(s.id));
  const nameOf = (sid: string) => {
    const x = SHOES.find((y) => y.id === sid);
    return x ? `${x.brand} ${x.model}` : sid;
  };

  return (
    <>
      <BreadcrumbJsonLd trail={[["러닝화", "/shoes"], [name, `/shoes/${s.id}`]]} />
      <ShoeJsonLd shoes={[s]} name={name} url={PAGE(s.id)} />
      <article className="mx-auto max-w-2xl px-6 py-12 text-gray-800">
        <AffiliateNotice show={!!affiliateFor(s.id)} />
        <Link href="/shoes" className="mb-6 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝화 목록
        </Link>

        <header className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <ShoeThumb src={s.imageUrl} alt={name} model={s.model} className="aspect-square w-full max-w-[220px]" />
          <div>
            <p className="text-sm text-gray-500">{s.brand}</p>
            <h1 className="text-3xl font-bold leading-tight text-gray-900">{s.model}</h1>
            {nicknamesOf(s.model).length > 0 && (
              // 2026-09-26 — 러닝 오픈채팅에서 실제로 쓰인 애칭만 (lib/shoes/aliases.ts)
              <p className="mt-1 text-sm text-gray-500">
                러너들 사이에서는 {nicknamesOf(s.model).map((n) => `「${n}」`).join(" ")}
                {rago(nicknamesOf(s.model).at(-1) ?? "")} 불러요
              </p>
            )}
            <p className="mt-2 text-lg text-gray-800">약 {won(s.priceKrw)}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {s.uses.map((u) => (
                <span key={u} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {USE_KO[u]}
                </span>
              ))}
              {hasWide(s) && <span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">와이드 있음</span>}
              {s.hasCarbon && <span className="rounded bg-gray-900 px-2 py-0.5 text-xs text-white">카본 플레이트</span>}
            </div>
          </div>
        </header>

        {s.successor && (
          <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            후속 모델 <strong>{s.successor}</strong>이(가) 나왔습니다. 재고 할인으로 싸게 살 수 있지만, 사이즈가 빨리 빠집니다.
          </p>
        )}

        {(() => {
          const b = beginnerLine(s);
          const cls =
            b.tone === "warn"
              ? "border-red-200 bg-red-50 text-red-900"
              : b.tone === "ok"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-gray-200 bg-gray-50 text-gray-700";
          return (
            <div className={`mt-6 rounded-2xl border p-4 text-sm leading-relaxed ${cls}`}>
              <p className="mb-1 font-semibold">처음 러닝화로?</p>
              <p>{b.text}</p>
              <p className="mt-2 flex flex-wrap gap-x-3 text-xs">
                <Link href="/tier-list" className="underline">
                  러닝화 계급도에서 칸 보기
                </Link>
                {s.hasCarbon && (
                  <Link href="/injury/carbon-plate" className="underline">
                    카본화 근거 정리
                  </Link>
                )}
                <Link href="/shoe-finder" className="underline">
                  내 몸에 맞는 신발 찾기
                </Link>
              </p>
            </div>
          );
        })()}

        <p className="mt-6 text-lg leading-relaxed text-gray-700">{s.blurb}</p>

        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-gray-900">스펙</h2>
          <dl className="divide-y divide-gray-100 rounded-2xl border border-gray-200">
            <Row label="무게">{s.weightGramsM9}g (남성 US9){s.weightGramsW8 ? ` · ${s.weightGramsW8}g (여성 US8)` : ""}</Row>
            <Row label="힐 드롭">{s.heelDropMm}mm</Row>
            <Row label="스택 높이">{s.stackHeightMm}mm</Row>
            <Row label="쿠셔닝">
              {s.cushioning}/5 ({cushionKo(s.cushioning)})
            </Row>
            <Row label="안정성">{STABILITY_KO[s.stability]}</Row>
            <Row label="발볼 옵션">{s.widthOptions.join(" · ")}</Row>
            {s.genderFit && <Row label="라스트">{GENDER_FIT_LABEL[s.genderFit]}</Row>}
            <Row label="국내 구매">{KR_AVAILABILITY_LABEL[s.krAvailability]}</Row>
          </dl>
          <p className="mt-2 text-xs text-gray-400">
            {checked ? `${checked} 스펙 확인 · ` : ""}
            <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
              스펙 출처 ↗
            </a>
          </p>
        </section>

        {/**
          * 2026-09-21: 판단 필드가 비어 있을 수 있게 됐다(`lib/shoes/types.ts` 참고).
          * 비어 있으면 이 칸을 **빈칸으로 두지 않고 왜 없는지 적는다.**
          * 「발 모양: 」 뒤가 비어 있으면 고장으로 보이고, 아무 말도 없으면
          * 판단한 신발과 안 한 신발을 구분할 방법이 사라진다.
          */}
        {isRecommendable(s) ? (
          <section className="mt-8">
            <h2 className="mb-3 text-xl font-bold text-gray-900">이런 사람에게 맞춰 설계됐어요</h2>
            <ul className="space-y-1.5 pl-4 text-sm text-gray-700">
              <li>• 발 모양: {s.footTypes.map((f) => FOOT_KO[f]).join(" · ")}</li>
              <li>
                • 체중: {s.weightRangeKg[0]}–{s.weightRangeKg[1]}kg
              </li>
              <li>• 체형: {s.primaryBodyTypes.map((b) => BODY_TYPE_LABEL[b]).join(" / ")}</li>
              {s.genderNote && <li>• {s.genderNote}</li>}
            </ul>
            <p className="mt-2 text-xs text-gray-400">
              이 범위는 저희 추천 기준입니다. 브랜드가 정한 제한이 아닙니다.
            </p>
          </section>
        ) : (
          <section className="mt-8">
            <h2 className="mb-3 text-xl font-bold text-gray-900">누구에게 맞는지는 아직 판단하지 않았습니다</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              이 신발은 <strong>공개된 스펙(무게·드롭·스택·폭 옵션·가격)만 확인</strong>했습니다.
              어떤 발 모양이나 체형에 맞는지는 브랜드가 공개하지 않는 값이라 저희가 따로 판단해야 하는데,
              아직 하지 않았습니다.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              그래서 이 신발은 <strong>맞춤 추천 결과에 나오지 않습니다.</strong>{" "}
              지어내서 채우는 대신 비워 두는 쪽을 택했습니다.
            </p>
            {s.genderNote && <p className="mt-2 text-sm text-gray-700">• {s.genderNote}</p>}
          </section>
        )}

        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-gray-900">근거</h2>
          <p className="text-sm leading-relaxed text-gray-700">{s.scienceBasis}</p>
        </section>

        {compares.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-xl font-bold text-gray-900">비교해 보기</h2>
            <div className="flex flex-col gap-2 text-sm">
              {compares.map((slug) => {
                const other = slug.split("-vs-").find((x) => x !== s.id)!;
                return (
                  <Link key={slug} href={`/compare/${slug}`} className="text-emerald-600 hover:underline">
                    {name} vs {nameOf(other)} →
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-gray-900">구매</h2>
          <BuyLinkButtons shoeId={s.id} shoeName={name} links={s.buyLinks} from="shoe-detail" />
          <p className="mt-2 text-xs text-gray-400">가격은 국내 권장소비자가 기준 추산이고 판매처마다 다릅니다.</p>
        </section>

        {s.youtubeReviews.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-xl font-bold text-gray-900">리뷰 영상 찾기</h2>
            <div className="flex flex-wrap gap-2">
              {s.youtubeReviews.map((y) => (
                <a
                  key={y.label}
                  href={y.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700 hover:bg-red-100"
                >
                  ▶ {y.label}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 2026-09-23 — 신어본 사람 반응. 근거·경위는 components/ShoeReactions.tsx 주석 */}
        <ShoeReactions shoeId={s.id} shoeName={name} />

        <div className="mt-10">
          <FinderCta
            from="shoe-detail"
            headline="이 신발이 내 몸에 맞는지 확인해 보세요"
            sub={`키·체중·발 모양을 넣으면 ${SHOES.length}켤레를 내 조건 순서로 줄 세웁니다.`}
          />
        </div>
      </article>
    </>
  );
}
