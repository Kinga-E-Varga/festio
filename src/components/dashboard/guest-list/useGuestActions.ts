"use client";

import { useTranslations } from "next-intl";
import {
  editReply,
  newReplies,
} from "@/components/dashboard/guest-list/replyValues";
import {
  addReply,
  addReplyToList,
  buildRows,
  markDifferent,
  matchReply,
  separateReply,
  showsUnknown,
} from "@/lib/guests";
import type {
  EventGuests,
  GuestReply,
  ListName,
  ReplyValues,
} from "@/types/guests";
import { newId } from "@/lib/id";

/** Saves a change; resolves false when it wasn't saved (the error is already shown). */
type Apply = (
  recipe: (current: EventGuests) => EventGuests,
) => Promise<boolean>;

/** What the table shows right now, for toasts that depend on the outcome. */
interface Shown {
  guests: EventGuests;
  useList: boolean;
}

/** Now as a local ISO date-time, the way replies record when they came in. */
function localNow(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

/** Every change the host can make, each saved, then confirmed with a toast. */
export function useGuestActions(
  apply: Apply,
  notify: (message: string) => void,
  shown: Shown,
) {
  const t = useTranslations("GuestList");

  /** A new reply (`group` null) or a saved one's edit, `group` its people in the editor's order; true once saved. */
  async function saveReply(
    group: string[] | null,
    values: ReplyValues,
  ): Promise<boolean> {
    const ids = values.people.map(() => newId());
    const saved = await apply((current) =>
      group === null
        ? newReplies(values, current.questions, ids, localNow()).reduce(
            (guests, added) => addReply(guests, added),
            current,
          )
        : {
            ...current,
            replies: editReply(
              current.replies,
              group,
              values,
              current.questions,
              ids,
            ),
          },
    );
    if (saved) notify(t("toastSaved"));
    return saved;
  }

  async function separate(replyId: string) {
    const id = newId();
    const saved = await apply((current) => separateReply(current, replyId, id));
    if (saved) notify(t("toastSeparated"));
  }

  async function renameListName(id: string, name: string): Promise<boolean> {
    const saved = await apply((current) => ({
      ...current,
      list: current.list.map((entry) =>
        entry.id === id ? { ...entry, name: name.trim() } : entry,
      ),
    }));
    if (saved) notify(t("toastSaved"));
    return saved;
  }

  /** People's replies: a whole reply, or one person on their own; true once saved. */
  async function removeReplies(ids: string[]): Promise<boolean> {
    const gone = new Set(ids);
    const saved = await apply((current) => ({
      ...current,
      replies: current.replies.filter((reply) => !gone.has(reply.id)),
    }));
    if (saved) notify(t("toastDeleted"));
    return saved;
  }

  async function removeListName(id: string) {
    const saved = await apply((current) => ({
      ...current,
      list: current.list.filter((entry) => entry.id !== id),
    }));
    if (saved) notify(t("toastDeleted"));
  }

  async function toggleSent(listName: ListName) {
    const saved = await apply((current) => ({
      ...current,
      list: current.list.map((entry) =>
        entry.id === listName.id ? { ...entry, sent: !entry.sent } : entry,
      ),
    }));
    if (saved) notify(t(listName.sent ? "toastNotSent" : "toastSent"));
  }

  async function match(replyId: string, listName: ListName) {
    const saved = await apply((current) =>
      matchReply(current, replyId, listName.id),
    );
    if (saved) notify(t("toastMatched", { name: listName.name }));
  }

  async function addAsNew(reply: GuestReply) {
    const id = newId();
    const saved = await apply((current) =>
      addReplyToList(current, reply.id, id),
    );
    if (saved) notify(t("toastAddedToList", { name: reply.name }));
  }

  async function different(replyId: string) {
    /* With the name's spot on the list already taken, the reply turns Unknown: say so. */
    const after = buildRows(
      markDifferent(shown.guests, replyId),
      shown.useList,
    ).find((row) => row.id === replyId);
    if (!(await apply((current) => markDifferent(current, replyId)))) return;
    notify(
      after?.kind === "reply" && showsUnknown(after)
        ? t("toastDifferentUnknown", { name: after.reply.name })
        : t("toastDifferent"),
    );
  }

  /** Only the difference, so list changes made while the box was open survive; true once saved. */
  async function saveList(
    added: ListName[],
    removedIds: string[],
  ): Promise<boolean> {
    const removed = new Set(removedIds);
    const saved = await apply((current) => ({
      ...current,
      list: [
        ...current.list.filter((entry) => !removed.has(entry.id)),
        ...added,
      ],
    }));
    if (saved) notify(t("toastListSaved"));
    return saved;
  }

  return {
    saveReply,
    separate,
    renameListName,
    removeReplies,
    removeListName,
    toggleSent,
    match,
    addAsNew,
    different,
    saveList,
  };
}

export type GuestActions = ReturnType<typeof useGuestActions>;
