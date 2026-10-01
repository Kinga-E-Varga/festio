import { list, text } from "@/modular/content";
import { MapsLink } from "@/modular/MapsLink";
import { HEADING, OUTLINE_LINK, PAD } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * The board's legend without the map: numbered places, each with its own
 * "Open in Maps". The first is the main venue, so it takes the accent.
 */
export function Variant({ values }: VariantProps) {
  return (
    <div className={`flex flex-col gap-8 bg-[var(--m1)] ${PAD}`}>
      <h2
        className={`${HEADING} text-[26px] text-[color:var(--m8)] @3xl:text-[30px]`}
      >
        {text(values, "heading")}
      </h2>
      <ol className="grid gap-x-10 border-t-1 border-[var(--m5)] @3xl:grid-cols-2">
        {list(values, "places").map((place, index) => (
          <li
            key={index}
            className="flex items-center gap-3.5 border-b-1 border-[var(--m5)] py-4"
          >
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-[color:var(--m1)] ${index === 0 ? "bg-[var(--m13)]" : "bg-[var(--m11)]"}`}
            >
              {index + 1}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[16px] font-semibold text-[color:var(--m8)]">
                {place.name}
              </span>
              <span className="text-[14px] text-[color:var(--m10)]">
                {place.note}
              </span>
            </div>
            {place.address ? (
              <MapsLink query={place.address} className={OUTLINE_LINK} />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
