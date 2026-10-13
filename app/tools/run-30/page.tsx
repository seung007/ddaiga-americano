import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import { Basis, Note, Warn } from "@/components/guide/Read";
import Run30Client from "./Run30Client";

/**
 * 30분 달리기 따라 하기 (2026-10-13)
 *
 * 왜 만들었나
 *   「처음 달리기」 글의 8단계 걷기-달리기 표는 읽고 끝나는 표였다. 사람들이 돌아오는 것은 표가 아니라 **오늘 할 회차**다.
 *   벤치마크: NHS Couch to 5K(회차마다 같은 순서로 할 일과 총 시간, 「한 주 반복해도 괜찮다」, 인쇄용 계획, 수료증),
 *   런데이(24일 30분 코스, 음성 코칭). 그 형태를 빌리되 **프로그램은 새로 만들지 않는다** —
 *   start-running 페이지의 표·조건을 그대로 쓴다(lib/guide/walkRun.ts 단일 출처).
 *
 * 지킬 것
 *   · 이 진도표·조건·주 3회는 **저희 예시**다. 특정 진도표를 검증한 연구는 찾지 못했다 — 화면 맨 위에 적는다.
 *   · 멈출 신호(<Warn>)는 start-running 과 같은 문장, 접지 않는다.
 *   · 진행은 이 브라우저(localStorage)에만. 개인정보 처리방침에 한 줄.
 */

const TITLE = "30분 달리기 따라 하기 — 걷기·달리기 8단계 24회";
const DESC =
  "걷기와 달리기를 섞어 30분을 쉬지 않고 뛰기까지 8단계 24회. 회차마다 할 순서와 총 시간, 음성 안내 타이머, 진행 저장, 완주 수료증. 진도표는 연구로 검증된 것이 아니라 저희 예시입니다.";

export const metadata: Metadata = {
  title: `${TITLE} | 뛰다가 아메리카노`,
  description: DESC,
  alternates: { canonical: "/tools/run-30" },
};

export default function Run30Page() {
  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          ["러닝 계산기", "/tools"],
          ["30분 달리기 따라 하기", "/tools/run-30"],
        ]}
      />
      <main className="mx-auto max-w-2xl px-4 py-10 text-gray-800 sm:px-5">
        <nav className="mb-5 flex min-w-0 flex-wrap gap-x-2 text-sm text-gray-500">
          <Link href="/tools" className="hover:text-gray-900">
            러닝 계산기
          </Link>
          <span aria-hidden>/</span>
          <Link href="/injury/start-running" className="text-emerald-700 hover:underline">
            처음 달리기 글
          </Link>
        </nav>

        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">30분 달리기 따라 하기</h1>
        <p className="mt-3 break-keep text-[17px] leading-[1.75] text-gray-700">
          걷기와 달리기를 섞어 <strong>8단계 × 3회 = 24회</strong>. 오늘 할 회차를 누르고 타이머를 켜면 됩니다.
        </p>

        <div className="mt-5 rounded-xl border border-gray-200 px-4 py-3.5">
          <p className="text-sm font-bold text-gray-900">
            이렇게 합니다
            <Basis kind="rule" />
          </p>
          <ul className="mt-2 list-disc space-y-1.5 break-keep pl-5 text-[15px] leading-[1.7] text-gray-800">
            <li>
              앞뒤로 5분씩 걷습니다. <strong>주 3회</strong>, 달리는 날 사이에 하루 쉽니다.
            </li>
            <li>
              같은 단계를 3번 해서 <strong>① 달리는 동안 대화가 됐고 ② 다음 날 아침 아프지 않으면</strong> 다음 단계로. 하나라도
              아니면 같은 단계를 반복하고, 두 번 반복해도 안 되면 한 단계 내려갑니다.
            </li>
            <li>H까지 최소 8주. 더 걸려도 정상입니다.</li>
          </ul>
        </div>
        <Note>
          이 진도표와 조건은 저희 예시입니다. 특정 진도표나 &lsquo;주 3회가 최적&rsquo;이라는 근거는 찾지 못했습니다. 근거와 한계는{" "}
          <Link href="/injury/start-running#progression" className="underline">
            처음 달리기 글
          </Link>
          에 있습니다.
        </Note>

        <Run30Client
          safety={
            <Warn title="그날은 멈추는 신호 (저희 기준, 진단 아님)">
              <ul className="list-disc space-y-1 pl-5">
                <li>통증 때문에 걸음걸이가 바뀐다</li>
                <li>다음 날 아침이 전날보다 더 아프다</li>
                <li>뼈의 한 지점을 누르면 콕 집어 아프다, 또는 쉬어도 아프다</li>
                <li>붓거나 열감이 있다</li>
              </ul>
              <p className="mt-2">이런 신호가 며칠 이어지면 진료를 받으세요.</p>
            </Warn>
          }
        />
      </main>
    </>
  );
}
