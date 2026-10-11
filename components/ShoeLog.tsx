"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * 내 러닝화 기록장 (2026-10-12)
 *
 * 수명 계산기는 「주당 거리 × 주」로 한 번 셈하고 끝난다. 실제로 쓰려면 **달릴 때마다 더해야** 한다.
 * 그래서 신발별로 달린 거리를 적어 두고, 연구가 측정한 지점(160·320·480·640km)에 얹어 보여준다.
 *
 * 저장 — 이 브라우저의 localStorage 에만 둔다.
 *   · 로그인·서버 저장을 붙이지 않았다. 개인 기록을 우리 DB 에 둘 이유가 아직 없다
 *   · 그래서 다른 기기·브라우저에서는 안 보이고, 사이트 데이터를 지우면 사라진다 — 화면에 그대로 적는다
 *   · 읽기·쓰기는 전부 try/catch. 사생활 보호 모드 등에서 막혀도 화면은 동작한다(그때는 새로고침하면 사라진다고 알린다)
 *
 * 판정은 하지 않는다 — 「교체하세요」라고 말하지 않는다. 480km 를 넘었다는 사실과 그 연구가 본 것만 적는다.
 */

const KEY = "dd-shoe-log-v1";
const MARKS = [160, 320, 480, 640];
const KEY_KM = 480;

type Run = { d: string; km: number };
type LogShoe = { id: string; name: string; baseKm: number; runs: Run[]; created: string };

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * 저장된 값은 믿지 않는다 — 다른 버전·손으로 고친 값·깨진 값이 들어올 수 있다.
 * (council 2026-10-12: baseKm 이 문자열 "10" 이면 "10"+0 = "100" 으로 이어 붙는 버그가 있었다)
 */
function sanitize(raw: unknown): LogShoe[] {
  if (!Array.isArray(raw)) return [];
  const out: LogShoe[] = [];
  const seen = new Set<string>();
  for (const x of raw) {
    if (!x || typeof x !== "object") continue;
    const o = x as Record<string, unknown>;
    const name = typeof o.name === "string" ? o.name.slice(0, 60) : "";
    if (!name) continue;
    let id = typeof o.id === "string" && o.id ? o.id : `${Date.now()}-${out.length}`;
    if (seen.has(id)) id = `${id}-${out.length}`;
    seen.add(id);
    const baseKm = Math.max(0, Number(o.baseKm) || 0);
    const runs = Array.isArray(o.runs)
      ? o.runs
          .map((r) => ({ d: typeof (r as Run)?.d === "string" ? (r as Run).d : "", km: Number((r as Run)?.km) }))
          .filter((r) => Number.isFinite(r.km) && r.km > 0 && r.km <= 200)
      : [];
    out.push({ id, name, baseKm, runs, created: typeof o.created === "string" ? o.created : "" });
  }
  return out;
}

function totalOf(s: LogShoe) {
  return Math.round((s.baseKm + s.runs.reduce((a, r) => a + r.km, 0)) * 10) / 10;
}

export type CatalogItem = { id: string; brand: string; model: string };

