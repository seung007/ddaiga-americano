import Link from "next/link";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import { Lead, P, H2, H3, Summary, Todo, References, Basis, Note } from "@/components/guide/Read";
import type { Metadata } from "next";

/**
 * 2026-10-08 재검증 — 기사 원문과 대조(한국경제 2025-08-15·2026-05-14, 경향신문 2001-01-26 은 원문 페이지에서 직접 확인)
 *   · 「한국 여자 마라톤의 대표적인 장수 선수」「수많은 대회에서 완주를 이어온」 → 반대.
 *     1997년 첫 풀코스에서 2:26:12 한국기록(21년 보유) 뒤 98 방콕 AG·99 런던 중도기권,
 *     2000 로테르담 발목 부상 12위(경향 2001). 「선수 생활 내내 부상은 피하기 어려웠다」(한국경제 2026)
 *   · 「빠르게보다 오래」「축적」, 인용문 「하루 훈련보다 일주일, 한 달, 1년…」 — 출처를 찾지 못해 삭제.
 *     같은 취지의 실제 발언(한국경제 2025-08-15, 원문 확인)으로 교체
 *   · 「고관절·코어 훈련은 권은주의 훈련 방식과 맞닿아」 → 과장. 기사로 확인되는 건 코어 조언뿐
 *   · 고관절 외전근이 「원인」, 코어 「주 2~3회 10~15분이면 충분」 — 근거 못 찾음, 경험칙으로 낮춤
 *   · 10% 규칙 — 이 페이지에 인용이 없어 단정을 빼고 /injury/beginner-guide 로 넘김
 *   · 「공개된 연구 자료를 근거로 작성」 → 연구 인용 0건이라 정정
 *   · 참고 자료의 kaaf.or.kr 루트 링크 → 실제 기사 URL
 *
 * 2026-10-13 가독성 재설계 — 선수 이야기 페이지라 **구조만** 바꿨다(Lead·한눈에·섹션·참고 자료 접기).
 *   따옴표 인용·기사 출처 표기·정정 안내 문구는 글자 그대로 둔다. 연구 인용이 없어 <Evidence> 는 쓰지 않는다.
 *   「경험칙」 → 「저희 제안」 배지. 참고 자료는 .map() 대신 <li> 를 풀어 적었다 — 검사기가 <li> 개수를 문자열로 센다.
 */
const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/kwon-eun-ju";
const TITLE = "권은주 선수에게 배우는 여성 러너의 부상 예방";
const DESC =
  "21년간 한국 여자 마라톤 기록을 지킨 권은주 선수의 부상 경험과 조언, 여성 러너가 챙길 근력 운동을 기사로 확인한 것과 저희 제안으로 나눠 정리했습니다.";

