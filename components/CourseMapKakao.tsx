"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- 카카오맵 SDK 는 타입 정의를 배포하지 않는다. 이 파일 안에서만 any 를 쓴다 */
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import type { HangangCourse } from "@/lib/courses";
import {
  KINDS,
  RANK,
  applyPlacement,
  labelSize,
  escapeHtml,
  pinHtml,
  placeLabels,
  rectIn,
  snapTurn,
  type Rect,
  type Runner,
} from "@/components/courseMapShared";

/**
 * 코스 지도 — 카카오맵 (2026-10-14)
 *
 * 운영자: "지금 둘 다 별로거든? 지도를 네이버에서 가져올 수 없어?" → 카카오맵으로 시작하기로 정함.
 * OpenStreetMap 타일은 한국 지명·산책로 표기가 낯설고(영문·한자 혼용), 가상 달리기는 지도 없이 회색 선만 있었다.
 *
 *   · 키: 카카오톡 공유 버튼이 이미 쓰는 NEXT_PUBLIC_KAKAO_JS_KEY 를 그대로 쓴다(같은 앱의 **JavaScript 키** — REST 키 아님).
 *     운영자: "예전에 카카오 했을 텐데" → 새 앱·새 키를 만들지 않는다. 지도만 다른 앱으로 떼고 싶을 때만 NEXT_PUBLIC_KAKAO_MAP_KEY 로 덮어쓴다.
 *     키만으로는 안 뜬다 — 카카오 개발자 콘솔에서 그 앱의 「카카오맵」 사용 설정을 켜고, JavaScript SDK 도메인에 사이트 주소가 있어야 한다(설정_안내.md 「ⓐ-1」).
 *     브라우저에 그대로 보이는 값이고, 등록한 도메인에서만 동작한다.
 *   · 키가 없거나, SDK 가 10초 안에 안 뜨거나, 오류가 나면 **onFail** → 부모(CourseMap)가 기존 Leaflet 지도로 바꾼다.
 *     예전 교훈: 「영원한 로딩 표시는 오류보다 나쁘다」(CourseMapLive 머리말).
 *   · SDK 는 next/script 로 싣는다. head 에 손으로 <script> 를 꽂으면 React 와 다투다 사라진 적이 있다(check-cdn 머리말).
 *   · 무료 쿼터: 웹 지도 하루 30만 건(카카오 개발자 문서 「쿼터」, 2026-10-14 확인). 넘으면 429 → 이것도 onFail 로 Leaflet.
 *   · 카카오 로고·저작권 표시는 SDK 가 지도 안에 그린다. 가리지 않는다.
 */

