import { text } from "@/modular/content";
import { Mark, markParts } from "@/modular/Mark";
import {
  AMPERSAND,
  AMPERSAND_SIZE,
  DISPLAY,
  EYEBROW,
  GROUND,
  ITALIC_LINE,
  MUTED,
  PAD_X,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/** Three small diamonds in the muted ink, like the caption, the middle one filled. */
function Ornament() {
  const outline = "size-2.5 rotate-45 border-1 border-[var(--m-ink-muted)]";
  return (
    <div aria-hidden="true" className="mb-7 flex items-center gap-3">
      <span className={outline} />
      <span className="size-3 rotate-45 bg-[var(--m-ink-muted)]" />
      <span className={outline} />
    </div>
  );
}

interface TitleNamesProps extends VariantProps {
  /** The variant drawing it: the names' colour. */
  look: keyof typeof LOOKS;
}

/** The names' size, the same in every variant. */
const NAMES_SIZE =
  "text-[56px] @md:text-[64px] @3xl:text-[80px] @5xl:text-[96px]";

/**
 * Each variant's names and their middle part: in the accent with the middle
 * in the secondary, or all in the ink. Plain alone has the title line under
 * the names, set like them.
 */
const LOOKS = {
  colorful: {
    names: `${DISPLAY} ${NAMES_SIZE}`,
    middle: AMPERSAND,
    secondLine: false,
  },
  plain: {
    names: `${DISPLAY} ${NAMES_SIZE} text-[color:var(--m-ink)]!`,
    middle: AMPERSAND_SIZE,
    // The title line, in the names' ink.
    secondLine: true,
  },
};

/**
 * The names as the page's one `h1` — none when all three parts are empty —
 * between a small line and an italic caption, shared by the title's
 * variants, which differ only in the names' colour; the host's Decoration
 * puts diamonds above, or nothing.
 * No date link.
 */
export function TitleNames({ values, ground, look }: TitleNamesProps) {
  const names = markParts(values, "names", LOOKS[look].middle);
  const eyebrow = text(values, "eyebrow");
  const caption = text(values, "caption");
  const second = LOOKS[look].secondLine ? text(values, "secondLine") : "";

  return (
    <div
      className={`flex flex-col items-center justify-center ${GROUND[ground]} text-center ${PAD_X} py-16 @3xl:py-25`}
    >
      {text(values, "decoration") === "diamonds" ? <Ornament /> : null}
      {eyebrow ? (
        <p className={`${EYEBROW} text-[color:var(--m-secondary)]`}>
          {eyebrow}
        </p>
      ) : null}
      {names.length > 0 || second ? (
        <h1
          className={`${LOOKS[look].names} mt-6 mb-3 max-w-4xl @3xl:mt-7 tracking-[-0.03em]!`}
        >
          <Mark parts={names} />
          {second ? <span className="block">{second}</span> : null}
        </h1>
      ) : null}
      {caption ? (
        <p
          className={`${ITALIC_LINE} ${MUTED} mt-4 max-w-md @3xl:mt-5 @3xl:max-w-2xl`}
        >
          {caption}
        </p>
      ) : null}
    </div>
  );
}
