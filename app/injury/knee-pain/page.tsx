import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "러너 무릎(슬개대퇴 증후군) 예방법 — 뛰다가 아메리카노",
  description: "무릎 앞쪽이 계단 오를 때 아프다면? 슬개대퇴 증후군의 원인과 예방 운동을 알아봅니다.",
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
          <span className="inline-block text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full mb-3">무릎</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">러너 무릎(슬개대퇴 증후군) 예방법</h1>
          <p className="text-gray-500 text-sm mb-4">5분 읽기</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            광고·협찬 없음 — 공개 연구 및 의학 자료 기반
          </div>
        </header>
        <p className="text-lg leading-relaxed mb-8 text-gray-700">달리기를 시작한 지 한두 달, 계단을 내려가거나 오래 앉아 있다가 일어날 때 무릎 앞쪽이 뻐근하게 아프다면 슬개대퇴 증후군(Patellofemoral Pain Syndrome)을 의심해야 합니다. 러너 무릎이라고도 불리며, 장경인대염과 함께 초보 러너에게 가장 흔한 부상입니다.</p>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">원인</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">슬개골(무릎 앞 뼈)이 대퇴골 위에서 정렬이 어긋날 때 통증이 생깁니다. 초보 러너에게 많은 이유는 세 가지입니다: ① 약한 고관절 외전근 — 무릎이 안쪽으로 쏠림 ② 갑작스러운 거리 증가 ③ 딱딱한 신발 또는 마모된 쿠션</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">예방 운동 3가지</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">1. 클램셸: 옆으로 누워 무릎을 굽힌 채 위쪽 다리를 조개껍데기처럼 벌립니다. 15회×3세트.
2. 스텝다운: 계단 끝에 서서 한쪽 다리로 천천히 내려옵니다. 무릎이 발가락 방향을 유지하도록. 10회×3세트.
3. 폼롤러 대퇴사두근 이완: 엎드려 허벅지 앞쪽을 2~3분 롤링.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">신발과의 관계</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">쿠셔닝이 2 이하인 신발은 착지 시 슬개골에 충격을 직접 전달합니다. 또한 과회내(평발)가 있다면 안정화를 선택해야 무릎 정렬이 개선됩니다.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://pubmed.ncbi.nlm.nih.gov/24229736/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Patellofemoral Pain — BMJ Clinical Evidence ↗</a></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://bjsm.bmj.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">BJSM — Patellofemoral syndrome review 2016 ↗</a></li>

          </ul>
          <p className="mt-3 text-xs text-gray-400">광고·협찬 없이 공적 연구 자료와 러너의 이익을 위해 작성되었습니다.</p>
        </section>

        <YoutubeSection links={[
          { label: "무릎 앞 통증 한방에 해결! 슬개대퇴통증증후군 마사지·운동법", channel: "재활운동TV", url: "https://www.youtube.com/watch?v=69TZ8_yYDp4" },
          { label: "무릎통증 러너 필수 시청 — 이것만 풀어도 사라집니다", channel: "건강TV", url: "https://www.youtube.com/watch?v=kCYjn49dJm0" },
          { label: "무릎 통증 세 가지만 기억하라! (명지병원 정형외과)", channel: "명지병원 TV", url: "https://www.youtube.com/watch?v=bKcjVC3jus0" },
          { label: "무릎 부상 후 재활 운동 5단계", channel: "재활TV", url: "https://www.youtube.com/shorts/Ixvh9w5uEYs" },
        ]} />

        <FaqSection items={[
          {
            q: "계단을 내려갈 때 무릎 앞쪽이 아픈 건 무슨 부상인가요?",
            a: "계단을 내려가거나 오래 앉았다 일어날 때 무릎 앞쪽이 뻐근하다면 슬개대퇴 증후군(러너 무릎)을 의심해야 합니다. 슬개골이 대퇴골 위에서 정렬이 어긋날 때 통증이 생기며, 장경인대염과 함께 초보 러너에게 가장 흔한 부상입니다.",
          },
          {
            q: "러너 무릎을 예방하는 운동은 뭐가 있나요?",
            a: "세 가지가 효과적입니다. ① 클램셸 — 옆으로 누워 위쪽 다리를 벌리기, 15회×3세트 ② 스텝다운 — 계단 끝에서 한 다리로 천천히 내려오기, 10회×3세트 ③ 폼롤러로 허벅지 앞쪽 2~3분 이완. 약한 고관절 외전근이 주요 원인이라 이를 강화하는 운동이 핵심입니다.",
          },
          {
            q: "신발이 무릎 통증에 영향을 주나요?",
            a: "네. 쿠셔닝이 약한 신발(5단계 중 2 이하)은 착지 충격을 슬개골에 직접 전달합니다. 평발로 발이 안쪽으로 쏠리는 과회내가 있다면 안정화 신발을 선택해야 무릎 정렬이 개선됩니다.",
          },
        ]} />

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
