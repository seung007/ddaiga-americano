import type { Metadata } from "next";
import Link from "next/link";
import { STAGES, HONERT_CITE, HONERT_HREF, HONERT_ROWS, LEVEL_LABEL } from "@/lib/guide/stages";
import StageFinder from "@/components/guide/StageFinder";
import GuideArticleList from "@/components/guide/GuideArticleList";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";

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
 */

export const metadata: Metadata = {
  title: "러닝 가이드 — 처음 30분부터 풀코스까지, 단계마다 막히는 곳 | 뛰다가 아메리카노",
  description:
    "달리기를 처음 시작해 30분을 뛰기까지, 그리고 10km·하프·풀코스로 넘어갈 때 사람들이 실제로 막히는 지점과 할 일을 논문 수치로 정리했습니다. 내 단계 찾기 포함.",
  alternates: { canonical: "/injury" },
};

export default function InjuryHubPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <BreadcrumbJsonLd trail={[["러닝 가이드", "/injury"]]} />

      <header className="mb-8">
        <p className="mb-2 text-sm font-medium text-emerald-600">훈련 · 주법 · 부상 · 회복</p>
        <h1 className="mb-3 text-3xl font-bold text-gray-900">러닝 가이드</h1>
        <p className="leading-relaxed text-gray-600">
          달리기는 체력보다 <strong>부상과 진도</strong>에서 더 자주 멈춥니다. 처음 30분을 뛰기까지, 그리고 10km·하프·풀코스로
          넘어갈 때마다 사람들이 실제로 막히는 지점과 할 일을 단계별로 모았습니다.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-500">
          <span className="text-emerald-600">✓</span>
          추천 순서는 광고비로 바뀌지 않습니다
        </div>
      </header>

      <section id="finder" className="mb-10 scroll-mt-20">
        <h2 className="mb-3 text-lg font-bold text-gray-900">내 단계 찾기</h2>
        <StageFinder />
      </section>

      <section id="stages" className="mb-10 scroll-mt-20">
        <h2 className="text-lg font-bold text-gray-900">단계마다 막히는 곳</h2>
        <p className="mt-1 text-sm leading-relaxed text-gray-500">
          숫자는 전부 링크한 논문의 초록 값입니다. 할 일 옆 <span className="font-medium text-gray-700">논문 결론</span>은
          논문이 직접 내린 결론, <span className="font-medium text-gray-700">경험칙</span>은 그 결과에서 이 사이트가 끌어낸 것입니다.
        </p>

        <ol className="mt-5 space-y-5">
          {STAGES.map((s) => (
            <li key={s.id} id={`stage-${s.id}`} className="scroll-mt-20 rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                  {s.step}
                </span>
                <h3 className="text-lg font-bold text-gray-900">
                  {s.from} → {s.to}
                </h3>
              </div>
              <p className="mt-2 text-sm text-gray-500">{s.who}</p>

              <ul className="mt-4 space-y-4">
                {s.bottlenecks.map((b) => (
                  <li key={b.title} className="border-l-2 border-gray-200 pl-3">
                    <p className="font-semibold text-gray-900">{b.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {b.fact}{" "}
                      <a
                        href={b.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-700 underline"
                      >
                        {b.cite} ↗
                      </a>
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-900">
                      <span className="mr-1 font-semibold text-emerald-700">할 일</span>
                      {b.todo}{" "}
                      <span className="ml-1 whitespace-nowrap rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-500">
                        {b.basis === "paper" ? "논문 결론" : "경험칙"}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
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

              {s.next && (
                <p className="mt-3 text-xs text-gray-500">
                  다음 단계로 넘어갈 신호 <span className="text-gray-400">(사이트 기준)</span>: {s.next}
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* 2026-10-07: 단계 카드가 「언제 무엇이 막히나」라면 이건 「도구 상자」. 사용자 요청으로 따로 분류했다. */}
      <section id="training" className="mb-10 scroll-mt-20">
        <h2 className="text-lg font-bold text-gray-900">훈련 방법</h2>
        <Link
          href="/injury/training-types"
          className="mt-3 block rounded-2xl border border-indigo-200 bg-indigo-50 p-5 transition-colors hover:border-indigo-300"
        >
          <p className="font-semibold text-gray-900">러닝 훈련 종류 한눈에 →</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">
            쉬었다 다시 달리기 · 걷기-달리기 · 쉬운 달리기 · 장거리 · 템포 · 인터벌 · 언덕 · 스트라이드 · 파틀렉 · 크로스 트레이닝 · 근력운동
          </p>
          <p className="mt-2 text-xs text-gray-500">훈련마다 무엇인지, 연구가 확인한 것, 하는 법, 몇 단계부터인지. 연구를 못 찾은 것도 그렇다고 적었습니다.</p>
        </Link>
      </section>

      <section id="articles" className="mb-10 scroll-mt-20">
        <h2 className="mb-3 text-lg font-bold text-gray-900">전체 글</h2>
        <GuideArticleList />
      </section>

      {/* 초심자/중급자/숙련자라는 말을 계속 쓰는 글이 있어서, 그 말이 무엇을 뜻하는지 한곳에 적는다. */}
      <section id="levels" className="mb-10 scroll-mt-20 rounded-2xl border border-gray-200 bg-gray-50 p-5">
        <h2 className="text-base font-bold text-gray-900">초보·중급·숙련은 무엇으로 나누나</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          러닝 경력이나 거리로 수준을 나누는 <strong>공인된 분류는 없습니다.</strong> 가장 가까운 것은 신발 연구 전문가들이
          합의 과정에서 쓴 정의로, 거리 하나가 아니라 <strong>경력·빈도·주간 거리 세 축</strong>을 함께 봅니다. 범위가
          서로 겹치는 것도 그대로 옮겼습니다.
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
          「꾸준히」 = 주 1회 이상. 이 사이트의 초심자·중급자·숙련자 가이드는 각각 입문·레크리에이션·고수준 정의를 따릅니다.
          출처: {HONERT_CITE}{" "}
          <a href={HONERT_HREF} target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
            PubMed ↗
          </a>
        </p>
      </section>

      <div className="rounded-2xl bg-emerald-50 p-6 text-center">
        <p className="mb-3 text-sm font-medium text-emerald-800">
          신발로 부상을 막는다는 근거는 약합니다. 다만 발볼·사이즈는 맞춰야 합니다
        </p>
        <Link
          href="/shoe-finder"
          className="inline-block rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          내 러닝화 찾기 →
        </Link>
      </div>
    </main>
  );
}
