/**
 * 신발 목록 덤프 — 사람 원장(lib/shoes/data.ts)을 원장 서버(ddaiga-ledger)가 읽는 JSON 으로 뽑는다.
 *
 *   node scripts/dump-shoe-catalog.mjs            → outputs/shoe-catalog.json
 *   node scripts/dump-shoe-catalog.mjs --stdout   → 표준 출력
 *
 * 왜 (2026-11-17): 백엔드 1단계에서 Spring 원장이 신발 목록을 읽어야 한다. 그런데 신발의 원본은 data.ts(사람이 PR 로 고침)이고,
 * 같은 사실을 두 곳에 적으면 언젠가 어긋난다. 그래서 JSON 을 저장소에 커밋하지 않고 **필요할 때 data.ts 에서 다시 뽑는다**.
 * 수집기는 매 회차 사이트 저장소를 받아 오므로(daily.yml) 그 자리에서 이 스크립트를 돌리면 된다.
 *
 * - 원장이 판정에 쓰는 칸만 뽑는다(스펙·후속·성별·가격). 추천용 판단 필드·설명 글은 원장의 일이 아니라서 뺀다.
 * - 수집기가 자동으로 더한 신발(auto.json)은 넣지 않는다 — 그건 원장이 만들 결과지 입력이 아니다.
 * - 같은 data.ts 면 바이트까지 같은 결과가 나오게 한다(id 순 정렬, 생성 시각 없음). 원장이 변경 여부를 해시로 볼 수 있다.
 * - 칸이 비거나 id 가 겹치면 exit 1 — 빈 값을 0 으로 채워 넘기지 않는다(「`?? 0` 하나가 검사를 껐다」 사례).
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { createJiti } from "jiti";

const ROOT = path.resolve(import.meta.dirname, "..");
const jiti = createJiti(import.meta.url);
const { MANUAL_SHOES } = await jiti.import(path.join(ROOT, "lib/shoes/data.ts"));

const GENDERS = new Set(["male", "female", "unisex"]);
const problems = [];
const seen = new Set();

const num = (s, key) => {
  const v = s[key];
  if (typeof v !== "number" || !Number.isFinite(v)) problems.push(`${s.id}: ${key} 가 숫자가 아님 (${JSON.stringify(v)})`);
  return v;
};

const shoes = [...MANUAL_SHOES]
  .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
  .map((s) => {
    if (!s.id || seen.has(s.id)) problems.push(`id 비었거나 겹침: ${JSON.stringify(s.id)}`);
    seen.add(s.id);
    if (!s.brand || !s.model) problems.push(`${s.id}: brand·model 비어 있음`);
    if (!GENDERS.has(s.gender)) problems.push(`${s.id}: gender 값 이상 (${JSON.stringify(s.gender)})`);
    return {
      id: s.id,
      brand: s.brand,
      model: s.model,
      gender: s.gender,
      successor: s.successor ?? null,
      heelDropMm: num(s, "heelDropMm"),
      stackHeightMm: num(s, "stackHeightMm"),
      weightGramsM9: num(s, "weightGramsM9"),
      weightGramsW8: s.weightGramsW8 ?? null,
      priceKrw: num(s, "priceKrw"),
      krAvailability: s.krAvailability,
      widthOptions: s.widthOptions,
      sourceUrl: s.sourceUrl,
    };
  });

if (problems.length) {
  console.error(`신발 목록 덤프 실패 — ${problems.length}건:\n` + problems.map((p) => "  " + p).join("\n"));
  process.exit(1);
}

const json = JSON.stringify({ source: "lib/shoes/data.ts", count: shoes.length, shoes }, null, 2) + "\n";

if (process.argv.includes("--stdout")) {
  process.stdout.write(json);
} else {
  const out = path.join(ROOT, "outputs", "shoe-catalog.json");
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, json);
  console.log(`✓ 신발 ${shoes.length}종 → ${path.relative(ROOT, out)}`);
}
