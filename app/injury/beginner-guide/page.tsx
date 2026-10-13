import Link from "next/link";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import { Up, S } from "@/components/guide/Up";
import { Lead, P, H2, H3, Summary, Evidence, References, Basis, Note } from "@/components/guide/Read";
import type { Metadata } from "next";

/**
 * 2026-10-08 재검증 — PubMed 초록과 대조
 *   · 슬개대퇴 원인 「약한 대퇴사두근, 과도한 계단 오르기」 → 대퇴사두근 약화는 군 훈련병에서만 위험 요인(Neal 2019),
 *     계단은 근거 못 찾음 → 삭제. 대처의 「경사 구간 줄이기」도 근거 못 찾음 → 삭제, 강화 운동은 van der Heijden 로 출처 표기
 *   · 신스플린트 원인 「딱딱한 노면·거리 급증」 → 메타분석 위험 요인(BMI·주상골 하강·가동 범위)으로 교체(Hamstra-Wright 2015)
 *   · 신스플린트 대처 → 권할 만큼 검증된 치료 없음(Winters 2013). 거리 줄이기는 경험칙으로 표기
 *   · 「초심자 필수 루틴」 → 워밍업·쿨다운 RCT 에서 부상 감소 없음(van Mechelen 1993). 제목에서 「필수」 삭제
 *   · 신발 문구에 Relph 2022(코크런) 출처 추가
 *
 * 2026-10-13 가독성 재설계 — 머리말 → <Lead>·<Summary>. 섹션마다 답 → 근거(접힘).
 *   숫자·인원·인용은 <Evidence> 안으로. 「초보만 모은 연구 아님」「연구마다 갈림」「남성 취미 러너 16주」는 본문에 남김.
 *   「계속되면 진료」는 부상 카드 본문에. 「경험칙」 → 「저희 제안」 배지. 참고 문헌은 기본 접힘.
 *   머리말의 van Gent·Videbæk 은 원래 링크가 없었다 → 참고 문헌에 이미 있던 같은 PubMed 주소를 <Up> 으로 붙였다(새 출처 아님).
 */
const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/beginner-guide";
const TITLE = "초보 러너 뛰는 법 — 처음 6개월 안 다치고 달리기";
const DESC =
  "러닝을 막 시작했다면. 얼마나 자주·얼마나 늘려야 하는지, 초보에게 흔한 부상 3가지와 대처법까지 정리했습니다.";

export const metadata: Metadata = {
  // 네이버 실측(2026-08): "초보 러너 뛰는법" 노출 73 · CTR 1.4%.
  // 사용자는 '뛰는 법'을 찾는데 제목은 '부상 예방'을 내놓아 의도가 어긋났다.
  title: "초보 러너 뛰는 법 — 처음 6개월 안 다치고 달리기 | 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/beginner-guide" },
};

const WEEK: [string, string, string][] = [
  ["월", "휴식", "완전 휴식 또는 가벼운 스트레칭"],
  ["화", "달리기 20~30분", "편한 페이스 (대화 가능한 속도)"],
  ["수", "휴식 or 걷기", "30분 빠른 걷기 가능"],
  ["목", "달리기 20~30분", "화요일과 동일 페이스"],
  ["금", "휴식", "완전 휴식"],
  ["토", "달리기 30~40분", "이번 주 가장 긴 거리"],
  ["일", "휴식 or 가벼운 걷기", "회복"],
];

