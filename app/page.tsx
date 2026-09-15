import Link from "next/link";
import HomeCommunitySection from "@/components/HomeCommunitySection";
import HeroBackdrop from "@/components/HeroBackdrop";
import ShoeStrip, { type StripShoe } from "@/components/ShoeStrip";
import QuickAnswers from "@/components/QuickAnswers";
import { SHOES } from "@/lib/shoes/data";
import { upcomingRaces, daysUntil, distanceLabel } from "@/lib/races";

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
  // 대회는 서버에서 센다. 개수를 손으로 적으면 대회가 하나 지날 때마다 틀린 숫자가 된다.
  const upcoming = upcomingRaces();
  const nextRaces = upcoming.slice(0, 3);

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
        {/**
         * 히어로 CTA는 **하나**다 — 2026-09-15에 둘에서 되돌렸다.
         *
         * 9/14에 「그냥 둘러볼게요」(→ `#shoes`)를 나란히 뒀다. 근거는 벤치마킹이었다 —
         * 추천 서비스 14곳 중 13곳이 퀴즈를 건너뛰는 경로를 첫 화면에 둔다.
         * 그 관찰 자체는 지금도 맞다.
         *
         * **틀린 것은 같은 날 신발 띠를 「답 바로가기」 위로 올린 것과 겹쳤다는 점이다.**
         * 그래서 버튼이 내려보내는 자리가 바로 200px 아래가 됐다 — 버튼이 스크롤 한
         * 칸을 대신하는 꼴이었다. 둘 중 하나만 했어야 하는데 둘 다 해서 4일 만에 뺐다.
         *
         * 건너뛰는 경로가 없어진 게 아니다 — **신발 띠가 히어로 바로 밑이고**, 그게 본체다.
         *
         * 대가: 9/28 판정에서 「두 번째 버튼이 폼을 갉아먹었는지」는 **판정 불가**가 됐다.
         * (`유입_설정_기준선.md §4-7`). 남는 건 신발 띠 위치 + 폼 첫 문항의 합산 효과뿐이다.
         */}
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

            사이트에서 사라지는 건 아니다 — 「어떻게 추천하나요?」 섹션 끝줄에 "광고비로 순서가
            바뀌지 않습니다"가 남아 있고, 거기는 **설명하는 자리**라 제자리다.
            (2026-09-15에 3분할 카드를 그 섹션에 합치면서 그 줄도 같이 옮겼다.)
            대신 포기하는 것: 첫 화면만 보고 이탈하는 사람은 이 주장을 못 본다.
            네이버 유입 76%에 평균 참여 19~48초라 그 비중이 작지 않다. */}
        {/* 배경 산책로 띠와 겹치는 자리라 gray-400은 안 읽혔다. 한 단계 진하게. */}
        <p className="mt-4 text-xs font-medium text-gray-500">가입 없이 무료</p>
        </section>
      </div>

      {/**
       * 순서를 바꿨다 (2026-09-14): 신발 띠를 「답 바로가기」 **위로** 올렸다.
       *
       * 이유 둘.
       *   ① GA4 28일 — `scroll` 이 115명 중 46명(40%)이다. **60%는 스크롤을 안 한다.**
       *      그런데 1280×800 실측에서 **첫 화면 안에 신발 카드가 0장**이었다(800px 아래).
       *      `home_shoe_click` 0건은 "안 눌렀다"가 아니라 **볼 기회가 없었다**일 수 있다.
       *   ② 추천 서비스 14곳 중 11곳이 상품·카테고리를 퀴즈보다 먼저 보여준다.
       *
       * 「답 바로가기」는 9/12에 만들었고 이틀간 `quick_answer_click` **0건**이다.
       * 표본이 작아 실패로 단정하진 않지만, 신발 띠보다 먼저 놓을 근거는 없다.
       *
       * `id="shoes"` 는 히어로의 「그냥 둘러볼게요」가 내려오던 자리다. 그 버튼은
       * 2026-09-15에 뺐지만(바로 이 띠가 200px 아래라 무의미했다) 앵커는 남겨 둔다 —
       * 다른 곳에서 쓸 수 있고 해가 없다.
       */}
      <div id="shoes" className="scroll-mt-16">
        <ShoeStrip shoes={STRIP_SHOES} />
      </div>

      {/* 답 바로가기 — 신발 띠 밑.
          2026-09-12: 네이버 유입 검색어의 73%가 브랜드 비교, 33%가 발 조건인데
          홈 첫 화면에 그 입구가 하나도 없었다. 유일한 행동이 **폼 작성**이었다.
          자세한 경위는 components/QuickAnswers.tsx 주석에. */}
      <QuickAnswers />

      {/**
       * 다가오는 대회 (2026-09-15)
       *
       * `lib/races.json` 에 55건이 있고 `/races` 가 완성돼 있었는데 **헤더에도 홈에도
       * 입구가 없었다.** URL 을 직접 치지 않으면 아무도 볼 수 없는 상태로 3일 있었다.
       *
       * 홈에는 **3개만** 싣는다. 이미 섹션이 8개고 60%는 스크롤을 안 한다 —
       * 목록을 통째로 넣으면 그만큼 아래가 더 안 읽힌다.
       *
       * 카드는 외부 접수처가 아니라 `/races` 로 보낸다. 출처가 공식인지 모음(KorMarathon)
       * 인지는 그 페이지에서 버튼 글자로 구분해 보여주는데, 홈에는 그 표시가 없다.
       * **출처 구분 없이 밖으로 내보내지 않는다.**
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
                  <Link
                    href="/races"
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
                        /* 날짜를 모르면 모른다고 쓴다. /races 와 같은 규칙이다. */
                        <span className="text-amber-700">날짜 미정</span>
                      )}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {r.region}
                      <span className="mx-1.5 text-gray-300">·</span>
                      {r.distancesKm.map(distanceLabel).join(" / ")}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">어떻게 추천하나요?</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { n: "1", t: "내 정보 선택", d: "키·체중·발볼·발 타입을 버튼으로 고르면 끝. 숫자 입력 없이 1분." },
            { n: "2", t: "맞춤 추천 3개", d: "수십 개 모델 중 내 체형 조건을 통과한 신발만 골라드려요." },
            { n: "3", t: "부상 예방까지", d: "무릎·발목·아킬레스건 — 증상별 대처법을 추천과 함께 연결해드려요." },
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
