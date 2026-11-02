#!/usr/bin/env node
/**
 * 공식몰 자동 확인 검사 — lib/shoes/official.json (2026-11-02)
 *
 * 이 파일은 비공개 저장소 ddaiga-pipeline 의 신발 수집기만 쓴다. 수집기가 사람 확인 없이 푸시하므로
 * 이 검사가 마지막 문이다. 하나라도 어긋나면 실패하고, 수집기 워크플로는 푸시하지 않는다.
 *
 * 실패로 잡는 것
 *  ① data.ts 에 없는 신발 id — 지운 신발의 기록이 남으면 안 된다
 *  ② checkedBy 가 "수집기" 가 아님 — 이 파일은 수집기 전용이다
 *  ③ checkedAt 형식 오류·미래 날짜
 *  ④ listed 가 true/false 가 아님. listed=true 인데 priceKrw 없음
 *  ⑤ priceKrw 가 정수가 아니거나 1만~200만 원 밖 — 자릿수 오류 방지
 *  ⑥ url 이 https 가 아니거나 네 공식몰 밖 주소
 *  ⑦ brand 가 data.ts 의 그 신발 brand 와 다름
 *  ⑧ 알 수 없는 필드
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const HOSTS = new Set(["www.asics.co.kr", "saucony.co.kr", "www.brooksrunning.co.kr", "kor.mizuno.com"]);
const FIELDS = new Set(["brand", "priceKrw", "listed", "url", "widths", "newerModel", "checkedAt", "checkedBy"]);

const official = JSON.parse(await readFile(path.join(ROOT, "lib/shoes/official.json"), "utf8"));
const dataTs = await readFile(path.join(ROOT, "lib/shoes/data.ts"), "utf8");
const brandOf = new Map();
for (const part of dataTs.split(/\n\s*\{\s*\n\s*id:\s*"/).slice(1)) {
  const id = part.split('"', 1)[0];
  brandOf.set(id, (part.match(/\n\s*brand:\s*"([^"]*)"/) || [])[1]);
}

const today = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
const errors = [];
const bad = (id, msg) => errors.push(`${id}: ${msg}`);

if (typeof official !== "object" || Array.isArray(official) || official === null) {
  errors.push("official.json 은 { 신발id: {...} } 객체여야 합니다");
} else {
  for (const [id, e] of Object.entries(official)) {
    if (!brandOf.has(id)) { bad(id, "data.ts 에 없는 신발"); continue; }
    for (const k of Object.keys(e)) if (!FIELDS.has(k)) bad(id, `알 수 없는 필드 ${k}`);
    if (e.checkedBy !== "수집기") bad(id, 'checkedBy 는 "수집기" 만');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.checkedAt ?? "") || Number.isNaN(Date.parse(e.checkedAt))) bad(id, "checkedAt 형식");
    else if (e.checkedAt > today) bad(id, "checkedAt 이 미래");
    if (typeof e.listed !== "boolean") bad(id, "listed 는 true/false");
    if (e.listed && e.priceKrw === undefined) bad(id, "listed=true 인데 priceKrw 없음");
    if (e.priceKrw !== undefined && !(Number.isInteger(e.priceKrw) && e.priceKrw >= 10000 && e.priceKrw <= 2000000))
      bad(id, `priceKrw 범위 밖 ${e.priceKrw}`);
    if (e.url !== undefined) {
      try {
        const u = new URL(e.url);
        if (u.protocol !== "https:" || !HOSTS.has(u.host)) bad(id, `공식몰 밖 주소 ${u.host}`);
      } catch { bad(id, "url 형식"); }
    }
    if (e.brand !== brandOf.get(id)) bad(id, `brand 불일치 ${e.brand} ≠ ${brandOf.get(id)}`);
    if (e.widths !== undefined && !(Array.isArray(e.widths) && e.widths.every((w) => typeof w === "string"))) bad(id, "widths 형식");
    if (e.newerModel !== undefined && typeof e.newerModel !== "string") bad(id, "newerModel 형식");
  }
}

if (errors.length) {
  console.error(`공식몰 자동 확인 검사 실패 ${errors.length}건`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log(`공식몰 자동 확인 ${Object.keys(official).length}종 · 형식 통과`);
