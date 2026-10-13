import Link from "next/link";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import { Up, S } from "@/components/guide/Up";
import { Lead, P, H2, H3, Summary, Todo, Evidence, References, Basis, Note } from "@/components/guide/Read";
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
 *
 * 2026-10-13 가독성 재설계 — 섹션마다 답 → 할 일 → 근거(접힘). 숫자·출처는 <Evidence> 안으로.
 *   「다리 길이는 연구마다 다름」「대부분 그 자리 효과만 봄」「근거가 매우 제한적」 단서는 본문에 남겼다.
 *   「현재 값에서 조금씩 올려라」는 원래 「연구에 더 가까운 조언」(저희 해석) → 「저희 제안」 배지.
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
      <article className="mx-auto max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-600">케이던스</span>
          {/* 규약은 app/injury/page.tsx 상단 주석 */}
          <span className="text-xs text-gray-400">3분 읽기</span>
          <span className="text-xs text-gray-400">· 협찬 없이 작성</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">
          케이던스 180이 모두의 정답은 아닙니다<br />속도와 개인차
        </h1>
        <Lead>
          &ldquo;케이던스 180 spm을 유지해야 부상을 막을 수 있다&rdquo;는 조언이 흔합니다. 하지만 180은 모두에게 맞는
          목표값이 아니고, 같은 사람도 속도에 따라 달라집니다.
        </Lead>

        <Summary
          items={[
            <>같은 사람도 <strong>속도가 빠를수록 케이던스가 올라갑니다.</strong> 180은 모두의 목표값이 아닙니다.<Basis kind="paper" /></>,
            <>남성 러너 연구에서 <strong>키·다리 길이로 개인 케이던스를 정할 수 없다</strong>는 결론이 나왔습니다.<Basis kind="paper" /></>,
            <>지금보다 5~10% 올리면 실험실에서 <strong>무릎이 흡수하는 에너지가 줄었습니다.</strong> 부상 효과는 근거 부족.<Basis kind="paper" /></>,
            <>180에 맞추지 말고 <strong>지금 값에서 조금씩</strong> 올려 보세요.<Basis kind="rule" /></>,
          ]}
        />

        {/* ── ① ─────────────────────────────────────────── */}
        <h2 id="where-180" className={H2}>
          180이라는 숫자는 어디서 나왔나요
        </h2>
        <P>
          1984년 스포츠 과학자 잭 다니엘스(Jack Daniels)가 LA 올림픽 선수들을 관찰한 데서 나왔다고 흔히 알려져 있습니다.
          다만 <strong>저희는 그 원 기록을 확인하지 못했습니다.</strong>
        </P>
        <P>분당 180걸음을 권하는 조언이 흔하다는 점은 연구 논문에도 적혀 있습니다.</P>
        <Evidence n={1}>
          <p>
            분당 90보폭(180걸음)을 권하는 조언이 흔하다는 점은 연구 논문에도 적혀 있습니다.{" "}
            <S>(Lieberman et al. (2015) <Up h="https://pubmed.ncbi.nlm.nih.gov/26538175/" />)</S>
          </p>
        </Evidence>

        {/* ── ② ─────────────────────────────────────────── */}
        <h2 id="height" className={H2}>
          키에 맞는 케이던스가 따로 있나요
        </h2>
        <P>
          남성 일반 러너를 잰 한 연구에서 키·다리 길이와 케이던스의 관계가 약했고, 연구진은 신체 치수로 개인 케이던스를 정할 수
          없다고 결론 냈습니다.
        </P>
        <P>
          대신 러너 256명의 웨어러블 기록에서 <strong>속도가 빠를수록 케이던스가 올라갔습니다.</strong> 14명을 같은 속도로 달리게 한
          실험에서는 에너지가 가장 적게 드는 케이던스가 사람마다 달랐습니다.
        </P>
        <Note>다리 길이와 케이던스의 관계는 연구마다 결과가 다릅니다.</Note>
        <Evidence n={3}>
          <p>
            남성 일반 러너를 측정한 연구에서 키·다리 길이와 선호 케이던스의 상관은 낮았고 통계적으로 유의하지 않았습니다.
            연구진은 신체 치수로 개인의 케이던스를 처방할 수 없다고 결론 냈습니다.{" "}
            <S>(Cavanagh &amp; Kram (1989) <Up h="https://pubmed.ncbi.nlm.nih.gov/2674599/" />)</S>
          </p>
          <p>
            속도가 빠를수록 케이던스가 올라간다는 점은 러너 256명의 웨어러블 기록에서도 확인됐습니다.{" "}
            <S>(Van Oeveren et al. (2019) <Up h="https://pubmed.ncbi.nlm.nih.gov/31079578/" />)</S>
          </p>
          <p>
            키·체중이 다양한 러너 14명을 같은 속도로 달리게 한 실험에서도 에너지가 가장 적게 드는 케이던스는 사람마다 달랐습니다.{" "}
            <S>(Lieberman et al. (2015) <Up h="https://pubmed.ncbi.nlm.nih.gov/26538175/" />)</S>
          </p>
        </Evidence>
        <P className="text-sm text-gray-500">
          그래서 예전에 이 자리에 있던 「키별 적정 케이던스 표」는 내렸습니다. 근거가 없는 숫자였습니다.
        </P>

        {/* ── ③ ─────────────────────────────────────────── */}
        <h2 id="raise" className={H2}>
          케이던스를 올리면 뭐가 달라지나요
        </h2>
        <P>
          일반 러너 45명의 트레드밀 실험에서 지금보다 5~10% 올리면 <strong>무릎이 흡수하는 에너지가 줄었습니다.</strong> 10%
          올렸을 때는 고관절도 줄었습니다.
        </P>
        <P>
          다만 <strong>부상이나 기록이 좋아지는지는 아직 근거가 부족합니다.</strong> 갑자기 올리면 더 힘들게 느껴지고 에너지
          소모가 늘 수 있다는 근거도 있지만, 그 근거는 매우 제한적입니다.
        </P>
        <Note>
          연구 37편을 모은 고찰에서는 부하 지표가 줄거나 변화가 없었고, 대부분 바로 그 자리의 효과만 본 연구였습니다.
        </Note>
        <Evidence n={2}>
          <p>
            건강한 일반 러너 45명의 트레드밀 실험에서 케이던스를 평소보다 5~10% 올리면 무릎이 흡수하는 에너지가 줄었고,
            10% 올렸을 때는 고관절도 줄었습니다.{" "}
            <S>(Heiderscheit et al. (2011) <Up h="https://pubmed.ncbi.nlm.nih.gov/20581720/" />)</S>
          </p>
          <p>
            연구 37편을 모은 체계적 고찰에서도 케이던스를 올리면 발목·무릎·고관절의 부하 지표가 줄거나 변화가 없었습니다.
            다만 부상과 기록에 미치는 효과는 근거가 부족하고, 대부분 바로 그 자리의 효과만 본 연구였습니다. 케이던스를 갑자기
            올리면 더 힘들게 느껴지고 에너지 소모가 늘 수 있다는 근거가 있지만, 그 근거는 매우 제한적입니다.{" "}
            <S>(Anderson et al. (2022) <Up h="https://pubmed.ncbi.nlm.nih.gov/36057913/" />)</S>
          </p>
        </Evidence>
        <Todo
          basis="rule"
          items={[
            "180에 맞추지 않습니다. 케이던스는 목표값이 아닙니다.",
            "먼저 지금 내 케이던스를 잽니다(아래).",
            "지금 값에서 조금씩 높여 봅니다.",
          ]}
        />

        <h3 className={H3}>내 케이던스 재는 법</h3>
        <ol className="mt-3 list-inside list-decimal space-y-1.5 break-keep text-[15px] leading-[1.7] text-gray-700">
          <li>편안한 페이스로 1분 달립니다</li>
          <li>오른발이 땅에 닿는 횟수를 30초 동안 셉니다</li>
          <li>그 숫자에 4를 곱하면 분당 케이던스(spm)입니다</li>
        </ol>

        <div className="mt-14">
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
        </div>

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

        <References n={6} title="참고 자료" note="2026-10-08 초록과 대조했습니다.">
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
        </References>

        <p className="mt-6 text-xs text-gray-400">※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 통증이 지속되면 전문의 상담을 권장합니다.</p>

        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl">
          <p className="font-medium text-emerald-900 mb-2">내 발에 맞는 신발 찾기</p>
          <Link href="/shoe-finder" className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            나에게 맞는 신발 찾기 →
          </Link>
        </div>
      </article>
    </>
  );
}
