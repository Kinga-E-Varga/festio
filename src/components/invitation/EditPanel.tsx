'use client'

import type {
  InvitationTemplate,
  TemplateField,
  TemplateValues,
} from '@/types/invitation'
import {
  DATE_FORMATS,
  DEFAULT_DATE_FORMAT,
  EVENT_DATE,
  formatInvitationDate,
} from '@/lib/invitation'
import { XIcon } from './icons'
import { HINT, INPUT, LABEL, PANEL, SELECT, SOLID, TITLE } from './styles'

/**
 * The two halves of the editor, in the order the host meets them: the card
 * first, then the reply panel beside it. A template that declares nothing for
 * a scope simply doesn't get that group.
 */
const GROUPS = [
  { scope: 'card', title: 'Invitation' },
  { scope: 'rsvp', title: 'Response form' },
] as const

interface EditPanelProps {
  template: InvitationTemplate
  values: TemplateValues
  /** Always mounted; this slides it in over the RSVP panel instead of replacing it. */
  open: boolean
  onChange: (id: string, value: string) => void
  onClose: () => void
  onSave: () => void
}

/**
 * The host's text editor, generated from `template.fields` alone — a
 * different template yields a different form with no change here.
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
  open,
  onChange,
  onClose,
  onSave,
}: EditPanelProps) {
  const groups = GROUPS.map((group) => ({
    ...group,
    fields: template.fields.filter(
      (field) => (field.scope ?? 'card') === group.scope,
    ),
  })).filter((group) => group.fields.length > 0)

  const body = (
    <div className="flex flex-col max-w-[500px] m-auto">
      {groups.map((group) => (
        <section key={group.scope} className="flex flex-col mb-6">
          <p className={TITLE}>{group.title}</p>

          {group.fields.map((field) => (
            <Field
              key={field.id}
              field={field}
              value={values[field.id] ?? ''}
              eventDate={values[EVENT_DATE] ?? ''}
              onChange={onChange}
            />
          ))}
        </section>
      ))}

      <div className="flex flex-col gap-3">
        {/* View is the same exit as the header's X — back to the invitation. */}
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className={`${SOLID} flex-1`}>
            View
          </button>
        </div>

        <p className={HINT}>
          Guests are not told when you change an invitation. It is your
          responsibility to tell them if important details changed.
        </p>
      </div>
    </div>
  )

  return (
    <aside className={`edit ${PANEL}`} data-open={open} inert={!open}>
      {/*
       * The edge exists only where the panel meets the card. Below the
       * breakpoint the panel covers the screen and has nothing to meet.
       */}
      <div
        className="edge hidden invite:block bg-[var(--c1)]"
        data-axis="y"
        data-shape={template.edge}
      />
      <div className="bg-[var(--c1)] flex flex-1 flex-col overflow-y-auto p-5 invite:p-8 transition-colors">
        <Header onClose={onClose} />
        {body}
      </div>
    </aside>
  )
}

/** The panel's top exit — the same X the guest's mobile drawer closes with. */
function Header({ onClose }: { onClose: () => void }) {
  return (
    <header className="mb-6 flex items-center justify-end gap-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="text-[color:var(--c3)] transition-opacity hover:opacity-60"
      >
        <XIcon size={20} />
      </button>
    </header>
  )
}

/** One slot from `template.fields`, with the control its type asks for. */
function Field({
  field,
  value,
  eventDate,
  onChange,
}: {
  field: TemplateField
  value: string
  /** The event's own date — what a `dateFormat` choice is previewed against. */
  eventDate: string
  onChange: (id: string, value: string) => void
}) {
  return (
    <div className="flex flex-col mb-6">
      <label htmlFor={`field-${field.id}`} className={LABEL}>
        {field.label}
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
            {DATE_FORMATS.map((option) => (
              <option key={option.id} value={option.id}>
                {formatInvitationDate(eventDate, option.id)}
              </option>
            ))}
          </select>
          <p className={`${HINT} mt-1`}>
            Set with your event details — edit it there to change the date
            itself.
          </p>
        </>
      ) : field.type === 'longText' ? (
        <textarea
          id={`field-${field.id}`}
          rows={3}
          value={value}
          maxLength={field.maxLength}
          onChange={(control) => onChange(field.id, control.target.value)}
          className={`${INPUT} resize-none`}
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
