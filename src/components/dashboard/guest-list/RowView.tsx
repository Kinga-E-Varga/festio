"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { MatchPicker } from "@/components/dashboard/guest-list/MatchPicker";
import { COLUMNS, ISSUE, ISSUE_LABEL, SMALL_BTN } from "@/components/dashboard/guest-list/styles";
import type { GuestActions } from "@/components/dashboard/guest-list/useGuestActions";
import { Icon } from "@/components/icons";
import { rowName } from "@/lib/guests";
import type { GuestRow, ListName } from "@/types/guests";

interface RowViewProps {
  row: GuestRow;
  waiting: ListName[];
  actions: GuestActions;
  onEdit: () => void;
}

const STATUS = {
  going: { key: "statusGoing", tone: "text-forest-500" },
  not_going: { key: "statusNotGoing", tone: "text-rust-500" },
} as const;

export function RowView({ row, waiting, actions, onEdit }: RowViewProps) {
  const t = useTranslations("GuestList");
  const [matching, setMatching] = useState(false);
  const name = rowName(row);
  const reply = row.kind === "reply" ? row : null;

  return (
    <div>
      <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5 ${COLUMNS}`}>
        <span className="min-w-0 flex-1 truncate text-[14px] text-neutral-900">{name}</span>

        {row.kind === "waiting" ? (
          <label className="inline-flex cursor-pointer items-center gap-1.5 text-[12.5px] text-neutral-800">
            <input
              type="checkbox"
              checked={row.listName.sent}
              onChange={() => actions.toggleSent(row.listName)}
              aria-label={t("sentLabel", { name })}
              className="size-4 cursor-pointer accent-forest-500"
            />
            {t("sent")}
          </label>
        ) : (
          <span className={`text-[12.5px] font-medium ${STATUS[row.reply.status].tone}`}>
            {t(STATUS[row.reply.status].key)}
          </span>
        )}

        <div>
          {reply?.unlisted ? (
            <div className={ISSUE} title={t("unmatchedHint")}>
              <span className={ISSUE_LABEL}>{t("unknownTag")}</span>
              {reply.unknown === "unmatched" ? (
                <>
                  <button type="button" onClick={() => setMatching(true)} className={SMALL_BTN}>
                    {t("matchTo")}
                  </button>
                  <button type="button" onClick={() => actions.addAsNew(reply.reply)} className={SMALL_BTN}>
                    {t("addAsNew")}
                  </button>
                </>
              ) : null}
            </div>
          ) : null}
        </div>

        <div>
          {reply?.repeated ? (
            <div className={ISSUE} title={t("duplicateHint")}>
              <span className={ISSUE_LABEL}>{t("duplicateTag")}</span>
              {/* The choice belongs to the reply that came in second. */}
              {reply.unknown === "duplicate" ? (
                <>
                  <button type="button" onClick={() => actions.keep(reply.reply.id)} className={SMALL_BTN}>
                    {t("keepBoth")}
                  </button>
                  <button type="button" onClick={() => actions.removeReply(reply.reply.id)} className={SMALL_BTN}>
                    {t("samePerson")}
                  </button>
                </>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="@min-[720px]:flex @min-[720px]:justify-end">
          <button type="button" onClick={onEdit} aria-label={t("editLabel", { name })} className={SMALL_BTN}>
            <Icon name="pencil" className="size-3.5" />
            {t("edit")}
          </button>
        </div>
      </div>

      {matching && row.kind === "reply" ? (
        <MatchPicker
          waiting={waiting}
          onPick={(listName) => {
            actions.match(row.reply.id, listName);
            setMatching(false);
          }}
          onClose={() => setMatching(false)}
        />
      ) : null}
    </div>
  );
}
