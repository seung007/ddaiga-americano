"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ShoeSideProfile, { PROFILE_COLORS, type ProfileShoe } from "@/components/ShoeSideProfile";

/**
 * 러닝화 두께 비교 도구 (2026-10-12)
 *
 * 고른 신발은 주소(?s=id,id,id)에 남긴다 — 링크를 보내면 같은 비교가 열린다.
 * 기본값은 비교 페이지에서 가장 자주 쓰인 조합(호카 클리프턴 10 · 브룩스 고스트 17).
 * 원리·한계는 components/ShoeSideProfile.tsx 주석.
 */

const DEFAULT_IDS = ["hoka-clifton-10", "brooks-ghost-17"];
export default function ShoeSideTool({ catalog: SHOES }: { catalog: ProfileShoe[] }) {
  const BY_BRAND = useMemo(() => {
    const m = new Map<string, ProfileShoe[]>();
    for (const s of [...SHOES].sort((a, b) => (a.brand + a.model).localeCompare(b.brand + b.model))) {
      if (!m.has(s.brand)) m.set(s.brand, []);
      m.get(s.brand)!.push(s);
    }
    return [...m.entries()];
  }, [SHOES]);
  const VALID = useMemo(() => new Set(SHOES.map((s) => s.id)), [SHOES]);
  const [ids, setIds] = useState<string[]>(() => DEFAULT_IDS.filter((id) => SHOES.some((s) => s.id === id)));

  // 주소에서 복원 — 첫 렌더 뒤에 한 번만(서버 렌더와 어긋나지 않게)
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("s");
      const fromUrl = [...new Set((q ?? "").split(",").filter((id) => VALID.has(id)))].slice(0, 3);
      if (fromUrl.length) setIds(fromUrl);
    } catch {
      /* 주소를 못 읽으면 기본값 */
    }
  }, [VALID]);

  function update(next: string[]) {
    setIds(next);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("s", next.join(","));
      window.history.replaceState(null, "", url.toString());
    } catch {
      /* 주소 갱신 실패는 무시 */
    }
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof g === "function") g("event", "shoe_side_change", { shoes: next.join(",") });
  }

  const shoes = useMemo(() => ids.map((id) => SHOES.find((s) => s.id === id)).filter((s): s is ProfileShoe => !!s), [ids, SHOES]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/tools" className="hover:text-gray-900">러닝 계산기</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">러닝화 두께 비교</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold text-gray-900">러닝화 두께 비교</h1>
      <p className="mb-6 leading-relaxed text-gray-600">
        신발을 최대 3개 고르면 미드솔 두께·드롭·무게를 <strong className="text-gray-900">같은 축척으로 겹쳐</strong> 보여줍니다.
        착용감은 발과 신발이 만나야 알 수 있어서 그리지 않았습니다 — 여기 있는 것은 숫자로 공개된 스펙(출처 RunRepeat)뿐입니다.
      </p>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((slot) => {
          const c = PROFILE_COLORS[slot];
          const value = ids[slot] ?? "";
          return (
            <label key={slot} className="block">
              <span className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-700">
                <span className={`inline-block h-2 w-2 rounded-full ${c.dot}`} />
                신발 {slot + 1}
                {slot === 2 && <span className="font-normal text-gray-400">(선택)</span>}
              </span>
              <select
                value={value}
                disabled={slot > ids.length}
                onChange={(e) => {
                  const next = [...ids];
                  if (e.target.value) next[slot] = e.target.value;
                  else next.splice(slot, 1);
                  update(next.filter(Boolean).slice(0, 3));
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm focus:border-emerald-500 focus:outline-none disabled:bg-gray-50"
              >
                {slot >= 1 && <option value="">{slot === 1 ? "— 하나만 보기 —" : "— 없음 —"}</option>}
                {BY_BRAND.map(([brand, list]) => (
                  <optgroup key={brand} label={brand}>
                    {list.map((s) => (
                      // 다른 칸에서 이미 고른 신발은 막는다(같은 신발 두 번 → 그림·key 가 겹친다)
                      <option key={s.id} value={s.id} disabled={ids.includes(s.id) && ids[slot] !== s.id}>
                        {s.model}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
          );
        })}
      </div>

      {shoes.length > 0 && <ShoeSideProfile shoes={shoes} />}

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        {shoes.map((s) => (
          <Link key={s.id} href={`/shoes/${s.id}`} className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-700 hover:border-emerald-300">
            {s.model} 상세·출처 →
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-5">
        <h2 className="mb-2 text-lg font-bold text-gray-900">이 그림이 말하지 않는 것</h2>
        <ul className="space-y-2 text-sm leading-relaxed text-gray-700">
          <li>
            • <strong>착용감·쿠션의 무르기.</strong> 같은 두께라도 폼 재질에 따라 다르게 느껴집니다. 그 차이는 공개된 숫자가 없습니다.
          </li>
          <li>
            • <strong>두꺼울수록·드롭이 클수록 덜 다친다는 것.</strong> 저희는 그 관계를 확인하지 못했습니다. 발 타입에 맞춰 신발을 고르는 관행의 근거가
            어디까지인지는{" "}
            <Link href="/injury/flat-feet" className="text-emerald-700 underline">평발 러닝화 글</Link>에 정리했습니다.
          </li>
          <li>
            • <strong>길이와 모양.</strong> 가로 길이와 곡선은 임의로 그렸습니다. 세로 두께만 실제 비율입니다.
          </li>
        </ul>
      </section>

      <div className="mt-8 rounded-2xl bg-emerald-50 p-6">
        <p className="mb-2 font-medium text-emerald-900">어떤 신발을 비교할지 모르겠다면</p>
        <Link href="/shoe-finder" className="inline-block rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700">
          나에게 맞는 신발 찾기 →
        </Link>
      </div>
    </main>
  );
}
