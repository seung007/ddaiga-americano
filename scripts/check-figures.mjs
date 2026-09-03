#!/usr/bin/env node
/**
 * 동작 그림 검사 — 관절 각도를 실제로 계산해서 그림이 깨지는지 본다.
 *
 * 왜 만들었나 (2026-09-03)
 * ───────────────────────
 * `ExerciseFigure`의 런지 각도를 눈대중으로 넣었더니 **두 발이 바닥선을 뚫었다**
 * (y 166·164 vs 바닥 160). 상체를 통째로 10px 내리면서 발까지 끌고 내려간 탓이다.
 * 코드 리뷰로는 안 보인다 — 회전 각도만 봐서는 발끝이 어디로 가는지 알 수 없다.
 *
 * 눈으로 보는 것을 **대체하려고** 만든 게 아니다. 배포한 뒤 공개 URL을 열면 볼 수 있고,
 * 그렇게 확인해야 한다. 다만 그건 푸시 이후에만 가능하고 사람 눈이 필요하다.
 * 이 검사는 **커밋 전에, 자동으로, 매번** 도는 쪽을 맡는다 — 발이 바닥을 뚫는 것 같은
 * 기하학적 오류는 눈으로도 놓치기 쉽고 회귀하기도 쉽다.
 *
 * AGENTS.md §3 — "새 종류의 출처를 추가하면 검사기 범위부터 늘려라."
 * SVG 애니메이션도 새 종류의 자산이다.
 *
 * 무엇을 보나 / 못 보나
 * ────────────────────
 * **본다**: 발이 바닥선을 뚫는가, 팔다리가 캔버스를 벗어나는가, 파싱이 되는가.
 * **못 본다**: 동작이 그 운동처럼 *보이는가*. 그건 사람이 봐야 한다.
 *   각도가 물리적으로 말이 되는 것과 하이 니즈처럼 보이는 것은 다른 문제다.
 *
 * 각도는 **컴포넌트 소스에서 직접 파싱한다.** 손으로 옮겨 적으면 코드와 검사가 갈라지고,
 * 갈라진 검사는 통과해도 의미가 없다.
 *
 *   npm run check:figures
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "components", "ExerciseFigure.tsx");

// 측면 뷰 기하. ExerciseFigure의 SVG 좌표와 **정확히 같아야** 한다 —
// 여기가 어긋나면 검사가 통과해도 의미가 없다.
const HIP = [60, 88];
const KNEE_L = [57, 122], FOOT_L = [56, 156];
const KNEE_R = [63, 122], FOOT_R = [64, 156];
const GROUND = 160;
const CANVAS_W = 120;
/** 발이 이 아래로 내려가면 바닥을 뚫은 것으로 본다 (선 두께 여유 2px) */
const FLOOR_TOL = 162;

const C = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

/** CSS rotate: 양수 = 시계방향 (y축이 아래를 향하므로) */
function rot([px, py], [ox, oy], deg) {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  const x = px - ox, y = py - oy;
  return [ox + x * c - y * s, oy + x * s + y * c];
}

const text = await readFile(SRC, "utf8");

// KEYFRAMES 객체의 각 항목을 뜯는다
const blocks = [...text.matchAll(/(\w+):\s*`([\s\S]*?)`,/g)]
  .filter(([, , body]) => body.includes("keyframes"));

/**
 * 컴포넌트가 선언한 FOOT_MODE를 읽는다. **여기에 표를 복사해두지 않는다** —
 * 복사본은 반드시 원본과 갈라지고, 갈라진 검사는 통과해도 의미가 없다.
 */
