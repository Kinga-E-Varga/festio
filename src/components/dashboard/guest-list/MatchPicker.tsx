"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  BTN_GHOST_LIGHT,
  HINT,
  INPUT,
} from "@/components/dashboard/event-editor/styles";
import { Dialog } from "@/components/dashboard/guest-list/Dialog";
import { GUEST_BTN_PRIMARY } from "@/components/dashboard/guest-list/styles";
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
  const needle = normalizeName(query);
  const options = waiting.filter((entry) =>
    normalizeName(entry.name).includes(needle),
  );

  return (
    <Dialog
      title={t("matchTitle", { name })}
      hint={t("matchHint")}
      onDismiss={onClose}
    >
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
            <div className="mt-2 max-h-60 side-scroll overflow-y-auto rounded-ui border border-neutral-400 [--scroll-track:var(--color-neutral-50)]">
              {options.map((entry) => (
                <label
                  key={entry.id}
                  className="flex cursor-pointer items-center gap-2.5 border-neutral-400 px-3 py-2 text-[13.5px] transition-colors not-first:border-t hover:bg-neutral-150 has-checked:bg-primary-100"
                >
                  <input
                    type="radio"
                    name="match"
                    checked={picked?.id === entry.id}
                    onChange={() => setPicked(entry)}
                    className="accent-primary-700"
                  />
                  <span className="min-w-0 flex-1 truncate">{entry.name}</span>
                  <small className="text-[11.5px] text-neutral-700">
                    {t(entry.sent ? "invitationSent" : "invitationNotSent")}
                  </small>
                </label>
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-5 flex flex-wrap justify-end gap-2 pb-5">
        <button type="button" onClick={onClose} className={BTN_GHOST_LIGHT}>
          {t("cancel")}
        </button>
        <button
          type="button"
          disabled={picked === null}
          onClick={() => picked && onPick(picked)}
          className={GUEST_BTN_PRIMARY}
        >
          {picked ? t("matchToName", { name: picked.name }) : t("match")}
        </button>
      </div>
    </Dialog>
  );
}
