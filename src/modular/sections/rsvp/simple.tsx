"use client";

import { useTranslations } from "next-intl";
import { RsvpForm } from "@/components/invitation/RsvpForm";
import { useRsvpForm } from "@/components/invitation/useRsvpForm";
import { formatDeadline, replyClose } from "@/lib/event";
import { text } from "@/modular/content";
import { HEADING, PAD } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * Today's simple RSVP form in a full-width band. The form itself reads the
 * shared `--c*` roles, which `modularVars` already fills from this palette;
 * the band around it is `--m*` only.
 */
export function Variant({ values, basics, language, onRsvp }: VariantProps) {
  const t = useTranslations("Sections");
  const reply = useTranslations("Rsvp");
  const form = useRsvpForm();
  const closes = formatDeadline(replyClose({ date: basics.date }), language);

  function send() {
    const payload = form.buildPayload();
    if (!payload) return;
    onRsvp?.(payload);
    form.markSent();
  }

  return (
    <div
      className={`flex flex-col gap-7 bg-[var(--m11)] text-[color:var(--m1)] ${PAD} @5xl:px-60`}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-[11px] tracking-[0.22em] uppercase text-[color:var(--m6)]">
          {t("reply")}
        </p>
        <h2 className={`${HEADING} text-[28px] @3xl:text-[36px]`}>
          {text(values, "heading")}
        </h2>
        <p className="text-[15px] text-[color:var(--m4)]">
          {t("replyNote", { date: closes })}
        </p>
      </div>
      <div className="bg-[var(--m1)] px-5 py-8 text-[color:var(--m8)] @3xl:p-10">
        {form.derived.sent ? (
          <div className="flex flex-col gap-2 text-center">
            <p className={`${HEADING} text-[24px]`}>{reply("sentTitle")}</p>
            <p className="text-[13px] text-balance text-[color:var(--m9)]">
              {reply("sentNote")}
            </p>
          </div>
        ) : (
          <RsvpForm form={form} onSubmit={send} />
        )}
      </div>
    </div>
  );
}
