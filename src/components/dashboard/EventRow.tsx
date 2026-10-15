import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { DatesThatMatter } from "@/components/dashboard/DatesThatMatter";
import { EventWhen } from "@/components/dashboard/EventWhen";
import { CopyButton } from "@/components/dashboard/CopyButton";
import { SOFT_BTN } from "@/components/dashboard/event-editor/styles";
import { Icon } from "@/components/icons";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import {
  deletionDate,
  isPast,
  formatEventDate,
  invitationLink,
  invitationPath,
} from "@/lib/event";
import type { DashboardEvent, IconName } from "@/types/dashboard";

/**
 * The actions, one set, under the title. One column in a narrow box; wider,
 * two filled top to bottom — the event's three, then the invitation's — and
 * with room for three across (776), those two sets as two rows. Each
 * a rounded button of its own, the columns sharing the box's width (248px
 * each at 776 — room for the Hungarian "Esemény szerkesztése" on one line) —
 * 10px apart, 16 across. The breakpoint
 * is the box's own, not the card's, since the artwork takes part of the row.
 */
const ACTION_LIST =
  "grid grid-cols-1 gap-y-2.5 @min-[380px]/actions:grid-flow-col @min-[380px]/actions:grid-cols-[repeat(2,minmax(0,1fr))] @min-[380px]/actions:grid-rows-3 @min-[380px]/actions:gap-x-4 @min-[776px]/actions:grid-flow-row @min-[776px]/actions:grid-cols-[repeat(3,minmax(0,1fr))] @min-[776px]/actions:grid-rows-none";

/**
 * One action: icon, label, and where it leads on the far side. In the soft
 * action's colours, as the event editor's "Close earlier", a shade darker
 * in type; its icon takes the text's colour, the arrow a paler grey.
 * Taller on screens wide enough for the notifications panel.
 */
const ACTION_ROW = `flex h-btn w-full rail:h-11 items-center gap-3 rounded-ui px-3.5 text-left text-[12.5px] leading-[1.3] font-medium border transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${SOFT_BTN} text-neutral-800! hover:text-neutral-900!`;

/**
 * One action. With no `href` it is a button — disabled, with the reason as
 * its tooltip, when `disabledTitle` is given. An `external` one opens in a
 * tab of its own and says so with its arrow.
 */
function ActionRow({
  icon,
  label,
  href,
  external = false,
  disabledTitle,
}: {
  icon: IconName;
  label: string;
  href?: string;
  external?: boolean;
  disabledTitle?: string;
}) {
  const content = (
    <>
      <Icon name={icon} className="size-[17px]" />
      <span className="min-w-0 flex-1">{label}</span>
      <Icon
        name={external ? "arrowUpRight" : "chevron"}
        className={`size-[13px] text-neutral-800/70 ${external ? "" : "-rotate-90"}`}
      />
    </>
  );

  if (!href || disabledTitle !== undefined) {
    return (
      <button
        type="button"
        disabled={disabledTitle !== undefined}
        title={disabledTitle}
        className={ACTION_ROW}
      >
        {content}
      </button>
    );
  }
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={ACTION_ROW}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={ACTION_ROW}>
      {content}
    </Link>
  );
}

/**
 * One event on the events page: the artwork on the left; the title, then
 * everything the event can be taken to, then what is left to do and the
 * dates that govern it, on the right. On a wide card what is left to do
 * moves to a column of its own. Nothing here links to somewhere else that
 * repeats it, so the card takes no hover state.
 */
