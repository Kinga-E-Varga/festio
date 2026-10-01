"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/icons";
import { useLeaveFestio } from "@/lib/history";

const TONE = {
  light: "text-forest-500 hover:text-forest-600",
  /** On the editors' dark top bar. */
  dark: "text-mustard-50 hover:text-mustard-400",
};

/** Back to wherever in Festio the host came from, like the editors' bar; else the events list. */
export function BackButton({ tone = "light" }: { tone?: keyof typeof TONE }) {
  const t = useTranslations("EventPage");
  const leave = useLeaveFestio("/dashboard/events");

  return (
    <button
      type="button"
      data-leaves
      onClick={leave}
      className={`inline-flex cursor-pointer items-center gap-2 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors hover:underline hover:underline-offset-4 ${TONE[tone]}`}
    >
      <Icon name="arrowLeft" className="size-3.5" strokeWidth={2.25} />
      {t("back")}
    </button>
  );
}
