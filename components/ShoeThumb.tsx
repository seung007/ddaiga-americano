"use client";

import { shoePlaceholder } from "@/lib/shoes/placeholder";

/** 목록·상세용 신발 사진. 실패하면 자체 SVG 로 바꾼다(외부 요청 없이) — `ShoeImage` 와 같은 규칙 */
export default function ShoeThumb({ src, alt, model, className = "" }: { src: string; alt: string; model: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      className={`object-contain ${className}`}
      onError={(e) => {
        const el = e.currentTarget;
        el.onerror = null;
        el.src = shoePlaceholder(model, 280, 280);
      }}
    />
  );
}
