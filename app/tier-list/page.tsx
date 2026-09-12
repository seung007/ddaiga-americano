import type { Metadata } from "next";
import Link from "next/link";
import { SHOES } from "@/lib/shoes/data";
import type { Shoe, ShoeUse } from "@/lib/shoes/types";
import FinderCta from "@/components/FinderCta";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import ShoeJsonLd, { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import TableOfContents from "@/components/TableOfContents";

/**
 * 러닝화 계급도 — **순서는 있다. 다만 품질 순서가 아니라 러너 수준 순서다.**
 *
 * ─────────────────────────────────────────────────────────────
 * 왜 이 형태인가 (2026-09-12, 사용자 지적으로 한 번 갈아엎음)
 *
 * 첫 판은 **순서 없는 4칸 분류**였다. 근거는 이랬다 —
 * *"홈이 '추천 순서는 광고비로 안 바뀐다'를 내걸었으니 서열을 매기면 충돌한다."*
 *
 * 사용자 지적: *"그걸 빼면 되잖아. 넣어서 더 도움이 되게 만들면 되는 거 아니야?"*
 *
 * 그 지적이 맞았고, 덕분에 **내가 더 크게 틀린 걸 봤다.**
 * 두 가지를 섞어 놨었다:
 *   ① 중립성 약속 — 사용자 것이고 뺄 수 있다
 *   ② 서열 매길 데이터가 없다 — 약속을 빼도 성능 시험 데이터는 안 생긴다
 * ①을 근거로 ②까지 못 한다고 말했는데, **①은 진짜 이유가 아니었다.**
 *
 * 그리고 결정적인 것 — **한국 계급도는 애초에 품질 서열이 아니다.**
 * "마실용 → 동네대표 → 국가대표 → 월드클래스"는 *어느 신발이 더 좋냐*가 아니라
 * **누가 신는 거냐**다. 그 축은 데이터가 있다. `lib/shoes/recommend.ts` 271~284행이
 * 이미 갖고 있고 2026-08-27 감사까지 끝났다:
 *
 *   · 초심자 프로필에 카본화 **−12점**. 그 근거가 *"논문이 아니라 레이싱화의
 *     낮은 안정성·짧은 수명·높은 가격이라는 실무적 이유"* 라고 적혀 있다.
 *   · 숙련 프로필에 tempo·racing **+3점**.
 *
 * 그래서 **약속을 빼지 않고 순서를 매긴다.** 축을 바꾸면 둘 다 성립한다.
 *
 * ─────────────────────────────────────────────────────────────
 * 그리고 이 페이지만 줄 수 있는 것 — **넘어가는 시점**
 *
 * 경쟁사 계급도는 신발을 줄 세우고 끝난다. 읽는 사람의 실제 질문은
 * *"나는 지금 어디고, 언제 다음 칸으로 가냐"* 인데 그 답이 없다.
 * 각 칸에 **누구에게 맞는지 · 언제 넘어가는지**를 붙인다.
 * 그건 `recommend.ts` 가 이미 프로필별로 계산하던 것이라 지어낼 필요가 없다.
 */

const PAGE_URL = "https://ddaiga-americano.vercel.app/tier-list";

export const metadata: Metadata = {
  title: "러닝화 계급도 2026 — 입문부터 레이싱까지, 기준 공개 | 뛰다가 아메리카노",
  description:
    "러닝화를 러너 수준 순서로 정리했습니다. 어느 신발이 더 좋은지가 아니라 지금 나에게 맞는 칸이 어디인지, 언제 다음 칸으로 넘어가는지까지 기준과 함께 공개합니다.",
  alternates: { canonical: "/tier-list" },
};

const POOL = SHOES.filter((s) => s.gender !== "female");
const has = (s: Shoe, u: ShoeUse) => s.uses.includes(u);
/** 데일리 "전용" — 장거리·템포·레이싱이 섞이면 그쪽 칸이 맞다. */
const daily = (s: Shoe) =>
  has(s, "daily") && !has(s, "long") && !has(s, "tempo") && !has(s, "racing");

/**
 * 사다리 — **위에서 아래로 갈수록 훈련량이 쌓인 러너용**이다.
 * 첫 칸이 나쁜 신발이라는 뜻이 아니다. 대부분의 사람은 1~2칸에서 평생 달린다.
 *
 * `match` 는 위에서부터 **먼저 걸리는 칸**에 넣는다(배타적).
 */
type Rung = {
  id: string;
  label: string;
  forWho: string;
  moveOn: string;
  rule: string;
  match: (s: Shoe) => boolean;
};

const RUNGS: Rung[] = [
  {
    id: "first",
    label: "첫 신발",
    forWho: "이제 막 시작했거나, 아직 신발에 큰돈을 쓰기 망설여지는 사람",
    moveOn:
      "주 3회 이상 꾸준해지고 한 번에 30분 넘게 뛰기 시작하면 다음 칸이 편해집니다. 안 넘어가도 됩니다.",
    rule: "카본 없음 + 데일리 전용 + 17만원 이하",
    match: (s) => !s.hasCarbon && daily(s) && s.priceKrw <= 170_000,
  },
  {
    id: "everyday",
    label: "매일 신는 날",
    forWho: "주 3회 이상 30~60분씩 꾸준히 달리는 사람. 러닝화 한 켤레로 다 하는 단계",
    moveOn: "한 번에 10km를 넘기기 시작하면 쿠션이 두꺼운 다음 칸이 다리를 덜 힘들게 합니다.",
    rule: "카본 없음 + 데일리 전용 (가격 제한 없음)",
    match: (s) => !s.hasCarbon && daily(s),
  },
  {
    id: "long",
    label: "오래 뛰는 날",
    forWho: "10km 이상, 하프 이상을 준비하는 사람. 가장 많은 신발이 여기 있습니다",
    moveOn:
      "훈련을 강도별로 나누기 시작하면(빠른 날 / 느린 날) 다음 칸을 한 켤레 더 두게 됩니다.",
    rule: "카본 없음 + 장거리 용도",
    match: (s) => !s.hasCarbon && has(s, "long"),
  },
  {
    id: "fast",
    label: "빠르게 뛰는 날",
    forWho: "인터벌·템포 주를 따로 하는 사람. 빠른 날에만 신고 평소엔 앞 칸을 신습니다",
    moveOn: "대회에서 기록을 노리게 되면 마지막 칸을 검토할 수 있습니다.",
    rule: "카본 없음 + 템포 용도",
    match: (s) => !s.hasCarbon && has(s, "tempo"),
  },
  {
    id: "race",
    label: "대회 날",
    forWho: "대회 기록이 목표이고 훈련량이 쌓인 사람",
    moveOn:
      "여기가 끝입니다. 다만 이 칸은 훈련용이 아니라 대회용입니다 — 수명이 짧아 평소에 신으면 금방 죽습니다.",
    rule: "카본 있음 또는 레이싱 용도",
    match: (s) => s.hasCarbon || has(s, "racing"),
  },
];

const CLASSIFIED = new Set<string>();
const LADDER = RUNGS.map((r) => {
  const shoes = POOL.filter((s) => !CLASSIFIED.has(s.id) && r.match(s)).sort(
    (a, b) => a.priceKrw - b.priceKrw
  );
  shoes.forEach((s) => CLASSIFIED.add(s.id));
  return { ...r, shoes };
});
const UNCLASSIFIED = POOL.filter((s) => !CLASSIFIED.has(s.id));

const won = (n: number) => n.toLocaleString() + "원";
const range = (ns: number[]) =>
  ns.length ? `${won(Math.min(...ns))} ~ ${won(Math.max(...ns))}` : "—";

const STABILITY_KO: Record<string, string> = {
  neutral: "중립",
  stability: "안정화",
  motion_control: "모션컨트롤",
};

const FAQ: FaqItem[] = [
  {
    q: "계급도에서 아래 칸이 더 좋은 신발인가요?",
    a: "아닙니다. 이 순서는 품질이 아니라 훈련량입니다. 마지막 칸의 레이싱화는 초보에게 오히려 가장 나쁜 선택일 수 있습니다 — 밑창이 얇고 불안정한 데다 수명이 짧고 36만원대입니다. 대부분의 사람은 앞 두세 칸에서 평생 달립니다.",
  },
  {
    q: "순서를 무슨 기준으로 매겼나요?",
    a: "각 신발에 기록해 둔 용도(daily · long · tempo · racing)와 카본 플레이트 유무, 그리고 가격입니다. 각 칸 아래에 규칙을 그대로 적어 뒀고, 신발이 추가되면 자동으로 분류됩니다. 실험실 측정값(에너지 반환·경도 등)은 쓰지 않았습니다. 그런 측정을 하는 해외 리뷰 사이트가 있지만 저희가 직접 잰 값이 아니라, 남의 측정을 옮겨 적는 대신 공개 스펙으로만 나눴습니다.",
  },
  {
    q: "내가 지금 몇 칸인지 어떻게 아나요?",
    a: "각 칸에 '이런 사람에게 맞습니다'와 '언제 다음 칸으로 넘어갑니다'를 적어 뒀습니다. 다만 칸은 참고이고, 같은 칸 안에서도 발볼·체중·부상 이력에 따라 맞는 신발이 다릅니다. 조건을 넣으면 계산해 드립니다.",
  },
  {
    q: "브랜드 순위는 없나요?",
    a: "브랜드는 분류에 쓰지 않았습니다. 브랜드별 스펙 차이가 궁금하면 브랜드 비교 페이지를 보세요. 그리고 이 사이트의 추천 순서는 광고비나 제휴로 바뀌지 않습니다 — 추천 로직에 제휴 관련 가중치가 아예 없습니다.",
  },
];

function Row({ s }: { s: Shoe }) {
  return (
    <li className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 py-1.5 text-sm">
      <span className={s.successor ? "text-gray-500" : "font-medium text-gray-900"}>
        {s.brand} {s.model}
      </span>
      <span className="text-xs text-gray-500">
        {won(s.priceKrw)} · {s.weightGramsM9}g · 드롭 {s.heelDropMm}mm · 쿠션 {s.cushioning}/5
        {s.stability !== "neutral" ? ` · ${STABILITY_KO[s.stability]}` : ""}
        {s.hasCarbon ? " · 카본" : ""}
      </span>
      {s.successor && <span className="text-xs text-amber-700">후속 {s.successor}</span>}
    </li>
  );
}

export default function TierListPage() {
  return (
    <>
      <ShoeJsonLd shoes={POOL} name="러닝화 수준별 계급도" url={PAGE_URL} />
      <BreadcrumbJsonLd trail={[["러닝화 계급도", "/tier-list"]]} />
      <main className="mx-auto max-w-3xl px-6 py-12 text-gray-800">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">러닝화 계급도</h1>
        <p className="mt-3 leading-relaxed text-gray-600">
          입문부터 레이싱까지 <strong>러너 수준 순서</strong>로 정리했습니다. 각 칸에{" "}
          <strong>누구에게 맞는지</strong>와 <strong>언제 다음 칸으로 넘어가는지</strong>를
          함께 적었습니다.
        </p>

        {/* 기대와 다른 지점을 첫 화면에 못 박는다. */}
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-semibold text-amber-900">순서의 뜻</p>
          <p className="mt-2 leading-relaxed text-amber-900">
            <strong>아래 칸이 더 좋은 신발이라는 뜻이 아닙니다.</strong> 이 순서는 품질이
            아니라 <strong>훈련량</strong>입니다. 마지막 칸의 레이싱화는 초보에게 오히려 가장
            나쁜 선택일 수 있습니다 — 얇고 불안정한 데다 수명이 짧고 36만원대입니다.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-amber-800">
            <strong>대부분의 사람은 앞 두세 칸에서 평생 달립니다.</strong> 위로 올라가는 게
            목표가 아닙니다.
          </p>
        </div>

        <TableOfContents
          items={[
            ...LADDER.map((r) => ({ id: r.id, label: `${r.label} (${r.shoes.length}개)` })),
            { id: "how", label: "어떻게 나눴나" },
          ]}
          title="이 페이지에서"
        />

        {LADDER.map((r) => (
          <section key={r.id}>
            <h2 id={r.id} className="mt-10 text-xl font-bold text-gray-900">
              {r.label}{" "}
              <span className="text-sm font-normal text-gray-500">
                {r.shoes.length}개 · {range(r.shoes.map((s) => s.priceKrw))}
              </span>
            </h2>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <p className="text-xs font-bold text-emerald-900">이런 사람에게</p>
                <p className="mt-1 text-sm leading-relaxed text-emerald-900">{r.forWho}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-xs font-bold text-gray-700">다음 칸으로 넘어갈 때</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-700">{r.moveOn}</p>
              </div>
            </div>

            <ul className="mt-3 divide-y divide-gray-100 rounded-xl border border-gray-200 px-4 py-1">
              {r.shoes.map((s) => (
                <Row key={s.id} s={s} />
              ))}
            </ul>
            <p className="mt-1.5 text-xs text-gray-400">
              분류 규칙: {r.rule} · 칸 안은 가격 오름차순(서열 아님)
            </p>
          </section>
        ))}

        {UNCLASSIFIED.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold text-gray-900">분류 안 된 {UNCLASSIFIED.length}개</h2>
            <p className="mt-1 text-sm text-gray-600">
              용도 값이 비어 있어 위 규칙에 안 걸린 신발입니다. <strong>숨기지 않고 적습니다</strong> —
              분류가 전부를 덮는 것처럼 보이면 그것도 틀린 정보입니다.
            </p>
            <ul className="mt-3 divide-y divide-gray-100 rounded-xl border border-gray-200 px-4 py-1">
              {UNCLASSIFIED.map((s) => (
                <Row key={s.id} s={s} />
              ))}
            </ul>
          </section>
        )}

        <h2 id="how" className="mt-10 text-xl font-bold text-gray-900">어떻게 나눴나</h2>
        <p className="mt-3 leading-relaxed text-gray-700">
          각 신발에 기록해 둔 <strong>용도 값</strong>과 <strong>카본 플레이트 유무</strong>로
          나눴습니다. 규칙은 각 칸 아래에 그대로 적혀 있고, 신발이 추가되면 자동으로
          분류됩니다. <strong>사람이 손으로 순위를 옮기지 않습니다.</strong>
        </p>
        <p className="mt-3 leading-relaxed text-gray-700">
          「이런 사람에게」와 「넘어갈 때」는 이 사이트의 추천 로직이 쓰는 기준과 같습니다.
          예를 들어 초심자 프로필에서 카본화 점수를 깎는데, 그 근거는{" "}
          <strong>논문이 아니라 낮은 안정성·짧은 수명·높은 가격</strong>이라는 실무적 이유이고
          그렇게 표시해 뒀습니다.
        </p>

        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm leading-relaxed text-gray-700">
          <p className="font-semibold text-gray-900">이 페이지가 말하지 않는 것</p>
          <ul className="mt-2 space-y-1.5">
            <li>
              · 어느 신발이 <strong>성능이 더 좋은지</strong> — <strong>저희가 직접 잰 값이
              없습니다.</strong> 에너지 반환·중창 경도를 실험실에서 재는 해외 리뷰 사이트가
              있지만, 그건 그쪽의 측정이지 저희 것이 아닙니다. 옮겨 적고 저희 근거인 척하지
              않습니다
            </li>
            <li>· 브랜드 순위 — 브랜드는 분류에 쓰지 않았습니다</li>
            <li>
              · <strong>칸 안의 가격 순서는 서열이 아닙니다.</strong> 읽기 편하려고
              오름차순으로 뒀을 뿐입니다
            </li>
            <li>· 후속 모델이 나온 신발은 표시했습니다. 나쁜 게 아니라 보통 할인이 붙습니다</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link href="/compare/hoka-vs-brooks" className="text-emerald-600 hover:underline">
            호카 vs 브룩스 스펙 집계 →
          </Link>
          <Link href="/injury/carbon-plate" className="text-emerald-600 hover:underline">
            카본화 근거 보기 →
          </Link>
          <Link href="/injury/flat-feet" className="text-emerald-600 hover:underline">
            평발이면 안정화? →
          </Link>
        </div>

        <div className="mt-10">
          <FaqSection items={FAQ} />
        </div>

        <div className="mt-10">
          <FinderCta
            from="tier-list"
            headline="칸을 알았으면 그 안에서 내 것을 고르세요"
            sub="같은 칸에서도 발볼·체중·부상 이력에 따라 맞는 신발이 다릅니다."
          />
        </div>
      </main>
    </>
  );
}
