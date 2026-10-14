-- community_posts 테이블
create table community_posts (
  id            uuid        default gen_random_uuid() primary key,
  nickname      text        not null,
  question      text        not null,
  body          text,
  tag           text        not null default '기타',
  height_cm     int,
  weight_kg     int,
  budget_krw    int,
  created_at    timestamptz default now(),
  answer        text,
  answered_at   timestamptz,
  likes         int         default 0
);

-- Row Level Security
alter table community_posts enable row level security;

create policy "누구나 읽기 가능"
  on community_posts for select using (true);

create policy "누구나 질문 등록 가능"
  on community_posts for insert with check (true);

create policy "누구나 좋아요 업데이트 가능"
  on community_posts for update using (true);
