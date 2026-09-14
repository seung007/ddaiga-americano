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
          <p className="text-gray-500 text-sm mb-4">4분 읽기</p>
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
            협찬 없이 작성 — 이 글은 논문 인용 없이 통용되는 자세 조언을 정리한 것입니다
          </div>
        </header>
        <p className="text-lg leading-relaxed mb-8 text-gray-700">발과 다리에만 집중하기 쉽지만, 상체 자세도 달리기에 영향을 줍니다. 어깨가 앞으로 말리면 호흡이 얕아지고, 팔이 크게 흔들리면 골반도 따라 흔들립니다.</p>
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          <strong>먼저 밝힙니다 — 이 글에는 논문 인용이 없습니다.</strong> 예전에 달아 뒀던 인용
          2건이 <strong>실제로는 다른 주제의 논문</strong>이라 2026-08-31에 내렸고, 아직 대체할
          자료를 찾지 못했습니다. 아래 내용은 러너들 사이에 통용되는 자세 조언이지,
          연구로 검증된 수치가 아닙니다.
        </div>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">어깨</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">어깨는 자연스럽게 뒤로 당겨 귀와 어깨가 수직선을 이루어야 합니다. 달리다 보면 피로로 어깨가 귀 쪽으로 올라가는 경향이 있습니다. 5km마다 한 번씩 어깨를 의식적으로 내리고 뒤로 당겨보세요.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">팔 흔들기</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">팔꿈치를 90도로 굽히고, 팔이 몸의 정중선을 넘지 않아야 합니다. 손은 달걀을 가볍게 쥔 정도의 힘만 줍니다. 팔이 좌우로 과도하게 흔들리면 골반도 같이 흔들려 에너지 낭비가 일어납니다.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">시선과 머리 위치</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">시선은 10~15m 앞 지면을 향합니다. 너무 발 밑을 보면 목이 앞으로 나오고 등이 굽어집니다. 머리는 척추 위에 중립 위치로 유지합니다. '머리 위에 줄이 달려 천장으로 당기는 느낌'으로 달리면 자세 교정에 도움이 됩니다.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-gray-400">•</span><span className="text-gray-500">러닝폼·경제성 리뷰 — 검증기가 무관한 논문을 가리키는 것을 확인해 링크를 내렸습니다 (2026-08-31)</span></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><span className="text-gray-500">상체 역학 관련 자료 — 검증기가 무관한 논문을 가리키는 것을 확인해 링크를 내렸습니다 (2026-08-31)</span></li>

          </ul>
          <p className="mt-3 text-xs text-gray-400">추천 순서는 광고비로 바뀌지 않습니다. <strong>이 글에는 현재 인용 가능한 논문이 없습니다</strong> — 위 두 항목은 검증에서 탈락해 내린 자리이고, 대체 자료를 찾으면 채웁니다.</p>
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
