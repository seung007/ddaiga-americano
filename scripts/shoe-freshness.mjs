#!/usr/bin/env node
/**
 * 신발 최신성 검사 — 어느 모델을 언제 확인했는지 추적하고, 상한 검사 큐를 뽑는다.
 *
 * 왜 만들었나
 * ───────────
 * 2026-08-31에 신발 52종 중 **27종이 단종 구형**인 걸 발견했다. 표기는 4종에만 있었다.
 * 2026-09-01에 3종을 더 찾았다 — SuperComp Elite v4는 **1년 넘게** 구형이었다.
 *
 * 즉 **사람이 기억으로 관리하는 방식은 이미 두 번 실패했다.** 카탈로그를 155종으로
 * 늘리자는 이야기가 나왔는데, 자동화 없이 늘리면 그 부채가 3배가 된다.
 * 늘리기 전에 유지 장치부터 만든다.
 *
 * 이 도구가 하는 것 / 못 하는 것
 * ──────────────────────────────
 * **못 한다**: 신제품 출시를 스스로 감지하지 못한다. 브랜드마다 공지 방식이 다르고
 * 공개 API가 없다. 억지로 스크래핑하면 자주 깨지고, 깨진 걸 모른 채 지나가면
 * 지금과 똑같은 상태가 된다 — 조용히 틀린 데이터.
 *
 * **한다**: 각 모델을 마지막으로 확인한 날짜를 기록하고, 오래된 것부터
 * **확인 작업 큐**를 만들어준다. 검색어까지 뽑아준다. 사람(또는 에이전트)이
 * 그 큐만 처리하면 되고, 무엇이 확인 안 됐는지가 항상 보인다.
 *
 * 이게 정직한 자동화 범위다. "자동으로 최신 신발이 등록된다"는 지금 만들 수 없고,
 * 만들 수 있는 척하면 8월의 실패를 반복한다.
 *
 * 사용법
 *   npm run check:shoes            오래된 것부터 확인 큐 출력
 *   npm run check:shoes -- --all   전체 상태 표
 *   npm run check:shoes -- --json  기계용
 *
 * 마지막 확인일이 STALE_DAYS를 넘긴 모델이 있으면 exit 1.
 *
 * 두 가지 확인일은 섞지 않는다 (2026-11-17)
 *   사람 확인일   lib/shoes/verified.json — 사람이 스펙을 확인한 날. 이 스크립트도 기계 날짜로 덮어쓰지 않는다
 *   공식몰 확인일 lib/shoes/official.json 의 checkedAt — 수집기가 공식몰 목록에서 읽은 날(값이 바뀌었거나 14일이 지났을 때 갱신)
 * 공식몰 자동 확인이 없는 신발(수집기가 못 맞춘 모델·수집 대상 밖)은 사람 확인에만 기대므로 큐에서 먼저 보여 준다.
 * 큐에 오르는 기준(CHECK_DAYS)과 실패 기준(STALE_DAYS)은 그대로다 — 순서와 안내만 바뀌었다.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DATA = path.join(ROOT, "lib", "shoes", "data.ts");
const LEDGER = path.join(ROOT, "lib", "shoes", "verified.json");
const OFFICIAL = path.join(ROOT, "lib", "shoes", "official.json");

/** 이 날짜를 넘기면 확인 큐에 올린다 */
const CHECK_DAYS = 90;
/** 이 날짜를 넘기면 실패로 본다 (CI 게이트) */
const STALE_DAYS = 180;

const args = new Set(process.argv.slice(2));
const AS_JSON = args.has("--json");
const SHOW_ALL = args.has("--all");

const C = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

// ── data.ts에서 신발 목록 뽑기 ────────────────────────────────
function parseShoes(text) {
  const out = [];
  const re = /id:\s*"([^"]+)",\s*\n\s*brand:\s*"([^"]+)",\s*\n\s*model:\s*"([^"]+)",(\s*\n\s*successor:\s*"([^"]+)",)?/g;
  for (const m of text.matchAll(re)) {
    out.push({ id: m[1], brand: m[2], model: m[3], successor: m[5] ?? null });
  }
  return out;
}

