"use client";

import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { pickDiet } from "@/components/dashboard/guest-list/labels";
import type { AgeGroup, DietNeed, DietPick } from "@/types/guests";
import type { RsvpAttendee, RsvpPayload, RsvpStatus } from "@/types/invitation";

export const NOTE_LIMIT = 300;
export const NAME_LIMIT = 60;

interface RsvpRow {
  value: string;
  /** Empty = not answered yet. Asked only when the reply is Coming. */
  ageGroup: AgeGroup | "";
  diet: DietPick[];
  dietOther: string;
}

interface RsvpFieldValues {
  rows: RsvpRow[];
  status: RsvpStatus | null;
  note: string;
}

/** What stops the reply from being sent, first one only, in the order the form reads. */
export type RsvpProblem = "status" | "name" | "age" | "diet" | "dietOther";

const EMPTY_ROW: RsvpRow = {
  value: "",
  ageGroup: "",
  diet: [],
  dietOther: "",
};

/** The first thing still missing, in the order the form reads; null once the reply can go. */
function firstProblem(
  rows: RsvpRow[],
  status: RsvpStatus | null,
): RsvpProblem | null {
  if (status === null) return "status";
  if (rows.some((row) => row.value.trim() === "")) return "name";
  if (status !== "going") return null;
  if (rows.some((row) => row.ageGroup === "")) return "age";
  if (rows.some((row) => row.diet.length === 0)) return "diet";
  /* Other alone tells the host nothing, so its words are asked for. */
  if (
    rows.some(
      (row) => row.diet.includes("other") && row.dietOther.trim() === "",
    )
  )
    return "dietOther";
  return null;
}

/** One person's answers as sent: age and diet only for someone coming. */
function attendee(row: RsvpRow, status: RsvpStatus): RsvpAttendee {
  const name = row.value.trim();
  if (status !== "going" || row.ageGroup === "") return { name, status };
  const needs = row.diet.filter((pick): pick is DietNeed => pick !== "none");
  const other = row.dietOther.trim();
  return {
    name,
    status,
    ageGroup: row.ageGroup,
    diet: needs,
    ...(needs.includes("other") && other !== "" ? { dietOther: other } : {}),
  };
}

/**
 * One reply, covering everyone the guest is answering for. The going choice
 * is single and submission-level; storage copies it onto each attendee, so
 * the simpler form costs the data model nothing.
 */
export function useRsvpForm() {
  const { control, setValue, getValues } = useForm<RsvpFieldValues>({
    defaultValues: { rows: [EMPTY_ROW], status: null, note: "" },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "rows" });
  const [sent, setSent] = useState(false);

  const rows = useWatch({ control, name: "rows" });
  const status = useWatch({ control, name: "status" });
  const note = useWatch({ control, name: "note" });

  const going = status === "going";
  const problem = firstProblem(rows, status);

  function indexOf(id: string) {
    return fields.findIndex((field) => field.id === id);
  }

  function setName(id: string, value: string) {
    const index = indexOf(id);
    if (index === -1) return;
    setValue(`rows.${index}.value`, value);
  }

  function setAge(id: string, value: AgeGroup) {
    const index = indexOf(id);
    if (index === -1) return;
    setValue(`rows.${index}.ageGroup`, value);
  }

  function setDiet(id: string, pick: DietPick) {
    const index = indexOf(id);
    if (index === -1) return;
    setValue(
      `rows.${index}.diet`,
      pickDiet(getValues(`rows.${index}.diet`), pick),
    );
  }

  function setDietOther(id: string, value: string) {
    const index = indexOf(id);
    if (index === -1) return;
    setValue(`rows.${index}.dietOther`, value);
  }

  function addName() {
    append(EMPTY_ROW);
  }

  function removeName(id: string) {
    const index = indexOf(id);
    if (index === -1) return;
    remove(index);
  }

  /** Null until the reply is answerable, so callers cannot send a half one. */
  function buildPayload(): RsvpPayload | null {
    if (problem !== null || status === null) return null;
    const trimmed = note.trim();
    return {
      attendees: rows.map((row) => attendee(row, status)),
      answers: { q_note_host: trimmed === "" ? null : trimmed },
    };
  }

  return {
    values: {
      rows: fields.map((field, index) => ({
        id: field.id,
        value: rows[index]?.value ?? "",
        ageGroup: rows[index]?.ageGroup ?? "",
        diet: rows[index]?.diet ?? [],
        dietOther: rows[index]?.dietOther ?? "",
      })),
      status,
      note,
    },
    set: {
      name: setName,
      age: setAge,
      diet: setDiet,
      dietOther: setDietOther,
      addName,
      removeName,
      status: (value: RsvpStatus) => setValue("status", value),
      note: (value: string) => setValue("note", value),
    },
    derived: {
      going,
      problem,
      sent,
    },
    buildPayload,
    markSent: () => setSent(true),
  };
}

export type RsvpFormState = ReturnType<typeof useRsvpForm>;
