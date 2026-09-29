"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import {
  BTN_GHOST,
  BTN_PRIMARY,
  HINT,
  INPUT,
} from "@/components/dashboard/event-editor/styles";
import { normalizeName } from "@/lib/guests";
import type { ListName } from "@/types/guests";

interface MatchPickerProps {
  /** The unknown reply's name, for the title. */
  name: string;
  waiting: ListName[];
  onPick: (listName: ListName) => void;
  onClose: () => void;
}

/** Pick the Waiting name an unknown reply really belongs to, in a modal dialog. */
export function MatchPicker({
  name,
  waiting,
  onPick,
  onClose,
}: MatchPickerProps) {
  const t = useTranslations("GuestList");
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<ListName | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const needle = normalizeName(query);
  const options = waiting.filter((entry) =>
    normalizeName(entry.name).includes(needle),
  );

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) dialog.current.close();
      }}
      aria-labelledby={titleId}
      className="m-auto w-[min(480px,calc(100vw-32px))] border border-mustard-300 bg-neutral-50 p-0 text-neutral-900 backdrop:bg-neutral-950/40"
    >
      <div className="p-5">
        <h3 id={titleId} className="font-serif text-[19px] text-neutral-900">
          {t("matchTitle", { name })}
        </h3>
        <p className={`mt-1.5 ${HINT}`}>{t("matchHint")}</p>

        {waiting.length === 0 ? (
          <p className={`mt-4 ${HINT}`}>{t("noWaiting")}</p>
        ) : (
          <>
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(control) => setQuery(control.target.value)}
              placeholder={t("matchSearch")}
              aria-label={t("matchSearch")}
              className={`mt-4 ${INPUT}`}
            />
            {options.length === 0 ? (
              <p className={`mt-2 ${HINT}`}>{t("noMatches")}</p>
            ) : (
              <div className="mt-2 max-h-60 overflow-y-auto border border-mustard-300">
                {options.map((entry) => (
                  <label
                    key={entry.id}
                    className="flex cursor-pointer items-center gap-2.5 border-mustard-300 px-3 py-2 text-[13.5px] transition-colors not-first:border-t hover:bg-mustard-100 has-checked:bg-forest-100"
                  >
                    <input
                      type="radio"
                      name="match"
                      checked={picked?.id === entry.id}
                      onChange={() => setPicked(entry)}
                      className="accent-forest-500"
                    />
                    <span className="min-w-0 flex-1 truncate">
                      {entry.name}
                    </span>
                    <small className="text-[11.5px] text-neutral-700">
                      {t(entry.sent ? "invitationSent" : "invitationNotSent")}
                    </small>
                  </label>
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className={BTN_GHOST}
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            disabled={picked === null}
            onClick={() => picked && onPick(picked)}
            className={BTN_PRIMARY}
          >
            {picked ? t("matchToName", { name: picked.name }) : t("match")}
          </button>
        </div>
      </div>
    </dialog>
  );
}
