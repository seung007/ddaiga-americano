#!/usr/bin/env node
/**
 * 내부 링크 검사 — "이 페이지로 들어오는 링크가 있나"
 *
 * 왜 만들었나 (2026-09-06)
 * ───────────────────────
 * Search Console 실측: **색인 11 / 미색인 33**, 미색인 사유가 100%
 * "발견됨 — 현재 색인이 생성되지 않음"이다. `/courses` 를 직접 검사하니
 * **"참조 페이지: 감지된 페이지 없음"** 이라고 나왔다.
 *
 * 이건 기술적 차단이 아니다. robots.txt 도 sitemap 도 멀쩡하다.
 * 구글이 URL 을 **알고는 있는데 크롤할 가치를 못 느낀 것**이고, 그 판단의
 * 가장 큰 입력이 **사이트 안에서 그 페이지를 아무도 가리키지 않는다**는 사실이다.
 * sitemap 에 적는 것은 "존재한다"는 신고일 뿐 "중요하다"는 근거가 아니다.
 *
 * 그래서 sitemap 이 아니라 **링크**를 센다.
 *
 * 무엇을 실패로 보나
 * ─────────────────
 * ① 인바운드 0 (고아) — 헤더·푸터를 빼고 아무도 안 가리키는 페이지. **실패.**
 * ② sitemap 에 있는데 라우트가 없다 / 라우트가 있는데 sitemap 에 없다. **실패.**
 * ③ 존재하지 않는 경로로 거는 내부 링크(오타). **실패.**
 *
 * 헤더·푸터 링크는 왜 빼고 세나
 * ──────────────────────────
 * 전역 네비게이션은 **모든 페이지에 똑같이** 달린다. 그래서 페이지 사이의
 * 중요도 차이를 만들지 못하고, 검색엔진도 보일러플레이트로 깎아서 본다.
 * 여기서 알고 싶은 건 "본문에서 이 페이지를 가리키는가"다.
 * (그렇다고 헤더가 무의미하다는 뜻은 아니다 — 오늘 5개 페이지에 헤더가
 *  아예 없어서 나가는 링크가 0이었고, 그건 그것대로 고쳤다.)
 *
 * 한계 — 정적 분석이다
 * ──────────────────
 * 문자열로 적힌 경로와, 아래 DYNAMIC 에 등록한 템플릿만 본다.
 * 런타임에 조립되는 링크는 놓친다. **놓치는 쪽으로 틀리지, 있다고 지어내지는 않는다.**
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { stripComments } from "./lib/strip-comments.mjs";
import { join, relative } from "node:path";

const ROOT = process.cwd();

/** 전역 네비게이션 — 여기 링크는 인바운드로 세지 않는다. */
const CHROME = ["components/SiteHeader.tsx", "components/SiteFooter.tsx"];

/**
 * 동적 라우트를 실제 경로로 펴는 규칙.
 * 지금은 /compare/[slug] 하나뿐이다. 늘어나면 여기에 추가한다.
 */
const DYNAMIC = [
  {
    route: "/compare/[slug]",
    // 사전 렌더링 대상 = lib/compares.ts 의 COMPARE_SLUGS
    expand: () => {
      const src = readFileSync(join(ROOT, "lib/compares.ts"), "utf8");
      return [...src.matchAll(/"([a-z0-9-]+-vs-[a-z0-9-]+)"/g)].map((m) => `/compare/${m[1]}`);
    },
    // 소스에서 이 형태를 보면 "compare 전체를 가리킨다"고 본다.
    templates: [/\/compare\/\$\{/],
  },
];

// ── 파일 수집 ───────────────────────────────────────────────
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === ".git") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx|ts)$/.test(name)) out.push(p);
  }
  return out;
}

// ── 라우트 목록 ─────────────────────────────────────────────
const routes = new Set();
for (const f of walk(join(ROOT, "app"))) {
  if (!f.endsWith("page.tsx")) continue;
  const r = "/" + relative(join(ROOT, "app"), f).replace(/\\/g, "/").replace(/\/?page\.tsx$/, "");
  routes.add(r === "/" ? "/" : r.replace(/\/$/, ""));
}

// 동적 라우트는 펼친 실제 경로로 바꾼다
const dynamicRoutes = new Map(); // 실제경로 -> 원본 라우트
for (const d of DYNAMIC) {
  if (!routes.delete(d.route)) continue;
  for (const real of d.expand()) {
    routes.add(real);
    dynamicRoutes.set(real, d.route);
  }
}

// ── 링크 수집 ───────────────────────────────────────────────
const inbound = new Map([...routes].map((r) => [r, []]));
const broken = [];

const files = [...walk(join(ROOT, "app")), ...walk(join(ROOT, "components")), ...walk(join(ROOT, "lib"))];

