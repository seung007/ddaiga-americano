import Link from "next/link";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import type { Metadata } from "next";

/**
 * 2026-10-08 재검증 — 기사 원문과 대조(서울신문 1992-08-11 두 기사·매일신문 2024-10-22 은 원문 페이지에서 직접 확인)
 *   · 「당시 24세」 → 22세. 1970-03-22 출생, 서울신문 「황영조(22·코오롱)」, olympics.com 「at age 22」
 *   · 「한국 마라톤 처음이자 유일한 올림픽 금」 → 손기정(1936, 일장기) 이후 「태극기를 달고는 처음」(서울신문 사설), 2024 파리까지 유일
 *   · 「고통은 피하는 것이 아니라 읽어야 하는 신호」, 「통증을 참고 달리는 게 아니라…」 두 인용 — 출처를 찾지 못해 삭제.
 *     《나는 달린다》라는 황영조 저서도 찾지 못했고, 출처 링크는 책이 아니라 백과사전 항목이었다(열람 차단).
 *     실존 인물에게 말을 지어 붙인 것이라 제목·h1·메타·FAQ 의 「고통을 읽는다」 축을 버렸다.
 *     대신 매일신문 강연 기사에서 원문 확인한 본인 발언(「달리기는 지옥…」)을 싣고,
 *     「통증을 신호로 읽자」는 이 글의 제안이지 선수의 말이 아님을 명시했다.
 *   · 「훈련 기록을 보면 초기엔 지속 가능한 페이스부터」, 「몬주익 역전 이유 중 하나는 오르막 훈련」 — 출처 못 찾음, 삭제
 *   · 「주 3회·48시간이 더 효과적」, 「내리막은 부담이 커짐」 — 근거 못 찾음, 경험칙으로 낮춤. 그는 매주 360km 를 달렸다(서울신문 1992)
 *   · 참고 자료의 kaaf.or.kr·worldathletics.org 루트 링크 → 실제 기사·기록 URL
 */
const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/hwang-young-jo";
const TITLE = "황영조의 몬주익 — 초보 러너가 가져갈 것";
const DESC =
  "1992 바르셀로나 올림픽 마라톤 금메달리스트 황영조. 당시 기사와 본인 발언으로 확인한 사실과, 초보 러너에게 주는 이 글의 제안을 구분해 정리했습니다.";

