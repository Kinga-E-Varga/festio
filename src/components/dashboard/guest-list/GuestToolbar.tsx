"use client";

import { useTranslations } from "next-intl";
import { BTN_GHOST_LIGHT } from "@/components/dashboard/event-editor/styles";
import {
  GUEST_BTN_PRIMARY,
  HEADER_BTN_WIDTH,
} from "@/components/dashboard/guest-list/styles";
import { ButtonIcon } from "@/components/icons";

interface GuestToolbarProps {
  useList: boolean;
  onAddNames: () => void;
  onAddGuest: () => void;
}

export function GuestToolbar({
  useList,
  onAddNames,
  onAddGuest,
}: GuestToolbarProps) {
  const t = useTranslations("GuestList");

  return (
    /*
     * Equal columns as wide as the longer label, so the two always match.
     * Small screens fill the line, halved; the narrowest stack them.
     */
    <div className="grid w-full gap-2.5 @min-[400px]:auto-cols-fr @min-[400px]:grid-flow-col @min-[560px]:inline-grid @min-[560px]:w-auto @min-[820px]:contents">
      {/* The list only has something to edit while it's in use. */}
      {useList ? (
        <button
          type="button"
          onClick={onAddNames}
          className={`${HEADER_BTN_WIDTH} ${BTN_GHOST_LIGHT} @min-[820px]:-col-end-1 @min-[820px]:row-start-1`}
        >
          <ButtonIcon name="pencil" />
          {t("editList")}
        </button>
      ) : null}
      <button
        type="button"
        onClick={onAddGuest}
        className={`${HEADER_BTN_WIDTH} ${GUEST_BTN_PRIMARY} @min-[820px]:-col-end-1 @min-[820px]:row-start-2`}
      >
        <ButtonIcon name="plus" />
        {t("addReply")}
      </button>
    </div>
  );
}
