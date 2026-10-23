import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Invitation } from "@/components/invitation/Invitation";
import { repliesPaused } from "@/lib/event";
import { cardValues, invitationValues } from "@/lib/invitation";
import { loadEventBySlug } from "@/db/reads/events";
import { loadInvitation } from "@/db/reads/invitation";
import { loadSimpleTemplate } from "@/templates";

/**
 * An invitation is reachable only by its unguessable link and must never be
 * indexed, so the page says so for itself rather than relying on a header.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function InvitationPage({
  params,
}: PageProps<"/invite/[invite]">) {
  const { invite } = await params;

  const event = await loadEventBySlug(invite);
  if (!event?.templateId) notFound();

  const [loaded, stored] = await Promise.all([
    loadSimpleTemplate(event.templateId),
    loadInvitation(event),
  ]);
  if (!loaded) notFound();

  const { template, Card } = loaded;
  const values = invitationValues(template, event, stored);
  /* The date a guest reads is written in the invitation's own language. */
  const { language } = event;

  return (
    <Invitation
      template={template}
      values={values}
      repliesPaused={repliesPaused(event)}
      /*
       * The host's saved switch, on for a card never saved. A cancelled
       * event will pass false; a Protected one shows it after the password.
       */
      envelope={stored?.kind === "simple" ? stored.envelope : true}
    >
      <Card values={cardValues(values, language)} />
    </Invitation>
  );
}
