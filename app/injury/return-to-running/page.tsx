import type { Metadata } from "next";
import Link from "next/link";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";
import { Up, S } from "@/components/guide/Up";

/**
 * 부상 후 복귀 (2026-10-06)
 *
 * 왜 이 글인가
 *   DC 러닝 갤러리 「부상관리」 말머리 300건(2025-10~2026-10)을 제목으로 분류했더니
 *   「쉬어야 하나·언제 복귀하나」가 25건으로 병원·진단(15건)보다 많았다. 이 사이트에는 그 질문에 답하는 글이 없었다.
 *   (집계는 건수만 남겼다. 원 제목·닉네임은 저장하지 않는다.)
 *
 * 규칙
 *   · 숫자는 PubMed 초록(또는 PMC 본문)에서 확인한 값만. 2026-10-06 대조.
 *   · 통증 모니터링 모델의 0~2/2~5/5 기준은 **임상 경험으로 정한 값이고 검증된 적이 없다**는 것까지 적는다
 *     (Ullern 2025 스코핑 리뷰 본문). 숫자만 옮기면 검증된 기준처럼 읽힌다.
 *   · 그 모델은 힘줄·무릎 통증 연구에서 쓰였다. 뼈 부상(피로골절)에 쓰라는 근거는 없어서 따로 떼어 적는다.
 *   · 복귀 진도는 사이트 예시라고 표시한다.
 */

const PAGE_URL = "https://ddaiga-americano.vercel.app/injury/return-to-running";
const TITLE = "부상 후 다시 달리기 — 언제, 얼마나, 어떻게";
const DESC =
  "부상당한 초보 러너의 회복 기간 중앙값은 71일이었습니다. 완전히 쉬어야 하는지, 통증이 어느 정도면 달려도 되는지, 다시 다치지 않으려면 어떻게 늘리는지 논문 수치로 정리했습니다.";

export const metadata: Metadata = {
  title: "부상 후 러닝 복귀 — 언제 다시 뛰나, 얼마나 쉬어야 하나 | 뛰다가 아메리카노",
  description: DESC,
  alternates: { canonical: "/injury/return-to-running" },
};

const FAQ: FaqItem[] = [
  {
    q: "아프면 무조건 완전히 쉬어야 하나요?",
    a: "부상 종류에 따라 다릅니다. 아킬레스건병증 환자 38명을 나눈 무작위 시험에서는 통증을 기준으로 달리기를 계속한 그룹과 6주 동안 쉰 그룹의 회복이 같았습니다(Silbernagel 2007). 반면 피로골절이 의심되면(뼈 한 지점을 누르면 아픔, 쉬어도 아픔) 통증 기준으로 달리면 안 되고 진단부터 받아야 합니다.",
  },
  {
    q: "통증이 몇 점이면 달려도 되나요?",
    a: "연구에서 자주 쓰는 통증 모니터링 모델은 0~10점 중 2 미만을 안전, 2~5를 허용, 5 초과를 위험으로 보고, 다음 날 아침에는 통증이 가라앉아 있어야 한다는 조건을 붙입니다. 다만 이 기준은 임상 경험으로 정한 값이고 검증된 적은 없습니다(Ullern 2025). 힘줄·무릎 통증 연구에서 쓰였고 뼈 부상에는 쓰지 않습니다.",
  },
  {
    q: "쉬는 동안 체력이 다 빠지나요?",
    a: "훈련된 사람은 4주 안쪽만 쉬어도 최대산소섭취량이 빠르게 떨어지지만, 최근에 훈련을 시작한 사람은 변화가 더 완만합니다(Mujika 2000). 그리고 6주 동안 물속 달리기나 자전거로 훈련한 러너는 2마일 기록이 달리기 그룹과 차이가 없었습니다(Eyestone 1993).",
  },
  {
    q: "복귀하면 부상 전 거리로 바로 돌아가도 되나요?",
    a: "권하지 않습니다. 한 번 달린 거리가 지난 30일 최장 거리보다 10% 넘게 길면 부상 비율이 올라갔습니다(Frandsen 2025). 오래 쉬었다면 지난 30일 최장 거리가 짧거나 0이므로, 이 기준만 따라도 자연스럽게 조금씩 늘리게 됩니다. 그리고 예전에 다친 적이 있으면 회복이 더 오래 걸렸습니다(Fokkema 2019, OR 2.31).",
  },
  {
    q: "언제 병원에 가야 하나요?",
    a: "걸음걸이가 바뀔 만큼 아프거나, 붓거나 열이 나거나, 뼈의 한 지점을 누르면 콕 집어 아프거나, 쉬어도 2주 넘게 나아지지 않으면 진료를 받으세요. 이 기준은 이 사이트가 정한 것이며 진단을 대신하지 않습니다.",
  },
];

