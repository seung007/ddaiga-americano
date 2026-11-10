"use client";

import { officialOf } from "@/lib/shoes/official";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ShoeThumb from "@/components/ShoeThumb";
import { gtagEvent } from "@/lib/gtag";
import { SHOES } from "@/lib/shoes/data";
import { cushionKo, hasWide, USE_KO, won } from "@/lib/shoes/labels";
import { describeSaved, profileFromSaved, STORAGE_KEY, type SavedProfile } from "@/lib/shoes/profileOptions";
import { rankAllShoes } from "@/lib/shoes/recommend";
import type { Shoe, ShoeUse } from "@/lib/shoes/types";
import { matchesQuery, searchKeyOf } from "@/lib/shoes/aliases";
import { Heart, SlidersHorizontal, X } from "lucide-react";
import { photoOf } from "@/lib/shoes/photos";

/** 검색 키는 한 번만 만든다 — 52켤레라 싸지만 매 입력마다 다시 만들 이유가 없다 */
const SEARCH_KEY = new Map(SHOES.map((s) => [s.id, searchKeyOf(s.brand, s.model)]));

const LIKE_KEY = "ddaiga:likedShoes";

const BRANDS = ["전체", ...Array.from(new Set(SHOES.map((s) => s.brand))).sort()];
const USES = ["전체", "daily", "long", "tempo", "racing"] as const;
const CUSH = ["전체", "가벼움", "보통", "푹신"] as const;
const PRICE = ["전체", "15만원 이하", "15–20만원", "20만원 초과"] as const;
const SORTS = [
  ["default", "기본순"],
  ["price_asc", "가격 낮은순"],
  ["price_desc", "가격 높은순"],
  ["light", "가벼운순"],
] as const;

