/**
 * 가이드 글 읽기 부품 (2026-10-13 가독성 재설계)
 *
 * 사용자 지적: "글자가 너무 많아서 읽히지가 않고 … 보자마자 뭐야 하고 바로 나갈 것 같은데"
 * 실측(375px): 처음 달리기 글 8,308px·본문 인용 27개, 허브 13,153px.
 * 한 문장에 인원·기간·비율·저자·연도가 다 들어가서 「그래서 뭘 하라는지」가 문장 끝에야 나왔다.
 *
 * 규칙: **결론 먼저, 근거는 접기.** 사실은 지우지 않고 <Evidence> 안으로 옮긴다.
 * 안전 정보(멈출 신호·병원·119)는 절대 접지 않는다.
 *
 * 전부 서버 컴포넌트 — <details> 는 JS 없이 열리고, 접힌 내용도 HTML 에 있어 검색엔진이 읽는다.
 * ⚠️ 인용 검사기(scripts/verify-citations.mjs)는 소스를 문자열로 훑는다. <Evidence> 안에서도
 *    「저자 (연도)」를 URL 앞 300자 안에 평문으로 둔다.
 */

/** 글 맨 위 한 문단 — 이 글이 무엇에 답하는지 두 문장 안에 */
export function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 break-keep text-base leading-[1.8] text-gray-700">{children}</p>;
}

/** 본문 단락 — 16px·줄간격 1.8·어절 단위 줄바꿈 */
export function P({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`mt-4 break-keep text-base leading-[1.8] text-gray-800 ${className}`}>{children}</p>;
}

/** 섹션 제목 — id 는 목차 검사(check:toc)가 문자열로 찾으므로 각 페이지에서 h2 를 직접 쓴다. 이건 스타일만 */
export const H2 = "mt-14 scroll-mt-20 break-keep text-2xl font-bold leading-snug text-gray-900";
export const H3 = "mt-8 break-keep text-xl font-bold text-gray-900";

