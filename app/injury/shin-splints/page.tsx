import Link from "next/link";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import { Up, S } from "@/components/guide/Up";
import { Lead, P, H2, Summary, Todo, Evidence, References, Basis, Note } from "@/components/guide/Read";
import type { Metadata } from "next";

/**
 * 2026-10-07 재검증 — 초록·StatPearls 원문과 대조
 *   · 「254명을 1년간 추적」 → 933명 코호트 중 부상 254명의 진단 분포(Nielsen 2014). 기간 단정 삭제
 *   · 「2~3cm 한 점」 → StatPearls 기준 5cm 미만 국소 압통. 호핑·야간통 목록은 이 사이트의 보수적 기준으로 표기
 *   · 기전 → 견인 가설과 경골 휨(골 스트레스) 가설 둘 다 제시, 확정 안 됨(StatPearls)
 *   · 위험 요인 → 메타분석 2편을 출처별로 나눔. 「다리 길이 차이·특정 신발 종류」는 두 메타분석이 다루지 않아 「확인 안 됨」으로 쓸 수 없어 삭제
 *   · 치료 → Winters 2013 체계적 고찰(권할 치료 없음, ESWT 가장 유망) 숫자 그대로
 *
 * 2026-10-13 가독성 재설계 — 답 → 할 일 → 근거(접힘). 위험비·95% CI·연구 수는 <Evidence> 안으로.
 *   **피로골절 구별·병원 신호 박스는 접지 않고 문장도 그대로 둔다**(글씨 크기만 키움).
 *   「원인이 아니라 같이 관찰되는 것」「효과 크기 작음」「깔창은 원래 발 문제였는지 못 가름」「순위는 분류 방식에 따라 다름」은 본문에 남겼다.
 */
const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/shin-splints";
const TITLE = "정강이 통증(신스플린트) — 초보 러너에게 흔한 부상";
const DESC =
  "초보 러너에게 흔한 정강이 통증(MTSS). 피로골절과 어떻게 구별하는지, 위험 요인과 치료 연구가 실제로 말하는 것을 논문 링크와 함께 정리했습니다.";

