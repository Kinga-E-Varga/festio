"use client";

import { useState } from "react";
import { CopyButton } from "@/components/dashboard/CopyButton";
import { useTranslations } from "next-intl";
import { Choice } from "@/components/dashboard/event-editor/Choice";
import { ChangeWarning } from "@/components/dashboard/event-editor/ChangeWarning";
import {
  EditRow,
  ReadRow,
  ReadRows,
  SettingsCard,
  type CardEditing,
} from "@/components/dashboard/event-editor/SettingsCard";
import {
  ERROR,
  INSET_INPUT,
  MINI,
} from "@/components/dashboard/event-editor/styles";
import type { EventForm } from "@/components/dashboard/event-editor/useEventForm";
import { Icon } from "@/components/icons";
import type { DashboardEvent, Visibility } from "@/types/dashboard";

const ORDER: Visibility[] = ["hidden", "public", "protected"];

function PasswordBox({ form }: { form: EventForm }) {
  const t = useTranslations("EventEditor");
  const [revealed, setRevealed] = useState(false);

  return (
    <>
      {/* One field with its two actions sitting inside it, as the link box has. */}
      <div className="flex h-input w-full items-center gap-1.5 rounded-ui border border-neutral-400 bg-neutral-50 pr-[9px] @min-[420px]:max-w-[280px] transition-colors hover:border-neutral-600 has-[:focus]:border-neutral-500">
        <input
          type={revealed ? "text" : "password"}
          maxLength={24}
          placeholder={t("password")}
          aria-label={t("passwordAria")}
          value={form.values.password}
          onChange={(control) => form.set.password(control.target.value)}
          className={INSET_INPUT}
        />
        <button
          type="button"
          onClick={() => setRevealed((shown) => !shown)}
          aria-label={revealed ? t("hidePassword") : t("showPassword")}
          className={MINI}
        >
          <Icon name={revealed ? "eyeOff" : "eye"} className="size-4" />
        </button>
        <CopyButton value={form.values.password} label={t("copyPassword")} />
      </div>
      {form.derived.passwordError ? (
        <p className={ERROR}>{form.derived.passwordError}</p>
      ) : null}
      <p className="hint-text">{t("passwordHint")}</p>
    </>
  );
}

/**
 * Search engines never list an invitation, whichever visibility the host
 * picks: said under the visibility, read and open alike, set as the
 * choices' words in the info blue.
 */
function NoindexNote() {
  const t = useTranslations("EventEditor");

  return (
    <span className="mt-2 flex w-full items-start gap-2 rounded-ui bg-info-100 px-2.5 py-1.5 meta-face leading-[1.5] font-medium text-info-700">
      <Icon name="shield" strokeWidth={2} className="size-[18px] shrink-0" />
      {t("noindex")}
    </span>
  );
}

interface SectionProps {
  event: DashboardEvent;
  form: EventForm;
  editing: CardEditing;
}

export function LinkSection({ event, form, editing }: SectionProps) {
  /* The visibility options are shared with the event cards, so is their copy. */
  const tEvent = useTranslations("Event");
  const t = useTranslations("EventEditor");
  const { values, set, derived } = form;

  return (
    <SettingsCard title={t("link")} editing={editing}>
      {editing.open ? (
        <div>
          {/* The address, the link it makes, and the warning when it changes. */}
          <EditRow
            htmlFor="event-slug"
            label={t("address")}
            error={derived.slugError}

            warning={
              <ChangeWarning
                title={t("addressWarningTitle")}
                warning={form.warnings.address}
              >
                {t.rich("addressWarning", {
                  count: event.rsvp.replied,
                  b: (chunks) => <b className="font-semibold">{chunks}</b>,
                })}
              </ChangeWarning>
            }
          >
            <div className="flex h-input items-stretch rounded-ui border border-neutral-400 bg-neutral-50 transition-colors hover:border-neutral-600 has-[:focus]:border-neutral-500">
              <span className="grid place-items-center bg-neutral-200 px-3 row-text whitespace-nowrap">
                festio.eu/
              </span>
              <input
                id="event-slug"
                type="text"
                maxLength={32}
                value={values.slug}
                onChange={(control) => set.slug(control.target.value)}
                className={INSET_INPUT}
              />
            </div>
            {derived.slugOptions.length > 0 ? (
              <p className="flex flex-wrap items-center gap-1.5 hint-text">
                {t("slugFree")}
                {derived.slugOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => set.slug(option)}
                    className="rounded-ui border border-accent-700 bg-secondary-100 px-2 py-0.5 font-medium text-accent-700 transition-colors hover:bg-accent-200"
                  >
                    {option}
                  </button>
                ))}
              </p>
            ) : null}
            <span className="flex h-input items-center gap-[9px] rounded-ui border border-neutral-400 bg-neutral-50 px-3 field-text">
              <Icon name="link" className="size-4 shrink-0 text-neutral-700" />
              <span className="flex-1 truncate">{derived.link}</span>
              <CopyButton
                value={`https://${derived.link}`}
                label={t("copyLink")}
              />
            </span>
            <p className="hint-text">{t("addressHint")}</p>
          </EditRow>

          <EditRow label={t("visibilityLegend")}>
            <div
              role="radiogroup"
              aria-label={t("visibilityLegend")}
              className="flex flex-col gap-1"
            >
              {ORDER.map((id) => (
                <Choice
                  key={id}
                  name="visibility"
                  checked={values.visibility === id}
                  onPick={() => set.visibility(id)}
                  note={tEvent(`${id}Note`)}
                >
                  {tEvent(id)}
                </Choice>
              ))}
            </div>
            <NoindexNote />
          </EditRow>

          {/* The password the Protected choice asks for, under the choices. */}
          {values.visibility === "protected" ? (
            <EditRow
              label={t("password")}
              warning={
                <ChangeWarning
                  title={t("passwordWarningTitle")}
                  warning={form.warnings.password}
                >
                  {t("passwordWarning")}
                </ChangeWarning>
              }
            >
              <PasswordBox form={form} />
            </EditRow>
          ) : null}
        </div>
      ) : (
        <ReadRows>
          <ReadRow label={t("address")}>{derived.link}</ReadRow>
          <ReadRow
            label={t("visibilityLegend")}
            note={
              <>
                {tEvent(`${values.visibility}Note`)}
                <NoindexNote />
              </>
            }
          >
            {tEvent(values.visibility)}
          </ReadRow>
          {values.visibility === "protected" ? (
            <ReadRow label={t("password")} note={t("passwordHint")}>
              {/* Kept out of sight while read, as in the field. */}
              {"•".repeat(Math.max(values.password.length, 4))}
            </ReadRow>
          ) : null}
        </ReadRows>
      )}
    </SettingsCard>
  );
}
