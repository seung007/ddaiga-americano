import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ExerciseFigure from "@/components/ExerciseFigure";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "달리기 전 5분 동적 스트레칭 루틴 — 뛰다가 아메리카노",
  description: "정적 스트레칭이 아닌 동적 워밍업이 필요한 이유와 구체적인 5분 루틴을 알려드립니다.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 부상 예방 가이드
        </Link>
        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full mb-3">준비운동</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">달리기 전 5분 동적 스트레칭 루틴</h1>
          <p className="text-gray-500 text-sm mb-4">4분 읽기</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            협찬 없이 작성 — 공개 연구 및 의학 자료 기반
          </div>
        </header>
        {/* 2026-09-03 정정: "근육 출력을 10~15% 낮춥니다"라고 적혀 있었다.
            Behm & Chaouachi 2011이 보고한 것은 **-1.2% ~ -8.5%**이고, 상한도 10%에 못 미친다.
            그리고 더 중요한 조건이 통째로 빠져 있었다 — **용량-반응 관계**다.
            60초 이상 붙들고 있을 때라야 유의한 저하가 나오고, 짧게 하면 거의 영향이 없다.
            방향은 맞았지만 크기와 조건이 둘 다 틀렸으므로 둘 다 고친다.
            (레이트 리밋으로 1차 초록 직접 조회는 못 했다. 수치를 단정하지 않고 서술한다) */}
        <p className="text-lg leading-relaxed mb-8 text-gray-700">달리기 전에 앉아서 오래 붙들고 늘리는 정적 스트레칭은 근육 출력을 일시적으로 떨어뜨릴 수 있습니다. 다만 <strong>한 자세를 60초 이상 유지했을 때</strong> 주로 나타나고, 짧게 하면 영향이 거의 없다고 보고됩니다. 달리기 전에는 관절을 움직이며 혈류를 올리는 동적 워밍업이 더 맞습니다.</p>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">왜 동적 워밍업인가?</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">근육은 차가울 때 탄성이 낮아 미세 파열 위험이 높습니다. 동적 스트레칭은 체온과 심박수를 서서히 올리면서 달리기에 쓰이는 관절 범위를 미리 활성화합니다. 정적 스트레칭은 달리기 후 쿨다운 단계에서 합니다.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">5분 동적 루틴</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-500">
            위에서부터 순서대로 하고, 마지막 1분은 천천히 조깅으로 마무리합니다.
            그림은 <strong className="text-gray-700">동작을 알아보게 하는 도식</strong>이지 자세를 교정해주는
            자료가 아닙니다 — 아래 &ldquo;이 동작들의 근거&rdquo;를 함께 읽어주세요.
          </p>

          <div className="space-y-3">
            <ExerciseFigure
              move="march"
              title="① 제자리 걷기"
              reps="1분"
              cue="가장 먼저 체온을 올리는 단계입니다. 빨리 할 필요가 없어요. 팔을 같이 흔들면서 숨이 살짝 가빠질 정도면 충분합니다."
            />
            <ExerciseFigure
              move="legSwing"
              title="② 레그 스윙 (앞뒤·옆)"
              reps="각 10회"
              cue="벽이나 기둥을 짚고 합니다. 흔한 실수는 반동으로 크게 차는 것 — 허리가 같이 젖혀지면 범위를 줄이세요. 골반은 정면에 고정합니다."
            />
            <ExerciseFigure
              move="hipCircle"
              title="③ 힙 써클"
              reps="양방향 각 10회"
              cue="손을 허리에 얹고 골반으로 원을 그립니다. 상체를 크게 돌리는 게 아니라 골반만 움직이는 동작이에요."
            />
            <ExerciseFigure
              move="lunge"
              title="④ 워킹 런지"
              reps="10보"
              cue="앞으로 한 발 내딛고 내려앉았다가 일어나 반대 발로 이어갑니다. 앞 무릎이 발끝보다 많이 앞으로 나가지 않게, 상체는 세운 채로."
            />
            <ExerciseFigure
              move="highKnees"
              title="⑤ 하이 니즈"
              reps="30초"
              cue="무릎을 골반 높이까지 빠르게 올립니다. 여기서부터 심박이 확 올라와요. 상체가 뒤로 젖혀지면 속도를 낮추세요."
            />
            <ExerciseFigure
              move="buttKicks"
              title="⑥ 버트 킥스"
              reps="30초"
              cue="뒤꿈치로 엉덩이를 차듯 올립니다. 허벅지 앞쪽이 늘어나는 느낌이 나면 제대로 하고 있는 겁니다."
            />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-gray-900">이 동작들의 근거</h2>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">통용 관행</span>
              <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">논문 근거 아님</span>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-gray-700">
              <strong className="text-gray-900">개별 동작의 폼은 논문에서 가져온 것이 아닙니다.</strong>{" "}
              &ldquo;무릎을 몇 도까지 올려야 한다&rdquo; 같은 수치를 뒷받침하는 연구를 확인하지 않았고,
              그래서 그림에 각도를 적지 않았습니다. 러닝 코칭에서 널리 쓰이는 동작을 알아보기 쉽게 그린 것입니다.
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              근거가 있는 쪽은 <strong className="text-gray-900">&ldquo;달리기 전에는 정적보다 동적&rdquo;이라는 방향</strong>까지입니다.
              그 이상으로 &ldquo;이 순서가 최적&rdquo;이라거나 &ldquo;이 루틴이 부상을 줄인다&rdquo;고는 말하지 않겠습니다 —
              그걸 보여주는 연구를 확인하지 못했습니다.
            </p>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">추운 날 주의사항</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">겨울에는 워밍업 시간을 2배로 늘립니다. 근육이 따뜻해지는 데 더 오랜 시간이 걸리며, 차가운 공기 자체가 호흡기에 부담을 줍니다. 마스크 착용 또는 실내 워밍업을 권장합니다.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-gray-400">•</span><span className="text-gray-500">동적·정적 스트레칭 자료 — 검증기가 무관한 논문을 가리키는 것을 확인해 링크를 내렸습니다 (2026-08-31)</span></li>
            {/* 2026-09-03: 여기에 "NSCA — Warm-up guidelines for endurance athletes ↗"라는
                구체적인 제목이 달려 있었는데 **링크는 nsca.com 루트**였다. 그런 제목의 문서를
                가리키고 있지 않았다. 제목만 그럴듯한 형태이고, AGENTS.md §1의 작화 신호
                ("그럴듯하게 일반적인 이름")에 해당한다. 실제 문서를 확인하지 못했으므로 내린다.
                미확인은 비워두는 쪽이 맞다(§4). */}
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://pubmed.ncbi.nlm.nih.gov/21373870/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Behm &amp; Chaouachi (2011) Eur J Appl Physiol 111:2633-2651 — 정적·동적 스트레칭의 즉각적 효과 리뷰. 용량-반응 관계 보고 ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><span className="text-gray-500">개별 동작의 폼은 통용 관행이며 논문 출처가 없습니다. 위 &ldquo;이 동작들의 근거&rdquo; 참고</span></li>

          </ul>
          <p className="mt-3 text-xs text-gray-400">추천 순서는 광고비로 바뀌지 않습니다. 공개된 연구 자료를 근거로 작성했습니다.</p>
        </section>

        <YoutubeSection links={[
          { label: "러닝 전 동적 스트레칭 — 워밍업 8분, 부상방지·퍼포먼스 향상", channel: "빅씨스 Bigsis", url: "https://www.youtube.com/watch?v=ddJ9JUcIHvU" },
          { label: "러닝 전 꼭 해야 할 동적 스트레칭 #달리기준비운동", url: "https://www.youtube.com/watch?v=rEj3vyacaw4" },
        ]} />

        <FaqSection items={[
          {
            q: "달리기 전에 정적 스트레칭을 하면 안 되나요?",
            a: "\"하면 안 된다\"보다는 \"오래 붙들지 마라\"가 정확합니다. Behm & Chaouachi(2011) 리뷰는 정적 스트레칭이 근육 출력을 떨어뜨릴 수 있다고 정리하면서, 동시에 명확한 용량-반응 관계를 보고합니다 — 한 자세를 60초 이상 유지했을 때 유의한 저하가 나타나고, 짧게 하면 영향이 거의 없습니다. 그러니 달리기 전에는 관절을 움직이는 동적 워밍업을 주로 하고, 정적 스트레칭은 달린 뒤 쿨다운에서 하세요.",
          },
          {
            q: "5분 동적 워밍업은 어떻게 구성하나요?",
            a: "① 제자리 걷기 1분 → ② 레그 스윙(앞뒤·옆) 각 10회 → ③ 힙 써클 각 10회 → ④ 워킹 런지 10보 → ⑤ 하이 니즈 30초 → ⑥ 버트 킥스 30초. 마지막 1분은 천천히 조깅으로 마무리합니다.",
          },
          {
            q: "추운 날에는 워밍업을 어떻게 해야 하나요?",
            a: "겨울에는 워밍업 시간을 평소의 2배로 늘리세요. 근육이 따뜻해지는 데 더 오래 걸리고, 차가운 공기가 호흡기에 부담을 줍니다. 마스크 착용이나 실내 워밍업을 권장합니다.",
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
