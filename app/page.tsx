import Link from "next/link";
import { ARTICLES } from "@/lib/guide/articles";
import type { Metadata } from "next";

// 2026-10-12 SEO 점검: 홈만 canonical 이 없었다(제목·설명은 layout 기본값을 쓴다)
const HOME_TITLE = "뛰다가 아메리카노 — 초보 러너를 위한 러닝화 추천";
const HOME_DESC = "키·체중·발볼·발 타입에 맞는 러닝화를 질문 8개로 찾고, 무릎·발목·아킬레스건 부상 예방법을 확인하세요.";
// og 의 홈 값은 layout 이 아니라 여기 둔다(layout 에 두면 모든 하위 페이지가 홈 값을 물려받는다 — app/layout.tsx 주석)
export const metadata: Metadata = {
  // RSS 자동 발견 링크(2026-10-12). 제출은 서치어드바이저에서 따로 한다 — app/rss.xml/route.ts
  alternates: { canonical: "/", types: { "application/rss+xml": "/rss.xml" } },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESC,
    url: "/",
    siteName: "뛰다가 아메리카노",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: HOME_TITLE }],
  },
  twitter: { card: "summary_large_image", title: HOME_TITLE, description: HOME_DESC, images: ["/opengraph-image"] },
};
import HomeFinderCard, { type FinderShoe } from "@/components/HomeFinderCard";
import { officialOf } from "@/lib/shoes/official";
import VERIFIED from "@/lib/shoes/verified.json";
import { SHOES } from "@/lib/shoes/data";
import { RECOMMENDABLE_COUNT } from "@/lib/shoes/recommend";
import ShoeThumb from "@/components/ShoeThumb";
import { upcomingRaces, daysUntil, distanceLabel, currentStatus, type Race } from "@/lib/races";

/**
 * 홈 추천 카드에 실을 신발 — 서버에서 최소 필드만 넘긴다 (전부 싣는다. 2026-09-16 ShoeStrip 과 같은 이유).
 * 가격은 공식몰 자동 확인값이 목록에 살아 있을 때만 「공식몰 정가」로 넘긴다.
 */
const FINDER_SHOES: FinderShoe[] = SHOES.map((s) => {
  const o = officialOf(s.id);
  return {
    id: s.id,
    brand: s.brand,
    model: s.model,
    imageUrl: s.imageUrl,
    uses: s.uses,
    widthOptions: s.widthOptions,
    priceKrw: s.priceKrw,
    officialPrice: o?.listed && o.priceKrw ? o.priceKrw : undefined,
  };
});
// 2026-11-10: 첫 화면 다리 사진(HERO_SHOE)을 뺐다 — 용도 신발 타일로 대신한다(components/HomeFinderCard.tsx)

/** 가이드 카드 — GA4 28일(2026-11-05 확인) 가이드 착지 상위 셋: 미드풋 18 · 첫 10km 17 · 넓은 발볼 15명.
 * 제목은 원장(lib/guide/articles.ts)에서 가져온다 — 2026-11-10 가이드 제목을 모두 바꿨을 때 여기 손으로 적은 옛 제목 6개가 남았다 */
const HOME_GUIDE_TAGS: [string, string][] = [
  ["/injury/wide-foot", "발볼"],
  ["/injury/midfoot", "착지"],
  ["/injury/first-10k", "첫 대회"],
  // 2026-11-09: 홈 본문 링크가 134개 → 16개로 줄어 구글이 들를 길이 줄었다(색인 대기 227개). 지금 홈에서 빠진 주제를 되살린다
  ["/injury/flat-feet", "평발"],
  ["/injury/carbon-plate", "카본화"],
  ["/injury/heart-rate-zones", "심박"],
];
const HOME_GUIDES = HOME_GUIDE_TAGS.flatMap(([href, tag]) => {
  const a = ARTICLES.find((x) => x.href === href);
  return a ? [{ href, tag, title: a.title }] : [];
});

/** 넘으려는 단계별 가이드 — 지금 홈(main)의 「단계별」 줄과 같다. 근거는 lib/guide/stages.ts 머리말 */
const LEVEL_GUIDES = [
  { href: "/injury/start-running", label: "처음 → 30분" },
  { href: "/injury/first-10k", label: "첫 10km" },
  { href: "/injury/intermediate-guide", label: "하프 준비" },
  { href: "/injury/advanced-guide", label: "풀·기록" },
];

