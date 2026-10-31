import type { ReactNode } from "react";
import { FullCardFrame } from "@/modular/FullCard";
import type { IconName } from "@/modular/icons";
import {
  BODY,
  COLUMN,
  EYEBROW,
  H3_ITEM,
  MUTED,
  PAD,
  SECTION_GROUND,
  STACK,
} from "@/modular/styles";
import type { SectionGround } from "@/types/modular";
import { CardIcon, ItemIcon } from "./CardIcon";

/**
 * Dress code's and Gifts' Full card: the full card alone (`FullCardFrame`),
 * no section heading but its intro line (`eyebrow`, as the heading's),
 * no lines, and in it the note, centred: its icon, when it has one, on a
 * soft disc in the accent (as the full cards' items), the intro line, 16px
 * over the title, the text and, 16px under them, what the section adds (the colours,
 * the gift buttons). With `accent`, the card on the accent and the icon on
 * the palette's secondary disc (`ItemIcon`'s `accent`): Full card accent (`5`).
 * With a `heading` (Accent, `6`, on the accent band): no card, no icon (`accent` doesn't apply), the heading
 * over the note, 16px (20px from `@3xl`) further under it than `STACK`'s
 * gap, as the other Accent styles, as wide as the card's content.
 */
export function FullCardNote({
  ground,
  icon,
  eyebrow,
  title,
  body,
  children,
  accent = false,
  heading,
}: {
  ground: SectionGround;
  icon?: IconName;
  eyebrow: string;
  title: string;
  body: string;
  children?: ReactNode;
  accent?: boolean;
  heading?: ReactNode;
}) {
  const note = (
    <div
      className={`flex flex-col items-center text-center ${heading ? `${COLUMN} mt-4 @3xl:mt-5 @3xl:px-12` : ""}`}
    >
      {accent ? (
        <ItemIcon name={icon} accent className="mb-5" />
      ) : icon ? (
        <CardIcon name={icon} tone="accent" className="mb-5" />
      ) : null}
      {eyebrow ? (
        <p className={`${EYEBROW} mb-4 text-[color:var(--m-secondary)]`}>
          {eyebrow}
        </p>
      ) : null}
      {title ? <h3 className={`${H3_ITEM} mb-1`}>{title}</h3> : null}
      {body ? (
        <p className={`${BODY} ${MUTED} whitespace-pre-line`}>{body}</p>
      ) : null}
      {children ? (
        <div
          className={`flex flex-col items-center ${title || body ? "mt-4" : ""}`}
        >
          {children}
        </div>
      ) : null}
    </div>
  );

  return heading ? (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      {heading}
      {note}
    </div>
  ) : (
    <FullCardFrame ground={accent ? "accent" : ground}>{note}</FullCardFrame>
  );
}
