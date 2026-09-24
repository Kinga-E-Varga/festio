import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Invitation } from "@/components/invitation/Invitation";
import { repliesPaused } from "@/lib/event";
import { cardValues, findByInvite, seedValues } from "@/lib/invitation";
import { invitationLanguage } from "@/lib/language";
import { EVENTS } from "@/mock/dashboard";
import { loadTemplate } from "@/templates";

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

  const event = findByInvite(EVENTS, invite);
  if (!event?.templateId) notFound();

  const loaded = await loadTemplate(event.templateId);
  if (!loaded) notFound();

  const { template, Card } = loaded;
  const values = seedValues(template, event);
  /* The date a guest reads is written in the invitation's own language. */
  const language = invitationLanguage(event);

  return (
    <Invitation
      template={template}
      values={values}
      repliesPaused={repliesPaused(event)}
    >
      <Card values={cardValues(values, language)} />
    </Invitation>
  );
}
