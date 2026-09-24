"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  contentFreeze,
  deletionDate,
  formatEventDate,
  formatDeadline,
  invitationLink,
  isRealDate,
  toDateTimeLocal,
} from "@/lib/event";
import { invitationLanguage, type Language } from "@/lib/language";
import {
  isReservedSlug,
  normalizeSlug,
  SLUG_MAX,
  SLUG_MIN,
  slugSuggestions,
} from "@/lib/slug";
import type {
  DashboardEvent,
  EventKind,
  Visibility,
} from "@/types/dashboard";

/**
 * A change a guest already holding the link would notice. Each one raises a
 * warning the host has to take in before the save unlocks — Festio never
 * notifies guests, so acknowledging it is the whole point.
 */
export type WarningId = "date" | "address" | "password" | "language";

export interface Warning {
  shown: boolean;
  acknowledged: boolean;
  toggle: (value: boolean) => void;
}

const PASSWORD_PATTERN = /^[A-Za-z0-9]{4,}$/;

interface EventFieldValues {
  title: string;
  kind: EventKind;
  /** The invitation's own language, never the language the host reads Festio in. */
  language: Language;
  date: string;
  closeEarly: boolean;
  closeAt: string;
  slug: string;
  visibility: Visibility;
  password: string;
  expected: string;
  preloaded: boolean;
}

