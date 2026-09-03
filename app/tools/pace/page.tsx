"use client";

import { useState } from "react";
import Link from "next/link";
import FinderCta from "@/components/FinderCta";

/**
 * 러닝 페이스 계산기 — 2026-09-02
 *
 * 이 도구는 **순수 산수**다. 거리 ÷ 시간. 논문 근거가 필요한 주장이 하나도 없고,
 * 그래서 근거 배지도 달지 않는다. shoe-life와 성격이 다른 걸 분명히 해둔다 —
 * 저기는 논문 수치를 옮긴 것이고 여기는 나눗셈이다.
 *
 * 왜 만드나
 * ─────────
 * "러닝 페이스 계산기"는 검색량이 가장 큰 러닝 도구 질의다. 데이터 부채가 0이고
 * (유지보수할 신발 목록도, 갱신할 논문도 없다) 새 검색 입구가 하나 생긴다.
 * RunDida가 도구를 9개 늘려 트래픽을 모으는 방식이 이것이다.
 *
 * 구간 통과 시간표를 넣은 이유
 * ───────────────────────────
 * 페이스 숫자만 주는 계산기는 많다. 그런데 대회 당일 실제로 쓰는 건
 * **"5km 지점에서 시계가 몇 분이어야 하는가"**다. 하프 페이지에서 페이스 조절을
 * 다뤘으니 그 실행 도구를 여기 붙인다.
 *
 * 지키는 선
 * ─────────
 * **"이 페이스면 완주할 수 있습니다" 같은 말은 하지 않는다.** 그건 산수로 나오는
 * 결론이 아니다. 나눗셈 결과만 보여주고 판단은 사용자에게 남긴다.
 */

const PRESETS = [
  { label: "5K", km: 5 },
  { label: "10K", km: 10 },
  { label: "하프", km: 21.0975 },
  { label: "풀", km: 42.195 },
] as const;

