"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import FeedbackForm from "@/components/FeedbackForm";
import { recommendShoes, getMinCushioning } from "@/lib/shoes/recommend";
import { BODY_TYPE_LABEL, KR_AVAILABILITY_LABEL } from "@/lib/shoes/types";
import type { FootType, FootWidth, Gender, InjuryArea, Recommendation, RunDistance, RunnerLevel, Shoe, ShoeUse } from "@/lib/shoes/types";

// ── 범위 선택 옵션 (Malisoux 2013 / Heiderscheit 2011 체형 8분류 기반) ──────────
type HeightRange = "small" | "mid" | "tall";
type WeightRange = "very_light" | "light" | "mid_w" | "heavy";

const HEIGHT_OPTIONS: { value: HeightRange; label: string; cm: number; desc: string }[] = [
  { value: "small", label: "163cm 이하", cm: 160, desc: "발이 땅에 닿는 느낌 살리는 신발이 잘 맞아요" },
  { value: "mid",   label: "164 – 177cm", cm: 171, desc: "균형 잡힌 쿠션과 반응성" },
  { value: "tall",  label: "178cm 이상", cm: 182, desc: "충격 흡수가 우선인 신발" },
];

const WEIGHT_OPTIONS: Record<HeightRange, { value: WeightRange; label: string; kg: number; desc: string }[]> = {
  small: [
    { value: "very_light", label: "50kg 미만", kg: 45,  desc: "정말 가벼운 쿠션으로도 충분해요" },
    { value: "light",      label: "50 – 55kg", kg: 52,  desc: "가벼운 쿠션으로 충분해요" },
    { value: "mid_w",      label: "56 – 75kg", kg: 65,  desc: "중간 쿠션이 딱 맞아요" },
    { value: "heavy",      label: "76kg 이상", kg: 82,  desc: "두꺼운 쿠션이 무릎을 지켜줘요" },
  ],
  mid: [
    { value: "very_light", label: "50kg 미만", kg: 46,  desc: "정말 가벼운 쿠션으로도 충분해요" },
    { value: "light",      label: "50 – 60kg", kg: 55,  desc: "가벼운 쿠션으로 충분해요" },
    { value: "mid_w",      label: "61 – 80kg", kg: 70,  desc: "중간 쿠션이 딱 맞아요" },
    { value: "heavy",      label: "81kg 이상", kg: 87,  desc: "두꺼운 쿠션이 무릎을 지켜줘요" },
  ],
  tall: [
    { value: "light", label: "85kg 이하", kg: 77,  desc: "두꺼운 쿠션이 필요해요" },
    { value: "heavy", label: "86kg 이상", kg: 93,  desc: "맥스 쿠션으로 무릎을 보호해요" },
  ],
};

const FOOT_OPTIONS: { id: string; category: "width" | "type"; label: string; desc: string; width?: FootWidth; footType?: FootType }[] = [
  { id: "narrow",     category: "width", label: "좁은 발볼",       desc: "신발이 항상 헐렁한 편",             width: "narrow" },
  { id: "normal",     category: "width", label: "보통 발볼",       desc: "대부분의 신발이 잘 맞아요",           width: "normal" },
  { id: "wide",       category: "width", label: "넓은 발볼 2E/4E", desc: "신발 옆이 자주 눌리거나 물집 생겨요", width: "wide" },
  { id: "flat",       category: "type",  label: "평발",            desc: "발이 안쪽으로 쏠리는 편이에요",       footType: "flat" },
  { id: "neutral",    category: "type",  label: "중립 아치",       desc: "특별한 지지대 없어도 괜찮아요",       footType: "neutral" },
  { id: "high_arch",  category: "type",  label: "높은 아치",       desc: "발바닥 가운데가 뜨는 편이에요",       footType: "high_arch" },
];

const USES: { value: ShoeUse; label: string }[] = [
  { value: "daily",  label: "데일리 (매일 달리기)" },
  { value: "long",   label: "장거리 (하프·풀 마라톤)" },
  { value: "tempo",  label: "템포 / 인터벌" },
  { value: "racing", label: "레이싱 (기록 단축)" },
];

const USE_LABEL: Record<ShoeUse, string> = { daily: "데일리", long: "장거리", tempo: "템포", racing: "레이싱" };
const STABILITY_LABEL = { neutral: "중립", stability: "안정화", motion_control: "모션컨트롤" } as const;
const CUSH_DOTS = ["", "●○○○○", "●●○○○", "●●●○○", "●●●●○", "●●●●●"] as const;

// ── PRD F-01 추가 문항 옵션 ────────────────────────────────────────
const BUDGETS: { value: number; label: string }[] = [
  { value: 0,      label: "상관없음" },
  { value: 150000, label: "15만원 이하" },
  { value: 200000, label: "20만원 이하" },
  { value: 250000, label: "25만원 이하" },
];

// ── PRD F-01 추가 문항: 경험 · 주간 거리 · 부상 이력 ──────────────
const LEVEL_OPTIONS: { value: RunnerLevel; label: string; desc: string }[] = [
  { value: "beginner",     label: "입문",  desc: "달리기 시작 6개월 미만" },
  { value: "intermediate", label: "중급",  desc: "6개월 ~ 2년 정도" },
  { value: "advanced",     label: "숙련",  desc: "2년 이상 · 대회 경험" },
];

const DISTANCE_OPTIONS: { value: RunDistance; label: string; desc: string }[] = [
  { value: "short", label: "주 10km 미만",  desc: "가볍게 달려요" },
  { value: "mid",   label: "주 10 – 30km", desc: "꾸준히 달려요" },
  { value: "long",  label: "주 30km 이상",  desc: "많이 달려요" },
];

const INJURY_OPTIONS: { value: InjuryArea; label: string; desc: string }[] = [
  { value: "none",     label: "없음",            desc: "다친 적 없어요" },
  { value: "knee",     label: "무릎",            desc: "무릎 앞·바깥쪽 통증" },
  { value: "ankle",    label: "발목",            desc: "접질림 · 불안정한 느낌" },
  { value: "achilles", label: "아킬레스·종아리", desc: "뒤꿈치 위쪽이 당김" },
  { value: "plantar",  label: "족저근막",        desc: "아침 첫발에 발바닥 통증" },
];

