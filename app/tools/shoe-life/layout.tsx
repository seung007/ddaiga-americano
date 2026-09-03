import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "러닝화 수명 계산기 — 언제 바꿔야 하나 | 뛰다가 아메리카노",
  description:
    "주당 거리를 넣으면 누적 km와 쿠셔닝이 줄어드는 시점을 계산합니다. 480km에서 뒤꿈치 쿠셔닝이 16~33% 줄어드는데, 640km까지 달린 러너 중 누구도 그 변화를 느끼지 못했습니다(Cornwall & McPoil 2017).",
};

export default function ShoeLifeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
