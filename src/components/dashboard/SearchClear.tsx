"use client";

import { useTranslations } from "next-intl";
import { MINI } from "@/components/dashboard/event-editor/styles";
import { Icon } from "@/components/icons";

/**
 * The app's own X at the right of a search box, in place of the browser's,
 * shown only once something is typed. Its box sets it `relative`.
 */
export function SearchClear({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  const t = useTranslations("Nav");
  if (!query) return null;

  return (
    <button
      type="button"
      onClick={onClear}
      aria-label={t("clearSearch")}
      className={`absolute top-1/2 right-2 z-10 size-6 -translate-y-1/2 rounded-full ${MINI}`}
    >
      <Icon name="close" className="size-3.5" strokeWidth={2} />
    </button>
  );
}
