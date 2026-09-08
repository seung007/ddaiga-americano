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
 *    (2026-09-07 첫 실행이 전부 실패한 건 혼잡이 아니라 **내 요청 형식 문제**였다.
 *     아래 `overpass()` 주석 참고 — 406 을 혼잡으로 잘못 읽었다.)
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
 * 실패로 처리한다.** 이 검사 한 줄이 위 두 오류를 다 잡았다.
 * 통과하지 못한 코스는 **파일에 쓰지 않는다** — 지도는 경로선 없이 그려지고,
 * 그게 틀린 선을 보여주는 것보다 낫다.
 *
 * ⚠️ 그런데 **그 검사도 처음엔 틀린 비교였다.** 다리 좌표 사이 직선과 비교했는데,
 * 경로가 실제로 잇는 것은 강변에 스냅된 점이다(다리는 강 가운데다).
 * 정상 경로가 떨어졌다 — 자세한 경위는 `verdict()` 주석에 있다.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";

/**
 * Overpass 원본 응답 캐시.
 *
 * 2026-09-08: 이 스크립트를 다섯 번 돌렸고, 그중 세 번은 **이미 성공한 코스까지
 * 다시 받았다.** 공개 서버는 혼잡하고(429/504) 예절상 같은 질의를 반복해서
 * 던지면 안 된다. 성공한 응답을 디스크에 두면 다음 실행은 못 받은 것만 받는다.
 *
 * `--fresh` 를 주면 캐시를 무시한다(OSM 데이터가 갱신됐을 때).
 */
const CACHE_DIR = ".cache/osm";
const FRESH = process.argv.includes("--fresh");
function cachePath(slug) {
  return `${CACHE_DIR}/${slug}.json`;
}

const OUT = "lib/courses.routes.json";
const CHECK_ONLY = process.argv.includes("--check");

const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

/**
 * 코스별 입력은 **`lib/courses.ts` 에서 파생시킨다.** 손으로 적지 않는다.
 *
 * ⚠️ 2026-09-08 — 이 파일에 좌표를 손으로 적어서 사고가 났다.
 * 뚝섬에는 공원 진입 지점이 없어서 내가 **"두 끝점의 중간을 북쪽으로 400m"**
 * 라고 계산한 값을 hint 로 넣었다. 그건 **좌표를 지어낸 것**이다
 * (`AGENTS.md` §1 이 금지하는 바로 그것).
 *
 * 결과: 그 hint 가 강 위/엉뚱한 길에 붙어서 **경로선이 한강을 가로질렀다.**
 * 숫자로는 통과했다 — 점 5개, 비율 1.01배, 보정 334/219m. 전부 정상 범위다.
 * **화면을 보고서야 알았다**(`npm run shot`).
 *
 * 그래서 hint 는 이제 **공식 자료에서 확인된 좌표만** 쓴다:
 *   ① 공원 진입 지점(kind: "start") 이 있으면 그것
 *   ② 없으면 지하철 출구(kind: "station") — 공식 '오시는길' 값이다
 * 둘 다 없으면 그 코스는 **건너뛴다.** 지어내지 않는다.
 *
 * bbox 도 두 끝점에서 계산한다(여유 0.012도 ≈ 1.3km).
 */
const COURSES_TS = readFileSync("lib/courses.ts", "utf8");

function jobsFromCourses() {
  const jobs = [];
  /**
   * 코스 블록을 slug 경계로 잘라서 각 블록 안의 좌표만 읽는다.
   * 처음엔 `points: [ ... ]` 를 `\n    ]` 로 닫는 정규식을 썼는데,
   * **들여쓰기에 의존해서 4개 중 2개만 잡혔다.** 경계는 슬러그로 잡는 게 맞다.
   */
  const slugs = [...COURSES_TS.matchAll(/^\s*slug: "([a-z]+)",/gm)];
  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i][1];
    const from0 = slugs[i].index;
    const to0 = i + 1 < slugs.length ? slugs[i + 1].index : COURSES_TS.length;
    const block = COURSES_TS.slice(from0, to0);
    const pts = [...block.matchAll(/name: "([^"]+)", lat: ([\d.]+), lon: ([\d.]+), kind: "(\w+)"/g)].map(
      (x) => ({ name: x[1], lat: +x[2], lon: +x[3], kind: x[4] })
    );
    const turns = pts.filter((p) => p.kind === "turn");
    const hintPt = pts.find((p) => p.kind === "start") ?? pts.find((p) => p.kind === "station");
    if (turns.length < 2 || !hintPt) {
      jobs.push({ slug, skip: `확인된 ${turns.length < 2 ? "왕복 지점" : "진입 지점"}이 없다` });
      continue;
    }
    const [a, b] = turns;
    const pad = 0.012;
    const lats = [a.lat, b.lat, hintPt.lat];
    const lons = [a.lon, b.lon, hintPt.lon];
    jobs.push({
      slug,
      hintName: hintPt.name,
      bbox: [
        (Math.min(...lats) - pad).toFixed(4),
        (Math.min(...lons) - pad).toFixed(4),
        (Math.max(...lats) + pad).toFixed(4),
        (Math.max(...lons) + pad).toFixed(4),
      ].join(","),
      hint: [hintPt.lat, hintPt.lon],
      from: [a.lat, a.lon],
      to: [b.lat, b.lon],
    });
  }
  return jobs;
}

