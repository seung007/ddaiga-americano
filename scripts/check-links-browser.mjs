#!/usr/bin/env node
/**
 * 구매 링크 · 대회 공식 링크를 **진짜 브라우저로 열어서** 판정한다 — 한국 PC 에서 돌리는 검사기.
 *
 *   npm run check:links:kr                 전부 (신발 구매 링크 + 다가오는 대회 공식 링크)
 *   npm run check:links:kr -- --shoes      신발만        --races   대회만
 *   npm run check:links:kr -- --only=nbkorea.com       한 도메인만
 *   npm run check:links:kr -- --headed                 창을 띄워서 (눈으로 보고 싶을 때)
 *   npm run check:links:kr -- --selftest               판정 함수 오프라인 시험 (브라우저 없음)
 *
 * 결과: outputs/link-check-kr.json (Claude 가 읽는다) · outputs/link-check-kr.html (사람이 본다)
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 만들었나 (2026-09-28)
 *
 * 링크 확인이 이 저장소의 가장 큰 병목이었다. 세 겹으로 막혀 있었다.
 *   1) **Claude 샌드박스·PC 의 Claude VM 은 프록시가 외부를 막는다.** `check:links` 를 돌리면 781개가 전부
 *      「죽음」으로 나온다. 링크가 아니라 관측 환경이 죽은 것이다(AGENTS.md 판단 전 3문 ①).
 *   2) **GitHub Actions(미국)는 한국 사이트 일부가 막는다.** 김대중·과천·한강시민 대회 사이트가
 *      해외에서 시간초과, 한국 Chrome 에서는 정상이었다.
 *   3) **상태코드는 200 인데 찾던 모델이 없다** — `check:links` 가 스스로 「못 본다」고 적어 둔 자리.
 *      온·뉴발란스 공식몰은 JS 로 그려서 HTML 에는 상품이 없다.
 *   그래서 지금까지는 Claude 가 크롬 확장으로 한 페이지씩 열었다. 링크 400개면 400번 왕복이다.
 *
 * 이 스크립트는 셋을 한 번에 없앤다: **한국 IP · 진짜 Chrome · 글자로 판정.**
 * 사람 PC 에서 한 명령으로 8분, 결과는 JSON 으로 남아 Claude 가 한 번에 읽는다.
 *
 * ⚠️ 하지 않는 것
 *   · **쿠팡은 열지 않는다.** 봇 차단(Akamai)이라 우회가 필요하고, 우회는 하지 않기로 했다(affiliate.ts).
 *     쿠팡은 `npm run check:affiliate:sheet` 로 사람이 본다.
 *   · 데이터를 자동으로 고치지 않는다. 가격은 「후보」만 보여준다 — 할인가·다른 색상 값이 섞인다.
 *   · 판정이 확실하지 않으면 「모델없음(사람 확인)」으로 올린다. 오탐은 별칭(aliases.ts)을 늘려서 줄인다.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { compact, modelSpec, hasModel, parseAliases, judgeShoePage, judgeRacePage, isRefusal } from "./lib/link-judge.mjs";

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "outputs");
const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n) => args.find((a) => a.startsWith(`--${n}=`))?.split("=")[1];

const C = {
  red: (s) => `\x1b[31m${s}\x1b[0m`, green: (s) => `\x1b[32m${s}\x1b[0m`, yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`, bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

const aliases = parseAliases(readFileSync(join(ROOT, "lib/shoes/aliases.ts"), "utf8"));

// ── 판정 함수 오프라인 시험 ─────────────────────────────────
if (flag("selftest")) {
  const cases = [
    // [모델, 페이지 글자, 기대]
    ["Clifton 10", "호카 (남성) 클리프톤 10 - 세이지:네온 플레임 199,000원", true],
    ["Clifton 10", "호카 (남성) 클리프톤 9 - 블랙 159,000원", false],
    ["Gel-Kayano 32", "젤 카야노 32 199,000원", true],
    ["GT-2000 14", "GT-2000 15 159,000원", false],
    ["GT-2000 15", "GT-2000 15 159,000원", true],
    ["Fresh Foam X 1080 v15", "뉴발란스 프레시폼 1080 v15 229,000원", true],
    ["Fresh Foam X More v6", "Fresh Foam X More v6 209,000원", true],
    ["Pegasus Plus", "나이키 페가수스 플러스 219,000 원", true],
    ["Revolution 7", "나이키 레볼루션 8 89,000 원", false],
    ["Wave Rebellion Pro 3", "웨이브 리벨리온 프로 3 259,000원", true],
    ["Adizero Boston 13", "아디제로 보스턴 13 러닝화 189,000 원", true],
    ["Rocket X 2", "호카 로켓 X 2 레티스 솔라", true],
    ["Ghost Max 4", "브룩스 고스트 맥스 4 189,000원", true],
    ["Cloudsurfer Max", "Cloudsurfer Max 남성 ₩219,000", true],
  ];
  let bad = 0;
  for (const [model, text, want] of cases) {
    const got = hasModel(compact(text), modelSpec(model, aliases));
    if (got !== want) { bad++; console.log(C.red(`✗ ${model} ← "${text}" → ${got} (기대 ${want})`)); }
  }
  const zero = judgeShoePage({ ok: true, status: 200, url: "x", text: `"큐뮬러스28"에 대한 검색결과 입니다. 검색 결과 0개 검색결과가 없습니다. ${"여백 ".repeat(150)}` }, { model: "Gel-Cumulus 28" }, aliases);
  if (zero.verdict !== "0건") { bad++; console.log(C.red(`✗ 0건 판정 → ${zero.verdict}`)); }
  const repl = judgeShoePage({ ok: true, status: 200, url: "x", text: `레볼루션 8 89,000 원 ${"여백 ".repeat(150)}` }, { model: "Revolution 7", successor: "Revolution 8" }, aliases);
  if (repl.verdict !== "후속작만") { bad++; console.log(C.red(`✗ 후속작 판정 → ${repl.verdict}`)); }
  const rule = judgeRacePage({ ok: true, status: 200, text: "제21회 울산 인권마라톤 2026 접수마감 후 참가비는 환불되지 않습니다" }, { name: "제21회 울산 인권마라톤", date: "2026-11-01" }, "접수중");
  if (rule.verdict !== "ok") { bad++; console.log(C.red(`✗ 규정 문장을 마감으로 읽음 → ${rule.verdict}`)); }
  const closed = judgeRacePage({ ok: true, status: 200, text: "2026 대청호 오백리길 걷기대회 모집 마감되었습니다" }, { name: "2026 대청호 오백리길 걷기대회", date: "2026-10-31" }, "접수중");
  if (closed.verdict !== "마감문구") { bad++; console.log(C.red(`✗ 마감 문구 놓침 → ${closed.verdict}`)); }
  // 2026-09-28 첫 실행에서 나온 두 가지 — 헤드리스 거절을 「죽음」으로, 홈으로 튕긴 검색을 「ok」로 읽으면 안 된다
  const refusal = judgeShoePage({ ok: false, url: "https://kream.co.kr/search?keyword=x", error: "page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at https://kream.co.kr/" }, { model: "Clifton 10" }, aliases);
  if (refusal.verdict !== "차단") { bad++; console.log(C.red(`✗ 거절을 ${refusal.verdict} 로 읽음`)); }
  const bounce = judgeShoePage({ ok: true, status: 200, url: "https://saucony.co.kr/product/search.html?keyword=%ED%8A%B8%EB%9D%BC%EC%9D%B4%EC%97%84%ED%94%84", finalUrl: "https://saucony.co.kr/", text: `남성 트라이엄프 24 209,000원 ${"여백 ".repeat(150)}` }, { model: "Triumph 24" }, aliases);
  if (bounce.verdict !== "죽음") { bad++; console.log(C.red(`✗ 홈으로 튕긴 검색을 ${bounce.verdict} 로 읽음`)); }
  // 두 번째 실행에서 나온 것 — 알림창 0건, 세 글자 한글 이름, 상품명이 검색어와 같은 KREAM
  const alertZero = judgeShoePage({ ok: true, status: 200, url: "https://brooksrunning.co.kr/product/search.html?keyword=x", finalUrl: "about:blank", text: "", dialog: "검색결과가 없습니다." }, { model: "Beast 24" }, aliases);
  if (alertZero.verdict !== "0건") { bad++; console.log(C.red(`✗ 알림창 0건 → ${alertZero.verdict}`)); }
  const journey = judgeShoePage({ ok: true, status: 200, url: "https://www.nike.com/kr/w?q=%EC%A0%80%EB%8B%88%20%EB%9F%B0", title: "제품. 나이키 코리아", text: `검색결과: 저니 런 (6) 나이키 저니 런 남성 로드 러닝화 119,000 원 ${"여백 ".repeat(150)}` }, { model: "Journey Run" }, aliases);
  if (journey.verdict !== "ok") { bad++; console.log(C.red(`✗ 저니 런 → ${journey.verdict}`)); }
  const kream = judgeShoePage({ ok: true, status: 200, url: "https://kream.co.kr/search?keyword=%EC%95%84%EB%94%94%EB%8B%A4%EC%8A%A4%20%EC%8A%88%ED%8D%BC%EB%85%B8%EB%B0%94%20%ED%94%84%EB%A6%AC%EB%A7%88%203", title: "아디다스 슈퍼노바 프리마 3 추천 상품 시세 확인 | KREAM", text: `Adidas 아디다스 슈퍼노바 프리마 3 코어 블랙 클라우드 화이트 159,000원 ${"여백 ".repeat(150)}` }, { model: "Supernova Prima 3" }, aliases);
  if (kream.verdict !== "ok") { bad++; console.log(C.red(`✗ KREAM 상품명=검색어 → ${kream.verdict}`)); }
  console.log(bad ? C.red(`\n자체 시험 ${bad}건 실패`) : C.green(`자체 시험 통과 (${cases.length + 9}건)`));
  process.exit(bad ? 1 : 0);
}

// ── 대상 모으기 ────────────────────────────────────────────
/** data.ts 에서 신발별 id·model·successor·priceKrw·buyLinks 만 뽑는다 (유튜브 리뷰 링크는 제외) */
function loadShoes() {
  const text = readFileSync(join(ROOT, "lib/shoes/data.ts"), "utf8");
  const idRe = /id:\s*"([^"]+)",\s*\n\s*brand:\s*"([^"]+)",\s*\n\s*model:\s*"([^"]+)",/g;
  const marks = [...text.matchAll(idRe)];
  return marks.map((m, i) => {
    const chunk = text.slice(m.index, i + 1 < marks.length ? marks[i + 1].index : text.length);
    const buy = chunk.match(/buyLinks:\s*\[([\s\S]*?)\n\s*\],/)?.[1] ?? "";
    return {
      id: m[1], brand: m[2], model: m[3],
      successor: chunk.match(/successor:\s*"([^"]+)"/)?.[1] ?? null,
      priceKrw: Number(chunk.match(/priceKrw:\s*(\d+)/)?.[1] ?? 0),
      links: [...buy.matchAll(/\{\s*label:\s*"([^"]*)",\s*url:\s*"([^"]+)"/g)].map((x) => ({ label: x[1], url: x[2] })),
    };
  });
}

