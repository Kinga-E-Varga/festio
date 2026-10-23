import { getTranslations } from "next-intl/server";
import { EventPageHeader } from "@/components/dashboard/EventPageHeader";
import { CONTENT_WIDTH } from "@/components/dashboard/styles";
import { EventEditor } from "@/components/dashboard/event-editor/EventEditor";
import { guestListCount } from "@/db/reads/events";
import { eventMetadata, openEvent } from "@/db/reads/access";
import { loadHostLogin } from "@/db/reads/host";

type Props = PageProps<"/[locale]/dashboard/events/[id]/details">;

export async function generateMetadata({ params }: Props) {
  return eventMetadata((await params).id);
}

export default async function EventPage({ params }: Props) {
  const event = await openEvent((await params).id);
  const [tNav, listCount, login] = await Promise.all([
    getTranslations("Nav"),
    guestListCount(event),
    loadHostLogin(),
  ]);

  return (
    <>
      {/* Outside the `@container` below, so its width is main's, not the column's. */}
      <EventPageHeader event={event} title={tNav("details")} />

      <div className={`@container ${CONTENT_WIDTH.form}`}>
        <EventEditor event={event} listCount={listCount} login={login} />
      </div>
    </>
  );
}