export const metadata: Metadata = {
  title: `${TITLE} — 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/kwon-eun-ju" },
};

const REF_LINK = "text-emerald-600 hover:underline";

export default function KwonEunJuPage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["권은주", "/injury/kwon-eun-ju"],
        ]}
      />
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <header>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-pink-50 px-2.5 py-1 text-xs font-semibold text-pink-600">권은주</span>
            {/* 규약은 app/injury/page.tsx 상단 주석 */}
            <span className="text-xs text-gray-400">4분 읽기</span>
          </div>
          <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">
            권은주 선수에게 배우는<br />여성 러너의 부상 예방
          </h1>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-500">
            <span className="text-emerald-600">✓</span>
            협찬 없이 작성 — 기사로 확인한 사실과 저희 제안을 구분했습니다
          </p>
        </header>

        <Lead>
          21년간 한국 여자 마라톤 기록을 지킨 권은주 선수도 선수 생활 내내 부상에 시달렸습니다. 그가 강조하는 것은{" "}
          <strong>쉬어야 할 때 쉬는 것</strong>입니다.
        </Lead>

        <Summary
          items={[
            <>
              <strong>아프면 쉽니다.</strong> 권은주 선수는 &ldquo;적재적소에 휴식하는 게 정말 중요하다&rdquo;고 말했습니다.
              <Basis kind="rule" />
            </>,
            <>
              주당 거리를 <strong>한 번에 크게 늘리지 않습니다.</strong> 정확한 숫자보다 방향이 요점입니다.
              <Basis kind="rule" />
            </>,
            <>
              고관절·코어 근력 운동은 흔히 권해지는 방법입니다. 이 글에 효과를 확인한 연구 인용은 없습니다.
              <Basis kind="rule" />
            </>,
          ]}
        />

        <h2 id="career" className={H2}>
          어떤 선수였나 — 기록과 부상
        </h2>
        <P>
          권은주 선수는 1997년 춘천마라톤(조선일보마라톤)에서 생애 첫 풀코스를 2시간26분12초에 달려 한국 기록을 세웠고,
          이 기록은 2018년 김도연 선수가 깰 때까지 21년간 유지됐습니다.
        </P>
        <P>
          그러나 이후 1998 방콕 아시안게임과 1999 런던마라톤을 중도에 기권했고, 2000년 로테르담마라톤에서는 왼쪽 발목 부상으로 12위에 그쳐 올림픽 출전을 놓쳤습니다.
        </P>
        <P>
          선수 생활 내내 부상에 시달렸던 그는 지금 러닝 코치로 활동하며 &ldquo;건강하게, 오래, 즐겁게 달리는 걸 목표로 하라&rdquo;고 말합니다(한국경제, 2025-08-15).
        </P>

        <h2 id="rest" className={H2}>
          쉬어야 할 때 쉬기 — 권은주 선수의 조언
        </h2>
        <P>
          권은주 선수는 &ldquo;다시 선수 시절로 돌아간다면 쉬는 법부터 배울 것&rdquo;이라며 이렇게 말했습니다.
        </P>
        <blockquote className="my-4 border-l-4 border-pink-200 py-1 pl-5 text-gray-700 italic break-keep leading-[1.8]">
          &ldquo;선수 시절엔 아파도 뛰었는데, 일주일 쉬면 될 걸 무시하고 달리다 오히려 한 달, 1년을 못 뛰는 경우도 많다.
          적재적소에 휴식하는 게 정말 중요하다&rdquo;
        </blockquote>
        <p className="text-xs text-gray-400 mb-4">
          — 권은주 인터뷰 / 출처:
          <a href="https://www.hankyung.com/article/2025081265487" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700 ml-1">
            한국경제 2025-08-15 ↗
          </a>
        </p>
        <p className="mb-4 rounded-lg bg-gray-50 px-3 py-2 text-xs leading-relaxed text-gray-500">
          정정(2026-10-08): 이 페이지에 예전에 실렸던 권은주 선수의 따옴표 인용 세 개(「빠르게보다 오래」 등)는 출처를 찾지 못해 지웠고,
          위 인용은 기사 원문에서 확인한 문장입니다.
        </p>
        <P>
          같은 기사는 주 3회, 30분 정도를 운동 빈도로 소개합니다(기자 서술 — 권은주 선수의 직접 인용은 아닙니다).
        </P>
        <Todo
          title="초보 러너에게 적용하면"
          basis="rule"
          items={["아프면 쉽니다.", "주당 거리를 한 번에 크게 늘리지 않습니다."]}
        />
        {/**
         * 2026-10-08: 「10%라는 숫자 자체를 뒷받침하는 연구는 없습니다」「증가율 비교 연구에서 유의차 없음」에
         * 이 페이지 안에 인용이 없었다. 근거는 초보 가이드가 논문과 함께 다루므로 그쪽으로 넘긴다.
         */}
        <P>
          흔히 &ldquo;10% 법칙&rdquo;(주간 거리를 전주 대비 10% 넘게 늘리지 않기)이라고 부르는데, 이 숫자에 대한 연구와 거리를 늘리는 방법은{" "}
          <Link href="/injury/beginner-guide" className="text-emerald-600 underline">초보 러너 가이드</Link>에 정리해 두었습니다.
          정확한 숫자보다 <strong>&ldquo;급격히 늘리지 않는다&rdquo;</strong>는 방향이 요점입니다.
        </P>

        <h2 id="women" className={H2}>
          여성 러너는 무엇을 챙겨야 하나요?
        </h2>
        {/**
         * ⚠️ 2026-09-14 — 이 절의 의학적 주장 두 개에 인용이 없다.
         *
         *   ① "골반 구조 차이로 인해 … 발생률이 높습니다" — 인과까지 단정
         *   ② "배란 후 황체기에는 인대가 느슨해져 부상 위험이 높아집니다"
         *
         * 받치는 자료로 걸려 있던 두 링크가 **루트 도메인**이었다 —
         * `bjsm.bmj.com` 과 `pubmed.ncbi.nlm.nih.gov`. 특정 문헌이 아니다.
         * 아래에서 그 링크를 내렸으므로, 링크가 받치던 문장도 같이 손본다.
         *
         * 여성 러너 부상 역학과 월경 주기·인대 이완은 실제로 연구가 있는 주제지만,
         * **이 사이트가 확인한 논문이 없는 상태**에서 기전과 처방을 단정할 수 없다.
         */}
        <P>
          여성 러너에게 슬개대퇴 증후군(러너 무릎)과 장경인대염이 흔하다고 이야기되고, 그 배경으로 골반 구조 차이가 자주 언급됩니다.
          다만 <strong>저희가 확인한 인용이 없어 원인까지 단정하지는 않겠습니다.</strong>
        </P>
        <P>
          권은주 선수는 달리기 자세를 설명하며 &ldquo;코어 힘을 유지해야 부상을 줄일 수 있다&rdquo;고 조언합니다(한국경제, 2025-08-15).
        </P>
        <Note>아래 근력 운동은 흔히 권해지는 방법(저희 제안)이며, 이 글에 효과를 확인한 연구 인용은 없습니다.</Note>

        <h3 className={H3}>
          고관절 외전근 강화
          <Basis kind="rule" />
        </h3>
        <P>
          옆으로 누워 다리 들기(클램셸), 밴드 사이드 워크 등. 고관절 외전근이 약하면 무릎이 안쪽으로 쏠려 장경인대염·슬개골 통증과 관련된다는
          설명이 흔하지만, 저희가 확인한 연구가 없어 원인이라고 단정하지 않겠습니다.
        </P>

        <h3 className={H3}>
          코어 안정화
          <Basis kind="rule" />
        </h3>
        <P>
          플랭크, 데드버그 등 달릴 때 몸통이 좌우로 크게 흔들리지 않게 잡아 주는 운동입니다. 주 2~3회, 10~15분으로 시작하는 경우가 많지만 이
          양이 충분하다는 연구는 저희가 확인하지 못했습니다.
        </P>

        <h3 className={H3}>
          생리 주기에 따른 훈련 조절
          <Basis kind="rule" />
        </h3>
        {/* ⚠️ 2026-09-14: "황체기에는 인대가 느슨해져 부상 위험이 높아집니다" 라고
            기전과 결론을 단정했는데, 이를 받치던 링크가 PubMed 루트 주소였다. */}
        <P>
          주기에 따라 컨디션이 달라진다면 훈련 강도를 그에 맞춰 조절하는 편이 낫습니다. 다만 어느 시기에 부상 위험이 얼마나 달라지는지는 저희가
          확인한 자료가 없어 단정하지 않겠습니다 — 자기 기록을 남겨 자신의 패턴을 보는 쪽이 확실합니다.
        </P>

        <div className="mt-14">
          <YoutubeSection links={[
            // 2026-08-31 검증 완료. 채널명은 oEmbed로 확인한 실제 업로더.
        { label: "한국 마라톤의 전설, 권은주 감독님을 뵙고 왔습니다", channel: "262wave", url: "https://www.youtube.com/watch?v=t6sqbXLDjok" },
        { label: "D-2, 이럴 땐 이렇게! (한국 여자 마라톤 기록 보유자 권은주 감독)", channel: "서울신문", url: "https://www.youtube.com/watch?v=i3Z1sqVfiG4" },
        { label: "인생은 마라톤처럼 — 21년간 한국신기록을 보유한 권은주 감독", channel: "다컴스", url: "https://www.youtube.com/watch?v=0tPsua6vVHQ" },
          ]} />

          <FaqSection items={[
            {
              q: "여성 러너가 특히 조심해야 할 부상은?",
              a: "여성 러너에게 슬개대퇴 증후군(러너 무릎)과 장경인대염이 흔하다고 이야기되고 골반 구조 차이가 자주 언급되지만, 저희가 확인한 인용이 없어 원인까지 단정하지 않습니다. 무릎이 계속 아프면 진료를 먼저 받으세요.",
            },
            {
              q: "권은주 선수는 무엇을 강조하나요?",
              a: "쉬는 것입니다. 그는 \"선수 시절엔 아파도 뛰었는데, 일주일 쉬면 될 걸 무시하고 달리다 오히려 한 달, 1년을 못 뛰는 경우도 많다\"고 말했습니다(한국경제 2025-08-15). 1997년 세운 한국 기록을 21년간 지켰지만 선수 생활 내내 부상에 시달린 경험에서 나온 말입니다.",
            },
            {
              q: "초보 여성 러너가 바로 적용할 원칙은?",
              a: "아프면 쉬고, 주당 거리를 급격히 늘리지 않는 것입니다. 흔히 말하는 '10% 법칙'에 대한 연구와 거리 늘리는 방법은 저희 초보 러너 가이드(/injury/beginner-guide)에 정리해 두었습니다.",
            },
          ]} />
        </div>

        <References
          n={6}
          title="참고 자료"
          note="추천 순서는 광고비로 바뀌지 않습니다. 이 글에는 연구 인용이 없습니다. 선수 관련 내용은 위 기사들을 근거로 했고, 근력 운동 내용은 저희 제안입니다."
        >
          <ul className="space-y-2">
            {/**
             * ⚠️ 2026-09-14 — 아래 두 항목이 **루트 도메인**이었다.
             *   · "여성 러너 부상 역학 — BJSM"   → `bjsm.bmj.com` (학술지 홈)
             *   · "월경 주기와 부상 위험 — PubMed" → `pubmed.ncbi.nlm.nih.gov` (검색엔진 홈)
             * 제목은 논문처럼 보이지만 특정 문헌을 가리키지 않으므로 인용이 아니다.
             * 이 둘이 본문의 의학적 주장 2개를 받치고 있었다 — 그 문장들도 위에서 같이 고쳤다.
             * 2026-10-08: 남아 있던 「대한육상연맹 — 권은주 선수 공식 기록」도 kaaf.or.kr 루트였다. 실제 기사로 교체.
             */}
            <li className="flex gap-2">
              <span className="text-gray-400 shrink-0">•</span>
              <a href="https://www.hankyung.com/article/2025081265487" target="_blank" rel="noopener noreferrer" className={REF_LINK}>
                {"한국경제 2025-08-15 — 「\"러닝하다 '병원비 폭탄' 맞으면…\" '레전드' 권은주의 고백」 (인터뷰, 휴식·주 3회 30분·코어 조언)"} ↗
              </a>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-400 shrink-0">•</span>
              <a href="https://www.hankyung.com/article/202605145844g" target="_blank" rel="noopener noreferrer" className={REF_LINK}>
                {"한국경제 2026-05-14 — 21세 첫 풀코스 2시간26분12초 한국 기록, 선수 생활 내내 부상"} ↗
              </a>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-400 shrink-0">•</span>
              <a href="https://www.khan.co.kr/article/200101261904561" target="_blank" rel="noopener noreferrer" className={REF_LINK}>
                {"경향신문 2001-01-26 — 「권은주 '느낌이 달라요'」 (98 방콕 AG·99 런던 기권, 2000 로테르담 발목 부상)"} ↗
              </a>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-400 shrink-0">•</span>
              <a href="https://m.seoul.co.kr/news/2025/04/11/20250411032002" target="_blank" rel="noopener noreferrer" className={REF_LINK}>
                {"서울신문 2025-04-11 — 21년간 한국 여자마라톤 기록 보유(2018년 3월 김도연 경신)"} ↗
              </a>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-400 shrink-0">•</span>
              <a href="https://kbmaeil.com/article/201803190216911" target="_blank" rel="noopener noreferrer" className={REF_LINK}>
                {"경북매일(2018) — 김도연, 권은주 기록 21년 만에 경신"} ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400 shrink-0">•</span><span className="text-gray-500">「여성 러너 부상 역학」·「월경 주기와 부상 위험」 항목 — 링크가 특정 논문이 아니라 학술지·검색엔진 홈 주소여서 내렸습니다 (2026-09-14). 해당 본문 문장도 단정을 뺐습니다</span></li>
          </ul>
        </References>

        <p className="mt-6 text-xs text-gray-400">※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 통증이 지속되면 전문의 상담을 권장합니다.</p>

        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl">
          <p className="font-medium text-emerald-900 mb-2">오래 달리려면 내 발에 맞는 신발부터</p>
          <Link href="/shoe-finder" className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            내 러닝화 찾기 →
          </Link>
        </div>
      </article>
    </>
  );
}
