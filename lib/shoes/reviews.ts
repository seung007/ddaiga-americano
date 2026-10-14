/**
 * 신발별 외부 후기 모음 — 블로그·유튜브·커뮤니티 (2026-10-14)
 *
 * 왜 만들었나
 *   자체 반응(`ShoeReactions`)은 월 방문 100명대·로그인 없음이라 모이지 않는다.
 *   마라톤온라인 용품후기 게시판도 2년에 18건이었다(9/23 실측). 그래서 **이미 쓰인 후기**를 모아 보여준다.
 *
 * 저작권 — 지키는 선 (법률 자문 아님. 저작권법 §28 인용·§37 출처 명시 기준)
 *   · 제목·링크·작성자·날짜 = 복제가 아니다
 *   · `facts` = **우리가 쓴 한 줄 사실 요약**이다. 원문 문장을 베끼지 않는다. 사진은 절대 가져오지 않는다
 *   · 본문 통째 복사·요약으로 원문을 대체하는 것은 하지 않는다 — 읽으러 가게 만드는 것이 목적이다
 *
 * 신뢰 — 지키는 선 (AGENTS.md 「신뢰」)
 *   · **고르지 않는다.** `rule` 에 적은 기계적 기준(예: 「네이버 '○○ 후기' 검색 상위 10건 전부」)으로 모은 것을 전부 넣는다.
 *     좋은 후기만 남기면 이 사이트가 광고가 된다
 *   · `facts` 는 사실 진술만: 「반 사이즈 업」「발볼 좁게 느껴짐」「300km 에 아웃솔 마모」. 「좋다」「최고」 같은 평가어 금지
 *   · 「이 사이트 방문자 반응」(ShoeReactions) 과 **다른 블록**에 둔다. 섞으면 어느 쪽이 몇 건인지 흐려진다
 *   · **직접 신었다고 쓴 글만.** 「사용자 후기를 바탕으로 정리」처럼 남의 후기를 옮긴 글은 신어본 사람이 아니다
   · 사이트 신발과 성별 모델이 다르면 facts 첫 줄에 밝힌다(「여성용 모델」). 사이즈 숫자는 그대로 옮겨지지 않는다
   · 안 모았으면 블록을 아예 안 그린다. 「0건」이라고 쓰지 않는다 — 안 모은 것과 없는 것은 다르다
 *
 * 검사: scripts/check-reviews.mjs (형식·신발 id·평가어) · --live 로 링크 생존 (주간 CI)
 */
import raw from "./reviews.json";

export type ReviewSource = "blog" | "youtube" | "community";
export type ReviewItem = {
  source: ReviewSource;
  title: string;
  url: string;
  author: string;      // 블로그 닉네임·채널명 그대로. 실명·연락처 금지
  date: string;        // YYYY-MM-DD, 후기 발행일
  facts: string[];     // 우리가 쓴 사실 한 줄들 (평가어 없이)
  /**
   * 상업성 — 본문에서 **보이는 그대로**만 적는다. 「광고다」라고 판정하지 않는다.
   * 예: 「쇼핑 커넥트 수수료 고지」 「본문에 쇼핑 링크 포함」. 없으면 생략.
   * 2026-10-14 첫 수집: 쿠물러스 27 상위 10건 중 2건이 수수료 고지, 1건이 고지 없이 쇼핑 링크
   */
  commercial?: string;
};
export type ShoeReviews = {
  collectedAt: string; // YYYY-MM-DD
  rule: string;        // 어떻게 모았나 — 화면에 그대로 보인다
  items: ReviewItem[];
};

const DATA = raw as Record<string, ShoeReviews>;

export function reviewsFor(shoeId: string): ShoeReviews | null {
  const r = DATA[shoeId];
  return r && r.items.length ? r : null;
}

export const SOURCE_LABEL: Record<ReviewSource, string> = {
  blog: "블로그",
  youtube: "유튜브",
  community: "커뮤니티",
};
