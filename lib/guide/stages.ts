/**
 * 러닝 가이드 — **단계** 축 (2026-10-06)
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 「초심자·중급자·숙련자」를 버렸나
 *
 * 허브가 사람을 셋으로 나눴는데, 그 경계(0~6개월·주 15km, 6~24개월·15~40km, 2년+·40km+)는
 * **이 사이트가 정한 값이었고 근거가 없었다.** 세 가이드 모두 박스 아래에 그렇게 적어 뒀다.
 * 사용자 지적: "키로수로만 나누는 게 맞나 — 개월 수·한 달 마일리지·빈도로 나눠야 하지 않나."
 *
 * 찾아보니 공인 분류는 여전히 없다. 가장 가까운 것이 Honert 2020(PLOS ONE) 의 전문가
 * 델파이 합의에서 쓴 정의다 — 경력·주간 빈도·주간 거리 **세 축**으로 입문/레크리에이션/고수준을
 * 나눈다(본문 Table 3). 범위가 서로 겹치고, 신발 추천 연구를 위한 정의다.
 *
 * 그런데 사람이 실제로 막히는 지점은 「경력 몇 개월」이 아니라 **지금 넘으려는 거리**다.
 * 30분을 못 뛰는 사람과 하프를 준비하는 사람은 경력이 같아도 할 일이 다르다.
 * 그래서 허브는 **넘으려는 단계**로 나누고, 세 축은 「내 단계 찾기」에서 참고로만 보여준다.
 *
 * ─────────────────────────────────────────────────────────────
 * 병목 항목의 규칙
 *
 *   · 숫자는 **PubMed 초록에서 확인한 값만** 적는다 (2026-10-06 대조, 각 항목 옆 링크).
 *   · 「할 일」 중 논문이 직접 시험하지 않은 것은 `basis: "rule"` 로 표시한다 — 화면에 「경험칙」.
 *   · 연구끼리 결과가 엇갈리면 **엇갈린다고 적는다.** (Damsted 2019 vs Frandsen 2025 주간 증가율,
 *     Toresdahl 2023 vs Frandsen 2025 ACWR)
 */

export type StageId = "start" | "to10k" | "to-half" | "to-full" | "faster";

export type Bottleneck = {
  /** 사람들이 실제로 막히는 지점 */
  title: string;
  /** 논문이 보여준 것 — 숫자는 초록 값 그대로 */
  fact: string;
  cite: string;
  href: string;
  /** 그래서 할 일 */
  todo: string;
  /** paper = 논문이 직접 시험한 것 / rule = 논문 결과에서 이 사이트가 끌어낸 경험칙 */
  basis: "paper" | "rule";
};

export type Stage = {
  id: StageId;
  step: number;
  from: string;
  to: string;
  /** 칩·배지에 쓰는 짧은 이름 */
  short: string;
  who: string;
  bottlenecks: Bottleneck[];
  guides: { href: string; label: string }[];
  /** 다음 단계로 넘어갈 신호 — 전부 사이트 기준 */
  next: string | null;
};