export function EventRow({ event }: { event: DashboardEvent }) {
  const t = useTranslations("Event");
  const tPackages = useTranslations("Packages");
  const locale = useLocale();
  const deletion = formatEventDate(deletionDate(event.date), locale);
  /* Past and past its retention date: the record is a stub, not a tool. */
  const archived = isPast(event) && event.dataDeleted;
  const past = isPast(event);

  return (
    /*
     * The anchor the dashboard's cards aim at, held clear of the top bar so a
     * jump lands with the card's own head in view rather than under the chrome.
     */
    <article
      id={`event-${event.id}`}
      className="@container/card scroll-mt-[88px] rounded-ui border border-neutral-400 bg-neutral-50 shadow-card"
    >
      {/*
       * The artwork, what it is and when with the dates that govern it, and
       * what it can be taken to. The gaps between them match the card's
       * padding. On a phone they stack, with no artwork. From 600 the artwork
       * sits top left with the details beside it and the buttons across
       * below; from 920 (the details keeping 520 beside it: two button
       * columns, the timeline across) the buttons move up beside it too.
       */}
      <div className="grid grid-cols-1 gap-8 p-[18px] @min-[600px]:grid-cols-[auto_minmax(0,1fr)] @min-[600px]:p-8 @min-[920px]:grid-rows-[1fr_auto] @min-[1000px]:gap-x-10 @min-[1000px]:p-10">
        {/*
         * The artwork is the point of a record, so it is shown whole, at a
         * fixed height a little over the tallest the details get beside it.
         * Up to 920 the details alone (272 tall at most, plus their 20 above
         * and below); from there with the buttons (342 at most, plus the
         * 20s; 366 once the buttons grow with the notifications panel).
         */}
        <div className="relative hidden aspect-[7/10] h-[320px] @min-[600px]:block @min-[920px]:row-span-2 @min-[920px]:h-[420px] rail:@min-[920px]:h-[440px]">
          <Image
            src={event.preview}
            alt={t("previewAlt", { title: event.title })}
            fill
            sizes="300px"
            className="rounded-ui border border-secondary-300 object-cover object-top"
          />
        </div>

        {/*
         * What it is and when, then its dates, centred in the room left
         * below. Past its retention date there are no buttons, so the two
         * take the artwork's whole height and sit centred beside it.
         */}
        <div
          className={`@container flex min-w-0 flex-col gap-8 @min-[600px]:py-5 ${
            archived
              ? "justify-center @min-[920px]:row-span-2"
              : "@min-[920px]:pb-0"
          }`}
        >
          {/* 1 — what it is and when. */}
          <div className="min-w-0">
            {/* Date over title, as on the dashboard's cards. */}
            <EventWhen event={event} className="mb-2.5" />
            <h3 className="line-clamp-1 font-serif text-[20px] leading-[26px] text-neutral-950 @2xl:text-[22px]">
              {event.title}
            </h3>

            {/*
             * The package, the visibility and the link. "Custom" on its own
             * reads as a property of the invitation rather than as what was
             * bought, so the package says so. Wraps when it runs out of room.
             */}
            <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] leading-5 text-neutral-800">
              <span>
                {t("package", {
                  name: tPackages(`${event.package}.name`),
                })}
              </span>
              <span aria-hidden="true">·</span>
              <span>{t(event.visibility)}</span>
              {archived ? null : (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <span className="truncate">{invitationLink(event)}</span>
                    {/* Each copies what it stands for: the link, the password. */}
                    <CopyButton
                      value={`https://${invitationLink(event)}`}
                      label={t("copyLinkFor", { title: event.title })}
                      tone="text-neutral-600 hover:text-primary-800"
                      icon="link"
                      copiedLabel={t("linkCopied")}
                    />
                    {event.password ? (
                      <CopyButton
                        value={event.password}
                        label={t("copyPassword")}
                        tone="text-neutral-600 hover:text-primary-800"
                        icon="lock"
                        copiedLabel={t("passwordCopied")}
                      />
                    ) : null}
                  </span>
                </>
              )}
            </p>
          </div>

          {/*
           * The dates that govern the event, over the buttons; past its
           * retention date, only when it was deleted.
           */}
          <div className={archived ? undefined : "my-auto"}>
            {archived ? (
              <p className="text-[14px] leading-5 text-neutral-800">
                {t("dataDeletedOn", {
                  date: deletion,
                  days: GUEST_DATA_RETENTION_DAYS,
                })}
              </p>
            ) : (
              <DatesThatMatter event={event} />
            )}
          </div>
        </div>

        {archived ? null : (
          <div className="@container/actions min-w-0 @min-[600px]:col-span-2 @min-[920px]:col-span-1 @min-[920px]:col-start-2 @min-[920px]:self-end @min-[920px]:pb-5">
            {/*
             * The event's own actions first, then the invitation's.
             * Those are drawn by the template, so an event without one
             * has nothing to edit, print or show yet; content freezes
             * with the event, so a past one can't be edited either.
             */}
            <div className={ACTION_LIST}>
              {/* Editing closes with the event; the record stays readable. */}
              <ActionRow
                icon="pencil"
                label={t("editEvent")}
                href={`/dashboard/events/${event.id}`}
                disabledTitle={past ? t("alreadyHappened") : undefined}
              />
              <ActionRow
                icon="guests"
                label={t("guestList")}
                href={`/dashboard/events/${event.id}/guests`}
              />
              <ActionRow
                icon="seating"
                label={t("seating")}
                disabledTitle={
                  event.seatingAvailable ? undefined : t("seatingPaidOnly")
                }
              />
              <ActionRow
                icon="layers"
                label={t("editInvitation")}
                href={`/invitations/${event.id}`}
                disabledTitle={
                  past
                    ? t("alreadyHappened")
                    : event.templateId
                      ? undefined
                      : t("noDesign")
                }
              />
              <ActionRow
                icon="printer"
                label={t("print")}
                href={`/prints/${event.id}`}
                disabledTitle={event.templateId ? undefined : t("noDesign")}
              />
              {/* The guest page itself, in a tab of its own. */}
              <ActionRow
                icon="eye"
                label={t("viewAsGuest")}
                href={invitationPath(event)}
                external
                disabledTitle={event.templateId ? undefined : t("noDesign")}
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
