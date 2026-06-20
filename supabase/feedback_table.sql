-- 뛰다가 아메리카노 — 피드백 테이블
-- Supabase 대시보드 > SQL Editor에서 실행하세요.

create table if not exists public.feedback (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  rating      smallint not null check (rating between 1 and 5),
  content     text,
  shoe_ids    text,      -- 추천받은 신발 id (쉼표 구분, 예: "hoka-clifton-10,brooks-ghost-17")
  body_type   text       -- 체형 분류 (예: "mid_mid")
);

-- RLS 활성화
alter table public.feedback enable row level security;

-- 누구나 피드백을 남길 수 있도록 insert 허용 (anon 포함)
create policy "누구나 피드백 삽입 가능"
  on public.feedback
  for insert
  to anon, authenticated
  with check (true);

-- 읽기는 인증된 사용자(관리자)만 허용
create policy "인증된 사용자만 조회 가능"
  on public.feedback
  for select
  to authenticated
  using (true);
