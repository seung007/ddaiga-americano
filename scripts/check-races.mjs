#!/usr/bin/env node
/**
 * 대회 일정 검사 — **틀린 날짜는 없는 것보다 나쁘다.**
 *
 *   npm run check:races          형식·논리만 (오프라인, 커밋 게이트)
 *   npm run check:races:live     접수처 주소가 살아 있는지까지 (네트워크, 주간 CI)
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 이렇게 빡빡한가 (2026-09-12)
 *
 * 이 저장소의 가장 센 규칙이 좌표였다 —
 * *"좌표를 지어내면 사람이 엉뚱한 데로 간다. 글자를 지어내는 것보다 나쁘다."*
 * **대회 날짜는 그보다 더하다.** 사람이 참가비를 내고 휴가를 쓰고 이동한다.
 * 하루 틀리면 아무 데도 못 간다.
 *
 * 그래서 "그럴듯한 값"이 통과하지 못하게 만든다.
 *
 * 실패로 잡는 것
 * ─────────────
 * ① `sourceUrl` 없음 — 출처 없는 일정은 **소문**이다
 * ② `checkedAt` 없음 / 형식 오류 — 언제 확인했는지 모르면 확인 안 한 것과 같다
 * ③ 날짜가 `YYYY-MM-DD` 가 아니거나 실재하지 않는 날(2월 30일 등)
 * ④ `status: "접수중"` 인데 날짜가 없음 — 접수 중인데 언제 뛰는지 모를 수 없다
 * ⑤ id 중복
 * ⑥ 거리 값이 0 이하이거나 100km 초과 — 오타 방지
 *
 * 경고만 하는 것 (실패 아님)
 * ────────────────────────
 * · `checkedAt` 이 60일 넘게 지남 — 일정은 바뀐다. 다시 열어 봐야 한다
 * · 지난 대회가 파일에 남아 있음 — 화면에서는 자동으로 빠지지만 정리하면 좋다
 *
 * ⚠️ **날짜가 비어 있는 것은 실패가 아니다.** "아직 모른다"를 표현할 방법이
 * 없으면 사람이 그럴듯한 값을 채워 넣게 된다. 그게 이 검사가 막으려는 바로 그 일이다.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const LIVE = process.argv.includes("--live");
const FILE = join(ROOT, "lib", "races.json");

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;

/** 실재하는 날짜인가. `2026-02-30` 같은 값을 Date 가 조용히 3월로 넘긴다. */
function isRealDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + "T00:00:00Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

let races;
try {
  races = JSON.parse(readFileSync(FILE, "utf8"));
} catch (e) {
  console.log(red(`\nlib/races.json 을 읽을 수 없습니다 — ${e.message}\n`));
  process.exit(1);
}
if (!Array.isArray(races)) {
  console.log(red("\nlib/races.json 은 배열이어야 합니다.\n"));
  process.exit(1);
}

const errors = [];
const warns = [];
const seen = new Set();
const today = new Date(Date.now() + 9 * 3_600_000).toISOString().slice(0, 10);

for (const [i, r] of races.entries()) {
  const at = `[${i}] ${r?.name ?? "(이름 없음)"}`;

  if (!r?.id) errors.push(`${at} — id 없음`);
  else if (seen.has(r.id)) errors.push(`${at} — id 중복: ${r.id}`);
  else seen.add(r.id);

  if (!r?.name) errors.push(`${at} — name 없음`);
  if (!r?.region) errors.push(`${at} — region 없음`);

  // ① 출처 — 이게 없으면 소문이다
  if (!r?.sourceUrl || !/^https?:\/\//.test(r.sourceUrl))
    errors.push(`${at} — sourceUrl 없음/형식 오류. **출처 없는 일정은 싣지 않는다**`);

  // ② 확인일
  if (!r?.checkedAt || !isRealDate(r.checkedAt))
    errors.push(`${at} — checkedAt 없음/형식 오류 (YYYY-MM-DD)`);
  else {
    const age = Math.round(
      (new Date(today) - new Date(r.checkedAt)) / 86_400_000
    );
    if (age > 60) warns.push(`${at} — ${age}일 전에 확인. 일정은 바뀝니다`);
  }

  // ③ 날짜 — 비어 있는 건 괜찮다. 있는데 틀린 게 문제다.
  if (r?.date !== null && r?.date !== undefined) {
    if (!isRealDate(r.date)) errors.push(`${at} — date 가 실재하는 날짜가 아님: ${r.date}`);
    else if (r.date < today) warns.push(`${at} — 지난 대회 (${r.date}). 화면에서는 자동으로 빠집니다`);
  }

  // ④ 접수중인데 날짜가 없다
  if (r?.status === "접수중" && !r?.date)
    errors.push(`${at} — status 가 "접수중" 인데 date 가 없습니다`);

  // ⑥ 거리 오타
  if (!Array.isArray(r?.distancesKm) || r.distancesKm.length === 0)
    errors.push(`${at} — distancesKm 없음`);
  else
    for (const km of r.distancesKm)
      if (typeof km !== "number" || km <= 0 || km > 100)
        errors.push(`${at} — distancesKm 값이 이상합니다: ${km}`);
}

console.log(`\n대회 일정 ${races.length}건`);

if (errors.length) {
  console.log(red(`\n실패 ${errors.length}건\n`));
  for (const e of errors) console.log(`  ✗ ${e}`);
  console.log(
    dim("\n  날짜가 틀리면 사람이 없는 대회에 갑니다. 참가비와 휴가가 걸린 정보입니다.\n")
  );
  process.exit(1);
}

if (warns.length) {
  console.log(yellow(`\n확인 필요 ${warns.length}건 (실패 아님)`));
  for (const w of warns) console.log(dim(`  · ${w}`));
  console.log();
}

// ── 접수처가 살아 있는지 (네트워크) ──────────────────────────
if (LIVE && races.length) {
  console.log(dim("접수처 주소 확인 중…"));
  const dead = [];
  for (const r of races) {
    try {
      const res = await fetch(r.sourceUrl, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(15_000),
        headers: { "User-Agent": "ddaiga-americano/1.0 (+https://ddaiga-americano.vercel.app)" },
      });
      if (!res.ok) dead.push(`${r.name} — HTTP ${res.status}  ${r.sourceUrl}`);
    } catch (e) {
      // 원인을 남긴다. name 만 찍으면 아무것도 못 고친다(AGENTS.md 사례).
      dead.push(`${r.name} — ${e.message}${e.cause?.code ? ` (${e.cause.code})` : ""}  ${r.sourceUrl}`);
    }
    await new Promise((r2) => setTimeout(r2, 400)); // 예절
  }
  if (dead.length) {
    console.log(red(`\n접수처가 응답하지 않는 대회 ${dead.length}건\n`));
    for (const d of dead) console.log(`  ✗ ${d}`);
    console.log(dim("\n  대회가 끝났거나 주소가 바뀐 것입니다. 확인하고 고치세요.\n"));
    process.exit(1);
  }
  console.log(green("접수처 전부 응답함"));
}

console.log(
  green(
    races.length
      ? `통과 — 형식·논리 이상 없음${LIVE ? " (접수처 확인 포함)" : ""}`
      : "통과 — 아직 등록된 대회가 없습니다"
  )
);
