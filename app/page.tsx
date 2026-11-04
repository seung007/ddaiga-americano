import Link from "next/link";
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
import HomeCommunitySection from "@/components/HomeCommunitySection";
import { reactionNames } from "@/lib/reaction-names";
import HomeFinderCard, { type FinderShoe } from "@/components/HomeFinderCard";
import { officialOf } from "@/lib/shoes/official";
import QuickAnswers from "@/components/QuickAnswers";
import { SHOES } from "@/lib/shoes/data";
import { upcomingRaces, daysUntil, distanceLabel, currentStatus } from "@/lib/races";

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
const HERO_SHOE = SHOES.find((s) => s.id === "asics-novablast-5");
const FINDER_HERO = HERO_SHOE ? { src: HERO_SHOE.imageUrl, alt: "" } : undefined;

// 사전 렌더링된 인기 비교 페어 (app/compare/[slug] generateStaticParams와 일치)
const POPULAR_COMPARES = [
  { slug: "hoka-clifton-10-vs-brooks-ghost-17", label: "호카 클리프턴 10", vs: "브룩스 고스트 17" },
  { slug: "nike-pegasus-42-vs-hoka-clifton-10", label: "나이키 페가수스 42", vs: "호카 클리프턴 10" },
  { slug: "asics-gel-nimbus-27-vs-hoka-bondi-9", label: "아식스 님버스 27", vs: "호카 본디 9" },
  { slug: "brooks-adrenaline-gts-25-vs-nb-860-v15", label: "브룩스 아드레날린 25", vs: "뉴발란스 860 v15" },
];

/**
 * 2026-10-06: 경력 구간(0~6개월·6~24개월·2년+) 대신 **넘으려는 단계**로 바꿨다.
 * 그 구간은 사이트가 정한 값이었고 근거가 없었다. 이유는 lib/guide/stages.ts 머리말.
 */
const LEVEL_GUIDES = [
  { href: "/injury/start-running", label: "처음 → 30분" },
  { href: "/injury/first-10k", label: "첫 10km" },
  { href: "/injury/intermediate-guide", label: "하프 준비" },
  { href: "/injury/advanced-guide", label: "풀·기록" },
];

/** 「다가오는 대회」가 날짜로 걸러지므로 빌드 때 값에 굳지 않게 한다 (2026-09-16) */
export const revalidate = 21600;

