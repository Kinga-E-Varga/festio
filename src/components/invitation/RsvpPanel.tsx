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
  'font-[family-name:var(--font-primary)] text-[24px] text-center text-balance leading-[1.5] text-[color:var(--c2)] mb-8 '

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
 * The guest's reply surface: one panel, placed beside the card above
 * `--breakpoint-invite` and anchored to the bottom of the screen below it.
 * `.reply` in `globals.css` is what moves it; nothing here knows the width.
 *
 * One tree, not one per breakpoint. Two would put `rsvp-note` in the document
 * twice and send every `<label for>` to whichever copy was written first.
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
  const sent = form.derived.sent
  const shown = open || sent

  function send() {
    const payload = form.buildPayload()
    if (!payload) return
    onSubmit?.(payload)
    form.markSent()
  }

  return (
    <>
      {/*
       * A transparent spacer, the exact resting height of the edge + bar,
       * reserved in normal flow so the card centres in the space actually
       * visible above the bar — not the full viewport the fixed panel floats
       * over. Above the breakpoint the panel is back in flow and this goes.
       */}
      <div className="invite:hidden h-[70px] shrink-0" />

      <aside className={`reply ${PANEL}`} data-open={open} inert={inert}>
        <div className="edge" data-axis="reply" data-shape={template.edge} />

        {/*
         * Bar and reply are one painted box, not two. As separate boxes in
         * the same --c1 they round their own edges independently while the
         * block is mid-transform, and a hairline of the page ground flashes
         * through the seam between them — the artefact the `.edge` rule
         * fights with `translateZ(0)` and its -1px margin. One background
         * has no seam to leak through. The edge itself is left unpainted
         * behind so its wavy mask still shows the page ground through it,
         * exactly as the spacer does at rest.
         */}
        <div className="flex flex-1 flex-col bg-[var(--c1)] invite:overflow-y-auto  invite:p-8">
          {/*
           * The bar is the narrow screen's only handle — it is what the
           * closed block leaves on screen. Beside the card there is nothing
           * to drag open, so the Respond button below takes over instead.
           */}
          <div className="invite:hidden relative flex h-[50px] shrink-0 items-center justify-center px-5">
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
                <span className="font-[family-name:var(--font-primary)] text-[16px] tracking-[0.06em] text-[color:var(--c3)]">
                  Respond Now
                </span>
              </button>
            )}
          </div>

          {/*
           * Auto margins centre the block beside the card while it is short
           * and let it scroll once it is not. `justify-center` would make
           * the overflowing top unreachable, which is exactly what happens
           * after a few names. Below the breakpoint the reply scrolls
           * within its own ceiling instead, so the bar stays reachable.
           */}
          <div className="max-h-[60dvh] overflow-y-auto px-5 pt-5 pb-8 invite:my-auto invite:max-h-none invite:overflow-visible invite:px-0 invite:pt-0 invite:pb-0">
            {sent ? null : (
              <p className={`${TITLE} hidden invite:block`}>{message}</p>
            )}

            <div className="reveal hidden invite:grid" data-open={!shown}>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className={`${open ? 'opacity-0' : 'font-[family-name:var(--font-primary)] font-[400] text-[16px] tracking-[0.06em] text-[var(--c1)] bg-[var(--c3)] border-1 border-[var(--c3)] text-center py-2 px-6 rounded-xs hover:bg-[var(--c1)] hover:text-[var(--c3)] transition-all'}`}
                >
                  Respond Now
                </button>
              </div>
            </div>

            {/*
             * `contents` below the breakpoint: the whole block slides as a
             * unit there, so collapsing the reply to `0fr` would leave the
             * slide nothing to carry.
             */}
            <div className="reveal contents invite:grid" data-open={shown}>
              <div>
                <div className="invite:pt-6" inert={!shown}>
                  <Reply form={form} onSend={send} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
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
