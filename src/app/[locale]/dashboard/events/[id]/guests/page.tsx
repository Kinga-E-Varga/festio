import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { EventHeader } from "@/components/dashboard/EventHeader";
import { BTN_ACCENT } from "@/components/dashboard/event-editor/styles";
import { RepliesBanner } from "@/components/dashboard/RepliesBanner";
import { GuestManager } from "@/components/dashboard/guest-list/GuestManager";
import { ButtonIcon } from "@/components/icons";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import { findEvent } from "@/mock/dashboard";
import { findGuests } from "@/mock/guests";

type Props = PageProps<"/[locale]/dashboard/events/[id]/guests">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = findEvent(id);
  const t = await getTranslations("Meta");
  return {
    title: event ? t("guests", { title: event.title }) : t("eventFallback"),
  };
}

export default async function GuestsPage({ params }: Props) {
  const { id } = await params;
  const event = findEvent(id);
  if (!event) notFound();

  const t = await getTranslations("GuestList");

  return (
    <div className="@container">
      <EventHeader
        event={event}
        action={
          event.dataDeleted ? null : (
            // Not wired yet: export comes in a later feature.
            <button type="button" className={`shrink-0 ${BTN_ACCENT}`}>
              <ButtonIcon name="download" />
              {t("export")}
            </button>
          )
        }
      />

      {event.dataDeleted ? (
        /* Held clear of the header as the banners are. */
        <div className="mt-8">
          <RepliesBanner event={event} />
          <p className="mt-3 rounded-ui border border-neutral-500 bg-neutral-300 px-[15px] py-[13px] text-[12.5px] text-neutral-800">
            {t("deleted", { days: GUEST_DATA_RETENTION_DAYS })}
          </p>
        </div>
      ) : (
        <GuestManager
          event={event}
          initial={findGuests(event.id)}
          notices={<RepliesBanner event={event} />}
        />
      )}
    </div>
  );
}
