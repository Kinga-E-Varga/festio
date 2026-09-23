'use client'

import { useTranslations } from 'next-intl'
import { type CSSProperties, useState } from 'react'
import { Toast, useToast } from '@/components/dashboard/Toast'
import { HostBar } from '@/components/invitation/HostBar'
import { ExportIcon } from '@/components/invitation/icons'
import { HOST_ACTION } from '@/components/invitation/styles'
import { useLeaveFestio } from '@/lib/history'
import { printVars, templateFontVars } from '@/lib/invitation'
import type { InvitationTemplate } from '@/types/invitation'
import type { PrintSettings } from '@/types/print'
import { PrintPanel } from './PrintPanel'
import { PrintPreview } from './PrintPreview'

/**
 * The print page's own palette. A printable is Festio's artifact, not the
 * invitation's — the template's colours stop at the card's artwork, and the
 * page around it, its form and its chrome are all painted from here.
 *
 * Same var names as a template's palette, so every shared control
 * (`styles.ts`, the leaf faces) reads this without knowing it is on the
 * print page. `--print-ground` is the page behind the paper: a shade off
 * `--c1`, so the form reads as a surface laid on the page rather than as
 * more of it.
 */
const PRINT_PALETTE = {
  '--c1': '#2F281F',
  '--c2': '#8D7D6A',
  '--c3': '#F8F2E0',
  '--c4': '#8D7D6A',
  '--c5': '#C6B379',
  '--c6': '#7B2C30',
  '--print-ground': '#F9F5EA',
} as CSSProperties

interface PrintEditorProps {
  template: InvitationTemplate
  /**
   * The invitation's own RSVP message — where the printable's larger line
   * starts. The two part company from the first keystroke; this is a default,
   * not a binding.
   */
  rsvpMessage: string
  /** The guest-facing address, printed on the card. */
  link: string
  /**
   * The line the second input opens on, until the host writes their own.
   * Festio's copy, and it is printed, so it arrives already written in the
   * invitation's language — never the locale the host reads Festio in.
   */
  defaultNote: string
}

/**
 * The print page. It is laid out like the invitation editor and takes the
 * same controls, but what fills the middle is a sheet of paper being turned
 * rather than the invitation itself, and the panel beside it settles the
 * paper rather than the copy.
 *
 * Export does nothing yet beyond saying so.
 */
export function PrintEditor({
  template,
  rsvpMessage,
  link,
  defaultNote,
}: PrintEditorProps) {
  const [settings, setSettings] = useState<PrintSettings>({
    shape: 'flat',
    tinted: true,
    headline: rsvpMessage,
    note: defaultNote,
  })
  /*
   * Answered at every width. Below the breakpoint the form covers the
   * paper; above it the form sits beside the paper and closing it hands the
   * width over — see `.sheet-form`.
   */
  const [editing, setEditing] = useState(true)
  const t = useTranslations('HostEditor')
  const toast = useToast()
  const leave = useLeaveFestio()

  function change<Key extends keyof PrintSettings>(
    key: Key,
    value: PrintSettings[Key],
  ) {
    setSettings((current) => ({ ...current, [key]: value }))
  }

  return (
    <>
      <div
        style={{
          ...templateFontVars(template),
          ...printVars(template),
          ...PRINT_PALETTE,
        }}
        className={`invite relative overflow-hidden ${template.fonts.primary.className} ${template.fonts.secondary.className} bg-[var(--print-ground)] flex h-dvh flex-col invite:flex-row`}
      >
        {/*
         * Bar then sheet, the invitation editor's column exactly: the bar is
         * a row of its own above the paper rather than a layer over it, so
         * the sheet sizes itself against what is left and is never partly
         * behind the controls.
         */}
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
          {/*
           * The bar does not answer to `editing` — Back and Export stay
           * within reach while the form is open.
           */}
          <HostBar
            onBack={leave}
            editing={editing}
            onToggleEdit={() => setEditing(!editing)}
            thirdAction={
              <button
                type="button"
                onClick={() => toast.show(t('exported'))}
                className={HOST_ACTION}
              >
                <ExportIcon size={14} />
                {t('export')}
              </button>
            }
          />

          <div className="relative flex min-h-0 min-w-0 flex-1">
            <PrintPreview settings={settings} link={link} />
          </div>
        </div>

        <PrintPanel
          settings={settings}
          open={editing}
          onChange={change}
          onClose={() => setEditing(false)}
        />
      </div>
      <Toast message={toast.message} />
    </>
  )
}
