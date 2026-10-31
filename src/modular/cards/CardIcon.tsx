import { Icon, isIconName, type IconName } from "@/modular/icons";
import { CARD_DISC, PAGE_SECONDARY, TONES } from "@/modular/styles";

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
 * A list item's own icon on its disc, every item in the secondary; nothing
 * without one. `accent`: on the accent, the palette's own secondary disc
 * (`PAGE_SECONDARY`), not the accent's ink.
 */
export function ItemIcon({
  name,
  accent = false,
  className = "",
}: {
  name: string | undefined;
  accent?: boolean;
  className?: string;
}) {
  return isIconName(name) ? (
    <CardIcon
      name={name}
      tone="secondary"
      className={`${accent ? PAGE_SECONDARY : ""} ${className}`}
    />
  ) : null;
}
