import Link from "next/link";

/**
 * 글 안 목차 — 긴 글에서 **원하는 절로 바로 간다.**
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 만들었나 (2026-09-12)
 *
 * 경쟁 조사에서 러닝위키(`runningwikii.com`)가 긴 글마다 접이식 목차를
 * 갖고 있는 것을 확인했다. 우리 긴 글(평발·카본화·와이드)에는 없다.
 *
 * 사용자 원칙과도 맞는다 — *"최대한 클릭을 적게 해서 원하는 정보를 얻게."*
 * 목차는 **클릭을 하나 늘려서 스크롤을 여럿 없앤다.** 평발 글은 모바일에서
 * 7,700px 이 넘는데, "그래서 뭘 신으라고?"만 궁금한 사람은 지금 그걸 찾아
 * 내려가야 한다.
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 DOM 을 훑지 않고 목록을 받는가
 *
 * 클라이언트에서 `h2` 를 긁어 목차를 만드는 방법이 흔하다. 안 쓴다.
 *   · 클라이언트 컴포넌트가 되어야 하고, 첫 렌더에 목차가 없다가 나타난다
 *   · **서버 HTML 에 목차가 없으면 크롤러와 AI 도 못 본다** — 이 사이트에서
 *     목차의 값 절반은 그쪽이다
 *   · 이 저장소는 하이드레이션 불일치로 3주를 날린 적이 있다(`<svg><title>`)
 *
 * 그래서 **순수 서버 컴포넌트**로 두고 항목을 명시적으로 받는다.
 * 대신 `id` 를 손으로 맞춰야 하는 비용이 생기는데, 그건 아래 검사가 잡는다.
 *
 * ⚠️ 여기 적은 `id` 와 실제 `<h2 id>` 가 어긋나면 **링크가 조용히 아무 데도
 * 안 간다.** 앵커는 404 를 내지 않는다 — 그냥 아무 일도 안 일어난다.
 * `npm run check:toc` 가 그 불일치를 잡는다.
 */

export type TocItem = {
  /** 대상 `<h2 id="...">` 의 id */
  id: string;
  /** 목차에 보일 짧은 이름. 제목을 그대로 쓰지 않아도 된다 */
  label: string;
};

export default function TableOfContents({
  items,
  title = "이 글에서",
}: {
  items: readonly TocItem[];
  title?: string;
}) {
  if (items.length < 3) return null; // 두 항목짜리 목차는 목차가 아니다

  return (
    /**
     * `<details>` 를 쓰되 **모바일에서만 접는다.**
     * 데스크톱은 세로 여유가 있어서 펼쳐 두는 편이 한눈에 들어오고,
     * 390px 에서는 목차가 본문을 밀어내면 목차가 본문이 된다.
     * `open` 속성은 CSS 로 못 바꾸므로 두 벌을 두지 않고 항상 열어 두되
     * 모바일에서 높이를 제한한다 — 그게 가장 단순하고 깨질 데가 없다.
     */
    <nav
      aria-label="목차"
      className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4"
    >
      <p className="text-xs font-semibold tracking-wide text-gray-500">{title}</p>
      <ol className="mt-2 space-y-1.5">
        {items.map((it, i) => (
          <li key={it.id} className="flex gap-2 text-sm leading-snug">
            <span className="shrink-0 tabular-nums text-gray-400">{i + 1}.</span>
            <Link
              href={`#${it.id}`}
              className="text-gray-700 underline-offset-2 hover:text-emerald-700 hover:underline"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