/** `takenSlugs` holds every other event's slug; a link must be unique. */
export function useEventForm(
  event: DashboardEvent,
  takenSlugs: readonly string[],
) {
  const t = useTranslations("EventEditor");
  /* The host reads these dates, so they follow the host's locale. */
  const locale = useLocale();
  const original = {
    slug: event.slug,
    password: event.password ?? "",
    language: invitationLanguage(event),
  };

  const { control, setValue, getValues, reset, formState } =
    useForm<EventFieldValues>({
      defaultValues: {
        title: event.title,
        kind: event.kind,
        language: original.language,
        date: event.date,
        closeEarly: Boolean(event.repliesCloseAt),
        closeAt: event.repliesCloseAt ?? "",
        slug: event.slug,
        visibility: event.visibility,
        password: original.password,
        expected: String(event.expectedGuests),
        preloaded: event.preloaded,
      },
    });

  const title = useWatch({ control, name: "title" });
  const kind = useWatch({ control, name: "kind" });
  const language = useWatch({ control, name: "language" });
  const date = useWatch({ control, name: "date" });
  const closeEarly = useWatch({ control, name: "closeEarly" });
  const closeAt = useWatch({ control, name: "closeAt" });
  const slug = useWatch({ control, name: "slug" });
  const visibility = useWatch({ control, name: "visibility" });
  const password = useWatch({ control, name: "password" });
  const expected = useWatch({ control, name: "expected" });
  const preloaded = useWatch({ control, name: "preloaded" });

  const [justSaved, setJustSaved] = useState(false);
  const [acknowledged, setAcknowledged] = useState<Record<WarningId, boolean>>({
    date: false,
    address: false,
    password: false,
    language: false,
  });

  /** Nothing is editable once the content freeze has passed. */
  const locked = event.locked;

  function edit<K extends keyof EventFieldValues>(key: K) {
    return (value: EventFieldValues[K]) => {
      if (locked) return;
      setValue(key, value as never, { shouldDirty: true });
      setJustSaved(false);
    };
  }

  /** A warning that goes away forgets it was ever acknowledged. */
  function acknowledge(id: WarningId, value: boolean) {
    setAcknowledged((state) => ({ ...state, [id]: value }));
  }

  const cleanSlug = normalizeSlug(slug);
  // An emptied or half-typed date must not turn every derived label into
  // "Invalid Date", so the deadlines hold their last good value until the
  // field parses again.
  const effectiveDate = isRealDate(new Date(`${date}T00:00`)) ? date : event.date;
  const freeze = contentFreeze(effectiveDate);
  const deletion = deletionDate(effectiveDate);
  const chosenClose = new Date(closeAt);
  const closesEarly =
    closeEarly && isRealDate(chosenClose) && chosenClose <= freeze;

  // Only a link someone is already holding can be broken by a change.
  const shared = event.rsvp.replied > 0;

  const warnings: Record<WarningId, Warning> = {
    date: {
      shown: date !== event.date,
      acknowledged: acknowledged.date,
      toggle: (value) => acknowledge("date", value),
    },
    address: {
      shown: shared && cleanSlug !== original.slug,
      acknowledged: acknowledged.address,
      toggle: (value) => acknowledge("address", value),
    },
    password: {
      shown: shared && password !== original.password,
      acknowledged: acknowledged.password,
      toggle: (value) => acknowledge("password", value),
    },
    /*
     * A new language rewrites the reply form under guests who already have
     * the link — the same kind of change as moving the date, and warned
     * about the same way.
     */
    language: {
      shown: shared && language !== original.language,
      acknowledged: acknowledged.language,
      toggle: (value) => acknowledge("language", value),
    },
  };

  const pending = Object.values(warnings).filter(
    (warning) => warning.shown && !warning.acknowledged,
  ).length;

  const expectedValue = Number.parseInt(expected, 10) || 0;
  let expectedError: string | null = null;
  if (expectedValue < 1) {
    expectedError = t("expectedRequired");
  } else if (expectedValue < event.rsvp.replied) {
    expectedError = t("expectedTooLow", { count: event.rsvp.replied });
  }

  let slugError: string | null = null;
  if (slug.trim().length > 0 && cleanSlug.length < SLUG_MIN) {
    slugError = t("slugTooShort", { min: SLUG_MIN });
  } else if (cleanSlug.length > SLUG_MAX) {
    slugError = t("slugTooLong", { max: SLUG_MAX });
  } else if (isReservedSlug(cleanSlug)) {
    slugError = t("slugReserved");
  } else if (takenSlugs.includes(cleanSlug)) {
    slugError = t("slugTaken");
  }
  const slugOptions =
    slugError && cleanSlug.length >= SLUG_MIN
      ? slugSuggestions(cleanSlug, effectiveDate.slice(0, 4), takenSlugs)
      : [];

  const passwordError =
    password.length > 0 && !PASSWORD_PATTERN.test(password)
      ? t("passwordInvalid")
      : null;

  function save() {
    if (!formState.isDirty || pending > 0 || locked) return;
    reset(getValues());
    setJustSaved(true);
    setAcknowledged({
      date: false,
      address: false,
      password: false,
      language: false,
    });
  }

  return {
    locked,
    values: {
      title,
      kind,
      language,
      date,
      closeEarly,
      closeAt,
      slug,
      visibility,
      password,
      expected,
      preloaded,
    },
    set: {
      title: edit("title"),
      kind: edit("kind"),
      language: (value: Language) => {
        edit("language")(value);
        if (value === original.language) acknowledge("language", false);
      },
      date: (value: string) => {
        edit("date")(value);
        if (value === event.date) acknowledge("date", false);
      },
      closeEarly: (value: boolean) => {
        edit("closeEarly")(value);
        // Switching on starts from the cut-off, which is the latest it can be.
        if (value && !closeAt) edit("closeAt")(toDateTimeLocal(freeze));
      },
      closeAt: edit("closeAt"),
      slug: (value: string) => {
        edit("slug")(value);
        if (normalizeSlug(value) === original.slug) acknowledge("address", false);
      },
      visibility: edit("visibility"),
      password: (value: string) => {
        edit("password")(value);
        if (value === original.password) acknowledge("password", false);
      },
      expected: edit("expected"),
      preloaded: edit("preloaded"),
    },
    warnings,
    derived: {
      link: invitationLink({ slug: cleanSlug }),
      dateLabel: formatEventDate(new Date(`${effectiveDate}T00:00`), locale),
      /** The `max` a custom closing time cannot go past. */
      closeLimit: toDateTimeLocal(freeze),
      closeDefaultLabel: formatDeadline(freeze, locale),
      closeLabel: closesEarly
        ? formatDeadline(chosenClose, locale)
        : formatDeadline(freeze, locale),
      closesEarly,
      /** Set while a chosen time sits past the cut-off, which cannot apply. */
      closeTooLate:
        closeEarly && isRealDate(chosenClose) && chosenClose > freeze,
      freezeLabel: formatDeadline(freeze, locale),
      deletionLabel: formatEventDate(deletion, locale),
      expectedValue,
      expectedError,
      slugError,
      /** Free slugs to offer while the typed one is taken or reserved. */
      slugOptions,
      passwordError,
    },
    save: {
      dirty: formState.isDirty,
      pending,
      justSaved,
      canSave: formState.isDirty && pending === 0 && !locked,
      submit: save,
    },
  };
}

export type EventForm = ReturnType<typeof useEventForm>;
