"use client";

import { useTranslations } from "next-intl";
import { GOLD_PICK } from "@/components/dashboard/event-editor/styles";
import { ICON_NAMES, Icon } from "@/modular/icons";

/**
 * One icon's button, a circle: the inputs' fill, Add's fill when picked,
 * Add's hover fill on hover — picked or not.
 */
const CHOICE = `grid size-10 cursor-pointer place-items-center rounded-full border transition-colors ${GOLD_PICK} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mustard-500`;

/** The icon library as a grid of buttons, "No icon" first; the picked one pressed. */
export function IconPicker({
  labelId,
  value,
  onPick,
}: {
  /** The field label's id, which names the group. */
  labelId: string;
  value: string;
  onPick: (name: string) => void;
}) {
  const t = useTranslations("ContentTab");

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className="flex flex-wrap gap-1.5"
    >
      <button
        type="button"
        aria-pressed={value === ""}
        aria-label={t("noIcon")}
        onClick={() => onPick("")}
        className={`${CHOICE} text-[16px]`}
      >
        –
      </button>
      {ICON_NAMES.map((name) => (
        <button
          key={name}
          type="button"
          aria-pressed={value === name}
          aria-label={name}
          onClick={() => onPick(name)}
          className={CHOICE}
        >
          <Icon name={name} className="size-5" />
        </button>
      ))}
    </div>
  );
}
