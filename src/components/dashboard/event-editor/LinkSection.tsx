"use client";

import { useState } from "react";
import { CopyButton } from "@/components/dashboard/CopyButton";
import { useTranslations } from "next-intl";
import { VISIBILITY } from "@/components/dashboard/EventMeta";
import { Banner } from "@/components/dashboard/event-editor/Banner";
import { ChangeWarning } from "@/components/dashboard/event-editor/ChangeWarning";
import { EditorSection } from "@/components/dashboard/event-editor/EditorSection";
import { Field } from "@/components/dashboard/event-editor/Field";
import {
  ERROR,
  FIELD_GRID,
  HINT,
  INSET_INPUT,
  LABEL,
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
    <div className="px-3.5 pb-3.5">
      {/* One field with its two actions sitting inside it, as the link box has. */}
      <div className="flex h-input items-center gap-1.5 rounded-ui border border-neutral-400 bg-neutral-50 pr-[9px] transition-colors hover:border-neutral-600 has-[:focus]:border-neutral-500">
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
        <p className={`mt-[7px] ${ERROR}`}>{form.derived.passwordError}</p>
      ) : null}
    </div>
  );
}

interface SectionProps {
  event: DashboardEvent;
  form: EventForm;
}

export function LinkSection({ event, form }: SectionProps) {
  /* The visibility options are shared with the event cards, so is their copy. */
  const tEvent = useTranslations("Event");
  const t = useTranslations("EventEditor");
  const { values, set, derived } = form;

  return (
    <EditorSection title={t("link")}>
      {/* The address and the finished link sit side by side while there is room. */}
      <div className={FIELD_GRID}>
        <Field
          htmlFor="event-slug"
          label={t("address")}
          error={derived.slugError}
          hint={t("addressHint")}
        >
          <div className="flex h-input items-stretch rounded-ui border border-neutral-400 bg-neutral-50 transition-colors hover:border-neutral-600 has-[:focus]:border-neutral-500">
            <span className="grid place-items-center bg-neutral-200 px-3 text-[13.5px] whitespace-nowrap text-neutral-800">
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
            <p className="flex flex-wrap items-center gap-1.5 text-[11.5px] text-neutral-700">
              {t("slugFree")}
              {derived.slugOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => set.slug(option)}
                  className="rounded-ui border border-primary-700 bg-secondary-100 px-2 py-0.5 font-medium text-primary-700 transition-colors hover:bg-primary-200"
                >
                  {option}
                </button>
              ))}
            </p>
          ) : null}
        </Field>

        <Field label={t("guestLink")}>
          <span className="flex h-input items-center gap-[9px] rounded-ui border border-neutral-400 bg-neutral-50 px-3 text-[13.5px] text-neutral-950">
            <Icon name="link" className="size-4 shrink-0 text-neutral-700" />
            <span className="flex-1 truncate">{derived.link}</span>
            <CopyButton
              value={`https://${derived.link}`}
              label={t("copyLink")}
            />
          </span>
        </Field>
      </div>

      <ChangeWarning
        title={t("addressWarningTitle")}
        warning={form.warnings.address}
      >
        {t.rich("addressWarning", {
          count: event.rsvp.replied,
          b: (chunks) => <b className="font-semibold">{chunks}</b>,
        })}
      </ChangeWarning>

      <p className={`mt-[22px] mb-2.5 ${LABEL}`}>{t("visibility")}</p>

      <fieldset className="grid grid-cols-1 gap-3 @min-[940px]:grid-cols-3">
        <legend className="sr-only">{t("visibilityLegend")}</legend>
        {ORDER.map((id) => {
          const option = VISIBILITY[id];
          const selected = values.visibility === id;
          return (
            <div
              key={id}
              className={`flex min-w-0 flex-col rounded-ui border transition-colors has-[[name=visibility]:focus-visible]:outline-2 has-[[name=visibility]:focus-visible]:outline-offset-2 ${
                selected
                  ? "border-neutral-500 bg-neutral-200 outline-neutral-500"
                  : "border-neutral-400 bg-neutral-50 outline-neutral-400 hover:bg-neutral-150"
              }`}
            >
              <label className="flex cursor-pointer flex-col gap-1.5 p-3.5">
                <span className="flex items-center gap-2 font-medium text-neutral-800">
                  <span
                    aria-hidden="true"
                    className={`grid size-[14px] shrink-0 place-items-center rounded-full border ${
                      selected ? "border-neutral-700" : "border-neutral-500"
                    }`}
                  >
                    {selected ? (
                      <span className="size-1.5 rounded-full bg-neutral-700" />
                    ) : null}
                  </span>
                  {tEvent(option.labelKey)}
                </span>
                <input
                  type="radio"
                  name="visibility"
                  value={id}
                  checked={selected}
                  onChange={() => set.visibility(id)}
                  className="sr-only"
                />
                <span className={HINT}>{tEvent(option.blurbKey)}</span>
              </label>

              {/* The password belongs to the card it unlocks. */}
              {id === "protected" && selected ? (
                <PasswordBox form={form} />
              ) : null}
            </div>
          );
        })}
      </fieldset>

      <ChangeWarning
        title={t("passwordWarningTitle")}
        warning={form.warnings.password}
      >
        {t("passwordWarning")}
      </ChangeWarning>

      <Banner tone="info" icon="shield" title={t("noindexTitle")}>
        {t("noindex")}
      </Banner>
    </EditorSection>
  );
}
