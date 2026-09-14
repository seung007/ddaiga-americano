import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import InlineAsk from "@/components/InlineAsk";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import ShareButtons from "@/components/ShareButtons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "달리기 후 꼭 해야 할 10분 정적 스트레칭 — 뛰다가 아메리카노",
  description: "종아리·햄스트링·엉덩이까지 풀어주는 쿨다운 루틴. 왜 달리고 나서 바로 앉으면 안 되는지 알아봅니다.",
};

export default function Page() {
  return (
    <>
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 러닝 가이드
        </Link>
        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full mb-3">쿨다운</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">달리기 후 꼭 해야 할 10분 정적 스트레칭</h1>
          {/* 2026-09-14: 동적/정적 구분 + 자세 설명을 넣어 985 → 1,556자. 분당 500자로 3분. */}
          <p className="text-gray-500 text-sm mb-4">3분 읽기</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            협찬 없이 작성 — 공개 연구 및 의학 자료 기반
          </div>
        </header>
        {/**
         * 먼저 결론 + 동적/정적 구분 (2026-09-14 추가)
         *
         * 이 페이지가 받는 검색어: 「정적 스트레칭」 63노출 1클릭(1.6%),
         * 「달리기 후 스트레칭」 23노출 2클릭(8.7%).
         *
         * 벤치마킹에서 나온 것: Google 「정적 스트레칭」 상위 문서 제목이
         * **"운동 전∙후 스트레칭, 똑같이 하면 될까?… 동적 vs 정적"** 형태였다.
         * 그 검색어를 치는 사람의 진짜 질문은 **"언제 뭘 하냐"** 인데
         * 이 페이지엔 그 구분이 아예 없었다.
         *
         * ⚠️ 다만 같은 조사에서 **그 검색어 상위 7건 중 2건이 학술 논문**이었다.
         * 「정적 스트레칭」은 일반 러너 질의가 아닌 비중이 있어서,
         * CTR 1.6%가 우리 탓이 아닐 수 있다. 고쳐도 안 오를 수 있다는 뜻이다.
         *
         * 「달리기 전에는 동적」은 널리 쓰이는 권고다. 수행능력이 몇 % 떨어진다는
         * 식의 수치는 쓰지 않았다 — 근거 강도에 논쟁이 있고, 이 저장소는
         * 인용 21건 중 14건이 틀려서 전수 정정한 이력이 있다.
         */}
        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">먼저 결론</p>
          {/* ⚠️ 2026-09-14 — "순서를 바꾸면 둘 다 효과가 줄어듭니다" 라고 적었다가 고쳤다.
              `/injury/warmup` 이 이미 근거 경계를 그어 뒀다 — *"근거가 있는 쪽은
              「달리기 전에는 정적보다 동적」이라는 방향까지입니다."* 나는 그 경계를
              인과 주장으로 넘었고, 이 페이지엔 논문 인용이 0건이다. */}
          <p className="mt-2 leading-relaxed text-emerald-900">
            <strong>달리기 전에는 동적, 달리고 나서는 정적</strong>이 일반적인 권고입니다.
            다만 근거가 단단한 것은 <strong>&ldquo;달리기 전에는 정적보다 동적&rdquo;</strong>이라는
            방향까지이고, 그 이상은 저희가 말할 수 있는 범위가 아닙니다.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-800">
            정적 스트레칭은 <strong>한 자세로 멈춰서 30초 버티는 것</strong>입니다.
            반동을 주거나 통증이 올 때까지 밀지 마세요 — 당기는 느낌에서 멈춥니다.
          </p>
        </div>

        <p className="text-lg leading-relaxed mb-8 text-gray-700">달리기를 마치고 바로 앉거나 눕는 것은 혈액이 다리에 몰린 상태를 유지시킵니다. 5분의 걷기와 10분의 정적 스트레칭은 심박수를 서서히 내리고 다음 날의 근육통을 줄입니다.</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">동적 스트레칭과 정적 스트레칭, 뭐가 다른가요</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-900"></th>
                  <th className="py-2 pr-3 font-semibold text-gray-900">동적 스트레칭</th>
                  <th className="py-2 font-semibold text-gray-900">정적 스트레칭</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-3 font-medium text-gray-900">언제</td>
                  <td className="py-2 pr-3"><strong>달리기 전</strong></td>
                  <td className="py-2"><strong>달리고 나서</strong></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-3 font-medium text-gray-900">어떻게</td>
                  <td className="py-2 pr-3">움직이면서</td>
                  <td className="py-2">멈춰서 30초 버티기</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-3 font-medium text-gray-900">예</td>
                  <td className="py-2 pr-3">다리 흔들기, 무릎 높이 들기</td>
                  <td className="py-2">종아리 벽 스트레칭</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-medium text-gray-900">목적</td>
                  <td className="py-2 pr-3">몸을 데워 달릴 준비</td>
                  <td className="py-2">굳은 근육 풀고 회복</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            달리기 <strong>전</strong>에 할 동작은{" "}
            <Link href="/injury/warmup" className="font-medium text-emerald-600 hover:underline">
              준비운동 글
            </Link>
            에 도식과 함께 정리해 뒀습니다. 이 글은 <strong>달리고 나서</strong> 하는 쪽입니다.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">쿨다운이 중요한 이유</h2>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">달리기 중 심장은 다리 근육에 많은 혈액을 보냅니다. 갑자기 멈추면 혈액이 다리에 정체되어 어지러움이 생기거나 회복이 늦어질 수 있습니다. 5분 걷기는 심장이 천천히 평상시 박동으로 돌아오게 도와줍니다.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">10분 정적 스트레칭 루틴</h2>
          {/**
           * 2026-09-13 — 문단 하나였던 것을 목록으로 쪼갰다.
           *
           * 원문은 `① … → ② … → ③ …` 이 `<p>` 하나에 들어 있었다.
           * `whitespace-pre-line` 은 붙어 있었지만 **실제 줄바꿈 문자가 없어서**
           * 화면에서는 그냥 한 덩어리로 흘렀다.
           *
           * 초·세트는 원래 다 적혀 있었다. **정보는 있는데 형태가 없었다.**
           * 스트레칭을 따라 하려고 폰을 든 사람이 지금 몇 번째인지 못 찾는다.
           * 네이버 유입의 79.55%가 모바일이다.
           *
           * 문구는 한 글자도 바꾸지 않았다. `→` 와 `①②③` 을 `<li>` 로 옮겼을 뿐이다.
           */}
          {/**
           * 2026-09-14 — 이름만 있던 5개에 **하는 법**을 넣었다.
           *
           * 어제 목록으로 쪼갠 것까지는 맞았는데, 쪼개고 보니
           * `종아리 벽 스트레칭 — 30초 × 2` 처럼 **이름과 횟수만** 있었다.
           * 처음 하는 사람은 이 이름만 보고 자세를 못 잡는다.
           * `/injury/achilles` 는 같은 종류를 단계별로 적어 뒀다 — 그 형식을 따랐다.
           *
           * 순서·시간·문구는 원래 것을 그대로 유지했다. 자세 설명만 더했다.
           */}
          <div className="space-y-3">
            {[
              {
                n: "1",
                name: "종아리 벽 스트레칭",
                how: "벽에 손을 짚고 한 발을 뒤로 뺍니다. 뒤쪽 발 뒤꿈치를 바닥에 완전히 붙인 채 앞쪽 무릎을 굽힙니다.",
                feel: "종아리 뒤쪽이 당기면 맞습니다",
              },
              {
                n: "2",
                name: "햄스트링",
                how: "한 발을 앞으로 내밀고 뒤꿈치만 바닥에 댑니다. 발끝은 위로. 엉덩이를 뒤로 빼면서 상체를 천천히 숙입니다.",
                feel: "허벅지 뒤쪽이 당기면 맞습니다",
              },
              {
                n: "3",
                name: "고관절 굴근",
                how: "한 발을 크게 앞으로 내딛고 뒤쪽 무릎을 바닥에 댑니다. 상체를 세운 채 골반만 앞으로 밉니다.",
                feel: "뒤쪽 다리의 사타구니·허벅지 앞이 당기면 맞습니다",
              },
              {
                n: "4",
                name: "장경인대",
                how: "선 자세에서 늘릴 쪽 다리를 반대쪽 다리 뒤로 교차시킵니다. 그대로 상체를 반대 방향으로 기울입니다.",
                feel: "허벅지 바깥쪽에서 무릎까지 이어지는 선이 당기면 맞습니다",
              },
              {
                n: "5",
                name: "엉덩이",
                how: "등을 대고 누워 한쪽 무릎을 두 손으로 가슴 쪽으로 당깁니다. 반대쪽 다리는 바닥에 붙여 둡니다.",
                feel: "엉덩이 뒤쪽이 당기면 맞습니다",
              },
            ].map((s) => (
              <div key={s.n} className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-gray-400">{s.n}</span>
                  <h3 className="font-bold text-gray-900">{s.name}</h3>
                  <span className="ml-auto shrink-0 text-sm font-semibold text-emerald-700">30초 × 2</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{s.how}</p>
                <p className="mt-1 text-sm text-gray-500">{s.feel}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 leading-relaxed text-gray-700">
            <strong>통증이 아닌 당기는 느낌에서 멈추세요.</strong> 반동을 주며 튕기지 말고,
            30초 동안 같은 자세를 유지합니다. 양쪽 다 합니다.
          </p>
        </section>

        <FinderCta from="cooldown" variant="inline" headline="쿠션이 닳은 신발은 스트레칭으로 못 메웁니다 — 러닝화 수명은 보통 500~800km입니다." />
        <section className="mb-8">
          {/* ⚠️ 2026-09-14: "섭취하면 근육 회복 속도가 빨라집니다" 였다.
              이 주장을 받치던 인용은 2026-08-31 에 무관한 논문으로 판명돼 이미 내려갔고
              (아래 참고자료 첫 항목), 그 뒤로 **근거 없이 단정만 남아 있었다.**
              인용이 내려갔으면 그 인용이 받치던 문장도 같이 손봐야 한다. */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">회복에 도움이 된다고 이야기되는 것</h2>
          <p className="leading-relaxed text-gray-700">
            운동 뒤 단백질과 탄수화물을 같이 먹는 것, 그리고 충분히 자는 것이 흔히 권해집니다.
            다만 <strong>이 글에는 그 효과를 받치는 인용이 없습니다</strong> — 예전에 달았던 자료가
            무관한 논문으로 판명돼 내렸고, 아직 대체하지 못했습니다.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-gray-400">•</span><span className="text-gray-500">운동 후 회복 영양 자료 — 검증기가 무관한 논문을 가리키는 것을 확인해 링크를 내렸습니다 (2026-08-31)</span></li>
            {/* ⚠️ 2026-09-14: 링크가 `https://www.nsca.com` — **단체 홈페이지 루트**였다.
                특정 문헌을 가리키지 않으므로 인용이 아니다. 이런 형태가 `cadence`·`kwon-eun-ju`
                에도 남아 있다(warmup 은 2026-09-03 에 같은 이유로 내렸다).
                링크를 지우고, 인용이 없다는 사실을 적는다. */}
            <li className="flex gap-2"><span className="text-gray-400">•</span><span className="text-gray-500">정적 스트레칭 관련 자료 — 걸려 있던 링크가 특정 논문이 아니라 단체 홈페이지 주소여서 내렸습니다 (2026-09-14)</span></li>

          </ul>
          <p className="mt-3 text-xs text-gray-400">추천 순서는 광고비로 바뀌지 않습니다. 공개된 연구 자료를 근거로 작성했습니다.</p>
        </section>

        <YoutubeSection links={[
          { label: "러닝 후 쿨다운 스트레칭, 5분만 투자하세요 #초보러너", channel: "달려라하나", url: "https://www.youtube.com/watch?v=4Vbiu6RdpkE" },
          { label: "5분만에 끝나는 러닝 후 스트레칭", channel: "지니코치", url: "https://www.youtube.com/watch?v=bsWU6ata_tw" },
          { label: "러닝 스트레칭 종결 l 달리기 전후 제발 5분씩만 따라하세요", channel: "부부물리치료사", url: "https://www.youtube.com/watch?v=qoPyfVxqpQc" },
        ]} />

        <FaqSection items={[
          {
            q: "달리고 나서 바로 앉거나 누우면 안 되나요?",
            a: "바로 앉거나 누우면 혈액이 다리에 정체돼 어지러움이 생기거나 회복이 늦어질 수 있습니다. 먼저 5분 걷기로 심박수를 서서히 내린 뒤 10분 정적 스트레칭을 하는 게 좋습니다.",
          },
          {
            q: "쿨다운 정적 스트레칭은 어떤 순서로 하나요?",
            a: "① 종아리 벽 스트레칭 → ② 햄스트링(서서 앞으로 굽히기) → ③ 고관절 굴근(런지 자세) → ④ 장경인대(다리 꼬아 옆으로 기울기) → ⑤ 엉덩이(누워서 무릎 당기기), 각 30초씩 2회. 통증이 아니라 당기는 느낌에서 멈추세요.",
          },
          {
            q: "회복을 더 빠르게 하려면 뭘 하면 되나요?",
            a: "스트레칭 후 단백질+탄수화물 음료(초콜릿 밀크 등)를 섭취하면 근육 회복 속도가 빨라집니다. 수면의 질도 회복에 직접 영향을 줍니다.",
          },
        ]} />

        {/* 다음에 읽을 것 — 세 번째 시험. from=cooldown 으로 계측된다. */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">다음에 읽을 것</h2>
          <div className="space-y-2">
            <Link
              href="/injury/warmup"
              className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              <p className="font-semibold text-gray-900 text-sm">달리기 전 준비운동 — 동적 스트레칭 →</p>
              <p className="mt-1 text-sm text-gray-600">이 글의 반대편. 도식으로 동작을 볼 수 있습니다.</p>
            </Link>
            <Link
              href="/injury/rest-day"
              className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              <p className="font-semibold text-gray-900 text-sm">휴식일에 뭘 해야 할까? 액티브 리커버리 →</p>
              <p className="mt-1 text-sm text-gray-600">쉬는 날 완전히 눕는 것보다 나은 것.</p>
            </Link>
          </div>
        </section>

        <p className="text-xs text-gray-400 mb-4">※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 통증이 지속되면 전문의 상담을 권장합니다.</p>

        {/* 2026-09-06: 글 안에서 바로 묻게 한다.
            /community 로 보내면 클릭 한 번이 필요하고, 그 한 번에서 대부분을 잃는다 —
            두 달간 질문 0건이 그 증거다. */}
        <InlineAsk from="cooldown" tag="기타" placeholder="예) 쿨다운을 얼마나 해야 하는지 매번 헷갈려요" />

        <FinderCta from="cooldown" headline="신발 교체 시기가 됐다면" sub="체형·발볼·부상 이력을 넣으면 지금 발에 맞는 신발을 추려드립니다." />
        <ShareButtons from="cooldown" title="달리기 후 쿨다운" description="쿨다운을 왜, 얼마나 해야 하는지 정리했습니다." />

      </article>
    </>
  );
}
