import Link from "next/link";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "달리기 자세 체크리스트 — 어깨·팔·시선 — 뛰다가 아메리카노",
  description: "상체 자세가 하체 부상에 영향을 준다는 사실. 어깨·팔·시선 체크포인트를 알아봅니다.",
};

export default function Page() {
  return (
    <>
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 러닝 가이드
        </Link>
        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full mb-3">자세</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">달리기 자세 체크리스트 — 어깨·팔·시선</h1>
          {/* 2026-09-22: 1,346자 ÷ 600. 규약은 app/injury/page.tsx 상단 주석 */}
          <p className="text-gray-500 text-sm mb-4">3분 읽기</p>
          {/**
           * ⚠️ 2026-09-14 — **이 페이지에는 논문 인용이 0건이다.**
           *
           * 2026-08-31 에 검증기가 두 인용이 무관한 논문을 가리키는 것을 잡아내 링크를
           * 내렸다(아래 참고자료). 그 뒤로 **인용이 하나도 없는 상태**인데,
           * 배지와 참고자료 문구는 "공개 연구 및 의학 자료 기반"으로 남아 있었다.
           *
           * 링크를 내린 것까지는 정직했는데, **내렸다는 사실을 배지에 반영하지 않았다.**
           * 그래서 근거가 0인 페이지가 근거 있는 페이지처럼 보였다.
           *
           * 본문 내용(어깨·팔·시선)을 지우지는 않았다 — 널리 통용되는 자세 조언이고
           * 위험한 주장이 아니다. 다만 **무엇에 기반한 것인지를 사실대로** 적는다.
           */}
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            협찬 없이 작성 — 국민건강보험공단 웹진(前 국가대표 트레이너) 기준
          </div>
        </header>
        <p className="text-lg leading-relaxed mb-8 text-gray-700">발과 다리에만 집중하기 쉽지만, 상체 자세도 달리기에 영향을 줍니다. 어깨가 앞으로 말리면 호흡이 얕아지고, 팔이 크게 흔들리면 골반도 따라 흔들립니다.</p>
        {/**
         * 2026-09-15 — **인용 0건 상태를 벗어났다.**
         *
         * 하루 전까지 이 페이지는 인용이 하나도 없으면서 배지에 "공개 연구 및 의학 자료 기반"
         * 이라고 적혀 있었다. 그건 고쳤지만 **대체 자료를 못 찾은 상태**로 남아 있었다.
         *
         * 사이트 주인 지적: *"정보화 시대인데 자료가 다 있을 텐데,
         * 전문 사이트 들어가서 보고, 브런치 같은 곳에 전문적으로 하는 사람들 있으니까 찾을 수 있다."*
         * 맞는 말이었고, 찾아보니 있었다.
         *
         * 국민건강보험공단 건강보험 웹진 2022년 3월호(vol.281) — 손용국.
         * **前 육상 국가대표 트레이너**(2018 아시안게임·2017 런던 세계육상선수권 대표팀 지도).
         * 공공기관 발행 + 글쓴이 자격 확인됨.
         *
         * ⚠️ 본문 숫자를 **출처에 맞춰 고쳤다** — 우리는 "팔꿈치 90도"라고 썼는데
         * 출처는 **90~110도**다. 범위를 한 값으로 좁히면 그것도 없는 정밀함이다.
         *
         * ⚠️ **시선 각도(10~15m)는 이 출처에 없다.** 팔·어깨·턱만 있다.
         * 그 항목은 여전히 무근거이므로 그렇게 표시했다.
         */}
        <div className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900">
          <strong>아래 자세 기준은 어디서 왔나</strong> — 국민건강보험공단 건강보험 웹진(2022년 3월호)에
          실린 <strong>손용국 前 육상 국가대표 트레이너</strong>의 설명을 기준으로 정리했습니다.
          2018 아시안게임·2017 런던 세계육상선수권 대표팀을 지도한 분입니다.
          <span className="mt-2 block text-emerald-800">
            다만 <strong>시선 항목은 그 자료에 없습니다.</strong> 아래에 따로 표시했습니다.
          </span>
        </div>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">어깨</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">어깨는 자연스럽게 뒤로 당겨 귀와 어깨가 수직선을 이루어야 합니다. 달리다 보면 피로로 어깨가 귀 쪽으로 올라가는 경향이 있습니다. 5km마다 한 번씩 어깨를 의식적으로 내리고 뒤로 당겨보세요.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">팔 흔들기</h2>
          {/* 2026-09-15: "90도" → "90~110도". 출처(손용국, NHIS 웹진)가 범위로 적는다.
              범위를 한 값으로 좁히면 없는 정밀함을 만드는 것이다. */}
          <p className="leading-relaxed text-gray-700">
            팔꿈치는 <strong>90~110도</strong>로 굽힙니다. 팔은 몸 중앙의 가상 세로선을 기준으로{" "}
            <strong>30도 정도 안쪽 사선</strong>으로 흔들고, 손은 <strong>달걀을 가볍게 쥔 정도</strong>의
            힘만 줍니다. 어깨는 힘을 뺍니다.
          </p>
          <p className="mt-3 leading-relaxed text-gray-700">
            팔이 좌우로 과도하게 흔들리면 골반도 같이 흔들립니다.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">머리와 시선</h2>
          <p className="leading-relaxed text-gray-700">
            <strong>턱을 당깁니다.</strong> 머리는 척추 위에 중립으로 두고, 발 밑을 보느라 목이
            앞으로 나오지 않게 합니다.
          </p>
          {/* 2026-09-15: "시선 10~15m 앞"은 손용국(NHIS) 자료에 없다. 팔·어깨·턱만 있다.
              빼지 않고 근거 없음을 표시한다 — 실용적으로 쓰이는 조언이긴 하다. */}
          <p className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm leading-relaxed text-gray-600">
            흔히 <strong>&ldquo;10~15m 앞 지면을 보라&rdquo;</strong>고 합니다. 다만 그 거리는 아래 인용한
            자료에 나오지 않습니다 — <strong>저희가 근거를 확인하지 못한 값</strong>이라 그대로 적습니다.
            확실한 것은 턱을 당기는 것까지입니다.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://www.nhis.or.kr/static/alim/paper/oldpaper/202203/sub/10.html" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                국민건강보험공단 건강보험 웹진 2022년 3월호(vol.281) — 손용국(前 육상 국가대표 트레이너). 팔꿈치 90~110도, 몸 중앙선에서 30도 안쪽 사선, 어깨 힘 빼기, 턱 당기기 ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><span className="text-gray-500">러닝폼·경제성 리뷰 / 상체 역학 자료 2건 — 검증기가 무관한 논문을 가리키는 것을 확인해 링크를 내렸습니다 (2026-08-31)</span></li>

          </ul>
          <p className="mt-3 text-xs text-gray-400">추천 순서는 광고비로 바뀌지 않습니다. 팔·어깨·턱 기준은 위 공공기관 자료를 따랐고, <strong>시선 거리는 아직 근거를 확인하지 못해 본문에 그렇게 표시했습니다.</strong></p>
        </section>

        <YoutubeSection links={[
          { label: "달리기 자세 완벽 정리 — 착지, 케이던스, 보폭, 무게중심", channel: "지니코치", url: "https://www.youtube.com/watch?v=Bph9EsM-24I" },
          { label: "달리기 전후 필요한 스트레칭 — 운동 강도별 루틴", channel: "엔듀로레이스 ENDURORACE", url: "https://www.youtube.com/watch?v=kBluJKveigU" },
          { label: "What Is Perfect Running Form? — Run Technique Tips", channel: "Global Triathlon Network", url: "https://www.youtube.com/watch?v=brFHyOtTwH4" },
        ]} />

        <FaqSection items={[
          {
            q: "달릴 때 어깨는 어떻게 두어야 하나요?",
            a: "어깨를 자연스럽게 뒤로 당겨 귀와 어깨가 수직선을 이루게 하세요. 피로해지면 어깨가 귀 쪽으로 올라가기 쉬우니, 5km마다 한 번씩 의식적으로 내리고 뒤로 당겨줍니다.",
          },
          {
            q: "팔은 어떻게 흔드는 게 맞나요?",
            a: "팔꿈치를 90도로 굽히고 팔이 몸의 정중선을 넘지 않게 하세요. 손은 달걀을 가볍게 쥔 정도의 힘만 줍니다. 팔이 좌우로 과하게 흔들리면 골반도 같이 흔들려 에너지가 낭비됩니다.",
          },
          {
            q: "달릴 때 시선은 어디를 봐야 하나요?",
            a: "10~15m 앞 지면을 봅니다. 발밑을 보면 목이 앞으로 나오고 등이 굽습니다. 머리는 척추 위 중립 위치로, '머리 위에 줄이 달려 천장으로 당기는 느낌'으로 달리면 자세 교정에 도움이 됩니다.",
          },
        ]} />

        <p className="text-xs text-gray-400 mb-4">※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 통증이 지속되면 전문의 상담을 권장합니다.</p>

        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl">
          <p className="font-medium text-emerald-900 mb-2">내 체형에 맞는 러닝화를 찾으세요</p>
          <Link href="/shoe-finder" className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            내 러닝화 찾기 →
          </Link>
        </div>
      </article>
    </>
  );
}
