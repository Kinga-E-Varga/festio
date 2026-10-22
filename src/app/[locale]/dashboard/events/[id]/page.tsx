import { EventOverview } from "@/components/dashboard/EventOverview";
import { eventMetadata, openEvent } from "./load-event";

type Props = PageProps<"/[locale]/dashboard/events/[id]">;

export async function generateMetadata({ params }: Props) {
  return eventMetadata((await params).id);
}

export default async function EventOverviewPage({ params }: Props) {
  const event = await openEvent((await params).id);
  return <EventOverview event={event} />;
}