const FOOT_MODE = {};
{
  const m = text.match(/FOOT_MODE:\s*Record<Move,[^>]*>\s*=\s*\{([\s\S]*?)\};/);
  if (!m) {
    console.log(C.red("\nFOOT_MODE 선언을 찾지 못했다 — 컴포넌트 구조가 바뀌었다.\n"));
    process.exit(1);
  }
  for (const e of m[1].matchAll(/(\w+):\s*"(planted|stepping)"/g)) FOOT_MODE[e[1]] = e[2];
  const missing = blocks.map(([, k]) => k).filter((k) => !FOOT_MODE[k]);
  if (missing.length) {
    console.log(C.red(`\nFOOT_MODE에 선언이 빠진 동작: ${missing.join(", ")}\n`));
    process.exit(1);
  }
}

if (blocks.length === 0) {
  console.log(C.red("\n동작 정의를 하나도 찾지 못했다 — 파서가 깨졌거나 파일 구조가 바뀌었다.\n"));
  process.exit(1);
}

/**
 * **모든 키프레임 지점을 뜯는다. 50%만 보면 안 된다.**
 *
 * 2026-09-03: 처음에는 50% 지점만 검사했다. 그래서 힙 써클이 통과했는데,
 * 실제로는 **25%·75%에서 몸 전체가 좌우로 6px 이동해 발이 땅에서 미끄러졌다.**
 * 힙 써클은 발을 붙이고 골반만 돌리는 동작이라 이건 오류다.
 * 브라우저에서 눈으로 보고서야 알았다 — **검사기가 안 보는 자리에 문제가 고였다.**
 *
 * 반환: [{pct, deg, dx, dy}, ...] — 정의된 모든 지점
 */
function stops(body, part) {
  // ⚠️ `[\s\S]*?`로 뜨면 **`@`를 넘어 다음 블록까지 삼킨다.**
  // 실제로 그랬다 — 한 줄짜리 `ef-thighL`을 뜨려다 뒤따르는 shinL·armL·body 규칙까지
  // 전부 먹어서 stop이 17개가 나왔고, **다리가 팔의 34°와 몸통의 dx를 물려받았다.**
  // 그 결과 힙 써클의 발 미끄러짐(12px)이 2px로 계산돼 검사를 통과했다.
  //
  // 그래서 `@`를 금지하고, 규칙 하나(`{...}`)까지만 중첩을 허용한다.
  const m = body.match(
    new RegExp(`@keyframes\\s+ef-${part}\\s*\\{((?:[^{}@]|\\{[^{}]*\\})*)\\}`)
  );
  if (!m) return [{ pct: 0, deg: 0, dx: 0, dy: 0 }];
  const out = [];
  for (const s of m[1].matchAll(/([\d.%,\s]+)\{\s*transform:\s*([^}]+)\}/g)) {
    const pcts = [...s[1].matchAll(/([\d.]+)%/g)].map((p) => parseFloat(p[1]));
    const t = s[2];
    const r = t.match(/rotate\((-?[\d.]+)deg\)/);
    const tr = t.match(/translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/);
    const ty = t.match(/translateY\((-?[\d.]+)px\)/);
    const v = {
      deg: r ? parseFloat(r[1]) : 0,
      dx: tr ? parseFloat(tr[1]) : 0,
      dy: tr ? parseFloat(tr[2]) : ty ? parseFloat(ty[1]) : 0,
    };
    for (const pct of pcts.length ? pcts : [0]) out.push({ pct, ...v });
  }
  return out.length ? out : [{ pct: 0, deg: 0, dx: 0, dy: 0 }];
}

/** 특정 % 지점의 값. 그 지점에 정의가 없으면 가장 가까운 정의를 쓴다. */
function at(body, part, pct) {
  const ss = stops(body, part);
  const exact = ss.find((s) => s.pct === pct);
  if (exact) return exact;
  return ss.reduce((a, b) => (Math.abs(b.pct - pct) < Math.abs(a.pct - pct) ? b : a));
}

console.log(C.bold(`\n동작 그림 검사 — ${blocks.length}개`));
console.log(C.dim(`  바닥선 y=${GROUND} · 캔버스 0~${CANVAS_W}\n`));

