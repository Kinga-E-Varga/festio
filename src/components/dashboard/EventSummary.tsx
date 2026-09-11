import Image from "next/image";
import type { ReactNode } from "react";
import {
  BTN_GHOST,
  BTN_PRIMARY,
} from "@/components/dashboard/event-editor/styles";
import { Icon } from "@/components/icons";
import {
  contentFreeze,
  deletionDate,
  formatEventDate,
  formatStamp,
  safeguardBarVars,
} from "@/lib/event";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import type { DashboardEvent } from "@/types/dashboard";

const PANEL_LABEL =
  "mb-3.5 text-[10px] font-semibold tracking-[0.18em] text-mustard-500 uppercase";

/** A dated note; its edge colour says how much attention it wants. */
function DateNote({
  edge,
  title,
  children,
}: {
  edge: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={`mb-3.5 border-l-4 pb-3.5 pl-3.5 last:mb-0 last:pb-0 ${edge}`}>
      <b className="mb-[3px] block text-neutral-900">{title}</b>
      <p className="text-[12.5px] leading-[1.45] text-neutral-700">{children}</p>
    </div>
  );
}

function Tally({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] tracking-[0.1em] text-neutral-700 uppercase">
        {label}
      </dt>
      <dd className="mt-[3px] font-serif text-[22px] leading-none text-neutral-900 tabular-nums">
        {value}
      </dd>
    </div>
  );
}

function Replies({ event }: { event: DashboardEvent }) {
  if (event.dataDeleted) {
    return (
      <div className="border-l-4 border-neutral-500 pl-3.5">
        <b className="mb-[3px] block text-neutral-900">Guest data deleted</b>
        <p className="text-[12.5px] leading-[1.45] text-neutral-700">
          Removed on {formatEventDate(deletionDate(event.date))},{" "}
          {GUEST_DATA_RETENTION_DAYS} days after the event.
        </p>
      </div>
    );
  }

  if (event.rsvp.invited === 0) {
    return (
      <div className="border-l-4 border-mustard-500 pl-3.5">
        <b className="mb-[3px] block text-neutral-900">Nothing shared yet</b>
        <p className="text-[12.5px] leading-[1.45] text-neutral-700">
          The reply form opens when the page becomes reachable.
        </p>
      </div>
    );
  }

  const { cap } = event.safeguard;
  const barVars = safeguardBarVars(event);

  return (
    <>
      <dl className="grid grid-cols-2 gap-x-2 gap-y-2.5">
        <Tally
          label="Replied"
          value={
            <>
              {event.rsvp.replied}
              <small className="font-sans text-[11.5px] text-neutral-700">
                /{event.rsvp.invited}
              </small>
            </>
          }
        />
        <Tally label="Attending" value={event.rsvp.attending} />
        <Tally label="Declined" value={event.rsvp.declined} />
        <Tally label="Pending" value={event.rsvp.pending} />
      </dl>

      <div
        role="img"
        aria-label={`${event.rsvp.attending} attending and ${event.rsvp.declined} declined, against a cap of ${cap}`}
        className="safeguard mt-3"
        style={barVars}
      >
        <span aria-hidden="true" className="attending" />
        <span aria-hidden="true" className="declined" />
      </div>

      <p className="mt-[9px] text-[11.5px] text-neutral-700">
        Safeguard {event.rsvp.replied} of {cap}
      </p>

      {event.unmatched > 0 ? (
        <div className="mt-3.5 flex gap-[9px] border border-rust-400 bg-rust-200 px-[13px] py-[11px] text-[12.5px] leading-[1.45] text-rust-600">
          <Icon name="alert" className="mt-px size-[15px] shrink-0" />
          <p>
            {event.unmatched} unmatched names.{" "}
            <button
              type="button"
              className="font-semibold underline underline-offset-2"
            >
              Review
            </button>
          </p>
        </div>
      ) : null}
    </>
  );
}

/**
 * The record at a glance, sitting in the page above the form. It reports the
 * saved event — the form only becomes the record on save.
 */
export function EventSummary({ event }: { event: DashboardEvent }) {
  const freeze = formatStamp(contentFreeze(event.date));
  const deletion = formatEventDate(deletionDate(event.date));

  return (
    <section className="@container mt-[22px] grid grid-cols-1 border border-mustard-300 bg-mustard-100 @min-[760px]:grid-cols-[minmax(190px,1.05fr)_minmax(280px,1fr)]">
      {/* The artwork is the point of a record, so it takes the larger share. */}
      <div className="flex min-w-0 flex-col items-center gap-2 p-[18px]">
        <div className="mb-1.5 w-full max-w-[400px] leading-none">
          <Image
            src={event.preview}
            alt={event.previewAlt}
            sizes="400px"
            className="h-auto w-full"
          />
        </div>
        <div className="flex w-full max-w-[400px] gap-2">
          <button
            type="button"
            className={`${BTN_PRIMARY} flex-1 gap-1.5 px-2.5 py-[9px] text-[13px] whitespace-nowrap`}
          >
            <Icon name="pencil" className="size-[15px]" />
            Design
          </button>
          <button
            type="button"
            className={`${BTN_GHOST} flex-1 gap-1.5 px-2.5 py-[9px] text-[13px] whitespace-nowrap`}
          >
            <Icon name="eye" className="size-[15px]" />
            View as guest
          </button>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-5 border-t border-mustard-300 p-[18px] @min-[760px]:border-t-0 @min-[760px]:border-l">
        <div className="min-w-0">
          <h3 className={PANEL_LABEL}>Date</h3>
          <p className="font-serif text-2xl leading-[1.1] text-neutral-900">
            {event.dateLabel}
          </p>
          <p
            className={`mt-1.5 text-[12.5px] ${
              event.isNextUp
                ? "font-medium text-terracotta-600"
                : "text-neutral-700"
            }`}
          >
            {event.countdownLabel}
          </p>
        </div>

        <div className="min-w-0 border-t border-mustard-300 pt-5">
          <h3 className={PANEL_LABEL}>Replies</h3>
          <Replies event={event} />
        </div>

        <div className="min-w-0 border-t border-mustard-300 pt-5">
          <h3 className={PANEL_LABEL}>Dates that matter</h3>

          <DateNote
            edge={event.locked ? "border-neutral-500" : "border-mustard-500"}
            title={event.locked ? "Editing closed" : "Editing freezes"}
          >
            {freeze}
            {event.locked || !event.locksInLabel
              ? ""
              : ` — ${event.locksInLabel} from now`}
          </DateNote>

          <DateNote edge="border-steel-500" title="Reply form closes">
            {freeze}
          </DateNote>

          <DateNote edge="border-terracotta-500" title="Record deleted">
            {deletion}
            {event.dataDeleted ? " — done" : ""}
          </DateNote>
        </div>
      </div>
    </section>
  );
}
