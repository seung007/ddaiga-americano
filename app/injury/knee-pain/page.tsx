import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import InlineAsk from "@/components/InlineAsk";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ShareButtons from "@/components/ShareButtons";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Up, S } from "@/components/guide/Up";
import type { Metadata } from "next";

const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/knee-pain";

/**
 * 2026-10-07 재검증 — 「원인」 절이 전향 연구 메타분석과 반대였다.
 *
 *   본문: 「① 약한 고관절 외전근 ② 갑작스러운 거리 증가 ③ 딱딱한 신발 또는 마모된 쿠션」, 근거 표시 없음.
 *   Neal 2019(BJSM, 전향 연구 18편·4,818명): 고관절 근력 약화는 **위험 요인이 아니었다**(중간 근거).
 *   나이·키·체중·BMI·체지방·Q각도 아니었다. 군인에서 대퇴사두근 약화만 위험 요인. ③ 은 같은 글 아래 「신발과의 관계」와도 모순.
 *   「달리기를 시작한 지 한두 달」도 근거가 없어 뺐다(장경인대 글에서 같은 문장을 뺀 것과 같은 이유).
 *
 *   러너 대상 무작위 시험(Esculier 2018)에서 교육만 받은 그룹과 운동·주법 교정을 더한 그룹의 회복이 같았다 — 이 글의 중심으로 올린다.
 *   맨 아래 CTA 의 「체중과 부상 이력을 넣으면 쿠션이 충분한 신발을 우선 추천」은 엔진 v4(체중→쿠션 경로 제거)와 맞지 않아 고쳤다.
 */
const TITLE = "러너 무릎(슬개대퇴 통증) — 무릎 앞 통증, 무엇이 효과 있나";
const DESC =
  "계단을 내려갈 때 무릎 앞이 아프다면. 흔히 말하는 원인 상당수가 전향 연구에서 예측 요인이 아니었고, 러너 69명 시험에서는 부하 관리 교육만으로도 운동을 더한 것과 같은 회복을 보였습니다.";

