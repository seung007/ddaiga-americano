"use client";

import Link from "next/link";
import { useState } from "react";
import { Barlow_Condensed } from "next/font/google";
import { gtagEvent } from "@/lib/gtag";
import { shoePlaceholder } from "@/lib/shoes/placeholder";

/**
 * 홈 첫 화면 — 추천 카드 (2026-11-05, 디자인 캔버스 「H01 수정안」)
 *
 * 왜 바꿨나
 *   GA4 최근 28일(2026-11-05 확인): `/shoe-finder` 를 연 사람의 주요 이벤트 비율이 가장 높았는데
 *   홈에서 그 입구는 「나에게 맞는 신발 찾기」 버튼 하나였고, 누르면 1번 문항부터 다시 시작했다.
 *   그래서 홈에서 **발볼·용도 두 개를 먼저 고르게** 하고, 고른 것을 들고 추천기로 넘긴다
 *   (`/shoe-finder?from=home&f=wide&u=long` → 추천기가 용도를 건너뛰고 성별부터 묻는다).
 *
 * 지키는 것
 *   · 칩은 **필터**다. 아래 목록은 「그 조건이 있는 신발」이지 「당신에게 맞는 신발」이 아니다
 *     (ShoeStrip 머리말과 같은 판단 — 키·체중·발 타입까지 보는 추천과 충돌하지 않게).
 *   · 가격은 공식몰 자동 확인값이 있을 때만 「공식몰 정가」, 없으면 상세 페이지처럼 「약 …원」.
 *   · 「보통」은 D 폭, 「넓은」은 2E·4E 가 있는 신발. 「모르겠어요」는 거르지 않고 재는 법으로 보낸다.
 */

const barlow = Barlow_Condensed({ subsets: ["latin"], weight: "700", style: "italic", display: "swap" });

export type FinderShoe = {
  id: string;
  brand: string;
  model: string;
  imageUrl: string;
  uses: string[];
  widthOptions: string[];
  /** 공식몰 자동 확인 정가 — 없으면 undefined */
  officialPrice?: number;
  /** data.ts 권장소비자가 추산 */
  priceKrw: number;
};

type WidthKey = "wide" | "normal" | "unsure";
type UseKey = "daily" | "long" | "racing";

const WIDTH_CHIPS: { k: WidthKey; l: string }[] = [
  { k: "wide", l: "넓은" },
  { k: "normal", l: "보통" },
  { k: "unsure", l: "모르겠어요" },
];
const USE_CHIPS: { k: UseKey; l: string }[] = [
  { k: "daily", l: "일상" },
  { k: "long", l: "장거리" },
  { k: "racing", l: "대회용" },
];
const USE_BADGE: Record<string, string> = { daily: "일상", long: "장거리", tempo: "템포", racing: "대회용" };
const WIDTH_WORD: Record<string, string> = { B: "좁게", D: "보통", "2E": "넓게", "4E": "아주 넓게" };
const WIDTH_ORDER = ["B", "D", "2E", "4E"];

