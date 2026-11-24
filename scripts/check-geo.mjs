#!/usr/bin/env node
/**
 * 글 구조 검사 — 생성형 AI·검색이 답을 바로 찾을 수 있는 모양인지 (2026-11-02)
 *
 * 규칙 원본: AGENTS.md 「새 글·페이지 규칙」. 출발점은 hyun 님이 공유한 카드뉴스의 다섯 원칙
 * (질문형 제목 · 한 문단 한 내용 · 개념은 뜻부터 · 표/FAQ · 누가·언제). 원칙의 효과는 우리가 측정하지 않았다.
 * 그래서 이 검사는 「효과」가 아니라 **빠뜨림**만 잡는다 — 기계로 셀 수 있는 것만.
 *
 * 러닝 가이드 (app/injury/<글>/page.tsx, 목록 페이지 제외)
 *  ① FAQ(FaqSection) 3문항 이상
 *  ② ArticleJsonLd(구조화 데이터) + ArticleMeta(제목 아래 「최종 수정 · 작성」 한 줄)
 *  ③ 원장 lib/guide/articles.ts 에 그 글이 있고 updated 날짜가 있음 — 날짜는 원장에서만 나온다
 *  ④ 질문형 소제목(<h2> 가 「?」「~나요」「~까요」로 끝남) 1개 이상
 *     지금 없는 글은 DEBT 에 적어 둔다. 새 글은 DEBT 에 넣지 않는다. 고쳐서 통과하면 DEBT 에서 빼야 통과한다
 * 블로그 원고 (docs/블로그/네이버블로그_*.md · 블로그_*.md — 노트북에만 있다. .gitignore 대상)
 *  ⑤ 「최종 수정: YYYY-MM-DD」 줄 · 「## 자주 묻는 질문」 절 · 질문형 소제목 1개 이상
 *     규칙 이전(2026-11-02)에 쓴 원고는 LEGACY_POSTS — 이미 네이버에 올라간 글이라 새 규칙으로 막지 않는다.
 *     원고가 아닌 파일(발행_일정.md 등)은 보지 않는다
 *     2026-11-02 고침: 처음엔 폴더의 .md 전부를 봐서 노트북에서 기존 원고 15편 + 발행 일정이 41건으로 실패했다
 *     (샌드박스에는 원고 폴더가 없어 통과로 보였다)
 *
 * 「한 문단 한 내용」은 기계로 판정하지 않는다 — 작성 규칙(AGENTS.md)으로만 지킨다.
 * 「어려운 말은 뜻부터」는 2026-11-18 부터 새 틀 글에 한해 기계로 본다(아래 TERMS·checkTerms).
 *   계기: 견본 글에서 체중 소제목을 FAQ 로 옮기다 「체질량지수(BMI)」 풀이가 빠졌는데 검사는 통과했다.
 * 대회·러닝화 상세의 FAQ 는 데이터에서 자동으로 만들어진다(lib/faq.ts) — 여기서 보지 않는다.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const LIST_PAGES = new Set(["all", "topic"]);
/** 2026-11-02 기준 질문형 소제목이 없는 글. 고치면 여기서 뺀다 */
const DEBT = new Set/*<string>*/([]); // 2026-11-10 가이드 개편으로 세 편(hwang-young-jo·knee-pain·start-running) 모두 질문형 소제목이 생겨 비웠다
/** 규칙 이전에 쓴 블로그 원고 (2026-11-02 노트북 목록). 새 원고는 여기 넣지 않는다 */
const LEGACY_POSTS = new Set([
  "네이버블로그_11월마라톤_2026-10-15.md", "네이버블로그_2편.md", "네이버블로그_3편_2026-09-15.md",
  "네이버블로그_3편_2026-09-22.md", "네이버블로그_글.md", "네이버블로그_무릎통증러닝화.md", "네이버블로그_미드풋.md",
  "네이버블로그_발타입러닝화.md", "네이버블로그_소개글.md", "네이버블로그_아라히8후기모음_2026-10-15.md",
  "네이버블로그_정강이통증.md", "네이버블로그_족저근막염러닝화.md", "네이버블로그_카본화입문자.md",
  "네이버블로그_한쪽무릎통증.md", "네이버블로그_호카브룩스비교.md",
]);
const POST_RE = /^(네이버블로그|블로그)_.+\.md$/;

const articles = readFileSync(path.join(ROOT, "lib/guide/articles.ts"), "utf8");
const errors = [];
const QUESTION = /(\?|나요|까요|인가요|할까|일까|는가)\s*$/;

/**
 * 2026-11-18 확정 틀(docs/운영/가이드_틀.md)로 바꾼 글. 롤아웃하면서 한 편씩 넣는다 — 다 넣으면 이 목록을 없애고 전체에 적용한다.
 * 들어 있으면: 틀 부품이 다 있어야 하고(MUST), 옛 부품(딱지·접힘·[n])이 남아 있으면 안 된다(BANNED).
 */
const NEW_TEMPLATE = new Set(["start-running", "return-to-running", "half-marathon-training", "training-types", "beginner-guide", "shin-splints", "knee-pain", "warmup", "cooldown", "posture", "first-10k", "plantar-fasciitis", "cadence", "midfoot", "rest-day", "wide-foot", "flat-feet", "intermediate-guide", "it-band", "achilles", "half-marathon-race-day", "marathon-training", "advanced-guide", "get-faster", "carbon-plate", "hwang-young-jo", "kwon-eun-ju"]);
/**
 * 바꾸는 순서 (2026-11-18 Claude 제안 — hyun 님 확인 전). 앞에서부터 한 편씩 바꾸고 NEW_TEMPLATE 에 넣는다 — 검사가 끝에 「다음」을 알려 준다.
 * 0. 견본에서 정정한 주장(환기역치·OR 7.56·86%)이 그대로 남아 있을 수 있는 글 — 틀보다 정정이 먼저(AGENTS 신뢰 규칙 3)
 * 1~4. 독자가 실제로 거치는 단계 순서(처음 → 10km → 하프 → 풀·기록). 다치는 글은 그 부상이 많이 생기는 단계에 붙였다
 * 5. 인물 글 — 이야기 글이라 질문형 틀이 안 맞을 수 있다. 차례가 오면 틀을 그대로 씌울지 먼저 묻는다
 * 새 가이드를 만들면 이 목록에도 넣는다(빠지면 검사가 막는다).
 * heart-rate-zones 는 page.tsx 가 아니라 내용 파일(lib/guide/content/heart-rate-zones.json) + 공용 GuideArticle 로 그려진다.
 *   차례가 오면 GuideArticle 을 새 틀 부품으로 바꾸는 일이 따로 있다 — 이 검사의 NEW_TEMPLATE 은 page.tsx 만 본다.
 * 한 편 바꿀 때마다: npm run check → npm run guide:compare -- <글> 로 견본과 같은 휴대폰 화면에서 비교(scripts/guide-compare.mjs).
 */