const JOBS = jobsFromCourses();

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
/**
 * 요청 형식을 왜 이렇게 쓰는가 — 2026-09-07 에 한 번 틀렸다.
 *
 * 처음에는 `body: query` 로 질의문을 그대로 보냈다. 브라우저에서는 됐는데
 * Node 에서는 **overpass-api.de 가 406**, 미러들이 **429** 를 돌려줬다.
 * 나는 이걸 "서버 혼잡"이라고 적었다. **틀린 진단이었다** —
 * 406(Not Acceptable)은 혼잡이 아니라 **요청을 받아들일 수 없다**는 뜻이다.
 *
 * 두 가지가 빠져 있었다.
 *   ① Overpass 가 문서에 적어 둔 형식은 `data=<urlencoded>` +
 *      `application/x-www-form-urlencoded` 다. 브라우저 fetch 가 붙여 주던
 *      `text/plain` 을 서버가 관용적으로 받아 줬을 뿐이다.
 *   ② **User-Agent 가 없었다.** Overpass 사용 예절(및 미러들의 차단 규칙)은
 *      연락 가능한 UA 를 요구한다. Node fetch 는 기본 UA 가 빈약하다.
 *      미러의 즉각적인 429 는 혼잡이 아니라 **이것 때문일 가능성이 크다.**
 *
 * 교훈은 이 저장소에 이미 적혀 있던 것과 같다 — **상태코드를 원인으로 바로
 * 번역하지 마라.** 406 을 혼잡으로 읽는 바람에 "나중에 다시 실행하세요"라는
 * 쓸모없는 안내를 내보냈다.
 *
 * ⚠️ 그리고 고치면서 **또 틀렸다.** UA 에 한글을 넣었다:
 *      "ddaiga-americano/1.0 (러닝 코스 경로선; ...)"
 *    HTTP 헤더 값은 **ASCII(ByteString)만 허용된다.** Node 는 이걸
 *      `TypeError: Cannot convert argument to a ByteString because the
 *       character at index 22 has a value of 47084`
 *    로 던지는데, 내 catch 는 `e.name` 만 찍었다 — 화면에는 `TypeError` 다섯 글자만
 *    남았고 원인이 통째로 사라졌다. **UA 는 반드시 ASCII 로 쓴다.**
 *    그리고 오류는 name 이 아니라 **message 를 찍는다.**
 */
// ASCII 만. 한글을 넣으면 fetch 가 TypeError 를 던진다(위 주석 참고).
const UA = "ddaiga-americano/1.0 (+https://ddaiga-americano.vercel.app)";

async function overpass(query, ms = 90_000) {
  const errors = [];
  for (const url of ENDPOINTS) {
    const ac = new AbortController();
    const to = setTimeout(() => ac.abort(), ms);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": UA,
          Accept: "application/json",
        },
        body: "data=" + encodeURIComponent(query),
        signal: ac.signal,
      });
      clearTimeout(to);
      const text = await res.text();
      if (res.ok && text.trimStart().startsWith("{")) return JSON.parse(text);
      // 상태코드마다 사람이 할 일이 다르다. 뭉뚱그리면 잘못된 안내가 나간다.
      const hint =
        res.status === 429 || res.status === 504
          ? "서버 혼잡 — 잠시 뒤 다시"
          : res.status === 406 || res.status === 400
            ? "질의 형식 거부 — 코드 문제다"
            : `HTTP ${res.status}`;
      errors.push(`${new URL(url).host} ${res.status} (${hint})`);
    } catch (e) {
      clearTimeout(to);
      // **message 를 찍는다.** name 만 찍으면 "TypeError" 다섯 글자가 남고
      // 원인(잘못된 헤더인지, DNS 인지, TLS 인지)이 통째로 사라진다.
      errors.push(
        `${new URL(url).host} ${e.name === "AbortError" ? "시간초과" : `${e.name}: ${e.message}${e.cause?.code ? ` (${e.cause.code})` : ""}`}`
      );
    }
    await new Promise((r) => setTimeout(r, 1500));
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
    // 검사에 쓴다 — 경로가 실제로 이은 두 점. 다리 좌표가 아니다.
    snapFrom: pos.get(s.k),
    snapTo: pos.get(t.k),
  };
}

