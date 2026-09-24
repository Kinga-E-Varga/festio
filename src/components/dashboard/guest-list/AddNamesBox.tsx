"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { BTN_GHOST, BTN_PRIMARY, HINT, INPUT, SUBBOX } from "@/components/dashboard/event-editor/styles";
import { findRepeats, parseNames } from "@/lib/guests";
import type { ListName, NameRepeat } from "@/types/guests";

interface AddNamesBoxProps {
  list: ListName[];
  onAdd: (names: string[]) => void;
  onCancel: () => void;
}

/** Paste or type names; repeats are shown before saving, never dropped. */
export function AddNamesBox({ list, onAdd, onCancel }: AddNamesBoxProps) {
  const t = useTranslations("GuestList");
  const { register, control, handleSubmit, setFocus } = useForm<{ text: string }>({
    defaultValues: { text: "" },
  });
  const text = useWatch({ control, name: "text" });
  const names = parseNames(text);
  const [repeats, setRepeats] = useState<NameRepeat[] | null>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    box.current?.scrollIntoView({ block: "nearest" });
    setFocus("text");
  }, [setFocus]);

  function submit() {
    if (names.length === 0) return;
    const found = findRepeats(names, list);
    if (found.length > 0) setRepeats(found);
    else onAdd(names);
  }

  function back() {
    setRepeats(null);
    requestAnimationFrame(() => setFocus("text"));
  }

  return (
    <div ref={box} id="list" className={`mt-3 scroll-mt-24 ${SUBBOX}`}>
      <h3 className="font-bold text-neutral-900">{t("addNamesTitle")}</h3>
      <p className={`mt-1 ${HINT}`}>{t("addNamesHint")}</p>

      {repeats ? (
        <div role="alert" className="mt-3 border border-terracotta-400 bg-terracotta-200 px-4 py-3 text-[12.5px] text-terracotta-600">
          <b className="block">{t("repeatsTitle")}</b>
          <ul className="mt-1.5 list-disc pl-5">
            {repeats.map((repeat) => (
              <li key={repeat.name}>{t("repeatsItem", { name: repeat.name, count: repeat.count })}</li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2.5">
            <button type="button" onClick={() => onAdd(names)} className={BTN_PRIMARY}>
              {t("keepThem")}
            </button>
            <button type="button" onClick={back} className={BTN_GHOST}>
              {t("backToEdit")}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(submit)} className="mt-3">
          <textarea
            {...register("text")}
            rows={6}
            aria-label={t("addNamesTitle")}
            className={`${INPUT} resize-y`}
          />
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <span className={`mr-auto ${HINT}`}>{t("addNamesCount", { count: names.length })}</span>
            <button type="button" onClick={onCancel} className={BTN_GHOST}>
              {t("cancel")}
            </button>
            <button type="submit" disabled={names.length === 0} className={BTN_PRIMARY}>
              {t("addNamesSubmit", { count: names.length })}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
