import RAW from "./races.json";

/**
 * 마라톤 대회 일정 — **재방문을 만드는 유일한 축.**
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 만들었나 (2026-09-12)
 *
 * 경쟁 조사(`벤치마킹_2026-09-12.md`)에서 러닝위키가 「전국 마라톤 일정 통합 허브」를
 * 두고 대회마다 글을 쓰는 것을 확인했다. 우리에겐 한강 코스 4곳이 있지만 **시간 축이
 * 없다.** 신발은 1년에 한 번 사지만 대회는 계속 찾는다.
 *
 * hyun 님이 마라톤온라인에 올린 피드백 글의 질문이 정확히 이거였다 —
 * *"한 번 쓰고 말 것 같으세요, 다시 들어올 것 같으세요?"*
 * 대회 일정이 그 질문의 답이다.
 *
 * ─────────────────────────────────────────────────────────────
 * ⚠️ 날짜를 지어내면 **사람이 없는 대회에 간다**
 *
 * 이 저장소의 기존 규칙 중 가장 센 것이 좌표였다 —
 * *"좌표를 지어내면 사람이 엉뚱한 데로 간다. 글자를 지어내는 것보다 나쁘다."*
 * 대회 날짜는 그보다 더하다. 사람이 **돈을 내고 시간을 빼서 이동한다.**
 *
 * 그래서 규칙을 코드로 박는다:
 *   · `sourceUrl` **필수** — 접수처 공식 주소. 없으면 검사가 실패시킨다
 *   · `checkedAt` **필수** — 사람이 그 주소를 실제로 열어 본 날
 *   · 지난 대회는 **화면에서 자동으로 빠진다**(지우지 않고 거른다)
 *   · 확정 안 된 일정은 `status: "예정"` 으로 두고 **날짜를 비운다.**
 *     "아마 10월쯤"을 날짜로 바꾸지 않는다
 *
 * ─────────────────────────────────────────────────────────────
 * ⚠️ 이 문단을 2026-09-12 에 **고쳐 썼다**
 *
 * 원래는 이렇게 적혀 있었다 — *"남의 목록을 복제하지 않는다. 각 대회의 공식
 * 접수처만 출처로 삼는다."* 그리고 1건만 넣고 멈췄다.
 *
 * 사용자 지적: *"대회는 네가 인터넷 열어서 크롤링해서 다 가져와서 만들어야지."*
 * 맞는 말이었다. 내가 저작권을 이유로 막았는데 **날짜·장소·종목은 사실이고
 * 저작물이 아니다.** 축을 잘못 잡고 일을 안 한 것이다.
 *
 * ⚠️ 2026-09-17 — 화면에서 모음 사이트 링크·출처 라벨을 전부 뺐다. **링크 기준은 대회 공식 홈페이지**(`raceLink`).
 * 아래 문단은 그 전 경위다.
 *
 * 그래서 지금은 **KorMarathon(일정 모음 사이트)에서 55건을 가져왔다.**
 * 다만 그 사실을 숨기지 않는다:
 *   · 카드 버튼에 **"대회 정보 (KorMarathon)"** 인지 **"대회 공식 사이트"** 인지 적는다
 *   · `sourceKind()` 가 출처 종류를 계산한다
 *
 * 왜 표시가 중요한가 — **모음 사이트가 틀릴 수 있다.** 실제로 MBN 서울마라톤은
 * KorMarathon 에 "마감"으로 돼 있었는데 공식 사이트에는 **추가 접수가 열려
 * 있었다.** 출처를 뭉개면 그 차이를 사용자가 알 방법이 없다.
 *
 * 우리가 더하는 값은 목록 자체가 아니라 **"지금 내 수준에 이 대회가 맞나"** 다.
 */

export type RaceStatus = "접수중" | "접수예정" | "마감" | "예정";

/** 화면에 내는 상태 — 저장값에 없는 「마감임박」을 날짜로 만든다 */
export type DisplayStatus = RaceStatus | "마감임박";

