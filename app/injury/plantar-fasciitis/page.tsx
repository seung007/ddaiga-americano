import Link from "next/link";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ShareButtons from "@/components/ShareButtons";
import InlineAsk from "@/components/InlineAsk";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Up, S } from "@/components/guide/Up";
import type { Metadata } from "next";

/**
 * 2026-10-07 재검증 — 고친 것
 *   · 「스테로이드 주사 … 지방패드 위축 위험이 보고」: 174명 코호트(Hansen 2018)에서 초음파 유도 주사군의 지방패드 두께는
 *     주사 안 맞은 군과 차이가 없었다. Cochrane(David 2017)은 1개월까지 통증을 약간 줄이고 그 뒤로는 차이가 없었다고 정리한다.
 *   · 「대부분 좋아지지만」: 병원 진단 174명 코호트에서 1년 뒤에도 80.5%, 10년 뒤에도 45.6%가 증상이 있었다. 「대부분」을 뺐다.
 *   · 「2주 해보고 갈아타는 것이 가장 흔한 실수」: 근거 없음. 뺐다.
 *   · 「임상진료지침에서 스트레칭 권고」: 지침(Koc 2023) 초록에 권고 내용이 없고 본문은 열람이 막혀 대조하지 못했다. 단정을 뺐다.
 *   · 「BMI 관련성은 운동하는 사람에게서 약해진다고 알려져」: 출처가 없었다 → van Leeuwen 2016 메타분석으로 출처를 달았다.
 *   · 「훈련량을 갑자기 늘린 경우」: 위험 요인 연구(Riddle 2003)에 없는 항목이라 따로 떼어 표시.
 *   · Nielsen 2014 링크가 journals.plos.org 형식이라 인용 검사기에 안 잡혔다 → PubMed 링크로.
 *   · 메타데이터 canonical·구조화 데이터·목차가 없었다 → 추가.
 *   · Koc 2023 은 DOI 링크로 둔다 — PubMed 저자 표기가 「Koc TA Jr」라 검사기가 「Jr」를 성으로 읽는다.
 */
const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/plantar-fasciitis";
const TITLE = "족저근막염 — 아침 첫발이 아픈 이유와 근거 있는 대처";
const DESC =
  "아침 첫 걸음에 발뒤꿈치가 아프다면. 스트레칭보다 3개월 시점 효과가 컸던 고부하 근력 운동, 주사의 실제 효과, 그리고 생각보다 긴 회복 기간까지 논문 수치로 정리했습니다.";

export const metadata: Metadata = {
  title: "족저근막염 — 아침 첫발이 아픈 이유와 근거 있는 대처 | 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/plantar-fasciitis" },
};

