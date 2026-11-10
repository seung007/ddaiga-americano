"use client";

import ShoeSideProfile from "@/components/ShoeSideProfile";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { History, Search, TriangleAlert, Store, ShoppingCart } from "lucide-react";
import AffiliateNotice from "@/components/AffiliateNotice";
import ChipRow, { Why } from "@/components/finder/ChipRow";
import { affiliateFor, pickTwoBuyLinks, resolveBuyLinks } from "@/lib/shoes/affiliate";
import { shoePlaceholder } from "@/lib/shoes/placeholder";
import { recommendShoes } from "@/lib/shoes/recommend";
import { BODY_TYPE_LABEL, KR_AVAILABILITY_LABEL } from "@/lib/shoes/types";
import type { FootType, FootWidth, Gender, InjuryArea, Recommendation, RunDistance, RunnerLevel, Shoe, ShoeUse } from "@/lib/shoes/types";
import {
  CUSH_DOTS, FOOT_OPTIONS, HEIGHT_OPTIONS, STABILITY_LABEL, STORAGE_KEY, USE_LABEL, USES, WEIGHT_OPTIONS,
  type HeightRange, type SavedProfile, type WeightRange,
} from "@/lib/shoes/profileOptions";
import { gtagEvent } from "@/lib/gtag";

// 옵션표·저장 프로필·GA 헬퍼는 `/shoes`(내 조건으로 보기)와 같이 쓰려고 lib 로 옮겼다 (2026-09-16).

/*
 * 2026-11-10 — 8화면을 4화면으로 묶었다. **질문 8개는 그대로다.**
 *
 * 운영자 판단: 한 화면에 질문 하나씩 8번 넘기다 보면 방문자가 중간에 그만둔다. 질문을 빼면 추천 품질이 떨어지니
 * 질문은 두고 화면 수만 줄인다. ⚠️ 이탈이 화면 수 때문인지는 잰 적이 없다(아래 GA 주석) — 측정이 아니라 운영자 결정이다.
 * 2026-09-14 STEP 0 주석에 「Warby Parker·ThirdLove 도 8단계라 길이는 문제가 아니다」라고 적었는데,
 * 그건 남의 성공 사례였지 우리 이탈을 잰 것이 아니었다. 그 주석은 지웠다.
 *
 * 화면별 질문 (값·필수 여부는 바꾸지 않았다. 필수 = 용도·키·체중):
 *   0 어떻게 달려요?       용도(필수) · 경험 · 주간 거리
 *   1 몸에 대해 알려 주세요  성별 · 키(필수) · 체중(필수)
 *   2 발은 어떤가요?        발볼 · 발바닥 모양
 *   3 아픈 곳과 예산        부상 이력 · 예산 → 제출
 *
 * 같은 날 1화면의 「빠르게 시작」 프리셋 4개(2026-10-13)도 걷었다. 운영자가 「직접 고르기」와 뭐가 다르냐고 물었다 —
 * 한 화면에 고르는 방식이 두 개라 오히려 고를 게 많아 보였다.
 */

/**
 * 화면에 보이는 선택지 이름은 처음 달리는 사람이 읽을 수 있는 말로 쓴다(2026-11-10).
 * 값(value)은 공유 URL·저장 프로필·추천 엔진이 쓰므로 바꾸지 않았다. 이름만 바꿨다.
 */
const USE_OPTIONS: { value: ShoeUse; label: string }[] = [
  { value: "daily",  label: "일상 달리기" },
  { value: "long",   label: "장거리" },
  { value: "tempo",  label: "빠른 훈련" },
  { value: "racing", label: "대회용" },
];

// ── PRD F-01 추가 문항 옵션 ────────────────────────────────────────
const BUDGETS: { value: number; label: string }[] = [
  { value: 0,      label: "상관없음" },
  { value: 150000, label: "15만원 이하" },
  { value: 200000, label: "20만원 이하" },
  { value: 250000, label: "25만원 이하" },
];

// ── PRD F-01 추가 문항: 경험 · 주간 거리 · 부상 이력 ──────────────
// 2026-11-10: 「입문·중급·숙련」은 기준을 따로 읽어야 해서, 그 기준(예전 설명 문구)을 이름으로 올렸다.
const LEVEL_OPTIONS: { value: RunnerLevel; label: string }[] = [
  { value: "beginner",     label: "이제 막 시작했어요" },     // 예전 설명: 5km를 편하게 달린 적 없어요
  { value: "intermediate", label: "하프까지 뛰어 봤어요" },   // 예전 설명: 5km는 쉽게, 하프마라톤도 완주했어요
  { value: "advanced",     label: "기록을 줄이는 중이에요" }, // 예전 설명: 하프 이상 꾸준히, 기록 단축 중
];

const DISTANCE_OPTIONS: { value: RunDistance; label: string }[] = [
  { value: "short", label: "10km 미만" },
  { value: "mid",   label: "10~30km" },
  { value: "long",  label: "30km 이상" },
];

const INJURY_OPTIONS: { value: InjuryArea; label: string }[] = [
  { value: "none",     label: "없어요" },
  { value: "knee",     label: "무릎" },
  { value: "ankle",    label: "발목" },
  { value: "achilles", label: "종아리·뒤꿈치 위" },
  { value: "plantar",  label: "발바닥" },
];

/** 발 특성 칩 이름 — FOOT_OPTIONS(lib) 의 「넓은 발볼 2E/4E」「중립 아치」는 처음 보는 사람이 읽기 어렵다 */
const FOOT_CHIP: Record<string, string> = {
  narrow: "좁아요", normal: "보통이에요", wide: "넓어요",
  flat: "평발 쪽이에요", neutral: "보통이에요", high_arch: "아치가 높아요",
};
/** 결과 화면 조건 칩·홈 안내 줄에 쓰는 이름 */
const FOOT_NAME: Record<string, string> = {
  narrow: "좁은 발볼", normal: "보통 발볼", wide: "넓은 발볼",
  flat: "평발 쪽", neutral: "보통 아치", high_arch: "높은 아치",
};

type SortKey = "score" | "price_asc" | "price_desc";

const SCREENS = ["어떻게 달려요?", "몸에 대해 알려 주세요", "발은 어떤가요?", "아픈 곳과 예산"];
const TOTAL_STEPS = SCREENS.length;

/**
 * 결과 화면의 조건 칩 — 질문 하나에 칩 하나, 누르면 그 질문이 있는 화면이 열린다.
 * `label` 은 GA `recommend_inline_edit` 의 field 값이다. 8화면 시절과 같은 이름을 써서 이전 기록과 이어 본다.
 */
const FIELDS: { label: string; screen: number }[] = [
  { label: "용도", screen: 0 },
  { label: "경험·거리", screen: 0 },
  { label: "성별", screen: 1 },
  { label: "키", screen: 1 },
  { label: "체중", screen: 1 },
  { label: "발 특성", screen: 2 },
  { label: "부상 이력", screen: 3 },
  { label: "예산", screen: 3 },
];

