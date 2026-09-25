-- 뛰다가 아메리카노 — 신발 반응에 사이즈감·발볼 칸 (2026-09-26)
--
-- 왜: 러닝 오픈채팅 2곳 전수 분석(2026-09-26)에서 사이즈·발볼 질문이 8구간 전부에 나왔고
--     답은 매번 "매장 가서 신어봐"였음. 우리가 수치를 지어내는 대신 신어본 사람의 반응을 모음.
-- 둘 다 선택 입력(null 허용). 기존 행은 그대로.
alter table public.shoe_reactions add column if not exists size_fit text
  check (size_fit is null or size_fit in ('small', 'true', 'large'));   -- 작게 나옴 / 정사이즈 / 크게 나옴
alter table public.shoe_reactions add column if not exists width_fit text
  check (width_fit is null or width_fit in ('narrow', 'normal', 'wide')); -- 발볼 좁게 느껴짐 / 보통 / 넉넉함
