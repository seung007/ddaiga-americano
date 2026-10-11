import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import InlineAsk from "@/components/InlineAsk";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ShareButtons from "@/components/ShareButtons";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import { Up, S } from "@/components/guide/Up";
import type { Metadata } from "next";

/**
 * 2026-10-08 재검증 — PubMed 초록과 대조
 *   · ⚠️ 「달리고 바로 앉거나 누우면 혈액이 다리에 몰린 상태가 유지된다」 → **반대.** 달리기를 멈춘 뒤
 *     다리에 피가 고여 생기는 일시적 저혈압이 원인이고, 처치는 누워서 다리를 높이는 것(Asplund 2011, Speedy 2003).
 *     메타 설명·본문·FAQ 전부 「멈춰 서 있으면 어지러울 수 있다, 어지러우면 누워서 다리를 올려라」로 바꿨다.
 *   · 「바로 멈추면 회복이 늦어질 수 있다」 → 반대(Van Hooren 2018: 능동 쿨다운은 회복 지표 대부분을 개선 못 함). 삭제
 *   · 제목·h1·메타의 「꼭 해야 할」 → 반대(Afonso 2021: 운동 후 스트레칭 vs 휴식, 근력 회복·근육통 차이 없음). 제거
 *   · 정적 스트레칭의 목적 「굳은 근육 풀고 회복」 「근육 이완」 → 유연성 유지로 낮춤
 *   · 러닝화 수명 500~800km → 연구로 정해진 교체 기준 아님. Cook 1985(실착 500마일에 충격흡수 약 70%) 범위로
 *   · rest-day 링크 문구 「완전히 눕는 것보다 나은 것」 → 그 페이지 결론(차이 확인 안 됨)과 반대라 고침
 *   · 정운경 하이닥 기사는 이번 재검증에서 열람하지 못했다. 인용은 「병행 권고」까지만 남긴다.
 */
const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/cooldown";
const TITLE = "달리기 후 10분 정적 스트레칭 루틴";
const DESC =
  "종아리·햄스트링·엉덩이 정적 스트레칭 루틴. 달리고 멈춰 서 있으면 왜 어지러울 수 있는지, 스트레칭이 회복에 어디까지 도움이 되는지 정리했습니다.";

