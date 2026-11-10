"use client";

import Link from "next/link";
import { gtagEvent } from "@/lib/gtag";

/**
 * 홈 첫 화면 — 추천기 입구 (2026-11-05 「H01 수정안」 → 2026-11-10 디자인 A안)
 *
 * 왜 이렇게 됐나
 *   GA4 최근 28일(2026-11-05 확인): `/shoe-finder` 를 연 사람의 주요 이벤트 비율이 가장 높았다 → 홈 첫 화면을 추천기 입구로.
 *   11-05 안은 발볼·용도를 고른 뒤 버튼을 한 번 더 눌러야 했다. 11-10 운영자: 「두 번 눌러야 한다」 「발볼은 안에서 고르니 빼자」.
 *   → 용도 타일을 누르면 바로 추천기로 간다(`/shoe-finder?from=home&u=long` → 추천기가 용도를 채우고 시작).
 *
 * 지키는 것
 *   · 아래 「러닝화 미리 보기」는 추천이 아니라 목록 맛보기다.
 *   · 가격은 공식몰 자동 확인값이 있을 때만 「공식몰 정가」, 없으면 상세 페이지처럼 「약 …원」.
 */

export type FinderShoe = {
  id: string;
  brand: string;
  model: string;
  imageUrl: string;
  /** 공식몰 옆모습 제품 사진(배경 지움, public/shoes/photo/) — 없으면 undefined. 출처는 lib/shoes/photos.json */
  photo?: { src: string; w: number; h: number };
  uses: string[];
  widthOptions: string[];
  /** 공식몰 자동 확인 정가 — 없으면 undefined */
  officialPrice?: number;
  /** data.ts 권장소비자가 추산 */
  priceKrw: number;
};

type UseKey = "daily" | "long" | "racing";

/**
 * 2026-11-10 운영자: 「발볼은 추천기 안에서 고르니 첫 화면에선 빼자」 → 디자인 캔버스 A안.
 * 첫 화면은 용도 타일 세 개뿐이고, 타일을 누르면 그 용도를 들고 바로 추천기로 간다(누르는 횟수 한 번).
 * 타일 그림: 공식몰 옆모습 제품 사진(public/shoes/photo/, 출처·확인 날짜는 lib/shoes/photos.json). 2026-11-10 교체.
 *   이전 컷아웃(public/shoes/cutout/)은 원본 주소가 기록되지 않았고 신발 끝이 그림 테두리에서 잘려 연두 바탕에서 세로줄로 보였다 → 지웠다.
 *   세 브랜드에서 하나씩 고른다(한 브랜드만 크게 보이면 광고처럼 읽힌다). 용도는 원장 uses 에 그 용도가 있는 모델.
 *   사진 사용 권리는 아직 정하지 않았다(운영자 확인 대기, 다른 신발 사진과 같은 문제).
 * 움직임(globals.css 「홈 용도 타일」): 들어올 때 한 번 300ms, 마우스를 올리거나 키보드로 고르면 회색 → 연두 200ms·신발 8px 올라옴.
 *   마우스 올림은 (hover:hover) and (pointer:fine) 안에서만, 움직임 줄이기면 이동을 빼고 짧은 페이드만 남긴다.
 */
const USE_TILES: { k: UseKey; label: string; desc: string; img: string; w: number; h: number }[] = [
  { k: "daily", label: "일상", desc: "평소 조깅", img: "/shoes/photo/saucony-ride-19.webp", w: 800, h: 410 },
  { k: "long", label: "장거리", desc: "하프·풀 준비", img: "/shoes/photo/mizuno-wave-rider-30.webp", w: 800, h: 442 },
  { k: "racing", label: "대회용", desc: "기록을 줄일 때", img: "/shoes/photo/asics-metaspeed-sky-tokyo.webp", w: 594, h: 317 },
];
const USE_BADGE: Record<string, string> = { daily: "일상", long: "장거리", tempo: "템포", racing: "대회용" };
const WIDTH_WORD: Record<string, string> = { B: "좁게", D: "보통", "2E": "넓게", "4E": "아주 넓게" };
const WIDTH_ORDER = ["B", "D", "2E", "4E"];

