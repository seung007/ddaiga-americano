import { ARTICLES } from "@/lib/guide/articles";
import { upcomingRaces } from "@/lib/races";

/**
 * RSS 2.0 피드 — 2026-10-12
 *
 * 왜 만들었나: 유입의 대부분이 네이버(국내 검색 점유율 63.8%, 인터넷트렌드 2026-04)인데,
 * 네이버 웹문서 수집 단계(서치어드바이저)는 사이트맵과 **RSS 제출**을 쓴다. 우리는 RSS 가 없었다.
 * 제출은 hyun 님이 서치어드바이저 → 요청 → RSS 제출에서 이 주소를 넣는다.
 *
 * 지어내지 않은 것
 *   · **pubDate 를 넣지 않았다.** 글마다 처음 쓴 날을 원장에 갖고 있지 않다. 그럴듯한 날짜를 채우면
 *     plantar-fasciitis 에서 지운 「2025-09-01」과 같은 실수다(components/ArticleJsonLd.tsx 주석).
 *     채널의 lastBuildDate 만 빌드 시각으로 둔다 — 이건 사실이다
 *   · 대회 항목의 날짜는 「발행일」이 아니라 대회일이라 description 에만 적는다
 *
 * 들어가는 것: 러닝 가이드 글 전부, 도구 3개, 다가오는 대회(날짜 확정분, 최대 30개)
 */

export const revalidate = 21600; // 대회 목록이 날짜로 걸러지므로 6시간마다 다시 만든다(홈과 같은 주기)

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ddaiga-americano.vercel.app").replace(/\/$/, "");

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

type Item = { title: string; link: string; description: string; category: string };

const TOOLS: Item[] = [
  { title: "한강 코스 가상 달리기", link: "/courses", description: "목표 거리와 페이스를 넣으면 한강 산책로 위에서 몇 왕복인지, 얼마나 걸리는지 보여줍니다.", category: "도구" },
  { title: "러닝화 두께 비교", link: "/tools/shoe-side", description: "러닝화 최대 3개의 뒤꿈치·앞꿈치 두께와 드롭, 무게를 같은 축척으로 겹쳐 봅니다.", category: "도구" },
  { title: "러닝화 수명 계산기와 기록장", link: "/tools/shoe-life", description: "신발별로 달린 거리를 적어 연구가 측정한 지점(160·320·480·640km)에 얹어 봅니다.", category: "도구" },
  { title: "러닝 페이스 계산기", link: "/tools/pace", description: "목표 시간과 km당 페이스를 양방향으로 계산하고 구간 통과 시간표를 만듭니다.", category: "도구" },
];

export function GET() {
  const guides: Item[] = ARTICLES.map((a) => ({
    title: a.title,
    link: a.href,
    description: a.desc,
    category: a.tag,
  }));
  const races: Item[] = upcomingRaces()
    .filter((r) => r.date)
    .slice(0, 30)
    .map((r) => ({
      title: `${r.name} (${r.date})`,
      link: `/races/${r.id}`,
      description: `${r.date} · ${r.region}${r.venue ? ` · ${r.venue}` : ""} — 종목 ${r.distancesKm.map((d) => (d === 42.195 ? "풀" : d === 21.0975 ? "하프" : `${d}km`)).join("·")}. 접수 정보는 공식 페이지 기준.`,
      category: "대회",
    }));

  const items = [...guides, ...TOOLS, ...races]
    .map(
      (it) => `    <item>
      <title>${esc(it.title)}</title>
      <link>${SITE}${it.link}</link>
      <guid isPermaLink="true">${SITE}${it.link}</guid>
      <description>${esc(it.description)}</description>
      <category>${esc(it.category)}</category>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>뛰다가 아메리카노</title>
    <link>${SITE}</link>
    <description>초보 러너를 위한 러닝화 추천과 근거를 밝힌 러닝 가이드, 대회 일정</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