export type Race = {
  /** URL 에 쓰는 짧은 id */
  id: string;
  name: string;
  /** ISO `YYYY-MM-DD`. **확정 전에는 비운다.** */
  date: string | null;
  /** 광역 단위. 예: "서울", "경기" */
  region: string;
  /** 이 대회가 여는 종목 (km). 예: [5, 10, 21.0975, 42.195] */
  distancesKm: number[];
  status: RaceStatus;
  /** 접수처 **공식** 주소. 필수. */
  sourceUrl: string;
  /** 사람이 위 주소를 실제로 열어 확인한 날 (ISO) */
  checkedAt: string;
  /** 선택 — 한 줄 메모. 없는 사실을 적지 않는다. */
  note?: string;
  /** 출발지 */
  venue?: string;
  /** 출발 시간. 종목별로 다르면 그대로 적는다(`"5km 09:00 · 10km 10:00"`). 집결 시간을 출발로 적지 않는다 */
  startTime?: string;
  /** 접수 시작일 (ISO). 모르면 비운다 */
  registrationStart?: string;
  /**
   * 접수 마감일 (ISO). **이 값이 있으면 `status` 대신 날짜로 상태를 계산한다** — `currentStatus()`.
   *
   * 2026-09-16: 손으로 적은 `status` 가 틀려서 마감된 대회 8건이 「접수중」으로 나갔다.
   * 사람이 매일 바꿔 줄 수 없는 값은 날짜에서 계산한다.
   * 추가접수처럼 날짜 하나로 안 떨어지는 대회(MBN)는 **비워 두고** `status` 를 손으로 둔다.
   */
  registrationEnd?: string;
  /** 종목별 참가비. 할인·옵션 요금은 넣지 않는다 */
  fees?: { label: string; distanceKm: number; krw: number }[];
  /** 정원. **문자열이다** — 「하프 20,000 / 10km 10,000」처럼 숫자 하나로 안 떨어지는 대회가 있다 */
  capacity?: string;
  organizer?: string;
  /** `sourceUrl` 이 모음 사이트일 때, 그 페이지가 링크한 주최 측 주소. 구글폼만 있으면 비운다(마감 뒤 닫힌다) */
  officialUrl?: string;
  /**
   * `officialUrl` 의 성격. 비우면 「공식」.
   * 접수 대행 사이트·인스타를 「대회 공식 사이트」라고 부르면 반만 맞는 말이 된다 (2026-09-16).
   */
  officialKind?: "공식" | "접수대행" | "SNS" | "접수폼";
  /** 날짜·장소·참가비를 **어디서 확인했나.** 「모음」이면 화면에 「KorMarathon 기준」을 붙인다 */
  factsFrom?: "공식" | "모음";
};

const ALL = RAW as Race[];

