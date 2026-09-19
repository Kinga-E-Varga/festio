'use client'

import { useEffect } from 'react'

/** The sticky top bar, so a card too tall to centre still clears it. */
const TOPBAR = 64

/**
 * A hash link leaves its target at the top of the screen, under the top bar.
 * A card the host has just picked out of a list reads better in the middle, so
 * this takes over once the browser has made its own jump.
 */
export function CentreOnHash() {
  useEffect(() => {
    const centre = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (!id) return

      const target = document.getElementById(id)
      if (!target) return

      /*
       * Measured rather than handed to `scrollIntoView`, which honours the
       * target's own scroll margin and would land it off centre by half of it.
       * A card taller than the screen cannot be centred, so it starts at the
       * top instead, clear of the bar.
       */
      const box = target.getBoundingClientRect()
      const offset =
        box.height + TOPBAR > window.innerHeight
          ? TOPBAR
          : (window.innerHeight - box.height) / 2

      window.scrollTo({
        top: Math.max(0, window.scrollY + box.top - offset),
      })
    }

    // After the browser's own jump, and after the layout it jumped against.
    const frame = requestAnimationFrame(centre)
    window.addEventListener('hashchange', centre)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('hashchange', centre)
    }
  }, [])

  return null
}
