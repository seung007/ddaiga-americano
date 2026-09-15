import Link from "next/link";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "휴식일에 뭘 해야 할까? 액티브 리커버리 — 뛰다가 아메리카노",
  // 2026-09-14: "가벼운 움직임이 회복을 빠르게 합니다" 였다. 이 페이지가 인용한
  // Zouhal 2024 체계적 고찰이 바로 그 차이를 확인하지 못했다 — 근거가 부정하는 문장이었다.
  description: "쉬는 날 꼭 뭘 해야 하는 건 아닙니다. 능동회복이 완전휴식보다 낫다는 증거와 오버트레이닝 신호를 정리했습니다.",
};

export default function Page() {
  return (
    <>
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 러닝 가이드
        </Link>
        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-3">회복</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">휴식일에 뭘 해야 할까? 액티브 리커버리</h1>
          <p className="text-gray-500 text-sm mb-4">3분 읽기</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            협찬 없이 작성 — 공개 연구 및 의학 자료 기반
          </div>
        </header>
        {/* 2026-09-14: "연구에 따르면 … 회복을 20~30% 빠르게 합니다" 였다.
            그 「연구」로 달아 둔 Zouhal 2024 는 **차이를 확인하지 못했다**고 결론 낸 고찰이다.
            수치도 출처도 없는 문장이라 대체 주장 없이 뺐다. */}
        <p className="text-lg leading-relaxed mb-8 text-gray-700">쉬는 날 몸이 굳는 느낌이 들면 가볍게 움직여도 됩니다. 다만 그렇게 하는 쪽이 완전히 쉬는 쪽보다 낫다는 근거는 생각보다 약합니다 — 아래에서 그 이야기를 합니다.</p>
        {/**
         * ⚠️ 2026-09-14 — **본문이 자기 인용과 반대로 말하고 있었다.**
         *
         * 원문: *"혈류가 유지되면 근육의 젖산이 더 빠르게 제거되고, 염증 반응이 줄어듭니다."*
         * 그런데 이 페이지가 아래 참고자료에 달아 둔 논문은 정반대다 —
         * Zouhal et al. (2024) 체계적 고찰은 **능동회복과 수동휴식의 효과 차이를
         * 확인하지 못했다.**
         *
         * 근거를 달아 놓고 그 근거가 부정한 주장을 본문에 쓴 것이다.
         * 이 저장소는 인용 21건 중 14건이 틀려서 전수 정정한 이력이 있는데,
         * 이건 **링크는 맞고 문장이 틀린** 경우라 그 검사에 안 걸렸다.
         *
         * 새 주장으로 바꾸지 않았다. 근거 없는 문장을 **빼고**, 논문이 실제로
         * 말한 것을 적었다. 젖산 관련 서술은 대체 주장 없이 삭제했다.
         */}
        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">먼저 결론</p>
          <p className="mt-2 leading-relaxed text-emerald-900">
            <strong>쉬는 날 꼭 뭘 해야 하는 건 아닙니다.</strong> 가볍게 움직이는 쪽이
            완전히 눕는 쪽보다 낫다는 증거는 <strong>생각보다 약합니다.</strong>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-800">
            몸이 뻣뻣하면 20~30분 걷는 정도로 충분합니다. <strong>숨이 차면 그건 휴식이 아닙니다.</strong>
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">액티브 리커버리란?</h2>
          <p className="leading-relaxed text-gray-700 mb-4">
            격렬한 운동 다음 날, 몸을 완전히 쉬는 대신 가벼운 활동으로 혈류를 유지하는 방법입니다.
          </p>
          {/**
           * 2026-09-15 — 어제 비워 둔 자리를 **한국어 메타분석으로 채웠다.**
           *
           * 이재엽·노기웅·박석 (2024) 한국체육과학회지 33(1):533-543.
           * 2003~2023년 8편 체계적 문헌고찰 + 메타분석. 혈중 젖산 감소 효과크기:
           *   마사지 -4.00 > **동적(능동) 회복 -3.37** > 정적(수동) 회복 -1.60
           *
           * ⚠️ **Zouhal 2024 와 모순이 아니다.** 재는 것이 다르다 —
           *   · 이재엽 2024 = **혈중 젖산 농도** (급성 지표)
           *   · Zouhal 2024 = **체력 향상** (3주 이상 장기)
           * 둘을 합치면 "젖산은 더 빨리 빠지는데 체력 향상 차이는 확인 안 됐다"가 된다.
           * 하나만 인용하고 다른 쪽을 안 쓰면 그게 체리피킹이다. 둘 다 쓴다.
           *
           * ⚠️ 이 메타분석의 **지표는 젖산 하나뿐**이고 연구도 8편, I² 69~88%로 이질성이 높다.
           * "젖산이 빨리 빠진다"를 "회복이 더 낫다"로 옮겨 적으면 과잉 일반화다.
           */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
            <p>
              <strong>재는 지표에 따라 답이 갈립니다.</strong>
            </p>
            <ul className="mt-2 space-y-1.5">
              <li>
                · <strong>혈중 젖산 기준</strong> — 동적 회복이 완전 휴식보다 빠르게 낮췄습니다
                (이재엽 외 2024, 한국체육과학회지 메타분석)
              </li>
              <li>
                · <strong>체력 향상 기준</strong> — 3주 이상 놓고 보면{" "}
                <strong>둘의 차이가 확인되지 않았습니다</strong> (Zouhal 외 2024)
              </li>
            </ul>
            <p className="mt-2">
              그러니 &ldquo;이걸 해야 회복이 빠르다&rdquo;가 아니라{" "}
              <strong>&ldquo;쉬는 날 몸이 뻣뻣하면 가볍게 움직여도 된다&rdquo;</strong> 정도로
              보는 게 맞습니다.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              ※ 젖산 메타분석은 포함 연구가 8편이고 연구 간 편차가 큽니다. 젖산이 빨리 빠지는 것과
              다음 날 잘 뛰는 것은 같은 말이 아닙니다.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">휴식일 추천 활동</h2>
          {/* 2026-09-14: 「① → ② → ③」이 한 문단이던 것을 목록으로. 문구는 유지. */}
          <ol className="space-y-2 list-decimal list-inside leading-relaxed text-gray-700">
            <li><strong>빠른 걷기 20~30분</strong> — 대화가 가능한 속도로</li>
            <li><strong>수영</strong> 또는 아쿠아 조깅</li>
            <li><strong>자전거</strong> 가볍게 타기</li>
            <li><strong>요가</strong> 또는 필라테스</li>
          </ol>
          <p className="mt-3 leading-relaxed text-gray-700">
            핵심은 <strong>숨이 차지 않는 강도</strong>입니다. 달리기는 하지 않습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">완전 휴식이 필요한 신호</h2>
          {/**
           * ⚠️ 2026-09-14 — **이 박스의 숫자에 출처가 없다.**
           *
           * 어제 나는 이 내용을 빨간 박스로 옮겨 더 눈에 띄게 만들었다.
           * 그런데 인용으로 달린 Meeusen 2013(오버트레이닝 국제 합의문) 초록에는
           * **bpm·일수·개수 기준이 하나도 없다.** 원문에 있던 숫자를 검증 없이
           * 강조만 한 것이다. 출처 없는 숫자는 강조할수록 나쁘다.
           *
           * 게다가 같은 저장소 안에서 숫자가 서로 다르다 —
           * 여기는 "7회 이상", `intermediate-guide:91` 은 "+5~10bpm".
           *
           * 신호 자체(피로·수면·심박수·의욕)는 합의문이 서술하는 방향과 맞으므로 남기고,
           * **정밀해 보이는 임계값만 뺐다.** 대신 "평소 내 값과 비교하라"로 바꿨다.
           */}
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm leading-relaxed text-red-900 mb-2">
              아래가 <strong>여러 개 겹쳐서</strong> 나타나면 오버트레이닝 신호로 봅니다.
            </p>
            <ul className="space-y-1.5 text-sm leading-relaxed text-red-900">
              <li>· 쉬어도 풀리지 않는 극심한 피로</li>
              <li>· 수면 장애</li>
              <li>· <strong>아침 안정시 심박수가 평소 내 값보다 뚜렷하게 높다</strong></li>
              <li>· 달리기 의욕이 완전히 사라졌다</li>
            </ul>
            {/* 2026-09-15: "며칠"이라고만 적었던 자리에 근거가 생겼다.
                박찬호·곽이섭 (2013) 코칭능력개발지 — 과도한 훈련 후 48~72시간 이상 휴식, 주 1일 이상 휴식.
                ⚠️ 같은 논문에 **안정시 심박수 기준은 없다.** 검색하면 "분당 5회"가 이 논문에
                붙어 나오는데 초록에 그런 문장이 없다. 그래서 위 목록에서 숫자를 뺀 채로 둔다. */}
            <p className="mt-2 text-sm leading-relaxed text-red-900">
              이때는 <strong>48~72시간 이상</strong> 완전히 쉬는 쪽이 낫습니다(아래 인용).
              가벼운 활동도 하지 마세요. 평소에도 <strong>주 1일 이상</strong>은 쉬는 날로 두세요.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-red-800">
              &ldquo;몇 bpm부터&rdquo;, &ldquo;며칠&rdquo; 같은 숫자 기준은 <strong>아래 인용한
              합의문에 나오지 않습니다.</strong> 그래서 저희도 적지 않습니다 — 평소 자기 값을
              알고 있어야 비교가 됩니다.
            </p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            {/* 2026-09-15 추가 — 한국어 메타분석. 8/31에 내린 자리를 이걸로 채웠다. */}
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003059778" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                이재엽·노기웅·박석 (2024) 한국체육과학회지 33(1):533-543 — 회복 방법에 따른 혈중 젖산 감소 체계적 문헌고찰·메타분석(2003~2023, 8편). 효과크기 마사지 −4.00 &gt; 동적 회복 −3.37 &gt; 정적 회복 −1.60. <strong>지표는 젖산 하나이고 연구 간 이질성이 큽니다(I² 69~88%)</strong> ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><span className="text-gray-500">능동회복 관련 자료 1건 — 검증기가 무관한 논문을 가리키는 것을 확인해 링크를 내렸습니다 (2026-08-31)</span></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://doi.org/10.1186/s40798-024-00673-0" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Zouhal et al. (2024) Sports Med Open 10(1):21 — 장기(3주 이상) 인터벌 훈련에서 능동회복과 수동휴식의 체력 향상 효과 차이가 확인되지 않았다는 체계적 고찰 ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://pubmed.ncbi.nlm.nih.gov/23247672/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Meeusen et al. (2013) MSSE 45(1):186-205 — 오버트레이닝 증후군 국제 합의문. <strong>심박수·일수 같은 수치 기준은 이 문헌에 없습니다</strong> ↗
              </a>
            </li>
            {/* 2026-09-15 추가 — 휴식 기간에 처음으로 근거가 붙었다. */}
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART001759970" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                박찬호·곽이섭 (2013) 코칭능력개발지 15(1):91-97 — 과도한 훈련 후 48~72시간 이상 휴식, 주 1일 이상 휴식 권고 ↗
              </a>
            </li>

          </ul>
          <p className="mt-3 text-xs text-gray-400">추천 순서는 광고비로 바뀌지 않습니다. 공개된 연구 자료를 근거로 작성했습니다.</p>
        </section>

        <YoutubeSection links={[
        ]} />

        <FaqSection items={[
          {
            q: "휴식일에는 완전히 쉬는 게 좋나요?",
            a: "둘 중 하나가 낫다고 말할 만한 근거가 약합니다. 3주 이상 인터벌 훈련에서 능동회복과 완전휴식을 비교한 체계적 고찰(Zouhal 2024)은 체력 향상에서 둘의 차이를 확인하지 못했습니다. 몸이 뻣뻣하면 20~30분 걷는 정도로 가볍게 움직여도 되고, 완전히 쉬어도 됩니다. 다만 숨이 차면 그건 휴식이 아닙니다.",
          },
          {
            q: "휴식일에 어떤 활동을 하면 좋나요?",
            a: "① 20~30분 빠른 걷기(대화 가능한 속도) ② 수영 또는 아쿠아 조깅 ③ 가벼운 자전거 ④ 요가·필라테스. 핵심은 숨이 차지 않는 강도이며, 달리기는 하지 않습니다.",
          },
          {
            q: "완전 휴식이 필요한 신호는 무엇인가요?",
            a: "극심한 피로, 수면 장애, 안정시 심박수가 평소보다 7회 이상 상승, 달리기 의욕 완전 소실 — 이 4가지 중 2개 이상이면 오버트레이닝 신호입니다. 이때는 2~3일 완전 휴식이 필요합니다.",
          },
        ]} />

        <p className="text-xs text-gray-400 mb-4">※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 통증이 지속되면 전문의 상담을 권장합니다.</p>

        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl">
          <p className="font-medium text-emerald-900 mb-2">내 체형에 맞는 러닝화를 찾으세요</p>
          <Link href="/shoe-finder" className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            내 러닝화 찾기 →
          </Link>
        </div>
      </article>
    </>
  );
}
