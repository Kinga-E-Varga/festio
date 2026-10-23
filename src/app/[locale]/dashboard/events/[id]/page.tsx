import { getTranslations } from "next-intl/server";
import { EventOverview } from "@/components/dashboard/EventOverview";
import {
  ModularPreview,
  SimplePreview,
} from "@/components/dashboard/overview/InvitationPreview";
import { eventTodos } from "@/components/dashboard/notices";
import { loadRecentReplies } from "@/db/reads/activity";
import { loadGuestRows, loadGuests } from "@/db/reads/guests";
import { loadInvitation, modularStart } from "@/db/reads/invitation";
import { countRows } from "@/lib/guests";
import { cardValues, invitationValues } from "@/lib/invitation";
import { loadLibrary } from "@/modular";
import { loadTemplate } from "@/templates";
import type { DashboardEvent } from "@/types/dashboard";
import { eventMetadata, openEvent } from "@/db/reads/access";

type Props = PageProps<"/[locale]/dashboard/events/[id]">;

/** The latest replies the Overview shows; the side panel and the guest list hold the rest. */
const LATEST = 5;

export async function generateMetadata({ params }: Props) {
  return eventMetadata((await params).id);
}

/** The invitation as guests see it, drawn live and shrunk; none before a design is picked. */
async function invitationPreview(event: DashboardEvent) {
  if (!event.templateId) return null;
  const [loaded, stored, t] = await Promise.all([
    loadTemplate(event.templateId),
    loadInvitation(event),
    getTranslations("Event"),
  ]);
  if (!loaded) return null;
  const label = t("previewAlt", { title: event.title });
  const { language } = event;

  /* Only a simple template file has a card of its own. */
  if (!("Card" in loaded)) {
    const library = loadLibrary();
    return (
      <ModularPreview
        library={library}
        state={modularStart(loaded.template, stored, library, language)}
        basics={{ date: event.date }}
        language={language}
        label={label}
      />
    );
  }
  const { template, Card } = loaded;
  const values = invitationValues(template, event, stored);
  return (
    <SimplePreview template={template} label={label}>
      <Card values={cardValues(values, language)} />
    </SimplePreview>
  );
}

export default async function EventOverviewPage({ params }: Props) {
  const event = await openEvent((await params).id);
  const [guests, rows, latest, preview] = await Promise.all([
    loadGuests(event),
    loadGuestRows(event),
    loadRecentReplies([event], LATEST),
    invitationPreview(event),
  ]);
  const { waiting } = countRows(rows);

  return (
    <EventOverview
      event={event}
      todos={eventTodos(event, waiting)}
      guests={guests}
      latest={latest}
      preview={preview}
    />
  );
}