function todayKst() {
  return new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
}
/** lib/races.ts 의 currentStatus 와 같은 규칙 (마감임박 = 7일 이내) */
function displayStatus(r, today) {
  if (r.registrationEnd) {
    if (r.registrationEnd < today) return "마감";
    if (r.registrationStart && r.registrationStart > today) return "접수예정";
    const left = Math.round((Date.parse(r.registrationEnd) - Date.parse(today)) / 864e5);
    return left <= 7 ? "마감임박" : "접수중";
  }
  if (r.registrationStart && r.registrationStart > today) return "접수예정";
  return r.status;
}

const domainOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return "?"; } };
const SKIP = {
  "coupang.com": "봇 차단 — 우회하지 않음. check:affiliate:sheet 로 사람이 본다",
  "link.coupang.com": "쿠팡 제휴 링크 — 위와 같음",
  // 2026-09-28: 헤드리스는 403, 창 모드도 자동화 브라우저라 빈 화면(55자). 사람 Chrome 으로는 열린다(같은 날 확인).
  // 자동화 흔적을 숨기는 건 우회라서 하지 않는다 — 아디다스는 사람이 본다
  "adidas.co.kr": "자동화 브라우저 차단 — 사람 Chrome 으로는 열림. 우회하지 않음",
};
/** 가격 후보를 뽑을 곳 — 한국 공식몰(+ 공식몰이 없는 호카의 무신사) */
const PRICE_DOMAINS = new Set(["asics.co.kr", "nike.com", "adidas.co.kr", "nbkorea.com", "kr.puma.com", "on.com",
  "saucony.co.kr", "kor.mizuno.com", "brooksrunning.co.kr", "decathlon.co.kr", "musinsa.com"]);

