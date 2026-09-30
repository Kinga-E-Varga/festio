import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { DatesThatMatter } from "@/components/dashboard/DatesThatMatter";
import { EventWhen } from "@/components/dashboard/EventWhen";
import { ShareFields } from "@/components/dashboard/ShareFields";
import { Icon } from "@/components/icons";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import {
  deletionDate,
  eventStatus,
  isPast,
  formatEventDate,
  invitationPath,
  expectedLevel,
  expectedPercent,
  repliesBarVars,
} from "@/lib/event";
import type { DashboardEvent, EventStatus, IconName } from "@/types/dashboard";

/** The card's left edge says which pile the event is in, as the dashboard's does. */
const STATUS_EDGE: Record<EventStatus, string> = {
  active: "border-l-forest-500",
  draft: "border-l-terracotta-500",
  past: "border-l-neutral-600",
};

/** The quiet heading that names each section, as the event editor sets it. */
const PANEL_LABEL =
  "mb-3.5 text-[10px] font-semibold tracking-[0.18em] text-mustard-500 uppercase";

/**
 * The rule between two of the card's sections. A pseudo-element rather than a
 * border, because a border runs the whole side of the box it is on and these
 * have to stop 20px short — of the card's own edges, and of each other where a
 * vertical rule comes down to meet a horizontal one at a row boundary. The
 * card itself stays unpadded, so nothing but the rules moves.
 *
 * Each section carries both and shows one: `before` across its top while the
 * sections are stacked, `after` down its left once they sit side by side. Two
 * pseudo-elements rather than one that turns, since turning it would mean
 * taking back `top` and `h-px` inside the same breakpoint, where Tailwind's
 * property order — not the class string — settles which wins.
 */
export const RULE = `relative before:pointer-events-none before:absolute before:inset-x-5 before:top-0 before:h-px before:bg-mustard-300 before:content-[''] after:pointer-events-none after:absolute after:inset-y-5 after:left-0 after:hidden after:w-px after:bg-mustard-300 after:content-['']`;

/**
 * Where the actions sit: a row of their own under the artwork and details
 * while the card has two columns, the third column once it has three.
 */
const ACTIONS_PLACE =
  "@min-[900px]:col-span-2 @min-[900px]:row-start-2 @min-[1200px]:col-span-1 @min-[1200px]:col-start-3 @min-[1200px]:row-start-1";

/** Every section after the first hangs off a hairline of its own. */
const PANEL = "min-w-0 border-t border-mustard-300 pt-6";

/**
 * The actions, one set. Under the card they fill two columns top to bottom —
 * the event's three, then the invitation's — a gap apart; within a column
 * neighbours butt together and share their edges as the sharing fields do —
 * each pulls back over the one before by its border, and the list gives that
 * pixel back at its top and left. In their own column they spread down its
 * height instead, evenly apart, each with its own full border — at most 460px
 * from first to last, centred in a column taller than that.
 */
const ACTION_LIST =
  "grid grid-cols-1 pt-px pl-px @min-[500px]:grid-flow-col @min-[500px]:grid-cols-2 @min-[500px]:grid-rows-3 @min-[500px]:gap-x-10 @min-[1200px]:flex @min-[1200px]:max-h-[400px] @min-[1200px]:flex-1 @min-[1200px]:flex-col @min-[1200px]:justify-around @min-[1200px]:p-0 @min-[1200px]:[&>*]:m-0";

/**
 * One action: icon, label, and where it leads on the far side. Set
 * like the sharing fields — their fill, border, text and icon colours — so the
 * row reads as part of the card; hover fills it with the border colour.
 */
const ACTION_ROW =
  "-mt-px -ml-px flex w-full items-center gap-3 px-3.5 py-[13px] text-left text-[13px] leading-[1.3] font-[450] border border-mustard-300 bg-mustard-50 text-neutral-900 transition-colors not-disabled:hover:border-mustard-300 not-disabled:hover:bg-mustard-300 disabled:cursor-not-allowed disabled:opacity-50";

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
      <Icon name={icon} className="size-[15px] text-neutral-700" />
      <span className="min-w-0 flex-1">{label}</span>
      <Icon
        name={external ? "arrowUpRight" : "chevron"}
        className={`size-[13px] text-neutral-700 ${external ? "" : "-rotate-90"}`}
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

