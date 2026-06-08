import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "러닝화 추천기 — 뛰다가 아메리카노",
  description: "키·체중·성별·발볼·발 타입을 선택하면 스포츠의학 논문 기반으로 내 몸에 맞는 러닝화를 추천해드립니다. 광고·협찬 없이 데이터로만.",
};

export default function ShoeFinderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
