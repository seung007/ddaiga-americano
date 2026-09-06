#!/usr/bin/env node
/**
 * 구매 링크 검사 — 406개가 실제로 살아 있는지 본다.
 *
 * 왜 만들었나 (2026-09-06)
 * ───────────────────────
 * `AGENTS.md`가 **스스로 사각지대라고 적어둔 자리**다 —
 * "구매 링크가 실제로 결과를 반환하는지 (단종 27종은 브랜드몰 검색이 빈 결과일 수 있다)".
 *
 * 이게 돈과 가장 가까운 구멍이다. 링크가 죽어 있으면 `buy_link_click`을 아무리 세도
 * 의미가 없다. 그리고 **조용히 실패하는 종류**다 — 404가 아니라 200에 빈 결과가 뜬다.
 *
 * 무엇을 보나 / 못 보나
 * ────────────────────
 * **본다**
 *   · HTTP 상태 (4xx·5xx·타임아웃)
 *   · 리다이렉트 최종 도착지 (엉뚱한 곳으로 가는지)
 *   · 링크 구성 — 검색쿼리형 vs 직링크 비율, 단종 신발이 검색형에 몰려 있는지
 *
 * **못 본다**
 *   · **200인데 사용자가 찾던 모델이 없는 경우.** 이건 사람이 봐야 한다.
 *     그래서 이 검사기는 **확인해야 할 자리를 좁혀주는 것까지**가 범위다.
 *
 * ⚠️ 처음 세운 가설이 틀렸다 (2026-09-06, 브라우저로 9곳 전부 확인)
 * ────────────────────────────────────────────────────────────
 * **이전 주장**: 단종 모델을 검색하면 브랜드몰에서 **빈 결과(0건)**가 나올 것이다.
 *
 * **반대 증거**: 9곳을 눌러보니 0건은 두 곳뿐이었고, 나머지는 서로 다른 방식으로 달랐다.
 *   · nike.com  `q=레볼루션 7`  → 4건. 그런데 **전부 "레볼루션 8"**. 후속작으로 대체된다.
 *   · brooksrunning.co.kr `keyword=고스트 17` → 16건, **전부 [OUTLET] 고스트 17**. 할인가다.
 *   · search.danawa.com·kream.co.kr → 가격비교/리셀이라 단종품이 **더 잘** 남아 있다.
 *   · adidas.co.kr → 결과가 하나면 **상품 페이지로 바로 리다이렉트**된다. 가장 좋은 형태다.
 *
 * **더 큰 것이 걸렸다 — 가설과 무관하게 URL 자체가 틀린 곳이 3곳 있었다.**
 *   · fleetrunner.co.kr  `/search?keyword=`      → 404 "요청하신 페이지를 찾을 수 없습니다"
 *   · 29cm.co.kr         `/search?keyword=`      → "페이지가 삭제되었거나 변경됐어요"
 *   · www.mizuno.com/ko-kr/search?q=             → corp.mizuno.com(일본 기업사이트)으로 튕김
 *   17개 링크가 **단종 여부와 상관없이** 전부 죽어 있었다. 이 검사기의 위험 큐는
 *   "단종 × 검색형 × 세대번호"만 봤기 때문에 셋 중 어느 조건도 안 걸린 링크를 놓쳤다.
 *   → **경로가 틀린 링크는 단종보다 흔하고 더 치명적이다.** 그래서 아래 `VERIFIED`에
 *     쇼핑몰별로 **사람이 눌러본 URL 형태**를 적어두고, 그 형태에서 벗어나면 잡는다.
 *
 * **새 결론**: 위험은 세 층이다.
 *   1) **URL 형태가 틀렸다** — 자동 판정 가능. `VERIFIED` 대장으로 잡는다.
 *   2) **결과가 0건이다** — 도메인 성질. 사람이 한 번 확인하면 나머지에 그대로 적용된다.
 *   3) **결과는 있는데 다른 모델이다** — 사람이 볼 수밖에 없다.
 *
 * 그러므로 이 검사기를 "죽은 링크 탐지기"로 쓰지 마라.
 * **쇼핑몰별 성질을 사람이 한 번 확인하게 만들고, 그 확인을 기억하는 도구**다.
 *
 * 자동화할 수 없는 것을 자동화한 척하지 않는다. `check:shoes`와 같은 원칙이다.
 *
 *   npm run check:links            상태 조회 (네트워크 필요)
 *   npm run check:links -- --plan  네트워크 없이 구성만 분석하고 확인 큐를 뽑는다
 *
 * 죽은 링크가 하나라도 있으면 exit 1.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DATA = path.join(ROOT, "lib", "shoes", "data.ts");

const args = new Set(process.argv.slice(2));
const PLAN_ONLY = args.has("--plan");

/** 동시 요청 수. 쇼핑몰에 부담 주지 않도록 낮게 */
const CONCURRENCY = 4;
const TIMEOUT_MS = 12_000;

