"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import {
  ERROR,
  GOLD_ACTION,
  HINT,
  INPUT,
  LABEL,
} from "@/components/dashboard/event-editor/styles";
import { PanelSwitch } from "@/components/invitation/PanelSwitch";
import { localized, type Language } from "@/lib/language";
import { imageSrc } from "@/modular/content";
import type { ChoiceField, ItemField, ToggleField } from "@/types/modular";
import { ColorWell } from "./ColorWell";
import { IconPicker } from "./IconPicker";

export interface FieldInputProps {
  /** The element id: what Save focuses. */
  id: string;
  field: ItemField | ToggleField | ChoiceField;
  value: string | boolean;
  /** Save was tried: an empty required field shows its error without a blur. */
  showErrors: boolean;
  onChange: (value: string | boolean) => void;
}

/**
 * One field in the Content tab, labelled in the host's language. A required
 * field left empty says so under it once the host has left it — or once
 * Save was tried — and stops as soon as it has a value.
 */
export function FieldInput({
  id,
  field,
  value,
  showErrors,
  onChange,
}: FieldInputProps) {
  const t = useTranslations("ContentTab");
  const host = useLocale() as Language;
  const [left, setLeft] = useState(false);
  const label = localized(field.label, host);

  if (field.type === "toggle") {
    return (
      <PanelSwitch
        id={id}
        label={label}
        checked={value !== false}
        onChange={onChange}
      />
    );
  }

  const full = typeof value === "string" ? value : "";
  /* `lines` reaching here edits its first line alone; the rest are kept. */
  const rest = field.type === "lines" ? full.split("\n").slice(1) : [];
  const current = field.type === "lines" ? full.split("\n")[0] : full;

  if (field.type === "choice") {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className={LABEL}>
          {label}
        </label>
        <select
          id={id}
          value={current}
          onChange={(event) => onChange(event.target.value)}
          className={INPUT}
        >
          {field.options.map((option) => (
            <option key={option.id} value={option.id}>
              {localized(option.label, host)}
            </option>
          ))}
        </select>
      </div>
    );
  }
  const required = field.required === true;
  const invalid = required && !current.trim() && (left || showErrors);
  const errorId = `${id}-error`;
  const shared = {
    id,
    value: current,
    maxLength: field.maxLength,
    "aria-required": required || undefined,
    "aria-invalid": invalid || undefined,
    "aria-describedby": invalid ? errorId : undefined,
    /* Back in the field, the host is typing again: no error until they leave. */
    onFocus: () => setLeft(false),
    onBlur: () => setLeft(true),
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} id={`${id}-label`} className={LABEL}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {field.type === "longText" ? (
        <textarea
          {...shared}
          rows={3}
          onChange={(event) => onChange(event.target.value)}
          className={`${INPUT} resize-none`}
        />
      ) : field.type === "image" ? (
        <ImageField id={id} value={current} />
      ) : field.type === "icon" ? (
        <IconPicker labelId={`${id}-label`} value={current} onPick={onChange} />
      ) : field.type === "color" ? (
        <ColorWell id={id} value={current} withHex onChange={onChange} />
      ) : (
        <input
          {...shared}
          type={
            field.type === "time" || field.type === "date" ? field.type : "text"
          }
          onChange={(event) =>
            onChange([event.target.value, ...rest].join("\n"))
          }
          className={INPUT}
        />
      )}
      {invalid ? (
        <p id={errorId} className={ERROR}>
          {t("required")}
        </p>
      ) : null}
    </div>
  );
}

/** The current photo and a Change button that does nothing yet. */
function ImageField({ id, value }: { id: string; value: string }) {
  const t = useTranslations("ContentTab");
  const src = imageSrc(value);

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-24 shrink-0 overflow-hidden border border-neutral-400 bg-neutral-300">
        {src ? (
          <Image src={src} alt="" fill sizes="96px" className="object-cover" />
        ) : null}
      </div>
      <div className="flex flex-col gap-1">
        <button
          id={id}
          type="button"
          disabled
          className={`${GOLD_ACTION} self-start`}
        >
          {t("changePhoto")}
        </button>
        <p className={HINT}>{t("photoSoon")}</p>
      </div>
    </div>
  );
}
