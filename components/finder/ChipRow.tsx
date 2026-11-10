/**
 * 추천기 한 줄 선택 칩 (2026-11-10)
 *
 * 추천기를 8화면에서 4화면으로 줄이면서 한 화면에 질문 2~3개를 올렸다. 큰 카드 버튼을 그대로 쌓으면
 * 휴대폰에서 한 화면이 길어져 줄인 의미가 없으므로 칩 한 줄로 만든다. 누르는 영역은 44px(min-h-11) 이상.
 * 하나만 고르는지 여러 개 고르는지는 부르는 쪽이 `isActive`·`onPick` 으로 정한다.
 */
export type ChipOption<T extends string> = { value: T; label: string };

export default function ChipRow<T extends string>({
  title, hint, why, optional, options, isActive, onPick,
}: {
  title: string;
  hint?: string;
  /** 이 답을 추천에 어떻게 쓰는지 — 접어 둔다(2026-11-10 운영자 「투머치한 내용은 빼」, 정직하게 밝힐 내용이라 지우지는 않는다) */
  why?: string;
  /** 안 골라도 결과가 나오는 질문 */
  optional?: boolean;
  options: ChipOption<T>[];
  isActive: (v: T) => boolean;
  onPick: (v: T) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-semibold text-gray-800">
        {title}
        {optional && <span className="ml-1.5 text-xs font-normal text-gray-400">안 골라도 돼요</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = isActive(o.value);
          return (
            <button key={o.value} type="button" aria-pressed={on} onClick={() => onPick(o.value)}
              className={`min-h-11 rounded-full border px-4 text-sm transition-colors ${
                on
                  ? "border-emerald-500 bg-emerald-50 font-semibold text-emerald-800 ring-2 ring-emerald-100"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}>
              {o.label}
            </button>
          );
        })}
      </div>
      {hint && <p className="text-xs leading-relaxed text-gray-500">{hint}</p>}
      {why && <Why text={why} />}
    </fieldset>
  );
}

/** 「왜 물어보나요?」 접힘 — 추천기 화면 공통 */
export function Why({ text }: { text: string }) {
  return (
    <details className="text-xs text-gray-500">
      <summary className="flex min-h-11 cursor-pointer items-center underline">왜 물어보나요?</summary>
      <p className="pb-1 leading-relaxed">{text}</p>
    </details>
  );
}