const C = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

/**
 * 쇼핑몰 대장 — **사람이 브라우저로 직접 눌러본 결과만** 적는다.
 *
 * `check:shoes`의 `verified.json`과 같은 발상이다. 자동으로 알 수 없는 것을
 * 사람이 한 번 확인하고, 그 확인을 날짜와 함께 남긴다.
 *
 *   shape    확인된 URL 형태. 링크가 이 정규식에 안 맞으면 **경로가 틀린 것**이다.
 *            2026-09-06에 이걸로 17개를 찾았다. 추측으로 적지 마라 — 눌러본 것만.
 *   nature   단종 모델을 검색했을 때 이 쇼핑몰이 보이는 성질
 *   note     사람에게 남기는 한 줄
 */
const VERIFIED = {
  "coupang.com":          { date: null,         shape: /\/np\/search\?q=/,                 nature: "미확인", note: "안전 정책상 브라우저로 열 수 없었다. 확인 못 함" },
  "asics.co.kr":          { date: "2026-09-06", shape: /\/(goods\/search\?search_text=|c\/)/, nature: "남아있음", note: "젤 카야노 79건, 사이즈까지 노출. 카테고리형(/c/…)도 정상" },
  "decathlon.co.kr":      { date: "2026-09-06", shape: /\/search\?q=/,                     nature: "주의",    note: "검색은 되지만 결과 수가 전체(7,741)로 표시되고 상단에 의류가 온다" },
  "kr.puma.com":          { date: "2026-09-06", shape: /\/kr\/ko\/search\?q=/,             nature: "남아있음", note: "검색어가 반영된다. 다만 한글 검색어는 의류까지 같이 잡힌다" },
  "search.danawa.com":    { date: "2026-09-06", shape: /\/dsearch\.php\?query=/,           nature: "남아있음", note: "가격비교 55건, 단종품이 오히려 최저가로 남는다" },
  "kream.co.kr":          { date: "2026-09-06", shape: /\/search\?keyword=/,               nature: "남아있음", note: "리셀이라 단종품이 더 잘 잡힌다. 한글 오타도 보정된다" },
  "musinsa.com":          { date: "2026-09-06", shape: /\/brand\//,                        nature: "해당없음", note: "브랜드 페이지라 모델과 무관하다 — 41개가 여기 속한다" },
  // 나이키는 두 형태를 쓴다. 처음에 `?q=`만 적었다가 카테고리 링크 4개를 오탐했다.
  // (`/kr/w/pegasus-shoes-8nexhzy7ok` — 눌러보니 정상 카테고리 페이지였다.)
  // 오히려 이쪽이 검색보다 낫다. **범위를 넓히면 오탐부터 잡아라** — AGENTS.md §3.
  "nike.com":             { date: "2026-09-06", shape: /\/kr\/w(\?q=|\/[a-z0-9-]+)/,       nature: "대체됨",   note: "레볼루션 7 → 결과 4건이 전부 레볼루션 8. 카테고리형(/kr/w/…)은 정상" },
  "brooksrunning.co.kr":  { date: "2026-09-06", shape: /\/product\/search\.html\?keyword=/, nature: "남아있음", note: "고스트 17 16건 전부 [OUTLET] 할인가. 사용자에게 이득" },
  "adidas.co.kr":         { date: "2026-09-06", shape: /\/search\?q=/,                     nature: "남아있음", note: "결과가 하나면 상품 페이지로 바로 리다이렉트된다" },
  "kor.mizuno.com":       { date: "2026-09-06", shape: /\/product\/search\.html\?keyword=/, nature: "남아있음", note: "웨이브라이더 29 8건+, 30% 할인. 영문 검색어도 먹는다" },
  "fleetrunner.co.kr":    { date: "2026-09-06", shape: /\/goods\/goods_search\.php\?keyword=/, nature: "일부0건", note: "Guide 18·Kinvara 16은 0건이라 세대번호를 뺐다(9건·1건)" },
  "29cm.co.kr":           { date: "2026-09-06", shape: /\/store\/search\?keyword=/,        nature: "일부0건", note: "영문 검색어가 0건. 한글로 바꾸고 킨바라·엔돌핀은 링크를 내렸다" },
};

/**
 * **죽은 도메인** — 2026-09-06에 브라우저로 확인했다. 여기 링크를 걸면 즉시 exit 1이다.
 *
 * 이 목록이 왜 필요한가. 위 `VERIFIED`의 `shape`는 "형태가 맞는가"만 본다.
 * 그런데 이 세 곳은 **형태와 무관하게 도메인 또는 한국 경로 자체가 없다.**
 * 형태 검사로는 영원히 안 잡히고, 상태 조회는 네트워크가 필요하다.
 * 그래서 사람이 확인한 사실을 상수로 박아 오프라인에서도 걸리게 한다.
 *
 * 되살아나면 지우면 된다 — 다만 **지우기 전에 브라우저로 다시 눌러볼 것.**
 */
const DEAD_DOMAINS = {
  "newbalance.co.kr":
    "도메인이 존재하지 않는다 (DNS_PROBE_FINISHED_NXDOMAIN). 2026-09-06 확인",
  "hoka.com":
    "한국 경로가 전부 404다. /ko-kr/ 도, /ko/kr/ 도 미국 사이트의 오류 페이지로 간다. 2026-09-06 확인",
  "on.com":
    "/ko-kr/cloudrunner 등 제품 경로가 404다. /ko-kr/shop 은 살아 있으나 검색 URL 형태를 찾지 못했다. 2026-09-06 확인",
};

/** 검색 결과 페이지인가 — 이런 링크는 200이어도 빈 결과일 수 있다 */
function isSearchUrl(u) {
  return /[?&](q|query|keyword|search|searchTerm|sword)=|\/search\b|\/products\/search/i.test(u);
}

/**
 * 검색어에 **세대 번호**가 들어 있는가.
 *
 * 이게 위험도를 가른다. 처음에는 "단종 × 검색형"을 전부 위험으로 쳤더니 117개가 나왔고,
 * 그건 확인 큐가 아니라 벽이다. 실제 링크를 보니 위험이 균일하지 않았다 —
 *
 *   안전  https://www.newbalance.co.kr/ko/search?q=FuelCell+Rebel   ← 시리즈명만. 후속작도 잡힌다
 *   위험  https://www.coupang.com/np/search?q=New Balance FuelCell Rebel v4  ← 세대 번호. 단종되면 0건
 *
 * 그래서 검색어(쿼리 파라미터)에 `v4`·`14` 같은 세대 표기가 있는 것만 고위험으로 본다.
 */
function queryHasGeneration(u) {
  try {
    const url = new URL(u);
    const q = [...url.searchParams.entries()]
      .filter(([k]) => /^(q|query|keyword|search|searchTerm|sword|search_text)$/i.test(k))
      .map(([, v]) => v)
      .join(" ");
    if (!q) return false;
    // v4 / V15 처럼 v+숫자, 또는 단어 경계의 2자리 이하 숫자(모델 세대)
    return /\bv\d+\b/i.test(q) || /(?:^|\s)\d{1,2}(?:\s|$)/.test(q);
  } catch {
    return false;
  }
}

// ── data.ts에서 신발과 구매 링크를 뽑는다 ──────────────────
const text = await readFile(DATA, "utf8");

const shoes = [];
{
  // id / brand / model / (successor) / … / buyLinks[…] 를 신발 단위로 자른다
  const idRe = /id:\s*"([^"]+)",\s*\n\s*brand:\s*"([^"]+)",\s*\n\s*model:\s*"([^"]+)",/g;
  const marks = [...text.matchAll(idRe)];
  for (let i = 0; i < marks.length; i++) {
    const start = marks[i].index;
    const end = i + 1 < marks.length ? marks[i + 1].index : text.length;
    const chunk = text.slice(start, end);
    const successor = chunk.match(/successor:\s*"([^"]+)"/)?.[1] ?? null;
    const links = [...chunk.matchAll(/\{\s*label:\s*"([^"]*)",\s*url:\s*"([^"]+)"/g)].map((m) => ({
      label: m[1],
      url: m[2],
    }));
    shoes.push({ id: marks[i][1], brand: marks[i][2], model: marks[i][3], successor, links });
  }
}