export default function BeginnerGuidePage() {
  return (
    <>
      {/**
        * 2026-09-21: headline 이 폐기된 옛 제목이었다. <title>·h1 은 2026-08 에
        * 「초보 러너 뛰는 법」으로 바꿨는데 구조화 데이터만 안 따라왔다 —
        * 구글에 보내는 제목과 사람이 보는 제목이 한 달 넘게 달랐다.
        *
        * description 의 「10% 규칙」도 뺐다. 이 페이지 본문이 *"10%라는 숫자를
        * 뒷받침하는 연구는 없습니다"* 라고 적고 있는데 요약이 그걸 근거처럼 내보내고 있었다.
        */}
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} datePublished="2025-03-01" />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["초보 러너 뛰는 법", "/injury/beginner-guide"],
        ]}
      />
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">🟢 초심자</span>
          <span className="text-xs text-gray-400">꾸준히 1년 미만 · 주 0~3회 · 주 5~20km</span>
          <span className="text-xs text-gray-400">· 5분 읽기</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <Lead>
          러닝을 막 시작했다면 얼마나 자주, 얼마나 늘려야 하는지 정리했습니다. 경력과 부상의 관계는 연구마다 갈리지만, 달린 시간당으로
          보면 초보가 더 자주 다쳤습니다.
        </Lead>
        {/* 2026-10-06: 「연간」을 뺐다 — van Gent 2007 이 모은 연구들은 추적 기간이 제각각이다(초록에 '연간' 없음).
            「처음 6개월이 가장 위험」도 뺐다 — 같은 고찰에서 경력과 부상의 관계는 연구마다 갈린다. */}
        <Evidence n={2}>
          <p>
            연구마다 편차가 크지만, 러너의 하지 부상 발생률은 19.4~79.3%로 보고됩니다.{" "}
            <S>(van Gent et al. (2007) <Up h="https://pubmed.ncbi.nlm.nih.gov/17473005/" />)</S>
          </p>
          <p>
            달린 시간당으로 모아 비교한 메타분석에서는 초보가 더 자주 다쳤습니다(1,000시간당 17.8건 대 취미 러너 7.7건).{" "}
            <S>(Videbæk et al. (2015) <Up h="https://pubmed.ncbi.nlm.nih.gov/25951917/" />)</S>
          </p>
        </Evidence>

        <Summary
          items={[
            <>주간 거리 &lsquo;10% 규칙&rsquo;보다 <strong>가장 길게 뛰는 날을 지난 30일 최장 거리의 110% 안</strong>에서 늘리세요. 성인 러너를 추적한 한 관찰 연구(초보만 모은 연구는 아님)에서 나온 기준입니다.<Basis kind="rule" /></>,
            <>달리기는 <strong>주 3회, 대화가 되는 속도로</strong>. 토요일을 그 주 가장 긴 날로.<Basis kind="rule" /></>,
            <>워밍업·쿨다운은 한 무작위 시험에서 부상을 줄이지 못했습니다. 몸 푸는 용도로 하세요.<Basis kind="paper" /></>,
            <>정강이 통증이 줄지 않고 <strong>계속되면 진료</strong>를 받으세요.<Basis kind="rule" /></>,
          ]}
        />

        {/* 2026-10-06: 경력 개월·주간 km·페이스로 적던 구간은 사이트가 정한 값이었고 근거가 없었다.
            공인 분류는 여전히 없어서, 가장 가까운 정의(Honert 2020 델파이, 본문 Table 3)의 세 축으로 바꿨다.
            페이스는 뺐다 — 그 정의에서 속도 기준은 입문 수준에만 있다. 자세한 이유: lib/guide/stages.ts */}
        <section className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-5">
          <h2 className="text-base font-bold text-green-900">초심자 기준 — 입문(novice) 정의</h2>
          <ul className="mt-3 space-y-1.5 text-[15px] text-green-800">
            <li>• 주 1회 이상 꾸준히 달린 기간 <strong>1년 미만</strong></li>
            <li>• 일주일에 <strong>0~3회</strong></li>
            <li>• 주간 거리 <strong>5~20km</strong></li>
          </ul>
          <p className="mt-3 break-keep text-xs leading-relaxed text-green-700">
            공인된 분류는 없습니다. 신발 연구 전문가 합의에서 쓴 정의를 옮겼고(출처: Honert et al. (2020) PLOS ONE 15(7):e0236047{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/32673375/" target="_blank" rel="noopener noreferrer" className="underline">↗</a>),
            범위가 다른 수준과 겹칩니다.
            지금 넘으려는 거리로 보면 이 글은 1~2단계(처음 → 10km)에 맞습니다. 30분을 아직 못 뛴다면 <Link href="/injury/start-running" className="underline">처음 달리기</Link>부터.{" · "}<Link href="/injury#levels" className="underline">세 수준 비교 표</Link>
          </p>
        </section>

        {/* 10% 규칙
            2026-10-06: 제목이 「10% 규칙 — 가장 중요한 한 가지」였다. 본문이 스스로 「뒷받침하는 연구는 없다」고 적으면서
            제목은 가장 중요하다고 했다. 그 규칙을 직접 시험한 무작위 시험(Buist 2008)은 효과가 없었고,
            더 근거가 있는 기준(Frandsen 2025, 한 번의 긴 달리기)이 있어서 그쪽을 앞에 둔다. /injury/start-running 과 같은 결론. */}
        <h2 id="distance" className={H2}>
          거리는 얼마나 늘려도 될까 — 10% 규칙보다 &lsquo;긴 날 110%&rsquo;
        </h2>
        <P>
          흔히 주간 거리를 <strong>전주 대비 10% 넘게 늘리지 말라</strong>고 합니다. 그런데 이 규칙을 직접 시험한 한 무작위
          시험(초보 532명)에서 부상률은 차이가 없었습니다.
        </P>
        <P>
          더 근거가 있는 기준은 <strong>한 번에 달리는 거리</strong>입니다. 성인 러너 5,205명을 18개월 추적한 한 연구에서, 한 번 달린
          거리가 지난 30일 최장 거리보다 10% 넘게 길면 과사용 부상이 더 많았습니다.
        </P>
        <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-[15px] leading-[1.7] text-emerald-900">
          예) 지난 한 달 가장 길게 뛴 날이 <strong>5km</strong>였다면 → 다음 긴 날은 <strong>5.5km까지</strong>.
        </div>
        <Note>초보만 모은 연구는 아닙니다(평균 45.8세).</Note>
        <Evidence n={2}>
          <p>
            이 규칙을 직접 시험한 무작위 시험에서 초보 532명의 부상률은 10% 규칙 13주 프로그램 20.8%, 일반 8주 프로그램 20.3%로
            차이가 없었습니다. <S>(Buist et al. (2008) <Up h="https://pubmed.ncbi.nlm.nih.gov/17940147/" />)</S>
          </p>
          <p>
            성인 러너 5,205명(평균 45.8세)을 18개월 추적한 연구에서 한 번 달린 거리가 지난 30일 최장 거리보다 10% 넘게 길면 과사용
            부상 비율이 1.52~2.28배였고, 전주 대비 주간 거리 비율은 관계가 없었습니다.{" "}
            <S>(Frandsen et al. (2025) <Up h="https://pubmed.ncbi.nlm.nih.gov/40623829/" />)</S>
          </p>
        </Evidence>

        <h3 className={H3}>주간 거리를 30% 넘게 늘리면?</h3>
        <P>
          초보 러너 874명을 1년간 추적한 연구에서는 뚜렷한 차이를 찾지 못했습니다. 다만{" "}
          <em>안전하다고 증명한 것이 아니라 차이를 찾지 못한 것</em>이므로, 주간 거리를 한꺼번에 크게 늘리는 것은 여전히 피하세요.
          <Basis kind="rule" />
        </P>
        <Evidence n={1}>
          <p>
            초보 러너 874명을 1년간 추적한 연구에서 주간 거리를 30% 넘게 늘린 그룹과 10% 미만으로 늘린 그룹의 전체 부상률은
            통계적으로 유의한 차이가 없었습니다. 거리와 관련된 부상만 따로 보면 위험이 1.59배로 나왔지만 이것도 통계적 유의성에는 못
            미쳤습니다(HR 1.59, 95% CI 0.96–2.66, P=.07).{" "}
            <S>(Nielsen RØ et al. (2014) <Up h="https://doi.org/10.2519/jospt.2014.5164" />)</S>
          </p>
        </Evidence>

        {/* 초심자 흔한 부상 Top 3 */}
        <h2 id="injuries" className={H2}>
          초보가 자주 아픈 곳 세 가지
        </h2>
        <div className="mt-5 flex flex-col gap-4">
          {/* ⚠️ 2026-09-14: "16~25%" 였고 근거로 van Gent 2007 을 달았다.
              그 초록에 있는 건 전체 발생률 19.4~79.3% 와 "무릎이 가장 흔한 부위"뿐이고
              슬개대퇴만의 비율은 없다. 저장소 자신의 shin-splints:158 은
              Nielsen 2014 PLOS ONE 으로 **10%** 를 적는다. 그 값으로 맞춘다. */}
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-semibold text-gray-900">슬개대퇴 증후군 (러너 무릎)</p>
            <p className="mt-0.5 text-xs text-gray-500">발생 빈도: 부상당한 초보 러너의 약 10% · 빈도 Nielsen et al. (2014) PLOS ONE</p>
            <p className="mt-2 break-keep text-[15px] leading-[1.7] text-gray-800">
              <span className="font-medium">원인:</span> 분명하지 않습니다.
            </p>
            <p className="mt-1 break-keep text-[15px] leading-[1.7] text-gray-800">
              <span className="font-medium">대처:</span> 대퇴사두근·엉덩이 근육 강화 운동.
              <Basis kind="paper" /> 긴 날을 한꺼번에 늘리지 않기.
              <Basis kind="rule" />
            </p>
            <Note>강화 운동 근거의 질은 매우 낮지만, 통증을 줄인다는 결과는 일관됩니다.</Note>
            <Evidence n={2}>
              <p>
                대퇴사두근이 약한 사람에게서 더 생겼다는 근거가 있지만 군 훈련병 연구에서 나온 결과이고, 엉덩이 근육 약화는 위험
                요인이 아니었습니다. <S>(Neal et al. (2019) <Up h="https://pubmed.ncbi.nlm.nih.gov/30242107/" />)</S>
              </p>
              <p>
                대퇴사두근·엉덩이 근육 강화 운동은 근거의 질은 매우 낮지만 통증을 줄인다는 결과가 일관되고, 무릎 운동만 하는 것보다
                엉덩이 운동을 함께 할 때 통증이 더 줄었습니다.{" "}
                <S>(van der Heijden et al. (2016) <Up h="https://pubmed.ncbi.nlm.nih.gov/26158920/" />)</S>
              </p>
            </Evidence>
          </div>

          {/* ⚠️ 2026-09-14: "초심자 부상의 10~15%" 에 Galbraith & Lavallee (2009) 를 달았는데
              그 논문은 **보존적 치료 옵션 리뷰**이지 역학 조사가 아니다(링크도 없었다).
              저장소 자신의 shin-splints:158 은 Nielsen 2014 로 **15%** 를 적는다. */}
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
            <p className="font-semibold text-gray-900">정강이 통증 (신스플린트)</p>
            <p className="mt-0.5 text-xs text-gray-500">발생 빈도: 부상당한 초보 러너의 약 15% · 빈도 Nielsen et al. (2014) PLOS ONE</p>
            <p className="mt-2 break-keep text-[15px] leading-[1.7] text-gray-800">
              <span className="font-medium">원인:</span> 체질량지수가 높은 것, 발 아치가 많이 내려앉는 것 등이 위험 요인으로
              꼽힙니다. 노면의 영향은 확인된 연구가 없습니다.
            </p>
            <p className="mt-1 break-keep text-[15px] leading-[1.7] text-gray-800">
              <span className="font-medium">대처:</span> 권할 만큼 효과가 확실히 검증된 치료는 아직 없습니다. 통증이 줄 때까지 거리를
              줄이고<Basis kind="rule" />, <strong>계속되면 진료를 받으세요.</strong>
            </p>
            <Evidence n={2}>
              <p>
                메타분석에서 확인된 위험 요인은 체질량지수가 높은 것, 발 아치가 많이 내려앉는 것(주상골 하강), 발목·고관절 가동
                범위가 큰 것이었습니다. 노면의 영향은 확인된 연구가 없습니다.{" "}
                <S>(Hamstra-Wright et al. (2015) <Up h="https://pubmed.ncbi.nlm.nih.gov/25185588/" />)</S>
              </p>
              <p>
                권할 만큼 효과가 확실히 검증된 치료는 아직 없습니다.{" "}
                <S>(Winters et al. (2013) <Up h="https://pubmed.ncbi.nlm.nih.gov/23979968/" />)</S>
              </p>
            </Evidence>
          </div>

          {/* ⚠️ 2026-09-14: "초심자 85%가 경험" + "Lipman & Haddad (2016) Foot Ankle Clin".
              Europe PMC 에서 이 저자·저널·연도 조합의 논문을 **찾지 못했다**(0건). 링크도 없었다.
              정밀한 %에 확인 안 되는 서지가 붙은 형태 — AGENTS.md §1 의 작화 패턴과 같다.
              수치와 서지를 둘 다 뺀다. 증상 자체는 흔한 것이 맞으므로 항목은 남긴다. */}
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
            <p className="font-semibold text-gray-900">
              물집·흑색 발톱
              <Basis kind="rule" />
            </p>
            <p className="mt-0.5 text-xs text-gray-500">발생 빈도: 초보에게 흔함 (정확한 비율은 확인된 자료 없음) · 인용 없음</p>
            <p className="mt-2 break-keep text-[15px] leading-[1.7] text-gray-800">
              <span className="font-medium">원인:</span> 사이즈 미스매치, 양말 소재 불량, 긴 발톱
            </p>
            <p className="mt-1 break-keep text-[15px] leading-[1.7] text-gray-800">
              <span className="font-medium">대처:</span> 러닝화는 엄지발가락 1cm 여유, 기능성 양말 착용, 발톱 짧게 유지
            </p>
          </div>
        </div>

        {/* 준비운동 & 쿨다운
            2026-10-08: 제목이 「초심자 필수 루틴」이었다. 워밍업·쿨다운·스트레칭 무작위 시험(van Mechelen 1993)에서
            부상이 줄지 않았고, 이 페이지 FAQ 도 「근거는 약합니다」라고 적는다. 「필수」를 뺐다. */}
        <h2 id="routine" className={H2}>
          달리기 전후 루틴, 꼭 해야 하나요?
        </h2>
        <P>
          <strong>부상을 줄인다는 근거는 확인되지 않았습니다.</strong> 남성 취미 러너 421명을 나눈 16주 무작위 시험에서
          워밍업·쿨다운·스트레칭을 한 그룹의 부상이 줄지 않았습니다. 몸을 풀고 마무리하는 용도로 쓰세요.
        </P>
        <Evidence n={1}>
          <p>
            남성 레크리에이션 러너 421명을 무작위로 나눈 16주 시험에서 워밍업·쿨다운·스트레칭을 한 그룹의 부상은 1,000시간당 5.5건,
            하지 않은 그룹은 4.9건으로 줄지 않았습니다.{" "}
            <S>(van Mechelen et al. (1993) <Up h="https://pubmed.ncbi.nlm.nih.gov/8238713/" />)</S>
          </p>
        </Evidence>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="mb-2 font-semibold text-emerald-900">달리기 전 (5분)</p>
            <ul className="space-y-1 break-keep text-sm text-emerald-800">
              <li>• 제자리 걷기 1분</li>
              <li>• 레그 스윙 10회 × 양발</li>
              <li>• 힙 써클 10회 × 양발</li>
              <li>• 런지 워크 10보</li>
            </ul>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="mb-2 font-semibold text-blue-900">달리기 후 (5분)</p>
            <ul className="space-y-1 break-keep text-sm text-blue-800">
              <li>• 종아리 스트레칭 30초 × 2</li>
              <li>• 햄스트링 스트레칭 30초 × 2</li>
              <li>• 고관절 굴곡근 30초 × 2</li>
              <li>• 천천히 걷기 2분</li>
            </ul>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          {/* 2026-08-28 정정: 링크가 PMID 21302337로 걸려 있었는데 그건 비선형 광학
              유기금속 화합물 논문이다(Adv Mater). 러닝과 아무 관계가 없다.
              올바른 PMID는 21373870. 설명도 논문이 실제로 말한 것으로 바꾼다. */}
          출처: Behm & Chaouachi (2011) <a href="https://pubmed.ncbi.nlm.nih.gov/21373870/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">EJAP — 정적·동적 스트레칭의 즉각적 효과 리뷰</a>
        </p>

        {/* 주간 훈련 계획 */}
        <h2 id="week" className={H2}>
          일주일에 몇 번 달릴까 — 주간 패턴 예시
        </h2>
        <P>
          <strong>주 3회, 대화가 되는 편한 속도</strong>로 달리고 사이사이 쉽니다. 토요일을 그 주 가장 긴 날로 둡니다.
          <Basis kind="rule" />
        </P>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-[15px]">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="whitespace-nowrap p-2.5">요일</th>
                <th className="p-2.5">활동</th>
                <th className="p-2.5">비고</th>
              </tr>
            </thead>
            <tbody>
              {WEEK.map(([day, act, note]) => (
                <tr key={day} className="border-t border-gray-100">
                  <td className="p-2.5 font-medium text-gray-900">{day}</td>
                  <td className="break-keep p-2.5 text-gray-700">{act}</td>
                  <td className="break-keep p-2.5 text-sm text-gray-500">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Note>위 빈도는 저희가 정한 기준입니다. &lsquo;주 3회가 최적&rsquo;이라는 특정 논문 근거는 확인하지 못했습니다.</Note>

        <YoutubeSection links={[
          { label: "러닝 전 꼭 해야 할 동적 스트레칭 — 초심자 5분 루틴", url: "https://www.youtube.com/watch?v=rEj3vyacaw4" },
          { label: "10km 대회, 이 영상으로 종결 — 완벽 준비 가이드", channel: "달려라하나", url: "https://www.youtube.com/watch?v=3oS5VzHTW3A" },
          { label: "무릎 앞 통증 한방에 해결 — 슬개대퇴통증증후군", channel: "알쓸물치", url: "https://www.youtube.com/watch?v=69TZ8_yYDp4" },
          { label: "5분만에 끝나는 러닝 후 스트레칭", channel: "지니코치", url: "https://www.youtube.com/watch?v=bsWU6ata_tw" },
          { label: "초보러너 10km 준비 Q&A — 페이스·훈련 완전 정리", channel: "션과 함께", url: "https://www.youtube.com/watch?v=B4A61x6T3ao" },
          { label: "달리기 전 꼭 해야 할 동적 스트레칭 #Shorts", url: "https://www.youtube.com/shorts/rEj3vyacaw4" },
        ]} />

        <div className="mt-10 rounded-2xl bg-emerald-50 p-6 text-center">
          {/* 2026-10-06: 「초심자에게 맞는 신발이 부상 위험을 줄입니다」였다 — 이 사이트의 다른 글(평발·허브)이
              적는 결론과 반대다. 엔진 v4 에서 체형 축도 뺐으므로 「체형」 문구도 뺀다. */}
          <p className="mb-2 break-keep font-medium text-emerald-900">신발로 부상을 막는다는 근거는 약합니다. 다만 발볼·사이즈는 맞춰야 합니다</p>
          <p className="mb-3 break-keep text-xs text-emerald-800">
            12편 11,240명을 모은 고찰에서 신발 종류를 바꿔 부상이 줄었다는 결과는 대부분 확인되지 않았습니다{" "}
            <S>(Relph et al. (2022) <Up h="https://pubmed.ncbi.nlm.nih.gov/35993829/" />)</S>
          </p>
          <Link href="/shoe-finder" className="inline-block rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
            발볼·발 타입으로 신발 찾기 →
          </Link>
        </div>

        <div className="mt-14">
          <FaqSection items={[
            {
              q: "초보 러너가 가장 먼저 지켜야 할 한 가지는?",
              a: "한 번에 길게 뛰는 날을 조심하는 것입니다. 5,205명을 18개월 추적한 연구에서 한 번 달린 거리가 지난 30일 최장 거리보다 10% 넘게 길면 부상이 늘었습니다(Frandsen 2025). 흔히 말하는 '10% 규칙'(주간 거리를 전주 대비 10% 넘게 늘리지 않기)은 무작위 시험에서 부상을 줄이지 못했습니다(Buist 2008).",
            },
            {
              q: "거리를 급하게 늘리면 정말 위험한가요?",
              a: "생각보다 근거가 약합니다. 초보 러너 874명을 1년간 추적한 연구(Nielsen 2014, JOSPT)에서 주간 거리를 30% 넘게 늘린 그룹과 10% 미만으로 늘린 그룹의 전체 부상률은 통계적으로 유의한 차이가 없었습니다. 거리 관련 부상만 보면 1.59배였지만 이것도 유의성에는 못 미쳤습니다(P=.07). 다만 '차이가 없다고 증명된 것'이 아니라 '차이를 찾지 못한 것'이므로, 급격한 증가는 여전히 피하는 편이 안전합니다.",
            },
            {
              q: "달리기 시작 후 언제가 가장 부상 위험이 큰가요?",
              a: "특정 시기가 가장 위험하다고 말할 근거는 저희가 확인하지 못했습니다. 다만 달린 시간당으로 보면 초보가 레크리에이션 러너보다 더 자주 다쳤습니다(Videbæk 2015 메타분석). 워밍업·쿨다운이 부상을 막는다는 근거는 약합니다 — 러너 421명 무작위 시험에서 부상이 줄지 않았습니다(van Mechelen 1993). 긴 날을 지난 30일 최장 거리의 110% 안에서 늘리고, 다음 날 통증을 확인하세요.",
            },
          ]} />
        </div>

        <References n={14}>
          <ul>
            <li><strong>van Gent et al. (2007)</strong> — 러닝 부상 발생률 및 결정요인 체계적 고찰. 하지 부상 발생률 19.4~79.3%. BJSM 41(8):469-480. <a href="https://pubmed.ncbi.nlm.nih.gov/17473005/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Nielsen RØ et al. (2014)</strong> — 주간 거리 증가폭과 부상. 초보 러너 874명 1년 추적. 전체 부상률에서 유의차 없음. JOSPT 44(10):739-747. <a href="https://doi.org/10.2519/jospt.2014.5164" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">DOI →</a></li>
            <li><strong>Nielsen RO et al. (2014)</strong> — 부상당한 초보 러너 254명의 회복 기간 전향 연구. 부상 종류별 비율(정강이 통증 15%, 슬개대퇴 통증 10% 등). PLoS One 9(6):e99877. <a href="https://doi.org/10.1371/journal.pone.0099877" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">DOI →</a></li>
            <li><strong>Buist et al. (2008)</strong> — 초보 532명 무작위 시험. 10% 규칙 13주 프로그램과 일반 8주 프로그램의 부상률 20.8% 대 20.3%. Am J Sports Med 36(1):33-9. <a href="https://pubmed.ncbi.nlm.nih.gov/17940147/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Frandsen et al. (2025)</strong> — 성인 러너 5,205명 18개월 추적. 한 번 달린 거리가 30일 최장 거리의 110%를 넘으면 과사용 부상 증가. Br J Sports Med 59(17):1203-1210. <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Videbæk et al. (2015)</strong> — 1,000시간당 부상 메타분석(13편). 초보 17.8건, 레크리에이션 러너 7.7건. Sports Med 45(7):1017-26. <a href="https://pubmed.ncbi.nlm.nih.gov/25951917/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Honert et al. (2020)</strong> — 러닝 수준별 신발 특성 델파이 연구. 이 글의 초심자 기준(입문 정의)의 출처. PLOS ONE 15(7):e0236047. <a href="https://pubmed.ncbi.nlm.nih.gov/32673375/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Behm & Chaouachi (2011)</strong> — 정적·동적 스트레칭이 수행능력에 미치는 즉각적 효과 리뷰. 동적 스트레칭은 수행능력을 떨어뜨리지 않거나 오히려 높였다. Eur J Appl Physiol 111:2633-2651. <a href="https://pubmed.ncbi.nlm.nih.gov/21373870/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>van Mechelen et al. (1993)</strong> — 워밍업·쿨다운·스트레칭 교육 무작위 시험(남성 레크리에이션 러너 421명, 16주). 부상 1,000시간당 5.5건 대 4.9건, 효과 없음. <a href="https://pubmed.ncbi.nlm.nih.gov/8238713/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Neal et al. (2019)</strong> — 슬개대퇴 통증 위험 요인 메타분석(18편, 4,818명). 대퇴사두근 약화는 군 훈련병에서 위험 요인, 엉덩이 근육 약화는 위험 요인 아님. <a href="https://pubmed.ncbi.nlm.nih.gov/30242107/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>van der Heijden et al. (2016)</strong> — 슬개대퇴 통증 운동치료 코크런 고찰 요약본(31편, 1,690명). 근거의 질은 매우 낮지만 운동치료가 통증을 줄인다는 결과가 일관됨. <a href="https://pubmed.ncbi.nlm.nih.gov/26158920/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Hamstra-Wright et al. (2015)</strong> — 내측 경골 스트레스 증후군 위험 요인 메타분석(21편). 체질량지수·주상골 하강·발목 저측굴곡·고관절 외회전 가동 범위. <a href="https://pubmed.ncbi.nlm.nih.gov/25185588/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Winters et al. (2013)</strong> — 내측 경골 스트레스 증후군 치료 체계적 고찰(11편). 편향이 적어 권할 수 있는 치료 없음. <a href="https://pubmed.ncbi.nlm.nih.gov/23979968/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
            <li><strong>Relph et al. (2022)</strong> — 러닝화와 부상 예방 코크런 고찰(12편, 11,240명). 신발 종류를 비교한 연구 대부분에서 부상 감소 없음, 근거 확실성은 낮음~매우 낮음. <a href="https://pubmed.ncbi.nlm.nih.gov/35993829/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a></li>
          </ul>
        </References>
        <p className="mt-6 text-xs text-gray-400">※ 이 콘텐츠는 의학적 진단을 대체하지 않습니다. 지속적 통증은 전문의 상담을 권장합니다.</p>
      </article>
    </>
  );
}
