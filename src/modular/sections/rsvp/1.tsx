"use client";

import { RsvpForm } from "@/components/invitation/RsvpForm";
import { SectionHeading } from "@/modular/SectionHeading";
import { PAD, SPLIT } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { SKIN, ThankYouCard, useReply } from "./reply";

/**
 * The intro beside the reply form; once sent, the thank-you card in its
 * place. The form is the shared one, in this variant's own skin.
 */
export function Variant({ values, onRsvp }: VariantProps) {
  const { form, send } = useReply(onRsvp);

  return (
    <div className={`${SPLIT} items-start bg-[var(--m-secondary-soft)] ${PAD}`}>
      <SectionHeading values={values} align="start" />
      {form.derived.sent ? (
        <ThankYouCard values={values} />
      ) : (
        <div className="w-full">
          <RsvpForm form={form} skin={SKIN} onSubmit={send} />
        </div>
      )}
    </div>
  );
}
