#!/usr/bin/env node
/**
 * 추천 엔진 출력 회귀 검사 — 2026-10-06
 *
 * 왜 만들었나
 * ───────────
 * 인용 전수 대조에서 「가중치를 약 1/3로 줄였다」는 주석과 실제 순위가 달랐다(평발 사용자에게
 * 안정화화 +15 vs 중립화 −2). 코드를 고친 뒤 **출력을 재지 않았기** 때문이다(AGENTS.md 판단 전 3문 ③).
 * 그리고 점수 100점 상한 때문에 동점이 대부분이었고, 동점 순위는 신발 배열 순서가 정했다 —
 * 신발을 하나 추가하면 추천이 조용히 바뀌었다.
 *
 * 하는 일
 * ───────
 * 1. 불변식 — 끄기로 결정한 축은 정말 꺼져 있어야 한다.
 *    · 체중은 순위에 안 쓴다(2026-10-06 hyun 결정). 키 구간이 같으면 체중만 바꿔도 상위 3개가 같아야 한다.
 * 2. 스냅샷 — 대표 프로필의 상위 3개를 lib/shoes/engine-snapshot.json 과 비교한다.
 *    달라지면 실패. 의도한 변경이면 `npm run engine:snapshot` 으로 갱신하고 커밋 메시지에 이유를 적는다.
 *
 * 사용법
 *   node scripts/check-engine.mjs           검사
 *   node scripts/check-engine.mjs --write   스냅샷 갱신
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { createJiti } from "jiti";

const ROOT = path.resolve(import.meta.dirname, "..");
const SNAP = process.env.SNAP_PATH || path.join(ROOT, "lib/shoes/engine-snapshot.json");
const jiti = createJiti(import.meta.url);
const { recommendShoes } = await jiti.import(path.join(ROOT, "lib/shoes/recommend.ts"));

const HEIGHTS = [158, 170, 182];
const WEIGHTS = [48, 68, 92];
const FOOT = ["flat", "neutral", "high_arch"];
const WIDTH = ["normal", "wide"];
const GENDER = ["female", "male", undefined];
const EXTRA = [
  { level: "beginner" },
  { level: "beginner", injuryHistory: ["achilles"] },
  { level: "beginner", injuryHistory: ["plantar"] },
  { distance: "long" },
];

function key(p) {
  return [p.heightCm, p.weightKg, p.footType, p.footWidth, p.gender ?? "-", p.level ?? "-",
    (p.injuryHistory ?? []).join("+") || "-", p.distance ?? "-"].join("|");
}

const profiles = [];
for (const heightCm of HEIGHTS) for (const weightKg of WEIGHTS) for (const footType of FOOT)
  for (const footWidth of WIDTH) for (const gender of GENDER) for (const extra of EXTRA)
    profiles.push({ heightCm, weightKg, footType, footWidth, gender, ...extra });

const out = {};
for (const p of profiles) out[key(p)] = recommendShoes(p).primary.map((r) => r.shoe.id);

// 1. 불변식 — 체중 독립
const problems = [];
for (const p of profiles) {
  if (p.weightKg !== WEIGHTS[0]) continue;
  const base = out[key(p)].join(",");
  for (const w of WEIGHTS.slice(1)) {
    const other = out[key({ ...p, weightKg: w })].join(",");
    if (other !== base) { problems.push(`체중만 다른데 상위 3개가 다름: ${key(p)} → ${w}kg`); break; }
  }
}

if (process.argv.includes("--write")) {
  if (problems.length) {
    console.error(`불변식 실패 ${problems.length}건 — 스냅샷을 쓰지 않음\n  ` + problems.slice(0, 5).join("\n  "));
    process.exit(1);
  }
  writeFileSync(SNAP, JSON.stringify(out, null, 0).replace(/\],"/g, '],\n"') + "\n");
  console.log(`스냅샷 갱신: ${Object.keys(out).length}개 프로필 → lib/shoes/engine-snapshot.json`);
  process.exit(0);
}

if (!existsSync(SNAP)) problems.push("스냅샷 없음 — npm run engine:snapshot");
else {
  const snap = JSON.parse(readFileSync(SNAP, "utf8"));
  const diffs = Object.keys(out).filter((k) => (snap[k] ?? []).join(",") !== out[k].join(","));
  if (diffs.length) {
    problems.push(
      `상위 3개가 스냅샷과 다른 프로필 ${diffs.length}/${Object.keys(out).length}개 — 의도한 변경이면 \`npm run engine:snapshot\` 후 커밋 메시지에 이유를 적을 것`,
      ...diffs.slice(0, 5).map((k) => `  ${k}: ${(snap[k] ?? []).join(",")} → ${out[k].join(",")}`)
    );
  }
}

if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
console.log(`추천 엔진 ${Object.keys(out).length}개 프로필 — 체중 독립 · 스냅샷 일치`);
