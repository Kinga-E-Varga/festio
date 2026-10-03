import { Icon, type IconName } from "@/modular/icons";
import { ICON_DISC, TONES } from "@/modular/styles";

/** A card's icon: the glyph on its soft disc, in either accent. `large`: a 20px glyph on a 44px disc. */
export function CardIcon({
  name,
  tone,
  large = false,
  className = "",
}: {
  name: IconName | "check";
  tone: keyof typeof TONES;
  large?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`${ICON_DISC} ${large ? "size-11" : "size-10"} ${TONES[tone]} ${className}`}
    >
      <Icon name={name} className={large ? "size-5" : "size-4.5"} />
    </span>
  );
}
