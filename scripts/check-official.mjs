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
 *  ⑥ url 이 https 가 아니거나 수집기가 읽는 공식몰 밖 주소 (2026-11-10 뉴발란스·온·아디다스·푸마·나이키 추가 — 파이프라인 sources.py 와 같은 목록)
 *  ⑦ brand 가 data.ts 의 그 신발 brand 와 다름
 *  ⑧ 알 수 없는 필드
 *
 * 2026-11-10 lib/shoes/auto.json (수집기가 자동 추가한 새 신발)도 같이 본다
 *  ⑨ data.ts 와 id 가 겹침 · 같은 브랜드에 같은 모델이 data.ts 에 이미 있음(사람이 넣었으면 수집기가 지워야 한다)
 *  ⑩ kind 가 nextGen/newFamily 가 아님 · nextGen 인데 이전 세대(basedOn)가 data.ts·auto.json 어디에도 없거나 브랜드가 다름
 *  ⑪ 필수값(이름·가격·공식몰 주소·https 사진·무게·드롭) 없음 · 무게 150~400g · 드롭 0~14mm 밖 · checkedBy·checkedAt 형식
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const HOSTS = new Set([
  "www.asics.co.kr", "saucony.co.kr", "www.brooksrunning.co.kr", "kor.mizuno.com",
  "www.nbkorea.com", "www.on.com", "www.adidas.co.kr", "kr.puma.com", "www.nike.com",
]);
const FIELDS = new Set(["brand", "priceKrw", "listed", "url", "widths", "newerModel", "checkedAt", "checkedBy"]);

const official = JSON.parse(await readFile(path.join(ROOT, "lib/shoes/official.json"), "utf8"));
const auto = JSON.parse(await readFile(path.join(ROOT, "lib/shoes/auto.json"), "utf8"));
const AUTO_FIELDS = new Set(["kind", "brand", "model", "gender", "basedOn", "priceKrw", "url", "imageUrl", "weightG", "weightBasis",
  "dropMm", "checkedAt", "checkedBy"]);
const dataTs = await readFile(path.join(ROOT, "lib/shoes/data.ts"), "utf8");
const brandOf = new Map();
const modelsOf = new Set();
for (const part of dataTs.split(/\n\s*\{\s*\n\s*id:\s*"/).slice(1)) {
  const id = part.split('"', 1)[0];
  brandOf.set(id, (part.match(/\n\s*brand:\s*"([^"]*)"/) || [])[1]);
  modelsOf.add(`${brandOf.get(id)}|${(part.match(/\n\s*model:\s*"([^"]*)"/) || [])[1]}`);
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

if (typeof auto !== "object" || Array.isArray(auto) || auto === null) {
  errors.push("auto.json 은 { 신발id: {...} } 객체여야 합니다");
} else {
  for (const [id, e] of Object.entries(auto)) {
    const tag = `auto ${id}`;
    if (brandOf.has(id)) bad(tag, "data.ts 와 id 가 겹침");
    if (!/^[a-z0-9-]+$/.test(id)) bad(tag, "id 는 영문 소문자·숫자·- 만");
    for (const k of Object.keys(e)) if (!AUTO_FIELDS.has(k)) bad(tag, `알 수 없는 필드 ${k}`);
    if (!["nextGen", "newFamily"].includes(e.kind)) bad(tag, `kind ${e.kind}`);
    if (!["male", "female", "unisex"].includes(e.gender)) bad(tag, `gender ${e.gender}`);
    if (typeof e.model !== "string" || !e.model.trim()) bad(tag, "model 없음");
    if (modelsOf.has(`${e.brand}|${e.model}`)) bad(tag, "data.ts 에 같은 모델이 있음 — 수집기가 지워야 한다");
    if (e.kind === "nextGen") {
      const baseBrand = brandOf.get(e.basedOn) ?? auto[e.basedOn]?.brand;
      if (!baseBrand) bad(tag, `이전 세대 ${e.basedOn} 없음`);
      else if (baseBrand !== e.brand) bad(tag, `이전 세대 브랜드 불일치 ${baseBrand}`);
    }
    if (e.checkedBy !== "수집기") bad(tag, 'checkedBy 는 "수집기" 만');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.checkedAt ?? "") || Number.isNaN(Date.parse(e.checkedAt))) bad(tag, "checkedAt 형식");
    else if (e.checkedAt > today) bad(tag, "checkedAt 이 미래");
    if (!(Number.isInteger(e.priceKrw) && e.priceKrw >= 10000 && e.priceKrw <= 2000000)) bad(tag, `priceKrw 범위 밖 ${e.priceKrw}`);
    if (!(Number.isInteger(e.weightG) && e.weightG >= 150 && e.weightG <= 400)) bad(tag, `weightG 범위 밖 ${e.weightG}`);
    if (!(typeof e.dropMm === "number" && e.dropMm >= 0 && e.dropMm <= 14)) bad(tag, `dropMm 범위 밖 ${e.dropMm}`);
    try {
      const u = new URL(e.url);
      if (u.protocol !== "https:" || !HOSTS.has(u.host)) bad(tag, `공식몰 밖 주소 ${u.host}`);
    } catch { bad(tag, "url 형식"); }
    try {
      if (new URL(e.imageUrl).protocol !== "https:") bad(tag, "사진은 https 만");
    } catch { bad(tag, "imageUrl 형식"); }
  }
}

if (errors.length) {
  console.error(`공식몰 자동 확인 검사 실패 ${errors.length}건`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log(`공식몰 자동 확인 ${Object.keys(official).length}종 · 자동 추가 ${Object.keys(auto).length}종 · 형식 통과`);
