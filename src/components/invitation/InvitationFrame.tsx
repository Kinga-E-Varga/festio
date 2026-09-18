'use client'

import type { ReactNode } from 'react'
import { pageBackground, templateVars } from '@/lib/invitation'
import type { InvitationTemplate } from '@/types/invitation'
import { ScaledStage } from './ScaledStage'

interface InvitationFrameProps {
  template: InvitationTemplate
  /** The card. */
  children: ReactNode
  /** The reply surface, or the host's edit form in its place. Absent for a template preview with no event behind it. */
  panel?: ReactNode
  /** Controls floating over the card — the host's, never a guest's. */
  overlay?: ReactNode
}

/**
 * Card beside panel above 900px, card above bar below it. The stage refits
 * itself either way — when the panel moves, the card's constraining axis
 * flips from height to width and nothing here has to know.
 *
 * The height is `h-dvh`, never `min-h-dvh`. A floor lets the container grow
 * to fit the frame the stage just sized, so the stage would measure a slot
 * of its own making: every scale too tall for the viewport becomes a stable
 * fixed point, and the card never shrinks back after a rotation that needs a
 * smaller one. A definite height caps the slot; anything taller overflows
 * into the stage's own scroller, which is where it belongs.
 */
export function InvitationFrame({
  template,
  children,
  panel,
  overlay,
}: InvitationFrameProps) {
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
        {overlay}
      </div>
      {panel}
    </div>
  )
}