/** 새 틀로 바꿨지만 본문이 아직 문장 규칙(docs/운영/가이드_문장_규칙.md)에 걸리는 글 — 고칠 때마다 뺀다. 2026-11-20 규칙을 검사로 옮긴 날의 상태 */
const WORDING_TODO = new Set([]);
let wordingLeft = 0;
/** 새 틀로 바꿨지만 FAQ 를 아직 본문 규칙(굵게·답 먼저)으로 못 고친 글 — 고칠 때마다 뺀다. 2026-11-18 규칙이 생기기 전에 바꾼 글들 */
const FAQ_TODO = new Set([]);
const slugOf = (entry, s) => (s.match(/ArticleMeta href="\/injury\/([^"]+)"/) || [])[1];
const ROLLOUT = [
  "start-running",
  "return-to-running", "half-marathon-training", "training-types",
  "beginner-guide", "shin-splints", "knee-pain", "warmup", "cooldown", "posture",
  "first-10k", "plantar-fasciitis", "cadence", "midfoot", "rest-day", "wide-foot", "flat-feet",
  "intermediate-guide", "it-band", "achilles", "half-marathon-race-day",
  "marathon-training", "advanced-guide", "get-faster", "carbon-plate",
  "hwang-young-jo", "kwon-eun-ju",
  "heart-rate-zones", // 맨 마지막 — 공용 부품 GuideArticle 을 새 틀로 바꾸는 일이라 다른 글이 끝난 뒤에
];
/**
 * 보류 — 지금은 바꾸지 않는 글과 이유. 「다음」을 고를 때 건너뛴다(없으면 보류 글에서 순서가 멈춘다).
 * 사람이 없을 때 막힌 글(틀을 바꿔야 함 · 검사가 계속 실패)도 여기에 이유와 함께 넣고 다음 글로 간다. 보류는 끝이 아니다 — 보고에 남긴다.
 */
const HOLD = new Map([
  // 2026-11-23 hyun 님 결정 「인물 글 2편도 확정 틀 그대로」(세션 지시서 1절) — hwang-young-jo·kwon-eun-ju 둘 다 바꿔서 NEW_TEMPLATE 로 옮겼다
]);
const MUST = ["<KeyPoints", "<TableOfContents", "<Num ", "<OneLine", "<Sources", "<Src n=", "<AuthorNote", "ArticleMeta href", "compact"];
const BANNED = ["<Evidence", "<Todo", "<Basis", "<Summary", "<References", "<Note>", "<Cite", "분 읽기"];

/**
 * 「어려운 말은 뜻부터」 (2026-11-18). 아래 말이나 영문 약어(BMI·HRV처럼 대문자 2~5자)가 글에서 처음 나올 때
 * 그 자리 근처(앞 60자·뒤 160자)에 풀이가 있어야 한다. 인정하는 풀이 모양은 셋뿐이다 — 쓰는 사람도 이 모양으로 쓴다.
 *   ㄱ. 괄호      체질량지수(BMI) · 피로골절(뼈에 생기는 가는 금)
 *   ㄴ. ~은/는    피로골절은 같은 충격이 반복돼 뼈에 생기는 가는 금이에요.   (끝: 이에요·예요·거예요·말해요·뜻해요·가리켜요)
 *   ㄷ. ~라고     이걸 말하기 테스트라고 해요.
 * 읽는 순서대로 본다: 3줄 요약 → 목차 → 본문(출처 목록 앞까지). FAQ 는 답 하나만 따로 인용되므로 문항마다 따로 본다.
 * 한계: 목록에 없는 한글 전문어는 못 잡는다. 새 글을 바꿀 때 나오는 전문어를 여기에 더한다. 약어는 목록 없이 잡는다.
 */
