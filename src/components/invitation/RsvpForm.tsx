'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { GUEST_DATA_RETENTION_DAYS } from '@/lib/config'
import type { RsvpStatus } from '@/types/invitation'
import {
  HINT,
  INPUT,
  LABEL,
  QUIET,
  SOLID,
  TEXTAREA,
  TOGGLE_OUTLINE,
  TOGGLE_SOLID,
} from './styles'
import { NAME_LIMIT, NOTE_LIMIT, type RsvpFormState } from './useRsvpForm'

/** Ids only — what each choice is called is the invitation's language. */
const CHOICES: { id: RsvpStatus; key: 'going' | 'notGoing' }[] = [
  { id: 'going', key: 'going' },
  { id: 'not_going', key: 'notGoing' },
]

interface RsvpFormProps {
  form: RsvpFormState
  onSubmit: () => void
}

/**
 * The Type 1 reply: names, one going choice for the whole reply, and an
 * optional note. Everything else a template might ask is Type 2's business.
 *
 * Every word here is Festio's, not the host's, so it comes from the catalog
 * of the invitation's own `language` — the provider around this tree, never
 * the locale the host happens to read the dashboard in.
 */
export function RsvpForm({ form, onSubmit }: RsvpFormProps) {
  const t = useTranslations('Rsvp')
  const { values, set, derived } = form
  const [attempted, setAttempted] = useState(false)
  const showNameWarning = attempted && derived.anyNameEmpty

  return (
    <form
      className="flex flex-col gap-10 max-w-[400px] m-auto"
      onSubmit={(control) => {
        control.preventDefault()
        if (derived.anyNameEmpty) {
          setAttempted(true)
          return
        }
        onSubmit()
      }}
    >
      <fieldset className="flex flex-col gap-6">
        <legend className={`${LABEL} mb-3`}>{t('whoIsComing')}</legend>

        {values.rows.map((row, index) => (
          <div key={row.id} className="flex items-end gap-3">
            <input
              type="text"
              value={row.value}
              maxLength={NAME_LIMIT}
              placeholder={t('fullName')}
              aria-label={t('nameNumber', { number: index + 1 })}
              onChange={(control) => set.name(row.id, control.target.value)}
              className={INPUT}
            />
            {index > 0 ? (
              <button
                type="button"
                aria-label={t('removeName', { number: index + 1 })}
                onClick={() => set.removeName(row.id)}
                className="pb-[7px] text-[color:var(--c2)] transition-opacity hover:text-[color:var(--c3)]"
              >
                <XIcon />
              </button>
            ) : null}
          </div>
        ))}

        <button
          type="button"
          onClick={set.addName}
          className={`${QUIET} self-start`}
        >
          {t('addPerson')}
        </button>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="rsvp-note" className={LABEL}>
          {t('noteLabel')}
        </label>
        <textarea
          id="rsvp-note"
          rows={3}
          value={values.note}
          maxLength={NOTE_LIMIT}
          placeholder={t('notePlaceholder')}
          onChange={(control) => set.note(control.target.value)}
          className={TEXTAREA}
        />
        <p className={HINT}>{t('charactersLeft', { count: derived.noteLeft })}</p>
      </div>

      <fieldset className="flex flex-col gap-3">
        <div className="flex gap-6">
          {CHOICES.map((choice) => (
            <button
              key={choice.id}
              type="button"
              aria-pressed={values.status === choice.id}
              onClick={() => set.status(choice.id)}
              className={`flex-1 ${values.status === choice.id ? TOGGLE_SOLID : TOGGLE_OUTLINE}`}
            >
              {t(choice.key)}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3">
        {showNameWarning ? (
          <p className="text-[12px] text-center leading-[1.45] text-[color:var(--c6)]">
            {t('nameWarning')}
          </p>
        ) : null}

        <button type="submit" className={SOLID}>
          {t('submit')}
        </button>

        <p className={HINT}>
          {t('privacy', { days: GUEST_DATA_RETENTION_DAYS })}
        </p>
      </div>
    </form>
  )
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M2 2l12 12M14 2L2 14" />
    </svg>
  )
}