const today = todayKst();
const tasks = [];
if (!flag("races")) {
  for (const s of loadShoes()) for (const l of s.links) tasks.push({ kind: "shoe", url: l.url, label: l.label, shoe: s });
}
if (!flag("shoes")) {
  const races = JSON.parse(readFileSync(join(ROOT, "lib/races.json"), "utf8"));
  for (const r of races) {
    if (!r.officialUrl || (r.date && r.date < today)) continue;
    tasks.push({ kind: "race", url: r.officialUrl, label: r.officialKind ?? "공식", race: r, status: displayStatus(r, today) });
  }
}
const only = opt("only");
const todo = tasks.filter((t) => !only || domainOf(t.url).includes(only));

// 같은 URL 은 한 번만 연다 (온 남성 신발 목록 하나를 신발 6개가 같이 쓴다)
const byUrl = new Map();
for (const t of todo) {
  if (SKIP[domainOf(t.url)]) continue;
  if (!byUrl.has(t.url)) byUrl.set(t.url, []);
  byUrl.get(t.url).push(t);
}

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.log(C.red("\nplaywright 가 없습니다: npm i  (devDependency 에 이미 있음)\n"));
  process.exit(2);
}

/**
 * 설치된 Chrome 을 먼저 쓴다 — 브라우저를 따로 내려받지 않아도 된다.
 * 없으면 Playwright 가 받아 둔 Chromium. 둘 다 없으면 한 줄로 안내하고 멈춘다.
 */
