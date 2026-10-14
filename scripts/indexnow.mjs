#!/usr/bin/env node
/**
 * IndexNow 제출 — 바뀐 페이지 주소를 검색엔진에 알린다 (2026-10-12)
 *
 *   node scripts/indexnow.mjs <url|경로> [...]          # 직접 지정
 *   node scripts/indexnow.mjs --since <커밋>            # 그 커밋 이후 바뀐 페이지 파일에서 주소를 뽑는다
 *   node scripts/indexnow.mjs --since <커밋> --dry      # 보내지 않고 목록만
 *
 * 왜: 네이버는 IndexNow 참여 엔진이다(2023-07, Search Engine Land · indexnow.org 참여 엔진 목록).
 * IndexNow 문서 — 「제출한 URL 은 참여 엔진 전체에 자동 공유된다」. 그래서 한 곳(Bing)에만 보낸다.
 * 구글은 IndexNow 에 참여하지 않는다 — 구글 색인에는 효과가 없다.
 *
 * 키: public/<KEY>.txt (내용 = 키). 사이트 루트에 있어야 소유 확인이 된다(문서 Option 1).
 * 200/202 는 「받았다」는 뜻일 뿐 색인을 보장하지 않는다(문서).
 *
 * ship.mjs 가 배포 반영을 확인한 뒤 --since <푸시 전 원격 커밋> 으로 부른다. 실패해도 배포는 이미 끝났으니 경고만 한다.
 */
import { spawnSync } from "node:child_process";
import { SITE_URL } from "./lib/site.mjs";

const KEY = "b04b9ddfb996167f0c8e26b96352fe4d";
const SITE = (SITE_URL).replace(/\/$/, "");
const HOST = new URL(SITE).host;
const ENDPOINT = "https://www.bing.com/indexnow";

const args = process.argv.slice(2);
const dry = args.includes("--dry");
const sinceIdx = args.indexOf("--since");

/** app/a/b/page.tsx → /a/b . 동적 경로([id])·route group·비공개 폴더는 건너뛴다 */
function routeOf(file) {
  const m = /^app\/(.*?)\/?page\.tsx$/.exec(file);
  if (!m) return null;
  const segs = m[1].split("/").filter(Boolean);
  if (segs.some((s) => s.startsWith("[") || s.startsWith("_") || s.startsWith("("))) return null;
  if (segs[0] === "login") return null;
  return "/" + segs.join("/");
}

let urls = [];
if (sinceIdx >= 0) {
  const since = args[sinceIdx + 1];
  const r = spawnSync("git", ["diff", "--name-only", `${since}..HEAD`], { encoding: "utf8" });
  if (r.status !== 0) {
    console.log("indexnow: git diff 실패 — " + (r.stderr || "").trim());
    process.exit(0);
  }
  const files = r.stdout.split("\n").filter(Boolean);
  const set = new Set();
  for (const f of files) {
    const route = routeOf(f);
    if (route) set.add(route);
    // 페이지 옆 파일(layout·클라이언트 컴포넌트)이 바뀌어도 그 페이지가 바뀐 것
    const dir = /^app\/(.+)\/[^/]+\.tsx$/.exec(f);
    if (dir && !f.endsWith("page.tsx")) {
      const r2 = routeOf(`app/${dir[1]}/page.tsx`);
      if (r2) set.add(r2);
    }
    if (f === "lib/guide/articles.ts") set.add("/injury");
    if (f === "lib/races.json") set.add("/races");
  }
  if (set.size) set.add("/rss.xml");
  urls = [...set].map((p) => SITE + p);
} else {
  urls = args.filter((a) => !a.startsWith("--")).map((u) => (u.startsWith("http") ? u : SITE + (u.startsWith("/") ? u : "/" + u)));
}

if (!urls.length) {
  console.log("indexnow: 보낼 주소 없음");
  process.exit(0);
}
if (dry) {
  console.log(`indexnow (dry) ${urls.length}개\n` + urls.join("\n"));
  process.exit(0);
}

try {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls.slice(0, 10000) }),
    signal: AbortSignal.timeout(15000),
  });
  console.log(`indexnow: ${urls.length}개 제출 → HTTP ${res.status}${res.status === 200 || res.status === 202 ? " (접수됨 — 색인 보장 아님)" : ""}`);
  if (res.status === 403) console.log("  키 파일을 못 찾았을 수 있음: " + `${SITE}/${KEY}.txt`);
} catch (e) {
  console.log("indexnow: 제출 실패 — " + (e?.message ?? e));
}
