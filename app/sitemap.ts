import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { COMPARE_SLUGS } from "@/lib/compares";

/**
 * 폴백은 실제로 서비스 중인 주소여야 한다.
 *
 * 이전 폴백은 `ddaiga-americano.com`이었는데 이 도메인은 구매하지 않았다.
 * NEXT_PUBLIC_SITE_URL이 빠지는 순간(환경변수 실수, 로컬 빌드, preview 배포)
 * 사이트맵 전체가 조용히 존재하지 않는 도메인을 가리키고, 검색엔진에는
 * 전 URL이 죽은 것으로 보인다. 실패가 눈에 안 띄는 종류라 더 위험하다.
 * 도메인을 실제로 사면 이 폴백과 Vercel 환경변수를 같이 바꿀 것.
 */
const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ddaiga-americano.vercel.app").replace(/\/$/, "");

/**
 * 부상 예방 콘텐츠 슬러그 — app/injury/ 디렉터리에서 직접 읽는다.
 *
 * 이전에는 이 목록을 손으로 관리했다. 그러면 글을 새로 써도 여기 추가하는 걸 잊는 순간
 * 페이지는 배포되는데 색인은 안 되고, 그 사실을 알아챌 방법이 없다.
 * COMPARE_SLUGS는 이미 단일 출처인데 injury만 이중 관리였다.
 * sitemap.ts는 빌드 시점에 서버에서 실행되므로 파일시스템을 읽어도 된다.
 */
const INJURY_SLUGS = fs
  .readdirSync(path.join(process.cwd(), "app", "injury"), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`,           lastModified: now, changeFrequency: "weekly",  priority: 1 },
    { url: `${BASE_URL}/shoe-finder`, lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/injury`,      lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE_URL}/community`,   lastModified: now, changeFrequency: "weekly",  priority: 0.4 },
    { url: `${BASE_URL}/terms`,       lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/privacy`,     lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  const injury: MetadataRoute.Sitemap = INJURY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/injury/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const compare: MetadataRoute.Sitemap = COMPARE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/compare/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...core, ...injury, ...compare];
}
