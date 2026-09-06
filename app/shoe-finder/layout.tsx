import type { Metadata } from "next";
import Link from "next/link";
import { SHOES } from "@/lib/shoes/data";
import { BODY_TYPE_LABEL, type BodyType } from "@/lib/shoes/types";

export const metadata: Metadata = {
  title: "러닝화 추천기 — 뛰다가 아메리카노",
  description:
    "키·체중·성별·발볼·발 타입을 선택하면 스포츠의학 논문 기반으로 내 몸에 맞는 러닝화를 추천해드립니다. 광고·협찬 없이 데이터로만.",
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

/** 체형 8분류 중 대표 4개 — 실제 사용자 분포를 모르므로 극단을 피해 중간대를 고른다 */
const SHOWCASE: BodyType[] = ["mid_light", "mid_mid", "mid_heavy", "small_mid"];

function pickFor(bt: BodyType) {
  return SHOES.filter((s) => s.primaryBodyTypes.includes(bt) && !s.successor && !s.hasCarbon)
    .sort((a, b) => a.priceKrw - b.priceKrw)
    .slice(0, 3);
}

export default function ShoeFinderLayout({ children }: { children: React.ReactNode }) {
  const rows = SHOWCASE.map((bt) => ({ bt, shoes: pickFor(bt) })).filter((r) => r.shoes.length > 0);

  return (
    <>
      {children}

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <h2 className="mb-2 text-xl font-bold text-gray-900">체형별 추천 예시</h2>
        <p className="mb-6 text-sm leading-relaxed text-gray-600">
          위에서 8단계를 입력하면 <strong className="text-gray-900">발볼·발 타입·부상 이력·예산까지</strong>{" "}
          반영해 정확히 골라 드립니다. 아래는 <strong className="text-gray-900">키·체중만</strong> 반영한
          맛보기예요 — 실제 추천과 다를 수 있습니다.
        </p>

        <div className="space-y-6">
          {rows.map(({ bt, shoes }) => (
            <div key={bt} className="rounded-2xl border border-gray-200 p-5">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">{BODY_TYPE_LABEL[bt]}</h3>
              <ul className="space-y-2.5">
                {shoes.map((s) => (
                  <li key={s.id} className="text-sm leading-relaxed text-gray-700">
                    <strong className="text-gray-900">
                      {s.brand} {s.model}
                    </strong>{" "}
                    <span className="text-gray-500">
                      · 쿠셔닝 {s.cushioning}/5 · {s.weightGramsM9}g · 힐드롭 {s.heelDropMm}mm ·{" "}
                      {s.priceKrw.toLocaleString()}원
                    </span>
                    <br />
                    <span className="text-gray-600">{s.blurb}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm leading-relaxed text-gray-600">
          전체 {SHOES.length}종을 다룹니다. 두 켤레를 직접 견주고 싶다면{" "}
          <Link href="/compare/hoka-clifton-10-vs-brooks-ghost-17" className="font-medium text-emerald-700 hover:underline">
            비교 페이지
          </Link>
          , 어디서 뛸지 정하려면{" "}
          <Link href="/courses" className="font-medium text-emerald-700 hover:underline">
            한강 코스
          </Link>
          , 신발을 언제 바꿀지는{" "}
          <Link href="/tools/shoe-life" className="font-medium text-emerald-700 hover:underline">
            수명 계산기
          </Link>
          를 보세요.
        </p>
      </section>
    </>
  );
}
