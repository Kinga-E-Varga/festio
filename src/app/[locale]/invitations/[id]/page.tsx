import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { HostInvitationEditor } from "@/components/invitation/HostInvitationEditor";
import { loadMessages } from "@/i18n/messages";
import { seedValues } from "@/lib/invitation";
import { invitationLanguage } from "@/lib/language";
import { findEvent } from "@/mock/dashboard";
import { loadTemplate } from "@/templates";

type Props = PageProps<"/[locale]/invitations/[id]">;

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

  /*
   * The host is looking at the guest page, so the reply panel and the date
   * are in the invitation's language — not the locale this route is under.
   * The provider here sits inside the root layout's and overrides it for
   * this subtree; the host's own chrome around the card is unaffected,
   * because none of it reads a catalog.
   */
  const language = invitationLanguage(event);

  return (
    <NextIntlClientProvider
      locale={language}
      messages={await loadMessages(language)}
    >
      <HostInvitationEditor
        template={template}
        initial={seedValues(template, event)}
        language={language}
      />
    </NextIntlClientProvider>
  );
}
