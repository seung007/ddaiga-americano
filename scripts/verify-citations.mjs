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
function elementSpan(text, linkIndex) {
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

function extractClaim(text, linkIndex) {
  const { start, end } = elementSpan(text, linkIndex);
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

async function collectCitations() {
  const out = [];
  for (const dir of SCAN_DIRS) {
    let entries;
    try {
      entries = walk(path.join(ROOT, dir));
    } catch { continue; }
    for await (const file of entries) {
      const text = await readFile(file, "utf8");
      const lines = text.split("\n");
      // 줄 시작 오프셋 미리 계산 (line 번호 역산용)
      const offsets = [];
      let acc = 0;
      for (const l of lines) { offsets.push(acc); acc += l.length + 1; }

      const seen = new Set();
      for (const { kind, re } of ID_PATTERNS) {
        const g = new RegExp(re.source, "gi");
        for (const m of text.matchAll(g)) {
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
            claim: extractClaim(text, m.index),
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
  for (const dir of SCAN_DIRS) {
    let it; try { it = walk(path.join(ROOT, dir)); } catch { continue; }
    for await (const file of it) {
      const text = await readFile(file, "utf8");
      const found = [...text.matchAll(/basis="([^"]*)"/g)].map((m) => m[1]);
      if (!found.length) continue;
      const rel = path.relative(ROOT, file).replace(/\\/g, "/");
      const bad = found.filter((b) => !ALLOWED_BASIS.has(b));
      const papers = found.filter((b) => b === "paper").length;
      const cites = byFile.get(rel) ?? 0;
      if (bad.length) out.push({ file: rel, level: "error", msg: `허용되지 않은 basis 값: ${[...new Set(bad)].join(", ")}` });
      if (papers && cites === 0) out.push({ file: rel, level: "error", msg: `basis="paper" ${papers}건인데 검증된 인용이 0건이다` });
      else if (papers > cites) out.push({ file: rel, level: "warn", msg: `basis="paper" ${papers}건 vs 검증된 인용 ${cites}건 — 배지가 더 많다` });
    }
  }
  return out;
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

  const issues = error
    ? [{ level: "error", msg: `조회 실패: ${error}` }]
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
const badges = await auditBadges(rows);
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
  if (badges.length) {
    console.log(C.bold("\n근거 배지 감사"));
    console.log(C.dim("  basis=\"paper\" 배지가 실제 인용을 가진 페이지에 있는지만 본다.\n  배지와 본문 주장의 일치는 사람이 봐야 한다.\n"));
    for (const b of badges) {
      const mark = b.level === "error" ? C.red("✗") : C.yellow("!");
      console.log(`  ${mark} ${b.file}`);
      console.log(`      ${b.msg}`);
    }
  }
  console.log(C.bold("\n─────────────────────────────"));
  console.log(`검사 ${rows.length}건 · ${C.red(`오류 ${errors.length}`)} · ${C.yellow(`경고 ${warns.length}`)} · ${C.green(`정상 ${rows.length - errors.length - warns.length}`)}${notes ? C.dim(` · 참고 ${notes}`) : ""}`);
  if (dups.length) console.log(`${C.red(`중복 계상 ${dups.length}건`)}`);
  console.log(C.dim("\n주의: 이 도구는 서지정보만 본다. 논문의 결론을 반대로 서술한 경우는"));
  console.log(C.dim("      잡지 못한다. --abstracts 로 초록을 띄워 사람이 대조할 것.\n"));
}

process.exit(errors.length || dups.length || badges.some(b => b.level === "error") ? 1 : 0);
