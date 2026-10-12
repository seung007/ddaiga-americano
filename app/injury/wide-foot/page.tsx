import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import WideShoeList, { wideSummary } from "@/components/WideShoeList";
import InlineAsk from "@/components/InlineAsk";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ShareButtons from "@/components/ShareButtons";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import { Up, S } from "@/components/guide/Up";
import type { Metadata } from "next";

/**
 * 2026-10-08 재검증 — 건강·발 형태 주장만 PubMed 초록과 대조(브랜드 폭 옵션·규격 정의는 대상 아님)
 *   · 「달리는 동안 발이 붓고 퍼져 커진다」 → 반대 근거: Mo 2024(남성 19명, 10km 후 길이↑·볼 둘레↓, 2mm 미만). 연구마다 갈린다고 고침
 *   · 「붓기·물집·눌림이면 규격이 안 맞는 것」 단정 → Buldt 2018(맞지 않는 신발과 발 통증·질환의 연관)로 「신호일 수 있음」으로 낮춤
 *   · 표의 「달릴 때 많이 붓는 편」「평발로 퍼짐」, 하루 중 붓기·앉으면 좁게·좌우 차이 정상 → 근거 못 찾음, 경험칙으로 낮추거나 뺌
 *   · 나이와 발너비 → Reeves 2024(여성 374명, 횡단면) 추가. 「늘어난다」→「나이 많은 그룹이 넓었다」
 *   · 사이즈코리아(KCI) 논문은 PubMed 밖이라 이번 재검증에서 원문 대조를 못 했다 — 내용은 유지
 *   · 본문에서 쓰지 않는 이우천 2005 참고 항목 삭제
 */
const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/wide-foot";

export const metadata: Metadata = {
  // 네이버 실측(2026-08): "2e 와이드 뜻" 노출 134·CTR 0.7%, "런닝화 와이드 뜻" 노출 18·CTR 5.6%.
  // 둘 다 '뜻'을 찾는 질의인데 이전 제목엔 "2E"도 "뜻"도 없었다.
  // 반면 "발볼 와이드 기준"은 CTR 50% — 제목에 그 단어들이 있었기 때문이다.
  title: "2E·4E 와이드 뜻과 내 발볼 재는 법 — 러닝화 와이드 규격 총정리 | 뛰다가 아메리카노",
  description: "2E·4E가 무슨 뜻인지, 내 발볼이 와이드 기준에 해당하는지 재는 법, 브랜드별 폭 옵션까지 정리했습니다.",
  alternates: { canonical: "/injury/wide-foot" },
};

