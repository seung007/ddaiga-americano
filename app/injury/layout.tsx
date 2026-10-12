import NextReads from "@/components/guide/NextReads";

/** 모든 /injury/* 글 끝에 같은 규칙의 「이어서 볼 것」을 붙인다 — components/guide/NextReads.tsx (2026-10-12) */
export default function InjuryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <NextReads />
    </>
  );
}
