"use client";

import { useLocale, useTranslations } from "next-intl";
import { type ReactNode, useId, useState } from "react";
import { STATUS_KEY } from "@/components/dashboard/guest-list/labels";
import {
  ATTENTION_TAG,
  fold,
  SMALL_BTN,
} from "@/components/dashboard/guest-list/styles";
import { Dialog } from "@/components/dashboard/guest-list/Dialog";
import { NameEditor } from "@/components/dashboard/guest-list/NameEditor";
import { ReplyEditor } from "@/components/dashboard/guest-list/ReplyEditor";
import { RowView } from "@/components/dashboard/guest-list/RowView";
import type { GuestActions } from "@/components/dashboard/guest-list/useGuestActions";
import type { GuestListState } from "@/components/dashboard/guest-list/useGuestList";
import {
  NEW_ROW,
  type RowEditorState,
} from "@/components/dashboard/guest-list/useRowEditor";
import { Icon } from "@/components/icons";
import { STRONG_TEXT, TEXT_LINK } from "@/components/dashboard/styles";
import { attentionItems, CATEGORIES, groupCategory } from "@/lib/guests";
import type {
  AttentionItem,
  GuestCategory,
  GuestGroup,
  GuestRow,
} from "@/types/guests";

const CATEGORY = {
  /*
   * `band` fills the title's band (200) and inks its text; `hover` makes
   * both one shade darker while its button is hovered; `ink`, with `fill`,
   * draws the status dots; `line`, `dashed` and `split` draw the groups'
   * threads and their marks.
   */
  attention: {
    title: "categoryAttention",
    band: "bg-danger-200 text-danger-800",
    ink: "border-danger-600",
    fill: "bg-danger-600",
    hover: "hover:bg-danger-400 hover:text-danger-900",
    line: "bg-danger-500",
    dashed: "border-danger-500",
    split: "border-danger-600",
  },
  going: {
    title: "categoryGoing",
    band: "bg-primary-200 text-primary-900",
    ink: "border-primary-700",
    fill: "bg-primary-700",
    hover: "hover:bg-primary-400 hover:text-primary-950",
    line: "bg-primary-500",
    dashed: "border-primary-500",
    split: "border-primary-700",
  },
  notGoing: {
    title: "categoryNotGoing",
    band: "bg-warning-200 text-warning-700",
    ink: "border-warning-500",
    fill: "bg-warning-500",
    hover: "hover:bg-warning-300 hover:text-warning-800",
    line: "bg-warning-400",
    dashed: "border-warning-400",
    split: "border-warning-500",
  },
  waiting: {
    title: "categoryWaiting",
    band: "bg-neutral-200 text-neutral-700",
    ink: "border-neutral-500",
    fill: "bg-neutral-500",
    hover: "hover:bg-neutral-300 hover:text-neutral-800",
    line: "bg-neutral-300",
    dashed: "border-neutral-300",
    split: "border-neutral-400",
  },
} as const satisfies Record<
  GuestCategory,
  {
    title: string;
    band: string;
    ink: string;
    fill: string;
    hover: string;
    line: string;
    dashed: string;
    split: string;
  }
>;

interface GuestTableProps {
  list: GuestListState;
  actions: GuestActions;
  editor: RowEditorState;
  onStartList: () => void;
}

