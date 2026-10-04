import { AmpersandText } from "@/modular/AmpersandText";
import { hostNames, text } from "@/modular/content";
import {
  AMPERSAND,
  DISPLAY,
  EYEBROW,
  GROUND,
  H4,
  MUTED,
  PAD,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/** Three small diamonds in the muted ink, like the caption, the middle one filled. */
function Ornament() {
  const outline = "size-2 rotate-45 border-1 border-[var(--m-ink-muted)]";
  return (
    <div aria-hidden="true" className="mb-7 flex items-center gap-2.5">
      <span className={outline} />
      <span className="size-2.5 rotate-45 bg-[var(--m-ink-muted)]" />
      <span className={outline} />
    </div>
  );
}

/** The names as the page's one `h1`, between a small line and an italic caption. No date link. */
export function Variant({ values, basics, ground }: VariantProps) {
  const eyebrow = text(values, "eyebrow");
  const caption = text(values, "caption");

  return (
    <div
      className={`flex flex-col items-center justify-center ${GROUND[ground]} text-center ${PAD}`}
    >
      <Ornament />
      {eyebrow ? (
        <p className={`${EYEBROW} text-[color:var(--m-secondary)]`}>
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={`${DISPLAY} mt-4 mb-2 tracking-[-0.03em]! text-[56px] @md:text-[64px] @3xl:text-[80px] @5xl:text-[96px]`}
      >
        <AmpersandText text={hostNames(basics)} className={AMPERSAND} />
      </h1>
      {caption ? (
        <p className={`${H4} ${MUTED} mt-2.5 max-w-xs italic @3xl:max-w-xl`}>
          {caption}
        </p>
      ) : null}
    </div>
  );
}
