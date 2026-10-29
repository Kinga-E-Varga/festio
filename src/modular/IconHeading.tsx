import type { SectionValues } from "@/types/modular";
import { Icon, type GlyphName, type IconName } from "./icons";
import { SectionHeading } from "./SectionHeading";
import { H2, ICON_DISC, TONES } from "./styles";

const PLACE = {
  center: "",
  start: "@3xl:items-start",
  "start-late": "@6xl:items-start",
};

/**
 * A large icon on its soft disc over the section's heading — no eyebrow or italic heading:
 * its variants leave them out of their `shows` (`ICON_HEADING_SHOWS`); centred on a phone, left-aligned beside content on a wider page (`center`: centred always).
 * `children` takes the heading's place when a variant draws more under it.
 */
export function IconHeading({
  icon,
  values,
  tone = "secondary",
  align = "start",
  className = "",
  beside = false,
  children,
}: {
  /** None: the heading alone. */
  icon?: IconName | GlyphName;
  values: SectionValues;
  tone?: keyof typeof TONES;
  align?: keyof typeof PLACE;
  className?: string;
  /**
   * The disc left of the heading instead of over it, a little smaller than
   * the heading's line (`0.8lh` in its type) and centred on it, the icon in
   * it at the usual share;
   * `children` then go under the heading, in line with it.
   */
  beside?: boolean;
  children?: React.ReactNode;
}) {
  if (beside) {
    return (
      <div className={className}>
        <SectionHeading
          values={values}
          align={align}
          below={children}
          mark={
            icon ? (
              <span
                className={`${H2} inline-flex h-[1lh] items-center align-top`}
              >
                <span className={`${ICON_DISC} size-[0.8lh] ${TONES[tone]}`}>
                  <Icon name={icon} className="size-[0.46lh]" />
                </span>
              </span>
            ) : undefined
          }
        />
      </div>
    );
  }
  return (
    <div
      className={`flex flex-col items-center gap-6 ${PLACE[align]} ${className}`}
    >
      {icon ? <BigIcon icon={icon} tone={tone} /> : null}
      {children ?? <SectionHeading values={values} align={align} />}
    </div>
  );
}

/** The large icon on its soft disc an icon heading stands under. */
export function BigIcon({
  icon,
  tone = "secondary",
  className = "",
}: {
  icon: IconName | GlyphName;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <span className={`${ICON_DISC} size-14 ${TONES[tone]} ${className}`}>
      <Icon name={icon} className="size-8" />
    </span>
  );
}
