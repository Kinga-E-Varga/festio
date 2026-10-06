import type { SectionValues } from "@/types/modular";
import { Icon, type IconName } from "./icons";
import { SectionHeading } from "./SectionHeading";
import { ICON_DISC, TONES } from "./styles";

const PLACE = {
  start: "@3xl:items-start",
  "start-late": "@6xl:items-start",
};

/**
 * A large icon on its soft disc over the section's heading, its eyebrow left
 * out; centred on a phone, left-aligned beside content on a wider page.
 * `children` takes the heading's place when a variant draws more under it.
 */
export function IconHeading({
  icon,
  values,
  tone = "secondary",
  align = "start",
  className = "",
  children,
}: {
  icon: IconName;
  values: SectionValues;
  tone?: keyof typeof TONES;
  align?: keyof typeof PLACE;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-5 ${PLACE[align]} ${className}`}
    >
      <span className={`${ICON_DISC} size-14 ${TONES[tone]}`}>
        <Icon name={icon} className="size-8" />
      </span>
      {children ?? (
        <SectionHeading values={{ ...values, eyebrow: "" }} align={align} />
      )}
    </div>
  );
}
