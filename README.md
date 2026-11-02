# 뛰다가 아메리카노

러닝화 고르기, 부상 정보, 대회 일정, 달리기 코스를 한곳에 모은 러닝 정보 사이트입니다.
혼자 기획하고 만들어 실제로 운영하고 있습니다.

- 사이트: https://ddaiga-americano.vercel.app
- 만든 사람: 조승현 ([GitHub](https://github.com/seung007) · [블로그](https://mynote46175.tistory.com/))

## 운영 현황

| 항목 | 값 |
|---|---|
| GA4 28일 사용자 | 148명 (8월 말 72명) |
| 네이버 검색 노출 | 약 6,400회 |
| 러닝화 추천 완료율 | 10.4% |

## 사용자 요청으로 넣은 기능

홍보 글에 달린 요청을 받아 기능을 더했습니다.

| 받은 요청 | 반영한 것 |
|---|---|
| 신발 종류가 더 다양했으면 좋겠다 | 러닝화 52종으로 늘리고, 28종은 공식 판매처와 연결 |
| 마라톤 같은 대회 일정을 보고 싶다 | 대회 일정 페이지를 만들고 일정 수집을 자동화 |
| 달리기 코스가 있으면 좋겠다 | 달리기 코스 페이지 추가 |

운영 중 부상 정보 글의 논문 인용 14건을 다시 확인해 틀린 9건을 고쳤습니다.

## 주요 기능

| 페이지 | 내용 |
|---|---|
| `/shoe-finder` | 몇 가지 질문에 답하면 맞는 러닝화를 추천 |
| `/shoes`, `/compare`, `/tier-list` | 러닝화 정보, 두 신발 비교, 용도별 정리 |
| `/injury` | 러닝 부상 정보와 근거 논문 |
| `/races` | 국내 마라톤과 러닝 대회 일정 |
| `/courses` | 달리기 코스 |
| `/tools` | 페이스 계산, 30분 달리기 계획, 신발 수명, 신발 좌우 확인 |
| `/community` | 러너 게시판 (Supabase 로그인) |

## 자동화

가격과 대회 일정은 별도 비공개 저장소의 수집 파이프라인이 매일 모아 옵니다.
잘못된 값이 사이트에 들어가지 않도록 반영 전에 규칙 검사를 거치고, 이 저장소에서도 `npm run check`로 링크, 인용, 대회 일정, 이미지 등을 검사합니다. 검사는 GitHub Actions에서도 돌아갑니다.

## 기술 스택

| 분야 | 기술 |
|---|---|
| 프론트엔드 | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| 데이터와 로그인 | Supabase |
| 배포와 분석 | Vercel, Google Analytics 4 |
| 검사 | Node.js 스크립트, GitHub Actions |

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run check    # 검사 전체를 한 번에 실행
```

`.env.local`에 아래 값을 넣어야 로그인과 분석이 동작합니다.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_GA_ID=
```
