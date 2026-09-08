#!/usr/bin/env node
/**
 * 신발 사진 대조표 — 52장을 한 화면에 깔아 **사람이 한 번에 본다**
 *
 * 왜 만들었나 (2026-09-06)
 * ───────────────────────
 * `AGENTS.md`가 사각지대로 적어둔 자리를 라이브에서 실제로 밟았다 —
 * **"사진 속 신발이 그 모델이 맞는지는 사람이 봐야 한다."**
 *
 * 홈에 신발 띠를 붙이고 배포한 화면을 눈으로 보니 두 가지가 나왔다.
 *
 *   · **미즈노 3장이 죽어 있었다.** `assets.mizuno.com`이 실패해 우리 `onError`
 *     폴백(회색 "Mizuno" 글자)으로 대체됐다. 폴백이 작동한 건 다행이지만
 *     **원본이 죽었다는 사실은 아무도 몰랐다.**
 *   · **나이키 InfinityRN 4는 더 나빴다.** `static.nike.com`이 **200으로**
 *     400×400 이미지를 주는데 내용이 나이키의 **"IMAGE UNAVAILABLE" 플레이스홀더**다.
 *     정상 로드되니 `onError`도 안 걸리고, `check:images`의 Content-Type 검사도 통과한다.
 *     **완벽하게 조용한 실패다.**
 *
 * 두 번째 종류는 기계가 못 잡는다. 픽셀을 봐야 알 수 있고, 그건 사람이 하는 일이다.
 * 그래서 자동 판정을 흉내내지 않고 **사람이 1분 만에 전수 확인하도록** 만든다.
 * `check:shoes`가 신제품 감지를 자동화한 척하지 않는 것과 같은 설계다.
 *
 *   npm run check:images:sheet
 *   → outputs/image-sheet.html 이 생기고, 브라우저로 열면 52장이 격자로 뜬다
 *
 * 볼 것은 셋이다.
 *   1) 회색 폴백 상자        → 원본이 죽었다
 *   2) 브랜드 로고·"UNAVAILABLE" → 브랜드 CDN이 플레이스홀더를 주고 있다
 *   3) 다른 모델의 신발        → 잘못된 사진이 걸려 있다
 *
 * 이 스크립트는 네트워크를 쓰지 않는다. HTML만 만들고, 실제 조회는 브라우저가 한다 —
 * 그래서 샌드박스에서도 만들 수 있고, 판정은 네트워크가 있는 곳에서 사람이 한다.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DATA = path.join(ROOT, "lib", "shoes", "data.ts");
const OUT_DIR = path.join(ROOT, "outputs");
const OUT = path.join(OUT_DIR, "image-sheet.html");

const text = await readFile(DATA, "utf8");

/**
 * 고칠 순서와 고치는 방법까지 같이 낸다 (2026-09-08 추가)
 *
 * 전에는 "무엇이 깨졌나"만 보여주고 끝났다. 그런데 사진 48장 중 **40장이
 * 경쟁사 CDN(`cdn.runrepeat.com`)** 에 있고, 그쪽이 막히면 한꺼번에 사라진다.
 * 즉 이건 한 번 고치고 끝나는 일이 아니라 **40건짜리 작업 목록**이다.
 *
 * hyun 님이 쓸 수 있는 시간이 주 1~2시간이다. 40건을 다 하라고 내놓으면
 * 아무것도 안 된다. 그래서 두 가지를 붙인다.
 *
 *   ① **순서** — 실제로 사람 눈에 닿는 신발부터. 후속이 나온 구형은 홈 띠와
 *      추천 목록에서 이미 제외되므로(`app/page.tsx`, `shoe-finder/layout.tsx`)
 *      사진이 깨져도 보는 사람이 거의 없다.
 *   ② **고치는 자리** — `data.ts` 의 줄 번호와, 그 신발의 **공식 판매처 링크**.
 *      공식몰에 가면 제품 사진이 있다.
 *
 * ⚠️ 브랜드 공식몰 검색 URL 을 **내가 조립하지 않는다.** 저장소에 이미
 * `isOfficial: true` 로 검증된 링크가 있고(`check:links` 가 매주 확인한다),
 * 없으면 없다고 적는다. URL 을 지어내면 사람이 엉뚱한 데로 간다 —
 * 2026-09-08 에 쿠팡 URL 을 조립해서 한 번 헛걸음시켰다.
 */
