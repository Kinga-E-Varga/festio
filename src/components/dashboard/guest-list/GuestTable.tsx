"use client";

import { useLocale, useTranslations } from "next-intl";
import { BTN_GHOST, LABEL } from "@/components/dashboard/event-editor/styles";
import { RowEditor } from "@/components/dashboard/guest-list/RowEditor";
import { RowView } from "@/components/dashboard/guest-list/RowView";
import type { GuestActions } from "@/components/dashboard/guest-list/useGuestActions";
import type { GuestListState } from "@/components/dashboard/guest-list/useGuestList";
import { NEW_ROW, type RowEditorState } from "@/components/dashboard/guest-list/useRowEditor";
import { Icon } from "@/components/icons";
import { CATEGORIES, groupCategory } from "@/lib/guests";
import type { GuestCategory, GuestGroup, GuestRow } from "@/types/guests";

const CATEGORY_TITLE = {
  unknown: "categoryUnknown",
  going: "categoryGoing",
  notGoing: "categoryNotGoing",
  waiting: "categoryWaiting",
} as const satisfies Record<GuestCategory, string>;

interface GuestTableProps {
  list: GuestListState;
  actions: GuestActions;
  editor: RowEditorState;
  onStartList: () => void;
}

export function GuestTable({ list, actions, editor, onStartList }: GuestTableProps) {
  const t = useTranslations("GuestList");
  const adding = editor.editing === NEW_ROW;

  if (list.rows.length === 0 && !adding) {
    return (
      <div className="mt-[22px] border border-dashed border-mustard-400 px-6 py-10 text-center">
        <p className="font-serif text-[17px] text-neutral-900">{t("emptyTitle")}</p>
        <button type="button" onClick={() => editor.open(NEW_ROW)} className={`mt-4 ${BTN_GHOST}`}>
          <Icon name="plus" className="size-4" />
          {t("addGuest")}
        </button>
        {list.useList ? null : (
          <button
            type="button"
            onClick={onStartList}
            className="mx-auto mt-3 block cursor-pointer text-[13px] font-semibold text-forest-500 underline underline-offset-[3px] transition-colors hover:text-forest-600"
          >
            {t("emptyList")}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 border-t border-mustard-300">
      {adding ? (
        <div className="border-b border-mustard-300">
          <RowEditor
            initial={{ name: "", status: "going" }}
            withStatus
            onSave={(values) => {
              actions.saveReply(null, values);
              editor.close();
            }}
            onCancel={editor.close}
            onDirty={editor.reportDirty}
            pending={editor.pendingPrompt}
          />
        </div>
      ) : null}

      {list.groups.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-neutral-700">{t("noResults")}</p>
      ) : (
        CATEGORIES.map((category) => (
          <Category
            key={category}
            title={t(CATEGORY_TITLE[category])}
            groups={list.groups.filter((group) => groupCategory(group) === category)}
            list={list}
            actions={actions}
            editor={editor}
          />
        ))
      )}
    </div>
  );
}

interface CategoryProps {
  title: string;
  groups: GuestGroup[];
  list: GuestListState;
  actions: GuestActions;
  editor: RowEditorState;
}

/** A named block of the table. Hidden when it has nothing to show. */
function Category({ title, groups, list, actions, editor }: CategoryProps) {
  if (groups.length === 0) return null;
  const people = groups.reduce((total, group) => total + group.rows.length, 0);

  return (
    <section>
      <h2 className={`flex items-baseline gap-2 border-b border-mustard-300 bg-mustard-100 px-3 py-2 ${LABEL}`}>
        {title}
        <span className="text-neutral-700">{people}</span>
      </h2>
      {groups.map((group) => (
        <GroupView key={group.id} group={group} list={list} actions={actions} editor={editor} />
      ))}
    </section>
  );
}

interface GroupViewProps {
  group: GuestGroup;
  list: GuestListState;
  actions: GuestActions;
  editor: RowEditorState;
}

/** People who replied together share a bracket and one note; a split-off part names the rest. */
function GroupView({ group, list, actions, editor }: GroupViewProps) {
  const t = useTranslations("GuestList");
  const locale = useLocale();
  const together = group.rows.length > 1;

  return (
    <div className="border-b border-mustard-300 py-1">
      {/* Every group keeps the bracket's width, so columns line up across groups. */}
      <div className={`ml-1 border-l-2 ${together ? "my-1.5 border-mustard-400" : "border-transparent"}`}>
        {group.rows.map((row) => (
          <RowItem key={row.id} row={row} list={list} actions={actions} editor={editor} />
        ))}
        {group.note ? (
          <p className="px-3 pb-2 text-[12.5px] text-neutral-700 italic">
            “{group.note}”
          </p>
        ) : null}
        {group.with.length > 0 ? (
          <p className="px-3 pb-2 text-[12.5px] text-neutral-700">
            {t("repliedWith", { names: new Intl.ListFormat(locale).format(group.with) })}
          </p>
        ) : null}
      </div>
    </div>
  );
}

interface RowItemProps {
  row: GuestRow;
  list: GuestListState;
  actions: GuestActions;
  editor: RowEditorState;
}

function RowItem({ row, list, actions, editor }: RowItemProps) {
  if (editor.editing !== row.id) {
    return (
      <RowView row={row} waiting={list.waiting} actions={actions} onEdit={() => editor.open(row.id)} />
    );
  }

  const shared = { onCancel: editor.close, onDirty: editor.reportDirty, pending: editor.pendingPrompt };

  if (row.kind === "waiting") {
    return (
      <RowEditor
        {...shared}
        initial={{ name: row.listName.name, status: "going" }}
        withStatus={false}
        onSave={(values) => {
          actions.renameListName(row.listName.id, values.name);
          editor.close();
        }}
        onDelete={() => {
          actions.removeListName(row.listName.id);
          editor.close();
        }}
      />
    );
  }

  return (
    <RowEditor
      {...shared}
      initial={{ name: row.reply.name, status: row.reply.status }}
      withStatus
      onSave={(values) => {
        actions.saveReply(row.reply.id, values);
        editor.close();
      }}
      onDelete={() => {
        actions.removeReply(row.reply.id);
        editor.close();
      }}
    />
  );
}
