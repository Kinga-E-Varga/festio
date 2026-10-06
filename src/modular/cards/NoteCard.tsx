import type { ReactNode } from "react";
import type { IconName } from "@/modular/icons";
import type { Ground } from "@/types/modular";
import {
  BODY,
  CARD,
  INNER_EYEBROW,
  GROUND,
  H3,
  MEASURE,
  MUTED,
  TONE_TEXT,
  type TONES,
} from "@/modular/styles";
import { CardIcon } from "./CardIcon";

interface NoteCardProps {
  /** None: the label stands alone. */
  icon?: IconName;
  tone: keyof typeof TONES;
  /** "Dress code", or a custom note's title; empty draws no label. */
  label: string;
  title?: string;
  body?: string;
  /** The right-hand column: swatches, account details. */
  aside?: ReactNode;
  /** The card is the other surface from the band it sits on. */
  ground: Ground;
}

/**
 * A detail card: icon and label, the text, and an optional side column. Three columns on a wide page; the side column drops under the
 * text on a mid-width one; everything stacks on a phone.
 */
export function NoteCard({
  icon,
  tone,
  label,
  title,
  body,
  aside,
  ground,
}: NoteCardProps) {
  return (
    <article
      className={`${CARD} grid gap-4 ${GROUND[ground]} @3xl:grid-cols-[7rem_minmax(0,1fr)] @3xl:items-center @3xl:gap-x-9 @3xl:gap-y-7 ${aside ? "@5xl:grid-cols-[7rem_minmax(0,1fr)_18rem]" : ""}`}
    >
      <div className="flex items-center gap-3 @3xl:flex-col @3xl:gap-3.5 @3xl:text-center">
        {icon ? <CardIcon name={icon} tone={tone} large /> : null}
        {label ? (
          <span className={`${INNER_EYEBROW} ${TONE_TEXT[tone]}`}>{label}</span>
        ) : null}
      </div>
      {title || body ? (
        <div className="flex flex-col gap-2.5">
          {title ? <h3 className={H3}>{title}</h3> : null}
          {body ? (
            <p className={`${BODY} ${MUTED} ${MEASURE} whitespace-pre-line`}>
              {body}
            </p>
          ) : null}
        </div>
      ) : null}
      {aside ? (
        <aside className="flex flex-col justify-center gap-3 border-t-1 border-[var(--m-line)] pt-4 @3xl:col-span-2 @5xl:col-span-1 @5xl:border-t-0 @5xl:border-l-1 @5xl:pt-0 @5xl:pl-6">
          {aside}
        </aside>
      ) : null}
    </article>
  );
}
