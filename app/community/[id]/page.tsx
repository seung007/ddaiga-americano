import type { Metadata } from "next";
import CommunityPostView from "@/components/CommunityPostView";

/**
 * 게시판 글 하나 = 주소 하나 (2026-09-23)
 *
 * 전에는 `/community` 한 페이지에서 펼쳐 봤기 때문에 **특정 글로 링크할 방법이 없었음.**
 * 카페 홍보·카톡 공유 때 "이 글 봐주세요"가 불가능했음.
 * 마라톤온라인은 글 상세 아래에 목록을 그대로 깔아 다음 글로 이어 읽게 함 → 같은 구조.
 *
 * 데이터는 클라이언트에서 읽음(CommunityPostView). 서버에서 읽으면 Supabase 가 정지됐을 때
 * 페이지 자체가 500 이 됨 — 2026-08 사건 이후 백엔드 고장이 화면 전체를 죽이지 않게 함.
 * 대가: 글 본문이 검색 색인에 안 잡힘. 그래서 noindex (빈 껍데기가 색인되면 품질 신호만 나빠짐).
 */
export const metadata: Metadata = {
  title: "게시판 글 | 뛰다가 아메리카노",
  robots: { index: false, follow: true },
};

export default async function CommunityPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CommunityPostView id={id} />;
}
