/**
 * 러닝화 한글 이름 · 커뮤니티 애칭 (2026-09-26)
 *
 * 왜: 러닝 오픈채팅 2곳(2026-06-25~09-23, 메시지 약 1만 6천 줄) 전수 분석에서 사람들은 신발을
 * 공식명이 아니라 **애칭으로** 부른다 — 「노블」 110회, 「슈블」 91회, 「에보슬」 68회, 「프로4」 42회.
 * 초보는 그 말을 못 알아들어 대화에 끼지 못했고(「말쿠가 모지?」), 우리 `/shoes` 에는 검색창조차 없었다.
 *
 * 두 종류를 나눠 둔다 — 섞으면 "커뮤니티가 이렇게 부른다"는 말이 거짓이 된다.
 *   · `ko`   : 한글 표기. 검색용. 우리가 적은 음역이라 근거가 필요 없다
 *   · `nick` : **위 채팅에서 실제로 쓰인 것만.** 괄호 안은 2026-09-26 집계 횟수(메시지 본문 기준, 닉네임 제외).
 *             추측으로 늘리지 말 것. 새로 넣으려면 실제 사용처를 주석에 남긴다
 *
 * 모델명이 아니라 **계열**에 붙인다(정규식). 세대가 바뀌어도 애칭은 그대로 쓰이기 때문.
 * 세대가 박힌 애칭(「프로4」「알파3」)은 그 세대 정규식에만 붙인다.
 */
type Alias = { match: RegExp; ko: string[]; nick?: string[] };

const ALIASES: Alias[] = [
  { match: /Novablast/, ko: ["노바블라스트"], nick: ["노블(110)", "노바(68)"] },
  { match: /Superblast/, ko: ["슈퍼블라스트"], nick: ["슈블(91)"] },
  { match: /Adios Pro 4/, ko: ["아디오스 프로 4"], nick: ["프로4(42)", "아프4(6)", "아디프로4(4)"] },
  { match: /Alphafly 3/, ko: ["알파플라이 3"], nick: ["알파플(14)", "알파3(7)"] },
  { match: /Vaporfly/, ko: ["베이퍼플라이"], nick: ["베이퍼(18)"] },
  { match: /Pegasus/, ko: ["페가수스"], nick: ["페가(7)"] },
  { match: /Gel-Kayano/, ko: ["젤카야노", "카야노"], nick: ["젤카(18)"] },
  { match: /Endorphin Speed/, ko: ["엔돌핀 스피드"], nick: ["엔스(5)"] },
  { match: /Velocity NITRO/, ko: ["벨로시티 나이트로"], nick: ["벨나(1)"] },
  { match: /Adrenaline/, ko: ["아드레날린"], nick: ["아드"] },
  { match: /Gel-Nimbus/, ko: ["젤님버스", "님버스"] },
  { match: /Gel-Cumulus/, ko: ["젤큐뮬러스", "큐뮬러스"] },
  { match: /GT-2000/, ko: ["GT2000"] },
  { match: /MetaSpeed Sky/, ko: ["메타스피드 스카이"] },
  { match: /Jolt/, ko: ["졸트"] },
  { match: /Glycerin/, ko: ["글리세린"] },
  { match: /Ghost/, ko: ["고스트"] },
  { match: /Beast/, ko: ["비스트"] },
  { match: /Clifton/, ko: ["클리프톤"] },
  { match: /Bondi/, ko: ["본디"] },
  { match: /Arahi/, ko: ["아라히"] },
  { match: /Mach/, ko: ["마하"] },
  { match: /Rocket X/, ko: ["로켓X"] },
  { match: /Kinvara/, ko: ["킨바라"] },
  { match: /Triumph/, ko: ["트라이엄프"] },
  { match: /Guide/, ko: ["가이드"] },
  { match: /Ride/, ko: ["라이드"] },
  { match: /Endorphin Pro/, ko: ["엔돌핀 프로"] },
  { match: /1080/, ko: ["1080", "프레시폼 1080"] },
  { match: /860/, ko: ["860"] },
  { match: /520/, ko: ["520"] },
  { match: /Rebel/, ko: ["레벨"] },
  { match: /SuperComp Elite/, ko: ["슈퍼컴프 엘리트"] },
  { match: /Adizero Boston/, ko: ["보스턴"] },
  { match: /Ultraboost/, ko: ["울트라부스트"] },
  { match: /InfinityRN/, ko: ["인피니티런"] },
  { match: /Revolution/, ko: ["레볼루션"] },
  { match: /Wave Rider/, ko: ["웨이브 라이더"] },
  { match: /Wave Sky/, ko: ["웨이브 스카이"] },
  { match: /Wave Inspire/, ko: ["웨이브 인스파이어"] },
  { match: /Cloudmonster/, ko: ["클라우드몬스터"] },
  { match: /Cloudrunner/, ko: ["클라우드러너"] },
  { match: /KIPRUN/, ko: ["킵런"] },
];

const BRAND_KO: Record<string, string[]> = {
  Asics: ["아식스"],
  Nike: ["나이키"],
  Adidas: ["아디다스"],
  Hoka: ["호카"],
  Brooks: ["브룩스"],
  "New Balance": ["뉴발란스", "뉴발"],
  Saucony: ["써코니", "사코니"],
  Mizuno: ["미즈노"],
  On: ["온러닝", "온"],
  Puma: ["푸마", "퓨마"],
  Decathlon: ["데카트론"],
};

function aliasesOf(model: string): Alias[] {
  return ALIASES.filter((a) => a.match.test(model));
}

/** 상세 페이지 표시용 — 채팅에서 실제로 쓰인 애칭만, 횟수 표기는 뺀다 */
export function nicknamesOf(model: string): string[] {
  return aliasesOf(model).flatMap((a) => (a.nick ?? []).map((n) => n.replace(/\(\d+\)$/, "")));
}

const norm = (s: string) => s.toLowerCase().replace(/[\s\-_.·]/g, "");

/** 검색용 문자열 — 영문명 · 한글명 · 애칭 · 브랜드 한글명 */
export function searchKeyOf(brand: string, model: string): string {
  const parts = [brand, model, ...(BRAND_KO[brand] ?? []), ...aliasesOf(model).flatMap((a) => [...a.ko, ...(a.nick ?? [])])];
  return norm(parts.join(" ").replace(/\(\d+\)/g, ""));
}

/** 검색어 매칭 — 공백으로 나눈 조각이 전부 들어 있어야 한다(「아식스 노블」 → 아식스 AND 노블) */
export function matchesQuery(key: string, query: string): boolean {
  const tokens = query.split(/\s+/).map(norm).filter(Boolean);
  return tokens.every((t) => key.includes(t));
}
