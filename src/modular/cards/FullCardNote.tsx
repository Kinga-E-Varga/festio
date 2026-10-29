import type { ReactNode } from "react";
import { FullCardFrame } from "@/modular/FullCard";
import type { IconName } from "@/modular/icons";
import { BODY, EYEBROW, H3_ITEM, MUTED } from "@/modular/styles";
import type { SectionGround } from "@/types/modular";
import { CardIcon } from "./CardIcon";

/**
 * Dress code's and Gifts' Full card: the full card alone (`FullCardFrame`),
 * no section heading but its intro line (`eyebrow`, as the heading's),
 * no lines, and in it the note, centred: its icon, when it has one, on a
 * soft disc in the accent (as the full cards' items), the intro line, 16px
 * over the title, the text and, 16px under them, what the section adds (the colours,
 * the gift buttons).
 */
export function FullCardNote({
  ground,
  icon,
  eyebrow,
  title,
  body,
  children,
}: {
  ground: SectionGround;
  icon?: IconName;
  eyebrow: string;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <FullCardFrame ground={ground}>
      <div className="flex flex-col items-center text-center">
        {icon ? <CardIcon name={icon} tone="accent" className="mb-5" /> : null}
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
          <div className="mt-4 flex flex-col items-center">{children}</div>
        ) : null}
      </div>
    </FullCardFrame>
  );
}
