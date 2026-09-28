"use client";

import { useTranslations } from "next-intl";
import { addReply, addReplyToList, buildRows, markDifferent, matchReply, showsUnknown } from "@/lib/guests";
import type { EventGuests, GuestReply, ListName, RowValues } from "@/types/guests";

type Edit = (recipe: (current: EventGuests) => EventGuests) => void;

/** What the table shows right now, for toasts that depend on the outcome. */
interface Shown {
  guests: EventGuests;
  useList: boolean;
}

/** Now as a local ISO date-time, the way replies record when they came in. */
function localNow(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

/** Every change the host can make, each confirmed with a toast. */
export function useGuestActions(edit: Edit, notify: (message: string) => void, shown: Shown) {
  const t = useTranslations("GuestList");

  function saveReply(id: string | null, values: RowValues) {
    const name = values.name.trim();
    if (id === null) {
      const replyId = crypto.randomUUID();
      const added: GuestReply = {
        id: replyId,
        submissionId: replyId,
        name,
        status: values.status,
        note: null,
        repliedAt: localNow(),
        differentPerson: false,
      };
      edit((current) => addReply(current, added));
    } else {
      edit((current) => ({
        ...current,
        replies: current.replies.map((reply) =>
          reply.id === id ? { ...reply, name, status: values.status } : reply,
        ),
      }));
    }
    notify(t("toastSaved"));
  }

  function renameListName(id: string, name: string) {
    edit((current) => ({
      ...current,
      list: current.list.map((entry) => (entry.id === id ? { ...entry, name: name.trim() } : entry)),
    }));
    notify(t("toastSaved"));
  }

  function removeReply(id: string) {
    edit((current) => ({ ...current, replies: current.replies.filter((reply) => reply.id !== id) }));
    notify(t("toastDeleted"));
  }

  function removeListName(id: string) {
    edit((current) => ({ ...current, list: current.list.filter((entry) => entry.id !== id) }));
    notify(t("toastDeleted"));
  }

  function toggleSent(listName: ListName) {
    edit((current) => ({
      ...current,
      list: current.list.map((entry) =>
        entry.id === listName.id ? { ...entry, sent: !entry.sent } : entry,
      ),
    }));
    notify(t(listName.sent ? "toastNotSent" : "toastSent"));
  }

  function match(replyId: string, listName: ListName) {
    edit((current) => matchReply(current, replyId, listName.id));
    notify(t("toastMatched", { name: listName.name }));
  }

  function addAsNew(reply: GuestReply) {
    const id = crypto.randomUUID();
    edit((current) => addReplyToList(current, reply.id, id));
    notify(t("toastAddedToList", { name: reply.name }));
  }

  function different(replyId: string) {
    /* With the name's spot on the list already taken, the reply turns Unknown: say so. */
    const after = buildRows(markDifferent(shown.guests, replyId), shown.useList).find((row) => row.id === replyId);
    edit((current) => markDifferent(current, replyId));
    notify(
      after?.kind === "reply" && showsUnknown(after)
        ? t("toastDifferentUnknown", { name: after.reply.name })
        : t("toastDifferent"),
    );
  }

  /** Only the difference, so list changes made while the box was open survive. */
  function saveList(added: ListName[], removedIds: string[]) {
    const removed = new Set(removedIds);
    edit((current) => ({
      ...current,
      list: [...current.list.filter((entry) => !removed.has(entry.id)), ...added],
    }));
    notify(t("toastListSaved"));
  }

  return {
    saveReply,
    renameListName,
    removeReply,
    removeListName,
    toggleSent,
    match,
    addAsNew,
    different,
    saveList,
  };
}

export type GuestActions = ReturnType<typeof useGuestActions>;
