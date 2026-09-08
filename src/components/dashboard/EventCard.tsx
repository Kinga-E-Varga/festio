import Image from "next/image";
import type { CSSProperties } from "react";
import { CopyButton } from "@/components/dashboard/CopyButton";
import { PasswordField } from "@/components/dashboard/PasswordField";
import { Icon } from "@/components/icons";
import type {
  DashboardEvent,
  EventStatus,
  IconName,
  Visibility,
} from "@/types/dashboard";

const VISIBILITY: Record<Visibility, { label: string; icon: IconName }> = {
  hidden: { label: "Hidden", icon: "eyeOff" },
  public: { label: "Public", icon: "globe" },
  protected: { label: "Protected", icon: "shield" },
};

/** The card's left edge says at a glance which pile the event is in. */
const STATUS_EDGE: Record<EventStatus, string> = {
  active: "border-l-forest-400",
  draft: "border-l-terracotta-500",
  past: "border-l-neutral-600 opacity-[0.86]",
};

const ACTION =
  "flex items-center justify-center gap-[9px] rounded-md border border-forest-400 bg-mustard-50 px-2 py-[11px] text-forest-600 transition-colors hover:border-forest-500 hover:bg-forest-200";
const ACTION_DISABLED =
  "flex cursor-not-allowed items-center justify-center gap-[9px] rounded-md border border-forest-400 bg-mustard-100 px-2 py-[11px] text-neutral-700 opacity-[0.65]";
/** Two wide buttons then three narrow ones, until there is room for five. */
const ACTION_WIDE = "col-span-3 @xl:col-span-1";
const ACTION_NARROW = "col-span-2 @xl:col-span-1";

const FIELD =
  "flex items-center gap-[9px] border border-mustard-300 bg-mustard-50 px-3 py-2 text-[13px] text-neutral-900";

function Tally({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  /** Denominator kept small so four tallies fit the column, e.g. "/124". */
  detail?: string;
}) {
  return (
    // Narrow cards read better as label-left / value-right rows; once four fit
    // across, the value sits under its label instead.
    <div className="flex items-baseline justify-between gap-2.5 @2xl:block">
      <dt className="text-[10px] tracking-[0.1em] text-neutral-700 uppercase">
        {label}
      </dt>
      <dd className="font-serif text-[25px] leading-none text-neutral-900 tabular-nums @2xl:mt-1">
        {value}
        {detail ? (
          <span className="font-sans text-xs text-neutral-700">{detail}</span>
        ) : null}
      </dd>
    </div>
  );
}