function Chips<T extends string>({
  label,
  options,
  value,
  onChange,
  render = (o) => o,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  render?: (o: T) => string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-full shrink-0 text-sm font-semibold text-gray-700 md:w-12 md:text-xs md:font-medium md:text-gray-500">{label}</span>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === o}
          onClick={() => onChange(o)}
          className={`h-11 rounded-full border px-4 text-sm transition-colors ${
            value === o ? "border-emerald-500 bg-emerald-50 font-semibold text-emerald-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
          }`}
        >
          {render(o)}
        </button>
      ))}
    </div>
  );
}

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`h-11 rounded-full border px-4 text-sm transition-colors ${on ? "border-emerald-500 bg-emerald-50 font-semibold text-emerald-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
    >
      {children}
    </button>
  );
}

/**
 * 러닝화 목록 (2026-09-16, 러닝라이프 벤치마킹)
 *
 * 러닝라이프 구조를 따른다 — 총 개수 · 필터 · 카드 · 찜.
 * 러닝라이프에 없는 것 — **「내 조건으로 보기」**: 신발 찾기에 답한 적이 있으면 그 답으로 줄을 세운다.
 *
 * 넣지 않은 것 — **「인기순」과 별점.** 인기·리뷰 데이터가 없다. 없는 칸을 만들면 그 칸이 지어낸 값이 된다.
 * 찜은 로그인 없이 이 브라우저에만 저장한다. 문턱을 만들지 않는다(자유게시판 교훈).
 */
export default function ShoesBrowser() {
  /** 2026-09-26 검색 — 「슈블」「노블」처럼 애칭으로도 찾게. 근거는 lib/shoes/aliases.ts */
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("전체");
  const [use, setUse] = useState<(typeof USES)[number]>("전체");
  const [cush, setCush] = useState<(typeof CUSH)[number]>("전체");
  const [price, setPrice] = useState<(typeof PRICE)[number]>("전체");
  const [wide, setWide] = useState(false);
  const [stability, setStability] = useState(false);
  const [carbon, setCarbon] = useState(false);
  const [hideOld, setHideOld] = useState(false);
  const [sort, setSort] = useState<(typeof SORTS)[number][0]>("default");

  const [saved, setSaved] = useState<SavedProfile | null>(null);
  const [mine, setMine] = useState(false);
  const [liked, setLiked] = useState<string[]>([]);
  const [likedOnly, setLikedOnly] = useState(false);

  useEffect(() => {
    // 2026-10-12: /shoes?wide=1 로 들어오면 넓은 발볼 필터를 켠 채로 시작(wide-foot 글에서 넘어오는 길)
    try {
      if (new URLSearchParams(window.location.search).get("wide") === "1") setWide(true);
    } catch {
      /* 주소를 못 읽으면 기본값 */
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw) as SavedProfile;
        if (profileFromSaved(p)) setSaved(p);
      }
      const l = localStorage.getItem(LIKE_KEY);
      if (l) setLiked(JSON.parse(l));
    } catch {
      /* 저장소가 막힌 브라우저 — 찜·내 조건 없이 동작한다 */
    }
  }, []);

  function toggleLike(id: string) {
    setLiked((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(LIKE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  const ranking = useMemo(() => {
    const profile = saved ? profileFromSaved(saved) : null;
    if (!mine || !profile) return null;
    return new Map(rankAllShoes(profile).map((r, i) => [r.id, { ...r, order: i }]));
  }, [mine, saved]);

  const shown = useMemo(() => {
    const list = SHOES.filter((s: Shoe) => {
      if (query.trim() && !matchesQuery(SEARCH_KEY.get(s.id) ?? "", query)) return false;
      if (brand !== "전체" && s.brand !== brand) return false;
      if (use !== "전체" && !s.uses.includes(use as ShoeUse)) return false;
      if (cush !== "전체" && cushionKo(s.cushioning) !== cush) return false;
      if (price === "15만원 이하" && s.priceKrw > 150_000) return false;
      if (price === "15–20만원" && (s.priceKrw <= 150_000 || s.priceKrw > 200_000)) return false;
      if (price === "20만원 초과" && s.priceKrw <= 200_000) return false;
      if (wide && !hasWide(s)) return false;
      if (stability && s.stability === "neutral") return false;
      if (carbon && !s.hasCarbon) return false;
      if (hideOld && s.successor) return false;
      if (likedOnly && !liked.includes(s.id)) return false;
      if (ranking && !ranking.has(s.id)) return false; // 성별 자격 밖(여성 전용 라스트 등)
      return true;
    });
    if (ranking && sort === "default") return list.sort((a, b) => ranking.get(a.id)!.order - ranking.get(b.id)!.order);
    if (sort === "price_asc") return list.sort((a, b) => a.priceKrw - b.priceKrw);
    if (sort === "price_desc") return list.sort((a, b) => b.priceKrw - a.priceKrw);
    if (sort === "light") return list.sort((a, b) => a.weightGramsM9 - b.weightGramsM9);
    return list;
  }, [query, brand, use, cush, price, wide, stability, carbon, hideOld, likedOnly, liked, ranking, sort]);

  const firstMisfit = ranking && sort === "default" ? shown.findIndex((s) => !ranking.get(s.id)?.fits) : -1;

  /**
   * 2026-11-10 디자인 점검: 휴대폰에서 필터가 첫 화면을 다 차지해 신발이 830px 아래에서 시작했다.
   * → 휴대폰은 「필터 (N)」 버튼 + 아래에서 올라오는 창 + 고정 「결과 N개 보기」(패턴 25),
   *   걸린 조건은 목록 위에 × 칩으로(패턴 26). PC(md 이상)는 지금처럼 펼쳐 둔다.
   */
  const [sheet, setSheet] = useState(false);
  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [sheet]);

  const active: { label: string; clear: () => void }[] = [
    ...(brand !== "전체" ? [{ label: brand, clear: () => setBrand("전체") }] : []),
    ...(use !== "전체" ? [{ label: USE_KO[use as ShoeUse], clear: () => setUse("전체") }] : []),
    ...(cush !== "전체" ? [{ label: `쿠션 ${cush}`, clear: () => setCush("전체") }] : []),
    ...(price !== "전체" ? [{ label: price, clear: () => setPrice("전체") }] : []),
    ...(wide ? [{ label: "넓은 발볼", clear: () => setWide(false) }] : []),
    ...(stability ? [{ label: "안정화", clear: () => setStability(false) }] : []),
    ...(carbon ? [{ label: "카본 플레이트", clear: () => setCarbon(false) }] : []),
    ...(hideOld ? [{ label: "후속 나온 모델 숨김", clear: () => setHideOld(false) }] : []),
    ...(likedOnly ? [{ label: "찜한 신발", clear: () => setLikedOnly(false) }] : []),
  ];
  const clearAll = () => active.forEach((a) => a.clear());

  const filters = (
    <>
      <Chips label="브랜드" options={BRANDS} value={brand} onChange={setBrand} />
      <Chips label="용도" options={USES} value={use} onChange={setUse} render={(o) => (o === "전체" ? o : USE_KO[o])} />
      <Chips label="쿠셔닝" options={CUSH} value={cush} onChange={setCush} />
      <Chips label="가격" options={PRICE} value={price} onChange={setPrice} />
      <div className="flex flex-wrap items-center gap-2">
        <span className="w-full shrink-0 text-sm font-semibold text-gray-700 md:w-12 md:text-xs md:font-medium md:text-gray-500">조건</span>
        <Toggle on={wide} onClick={() => setWide((v) => !v)}>넓은 발볼(2E·4E)</Toggle>
        <Toggle on={stability} onClick={() => setStability((v) => !v)}>안정화</Toggle>
        <Toggle on={carbon} onClick={() => setCarbon((v) => !v)}>카본 플레이트</Toggle>
        <Toggle on={hideOld} onClick={() => setHideOld((v) => !v)}>후속 나온 모델 숨기기</Toggle>
        <Toggle on={likedOnly} onClick={() => setLikedOnly((v) => !v)}><Heart size={14} strokeWidth={1.5} aria-hidden className="mr-1 inline align-[-2px]" />찜 {liked.length}</Toggle>
      </div>
    </>
  );

  return (
    <>
      {/* 내 조건으로 보기 */}
      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        {saved ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-emerald-900">내 조건으로 보기</p>
              <p className="mt-0.5 text-xs text-emerald-800">{describeSaved(saved)}</p>
            </div>
            <button
              type="button"
              aria-pressed={mine}
              onClick={() => {
                setMine((m) => !m);
                if (!mine) gtagEvent("shoes_my_filter", { from: "shoes" });
              }}
              className={`h-11 rounded-full px-4 text-sm font-semibold transition-colors ${
                mine ? "bg-emerald-600 text-white" : "border border-emerald-400 bg-white text-emerald-700"
              }`}
            >
              {mine ? "켜짐" : "켜기"}
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-emerald-900">
              키·체중·발볼을 알려주시면 <strong>내 몸에 맞는 순서</strong>로 줄 세워 드려요.
            </p>
            <Link
              href="/shoe-finder"
              className="flex h-11 items-center rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              질문 8개 답하기 →
            </Link>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <label htmlFor="shoe-q" className="sr-only">
          러닝화 검색
        </label>
        <input
          id="shoe-q"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="모델명·애칭 (예: 슈블, 노블, 카야노)"
          className="h-11 min-w-0 flex-1 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
        />
        <button
          type="button"
          onClick={() => setSheet(true)}
          aria-haspopup="dialog"
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 md:hidden"
        >
          <SlidersHorizontal size={16} aria-hidden />
          필터{active.length > 0 && ` (${active.length})`}
        </button>
      </div>

      {/* PC: 펼쳐 둔다 */}
      <div className="mt-4 hidden space-y-2 rounded-2xl border border-gray-200 p-4 md:block">{filters}</div>

      {/* 휴대폰: 아래에서 올라오는 창 */}
      {sheet && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-labelledby="sheet-h">
          <button type="button" aria-label="필터 닫기" onClick={() => setSheet(false)} className="sheet-fade absolute inset-0 bg-black/40" />
          <div className="sheet-up absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-3xl bg-white">
            <div className="flex items-center justify-between px-5 pt-4">
              <h2 id="sheet-h" className="text-xl font-bold text-gray-900">필터</h2>
              <button type="button" onClick={() => setSheet(false)} aria-label="닫기" className="grid size-11 place-items-center rounded-full">
                <X size={20} aria-hidden />
              </button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-4 pt-2">{filters}</div>
            <div className="flex gap-2 border-t border-gray-200 px-5 py-3">
              {active.length > 0 && (
                <button type="button" onClick={clearAll} className="h-12 rounded-full border border-gray-200 bg-white px-5 text-base font-semibold text-gray-700">
                  초기화
                </button>
              )}
              <button type="button" onClick={() => setSheet(false)} className="h-12 flex-1 rounded-full bg-emerald-600 text-base font-semibold text-white hover:bg-emerald-700">
                결과 {shown.length}개 보기
              </button>
            </div>
          </div>
        </div>
      )}

      {active.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {active.map((a) => (
            <button key={a.label} type="button" onClick={a.clear} aria-label={`${a.label} 조건 빼기`}
              className="flex h-11 items-center gap-1 rounded-full border border-emerald-500 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700">
              {a.label}<X size={14} aria-hidden />
            </button>
          ))}
          <button type="button" onClick={clearAll} className="h-11 px-2 text-sm text-gray-500 underline">모두 지우기</button>
        </div>
      )}
      {liked.length >= 2 && (
        /* 2026-10-13: 찜한 신발을 바로 견주는 길 — 두께 비교 도구는 3켤레까지(?s=a,b,c) */
        <Link
          href={`/tools/shoe-side?s=${liked.filter((id) => SHOES.some((x) => x.id === id)).slice(-3).join(",")}`}
          className="mt-3 inline-flex rounded-full border border-emerald-300 px-4 text-sm text-emerald-700 hover:bg-emerald-50"
        >
          찜한 신발 두께 비교 →
        </Link>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-600">
          <strong>{shown.length}개</strong> / 전체 {SHOES.length}개
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="h-11 rounded-lg border border-gray-200 px-3 text-sm text-gray-700"
          aria-label="정렬"
        >
          {SORTS.map(([v, l]) => (
            <option key={v} value={v}>
              {v === "default" && ranking ? "내 조건순" : l}
            </option>
          ))}
        </select>
      </div>

      {shown.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
          조건에 맞는 러닝화가 없습니다. 필터를 하나 풀어 보세요.
        </p>
      ) : (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {shown.map((s, i) => {
            const r = ranking?.get(s.id);
            return (
              <li key={s.id} className="contents">
                {i === firstMisfit && (
                  <p className="col-span-full mt-4 border-t border-gray-200 pt-4 text-sm font-semibold text-gray-500">
                    조건과 덜 맞는 신발 — 발볼·용도·예산 중 하나가 어긋납니다
                  </p>
                )}
                <div className="relative flex flex-col rounded-2xl border border-gray-200 p-3 transition-colors hover:border-emerald-400">
                  <button
                    type="button"
                    onClick={() => toggleLike(s.id)}
                    aria-label={liked.includes(s.id) ? `${s.model} 찜 해제` : `${s.model} 찜하기`}
                    className={`absolute right-0 top-0 z-10 grid size-11 place-items-center ${liked.includes(s.id) ? "text-red-500" : "text-gray-500 hover:text-gray-400"}`}
                  >
                    <Heart size={20} strokeWidth={1.5} aria-hidden fill={liked.includes(s.id) ? "currentColor" : "none"} />
                  </button>
                  <Link href={`/shoes/${s.id}`} className="flex flex-1 flex-col">
                    {/* 2026-11-10: 공식몰 옆모습 사진이 있으면 그것, 없으면 기존 사진. 둘 다 크기를 적는다(화면 밀림 방지) */}
                    {(() => {
                      const ph = photoOf(s.id);
                      return ph ? (
                        <span className="grid aspect-square w-full place-items-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={`/shoes/photo/${s.id}.webp`} alt={`${s.brand} ${s.model}`} width={ph.w} height={ph.h} loading={i < 4 ? "eager" : "lazy"} className="h-auto w-full" />
                        </span>
                      ) : (
                        <ShoeThumb src={s.imageUrl} alt={`${s.brand} ${s.model}`} model={s.model} className="aspect-square w-full" />
                      );
                    })()}
                    <p className="mt-2 text-xs text-gray-500">{s.brand}</p>
                    <p className="font-bold leading-snug text-gray-900">{s.model}</p>
                    {/* 2026-11-06: 홈은 「159,000원 공식몰 정가」, 여기는 「약 159,000원」으로 같은 신발이 달랐다 — 홈과 같은 규칙(공식몰 목록에 있고 값이 있을 때만) */}
                    {(() => {
                      const o = officialOf(s.id);
                      return o?.listed && o.priceKrw ? (
                        <p className="mt-1 text-sm text-gray-800">{won(o.priceKrw)} <span className="text-xs text-gray-500">공식몰 정가</span></p>
                      ) : (
                        <p className="mt-1 text-sm text-gray-800">약 {won(s.priceKrw)}</p>
                      );
                    })()}
                    <p className="mt-1 text-xs text-gray-500">
                      {s.weightGramsM9}g · 드롭 {s.heelDropMm}mm · {cushionKo(s.cushioning)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {s.uses.map((u) => (
                        <span key={u} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                          {USE_KO[u]}
                        </span>
                      ))}
                      {hasWide(s) && <span className="rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700">와이드</span>}
                      {s.hasCarbon && <span className="rounded bg-gray-900 px-1.5 py-0.5 text-xs text-white">카본</span>}
                      {s.successor && (
                        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-xs text-amber-700">후속 출시</span>
                      )}
                    </div>
                    {r?.reason && <p className="mt-2 text-xs leading-snug text-emerald-800">{r.reason}</p>}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-4 text-xs text-gray-400">
        가격은 국내 권장소비자가 기준 추산이고 판매처마다 다릅니다. 무게는 남성 US9 기준입니다.
      </p>
    </>
  );
}
