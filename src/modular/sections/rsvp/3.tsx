"use client";

import { RsvpForm } from "@/components/invitation/RsvpForm";
import { IconHeading } from "@/modular/IconHeading";
import { PAD, SPLIT } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { SKIN, ThankYouCard, useReply } from "./reply";

/**
 * Two-line & soft band (`1`) with the icon heading: the envelope on its
 * soft disc in the accent (the band is the secondary's soft, so a
 * secondary disc would vanish), over the heading and note, beside the
 * reply form; once sent, the thank-you card in its place.
 */
export function Variant({ values, onRsvp, questions }: VariantProps) {
  const { form, send } = useReply(onRsvp, questions);

  return (
    <div className={`${SPLIT} items-start ${PAD}`}>
      <IconHeading icon="mail" tone="accent" values={values} />
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
