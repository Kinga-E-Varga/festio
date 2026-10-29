import { isOn, text } from "@/modular/content";
import {
  COLUMN,
  EYEBROW,
  H2_SMALL,
  MUTED,
  STICKER_TEXT,
  TEXT_CUT,
  TEXT_CUT_THICK,
} from "@/modular/styles";
import type { SectionValues } from "@/types/modular";

/**
 * The small text as a sticker: bold, a step over the eyebrow's semibold,
 * its outline thicker still, so it shows at its size.
 */
const SMALL_STICKER = `${TEXT_CUT} [--m-text-cut-scale:2.5] font-bold!`;

/** Whether there is anything to draw: the variants draw nothing without it. */
export function hasText(values: SectionValues): boolean {
  return Boolean(text(values, "largeText") || text(values, "smallText"));
}

/** The words' look as a sticker, for `LargeText` and `SmallText`. */
interface WordsProps {
  values: SectionValues;
  sticker?: boolean;
}

/** `LargeText` may take classes of its own: its line wrap. */
interface LargeProps extends WordsProps {
  className?: string;
}

/**
 * The large text in the heading face, a section heading a step smaller
 * (`H2_SMALL`), in the ink, centred, in italic unless its switch is off.
 * With `sticker`, as the title's stickers, medium (`STICKER_TEXT`), the
 * outline a little thicker (`TEXT_CUT_THICK`). Nothing when empty.
 */
export function LargeText({
  values,
  sticker = false,
  className = "",
}: LargeProps) {
  const large = text(values, "largeText");
  if (!large) return null;

  return (
    <p
      className={`${H2_SMALL} ${isOn(values, "italic") ? "italic" : ""} ${sticker ? `${STICKER_TEXT} ${TEXT_CUT_THICK}` : ""} text-center whitespace-pre-line text-[color:var(--m-ink)] ${className}`}
    >
      {large}
    </p>
  );
}

/**
 * The small text as a muted eyebrow, centred. With `sticker`, bold, its
 * outline thicker still (`SMALL_STICKER`). Nothing when empty.
 */
export function SmallText({ values, sticker = false }: WordsProps) {
  const small = text(values, "smallText");
  if (!small) return null;

  return (
    <p
      className={`${EYEBROW} ${MUTED} ${sticker ? SMALL_STICKER : ""} text-center`}
    >
      {small}
    </p>
  );
}

/** The space between the large text and the small text under it. */
export const WORDS_GAP = "gap-6";

/** The words most styles draw: the large text over the small one, centred, 960px at most (`COLUMN`), each only when it is there. */
export function TextBoxWords({ values, sticker = false }: WordsProps) {
  return (
    <div className={`${COLUMN} flex flex-col items-center ${WORDS_GAP}`}>
      <LargeText values={values} sticker={sticker} />
      <SmallText values={values} sticker={sticker} />
    </div>
  );
}
