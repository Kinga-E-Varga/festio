import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { EventHeader } from "@/components/dashboard/EventHeader";
import { RepliesBanner } from "@/components/dashboard/RepliesBanner";
import { Banner } from "@/components/dashboard/event-editor/Banner";
import { EventEditor } from "@/components/dashboard/event-editor/EventEditor";
import {
  contentFreeze,
  replyClose,
  replyWindow,
  formatDeadline,
  formatDuration,
} from "@/lib/event";
import { PACKAGES, EVENTS, findEvent } from "@/mock/dashboard";

type Props = PageProps<"/[locale]/dashboard/events/[id]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = findEvent(id);
  const t = await getTranslations("Meta");
  return {
    title: event ? t("event", { title: event.title }) : t("eventFallback"),
  };
}

export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const event = findEvent(id);
  if (!event) notFound();

  const t = await getTranslations("EventPage");
  const tPackages = await getTranslations("Packages");
  const pkg = PACKAGES[event.package];
  const locale = await getLocale();
  const freeze = formatDeadline(contentFreeze(event.date), locale);
  const replies = replyWindow(event);
  const repliesClose = formatDeadline(replyClose(event), locale);

  return (
    <div className="@container">
      <EventHeader event={event} />

      {/* Only the banners that are true right now. */}
      {event.locked ? (
        <Banner
          tone="frozen"
          icon="lock"
          title={t("closedTitle", { date: freeze })}
        >
          {t("closedBody")}
        </Banner>
      ) : event.isNextUp && event.locksIn ? (
        <Banner
          tone="warn"
          icon="clock"
          title={t("closingTitle", {
            time: formatDuration(event.locksIn, locale),
          })}
        >
          {t("closingBody", { date: freeze })}
        </Banner>
      ) : null}

      {/* The reply form, when it is about to close or already has. */}
      {replies === "closed" ? (
        <Banner
          tone="warn"
          icon="lock"
          title={t("repliesClosedTitle", {
            date: repliesClose,
          })}
        >
          {t("repliesClosedBody", {
            custom: event.repliesCloseAt ? "yes" : "no",
          })}
        </Banner>
      ) : replies === "soon" && event.repliesCloseIn ? (
        <Banner
          tone="warn"
          icon="clock"
          title={t("repliesClosingTitle", {
            time: formatDuration(event.repliesCloseIn, locale),
          })}
        >
          {t("repliesClosingBody", {
            date: repliesClose,
            custom: event.repliesCloseAt ? "yes" : "no",
          })}
        </Banner>
      ) : null}

      {event.paid ? null : (
        <Banner tone="warn" icon="info" title={t("unpaidTitle")}>
          {t("unpaidBody", {
            package: tPackages(`${event.package}.name`),
            price: tPackages("price", { amount: pkg.price }),
          })}
        </Banner>
      )}

      {/* Paid for, but nobody can reach it — worth saying out loud. */}
      {event.paid && event.visibility === "hidden" ? (
        <Banner tone="warn" icon="eyeOff" title={t("hiddenTitle")}>
          {t("hiddenBody")}
        </Banner>
      ) : null}

      <RepliesBanner event={event} from="warn" />

      <EventEditor
        event={event}
        takenSlugs={EVENTS.filter((other) => other.id !== event.id).map(
          (other) => other.slug,
        )}
      />
    </div>
  );
}
