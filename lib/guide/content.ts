import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * 내용 파일로 쓰는 가이드 글 (2026-11-07)
 *
 * 왜: 글 27편이 각자 손으로 쓴 페이지라 새 글마다 레이아웃·인용 표기·FAQ·JSON-LD 를 다시 짰다.
 *   새 글은 **본문만 담은 JSON 한 파일** + 공통 틀(components/guide/GuideArticle.tsx) 로 만든다.
 *   기존 글은 하나씩 옮긴다(주소 /injury/<slug> 는 그대로 — 검색 순위 유지).
 *
 * 왜 MDX 가 아니라 JSON 인가: 검증기(비공개 저장소 ddaiga-pipeline 의 pipeline/verify)가
 *   **문장마다 어느 출처가 받치는지**를 알아야 주장과 원문을 대조할 수 있다. 문단·표 칸·FAQ 답이
 *   각각 `cite` 를 들고 있으면 「주장 뽑기」가 추측이 아니라 읽기가 된다(계획 문서 검증 ②).
 *
 * 한 사실은 한 곳에만: 제목·설명·태그·날짜·읽기 시간은 원장 lib/guide/articles.ts 에만 둔다.
 *   이 파일에는 본문만. scripts/check-content.mjs 가 원장 줄이 있는지, 형식이 맞는지 막는다.
 *
 * 글 안 서식은 두 가지만: **굵게**, [보이는 말](/내부/경로). 그 밖의 마크다운은 글자 그대로 나온다.
 */

export type Basis = "paper" | "rule";
/** 문장을 받치는 참고 문헌 id 목록 — references[].id */
export type Cite = string[];

export type Block =
  | { p: string; cite?: Cite; basis?: Basis }
  | { note: string }
  | { todo: { t: string; cite?: Cite; basis?: Basis }[]; title?: string }
  | { warn: { title: string; items: string[] } }
  | { table: { head: string[]; rows: { t: string; cite?: Cite; basis?: Basis }[][] } }
  | { evidence: { t: string; cite: Cite }[]; label?: string };

export type Section = {
  /** 목차·주소의 # 뒤에 쓰는 영문 id */
  id: string;
  /** 질문형 소제목 */
  q: string;
  /** 소제목 바로 아래 첫 문장 = 답 */
  answer: string;
  cite?: Cite;
  basis?: Basis;
  blocks: Block[];
};

export type Reference = {
  id: string;
  /** 「Asplund et al.」 「Van Hooren & Peake」 — 인용 검사가 링크된 논문의 제1저자와 맞춘다 */
  authors: string;
  year: string;
  /** 저널 권(호):쪽 — 모르면 비운다(기억으로 채우지 않는다) */
  journal?: string;
  url: string;
  /** 이 논문이 무엇을 했고 무엇을 말하는지 한 줄 — 대상·설계·결과 */
  note: string;
};

export type GuideContent = {
  /** 글 유형 — 소제목 순서 틀. 계획 문서 「유형별 틀」 */
  type: "injury" | "concept" | "race-prep" | "training" | "compare";
  /** 「한눈에」 3~4줄 */
  summary: { t: string; basis?: Basis; cite?: Cite }[];
  /** 글 맨 위 두 문장 — 이 글이 무엇에 답하는지 */
  lead: string;
  sections: Section[];
  faq: { q: string; a: string; cite?: Cite }[];
  references: Reference[];
  /** 이어서 볼 글 2개(/injury/…) */
  related: string[];
  /** 만든 방법 — 기록용(검증기·check-content 가 읽음). 2026-11-09 사이트 주인 결정으로 화면에는 내지 않는다 */
  made: { by: "ai-draft" | "human"; verified: string; checker: string };
};

const DIR = path.join(process.cwd(), "lib", "guide", "content");

export function contentSlugs(): string[] {
  let names: string[];
  try {
    names = readdirSync(DIR);
  } catch {
    return []; // 아직 글이 없으면 폴더도 없다(git 은 빈 폴더를 올리지 않는다)
  }
  return names
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
}

export function loadContent(slug: string): GuideContent | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    return JSON.parse(readFileSync(path.join(DIR, `${slug}.json`), "utf8")) as GuideContent;
  } catch {
    return null;
  }
}
