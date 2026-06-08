import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 및 면책 고지 — 뛰다가 아메리카노",
  description: "뛰다가 아메리카노 이용약관, 면책 조항, 추천 알고리즘 논문 근거, 광고 없음 선언을 안내합니다.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
