import type { Metadata } from "next";
import Link from "next/link";
import { STAGES, HONERT_CITE, HONERT_HREF, HONERT_ROWS, LEVEL_LABEL, type StageId } from "@/lib/guide/stages";
import LevelCheck from "@/components/guide/LevelCheck";
import GuideArticleList from "@/components/guide/GuideArticleList";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import OpenOnHash from "@/components/guide/OpenOnHash";
import StageListButton from "@/components/guide/StageListButton";
import { ARTICLES } from "@/lib/guide/articles";
import { Basis } from "@/components/guide/Read";

/**
 * 러닝 가이드 허브 — **넘으려는 단계** 기준 (2026-10-06 개편)
 *
 * 전에는 "use client" 한 파일이었고 **메타데이터가 아예 없었다** — 네이버 유입 상위 문서가
 * 몰린 경로의 허브인데 제목이 사이트 기본값이었다. 서버 페이지로 바꾸고, 상호작용(단계 찾기·글 필터)만
 * 클라이언트 컴포넌트로 뺐다.
 *
 * 구조를 바꾼 이유는 `lib/guide/stages.ts` 머리말. 요약:
 *   · 초심자/중급자/숙련자 경계(개월·km)는 사이트가 정한 값이었고 근거가 없었다
 *   · 사람이 막히는 지점은 경력이 아니라 **지금 넘으려는 거리**에서 갈린다
 *   · 경력·빈도·주간 거리(Honert 2020)는 「내 단계 찾기」와 맨 아래 표에서 **참고로만**
 *
 * ⚠️ 주소(`/injury`)는 그대로 둔다(2026-09-13 결정 — 네이버 유입 상위 문서 10개가 이 경로).
 *
 * 2026-10-13 가독성 재설계 — 사용자: "너무 길고 … 투머치하게 가독성이 안좋아", "이런 말들을 사용할까 과연?"
 *   실측(375px) 13,153px·화면 16장. 5단계 × 3~4항목이 사실+출처+할 일+배지까지 전부 펼쳐져 있었고,
 *   단계 찾기에서 고른 내용이 아래에 또 나왔다.
 *   · 입구를 셋으로: 지금 어디쯤(단계 카드 5개) / 아픈 곳 / 그 밖에 찾는 것
 *   · 「내 단계 찾기」 버튼과 아래 단계 카드가 같은 다섯 개를 두 번 보여줬다 → 단계 카드 하나로 합침.
 *     카드는 기본 접힘, 누르면 「자주 겪는 문제 → 이렇게」, 논문 숫자는 한 번 더 접힘
 *   · 경력·횟수·거리 비교(LevelCheck)는 맨 아래 「초보·중급·숙련」 접힘 안으로
 *   · 항목 이름은 사람이 하는 말로(lib/guide/stages.ts), 「경험칙·논문 결론」 → 「저희 제안·연구로 확인」
 *   · 수준 정의 표는 맨 아래 접힘
 *   · 단계 카드 id(stage-*)는 그대로 — 글들이 /injury#stage-to10k 로 링크한다. 접혀 있어도 OpenOnHash 가 펼친다
 */

export const metadata: Metadata = {
  title: "러닝 가이드 — 처음 30분부터 풀코스까지, 단계마다 자주 겪는 문제 | 뛰다가 아메리카노",
  description:
    "달리기를 처음 시작해 30분을 뛰기까지, 그리고 10km·하프·풀코스로 넘어갈 때 사람들이 실제로 막히는 지점과 할 일을 논문 수치로 정리했습니다. 내 단계 찾기 포함.",
  alternates: { canonical: "/injury" },
};

/** 단계 카드 제목 — 사람이 자기 상황을 말하는 방식으로(2026-10-13) */
const ASK: Record<StageId, [string, string]> = {
  start: ["처음이에요", "30분을 쉬지 않고 뛰기 어려워요 · 오래 쉬다 다시 시작해도"],
  to10k: ["30분은 뛰어요", "5·10km 완주가 목표예요"],
  "to-half": ["10km 완주했어요", "하프를 준비해요"],
  "to-full": ["하프 완주했어요", "풀코스를 준비해요"],
  faster: ["풀코스 완주했어요", "기록을 줄이고 싶어요"],
};

