#!/usr/bin/env node
/**
 * 신발 이미지 검사 — 52장이 실제로 뜨는지 본다.
 *
 * 왜 만들었나 (2026-09-06)
 * ───────────────────────
 * 52장 중 **40장이 `cdn.runrepeat.com`** 이다. 러닝화 리뷰 사이트, 즉 **경쟁사**다.
 * 남의 서버에 핫링크하고 있으므로 두 가지가 걸린다.
 *
 *   1) 상대가 리퍼러 차단을 켜는 순간 **40장이 한꺼번에 사라진다**
 *   2) 그리고 그 사실을 **아무도 모른다** — 배포는 성공하고 페이지도 200이다
 *
 * 2)가 진짜 문제다. 이 저장소가 반복해서 겪은 실패 — **조용히 틀린 상태** — 와 같은 종류다.
 * 신발 추천 사이트에서 신발 사진이 전부 깨져 있으면 남는 게 없는데,
 * GA에는 이탈률만 오르고 원인은 안 보인다.
 *
 * 브랜드 공식 CDN으로 옮기는 게 정답이다. 다만 2026-09-06 기준 그걸 못 했다 —
 * 이유를 정확히 적어 둔다(추측이 아니라 실제로 시도한 결과다).
 *
 *   · 아식스 한국몰은 상품 이미지를 클라이언트에서 그려서 정적 수집이 안 된다.
 *     게다가 검색이 `+`를 **공백이 아니라 삭제**한다 — "Novablast+5" → "Novablast5" → 0건.
 *   · 아식스 글로벌몰은 이미지 URL이 쿼리스트링을 물고 있어 브라우저 도구가 값을 가린다.
 *   · **뉴발란스·호카·온은 한국 공식몰 자체가 죽어 있다**(check-links.mjs 의 DEAD_DOMAINS).
 *     이 세 브랜드는 옮길 목적지가 아예 없다.
 *
 * URL을 지어내면 그 순간 이미지가 깨지고, 깨진 걸 아무도 모른다.
 * **AGENTS.md: URL을 추측하지 마라.** 그래서 옮기는 대신 **깨지면 시끄럽게** 만들었다.
 *
 * 무엇을 보나 / 못 보나
 * ────────────────────
 * **본다** — 상태코드, Content-Type이 실제 이미지인지, 리다이렉트 도착지
 * **못 본다** — 사진 속 신발이 그 모델이 맞는지. 그건 사람이 봐야 한다.
 *
 *   npm run check:images
 *
 * 하나라도 이미지가 아니면 exit 1.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DATA = path.join(ROOT, "lib", "shoes", "data.ts");

const CONCURRENCY = 4;
const TIMEOUT_MS = 15_000;

const C = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

/**
 * 우리 것이 아닌 호스트. 여기 있는 건 **언제든 끊길 수 있다**는 뜻이고,
 * 특히 `cdn.runrepeat.com`은 경쟁사라 끊길 이유가 있는 쪽이다.
 */
const FOREIGN = {
  "cdn.runrepeat.com": "경쟁사(러닝화 리뷰 사이트) CDN — 우선 옮길 대상",
  "gazellesports.com": "미국 소매점",
  "cdn.dsmcdn.com": "터키 쇼핑몰(Trendyol) CDN",
  "image.msscdn.net": "무신사 CDN",
  "storage.googleapis.com": "출처 불명 버킷",
};