/** 「한눈에」 — 글 전체 요약 3~4줄 */
export function Summary({ items, title = "한눈에" }: { items: React.ReactNode[]; title?: string }) {
  return (
    <div className="mt-6 rounded-2xl bg-emerald-50 px-5 py-4">
      <p className="text-sm font-bold text-emerald-800">{title}</p>
      <ul className="mt-2 space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5 break-keep text-base leading-[1.65] text-emerald-950">
            <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * 단서 한 줄 — **접지 않는다.** (2026-10-13 council: 근거를 접자 「초보만 모은 연구가 아님」「표본이 작음」
 * 「시간으로 바꾼 건 저희 단순화」 같은 단서가 같이 숨어, 보이는 지시만 단정적으로 남았다.)
 * 연구 대상이 독자와 다르다 / 표본이 작다·탐색적이다 / 저희가 단순화했다 / 연구끼리 엇갈린다 → 이걸로 본문에 남긴다.
 */
export function Note({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 break-keep text-sm leading-[1.7] text-gray-500">※ {children}</p>;
}

/** 「이렇게 하세요」 — 할 일 목록 */
export function Todo({
  items,
  title = "이렇게 하세요",
  basis,
}: {
  items: React.ReactNode[];
  title?: string;
  /** 목록 전체가 연구로 확인된 것인지, 저희 제안인지 */
  basis?: "paper" | "rule";
}) {
  return (
    <div className="mt-5 rounded-xl border border-gray-200 px-4 py-3.5">
      <p className="text-sm font-bold text-gray-900">
        {title}
        {basis && <Basis kind={basis} />}
      </p>
      <ul className="mt-2 space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5 break-keep text-base leading-[1.7] text-gray-800">
            <span aria-hidden className="mt-[1px] shrink-0 font-bold text-emerald-600">✓</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 근거 — 숫자·인원·연구 설계·한계. 기본 접힘 */
export function Evidence({
  n,
  children,
  label = "근거 보기",
}: {
  /** 안에 든 연구 수. 모르면 생략 */
  n?: number;
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <details data-ev={label} className="group/ev mt-3 rounded-xl bg-gray-50 open:pb-1">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 px-4 py-2.5 text-sm text-gray-500 hover:text-gray-800 [&::-webkit-details-marker]:hidden">
        <span aria-hidden className="inline-block transition-transform group-open/ev:rotate-90">›</span>
        {label}
        {n ? <span className="text-gray-400">· 연구 {n}개</span> : null}
      </summary>
      <div className="space-y-2.5 break-keep px-4 pb-3 text-sm leading-[1.75] text-gray-600">{children}</div>
    </details>
  );
}

/** 참고 문헌 — 맨 끝, 기본 접힘 */
export function References({
  n,
  note,
  title = "참고 문헌",
  children,
}: {
  n?: number;
  note?: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section id="refs" aria-label={title} className="mt-14 scroll-mt-20 border-t border-gray-200 pt-6">
      <details data-refs="1" className="group/refs">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
          {/* summary 안 h2 — 제목 목록(스크린리더·목차)에서 「참고 문헌」이 빠지지 않게 (council Dev 지적) */}
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-gray-900">
              {title}
              {n ? <span className="ml-1.5 text-sm font-normal text-gray-400">{n}개</span> : null}
            </h2>
            {/* 2026-10-13: 대조 날짜를 접힌 채로도 보이게 — 「언제 확인했나」는 신뢰 신호다(벤치마킹: 날짜를 첫 화면에 두는 사이트들) */}
            {note && <p className="mt-0.5 break-keep text-xs text-gray-400">{note}</p>}
          </div>
          <span className="shrink-0 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 group-open/refs:hidden">펼치기</span>
          <span className="hidden shrink-0 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 group-open/refs:inline">접기</span>
        </summary>
        <div className="mt-3 break-keep text-sm leading-relaxed text-gray-600 [&_li]:mt-2.5">{children}</div>
      </details>
    </section>
  );
}

/**
 * 할 일의 근거 수준 — 「경험칙」「논문 결론」이 낯설다는 지적으로 바꾼 말.
 * paper 는 「연구 근거」(처음엔 「연구로 확인」이었으나 관찰 연구 한 편에서 나온 기준에도 붙어 과장이라는 검증 지적으로 낮춤, 2026-10-13).
 */
export function Basis({ kind }: { kind: "paper" | "rule" }) {
  return kind === "paper" ? (
    <span className="ml-1.5 inline-block whitespace-nowrap rounded bg-emerald-50 px-1.5 py-0.5 align-middle text-xs font-medium text-emerald-700">
      연구 근거
    </span>
  ) : (
    <span className="ml-1.5 inline-block whitespace-nowrap rounded bg-gray-100 px-1.5 py-0.5 align-middle text-xs text-gray-600">
      저희 제안
    </span>
  );
}

/** 주의 박스 — 멈출 신호·병원 신호. 접지 않는다 */
export function Warn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-red-900">
      <p className="text-sm font-bold">{title}</p>
      <div className="mt-1.5 break-keep text-base leading-[1.7]">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * 2026-11-18 새 틀 — 국내 한국어 글 실측(docs/조사/벤치마킹_2026-09-12.md 「가이드 글 부분 구성」 1·2)
 *
 * 왜: 우리 글은 절 하나에 굵은 첫 문장 + 「이렇게 하세요」 상자 + 「근거 보기」 접힘이 매번 붙었다.
 *   러닝위키는 절마다 요약 상자 하나, 브런치는 결론 한 줄, 토스는 「1️⃣ 굵은 소제목 + 설명」, 러너스레터는 부분 끝 「한 줄 요약」.
 *   → 상자·접힘을 걷어내고, 할 일은 본문 안 번호 목록, 근거는 문장 끝 [n] + 글 끝 「근거와 출처」 한 곳(펼친 채로).
 * 안전 정보(<Warn>)·단서(<Note>)는 그대로 접지 않는다. 출처는 하나도 빼지 않는다 — 「근거 보기」에 있던 숫자는 출처 항목의 「확인한 것」으로 옮긴다.
 * ───────────────────────────────────────────────────────────── */

/** 큰 제목 앞 번호 — 목차 번호와 같다 */
export function Num({ n }: { n: number }) {
  return <span className="mr-2 tabular-nums text-emerald-700">{n}.</span>;
}

/** 3줄 요약 — 제목 바로 아래 번호 목록(토스 「📌 3줄 요약」) */
export function KeyPoints({ items, title = "3줄 요약" }: { items: React.ReactNode[]; title?: string }) {
  return (
    <div className="mt-6 rounded-2xl bg-emerald-50 px-5 py-4">
      <p className="text-sm font-bold text-emerald-800">{title}</p>
      <ol className="mt-2 space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5 break-keep text-base leading-[1.65] text-emerald-950">
            <span aria-hidden className="w-4 shrink-0 font-bold tabular-nums text-emerald-700">{i + 1}.</span>
            <span>{it}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧"];

/** 할 일 — 상자 없이 「① 굵은 한 줄 + 설명」(토스 1️⃣·러너스레터 1위·2위). 근거 수준 표시는 그대로 둔다 */
export function Steps({
  items,
  basis,
  title = "이렇게 해 보세요",
}: {
  items: { t: React.ReactNode; d?: React.ReactNode }[];
  basis?: "paper" | "rule";
  title?: string;
}) {
  return (
    <div className="mt-5">
      <p className="text-sm font-semibold text-gray-500">
        {title}
        {basis && <Basis kind={basis} />}
      </p>
      <ol className="mt-2 space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5 break-keep text-base leading-[1.7] text-gray-800">
            <span aria-hidden className="shrink-0 font-bold text-emerald-700">{CIRCLED[i] ?? `${i + 1}.`}</span>
            <span>
              <strong className="text-gray-900">{it.t}</strong>
              {it.d && <> {it.d}</>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** 한 줄 요약 — 절 끝(러너스레터 「✉️ 한 줄 요약」) */
export function OneLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 break-keep border-l-4 border-emerald-500 pl-3 text-base font-semibold leading-[1.7] text-gray-900">
      <span className="mr-1.5 text-sm font-normal text-gray-500">한 줄 요약</span>
      {children}
    </p>
  );
}

/** 문장 끝 출처 번호 — 글 끝 「근거와 출처」의 같은 번호로 간다 */
export function Cite({ n }: { n: number | number[] }) {
  const list = Array.isArray(n) ? n : [n];
  return (
    <sup className="ml-0.5 mr-1 whitespace-nowrap text-xs">
      [
      {list.map((k, i) => (
        <span key={k}>
          {i > 0 && ","}
          <a href={`#ref-${k}`} className="text-emerald-700 hover:underline">{k}</a>
        </span>
      ))}
      ]
    </sup>
  );
}

/**
 * 근거와 출처 — 글 끝 한 곳, **펼친 채로**(브런치 「참고문헌」: 번호 · 저자 · 학술지 · 연도 · 「관련: 한 줄」).
 * ⚠️ 인용 검사기는 「저자 (연도)」 뒤 300자 안의 URL 을 짝짓는다. <Src> 안에서 저자·연도 → 학술지 → 링크 순서로 적고,
 *    긴 설명(<Found>)은 링크 **뒤에** 둔다.
 */
export function Sources({ note, children }: { note?: string; children: React.ReactNode }) {
  return (
    <section id="refs" aria-label="근거와 출처" className="mt-14 scroll-mt-20 border-t border-gray-200 pt-6">
      <h2 className="text-xl font-bold text-gray-900">근거와 출처</h2>
      {note && <p className="mt-1 break-keep text-xs text-gray-500">{note}</p>}
      <ol className="mt-4 space-y-4 break-keep text-sm leading-[1.7] text-gray-700">{children}</ol>
    </section>
  );
}

export function Src({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li id={`ref-${n}`} className="flex scroll-mt-24 gap-2">
      <span className="shrink-0 tabular-nums text-gray-400">[{n}]</span>
      <div className="min-w-0">{children}</div>
    </li>
  );
}

/** 출처 항목 안 「확인한 것」 — 예전 「근거 보기」에 있던 숫자·대상·설계 */
export function Found({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-gray-600"><span className="text-gray-400">확인한 것 · </span>{children}</p>;
}
