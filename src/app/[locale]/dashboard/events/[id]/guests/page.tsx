import { getTranslations } from "next-intl/server";
import { EventPageHeader } from "@/components/dashboard/EventPageHeader";
import { BTN_LIST_OUTLINE } from "@/components/dashboard/guest-list/styles";
import { GuestManager } from "@/components/dashboard/guest-list/GuestManager";
import { ButtonIcon } from "@/components/icons";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import { eventPath } from "@/lib/event";
import { findGuests } from "@/mock/guests";
import { eventMetadata, openEvent } from "../load-event";

type Props = PageProps<"/[locale]/dashboard/events/[id]/guests">;

export async function generateMetadata({ params }: Props) {
  return eventMetadata((await params).id, "guests");
}

export default async function GuestsPage({ params, searchParams }: Props) {
  const event = await openEvent((await params).id);
  /* The open tab, `?view=summary` as in `GuestManager`. */
  const summary = (await searchParams).view === "summary";
  const t = await getTranslations("GuestList");
  const tNav = await getTranslations("Nav");
  const guests = eventPath(event.id, "guests");

  return (
    <div className="@container">
      <EventPageHeader
        event={event}
        title={tNav("guests")}
        tabs={{
          label: t("tabs"),
          items: [
            {
              key: "list",
              label: t("sectionList"),
              href: guests,
              current: !summary,
            },
            {
              key: "summary",
              label: t("sectionSummary"),
              href: `${guests}?view=summary`,
              current: summary,
            },
          ],
        }}
        action={
          event.dataDeleted ? null : (
            // Not wired yet: export comes in a later feature.
            <button type="button" className={`shrink-0 ${BTN_LIST_OUTLINE}`}>
              <ButtonIcon name="download" />
              {t("export")}
            </button>
          )
        }
      />

      {event.dataDeleted ? (
        /* What is left to say once the guest data is gone. */
        <div className="mt-6">
          <p className="rounded-ui border border-neutral-500 bg-neutral-300 px-[15px] py-[13px] meta-text">
            {t("deleted", { days: GUEST_DATA_RETENTION_DAYS })}
          </p>
        </div>
      ) : (
        <GuestManager event={event} initial={findGuests(event.id)} />
      )}
    </div>
  );
}
