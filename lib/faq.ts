import type { FaqItem } from "@/components/FaqSection";
import { currentStatus, daysUntil, distanceLabel, raceLink, type Race } from "@/lib/races";
import type { OfficialCheck } from "@/lib/shoes/official";
import type { Shoe } from "@/lib/shoes/types";

/**
 * 대회·러닝화 상세의 「자주 묻는 질문」 — **데이터에 있는 값만으로** 만든다 (2026-11-02)
 *
 * 왜: 검색창 대신 생성형 AI 에 묻는 사람이 늘었고, AI 는 질문-답이 바로 붙은 짧은 문단을 인용하기 쉽다
 * (hyun 님이 공유한 인스타그램 카드뉴스의 다섯 원칙 — 질문형 제목 · 한 문단 한 내용 · 개념은 뜻부터 ·
 * 긴 설명은 표/FAQ · 누가·언제 썼는지 밝히기. 원칙 자체는 그 카드뉴스의 주장이고 우리가 효과를 측정한 것은 아니다).
 *
 * 이 저장소 규칙을 그대로 지킨다 — **값이 없으면 그 질문을 만들지 않는다.** 「보통」, 「대략」 으로 메우지 않는다.
 * 답의 숫자는 화면 위쪽 표와 같은 원천(races.json · data.ts · official.json)에서만 온다. 그래서 표와 FAQ 가 어긋날 수 없다.
 * 마지막 질문은 늘 「언제·누가 확인했나」 — 확인 날짜와 확인 주체(사람 / 자동 수집기)를 답 안에 넣는다.
 */

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];
const withWeekday = (iso: string) => `${iso}(${WEEKDAY[new Date(iso + "T00:00:00Z").getUTCDay()]})`;

/** 받침 여부 — 한글은 글자로, 숫자는 읽는 소리(영·일·삼·육·칠·팔은 받침)로, 영문은 l·m·n 끝만 받침으로 본다 */
function hasBatchim(word: string): boolean {
  const ch = word.trim().slice(-1);
  const code = ch.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) return (code - 0xac00) % 28 !== 0;
  if (/[0-9]/.test(ch)) return "013678".includes(ch);
  return /[lmnLMN]/.test(ch);
}
/** 조사 붙이기: josa("고스트 18", "을", "를") */
const josa = (word: string, withB: string, withoutB: string) => word + (hasBatchim(word) ? withB : withoutB);

/** 한 번만 쓰는 용어 뜻 — 처음 나오는 곳에서 한 문장으로 */
const HALF = "하프는 21.0975km, 풀코스는 42.195km입니다.";

/** 「9/18~9/22 선착순」·「10/27~11/9」에서 끝 날짜(YYYY-MM-DD). 해는 대회 날짜에서 — 끝 달이 대회 달보다 크면 전 해. 못 읽으면 null */
function extraEnd(r: Race): string | null {
  const m = r.extraRegistration?.match(/(\d{1,2})\/(\d{1,2})\s*~\s*(\d{1,2})\/(\d{1,2})/);
  if (!m || !r.date) return null;
  const [y, raceMonth] = [Number(r.date.slice(0, 4)), Number(r.date.slice(5, 7))];
  const month = Number(m[3]);
  const year = month > raceMonth ? y - 1 : y;
  return `${year}-${String(month).padStart(2, "0")}-${String(Number(m[4])).padStart(2, "0")}`;
}

