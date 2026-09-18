import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationFrame } from "@/components/invitation/InvitationFrame";
import { RsvpPanel } from "@/components/invitation/RsvpPanel";
import { cardValues, findByInvite, seedValues } from "@/lib/invitation";
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
}: PageProps<"/[invite]">) {
  const { invite } = await params;

  const event = findByInvite(EVENTS, invite);
  if (!event?.templateId) notFound();

  const loaded = await loadTemplate(event.templateId);
  if (!loaded) notFound();

  const { template, Card } = loaded;
  const values = seedValues(template, event);

  return (
    <InvitationFrame
      template={template}
      panel={<RsvpPanel template={template} values={values} />}
    >
      <Card values={cardValues(values)} />
    </InvitationFrame>
  );
}
