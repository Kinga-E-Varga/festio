import { eventPath } from "@/lib/event";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HostInvitationEditor } from "@/components/invitation/HostInvitationEditor";
import { ModularEditor } from "@/components/modular/ModularEditor";
import { eventMetadata, openEvent } from "@/db/reads/access";
import { loadInvitation, modularStart } from "@/db/reads/invitation";
import { loadMessages } from "@/i18n/messages";
import { invitationValues } from "@/lib/invitation";
import { loadLibrary } from "@/modular";
import { loadTemplate } from "@/templates";

type Props = PageProps<"/[locale]/invitations/[id]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    ...(await eventMetadata((await params).id, "invitation")),
    robots: { index: false, follow: false },
  };
}

/** The host's view of their own invitation — the guest page, plus controls. */
export default async function HostInvitationPage({ params }: Props) {
  const { id } = await params;

  /* Unknown is not found; archived goes Home, like every event page. */
  const event = await openEvent(id);
  if (!event.templateId) notFound();

  const [loaded, stored] = await Promise.all([
    loadTemplate(event.templateId),
    loadInvitation(event),
  ]);
  if (!loaded) notFound();

  const { template } = loaded;

  /*
   * The host is looking at the guest page, so the reply panel and the date
   * are in the invitation's language — not the locale this route is under.
   * The editor draws the guest page in this catalog and keeps its own
   * chrome in the host's.
   */
  const { language } = event;

  if (template.kind === "modular") {
    const library = loadLibrary();
    return (
      <ModularEditor
        library={library}
        initial={modularStart(template, stored, library, language)}
        templateId={template.id}
        basics={{ date: event.date }}
        language={language}
      />
    );
  }

  return (
    <HostInvitationEditor
      template={template}
      initial={invitationValues(template, event, stored)}
      language={language}
      guestMessages={await loadMessages(language)}
      backTo={eventPath(event.id)}
    />
  );
}
