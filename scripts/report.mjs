#!/usr/bin/env node
/**
 * 변경 보고 — **기억이 아니라 저장소에서 뽑는다.**
 *
 *   npm run report              오늘 것
 *   npm run report -- 3         최근 3일
 *   npm run report -- HEAD~5    특정 기준점부터
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 만들었나 (2026-09-12)
 *
 * 사용자 지적: *"계속 할루시네이션을 하는데 업데이트 목록도 축소하고
 * 내용도 바꿔서 이야기한다. 이걸 하네스로 잡으려면 어떻게 해야 하나."*
 *
 * 맞는 지적이고, **기계적 원인이 있다.**
 *
 * 나는 대화 끝마다 "오늘 나간 것" 표를 쓴다. 그 표를 **기억에서 쓴다.**
 * 턴이 길어질수록 기억과 저장소가 벌어지고, 벌어진 만큼 표가 틀린다.
 * 줄어들거나, 이름이 바뀌거나, 안 한 게 들어간다.
 *
 * 오늘의 실측 증거:
 *   · 커밋 `4a33b2b` 의 메시지는 "MBN 서울마라톤 등록 + race:add 도구"인데
 *     실제로는 **22개 파일**이 들어갔다 — Product 스키마, 목차 컴포넌트,
 *     계급도 페이지(316줄), 주제 축 필터, 대회 허브, 검사기 3개, 워크플로.
 *     **커밋 메시지만 봐서는 무엇이 나갔는지 알 수 없다.**
 *   · 그래서 내가 참조할 기록이 없었고, 기억으로 썼고, 틀렸다.
 *
 * ─────────────────────────────────────────────────────────────
 * 이 스크립트가 하는 일 — **보고문을 내가 안 쓴다**
 *
 * git 이력과 실제 파일에서 뽑아 **붙여넣을 수 있는 표**를 만든다.
 * 나는 그걸 그대로 옮긴다. 요약하거나 고르지 않는다.
 *
 * 이 저장소의 다른 도구와 같은 설계다 — `shot` 이 "화면을 봤다"를 대신하고,
 * `check:*` 가 "확인했다"를 대신하듯, 이건 **"무엇을 했다"를 대신한다.**
 * 셋 다 내가 기억으로 말하던 것을 기계가 말하게 바꾼 것이다.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const arg = process.argv.slice(2).find((a) => !a.startsWith("-"));

const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;

function git(...args) {
  try {
    return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).replace(/\s+$/, "");
  } catch {
    return "";
  }
}

/** 기준점 — 인수가 숫자면 N일 전, `HEAD~n` 같으면 그대로, 없으면 오늘 00:00 KST */
let range;
let label;
if (!arg) {
  const kst = new Date(Date.now() + 9 * 3_600_000).toISOString().slice(0, 10);
  range = ["--since", `${kst} 00:00 +0900`];
  label = `오늘(${kst})`;
} else if (/^\d+$/.test(arg)) {
  range = ["--since", `${arg} days ago`];
  label = `최근 ${arg}일`;
} else {
  range = [`${arg}..HEAD`];
  label = `${arg} 이후`;
}

const log = git("log", ...range, "--format=%h\t%s").split("\n").filter(Boolean);
if (log.length === 0) {
  console.log(dim(`\n${label} 커밋이 없습니다.\n`));
  process.exit(0);
}

const shas = log.map((l) => l.split("\t")[0]);
const first = shas[shas.length - 1];

/**
 * 파일별 변경량 — **커밋 메시지가 아니라 파일을 센다.**
 * 메시지는 뭉칠 수 있지만 파일 목록은 안 뭉친다.
 */
/**
 * ⚠️ 2026-09-12 — **이 도구가 만들자마자 틀렸다.**
 *
 * 처음엔 `삭제 줄 === 0` 이면 신규 파일로 찍었다. 그래서
 * `app/courses/page.tsx` 처럼 **줄을 더하기만 한 기존 파일**이 "신규"로 나왔다.
 *
 * 프록시를 답으로 쓴 것이다 — 알고 싶은 건 "이 파일이 새로 생겼나"인데
 * "삭제가 0인가"를 물었다. 두 답이 갈리는 경우가 바로 문제가 되는 경우다.
 * **할루시네이션을 잡겠다고 만든 도구가 같은 실수를 하면 안 된다.**
 *
 * git 에게 직접 묻는다: `--diff-filter=A` 는 그 구간에서 **추가된** 파일만 준다.
 */
const added = new Set(
  git("diff", "--name-only", "--diff-filter=A", `${first}~1`, "HEAD").split("\n").filter(Boolean)
);

