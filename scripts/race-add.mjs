#!/usr/bin/env node
/**
 * 대회 한 건 추가 — **공식 페이지를 열어서 확인한 뒤에만 넣는다.**
 *
 *   npm run race:add -- "https://대회공식주소"
 *
 * 하는 일:
 *   ① 준 주소를 실제로 **열어 본다.** 안 열리면 거기서 멈춘다
 *   ② 페이지의 제목·설명(og 메타)에서 **후보값**을 뽑아 보여준다
 *   ③ 그걸 그대로 넣지 않는다 — **사람이 확인해서 채울 양식**을 출력한다
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 자동으로 안 채우나 (2026-09-12)
 *
 * 사용자 지적: *"대회 양식은 네이버 같은 데 다 나와 있는데."*
 * 맞다. **날짜·장소·종목은 사실이고 저작물이 아니다.** 내가 저작권을 이유로
 * 막았던 건 축을 잘못 잡은 것이었다.
 *
 * 진짜 위험은 다른 데 있다 — **틀린 날짜.**
 * 블로그·커뮤니티에 올라온 일정은 확정 전 정보이거나, 작년 것이거나,
 * 바뀐 뒤에 안 고쳐진 것이 섞여 있다. 그걸 긁어서 자동으로 넣으면
 * **사람이 참가비를 내고 없는 대회에 간다.**
 *
 * 이 저장소는 같은 실패를 이미 겪었다 — 내가 계산해서 넣은 뚝섬 좌표가
 * 숫자 검사를 전부 통과하고 배포돼 경로선이 한강을 가로질렀다.
 * 값이 그럴듯했기 때문에 아무도 못 잡았다.
 *
 * 그래서 이 스크립트는 **후보를 보여주기만 한다.** 최종 값은 사람이 넣는다.
 * `image-sheet.mjs` · `affiliate-check.mjs` 와 같은 설계다 —
 * 기계가 못 하는 판정을 흉내내지 않고, 사람 일을 1분으로 줄인다.
 *
 * ⚠️ 출처는 **대회 공식 홈페이지나 접수처**여야 한다. 블로그·커뮤니티 주소를
 * `sourceUrl` 에 넣지 마라. 그 주소는 대회가 바뀌어도 안 바뀐다.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const url = process.argv.slice(2).find((a) => a.startsWith("http"));

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;

if (!url) {
  console.log(red("\n대회 공식 주소를 주세요.\n"));
  console.log('  npm run race:add -- "https://www.mbn-seoulmarathon.com/"\n');
  console.log(dim("  블로그·커뮤니티 주소가 아니라 **대회 공식 홈페이지나 접수처** 주소입니다.\n"));
  process.exit(1);
}

/**
 * 주소가 **말이 되는지** 먼저 본다. (2026-09-12)
 *
 * 사용자가 내 안내문의 자리표시자를 그대로 붙여넣었다:
 *   npm run race:add -- "https://대회공식주소"
 * 내가 `https://대회공식주소` 라고 써 놨으니 **진짜 주소처럼 보인 게 당연하다.**
 * 안내문이 나쁜 거지 사용자가 틀린 게 아니다.
 *
 * 그런데 더 나빴던 건 **메시지였다.** `ENOTFOUND` 를 "네트워크 문제입니다"로
 * 안내해서, 인터넷을 확인하라고 시켰다. 인터넷은 멀쩡했다.
 *
 * 이 저장소가 오늘만 세 번째로 밟은 자리다 —
 * *상태코드를 원인으로 바로 번역하지 마라.* 406 → "서버 혼잡",
 * ERR_ABORTED → 버림, 그리고 이번엔 ENOTFOUND → "인터넷 확인".
 * **DNS 가 못 찾은 이유가 여럿인데 하나로 뭉갰다.**
 */
