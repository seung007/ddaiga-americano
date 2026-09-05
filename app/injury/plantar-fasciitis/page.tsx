import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ShareButtons from "@/components/ShareButtons";
import InlineAsk from "@/components/InlineAsk";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "족저근막염 — 아침 첫발이 아픈 이유와 근거 있는 대처 | 뛰다가 아메리카노",
  description:
    "아침 첫 걸음에 발뒤꿈치가 아프다면 족저근막염일 수 있습니다. 스트레칭보다 효과가 확인된 고부하 근력 운동, 회복 기간, 병원에 가야 할 신호를 논문 링크와 함께 정리했습니다.",
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
          <span className="inline-block text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full mb-3">부상 부위</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">족저근막염 — 아침 첫발이 아픈 이유</h1>
          <p className="text-gray-500 text-sm mb-4">5분 읽기</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            협찬 없이 작성 — 아래 모든 주장에 논문 링크를 답니다
          </div>
        </header>

        <p className="text-lg leading-relaxed mb-8 text-gray-700">
          <strong>아침에 일어나 딛는 첫 몇 걸음이 가장 아프고, 걷다 보면 좀 나아졌다가, 오래 서 있거나 많이 걸으면 다시 아파진다</strong> —
          이게 족저근막 통증의 전형적인 패턴입니다. 초보 러너 부상 중 약 5%를 차지합니다.
        </p>

        <section className="mb-8 p-5 bg-gray-50 rounded-2xl border border-gray-200">
          <h2 className="text-base font-bold text-gray-900 mb-2">이름부터 — &lsquo;염&rsquo;이 아닙니다</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            흔히 &lsquo;족저근막<strong>염</strong>&rsquo;이라고 부르지만, 조직을 실제로 들여다보면 염증보다 <strong>퇴행성 변화</strong>가
            주로 관찰됩니다. 그래서 최근 문헌은 <em>plantar fasciopathy</em>(족저근막병증) 또는 <em>plantar heel pain</em>(발뒤꿈치 통증)이라는
            이름을 씁니다. 이게 중요한 이유는 실질적입니다 — <strong>소염제를 먹는 것으로 해결되지 않는 이유</strong>가 여기 있습니다.
          </p>
        </section>

        {/* 안전 정보를 위쪽에 둔다 */}
        <section className="mb-8 p-5 bg-red-50 rounded-2xl border border-red-200">
          <h2 className="text-lg font-bold text-red-900 mb-3">병원에 가야 할 신호</h2>
          <p className="text-sm text-red-900 leading-relaxed mb-3">
            발뒤꿈치 통증이 전부 족저근막 문제는 아닙니다. 아래는 다른 원인을 의심해야 하는 경우입니다.
          </p>
          <ul className="text-sm text-red-900 space-y-2">
            <li>• <strong>양쪽 발뒤꿈치가 동시에</strong> 아프다 — 특히 젊은 사람이라면 전신 염증성 관절질환 가능성이 있습니다</li>
            <li>• <strong>저리거나 타는 듯한 느낌</strong>, 발바닥 감각 이상 — 신경 눌림일 수 있습니다</li>
            <li>• 뒤꿈치를 <strong>양옆에서 눌렀을 때</strong> 아프다, 또는 쉬어도 계속 아프다 — 종골 피로골절 가능성</li>
            <li>• 다치고 나서 갑자기 시작됐다, 또는 &lsquo;퍽&rsquo; 하는 느낌 뒤에 시작됐다</li>
            <li>• 발열, 발적, 부종이 같이 있다</li>
          </ul>
          <p className="text-xs text-red-700 mt-3 leading-relaxed">
            스테로이드 주사는 단기 통증에 효과가 있지만 <strong>족저근막 파열과 발뒤꿈치 지방패드 위축</strong> 위험이 보고돼 있습니다.
            맞을지 여부는 반드시 의사와 상의하세요.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">근거가 있는 위험 요인</h2>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>
              • <strong>발목이 잘 안 꺾임(발등쪽 굽힘 제한)</strong> — 가장 강한 요인입니다. 무릎을 편 상태에서 발목 배측굴곡이
              0도 이하인 사람은 10도 넘는 사람 대비 오즈비 <strong>23.3</strong> (95% CI 4.3~124.4). 신뢰구간이 매우 넓다는 점은
              같이 봐야 합니다
            </li>
            <li>• <strong>BMI 30 이상</strong> — 25 미만 대비 오즈비 5.6 (95% CI 1.9~16.6)</li>
            <li>• <strong>하루 대부분을 서서 일함</strong> — 오즈비 3.6 (95% CI 1.3~10.1)</li>
            <li>• 훈련량을 갑자기 늘린 경우</li>
          </ul>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            위 수치는 일반 인구 대상 환자-대조군 연구에서 나온 것이라, 러너에게 그대로 적용된다고 보기는 어렵습니다.
            특히 BMI는 운동하는 사람에게서는 관련성이 약해진다고 알려져 있습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">뭘 하면 되나 — 효과가 확인된 것부터</h2>
          <p className="leading-relaxed text-gray-700 mb-3">
            <strong>고부하 근력 운동.</strong> 48명을 무작위 배정한 연구에서, 깔창 + 매일 스트레칭을 한 그룹보다
            깔창 + <strong>이틀에 한 번 고부하 근력 운동</strong>을 한 그룹이 3개월 시점 발 기능 지수(FFI)가 29점 더 좋았습니다.
            방법은 단순합니다 — <strong>발가락 밑에 수건을 말아 넣고 한 발로 뒤꿈치 들기</strong>를 천천히 반복합니다.
            다만 12개월 시점에는 두 그룹 차이가 사라졌습니다. 즉 <strong>회복을 앞당기지만 최종 결과를 바꾸지는 않았습니다.</strong>
          </p>
          <p className="leading-relaxed text-gray-700 mb-3">
            <strong>스트레칭.</strong> 족저근막 전용 스트레칭과 종아리(비복근·가자미근) 스트레칭은 임상진료지침에서
            단기·장기 통증 감소와 기능 개선에 권고됩니다.
          </p>
          <p className="leading-relaxed text-gray-700">
            <strong>계속 뛰어도 되나?</strong> 완전히 쉬는 것보다 통증이 견딜 만한 범위로 <strong>부하를 줄여 유지</strong>하는 쪽이
            일반적으로 권장됩니다. 다만 &ldquo;족저근막염에 좋은 신발&rdquo;에 대해서는 정직하게 말하겠습니다 —
            특정 드롭이나 쿠셔닝이 족저근막 통증을 낫게 한다는 <strong>좋은 근거는 없습니다.</strong>
            편한 신발이 도움이 될 수는 있지만, 그건 치료가 아니라 통증 관리입니다.
          </p>
        </section>

        <section className="mb-8 p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
          <h2 className="text-base font-bold text-emerald-900 mb-2">기대치 — 이게 가장 중요합니다</h2>
          <p className="text-sm text-emerald-900 leading-relaxed">
            족저근막 통증은 <strong>대부분 좋아지지만 오래 걸립니다.</strong> 수개월 단위이고, 1년이 지나도 증상이 남는 사람이
            적지 않습니다. 2주 해보고 &ldquo;효과 없다&rdquo;며 다른 치료로 갈아타는 것이 가장 흔한 실수입니다.
            어떤 치료든 <strong>최소 3개월</strong>은 꾸준히 해보고 판단하세요.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://doi.org/10.1111/sms.12313" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Rathleff et al. (2015) Scand J Med Sci Sports 25(3):e292-300 — 고부하 근력 운동 RCT, 12개월 추적 ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://www.jospt.org/doi/10.2519/jospt.2023.0303" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Koc et al. (2023) JOSPT 임상진료지침 — Heel Pain / Plantar Fasciitis: Revision 2023 ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://pubmed.ncbi.nlm.nih.gov/12728038/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Riddle et al. (2003) JBJS 85(5):872-77 — 위험 요인 환자-대조군 연구 ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0099877" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Nielsen et al. (2014) PLOS ONE — 초보 러너 부상 분포, 족저근막염 5% ↗
              </a>
            </li>
          </ul>
          <p className="mt-3 text-xs text-gray-400">추천 순서는 광고비로 바뀌지 않습니다. 공개된 연구 자료를 근거로 작성했습니다.</p>
        </section>

        <YoutubeSection links={[
          // 2026-08-31: 검색 URL을 실제 영상으로 교체.
          // channel은 일부러 비워둔다 — 실제 업로더를 확인하지 않았고,
          // 짐작으로 채우는 것이 이 저장소에서 40건 오류를 만든 원인이다.
          // npm run check:youtube 가 확인해준 이름으로 채울 것.
          { label: "발뒤꿈치 통증 대표 질환 족저근막염 — 환자 맞춤 자가 운동법", channel: "세림병원", url: "https://www.youtube.com/watch?v=-y9BZ3qE1vE" },
          { label: "족저근막염 재활 운동", channel: "헬스조선 Health Chosun", url: "https://www.youtube.com/watch?v=sQ1IdjdZkxk" },
        ]} />

        <FaqSection items={[
          {
            q: "아침 첫발이 아픈데 족저근막염인가요?",
            a: "아침에 일어나 딛는 첫 몇 걸음이 가장 아프고, 걷다 보면 나아졌다가 오래 서 있거나 많이 걸으면 다시 아파지는 패턴이 족저근막 통증의 전형입니다. 다만 양쪽이 동시에 아프거나, 저린 느낌이 있거나, 쉬어도 계속 아프거나, 뒤꿈치를 양옆에서 눌렀을 때 아프면 다른 원인일 수 있으니 병원에서 확인하세요.",
          },
          {
            q: "스트레칭과 근력 운동 중 뭐가 더 효과적인가요?",
            a: "48명 무작위 배정 연구(Rathleff 2015)에서 이틀에 한 번 고부하 근력 운동을 한 그룹이 매일 스트레칭한 그룹보다 3개월 시점 발 기능 지수가 29점 더 좋았습니다. 방법은 발가락 밑에 수건을 말아 넣고 한 발로 뒤꿈치를 천천히 드는 것입니다. 다만 12개월 시점에는 차이가 사라졌으므로, 회복을 앞당기지만 최종 결과를 바꾸지는 않는다고 보는 편이 정확합니다.",
          },
          {
            q: "족저근막염에 좋은 러닝화가 따로 있나요?",
            a: "특정 드롭이나 쿠셔닝이 족저근막 통증을 낫게 한다는 좋은 근거는 없습니다. 편한 신발이 통증 관리에 도움이 될 수는 있지만 치료는 아닙니다. '족저근막염 전용'을 내세우는 제품 광고는 근거보다 앞서 나간 주장으로 보는 편이 안전합니다.",
          },
          {
            q: "얼마나 지나야 낫나요?",
            a: "대부분 좋아지지만 수개월 단위로 오래 걸리고, 1년이 지나도 증상이 남는 사람이 적지 않습니다. 2주 해보고 효과 없다며 다른 치료로 갈아타는 것이 가장 흔한 실수입니다. 어떤 치료든 최소 3개월은 꾸준히 해보고 판단하세요.",
          },
        ]} />

        <p className="text-xs text-gray-400 mb-4">
          ※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 작성자는 의료인이 아닙니다. 통증이 지속되면 전문의 상담을 권장합니다.
        </p>

        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl">
          <p className="font-medium text-emerald-900 mb-2">내 발에 맞는 러닝화를 찾으세요</p>
          <Link href="/shoe-finder" className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            내 러닝화 찾기 →
          </Link>
        </div>
        {/* 2026-09-06: 글 안에서 바로 묻게 한다. 클릭 한 번이 이탈을 만든다. */}
        <InlineAsk from="plantar-fasciitis" tag="족저근막" placeholder="예) 아침 첫발이 아픈 게 두 달째인데 병원 가야 할까요?" />

        <ShareButtons from="plantar-fasciitis" title="족저근막염 — 아침 첫발이 아픈 이유" description="효과가 확인된 방법과 신발로는 낫지 않는 이유." />

      </article>
    </>
  );
}
