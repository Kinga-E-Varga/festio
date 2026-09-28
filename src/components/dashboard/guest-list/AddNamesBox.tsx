"use client";

import { useTranslations } from "next-intl";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { HINT, INPUT, SUBBOX } from "@/components/dashboard/event-editor/styles";
import { DraftNameList } from "@/components/dashboard/guest-list/DraftNameList";
import { ALERT, BTN_LIST, BTN_LIST_OUTLINE, SMALL_BTN_WARN, SMALL_BTN_WARN_SOLID } from "@/components/dashboard/guest-list/styles";
import { useListDraft } from "@/components/dashboard/guest-list/useListDraft";
import { findRepeats, parseNames } from "@/lib/guests";
import type { ListName, NameRepeat } from "@/types/guests";

interface AddNamesBoxProps {
  list: ListName[];
  repliedIds: ReadonlySet<string>;
  onSave: (added: ListName[], removedIds: string[]) => void;
  onCancel: () => void;
  /** Whether anything is waiting to be saved: a draft change or names still in the box. */
  onDirty: (dirty: boolean) => void;
  /** A change to the table was asked for with changes waiting here: the discard prompt asks, and Discard lets it through. */
  ask: { onDiscard: () => void; onKeep: () => void } | null;
}

/** What stops a Save or Cancel until the host answers it. */
type Notice = "unadded" | "discard";

/** The whole preloaded list as a draft: paste names in, remove the unwanted, then save. */
export function AddNamesBox({ list, repliedIds, onSave, onCancel, onDirty, ask }: AddNamesBoxProps) {
  const t = useTranslations("GuestList");
  const { register, control, handleSubmit, setFocus, reset } = useForm<{ text: string }>({
    defaultValues: { text: "" },
  });
  const text = useWatch({ control, name: "text" });
  const names = parseNames(text);
  const draft = useListDraft(list);
  const [repeats, setRepeats] = useState<NameRepeat[] | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    box.current?.scrollIntoView({ block: "nearest" });
    setFocus("text");
  }, [setFocus]);

  /* Asked from the table or the switch: bring the prompt into view and onto its first button. */
  const discardPrompt = useRef<HTMLDivElement>(null);
  const asking = ask !== null;
  useEffect(() => {
    if (!asking) return;
    discardPrompt.current?.scrollIntoView({ block: "nearest" });
    discardPrompt.current?.querySelector("button")?.focus();
  }, [asking]);

  const dirty = draft.changed || names.length > 0;
  useEffect(() => onDirty(dirty), [onDirty, dirty]);

  function add() {
    setNotice(null);
    if (names.length === 0) return;
    /* Against the whole draft: the saved names and the ones added before this paste. */
    const found = findRepeats(names, draft.names);
    if (found.length > 0) setRepeats(found);
    else keep();
  }

  function keep() {
    draft.add(names);
    setRepeats(null);
    reset();
  }

  function back() {
    setRepeats(null);
    requestAnimationFrame(() => setFocus("text"));
  }

  /* The note is about names still in the box: once they're gone, so is the note. */
  function clearUnadded(event: ChangeEvent<HTMLTextAreaElement>) {
    if (parseNames(event.target.value).length === 0) {
      setNotice((current) => (current === "unadded" ? null : current));
    }
  }

  function clearInput() {
    reset();
    setNotice((current) => (current === "unadded" ? null : current));
    setFocus("text");
  }

  function save() {
    if (names.length > 0) setNotice("unadded");
    else onSave(draft.added, draft.removedIds);
  }

  function cancel() {
    if (draft.changed || names.length > 0) setNotice("discard");
    else onCancel();
  }

  return (
    <div ref={box} id="list" className={`scroll-mt-24 ${SUBBOX}`}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <h3 className="mr-auto font-serif text-[17px] tracking-[0.14em] text-neutral-900 uppercase">{t("listTitle")}</h3>
        <div className="flex gap-2.5">
          <button type="button" onClick={cancel} className={BTN_LIST_OUTLINE}>
            {t("cancel")}
          </button>
          <button type="button" onClick={save} disabled={!draft.changed && names.length === 0} className={BTN_LIST}>
            {t("save")}
          </button>
        </div>
      </div>

      {notice === "unadded" ? (
        <div role="alert" className={`mt-3 ${ALERT} flex flex-wrap items-center gap-2.5`}>
          <span className="mr-auto">{t("unaddedTitle")}</span>
          <button type="button" onClick={add} className={SMALL_BTN_WARN_SOLID}>
            {t("addThem")}
          </button>
        </div>
      ) : null}
      {notice === "discard" || ask ? (
        <div ref={discardPrompt} role="alert" className={`mt-3 ${ALERT} flex flex-wrap items-center gap-2.5`}>
          <span className="mr-auto">{t("discardTitle")}</span>
          <div className="flex shrink-0 gap-2.5">
            <button type="button" onClick={ask ? ask.onDiscard : onCancel} className={SMALL_BTN_WARN}>
              {t("discard")}
            </button>
            <button
              type="button"
              onClick={() => {
                setNotice(null);
                ask?.onKeep();
              }}
              className={SMALL_BTN_WARN_SOLID}
            >
              {t("keepEditing")}
            </button>
          </div>
        </div>
      ) : null}

      {repeats ? (
        <div role="alert" className={`mt-3 ${ALERT}`}>
          <b className="block">{t("repeatsTitle")}</b>
          <ul className="mt-1.5 list-disc pl-5">
            {repeats.map((repeat) => (
              <li key={repeat.name}>{t("repeatsItem", { name: repeat.name, count: repeat.count })}</li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2.5">
            <button type="button" onClick={keep} className={SMALL_BTN_WARN_SOLID}>
              {t("keepThem")}
            </button>
            <button type="button" onClick={back} className={SMALL_BTN_WARN}>
              {t("backToEdit")}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(add)} className="mt-4">
          <p className={`mb-2 ${HINT}`}>{t("addNamesHint")}</p>
          <textarea
            {...register("text", { onChange: clearUnadded })}
            rows={5}
            aria-label={t("addNamesTitle")}
            className={`${INPUT} resize-y`}
          />
          <div className="mt-3 flex justify-end gap-2.5">
            <button type="button" onClick={clearInput} disabled={text.length === 0} className={BTN_LIST_OUTLINE}>
              {t("clearInput")}
            </button>
            <button type="submit" disabled={names.length === 0} className={BTN_LIST}>
              {t("addNamesSubmit", { count: names.length })}
            </button>
          </div>
        </form>
      )}

      <DraftNameList names={draft.names} repliedIds={repliedIds} onRemove={draft.remove} />
    </div>
  );
}
