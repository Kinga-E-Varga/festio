import { list, longDate, weekday } from "@/modular/content";
import { HEADING, PAD } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/** The day, then one card per part of it — one to four, wrapping to fit. No calendar buttons in v1. */
export function Variant({ values, basics, language }: VariantProps) {
  return (
    <div
      className={`flex flex-col items-center gap-11 bg-[var(--m11)] text-[color:var(--m1)] ${PAD} @5xl:px-[120px]`}
    >
      <div className="flex flex-col items-center gap-2.5 text-center">
        <p className="text-[12px] tracking-[0.3em] uppercase text-[color:var(--m6)]">
          {weekday(basics.date, language)}
        </p>
        <p className={`${HEADING} text-[36px] @3xl:text-[52px]`}>
          {longDate(basics.date, language)}
        </p>
      </div>
      <ul className="grid w-full gap-6 @3xl:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        {list(values, "moments").map((moment, index) => (
          <li
            key={index}
            className="flex flex-col gap-2 border-1 border-[var(--m10)] p-7"
          >
            <span className={`${HEADING} text-[36px] text-[color:var(--m14)]`}>
              {moment.time}
            </span>
            <span className="text-[17px] font-semibold">{moment.title}</span>
            <span className="text-[14px] text-[color:var(--m6)]">
              {moment.place}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
