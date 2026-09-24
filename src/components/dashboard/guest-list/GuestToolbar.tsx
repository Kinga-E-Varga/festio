"use client";

import { useTranslations } from "next-intl";
import { BTN_GHOST } from "@/components/dashboard/event-editor/styles";
import { Toggle } from "@/components/dashboard/event-editor/Toggle";
import { Icon } from "@/components/icons";

interface GuestToolbarProps {
  useList: boolean;
  onUseList: (value: boolean) => void;
  onAddNames: () => void;
  onAddGuest: () => void;
}

export function GuestToolbar({ useList, onUseList, onAddNames, onAddGuest }: GuestToolbarProps) {
  const t = useTranslations("GuestList");
  /* The same setting the event editor offers, so the same words. */
  const tEditor = useTranslations("EventEditor");

  return (
    <div>
      <Toggle
        label={tEditor("preloaded")}
        description={tEditor("preloadedNote")}
        checked={useList}
        onChange={onUseList}
      />

      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        <button type="button" onClick={onAddNames} className={BTN_GHOST}>
          <Icon name="list" className="size-4" />
          {t("addNames")}
        </button>
        <button type="button" onClick={onAddGuest} className={BTN_GHOST}>
          <Icon name="plus" className="size-4" />
          {t("addGuest")}
        </button>
        {/* Not wired yet: export comes in a later feature. */}
        <button type="button" className={BTN_GHOST}>
          <Icon name="download" className="size-4" />
          {t("export")}
        </button>
      </div>
    </div>
  );
}