async function launch() {
  const headless = !flag("headed");
  try { return await chromium.launch({ channel: "chrome", headless }); } catch {}
  try { return await chromium.launch({ headless }); } catch (e) {
    console.log(C.red("\nChrome 도 Playwright Chromium 도 못 띄웠습니다. 한 번만:  npx playwright install chromium\n"));
    console.log(C.dim(String(e.message).split("\n")[0]));
    process.exit(2);
  }
}

console.log(C.bold(`\n브라우저 링크 검사 — 여는 주소 ${byUrl.size}개 (링크 ${todo.length}개, 쿠팡 ${todo.filter((t) => SKIP[domainOf(t.url)]).length}개는 건너뜀)\n`));
const browser = await launch();
const context = await browser.newContext({
  locale: "ko-KR", timezoneId: "Asia/Seoul", viewport: { width: 1280, height: 900 },
});

/** 한 주소를 연다. 실패 메시지는 첫 줄만 남기되 원인(코드)은 지우지 않는다 (AGENTS.md: e.name 만 찍지 마라) */
async function visit(url) {
  const page = await context.newPage();
  // 카페24 쇼핑몰은 검색 결과가 없으면 alert() 를 띄운다 — 닫고 문구를 판정에 넘긴다 (브룩스 비스트 24, 2026-09-28)
  let dialog = null;
  page.on("dialog", (d) => { dialog = d.message(); d.dismiss().catch(() => {}); });
  try {
    const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => {});
    // 늦게 그리는 목록(온·무신사)을 위해 세 번 내려 본다
    for (let i = 0; i < 3; i++) {
      await page.mouse.wheel(0, 2500).catch(() => {});
      await page.waitForTimeout(600);
    }
    let text = await page.evaluate(() => document.body?.innerText ?? "").catch(() => "");
    // 본문이 거의 비었으면 한 번 더 기다린다 — 첫 실행에서 브룩스 한 곳이 about:blank 0자로 잡혔다
    if (text.trim().length < 200) {
      await page.waitForTimeout(3000);
      text = await page.evaluate(() => document.body?.innerText ?? "").catch(() => "");
    }
    return { ok: true, status: res?.status() ?? 0, url, finalUrl: page.url(), title: await page.title().catch(() => ""), text, dialog };
  } catch (e) {
    if (dialog) return { ok: true, status: 200, url, finalUrl: url, title: "", text: "", dialog };
    return { ok: false, url, error: String(e.message ?? e).split("\n")[0].slice(0, 200) };
  } finally {
    await page.close().catch(() => {});
  }
}