/** 오늘(KST) 자정 기준. 대회 당일은 아직 "다가오는" 것으로 본다. */
function todayKst(): string {
  const now = new Date();
  // KST = UTC+9. 서버 타임존에 기대지 않는다.
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

/**
 * 화면에 낼 대회 — **지난 것은 뺀다.**
 * 날짜가 없는 것(`예정`)은 남긴다. 정보가 없는 것과 끝난 것은 다르다.
 */
export function upcomingRaces(): Race[] {
  const today = todayKst();
  return ALL.filter((r) => r.date === null || r.date >= today).sort((a, b) => {
    if (a.date === null) return 1; // 날짜 미정은 뒤로
    if (b.date === null) return -1;
    return a.date.localeCompare(b.date);
  });
}

/** 남은 일수. 날짜가 없으면 null. */
export function daysUntil(date: string | null): number | null {
  if (!date) return null;
  const today = todayKst();
  const ms = new Date(date + "T00:00:00Z").getTime() - new Date(today + "T00:00:00Z").getTime();
  return Math.round(ms / 86_400_000);
}

/**
 * 출처가 **대회 공식 사이트인지, 일정 모음 사이트인지** 구분한다.
 *
 * ⚠️ 2026-09-12 — 처음 이 페이지를 만들 때 "모든 일정은 접수처 공식 주소를 직접
 * 열어 확인했습니다"라고 적었다. 그때는 1건뿐이었고 실제로 그랬다.
 * 그런데 55건으로 늘리면서 **54건이 KorMarathon(일정 모음 사이트) 출처**가 됐다.
 * 문구를 그대로 두면 **거짓말이 된다.**
 *
 * 그래서 출처를 화면에 구분해서 표시한다. 사람이 "이건 공식이고 저건 모음이다"를
 * 알고 눌러야 한다. 숨기면 이 사이트가 파는 유일한 것(정직함)이 없어진다.
 */
export function sourceKind(url: string): "공식" | "모음" {
  try {
    return new URL(url).hostname.includes("kormarathon.com") ? "모음" : "공식";
  } catch {
    return "모음";
  }
}

/**
 * 사람이 읽는 거리 이름. 42.195 → "풀코스"
 *
 * 2026-09-16: `toFixed(1)` 이라 여수 「10.19 평화마라톤」의 10.19km 가 **「10.2km」** 로 찍혔다.
 * 대회 이름과 다른 숫자가 나오면 다른 대회처럼 보인다. 소수는 적힌 자리까지 그대로 낸다.
 */
export function distanceLabel(km: number): string {
  if (Math.abs(km - 42.195) < 0.01) return "풀코스";
  if (Math.abs(km - 21.0975) < 0.01) return "하프";
  return `${Number(km.toFixed(2))}km`;
}

/** 마감 며칠 전부터 「마감임박」인가 */
const CLOSING_SOON_DAYS = 7;

/**
 * 지금 접수 상태. `registrationEnd` 가 있으면 날짜로 계산하고, 없으면 저장된 `status`.
 * 대회 당일이 지난 것은 `upcomingRaces()` 가 이미 거른다.
 */
export function currentStatus(r: Race): DisplayStatus {
  const today = todayKst();
  if (r.registrationEnd) {
    if (r.registrationEnd < today) return "마감";
    if (r.registrationStart && r.registrationStart > today) return "접수예정";
    const left = daysUntil(r.registrationEnd);
    if (left !== null && left <= CLOSING_SOON_DAYS) return "마감임박";
    return "접수중";
  }
  if (r.registrationStart && r.registrationStart > today) return "접수예정";
  return r.status;
}

/**
 * 버튼이 보낼 곳 — **주최 측 주소만.** 없으면 null (버튼을 그리지 않는다).
 *
 * 2026-09-17: 일정 모음 사이트(KorMarathon)로 보내는 링크를 화면에서 전부 뺐다(hyun 님 결정).
 * 기준은 **대회 공식 홈페이지**다. `sourceUrl` 은 우리가 처음 찾은 경로 기록으로만 남기고 화면에 내지 않는다.
 */
export function raceLink(r: Race): { url: string; kind: "공식" | "접수대행" | "SNS" | "접수폼" } | null {
  if (!r.officialUrl) return null;
  return { url: r.officialUrl, kind: r.officialKind ?? "공식" };
}

/** 광역 → 권역. 러닝라이프와 같은 묶음 (2026-09-16 벤치마킹) */
export const REGION_GROUPS: Record<string, string[]> = {
  수도권: ["서울", "경기", "인천"],
  충청권: ["대전", "세종", "충북", "충남"],
  강원권: ["강원"],
  전라권: ["광주", "전북", "전남"],
  경상권: ["부산", "대구", "울산", "경북", "경남"],
  제주권: ["제주"],
};

export function regionGroup(region: string): string {
  for (const [g, list] of Object.entries(REGION_GROUPS)) if (list.includes(region)) return g;
  return "기타";
}

export function raceById(id: string): Race | undefined {
  return ALL.find((r) => r.id === id);
}

export const ALL_RACES = ALL;
