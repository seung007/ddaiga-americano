"use client";

import { useEffect, useState } from "react";
import { gtagEvent } from "@/lib/gtag";

/**
 * 신발 상세의 「♥ 찜」 (2026-10-13)
 *
 * 벤치마킹(Believe in the Run 「Shoe Wall」 — 무료 계정으로 신발 저장)에서 가져온 것.
 * 우리는 계정 없이 이미 목록(/shoes)에 ♥ 찜이 있었는데, **상세 페이지에는 없어서** 글·검색으로
 * 상세에 바로 들어온 사람은 담을 방법이 없었다. 목록과 같은 저장소 키를 쓴다(components/ShoesBrowser.tsx LIKE_KEY).
 */
const LIKE_KEY = "ddaiga:likedShoes";

function read(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(LIKE_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, 60) : [];
  } catch {
    return [];
  }
}

export default function LikeButton({ id, name }: { id: string; name: string }) {
  const [liked, setLiked] = useState<string[]>([]);
  useEffect(() => {
    setLiked(read());
    const on = (e: StorageEvent) => {
      if (e.key === LIKE_KEY) setLiked(read());
    };
    window.addEventListener("storage", on);
    return () => window.removeEventListener("storage", on);
  }, []);
  const on = liked.includes(id);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? `${name} 찜 해제` : `${name} 찜하기`}
      onClick={() => {
        const cur = read();
        const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
        try {
          localStorage.setItem(LIKE_KEY, JSON.stringify(next));
        } catch {
          /* 저장소가 막힌 브라우저 — 화면에서만 바뀐다 */
        }
        setLiked(next);
        gtagEvent("shoe_like", { id, on: !on, from: "detail" });
      }}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
        on ? "border-red-200 bg-red-50 text-red-600" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
      }`}
    >
      <span aria-hidden>♥</span>
      {on ? "찜한 신발" : "찜하기"}
    </button>
  );
}