// ── 재방문 · 공유: 프로필 저장/복원 ─────────────────────────────


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
  /**
   * 결과 화면에서 조건을 고쳐보는 모드. 값은 열린 **화면** 번호(0~3), null이면 평소의 마법사.
   *
   * 이게 없을 때는 예산 하나 바꾸려고 「조건 다시 고르기」로 처음부터 다시 돌아야 했다.
   * 추천 결과는 이미 useMemo라 입력이 바뀌면 자동으로 다시 계산되므로,
   * `submitted`만 유지하면 재제출 없이 결과가 그 자리에서 갱신된다.
   */
  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [level,     setLevel]     = useState<RunnerLevel | "">("");
  const [distance,  setDistance]  = useState<RunDistance | "">("");
  const [injuries,  setInjuries]  = useState<InjuryArea[]>([]);
  const [savedProfile, setSavedProfile] = useState<SavedProfile | null>(null);

  /**
   * 퍼널 계측용 플래그.
   *
   * 완주율을 계산하려면 분모가 필요한데 지금까지 그게 없었다. session_start를 분모로 쓰면
   * /shoe-finder를 밟지도 않은 세션이 전부 들어가 값이 무의미해진다.
   * recommend_form_start를 심어 "폼을 실제로 시작한 사람" 대비 완주율을 재도록 한다.
   *
   * ⚠️ 2026-11-10 화면을 8개 → 4개로 줄였다. `recommend_form_start` 는 여전히 「첫 화면에서 다음을 누른 순간」인데,
   * 첫 화면에 이제 질문이 셋(용도·경험·거리)이다. 시작의 무게와 완주까지의 화면 수가 둘 다 바뀌었으므로
   * **2026-11-10 이전과 이후의 시작→완주 비율·elapsed_sec 를 한 줄로 이어 비교하지 않는다.**
   */
  const startFiredRef = useRef(false);
  const completeFiredRef = useRef(false);

  /**
   * ⚠️ 2026-09-22 — **`start` 가 `complete` 보다 적은 진짜 이유를 찾았다.**
   *
   * GA4 28일(8/25~9/21) 실측:
   *   recommend_form_complete  13건 / 사용자 11명
   *   recommend_form_start     12건 / 사용자 10명
   * 시작 없이 완주할 수는 없다. 2026-09-01 에는 이걸 **gtag 로드 타이밍** 탓으로 보고
   * `lib/gtag.ts` 에 큐를 넣었다. 큐는 들어갔는데 **역전이 그대로다.** 원인이 딴 데 있었다.
   *
   * 실제 경로:
   *   ① 공유 URL(`?h=..&w=..`)이나 「지난 추천 다시보기」로 들어오면
   *      `applyProfile(p, true)` 가 `setSubmitted(true)` 를 바로 때린다 — **결과 화면부터 시작한다**
   *   ② `goNext()` 를 한 번도 안 거쳤으므로 `recommend_form_start` 는 **발화하지 않는다**
   *   ③ 그 상태에서 인라인 편집하고 다시 제출하면 `handleSubmit` → **`complete` 만 찍힌다**
   *
   * 같은 기간 `recommend_inline_edit` 이 2건 / 사용자 1명으로 관측된다. 차이도 사용자 1명이다.
   *
   * 고치는 방법으로 「`handleSubmit` 에서도 `start` 를 쏜다」는 **안 된다** —
   * 그러면 start ≈ complete 가 돼서 완주율이 항상 100% 가 되고 지표가 죽는다.
   * 대신 **완주가 어느 경로로 들어왔는지**를 붙인다. 분모를 `entry=form` 으로 좁혀서 계산한다.
   *
   * `from` 을 쓰는 이유: GA4 맞춤 측정기준에 **이미 등록돼 있다**(2026-09-13).
   * 새 매개변수 이름을 쓰면 또 등록해야 하고 **소급 적용이 안 된다.**
   */
  const restoredRef = useRef(false);
  /*
   * 2026-11-10 — 프리셋을 걷으면서 `finder_preset` 이벤트와 complete 의 `from=preset` 도 더는 나오지 않는다.
   * 2026-10-13 ~ 11-10 사이 기록에는 남아 있다. 그 기간 from=form 완주율을 볼 때는 여전히 preset 을 분자에서 빼야 한다
   * (프리셋 경로는 start 를 안 쐈다).
   */
  /** 2026-10-13 — 「1분」 문구를 뺐다(잰 적이 없었다). 시작→완주 시간을 재서 다시 쓸지 정한다 */
  const startedAtRef = useRef<number | null>(null);
  /**
   * 2026-11-05 — 홈 추천 카드에서 발볼·용도를 고르고 들어온 사람 (`?from=home&f=wide&u=long`).
   * 홈에서 이미 답한 것을 다시 묻지 않는다. `recommend_form_start` 를 쏘지 않는다 —
   * 첫 화면을 안 밟을 수 있으니 from=form 완주율의 분모를 부풀린다. 이 경로의 분모는 `finder_from_home` 이다.
   */
  const homeRef = useRef(false);
  const [fromHome, setFromHome] = useState<{ f: string; u: ShoeUse | "" } | null>(null);

  function goNext() {
    // 첫 화면에서 다음으로 넘어가는 순간 = 폼을 실제로 시작한 것
    if (!startFiredRef.current) {
      startFiredRef.current = true;
      startedAtRef.current = Date.now();
      gtagEvent("recommend_form_start", {});
    }
    setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS - 1));
  }
  function goPrev() { setError(""); setCurrentStep(s => Math.max(s - 1, 0)); }

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
    // 2026-09-22: 결과 화면부터 시작한 사람이다. 이후 완주가 찍히면 「복원 경로」로 표시한다
    if (submit) {
      restoredRef.current = true;
      setSubmitted(true);
    }
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
      if (sp.get("from") === "home") {
        const hu = sp.get("u") ?? "";
        const u: ShoeUse | "" = USES.some(o => o.value === hu) ? (hu as ShoeUse) : "";
        const f = (sp.get("f") ?? "").split(",")
          .find(id => FOOT_OPTIONS.some(o => o.id === id && o.category === "width")) ?? "";
        if (u || f) {
          gtagEvent("finder_from_home", { width: f || "unset", use: u || "unset" });
          startFiredRef.current = true;
          homeRef.current = true;
          startedAtRef.current = Date.now();
          if (u) setUse(u);
          if (f) setFootSelections([f]);
          setFromHome({ f, u });
          // 필수 질문이 남은 첫 화면을 연다. 첫 화면의 필수는 용도 하나라, 용도를 골라 왔으면 몸(키·체중) 화면부터.
          // 발볼만 골라 왔으면 용도가 남았으니 첫 화면. 발볼은 3번째 화면에서 골라진 채로 보인다
          if (u) setCurrentStep(1);
        }
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
    submitNow();
  }

  function submitNow() {
    /**
     * ⚠️ 2026-09-14 — **오류가 해당 화면으로 데려가게 했다.**
     * 필수 질문을 건너뛴 채 마지막 화면까지 오면, 그 화면엔 고칠 데가 없다. 그래서 그 질문이 있는 화면으로 보낸다.
     * 2026-11-10 부터 번호는 화면 번호다(용도 = 0, 키·체중 = 1).
     */
    if (!use)         { setCurrentStep(0); setError("어떤 달리기를 하시는지 먼저 골라 주세요."); return; }
    if (!heightRange) { setCurrentStep(1); setError("키를 골라 주세요."); return; }
    if (!weightRange) { setCurrentStep(1); setError("체중도 골라 주세요."); return; }
    setError("");
    setSubmitted(true);
    setExpandedId(null);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentProfileForSave()));
    } catch { /* 저장 실패는 무시 */ }

    // 한 번의 퍼널 진행에서 완주는 한 번만 센다.
    // 이전에는 여기서 무조건 발화했는데, handleChange()가 submitted를 되돌리기 때문에
    // 사용자가 필터만 바꿔 재제출해도 완주가 또 찍혔다. 2026-08-27 GA4에서
    // 이벤트 20건 / 사용자 15명(1.33배)으로 그 중복이 실제로 관측됐다.
    if (!completeFiredRef.current) {
      completeFiredRef.current = true;
      // from=form    → 첫 화면부터 밟은 진짜 완주 (완주율의 분자). 2026-11-10 부터 4화면, 그 전은 8화면
      // from=restore → 공유 링크·지난 추천으로 결과 화면부터 시작한 뒤 재제출
      // from=home    → 홈 추천 카드에서 발볼·용도를 넘겨받음 (2026-11-05). 분모는 finder_from_home
      // (from=preset 은 2026-10-13 ~ 11-10 에만 있었다. 프리셋을 걷었다)
      gtagEvent("recommend_form_complete", {
        gender: gender || "unset",
        level: level || "unset",
        from: homeRef.current ? "home" : restoredRef.current ? "restore" : "form",
        // 첫 화면부터 밟은 완주만 걸린 시간(초)을 붙인다. 30분 넘게 걸린 건 자리를 비운 것으로 보고 뺀다
        ...(startedAtRef.current && Date.now() - startedAtRef.current < 30 * 60_000
          ? { elapsed_sec: Math.round((Date.now() - startedAtRef.current) / 1000) }
          : {}),
      });
    }
  }

  /**
   * 질문 8개가 값이 바뀔 때마다 전부 이 함수를 부른다.
   *
   * 인라인 편집 중에는 `submitted`를 내리지 않는 것이 이 모드의 전부다.
   * 그래서 화면 JSX는 한 줄도 고치지 않고 두 모드에서 같이 쓴다.
   */
  function handleChange() {
    if (editingStep === null) setSubmitted(false);
    setError("");
  }

  /** 결과 화면의 조건 칩에서 그 질문이 있는 화면만 열기 */
  function startInlineEdit(field: (typeof FIELDS)[number]) {
    setEditingStep(field.screen);
    setError("");
    setExpandedId(null);
    gtagEvent("recommend_inline_edit", { field: field.label });
  }

  function finishInlineEdit() {
    // 키를 바꾸면 체중 구간이 달라져 체중이 비워진다. 그대로 닫으면 결과가 통째로 사라지므로 막는다
    if (!heightRange || !weightRange) { setError("체중도 골라 주세요. 키에 따라 체중 구간이 달라져요."); return; }
    setEditingStep(null);
    setError("");
  }

  /** 지금 화면에 그릴 화면 번호 — 인라인 편집 중이면 그 화면, 아니면 마법사의 현재 화면 */
  const activeStep = editingStep ?? currentStep;
  const isEditing = editingStep !== null;

  /** 조건 칩에 띄울 현재 값. null이면 아직 안 고른 것. ⚠️ 순서는 `FIELDS` 와 1:1 */
  const fieldSummaries: (string | null)[] = [
    USE_OPTIONS.find(o => o.value === use)?.label ?? null,
    [LEVEL_OPTIONS.find(o => o.value === level)?.label, distance ? `주 ${DISTANCE_OPTIONS.find(o => o.value === distance)?.label}` : null]
      .filter(Boolean).join(", ") || null,
    gender === "male" ? "남성" : gender === "female" ? "여성" : null,
    HEIGHT_OPTIONS.find(o => o.value === heightRange)?.label ?? null,
    (heightRange && WEIGHT_OPTIONS[heightRange].find(o => o.value === weightRange)?.label) || null,
    footSelections.length ? footSelections.map(id => FOOT_NAME[id]).filter(Boolean).join(", ") : null,
    injuries.length
      ? injuries.map(v => INJURY_OPTIONS.find(o => o.value === v)?.label).filter(Boolean).join(", ")
      : null,
    BUDGETS.find(o => o.value === budget)?.label ?? null,
  ];

  const topPick = sortedPrimary[0];

  function handleReset() {
    setSubmitted(false);
    setError("");
    setCurrentStep(0);
    // 인라인 편집 중에 「처음부터」를 누를 수 있다. 이걸 안 지우면 isEditing이 계속 참이라
    // 마법사로 돌아가고도 편집 헤더가 남는다.
    setEditingStep(null);
    // 새 퍼널 진행이므로 시작·완주를 다시 셀 수 있게 되돌린다.
    startFiredRef.current = false;
    completeFiredRef.current = false;
    homeRef.current = false;
    setFromHome(null);
  }

  /** 발 특성: 같은 줄(발볼 / 발바닥 모양) 안에서는 하나만, 다시 누르면 해제 */
  function pickFoot(id: string) {
    handleChange();
    setFootSelections(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      const cat = FOOT_OPTIONS.find(x => x.id === id)?.category;
      return [...prev.filter(x => FOOT_OPTIONS.find(o => o.id === x)?.category !== cat), id];
    });
  }

  const homeWidth = fromHome?.f ? footSelections.find(id => FOOT_OPTIONS.some(o => o.id === id && o.category === "width")) : undefined;

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12 text-gray-900">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">내 발에 맞는 러닝화 찾기</h1>
        <p className="mt-1.5 text-gray-500 text-sm leading-relaxed">
          네 화면에 답하면 내 발에 맞는 신발 3개를 골라드려요.
        </p>
      </header>

      {!submitted && savedProfile && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-sm text-emerald-800">
            <History size={16} strokeWidth={1.5} aria-hidden className="mr-1 inline align-[-3px]" />지난번에 받은 추천이 있어요. 다시 답하지 않고 바로 볼 수 있어요.
          </p>
          <div className="flex shrink-0 gap-2">
            <button type="button"
              onClick={() => { applyProfile(savedProfile, true); setSavedProfile(null); }}
              className="min-h-11 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 rounded-lg transition-colors">
              다시 보기
            </button>
            <button type="button"
              onClick={() => { setSavedProfile(null); try { localStorage.removeItem(STORAGE_KEY); } catch {} }}
              className="min-h-11 text-xs text-gray-500 hover:text-gray-700 px-2 transition-colors">
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
                i < currentStep ? "w-8 bg-emerald-500" :
                i === currentStep ? "w-12 bg-emerald-500" :
                "w-8 bg-gray-200"
              }`} />
            ))}
          </div>
          <span className="text-xs text-gray-400" aria-label={`${TOTAL_STEPS}개 중 ${currentStep + 1}번째 화면`}>
            <span className="font-semibold text-gray-700">{currentStep + 1}</span> / {TOTAL_STEPS}
          </span>
        </div>
      )}

      <AffiliateNotice show={!!result && result.primary.some((r) => !!affiliateFor(r.shoe.id))} />

      {/* ── 조건 칩 바 ──────────────────────────────────────────
          이전에는 여기에 「← 조건 다시 고르기」 하나만 있었고, 그게 handleReset()이라
          예산 하나 바꾸려면 처음부터 다시 돌아야 했다. 이제 칩을 누르면
          그 질문이 있는 화면만 열리고, 고치는 즉시 아래 결과가 갱신된다.
          키를 바꾸면 체중이 비어 결과가 잠시 없어지므로, 편집 중에는 결과가 없어도 바를 남긴다. */}
      {submitted && (result || isEditing) && (
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500">
              내 조건 <span className="font-normal text-gray-400">(눌러서 고치기)</span>
            </p>
            <ShareResultButton buildUrl={buildShareUrl} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FIELDS.map((f, i) => {
              const val = fieldSummaries[i];
              const open = editingStep === f.screen;
              return (
                <button key={f.label} type="button"
                  onClick={() => (open ? finishInlineEdit() : startInlineEdit(f))}
                  aria-expanded={open}
                  className={`flex items-baseline gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors
                    ${open
                      ? "border-emerald-500 bg-emerald-600 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50"}`}>
                  <span className={open ? "text-emerald-100" : "text-gray-400"}>{f.label}</span>
                  <span className="font-semibold">{val ?? "선택 안 함"}</span>
                </button>
              );
            })}
            <button type="button" onClick={handleReset}
              className="rounded-full px-3 py-1.5 text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600 transition-colors">
              처음부터
            </button>
          </div>
        </div>
      )}

      {(!submitted || isEditing) && (
      <form onSubmit={handleSubmit} noValidate
        className={`flex flex-col gap-6 rounded-2xl border bg-white p-6 ${
          isEditing ? "border-emerald-300 ring-2 ring-emerald-100 shadow-md" : "border-gray-200 shadow-sm"
        }`}>

        <div className="-mb-1 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-900">{SCREENS[activeStep]}</h2>
          {isEditing && (
            <button type="button" onClick={finishInlineEdit}
              className="min-h-11 shrink-0 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
              완료
            </button>
          )}
        </div>

        {/* 2026-11-10 홈에서 넘겨받은 답. 그 질문이 다른 화면에 있어도 여기서 바로 눌러 고칠 수 있게 칩으로 보인다.
            값은 넘겨받은 값이 아니라 **지금 값**을 보인다(첫 화면에서 용도를 바꾸면 여기도 바뀐다). */}
        {fromHome && !submitted && !isEditing && (use && fromHome.u || homeWidth) && (
          <div className="-mt-2 flex flex-wrap items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
            <span className="text-xs text-emerald-900">홈에서 고른 것</span>
            {homeWidth && (
              <button type="button" onClick={() => setCurrentStep(2)}
                aria-label={`${FOOT_NAME[homeWidth]}, 눌러서 바꾸기`}
                className="min-h-11 rounded-full border border-emerald-500 bg-white px-3 text-xs font-semibold text-emerald-800">
                {FOOT_NAME[homeWidth]}
              </button>
            )}
            {fromHome.u && use && (
              <button type="button" onClick={() => setCurrentStep(0)}
                aria-label={`${USE_OPTIONS.find(o => o.value === use)?.label}, 눌러서 바꾸기`}
                className="min-h-11 rounded-full border border-emerald-500 bg-white px-3 text-xs font-semibold text-emerald-800">
                {USE_OPTIONS.find(o => o.value === use)?.label}
              </button>
            )}
            <span className="text-xs text-emerald-900">누르면 바꿀 수 있어요.</span>
          </div>
        )}

        {/* ── 화면 0: 어떻게 달려요? (용도 · 경험 · 주간 거리) ──
            2026-09-14: 첫 질문을 예산 → 용도로 바꿨다. 추천 서비스 5곳(Warby Parker·ThirdLove·Brooks·Road Runner·Casper)의
            첫 문항을 직접 열어 봤을 때 예산을 첫 문항에 둔 곳은 0곳이었다. 처음 온 사람에게 돈부터 묻지 않는다. */}
        {activeStep === 0 && (
          <>
            <ChipRow title="어디에 신을 신발인가요?"
              hint="처음이라면 일상 달리기를 고르세요. 빠른 훈련은 평소보다 빠르게 달리는 연습이에요."
              options={USE_OPTIONS}
              isActive={v => use === v}
              onPick={v => { setUse(v); handleChange(); }} />
            {/* 2026-11-10: 예전 문구 「입문이면 부상 위험이 큰 카본화를 빼드려요」는 엔진과 달랐다.
                엔진은 카본화를 빼지 않고 점수를 낮추며(-12), 이유도 부상 위험이 아니라 안정감·수명·가격이라고 적는다
                (recommend.ts 「7. 경험 수준」, 2026-10-06 「부상 위험도 근거 없음」). 엔진이 하는 만큼만 적는다. */}
            <ChipRow title="달리기 경험은요?" optional
              why="이제 막 시작했다면 카본(탄소 섬유 판)이 든 대회용 신발은 점수를 낮춰요. 사이트가 정한 기준이에요."
              options={LEVEL_OPTIONS}
              isActive={v => level === v}
              onPick={v => { setLevel(prev => prev === v ? "" : v); handleChange(); }} />
            <ChipRow title="일주일에 얼마나 달려요?" optional
              options={DISTANCE_OPTIONS}
              isActive={v => distance === v}
              onPick={v => { setDistance(prev => prev === v ? "" : v); handleChange(); }} />
          </>
        )}

        {/* ── 화면 1: 몸에 대해 알려 주세요 (성별 · 키 · 체중) ──
            왜 묻는지 한 줄은 recommend.ts v4 가 실제로 하는 것만 적는다:
            키 → 드롭(앞뒤 높이 차) 가점, 근거 논문 없는 사이트 기준 / 체중 → 순위에 안 씀, 체형 표시만 /
            성별 → 남성·여성 기준 라스트 가점, 여성 전용 라스트는 여성을 골랐을 때만 후보. */}
        {activeStep === 1 && (
          <>
            <ChipRow title="성별" optional
              options={[
                { value: "male" as const, label: "남성" },
                { value: "female" as const, label: "여성" },
                { value: "none" as const, label: "선택 안 함" },
              ]}
              isActive={v => (v === "none" ? gender === "" : gender === v)}
              onPick={v => { setGender(v === "none" ? "" : v); handleChange(); }} />
            <ChipRow title="키"
              options={HEIGHT_OPTIONS.map(o => ({ value: o.value, label: o.label.replace(" – ", "~") }))}
              isActive={v => heightRange === v}
              onPick={v => {
                // 체중 구간이 키마다 다르다. 키가 바뀌면 체중을 비운다
                if (v !== heightRange) setWeightRange("");
                setHeightRange(v);
                handleChange();
              }} />
            {heightRange ? (
              <ChipRow title="체중"
                options={WEIGHT_OPTIONS[heightRange].map(o => ({ value: o.value, label: o.label.replace(" – ", "~") }))}
                isActive={v => weightRange === v}
                onPick={v => { setWeightRange(v); handleChange(); }} />
            ) : (
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-800">체중</p>
                <p className="text-xs text-gray-500">키를 고르면 체중 구간이 나와요.</p>
              </div>
            )}
            <Why text="키는 신발 앞뒤 높이 차이를 고를 때 참고해요(사이트가 정한 기준이에요). 체중은 체형 표시에만 쓰고 신발 순위에는 넣지 않아요. 성별을 고르면 그 성별에 맞춰 만든 신발에 점수를 더 줘요." />
          </>
        )}

        {/* ── 화면 2: 발은 어떤가요? (발볼 · 발바닥 모양) ── 안 고르면 보통 발볼·보통 아치로 계산한다(selectedWidth·selectedType 기본값) */}
        {activeStep === 2 && (
          <>
            <ChipRow title="발볼 (발 앞쪽 너비)" optional
              hint="신발 옆이 자주 눌리거나 물집이 생기면 넓은 쪽이에요."
              options={FOOT_OPTIONS.filter(o => o.category === "width").map(o => ({ value: o.id, label: FOOT_CHIP[o.id] ?? o.label }))}
              isActive={v => footSelections.includes(v)}
              onPick={pickFoot} />
            <ChipRow title="발바닥 모양" optional
              hint="평발 쪽은 발이 안쪽으로 쏠리는 편, 아치가 높으면 발바닥 가운데가 뜨는 편이에요."
              options={FOOT_OPTIONS.filter(o => o.category === "type").map(o => ({ value: o.id, label: FOOT_CHIP[o.id] ?? o.label }))}
              isActive={v => footSelections.includes(v)}
              onPick={pickFoot} />
            <p className="text-xs text-gray-500">잘 모르면 넘어가도 돼요. 안 고르면 보통으로 계산해요.</p>
          </>
        )}

        {/* ── 화면 3: 아픈 곳과 예산 + 추천 받기 ── */}
        {activeStep === 3 && (
          <>
            {/* 2026-11-10: 「다친 부위에 부담이 덜한 신발을 우선 추천」은 엔진 주석(「근거는 확인 못 함」)보다 센 말이라 바꿨다 */}
            <ChipRow title="달리다 아팠던 곳이 있나요?" optional
              hint="여러 개 골라도 돼요. 지금 아프다면 신발보다 병원 진료가 먼저예요."
              why="고른 부위에 따라 사이트 기준으로 점수를 조정해요."
              options={INJURY_OPTIONS}
              isActive={v => injuries.includes(v)}
              onPick={v => {
                handleChange();
                setInjuries(prev => {
                  if (prev.includes(v)) return prev.filter(i => i !== v);
                  if (v === "none") return ["none"];
                  return [...prev.filter(i => i !== "none"), v];
                });
              }} />
            <ChipRow title="예산은요?"
              options={BUDGETS.map(o => ({ value: String(o.value), label: o.label }))}
              isActive={v => budget === Number(v)}
              onPick={v => { setBudget(Number(v)); handleChange(); }} />

            {!isEditing && (
            <button type="submit"
              className="min-h-12 w-full rounded-xl bg-emerald-600 px-5 font-semibold text-white hover:bg-emerald-700 transition-colors text-base">
              추천 결과 보기
            </button>
            )}

            <p className="text-center text-xs text-gray-400 leading-relaxed -mt-2">
              키·체중·발 정보는 <strong className="font-medium text-gray-500">이 화면 계산에만</strong> 쓰이고 브라우저에서만 처리되며 서버에 저장되지 않아요.{" "}
              「추천 결과 보기」를 누르면{" "}
              <a href="/privacy" className="underline hover:text-gray-600">개인정보 처리방침</a>에 동의하는 것으로 간주합니다.
            </p>
          </>
        )}

        {/* 제출 검증 오류 — 어느 화면에 있든 보여야 한다 (2026-09-14). 인라인 편집의 「완료」 막힘도 여기 뜬다 */}
        {error && (!submitted || isEditing) && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
        )}

        {/* ── 이전 / 다음 버튼 ── */}
        {!submitted && (
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button type="button" onClick={goPrev}
                className="min-h-11 px-4 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                이전
              </button>
            )}
            {currentStep < TOTAL_STEPS - 1 && (
              <button type="button" onClick={() => {
                // 화면마다 필수 질문이 답해졌을 때만 넘어간다. 안 막으면 마지막 화면에서 되돌려 보내야 한다
                if (currentStep === 0 && !use) { setError("어떤 달리기를 하시는지 먼저 골라 주세요."); return; }
                if (currentStep === 1 && !heightRange) { setError("키를 골라 주세요."); return; }
                if (currentStep === 1 && !weightRange) { setError("체중도 골라 주세요."); return; }
                setError("");
                goNext();
              }}
                aria-disabled={(currentStep === 0 && !use) || (currentStep === 1 && (!heightRange || !weightRange))}
                className={`min-h-11 flex-1 px-4 rounded-lg text-sm font-semibold transition-colors ${
                  (currentStep === 0 && !use) || (currentStep === 1 && (!heightRange || !weightRange))
                    ? "bg-gray-200 text-gray-500"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}>
                다음
              </button>
            )}
          </div>
        )}

        {/* ── 인라인 편집 중 1순위 고정 ────────────────────────────
            모바일(네이버 유입의 대부분)에서 조건 패널을 펼치면 추천 목록이
            화면 밖으로 밀려난다. 바꾼 것이 무엇을 바꿨는지 안 보이면
            실시간 갱신은 의미가 없으므로, 1순위만 패널 안에 붙여둔다. */}
        {isEditing && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5">
            {!weightRange ? (
              <p className="text-sm text-amber-700">체중을 고르면 결과가 다시 나와요.</p>
            ) : topPick ? (
              <>
                <p className="text-xs font-bold tracking-wide text-emerald-700">지금 1순위</p>
                <p className="mt-0.5 truncate text-sm font-bold text-gray-900">
                  {topPick.shoe.brand} {topPick.shoe.model}
                </p>
                <p className="mt-0.5 text-xs text-gray-600">
                  {topPick.shoe.priceKrw.toLocaleString()}원
                  {topPick.shoe.successor && ` · 후속 ${topPick.shoe.successor} 출시됨`}
                </p>
                <p className="mt-2 text-xs text-emerald-700">아래 전체 목록도 같이 갱신됐어요 ↓</p>
              </>
            ) : (
              <p className="text-sm text-amber-700">
                이 조건에 맞는 신발이 없어요. 예산이나 발 조건을 조금 넓혀 보세요.
              </p>
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
              <Search size={18} strokeWidth={1.5} aria-hidden className="text-blue-900" />
              <h3 className="text-sm font-bold text-blue-900">내 분석 결과</h3>
            </div>

            {/* 2026-11-10 운영자 「왜 이렇게 길어」: 체형·「체중 반영 안 함」·케이던스 칩과 케이던스 설명 문단을 뺐다.
                고른 조건으로 결과가 왜 이렇게 나왔는지 한두 줄만 남긴다(recommend.ts buildProfileComment). 케이던스는 가이드 글에 있다 */}
            {result.profileComment && (
              <p className="text-base leading-relaxed text-blue-900">{result.profileComment}</p>
            )}

            {result.evidenceNote && (
              <p className="mt-2 text-sm text-blue-800">{result.evidenceNote}</p>
            )}
          </div>

          {result.usedFallback && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <TriangleAlert size={16} strokeWidth={1.5} aria-hidden className="mr-1 inline align-[-3px]" />{result.fallbackNote}
            </div>
          )}

          {/* 2026-11-06: 390px 에서 정렬 탭이 「적/합/도/순」 한 글자씩 세로로 쪼개졌다 — 좁으면 제목 아래로 내리고 글자는 줄바꿈하지 않는다 */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">내 조건에 맞는 신발</h2>
              <p className="text-xs text-gray-400 mt-0.5">발볼과 용도에 맞는 신발 중 {result.primary.length}켤레를 골랐어요.</p>
            </div>
            <div className="flex shrink-0 gap-1 self-start rounded-lg border border-gray-200 bg-gray-50 p-1">
              {([
                { key: "score" as SortKey,      label: "적합도순" },
                { key: "price_asc" as SortKey,  label: "가격 낮은순" },
                { key: "price_desc" as SortKey, label: "가격 높은순" },
              ] as { key: SortKey; label: string }[]).map(o => (
                <button key={o.key} type="button" onClick={() => setSortKey(o.key)}
                  className={`min-h-11 whitespace-nowrap px-3 rounded-md text-xs font-medium transition-colors
                    ${sortKey === o.key ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2026-11-10: 「비교 버튼을 누르면…」 안내 상자를 뺐다 — 카드마다 「비교」 버튼이 보여서 설명이 따로 필요 없다(운영자 「투머치」) */}

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

          {/* 2026-10-13 한계 고지 — Rundida 의 "Don't trust it for fit"·드롭 급변 주의를 보고 넣었다.
              하단 ※문단에 「직접 신어보고」가 있지만 작고 맨 끝이라, 사기 직전에 보이게 목록 바로 아래에 둔다.
              드롭 문장은 /injury/achilles #drop 이 말하는 만큼만 — 그 글은 「흔히 이야기된다」이고 인용 연구는 드롭 연구가 아니다. */}
          <ul className="mt-5 space-y-1.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
            <li>· 사이즈와 착용감은 화면으로 알 수 없어요. 매장에서 신어 보고 고르세요.</li>
            <li>
              · 지금 신발보다 뒤꿈치가 많이 낮은 신발로 바꾼다면 천천히 옮겨 가라고 흔히 권해요(확인된 근거는 아니에요).{" "}
              <a href="/injury/achilles#drop" className="font-medium underline">이유 보기</a>
            </li>
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

          <RelatedGuides footType={selectedType} footWidth={selectedWidth} use={use} injuries={injuries} />

          <p className="mt-10 text-xs text-gray-400 leading-relaxed">
            ※ 이 추천은 <span className="font-medium text-gray-500">참고용 정보</span>예요. 같은 신발도 달리는 페이스나 착지법에 따라 체감이 달라질 수 있으니, 최종 선택은 직접 신어보고 결정하세요. 의료 진단·전문 피팅을 대체하지 않으며, 통증·기저 질환이 있다면 전문 의료인과 상담 후 고르세요.{" "}
            <a href="/terms" className="underline hover:text-gray-600">자세한 고지 →</a>
          </p>
        </section>
      )}
    </main>
  );
}

function ShoeCard({ rec, rank, expanded, onToggle, inCompare, canAddCompare, onToggleCompare }: {
  rec: Recommendation; rank: number; expanded: boolean; onToggle: () => void;
  inCompare: boolean; canAddCompare: boolean; onToggleCompare: () => void;
}) {
  const { shoe, score, reasons } = rec;
  const buyLinks = resolveBuyLinks(shoe.id, shoe.buyLinks);
  const hasOfficial = buyLinks.some(l => l.isOfficial);

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
                // 2026-09-08: placehold.co → 자체 SVG. 사진 40장이 같은 외부 CDN 에
                // 있어서 그쪽이 막히면 대체 요청도 40개가 한꺼번에 나갔다.
                // 자세한 경위는 lib/shoes/placeholder.ts 주석에.
                const el = e.currentTarget as HTMLImageElement;
                el.onerror = null;
                el.src = shoePlaceholder(shoe.brand, 96, 96);
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-bold text-gray-400">#{rank}</span>
                  {shoe.genderFit === "womens_last" && <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">여성 전용 라스트</span>}
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
                        : "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                    }`
                  }
                >
                  {inCompare ? "✓ 비교중" : "비교"}
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {[
                `쿠션 ${CUSH_DOTS[shoe.cushioning]}`,
                STABILITY_LABEL[shoe.stability],
                `굽 차이 ${shoe.heelDropMm}mm`,
                `${shoe.weightGramsM9}g`,
                // 2026-11-10: B·D·2E 기호 대신 홈과 같은 말(좁게·보통·넓게)
                `발볼 ${shoe.widthOptions.map(w => ({ B: "좁게", D: "보통", "2E": "넓게", "4E": "아주 넓게" } as Record<string, string>)[w] ?? w).join("·")}`,
                shoe.uses.map(u => USE_LABEL[u]).join("·"),
              ].map((t, i) => <Tag key={i}>{t}</Tag>)}
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="text-base font-bold text-gray-900">
                  약 {shoe.priceKrw.toLocaleString()}원
                </span>
                <span className="text-xs text-gray-400">(${shoe.priceUsd} · 2026-06-01 추산)</span>
                {shoe.successor && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    후속 {shoe.successor} 출시됨
                  </span>
                )}
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ml-auto
                  ${shoe.krAvailability === "kr_official" ? "bg-emerald-100 text-emerald-700" :
                    shoe.krAvailability === "kr_parallel" ? "bg-blue-100 text-blue-700" :
                    "bg-orange-100 text-orange-700"}`}>
                  {KR_AVAILABILITY_LABEL[shoe.krAvailability]}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {buyLinks.map((link, li) => (
                  <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                    onClick={() => gtagEvent("buy_link_click", {
                      shoe: `${shoe.brand} ${shoe.model}`,
                      store: link.label,
                      // 제휴 링크 클릭을 따로 셀 수 있어야 수익 파이프가 실제로 도는지 잰다.
                      affiliate: link.isAffiliate ? "yes" : "no",
                    })}
                    className={`inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-colors
                      ${link.isOfficial || (!hasOfficial && li === 0) ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-gray-700 hover:bg-gray-800 text-white"}`}>
                    {link.isOfficial ? <Store size={16} strokeWidth={1.5} aria-hidden /> : <ShoppingCart size={16} strokeWidth={1.5} aria-hidden />} {link.label}{link.isAffiliate ? " · 제휴" : ""} ↗
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
                        : "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                    }`
                  }
                >
                  {inCompare ? "✓ 비교 중" : "비교 추가"}
                </button>
              </div>
              {/* 2026-11-10: 공식몰 상품 페이지로 바로 가는 신발(수집기 확인)에는 이 안내가 필요 없다 */}
              {!hasOfficial && (
                // 2026-11-10: 공식몰 링크가 없는 신발 — 한국 공식몰이 안 파는 모델(호카 다수·뉴발란스 520 v9 등)이거나
                // 공식몰이 지금 열리지 않는 곳(브룩스, lib/shoes/affiliate.ts OFFICIAL_DOWN). 첫 판매처를 초록 버튼으로 둔다
                <p className="text-xs text-gray-500 mt-1.5">공식몰에서 팔지 않거나 지금 열리지 않아서, 파는 곳으로 연결해요.</p>
              )}
              {hasOfficial && !buyLinks.some(l => l.isProductPage) && (
                <p className="text-xs text-gray-500 mt-1.5">
                  공식몰에서 안 보이면 위 모델명을 복사해 검색창에 붙여 넣으세요.
                </p>
              )}
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
                // 2026-09-21: 판단 필드가 선택이 됐다. 추천 결과에는 값이 있는 신발만
                // 오지만(recommend.ts 의 RECOMMENDABLE), 타입상 없을 수 있어 방어한다
                // 2026-10-06: 「권장 체중」「권장 신장」 행을 뺐다 — 출처 없는 사이트 분류이고 체중은 추천에 안 쓴다.
                ["한국 가격", `${shoe.priceKrw.toLocaleString()}원`],
              ].map(([label, value]) => (
                <div key={label} className="bg-white rounded-lg border border-gray-200 px-3 py-2">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/*
            라벨을 "과학적 추천 근거"에서 "설계 특징"으로 바꿨다.
            이 문장들은 폼·플레이트·지오메트리 같은 제품 설계 설명이고 상당수는 제조사 발표 수치다.
            논문 인용처럼 보이는 파란 박스에 담아두면 실제 근거 등급보다 높게 읽힌다.
          */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-700 mb-1">설계 특징</p>
            <p className="text-sm text-blue-800 leading-relaxed">{shoe.scienceBasis}</p>
            <p className="text-xs text-blue-600/70 mt-2 leading-relaxed">
              제조사 발표 수치와 일반적인 설계 설명이 섞여 있습니다. 논문으로 검증된 내용만은 아닙니다.
            </p>
          </div>

          {/* 2026-10-06: 「이 신발이 최적인 체형」 칩을 뺐다 — 체형 분류는 출처가 없고 추천에 안 쓴다. */}

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
            {/*
              ⚠️ 2026-09-16: 여기가 `shoe.buyLinks` 를 **그대로** 쓰고 있었다.
              결과 카드(위)는 `resolveBuyLinks` 를 거치는데 이 자리만 안 거쳐서,
              **상세를 펼친 사람 — 구매 의도가 가장 높은 사람 — 의 클릭이**
              제휴 링크로 안 바뀌고 GA 에도 안 잡혔다. 수수료도 계측도 둘 다 0.

              `pickTwoBuyLinks` 주석(2026-09-08)에 적힌 것과 같은 종류의 실패다 —
              치환 함수는 맞는데 **그 함수를 안 거치는 렌더 경로가 따로 있었다.**
              그래서 이번엔 `check:affiliate` 에 검사를 넣어 기계가 잡게 했다.
            */}
            <div className="flex flex-wrap gap-2 mb-3">
              {resolveBuyLinks(shoe.id, shoe.buyLinks).map(link => (
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                  onClick={() => gtagEvent("buy_link_click", {
                    shoe: `${shoe.brand} ${shoe.model}`,
                    store: link.label,
                    affiliate: link.isAffiliate ? "yes" : "no",
                  })}
                  className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors
                    ${link.isOfficial ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-gray-700 hover:bg-gray-800 text-white"}`}>
                  {link.isOfficial ? <Store size={16} strokeWidth={1.5} aria-hidden /> : <ShoppingCart size={16} strokeWidth={1.5} aria-hidden />}{link.isOfficial ? "공식 구매하기" : link.label}{link.isAffiliate ? " · 제휴" : ""} ↗
                </a>
              ))}
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <p>공식몰 접속 → 검색창에 모델명 붙여넣기 → 사이즈·색상 선택 후 구매</p>
              <p>공식몰 구매 시 정품 보장, 교환·반품 정책 적용됩니다.</p>
            </div>
            {/* 2026-11-09: 경쟁 리뷰 사이트로 링크하지 않는다(운영자 결정). 어디 값인지는 밝힌다 */}
            <p className="mt-3 text-xs text-gray-500">스펙은 브랜드 공식 표기와 공개된 실측 자료 기준이에요</p>
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
      {copied ? "✓ 링크 복사됨" : "결과 링크 복사"}
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
    { href: "/injury/wide-foot",  tag: "발볼",    title: "2E 와이드 뜻, 내 발볼도 넓은 편일까요?",       desc: "와이드 규격이 필요한지 판단하는 법." },
    { href: "/injury/knee-pain",  tag: "무릎",    title: "달리면 무릎 앞이 아파요, 어떻게 해야 낫나요?",              desc: "무릎 앞쪽이 아플 때 — 병원 갈 신호와 운동 2가지." },
    { href: "/injury/it-band",    tag: "무릎",    title: "달리면 무릎 바깥쪽이 아파요, 장경인대일까요?",             desc: "달릴 때 무릎 바깥쪽이 아플 때." },
  ],
  high_arch: [
    { href: "/injury/achilles",   tag: "아킬레스", title: "아킬레스건 통증, 달리기를 쉬어야 하나요?",   desc: "달린 뒤 종아리·아킬레스가 당길 때." },
    { href: "/injury/midfoot",    tag: "착지",    title: "미드풋 착지란? 힐스트라이크면 바꿔야 할까요?",       desc: "초보가 착지법을 바꿔야 하는지." },
  ],
  neutral: [
    { href: "/injury/cadence",    tag: "케이던스", title: "케이던스 높을수록 좋나요? 꼭 180이어야 하나요",                 desc: "지금보다 5~10% 올리면 무릎 부하가 줄었다는 연구(Heiderscheit 2011)." },
    { href: "/injury/beginner-guide", tag: "입문", title: "초보 러너, 일주일에 몇 번 얼마나 뛰나요?",                  desc: "처음 달리기 시작할 때 꼭 알아야 할 것들." },
  ],
};

const USE_GUIDE_MAP: Record<string, GuideItem> = {
  long:   { href: "/injury/first-10k",  tag: "장거리", title: "첫 10km 대회, 준비 기간과 페이스는?",               desc: "하프·풀 준비 전 10km부터 완주하는 법." },
  racing: { href: "/injury/advanced-guide", tag: "숙련", title: "마일리지 많이 뛰는 러너, 조심할 부상은 뭔가요?",               desc: "기록 단축을 위한 고강도 훈련 전략." },
  tempo:  { href: "/injury/intermediate-guide", tag: "중급", title: "러닝 거리를 늘릴 때, 부상은 어떻게 피하나요?",           desc: "템포런·인터벌 훈련을 안전하게 시작하는 법." },
  daily:  { href: "/injury/rest-day",   tag: "회복",  title: "러닝 쉬는 날, 가볍게라도 움직여야 하나요?",                  desc: "매일 달리고 싶다면 회복일이 더 중요합니다." },
};

/**
 * 부상 이력 → 해당 부위 가이드.
 *
 * 7단계에서 부상 이력을 물어놓고 결과 화면에서 아무 데도 쓰지 않고 있었다.
 * 발 타입보다 본인이 직접 고른 부상이 우선이므로 목록 맨 앞에 넣는다.
 */
const INJURY_GUIDE_MAP: Partial<Record<InjuryArea, GuideItem>> = {
  plantar:  { href: "/injury/plantar-fasciitis", tag: "족저근막", title: "족저근막염, 뭘 하면 낫고 얼마나 걸리나요?", desc: "스트레칭보다 효과가 확인된 방법과 회복 기간." },
  knee:     { href: "/injury/knee-pain",         tag: "무릎",     title: "달리면 무릎 앞이 아파요, 어떻게 해야 낫나요?",   desc: "무릎 앞쪽이 계단에서 아프다면 확인할 것들." },
  achilles: { href: "/injury/achilles",          tag: "아킬레스", title: "아킬레스건 통증, 달리기를 쉬어야 하나요?",        desc: "뒤꿈치 위쪽이 당길 때 읽어보세요." },
};

function RelatedGuides({ footType, footWidth, use, injuries }: { footType: FootType; footWidth: FootWidth; use: ShoeUse | ""; injuries: InjuryArea[] }) {
  const guides = [...(GUIDE_MAP[footType] ?? GUIDE_MAP["neutral"])];
  if (footWidth === "wide" && !guides.find(g => g.href === "/injury/wide-foot")) {
    guides.unshift({ href: "/injury/wide-foot", tag: "발볼", title: "2E 와이드 뜻, 내 발볼도 넓은 편일까요?", desc: "2E·4E 규격이 필요한지 판단하는 방법." });
  }
  // 본인이 고른 부상이 가장 강한 신호다 — 맨 앞으로.
  for (const area of injuries) {
    const g = INJURY_GUIDE_MAP[area];
    if (g && !guides.find(x => x.href === g.href)) guides.unshift(g);
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
          {/* 2026-10-12: 표의 두께·드롭 숫자를 같은 축척 그림으로 — components/ShoeSideProfile.tsx */}
          <div className="mt-4">
            <ShoeSideProfile shoes={shoes} />
          </div>
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
          <span className="text-2xl text-gray-500">vs</span>
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
    // 2026-10-06: 「(평발용)」「(심한 평발)」을 뺐다. 라벨이 처방이 되면 안 된다 — 발 타입별 처방 근거는
    // 갈린다(Richards 2009 지지 연구 없음 / Malisoux 2016 회내 발에서 모션컨트롤화 이득).
    stability: "안정화",
    motion_control: "모션컨트롤",
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
  // 2026-09-21: footTypes 가 선택 필드가 됐다. 비어 있으면 「판단 전」으로 적는다 —
  // 빈 칸은 "해당 없음"으로 읽히는데 실제로는 "아직 안 정했다"다
  const toFootText = (types?: string[]) =>
    types && types.length > 0 ? types.map(f => footTypeKr[f] ?? f).join(" · ") : "판단 전";

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
        <summary className="cursor-pointer font-medium text-emerald-700 hover:text-emerald-900">용어 설명 보기</summary>
        <ul className="mt-2 space-y-1 leading-relaxed">
          <li><strong>쿠셔닝</strong> — 밑창의 두께·푹신함. 많을수록 푹신하지만 무거워짐. 쿠션이 관절을 지켜 준다는 근거는 생각보다 약함.</li>
          <li><strong>안정화</strong> — 발이 안쪽으로 쏠리는 걸 줄이도록 만든 구조. 평발에 도움이 되는지는 연구가 갈림(발이 안쪽으로 쏠리는 러너에서 모션컨트롤화가 부상 위험을 낮춘 RCT 1건, Malisoux 2016).</li>
          <li><strong>힐드롭</strong> — 뒤꿈치와 앞발의 높이 차이(mm). 낮은 쪽(0–4mm)과 높은 쪽(8mm+) 중 부상에 유리한 쪽이 있다는 근거는 확인하지 못함.</li>
          <li><strong>스택높이</strong> — 밑창 두께. 높을수록 쿠션이 많고, 낮을수록 지면 감각이 살아있음.</li>
          <li><strong>발볼</strong> — D=표준, 2E=넓음(와이드), 4E=매우 넓음. 발이 넓으면 2E 이상 권장.</li>
        </ul>
      </details>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {[a, b].map((shoe) => {
          // 2026-09-16: 여기도 제휴 치환을 안 거치고 있었다(1151행과 같은 사고).
          // 공식 우선 규칙은 `pickTwoBuyLinks` 가 이미 갖고 있으므로 그대로 쓰고,
          // **치환을 먼저 한 뒤에** 고른다 — 순서가 바뀌면 제휴 링크가 안 뽑힌다.
          const link = pickTwoBuyLinks(resolveBuyLinks(shoe.id, shoe.buyLinks))[0];
          return link ? (
            <a
              key={shoe.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => gtagEvent("buy_link_click", {
                shoe: `${shoe.brand} ${shoe.model}`,
                store: link.label,
                affiliate: link.isAffiliate ? "yes" : "no",
              })}
              className="block text-center text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl transition-colors"
            >
              {shoe.brand} {shoe.model} 구매 ↗
            </a>
          ) : null;
        })}
      </div>
    </div>
  );
}
