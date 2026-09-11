"use client";

import { useState } from "react";
import {
  contentFreeze,
  deletionDate,
  formatEventDate,
  formatStamp,
  invitationLink,
  isRealDate,
  normalizeSlug,
  toDateTimeLocal,
} from "@/lib/event";
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
export type WarningId = "date" | "address" | "password";

export interface Warning {
  shown: boolean;
  acknowledged: boolean;
  toggle: (value: boolean) => void;
}

const SLUG_MIN = 6;
const SLUG_MAX = 32;
const PASSWORD_PATTERN = /^[A-Za-z0-9]{4,}$/;

export function useEventForm(event: DashboardEvent) {
  const original = {
    slug: event.slug,
    password: event.password ?? "",
  };

  const [title, setTitle] = useState(event.title);
  const [kind, setKind] = useState<EventKind>(event.kind);
  const [date, setDate] = useState(event.date);
  const [closeEarly, setCloseEarly] = useState(false);
  const [closeAt, setCloseAt] = useState("");
  const [slug, setSlug] = useState(event.slug);
  const [visibility, setVisibility] = useState<Visibility>(event.visibility);
  const [password, setPassword] = useState(original.password);
  const [cap, setCap] = useState(String(event.safeguard.cap));
  const [preloaded, setPreloaded] = useState(event.preloaded);

  const [dirty, setDirty] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [acknowledged, setAcknowledged] = useState<Record<WarningId, boolean>>({
    date: false,
    address: false,
    password: false,
  });

  /** Nothing is editable once the content freeze has passed. */
  const locked = event.locked;

  function edit<T>(apply: (value: T) => void) {
    return (value: T) => {
      if (locked) return;
      apply(value);
      setDirty(true);
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
  };

  const pending = Object.values(warnings).filter(
    (warning) => warning.shown && !warning.acknowledged,
  ).length;

  const capValue = Number.parseInt(cap, 10) || 0;
  const capError =
    capValue < event.rsvp.replied
      ? `You already have ${event.rsvp.replied} replies. The maximum cannot sit below the replies you have received — nobody is removed by lowering it.`
      : null;

  let slugError: string | null = null;
  if (slug.trim().length > 0 && cleanSlug.length < SLUG_MIN) {
    slugError = `Use at least ${SLUG_MIN} characters — letters, digits and hyphens.`;
  } else if (cleanSlug.length > SLUG_MAX) {
    slugError = `Use ${SLUG_MAX} characters at most.`;
  }

  const passwordError =
    password.length > 0 && !PASSWORD_PATTERN.test(password)
      ? "Use at least 4 letters or digits."
      : null;

  function save() {
    if (!dirty || pending > 0 || locked) return;
    setDirty(false);
    setJustSaved(true);
    setAcknowledged({ date: false, address: false, password: false });
  }

  return {
    locked,
    values: {
      title,
      kind,
      date,
      closeEarly,
      closeAt,
      slug,
      visibility,
      password,
      cap,
      preloaded,
    },
    set: {
      title: edit(setTitle),
      kind: edit(setKind),
      date: edit((value: string) => {
        setDate(value);
        if (value === event.date) acknowledge("date", false);
      }),
      closeEarly: edit((value: boolean) => {
        setCloseEarly(value);
        // Switching on starts from the cut-off, which is the latest it can be.
        if (value && !closeAt) setCloseAt(toDateTimeLocal(freeze));
      }),
      closeAt: edit(setCloseAt),
      slug: edit((value: string) => {
        setSlug(value);
        if (normalizeSlug(value) === original.slug) acknowledge("address", false);
      }),
      visibility: edit(setVisibility),
      password: edit((value: string) => {
        setPassword(value);
        if (value === original.password) acknowledge("password", false);
      }),
      cap: edit(setCap),
      preloaded: edit(setPreloaded),
    },
    warnings,
    derived: {
      link: invitationLink({ slug: cleanSlug, digits: event.digits }),
      dateLabel: formatEventDate(new Date(`${effectiveDate}T00:00`)),
      /** The `max` a custom closing time cannot go past. */
      closeLimit: toDateTimeLocal(freeze),
      closeDefaultLabel: formatStamp(freeze),
      closeLabel: closesEarly ? formatStamp(chosenClose) : formatStamp(freeze),
      closesEarly,
      /** Set while a chosen time sits past the cut-off, which cannot apply. */
      closeTooLate:
        closeEarly && isRealDate(chosenClose) && chosenClose > freeze,
      freezeLabel: formatStamp(freeze),
      deletionLabel: formatEventDate(deletion),
      capValue,
      capPercent:
        capValue > 0
          ? Math.min(100, Math.round((event.rsvp.replied / capValue) * 100))
          : 100,
      capError,
      slugError,
      passwordError,
    },
    save: {
      dirty,
      pending,
      justSaved,
      canSave: dirty && pending === 0 && !locked,
      submit: save,
    },
  };
}

export type EventForm = ReturnType<typeof useEventForm>;
