"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap } from "leaflet";
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
 * ⚠️ OSM 타일 사용 정책 — 저작자 표시가 **의무**다. 아래 `attribution` 을 지우지 마라.
 *    그리고 트래픽이 커지면 공용 타일 서버를 쓰면 안 된다(현재 월 방문자 75명 수준).
 *
 * 경로선을 그리지 않은 이유
 * ────────────────────────
 * 산책로 실제 경로 좌표를 나는 갖고 있지 않다. 다리 좌표를 이어 선을 그으면
 * **강 위를 가로지르는 엉뚱한 선**이 된다. 대신 OSM 타일이 이미 강변 산책로를
 * 그려서 보여준다. 없는 경로를 그리는 것보다 있는 지도를 보여주는 게 맞다.
 *
 * ─────────────────────────────────────────────────────────────────
 * 2026-09-07 전면 수정 — 배포된 화면에서 **지도 4개 중 3개가 안 떴다.**
 * (한 번은 4개 다 안 떴다. 남는 건 "지도 불러오는 중…" 한 줄이다.)
 *
 * 실측으로 확인한 것:
 *   · leaflet.min.js 요청은 **200으로 성공**했다(37KB, 417ms).
 *   · 그런데 `window.L` 은 undefined 고, 내가 head 에 넣은 <script> 태그는
 *     **DOM 에서 사라져 있었다.** 스크립트가 실행되기 전에 치워진 것이다.
 *   · 그러면 내 Promise 는 onload 도 onerror 도 못 받아 **영원히 pending** 이다.
 *     그래서 오류 문구도 안 뜨고 "불러오는 중…"에서 멈춘다.
 *
 * 세 가지를 다 고쳤다:
 *
 * ① **CDN 을 버리고 npm 의존성으로 바꿨다.** `await import("leaflet")` 이라
 *    Next 가 번들에 넣고 코드 분할까지 해준다. 내가 손으로 <script> 를 head 에
 *    꽂는 짓을 안 한다 → React 와 head 를 다투지 않는다. 외부 CDN 이 본문 콘텐츠의
 *    필수 의존성이던 것도 사라졌다.
 *    (이 저장소의 기존 교훈과 같은 종류다 — **"차단도 결품도 200으로 온다."**
 *     상태코드 200을 성공으로 읽으면 이런 실패를 못 본다.)
 *
 * ② **Leaflet 에게 자기 div 를 줬다.** 전에는 React 가 관리하는 div 안에
 *    "불러오는 중" 자식을 넣어두고 **같은 div 를 Leaflet 컨테이너로 넘겼다.**
 *    한 DOM 노드를 둘이 소유하는 구조다. 지금은 안내문을 형제 오버레이로 빼서
 *    Leaflet 이 쓰는 div 에는 React 가 아무 자식도 렌더하지 않는다.
 *
 * ③ **타임아웃을 넣었다.** 무엇이 잘못돼도 12초 뒤에는 사람이 실패를 본다.
 *    영원한 로딩 표시는 **오류보다 나쁘다** — 기다리면 될 것처럼 보이니까.
 */

const TIMEOUT_MS = 12_000;

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
const KINDS = {
  station: { label: "지하철", color: "#2563eb", glyph: "M" },
  start: { label: "출발", color: "#059669", glyph: "▶" },
  turn: { label: "반환", color: "#e11d48", glyph: "↩" },
} as const;
type Kind = (typeof KINDS)[keyof typeof KINDS];

function escapeHtml(s: string) {
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
function pinHtml(k: Kind, name: string) {
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

/** leaflet 모듈을 한 번만 불러온다. 지도가 4개여도 청크는 하나다. */
let leafletPromise: Promise<typeof import("leaflet")> | null = null;
function loadLeaflet() {
  leafletPromise ??= import("leaflet");
  return leafletPromise;
}

export default function CourseMapLive({ course }: { course: HangangCourse }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const build = async () => {
      setState("loading");
      timer = setTimeout(() => {
        if (!cancelled && !mapRef.current) setState("error");
      }, TIMEOUT_MS);

      try {
        const L = await loadLeaflet();
        if (cancelled || !boxRef.current || mapRef.current) return;

        const map = L.map(boxRef.current, { scrollWheelZoom: false });
        mapRef.current = map;

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          // OSM 타일 정책상 저작자 표시는 의무다. 지우지 마라.
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> 기여자',
        }).addTo(map);

        // 거리 눈금 — 지도를 얼마나 확대해 보고 있는지 알려준다.
        L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

        for (const p of course.map.points) {
          const k = KINDS[p.kind];
          L.marker([p.lat, p.lon], {
            icon: L.divIcon({
              className: "",
              html: pinHtml(k, p.name),
              // 물방울 핀은 **끝이 좌표를 가리켜야** 한다. 가운데가 아니다.
              // 폭 160 의 가운데(80), 높이 중 핀 끝(38)을 앵커로 잡는다.
              iconSize: [160, 62],
              iconAnchor: [80, 38],
            }),
            // 반환점이 지하철 표시에 가리지 않게 순서를 준다.
            zIndexOffset: p.kind === "turn" ? 300 : p.kind === "start" ? 200 : 100,
            title: `${k.label} ${p.name}`,
          })
            .addTo(map)
            .bindTooltip(`<b>${k.label}</b> ${escapeHtml(p.name)}`, {
              direction: "top",
              offset: [0, -40],
              opacity: 1,
            });
        }

        map.fitBounds(
          L.latLngBounds(course.map.points.map((p) => [p.lat, p.lon] as [number, number])),
          { padding: [40, 40] }
        );

        clearTimeout(timer);
        if (!cancelled) setState("ready");
      } catch {
        clearTimeout(timer);
        if (!cancelled) setState("error");
      }
    };

    // 화면에 들어올 때만 만든다. 지도 4개를 처음부터 다 띄우면 무겁다.
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || mapRef.current) return;
        io.disconnect();
        void build();
      },
      { rootMargin: "200px" }
    );
    io.observe(wrap);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      io.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [course]);

  return (
    <div ref={wrapRef} className="overflow-hidden rounded-2xl border border-gray-200">
      {/* 이 relative 안에서 지도와 안내문은 **형제**다.
          안내문을 지도 div 의 자식으로 두면 React 와 Leaflet 이 같은 노드를 다툰다. */}
      <div className="relative h-[320px] w-full bg-gray-50 sm:h-[380px]">
        {/* Leaflet 전용 — React 는 여기에 자식을 렌더하지 않는다. */}
        <div ref={boxRef} className="absolute inset-0" />
        {state !== "ready" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-gray-400">
            {state === "error"
              ? "지도를 불러오지 못했습니다. 아래 ‘다리 순서 도식’과 가는 길 안내로 확인하세요."
              : "지도 불러오는 중…"}
          </div>
        )}
      </div>
      <div className="border-t border-gray-100 bg-white px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-blue-600">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            지하철 출구
          </span>
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
            공원 진입 지점
          </span>
          <span className="flex items-center gap-1.5 text-rose-600">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
            왕복 반환점
          </span>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
          핀 끝이 실제 지점입니다. 지도를 끌어 강변 산책로를 확인하세요 — 왼쪽 아래 눈금이
          거리 기준입니다. 마우스 휠 확대는 페이지 스크롤과 겹쳐 껐고, <b>＋ －</b> 버튼으로
          확대·축소합니다.
        </p>
      </div>
    </div>
  );
}