function Tally({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  /** Denominator kept small so four tallies fit the row, e.g. "/124". */
  detail?: string;
}) {
  return (
    <div>
      <dt className="text-[10px] tracking-[0.1em] text-neutral-700 uppercase">
        {label}
      </dt>
      <dd className="mt-[3px] font-serif text-[22px] leading-none text-neutral-900 tabular-nums">
        {value}
        {detail ? (
          <span className="font-sans text-[11.5px] text-neutral-700">
            {detail}
          </span>
        ) : null}
      </dd>
    </div>
  );
}

/**
 * One event on the events page: the artwork on the far left; beside it the
 * title with what the event says about itself under it; and everything it can
 * be taken to in a column of its own on the right. Nothing here links to
 * somewhere else that repeats it, so the card takes no hover state.
 */
export function EventRow({ event }: { event: DashboardEvent }) {
  const t = useTranslations("Event");
  const tPackages = useTranslations("Packages");
  const locale = useLocale();
  const deletion = formatEventDate(deletionDate(event.date), locale);
  const expected = event.expectedGuests;
  const replied = event.rsvp.replied;
  const percent = expectedPercent(replied, expected);
  const barVars = repliesBarVars(event);
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
      className={`@container scroll-mt-[88px] border border-mustard-300 border-l-4 bg-mustard-100 ${STATUS_EDGE[eventStatus(event)]}`}
    >
      {/*
       * The artwork down the left; beside it the event — its title with the
       * details under it, one column — and the actions in a column of their
       * own on a wide card.
       * Narrower, the actions drop to a row of their own across the whole
       * card, and on a phone everything stacks. The artwork takes only the
       * width it needs, the actions a quarter of the card up to 280px — so
       * they narrow with it before they drop below — and the details fill
       * whatever is left. Every section pads itself evenly, and that padding
       * is all the room the card has above and below.
       */}
      <div className="grid grid-cols-1 @min-[900px]:grid-cols-[auto_minmax(0,1fr)] @min-[1200px]:grid-cols-[auto_minmax(0,1fr)_min(25cqw,280px)]">
        {/* The artwork is the point of a record, so it is shown whole. */}
        <div className="flex items-center justify-center px-[18px] py-6 @min-[900px]:py-10 @min-[1000px]:py-12 @min-[900px]:col-start-1 @min-[900px]:row-start-1 @min-[900px]:px-5 @min-[1000px]:px-10">
          {/*
           * Invitations are portrait, so width alone would let a wide card
           * make the card taller than anything beside it. Beside the details
           * the height is set outright — 40% of the card's width, at most
           * 500px — and the width follows the artwork's own proportions, so
           * the artwork narrows along with the card rather than leaving the
           * details to take all of it. Stacked, the width is set instead:
           * the whole column, at most what a 500px-tall A4 card is wide.
           * Either way the size is the card's to decide, never the file's —
           * which file loads varies with the screen's pixel density.
           */}
          <div className="flex w-full justify-center leading-none">
            <Image
              src={event.preview}
              alt={t("previewAlt", { title: event.title })}
              sizes="360px"
              className="h-auto w-full max-w-[352px] border border-mustard-300 @min-[900px]:h-[min(500px,40cqw)] @min-[900px]:w-auto @min-[900px]:max-w-none"
            />
          </div>
        </div>

        {/*
         * The event itself, one column: what it is and when at the top, and
         * what it says about itself under that. One rule down its left, beside
         * the artwork; centred against it when the artwork is taller. On a
         * phone the column's own box steps aside, so the title can lead the
         * whole card above the artwork and the details follow it.
         */}
        <div
          className={`contents min-w-0 flex-col justify-center @min-[900px]:col-start-2 @min-[900px]:row-start-1 @min-[900px]:flex @min-[900px]:px-5 @min-[900px]:py-10 @min-[1000px]:py-12 @min-[1000px]:px-10 ${RULE} before:hidden @min-[900px]:after:block`}
        >
          {/*
           * 1 — what it is and when. Its rule sits inside the padding, so it
           * stops short of the card's edges like every other. First of all on
           * a phone, where it holds its own margins.
           */}
          <div className="order-first mx-[18px] mt-8 min-w-0 border-b border-mustard-300 pb-8 @min-[900px]:order-none @min-[900px]:m-0 @min-[900px]:pb-6">
            <div className="min-w-0">
              <h3 className="font-serif text-[21px] leading-[1.2] text-neutral-900 @2xl:text-[23px]">
                {event.title}
              </h3>

              <EventWhen event={event} />

              {/*
               * The package alone. "Custom" on its own reads as a property of
               * the invitation rather than as what was bought, so it says so.
               */}
              <p className="mt-2.5 text-[13px] text-neutral-700">
                {t("package", {
                  name: tPackages(`${event.package}.name`),
                })}
              </p>
            </div>
          </div>

          {/*
           * 2–4 — what the event says about itself, section by section. The
           * title's rule stands in for the first section's own; on a phone,
           * where the artwork sits between them, it takes a rule of its own.
           */}
          <div
            className={`flex w-full min-w-0 flex-col gap-6 px-[18px] py-8 @min-[900px]:p-0 @min-[900px]:pt-6 [&>:first-child]:border-t-0 [&>:first-child]:pt-0 ${RULE} @min-[900px]:before:hidden`}
          >
            {/* 2 — how a guest reaches it. */}
            {archived ? null : (
              <div className={PANEL}>
                <h4 className={PANEL_LABEL}>{t("sharing")}</h4>
                <ShareFields event={event} className="max-w-[340px]" />
              </div>
            )}

            {/* 3 — how many have answered. */}
            {archived ? null : (
              <div className={PANEL}>
                <h4 className={PANEL_LABEL}>{t("replies")}</h4>

                {event.rsvp.invited === 0 ? (
                  <p className="text-[12.5px] leading-[1.45] text-neutral-700">
                    {t("nothingShared")}
                  </p>
                ) : (
                  <>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 @min-[400px]:grid-cols-4">
                      <Tally
                        label={t("replied")}
                        value={event.rsvp.replied}
                        detail={`/${event.rsvp.invited}`}
                      />
                      <Tally
                        label={t("attending")}
                        value={event.rsvp.attending}
                      />
                      <Tally
                        label={t("declined")}
                        value={event.rsvp.declined}
                      />
                      <Tally label={t("pending")} value={event.rsvp.pending} />
                    </dl>

                    <div
                      role="img"
                      aria-label={t("barAria", {
                        attending: event.rsvp.attending,
                        declined: event.rsvp.declined,
                        expected,
                      })}
                      className="replies-bar mt-3.5"
                      data-level={expectedLevel(percent)}
                      style={barVars}
                    >
                      <span aria-hidden="true" className="attending" />
                      <span aria-hidden="true" className="declined" />
                    </div>

                    <p className="mt-[9px] flex items-center gap-2 text-[11.5px] text-neutral-700">
                      <span className="flex-1">
                        {t("expectedLine", { replied, expected, percent })}
                      </span>
                      <button
                        type="button"
                        className="text-forest-500 underline underline-offset-2 transition-colors hover:text-forest-600"
                      >
                        {t("raiseExpected")}
                      </button>
                    </p>
                  </>
                )}
              </div>
            )}

            {/* 4 — the deadlines that govern it. */}
            <div className={PANEL}>
              <h4 className={PANEL_LABEL}>{t("datesThatMatter")}</h4>
              {archived ? (
                <p className="text-[12.5px] leading-[1.45] text-neutral-700">
                  {t("dataDeletedOn", {
                    date: deletion,
                    days: GUEST_DATA_RETENTION_DAYS,
                  })}
                </p>
              ) : (
                <DatesThatMatter event={event} layout="row" />
              )}
            </div>
          </div>
        </div>

        {/*
         * Everything this event can be taken to: a column of its own on a
         * wide card, a row across the whole card below that. A record whose guest
         * data is gone has nothing left to act on, so it holds the column
         * empty instead — same track, no rule, so a deleted record lines
         * up with every other card rather than reflowing.
         */}
        {archived ? (
          <div aria-hidden="true" className={ACTIONS_PLACE} />
        ) : (
          <div
            className={`block px-[18px] py-8 @min-[900px]:py-10 @min-[1000px]:py-12 @min-[900px]:px-5 ${ACTIONS_PLACE} @min-[1000px]:px-10 @min-[1200px]:flex @min-[1200px]:flex-col @min-[1200px]:justify-center ${RULE} @min-[1200px]:before:hidden @min-[1200px]:after:block`}
          >
            {/*
             * The event's own actions first, then the invitation's. Those are
             * drawn by the template, so an event without one has nothing to
             * edit, print or show yet; content freezes with the event, so a
             * past one can't be edited either.
             */}
            <div className={ACTION_LIST}>
              {/* Editing closes with the event, but the record stays readable. */}
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
