"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/icons";
import { NAV_HOVER, NAV_ITEM, NavLink } from "@/components/dashboard/NavLink";
import { EventPicker } from "@/components/dashboard/event-nav/EventPicker";
import { eventPages, openHref } from "@/components/dashboard/event-nav/pages";
import { NAV_MARGIN, SIDE_ICON } from "@/components/dashboard/styles";
import { resolvePicked, writePickedEvent } from "@/lib/picked-event";
import type { PickerEvent } from "@/types/dashboard";

interface EventNavProps {
  /** Every event, soonest first. */
  events: PickerEvent[];
  /** The event picked on an earlier visit, from its cookie. */
  storedEventId?: string;
}

/**
 * The nav's event half: the picker, then the picked event's pages. The
 * layout around it doesn't redraw on navigation, so the event is read from
 * the route here, and the one stored is kept in state once it changes.
 */
export function EventNav({ events, storedEventId }: EventNavProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const params = useParams<{ id?: string }>();
  const routeId = pathname.startsWith("/dashboard/events/")
    ? params.id
    : undefined;
  const [storedId, setStoredId] = useState(storedEventId);
  const picked = resolvePicked(events, routeId, storedId);

  /*
   * Opening an event anywhere makes it the picked one: kept here for the
   * pages outside an event, and in the cookie for the next visit.
   */
  const opened = routeId && picked?.id === routeId ? routeId : undefined;
  if (opened && opened !== storedId) setStoredId(opened);

  useEffect(() => {
    if (opened) writePickedEvent(opened);
  }, [opened]);

  return (
    <div className="pb-5">
      <div className={`${NAV_MARGIN} mb-3 border-y border-neutral-300 py-3`}>
        <EventPicker events={events} picked={picked} />
      </div>

      {picked ? (
        <ul aria-label={t("Nav.eventPages")} className="flex flex-col gap-1">
          {eventPages(picked).map((page) => {
            const label = t(`Nav.${page.key}`);
            const href = openHref(page);
            const reason = page.disabledKey ? t(page.disabledKey) : undefined;

            return (
              <li key={page.key}>
                {!href ? (
                  <span
                    aria-disabled="true"
                    title={reason}
                    className={`${NAV_MARGIN} ${NAV_ITEM} cursor-not-allowed opacity-50`}
                  >
                    <Icon name={page.icon} {...SIDE_ICON} />
                    <span className="truncate">{label}</span>
                    <span className="sr-only">{`(${reason})`}</span>
                  </span>
                ) : page.external ? (
                  /* The guest page itself, in a tab of its own. */
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className={`${NAV_MARGIN} ${NAV_ITEM} ${NAV_HOVER}`}
                  >
                    <Icon name={page.icon} {...SIDE_ICON} />
                    <span className="truncate">{label}</span>
                    <Icon
                      name="arrowUpRight"
                      className="ml-auto size-3.5 text-neutral-700"
                    />
                  </a>
                ) : (
                  <NavLink
                    item={{
                      labelKey: page.key,
                      href,
                      icon: page.icon,
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
