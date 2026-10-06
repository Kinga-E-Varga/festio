import { SectionHeading } from "@/modular/SectionHeading";
import { ON_ACCENT, PAD } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * An accent band with a drawn record. The disc, its grooves, the hole and the
 * shadow are mixed from the band's own colour toward black, so any palette
 * gets a dark disc that matches its band. The label is the secondary colour. The board's link to an RSVP song question waits for
 * that question.
 */
export function Variant({ values }: VariantProps) {
  return (
    <div
      className={`flex flex-col items-center gap-10 bg-[var(--m-accent)] text-[color:var(--m-accent-ink)] ${PAD} @3xl:flex-row @3xl:gap-20 @5xl:px-40`}
    >
      <svg
        viewBox="0 0 260 260"
        aria-hidden="true"
        className="size-[180px] shrink-0 drop-shadow-xl drop-shadow-(color:--record-shadow)/70 [--record-line:color-mix(in_oklab,var(--m-accent),black_50%)] [--record-shadow:color-mix(in_oklab,var(--m-accent),black_55%)] @3xl:size-[260px]"
      >
        <circle
          cx="130"
          cy="130"
          r="128"
          strokeWidth="2"
          className="fill-[color-mix(in_oklab,var(--m-accent),black_70%)] stroke-(--record-line)"
        />
        {[104, 84, 64].map((radius) => (
          <circle
            key={radius}
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            strokeWidth="1.5"
            className="stroke-(--record-line)"
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
          className="fill-[color-mix(in_oklab,var(--m-accent),black_30%)]"
        />
      </svg>
      <div className={`min-w-0 flex-1 ${ON_ACCENT}`}>
        <SectionHeading values={values} align="start" />
      </div>
    </div>
  );
}
