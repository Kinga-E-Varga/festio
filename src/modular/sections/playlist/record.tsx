import { SectionHeading } from "@/modular/SectionHeading";
import { PAD } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * An accent band with a drawn record: the disc in the palette's darkest
 * green, the label orange, the hole a mixed darker green so it stands apart
 * from the label, and the shadow the soft dark green. The board's link to an
 * RSVP song question waits for that question.
 */
export function Variant({ values }: VariantProps) {
  return (
    <div
      className={`flex flex-col items-center gap-10 bg-[var(--m-accent)] text-[color:var(--m-accent-ink)] ${PAD} @3xl:flex-row @3xl:gap-20 @5xl:px-40`}
    >
      <svg
        viewBox="0 0 260 260"
        aria-hidden="true"
        className="size-[180px] shrink-0 drop-shadow-xl drop-shadow-(color:--m-accent-soft)/70 @3xl:size-[260px]"
      >
        <circle
          cx="130"
          cy="130"
          r="128"
          strokeWidth="2"
          className="fill-[var(--m-accent-ink)] stroke-[var(--m-line)]"
        />
        {[104, 84, 64].map((radius) => (
          <circle
            key={radius}
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            strokeWidth="1.5"
            className="stroke-[var(--m-line)]"
          />
        ))}
        <circle
          cx="130"
          cy="130"
          r="40"
          className="fill-[var(--m-secondary)]"
        />
        <circle
          cx="130"
          cy="130"
          r="5"
          className="fill-[color-mix(in_oklab,var(--m-accent)_60%,var(--m-accent-ink))]"
        />
      </svg>
      <div className="min-w-0 flex-1">
        <SectionHeading values={values} align="start" tone="accent" />
      </div>
    </div>
  );
}