/**
 * 두 켤레 비교 — 지금 홈(main)에서 옮김. 네이버 유입 검색어 1위가 「호카 브룩스 비교」(11.36%, 2026-09-08 기록)라
 * 브랜드 비교를 맨 위에 둔다. 비교 페이지로 가는 홈 링크가 0개가 되면 구글이 그 페이지들을 더 늦게 찾는다
 */
const HOME_COMPARES: { href: string; label: string; note?: string; pair?: [string, string] }[] = [
  // 브랜드 비교 카드의 사진은 아래 모델쌍과 겹치지 않는 두 켤레(마하 6 · 글리세린 22)
  { href: "/compare/hoka-vs-brooks", label: "호카 vs 브룩스", note: "브랜드 단위로 스펙 모아 보기", pair: ["hoka-mach-6", "brooks-glycerin-22"] },
  { href: "/compare/hoka-clifton-10-vs-brooks-ghost-17", label: "호카 클리프턴 10 vs 브룩스 고스트 17" },
  { href: "/compare/nike-pegasus-42-vs-hoka-clifton-10", label: "나이키 페가수스 42 vs 호카 클리프턴 10" },
  { href: "/compare/asics-gel-nimbus-27-vs-hoka-bondi-9", label: "아식스 님버스 27 vs 호카 본디 9" },
  { href: "/compare/brooks-adrenaline-gts-25-vs-nb-860-v15", label: "브룩스 아드레날린 25 vs 뉴발란스 860 v15" },
];

/** 비교 카드의 두 켤레 — 주소의 「-vs-」 앞뒤가 신발 id 다(app/compare/[slug] 의 parseSlug 와 같은 규칙) */
function comparePair(c: (typeof HOME_COMPARES)[number]) {
  const [a, b] = c.pair ?? (c.href.split("/").pop()!.split("-vs-") as [string, string]);
  const A = SHOES.find((x) => x.id === a);
  const B = SHOES.find((x) => x.id === b);
  return A && B ? ([A, B] as const) : null;
}

/** 참가비 한 줄 — 금액이 하나면 그 값, 여럿이면 가장 싼 값 + 「부터」. 없으면 쓰지 않는다 */
function feeLabel(fees: Race["fees"]): string {
  const ks = (fees ?? []).map((f) => f.krw).filter((n): n is number => typeof n === "number" && n > 0);
  if (!ks.length) return "";
  const min = Math.min(...ks);
  return `${min.toLocaleString()}원${new Set(ks).size > 1 ? "부터" : ""}`;
}

/**
 * 「이렇게 확인했어요」 — 숫자·날짜는 전부 데이터 파일에서 센다.
 *   · 공식몰 정가: lib/shoes/official.json (수집기가 2일 연속 같은 값을 읽은 것만)
 *   · 스펙·발볼: lib/shoes/verified.json (운영자가 모델별로 확인한 날)
 *   · 대회: lib/races.json 의 checkedAt (다가오는 대회 중 가장 최근 확인일)
 */
const officialChecked = SHOES.map((s) => officialOf(s.id)).filter((o) => o?.listed && o.priceKrw);
const officialDate = officialChecked.map((o) => o!.checkedAt).sort().at(-1);
const verifiedDates = SHOES.map((s) => (VERIFIED as Record<string, string>)[s.id]).filter(Boolean).sort();
const TRUST_BASE = [
  { what: "추천 순서", how: "광고비로 순위를 바꾸지 않아요" },
  // 2026-11-05 운영자: 문장을 짧게. 단, 공식몰 자동 확인은 일부 모델뿐이라 「106종 전부 공식몰 정가」로 읽히게 쓰지 않는다
  //   (모델별로 「공식몰 정가」 / 「권장가 추산」 표시는 카드에 따로 있다)
  {
    what: "가격",
    // 2026-11-06: 「매일 자동 확인 (최근 11-02)」가 4일 뒤에도 그대로라 거짓말처럼 읽혔다. 수집기는 값이 같으면 checkedAt 을 14일마다만 올리고
    //   (ddaiga-pipeline REFRESH_CHECKED_DAYS), GitHub 정기 실행이 늦거나 빠지는 날도 있어 「매일」을 약속할 수 없다.
    //   그래서 몇 종이 자동 확인인지와 그 값이 언제 기준인지만 적는다.
    how: officialDate
      ? `${SHOES.length}종 · 공식몰 정가 ${officialChecked.length}종 자동 확인 (${officialDate} 기준)`
      : `${SHOES.length}종 · 권장가 추산`,
  },
  // 2026-11-09: 「브랜드 공식 자료로」는 사실과 달랐다 — 스펙 다수는 공개된 실측 자료(데이터 sourceUrl) 값이다. 출처 종류를 사실대로 적는다
  verifiedDates.length ? { what: "스펙·발볼", how: `브랜드 공식 표기와 공개된 실측 자료로 ${verifiedDates.length}종 확인` } : null,
].filter((x): x is { what: string; how: string } => !!x);

