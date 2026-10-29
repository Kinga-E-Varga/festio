import { SectionHeading } from "@/modular/SectionHeading";
import { ON_ACCENT, PAD } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Record } from "./Record";

/**
 * An accent band with the record (`Record`) beside the heading. The board's
 * link to an RSVP song question waits for that question.
 */
export function Variant({ values }: VariantProps) {
  return (
    <div
      className={`flex flex-col items-center gap-10 text-[color:var(--m-accent-ink)] ${PAD} @3xl:flex-row @3xl:gap-20 @5xl:px-40`}
    >
      <Record on="accent" />
      <div className={`min-w-0 flex-1 ${ON_ACCENT}`}>
        <SectionHeading values={values} align="start" />
      </div>
    </div>
  );
}
