import { hostNames, text } from "@/modular/content";
import { BODY, HEADING, PAD } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/** Statement on the left, the hosts' own words on the right, signed. One column on a phone. */
export function Variant({ values, basics }: VariantProps) {
  return (
    <div
      className={`grid items-center gap-10 bg-[var(--m1)] ${PAD} @3xl:grid-cols-[5fr_6fr] @3xl:gap-20 @5xl:px-[120px]`}
    >
      <h2
        className={`${HEADING} text-[28px] leading-[1.35] text-[color:var(--m8)] @3xl:text-[42px]`}
      >
        {text(values, "heading")}
      </h2>
      <div className="flex flex-col gap-5 border-[var(--m5)] @3xl:border-l-1 @3xl:pl-12">
        <p
          className={`${BODY} whitespace-pre-line @3xl:text-[17px] @3xl:leading-[1.8]`}
        >
          {text(values, "body")}
        </p>
        <p className={`${HEADING} text-[20px] italic text-[color:var(--m13)]`}>
          — {hostNames(basics)}
        </p>
      </div>
    </div>
  );
}