export function EventCard({ event }: { event: DashboardEvent }) {
  const visibility = VISIBILITY[event.visibility];
  const { confirmed, cap } = event.safeguard;
  const safeguardPercent = cap > 0 ? Math.round((confirmed / cap) * 100) : 0;

  // Yes and no stack against the same cap, so the bar shows how much of the
  // safeguard is already spoken for and how much is still open.
  const attending =
    cap > 0 ? Math.min(100, (event.rsvp.attending / cap) * 100) : 0;
  const declined =
    cap > 0 ? Math.min(100 - attending, (event.rsvp.declined / cap) * 100) : 0;
  const barVars = {
    "--attending": `${attending}%`,
    "--declined": `${declined}%`,
  } as CSSProperties;

  return (
    <article
      className={`border border-mustard-300 border-l-4 bg-mustard-100 ${STATUS_EDGE[event.status]}`}
    >
      {/*
       * The nav and the activity rail both eat into the card's width, so its
       * layout keys off the card itself rather than the viewport.
       */}
      <div className="@container">
        {/*
         * The full-size preview only earns its place while the details beside
         * it can still hold the meta row on one line. That row needs 286px, so
         * with the 142 preview, the 26 gap and 32 of padding the card has to
         * be 488 wide; under that it falls back to the compact head — a small
         * preview with just the date and the wrapped title alongside.
         */}
        <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-x-4 px-4 pt-[18px] pb-5 @min-[488px]:flex @min-[488px]:flex-wrap @min-[488px]:gap-x-[26px] @min-[488px]:gap-y-5 @2xl:px-6 @2xl:pt-[22px]">
          <div className="contents @min-[488px]:flex @min-[488px]:min-w-0 @min-[488px]:flex-1 @min-[488px]:gap-[26px] @min-[904px]:min-w-[498px]">
            <div className="col-start-1 row-start-1 self-start bg-neutral-50 @min-[488px]:h-[198px] @min-[488px]:shrink-0">
              <Image
                src={event.preview}
                alt={event.previewAlt}
                sizes="200px"
                className="w-full @min-[488px]:h-full @min-[488px]:w-auto"
              />
            </div>

            {/* Nudged down so the date starts just below the preview's top edge. */}
            <div className="contents @min-[488px]:block @min-[488px]:min-w-0 @min-[488px]:flex-1 @min-[488px]:pt-1.5 @min-[904px]:min-w-[330px]">
              {/*
               * Date and title travel together so the pair can sit centred
               * against the compact preview instead of starting at its top.
               */}
              <div className="col-start-2 row-start-1 self-center">
                <p className="mb-4 text-[12.5px] leading-none text-neutral-700">
                  <span className="font-medium text-neutral-900">
                    {event.dateLabel}
                  </span>
                  <span aria-hidden="true">{" · "}</span>
                  <span
                    className={
                      event.isNextUp ? "font-medium text-terracotta-600" : ""
                    }
                  >
                    {event.countdownLabel}
                  </span>
                </p>

                {/* Wraps beside the compact preview; clipped beside the full one. */}
                <h3 className="font-serif text-[20px] leading-[1.2] text-neutral-900 @min-[488px]:mb-5 @min-[488px]:truncate @2xl:mb-4 @2xl:text-2xl">
                  {/*
                   * The clamp sits on a child, not the heading: the heading is a
                   * grid item in the compact layout, and grid items blockify
                   * `-webkit-box` away, which would drop the clamp entirely.
                   */}
                  <span className="@max-[488px]:line-clamp-3">
                    {event.title}
                  </span>
                </h3>
              </div>

              <div className="col-span-full row-start-2 mt-4 mb-3 flex flex-wrap items-center gap-4 text-[13px] text-neutral-700 @min-[488px]:mt-0 @2xl:mb-3.5">
                <span className="flex items-center gap-1.5">
                  <Icon name={visibility.icon} className="size-3.5" />
                  {visibility.label}
                </span>
                <span>{event.tierLabel}</span>
                {event.editLockLabel ? (
                  <span className="flex items-center gap-1.5 border border-terracotta-400 bg-terracotta-200 px-2.5 py-1 text-xs font-semibold text-terracotta-600">
                    <Icon name="clock" className="size-3.5" />
                    {event.editLockLabel}
                  </span>
                ) : null}
              </div>

              {/* Stacked fields butt together and share their edges. */}
              <div className="col-span-full row-start-3 flex max-w-[330px] flex-col [&>*+*]:border-t-0">
                <span className={FIELD}>
                  <Icon
                    name="link"
                    className="size-3.5 shrink-0 text-forest-500"
                  />
                  <span className="flex-1 truncate">{event.link}</span>
                  <CopyButton
                    value={`https://${event.link}`}
                    label={`Copy invitation link for ${event.title}`}
                  />
                </span>

                {event.password ? (
                  <PasswordField password={event.password} />
                ) : null}

                {event.linkNote ? (
                  <span className={FIELD}>
                    <Icon
                      name="eyeOff"
                      className="size-3.5 shrink-0 text-neutral-700"
                    />
                    {event.linkNote}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/*
           * Once it sits beside the details it starts at 330px and takes the
           * smaller share of any leftover width, up to 480px.
           */}
          <div className="col-span-full row-start-4 mt-4 @min-[488px]:mt-0 @min-[488px]:w-full @min-[904px]:w-[330px] @min-[904px]:max-w-[480px] @min-[904px]:min-w-[330px] @min-[904px]:flex-[0.7_1_330px] @min-[904px]:border-l @min-[904px]:border-mustard-300 @min-[904px]:pl-[26px]">
            <dl className="mb-3 grid grid-cols-2 gap-x-5 gap-y-[9px] @2xl:grid-cols-4 @2xl:gap-1.5">
              <Tally
                label="Replied"
                value={event.rsvp.replied}
                detail={`/${event.rsvp.invited}`}
              />
              <Tally label="Attending" value={event.rsvp.attending} />
              <Tally label="Declined" value={event.rsvp.declined} />
              <Tally label="Pending" value={event.rsvp.pending} />
            </dl>

            <div
              role="img"
              aria-label={`Attendee safeguard: ${event.rsvp.attending} attending and ${event.rsvp.declined} declined, against a cap of ${cap}`}
              className="safeguard"
              style={barVars}
            >
              <span aria-hidden="true" className="attending" />
              <span aria-hidden="true" className="declined" />
            </div>

            <p className="mt-[7px] flex items-center gap-2 text-[11.5px] text-neutral-700">
              <span className="flex-1">
                {/* Roomy only while the column runs the full width of the card. */}
                <span className="hidden @2xl:inline @min-[904px]:hidden">
                  Attendee{" "}
                </span>
                safeguard {confirmed} of {cap} · {safeguardPercent}%
              </span>
              <button
                type="button"
                className="text-forest-500 underline underline-offset-2 transition-colors hover:text-forest-600"
              >
                Raise cap
              </button>
            </p>

            {event.note ? (
              event.note.tone === "warning" ? (
                <div className="mt-4 flex gap-[9px] border border-rust-400 bg-rust-200 px-[13px] py-[11px] text-[12.5px] leading-[1.45] text-rust-600">
                  <Icon name="alert" className="mt-px size-[15px] shrink-0" />
                  <p>
                    {event.note.text}
                    {event.note.actionLabel ? (
                      <>
                        {" "}
                        <button
                          type="button"
                          className="font-semibold underline underline-offset-2"
                        >
                          {event.note.actionLabel}
                        </button>
                      </>
                    ) : null}
                  </p>
                </div>
              ) : (
                <p className="mt-4 border-l-[3px] border-forest-500 py-0.5 pl-3 text-[12.5px] text-neutral-700">
                  {event.note.text}
                </p>
              )
            ) : null}
          </div>
        </div>

        <div className="mx-4 grid grid-cols-6 gap-2.5 border-t border-mustard-300 pt-[18px] pb-[22px] @2xl:mx-6 @2xl:gap-3.5 @xl:grid-cols-5">
          <button type="button" className={`${ACTION} ${ACTION_WIDE}`}>
            <Icon name="pencil" className="size-[15px]" />
            Edit
          </button>
          <button type="button" className={`${ACTION} ${ACTION_WIDE}`}>
            <Icon name="eye" className="size-[15px]" />
            View
          </button>
          <button type="button" className={`${ACTION} ${ACTION_NARROW}`}>
            <Icon name="printer" className="size-[15px]" />
            Print
          </button>
          <button type="button" className={`${ACTION} ${ACTION_NARROW}`}>
            <Icon name="guests" className="size-[15px]" />
            Guests
          </button>
          {event.seatingAvailable ? (
            <button type="button" className={`${ACTION} ${ACTION_NARROW}`}>
              <Icon name="seating" className="size-[15px]" />
              Seating
            </button>
          ) : (
            <button
              type="button"
              disabled
              title="Seating charts come with paid invitations"
              className={`${ACTION_DISABLED} ${ACTION_NARROW}`}
            >
              <Icon name="seating" className="size-[15px]" />
              Seating
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
