import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "개인정보 처리방침 — 뛰다가 아메리카노",
  description:
    "뛰다가 아메리카노가 수집·처리하는 정보와 그 목적, 보관 방식, 이용자 권리를 안내합니다. 키·체중 등 신체 정보는 서버에 저장하지 않습니다.",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-6 py-12 text-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">개인정보 처리방침</h1>
        <p className="text-sm text-gray-400 mb-10">최종 업데이트: 2026년 6월</p>

        <section className="mb-10">
          <p className="text-sm leading-relaxed text-gray-700">
            뛰다가아메리카노(이하 &quot;본 서비스&quot;)는 이용자의 개인정보를 중요하게 생각하며,
            「개인정보 보호법」을 준수합니다. 본 방침은 본 서비스가 어떤 정보를 어떤 목적으로
            다루는지, 그리고 이용자가 가진 권리를 안내합니다.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-semibold text-gray-900 mb-3">1. 수집하는 정보</h2>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 mb-4">
            <p className="text-sm font-semibold text-emerald-800 mb-1">신체 입력값은 서버에 저장되지 않습니다</p>
            <p className="text-sm leading-relaxed text-emerald-700">
              추천기에 입력하는 <strong>키·체중·발볼·발 타입·예산</strong> 등의 정보는
              이용자의 <strong>브라우저 안에서만</strong> 추천 계산에 사용되며, 본 서비스 서버나
              외부로 전송·저장되지 않습니다. 페이지를 닫으면 입력값은 사라집니다.
            </p>
          </div>
          <ul className="text-sm leading-relaxed text-gray-700 space-y-2 list-disc list-inside">
            <li><strong>추천기 입력값</strong>(키·체중·발볼·발 타입·용도·예산·성별): 브라우저 내 일시 처리, 미저장</li>
            <li><strong>이용 통계</strong>(방문 페이지, 체류 시간, 기기·브라우저 종류, 대략적 지역, 유입 경로): 아래 3항의 분석 도구를 통해 자동 수집</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-semibold text-gray-900 mb-3">2. 이용 목적</h2>
          <ul className="text-sm leading-relaxed text-gray-700 space-y-2 list-disc list-inside">
            <li>신체 데이터 기반 맞춤 러닝화 추천 결과 생성</li>
            <li>서비스 개선을 위한 방문·이용 패턴 분석(어떤 콘텐츠가 도움이 되는지 파악)</li>
          </ul>
          <p className="text-sm leading-relaxed text-gray-700 mt-3">
            본 서비스는 입력값을 마케팅·광고 타겟팅에 사용하지 않으며, 추천 결과는 오직
            신체 데이터 점수만으로 산출됩니다(광고비 기준 정렬 없음).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-semibold text-gray-900 mb-3">3. 분석 도구 (쿠키 등)</h2>
          <p className="text-sm leading-relaxed text-gray-700 mb-3">
            본 서비스는 방문 통계 파악을 위해 다음 도구를 사용합니다. 이들 도구는 쿠키 또는
            유사 기술로 익명에 가까운 이용 데이터를 수집하며, <strong>키·체중 등 신체 입력값과는 연결되지 않습니다.</strong>
          </p>
          <ul className="text-sm leading-relaxed text-gray-700 space-y-2 list-disc list-inside">
            <li><strong>Google Analytics 4</strong> — 방문·페이지뷰·이벤트 측정. Google의 개인정보처리방침에 따라 처리됩니다.</li>
            <li><strong>Vercel Analytics</strong> — 페이지뷰·성능 측정. 쿠키 없이 익명 집계 방식으로 수집됩니다.</li>
          </ul>
          <p className="text-sm leading-relaxed text-gray-700 mt-3">
            이용자는 브라우저 설정에서 쿠키를 거부하거나, 광고 차단·추적 방지 확장 프로그램으로
            분석 도구 수집을 차단할 수 있습니다. 차단해도 추천 기능은 정상 작동합니다.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-semibold text-gray-900 mb-3">4. 보관 및 제3자 제공</h2>
          <ul className="text-sm leading-relaxed text-gray-700 space-y-2 list-disc list-inside">
            <li>신체 입력값은 저장하지 않으므로 보관 기간이 없습니다.</li>
            <li>이용 통계는 분석 도구 제공사(Google·Vercel)의 정책에 따라 보관됩니다.</li>
            <li>본 서비스는 이용자 정보를 제3자에게 판매·대여하지 않습니다.</li>
            <li>법령에 따른 요청이 있는 경우를 제외하고 외부에 제공하지 않습니다.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-semibold text-gray-900 mb-3">5. 외부 링크</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            추천 결과의 구매 링크(공식몰·네이버 쇼핑 등)와 유튜브 리뷰 링크는 외부 사이트로
            연결됩니다. 외부 사이트의 개인정보 처리는 해당 사이트의 방침을 따르며, 본 서비스는
            이에 대해 책임지지 않습니다.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-semibold text-gray-900 mb-3">6. 이용자의 권리</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            본 서비스는 식별 가능한 개인정보를 저장하지 않으므로 별도의 열람·정정·삭제 절차가
            필요하지 않습니다. 분석 데이터 수집을 원치 않으면 위 3항의 방법으로 차단할 수 있습니다.
            14세 미만 아동의 개인정보는 수집하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">7. 방침 변경 및 문의</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            본 방침은 서비스 운영 상황에 따라 변경될 수 있으며, 변경 시 본 페이지 상단의 업데이트
            일자로 효력이 발생합니다. 개인정보 관련 문의는 운영팀으로 연락해 주세요.
          </p>
        </section>

        <div className="mt-12 pt-6 border-t border-gray-100 text-xs text-gray-400">
          <p>본 사이트는 의료기기나 의료서비스가 아닌 정보 제공 서비스입니다.</p>
          <p className="mt-1">
            관련 문서:{" "}
            <a href="/terms" className="underline hover:text-gray-600">이용약관 및 면책 고지</a>
          </p>
          <p className="mt-1">문의: 뛰다가아메리카노 운영팀</p>
        </div>
      </main>
    </>
  );
}
