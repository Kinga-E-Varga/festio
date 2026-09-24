"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { HINT, INPUT } from "@/components/dashboard/event-editor/styles";
import { SMALL_BTN } from "@/components/dashboard/guest-list/styles";
import { normalizeName } from "@/lib/guests";
import type { ListName } from "@/types/guests";

interface MatchPickerProps {
  waiting: ListName[];
  onPick: (listName: ListName) => void;
  onClose: () => void;
}

/** Pick the Waiting name an unknown reply really belongs to. */
export function MatchPicker({ waiting, onPick, onClose }: MatchPickerProps) {
  const t = useTranslations("GuestList");
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const needle = normalizeName(query);
  const options = waiting.filter((entry) => normalizeName(entry.name).includes(needle));

  useEffect(() => input.current?.focus(), []);

  return (
    <div
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        onClose();
      }}
      className="mx-3 mb-3 border border-mustard-300 bg-neutral-50 p-3"
    >
      {waiting.length === 0 ? (
        <p className={HINT}>{t("noWaiting")}</p>
      ) : (
        <>
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(control) => setQuery(control.target.value)}
            placeholder={t("matchSearch")}
            aria-label={t("matchSearch")}
            className={INPUT}
          />
          {options.length === 0 ? <p className={`mt-2 ${HINT}`}>{t("noMatches")}</p> : null}
          <ul className="mt-2 max-h-48 overflow-y-auto">
            {options.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => onPick(entry)}
                  className="w-full cursor-pointer px-2 py-1.5 text-left text-[13.5px] text-neutral-900 transition-colors hover:bg-mustard-100"
                >
                  {entry.name}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <button type="button" onClick={onClose} className={`mt-2 ${SMALL_BTN}`}>
        {t("cancel")}
      </button>
    </div>
  );
}
