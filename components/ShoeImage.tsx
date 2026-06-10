"use client";

// 신발 이미지 + 로드 실패 시 플레이스홀더 대체.
// onError 이벤트 핸들러를 쓰므로 반드시 클라이언트 컴포넌트여야 함
// (서버 컴포넌트에서 이벤트 핸들러를 prop으로 넘기면 정적 생성 시 빌드 실패).
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
          (e.target as HTMLImageElement).src =
            `https://placehold.co/280x280/f3f4f6/9ca3af?text=${encodeURIComponent(model)}`;
        }}
      />
      <span className="absolute top-1 left-1 text-xs font-bold bg-gray-900 text-white px-1.5 py-0.5 rounded">
        {side}
      </span>
    </div>
  );
}
