import type { StageId } from "./stages";

/**
 * 러닝 가이드 글 목록 — 허브(`app/injury/page.tsx`)가 쓴다.
 *
 * 2026-10-06: 허브가 서버 컴포넌트가 되면서(메타데이터가 아예 없었다) 목록을 여기로 옮겼다.
 * `level`(초심자/중급자/숙련자) 대신 `stages` — 이 글이 **어느 단계를 넘는 사람에게** 쓸모 있는지.
 *   · `"all"` 은 단계와 무관한 글(발볼·평발·휴식)
 *   · `[]` 는 단계 필터에 걸리지 않는 읽을거리(선수 이야기) — 「전체」와 주제 칩으로만 보인다
 *
 * 읽기시간 규약 (2026-09-22 도입)
 *
 * ⚠️ **손으로 적던 값이 서로 모순이었다.** 배포본에서 페이지별 본문 글자 수를 실측하니
 *   `hwang-young-jo` 1,363자 → **6분**
 *   `midfoot`        2,109자 → **3분**
 * 절반 길이의 글이 두 배의 시간을 주장하고 있었다. 둘 다 맞을 수는 없다.
 *
 * 그래서 규약을 하나 정한다 — **본문 글자 수 ÷ 600, 올림, 최소 2분.**
 * 600 은 **측정값이 아니라 우리가 고른 값**이다. 한국어 묵독 속도를 우리가 잰 적이 없다.
 *
 * 글자 수는 `<article>` 의 텍스트에서 공백과 인라인 스크립트를 뺀 값이다(FAQ·인용 포함).
 * 2026-09-22 실측 (자수 → 분):
 *   posture 1346→3 · hwang-young-jo 1363→3 · kwon-eun-ju 1463→3 · rest-day 1664→3
 *   warmup 1745→3 · it-band 1779→3 · cadence 1868→4 · knee-pain 2028→4 · cooldown 2060→4
 *   midfoot 2109→4 · carbon-plate 2248→4 · shin-splints 2198→4
 *   plantar-fasciitis 2468→5 · flat-feet 2480→5 · wide-foot 2579→5
 *   achilles 2742→5 · first-10k 2846→5 · half-marathon-race-day 7068→12
 * 2026-10-06 실측 (빌드 HTML 의 <article>):
 *   start-running 5176→9 · beginner-guide 3314→6 · intermediate-guide 2484→5 · advanced-guide 2505→5
 *   (같은 방법으로 잰 first-10k 2764·shin-splints 2197 이 9/22 값과 거의 같아 방법은 이어진다)
 *   return-to-running 4566→8 · it-band 4343→8(개편, 1779→3 에서) · half-marathon-training 4000→7
 * 2026-10-07 실측: marathon-training 4222→8 · get-faster 3691→7 · knee-pain 3637→7(개편) · plantar-fasciitis 3699→7(개편)
 *
 * **글을 늘렸으면 여기와 그 페이지 본문 둘 다 고칠 것.** 두 곳에 있어서 또 어긋난다.
 */
export type GuideArticle = {
  href: string;
  tag: string;
  tagColor: string;
  title: string;
  desc: string;
  readTime: string;
  stages: StageId[] | "all";
};

