#!/usr/bin/env node
/**
 * 대회 일정 자동 정리 — **끝난 대회를 치우고, 오래된 확인을 표시한다.**
 *
 *   npm run races:sweep           무엇이 바뀌는지만 보여준다 (기본: 안 쓴다)
 *   npm run races:sweep -- --write  실제로 lib/races.json 을 고친다
 *
 * ─────────────────────────────────────────────────────────────
 * 이게 "자동화 루프"의 심장이다 (2026-09-12)
 *
 * 사용자 요청: *"대회 일정 허브는 자동화 루프 만들어 놓으면 돼."*
 *
 * 그런데 **자동화할 수 있는 것과 없는 것이 갈린다.**
 *
 *   자동으로 해도 되는 것 — 시간이 지나면 **확실히** 참이 되는 판정
 *     · 대회 날짜가 지났다 → 목록에서 뺀다
 *     · 확인한 지 60일이 넘었다 → 다시 보라고 표시한다
 *
 *   **자동으로 하면 안 되는 것** — 새 사실을 만들어 넣는 일
 *     · 새 대회를 어디선가 긁어 와서 날짜를 채우는 것
 *
 * 두 번째를 자동화하면 **틀린 날짜가 사람 확인 없이 배포된다.**
 * 이 저장소는 그걸로 이미 당했다 — 내가 지어낸 뚝섬 좌표가 숫자 검사를 전부
 * 통과하고 배포돼서 경로선이 한강을 가로질렀다. 숫자는 그럴듯했다.
 * 대회 날짜는 사람이 **돈을 내고 이동한다.** 더 나쁘다.
 *
 * 그래서 이 루프는 **빼는 쪽만 자동이고, 넣는 쪽은 사람이다.**
 * 시간이 증명하는 것만 기계가 하고, 사실을 만드는 일은 안 한다.
 *
 * ─────────────────────────────────────────────────────────────
 * 새 대회는 어떻게 들어오나
 *
 * `scripts/fetch-races.mjs` 가 후보를 모아 `outputs/races-proposed.html` 로 낸다.
 * 사람이 접수처를 **직접 열어 확인하고** `lib/races.json` 에 넣는다.
 * `image-sheet.mjs` · `affiliate-check.mjs` 와 같은 설계다 —
 * **기계가 못 하는 판정을 흉내내지 않고, 사람이 1분에 끝내도록 화면을 만든다.**
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const FILE = join(ROOT, "lib", "races.json");
const WRITE = process.argv.includes("--write");
const STALE_DAYS = 60;

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;

const today = new Date(Date.now() + 9 * 3_600_000).toISOString().slice(0, 10);
const races = JSON.parse(readFileSync(FILE, "utf8"));

const past = races.filter((r) => r.date && r.date < today);
const kept = races.filter((r) => !(r.date && r.date < today));
const stale = kept.filter(
  (r) => r.checkedAt && (new Date(today) - new Date(r.checkedAt)) / 86_400_000 > STALE_DAYS
);

console.log(`\n대회 ${races.length}건`);
console.log(`  지난 대회 ${past.length}건 · 남길 것 ${kept.length}건 · 재확인 필요 ${stale.length}건\n`);

for (const r of past) console.log(dim(`  − ${r.date}  ${r.name}  (지남)`));
for (const r of stale)
  console.log(
    yellow(
      `  ? ${r.date ?? "날짜 미정"}  ${r.name}  — ${Math.round(
        (new Date(today) - new Date(r.checkedAt)) / 86_400_000
      )}일 전 확인`
    )
  );

if (!past.length && !stale.length) {
  console.log(green("정리할 것이 없습니다."));
  process.exit(0);
}

if (!WRITE) {
  console.log(dim("\n  실제로 고치려면: npm run races:sweep -- --write"));
  console.log(dim("  (재확인 필요 항목은 자동으로 안 고칩니다 — 사람이 접수처를 열어 봐야 합니다)\n"));
  process.exit(0);
}

/**
 * 지난 대회는 **지우지 않고 보관한다.**
 * 작년 대회 정보는 "올해도 열리나"를 판단할 때 쓸모가 있고,
 * 무엇보다 **지운 기록은 되돌릴 수 없다.** 화면에서는 `lib/races.ts` 가 거른다.
 */
const archivePath = join(ROOT, "lib", "races.past.json");
let archive = [];
try {
  archive = JSON.parse(readFileSync(archivePath, "utf8"));
} catch {
  archive = [];
}
const archiveIds = new Set(archive.map((r) => r.id));
for (const r of past) if (!archiveIds.has(r.id)) archive.push(r);

writeFileSync(archivePath, JSON.stringify(archive, null, 2) + "\n", "utf8");
writeFileSync(FILE, JSON.stringify(kept, null, 2) + "\n", "utf8");

console.log(green(`\n지난 대회 ${past.length}건을 lib/races.past.json 으로 옮겼습니다.`));
if (stale.length)
  console.log(
    yellow(`재확인 필요 ${stale.length}건은 그대로 뒀습니다 — 접수처를 열어 보고 checkedAt 을 고치세요.`)
  );
console.log();
