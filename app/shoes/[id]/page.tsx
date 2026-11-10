import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AffiliateNotice from "@/components/AffiliateNotice";
import BuyLinkButtons from "@/components/BuyLinkButtons";
import { photoOf } from "@/lib/shoes/photos";
import ShoeJsonLd, { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import ShoeThumb from "@/components/ShoeThumb";
import FinderCta from "@/components/FinderCta";
import FaqSection from "@/components/FaqSection";
import ShoeGuideLinks from "@/components/ShoeGuideLinks";
import { shoeFaq } from "@/lib/faq";
import ShoeReactions from "@/components/ShoeReactions";
import ShoeReviews from "@/components/ShoeReviews";
import LikeButton from "@/components/LikeButton";
import { nicknamesOf } from "@/lib/shoes/aliases";
import { rungOf } from "@/lib/shoes/tiers";
import { predecessorOf, successorOf } from "@/lib/shoes/lineage";
import { officialOf } from "@/lib/shoes/official";
import type { Shoe } from "@/lib/shoes/types";
import { COMPARE_SLUGS } from "@/lib/compares";
import { affiliateFor } from "@/lib/shoes/affiliate";
import { SHOES } from "@/lib/shoes/data";
import { cushionKo, hasWide, STABILITY_KO, USE_KO, verifiedAt, won } from "@/lib/shoes/labels";
import { GENDER_FIT_LABEL, KR_AVAILABILITY_LABEL, withFootTypes } from "@/lib/shoes/types";
import { pageUrl } from "@/lib/site";

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

const PAGE = (id: string) => pageUrl(`/shoes/${id}`);

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
      <dd className="min-w-0 flex-1 text-gray-800">{children}</dd>
    </div>
  );
}

/**
 * 스펙 옆 「전체 N켤레 중 어디쯤」 (2026-10-13, 벤치마킹: RunRepeat 는 측정값마다 평균·최소~최대를 같이 보여준다)
 *
 * 「38mm」만 보면 두꺼운지 얇은지 모른다. 같은 원장(lib/shoes/data.ts) 전체와 견준 위치만 보여주고
 * **좋다·나쁘다는 붙이지 않는다** — 두께·드롭·무게와 부상의 관계를 이 사이트는 확인하지 못했다(ShoeSideProfile 머리말과 같은 원칙).
 * 무게는 남성 US9 끼리만 비교한다(여성 US8 값과 섞지 않는다).
 */
function Position({ value, all, unit, low, high }: { value: number; all: number[]; unit: string; low: string; high: string }) {
  const xs = all.filter((v) => Number.isFinite(v) && v > 0);
  if (xs.length < 10) return null;
  const min = Math.min(...xs);
  const max = Math.max(...xs);
  const below = xs.filter((v) => v < value).length;
  const pct = Math.round((below / xs.length) * 100);
  const pos = max === min ? 50 : ((value - min) / (max - min)) * 100;
  const where = pct <= 33 ? `${low} 편` : pct >= 67 ? `${high} 편` : "중간쯤";
  return (
    <span className="mt-1 block">
      <span className="relative block h-1.5 rounded-full bg-gray-100" aria-hidden>
        <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-emerald-600" style={{ left: `${pos}%` }} />
      </span>
      <span className="mt-1 block text-xs text-gray-500">
        {xs.length}켤레 중 {where} · 범위 {min}~{max}
        {unit}
      </span>
    </span>
  );
}