/**
 * 2026-11-06: `revalidate = 21600` 을 뺐다. 「하루 네 번 다시 만든다」고 적어 뒀지만 실제로는
 * 6시간이 지난 뒤 **첫 방문자에게 옛 화면을 주고** 그 뒤에 다시 만든다(방문이 드물면 며칠 전 화면).
 * 미리보기 홈에서 11/6 에 「11/05 마감 · 오늘 마감」이 실제로 떴다. 마감이 지난 대회를 「오늘 마감」으로 보이는 건 틀린 정보라
 * 날짜로 계산하는 페이지는 요청마다 그린다. 방문이 월 수백 건이라 서버 부담은 작다.
 */
export const dynamic = "force-dynamic";

export default function Home() {
  // 대회는 서버에서 센다. 개수를 손으로 적으면 대회가 하나 지날 때마다 틀린 숫자가 된다.
  const upcoming = upcomingRaces();

  /**
   * 접수 마감 임박 (2026-09-23)
   *
   * 러닝라이프 홈을 375px 로 직접 열어 보니 첫 화면 다음이 **「접수가 얼마 남지 않은 대회」** 였다.
   * 러닝위키 홈은 아예 **대회 목록 그 자체**다(월별 탭 → 바로 리스트, 21화면).
   * **두 곳 다 홈에서 설명을 하지 않는다. 데이터를 바로 깐다.**
   *
   * 우리 실측(`lib/races.json`): 55건 중 **33건이 9월 안에 접수 마감.** 10월 19건, 11월 2건.
   * 그런데 홈에는 「다가오는 대회」밖에 없었다. 그건 **대회 날짜** 기준이라
   * 이미 접수가 끝난 대회도 올라온다 — 지금 신청할 수 있는지는 알 수 없다.
   *
   * 마감일은 사람이 놓치면 되돌릴 수 없는 정보라 **대회 날짜보다 먼저** 보여준다.
   * 정렬은 `registrationEnd` 순 — 급한 것부터.
   */
  const closingSoon = upcoming
    .filter((r) => currentStatus(r) === "마감임박")
    .sort((a, b) => (a.registrationEnd ?? "").localeCompare(b.registrationEnd ?? ""))
    .slice(0, 4);

  // 「공식 홈페이지에서 확인」만 쓰면 안 된다 — 다가오는 대회 115건 중 80건은 factsFrom 「모음」(2026-11-05 기준)
  const raceChecked = upcoming.map((r) => r.checkedAt).filter(Boolean).sort().at(-1);
  const TRUST = raceChecked
    ? [...TRUST_BASE, { what: "대회", how: `공식 홈페이지와 대회 모음 사이트에서 확인 (${raceChecked} 기준)` }]
    : TRUST_BASE;

  return (
    <main className="min-h-screen bg-white">

      {/**
       * 2026-11-05 — 히어로와 신발 띠를 「추천 카드」 하나로 바꿨다 (디자인 캔버스 「H01 수정안」).
       * 홈에서 발볼·용도를 고르면 아래 목록이 바로 좁혀지고, 버튼을 누르면 고른 것을 들고 추천기로 간다.
       * 이전 히어로(「내 발에 맞는 러닝화, 데이터로 찾아드려요」)와 ShoeStrip 의 경위 주석은
       * git 기록과 components/HeroBackdrop.tsx · components/ShoeStrip.tsx 에 남아 있다 — 파일은 지우지 않았다.
       * 경위는 components/HomeFinderCard.tsx 머리말.
       */}
      <HomeFinderCard shoes={FINDER_SHOES} count={RECOMMENDABLE_COUNT} />

      {/**
       * 2026-11-05 — 아래 구역을 디자인 「H01 수정안」 순서로 바꿨다: 가이드 → 마감 임박 대회 → 이렇게 확인했어요 → 게시판 입구.
       * 빠진 구역(답 바로가기 · 다가오는 대회 · 인기 비교 · 가이드 목록·단계 칩·도구 칩 · 게시판 미리보기 ·
       * 「어떻게 추천하나요?」 · 마무리 버튼)은 git 기록에 경위 주석과 함께 남아 있다. 각 목록은 머리글 메뉴로 간다.
       * 「광고비로 순서가 바뀌지 않습니다」는 사이트의 유일한 주장이라 「이렇게 확인했어요」 첫 줄로 옮겼다.
       */}

      {/* 가이드 — GA4 28일(2026-11-05) 가이드 착지 상위 세 편 */}
      <section aria-labelledby="guide-h" className="pt-12">
        <div className="mx-auto max-w-5xl">
          <h2 id="guide-h" className="px-5 text-xl font-semibold text-[#111111]">고르기 전에 읽어 보세요</h2>
          <div className="finder-row flex gap-3 overflow-x-auto px-5 pb-2 pt-4">
            {HOME_GUIDES.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="press flex min-h-40 w-60 shrink-0 snap-start flex-col justify-between gap-4 rounded-2xl bg-[#111111] p-5 text-white"
              >
                <span className="text-sm font-semibold text-[#C8F031]">{g.tag}</span>
                <span className="text-base font-bold leading-snug">{g.title}</span>
              </Link>
            ))}
          </div>
          <nav aria-label="단계별 가이드" className="flex flex-wrap items-center gap-2 px-5 pt-3">
            <span className="text-sm text-gray-500">단계별</span>
            {LEVEL_GUIDES.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="press inline-flex h-11 items-center rounded-full border border-gray-200 px-4 text-sm text-[#111111] transition-colors hover:border-[#111111]"
              >
                {g.label}
              </Link>
            ))}
            <Link href="/injury" className="inline-flex h-11 items-center px-2 text-sm text-emerald-600 underline underline-offset-4">
              가이드 전체
            </Link>
          </nav>
        </div>
      </section>

      {/**
       * 접수 마감이 가까운 대회 — 계산 근거는 이 파일 위쪽 `closingSoon` 주석. 0건이면 그리지 않는다.
       * 빨강(#C9313F)은 마감에만 쓴다.
       */}
      {closingSoon.length > 0 && (
        <section id="races" aria-labelledby="race-h" className="pt-12">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-between px-5">
              <h2 id="race-h" className="text-xl font-semibold text-[#111111]">접수 마감이 가까운 대회</h2>
              <Link href="/races" className="flex min-h-11 items-center text-sm font-bold text-[#111111] underline">
                전체 일정
              </Link>
            </div>
            {/**
             * 2026-11-09 배번표 카드 — 사이트의 「세계」(대회 배번·기록증)를 그대로 쓴 한 자리.
             * 큰 숫자는 장식이 아니라 실제 값(접수 마감까지 남은 날). 빨강(#C9313F)은 마감에만 쓴다.
             * 네 귀퉁이 점은 배번을 옷에 다는 핀 자리 — 그림일 뿐이라 화면 읽기 프로그램에는 숨긴다.
             * 2026-11-10 운영자 「글자가 너무 크다」: 남은 날 40px → 24px. 큰 글자는 첫 화면 제목 하나로 둔다.
             */}
            <ul className="finder-row flex gap-3 overflow-x-auto px-5 pb-2 pt-4">
              {closingSoon.map((r) => {
                const left = daysUntil(r.registrationEnd ?? null);
                const fee = feeLabel(r.fees);
                return (
                  <li key={r.id} className="w-64 shrink-0 snap-start">
                    <Link
                      href={`/races/${r.id}`}
                      className="press relative flex h-full flex-col rounded-xl border border-[#D5D8DD] bg-white px-5 pb-4 pt-5 text-[#111111] transition-colors hover:border-[#111111]"
                    >
                      {[["left-2.5", "top-2.5"], ["right-2.5", "top-2.5"], ["left-2.5", "bottom-2.5"], ["right-2.5", "bottom-2.5"]].map(([x, y]) => (
                        <span key={x + y} aria-hidden className={`absolute ${x} ${y} h-2 w-2 rounded-full border border-[#D5D8DD] bg-[#F4F5F7]`} />
                      ))}
                      <span className="text-center text-xs text-[#4B5059]">접수 마감까지</span>
                      <span className="mt-1 text-center text-2xl font-bold leading-none tabular-nums text-[#C9313F]">
                        {left === null ? "임박" : left === 0 ? "오늘" : `D-${left}`}
                      </span>
                      <span className="mt-4 border-t border-dashed border-[#D5D8DD] pt-3 text-base font-semibold leading-snug [overflow-wrap:anywhere] break-keep">
                        {r.name}
                      </span>
                      <span className="mt-1 text-sm text-[#4B5059]">
                        {[r.region, r.distancesKm.map(distanceLabel).join(", ")].filter(Boolean).join(" · ")}
                      </span>
                      <span className="mt-auto flex items-center justify-between pt-3 text-xs tabular-nums text-[#4B5059]">
                        <span>{r.registrationEnd ? `${r.registrationEnd.slice(5).replace("-", "/")} 마감` : ""}</span>
                        <span>{fee}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* 이렇게 확인했어요 — 날짜는 전부 데이터 파일에서 계산한다(손으로 적으면 하루 지나 틀린다) */}
      {/* 두 켤레 비교 — 목록은 이 파일 위쪽 HOME_COMPARES */}
      <section aria-labelledby="cmp-h" className="pt-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-baseline justify-between px-5">
            <h2 id="cmp-h" className="text-xl font-semibold text-[#111111]">두 켤레 놓고 비교하기</h2>
            <Link href="/compare/hoka-vs-brooks" className="text-sm text-emerald-600 underline underline-offset-4">
              브랜드 비교
            </Link>
          </div>
          {/* 2026-11-09: 글자 목록 → 실제 신발 사진 두 장을 마주 보게. 색을 더하지 않고 사진이 눈을 끈다 */}
          <ul className="finder-row flex gap-3 overflow-x-auto px-5 pb-2 pt-4">
            {HOME_COMPARES.map((c) => {
              const pair = comparePair(c);
              const [l, r] = c.label.split(" vs ");
              return (
                <li key={c.href} className="w-72 shrink-0 snap-start">
                  <Link
                    href={c.href}
                    className="press flex h-full flex-col overflow-hidden rounded-2xl border border-[#D5D8DD] bg-white text-[#111111] transition-colors hover:border-[#111111]"
                  >
                    <span className="relative grid grid-cols-2 gap-1 bg-[#F4F5F7] p-3">
                      {pair?.map((x) => (
                        <ShoeThumb key={x.id} src={x.imageUrl} alt="" model={x.model} className="aspect-square w-full" />
                      ))}
                      <span aria-hidden className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-sm font-bold shadow-sm">
                        vs
                      </span>
                    </span>
                    <span className="flex flex-1 flex-col gap-0.5 px-4 pb-4 pt-3">
                      <span className="text-base font-semibold leading-snug">{l}</span>
                      <span className="text-base font-semibold leading-snug">{r}</span>
                      <span className="mt-auto pt-2 text-sm text-emerald-600">{c.note ?? "무게·드롭·가격 비교"} ›</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="trust-h" className="mx-auto max-w-3xl px-5 pt-12">
        <h2 id="trust-h" className="mb-4 text-xl font-semibold text-[#111111]">이렇게 확인했어요</h2>
        <ul className="flex flex-col gap-3 text-sm leading-normal">
          {TRUST.map((t) => (
            <li key={t.what} className="flex gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                <path d="M5 12l5 5 9-10" />
              </svg>
              <span>
                <b className="font-bold text-[#111111]">{t.what}</b>{" "}
                <span className="text-[#4B5059]">{t.how}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 게시판 입구 */}
      <section className="mx-auto max-w-3xl px-5 py-12">
        <Link href="/community" className="press flex items-center justify-between gap-4 rounded-2xl bg-[#F5F5F5] p-6 text-[#111111]">
          <span>
            <span className="block text-xl font-semibold">추천이 애매했나요?</span>
            <span className="mt-1 block text-sm text-[#4B5059]">게시판에 궁금한 점이나 문의 사항 적고 물어보세요</span>
          </span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </section>
    </main>
  );
}
