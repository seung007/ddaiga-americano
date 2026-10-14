import type { HangangCourse } from "@/lib/courses";

/**
 * 코스 지도 공용 — Leaflet(OpenStreetMap)·카카오맵 둘 다 같은 핀·같은 규칙을 쓴다 (2026-10-14 분리)
 * 핀 모양·U턴 핀을 경로선 끝으로 옮기는 규칙의 이유는 각 함수 주석.
 */

/** 지도 위를 움직이는 점(가상 달리기의 나·같이 달린 러너) */
export type Runner = { id: string; lat: number; lng: number; color: string; label: string };

/**
 * 지점 종류 — 색·글리프·이름표를 여기 한 곳에서 정한다.
 *
 * 2026-09-07: 전에는 알약 모양 라벨 두 종류(초록/검정)뿐이었다. 문제가 둘.
 *   ① **알약의 가운데가 좌표를 가리켰다.** 지도 마커는 네이버·카카오처럼
 *      **끝이 한 점을 찍어야** 어디를 말하는지가 분명하다.
 *   ② 지하철 출구와 공원 진입점이 **둘 다 초록 '출발'** 이었다.
 *      한 코스에 출발이 두 개 찍히니 구분이 안 됐다.
 *
 * 그래서 물방울 핀 + 종류별 색·글리프로 바꿨다. 색은 사이트 팔레트를 따른다.
 */
export const KINDS = {
  station: { label: "지하철", color: "#2563eb", glyph: "M" },
  start: { label: "출발", color: "#059669", glyph: "▶" },
  turn: { label: "U턴", color: "#e11d48", glyph: "↺" },
} as const;
export type Kind = (typeof KINDS)[keyof typeof KINDS];

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );
}

/**
 * 물방울 핀 + 이름표.
 *
 * 핀은 SVG 라 확대해도 안 깨지고, 이름표는 흰 알약이라 지도 글씨 위에서도 읽힌다.
 * 기본 자리는 핀 **아래**(네이버·카카오와 같은 배치 — 핀 끝이 가리키는 지점을 가리지 않는다).
 *
 * 2026-10-14: 잠실 지도에서 「U턴 잠실대교」 이름표가 「지하철 잠실나루역」 이름표를 덮었다(운영자 지적).
 *   이름표 자리가 아래로 고정이라 가까운 핀끼리 늘 겹칠 수 있었다. 그래서
 *   **상자 크기 = 핀(26×38), 끝 = 상자 아래 가운데**로 바꾸고, 이름표는 상자 밖에 절대 위치로 띄운다.
 *   자리(아래·오른쪽·왼쪽·위)는 지도가 멈출 때마다 placeLabels 가 다시 고른다.
 */
export const PIN_W = 26;
export const PIN_H = 38;

/**
 * 좁을 때 쓰는 짧은 이름표 — 출구 번호·괄호를 뺀 이름만(종류 글자도 뺀다. 핀 색·글리프가 이미 말해 준다).
 * 「고속터미널역 8-1·8-2번 출구」 → 「고속터미널역」, 「뚝섬한강공원 (자양역 2·3번 출구)」 → 「뚝섬한강공원」.
 * 출구 번호는 아래 칩 목록과 본문 「가는 길」에 그대로 있다.
 */
export function shortName(name: string) {
  return name
    .replace(/\s*\(.*?\)\s*/g, " ")
    .replace(/\s*[\d·\-]+번\s*출구\s*$/, "")
    .trim();
}

const LABEL_CSS =
  "position:absolute;visibility:hidden;padding:2px 6px;border-radius:6px;background:rgba(255,255,255,.95);box-shadow:0 1px 3px rgba(0,0,0,.25);color:#0f172a;white-space:nowrap";

