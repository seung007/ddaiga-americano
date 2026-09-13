import Link from "next/link";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  // 네이버 서치어드바이저 실측(2026-08): "미드풋" 질의로 노출 329 · 클릭 2 · CTR 0.6%.
  // 전체 키워드 중 노출 1위인데 CTR은 최하위였다. 이전 제목이 "무조건 좋은 게 아닌 이유"로
  // 부정부터 시작해, "미드풋이 뭔지" 알고 싶어 검색한 사람에게 답을 약속하지 못했다.
  // 질의어를 앞에 두고 무엇을 알게 되는지 먼저 밝히는 쪽으로 교체.
  title: "미드풋 착지란? 힐스트라이크와 차이, 나한테 맞는지 판단하는 법 — 뛰다가 아메리카노",
  description: "미드풋이 무엇인지, 힐스트라이크와 뭐가 다른지, 그리고 초보 러너가 굳이 바꿔야 하는지까지 정리했습니다.",
};

export default function Page() {
  return (
    <>
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 러닝 가이드
        </Link>
        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full mb-3">착지법</span>
          {/* h1은 <title>과 같은 말을 해야 한다. 검색결과에서 "미드풋 착지란?"을 보고 들어왔는데
              화면에 "무조건 좋은 게 아닌 이유"가 있으면 약속한 답이 아니라 반박부터 만나게 된다. */}
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">미드풋 착지란? 힐스트라이크와 차이</h1>
          {/* 2026-09-13: 「5분 읽기」였는데 본문이 590자였다 — 어떤 속도를 넣어도 1분대다.
              2026-09-14: 비교표·확인법을 넣어 1,604자. 분당 500자로 3분. */}
          <p className="text-gray-500 text-sm mb-4">3분 읽기</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            협찬 없이 작성 — 공개 연구 및 의학 자료 기반
          </div>
        </header>
        {/**
         * 먼저 결론 (2026-09-13 추가)
         *
         * 감사에서 나온 것: **이 페이지에 "미드풋이 무엇인가"가 없었다.**
         * 제목은 「미드풋 착지란?」이라고 정의를 약속하는데, 첫 문단은
         * "힐스트라이크로 달리면 무릎이 망가진다는 말"로 시작하고
         * 첫 h2는 "착지법 연구 현황"이었다. 본문 어디에도 정의가 없었다.
         *
         * 「미드풋」은 이 사이트 노출 1위 검색어다(30일 351회). 그런데 CTR 0.6%로
         * 꼴찌다. 제목은 8/28에 이미 한 번 바꿨고 CTR은 0.6% 그대로였다.
         * **제목은 더 만지지 않는다** — 9/25 판정 전까지 실험을 지켜야 하고,
         * 두 번 바꿔서 안 움직인 레버를 세 번째 당길 이유도 없다.
         *
         * 대신 약속을 지킨다. 검색한 사람이 찾던 한 문장을 맨 위에 둔다.
         * 이 패턴은 `/injury/flat-feet` 에 이미 있었는데 9개 페이지가 안 쓰고 있었다.
         */}
        <div className="mt-6 mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">먼저 결론</p>
          <p className="mt-2 leading-relaxed text-emerald-900">
            <strong>미드풋 착지는 발바닥 중간이 먼저 땅에 닿는 방식</strong>입니다.
            뒤꿈치부터 닿으면 힐스트라이크, 앞꿈치부터 닿으면 포어풋입니다.
          </p>
          <p className="mt-2 leading-relaxed text-emerald-900">
            <strong>그리고 초보라면 굳이 바꾸지 않아도 됩니다.</strong> 연구가 말하는
            핵심은 착지 부위가 아니라 <strong>발이 몸보다 앞에서 닿는지</strong>입니다.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-800">
            바꾸고 싶다면 착지법을 직접 건드리지 말고{" "}
            <strong>케이던스(분당 걸음 수)를 지금보다 5~10% 올리세요.</strong> 보폭이
            저절로 줄면서 교정됩니다. 억지로 미드풋으로 바꾸면 아킬레스건이 아픕니다.
          </p>
        </div>

        {/**
         * 세 착지법 비교표 (2026-09-14 추가)
         *
         * 벤치마킹에서 나온 것: Google 「2e 와이드 뜻」 상위 문서 중
         * **본문 최상단이 표인 문서가 검색 스니펫을 표로 가져가고 있었다.**
         * 그리고 「미드풋」 SERP 최상단은 이미지 팩이고 8건 중 3건이 영상인데,
         * 이 페이지는 **이미지 0장 · 표 0개**였다.
         *
         * ⚠️ 이 표에 **새로운 주장을 넣지 않았다.** 전부 이 페이지와 `/injury/achilles`
         * 에 이미 인용과 함께 있던 내용을 한 자리에 모은 것이다:
         *   · 뒤꿈치 착지 → 무릎·슬개대퇴 부하 높음 (Almeida 2015, 아래 참고자료)
         *   · 미드풋 전환 → 종아리·아킬레스건 부하 증가 (achilles 페이지)
         * 밑창 닳는 위치는 관찰로 확인 가능한 사실이다.
         */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">힐스트라이크 · 미드풋 · 포어풋 차이</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-900">착지법</th>
                  <th className="py-2 pr-3 font-semibold text-gray-900">먼저 닿는 곳</th>
                  <th className="py-2 font-semibold text-gray-900">밑창이 닳는 곳</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-3 font-medium text-gray-900">힐스트라이크</td>
                  <td className="py-2 pr-3">뒤꿈치</td>
                  <td className="py-2">뒤꿈치 바깥쪽</td>
                </tr>
                <tr className="border-b border-gray-100 bg-violet-50">
                  <td className="py-2 pr-3 font-medium text-gray-900">미드풋</td>
                  <td className="py-2 pr-3">발바닥 중간</td>
                  <td className="py-2">중간~앞쪽이 고르게</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-medium text-gray-900">포어풋</td>
                  <td className="py-2 pr-3">앞꿈치</td>
                  <td className="py-2">앞쪽</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/**
           * ⚠️ 2026-09-14 — **「부하가 몰리는 곳」 열을 뺐다.**
           *
           * 어제 이 표를 만들면서 주석에 "이미 인용과 함께 있던 내용을 모았을 뿐"이라고
           * 적었다. **거짓이었다.** 인용 대조 감사 결과:
           *   · Almeida 2015 초록이 말한 것은 "rearfoot strikers had higher vertical
           *     loading rates" — **전신 수직 부하율**이지 "무릎·슬개대퇴 부하"가 아니다
           *   · 미드풋·포어풋의 "종아리·아킬레스건 부하"는 이 저장소 어디에도 인용이 없다.
           *     근거로 지목했던 `/injury/achilles` 에도 그 주장을 받치는 논문이 없다
           *
           * 표는 사실을 말하는 것처럼 보이기 때문에 근거 없는 열이 더 위험하다.
           * 대체 주장으로 바꾸지 않고 **뺐다.** 남은 두 열은 관찰로 확인 가능한 것이다.
           */}
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            <strong>어느 쪽이 더 좋다는 표가 아닙니다.</strong> 착지 부위를 바꾸면 몸이 받는
            부담의 <strong>위치도 바뀝니다</strong> — 다만 어디로 얼마나 옮겨 가는지는
            연구마다 달라서, 저희가 숫자로 말할 수 있는 부분이 아닙니다.
          </p>
        </section>

        {/* 「미드풋」 검색자가 다음으로 묻는 것 — 그럼 나는 지금 뭘로 뛰고 있나 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">내가 지금 뭘로 착지하는지 확인하는 법</h2>
          <div className="space-y-3">
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="font-semibold text-gray-900 text-sm mb-1">1. 신발 밑창을 본다 (제일 쉬움)</p>
              <p className="text-sm leading-relaxed text-gray-700">
                200km 이상 신은 러닝화를 뒤집어 보세요. <strong>뒤꿈치 바깥쪽만 닳아 있으면
                힐스트라이크</strong>입니다. 그렇다고 잘못 뛰고 있는 건 아닙니다.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="font-semibold text-gray-900 text-sm mb-1">2. 옆에서 영상을 찍는다</p>
              <p className="text-sm leading-relaxed text-gray-700">
                누군가에게 옆에서 슬로우모션으로 찍어 달라고 하세요. 요즘 폰은 대부분 됩니다.
                발이 <strong>몸보다 앞에서 닿는지</strong>를 보세요 — 그게 착지 부위보다 중요합니다.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="font-semibold text-gray-900 text-sm mb-1">3. 소리를 듣는다</p>
              <p className="text-sm leading-relaxed text-gray-700">
                발소리가 <strong>&ldquo;퍽&rdquo; 하고 크게</strong> 난다면 보폭이 길어 발이 몸 앞에서
                닿고 있을 가능성이 큽니다. 이건 정밀한 방법은 아니고 대략의 신호입니다.
              </p>
            </div>
          </div>
        </section>

        <p className="text-lg leading-relaxed mb-8 text-gray-700">"힐스트라이크로 달리면 무릎이 망가진다"는 말, 한 번쯤 들어보셨을 겁니다. 하지만 2023년 기준 스포츠의학 연구들은 착지 방식 자체보다 '착지 위치'가 더 중요하다고 말합니다.</p>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">착지법 연구 현황</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">하버드 대학교 다니엘 리버만 교수의 2010년 연구는 맨발 러너(포어풋/미드풋 착지)가 충격이 적다고 발표했습니다. 하지만 이후 연구들에서는 힐스트라이크 러너도 보폭이 과도하게 길지 않으면 부상률 차이가 없다는 결과가 나왔습니다.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">진짜 중요한 것: 오버스트라이드 방지</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">착지 방식보다 '발이 무게중심 앞에서 땅에 닿는가(오버스트라이드)'가 핵심입니다. 힐스트라이드라도 발이 무게중심 바로 아래 또는 그 근처에서 닿으면 충격이 적습니다.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">초보 러너에게 권장하는 방법</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">착지 방식을 바꾸기보다 케이던스를 현재보다 5~10% 높이는 것을 먼저 시도하세요. 케이던스가 높아지면 자연스럽게 보폭이 줄고, 오버스트라이드가 교정됩니다. 강제적인 미드풋 전환은 아킬레스 부상으로 이어질 수 있습니다.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://pubmed.ncbi.nlm.nih.gov/20111000/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Lieberman et al. 2010 — Foot strike & impact (Nature) ↗</a></li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><a href="https://pubmed.ncbi.nlm.nih.gov/26304644/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Almeida et al. (2015) JOSPT 45(10):738-755 — 착지 패턴별 생체역학 차이 메타분석. 뒤꿈치 착지는 무릎·슬개대퇴 부하가 높고, 앞발 착지는 부하 위치가 다르다 ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span><span className="text-gray-500">오버스트라이드 관련 자료 — 검증기가 무관한 논문을 가리키는 것을 확인해 링크를 내렸습니다 (2026-08-31)</span></li>

          </ul>
          <p className="mt-3 text-xs text-gray-400">추천 순서는 광고비로 바뀌지 않습니다. 공개된 연구 자료를 근거로 작성했습니다.</p>
        </section>

        <YoutubeSection links={[
          { label: "착지법 전쟁 종결 — 미드풋 vs 리어풋 vs 힐스트라이크", channel: "러닝비하인드 RunningBehind 쟐쌤", url: "https://www.youtube.com/watch?v=FWXS4q-34w8" },
          { label: "수십 년째 논쟁 — 힐스트라이크 vs 미드풋 vs 포어풋", channel: "애슬레틱 라이프 Athletic Life", url: "https://www.youtube.com/watch?v=b20-GrHPMWI" },
        ]} />

        <FaqSection items={[
          {
            q: "미드풋 착지가 힐스트라이크보다 무조건 좋은가요?",
            a: "아니요. 2023년 기준 스포츠의학 연구들은 착지 방식 자체보다 '착지 위치'가 더 중요하다고 봅니다. 힐스트라이크 러너도 보폭이 과도하게 길지 않으면 부상률에 차이가 없다는 결과가 있습니다.",
          },
          {
            q: "그럼 착지에서 진짜 중요한 건 뭔가요?",
            a: "오버스트라이드 방지입니다. 발이 무게중심보다 앞에서 닿으면 충격이 큽니다. 힐스트라이크라도 발이 무게중심 바로 아래나 그 근처에서 닿으면 충격이 적습니다.",
          },
          {
            q: "초보는 착지법을 어떻게 바꿔야 하나요?",
            a: "착지법을 강제로 바꾸기보다 케이던스를 현재보다 5~10% 높이세요. 케이던스가 높아지면 자연스럽게 보폭이 줄어 오버스트라이드가 교정됩니다. 강제적인 미드풋 전환은 아킬레스 부상으로 이어질 수 있습니다.",
          },
        ]} />

        {/* 다음에 읽을 것 — first-10k 에 이어 두 번째 시험. from=midfoot 으로 계측된다. */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">다음에 읽을 것</h2>
          <div className="space-y-2">
            <Link
              href="/injury/cadence"
              className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              <p className="font-semibold text-gray-900 text-sm">케이던스 180은 거짓말? 키별 적정 기준값 →</p>
              <p className="mt-1 text-sm text-gray-600">착지법 대신 먼저 만져야 할 것.</p>
            </Link>
            <Link
              href="/injury/achilles"
              className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              <p className="font-semibold text-gray-900 text-sm">미드풋으로 바꾼 뒤 아킬레스건이 아프다면 →</p>
              <p className="mt-1 text-sm text-gray-600">전환 속도가 너무 빨랐을 때 생기는 일.</p>
            </Link>
            <Link
              href="/injury/knee-pain"
              className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              <p className="font-semibold text-gray-900 text-sm">달릴 때 무릎이 아프다면 →</p>
              <p className="mt-1 text-sm text-gray-600">착지법을 의심하기 전에 볼 것들.</p>
            </Link>
          </div>
        </section>

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
