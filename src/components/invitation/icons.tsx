/** Icons shared by the guest's reply surface and the host's edit panel. */

export function XIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
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

export function ArrowLeftIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 8H2M7 3L2 8l5 5" />
    </svg>
  )
}

/** Edit — the nib points at the segment's label, as a pen lying left to right. */
export function PencilIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11.5 2.2l2.3 2.3M12.1 1.6a1.2 1.2 0 011.7 1.7L5.6 11.5 2.3 12.4l.9-3.3z" />
    </svg>
  )
}

/** The mark in a checked box — the box itself is drawn by whoever owns it. */
export function CheckIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8.5L6.5 12 13 4.5" />
    </svg>
  )
}

/**
 * Export — the file coming down out of the app and into the host's hands.
 * The tray is open at the top so the arrow reads as arriving in it rather
 * than as a glyph sitting on a box.
 */
export function ExportIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 1.75v8" />
      <path d="M4.75 6.5 8 9.75 11.25 6.5" />
      <path d="M2.25 10.75v1.5a2 2 0 0 0 2 2h7.5a2 2 0 0 0 2-2v-1.5" />
    </svg>
  )
}
