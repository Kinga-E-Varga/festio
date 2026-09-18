"use client";

import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import type { RsvpPayload, RsvpStatus } from "@/types/invitation";

export const NOTE_LIMIT = 300;
export const NAME_LIMIT = 60;

interface RsvpFieldValues {
  rows: { value: string }[];
  status: RsvpStatus | null;
  note: string;
}

/**
 * One reply, covering everyone the guest is answering for. The going choice
 * is single and submission-level; storage copies it onto each attendee, so
 * the simpler form costs the data model nothing.
 */
export function useRsvpForm() {
  const { control, setValue } = useForm<RsvpFieldValues>({
    defaultValues: { rows: [{ value: "" }], status: null, note: "" },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "rows" });
  const [sent, setSent] = useState(false);

  const rows = useWatch({ control, name: "rows" });
  const status = useWatch({ control, name: "status" });
  const note = useWatch({ control, name: "note" });

  const named = rows.map((row) => row.value.trim()).filter(Boolean);

  function setName(id: string, value: string) {
    const index = fields.findIndex((field) => field.id === id);
    if (index === -1) return;
    setValue(`rows.${index}.value`, value);
  }

  function addName() {
    append({ value: "" });
  }

  function removeName(id: string) {
    const index = fields.findIndex((field) => field.id === id);
    if (index === -1) return;
    remove(index);
  }

  /** Null until the reply is answerable, so callers cannot send a half one. */
  function buildPayload(): RsvpPayload | null {
    if (named.length === 0 || status === null) return null;
    const trimmed = note.trim();
    return {
      attendees: named.map((name) => ({ name, status })),
      answers: { q_note_host: trimmed === "" ? null : trimmed },
    };
  }

  return {
    values: {
      rows: fields.map((field, index) => ({
        id: field.id,
        value: rows[index]?.value ?? "",
      })),
      status,
      note,
    },
    set: {
      name: setName,
      addName,
      removeName,
      status: (value: RsvpStatus) => setValue("status", value),
      note: (value: string) => setValue("note", value),
    },
    derived: {
      anyNameEmpty: rows.some((row) => row.value.trim() === ""),
      noteLeft: NOTE_LIMIT - note.length,
      people: named.length,
      sent,
    },
    buildPayload,
    markSent: () => setSent(true),
  };
}

export type RsvpFormState = ReturnType<typeof useRsvpForm>;