const numstat = git("diff", "--numstat", `${first}~1`, "HEAD")
  .split("\n")
  .filter(Boolean)
  .map((l) => {
    const [add, del, path] = l.split("\t");
    return { add: +add || 0, del: +del || 0, path, isNew: added.has(path) };
  })
  .sort((a, b) => b.add + b.del - (a.add + a.del));

/** 영역 분류 — 사람이 읽는 단위로 묶는다. */
function area(p) {
  if (p.startsWith("app/") && p.endsWith("page.tsx")) return "페이지";
  if (p.startsWith("app/")) return "페이지";
  if (p.startsWith("components/")) return "컴포넌트";
  if (p.startsWith("scripts/")) return "도구·검사";
  if (p.startsWith("lib/")) return "데이터·로직";
  if (p.startsWith(".github/")) return "자동화";
  if (p.endsWith(".md")) return "문서";
  return "기타";
}

const byArea = new Map();
for (const f of numstat) {
  const a = area(f.path);
  if (!byArea.has(a)) byArea.set(a, []);
  byArea.get(a).push(f);
}

/** 새로 생긴 라우트 — "페이지를 만들었다"는 주장의 근거 */
const newRoutes = numstat
  .filter((f) => f.isNew && f.path.startsWith("app/") && f.path.endsWith("page.tsx"))
  .map((f) => "/" + f.path.slice(4).replace(/\/?page\.tsx$/, ""));

/** 새로 생긴 npm 스크립트 */
let newScripts = [];
try {
  const now = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).scripts ?? {};
  const before = JSON.parse(git("show", `${first}~1:package.json`) || "{}").scripts ?? {};
  newScripts = Object.keys(now).filter((k) => !(k in before));
} catch {
  /* 기준 커밋에 package.json 이 없으면 건너뛴다 */
}

// ── 출력 ─────────────────────────────────────────────────────
console.log(bold(`\n${label} 변경 보고`) + dim("  (git 에서 뽑음 — 기억이 아님)\n"));

console.log(bold(`커밋 ${log.length}개`));
for (const l of log) {
  const [sha, msg] = l.split("\t");
  const n = git("show", "--stat", "--format=", sha).split("\n").filter((x) => x.includes("|")).length;
  const warn = n >= 10 ? yellow(` ⚠ ${n}개 파일`) : dim(` ${n}개 파일`);
  console.log(`  ${sha}  ${msg}${warn}`);
}

const bigCommit = log.find((l) => {
  const sha = l.split("\t")[0];
  return git("show", "--stat", "--format=", sha).split("\n").filter((x) => x.includes("|")).length >= 10;
});
if (bigCommit) {
  console.log(
    yellow(`\n  ⚠ 파일 10개 이상인 커밋이 있습니다 — 메시지만으로는 내용을 알 수 없습니다.`)
  );
  console.log(dim(`     보고할 때 커밋 메시지 대신 아래 파일 목록을 쓰세요.`));
}

console.log(bold(`\n바뀐 파일 ${numstat.length}개`));
for (const [a, files] of [...byArea].sort((x, y) => y[1].length - x[1].length)) {
  console.log(`\n  ${bold(a)} ${dim(`(${files.length})`)}`);
  for (const f of files) {
    const sign = f.isNew ? green("신규") : dim("수정");
    console.log(`    ${sign}  ${f.path}  ${dim(`+${f.add} -${f.del}`)}`);
  }
}

if (newRoutes.length) {
  console.log(bold(`\n새 라우트 ${newRoutes.length}개`));
  for (const r of newRoutes) console.log(`  ${green("+")} ${r}`);
}
if (newScripts.length) {
  console.log(bold(`\n새 npm 스크립트 ${newScripts.length}개`));
  for (const s of newScripts) console.log(`  ${green("+")} npm run ${s}`);
}

/** 데이터 파일 건수 — "55개 등록했다" 같은 주장의 근거 */
const DATA = [
  ["lib/races.json", "대회"],
  ["lib/shoes/verified.json", "신발 검증"],
  ["lib/courses.routes.json", "코스 경로선"],
];
const counts = [];
for (const [p, name] of DATA) {
  if (!existsSync(join(ROOT, p))) continue;
  try {
    const v = JSON.parse(readFileSync(join(ROOT, p), "utf8"));
    counts.push(`${name} ${Array.isArray(v) ? v.length : Object.keys(v).length}건`);
  } catch {
    /* 읽기 실패는 조용히 넘긴다 — 이건 보고용이지 검사가 아니다 */
  }
}
if (counts.length) console.log(bold(`\n데이터 건수`) + `  ${counts.join(" · ")}`);

console.log(
  dim(`\n이 표를 그대로 옮기세요. 줄이거나 이름을 바꾸면 그게 곧 틀린 보고가 됩니다.\n`)
);
