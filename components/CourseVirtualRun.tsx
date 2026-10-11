"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { HangangCourse } from "@/lib/courses";

/**
 * 코스 가상 달리기 (2026-10-12)
 *
 * 무엇을 하나
 * ──────────
 * 실제 강변 산책로 선형(`lib/courses.routes.json`, OSM)에서 두 다리 사이를 왕복한다고 치고,
 * 목표 거리와 페이스를 넣으면 **몇 왕복인지, 언제 어디쯤 있는지**를 점으로 보여준다.
 * 같이 달리는 두 번째 러너(목표 페이스)를 켜면 끝났을 때 몇 m 차이인지 나온다.
 *
 * 지어내지 않은 것
 * ──────────────
 *   · 거리: 경로선 길이(`route.km`)만 쓴다. 공원 길이(lengthKm)와 다르다 — lib/courses.ts 주석
 *   · **오르막 보정 없음.** 한강 둔치는 평탄하다는 것까지가 확인된 사실이고, 고도 자료는 없다
 *   · 페이스는 **일정하다고 가정**한다. 실제로는 반환점·신호·사람 때문에 느려진다 — 화면에 적는다
 *   · 경로선 양 끝은 다리 좌표에서 수백 m 떨어져 있을 수 있다(snapFromM/snapToM). 「○○대교 쪽」으로만 부른다
 *
 * 그림은 위경도를 평면에 단순 투영(경도 × cos 위도)한 것이다. 지도 타일을 쓰지 않으니 OSM 타일 정책과 무관하고,
 * 경로 데이터의 출처(OSM 기여자)만 표기한다.
 */

type Pt = [number, number];
const VW = 420; // 휴대폰에서 글자가 읽히게 좁은 viewBox
const VH = 200;
const PAD = 24;

