"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import type { RsvpSkin } from "@/components/invitation/RsvpForm";
import { useRsvpForm } from "@/components/invitation/useRsvpForm";
import { text } from "@/modular/content";
import { CardIcon } from "@/modular/cards/CardIcon";
import {
  BODY,
  BODY_SM,
  CAPTION,
  CARD,
  FIELD_CORNER,
  H3,
  HEADING,
  MUTED,
  PILL,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/*
 * Square, hairline-boxed fields on the page's surface, plain semibold
 * labels, the two choices side by side, and Send solid in the accent,
 * turning secondary under the pointer. Fields, choices and Send share one
 * 44px height, a comfortable tap; the form is spaced tightly — 20px between
 * groups, 6px from a label to its field.
 */
/* The skin's own type: 14px controls, 12px labels set tight. */
const LABEL =
  "text-[12px] leading-tight font-semibold text-[color:var(--m-ink)]";
const CONTROL_TYPE = "text-[14px] leading-5";
const FIELD = `w-full min-h-11 ${FIELD_CORNER} border-1 border-[var(--m-line)] bg-[var(--m-surface)] px-3 py-2.5 ${CONTROL_TYPE} text-[color:var(--m-ink)] transition-colors placeholder:text-[color:var(--m-ink-muted)] focus:border-[var(--m-accent)] focus:outline-none`;
const CHOICE = `inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center ${PILL} border-1 px-3 ${CONTROL_TYPE} transition-colors`;
const PANEL = `absolute inset-x-0 top-full z-10 mt-1 grid overflow-hidden ${FIELD_CORNER} border-1 border-[var(--m-line)] bg-[var(--m-surface)] py-1 shadow-md shadow-(color:--m-shadow)/40`;
const OPTION = `flex cursor-pointer items-center gap-2 px-3 py-1.5 ${CONTROL_TYPE} text-[color:var(--m-ink)] transition-colors hover:bg-[var(--m-surface-alt)]`;
const DROPDOWN = {
  label: `${LABEL} mb-1.5 block`,
  toggle: `${FIELD} flex cursor-pointer items-center justify-between gap-2 text-left`,
  placeholder: MUTED,
  chevron: MUTED,
};
/* A diet tick: the native checkbox, drawn square in the line, filled with the accent and an accent-ink tick once picked. */
const TICK =
  "grid size-4 shrink-0 cursor-pointer appearance-none place-content-center border-1 border-[var(--m-line)] bg-[var(--m-surface)] transition-colors checked:border-[var(--m-accent)] checked:bg-[var(--m-accent)] before:size-2.5 before:scale-0 before:bg-[var(--m-accent-ink)] before:transition-transform before:[clip-path:polygon(0_56%,40%_96%,100%_22%,90%_12%,40%_76%,10%_46%)] checked:before:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--m-accent)]";

/** The skin, shared by Split and Band. */
export const SKIN: RsvpSkin = {
  label: LABEL,
  input: FIELD,
  choice: {
    picked: `${CHOICE} border-[var(--m-accent)] bg-[var(--m-accent-soft)] font-semibold text-[color:var(--m-ink)]`,
    unpicked: `${CHOICE} border-[var(--m-line)] bg-[var(--m-surface)] text-[color:var(--m-ink)] hover:border-[var(--m-accent)]`,
  },
  remove: `${MUTED} transition-colors hover:text-[color:var(--m-secondary)]`,
  addPerson: `inline-flex cursor-pointer items-center gap-1.5 py-2 ${CONTROL_TYPE} font-semibold text-[color:var(--m-secondary)] transition-colors hover:text-[color:var(--m-ink)]`,
  submit: `inline-flex min-h-11 ${PILL} cursor-pointer items-center justify-center gap-2.5 bg-[var(--m-accent)] px-5 ${CONTROL_TYPE} font-semibold tracking-wide text-[color:var(--m-accent-ink)] transition-[background-color,color,transform] duration-150 hover:-translate-y-px hover:bg-[var(--m-secondary)] hover:text-[color:var(--m-secondary-ink)]`,
  privacy: `${CAPTION} ${MUTED} text-center`,
  warning: `${BODY_SM} text-center text-[color:var(--m-error)]`,
  space: { group: "gap-5", field: "gap-1.5", legend: "mb-2", send: "mt-1" },
  age: {
    ...DROPDOWN,
    panel: PANEL,
    option: `${OPTION} has-checked:bg-[var(--m-accent-soft)] has-focus-visible:outline-1 has-focus-visible:-outline-offset-1 has-focus-visible:outline-[var(--m-accent)]`,
    tick: "sr-only",
  },
  diet: {
    ...DROPDOWN,
    panel: `${PANEL} grid-cols-2`,
    option: OPTION,
    tick: TICK,
  },
};

/**
 * The reply form's state and its Send, shared by Split and Band.
 */
export function useReply(onRsvp: VariantProps["onRsvp"]) {
  const form = useRsvpForm();

  function send() {
    const payload = form.buildPayload();
    if (!payload) return;
    onRsvp?.(payload);
    form.markSent();
  }

  return { form, send };
}

/**
 * The thank-you card that takes the form's place once sent, a "Thank you"
 * line over its heading, as tall as the form roughly was, so the page
 * doesn't jump up on Send. The heading takes focus as it appears, so a
 * screen reader says it and keyboard focus doesn't fall to the page top.
 * Shared by Split and Band.
 */
export function ThankYouCard({
  values,
  className = "",
}: {
  values: VariantProps["values"];
  className?: string;
}) {
  const reply = useTranslations("Rsvp");
  const heading = useRef<HTMLHeadingElement>(null);
  /* Once, as the card appears — not again on every render after. */
  useEffect(() => {
    heading.current?.focus();
  }, []);
  const thanks = text(values, "thanks");
  const thankYou = text(values, "thankYou");

  return (
    <div
      className={`${CARD} ${className} flex min-h-72 flex-col items-center justify-center bg-[var(--m-surface)] text-center @3xl:min-h-80`}
    >
      <CardIcon name="check" tone="accent" />
      {thankYou ? (
        <p className={`${H3} mt-5 text-[color:var(--m-secondary)]!`}>
          {thankYou}
        </p>
      ) : null}
      <h3
        ref={heading}
        tabIndex={-1}
        className={`${HEADING} ${thankYou ? "mt-1.5" : "mt-5"} mb-2 text-[28px] outline-none text-[color:var(--m-ink)]`}
      >
        {thanks || reply("sentTitle")}
      </h3>
      <p className={`${BODY} ${MUTED} max-w-xs`}>{reply("sentNote")}</p>
    </div>
  );
}
