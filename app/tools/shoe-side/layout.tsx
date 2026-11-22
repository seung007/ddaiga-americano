import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "러닝화 두께 비교 — 뒤꿈치·앞꿈치 두께를 같은 축척으로 | 뛰다가 아메리카노",
  description:
    "러닝화 최대 3개를 골라 밑창 두께와 앞뒤 굽 차이, 무게를 같은 축척으로 겹쳐 봐요. 공개된 실측 스펙만 쓰고, 착용감처럼 숫자로 공개되지 않는 것은 그리지 않아요.",
  alternates: { canonical: "/tools/shoe-side" },
};

export default function ShoeSideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
