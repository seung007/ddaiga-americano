import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "러닝 계산기 — 뛰다가 아메리카노",
  description: "러닝화 수명, 교체 시기 등을 논문 근거로 계산합니다. 근거가 없는 항목은 계산하지 않고 없다고 적습니다.",
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
    desc: "480km에서 뒤꿈치 쿠셔닝이 16~33% 줄어드는데, 640km까지 달린 러너 중 누구도 그걸 느끼지 못했습니다. 감으로는 안 잡히니 세어봅니다.",
    basis: "Cornwall & McPoil 2017",
  },
  {
    href: "/tools/pace",
    title: "러닝 페이스 계산기",
    desc: "목표 시간 ↔ km당 페이스를 양방향으로 계산하고, 5km 단위 구간 통과 시간표를 만듭니다. 대회 당일 손목에 적어갈 수 있게.",
    basis: "순수 산수 — 논문 근거 불필요",
  },
];

export default function ToolsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">러닝 계산기</h1>
      <p className="text-gray-600 mb-8 leading-relaxed">
        논문에서 실제로 측정한 수치만 씁니다. 근거가 없는 항목은{" "}
        <strong className="text-gray-900">그럴듯한 계수를 지어내는 대신 없다고 적습니다.</strong>
      </p>

      <div className="space-y-4">
        {TOOLS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="block rounded-2xl border border-gray-200 p-6 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
          >
            <h2 className="mb-2 text-lg font-semibold text-gray-900">{t.title}</h2>
            <p className="mb-3 text-sm leading-relaxed text-gray-600">{t.desc}</p>
            {/* 논문 근거와 단순 산수를 같은 배지로 쓰면 안 된다.
                파란 배지는 "논문에서 옮긴 수치"라는 뜻으로 사이트 전체에서 쓰이고 있어서,
                나눗셈 결과에 그걸 달면 근거를 부풀리는 셈이 된다. */}
            <span
              className={`rounded-md px-2 py-1 text-xs font-medium ${
                t.basis.includes("산수")
                  ? "bg-gray-100 text-gray-600"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              {t.basis}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
