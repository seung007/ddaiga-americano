"use client";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { useState } from "react";

const LEVELS = ["전체", "🟢 초심자", "🟡 중급자", "🔴 숙련자"] as const;
type Level = typeof LEVELS[number];

const LEVEL_GUIDES = [
  {
    href: "/injury/beginner-guide",
    level: "🟢 초심자",
    levelColor: "bg-green-100 text-green-700 border-green-200",
    title: "초심자 완전 가이드",
    desc: "0~6개월 · 주 15km 이하 · 10% 규칙·흔한 부상·기본 루틴",
  },
  {
    href: "/injury/intermediate-guide",
    level: "🟡 중급자",
    levelColor: "bg-amber-100 text-amber-700 border-amber-200",
    title: "중급자 가이드",
    desc: "6~24개월 · 주 15~40km · IT밴드·아킬레스·오버트레이닝",
  },
  {
    href: "/injury/advanced-guide",
    level: "🔴 숙련자",
    levelColor: "bg-red-100 text-red-700 border-red-200",
    title: "숙련자 가이드",
    desc: "2년+ · 주 40km+ · 피로골절·HRV·주기화 훈련",
  },
];

const ARTICLES = [
  { href: "/injury/it-band",    level: "🟡 중급자",  levelColor: "bg-amber-100 text-amber-700", tag: "무릎",    tagColor: "text-red-600 bg-red-50",     title: "장경인대염 초기 대처법 3가지",              desc: "달릴 때마다 무릎 바깥쪽이 아프다면? 초기에 잡는 방법.", readTime: "5분" },
  { href: "/injury/wide-foot",  level: "🟢 초심자",  levelColor: "bg-green-100 text-green-700", tag: "발볼",    tagColor: "text-blue-600 bg-blue-50",   title: "발볼 넓은 러너 와이드 규격 총정리",           desc: "2E·4E 규격이 필요한지 판단하는 방법과 브랜드별 옵션.", readTime: "4분" },
  { href: "/injury/achilles",   level: "🟡 중급자",  levelColor: "bg-amber-100 text-amber-700", tag: "아킬레스", tagColor: "text-orange-600 bg-orange-50", title: "미드풋 전환 후 아킬레스건·종아리 통증",        desc: "주법 바꾼 뒤 당긴다면 읽어보세요.", readTime: "4분" },
  { href: "/injury/knee-pain",  level: "🟢 초심자",  levelColor: "bg-green-100 text-green-700", tag: "무릎",    tagColor: "text-red-600 bg-red-50",     title: "러너 무릎(슬개대퇴 증후군) 예방법",           desc: "무릎 앞쪽이 계단 오를 때 아프다면 체크해야 할 것들.", readTime: "5분" },
  { href: "/injury/warmup",     level: "🟢 초심자",  levelColor: "bg-green-100 text-green-700", tag: "준비운동", tagColor: "text-green-600 bg-green-50",  title: "달리기 전 5분 동적 스트레칭 루틴",            desc: "정적 스트레칭이 아닌 동적 워밍업이 필요한 이유.", readTime: "4분" },
  { href: "/injury/cooldown",   level: "🟢 초심자",  levelColor: "bg-green-100 text-green-700", tag: "쿨다운",  tagColor: "text-teal-600 bg-teal-50",   title: "달리기 후 꼭 해야 할 10분 정적 스트레칭",      desc: "종아리·햄스트링·엉덩이까지 풀어주는 쿨다운 루틴.", readTime: "4분" },
  { href: "/injury/rest-day",   level: "🟡 중급자",  levelColor: "bg-amber-100 text-amber-700", tag: "회복",    tagColor: "text-indigo-600 bg-indigo-50","title": "휴식일에 뭘 해야 할까? 액티브 리커버리",     desc: "쉬는 날 완전히 누워 있는 것보다 가벼운 움직임이 회복을 빠르게 합니다.", readTime: "3분" },
  { href: "/injury/cadence",    level: "🔴 숙련자",  levelColor: "bg-red-100 text-red-700",     tag: "케이던스", tagColor: "text-purple-600 bg-purple-50","title": "케이던스 180은 거짓말? 키별 적정 기준값",  desc: "\"180 spm이 정답\"이라는 획일적 조언, 왜 틀렸는지 설명합니다.", readTime: "5분" },
  { href: "/injury/midfoot",    level: "🟡 중급자",  levelColor: "bg-amber-100 text-amber-700", tag: "착지법",  tagColor: "text-violet-600 bg-violet-50","title": "미드풋 착지, 무조건 좋은 게 아닌 이유",    desc: "힐스트라이크가 나쁜 게 아닙니다. 초보에게 맞는 착지법.", readTime: "5분" },
  { href: "/injury/posture",    level: "🟢 초심자",  levelColor: "bg-green-100 text-green-700", tag: "자세",    tagColor: "text-cyan-600 bg-cyan-50",   title: "달리기 자세 체크리스트 — 어깨·팔·시선",       desc: "상체 자세가 하체 부상에 영향을 준다는 사실, 알고 계셨나요?", readTime: "4분" },
  { href: "/injury/hwang-young-jo", level: "🔴 숙련자", levelColor: "bg-red-100 text-red-700", tag: "황영조", tagColor: "text-yellow-700 bg-yellow-50", title: "황영조의 달리기 철학 — 고통을 읽는 것",       desc: "1992 바르셀로나 금메달리스트의 훈련 철학.", readTime: "6분" },
  { href: "/injury/kwon-eun-ju", level: "🔴 숙련자", levelColor: "bg-red-100 text-red-700",    tag: "권은주", tagColor: "text-pink-600 bg-pink-50",   title: "권은주 선수에게 배우는 여성 러너 부상 예방",   desc: "한국 여자 마라톤을 이끌어온 권은주 선수의 훈련 방식.", readTime: "6분" },
  { href: "/injury/first-10k",  level: "🟢 초심자",  levelColor: "bg-green-100 text-green-700", tag: "첫 대회", tagColor: "text-emerald-600 bg-emerald-50","title": "생애 첫 10km 대회 준비물과 페이스 전략",  desc: "출발선에 서기 전에 알아야 할 것들.", readTime: "7분" },
];

