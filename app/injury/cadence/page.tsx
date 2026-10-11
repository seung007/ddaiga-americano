import Link from "next/link";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import { Up, S } from "@/components/guide/Up";
import type { Metadata } from "next";

/**
 * 2026-10-08 재검증 — 초록과 대조
 *   · 키별 기준표 삭제 — Cavanagh & Kram 1989: 키·다리 길이와 선호 보빈도 상관이 낮고 유의하지 않음,
 *     신체 치수로 개인 보빈도를 처방할 수 없다고 결론. 제목·h1·meta 의 「키별 적정 기준값」 전제도 버림
 *   · 「180 = 키 175cm 남성 엘리트 평균」 → 원 기록 확인 못 함. 「다니엘스 1984」는 「알려져 있다」로 낮춤
 *   · 「±5 spm 편차는 정상」 → 근거 못 찾음, 삭제
 *   · Heiderscheit 2011 → 「충격」이 아니라 「무릎이 흡수하는 에너지」. 고관절은 +10%에서만
 *   · Van Oeveren 2019 → 「속도가 빠를수록 케이던스가 올라간다」까지만. 다리 길이는 「연구마다 다르다」
 *   · Anderson 2022 체계적 고찰 추가 — 부하 지표는 줄거나 변화 없음, 부상·성능 효과는 근거 부족
 */
const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/cadence";
const TITLE = "케이던스 180이 모두의 정답은 아닙니다 — 속도와 개인차";
const DESC =
  "케이던스 180 spm은 모두에게 맞는 목표값이 아닙니다. 같은 사람도 속도에 따라 달라지고, 키로 적정 케이던스를 정할 수는 없다는 연구가 있습니다. 케이던스를 조금 올렸을 때 연구가 말하는 효과까지 정리했습니다.";

export const metadata: Metadata = {
  title: "케이던스 180이 모두의 정답은 아닙니다 — 속도와 개인차 | 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/cadence" },
};