export const STAGES: Stage[] = [
  {
    id: "start",
    step: 1,
    from: "처음",
    to: "30분 연속",
    short: "처음→30분",
    who: "막 시작했거나 오래 쉬다 다시 시작. 아직 30분을 쉬지 않고 달리기 어렵다.",
    bottlenecks: [
      {
        title: "다쳐서 그만둔다",
        fact: "6주 초보 프로그램 참가자 774명 중 29.5%가 26주 안에 달리기를 그만뒀고, 그만둔 이유 1위가 부상(48%)이었습니다.",
        cite: "Fokkema et al. (2019) J Sci Med Sport 22(1):106-111",
        href: "https://pubmed.ncbi.nlm.nih.gov/29934211/",
        todo: "늘리는 기준을 '다음 날 아프지 않은가'로 둡니다. 아프면 그 단계를 반복합니다.",
        basis: "rule",
      },
      {
        title: "정해진 진도를 못 따라간다",
        fact: "9주 걷기-달리기 프로그램(Couch-to-5k 변형) 참가자 110명 중 끝까지 마친 사람은 27.3%. 그만둔 사람들은 부상과 '정해진 진도'를 이유로 꼽았고, 저자들은 더 유연한 설계를 권했습니다.",
        cite: "Relph et al. (2023) Int J Environ Res Public Health 20(17):6682",
        href: "https://pubmed.ncbi.nlm.nih.gov/37681822/",
        todo: "순서는 프로그램을 따르되, 넘어가는 시점은 달력이 아니라 몸으로 정합니다.",
        basis: "rule",
      },
      {
        title: "숨이 차서 못 버틴다",
        fact: "말하기 테스트(편하게 문장을 말할 수 있는가)는 환기역치 아래 강도를 가려내는 타당하고 실용적인 방법으로 평가됩니다.",
        cite: "Reed & Pipe (2014) Curr Opin Cardiol 29(5):475-80",
        href: "https://pubmed.ncbi.nlm.nih.gov/25010379/",
        todo: "문장으로 대화가 되는 속도로 달립니다. 안 되면 걷기를 섞습니다.",
        basis: "paper",
      },
    ],
    guides: [
      { href: "/injury/start-running", label: "처음 달리기 — 30분까지" },
      { href: "/injury/beginner-guide", label: "초보 러너 뛰는 법" },
    ],
    next: "대화가 되는 속도로 30분을 쉬지 않고, 다음 날 통증이 없을 때",
  },
  {
    id: "to10k",
    step: 2,
    from: "30분",
    to: "5·10km 완주",
    short: "→10km",
    who: "30분은 뛰는데 거리를 늘리는 중. 첫 대회를 생각한다.",
    bottlenecks: [
      {
        title: "긴 날 하루에 몰아서 늘린다",
        fact: "성인 러너 5,205명을 18개월 추적한 결과, 한 번 달린 거리가 최근 30일 최장 거리보다 10% 넘게 길면 과사용 부상 비율이 1.52~2.28배였습니다. 전주 대비 주간 거리 비율은 부상과 관계가 없었습니다.",
        cite: "Frandsen et al. (2025) Br J Sports Med 59(17):1203-1210",
        href: "https://pubmed.ncbi.nlm.nih.gov/40623829/",
        todo: "가장 긴 날을 지난 한 달 최장 거리의 110% 안에서 늘립니다.",
        basis: "paper",
      },
      {
        title: "정강이·무릎 앞이 아프기 시작한다",
        fact: "부상당한 초보 러너 254명 중 정강이 통증이 15%, 무릎 앞(슬개대퇴) 통증이 10%였습니다.",
        cite: "Nielsen et al. (2014) PLOS ONE 9(6):e99877",
        href: "https://doi.org/10.1371/journal.pone.0099877",
        todo: "통증 위치별 글에서 멈춰야 하는 신호부터 확인합니다.",
        basis: "rule",
      },
      {
        title: "숨은 편해졌는데 다리가 못 따라온다",
        fact: "13개 연구를 모은 메타분석에서 달린 시간 1,000시간당 부상은 초보 17.8건, 레크리에이션 러너 7.7건이었습니다(부상 정의가 연구마다 달라 비교에 한계).",
        cite: "Videbæk et al. (2015) Sports Med 45(7):1017-26",
        href: "https://pubmed.ncbi.nlm.nih.gov/25951917/",
        todo: "숨이 편해져도 거리는 천천히 늘립니다. 심폐가 늘었다는 게 다리가 준비됐다는 뜻은 아닙니다.",
        basis: "rule",
      },
    ],
    guides: [
      { href: "/injury/first-10k", label: "생애 첫 10km 대회" },
      { href: "/injury/shin-splints", label: "정강이 통증" },
      { href: "/injury/knee-pain", label: "러너 무릎" },
      { href: "/tools/pace", label: "페이스 계산기" },
    ],
    next: "10km를 걷지 않고 완주했을 때",
  },
  {
    id: "to-half",
    step: 3,
    from: "10km",
    to: "하프",
    short: "→하프",
    who: "10km는 완주했고, 주간 거리를 늘려 하프를 준비한다.",
    bottlenecks: [
      {
        title: "얼마나 준비해야 하는지 모른다",
        fact: "하프 참가자 556명의 준비량 중앙값은 주 26km, 주 3회, 가장 긴 달리기 18.5km였습니다. 주 32km 초과·최장 21km 초과 그룹이 더 빨랐고 후반 감속이 적었으며, 훈련량과 부상의 관련은 없었습니다(관찰 연구).",
        cite: "Fokkema et al. (2020) Scand J Med Sci Sports 30(9):1692-1704",
        href: "https://pubmed.ncbi.nlm.nih.gov/32421886/",
        todo: "완주가 목표면 주 26km·최장 18km 안팎을 기준점으로, 기록이 목표면 주 32km·최장 21km 이상을 목표로 천천히 늘립니다.",
        basis: "rule",
      },
      {
        title: "준비 초반에 주간 거리를 확 늘린다",
        fact: "하프를 준비하는 러너 261명을 14주 추적한 연구에서 21일 시점, 주간 거리를 20~60% 늘린 사람이 20% 미만으로 늘린 사람보다 부상 위험이 22.6%p 높았습니다(56·98일 시점에는 차이 없음). 같은 지표가 다른 대규모 연구(Frandsen 2025)에서는 관계가 없었습니다.",
        cite: "Damsted et al. (2019) J Orthop Sports Phys Ther 49(4):230-238",
        href: "https://pubmed.ncbi.nlm.nih.gov/30526231/",
        todo: "준비 첫 3주는 주간 거리를 20% 미만으로 늘리고, 긴 달리기는 최근 최장 거리의 110% 안에서.",
        basis: "rule",
      },
      {
        title: "아픈데 계속 뛴다",
        fact: "영국 파크런 러너 1,145명 설문에서 현재 부상이 있는 570명 중 86%가 통증을 안고 계속 달리고 있었습니다.",
        cite: "Linton & Valentin (2018) J Sci Med Sport 21(12):1221-1225",
        href: "https://pubmed.ncbi.nlm.nih.gov/29853263/",
        todo: "통증 때문에 자세가 바뀌거나 다음 날 더 아프면 그날은 멈춥니다.",
        basis: "rule",
      },
      {
        title: "다쳤던 곳이 또 다친다",
        fact: "전향 코호트 11편을 모은 체계적 고찰에서 가장 일관된 위험 요인은 지난 12개월 안의 부상이었습니다(조사한 8편 중 5편).",
        cite: "Saragiotto et al. (2014) Sports Med 44(8):1153-63",
        href: "https://pubmed.ncbi.nlm.nih.gov/24809248/",
        todo: "다 나은 뒤 돌아오고, 복귀 첫 몇 주는 거리를 낮게 잡습니다.",
        basis: "rule",
      },
    ],
    guides: [
      { href: "/injury/half-marathon-training", label: "하프마라톤 준비" },
      { href: "/injury/half-marathon-race-day", label: "하프 대회 당일 체크리스트" },
      { href: "/injury/intermediate-guide", label: "중급자 가이드" },
      { href: "/injury/it-band", label: "무릎 바깥 통증(장경인대)" },
      { href: "/injury/achilles", label: "아킬레스·종아리 통증" },
    ],
    next: "하프를 완주했을 때",
  },
  {
    id: "to-full",
    step: 4,
    from: "하프",
    to: "풀코스",
    short: "→풀",
    who: "하프를 완주했고 풀코스를 준비한다. 주간 거리가 가장 크게 늘어나는 구간.",
    bottlenecks: [
      {
        title: "얼마나 준비해야 하는지 모른다",
        fact: "풀코스 참가자 441명의 준비량 중앙값은 주 40km, 주 3회, 가장 긴 달리기 32km였습니다. 주 40km 미만과 최장 25km 미만은 더 느린 완주와 관련 있었고, 훈련량과 부상의 관련은 없었습니다(관찰 연구).",
        cite: "Fokkema et al. (2020) Scand J Med Sci Sports 30(9):1692-1704",
        href: "https://pubmed.ncbi.nlm.nih.gov/32421886/",
        todo: "주 40km·최장 25~32km를 기준점으로, 긴 달리기는 최근 30일 최장 거리의 110% 안에서 늘립니다.",
        basis: "rule",
      },
      {
        title: "준비 기간에 다친다",
        fact: "뉴욕마라톤 참가자 735명을 16주 추적했더니 40.0%가 훈련 중 다쳤습니다. 최근 7일과 28일 거리로 계산한 급성:만성 비율(ACWR)이 1.5 이상인 날이 많을수록 부상이 많았습니다(하루당 OR 1.06). 다만 다른 대규모 연구(Frandsen 2025)에서는 이 지표가 반대 방향으로 나왔습니다.",
        cite: "Toresdahl et al. (2023) Br J Sports Med 57(3):146-152",
        href: "https://pubmed.ncbi.nlm.nih.gov/36113976/",
        todo: "주간 거리를 갑자기 끌어올리는 주를 만들지 않습니다. 지표 하나에 기대기보다 긴 달리기 증가폭을 함께 봅니다.",
        basis: "rule",
      },
      {
        title: "후반에 벽에 부딪힌다",
        fact: "400만 건 넘는 기록을 분석한 결과, 후반에 크게 느려지는 '벽'을 겪은 비율이 남성 28%, 여성 17%였습니다.",
        cite: "Smyth (2021) PLOS ONE 16(5):e0251513",
        href: "https://pubmed.ncbi.nlm.nih.gov/34010308/",
        todo: "초반 페이스를 목표보다 빠르게 잡지 않고, 젤·물 계획을 긴 달리기에서 미리 연습합니다.",
        basis: "rule",
      },
    ],
    guides: [
      { href: "/injury/marathon-training", label: "풀코스 준비" },
      { href: "/injury/half-marathon-race-day", label: "젤·급수·페이스 (하프 기준)" },
      { href: "/injury/return-to-running", label: "부상 후 복귀" },
      { href: "/injury/advanced-guide", label: "숙련자 가이드" },
    ],
    next: "풀코스를 완주했을 때",
  },
  {
    id: "faster",
    step: 5,
    from: "완주",
    to: "기록 단축",
    short: "기록",
    who: "완주는 했고 기록을 줄이고 싶다.",
    bottlenecks: [
      {
        title: "예측 기록을 그대로 믿는다",
        fact: "레크리에이션 러너 2,303명 분석에서 널리 쓰이는 리겔 공식은 하프까지는 잘 맞았지만, 풀코스는 러너 절반에게서 실제보다 10분 이상 빠르게 예측했습니다.",
        cite: "Vickers & Vertosick (2016) BMC Sports Sci Med Rehabil 8(1):26",
        href: "https://pubmed.ncbi.nlm.nih.gov/27570626/",
        todo: "풀코스 목표 페이스는 공식 값보다 보수적으로 잡고, 전반을 목표보다 빠르게 달리지 않습니다.",
        basis: "rule",
      },
      {
        title: "강도 배분을 공식으로만 찾는다",
        fact: "13개 연구 348명의 개별 자료를 모은 메타분석에서 양극화형과 피라미드형 강도 배분은 전체로는 최대산소섭취량·기록 차이가 없었습니다. 최대산소섭취량만 따로 보면 레크리에이션 선수는 피라미드형에서 더 좋아졌을 가능성이 있었습니다.",
        cite: "Rosenblat et al. (2025) Sports Med 55(3):655-673",
        href: "https://pubmed.ncbi.nlm.nih.gov/39888556/",
        todo: "대부분은 쉽게, 일부만 중·고강도로. 특정 비율 공식에 매달릴 필요는 없습니다.",
        basis: "rule",
      },
      {
        title: "달리기만 한다",
        fact: "중장거리 러너 근력운동 메타분석에서 고중량(1RM 80% 이상) 근력운동은 기록에 중간 크기 효과, 여러 방법을 섞으면 큰 효과가 있었습니다. 근거 확실성은 매우 낮음~중간.",
        cite: "Llanos-Lagos et al. (2024) Sports Med 54(7):1801-1833",
        href: "https://pubmed.ncbi.nlm.nih.gov/38627351/",
        todo: "기록이 목표라면 무거운 하체 근력운동을 더하는 것을 고려합니다.",
        basis: "paper",
      },
    ],
    guides: [
      { href: "/injury/get-faster", label: "기록 단축" },
      { href: "/tools/pace#predict-h", label: "기록 예측 계산기" },
      { href: "/injury/carbon-plate", label: "카본화 살까 말까" },
      { href: "/injury/advanced-guide", label: "숙련자 가이드" },
    ],
    next: null,
  },
];

