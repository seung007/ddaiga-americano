"use client";

import { useState } from "react";
import Link from "next/link";
import FinderCta from "@/components/FinderCta";

/**
 * 러닝화 수명 계산기 — 2026-09-02
 *
 * 왜 이 도구가 존재하나
 * ─────────────────────
 * Cornwall & McPoil 2017이 이걸 재봤다. 레크리에이션 러너 15명에게 새 신발을 주고
 * 0 · 160 · 320 · 480 · 640km 시점마다 족저압·수직력·미드솔 경도를 측정했다.
 *
 *   480km에서 뒤꿈치 쿠셔닝이 **16~33% 줄었다.**
 *   그런데 **640km까지 달린 뒤에도 러너 본인은 그 변화를 자각하지 못했다.**
 *   (FCAT 자가보고에서 유의한 차이가 없었다)
 *
 * 이게 계산기가 필요한 이유 전부다. **감으로는 안 잡힌다.** 세는 수밖에 없다.
 *
 * 이 도구가 하지 않는 것
 * ─────────────────────
 * **"당신 신발은 몇 km에서 죽습니다"라고 말하지 않는다.**
 * 흔한 러닝화 수명 계산기들은 체중·노면·주법으로 곱해서 "당신은 412km"처럼
 * 소수점 단위 숫자를 뱉는데, 그 계수는 근거가 없다. 이 연구는 n=15에
 * 뒤꿈치 착지자만, 힐 영역만, 신발 한 종류만 봤다. 거기서 체중 계수를 뽑을 수 없다.
 *
 * 그래서 여기서는 **연구가 실제로 측정한 지점(160/320/480/640km)에 내 누적 거리를
 * 얹어서 보여주기만 한다.** 없는 정밀도를 지어내지 않는 게 이 사이트의 유일한 자산이다.
 */

/** 연구가 실제로 측정한 지점. 임의로 만든 눈금이 아니다. */
const MARKS = [160, 320, 480, 640] as const;
const KEY_KM = 480;

