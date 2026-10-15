"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/icons";
import { useLeaveFestio } from "@/lib/history";

const TONE = {
  light: "text-primary-700 hover:text-primary-900",
  /** On the editors' dark top bar. */
  dark: "text-secondary-100 hover:text-secondary-400",
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
      className={`inline-flex cursor-pointer items-center gap-2 eyebrow transition-colors hover:underline hover:underline-offset-4 ${TONE[tone]}`}
    >
      <Icon name="arrowLeft" className="size-3.5" strokeWidth={2.25} />
      {t("back")}
    </button>
  );
}
