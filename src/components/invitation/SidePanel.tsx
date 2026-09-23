import { useTranslations } from 'next-intl'
import type { CSSProperties, ReactNode } from 'react'
import { XIcon } from './icons'
import { PANEL, SOLID } from './styles'

interface SidePanelProps {
  /** `edit` for the invitation editor, `sheet-form` for the print page — see `globals.css`. */
  panelClassName: string
  open: boolean
  /** The invitation editor takes the reply panel out of the tab order while closed; the print page has nothing behind it to protect. */
  inert?: boolean
  style?: CSSProperties
  onClose: () => void
  children: ReactNode
}

/**
 * The host's slide-in form: an aside sized and animated by `panelClassName`,
 * the header's close `X`, and the caller's own fields. Shared by the
 * invitation editor and the print page, which take the same shell and differ
 * only in which fields fill it.
 */
export function SidePanel({
  panelClassName,
  open,
  inert,
  style,
  onClose,
  children,
}: SidePanelProps) {
  return (
    // A glow in the panel's own colour, so its edge doesn't cut hard
    // against what's beside it.
    <aside
      style={style}
      className={`${panelClassName} ${PANEL} elevation-panel`}
      data-open={open}
      inert={inert}
    >
      <div className="bg-[var(--c1)] flex flex-1 flex-col overflow-y-auto p-5 invite:p-8 transition-colors">
        <Header onClose={onClose} />
        {children}
      </div>
    </aside>
  )
}

/** The panel's top exit — the same X the guest's mobile drawer closes with. */
function Header({ onClose }: { onClose: () => void }) {
  const t = useTranslations('HostEditor')

  return (
    <header className="mb-6 flex items-center justify-end gap-4">
      <button
        type="button"
        aria-label={t('close')}
        onClick={onClose}
        className="text-[color:var(--c3)] transition-opacity hover:opacity-60"
      >
        <XIcon size={20} />
      </button>
    </header>
  )
}

/**
 * View is the same exit as the header's X. Only below the breakpoint: above
 * it the panel sits beside the card or paper and the host bar's Edit segment
 * (or the X alone) is the way out.
 */
export function PanelViewButton({
  onClose,
  className = '',
}: {
  onClose: () => void
  className?: string
}) {
  const t = useTranslations('HostEditor')

  return (
    <div className="flex gap-3 invite:hidden">
      <button
        type="button"
        onClick={onClose}
        className={`${SOLID} flex-1 mb-6 ${className}`}
      >
        {t('view')}
      </button>
    </div>
  )
}