const TERMS = [
  "말하기 테스트", "피로골절", "10% 규칙", "케이던스", "드롭", "스택", "2E", "4E", "환기역치", "젖산역치", "최대산소섭취량",
  "심박존", "존2", "템포런", "인터벌", "테이퍼", "과회내", "회내", "장경인대", "족저근막", "심박변이도", "마일리지", "VO2max",
  // 2026-11-18 training-types 를 확정 틀로 바꾸며 더함 — 그 글에 처음 나오는 전문어다
  "파틀렉", "스트라이드", "크로스 트레이닝",
  // 2026-11-18 beginner-guide 를 확정 틀로 바꾸며 더함 — 초보가 자주 아픈 곳의 이름이다
  "신스플린트", "슬개대퇴 증후군",
  // 2026-11-18 first-10k 를 확정 틀로 바꾸며 더함 — 대회 페이스 이야기에서 처음 나오는 말이다
  "음의 분할",
  // 2026-11-18 midfoot 를 확정 틀로 바꾸며 더함 — 착지 방식의 이름들이다
  "미드풋", "힐스트라이크", "포어풋", "오버스트라이드",
  // 2026-11-23 half-marathon-race-day 를 확정 틀로 바꾸며 더함 — 대회 당일 물·음식·페이스 이야기에서 처음 나오는 말이다
  "카보로딩", "페이스메이커", // 「저나트륨혈증」도 넣으려 했으나 cooldown 글이 풀이 없이 써서 그 글을 고칠 때 넣는다(2026-11-23)
  // 2026-11-23 kwon-eun-ju 를 확정 틀로 바꾸며 더함 — 선수 발언 속 말이다. 다른 가이드 글 화면에는 없다(grep 으로 확인)
  "코어",
];
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function defined(text, idx, term) {
  const w = text.slice(Math.max(0, idx - 60), idx + term.length + 160);
  const e = esc(term);
  return new RegExp(`[가-힣]\\s*\\(${e}\\)|${e}\\s*\\([가-힣]`).test(w)
    || new RegExp(`${e}(은|는|이란|란)\\s[^.?!]{2,120}?(이에요|예요|거예요|말해요|뜻해요|가리켜요)`).test(w)
    || new RegExp(`${e}(이)?라고\\s*(해요|불러요|부르)`).test(w);
}
/** 화면에 보이는 글자만 읽는 순서대로 — JSX 글자 조각과 한글이 든 문자열(Steps 항목·제목 속성)을 원본 위치 순으로 잇는다 */
function readable(src) {
  const s = src.replace(/\{?\/\*[\s\S]*?\*\/\}?/g, (m) => " ".repeat(m.length));
  const pieces = [];
  for (const m of s.matchAll(/>([^<>]+)</g)) pieces.push([m.index, m[1]]);
  for (const m of s.matchAll(/"([^"\\\n]*)"/g)) pieces.push([m.index, m[1]]);
  return pieces.filter(([, t]) => /[가-힣]/.test(t)).sort((a, b) => a[0] - b[0]).map(([, t]) => t.replace(/\{" "\}/g, " ").trim()).join("\n");
}
function checkTerms(s, bad) {
  const units = [];
  const start = s.indexOf("return ("), end = s.indexOf("<Sources");
  if (start > 0 && end > start) units.push(["본문", readable(s.slice(start, end))]);
  const faq = s.match(/const FAQ[\s\S]*?\n\];/);
  if (faq) for (const m of faq[0].matchAll(/q:\s*"([^"]*)",\s*a:\s*"([^"]*)"/g)) units.push([`FAQ 「${m[1]}」`, `${m[1]}\n${m[2]}`]);
  for (const [where, text] of units) {
    const found = new Map();
    for (const t of TERMS) { const i = text.indexOf(t); if (i >= 0) found.set(t, i); }
    for (const m of text.matchAll(/(?<![A-Za-z0-9])([A-Z]{2,5})(?![A-Za-z])/g)) if (!found.has(m[1])) found.set(m[1], m.index);
    for (const [t, i] of found) if (!defined(text, i, t)) bad(`${where}: 「${t}」 처음 나오는 곳에 풀이 없음 — 괄호 풀이, 「…은/는 ~예요」, 「…라고 해요」 중 하나로 (docs/운영/가이드_틀.md)`);
  }
}

/**
 * 틀 규칙 중 기계로 셀 수 있는 것 전부 (2026-11-18, hyun 님: 「정한 규칙이 강제로 다 적용되게」).
 * AGENTS.md 「가이드 글 틀」의 줄마다 하나씩. 못 세는 것(말의 세기·한 문단 한 내용·요약이 사람 말인지)은 여기 없다 — 사람과 화면 비교가 본다.
 */
/**
 * 문장 규칙 (2026-11-20) — 원본은 docs/운영/가이드_문장_규칙.md. 조사한 규칙 중 기계로 셀 수 있는 것과 용어 통일표를 여기서 막는다.
 * 계기: 11-18 조사 뒤 규칙을 문서에만 두어, hyun 님이 화면을 캡처해 어색한 말을 하나씩 짚어야 했다.
 * 통일표는 그 파일 3절의 첫 칸을 그대로 읽는다(같은 말을 두 곳에 적지 않는다). 「~」·괄호가 든 칸은 사람이 본다.
 */
