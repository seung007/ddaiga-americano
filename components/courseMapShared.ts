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
 * 물방울 핀 + 그 밑 이름표.
 *
 * 핀은 SVG 라 확대해도 안 깨지고, 이름표는 흰 알약이라 지도 글씨 위에서도 읽힌다.
 * 이름표를 핀 **아래**에 두는 것이 네이버·카카오와 같은 배치다 — 핀 끝이 가리키는
 * 지점을 이름표가 가리지 않는다.
 */
export function pinHtml(k: Kind, name: string) {
  return `<div style="width:160px;text-align:center;font:600 11px/1.25 -apple-system,system-ui,'Malgun Gothic',sans-serif">
  <svg width="26" height="38" viewBox="0 0 26 38" style="display:block;margin:0 auto;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">
    <path d="M13 37C13 37 25 22.5 25 13A12 12 0 1 0 1 13c0 9.5 12 24 12 24z" fill="${k.color}" stroke="#fff" stroke-width="2"/>
    <circle cx="13" cy="13" r="6.5" fill="#fff"/>
    <text x="13" y="16.5" text-anchor="middle" fill="${k.color}" style="font:700 9px/1 -apple-system,system-ui,sans-serif">${k.glyph}</text>
  </svg>
  <span style="display:inline-block;margin-top:2px;padding:2px 6px;border-radius:6px;background:rgba(255,255,255,.95);box-shadow:0 1px 3px rgba(0,0,0,.25);color:#0f172a;white-space:nowrap">
    <span style="color:${k.color}">${k.label}</span> ${escapeHtml(name)}
  </span>
</div>`;
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
