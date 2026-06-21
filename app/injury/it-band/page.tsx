import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import type { Metadata } from "next";

const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/it-band";

export const metadata: Metadata = {
  title: "장경인대염 초기 대처법 3가지 — 뛰다가 아메리카노",
  description: "달릴 때마다 무릎 바깥쪽이 아프다면 장경인대염을 의심하세요. 초기에 잡는 3가지 방법을 알려드립니다.",
};

export default function ITBandPage() {
  return (
    <>
      <ArticleJsonLd
        headline="장경인대염 초기 대처법 3가지"
        description="달릴 때마다 무릎 바깥쪽이 아프다면 장경인대염을 의심하세요. 초기에 잡는 3가지 방법을 알려드립니다."
        url={PAGE_URL}
        datePublished="2025-03-01"
      />
      <SiteHeader />
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 부상 예방 가이드
        </Link>

        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full mb-3">
            무릎
          </span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
            장경인대염 초기 대처법 3가지
          </h1>
          <p className="text-gray-500 text-sm">5분 읽기</p>
        </header>

        <p className="text-lg leading-relaxed mb-8 text-gray-700">
          달리기를 시작한 지 한두 달, 무릎 바깥쪽에 날카로운 통증이 온다면 장경인대염(IT Band Syndrome)일 가능성이 높습니다.
          런갤에서 초보 질문 2위가 무릎 통증인 이유가 여기 있습니다.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">왜 생기나요?</h2>
          <p className="leading-relaxed mb-4">
            장경인대는 허벅지 바깥쪽에서 무릎까지 이어지는 긴 띠 모양의 조직입니다.
            달릴 때 무릎이 굽혀지고 펴지면서 이 인대가 허벅지 뼈 돌출부를 반복해서 마찰합니다.
            초보 러너에게 자주 생기는 이유는 세 가지입니다.
          </p>
          <ul className="space-y-2 pl-4">
            {[
              "갑작스러운 거리 증가 — 주 10% 이상 늘리면 인대가 적응 못 함",
              "쿠셔닝 부족한 신발 — 착지 충격이 그대로 무릎으로 전달됨",
              "체중 대비 쿠션이 부족한 신발 — 특히 체중 75kg 이상에서 두드러짐",
            ].map((item, i) => (
              <li key={i} className="flex gap-2 text-gray-700">
                <span className="text-red-400 shrink-0 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">초기 대처법 3가지</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-red-200 pl-5">
              <h3 className="font-bold text-gray-900 mb-2">1. 즉시 거리를 30% 줄인다</h3>
              <p className="text-gray-700 leading-relaxed">
                통증이 생겼다면 이미 인대에 염증이 시작된 것입니다. 억지로 달리면 회복에 4~6주가 걸립니다.
                통증이 느껴지는 즉시 이번 주 거리를 30% 줄이고, 아프지 않은 수준에서만 달립니다.
                "좀 아파도 참고 달리면 적응된다"는 생각이 가장 위험합니다.
              </p>
            </div>

            <div className="border-l-4 border-orange-200 pl-5">
              <h3 className="font-bold text-gray-900 mb-2">2. 폼롤러로 허벅지 바깥쪽을 매일 풀어준다</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                장경인대 자체는 늘어나지 않지만, 주변 근육(대퇴근막장근, TFL)을 풀면 인대 장력이 줄어듭니다.
              </p>
              <div className="bg-orange-50 rounded-xl p-4 text-sm text-gray-700">
                <p className="font-medium mb-2">방법</p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>폼롤러를 허벅지 바깥쪽 아래에 놓고 옆으로 눕습니다</li>
                  <li>무릎부터 엉덩이까지 천천히 체중을 실어 굴립니다</li>
                  <li>아픈 부위에서 10~15초 멈춥니다</li>
                  <li>하루 2번, 각 2~3분씩 반복합니다</li>
                </ol>
              </div>
            </div>

            <div className="border-l-4 border-yellow-200 pl-5">
              <h3 className="font-bold text-gray-900 mb-2">3. 신발의 쿠셔닝을 확인한다</h3>
              <p className="text-gray-700 leading-relaxed">
                장경인대염은 신발 문제와 연결된 경우가 많습니다. 특히 체중 75kg 이상이라면
                쿠셔닝 3 이하의 신발은 부담이 됩니다. 현재 신발을 500km 이상 신었다면 교체 시기를 먼저 확인하세요.
                러닝화 수명은 보통 500~800km입니다.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">병원에 가야 할 신호</h2>
          <ul className="space-y-2 pl-4">
            {[
              "2주 이상 쉬어도 통증이 줄지 않는 경우",
              "걷기만 해도 무릎 바깥쪽에 통증이 오는 경우",
              "무릎이 붓거나 열감이 느껴지는 경우",
            ].map((item, i) => (
              <li key={i} className="flex gap-2 text-gray-700">
                <span className="text-red-500 shrink-0">⚠</span>
                {item}
              </li>
            ))}
          </ul>
        </section>


        <YoutubeSection links={[
          { label: "러닝할 때 무릎 바깥쪽이 아픈 이유는? 장경인대증후군이란?", channel: "정형외과TV", url: "https://www.youtube.com/watch?v=vqe3vSYP3jo" },
          { label: "무릎 통증, 치료법 다 모여라! 장경인대증후군 자가 운동법", channel: "365웰 정형외과", url: "https://www.youtube.com/watch?v=c7-JDyYg4c0" },
          { label: "[장경인대증후군] 러너에게 흔한 통증질환 TOP3", channel: "재활운동TV", url: "https://www.youtube.com/watch?v=4Y7xKZc6KtE" },
          { label: "정형외과 의사가 생각하는 달리기 부상과 장경인대염", channel: "정형외과 의사", url: "https://www.youtube.com/watch?v=z3UUVQf57m0" },
          { label: "자전거·러닝 전 이거 안 하면 무릎 나갑니다! 3분 장경인대증후군", channel: "재활운동TV", url: "https://www.youtube.com/shorts/uNI9DtqCy6M" },
          { label: "무릎 통증(장경인대 통증) 해결! 러닝 자세 Before & After", channel: "러닝자세TV", url: "https://www.youtube.com/shorts/Ar7Fijekr_8" },
          { label: "장경인대 스트레칭 30초 핵심", channel: "재활TV", url: "https://www.youtube.com/shorts/HPsUUJlEiKk" },
        ]} />

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">과학적 근거 및 참고 논문</h2>
          <ul className="flex flex-col gap-2">
            <li className="text-sm text-gray-700">
              <strong>Sanchez-Alvarado et al. (2024)</strong> — 러너 장경인대염 보존적 치료 전략의 체계적 고찰. 엉덩이 외전근 강화(HAS)가 가장 유효한 중재로 확인됨.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/39247485/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed 원문 →</a>
            </li>
            <li className="text-sm text-gray-700">
              <strong>Liao et al. (2022, Frontiers in Sports)</strong> — 장경인대 압축 이론: 무릎 30° 굴곡 시 장경인대가 외측 대퇴상과에 압박되어 통증 발생. 달리기 중 고관절 내전·내회전 제어가 핵심.{" "}
              <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11377285/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PMC 원문 →</a>
            </li>
          </ul>
          <p className="text-xs text-gray-400 mt-2">※ 이 콘텐츠는 의학적 진단이나 치료를 대체하지 않습니다. 지속적 통증은 전문의 상담을 권장합니다.</p>
        </section>

        <FaqSection items={[
          {
            q: "달릴 때 무릎 바깥쪽이 아픈 이유는 뭔가요?",
            a: "무릎 바깥쪽의 날카로운 통증은 장경인대염(IT Band Syndrome)일 가능성이 높습니다. 장경인대가 무릎을 굽혔다 펼 때 허벅지 뼈 돌출부와 반복해서 마찰하며 염증이 생깁니다. 주 10% 이상의 갑작스러운 거리 증가와 체중 대비 쿠셔닝이 부족한 신발이 주요 원인입니다.",
          },
          {
            q: "장경인대염이 생기면 달리기를 완전히 쉬어야 하나요?",
            a: "완전히 쉴 필요는 없지만, 통증이 느껴지는 즉시 이번 주 거리를 30% 줄이고 아프지 않은 수준에서만 달려야 합니다. 통증을 참고 달리면 회복에 4~6주가 걸릴 수 있습니다. 지속적인 통증은 전문의 상담을 권장합니다.",
          },
          {
            q: "장경인대염에 폼롤러는 어떻게 사용하나요?",
            a: "폼롤러를 허벅지 바깥쪽 아래에 놓고 옆으로 누워, 무릎부터 엉덩이까지 천천히 체중을 실어 굴립니다. 아픈 부위에서 10~15초 멈추고, 하루 2번 각 2~3분씩 반복합니다. 장경인대 자체는 늘어나지 않지만 주변 근육(대퇴근막장근)을 풀면 인대 장력이 줄어듭니다.",
          },
        ]} />

        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl">
          <p className="font-medium text-emerald-900 mb-2">내 체중에 맞는 쿠셔닝 신발이 필요하다면</p>
          <p className="text-sm text-emerald-800 mb-4">
            체중·발볼을 입력하면 장경인대염 예방에 적합한 신발을 추천해드립니다.
          </p>
          <Link
            href="/shoe-finder"
            className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            내 러닝화 찾기 →
          </Link>
        </div>
      </article>
    </>
  );
}
