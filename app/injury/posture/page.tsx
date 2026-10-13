import Link from "next/link";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import { Up, S } from "@/components/guide/Up";
import { Lead, P, H2, Summary, Todo, Evidence, References, Basis, Note } from "@/components/guide/Read";
import type { Metadata } from "next";

/**
 * 2026-10-08 재검증 — 초록과 대조
 *   · meta 「상체 자세가 하체 부상에 영향을 준다는 사실」 → 확인된 것은 실험실 부하 변화(Braun 2025, Warrener 2021).
 *     「사실」 단정 삭제
 *   · 「어깨가 말리면 호흡이 얕아진다」 → Chiba 2025(10명, 모의 굴곡 자세)는 환기 부담 소폭 증가. 「얕아짐」은 보고 안 됨
 *   · 「팔이 크게 흔들리면 골반도 흔들린다」 → 근거 못 찾음. Pontzer 2009 는 오히려 팔이 몸통 회전을 줄인다고 봄
 *   · 「피로로 어깨가 올라간다」「5km마다」 → 근거 못 찾음. 경험칙 표기, 5km 삭제
 *   · 어깨·팔·턱 수치(90~110° 등) — NHIS 웹진 출처를 이번 재검증에서 다시 확인하지 못함 → (경험칙) 표기
 *   · 2026-09-15 이후 배지 「NHIS 웹진 기준」 → 연구와 경험칙을 구분했다는 문구로
 *
 * 2026-10-13 가독성 재설계 — 섹션마다 답 → 할 일 → 근거(접힘). 숫자·출처는 <Evidence> 안으로 옮겼고,
 *   「실험실 연구」「10명」「웹진 원문 재확인 못 함」「시선 거리 근거 없음」 단서는 본문에 남겼다.
 *   「(경험칙)」 → 「저희 제안」 배지. 참고 자료는 기본 접힘.
 */
const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/posture";
const TITLE = "달리기 자세 체크리스트 — 어깨·팔·시선";
const DESC =
  "어깨·팔·시선 체크포인트와, 상체 기울기가 무릎·고관절 부하를 어떻게 바꾸는지 연구로 확인된 부분과 저희 제안을 구분해 정리했습니다.";

