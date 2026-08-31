interface YoutubeLink {
  label: string;
  url: string;
  channel?: string;
}

interface Props {
  links: YoutubeLink[];
}

function isShorts(url: string) {
  return url.includes("/shorts/");
}

/**
 * 유튜브 검색 결과 페이지인가.
 *
 * 2026-08-31 이전에는 이 컴포넌트가 무조건 "실제 영상 링크입니다"라고 단언했다.
 * 그런데 실제로는 링크 166개가 `youtube.com/results?search_query=`(검색창)였고,
 * 그중 10개에는 지어낸 것으로 보이는 채널명까지 붙어 있었다.
 * 사이트가 거짓을 단언하고 있었던 셈이다. 이제 링크마다 구분해서 표시한다.
 */
function isSearch(url: string) {
  return url.includes("/results?");
}

export default function YoutubeSection({ links }: Props) {
  const regular = links.filter((l) => !isShorts(l.url));
  const shorts = links.filter((l) => isShorts(l.url));
  const allReal = links.every((l) => !isSearch(l.url));

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-2">관련 유튜브 영상</h2>
      <p className="text-sm text-gray-500 mb-4">
        {allReal
          ? "실제 영상 링크입니다. 이 채널들과 협찬 관계는 없습니다."
          : "아직 영상을 고르지 못한 항목은 유튜브 검색으로 연결됩니다. 어떤 채널과도 협찬 관계가 없습니다."}
      </p>

      {regular.length > 0 && (
        <div className="flex flex-col gap-3 mb-4">
          {regular.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 hover:bg-red-100 transition-colors"
            >
              <span className="text-red-600 text-lg shrink-0">&#9654;</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">{link.label}</p>
                {isSearch(link.url) ? (
                  <p className="text-xs text-gray-400 mt-0.5">유튜브 검색 결과로 이동</p>
                ) : link.channel && (
                  <p className="text-xs text-gray-500 mt-0.5">채널: {link.channel}</p>
                )}
              </div>
              <span className="ml-auto text-xs text-red-500 shrink-0">YouTube ↗</span>
            </a>
          ))}
        </div>
      )}

      {shorts.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2 mt-2">Shorts (1분 요약)</p>
          <div className="flex flex-col gap-2">
            {shorts.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5 hover:bg-rose-100 transition-colors"
              >
                <span className="text-rose-500 text-base shrink-0">&#9889;</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{link.label}</p>
                  {link.channel && (
                    <p className="text-xs text-gray-500 mt-0.5">채널: {link.channel}</p>
                  )}
                </div>
                <span className="ml-auto text-xs font-semibold text-rose-500 shrink-0 bg-rose-100 px-2 py-0.5 rounded-full">Shorts ↗</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