export function raceFaq(r: Race): FaqItem[] {
  const items: FaqItem[] = [];
  const name = r.name;

  if (r.date) {
    const where = !r.venue ? r.region : r.venue.startsWith(r.region) ? r.venue : `${r.region} ${r.venue}`;
    items.push({
      q: `${josa(name, "은", "는")} 언제, 어디서 열리나요?`,
      a: `${withWeekday(r.date)}${r.startTime ? ` ${r.startTime}` : ""}에 ${where}에서 열립니다.`,
    });
  }

  if (r.registrationStart || r.registrationEnd) {
    const status = currentStatus(r);
    items.push({
      q: `${name} 접수 기간은 언제인가요?`,
      a: `${r.registrationStart ?? "시작일 미확인"} ~ ${r.registrationEnd ?? "마감일 미확인"}입니다. 이 페이지 기준 상태는 「${status}」입니다. 선착순 조기 마감이나 추가 접수는 대회 측 공지가 우선합니다.`,
    });
  }

  if (r.fees && r.fees.length > 0) {
    const list = r.fees.map((f) => `${f.label} ${f.krw.toLocaleString("ko-KR")}원`).join(", ");
    const hasLong = r.distancesKm.some((k) => Math.abs(k - 21.0975) < 0.01 || Math.abs(k - 42.195) < 0.01);
    items.push({
      q: `${name}에는 어떤 종목이 있고 참가비는 얼마인가요?`,
      a: `${list}입니다.${hasLong ? ` ${HALF}` : ""}`,
    });
  } else if (r.distancesKm.length > 0) {
    items.push({
      q: `${name}에는 어떤 종목이 있나요?`,
      a: `${r.distancesKm.map(distanceLabel).join(", ")}입니다. 참가비는 확인한 자료가 없어 적지 않았습니다.`,
    });
  }

  // 2026-11-04 네이버 검색어 「한강시민마라톤대회 참여자 수」 — 정원은 대회 측 모집 인원이지 실제 참가자 수가 아니다
  if (r.capacity) {
    items.push({
      q: `${name} 참가 인원은 몇 명인가요?`,
      a: `대회 측이 밝힌 모집 정원은 ${r.capacity}입니다. 실제 참가자 수는 확인한 자료가 없어 적지 않았습니다.`,
    });
  }

  // 2026-11-10 네이버 검색어 「2027 동아마라톤 추가접수·취소 기간」「MBN 서울마라톤」 — 값이 있는 대회만(lib/races.ts 필드 주석)
  if (r.soldOut) {
    items.push({
      q: `${name}, 지금 신청할 수 있나요?`,
      a: `${josa(r.soldOut.what ?? "참가권", "이", "가")} ${withWeekday(r.soldOut.on)}에 매진됐다고 대회 측이 공지했습니다.${r.extraRegistration ? ` 추가 접수는 ${r.extraRegistration}입니다.` : " 추가 접수 공지는 확인한 자료가 없습니다."}`,
    });
  }
  if (r.extraRegistration && !r.soldOut) {
    // 2026-11-10 수집기도 이 칸을 채운다(ddaiga-pipeline 「추가 접수」 칸). 출처에 맞게 말한다 —
    //   수집기 값은 대회 측 공지가 아니라 공개된 대회 일정 자료에서 읽은 것이다.
    const basis = r.checkedBy === "수집기" ? "공개된 대회 일정 자료" : "대회 측 공지";
    // 끝났는지는 대회 상태(본 접수 기준)가 아니라 추가 접수의 끝 날짜로 판단한다
    const end = extraEnd(r);
    const over = end !== null && (daysUntil(end) ?? 0) < 0;
    items.push({
      q: `${name} 추가 접수가 있나요?`,
      a: over
        ? `${basis} 기준으로 추가 접수(${r.extraRegistration})가 있었고, 지금은 끝났습니다.`
        : `${basis} 기준으로 추가 접수는 ${r.extraRegistration}입니다. 신청 조건은 대회 측 공지를 확인하세요.`,
    });
  }
  if (r.refundDeadline) {
    const [day, time] = r.refundDeadline.split(" ");
    items.push({
      q: `${name} 취소·환불은 언제까지 되나요?`,
      a: `대회 측 공지 기준으로 ${withWeekday(day)}${time ? ` ${time}` : ""}까지입니다. 환불 금액·방법은 대회 측 공지를 확인하세요.`,
    });
  }

  const link = raceLink(r);
  if (link) {
    const host = (() => {
      try {
        return new URL(link.url).host;
      } catch {
        return null;
      }
    })();
    if (host) {
      const kind = link.kind === "공식" ? "공식 홈페이지" : link.kind;
      items.push({
        q: `${name} 신청은 어디서 하나요?`,
        a: `${kind}(${host})에서 합니다. 이 페이지 위쪽 버튼이 그 주소로 연결됩니다.`,
      });
    }
  }

  // 2026-11-10 운영자: 다른 사이트를 알리지 않는다 — 출처의 종류는 밝히되 사이트 이름은 쓰지 않는다
  const by =
    r.checkedBy === "수집기"
      ? "자동 수집기가 공개된 대회 일정 자료를 서로 다른 날 두 번 읽어 같은 값일 때 반영했습니다"
      : "운영자가 출처 페이지를 직접 열어 확인했습니다";
  items.push({
    q: "이 대회 정보는 언제, 누가 확인했나요?",
    a: `${r.checkedAt}에 ${by}. 코스·제한시간·변경 사항은 대회 측 공지가 우선합니다.`,
  });
  return items;
}

