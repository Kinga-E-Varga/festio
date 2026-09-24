"use client";

import { useTranslations } from "next-intl";
import { INPUT } from "@/components/dashboard/event-editor/styles";
import { Icon } from "@/components/icons";

interface GuestSearchProps {
  query: string;
  onQuery: (value: string) => void;
}

export function GuestSearch({ query, onQuery }: GuestSearchProps) {
  const t = useTranslations("GuestList");

  return (
    <label className="relative min-w-[200px] flex-1 @min-[720px]:ml-auto @min-[720px]:max-w-[280px]">
      <span className="sr-only">{t("search")}</span>
      <Icon
        name="search"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-700"
      />
      <input
        type="search"
        value={query}
        onChange={(control) => onQuery(control.target.value)}
        placeholder={t("search")}
        className={`${INPUT} pl-9`}
      />
    </label>
  );
}
