'use client'

import { useLocale, useTranslations } from 'next-intl'
import type {
  InvitationTemplate,
  TemplateField,
  TemplateValues,
} from '@/types/invitation'
import {
  dateFormatsFor,
  DEFAULT_DATE_FORMAT,
  EVENT_DATE,
  formatInvitationDate,
} from '@/lib/invitation'
import { localized, type Language } from '@/lib/language'
import { PanelViewButton, SidePanel } from './SidePanel'
import { HINT, INPUT, LABEL, SELECT, TEXTAREA, TITLE } from './styles'

/**
 * The two halves of the editor, in the order the host meets them: the card
 * first, then the reply panel beside it. A template that declares nothing for
 * a scope simply doesn't get that group.
 */
const GROUPS = [
  { scope: 'card', titleKey: 'groupCard' },
  { scope: 'rsvp', titleKey: 'groupRsvp' },
] as const

interface EditPanelProps {
  template: InvitationTemplate
  values: TemplateValues
  /** The invitation's language — the date options are previewed in it. */
  language: Language
  /** Always mounted; this slides it in over the RSVP panel instead of replacing it. */
  open: boolean
  onChange: (id: string, value: string) => void
  onClose: () => void
}

/**
 * The host's text editor, generated from `template.fields` alone — a
 * different template yields a different form with no change here.
 *
 * Its own copy and the field labels are host chrome, so they read the host's
 * locale; only the previewed dates are in the invitation's `language`.
 *
 * Always mounted and stacked on top of the RSVP panel, which it slides over
 * on a transform rather than replacing, so neither panel ever has to react
 * to the other's presence. `.edit` in `globals.css` decides where it lies at
 * each width; one tree, not one per breakpoint, or every `field-*` id would
 * exist twice and the labels would point at the copy that isn't on screen.
 */
export function EditPanel({
  template,
  values,
  language,
  open,
  onChange,
  onClose,
}: EditPanelProps) {
  const t = useTranslations('HostEditor')
  const groups = GROUPS.map((group) => ({
    ...group,
    fields: template.fields.filter(
      (field) => (field.scope ?? 'card') === group.scope,
    ),
  })).filter((group) => group.fields.length > 0)

  const body = (
    /*
     * `w-full` is what makes it fill: the auto margins that centre it also
     * turn off the column's stretch, so without it the form would only be as
     * wide as its widest label.
     */
    <div className="flex flex-col w-full max-w-[500px] m-auto">
      {groups.map((group) => (
        // The last group butts up against View — its own fields already
        // carry the gap, so it drops the one below it.
        <section
          key={group.scope}
          className="flex flex-col mb-6 last-of-type:mb-0"
        >
          <p className={TITLE}>{t(group.titleKey)}</p>

          {group.fields.map((field) => (
            <Field
              key={field.id}
              field={field}
              value={values[field.id] ?? ''}
              eventDate={values[EVENT_DATE] ?? ''}
              language={language}
              onChange={onChange}
            />
          ))}
        </section>
      ))}

      <PanelViewButton onClose={onClose} />
    </div>
  )

  return (
    <SidePanel
      panelClassName="edit"
      open={open}
      inert={!open}
      onClose={onClose}
    >
      {body}
    </SidePanel>
  )
}

/** One slot from `template.fields`, with the control its type asks for. */
function Field({
  field,
  value,
  eventDate,
  language,
  onChange,
}: {
  field: TemplateField
  value: string
  /** The event's own date — what a `dateFormat` choice is previewed against. */
  eventDate: string
  /** The language the previewed dates are written in. */
  language: Language
  onChange: (id: string, value: string) => void
}) {
  const t = useTranslations('HostEditor')
  const hostLocale = useLocale()

  return (
    <div className="flex flex-col mb-6">
      <label htmlFor={`field-${field.id}`} className={LABEL}>
        {localized(field.label, hostLocale)}
      </label>
      {field.type === 'dateFormat' ? (
        <>
          {/*
           * The date itself is set in the event details and is not editable
           * here — changing it changes the event, not one invitation's text.
           * All this picks is how it is written on the card, so every option
           * is the host's real date in that format.
           */}
          <select
            id={`field-${field.id}`}
            value={value || DEFAULT_DATE_FORMAT}
            onChange={(control) => onChange(field.id, control.target.value)}
            className={SELECT}
          >
            {dateFormatsFor(language).map((option) => (
              <option key={option.id} value={option.id}>
                {formatInvitationDate(eventDate, option.id, language)}
              </option>
            ))}
          </select>
          <p className={`${HINT} mt-1`}>{t('dateHint')}</p>
        </>
      ) : field.type === 'longText' ? (
        <textarea
          id={`field-${field.id}`}
          rows={3}
          value={value}
          maxLength={field.maxLength}
          onChange={(control) => onChange(field.id, control.target.value)}
          className={`${TEXTAREA} mt-2`}
        />
      ) : (
        <input
          id={`field-${field.id}`}
          type={INPUT_TYPE[field.type]}
          value={value}
          maxLength={field.maxLength}
          onChange={(control) => onChange(field.id, control.target.value)}
          className={INPUT}
        />
      )}
    </div>
  )
}

const INPUT_TYPE: Record<string, string> = {
  text: 'text',
  date: 'date',
  time: 'time',
}