export function shoeFaq(s: Shoe, official: OfficialCheck | null, specCheckedAt: string | null): FaqItem[] {
  const name = `${s.brand} ${s.model}`;
  const items: FaqItem[] = [];

  if (official?.listed && official.priceKrw) {
    items.push({
      q: `${name} 가격은 얼마인가요?`,
      a: `한국 공식몰 정가는 ${official.priceKrw.toLocaleString("ko-KR")}원입니다(${official.checkedAt} 자동 확인). 할인·쿠폰가는 포함하지 않았습니다.`,
    });
  } else if (s.priceKrw) {
    items.push({
      q: `${name} 가격은 얼마인가요?`,
      a: `약 ${s.priceKrw.toLocaleString("ko-KR")}원입니다. 공식몰 자동 확인 대상이 아니거나 공식몰 목록에서 보이지 않아, 판매처마다 다를 수 있습니다.`,
    });
  }

  const wide = s.widthOptions.filter((w) => w === "2E" || w === "4E");
  items.push({
    q: `발볼이 넓어도 ${josa(s.model, "을", "를")} 신을 수 있나요?`,
    a: wide.length
      ? `와이드 규격(${wide.join("·")})이 있습니다. 2E·4E 는 일반 폭보다 발볼이 넓은 규격이고, 4E 가 더 넓습니다.`
      : "이 사이트가 확인한 범위에서는 와이드(2E·4E) 규격이 없습니다. 2E·4E 는 일반 폭보다 발볼이 넓은 규격입니다.",
  });

  items.push({
    q: `${s.model}의 드롭과 스택 높이는 얼마인가요?`,
    a: `드롭 ${s.heelDropMm}mm, 스택 ${s.stackHeightMm}mm입니다. 드롭은 뒤꿈치와 앞꿈치 밑창 높이의 차이, 스택은 발밑 밑창 전체의 두께입니다.`,
  });

  if (typeof s.hasCarbon === "boolean") {
    items.push({
      q: `${s.model}에 카본 플레이트가 들어 있나요?`,
      a: s.hasCarbon
        ? "들어 있습니다. 카본 플레이트는 중창 안에 넣은 탄소 섬유 판으로, 주로 대회용 신발에 쓰입니다."
        : "들어 있지 않습니다. 카본 플레이트는 중창 안에 넣은 탄소 섬유 판으로, 주로 대회용 신발에 쓰입니다.",
    });
  }

  const next = s.successor ?? official?.newerModel;
  if (next) {
    items.push({
      q: `${s.model}의 후속 모델이 나왔나요?`,
      a: s.successor
        ? `${josa(s.successor, "이", "가")} 나왔습니다. 이전 모델은 재고 할인으로 싸게 살 수 있지만 사이즈가 빨리 빠집니다.`
        : `공식몰 목록에 다음 세대 ${josa(next, "이", "가")} 있습니다(${official!.checkedAt} 자동 확인).`,
    });
  }

  const parts = [
    specCheckedAt ? `스펙은 ${specCheckedAt}에 운영자가 출처 페이지를 열어 확인했습니다` : null,
    official ? `가격·판매 여부는 ${official.checkedAt}에 자동 수집기가 한국 공식몰 목록을 서로 다른 날 두 번 읽어 같은 값일 때 반영했습니다` : null,
  ].filter(Boolean);
  if (parts.length) {
    items.push({ q: "이 정보는 언제, 누가 확인했나요?", a: parts.join(". ") + "." });
  }
  return items;
}
