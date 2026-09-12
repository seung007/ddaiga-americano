import Link from "next/link";
import HomeCommunitySection from "@/components/HomeCommunitySection";
import HeroBackdrop from "@/components/HeroBackdrop";
import ShoeStrip, { type StripShoe } from "@/components/ShoeStrip";
import QuickAnswers from "@/components/QuickAnswers";
import { SHOES } from "@/lib/shoes/data";

/**
 * 띠에 실을 신발 — 서버에서 골라 최소 필드만 넘긴다.
 *
 * **단종된 것은 뺀다.** 첫 화면에서 "후속작 나옴" 안내를 보여줄 이유가 없다.
 * 그리고 **여성 전용 중복 모델도 뺀다** — 같은 신발이 두 번 지나가면 종류가 적어 보인다.
 * (남녀 모두에게 필요한 정보는 finder가 성별을 받아 처리한다.)
 *
 * 이미지 40장이 경쟁사 CDN이라(`check:images`) 홈에 의존을 무한정 얹지 않는다.
 * 지금은 단종 아닌 것 전부이고, 그게 커지면 여기서 잘라야 한다.
 */
const STRIP_SHOES: StripShoe[] = SHOES.filter((s) => !s.successor && s.gender !== "female").map(
  (s) => ({
    id: s.id,
    brand: s.brand,
    model: s.model,
    imageUrl: s.imageUrl,
    cushioning: s.cushioning,
    weightGramsM9: s.weightGramsM9,
    priceKrw: s.priceKrw,
    tagline: s.blurb,
    uses: s.uses,
    widthOptions: s.widthOptions,
    hasCarbon: !!s.hasCarbon,
  })
);

// 사전 렌더링된 인기 비교 페어 (app/compare/[slug] generateStaticParams와 일치)
const POPULAR_COMPARES = [
  { slug: "hoka-clifton-10-vs-brooks-ghost-17", label: "호카 클리프턴 10", vs: "브룩스 고스트 17" },
  { slug: "nike-pegasus-42-vs-hoka-clifton-10", label: "나이키 페가수스 42", vs: "호카 클리프턴 10" },
  { slug: "asics-gel-nimbus-27-vs-hoka-bondi-9", label: "아식스 님버스 27", vs: "호카 본디 9" },
  { slug: "brooks-adrenaline-gts-25-vs-nb-860-v15", label: "브룩스 아드레날린 25", vs: "뉴발란스 860 v15" },
];

