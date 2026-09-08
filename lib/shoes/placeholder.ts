/**
 * 신발 사진이 안 뜰 때 대신 그릴 그림 — **네트워크를 쓰지 않는다.**
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 만들었나 (2026-09-08)
 *
 * 세 곳(`ShoeImage`, `ShoeStrip`, `/shoe-finder`)이 `onError` 에서
 * `https://placehold.co/...` 로 갈아끼우고 있었다. 즉 **사진 실패의 대비책이
 * 또 다른 외부 요청**이었다.
 *
 * 이게 왜 문제인가 —
 *   · 신발 사진 48장 중 40장이 경쟁사 CDN(`cdn.runrepeat.com`)에 있다.
 *     그쪽이 막히는 날에는 40번의 `onError` 가 한꺼번에 터지고,
 *     그 순간 **40개의 placehold.co 요청**이 나간다.
 *   · placehold.co 가 느리거나 죽어 있으면 대비책마저 실패한다.
 *     그러면 화면에는 깨진 이미지 아이콘이 남는다 — 대비책이 없는 것과 같다.
 *   · `check:cdn` 은 cdnjs·unpkg·jsdelivr 만 보고 있어서 이걸 잡지 못했다.
 *     **실패 경로에 숨은 외부 의존은 평소에 보이지 않는다.**
 *
 * data URI 로 만들면 요청이 0이다. 느려질 일도, 죽을 일도 없다.
 * 문자열이 길어져 HTML 이 조금 커지지만, 이건 `onError` 때만 쓰이는 값이라
 * 실제로 붙는 것은 깨진 사진 개수만큼이다.
 *
 * ⚠️ SVG 를 data URI 로 쓸 때 `base64` 를 쓰지 않는다 —
 * 한글이 섞이면 `btoa` 가 던지고, Node 와 브라우저에서 처리도 다르다.
 * `charset=utf-8` + `encodeURIComponent` 가 양쪽에서 같게 동작한다.
 */

/** 라벨이 길면 잘라낸다 — 넘치면 그림 밖으로 삐져나간다. */
function fit(label: string, max: number): string {
  const s = label.trim();
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

/**
 * @param label  가운데 적을 글자 (브랜드명이나 모델명)
 * @param w      가로 픽셀
 * @param h      세로 픽셀
 */
export function shoePlaceholder(label: string, w = 280, h = 280): string {
  // 폭에 비례해 글자 크기를 정한다. 96px 짜리와 280px 짜리를 같은 크기로 쓰면
  // 작은 쪽에서 글자가 넘친다.
  const fontSize = Math.max(10, Math.round(Math.min(w, h) / 9));
  const maxChars = Math.max(6, Math.floor(w / (fontSize * 0.62)));
  const text = fit(label, maxChars);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeXml(
    text
  )} 사진 없음"><rect width="${w}" height="${h}" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" fill="#9ca3af">${escapeXml(
    text
  )}</text></svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * `<svg>` 안에 그대로 넣으면 안 되는 다섯 글자.
 * 신발 이름에 `&` 가 들어가는 경우가 있다(예: 브랜드 협업 모델).
 */
function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
