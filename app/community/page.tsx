import CommunityBoard from "@/components/CommunityBoard";
import { reactionNames } from "@/lib/reaction-names";
import type { Metadata } from "next";

// 2026-10-12 SEO 점검: 홈과 같은 제목(layout 기본값)으로 나가고 canonical 도 없었다
export const metadata: Metadata = {
  title: "러닝 게시판 — 이야기·신발 후기·대회 후기 | 뛰다가 아메리카노",
  description: "러너들이 남긴 질문과 이야기, 신발·대회 상세에서 남긴 한 줄 후기를 한곳에 모았습니다.",
  alternates: { canonical: "/community" },
};

/**
 * 2026-09-23: 클라이언트 페이지였던 본문을 `components/CommunityBoard.tsx` 로 옮김.
 * 「신발 후기」「대회 후기」 탭이 신발·대회 이름을 써야 하는데, 이름표(`lib/shoes/data.ts`)를
 * 클라이언트에서 import 하면 번들이 커짐 → 서버가 이름만 넘기려고 이 껍데기를 둠.
 */
export default function CommunityPage() {
  return <CommunityBoard names={reactionNames()} />;
}
