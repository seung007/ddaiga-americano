#!/usr/bin/env node
/**
 * Claude 훅 — 가이드 글 규칙을 「기억」이 아니라 「장치」로 지킨다 (2026-11-18)
 *
 * .claude/settings.json 에서 두 자리에 건다.
 *   PostToolUse(Edit·Write): 가이드 글·부품·검사기를 고치면 바로 check:geo 를 돌려, 어긴 규칙을 Claude 에게 되돌려 준다(exit 2).
 *   PreToolUse(Bash):        `git commit --no-verify`·`-n` 과 훅 끄기(core.hooksPath)를 막는다 — 커밋 검사를 건너뛰는 길을 닫는다.
 * 훅이 돌지 않는 환경(다른 도구·사람 손)에서도 마지막 문은 커밋 훅(.githooks/pre-commit → npm run check)이다.
 * 훅 자체가 고장 나면(입력을 못 읽음) 막지 않고 지나간다 — 글 작업을 훅 버그가 세우면 안 된다. 그때도 커밋 훅은 남는다.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
let input = {};
try { input = JSON.parse(await new Response(process.stdin).text() || "{}"); } catch { process.exit(0); }
const tool = input.tool_name ?? "";
const ti = input.tool_input ?? {};

if (tool === "Bash") {
  const c = String(ti.command ?? "");
  if (/git\b[^|;&]*\bcommit\b[^|;&]*(--no-verify|\s-[a-zA-Z]*n[a-zA-Z]*\b)/.test(c) || /core\.hooksPath/.test(c) && !/core\.hooksPath\s+\.githooks/.test(c) && /config/.test(c) && !/--get/.test(c)) {
    console.error("막음: 커밋 검사를 건너뛰거나 끄는 명령입니다(--no-verify · core.hooksPath 변경). 검사가 실패하면 글을 고치세요 — docs/운영/가이드_틀.md.");
    process.exit(2);
  }
  process.exit(0);
}

const file = String(ti.file_path ?? "").replaceAll("\\", "/");
if (!/(app\/injury\/|lib\/guide\/|components\/guide\/|components\/ArticleMeta|components\/FaqSection|scripts\/check-geo)/.test(file)) process.exit(0);
const r = spawnSync(process.execPath, [path.join(ROOT, "scripts/check-geo.mjs")], { encoding: "utf8" });
if (r.status !== 0) {
  console.error(`가이드 규칙 위반 — 이 상태로는 커밋이 막힙니다. 아래를 고친 뒤 계속하세요.\n${(r.stderr || r.stdout).trim()}`);
  process.exit(2);
}
process.exit(0);
