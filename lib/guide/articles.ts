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
 * 2026-11-10: 손으로 쓴 가이드 27편의 제목·설명을 독자 질문형으로 바꿨다(심박 글 포함 28편 updated 2026-11-10).
 *   왜: 「~ — ~」 줄표 제목이 사람이 쓴 것 같지 않아 이탈한다는 사이트 주인 지적. 오픈채팅 2곳(09-02~11-05)에서
 *   표현별 「쓴 사람 수」를 세어 사람들이 실제로 쓰는 말로 골랐다(예: 「신스플린트」 대신 「정강이가 아파요」). 검색량은 미확인.
 *   readTime 은 다시 재지 않았다 — 문장만 고쳐 길이 차이가 작다고 보고 그대로 뒀다(측정 아님).
 * 2026-10-13: updated 는 이날 27개 글을 모두 고쳤으므로 전부 2026-10-13. published 는 각 글 ArticleJsonLd 에 있던 값만(없으면 비움).
 * 2026-10-13 가독성 재설계 — **재는 대상을 바꿨다: 기본으로 펼쳐진 글자만**(접힌 「근거 보기」·참고 문헌·FAQ 답 제외, 375px 렌더 기준).
 *   근거를 접어 둔 뒤로는 「다 읽는 시간」보다 「처음 보이는 것을 읽는 시간」이 독자가 실제로 쓰는 시간이라서. 600자/분 그대로.
 *   스크립트: 세션 scratchpad ux/compare.mjs. 27개 글 보이는 글자 92,344 → 61,330(−34%).
 * 2026-10-07 실측(2차): training-types 6156→11(신규) · first-10k 3673→7 · shin-splints 3470→6 · achilles 4162→7(셋 다 재검증 개편)
 * 2026-10-11 실측(5차 재검증, <style> 도 제외 — warmup 애니메이션 CSS 가 본문으로 잡혔다): beginner-guide 4376→8 · intermediate-guide 4309→8 · advanced-guide 3902→7 · cadence 2331→4 · midfoot 3420→6 · posture 1844→4 · warmup 2927→5 · cooldown 3404→6 · rest-day 2526→5 · half-marathon-race-day 9255→16 · wide-foot 2973→5 · hwang-young-jo 1988→4 · kwon-eun-ju 2104→4
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
  /** 처음 올린 날 — 글의 ArticleJsonLd datePublished 와 같은 값. 없으면 비워 둔다(지어내지 않는다) */
  published?: string;
  /** 마지막으로 본문을 고친 날 — 「최신 글」 정렬·사이트맵 lastModified 에 쓴다 */
  updated?: string;
};

