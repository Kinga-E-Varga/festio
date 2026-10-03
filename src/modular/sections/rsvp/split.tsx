"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { RsvpForm, type RsvpSkin } from "@/components/invitation/RsvpForm";
import { useRsvpForm } from "@/components/invitation/useRsvpForm";
import { text } from "@/modular/content";
import { Icon } from "@/modular/icons";
import { SectionHeading } from "@/modular/SectionHeading";
import { CardIcon } from "@/modular/cards/CardIcon";
import {
  BODY,
  BODY_SM,
  CAPTION,
  CARD,
  HEADING,
  LEAD,
  MUTED,
  PAD,
  SERIF,
  SPLIT,
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
const FIELD = `w-full min-h-11 border-1 border-[var(--m-line)] bg-[var(--m-surface)] px-3 py-2.5 ${CONTROL_TYPE} text-[color:var(--m-ink)] transition-colors placeholder:text-[color:var(--m-ink-muted)] focus:border-[var(--m-accent)] focus:outline-none`;
const CHOICE = `inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center border-1 px-3 ${CONTROL_TYPE} transition-colors`;
const PANEL =
  "absolute inset-x-0 top-full z-10 mt-1 grid border-1 border-[var(--m-line)] bg-[var(--m-surface)] py-1 shadow-md shadow-(color:--m-shadow)/40";
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

const SKIN: RsvpSkin = {
  label: LABEL,
  input: FIELD,
  choice: {
    picked: `${CHOICE} border-[var(--m-accent)] bg-[var(--m-accent-soft)] font-semibold text-[color:var(--m-ink)]`,
    unpicked: `${CHOICE} border-[var(--m-line)] bg-[var(--m-surface)] text-[color:var(--m-ink)] hover:border-[var(--m-accent)]`,
  },
  remove: `${MUTED} transition-colors hover:text-[color:var(--m-secondary)]`,
  addPerson: `inline-flex cursor-pointer items-center gap-1.5 py-2 ${CONTROL_TYPE} font-semibold text-[color:var(--m-secondary)] transition-colors hover:text-[color:var(--m-ink)]`,
  submit: `inline-flex min-h-11 cursor-pointer items-center justify-center gap-2.5 bg-[var(--m-accent)] px-5 ${CONTROL_TYPE} font-semibold tracking-wide text-[color:var(--m-accent-ink)] transition-[background-color,color,transform] duration-150 hover:-translate-y-px hover:bg-[var(--m-secondary)] hover:text-[color:var(--m-secondary-ink)]`,
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
 * The intro and a heart beside the reply form; once sent, a thank-you card
 * in its place, a "Thank you" line over its heading. The heading takes
 * focus as it appears, so a screen reader says it and keyboard focus
 * doesn't fall to the page top. The form is the shared one, in this
 * variant's own skin.
 */
export function Variant({ values, onRsvp }: VariantProps) {
  const reply = useTranslations("Rsvp");
  const form = useRsvpForm();
  const sent = form.derived.sent;
  const thanksHeading = useRef<HTMLHeadingElement>(null);
  /* Once, as the thank-you appears — not again on every render after. */
  useEffect(() => {
    if (sent) thanksHeading.current?.focus();
  }, [sent]);
  const thanks = text(values, "thanks");
  const thankYou = text(values, "thankYou");

  function send() {
    const payload = form.buildPayload();
    if (!payload) return;
    onRsvp?.(payload);
    form.markSent();
  }

  return (
    <div className={`${SPLIT} items-start bg-[var(--m-secondary-soft)] ${PAD}`}>
      <div className="flex flex-col items-center @3xl:items-start">
        <SectionHeading values={values} align="start" />
        <Icon
          name="heart-filled"
          className="mt-5 size-9 text-[color:var(--m-secondary)] @3xl:mt-8"
        />
      </div>
      {sent ? (
        /* As tall as the form roughly was, so the page doesn't jump up on Send. */
        <div
          className={`${CARD} flex min-h-72 flex-col items-center justify-center bg-[var(--m-surface)] text-center @3xl:min-h-80`}
        >
          <CardIcon name="check" tone="accent" />
          {thankYou ? (
            <p
              className={`${SERIF} ${LEAD} mt-5 italic text-[color:var(--m-secondary)]`}
            >
              {thankYou}
            </p>
          ) : null}
          <h3
            ref={thanksHeading}
            tabIndex={-1}
            className={`${HEADING} ${thankYou ? "mt-1.5" : "mt-5"} mb-2 text-[28px] outline-none text-[color:var(--m-ink)]`}
          >
            {thanks || reply("sentTitle")}
          </h3>
          <p className={`${BODY} ${MUTED} max-w-xs`}>{reply("sentNote")}</p>
        </div>
      ) : (
        <div className="w-full">
          <RsvpForm form={form} skin={SKIN} onSubmit={send} />
        </div>
      )}
    </div>
  );
}
