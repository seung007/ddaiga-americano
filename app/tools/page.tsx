import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/tools" },
  title: "러닝 계산기 — 뛰다가 아메리카노",
  description: "러닝화 수명과 교체 시기를 논문이 잰 값으로 계산해요. 근거가 없는 항목은 계산하지 않고 없다고 적어요.",
};

/**
 * 도구 모음 — 2026-09-02 신설
 *
 * 계산기를 늘리는 이유: 각각이 별개의 검색 입구가 된다.
 * "러닝화 수명", "러닝화 교체 시기"는 사람들이 실제로 검색하는 말이고,
 * 우리 최대 누수 지점(콘텐츠→도구 19.5%)에 새 진입로를 내는 일이기도 하다.
 *
 * 새 계산기를 추가할 때 지킬 것: **근거 없는 계수를 넣어 정밀해 보이게 만들지 않는다.**
 * 모르는 항목은 "이 계산이 못 하는 것"에 적는다. 그게 여기 유일한 차별점이다.
 */

const TOOLS = [
  {
    href: "/tools/shoe-life",
    title: "러닝화 수명 계산기",
    desc: "480km에서 뒤꿈치 쿠셔닝이 16~33% 줄어드는데, 640km까지 달린 러너 중 누구도 그걸 느끼지 못했어요. 감으로는 안 잡히니 세어 봐요. 신발별 기록장도 있어요.",
  },
  {
    href: "/tools/shoe-side",
    title: "러닝화 두께 비교",
    desc: "최대 3개를 골라 뒤꿈치·앞꿈치 두께와 앞뒤 굽 차이, 무게를 같은 축척으로 겹쳐 봐요. 착용감처럼 숫자로 공개되지 않는 것은 그리지 않아요.",
  },
  {
    href: "/tools/pace",
    title: "러닝 페이스 계산기",
    desc: "목표 시간 ↔ km당 페이스를 양방향으로 계산하고, 5km 단위 구간 통과 시간표를 만들어요. 대회 당일 손목에 적어 갈 수 있어요.",
  },
  // 2026-10-13: 「처음 달리기」 글의 8단계 걷기-달리기 표를 따라 하는 플랜·타이머. 진도표는 저희 예시라 회색 배지.
  {
    href: "/tools/run-30",
    title: "30분 달리기 따라 하기",
    desc: "걷기와 달리기를 섞어 8단계 24회. 회차마다 할 순서와 총 시간, 음성 안내 타이머, 진행 저장, 완주 수료증까지. 3회마다 「대화가 됐나·다음 날 아침 아프지 않았나」를 묻고 넘어가요.",
  },
];

export default function ToolsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-[32px] md:text-[40px] font-bold leading-tight text-gray-900 mb-3">러닝 계산기</h1>
      <p className="text-gray-600 mb-8 leading-relaxed">
        논문에서 실제로 측정한 수치만 써요. 근거가 없는 항목은{" "}
        <strong className="text-gray-900">그럴듯한 계수를 지어내는 대신 없다고 적어요.</strong>
      </p>

      <div className="space-y-4">
        {TOOLS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="block rounded-2xl border border-gray-200 p-6 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
          >
            <h2 className="mb-2 text-xl font-semibold text-gray-900">{t.title}</h2>
            <p className="mb-3 text-sm leading-relaxed text-gray-600">{t.desc}</p>
            {/* 2026-11-23: 근거 배지(「Cornwall & McPoil 2017」「논문 근거 아님」「순수 산수」)를 뺐다 — 화면에는 딱지 없이(11-23 결정).
                수명 계산기의 출처는 그 도구 화면 「이 숫자는 어디서 왔나」에 링크로 있다. */}
          </Link>
        ))}
      </div>
    </main>
  );
}
