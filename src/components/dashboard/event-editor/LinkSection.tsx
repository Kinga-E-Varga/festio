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
      <div className="flex min-h-[38px] items-center gap-1.5 border border-mustard-400 bg-neutral-50 pr-[9px] transition-colors hover:border-mustard-500 has-[:focus]:border-mustard-500">
        <input
          type={revealed ? "text" : "password"}
          maxLength={24}
          placeholder={t("password")}
          aria-label={t("passwordAria")}
          disabled={form.locked}
          value={form.values.password}
          onChange={(control) => form.set.password(control.target.value)}
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-[9px] text-[13.5px] text-neutral-900 focus:outline-2 focus:-outline-offset-2 focus:outline-mustard-500 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={() => setRevealed((shown) => !shown)}
          aria-label={revealed ? t("hidePassword") : t("showPassword")}
          className={MINI}
        >
          <Icon name={revealed ? "eyeOff" : "eye"} className="size-[15px]" />
        </button>
        <CopyButton
          value={form.values.password}
          label={t("copyPassword")}
        />
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
  const { values, set, derived, locked } = form;

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
          <div className="flex items-stretch border border-mustard-300 bg-neutral-50 transition-colors hover:border-mustard-500 has-[:focus]:border-mustard-500">
            <span className="grid place-items-center bg-mustard-200 px-3 text-[13.5px] whitespace-nowrap text-neutral-800">
              festio.eu/
            </span>
            <input
              id="event-slug"
              type="text"
              maxLength={32}
              disabled={locked}
              value={values.slug}
              onChange={(control) => set.slug(control.target.value)}
              className="min-w-0 flex-1 border-0 bg-transparent px-3 py-[9px] text-[13.5px] text-neutral-900 focus:outline-2 focus:-outline-offset-2 focus:outline-mustard-500 disabled:cursor-not-allowed"
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
                  className="rounded-sm border border-forest-500 bg-mustard-50 px-2 py-0.5 font-medium text-forest-500 transition-colors hover:bg-forest-200"
                >
                  {option}
                </button>
              ))}
            </p>
          ) : null}
        </Field>

        <Field label={t("guestLink")}>
          <span className="flex min-h-[38px] items-center gap-[9px] border border-mustard-300 bg-neutral-50 px-3 py-[9px] text-[13.5px] text-neutral-900">
            <Icon name="link" className="size-3.5 shrink-0 text-forest-500" />
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
          b: (chunks) => <b>{chunks}</b>,
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
              className={`flex min-w-0 flex-col border transition-colors has-[[name=visibility]:focus-visible]:outline-2 has-[[name=visibility]:focus-visible]:outline-offset-2 ${
                selected
                  ? "border-mustard-500 bg-mustard-200 outline-mustard-500"
                  : "border-mustard-300 bg-neutral-50 outline-mustard-300 hover:bg-mustard-100"
              }`}
            >
              <label className="flex cursor-pointer flex-col gap-1.5 p-3.5">
                <span className="flex items-center gap-2 font-semibold text-neutral-900">
                  <span
                    aria-hidden="true"
                    className={`grid size-[14px] shrink-0 place-items-center rounded-full border ${
                      selected ? "border-mustard-500" : "border-neutral-500"
                    }`}
                  >
                    {selected ? (
                      <span className="size-1.5 rounded-full bg-mustard-500" />
                    ) : null}
                  </span>
                  {tEvent(option.labelKey)}
                </span>
                <input
                  type="radio"
                  name="visibility"
                  value={id}
                  checked={selected}
                  disabled={locked}
                  onChange={() => set.visibility(id)}
                  className="sr-only"
                />
                <span className="text-xs leading-[1.45] text-neutral-700">
                  {tEvent(option.blurbKey)}
                </span>
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
