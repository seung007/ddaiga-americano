#!/usr/bin/env node
/**
 * 담당 구역 검사 — **에이전트 두 개가 서로의 작업을 쓸어 담는 것을 막는다.**
 *
 *   npm run check:zones        지금 작업 트리 상태를 본다
 *   npm run check              (이 검사가 포함돼 있다 → pre-commit 훅이 자동 실행)
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 만들었나 (2026-09-15)
 *
 * 이 저장소는 **Claude Code(터미널)와 Cowork(데스크톱 앱)가 같은 워킹 트리를
 * 공유**한다. 브랜치가 갈려 있지 않아서 `git pull` 같은 합류 지점이 없다.
 *
 * 그래서 두 가지가 조용히 일어난다.
 *
 *   ① **덮어쓰기** — 에이전트의 작업 순서는 읽기 → 판단 → 편집이다.
 *      그 사이에 다른 에이전트가 같은 파일을 바꾸면 그 변경이 사라진다. 오류도 안 난다
 *   ② **쓸어 담기** — `npm run ship` 은 `git add -A` 를 한다.
 *      한쪽이 배포하면 **다른 쪽의 미완성 파일까지 같이 커밋된다.**
 *      2026-09-15 커밋 하나가 8개 파일이었는데 작업한 건 7개였다
 *
 * ②는 기계가 잡을 수 있다. 커밋 시점에 **두 구역이 동시에 바뀌어 있으면**
 * 둘 중 하나는 남의 작업일 가능성이 있다. 그걸 알린다.
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 경고가 아니라 실패인가
 *
 * `check-all.mjs` 는 **통과한 검사의 출력을 전부 버린다**(토큰 절약이 그 설계 의도다).
 * 그래서 exit 0 으로 경고만 찍으면 **아무도 못 본다.** 막아야 보인다.
 *
 * 다만 이건 "틀렸다"가 아니라 **"확인이 필요하다"** 는 신호다.
 * 일부러 두 구역을 같이 고쳤다면 아래 안내대로 커밋을 나누거나 `--no-verify` 로 넘긴다.
 *
 * ─────────────────────────────────────────────────────────────
 * 이 검사가 못 하는 것 — 미리 적어 둔다
 *
 * · **덮어쓰기(①)는 못 막는다.** 이미 벌어진 뒤에 도는 검사다
 * · 한 사람이 정당하게 두 구역을 고친 경우와 구분하지 못한다. 그건 사람이 본다
 * · 구역 목록은 **손으로 관리한다.** 새 디렉터리가 생기면 여기 추가해야 한다
 */
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();

const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;

function git(...args) {
  try {
    // core.quotepath=false — 한글 파일명이 8진수로 깨져 나오는 것을 막는다.
    // (2026-09-12 에 report.mjs 에서 같은 문제를 겪었다)
    return execFileSync("git", ["-c", "core.quotepath=false", ...args], {
      cwd: ROOT,
      encoding: "utf8",
    }).replace(/\s+$/, "");
  } catch {
    return "";
  }
}

/**
 * 구역 정의 — `AGENTS.md` 의 표와 **같아야 한다.**
 * 한쪽만 고치면 문서와 검사가 어긋난다.
 *
 * `shared` 를 먼저 검사한다 — `AGENTS.md` 는 `.md` 이지만 콘텐츠가 아니라 공용이다.
 * 순서가 뒤집히면 공용 파일이 콘텐츠로 분류돼 이 검사가 자기 자신에 걸린다.
 */
const ZONES = [
  {
    id: "shared",
    label: "경계·공용",
    owner: "먼저 말하고 만진다",
    match: (p) =>
      ["AGENTS.md", "CLAUDE.md", "README.md", "app/page.tsx", "app/layout.tsx", "app/sitemap.ts"].includes(p) ||
      p.startsWith("app/shoe-finder/"),
  },
  {
    id: "code",
    label: "코드·도구",
    owner: "Claude Code",
    match: (p) =>
      /^(scripts|lib|components)\//.test(p) ||
      p.startsWith(".github/") ||
      p.startsWith(".githooks/") ||
      ["package.json", "package-lock.json", "tsconfig.json", "next.config.ts", "eslint.config.mjs"].includes(p),
  },
  {
    id: "content",
    label: "콘텐츠·문서",
    owner: "Cowork",
    match: (p) => /^app\/(injury|compare|courses|races|tier-list|community|tools)\//.test(p) || p.endsWith(".md"),
  },
];

function zoneOf(p) {
  for (const z of ZONES) if (z.match(p)) return z;
  return null; // 분류 안 되는 것 — 기타
}

// ── 지금 바뀐 파일 (스테이징 + 워킹트리) ──────────────────────
const porcelain = git("status", "--porcelain");
if (!porcelain) {
  console.log(dim("바뀐 파일이 없습니다."));
  process.exit(0);
}

const files = porcelain
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    // 형식: `XY <path>` 또는 rename 의 `XY <old> -> <new>`
    const p = line.slice(3).trim();
    return p.includes(" -> ") ? p.split(" -> ")[1] : p;
  })
  .map((p) => p.replace(/^"|"$/g, ""));

const byZone = new Map();
const unknown = [];
for (const f of files) {
  const z = zoneOf(f);
  if (!z) {
    unknown.push(f);
    continue;
  }
  if (!byZone.has(z.id)) byZone.set(z.id, { zone: z, files: [] });
  byZone.get(z.id).files.push(f);
}

// ── 출력 ─────────────────────────────────────────────────────
console.log(bold("\n담당 구역"));
for (const z of ZONES) {
  const hit = byZone.get(z.id);
  if (!hit) continue;
  console.log(`\n  ${bold(z.label)} ${dim(`— ${z.owner}`)}`);
  for (const f of hit.files) console.log(`    ${f}`);
}
if (unknown.length) {
  console.log(`\n  ${bold("기타")} ${dim("— 구역 미분류")}`);
  for (const f of unknown) console.log(`    ${f}`);
  console.log(dim(`\n  ※ 구역에 안 들어가는 파일입니다. scripts/check-zones.mjs 의 ZONES 에 추가할지 판단하세요.`));
}

const hasCode = byZone.has("code");
const hasContent = byZone.has("content");

if (hasCode && hasContent) {
  console.log(
    red(bold("\n✗ 코드 구역과 콘텐츠 구역이 같이 바뀌어 있습니다.")) +
      `\n\n  둘 중 하나가 ${bold("다른 에이전트의 작업")}일 수 있습니다.` +
      `\n  ${bold("npm run ship 은 git add -A 를 하므로 그대로 같이 커밋됩니다.")}` +
      `\n\n  ${bold("확인하세요")} — 위 목록이 전부 내가 한 작업이 맞습니까?` +
      `\n\n  ${green("맞다면")}   커밋을 나누는 쪽이 이력이 깨끗합니다:` +
      `\n    git add ${[...(byZone.get("code")?.files ?? [])].slice(0, 2).join(" ")} …` +
      `\n    git commit -m "..."` +
      `\n  ${dim("또는 그대로 가려면  git commit --no-verify")}` +
      `\n\n  ${yellow("아니라면")} 상대 작업이 섞인 것입니다. 사람에게 알리세요.` +
      `\n  ${dim("구역 표는 AGENTS.md 「에이전트 두 개가 동시에 작업한다」 절에 있습니다.")}\n`
  );
  process.exit(1);
}

console.log(green(bold("\n✓ 한 구역 안에서만 바뀌었습니다.\n")));
process.exit(0);