const all = shoes.flatMap((s) => s.links.map((l) => ({ ...l, shoe: s })));

console.log(C.bold(`\n구매 링크 검사 — 신발 ${shoes.length}종 · 링크 ${all.length}개\n`));

// ── 구성 분석 (네트워크 불필요) ────────────────────────────
const search = all.filter((l) => isSearchUrl(l.url));
const direct = all.filter((l) => !isSearchUrl(l.url));
const discontinued = shoes.filter((s) => s.successor);
// 단종 × 검색형 × **검색어에 세대 번호** — 셋이 겹치는 것만 고위험으로 좁힌다.
const riskQueue = all.filter(
  (l) => l.shoe.successor && isSearchUrl(l.url) && queryHasGeneration(l.url)
);
const searchDiscontinued = all.filter((l) => l.shoe.successor && isSearchUrl(l.url));

console.log(`  직링크    ${String(direct.length).padStart(3)}개`);
console.log(`  검색형    ${String(search.length).padStart(3)}개  ${C.dim("← 200이어도 빈 결과일 수 있다")}`);
console.log(`  단종 신발 ${String(discontinued.length).padStart(3)}종`);
console.log(
  C.dim(`\n  단종 × 검색형 ${searchDiscontinued.length}개 중에서,`)
);
console.log(C.yellow(`  ⚠ 검색어에 세대 번호가 든 것 ${riskQueue.length}개 — 여기가 실제 위험이다.`));
console.log(C.dim("     'FuelCell Rebel' 은 후속작도 잡히지만 'FuelCell Rebel v4' 는 단종되면 0건이다."));
console.log(C.dim("     상태코드로는 둘 다 200이라 안 잡힌다.\n"));