function Arrow({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function HomeFinderCard({ shoes, count }: { shoes: FinderShoe[]; count: number }) {
  // 미리 보기: 공식몰 제품 사진이 있는 신발만, 브랜드를 돌아가며 4개 (패턴 15 — 사진 배경·각도를 맞춘다.
  // 착용 사진은 목록에 넣지 않는다 — 패턴 35, 2026-11-10 운영자 「회색 칸이 두 겹」)
  const TILE_IDS = new Set(USE_TILES.map((t) => t.img.split("/").pop()!.replace(".webp", "")));
  const byBrand = new Map<string, FinderShoe[]>();
  for (const s of shoes) {
    if (!s.photo || TILE_IDS.has(s.id)) continue;
    byBrand.set(s.brand, [...(byBrand.get(s.brand) ?? []), s]);
  }
  const shown: FinderShoe[] = [];
  for (let i = 0; shown.length < 4 && [...byBrand.values()].some((l) => l[i]); i++) {
    for (const l of byBrand.values()) if (l[i] && shown.length < 4) shown.push(l[i]);
  }

  return (
    <>
      {/**
        * 2026-11-10 디자인 A안 — 흰 바탕, 큰 제목 하나, 용도 타일 세 개(같은 회색 바탕, 패턴 15).
        * 「N종」은 추천기가 실제로 고르는 후보 수(lib/shoes/recommend.ts RECOMMENDABLE_COUNT)를 서버에서 받아 쓴다 —
        * 자동 수집으로 신발이 늘면 이 문장도 같이 바뀐다.
        */}
      <section aria-labelledby="finder-h" className="pt-8 md:pt-16">
        <div className="mx-auto max-w-5xl px-5">
          <h1 id="finder-h" className="text-[40px] font-black leading-[1.1] tracking-[-1px] md:whitespace-nowrap md:text-[64px] md:tracking-[-2px]">
            내 발에 맞는 러닝화
          </h1>
          <p className="mt-4 text-base font-bold leading-normal text-[#111111] md:mt-6 md:text-xl">
            러닝화 {count}종의 스펙 데이터로 <br className="md:hidden" />
            3켤레를 골라 드려요
          </p>
          <p className="mt-2 text-sm text-[#4B5059]">가입 없이 무료</p>

          <h2 className="mt-8 text-base font-bold md:mt-12">어디에 신을 신발인가요?</h2>
          <ul className="mt-3 flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-4">
            {USE_TILES.map((t, i) => (
              <li key={t.k} className="use-in" style={{ animationDelay: `${80 + i * 60}ms` }}>
                <Link
                  href={`/shoe-finder?from=home&u=${t.k}`}
                  onClick={() => gtagEvent("home_finder_cta", { width: "unset", use: t.k })}
                  aria-label={`${t.label}, ${t.desc} 용도로 추천 시작`}
                  className="use-tile press flex items-center gap-3 rounded-2xl text-[#111111] md:flex-col md:items-stretch md:gap-0"
                >
                  <span className="use-surf flex h-32 shrink-0 items-center justify-center rounded-2xl px-2 md:aspect-[4/3] md:h-auto md:p-8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.img}
                      alt=""
                      width={t.w}
                      height={t.h}
                      fetchPriority={i === 0 ? "high" : undefined}
                      className="use-shoe h-auto w-[clamp(112px,36vw,160px)] md:w-full"
                    />
                  </span>
                  <span className="flex min-w-0 flex-1 items-center justify-between gap-3 md:mt-4">
                    <span className="min-w-0">
                      <span className="block text-xl font-black md:inline md:text-2xl">{t.label}</span>
                      <span className="block text-sm text-[#4B5059] md:inline md:text-base md:font-medium">
                        <span className="hidden md:inline"> - </span>
                        {t.desc}
                      </span>
                    </span>
                    <span className="use-go grid size-11 shrink-0 place-items-center rounded-full bg-[#111111] text-white">
                      <Arrow />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="shoes" aria-labelledby="list-h" className="scroll-mt-16 pt-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between px-5">
            <h2 id="list-h" className="text-xl font-semibold text-[#111111]">
              러닝화 미리 보기
            </h2>
            <Link href="/shoes" className="flex min-h-11 items-center text-sm font-bold text-[#111111] underline">
              전체 보기
            </Link>
          </div>

          <div className="finder-row flex gap-3 overflow-x-auto px-5 pb-2 pt-4">
            {shown.map((s) => {
              const badge = s.uses.map((x) => USE_BADGE[x]).filter(Boolean).join("·");
              const widths = WIDTH_ORDER.filter((x) => s.widthOptions.includes(x)).map((x) => WIDTH_WORD[x]).join("·");
              return (
                <Link
                  key={s.id}
                  href={`/shoes/${s.id}`}
                  onClick={() => gtagEvent("home_shoe_click", { shoe: s.id, from: "finder_card" })}
                  className="press flex w-[300px] shrink-0 snap-start flex-col gap-1 text-[#111111]"
                >
                  <span className="grid h-[300px] place-items-center overflow-hidden rounded-2xl bg-[#F2F2F0] p-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.photo!.src}
                      alt={`${s.brand} ${s.model}`}
                      width={s.photo!.w}
                      height={s.photo!.h}
                      loading="lazy"
                      className="h-auto w-full"
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
            {shown.length > 0 && (
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
