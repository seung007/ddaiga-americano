import type { Metadata } from "next";
import Link from "next/link";
import AffiliateNotice from "@/components/AffiliateNotice";
import CourseFigure from "@/components/CourseFigure";
import CourseMapLive from "@/components/CourseMapLive";
import NearestCourse from "@/components/NearestCourse";
import FinderCta from "@/components/FinderCta";
import InlineAsk from "@/components/InlineAsk";
import ShareButtons from "@/components/ShareButtons";
import { HANGANG_COURSES } from "@/lib/courses";

export const metadata: Metadata = {
  title: "한강 러닝 코스 4곳 — 여의도·반포·뚝섬·잠실 거리와 가는 길 | 뛰다가 아메리카노",
  description:
    "여의도 8.4km, 반포 7.2km, 뚝섬 11.5km, 잠실 4.8km. 서울시 미래한강본부가 고시한 공식 길이와 지하철 안내를 출처와 함께 정리했습니다. 블로그에서 옮겨 적은 거리가 아닙니다.",
};

/**
 * 한강 러닝 코스 — 2026-09-06 신설
 *
 * 왜 만들었나
 * ───────────
 * "한강 러닝 코스"는 사람들이 실제로 검색하는 말이고, 우리는 계산기 두 개를 만들 때와
 * 같은 이유로 여기에 입구를 하나 더 낸다. 다만 **지도 싸움은 이길 수 없다** —
 * 카카오맵과 러닝 앱들이 이미 그 자리에 있다.
 *
 * 우리가 쓸 수 있는 각도는 **정확성**이다. 러닝 앱·블로그들이 서울시 공원 길이를 "코스 거리"로
 * 옮겨 적고 있고, 어떤 곳은 잠실을 7.0km로 적었는데 **공식 공원 길이는 4.8km**다.
 * 우리는 공식 수치만 쓰고 출처를 건다. 이건 이 사이트가 논문에 하는 것과 같은 일이다.
 *
 * 안 하는 것
 * ──────────
 * · **구간 거리를 지어내지 않는다.** "마포대교까지 3.2km"는 실측이 필요한데 나는
 *   실측할 수 없다. 공식 길이(편도)와 그 2배(왕복)까지만 적는다.
 * · **노면 종류를 지어내지 않는다.** 우레탄 구간 위치는 공식 자료에 없다.
 *   포장로이고 평탄하다는 것까지가 확인된 사실이고, 신발 근거로는 그걸로 충분하다.
 * · **코스마다 신발을 붙이지 않는다.** 초안에서는 코스 4개에 각각 신발 카드를
 *   크게 달았는데, 그러면 코스 글이 아니라 신발 글이 된다. 코스를 보러 온 사람에게
 *   매 코스마다 상품을 들이미는 셈이라 페이지 성격이 바뀐다.
 *   지금은 코스를 먼저 온전히 보여주고, 신발은 **맨 아래 한 번, 표 하나로** 놓는다.
 *   그마저도 특정 모델을 찍지 않는다 — 코스에서 도출되는 건 거리에 따른 쿠션량까지고,
 *   안정성·발볼·체중은 코스가 아니라 발이 정한다. 모델 선택은 finder의 몫이다.
 */