const hasWide = (s: FinderShoe) => s.widthOptions.some((w) => w === "2E" || w === "4E");
const matchesWidth = (s: FinderShoe, w: WidthKey | null) =>
  !w || w === "unsure" ? true : w === "wide" ? hasWide(s) : s.widthOptions.includes("D");

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12l5 5 9-10" />
    </svg>
  );
}
function Arrow({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function HomeFinderCard({ shoes, hero }: { shoes: FinderShoe[]; hero?: { src: string; alt: string } }) {
  const [w, setW] = useState<WidthKey | null>(null);
  const [u, setU] = useState<UseKey | null>(null);

  const fw = w === "unsure" ? null : w;
  const all = shoes.filter((s) => matchesWidth(s, fw) && (!u || s.uses.includes(u)));
  const shown = all.slice(0, 4);

  const widthLabel = fw === "wide" ? "넓은 발볼" : fw === "normal" ? "보통 발볼" : "";
  const useLabel = u ? USE_CHIPS.find((c) => c.k === u)!.l : "";
  const cond = [widthLabel, useLabel].filter(Boolean).join(" · ");
  const countLine = cond
    ? all.length
      ? `${cond} 조건으로 고른 신발 ${all.length}종이에요`
      : `${cond} 조건의 신발은 아직 정리하지 못했어요`
    : "발볼과 용도를 고르면 바로 좁혀져요";

  const q = new URLSearchParams();
  if (fw || u) q.set("from", "home");
  if (fw) q.set("f", fw);
  if (u) q.set("u", u);
  const qs = q.toString();
  const finderHref = `/shoe-finder${qs ? `?${qs}` : ""}`;

  const pickW = (k: WidthKey) => {
    const next = w === k ? null : k;
    setW(next);
    if (next) gtagEvent("home_finder_chip", { group: "width", value: next });
  };
  const pickU = (k: UseKey) => {
    const next = u === k ? null : k;
    setU(next);
    if (next) gtagEvent("home_finder_chip", { group: "use", value: next });
  };

  const chipCls = (on: boolean) =>
    `press flex h-11 flex-1 items-center justify-center gap-1 rounded-full border border-[#2F3414] px-2 text-sm font-bold ${
      on ? "bg-[#111111] text-[#C8F031]" : "bg-white text-[#111111]"
    }`;

  const raceWide = fw === "wide" && u === "racing";

  return (
    <>
      <section aria-labelledby="finder-h" className="px-5 pt-2 sm:pt-8">
        <div className="relative mx-auto max-w-xl overflow-hidden rounded-3xl bg-[#C8F031] p-5 text-[#111111] sm:p-8">
          {hero && (
            // 첫 화면 연출이라 회전을 허용한다(목록 카드 사진은 돌리지 않는다).
            // 흰 바탕 제품 사진이라 multiply 로 바탕을 카드 색에 녹인다.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero.src}
              alt=""
              width={180}
              height={120}
              referrerPolicy="no-referrer"
              className="pointer-events-none absolute -right-8 top-4 w-36 -rotate-[14deg] mix-blend-multiply sm:right-4 sm:w-56"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          )}
          <p className={`${barlow.className} relative text-sm tracking-[1px]`}>SHOE FINDER</p>
          <h1 id="finder-h" className="relative mt-1 text-[40px] font-black leading-[1.1] tracking-[-1.2px]">
            내 러닝화<br />찾기
          </h1>

          <p className="mb-2 mt-4 text-xs font-bold text-[#2F3414]">발볼</p>
          <div className="flex gap-2">
            {WIDTH_CHIPS.map((c) => (
              <button key={c.k} type="button" aria-pressed={w === c.k} onClick={() => pickW(c.k)} className={chipCls(w === c.k)}>
                {w === c.k && <Check />}
                {c.l}
              </button>
            ))}
          </div>
          {w === "unsure" && (
            <Link
              href="/injury/wide-foot"
              className="press mt-2 flex min-h-11 items-center justify-between gap-2 rounded-xl bg-white px-3 text-sm font-bold"
            >
              <span>내 발볼 재는 법부터 볼까요?</span>
              <Arrow />
            </Link>
          )}

          <p className="mb-2 mt-3 text-xs font-bold text-[#2F3414]">용도</p>
          <div className="flex gap-2">
            {USE_CHIPS.map((c) => (
              <button key={c.k} type="button" aria-pressed={u === c.k} onClick={() => pickU(c.k)} className={chipCls(u === c.k)}>
                {u === c.k && <Check />}
                {c.l}
              </button>
            ))}
          </div>

          <p role="status" className="mt-4 text-sm font-bold">{countLine}</p>
          <Link
            href={finderHref}
            onClick={() => gtagEvent("home_finder_cta", { width: fw ?? "unset", use: u ?? "unset" })}
            className="press mt-3 flex h-12 items-center justify-center gap-2 rounded-full bg-[#111111] text-base font-bold text-white"
          >
            내 맞춤 러닝화 추천받기
            <Arrow />
          </Link>
        </div>
      </section>

      <section id="shoes" aria-labelledby="list-h" className="scroll-mt-16 pt-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between px-5">
            <h2 id="list-h" className="text-xl font-black text-[#111111]">
              {cond ? "지금 조건의 러닝화" : "러닝화 미리 보기"}
            </h2>
            <Link href="/shoes" className="flex min-h-11 items-center text-sm font-bold text-[#111111] underline">
              전체 보기
            </Link>
          </div>

          {cond && (
            <div className="flex flex-wrap items-center gap-2 px-5 pt-2">
              {widthLabel && (
                <button type="button" onClick={() => setW(null)} aria-label={`${widthLabel} 조건 빼기`}
                  className="press flex h-11 items-center gap-1 rounded-full border border-[#D5D8DD] bg-white px-3 text-sm font-bold text-[#111111]">
                  {widthLabel}<span aria-hidden="true">✕</span>
                </button>
              )}
              {useLabel && (
                <button type="button" onClick={() => setU(null)} aria-label={`${useLabel} 조건 빼기`}
                  className="press flex h-11 items-center gap-1 rounded-full border border-[#D5D8DD] bg-white px-3 text-sm font-bold text-[#111111]">
                  {useLabel}<span aria-hidden="true">✕</span>
                </button>
              )}
              <button type="button" onClick={() => { setW(null); setU(null); }}
                className="h-11 px-2 text-sm text-[#4B5059] underline">
                모두 지우기
              </button>
            </div>
          )}

          {all.length === 0 && (
            <div className="mx-5 mt-4 rounded-2xl bg-[#F5F5F5] p-6">
              <p className="text-base font-bold text-[#111111]">
                {raceWide ? "넓은 발볼용 대회화는 아직 정리하지 못했어요" : "이 조건의 신발은 아직 정리하지 못했어요"}
              </p>
              <p className="mb-4 mt-2 text-sm leading-normal text-[#4B5059]">
                {raceWide ? "정리한 대회용 신발은 보통 폭으로만 나와요. 보통 발볼로 바꿔 볼까요?" : "조건을 하나 풀면 가까운 신발을 볼 수 있어요"}
              </p>
              <button type="button"
                onClick={() => (raceWide ? setW("normal") : (setW(null), setU(null)))}
                className="press h-11 rounded-full border border-[#111111] bg-white px-4 text-sm font-bold text-[#111111]">
                {raceWide ? "보통 발볼로 보기" : "조건 풀기"}
              </button>
            </div>
          )}

          <div className="finder-row flex gap-3 overflow-x-auto px-5 pb-2 pt-4">
            {shown.map((s, i) => {
              const badge = u ? USE_BADGE[u] : s.uses.map((x) => USE_BADGE[x]).filter(Boolean).join("·");
              const widths = WIDTH_ORDER.filter((x) => s.widthOptions.includes(x)).map((x) => WIDTH_WORD[x]).join("·");
              return (
                <Link
                  key={`${s.id}-${w}-${u}`}
                  href={`/shoes/${s.id}`}
                  onClick={() => gtagEvent("home_shoe_click", { shoe: s.id, from: "finder_card" })}
                  className="press rise flex w-[300px] shrink-0 snap-start flex-col gap-1 text-[#111111]"
                  style={{ animationDelay: `${i * 24}ms` }}
                >
                  <span className="grid h-[300px] place-items-center overflow-hidden rounded-2xl bg-[#F1F3F0]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.imageUrl}
                      alt={`${s.brand} ${s.model}`}
                      width={258}
                      height={258}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-auto w-[258px] object-contain mix-blend-multiply"
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        el.onerror = null;
                        el.src = shoePlaceholder(s.brand, 258, 180);
                      }}
                    />
                  </span>
                  {badge && (
                    <span className="mt-2 self-start rounded bg-[#F1F3F0] px-2 py-1 text-xs font-bold">{badge}</span>
                  )}
                  <span className="text-xs text-[#4B5059]">{s.brand}</span>
                  <span className="text-base font-bold">{s.model}</span>
                  {widths && <span className="text-sm text-[#4B5059]">발볼 {widths}</span>}
                  {s.officialPrice ? (
                    <span className="text-base font-bold tabular-nums">
                      {s.officialPrice.toLocaleString()}원 <span className="text-xs font-normal text-[#4B5059]">공식몰 정가</span>
                    </span>
                  ) : (
                    <span className="text-base font-bold tabular-nums">
                      약 {s.priceKrw.toLocaleString()}원 <span className="text-xs font-normal text-[#4B5059]">권장가 추산</span>
                    </span>
                  )}
                </Link>
              );
            })}
            {all.length > 0 && (
              <Link
                href="/shoes"
                className="press flex h-[300px] w-40 shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-2xl bg-[#111111] text-base font-bold text-white"
              >
                전체 보기
                <Arrow size={20} />
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
