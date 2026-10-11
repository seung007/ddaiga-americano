import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "러닝화 두께 비교 — 뒤꿈치·앞꿈치·드롭을 같은 축척으로 | 뛰다가 아메리카노",
  description:
    "러닝화 최대 3개를 골라 미드솔 두께와 드롭, 무게를 같은 축척으로 겹쳐 봅니다. RunRepeat 에 공개된 스펙만 쓰고, 착용감처럼 숫자로 공개되지 않는 것은 그리지 않습니다.",
  alternates: { canonical: "/tools/shoe-side" },
};

export default function ShoeSideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
