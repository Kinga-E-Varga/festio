import { isOn, text } from "@/modular/content";
import { Mark, markParts } from "@/modular/Mark";
import { AMPERSAND_SIZE, NAMES, PHOTO_DARK, TONE_TEXT } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * The Date block cover's names over `NAMES_SIZE`: on a phone (a page under
 * 448px) 40px, so they and their second line take less of the screen;
 * beside the picture (`cover-side`) 56px, 64px from 1024px, 80px from
 * 1280px, 96px from 1440px. Also the size its sprig behind the names is
 * measured in.
 */
export const DATE_BLOCK_NAMES_SIZE =
  "@max-md/page:text-[40px]! cover-side:text-[56px]! cover-side:@5xl/page:text-[64px]! cover-side:@7xl/page:text-[80px]! cover-side:@[90rem]/page:text-[96px]!";

/** The names' room above and below. */
const NAMES_SPACE = "mt-6 mb-3 @3xl:mt-7";

/**
 * Each cover's names, their middle part and their own second line.
 * Date block's in the secondary, the middle part too, the second line in
 * the accent; side by side with the picture they grow with the page, as
 * the picture does, whatever the words' column (`DATE_BLOCK_NAMES_SIZE`).
 * Full centred's all in its dark colour (`PHOTO_DARK`).
 */
const LOOKS = {
  dateBlock: {
    names: `${NAMES} ${NAMES_SPACE} ${TONE_TEXT.secondary}! ${DATE_BLOCK_NAMES_SIZE}`,
    middle: `${AMPERSAND_SIZE} ${TONE_TEXT.secondary}`,
    secondLine: TONE_TEXT.accent,
  },
  photoDark: {
    names: `${NAMES} ${NAMES_SPACE} ${PHOTO_DARK}`,
    middle: `${AMPERSAND_SIZE} ${PHOTO_DARK}`,
    secondLine: "",
  },
};

/**
 * A cover's names as the page's one `h1`, one line of words that wraps
 * where it runs out of room, and their second line under them; with Use
 * names off, the two plain lines in their place. Nothing when all are
 * empty.
 */
export function CoverNames({
  values,
  look,
}: {
  values: VariantProps["values"];
  look: keyof typeof LOOKS;
}) {
  const named = isOn(values, "names");
  const names = named ? markParts(values, "names", LOOKS[look].middle) : [];
  const first = named ? "" : text(values, "firstLine");
  const second = text(values, named ? "secondLine" : "nextLine");
  if (names.length === 0 && !first && !second) return null;

  return (
    /* Lines a little taller than `NAMES`', so descenders clear the next line. */
    <h1 className={`${LOOKS[look].names} max-w-4xl leading-[1.1]!`}>
      {names.length > 0 ? (
        <Mark parts={names} />
      ) : first ? (
        <span className="block">{first}</span>
      ) : null}
      {second ? (
        <span className={`block ${named ? LOOKS[look].secondLine : ""}`}>
          {second}
        </span>
      ) : null}
    </h1>
  );
}