export default function CoursesPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <AffiliateNotice />

      <h1 className="mb-3 text-3xl font-bold text-gray-900">한강 러닝 코스 4곳</h1>
      {/* 2026-09-07: 인트로 문단과 노란 고지 상자를 걷어냈다.
          사용자 지적 — **"맵 보고 모르면 그냥 나가는 거야. 글은 진짜 간단하게만."**
          맞는 말이다. 지도를 보러 온 사람 앞에 문단 두 개를 세워두면 지도가 아래로 밀린다.
          고지 내용은 **버리지 않고 페이지 맨 아래 <details> 로 옮겼다** —
          `<details>` 안의 텍스트는 DOM 에 있어서 크롤도 되고, 궁금한 사람은 열어 본다. */}
      <p className="mb-8 text-gray-600">여의도 · 반포 · 뚝섬 · 잠실</p>

      {/* ── 한눈에 비교 ── */}
      <section className="mb-12">
        <h2 className="mb-3 text-xl font-bold text-gray-900">한눈에 비교</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="py-2 pr-3 font-medium">코스</th>
                <th className="py-2 pr-3 font-medium">공식 길이(편도)</th>
                <th className="py-2 pr-3 font-medium">끝까지 왕복</th>
                <th className="py-2 font-medium">이런 사람에게</th>
              </tr>
            </thead>
            <tbody>
              {HANGANG_COURSES.map((c) => (
                <tr key={c.slug} className="border-b border-gray-100 align-top">
                  <td className="py-3 pr-3 font-medium text-gray-900">
                    <a href={`#${c.slug}`} className="hover:text-emerald-600">
                      {c.name.replace("한강공원", "")}
                    </a>
                  </td>
                  <td className="py-3 pr-3 text-gray-700">{c.lengthKm}km</td>
                  {/* 왕복은 공식 길이의 2배다. 계산이지 추정이 아니다 */}
                  <td className="py-3 pr-3 text-gray-700">
                    약 {(c.lengthKm * 2).toFixed(1)}km
                  </td>
                  <td className="py-3 text-gray-600">
                    {c.lengthKm < 6 ? "첫 5K" : c.lengthKm < 8 ? "30~45분 러닝" : c.lengthKm < 10 ? "10K·하프 준비" : "LSD 장거리"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 이 설명은 맨 아래 <details> 로 옮겼다. 표 밑에 문단을 세우면 표를 못 읽는다. */}
        <p className="mt-3 text-xs text-gray-500">공원 끝에서 끝까지 기준입니다.</p>
      </section>

      {/* 위치로 고르기 — 한눈에 비교 표 바로 다음, 코스 본문 앞.
          2026-09-07: 이 페이지에 온 사람의 첫 질문은 "넷 중 어디로 갈까"인데
          페이지는 넷을 나란히 놓고 알아서 고르라고만 했다.
          중심 좌표는 lib/courses.ts 의 map.center 를 그대로 쓴다 — 새 데이터가 없다. */}
      <NearestCourse
        courses={HANGANG_COURSES.map((c) => ({
          slug: c.slug,
          name: c.name,
          lat: c.map.center[0],
          lon: c.map.center[1],
        }))}
      />

      {/* ── 코스별 ── */}
      {HANGANG_COURSES.map((c) => {
        return (
          <section key={c.slug} id={c.slug} className="mb-14 scroll-mt-20">
            <h2 className="mb-1 text-2xl font-bold text-gray-900">{c.name}</h2>
            {/* 2026-09-08: 소제목에서 **공식 길이를 뺐다.**
                화면을 보니 소제목 "공식 길이 4.8km" 와 지도 칩 "편도 3.24km" 가
                나란히 있었다. **어느 게 코스 거리인지 알 수 없다.**
                (공식 길이 = 공원 끝에서 끝까지, 칩 = 지도에 그린 구간의 실측.
                 둘 다 맞는 값인데 나란히 놓으면 둘 다 못 믿게 된다.)
                지도 칩 하나만 남기고, 공식 길이는 접힌 <details> 와 맨 위 비교표에
                그대로 있다 — 출처가 붙은 값이라 버리지 않는다. */}
            <p className="mb-4 text-sm text-gray-500">
              {c.district} · {c.zone}
            </p>

            {/* 실제 지도가 먼저 온다.
                도식은 "다리 순서"만 알려주고, 사람이 알고 싶은 건 "길이 어디냐"다.
                도식은 지도 아래 보조로 남긴다 — 그 안의 텍스트는 크롤되므로 버리지 않는다. */}
            <div className="mb-4">
              <CourseMapLive course={c} />
            </div>

            <details className="mb-5 rounded-2xl border border-gray-200 bg-white">
              <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700">
                다리 순서 도식 보기 (상류 → 하류)
              </summary>
              <div className="px-4 pb-4">
                <CourseFigure name={c.slug} bridges={c.bridges} lengthKm={c.lengthKm} />
              </div>
            </details>

            <p className="mb-4 text-gray-700">{c.fit}</p>

            {/* 가는 길·시설·출처를 접었다. 지도 위 핀에 역 이름이 이미 적혀 있어서
                펼치지 않아도 출발점을 안다. 접어도 DOM 에 남으니 검색에는 그대로 잡힌다. */}
            <details className="mb-5 rounded-2xl border border-gray-200 bg-white">
              <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700">
                가는 길 · 시설 · 출처
              </summary>
              <div className="grid gap-4 px-4 pb-4 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-900">가는 길 (공식 안내)</h3>
                <ul className="space-y-1.5 text-sm leading-relaxed text-gray-600">
                  {c.access.map((a) => (
                    <li key={a}>· {a}</li>
                  ))}
                </ul>
                {c.info ? (
                  <p className="mt-2 text-xs text-gray-500">안내센터 {c.info}</p>
                ) : (
                  // 확인 못 한 것을 빈칸으로 두는 대신 왜 없는지 적는다.
                  // AGENTS.md §4 — "근거 없음을 정직하게 표시한 페이지가 낫다"
                  <p className="mt-2 text-xs text-gray-400">
                    안내센터 번호는 공식 페이지에서 확인하지 못해 적지 않았습니다
                  </p>
                )}
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-900">공식 자료에 있는 것</h3>
                <ul className="space-y-1.5 text-sm leading-relaxed text-gray-600">
                  {c.facts.map((f) => (
                    <li key={f}>· {f}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="px-4 pb-4 text-xs text-gray-400">
              출처{" "}
              <a
                href={c.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-600"
              >
                {c.source.label} ↗
              </a>{" "}
              · {c.source.checkedAt} 확인
            </p>
            </details>
          </section>
        );
      })}

      {/* ── 신발은 여기 한 번만, 부수적으로 ──────────────────────────
          처음에는 코스마다 신발 카드를 큼직하게 붙였다가 뺐다.
          코스를 보러 온 사람에게 매 코스마다 신발을 들이미는 건
          **코스 글이 아니라 신발 글**이 된다. 코스는 코스대로 읽히게 두고,
          신발은 다 읽은 뒤 한 번만 놓는다. 그게 이 페이지의 성격에 맞다. */}
      <section className="mb-10 rounded-2xl border border-gray-200 p-5">
        <h2 className="mb-1 text-lg font-bold text-gray-900">
          참고 — 거리에 따라 달라지는 것은 쿠션량뿐입니다
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-gray-600">
          한강은 네 곳 다 포장로이고 평탄합니다. 그러니 코스가 바꾸는 조건은{" "}
          <strong className="text-gray-900">한 번에 얼마나 오래 달리느냐</strong> 하나뿐이에요.
          발볼·평발 여부·체중은 코스가 아니라 발이 정합니다.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="py-2 pr-3 font-medium">한 번에 달리는 거리</th>
                <th className="py-2 font-medium">쿠션 기준</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-3">5km 안팎 (잠실 정도)</td>
                <td className="py-2">최대 쿠션까지는 필요 없습니다. 가벼운 쪽이 편합니다</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-3">7~9km (반포·여의도)</td>
                <td className="py-2">40분 이상 포장로에 착지합니다. 데일리 트레이너 영역</td>
              </tr>
              <tr>
                <td className="py-2 pr-3">10km 이상 (뚝섬)</td>
                <td className="py-2">충격이 누적됩니다. 쿠션을 두껍게 두는 편이 무게 손해보다 낫습니다</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-gray-600">
          구체적인 모델은 체형까지 봐야 정해집니다.{" "}
          <Link href="/shoe-finder" className="font-medium text-emerald-700 hover:underline">
            키·체중·발볼로 3개 골라 보기 →
          </Link>
        </p>
      </section>

      {/* ── 도구 연결 ── */}
      <section className="mb-10 rounded-2xl border border-gray-200 p-5">
        <h2 className="mb-2 text-lg font-bold text-gray-900">달리기 전에 계산해 볼 것</h2>
        <ul className="space-y-2 text-sm leading-relaxed text-gray-600">
          <li>
            ·{" "}
            <Link href="/tools/pace" className="font-medium text-emerald-700 hover:underline">
              페이스 계산기
            </Link>{" "}
            — 위 왕복 거리를 목표 시간에 맞추면 km당 몇 분으로 뛰어야 하는지 나옵니다
          </li>
          <li>
            ·{" "}
            <Link href="/tools/shoe-life" className="font-medium text-emerald-700 hover:underline">
              러닝화 수명 계산기
            </Link>{" "}
            — 한강을 주 3회 돌면 신발이 언제쯤 바닥나는지 세어 줍니다
          </li>
          <li>
            ·{" "}
            <Link href="/injury/warmup" className="font-medium text-emerald-700 hover:underline">
              준비운동 6동작
            </Link>{" "}
            — 그림으로 따라 할 수 있게 만들어 뒀습니다
          </li>
        </ul>
      </section>

      <FinderCta
        from="courses"
        headline="이 코스에 맞는 신발, 내 발에도 맞을까요?"
        sub="키·체중·발볼만 고르면 논문 기반으로 3개를 골라 드립니다."
      />

      <div className="mt-10">
        <ShareButtons
          title="한강 러닝 코스 4곳 — 거리·가는 길·신발까지"
          description="여의도·반포·뚝섬·잠실. 서울시 공식 길이와 코스에 맞는 러닝화를 정리했습니다."
          from="courses"
        />
      </div>

      <div className="mt-10">
        <InlineAsk
          from="courses"
          tag="기타"
          heading="한강에서 뛰는데 궁금한 게 있나요?"
          placeholder="예) 여의도에서 처음 5km 뛰려는데 어떤 신발이 좋을까요?"
        />
      </div>
      {/* 옮겨온 고지.
          내용을 줄이지 않았다 — **자리만 옮겼다.** 정직성 문구를 지우는 건 다른 문제다.
          맨 아래에 접어두면 지도를 보러 온 사람을 막지 않고, 궁금한 사람은 열어 본다. */}
      <details className="mt-14 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
        <summary className="cursor-pointer font-medium text-gray-700">
          이 숫자들은 어디서 왔나 (직접 달려보고 쓴 글이 아닙니다)
        </summary>
        <div className="mt-3 space-y-2 leading-relaxed">
          <p>
            저희는 이 코스들을 직접 달려보지 않았습니다. 그래서{" "}
            <strong className="text-gray-800">서울시 미래한강본부 공식 자료에 있는 것만</strong>{" "}
            적었고, 노면 종류처럼 공식 자료에 없는 것은 쓰지 않았습니다.
          </p>
          <p>
            표의 <strong className="text-gray-800">&lsquo;공식 길이&rsquo;는 공원 끝에서 끝까지</strong>입니다.
            중간에서 돌아서면 그만큼 짧아집니다. 러닝 앱들이 이 숫자를 &lsquo;코스 거리&rsquo;로
            옮겨 적는 바람에 같은 코스가 매체마다 다른 거리로 적혀 있습니다.
          </p>
          <p>
            지도의 <strong className="text-gray-800">경로선과 편도·왕복 거리는 OpenStreetMap 의
            실제 강변 산책로 선형</strong>에서 계산한 값입니다(다리로 강을 건너 질러가지 않게
            처리하고, 직선거리보다 짧게 나온 경로는 계산이 틀린 것으로 보아 버립니다).
            핀 좌표도 OSM 조회값입니다. <strong className="text-gray-800">없는 경로를 그려 넣지
            않았습니다</strong> — 못 받은 코스는 경로선 없이 표시됩니다.
          </p>
        </div>
      </details>

    </main>
  );
}