export function pinHtml(k: Kind, name: string) {
  const short = shortName(name);
  return `<div title="${escapeHtml(`${k.label} ${name}`)}" style="position:relative;width:${PIN_W}px;height:${PIN_H}px;font:600 11px/1.25 -apple-system,system-ui,'Malgun Gothic',sans-serif">
  <svg width="${PIN_W}" height="${PIN_H}" viewBox="0 0 26 38" style="display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">
    <path d="M13 37C13 37 25 22.5 25 13A12 12 0 1 0 1 13c0 9.5 12 24 12 24z" fill="${k.color}" stroke="#fff" stroke-width="2"/>
    <circle cx="13" cy="13" r="6.5" fill="#fff"/>
    <text x="13" y="16.5" text-anchor="middle" fill="${k.color}" style="font:700 9px/1 -apple-system,system-ui,sans-serif">${k.glyph}</text>
  </svg>
  <span data-pin-label style="${LABEL_CSS};visibility:visible;left:${PIN_W / 2}px;top:${PIN_H + 2}px;transform:translateX(-50%)"><span style="color:${k.color}">${k.label}</span> ${escapeHtml(name)}</span>
  <span data-pin-short style="${LABEL_CSS};left:0;top:0">${escapeHtml(short)}</span>
</div>`;
}

/* ── 이름표 자리 고르기 ───────────────────────────────────────────── */

export type Side = "b" | "r" | "l" | "t";
export type Rect = { x: number; y: number; w: number; h: number };
/** 핀 하나: 지도 상자 기준 핀 끝 좌표(x,y), 이름표 크기(w,h), 짧은 이름표 폭(sw, 없으면 0), 우선순위(작을수록 먼저) */
export type LabelItem = { x: number; y: number; w: number; h: number; sw?: number; rank: number };
export type Placement = { side: Side; short: boolean } | null;

const GAP = 2;
/** 아래 → 오른쪽 → 왼쪽 → 위. 아래가 지도 앱들과 같은 기본 자리 */
const ORDER: Side[] = ["b", "r", "l", "t"];

/** 핀 끝 (x,y) 기준 이름표 상자 */
export function labelRect(it: LabelItem, side: Side): Rect {
  const headY = it.y - PIN_H + 13; // 물방울 머리(원) 가운데
  switch (side) {
    case "b":
      return { x: it.x - it.w / 2, y: it.y + GAP, w: it.w, h: it.h };
    case "t":
      return { x: it.x - it.w / 2, y: it.y - PIN_H - GAP - it.h, w: it.w, h: it.h };
    case "r":
      return { x: it.x + PIN_W / 2 + GAP, y: headY - it.h / 2, w: it.w, h: it.h };
    case "l":
      return { x: it.x - PIN_W / 2 - GAP - it.w, y: headY - it.h / 2, w: it.w, h: it.h };
  }
}

const pinRect = (it: LabelItem): Rect => ({ x: it.x - PIN_W / 2, y: it.y - PIN_H, w: PIN_W, h: PIN_H });
const hit = (a: Rect, b: Rect, pad = 2) =>
  a.x < b.x + b.w + pad && b.x < a.x + a.w + pad && a.y < b.y + b.h + pad && b.y < a.y + a.h + pad;
const inside = (r: Rect, W: number, H: number, m = 4) => r.x >= m && r.y >= m && r.x + r.w <= W - m && r.y + r.h <= H - m;

/**
 * 이름표끼리·남의 핀·지도 위 버튼(obstacles)과 겹치지 않고 지도 안에 들어가는 자리를 고른다.
 * 우선순위 순으로 하나씩, 단계별로 시도한다:
 *   ① 긴 이름표, 아무것도 안 겹침 → ② 짧은 이름표, 아무것도 안 겹침
 *   → ③ 긴 이름표, 남의 **핀**은 조금 덮어도 됨 → ④ 짧은 이름표, 핀은 덮어도 됨
 * 이름표끼리·버튼과는 끝까지 안 겹친다. 다 안 되면 null(숨김 — 핀과 아래 칩 목록은 남고,
 * 칩을 누르면 확대되며 다시 계산된다). 화면 밖 핀은 null.
 */
