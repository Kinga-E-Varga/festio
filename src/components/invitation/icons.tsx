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
