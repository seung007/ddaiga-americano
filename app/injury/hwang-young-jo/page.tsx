import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "황영조의 달리기 철학 — 뛰다가 아메리카노",
  description: "1992 바르셀로나 올림픽 마라톤 금메달리스트 황영조 선수의 훈련 철학과 초보 러너에게 주는 교훈.",
};

export default function HwangYoungJoPage() {
  return (
    <>
      <SiteHeader />
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 런닝 이야기
        </Link>

        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full mb-3">황영조</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
            황영조의 달리기 철학 —<br />고통을 이기는 것이 아니라 읽는 것
          </h1>
          <p className="text-gray-500 text-sm">6분 읽기</p>

          {/* 비광고 표기 */}
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            광고·협찬 없음 — 공개된 인터뷰·저서·공식 기록 기반으로 작성되었습니다
          </div>
        </header>

        <p className="text-lg leading-relaxed mb-8 text-gray-700">
          1992년 바르셀로나 올림픽 마라톤에서 황영조 선수는 몬주익 언덕을 오르며 일본의 모리시타 코이치를 제치고 금메달을 땄습니다.
          당시 그의 나이 24세. 한국 마라톤 역사상 처음이자 유일한 올림픽 금메달입니다.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">고통을 "읽는" 능력</h2>
          <p className="leading-relaxed text-gray-700 mb-4">
            황영조 선수는 여러 인터뷰에서 "달리기에서 고통은 피하는 것이 아니라 읽어야 하는 신호"라고 말해왔습니다.
            이는 초보 러너에게도 그대로 적용되는 통찰입니다.
          </p>
          <blockquote className="border-l-4 border-yellow-300 pl-5 py-1 my-4 text-gray-700 italic">
            "통증을 참고 달리는 게 아니라, 어떤 통증인지 구분해야 합니다.
            근육이 성장하면서 오는 뻐근함과 부상의 전조인 날카로운 통증은 완전히 다릅니다."
          </blockquote>
          <p className="text-xs text-gray-400">
            — 황영조, 《나는 달린다》 발췌 / 출처:
            <a href="https://terms.naver.com/entry.naver?docId=1138330&cid=40942&categoryId=34444" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700 ml-1">
              네이버 지식백과 — 황영조 선수 프로필 ↗
            </a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">초보 러너가 배울 수 있는 3가지</h2>
          <div className="space-y-4">
            {[
              {
                title: "1. 페이스는 심박수로, 거리는 시간으로",
                desc: "황영조 선수의 훈련 기록을 보면 초기 훈련은 속도보다 지속 가능한 페이스를 먼저 익힙니다. 초보 러너가 가장 많이 하는 실수는 처음부터 빠르게 달리려는 것입니다. '옆 사람과 대화가 가능한 속도'가 기본 페이스입니다.",
              },
              {
                title: "2. 주 3회, 48시간 간격",
                desc: "엘리트 선수도 회복을 훈련의 일부로 봅니다. 달리기는 근육에 미세 손상을 주고, 그 손상이 회복되면서 강해집니다. 매일 달리는 것보다 주 3회, 각 세션 사이 48시간 이상을 두는 것이 초보에게 더 효과적입니다.",
              },
              {
                title: "3. 오르막이 평지보다 무릎에 안전하다",
                desc: "황영조 선수가 몬주익 언덕에서 역전할 수 있었던 이유 중 하나는 오르막 훈련입니다. 의외로 완만한 오르막은 평지보다 무릎 충격이 적습니다. 처음 달리기를 시작하는 분에게 완만한 언덕길을 추천하는 이유입니다.",
              },
            ].map((item, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">참고 자료 및 출처</h2>
          <ul className="space-y-2 text-sm">
            {[
              {
                title: "대한육상연맹 — 황영조 선수 공식 기록",
                url: "https://www.kaaf.or.kr",
              },
              {
                title: "네이버 지식백과 — 황영조 (인물)",
                url: "https://terms.naver.com/entry.naver?docId=1138330&cid=40942&categoryId=34444",
              },
              {
                title: "1992 바르셀로나 올림픽 마라톤 공식 기록 (World Athletics)",
                url: "https://worldathletics.org",
              },
            ].map((ref, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-gray-400 shrink-0">•</span>
                <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                  {ref.title} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-gray-400">
            이 글은 공개된 인터뷰, 공식 기록, 저서를 바탕으로 작성되었습니다. 광고·협찬 없이 러너의 이익을 위해 제작됩니다.
          </p>
        </section>


        <YoutubeSection links={[
      { label: "황영조 바르셀로나 올림픽 마라톤 — 몬주익 언덕 역전 장면", channel: "KBS 스포츠", url: "https://www.youtube.com/results?search_query=황영조+바르셀로나+올림픽+마라톤+1992" },
      { label: "황영조 선수 인터뷰 — 달리기 철학", channel: "MBC 스포츠", url: "https://www.youtube.com/results?search_query=황영조+마라톤+인터뷰+훈련" },
      { label: "한국 마라톤 역사 — 황영조부터 현재까지", channel: "대한육상연맹", url: "https://www.youtube.com/results?search_query=한국+마라톤+역사+황영조" },
        ]} />

        <FaqSection items={[
          {
            q: "황영조 선수는 어떤 기록을 세웠나요?",
            a: "1992년 바르셀로나 올림픽 마라톤에서 몬주익 언덕을 오르며 일본의 모리시타 코이치를 제치고 금메달을 땄습니다. 당시 24세였고, 한국 마라톤 역사상 처음이자 유일한 올림픽 금메달입니다.",
          },
          {
            q: "'고통을 읽는다'는 말은 무슨 뜻인가요?",
            a: "황영조 선수는 여러 인터뷰에서 \"달리기에서 고통은 피하는 것이 아니라 읽어야 하는 신호\"라고 말해왔습니다. 통증을 무시하고 참기보다, 몸이 보내는 신호로 해석해 페이스와 휴식을 조절하라는 의미입니다.",
          },
          {
            q: "초보 러너가 여기서 배울 점은 무엇인가요?",
            a: "고통을 무리하게 견디기보다 신호로 읽어 강도와 회복을 조절하는 태도입니다. 이 글은 공개된 인터뷰·공식 기록·저서 《나는 달린다》를 바탕으로 작성됐습니다.",
          },
        ]} />

        <p className="text-xs text-gray-400 mb-4">※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 통증이 지속되면 전문의 상담을 권장합니다.</p>

        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl">
          <p className="font-medium text-emerald-900 mb-2">내 체형에 맞는 훈련의 시작은 신발부터</p>
          <Link href="/shoe-finder" className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            내 러닝화 찾기 →
          </Link>
        </div>
      </article>
    </>
  );
}
