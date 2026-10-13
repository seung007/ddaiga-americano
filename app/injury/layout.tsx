import NextReads from "@/components/guide/NextReads";
import GuideSignals from "@/components/guide/GuideSignals";

/** 모든 /injury/* 글 끝에 같은 규칙의 「이어서 볼 것」을 붙인다 — components/guide/NextReads.tsx (2026-10-12) */
export default function InjuryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* 2026-10-13: 근거 열람 측정 + 「도움이 됐나요?」 — components/guide/GuideSignals.tsx */}
      <GuideSignals />
      <NextReads />
    </>
  );
}
