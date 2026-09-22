'use client'

import type { CSSProperties } from 'react'
import { CheckIcon } from '@/components/invitation/icons'
import { PanelViewButton, SidePanel } from '@/components/invitation/SidePanel'
import {
  LABEL,
  TEXTAREA,
  TOGGLE_OUTLINE,
  TOGGLE_SOLID,
} from '@/components/invitation/styles'
import type { PrintSettings, PrintShape } from '@/types/print'

const SHAPES: { id: PrintShape; label: string }[] = [
  { id: 'flat', label: 'Flat card' },
  { id: 'folded', label: 'Folded card' },
]

/**
 * What the host gets back from us once they print, one shape each, a line
 * per step: what they download, what to do with it, what to print it on.
 * Both shapes are kept here together because the box that shows them must not
 * resize when the host switches — see the note where it is rendered.
 */
const INSTRUCTIONS: Record<PrintShape, string[]> = {
  flat: [
    'You will download two images: one for the front, one for the back.',
    'Print them on the two sides of a single sheet of paper — nothing to fold.',
    'Paper size: anything between A6 (smallest recommended) and A5 (largest recommended), as long as you keep the A-series proportions.',
  ],
  folded: [
    'You will download two images: one for each side of the sheet.',
    'Print them on the two sides of a single sheet, then fold it in half — the front of the invitation ends up on the outside.',
    'Paper size before folding: anything between A5 (smallest recommended) and A4 (largest recommended), as long as you keep the A-series proportions.',
  ],
}

interface PrintPanelProps {
  settings: PrintSettings
  /** Whether the form is showing. Answered at every width. */
  open: boolean
  onChange: <Key extends keyof PrintSettings>(
    key: Key,
    value: PrintSettings[Key],
  ) => void
  onClose: () => void
}

/**
 * The printable's settings. The same surface as the invitation's edit panel,
 * and styled from the same palette — but this form is fixed rather than
 * generated from `template.fields`, because what a printable needs settling
 * is the paper, not the template's copy.
 *
 * It has no save of its own: the host action bar's Save is this form's save,
 * so nothing in here submits.
 */
export function PrintPanel({
  settings,
  open,
  onChange,
  onClose,
}: PrintPanelProps) {
  return (
    /*
     * Festio's own faces, not the template's. The form is the app talking to
     * the host about paper — the template's fonts belong to the card, and
     * the card is the only thing on this page still wearing them.
     *
     * Only the two role vars, because they are the only way a template's
     * face ever reaches anything: `body` sets Kantumruy for the whole app
     * and a template's font classes are `next/font` variable classes, which
     * declare `--font-noto-serif` and the like without applying a family.
     * So everything here is already Kantumruy, and both roles point at it
     * too, so a control that names one — `TEXTAREA` — lands on the same face
     * as the rest of the form.
     */
    <SidePanel
      panelClassName="sheet-form"
      open={open}
      onClose={onClose}
      style={
        {
          '--font-primary': 'var(--font-sans)',
          '--font-secondary': 'var(--font-sans)',
        } as CSSProperties
      }
    >
      {/*
       * `w-full` is what makes it fill: the auto margins that centre it
       * also turn off the column's stretch, so without it the form would
       * only be as wide as its widest label.
       */}
      <div className="flex flex-col w-full max-w-[500px] m-auto">
        <fieldset className="flex flex-col mb-6">
          <legend className={`${LABEL} mb-2`}>card style</legend>
          <div className="flex gap-6">
            {SHAPES.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={settings.shape === option.id}
                onClick={() => onChange('shape', option.id)}
                className={`flex-1 ${
                  settings.shape === option.id ? TOGGLE_SOLID : TOGGLE_OUTLINE
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/*
         * The box is drawn beside the input rather than by it: an
         * `appearance-none` checkbox cannot be given a mark of its own in
         * every browser, and a pseudo-element on an input is not something
         * to rely on. The real control stays, out of sight but not out of
         * the tab order, and the box follows its state.
         */}
        <fieldset className="flex flex-col mb-6">
          <legend className={`${LABEL} mb-2`}>Background</legend>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={settings.tinted}
              onChange={(control) =>
                onChange('tinted', control.target.checked)
              }
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={`grid size-[18px] shrink-0 place-items-center border-1 border-[var(--c3)] text-[color:var(--c1)] transition-colors ${
                settings.tinted ? 'bg-[var(--c3)]' : ''
              }`}
            >
              {settings.tinted ? <CheckIcon size={12} /> : null}
            </span>
            <span className="text-[16px] leading-[1.45] text-[color:var(--c3)]">
              Use matching color for the back and inside of the card.
            </span>
          </label>
        </fieldset>

        <div className="flex flex-col gap-2 mb-6">
          <label htmlFor="print-headline" className={LABEL}>
            message
          </label>
          <textarea
            id="print-headline"
            rows={2}
            maxLength={120}
            placeholder="Optional"
            value={settings.headline}
            onChange={(control) => onChange('headline', control.target.value)}
            className={TEXTAREA}
          />
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <label htmlFor="print-note" className={LABEL}>
            second line
          </label>
          <textarea
            id="print-note"
            rows={2}
            maxLength={120}
            placeholder="Optional"
            value={settings.note}
            onChange={(control) => onChange('note', control.target.value)}
            className={TEXTAREA}
          />
        </div>

        <div className="flex flex-col bg-[var(--c5)] text-[var(--c1)] border-1 border-[var(--c2)] p-4 rounded-sm">
          <p className="text-[14px] text-center font-semibold tracking-[0.1em] border-b-1 pb-2 mb-3 uppercase">
            Printing Instructions
          </p>
          {/*
           * Both sets of instructions are laid in the same cell, the one the
           * host is not reading hidden rather than removed. The box is then
           * always as tall as the longer of the two and holds still when the
           * shape changes, which is what stops the form jumping under the
           * pointer that just changed it.
           *
           * The grid is this pair's own rather than the box's: a cell named
           * by `grid-area` is filled before anything that names none, so a
           * heading sharing that grid would be auto-placed into the row
           * below the lists however early it came in the markup.
           */}
          <div className="grid">
            {SHAPES.map((option) => (
              <ul
                key={option.id}
                aria-hidden={settings.shape !== option.id}
                className={`[grid-area:1/1] space-y-2 text-[14px] leading-[1.45] font-[500] text-justify ${
                  settings.shape === option.id ? '' : 'invisible'
                }`}
              >
                {INSTRUCTIONS[option.id].map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <PanelViewButton onClose={onClose} className="mt-6" />
      </div>
    </SidePanel>
  )
}