const text = await readFile(DATA, "utf8");
const shoes = [];
{
  const re =
    /id:\s*"([^"]+)",\s*\n\s*brand:\s*"([^"]+)",\s*\n\s*model:\s*"([^"]+)",(?:[\s\S]{0,200}?)imageUrl:\s*"([^"]+)"/g;
  for (const m of text.matchAll(re)) {
    shoes.push({ id: m[1], brand: m[2], model: m[3], url: m[4] });
  }
}

/**
 * 파일명에 모델명이 들어 있는가 — **다른 신발 사진을 걸러낸다** (2026-09-09 추가)
 *
 * 왜 만들었나: 아드레날린 GTS 25 의 공식 사진을 찾겠다고 브룩스 제품 URL 을
 * **조립해서** 열었더니, 그 상품번호(110435)는 아드레날린이 아니라 **Revel 7** 이었다.
 * 파일명이 이렇게 왔다:
 *
 *   110435-072-l-revel-7-mens-fast-running-and-training-shoe.png
 *
 * 그대로 넣었으면 아드레날린 페이지에 Revel 7 사진이 걸렸을 것이다.
 * 화면은 멀쩡하고, 200 으로 열리고, Content-Type 도 이미지다.
 * **기존 검사 전부를 통과하는 틀린 사진**이다.
 *
 * 완벽하진 않다 — CDN 이 숫자만 쓰는 경우(`storage.googleapis.com/.../141501426.webp`)
 * 는 판정할 수 없다. 그래서 **판정 불가는 실패로 만들지 않고 따로 센다.**
 * 잡을 수 있는 것만 잡는다. 잡을 수 없는 것을 통과로 위장하지 않는다.
 *
 * 지금 걸리는 것: Ultraboost 25 의 사진 파일명이 `adidas-ultraboost-5` 다.
 * 아디다스가 Ultraboost 24 다음을 "5" 로 개명한 것으로 보이지만 **확인 못 했다.**
 * 그래서 이 검사는 "틀렸다"가 아니라 **"사람이 봐야 한다"** 로 보고한다.
 */
function modelTokens(model) {
  return model
    .toLowerCase()
    .replace(/[()]/g, " ")
    .split(/[\s\-_/]+/)
    .filter((t) => t.length >= 3 && !["the", "shoe", "wide"].includes(t));
}

/**
 * 모델명 끝의 세대 숫자 — `Ultraboost 25` → `25`, `Pegasus 42` → `42`.
 *
 * ⚠️ 이름만 보면 부족하다. `adidas-ultraboost-5-21818110-720.jpg` 는 모델이
 * **Ultraboost 25** 인데 `ultraboost` 가 들어 있어서 위 검사를 통과한다.
 * 세대가 다르면 **다른 해에 나온 다른 신발**이므로 스펙도 다르다.
 *
 * 파일명을 `-`·`_`·`.` 로 쪼갠 **토큰 전체**와 비교한다. 부분 문자열로 찾으면
 * `-720.jpg` 의 `2` 나 상품번호 `24827697` 안의 숫자에 걸려 오탐이 난다.
 */
function modelVersion(model) {
  const m = /(?:^|[\s\-v])(\d{1,4})\s*(?:\([^)]*\))?\s*$/.exec(model.trim());
  return m ? m[1] : null;
}

const nameCheck = shoes.map((s) => {
  const file = decodeURIComponent(s.url.split("?")[0].split("/").pop() ?? "").toLowerCase();
  // 파일명이 숫자·해시뿐이면 판정할 수 없다.
  const decidable = /[a-z]{3,}/.test(file.replace(/\.(jpg|jpeg|png|webp|avif|gif)$/, ""));
  const tokens = modelTokens(s.model);
  const hit = tokens.filter((t) => file.includes(t));
  const ver = modelVersion(s.model);
  /**
   * 구분자에 `+` 와 `%20` 도 넣는다 — 나이키 공식 이미지가 이렇게 온다:
   *   `AIR+ZOOM+PEGASUS+42.png`
   * `-`·`_`·`.` 만 쪼개면 통째로 한 토큰이 돼서 `42` 를 못 찾고 **오탐이 난다.**
   * 검사를 넓힐 때는 오탐부터 잡는다 — 오탐이 남으면 사람이 곧 무시한다.
   */
  const fileTokens = file.replace(/%20/g, " ").split(/[-_.+\s]+/);
  // 세대 판정은 이름이 맞은 경우에만 의미가 있다. 이름부터 틀리면 그게 먼저다.
  const verMismatch = Boolean(ver) && hit.length > 0 && !fileTokens.includes(ver);
  return { ...s, file, decidable, tokens, hit, ver, verMismatch, ok: hit.length > 0 };
});

