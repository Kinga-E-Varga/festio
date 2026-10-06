import { Icon, type IconName } from "@/modular/icons";
import { ICON_DISC, TONES } from "@/modular/styles";

/** A card's icon: the glyph on its soft disc, in either accent. A 22px glyph; `large`: a 40px disc in place of 36px. */
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
      className={`${ICON_DISC} ${large ? "size-10" : "size-9"} ${TONES[tone]} ${className}`}
    >
      <Icon name={name} className="size-5.5" />
    </span>
  );
}
