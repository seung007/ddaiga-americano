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
  return <p className="mt-4 break-keep text-[17px] leading-[1.75] text-gray-700">{children}</p>;
}

/** 본문 단락 — 16px·줄간격 1.8·어절 단위 줄바꿈 */
export function P({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`mt-4 break-keep text-base leading-[1.8] text-gray-800 ${className}`}>{children}</p>;
}

/** 섹션 제목 — id 는 목차 검사(check:toc)가 문자열로 찾으므로 각 페이지에서 h2 를 직접 쓴다. 이건 스타일만 */
export const H2 = "mt-14 scroll-mt-20 break-keep text-[22px] font-bold leading-snug text-gray-900";
export const H3 = "mt-8 break-keep text-lg font-bold text-gray-900";

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
          <li key={i} className="flex gap-2.5 break-keep text-[15px] leading-[1.7] text-gray-800">
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
    <details className="group/ev mt-3 rounded-xl bg-gray-50 open:pb-1">
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
      <details className="group/refs">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
          {/* summary 안 h2 — 제목 목록(스크린리더·목차)에서 「참고 문헌」이 빠지지 않게 (council Dev 지적) */}
          <h2 className="text-lg font-bold text-gray-900">
            {title}
            {n ? <span className="ml-1.5 text-sm font-normal text-gray-400">{n}개</span> : null}
          </h2>
          <span className="shrink-0 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 group-open/refs:hidden">펼치기</span>
          <span className="hidden shrink-0 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 group-open/refs:inline">접기</span>
        </summary>
        {note && <p className="mt-2 text-xs text-gray-400">{note}</p>}
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
    <span className="ml-1.5 inline-block whitespace-nowrap rounded bg-emerald-50 px-1.5 py-0.5 align-middle text-[11px] font-medium text-emerald-700">
      연구 근거
    </span>
  ) : (
    <span className="ml-1.5 inline-block whitespace-nowrap rounded bg-gray-100 px-1.5 py-0.5 align-middle text-[11px] text-gray-500">
      저희 제안
    </span>
  );
}

/** 주의 박스 — 멈출 신호·병원 신호. 접지 않는다 */
export function Warn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-red-900">
      <p className="text-sm font-bold">{title}</p>
      <div className="mt-1.5 break-keep text-[15px] leading-[1.7]">{children}</div>
    </div>
  );
}
