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
 * 2026-11-18 확정 틀(AGENTS.md 「가이드 글 틀」)로 바꾼 글. 롤아웃하면서 한 편씩 넣는다 — 다 넣으면 이 목록을 없애고 전체에 적용한다.
 * 들어 있으면: 틀 부품이 다 있어야 하고(MUST), 옛 부품(딱지·접힘·[n])이 남아 있으면 안 된다(BANNED).
 */
const NEW_TEMPLATE = new Set(["start-running", "return-to-running", "half-marathon-training", "training-types", "beginner-guide", "shin-splints", "knee-pain", "warmup", "cooldown", "posture"]);
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
  ["hwang-young-jo", "인물 글 — 이야기 글에 질문형 틀을 씌울지 hyun 님이 정하지 않음"],
  ["kwon-eun-ju", "인물 글 — 위와 같음"],
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
    for (const [t, i] of found) if (!defined(text, i, t)) bad(`${where}: 「${t}」 처음 나오는 곳에 풀이 없음 — 괄호 풀이, 「…은/는 ~예요」, 「…라고 해요」 중 하나로 (AGENTS.md 「가이드 글 틀」)`);
  }
}

/**
 * 틀 규칙 중 기계로 셀 수 있는 것 전부 (2026-11-18, hyun 님: 「정한 규칙이 강제로 다 적용되게」).
 * AGENTS.md 「가이드 글 틀」의 줄마다 하나씩. 못 세는 것(말의 세기·한 문단 한 내용·요약이 사람 말인지)은 여기 없다 — 사람과 화면 비교가 본다.
 */
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
  // FAQ 가 큰 질문과 같은 질문이면 본문 반복이다(견본에서 5문항 중 3개가 겹쳐 글이 길게 읽혔다)
  const norm = (t) => t.replace(/[\s?.,!]/g, "");
  const h2q = [...body.matchAll(/<Num\b[^>]*\/>\s*([^<{]+)/g)].map((m) => norm(m[1]));
  for (const m of faq.matchAll(/q:\s*"([^"]*)"/g)) if (h2q.includes(norm(m[1]))) bad(`FAQ 「${m[1]}」가 큰 질문과 같은 질문 — 한 곳에만`);
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
    for (const m of MUST) if (!s.includes(m)) bad(`확정 틀 부품 없음: ${m} (AGENTS.md 「가이드 글 틀」)`);
    for (const m of BANNED) if (s.includes(m)) bad(`확정 틀에서 뺀 부품이 남음: ${m}`);
    checkTerms(s, bad);
    checkTemplateRules(s, bad, entry);
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

if (errors.length) {
  console.error(`글 구조 검사 실패 ${errors.length}건 (규칙: AGENTS.md 「새 글·페이지 규칙」)`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
const next = ROLLOUT.find((x) => !NEW_TEMPLATE.has(x) && !HOLD.has(x));
console.log(`가이드 새 틀 ${NEW_TEMPLATE.size}/${ROLLOUT.length}편 · 보류 ${HOLD.size}편${next ? ` · 다음: ${next}` : " · 남은 글 없음"}`);
for (const x of NEW_TEMPLATE) if (HOLD.has(x)) errors.length || console.error(`참고: ${x} 는 새 틀로 바꿨으니 HOLD 에서 빼세요`);
console.log(`글 구조: 가이드 ${guides}편 · 새 블로그 원고 ${posts}편 통과 (질문형 소제목 보강 대기 ${DEBT.size}편 · 규칙 이전 원고 ${legacy}편 제외)`);
