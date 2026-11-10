import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "러닝화 추천기 — 뛰다가 아메리카노",
  // 2026-11-10: 「발볼·발 타입·체형을 고르면」 → 체형(체중)은 순위에 쓰지 않으므로(recommend.ts v4) 실제로 순위를 바꾸는 입력만 적었다.
  description:
    "용도·발볼·발 모양·부상 이력을 고르면 러닝화 3개를 골라드립니다. 연구로 확인된 것과 사이트가 정한 기준을 나눠 보여드리고, 광고비로 순위를 바꾸지 않습니다.",
  // 2026-09-06: 저장소 전체에 canonical 이 하나도 없었다.
  // 이 페이지는 공유 URL로 `?h=&w=&g=` 파라미터 조합이 무한히 생기므로
  // canonical 이 없으면 변형들이 서로 색인 경쟁을 한다.
  alternates: { canonical: "/shoe-finder" },
};

/**
 * 크롤러가 읽을 수 있는 본문 — 2026-09-06 신설
 *
 * SEO 감사에서 나온 가장 큰 문제였다.
 *
 * `page.tsx`는 `"use client"`이고 추천 결과가 `submitted === true`일 때만 렌더된다.
 * `submitted`의 초기값은 `false`이고 이를 켜는 유일한 경로는 **사용자의 폼 제출**이다.
 * 즉 크롤러가 이 URL을 그냥 가져가면 **빈 폼 껍데기만** 보인다 —
 * 신발 이름도, 가격도, 추천 근거도 HTML에 한 글자도 없다.
 *
 * 이 사이트에서 상업 의도가 가장 높은 페이지가 구글에는
 * **"고유 텍스트가 거의 없는 폼 페이지"**로 보이고 있었다. 색인이 되더라도
 * 순위를 받을 내용이 없으니 노출 자체가 안 생긴다. 구글 유입 2.7%의 한 축이다.
 *
 * 고치는 방법은 둘이었다.
 *   ① 추천 로직 전체를 서버로 옮긴다 — 크지만 정공법
 *   ② 폼과 별개로 **서버에서 렌더되는 요약 블록**을 붙인다 — 작고 즉시 효과
 *
 * ②를 골랐다. 추천 로직은 8단계 입력에 의존해서 서버로 옮기면 UX가 바뀌는데,
 * **지금 필요한 건 UX 변경이 아니라 크롤러가 읽을 텍스트**다.
 * 여기 있는 것은 전부 실제 데이터에서 뽑은 사실이고 지어낸 문장이 없다.
 *
 * ⚠️ 이 블록은 폼 **아래**에 온다. 사람에게는 부차적이고 크롤러에게는 본문이다.
 */

/**
 * 2026-10-06: 「체형별 추천 예시(키·체중만 반영한 맛보기)」를 걷어내고 「데일리 러닝화 예시 — 정가 낮은 순」 6종으로 바꿨었다.
 *
 * 2026-11-10: 그 목록과 「전체 N종을 다룹니다…」 문단을 걷었다(운영자 요청). 「쿠셔닝 2/5 · 힐드롭 8mm」 같은 사양 줄을
 * 처음 온 사람이 읽을 수 없었고, 추천기 바로 아래에 추천이 아닌 목록이 붙어 있어 무엇이 답인지 헷갈렸다.
 * 위 2026-09-06 이유(크롤러가 읽을 본문)는 절반만 남는다 — `page.tsx` 는 "use client" 지만 첫 화면(질문·선택지)은
 * 서버에서 그려져 HTML 에 들어간다. 신발 이름은 더는 이 URL 의 HTML 에 없다. 그 손실은 감수했다.
 * 내부 링크는 한 문장만 남긴다: 러닝화 목록(/shoes)과 비교 페이지. 둘 다 다른 본문에서도 링크되어 있어
 * 고아가 되지는 않는다(2026-11-10 `check:internal` 통과 확인). 한강 코스·수명 계산기 링크는 추천기와 관계가 멀어 뺐다
 * (각각 components/guide/NextReads.tsx·app/courses/page.tsx 등에서 링크된다).
 */
export default function ShoeFinderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}

      <p className="mx-auto max-w-3xl px-6 pb-16 text-sm leading-relaxed text-gray-600">
        답하지 않고 둘러보려면{" "}
        <Link href="/shoes" className="font-medium text-emerald-700 hover:underline">러닝화 전체 목록</Link>을,
        두 켤레를 나란히 보려면{" "}
        <Link href="/compare/hoka-clifton-10-vs-brooks-ghost-17" className="font-medium text-emerald-700 hover:underline">비교 페이지</Link>를
        보세요.
      </p>
    </>
  );
}