export default function Home() {
  // 대회는 서버에서 센다. 개수를 손으로 적으면 대회가 하나 지날 때마다 틀린 숫자가 된다.
  const upcoming = upcomingRaces();
  const nextRaces = upcoming.slice(0, 3);

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
    .slice(0, 3);
  const closingSoonTotal = upcoming.filter((r) => currentStatus(r) === "마감임박").length;

  return (
    <main className="min-h-screen bg-white">

      {/**
       * 2026-11-05 — 히어로와 신발 띠를 「추천 카드」 하나로 바꿨다 (디자인 캔버스 「H01 수정안」).
       * 홈에서 발볼·용도를 고르면 아래 목록이 바로 좁혀지고, 버튼을 누르면 고른 것을 들고 추천기로 간다.
       * 이전 히어로(「내 발에 맞는 러닝화, 데이터로 찾아드려요」)와 ShoeStrip 의 경위 주석은
       * git 기록과 components/HeroBackdrop.tsx · components/ShoeStrip.tsx 에 남아 있다 — 파일은 지우지 않았다.
       * 경위는 components/HomeFinderCard.tsx 머리말.
       */}
      <HomeFinderCard shoes={FINDER_SHOES} hero={FINDER_HERO} />

      {/* 답 바로가기 — 신발 띠 밑.
          2026-09-12: 네이버 유입 검색어의 73%가 브랜드 비교, 33%가 발 조건인데
          홈 첫 화면에 그 입구가 하나도 없었다. 유일한 행동이 **폼 작성**이었다.
          자세한 경위는 components/QuickAnswers.tsx 주석에. */}
      <QuickAnswers />

      {/**
       * 접수 마감 임박 — **「다가오는 대회」보다 위에 둔다.**
       *
       * 두 섹션은 축이 다르다.
       *   · 마감 임박 = **접수 마감일** 기준. 놓치면 끝이다
       *   · 다가오는 대회 = **대회 날짜** 기준. 계획용이고, 접수가 끝난 것도 섞인다
       *
       * 급한 쪽을 위에 놓는다. 0건이면 그리지 않는다.
       * 계산 근거는 이 파일 위쪽 `closingSoon` 주석.
       */}
      {closingSoon.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 pb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">접수 마감 임박</h2>
            <Link href="/races" className="shrink-0 text-sm text-amber-700 hover:underline">
              {closingSoonTotal}개 전체 보기 →
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3">
            {closingSoon.map((r) => {
              const left = daysUntil(r.registrationEnd ?? null);
              return (
                <li key={r.id}>
                  <Link
                    href={`/races/${r.id}`}
                    className="block h-full rounded-xl border border-amber-300 bg-amber-50 p-4 transition-colors hover:border-amber-500"
                  >
                    <p className="text-xs font-bold text-amber-800">
                      {left !== null && left >= 0
                        ? left === 0
                          ? "오늘 접수 마감"
                          : `접수 마감 D-${left}`
                        : "접수 마감 임박"}
                    </p>
                    <p className="mt-1.5 font-bold leading-snug text-gray-900">{r.name}</p>
                    <p className="mt-1.5 text-sm text-gray-700">
                      {r.date} 대회 · {r.region}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {r.distancesKm.map(distanceLabel).join(" / ")}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/**
       * 다가오는 대회 (2026-09-15)
       *
       * `lib/races.json` 에 55건이 있고 `/races` 가 완성돼 있었는데 **헤더에도 홈에도
       * 입구가 없었다.** URL 을 직접 치지 않으면 아무도 볼 수 없는 상태로 3일 있었다.
       *
       * 홈에는 **3개만** 싣는다. 이미 섹션이 8개고 60%는 스크롤을 안 한다 —
       * 목록을 통째로 넣으면 그만큼 아래가 더 안 읽힌다.
       *
       * 2026-09-16: 카드는 **대회 상세 페이지**(`/races/[id]`)로 간다. 전 대회가 참가비·접수 기간·
       * 접수처 링크를 가진 상세 페이지를 갖게 됐다. 그 전에는 콘텐츠가 없어 밖으로 바로 내보냈다.
       *
       * 0건이면 섹션을 아예 그리지 않는다. 빈 박스는 고장으로 읽힌다.
       */}
      {nextRaces.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">다가오는 대회</h2>
            <Link href="/races" className="shrink-0 text-sm text-emerald-600 hover:underline">
              전체 {upcoming.length}개 보기 →
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3">
            {nextRaces.map((r) => {
              const d = daysUntil(r.date);
              return (
                <li key={r.id}>
                  {/* 2026-09-16: 전 대회가 상세 페이지를 갖게 돼 내부로 보낸다. 접수처 링크·출처 구분은 상세 페이지에. */}
                  <Link
                    href={`/races/${r.id}`}
                    className="block h-full rounded-xl border border-gray-200 p-4 transition-colors hover:border-emerald-400"
                  >
                    <p className="font-bold leading-snug text-gray-900">{r.name}</p>
                    <p className="mt-1.5 text-sm text-gray-700">
                      {r.date ? (
                        <>
                          <strong>{r.date}</strong>
                          {d !== null && d >= 0 && (
                            <span className="ml-1.5 text-emerald-700">{d === 0 ? "오늘" : `D-${d}`}</span>
                          )}
                        </>
                      ) : (
                        <span className="text-amber-700">날짜 미정</span>
                      )}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {r.region}
                      <span className="mx-1.5 text-gray-300">·</span>
                      {r.distancesKm.map(distanceLabel).join(" / ")}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-emerald-600">자세히 보기 →</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/**
       * 「어떻게 추천하나요?」가 여기 있었다 → **맨 아래로 옮겼다** (2026-09-23).
       *
       * 근거는 경쟁 사이트 실측(375px 로 직접 열어 봄):
       *   · 러닝라이프 — 검색 → 실시간 인기 대회 → 접수 얼마 안 남은 대회 → 최근 평가 → 상품
       *   · 러닝위키   — 월별 탭 → 대회 목록 (21화면)
       *   **둘 다 홈에서 자기 서비스를 설명하지 않는다. 데이터를 바로 깐다.**
       *
       * 우리 홈은 콘텐츠 사이에 설명이 끼어 있었다. 사용자 지적이 정확했다 —
       * *"메인인데 내용이 잘 정리되어 담겨 있지 않아 들어왔을 때 뭐지 할 것 같다."*
       *
       * 지우지 않고 **CTA 바로 앞으로** 옮긴다. 「광고비로 순서가 바뀌지 않습니다」는
       * 이 사이트의 유일한 주장이라 사라지면 안 되고, 버튼을 누를지 망설이는 자리에서 받쳐 주는 게 맞다.
       */}

      {/* 인기 러닝화 비교 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-6">
          {/* 위 신발 띠와 목적이 다르다 — 띠는 훑어보기, 여기는 **두 켤레를 붙여 놓고 고르기**다.
              제목이 그 차이를 말하지 않으면 같은 섹션이 두 번 나오는 것으로 읽힌다(2026-09-15). */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">두 켤레 놓고 비교하기</h2>
            <Link href="/shoe-finder" className="text-sm text-emerald-600 hover:underline">
              내 신발 찾기 →
            </Link>
          </div>
          {/**
           * 2026-09-08: 브랜드 비교를 모델쌍보다 **위에** 둔다.
           *
           * 네이버 실측 유입 검색어 1위가 `호카 브룩스 비교` 로 11.36% 였다(2위의 5배).
           * 사람들이 묻는 단위가 브랜드인데 이 섹션은 모델쌍만 내놓고 있었다.
           */}
          <Link
            href="/compare/hoka-vs-brooks"
            className="mb-3 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 transition-colors hover:border-emerald-400"
          >
            <span className="min-w-0 text-sm font-semibold leading-snug text-emerald-900">
              호카 vs 브룩스
              <span className="ml-2 font-normal text-emerald-700">
                브랜드 단위로 스펙 집계
              </span>
            </span>
            <span className="ml-2 shrink-0 text-xs font-semibold text-emerald-600">비교 →</span>
          </Link>
          <div className="grid gap-3 sm:grid-cols-2">
            {POPULAR_COMPARES.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-5 py-4 hover:border-emerald-300 transition-colors"
              >
                <span className="text-sm font-medium text-gray-800 leading-snug">
                  {c.label}
                  <span className="text-gray-400 mx-1.5">vs</span>
                  {c.vs}
                </span>
                <span className="shrink-0 text-xs text-emerald-600 font-semibold ml-2">비교 →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Injury preview + Community */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="grid gap-10 md:grid-cols-2">

            {/* 부상 예방 가이드 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">러닝 가이드</h2>
                <Link href="/injury" className="text-sm text-emerald-600 hover:underline">전체 보기 →</Link>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  {
                    href: "/injury/it-band",
                    tag: "무릎",
                    title: "장경인대염 초기 대처법 3가지",
                    desc: "달릴 때마다 무릎 바깥쪽이 아프다면.",
                  },
                  {
                    href: "/injury/first-10k",
                    tag: "첫 대회",
                    title: "생애 첫 10km 준비물과 페이스",
                    desc: "출발선에 서기 전에 알아야 할 것들.",
                  },
                  {
                    // 2026-09-23: 제목이 「미드풋 전환 후 아킬레스건 스트레칭」이었다.
                    // 그 제목은 9/21에 페이지에서 뺐는데 홈 카드만 남아 있었다.
                    href: "/injury/achilles",
                    tag: "아킬레스",
                    title: "달리기 아킬레스건·종아리 통증 스트레칭",
                    desc: "달린 뒤 당기고 뻐근하다면. 원인과 무관하게 같은 3가지.",
                  },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-4 hover:border-emerald-300 transition-colors"
                  >
                    <span className="shrink-0 mt-0.5 inline-block text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {item.tag}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-0.5">{item.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400">단계별:</span>
                {LEVEL_GUIDES.map((g) => (
                  <Link
                    key={g.href}
                    href={g.href}
                    className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full hover:bg-emerald-100 transition-colors"
                  >
                    {g.label}
                  </Link>
                ))}
              </div>
              {/* 2026-10-12: 홈에서 도구·코스로 가는 길이 없었다(council Product 렌즈). 홈 체류 16초 */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400">해 보기:</span>
                {[
                  { href: "/courses#jamsil", label: "한강 코스 가상 달리기" },
                  { href: "/tools/shoe-side", label: "러닝화 두께 비교" },
                  { href: "/tools/shoe-life#log", label: "러닝화 기록장" },
                ].map((g) => (
                  <Link
                    key={g.href}
                    href={g.href}
                    className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {g.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* 커뮤니티 */}
            <HomeCommunitySection names={reactionNames()} />

          </div>
        </div>
      </section>

      {/**
       * 어떻게 추천하나요 — **콘텐츠를 다 보여준 뒤 맨 마지막에.** (2026-09-23 이동)
       * 원래 자리와 이동 근거는 「인기 러닝화 비교」 위 주석에 있다.
       */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">어떻게 추천하나요?</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { n: "1", t: "내 정보 선택", d: "용도·키·체중·발볼·발 타입 등 질문 8개를 버튼으로 고르면 끝. 숫자 입력은 없어요." },
            { n: "2", t: "맞춤 추천 3개", d: "수십 개 모델 중 내 체형 조건을 통과한 신발만 골라드려요." },
            { n: "3", t: "부상 예방까지", d: "무릎·발목·아킬레스건 — 증상별 대처법을 추천과 함께 연결해드려요." },
          ].map((s) => (
            <div key={s.n} className="rounded-xl border border-gray-100 p-5">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                {s.n}
              </div>
              <h3 className="mb-1 font-semibold text-gray-900">{s.t}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{s.d}</p>
            </div>
          ))}
        </div>
        {/**
         * 2026-09-15: 바로 아래 있던 **Feature 3분할을 이 섹션에 흡수했다.**
         *
         * 두 섹션이 같은 말을 하고 있었다:
         *   · 3분할 ②「부상 예방까지 함께」 = 위 3단계 ③「부상 예방까지」 — 제목까지 거의 같다
         *   · 3분할 ①「논문으로 고른 추천」의 입력 항목 나열 = 위 ①「내 정보 선택」
         * GA4 28일로 115명 중 46명(40%)만 스크롤한다. 스크롤한 사람에게 같은 말을 두 번 하는 건 낭비다.
         *
         * 겹치지 않는 것은 **「광고비로 순서가 안 바뀝니다」 하나뿐**이라 이 줄로 남긴다.
         * 히어로 CTA 밑 주석이 *"중립성 주장은 아래 설명 자리에 남아 있다"* 고 이 자리를 가리킨다 —
         * **여기를 지우면 그 주장이 사이트에서 사라진다.**
         */}
        <p className="mt-6 text-center text-sm text-gray-500">
          <strong className="font-semibold text-gray-700">광고비로 순서가 바뀌지 않습니다.</strong>{" "}
          브랜드가 아니라 입력한 내 데이터로만 골라요.
        </p>
      </section>

      {/* 마무리 CTA */}
      <section className="bg-emerald-600">
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">어떤 신발이 맞는지 모르겠다면</h2>
          <p className="text-emerald-50 mb-6">질문 8개에 답하면 신발 3개를 골라드려요. 근거가 있는 것과 사이트 기준인 것은 결과에서 나눠 보여드려요.</p>
          <Link
            href="/shoe-finder"
            className="inline-block bg-white text-emerald-700 font-semibold px-8 py-4 rounded-xl hover:bg-emerald-50 transition-colors"
          >
            나에게 맞는 신발 찾기 →
          </Link>
        </div>
      </section>
    </main>
  );
}
