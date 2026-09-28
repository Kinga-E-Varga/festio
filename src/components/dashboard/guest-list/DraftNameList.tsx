"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "@/components/icons";
import { HINT } from "@/components/dashboard/event-editor/styles";
import { ICON_BTN_DANGER } from "@/components/dashboard/guest-list/styles";
import { normalizeName } from "@/lib/guests";
import type { ListName } from "@/types/guests";

/* Each row draws both lines and pulls up 1px, so a column's first row carries its top line. */
const ROW_BASE = "-mt-px flex min-h-9 items-center gap-2 border-mustard-300 pl-2 text-[13px] text-neutral-900";
const ROW = `${ROW_BASE} border-y`;
/** A row's size with the inputs' fill and full edge; pinned while the list scrolls, over the rows below it. */
const SEARCH_ROW = `${ROW_BASE} sticky top-0 z-10 border bg-neutral-50 transition-colors hover:border-mustard-500 focus-within:border-mustard-500`;

interface DraftNameListProps {
  names: ListName[];
  /** List names someone has replied as: they stay, the table is where they change. */
  repliedIds: ReadonlySet<string>;
  onRemove: (id: string) => void;
}

/** Every name in the draft, each removable unless a reply already stands on it. */
export function DraftNameList({ names, repliedIds, onRemove }: DraftNameListProps) {
  const t = useTranslations("GuestList");
  /* A→Z the way the host's language sorts, so Ș sits with S in Romanian. */
  const collator = new Intl.Collator(useLocale(), { sensitivity: "base" });
  const [query, setQuery] = useState("");
  const needle = normalizeName(query);
  const shown = names
    .filter((entry) => normalizeName(entry.name).includes(needle))
    .toSorted((a, b) => collator.compare(a.name, b.name));

  if (names.length === 0) return <p className={`mt-4 ${HINT}`}>{t("listEmpty")}</p>;

  return (
    <>
      <p className={`mt-4 ${HINT}`}>{t("listCount", { count: names.length })}</p>
      <ul className="mt-3 grid max-h-[320px] grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-x-10 overflow-y-auto pt-px">
        {/* The search takes the first cell, a row's size, so it reads as part of the list. */}
        <li className={SEARCH_ROW}>
          <Icon name="search" className="size-4 text-neutral-700" />
          <input
            type="search"
            value={query}
            onChange={(control) => setQuery(control.target.value)}
            placeholder={t("searchList")}
            aria-label={t("searchList")}
            className="min-w-0 grow bg-transparent py-1.5 outline-none placeholder:text-neutral-700"
          />
        </li>
        {shown.map((entry) => (
          <li key={entry.id} className={ROW}>
            <span className="min-w-0 grow truncate">{entry.name}</span>
            {repliedIds.has(entry.id) ? (
              <span className="shrink-0 text-[11.5px] whitespace-nowrap text-neutral-700">{t("alreadyReplied")}</span>
            ) : (
              <button
                type="button"
                onClick={() => onRemove(entry.id)}
                aria-label={t("removeName", { name: entry.name })}
                className={ICON_BTN_DANGER}
              >
                <Icon name="close" className="size-4" />
              </button>
            )}
          </li>
        ))}
      </ul>
      {shown.length === 0 ? <p className={`mt-3 ${HINT}`}>{t("noMatches")}</p> : null}
    </>
  );
}
