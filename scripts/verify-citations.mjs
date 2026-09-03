#!/usr/bin/env node
/**
 * 인용 검증기 — 페이지에 적힌 저자·연도가 링크된 논문과 실제로 일치하는지 확인한다.
 *
 * 왜 만들었나
 * ───────────
 * 2026-08 전수 점검에서 검증 가능한 인용 21건 중 14건이 틀렸다. 유형은 네 가지였다.
 *
 *   (a) 링크가 아예 다른 논문      — 러닝 페이지에 비선형 광학 화학 논문(PMID 21302337)
 *   (b) 저자명 오기               — "Beyer et al. (2023)"의 제1저자는 Kim이었다
 *   (c) 같은 논문 중복 계상        — 한 논문을 두 이름으로 세어 근거가 두 배로 보였다
 *   (d) 서지 불일치               — 8(5):536-545로 적었으나 실제는 8(6):688-691
 *
 * (a)(b)(c)(d) 전부 **기계가 잡을 수 있는 종류**다. 사람이 눈으로 확인하는 방식은
 * 이미 한 번 실패했고, 실패율이 2/3였다. 그래서 자동화한다.
 *
 * 이 스크립트가 잡지 못하는 것
 * ───────────────────────────
 * "논문의 결론을 정반대로 서술" 유형은 못 잡는다. 서지정보는 완벽하게 맞는데
 * 본문 주장이 논문과 반대인 경우가 실제로 있었다(Richards 2009).
 * 그건 초록을 읽어야 알 수 있다. 이 스크립트는 초록을 함께 출력해
 * 사람이 판단할 준비까지만 해준다.
 *
 * 사용법
 * ─────
 *   node scripts/verify-citations.mjs              전체 검사
 *   node scripts/verify-citations.mjs --json       기계용 출력
 *   node scripts/verify-citations.mjs --abstracts  초록까지 출력(주장 대조용)
 *
 * 불일치가 하나라도 있으면 exit code 1. CI 게이트로 쓸 수 있다.
 * 네트워크를 쓰므로 오프라인에서는 실패한다. NCBI 예절상 호출 간 350ms 대기한다.
 */

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SCAN_DIRS = ["app", "lib", "components"];
const EXTS = new Set([".tsx", ".ts"]);
const NCBI_DELAY_MS = 350;

const args = new Set(process.argv.slice(2));
const AS_JSON = args.has("--json");
const WANT_ABSTRACTS = args.has("--abstracts");
/** 네트워크를 쓰지 않고 추출 결과만 본다. 정규식이 짝을 제대로 잡는지 확인할 때. */
const DRY = args.has("--dry");

// ─────────────────────────────────────────────────────────────
// 1. 파일에서 인용 후보 추출
// ─────────────────────────────────────────────────────────────

