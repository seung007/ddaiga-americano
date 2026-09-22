import CommunityBoard from "@/components/CommunityBoard";
import { reactionNames } from "@/lib/reaction-names";

/**
 * 2026-09-23: 클라이언트 페이지였던 본문을 `components/CommunityBoard.tsx` 로 옮김.
 * 「신발 후기」「대회 후기」 탭이 신발·대회 이름을 써야 하는데, 이름표(`lib/shoes/data.ts`)를
 * 클라이언트에서 import 하면 번들이 커짐 → 서버가 이름만 넘기려고 이 껍데기를 둠.
 */
export default function CommunityPage() {
  return <CommunityBoard names={reactionNames()} />;
}
