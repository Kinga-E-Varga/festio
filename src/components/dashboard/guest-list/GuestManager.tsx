"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useEffect, useEffectEvent, useState } from "react";
import { Toast, useToast } from "@/components/dashboard/Toast";
import { Banner } from "@/components/dashboard/event-editor/Banner";
import { EditorSection } from "@/components/dashboard/event-editor/EditorSection";
import { AddNamesBox } from "@/components/dashboard/guest-list/AddNamesBox";
import { GuestSearch } from "@/components/dashboard/guest-list/GuestSearch";
import { GuestSummary } from "@/components/dashboard/guest-list/GuestSummary";
import { GuestTable } from "@/components/dashboard/guest-list/GuestTable";
import { GuestToolbar } from "@/components/dashboard/guest-list/GuestToolbar";
import { ReplySummary } from "@/components/dashboard/guest-list/ReplySummary";
import { FADE_IN } from "@/components/dashboard/guest-list/styles";
import { useGuestActions } from "@/components/dashboard/guest-list/useGuestActions";
import { useGuestList } from "@/components/dashboard/guest-list/useGuestList";
import {
  NEW_ROW,
  useRowEditor,
} from "@/components/dashboard/guest-list/useRowEditor";
import { Switch } from "@/components/invitation/PanelSwitch";
import { useLeaveWarning } from "@/lib/leave-warning";
import type { DashboardEvent } from "@/types/dashboard";
import type { EventGuests, ListName } from "@/types/guests";

interface GuestManagerProps {
  event: DashboardEvent;
  initial: EventGuests;
  /** The page's own banners, drawn above the list's, in the same block. */
  notices?: ReactNode;
}

/** The list box eases out the way it eased in (`FADE_IN`). */
const BOX_LEAVING = "pointer-events-none -translate-y-2 opacity-0";

/** Everyone the event knows about, in one list the host can read and fix. */
export function GuestManager({ event, initial, notices }: GuestManagerProps) {
  const t = useTranslations("GuestList");
  const tPage = useTranslations("EventPage");
  const tEditor = useTranslations("EventEditor");
  const toast = useToast();
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

  /* The box stays until its fade-out ends; with reduced motion there's none, so it goes at once. */
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
   * Opening again mid-fade keeps the box, draft and all.
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
      {/*
       * Held clear of the header as on the event page: the margins collapse,
       * so the first banner's own and the header's fold into this.
       */}
      <div className="mt-8">
        {notices}
        {/* Live from the rows, so it clears as the host sorts names out. */}
        {list.counts.attention > 0 ? (
          <Banner
            tone="warn"
            icon="alert"
            title={tPage("attentionTitle", { count: list.counts.attention })}
          >
            {tPage("attentionBody")}
          </Banner>
        ) : null}
      </div>

      <EditorSection title={t("sectionSummary")} first>
        <ReplySummary
          tally={list.tally}
          counts={list.counts}
          useList={list.useList}
          expected={event.expectedGuests}
          eventId={event.id}
        />
      </EditorSection>

      <EditorSection title={t("sectionList")}>
        {/*
         * The table's header: the list box when open, then the search, the
         * filters, the list switch and the buttons.
         */}
        <div className="mb-4 flex flex-col gap-4">
          {/* Above everything it opens from. 16px + the 16px gap = the 32px below it. */}
          {list.addOpen ? (
            <div
              onTransitionEnd={(event) => {
                if (leaving && event.target === event.currentTarget) closeNow();
              }}
              className={`mb-4 ${FADE_IN} ${leaving ? BOX_LEAVING : ""}`}
            >
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
          ) : null}
          {/*
           * Wide, two rows of two: the search, then the filters, each beside
           * its row of the controls. On a small screen they stack, the switch
           * and buttons first.
           */}
          <div className="grid gap-x-6 gap-y-4 @min-[820px]:grid-cols-[minmax(0,1fr)_auto] @min-[820px]:items-center">
            {/*
             * The controls, wide: the list switch, then "Edit invite list"
             * above "New reply" at the edge. Their columns share one width,
             * the widest of them; with the list off its button is gone and the
             * switch takes its spot, centred in it. Narrower, they join the stack
             * above.
             */}
            <div
              className={`contents @min-[820px]:col-start-2 @min-[820px]:row-span-2 @min-[820px]:row-start-1 @min-[820px]:grid @min-[820px]:grid-rows-subgrid @min-[820px]:items-center @min-[820px]:gap-x-6 ${list.useList ? "@min-[820px]:grid-cols-2" : "@min-[820px]:grid-cols-1"}`}
            >
              {/* Whether replies are matched against a list; the list's button follows it. */}
              <label className="flex w-fit cursor-pointer items-center gap-2.5 text-[12.5px] font-medium text-neutral-800 @min-[820px]:row-start-1 @min-[820px]:justify-self-center">
                <Switch
                  label={tEditor("useList")}
                  checked={list.useList}
                  onChange={(on) => editor.guard(() => list.set.useList(on))}
                />
                {tEditor("useList")}
              </label>
              {/* Wide, the toolbar's buttons join this grid, one above the other. */}
              <div className="@min-[820px]:contents">
                <GuestToolbar
                  useList={list.useList}
                  onAddNames={() =>
                    list.addOpen ? openBox() : editor.guard(openBox)
                  }
                  onAddGuest={() => editor.open(NEW_ROW)}
                />
              </div>
            </div>
            <div className="@min-[820px]:col-start-1 @min-[820px]:row-start-1 @min-[560px]:max-w-[400px]">
              <GuestSearch query={list.query} onQuery={list.set.query} />
            </div>
            <div className="min-w-0 @min-[820px]:col-start-1 @min-[820px]:row-start-2">
              <GuestSummary
                counts={list.counts}
                total={list.rows.length}
                useList={list.useList}
                filter={list.filter}
                onFilter={list.set.filter}
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
      </EditorSection>

      <Toast message={toast.message} tone={toast.tone} />
    </>
  );
}