export function GuestTable({
  list,
  actions,
  editor,
  onStartList,
}: GuestTableProps) {
  const t = useTranslations("GuestList");
  const adding = editor.editing === NEW_ROW;

  /* In a dialog over the page: a new reply has no place in the list yet. */
  const newReply = adding ? (
    <Dialog title={t("addReply")} onDismiss={() => editor.guard(editor.close)}>
      <ReplyEditor
        reply={null}
        questions={list.guests.questions}
        party={[]}
        onSave={(values) => {
          actions.saveReply(null, values);
          editor.close();
        }}
        onCancel={editor.close}
        onDirty={editor.reportDirty}
        pending={editor.pendingPrompt}
      />
    </Dialog>
  ) : null;

  if (list.rows.length === 0) {
    return (
      <>
        {newReply}
        <div className="rounded-ui border border-dashed border-neutral-400 px-6 py-10 text-center">
          <p className="font-serif text-[17px] text-neutral-950">
            {t("emptyTitle")}
          </p>
          {list.useList ? null : (
            <button
              type="button"
              onClick={onStartList}
              className={`mx-auto mt-3 block cursor-pointer text-[12.5px] ${TEXT_LINK}`}
            >
              {t("emptyList")}
            </button>
          )}
        </div>
      </>
    );
  }

  /* The table's sides and bottom, padded so nothing inside touches them. */
  return (
    <>
      {newReply}
      <div className="rounded-ui border border-neutral-400 bg-neutral-50 px-4 py-4 @min-[720px]:px-5">
        {list.groups.length === 0 ? (
          <p className="py-8 text-center text-[12.5px] text-neutral-700">
            {t("noResults")}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {CATEGORIES.map((category) => (
              <Category
                key={category}
                category={category}
                groups={list.groups.filter(
                  (group) => groupCategory(group) === category,
                )}
                list={list}
                actions={actions}
                editor={editor}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

interface CategoryProps {
  category: GuestCategory;
  groups: GuestGroup[];
  list: GuestListState;
  actions: GuestActions;
  editor: RowEditorState;
}

/** A named block of the table. Hidden when it has nothing to show. */
function Category({ category, groups, list, actions, editor }: CategoryProps) {
  const t = useTranslations("GuestList");
  /* Folded on arrival, so the page opens on the counts; what needs sorting out stays open. */
  const [open, setOpen] = useState(category === "attention");
  const body = useId();
  if (groups.length === 0) return null;
  const people = groups.reduce((total, group) => total + group.rows.length, 0);
  const { title, band, hover } = CATEGORY[category];

  return (
    <section>
      {/* The whole band is the button, so a click anywhere folds the category. */}
      <h2 className="text-[14px] font-medium">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={body}
          onClick={() => setOpen(!open)}
          className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors ${band} ${hover}`}
        >
          <span className="flex items-baseline gap-1.5">
            {t(title)}
            <span className="tabular-nums">{people}</span>
          </span>
          <Icon
            name="chevron"
            className={`ml-auto size-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            strokeWidth={2}
          />
        </button>
      </h2>
      {/* Grows from and shrinks to nothing; `inert` keeps a folded category out of reach. */}
      <div id={body} inert={!open} className={fold(open)}>
        <div className="min-h-0 divide-y divide-neutral-400 overflow-hidden">
          {category === "attention"
            ? attentionItems(groups).map((item) => (
                <AttentionCard
                  key={item.id}
                  item={item}
                  list={list}
                  actions={actions}
                  editor={editor}
                />
              ))
            : groups.map((group) => (
                <GroupView
                  key={group.id}
                  group={group}
                  list={list}
                  actions={actions}
                  editor={editor}
                />
              ))}
        </div>
      </div>
    </section>
  );
}

interface AttentionCardProps {
  item: AttentionItem;
  list: GuestListState;
  actions: GuestActions;
  editor: RowEditorState;
}

/** An unknown reply reads like any group; replies sharing a name sit side by side to compare. */
function AttentionCard({ item, list, actions, editor }: AttentionCardProps) {
  const t = useTranslations("GuestList");
  if (item.kind === "unknown") {
    return (
      <GroupView
        group={item.group}
        list={list}
        actions={actions}
        editor={editor}
      />
    );
  }

  return (
    <div className={GROUP}>
      {/* Laid out like a person row, so the name and its dot line up with theirs. */}
      <Strand
        joined={false}
        first
        last
        category="attention"
        at="person"
        mark={
          <span
            className={`${DOT} ${CATEGORY.attention.ink} ${CATEGORY.attention.fill}`}
          />
        }
      >
        <div className="flex min-h-10 flex-wrap items-center gap-2 py-1">
          <span className="min-w-0 truncate text-[14px] font-medium text-neutral-950">
            {item.name}
          </span>
          <span className={ATTENTION_TAG}>{t("duplicateTag")}</span>
        </div>
      </Strand>
      <p className="pb-2 text-[12.5px] text-neutral-700">
        {t("sameName", { count: item.entries.length })}
      </p>
      <div className="grid gap-3 pb-3.5 @min-[720px]:grid-cols-2">
        {item.entries.map((row) => (
          <SameNameReply
            key={row.id}
            row={row}
            list={list}
            actions={actions}
            editor={editor}
          />
        ))}
      </div>
    </div>
  );
}

interface SameNameReplyProps {
  row: Extract<GuestRow, { kind: "reply" }>;
  list: GuestListState;
  actions: GuestActions;
  editor: RowEditorState;
}

/** One of the replies with a shared name: when it came, the person (their message in the details), who came with them. */
function SameNameReply({ row, list, actions, editor }: SameNameReplyProps) {
  const t = useTranslations("GuestList");
  const locale = useLocale();
  /* The whole party, even the ones sitting in Confirmed or Declined, so the replies compare. */
  const party = list.rows.flatMap((other) =>
    other.kind === "reply" &&
    other.id !== row.id &&
    other.reply.submissionId === row.reply.submissionId
      ? [`${other.reply.name} (${t(STATUS_KEY[other.reply.status])})`]
      : [],
  );
  const date = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(row.reply.repliedAt));

  return (
    <div className="@container rounded-ui border border-neutral-400 bg-neutral-50 px-3 py-2">
      <p className="text-[11.5px] text-neutral-700">
        {t("repliedOn", { date })}
      </p>
      <RowItem row={row} list={list} actions={actions} editor={editor} inCard />
      {party.length > 0 ? (
        <p className="py-1 text-[12.5px] text-neutral-700">
          <RepliedWith names={party} />
        </p>
      ) : null}
      {row.later ? (
        <button
          type="button"
          onClick={() => editor.guard(() => actions.different(row.reply.id))}
          className={`my-1.5 ${SMALL_BTN}`}
        >
          {t("differentPerson")}
        </button>
      ) : null}
    </div>
  );
}

/** "Replied with …", the others' names in bold as one list. */
function RepliedWith({ names }: { names: string[] }) {
  const t = useTranslations("GuestList");
  const locale = useLocale();
  return t.rich("repliedWith", {
    names: new Intl.ListFormat(locale).format(names),
    b: (chunks) => <b className={STRONG_TEXT}>{chunks}</b>,
  });
}

const DOT = "size-3 -translate-y-1/2 rounded-full border-2";

/** A group's padding: the room on the left holds its thread and dots. */
const GROUP = "py-1.5 pr-3 pl-10 @min-[720px]:pr-5 @min-[720px]:pl-13";

/** Filled once there's something to show for it — a reply, or an invite sent; dashed while the invite isn't. */
function statusDot(row: GuestRow, category: GuestCategory): string {
  const { ink, fill } = CATEGORY[category];
  if (row.kind === "waiting" && !row.listName.sent)
    return `${DOT} border-dashed ${ink} bg-neutral-50`;
  return `${DOT} ${ink} ${fill}`;
}

interface GroupViewProps {
  group: GuestGroup;
  list: GuestListState;
  actions: GuestActions;
  editor: RowEditorState;
}

/** People who replied together share a thread; a split-off part names the rest. Their message is in each one's details. */
function GroupView({ group, list, actions, editor }: GroupViewProps) {
  const category = groupCategory(group);
  const parts = group.rows.length + (group.with.length > 0 ? 1 : 0);
  const place = (at: number) => ({
    joined: parts > 1,
    first: at === 0,
    last: at === parts - 1,
  });

  return (
    <div className={GROUP}>
      {group.rows.map((row, at) => (
        <Strand
          key={row.id}
          {...place(at)}
          category={category}
          at="person"
          mark={<span className={statusDot(row, category)} />}
        >
          <RowItem row={row} list={list} actions={actions} editor={editor} />
        </Strand>
      ))}
      {group.with.length > 0 ? (
        <Strand
          {...place(parts - 1)}
          category={category}
          at="with"
          mark={
            <span
              className={`size-2.5 -translate-y-1/2 rounded-full border-2 border-dashed bg-neutral-50 ${CATEGORY[category].split}`}
            />
          }
        >
          {/* One span inside the flex line, or flex drops the space before the name. */}
          <p className="flex min-h-8 items-center py-1 text-[12.5px] text-neutral-700">
            <span>
              <RepliedWith names={group.with} />
            </span>
          </p>
        </Strand>
      ) : null}
    </div>
  );
}

/*
 * Where each part's mark sits, and so where the thread meets it. Each part
 * draws its own piece of thread (above and below its mark), so the thread
 * starts and ends exactly on the first and last marks at any height.
 */
const STRAND = {
  /*
   * The name line's middle, 20px down: while the badge sits under it the
   * line is as tall as its buttons, and once they share a row the row is
   * 40px tall.
   */
  person: { mark: "top-[20px]", above: "h-[20px]", below: "top-[20px]" },
  with: { mark: "top-1/2", above: "h-1/2", below: "top-1/2" },
} as const;

/** The thread's x, 20px (wide: 28px) left of the rows; the line and every mark centre on it. */
const THREAD_X = "-left-5 -translate-x-1/2 @min-[720px]:-left-7";
const LINE = `absolute w-px ${THREAD_X}`;

interface StrandProps {
  category: GuestCategory;
  joined: boolean;
  first: boolean;
  last: boolean;
  at: keyof typeof STRAND;
  mark: ReactNode;
  children: ReactNode;
}

function Strand({
  joined,
  first,
  last,
  category,
  at,
  mark,
  children,
}: StrandProps) {
  const y = STRAND[at];
  const { line, dashed } = CATEGORY[category];
  /* The split-off names hang by a dashed thread: they're elsewhere in the table. */
  const above = at === "with" ? `border-l border-dashed ${dashed}` : line;

  return (
    <div className="relative">
      {joined && !first ? (
        <span aria-hidden className={`${LINE} top-0 ${y.above} ${above}`} />
      ) : null}
      {joined && !last ? (
        <span aria-hidden className={`${LINE} bottom-0 ${y.below} ${line}`} />
      ) : null}
      <span aria-hidden className={`absolute flex ${THREAD_X} ${y.mark}`}>
        {mark}
      </span>
      {children}
    </div>
  );
}

interface RowItemProps {
  row: GuestRow;
  list: GuestListState;
  actions: GuestActions;
  editor: RowEditorState;
  /** Sits in a duplicate card; see `RowView`. */
  inCard?: boolean;
}

function RowItem({ row, list, actions, editor, inCard = false }: RowItemProps) {
  if (editor.editing !== row.id) {
    return (
      <RowView
        row={row}
        waiting={list.waiting}
        questions={list.guests.questions}
        actions={actions}
        onEdit={() => editor.open(row.id)}
        guard={editor.guard}
        inCard={inCard}
      />
    );
  }

  const shared = {
    onCancel: editor.close,
    onDirty: editor.reportDirty,
    pending: editor.pendingPrompt,
  };

  if (row.kind === "waiting") {
    return (
      <NameEditor
        {...shared}
        initial={row.listName.name}
        onSave={(name) => {
          actions.renameListName(row.listName.id, name);
          editor.close();
        }}
      />
    );
  }

  const { reply } = row;
  const party = list.guests.replies.flatMap((other) =>
    other.id !== reply.id && other.submissionId === reply.submissionId
      ? [other.name]
      : [],
  );

  return (
    <ReplyEditor
      {...shared}
      reply={reply}
      questions={list.guests.questions}
      party={party}
      onSave={(values) => {
        actions.saveReply(reply.id, values);
        editor.close();
      }}
    />
  );
}