/** 초 → "h:mm:ss" 또는 "m:ss" */
function fmt(sec: number, forceHours = false): string {
  if (!Number.isFinite(sec) || sec < 0) return "—";
  const s = Math.round(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (h > 0 || forceHours) return `${h}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  return `${m}:${String(ss).padStart(2, "0")}`;
}

export default function PacePage() {
  const [km, setKm] = useState<number>(21.0975);
  const [custom, setCustom] = useState("");
  const [mode, setMode] = useState<"time" | "pace">("time");

  // 목표 시간 (시:분:초)
  const [h, setH] = useState("");
  const [m, setM] = useState("");
  // 페이스 (분:초 per km)
  const [pm, setPm] = useState("");
  const [ps, setPs] = useState("");

  const dist = custom ? Number(custom) || 0 : km;

  const totalSec = mode === "time" ? (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 : 0;
  const paceSec = mode === "pace" ? (Number(pm) || 0) * 60 + (Number(ps) || 0) : 0;

  const resultPace = mode === "time" && dist > 0 && totalSec > 0 ? totalSec / dist : 0;
  const resultTotal = mode === "pace" && dist > 0 && paceSec > 0 ? paceSec * dist : 0;

  const usePace = mode === "time" ? resultPace : paceSec;
  const useTotal = mode === "time" ? totalSec : resultTotal;
  const ready = dist > 0 && usePace > 0;

  // 5km 단위 구간 + 마지막 결승선
  const splits: { at: number; sec: number }[] = [];
  if (ready) {
    for (let d = 5; d < dist; d += 5) splits.push({ at: d, sec: usePace * d });
    splits.push({ at: dist, sec: usePace * dist });
  }

  function fire() {
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof g === "function") g("event", "pace_calc", { distance_km: dist, mode });
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-900">홈</Link>
        <span className="mx-2">/</span>
        <Link href="/tools" className="hover:text-gray-900">계산기</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">페이스</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">러닝 페이스 계산기</h1>
      <p className="text-gray-600 mb-8 leading-relaxed">
        목표 시간을 넣으면 km당 페이스를, 페이스를 넣으면 완주 시간을 계산합니다.
        <strong className="text-gray-900"> 5km 단위 구간 통과 시간표</strong>까지 나오니
        대회 당일 손목에 적어가세요.
      </p>

      {/* ── 거리 ───────────────────────────────────────────── */}
      <div className="mb-5 rounded-2xl border border-gray-200 p-6">
        <span className="mb-3 block text-sm font-medium text-gray-900">거리</span>
        <div className="mb-4 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => { setKm(p.km); setCustom(""); }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                !custom && km === p.km
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {p.label}
            </button>
          ))}
          <div className="flex items-center gap-2">
            <input
              type="number" min="0" step="0.1" inputMode="decimal" value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="직접"
              className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <span className="text-sm text-gray-500">km</span>
          </div>
        </div>

        {/* ── 모드 ─────────────────────────────────────────── */}
        <div className="mb-4 flex gap-2 border-t border-gray-100 pt-4">
          <button
            onClick={() => setMode("time")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === "time" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            목표 시간 → 페이스
          </button>
          <button
            onClick={() => setMode("pace")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === "pace" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            페이스 → 완주 시간
          </button>
        </div>

        {mode === "time" ? (
          <div className="flex items-end gap-2">
            <label className="flex-1">
              <span className="mb-1.5 block text-sm text-gray-600">시간</span>
              <input
                type="number" min="0" inputMode="numeric" value={h}
                onChange={(e) => { setH(e.target.value); fire(); }}
                placeholder="1"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </label>
            <span className="pb-2 text-gray-400">:</span>
            <label className="flex-1">
              <span className="mb-1.5 block text-sm text-gray-600">분</span>
              <input
                type="number" min="0" max="59" inputMode="numeric" value={m}
                onChange={(e) => { setM(e.target.value); fire(); }}
                placeholder="50"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </label>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <label className="flex-1">
              <span className="mb-1.5 block text-sm text-gray-600">분 / km</span>
              <input
                type="number" min="0" inputMode="numeric" value={pm}
                onChange={(e) => { setPm(e.target.value); fire(); }}
                placeholder="5"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </label>
            <span className="pb-2 text-gray-400">:</span>
            <label className="flex-1">
              <span className="mb-1.5 block text-sm text-gray-600">초</span>
              <input
                type="number" min="0" max="59" inputMode="numeric" value={ps}
                onChange={(e) => { setPs(e.target.value); fire(); }}
                placeholder="30"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </label>
          </div>
        )}
      </div>

      {/* ── 결과 ───────────────────────────────────────────── */}
      {ready && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-emerald-50 p-6">
              <p className="text-sm text-emerald-800">km당 페이스</p>
              <p className="text-3xl font-bold text-emerald-900">
                {fmt(usePace)} <span className="text-lg font-normal">/km</span>
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-6">
              <p className="text-sm text-gray-600">완주 시간</p>
              <p className="text-3xl font-bold text-gray-900">{fmt(useTotal, true)}</p>
            </div>
          </div>

          <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">지점</th>
                  <th className="px-5 py-3 font-medium">통과 시간</th>
                </tr>
              </thead>
              <tbody>
                {splits.map((s, i) => (
                  <tr key={s.at} className={i === splits.length - 1 ? "bg-emerald-50 font-semibold" : "border-t border-gray-100"}>
                    <td className="px-5 py-2.5 text-gray-900">
                      {s.at % 1 === 0 ? s.at : s.at.toFixed(2)} km
                      {i === splits.length - 1 && <span className="ml-2 text-xs text-emerald-700">결승</span>}
                    </td>
                    <td className="px-5 py-2.5 tabular-nums text-gray-700">{fmt(s.sec, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mb-8 text-xs leading-relaxed text-gray-500">
            이 표는 <strong>일정한 페이스로 달렸을 때의 나눗셈 결과</strong>입니다. 실제 대회에서는
            오르내림·급수대·인파로 구간마다 흔들립니다. 페이스 조절과 급수 전략은{" "}
            <Link href="/injury/half-marathon-race-day" className="text-emerald-600 underline hover:text-emerald-700">
              하프 대회 당일 가이드
            </Link>
            에 정리해뒀습니다.
          </p>
        </>
      )}

      <FinderCta
        from="tools-pace"
        variant="block"
        headline="목표 페이스가 정해졌다면, 그 페이스에 맞는 신발인지도 확인해보세요"
        sub="키·체중·발볼·발 타입으로 1분 만에 후보를 좁혀드립니다."
      />
    </main>
  );
}
