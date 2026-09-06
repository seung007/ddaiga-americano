"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 홈 신발 띠 — 클릭 0회로 신발이 보인다
 *
 * 왜 만들었나 (2026-09-06)
 * ───────────────────────
 * 러닝화 추천 사이트인데 **홈에 신발 사진이 한 장도 없었다.**
 * 첫 화면이 하는 일은 "내 신발 찾기 시작 →" 버튼 하나를 내미는 것뿐이고,
 * 그 버튼의 GA 이벤트(`finder_cta_click`)는 9/5 기준 **0건**이다.
 * 홈은 사용자 25%로 1위 페이지인데, 거기서 아무것도 안 보여주고 클릭부터 요구했다.
 *
 * 그래서 **보여주는 것을 먼저** 한다. 신발 52종은 이미 가진 자산이다.
 *
 * 설계에서 갈린 것들
 * ─────────────────
 * · **자동으로 흐르되, 사람이 건드리면 영영 멈춘다.** 자동 캐러셀이 욕먹는 이유는
 *   읽으려는데 움직이기 때문이다. 그래서 마우스를 올리거나·스크롤하거나·화살표를 누르면
 *   그때부터 자동이 꺼지고 **다시 켜지지 않는다.** 움직임은 "여기 볼 게 있다"는 신호
 *   한 번이면 충분하고, 그 다음부터는 방해다.
 * · **`prefers-reduced-motion`이면 처음부터 정지.** HeroBackdrop과 같은 원칙.
 * · **탭은 필터이지 추천이 아니다.** 탭 넷으로 "당신에게 맞는 신발"이라고 말하면
 *   키·체중·발볼·발타입·성별까지 보는 `/shoe-finder`의 추천과 충돌하고,
 *   이 사이트의 유일한 주장(논문 기반 정밀 추천)이 스스로 약해진다.
 *   여기서는 **"이런 종류가 있다"까지만** 하고 정확한 건 finder로 넘긴다.
 * · **탭을 고르면 흐름을 멈추고 고정 격자로 바꾼다.** 고를 때는 비교하려는 것이고,
 *   비교하려는 사람 앞에서 대상이 움직이면 안 된다.
 * · **'전체' 탭을 두지 않았다.** 고른 탭을 다시 누르면 해제되고 흐르는 상태로 돌아간다.
 *   부상 목록에서 '전체' 칩을 뺀 것과 같은 판단이다.
 *
 * 이미지 주의 — 40장이 경쟁사 CDN(`cdn.runrepeat.com`)이다(`check:images` 참고).
 * 홈은 1위 페이지라 여기에 의존을 더 얹으면 사고가 나면 더 크게 난다.
 * 그래서 띠에는 **일부만** 싣고, `onError` 폴백을 반드시 건다.
 */

export interface StripShoe {
  id: string;
  brand: string;
  model: string;
  imageUrl: string;
  cushioning: number;
  weightGramsM9: number;
  priceKrw: number;
  /** 한 줄 특징 — 카드에 그대로 보인다 */
  tagline: string;
  uses: string[];
  widthOptions: string[];
  hasCarbon: boolean;
}

type TabKey = "beginner" | "long" | "speed" | "wide";

const TABS: { key: TabKey; label: string; hint: string; match: (s: StripShoe) => boolean }[] = [
  {
    key: "beginner",
    label: "입문용",
    hint: "카본 없이, 매일 신는 쿠션화",
    match: (s) => s.cushioning >= 3 && !s.hasCarbon && s.uses.includes("daily"),
  },
  {
    key: "long",
    label: "장거리",
    hint: "10km 이상을 포장로에서",
    match: (s) => s.uses.includes("long") && s.cushioning >= 4,
  },
  {
    key: "speed",
    label: "스피드",
    hint: "템포런·대회용",
    match: (s) => s.uses.includes("tempo") || s.uses.includes("racing"),
  },
  {
    key: "wide",
    label: "발볼 넓음",
    hint: "2E 이상 폭이 나오는 모델",
    match: (s) => s.widthOptions.some((w) => w === "2E" || w === "4E"),
  },
];

/** 자동 이동 속도(px/초). 읽을 수 있을 만큼 느려야 한다 */
const SPEED = 22;

function ga(name: string, params: Record<string, unknown>) {
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof g === "function") g("event", name, params);
}

