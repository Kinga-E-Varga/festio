import { Icon, isIconName, type IconName } from "@/modular/icons";
import { CARD_DISC, TONES, turnTone } from "@/modular/styles";

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

/** A list item's own icon on its disc, the items taking turns accent / secondary (`turnTone`); nothing without one. */
export function TurnIcon({
  name,
  index,
  className = "",
}: {
  name: string | undefined;
  index: number;
  className?: string;
}) {
  return isIconName(name) ? (
    <CardIcon name={name} tone={turnTone(index)} className={className} />
  ) : null;
}
