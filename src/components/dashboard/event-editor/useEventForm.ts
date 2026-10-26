"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { saveEventSettings } from "@/actions/event";
import { checkSlug } from "@/actions/slug";
import {
  dateLocked,
  defaultReplyClose,
  formatDeadline,
  invitationLink,
  isRealDate,
  toDateTimeLocal,
} from "@/lib/event";
import { PASSWORD_PATTERN, TITLE_MIN } from "@/db/limits";
import { orFailed } from "@/lib/action";
import type { Language } from "@/lib/language";
import {
  isReservedSlug,
  isValidSlug,
  normalizeSlug,
  SLUG_MAX,
  SLUG_MIN,
  slugSuggestions,
} from "@/lib/slug";
import type { DashboardEvent, EventKind, Visibility } from "@/types/dashboard";

/**
 * A change a guest already holding the link would notice. Each one raises a
 * warning the host has to take in before the save unlocks — Festio never
 * notifies guests, so acknowledging it is the whole point.
 */
export type WarningId =
  "date" | "address" | "password" | "language" | "visibility" | "close";

export interface Warning {
  shown: boolean;
  acknowledged: boolean;
  toggle: (value: boolean) => void;
}

const NONE_ACKNOWLEDGED: Record<WarningId, boolean> = {
  date: false,
  address: false,
  password: false,
  language: false,
  visibility: false,
  close: false,
};

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

/** The server's answer for one typed link. */
interface SlugAnswer {
  slug: string;
  free: boolean;
  suggestions: string[];
}

/** How long typing has to pause before a link is checked with the server. */
const SLUG_CHECK_DELAY = 300;

