import { isOn, text } from "@/modular/content";
import { Mark, markParts } from "@/modular/Mark";
import {
  AMPERSAND,
  AMPERSAND_INK,
  AMPERSAND_SIZE,
  EYEBROW,
  ITALIC_LINE,
  MUTED,
  NAMES,
  PAD_BOTTOM,
  PAD_TOP,
  PAD_X,
  SECTION_GROUND,
  STICKER_TEXT,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

interface TitleNamesProps extends VariantProps {
  /** The variant drawing it: the names' colour. */
  look: keyof typeof LOOKS;
}

/** The names' room between the small line over them and the caption. */
const NAMES_SPACE = "mt-6 mb-3 @3xl:mt-7";

/**
 * The stickers' names: the title's names (`NAMES`) in medium, cut out of a
 * pattern (`STICKER_TEXT`).
 */
const STICKER = `${NAMES} ${STICKER_TEXT}`;

/**
 * Each variant's names and their middle part: in the accent with the middle
 * in the secondary, or all in the ink. Colourful and Simple have the small
 * line over them as an eyebrow in the secondary, and the caption under.
 * All have the title line under the names, set like them. Sticker accent
 * is Simple in medium and all in the accent, the middle part too, cut out
 * of a pattern, with nothing but the names and that line (`null`: not
 * drawn), so no room around them either; Sticker colourful the same with
 * Colourful's secondary middle; Sticker simple all in the ink. With Use names off, `nextLine` is the second
 * line's colour: the secondary in the colourful ones, as the mark.
 */
const LOOKS = {
  colorful: {
    names: `${NAMES} ${NAMES_SPACE}`,
    middle: AMPERSAND,
    nextLine: AMPERSAND_INK,
    eyebrow: `${EYEBROW} text-[color:var(--m-secondary)]`,
    caption: MUTED,
  },
  plain: {
    names: `${NAMES} ${NAMES_SPACE} text-[color:var(--m-ink)]!`,
    middle: AMPERSAND_SIZE,
    nextLine: "",
    eyebrow: `${EYEBROW} text-[color:var(--m-secondary)]`,
    caption: MUTED,
  },
  sticker: {
    names: STICKER,
    middle: AMPERSAND_SIZE,
    nextLine: "",
    eyebrow: null,
    caption: null,
  },
  stickerInk: {
    names: `${STICKER} text-[color:var(--m-ink)]!`,
    middle: AMPERSAND_SIZE,
    nextLine: "",
    eyebrow: null,
    caption: null,
  },
  colorfulSticker: {
    names: STICKER,
    middle: AMPERSAND,
    nextLine: AMPERSAND_INK,
    eyebrow: null,
    caption: null,
  },
};

/**
 * The names as the page's one `h1` — none when all three parts are empty —
 * between a small line and an italic caption, shared by the title's
 * variants, which differ in the names' colour and what they leave out.
 * With all three parts, the middle one stays in the middle (see below). No
 * date link.
 */
export function TitleNames({ values, ground, look }: TitleNamesProps) {
  /* Use names off: two plain lines in place of the names and their line. */
  const named = isOn(values, "names");
  const names = named ? markParts(values, "names", LOOKS[look].middle) : [];
  const first = named ? "" : text(values, "firstLine");
  const eyebrow = LOOKS[look].eyebrow ? text(values, "eyebrow") : "";
  const caption = LOOKS[look].caption ? text(values, "caption") : "";
  const second = text(values, named ? "secondLine" : "nextLine");

  return (
    <div
      className={`flex flex-col items-center justify-center ${SECTION_GROUND[ground]} text-center ${PAD_X} ${PAD_TOP} ${PAD_BOTTOM}`}
    >
      {eyebrow ? <p className={LOOKS[look].eyebrow ?? ""}>{eyebrow}</p> : null}
      {names.length > 0 || first || second ? (
        /* Lines a little taller than `NAMES`', so descenders clear the next line. */
        <h1 className={`${LOOKS[look].names} max-w-4xl leading-[1.1]!`}>
          {names.length === 3 ? (
            /*
             * Two equal sides, so the middle part stays in the middle however
             * long either name; stacked, one to a line, on a narrow column,
             * where two names side by side would not fit.
             */
            <span className="grid justify-items-center @xl:grid-cols-[1fr_auto_1fr] @xl:items-baseline @xl:gap-x-[0.25em]">
              <span className="@xl:justify-self-end @xl:text-right">
                {names[0]}
              </span>
              {names[1]}
              <span className="@xl:justify-self-start @xl:text-left">
                {names[2]}
              </span>
            </span>
          ) : names.length > 0 ? (
            <Mark parts={names} />
          ) : first ? (
            <span className="block">{first}</span>
          ) : null}
          {second ? (
            <span className={`block ${named ? "" : LOOKS[look].nextLine}`}>
              {second}
            </span>
          ) : null}
        </h1>
      ) : null}
      {caption ? (
        <p
          className={`${ITALIC_LINE} ${LOOKS[look].caption ?? ""} mt-4 max-w-md whitespace-pre-line @3xl:mt-5 @3xl:max-w-2xl`}
        >
          {caption}
        </p>
      ) : null}
    </div>
  );
}
