import Link from "next/link";
import FinderCta from "@/components/FinderCta";
import InlineAsk from "@/components/InlineAsk";
import FaqSection from "@/components/FaqSection";
import ShareButtons from "@/components/ShareButtons";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/ShoeJsonLd";
import { Up } from "@/components/guide/Up";
import { Lead, P, H2, Summary, Todo, Evidence, References, Basis, Warn, Note } from "@/components/guide/Read";
import { articleDates } from "@/components/ArticleMeta";
import type { GuideArticle as Entry } from "@/lib/guide/articles";
import type { Block, Cite, GuideContent, Reference } from "@/lib/guide/content";
import { pageUrl } from "@/lib/site";

/**
 * 내용 파일 가이드의 공통 틀 (2026-11-07) — 손으로 쓴 가이드(예: app/injury/cooldown)와 같은 부품·같은 순서.
 *   제목 → 누가·언제(만든 방법 포함) → 첫 문단 → 한눈에 → 질문형 소제목마다 [답 → 본문·표·할 일·주의 → 근거(접힘)]
 *   → FAQ → 이어서 볼 글 → 참고 문헌(접힘) → 면책 → 질문 입력 → 추천기 → 공유
 * 안전 정보(Warn)와 단서(Note)는 접지 않는다(Read.tsx 규칙).
 */