export function useEventForm(event: DashboardEvent) {
  const t = useTranslations("EventEditor");
  /* The host reads these dates, so they follow the host's locale. */
  const locale = useLocale();
  const original = {
    slug: event.slug,
    password: event.password ?? "",
    language: event.language,
    closeAt: event.repliesCloseAt ?? "",
  };

  const { control, setValue, getValues, reset, formState } =
    useForm<EventFieldValues>({
      defaultValues: {
        title: event.title,
        kind: event.kind,
        language: original.language,
        date: event.date,
        closeEarly: Boolean(event.repliesCloseAt),
        closeAt: original.closeAt,
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

  const [acknowledged, setAcknowledged] =
    useState<Record<WarningId, boolean>>(NONE_ACKNOWLEDGED);
  /* The card's version this form last read or saved; the server checks it. */
  const [version, setVersion] = useState(event.version);
  const [saving, setSaving] = useState(false);
  /* The last link the server checked; links are unique across Festio, so only it knows. */
  const [slugAnswer, setSlugAnswer] = useState<SlugAnswer | null>(null);

  /** From the event day on, the date stays put; the rest stays editable. */
  const lockDate = dateLocked(event);

  function edit<K extends keyof EventFieldValues>(key: K) {
    return (value: EventFieldValues[K]) => {
      setValue(key, value as never, { shouldDirty: true });
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
  const effectiveDate = isRealDate(new Date(`${date}T00:00`))
    ? date
    : event.date;
  const cutoff = defaultReplyClose(effectiveDate);
  const cutoffLabel = formatDeadline(cutoff, locale);
  const chosenClose = new Date(closeAt);
  const chosenReal = closeEarly && isRealDate(chosenClose);
  /* When replies close now, as saved: its own time, or the cut-off. */
  const savedClose = event.repliesCloseAt
    ? new Date(event.repliesCloseAt)
    : defaultReplyClose(event.date);
  /* When the page opened: a closing time before it has already passed. */
  const [openedAt] = useState(() => Date.now());

  // A link may be out once guests can open it, or once anyone has replied.
  const shared = event.visibility !== "hidden" || event.rsvp.replied > 0;

  function warning(id: WarningId, shown: boolean): Warning {
    return {
      shown,
      acknowledged: acknowledged[id],
      toggle: (value) => acknowledge(id, value),
    };
  }

  const warnings: Record<WarningId, Warning> = {
    date: warning("date", date !== event.date),
    address: warning("address", shared && cleanSlug !== original.slug),
    /* A new password only breaks one guests already use; a first one comes with the visibility's warning. */
    password: warning(
      "password",
      event.visibility === "protected" && password !== original.password,
    ),
    /*
     * A new language rewrites the reply form under guests who already have
     * the link — the same kind of change as moving the date, and warned
     * about the same way.
     */
    language: warning("language", shared && language !== original.language),
    /* Hidden or Protected shuts out guests who could open the link until now. */
    visibility: warning(
      "visibility",
      event.visibility !== "hidden" &&
        visibility !== event.visibility &&
        visibility !== "public",
    ),
    /* Only an earlier close takes time away from guests; a later one gives it back. */
    close: warning("close", shared && chosenReal && chosenClose < savedClose),
  };

  const pending = Object.values(warnings).filter(
    (warning) => warning.shown && !warning.acknowledged,
  ).length;

  const titleLength = title.trim().length;
  let titleError: string | null = null;
  if (titleLength === 0) {
    titleError = t("titleRequired");
  } else if (titleLength < TITLE_MIN) {
    titleError = t("titleTooShort", { min: TITLE_MIN });
  }

  const expectedValue = Number.parseInt(expected, 10) || 0;
  let expectedError: string | null = null;
  if (expectedValue < 1) {
    expectedError = t("expectedRequired");
  } else if (
    /* Raised or left alone is fine, even under the replies; lowered below them isn't. */
    expectedValue < event.expectedGuests &&
    expectedValue < event.rsvp.replied
  ) {
    expectedError = t("expectedTooLow", { count: event.rsvp.replied });
  }

  /* Only a new, well-formed link is worth asking about. */
  const checkLink = cleanSlug !== original.slug && isValidSlug(cleanSlug);

  useEffect(() => {
    if (!checkLink) return;
    /* An answer that comes back after the host typed on is dropped. */
    let current = true;
    const timer = setTimeout(async () => {
      try {
        const result = await checkSlug(event.id, cleanSlug);
        if (current && result.success) {
          setSlugAnswer({ slug: cleanSlug, ...result.data });
        }
      } catch {
        /* Offline: no hint, the save still checks. */
      }
    }, SLUG_CHECK_DELAY);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [checkLink, cleanSlug, event.id]);

  const taken =
    checkLink && slugAnswer?.slug === cleanSlug && !slugAnswer.free
      ? slugAnswer
      : null;

  let slugError: string | null = null;
  if (slug.trim().length > 0 && cleanSlug.length < SLUG_MIN) {
    slugError = t("slugTooShort", { min: SLUG_MIN });
  } else if (cleanSlug.length > SLUG_MAX) {
    slugError = t("slugTooLong", { max: SLUG_MAX });
  } else if (cleanSlug !== original.slug && isReservedSlug(cleanSlug)) {
    /* A name reserved later never stops an event that already has it. */
    slugError = t("slugReserved");
  } else if (taken) {
    slugError = t("slugTaken");
  }
  let slugOptions: string[] = [];
  if (taken) {
    slugOptions = taken.suggestions;
  } else if (slugError && cleanSlug.length >= SLUG_MIN) {
    /* A reserved name: these are unchecked, so the save may still find one taken. */
    slugOptions = slugSuggestions(cleanSlug, effectiveDate.slice(0, 4));
  }

  const passwordError =
    password.length > 0 && !PASSWORD_PATTERN.test(password)
      ? t("passwordInvalid")
      : null;

  /* A closing time already past would close the form the moment it saves. */
  const closeInPast =
    chosenReal &&
    chosenClose.getTime() < openedAt &&
    closeAt !== original.closeAt;

  /* Every card needs a name, so a missing or short one keeps Save shut; so does a close already past. */
  const canSave =
    formState.isDirty &&
    pending === 0 &&
    !titleError &&
    !closeInPast &&
    !saving;

  /** Sends the form to the server; saved, its values become the new starting point. */
  async function save() {
    const values = getValues();
    setSaving(true);
    const result = await orFailed(
      saveEventSettings(event.id, {
        title: values.title,
        kind: values.kind,
        language: values.language,
        date: values.date,
        repliesCloseAt: (values.closeEarly && values.closeAt) || undefined,
        slug: normalizeSlug(values.slug),
        visibility: values.visibility,
        password: values.password || undefined,
        expectedGuests: Number.parseInt(values.expected, 10),
        preloaded: values.preloaded,
        version,
      }),
    );
    setSaving(false);
    if (result.success) {
      reset(values);
      setVersion(result.data.version);
      setAcknowledged(NONE_ACKNOWLEDGED);
    }
    return result;
  }

  /** Back to the last saved values, every warning forgotten. */
  function cancel() {
    reset();
    setAcknowledged(NONE_ACKNOWLEDGED);
  }

  return {
    dateLocked: lockDate,
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
        if (lockDate) return;
        edit("date")(value);
        if (value === event.date) acknowledge("date", false);
      },
      closeEarly: (value: boolean) => {
        edit("closeEarly")(value);
        if (!value) acknowledge("close", false);
        // Switching on starts from the cut-off, which is the latest it can be.
        if (value && !closeAt) edit("closeAt")(toDateTimeLocal(cutoff));
      },
      closeAt: (value: string) => {
        edit("closeAt")(value);
        if (value === original.closeAt) acknowledge("close", false);
      },
      slug: (value: string) => {
        edit("slug")(value);
        if (normalizeSlug(value) === original.slug)
          acknowledge("address", false);
      },
      visibility: (value: Visibility) => {
        edit("visibility")(value);
        /* Hidden and Protected each warn of their own thing: a new pick asks again. */
        acknowledge("visibility", false);
      },
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
      /** The `max` a custom closing time cannot go past. */
      closeLimit: toDateTimeLocal(cutoff),
      closeDefaultLabel: cutoffLabel,
      /** Set while a chosen time sits past the cut-off, which cannot apply. */
      closeTooLate: chosenReal && chosenClose > cutoff,
      /** Set while a newly chosen time has already passed. */
      closeInPast,
      titleError,
      expectedValue,
      expectedError,
      slugError,
      /** Free slugs to offer while the typed one is taken or reserved. */
      slugOptions,
      passwordError,
    },
    save: {
      dirty: formState.isDirty,
      canSave,
      submit: save,
      cancel,
    },
  };
}

export type EventForm = ReturnType<typeof useEventForm>;
