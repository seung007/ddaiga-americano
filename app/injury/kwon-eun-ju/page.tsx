import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "권은주 선수에게 배우는 여성 러너의 부상 예방 — 뛰다가 아메리카노",
  description: "한국 여자 마라톤을 이끌어온 권은주 선수의 훈련 방식과 여성 러너의 부상 예방법.",
};

export default function KwonEunJuPage() {
  return (
    <>
      <SiteHeader />
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 런닝 이야기
        </Link>

        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full mb-3">권은주</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
            권은주 선수에게 배우는<br />여성 러너의 부상 예방
          </h1>
          <p className="text-gray-500 text-sm mb-4">6분 읽기</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            광고·협찬 없음 — 공개된 인터뷰·공식 기록 기반으로 작성되었습니다
          </div>
        </header>

        <p className="text-lg leading-relaxed mb-8 text-gray-700">
          권은주 선수는 한국 여자 마라톤의 대표적인 장수 선수입니다.
          수많은 대회에서 완주를 이어온 그의 훈련 철학은 "빠르게보다 오래"입니다.
          이는 부상 없이 달리기를 지속하고 싶은 초보 러너에게도 그대로 적용됩니다.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">여성 러너에게 특히 중요한 부상 예방 포인트</h2>
          <p className="leading-relaxed text-gray-700 mb-4">
            여성 러너는 골반 구조 차이로 인해 남성보다 슬개대퇴 증후군(러너 무릎)과 장경인대염 발생률이 높습니다.
            권은주 선수와 같은 엘리트 여성 선수들이 장기간 부상 없이 뛸 수 있는 비결은 고관절과 코어 근력 훈련에 있습니다.
          </p>
          <div className="space-y-4">
            {[
              {
                title: "고관절 외전근 강화",
                desc: "옆으로 누워 다리 들기(클램셸), 밴드 사이드 워크 등. 약한 고관절 외전근은 무릎이 안쪽으로 쏠리게 만들어 장경인대염과 슬개골 통증의 원인이 됩니다.",
              },
              {
                title: "코어 안정화",
                desc: "플랭크, 데드버그 등 코어 안정화 운동. 달릴 때 몸통이 좌우로 흔들리면 무릎에 비틀림 부하가 가해집니다. 주 2~3회 10~15분으로도 충분합니다.",
              },
              {
                title: "생리 주기에 따른 훈련 조절",
                desc: "배란 후 황체기에는 인대가 상대적으로 느슨해져 부상 위험이 높아집니다. 이 시기에는 고강도 훈련보다 페이스 런과 회복 훈련을 배치하는 것이 좋습니다.",
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">권은주 선수의 훈련 원칙 — "축적"</h2>
          <blockquote className="border-l-4 border-pink-200 pl-5 py-1 my-4 text-gray-700 italic">
            "하루 훈련보다 일주일, 한 달, 1년의 훈련이 쌓이는 게 중요합니다.
            한 번의 무리가 몇 달을 날릴 수 있습니다."
          </blockquote>
          <p className="text-xs text-gray-400 mb-4">
            — 권은주 선수 인터뷰 발췌 / 출처:
            <a href="https://www.kaaf.or.kr" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700 ml-1">
              대한육상연맹 ↗
            </a>
          </p>
          <p className="leading-relaxed text-gray-700">
            초보 러너에게 이 원칙을 적용하면 간단합니다. 주당 거리를 전주 대비 10% 이상 늘리지 않는 것.
            "10% 법칙"이라고 불리는 이 원칙은 엘리트 선수뿐 아니라 모든 러너에게 적용되는 가장 기본적인 과부하 예방법입니다.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            {[
              { title: "대한육상연맹 — 권은주 선수 공식 기록", url: "https://www.kaaf.or.kr" },
              { title: "여성 러너 부상 역학 — BJSM (British Journal of Sports Medicine)", url: "https://bjsm.bmj.com" },
              { title: "월경 주기와 부상 위험 — NCBI PubMed", url: "https://pubmed.ncbi.nlm.nih.gov" },
            ].map((ref, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-gray-400 shrink-0">•</span>
                <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">{ref.title} ↗</a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-gray-400">광고·협찬 없이 공적 연구 자료와 러너의 이익을 위해 작성되었습니다.</p>
        </section>


        <YoutubeSection links={[
      { label: "권은주 선수 인터뷰 — 부상 극복과 훈련", channel: "SBS 스포츠", url: "https://www.youtube.com/results?search_query=권은주+마라톤+인터뷰+훈련" },
      { label: "여성 러너 부상 예방 — 전문가 가이드", channel: "런닝 유튜브 KR", url: "https://www.youtube.com/results?search_query=여성+러너+부상+예방+훈련" },
      { label: "여자 마라톤 훈련법 — 페이스·거리 관리", channel: "런닝 유튜브 KR", url: "https://www.youtube.com/results?search_query=여성+마라톤+훈련+페이스+관리" },
        ]} />

        <FaqSection items={[
          {
            q: "여성 러너가 특히 조심해야 할 부상은?",
            a: "골반 구조 차이로 여성은 남성보다 슬개대퇴 증후군(러너 무릎)과 장경인대염 발생률이 높습니다. 엘리트 여성 선수들이 장기간 부상 없이 달리는 비결은 고관절과 코어 근력 훈련에 있습니다.",
          },
          {
            q: "권은주 선수의 훈련 원칙은 무엇인가요?",
            a: "\"빠르게보다 오래\", 즉 '축적'입니다. 한국 여자 마라톤의 대표적인 장수 선수로서, 부상 없이 달리기를 오래 지속하는 것을 우선하는 철학입니다. 초보 러너에게도 그대로 적용됩니다.",
          },
          {
            q: "초보 여성 러너가 바로 적용할 원칙은?",
            a: "주당 거리를 전주 대비 10% 이상 늘리지 않는 '10% 법칙'입니다. 엘리트 선수든 초보든 모든 러너에게 통하는 가장 기본적인 과부하 예방법입니다.",
          },
        ]} />

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
