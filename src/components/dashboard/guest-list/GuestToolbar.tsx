"use client";

import { useTranslations } from "next-intl";
import { BTN_GHOST_LIGHT, BTN_PRIMARY } from "@/components/dashboard/event-editor/styles";
import { HEADER_BTN_WIDTH } from "@/components/dashboard/guest-list/styles";
import { Icon } from "@/components/icons";

interface GuestToolbarProps {
  useList: boolean;
  onAddNames: () => void;
  onAddGuest: () => void;
}

export function GuestToolbar({ useList, onAddNames, onAddGuest }: GuestToolbarProps) {
  const t = useTranslations("GuestList");

  return (
    // Side by side; stacked only when even the two don't fit.
    <div className="flex flex-wrap gap-2.5">
      {/* The list only has something to edit while it's in use. */}
      {useList ? (
        <button type="button" onClick={onAddNames} className={`${HEADER_BTN_WIDTH} ${BTN_GHOST_LIGHT}`}>
          <Icon name="pencil" className="size-4" />
          {t("editList")}
        </button>
      ) : null}
      <button type="button" onClick={onAddGuest} className={`${HEADER_BTN_WIDTH} ${BTN_PRIMARY}`}>
        <Icon name="plus" className="size-[18px]" strokeWidth={2} />
        {t("addReply")}
      </button>
    </div>
  );
}
