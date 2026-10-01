import { list, text } from "@/modular/content";
import { HEADING, PAD } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * Moments either side of a spine on a wide page; on a phone the spine moves
 * to the left edge and every moment sits to its right.
 */
export function Variant({ values }: VariantProps) {
  const items = list(values, "items");

  return (
    <div className={`flex flex-col gap-9 bg-[var(--m2)] ${PAD} @5xl:px-40`}>
      <h2
        className={`${HEADING} text-center text-[26px] text-[color:var(--m8)] @3xl:text-[34px]`}
      >
        {text(values, "heading")}
      </h2>
      <ol className="flex flex-col">
        {items.map((item, index) => {
          const left = index % 2 === 0;
          return (
            <li
              key={index}
              className="grid min-h-[106px] grid-cols-[28px_1fr] @3xl:grid-cols-[1fr_48px_1fr]"
            >
              <div className="flex flex-col items-center @3xl:col-start-2 @3xl:row-start-1">
                <span className="mt-2.5 size-3.5 rounded-full bg-[var(--m13)]" />
                {index < items.length - 1 ? (
                  <span className="w-px flex-1 bg-[var(--m6)]" />
                ) : null}
              </div>
              <div
                className={`flex flex-col gap-1 pb-6 pl-4 @3xl:row-start-1 ${left ? "@3xl:col-start-1 @3xl:pl-0 @3xl:pr-7 @3xl:text-right" : "@3xl:col-start-3 @3xl:pl-7"}`}
              >
                <span
                  className={`${HEADING} text-[22px] text-[color:var(--m13)]`}
                >
                  {item.time}
                </span>
                <span className="text-[17px] font-semibold text-[color:var(--m8)]">
                  {item.title}
                </span>
                <span className="text-[15px] text-[color:var(--m9)]">
                  {item.note}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
