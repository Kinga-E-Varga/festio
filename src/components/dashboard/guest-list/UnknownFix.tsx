"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { MatchPicker } from "@/components/dashboard/guest-list/MatchPicker";
import { SMALL_BTN } from "@/components/dashboard/guest-list/styles";
import type { GuestActions } from "@/components/dashboard/guest-list/useGuestActions";
import type { GuestReply, ListName } from "@/types/guests";

interface UnknownFixProps {
  reply: GuestReply;
  waiting: ListName[];
  actions: GuestActions;
  /** Holds the fix back while another row has unsaved changes. */
  guard: (action: () => void) => void;
}

/** What's off with an unknown reply in one sentence, then, on the line below, the ways to sort it out. */
export function UnknownFix({ reply, waiting, actions, guard }: UnknownFixProps) {
  const t = useTranslations("GuestList");
  const [matching, setMatching] = useState(false);

  return (
    <div className="pb-2 text-[12.5px] text-neutral-700">
      <p>{t("unmatchedHint")}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => guard(() => setMatching(true))} className={SMALL_BTN}>
          {t("matchTo")}
        </button>
        <button type="button" onClick={() => guard(() => actions.addAsNew(reply))} className={SMALL_BTN}>
          {t("addAsNew")}
        </button>
      </div>

      {matching ? (
        <MatchPicker
          name={reply.name}
          waiting={waiting}
          onPick={(listName) => {
            actions.match(reply.id, listName);
            setMatching(false);
          }}
          onClose={() => setMatching(false)}
        />
      ) : null}
    </div>
  );
}