export const metadata: Metadata = {
  title: `${TITLE} — 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/injury/hwang-young-jo" },
};

export default function HwangYoungJoPage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["황영조", "/injury/hwang-young-jo"],
        ]}
      />
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 런닝 이야기
        </Link>

        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full mb-3">황영조</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
            황영조의 몬주익 —<br />초보 러너가 가져갈 것
          </h1>
          {/* 규약은 app/injury/page.tsx 상단 주석 */}
          <p className="text-gray-500 text-sm">4분 읽기</p>

          {/* 비광고 표기 */}
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            협찬 없이 작성 — 기사로 확인한 사실과 이 글의 제안을 구분했습니다
          </div>
        </header>

        <p className="text-lg leading-relaxed mb-4 text-gray-700">
          1992년 8월 9일 바르셀로나 올림픽 마라톤에서 황영조 선수는 결승 약 2km 전 몬주익 언덕 비탈길을 오르며,
          끝까지 따라붙던 일본의 모리시타 고이치를 떼어내고 금메달을 땄습니다. 당시 그의 나이 22세였습니다.
        </p>
        <p className="text-lg leading-relaxed mb-8 text-gray-700">
          1936년 베를린 올림픽에서 손기정 선수가 일장기를 달고 우승한 지 56년 만에, 태극기를 달고 딴 첫 올림픽 마라톤 금메달입니다.
          2024년 파리 대회까지 한국 선수의 올림픽 마라톤 금메달은 이것뿐입니다.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">선수 시절의 고통 — 따라 할 것이 아니다</h2>
          <p className="leading-relaxed text-gray-700 mb-4">
            황영조 선수는 2024년 강연에서 선수 시절을 이렇게 돌아봤습니다.
          </p>
          <blockquote className="border-l-4 border-yellow-300 pl-5 py-1 my-4 text-gray-700 italic">
            &ldquo;나에게 있어서 달리기는 지옥이라고 서술할 수 있을 정도로 고통스러웠고,
            이 고통을 멈추는 일은 운동을 그만두는 일뿐이었다&rdquo;
          </blockquote>
          <p className="text-xs text-gray-400 mb-4">
            — 황영조, 매일 탑 리더스 아카데미 강연 / 출처:
            <a href="https://www.imaeil.com/page/view/2024102212575542554" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700 ml-1">
              매일신문 2024-10-22 ↗
            </a>
          </p>
          <p className="leading-relaxed text-gray-700 mb-4">
            당시 기사에 따르면 그는 1992년 2월 벳푸·오이타 대회 이후 매주 360km씩 달렸습니다.
            엘리트 선수가 견딘 고통과 훈련량을 초보 러너가 따라 할 이유는 없습니다.
          </p>
          <p className="leading-relaxed text-gray-700">
            <strong>통증을 참지 말고 몸이 보내는 신호로 읽자는 것은 이 글의 제안이며, 황영조 선수가 한 말이 아닙니다.</strong>{" "}
            이 페이지에 예전에 실렸던 &ldquo;고통은 읽어야 하는 신호&rdquo;라는 인용은 출처를 찾지 못해 지웠습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">초보 러너가 가져갈 3가지</h2>
          <div className="space-y-4">
            {[
              {
                title: "1. 처음에는 대화가 가능한 속도로",
                desc: "처음부터 빠르게 달리려는 초보가 많다는 것은 현장에서 흔히 하는 이야기로, 저희가 확인한 통계는 없습니다(경험칙). '옆 사람과 대화가 가능한 속도'를 기본 페이스로 삼으세요.",
              },
              {
                title: "2. 주 3회부터, 쉬는 날 끼우기",
                desc: "엘리트의 훈련량은 초보의 기준이 될 수 없습니다. 초보에게는 주 3회 정도로 시작해 달린 날 사이에 쉬는 날을 두는 방식이 흔히 권해지지만(경험칙), 48시간 간격이 더 효과적이라는 연구는 저희가 확인하지 못했습니다.",
              },
              {
                title: "3. 오르막은 보폭을 줄여 천천히",
                desc: "황영조 선수는 결승 약 2km 전 몬주익 비탈길에서 승부를 냈습니다. 그가 언덕 대비 훈련을 따로 했다는 기록은 저희가 찾지 못했습니다. 완만한 오르막은 보폭이 자연히 줄어 평지보다 무릎 부담이 적다고 이야기되지만 저희가 확인한 연구 자료는 없습니다. 내리막도 무릎 부담이 커진다고 흔히 이야기되므로(저희가 확인한 연구는 없습니다) 속도를 낮춰 내려오세요.",
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
                title: "서울신문 1992-08-11 — 「마라톤 코리아」… 「몬주익신화」창조/월계관을 조국에 바친 황영조 (22세, 마지막 2km 몬주익 비탈길, 매주 360km)",
                url: "https://www.seoul.co.kr/news/1992/08/11/19920811003001",
              },
              {
                title: "서울신문 1992-08-11 — 사설 「마라톤의 빛나는 금자탑」 (손기정 이후, 태극기를 달고는 처음)",
                url: "https://www.seoul.co.kr/news/1992/08/11/19920811002001",
              },
              {
                title: "매일신문 2024-10-22 — 황영조 강연 기사",
                url: "https://www.imaeil.com/page/view/2024102212575542554",
              },
              {
                title: "Olympics.com — Young-Cho HWANG 선수 기록",
                url: "https://olympics.com/it/atleti/young-cho-hwang",
              },
              {
                title: "Wikipedia(보조) — 1992 바르셀로나 올림픽 남자 마라톤 (경기일·순위)",
                url: "https://en.wikipedia.org/wiki/Athletics_at_the_1992_Summer_Olympics_%E2%80%93_Men%27s_marathon",
              },
              {
                title: "Wikipedia(보조) — 올림픽 육상 메달리스트 목록 (남자, 1996~2024 마라톤)",
                url: "https://en.wikipedia.org/wiki/List_of_Olympic_medalists_in_athletics_(men)",
              },
              {
                title: "Wikipedia(보조) — 올림픽 육상 메달리스트 목록 (여자 마라톤)",
                url: "https://en.wikipedia.org/wiki/List_of_Olympic_medalists_in_athletics_(women)",
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
            선수 관련 사실은 위 기사·기록으로 확인한 것만 적었고, 확인하지 못한 내용은 본문에 그렇다고 밝혔습니다. 훈련 조언은 경험칙이며 이 글에 연구 인용은 없습니다. 광고·협찬 없이 러너의 이익을 위해 제작됩니다.
          </p>
        </section>


        <YoutubeSection links={[
          // 2026-08-31 검증 완료. 다만 두 건은 출처 맥락에 문제가 있어 남겨둔다.
          //  · "스탐"은 MBC 방송 영상의 재업로드다. 권리자가 아니라 언제든 내려갈 수 있고
          //    저작권 문제도 있다. MBC 공식 채널 영상을 찾으면 교체할 것.
          //  · "한문철 TV"는 교통사고·법률 채널이다. 황영조 게스트 출연이라 거짓은 아니지만
          //    러닝 사이트가 인용할 출처로는 맥락이 어긋난다.
      { label: "몬주익의 언덕을 극복한 몬주익의 영웅 — 1992 바르셀로나 올림픽 남자 마라톤", channel: "스탐", url: "https://www.youtube.com/watch?v=YuEVcF9Ivi0" },
          { label: "1992 바르셀로나 올림픽 마라톤 금메달리스트 황영조 선수와 함께", channel: "한문철 TV", url: "https://www.youtube.com/watch?v=g2k77DarTEs" },
      { label: "황영조의 마라톤 금메달, 경기장엔 손기정이 기다리고 있었다", channel: "JTBC News", url: "https://www.youtube.com/watch?v=_-GwbFEU99E" },
        ]} />

        <FaqSection items={[
          {
            q: "황영조 선수는 어떤 기록을 세웠나요?",
            a: "1992년 바르셀로나 올림픽 마라톤에서 결승 약 2km 전 몬주익 언덕 비탈길을 오르며 일본의 모리시타 고이치를 떼어내고 금메달을 땄습니다. 당시 22세였습니다. 1936년 손기정 선수가 일장기를 달고 우승한 지 56년 만에 태극기를 달고 딴 첫 올림픽 마라톤 금메달이며, 2024년 파리 대회까지 한국의 올림픽 마라톤 금메달은 이것뿐입니다.",
          },
          {
            q: "'통증을 신호로 읽는다'는 황영조 선수의 말인가요?",
            a: "아닙니다. 이 페이지에 예전에 실렸던 '고통은 읽어야 하는 신호'라는 인용은 출처를 찾지 못해 지웠습니다. 황영조 선수는 2024년 강연에서 선수 시절 달리기가 '지옥이라고 서술할 수 있을 정도로 고통스러웠다'고 돌아봤습니다(매일신문 2024-10-22). 통증을 참지 말고 신호로 읽자는 것은 이 글의 제안입니다.",
          },
          {
            q: "초보 러너가 여기서 가져갈 점은 무엇인가요?",
            a: "엘리트의 고통과 훈련량을 기준으로 삼지 않는 것입니다. 대화가 가능한 속도로, 쉬는 날을 끼워 가며 달리고, 통증이 계속되면 멈추고 진료를 받으세요. 이 조언은 경험칙이며 이 글에 연구 인용은 없습니다.",
          },
        ]} />

        <p className="text-xs text-gray-400 mb-4">※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 통증이 지속되면 전문의 상담을 권장합니다.</p>

        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl">
          <p className="font-medium text-emerald-900 mb-2">내 발에 맞는 신발 찾기</p>
          <Link href="/shoe-finder" className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            내 러닝화 찾기 →
          </Link>
        </div>
      </article>
    </>
  );
}