/** **굵게** 와 [말](/내부경로) 만 해석한다. 바깥 링크는 본문에 두지 않는다(출처는 참고 문헌으로) */
function Inline({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((\/[^)\s]*)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<strong key={m.index}>{m[1]}</strong>);
    else
      parts.push(
        <Link key={m.index} href={m[3]} className="font-medium text-emerald-700 underline">
          {m[2]}
        </Link>,
      );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function Cites({ cite, refs }: { cite?: Cite; refs: Map<string, Reference> }) {
  if (!cite?.length) return null;
  return (
    <>
      {" "}
      {cite.map((id) => {
        const r = refs.get(id);
        if (!r) return null;
        return (
          // S(줄바꿈 금지)를 쓰지 않는다 — 「Silva Oliveira et al. (2024)」 처럼 긴 이름이 320px 화면을 넘었다(2026-11-09). 저자명 안에서는 끊지 않는다
          <span key={id} className="text-xs text-gray-400">
            (<span className="whitespace-nowrap">{r.authors}</span> <span className="whitespace-nowrap">({r.year}) <Up h={r.url} /></span>){" "}
          </span>
        );
      })}
    </>
  );
}

function BlockView({ b, refs }: { b: Block; refs: Map<string, Reference> }) {
  if ("p" in b)
    return (
      <P>
        <Inline text={b.p} />
        {b.basis && <Basis kind={b.basis} />}
        <Cites cite={b.cite} refs={refs} />
      </P>
    );
  if ("note" in b) return <Note><Inline text={b.note} /></Note>;
  if ("todo" in b)
    return (
      <Todo
        title={b.title}
        items={b.todo.map((it, i) => (
          <span key={i}>
            <Inline text={it.t} />
            {it.basis && <Basis kind={it.basis} />}
            <Cites cite={it.cite} refs={refs} />
          </span>
        ))}
      />
    );
  if ("warn" in b)
    return (
      <Warn title={b.warn.title}>
        <ul className="list-disc space-y-1 pl-5">
          {b.warn.items.map((t, i) => (
            <li key={i}><Inline text={t} /></li>
          ))}
        </ul>
      </Warn>
    );
  if ("table" in b) {
    // 칸마다 같은 출처가 붙으면 표가 출처로 덮인다 — 출처가 모두 같으면 표 아래 한 번만 적는다(검증은 여전히 칸마다)
    const cited = b.table.rows.flat().filter((c) => c.cite?.length);
    const keys = new Set(cited.map((c) => [...(c.cite ?? [])].sort().join(",")));
    const shared = cited.length > 1 && keys.size === 1 ? cited[0].cite : undefined;
    // 같은 이유로 「저희 제안」 배지가 칸마다 붙으면 표가 배지로 덮이고 휴대폰 폭을 넘는다(2026-11-09, 320px 에서 가로 넘침) — 모두 같으면 한 번만
    const based = b.table.rows.flat().filter((c) => c.basis);
    const sharedBasis = based.length > 1 && new Set(based.map((c) => c.basis)).size === 1 ? based[0].basis : undefined;
    return (
      <div className="mt-5 max-w-full overflow-x-auto [contain:inline-size]">
        <table className="w-full border-collapse text-base">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              {b.table.head.map((h, i) => (
                <th key={i} className="break-keep py-2 pr-3 font-semibold text-gray-900">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {b.table.rows.map((row, r) => (
              <tr key={r} className="border-b border-gray-100 last:border-0">
                {row.map((c, i) => (
                  <td
                    key={i}
                    className={`break-keep py-2 pr-3 align-top ${i === 0 ? "font-medium text-gray-900" : ""} ${c.t.length <= 10 ? "whitespace-nowrap" : ""}`}
                  >
                    <Inline text={c.t} />
                    {c.basis && !sharedBasis && <Basis kind={c.basis} />}
                    {!shared && <Cites cite={c.cite} refs={refs} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {shared && (
          <p className="mt-1.5 text-xs text-gray-400">
            출처
            <Cites cite={shared} refs={refs} />
          </p>
        )}
        {sharedBasis && (
          <p className="mt-1.5 text-xs text-gray-400">
            표의 값<Basis kind={sharedBasis} />
          </p>
        )}
      </div>
    );
  }
  if ("evidence" in b)
    return (
      <Evidence n={new Set(b.evidence.flatMap((e) => e.cite)).size} label={b.label}>
        {b.evidence.map((e, i) => (
          <p key={i}>
            <Inline text={e.t} />
            <Cites cite={e.cite} refs={refs} />
          </p>
        ))}
      </Evidence>
    );
  return null;
}

export default function GuideArticle({ slug, entry, c, related }: { slug: string; entry: Entry; c: GuideContent; related: Entry[] }) {
  const href = `/injury/${slug}`;
  const url = pageUrl(href);
  const refs = new Map(c.references.map((r) => [r.id, r]));
  const { updated, published } = articleDates(href);
  return (
    <>
      <ArticleJsonLd headline={entry.title} description={entry.desc} url={url} datePublished={entry.published} />
      <BreadcrumbJsonLd trail={[["러닝 가이드", "/injury"], [entry.tag, href]]} />
      <article className="mx-auto w-full min-w-0 max-w-2xl px-5 py-10 text-gray-800">
        <Link href="/injury" className="mb-5 inline-block text-sm text-emerald-600 hover:underline">
          ← 러닝 가이드
        </Link>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${entry.tagColor}`}>{entry.tag}</span>
          <span className="text-xs text-gray-400">{entry.readTime} 읽기</span>
          <span className="text-xs text-gray-400">· 협찬 없이 작성</span>
        </div>
        <h1 className="break-keep text-[28px] font-bold leading-tight text-gray-900">{entry.title}</h1>
        {/* ArticleMeta 와 같은 줄. 날짜는 원장에서만.
            만든 방법(「AI 초안 · 자동 검증」)은 화면에 내지 않는다 — 사이트 주인 결정(2026-11-09).
            c.made 는 그대로 남겨 검증기·check-content 가 읽는다(누가 언제 어떻게 대조했는지의 기록) */}
        <p className="mt-2 mb-4 text-xs text-gray-500">
          {updated && <>최종 수정 {updated}</>}
          {updated && published && published !== updated && <> · 처음 작성 {published}</>}
          {" · "}뛰다가 아메리카노
        </p>
        <Lead><Inline text={c.lead} /></Lead>
        <Summary
          items={c.summary.map((s, i) => (
            <span key={i}>
              <Inline text={s.t} />
              {s.basis && <Basis kind={s.basis} />}
            </span>
          ))}
        />

        {c.sections.map((s) => (
          <section key={s.id}>
            <h2 id={s.id} className={H2}>{s.q}</h2>
            <P>
              <Inline text={s.answer} />
              {s.basis && <Basis kind={s.basis} />}
              <Cites cite={s.cite} refs={refs} />
            </P>
            {s.blocks.map((b, i) => (
              <BlockView key={i} b={b} refs={refs} />
            ))}
          </section>
        ))}

        <FaqSection items={c.faq.map(({ q, a }) => ({ q, a }))} />

        {related.length > 0 && (
          <>
            <h2 id="next" className={H2}>다음에 읽을 것</h2>
            <div className="mt-4 space-y-2">
              {related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <p className="text-sm font-semibold text-gray-900">{r.title} →</p>
                  <p className="mt-1 break-keep text-sm text-gray-600">{r.desc}</p>
                </Link>
              ))}
            </div>
          </>
        )}

        <References
          n={c.references.length}
          note={`논문 ${c.references.length}건의 초록·공개 본문과 문장을 대조했습니다(${c.made.verified}). 추천 순서는 광고비로 바뀌지 않습니다.`}
        >
          <ul>
            {c.references.map((r) => (
              <li key={r.id}>
                <strong>{r.authors} ({r.year})</strong> — {r.note}
                {r.journal ? ` ${r.journal}.` : ""}{" "}
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
                  원문 ↗
                </a>
              </li>
            ))}
          </ul>
        </References>

        <p className="mt-6 text-xs text-gray-400">
          ※ 이 콘텐츠는 일반적인 정보 제공 목적이며, 의학적 진단이나 치료를 대체하지 않습니다. 통증이 지속되면 전문의 상담을
          권장합니다.
        </p>
        <InlineAsk from={slug} tag="기타" placeholder="예) 이 글에서 더 궁금한 점을 적어 주세요" />
        <FinderCta from={slug} headline="지금 발에 맞는 신발이 궁금하다면" sub="체형·발볼·부상 이력을 넣으면 맞는 신발을 추려드립니다." />
        <ShareButtons from={slug} title={entry.title} description={entry.desc} />
      </article>
    </>
  );
}