for (const f of files) {
  const rel = relative(ROOT, f).replace(/\\/g, "/");
  if (CHROME.includes(rel)) continue;
  /**
   * **주석을 지우고 링크를 모은다.** (2026-09-08)
   *
   * `lib/brands.ts` 의 설명 주석에 백틱으로 적은 `/compare/[slug]` 를
   * 이 검사가 "없는 경로로 거는 링크"로 신고했다. 코드가 아니라 문장이다.
   * `check-cdn.mjs` 가 이미 같은 오탐을 맞았고 같은 처방을 썼다 —
   * 그래서 함수를 `scripts/lib/strip-comments.mjs` 로 뺐다.
   */
  const src = stripComments(readFileSync(f, "utf8"));
  const self = rel.startsWith("app/") ? "/" + rel.slice(4).replace(/\/?page\.tsx$/, "") : null;

  // 1) 문자열로 적힌 경로: href="/injury/knee-pain", href={"/tools"}, { href: "/tools/pace" }
  for (const m of src.matchAll(/["'`](\/[a-z0-9\-/[\]]*)["'`]/gi)) {
    let p = m[1].replace(/\/$/, "") || "/";
    if (p.startsWith("/api") || p.startsWith("/_")) continue;
    if (/\.(png|jpg|svg|ico|xml|txt|webp)$/i.test(p)) continue;
    if (p === self) continue; // 자기 자신은 안 센다
    if (routes.has(p)) inbound.get(p).push(rel);
    else if (/^\/(injury|tools|compare|community|courses|shoe-finder|login|privacy|terms)\b/.test(p))
      broken.push({ from: rel, to: p });
  }

  // 2) 템플릿 링크: href={`/compare/${slug}`} → 그 라우트 전체를 가리킨다고 본다
  for (const d of DYNAMIC) {
    if (!d.templates.some((re) => re.test(src))) continue;
    for (const [real, orig] of dynamicRoutes) {
      if (orig === d.route && real !== self) inbound.get(real).push(rel + " (템플릿)");
    }
  }
}

// ── sitemap 대조 ────────────────────────────────────────────
// sitemap.ts 는 URL 을 `${BASE_URL}/경로` 템플릿으로 만든다. 따옴표만 봐서는 안 잡힌다.
const sitemapSrc = readFileSync(join(ROOT, "app/sitemap.ts"), "utf8");
const sitemapPaths = new Set(
  [...sitemapSrc.matchAll(/\$\{BASE_URL\}(\/[a-z0-9\-/]*)/gi)].map((m) => m[1].replace(/\/$/, "") || "/")
);
// `${BASE_URL}/injury/${slug}` 처럼 목록을 map 하는 자리는 접두어 전체를 덮는 것으로 본다.
const sitemapPrefixes = [...sitemapSrc.matchAll(/\$\{BASE_URL\}(\/[a-z0-9-]+)\/\$\{/gi)].map((m) => m[1]);
const notInSitemap = [...routes].filter((r) => {
  if (r === "/login") return false; // 로그인은 색인 대상이 아니다
  if (sitemapPaths.has(r)) return false;
  return !sitemapPrefixes.some((p) => r.startsWith(p + "/"));
});

// ── 보고 ────────────────────────────────────────────────────
const orphans = [...inbound].filter(([, v]) => v.length === 0).map(([k]) => k);
const thin = [...inbound].filter(([, v]) => v.length === 1).map(([k, v]) => `${k}  ← ${v[0]}`);

const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

console.log(bold(`\n내부 링크 — 라우트 ${routes.size}개 (헤더·푸터 제외하고 셈)\n`));

if (orphans.length) {
  console.log(red(`고아 ${orphans.length}개 — 본문에서 아무도 안 가리킵니다`));
  for (const o of orphans) console.log(`  ✗ ${o}`);
  console.log(dim("  구글이 '발견됨 — 색인 생성 안 됨'으로 두는 페이지가 여기서 나옵니다.\n"));
}
if (broken.length) {
  console.log(red(`없는 경로로 거는 링크 ${broken.length}개`));
  for (const b of broken) console.log(`  ✗ ${b.to}  (${b.from})`);
  console.log();
}
if (notInSitemap.length) {
  console.log(red(`sitemap 에 빠진 라우트 ${notInSitemap.length}개`));
  for (const p of notInSitemap) console.log(`  ✗ ${p}`);
  console.log();
}
if (thin.length) {
  console.log(dim(`인바운드 1개뿐 (${thin.length}개) — 고아는 아니지만 얇습니다`));
  for (const t of thin) console.log(dim(`  · ${t}`));
  console.log();
}

const fail = orphans.length + broken.length + notInSitemap.length;
console.log(fail ? red(`실패 ${fail}건`) : green(`통과 — 고아 없음, 끊긴 링크 없음, sitemap 일치`));
process.exit(fail ? 1 : 0);
