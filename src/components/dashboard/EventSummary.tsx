import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  BTN_GHOST,
  BTN_PRIMARY,
} from "@/components/dashboard/event-editor/styles";
import { DatesThatMatter } from "@/components/dashboard/DatesThatMatter";
import { SafeguardBar } from "@/components/dashboard/SafeguardBar";
import { Icon } from "@/components/icons";
import { deletionDate, formatEventDate, invitationPath } from "@/lib/event";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import type { DashboardEvent } from "@/types/dashboard";

const PANEL_LABEL =
  "mb-3.5 text-[10px] font-semibold tracking-[0.18em] text-mustard-500 uppercase";

/** The two controls under the preview share a size, whatever they render as. */
const ACTION = "flex-1 gap-1.5 px-2.5 py-[9px] text-[13px] whitespace-nowrap";

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

      <SafeguardBar event={event} />

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
        {/*
         * Both actions need a design to lead anywhere: the editor and the
         * guest page are the same template, and neither route exists for an
         * event that hasn't picked one. Until it has, they stay as disabled
         * buttons rather than links into a 404.
         */}
        <div className="flex w-full max-w-[400px] gap-2">
          {event.templateId ? (
            <>
              <Link
                href={`/invitations/${event.id}`}
                className={`${BTN_PRIMARY} ${ACTION}`}
              >
                <Icon name="pencil" className="size-[15px]" />
                Design
              </Link>
              {/*
               * A new tab, because the guest page is the whole screen and
               * carries no way back to the dashboard.
               */}
              <Link
                href={invitationPath(event)}
                target="_blank"
                rel="noreferrer"
                className={`${BTN_GHOST} ${ACTION}`}
              >
                <Icon name="eye" className="size-[15px]" />
                View as guest
              </Link>
            </>
          ) : (
            <>
              <button
                type="button"
                disabled
                title="Pick a design for this invitation first"
                className={`${BTN_PRIMARY} ${ACTION}`}
              >
                <Icon name="pencil" className="size-[15px]" />
                Design
              </button>
              <button
                type="button"
                disabled
                title="Pick a design for this invitation first"
                className={`${BTN_GHOST} ${ACTION}`}
              >
                <Icon name="eye" className="size-[15px]" />
                View as guest
              </button>
            </>
          )}
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
          <DatesThatMatter event={event} />
        </div>
      </div>
    </section>
  );
}