export default function CadencePage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["케이던스", "/injury/cadence"],
        ]}
      />
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 주법 & 달리기 기술
        </Link>

        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full mb-3">케이던스</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
            케이던스 180이 모두의 정답은 아닙니다<br />속도와 개인차
          </h1>
          {/* 규약은 app/injury/page.tsx 상단 주석 */}
          <p className="text-gray-500 text-sm mb-4">4분 읽기</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            협찬 없이 작성 — 연구로 확인된 것과 확인하지 못한 것을 구분해 적었습니다
          </div>
        </header>

        <p className="text-lg leading-relaxed mb-8 text-gray-700">
          유튜브와 러닝 커뮤니티에는 &ldquo;케이던스 180 spm을 유지해야 부상을 막을 수 있다&rdquo;는 조언이 넘쳐납니다.
          하지만 180은 모두에게 맞는 목표값이 아닙니다. 같은 사람도 속도에 따라 케이던스가 달라지고,
          사람마다 차이도 큽니다.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">180 spm의 출처</h2>
          <p className="leading-relaxed text-gray-700 mb-4">
            흔히 1984년 스포츠 과학자 잭 다니엘스(Jack Daniels)가 LA 올림픽 선수들을 관찰한 데서 나왔다고 알려져 있습니다.
            다만 저희는 그 원 기록을 확인하지 못했습니다. 분당 90보폭(180걸음)을 권하는 조언이 흔하다는 점은
            연구 논문에도 적혀 있습니다.{" "}
            <S>(Lieberman et al. (2015) <Up h="https://pubmed.ncbi.nlm.nih.gov/26538175/" />)</S>
          </p>
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-sm text-purple-900">
            <strong>핵심:</strong> 케이던스는 목표값이 아닙니다.
            케이던스를 갑자기 올리면 더 힘들게 느껴지고 에너지 소모가 늘 수 있다는 근거가 있지만, 그 근거는 매우 제한적입니다.{" "}
            <S>(Anderson et al. (2022) <Up h="https://pubmed.ncbi.nlm.nih.gov/36057913/" />)</S>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">키로 케이던스를 정할 수 있을까</h2>
          <p className="leading-relaxed text-gray-700 mb-4">
            남성 일반 러너를 측정한 연구에서 키·다리 길이와 선호 케이던스의 상관은 낮았고 통계적으로 유의하지 않았습니다.
            연구진은 신체 치수로 개인의 케이던스를 처방할 수 없다고 결론 냈습니다.{" "}
            <S>(Cavanagh &amp; Kram (1989) <Up h="https://pubmed.ncbi.nlm.nih.gov/2674599/" />)</S>{" "}
            다리 길이와 케이던스의 관계는 연구마다 결과가 다릅니다.
          </p>
          <p className="leading-relaxed text-gray-700 mb-4">
            반면 <strong>속도가 빠를수록 케이던스가 올라간다</strong>는 점은 러너 256명의 웨어러블 기록에서도 확인됐습니다.{" "}
            <S>(Van Oeveren et al. (2019) <Up h="https://pubmed.ncbi.nlm.nih.gov/31079578/" />)</S>{" "}
            키·체중이 다양한 러너 14명을 같은 속도로 달리게 한 실험에서도 에너지가 가장 적게 드는 케이던스는 사람마다 달랐습니다.{" "}
            <S>(Lieberman et al. (2015) <Up h="https://pubmed.ncbi.nlm.nih.gov/26538175/" />)</S>
          </p>
          <p className="text-sm text-gray-500">
            그래서 예전에 이 자리에 있던 「키별 적정 케이던스 표」는 내렸습니다. 근거가 없는 숫자였습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">케이던스를 높이면 실제로 달라지는 것</h2>
          <p className="leading-relaxed text-gray-700 mb-4">
            건강한 일반 러너 45명의 트레드밀 실험에서 케이던스를 평소보다 5~10% 올리면 무릎이 흡수하는 에너지가 줄었고,
            10% 올렸을 때는 고관절도 줄었습니다.{" "}
            <S>(Heiderscheit et al. (2011) <Up h="https://pubmed.ncbi.nlm.nih.gov/20581720/" />)</S>
          </p>
          <p className="leading-relaxed text-gray-700 mb-4">
            연구 37편을 모은 체계적 고찰에서도 케이던스를 올리면 발목·무릎·고관절의 부하 지표가 줄거나 변화가 없었습니다.
            다만 부상과 기록에 미치는 효과는 근거가 부족하고, 대부분 바로 그 자리의 효과만 본 연구였습니다.{" "}
            <S>(Anderson et al. (2022) <Up h="https://pubmed.ncbi.nlm.nih.gov/36057913/" />)</S>
          </p>
          <p className="leading-relaxed text-gray-700 mb-4">
            그래서 &ldquo;180 spm으로 맞춰라&rdquo;가 아니라 &ldquo;현재 케이던스에서 조금씩 높여 보라&rdquo;가 연구에 더 가까운 조언입니다.
          </p>
          <div className="border border-gray-100 rounded-xl p-4 text-sm text-gray-700">
            <p className="font-semibold mb-2">현재 케이던스 측정 방법</p>
            <ol className="space-y-1 list-decimal list-inside text-gray-600">
              <li>편안한 페이스로 1분 달립니다</li>
              <li>오른발이 땅에 닿는 횟수를 30초 동안 셉니다</li>
              <li>그 숫자에 4를 곱하면 분당 케이던스(spm)입니다</li>
            </ol>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            {/**
             * ⚠️ 2026-09-14 — 「Jack Daniels' Running Formula」·「BJSM — Cadence review」 두 항목이
             * 루트 도메인이었다. 특정 문헌이 아니므로 내렸다.
             */}
            <li className="flex gap-2"><span className="text-gray-400 shrink-0">•</span><span><strong>Heiderscheit et al. (2011)</strong> — 케이던스 ±5·10% 조작 시 하지 관절 역학(일반 러너 45명, 트레드밀). <a href="https://pubmed.ncbi.nlm.nih.gov/20581720/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span></li>
            <li className="flex gap-2"><span className="text-gray-400 shrink-0">•</span><span><strong>Anderson et al. (2022)</strong> — 케이던스 변경의 부상·성능·생체역학 효과 체계적 고찰(37편). <a href="https://pubmed.ncbi.nlm.nih.gov/36057913/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span></li>
            <li className="flex gap-2"><span className="text-gray-400 shrink-0">•</span><span><strong>Cavanagh &amp; Kram (1989)</strong> — 신체 치수와 선호 보폭·보빈도의 상관이 낮음(남성 일반 러너). <a href="https://pubmed.ncbi.nlm.nih.gov/2674599/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span></li>
            <li className="flex gap-2"><span className="text-gray-400 shrink-0">•</span><span><strong>Van Oeveren et al. (2019)</strong> — 속도에 따른 보빈도 변화(웨어러블 기록, 256명). <a href="https://pubmed.ncbi.nlm.nih.gov/31079578/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span></li>
            <li className="flex gap-2"><span className="text-gray-400 shrink-0">•</span><span><strong>Lieberman et al. (2015)</strong> — 보빈도·착지 위치와 제동력·충격·에너지 소모(14명). <a href="https://pubmed.ncbi.nlm.nih.gov/26538175/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">PubMed ↗</a></span></li>
            <li className="flex gap-2"><span className="text-gray-400 shrink-0">•</span><span className="text-gray-500">「Jack Daniels&apos; Running Formula」·「BJSM Cadence review」 항목 — 링크가 특정 문헌이 아니라 홈페이지 주소여서 내렸습니다 (2026-09-14)</span></li>
          </ul>
          <p className="mt-3 text-xs text-gray-400">추천 순서는 광고비로 바뀌지 않습니다. 연구로 확인한 문장에는 출처를 붙였고, 확인하지 못한 부분은 본문에 그렇게 적었습니다.</p>
        </section>


        <YoutubeSection links={[
          { label: "케이던스·보폭의 진실 — 내 몸에 맞는 리듬 찾기", channel: "신정식 RUN_TV", url: "https://www.youtube.com/watch?v=2RBeakkyw7c" },
          { label: "초보러너에게 맞는 케이던스 찾기 (보폭, 리듬) | 존2 러닝", channel: "뛰뛰 유경띠", url: "https://www.youtube.com/watch?v=bbgqFviCdd8" },
          { label: "케이던스는 무조건 빠른 게 좋을까? [달리기 보폭과 케이던스]", channel: "달려라주원", url: "https://www.youtube.com/watch?v=9XIpX69kW2c" },
          { label: "직접 180 케이던스로 뛰어보며 비교 — 러닝 트렌드", channel: "방구석 운동가 디어", url: "https://www.youtube.com/watch?v=iGeS1N1eYJQ" },
          { label: "러닝 케이던스 180으로 고정하지 마세요", channel: "런앤다이어트", url: "https://www.youtube.com/shorts/FoMWaZKMTMU" },
          { label: "러닝 케이던스 올리는 법", channel: "지니코치", url: "https://www.youtube.com/shorts/AYcPMquGIds" },
          { label: "이상적인 러닝 케이던스는? (서울대 스포츠공학)", channel: "엔듀로레이스 ENDURORACE", url: "https://www.youtube.com/shorts/c0mtXc3Twmo" },
          { label: "케이던스 180이 정답일까요?", channel: "엔듀로레이스 ENDURORACE", url: "https://www.youtube.com/shorts/PUBWGbEuTSg" },
        ]} />

        <FaqSection items={[
          {
            q: "케이던스 180 spm을 꼭 맞춰야 하나요?",
            a: "아니요. 180은 모두에게 맞는 목표값이 아닙니다. 같은 사람도 속도가 빠를수록 케이던스가 올라가고, 키·다리 길이로 개인의 케이던스를 처방할 수 없다고 결론 낸 연구가 있습니다. 180이 1984년 잭 다니엘스의 관찰에서 나왔다는 이야기는 널리 알려져 있지만, 저희는 원 기록을 확인하지 못했습니다.",
          },
          {
            q: "내 케이던스는 어떻게 측정하나요?",
            a: "한쪽 발(예: 오른발)이 땅에 닿는 횟수를 30초 동안 센 뒤 4를 곱하면 분당 케이던스(spm)입니다.",
          },
          {
            q: "케이던스를 높이면 뭐가 좋아지나요?",
            a: "일반 러너 45명의 실험에서 현재보다 5~10% 높이면 무릎이 흡수하는 에너지가 줄었고, 10% 높였을 때는 고관절도 줄었습니다(Heiderscheit 2011). 다만 부상 예방 효과는 아직 근거가 부족합니다(Anderson 2022). '180으로 맞춰라'가 아니라 '현재 케이던스에서 조금씩 높여라'가 핵심입니다.",
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