export default async function ShoeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = SHOES.find((x) => x.id === id);
  if (!s) notFound();

  const name = `${s.brand} ${s.model}`;
  const checked = verifiedAt(s.id);
  const official = officialOf(s.id);
  const compares = COMPARE_SLUGS.filter((slug) => slug.split("-vs-").includes(s.id));
  const nameOf = (sid: string) => {
    const x = SHOES.find((y) => y.id === sid);
    return x ? `${x.brand} ${x.model}` : sid;
  };

  return (
    <>
      <BreadcrumbJsonLd trail={[["러닝화", "/shoes"], [name, `/shoes/${s.id}`]]} />
      <ShoeJsonLd shoes={[s]} name={name} url={PAGE(s.id)} />
      <main className="pb-24 text-gray-800 md:pb-0">
      <div className="mx-auto max-w-5xl px-6 pt-8 md:pt-12">
        <AffiliateNotice show={!!affiliateFor(s.id)} />
        <Link href="/shoes" className="mb-4 inline-flex min-h-11 items-center text-sm text-emerald-600 hover:underline">
          ← 러닝화 목록
        </Link>

        {/**
          * 2026-11-10 디자인 점검(패턴 30): PC 에서 사진이 220px 칸 하나라 작았다.
          * → 넓은 화면은 사진 왼쪽 크게(약 55%)·정보 오른쪽, 휴대폰은 화면 폭 4:3.
          *   공식몰 옆모습 사진(lib/shoes/photos.json)이 있으면 그것을 쓴다. 여러 장(3~5장)은 아직 모으지 않았다.
          */}
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
          {(() => {
            const ph = photoOf(s.id);
            return (
              <div className="grid aspect-[4/3] w-full shrink-0 place-items-center overflow-hidden rounded-2xl bg-gray-50 p-6 md:w-[55%] md:p-10">
                {ph ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/shoes/photo/${s.id}.webp`} alt={name} width={ph.w} height={ph.h} fetchPriority="high" className="h-auto w-full" />
                ) : (
                  <ShoeThumb src={s.imageUrl} alt={name} model={s.model} className="h-full w-full" />
                )}
              </div>
            );
          })()}
          <div className="min-w-0">
            <p className="text-sm text-gray-500">{s.brand}</p>
            <h1 className="text-[32px] md:text-[40px] font-bold leading-tight text-gray-900">{s.model}</h1>
            {nicknamesOf(s.model).length > 0 && (
              // 2026-09-26 — 러닝 오픈채팅에서 실제로 쓰인 애칭만 (lib/shoes/aliases.ts)
              <p className="mt-1 text-sm text-gray-500">
                러너들 사이에서는 {nicknamesOf(s.model).map((n) => `「${n}」`).join(" ")}
                {rago(nicknamesOf(s.model).at(-1) ?? "")} 불러요
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p className="text-xl text-gray-800">약 {won(s.priceKrw)}</p>
              <LikeButton id={s.id} name={name} />
            </div>
            {official && (
              // 2026-11-02 — 공식몰 목록 자동 확인 (lib/shoes/official.ts). 수집기가 2일 연속 같은 값을 읽었을 때만
              <p className="mt-1 text-xs text-gray-500">
                {official.listed && official.priceKrw ? (
                  <>
                    공식몰 정가{" "}
                    {official.url ? (
                      <a href={official.url} rel="nofollow noopener" target="_blank" className="underline underline-offset-2">
                        {won(official.priceKrw)}
                      </a>
                    ) : (
                      won(official.priceKrw)
                    )}
                  </>
                ) : (
                  <>공식몰 목록에서 보이지 않아요</>
                )}{" "}
                · {official.checkedAt} 자동 확인
              </p>
            )}
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
      </div>
      <article className="mx-auto max-w-5xl px-6 pb-12 [&>*]:max-w-2xl">

        {s.auto && (
          <p className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
            공식몰 목록에서 {s.auto.checkedAt} 자동으로 확인한 새 모델이에요. 가격·무게·드롭은 공식몰 값이고,
            쿠션·안정성·용도·발볼·스택은 이전 세대{" "}
            <Link href={`/shoes/${s.auto.basedOn}`} className="font-semibold underline underline-offset-2">
              {s.auto.basedOnModel}
            </Link>{" "}
            기준이에요. 이 세대에서 바뀐 점은 아직 따로 확인하지 않았어요.
          </p>
        )}

        {s.successor && (() => {
          const next = successorOf(s);
          return (
            <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              후속 모델{" "}
              {next ? (
                <Link href={`/shoes/${next.id}`} className="font-bold underline underline-offset-2">
                  {s.successor}
                </Link>
              ) : (
                <strong>{s.successor}</strong>
              )}
              이(가) 나왔습니다. 재고 할인으로 싸게 살 수 있지만, 사이즈가 빨리 빠집니다.
              {next && <> 후속작 스펙은 이름을 누르면 볼 수 있습니다.</>}
            </p>
          );
        })()}

        {!s.successor && official?.newerModel && (
          <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            공식몰에 다음 세대 <strong>{official.newerModel}</strong>이(가) 판매 중이에요. ({official.checkedAt} 자동 확인)
          </p>
        )}

        {(() => {
          const prev = predecessorOf(s);
          if (!prev) return null;
          return (
            <p className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
              이전 세대{" "}
              <Link href={`/shoes/${prev.id}`} className="font-semibold underline underline-offset-2">
                {prev.model}
              </Link>
              도 목록에 있습니다. 구형은 재고 할인이 붙는 경우가 많으니 같이 비교해 보세요.
            </p>
          );
        })()}

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
                  나에게 맞는 신발 찾기
                </Link>
              </p>
            </div>
          );
        })()}

        <p className="mt-6 text-base leading-relaxed text-gray-700">{s.blurb}</p>

        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-gray-900">스펙</h2>
          <dl className="divide-y divide-gray-100 rounded-2xl border border-gray-200">
            <Row label="무게">
              {s.auto
                ? `${s.weightGramsM9}g (공식몰 표기${s.auto.weightBasis ? `, ${s.auto.weightBasis}` : ""})`
                : <>{s.weightGramsM9}g (남성 US9){s.weightGramsW8 ? ` · ${s.weightGramsW8}g (여성 US8)` : ""}</>}
              <Position value={s.weightGramsM9} all={SHOES.map((x) => x.weightGramsM9)} unit="g" low="가벼운" high="무거운" />
            </Row>
            <Row label="힐 드롭">
              {s.heelDropMm}mm
              <Position value={s.heelDropMm} all={SHOES.map((x) => x.heelDropMm)} unit="mm" low="낮은" high="높은" />
            </Row>
            <Row label="스택 높이">
              {s.stackHeightMm}mm{s.auto && " (이전 세대 기준)"}
              <Position value={s.stackHeightMm} all={SHOES.map((x) => x.stackHeightMm)} unit="mm" low="얇은" high="두꺼운" />
            </Row>
            <Row label="쿠셔닝">
              {s.cushioning}/5 ({cushionKo(s.cushioning)})
            </Row>
            <Row label="안정성">{STABILITY_KO[s.stability]}</Row>
            <Row label="발볼 옵션">{s.widthOptions.join(" · ")}</Row>
            {s.genderFit && <Row label="라스트">{GENDER_FIT_LABEL[s.genderFit]}</Row>}
            <Row label="국내 구매">{KR_AVAILABILITY_LABEL[s.krAvailability]}</Row>
          </dl>
          <p className="mt-2 text-xs text-gray-400">
            {/* 2026-11-09 운영자 결정: 경쟁 리뷰 사이트(RunRepeat)로 링크를 걸지 않는다 — 다른 사이트를 홍보할 이유가 없다.
               다만 실측값을 우리가 잰 것처럼 쓰지 않도록 「공개된 실측 자료 기준」이라고 밝힌다. 원래 주소는 데이터(sourceUrl)에만 남긴다 */}
            스펙은 공개된 실측 자료 기준{checked ? `(${checked} 확인)` : ""} · 위치는 이 사이트에 등록된 신발끼리 비교한 것이고, 좋고 나쁨을
            뜻하지 않습니다 ·{" "}
            <Link href={`/tools/shoe-side?s=${s.id}`} className="text-emerald-700 underline underline-offset-2">
              다른 신발과 두께 겹쳐 보기 →
            </Link>
          </p>
        </section>

        {/**
          * 2026-09-21: 판단 필드가 비어 있을 수 있게 됐다(`lib/shoes/types.ts` 참고).
          * 비어 있으면 이 칸을 **빈칸으로 두지 않고 왜 없는지 적는다.**
          * 「발 모양: 」 뒤가 비어 있으면 고장으로 보이고, 아무 말도 없으면
          * 판단한 신발과 안 한 신발을 구분할 방법이 사라진다.
          */}
        {/* 2026-11-10: 106종 전부 추천 후보가 됐다(lib/shoes/types.ts footTypesFromStability). 사람이 발 모양을 적지 않은 신발은
            안정성 구조로 정한 분류라고 밝힌다 — 전에는 「아직 판단하지 않아 추천에 안 나온다」고 적었다 */}
        {(() => {
          const sf = withFootTypes(s);
          return (
            <section className="mt-8">
              <h2 className="mb-3 text-xl font-bold text-gray-900">이 사이트의 분류</h2>
              <ul className="space-y-1.5 pl-4 text-sm text-gray-700">
                <li>• 발 모양: {sf.footTypes.map((f) => FOOT_KO[f]).join(" · ")}{sf.derivedFootTypes ? " (신발의 안정성 구조로 정함)" : ""}</li>
                {s.genderNote && <li>• {s.genderNote}</li>}
              </ul>
              <p className="mt-2 text-xs text-gray-500">
                저희가 정한 분류입니다. 브랜드가 정한 제한이 아니고, 발 모양별 신발 처방은 연구가 갈립니다.
              </p>
            </section>
          );
        })()}

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

        {/* 2026-11-06 — 데이터가 관련 있다고 말하는 가이드만 (components/ShoeGuideLinks.tsx 머리말: 구글 색인 대기 227개) */}
        <ShoeGuideLinks shoes={[s]} className="mt-8" />

        {/* 2026-11-02 — 스펙·가격 표의 값을 질문-답으로. 값이 없는 질문은 만들지 않는다 (lib/faq.ts) */}
        <div className="mt-8">
          <FaqSection
            items={shoeFaq(s, official, checked)}
            title={`${s.model}, 자주 묻는 질문`}
            schemaNote={` (뛰다가 아메리카노 확인 기준. 가격·재고는 판매처에서 바뀔 수 있습니다.)`}
          />
        </div>

        <section id="buy" className="mt-8 scroll-mt-20">
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

        {/* 2026-10-14 — 외부 후기 모음(블로그·유튜브). 안 모은 신발은 안 그린다. 원칙은 lib/shoes/reviews.ts 주석 */}
        <ShoeReviews shoeId={s.id} />

        {/* 2026-09-23 — 신어본 사람 반응. 근거·경위는 components/ShoeReactions.tsx 주석 */}
        <ShoeReactions shoeId={s.id} shoeName={name} />

        <div className="mt-10">
          <FinderCta
            from="shoe-detail"
            headline="이 신발이 내 몸에 맞는지 확인해 보세요"
            sub={`발 모양·발볼을 넣으면 ${SHOES.length}켤레를 내 조건 순서로 줄 세웁니다.`}
          />
        </div>
      </article>
      {/* 2026-11-10 디자인 점검(패턴 34): 구매가 페이지 맨 아래였다 → 휴대폰은 아래 고정 버튼으로 구매 구역에 바로 간다 */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-5 py-3 backdrop-blur md:hidden">
        <a href="#buy" className="flex h-12 items-center justify-center rounded-full bg-emerald-600 text-base font-semibold text-white hover:bg-emerald-700">
          구매처 보기 →
        </a>
      </div>
      </main>
    </>
  );
}
