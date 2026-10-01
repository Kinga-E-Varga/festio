import { text } from "@/modular/content";
import { HEADING, PAD } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/** A dark band with a drawn record. The board's link to an RSVP song question waits for that question. */
export function Variant({ values }: VariantProps) {
  return (
    <div
      className={`flex flex-col items-center gap-10 bg-[var(--m11)] text-[color:var(--m1)] ${PAD} @3xl:flex-row @3xl:gap-20 @5xl:px-40`}
    >
      <svg
        viewBox="0 0 260 260"
        aria-hidden="true"
        className="size-[180px] shrink-0 @3xl:size-[260px]"
      >
        <circle
          cx="130"
          cy="130"
          r="128"
          strokeWidth="2"
          className="fill-[var(--m12)] stroke-[var(--m9)]"
        />
        {[104, 84, 64].map((radius) => (
          <circle
            key={radius}
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            strokeWidth="1.5"
            className="stroke-[var(--m11)]"
          />
        ))}
        <circle cx="130" cy="130" r="40" className="fill-[var(--m15)]" />
        <circle cx="130" cy="130" r="5" className="fill-[var(--m12)]" />
      </svg>
      <div className="flex flex-col gap-[18px] text-center @3xl:text-left">
        <p className="text-[12px] tracking-[0.24em] uppercase text-[color:var(--m6)]">
          {text(values, "kicker")}
        </p>
        <h2 className={`${HEADING} text-[30px] @3xl:text-[40px]`}>
          {text(values, "heading")}
        </h2>
        <p className="text-[16px] leading-[1.7] text-[color:var(--m4)]">
          {text(values, "body")}
        </p>
      </div>
    </div>
  );
}
