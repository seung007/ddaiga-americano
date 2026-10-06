/**
 * 본문 안 짧은 출처의 ↗ 링크 (가이드 글 공용, 2026-10-06).
 *
 * 쓰는 법: `(Fokkema et al. (2019) <Up h="https://pubmed.ncbi.nlm.nih.gov/29934211/" />)`
 *
 * ⚠️ 두 가지를 지킨다 — 인용 검사기(scripts/verify-citations.mjs)가 소스를 문자열로 훑기 때문이다.
 *   · 「저자 (연도)」는 이 컴포넌트 **앞에 평문으로** 적는다. 주장을 prop 으로 넘기면
 *     컴포넌트 이름(대문자)이 성으로 잡힌다(첫 시도에서 「Src 2019」로 잡혔다).
 *   · URL 은 **문자열 그대로** 적는다. 함수로 조립하면 정규식에 안 걸려 검사망 밖으로 빠진다.
 */
export function Up({ h }: { h: string }) {
  return (
    <a href={h} target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
      ↗
    </a>
  );
}

/** 출처 묶음 — `<S>(Fokkema et al. (2019) <Up h="…" />)</S>` 처럼 감싼다. 줄바꿈 없이 회색 작은 글씨. */
export function S({ children }: { children: React.ReactNode }) {
  return <span className="whitespace-nowrap text-xs text-gray-400">{children}</span>;
}
