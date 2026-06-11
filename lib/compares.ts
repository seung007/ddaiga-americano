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
] as const;