export const metadata: Metadata = {
  title: "러너 무릎(슬개대퇴 증후군) 대처법 — 무릎 앞 통증, 논문으로 확인한 것 | 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/knee-pain" },
};

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} datePublished="2025-03-01" />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["러너 무릎", "/injury/knee-pain"],
        ]}
      />
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 러닝 가이드
        </Link>
        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full mb-3">무릎</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">{TITLE}</h1>
          {/* 2026-09-14: 「5분」인데 본문이 383자였다. 위치별 분기·감별 신호를 넣어 1,472자.
              분당 500자로 3분. */}
          {/* 2026-09-22: 2,028자 ÷ 600. 규약은 app/injury/page.tsx 상단 주석 */}
          <p className="text-gray-500 text-sm mb-4">7분 읽기</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            협찬 없이 작성 — 공개 연구 및 의학 자료 기반
          </div>
        </header>
        {/**
         * 위치별 분기 (2026-09-14 추가)
         *
         * 실측으로 드러난 어긋남: 이 페이지로 들어오는 검색어가
         * **「러닝 후 무릎 옆 통증」(39노출)** 인데, 페이지는 전부
         * **무릎 앞쪽(슬개대퇴 증후군)** 얘기다. 「무릎 옆」은 장경인대염이고
         * `/injury/it-band` 에 따로 있다. **들어온 사람이 틀린 답을 받고 있었다.**
         *
         * 그래서 맨 위에서 위치로 가른다. 진단을 하는 게 아니라 **길을 알려준다** —
         * 세 칸 모두 이 저장소에 이미 인용과 함께 존재하는 페이지로 보낸다.
         *
         * 감별 신호도 같이 넣는다. 전수 조사 결과 이 페이지에는 「병원에 가세요」
         * 한 줄(※)은 있었지만 **「이럴 땐 위험하다」가 없었다** — 22개 중 6개에만 있었다.
         * 문구는 `it-band`·`shin-splints`·`achilles` 가 이미 쓰는 기준을 따랐다.
         * 새 진단명은 쓰지 않았다.
         */}
        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">먼저 — 무릎 어디가 아프신가요?</p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-900">
            같은 &ldquo;무릎 통증&rdquo;이어도 아픈 자리에 따라 완전히 다른 문제입니다.
          </p>
          <div className="mt-3 space-y-2">
            <div className="rounded-xl border border-emerald-200 bg-white p-3">
              <p className="text-sm font-semibold text-gray-900">무릎 앞쪽 · 슬개골 주변</p>
              <p className="mt-0.5 text-sm text-gray-600">
                계단 내려갈 때, 오래 앉았다 일어날 때 아픔 → <strong>이 글이 맞습니다.</strong> 아래로 읽으세요.
              </p>
            </div>
            <Link
              href="/injury/it-band"
              className="block rounded-xl border border-emerald-200 bg-white p-3 transition-colors hover:border-emerald-400"
            >
              <p className="text-sm font-semibold text-gray-900">무릎 바깥쪽 (옆) →</p>
              <p className="mt-0.5 text-sm text-gray-600">
                일정 거리를 지나면 옆이 아프고, 멈추면 괜찮아짐 → 장경인대염 글로
              </p>
            </Link>
            <Link
              href="/injury/shin-splints"
              className="block rounded-xl border border-emerald-200 bg-white p-3 transition-colors hover:border-emerald-400"
            >
              <p className="text-sm font-semibold text-gray-900">무릎 아래 · 정강이 안쪽 →</p>
              <p className="mt-0.5 text-sm text-gray-600">
                뼈를 따라 길게 아픔 → 정강이 통증 글로
              </p>
            </Link>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-semibold text-red-900">달리기를 멈추고 병원에 가야 할 때</p>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-red-900">
            <li>· 달리지 않을 때도, 걸을 때도 아프다</li>
            <li>· 무릎이 <strong>붓거나 열감</strong>이 있다</li>
            <li>· 무릎에 <strong>힘이 갑자기 빠지거나</strong> 걸리는 느낌이 든다</li>
            <li>· 쉬었는데도 <strong>2주 넘게</strong> 그대로다</li>
          </ul>
          <p className="mt-2 text-xs leading-relaxed text-red-800">
            아래 예방 운동은 이런 신호가 <strong>없을 때</strong> 하는 것입니다. 자가진단하지 마세요.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-emerald-200 bg-white p-5">
          <p className="text-sm font-semibold text-emerald-900">먼저 결론</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-gray-800">
            <li>계단을 내려가거나 오래 앉았다 일어날 때 무릎 앞이 아프면 의심합니다. 부상당한 초보 러너의 약 10%.</li>
            <li>
              흔히 말하는 원인 상당수는 <strong>예측 요인이 아니었습니다</strong> — 체중·BMI·Q각, 그리고 엉덩이 근력 약화까지.
            </li>
            <li>
              러너 69명 시험에서 <strong>증상·훈련량 관리 교육만 받은 그룹</strong>이 운동이나 주법 교정을 더한 그룹과 똑같이 좋아졌습니다.
            </li>
            <li>이미 아프면 엉덩이 운동과 무릎 운동을 <strong>함께</strong>, 필요하면 발 보조기. 테이핑·주법 교정은 효과가 불확실합니다.</li>
            <li>오래 갈 수 있습니다. 증상이 12개월 넘게 이어진 사람은 예후가 나빴습니다.</li>
          </ol>
        </div>

        <TableOfContents
          items={[
            { id: "cause", label: "원인 — 확인된 것과 아닌 것" },
            { id: "what-works", label: "무엇이 효과 있나" },
            { id: "how-long", label: "얼마나 걸리나" },
            { id: "shoes", label: "신발과의 관계" },
            { id: "refs", label: "참고 자료" },
          ]}
        />

        <p className="text-lg leading-relaxed mb-8 text-gray-700">
          슬개대퇴 통증(러너 무릎)은 부상당한 초보 러너 254명 중 약 10%로, 정강이 통증(15%) 다음으로 많았습니다.{" "}
          <S>(Nielsen et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/24923269/" />)</S>{" "}
          네덜란드 러너 4,621명 조사에서도 초보·경력자 모두 부상 부위 1위가 무릎(30.5%)이었습니다.{" "}
          <S>(Kemler et al. (2018) <Up h="https://pubmed.ncbi.nlm.nih.gov/30071170/" />)</S>
        </p>

        <section className="mb-8">
          <h2 id="cause" className="text-xl font-bold text-gray-900 mb-4">원인 — 확인된 것과 아닌 것</h2>
          <p className="leading-relaxed text-gray-700">
            나중에 슬개대퇴 통증이 생기는지를 미리 추적한 전향 연구 18편(4,818명)을 모은 메타분석입니다.{" "}
            <S>(Neal et al. (2019) <Up h="https://pubmed.ncbi.nlm.nih.gov/30242107/" />)</S>
          </p>
          <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-gray-700">
            <li>
              <strong>위험 요인이 아니었던 것</strong> — 나이, 키, 체중, BMI, 체지방, Q각(강~중간 근거). <strong>엉덩이 근력 약화</strong>도
              위험 요인이 아니었습니다(중간 근거).
            </li>
            <li>
              <strong>위험 요인이었던 것</strong> — 군인에서 대퇴사두근(허벅지 앞) 약화. 청소년에서는 오히려 엉덩이 외전 근력이 높을수록 위험했습니다.
            </li>
            <li>
              <strong>러너만 따로 본 결론은 약합니다.</strong> 레크리에이션 러너는 세 하위 그룹 중 하나였고, 저자들은 바꿀 수 있는 위험 요인을 찾는
              것이 시급하다고 했습니다.
            </li>
          </ul>
          <p className="mt-3 text-sm text-gray-600">
            &lsquo;엉덩이가 약해서 무릎이 안으로 쏠려 아프다&rsquo;는 설명은 아픈 사람을 치료할 때 쓰는 논리이지, 미리 예측된 원인은 아닙니다.
            거리를 한꺼번에 늘리는 것은 슬개대퇴만 따로 본 근거는 아니지만 과사용 부상 전반의 위험 신호입니다 →{" "}
            <Link href="/injury/start-running#long-day" className="text-emerald-700 underline">한 번에 길게 뛰는 날</Link>
          </p>
        </section>

        <section className="mb-8">
          <h2 id="what-works" className="text-xl font-bold text-gray-900 mb-4">무엇이 효과 있나</h2>

          <h3 className="mt-2 font-bold text-gray-900">1. 증상·훈련량 관리 — 기본</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-gray-700">
            슬개대퇴 통증이 있는 러너 69명을 8주 동안 ① 증상 관리·훈련 조절 교육만 ② 교육 + 운동 ③ 교육 + 주법 교정으로 나눴습니다. 4·8·20주에
            <strong> 세 그룹 모두 비슷하게 좋아졌고</strong>, 운동 그룹은 무릎 펴는 근력이, 주법 교정 그룹은 케이던스(+7.0%)가 늘었지만 증상에는
            추가 이득이 없었습니다. 저자들은 증상과 훈련량 관리 교육을 치료의 중심에 두라고 결론 냈습니다.{" "}
            <S>(Esculier et al. (2018) <Up h="https://pubmed.ncbi.nlm.nih.gov/28476901/" />)</S>
          </p>
          <p className="mt-2 text-sm text-gray-600">
            실천: 통증 점수를 기준으로 거리·속도·내리막을 조절합니다 →{" "}
            <Link href="/injury/return-to-running#rest-or-run" className="text-emerald-700 underline">통증 모니터링 모델</Link>(경험칙 적용)
          </p>

          <h3 className="mt-6 font-bold text-gray-900">2. 운동 — 엉덩이와 무릎을 함께</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-gray-700">
            41명 전문가 국제 합의문은 운동치료, 특히 <strong>엉덩이 운동과 무릎 운동의 조합</strong>, 여러 중재의 병행, 그리고 <strong>발
            보조기</strong>를 통증·기능 개선에 권고했습니다. 무릎·허리 도수 가동술 단독과 전기치료는 권고하지 않았고, 테이핑·보조기(브레이스)·침·
            연부조직 기법·혈류제한 훈련·주법 교정은 불확실로 분류했습니다. 이미 아픈 사람의 치료 권고이고 예방 권고는 아닙니다.{" "}
            <S>(Collins et al. (2018) <Up h="https://pubmed.ncbi.nlm.nih.gov/29925502/" />)</S>
          </p>
          <div className="mt-3 space-y-3">
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-gray-400">1</span>
                <h4 className="font-bold text-gray-900">클램셸 (엉덩이)</h4>
                <span className="ml-auto text-sm font-semibold text-emerald-700">15회 × 3세트</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">옆으로 누워 무릎을 굽힌 채 위쪽 다리를 조개껍데기처럼 벌립니다.</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-gray-400">2</span>
                <h4 className="font-bold text-gray-900">스텝다운 (무릎)</h4>
                <span className="ml-auto text-sm font-semibold text-emerald-700">10회 × 3세트</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                계단 끝에 서서 한쪽 다리로 천천히 내려옵니다. 무릎이 발가락 방향을 유지하도록 합니다.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-gray-400">3</span>
                <h4 className="font-bold text-gray-900">벽 기대 반 스쿼트 (허벅지 앞)</h4>
                <span className="ml-auto text-sm font-semibold text-emerald-700">30초 × 3회</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                벽에 등을 대고 무릎을 아프지 않은 각도까지만 굽혀 버팁니다. 통증 점수가 5를 넘으면 각도를 줄입니다.
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            위 세 가지는 이 사이트의 예시입니다. 합의문은 운동 종류를 엉덩이·무릎 운동의 조합으로 권고했을 뿐 특정 동작을 정하지 않았습니다. 폼롤러
            같은 연부조직 기법은 「불확실」입니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 id="how-long" className="text-xl font-bold text-gray-900 mb-4">얼마나 걸리나</h2>
          <p className="text-[15px] leading-relaxed text-gray-700">
            슬개대퇴 통증은 저절로 낫는다고 여겨져 왔지만, 무작위 시험 두 개의 참가자를 5~8년 뒤 다시 조사했더니 응답한 60명 중{" "}
            <strong>57%가 회복이 충분하지 않다</strong>고 답했습니다. 다만 무릎 관절염 소견은 50명 중 48명(98%)에게 없었고, 처음 증상이 12개월 넘게
            이어졌던 사람의 예후가 나빴습니다. 응답률이 19.3%로 낮다는 한계가 있습니다.{" "}
            <S>(Lankhorst et al. (2016) <Up h="https://pubmed.ncbi.nlm.nih.gov/26463119/" />)</S>
          </p>
          <p className="mt-2 text-sm text-gray-600">오래 끌수록 불리하니, 몇 주 지나도 나아지지 않으면 진료를 받으세요(경험칙).</p>
        </section>

        <FinderCta from="knee-pain" variant="inline" headline="신발로 무릎 통증이 낫는다는 근거는 약합니다. 다만 발볼·사이즈가 안 맞는 신발은 바꾸는 게 맞습니다." />
        {/**
         * ⚠️ 2026-09-14 — 이 절은 원래 「쿠셔닝 2 이하는 슬개골에 충격」「과회내면 안정화」였다. 둘 다 근거 없음.
         * 2026-10-07: 합의문이 **발 보조기(foot orthoses)** 는 권고한다는 사실을 덧붙였다 — 「신발 권고 없음」만 적으면
         * 보조기까지 근거가 없는 것처럼 읽힌다. 보조기는 신발의 쿠션·안정화 등급과 다른 물건이다.
         */}
        <section className="mb-8">
          <h2 id="shoes" className="text-xl font-bold text-gray-900 mb-4">신발과의 관계</h2>
          <p className="leading-relaxed text-gray-700 mb-4">
            <strong>신발로 무릎 통증을 해결한다는 근거는 약합니다.</strong> 위 합의문은 신발의 쿠셔닝이나 안정화 기능에 대한 권고를 하지 않았습니다.
            권고한 것은 운동과 <strong>발 보조기(깔창형 교정구)</strong>입니다 — 신발 등급과는 다른 물건입니다.
          </p>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
            특히 <strong>&ldquo;평발이면 안정화화&rdquo;</strong>를 무릎 통증 해법으로 볼 근거는 없습니다. 발 타입에 맞춰 회내 제어 신발을 처방하는
            관행을 검토한 체계적 고찰은 그 관행을 뒷받침하는 연구를 찾지 못했습니다. 자세한 내용은{" "}
            <Link href="/injury/flat-feet" className="font-medium text-emerald-700 underline">
              평발 러닝화 글
            </Link>
            에 있습니다.
          </div>
          <p className="mt-4 leading-relaxed text-gray-700">
            다만 <strong>쿠션이 다 닳은 신발은 바꾸는 게 맞습니다.</strong> 이건 무릎 정렬과는 다른 얘기입니다.
          </p>
        </section>

        <section className="mb-6">
          <h2 id="refs" className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <p className="mb-2 text-xs text-gray-400">2026-10-07 PubMed 초록과 대조했습니다.</p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <strong>Neal et al. (2019)</strong> — 슬개대퇴 통증 위험 요인 메타분석(전향 연구 18편). Br J Sports Med 53(5):270-281.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/30242107/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
            <li>
              <strong>Esculier et al. (2018)</strong> — 러너 69명, 교육 단독 대 교육+운동 대 교육+주법 교정 무작위 시험. Br J Sports Med 52(10):659-666.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/28476901/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
            <li>
              <strong>Collins et al. (2018)</strong> — 슬개대퇴 통증 운동치료·물리 중재 국제 합의문. Br J Sports Med 52(18):1170-1178.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/29925502/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
            <li>
              <strong>Lankhorst et al. (2016)</strong> — 진단 5~8년 뒤 예후 예측 요인. Br J Sports Med 50(14):881-6.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/26463119/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
            <li>
              <strong>Nielsen et al. (2014)</strong> — 부상당한 초보 러너 254명, 정강이 15%·슬개대퇴 10%. PLOS ONE 9(6):e99877.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/24923269/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
            <li>
              <strong>Kemler et al. (2018)</strong> — 초보·경력 러너 4,621명 부상 부위 비교. Phys Sportsmed 46(4):485-491.{" "}
              <a href="https://pubmed.ncbi.nlm.nih.gov/30071170/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
            </li>
          </ul>
          <p className="mt-3 text-xs text-gray-400">추천 순서는 광고비로 바뀌지 않습니다.</p>
        </section>

        <YoutubeSection links={[
          { label: "무릎 앞 통증 한방에 해결! 슬개대퇴통증증후군 마사지·운동법", channel: "알쓸물치", url: "https://www.youtube.com/watch?v=69TZ8_yYDp4" },
          { label: "무릎통증 러너 필수 시청 — 이것만 풀어도 사라집니다", channel: "통증요정 김학조", url: "https://www.youtube.com/watch?v=kCYjn49dJm0" },
          { label: "무릎 통증 세 가지만 기억하라! (명지병원 정형외과)", channel: "명지병원-MYONGJI HOSPITAL", url: "https://www.youtube.com/watch?v=bKcjVC3jus0" },
          { label: "무릎 부상 후 재활 운동 5단계", channel: "피지오스튜디오 PHYSIOSTUDIO", url: "https://www.youtube.com/shorts/Ixvh9w5uEYs" },
        ]} />

        <FaqSection items={[
          {
            q: "계단을 내려갈 때 무릎 앞쪽이 아픈 건 무슨 부상인가요?",
            a: "계단을 내려가거나 오래 앉았다 일어날 때 무릎 앞이 아프다면 슬개대퇴 통증(러너 무릎)을 의심합니다. 부상당한 초보 러너의 약 10%로 정강이 통증 다음으로 많았습니다(Nielsen 2014). 붓거나, 힘이 빠지거나, 걸리는 느낌이 있으면 다른 원인일 수 있어 진료를 받으세요.",
          },
          {
            q: "엉덩이 근육이 약해서 무릎이 아픈 건가요?",
            a: "미리 추적한 전향 연구 18편을 모은 메타분석에서 엉덩이 근력 약화는 위험 요인이 아니었습니다. 체중·BMI·Q각도 아니었고, 군인에서 대퇴사두근 약화만 위험 요인이었습니다(Neal 2019). 다만 이미 아픈 사람에게는 엉덩이·무릎 운동을 함께 하는 것이 권고됩니다(Collins 2018).",
          },
          {
            q: "운동을 꼭 해야 낫나요?",
            a: "러너 69명 무작위 시험에서 증상·훈련량 관리 교육만 받은 그룹이 교육에 운동이나 주법 교정을 더한 그룹과 똑같이 좋아졌습니다(Esculier 2018). 통증을 기준으로 거리·속도·내리막을 조절하는 것이 기본이고, 운동은 근력을 늘리는 데 도움이 됩니다.",
          },
          {
            q: "신발이 무릎 통증에 영향을 주나요?",
            a: "신발의 쿠셔닝이나 안정화 기능으로 무릎 통증이 낫는다는 권고는 없습니다. 국제 합의문이 권고한 것은 운동과 발 보조기(깔창형 교정구)입니다(Collins 2018). 쿠션이 다 닳은 신발은 바꾸는 게 맞습니다.",
          },
        ]} />

        <p className="text-xs text-gray-400 mb-4">※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 통증이 지속되면 전문의 상담을 권장합니다.</p>

        {/* 2026-09-06: 글 안에서 바로 묻게 한다.
            /community 로 보내면 클릭 한 번이 필요하고, 그 한 번에서 대부분을 잃는다 —
            두 달간 질문 0건이 그 증거다. */}
        <InlineAsk from="knee-pain" tag="무릎" placeholder="예) 계단 내려갈 때만 무릎 앞이 아픈데 신발 문제일까요?" />

        {/* 2026-10-07: sub 가 「체중과 부상 이력을 넣으면 쿠션이 충분한 신발을 우선 추천」이었다 — 엔진 v4 에서 그 경로를 뺐다. */}
        <FinderCta from="knee-pain" headline="발볼·사이즈부터 맞는 신발 찾기" sub="신발로 무릎 통증이 낫는다는 근거는 약합니다. 발에 맞는지가 먼저입니다." />
        <ShareButtons from="knee-pain" title="러너 무릎 — 무릎 앞 통증" description="무릎 앞쪽이 아플 때 확인할 것들을 논문 근거로 정리했습니다." />

      </article>
    </>
  );
}