export default function Page() {
  return (
    <>
      {/* 최초 게시일은 저장소 기록으로 확인되지 않아 비워 둔다(지어내지 않는다). */}
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["족저근막염", "/injury/plantar-fasciitis"],
        ]}
      />
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 러닝 가이드
        </Link>

        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full mb-3">부상 부위</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">{TITLE}</h1>
          <p className="text-gray-500 text-sm mb-4">7분 읽기</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            협찬 없이 작성 — 논문 근거와 경험칙을 구분해 적었습니다
          </div>
        </header>

        <p className="text-lg leading-relaxed mb-8 text-gray-700">
          <strong>아침에 일어나 딛는 첫 몇 걸음이 가장 아프고, 걷다 보면 좀 나아졌다가, 오래 서 있거나 많이 걸으면 다시 아파진다</strong> —
          이게 족저근막 통증의 전형적인 패턴입니다. 부상당한 초보 러너 254명 중 약 5%였습니다.{" "}
          <S>(Nielsen et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/24923269/" />)</S>
        </p>

        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">먼저 결론</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-emerald-900">
            <li>오래된 족저근막 통증은 염증보다 <strong>퇴행</strong>에 가깝습니다.</li>
            <li>
              <strong>고부하 근력 운동</strong>(수건 위 한 발 뒤꿈치 들기)이 3개월 시점에 스트레칭보다 기능 점수가 29점 좋았고, 12개월에는 같았습니다.
            </li>
            <li>스테로이드 주사는 1개월까지 통증을 약간 줄였고, 그 뒤로는 차이가 없었습니다.</li>
            <li>
              <strong>오래 갑니다.</strong> 병원에서 진단받은 174명 중 1년 뒤에도 80.5%, 10년 뒤에도 45.6%가 증상이 있었습니다.
            </li>
          </ol>
        </div>

        <TableOfContents
          items={[
            { id: "red-flags", label: "병원에 가야 할 신호" },
            { id: "risk", label: "위험 요인" },
            { id: "what-works", label: "뭘 하면 되나" },
            { id: "injection", label: "주사" },
            { id: "how-long", label: "얼마나 걸리나" },
            { id: "refs", label: "참고 자료" },
          ]}
        />

        <section className="mb-8 p-5 bg-gray-50 rounded-2xl border border-gray-200">
          <h2 className="text-base font-bold text-gray-900 mb-2">이름부터 — &lsquo;염&rsquo;이 아닙니다</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            흔히 &lsquo;족저근막<strong>염</strong>&rsquo;이라고 부르지만, 만성 족저근막염으로 수술한 50례의 조직을 본 연구에서는 염증 없이
            근막이 조각나고 퇴행한 변화가 관찰됐습니다.{" "}
            <S>(Lemont et al. (2003) <Up h="https://pubmed.ncbi.nlm.nih.gov/12756315/" />)</S>{" "}
            수술까지 간 만성 사례라는 점은 감안해야 합니다. 그래서 최근 문헌은 <em>plantar fasciopathy</em>(족저근막병증) 또는 <em>plantar heel pain</em>(발뒤꿈치 통증)이라는
            이름을 씁니다. 소염 치료만으로 해결되지 않는 경우가 많은 이유를 설명해 줍니다.
          </p>
        </section>

        {/* 안전 정보를 위쪽에 둔다 */}
        <section className="mb-8 p-5 bg-red-50 rounded-2xl border border-red-200">
          <h2 id="red-flags" className="text-lg font-bold text-red-900 mb-3">병원에 가야 할 신호</h2>
          <p className="text-sm text-red-900 leading-relaxed mb-3">
            발뒤꿈치 통증이 전부 족저근막 문제는 아닙니다. 아래는 다른 원인을 의심해야 하는 경우입니다.
          </p>
          <ul className="text-sm text-red-900 space-y-2">
            <li>• <strong>양쪽 발뒤꿈치가 동시에</strong> 아프다 — 특히 젊은 사람이라면 전신 염증성 관절질환 가능성이 있습니다</li>
            <li>• <strong>저리거나 타는 듯한 느낌</strong>, 발바닥 감각 이상 — 신경 눌림일 수 있습니다</li>
            <li>• 뒤꿈치를 <strong>양옆에서 눌렀을 때</strong> 아프다, 또는 쉬어도 계속 아프다 — 종골 피로골절 가능성</li>
            <li>• 다치고 나서 갑자기 시작됐다, 또는 &lsquo;퍽&rsquo; 하는 느낌 뒤에 시작됐다</li>
            <li>• 발열, 발적, 부종이 같이 있다</li>
          </ul>
          <p className="text-xs text-red-700 mt-3 leading-relaxed">위 신호는 이 사이트가 정리한 것이며 진단이 아닙니다. 주사에 대해서는 아래 「주사」 절을 보세요.</p>
        </section>

        <section className="mb-8">
          <h2 id="risk" className="text-xl font-bold text-gray-900 mb-4">위험 요인</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            일반 환자 50명과 대조군을 비교한 연구에서 나온 수치입니다.{" "}
            <S>(Riddle et al. (2003) <Up h="https://pubmed.ncbi.nlm.nih.gov/12728038/" />)</S>
          </p>
          <ul className="mt-2 text-sm text-gray-700 space-y-2">
            <li>
              • <strong>발목이 잘 안 꺾임(발등쪽 굽힘 제한)</strong> — 무릎을 편 상태에서 0도 이하인 사람은 10도 넘는 사람 대비 오즈비{" "}
              <strong>23.3</strong>(95% CI 4.3~124.4). 신뢰구간이 매우 넓습니다
            </li>
            <li>• <strong>BMI 30 초과</strong> — 25 이하 대비 오즈비 5.6 (95% CI 1.9~16.6)</li>
            <li>• <strong>하루 대부분을 서서 일함</strong> — 오즈비 3.6 (95% CI 1.3~10.1)</li>
          </ul>
          <p className="text-sm text-gray-600 mt-3 leading-relaxed">
            51개 연구 메타분석에서 일관되게 확인된 임상 요인은 <strong>높은 BMI(27 초과, 오즈비 3.7)</strong>뿐이었고, 그 관련은 운동하지 않는 사람에게서
            가장 강했습니다. 발·발목 기능 측정치가 원인이라는 통념에 대한 근거는 부족했습니다.{" "}
            <S>(van Leeuwen et al. (2016) <Up h="https://pubmed.ncbi.nlm.nih.gov/26644427/" />)</S>
          </p>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            훈련량을 갑자기 늘리는 것은 족저근막만 따로 본 근거는 없지만, 과사용 부상 전반의 위험 신호입니다 →{" "}
            <Link href="/injury/start-running#long-day" className="text-emerald-700 underline">한 번에 길게 뛰는 날</Link>
          </p>
        </section>

        <section className="mb-8">
          <h2 id="what-works" className="text-xl font-bold text-gray-900 mb-4">뭘 하면 되나</h2>
          <p className="leading-relaxed text-gray-700 mb-3">
            <strong>고부하 근력 운동.</strong> 초음파로 확인된 족저근막염 환자 48명을 무작위로 나눠, 깔창 + 매일 족저근막 스트레칭 그룹과 깔창 +{" "}
            <strong>이틀에 한 번 고부하 근력 운동</strong> 그룹을 비교했습니다. 3개월 시점 발 기능 지수(FFI)가 근력 그룹에서 29점 더 좋았고, 1·6·12개월
            시점에는 차이가 없었습니다.{" "}
            <S>(Rathleff et al. (2015) <Up h="https://pubmed.ncbi.nlm.nih.gov/25145882/" />)</S>{" "}
            방법은 <strong>발가락 밑에 수건을 말아 넣고 한 발로 뒤꿈치 들기</strong>를 천천히 반복하는 것입니다. 회복을 앞당길 수 있지만 최종
            결과를 바꾸지는 않았습니다.
          </p>
          <p className="leading-relaxed text-gray-700 mb-3">
            <strong>스트레칭.</strong> 족저근막·종아리 스트레칭은 흔히 권고되고, 위 연구에서도 스트레칭 그룹이 12개월에는 근력 그룹과 같은 수준으로
            좋아졌습니다. 미국 물리치료학회 임상진료지침(2023 개정)이 있지만 권고 등급 본문은 열람이 막혀 이 사이트가 대조하지 못했습니다.
          </p>
          <p className="leading-relaxed text-gray-700">
            <strong>계속 뛰어도 되나?</strong> 족저근막만 따로 시험한 연구는 찾지 못했습니다. 통증 점수를 기준으로 거리를 조절하는 방법은{" "}
            <Link href="/injury/return-to-running#rest-or-run" className="text-emerald-700 underline">부상 후 복귀 글</Link>에 있습니다(힘줄 연구에서 온
            모델). &ldquo;족저근막염에 좋은 신발&rdquo;에 대해서는 — 특정 드롭이나 쿠셔닝이 족저근막 통증을 낫게 한다는 <strong>좋은 근거는
            없습니다.</strong> 편한 신발이 통증 관리에 도움이 될 수는 있지만 치료는 아닙니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 id="injection" className="text-xl font-bold text-gray-900 mb-4">주사</h2>
          <p className="leading-relaxed text-gray-700">
            무작위 시험 39편(2,492명)을 모은 코크런 리뷰에서 스테로이드 주사는 위약·무치료보다 <strong>1개월까지 통증을 약간</strong> 줄였고(낮은
            근거 수준), 1~6개월에는 차이가 없었습니다. 주사군 699명 중 족저근막 파열 2건, 감염 3건이 보고됐고, 부작용 보고가 부실해 더 높은 위험을
            배제할 수 없다고 했습니다.{" "}
            <S>(David et al. (2017) <Up h="https://pubmed.ncbi.nlm.nih.gov/28602048/" />)</S>{" "}
            174명 장기 추적에서는 초음파 유도 주사를 맞은 사람과 안 맞은 사람의 뒤꿈치 지방패드 두께가 다르지 않았습니다(9.0 대 9.4mm).{" "}
            <S>(Hansen et al. (2018) <Up h="https://pubmed.ncbi.nlm.nih.gov/29536022/" />)</S>{" "}
            맞을지 여부는 의사와 상의하세요.
          </p>
        </section>

        <section className="mb-8 p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
          <h2 id="how-long" className="text-base font-bold text-emerald-900 mb-2">얼마나 걸리나 — 가장 중요한 기대치</h2>
          <p className="text-sm text-emerald-900 leading-relaxed">
            초음파로 진단받은 174명을 평균 약 9년 추적한 연구에서, 증상이 남아 있을 위험은 <strong>1년 뒤 80.5%, 5년 뒤 50.0%, 10년 뒤 45.6%</strong>
            였습니다. 증상이 사라진 사람도 평균 725일이 걸렸고, 여성과 양쪽 발이 아픈 사람의 예후가 나빴습니다. 근막 두께나 뒤꿈치 뼈돌기(골극)는
            예후와 관계가 없었습니다.{" "}
            <S>(Hansen et al. (2018) <Up h="https://pubmed.ncbi.nlm.nih.gov/29536022/" />)</S>
          </p>
          <p className="mt-2 text-sm text-emerald-900 leading-relaxed">
            병원까지 온 사람들의 자료라 가벼운 사례보다는 길게 나왔을 수 있습니다. 그래도 몇 주 만에 판단하지 말고, 한 가지 방법을 최소 3개월은 꾸준히
            해 보세요(경험칙 — 위 근력 운동 연구의 1차 평가 시점이 3개월).
          </p>
        </section>

        <section className="mb-6">
          <h2 id="refs" className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <p className="mb-2 text-xs text-gray-400">2026-10-07 PubMed 초록과 대조했습니다.</p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <strong>Rathleff et al. (2015)</strong> — 고부하 근력 운동 대 스트레칭 무작위 시험 48명, 12개월 추적. Scand J Med Sci Sports 25(3):e292-300.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/25145882/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
            <li>
              <strong>Hansen et al. (2018)</strong> — 족저근막염 174명 5~15년 추적, 장기 예후. Orthop J Sports Med 6(3):2325967118757983.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/29536022/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
            <li>
              <strong>David et al. (2017)</strong> — 스테로이드 주사 코크런 리뷰(39편). Cochrane Database Syst Rev 6:CD009348.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/28602048/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
            <li>
              <strong>Lemont et al. (2003)</strong> — 만성 족저근막염 수술 50례 조직 소견, 염증 없는 퇴행. J Am Podiatr Med Assoc 93(3):234-7.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/12756315/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
            <li>
              <strong>Riddle et al. (2003)</strong> — 위험 요인 환자-대조군 연구. J Bone Joint Surg Am 85(5):872-7.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/12728038/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
            <li>
              <strong>van Leeuwen et al. (2016)</strong> — 위험 요인 메타분석(51편), 높은 BMI. Br J Sports Med 50(16):972-81.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/26644427/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
            <li>
              <strong>Koc et al. (2023)</strong> — 미국 물리치료학회 발뒤꿈치 통증 임상진료지침 2023 개정(본문 미대조). J Orthop Sports Phys Ther 53(12).{" "}
              <a href="https://doi.org/10.2519/jospt.2023.0303" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">DOI →</a>
            </li>
            <li>
              <strong>Nielsen et al. (2014)</strong> — 부상당한 초보 러너 254명, 족저근막염 5%. PLOS ONE 9(6):e99877.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/24923269/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
          </ul>
          <p className="mt-3 text-xs text-gray-400">추천 순서는 광고비로 바뀌지 않습니다.</p>
        </section>

        <YoutubeSection links={[
          // 2026-08-31: 검색 URL을 실제 영상으로 교체.
          // channel은 일부러 비워둔다 — 실제 업로더를 확인하지 않았고,
          // 짐작으로 채우는 것이 이 저장소에서 40건 오류를 만든 원인이다.
          // npm run check:youtube 가 확인해준 이름으로 채울 것.
          { label: "발뒤꿈치 통증 대표 질환 족저근막염 — 환자 맞춤 자가 운동법", channel: "세림병원", url: "https://www.youtube.com/watch?v=-y9BZ3qE1vE" },
          { label: "족저근막염 재활 운동", channel: "헬스조선 Health Chosun", url: "https://www.youtube.com/watch?v=sQ1IdjdZkxk" },
        ]} />

        <FaqSection items={[
          {
            q: "아침 첫발이 아픈데 족저근막염인가요?",
            a: "아침에 일어나 딛는 첫 몇 걸음이 가장 아프고, 걷다 보면 나아졌다가 오래 서 있거나 많이 걸으면 다시 아파지는 패턴이 족저근막 통증의 전형입니다. 다만 양쪽이 동시에 아프거나, 저린 느낌이 있거나, 쉬어도 계속 아프거나, 뒤꿈치를 양옆에서 눌렀을 때 아프면 다른 원인일 수 있으니 병원에서 확인하세요.",
          },
          {
            q: "스트레칭과 근력 운동 중 뭐가 더 효과적인가요?",
            a: "48명 무작위 배정 연구(Rathleff 2015)에서 이틀에 한 번 고부하 근력 운동을 한 그룹이 매일 스트레칭한 그룹보다 3개월 시점 발 기능 지수가 29점 더 좋았습니다. 방법은 발가락 밑에 수건을 말아 넣고 한 발로 뒤꿈치를 천천히 드는 것입니다. 1·6·12개월 시점에는 차이가 없었으므로, 회복을 앞당길 수 있지만 최종 결과를 바꾸지는 않는다고 보는 편이 정확합니다.",
          },
          {
            q: "족저근막염에 좋은 러닝화가 따로 있나요?",
            a: "특정 드롭이나 쿠셔닝이 족저근막 통증을 낫게 한다는 좋은 근거는 없습니다. 편한 신발이 통증 관리에 도움이 될 수는 있지만 치료는 아닙니다. '족저근막염 전용'을 내세우는 제품 광고는 근거보다 앞서 나간 주장으로 보는 편이 안전합니다.",
          },
          {
            q: "얼마나 지나야 낫나요?",
            a: "생각보다 오래 걸립니다. 병원에서 진단받은 174명 연구에서 증상이 남아 있을 위험은 1년 뒤 80.5%, 10년 뒤 45.6%였고, 증상이 사라진 사람도 평균 725일이 걸렸습니다(Hansen 2018). 병원 자료라 가벼운 사례보다 길 수 있습니다. 한 가지 방법을 최소 3개월은 꾸준히 해 보고 판단하세요.",
          },
        ]} />

        <p className="text-xs text-gray-400 mb-4">
          ※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 작성자는 의료인이 아닙니다. 통증이 지속되면 전문의 상담을 권장합니다.
        </p>

        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl">
          <p className="font-medium text-emerald-900 mb-2">신발로 족저근막염이 낫는다는 근거는 없습니다. 발볼·사이즈가 맞는지는 확인하세요</p>
          <Link href="/shoe-finder" className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            내 러닝화 찾기 →
          </Link>
        </div>
        {/* 2026-09-06: 글 안에서 바로 묻게 한다. 클릭 한 번이 이탈을 만든다. */}
        <InlineAsk from="plantar-fasciitis" tag="족저근막" placeholder="예) 아침 첫발이 아픈 게 두 달째인데 병원 가야 할까요?" />

        <ShareButtons from="plantar-fasciitis" title="족저근막염 — 아침 첫발이 아픈 이유" description="효과가 확인된 방법과 신발로는 낫지 않는 이유." />

      </article>
    </>
  );
}
