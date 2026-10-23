import { after } from "next/server";
import { getTranslations } from "next-intl/server";
import { EventPageHeader } from "@/components/dashboard/EventPageHeader";
import { BTN_LIST_OUTLINE } from "@/components/dashboard/guest-list/styles";
import { GuestManager } from "@/components/dashboard/guest-list/GuestManager";
import { ButtonIcon } from "@/components/icons";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import { eventPath } from "@/lib/event";
import { loadGuests } from "@/db/reads/guests";
import { eventMetadata, openEvent } from "@/db/reads/access";
import { repairCounts } from "@/db/writes/counts";

type Props = PageProps<"/[locale]/dashboard/events/[id]/guests">;

export async function generateMetadata({ params }: Props) {
  return eventMetadata((await params).id, "guests");
}

export default async function GuestsPage({ params, searchParams }: Props) {
  const event = await openEvent((await params).id);
  /* The open tab, `?view=summary` as in `GuestManager`. */
  const summary = (await searchParams).view === "summary";
  /* Read alongside the page's words; a deleted event has none left to read. */
  const [t, tNav, initial] = await Promise.all([
    getTranslations("GuestList"),
    getTranslations("Nav"),
    event.dataDeleted ? null : loadGuests(event),
  ]);
  /* Safety net: after the page is sent, fix any counter that drifted. */
  if (initial) after(() => repairCounts(event.id, initial));
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

      {initial === null ? (
        /* What is left to say once the guest data is gone. */
        <div className="mt-6">
          <p className="rounded-ui border border-neutral-500 bg-neutral-300 px-[15px] py-[13px] meta-text">
            {t("deleted", { days: GUEST_DATA_RETENTION_DAYS })}
          </p>
        </div>
      ) : (
        <GuestManager event={event} initial={initial} />
      )}
    </div>
  );
}
