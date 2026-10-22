"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";
import { Toast, useToast } from "@/components/dashboard/Toast";
import { CONTENT_WIDTH } from "@/components/dashboard/styles";
import { AddNamesBox } from "@/components/dashboard/guest-list/AddNamesBox";
import { SearchField } from "@/components/dashboard/SearchField";
import { GuestTable } from "@/components/dashboard/guest-list/GuestTable";
import { GuestToolbar } from "@/components/dashboard/guest-list/GuestToolbar";
import { ReplySummary } from "@/components/dashboard/guest-list/ReplySummary";
import { fold } from "@/components/dashboard/guest-list/styles";
import { useGuestActions } from "@/components/dashboard/guest-list/useGuestActions";
import { useGuestList } from "@/components/dashboard/guest-list/useGuestList";
import {
  NEW_ROW,
  useRowEditor,
} from "@/components/dashboard/guest-list/useRowEditor";
import { useLeaveWarning } from "@/lib/leave-warning";
import type { DashboardEvent } from "@/types/dashboard";
import type { EventGuests, ListName } from "@/types/guests";

interface GuestManagerProps {
  event: DashboardEvent;
  initial: EventGuests;
}

/** The list box rolls up from the buttons under it (`fold`, from nothing as it mounts) and back down into them. */
const boxRoll = (leaving: boolean) =>
  `${fold(!leaving)} starting:grid-rows-[0fr] starting:opacity-0 ${leaving ? "pointer-events-none" : ""}`;

/** Everyone the event knows about, in one list the host can read and fix. */
export function GuestManager({ event, initial }: GuestManagerProps) {
  const t = useTranslations("GuestList");
  const toast = useToast();
  /*
   * Two tabs on one page, picked by `?view=`, so switching keeps the list's
   * edits (they live here, in memory, until there is a store).
   */
  const summary = useSearchParams().get("view") === "summary";
  const list = useGuestList(initial, event.preloaded);
  const actions = useGuestActions(list.edit, toast.show, {
    guests: list.guests,
    useList: list.useList,
  });
  const editor = useRowEditor(list.rows, startEditing, holdForBox);
  /* The list box's draft, as the page-leave warning needs it; gone with the box. */
  const [boxDirty, setBoxDirty] = useState(false);

  /* The editor's "Edit list" lands here on `#list`: open the box it means. */
  const openFromHash = useEffectEvent(() => {
    if (window.location.hash === "#list") list.openAddNames();
  });
  useEffect(() => {
    const frame = requestAnimationFrame(openFromHash);
    return () => cancelAnimationFrame(frame);
  }, []);

  /* The box stays until it has rolled away; with reduced motion there's no roll, so it goes at once. */
  const [leaving, setLeaving] = useState(false);
  /* Fading out, the box is already saved or discarded. */
  const boxUnsaved = list.addOpen && !leaving && boxDirty;
  useLeaveWarning(editor.unsaved || boxUnsaved, t("leaveUnsaved"));
  /* An action held back by the list box's unsaved changes; wrapped, like the row editor's. */
  const [boxPending, setBoxPending] = useState<(() => void) | null>(null);
  const [boxAsked, setBoxAsked] = useState(0);
  function closeBox() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      closeNow();
    else setLeaving(true);
  }
  /*
   * The list box and a row editor are never open together: opening one
   * closes the other (each asks first when the other has unsaved changes).
   * Opening again mid-roll keeps the box, draft and all.
   */
  function openBox() {
    editor.close();
    setLeaving(false);
    list.openAddNames();
  }
  function startEditing(id: string | null) {
    list.set.keep(id);
    if (id !== null && list.addOpen && !leaving) closeBox();
  }
  function closeNow() {
    setLeaving(false);
    setBoxPending(null);
    list.set.addOpen(false);
  }

  /*
   * While the list box has unsaved changes, any change to the table (edit,
   * New reply, delete, the fixes, the list switch) asks with the box's own
   * discard prompt; Discard closes the box, then does it.
   */
  function holdForBox(action: () => void) {
    if (boxUnsaved) {
      setBoxPending(() => action);
      setBoxAsked((n) => n + 1);
    } else action();
  }
  function discardBox() {
    const action = boxPending;
    closeNow();
    action?.();
  }

  function saveList(added: ListName[], removedIds: string[]) {
    actions.saveList(added, removedIds);
    closeBox();
  }

  /* Replied = on the list but no longer waiting: the table's own reading. */
  const waitingIds = new Set(list.waiting.map((entry) => entry.id));
  const repliedIds = new Set(
    list.guests.list.flatMap((entry) =>
      waitingIds.has(entry.id) ? [] : [entry.id],
    ),
  );

  return (
    <>
      {summary ? (
        <div className={`@container mt-6 ${CONTENT_WIDTH.page}`}>
          <ReplySummary
            tally={list.tally}
            counts={list.counts}
            useList={list.useList}
            expected={event.expectedGuests}
            eventId={event.id}
          />
        </div>
      ) : (
        <div className={`@container mt-6 ${CONTENT_WIDTH.page}`}>
          {/*
           * The table's header: the list box when open, then the search and
           * the list's actions.
           */}
          <div className="mb-4 flex flex-col gap-4">
            {/* Above everything it opens from, 32px over the buttons. */}
            {list.addOpen ? (
              <div
                onTransitionEnd={(event) => {
                  if (leaving && event.target === event.currentTarget)
                    closeNow();
                }}
                className={`-mb-4 ${boxRoll(leaving)}`}
              >
                {/* Pinned to its foot, so the bottom shows first and it grows upward. The column's gap is taken back (-mb-4) and the 32px under the box folds with it, so nothing jumps; 1px on top for the box's own -mt-px (`SUBBOX`). */}
                <div className="flex min-h-0 flex-col justify-end overflow-hidden">
                  <div className="pt-px pb-8">
                    <AddNamesBox
                      list={list.guests.list}
                      repliedIds={repliedIds}
                      onSave={saveList}
                      onCancel={closeBox}
                      onDirty={setBoxDirty}
                      ask={
                        boxPending
                          ? {
                              onDiscard: discardBox,
                              onKeep: () => setBoxPending(null),
                              asked: boxAsked,
                            }
                          : null
                      }
                    />
                  </div>
                </div>
              </div>
            ) : null}
            {/*
             * The search at the left and the list's two actions at the right,
             * in one row once both fit; before that the actions, then the
             * search under them.
             */}
            <div className="grid w-full gap-4 @min-[800px]:grid-cols-[minmax(0,360px)_auto] @min-[800px]:justify-between">
              <GuestToolbar
                useList={list.useList}
                onUseList={(on) => editor.guard(() => list.set.useList(on))}
                onAddNames={() =>
                  list.addOpen ? openBox() : editor.guard(openBox)
                }
                onAddGuest={() => editor.open(NEW_ROW)}
              />
              <div className="@min-[800px]:order-first">
                <SearchField
                  query={list.query}
                  onQuery={list.set.query}
                  label={t("search")}
                />
              </div>
            </div>
          </div>

          <GuestTable
            list={list}
            actions={actions}
            editor={editor}
            onStartList={() => editor.guard(openBox)}
          />
        </div>
      )}

      <Toast message={toast.message} tone={toast.tone} />
    </>
  );
}
