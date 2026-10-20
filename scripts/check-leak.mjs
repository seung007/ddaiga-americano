#!/usr/bin/env node
/**
 * 유출 검사 — **공개 저장소에 올라가면 안 되는 것**이 커밋 대상에 섞였는지 본다.
 *
 *   npm run check:leak        (npm run check · pre-commit 훅 · ship · CI 에 포함)
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 만들었나 (2026-10-20)
 *
 * 이 저장소는 공개다. 한 번 올라간 파일은 지워도 기록·포크에 남는다 — 되돌릴 수 없다.
 * 자동 수집 파이프라인(pipeline/)을 같은 저장소에서 시작하기로 하면서(council 2026-10-20)
 * 남의 글 원문·비밀값이 섞일 길이 늘었다. `.gitignore` 만으로는 부족하다:
 *   · 이미 추적 중인 파일에는 무시 규칙이 안 걸린다 (PRD .docx 3개가 6월부터 올라가 있었다)
 *   · `git add -f`, 다른 폴더에 쓴 원문, 코드에 붙여넣은 키는 무시 규칙이 못 본다
 *
 * 그래서 **`git add -A` 가 실제로 올릴 파일**(추적 중 + 무시되지 않은 새 파일)을 전부 본다.
 *
 * 잡는 것
 *   ① 경로  — 비공개 자리(.env · docs/개인 · outputs/ · pipeline/raw/ …)·올리면 안 되는 형식(.zip · .docx …)
 *   ② 크기  — 1MB 넘는 파일 (원문 덤프·모델·압축본일 가능성이 높다)
 *   ③ 비밀값 — 흔한 키·토큰 모양. **값은 출력하지 않는다** (규칙 이름과 위치만)
 *   ④ 원문  — JSON 안의 2,000자 넘는 문자열, public/ 밖의 .html. 우리 데이터의 가장 긴 문자열은 264자다
 *
 * 오탐이면 규칙을 고친다. `--no-verify` 로 넘기지 않는다 — 넘긴 한 번이 영구 기록이 된다.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, statSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SELF = "scripts/check-leak.mjs"; // 이 파일은 규칙 문자열을 담고 있어서 ③에서 뺀다

const MAX_BYTES = 1_000_000;
const MAX_JSON_STRING = 2_000;

// ① 경로 — 지금 .gitignore 가 막는 자리 + 앞으로 pipeline/ 이 쓸 자리
const PATH_RULES = [
  [/(^|\/)\.env($|\.)/, "환경변수 파일"],
  [/\.(zip|7z|rar|tar|gz|pem|key|p12|pfx|docx|xlsx|pptx|hwp)$/i, "올리지 않는 형식"],
  [/^(Claude|Claude outputs|_archive|outputs|shots|\.cache)\//, "로컬 전용 폴더"],
  [/^docs\/(개인|블로그|홍보|council|설계)\//, "로컬 전용 문서"],
  [/^pipeline\/(raw|cache|models)\//, "파이프라인 원문·캐시·모델"],
  [/reviews-raw-|chat_msgs|scrape_/i, "수집 원문 파일명"],
];

// ③ 비밀값 — 모양만 본다. 실제 값과 맞는지는 모른다
const SECRET_RULES = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "개인 키"],
  [/\bsb_secret_[A-Za-z0-9_-]{10,}/, "Supabase 비밀 키"],
  [/\beyJhbGciOi[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\./, "JWT 토큰"],
  [/\bgh[pousr]_[A-Za-z0-9]{30,}/, "GitHub 토큰"],
  [/\bgithub_pat_[A-Za-z0-9_]{40,}/, "GitHub 세분화 토큰"],
  [/\bAKIA[0-9A-Z]{16}\b/, "AWS 키"],
  [/\bsk-(ant-|proj-)?[A-Za-z0-9_-]{20,}/, "API 비밀 키 (sk-)"],
  [/\bhf_[A-Za-z0-9]{30,}/, "Hugging Face 토큰"],
  [/\b(NAVER_CLIENT_SECRET|COUPANG_SECRET_KEY|COUPANG_ACCESS_KEY|SUPABASE_SERVICE_ROLE_KEY)\s*[:=]\s*["']?[A-Za-z0-9]/, "비밀 환경변수에 값 대입"],
];

const TEXT_EXT = /\.(m?[jt]sx?|json|md|mdx|txt|html?|css|ya?ml|toml|sql|py|sh|env|csv|xml)$/i;

function gitList(args) {
  const out = execFileSync("git", ["-c", "core.quotepath=false", "ls-files", "-z", ...args], {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  return out.split("\0").filter(Boolean);
}

let files;
try {
  // 추적 중인 것 + 무시되지 않은 새 파일 = `git add -A` 가 올릴 것
  files = [...new Set([...gitList([]), ...gitList(["--others", "--exclude-standard"])])];
} catch (e) {
  console.error("git 목록을 못 읽었다 — 검사하지 못했으므로 실패로 둔다.\n" + String(e.message ?? e));
  process.exit(1);
}

const problems = [];
const add = (rule, file, where = "") => problems.push({ rule, file, where });

function longestString(x) {
  if (typeof x === "string") return x.length;
  if (Array.isArray(x)) return x.reduce((m, v) => Math.max(m, longestString(v)), 0);
  if (x && typeof x === "object") return Object.values(x).reduce((m, v) => Math.max(m, longestString(v)), 0);
  return 0;
}

for (const f of files) {
  const abs = path.join(ROOT, f);
  if (!existsSync(abs)) continue; // 지운 파일(아직 커밋 전)은 올라가지 않는다

  for (const [re, name] of PATH_RULES) if (re.test(f)) add(`① ${name}`, f);

  const size = statSync(abs).size;
  if (size > MAX_BYTES) add("② 1MB 초과", f, `${Math.round(size / 1024)}KB`);

  if (!TEXT_EXT.test(f) || size > 2 * MAX_BYTES) continue;
  const text = readFileSync(abs, "utf8");

  if (f !== SELF) {
    const lines = text.split("\n");
    for (const [re, name] of SECRET_RULES) {
      const i = lines.findIndex((l) => re.test(l));
      if (i >= 0) add(`③ ${name}`, f, `${i + 1}행`); // 값은 출력하지 않는다
    }
  }

  if (/\.json$/i.test(f)) {
    try {
      const n = longestString(JSON.parse(text));
      if (n > MAX_JSON_STRING) add("④ 원문으로 보이는 긴 문자열", f, `${n}자`);
    } catch {
      /* 형식 오류는 다른 검사가 본다 */
    }
  }
  if (/\.html?$/i.test(f) && !f.startsWith("public/")) add("④ public/ 밖의 HTML", f);
}

if (problems.length) {
  // 한 파일이 여러 규칙에 걸리면 한 줄로 묶는다 (예: Claude/ 아래 .docx = 폴더 + 형식)
  const byFile = new Map();
  for (const p of problems) {
    const k = p.file;
    byFile.set(k, [...(byFile.get(k) ?? []), p.rule + (p.where ? ` (${p.where})` : "")]);
  }
  console.log(`\n공개 저장소에 올라가면 안 되는 것 ${byFile.size}개 파일\n`);
  for (const [file, rules] of byFile) console.log(`  ${file}\n      ${rules.join(" · ")}`);
  console.log(
    "\n고치는 법" +
      "\n  · 이미 추적 중이면  git rm --cached -- \"경로\"   (내 컴퓨터의 파일은 남는다)" +
      "\n  · 새 파일이면       .gitignore 에 자리를 더하거나 파일을 비공개 자리로 옮긴다" +
      "\n  · 오탐이면          scripts/check-leak.mjs 규칙을 고친다 (--no-verify 금지)\n"
  );
  process.exit(1);
}

console.log(`유출 검사 통과 — 커밋 대상 ${files.length}개`);