export default function WideFootPage() {
  return (
    <>
      <ArticleJsonLd
        headline="발볼 넓은 러너 와이드 규격 총정리"
        description="2E·4E 규격이 필요한지 판단하는 방법과 발볼 넓은 러너에게 맞는 러닝화를 알려드립니다."
        url={PAGE_URL}
        datePublished="2025-03-01"
      />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["발볼 와이드 규격", "/injury/wide-foot"],
        ]}
      />
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 러닝 가이드
        </Link>

        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-3">
            발볼
          </span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
            2E·4E 와이드 뜻과<br />내 발볼 재는 법
          </h1>
          {/* 규약은 app/injury/page.tsx 상단 주석 */}
          <p className="text-gray-500 text-sm">5분 읽기</p>
        </header>

        {/**
         * 먼저 결론 (2026-09-14 추가)
         *
         * 이 페이지가 받는 검색어는 **7개, 노출 373**이다 — 10km 다음으로 큰 덩어리.
         *   2e 와이드 뜻 255 / 신발 2e 뜻 45 / 신발 와이드 뜻 33 / 런닝화 와이드 뜻 28 /
         *   2e 4e 5 / 발볼 와이드 기준 5 / 발볼 규격 4 / 발볼 와이드 러닝화 3
         *
         * ⚠️ **제목·description 은 안 건드린다.** 「2e 와이드 뜻」이 9/25 판정 대상이다.
         * 본문은 CTR 에 안 잡히므로 자유롭다.
         *
         * 고친 것: 제목이 「내 발볼 재는 법」을 약속하는데 **본문에 재는 법이 없었다.**
         * 있던 건 "밑창 밖으로 삐져나오나", "물집이 생기나" 같은 간접 확인법이다.
         * `/injury/midfoot` 과 정확히 같은 결함이었다 — 제목이 약속한 걸 본문이 안 준다.
         */}
        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">먼저 결론</p>
          <p className="mt-2 leading-relaxed text-emerald-900">
            <strong>2E는 &ldquo;넓음&rdquo;, 4E는 &ldquo;매우 넓음&rdquo;입니다.</strong> 아무것도
            안 적혀 있으면 D(표준)입니다. 길이가 아니라 <strong>폭</strong> 표시입니다.
          </p>
          <p className="mt-2 leading-relaxed text-emerald-900">
            <strong>&ldquo;몇 mm부터 와이드&rdquo;라는 절대 기준은 없습니다.</strong> 같은 2E라도
            브랜드마다 실제 너비가 다릅니다. 그래서 재고 나면{" "}
            <strong>브랜드 사이즈표와 비교</strong>해야 합니다.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-800">
            제일 빠른 판정법 — <strong>신발을 벗고 밑창을 보세요.</strong> 밑창 끝보다 발이
            옆으로 삐져나와 있으면 폭이 좁은 겁니다.
          </p>
        </div>

        <p className="text-lg leading-relaxed mb-8 text-gray-700">
          달리고 나서 발 바깥쪽에 물집이 생기거나 새끼발가락이 신발에 눌린다면
          발볼 폭이 좁다는 신호일 수 있습니다. 발 폭이나 길이에 맞지 않는 신발을 신는 사람이 연구마다 63~72%였고,
          맞지 않는 신발은 발 통증·작은발가락 변형·티눈·굳은살과 연관돼 있었습니다(일반인·고령자 등 대상 연구 18편 리뷰, 러너 대상은 아님).{" "}
          <S>(Buldt et al. (2018) <Up h="https://pubmed.ncbi.nlm.nih.gov/30065787/" />)</S>
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">신발 폭 규격이란?</h2>
          <p className="leading-relaxed mb-4 text-gray-700">
            러닝화는 같은 길이라도 폭이 다른 여러 규격으로 출시됩니다. 미국 규격 기준으로
            B(좁음) → D(표준) → 2E(넓음) → 4E(매우 넓음) 순으로 넓어집니다.
            국내에서 팔리는 대부분의 신발은 D 규격(표준)이며, 와이드 버전은 따로 구매해야 합니다.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  {["규격", "너비", "해당하는 발"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["B", "좁음", "발폭이 좁고 발등이 낮은 편"],
                  ["D", "표준", "대부분의 사람 (기본값)"],
                  ["2E", "넓음", "발볼이 넓은 편"],
                  ["4E", "매우 넓음", "발볼이 매우 넓은 편"],
                ].map(([code, width, desc], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-mono font-bold text-blue-700">{code}</td>
                    <td className="px-4 py-3 text-gray-700">{width}</td>
                    <td className="px-4 py-3 text-gray-600">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">내가 와이드 규격이 필요한지 확인하는 법</h2>
          <div className="space-y-4">
            {[
              {
                title: "방법 1. 현재 신발 밑창 확인",
                desc: "신발을 벗고 바닥을 보세요. 밑창 끝보다 발이 삐져나와 있다면 폭이 좁은 겁니다.",
              },
              {
                title: "방법 2. 달린 뒤 체크",
                desc: "5km 이상 달린 후 발 바깥쪽·새끼발가락 부위에 압박이나 발적이 생긴다면 와이드를 고려해 볼 신호입니다(경험칙).",
              },
              {
                title: "방법 3. 엄지발가락 여유 공간",
                desc: "신발 앞코와 엄지 사이에 손가락 하나(1cm)가 들어가는데도 옆이 눌린다면 길이가 아닌 폭 문제입니다.",
              },
            ].map((item, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            &ldquo;달리면 발이 붓고 퍼진다&rdquo;는 말은 흔하지만 연구 결과는 갈립니다. 남성 러너 19명이 10km를 달린 연구에서는
            발 길이가 늘고 볼 둘레는 오히려 줄었는데, 차이는 둘 다 2mm 미만이었습니다.{" "}
            <S>(Mo et al. (2024) <Up h="https://pubmed.ncbi.nlm.nih.gov/39193231/" />)</S>{" "}
            작은 연구 하나라 단정할 수는 없지만, 달린 뒤의 압박감을 &ldquo;발이 커져서 그렇다&rdquo;로만 넘기지 말고
            아래 방법으로 폭을 한 번 재 보세요.
          </p>
        </section>

        {/**
         * 발볼 재는 법 (2026-09-14 추가)
         *
         * 검색어 「발볼 와이드 기준」이 들어오는데 본문에 **재는 방법이 없었다.**
         * 제목은 「내 발볼 재는 법」이라고 적혀 있다.
         *
         * ⚠️ **mm 기준 숫자를 쓰지 않았다.** 브랜드마다 같은 2E의 실제 너비가
         * 다르고, 내가 기억으로 표를 만들면 그건 지어낸 숫자가 된다.
         * 이 저장소는 브랜드 URL 을 지어냈다가 잡힌 이력이 있다(Revel 7 사고).
         * 그래서 **재는 법만 주고 기준은 브랜드 사이즈표로 보낸다.** 그게 실제로도 정답이다.
         */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">발볼을 실제로 재는 법</h2>
          <p className="leading-relaxed text-gray-700 mb-4">
            종이 한 장과 자만 있으면 됩니다. <strong>저녁에 재는 것</strong>이 흔한 요령입니다
            (경험칙 — 하루 중 발 크기 변화를 확인한 자료는 찾지 못했습니다).
          </p>
          <ol className="space-y-2 list-decimal list-inside leading-relaxed text-gray-700">
            <li>바닥에 종이를 놓고 그 위에 <strong>서서</strong> 체중을 싣습니다 (신발을 신고 달릴 때처럼 체중을 실은 상태로 잽니다)</li>
            <li>발 윤곽을 연필로 그립니다. 연필은 바닥과 <strong>수직</strong>으로 세웁니다</li>
            <li>발볼이 가장 넓은 곳 — <strong>엄지발가락 아래 튀어나온 뼈에서 새끼발가락 아래 뼈까지</strong> 가로로 잽니다</li>
            <li>양발 다 재서 <strong>더 넓은 쪽</strong>을 씁니다. 좌우가 다를 수 있습니다</li>
          </ol>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
            <strong>잰 숫자를 어디에 쓰나</strong> — 절대 기준은 없습니다. 사려는 브랜드의
            사이즈표(보통 &ldquo;Width Guide&rdquo; 또는 &ldquo;발 너비&rdquo;)에서 내 발 길이에
            해당하는 줄을 찾아 비교하세요. <strong>폭 표기(2E 등)는 브랜드마다 실제 너비가
            다를 수 있습니다</strong>(브랜드별 실측 비교는 저희가 확인하지 못했습니다).
          </div>

          {/**
           * 2026-09-15 추가 — 한국인 발 형태 실측 데이터.
           *
           * 권은순·이하경·이예진 (2024) 한국생활과학회지 33(2):251-264 (KCI 등재).
           * 8차 사이즈코리아 3D 스캔 — 남 2,000명 · 여 2,503명.
           * 남 3개 · 여 4개 유형. 남녀 모두 '보통 발'이 최다, '넓고 두꺼운 큰 발'이 최소.
           * **연령이 오르면 발둘레·발너비가 증가.**
           *
           * ⚠️ 이 논문에도 **"몇 mm부터 2E"는 없다.** 유형 분류지 규격 기준이 아니다.
           * 그래서 위 "절대 기준은 없습니다"는 그대로 둔다.
           * 다만 "내가 넓은 편인가"를 가늠할 모집단 정보는 된다.
           *
           * 2026-10-08: KCI 논문이라 PubMed 재검증 범위 밖 — 이번에 원문 대조를 못 했다. 내용은 9/15 기록대로 유지.
           * 「나이가 들수록 늘어난다」는 횡단면 비교라 「나이 많은 그룹이 넓었다」로 낮추고 Reeves 2024 를 보탰다.
           */}
          <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
            <strong>참고 — 한국인 발은 어떻게 생겼나</strong>
            <br />
            사이즈코리아 3D 스캔(남 2,000명·여 2,503명)을 분석한 연구에서 남성은 3개, 여성은
            4개 유형으로 나뉘었고, <strong>남녀 모두 &lsquo;보통 발&rsquo;이 가장 많고
            &lsquo;넓고 두꺼운 큰 발&rsquo;이 가장 적었습니다.</strong> 그리고{" "}
            <strong>연령대가 높을수록 발둘레·발너비가 컸습니다.</strong> 영국에서 스포츠를 하는 여성 374명의 발을
            스캔한 연구에서도 18~29세 그룹의 발너비가 더 나이 많은 그룹보다 좁았습니다.{" "}
            <S>(Reeves et al. (2024) <Up h="https://pubmed.ncbi.nlm.nih.gov/39369693/" />)</S>{" "}
            둘 다 같은 사람을 추적한 연구는 아니지만, 예전 사이즈를 그대로 쓰고 있다면 한 번 재보실 만합니다.
            <span className="mt-2 block text-xs text-gray-500">
              ※ 이 연구도 &ldquo;몇 mm부터 2E&rdquo;를 정하지는 않습니다. 유형 분류이지 규격 기준이 아닙니다.
            </span>
          </div>
        </section>

        <FinderCta from="wide-foot" variant="inline" headline="발볼 조건을 넣으면 2E·4E 옵션이 있는 신발만 골라서 보여드립니다." />

        {/* 2026-10-12: 손으로 쓴 브랜드 표가 신발 원장과 어긋나(On·Hoka·Nike) 원장에서 계산하는 표로 바꿨다 — components/WideShoeList.tsx */}
        <WideShoeList />


        <YoutubeSection links={[
          { label: "Best Running Shoes for Wide Feet 2024: Top 3 Picks Revealed!", channel: "FORDY RUNS", url: "https://www.youtube.com/watch?v=hv9V9D51cFU" },
          { label: "The Best Wide-Fitting Neutral Running Shoes: Expert Review", channel: "Run and Become", url: "https://www.youtube.com/watch?v=g9BGWko7e9M" },
          { label: "Running Shoes for Wide Feet — My Top 5 Picks", channel: "Find My Footwear", url: "https://www.youtube.com/watch?v=CALXqH6mhsw" },
        ]} />

        <FaqSection items={[
          {
            q: "와이드(2E·4E) 규격이 필요한지 어떻게 판단하나요?",
            a: "세 가지로 확인합니다. ① 신발 밑창보다 발이 옆으로 삐져나와 있다 ② 5km 이상 달린 뒤 새끼발가락·발 바깥쪽에 압박이나 물집이 생긴다 ③ 앞코 길이는 여유가 있는데 옆이 눌린다 — 길이가 아닌 폭 문제입니다. 「달리면 발이 붓고 퍼진다」는 말은 흔하지만, 남성 러너 19명이 10km를 달린 연구에서는 볼 둘레가 오히려 줄었고 차이는 2mm 미만이었습니다(Mo 2024).",
          },
          {
            q: "러닝화 폭 규격 B·D·2E·4E는 무슨 뜻인가요?",
            a: "미국 규격 기준 폭 표기입니다. B(좁음) → D(표준) → 2E(넓음) → 4E(매우 넓음) 순으로 넓어집니다. 국내에서 팔리는 대부분의 러닝화는 D 규격이며, 와이드 버전은 따로 구매해야 합니다.",
          },
          {
            q: "와이드 옵션이 많은 러닝화 브랜드는 어디인가요?",
            a: wideSummary(),
          },
        ]} />

        <p className="text-xs text-gray-400 mb-4">※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 발 통증이 지속되면 전문의 상담을 권장합니다.</p>

        {/* 2026-09-06: 글 안에서 바로 묻게 한다.
            /community 로 보내면 클릭 한 번이 필요하고, 그 한 번에서 대부분을 잃는다 —
            두 달간 질문 0건이 그 증거다. */}
        <InlineAsk from="wide-foot" tag="발볼" placeholder="예) 2E 신어도 새끼발가락이 눌리는데 4E로 가야 하나요?" />

        {/* 2026-09-15: 이 페이지엔 참고자료 절 자체가 없었다. 한국어 자료 2건으로 만든다. */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003076956" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                권은순·이하경·이예진 (2024) 한국생활과학회지 33(2):251-264 — 8차 사이즈코리아 3D 스캔(남 2,000·여 2,503명) 기반 한국인 발 유형 분류. 연령 증가에 따른 발둘레·발너비 증가 ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Buldt et al. (2018)</strong> — 연구 18편 서술 리뷰. 63~72%가 폭이나 길이가 맞지 않는 신발을 신었고, 맞지 않는 신발은 발 통증·작은발가락 변형·티눈·굳은살과 연관. <a href="https://pubmed.ncbi.nlm.nih.gov/30065787/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Mo et al. (2024)</strong> — 남성 레크리에이션 러너 19명, 10km 전후 3D 스캔. 발 길이↑·볼 둘레↓(2mm 미만), 아치 높이 감소. <a href="https://pubmed.ncbi.nlm.nih.gov/39193231/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Reeves et al. (2024)</strong> — 스포츠 활동 여성 374명 발 스캔. 18~29세 그룹의 발너비가 더 나이 많은 그룹보다 좁음. <a href="https://pubmed.ncbi.nlm.nih.gov/39369693/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><span className="text-gray-500">&ldquo;몇 mm부터 2E&rdquo; 기준 — KS 표준(M 6681 / G 3405)이 존재한다는 언급은 확인했으나 <strong>원문을 열어 확인하지 못했습니다.</strong> 그래서 본문에 수치 기준을 적지 않았습니다</span></li>
          </ul>
          <p className="mt-3 text-xs text-gray-400">추천 순서는 광고비로 바뀌지 않습니다. 브랜드별 와이드 옵션 표는 각 브랜드 공식 정보 기준이며, 모델·연식에 따라 달라질 수 있습니다.</p>
        </section>

        <FinderCta from="wide-foot" headline="발볼 넓은 내 발에 맞는 신발 찾기" sub="발볼 조건을 선택하면 2E·4E 옵션이 있는 신발만 필터링해서 추천합니다." />
        <ShareButtons from="wide-foot" title="발볼 넓은 러너 와이드 규격 총정리" description="2E·4E가 필요한지 판단하는 법과 브랜드별 옵션." />

      </article>
    </>
  );
}