const nameSuspect = nameCheck.filter((s) => s.decidable && !s.ok);
const verSuspect = nameCheck.filter((s) => s.verMismatch);
const nameUnknown = nameCheck.filter((s) => !s.decidable);

console.log(C.bold(`\n신발 이미지 검사 — ${shoes.length}장\n`));

if (nameSuspect.length) {
  console.log(C.yellow(`  ⚠ 파일명에 모델명이 없는 사진 ${nameSuspect.length}장 — 사람이 봐야 합니다`));
  for (const s of nameSuspect) {
    console.log(`     ${C.yellow("?")} ${s.brand} ${s.model}`);
    console.log(C.dim(`        파일명: ${s.file}`));
  }
  console.log(C.dim("     다른 모델 사진일 수 있습니다. 200 으로 열리고 Content-Type 도 정상이라"));
  console.log(C.dim("     나머지 검사는 전부 통과합니다 — 이 줄이 유일한 신호입니다.\n"));
}
if (verSuspect.length) {
  console.log(C.yellow(`  ⚠ 세대 숫자가 안 맞는 사진 ${verSuspect.length}장 — 사람이 봐야 합니다`));
  for (const s of verSuspect) {
    console.log(`     ${C.yellow("?")} ${s.brand} ${s.model}  ${C.dim(`(기대: "${s.ver}")`)}`);
    console.log(C.dim(`        파일명: ${s.file}`));
  }
  console.log(C.dim("     세대가 다르면 다른 해에 나온 다른 신발이고 스펙도 다릅니다.\n"));
}
if (nameUnknown.length) {
  console.log(
    C.dim(`  판정 불가 ${nameUnknown.length}장 (파일명이 숫자·해시라 모델명을 확인할 수 없음)\n`)
  );
}

// ── 출처 분포 (네트워크 불필요) ────────────────────────────
const byHost = new Map();
for (const s of shoes) {
  const h = (() => {
    try {
      return new URL(s.url).hostname;
    } catch {
      return "?";
    }
  })();
  if (!byHost.has(h)) byHost.set(h, []);
  byHost.get(h).push(s);
}
for (const [h, list] of [...byHost].sort((a, b) => b[1].length - a[1].length)) {
  const note = FOREIGN[h];
  const tag = note ? C.yellow("외부") : C.green("브랜드");
  console.log(`  ${tag} ${String(list.length).padStart(2)}장  ${h}${note ? C.dim(` — ${note}`) : ""}`);
}

const runrepeat = byHost.get("cdn.runrepeat.com") ?? [];
if (runrepeat.length) {
  console.log(
    C.yellow(
      `\n  ⚠ ${runrepeat.length}장이 경쟁사 CDN입니다. 리퍼러 차단 한 번에 전부 사라집니다.`
    )
  );
  console.log(C.dim("     지금 뜬다고 안전한 게 아닙니다 — 이 검사기는 그때를 알아채기 위한 것입니다.\n"));
}

if (process.argv.includes("--plan")) process.exit(0);

// ── 실제 응답 확인 ─────────────────────────────────────────
async function check(s) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    // 이미지 CDN은 HEAD를 막는 곳이 있다. 막히면 GET으로 한 번 더.
    let r = await fetch(s.url, { method: "HEAD", redirect: "follow", signal: ac.signal });
    if (r.status === 403 || r.status === 405 || r.status === 501) {
      r = await fetch(s.url, { method: "GET", redirect: "follow", signal: ac.signal });
    }
    const ct = r.headers.get("content-type") ?? "";
    return { ...s, status: r.status, ct, finalUrl: r.url };
  } catch (e) {
    return { ...s, status: 0, ct: "", error: e.name === "AbortError" ? "시간초과" : e.message };
  } finally {
    clearTimeout(t);
  }
}