try {
  const host = new URL(url).hostname;
  // 실재하는 도메인은 점이 있고 ASCII TLD 로 끝난다(한글 도메인도 퓨니코드로 온다).
  if (!host.includes(".") || /^[가-힣]+$/.test(host)) {
    console.log(red(`\n"${host}" 은 실제 주소가 아닙니다.`));
    console.log(dim("  제 안내문의 자리표시자를 그대로 넣으신 것 같습니다. 죄송합니다.\n"));
    console.log("  대회 공식 홈페이지 주소를 그대로 넣으세요. 예를 들면:\n");
    console.log('    npm run race:add -- "https://www.mbn-seoulmarathon.com/"\n');
    console.log(dim("  네이버·구글에서 대회 이름을 검색해 **공식 홈페이지**로 들어간 뒤,"));
    console.log(dim("  주소창 주소를 복사하시면 됩니다. 블로그 주소가 아니라 대회 주소입니다.\n"));
    process.exit(1);
  }
} catch {
  console.log(red(`\n주소 형식이 아닙니다: ${url}\n`));
  process.exit(1);
}

console.log(dim(`\n${url} 여는 중…`));

let html;
try {
  const res = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(20_000),
    headers: { "User-Agent": "ddaiga-americano/1.0 (+https://ddaiga-americano.vercel.app)" },
  });
  if (!res.ok) {
    console.log(red(`\n열리지 않습니다 — HTTP ${res.status}`));
    console.log(dim("  주소가 틀렸거나 대회가 끝난 것입니다. 확인하고 다시 시도하세요.\n"));
    process.exit(1);
  }
  html = await res.text();
} catch (e) {
  /**
   * **원인마다 사람이 할 일이 다르다.** 뭉뚱그리면 잘못된 안내가 나간다.
   *
   * 2026-09-12: 처음엔 어떤 실패든 "주소가 틀렸거나 대회가 끝난 것입니다"라고 찍었다.
   * 그런데 샌드박스에서 돌려 보니 `EAI_AGAIN` — **DNS 자체가 안 된 것**이었다.
   * 대회는 멀쩡한데 "대회가 끝났다"고 안내할 뻔했다.
   *
   * 이 저장소의 규칙과 같다 — *상태코드를 원인으로 바로 번역하지 마라.*
   * 406 을 "서버 혼잡"으로 읽었다가 쓸모없는 안내를 낸 적이 있다.
   */
  const code = e.cause?.code ?? "";
  const NET = ["EAI_AGAIN", "ENOTFOUND", "ECONNREFUSED", "ETIMEDOUT", "ECONNRESET"];
  console.log(red(`\n열리지 않습니다 — ${e.message}${code ? ` (${code})` : ""}`));
  if (NET.includes(code)) {
    console.log(dim("  네트워크 문제입니다. 대회와는 무관합니다 —"));
    console.log(dim("  인터넷 연결을 확인하고 다시 시도하세요.\n"));
  } else {
    console.log(dim("  주소를 다시 확인하세요.\n"));
  }
  process.exit(1);
}

const meta = (prop) =>
  new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)`, "i").exec(
    html
  )?.[1] ??
  new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`, "i").exec(
    html
  )?.[1] ??
  null;

const title = meta("og:title") ?? /<title>([^<]*)<\/title>/i.exec(html)?.[1] ?? null;
const desc = meta("og:description") ?? meta("description") ?? null;

/**
 * 본문에서 **날짜처럼 보이는 것**을 찾는다. 이건 후보일 뿐이다.
 * 여러 개가 나오는 게 정상이다 — 접수일·취소기한·대회일이 섞여 있다.
 * **어느 게 대회일인지는 기계가 못 고른다.** 그래서 전부 보여주고 사람이 고른다.
 */
const text = html.replace(/<[^>]+>/g, " ");
const dates = [
  ...new Set(
    [...text.matchAll(/(20\d{2})[.\-년\s]+(\d{1,2})[.\-월\s]+(\d{1,2})/g)].map(
      (m) => `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`
    )
  ),
].slice(0, 12);

