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

const shoes = [];
{
  const re =
    /id:\s*"([^"]+)",\s*\n\s*brand:\s*"([^"]+)",\s*\n\s*model:\s*"([^"]+)",(?:[\s\S]{0,200}?)imageUrl:\s*"([^"]+)"/g;
  for (const m of text.matchAll(re)) {
    shoes.push({ id: m[1], brand: m[2], model: m[3], url: m[4] });
  }
}

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const byHost = new Map();
for (const s of shoes) {
  const h = (() => { try { return new URL(s.url).hostname; } catch { return "?"; } })();
  byHost.set(h, (byHost.get(h) ?? 0) + 1);
}

const cards = shoes
  .map(
    (s) => `
    <figure data-id="${esc(s.id)}">
      <img src="${esc(s.url)}" alt="${esc(s.brand)} ${esc(s.model)}" loading="lazy"
           referrerpolicy="no-referrer"
           onerror="this.closest('figure').classList.add('dead')">
      <figcaption>
        <b>${esc(s.brand)} ${esc(s.model)}</b>
        <span>${esc(new URL(s.url).hostname)}</span>
      </figcaption>
    </figure>`
  )
  .join("");

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
  figcaption span{color:#999;font-size:11px;word-break:break-all}
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
<div class="grid">${cards}</div>
<p class="note">
  발견한 것은 <code>lib/shoes/data.ts</code>의 <code>imageUrl</code>을 고쳐야 합니다.
  대체 URL은 <b>추측하지 말고</b> 브랜드 공식몰에서 실제로 확인한 것만 넣으세요 —
  URL을 지어내면 이미지가 깨지고, 깨진 걸 아무도 모릅니다.
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