/**
 * 먼저 **관측 환경이 살아 있는지** 본다. 프록시에 막힌 곳(Claude 샌드박스·Claude VM)에서 돌리면
 * 모든 링크가 「죽음」으로 나오는데, 그건 링크가 아니라 환경이 죽은 것이다 — check:links 가 781개를
 * 전부 죽음으로 찍었던 실수를 되풀이하지 않는다 (AGENTS.md 판단 전 3문 ①).
 */
{
  const probe = await visit("https://www.naver.com/");
  if (!probe.ok || probe.status >= 400) {
    console.log(C.red(`\n이 환경에서는 바깥 사이트가 안 열립니다 — ${probe.error ?? `HTTP ${probe.status}`}`));
    console.log(C.dim("링크가 죽은 게 아니라 관측 환경이 막힌 것입니다. 한국 PC 의 PowerShell 에서 돌리세요:  npm run check:links:kr\n"));
    await browser.close();
    process.exit(2);
  }
}

// 도메인마다 한 번에 하나씩, 도메인 사이는 병렬 — 남의 서버를 몰아서 두드리지 않는다
const byDomain = new Map();
for (const url of byUrl.keys()) {
  const d = domainOf(url);
  if (!byDomain.has(d)) byDomain.set(d, []);
  byDomain.get(d).push(url);
}
const pages = new Map();
let done = 0;
const total = byUrl.size;
const queues = [...byDomain.values()];
async function worker() {
  while (queues.length) {
    const q = queues.shift();
    for (const url of q) {
      pages.set(url, await visit(url));
      done++;
      if (done % 20 === 0 || done === total) process.stdout.write(C.dim(`  ${done}/${total}\n`));
      await new Promise((r) => setTimeout(r, 800));
    }
  }
}
await Promise.all(Array.from({ length: Math.min(4, queues.length) }, worker));
await browser.close();

/**
 * 거절당한 주소는 **창을 띄운 Chrome** 으로 한 번 더 연다 — 사람이 여는 것과 같은 조건.
 * 첫 실행(2026-09-28)에서 KREAM 101개·아디다스 7개가 헤드리스에서만 거절됐다. 사람 Chrome 에서는 열렸다.
 * 이건 우회가 아니다: 사용자 PC 의 보통 브라우저로, 한 곳씩 1.5초 간격으로 연다. 여기서도 거절되면 진짜 차단으로 둔다.
 * CI(러너 서비스)에는 화면이 없어서 건너뛴다. `--no-retry` 로 끌 수 있다.
 */
const refused = [...pages.entries()].filter(([, p]) => isRefusal(p)).map(([u]) => u);
if (refused.length && !flag("no-retry") && !flag("headed") && !process.env.CI) {
  console.log(C.dim(`\n거절된 ${refused.length}개를 창을 띄운 Chrome 으로 다시 엽니다 (창이 잠깐 뜹니다)…`));
  const b2 = await chromium.launch({ channel: "chrome", headless: false }).catch(() => chromium.launch({ headless: false }));
  const c2 = await b2.newContext({ locale: "ko-KR", timezoneId: "Asia/Seoul", viewport: { width: 1280, height: 900 } });
  let fixed = 0;
  for (const url of refused) {
    const pg = await c2.newPage();
    let dialog = null;
    pg.on("dialog", (d) => { dialog = d.message(); d.dismiss().catch(() => {}); });
    try {
      const res = await pg.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
      await pg.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => {});
      await pg.waitForTimeout(800);
      const text = await pg.evaluate(() => document.body?.innerText ?? "").catch(() => "");
      const p = { ok: true, status: res?.status() ?? 0, url, finalUrl: pg.url(), title: await pg.title().catch(() => ""), text, dialog, retried: "headed" };
      if (!isRefusal(p)) { pages.set(url, p); fixed++; }
    } catch (e) {
      /* 그대로 차단으로 둔다 */
    } finally {
      await pg.close().catch(() => {});
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  await b2.close();
  console.log(C.dim(`  → ${fixed}/${refused.length}개가 창 모드에서 열림`));
}

// ── 판정 ─────────────────────────────────────────────────
const results = [];
for (const t of todo) {
  const d = domainOf(t.url);
  if (SKIP[d]) { results.push({ ...slim(t), verdict: "건너뜀", note: SKIP[d] }); continue; }
  const p = pages.get(t.url);
  const j = t.kind === "shoe"
    ? judgeShoePage(p, t.shoe, aliases, { wantPrice: PRICE_DOMAINS.has(d) })
    : judgeRacePage(p, t.race, t.status);
  const r = { ...slim(t), ...j, httpStatus: p.status ?? null, finalUrl: p.finalUrl && p.finalUrl !== t.url ? p.finalUrl : undefined, retried: p.retried };
  if (t.kind === "shoe" && j.prices?.length && t.shoe.priceKrw && !j.prices.includes(t.shoe.priceKrw)) {
    r.priceFlag = `DB ${t.shoe.priceKrw.toLocaleString()} · 페이지 후보 ${j.prices.map((n) => n.toLocaleString()).join(" / ")}`;
  }
  results.push(r);
}
function slim(t) {
  return t.kind === "shoe"
    ? { kind: "shoe", id: t.shoe.id, name: `${t.shoe.brand} ${t.shoe.model}`, label: t.label, url: t.url }
    : { kind: "race", id: t.race.id, name: t.race.name, label: t.label, url: t.url, ourStatus: t.status };
}

const PROBLEM = ["죽음", "0건", "모델없음", "후속작만", "차단", "마감문구", "대회명없음", "연도없음"];
const count = (v) => results.filter((r) => r.verdict === v).length;
const summary = Object.fromEntries(["ok", "목록형", ...PROBLEM, "건너뜀"].map((v) => [v, count(v)]));
summary["가격다름"] = results.filter((r) => r.priceFlag).length;

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "link-check-kr.json"), JSON.stringify({ generatedAt: new Date().toISOString(), summary, results }, null, 2));
writeFileSync(join(OUT_DIR, "link-check-kr.html"), html(results, summary));

