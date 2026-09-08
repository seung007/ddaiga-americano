#!/usr/bin/env node
/**
 * 배포 한 방 — 검사 → 커밋 → 푸시. 출력은 짧게.
 *
 *   npm run ship "커밋 메시지"
 *   npm run ship                 # 메시지 없으면 변경 파일로 자동 작성
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 만들었나 (2026-09-08)
 *
 * 사용자가 매번 이 네 줄을 손으로 실행하고, **그 출력 전체를 대화에 붙여넣었다.**
 *
 *   npm run routes / git add -A / git commit -m "..." / git push
 *
 * 붙여넣은 것 대부분이 정보가 아니었다 —
 *   · CRLF 경고 106줄 (`.gitattributes` 로 없앴다)
 *   · 통과한 검사 10줄 (원래 한 글자씩이지만 그래도 10줄)
 *   · git 의 객체 압축·델타 통계
 * 한 번에 2~3천 토큰. 이 세션에서 다섯 번.
 *
 * 그리고 더 나쁜 게 있었다 — **`&&` 체인이 빈 커밋에서 끊겨 푸시가 안 됐다.**
 * 나는 "푸시했다"고 믿고 다음 작업을 했고, 배포된 화면은 옛 코드였다.
 * 그걸 알아내는 데 왕복 두 번이 더 들었다.
 *
 * 그래서 이 스크립트는 두 가지를 보장한다:
 *   ① **커밋할 게 없어도 푸시는 한다.** 밀린 커밋이 있으면 올라간다.
 *   ② 마지막에 **원격과 로컬이 같은지 확인해서 한 줄로 알려준다.**
 *      "푸시됐다"를 추측하지 않는다.
 *
 * 출력 규칙 — **성공은 짧게, 실패는 전부.** 붙여넣기 비용이 정보량에 비례해야 한다.
 */
import { spawnSync } from "node:child_process";

const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

const win = process.platform === "win32";
function run(cmd, args, { quiet = true } = {}) {
  const r = win
    ? spawnSync([cmd, ...args].join(" "), { encoding: "utf8", shell: true })
    : spawnSync(cmd, args, { encoding: "utf8" });
  const out = ((r.stdout ?? "") + (r.stderr ?? "")).trim();
  return { code: r.status ?? 1, out, show: quiet ? "" : out };
}

const msgArg = process.argv.slice(2).filter((a) => !a.startsWith("-")).join(" ");

// ── 1. 검사 ────────────────────────────────────────────────
process.stdout.write(dim("검사… "));
const check = run("npm", ["run", "--silent", "check"]);
if (check.code !== 0) {
  console.log(red("실패\n"));
  console.log(check.out); // 실패는 전부 보여준다
  console.log(red("\n커밋하지 않았습니다."));
  process.exit(1);
}
console.log(green("통과"));

// ── 2. 변경 확인 ───────────────────────────────────────────
const status = run("git", ["status", "--porcelain"]);
const changed = status.out ? status.out.split("\n").filter(Boolean) : [];

if (changed.length) {
  run("git", ["add", "-A"]);
  const msg =
    msgArg ||
    // 메시지를 안 주면 바뀐 파일로 사실만 적는다. **내용을 지어내지 않는다.**
    `chore: ${changed
      .slice(0, 3)
      .map((l) => l.slice(3).split("/").pop())
      .join(", ")}${changed.length > 3 ? ` 외 ${changed.length - 3}건` : ""}`;
  const commit = run("git", ["commit", "-m", JSON.stringify(msg)]);
  if (commit.code !== 0) {
    console.log(red("커밋 실패\n"));
    console.log(commit.out);
    process.exit(1);
  }
  console.log(green(`커밋 ${changed.length}개 파일`) + dim(` — ${msg}`));
} else {
  console.log(dim("변경 없음"));
}

// ── 3. 푸시 — 커밋할 게 없어도 한다 ────────────────────────
const branch = run("git", ["rev-parse", "--abbrev-ref", "HEAD"]).out;
const ahead = run("git", ["rev-list", "--count", `origin/${branch}..HEAD`]).out;

if (ahead === "0") {
  console.log(dim("올릴 커밋 없음 — 원격과 같습니다"));
} else {
  process.stdout.write(dim(`푸시 ${ahead}개… `));
  const push = run("git", ["push"]);
  if (push.code !== 0) {
    console.log(red("실패\n"));
    console.log(push.out);
    process.exit(1);
  }
  console.log(green("완료"));
}

// ── 4. 확인 — 추측하지 않는다 ──────────────────────────────
run("git", ["fetch", "-q", "origin"]);
const local = run("git", ["rev-parse", "HEAD"]).out.slice(0, 7);
const remote = run("git", ["rev-parse", `origin/${branch}`]).out.slice(0, 7);
const subject = run("git", ["log", "-1", "--pretty=%s"]).out;

console.log("");
if (local === remote) {
  console.log(bold(green(`✓ ${branch} ${local} 원격 일치`)) + dim(` — ${subject}`));
  console.log(dim("Vercel 배포는 1~2분 걸립니다."));
} else {
  console.log(red(`✗ 로컬 ${local} ≠ 원격 ${remote} — 아직 안 올라갔습니다`));
  process.exit(1);
}