export const ARTICLES: GuideArticle[] = [
  // ── 단계 가이드 ─────────────────────────────────────
  { href: "/injury/start-running", tag: "단계 가이드", tagColor: "text-emerald-700 bg-emerald-50", title: "처음 달리기 — 30분 연속까지 막히는 곳과 대처", desc: "초보 프로그램 참가자 거의 3명 중 1명이 반년 안에 그만둡니다. 이유 1위는 부상. 속도·진도·긴 날·멈출 신호.", readTime: "9분", stages: ["start"] },
  { href: "/injury/beginner-guide", tag: "단계 가이드", tagColor: "text-emerald-700 bg-emerald-50", title: "초보 러너 뛰는 법", desc: "얼마나 자주·얼마나 늘려야 하는지, 초보에게 흔한 부상 3가지와 대처법.", readTime: "6분", stages: ["start", "to10k"] },
  { href: "/injury/half-marathon-training", tag: "단계 가이드", tagColor: "text-emerald-700 bg-emerald-50", title: "하프마라톤 준비 — 10km에서 21km로", desc: "하프 참가자 556명의 실제 준비량(주 26km·최장 18.5km)과, 주간 거리·긴 달리기를 늘리는 속도.", readTime: "7분", stages: ["to-half"] },
  { href: "/injury/marathon-training", tag: "단계 가이드", tagColor: "text-emerald-700 bg-emerald-50", title: "풀코스 준비 — 하프에서 42.195km로", desc: "풀 참가자 441명의 실제 준비량(주 40km·최장 32km), 준비 중 부상, 후반 붕괴, 테이퍼·보급.", readTime: "8분", stages: ["to-full"] },
  { href: "/injury/get-faster", tag: "단계 가이드", tagColor: "text-emerald-700 bg-emerald-50", title: "기록 단축 — 완주 다음에 막히는 곳", desc: "주간 거리·강도 배분·인터벌·근력·테이퍼가 실제로 얼마나 효과 있었는지, 기록 예측은 얼마나 믿을지.", readTime: "7분", stages: ["faster"] },
  { href: "/injury/intermediate-guide", tag: "단계 가이드", tagColor: "text-emerald-700 bg-emerald-50", title: "중급자 부상 예방 가이드", desc: "장경인대·아킬레스·족저근막, 그리고 오버트레이닝 징후.", readTime: "5분", stages: ["to-half"] },
  { href: "/injury/advanced-guide", tag: "단계 가이드", tagColor: "text-emerald-700 bg-emerald-50", title: "숙련자 부상 예방 가이드", desc: "피로골절·비기능적 오버리칭·주기화.", readTime: "5분", stages: ["to-full", "faster"] },

  // ── 나머지 (2026-09-22 순서 유지) ─────────────────────
  // 2026-10-06: 커뮤니티 부상 글 1위 부위라 전면 개편(3분 → 아래 실측). 복귀 글 신설.
  { href: "/injury/return-to-running", tag: "복귀", tagColor: "text-orange-600 bg-orange-50", title: "부상 후 다시 달리기 — 언제, 얼마나, 어떻게", desc: "회복 기간 중앙값 71일. 완전히 쉬어야 하는지, 통증 몇 점까지 괜찮은지, 어떻게 다시 늘리는지.", readTime: "8분", stages: "all" },
  { href: "/injury/it-band", tag: "무릎", tagColor: "text-red-600 bg-red-50", title: "장경인대 증후군 — 무릎 바깥 통증, 무엇이 효과 있나", desc: "마찰이 아니라 압박. 스트레칭보다 엉덩이 외전근 강화. 내리막을 피하는 이유까지.", readTime: "8분", stages: ["to-half", "to-full"] },
  { href: "/injury/wide-foot", tag: "발볼", tagColor: "text-blue-600 bg-blue-50", title: "2E·4E 와이드 뜻과 내 발볼 재는 법", desc: "2E·4E 규격이 필요한지 판단하는 방법과 브랜드별 옵션.", readTime: "5분", stages: "all" },
  // 2026-09-08 추가. 네이버 실측에서 '발 조건 + 브랜드' 질의가 33%인데 평발 페이지가 없었다.
  { href: "/injury/flat-feet", tag: "평발", tagColor: "text-blue-600 bg-blue-50", title: "평발 러닝화, 안정화화가 정답일까", desc: "발 타입으로 신발을 처방하는 관행에 근거가 있는지 논문으로 확인했습니다.", readTime: "5분", stages: "all" },
  // 2026-09-08 추가. 네이버 검색 의도 3위(카본화 20%).
  { href: "/injury/carbon-plate", tag: "카본화", tagColor: "text-purple-600 bg-purple-50", title: "카본화 살까 말까 — 논문이 시험한 속도", desc: "가장 많이 인용되는 연구는 4:17/km 이상에서만 측정했습니다. 실제 가격도 정리했습니다.", readTime: "4분", stages: ["to-full", "faster"] },
  { href: "/injury/achilles", tag: "아킬레스", tagColor: "text-orange-600 bg-orange-50", title: "달리기 아킬레스건·종아리 통증 스트레칭 3가지", desc: "달린 뒤 당기고 뻐근하다면. 원인과 무관하게 같은 3가지를 합니다.", readTime: "5분", stages: ["to-half", "to-full"] },
  { href: "/injury/shin-splints", tag: "정강이", tagColor: "text-red-600 bg-red-50", title: "정강이 통증(신스플린트) — 초보 부상 1위", desc: "초보 러너 부상의 15%로 가장 흔합니다. 피로골절과 구별하는 법부터.", readTime: "4분", stages: ["start", "to10k"] },
  { href: "/injury/plantar-fasciitis", tag: "족저근막", tagColor: "text-orange-600 bg-orange-50", title: "족저근막염 — 아침 첫발이 아픈 이유", desc: "3개월 시점 스트레칭보다 효과가 컸던 근력 운동, 주사의 실제 효과, 생각보다 긴 회복 기간.", readTime: "7분", stages: ["to10k", "to-half"] },
  { href: "/injury/knee-pain", tag: "무릎", tagColor: "text-red-600 bg-red-50", title: "러너 무릎(슬개대퇴 통증) — 무엇이 효과 있나", desc: "흔히 말하는 원인 상당수는 예측 요인이 아니었다. 부하 관리 교육만으로도 운동을 더한 것과 같은 회복.", readTime: "7분", stages: ["start", "to10k"] },
  { href: "/injury/warmup", tag: "준비운동", tagColor: "text-green-600 bg-green-50", title: "달리기 전 5분 동적 스트레칭 루틴", desc: "정적 스트레칭이 아닌 동적 워밍업이 필요한 이유.", readTime: "3분", stages: ["start", "to10k"] },
  { href: "/injury/cooldown", tag: "쿨다운", tagColor: "text-teal-600 bg-teal-50", title: "달리기 후 꼭 해야 할 10분 정적 스트레칭", desc: "종아리·햄스트링·엉덩이까지 풀어주는 쿨다운 루틴.", readTime: "4분", stages: ["start", "to10k"] },
  { href: "/injury/rest-day", tag: "회복", tagColor: "text-indigo-600 bg-indigo-50", title: "휴식일에 뭘 해야 할까? 액티브 리커버리", desc: "가볍게 움직이는 쪽이 낫다는 증거는 생각보다 약합니다.", readTime: "3분", stages: "all" },
  { href: "/injury/cadence", tag: "케이던스", tagColor: "text-purple-600 bg-purple-50", title: "케이던스 180은 거짓말? 키별 적정 기준값", desc: "\"180 spm이 정답\"이라는 획일적 조언, 왜 틀렸는지 설명합니다.", readTime: "4분", stages: ["to10k", "faster"] },
  { href: "/injury/midfoot", tag: "착지법", tagColor: "text-violet-600 bg-violet-50", title: "미드풋 착지란? 힐스트라이크와 차이", desc: "발 중간으로 닿는 방식입니다. 초보가 바꿔야 하는지까지.", readTime: "4분", stages: ["to10k"] },
  { href: "/injury/posture", tag: "자세", tagColor: "text-cyan-600 bg-cyan-50", title: "달리기 자세 체크리스트 — 어깨·팔·시선", desc: "상체 자세가 하체 부상에 영향을 준다는 사실, 알고 계셨나요?", readTime: "3분", stages: ["start", "to10k"] },
  { href: "/injury/hwang-young-jo", tag: "황영조", tagColor: "text-yellow-700 bg-yellow-50", title: "황영조의 달리기 철학 — 고통을 읽는 것", desc: "1992 바르셀로나 금메달리스트의 훈련 철학.", readTime: "3분", stages: [] },
  { href: "/injury/kwon-eun-ju", tag: "권은주", tagColor: "text-pink-600 bg-pink-50", title: "권은주 선수에게 배우는 여성 러너 부상 예방", desc: "한국 여자 마라톤을 이끌어온 권은주 선수의 훈련 방식.", readTime: "3분", stages: [] },
  { href: "/injury/first-10k", tag: "첫 대회", tagColor: "text-emerald-600 bg-emerald-50", title: "생애 첫 10km 대회 준비물과 페이스 전략", desc: "출발선에 서기 전에 알아야 할 것들.", readTime: "5분", stages: ["to10k"] },
  { href: "/injury/half-marathon-race-day", tag: "대회 실전", tagColor: "text-emerald-700 bg-emerald-50", title: "하프마라톤 대회 당일 체크리스트", desc: "젤·급수·바세린·페이스. 논문 근거와 직접 뛰어본 경험을 항목마다 구분해 적었습니다.", readTime: "12분", stages: ["to-half", "to-full"] },
];

/**
 * 주제 축 — 단계와 **다른 두 번째 축.** (2026-09-12 도입, 둘은 AND)
 * 이미 있는 `tag` 값에서 파생한다. 어느 주제에도 안 걸리는 태그는 「기타」로 — 숨기지 않는다.
 */
export const TOPICS = {
  "단계 가이드": ["단계 가이드"],
  "신발 고르기": ["발볼", "평발", "카본화"],
  "아픈 곳": ["무릎", "정강이", "족저근막", "아킬레스", "복귀"],
  "달리는 법": ["착지법", "케이던스", "자세", "준비운동", "쿨다운", "회복"],
  "대회": ["첫 대회", "대회 실전"],
  "선수 이야기": ["황영조", "권은주"],
} as const;

export type Topic = keyof typeof TOPICS | "전체" | "기타";

export function topicOf(tag: string): Exclude<Topic, "전체"> {
  for (const [name, tags] of Object.entries(TOPICS)) {
    if ((tags as readonly string[]).includes(tag)) return name as Exclude<Topic, "전체" | "기타">;
  }
  return "기타";
}
