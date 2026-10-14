#!/usr/bin/env node
/**
 * 사이트 주소 하드코딩 검사 (2026-10-14)
 *
 * `https://ddaiga-americano.vercel.app` 가 코드에 글자로 다시 들어오면 막는다.
 * 허용: lib/site.ts · scripts/lib/site.mjs (정본 두 곳), 주석 줄, User-Agent 문자열(봇 식별용·주소 아님).
 * 왜: 42곳에 박혀 있던 것을 한 곳으로 모았다. 한 곳이라도 다시 박히면 도메인 교체 때 그 페이지만 옛 주소로 남는다.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
const ROOT = path.resolve(import.meta.dirname, "..");
const HOST = "ddaiga-americano.vercel.app";
const ALLOW_FILES = new Set(["lib/site.ts", "scripts/lib/site.mjs", "scripts/check-site-url.mjs"]);
const problems = [];
function walk(dir) {
  for (const n of readdirSync(dir)) {
    const p = path.join(dir, n);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!/\.(ts|tsx|mjs|json)$/.test(n)) continue;
    const rel = path.relative(ROOT, p).replace(/\\/g, "/");
    if (ALLOW_FILES.has(rel)) continue;
    readFileSync(p, "utf8").split("\n").forEach((line, i) => {
      if (!line.includes(HOST)) return;
      const t = line.trim();
      if (/^(\*|\/\/|\/\*|#)/.test(t)) return;          // 주석
      if (/User-Agent|\(\+https:\/\//.test(line)) return; // 봇 UA
      problems.push(`${rel}:${i + 1}  ${t.slice(0, 90)}`);
    });
  }
}
for (const d of ["app", "components", "lib", "scripts"]) walk(path.join(ROOT, d));
if (problems.length) {
  console.log("사이트 주소가 글자로 박혀 있습니다 — lib/site.ts 의 SITE_URL·pageUrl() 을 쓰세요:\n");
  for (const p of problems) console.log("  " + p);
  process.exit(1);
}
