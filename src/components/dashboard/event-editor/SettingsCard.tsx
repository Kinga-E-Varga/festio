"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { BoxHead } from "@/components/dashboard/BoxHead";
import { UnsavedPrompt } from "@/components/dashboard/UnsavedPrompt";
import {
  BOX_PAD,
  BOX_ROW,
  BTN_GHOST_LIGHT,
  BTN_PRIMARY,
  BUTTON,
  ERROR,
} from "@/components/dashboard/styles";

/** Edit, in a card's head: edged and filled in the cards' edge colour. */
const EDIT = `${BUTTON} border-neutral-300 bg-neutral-300 text-neutral-800 hover:border-neutral-400 hover:bg-neutral-400 hover:text-neutral-900`;

/** A card's way into its fields and back out, from `EventEditor`. */
export interface CardEditing {
  /** The card is showing its fields. */
  open: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  /** Something changed and every warning has been ticked. */
  canSave: boolean;
  /** Edit was clicked on another card while this one has unsaved changes. */
  prompt: { onDiscard: () => void; onKeep: () => void; asked: number } | null;
}

interface SettingsCardProps {
  title: string;
  /** What the card is for, under its title. */
  description?: ReactNode;
  /** An anchor other pages link to, held clear of the top bar. */
  id?: string;
  /** Left out on a card of actions, which has nothing to edit. */
  editing?: CardEditing;
  /** What the card shows: its rows while read, its fields while open. */
  children: ReactNode;
}

/**
 * One group of Event settings as a card, like the Overview's. Read first, as
 * rows; Edit turns this card alone into its fields, with Cancel and Save at
 * its foot.
 */
export function SettingsCard({
  title,
  description,
  id,
  editing,
  children,
}: SettingsCardProps) {
  const t = useTranslations("EventEditor");
  const open = editing?.open ?? false;

  return (
    <section
      id={id}
      className={`scroll-mt-[88px] rounded-ui border bg-neutral-50 transition-colors ${BOX_PAD} ${
        open ? "border-neutral-500" : "border-neutral-300"
      }`}
    >
      <BoxHead
        title={title}
        hint={description}
        aside={
          editing && !open ? (
            <button type="button" onClick={editing.onEdit} className={EDIT}>
              {t("edit")}
            </button>
          ) : null
        }
      />

      {/* The blocks inside lay themselves out against the card, not the page. */}
      <div className="@container">{children}</div>

      {editing && open ? (
        <footer className="mt-(--box-pad) flex flex-col gap-4 border-t border-neutral-200 pt-(--box-pad)">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={editing.onCancel}
              className={BTN_GHOST_LIGHT}
            >
              {t("cancel")}
            </button>
            <button
              type="button"
              onClick={editing.onSave}
              disabled={!editing.canSave}
              className={BTN_PRIMARY}
            >
              {t("save")}
            </button>
          </div>
          {editing.prompt ? (
            <UnsavedPrompt
              title={t("unsavedChanges")}
              discardLabel={t("discardChanges")}
              keepLabel={t("keepEditing")}
              onDiscard={editing.prompt.onDiscard}
              onKeep={editing.prompt.onKeep}
              asked={editing.prompt.asked}
            />
          ) : null}
        </footer>
      ) : null}
    </section>
  );
}

/**
 * A setting's row: its label on the left, its value or its field on the
 * right, the label over it on a narrow card. Read and open share it, so a
 * card keeps its shape when Edit turns its values into fields.
 */
const ROW = `${BOX_ROW} grid grid-cols-1 gap-1.5 py-3 first:pt-0 last:pb-0 @min-[420px]:grid-cols-[150px_minmax(0,1fr)] @min-[420px]:gap-x-4`;

/** One setting while read: its label, then its value with an optional line under it. */
export function ReadRow({
  label,
  children,
  note,
}: {
  label: string;
  children: ReactNode;
  note?: ReactNode;
}) {
  return (
    <div className={ROW}>
      <dt className="muted-text">{label}</dt>
      <dd className="min-w-0 font-medium break-words text-neutral-950">
        {children}
        {note ? (
          <span className="mt-0.5 block font-normal hint-text">{note}</span>
        ) : null}
      </dd>
    </div>
  );
}

/**
 * A row that does something rather than holds a value, in a card of actions:
 * its title where a label goes, then what it does, its button under that and
 * whatever the button opens under the button.
 */
export function ActionRow({
  title,
  children,
  action,
  below,
}: {
  title: string;
  children: ReactNode;
  /** Its button; a row without one only explains. */
  action?: ReactNode;
  below?: ReactNode;
}) {
  return (
    <div className={ROW}>
      <h3 className="muted-text">{title}</h3>
      <div className="min-w-0">
        <p className="hint-text">{children}</p>
        {action ? <div className="mt-3">{action}</div> : null}
        {below}
      </div>
    </div>
  );
}

/** A card's rows while read. */
export function ReadRows({ children }: { children: ReactNode }) {
  return <dl>{children}</dl>;
}

/**
 * One setting while open: the read row's label, its field where the value
 * was, then its error, its hint and the warning a change raises.
 */
export function EditRow({
  label,
  htmlFor,
  hint,
  error,
  warning,
  children,
}: {
  label: string;
  /** The field's id, so the label points at it; a group of controls has none. */
  htmlFor?: string;
  hint?: ReactNode;
  error?: string | null;
  /** Under the hint: the change warning this field raises. */
  warning?: ReactNode;
  children: ReactNode;
}) {
  const Label = htmlFor ? "label" : "span";

  return (
    <div className={ROW}>
      {/* Level with a field's text, beside it. */}
      <Label
        htmlFor={htmlFor}
        className="muted-text @min-[420px]:flex @min-[420px]:min-h-input @min-[420px]:items-center @min-[420px]:self-start"
      >
        {label}
      </Label>
      <div className="flex min-w-0 flex-col gap-1.5">
        {children}
        {error ? <p className={ERROR}>{error}</p> : null}
        {hint ? <p className="hint-text">{hint}</p> : null}
        {warning}
      </div>
    </div>
  );
}
