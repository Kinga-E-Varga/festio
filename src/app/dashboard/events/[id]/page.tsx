import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventMeta } from "@/components/dashboard/EventMeta";
import { EventSummary } from "@/components/dashboard/EventSummary";
import { Banner } from "@/components/dashboard/event-editor/Banner";
import { EventEditor } from "@/components/dashboard/event-editor/EventEditor";
import { Icon } from "@/components/icons";
import { contentFreeze, formatStamp } from "@/lib/event";
import { findEvent, TIERS } from "@/mock/dashboard";

type Props = PageProps<"/dashboard/events/[id]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = findEvent(id);
  return { title: event ? `${event.title} · Festio` : "Event · Festio" };
}

export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const event = findEvent(id);
  if (!event) notFound();

  const tier = TIERS[event.tier];
  const freeze = formatStamp(contentFreeze(event.date));

  return (
    <div className="@container">
      {/* The way back doubles as the page's eyebrow. */}
      <Link
        href="/dashboard/events"
        className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-forest-500 uppercase transition-colors hover:text-forest-600 hover:underline hover:underline-offset-4"
      >
        <Icon name="arrowLeft" className="size-3.5" />
        All events
      </Link>

      <h1 className="mt-1.5 mb-3 font-serif text-[29px] leading-[1.08] text-balance text-neutral-900 @min-[720px]:text-[38px]">
        {event.title}
      </h1>

      <EventMeta event={event} deadlines={false} />

      {/* Only the banners that are true right now. */}
      {event.locked ? (
        <Banner
          tone="frozen"
          icon="lock"
          title={`Editing closed on ${freeze}`}
        >
          Event and invitation editing closed the day before the event. The
          record stays readable, and your printable file is still yours to
          download.
        </Banner>
      ) : event.isNextUp && event.locksInLabel ? (
        <Banner
          tone="warn"
          icon="clock"
          title={`Editing closes in ${event.locksInLabel}`}
        >
          Event and invitation editing close on {freeze}, the day before the
          event. The guest list stays open after that, so you can still record
          replies that reach you by phone.
        </Banner>
      ) : null}

      {event.paid ? null : (
        <Banner tone="info" icon="info" title="This draft is unpaid">
          The {tier.name} edition costs {tier.price}. The page stays hidden and
          the RSVP form stays closed until payment clears.
        </Banner>
      )}

      {event.unmatched > 0 ? (
        <Banner
          tone="warn"
          icon="alert"
          title={`${event.unmatched} replies don't match a name on your list`}
        >
          They are tagged UNKNOWN until you add them or match them to a name
          someone mistyped.
        </Banner>
      ) : null}

      <EventSummary event={event} />
      <EventEditor event={event} />
    </div>
  );
}
