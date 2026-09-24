"use client";

import { useTranslations } from "next-intl";
import { useEffect, useEffectEvent } from "react";
import { Toast, useToast } from "@/components/dashboard/Toast";
import { Banner } from "@/components/dashboard/event-editor/Banner";
import { AddNamesBox } from "@/components/dashboard/guest-list/AddNamesBox";
import { GuestSearch } from "@/components/dashboard/guest-list/GuestSearch";
import { GuestSummary } from "@/components/dashboard/guest-list/GuestSummary";
import { GuestTable } from "@/components/dashboard/guest-list/GuestTable";
import { GuestToolbar } from "@/components/dashboard/guest-list/GuestToolbar";
import { useGuestActions } from "@/components/dashboard/guest-list/useGuestActions";
import { useGuestList } from "@/components/dashboard/guest-list/useGuestList";
import { NEW_ROW, useRowEditor } from "@/components/dashboard/guest-list/useRowEditor";
import type { DashboardEvent } from "@/types/dashboard";
import type { EventGuests } from "@/types/guests";

interface GuestManagerProps {
  event: DashboardEvent;
  initial: EventGuests;
}

/** Everyone the event knows about, in one list the host can read and fix. */
export function GuestManager({ event, initial }: GuestManagerProps) {
  const tPage = useTranslations("EventPage");
  const tNotes = useTranslations("EventNotes");
  const toast = useToast();
  const list = useGuestList(initial, event.preloaded);
  const actions = useGuestActions(list.edit, toast.show, { guests: list.guests, useList: list.useList });
  const editor = useRowEditor(list.rows);

  /* The editor's "Edit list" lands here on `#list`: open the box it means. */
  const openFromHash = useEffectEvent(() => {
    if (window.location.hash === "#list") list.openAddNames();
  });
  useEffect(() => {
    const frame = requestAnimationFrame(openFromHash);
    return () => cancelAnimationFrame(frame);
  }, []);

  function addNames(names: string[]) {
    actions.addNames(names);
    list.set.addOpen(false);
  }

  return (
    <>
      {/* Live from the rows, so it clears as the host sorts names out. */}
      {list.useList && list.counts.unmatched > 0 ? (
        <Banner tone="warn" icon="alert" title={tPage("unmatchedTitle", { count: list.counts.unmatched })}>
          {tPage("unmatchedBody")}
        </Banner>
      ) : null}

      <div className="mt-[35px]">
        {event.attendeeNotes?.length ? (
          <p className="mb-[22px] text-[12.5px] text-neutral-700">
            {event.attendeeNotes.map((note) => tNotes(note.key, note.values)).join(" · ")}
          </p>
        ) : null}

        <GuestToolbar
          useList={list.useList}
          onUseList={(value) => editor.guard(() => list.set.useList(value))}
          onAddNames={() => editor.guard(list.openAddNames)}
          onAddGuest={() => editor.open(NEW_ROW)}
        />
      </div>

      {list.addOpen ? (
        <AddNamesBox list={list.guests.list} onAdd={addNames} onCancel={() => list.set.addOpen(false)} />
      ) : null}

      <div className="mt-[22px] flex flex-wrap items-center gap-x-4 gap-y-3">
        <GuestSummary
          counts={list.counts}
          total={list.rows.length}
          useList={list.useList}
          filter={list.filter}
          expected={event.expectedGuests}
          onFilter={list.set.filter}
        />
        <GuestSearch query={list.query} onQuery={list.set.query} />
      </div>

      <GuestTable list={list} actions={actions} editor={editor} onStartList={() => editor.guard(list.openAddNames)} />

      <Toast message={toast.message} />
    </>
  );
}
