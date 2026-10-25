"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { SearchClear } from "@/components/dashboard/SearchClear";
import { Icon } from "@/components/icons";
import { ICON_BTN_DANGER } from "@/components/dashboard/styles";
import { normalizeName } from "@/lib/guests";
import type { ListName } from "@/types/guests";

/* Each row draws both lines and pulls up 1px, so a column's first row carries its top line. */
const ROW_BASE =
  "-mt-px flex min-h-9 items-center gap-2 border-neutral-400 pl-2 field-text";
const ROW = `${ROW_BASE} border-y`;
/*
 * The list's columns, shared with the search row so the search is one column wide.
 * Both keep a scrollbar's room, so the list's scrollbar can't narrow its columns alone.
 * That needs them clipped, so 1px all round keeps the search's focus ring (1px
 * outside its edge) and the first row's top line in.
 */
const COLUMNS =
  "grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-x-10 p-px side-scroll [scrollbar-gutter:stable] [--scroll-track:var(--color-neutral-50)]";
/** A row's height with the inputs' fill and full edge. */
const SEARCH = `flex min-h-9 w-full items-center gap-2 rounded-ui border border-neutral-400 bg-neutral-50 pl-2 field-text transition-colors outline-neutral-500 hover:border-neutral-600 focus-within:border-neutral-500 focus-within:outline-2 focus-within:-outline-offset-1`;

interface DraftNameListProps {
  names: ListName[];
  /** List names someone has replied as: they stay, the table is where they change. */
  repliedIds: ReadonlySet<string>;
  onRemove: (id: string) => void;
}

/** Every name in the draft, each removable unless a reply already stands on it. */
export function DraftNameList({
  names,
  repliedIds,
  onRemove,
}: DraftNameListProps) {
  const t = useTranslations("GuestList");
  /* A→Z the way the host's language sorts, so Ș sits with S in Romanian. */
  const collator = new Intl.Collator(useLocale(), { sensitivity: "base" });
  const [query, setQuery] = useState("");
  const needle = normalizeName(query);
  const shown = names
    .filter((entry) => normalizeName(entry.name).includes(needle))
    .toSorted((a, b) => collator.compare(a.name, b.name));

  if (names.length === 0)
    return <p className="mt-4 hint-text">{t("listEmpty")}</p>;

  return (
    <div className="@container">
      {/*
       * The search in the first column, the count beside it. Stacked, the count goes
       * on top: a grid would drop it below, so one column is a reversed stack. 500px
       * is two columns and their gap with a scrollbar's room to spare.
       */}
      <div
        className={`mt-4 flex flex-col-reverse gap-2 overflow-hidden @min-[500px]:grid ${COLUMNS}`}
      >
        <label className={`relative ${SEARCH}`}>
          <Icon name="search" className="size-4 text-neutral-700" />
          <input
            type="search"
            value={query}
            onChange={(control) => setQuery(control.target.value)}
            placeholder={t("searchList")}
            aria-label={t("searchList")}
            className="min-w-0 grow bg-transparent py-1.5 pr-7 outline-none"
          />
          <SearchClear query={query} onClear={() => setQuery("")} />
        </label>
        <p className="hint-text @min-[500px]:col-start-2 @min-[500px]:col-end-[-1] @min-[500px]:self-center">
          {t("listCount", { count: names.length })}
        </p>
      </div>
      <ul className={`mt-3 grid max-h-[320px] overflow-y-auto ${COLUMNS}`}>
        {shown.map((entry) => (
          <li key={entry.id} className={ROW}>
            <span className="min-w-0 grow truncate">{entry.name}</span>
            {repliedIds.has(entry.id) ? (
              <span className="shrink-0 hint-text whitespace-nowrap">
                {t("alreadyReplied")}
              </span>
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
      {shown.length === 0 ? (
        <p className="mt-3 hint-text">{t("noMatches")}</p>
      ) : null}
    </div>
  );
}
