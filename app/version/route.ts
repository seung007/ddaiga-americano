/**
 * 지금 배포된 커밋을 알려주는 한 줄 엔드포인트.
 *
 *   curl https://ddaiga-americano.vercel.app/version
 *   → 792b319f8a...  (또는 로컬에서는 "local")
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 만들었나 (2026-09-08)
 *
 * `npm run ship` 이 푸시 후 배포 반영을 기다리게 만들었는데, 그 판정을
 * **`/_next/static/` 청크 해시 비교**로 했다. 프록시였고, 틀렸다.
 *
 * `scripts/ship.mjs` 만 바꾼 커밋에서는 **클라이언트 번들이 한 글자도 안 바뀐다.**
 * Vercel 은 새로 배포하는데 청크 해시는 그대로다. 그래서 대기가 3분을 꽉 채우고
 * "3분 안에 안 바뀜 — 배포 로그를 확인하세요"라는 **틀린 경고**를 냈다.
 * 배포는 정상이었다.
 *
 * 교훈: **묻고 싶은 것을 직접 물어라.** 알고 싶은 것은 "지금 떠 있는 커밋이
 * 무엇인가"였는데, 나는 "번들이 바뀌었나"를 물었다. 대부분의 경우 두 질문의
 * 답이 같아서 프록시가 통하지만, **같지 않은 경우가 바로 문제가 생기는 경우다.**
 *
 * `VERCEL_GIT_COMMIT_SHA` 는 Vercel 이 빌드 시점에 넣어 주는 값이다.
 * `force-static` 이라 빌드 때 한 번 굽히고, 요청마다 함수가 돌지 않는다.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response((process.env.VERCEL_GIT_COMMIT_SHA ?? "local") + "\n", {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      // 배포 판정에 쓰이니 캐시가 끼면 안 된다.
      "cache-control": "no-store, max-age=0",
    },
  });
}