// next 는 process.env.NEXT_PUBLIC_* 를 글자 그대로 찾아 빌드 때 바꿔 넣는다 — 두 이름을 각각 적어야 한다
const KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY || process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "";
const SDK = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KEY}&autoload=false`;
const TIMEOUT_MS = 10_000;

export const kakaoEnabled = () => KEY.length > 0;

export default function CourseMapKakao({
  course,
  runners = [],
  onFail,
}: {
  course: HangangCourse;
  runners?: Runner[];
  onFail: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const pinRef = useRef<any[]>([]);
  const badgeRef = useRef<HTMLDivElement>(null);
  const runnerRef = useRef<Map<string, any>>(new Map());
  const [visible, setVisible] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [state, setState] = useState<"loading" | "ready">("loading");
  const [active, setActive] = useState<number | null>(null);

  // 화면에 가까워질 때만 SDK 를 싣는다(지도 4개를 처음부터 다 띄우면 무겁다)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es[0]?.isIntersecting) {
          setVisible(true);
          // SDK 가 이미 다른 코스 지도에서 실려 있으면 next/script 가 onReady 를 다시 불러 주지만, 안전하게 바로 표시
          if ((window as any).kakao?.maps?.load) setSdkReady(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 무엇이 잘못돼도 10초 뒤에는 Leaflet 으로 바꾼다
  useEffect(() => {
    if (!visible || state === "ready") return;
    const t = setTimeout(onFail, TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [visible, state, onFail]);

  useEffect(() => {
    if (!sdkReady || !boxRef.current || mapRef.current) return;
    const kakao = (window as any).kakao;
    try {
      kakao.maps.load(() => {
        if (!boxRef.current || mapRef.current) return;
        const LL = (lat: number, lng: number) => new kakao.maps.LatLng(lat, lng);
        const route = course.map.route;
        const first = route?.coords[0] ?? [course.map.points[0].lat, course.map.points[0].lon];
        const map = new kakao.maps.Map(boxRef.current, {
          center: LL(first[0], first[1]),
          level: 5,
          scrollwheel: false, // 페이지를 내리다 지도가 확대되는 일을 막는다(Leaflet 때와 같은 판단)
        });
        mapRef.current = map;
        // 확대 버튼이 차지하는 자리를 알아 두려고 붙이기 전후의 자식을 비교한다(SDK 가 요소를 돌려주지 않는다)
        const before = new Set(Array.from(boxRef.current.children));
        map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);
        const zoomEl = Array.from(boxRef.current.children).find((c) => !before.has(c)) ?? null;

        const bounds = new kakao.maps.LatLngBounds();
        if (route?.coords.length) {
          const path = route.coords.map(([a, b]) => LL(a, b));
          path.forEach((p: any) => bounds.extend(p));
          // 흰 테두리 한 겹 + 초록 선 — 어떤 바탕색에서도 선이 읽힌다(Leaflet 때와 같은 방식)
          new kakao.maps.Polyline({ map, path, strokeWeight: 10, strokeColor: "#ffffff", strokeOpacity: 0.95 });
          new kakao.maps.Polyline({ map, path, strokeWeight: 6, strokeColor: "#059669", strokeOpacity: 1 });
        }

        const pins = course.map.points.map((p) => {
          const [lat, lng] = snapTurn(course, p);
          const pos = LL(lat, lng);
          bounds.extend(pos);
          const holder = document.createElement("div");
          holder.innerHTML = pinHtml(KINDS[p.kind], p.name);
          const el = holder.firstElementChild as HTMLElement;
          const overlay = new kakao.maps.CustomOverlay({
            map,
            position: pos,
            content: el,
            // 상자 = 핀(26×38), 끝 = 상자 아래 가운데. 이름표는 상자 밖에 떠 있다(courseMapShared pinHtml)
            xAnchor: 0.5,
            yAnchor: 1,
            zIndex: p.kind === "turn" ? 3 : p.kind === "start" ? 2 : 1,
          });
          return { overlay, pos, el, rank: RANK[p.kind] };
        });
        pinRef.current = pins.map((x) => x.overlay);

        // 이름표 자리 — 지도가 멈출 때마다(처음·확대·이동) 다시 고른다
        const layout = () => {
          const box = boxRef.current;
          if (!box || mapRef.current !== map) return;
          const W = box.clientWidth, H = box.clientHeight;
          const proj = map.getProjection();
          const items = pins.map((x) => {
            const pt = proj.containerPointFromCoords(x.pos);
            return { x: pt.x, y: pt.y, ...labelSize(x.el), rank: x.rank };
          });
          const obstacles = [
            rectIn(zoomEl, box),
            rectIn(badgeRef.current, box),
            // 카카오 로고·축척(왼쪽 아래) — SDK 가 그리는 요소라 크기를 넉넉히 잡는다
            { x: 0, y: H - 30, w: 170, h: 30 },
          ].filter(Boolean) as Rect[];
          placeLabels(items, W, H, obstacles).forEach((pl, i) => applyPlacement(pins[i].el, pl));
        };
        kakao.maps.event.addListener(map, "idle", () => requestAnimationFrame(layout));

        map.setBounds(bounds, 48, 48, 48, 48);
        setState("ready");
        requestAnimationFrame(layout);
        setTimeout(layout, 400); // 거리 배지가 ready 뒤에 그려진다 — 그것까지 피하려고 한 번 더
      });
    } catch {
      onFail();
    }
  }, [sdkReady, course, onFail]);

  // 가상 달리기 점 — 지도는 그대로, 점만 옮긴다
  useEffect(() => {
    const map = mapRef.current;
    const kakao = (window as any).kakao;
    if (!map || state !== "ready" || !kakao?.maps) return;
    const seen = new Set<string>();
    for (const r of runners) {
      seen.add(r.id);
      const pos = new kakao.maps.LatLng(r.lat, r.lng);
      const o = runnerRef.current.get(r.id);
      if (o) o.setPosition(pos);
      else
        runnerRef.current.set(
          r.id,
          new kakao.maps.CustomOverlay({
            map,
            position: pos,
            content: `<div title="${escapeHtml(r.label)}" style="width:18px;height:18px;border-radius:9999px;background:${r.color};border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
            xAnchor: 0.5,
            yAnchor: 0.5,
            zIndex: 10,
          }),
        );
    }
    for (const [id, o] of runnerRef.current) {
      if (!seen.has(id)) {
        o.setMap(null);
        runnerRef.current.delete(id);
      }
    }
  }, [runners, state]);

  useEffect(
    () => () => {
      for (const o of pinRef.current) o.setMap?.(null);
      for (const o of runnerRef.current.values()) o.setMap?.(null);
      runnerRef.current.clear();
      mapRef.current = null;
    },
    [],
  );

  const focusPoint = (i: number) => {
    const map = mapRef.current;
    const kakao = (window as any).kakao;
    const p = course.map.points[i];
    if (!map || !p || !kakao) return;
    setActive(i);
    const [lat, lng] = snapTurn(course, p);
    if (map.getLevel() > 3) map.setLevel(3);
    map.panTo(new kakao.maps.LatLng(lat, lng));
  };

  return (
    <div ref={wrapRef} className="overflow-hidden rounded-2xl border border-gray-200">
      {visible && (
        <Script src={SDK} strategy="afterInteractive" onReady={() => setSdkReady(true)} onError={onFail} />
      )}
      <div className="relative h-[340px] w-full bg-gray-50 sm:h-[400px]">
        {/* 카카오맵 전용 — React 는 여기에 자식을 렌더하지 않는다(Leaflet 때 같은 노드를 둘이 다퉜다) */}
        <div ref={boxRef} className="absolute inset-0" />
        {state === "ready" && course.map.route && (
          <div ref={badgeRef} className="pointer-events-none absolute left-3 top-3 z-10 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-md">
            편도 {course.map.route.km}km
            <span className="mx-1.5 font-normal text-gray-300">|</span>
            <span className="text-emerald-700">왕복 {(course.map.route.km * 2).toFixed(1)}km</span>
          </div>
        )}
        {state !== "ready" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-gray-400">
            지도 불러오는 중…
          </div>
        )}
      </div>
      <div className="border-t border-gray-100 bg-white px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          {course.map.points.map((p, i) => {
            const k = KINDS[p.kind];
            const on = active === i;
            return (
              <button
                key={`${p.name}-${i}`}
                type="button"
                onClick={() => focusPoint(i)}
                disabled={state !== "ready"}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  on ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: on ? "#fff" : k.color }} />
                {p.name}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-gray-500">눌러서 지도에서 찾기</p>
      </div>
    </div>
  );
}
