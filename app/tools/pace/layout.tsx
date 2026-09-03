import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "러닝 페이스 계산기 — 5K·10K·하프·풀 구간 통과 시간 | 뛰다가 아메리카노",
  description:
    "목표 시간을 넣으면 km당 페이스를, 페이스를 넣으면 완주 시간을 계산합니다. 5km 단위 구간 통과 시간표까지 만들어 대회 당일 손목에 적어갈 수 있습니다.",
};

export default function PaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
