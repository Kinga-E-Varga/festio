"use client";

import { useTranslations } from "next-intl";
import type { InvitationTemplate } from "@/types/invitation";
import { InviteNotice } from "./InviteNotice";
import { REPLY_LINE, REPLY_TITLE } from "./styles";

/**
 * A cancelled event's page: the cancel, and the host's own message to guests.
 * A client component so its words come from the invite layout's provider,
 * in the invitation's language: a guest link has no locale of its own.
 */
export function CancelledNotice({
  template,
  message,
}: {
  template: InvitationTemplate;
  message?: string;
}) {
  const t = useTranslations("Rsvp");
  return (
    <InviteNotice template={template}>
      <h1 className={REPLY_TITLE}>{t("cancelledTitle")}</h1>
      {message ? (
        <p className={`${REPLY_LINE} text-balance whitespace-pre-line`}>
          {message}
        </p>
      ) : null}
    </InviteNotice>
  );
}
