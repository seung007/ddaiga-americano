import { Bandage, FileText, Flag, Footprints, Medal, PersonStanding, Route, Timer, type LucideIcon } from "lucide-react";
import { ARTICLES, topicOf, type GuideArticle } from "./articles";

/**
 * 가이드 목록 규칙 — 글이 늘면 화면이 저절로 나뉘게 (2026-10-13, 제안서 「러닝 가이드 목록 구조 제안서」)
 *
 * 운영자: "전체는 1·2·3 페이지가 낫고, 테마별로는 길지 않으면 나열, 많아지면 페이지를 나누자."
 * 글 27개(가장 큰 주제 7개)에서는 화면이 바뀌지 않는다. 숫자는 여기 한 곳에서만 바꾼다.
 *
 *   · 한 주제 TOPIC_INLINE_MAX 개 이하 → 허브에 전부 나열
 *   · 넘으면 → 허브엔 앞 TOPIC_PREVIEW 개 + 「모두 보기」 → /injury/topic/<slug> (실제 주소가 있는 페이지 — 검색·공유)
 *   · 주제 페이지가 TOPIC_PAGE_SIZE 개를 넘으면 → ?page=2 …
 *   · 전체 글이 ALL_LATEST_MIN 개 이상 → 허브에 「최신 글」 띠 + /injury/all 번호 페이지(ALL_PAGE_SIZE 개씩)
 *
 * 하지 않는 것: 글 1~3개짜리 주제 페이지(내용 없는 페이지로 보일 수 있다), 클릭 수에 따른 자동 정렬(매번 순서가 바뀐다).
 * 대표 몇 개는 원장(lib/guide/articles.ts) 순서 그대로 — 순서를 바꾸려면 원장에서 줄을 옮긴다.
 */
export const TOPIC_INLINE_MAX = 8;
export const TOPIC_PREVIEW = 5;
export const TOPIC_PAGE_SIZE = 20;
export const ALL_LATEST_MIN = 40;
export const ALL_PAGE_SIZE = 12;

/** 허브 묶음 순서 */
export const TOPIC_ORDER = ["단계 가이드", "아픈 곳", "신발 고르기", "달리는 법", "훈련 방법", "대회", "선수 이야기", "기타"] as const;
export type ListTopic = (typeof TOPIC_ORDER)[number];

/** 주제 페이지 주소 — 한 번 정하면 바꾸지 않는다(밖에서 링크가 걸린다) */
export const TOPIC_SLUG: Record<ListTopic, string> = {
  "단계 가이드": "stages",
  "아픈 곳": "pain",
  "신발 고르기": "shoes",
  "달리는 법": "form",
  "훈련 방법": "training",
  대회: "race",
  "선수 이야기": "athletes",
  기타: "etc",
};

export const topicBySlug = (slug: string): ListTopic | null =>
  (Object.entries(TOPIC_SLUG).find(([, s]) => s === slug)?.[0] as ListTopic | undefined) ?? null;

export const articlesOf = (t: ListTopic, list: readonly GuideArticle[] = ARTICLES) =>
  list.filter((a) => topicOf(a.tag) === t);

/** 허브 한 묶음에서 보여 줄 것 — 넘치면 앞 몇 개 + 남은 수 */
export function topicPreview(items: GuideArticle[]): { shown: GuideArticle[]; rest: number } {
  if (items.length <= TOPIC_INLINE_MAX) return { shown: items, rest: 0 };
  return { shown: items.slice(0, TOPIC_PREVIEW), rest: items.length - TOPIC_PREVIEW };
}

/** 주제 페이지가 있어야 하는 주제(허브에서 넘친 주제만) */
export const topicsWithPage = (list: readonly GuideArticle[] = ARTICLES): ListTopic[] =>
  TOPIC_ORDER.filter((t) => articlesOf(t, list).length > TOPIC_INLINE_MAX);

