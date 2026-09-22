-- 뛰다가 아메리카노 — 운영자 알림 (2026-09-23)
-- **2026-09-23_community.sql 을 먼저 실행한 뒤** SQL Editor 에서 실행.
--
-- 왜: 글·댓글·후기·신고가 들어와도 운영자가 알 경로가 없었음(2026-08 기록부터).
--     마라톤온라인 최다 댓글 글은 글쓴이가 하루 안에 답례 — 답이 늦으면 대화가 끊김.
--
-- 방식: insert 트리거 → pg_net 으로 디스코드 웹훅에 한 줄 전송.
--   · pg_net 은 비동기 큐라 알림이 실패해도 글 등록은 막지 않음. 트리거 안 예외도 삼킴
--   · 웹훅 주소는 **이 파일에 적지 않음.** 저장소에 올라가면 누구나 채널에 글을 쏠 수 있음.
--     API 로 노출되지 않는 private 스키마 테이블에 따로 넣음 (맨 아래 ③)

create extension if not exists pg_net with schema extensions;

create schema if not exists private;
revoke all on schema private from anon, authenticated;

create table if not exists private.notify_config (
  id   int  primary key default 1 check (id = 1),
  url  text not null
);

create or replace function private.notify_discord()
returns trigger
language plpgsql
security definer
set search_path = public, extensions, private
as $$
declare
  v_url  text;
  v_msg  text;
  v_base text := 'https://ddaiga-americano.vercel.app';
begin
  -- 알림은 부가 기능 — 여기서 무엇이 실패해도 글 등록을 막지 않게 전체를 예외 처리로 감쌈 (맨 아래 exception)
  select url into v_url from private.notify_config where id = 1;
  if v_url is null then
    return new;
  end if;

  -- ⚠️ CASE 한 식에 new.question · new.body 등을 같이 쓰면 안 됨.
  --    plpgsql 은 식 안의 new.필드를 **분기와 무관하게 전부 먼저 해석**해서,
  --    댓글 insert 때 "record new has no field question" 으로 **insert 자체가 실패**함.
  --    그래서 테이블마다 IF 분기로 나눔.
  if tg_table_name = 'community_posts' then
    v_msg := '📝 새 글: ' || left(new.question, 120) || E'\n' || v_base || '/community/' || new.id;
  elsif tg_table_name = 'community_comments' then
    v_msg := '💬 새 댓글: ' || left(new.body, 120) || E'\n' || v_base || '/community/' || new.post_id;
  elsif tg_table_name = 'shoe_reactions' then
    v_msg := '👟 신발 후기 (' || new.shoe_id || '): ' || left(coalesce(new.note, ''), 120) || E'\n' || v_base || '/shoes/' || new.shoe_id;
  elsif tg_table_name = 'race_reactions' then
    v_msg := '🏅 대회 후기 (' || new.race_id || '): ' || left(coalesce(new.note, ''), 120) || E'\n' || v_base || '/races/' || new.race_id;
  elsif tg_table_name = 'reports' then
    v_msg := '🚨 신고 ' || new.target_type || ' ' || new.target_id || ': ' || left(coalesce(new.reason, ''), 120);
  end if;

  if v_msg is not null then
    begin
      perform net.http_post(
        url     := v_url,
        body    := jsonb_build_object('content', v_msg, 'allowed_mentions', jsonb_build_object('parse', jsonb_build_array())),
        headers := '{"Content-Type": "application/json"}'::jsonb
      );
    exception when others then
      raise warning '[notify_discord] %', sqlerrm;
    end;
  end if;
  return new;
exception when others then
  raise warning '[notify_discord] %', sqlerrm;
  return new;
end;
$$;

-- ② 트리거 — 신발·대회는 한 줄(note)을 쓴 것만 알림 (버튼만 누른 건 소음)
drop trigger if exists notify_post on public.community_posts;
create trigger notify_post after insert on public.community_posts
  for each row execute function private.notify_discord();

drop trigger if exists notify_comment on public.community_comments;
create trigger notify_comment after insert on public.community_comments
  for each row execute function private.notify_discord();

drop trigger if exists notify_shoe on public.shoe_reactions;
create trigger notify_shoe after insert on public.shoe_reactions
  for each row when (new.note is not null) execute function private.notify_discord();

drop trigger if exists notify_race on public.race_reactions;
create trigger notify_race after insert on public.race_reactions
  for each row when (new.note is not null) execute function private.notify_discord();

drop trigger if exists notify_report on public.reports;
create trigger notify_report after insert on public.reports
  for each row execute function private.notify_discord();

-- ③ 웹훅 주소 넣기 — **아래 한 줄은 SQL Editor 에서만 실행하고, 이 파일에 주소를 적어 커밋하지 말 것**
--   디스코드: 채널 설정 → 연동 → 웹후크 → 새 웹후크 → 웹후크 URL 복사
--
--   insert into private.notify_config(id, url) values (1, '여기에_웹훅_URL')
--     on conflict (id) do update set url = excluded.url;
--
-- 확인: 사이트에서 글 하나 남기고 채널에 오는지 볼 것. 안 오면
--   select status_code, content from net._http_response order by created desc limit 5;
