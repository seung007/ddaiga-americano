import type { MetadataRoute } from "next";

// PRD 도메인 (가비아 구매 예정). 배포 환경에서는 NEXT_PUBLIC_SITE_URL로 덮어쓸 수 있음.
const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ddaiga-americano.com").replace(/\/$/, "");

// 부상 예방 콘텐츠 슬러그 (app/injury/* 와 1:1 — 새 글 추가 시 여기 추가)
const INJURY_SLUGS = [
  "achilles",
  "advanced-guide",
  "beginner-guide",
  "cadence",
  "cooldown",
  "first-10k",
  "hwang-young-jo",
  "intermediate-guide",
  "it-band",
  "knee-pain",
  "kwon-eun-ju",
  "midfoot",
  "posture",
  "rest-day",
  "warmup",
  "wide-foot",
];

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

  return [...core, ...injury];
}