/** 「최신 글」을 켤지 */
export const latestEnabled = (list: readonly GuideArticle[] = ARTICLES) => list.length >= ALL_LATEST_MIN;

/** 최신순 — 날짜(수정일 → 작성일)가 있는 글이 앞, 없는 글은 원장 순서로 뒤 */
export function byLatest(list: readonly GuideArticle[] = ARTICLES): GuideArticle[] {
  const key = (a: GuideArticle) => a.updated ?? a.published ?? "";
  return [...list].map((a, i) => ({ a, i })).sort((x, y) => key(y.a).localeCompare(key(x.a)) || x.i - y.i).map((x) => x.a);
}

/** 번호 페이지 — page 는 1부터. 범위를 넘으면 null */
export function pageOf<T>(list: readonly T[], page: number, size: number): { items: T[]; page: number; pages: number } | null {
  const pages = Math.max(1, Math.ceil(list.length / size));
  if (!Number.isInteger(page) || page < 1 || page > pages) return null;
  return { items: list.slice((page - 1) * size, page * size), page, pages };
}

/**
 * 주제별 선 아이콘·색 — 묶음 제목 아이콘과 글 줄의 태그 칩에 같이 쓴다(Tailwind 가 읽도록 클래스 문자열을 그대로 적는다)
 *
 * 2026-11-10: 이모지 + 파스텔 네모 타일 → lucide 선 아이콘(이 브랜치 홈과 같은 묶음)·타일 없음.
 *   칩 색은 흰 바탕 12px 글자로 읽히게 *-800 (yellow·amber·orange·sky·teal) 으로 한 단계 진하게.
 *   빨강(rose)·보라(indigo)는 뺐다 — 빨강은 오류·경고(허브의 「진료가 먼저」)에만 쓰고, 「아픈 곳」은 주황.
 */
export const LOOK: Record<string, { Icon: LucideIcon; chip: string; text: string }> = {
  "단계 가이드": { Icon: Route, chip: "bg-emerald-50 text-emerald-700", text: "text-emerald-700" },
  "훈련 방법": { Icon: Timer, chip: "bg-slate-100 text-slate-700", text: "text-slate-700" },
  "신발 고르기": { Icon: Footprints, chip: "bg-sky-50 text-sky-800", text: "text-sky-800" },
  "아픈 곳": { Icon: Bandage, chip: "bg-orange-50 text-orange-800", text: "text-orange-800" },
  "달리는 법": { Icon: PersonStanding, chip: "bg-amber-50 text-amber-800", text: "text-amber-800" },
  대회: { Icon: Flag, chip: "bg-teal-50 text-teal-800", text: "text-teal-800" },
  "선수 이야기": { Icon: Medal, chip: "bg-yellow-50 text-yellow-800", text: "text-yellow-800" },
  기타: { Icon: FileText, chip: "bg-gray-100 text-gray-700", text: "text-gray-700" },
};
export const look = (t: string) => LOOK[t] ?? LOOK["기타"];

/**
 * 묶음 제목 아래 한 줄 — 「이 묶음은 무엇을 찾을 때 보나」. 지금 들어 있는 글의 tag(articles.ts TOPICS)로 쓴 말이다.
 * 주제에 글을 넣거나 빼면 이 줄도 맞는지 본다(예: 대회에 풀코스 당일 글이 생기면 「하프」를 고친다).
 */
export const TOPIC_NOTE: Record<ListTopic, string> = {
  "단계 가이드": "지금 거리에서 다음 거리로 넘어갈 때",
  "아픈 곳": "아픈 부위별로, 쉴지와 다시 뛰는 법",
  "신발 고르기": "발볼·평발·카본화",
  "달리는 법": "자세·착지·스트레칭·쉬는 날",
  "훈련 방법": "인터벌·템포런·심박수",
  대회: "첫 10km 준비와 하프 대회 당일",
  "선수 이야기": "한국 마라톤 선수의 부상과 회복",
  기타: "그 밖의 글",
};