// ── 출력: 문제만 ────────────────────────────────────────────
console.log(C.bold("\n결과"));
console.log(Object.entries(summary).filter(([, n]) => n).map(([k, n]) => `${k} ${n}`).join(" · "));
const problems = results.filter((r) => PROBLEM.includes(r.verdict) || r.priceFlag);
for (const r of problems.slice(0, 40)) {
  const tag = r.priceFlag && r.verdict === "ok" ? C.yellow("가격?") : ["죽음", "0건"].includes(r.verdict) ? C.red(r.verdict) : C.yellow(r.verdict);
  console.log(`  ${tag} ${r.name} — ${r.label} ${C.dim(r.note ?? r.priceFlag ?? "")}`);
  if (r.seen?.length) console.log(C.dim(`      보인 것: ${r.seen.slice(0, 3).join(" · ")}`));
}
if (problems.length > 40) console.log(C.dim(`  … ${problems.length - 40}건 더 — outputs/link-check-kr.html`));
console.log(C.dim(`\noutputs/link-check-kr.json · outputs/link-check-kr.html\n`));
process.exit(count("죽음") + count("0건") > 0 ? 1 : 0);

function html(rows, sum) {
  const e = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const order = (r) => (PROBLEM.includes(r.verdict) ? PROBLEM.indexOf(r.verdict) : r.priceFlag ? 50 : 99);
  const body = [...rows].sort((a, b) => order(a) - order(b)).map((r) => `<tr class="${PROBLEM.includes(r.verdict) ? "bad" : r.priceFlag ? "warn" : ""}">
<td>${e(r.verdict)}</td><td>${e(r.name)}</td><td><a href="${e(r.url)}" target="_blank" rel="noopener">${e(r.label)}</a></td><td>${e(r.note ?? "")}${r.priceFlag ? `<br><b>${e(r.priceFlag)}</b>` : ""}${r.seen?.length ? `<br><small>보인 것: ${e(r.seen.join(" · "))}</small>` : ""}</td></tr>`).join("\n");
  return `<!doctype html><meta charset="utf-8"><title>링크 검사 (한국 Chrome)</title>
<style>body{font:14px system-ui,sans-serif;margin:24px;color:#111}table{border-collapse:collapse;width:100%}td{border-bottom:1px solid #ddd;padding:6px 8px;vertical-align:top}
tr.bad td:first-child{color:#b91c1c;font-weight:700}tr.warn td:first-child{color:#b45309;font-weight:700}a{color:#1d4ed8}</style>
<h1>링크 검사 — ${e(new Date().toLocaleString("ko-KR"))}</h1>
<p>${Object.entries(sum).map(([k, n]) => `${e(k)} <b>${n}</b>`).join(" · ")}</p>
<p>문제가 위에 온다. 「모델없음」은 판정이 보수적이라 사람이 눌러 보고, 오탐이면 lib/shoes/aliases.ts 에 한글 표기를 더한다.</p>
<table>${body}</table>`;
}
