"use client";

import { RsvpForm } from "@/components/invitation/RsvpForm";
import { text } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import { CARD, ITALIC_LINE, MUTED, PAD } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { SKIN, ThankYouCard, useReply } from "./reply";

/*
 * The heading beside the card from `@3xl`, as with `SPLIT`, at least 6%
 * apart: the heading on the left edge, the card on the right. A row, not a
 * grid, so the heading is served first: it takes up to 350px and gives way
 * only to keep the card at 380px; the card grows into what is left, up to
 * 620px. (A grid shares spare room equally, which left the heading about
 * 118px at 768px.)
 */
const LAYOUT =
  "flex flex-col gap-8 @3xl:flex-row @3xl:items-center @3xl:justify-between @3xl:gap-[6%]";

/* The heading's share of the row. */
const HEADING_COLUMN = "@3xl:min-w-0 @3xl:shrink @3xl:basis-[350px]";

/*
 * The form's card and the thank-you's: centred, up to 560px, while stacked;
 * beside the heading, 380px to 620px.
 */
const CARD_WIDTH =
  "mx-auto w-full max-w-140 @3xl:mx-0 @3xl:max-w-[620px] @3xl:shrink-0 @3xl:grow @3xl:basis-[380px]";

/* The heading far larger than `H2`'s 34 / 44 / 48px: 80px on a wide page. */
const LARGER_HEADING =
  "[&_h2]:text-[48px] @3xl:[&_h2]:text-[64px] @5xl:[&_h2]:text-[80px]";

/*
 * The heading on the band: its ink and eyebrow in the tertiary's ink, the
 * only colour the palette promises reads on it, and muted text in that
 * ink's mix toward the band.
 */
const ON_BAND =
  "[--m-ink:var(--m-tertiary-ink)] [--m-ink-muted:var(--m-tertiary-ink-muted)] [--m-secondary:var(--m-tertiary-ink)]";

/**
 * On the tertiary, in its ink: the intro, centred both ways — no eyebrow,
 * the note like the title's caption — beside the reply form in a card of the
 * page's surface; the form's own colours are the page's, not the band's.
 * Once sent, Split's thank-you card in its place. The form and its skin are
 * Split's.
 */
export function Variant({ values, onRsvp }: VariantProps) {
  const { form, send } = useReply(onRsvp);
  const note = text(values, "note");

  return (
    <div className={`${LAYOUT} bg-[var(--m-tertiary)] ${PAD}`}>
      <div
        className={`flex flex-col items-center gap-5 ${HEADING_COLUMN} ${ON_BAND} ${LARGER_HEADING}`}
      >
        <SectionHeading values={{ ...values, eyebrow: "", note: "" }} />
        {/* The note in the title caption's style. */}
        {note ? (
          <p
            className={`${ITALIC_LINE} ${MUTED} text-center whitespace-pre-line`}
          >
            {note}
          </p>
        ) : null}
      </div>
      {form.derived.sent ? (
        <ThankYouCard values={values} className={CARD_WIDTH} />
      ) : (
        <div className={`${CARD} ${CARD_WIDTH} bg-[var(--m-surface)]`}>
          <RsvpForm form={form} skin={SKIN} onSubmit={send} />
        </div>
      )}
    </div>
  );
}