export const metadata: Metadata = {
  title: "달리기 후 10분 정적 스트레칭 루틴 — 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/cooldown" },
};

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["쿨다운", "/injury/cooldown"],
        ]}
      />
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 러닝 가이드
        </Link>
        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full mb-3">쿨다운</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">달리기 후 10분 정적 스트레칭 루틴</h1>
          {/* 규약은 app/injury/page.tsx 상단 주석 */}
          <p className="text-gray-500 text-sm mb-4">6분 읽기</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            협찬 없이 작성 — 연구로 확인된 것과 경험칙을 구분해 적었습니다
          </div>
        </header>
        {/**
         * 먼저 결론 + 동적/정적 구분 (2026-09-14 추가)
         *
         * 이 페이지가 받는 검색어: 「정적 스트레칭」 63노출 1클릭(1.6%),
         * 「달리기 후 스트레칭」 23노출 2클릭(8.7%).
         * 그 검색어를 치는 사람의 진짜 질문은 **"언제 뭘 하냐"** 이다.
         */}
        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">먼저 결론</p>
          <p className="mt-2 leading-relaxed text-emerald-900">
            <strong>달리기 전에는 동적, 달리고 나서는 정적</strong>이 흔한 권고입니다. 아래 인용한 운동전문가(정운경)도
            둘 중 하나를 고르는 게 아니라 <strong>병행</strong>하라고 말합니다.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-800">
            다만 <strong>달린 뒤 스트레칭이 회복을 앞당긴다는 근거는 확인되지 않았습니다.</strong> 운동 후 스트레칭과
            그냥 쉬기를 비교한 무작위 시험 10편(229명, 주로 17~38세 남성)을 모은 분석에서 근력 회복과 24~72시간 뒤
            근육통 모두 차이가 없었습니다.{" "}
            <S>(Afonso et al. (2021) <Up h="https://pubmed.ncbi.nlm.nih.gov/34025459/" />)</S>{" "}
            달린 뒤 정적 스트레칭은 유연성을 유지하려는 목적으로 하세요.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-800">
            정적 스트레칭은 <strong>한 자세로 멈춰서 30초 버티는 것</strong>입니다.
            반동을 주거나 통증이 올 때까지 밀지 마세요 — 당기는 느낌에서 멈춥니다.
          </p>
        </div>

        <p className="text-lg leading-relaxed mb-8 text-gray-700">
          달리다 갑자기 멈춰 서 있으면 혈액이 다리에 머물러 어지러울 수 있습니다.{" "}
          <strong>어지러우면 누워서 다리를 올리세요.</strong>{" "}
          <S>(Asplund et al. (2011) <Up h="https://pubmed.ncbi.nlm.nih.gov/21948122/" />)</S>{" "}
          가볍게 걸으며 마무리하면 심박과 호흡이 더 빨리 돌아올 수 있지만, 이것이 어지럼을 막는지는 확인되지 않았습니다.{" "}
          <S>(Van Hooren &amp; Peake (2018) <Up h="https://pubmed.ncbi.nlm.nih.gov/29663142/" />)</S>{" "}
          스트레칭이 다음 날 근육통을 줄인다는 근거도 약합니다 — 코크란 리뷰는 의미 있는 감소를 찾지 못했습니다.{" "}
          <S>(Herbert et al. (2011) <Up h="https://pubmed.ncbi.nlm.nih.gov/21735398/" />)</S>
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">동적 스트레칭과 정적 스트레칭, 뭐가 다른가요</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-900"></th>
                  <th className="py-2 pr-3 font-semibold text-gray-900">동적 스트레칭</th>
                  <th className="py-2 font-semibold text-gray-900">정적 스트레칭</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-3 font-medium text-gray-900">언제</td>
                  <td className="py-2 pr-3"><strong>달리기 전</strong></td>
                  <td className="py-2"><strong>달리고 나서</strong></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-3 font-medium text-gray-900">어떻게</td>
                  <td className="py-2 pr-3">움직이면서</td>
                  <td className="py-2">멈춰서 30초 버티기</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-3 font-medium text-gray-900">예</td>
                  <td className="py-2 pr-3">다리 흔들기, 무릎 높이 들기</td>
                  <td className="py-2">종아리 벽 스트레칭</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-medium text-gray-900">목적</td>
                  <td className="py-2 pr-3">몸을 데워 달릴 준비</td>
                  <td className="py-2">유연성 유지(회복 효과는 확인 안 됨)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            달리기 <strong>전</strong>에 할 동작은{" "}
            <Link href="/injury/warmup" className="font-medium text-emerald-600 hover:underline">
              준비운동 글
            </Link>
            에 도식과 함께 정리해 뒀습니다. 이 글은 <strong>달리고 나서</strong> 하는 쪽입니다.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">쿨다운으로 기대할 수 있는 것</h2>
          <p className="leading-relaxed text-gray-700 mb-3">
            장거리 대회를 마친 직후 쓰러지는 경우의 대부분은 달리기를 멈춘 뒤 다리에 혈액이 고여 생기는 일시적
            저혈압으로 설명됩니다. 대처는 <strong>누워서 다리를 높이는 것</strong>이고, 같은 리뷰는 물 마시기도 처치에 넣습니다 — 단
            생명을 위협하는 다른 원인, 특히 <strong>운동 관련 저나트륨혈증을 먼저 배제한 뒤</strong>입니다.{" "}
            <S>(Asplund et al. (2011) <Up h="https://pubmed.ncbi.nlm.nih.gov/21948122/" />)</S>{" "}
            장거리를 달린 뒤 <strong>두통·구토·혼란·손발 부기</strong>가 있으면 물을 더 마시지 말고 119(대회라면 의료진)를 부르세요 —{" "}
            <Link href="/injury/half-marathon-race-day" className="text-emerald-700 underline">저나트륨혈증 신호</Link>. 그 밖에는 멈춰 서
            있기보다 걸으며 마무리하고(경험칙), 어지러우면 바로 누우세요. 결승선에서 의식을 잃었거나 달리는 도중에 쓰러졌다면 다른
            원인일 수 있으니 바로 119를 부르세요.{" "}
            <S>(Speedy et al. (2003) <Up h="https://pubmed.ncbi.nlm.nih.gov/20086459/" />)</S>
          </p>
          <p className="leading-relaxed text-gray-700">
            걷기 같은 가벼운 쿨다운은 혈중 젖산을 더 빨리 낮추고 심혈관 회복을 앞당길 수 있습니다. 하지만 같은 리뷰는
            쿨다운이 부상을 막거나 근육통을 줄이지는 않는 것으로 보고, 어지럼·실신을 막는지는 알 수 없다고 정리합니다.{" "}
            <S>(Van Hooren &amp; Peake (2018) <Up h="https://pubmed.ncbi.nlm.nih.gov/29663142/" />)</S>
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">10분 정적 스트레칭 루틴</h2>
          {/**
           * 2026-09-13 — 문단 하나였던 것을 목록으로 쪼갰다. 네이버 유입의 79.55%가 모바일이다.
           * 2026-09-14 — 이름만 있던 5개에 **하는 법**을 넣었다(`/injury/achilles` 형식).
           */}
          <div className="space-y-3">
            {[
              {
                n: "1",
                name: "종아리 벽 스트레칭",
                how: "벽에 손을 짚고 한 발을 뒤로 뺍니다. 뒤쪽 발 뒤꿈치를 바닥에 완전히 붙인 채 앞쪽 무릎을 굽힙니다.",
                feel: "종아리 뒤쪽이 당기면 맞습니다",
              },
              {
                n: "2",
                name: "햄스트링",
                how: "한 발을 앞으로 내밀고 뒤꿈치만 바닥에 댑니다. 발끝은 위로. 엉덩이를 뒤로 빼면서 상체를 천천히 숙입니다.",
                feel: "허벅지 뒤쪽이 당기면 맞습니다",
              },
              {
                n: "3",
                name: "고관절 굴근",
                how: "한 발을 크게 앞으로 내딛고 뒤쪽 무릎을 바닥에 댑니다. 상체를 세운 채 골반만 앞으로 밉니다.",
                feel: "뒤쪽 다리의 사타구니·허벅지 앞이 당기면 맞습니다",
              },
              {
                n: "4",
                name: "장경인대",
                how: "선 자세에서 늘릴 쪽 다리를 반대쪽 다리 뒤로 교차시킵니다. 그대로 상체를 반대 방향으로 기울입니다.",
                feel: "허벅지 바깥쪽에서 무릎까지 이어지는 선이 당기면 맞습니다",
              },
              {
                n: "5",
                name: "엉덩이",
                how: "등을 대고 누워 한쪽 무릎을 두 손으로 가슴 쪽으로 당깁니다. 반대쪽 다리는 바닥에 붙여 둡니다.",
                feel: "엉덩이 뒤쪽이 당기면 맞습니다",
              },
            ].map((s) => (
              <div key={s.n} className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-gray-400">{s.n}</span>
                  <h3 className="font-bold text-gray-900">{s.name}</h3>
                  <span className="ml-auto shrink-0 text-sm font-semibold text-emerald-700">30초 × 2</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{s.how}</p>
                <p className="mt-1 text-sm text-gray-500">{s.feel}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 leading-relaxed text-gray-700">
            <strong>통증이 아닌 당기는 느낌에서 멈추세요.</strong> 반동을 주며 튕기지 말고,
            30초 동안 같은 자세를 유지합니다. 양쪽 다 합니다.
          </p>
        </section>

        <FinderCta from="cooldown" variant="inline" headline="쿠션이 닳은 신발은 스트레칭으로 못 메웁니다 — 흔히 500~800km를 교체 시점으로 말하지만, 연구로 정해진 기준은 아닙니다." />
        <p className="mb-8 text-sm leading-relaxed text-gray-500">
          1985년 실험에서 러너들이 실제로 신은 신발은 500마일(약 800km)에 처음 충격흡수 능력의 약 70%가 남아 있었습니다.{" "}
          <S>(Cook et al. (1985) <Up h="https://pubmed.ncbi.nlm.nih.gov/4025676/" />)</S>{" "}
          쿠션이 줄어드는 정도를 잰 연구이고, 언제 바꿔야 하는지나 부상과의 관계를 정한 연구는 아닙니다.
        </p>
        <section className="mb-8">
          {/* ⚠️ 2026-09-14: "섭취하면 근육 회복 속도가 빨라집니다" 였다. 받치던 인용이 무관한 논문으로 판명돼
              내려간 뒤 근거 없이 단정만 남아 있었다. */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">회복에 도움이 된다고 이야기되는 것</h2>
          <p className="leading-relaxed text-gray-700">
            운동 뒤 단백질과 탄수화물을 같이 먹는 것, 그리고 충분히 자는 것이 흔히 권해집니다.
            다만 <strong>이 글에는 그 효과를 받치는 인용이 없습니다</strong> — 예전에 달았던 자료가
            무관한 논문으로 판명돼 내렸고, 아직 대체하지 못했습니다.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Asplund et al. (2011)</strong> — 운동 직후 쓰러짐(EAC) 근거 리뷰. 멈춘 뒤 다리 혈액 저류로 인한 일시적 저혈압, 처치는 다리를 높인 자세와 경구 수분. 지구력 대회 결승선 상황. Br J Sports Med 45(14):1157-62. <a href="https://pubmed.ncbi.nlm.nih.gov/21948122/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Speedy et al. (2003)</strong> — 운동 직후 쓰러짐은 근육 펌프 중단에 따른 기립성 저혈압, 처치는 다리·골반 올리기. 경기 중 쓰러짐은 다른 원인 의심. <a href="https://pubmed.ncbi.nlm.nih.gov/20086459/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Van Hooren &amp; Peake (2018)</strong> — 쿨다운 서술적 리뷰. 부상 예방 안 됨, 근육통 감소 없음, 혈중 젖산·심혈관 회복은 빠를 수 있음, 실신 예방 여부는 모름. Sports Med 48(7):1575-95. <a href="https://pubmed.ncbi.nlm.nih.gov/29663142/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Afonso et al. (2021)</strong> — 운동 후 스트레칭 vs 휴식 RCT 메타분석(10편, 229명). 근력 회복 ES −0.08, 24~72시간 근육통 차이 없음, 근거 확신도 매우 낮음. <a href="https://pubmed.ncbi.nlm.nih.gov/34025459/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            {/* 2026-10-06: 본문이 「다음 날의 근육통을 줄입니다」라고 단정했는데, 이 주제의 코크란 리뷰는
                반대 결론이다. PubMed 초록(PMID 21735398) 직접 확인. */}
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Herbert et al. (2011)</strong> — 코크란 리뷰. 운동 전·후 스트레칭은 지연성 근육통을 임상적으로 의미 있게 줄이지 않음(운동 후 스트레칭: 다음 날 100점 척도에서 평균 약 1점 차이). Cochrane Database Syst Rev (7):CD004577. <a href="https://pubmed.ncbi.nlm.nih.gov/21735398/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Cook et al. (1985)</strong> — 러닝화 충격흡수의 거리별 변화. 기계 시험 250~500마일에서 처음의 60% 미만, 실착 500마일에서 약 70%. Am J Sports Med 13(4):248-53. <a href="https://pubmed.ncbi.nlm.nih.gov/4025676/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            {/* 2026-09-15: nsca.com 루트 링크 자리를 한국어 전문가 자료로 채웠다. 2026-10-08 재검증에서는 열람하지 못했다. */}
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://news.hidoc.co.kr/news/articleView.html?idxno=43866" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                정운경 (힐리언스 코어센터 운동전문가) — 운동 전에는 동적, 운동 후에는 정적. 둘 중 하나가 아니라 병행. 하이닥 ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><span className="text-gray-500">운동 후 회복 영양 자료 — 검증기가 무관한 논문을 가리키는 것을 확인해 링크를 내렸습니다 (2026-08-31)</span></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><span className="text-gray-500">정적 스트레칭 관련 자료 1건 — 걸려 있던 링크가 특정 논문이 아니라 단체 홈페이지 주소여서 내렸습니다 (2026-09-14)</span></li>
          </ul>
          <p className="mt-3 text-xs text-gray-400">추천 순서는 광고비로 바뀌지 않습니다. 논문 6건과 전문가 기사 1건을 참고했습니다. 스트레칭 동작과 시간(30초 × 2)은 통용 관행입니다.</p>
        </section>

        <YoutubeSection links={[
          { label: "러닝 후 쿨다운 스트레칭, 5분만 투자하세요 #초보러너", channel: "달려라하나", url: "https://www.youtube.com/watch?v=4Vbiu6RdpkE" },
          { label: "5분만에 끝나는 러닝 후 스트레칭", channel: "지니코치", url: "https://www.youtube.com/watch?v=bsWU6ata_tw" },
          { label: "러닝 스트레칭 종결 l 달리기 전후 제발 5분씩만 따라하세요", channel: "부부물리치료사", url: "https://www.youtube.com/watch?v=qoPyfVxqpQc" },
        ]} />

        <FaqSection items={[
          {
            q: "달리고 나서 바로 앉거나 누우면 안 되나요?",
            a: "앉거나 눕는 것 자체가 문제는 아닙니다. 오래 달리다 갑자기 멈춰 서 있으면 혈액이 다리에 머물러 어지러울 수 있는데, 그럴 땐 오히려 누워서 다리를 올리는 것이 대처법입니다(Asplund 2011). 바로 멈추기보다 가볍게 걸으며 마무리하면 심박과 호흡이 더 빨리 돌아올 수 있지만, 이것이 어지럼을 막는지는 확인되지 않았습니다(Van Hooren 2018). 달리는 도중에 쓰러졌거나 의식이 흐리면 119를 부르세요. 장거리 후 두통·구토·혼란이 있으면 물을 더 마시지 마세요(저나트륨혈증 가능성).",
          },
          {
            q: "쿨다운 정적 스트레칭은 어떤 순서로 하나요?",
            a: "① 종아리 벽 스트레칭 → ② 햄스트링(서서 앞으로 굽히기) → ③ 고관절 굴근(런지 자세) → ④ 장경인대(다리 꼬아 옆으로 기울기) → ⑤ 엉덩이(누워서 무릎 당기기), 각 30초씩 2회. 통증이 아니라 당기는 느낌에서 멈추세요. 순서와 시간은 통용 관행이고, 이 루틴이 회복을 앞당긴다는 근거는 확인되지 않았습니다.",
          },
          {
            q: "회복을 더 빠르게 하려면 뭘 하면 되나요?",
            a: "운동 뒤 단백질과 탄수화물을 같이 먹고 충분히 자는 것이 흔히 권해집니다. 다만 이 글에는 그 효과를 받치는 인용이 없습니다 — 예전에 달았던 자료가 무관한 논문으로 판명돼 내렸습니다. 운동 후 스트레칭은 그냥 쉬는 것과 비교해 회복 차이가 확인되지 않았습니다(Afonso 2021).",
          },
        ]} />

        {/* 다음에 읽을 것 — 세 번째 시험. from=cooldown 으로 계측된다. */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">다음에 읽을 것</h2>
          <div className="space-y-2">
            <Link
              href="/injury/warmup"
              className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              <p className="font-semibold text-gray-900 text-sm">달리기 전 준비운동 — 동적 스트레칭 →</p>
              <p className="mt-1 text-sm text-gray-600">이 글의 반대편. 도식으로 동작을 볼 수 있습니다.</p>
            </Link>
            <Link
              href="/injury/rest-day"
              className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              <p className="font-semibold text-gray-900 text-sm">휴식일에 뭘 해야 할까? 액티브 리커버리 →</p>
              <p className="mt-1 text-sm text-gray-600">쉬는 날 가볍게 움직여도 되는지, 근거는 어디까지인지.</p>
            </Link>
          </div>
        </section>

        <p className="text-xs text-gray-400 mb-4">※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 통증이 지속되면 전문의 상담을 권장합니다.</p>

        {/* 2026-09-06: 글 안에서 바로 묻게 한다. /community 로 보내면 두 달간 질문 0건이었다. */}
        <InlineAsk from="cooldown" tag="기타" placeholder="예) 쿨다운을 얼마나 해야 하는지 매번 헷갈려요" />

        <FinderCta from="cooldown" headline="신발 교체 시기가 됐다면" sub="체형·발볼·부상 이력을 넣으면 지금 발에 맞는 신발을 추려드립니다." />
        <ShareButtons from="cooldown" title="달리기 후 쿨다운" description="쿨다운 루틴과, 그 효과에 대해 연구가 실제로 말하는 것을 정리했습니다." />

      </article>
    </>
  );
}
