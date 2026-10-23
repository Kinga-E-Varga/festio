"use client";

import { useTranslations } from "next-intl";
import { SearchClear } from "@/components/dashboard/SearchClear";
import { useState } from "react";
import {
  BTN_GHOST_LIGHT,
  BTN_PRIMARY,
  INPUT,
} from "@/components/dashboard/event-editor/styles";
import { Dialog, DialogActions } from "@/components/dashboard/Dialog";
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
        <p className="hint-text">{t("noWaiting")}</p>
      ) : (
        <>
          <div className="relative">
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(control) => setQuery(control.target.value)}
              placeholder={t("matchSearch")}
              aria-label={t("matchSearch")}
              className={`${INPUT} pr-9`}
            />
            <SearchClear query={query} onClear={() => setQuery("")} />
          </div>
          {options.length === 0 ? (
            <p className="mt-2 hint-text">{t("noMatches")}</p>
          ) : (
            <div className="mt-2 max-h-60 side-scroll overflow-y-auto rounded-ui border border-neutral-400 [--scroll-track:var(--color-neutral-50)]">
              {/* `relative`: each hidden radio stays in its row, or the far rows' would stretch the dialog. */}
              {options.map((entry) => (
                <label
                  key={entry.id}
                  className="relative flex cursor-pointer items-center gap-2.5 border-neutral-200 px-3 py-2 field-text transition-colors not-first:border-t hover:bg-neutral-100 has-checked:bg-neutral-200 has-checked:font-medium has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-neutral-500"
                >
                  <input
                    type="radio"
                    name="match"
                    checked={picked?.id === entry.id}
                    onChange={() => setPicked(entry)}
                    className="peer sr-only"
                  />
                  <span className="min-w-0 flex-1 truncate">{entry.name}</span>
                  <small className="hint-text">
                    {t(entry.sent ? "invitationSent" : "invitationNotSent")}
                  </small>
                </label>
              ))}
            </div>
          )}
        </>
      )}

      <DialogActions>
        <button type="button" onClick={onClose} className={BTN_GHOST_LIGHT}>
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
      </DialogActions>
    </Dialog>
  );
}
