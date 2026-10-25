"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import type { Question } from "@/db/schemas/event";
import { RollArrow, RollPanel } from "../design/RollOut";
import {
  BOX_MARK,
  BOX_MARK_STROKE,
  MARK_SLOT,
  SECTION_NAME,
  SECTION_REVEAL,
} from "../design/styles";
import { QUESTION_ROW } from "./styles";

interface QuestionListProps {
  /** The active questions, in the form's order. */
  questions: Question[];
  /** The question whose form is out, under its row. */
  editing: string | null;
  /** The question `form` belongs to: still drawn while it rolls back. */
  formOf: string | null;
  form: ReactNode;
  onReorder: (questions: Question[]) => void;
  /** A row's bar: opens its form, or closes it when open. */
  onToggle: (question: Question) => void;
}

/**
 * The host's active questions, reordered by dragging a row's handle — with
 * the mouse, a finger, or the keyboard (Space to lift, arrows to move,
 * Space to drop). A small move is needed before a drag starts, so a tap on
 * the handle does nothing.
 */
export function QuestionList({
  questions,
  editing,
  formOf,
  form,
  onReorder,
  onToggle,
}: QuestionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function dropped({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const from = questions.findIndex(({ id }) => id === active.id);
    const to = questions.findIndex(({ id }) => id === over.id);
    onReorder(arrayMove(questions, from, to));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={dropped}
    >
      <SortableContext
        items={questions.map(({ id }) => id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="flex flex-col gap-1.5">
          {questions.map((question) => (
            <QuestionRow
              key={question.id}
              question={question}
              open={editing === question.id}
              form={formOf === question.id ? form : null}
              onToggle={() => onToggle(question)}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

/**
 * One question, built like a Content card: the whole bar opens its form
 * under it (the arrow says Edit), the handle in the mark slot drags it, and
 * the form hangs off the bar, sharing its edge.
 */
function QuestionRow({
  question,
  open,
  form,
  onToggle,
}: {
  question: Question;
  open: boolean;
  /** Its form, if it is the last one opened; rolled out while `open`. */
  form: ReactNode;
  onToggle: () => void;
}) {
  const t = useTranslations("RepliesTab");
  const panelId = `question-form-${question.id}`;
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  return (
    <li
      ref={setNodeRef}
      /* Where the drag has moved the row this frame: only known as it happens. */
      style={{ transform: CSS.Transform.toString(transform), transition }}
      data-dragging={isDragging || undefined}
      className="relative flex flex-col data-dragging:z-10 data-dragging:shadow-menu"
    >
      <div className={`${QUESTION_ROW} group`}>
        {/* Laid first, so the handle is drawn over it. */}
        <button
          type="button"
          data-reveal
          aria-label={t("edit", { question: question.label })}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className={SECTION_REVEAL}
        />
        <button
          ref={setActivatorNodeRef}
          type="button"
          aria-label={t("move", { question: question.label })}
          className={`${MARK_SLOT} relative h-8 cursor-grab touch-none focus-visible:outline-2 focus-visible:outline-neutral-500 active:cursor-grabbing`}
          {...attributes}
          {...listeners}
        >
          <Icon
            name="grip"
            className={`${BOX_MARK} w-[22px]`}
            strokeWidth={BOX_MARK_STROKE}
          />
        </button>
        <p className={`${SECTION_NAME} min-w-0 flex-1 truncate`}>
          {question.label}
        </p>
        <RollArrow
          open={open}
          action={t("editShort")}
          reveal="group-has-[[data-reveal]:focus-visible]:opacity-100"
        />
      </div>
      <RollPanel id={panelId} open={open} lazy>
        <div className="overflow-hidden">{form}</div>
      </RollPanel>
    </li>
  );
}
