"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/icons";
import { useLeaveFestio } from "@/lib/history";

/** Back to wherever in Festio the host came from, like the editors' bar; else the events list. */
export function BackButton() {
  const t = useTranslations("EventPage");
  const leave = useLeaveFestio("/dashboard/events");

  return (
    <button
      type="button"
      onClick={leave}
      className="inline-flex cursor-pointer items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-forest-500 uppercase transition-colors hover:text-forest-600 hover:underline hover:underline-offset-4"
    >
      <Icon name="arrowLeft" className="size-3.5" />
      {t("back")}
    </button>
  );
}
