"use client";

import { useTranslations } from "next-intl";
import { useEffect, useEffectEvent, useState } from "react";
import { Toast, useToast } from "@/components/dashboard/Toast";
import { Banner } from "@/components/dashboard/event-editor/Banner";
import { EditorSection } from "@/components/dashboard/event-editor/EditorSection";
import { SummarySwitch } from "@/components/dashboard/event-editor/SummarySwitch";
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
import { useLeaveWarning } from "@/lib/leave-warning";
import type { DashboardEvent } from "@/types/dashboard";
import type { EventGuests, ListName } from "@/types/guests";

interface GuestManagerProps {
  event: DashboardEvent;
  initial: EventGuests;
}

/** The list box eases out the way it eased in (`FADE_IN`). */
const BOX_LEAVING = "pointer-events-none -translate-y-2 opacity-0";

/** Everyone the event knows about, in one list the host can read and fix. */
export function GuestManager({ event, initial }: GuestManagerProps) {
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
    if (boxUnsaved) setBoxPending(() => action);
    else action();
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

      <EditorSection title={t("sectionSummary")} first>
        <ReplySummary
          tally={list.tally}
          counts={list.counts}
          useList={list.useList}
        />
      </EditorSection>

      <EditorSection title={t("sectionList")}>
        {/* The event editor's list setting, the same switch on both pages. */}
        <div className="mb-8">
          <SummarySwitch
            icon="guests"
            action={tEditor(list.useList ? "stopList" : "useList")}
            onAction={() => editor.guard(() => list.set.useList(!list.useList))}
            hint={tEditor("noListHint")}
            text={
              list.useList ? (
                <>
                  {tEditor("matchedList")}{" "}
                  {/* The count reads on from the sentence, in the quieter hint style. */}
                  <span className="text-[12.5px] font-normal text-neutral-700">
                    {t("listCount", { count: list.guests.list.length })}
                  </span>
                </>
              ) : (
                tEditor("matchedNoList")
              )
            }
          />
        </div>

        {/* The table's header: search and filters, the list and reply actions to the right. */}
        <div className="mb-4 flex flex-col gap-6">
          {/*
           * Each step waits until the one before runs out of room:
           * 1. one row: search, filters, the buttons far right;
           * 2. the buttons move on top at their own size (`wrap-reverse` puts
           *    the later item first);
           * 3. the filters drop under the search;
           * 4. the filters wrap among themselves.
           */}
          <div className="flex flex-wrap-reverse items-center gap-x-6 gap-y-3">
            <div className="flex min-w-0 grow flex-wrap items-center gap-x-4 gap-y-3">
              {/* 280px beside the filters; alone on its line it fills it. */}
              <div className="w-[280px] grow">
                <GuestSearch query={list.query} onQuery={list.set.query} />
              </div>
              {/* Takes nearly all the spare room on a shared line, so the search stays 280px. */}
              <div className="min-w-0 grow-[999]">
                <GuestSummary
                  counts={list.counts}
                  total={list.rows.length}
                  useList={list.useList}
                  filter={list.filter}
                  onFilter={list.set.filter}
                />
              </div>
            </div>
            {/*
             * Pushed right by the growing search and filters beside it; on top
             * it starts at the left. Small screens give it the whole line.
             */}
            <div className="basis-full @min-[560px]:basis-auto">
              <GuestToolbar
                useList={list.useList}
                onAddNames={() =>
                  list.addOpen ? openBox() : editor.guard(openBox)
                }
                onAddGuest={() => editor.open(NEW_ROW)}
              />
            </div>
            {/* Lines run bottom up, so the last item, the list box, sits on top of them all. 20px + the 12px row gap = the 32px above it. */}
            {list.addOpen ? (
              <div
                onTransitionEnd={(event) => {
                  if (leaving && event.target === event.currentTarget)
                    closeNow();
                }}
                className={`mb-5 basis-full ${FADE_IN} ${leaving ? BOX_LEAVING : ""}`}
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
                        }
                      : null
                  }
                />
              </div>
            ) : null}
          </div>
        </div>

        <GuestTable
          list={list}
          actions={actions}
          editor={editor}
          onStartList={() => editor.guard(openBox)}
        />
      </EditorSection>

      <Toast message={toast.message} />
    </>
  );
}
