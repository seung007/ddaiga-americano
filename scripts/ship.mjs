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
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join as pjoin } from "node:path";

const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

const win = process.platform === "win32";
/**
 * `trim` 이 아니라 `trimEnd` 다 — 2026-09-08 에 이걸로 한 번 틀렸다.
 *
 * `git status --porcelain` 의 각 줄은 **앞 두 칸이 상태 문자**다:
 *   " M package-lock.json"   (공백 + M + 공백 + 경로)
 * 여기에 `trim()` 을 걸면 **첫 줄의 선행 공백이 사라지고** 정렬이 한 칸 밀린다.
 * 그래서 자동 생성 커밋 메시지가 이렇게 나갔다:
 *   `chore: ackage-lock.json, package.json, ship.mjs`   <- p 가 잘렸다
 *
 * 교훈: **정렬이 의미를 갖는 출력에 전역 trim 을 걸지 마라.**
 * 뒤쪽 개행만 잘라내고, 파싱은 정규식으로 명시한다.
 */
function run(cmd, args, { quiet = true } = {}) {
  const r = win
    ? spawnSync([cmd, ...args].join(" "), { encoding: "utf8", shell: true })
    : spawnSync(cmd, args, { encoding: "utf8" });
  const out = ((r.stdout ?? "") + (r.stderr ?? "")).replace(/\s+$/, "");
  return { code: r.status ?? 1, out, show: quiet ? "" : out };
}

/** porcelain 한 줄에서 경로만 뽑는다. 앞 두 칸이 상태 문자다. */
function porcelainPath(line) {
  const m = /^(..)\s+(.+)$/.exec(line);
  const path = m ? m[2] : line;
  // 이름 변경은 "old -> new" 로 온다. 새 이름을 쓴다.
  return path.includes(" -> ") ? path.split(" -> ").pop() : path;
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
const changed = status.out ? status.out.split("\n").filter((l) => l.trim()) : [];

if (changed.length) {
  run("git", ["add", "-A"]);
  const msg =
    msgArg ||
    // 메시지를 안 주면 바뀐 파일로 사실만 적는다. **내용을 지어내지 않는다.**
    `chore: ${changed
      .slice(0, 3)
      .map((l) => porcelainPath(l).split("/").pop())
      .join(", ")}${changed.length > 3 ? ` 외 ${changed.length - 3}건` : ""}`;
  /**
   * 메시지를 **파일로 넘긴다.** `-m` 에 문자열을 주면 인용 문제가 생긴다 —
   * Windows 는 shell:true 라 따옴표가 필요하고 Linux 는 shell:false 라 따옴표가
   * **메시지 안에 그대로 박힌다.** 실제로 그렇게 커밋됐다:
   *   "chore(하네스): 왕복 줄이기 — ..."   <- 따옴표가 제목의 일부가 됐다
   * `-F` 는 플랫폼과 무관하고 여러 줄 메시지도 그대로 들어간다.
   */
  const msgFile = pjoin(tmpdir(), `ship-msg-${process.pid}.txt`);
  writeFileSync(msgFile, msg + "\n", "utf8");
  const commit = run("git", ["commit", "-F", msgFile]);
  try { unlinkSync(msgFile); } catch {}
  if (commit.code !== 0) {
    console.log(red("커밋 실패\n"));
    console.log(commit.out);
    process.exit(1);
  }
  console.log(green(`커밋 ${changed.length}개 파일`) + dim(` — ${msg}`));
} else {
  console.log(dim("변경 없음"));
}

/**
 * 배포 지문 — 지금 떠 있는 빌드를 식별한다.
 *
 * 2026-09-08: 이걸로 왕복 한 번을 또 날렸다. 푸시 직후 `npm run shot` 을 돌렸고,
 * **캡처가 Vercel 배포보다 먼저 찍혔다.** 나는 옛 화면을 보고 "아직 안 고쳐졌다"고
 * 판단했다. 커밋은 이미 올라가 있었다.
 *
 * "1~2분 걸립니다"라고 안내하는 것으로는 부족하다 — **사람이 시계를 보고 기다리게
 * 만드는 안내는 실패한다.** 기다림은 도구가 해야 한다.
 *
 * App Router 는 buildId 를 페이지에 안 박으니, `/_next/static/chunks/...` 스크립트
 * 목록을 지문으로 쓴다. 빌드가 바뀌면 청크 해시가 바뀐다.
 */
const SITE = "https://ddaiga-americano.vercel.app";
async function deployFingerprint(ms = 15_000) {
  try {
    const r = await fetch(SITE, { cache: "no-store", signal: AbortSignal.timeout(ms) });
    const html = await r.text();
    const chunks = [...html.matchAll(/\/_next\/static\/[^"']+/g)].map((m) => m[0]).sort();
    return chunks.join("|") || null;
  } catch {
    return null;
  }
}

const before = await deployFingerprint();

// ── 3. 푸시 — 커밋할 게 없어도 한다 ────────────────────────
const branch = run("git", ["rev-parse", "--abbrev-ref", "HEAD"]).out.trim();
const ahead = run("git", ["rev-list", "--count", `origin/${branch}..HEAD`]).out.trim();

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
const local = run("git", ["rev-parse", "HEAD"]).out.trim().slice(0, 7);
const remote = run("git", ["rev-parse", `origin/${branch}`]).out.trim().slice(0, 7);
const subject = run("git", ["log", "-1", "--pretty=%s"]).out.trim();

console.log("");
if (local === remote) {
  console.log(bold(green(`✓ ${branch} ${local} 원격 일치`)) + dim(` — ${subject}`));

  /**
   * **배포가 실제로 바뀔 때까지 기다린다.** 추측하지 않는다.
   * 올릴 커밋이 없었으면(ahead === "0") 배포도 안 바뀌니 기다리지 않는다.
   */
  if (ahead !== "0" && before) {
    process.stdout.write(dim("배포 반영 대기… "));
    const started = Date.now();
    let live = false;
    while (Date.now() - started < 180_000) {
      await new Promise((r) => setTimeout(r, 6_000));
      const now = await deployFingerprint();
      if (now && now !== before) { live = true; break; }
      process.stdout.write(dim("."));
    }
    const sec = Math.round((Date.now() - started) / 1000);
    console.log(
      live
        ? green(`반영됨 (${sec}초)`)
        : red(`3분 안에 안 바뀜 — Vercel 배포 로그를 확인하세요`)
    );
    if (live) console.log(dim("이제 npm run shot 을 돌려도 새 화면이 찍힙니다."));
  } else if (ahead === "0") {
    console.log(dim("배포도 그대로입니다."));
  }
} else {
  console.log(red(`✗ 로컬 ${local} ≠ 원격 ${remote} — 아직 안 올라갔습니다`));
  process.exit(1);
}
