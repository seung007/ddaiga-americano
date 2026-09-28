/**
 * 링크 판정 — **브라우저로 연 페이지의 글자**를 보고 "찾던 모델이 보이는가"를 정한다.
 *
 * `check-links-browser.mjs` 가 쓴다. 네트워크·브라우저에 의존하지 않는 순수 함수만 둔다 —
 * 그래야 오프라인에서 시험할 수 있고(`check-links-browser.mjs --selftest`),
 * 같은 함수를 실제 페이지 안에서 돌려 검증할 수도 있다.
 *
 * 판정은 **보수적으로** 한다. 확신할 수 없는 것은 "모델 안 보임(사람 확인)"으로 올리고
 * 데이터를 자동으로 고치지 않는다. 이 저장소의 원칙 — 기계는 자리를 좁히고, 사람이 정한다.
 */

/** 공백·하이픈·괄호·점을 지우고 소문자로. 한글 페이지("클리프톤 10")와 영문("Clifton-10")을 같은 모양으로 만든다 */
export function compact(s) {
  return String(s ?? "")
    .normalize("NFKC")
    .toLowerCase()
    // 숫자와 숫자 사이의 공백은 「|」로 남긴다 — 지우면 「카야노 32 199,000원」이 「카야노32199,000」로 붙어
    // 세대 번호를 못 읽는다 (2026-09-28 자체 시험에서 잡힘)
    .replace(/(\d)[\s\-_.·・]+(?=\d)/g, "$1|")
    .replace(/[\s\-_.·・()[\]{}'"’`]/g, "");
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** 별칭 파일에 없는 수식어의 한글 표기. 한글 쇼핑몰은 「리벨리온 프로」「클라우드서퍼 맥스」처럼 쓴다 */
const MODIFIER_KO = [["Pro", "프로"], ["Flash", "플래시"], ["Max", "맥스"], ["Next", "넥스트"], ["Plus", "플러스"],
  ["Elite", "엘리트"], ["Speed", "스피드"], ["Hyper", "하이퍼"], ["Sky", "스카이"], ["Edge", "엣지"], ["NITRO", "나이트로"], ["SL", "SL"]];

/** 라인·기술 이름 접두어 — 이걸 뗀 꼬리도 키로 쓴다 ("Gel-Kayano" → "kayano", "Fresh Foam X 1080" → "1080") */
const PREFIXES = ["gel", "freshfoamx", "fuelcell", "zoomx", "adizero", "nike", "hoka"];

/**
 * aliases.ts 원문에서 `{ match: /…/, ko: [...] }` 를 뽑는다. TS 를 실행하지 않으려고 정규식으로 읽는다.
 * @returns {{ re: RegExp, ko: string[] }[]}
 */
export function parseAliases(tsSource) {
  const out = [];
  for (const m of tsSource.matchAll(/\{\s*match:\s*\/((?:\\\/|[^/])+)\/\s*,\s*ko:\s*\[([^\]]*)\]/g)) {
    const ko = [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
    if (ko.length) out.push({ re: new RegExp(m[1]), ko });
  }
  return out;
}

/** "Gel-Kayano 32" → { series: "Gel-Kayano", gen: "32" }. 세대 번호가 없으면 gen = null */
function splitGen(name) {
  // 구분자 없이 붙은 것도 받는다 — 별칭 치환 뒤 「모어6」「고스트맥스4」처럼 붙는다
  const m = name.trim().match(/^(.*?\D)[\s-]*v?(\d{1,4})$/i);
  return m ? { series: m[1], gen: m[2] } : { series: name.trim(), gen: null };
}

/**
 * 모델명 → 페이지에서 찾을 키들.
 * 영문 이름, 한글 이름(aliases.ts 로 치환), 그리고 접두어를 뗀 꼬리.
 * @returns {{ gen: string|null, keys: string[] }}
 */
export function modelSpec(model, aliases) {
  const base = model.replace(/\s*\((여성|Wide|와이드)\)\s*/gi, " ").replace(/\s+/g, " ").trim();
  // 한글 조합: 별칭을 긴 것부터 차례로 치환 ("Pegasus Plus" → "페가수스 플러스")
  let variants = [base];
  const sorted = [...aliases].sort((a, b) => b.re.source.length - a.re.source.length);
  for (const a of sorted) {
    if (!a.re.test(base)) continue;
    const next = [];
    for (const v of variants) {
      if (!a.re.test(v)) { next.push(v); continue; }
      for (const ko of a.ko) next.push(v.replace(a.re, ko));
    }
    variants = [...new Set(next)].slice(0, 12);
  }
  // 별칭이 안 덮은 영문 수식어도 한글로 ("웨이브 리벨리온 Pro 3" → "웨이브 리벨리온 프로 3")
  variants = variants.flatMap((v) => {
    if (!/[가-힣]/.test(v)) return [v];
    let w = v;
    for (const [en, ko] of MODIFIER_KO) w = w.replace(new RegExp(`\\b${en}\\b`, "gi"), ko);
    return w === v ? [v] : [v, w];
  });
  // 한글이 섞였으면 앞에 남은 영문 단어를 뗀다 ("Fresh Foam X 프레시폼 1080" → "프레시폼 1080")
  variants = variants.flatMap((v) => (/[가-힣]/.test(v) ? [v, v.replace(/^[A-Za-z0-9+\s-]+?(?=[가-힣])/, "")] : [v]));
  variants.push(base);

  const { gen } = splitGen(base);
  const keys = new Set();
  for (const v of variants) {
    const s = compact(splitGen(v).series);
    if (s.length >= 3 || /[가-힣]{2,}/.test(s)) keys.add(s);
    for (const p of PREFIXES) if (s.startsWith(p) && s.length - p.length >= 3) keys.add(s.slice(p.length));
  }
  return { gen, keys: [...keys] };
}

/** 모델이 몇 번 나오나 — 키마다 세고 가장 많은 값 (「젤카야노」「카야노」는 같은 자리를 겹쳐 센다) */
export function countModel(ctext, spec) {
  let best = 0;
  for (const k of spec.keys) {
    if (!spec.gen && k.length < 4) continue;
    const re = spec.gen ? new RegExp(`${esc(k)}[^0-9]{0,6}?v?${spec.gen}(?![0-9])`, "g") : new RegExp(esc(k), "g");
    best = Math.max(best, [...ctext.matchAll(re)].length);
  }
  return best;
}

/** 검색형 링크의 검색어. 페이지가 검색어를 제목·머리글에 **되풀이**하므로, 그만큼은 모델이 보인 것으로 치지 않는다 */
export function queryOf(url) {
  try {
    const u = new URL(url);
    for (const k of ["q", "keyword", "query", "search_text", "schWord", "kwd", "searchWord"]) {
      const v = u.searchParams.get(k);
      if (v) return v;
    }
  } catch {}
  return null;
}

/** 페이지 글자(compact 된 것)에 모델이 있는가. 세대가 있으면 키 **바로 뒤**(6자 이내)에 그 번호가 와야 한다 */
export function hasModel(ctext, spec) {
  for (const k of spec.keys) {
    if (!spec.gen) {
      if (k.length >= 4 && ctext.includes(k)) return true;
      continue;
    }
    const re = new RegExp(`${esc(k)}[^0-9]{0,6}?v?${spec.gen}(?![0-9])`);
    if (re.test(ctext)) return true;
  }
  return false;
}

const ZERO = ["검색결과가없습니다", "검색결과0개", "검색결과0건", "검색된상품이없습니다", "일치하는상품이없습니다",
  "검색결과없음", "결과가없습니다", "상품이없습니다", "noresultsfound", "0results", "검색어와일치하는"];
const BLOCKED = ["accessdenied", "보안문자", "captcha", "자동입력방지", "비정상적인접근", "requestblocked", "edgesuite", "pleaseverifyyouarehuman"];

/**
 * 가격 후보 — 모델 이름 **바로 뒤 160자** 안에 적힌 원화 금액들.
 * 할인가·다른 색상 가격도 섞여 들어온다. 그래서 자동으로 고치지 않고 후보로만 보여준다.
 */
export function priceCandidates(ctext, spec) {
  const found = new Set();
  for (const k of spec.keys) {
    const re = spec.gen ? new RegExp(`${esc(k)}[^0-9]{0,6}?v?${spec.gen}(?![0-9])`, "g") : new RegExp(esc(k), "g");
    for (const m of ctext.matchAll(re)) {
      const tail = ctext.slice(m.index + m[0].length, m.index + m[0].length + 160);
      for (const p of tail.matchAll(/₩?(\d{1,3}(?:,\d{3})+)원?/g)) {
        const n = Number(p[1].replace(/,/g, ""));
        if (n >= 30000 && n <= 800000) found.add(n);
      }
      if (found.size >= 8) break;
    }
  }
  return [...found].slice(0, 8);
}

/** 브랜드 홈·전체 목록처럼 **모델과 무관하게 거는 링크** — 살아 있는지만 본다 */
export function isGenericLink(url) {
  return /musinsa\.com\/brand\//.test(url) || /on\.com\/ko-kr\/shop\/mens\/shoes\/?$/.test(url);
}

/**
 * 신발 구매 링크 한 개 판정.
 * @param page {{ ok: boolean, status?: number, error?: string, text?: string, title?: string }}
 * @returns {{ verdict: string, note?: string, prices?: number[] }}
 *   verdict: ok · 후속작만 · 0건 · 모델없음 · 차단 · 죽음 · 목록형
 */
/**
 * 서버가 **브라우저를 거절**한 것인가. 링크가 죽은 것과 다르다.
 * 2026-09-28 첫 실행: KREAM 101개가 전부 `ERR_HTTP_RESPONSE_CODE_FAILURE` — 사람 Chrome 으로는 같은 주소가 열렸다.
 * 그걸 「죽음」으로 찍으면 링크 101개를 지우게 된다. 「차단」으로 두고 창을 띄운 브라우저로 한 번 더 본다.
 */
export function isRefusal(page) {
  return page.blocked === true || page.status === 403 || page.status === 429 || /ERR_HTTP_RESPONSE_CODE_FAILURE/.test(page.error ?? "");
}

/** 검색 주소가 **홈으로 튕겼나** — 써코니가 그랬다(2026-09-28). 홈 화면에 우연히 그 모델이 있으면 ok 로 읽히므로 먼저 본다 */
export function bouncedHome(originalUrl, finalUrl) {
  if (!queryOf(originalUrl) || !finalUrl) return false;
  try {
    const f = new URL(finalUrl);
    return (f.pathname === "/" || f.pathname === "") && !f.search;
  } catch { return false; }
}

/** 사람이 볼 증거 — 페이지에서 그 계열 이름이 들어간 줄 몇 개 (「뭐가 대신 떴나」를 다시 안 열어 봐도 되게) */
export function seenLines(text, spec, max = 6) {
  const out = [];
  for (const line of String(text ?? "").split("\n")) {
    const l = line.trim();
    if (!l || l.length > 90) continue;
    const c = compact(l);
    if (spec.keys.some((k) => c.includes(k)) && !out.includes(l)) out.push(l);
    if (out.length >= max) break;
  }
  return out;
}

export function judgeShoePage(page, shoe, aliases, { wantPrice = false } = {}) {
  if (isRefusal(page)) return { verdict: "차단", note: page.error ?? `HTTP ${page.status}` };
  if (!page.ok) return { verdict: "죽음", note: page.error ?? `HTTP ${page.status}` };
  if (bouncedHome(page.url, page.finalUrl)) return { verdict: "죽음", note: `검색이 홈(${page.finalUrl})으로 튕김 — 주소 형태가 바뀌었다` };
  const ctext = compact(`${page.title ?? ""} ${page.text ?? ""}`);
  if (BLOCKED.some((b) => ctext.includes(b))) return { verdict: "차단", note: `HTTP ${page.status} · 차단 안내문` };
  if (page.status >= 400) return { verdict: "죽음", note: `HTTP ${page.status}` };
  if (ctext.length < 200) return { verdict: "모델없음", note: `본문 ${ctext.length}자 — 페이지가 비었거나 아직 안 그려짐` };
  if (isGenericLink(page.url ?? "")) return { verdict: "목록형" };

  // 0건 문구를 먼저 본다 — 「"큐뮬러스28"에 대한 검색결과 0개」는 검색어 자체가 모델명이라 아래에서 ok 로 읽힌다
  const spec = modelSpec(shoe.model, aliases);
  if (ZERO.some((z) => ctext.includes(z))) return { verdict: "0건", seen: seenLines(page.text, spec) };
  // 검색어에 모델이 들어 있으면 페이지가 제목·머리글로 검색어를 되풀이한다. 그 되풀이 횟수(최대 2)보다 많아야 상품이 있는 것
  const q = queryOf(page.url ?? "");
  const cq = q ? compact(q) : "";
  const echo = cq && hasModel(cq, spec) ? Math.min(ctext.split(cq).length - 1, 2) : 0;
  const need = echo + 1;
  if (countModel(ctext, spec) >= need) {
    const prices = wantPrice ? priceCandidates(ctext, spec) : undefined;
    return { verdict: "ok", prices };
  }
  if (shoe.successor && hasModel(ctext, modelSpec(shoe.successor, aliases)))
    return { verdict: "후속작만", note: shoe.successor, seen: seenLines(page.text, spec) };
  return { verdict: "모델없음", note: `찾은 키: ${spec.keys.slice(0, 4).join(", ")}${spec.gen ? ` + ${spec.gen}` : ""}`, seen: seenLines(page.text, spec) };
}

/**
 * 「이미 끝났다」를 뜻하는 문구만. 「접수마감 후 환불 불가」처럼 **규정 문장에 들어가는 낱말**(접수마감·모집마감)은
 * 넣지 않는다 — 울산 인권 요강이 정확히 그 문장을 갖고 있다(2026-09-28 확인).
 */
const CLOSED = ["마감되었습니다", "마감됐습니다", "접수가마감", "신청이마감", "접수가종료", "접수종료되었", "신청이종료",
  "접수를마감", "마감완료", "신청마감되었"];
const GENERIC_NAME = /^(제?\d+회|\d{4}|마라톤|대회|전국|국제|기념|하프|풀|런|run|race|the|with|&|in|x|and|대축제|페스티벌|걷기|달리기)$/i;

/**
 * 대회 공식 링크 한 개 판정.
 * @returns {{ verdict: string, note?: string }}
 *   verdict: ok · 마감문구 · 대회명없음 · 연도없음 · 차단 · 죽음
 */
export function judgeRacePage(page, race, displayStatus) {
  if (isRefusal(page)) return { verdict: "차단", note: page.error ?? `HTTP ${page.status}` };
  if (!page.ok) return { verdict: "죽음", note: page.error ?? `HTTP ${page.status}` };
  const ctext = compact(`${page.title ?? ""} ${page.text ?? ""}`);
  if (BLOCKED.some((b) => ctext.includes(b))) return { verdict: "차단", note: `HTTP ${page.status} · 차단 안내문` };
  if (page.status >= 400) return { verdict: "죽음", note: `HTTP ${page.status}` };

  const tokens = race.name
    .replace(/[()·,&]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !GENERIC_NAME.test(w))
    .map(compact)
    .filter((w) => w.length >= 2);
  const nameHit = tokens.length === 0 || tokens.some((t) => ctext.includes(t));
  const year = race.date ? race.date.slice(0, 4) : null;
  const notes = [];
  if (!nameHit) notes.push(`대회명 단어(${tokens.slice(0, 3).join("·")})가 안 보임`);
  if (year && !ctext.includes(year)) notes.push(`${year} 가 안 보임 — 작년 페이지일 수 있음`);

  const open = displayStatus === "접수중" || displayStatus === "마감임박" || displayStatus === "접수예정";
  const closedWord = CLOSED.find((c) => ctext.includes(c));
  if (open && closedWord) return { verdict: "마감문구", note: `우리는 「${displayStatus}」, 페이지에 「${closedWord}」` + (notes.length ? ` · ${notes.join(" · ")}` : "") };
  if (!nameHit) return { verdict: "대회명없음", note: notes.join(" · ") };
  if (notes.length) return { verdict: "연도없음", note: notes.join(" · ") };
  return { verdict: "ok" };
}
