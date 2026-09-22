/**
 * GA4 이벤트 헬퍼 — gtag가 아직 없으면 **버리지 말고 큐에 쌓는다.**
 *
 * 2026-09-01에 발견한 문제. 배포 후 나흘 데이터가 이랬다.
 *   recommend_form_complete  3건 / 사용자 2명
 *   recommend_form_start     1건 / 사용자 1명
 * 시작 없이 완주할 수는 없다.
 *
 * 원인으로 보이는 것: 이전 구현이 `if (typeof g === "function")`으로 감싸
 * **gtag가 없으면 조용히 버렸다.** GA는 layout.tsx에서
 * `<Script strategy="afterInteractive">`로 로드되므로 하이드레이션 직후 몇 백 ms 동안
 * window.gtag가 없다. `recommend_form_start`는 첫 「다음」 클릭에 발화하니
 * 그 창에 걸리기 쉽고, `complete`는 8단계를 지난 한참 뒤라 늘 살아남는다.
 * **이른 이벤트만 사라지는 비대칭**이 정확히 이 모양이다.
 *
 * 다만 이건 기제가 코드에 있다는 것이지, 그 순간 gtag가 없었다는 직접 관측은 아니다.
 * 증명은 이 수정 후 3~4일치 데이터가 start ≥ complete로 뒤집히는지로 한다.
 *
 * ⚠️ 2026-09-22 — **뒤집히지 않았다. 이 진단은 틀렸거나, 최소한 원인의 전부가 아니었다.**
 *   GA4 28일(8/25~9/21):  complete 13건/11명  vs  start 12건/10명 — 역전 그대로다.
 *
 *   진짜 경로는 `app/shoe-finder/page.tsx` 의 `applyProfile()` 에 있었다.
 *   공유 URL·「지난 추천 다시보기」로 들어오면 **결과 화면부터 시작해서** `goNext()` 를
 *   한 번도 안 거친다. 그래서 start 없이 complete만 찍힌다. 타이밍 문제가 아니라 **경로 문제**였다.
 *
 *   여기 큐는 그대로 둔다 — 이벤트를 조용히 버리지 않는 것 자체는 옳다.
 *   다만 **이 큐가 역전을 고쳤다고 적으면 안 된다.** 안 고쳤다.
 *   경위와 대책은 `shoe-finder/page.tsx` 의 `restoredRef` 주석에 있다.
 *
 * dataLayer에 직접 넣지 않고 로컬 큐에 담았다가 gtag가 생긴 뒤 흘려보낸다.
 * config보다 먼저 들어간 event가 어떻게 처리되는지 확신할 수 없어서,
 * **gtag가 준비된 뒤에 보내는 쪽**을 택했다.
 */
const pendingEvents: Array<[string, Record<string, unknown>]> = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;
let giveUpTimer: ReturnType<typeof setTimeout> | null = null;

function stopFlushing() {
  if (flushTimer) { clearInterval(flushTimer); flushTimer = null; }
  if (giveUpTimer) { clearTimeout(giveUpTimer); giveUpTimer = null; }
}

function flushPending() {
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof g !== "function") return;
  while (pendingEvents.length) {
    const next = pendingEvents.shift();
    if (next) g("event", next[0], next[1]);
  }
  stopFlushing();
}

export function gtagEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof g === "function") { g("event", name, params); return; }

  pendingEvents.push([name, params]);
  if (!flushTimer) flushTimer = setInterval(flushPending, 250);
  // GA가 차단된 환경(광고 차단기 등)에서는 영원히 안 온다. 10초 뒤 포기한다.
  if (!giveUpTimer) giveUpTimer = setTimeout(() => { pendingEvents.length = 0; stopFlushing(); }, 10_000);
}
