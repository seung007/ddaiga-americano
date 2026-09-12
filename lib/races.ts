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
 * 왜 남의 목록을 복제하지 않는가
 *
 * 국내 대회 목록을 모아 둔 사이트가 있고 긁을 수는 있다. 안 한다.
 * 사진 40장을 경쟁사 CDN 에서 빌려 쓰는 것만으로도 이미 빚이고,
 * 남이 모아 둔 **목록 자체를 복제**하면 그건 우리 자산이 아니다.
 *
 * 대신 **각 대회의 공식 접수처를 출처로 삼는다.** 날짜·장소·종목은 사실이고,
 * 우리가 더하는 값은 **"지금 내 수준에 이 대회가 맞나"** 다 — 그게 이 사이트의 축이다.
 * `scripts/fetch-races.mjs` 가 후보를 모아 오고 사람이 확인해서 넣는다.
 */

export type RaceStatus = "접수중" | "접수예정" | "마감" | "예정";

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

/** 사람이 읽는 거리 이름. 42.195 → "풀코스" */
export function distanceLabel(km: number): string {
  if (Math.abs(km - 42.195) < 0.01) return "풀코스";
  if (Math.abs(km - 21.0975) < 0.01) return "하프";
  return `${km % 1 === 0 ? km : km.toFixed(1)}km`;
}

export const ALL_RACES = ALL;
