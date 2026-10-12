import Link from "next/link";
import { SHOES } from "@/lib/shoes/data";

/**
 * 와이드(2E·4E) 옵션이 있는 러닝화 — 신발 원장(lib/shoes/data.ts)에서 바로 뽑는다 (2026-10-12)
 *
 * 왜: wide-foot 은 방문 페이지 2위(GA4 28일 30세션)인데, 글을 읽은 뒤 「그래서 어떤 신발에 와이드가 있나」로
 * 가는 길이 신발 찾기 하나뿐이었다. 그리고 원래 있던 손으로 쓴 브랜드 표가 **원장과 어긋났다** —
 * 「On: 와이드 없음」(원장: 8개 중 2E 5개), 「Hoka: 4E 없음」(원장: Clifton 10·Bondi 9 에 4E),
 * 「Nike: 페가수스 4E」(원장: 페가수스는 4E 목록에 없음). 표를 원장에서 계산하게 바꿨다.
 *
 * 한계: widthOptions 의 출처는 신발마다 sourceUrl(RunRepeat)이다. **국내 정식 판매처에 그 폭이 들어오는지는 별개**라
 * 화면에 적는다.
 */

type Row = { brand: string; total: number; e2: typeof SHOES; e4: typeof SHOES };

function rows(): Row[] {
  const m = new Map<string, Row>();
  for (const s of SHOES) {
    const r = m.get(s.brand) ?? { brand: s.brand, total: 0, e2: [], e4: [] };
    r.total++;
    if (s.widthOptions.includes("2E")) r.e2.push(s);
    if (s.widthOptions.includes("4E")) r.e4.push(s);
    m.set(s.brand, r);
  }
  return [...m.values()].sort((a, b) => b.e4.length - a.e4.length || b.e2.length - a.e2.length);
}

/** FAQ 처럼 문장이 필요한 곳에서 쓴다 — 숫자를 손으로 다시 적지 않게 */
export function wideSummary(): string {
  const r = rows();
  const top4 = r.filter((x) => x.e4.length > 0).map((x) => `${x.brand} ${x.e4.length}개`);
  const no4 = r.filter((x) => x.e4.length === 0 && x.total >= 3).map((x) => x.brand);
  return `이 사이트에 등록된 ${SHOES.length}개 모델 기준으로 4E 옵션이 있는 모델은 ${top4.join(", ")}입니다.${
    no4.length ? ` ${no4.join("·")}는 등록 모델 중 4E가 없고 2E까지입니다.` : ""
  } 폭 옵션은 해외 출시 기준일 수 있어, 국내 판매처에 그 폭이 들어오는지는 구매 전에 확인하세요.`;
}

export default function WideShoeList() {
  const r = rows();
  const all4 = r.flatMap((x) => x.e4);
  return (
    <section className="mb-8">
      <h2 className="mb-2 text-xl font-bold text-gray-900">와이드 옵션이 있는 러닝화</h2>
      <p className="mb-4 text-sm leading-relaxed text-gray-600">
        이 사이트에 등록된 {SHOES.length}개 모델의 폭 옵션을 브랜드별로 셌습니다. 숫자는 신발 목록에서 바로 계산하므로 목록이 바뀌면 같이 바뀝니다.
      </p>
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">브랜드</th>
              <th className="px-2 py-2 text-right font-semibold">등록 모델</th>
              <th className="px-2 py-2 text-right font-semibold">2E 있음</th>
              <th className="px-3 py-2 text-right font-semibold">4E 있음</th>
            </tr>
          </thead>
          <tbody>
            {r.map((x, i) => (
              <tr key={x.brand} className={i % 2 ? "bg-gray-50/60" : "bg-white"}>
                <td className="px-3 py-2 font-medium text-gray-900">{x.brand}</td>
                <td className="px-2 py-2 text-right tabular-nums text-gray-600">{x.total}</td>
                <td className="px-2 py-2 text-right tabular-nums text-gray-800">{x.e2.length}</td>
                <td className="px-3 py-2 text-right tabular-nums font-semibold text-gray-900">{x.e4.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <details className="mt-3 rounded-xl border border-gray-200 bg-white">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-800">4E 옵션이 있는 모델 {all4.length}개 보기</summary>
        <ul className="grid gap-1 px-4 pb-4 text-sm sm:grid-cols-2">
          {all4.map((s) => (
            <li key={s.id}>
              <Link href={`/shoes/${s.id}`} className="text-emerald-700 underline underline-offset-2">
                {s.brand} {s.model}
              </Link>
              <span className="ml-1 text-xs text-gray-400">{s.widthOptions.join("·")}</span>
            </li>
          ))}
        </ul>
      </details>

      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <Link href="/shoes?wide=1" className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 font-medium text-emerald-800">
          2E·4E 있는 신발만 전체 목록에서 보기 →
        </Link>
        <Link href="/tools/shoe-side" className="rounded-lg border border-gray-300 px-3 py-1.5 text-gray-700">
          고른 신발 두께 겹쳐 보기
        </Link>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-gray-400">
        폭 옵션 출처: 신발마다 상세 페이지의 「스펙 출처」(RunRepeat). 해외 출시 기준일 수 있어 국내 판매처에 그 폭이 들어오는지는 따로 확인하세요.
      </p>
    </section>
  );
}