const today = new Date(Date.now() + 9 * 3_600_000).toISOString().slice(0, 10);
const future = dates.filter((d) => d >= today);

console.log(bold("\n페이지에서 읽은 것 (후보입니다 — 그대로 믿지 마세요)\n"));
console.log(`  제목    ${title ?? dim("(없음)")}`);
if (desc) console.log(`  설명    ${desc.slice(0, 160)}`);
console.log(`\n  날짜 후보 ${dates.length}개`);
for (const d of dates) {
  const mark = d >= today ? green("미래") : dim("과거");
  console.log(`    ${mark}  ${d}`);
}
if (future.length > 1)
  console.log(
    yellow(
      `\n  ⚠ 미래 날짜가 ${future.length}개입니다 — 접수일·취소기한·대회일이 섞여 있습니다.`
    )
  );
console.log(dim("    어느 게 대회일인지는 페이지를 직접 보고 고르세요.\n"));

const existing = JSON.parse(readFileSync(join(ROOT, "lib", "races.json"), "utf8"));

/**
 * 제목에서 **슬로건을 떼어낸다.** (2026-09-12)
 *
 * MBN 에 돌려 보니 이렇게 나왔다:
 *   "2026 MBN 서울마라톤 — ONE MORE STEP FORWARD"
 * 뒤쪽은 대회 이름이 아니라 마케팅 문구다. 화면에 그대로 뜨면 목록이 지저분해진다.
 * `—`, `|`, `:` 뒤는 부제로 보고 자른다. 잘못 잘릴 수 있으니 **원문도 같이 보여준다.**
 */
const cleanName = (title ?? "").split(/\s+[—|:·]\s+/)[0].trim();

/**
 * id 는 **ASCII 로 만든다.**
 *
 * 처음엔 한글을 허용해서 `2026-mbn-서울마라톤` 이 나왔다. 지금은 JSON 안에서만
 * 쓰이니 문제없지만, 나중에 대회별 페이지(`/races/[id]`)를 만들면 **URL 에 들어간다.**
 * 그러면 퍼센트 인코딩돼서 공유할 때 읽을 수 없는 주소가 된다.
 * 나중에 바꾸면 이미 색인된 주소가 깨지므로 **지금 ASCII 로 둔다.**
 */
const YEAR = /20\d{2}/.exec(cleanName)?.[0] ?? "";
const asciiWords = cleanName
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, " ")
  .trim()
  .split(/\s+/)
  .filter(Boolean)
  .filter((w) => w !== YEAR)
  .slice(0, 3);
const suggestedId = [...asciiWords, YEAR].filter(Boolean).join("-") || "race";

console.log(bold("lib/races.json 에 넣을 양식 — 값을 확인해서 채우세요\n"));
console.log(
  JSON.stringify(
    {
      id: existing.some((r) => r.id === suggestedId) ? suggestedId + "-2" : suggestedId,
      name: cleanName || (title ?? ""),
      date: future[0] ?? null,
      region: "",
      distancesKm: [],
      status: "접수예정",
      sourceUrl: url,
      checkedAt: today,
      note: "",
    },
    null,
    2
  )
);

if (cleanName && title && cleanName !== title)
  console.log(dim(`\n  (원래 제목: ${title})`));
console.log(dim("\n  · name 에서 슬로건을 잘랐습니다. 잘못 잘렸으면 원래 제목을 쓰세요"));
console.log(dim("  · date 가 대회일이 맞는지 페이지에서 확인하세요. 모르면 null 로 두세요"));
console.log(dim("  · distancesKm 는 숫자 배열입니다. 하프=21.0975, 풀=42.195"));
console.log(dim("  · status: 접수중 / 접수예정 / 마감 / 예정"));
console.log(dim("  · 넣고 나서 `npm run check:races` 로 확인하세요\n"));
