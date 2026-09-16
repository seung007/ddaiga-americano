"use client";

import { gtagEvent } from "@/lib/gtag";
import { resolveBuyLinks } from "@/lib/shoes/affiliate";
import type { BuyLink } from "@/lib/shoes/types";

/**
 * 구매 링크 버튼 — **반드시 `resolveBuyLinks` 를 거친다** (`check:affiliate` 가 본다).
 * 2026-09-16 에 치환을 안 거치던 자리 2곳을 고친 뒤 만든 공용 버튼이다. 새 화면은 이걸 쓴다.
 */
export default function BuyLinkButtons({
  shoeId,
  shoeName,
  links,
  from,
}: {
  shoeId: string;
  shoeName: string;
  links: BuyLink[];
  from: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {resolveBuyLinks(shoeId, links).map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            gtagEvent("buy_link_click", {
              shoe: shoeName,
              store: link.label,
              affiliate: link.isAffiliate ? "yes" : "no",
              from,
            })
          }
          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${
            link.isOfficial ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-700 hover:bg-gray-800"
          }`}
        >
          {link.label}
          {link.isAffiliate ? " · 제휴" : ""} ↗
        </a>
      ))}
    </div>
  );
}
