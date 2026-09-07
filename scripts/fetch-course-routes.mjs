#!/usr/bin/env node
/**
 * 코스 경로선 뽑기 — OpenStreetMap 에서 실제 강변 산책로 선형을 가져온다.
 *
 *   node scripts/fetch-course-routes.mjs          # 받아서 lib/courses.routes.json 에 쓴다
 *   node scripts/fetch-course-routes.mjs --check  # 쓰지 않고 지금 파일이 말이 되는지만 본다
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 만들었나 (2026-09-07)
 *
 * 사용자 지적: **"맵 보고 모르면 그냥 나가는 거야."**
 * 그 말이 맞다. 핀만 네 개 흩어져 있고 어디서 출발해 어디로 뛰는지는 글로만
 * 적혀 있었다. **경로선 없는 코스 지도는 코스 지도가 아니다.**
 *
 * 나는 원래 경로선을 안 그렸고, 이유는 "실제 산책로 좌표가 없으니 다리 좌표를
 * 이으면 강 위를 가로지르는 엉뚱한 선이 된다"였다. 걱정은 맞았지만 **결론이
 * 틀렸다** — 없으면 지어내지 말고 **찾아야** 했다. 한강 자전거길은 OSM 에 이미
 * 그려져 있다. 지도 타일에 보이는 그 선이다.
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 스크립트인가 (Claude 가 직접 안 하고)
 *
 * ① Claude 작업 환경(샌드박스)은 외부 네트워크가 403 으로 막힌다.
 *    Overpass 도, 타일 서버도 못 부른다.
 * ② 공개 Overpass 서버는 시간대에 따라 큐가 밀려 504/타임아웃이 잦다.
 *    2026-09-07 시도에서 4개 중 2개가 안 왔다.
 * 그래서 **네트워크가 되는 곳에서 돌리는 스크립트**로 만들었다. 결과는 저장소에
 * 커밋되므로, 한 번 받으면 다시 받을 필요가 없다.
 *
 * ─────────────────────────────────────────────────────────────
 * 검사가 핵심이다 — 틀린 선은 선이 없는 것보다 나쁘다
 *
 * 첫 시도에서 나온 값들:
 *   · 여의도 0.91km  (마포대교~원효대교 직선이 약 1.1km)
 *   · 잠실   2.24km  (청담대교~잠실대교 직선이 약 2.5km)
 *
 * **길이 직선거리보다 짧다.** 물리적으로 불가능하다. 원인은 두 가지였다 —
 * 경로가 다리 위 자전거길로 강을 건너 질러갔고(여의도), 반대로 다리를 전부
 * 빼자 지천을 건너는 짧은 교량에서 길이 끊겼다(잠실).
 *
 * 그래서 이 스크립트는 **직선거리 대비 비율을 반드시 확인하고, 1.0 미만이면
 * 실패로 처리한다.** 이 검사 한 줄이 위 두 오류를 다 잡는다.
 * 통과하지 못한 코스는 **파일에 쓰지 않는다** — 지도는 경로선 없이 그려지고,
 * 그게 틀린 선을 보여주는 것보다 낫다.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const OUT = "lib/courses.routes.json";
const CHECK_ONLY = process.argv.includes("--check");

const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

/**
 * 코스별 입력.
 *
 * `hint` = **그 강변 위의 한 점.** 왜 필요한가 — 다리 좌표에서 가장 가까운
 * 길 노드를 찾으면 **반대편 강변**으로 붙을 수 있다. 다리는 강 가운데에 있으니까.
 * hint 가 속한 연결 성분 안에서만 끝점을 찾으면 그 문제가 사라진다.
 * 값은 lib/courses.ts 의 공원 진입 지점(공식 자료 확인분)을 쓴다.
 */
