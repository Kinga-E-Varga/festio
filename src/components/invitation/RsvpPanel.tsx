'use client'

import { useState } from 'react'
import type {
  InvitationTemplate,
  RsvpPayload,
  TemplateValues,
} from '@/types/invitation'
import { XIcon } from './icons'
import { RsvpForm } from './RsvpForm'
import { PANEL } from './styles'
import { useRsvpForm, type RsvpFormState } from './useRsvpForm'

/**
 * The panel's standing line is host-editable, like the card's text: templates
 * declare it as the `rsvpMessage` field. This stands in for a template that
 * doesn't, so the panel is never headed by a blank line.
 */

const TITLE =
  'font-[family-name:var(--font-primary)] text-[24px] text-center text-balance leading-[1.5] text-[color:var(--c2)] mb-6 '

const MESSAGE = 'We would love to know if you can join us.'

interface RsvpPanelProps {
  template: InvitationTemplate
  /** Host-entered content; only `rsvpMessage` concerns this panel. */
  values: TemplateValues
  onSubmit?: (payload: RsvpPayload) => void
  /** True while the host's edit panel is covering this one, so it can't be tabbed into. */
  inert?: boolean
}

/**
 * The guest's reply surface: a panel beside the card on a wide screen, a bar
 * that opens a drawer below 900px. Both render the same form.
 */
export function RsvpPanel({
  template,
  values,
  onSubmit,
  inert,
}: RsvpPanelProps) {
  const form = useRsvpForm()
  const [open, setOpen] = useState(false)
  const message = values.rsvpMessage?.trim() || MESSAGE

  function send() {
    const payload = form.buildPayload()
    if (!payload) return
    onSubmit?.(payload)
    form.markSent()
  }

  return (
    <>
      <aside className={`hidden invite:flex ${PANEL}`} inert={inert}>
        <div className="edge" data-axis="y" data-shape={template.edge} />
        <div className="flex flex-1 flex-col overflow-y-auto bg-[var(--c1)] px-[44px] py-[40px]">
          {/*
           * Auto margins centre the block while it is short and let it scroll
           * once it is not. `justify-center` would make the overflowing top
           * unreachable, which is exactly what happens after a few names.
           */}
          <div className="my-auto">
            {form.derived.sent ? null : <p className={TITLE}>{message}</p>}

            <div className="reveal" data-open={!open && !form.derived.sent}>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className={`font-[family-name:var(--font-primary)] font-[600] text-[15px] tracking-[0.06em] text-[var(--c1)] bg-[var(--c3)] text-center uppercase py-2 px-6 rounded-sm hover:bg-[var(--c2)] transition-all`}
                >
                  Respond
                </button>
              </div>
            </div>

            <div className="reveal" data-open={open || form.derived.sent}>
              <div>
                <div className="pt-6">
                  <Reply form={form} onSend={send} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/*
       * A transparent spacer, the exact resting height of the edge + bar
       * below, reserved in normal flow so the card centres in the space
       * actually visible above the bar — not the full viewport the fixed
       * block below floats over.
       */}
      <div className="invite:hidden h-[70px] shrink-0" />

      {/*
       * Fixed and bottom-anchored as a single block: edge, bar, then the
       * reply, the reply always at its natural full size — never clipped or
       * grown. A single `translateY` on the whole block is what moves it:
       * closed sits at `calc(100% - 70px)`, its own height minus the edge +
       * bar, which tucks everything except those 70px below the screen;
       * open is `translateY(0)`. Because it is one rigid block translating
       * as a unit, the edge and bar ride up with the reply rather than the
       * reply growing into view underneath a bar that stays put — a true
       * slide, not an accordion reveal. The edge itself is left unpainted
       * behind so its wavy mask still shows the page ground through it,
       * exactly as the spacer does at rest.
       */}
      <div
        className="invite:hidden fixed inset-x-0 bottom-0 z-40 [will-change:transform] transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: open
            ? 'translateY(0) translateZ(0)'
            : 'translateY(calc(100% - 70px)) translateZ(0)',
        }}
      >
        <div className="edge" data-axis="x" data-shape={template.edge} />

        {/*
         * Bar and reply are one painted box, not two. As separate boxes in
         * the same --c1 they round their own edges independently while the
         * block is mid-transform, and a hairline of the page ground flashes
         * through the seam between them — the artefact the `.edge` rule
         * fights with `translateZ(0)` and its -1px margin. One background
         * has no seam to leak through.
         */}
        <div className="bg-[var(--c1)]">
          <div className="relative flex h-[50px] items-center justify-center px-5">
            {open ? (
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="absolute top-1/2 right-5 -translate-y-1/2 text-[color:var(--c3)] transition-opacity hover:opacity-60"
              >
                <XIcon size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="font-[family-name:var(--font-primary)] text-[15px] tracking-[0.06em] text-[color:var(--c3)] uppercase">
                  Respond
                </span>
              </button>
            )}
          </div>

          <div
            className="max-h-[60dvh] overflow-y-auto px-5 pt-5 pb-8"
            inert={!open}
          >
            <Reply form={form} onSend={send} />
          </div>
        </div>
      </div>
    </>
  )
}

/** The form, or what stands in its place once the reply is in. */
function Reply({ form, onSend }: { form: RsvpFormState; onSend: () => void }) {
  if (form.derived.sent) {
    return (
      <div className="flex flex-col gap-2">
        <p className={TITLE}>Thank you — your reply is with the hosts.</p>
        <p className="text-[12px] leading-[1.45] text-[color:var(--c3)] text-center">
          Need to change something? The hosts can correct any reply for you.
        </p>
      </div>
    )
  }
  return <RsvpForm form={form} onSubmit={onSend} />
}
