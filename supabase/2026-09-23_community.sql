-- 뛰다가 아메리카노 — 커뮤니케이션 개편 (2026-09-23)
-- Supabase 대시보드 > SQL Editor 에 통째로 붙여넣고 한 번 실행.
-- 여러 번 실행해도 되게 if exists / if not exists / or replace 로 작성.
--
-- 무엇을 하나
--   ① 보안 수정 — community_posts 의 update 정책이 using(true) + 컬럼 제한 없음이라
--      브라우저에 노출된 anon 키로 **누구나 아무 글의 question·answer 를 덮어쓸 수 있었음.**
--      정책을 지우고 좋아요는 like_post() RPC 로만.
--      운영자 답변은 대시보드(서비스 롤)로 달기 때문에 이 정책과 무관.
--   ② 댓글 · 신발 반응 · 대회 반응 · 신고 테이블 — 전부 insert 전용. update/delete 정책 없음.
--   ③ 글쓴이 표시 — 글 쓸 때 브라우저가 만든 난수 토큰의 sha256 만 저장(author_hash).
--      댓글 RPC 가 토큰을 받아 해시를 비교해 is_author 를 서버에서 판정.
--      토큰 원문은 어디에도 저장하지 않음.
--
-- 한계 (알고 적는 것)
--   · 로그인이 없으므로 도배 방지는 클라이언트 쪽 중복 방지뿐. 서버 속도 제한 없음.
--     도배가 생기면 대시보드에서 지우고, 그때 속도 제한을 검토.
--   · 글쓴이 표시는 같은 브라우저에서만 작동(토큰이 localStorage 에 있음).

create extension if not exists pgcrypto with schema extensions;

-- ─── ① 보안 수정 ───────────────────────────────────────────────
drop policy if exists "누구나 좋아요 업데이트 가능" on public.community_posts;

create or replace function public.like_post(p_id uuid)
returns int
language sql
security definer
set search_path = public
as $$
  update community_posts set likes = likes + 1 where id = p_id returning likes;
$$;
revoke all on function public.like_post(uuid) from public;
grant execute on function public.like_post(uuid) to anon, authenticated;

-- 글 길이 상한 (클라이언트 maxLength 와 같은 값. 우회 요청 대비)
alter table public.community_posts add column if not exists author_hash text;
do $$ begin
  alter table public.community_posts
    add constraint community_posts_len check (
      char_length(question) between 1 and 300
      and (body is null or char_length(body) <= 500)
      and char_length(nickname) <= 20
      and (author_hash is null or author_hash ~ '^[0-9a-f]{64}$')
    );
exception when duplicate_object then null; end $$;

-- ─── ② 댓글 ───────────────────────────────────────────────────
create table if not exists public.community_comments (
  id          uuid        primary key default gen_random_uuid(),
  post_id     uuid        not null references public.community_posts(id) on delete cascade,
  nickname    text        not null default '러너' check (char_length(nickname) between 1 and 20),
  body        text        not null check (char_length(body) between 1 and 500),
  is_author   boolean     not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists community_comments_post_idx on public.community_comments(post_id, created_at);
alter table public.community_comments enable row level security;

drop policy if exists "댓글 누구나 읽기" on public.community_comments;
create policy "댓글 누구나 읽기" on public.community_comments for select using (true);
-- insert 정책을 두지 않음 → 직접 insert 불가, add_comment() 로만 (is_author 위조 방지)

create or replace function public.add_comment(
  p_post_id uuid, p_nickname text, p_body text, p_author_token text
) returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_hash text;
  v_id uuid;
begin
  select author_hash into v_hash from community_posts where id = p_post_id;
  if not found then
    raise exception 'post not found';
  end if;
  insert into community_comments(post_id, nickname, body, is_author)
  values (
    p_post_id,
    coalesce(nullif(trim(p_nickname), ''), '러너'),
    trim(p_body),
    v_hash is not null and p_author_token is not null
      and encode(digest(p_author_token, 'sha256'), 'hex') = v_hash
  )
  returning id into v_id;
  return v_id;
end;
$$;
revoke all on function public.add_comment(uuid, text, text, text) from public;
grant execute on function public.add_comment(uuid, text, text, text) to anon, authenticated;

-- ─── ② 신발 반응 ─────────────────────────────────────────────
create table if not exists public.shoe_reactions (
  id          uuid        primary key default gen_random_uuid(),
  shoe_id     text        not null check (char_length(shoe_id) <= 80),
  verdict     text        not null check (verdict in ('good', 'meh', 'bad')),
  note        text        check (note is null or char_length(note) <= 200),
  created_at  timestamptz not null default now()
);
create index if not exists shoe_reactions_shoe_idx on public.shoe_reactions(shoe_id, created_at desc);
alter table public.shoe_reactions enable row level security;
drop policy if exists "신발 반응 읽기" on public.shoe_reactions;
create policy "신발 반응 읽기" on public.shoe_reactions for select using (true);
drop policy if exists "신발 반응 쓰기" on public.shoe_reactions;
create policy "신발 반응 쓰기" on public.shoe_reactions for insert to anon, authenticated with check (true);

-- ─── ② 대회 반응 ─────────────────────────────────────────────
create table if not exists public.race_reactions (
  id          uuid        primary key default gen_random_uuid(),
  race_id     text        not null check (char_length(race_id) <= 120),
  kind        text        not null check (kind in ('going', 'done')),
  distance    text        check (distance is null or char_length(distance) <= 20),
  note        text        check (note is null or char_length(note) <= 200),
  created_at  timestamptz not null default now()
);
create index if not exists race_reactions_race_idx on public.race_reactions(race_id, created_at desc);
alter table public.race_reactions enable row level security;
drop policy if exists "대회 반응 읽기" on public.race_reactions;
create policy "대회 반응 읽기" on public.race_reactions for select using (true);
drop policy if exists "대회 반응 쓰기" on public.race_reactions;
create policy "대회 반응 쓰기" on public.race_reactions for insert to anon, authenticated with check (true);

-- ─── ② 신고 — 쓰기만. 읽기는 대시보드에서 ─────────────────────
create table if not exists public.reports (
  id           uuid        primary key default gen_random_uuid(),
  target_type  text        not null check (target_type in ('post', 'comment', 'shoe_reaction', 'race_reaction')),
  target_id    uuid        not null,
  reason       text        check (reason is null or char_length(reason) <= 200),
  created_at   timestamptz not null default now()
);
alter table public.reports enable row level security;
drop policy if exists "신고 쓰기" on public.reports;
create policy "신고 쓰기" on public.reports for insert to anon, authenticated with check (true);

-- ─── 실행 후 확인 (결과가 아래와 같아야 함) ───────────────────
--   select policyname, cmd from pg_policies where tablename = 'community_posts';
--     → select · insert 두 줄만. update 줄이 있으면 ① 실패