const RULES_MD = path.join(ROOT, "docs/운영/가이드_문장_규칙.md");
const BANNED_TERMS = (() => {
  if (!existsSync(RULES_MD)) return null;
  const md = readFileSync(RULES_MD, "utf8");
  const a = md.indexOf("## 3."), b = md.indexOf("## 4.", a);
  if (a < 0 || b < 0) return null;
  const out = [];
  for (const line of md.slice(a, b).split("\n")) {
    if (!line.startsWith("| ") || line.startsWith("| 쓰지 않는 말") || line.startsWith("|---")) continue;
    const [bad, good] = line.split("|").slice(1, 3).map((x) => x.trim());
    for (const t of bad.split(" · ").map((x) => x.trim())) if (t && !/[~(]|^주 \d/.test(t)) out.push([t, good]);
  }
  return out;
})();
/** 글에 보이는 글자(text)에 문장 규칙을 건다. where = 오류 앞에 붙일 자리 이름 */
function checkWording(text, bad, where = "") {
  const at = (i, n) => text.slice(Math.max(0, i - 10), i + n + 8).replace(/\n/g, " ");
  if (!BANNED_TERMS) bad("문장 규칙 파일(docs/운영/가이드_문장_규칙.md)의 용어 통일표를 못 읽음 — 규칙 없이 통과시키지 않는다");
  for (const [t, good] of BANNED_TERMS ?? []) { const i = text.indexOf(t); if (i >= 0) bad(`${where}쓰지 않는 말 「${t}」 → ${good}: 「…${at(i, t.length)}…」`); }
  const rule = (re, msg) => { const m = text.match(re); if (m) bad(`${where}${msg}: 「…${at(m.index, m[0].length)}…」`); };
  rule(/수행(합니다|해요|하는)|진행합니다|진행해요/, "영어식 명사형(수행·진행) — 그냥 동사로");
  rule(/되어지|되어집니다|되어져/, "이중 피동 — 능동형으로");
  rule(/아시다시피|말씀드린 것처럼|앞서 살펴본|살펴보겠|알아보겠/, "메타 담화·예고 문장");
  rule(/\d{4,}(원|명|건|보|걸음|회|개)(?![가-힣]*년)/, "네 자리 이상 숫자는 세 자리마다 쉼표");
  for (const sent of text.split(/(?<=[.?!])\s+|\n/)) {
    const n = sent.replace(/\s/g, "").length;
    if (n > 110) { bad(`${where}문장이 김(${n}자) — 한 문장에 생각 하나: 「${sent.slice(0, 36)}…」`); break; }
  }
}

function checkTemplateRules(s, bad, entry) {
  const start = s.indexOf("return ("), end = s.indexOf("<Sources");
  const body = start > 0 && end > start ? s.slice(start, end) : "";
  const text = readable(body);
  const nums = (body.match(/<Num n=\{/g) || []).length;
  if (nums < 4 || nums > 6) bad(`번호 붙은 큰 질문 ${nums}개 — 틀은 4~6개`);
  const ones = (body.match(/<OneLine>/g) || []).length;
  if (ones !== nums) bad(`한 줄 요약(<OneLine>) ${ones}개인데 큰 질문은 ${nums}개 — 절마다 끝에 하나`);
  const kp = body.match(/<KeyPoints[\s\S]*?\]\}\s*\/>/);
  const kpItems = kp ? (kp[0].match(/<>/g) || []).length : 0;
  if (kpItems !== 3) bad(`3줄 요약(<KeyPoints>) 항목 ${kpItems}개 — 3개`);
  const lead = body.match(/<Lead>([\s\S]*?)<\/Lead>/);
  if (!lead) bad("<Lead> 없음");
  else if (/\d/.test(lead[1].replace(/\{[^}]*\}/g, ""))) bad("<Lead>(첫 문단)에 숫자가 있음 — 숫자·예고 문장 없이");
  const faq = s.match(/const FAQ[\s\S]*?\n\];/)?.[0] ?? "";
  const all = `${text}\n${[...faq.matchAll(/[qa]:\s*"([^"]*)"/g)].map((m) => m[1]).join("\n")}`;
  const hit = (re, msg) => { const m = all.match(re); if (m) bad(`${msg}: 「…${all.slice(Math.max(0, m.index - 12), m.index + m[0].length + 6).replace(/\n/g, " ")}…」`); };
  hit(/(합니다|입니다|습니다|됩니다|십시오)(?=[.!?\s]|$)/, "말투는 「~요」 — 「~니다」가 있음");
  hit(/추천해요|추천합니다|추천드려요/, "사이트가 정한 기준의 말끝은 「권해요」");
  hit(/\[\d+\]/, "문장 끝 [n] 표시");
  hit(/※/, "※ 표시");
  hit(/[“”‘’]/, "따옴표 표시");
  hit(/를 통해|을 통해|앞서 말했듯|앞에서 말했듯/, "번역투·군더더기");
  hit(/저희 제안|연구 근거|연구끼리 엇갈/, "딱지·엇갈림 표시");
  hit(/[가-힣] *→ *[가-힣][^\n]*[.요]/, "문장 속 →");
  // 한국에서 쓰는 말로 (2026-11-19, hyun 님: 「네 주 안쪽」「2마일」은 보통 안 쓴다)
  hit(/(세|네|다섯|여섯|일곱|여덟|아홉|열|스무) ?(주|달|개월|시간|분|일|킬로)(?![가-힣]*리)|(석|넉|여섯|열두) 달/, "기간·사람 수는 숫자로(「여섯 주」 ✗ → 「6주」). 「한 번·한 달·두 배」 같은 일상어는 그대로");
  hit(/(주|달|개월|일|분|시간) 안쪽/, "「~ 안쪽」 ✗ → 「4주만 쉬어도」「4주 안에」처럼");
  hit(/마일(?!리지)|파운드|인치|피트|야드|온스/, "단위는 km·kg·cm 로 환산(환산은 계산이다). 원래 단위는 접힌 출처에만");
  // FAQ 가 큰 질문과 같은 질문이면 본문 반복이다(견본에서 5문항 중 3개가 겹쳐 글이 길게 읽혔다)
  const norm = (t) => t.replace(/[\s?.,!]/g, "");
  const h2q = [...body.matchAll(/<Num\b[^>]*\/>\s*([^<{]+)/g)].map((m) => norm(m[1]));
  for (const m of faq.matchAll(/q:\s*"([^"]*)"/g)) if (h2q.includes(norm(m[1]))) bad(`FAQ 「${m[1]}」가 큰 질문과 같은 질문 — 한 곳에만`);
  // FAQ 답도 본문처럼 (2026-11-18): 답마다 굵은 할 일·핵심 숫자 1~3곳(**…**), 연구 언급은 많아야 한 번.
  // 이미 새 틀로 바꾼 글 중 아직 FAQ 를 못 고친 글은 FAQ_TODO 에서 빼 가며 고친다.
  if (!FAQ_TODO.has(slugOf(entry, s))) for (const m of faq.matchAll(/q:\s*"([^"]*)",\s*a:\s*"([^"]*)"/g)) {
    const bolds = (m[2].match(/\*\*.+?\*\*/g) || []).length;
    if (bolds < 1 || bolds > 3) bad(`FAQ 「${m[1]}」 굵은 곳 ${bolds}개 — 할 일·핵심 숫자 1~3곳을 **…** 로`);
    const len = m[2].replace(/\*\*|\s/g, "").length, sents = (m[2].match(/[.?!](\s|$)/g) || []).length;
    if (len > 130 || sents > 4) bad(`FAQ 「${m[1]}」 답이 김(${len}자·${sents}문장) — 130자·4문장 안으로. 견본은 62~110자`);
    const j = m[2].match(/무작위|메타분석|환자-대조군|중앙값|유의[하한]|예후|코크런|응답률|관찰 연구|확실성|체계적 고찰/);
    if (j) bad(`FAQ 「${m[1]}」 논문 용어 「${j[0]}」 — 쉬운 말로(「시험」「여러 연구를 모아 보니」「회복」「절반이 ~일 안에」)`);
    if ((m[2].match(/연구/g) || []).length > 1) bad(`FAQ 「${m[1]}」 연구 언급이 두 번 이상 — 답과 할 일이 먼저, 연구는 한 번 짧게`);
  }
  const up = entry?.match(/updated:\s*"(\d{4}-\d{2}-\d{2})"/)?.[1];
  if (up && up < "2026-11-18") bad(`원장 updated(${up})가 틀 확정일보다 앞 — 글을 고쳤으면 updated 도 고친다`);
}