export const STAGE_BY_ID: Record<StageId, Stage> = Object.fromEntries(
  STAGES.map((s) => [s.id, s]),
) as Record<StageId, Stage>;

/**
 * Honert 2020 의 세 축 — 「내 단계 찾기」에서 **참고로만** 쓴다.
 *
 * 본문 Table 3 (PMC 전문 대조, 2026-10-06):
 *   입문(novice)        규칙적 러닝 1년 미만 · 주 0~3회 · 주 5~20km
 *   레크리에이션         1년 초과            · 주 1~5회 · 주 15~50km
 *   고수준(high caliber) 3년 초과            · 주 4회 초과 · 주 50km 초과
 *   「규칙적」 = 주 1회 이상.
 *
 * 입문 정의에는 「5km 30분 초과」도 있지만 뺐다 — 다른 두 수준에는 속도 기준이 없어서
 * 한 축만 비대칭이 되고, 사용자가 원한 것도 경력·빈도·거리였다.
 */
export const HONERT_CITE = "Honert et al. (2020) PLOS ONE 15(7):e0236047";
export const HONERT_HREF = "https://pubmed.ncbi.nlm.nih.gov/32673375/";

export type Level = "novice" | "recreational" | "high";
export const LEVEL_LABEL: Record<Level, string> = {
  novice: "입문",
  recreational: "레크리에이션",
  high: "고수준",
};

export const HONERT_ROWS: { level: Level; years: string; sessions: string; km: string }[] = [
  { level: "novice", years: "1년 미만", sessions: "0~3회", km: "5~20km" },
  { level: "recreational", years: "1년 초과", sessions: "1~5회", km: "15~50km" },
  { level: "high", years: "3년 초과", sessions: "5회 이상", km: "50km 초과" },
];