/** 지원하는 식별자 패턴. 순서가 중요하다 — PMC가 PubMed보다 먼저 와야 한다. */
const ID_PATTERNS = [
  { kind: "pmc",    re: /pmc\.ncbi\.nlm\.nih\.gov\/articles\/(PMC\d+)/i },
  { kind: "pmc",    re: /ncbi\.nlm\.nih\.gov\/pmc\/articles\/(PMC\d+)/i },
  { kind: "pmid",   re: /pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/i },
  { kind: "doi",    re: /(?:doi\.org|dx\.doi\.org)\/(10\.[^\s"'<>)]+)/i },
  { kind: "doi",    re: /frontiersin\.org\/[^"'\s]*?(10\.3389\/[^\s"'<>/]+)/i },
  { kind: "doi",    re: /jospt\.org\/doi\/(?:abs\/)?(10\.\d{4,}\/[^\s"'<>]+)/i },
  { kind: "doi",    re: /journals\.sagepub\.com\/doi\/(10\.\d{4,}\/[^\s"'<>]+)/i },
  { kind: "doi",    re: /tandfonline\.com\/doi\/(?:full\/|abs\/)?(10\.\d{4,}\/[^\s"'<>]+)/i },
  { kind: "doi",    re: /link\.springer\.com\/article\/(10\.\d{4,}\/[^\s"'<>]+)/i },
  { kind: "doi",    re: /onlinelibrary\.wiley\.com\/doi\/(10\.\d{4,}\/[^\s"'<>]+)/i },
  // 2026-09-03: 링크가 아니라 **평문으로 적힌 식별자**도 잡는다.
  // 블로그 원고는 네이버 본문용이라 `(PMID 24923269)`처럼 맨 숫자로 적힌다.
  // URL 패턴만 보면 원고의 인용이 통째로 검사망 밖에 남는다 — 실제로 그랬다.
  { kind: "pmid",   re: /\bPMID[:\s]+(\d{6,9})\b/i },
  { kind: "pmc",    re: /\b(PMC\d{6,9})\b/ },
];

/**
 * 링크 앞쪽 텍스트에서 "저자 (연도" 주장을 찾는다.
 *
 * 이 저장소의 실제 표기를 보고 만들었다:
 *   <strong>Rathleff et al. (2015) Scand J Med Sci Sports 25(3):e292-300</strong>
 *   Plews et al. (2013, IJSPP)
 *   Behm & Chaouachi (2011)
 *   Nielsen RØ et al. (2014)
 *   Lieberman et al. 2010
 *
 * 링크 바로 앞 CONTEXT_CHARS 안에서 **가장 가까운** 것을 주장으로 본다.
 * 여러 인용이 한 줄에 몰려 있으면 오탐이 날 수 있어, 거리를 함께 보고한다.
 */
const CONTEXT_CHARS = 500;
const CLAIM_RE = new RegExp(
  [
    "(?<surname>[A-ZÀ-Þ][A-Za-zÀ-ÿ'\\-]+)",           // 성
    "(?:\\s+[A-ZÀ-Þ][A-Za-zÀ-ÿ]{0,3}\\.?)?",          // 이니셜/중간자 (Nielsen RØ)
    "(?:\\s*(?:&|and)\\s*[A-ZÀ-Þ][A-Za-zÀ-ÿ'\\-]+)?", // 공동 제1저자 (Behm & Chaouachi)
    "\\s*(?:et\\s+al\\.?)?",                          // et al.
    // 저자와 연도 사이에 논문 제목·학술지명이 끼는 표기를 허용한다.
    //   Heiderscheit BC et al., "Effects of step rate…" Med Sci Sports Exerc. 2011
    // 이 형태가 케이던스 페이지에서 매번 '미검출' 경고를 냈다. 요소 경계(<)는
    // 넘지 않고, 다른 연도를 건너뛰지 않도록 비탐욕으로 최대 160자만 허용한다.
    "(?:[^<0-9]{0,160}?)?",
    // 연도는 **숫자에 둘러싸이지 않은** 4자리여야 한다.
    // 이 lookaround가 없으면 URL의 PMID에서 연도를 뽑는다 —
    // 실제로 pubmed/20581720 에서 "2058"을 연도로, 앵커 텍스트의 "Step"을
    // 성으로 읽어 "Step 2058"이라는 유령 인용이 만들어졌다.
    "\\s*[\\(,.]?\\s*(?<!\\d)(?<year>(?:19|20)\\d{2})(?!\\d)",
  ].join(""),
  "g"
);

/** 성으로 오인하기 쉬운 흔한 영어 단어 — 오탐 억제용 */
const NOT_SURNAMES = new Set([
  "The", "This", "That", "See", "Also", "From", "With", "For", "And", "But",
  "PubMed", "PMC", "DOI", "Frontiers", "Review", "Systematic", "Clinical",
  "Effects", "Foot", "Running", "Heavy", "Best", "New", "Open", "Access",
  "Med", "Sci", "Sports", "Exerc", "Front", "Living", "Active", "Guide",
  // --dry 첫 실행에서 실제로 성으로 오인됐던 것들
  "Revision", "Overstriding", "Heel", "Pain", "Biomechanical", "StatPearls",
  "Achilles", "Stiffness", "Muscle", "Power", "Deficits", "Midportion",
  // 2026-09-02: 학술지명 약어 토큰.
  // shoe-life 페이지가 `Cornwall MW, McPoil TG. <em>제목</em> Int J Sports Phys Ther. 2017`
  // 형태로 쓰여 있었다. 요소 경계(<)를 넘지 못하니 저자-연도 연결이 끊겨,
  // **연도 바로 앞 토큰인 "Int"가 제1저자로 잡혔다.**
  // 이번엔 실제 저자가 Cornwall이라 불일치로 걸렸지만, 학술지 약어가 우연히
  // 실제 제1저자의 성과 겹치면 **틀린 인용이 조용히 통과한다.** 그쪽이 더 위험하다.
  "Int", "Am", "Br", "Eur", "Scand", "Phys", "Ther", "Physiol", "Orthop",
  "Rehabil", "Nutr", "Res", "Appl", "Biomech", "Sportsmed", "Strength", "Cond",
]);

/**
 * 인용 주장이 들어 있을 수 있는 요소 경계.
 *
 * 첫 --dry 실행에서 이 스크립트의 가장 큰 버그가 드러났다. 링크에서 뒤로 500자를
 * 훑으면 **바로 앞 `<li>`의 저자명을 가져온다.** 실제로 4건이 그렇게 잘못 짝지어졌다
 * (shin-splints의 Nielsen↔Hamstra-Wright, plantar-fasciitis의 Rathleff↔JOSPT 지침 등).
 * 근거 목록은 `<li>` 하나에 인용 하나씩 들어가므로, **요소 경계를 넘지 않게** 자른다.
 */
const BOUNDARY_RE = /<li\b|<\/li>|<p\b|<\/p>|<\/strong>\s*<\/li>|\n\s*\n/gi;

/**
 * 링크를 감싸는 요소의 범위를 구한다.
 *
 * 두 번째 --dry 실행에서 드러난 것: 이 저장소는 **두 가지 표기를 섞어 쓴다.**
 *   ① 이름이 링크 앞  — `<li><strong>Behm & Chaouachi (2011)</strong> … <a>PubMed →</a></li>`
 *   ② 이름이 링크 안  — `<li><a href="…">Hamstra-Wright et al. (2015) BJSM — …</a></li>`
 * 뒤로만 훑으면 ②가 전부 미검출로 빠진다(15건이 그랬다). 요소 전체를 본다.
 */
function elementSpan(text, linkIndex, isMarkdown = false) {
  // 2026-09-03: 마크다운은 **줄 하나가 곧 요소**다.
  //
  // 블로그 원고를 검사 범위에 넣자마자 이 버그가 드러났다.
  // 참고문헌이 `- Xu Y et al. (2021) … (PMID 32813597)` 같은 불릿 목록인데,
  // BOUNDARY_RE는 `<li>`·`<p>`만 경계로 보므로 **불릿을 넘어 다음 줄 저자명을 가져왔다.**
  // 실제로 PMID 32813597(Xu 2021)이 바로 아래 줄의 "Almeida 2015"와 짝지어졌다.
  //
  // 이건 이 스크립트가 첫 실행에서 겪었던 것과 **같은 버그의 마크다운 판본**이다
  // (그때는 앞 <li>의 저자명을 가져왔다). 형식이 바뀌면 경계도 다시 정의해야 한다.
  if (isMarkdown) {
    const start = text.lastIndexOf("\n", linkIndex) + 1;
    const nl = text.indexOf("\n", linkIndex);
    return { start, end: nl === -1 ? text.length : nl };
  }

  let start = Math.max(0, linkIndex - CONTEXT_CHARS);
  const pre = text.slice(start, linkIndex);
  let lastBoundary = -1;
  for (const m of pre.matchAll(BOUNDARY_RE)) lastBoundary = m.index + m[0].length;
  if (lastBoundary > 0) start += lastBoundary;

  const post = text.slice(linkIndex, Math.min(text.length, linkIndex + CONTEXT_CHARS));
  const nextBoundary = post.search(/<\/li>|<\/p>|<li\b/i);
  const end = nextBoundary === -1 ? linkIndex + CONTEXT_CHARS : linkIndex + nextBoundary;
  return { start, end };
}

function extractClaim(text, linkIndex, isMarkdown = false) {
  const { start, end } = elementSpan(text, linkIndex, isMarkdown);
  const window = text.slice(start, end);
  const linkOffset = linkIndex - start;

  let best = null;
  for (const m of window.matchAll(CLAIM_RE)) {
    const surname = m.groups.surname;
    if (NOT_SURNAMES.has(surname)) continue;
    // href 문자열 자체에서 뽑힌 것은 버린다 (URL 안의 대문자+숫자)
    const distance = Math.abs(m.index - linkOffset);
    if (best === null || distance < best.distance) {
      best = { surname, year: Number(m.groups.year), distance, raw: m[0].trim() };
    }
  }
  return best;
}

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name.startsWith(".")) continue;
      yield* walk(p);
    } else if (EXTS.has(path.extname(e.name))) {
      yield p;
    }
  }
}

/**
 * 저장소 루트의 블로그 원고도 스캔 대상이다. (2026-09-03 추가)
 *
 * 이걸 안 보다가 실제로 이런 일이 있었다 — 사이트의 인용 26건을 정정하는 동안
 * **네이버 블로그 원고 9편은 한 번도 검사받지 않았고**, 그 사이 원고가 사이트와
 * 정반대를 말하는 상태로 남아 있었다. 네이버 유입이 76%이고 검색에서 블로그가
 * 사이트보다 먼저 도달하므로, **검사받지 않는 쪽이 더 많이 읽히고 있었다.**
 *
 * AGENTS.md §3 — "새 종류의 출처를 추가하면 검사기 범위부터 늘려라."
 * 원고에 PMID를 달기 시작했으면 원고도 검사 범위다.
 *
 * 주의: 원고는 `.gitignore`에 걸려 있어 저장소에 없을 수 있다. 없으면 조용히 건너뛴다.
 */
async function* walkBlogDrafts() {
  let entries;
  try {
    entries = await readdir(ROOT, { withFileTypes: true });
  } catch { return; }
  for (const e of entries) {
    if (e.isFile() && /^네이버블로그_.*\.md$/.test(e.name)) yield path.join(ROOT, e.name);
  }
}

/**
 * 주석 내용을 공백으로 덮는다 (오프셋은 보존 → 줄번호가 그대로 맞는다).
 *
 * 왜 필요한가 (2026-09-03)
 * ───────────────────────
 * 평문 PMID 탐지를 추가하자마자 **정정 기록을 오탐으로 잡았다.**
 * `beginner-guide/page.tsx:150`에는 이런 주석이 있다 —
 *   "링크가 PMID 21302337로 걸려 있었는데 그건 비선형 광학 논문이다. 올바른 PMID는 21373870."
 * 즉 **틀렸다고 기록해둔 PMID**인데 검사기가 실제 인용으로 읽고 불일치를 냈다.
 *
 * 이대로 두면 **정직하게 기록할수록 검사기가 시끄러워진다.** 노이즈가 쌓이면
 * 검사기 전체를 무시하게 되고, 그건 이 저장소가 이미 겪은 실패다.
 *
 * ⚠️ 문자열 안의 `//`를 주석으로 오인하면 안 된다 — `"https://pubmed..."`가 통째로 날아간다.
 *    그래서 따옴표·백틱 상태를 추적하는 작은 스캐너로 처리한다.
 */
function maskComments(src) {
  const out = src.split("");
  let i = 0;
  const N = src.length;
  let state = "code"; // code | sq | dq | bt | line | block
  while (i < N) {
    const c = src[i], d = src[i + 1];
    if (state === "code") {
      if (c === "/" && d === "/") { state = "line"; out[i] = out[i + 1] = " "; i += 2; continue; }
      if (c === "/" && d === "*") { state = "block"; out[i] = out[i + 1] = " "; i += 2; continue; }
      if (c === "'") state = "sq";
      else if (c === '"') state = "dq";
      else if (c === "`") state = "bt";
    } else if (state === "sq" || state === "dq" || state === "bt") {
      if (c === "\\") { i += 2; continue; }
      if ((state === "sq" && c === "'") || (state === "dq" && c === '"') || (state === "bt" && c === "`")) state = "code";
    } else if (state === "line") {
      if (c === "\n") state = "code";
      else out[i] = " ";
    } else if (state === "block") {
      if (c === "*" && d === "/") { out[i] = out[i + 1] = " "; state = "code"; i += 2; continue; }
      if (c !== "\n") out[i] = " ";
    }
    i++;
  }
  return out.join("");
}

async function collectCitations() {
  const out = [];
  for (const dir of [...SCAN_DIRS, "__blog__"]) {
    let entries;
    try {
      entries = dir === "__blog__" ? walkBlogDrafts() : walk(path.join(ROOT, dir));
    } catch { continue; }
    for await (const file of entries) {
      const raw = await readFile(file, "utf8");
      // 마크다운에는 JS 주석이 없다. 코드 파일만 주석을 덮는다.
      // 오프셋이 보존되므로 아래 줄번호 역산은 그대로 유효하다.
      const text = file.endsWith(".md") ? raw : maskComments(raw);
      const lines = text.split("\n");
      // 줄 시작 오프셋 미리 계산 (line 번호 역산용)
      const offsets = [];
      let acc = 0;
      for (const l of lines) { offsets.push(acc); acc += l.length + 1; }

      const seen = new Set();
      // 2026-09-03: **이미 잡힌 구간과 겹치면 건너뛴다.**
      //
      // 평문 식별자 패턴을 추가하면서 생긴 문제다.
      // `pmc.ncbi.nlm.nih.gov/articles/PMC9878810`은 URL 패턴이 한 번 잡고,
      // 평문 패턴 `\b(PMC\d{6,9})\b`가 **같은 자리를 또 잡는다.**
      // 그러면 같은 인용이 2건으로 계상되고 총계가 부풀려진다(실제로 44 vs 42).
      //
      // ID_PATTERNS는 URL 패턴이 앞, 평문 패턴이 뒤에 있으므로
      // 앞에서 잡은 구간을 기록해두고 뒤에서 겹치는 것을 버리면 된다.
      // **URL 표기가 평문 표기를 이긴다** — 더 구체적인 쪽이 맞다.
      const claimed = [];
      const overlaps = (s, e) => claimed.some(([a, b]) => s < b && e > a);

      for (const { kind, re } of ID_PATTERNS) {
        const g = new RegExp(re.source, "gi");
        for (const m of text.matchAll(g)) {
          if (overlaps(m.index, m.index + m[0].length)) continue;
          claimed.push([m.index, m.index + m[0].length]);

          const id = kind === "doi" ? m[1].replace(/[.,;)]+$/, "") : m[1].toUpperCase();
          const key = `${kind}:${id}:${m.index}`;
          if (seen.has(key)) continue;
          seen.add(key);

          let line = 1;
          for (let i = 0; i < offsets.length; i++) {
            if (offsets[i] > m.index) break;
            line = i + 1;
          }

          out.push({
            file: path.relative(ROOT, file).replace(/\\/g, "/"),
            line,
            kind,
            id,
            claim: extractClaim(text, m.index, file.endsWith(".md")),
          });
        }
      }
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────
// 2. 식별자 → 실제 서지정보
// ─────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * PubMed·CSL의 저자 표기에서 성을 뽑는다.
 *
 * 첫 실전 실행에서 오탐이 나왔다: PubMed의 "van Gent RN"에서 **"RN"을 성으로** 잡아
 * 페이지의 "Gent"와 불일치라고 보고했다. 논문은 맞았고 파서가 틀렸다.
 * 성이 소문자 전치사로 시작하는 유럽식 이름(van/von/de/del/da/di/du/le/la/den/der/ten/ter)
 * 과 뒤에 붙는 이니셜 덩어리를 함께 처리한다.
 */
const NAME_PARTICLES = new Set([
  "van", "von", "de", "del", "della", "da", "di", "du", "dos", "das",
  "le", "la", "den", "der", "ten", "ter", "af", "al", "bin", "ibn", "mac", "mc",
]);

function firstSurname(nameLike) {
  if (!nameLike) return null;
  const s = String(nameLike).trim().replace(/[.,]+$/, "");
  if (!s) return null;
  let parts = s.split(/\s+/);

  // 끝에 붙은 이니셜 덩어리 제거: "van Gent RN" → ["van","Gent"] / "Rathleff MS" → ["Rathleff"]
  while (parts.length > 1 && /^[A-ZÀ-Þ]{1,3}$/.test(parts[parts.length - 1])) parts.pop();

  // 전치사가 남아 있으면 그다음 토큰이 성이다: ["van","Gent"] → Gent
  const lead = parts[0]?.toLowerCase();
  if (parts.length > 1 && NAME_PARTICLES.has(lead)) return parts[1];

  // "Rathleff MS" 꼴은 위 while에서 이미 정리됐다. 남으면 마지막 토큰.
  return parts[parts.length - 1];
}

async function resolvePmc(pmcid) {
  const u = `https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?ids=${pmcid}&format=json`;
  const r = await fetch(u, { headers: { "User-Agent": "ddaiga-citation-check/1.0" } });
  if (!r.ok) throw new Error(`idconv HTTP ${r.status}`);
  const j = await r.json();
  const rec = j?.records?.[0];
  if (!rec?.pmid) throw new Error(`PMC→PMID 변환 실패 (${rec?.errmsg ?? "pmid 없음"})`);
  return rec.pmid;
}

async function resolvePmid(pmid) {
  const u = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmid}&retmode=json`;
  const r = await fetch(u, { headers: { "User-Agent": "ddaiga-citation-check/1.0" } });
  if (!r.ok) throw new Error(`esummary HTTP ${r.status}`);
  const j = await r.json();
  const rec = j?.result?.[String(pmid)];
  if (!rec || rec.error) throw new Error(`PMID ${pmid} 조회 실패`);
  return {
    title: rec.title,
    firstAuthor: firstSurname(rec.sortfirstauthor || rec.authors?.[0]?.name),
    year: Number(String(rec.pubdate || "").slice(0, 4)) || null,
    journal: rec.fulljournalname || rec.source,
    volume: rec.volume,
    issue: rec.issue,
    pages: rec.pages,
    source: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
  };
}

async function resolveDoi(doi) {
  const r = await fetch(`https://doi.org/${encodeURI(doi)}`, {
    headers: {
      Accept: "application/vnd.citationstyles.csl+json",
      "User-Agent": "ddaiga-citation-check/1.0",
    },
    redirect: "follow",
  });
  if (!r.ok) throw new Error(`doi.org HTTP ${r.status}`);
  const j = await r.json();
  const a0 = j.author?.[0];
  return {
    title: Array.isArray(j.title) ? j.title[0] : j.title,
    firstAuthor: firstSurname(a0?.family || a0?.literal || a0?.name),
    year: j.issued?.["date-parts"]?.[0]?.[0] ?? null,
    journal: j["container-title"],
    volume: j.volume,
    issue: j.issue,
    pages: j.page,
    source: `https://doi.org/${doi}`,
  };
}

async function fetchAbstract(pmid) {
  const u = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmid}&rettype=abstract&retmode=text`;
  const r = await fetch(u, { headers: { "User-Agent": "ddaiga-citation-check/1.0" } });
  return r.ok ? (await r.text()).trim() : null;
}

// ─────────────────────────────────────────────────────────────
// 3. 대조
// ─────────────────────────────────────────────────────────────

function judge(claim, actual) {
  const issues = [];
  if (!claim) {
    issues.push({ level: "warn", msg: "링크 앞에서 '저자 (연도)' 주장을 찾지 못했다 — 눈으로 확인 필요" });
    return issues;
  }
  const cs = claim.surname.toLowerCase();
  const as = (actual.firstAuthor || "").toLowerCase();

  if (as && cs !== as) {
    // Behm & Chaouachi 처럼 공동저자 표기면 raw에 실제 제1저자가 들어있을 수 있다
    if (!claim.raw.toLowerCase().includes(as)) {
      issues.push({ level: "error", msg: `제1저자 불일치 — 페이지 "${claim.surname}" vs 실제 "${actual.firstAuthor}"` });
    }
  }
  if (actual.year && claim.year !== actual.year) {
    const gap = Math.abs(actual.year - claim.year);
    const authorMatches = as && cs === as;
    if (gap <= 1 && authorMatches) {
      // 온라인 선공개(epub ahead of print)와 정식호 발행 연도가 갈리는 것은
      // 이 분야에서 매우 흔하다. 예: Rathleff, DOI는 2014인데 인쇄본은
      // Scand J Med Sci Sports 2015;25(3):e292-300 이라 페이지의 2015도 맞다.
      // 제1저자가 일치하는데 1년 차이면 같은 논문으로 보고 통과시킨다.
      // 그러지 않으면 고칠 수 없는 경고가 매번 떠서 도구 전체가 무시된다.
      issues.push({ level: "info", msg: `연도 ${claim.year} vs ${actual.year} — 선공개/정식호 차이로 보고 통과` });
    } else {
      issues.push({ level: "error", msg: `연도 불일치 — 페이지 ${claim.year} vs 실제 ${actual.year}` });
    }
  }
  if (claim.distance > 300) {
    issues.push({ level: "warn", msg: `주장과 링크가 ${claim.distance}자 떨어져 있다 — 짝이 잘못 잡혔을 수 있음` });
  }
  return issues;
}

/**
 * `basis="paper"` 배지를 단 항목이 실제로 검증된 인용을 가진 페이지에 있는지 본다.
 *
 * 2026-08-31에 하프마라톤 페이지가 무게(필수/추천/취향)와 근거(논문/관행/경험)를
 * 배지로 표시하는 체계를 새로 도입했다. 그런데 **검사기 범위는 한 줄도 안 늘렸다.**
 * AGENTS.md에 "새 종류의 출처를 추가하면 검사기 범위부터 늘려라"고 써놓고 어긴 것이다.
 *
 * 실제로 그 페이지에서 basis="paper"인 항목 하나가 본문에서는 "국내 러너들 사이의
 * 요령"이라고 말하고 있었다. 서지는 맞는데 주장이 다른 Richards 2009와 같은 형태다.
 *
 * 이 검사가 **못 하는 것**도 분명히 해둔다. 어떤 배지가 어떤 논문에 대응하는지는
 * 코드에 표현돼 있지 않으므로 1:1 대응은 확인할 수 없다. 여기서 잡는 것은
 *   · 허용되지 않은 basis 값
 *   · 논문 인용이 하나도 없는 페이지에 붙은 paper 배지
 *   · paper 배지 수가 그 페이지의 검증된 인용 수를 넘는 경우
 * 세 가지뿐이다. 배지와 본문 주장의 일치는 여전히 사람이 봐야 한다.
 */
const ALLOWED_BASIS = new Set(["paper", "practice", "experience"]);

async function auditBadges(rows) {
  const byFile = new Map();
  for (const r of rows) {
    if (r.issues.some((i) => i.level === "error")) continue;
    byFile.set(r.file, (byFile.get(r.file) ?? 0) + 1);
  }
  const out = [];
  const scanned = [];
  for (const dir of SCAN_DIRS) {
    let it; try { it = walk(path.join(ROOT, dir)); } catch { continue; }
    for await (const file of it) {
      const text = await readFile(file, "utf8");
      // 주석 줄은 뺀다. 이 파일의 설명 주석에도 basis="paper"라는 문자열이 들어 있어
      // 그대로 세면 배지가 실제보다 하나 많게 잡힌다(2026-09-01에 실제로 그랬다).
      const code = text.split("\n").filter((l) => !/^\s*(\*|\/\/)/.test(l)).join("\n");
      const found = [...code.matchAll(/basis="([^"]*)"/g)].map((m) => m[1]);
      if (!found.length) continue;
      const rel = path.relative(ROOT, file).replace(/\\/g, "/");
      const bad = found.filter((b) => !ALLOWED_BASIS.has(b));
      const papers = found.filter((b) => b === "paper").length;
      const cites = byFile.get(rel) ?? 0;
      scanned.push({ file: rel, total: found.length, papers, cites });
      if (bad.length) out.push({ file: rel, level: "error", msg: `허용되지 않은 basis 값: ${[...new Set(bad)].join(", ")}` });
      // 2026-09-01: "paper 배지 수 > 인용 수면 경고"라는 규칙을 뺐다.
      // **1:1 대응을 전제한 잘못된 규칙이었다.** 여러 항목이 같은 논문을 근거로 삼는 것은
      // 정상이다(급수 절과 젤 절이 둘 다 Hew-Butler 2015를 가리키는 식).
      // 규칙이 틀리면 경고가 노이즈가 되고, 노이즈가 쌓이면 검사기 전체를 무시하게 된다.
      // 남기는 것은 "paper 배지가 있는데 검증된 인용이 아예 0건"뿐이다.
      if (papers && cites === 0) out.push({ file: rel, level: "error", msg: `basis="paper" ${papers}건인데 검증된 인용이 0건이다` });
    }
  }
  return { issues: out, scanned };
}

function findDuplicates(rows) {
  const byId = new Map();
  for (const r of rows) {
    if (!r.actual) continue;
    const key = r.actual.source;
    if (!byId.has(key)) byId.set(key, []);
    byId.get(key).push(r);
  }
  const dups = [];
  for (const [key, group] of byId) {
    const names = new Set(group.map((g) => g.claim?.surname).filter(Boolean));
    if (group.length > 1 && names.size > 1) {
      dups.push({ key, group, names: [...names] });
    }
  }
  return dups;
}

// ─────────────────────────────────────────────────────────────
// 4. 실행
// ─────────────────────────────────────────────────────────────

const C = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

const citations = await collectCitations();

if (!AS_JSON) {
  console.log(C.bold(`\n인용 검증기 — ${citations.length}건 발견\n`));
}

if (DRY) {
  // 네트워크 없이 추출 품질만 확인한다.
  let missing = 0, far = 0;
  for (const c of citations) {
    const claim = c.claim ? `${c.claim.surname} ${c.claim.year}` : C.yellow("(미검출)");
    if (!c.claim) missing++;
    else if (c.claim.distance > 300) far++;
    const dist = c.claim ? C.dim(`${c.claim.distance}자`) : "";
    console.log(`  ${c.file}:${c.line}  ${claim}  ${C.dim(`[${c.kind} ${c.id}]`)} ${dist}`);
  }
  console.log(C.bold(`\n총 ${citations.length}건 · 주장 미검출 ${missing} · 거리 300자 초과 ${far}`));
  console.log(C.dim("미검출과 거리 초과는 정규식이 놓친 것이니 여기부터 손볼 것.\n"));
  process.exit(0);
}

const rows = [];
for (const c of citations) {
  let actual = null, error = null;
  try {
    if (c.kind === "pmid") {
      actual = await resolvePmid(c.id);
    } else if (c.kind === "pmc") {
      const pmid = await resolvePmc(c.id);
      await sleep(NCBI_DELAY_MS);
      actual = await resolvePmid(pmid);
      actual.pmid = pmid;
    } else {
      actual = await resolveDoi(c.id);
    }
  } catch (e) {
    error = e.message;
  }
  await sleep(NCBI_DELAY_MS);

  // 2026-09-02: **"인용이 틀렸다"와 "조회를 못 했다"를 갈라 표시한다.**
  //
  // 오늘 35건이 전부 `fetch failed`로 떴다. NCBI에 닿지 못한 것뿐인데 화면에는
  // 인용 오류 35건과 똑같이 보였다. 그리고 나는 꼬리 4줄만 보고 "통과"라고 보고했다.
  // 두 실패는 성격이 다르다 —
  //   불일치  = 페이지를 고쳐야 한다
  //   조회실패 = 페이지는 멀쩡할 수도 있고, **아무것도 검증되지 않았다**는 뜻이다
  // 후자를 전자처럼 보여주면 "고칠 게 35개"로 착각하거나, 더 나쁘게는
  // "어차피 네트워크 문제겠지" 하고 진짜 불일치까지 무시하게 된다.
  //
  // 둘 다 exit 1이다(fail closed). 검증 못 한 것을 통과로 처리하지는 않는다.
  const NET_RE = /fetch failed|ENOTFOUND|ETIMEDOUT|ECONNRESET|socket hang up|EAI_AGAIN|403|429|502|503|504/i;
  const issues = error
    ? [{ level: "error", kind: NET_RE.test(error) ? "unreachable" : "lookup", msg: `조회 실패: ${error}` }]
    : judge(c.claim, actual);

  if (WANT_ABSTRACTS && actual) {
    const pmid = actual.pmid ?? (c.kind === "pmid" ? c.id : null);
    if (pmid) { actual.abstract = await fetchAbstract(pmid); await sleep(NCBI_DELAY_MS); }
  }

  rows.push({ ...c, actual, issues });

  if (!AS_JSON) {
    const worst = issues.some((i) => i.level === "error") ? "error"
                : issues.some((i) => i.level === "warn") ? "warn" : "ok";
    const mark = worst === "error" ? C.red("✗") : worst === "warn" ? C.yellow("!") : C.green("✓");
    const claimStr = c.claim ? `${c.claim.surname} ${c.claim.year}` : C.dim("(주장 미검출)");
    console.log(`${mark} ${c.file}:${c.line}  ${claimStr}  ${C.dim(`[${c.kind} ${c.id}]`)}`);
    if (actual) console.log(C.dim(`    실제: ${actual.firstAuthor ?? "?"} ${actual.year ?? "?"} — ${(actual.title ?? "").slice(0, 90)}`));
    for (const i of issues) {
      const arrow = i.level === "error" ? C.red("→") : i.level === "warn" ? C.yellow("→") : C.dim("→");
      console.log(`    ${arrow} ${i.level === "info" ? C.dim(i.msg) : i.msg}`);
    }
    if (actual?.abstract) console.log(C.dim(`    초록: ${actual.abstract.replace(/\s+/g, " ").slice(0, 400)}…`));
  }
}

const dups = findDuplicates(rows);
const { issues: badges, scanned: badgeScanned } = await auditBadges(rows);
const errors = rows.filter((r) => r.issues.some((i) => i.level === "error"));
const warns = rows.filter((r) => r.issues.some((i) => i.level === "warn") && !errors.includes(r));
const notes = rows.filter((r) => r.issues.some((i) => i.level === "info")).length;

if (AS_JSON) {
  console.log(JSON.stringify({
    scanned: rows.length,
    errors: errors.length,
    warnings: warns.length,
    duplicates: dups.map((d) => ({ paper: d.key, claimedAs: d.names })),
    rows,
  }, null, 2));
} else {
  if (dups.length) {
    console.log(C.bold("\n같은 논문을 다른 이름으로 세고 있는 곳"));
    console.log(C.dim("  근거 개수를 부풀리는 유형이다. 2026-08에 실제로 있었다.\n"));
    for (const d of dups) {
      console.log(`  ${C.red("✗")} ${d.key}`);
      console.log(`    ${d.names.join(" / ")} 로 각각 표기됨`);
      for (const g of d.group) console.log(C.dim(`      ${g.file}:${g.line}`));
    }
  }
  // 통과할 때도 반드시 한 줄 남긴다.
  // 조용한 출력은 "통과했다"와 "안 돌았다"를 구분해주지 못한다.
  // 2026-08-31에 /shorts/ 가 검증에서 조용히 빠져 있었고 거기에 문제가 고여 있었다.
  if (badgeScanned.length === 0) {
    console.log(C.bold("\n근거 배지 감사") + C.dim("  — basis 배지를 쓰는 파일이 없다 (검사 대상 0)"));
  } else if (badges.length === 0) {
    console.log(C.bold("\n근거 배지 감사") + C.green("  통과"));
    for (const f of badgeScanned) {
      console.log(C.dim(`  ✓ ${f.file}  배지 ${f.total}개 (paper ${f.papers}) · 검증된 인용 ${f.cites}건`));
    }
  }
  if (badges.length) {
    console.log(C.bold("\n근거 배지 감사"));
    console.log(C.dim("  basis=\"paper\" 배지가 실제 인용을 가진 페이지에 있는지만 본다.\n  배지와 본문 주장의 일치는 사람이 봐야 한다.\n"));
    for (const b of badges) {
      const mark = b.level === "error" ? C.red("✗") : C.yellow("!");
      console.log(`  ${mark} ${b.file}`);
      console.log(`      ${b.msg}`);
    }
  }
  // 네트워크 때문에 못 본 것과 실제로 틀린 것을 갈라서 센다.
  const unreachable = rows.filter((r) => r.issues.some((i) => i.kind === "unreachable"));
  const mismatched = errors.filter((r) => !r.issues.some((i) => i.kind === "unreachable"));

  console.log(C.bold("\n─────────────────────────────"));
  console.log(`검사 ${rows.length}건 · ${C.red(`불일치 ${mismatched.length}`)} · ${C.yellow(`경고 ${warns.length}`)} · ${C.green(`정상 ${rows.length - errors.length - warns.length}`)}${notes ? C.dim(` · 참고 ${notes}`) : ""}`);
  if (dups.length) console.log(`${C.red(`중복 계상 ${dups.length}건`)}`);

  if (unreachable.length) {
    console.log("");
    console.log(C.red(`⚠  ${unreachable.length}건은 조회 자체를 못 했다 — 검증된 게 아니다.`));
    console.log(C.dim("   NCBI에 닿지 못했다. 인용이 맞는지 틀린지 **알 수 없는** 상태다."));
    console.log(C.dim("   네트워크가 되는 곳에서 다시 돌린 뒤에 커밋할 것."));
    if (unreachable.length === rows.length) {
      console.log(C.red("   전부 실패했다 = 이번 실행으로 확인된 것은 하나도 없다."));
    }
  }

  console.log(C.dim("\n주의: 이 도구는 서지정보만 본다. 논문의 결론을 반대로 서술한 경우는"));
  console.log(C.dim("      잡지 못한다. --abstracts 로 초록을 띄워 사람이 대조할 것.\n"));
}

process.exit(errors.length || dups.length || badges.some(b => b.level === "error") ? 1 : 0);