export const ARTICLES: GuideArticle[] = [
  // ── 단계 가이드 ─────────────────────────────────────
  { href: "/injury/start-running", tag: "단계 가이드", tagColor: "text-emerald-700 bg-emerald-50", title: "러닝 처음 시작하면 얼마나 뛰어야 하나요?", desc: "러닝을 처음 시작한 사람이 그만두는 가장 큰 이유는 부상입니다. 숨이 차지 않는 속도와 걷기를 섞어 늘리는 순서, 그날은 멈춰야 할 신호를 담았습니다.", readTime: "4분", stages: ["start"], published: "2026-10-06", updated: "2026-11-10" },
  { href: "/injury/beginner-guide", tag: "단계 가이드", tagColor: "text-emerald-700 bg-emerald-50", title: "초보 러너, 일주일에 몇 번 얼마나 뛰나요?", desc: "일주일에 몇 번 뛰고 거리는 얼마나 늘려도 되는지, 초보가 자주 아픈 곳은 어떻게 할지 다룹니다. 흔한 주간 거리 규칙보다 근거 있는 기준도 봅니다.", readTime: "5분", stages: ["start", "to10k"], published: "2025-03-01", updated: "2026-11-10" },
  { href: "/injury/half-marathon-training", tag: "단계 가이드", tagColor: "text-emerald-700 bg-emerald-50", title: "하프마라톤 준비, 얼마나 뛰어야 하나요?", desc: "하프 참가자들이 실제로 뛴 양을 기준으로, 주간 거리와 긴 달리기를 얼마나 빨리 늘릴지와 준비 중에 아플 때 할 일을 논문으로 봅니다.", readTime: "4분", stages: ["to-half"], published: "2026-10-06", updated: "2026-11-10" },
  { href: "/injury/marathon-training", tag: "단계 가이드", tagColor: "text-emerald-700 bg-emerald-50", title: "풀코스 준비, 장거리는 몇 km까지 뛰나요?", desc: "완주자들이 실제로 뛴 주간 거리와 가장 긴 달리기를 기준으로, 장거리를 늘리는 속도와 준비 중 부상, 후반에 무너지는 이유를 논문으로 봅니다.", readTime: "4분", stages: ["to-full"], published: "2026-10-07", updated: "2026-11-10" },
  { href: "/injury/get-faster", tag: "단계 가이드", tagColor: "text-emerald-700 bg-emerald-50", title: "러닝 더 빨라지려면 뭐부터 해야 하나요?", desc: "더 많이 뛴 사람이 빨랐고 강도 배분 공식끼리는 차이가 작았습니다. 인터벌과 근력운동, 테이퍼가 얼마나 도움이 됐는지와 기록 예측을 믿어도 될지 다룹니다.", readTime: "4분", stages: ["faster"], published: "2026-10-07", updated: "2026-11-10" },
  { href: "/injury/intermediate-guide", tag: "단계 가이드", tagColor: "text-emerald-700 bg-emerald-50", title: "러닝 거리를 늘릴 때, 부상은 어떻게 피하나요?", desc: "달린 기간이 쌓이면 다치는 부위가 달라집니다. 어디를 조심하고 언제 쉬며 거리는 어디까지 늘릴지 연구와 저희 제안을 나눠 적었습니다.", readTime: "4분", stages: ["to-half"], updated: "2026-11-10" },
  { href: "/injury/advanced-guide", tag: "단계 가이드", tagColor: "text-emerald-700 bg-emerald-50", title: "마일리지 많이 뛰는 러너, 조심할 부상은 뭔가요?", desc: "마일리지를 많이 쌓는 러너가 조심할 부상 세 가지를 다룹니다. 기록을 노릴 때 훈련을 나누는 법과 심박변이도를 보고 훈련을 바꿀지도 함께 봅니다.", readTime: "5분", stages: ["to-full", "faster"], updated: "2026-11-10" },

  // ── 훈련 방법 (2026-10-07) ─────────────────────────
  { href: "/injury/training-types", tag: "훈련 방법", tagColor: "text-indigo-700 bg-indigo-50", title: "인터벌과 템포런, 뭐가 다르고 언제부터 하나요?", desc: "쉬었다 다시 달릴 때부터 인터벌과 템포런까지, 훈련마다 무엇이고 어떻게 하는지, 연구로 확인된 것과 언제부터 하면 되는지 담았습니다.", readTime: "6분", stages: "all", published: "2026-10-07", updated: "2026-11-10" },
  // 2026-11-07: 첫 내용 파일 글(lib/guide/content/heart-rate-zones.json) — AI 초안, 판정 2회 검증. 읽기 시간은 같은 규약(보이는 글자 1,958 ÷ 600)
  { href: "/injury/heart-rate-zones", tag: "훈련 방법", tagColor: "text-indigo-700 bg-indigo-50", title: "달릴 때 심박수가 너무 높아요, 괜찮을까요?", desc: "달리기만 하면 심박수가 높게 나와 불안하다면. 워치와 나이 공식이 얼마나 틀리는지, 존2를 어떻게 정하는지, 쉬운 달리기를 얼마나 섞는지 연구로 확인했습니다.", readTime: "4분", stages: "all", published: "2026-11-07", updated: "2026-11-10" },
  // 2026-11-09 다시 씀: 제목·소제목을 오픈채팅 심박 질문(질문자 20명, 질문 71건 — 「걷기만 해도 높다」 「존2가 어디까지」 「워치가 튄다」)의 말로 바꾸고,
  //   2026-11-10 제목 다시: 채팅 21,649건에서 「심박존」은 1건(1명). 사람들은 「심박·심박수」(28명)·「존2」(16명)라 부르고, 가장 많은 걱정은 「심박이 너무 높다」(13명)
  //   연구 문장은 결과를 앞에, 한 문장에 사실 하나로 나눴다. 근거·숫자는 그대로. 표 머리글 「엘리트」 → 「주니어」(Seiler & Kjerland 2006 원문 대상)

  // ── 나머지 (2026-09-22 순서 유지) ─────────────────────
  // 2026-10-06: 커뮤니티 부상 글 1위 부위라 전면 개편(3분 → 아래 실측). 복귀 글 신설.
  { href: "/injury/return-to-running", tag: "복귀", tagColor: "text-orange-600 bg-orange-50", title: "부상 후 러닝, 언제까지 쉬어야 하나요?", desc: "다친 뒤 꼭 완전히 쉬어야 하는지, 통증이 어느 정도면 달려도 되는지, 다시 뛸 때 얼마부터 시작할지 다룹니다. 회복은 생각보다 오래 걸립니다.", readTime: "4분", stages: "all", published: "2026-10-06", updated: "2026-11-10" },
  { href: "/injury/it-band", tag: "무릎", tagColor: "text-red-600 bg-red-50", title: "달리면 무릎 바깥쪽이 아파요, 장경인대일까요?", desc: "무릎 바깥이 아프고 내리막에서 심해진다면 장경인대 증후군일 수 있습니다. 내 증상인지 확인하는 법과 스트레칭보다 근거가 있는 엉덩이 근력 운동을 다룹니다.", readTime: "5분", stages: ["to-half", "to-full"], published: "2025-03-01", updated: "2026-11-10" },
  { href: "/injury/wide-foot", tag: "발볼", tagColor: "text-blue-600 bg-blue-50", title: "2E 와이드 뜻, 내 발볼도 넓은 편일까요?", desc: "2E는 넓음, 4E는 매우 넓음을 뜻하는 폭 표시입니다. 내 발볼을 집에서 재는 법과 와이드가 필요한지 확인하는 법을 봅니다.", readTime: "4분", stages: "all", published: "2025-03-01", updated: "2026-11-10" },
  // 2026-09-08 추가. 네이버 실측에서 '발 조건 + 브랜드' 질의가 33%인데 평발 페이지가 없었다.
  { href: "/injury/flat-feet", tag: "평발", tagColor: "text-blue-600 bg-blue-50", title: "평발 러닝화, 안정화를 꼭 신어야 하나요?", desc: "평발이면 안정화를 신으라는 말이 흔하지만 발 타입만으로 신발을 정할 근거는 약합니다. 연구가 엇갈리는 지점과 먼저 볼 조건을 적었습니다.", readTime: "4분", stages: "all", published: "2026-09-08", updated: "2026-11-10" },
  // 2026-09-08 추가. 네이버 검색 의도 3위(카본화 20%).
  { href: "/injury/carbon-plate", tag: "카본화", tagColor: "text-purple-600 bg-purple-50", title: "카본화, 초보가 느리게 뛰어도 효과 있나요?", desc: "가장 많이 인용되는 카본화 연구는 빠른 속도에서만 효과를 쟀습니다. 느리게 뛰는 초보에게도 해당하는지, 지금 가격은 얼마인지 근거와 함께 봅니다.", readTime: "4분", stages: ["to-full", "faster"], published: "2026-09-08", updated: "2026-11-10" },
  { href: "/injury/achilles", tag: "아킬레스", tagColor: "text-orange-600 bg-orange-50", title: "아킬레스건 통증, 달리기를 쉬어야 하나요?", desc: "달린 뒤 아킬레스건이나 종아리가 당겨도 꼭 완전히 쉬지 않아도 됩니다. 근거가 가장 많은 편심성 힐 드롭과 통증을 보며 계속 달리는 법을 담았습니다.", readTime: "5분", stages: ["to-half", "to-full"], published: "2025-03-01", updated: "2026-11-10" },
  { href: "/injury/shin-splints", tag: "정강이", tagColor: "text-red-600 bg-red-50", title: "정강이가 아파요, 신스플린트일까 피로골절일까?", desc: "정강이뼈 안쪽을 따라 넓게 아프면 신스플린트, 한 점이 아프면 피로골절을 의심합니다. 병원에 가야 할 신호와 치료 연구가 실제로 말하는 것을 다룹니다.", readTime: "4분", stages: ["start", "to10k"], updated: "2026-11-10" },
  { href: "/injury/plantar-fasciitis", tag: "족저근막", tagColor: "text-orange-600 bg-orange-50", title: "족저근막염, 뭘 하면 낫고 얼마나 걸리나요?", desc: "아침 첫 걸음에 발뒤꿈치가 아프다면, 스트레칭보다 석 달 시점에 더 나았던 근력 운동과 주사의 실제 효과, 생각보다 긴 회복 기간을 다룹니다.", readTime: "4분", stages: ["to10k", "to-half"], updated: "2026-11-10" },
  { href: "/injury/knee-pain", tag: "무릎", tagColor: "text-red-600 bg-red-50", title: "달리면 무릎 앞이 아파요, 어떻게 해야 낫나요?", desc: "계단을 내려갈 때 무릎 앞이 아프다면 증상과 훈련량 관리부터 알아 두세요. 러너 69명 시험에서는 이 교육만으로도 운동을 더한 것만큼 좋아졌습니다.", readTime: "5분", stages: ["start", "to10k"], published: "2025-03-01", updated: "2026-11-10" },
  { href: "/injury/warmup", tag: "준비운동", tagColor: "text-green-600 bg-green-50", title: "러닝 전 스트레칭, 정적으로 해도 되나요?", desc: "오래 붙들고 늘리는 정적 스트레칭은 짧게 하면 됩니다. 몸을 데우는 5분 동적 루틴과 워밍업이 부상을 줄이는지까지 근거와 함께 봅니다.", readTime: "4분", stages: ["start", "to10k"], updated: "2026-11-10" },
  { href: "/injury/cooldown", tag: "쿨다운", tagColor: "text-teal-600 bg-teal-50", title: "달리기 후 정적 스트레칭, 회복이 빨라지나요?", desc: "달린 뒤 스트레칭이 회복을 앞당긴다는 근거는 확인되지 않았습니다. 유연성을 위해 할 다섯 동작과 멈춰 서 있다 어지러울 때 할 일을 담았습니다.", readTime: "4분", stages: ["start", "to10k"], updated: "2026-11-10" },
  { href: "/injury/rest-day", tag: "회복", tagColor: "text-indigo-600 bg-indigo-50", title: "러닝 쉬는 날, 가볍게라도 움직여야 하나요?", desc: "쉬는 날 꼭 뭘 해야 하는 건 아닙니다. 가볍게 움직이는 쪽이 낫다는 근거는 약합니다. 쉬는 날 할 만한 운동과 완전히 쉬어야 할 신호를 담았습니다.", readTime: "3분", stages: "all", updated: "2026-11-10" },
  { href: "/injury/cadence", tag: "케이던스", tagColor: "text-purple-600 bg-purple-50", title: "케이던스 높을수록 좋나요? 꼭 180이어야 하나요", desc: "같은 사람도 빨리 달릴수록 케이던스가 올라갑니다. 180에 꼭 맞춰야 하는지, 높이면 연구에서 무엇이 달라졌는지 다룹니다.", readTime: "3분", stages: ["to10k", "faster"], updated: "2026-11-10" },
  { href: "/injury/midfoot", tag: "착지법", tagColor: "text-violet-600 bg-violet-50", title: "미드풋 착지란? 힐스트라이크면 바꿔야 할까요?", desc: "미드풋은 발바닥 중간이 먼저 닿는 착지입니다. 부상 없는 뒤꿈치 착지라면 굳이 바꾸지 않아도 된다는 연구가 있고, 바꾸려면 케이던스부터 올려 봅니다.", readTime: "4분", stages: ["to10k"], updated: "2026-11-10" },
  { href: "/injury/posture", tag: "자세", tagColor: "text-cyan-600 bg-cyan-50", title: "달리기 자세, 상체를 숙이면 무릎에 안 좋나요?", desc: "상체를 숙이면 무릎과 고관절 부하가 어떻게 달라지는지 연구로 확인한 부분과, 어깨와 팔을 두는 법에 대한 저희 제안을 나눠 적었습니다.", readTime: "3분", stages: ["start", "to10k"], updated: "2026-11-10" },
  { href: "/injury/hwang-young-jo", tag: "황영조", tagColor: "text-yellow-700 bg-yellow-50", title: "황영조 몬주익 금메달, 초보 러너가 배울 점은?", desc: "황영조 선수가 몬주익 언덕에서 금메달을 딴 과정과, 선수 시절의 고통을 초보 러너가 따라 하지 않아도 되는 이유를 기사로 확인해 적었습니다.", readTime: "3분", stages: [], updated: "2026-11-10" },
  { href: "/injury/kwon-eun-ju", tag: "권은주", tagColor: "text-pink-600 bg-pink-50", title: "권은주 선수가 말하는 부상과 쉬는 법", desc: "한국 여자 마라톤 기록을 오래 지킨 권은주 선수의 부상 경험과 쉬는 법을 기사로 확인했습니다. 여성 러너용 근력 운동은 저희 제안으로 따로 적었습니다.", readTime: "4분", stages: [], updated: "2026-11-10" },
  { href: "/injury/first-10k", tag: "첫 대회", tagColor: "text-emerald-600 bg-emerald-50", title: "첫 10km 대회, 준비 기간과 페이스는?", desc: "지금 뛰는 거리에서 몇 주를 잡을지, 긴 날은 어디까지 늘릴지, 출발은 얼마나 천천히 할지 다룹니다. 연구로 확인된 것과 저희 제안은 나눠 적었습니다.", readTime: "5분", stages: ["to10k"], updated: "2026-11-10" },
  { href: "/injury/half-marathon-race-day", tag: "대회 실전", tagColor: "text-emerald-700 bg-emerald-50", title: "하프마라톤 당일, 페이스와 젤은 어떻게 하나요?", desc: "하프 대회 날 페이스는 어떻게 잡고 젤과 물은 얼마나 챙길지, 전날 음식과 복장까지 연구로 확인한 것과 직접 경험을 나눠 적었습니다.", readTime: "8분", stages: ["to-half", "to-full"], updated: "2026-11-10" },
];

/**
 * 주제 축 — 단계와 **다른 두 번째 축.** (2026-09-12 도입, 둘은 AND)
 * 이미 있는 `tag` 값에서 파생한다. 어느 주제에도 안 걸리는 태그는 「기타」로 — 숨기지 않는다.
 */
export const TOPICS = {
  "단계 가이드": ["단계 가이드"],
  "훈련 방법": ["훈련 방법"],
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
