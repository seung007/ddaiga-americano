import { createClient } from "@supabase/supabase-js";

/**
 * Supabase 자동 정지 방지 (2026-09-23) — Vercel Cron 이 하루 한 번 부른다 (`vercel.json`).
 *
 * 왜: 무료 플랜은 7일간 활동이 적으면 프로젝트를 정지한다(공식 문서 확인, 2026-08 기록).
 *   2026-08 에는 게시판 한 곳만 죽었지만, 2026-09-23 부터 **신발 52 · 대회 55 · 홈**이
 *   전부 이 DB 를 읽는다. 정지되면 그 전부에 「불러오지 못했어요」가 뜬다.
 *
 * 무엇을: 가장 가벼운 읽기 하나(`community_posts` 에서 id 1개).
 *
 * ⚠️ 한계: "하루 한 번 API 읽기가 정지를 막는다"는 건 널리 쓰이는 방법이지 Supabase 가
 *    보장한 조건이 아니다(정지 판정 기준은 공개되지 않음). 막히지 않으면 대시보드에서 직접 재개.
 *
 * 비밀값을 새로 만들지 않는다 — 브라우저에 이미 노출된 anon 키·URL 을 그대로 쓴다.
 * 누가 이 주소를 불러도 id 하나 읽는 것뿐이라 막을 이유가 없다.
 * `CRON_SECRET` 을 Vercel 에 설정하면 그때부터는 Cron 호출만 받는다.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("unauthorized", { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return Response.json({ ok: false, reason: "supabase env missing" }, { status: 500 });
  }

  const started = Date.now();
  const { error } = await createClient(url, key).from("community_posts").select("id").limit(1);
  const ms = Date.now() - started;

  if (error) {
    // 실패를 성공으로 찍지 않는다 — Vercel Cron 로그에서 500 으로 보여야 정지를 알아챈다
    console.error("[keepalive] Supabase 조회 실패", error);
    return Response.json({ ok: false, error: error.message, code: error.code, ms }, { status: 500 });
  }
  return Response.json({ ok: true, ms });
}