const results = [];
for (let i = 0; i < shoes.length; i += CONCURRENCY) {
  results.push(...(await Promise.all(shoes.slice(i, i + CONCURRENCY).map(check))));
  process.stdout.write(C.dim(`\r  조회 중… ${Math.min(i + CONCURRENCY, shoes.length)}/${shoes.length}`));
}
process.stdout.write("\r" + " ".repeat(40) + "\r");

/**
 * **"깨졌다"와 "확인 못 했다"를 갈라서 보고한다.**
 *
 * AGENTS.md §2가 명령하는 것이고, 이 검사기도 첫 실행에서 정확히 그 실수를 했다 —
 * 51장 전부 `fetch failed`가 떴는데 화면에는 "깨짐 51"이라고 나왔다.
 * 실제로는 **샌드박스가 이미지 호스트를 막고 있어서** 한 장도 검증되지 않은 것이었다.
 * 뭉뚱그리면 "어차피 네트워크 문제겠지" 하고 진짜 차단까지 넘긴다.
 *
 * 차단은 보통 **200에 HTML**로 온다("직접 링크하지 마세요" 안내 페이지).
 * 그래서 Content-Type이 실제로 `image/`인지까지 본다.
 */
const NET_RE = /fetch failed|ENOTFOUND|ECONNREFUSED|EAI_AGAIN|시간초과|socket|network|TLS|certificate/i;

const unreachable = results.filter((r) => r.status === 0 && NET_RE.test(r.error ?? ""));
const broken = results.filter(
  (r) => !unreachable.includes(r) && (r.status >= 400 || r.status === 0 || !r.ct.startsWith("image/"))
);
const ok = results.filter((r) => !unreachable.includes(r) && !broken.includes(r));

if (broken.length) {
  console.log(C.bold("깨진 이미지 — 고칠 것이 있습니다"));
  for (const b of broken) {
    console.log(`${C.red("✗")} ${b.brand} ${b.model}`);
    console.log(C.dim(`    ${b.status} ${b.ct || "(Content-Type 없음)"}`));
    console.log(C.dim(`    ${b.url}`));
  }
  console.log();
}

if (unreachable.length) {
  console.log(C.bold(C.yellow("조회 실패 — 검증되지 않았습니다 (깨진 것과 다릅니다)")));
  const hosts = new Map();
  for (const u of unreachable) {
    const h = (() => { try { return new URL(u.url).hostname; } catch { return "?"; } })();
    hosts.set(h, (hosts.get(h) ?? 0) + 1);
  }
  for (const [h, n] of [...hosts].sort((a, b) => b[1] - a[1])) {
    console.log(C.dim(`    ${h.padEnd(28)} ${n}장`));
  }
  console.log(
    C.dim("\n  전부 실패했다면 이 환경이 이미지 호스트를 막고 있는 것입니다(샌드박스에서 흔합니다).")
  );
  console.log(C.dim("  그 경우 이 실행으로는 아무것도 확인되지 않았습니다 — 배포 환경이나 브라우저에서 보세요.\n"));
}

console.log(C.bold("─────────────────────────────"));
console.log(
  `${shoes.length}장 · ` +
    `${broken.length ? C.red(`깨짐 ${broken.length}`) : C.green("깨짐 0")} · ` +
    `${unreachable.length ? C.yellow(`조회실패 ${unreachable.length}`) : C.green("조회실패 0")} · ` +
    `${C.green(`정상 ${ok.length}`)}`
);
console.log(C.dim("\n주의: 사진 속 신발이 그 모델이 맞는지는 못 본다. 그건 사람이 봐야 한다.\n"));

// 둘 다 exit 1이다(fail closed). 다만 뜻이 다르다는 것을 위에서 갈라 보여줬다.
process.exit(broken.length || unreachable.length ? 1 : 0);
