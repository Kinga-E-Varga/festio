'use client'

import type { ReactNode } from 'react'
import { pageBackground, templateVars } from '@/lib/invitation'
import type {
  InvitationTemplate,
  RsvpPayload,
  TemplateValues,
} from '@/types/invitation'
import { RsvpPanel } from './RsvpPanel'
import { ScaledStage } from './ScaledStage'

interface InvitationProps {
  template: InvitationTemplate
  /** Host-entered content: the card's text, and the reply panel's standing line. */
  values: TemplateValues
  /** The card — server-rendered for a guest, live for a host. */
  children: ReactNode
  /**
   * The host's own layer, drawn inside the invitation: the edit form and the
   * controls over the card. Must be rendered in here, not around it — the
   * palette vars and fonts are on the root, the edit form anchors its
   * `invite:absolute` to it, and the root's `overflow-hidden` is the only
   * thing keeping the closed form off the page.
   */
  host?: ReactNode
  /** Switches the reply panel inert — what the host's edit form asks for while it covers it. */
  replyInert?: boolean
  onSubmit?: (payload: RsvpPayload) => void
}

/**
 * The invitation: the card and the reply, always both. Only print takes the
 * card on its own, and it does that directly — so the reply panel is built
 * here rather than passed in.
 *
 * Card beside panel above `--breakpoint-invite`, card above bar below it. The
 * stage refits itself either way — when the panel moves, the card's
 * constraining axis flips from height to width and nothing here has to know.
 *
 * The height is `h-dvh`, never `min-h-dvh`. A floor lets the container grow
 * to fit the frame the stage just sized, so the stage would measure a slot
 * of its own making: every scale too tall for the viewport becomes a stable
 * fixed point, and the card never shrinks back after a rotation that needs a
 * smaller one. A definite height caps the slot; anything taller overflows
 * into the stage's own scroller, which is where it belongs.
 */
export function Invitation({
  template,
  values,
  children,
  host,
  replyInert,
  onSubmit,
}: InvitationProps) {
  const { width, height, minScale, maxScale } = template.design
  const ground = pageBackground(template)

  return (
    <div
      style={{ ...templateVars(template), ...ground.style }}
      className={`invite relative overflow-hidden ${template.fonts.primary.className} ${template.fonts.secondary.className} ${ground.className} flex h-dvh flex-col invite:flex-row`}
    >
      {/*
       * The padding lives here rather than on the stage: `clientWidth`
       * counts padding, so a padded stage would measure a slot it does not
       * have and paint the card slightly too large.
       */}
      <div className="relative flex min-h-0 min-w-0 flex-1">
        <ScaledStage
          width={width}
          height={height}
          minScale={minScale}
          maxScale={maxScale}
        >
          {children}
        </ScaledStage>
      </div>

      <RsvpPanel
        template={template}
        values={values}
        onSubmit={onSubmit}
        inert={replyInert}
      />

      {host}
    </div>
  )
}