let bad = 0;
for (const [, move, body] of blocks) {
  // 이 동작에 등장하는 모든 % 지점을 모은다
  const parts = ["thighL", "shinL", "thighR", "shinR", "body"];
  const pcts = [...new Set(parts.flatMap((p) => stops(body, p).map((s) => s.pct)))].sort((a, b) => a - b);

  const problems = [];
  const footAt = (pct) => {
    const b = at(body, "body", pct);
    const f = (knee, foot0, t, s) => {
      const a = rot(foot0, knee, s);
      const c = rot(a, HIP, t);
      return [c[0] + b.dx, c[1] + b.dy];
    };
    return [
      f(KNEE_L, FOOT_L, at(body, "thighL", pct).deg, at(body, "shinL", pct).deg),
      f(KNEE_R, FOOT_R, at(body, "thighR", pct).deg, at(body, "shinR", pct).deg),
    ];
  };

  // 지면 접촉 판정: 애니메이션 전체에서 각 발의 x 이동폭.
  // 발이 땅에 붙어 있어야 하는 동작에서 발이 좌우로 미끄러지면 어색하다.
  const track = { 왼발: [], 오른발: [] };
  for (const pct of pcts) {
    const [fl, fr] = footAt(pct);
    for (const [name, f] of [["왼발", fl], ["오른발", fr]]) {
      track[name].push(f);
      if (f[1] > FLOOR_TOL) problems.push(`${pct}%에서 ${name}이 바닥을 뚫는다 (y=${f[1].toFixed(0)})`);
      if (f[0] < 0 || f[0] > CANVAS_W) problems.push(`${pct}%에서 ${name}이 캔버스를 벗어난다 (x=${f[0].toFixed(0)})`);
    }
  }

  // 미끄러짐 판정은 **동작이 스스로 선언한 성격**에 따른다.
  //
  //   planted  — 제자리 동작. 접지한 발이 좌우로 움직이면 어색하다.
  //              드는 발은 땅에서 떠 있으므로(y<150) 자유롭게 이동할 수 있다.
  //   stepping — 워킹 런지처럼 발이 실제로 이동하는 동작. 이 규칙을 적용하지 않는다.
  //
  // 선언 없이 일률적으로 검사했더니 **맞는 것을 틀렸다고 했다** —
  // 걷는 런지에 "발 고정"을 요구한 셈이었다. 검사기가 틀리면 사람이 검사기를 끈다.
  if (FOOT_MODE[move] !== "stepping") {
    const SLIDE_TOL = 4;
    for (const [name, pts] of Object.entries(track)) {
      const grounded = pts.filter((p) => p[1] >= 150);
      if (grounded.length < 2) continue;
      const xs = grounded.map((p) => p[0]);
      const slide = Math.max(...xs) - Math.min(...xs);
      if (slide > SLIDE_TOL) {
        problems.push(`${name}이 땅에 닿은 채 좌우로 ${slide.toFixed(0)}px 미끄러진다`);
      }
    }
  }

  const [fl0, fr0] = footAt(50);
  const mark = problems.length ? C.red("✗") : C.green("✓");
  console.log(`${mark} ${move.padEnd(12)} ${pcts.length}개 지점 · 50%에서 왼발(${fl0[0].toFixed(0).padStart(3)},${fl0[1].toFixed(0).padStart(4)}) 오른발(${fr0[0].toFixed(0).padStart(3)},${fr0[1].toFixed(0).padStart(4)})`);
  for (const p of [...new Set(problems)]) { console.log(`    ${C.red("→")} ${p}`); bad++; }
}

console.log(C.bold("\n─────────────────────────────"));
console.log(`${blocks.length}개 · ${bad ? C.red(`문제 ${bad}건`) : C.green("문제 없음")}`);
console.log(C.dim("\n주의: 이 검사는 좌표만 본다. **그 운동처럼 보이는지는 판정하지 못한다.**"));
console.log(C.dim("      각도가 물리적으로 말이 되는 것과 하이 니즈로 보이는 것은 다른 문제다.\n"));

process.exit(bad ? 1 : 0);
