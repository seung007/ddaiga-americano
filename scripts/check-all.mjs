#!/usr/bin/env node
/**
 * 검사기 전부 — 한 번에 돌리고 **한 줄로 답한다**
 *
 * 왜 만들었나 (2026-09-06)
 * ───────────────────────
 * 검사기가 6개가 됐다. 지금까지는 여섯 번 따로 돌리고 여섯 줄을 읽었다.
 * 그게 사람에게도 번거롭지만 **AI 에이전트에게는 토큰이다** — 통과한 검사기의
 * 출력은 읽을 필요가 없는데도 매번 맥락에 들어왔다.
 *
 * 그래서 원칙을 뒤집는다.
 *
 *   · **통과한 것은 한 글자도 출력하지 않는다.** 이름과 ✓만 남긴다
 *   · **실패한 것만** 전체 출력을 보여준다
 *   · 판정은 exit code (AGENTS.md §2 — 꼬리만 보고 통과라고 하지 마라)
 *
 * 이게 이 저장소가 배운 것과 같은 모양이다. 조용히 지나가는 것이 위험한 거지,
 * 조용히 통과하는 것은 위험하지 않다. **시끄러워야 할 자리에만 시끄럽다.**
 *
 *   npm run check          네트워크 없이 도는 것만 (빠름, 커밋 전용)
 *   npm run check:all      네트워크 검사까지 전부 (CI·주간 점검용)
 *
 * 하나라도 실패하면 exit 1.
 */

import { spawn } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const FULL = process.argv.includes("--full");

const C = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

/**
 * `net: true` 는 바깥 네트워크가 필요하다는 뜻이다.
 *
 * 샌드박스·오프라인에서는 이것들이 전부 "조회 실패"로 떨어지는데, 그건
 * **틀렸다는 뜻이 아니라 아무것도 검증되지 않았다는 뜻**이다.
 * 그래서 기본 실행에서는 빼고, `--full` 일 때만 돌린다.
 * 진짜 검증은 네트워크가 있는 CI에서 한다(`.github/workflows/checks.yml`).
 */
const CHECKS = [
  { name: "타입",     cmd: "npx",  args: ["tsc", "--noEmit"],                          net: false },
  { name: "인용",     cmd: "node", args: ["scripts/verify-citations.mjs", "--dry"],    net: false },
  { name: "신발",     cmd: "node", args: ["scripts/shoe-freshness.mjs"],               net: false },
  { name: "그림",     cmd: "node", args: ["scripts/check-figures.mjs"],                net: false },
  { name: "구매링크", cmd: "node", args: ["scripts/check-links.mjs", "--plan"],        net: false },
  { name: "사진출처", cmd: "node", args: ["scripts/check-images.mjs", "--plan"],       net: false },
  { name: "영상큐",   cmd: "node", args: ["scripts/verify-youtube.mjs", "--todo"],     net: false },
  // 2026-09-06 추가. GSC 가 "참조 페이지: 감지된 페이지 없음"이라고 한 날 만들었다.
  { name: "내부링크", cmd: "node", args: ["scripts/check-internal-links.mjs"],        net: false },
  // 2026-09-07 추가. 지도 3개가 200 성공 뒤에도 안 뜬 사건에서 나왔다.
  { name: "외부CDN",  cmd: "node", args: ["scripts/check-cdn.mjs"],                  net: false },
  // 경로선이 말이 되는 값인지. 직선거리보다 짧으면 계산이 틀린 것이다.
  { name: "경로선",   cmd: "node", args: ["scripts/fetch-course-routes.mjs", "--check"], net: false },
  // 제휴 링크는 주소에 상품 정보가 없어서 신발과 뒤바뀌어도 조용히 지나간다.
  // 이 검사는 **id 가 실재하는지**만 실패로 잡고, 사람 확인이 안 된 항목은 세어서 알린다.
  // 클릭 확인 자체는 쿠팡 도메인이 차단돼 Claude 가 못 한다 — scripts/affiliate-check.mjs 참고.
  { name: "제휴링크", cmd: "node", args: ["scripts/affiliate-check.mjs"],              net: false },
  // 앵커는 틀려도 404 도 콘솔 오류도 안 난다 — 눌러야만 안다. 그래서 검사가 본다.
  { name: "목차앵커", cmd: "node", args: ["scripts/check-toc.mjs"],                    net: false },
  // 대회 날짜는 사람이 참가비를 내고 이동하는 정보다. 좌표보다 세게 막는다.
  { name: "대회일정", cmd: "node", args: ["scripts/check-races.mjs"],                  net: false },

  { name: "인용(실조회)",   cmd: "node", args: ["scripts/verify-citations.mjs"], net: true },
  { name: "영상(실조회)",   cmd: "node", args: ["scripts/verify-youtube.mjs"],   net: true },
  { name: "구매링크(실조회)", cmd: "node", args: ["scripts/check-links.mjs"],    net: true },
  { name: "사진(실조회)",   cmd: "node", args: ["scripts/check-images.mjs"],     net: true },
  // 접수처가 죽으면 대회가 끝났거나 주소가 바뀐 것이다. 주간 CI 가 잡는다.
  { name: "대회접수처(실조회)", cmd: "node", args: ["scripts/check-races.mjs", "--live"], net: true },
];

function run(c) {
  return new Promise((resolve) => {
    /**
     * Windows 에서 npx 를 부르려면 shell 이 필요한데, args 와 shell:true 를
     * 같이 주면 Node 가 DEP0190 경고를 찍는다(인자가 이스케이프되지 않는다).
     * 그래서 Windows 에서는 **한 줄 명령으로 합쳐** 넘긴다. 인자는 전부
     * 이 파일 안에 적힌 고정값이라 외부 입력이 섞이지 않는다.
     */
    const win = process.platform === "win32";
    const p = win
      ? spawn([c.cmd, ...c.args].join(" "), { cwd: ROOT, shell: true })
      : spawn(c.cmd, c.args, { cwd: ROOT });
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (out += d));
    p.on("close", (code) => resolve({ ...c, code, out }));
    p.on("error", (e) => resolve({ ...c, code: -1, out: String(e) }));
  });
}

const list = CHECKS.filter((c) => FULL || !c.net);
console.log(
  C.bold(`\n검사 ${list.length}개${FULL ? " (네트워크 포함)" : " (오프라인만)"}\n`)
);

const results = [];
for (const c of list) {
  process.stdout.write(C.dim(`  ${c.name}…`));
  const r = await run(c);
  results.push(r);
  process.stdout.write(
    `\r  ${r.code === 0 ? C.green("✓") : C.red("✗")} ${c.name}${" ".repeat(Math.max(0, 14 - c.name.length))}\n`
  );
}

const failed = results.filter((r) => r.code !== 0);

// 통과한 것의 출력은 버린다. 읽을 이유가 없다.
for (const f of failed) {
  console.log(C.bold(C.red(`\n──── ${f.name} 실패 (exit ${f.code}) ────`)));
  console.log(f.out.trimEnd());
}

console.log(
  C.bold("\n─────────────────────────────\n") +
    (failed.length
      ? C.red(`실패 ${failed.length} / ${results.length}`)
      : C.green(`전부 통과 (${results.length}개)`))
);
if (!FULL) {
  console.log(
    C.dim("\n네트워크 검사(인용·영상·링크·사진 실조회)는 빠졌습니다. `npm run check:all` 로 전부 돌립니다.")
  );
  console.log(C.dim("샌드박스에서는 어차피 막히니, 진짜 조회는 GitHub Actions가 매주 대신 합니다.\n"));
} else {
  console.log("");
}

process.exit(failed.length ? 1 : 0);
