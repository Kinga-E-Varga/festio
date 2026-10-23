"use client";

import { useLocale, useTranslations } from "next-intl";
import { type ReactNode, useId, useState } from "react";
import { STATUS_KEY } from "@/components/dashboard/guest-list/labels";
import {
  fold,
  SMALL_BTN,
  STATUS_FILL,
} from "@/components/dashboard/guest-list/styles";
import { AttentionTag } from "@/components/dashboard/AttentionTag";
import { Dialog } from "@/components/dashboard/Dialog";
import { NameEditor } from "@/components/dashboard/guest-list/NameEditor";
import { ReplyEditor } from "@/components/dashboard/guest-list/ReplyEditor";
import { RowView } from "@/components/dashboard/guest-list/RowView";
import type { GuestActions } from "@/components/dashboard/guest-list/useGuestActions";
import type { GuestListState } from "@/components/dashboard/guest-list/useGuestList";
import {
  NEW_ROW,
  type RowEditorState,
} from "@/components/dashboard/guest-list/useRowEditor";
import { FoldChevron } from "@/components/icons";
import {
  BOX_PAD_SIZE,
  CARD_FRAME,
  LINK_TEXT,
} from "@/components/dashboard/styles";
import { attentionItems, CATEGORIES, groupCategory } from "@/lib/guests";
import type {
  AttentionItem,
  GuestCategory,
  GuestGroup,
  GuestRow,
} from "@/types/guests";

