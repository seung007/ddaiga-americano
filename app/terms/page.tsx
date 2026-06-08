import SiteHeader from "@/components/SiteHeader";

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-6 py-12 text-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">이용약관 및 면책 고지</h1>
        <p className="text-sm text-gray-400 mb-10">최종 업데이트: 2026년 6월</p>

        <section className="mb-10">
          <h2 className="text-base font-semibold text-gray-900 mb-3">1. 서비스 목적</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            뛰다가아메리카노(이하 "본 서비스")는 러닝화 선택에 도움을 드리기 위한 <strong>정보 제공 목적</strong>의
            웹사이트입니다. 본 서비스의 추천 결과는 스포츠의학 논문 및 공개된 연구 자료를 기반으로 한
            알고리즘이 생성하며, 어떠한 경우에도 <strong>의료적 조언, 전문 처방, 또는 개인 진단을 대체하지 않습니다.</strong>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-semibold text-gray-900 mb-3">2. 면책 조항</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-4">
            <p className="text-sm font-semibold text-amber-800 mb-1">중요 고지</p>
            <p className="text-sm leading-relaxed text-amber-700">
              본 서비스에서 제공하는 신발 추천, 체형 분석, 발 타입 안내 등의 모든 정보는
              참고용으로만 활용하시기 바랍니다. 개인의 신체 조건, 기저 질환, 부상 이력,
              달리기 자세 등 다양한 개인차에 의해 결과가 달라질 수 있습니다.
            </p>
          </div>
          <ul className="text-sm leading-relaxed text-gray-700 space-y-2 list-disc list-inside">
            <li>본 서비스는 러닝 부상, 신체적 불편함, 재산상 손해에 대해 어떠한 법적 책임도 지지 않습니다.</li>
            <li>추천 신발의 착용으로 인한 부상, 통증, 불쾌감 등에 대해 본 서비스 운영자에게 손해배상을 청구할 수 없습니다.</li>
            <li>기저 질환(당뇨, 관절질환, 족부 질환 등)이 있는 경우 반드시 전문 의료인과 상담 후 신발을 선택하세요.</li>
            <li>본 서비스의 정보는 정기적으로 업데이트되나, 신발 스펙·가격·판매 여부는 변경될 수 있습니다.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-semibold text-gray-900 mb-3">3. 추천 알고리즘 근거</h2>
          <p className="text-sm leading-relaxed text-gray-700 mb-3">
            본 서비스의 추천 알고리즘은 다음 학술 논문을 참고하여 설계되었습니다.
            단, 논문의 연구 조건과 개인의 실제 상황은 다를 수 있으므로 추천 결과를 절대적 기준으로 삼지 마세요.
          </p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Malisoux et al. (2013) — 쿠셔닝과 체중의 상관관계, Scand J Med Sci Sports</li>
            <li>Heiderscheit et al. (2011) — 키·보폭·드롭의 관계, Med Sci Sports Exerc</li>
            <li>Richards et al. (2009) — 발 타입과 안정화 신발, Br J Sports Med</li>
            <li>van Gent et al. (2007) — 체중과 러닝 부상률, Br J Sports Med</li>
            <li>Ferber et al. (2003) — 성별에 따른 러닝 생체역학 차이</li>
            <li>Taunton et al. (2003) — 여성 러닝 부상 패턴 분석</li>
            <li>Sinclair et al. (2014) — 신장과 관절 하중, J Hum Kinet</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-semibold text-gray-900 mb-3">4. 광고 및 협찬 없음</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            본 서비스는 어떠한 신발 브랜드, 판매자, 광고주로부터 금전적 대가를 받지 않습니다.
            추천 결과는 오직 입력된 신체 데이터와 알고리즘 점수만을 기반으로 하며,
            특정 브랜드를 우대하거나 배제하지 않습니다.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-semibold text-gray-900 mb-3">5. 구매 책임</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            본 서비스에서 제공하는 구매 링크는 사용자 편의를 위한 것이며, 실제 구매는 해당 쇼핑몰의
            약관을 따릅니다. 구매·배송·환불 등 거래 관련 문제는 해당 판매자에게 직접 문의하세요.
            본 서비스는 외부 쇼핑몰과의 거래에 관여하지 않습니다.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-semibold text-gray-900 mb-3">6. 개인정보</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            본 서비스는 키, 체중, 발볼, 발 타입 등의 입력값을 서버에 저장하지 않습니다.
            모든 계산은 사용자의 브라우저에서만 처리되며, 입력 데이터는 외부로 전송되지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">7. 약관 변경</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            본 약관은 서비스 운영 상황에 따라 사전 고지 없이 변경될 수 있습니다.
            변경된 약관은 페이지 상단의 업데이트 일자를 기준으로 효력이 발생합니다.
            본 서비스를 계속 이용하면 변경된 약관에 동의한 것으로 간주합니다.
          </p>
        </section>

        <div className="mt-12 pt-6 border-t border-gray-100 text-xs text-gray-400">
          <p>본 사이트는 의료기기나 의료서비스가 아닌 정보 제공 서비스입니다.</p>
          <p className="mt-1">문의: 뛰다가아메리카노 운영팀</p>
        </div>
      </main>
    </>
  );
}
