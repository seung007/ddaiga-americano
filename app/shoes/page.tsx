import type { Metadata } from "next";
import Link from "next/link";
import ShoesBrowser from "@/components/ShoesBrowser";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import AffiliateNotice from "@/components/AffiliateNotice";
import { SHOES } from "@/lib/shoes/data";

/**
 * 러닝화 목록 (2026-09-16)
 *
 * 러닝라이프(`runninglife.co.kr/shoes`) 구조를 따라간다. 2026-09-16 에 Cowork 가
 * "개수로는 못 이기니 맞춤으로 싸운다"고 했다가 hyun 님 지적으로 뒤집었다 —
 * 목록에서 개수는 "여기 오면 있다"는 신뢰이고, 맞춤은 개수가 많을수록 더 강해진다.
 * 1단계는 **있는 52켤레로 구조**, 2단계가 공식 스펙 확인으로 개수 확대다.
 */

export const metadata: Metadata = {
  title: `러닝화 ${SHOES.length}종 한눈에 — 발볼·쿠션·용도로 고르기 | 뛰다가 아메리카노`,
  description:
    "브랜드·용도·쿠셔닝·발볼·가격으로 러닝화를 거르고, 키·체중·발 모양을 넣으면 내 몸에 맞는 순서로 줄 세워 봅니다. 스펙 확인 날짜를 같이 적습니다.",
  alternates: { canonical: "/shoes" },
};

export default function ShoesPage() {
  return (
    <>
      <BreadcrumbJsonLd trail={[["러닝화", "/shoes"]]} />
      <AffiliateNotice />
      <main className="mx-auto max-w-3xl px-6 py-12 text-gray-800">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">러닝화</h1>
        <p className="mt-3 leading-relaxed text-gray-600">
          <strong>{SHOES.length}켤레</strong>의 스펙을 확인한 날짜와 함께 싣습니다(브랜드 공식 자료·RunRepeat 참고). 순서는 광고비로 바뀌지 않습니다.
        </p>

        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href="/tier-list" className="text-emerald-600 hover:underline">
            내 수준에 맞는 칸 — 러닝화 계급도 →
          </Link>
          <Link href="/compare/hoka-vs-brooks" className="text-emerald-600 hover:underline">
            호카 vs 브룩스 →
          </Link>
          <Link href="/injury/wide-foot" className="text-emerald-600 hover:underline">
            발볼 넓은 사람 →
          </Link>
        </div>

        <ShoesBrowser />
      </main>
    </>
  );
}
