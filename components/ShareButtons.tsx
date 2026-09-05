"use client";

import { useEffect, useState } from "react";

/**
 * 공유 버튼 — 2026-09-06
 *
 * 왜 필요한가
 * ──────────
 * 유입의 76%가 네이버이고, 한국에서 링크가 실제로 도는 통로는 **카카오톡**이다.
 * 지금 이 사이트에는 공유 수단이 하나도 없다 — 주소창을 긁어 복사하는 수밖에 없고,
 * 모바일에서 그건 사실상 안 한다.
 *
 * 설계 원칙 — **키가 없어도 오늘 작동해야 한다**
 * ─────────────────────────────────────────────
 * 카카오톡 공유는 JavaScript 키가 필요하고, 그건 사람이 발급해야 한다.
 * 키를 기다리는 동안 아무것도 못 쓰게 만들면 이 컴포넌트는 그냥 죽은 코드다.
 * 그래서 셋으로 나눈다.
 *
 *   · **링크 복사** — 키 불필요. 항상 작동
 *   · **공유하기(네이티브)** — 모바일 브라우저의 Web Share API. 키 불필요.
 *     카톡·문자·메모 등 기기에 깔린 앱이 전부 뜬다. 지원 안 하면 버튼을 숨긴다
 *   · **카카오톡** — `NEXT_PUBLIC_KAKAO_JS_KEY`가 있을 때만 렌더한다
 *
 * `supabaseConfigured`와 같은 규칙이다 — **눌러도 안 되는 버튼은 없는 것만 못하다.**
 */

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: { sendDefault: (o: unknown) => void };
    };
  }
}

const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

export default function ShareButtons({
  title,
  description,
  from,
}: {
  title: string;
  description: string;
  /** GA에서 어느 글이 공유되는지 가른다 */
  from: string;
}) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [kakaoReady, setKakaoReady] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);

    if (!KAKAO_KEY) return;
    // SDK를 한 번만 붙인다.
    const existing = document.getElementById("kakao-sdk");
    if (existing) {
      if (window.Kakao?.isInitialized()) setKakaoReady(true);
      return;
    }
    const s = document.createElement("script");
    s.id = "kakao-sdk";
    // ⚠️ SRI(integrity) 해시를 넣지 않았다.
    // 처음에 sha384 값을 적었는데 **그건 내가 지어낸 값이었다.**
    // SRI는 틀리면 브라우저가 스크립트를 조용히 차단한다 — 고장이 눈에 안 띄는 종류다.
    // 카카오 공식 문서의 최신 버전·해시를 확인해서 함께 갱신할 것.
    // (AGENTS.md — 확인 못 한 구체값은 쓰지 않는다)
    s.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
    s.crossOrigin = "anonymous";
    s.onload = () => {
      try {
        if (window.Kakao && !window.Kakao.isInitialized()) window.Kakao.init(KAKAO_KEY);
        setKakaoReady(Boolean(window.Kakao?.isInitialized()));
      } catch {
        // 키가 틀렸거나 도메인이 등록 안 된 경우. 버튼을 안 띄우면 그만이다.
        setKakaoReady(false);
      }
    };
    document.head.appendChild(s);
  }, []);

  function track(how: string) {
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof g === "function") g("event", "share_click", { from, method: how });
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      track("copy");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 권한이 없으면 조용히 실패하지 말고 주소를 보여준다.
      window.prompt("아래 주소를 복사하세요", window.location.href);
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, text: description, url: window.location.href });
      track("native");
    } catch {
      // 사용자가 취소한 경우도 여기로 온다. 아무것도 하지 않는다.
    }
  }

  function kakaoShare() {
    if (!window.Kakao?.isInitialized()) return;
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title,
        description,
        imageUrl: `${window.location.origin}/opengraph-image`,
        link: { mobileWebUrl: window.location.href, webUrl: window.location.href },
      },
      buttons: [
        {
          title: "글 보러 가기",
          link: { mobileWebUrl: window.location.href, webUrl: window.location.href },
        },
      ],
    });
    track("kakao");
  }

  const btn =
    "rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50";

  return (
    <div className="my-8 flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs text-gray-500">도움이 됐다면 공유해주세요</span>

      {kakaoReady && (
        <button onClick={kakaoShare} className={`${btn} border-yellow-300 bg-yellow-50 text-yellow-900 hover:bg-yellow-100`}>
          카카오톡
        </button>
      )}

      {canNativeShare && (
        <button onClick={nativeShare} className={btn}>
          공유하기
        </button>
      )}

      <button onClick={copyLink} className={btn} aria-live="polite">
        {copied ? "복사됐어요" : "링크 복사"}
      </button>
    </div>
  );
}
