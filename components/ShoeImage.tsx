"use client";

import { shoePlaceholder } from "@/lib/shoes/placeholder";

// 신발 이미지 + 로드 실패 시 플레이스홀더 대체.
// onError 이벤트 핸들러를 쓰므로 반드시 클라이언트 컴포넌트여야 함
// (서버 컴포넌트에서 이벤트 핸들러를 prop으로 넘기면 정적 생성 시 빌드 실패).
//
// 2026-09-08: 대체 이미지를 `placehold.co` 에서 **자체 SVG(data URI)** 로 바꿨다.
// 사진 48장 중 40장이 같은 외부 CDN 에 있어서, 그쪽이 막히면 onError 가 40번
// 터지고 그 순간 외부 서비스로 40개 요청이 나갔다. **대비책이 네트워크를 쓰면
// 대비책이 아니다.** 자세한 경위는 `lib/shoes/placeholder.ts` 주석에 있다.
export default function ShoeImage({
  src,
  alt,
  model,
  side,
}: {
  src: string;
  alt: string;
  model: string;
  side: "A" | "B";
}) {
  return (
    <div className="relative w-full aspect-square max-w-[140px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain rounded-xl"
        onError={(e) => {
          const el = e.target as HTMLImageElement;
          // 대체 이미지도 실패하면 onError 가 다시 돌아 무한 루프가 된다.
          // data URI 는 실패하지 않지만, 핸들러를 떼는 편이 확실하다.
          el.onerror = null;
          el.src = shoePlaceholder(model, 280, 280);
        }}
      />
      <span className="absolute top-1 left-1 text-xs font-bold bg-gray-900 text-white px-1.5 py-0.5 rounded">
        {side}
      </span>
    </div>
  );
}
