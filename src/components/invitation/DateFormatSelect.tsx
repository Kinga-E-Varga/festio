"use client";

import { INPUT } from "@/components/dashboard/event-editor/styles";
import { dateFormatsFor, formatInvitationDate } from "@/lib/invitation";
import type { Language } from "@/lib/language";

/**
 * How the event's date is written, picked from `DATE_FORMATS`: every option
 * is the host's real date in that style, in the invitation's language. The
 * date itself is set in the event details. Shared by the simple and modular
 * editors.
 */
export function DateFormatSelect({
  id,
  value,
  eventDate,
  language,
  onChange,
}: {
  id: string;
  value: string;
  eventDate: string;
  language: Language;
  onChange: (value: string) => void;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(control) => onChange(control.target.value)}
      className={INPUT}
    >
      {dateFormatsFor(language).map((option) => (
        <option key={option.id} value={option.id}>
          {formatInvitationDate(eventDate, option.id, language)}
        </option>
      ))}
    </select>
  );
}