export default function ShoeStrip({ shoes }: { shoes: StripShoe[] }) {
  const [tab, setTab] = useState<TabKey | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  /**
   * 두 가지를 갈라 둔다. 처음엔 하나로 합쳐 뒀다가 문제를 발견했다 —
   * 마우스가 우연히 띠 위에 있으면 **한 번도 안 움직이고 끝나서** 만든 이유가 사라진다.
   *
   *   pausedRef  — 마우스를 올린 동안만. 떠나면 다시 흐른다
   *   stoppedRef — 화살표·스와이프·휠처럼 **의도가 분명한 조작**. 영구 정지
   */
  const pausedRef = useRef(false);
  const stoppedRef = useRef(false);
  const [flowing, setFlowing] = useState(false);

  const filtered = tab ? shoes.filter(TABS.find((t) => t.key === tab)!.match) : shoes;

  // ── 자동 이동 ────────────────────────────────────────────
  useEffect(() => {
    if (tab) return; // 탭을 고르면 고정 격자다. 흐를 것이 없다
    const el = scrollerRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || stoppedRef.current) return;

    setFlowing(true);
    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!stoppedRef.current && !pausedRef.current && el.scrollWidth > el.clientWidth) {
        el.scrollLeft += SPEED * dt;
        // 목록을 두 벌 깔아 두었으므로 절반을 넘으면 되돌려 이음매를 감춘다.
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) el.scrollLeft -= half;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [tab]);

  /** 의도가 분명한 조작 — 여기서 멈추면 끝이다 */
  const stopFlow = useCallback(() => {
    if (stoppedRef.current) return;
    stoppedRef.current = true;
    setFlowing(false);
  }, []);

  const nudge = (dir: -1 | 1) => {
    stopFlow();
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(240, el.clientWidth * 0.8), behavior: "smooth" });
    ga("home_strip_arrow", { dir: dir === 1 ? "next" : "prev" });
  };

  const pickTab = (k: TabKey) => {
    const next = tab === k ? null : k;
    setTab(next);
    ga("home_strip_tab", { tab: next ?? "none" });
  };

  // 흐를 때는 이음매 없이 돌도록 두 벌을 깐다. 고정일 때는 한 벌이면 된다.
  const items = tab ? filtered : [...filtered, ...filtered];

  return (
    <section className="pb-16" aria-labelledby="strip-heading">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-1 flex items-baseline justify-between gap-3">
          <h2 id="strip-heading" className="text-2xl font-bold text-gray-900">
            지금 볼 수 있는 러닝화
          </h2>
          <Link href="/shoe-finder" className="shrink-0 text-sm text-emerald-600 hover:underline">
            내 체형으로 고르기 →
          </Link>
        </div>
        <p className="mb-5 text-sm leading-relaxed text-gray-500">
          {tab
            ? `${TABS.find((t) => t.key === tab)!.hint} · ${filtered.length}개`
            : "누르지 않아도 지나갑니다. 종류를 고르면 멈추고 한눈에 보여드려요."}
        </p>

        {/* ── 탭 ── */}
        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="신발 종류 고르기">
          {TABS.map((t) => {
            const n = shoes.filter(t.match).length;
            const on = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => pickTab(t.key)}
                aria-pressed={on}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  on
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300"
                }`}
              >
                {t.label}
                <span className={`ml-1.5 text-xs ${on ? "text-emerald-100" : "text-gray-400"}`}>{n}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 띠 / 격자 ──
          흐를 때는 화면 폭을 다 쓴다(끝이 잘려 보여야 "더 있다"가 읽힌다).
          고정일 때는 본문 폭에 맞춘다. */}
      {tab ? (
        <div className="mx-auto max-w-3xl px-6">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((s) => (
              <li key={s.id}>
                <ShoeCard shoe={s} />
              </li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-500">
              이 조건에 맞는 신발이 아직 없습니다.
            </p>
          )}
        </div>
      ) : (
        <div className="relative">
          <div
            ref={scrollerRef}
            onPointerDown={stopFlow}
            onWheel={stopFlow}
            onTouchStart={stopFlow}
            onMouseEnter={() => {
              pausedRef.current = true;
            }}
            onMouseLeave={() => {
              pausedRef.current = false;
            }}
            className="flex gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollSnapType: "x proximity" }}
          >
            {items.map((s, i) => (
              <div key={`${s.id}-${i}`} className="w-[220px] shrink-0" style={{ scrollSnapAlign: "start" }}>
                {/* 두 벌째는 화면을 채우는 용도라 스크린리더에서 숨긴다 */}
                <div aria-hidden={i >= filtered.length}>
                  <ShoeCard shoe={s} />
                </div>
              </div>
            ))}
          </div>

          {/* ── 양 끝 화살표 ──
              모바일에서는 스와이프가 자연스러워 숨긴다(sm 이상에서만). */}
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="이전 신발 보기"
            className="absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow-sm backdrop-blur transition-colors hover:border-emerald-300 hover:text-emerald-700 sm:flex"
          >
            <span aria-hidden>‹</span>
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="다음 신발 보기"
            className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow-sm backdrop-blur transition-colors hover:border-emerald-300 hover:text-emerald-700 sm:flex"
          >
            <span aria-hidden>›</span>
          </button>

          {flowing && (
            <p className="mt-2 text-center text-xs text-gray-400">
              천천히 지나갑니다 · 손대면 멈춥니다
            </p>
          )}
        </div>
      )}
    </section>
  );
}

function ShoeCard({ shoe }: { shoe: StripShoe }) {
  return (
    <Link
      href="/shoe-finder"
      onClick={() => ga("home_shoe_click", { shoe: shoe.id })}
      className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 transition-colors hover:border-emerald-300"
    >
      <div className="mb-3 flex h-28 items-center justify-center rounded-xl bg-gray-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shoe.imageUrl}
          alt={`${shoe.brand} ${shoe.model}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-contain p-2"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = `https://placehold.co/220x160/f3f4f6/9ca3af?text=${encodeURIComponent(shoe.brand)}`;
          }}
        />
      </div>
      <p className="text-xs font-medium text-gray-400">{shoe.brand}</p>
      <p className="mb-1 truncate text-sm font-semibold text-gray-900">{shoe.model}</p>
      <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-gray-600">{shoe.tagline}</p>
      <p className="mt-auto text-xs text-gray-500">
        쿠션 {shoe.cushioning}/5 · {shoe.weightGramsM9}g · {shoe.priceKrw.toLocaleString()}원
      </p>
    </Link>
  );
}
