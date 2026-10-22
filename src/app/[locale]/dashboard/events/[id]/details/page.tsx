import { getTranslations } from "next-intl/server";
import { EventPageHeader } from "@/components/dashboard/EventPageHeader";
import { CONTENT_WIDTH } from "@/components/dashboard/styles";
import { EventEditor } from "@/components/dashboard/event-editor/EventEditor";
import { guestListCount, loadHostEvents } from "@/db/reads/events";
import { eventMetadata, openEvent } from "@/db/reads/access";

type Props = PageProps<"/[locale]/dashboard/events/[id]/details">;

export async function generateMetadata({ params }: Props) {
  return eventMetadata((await params).id);
}

export default async function EventPage({ params }: Props) {
  const event = await openEvent((await params).id);
  const [tNav, events, listCount] = await Promise.all([
    getTranslations("Nav"),
    loadHostEvents(),
    guestListCount(event),
  ]);

  return (
    <>
      {/* Outside the `@container` below, so its width is main's, not the column's. */}
      <EventPageHeader event={event} title={tNav("details")} />

      <div className={`@container ${CONTENT_WIDTH.form}`}>
        <EventEditor
          event={event}
          takenSlugs={events
            .filter((other) => other.id !== event.id)
            .map((other) => other.slug)}
          listCount={listCount}
        />
      </div>
    </>
  );
}