export default function ShoeLifePage() {
  const [weeklyKm, setWeeklyKm] = useState("");
  const [startedKm, setStartedKm] = useState("");
  const [weeks, setWeeks] = useState("");
  const [done, setDone] = useState(false);

  const w = Number(weeklyKm) || 0;
  const base = Number(startedKm) || 0;
  const n = Number(weeks) || 0;
  const total = Math.round(base + w * n);

  const pct = Math.min(100, (total / 640) * 100);
  const toKey = KEY_KM - total;
  const weeksToKey = w > 0 && toKey > 0 ? Math.ceil(toKey / w) : 0;

  function calc() {
    if (w <= 0) return;
    setDone(true);
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof g === "function") {
      g("event", "shoe_life_calc", { weekly_km: w, total_km: total });
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-900">홈</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">러닝화 수명 계산기</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">러닝화 수명 계산기</h1>
      <p className="text-gray-600 mb-8 leading-relaxed">
        480km에서 뒤꿈치 쿠셔닝이 <strong className="text-gray-900">16~33% 줄어듭니다.</strong>{" "}
        그런데 연구에 참여한 러너들은 <strong className="text-gray-900">640km까지 달린 뒤에도
        그 변화를 느끼지 못했습니다.</strong> 감으로는 안 잡히니까 세는 수밖에 없습니다.
      </p>

      {/* ── 입력 ───────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 p-6 mb-8">
        <div className="grid gap-5 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-900">주당 러닝 거리</span>
            <div className="flex items-center gap-2">
              <input
                type="number" min="0" inputMode="decimal" value={weeklyKm}
                onChange={(e) => { setWeeklyKm(e.target.value); setDone(false); }}
                placeholder="20"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
              <span className="text-sm text-gray-500">km</span>
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-900">사용한 기간</span>
            <div className="flex items-center gap-2">
              <input
                type="number" min="0" inputMode="numeric" value={weeks}
                onChange={(e) => { setWeeks(e.target.value); setDone(false); }}
                placeholder="30"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
              <span className="text-sm text-gray-500">주</span>
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-900">
              이미 뛴 거리 <span className="font-normal text-gray-400">(선택)</span>
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number" min="0" inputMode="decimal" value={startedKm}
                onChange={(e) => { setStartedKm(e.target.value); setDone(false); }}
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
              <span className="text-sm text-gray-500">km</span>
            </div>
          </label>
        </div>

        <button
          onClick={calc}
          disabled={w <= 0}
          className="mt-5 w-full rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:bg-gray-300"
        >
          계산하기
        </button>
      </div>

      {/* ── 결과 ───────────────────────────────────────────── */}
      {done && (
        <div className="mb-8 rounded-2xl bg-gray-50 p-6">
          <p className="text-sm text-gray-600">지금까지 누적</p>
          <p className="mb-6 text-4xl font-bold text-gray-900">
            {total.toLocaleString()} <span className="text-2xl font-normal text-gray-500">km</span>
          </p>

          {/* 눈금은 연구 측정 지점 그대로다 */}
          <div className="relative mb-2 h-3 w-full rounded-full bg-gray-200">
            <div
              className={`h-3 rounded-full transition-all ${total >= KEY_KM ? "bg-amber-500" : "bg-emerald-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mb-6 flex justify-between text-xs text-gray-400">
            {MARKS.map((m) => (
              <span key={m} className={total >= m ? "font-semibold text-gray-700" : ""}>
                {m}km
              </span>
            ))}
          </div>

          {total >= KEY_KM ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="mb-1 font-semibold text-amber-900">480km를 넘었습니다</p>
              <p className="text-sm leading-relaxed text-amber-900">
                이 연구에서 480km 시점의 뒤꿈치 쿠셔닝은 <strong>16~33% 줄어 있었습니다.</strong>{" "}
                지금 발로는 멀쩡하게 느껴질 수 있는데, <strong>그게 정상입니다</strong> —
                참가자 15명 중 640km까지 그 변화를 알아챈 사람이 없었습니다.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="mb-1 font-semibold text-emerald-900">
                480km까지 {toKey.toLocaleString()}km 남았습니다
              </p>
              <p className="text-sm leading-relaxed text-emerald-900">
                지금 페이스면 <strong>약 {weeksToKey}주 뒤</strong>입니다.
                그 시점에 쿠셔닝이 16~33% 줄어 있을 것으로 이 연구는 보고했습니다.
              </p>
            </div>
          )}

          <p className="mt-4 text-xs leading-relaxed text-gray-500">
            숫자를 곧이곧대로 받지 마세요. 아래 &ldquo;이 계산이 못 하는 것&rdquo;을 꼭 읽어주세요.
          </p>
        </div>
      )}

      {done && (
        <FinderCta
          from="tools-shoe-life"
          variant="inline"
          headline="바꿀 때가 됐다면, 지금 신발과 같은 계열부터 보는 게 안전합니다"
        />
      )}

      {/* ── 근거 ───────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-bold text-gray-900">이 숫자는 어디서 왔나</h2>
        <div className="rounded-2xl border border-gray-200 p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">논문 근거</span>
            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">근거수준 3</span>
          </div>
          <p className="mb-3 text-sm leading-relaxed text-gray-700">
            레크리에이션 러너 <strong>15명</strong>에게 새 러닝화를 주고, 0 · 160 · 320 · 480 · 640km
            시점마다 족저압·수직력·미드솔 경도를 측정했습니다. 결과는 둘로 갈립니다.
          </p>
          <ul className="mb-4 space-y-2 text-sm leading-relaxed text-gray-700">
            <li>
              <strong className="text-gray-900">기계는 변화를 잡았습니다.</strong> 480km에서 뒤꿈치
              쿠셔닝 16~33% 감소.
            </li>
            <li>
              <strong className="text-gray-900">사람은 못 잡았습니다.</strong> 640km까지 달린 뒤에도
              자가보고(FCAT)에서 유의한 차이가 없었습니다.
            </li>
            <li>
              경도계(durometer)로 재면 이 변화를 객관적으로 확인할 수 있다고 보고했습니다 —
              러닝화 매장에 있는 경우가 있습니다.
            </li>
          </ul>
          {/* 서식은 다른 페이지의 관행을 따른다 — `저자 & 저자 (연도) 저널 권(호):쪽 — 설명 ↗`.
              처음에 저자와 연도 사이에 <em>제목</em>을 끼워 썼더니 check:citations가
              "Int"(저널명 첫 토큰)를 제1저자로 읽었다. 검사기는 요소 경계(<)를 넘지 않으므로
              저자와 연도가 태그로 갈리면 연결이 끊긴다. 인용은 링크 안에 한 줄로 둔다. */}
          <p className="text-xs leading-relaxed text-gray-500">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/28900568/"
              target="_blank" rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              Cornwall &amp; McPoil (2017) Int J Sports Phys Ther 12(4):616-624 — 마일리지 증가에
              따른 뒤꿈치 쿠셔닝 변화를 러너가 자각할 수 있는가 ↗
            </a>
          </p>
        </div>
      </section>

      {/* ── 한계 ───────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-bold text-gray-900">이 계산이 못 하는 것</h2>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <p className="mb-3 text-sm leading-relaxed text-gray-700">
            <strong className="text-gray-900">체중·노면·주법을 반영하지 않습니다.</strong> 넣고
            싶었지만 넣을 근거가 없었습니다. 이 연구는 참가자 15명, 뒤꿈치 착지자만, 뒤꿈치 영역만,
            신발 한 종류를 봤습니다. 거기서 &ldquo;체중 80kg이면 ×0.8&rdquo; 같은 계수를 뽑을 수 없습니다.
          </p>
          <p className="mb-3 text-sm leading-relaxed text-gray-700">
            다른 계산기들이 &ldquo;당신의 신발 수명은 412km&rdquo;처럼 정밀한 숫자를 주는 걸 보셨을 겁니다.
            그 정밀도는 대부분 <strong className="text-gray-900">지어낸 것</strong>입니다.
            없는 정확도를 만들어내느니 모르는 걸 모른다고 적는 쪽을 골랐습니다.
          </p>
          <p className="text-sm leading-relaxed text-gray-700">
            그리고 <strong className="text-gray-900">쿠셔닝이 줄었다고 부상이 늘어난다는 뜻은
            아닙니다.</strong> 이 연구는 쿠셔닝 변화를 측정했을 뿐, 부상률을 보지 않았습니다.
            둘을 잇는 근거는 따로 필요하고, 지금 제시하지 않겠습니다.
          </p>
        </div>
      </section>

      <FinderCta
        from="tools-shoe-life"
        variant="block"
        headline="지금 신는 신발이 몸에 맞긴 했는지부터 확인해보세요"
        sub="키·체중·발볼·발 타입으로 1분 만에 후보를 좁혀드립니다."
      />
    </main>
  );
}