const COMPARES = await readFile(path.join(ROOT, "lib", "compares.ts"), "utf8");

const shoes = [];
{
  const re =
    /id:\s*"([^"]+)",\s*\n\s*brand:\s*"([^"]+)",\s*\n\s*model:\s*"([^"]+)",(?:[\s\S]{0,200}?)imageUrl:\s*"([^"]+)"/g;
  for (const m of text.matchAll(re)) {
    const id = m[1];
    // 이 신발 블록만 잘라서 부가 정보를 읽는다. 다음 `id:` 까지가 경계다.
    const from = m.index;
    const nextId = text.indexOf('\n    id: "', from + 10);
    const block = text.slice(from, nextId === -1 ? text.length : nextId);

    const official = /label:\s*"([^"]+)",\s*url:\s*"([^"]+)",\s*isOfficial:\s*true/.exec(block);
    shoes.push({
      id,
      brand: m[2],
      model: m[3],
      url: m[4],
      // 줄 번호 — 사람이 에디터에서 바로 점프할 수 있게.
      line: text.slice(0, from).split("\n").length,
      successor: /successor:\s*"([^"]+)"/.exec(block)?.[1] ?? null,
      female: /gender:\s*"female"/.test(block),
      // 비교 페이지에 몇 번 나오는지 = 노출량의 대리 지표
      compares: (COMPARES.match(new RegExp(id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? [])
        .length,
      officialLabel: official?.[1] ?? null,
      officialUrl: official?.[2] ?? null,
    });
  }
}

/**
 * 우선순위 — 큰 숫자가 먼저.
 * 현행 모델은 홈 띠·추천 결과에 뜨고, 비교 페이지 노출이 많으면 더 자주 보인다.
 */
for (const s of shoes) {
  s.priority = (s.successor ? 0 : 10) + (s.female ? 0 : 2) + Math.min(s.compares, 4);
}
shoes.sort((a, b) => b.priority - a.priority || a.brand.localeCompare(b.brand));

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const byHost = new Map();
for (const s of shoes) {
  const h = (() => { try { return new URL(s.url).hostname; } catch { return "?"; } })();
  byHost.set(h, (byHost.get(h) ?? 0) + 1);
}

const cards = shoes
  .map((s) => {
    const rank =
      s.successor || s.female
        ? `<em class="low">나중에 — ${s.successor ? "구형" : "여성 라스트"}</em>`
        : `<em class="high">먼저 — 현행${s.compares ? ` · 비교 ${s.compares}곳` : ""}</em>`;
    const fix = s.officialUrl
      ? `<a href="${esc(s.officialUrl)}" target="_blank" rel="noopener noreferrer">${esc(
          s.officialLabel
        )} ↗</a>`
      : `<i>공식 판매처 링크 없음</i>`;
    return `
    <figure data-id="${esc(s.id)}" class="${s.successor || s.female ? "later" : "now"}">
      <img src="${esc(s.url)}" alt="${esc(s.brand)} ${esc(s.model)}" loading="lazy"
           referrerpolicy="no-referrer"
           onerror="this.closest('figure').classList.add('dead')">
      <figcaption>
        <b>${esc(s.brand)} ${esc(s.model)}</b>
        ${rank}
        <span>${esc(new URL(s.url).hostname)}</span>
        <span class="fix">data.ts:${s.line} · ${fix}</span>
      </figcaption>
    </figure>`;
  })
  .join("");

const nowCount = shoes.filter((s) => !s.successor && !s.female).length;

const hostRows = [...byHost]
  .sort((a, b) => b[1] - a[1])
  .map(([h, n]) => `<li><b>${n}장</b> ${esc(h)}</li>`)
  .join("");

const html = `<!doctype html>
<meta charset="utf-8">
<title>신발 사진 대조표 — ${shoes.length}장</title>
<style>
  body{font:15px/1.6 -apple-system,"Segoe UI",system-ui,sans-serif;margin:0;padding:24px;background:#fafafa;color:#111}
  h1{margin:0 0 4px;font-size:22px}
  .lead{color:#555;max-width:70ch;margin:0 0 18px}
  .lead b{color:#111}
  ul.hosts{display:flex;flex-wrap:wrap;gap:8px 18px;list-style:none;padding:0;margin:0 0 22px;color:#555;font-size:13px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px}
  figure{margin:0;background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:10px}
  figure img{display:block;width:100%;height:130px;object-fit:contain;background:#f5f5f5;border-radius:8px}
  figure.dead{border-color:#dc2626;background:#fef2f2}
  figure.dead img{visibility:hidden}
  figure.dead::after{content:"원본 없음";display:block;text-align:center;color:#dc2626;font-weight:700;margin-top:-78px;margin-bottom:60px}
  figcaption{margin-top:8px;font-size:12px;line-height:1.45}
  figcaption b{display:block;color:#111}
  figcaption span{display:block;color:#999;font-size:11px;word-break:break-all}
  figcaption em{display:block;font-style:normal;font-size:11px;font-weight:700;margin:2px 0}
  figcaption em.high{color:#059669}
  figcaption em.low{color:#9ca3af}
  figcaption .fix{color:#6b7280;margin-top:3px}
  figcaption .fix a{color:#2563eb}
  figcaption .fix i{color:#b91c1c;font-style:normal}
  figure.later{opacity:.55}
  figure.later:hover{opacity:1}
  .note{margin:26px 0 0;padding:14px 16px;border-left:3px solid #f59e0b;background:#fffbeb;font-size:14px;max-width:80ch}
</style>
<h1>신발 사진 대조표 — ${shoes.length}장</h1>
<p class="lead">
  <b>기계가 못 잡는 것을 사람이 1분에 확인하는 화면입니다.</b> 아래 셋을 찾으세요.<br>
  ① 빨간 <b>원본 없음</b> 상자 — 이미지가 죽었습니다<br>
  ② 브랜드 로고나 <b>IMAGE UNAVAILABLE</b> — CDN이 플레이스홀더를 주고 있습니다(200으로 오므로 검사기가 못 잡습니다)<br>
  ③ 캡션과 <b>다른 모델</b>의 신발 — 잘못된 사진입니다
</p>
<ul class="hosts">${hostRows}</ul>
<p class="lead">
  <b>순서대로 정렬했습니다.</b> 위쪽 <b style="color:#059669">먼저</b> 표시된
  ${nowCount}개가 현행 모델이라 홈 띠·추천 결과·비교 페이지에 실제로 뜹니다.
  아래쪽 흐린 카드는 후속이 나온 구형이거나 여성 전용 라스트로,
  홈 띠와 추천 목록에서 이미 제외돼 있어 <b>깨져도 보는 사람이 거의 없습니다.</b>
  시간이 없으면 위쪽만 하세요.
</p>
<div class="grid">${cards}</div>
<p class="note">
  각 카드에 <code>data.ts:줄번호</code>와 그 신발의 <b>공식 판매처 링크</b>를 적어뒀습니다.
  공식몰에서 제품 사진 URL을 확인해 <code>imageUrl</code>을 바꾸세요.<br><br>
  대체 URL은 <b>추측하지 말고</b> 실제로 열어서 확인한 것만 넣으세요 —
  URL을 지어내면 이미지가 깨지고, 깨진 걸 아무도 모릅니다.<br><br>
  <b>왜 이 작업을 하는가:</b> 지금 사진 대부분이 <code>cdn.runrepeat.com</code>(러닝화 리뷰
  사이트)에 있습니다. 우리 서버가 아니라 <b>남의 서버</b>이고, 그쪽이 정책을 바꾸면
  한꺼번에 사라집니다. 지금 뜬다고 안전한 게 아닙니다. 브랜드 공식 이미지로 옮기면
  최소한 그 브랜드는 자기 제품 사진을 계속 서비스할 이유가 있습니다.
</p>
`;

await mkdir(OUT_DIR, { recursive: true });
await writeFile(OUT, html, "utf8");

console.log(`\n신발 사진 대조표를 만들었습니다 — ${shoes.length}장`);
console.log(`  ${OUT}`);
console.log(`\n브라우저로 열어서 셋을 찾으세요:`);
console.log(`  ① 빨간 "원본 없음" 상자`);
console.log(`  ② 브랜드 로고 / IMAGE UNAVAILABLE  ← 검사기가 절대 못 잡는 종류`);
console.log(`  ③ 캡션과 다른 모델의 신발\n`);