// ── 1층: URL 형태가 확인된 것과 다른가 (네트워크 불필요, 자동 판정) ──
function domainOf(u) {
  try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return "?"; }
}
const shapeBroken = [];
const deadDomainLinks = [];
const unknownDomains = new Map();
for (const l of all) {
  const d = domainOf(l.url);
  if (DEAD_DOMAINS[d]) {
    deadDomainLinks.push({ ...l, domain: d, why: DEAD_DOMAINS[d] });
    continue;
  }
  const v = VERIFIED[d];
  if (!v) {
    // 이미지 CDN·리뷰 사이트 등은 구매 링크가 아니므로 대장에 없어도 된다.
    // 다만 **쇼핑몰처럼 생긴 것**(검색형)이 대장에 없으면 알린다.
    if (isSearchUrl(l.url)) unknownDomains.set(d, (unknownDomains.get(d) ?? 0) + 1);
    continue;
  }
  if (v.shape && !v.shape.test(l.url)) shapeBroken.push({ ...l, domain: d, expect: v.shape });
}

if (deadDomainLinks.length) {
  console.log(C.red(C.bold(`✗ 죽은 것으로 확인된 도메인입니다 — ${deadDomainLinks.length}개`)));
  const byDom = new Map();
  for (const l of deadDomainLinks) {
    if (!byDom.has(l.domain)) byDom.set(l.domain, []);
    byDom.get(l.domain).push(l);
  }
  for (const [d, ls] of byDom) {
    console.log(`  ${C.bold(d)} ${C.dim(`— ${ls.length}개`)}`);
    console.log(C.dim(`    ${DEAD_DOMAINS[d]}`));
  }
  console.log();
}