function haversineM(a: Pt, b: Pt) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function parsePace(v: string): number | null {
  // "5:30" 또는 "5'30" 또는 "5.5"(분) → 초/km
  const m = v.trim().match(/^(\d{1,2})\s*[:'′]\s*(\d{1,2})$/);
  if (m) {
    const sec = Number(m[1]) * 60 + Number(m[2]);
    return Number(m[2]) < 60 && sec >= 150 && sec <= 1200 ? sec : null;
  }
  const n = Number(v);
  if (Number.isFinite(n) && n >= 2.5 && n <= 20) return Math.round(n * 60);
  return null;
}

function fmt(sec: number) {
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}` : `${m}:${String(r).padStart(2, "0")}`;
}

const DISTANCES = [3, 5, 10];
const SPEEDS = [
  { label: "1분 = 1초", x: 60 },
  { label: "1분 = 0.25초", x: 240 },
];

export default function CourseVirtualRun({ course }: { course: HangangCourse }) {
  const route = course.map.route;
  const turns = course.map.points.filter((p) => p.kind === "turn");

  const geo = useMemo(() => {
    if (!route) return null;
    const pts = route.coords as Pt[];
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + haversineM(pts[i - 1], pts[i]));
    const total = cum[cum.length - 1];
    const lat0 = pts.reduce((s, p) => s + p[0], 0) / pts.length;
    const k = Math.cos((lat0 * Math.PI) / 180);
    const xs = pts.map((p) => p[1] * k);
    const ys = pts.map((p) => p[0]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const scale = Math.min((VW - PAD * 2) / (maxX - minX || 1), (VH - PAD * 2) / (maxY - minY || 1));
    const offX = (VW - (maxX - minX) * scale) / 2;
    const offY = (VH - (maxY - minY) * scale) / 2;
    const proj = pts.map((p, i): Pt => [offX + (xs[i] - minX) * scale, VH - (offY + (ys[i] - minY) * scale)]);
    return { proj, cum, total };
  }, [route]);

  const [distKm, setDistKm] = useState(5);
  const [paceIn, setPaceIn] = useState("6:30");
  const [ghostOn, setGhostOn] = useState(false);
  const [ghostIn, setGhostIn] = useState("6:00");
  const [speed, setSpeed] = useState(SPEEDS[0].x);
  const [t, setT] = useState(0); // 가상 경과 초
  const [running, setRunning] = useState(false);
  const raf = useRef<number | null>(null);
  const last = useRef<number | null>(null);

  const pace = parsePace(paceIn);
  const ghost = ghostOn ? parsePace(ghostIn) : null;
  const legM = route ? route.km * 1000 : 0; // 편도 거리(경로선 기준)
  const goalM = distKm * 1000;
  const finishSec = pace ? (goalM / 1000) * pace : 0;
  const ghostFinish = ghost ? (goalM / 1000) * ghost : 0;
  const endSec = Math.max(finishSec, ghostFinish);

  useEffect(() => {
    if (!running) return;
    const step = (now: number) => {
      if (last.current != null) {
        // 탭이 백그라운드였다가 돌아오면 rAF 가 멈춘 시간이 한 번에 들어온다 → 한 프레임 최대 0.25초로 자른다
        const dt = (Math.min(now - last.current, 250) / 1000) * speed;
        setT((prev) => {
          const n = prev + dt;
          if (n >= endSec) {
            setRunning(false);
            return endSec;
          }
          return n;
        });
      }
      last.current = now;
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    // 탭을 숨기면 멈춘다(돌아와서 다시 누르면 이어 달린다)
    const onHide = () => {
      if (document.visibilityState === "hidden") setRunning(false);
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
      last.current = null;
    };
  }, [running, speed, endSec]);

  if (!route || !geo || turns.length < 2) return null;

  /** 누적 거리 d(m) → 왕복 경로 위 좌표 */
  function posAt(dM: number): Pt {
    const L = geo!.total;
    const legScale = L / legM; // 화면 경로 길이와 route.km 의 미세한 차이를 흡수
    const m = (dM * legScale) % (2 * L);
    const along = m <= L ? m : 2 * L - m;
    const { cum, proj } = geo!;
    let i = 1;
    while (i < cum.length - 1 && cum[i] < along) i++;
    const seg = cum[i] - cum[i - 1] || 1;
    const f = Math.min(1, Math.max(0, (along - cum[i - 1]) / seg));
    return [proj[i - 1][0] + (proj[i][0] - proj[i - 1][0]) * f, proj[i - 1][1] + (proj[i][1] - proj[i - 1][1]) * f];
  }

  const myM = pace ? Math.min(goalM, (t / pace) * 1000) : 0;
  const ghostM = ghost ? Math.min(goalM, (t / ghost) * 1000) : 0;
  const me = posAt(myM);
  const gh = posAt(ghostM);
  const startName = turns[0].name;
  const endName = turns[1].name;
  // 목표 거리를 「n왕복 + 나머지」로 말한다. 0.8왕복 같은 소수는 달리는 사람에게 쓸모가 없다
  const fullTrips = Math.floor(goalM / (2 * legM) + 1e-9);
  const remM = goalM - fullTrips * 2 * legM;
  const km1 = (m: number) => (Math.round(m / 100) / 10).toString();
  const howFar = [
    fullTrips > 0 ? `${fullTrips}왕복` : "",
    remM < 50
      ? ""
      : remM <= legM
        ? `편도 ${km1(remM)}km`
        : `${endName} 쪽 끝까지 갔다가 ${km1(remM - legM)}km 되돌아오기`,
  ]
    .filter(Boolean)
    .join(" + ");
  const pathD = geo.proj.map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const done = t >= endSec && endSec > 0;
  // 먼저 들어온 쪽이 끝난 순간, 늦은 쪽이 남겨 둔 거리
  const gapM =
    ghost && pace
      ? Math.round(finishSec <= ghostFinish ? goalM - (finishSec / ghost) * 1000 : goalM - (ghostFinish / pace) * 1000)
      : 0;
  const anchor = (x: number) => (x < VW / 3 ? "start" : x > (VW * 2) / 3 ? "end" : "middle");
  const labelY = (y: number) => (y < 34 ? y + 26 : y - 12);
  const P0 = geo.proj[0];
  const P1 = geo.proj[geo.proj.length - 1];

  function start() {
    if (!pace) return;
    if (done || t === 0) setT(0);
    setRunning(true);
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof g === "function") g("event", "course_sim_start", { course: course.slug, km: distKm, pace_sec: pace, ghost: ghost ?? 0 });
  }

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 p-4">
      <p className="mb-1 text-sm font-semibold text-gray-900">이 코스에서 가상으로 달려보기</p>
      <p className="mb-4 text-xs leading-relaxed text-gray-500">
        {startName} 쪽 ↔ {endName} 쪽 강변 산책로 편도 {route.km}km를 왕복한다고 치고 계산합니다.
      </p>

      <div className="mb-3 grid gap-3 sm:grid-cols-3">
        <div>
          <span className="mb-1 block text-xs font-medium text-gray-700">목표 거리</span>
          <div className="flex gap-1">
            {DISTANCES.map((d) => (
              <button
                key={d}
                onClick={() => { setDistKm(d); setT(0); setRunning(false); }}
                aria-pressed={distKm === d}
                className={`flex-1 rounded-lg border px-2 py-1.5 text-sm ${distKm === d ? "border-emerald-600 bg-emerald-50 font-semibold text-emerald-800" : "border-gray-300 text-gray-700"}`}
              >
                {d}km
              </button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-700">내 페이스 (분:초/km)</span>
          <input
            value={paceIn}
            onChange={(e) => { setPaceIn(e.target.value); setT(0); setRunning(false); }}
            className={`w-full rounded-lg border px-3 py-1.5 text-sm focus:outline-none ${pace ? "border-gray-300 focus:border-emerald-500" : "border-red-400"}`}
            placeholder="6:30"
          />
        </label>
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-700">
            <input type="checkbox" checked={ghostOn} onChange={(e) => { setGhostOn(e.target.checked); setT(0); setRunning(false); }} />
            같이 달릴 러너 (분:초/km)
          </label>
          <input
            value={ghostIn}
            disabled={!ghostOn}
            onChange={(e) => { setGhostIn(e.target.value); setT(0); setRunning(false); }}
            aria-label="같이 달릴 러너 페이스 (분:초/km)"
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
            placeholder="6:00"
          />
        </div>
      </div>

      {pace && (
        <p className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm leading-relaxed text-emerald-900">
          {distKm}km는 {startName} 쪽에서 출발해 <strong>{howFar}</strong>입니다. 이 페이스로 약 <strong>{fmt(finishSec)}</strong>.
        </p>
      )}

      <svg viewBox={`0 0 ${VW} ${VH}`} className="h-auto w-full rounded-xl bg-sky-50" role="img" aria-label={`${course.name} 가상 달리기 경로`}>
        <path d={pathD} fill="none" stroke="#94a3b8" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={geo.proj[0][0]} cy={geo.proj[0][1]} r={5} fill="#334155" />
        <circle cx={geo.proj[geo.proj.length - 1][0]} cy={geo.proj[geo.proj.length - 1][1]} r={5} fill="#334155" />
        <text x={P0[0]} y={labelY(P0[1])} textAnchor={anchor(P0[0])} fontSize="16" fill="#334155">{startName} 쪽 (출발)</text>
        <text x={P1[0]} y={labelY(P1[1])} textAnchor={anchor(P1[0])} fontSize="16" fill="#334155">{endName} 쪽</text>
        {ghost && (
          <circle cx={gh[0]} cy={gh[1]} r={9} fill="#4f46e5" stroke="#fff" strokeWidth={2} opacity={0.85} role="img" aria-label={`같이 달린 러너 ${(ghostM / 1000).toFixed(2)}km`} />
        )}
        {pace && (
          <circle cx={me[0]} cy={me[1]} r={9} fill="#059669" stroke="#fff" strokeWidth={2} role="img" aria-label={`나 ${(myM / 1000).toFixed(2)}km`} />
        )}
      </svg>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={() => (running ? setRunning(false) : start())}
          disabled={!pace || (ghostOn && !ghost)}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:bg-gray-300"
        >
          {running ? "멈춤" : done ? "다시 달리기" : t > 0 ? "이어 달리기" : "출발"}
        </button>
        <button onClick={() => { setRunning(false); setT(0); }} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700">
          처음으로
        </button>
        <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="rounded-lg border border-gray-300 px-2 py-2 text-xs text-gray-700">
          {SPEEDS.map((s) => (
            <option key={s.x} value={s.x}>재생 속도 {s.label}</option>
          ))}
        </select>
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-gray-50 p-2">
          <dt className="text-[11px] text-gray-500">경과</dt>
          <dd className="font-mono text-sm font-semibold text-gray-900">{fmt(t)}</dd>
        </div>
        <div className="rounded-lg bg-gray-50 p-2">
          <dt className="flex items-center justify-center gap-1 text-[11px] text-gray-500"><span className="inline-block h-2 w-2 rounded-full bg-emerald-600" />내 거리</dt>
          <dd className="font-mono text-sm font-semibold text-gray-900">{(myM / 1000).toFixed(2)}km</dd>
        </div>
        <div className="rounded-lg bg-gray-50 p-2">
          <dt className="flex items-center justify-center gap-1 text-[11px] text-gray-500">{ghost && <span className="inline-block h-2 w-2 rounded-full bg-indigo-600" />}{ghost ? "같이 달린 러너" : "완주 예상"}</dt>
          <dd className="font-mono text-sm font-semibold text-gray-900">{ghost ? `${(ghostM / 1000).toFixed(2)}km` : pace ? fmt(finishSec) : "—"}</dd>
        </div>
      </dl>

      {ghost && done && gapM > 0 && (
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          {finishSec <= ghostFinish ? (
            <>내가 먼저 들어오고, 그때 같이 달린 러너는 약 <strong>{gapM.toLocaleString()}m</strong> 남아 있습니다.</>
          ) : (
            <>같이 달린 러너가 먼저 들어오고, 그때 나는 약 <strong>{gapM.toLocaleString()}m</strong> 남아 있습니다.</>
          )}
        </p>
      )}

      <p className="mt-3 text-sm">
        <Link href="/tools/pace" className="text-emerald-700 underline">목표 기록으로 km별 통과 시간 만들기</Link>
        <span className="mx-1.5 text-gray-300">·</span>
        <Link href="/injury/first-10k" className="text-emerald-700 underline">첫 10km 준비</Link>
      </p>

      <p className="mt-3 text-[11px] leading-relaxed text-gray-400">
        페이스는 끝까지 일정하다고 가정했습니다. 반환점·사람·신호 때문에 실제로는 조금 더 걸립니다. 고도 자료가 없어 오르막 보정은 하지 않았습니다.
        경로선:{" "}
        <a href={route.source.url} target="_blank" rel="noopener noreferrer" className="underline">
          {route.source.label}
        </a>{" "}
        ({route.source.checkedAt} 기준).
      </p>
    </div>
  );
}
