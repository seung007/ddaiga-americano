/**
 * 커뮤니케이션 공용 헬퍼 (2026-09-23) — 로그인 없이 "내 글"과 "글쓴이"를 알아보는 장치.
 *
 * 왜 만들었나
 *   마라톤온라인 자유게시판에서 댓글이 가장 많은 글(2026-09-23 실측, 댓글 5)은
 *   글쓴이가 댓글 단 사람을 한 명씩 부르며 답례하는 구조였다. 글쓴이가 다시 들어온다.
 *   우리 게시판은 운영자 답 1:1 구조라 그 고리가 없었다.
 *
 * 무엇을 저장하나 (전부 이 브라우저의 localStorage)
 *   · 작성자 토큰 — 난수. DB 에는 sha256 만(author_hash). 댓글 RPC 가 해시를 비교해 「글쓴이」 표시
 *   · 내 글 목록 — { id, seen }. seen = 마지막으로 본 댓글 수. 새 댓글 배지에 씀
 *   · 이미 누른 반응 — 같은 브라우저 중복 방지용. **서버 제한이 아님** (도배 방지로 과신하지 말 것)
 *
 * ⚠️ localStorage 는 비공개 창·차단 설정에서 던지거나 비어 있음. 전부 try/catch.
 *    비어 있으면 기능이 조용히 줄어들 뿐 화면이 깨지면 안 됨.
 */

const TOKEN_KEY = "ddaiga_author_token";
const MY_POSTS_KEY = "ddaiga_my_posts";
const REACTED_KEY = "ddaiga_reacted";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 저장 불가 환경 — 기능만 줄어듦 */
  }
}

/** 없으면 만든다. 저장이 안 되는 환경이면 null (글쓴이 표시를 포기) */
export function authorToken(): string | null {
  let t = read<string | null>(TOKEN_KEY, null);
  if (t) return t;
  try {
    t = crypto.randomUUID();
    window.localStorage.setItem(TOKEN_KEY, JSON.stringify(t));
    return window.localStorage.getItem(TOKEN_KEY) ? t : null;
  } catch {
    return null;
  }
}

export async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** 글 insert 에 붙일 author_hash. 토큰을 못 만들면 null — 글 등록 자체는 막지 않는다 */
export async function authorHash(): Promise<string | null> {
  const t = authorToken();
  if (!t) return null;
  try {
    return await sha256Hex(t);
  } catch {
    return null;
  }
}

export type MyPost = { id: string; seen: number };

export function myPosts(): MyPost[] {
  const v = read<MyPost[]>(MY_POSTS_KEY, []);
  return Array.isArray(v) ? v.filter((p) => p && typeof p.id === "string") : [];
}

export function rememberMyPost(id: string) {
  const list = myPosts().filter((p) => p.id !== id);
  list.unshift({ id, seen: 0 });
  write(MY_POSTS_KEY, list.slice(0, 50));
}

export function isMyPost(id: string) {
  return myPosts().some((p) => p.id === id);
}

/** 글을 열어 댓글을 봤으면 호출 — 배지가 사라진다 */
export function markSeen(id: string, commentCount: number) {
  const list = myPosts();
  const hit = list.find((p) => p.id === id);
  if (!hit) return;
  hit.seen = commentCount;
  write(MY_POSTS_KEY, list);
}

export function hasReacted(key: string) {
  return read<string[]>(REACTED_KEY, []).includes(key);
}

export function rememberReaction(key: string) {
  const list = read<string[]>(REACTED_KEY, []).filter((k) => k !== key);
  list.unshift(key);
  write(REACTED_KEY, list.slice(0, 300));
}

export function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "방금";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

/**
 * 글 등록 — author_hash 를 붙이고 새 글 id 를 돌려줌.
 *
 * ⚠️ `supabase/2026-09-23_community.sql` 을 실행하기 전에 배포되면 `author_hash` 컬럼이 없어
 *    insert 전체가 실패함. 그러면 **글쓰기가 통째로 죽음.** 그래서 그 컬럼 오류일 때만
 *    author_hash 없이 한 번 더 시도. 이 경우 글쓴이 표시만 빠지고 글은 올라감.
 */
export async function insertPost(
  client: import("@supabase/supabase-js").SupabaseClient,
  row: Record<string, unknown>
): Promise<{ id: string | null; error: { message: string } | null }> {
  const hash = await authorHash();
  const first = await client.from("community_posts").insert({ ...row, author_hash: hash }).select("id").single();
  if (!first.error) return { id: (first.data as { id: string } | null)?.id ?? null, error: null };
  if (!/author_hash/.test(first.error.message ?? "")) return { id: null, error: first.error };
  console.warn("[community] author_hash 컬럼 없음 — SQL 마이그레이션 미실행. 글쓴이 표시 없이 등록", first.error);
  const second = await client.from("community_posts").insert(row).select("id").single();
  if (second.error) return { id: null, error: second.error };
  return { id: (second.data as { id: string } | null)?.id ?? null, error: null };
}
