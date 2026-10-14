/**
 * 스크립트용 사이트 주소 — `lib/site.ts` 와 같은 답을 낸다. (2026-10-14)
 * .mjs 는 TS 를 못 불러서 따로 둔다. 로컬 .env 의 NEXT_PUBLIC_SITE_URL 을 읽고, 없으면 환경변수, 그래도 없으면 vercel.app.
 * ⚠️ 로컬 .env 는 미구매 도메인이 들어 있을 수 있다(.env 주석 참고) — 운영 주소는 Vercel 환경변수가 정본이다.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

const FALLBACK = "https://ddaiga-americano.vercel.app";

function fromDotEnv() {
  try {
    const txt = readFileSync(path.resolve(import.meta.dirname, "..", "..", ".env"), "utf8");
    const m = /^\s*NEXT_PUBLIC_SITE_URL\s*=\s*"?([^"\r\n#]+)"?/m.exec(txt);
    return m?.[1]?.trim();
  } catch { return undefined; }
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || fromDotEnv() || FALLBACK).replace(/\/+$/, "");
