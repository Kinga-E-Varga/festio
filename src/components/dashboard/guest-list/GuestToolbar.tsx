"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useDismiss } from "@/components/dashboard/event-nav/useDismiss";
import { BTN_PRIMARY } from "@/components/dashboard/event-editor/styles";
import { BTN_LIST_OUTLINE } from "@/components/dashboard/guest-list/styles";
import { MENU_BOX } from "@/components/dashboard/styles";
import { ButtonIcon, FoldChevron } from "@/components/icons";

interface GuestToolbarProps {
  useList: boolean;
  /** Turns the invite list on or off; the caller asks first when something is unsaved. */
  onUseList: (on: boolean) => void;
  onAddNames: () => void;
  onAddGuest: () => void;
}

/** A menu item: the whole row is the button. */
const ITEM =
  "flex w-full items-center justify-center gap-2.5 px-3 py-2 text-center row-text transition-colors hover:bg-secondary-400/30";

/**
 * The list's two actions, above the search: New reply, then the invite
 * list's menu (use it, or edit it and stop using it).
 */
export function GuestToolbar({
  useList,
  onUseList,
  onAddNames,
  onAddGuest,
}: GuestToolbarProps) {
  const t = useTranslations("GuestList");
  const tEditor = useTranslations("EventEditor");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useDismiss(open, rootRef, () => setOpen(false));

  /** Closes the menu, then does what the item says. */
  const pick = (action: () => void) => () => {
    setOpen(false);
    action();
  };

  return (
    /*
     * Two equal columns, each as wide as the wider button, and at least 180px.
     * New reply comes first while they sit above the search, last once they
     * share its row (from 800px, `GuestManager`).
     */
    <div className="grid grid-cols-2 gap-2.5 @min-[560px]:grid-cols-[repeat(2,minmax(180px,1fr))]">
      <button
        type="button"
        onClick={onAddGuest}
        className={`w-full whitespace-nowrap @min-[800px]:order-last ${BTN_PRIMARY}`}
      >
        <ButtonIcon name="plus" />
        {t("addReply")}
      </button>

      <div ref={rootRef} className="relative">
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="true"
          onClick={() => setOpen(!open)}
          className={`w-full whitespace-nowrap ${BTN_LIST_OUTLINE}`}
        >
          {t("inviteList")}
          <FoldChevron open={open} />
        </button>

        {open ? (
          <ul
            className={`${MENU_BOX} top-full right-0 mt-1.5 w-max max-w-[calc(100vw-36px)] min-w-full`}
          >
            {useList ? (
              <>
                <li>
                  <button
                    type="button"
                    onClick={pick(onAddNames)}
                    className={ITEM}
                  >
                    <ButtonIcon name="pencil" />
                    {t("editList")}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={pick(() => onUseList(false))}
                    className={ITEM}
                  >
                    <ButtonIcon name="close" />
                    {t("stopList")}
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  type="button"
                  onClick={pick(() => onUseList(true))}
                  className={ITEM}
                >
                  <ButtonIcon name="guests" />
                  {tEditor("useList")}
                </button>
              </li>
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