const JOBS = [
  {
    slug: "jamsil",
    bbox: "37.5050,127.0500,37.5350,127.1150",
    hint: [37.51757, 127.08433],
    from: [37.52381, 127.09208], // 잠실대교
    to: [37.52561, 127.06397], // 청담대교
  },
  {
    slug: "banpo",
    bbox: "37.4980,126.9650,37.5250,127.0150",
    hint: [37.50887, 126.99394],
    from: [37.51456, 126.99651], // 반포대교·잠수교
    to: [37.51089, 126.98192], // 동작대교
  },
  {
    slug: "yeouido",
    bbox: "37.5100,126.9150,37.5450,126.9750",
    hint: [37.52567, 126.93606],
    from: [37.53355, 126.93637], // 마포대교
    to: [37.52787, 126.94726], // 원효대교
  },
  {
    slug: "ttukseom",
    bbox: "37.5200,127.0200,37.5480,127.0750",
    // 뚝섬은 lib/courses.ts 에 공원 진입 지점이 없다(공식 자료에서 확인 못 했다).
    // 그래서 두 끝점의 중간을 **북쪽으로** 400m 옮긴 점을 쓴다 — 뚝섬은 북쪽 강변이다.
    hint: [37.5375, 127.0464],
    from: [37.53695, 127.03501], // 성수대교
    to: [37.53111, 127.05775], // 영동대교
  },
];