export default function ShoeLog({ catalog }: { catalog: CatalogItem[] }) {
  const CATALOG = catalog;
  const [shoes, setShoes] = useState<LogShoe[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [notice, setNotice] = useState("");
  const [pick, setPick] = useState("");
  const [custom, setCustom] = useState("");
  const [base, setBase] = useState("");
  const [runKm, setRunKm] = useState<Record<string, string>>({});
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      let raw: string | null = null;
      try {
        raw = window.localStorage.getItem(KEY);
      } catch {
        setStorageOk(false);
        return;
      }
      if (!raw) return;
      try {
        setShoes(sanitize(JSON.parse(raw)));
      } catch {
        setNotice("저장된 기록을 읽지 못했습니다(형식이 깨짐). 새로 등록하면 덮어씁니다.");
      }
    };
    read();
    setLoaded(true);
    // 다른 탭에서 고치면 이 탭도 따라간다 — 오래된 탭이 새 기록을 덮어쓰지 않게
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) read();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function save(next: LogShoe[]) {
    setShoes(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      setStorageOk(false);
    }
  }

  function exportFile() {
    try {
      const blob = new Blob([JSON.stringify({ app: "ddaiga-shoe-log", v: 1, shoes }, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `running-shoe-log-${today()}.json`;
      document.body.appendChild(a); // 문서에 붙어 있어야 파일 이름이 적용되는 브라우저가 있다
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } catch {
      setNotice("이 브라우저에서는 파일로 내보낼 수 없습니다.");
    }
  }

  function importFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (f.size > 1_000_000) {
      setNotice("파일이 너무 큽니다.");
      return;
    }
    f.text()
      .then((txt) => {
        const j = JSON.parse(txt) as { shoes?: unknown } | unknown[];
        const list = sanitize(Array.isArray(j) ? j : (j as { shoes?: unknown }).shoes);
        if (!list.length) {
          setNotice("불러올 기록이 없습니다.");
          return;
        }
        // 같은 id 는 파일 쪽으로 바꾸고, 나머지는 그대로 둔다
        const ids = new Set(list.map((x) => x.id));
        save([...list, ...shoes.filter((x) => !ids.has(x.id))]);
        setNotice(`신발 ${list.length}개를 불러왔습니다.`);
      })
      .catch(() => setNotice("이 파일은 기록장 파일이 아닙니다."));
  }

  function track(name: string, params: Record<string, unknown>) {
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof g === "function") g("event", name, params);
  }

  function addShoe() {
    const fromCatalog = CATALOG.find((s) => s.id === pick);
    const name = fromCatalog ? `${fromCatalog.brand} ${fromCatalog.model}` : custom.trim();
    if (!name) return;
    const b = Math.max(0, Number(base) || 0);
    const item: LogShoe = { id: `${Date.now()}`, name: name.slice(0, 60), baseKm: b, runs: [], created: today() };
    save([item, ...shoes]);
    setPick("");
    setCustom("");
    setBase("");
    setOpenId(item.id);
    track("shoe_log_add_shoe", { catalog: fromCatalog ? fromCatalog.id : "custom" });
  }

  function addRun(id: string, km: number) {
    if (!(km > 0 && km <= 200)) return;
    save(shoes.map((s) => (s.id === id ? { ...s, runs: [{ d: today(), km: Math.round(km * 10) / 10 }, ...s.runs] } : s)));
    setRunKm((p) => ({ ...p, [id]: "" }));
    track("shoe_log_add_run", { km });
  }

  function removeRun(id: string, idx: number) {
    save(shoes.map((s) => (s.id === id ? { ...s, runs: s.runs.filter((_, i) => i !== idx) } : s)));
  }

  function removeShoe(id: string) {
    save(shoes.filter((s) => s.id !== id));
    setConfirmDel(null);
  }

  return (
    <section id="log" className="mb-10 scroll-mt-20 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
      <h2 className="mb-1 text-xl font-bold text-gray-900">내 러닝화 기록장</h2>
      <p className="mb-4 text-sm leading-relaxed text-gray-600">
        신발을 등록하고 달릴 때마다 거리를 더하세요. 누적 거리를 위 연구의 측정 지점(160·320·480·640km)에 얹어 보여줍니다.
      </p>

      {/* 신발 등록 */}
      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">
        <p className="mb-2 text-sm font-medium text-gray-900">신발 등록</p>
        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_110px_auto]">
          <select
            aria-label="목록에서 신발 고르기"
            value={pick}
            onChange={(e) => { setPick(e.target.value); if (e.target.value) setCustom(""); }}
            className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm"
          >
            <option value="">목록에서 고르기</option>
            {CATALOG.map((s) => (
              <option key={s.id} value={s.id}>{s.brand} {s.model}</option>
            ))}
          </select>
          <input
            value={custom}
            onChange={(e) => { setCustom(e.target.value); if (e.target.value) setPick(""); }}
            placeholder="또는 직접 입력"
            aria-label="신발 이름 직접 입력"
            maxLength={60}
            className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            value={base}
            onChange={(e) => setBase(e.target.value)}
            type="number" min="0" inputMode="decimal"
            placeholder="이미 뛴 km"
            aria-label="등록 전에 이미 뛴 거리(km)"
            className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            onClick={addShoe}
            disabled={!pick && !custom.trim()}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:bg-gray-300"
          >
            등록
          </button>
        </div>
      </div>

      {loaded && shoes.length === 0 && (
        <p className="mb-4 text-sm text-gray-500">아직 등록한 신발이 없습니다.</p>
      )}

      <ul className="space-y-3">
        {shoes.map((s) => {
          const total = totalOf(s);
          const pct = Math.min(100, (total / 640) * 100);
          const open = openId === s.id;
          return (
            <li key={s.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <p className="font-medium text-gray-900">{s.name}</p>
                <p className="shrink-0 font-mono text-lg font-bold text-gray-900">
                  {total.toLocaleString()}<span className="ml-0.5 text-sm font-normal text-gray-500">km</span>
                </p>
              </div>
              <div className="relative mb-1 h-2.5 w-full rounded-full bg-gray-200">
                <div className={`h-2.5 rounded-full ${total >= KEY_KM ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${pct}%` }} />
              </div>
              {/* 눈금은 0~640km 선형 축 위 실제 위치에 둔다(justify-between 이면 160 이 왼쪽 끝에 붙는다) */}
              <div className="relative mb-3 h-4 text-[11px] text-gray-400">
                {MARKS.map((m) => (
                  <span
                    key={m}
                    className={`absolute ${m === 640 ? "-translate-x-full" : "-translate-x-1/2"} ${total >= m ? "font-semibold text-gray-700" : ""}`}
                    style={{ left: `${(m / 640) * 100}%` }}
                  >
                    {m}
                  </span>
                ))}
              </div>
              {total >= KEY_KM && (
                <p className="mb-3 rounded-lg bg-amber-50 p-2 text-xs leading-relaxed text-amber-900">
                  480km를 넘었습니다. 위 연구에서 이 시점의 뒤꿈치 쿠셔닝은 16~33% 줄어 있었고, 참가자들은 그 변화를 느끼지 못했습니다.
                  교체 여부는 직접 판단하세요 — 쿠셔닝 감소가 부상으로 이어지는지는 그 연구가 보지 않았습니다.{" "}
                  <Link href="/shoe-finder" className="underline">다음 신발 후보 보기 →</Link>
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {[3, 5, 10].map((k) => (
                  <button key={k} onClick={() => addRun(s.id, k)} className="rounded-lg border border-emerald-300 px-3 py-1.5 text-sm text-emerald-800 hover:bg-emerald-50">
                    +{k}km
                  </button>
                ))}
                <input
                  value={runKm[s.id] ?? ""}
                  onChange={(e) => setRunKm((p) => ({ ...p, [s.id]: e.target.value }))}
                  type="number" min="0" step="0.1" inputMode="decimal"
                  placeholder="km"
                  aria-label={`${s.name}에 더할 거리(km)`}
                  className="w-20 rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                />
                <button onClick={() => addRun(s.id, Number(runKm[s.id]))} className="rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-white">
                  더하기
                </button>
                <button onClick={() => setOpenId(open ? null : s.id)} className="ml-auto text-xs text-gray-500 underline">
                  {open ? "기록 닫기" : `기록 ${s.runs.length}개`}
                </button>
              </div>

              {open && (
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <p className="mb-2 text-xs text-gray-500">
                    등록 {s.created}{s.baseKm > 0 && ` · 등록 전 ${s.baseKm}km`}
                  </p>
                  {s.runs.length === 0 ? (
                    <p className="text-xs text-gray-400">아직 더한 기록이 없습니다.</p>
                  ) : (
                    <ul className="max-h-48 space-y-1 overflow-y-auto text-sm">
                      {s.runs.map((r, i) => (
                        <li key={i} className="flex items-center justify-between rounded bg-gray-50 px-2 py-1">
                          <span className="text-gray-600">{r.d}</span>
                          <span className="font-mono text-gray-900">{r.km}km</span>
                          <button onClick={() => removeRun(s.id, i)} className="text-xs text-gray-400 hover:text-red-600">지우기</button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-3 text-right">
                    {confirmDel === s.id ? (
                      <span className="text-xs">
                        <span className="mr-2 text-gray-600">이 신발과 기록을 지울까요?</span>
                        <button onClick={() => removeShoe(s.id)} className="mr-2 font-medium text-red-600">지우기</button>
                        <button onClick={() => setConfirmDel(null)} className="text-gray-500">취소</button>
                      </span>
                    ) : (
                      <button onClick={() => setConfirmDel(s.id)} className="text-xs text-gray-400 hover:text-red-600">신발 삭제</button>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {shoes.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <button onClick={exportFile} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-gray-700">
            기록 파일로 내보내기
          </button>
          <label className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-gray-700">
            파일에서 불러오기
            <input type="file" accept="application/json,.json" onChange={importFile} className="hidden" />
          </label>
          {confirmDel === "__all" ? (
            <span>
              <span className="mr-2 text-gray-600">모든 신발과 기록을 지울까요?</span>
              <button onClick={() => { save([]); setConfirmDel(null); }} className="mr-2 font-medium text-red-600">전부 지우기</button>
              <button onClick={() => setConfirmDel(null)} className="text-gray-500">취소</button>
            </span>
          ) : (
            <button onClick={() => setConfirmDel("__all")} className="text-gray-400 hover:text-red-600">전부 지우기</button>
          )}
        </div>
      )}
      {shoes.length === 0 && (
        <label className="mt-4 inline-block cursor-pointer text-xs text-gray-500 underline">
          내보낸 기록 파일 불러오기
          <input type="file" accept="application/json,.json" onChange={importFile} className="hidden" />
        </label>
      )}
      {notice && <p className="mt-2 text-xs text-amber-800">{notice}</p>}

      <p className="mt-4 text-[11px] leading-relaxed text-gray-500">
        기록은 이 기기의 이 브라우저에만 저장되고 서버로 보내지 않습니다. 다른 기기에서는 보이지 않고, 브라우저의 사이트 데이터를 지우면
        사라집니다 — 옮기거나 보관하려면 파일로 내보내세요. 여러 사람이 쓰는 PC라면 다 쓴 뒤 「전부 지우기」를 누르세요.
        {!storageOk && " 지금 브라우저에서는 저장이 막혀 있어 새로고침하면 기록이 사라집니다(사생활 보호 모드 등)."}
      </p>
    </section>
  );
}
