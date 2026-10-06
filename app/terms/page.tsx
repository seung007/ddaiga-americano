
export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12 text-gray-800">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">이용약관 및 면책 고지</h1>
      <p className="text-sm text-gray-400 mb-10">최종 업데이트: 2026년 10월</p>

      <section className="mb-10">
        <h2 className="text-base font-semibold text-gray-900 mb-3">1. 서비스 목적</h2>
        <p className="text-sm leading-relaxed text-gray-700">
          뛰다가아메리카노(이하 "본 서비스")는 러닝화 선택에 도움을 드리기 위한 <strong>정보 제공 목적</strong>의
          웹사이트입니다. 본 서비스의 추천 결과는 일부 연구 자료를 참고하되 상당 부분은 이 사이트가 정한
          기준으로 점수를 매기는 알고리즘이 생성하며(아래 3항), 어떠한 경우에도 <strong>의료적 조언, 전문 처방, 또는 개인 진단을 대체하지 않습니다.</strong>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-base font-semibold text-gray-900 mb-3">2. 면책 조항</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-4">
          <p className="text-sm font-semibold text-amber-800 mb-1">중요 고지</p>
          <p className="text-sm leading-relaxed text-amber-700">
            본 서비스에서 제공하는 신발 추천, 체형 분석, 발 타입 안내, 부상 예방 콘텐츠 등의 모든 정보는
            <strong> 참고용 정보 제공</strong>이며, 의료적 진단·처방이나 전문 피팅을 대체하지 않습니다.
            개인의 신체 조건, 기저 질환, 부상 이력, 달리기 자세 등 다양한 개인차에 의해 결과가 달라질 수 있으니,
            최종 선택과 판단은 이용자 본인의 몫입니다.
          </p>
        </div>
        <ul className="text-sm leading-relaxed text-gray-700 space-y-2 list-disc list-inside">
          <li>본 서비스는 정보 제공자로서, 제공된 정보를 참고해 내린 신발 선택·운동 등 이용자의 실제 행위와 그 결과에 대해서는 책임지지 않습니다.</li>
          <li>기저 질환(당뇨, 관절질환, 족부 질환 등)이 있거나 통증이 있는 경우, 신발 선택 전 전문 의료인과 상담하시길 권장합니다.</li>
          <li>본 서비스의 정보는 정기적으로 업데이트되나, 신발 스펙·가격·판매 여부는 변경될 수 있습니다.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-base font-semibold text-gray-900 mb-3">3. 추천 알고리즘 근거</h2>
        <p className="text-sm leading-relaxed text-gray-700 mb-3">
          {/* 2026-10-06: 「다음 학술 논문을 참고하여 설계」 → 논문마다 알고리즘에서 맡는 역할이 달라 나눠 적었다.
              Malisoux 2020 을 「쿠셔닝 경도와 체중」 근거로 걸어 두고 반대 방향으로 쓰고 있었다(recommend.ts v4). */}
          추천 알고리즘의 항목은 근거가 있는 것과 이 사이트가 정한 기준으로 나뉩니다.
          결과 화면의 각 이유 옆에도 어느 쪽인지 적습니다. 추천 결과를 절대적 기준으로 삼지 마세요.
        </p>
        <p className="text-sm font-medium text-gray-700 mb-1">점수에 쓰는 연구</p>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside mb-3">
          <li>Malisoux et al. (2016) Br J Sports Med — 모션컨트롤화 RCT. 회내 발에서 부상 위험이 낮았음 → 평발 선택 시 안정화 가점(약한 근거)</li>
          <li>Willems et al. (2021) J Orthop Sports Phys Ther — 같은 계열 RCT의 2차 분석</li>
          <li>Wunderlich &amp; Cavanagh (2001) Med Sci Sports Exerc — 여성 발은 남성 발의 축소판이 아님 → 여성 전용 라스트 가점</li>
        </ul>
        <p className="text-sm font-medium text-gray-700 mb-1">점수에 쓰지 않는 이유가 된 연구</p>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside mb-3">
          <li>Malisoux et al. (2020) Am J Sports Med — 848명 RCT. 딱딱한 신발은 체중과 무관하게 위험했고, 무거운 러너에서 쿠션의 추가 이득은 확인되지 않음 → 체중은 순위에 쓰지 않음</li>
          <li>Richards et al. (2009) Br J Sports Med — 발 타입별 처방을 지지하는 연구를 찾지 못한 고찰(2009년 기준)</li>
        </ul>
        <p className="text-sm font-medium text-gray-700 mb-1">사이트 기준(근거 논문 없음)</p>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>키별 드롭 범위, 부상 이력별 드롭·쿠션 가점, 초심자 카본화 감점, 발볼·발등 핏 가점</li>
          <li>고르는 규칙: 점수 → 같으면 정가 낮은 순, 상위 3개는 브랜드가 겹치지 않게, 평발이면 안정화 최대 2개 + 중립 1개</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-base font-semibold text-gray-900 mb-3">4. 추천 순서와 광고</h2>
        <p className="text-sm leading-relaxed text-gray-700">
          추천 결과는 입력된 신체 데이터와 알고리즘 점수만을 기반으로 합니다.
          <strong>어떤 브랜드도 돈을 내고 순위를 올릴 수 없습니다.</strong>
          특정 브랜드를 우대하거나 배제하지 않습니다.
        </p>
        <p className="text-sm leading-relaxed text-gray-700 mt-3">
          {/* 2026-10-06: 「어떠한 금전적 대가도 받지 않습니다」였다. 2026-09-08 부터 쿠팡 파트너스 링크를
              운영 중이라(lib/shoes/affiliate.ts) 이 조항 스스로 약속한 「도입하면 갱신」을 지키지 않고 있었다. */}
          2026년 9월부터 일부 신발의 쿠팡 링크를 <strong>쿠팡 파트너스 제휴 링크</strong>로 운영합니다.
          이 링크를 통해 구매가 이뤄지면 일정액의 수수료를 받을 수 있으며, 해당 페이지 상단에 그 사실을 고지합니다.
          브랜드·판매자로부터 받는 협찬이나 광고비는 없습니다.
          제휴 여부는 <strong>추천 점수 계산에 들어가지 않습니다.</strong>
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
  );
}
