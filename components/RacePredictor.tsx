"use client";

import { useState } from "react";
import { gtagEvent } from "@/lib/gtag";

/**
 * 기록으로 다른 거리 예측 (2026-09-26)
 *
 * 왜: 러닝 오픈채팅 전수 분석에서 "하프 1시간 38분이면 풀은 몇?", "10km 48분이면 어느 수준?" 같은
 * 질문이 반복됐고, 유튜버가 만든 외부 계산기(VDOT·마라톤 티어) 링크가 채팅에서 공유되고 있었음.
 *
 * ⚠️ 이건 위 페이스 계산기와 성격이 다르다 — **나눗셈이 아니라 모델 추정**이다.
 *   공식: 리겔(Riegel) 공식 T2 = T1 × (D2/D1)^1.06.
 *   Vickers & Vertosick (2016, PMID 27570626, 레크리에이션 러너 2,303명)이 이 공식이 널리 쓰이지만
 *   **풀코스 기록을 유의하게 실제보다 빠르게(낙관적으로) 예측**한다고 보고했다(Europe PMC 초록 확인, 2026-09-26).
 *   그래서 풀코스 칸에는 경고를 붙이고, 보정치를 우리가 지어내 넣지 않는다.
 *   (지수 1.06 은 Riegel 1981 원문에서 확인한 것이 아니라 널리 쓰이는 값을 옮긴 것 — 원문 대조는 하지 못했다)
 *
 * 지키는 선: "이 기록이면 완주 가능" 같은 말을 하지 않는다. 숫자와 한계만 보여준다.
 */

const BASES = [
  { label: "5K", km: 5 },
  { label: "10K", km: 10 },
  { label: "하프", km: 21.0975 },
] as const;
const TARGETS = [
  { label: "5K", km: 5 },
  { label: "10K", km: 10 },
  { label: "하프", km: 21.0975 },
  { label: "풀", km: 42.195 },
] as const;

function fmt(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return "—";
  const s = Math.round(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}` : `${m}:${String(ss).padStart(2, "0")}`;
}

export default function RacePredictor() {
  const [baseKm, setBaseKm] = useState<number>(10);
  const [h, setH] = useState("");
  const [m, setM] = useState("");
  const [s, setS] = useState("");
  const [sent, setSent] = useState(false);

  const t1 = (parseInt(h) || 0) * 3600 + (parseInt(m) || 0) * 60 + (parseInt(s) || 0);
  const ready = t1 > 0;
  // 입력이 비현실적으로 작으면(5K 10분 미만 등) 계산은 하되 결과를 숨긴다 — 오타일 가능성이 크다
  const plausible = t1 / baseKm >= 150; // km당 2분 30초보다 빠르면 오타로 본다

  function onChange(set: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      set(e.target.value.replace(/\D/g, "").slice(0, 2));
      if (!sent) {
        setSent(true);
        gtagEvent("race_predict", { from: "tools-pace", tag: String(baseKm) });
      }
    };
  }

  return (
    <section className="mb-10 rounded-2xl border border-gray-200 p-5" aria-labelledby="predict-h">
      <h2 id="predict-h" className="text-xl font-bold text-gray-900">
        내 기록으로 다른 거리 예측
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-gray-500">
        리겔 공식으로 계산한 <strong>추정값</strong>이에요. 나눗셈이 아니라 모델이라 훈련량·코스·날씨에 따라 크게 달라져요.
      </p>

      <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="기준 거리">
        {BASES.map((b) => (
          <button
            key={b.label}
            type="button"
            role="radio"
            aria-checked={baseKm === b.km}
            onClick={() => setBaseKm(b.km)}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              baseKm === b.km ? "border-emerald-600 bg-emerald-600 text-white" : "border-gray-300 text-gray-700"
            }`}
          >
            {b.label} 기록
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-sm">
        {(
          [
            ["시", h, setH, "p-h"],
            ["분", m, setM, "p-m"],
            ["초", s, setS, "p-s"],
          ] as const
        ).map(([unit, v, set, id]) => (
          <span key={id} className="flex items-center gap-1">
            <label htmlFor={id} className="sr-only">
              {unit}
            </label>
            <input
              id={id}
              inputMode="numeric"
              value={v}
              onChange={onChange(set)}
              placeholder="0"
              className="w-14 rounded-lg border border-gray-200 px-2 py-2 text-center focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            <span className="text-gray-500">{unit}</span>
          </span>
        ))}
      </div>

      {ready && !plausible && <p className="mt-3 text-sm text-amber-700">기록을 다시 확인해 주세요. km당 2분 30초보다 빠르게 계산돼요.</p>}

      {ready && plausible && (
        <>
          <dl className="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-100">
            {TARGETS.filter((t) => t.km !== baseKm).map((t) => {
              const t2 = t1 * Math.pow(t.km / baseKm, 1.06);
              return (
                <div key={t.label} className="flex items-baseline justify-between px-4 py-2.5">
                  <dt className="text-sm text-gray-600">{t.label}</dt>
                  <dd className="text-right">
                    <span className="font-semibold tabular-nums text-gray-900">{fmt(t2)}</span>
                    <span className="ml-2 text-xs text-gray-500">km당 {fmt(t2 / t.km)}</span>
                    {t.km === 42.195 && <span className="ml-1 text-xs font-semibold text-red-600">⚠</span>}
                  </dd>
                </div>
              );
            })}
          </dl>
          <p className="mt-3 rounded-xl bg-red-50 p-3 text-xs leading-relaxed text-red-900">
            ⚠ <strong>풀코스는 이 값보다 느리게 나올 가능성이 커요.</strong> 레크리에이션 러너 2,303명의 기록을 분석한 연구에서
            이 공식이 풀코스 기록을 실제보다 빠르게 예측했어요. 얼마나 느려지는지는 훈련량에 따라 달라서 여기서 숫자로 보정하지 않았어요.{" "}
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/27570626/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Vickers &amp; Vertosick (2016) BMC Sports Sci Med Rehabil 8:26 — 레크리에이션 러너 기록 예측 ↗
            </a>
          </p>
        </>
      )}
    </section>
  );
}
