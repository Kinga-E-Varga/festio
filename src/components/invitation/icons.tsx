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

/** The tab that calls the hidden host controls back down. */
export function ChevronDownIcon({ size = 12 }: { size?: number }) {
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
      <path d="M3 6l5 5 5-5" />
    </svg>
  )
}