type SortKey = "score" | "price_asc" | "price_desc";

const TOTAL_STEPS = 8;
const STEP_LABELS = ["예산", "성별", "키", "체중", "발 특성", "경험·거리", "부상 이력", "용도"];
const STEP_MICROCOPY = [
  "예산이 어느 정도예요?",
  "성별을 알려주시면 발형에 맞게 추천해드려요",
  "키가 어떻게 되세요?",
  "체중도 알려주세요 — 쿠션 두께가 달라져요",
  "내 발 특성이 어때요?",
  "달린 지 얼마나 됐어요?",
  "달리다 다쳐본 적 있어요?",
  "달리기 목표가 뭔가요?",
];

// ── 재방문 · 공유: 프로필 저장/복원 ─────────────────────────────
const STORAGE_KEY = "ddaiga:lastProfile";

type SavedProfile = {
  g: string; h: string; w: string; f: string[]; u: string; b: number;
  lv: string; d: string; inj: string[]; t: number;
};

// GA4 이벤트 헬퍼 — 퍼널 추적용 (gtag 없으면 무시)
function gtagEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof g === "function") g("event", name, params);
}

export default function ShoeFinderPage() {
  const [gender,    setGender]    = useState<Gender | "">("");
  const [heightRange, setHeightRange] = useState<HeightRange | "">("");
  const [weightRange, setWeightRange] = useState<WeightRange | "">("");
  const [footSelections, setFootSelections] = useState<string[]>([]);
  const [use,       setUse]       = useState<ShoeUse | "">("");
  const [budget,    setBudget]    = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortKey,   setSortKey]   = useState<SortKey>("score");
  const [error,     setError]     = useState("");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [level,     setLevel]     = useState<RunnerLevel | "">("");
  const [distance,  setDistance]  = useState<RunDistance | "">("");
  const [injuries,  setInjuries]  = useState<InjuryArea[]>([]);
  const [savedProfile, setSavedProfile] = useState<SavedProfile | null>(null);

  function goNext() { setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS - 1)); }
  function goPrev() { setCurrentStep(s => Math.max(s - 1, 0)); }

  // 저장된 프로필을 상태에 적용 (공유 URL · 지난 추천 다시보기 공용)
  function applyProfile(p: SavedProfile, submit: boolean) {
    const h = HEIGHT_OPTIONS.find(o => o.value === p.h)?.value;
    if (!h) return;
    const w = WEIGHT_OPTIONS[h].find(o => o.value === p.w)?.value;
    if (!w) return;
    setHeightRange(h);
    setWeightRange(w);
    setGender(p.g === "male" || p.g === "female" ? (p.g as Gender) : "");
    setFootSelections((p.f ?? []).filter(id => FOOT_OPTIONS.some(o => o.id === id)));
    setUse(USES.some(o => o.value === p.u) ? (p.u as ShoeUse) : "");
    setBudget(BUDGETS.some(o => o.value === p.b) ? p.b : 0);
    setLevel(LEVEL_OPTIONS.some(o => o.value === p.lv) ? (p.lv as RunnerLevel) : "");
    setDistance(DISTANCE_OPTIONS.some(o => o.value === p.d) ? (p.d as RunDistance) : "");
    setInjuries((p.inj ?? []).filter((i): i is InjuryArea => INJURY_OPTIONS.some(o => o.value === i)));
    if (submit) setSubmitted(true);
  }

  // 마운트 시: ① 공유 URL 파라미터 복원 ② localStorage 지난 추천 확인
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("h") && sp.get("w")) {
        applyProfile({
          g: sp.get("g") ?? "", h: sp.get("h")!, w: sp.get("w")!,
          f: (sp.get("f") ?? "").split(",").filter(Boolean),
          u: sp.get("u") ?? "", b: Number(sp.get("b") ?? 0) || 0,
          lv: sp.get("lv") ?? "", d: sp.get("d") ?? "",
          inj: (sp.get("inj") ?? "").split(",").filter(Boolean), t: 0,
        }, true);
        return;
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSavedProfile(JSON.parse(raw) as SavedProfile);
    } catch { /* 손상된 데이터는 무시 */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function currentProfileForSave(): SavedProfile {
    return {
      g: gender, h: heightRange, w: weightRange, f: footSelections,
      u: use, b: budget, lv: level, d: distance, inj: injuries, t: Date.now(),
    };
  }

  function buildShareUrl(): string {
    const p = currentProfileForSave();
    const sp = new URLSearchParams();
    if (p.g) sp.set("g", p.g);
    sp.set("h", p.h); sp.set("w", p.w);
    if (p.f.length) sp.set("f", p.f.join(","));
    if (p.u) sp.set("u", p.u);
    if (p.b) sp.set("b", String(p.b));
    if (p.lv) sp.set("lv", p.lv);
    if (p.d) sp.set("d", p.d);
    if (p.inj.length) sp.set("inj", p.inj.join(","));
    return `${window.location.origin}/shoe-finder?${sp.toString()}`;
  }

  function toggleCompare(id: string) {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length < 2) {
        gtagEvent("compare_add", { shoe_id: id });
        return [...prev, id];
      }
      return prev;
    });
  }

  const weightKg = heightRange && weightRange
    ? WEIGHT_OPTIONS[heightRange].find(o => o.value === weightRange)!.kg
    : null;
  const heightCm = heightRange
    ? HEIGHT_OPTIONS.find(o => o.value === heightRange)!.cm
    : null;

  const selectedWidth = FOOT_OPTIONS.find(o => o.category === "width" && footSelections.includes(o.id))?.width ?? "normal";
  const selectedType  = FOOT_OPTIONS.find(o => o.category === "type"  && footSelections.includes(o.id))?.footType ?? "neutral";

  const result = useMemo(() => {
    if (!submitted || !weightKg || !heightCm) return null;
    return recommendShoes({
      weightKg, heightCm, footWidth: selectedWidth, footType: selectedType,
      use: use || undefined,
      gender: gender || undefined,
      budgetKrw: budget || undefined,
      level: level || undefined,
      distance: distance || undefined,
      injuryHistory: injuries.length ? injuries : undefined,
    });
  }, [submitted, weightKg, heightCm, selectedWidth, selectedType, use, gender, budget, level, distance, injuries]);

  const sortedPrimary = useMemo(() => {
    if (!result) return [];
    const arr = [...result.primary];
    if (sortKey === "price_asc") arr.sort((a, b) => a.shoe.priceKrw - b.shoe.priceKrw);
    else if (sortKey === "price_desc") arr.sort((a, b) => b.shoe.priceKrw - a.shoe.priceKrw);
    else arr.sort((a, b) => b.score - a.score);
    return arr;
  }, [result, sortKey]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!heightRange) { setError("키를 먼저 골라주세요!"); return; }
    if (!weightRange) { setError("체중도 골라주세요!"); return; }
    if (!use) { setError("달리기 목적을 골라주세요!"); return; }
    setError("");
    setSubmitted(true);
    setExpandedId(null);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentProfileForSave()));
    } catch { /* 저장 실패는 무시 */ }
    if (typeof window !== "undefined" && typeof (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag === "function") {
      (window as unknown as { gtag: (...a: unknown[]) => void }).gtag("event", "recommend_form_complete", {
        gender: gender || "unset",
        level: level || "unset",
      });
    }
  }

  function handleChange() {
    setSubmitted(false);
    setError("");
  }

  function handleReset() {
    setSubmitted(false);
    setError("");
    setCurrentStep(0);
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 py-12 text-gray-900">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">내 발에 맞는 러닝화 찾기</h1>
          <p className="mt-1.5 text-gray-500 text-sm leading-relaxed">
            내 체형에 맞는 신발, 1분이면 찾아드려요.
          </p>
        </header>

        {!submitted && savedProfile && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-sm text-emerald-800">
              🕐 지난번에 받은 추천이 있어요 — 입력 없이 바로 다시 볼 수 있어요.
            </p>
            <div className="flex shrink-0 gap-2">
              <button type="button"
                onClick={() => { applyProfile(savedProfile, true); setSavedProfile(null); }}
                className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors">
                다시 보기 →
              </button>
              <button type="button"
                onClick={() => { setSavedProfile(null); try { localStorage.removeItem(STORAGE_KEY); } catch {} }}
                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5 transition-colors">
                지우기
              </button>
            </div>
          </div>
        )}

        {!submitted && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1.5 items-center">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
                  i < currentStep ? "w-5 bg-emerald-500" :
                  i === currentStep ? "w-7 bg-emerald-500" :
                  "w-5 bg-gray-200"
                }`} />
              ))}
            </div>
            <span className="text-xs text-gray-400">
              <span className="font-semibold text-gray-700">{currentStep + 1}</span> / {TOTAL_STEPS}
            </span>
          </div>
        )}

        {submitted && result && (
          <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
            <button type="button" onClick={handleReset}
              className="text-emerald-600 font-medium hover:text-emerald-700 underline underline-offset-2">
              ← 조건 다시 고르기
            </button>
            <ShareResultButton buildUrl={buildShareUrl} />
          </div>
        )}

        {!submitted && (
        <form onSubmit={handleSubmit} noValidate
          className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white shadow-sm p-6">

          {!submitted && (
            <p className="text-base font-semibold text-gray-800 -mb-1">
              {STEP_MICROCOPY[currentStep]}
            </p>
          )}

          {/* ── STEP 0: 예산 ── */}
          {currentStep === 0 && (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                {BUDGETS.map(o => (
                  <button key={o.value} type="button"
                    onClick={() => { setBudget(o.value); handleChange(); }}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-colors text-left
                      ${budget === o.value ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100 text-gray-900" : "border-gray-200 bg-white hover:border-gray-300 text-gray-600"}`}>
                    {o.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">선택 안 해도 괜찮아요 — 그냥 넘어가도 됩니다.</p>
            </div>
          )}

          {/* ── STEP 1: 성별 ── */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                {([
                  { value: "male" as Gender,   label: "🚹 남성", desc: "남성 발형 기준으로 추천해요" },
                  { value: "female" as Gender, label: "🚺 여성", desc: "여성 전용 라스트 신발 우선 추천해요" },
                ]).map(g => (
                  <button key={g.value} type="button"
                    onClick={() => { setGender(prev => prev === g.value ? "" : g.value); handleChange(); }}
                    className={`flex-1 flex flex-col items-start gap-0.5 px-4 py-3 rounded-xl border text-left transition-colors
                      ${gender === g.value ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                    <span className="font-semibold text-sm text-gray-900">{g.label}</span>
                    <span className="text-xs text-gray-500">{g.desc}</span>
                  </button>
                ))}
              </div>
              <button type="button"
                onClick={() => { setGender(""); handleChange(); }}
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors text-left
                  ${gender === "" ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100 font-semibold text-gray-900" : "border-gray-200 bg-white hover:border-gray-300 text-gray-500"}`}>
                선택 안 함
              </button>
              <p className="text-xs text-gray-400 mt-1">선택 안 해도 추천 받을 수 있어요.</p>
            </div>
          )}

          {/* ── STEP 2: 키 ── */}
          {currentStep === 2 && (
            <div className="grid grid-cols-3 gap-2">
              {HEIGHT_OPTIONS.map(o => (
                <button key={o.value} type="button"
                  onClick={() => { setHeightRange(o.value); setWeightRange(""); handleChange(); }}
                  className={`flex flex-col items-start gap-0.5 px-4 py-3 rounded-xl border text-left transition-colors
                    ${heightRange === o.value ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                  <span className="font-semibold text-sm text-gray-900">{o.label}</span>
                  <span className="text-xs text-gray-500 leading-snug">{o.desc}</span>
                </button>
              ))}
            </div>
          )}

          {/* ── STEP 3: 체중 ── */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-2">
              {!heightRange ? (
                <p className="text-sm text-amber-600">키를 먼저 골라주세요!</p>
              ) : (
                <div className={`grid gap-2 ${WEIGHT_OPTIONS[heightRange].length <= 2 ? "grid-cols-2" : "grid-cols-2"}`}>
                  {WEIGHT_OPTIONS[heightRange].map(o => (
                    <button key={o.value} type="button"
                      onClick={() => { setWeightRange(o.value); handleChange(); }}
                      className={`flex flex-col items-start gap-0.5 px-4 py-3 rounded-xl border text-left transition-colors
                        ${weightRange === o.value ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                      <span className="font-semibold text-sm text-gray-900">{o.label}</span>
                      <span className="text-xs text-gray-500 leading-snug">{o.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 4: 발 특성 ── */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-2">
                {FOOT_OPTIONS.map(o => {
                  const active = footSelections.includes(o.id);
                  return (
                    <button key={o.id} type="button"
                      onClick={() => {
                        handleChange();
                        setFootSelections(prev => {
                          if (prev.includes(o.id)) return prev.filter(id => id !== o.id);
                          const filtered = prev.filter(id => FOOT_OPTIONS.find(x => x.id === id)?.category !== o.category);
                          return [...filtered, o.id];
                        });
                      }}
                      className={`flex flex-col items-start gap-0.5 px-4 py-3 rounded-xl border text-left transition-colors
                        ${active ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                      <span className={`font-semibold text-sm ${active ? "text-emerald-700" : "text-gray-900"}`}>{o.label}</span>
                      <span className="text-xs text-gray-500 leading-snug">{o.desc}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400">발볼이랑 발 모양 각각 하나씩 고르면 더 잘 맞는 신발을 찾아드려요.</p>
              <p className="text-xs text-gray-400">선택 안 해도 추천 받을 수 있어요.</p>
            </div>
          )}

          {/* ── STEP 5: 경험 · 주간 거리 (PRD F-01) ── */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-2">
                {LEVEL_OPTIONS.map(o => (
                  <button key={o.value} type="button"
                    onClick={() => { setLevel(prev => prev === o.value ? "" : o.value); handleChange(); }}
                    className={`flex flex-col items-start gap-0.5 px-4 py-3 rounded-xl border text-left transition-colors
                      ${level === o.value ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                    <span className={`font-semibold text-sm ${level === o.value ? "text-emerald-700" : "text-gray-900"}`}>{o.label}</span>
                    <span className="text-xs text-gray-500 leading-snug">{o.desc}</span>
                  </button>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">일주일에 얼마나 달려요?</p>
                <div className="grid grid-cols-3 gap-2">
                  {DISTANCE_OPTIONS.map(o => (
                    <button key={o.value} type="button"
                      onClick={() => { setDistance(prev => prev === o.value ? "" : o.value); handleChange(); }}
                      className={`flex flex-col items-start gap-0.5 px-4 py-3 rounded-xl border text-left transition-colors
                        ${distance === o.value ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                      <span className={`font-semibold text-sm ${distance === o.value ? "text-emerald-700" : "text-gray-900"}`}>{o.label}</span>
                      <span className="text-xs text-gray-500 leading-snug">{o.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400 -mt-1">선택 안 해도 추천 받을 수 있어요. 입문이면 부상 위험이 큰 레이싱화를 빼드려요.</p>
            </div>
          )}

          {/* ── STEP 6: 부상 이력 (PRD F-01) ── */}
          {currentStep === 6 && (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {INJURY_OPTIONS.map(o => {
                  const active = injuries.includes(o.value);
                  return (
                    <button key={o.value} type="button"
                      onClick={() => {
                        handleChange();
                        setInjuries(prev => {
                          if (prev.includes(o.value)) return prev.filter(i => i !== o.value);
                          if (o.value === "none") return ["none"];
                          return [...prev.filter(i => i !== "none"), o.value];
                        });
                      }}
                      className={`flex flex-col items-start gap-0.5 px-4 py-3 rounded-xl border text-left transition-colors
                        ${active ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                      <span className={`font-semibold text-sm ${active ? "text-emerald-700" : "text-gray-900"}`}>{o.label}</span>
                      <span className="text-xs text-gray-500 leading-snug">{o.desc}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-1">여러 개 골라도 돼요. 다친 부위에 부담이 덜한 신발을 우선 추천해드려요.</p>
              <p className="text-xs text-gray-400">※ 참고용이에요. 지금 아프다면 신발보다 병원 진료가 먼저예요.</p>
            </div>
          )}

          {/* ── STEP 7: 용도 + 추천 받기 ── */}
          {currentStep === 7 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {([
                  { value: "daily" as ShoeUse,   label: "데일리",      desc: "매일 달리기 · 처음 시작이라면 이걸로!" },
                  { value: "long" as ShoeUse,    label: "장거리",      desc: "하프·풀 마라톤 준비 중" },
                  { value: "tempo" as ShoeUse,   label: "템포·인터벌", desc: "빠른 훈련이 주목적" },
                  { value: "racing" as ShoeUse,  label: "레이싱",      desc: "기록 단축이 목표예요" },
                ]).map(o => (
                  <button key={o.value} type="button"
                    onClick={() => { setUse(o.value); handleChange(); }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-colors
                      ${use === o.value ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                    <span className={`font-semibold text-sm ${use === o.value ? "text-emerald-700" : "text-gray-900"}`}>{o.label}</span>
                    <span className="text-xs text-gray-400">{o.desc}</span>
                  </button>
                ))}
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button type="submit"
                className="w-full rounded-xl bg-emerald-600 px-5 py-3.5 font-semibold text-white hover:bg-emerald-700 transition-colors text-base">
                내 러닝화 찾기 →
              </button>

              <p className="text-center text-[11px] text-gray-400 leading-relaxed -mt-1">
                키·체중·발 정보는 <strong className="font-medium text-gray-500">추천 계산에만</strong> 쓰이고 브라우저에서만 처리되며 서버에 저장되지 않아요.{" "}
                「내 러닝화 찾기」를 누르면{" "}
                <a href="/privacy" className="underline hover:text-gray-600">개인정보 처리방침</a>에 동의하는 것으로 간주합니다.
              </p>
            </div>
          )}

          {/* ── 이전 / 다음 버튼 ── */}
          {!submitted && (
            <div className="flex gap-2 mt-1">
              {currentStep > 0 && (
                <button type="button" onClick={goPrev}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
                  ← 이전
                </button>
              )}
              {currentStep < TOTAL_STEPS - 1 && (
                <button type="button" onClick={() => {
                  if (currentStep === 2 && !heightRange) { setError("키를 먼저 골라주세요!"); return; }
                  if (currentStep === 3 && !weightRange) { setError("체중도 골라주세요!"); return; }
                  setError("");
                  goNext();
                }}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors">
                  다음 →
                </button>
              )}
            </div>
          )}
        </form>
        )}

        {/* 결과 */}
        {result && weightKg && heightCm && (
          <section className="mt-10">

            <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">🔎</span>
                <h3 className="text-sm font-bold text-blue-900">내 분석 결과</h3>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span className="text-xs font-semibold text-blue-800 bg-white border border-blue-200 px-2.5 py-1 rounded-full">
                  내 체형 · {BODY_TYPE_LABEL[result.bodyType]}
                </span>
                <span className="text-xs font-semibold text-blue-800 bg-white border border-blue-200 px-2.5 py-1 rounded-full">
                  추천 쿠션 · 5단계 중 {getMinCushioning(weightKg)}단계 이상
                </span>
                <span className="text-xs font-semibold text-blue-800 bg-white border border-blue-200 px-2.5 py-1 rounded-full">
                  권장 케이던스 · {result.cadenceSpm[0]}~{result.cadenceSpm[1]} spm
                </span>
              </div>

              <p className="text-[11px] text-blue-600/80 leading-relaxed mb-2.5">
                케이던스 = 1분에 내딛는 걸음 수. 키 {heightCm}cm 기준 분당 {result.cadenceSpm[0]}~{result.cadenceSpm[1]}걸음 리듬이 무릎 충격을 줄여줘요.{" "}
                <a href="/injury/cadence" className="underline hover:text-blue-800">케이던스 맞추는 법 →</a>
              </p>

              {result.profileComment && (
                <p className="text-[15px] text-blue-900 leading-relaxed">{result.profileComment}</p>
              )}

              {result.evidenceNote && (
                <p className="mt-2.5 pt-2.5 border-t border-blue-200/70 text-[11px] text-blue-500 leading-relaxed">
                  {result.evidenceNote}
                </p>
              )}
            </div>

            {result.usedFallback && (
              <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                ⚠️ {result.fallbackNote}
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">내 조건에 맞는 신발</h2>
                <p className="text-xs text-gray-400 mt-0.5">수십 개 중 딱 {result.primary.length}개만 골랐어요 — 내 키·체중·발볼 조건을 통과한 결과예요.</p>
              </div>
              <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
                {([
                  { key: "score" as SortKey,      label: "적합도순" },
                  { key: "price_asc" as SortKey,  label: "가격 낮은순" },
                  { key: "price_desc" as SortKey, label: "가격 높은순" },
                ] as { key: SortKey; label: string }[]).map(o => (
                  <button key={o.key} type="button" onClick={() => setSortKey(o.key)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                      ${sortKey === o.key ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {sortedPrimary.length >= 2 && compareIds.length === 0 && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 mb-4">
                <span className="text-emerald-600 text-base">⚖️</span>
                <p className="text-sm text-emerald-700">
                  각 카드 오른쪽 위 <strong>「비교」</strong> 버튼을 눌러 두 신발을 나란히 비교할 수 있어요.
                </p>
              </div>
            )}

            <ul className="flex flex-col gap-4">
              {sortedPrimary.map((rec, i) => (
                <ShoeCard key={rec.shoe.id} rec={rec} rank={i + 1}
                  expanded={expandedId === rec.shoe.id}
                  onToggle={() => setExpandedId(expandedId === rec.shoe.id ? null : rec.shoe.id)}
                  inCompare={compareIds.includes(rec.shoe.id)}
                  canAddCompare={compareIds.length < 2 || compareIds.includes(rec.shoe.id)}
                  onToggleCompare={() => toggleCompare(rec.shoe.id)} />
              ))}
            </ul>

            {compareIds.length > 0 && (
              <ComparePanel
                compareIds={compareIds}
                shoes={sortedPrimary.filter(r => compareIds.includes(r.shoe.id)).map(r => r.shoe)}
                onClear={() => setCompareIds([])}
                userWidth={selectedWidth}
                userFootType={selectedType}
              />
            )}

            <RelatedGuides footType={selectedType} footWidth={selectedWidth} use={use} />

            <FeedbackForm
              shoeIds={result.primary.map((r) => r.shoe.id)}
              bodyType={result.bodyType}
            />

            <p className="mt-10 text-xs text-gray-400 leading-relaxed">
              ※ 이 추천은 <span className="font-medium text-gray-500">참고용 정보</span>예요. 같은 신발도 달리는 페이스나 착지법에 따라 체감이 달라질 수 있으니, 최종 선택은 직접 신어보고 결정하세요. 의료 진단·전문 피팅을 대체하지 않으며, 통증·기저 질환이 있다면 전문 의료인과 상담 후 고르세요.{" "}
              <a href="/terms" className="underline hover:text-gray-600">자세한 고지 →</a>
            </p>
          </section>
        )}
      </main>
    </>
  );
}

function ShoeCard({ rec, rank, expanded, onToggle, inCompare, canAddCompare, onToggleCompare }: {
  rec: Recommendation; rank: number; expanded: boolean; onToggle: () => void;
  inCompare: boolean; canAddCompare: boolean; onToggleCompare: () => void;
}) {
  const { shoe, score, reasons } = rec;

  return (
    <li className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex gap-4">
          <div className="shrink-0 w-24 h-24 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shoe.imageUrl}
              alt={`${shoe.brand} ${shoe.model}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `https://placehold.co/96x96/f3f4f6/9ca3af?text=${encodeURIComponent(shoe.brand)}`;
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-bold text-gray-400">#{rank}</span>
                  {rec.bodyTypeMatch && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">내 체형 최적</span>}
                  {shoe.genderFit === "womens_last" && <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">👟 여성 전용 라스트</span>}
                  {rec.isFallback && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">근접 추천</span>}
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">{shoe.brand} {shoe.model}</h3>
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{shoe.blurb}</p>
              </div>
              <div className="shrink-0 text-right flex flex-col items-end gap-1.5">
                <div className="text-3xl font-bold tabular-nums text-emerald-600">{score}</div>
                <div className="text-xs text-gray-400">적합도</div>
                <button
                  onClick={onToggleCompare}
                  disabled={!canAddCompare}
                  className={
                    `text-sm font-semibold px-3 py-1.5 rounded-lg border-2 transition-colors ${
                      inCompare
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : canAddCompare
                        ? "border-emerald-400 bg-white text-emerald-600 hover:bg-emerald-50"
                        : "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed"
                    }`
                  }
                >
                  {inCompare ? "✓ 비교중" : "⚖️ 비교"}
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {[
                `쿠션 ${CUSH_DOTS[shoe.cushioning]}`,
                STABILITY_LABEL[shoe.stability],
                `드롭 ${shoe.heelDropMm}mm`,
                `${shoe.weightGramsM9}g`,
                `폭 ${shoe.widthOptions.join("·")}`,
                shoe.uses.map(u => USE_LABEL[u]).join("·"),
              ].map((t, i) => <Tag key={i}>{t}</Tag>)}
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="text-base font-bold text-gray-900">
                  약 {shoe.priceKrw.toLocaleString()}원
                </span>
                <span className="text-xs text-gray-400">(${shoe.priceUsd} · 2026-06-01 추산)</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ml-auto
                  ${shoe.krAvailability === "kr_official" ? "bg-emerald-100 text-emerald-700" :
                    shoe.krAvailability === "kr_parallel" ? "bg-blue-100 text-blue-700" :
                    "bg-orange-100 text-orange-700"}`}>
                  {KR_AVAILABILITY_LABEL[shoe.krAvailability]}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {shoe.buyLinks.map(link => (
                  <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                    onClick={() => gtagEvent("buy_link_click", { shoe: `${shoe.brand} ${shoe.model}`, store: link.label })}
                    className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-colors
                      ${link.isOfficial ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-gray-700 hover:bg-gray-800 text-white"}`}>
                    {link.isOfficial ? "🏪" : "🛒"} {link.label} ↗
                  </a>
                ))}
                <CopyModelName name={`${shoe.brand} ${shoe.model}`} />
                <button
                  onClick={onToggleCompare}
                  disabled={!canAddCompare}
                  className={
                    `text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                      inCompare
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : canAddCompare
                        ? "border-gray-300 bg-white text-gray-600 hover:border-emerald-400 hover:text-emerald-600"
                        : "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed"
                    }`
                  }
                >
                  {inCompare ? "✓ 비교 중" : "비교 추가"}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                공식몰 접속 후 위 모델명을 검색창에 붙여넣으세요.
              </p>
            </div>
          </div>
        </div>

        <ul className="mt-4 flex flex-col gap-1">
          {reasons.map((r, idx) => (
            <li key={idx} className="flex gap-2 text-sm text-gray-700">
              <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>{r}
            </li>
          ))}
        </ul>

        <button onClick={onToggle}
          className="mt-4 text-sm text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1">
          {expanded ? "접기 ↑" : "상세 스펙 · 유튜브 리뷰 ↓"}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 px-5 py-5 space-y-5">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">주요 컬러웨이</p>
            <div className="flex flex-wrap gap-2">
              {shoe.colorways.map(c => (
                <span key={c} className="text-xs bg-white border border-gray-200 px-2.5 py-1 rounded-full text-gray-700">{c}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">세부 스펙</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                ["힐 드롭",   `${shoe.heelDropMm}mm`],
                ["스택 높이", `${shoe.stackHeightMm}mm`],
                ["무게 (M9)", `${shoe.weightGramsM9}g`],
                ["쿠셔닝",   `${shoe.cushioning}/5  ${CUSH_DOTS[shoe.cushioning]}`],
                ["안정화",   STABILITY_LABEL[shoe.stability]],
                ["폭 옵션",  shoe.widthOptions.join(" · ")],
                ["권장 체중", `${shoe.weightRangeKg[0]}~${shoe.weightRangeKg[1]}kg`],
                ["권장 신장", `${shoe.heightRangeCm[0]}~${shoe.heightRangeCm[1]}cm`],
                ["한국 가격", `${shoe.priceKrw.toLocaleString()}원`],
              ].map(([label, value]) => (
                <div key={label} className="bg-white rounded-lg border border-gray-200 px-3 py-2">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-700 mb-1">과학적 추천 근거</p>
            <p className="text-sm text-blue-800 leading-relaxed">{shoe.scienceBasis}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">이 신발이 최적인 체형</p>
            <div className="flex flex-wrap gap-2">
              {shoe.primaryBodyTypes.map(bt => (
                <span key={bt} className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full">
                  {BODY_TYPE_LABEL[bt]}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">유튜브 리뷰 채널별 검색</p>
            <div className="flex flex-wrap gap-2">
              {shoe.youtubeReviews.map(link => (
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors">
                  ▶ {link.label}
                </a>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">* 각 채널의 해당 모델 영상으로 연결됩니다. 광고 관계 없음.</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 mb-3">구매 방법</p>
            <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">모델명 (공식몰 검색창에 붙여넣기)</p>
                <p className="text-sm font-bold text-gray-900 font-mono">{shoe.brand} {shoe.model}</p>
              </div>
              <CopyModelName name={`${shoe.brand} ${shoe.model}`} />
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {shoe.buyLinks.map(link => (
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors
                    ${link.isOfficial ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-gray-700 hover:bg-gray-800 text-white"}`}>
                  {link.isOfficial ? "🏪 공식 구매하기" : "🛒 " + link.label} ↗
                </a>
              ))}
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <p>공식몰 접속 → 검색창에 모델명 붙여넣기 → 사이즈·색상 선택 후 구매</p>
              <p>공식몰 구매 시 정품 보장, 교환·반품 정책 적용됩니다.</p>
            </div>
            <a href={shoe.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="inline-block mt-3 text-xs text-gray-400 underline underline-offset-2 hover:text-gray-700">
              스펙 출처: 브랜드 공식·RunRepeat 참고 ↗
            </a>
          </div>
        </div>
      )}
    </li>
  );
}

function ShareResultButton({ buildUrl }: { buildUrl: () => string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(buildUrl()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button type="button" onClick={copy}
      className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors
        ${copied ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-300 bg-white text-gray-600 hover:border-emerald-400 hover:text-emerald-600"}`}>
      {copied ? "✓ 링크 복사됨" : "🔗 결과 링크 복사"}
    </button>
  );
}

function CopyModelName({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(name).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button onClick={copy}
      className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors
        ${copied ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"}`}>
      {copied ? "✓ 복사됨" : "모델명 복사"}
    </button>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600 text-xs">{children}</span>
  );
}

type GuideItem = { href: string; tag: string; title: string; desc: string };

const GUIDE_MAP: Record<string, GuideItem[]> = {
  flat: [
    { href: "/injury/wide-foot",  tag: "발볼",    title: "발볼 넓은 러너 와이드 규격 총정리",       desc: "평발은 발볼이 넓어지는 경향. 2E·4E 규격 판단법." },
    { href: "/injury/knee-pain",  tag: "무릎",    title: "무릎 통증 없이 달리는 법",                desc: "평발 러너의 과내전이 무릎 통증으로 이어지는 이유." },
    { href: "/injury/it-band",    tag: "무릎",    title: "장경인대염 초기 대처법 3가지",             desc: "평발에서 자주 오는 무릎 바깥쪽 통증 대처법." },
  ],
  high_arch: [
    { href: "/injury/achilles",   tag: "아킬레스", title: "미드풋 전환 후 아킬레스건 스트레칭",      desc: "높은 아치는 아킬레스건 부담이 큼. 필수 스트레칭." },
    { href: "/injury/midfoot",    tag: "착지",    title: "미드풋 착지 완전 가이드",                 desc: "높은 아치 러너에게 맞는 착지법 전환 방법." },
  ],
  neutral: [
    { href: "/injury/cadence",    tag: "케이던스", title: "케이던스 맞추는 법",                     desc: "중립 아치 러너의 무릎 부하를 줄이는 보폭 조정." },
    { href: "/injury/beginner-guide", tag: "입문", title: "초보 러너 완전 가이드",                  desc: "처음 달리기 시작할 때 꼭 알아야 할 것들." },
  ],
};

const USE_GUIDE_MAP: Record<string, GuideItem> = {
  long:   { href: "/injury/first-10k",  tag: "장거리", title: "첫 10km 완주 가이드",               desc: "하프·풀 준비 전 10km부터 완주하는 법." },
  racing: { href: "/injury/advanced-guide", tag: "숙련", title: "숙련자 훈련 가이드",               desc: "기록 단축을 위한 고강도 훈련 전략." },
  tempo:  { href: "/injury/intermediate-guide", tag: "중급", title: "중급자 훈련 가이드",           desc: "템포런·인터벌 훈련을 안전하게 시작하는 법." },
  daily:  { href: "/injury/rest-day",   tag: "회복",  title: "회복일 관리 가이드",                  desc: "매일 달리고 싶다면 회복일이 더 중요합니다." },
};

function RelatedGuides({ footType, footWidth, use }: { footType: FootType; footWidth: FootWidth; use: ShoeUse | "" }) {
  const guides = [...(GUIDE_MAP[footType] ?? GUIDE_MAP["neutral"])];
  if (footWidth === "wide" && !guides.find(g => g.href === "/injury/wide-foot")) {
    guides.unshift({ href: "/injury/wide-foot", tag: "발볼", title: "발볼 넓은 러너 와이드 규격 총정리", desc: "2E·4E 규격이 필요한지 판단하는 방법." });
  }
  if (use && USE_GUIDE_MAP[use]) guides.push(USE_GUIDE_MAP[use]);
  const shown = guides.slice(0, 3);

  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">내 발 타입에 맞는 부상 예방 가이드</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {shown.map(g => (
          <a key={g.href} href={g.href}
            className="block border border-gray-100 rounded-xl p-4 hover:border-emerald-300 hover:shadow-sm transition-all bg-white">
            <span className="inline-block text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mb-2">
              {g.tag}
            </span>
            <p className="font-semibold text-gray-900 text-sm leading-snug mb-1">{g.title}</p>
            <p className="text-xs text-gray-500 leading-relaxed">{g.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

function ComparePanel({
  compareIds,
  shoes,
  onClear,
  userWidth,
  userFootType,
}: {
  compareIds: string[];
  shoes: Shoe[];
  onClear: () => void;
  userWidth: FootWidth;
  userFootType: FootType;
}) {
  return (
    <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-lg">
          {compareIds.length === 1 ? "비교할 신발을 하나 더 선택하세요" : "신발 비교"}
        </h3>
        <button onClick={onClear} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors">
          ✕ 초기화
        </button>
      </div>
      {compareIds.length === 2 && shoes.length === 2 && (
        <>
          <CompareTable shoes={shoes} userWidth={userWidth} userFootType={userFootType} />
          <div className="mt-4 pt-4 border-t border-emerald-200 flex items-center justify-between">
            <p className="text-xs text-gray-500">이 비교를 저장하거나 친구에게 공유하고 싶다면?</p>
            <Link
              href={`/compare/${compareIds[0]}-vs-${compareIds[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-emerald-700 border border-emerald-300 bg-white hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ml-3"
            >
              비교 페이지 열기 ↗
            </Link>
          </div>
        </>
      )}
      {compareIds.length === 1 && shoes[0] && (
        <div className="flex items-center gap-4">
          <div className="flex-1 rounded-xl bg-white border border-emerald-200 p-4">
            <p className="text-sm font-semibold text-gray-900">
              {shoes[0].brand} {shoes[0].model}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">선택됨</p>
          </div>
          <span className="text-2xl text-gray-300">vs</span>
          <div className="flex-1 rounded-xl border-2 border-dashed border-emerald-300 p-4 text-center">
            <p className="text-sm text-emerald-600">신발 카드에서 선택</p>
          </div>
        </div>
      )}
    </div>
  );
}

function CompareTable({ shoes, userWidth, userFootType }: { shoes: Shoe[]; userWidth: FootWidth; userFootType: FootType }) {
  const a = shoes[0];
  const b = shoes[1];
  if (!a || !b) return null;
  const cushDots = ["", "●○○○○", "●●○○○", "●●●○○", "●●●●○", "●●●●●"];
  const stabLabel: Record<string, string> = {
    neutral: "중립 (보통 발)",
    stability: "안정화 (평발용)",
    motion_control: "모션컨트롤 (심한 평발)",
  };
  const footTypeLabel: Record<string, string> = {
    flat: "평발", neutral: "중립", high_arch: "높은 아치",
  };
  const useLabel: Record<string, string> = {
    daily: "데일리", long: "장거리", tempo: "템포", racing: "레이싱",
  };
  const widthKr: Record<string, string> = { narrow: "좁음", normal: "보통", wide: "넓음", B: "좁음", D: "보통", "2E": "넓음", "4E": "매우넓음" };
  const footTypeKr: Record<string, string> = { flat: "평발", neutral: "중립 아치", high_arch: "높은 아치" };
  const toWidthText = (opts: string[]) => opts.map(w => widthKr[w] ?? w).join(" · ");
  const toFootText = (types: string[]) => types.map(f => footTypeKr[f] ?? f).join(" · ");

  void footTypeLabel; void userWidth; void userFootType;

  type Row = [string, string, string];
  const rows: Row[] = [
    ["가격",      a.priceKrw.toLocaleString() + "원",               b.priceKrw.toLocaleString() + "원"],
    ["쿠셔닝",    cushDots[a.cushioning] ?? "",                      cushDots[b.cushioning] ?? ""],
    ["안정화",    stabLabel[a.stability] ?? "",                      stabLabel[b.stability] ?? ""],
    ["힐드롭",    a.heelDropMm + "mm",                               b.heelDropMm + "mm"],
    ["스택높이",  a.stackHeightMm + "mm",                            b.stackHeightMm + "mm"],
    ["무게",      a.weightGramsM9 + "g",                             b.weightGramsM9 + "g"],
    ["발볼 옵션", toWidthText(a.widthOptions),                       toWidthText(b.widthOptions)],
    ["발 타입",   toFootText(a.footTypes),                           toFootText(b.footTypes)],
    ["추천 용도", a.uses.map(u => useLabel[u] ?? u).join("·"),       b.uses.map(u => useLabel[u] ?? u).join("·")],
    ["국내구매",  KR_AVAILABILITY_LABEL[a.krAvailability],           KR_AVAILABILITY_LABEL[b.krAvailability]],
  ];

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left pb-3 w-24 text-xs text-gray-400 font-normal" />
              <th className="text-center pb-3 px-2">
                <p className="font-bold text-gray-900">{a.brand}</p>
                <p className="text-xs text-gray-500">{a.model}</p>
              </th>
              <th className="text-center pb-3 px-2">
                <p className="font-bold text-gray-900">{b.brand}</p>
                <p className="text-xs text-gray-500">{b.model}</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, va, vb]) => (
              <tr key={label} className="border-t border-emerald-100">
                <td className="py-2.5 text-xs font-semibold text-gray-600 whitespace-nowrap pr-3">{label}</td>
                <td className={"py-2.5 text-center font-medium text-sm px-2 " + (va !== vb ? "text-emerald-700" : "text-gray-700")}>{va}</td>
                <td className={"py-2.5 text-center font-medium text-sm px-2 " + (va !== vb ? "text-emerald-700" : "text-gray-700")}>{vb}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <details className="mt-4 text-xs text-gray-500 border-t border-emerald-100 pt-3">
        <summary className="cursor-pointer font-medium text-emerald-700 hover:text-emerald-900">📖 용어 설명 보기</summary>
        <ul className="mt-2 space-y-1 leading-relaxed">
          <li><strong>쿠셔닝</strong> — 충격 흡수 정도. 많을수록 무릎·관절이 편하지만 무거워짐.</li>
          <li><strong>안정화</strong> — 발이 안쪽으로 쏠리는 걸 잡아주는 기능. 평발이면 안정화·모션컨트롤 권장.</li>
          <li><strong>힐드롭</strong> — 뒤꿈치와 앞발의 높이 차이. 낮을수록(0–4mm) 자연스러운 발착지에 가깝고, 높을수록(8mm+) 뒤꿈치 착지에 유리.</li>
          <li><strong>스택높이</strong> — 밑창 두께. 높을수록 쿠션이 많고, 낮을수록 지면 감각이 살아있음.</li>
          <li><strong>발볼</strong> — D=표준, 2E=넓음(와이드), 4E=매우 넓음. 발이 넓으면 2E 이상 권장.</li>
        </ul>
      </details>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {[a, b].map((shoe) =>
          shoe.buyLinks[0] ? (
            <a
              key={shoe.id}
              href={shoe.buyLinks[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl transition-colors"
            >
              {shoe.brand} {shoe.model} 구매 ↗
            </a>
          ) : null
        )}
      </div>
    </div>
  );
}