export default function InjuryListPage() {
  const [activeLevel, setActiveLevel] = useState<Level>("전체");

  const filtered = activeLevel === "전체"
    ? ARTICLES
    : ARTICLES.filter(a => a.level === activeLevel);

  return (
    <>
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-8">
          <p className="text-sm font-medium text-emerald-600 mb-2">부상 예방 · 스트레칭 · 주법 · 런닝 이야기</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">달리다가 아프지 않으려면</h1>
          <p className="text-gray-600 leading-relaxed">
            러닝 부상의 79%는 과훈련이 원인입니다(van Gent 2007). 
            경력 단계에 맞는 정보를 선택하세요.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            광고·협찬 없이 공적 정보와 의학적 근거만으로 작성
          </div>
        </header>

        {/* 레벨별 가이드 카드 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-700 mb-3">내 레벨 가이드 바로가기</h2>
          <div className="grid grid-cols-3 gap-3">
            {LEVEL_GUIDES.map(g => (
              <Link key={g.href} href={g.href}
                className="flex flex-col gap-1.5 p-4 rounded-2xl border hover:shadow-md transition-all bg-white">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full self-start border ${g.levelColor}`}>
                  {g.level}
                </span>
                <p className="font-semibold text-sm text-gray-900">{g.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{g.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 레벨 필터 */}
        <section className="mb-6">
          <div className="flex gap-2 flex-wrap">
            {LEVELS.map(lv => (
              <button key={lv} onClick={() => setActiveLevel(lv)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors
                  ${activeLevel === lv
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
                {lv}
              </button>
            ))}
          </div>
        </section>

        {/* 아티클 목록 */}
        <section className="mb-10">
          <ul className="flex flex-col gap-3">
            {filtered.map(a => (
              <li key={a.href}>
                <Link href={a.href}
                  className="flex items-start justify-between gap-4 bg-white border border-gray-100 rounded-xl p-5 hover:border-emerald-300 hover:shadow-sm transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${a.tagColor}`}>
                        {a.tag}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${a.levelColor}`}>
                        {a.level}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 leading-snug mb-1">{a.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{a.desc}</p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-400 mt-1 whitespace-nowrap">{a.readTime}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="p-6 bg-emerald-50 rounded-2xl text-center">
          <p className="text-sm text-emerald-800 mb-3 font-medium">부상 예방의 절반은 내 발에 맞는 신발입니다</p>
          <Link href="/shoe-finder"
            className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            내 러닝화 찾기 →
          </Link>
        </div>
      </main>
    </>
  );
}