/**
 * 말이 되는 값인가.
 *
 * **길은 두 끝점 사이 직선거리보다 짧을 수 없다.** 비율 1.0 미만은 불가능한 값이다.
 *
 * ⚠️ 2026-09-07 — 이 검사를 처음엔 **잘못 비교했다.**
 * 나는 `hv(job.from, job.to)` 즉 **다리 좌표 사이** 직선거리와 비교했다.
 * 그런데 경로가 실제로 잇는 두 점은 다리가 아니라 **강변에 스냅된 점**이고,
 * 다리는 강 가운데에 있으니 스냅으로 400~600m 가 빠진다.
 * 그래서 정상 경로인데도 "직선보다 짧다"로 떨어질 수 있다 —
 * 여의도 1.01km(다리 직선 1.15km)가 그 경우였다. **서로 다른 두 점 사이의
 * 거리를 비교했으니 애초에 판정할 수 없는 값이었다.**
 *
 * 지금은 **경로가 실제로 이은 두 점** 사이 직선거리와 비교한다. 이건 참이어야
 * 하는 부등식이라(경로 ≥ 직선) 위반은 곧 계산 오류다.
 * 다리 좌표까지의 거리는 별도로 `snapFromM/snapToM` 으로 본다 — 그건
 * "엉뚱한 곳에 붙었나"를 보는 다른 질문이다.
 *
 * **검사를 만들 때도 같은 것끼리 비교하는지 먼저 확인해야 한다.**
 * 검사가 틀리면 옳은 데이터를 버린다.
 */
function verdict(job, r) {
  // 경로가 실제로 이은 두 점 사이 직선거리. 이것과 비교하는 것이 맞다.
  const straight = hv(r.snapFrom, r.snapTo);
  const ratio = r.km / straight;
  // 참고용 — 다리 좌표 사이 직선거리. 판정에는 쓰지 않는다.
  const bridgeStraight = hv(job.from, job.to);
  const problems = [];
  if (ratio < 0.999)
    problems.push(`끝점 사이 직선(${straight.toFixed(2)}km)보다 짧다 — 불가능한 값이다`);
  if (ratio > 2.2) problems.push(`직선의 ${ratio.toFixed(1)}배다 — 엉뚱하게 돌아간 경로다`);
  if (r.coords.length < 4) problems.push(`점이 ${r.coords.length}개뿐이다 — 선이 안 그려진다`);
  /**
   * 끝점 보정 한계를 1200m -> 700m 로 조였다 (2026-09-08).
   *
   * 여의도가 보정 635/939m 로 **통과했다.** 그런데 939m 는 그 코스에서
   * **선이 U턴 핀에 닿지 않는다**는 뜻이다. 사람이 보면 "선이 왜 중간에서
   * 끊기지?" 가 된다. 더 나쁜 건 지도 위 칩이 그 짧은 선의 길이를
   * **"편도 1.0km"** 로 적는다는 것이다 — 코스 거리가 아닌 숫자를 코스 거리로
   * 내보낸다. **틀린 숫자는 없는 숫자보다 나쁘다.**
   *
   * 한강 교량 폭이 300~500m 라 강변까지의 스냅은 그 절반쯤이 정상이다.
   * 700m 를 넘으면 강변이 아니라 엉뚱한 길(섬 안쪽 산책로 등)에 붙은 것이다.
   */
  const snapMax = Math.max(r.snapFromM, r.snapToM);
  if (snapMax > 700)
    problems.push(`끝점 보정이 ${snapMax}m다 — 선이 U턴 지점에 닿지 않는다`);
  return {
    straight: +straight.toFixed(2),
    bridgeStraight: +bridgeStraight.toFixed(2),
    ratio: +ratio.toFixed(2),
    problems,
  };
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
    if (job.skip) { console.log(dim(`  · ${job.slug} 건너뜀 — ${job.skip}`)); continue; }
    const r = data[job.slug];
    if (!r) { console.log(dim(`  · ${job.slug} 없음 (지도는 경로선 없이 그려집니다)`)); continue; }
    /**
     * **검사에 필요한 값이 없으면 통과가 아니다.**
     *
     * 2026-09-08 에 이걸로 한 번 통과했다. `snapFromM/snapToM` 필드를 나중에
     * 추가했더니, 그 전에 저장된 여의도 항목에는 값이 없었다. 나는 `?? 0` 으로
     * 기본값을 줬고 — **0m 는 완벽한 값이라 검사를 무조건 통과한다.**
     * 그래서 보정 939m 짜리 잘못된 선이 배포됐다.
     *
     * 없는 값에 관대한 기본값을 주는 것은 검사를 끄는 것과 같다.
     * 모르면 **모른다고 실패**해야 한다 — 다시 받으면 채워진다.
     */
    if (r.snapFromM === undefined || r.snapToM === undefined) {
      bad++;
      console.log(
        red(`  ✗ ${job.slug} — 끝점 보정값이 원장에 없습니다. \`npm run routes\` 로 다시 받으세요`)
      );
      continue;
    }
    // 저장 파일에는 스냅 좌표를 남기지 않는다(불필요한 중복이다).
    // 대신 저장된 선의 **양 끝점**을 쓴다 — 그게 경로가 실제로 이은 두 점이다.
    const v = verdict(job, {
      ...r,
      snapFrom: r.coords[0],
      snapTo: r.coords.at(-1),
    });
    if (v.problems.length) { bad++; console.log(red(`  ✗ ${job.slug} ${r.km}km — ${v.problems.join("; ")}`)); }
    else console.log(green(`  ✓ ${job.slug} ${r.km}km (양끝 직선 ${v.straight}km, ${v.ratio}배, 점 ${r.coords.length}개)`));
  }
  process.exit(bad ? 1 : 0);
}

