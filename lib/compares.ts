// 사전 렌더링 + 사이트맵 등록 대상 비교 페어 (단일 출처).
// app/compare/[slug]/page.tsx 와 app/sitemap.ts 가 함께 사용.
// 새 비교를 추가하려면 여기에 "신발A-id-vs-신발B-id" 형식으로 추가하면 됩니다.
// (두 id는 lib/shoes/data.ts 의 실제 id여야 페이지가 정상 렌더링됩니다)
export const COMPARE_SLUGS = [
  // 데일리·맥스쿠션 인기 대결
  "hoka-clifton-10-vs-brooks-ghost-17",
  "hoka-clifton-10-vs-nb-1080-v15",
  "brooks-ghost-17-vs-nb-1080-v15",
  "asics-gel-nimbus-27-vs-hoka-bondi-9",
  "nike-pegasus-42-vs-brooks-ghost-17",
  "nike-pegasus-42-vs-hoka-clifton-10",
  "nike-pegasus-42-vs-asics-gel-nimbus-27",
  "hoka-clifton-10-vs-hoka-bondi-9",
  "asics-gel-nimbus-27-vs-nb-1080-v15",
  "saucony-triumph-23-vs-asics-gel-nimbus-27",
  "adidas-ultraboost-25-vs-nike-pegasus-42",
  "on-cloudmonster-2-vs-hoka-clifton-10",
  "brooks-ghost-17-vs-brooks-glycerin-22",
  // 안정화 대결
  "asics-gt-2000-14-vs-brooks-adrenaline-gts-25",
  "asics-gt-2000-14-vs-saucony-guide-18",
  "brooks-adrenaline-gts-25-vs-nb-860-v15",
  "hoka-clifton-10-vs-asics-gt-2000-14",
  "asics-gel-kayano-32-vs-brooks-adrenaline-gts-25",
  // 템포·레이싱·슈퍼트레이너
  "nb-fuelcell-rebel-v4-vs-saucony-endorphin-speed-5",
  "adidas-adizero-adios-pro-4-vs-nike-vaporfly-4",
  "hoka-mach-6-vs-saucony-endorphin-speed-5",
  "asics-novablast-5-vs-asics-superblast-2",
  // 2026-09-28 — 러닝 오픈채팅 2곳에서 **실제로 같이 언급된 쌍**(연속 3개 메시지 안에 둘 다 나온 횟수).
  //   고르는 기준을 남긴다: 우리가 붙이고 싶은 쌍이 아니라 사람들이 비교하던 쌍이다. 세대는 현행 모델로.
  "adidas-adizero-evo-sl-vs-asics-novablast-6",        // 에보슬 × 노블 35
  "asics-novablast-6-vs-asics-superblast-3",           // 노블 × 슈블 32
  "adidas-adizero-adios-pro-4-vs-nike-alphafly-3",     // 아디오스 프로 × 알파플라이 29
  "adidas-adizero-evo-sl-vs-asics-superblast-3",       // 에보슬 × 슈블 23
  "adidas-adizero-adios-pro-4-vs-adidas-adizero-evo-sl", // 아디오스 프로 × 에보슬 14
  "asics-gel-kayano-33-vs-nike-vomero-18",             // 카야노 × 보메로 9
  "nb-1080-v15-vs-asics-gel-nimbus-28",                // 1080 × 님버스 9
  "nb-1080-v15-vs-nike-vomero-18",                     // 1080 × 보메로 9
  "adidas-adizero-adios-pro-4-vs-adidas-adizero-boston-13", // 아디오스 프로 × 보스턴 9
  "saucony-endorphin-speed-5-vs-asics-novablast-6",    // 엔돌핀 × 노블 9
  "asics-gel-nimbus-28-vs-nike-vomero-18",             // 님버스 × 보메로 7
  "mizuno-neo-vista-3-vs-asics-superblast-3",          // 네오비스타 × 슈블 5
] as const;