export const metadata: Metadata = {
  title: "정강이 통증(신스플린트) — 초보 러너에게 흔한 부상 | 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/shin-splints" },
};

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["정강이 통증", "/injury/shin-splints"],
        ]}
      />
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <header>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">부상 부위</span>
            {/* 규약은 app/injury/page.tsx 상단 주석 */}
            <span className="text-xs text-gray-400">4분 읽기</span>
          </div>
          <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">정강이 통증(신스플린트) — 초보 러너에게 흔한 부상</h1>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-500">
            <span className="text-emerald-600">✓</span>
            협찬 없이 작성 — 연구로 확인된 것과 저희 기준을 구분해 적었습니다
          </p>
        </header>

        <Lead>
          정강이뼈 안쪽 가장자리를 따라 넓게 아픈 것이 정강이 통증(신스플린트)입니다. 피로골절과 구별하는 법부터 적었습니다.
        </Lead>

        <Summary
          items={[
            <>
              임상 참고서 기준으로, 누르면 아픈 곳이 <strong>5cm 안쪽의 한 점</strong>에 몰려 있으면 피로골절을 의심합니다.
              <Basis kind="paper" />
            </>,
            <>
              한 점 통증·호핑이 안 됨·밤에 깸·붓기·저림 중 하나라도 있으면 <strong>달리기를 멈추고 병원</strong>에 갑니다.
              <Basis kind="rule" />
            </>,
            <>
              원인은 아직 확정되지 않았고, <strong>권할 만큼 검증된 치료도 아직 없습니다.</strong>
              <Basis kind="paper" />
            </>,
            <>
              현실적인 대처는 <strong>부하 조절</strong> — 아픈 활동을 줄이고 통증 없는 범위에서 천천히 다시 늘립니다.
              <Basis kind="rule" />
            </>,
          ]}
        />

        {/* 안전 정보를 맨 위에 둔다 — 이 페이지의 존재 이유. 2026-10-13 재설계에서도 접지 않는다. */}
        <section className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-5">
          <h2 id="stress-fracture" className="scroll-mt-20 break-keep text-lg font-bold text-red-900">
            먼저 — 피로골절인지 구별하세요
          </h2>
          <p className="mt-3 break-keep text-[15px] leading-[1.7] text-red-900">
            정강이 통증과 <strong>경골 피로골절</strong>은 증상이 비슷하고, 같은 &lsquo;뼈 스트레스 손상&rsquo;의 연속선 위에 있다고 봅니다. 쉬지 않고
            계속 뛰면 MTSS가 피로골절로 진행할 수 있습니다. 임상 참고서(StatPearls)가 쓰는 구별 기준은 <strong>누르면 아픈 범위의 길이</strong>입니다.
          </p>
          <ul className="mt-3 space-y-2 break-keep text-[15px] leading-[1.7] text-red-900">
            <li>
              <strong>MTSS(정강이 통증)</strong> — 정강이뼈 안쪽 뒤 가장자리를 따라 <strong>5cm 넘게</strong> 누르면 아픕니다.
              손가락으로 짚으면 &ldquo;이 근처 전체&rdquo;가 아픕니다.
            </li>
            <li>
              <strong>피로골절 의심</strong> — 누르면 아픈 곳이 <strong>5cm 안쪽의 한 점</strong>에 몰려 있습니다.
            </li>
          </ul>
          <p className="mt-2 text-xs text-red-700">5cm 기준: StatPearls 「Medial Tibial Stress Syndrome」(아래 참고 자료)</p>
          <p className="mt-4 mb-1 break-keep text-[15px] font-semibold text-red-900">아래에 하나라도 해당하면 달리기를 멈추고 병원에 가세요</p>
          <ul className="space-y-1 break-keep text-[15px] leading-[1.7] text-red-900">
            <li>• 아픈 곳이 한 점에 몰려 있고 손가락 하나로 짚을 수 있다</li>
            <li>• 한 발로 제자리 뛰기(호핑)를 못 할 정도로 아프다</li>
            <li>• 밤에 자다가 아파서 깬다 / 쉬고 있어도 아프다</li>
            <li>• 그 부위가 눈에 띄게 붓거나 붉다</li>
            <li>• 저리거나 감각이 이상하다, 발이 차갑거나 창백해진다</li>
            <li>• 뛰는 동안 점점 더 심해진다</li>
          </ul>
          <p className="mt-3 break-keep text-xs leading-relaxed text-red-700">
            이 목록은 진단 기준이 아니라, 피로골절이나 다른 원인을 놓치지 않으려고 저희가 보수적으로 정한 기준입니다. 저림·창백함은 만성 운동유발
            구획증후군 같은 다른 원인일 수 있습니다. 이 페이지로 자가진단하지 마세요.
          </p>
        </section>

        <h2 id="common" className={H2}>
          초보에게 얼마나 흔한가요?
        </h2>
        <P>
          처음 달리기를 시작한 덴마크 성인을 추적한 한 연구에서, 부상당한 사람을 진찰해 보니 <strong>정강이 통증이 15%로 가장 많았습니다.</strong>{" "}
          무릎 앞 통증(10%)보다도 많습니다.
        </P>
        <P>정식 이름은 내측 경골 스트레스 증후군(MTSS)입니다.</P>
        <Note>순위는 분류 방식에 따라 달라집니다. 진단명이 아니라 부위로 묶은 조사에서는 무릎이 아래다리보다 많았습니다.</Note>
        <Evidence n={2}>
          <p>
            달리기를 처음 시작한 덴마크 성인 933명을 추적한 연구에서 부상당한 254명을 진찰해 보니 정강이 통증이 15%로 가장 많았습니다. 무릎
            앞 통증은 10%였습니다. <S>(Nielsen et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/24923269/" />)</S>
          </p>
          <p>
            네덜란드 러너 4,621명 조사에서는 진단명이 아니라 부위로 묶었더니 무릎(30.5%)이 아래다리(17.8%)보다 많았습니다.{" "}
            <S>(Kemler et al. (2018) <Up h="https://pubmed.ncbi.nlm.nih.gov/30071170/" />)</S>
          </p>
        </Evidence>

        <h2 id="why" className={H2}>
          왜 생기나요? — 아직 정리되지 않았습니다
        </h2>
        <P>
          반복 하중으로 정강이뼈 피질에 생긴 미세 손상이 회복되기 전에 쌓인다는 데까지는 대체로 같은 의견입니다. 그 다음은 두 가설이
          있습니다.
        </P>
        <ul className="mt-4 space-y-2 break-keep text-[15px] leading-[1.7] text-gray-800">
          <li>
            • <strong>견인 가설</strong> — 종아리 안쪽 근육(가자미근·후경골근 등)이 뼈막을 반복해서 잡아당긴다. 어느 근육인지는 연구마다 다릅니다.
          </li>
          <li>
            • <strong>뼈 휨 가설</strong> — 체중을 받을 때마다 정강이뼈가 조금씩 휘고, 그 스트레스에 뼈가 반응한다.
          </li>
        </ul>
        <P>
          사체 조직 소견이 일정하지 않아 정확한 원인은 확정되지 않았습니다(StatPearls). 그래서 아래 위험 요인은 &ldquo;원인&rdquo;이 아니라{" "}
          <strong>통계적으로 같이 관찰되는 것</strong>으로 읽어야 합니다.
        </P>

        <h2 id="risk" className={H2}>
          어떤 사람이 더 잘 생기나요?
        </h2>
        <P>연구를 모은 분석 두 편에서 정강이 통증과 같이 관찰된 것들입니다.</P>
        <ul className="mt-4 space-y-2 break-keep text-[15px] leading-[1.7] text-gray-800">
          <li>• 예전에 정강이 통증을 겪은 적이 있음</li>
          <li>• 러닝 경력이 짧음 — 초보에게 흔한 이유와 맞닿습니다</li>
          <li>• 여성</li>
          <li>• 높은 BMI</li>
          <li>• 체중을 실었을 때 발 안쪽 아치가 많이 내려앉음(주상골 하강)</li>
          <li>• 발목 발바닥굽힘·고관절 외회전 가동범위가 큼</li>
          <li>• 깔창(보조기)을 쓴 적 있음</li>
        </ul>
        <Note>
          원인이 아니라 같이 관찰된 것이고, 첫 분석은 러너와 군인 연구를 함께 모았으며 그 네 가지(BMI·아치·발목·고관절)는 효과 크기가
          작습니다. 깔창은 원래 발 문제가 있던
          사람이 깔창을 쓴 결과인지 가를 수 없습니다.
        </Note>
        <P>
          반대로 <strong>발 모양(평발·요족 같은 유형) 자체와 무릎 정렬 각도(Q각)는 위험 요인이 아니었습니다.</strong> 관련이 있었던 것은
          &lsquo;평발이냐&rsquo;가 아니라 &lsquo;체중을 실었을 때 아치가 얼마나 내려앉느냐&rsquo;입니다.
        </P>
        <Evidence n={2}>
          <p>
            러너·군인 연구 21편을 모은 메타분석에서 유의하게 나온 것은 네 가지입니다. 효과 크기는 작습니다.{" "}
            <S>(Hamstra-Wright et al. (2015) <Up h="https://pubmed.ncbi.nlm.nih.gov/25185588/" />)</S>
          </p>
          <ul className="space-y-1">
            <li>· 높은 BMI — 평균 차이 0.79 (95% CI 0.38~1.20)</li>
            <li>· 주상골 하강(navicular drop)이 큼 — 평균 차이 1.19mm (95% CI 0.54~1.84)</li>
            <li>· 발목 발바닥굽힘 가동범위가 큼 — 평균 차이 5.94°</li>
            <li>· 고관절 외회전 가동범위가 큼 — 평균 차이 3.95°</li>
          </ul>
          <p>
            러너만 본 연구 10편의 메타분석은 여기에 몇 가지를 더 찾았습니다.{" "}
            <S>(Newman et al. (2013) <Up h="https://pubmed.ncbi.nlm.nih.gov/24379729/" />)</S>
          </p>
          <ul className="space-y-1">
            <li>· 이전에 MTSS를 겪은 적 있음 — 위험비 3.74 (95% CI 1.17~11.91)</li>
            <li>· 깔창(보조기)을 쓴 적 있음 — 위험비 2.31</li>
            <li>· 여성 — 위험비 1.71</li>
            <li>· 러닝 경력이 짧음</li>
            <li>· 주상골 하강 10mm 초과 — 위험비 1.99 (95% CI 1.00~3.96, 경계선)</li>
          </ul>
          <p>
            발목 등굽힘 가동범위와 Q각(무릎 정렬 각도)은 위험 요인이 아니었습니다(Hamstra-Wright 2015). 발 모양 분류(평발·요족 같은 유형)
            자체도 Newman 2013에서 유의하지 않았습니다.
          </p>
        </Evidence>

        <h2 id="treatment" className={H2}>
          어떻게 낫나요? — 권할 만큼 검증된 치료는 아직 없습니다
        </h2>
        <P>
          치료 연구를 모은 고찰의 결론은 <strong>어느 치료도 권할 만큼 편향이 적은 연구가 없다</strong>였습니다. 그래서 현실적인 대처는{" "}
          <strong>부하 조절</strong>입니다.
        </P>
        <Todo
          basis="rule"
          items={[
            "아픈 활동을 줄입니다.",
            "걷기·수영·자전거로 체력을 유지합니다.",
            "통증 없는 범위에서 천천히 다시 늘립니다.",
          ]}
        />
        <P>
          쉬는 기간을 정한 권고는 없고 사람마다 다릅니다. 충분히 쉬고 활동을 조절하면 대개 완전히 회복된다고 봅니다(StatPearls).
        </P>
        <P>
          근력 운동은 스포츠 부상 예방 전반에서 효과가 확인됐지만 MTSS 치료 효과로는 입증되지 않았습니다. &ldquo;신스플린트에
          효과&rdquo;라고 광고하는 제품·시술은 대체로 근거보다 앞서 나간 주장입니다.
        </P>
        <Evidence n={3}>
          <p>
            MTSS 치료 연구 11편을 모은 체계적 고찰의 결론은 어느 치료도 권할 만큼 편향이 적은 연구가 없다였습니다. 그중 가장 가능성이 보인
            것은 체외충격파(ESWT)였고, 다리 보조기·스트레칭·근력 운동·압박 스타킹·저출력 레이저는 효과가 입증되지 않았습니다.{" "}
            <S>(Winters et al. (2013) <Up h="https://pubmed.ncbi.nlm.nih.gov/23979968/" />)</S>
          </p>
          <p>
            러너 위험 요인 메타분석도 40년간의 연구가 &ldquo;오래 쉬는 것보다 분명히 나은 관리법&rdquo;을 찾지 못했다고 적었습니다.{" "}
            <S>(Newman et al. (2013) <Up h="https://pubmed.ncbi.nlm.nih.gov/24379729/" />)</S>
          </p>
          <p>
            근력 운동은 스포츠 부상 예방 전반에서 효과가 확인됐습니다(위험비 0.32).{" "}
            <S>(Lauersen et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/24100287/" />)</S>
          </p>
        </Evidence>
        <p className="mt-5 break-keep rounded-xl bg-gray-50 p-3 text-[15px] leading-relaxed text-gray-600">
          다시 달리기 시작할 때:{" "}
          <Link href="/injury/return-to-running#bone" className="text-emerald-700 underline">
            쉬었다가 다시 달리기 — 뼈 쪽 부상
          </Link>{" "}
          ·{" "}
          <Link href="/injury/training-types#run-walk" className="text-emerald-700 underline">
            걷기-달리기로 다시 시작하기
          </Link>
        </p>

        <div className="mt-14">
          <YoutubeSection links={[
            // 2026-08-31: 검색 URL을 실제 영상으로 교체.
            // channel은 일부러 비워둔다 — 실제 업로더를 확인하지 않았고,
            // 짐작으로 채우는 것이 이 저장소에서 40건 오류를 만든 원인이다.
            // npm run check:youtube 가 확인해준 이름으로 채울 것.
            { label: "정강이 통증, 신스프린트 vs 피로골절! 러너 필수 체크", channel: "연세이음정형외과", url: "https://www.youtube.com/watch?v=JfAEEhy5iEg" },
            { label: "정강이 피로골절 — 정의, 진단, 감별진단", channel: "선수촌병원", url: "https://www.youtube.com/watch?v=eAgBvQWuifA" },
          ]} />

          <FaqSection items={[
            {
              q: "정강이 통증과 피로골절은 어떻게 구별하나요?",
              a: "누르면 아픈 범위의 길이로 구별합니다. 정강이 통증(MTSS)은 정강이뼈 안쪽 가장자리를 따라 5cm 넘게 아프고, 피로골절은 5cm 안쪽의 한 점에 압통이 몰립니다(StatPearls). 한 발로 제자리 뛰기를 못 할 정도로 아프거나, 밤에 아파서 깨거나, 붓거나, 저린 느낌이 있으면 다른 문제일 수 있으니 달리기를 멈추고 병원에 가세요. 이 목록은 진단 기준이 아니라 저희의 보수적 기준입니다.",
            },
            {
              q: "초보 러너에게 가장 흔한 부상은 무엇인가요?",
              a: "진단명으로 보면 정강이 통증(내측 경골 스트레스 증후군, MTSS)이 많습니다. 초보 933명 코호트에서 부상당한 254명 중 15%로 가장 많았고, 슬개대퇴 통증 10%, 족저근막염 5%였습니다(Nielsen 2014). 부위로 묶으면 무릎이 가장 많았다는 조사도 있습니다(Kemler 2018).",
            },
            {
              q: "신스플린트에 좋은 깔창이나 치료가 있나요?",
              a: "권할 만큼 검증된 치료는 아직 없습니다. 치료 연구 11편을 모은 체계적 고찰에서 가장 가능성이 보인 것은 체외충격파였고, 다리 보조기·스트레칭·압박 스타킹은 효과가 입증되지 않았습니다(Winters 2013). 깔창은 오히려 사용 이력이 위험 요인과 함께 관찰됐습니다(Newman 2013). 현실적인 대처는 부하 조절 — 아픈 활동을 줄이고 통증 없는 범위에서 천천히 다시 늘리는 것입니다.",
            },
          ]} />
        </div>

        <References n={7} title="참고 자료" note="추천 순서는 광고비로 바뀌지 않습니다. 공개된 연구 자료를 근거로 작성했습니다.">
          <ul className="space-y-2">
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Nielsen et al. (2014)</strong> — 초보 933명 코호트 중 부상 254명의 진단 분포, MTSS 15%. PLOS ONE 9(6):e99877. <a href="https://pubmed.ncbi.nlm.nih.gov/24923269/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Kemler et al. (2018)</strong> — 네덜란드 러너 4,621명, 부상 부위 분포. Phys Sportsmed 46(4):485-491. <a href="https://pubmed.ncbi.nlm.nih.gov/30071170/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Hamstra-Wright et al. (2015)</strong> — MTSS 위험 요인 메타분석(21편). Br J Sports Med 49(6):362-9. <a href="https://pubmed.ncbi.nlm.nih.gov/25185588/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Newman et al. (2013)</strong> — 러너 MTSS 위험 요인 메타분석(10편). Open Access J Sports Med 4:229-41. <a href="https://pubmed.ncbi.nlm.nih.gov/24379729/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Winters et al. (2013)</strong> — MTSS 치료 체계적 고찰(11편). Sports Med 43(12):1315-33. <a href="https://pubmed.ncbi.nlm.nih.gov/23979968/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <span><strong>Lauersen et al. (2014)</strong> — 운동 중재의 스포츠 부상 예방 효과 메타분석. Br J Sports Med 48(11):871-7. <a href="https://pubmed.ncbi.nlm.nih.gov/24100287/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://www.ncbi.nlm.nih.gov/books/NBK538479/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                StatPearls — Medial Tibial Stress Syndrome (5cm 압통 기준·기전 가설·예후) ↗
              </a>
            </li>
          </ul>
        </References>

        <p className="mt-6 text-xs text-gray-400">
          ※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 작성자는 의료인이 아닙니다. 통증이 지속되면 전문의 상담을 권장합니다.
        </p>

        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl">
          <p className="font-medium text-emerald-900 mb-1">내 발에 맞는 러닝화를 찾으세요</p>
          <p className="text-sm text-emerald-800 mb-3">신발이 정강이 통증을 막는다는 근거는 없습니다. 발볼과 쿠션 취향에 맞는 신발을 고르는 용도로 쓰세요.</p>
          <Link href="/shoe-finder" className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            내 러닝화 찾기 →
          </Link>
        </div>
      </article>
    </>
  );
}