if (shapeBroken.length) {
  console.log(C.red(C.bold(`✗ URL 형태가 확인된 것과 다릅니다 — ${shapeBroken.length}개`)));
  console.log(C.dim("  2026-09-06에 이 검사로 17개를 찾았습니다. 전부 404거나 엉뚱한 사이트였습니다.\n"));
  for (const b of shapeBroken.slice(0, 15)) {
    console.log(`  ${b.shoe.brand} ${b.shoe.model} — ${b.label}`);
    console.log(C.dim(`    ${b.url}`));
    console.log(C.dim(`    기대한 형태: ${b.expect}`));
  }
  if (shapeBroken.length > 15) console.log(C.dim(`  … 외 ${shapeBroken.length - 15}개`));
  console.log();
}

if (unknownDomains.size) {
  console.log(C.yellow(`⚠ 대장에 없는 검색형 쇼핑몰 ${unknownDomains.size}곳`));
  console.log(C.dim("  브라우저로 한 번 눌러보고 VERIFIED에 형태와 날짜를 적어주세요.\n"));
  for (const [d, n] of [...unknownDomains].sort((a, b) => b[1] - a[1])) {
    console.log(C.dim(`    ${d.padEnd(24)} ${n}개`));
  }
  console.log();
}

if (PLAN_ONLY) {
  // 대장 요약 — 확인한 것과 안 한 것을 갈라서 보여준다
  const entries = Object.entries(VERIFIED);
  const done = entries.filter(([, v]) => v.date);
  const todo = entries.filter(([, v]) => !v.date);
  console.log(C.bold(`쇼핑몰 대장 — 확인 ${done.length}곳 / 미확인 ${todo.length}곳`));
  for (const [d, v] of done) {
    const tag = { 남아있음: C.green("남아있음"), 대체됨: C.yellow("대체됨  "), 일부0건: C.red("일부0건 "), 해당없음: C.dim("해당없음") }[v.nature] ?? v.nature;
    console.log(`  ${tag}  ${C.bold(d.padEnd(22))} ${C.dim(v.note)}`);
  }
  for (const [d] of todo) console.log(`  ${C.dim("미확인  ")}  ${d}`);
  console.log();
}

if (PLAN_ONLY) {
  /**
   * **확인 단위는 링크가 아니라 쇼핑몰이다.**
   *
   * 처음에는 위험 링크를 그냥 나열했더니 102개가 나왔고, 그건 사람이 처리할 수 있는
   * 목록이 아니다. 그런데 실제로 확인해야 하는 건 링크 하나하나가 아니라
   * **"이 쇼핑몰은 단종품 검색에 결과를 주는가"** 라는 쇼핑몰별 성질이다.
   *
   * 쿠팡이 단종 모델에 결과를 준다는 걸 한 번 확인하면 그 쇼핑몰의 나머지 링크에도
   * 그대로 적용된다. 그래서 도메인별로 묶고 대표 2개씩만 뽑는다 — 102개가 10여 개가 된다.
   */
  const byDomain = new Map();
  for (const l of riskQueue) {
    const d = (() => { try { return new URL(l.url).hostname.replace(/^www\./, ""); } catch { return "?"; } })();
    if (!byDomain.has(d)) byDomain.set(d, []);
    byDomain.get(d).push(l);
  }
  const domains = [...byDomain.entries()].sort((a, b) => b[1].length - a[1].length);

  console.log(C.bold("확인 큐 — 쇼핑몰별로 대표 2개만 눌러보면 됩니다"));
  console.log(C.dim("  볼 것은 '결과가 있는가'가 아니라 **'찾던 모델이 나오는가'** 입니다.\n"));
  console.log(C.dim("  각 쇼핑몰의 성질은 위 대장에 이미 적혀 있습니다. 아래는 남은 확인용입니다.\n"));
  for (const [domain, links] of domains) {
    console.log(`${C.yellow("■")} ${C.bold(domain)} ${C.dim(`— 위험 링크 ${links.length}개`)}`);
    for (const l of links.slice(0, 2)) {
      console.log(`    ${l.shoe.brand} ${l.shoe.model} ${C.dim(`→ ${l.shoe.successor}`)}`);
      console.log(C.dim(`      ${l.url}`));
    }
    console.log();
  }
  console.log(
    C.bold(`총 ${riskQueue.length}개 위험 링크 → 확인할 쇼핑몰은 ${domains.length}곳뿐입니다.\n`)
  );
  console.log(C.dim("  결과가 0건인 쇼핑몰을 찾으면, 그 쇼핑몰 링크를 검색어에서 세대 번호를 빼거나"));
  console.log(C.dim("  (예: 'FuelCell Rebel v4' → 'FuelCell Rebel') 아예 내리면 됩니다."));
  console.log(C.dim("  --plan 은 네트워크를 쓰지 않습니다. 상태 조회는 인자 없이 실행하세요.\n"));
  // 형태가 깨진 링크는 네트워크 없이도 확실하니 --plan 에서도 exit 1 이다.
  process.exit(shapeBroken.length || deadDomainLinks.length ? 1 : 0);
}

