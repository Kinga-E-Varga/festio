"use client";

import { BTN_DANGER } from "@/components/dashboard/event-editor/styles";
import { Icon } from "@/components/icons";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import type { DashboardEvent } from "@/types/dashboard";

interface DangerZoneProps {
  event: DashboardEvent;
  onAction: (message: string) => void;
}

export function DangerZone({ event, onAction }: DangerZoneProps) {
  const replied = event.rsvp.replied;

  return (
    <section className="mt-[58px] border border-rust-300 bg-rust-100">
      <h2 className="bg-rust-500 px-5 py-3.5 text-[10px] font-semibold tracking-[0.18em] text-mustard-50 uppercase">
        Delete this event
      </h2>

      {event.status === "past" ? (
        <div className="flex items-center gap-5 px-5 py-[18px]">
          <div className="flex-1 text-rust-500">
            <b className="mb-1 block">This event has already happened</b>
            <p className="text-[13.5px] leading-[1.5]">
              There is nothing left to cancel. The record disappears on its own
              at the deletion date above.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-5 py-[18px] @min-[640px]:flex-row @min-[640px]:items-center @min-[640px]:gap-5">
          <div className="flex-1 text-rust-500">
            <b className="mb-1 block">Cancel the event</b>
            <p className="text-[13.5px] leading-[1.5]">
              Closes the RSVP form and replaces the invitation with a short
              message from you.{" "}
              {replied > 0
                ? `${replied} guests have already replied and none of them will be notified.`
                : "No guest has replied yet."}{" "}
              Guest and event data are kept for another{" "}
              {GUEST_DATA_RETENTION_DAYS} days, and you can reopen the event at
              any point in that window.
            </p>
          </div>
          <button
            type="button"
            className={BTN_DANGER}
            onClick={() =>
              onAction("Event cancelled — the invitation now shows your message")
            }
          >
            <Icon name="ban" className="size-[15px]" />
            Cancel event
          </button>
        </div>
      )}

      {event.paid ? null : (
        <div className="flex flex-col gap-3 border-t border-rust-300 px-5 py-[18px] @min-[640px]:flex-row @min-[640px]:items-center @min-[640px]:gap-5">
          <div className="flex-1 text-rust-500">
            <b className="mb-1 block">Delete the draft</b>
            <p className="text-[13.5px] leading-[1.5]">
              Nobody has seen this page and nothing has been paid for, so it can
              be removed outright. The address is released and cannot be claimed
              again.
            </p>
          </div>
          <button
            type="button"
            className={BTN_DANGER}
            onClick={() => onAction("Draft deleted")}
          >
            <Icon name="trash" className="size-[15px]" />
            Delete draft
          </button>
        </div>
      )}
    </section>
  );
}