// ── 거리 ────────────────────────────────────────────────────
const R = 6371;
const rad = Math.PI / 180;
function hv(a, b) {
  const dLa = (b[0] - a[0]) * rad;
  const dLo = (b[1] - a[1]) * rad;
  const s =
    Math.sin(dLa / 2) ** 2 +
    Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
function pathKm(pts) {
  let k = 0;
  for (let i = 0; i < pts.length - 1; i++) k += hv(pts[i], pts[i + 1]);
  return k;
}

// ── Overpass ────────────────────────────────────────────────
async function overpass(query, ms = 90_000) {
  const errors = [];
  for (const url of ENDPOINTS) {
    const ac = new AbortController();
    const to = setTimeout(() => ac.abort(), ms);
    try {
      const res = await fetch(url, { method: "POST", body: query, signal: ac.signal });
      clearTimeout(to);
      const text = await res.text();
      if (res.ok && text.startsWith("{")) return JSON.parse(text);
      errors.push(`${new URL(url).host} ${res.status}`);
    } catch (e) {
      clearTimeout(to);
      errors.push(`${new URL(url).host} ${e.name}`);
    }
  }
  throw new Error(`Overpass 실패 — ${errors.join(" / ")}`);
}

// ── 경로 계산 ───────────────────────────────────────────────
/**
 * 다리를 어떻게 다룰까 — 길이로 가른다.
 *
 * 다리를 전부 살리면 경로가 **한강을 건너 질러간다**(다리 위에도 자전거길이 있다).
 * 다리를 전부 빼면 **지천을 건너는 짧은 교량에서 길이 끊긴다**(성내천·탄천 등).
 * 그래서 `BRIDGE_MAX_M` 보다 긴 다리만 뺀다. 한강 교량은 1km 급이고
 * 지천 교량은 100m 안쪽이라 이 경계가 둘을 잘 가른다.
 */
const BRIDGE_MAX_M = 200;

function buildRoute(osm, { hint, from, to }) {
  const key = (p) => p[0].toFixed(6) + "," + p[1].toFixed(6);
  const graph = new Map();
  const pos = new Map();
  const link = (a, b, w) => {
    if (!graph.has(a)) graph.set(a, []);
    graph.get(a).push([b, w]);
  };

  let droppedBridges = 0;
  for (const way of osm.elements) {
    if (!way.geometry) continue;
    const geo = way.geometry.map((g) => [g.lat, g.lon]);
    const isBridge = way.tags?.bridge && way.tags.bridge !== "no";
    if (isBridge && pathKm(geo) * 1000 > BRIDGE_MAX_M) {
      droppedBridges++;
      continue;
    }
    for (let i = 0; i < geo.length - 1; i++) {
      const ka = key(geo[i]);
      const kb = key(geo[i + 1]);
      pos.set(ka, geo[i]);
      pos.set(kb, geo[i + 1]);
      const d = hv(geo[i], geo[i + 1]);
      link(ka, kb, d);
      link(kb, ka, d);
    }
  }
  if (!pos.size) throw new Error("길 노드가 하나도 없다");

  // hint 가 속한 연결 성분 = 그 강변
  let hk = null;
  let hd = Infinity;
  for (const [k, v] of pos) {
    const d = hv(hint, v);
    if (d < hd) { hd = d; hk = k; }
  }
  const comp = new Set([hk]);
  const stack = [hk];
  while (stack.length) {
    const u = stack.pop();
    for (const [v] of graph.get(u) ?? []) if (!comp.has(v)) { comp.add(v); stack.push(v); }
  }

  const snap = (p) => {
    let k = null;
    let bd = Infinity;
    for (const kk of comp) {
      const d = hv(p, pos.get(kk));
      if (d < bd) { bd = d; k = kk; }
    }
    return { k, d: bd };
  };
  const s = snap(from);
  const t = snap(to);

  // Dijkstra
  const dist = new Map([[s.k, 0]]);
  const prev = new Map();
  const done = new Set();
  const pq = [[0, s.k]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (done.has(u)) continue;
    done.add(u);
    if (u === t.k) break;
    for (const [v, w] of graph.get(u) ?? []) {
      const nd = d + w;
      if (nd < (dist.get(v) ?? Infinity)) { dist.set(v, nd); prev.set(v, u); pq.push([nd, v]); }
    }
  }
  if (!done.has(t.k)) throw new Error(`두 끝점이 이어지지 않는다 (성분 노드 ${comp.size}개)`);

  const path = [];
  let cur = t.k;
  for (;;) {
    path.push(pos.get(cur));
    if (cur === s.k) break;
    cur = prev.get(cur);
    if (!cur) break;
  }
  path.reverse();

  // Douglas-Peucker (등거리 투영에서)
  const lat0 = path[0][0] * rad;
  const KM = 111.32;
  const xy = (p) => [p[1] * Math.cos(lat0) * KM, p[0] * KM];
  const perp = (p, a, b) => {
    const P = xy(p), A = xy(a), B = xy(b);
    const dx = B[0] - A[0], dy = B[1] - A[1], L = dx * dx + dy * dy;
    const u = L ? Math.max(0, Math.min(1, ((P[0] - A[0]) * dx + (P[1] - A[1]) * dy) / L)) : 0;
    return Math.hypot(P[0] - (A[0] + u * dx), P[1] - (A[1] + u * dy));
  };
  const dp = (pts, eps) => {
    if (pts.length < 3) return pts;
    let mi = 0, md = 0;
    for (let i = 1; i < pts.length - 1; i++) {
      const d = perp(pts[i], pts[0], pts.at(-1));
      if (d > md) { md = d; mi = i; }
    }
    return md > eps
      ? [...dp(pts.slice(0, mi + 1), eps).slice(0, -1), ...dp(pts.slice(mi), eps)]
      : [pts[0], pts.at(-1)];
  };

  return {
    coords: dp(path, 0.008).map((p) => [+p[0].toFixed(5), +p[1].toFixed(5)]),
    km: +pathKm(path).toFixed(2),
    droppedBridges,
    rawPoints: path.length,
    snapFromM: Math.round(s.d * 1000),
    snapToM: Math.round(t.d * 1000),
  };
}

/**
 * 말이 되는 값인가.
 *
 * **비율 1.0 미만은 물리적으로 불가능하다** — 길이 직선거리보다 짧을 수 없다.
 * 이 한 줄이 첫 시도의 오류 두 개(여의도 0.91km, 잠실 2.24km)를 다 잡았다.
 * 위쪽 한계 2.2 는 경로가 엉뚱하게 돌아간 경우를 잡는다(강변길은 거의 직선이다).
 */
function verdict(job, r) {
  const straight = hv(job.from, job.to);
  const ratio = r.km / straight;
  const problems = [];
  if (ratio < 1.0) problems.push(`직선거리(${straight.toFixed(2)}km)보다 짧다 — 불가능한 값이다`);
  if (ratio > 2.2) problems.push(`직선거리의 ${ratio.toFixed(1)}배다 — 엉뚱하게 돌아간 경로다`);
  if (r.coords.length < 4) problems.push(`점이 ${r.coords.length}개뿐이다 — 선이 안 그려진다`);
  if (Math.max(r.snapFromM, r.snapToM) > 1200)
    problems.push(`끝점 보정이 ${Math.max(r.snapFromM, r.snapToM)}m다 — 엉뚱한 곳에 붙었다`);
  return { straight: +straight.toFixed(2), ratio: +ratio.toFixed(2), problems };
}

// ── 실행 ────────────────────────────────────────────────────
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

if (CHECK_ONLY) {
  if (!existsSync(OUT)) {
    console.log(red(`${OUT} 이 없습니다. 먼저 인수 없이 실행하세요.`));
    process.exit(1);
  }
  const data = JSON.parse(readFileSync(OUT, "utf8"));
  let bad = 0;
  for (const job of JOBS) {
    const r = data[job.slug];
    if (!r) { console.log(dim(`  · ${job.slug} 없음 (지도는 경로선 없이 그려집니다)`)); continue; }
    const v = verdict(job, r);
    if (v.problems.length) { bad++; console.log(red(`  ✗ ${job.slug} ${r.km}km — ${v.problems.join("; ")}`)); }
    else console.log(green(`  ✓ ${job.slug} ${r.km}km (직선 ${v.straight}km, ${v.ratio}배, 점 ${r.coords.length}개)`));
  }
  process.exit(bad ? 1 : 0);
}

const result = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
const today = new Date().toISOString().slice(0, 10);
let ok = 0;
let failed = 0;

for (const job of JOBS) {
  process.stdout.write(dim(`  ${job.slug} 받는 중… `));
  try {
    const osm = await overpass(
      `[out:json][timeout:90];\nway["highway"]["name"~"자전거길|산책로"](${job.bbox});\nout geom;`
    );
    const r = buildRoute(osm, job);
    const v = verdict(job, r);
    if (v.problems.length) {
      failed++;
      console.log(red(`✗ ${r.km}km`));
      for (const p of v.problems) console.log(red(`      ${p}`));
      console.log(dim(`      쓰지 않습니다. 지도는 경로선 없이 그려집니다.`));
      continue;
    }
    result[job.slug] = {
      coords: r.coords,
      km: r.km,
      source: {
        label: "OpenStreetMap 기여자 — 한강 자전거길·산책로 (Overpass)",
        url: "https://www.openstreetmap.org/copyright",
        checkedAt: today,
      },
    };
    ok++;
    console.log(
      green(`✓ ${r.km}km`) +
        dim(` (직선 ${v.straight}km · ${v.ratio}배 · 점 ${r.coords.length}개 · 다리 ${r.droppedBridges}개 제외 · 보정 ${r.snapFromM}/${r.snapToM}m)`)
    );
  } catch (e) {
    failed++;
    console.log(red(`✗ ${e.message}`));
  }
}

if (ok) {
  writeFileSync(OUT, JSON.stringify(result, null, 2) + "\n", "utf8");
  console.log(`\n${green(`${ok}개를 ${OUT} 에 썼습니다.`)} ${failed ? red(`${failed}개 실패.`) : ""}`);
  console.log(dim("실패한 것은 서버 혼잡일 수 있습니다 — 시간을 두고 다시 실행하면 채워집니다."));
} else {
  console.log(red(`\n하나도 못 받았습니다. Overpass 공개 서버 혼잡일 가능성이 큽니다 — 나중에 다시 실행하세요.`));
}
process.exit(0);
