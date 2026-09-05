import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AffiliateNotice from "@/components/AffiliateNotice";
import CourseFigure from "@/components/CourseFigure";
import FinderCta from "@/components/FinderCta";
import InlineAsk from "@/components/InlineAsk";
import ShareButtons from "@/components/ShareButtons";
import { HANGANG_COURSES } from "@/lib/courses";
import { SHOES } from "@/lib/shoes/data";

export const metadata: Metadata = {
  title: "한강 러닝 코스 4곳 — 거리·가는 길·신발까지 | 뛰다가 아메리카노",
  description:
    "여의도·반포·뚝섬·잠실 한강공원의 공식 길이와 가는 길을 서울시 자료로 정리하고, 코스 길이에 맞는 러닝화를 붙였습니다. 블로그에서 옮겨 적은 거리가 아니라 서울시 고시 수치입니다.",
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
 * 우리가 유일하게 쓸 수 있는 각도는 **"러닝화 데이터를 가진 쪽이 쓰는 코스 글"**이다.
 * 실제로 러닝 앱의 코스 페이지를 열어 보니 제목에 "노면"이라고 적어놓고 본문에는
 * 노면 이야기가 없었다. 코스와 신발을 잇는 자리는 비어 있다.
 *
 * 두 번째 각도는 **정확성**이다. 러닝 앱·블로그들이 서울시 공원 길이를 "코스 거리"로
 * 옮겨 적고 있고, 어떤 곳은 잠실을 7.0km로 적었는데 **공식 공원 길이는 4.8km**다.
 * 우리는 공식 수치만 쓰고 출처를 건다. 이건 이 사이트가 논문에 하는 것과 같은 일이다.
 *
 * 안 하는 것
 * ──────────
 * · **구간 거리를 지어내지 않는다.** "마포대교까지 3.2km"는 실측이 필요한데 나는
 *   실측할 수 없다. 공식 길이(편도)와 그 2배(왕복)까지만 적는다.
 * · **노면 종류를 지어내지 않는다.** 우레탄 구간 위치는 공식 자료에 없다.
 *   포장로이고 평탄하다는 것까지가 확인된 사실이고, 신발 근거로는 그걸로 충분하다.
 * · **코스로 안정화를 추천하지 않는다.** 안정성·발볼은 코스가 아니라 발이 정한다.
 *   코스에서 도출할 수 있는 건 거리에 따른 쿠션량까지다. 그 이상은 finder로 보낸다.
 */

const SHOE_BY_ID = new Map(SHOES.map((s) => [s.id, s]));

export default function CoursesPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <AffiliateNotice />

      <h1 className="mb-3 text-3xl font-bold text-gray-900">한강 러닝 코스 4곳</h1>
      <p className="mb-6 leading-relaxed text-gray-600">
        여의도·반포·뚝섬·잠실입니다. 거리는{" "}
        <strong className="text-gray-900">서울시 미래한강본부가 고시한 공원 길이</strong>를
        그대로 옮겼고, 각 코스마다 출처 링크와 확인 날짜를 달았습니다.
      </p>

      <div className="mb-10 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
        <strong>미리 밝힙니다.</strong> 저희는 이 코스들을 직접 달려보고 쓴 글이 아닙니다.
        그래서 서울시 공식 자료에 있는 것만 적었고,{" "}
        <strong>구간별 거리와 노면 종류는 확인할 수 없어 쓰지 않았습니다.</strong> 정확한
        거리는 러닝 앱이나 시계가 재는 쪽이 맞습니다.
      </div>

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
        <p className="mt-3 text-xs leading-relaxed text-gray-500">
          여기서 &lsquo;공식 길이&rsquo;는 공원의 끝에서 끝까지입니다. 중간에서 돌아서면
          그만큼 짧아집니다. 러닝 앱들이 이 숫자를 &lsquo;코스 거리&rsquo;로 옮겨 적는 바람에
          같은 코스가 매체마다 다른 거리로 적혀 있습니다.
        </p>
      </section>

      {/* ── 코스별 ── */}
      {HANGANG_COURSES.map((c) => {
        const shoes = c.shoeIds.map((id) => SHOE_BY_ID.get(id)).filter(Boolean);
        return (
          <section key={c.slug} id={c.slug} className="mb-14 scroll-mt-20">
            <h2 className="mb-1 text-2xl font-bold text-gray-900">{c.name}</h2>
            <p className="mb-4 text-sm text-gray-500">
              {c.district} · 공식 길이 {c.lengthKm}km · {c.zone}
            </p>

            <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-4">
              <CourseFigure name={c.slug} bridges={c.bridges} lengthKm={c.lengthKm} />
            </div>

            <p className="mb-5 leading-relaxed text-gray-700">{c.fit}</p>

            <div className="mb-5 grid gap-4 sm:grid-cols-2">
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

            {/* ── 신발 2개 ── */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
              <h3 className="mb-1 text-sm font-semibold text-emerald-900">
                이 코스 길이에 맞는 러닝화
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-emerald-800">{c.shoeReason}</p>

              <div className="grid gap-3 sm:grid-cols-2">
                {shoes.map((s) => (
                  <div key={s!.id} className="rounded-xl border border-emerald-100 bg-white p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <Image
                        src={s!.imageUrl}
                        alt={`${s!.brand} ${s!.model}`}
                        width={64}
                        height={64}
                        className="h-16 w-16 shrink-0 object-contain"
                        unoptimized
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {s!.brand} {s!.model}
                        </p>
                        <p className="text-xs text-gray-500">
                          쿠셔닝 {s!.cushioning}/5 · {s!.weightGramsM9}g ·{" "}
                          {s!.priceKrw.toLocaleString()}원
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {s!.buyLinks.slice(0, 2).map((l) => (
                        <a
                          key={l.url}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow sponsored"
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
                        >
                          {l.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs leading-relaxed text-emerald-900/70">
                코스로 고를 수 있는 건 <strong>거리에 따른 쿠션량</strong>까지입니다.
                발볼·평발 여부·체중은 코스가 아니라 발이 정합니다 —{" "}
                <Link href="/shoe-finder" className="underline hover:text-emerald-900">
                  내 체형으로 다시 고르기
                </Link>
              </p>
            </div>

            <p className="mt-3 text-xs text-gray-400">
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
          </section>
        );
      })}

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
    </main>
  );
}