export default function ReturnToRunningPage() {
  return (
    <>
      <ArticleJsonLd headline={TITLE} description={DESC} url={PAGE_URL} datePublished="2026-10-06" />
      <BreadcrumbJsonLd
        trail={[
          ["러닝 가이드", "/injury"],
          ["부상 후 복귀", "/injury/return-to-running"],
        ]}
      />
      <article className="mx-auto max-w-2xl px-6 py-12 text-gray-800">
        <Link href="/injury" className="mb-6 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">회복 · 모든 단계</span>
          <span className="text-xs text-gray-400">8분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight text-gray-900">{TITLE}</h1>

        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">먼저 결론</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-emerald-900">
            <li>
              <strong>생각보다 오래 걸립니다.</strong> 부상당한 초보 러너가 회복하기까지 중앙값 71일. 10주가 지나도 절반은 500m를 두 번
              통증 없이 달리지 못했습니다.
            </li>
            <li>
              <strong>완전한 휴식만이 답은 아닙니다.</strong> 아킬레스 힘줄 부상 무작위 시험에서 통증을 보며 달리기를 이어간 그룹과 6주 쉰
              그룹의 회복이 같았습니다(38명, 한 편). 뼈 부상은 예외입니다.
            </li>
            <li>
              <strong>쉬는 동안 체력은 지킬 수 있습니다.</strong> 물속 달리기·자전거 6주로 2마일 기록이 유지됐습니다.
            </li>
            <li>
              <strong>돌아올 때는 &lsquo;지난 30일 최장 거리의 110%&rsquo;.</strong> 부상 전 기록이 아니라 최근 30일이 기준입니다.
            </li>
          </ol>
        </div>

        <TableOfContents
          items={[
            { id: "how-long", label: "얼마나 걸리나" },
            { id: "rest-or-run", label: "쉬어야 하나, 달려도 되나" },
            { id: "bone", label: "뼈 부상은 다르다" },
            { id: "fitness", label: "쉬는 동안 체력" },
            { id: "comeback", label: "복귀 진도" },
            { id: "again", label: "다시 다치지 않으려면" },
            { id: "refs", label: "참고 문헌" },
          ]}
        />

        {/* ── 얼마나 ─────────────────────────────────────────── */}
        <h2 id="how-long" className="mt-10 text-xl font-bold text-gray-900">
          얼마나 걸리나
        </h2>
        <ul className="mt-4 space-y-3 text-[15px] leading-relaxed">
          <li>
            초보 러너 933명 중 다친 254명을 진찰하고 회복할 때까지 따라간 연구에서, 회복한 220명의 회복 기간 중앙값은{" "}
            <strong>71일</strong>(최소 9일, 최대 617일)이었습니다. 10주가 지나도 절반은 500m를 두 번 통증 없이 달리지 못했고, 약 5%는
            수술을 받았습니다.{" "}
            <S>(Nielsen et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/24923269/" />)</S>
          </li>
          <li>
            6주 초보 프로그램 참가자 중 다친 347명의 부상 기간 중앙값은 <strong>8주</strong>(1~52주)였습니다. 예전에 다친 적이 있으면 10주
            넘게 가는 경우가 더 많았고(OR 2.31), 종아리 부상은 빨리 낫는 경향이었습니다.{" "}
            <S>(Fokkema et al. (2019) <Up h="https://pubmed.ncbi.nlm.nih.gov/30268637/" />)</S>
          </li>
        </ul>
        <p className="mt-3 text-sm text-gray-600">
          두 연구 모두 중앙값이 두 달 안팎입니다. 일주일 단위보다 두 달 단위로 계획을 잡는 편이 현실에 가깝습니다.
        </p>

        {/* ── 쉬기 vs 달리기 ─────────────────────────────────── */}
        <h2 id="rest-or-run" className="mt-10 text-xl font-bold text-gray-900">
          쉬어야 하나, 달려도 되나
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed">
          아킬레스건병증 환자 38명을 두 그룹으로 나눠, 한쪽은 통증을 보며 달리기·점프를 계속하고 다른 쪽은 6주 동안 멈추게 했습니다. 재활
          운동은 똑같이 했습니다. 12개월 동안 <strong>두 그룹의 회복 속도에 차이가 없었고</strong>, 달리기를 계속한 쪽에서 나쁜 영향은
          보이지 않았습니다.{" "}
          <S>(Silbernagel et al. (2007) <Up h="https://pubmed.ncbi.nlm.nih.gov/17307888/" />)</S>{" "}
          같은 연구진이 운동 치료만 받은 34명을 5년 추적했을 때는 80%가 완전히 회복했고, 움직이는 것을 두려워할수록 종아리 기능 회복이 더뎠습니다.{" "}
          <S>(Silbernagel et al. (2011) <Up h="https://pubmed.ncbi.nlm.nih.gov/21084657/" />)</S>
        </p>

        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm font-semibold text-gray-900">통증 모니터링 모델 (0~10점)</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-lg bg-emerald-50 p-3">
              <p className="text-lg font-bold text-emerald-700">2 미만</p>
              <p className="text-xs text-emerald-800">안전</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3">
              <p className="text-lg font-bold text-amber-700">2~5</p>
              <p className="text-xs text-amber-800">허용</p>
            </div>
            <div className="rounded-lg bg-red-50 p-3">
              <p className="text-lg font-bold text-red-700">5 초과</p>
              <p className="text-xs text-red-800">위험</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            조건: <strong>다음 날 아침에는 가라앉아 있을 것.</strong>
          </p>
          <p className="mt-2 text-xs leading-relaxed text-gray-500">
            이 구간은 1997년 슬개대퇴 통증 재활 연구자가 <strong>임상 경험으로 정한 값</strong>이고, 이후 아킬레스·슬개건 연구에서 널리
            쓰였지만 기준 자체를 검증한 연구는 없다고 정리돼 있습니다.{" "}
            <S>(Ullern et al. (2025) <Up h="https://pubmed.ncbi.nlm.nih.gov/39987051/" />)</S>
          </p>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          실제로 쓸 때: 달리는 중 5를 넘으면 그날은 멈추고, 다음 날 아침이 전날보다 아프면 거리를 줄입니다. 걸음걸이가 바뀔 만큼 아프면 점수와
          상관없이 멈춥니다(경험칙).
        </p>

        {/* ── 뼈 ─────────────────────────────────────────── */}
        <h2 id="bone" className="mt-10 text-xl font-bold text-gray-900">
          뼈 부상은 다르다
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed">
          위 통증 모델은 힘줄·무릎 통증에서 쓰인 것입니다. 피로골절(뼈 스트레스 부상)이 의심되면 통증을 참고 달리는 방식으로 다루지 않습니다.
          뼈 스트레스 부상 2,974건을 모은 메타분석에서 운동 복귀까지 걸린 기간은 위치에 따라 크게 달랐습니다 — 정강이뼈 뒤안쪽 44일, 종아리뼈
          56일, 대퇴골 경부 107일, 발 주상골 127일. 대퇴골 경부·정강이뼈 앞쪽·주상골은 합병증 위험도 높았습니다. 전체로는 90% 넘게 복귀했습니다.{" "}
          <S>(Hoenig et al. (2023) <Up h="https://pubmed.ncbi.nlm.nih.gov/36720584/" />)</S>
        </p>
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-900">
          뼈의 한 지점을 누르면 콕 집어 아프다, 쉬어도 아프다, 밤에도 아프다 → 달리기를 멈추고 진료부터. 엑스레이는 초기에 안 보일 수 있습니다.
          <span className="text-red-700/70"> (이 사이트의 기준)</span> 정강이라면{" "}
          <Link href="/injury/shin-splints" className="font-medium underline">정강이 통증 글</Link>의 구별법을 보세요.
        </div>

        {/* ── 체력 ─────────────────────────────────────────── */}
        <h2 id="fitness" className="mt-10 text-xl font-bold text-gray-900">
          쉬는 동안 체력
        </h2>
        <ul className="mt-3 space-y-3 text-[15px] leading-relaxed">
          <li>
            4주 안쪽의 짧은 휴식에도 잘 훈련된 선수는 최대산소섭취량과 혈액량이 빠르게 줄지만, <strong>최근에 훈련을 시작한 사람은 변화가 더
            완만</strong>합니다.{" "}
            <S>(Mujika &amp; Padilla (2000) <Up h="https://pubmed.ncbi.nlm.nih.gov/10966148/" />)</S>
          </li>
          <li>
            훈련된 32명을 물속 달리기·자전거·달리기로 나눠 6주 훈련했더니 세 그룹 모두 최대산소섭취량이 조금 줄었고 <strong>2마일 기록은
            그대로</strong>였습니다. 그룹 사이 차이는 없었습니다.{" "}
            <S>(Eyestone et al. (1993) <Up h="https://pubmed.ncbi.nlm.nih.gov/8427367/" />)</S>
          </li>
          <li>
            훈련된 남성 러너 16명을 6주 동안 물속 달리기와 트레드밀로 나눈 연구에서도 최대산소섭취량·환기역치·러닝 이코노미가 두 그룹 모두
            유지됐습니다.{" "}
            <S>(Wilber et al. (1996) <Up h="https://pubmed.ncbi.nlm.nih.gov/8871917/" />)</S>
          </li>
        </ul>
        <p className="mt-3 text-sm text-gray-600">
          두 연구 모두 훈련된 사람이 대상이었고 기간은 6주였습니다. 아픈 부위에 통증이 없는 운동을 고르세요 — 자전거가 무릎 바깥을 자극하면 물속
          달리기로(경험칙).
        </p>

        {/* ── 복귀 진도 ─────────────────────────────────────── */}
        <h2 id="comeback" className="mt-10 text-xl font-bold text-gray-900">
          복귀 진도
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed">
          성인 러너 5,205명을 18개월 추적한 연구에서 한 번 달린 거리가 <strong>지난 30일 최장 거리보다 10% 넘게 길면</strong> 과사용 부상
          비율이 1.52~2.28배였습니다.{" "}
          <S>(Frandsen et al. (2025) <Up h="https://pubmed.ncbi.nlm.nih.gov/40623829/" />)</S>{" "}
          복귀할 때 이 기준이 특히 쓸모 있습니다. 한 달을 쉬었다면 &lsquo;지난 30일 최장 거리&rsquo;는 0에 가깝습니다. 부상 전 15km를
          달렸어도 기준은 지금입니다.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="whitespace-nowrap p-2.5">단계</th>
                <th className="p-2.5">할 것</th>
                <th className="p-2.5">넘어가는 조건</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1", "빠르게 걷기 30분", "걷는 동안·다음 날 아침 통증 2 미만"],
                ["2", "걷기-달리기 섞기 (1분 달리기 + 2분 걷기부터)", "같은 조건으로 3회"],
                ["3", "달리는 구간 늘리기 → 20~30분 연속", "같은 조건으로 3회"],
                ["4", "긴 날을 지난 30일 최장 거리의 110% 안에서", "부상 전 거리까지"],
              ].map(([k, what, cond]) => (
                <tr key={k} className="border-t border-gray-100">
                  <td className="p-2.5 font-semibold text-gray-900">{k}</td>
                  <td className="p-2.5 text-gray-700">{what}</td>
                  <td className="p-2.5 text-gray-500">{cond}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          표는 이 사이트의 예시입니다. 복귀 진도를 검증한 연구는 찾지 못했습니다. 2~3단계는{" "}
          <Link href="/injury/start-running#progression" className="underline">처음 달리기 글의 걷기-달리기 표</Link>를 그대로 써도 됩니다.
          진료를 받았다면 의료진의 계획이 먼저입니다.
        </p>

        {/* ── 다시 다치지 않으려면 ──────────────────────────── */}
        <h2 id="again" className="mt-10 text-xl font-bold text-gray-900">
          다시 다치지 않으려면
        </h2>
        <ul className="mt-3 space-y-3 text-[15px] leading-relaxed">
          <li>
            <strong>다쳤던 사람이 또 다칩니다.</strong> 전향 연구 11편을 모은 고찰에서 가장 일관된 부상 위험 요인은 지난 12개월 안의 부상이었습니다.{" "}
            <S>(Saragiotto et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/24809248/" />)</S>{" "}
            걷기-달리기 프로그램 110명 연구에서도 예전 부상이 있으면 새 부상 오즈가 7.56배였습니다.{" "}
            <S>(Relph et al. (2023) <Up h="https://pubmed.ncbi.nlm.nih.gov/37681822/" />)</S>
          </li>
          <li>
            <strong>대부분 아픈 채 계속 달립니다.</strong> 파크런 러너 설문에서 지금 부상이 있는 570명 중 86%가 그랬습니다.{" "}
            <S>(Linton &amp; Valentin (2018) <Up h="https://pubmed.ncbi.nlm.nih.gov/29853263/" />)</S>{" "}
            같은 연구의 저자들은 이전 부상에서 완전히 회복하는 것이 다음 부상을 막을 수 있다고 봤습니다.
          </li>
          <li>
            <strong>근력운동은 기대만큼 단순하지 않습니다.</strong> 스포츠 전반 무작위 시험 25편 메타분석에서는 근력운동이 부상을 3분의 1
            수준으로 줄였지만(RR 0.315),{" "}
            <S>(Lauersen et al. (2014) <Up h="https://pubmed.ncbi.nlm.nih.gov/24100287/" />)</S>{" "}
            첫 풀마라톤 러너 720명에게 12주 동안 주 3회 10분짜리 자가 근력 프로그램을 준 시험에서는 완주를 막은 과사용 부상이 7.1% 대 7.3%로
            차이가 없었습니다.{" "}
            <S>(Toresdahl et al. (2020) <Up h="https://pubmed.ncbi.nlm.nih.gov/31642726/" />)</S>
          </li>
        </ul>

        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
          <p className="font-semibold text-gray-900">부위별로 더 보기</p>
          <p className="mt-1">
            <Link href="/injury/it-band" className="text-emerald-700 underline">무릎 바깥(장경인대)</Link>
            {" · "}
            <Link href="/injury/knee-pain" className="text-emerald-700 underline">무릎 앞</Link>
            {" · "}
            <Link href="/injury/shin-splints" className="text-emerald-700 underline">정강이</Link>
            {" · "}
            <Link href="/injury/plantar-fasciitis" className="text-emerald-700 underline">발바닥</Link>
            {" · "}
            <Link href="/injury/achilles" className="text-emerald-700 underline">아킬레스·종아리</Link>
          </p>
        </div>

        <div className="mt-10">
          <FaqSection items={FAQ} />
        </div>

        <h2 id="refs" className="mt-10 text-xl font-bold text-gray-900">
          참고 문헌
        </h2>
        <p className="mt-1 text-xs text-gray-400">2026-10-06 PubMed 초록과 대조했습니다(Ullern 2025 는 PMC 본문).</p>
        <ul className="mt-3 space-y-2 text-sm text-gray-700">
          <li>
            <strong>Nielsen et al. (2014)</strong> — 부상당한 초보 254명 회복 기간 전향 연구, 중앙값 71일. PLOS ONE 9(6):e99877.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/24923269/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Fokkema et al. (2019)</strong> — 초보 러너 부상 예후, 기간 중앙값 8주·이전 부상 OR 2.31. J Sci Med Sport 22(3):259-263.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/30268637/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Silbernagel et al. (2007)</strong> — 아킬레스건병증 38명 무작위 시험, 통증 모니터링 하 활동 지속 대 6주 휴식. Am J Sports
            Med 35(6):897-906.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/17307888/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Silbernagel et al. (2011)</strong> — 운동 치료만 받은 아킬레스건병증 34명 5년 추적, 80% 완전 회복. Am J Sports Med 39(3):607-13.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/21084657/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Ullern et al. (2025)</strong> — 운동 중 통증 허용 기준을 정리한 스코핑 리뷰(통증 모니터링 모델의 유래와 한계). BMC
            Musculoskelet Disord 26(1):180.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/39987051/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Hoenig et al. (2023)</strong> — 뼈 스트레스 부상 2,974건 위치별 복귀 기간 메타분석. Br J Sports Med 57(7):427-432.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/36720584/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Mujika &amp; Padilla (2000)</strong> — 단기(4주 미만) 디트레이닝 고찰. Sports Med 30(2):79-87.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/10966148/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Eyestone et al. (1993)</strong> — 물속 달리기·자전거·달리기 6주 비교, 2마일 기록 유지. Am J Sports Med 21(1):41-4.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/8427367/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Wilber et al. (1996)</strong> — 훈련된 러너 16명 6주 물속 달리기, 유산소 능력 유지. Med Sci Sports Exerc 28(8):1056-62.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/8871917/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Frandsen et al. (2025)</strong> — 5,205명 18개월, 30일 최장 거리 대비 10% 초과 시 부상 증가. Br J Sports Med
            59(17):1203-1210.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/40623829/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Saragiotto et al. (2014)</strong> — 부상 위험 요인 체계적 고찰, 지난 12개월 부상. Sports Med 44(8):1153-63.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/24809248/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Relph et al. (2023)</strong> — Couch-to-5k 변형 110명, 이전 부상 OR 7.56. Int J Environ Res Public Health 20(17):6682.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/37681822/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Linton &amp; Valentin (2018)</strong> — 파크런 러너 1,145명 설문, 부상 중 86% 계속 달림. J Sci Med Sport 21(12):1221-1225.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/29853263/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Lauersen et al. (2014)</strong> — 운동 중재 부상 예방 메타분석(무작위 시험 25편). Br J Sports Med 48(11):871-7.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/24100287/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
          <li>
            <strong>Toresdahl et al. (2020)</strong> — 첫 풀마라톤 러너 720명 근력 프로그램 무작위 시험. Sports Health 12(1):74-79.{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/31642726/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PubMed →</a>
          </li>
        </ul>
        <p className="mt-3 text-xs text-gray-400">※ 이 글은 의학적 진단을 대체하지 않습니다. 통증이 이어지면 전문의와 상담하세요.</p>
      </article>
    </>
  );
}