const CATEGORY = {
  /*
   * `ink`, with `fill`, draws the status dots; `line`, `dashed` and `split`
   * draw the groups' threads and their marks.
   */
  attention: {
    title: "categoryAttention",
    ink: "border-danger-600",
    fill: "bg-danger-600",
    line: "bg-danger-500",
    dashed: "border-danger-500",
    split: "border-danger-600",
  },
  going: {
    title: "categoryGoing",
    ink: "border-primary-700",
    fill: STATUS_FILL.going,
    line: "bg-primary-500",
    dashed: "border-primary-500",
    split: "border-primary-700",
  },
  notGoing: {
    title: "categoryNotGoing",
    ink: "border-warning-500",
    fill: STATUS_FILL.not_going,
    line: "bg-warning-400",
    dashed: "border-warning-400",
    split: "border-warning-500",
  },
  waiting: {
    title: "categoryWaiting",
    ink: "border-neutral-500",
    fill: "bg-neutral-500",
    line: "bg-neutral-300",
    dashed: "border-neutral-300",
    split: "border-neutral-400",
  },
} as const satisfies Record<
  GuestCategory,
  {
    title: string;
    ink: string;
    fill: string;
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
  const editing = list.guests.replies.find(
    (reply) => reply.id === editor.editing,
  );
  /* The whole reply, from whichever of its people was picked, even ones elsewhere in the table. */
  const group = editing
    ? list.guests.replies.filter(
        (reply) => reply.submissionId === editing.submissionId,
      )
    : [];

  /* In a dialog over the page: a new reply has no place in the list yet, and a saved one may be split across cards. */
  const replyDialog =
    adding || editing ? (
      <Dialog
        title={t(adding ? "addReply" : "editReply")}
        onDismiss={() => editor.guard(editor.close)}
      >
        <ReplyEditor
          group={group}
          questions={list.guests.questions}
          start={editing ? group.indexOf(editing) : 0}
          onSave={async (values) => {
            const ids = adding ? null : group.map((reply) => reply.id);
            if (await actions.saveReply(ids, values)) editor.close();
          }}
          onDelete={
            adding
              ? undefined
              : async () => {
                  const ids = group.map((reply) => reply.id);
                  if (await actions.removeReplies(ids)) editor.close();
                }
          }
          onCancel={editor.close}
          onDirty={editor.reportDirty}
          pending={editor.pendingPrompt}
        />
      </Dialog>
    ) : null;

  if (list.rows.length === 0) {
    return (
      <>
        {replyDialog}
        <div className="rounded-ui border border-dashed border-neutral-300 px-6 py-10 text-center">
          <p className="card-title">{t("emptyTitle")}</p>
          {list.useList ? null : (
            <button
              type="button"
              onClick={onStartList}
              className={`mx-auto mt-3 block cursor-pointer ${LINK_TEXT}`}
            >
              {t("emptyList")}
            </button>
          )}
        </div>
      </>
    );
  }

  /* A card per status, each folding on its own; search narrows them all. */
  return (
    <>
      {replyDialog}
      {list.groups.length === 0 ? (
        <p className={`${CARD_FRAME} py-8 text-center muted-text`}>
          {t("noResults")}
        </p>
      ) : (
        <div className="flex flex-col gap-3.5">
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

/**
 * A status as a card: its dot, title and count as the head, which folds it.
 * Hidden when it has nothing to show.
 */
function Category({ category, groups, list, actions, editor }: CategoryProps) {
  const t = useTranslations("GuestList");
  /* Folded on arrival, so the page opens on the counts; what needs sorting out stays open. */
  const [open, setOpen] = useState(category === "attention");
  const body = useId();
  if (groups.length === 0) return null;
  const people = groups.reduce((total, group) => total + group.rows.length, 0);
  const { title, fill } = CATEGORY[category];

  return (
    <section className={`overflow-hidden ${CARD_FRAME} ${BOX_PAD_SIZE}`}>
      {/* The whole head is the button, so a click anywhere on it folds the card. */}
      <h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={body}
          onClick={() => setOpen(!open)}
          className={`flex w-full cursor-pointer items-center gap-2.5 px-(--box-pad) py-(--box-head-y) text-left transition-colors hover:bg-neutral-200 ${open ? "border-b border-neutral-200" : ""}`}
        >
          <span
            aria-hidden="true"
            className={`size-3 shrink-0 rounded-full ${open ? "invisible" : fill}`}
          />
          <span className="card-title">{t(title)}</span>
          <span className="meta-face tabular-nums opacity-75">{people}</span>
          <FoldChevron open={open} className="ml-auto size-5" strokeWidth={2} />
        </button>
      </h2>
      {/* Grows from and shrinks to nothing; `inert` keeps a folded category out of reach. */}
      <div id={body} inert={!open} className={fold(open)}>
        {/* The fold squeezes this to nothing; the padding goes inside, where it hides too. */}
        <div className="min-h-0 overflow-hidden">
          {/* The page boxes' padding, all round. */}
          <div className="divide-y divide-neutral-200 p-(--box-pad)">
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
          <span className="min-w-0 truncate name-text">{item.name}</span>
          <AttentionTag tag="duplicate" />
        </div>
      </Strand>
      <p className="pb-2 muted-text">
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
    <div className="@container rounded-ui border border-neutral-200 bg-neutral-50 px-3 py-2">
      <p className="hint-text">{t("repliedOn", { date })}</p>
      {/* Standing alone to compare, each one keeps its status and edit. */}
      <RowItem
        row={row}
        lead
        list={list}
        actions={actions}
        editor={editor}
        inCard
      />
      {party.length > 0 ? (
        <p className="py-1 muted-text">
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
    b: (chunks) => <b className="strong-text">{chunks}</b>,
  });
}

const DOT = "size-3 -translate-y-1/2 rounded-full border-2";

/**
 * A group's padding: 6px off the rules between groups (none at the box's
 * edges), and room on the left for its thread and dots. `--thread` is how far
 * left of the rows the thread runs (`THREAD_X`); the room is that plus half a
 * dot (`DOT`'s 12px), so the dots' left edge sits on the box's padding.
 */
const GROUP =
  "py-1.5 first:pt-0 last:pb-0 [--thread:20px] pl-[calc(var(--thread)+6px)] @min-[720px]:[--thread:28px]";

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
          <RowItem
            row={row}
            lead={at === 0}
            list={list}
            actions={actions}
            editor={editor}
          />
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
          <p className="flex min-h-8 items-center py-1 muted-text">
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

/** The thread's x, `--thread` (set by `GROUP`) left of the rows; the line and every mark centre on it. */
const THREAD_X = "-left-(--thread) -translate-x-1/2";
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
  /** See `RowView`. */
  lead: boolean;
  list: GuestListState;
  actions: GuestActions;
  editor: RowEditorState;
  /** Sits in a duplicate card; see `RowView`. */
  inCard?: boolean;
}

function RowItem({
  row,
  lead,
  list,
  actions,
  editor,
  inCard = false,
}: RowItemProps) {
  /* A reply is edited in a dialog (`GuestTable`); its row stays as it is. */
  if (editor.editing !== row.id || row.kind === "reply") {
    const party =
      row.kind === "reply"
        ? list.guests.replies.flatMap((other) =>
            other.id !== row.reply.id &&
            other.submissionId === row.reply.submissionId
              ? [other.name]
              : [],
          )
        : [];
    return (
      <RowView
        row={row}
        party={party}
        lead={lead}
        waiting={list.waiting}
        questions={list.guests.questions}
        actions={actions}
        onEdit={() => editor.open(row.id)}
        guard={editor.guard}
        inCard={inCard}
      />
    );
  }

  return (
    <NameEditor
      onCancel={editor.close}
      onDirty={editor.reportDirty}
      pending={editor.pendingPrompt}
      initial={row.listName.name}
      onSave={async (name) => {
        if (await actions.renameListName(row.listName.id, name)) editor.close();
      }}
    />
  );
}
