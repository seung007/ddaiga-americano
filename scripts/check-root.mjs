#!/usr/bin/env node
/**
 * 루트 정리 검사 — **새 문서가 루트·outputs/ 에 떨어지면 막는다.**
 *
 *   npm run check:root        (npm run check · pre-commit 훅 · ship 에 포함)
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 만들었나 (2026-10-14)
 *
 * 2026-06~10 사이 루트에 문서 41개, `outputs/` 에 설계·홍보 문서 17개,
 * `Claude outputs/` 에 이미 반영된 패치 27개가 쌓였다. 하루에 하나씩이라 아무도 못 느꼈다.
 * 정리하는 데 한 세션이 들었고, 그 사이 인용 검사기가 원고를 못 찾을 뻔했다
 * (원고 위치가 검사기 경로에 박혀 있었다 — scripts/verify-citations.mjs walkBlogDrafts).
 *
 * "문서는 docs/ 에 둔다"를 AGENTS.md 에 적는 것으로는 안 지켜진다 — 이 저장소가 여러 번 배운 것이다.
 * 그래서 검사로 내린다. 놓을 자리는 `docs/README.md` 표에 있다.
 *
 * ─────────────────────────────────────────────────────────────
 * 허용 목록은 **손으로 관리한다.** 정당한 새 설정 파일·폴더가 생기면 여기에 한 줄 더한다.
 * 점(.)으로 시작하는 것은 도구 설정이라 보지 않는다(.env · .github · .claude …).
 */
import { readdirSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

const ROOT_FILES = new Set([
  "AGENTS.md", "CLAUDE.md", "README.md",
  "package.json", "package-lock.json",
  "tsconfig.json", "tsconfig.tsbuildinfo", "next-env.d.ts", "next.config.ts",
  "eslint.config.mjs", "postcss.config.mjs", "vercel.json",
  "desktop.ini", "Thumbs.db", // Windows 탐색기가 만든다
]);
const ROOT_DIRS = new Set([
  "app", "components", "lib", "public", "scripts", "supabase", // 사이트
  "docs",            // 내부 문서 — 자리는 docs/README.md
  "pipeline",        // 자동 수집 (2026-10-20). 원문은 pipeline/raw/ — .gitignore + check-leak
  "outputs",         // 스크립트 결과물 전용 (link-check · image-sheet · affiliate-check)
  "shots",           // npm run shot
  "_archive",        // 보존만 한다. 읽지 않는다 (AGENTS.md 「폴더 지도」)
  "Claude", "Claude outputs", // Cowork 작업 폴더 · 패치 전달함
  "node_modules",
]);

const problems = [];

for (const e of readdirSync(ROOT, { withFileTypes: true })) {
  if (e.name.startsWith(".")) continue;
  const ok = e.isDirectory() ? ROOT_DIRS.has(e.name) : ROOT_FILES.has(e.name);
  if (!ok) problems.push(`${e.isDirectory() ? "폴더" : "파일"}  ${e.name}`);
}

// outputs/ 는 스크립트가 다시 만들 수 있는 것만 둔다. 사람이 읽는 문서가 섞이면 같은 일이 반복된다
const OUT = path.join(ROOT, "outputs");
if (existsSync(OUT)) {
  for (const e of readdirSync(OUT, { withFileTypes: true })) {
    if (e.isFile() && /\.md$/i.test(e.name)) problems.push(`문서  outputs/${e.name}`);
  }
}

if (problems.length) {
  console.log("루트·outputs/ 에 자리 없는 것이 있습니다:\n");
  for (const p of problems) console.log("  " + p);
  console.log(
    "\n문서는 docs/<분류>/ 로 옮기세요 — 분류표는 docs/README.md." +
    "\n정당한 새 설정 파일·폴더라면 scripts/check-root.mjs 허용 목록에 더하세요." +
    "\n지우지 않을 옛 자료는 _archive/ 로."
  );
  process.exit(1);
}