export const metadata: Metadata = {
  title: "달리기 자세 체크리스트 — 어깨·팔·시선 — 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/posture" },
};

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["달리기 자세", "/injury/posture"],
        ]}
      />
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-600">자세</span>
          {/* 규약은 app/injury/page.tsx 상단 주석 */}
          <span className="text-xs text-gray-400">3분 읽기</span>
          <span className="text-xs text-gray-400">· 협찬 없이 작성</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{TITLE}</h1>
        <Lead>
          발과 다리에만 집중하기 쉽지만, 상체 자세도 달리기에 영향을 줍니다. 다만 자세가 부상을 줄이는지는 아직 확인되지
          않았습니다.
        </Lead>

        <Summary
          items={[
            <>일반 러너 30명 실험에서 몸통을 앞으로 기울일수록 <strong>무릎 부하는 줄고 고관절 부하는 늘었습니다.</strong><Basis kind="paper" /></>,
            <>어깨는 <strong>힘을 빼고</strong> 귀와 어깨가 수직선에 오게.<Basis kind="rule" /></>,
            <>팔꿈치는 <strong>90~110도</strong>, 팔은 몸 중앙선 쪽 <strong>30도 사선</strong>으로.<Basis kind="rule" /></>,
            <><strong>턱을 당기고</strong> 목이 앞으로 나오지 않게. 시선 거리는 근거를 못 찾았습니다.<Basis kind="rule" /></>,
          ]}
        />

        {/* ── ① ─────────────────────────────────────────── */}
        <h2 id="lean" className={H2}>
          상체를 숙이면 다리에 뭐가 달라지나요
        </h2>
        <P>
          일반 러너 30명의 실험에서 몸통을 앞으로 기울일수록 <strong>무릎 부하는 줄고 고관절 부하는 늘었습니다.</strong> 23명의
          다른 실험에서는 많이 숙일수록 착지 때 부하가 커지는 속도도 빨라졌습니다.
        </P>
        <P>등을 구부린 자세로 달리면 숨 쉬는 부담이 조금 늘었다는 실험도 있습니다.</P>
        <Note>모두 실험실에서 부하 변화를 본 연구입니다. 등을 구부린 자세 실험은 젊은 남성 10명의 소규모 실험입니다.</Note>
        <Evidence n={3}>
          <p>
            일반 러너 30명의 실험에서 몸통을 앞으로 기울일수록 무릎 부하는 줄고 고관절 부하는 늘었습니다.{" "}
            <S>(Braun et al. (2025) <Up h="https://pubmed.ncbi.nlm.nih.gov/39251186/" />)</S>
          </p>
          <p>
            23명의 실험에서는 몸통을 많이 숙일수록 수직 부하율이 커졌습니다.{" "}
            <S>(Warrener et al. (2021) <Up h="https://pubmed.ncbi.nlm.nih.gov/34000575/" />)</S>
          </p>
          <p>
            등을 구부린 자세로 달리면 환기 부담이 조금 늘었다는 소규모 실험(젊은 남성 10명)도 있습니다.{" "}
            <S>(Chiba et al. (2025) <Up h="https://pubmed.ncbi.nlm.nih.gov/41164020/" />)</S>{" "}
            이런 연구들은 실험실 부하 변화를 본 것이고, 자세가 부상을 줄이는지는 아직 확인되지 않았습니다.
          </p>
        </Evidence>

        {/* ── ② ─────────────────────────────────────────── */}
        {/**
         * 2026-09-15: NHIS 웹진(2022년 3월호, 손용국)을 자세 기준 출처로 넣었다.
         * 2026-10-08: 이번 재검증은 PubMed 만 열 수 있어 웹진 원문을 다시 확인하지 못했다.
         * 연구 수치도 아니므로 어깨·팔·턱 항목은 (경험칙)으로 표시한다.
         */}
        <h2 id="shoulder-arm" className={H2}>
          어깨와 팔은 어떻게 두나요
        </h2>
        <P>
          어깨·팔·턱 기준은 국민건강보험공단 건강보험 웹진(2022년 3월호)에 실린{" "}
          <strong>손용국 前 육상 국가대표 트레이너</strong>의 설명을 옮긴 것입니다.
        </P>
        <Todo
          basis="rule"
          items={[
            "어깨는 힘을 빼고 자연스럽게 뒤로 당겨, 귀와 어깨가 수직선에 오게 둡니다.",
            "중간중간 어깨를 의식적으로 내리고 뒤로 당겨 봅니다.",
            <>팔꿈치는 <strong>90~110도</strong>로 굽힙니다.</>,
            <>팔은 몸 중앙의 가상 세로선을 기준으로 <strong>30도 정도 안쪽 사선</strong>으로 흔듭니다.</>,
            <>손은 <strong>달걀을 가볍게 쥔 정도</strong>의 힘만 줍니다.</>,
          ]}
        />
        <Note>
          연구로 확인한 수치가 아니고, 이번 재검증에서 원문을 다시 확인하지도 못했습니다. 달리다 지치면 어깨가 귀 쪽으로
          올라간다고들 하지만, 이것도 저희가 연구로 확인하지는 못했습니다.
        </Note>
        <P>팔 흔들기는 몸통과 머리가 도는 것을 줄여 준다는 연구(10명)가 있습니다.</P>
        <Evidence n={1}>
          <p>
            팔 흔들기는 몸통과 머리의 회전을 줄여 주는 역할을 한다는 연구(10명)가 있습니다.{" "}
            <S>(Pontzer et al. (2009) <Up h="https://pubmed.ncbi.nlm.nih.gov/19181900/" />)</S>
          </p>
        </Evidence>

        {/* ── ③ ─────────────────────────────────────────── */}
        <h2 id="head" className={H2}>
          달릴 때 시선은 어디를 봐야 하나요
        </h2>
        <P>
          <strong>턱을 당깁니다.</strong> 머리는 척추 위에 중립으로 두고, 발 밑을 보느라 목이 앞으로 나오지 않게 합니다.
          <Basis kind="rule" />
        </P>
        <p className="mt-4 break-keep rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm leading-relaxed text-gray-600">
          흔히 <strong>&ldquo;10~15m 앞 지면을 보라&rdquo;</strong>고 합니다. 다만 그 거리는 위 웹진 자료에도, 저희가 찾은
          연구에도 나오지 않습니다 — <strong>근거를 확인하지 못한 값</strong>이라 그대로 적습니다.
        </p>

        <div className="mt-14">
          <YoutubeSection links={[
            { label: "달리기 자세 완벽 정리 — 착지, 케이던스, 보폭, 무게중심", channel: "지니코치", url: "https://www.youtube.com/watch?v=Bph9EsM-24I" },
            { label: "달리기 전후 필요한 스트레칭 — 운동 강도별 루틴", channel: "엔듀로레이스 ENDURORACE", url: "https://www.youtube.com/watch?v=kBluJKveigU" },
            { label: "What Is Perfect Running Form? — Run Technique Tips", channel: "Global Triathlon Network", url: "https://www.youtube.com/watch?v=brFHyOtTwH4" },
          ]} />
        </div>

        <FaqSection items={[
          {
            q: "달릴 때 어깨는 어떻게 두어야 하나요?",
            a: "(저희 제안) 어깨는 힘을 빼고 자연스럽게 뒤로 당겨 귀와 어깨가 수직선에 오게 둡니다. 지치면 어깨가 올라간다고들 하니 중간중간 의식적으로 내리고 뒤로 당겨 보세요. 연구로 확인한 기준은 아닙니다.",
          },
          {
            q: "팔은 어떻게 흔드는 게 맞나요?",
            a: "(저희 제안) 팔꿈치를 90~110도로 굽히고, 팔은 몸 중앙의 세로선을 기준으로 30도 정도 안쪽 사선으로 흔듭니다. 손은 달걀을 가볍게 쥔 정도의 힘만 줍니다. 연구로 확인된 것은 팔 흔들기가 몸통과 머리의 회전을 줄여 준다는 정도입니다(10명 실험).",
          },
          {
            q: "달릴 때 시선은 어디를 봐야 하나요?",
            a: "흔히 10~15m 앞 지면을 보라고 하지만, 그 거리는 저희가 근거를 확인하지 못한 값입니다. 턱을 당겨 머리를 척추 위 중립에 두라는 조언도 저희 제안입니다.",
          },
        ]} />

        <References n={6} title="참고 자료" note="2026-10-08 초록과 대조했습니다.">
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-gray-400 shrink-0">•</span><span><strong>Braun et al. (2025)</strong> — 몸통 기울기와 무릎·고관절 누적 부하(일반 러너 30명). <a href="https://pubmed.ncbi.nlm.nih.gov/39251186/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span></li>
            <li className="flex gap-2"><span className="text-gray-400 shrink-0">•</span><span><strong>Warrener et al. (2021)</strong> — 몸통 굴곡 각도와 하지 역학(23명). <a href="https://pubmed.ncbi.nlm.nih.gov/34000575/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span></li>
            <li className="flex gap-2"><span className="text-gray-400 shrink-0">•</span><span><strong>Chiba et al. (2025)</strong> — 모의 굴곡 자세와 환기 효율(젊은 남성 10명). <a href="https://pubmed.ncbi.nlm.nih.gov/41164020/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span></li>
            <li className="flex gap-2"><span className="text-gray-400 shrink-0">•</span><span><strong>Pontzer et al. (2009)</strong> — 걷기·달리기에서 팔 흔들기의 조절과 기능(10명). <a href="https://pubmed.ncbi.nlm.nih.gov/19181900/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span></li>
            <li className="flex gap-2"><span className="text-gray-400 shrink-0">•</span>
              <a href="https://www.nhis.or.kr/static/alim/paper/oldpaper/202203/sub/10.html" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                국민건강보험공단 건강보험 웹진 2022년 3월호(vol.281) — 손용국(前 육상 국가대표 트레이너). 팔꿈치 90~110도, 몸 중앙선에서 30도 안쪽 사선, 어깨 힘 빼기, 턱 당기기 (저희 제안 · 2026-10-08 재검증에서 원문 재확인 못 함) ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400 shrink-0">•</span><span className="text-gray-500">러닝폼·경제성 리뷰 / 상체 역학 자료 2건 — 검증기가 무관한 논문을 가리키는 것을 확인해 링크를 내렸습니다 (2026-08-31)</span></li>
          </ul>
          <p className="mt-3 text-xs text-gray-400">추천 순서는 광고비로 바뀌지 않습니다. 연구로 확인한 문장에는 출처를 붙였고, 어깨·팔·턱 기준은 위 웹진 자료를 옮긴 저희 제안입니다. <strong>시선 거리는 근거를 확인하지 못해 본문에 그렇게 표시했습니다.</strong></p>
        </References>

        <p className="mt-6 text-xs text-gray-400">※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 통증이 지속되면 전문의 상담을 권장합니다.</p>

        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl">
          <p className="font-medium text-emerald-900 mb-2">내 발에 맞는 러닝화를 찾으세요</p>
          <Link href="/shoe-finder" className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            내 러닝화 찾기 →
          </Link>
        </div>
      </article>
    </>
  );
}
