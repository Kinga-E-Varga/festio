import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Banner } from "@/components/dashboard/event-editor/Banner";
import { EventEditor } from "@/components/dashboard/event-editor/EventEditor";
import { Icon } from "@/components/icons";
import {
  contentFreeze,
  formatDay,
  formatDeadline,
  formatDuration,
  formatRelative,
} from "@/lib/event";
import { findEvent, TIERS } from "@/mock/dashboard";

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
  const tTiers = await getTranslations("Tiers");
  const tier = TIERS[event.tier];
  const locale = await getLocale();
  const freeze = formatDeadline(contentFreeze(event.date), locale);

  return (
    <div className="@container">
      {/* The way back doubles as the page's eyebrow. */}
      <Link
        href="/dashboard/events"
        className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-forest-500 uppercase transition-colors hover:text-forest-600 hover:underline hover:underline-offset-4"
      >
        <Icon name="arrowLeft" className="size-3.5" />
        {t("allEvents")}
      </Link>

      <h1 className="mt-[18px] font-serif text-[29px] leading-[1.08] text-balance text-neutral-900 @min-[720px]:text-[38px]">
        {event.title}
      </h1>

      {/* When it is, said the way the events list says it. */}
      <p className="mt-2.5 mb-3 text-[14px] leading-none text-neutral-900">
        <span className="font-medium">{formatDay(event.date, locale)}</span>
        <span aria-hidden="true" className="text-neutral-700">
          {" · "}
        </span>
        <span
          className={
            event.isNextUp
              ? "font-medium text-terracotta-600"
              : "text-neutral-700"
          }
        >
          {formatRelative(event.countdown, locale)}
        </span>
      </p>

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

      {event.paid ? null : (
        <Banner tone="warn" icon="info" title={t("unpaidTitle")}>
          {t("unpaidBody", {
            tier: tTiers(`${tier.key}.name`),
            price: tTiers("price", { amount: tier.price }),
          })}
        </Banner>
      )}

      {/* Paid for, but nobody can reach it — worth saying out loud. */}
      {event.paid && event.visibility === "hidden" ? (
        <Banner tone="warn" icon="eyeOff" title={t("hiddenTitle")}>
          {t("hiddenBody")}
        </Banner>
      ) : null}

      {event.unmatched > 0 ? (
        <Banner
          tone="warn"
          icon="alert"
          title={t("unmatchedTitle", { count: event.unmatched })}
        >
          {t("unmatchedBody")}
        </Banner>
      ) : null}

      <EventEditor event={event} />
    </div>
  );
}