export function placeLabels(items: LabelItem[], W: number, H: number, obstacles: Rect[] = []): Placement[] {
  const out: Placement[] = items.map(() => null);
  const pins = items.map(pinRect);
  const taken: Rect[] = [...obstacles];
  const order = items.map((_, i) => i).sort((a, b) => items[a].rank - items[b].rank || a - b);
  for (const i of order) {
    const it = items[i];
    if (!inside(pins[i], W, H, 0)) continue;
    const tiers: { short: boolean; pinsOk: boolean }[] = [
      { short: false, pinsOk: false },
      { short: true, pinsOk: false },
      { short: false, pinsOk: true },
      { short: true, pinsOk: true },
    ].filter((t) => !t.short || (it.sw ?? 0) > 0);
    tiers: for (const tier of tiers) {
      const cur = tier.short ? { ...it, w: it.sw as number } : it;
      for (const side of ORDER) {
        const r = labelRect(cur, side);
        if (!inside(r, W, H)) continue;
        if (taken.some((t) => hit(r, t))) continue;
        if (!tier.pinsOk && pins.some((p, j) => j !== i && hit(r, p))) continue;
        out[i] = { side, short: tier.short };
        taken.push(r);
        break tiers;
      }
    }
  }
  return out;
}

/** 핀 상자(pinHtml) 안의 긴·짧은 이름표 중 고른 것만 고른 자리에 보이게 한다 */
export function applyPlacement(pin: HTMLElement | null | undefined, pl: Placement) {
  if (!pin) return;
  const full = pin.querySelector<HTMLElement>("[data-pin-label]");
  const short = pin.querySelector<HTMLElement>("[data-pin-short]");
  if (full) applySide(full, pl && !pl.short ? pl.side : null);
  if (short) applySide(short, pl && pl.short ? pl.side : null);
}

/** 핀 상자 안 이름표 크기 — 숨긴 것도 visibility 라 잴 수 있다 */
export function labelSize(pin: HTMLElement | null | undefined) {
  const full = pin?.querySelector<HTMLElement>("[data-pin-label]");
  const short = pin?.querySelector<HTMLElement>("[data-pin-short]");
  const fw = full?.offsetWidth ?? 0;
  const sw = short?.offsetWidth ?? 0;
  return { w: fw, h: full?.offsetHeight ?? 0, sw: sw && sw < fw ? sw : 0 };
}

/** 이름표 span 하나를 자리로 옮긴다. null 이면 숨김(크기는 재야 하므로 visibility) */
function applySide(label: HTMLElement, side: Side | null) {
  const s = label.style;
  s.visibility = side ? "visible" : "hidden";
  const c = PIN_W / 2;
  const head = 13;
  if (side === "r") Object.assign(s, { left: `${PIN_W + GAP}px`, top: `${head}px`, transform: "translateY(-50%)" });
  else if (side === "l") Object.assign(s, { left: `${-GAP}px`, top: `${head}px`, transform: "translate(-100%,-50%)" });
  else if (side === "t") Object.assign(s, { left: `${c}px`, top: `${-GAP}px`, transform: "translate(-50%,-100%)" });
  else Object.assign(s, { left: `${c}px`, top: `${PIN_H + GAP}px`, transform: "translateX(-50%)" });
}

/** 핀 우선순위 — 출발 → U턴 → 지하철 */
export const RANK = { start: 0, turn: 1, station: 2 } as const;

/** 지도 상자 기준 요소의 사각형 (지도 위 버튼·배지 → obstacles) */
export function rectIn(el: Element | null | undefined, box: Element): Rect | null {
  if (!el) return null;
  const a = el.getBoundingClientRect();
  const b = box.getBoundingClientRect();
  if (!a.width || !a.height) return null;
  return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height };
}

function km(a: [number, number], b: [number, number]) {
  const r = Math.PI / 180;
  const dLa = (b[0] - a[0]) * r, dLo = (b[1] - a[1]) * r;
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLo / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/**
 * **U턴 핀을 경로선의 양 끝으로 옮긴다.** (2026-09-08, CourseMapLive 에서 옮김)
 * 다리 좌표는 강 가운데라 핀이 강 위에 떠 있고 선과 이어지지 않았다. 실제로 돌아서는 곳은 강변길이다.
 * 이름표는 다리 이름 그대로. 경로선이 없는 코스는 다리 좌표 그대로.
 */
export function snapTurn(course: HangangCourse, p: HangangCourse["map"]["points"][number]): [number, number] {
  const route = course.map.route;
  if (!route?.coords.length || p.kind !== "turn") return [p.lat, p.lon];
  const ends = [route.coords[0], route.coords[route.coords.length - 1]] as [number, number][];
  return km([p.lat, p.lon], ends[0]) <= km([p.lat, p.lon], ends[1]) ? ends[0] : ends[1];
}