const PAIN_LINKS: { href: string; label: string }[] = [
  { href: "/injury/shin-splints", label: "정강이" },
  { href: "/injury/knee-pain", label: "무릎 앞" },
  { href: "/injury/it-band", label: "무릎 바깥" },
  { href: "/injury/plantar-fasciitis", label: "발바닥·뒤꿈치" },
  { href: "/injury/achilles", label: "아킬레스·종아리" },
  { href: "/injury/return-to-running", label: "다쳤다가 다시 시작" },
];

const MORE_LINKS: { href: string; label: string }[] = [
  { href: "/tools/run-30", label: "30분 달리기 플랜 — 회차별로 따라 하기" },
  { href: "/injury/training-types", label: "훈련 종류 (인터벌·템포·LSD…)" },
  { href: "/injury/warmup", label: "달리기 전 준비운동" },
  { href: "/injury/half-marathon-race-day", label: "대회 당일 체크리스트" },
  { href: "/injury/wide-foot", label: "발볼 넓은 발 신발" },
];

export default function InjuryHubPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-10">
      <BreadcrumbJsonLd trail={[["러닝 가이드", "/injury"]]} />
      <OpenOnHash />

      <header>
        <h1 className="text-[28px] font-bold text-gray-900">러닝 가이드</h1>
        <p className="mt-2 break-keep text-[17px] leading-[1.7] text-gray-600">
          지금 어디쯤인지 고르면, 그 단계에서 자주 겪는 문제와 읽을 글을 보여 드립니다.
        </p>
      </header>

      {/* id="finder" 는 다른 글들의 「내 단계 찾기」 링크(/injury#finder)가 가리킨다 */}
      <section id="stages" className="mt-7 scroll-mt-20">
        <h2 id="finder" className="scroll-mt-20 text-lg font-bold text-gray-900">지금 어디쯤인가요?</h2>

        <div className="mt-4 space-y-2.5">
          {STAGES.map((s) => (
            <details
              key={s.id}
              id={`stage-${s.id}`}
              className="group scroll-mt-20 rounded-2xl border border-gray-200 bg-white open:border-emerald-300"
            >
              <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                  {s.step}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-gray-900">{ASK[s.id][0]}</span>
                  <span className="block break-keep text-sm text-gray-500">{ASK[s.id][1]}</span>
                </span>
                <span aria-hidden className="shrink-0 text-gray-400 transition-transform group-open:rotate-90">›</span>
              </summary>

              <div className="border-t border-gray-100 px-4 pb-4">
                <p className="pt-3 text-xs font-medium text-emerald-700">
                  {s.step}단계 · {s.from} → {s.to} — 자주 겪는 문제
                </p>
                <ul className="divide-y divide-gray-100">
                  {s.bottlenecks.map((b) => (
                    <li key={b.title} className="py-3.5">
                      <h3 className="break-keep font-semibold text-gray-900">&ldquo;{b.title}&rdquo;</h3>
                      <p className="mt-1.5 break-keep text-[15px] leading-[1.7] text-gray-800">
                        <span className="mr-1 font-semibold text-emerald-700">→</span>
                        {b.todo}
                        <Basis kind={b.basis} />
                      </p>
                      <details className="group/e mt-1.5">
                        <summary className="cursor-pointer list-none text-xs text-gray-400 hover:text-gray-600 [&::-webkit-details-marker]:hidden">
                          <span aria-hidden className="inline-block transition-transform group-open/e:rotate-90">›</span> 근거
                        </summary>
                        <p className="mt-1 break-keep rounded-lg bg-gray-50 px-3 py-2 text-sm leading-relaxed text-gray-600">
                          {b.fact}{" "}
                          <a href={b.href} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-700 underline">
                            {b.cite} ↗
                          </a>
                        </p>
                      </details>
                    </li>
                  ))}
                </ul>

                <p className="mt-1 text-sm font-medium text-gray-700">이 단계에서 읽을 글</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {s.guides.map((g, i) => (
                    <Link
                      key={g.href}
                      href={g.href}
                      className={
                        i === 0
                          ? "rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                          : "rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-gray-300"
                      }
                    >
                      {g.label}
                    </Link>
                  ))}
                </div>

                <StageListButton stage={s.id} n={ARTICLES.filter((a) => a.stages === "all" || a.stages.includes(s.id)).length} />

                {s.next && (
                  <p className="mt-3 break-keep text-xs text-gray-500">
                    다음 단계로 넘어갈 때: {s.next} <span className="text-gray-400">(저희 기준)</span>
                  </p>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section id="pain" className="mt-10 scroll-mt-20">
        <h2 className="text-lg font-bold text-gray-900">어디가 아픈가요?</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {PAIN_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full border border-gray-200 bg-white px-3.5 py-2 text-[15px] text-gray-800 hover:border-emerald-400"
            >
              {l.label}
            </Link>
          ))}
        </div>
        {/* 안전 문장은 접지 않고 눈에 띄게 (council Steward 지적 — 회색 작은 글씨였다) */}
        <p className="mt-3 break-keep rounded-lg bg-red-50 px-3 py-2 text-sm text-red-900">
          걸음이 바뀔 만큼 아프거나, 쉬어도 아프거나, 붓고 열이 나면 <strong>달리기보다 진료가 먼저</strong>입니다.
        </p>
      </section>

      <section id="more" className="mt-10 scroll-mt-20">
        <h2 className="text-lg font-bold text-gray-900">이런 것도 찾나요?</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {MORE_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-[15px] text-gray-800 hover:border-emerald-400"
            >
              <span className="break-keep">{l.label}</span>
              <span aria-hidden className="text-gray-400">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="articles" className="mt-12 scroll-mt-20">
        <h2 className="mb-3 text-lg font-bold text-gray-900">전체 글</h2>
        <GuideArticleList />
      </section>

      {/* 초심자/중급자/숙련자라는 말을 계속 쓰는 글이 있어서, 그 말이 무엇을 뜻하는지 한곳에 적는다. 2026-10-13 접음 */}
      <section id="levels" className="mt-12 scroll-mt-20">
        <details className="group rounded-2xl border border-gray-200 bg-gray-50">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
            <h2 className="break-keep text-base font-bold text-gray-900">
              내 달리기량 점검 <span className="font-normal text-gray-500">— 너무 빨리 늘리고 있나요? 초보·중급·숙련 기준</span>
            </h2>
            <span aria-hidden className="text-gray-400 transition-transform group-open:rotate-90">›</span>
          </summary>
          <div className="px-4 pb-4">
            <LevelCheck />
            <p className="mt-6 text-sm font-semibold text-gray-900">기준표</p>
            <p className="mt-1 break-keep text-sm leading-relaxed text-gray-600">
              러닝 경력이나 거리로 수준을 나누는 <strong>공인된 분류는 없습니다.</strong> 가장 가까운 것은 신발 연구 전문가들이 합의
              과정에서 쓴 정의로, <strong>경력·횟수·주간 거리 세 가지</strong>를 함께 봅니다. 범위가 서로 겹치는 것도 그대로
              옮겼습니다.
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2 pr-3 font-medium">수준</th>
                    <th className="py-2 pr-3 font-medium">꾸준히 달린 기간</th>
                    <th className="py-2 pr-3 font-medium">주 횟수</th>
                    <th className="py-2 font-medium">주간 거리</th>
                  </tr>
                </thead>
                <tbody>
                  {HONERT_ROWS.map((r) => (
                    <tr key={r.level} className="border-t border-gray-200 text-gray-800">
                      <td className="whitespace-nowrap py-2 pr-3 font-semibold">{LEVEL_LABEL[r.level]}</td>
                      <td className="py-2 pr-3">{r.years}</td>
                      <td className="whitespace-nowrap py-2 pr-3">{r.sessions}</td>
                      <td className="whitespace-nowrap py-2">{r.km}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              「꾸준히」 = 주 1회 이상. 저희 초심자·중급자·숙련자 가이드는 각각 입문·레크리에이션·고수준 정의를 따릅니다.
              출처: {HONERT_CITE}{" "}
              <a href={HONERT_HREF} target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
                PubMed ↗
              </a>
            </p>
          </div>
        </details>
      </section>

      <div className="mt-10 rounded-2xl bg-emerald-50 p-6 text-center">
        <p className="mb-3 break-keep text-sm font-medium text-emerald-800">
          신발로 부상을 막는다는 근거는 약합니다. 다만 발볼·사이즈는 맞춰야 합니다
        </p>
        <Link
          href="/shoe-finder"
          className="inline-block rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          나에게 맞는 신발 찾기 →
        </Link>
        <p className="mt-3 text-xs text-emerald-700/70">추천 순서는 광고비로 바뀌지 않습니다</p>
      </div>
    </main>
  );
}
