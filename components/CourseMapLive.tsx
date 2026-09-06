"use client";

import { useEffect, useRef, useState } from "react";
import type { HangangCourse } from "@/lib/courses";

/**
 * 실제 지도 — Leaflet + OpenStreetMap
 *
 * 왜 도식을 버리고 지도를 넣었나 (2026-09-06)
 * ──────────────────────────────────────────
 * `CourseFigure`(다리 이름을 일렬로 늘어놓은 도식)는 **코스 안내가 아니었다.**
 * 사용자 지적이 정확했다 — *"저렇게 글로만 하면 퍽이나 사람들이 알겠다"*.
 * 어디서 출발해 어느 방향으로 뛰는지 그 도식으로는 알 수 없다.
 *
 * 내가 처음에 지도를 밀어낸 근거는 **"SVG 텍스트는 크롤되고 지도 SDK는 안 된다"**였다.
 * 그런데 같은 날 GSC 실측이 그 논거를 무너뜨렸다 —
 * **구글은 우리 페이지를 크롤 자체를 안 하고 있다**(색인 11 / 미색인 33,
 * 사유 100%가 "발견됨 — 현재 색인이 생성되지 않음"). 크롤되지도 않는 텍스트를 지키려고
 * 사람에게 쓸모없는 페이지를 만든 셈이다.
 *
 * **SEO를 위해 사용성을 버리면 SEO도 얻지 못한다.**
 *
 * 왜 카카오맵이 아니라 Leaflet + OSM 인가
 * ───────────────────────────────────────
 * 카카오맵 JS SDK는 **앱 키가 필요하고 도메인 등록도 해야 한다** — 사람을 기다려야 한다.
 * Leaflet은 MIT, OSM 타일은 키가 없다. **지금 배포된다.**
 * 카카오맵으로 올리는 건 나중에 키가 생기면 하는 업그레이드다(길찾기·도보 경로 API).
 *
 * ⚠️ OSM 타일 사용 정책 — 저작자 표시가 **의무**다. 아래 `attribution` 을 지우지 마라.
 *    그리고 트래픽이 커지면 공용 타일 서버를 쓰면 안 된다(현재 월 방문자 75명 수준).
 *
 * 경로선을 그리지 않은 이유
 * ────────────────────────
 * 산책로 실제 경로 좌표를 나는 갖고 있지 않다. 다리 좌표를 이어 선을 그으면
 * **강 위를 가로지르는 엉뚱한 선**이 된다. 대신 **OSM 타일이 이미 강변 산책로를
 * 그려서 보여준다** — 지도를 켜면 사람이 실제 길을 눈으로 본다.
 * 없는 경로를 그리는 것보다 있는 지도를 보여주는 게 맞다.
 *
 * 성능 — 지도 4개를 한 페이지에 다 띄우면 무겁다. `IntersectionObserver`로
 * **화면에 들어올 때만** Leaflet을 불러온다.
 */

const LEAFLET_CSS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
const LEAFLET_JS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";

type LeafletGlobal = {
  map: (el: HTMLElement, o?: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, o: Record<string, unknown>) => { addTo: (m: LeafletMap) => void };
  marker: (ll: [number, number], o?: Record<string, unknown>) => LeafletMarker;
  divIcon: (o: Record<string, unknown>) => unknown;
  latLngBounds: (lls: [number, number][]) => unknown;
};
type LeafletMap = { fitBounds: (b: unknown, o?: Record<string, unknown>) => void; remove: () => void };
type LeafletMarker = { addTo: (m: LeafletMap) => LeafletMarker; bindTooltip: (s: string, o?: Record<string, unknown>) => LeafletMarker };

let loading: Promise<LeafletGlobal> | null = null;

/** Leaflet을 한 번만 불러온다. 지도가 4개여도 스크립트는 하나다. */
function loadLeaflet(): Promise<LeafletGlobal> {
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const w = window as unknown as { L?: LeafletGlobal };
    if (w.L) return resolve(w.L);

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }
    const s = document.createElement("script");
    s.src = LEAFLET_JS;
    s.async = true;
    s.onload = () => (w.L ? resolve(w.L) : reject(new Error("Leaflet 로드 실패")));
    s.onerror = () => reject(new Error("Leaflet 스크립트를 가져올 수 없습니다"));
    document.head.appendChild(s);
  });
  return loading;
}

export default function CourseMapLive({ course }: { course: HangangCourse }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    // 화면에 들어올 때만 지도를 만든다.
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || mapRef.current) return;
        io.disconnect();
        setState("loading");

        loadLeaflet()
          .then((L) => {
            if (!boxRef.current) return;
            const map = L.map(boxRef.current, { scrollWheelZoom: false });
            mapRef.current = map;

            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
              maxZoom: 19,
              // OSM 타일 정책상 저작자 표시는 의무다. 지우지 마라.
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> 기여자',
            }).addTo(map);

            for (const p of course.map.points) {
              const start = p.kind === "start";
              const icon = L.divIcon({
                className: "",
                html: `<div style="
                    background:${start ? "#059669" : "#0f172a"};
                    color:#fff;font:600 11px/1.2 -apple-system,system-ui,sans-serif;
                    padding:4px 7px;border-radius:999px;white-space:nowrap;
                    box-shadow:0 1px 4px rgba(0,0,0,.35);transform:translate(-50%,-50%)">
                    ${start ? "출발 " : "반환 "}${p.name}
                  </div>`,
                iconSize: [0, 0],
              });
              L.marker([p.lat, p.lon], { icon }).addTo(map);
            }

            map.fitBounds(
              L.latLngBounds(course.map.points.map((p) => [p.lat, p.lon] as [number, number])),
              { padding: [40, 40] }
            );
            setState("ready");
          })
          .catch(() => setState("error"));
      },
      { rootMargin: "200px" }
    );

    io.observe(box);
    return () => {
      io.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [course]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200">
      <div ref={boxRef} className="h-[320px] w-full bg-gray-50 sm:h-[380px]">
        {state !== "ready" && (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            {state === "error" ? "지도를 불러오지 못했습니다" : "지도 불러오는 중…"}
          </div>
        )}
      </div>
      <p className="border-t border-gray-100 bg-white px-4 py-2.5 text-xs leading-relaxed text-gray-500">
        <strong className="text-emerald-700">초록</strong> = 출발 지점 ·{" "}
        <strong className="text-gray-900">검정</strong> = 왕복 반환점.
        {" "}지도를 움직여 강변 산책로를 확인하세요. 마우스 휠 확대는 페이지 스크롤과 겹쳐 껐습니다.
      </p>
    </div>
  );
}