const result = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
const today = new Date().toISOString().slice(0, 10);
let ok = 0;
let failed = 0;

for (const job of JOBS) {
  if (job.skip) {
    console.log(dim(`  · ${job.slug} 건너뜀 — ${job.skip} (좌표를 지어내지 않는다)`));
    if (result[job.slug]) { delete result[job.slug]; failed++; }
    continue;
  }
  process.stdout.write(dim(`  ${job.slug} 받는 중… `));
  try {
    let osm;
    const cf = cachePath(job.slug);
    if (!FRESH && existsSync(cf)) {
      osm = JSON.parse(readFileSync(cf, "utf8"));
      process.stdout.write(dim("(캐시) "));
    } else {
      osm = await overpass(
        `[out:json][timeout:90];\nway["highway"]["name"~"자전거길|산책로"](${job.bbox});\nout geom;`
      );
      mkdirSync(CACHE_DIR, { recursive: true });
      writeFileSync(cf, JSON.stringify(osm), "utf8");
    }
    const r = buildRoute(osm, job);
    const v = verdict(job, r);
    if (v.problems.length) {
      failed++;
      console.log(red(`✗ ${r.km}km`));
      for (const p of v.problems) console.log(red(`      ${p}`));
      /**
       * **떨어지면 기존 항목도 지운다.**
       * 처음엔 `continue` 만 했다. 그러면 전에 통과해 저장된 값이 그대로 남는다 —
       * 검사를 조인 뒤에도 옛 데이터로 선이 그려진다. 검사를 고친 의미가 없다.
       */
      if (result[job.slug]) {
        delete result[job.slug];
        console.log(dim(`      전에 저장된 값도 지웠습니다.`));
      }
      console.log(dim(`      지도는 이 코스만 경로선 없이 그려집니다.`));
      continue;
    }
    result[job.slug] = {
      coords: r.coords,
      km: r.km,
      // 선의 양 끝이 다리에서 얼마나 떨어졌나. **파일에 남겨야 --check 가 본다.**
      // 처음엔 안 남겨서 --check 가 이 항목을 아예 검사하지 못했다.
      snapFromM: r.snapFromM,
      snapToM: r.snapToM,
      source: {
        label: "OpenStreetMap 기여자 — 한강 자전거길·산책로 (Overpass)",
        url: "https://www.openstreetmap.org/copyright",
        checkedAt: today,
      },
    };
    ok++;
    console.log(
      green(`✓ ${r.km}km`) +
        dim(` (양끝 직선 ${v.straight}km · ${v.ratio}배 · 점 ${r.coords.length}개 · 다리기준 ${v.bridgeStraight}km · 보정 ${r.snapFromM}/${r.snapToM}m)`)
    );
  } catch (e) {
    failed++;
    console.log(red(`✗ ${e.message}`));
  }
}

if (ok || failed) {
  writeFileSync(OUT, JSON.stringify(result, null, 2) + "\n", "utf8");
  console.log(`\n${green(`${ok}개를 ${OUT} 에 썼습니다.`)} ${failed ? red(`${failed}개 실패.`) : ""}`);
  console.log(dim("실패한 것은 서버 혼잡일 수 있습니다 — 시간을 두고 다시 실행하면 채워집니다."));
} else {
  console.log(red(`\n하나도 못 받았습니다.`));
  console.log(dim("위 괄호 안 진단을 보세요 — '서버 혼잡'이면 잠시 뒤 다시, '질의 형식 거부'면 코드 문제입니다."));
}
process.exit(0);