// ── 상태 조회 ──────────────────────────────────────────────
async function check(link) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    // HEAD를 막는 쇼핑몰이 많다. 405/501이면 GET으로 한 번 더.
    let r = await fetch(link.url, { method: "HEAD", redirect: "follow", signal: ac.signal });
    if (r.status === 405 || r.status === 501 || r.status === 403) {
      r = await fetch(link.url, { method: "GET", redirect: "follow", signal: ac.signal });
    }
    return { ...link, status: r.status, finalUrl: r.url };
  } catch (e) {
    return { ...link, status: 0, error: e.name === "AbortError" ? "시간초과" : e.message };
  } finally {
    clearTimeout(t);
  }
}

const results = [];
for (let i = 0; i < all.length; i += CONCURRENCY) {
  const batch = all.slice(i, i + CONCURRENCY);
  results.push(...(await Promise.all(batch.map(check))));
  process.stdout.write(C.dim(`\r  조회 중… ${Math.min(i + CONCURRENCY, all.length)}/${all.length}`));
}
process.stdout.write("\r" + " ".repeat(40) + "\r");

const dead = results.filter((r) => r.status === 0 || r.status >= 400);
const moved = results.filter((r) => r.status >= 200 && r.status < 400 && r.finalUrl && r.finalUrl !== r.url);

if (dead.length) {
  console.log(C.bold("죽은 링크"));
  for (const d of dead) {
    console.log(`${C.red("✗")} ${d.shoe.brand} ${d.shoe.model} — ${d.label}`);
    console.log(C.dim(`    ${d.status || d.error}  ${d.url}`));
  }
  console.log();
}

if (moved.length) {
  console.log(C.bold("리다이렉트된 링크 — 엉뚱한 곳으로 가는지 확인할 것"));
  for (const m of moved.slice(0, 10)) {
    console.log(`${C.yellow("→")} ${m.shoe.brand} ${m.shoe.model} — ${m.label}`);
    console.log(C.dim(`    ${m.url}\n    ⇒ ${m.finalUrl}`));
  }
  if (moved.length > 10) console.log(C.dim(`  … 외 ${moved.length - 10}개`));
  console.log();
}

console.log(C.bold("─────────────────────────────"));
console.log(
  `${all.length}개 · ${dead.length ? C.red(`죽음 ${dead.length}`) : C.green("죽음 0")} · ` +
  `${C.yellow(`리다이렉트 ${moved.length}`)} · ${C.green(`정상 ${results.length - dead.length}`)}`
);
console.log(C.dim("\n주의: 이 검사는 **상태코드만** 본다. 200인데 검색 결과가 0건인 경우는 잡지 못한다."));
console.log(C.dim(`      단종 신발의 검색형 링크 ${riskQueue.length}개는 --plan 으로 큐를 뽑아 직접 눌러볼 것.\n`));

process.exit(dead.length || shapeBroken.length || deadDomainLinks.length ? 1 : 0);