const guideDir = path.join(ROOT, "app/injury");
let guides = 0;
for (const slug of readdirSync(guideDir)) {
  const file = path.join(guideDir, slug, "page.tsx");
  if (LIST_PAGES.has(slug) || slug.startsWith("[") || !existsSync(file)) continue;
  guides++;
  if (!ROLLOUT.includes(slug)) errors.push(`app/injury/${slug}: 바꾸는 순서(scripts/check-geo.mjs ROLLOUT)에 없음`);
  const s = readFileSync(file, "utf8");
  const bad = (m) => errors.push(`app/injury/${slug}: ${m}`);
  const faqCount = (s.match(/\bq:\s*["`']/g) || []).length;
  if (!s.includes("<FaqSection")) bad("FAQ(FaqSection) 없음");
  else if (faqCount < 3) bad(`FAQ ${faqCount}문항 — 3문항 이상`);
  if (!s.includes("<ArticleJsonLd")) bad("ArticleJsonLd 없음");
  if (!s.includes("<ArticleMeta")) bad("제목 아래 ArticleMeta(최종 수정 · 작성) 없음");
  const entry = articles.split("\n").find((l) => l.includes(`href: "/injury/${slug}"`));
  if (!entry) bad("원장 lib/guide/articles.ts 에 없음");
  else if (!/updated:\s*"\d{4}-\d{2}-\d{2}"/.test(entry)) bad("원장에 updated 날짜 없음");
  // 2026-11-18 새 틀: 제목 앞 번호 <Num n={1} /> 를 건너뛰고 질문 글자를 본다(없으면 번호에서 끊겨 질문형을 0개로 셌다)
  const h2 = [...s.matchAll(/<h2[^>]*>\s*(?:<Num\b[^>]*\/>\s*)?([^<{]+)/g)].map((m) => m[1].trim());
  const q = h2.filter((h) => QUESTION.test(h)).length;
  if (q === 0 && !DEBT.has(slug)) bad("질문형 소제목(<h2> …?/~나요/~까요) 없음");
  if (q > 0 && DEBT.has(slug)) bad("질문형 소제목이 생겼으니 scripts/check-geo.mjs 의 DEBT 에서 빼세요");
  if (NEW_TEMPLATE.has(slug)) {
    for (const m of MUST) if (!s.includes(m)) bad(`확정 틀 부품 없음: ${m} (docs/운영/가이드_틀.md)`);
    for (const m of BANNED) if (s.includes(m)) bad(`확정 틀에서 뺀 부품이 남음: ${m}`);
    checkTerms(s, bad);
    checkTemplateRules(s, bad, entry);
    {
      const st = s.indexOf("return ("), en = s.indexOf("<Sources");
      const faqT = [...(s.match(/const FAQ[\s\S]*?\n\];/)?.[0] ?? "").matchAll(/[qa]:\s*"([^"]*)"/g)].map((m) => m[1]).join("\n");
      const found = [];
      checkWording(`${st > 0 && en > st ? readable(s.slice(st, en)) : ""}\n${faqT}`.replace(/\*\*/g, ""), (m) => found.push(m));
      if (WORDING_TODO.has(slug)) wordingLeft += found.length ? 1 : 0;
      else found.forEach(bad);
      if (WORDING_TODO.has(slug) && !found.length) errors.push(`app/injury/${slug}: 문장 규칙을 통과했으니 WORDING_TODO 에서 빼세요`);
    }
    // 날짜 줄 「연구 N편과 대조했어요」의 N 은 손으로 적는다 — 출처 개수와 어긋나면 막는다(2026-11-18)
    const checked = s.match(/checked=\{(\d+)\}/);
    const srcs = (s.match(/<Src n=\{/g) || []).length;
    if (!checked) bad("날짜 줄 checked={N}(연구 N편과 대조) 없음");
    else if (Number(checked[1]) !== srcs) bad(`날짜 줄은 연구 ${checked[1]}편인데 출처 목록은 ${srcs}편`);
  }
}

const blogDir = path.join(ROOT, "docs/블로그");
let posts = 0, legacy = 0;
if (existsSync(blogDir)) {
  for (const name of readdirSync(blogDir).filter((n) => POST_RE.test(n.normalize("NFC")))) {
    if (LEGACY_POSTS.has(name.normalize("NFC"))) { legacy++; continue; }
    posts++;
    const s = readFileSync(path.join(blogDir, name), "utf8");
    const bad = (m) => errors.push(`docs/블로그/${name}: ${m}`);
    if (!/최종 수정:\s*\d{4}-\d{2}-\d{2}/.test(s)) bad("「최종 수정: YYYY-MM-DD」 줄 없음");
    if (!/^##\s*자주 묻는 질문/m.test(s)) bad("「## 자주 묻는 질문」 절 없음");
    if (![...s.matchAll(/^#{2,3}\s+(.+)$/gm)].some((m) => QUESTION.test(m[1].trim()))) bad("질문형 소제목 없음");
  }
}

// 추천기와 도구 화면 (2026-11-23, 세션 지시서 4절 5번 — hyun 님 「설문에 이런 것들 다 바꿔야 할 듯 우리 규칙과 알아본 사이트 자료들 보면서」)
// 추천 질문 화면·추천 이유 문구·도구 화면에도 같은 문장 규칙을 건다. 더해서 「확실한 것만 보여 준다」(11-23 결정):
// 「사이트 기준」「근거는 약해요」「연구는 N건」「엇갈려요」 같은 근거 딱지를 화면에 쓰지 않는다.
{
  const screens = [];
  const finder = readFileSync(path.join(ROOT, "app/shoe-finder/page.tsx"), "utf8");
  screens.push(["app/shoe-finder/page.tsx: ", readable(finder.slice(Math.max(0, finder.indexOf("return ("))))]);
  const rec = readFileSync(path.join(ROOT, "lib/shoes/recommend.ts"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  // 2026-11-23: 「내 분석 결과」 문장이 객체 칸(pick·study·text)과 headline·notes 로 옮겨 갔다 — 그 칸도 읽는다(검사가 빈 채로 통과하지 않게)
  // 2026-11-23 ②: 문장이 pick·why 칸과 이어 붙인 조각으로 바뀌어, 「내 분석 결과」를 만드는 구간(flatFinding 부터)은 한글이 든 글자열을 전부 읽는다
  const analysisAt = rec.indexOf("function flatFinding");
  const analysisText = analysisAt < 0 ? "" : [...rec.slice(analysisAt, rec.indexOf("export function rankAll") > analysisAt ? rec.indexOf("export function rankAll") : undefined)
    .matchAll(/"([^"\n]*[가-힣][^"\n]*)"|`([^`]*[가-힣][^`]*)`/g)].map((m) => m[1] ?? m[2]).join("\n");
  const recText = [...rec.matchAll(/(?:reasons|lines|notes)\.push\((["`])([\s\S]*?)\1\)|return "([^"]+)";|genderFitNote = "([^"]+)"|Note: `([^`]+)`/g)]
    .map((m) => m[2] ?? m[3] ?? m[4] ?? m[5]).filter((t) => t && /[가-힣]/.test(t)).join("\n") + "\n" + analysisText;
  for (const must of ["부터 골랐어요", "가장 잘 맞는", "신어 보고 가장 편한", "발바닥 안쪽이 눌리지", "알아 두면 고르기 쉬워요"]) if (!recText.includes(must) && !finder.includes(must)) errors.push(`lib/shoes/recommend.ts(추천 이유): 「${must}」 문장을 못 읽음 — 검사 정규식을 고칠 것`);
  screens.push(["lib/shoes/recommend.ts(추천 이유): ", recText]);
  const cmp = readFileSync(path.join(ROOT, "components/ShoeCompareSpecs.tsx"), "utf8");
  screens.push(["components/ShoeCompareSpecs.tsx(추천 결과·비교 화면): ", readable(cmp.slice(Math.max(0, cmp.indexOf("return ("))))]);
  for (const d of readdirSync(path.join(ROOT, "app/tools"), { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const f = path.join(ROOT, "app/tools", d.name, "page.tsx");
    if (!existsSync(f)) continue;
    const src = readFileSync(f, "utf8");
    screens.push([`app/tools/${d.name}/page.tsx: `, readable(src.slice(Math.max(0, src.indexOf("return ("))))]);
  }
  for (const [where, text] of screens) {
    const bad = (m) => errors.push(`${where}${m}`);
    checkWording(text, bad);
    const m = text.match(/사이트 기준|사이트가 정한 기준|사이트 분류|근거는 약|근거가 약|연구는 \d+건|연구가 갈|엇갈/);
    if (m) bad(`근거 딱지는 화면에 쓰지 않는다(확실한 것만 보여 준다, 11-23): 「…${text.slice(Math.max(0, m.index - 12), m.index + m[0].length + 8).replace(/\n/g, " ")}…」`);
  }
}

// 신발 설명 — 카드 한 줄(blurb)과 설계 특징(scienceBasis) (2026-11-23, 세션 지시서 5절 나 — hyun 님 「과회내 같은 단어 알겠냐고 평범한 사람들이」)
// 쉬운 말 · 사실만 · 「~요」. 전문어는 쓰지 않고 풀어 쓴다(과회내 → 발이 안쪽으로 쏠리는 것, 라스트 → 신발 틀, 드롭 → 앞뒤 굽 차이,
// 스택 → 밑창 두께, 맥시멀 → 쿠션이 아주 두꺼운, 미드솔 → 중간 밑창). 체형으로 사람을 나누는 말과 효과 약속·광고 말도 막는다.
{
  const SHOE_TERMS = ["과회내", "과내전", "회내", "라스트", "스택", "미드솔", "맥시멀", "반발", "드롭", "미드풋", "힐스트라이크", "포어풋", "토박스", "에너지 반환", "러닝 이코노미", "데일리"];
  const BODY = /소형|중형|대형|고체중|저체중|경량 러너|중량 러너|\d+\s*kg\s*\+|체형/;
  const PROMISE = /최적|최강|최고|최상|극대화|끝판왕|1순위|국민|기록 단축|향상|관절 보호|무기|가성비|프리미엄|만능/;
  const fields = [];
  const data = readFileSync(path.join(ROOT, "lib/shoes/data.ts"), "utf8");
  for (const m of data.matchAll(/^\s*(blurb|scienceBasis): "((?:[^"\\]|\\.)*)"/gm)) fields.push([`lib/shoes/data.ts ${m[1]}: `, m[2]]);
  const auto = readFileSync(path.join(ROOT, "lib/shoes/auto.ts"), "utf8");
  for (const m of auto.matchAll(/^\s*(blurb|scienceBasis): `([^`]*)`/gm)) fields.push([`lib/shoes/auto.ts ${m[1]}: `, m[2].replace(/\$\{[^}]*\}/g, "모델")]);
  // 거짓 음성 막기: 읽은 칸 수가 신발 수보다 적으면 정규식이 빠뜨린 것이다
  const count = (data.match(/^\s*id: "/gm) || []).length;
  const got = fields.filter(([w]) => w.startsWith("lib/shoes/data.ts blurb")).length;
  if (got < count) errors.push(`lib/shoes/data.ts: 신발 ${count}켤레인데 설명 칸 ${got}개만 읽음 — 검사 정규식을 고칠 것`);
  if (!fields.some(([w]) => w.startsWith("lib/shoes/auto.ts"))) errors.push("lib/shoes/auto.ts: 설명 틀을 못 읽음 — 검사 정규식을 고칠 것");
  for (const [where, text] of fields) {
    const bad = (m) => errors.push(`${where}${m}`);
    checkWording(text, bad);
    const show = (i, n) => text.slice(Math.max(0, i - 10), i + n + 10);
    for (const t of SHOE_TERMS) { const i = text.indexOf(t); if (i >= 0) bad(`전문어 「${t}」 — 풀어 쓴다: 「…${show(i, t.length)}…」`); }
    for (const [re, msg] of [[BODY, "체형으로 사람을 나누는 말"], [PROMISE, "효과 약속·광고 말"], [/(합니다|입니다|습니다|됩니다|십시오|있음|없음|했다|이다|않았다)(?=[.!?\s]|$)/, "말투는 「~요」"]]) {
      const m = text.match(re); if (m) bad(`${msg}: 「…${show(m.index, m[0].length)}…」`);
    }
  }
}

// 화면 글자 전수 (2026-11-23, 세션 지시서 5절 다 — 「검사 밖 화면 글자 0곳 또는 목록」)
// app·components 의 .tsx 중 한글이 보이는 파일은 셋 중 하나여야 한다. 아니면 실패 — 새 파일이 검사 밖으로 새지 않게.
//   ① 가이드 글(ROLLOUT): 글 틀 검사가 맡는다(위)
//   ② SCREEN_TODO: 아직 안 고친 파일. 이유와 남은 곳을 적는다. 고쳐서 통과하면 「목록에서 빼라」고 실패한다
//   ③ 나머지 전부: 문장 규칙(checkWording) + 「~니다」 + 근거 딱지를 여기서 본다
// 한계(거짓 음성): readable() 은 JSX 글자와 큰따옴표 문자열만 읽는다. 백틱 문자열·.ts 데이터 파일은 못 본다 — 그래서 신발 FAQ(lib/faq.ts)는 따로 읽는다.
{
  const SCREEN_TODO = new Map([
    ["app/injury/page.tsx", "가이드 첫 화면 「~니다」 7곳·딱지 1곳 — 가이드 글 세션(④)"],
    ["components/guide/GuideArticle.tsx", "가이드 공용 부품 「~니다」 2곳 — 가이드 글 세션(④)"],
    ["components/guide/GuideSignals.tsx", "가이드 공용 부품 「~니다」 2곳 — 가이드 글 세션(④)"],
    ["components/guide/LevelCheck.tsx", "가이드 공용 부품 「~니다」 4곳·문장 규칙 2곳 — 가이드 글 세션(④)"],
    ["components/guide/Read.tsx", "가이드 공용 부품 문장 규칙 2곳 — 가이드 글 세션(④)"],
    ["app/tier-list/page.tsx", "「~니다」 44곳, 칸 안내에 근거 없는 효과 문장(「다리를 덜 힘들게」) — 다시 써야 함"],
    ["app/tools/run-30/Run30Client.tsx", "「~니다」 39곳 — 30분 달리기 도구 전체를 다시 써야 함"],
    ["app/tools/run-30/page.tsx", "「~니다」 8곳 — 위와 함께"],
    ["app/courses/page.tsx", "「~니다」 20곳 — 코스 화면"],
    ["components/NearestCourse.tsx", "「~니다」 11곳 — 코스 화면"],
    ["components/CourseVirtualRun.tsx", "「~니다」 7곳 — 코스 화면"],
    ["app/compare/hoka-vs-brooks/page.tsx", "「~니다」 19곳 — 브랜드 비교 글"],
    ["app/races/page.tsx", "「~니다」 4곳 — 대회 화면"],
    ["app/races/masters-half-2026/page.tsx", "「~니다」 6곳 — 대회 화면"],
    ["app/privacy/page.tsx", "법적 문서 — 「~니다」 28곳. 말투를 바꿀지 hyun 님이 정하지 않음"],
    ["app/terms/page.tsx", "법적 문서 — 「~니다」 25곳. 위와 같음"],
    ["app/terms/layout.tsx", "법적 문서 설명 — 위와 같음"],
  ]);
  // 법으로 정해진 문구는 글자 그대로 둔다(쿠팡 파트너스 고지 — components/AffiliateNotice.tsx 주석)
  const VERBATIM = ["이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다."];
  // 신발 화면은 전문어도 막는다(5절 나와 같은 목록). 「앞뒤 굽 차이(드롭)」처럼 괄호 안 풀이는 둔다 — 사람들이 그 말로 검색한다
  const SHOE_SCREENS = new Set(["app/shoes/[id]/page.tsx", "app/shoes/page.tsx", "app/compare/[slug]/page.tsx", "components/ShoesBrowser.tsx",
    "components/ShoeCompareSpecs.tsx", "components/ShoeSideProfile.tsx", "app/tools/shoe-side/ShoeSideTool.tsx", "app/tools/shoe-side/layout.tsx",
    "app/tools/shoe-life/ShoeLifeClient.tsx", "app/tools/shoe-life/layout.tsx", "app/tools/page.tsx", "lib/faq.ts(신발)"]);
  const SHOE_WORDS = /(?<!\()(과회내|과내전|라스트|스택|미드솔|맥시멀|드롭|힐드롭|토박스)/;
  // 「아닙니다」「다릅니다」「세웁니다」도 잡게 「니다」 전체로 본다(2026-11-23 화면에서 확인한 거짓 음성)
  const NIDA = /([가-힣]니다|십시오)(?=[.!?\s"]|$)/;
  const LABEL = /사이트 기준|사이트가 정한 기준|사이트 분류|근거는 약|근거가 약|연구는 \d+건|연구가 갈|엇갈|논문 근거|근거수준/;
  const owned = new Set(ROLLOUT.map((s) => `app/injury/${s}/page.tsx`));
  const walk = (d) => readdirSync(path.join(ROOT, d), { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(`${d}/${e.name}`) : e.name.endsWith(".tsx") ? [`${d}/${e.name}`] : []);
  const units = [];
  for (const f of [...walk("app"), ...walk("components")]) {
    if (owned.has(f)) continue;
    let text = readable(readFileSync(path.join(ROOT, f), "utf8").replace(/^\s*\/\/[^\n]*$/gm, ""));
    for (const v of VERBATIM) text = text.split(v).join("");
    if (!/[가-힣]/.test(text)) continue;
    units.push([f, text]);
  }
  const faq = readFileSync(path.join(ROOT, "lib/faq.ts"), "utf8");
  const shoeFaq = faq.slice(faq.indexOf("export function shoeFaq"));
  units.push(["lib/faq.ts(신발)", [...shoeFaq.matchAll(/[`"]([^`"\n]*[가-힣][^`"\n]*)[`"]/g)].map((m) => m[1].replace(/\$\{[^}]*\}/g, "X")).join("\n")]);
  if (!units.some(([f]) => f === "app/shoe-finder/page.tsx")) errors.push("화면 글자 전수: 추천기 화면을 못 읽음 — 검사가 빈 채로 통과하지 않게 멈춘다");
  for (const [f, text] of units) {
    const found = [];
    checkWording(text, (m) => found.push(m));
    for (const [re, msg] of [[NIDA, "말투는 「~요」"], [LABEL, "근거 딱지는 화면에 쓰지 않는다(11-23)"], ...(SHOE_SCREENS.has(f) ? [[SHOE_WORDS, "전문어 — 풀어 쓴다(앞뒤 굽 차이·밑창 두께·신발 틀·중간 밑창)"]] : [])]) {
      const m = text.match(re); if (m) found.push(`${msg}: 「…${text.slice(Math.max(0, m.index - 14), m.index + m[0].length + 6).replace(/\n/g, " ")}…」`);
    }
    if (SCREEN_TODO.has(f)) { if (!found.length) errors.push(`${f}: 규칙을 통과했으니 SCREEN_TODO 에서 빼세요`); continue; }
    for (const m of found) errors.push(`${f}: ${m}`);
  }
  for (const f of SCREEN_TODO.keys()) if (!units.some(([u]) => u === f)) errors.push(`SCREEN_TODO 의 ${f} 가 없음 — 목록에서 빼세요`);
  // .ts 데이터 파일의 화면 글자 — readable() 이 못 읽는 자리. 「~니다」가 남은 파일을 적어 둔다(고치면 목록에서 빼라고 실패)
  const DATA_TODO = new Map([
    ["lib/guide/articles.ts", "가이드 글 목록 설명 — 가이드 글 세션(④)"],
    ["lib/guide/stages.ts", "단계 데이터 중 todo·title·who 밖의 칸 — 가이드 글 세션(④)"],
    ["lib/faq.ts", "대회 FAQ(raceFaq) — 값 뒤 「이에요/예요」를 고르는 함수가 필요"],
    ["lib/shoes/tiers.ts", "계급도 칸 안내 — app/tier-list 와 함께"],
    ["lib/courses.ts", "코스 설명 — app/courses 와 함께"],
  ]);
  for (const [f] of DATA_TODO) {
    const body = readFileSync(path.join(ROOT, f), "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/[^\n]*$/gm, "");
    if (!/[가-힣]니다/.test(body)) errors.push(`${f}: 「~니다」가 없으니 DATA_TODO 에서 빼세요`);
  }
  console.log(`화면 글자: ${units.length - SCREEN_TODO.size}개 파일 검사 · 아직 안 고침 ${SCREEN_TODO.size}개(SCREEN_TODO) · 가이드 글 ${owned.size}편은 글 틀 검사`);
}

// 글 밖의 자리 — 가이드 첫 화면과 여러 글이 함께 쓰는 단계 데이터(2026-11-20: 여기가 검사 밖이라 「저희 제안」「가장 긴 날」이 남아 있었다)
{
  const hub = readFileSync(path.join(ROOT, "app/injury/page.tsx"), "utf8");
  const hs = hub.indexOf("return (");
  const hubText = readable(hub.slice(hs > 0 ? hs : 0));
  const stages = readFileSync(path.join(ROOT, "lib/guide/stages.ts"), "utf8");
  const stText = [...stages.matchAll(/(?:todo|title|who):\s*"([^"]*)"/g)].map((m) => m[1]).join("\n");
  for (const [where, text] of [["app/injury/page.tsx: ", hubText], ["lib/guide/stages.ts: ", stText]]) {
    const bad = (m) => errors.push(`${where}${m}`);
    checkWording(text, bad);
    for (const [re, msg] of [[/저희 제안|연구로 확인/, "딱지"], [/[가-힣] *→ *[가-힣][^\n]*[.요]/, "문장 속 →"], [/[“”]/, "따옴표"]]) {
      const m = text.match(re); if (m) bad(`${msg}: 「…${text.slice(Math.max(0, m.index - 10), m.index + 16).replace(/\n/g, " ")}…」`);
    }
    if (where.startsWith("lib")) { const m = text.match(/(합니다|입니다|습니다|됩니다)(?=[.!?\s]|$)/); if (m) bad(`말투는 「~요」: 「…${text.slice(Math.max(0, m.index - 14), m.index + 6)}…」`); }
  }
}

if (errors.length) {
  console.error(`글 구조 검사 실패 ${errors.length}건 (규칙: docs/운영/가이드_틀.md)`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
const next = ROLLOUT.find((x) => !NEW_TEMPLATE.has(x) && !HOLD.has(x));
console.log(`가이드 새 틀 ${NEW_TEMPLATE.size}/${ROLLOUT.length}편 · 문장 고칠 글 ${WORDING_TODO.size}편 · FAQ 고칠 글 ${FAQ_TODO.size}편 · 보류 ${HOLD.size}편${next ? ` · 다음: ${next}` : " · 남은 글 없음"}`);
for (const x of NEW_TEMPLATE) if (HOLD.has(x)) errors.length || console.error(`참고: ${x} 는 새 틀로 바꿨으니 HOLD 에서 빼세요`);
console.log(`글 구조: 가이드 ${guides}편 · 새 블로그 원고 ${posts}편 통과 (질문형 소제목 보강 대기 ${DEBT.size}편 · 규칙 이전 원고 ${legacy}편 제외)`);
