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

export default function YoutubeSection({ links }: Props) {
  const regular = links.filter((l) => !isShorts(l.url));
  const shorts = links.filter((l) => isShorts(l.url));

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-2">관련 유튜브 영상</h2>
      <p className="text-sm text-gray-500 mb-4">
        실제 영상 링크입니다. 광고·협찬 관계 없습니다.
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
                {link.channel && (
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