const LEVEL_GUIDES = [
  { href: "/injury/beginner-guide", label: "입문 (0~6개월)" },
  { href: "/injury/intermediate-guide", label: "중급 (6~24개월)" },
  { href: "/injury/advanced-guide", label: "숙련 (2년+)" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero
          2026-09-03: 배경이 비어 보인다는 지적으로 HeroBackdrop을 넣었다.
          바깥에 relative + overflow-hidden을 두어 배경을 화면 전체 폭으로 깔고,
          안쪽 콘텐츠는 기존대로 max-w-3xl 가운데 정렬을 유지한다.
          콘텐츠에 relative를 줘야 배경(absolute) 위로 올라온다. */}
      <div className="relative overflow-hidden">
        <HeroBackdrop />
        {/* 2026-09-12: py-20 → py-12(모바일). 히어로가 80px씩 먹어서 바로 밑에 넣은
            「답 바로가기」가 첫 화면 밖으로 밀렸다. 방문자의 80%가 390×812 다.
            데스크톱은 여백이 있어야 읽히므로 sm 이상에서만 py-20 을 유지한다. */}
        <section className="relative max-w-3xl mx-auto px-6 py-12 sm:py-20 text-center">
        {/* 2026-09-03: "광고비로 순서가 바뀌지 않는 데이터 기반 러닝화 추천"에서 바꿨다.
            그 문장에는 문제가 셋 있었다.

            ① **부정문으로 시작했다.** 처음 온 사람은 "광고비? 무슨 광고비?" 하고
               **없던 의심이 생긴다.** 아무도 묻지 않은 것을 첫 줄에서 해명하는 꼴이었다.
            ② **한 화면에 같은 주장이 세 번** 나왔다(아이브로우·서브카피·CTA 밑).
               세 번 반복하면 설득이 아니라 방어로 읽힌다.
            ③ 관형절이 길어 정작 주어("러닝화 추천")가 맨 뒤로 밀렸다.

            중립성 주장은 **CTA 바로 밑 한 곳에만** 남긴다 — 먼저 외치는 자리가 아니라
            버튼을 누를지 망설일 때 받쳐주는 자리다.
            첫 줄은 이 사이트를 누가 왜 만들었는지로 바꾼다. */}
        <p className="text-sm font-medium text-emerald-600 mb-4">러닝을 좋아해서, 건강하게 달리려고 만들었습니다</p>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-5">
          내 발에 맞는 러닝화,<br />데이터로 찾아드려요
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          키·체중·발볼만 고르면 논문 기반 추천이<br />
          내 체형에 맞는 신발 3개를 골라드려요
        </p>
        <Link
          href="/shoe-finder"
          className="inline-block bg-emerald-600 text-white font-medium px-8 py-4 rounded-xl hover:bg-emerald-700 transition-colors"
        >
          내 신발 찾기 시작 →
        </Link>
        {/* 2026-09-03: "· 추천 순서는 광고비로 바뀌지 않습니다"를 뺐다.
            CTA 밑 마이크로카피의 역할은 **누르기를 망설이게 하는 것을 없애는 것**이고,
            그 자리에서 가장 센 건 "가입 없이 무료"다. 중립성은 신뢰 주장이지 장벽 제거가 아니라
            둘을 한 줄에 섞으면 양쪽 다 약해진다.

            사이트에서 사라지는 건 아니다 — 아래 3분할 카드에 "광고비로 순서가 안 바뀝니다"가
            남아 있고, 거기는 **설명하는 자리**라 제자리다.
            대신 포기하는 것: 첫 화면만 보고 이탈하는 사람은 이 주장을 못 본다.
            네이버 유입 76%에 평균 참여 19~48초라 그 비중이 작지 않다. */}
        {/* 배경 산책로 띠와 겹치는 자리라 gray-400은 안 읽혔다. 한 단계 진하게. */}
        <p className="mt-4 text-xs font-medium text-gray-500">가입 없이 무료</p>
        </section>
      </div>

      {/* 답 바로가기 — 히어로 바로 밑.
          2026-09-12: 네이버 유입 검색어의 73%가 브랜드 비교, 33%가 발 조건인데
          홈 첫 화면에 그 입구가 하나도 없었다. 유일한 행동이 **폼 작성**이었다.
          자세한 경위는 components/QuickAnswers.tsx 주석에. */}
      <QuickAnswers />

      {/* 신발 띠 — 답 바로가기 밑.
          2026-09-06: 홈에 신발 사진이 한 장도 없었다. 러닝화 추천 사이트에서.
          "어떻게 추천하나요?"(설명)보다 신발(실물)이 먼저 오는 게 맞다 —
          설명은 볼 것을 본 다음에 읽는다. */}
      <ShoeStrip shoes={STRIP_SHOES} />

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">어떻게 추천하나요?</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { n: "1", t: "내 정보 선택", d: "키·체중·발볼·발 타입을 버튼으로 고르면 끝. 숫자 입력 없이 1분." },
            { n: "2", t: "맞춤 추천 3개", d: "수십 개 모델 중 내 체형 조건을 통과한 신발만 골라드려요." },
            { n: "3", t: "부상 예방까지", d: "내 발 타입에 맞는 부상 예방 가이드를 함께 연결해드려요." },
          ].map((s) => (
            <div key={s.n} className="border border-gray-100 rounded-xl p-5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mb-3">
                {s.n}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{s.t}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature 3-grid */}
      <section className="max-w-3xl mx-auto px-6 pb-16 grid gap-4 md:grid-cols-3">
        {[
          { t: "논문으로 고른 추천", d: "키·체중·발볼·발 타입·성별까지 반영한 논문 기반 추천. 내 몸이 기준이에요." },
          { t: "부상 예방까지 함께", d: "무릎·발목·아킬레스건, 증상별 대처법을 추천과 함께 연결해드려요." },
          { t: "광고비로 순서가 안 바뀝니다", d: "브랜드가 아니라 입력한 내 데이터로만 골라요." },
        ].map((x, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-1">{x.t}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{x.d}</p>
          </div>
        ))}
      </section>

      {/* 인기 러닝화 비교 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">인기 러닝화 비교</h2>
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
                <h2 className="text-xl font-bold text-gray-900">부상 예방 가이드</h2>
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
                    href: "/injury/knee-pain",
                    tag: "무릎",
                    title: "한쪽 무릎만 아픈 이유",
                    desc: "비대칭 통증의 원인과 엉덩이 근육 강화법.",
                  },
                  {
                    href: "/injury/achilles",
                    tag: "아킬레스",
                    title: "미드풋 전환 후 아킬레스건 스트레칭",
                    desc: "주법 바꾼 뒤 종아리·아킬레스가 당긴다면.",
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
                <span className="text-xs text-gray-400">경력별:</span>
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
            </div>

            {/* 커뮤니티 */}
            <HomeCommunitySection />

          </div>
        </div>
      </section>

      {/* 마무리 CTA */}
      <section className="bg-emerald-600">
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">어떤 신발이 맞는지 모르겠다면</h2>
          <p className="text-emerald-50 mb-6">키·체중·발 타입만 고르면 논문 기반 추천이 1분 안에 신발 3개를 골라드려요.</p>
          <Link
            href="/shoe-finder"
            className="inline-block bg-white text-emerald-700 font-semibold px-8 py-4 rounded-xl hover:bg-emerald-50 transition-colors"
          >
            내 발에 맞는 러닝화 찾기 →
          </Link>
        </div>
      </section>
    </main>
  );
}
