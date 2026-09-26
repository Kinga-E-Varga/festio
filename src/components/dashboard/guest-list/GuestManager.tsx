"use client";

import { useTranslations } from "next-intl";
import { useEffect, useEffectEvent } from "react";
import { Toast, useToast } from "@/components/dashboard/Toast";
import { Banner } from "@/components/dashboard/event-editor/Banner";
import { EditorSection } from "@/components/dashboard/event-editor/EditorSection";
import { SummarySwitch } from "@/components/dashboard/event-editor/SummarySwitch";
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
  const t = useTranslations("GuestList");
  const tPage = useTranslations("EventPage");
  const tNotes = useTranslations("EventNotes");
  const tEditor = useTranslations("EventEditor");
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
      {list.counts.attention > 0 ? (
        <Banner tone="warn" icon="alert" title={tPage("attentionTitle", { count: list.counts.attention })}>
          {tPage("attentionBody")}
        </Banner>
      ) : null}

      <EditorSection title={t("sectionSummary")} first>
        {/* Left empty on purpose: what the summary shows comes later. */}
        <div className="min-h-[120px] border border-dashed border-mustard-400" />
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

        {event.attendeeNotes?.length ? (
          <p className="mb-[22px] text-[12.5px] text-neutral-700">
            {event.attendeeNotes.map((note) => tNotes(note.key, note.values)).join(" · ")}
          </p>
        ) : null}

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
                onAddNames={() => editor.guard(list.openAddNames)}
                onAddGuest={() => editor.open(NEW_ROW)}
              />
            </div>
          </div>

          {list.addOpen ? (
            <AddNamesBox list={list.guests.list} onAdd={addNames} onCancel={() => list.set.addOpen(false)} />
          ) : null}
        </div>

        <GuestTable list={list} actions={actions} editor={editor} onStartList={() => editor.guard(list.openAddNames)} />
      </EditorSection>

      <Toast message={toast.message} />
    </>
  );
}