/** 모델명에서 세대 번호를 뽑는다. "Gel-Kayano 32" → 32, "1080 v15" → 15 */
function generation(model) {
  const v = model.match(/\bv(\d+)\b/i);
  if (v) return Number(v[1]);
  const n = model.match(/(\d+)\s*(?:\(|$)/);
  return n ? Number(n[1]) : null;
}

function daysSince(iso) {
  if (!iso) return Infinity;
  const d = (Date.now() - new Date(iso + "T00:00:00Z").getTime()) / 86_400_000;
  return Math.floor(d);
}

// ── 실행 ──────────────────────────────────────────────────────
const text = await readFile(DATA, "utf8");
const shoes = parseShoes(text);

let ledger = {};
try {
  ledger = JSON.parse(await readFile(LEDGER, "utf8"));
} catch {
  // 처음 실행이면 비어 있다. 아래에서 만들어준다.
}

// 공식몰 자동 확인(수집기). 읽지 못하면 비어 있는 것으로 본다 — 그러면 전부 「공식몰 확인 없음」으로 보이니 아래에서 알린다.
let official = {};
let officialReadable = true;
try {
  official = JSON.parse(await readFile(OFFICIAL, "utf8"));
} catch {
  officialReadable = false;
}

const rows = shoes.map((s) => {
  const last = ledger[s.id] ?? null;
  const age = daysSince(last);
  const off = official[s.id] ?? null;
  return {
    ...s,
    lastVerified: last,
    ageDays: age === Infinity ? null : age,
    officialCheckedAt: off?.checkedAt ?? null,
    officialListed: off ? off.listed !== false : null,
    // 후속작 표기가 있으면 이미 구형으로 처리된 것이라 우선순위가 낮다.
    // 표기가 없는 것(= "현행"이라고 주장하는 것)이 틀렸을 때 손해가 크다.
    priority: s.successor ? 2 : 1,
    query: `${s.brand} ${s.model} successor ${(generation(s.model) ?? 0) + 1} release`,
  };
});

const byAge = (a, b) => (b.ageDays ?? 1e9) - (a.ageDays ?? 1e9);
// 공식몰 확인이 없는 것 먼저 → 후속작 표기 없는 것 먼저 → 오래된 것 먼저
const queueOrder = (a, b) => Number(!!a.officialCheckedAt) - Number(!!b.officialCheckedAt) || a.priority - b.priority || byAge(a, b);

const needCheck = rows.filter((r) => r.ageDays === null || r.ageDays >= CHECK_DAYS).sort(queueOrder);
// 큐에 오르는 나이와 상관없이, 사람 확인에만 기대는 신발 — 날짜가 지나기 전에 미리 보이게 한다
const humanOnly = rows.filter((r) => !r.officialCheckedAt).sort(queueOrder);

const stale = rows.filter((r) => r.ageDays === null || r.ageDays >= STALE_DAYS);

if (AS_JSON) {
  console.log(JSON.stringify({ total: rows.length, needCheck: needCheck.length, stale: stale.length, humanOnly: humanOnly.length, rows }, null, 2));
} else {
  console.log(C.bold(`\n신발 최신성 — 총 ${rows.length}종`));
  console.log(C.dim(`  확인 주기 ${CHECK_DAYS}일 · 실패 기준 ${STALE_DAYS}일\n`));

  if (SHOW_ALL) {
    for (const r of rows) {
      const mark = r.ageDays === null ? C.red("?") : r.ageDays >= STALE_DAYS ? C.red("✗") : r.ageDays >= CHECK_DAYS ? C.yellow("!") : C.green("✓");
      const age = r.ageDays === null ? "확인 기록 없음" : `${r.ageDays}일 전`;
      const off = r.officialCheckedAt ? `공식몰 ${r.officialCheckedAt}` : "공식몰 확인 없음";
      console.log(`${mark} ${(r.brand + " " + r.model).padEnd(38)} ${age.padStart(14)}  ${C.dim(off.padEnd(18))} ${r.successor ? C.dim("후속 " + r.successor) : ""}`);
    }
    console.log();
  }

  if (needCheck.length) {
    console.log(C.bold("확인이 필요한 모델 — 위에서부터 처리하세요"));
    console.log(C.dim('  순서: 공식몰 자동 확인이 없는 것 → 후속작 표기가 없는 것("현행"이라 주장하는 것) → 오래된 것.\n  자동 확인이 없으면 사람 확인이 유일한 날짜이고, 현행이라 적은 게 틀렸을 때 손해가 가장 큽니다.'));
    for (const r of needCheck.slice(0, 15)) {
      console.log(`  ${r.priority === 1 ? C.yellow("●") : C.dim("○")} ${r.brand} ${r.model}`);
      console.log(C.dim(`      검색: ${r.query}`));
    }
    if (needCheck.length > 15) console.log(C.dim(`  … 외 ${needCheck.length - 15}종`));
  } else {
    console.log(C.green("  모든 모델이 확인 주기 안에 있습니다."));
  }

  // 사람 확인에만 기대는 신발. 확인 필요 큐가 비어 있어도 따로 보인다 — 사람 확인일이 지나면 이 신발들은 확인할 다른 날짜가 없다
  if (humanOnly.length) {
    console.log(C.bold(`\n공식몰 자동 확인이 없는 신발 ${humanOnly.length}종 — 사람 확인에만 기대고 있습니다`));
    if (!officialReadable) console.log(C.red("  official.json 을 읽지 못했습니다 — 아래 숫자를 믿지 마세요"));
    console.log(C.dim("  (수집기가 이름을 못 맞췄거나 수집 대상이 아닌 모델. 이유는 이 스크립트가 알 수 없습니다)"));
    for (const r of humanOnly.slice(0, 15)) {
      const age = r.ageDays === null ? "확인 기록 없음" : `${r.ageDays}일 전`;
      console.log(`  ${r.priority === 1 ? C.yellow("●") : C.dim("○")} ${r.brand} ${r.model} ${C.dim("· 사람 확인 " + age)}`);
    }
    if (humanOnly.length > 15) console.log(C.dim(`  … 외 ${humanOnly.length - 15}종 (전체는 --all)`));
  }

  console.log(C.bold("\n─────────────────────────────"));
  console.log(
    `총 ${rows.length}종 · ${C.yellow(`확인 필요 ${needCheck.length}`)} · ${C.red(`기한 초과 ${stale.length}`)}` +
      ` · 공식몰 자동 확인 ${rows.length - humanOnly.length}종 · 없음 ${humanOnly.length}종`,
  );

  // 다 통과했는데 "확인을 마쳤으면 날짜를 적으세요"가 뜨면 안 된다.
  // 할 일이 없는데 할 일 안내가 나오면 출력 전체를 대충 보게 된다 —
  // 그게 9/2에 꼬리만 보고 "통과"라고 오판한 것과 같은 종류의 실패다.
  if (needCheck.length) {
    console.log(C.dim("\n확인을 마쳤으면 lib/shoes/verified.json 에 오늘 날짜를 적으세요."));
    console.log(C.dim(`  { "asics-gel-kayano-32": "${new Date().toISOString().slice(0, 10)}", ... }`));
  }

  // 2026-09-03: 만료가 한 날짜에 몰려 있으면 그날 52종이 한꺼번에 빨간불이 된다.
  // 지금 41종이 2026-08-28로 같아 2026-11-26에 절벽이 온다.
  // **날짜를 흩뿌려서 피하지는 않는다** — 확인하지 않은 날을 적는 것이기 때문이다.
  // 대신 절벽이 온다는 사실을 미리 알린다. 큐는 이미 우선순위대로 나오므로
  // 그날은 벽이 아니라 작업 목록이 된다.
  const byDate = new Map();
  for (const r of rows) if (r.lastVerified) byDate.set(r.lastVerified, (byDate.get(r.lastVerified) ?? 0) + 1);
  const [cliffDate, cliffCount] = [...byDate.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];
  if (cliffCount && cliffCount >= rows.length * 0.3) {
    const due = new Date(new Date(cliffDate).getTime() + CHECK_DAYS * 86_400_000).toISOString().slice(0, 10);
    console.log(C.dim(`\n참고: ${cliffDate}에 확인한 ${cliffCount}종이 ${due}에 한꺼번에 만료됩니다.`));
  }
  console.log();
}

// 원장이 없으면 뼈대를 만들어준다 (값은 비워둔다 — 확인하지 않은 것을 확인했다고 적지 않는다)
if (Object.keys(ledger).length === 0) {
  const skeleton = Object.fromEntries(rows.map((r) => [r.id, null]));
  await writeFile(LEDGER, JSON.stringify(skeleton, null, 2) + "\n", "utf8");
  console.log(C.dim(`  (원장 뼈대를 만들었습니다: lib/shoes/verified.json — 값은 전부 null입니다)\n`));
}

process.exit(stale.length ? 1 : 0);
