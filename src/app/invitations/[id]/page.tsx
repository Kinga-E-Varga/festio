import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HostInvitationEditor } from "@/components/invitation/HostInvitationEditor";
import { seedValues } from "@/lib/invitation";
import { findEvent } from "@/mock/dashboard";
import { loadTemplate } from "@/templates";

type Props = PageProps<"/invitations/[id]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = findEvent(id);
  return {
    title: event ? `${event.title} · Invitation · Festio` : "Invitation · Festio",
    robots: { index: false, follow: false },
  };
}

/** The host's view of their own invitation — the guest page, plus controls. */
export default async function HostInvitationPage({ params }: Props) {
  const { id } = await params;

  const event = findEvent(id);
  if (!event?.templateId) notFound();

  const loaded = await loadTemplate(event.templateId);
  if (!loaded) notFound();

  const { template } = loaded;

  return (
    <HostInvitationEditor
      template={template}
      initial={seedValues(template, event)}
    />
  );
}
