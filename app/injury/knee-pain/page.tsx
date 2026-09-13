import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import InlineAsk from "@/components/InlineAsk";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ShareButtons from "@/components/ShareButtons";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import type { Metadata } from "next";

const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/knee-pain";

export const metadata: Metadata = {
  title: "러너 무릎(슬개대퇴 증후군) 예방법 — 뛰다가 아메리카노",
  description: "무릎 앞쪽이 계단 오를 때 아프다면? 슬개대퇴 증후군의 원인과 예방 운동을 알아봅니다.",
};

export default function Page() {
  return (
    <>
      <ArticleJsonLd
        headline="러너 무릎(슬개대퇴 증후군) 예방법"
        description="무릎 앞쪽이 계단 오를 때 아프다면? 슬개대퇴 증후군의 원인과 예방 운동을 알아봅니다."
        url={PAGE_URL}
        datePublished="2025-03-01"
      />
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 러닝 가이드
        </Link>
        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full mb-3">무릎</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">러너 무릎(슬개대퇴 증후군) 예방법</h1>
          {/* 2026-09-14: 「5분」인데 본문이 383자였다. 위치별 분기·감별 신호를 넣어 1,472자.
              분당 500자로 3분. */}
          <p className="text-gray-500 text-sm mb-4">3분 읽기</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            협찬 없이 작성 — 공개 연구 및 의학 자료 기반
          </div>
        </header>
        {/**
         * 위치별 분기 (2026-09-14 추가)
         *
         * 실측으로 드러난 어긋남: 이 페이지로 들어오는 검색어가
         * **「러닝 후 무릎 옆 통증」(39노출)** 인데, 페이지는 전부
         * **무릎 앞쪽(슬개대퇴 증후군)** 얘기다. 「무릎 옆」은 장경인대염이고
         * `/injury/it-band` 에 따로 있다. **들어온 사람이 틀린 답을 받고 있었다.**
         *
         * 그래서 맨 위에서 위치로 가른다. 진단을 하는 게 아니라 **길을 알려준다** —
         * 세 칸 모두 이 저장소에 이미 인용과 함께 존재하는 페이지로 보낸다.
         *
         * 감별 신호도 같이 넣는다. 전수 조사 결과 이 페이지에는 「병원에 가세요」
         * 한 줄(※)은 있었지만 **「이럴 땐 위험하다」가 없었다** — 22개 중 6개에만 있었다.
         * 문구는 `it-band`·`shin-splints`·`achilles` 가 이미 쓰는 기준을 따랐다.
         * 새 진단명은 쓰지 않았다.
         */}
        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">먼저 — 무릎 어디가 아프신가요?</p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-900">
            같은 &ldquo;무릎 통증&rdquo;이어도 아픈 자리에 따라 완전히 다른 문제입니다.
          </p>
          <div className="mt-3 space-y-2">
            <div className="rounded-xl border border-emerald-200 bg-white p-3">
              <p className="text-sm font-semibold text-gray-900">무릎 앞쪽 · 슬개골 주변</p>
              <p className="mt-0.5 text-sm text-gray-600">
                계단 내려갈 때, 오래 앉았다 일어날 때 아픔 → <strong>이 글이 맞습니다.</strong> 아래로 읽으세요.
              </p>
            </div>
            <Link
              href="/injury/it-band"
              className="block rounded-xl border border-emerald-200 bg-white p-3 transition-colors hover:border-emerald-400"
            >
              <p className="text-sm font-semibold text-gray-900">무릎 바깥쪽 (옆) →</p>
              <p className="mt-0.5 text-sm text-gray-600">
                일정 거리를 지나면 옆이 아프고, 멈추면 괜찮아짐 → 장경인대염 글로
              </p>
            </Link>
            <Link
              href="/injury/shin-splints"
              className="block rounded-xl border border-emerald-200 bg-white p-3 transition-colors hover:border-emerald-400"
            >
              <p className="text-sm font-semibold text-gray-900">무릎 아래 · 정강이 안쪽 →</p>
              <p className="mt-0.5 text-sm text-gray-600">
                뼈를 따라 길게 아픔 → 정강이 통증 글로
              </p>
            </Link>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-semibold text-red-900">달리기를 멈추고 병원에 가야 할 때</p>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-red-900">
            <li>· 달리지 않을 때도, 걸을 때도 아프다</li>
            <li>· 무릎이 <strong>붓거나 열감</strong>이 있다</li>
            <li>· 무릎에 <strong>힘이 갑자기 빠지거나</strong> 걸리는 느낌이 든다</li>
            <li>· 쉬었는데도 <strong>2주 넘게</strong> 그대로다</li>
          </ul>
          <p className="mt-2 text-xs leading-relaxed text-red-800">
            아래 예방 운동은 이런 신호가 <strong>없을 때</strong> 하는 것입니다. 자가진단하지 마세요.
          </p>
        </div>

        <p className="text-lg leading-relaxed mb-8 text-gray-700">달리기를 시작한 지 한두 달, 계단을 내려가거나 오래 앉아 있다가 일어날 때 무릎 앞쪽이 뻐근하게 아프다면 슬개대퇴 증후군(Patellofemoral Pain Syndrome)을 의심해야 합니다. 러너 무릎이라고도 불리며, 장경인대염과 함께 초보 러너에게 가장 흔한 부상입니다.</p>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">원인</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">슬개골(무릎 앞 뼈)이 대퇴골 위에서 정렬이 어긋날 때 통증이 생깁니다. 초보 러너에게 많은 이유는 세 가지입니다: ① 약한 고관절 외전근 — 무릎이 안쪽으로 쏠림 ② 갑작스러운 거리 증가 ③ 딱딱한 신발 또는 마모된 쿠션</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">예방 운동 3가지</h2>
          {/* 2026-09-14: 한 문단에 뭉쳐 있던 걸 카드로. 문구는 그대로 두고 형태만 바꿨다.
              폰을 보면서 따라 하는 사람이 지금 몇 번째인지 찾을 수 있어야 한다. */}
          <div className="space-y-3">
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-gray-400">1</span>
                <h3 className="font-bold text-gray-900">클램셸</h3>
                <span className="ml-auto text-sm font-semibold text-emerald-700">15회 × 3세트</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                옆으로 누워 무릎을 굽힌 채 위쪽 다리를 조개껍데기처럼 벌립니다.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-gray-400">2</span>
                <h3 className="font-bold text-gray-900">스텝다운</h3>
                <span className="ml-auto text-sm font-semibold text-emerald-700">10회 × 3세트</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                계단 끝에 서서 한쪽 다리로 천천히 내려옵니다.{" "}
                <strong>무릎이 발가락 방향을 유지하도록</strong> 하세요 — 안쪽으로 쏠리면 의미가 없습니다.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-gray-400">3</span>
                <h3 className="font-bold text-gray-900">폼롤러 대퇴사두근 이완</h3>
                <span className="ml-auto text-sm font-semibold text-emerald-700">2~3분</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                엎드려 허벅지 앞쪽을 롤링합니다.
              </p>
            </div>
          </div>
          {/* ⚠️ 2026-09-14 — "1번(클램셸)이 가장 중요합니다" 라고 적었다가 고쳤다.
              이 페이지가 인용한 Collins 2018 국제 합의문은 정확히 반대로
              **"고관절 운동과 무릎 운동을 함께"** 하는 쪽을 권고한다.
              내가 순위를 만들어 인용을 넘어섰다. */}
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            <strong>셋을 같이 하세요.</strong> 아래 인용한 국제 합의문(Collins 2018)은
            고관절 운동과 무릎 운동을 <strong>함께</strong> 하는 쪽을 권고합니다 — 하나만
            골라서 하는 것보다 낫다고 봤습니다.
          </p>
        </section>

        <FinderCta from="knee-pain" variant="inline" headline="체중 대비 쿠션이 부족하면 무릎이 먼저 받습니다. 지금 신발이 맞는지 확인해보세요." />
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">신발과의 관계</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">쿠셔닝이 2 이하인 신발은 착지 시 슬개골에 충격을 직접 전달합니다. 또한 과회내(평발)가 있다면 안정화를 선택해야 무릎 정렬이 개선됩니다.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-gray-400">•</span><span className="text-gray-500">슬개대퇴 통증 자료 — 검증기가 무관한 논문을 가리키는 것을 확인해 링크를 내렸습니다 (2026-08-31)</span></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://pubmed.ncbi.nlm.nih.gov/29925502/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Collins et al. (2018) BJSM 52(18):1170-1178 — 슬개대퇴 통증 운동치료 국제 합의문. 고관절·무릎 운동을 함께 하는 쪽을 권고 ↗
              </a>
            </li>

          </ul>
          <p className="mt-3 text-xs text-gray-400">추천 순서는 광고비로 바뀌지 않습니다. 공개된 연구 자료를 근거로 작성했습니다.</p>
        </section>

        <YoutubeSection links={[
          { label: "무릎 앞 통증 한방에 해결! 슬개대퇴통증증후군 마사지·운동법", channel: "알쓸물치", url: "https://www.youtube.com/watch?v=69TZ8_yYDp4" },
          { label: "무릎통증 러너 필수 시청 — 이것만 풀어도 사라집니다", channel: "통증요정 김학조", url: "https://www.youtube.com/watch?v=kCYjn49dJm0" },
          { label: "무릎 통증 세 가지만 기억하라! (명지병원 정형외과)", channel: "명지병원-MYONGJI HOSPITAL", url: "https://www.youtube.com/watch?v=bKcjVC3jus0" },
          { label: "무릎 부상 후 재활 운동 5단계", channel: "피지오스튜디오 PHYSIOSTUDIO", url: "https://www.youtube.com/shorts/Ixvh9w5uEYs" },
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

        <p className="text-xs text-gray-400 mb-4">※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 통증이 지속되면 전문의 상담을 권장합니다.</p>

        {/* 2026-09-06: 글 안에서 바로 묻게 한다.
            /community 로 보내면 클릭 한 번이 필요하고, 그 한 번에서 대부분을 잃는다 —
            두 달간 질문 0건이 그 증거다. */}
        <InlineAsk from="knee-pain" tag="무릎" placeholder="예) 계단 내려갈 때만 무릎 앞이 아픈데 신발 문제일까요?" />

        <FinderCta from="knee-pain" headline="무릎에 부담이 덜한 신발 찾기" sub="체중과 부상 이력을 넣으면 쿠션이 충분한 신발을 우선 추천합니다." />
        <ShareButtons from="knee-pain" title="러너 무릎 예방법" description="무릎 앞쪽이 아플 때 확인할 것들을 논문 근거로 정리했습니다." />

      </article>
    </>
  );
}
