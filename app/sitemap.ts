import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { COMPARE_SLUGS } from "@/lib/compares";

// PRD 도메인 (가비아 구매 예정). 배포 환경에서는 NEXT_PUBLIC_SITE_URL로 덮어쓸 수 있음.
const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ddaiga-americano.com").replace(/\/$/, "");

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
