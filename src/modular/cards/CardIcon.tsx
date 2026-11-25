import { Icon, type IconName } from "@/modular/icons";
import type { ItemMark } from "@/modular/item-marks";
import {
  CARD_DISC,
  H4,
  MUTED,
  PAGE_SECONDARY,
  TIME_COLUMN,
  TONE_TEXT,
  TONES,
} from "@/modular/styles";

/** A card's icon: the glyph on its soft disc, in either accent. A 22px glyph on a 38px disc (`CARD_DISC`). */
export function CardIcon({
  name,
  tone,
  className = "",
}: {
  name: IconName | "check";
  tone: keyof typeof TONES;
  className?: string;
}) {
  return (
    <span className={`${CARD_DISC} ${TONES[tone]} ${className}`}>
      <Icon name={name} className="size-5.5" />
    </span>
  );
}

/**
 * A list item's mark on its disc (`itemMark`), in `tone`: the lists and
 * cards take turns, the 1st, 3rd… item in the secondary, the 2nd, 4th… in
 * the accent (`turnTone`); nothing without one. `accent`: on the accent,
 * always the palette's own secondary disc (`PAGE_SECONDARY`), not the
 * accent's ink: an accent disc would not show there.
 */
export function ItemIcon({
  mark,
  tone = "secondary",
  accent = false,
  className = "",
}: {
  mark: ItemMark;
  tone?: keyof typeof TONES;
  accent?: boolean;
  className?: string;
}) {
  return mark ? (
    <span
      className={`${CARD_DISC} ${accent ? `${TONES.secondary} ${PAGE_SECONDARY}` : TONES[tone]} ${className}`}
    >
      <MarkGlyph mark={mark} iconClass="size-5.5" />
    </span>
  ) : null;
}

/**
 * What a disc holds for `mark`: the icon at `iconClass`, or the number in
 * the item headings' face (`H4`, `numberClass` over it).
 */
export function MarkGlyph({
  mark,
  iconClass,
  numberClass = "",
}: {
  mark: NonNullable<ItemMark>;
  iconClass: string;
  numberClass?: string;
}) {
  return "icon" in mark ? (
    <Icon name={mark.icon} className={iconClass} />
  ) : (
    <span className={`${H4} ${numberClass}`}>{mark.number}</span>
  );
}

/**
 * An Icon & list row's mark, bare in the column a schedule has its times
 * in (`TIME_COLUMN`): the icon at 26px in the muted ink, or the number in
 * the accent;
 * nothing without one, the row then its text alone (`leadRow`).
 */
export function LeadMark({ mark }: { mark: ItemMark }) {
  if (!mark) return null;
  return (
    <span className={`${TIME_COLUMN} ${TONE_TEXT.accent}`}>
      {"icon" in mark ? (
        <Icon name={mark.icon} className={`block size-6.5 ${MUTED}`} />
      ) : (
        mark.number
      )}
    </span>
  );
}
