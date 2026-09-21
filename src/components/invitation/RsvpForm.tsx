'use client'

import { useState } from 'react'
import { GUEST_DATA_RETENTION_DAYS } from '@/lib/config'
import type { RsvpStatus } from '@/types/invitation'
import {
  HINT,
  INPUT,
  LABEL,
  QUIET,
  SOLID,
  TOGGLE_OUTLINE,
  TOGGLE_SOLID,
} from './styles'
import { NAME_LIMIT, NOTE_LIMIT, type RsvpFormState } from './useRsvpForm'

const CHOICES: { id: RsvpStatus; label: string }[] = [
  { id: 'going', label: 'Going' },
  { id: 'not_going', label: 'Not going' },
]

interface RsvpFormProps {
  form: RsvpFormState
  onSubmit: () => void
}

/**
 * The Type 1 reply: names, one going choice for the whole reply, and an
 * optional note. Everything else a template might ask is Type 2's business.
 */
export function RsvpForm({ form, onSubmit }: RsvpFormProps) {
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
        <legend className={`${LABEL} mb-3`}>Who is coming</legend>

        {values.rows.map((row, index) => (
          <div key={row.id} className="flex items-end gap-3">
            <input
              type="text"
              value={row.value}
              maxLength={NAME_LIMIT}
              placeholder="Full name"
              aria-label={`Name ${index + 1}`}
              onChange={(control) => set.name(row.id, control.target.value)}
              className={INPUT}
            />
            {index > 0 ? (
              <button
                type="button"
                aria-label={`Remove name ${index + 1}`}
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
          + New person
        </button>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="rsvp-note" className={LABEL}>
          Note for the host
        </label>
        <textarea
          id="rsvp-note"
          rows={3}
          value={values.note}
          maxLength={NOTE_LIMIT}
          placeholder="Optional"
          onChange={(control) => set.note(control.target.value)}
          className="w-full border-1 border-[var(--c2)] bg-transparent px-3 py-[6px] text-[16px] text-[color:var(--c3)] font-[family-name:var(--font-primary)] transition-colors placeholder:text-[color:var(--c4)] focus:border-[var(--c3)] focus:outline-none resize-none"
        />
        <p className={HINT}>{derived.noteLeft} characters left</p>
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
              {choice.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3">
        {showNameWarning ? (
          <p className="text-[12px] text-center leading-[1.45] text-[color:var(--c6)]">
            Please fill in a name for everyone you are RSVPing for.
          </p>
        ) : null}

        <button type="submit" className={SOLID}>
          Submit Response
        </button>

        <p className={HINT}>
          Your name and reply go only to the hosts of this event, and are
          deleted {GUEST_DATA_RETENTION_DAYS} days after it. Nothing is shared
          with anyone else.
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
