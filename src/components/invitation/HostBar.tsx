import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'
import { ArrowLeftIcon, PencilIcon } from './icons'
import { HOST_ACTION, HOST_BAR_TOP, HOST_TOGGLE } from './styles'

interface HostBarProps {
  onBack: () => void
  /** Whether the edit form is open. Answered at every width. */
  editing: boolean
  onToggleEdit: () => void
  /** The bar's third segment — Save on the invitation editor, Export on the print page. */
  thirdAction: ReactNode
}

/**
 * The host's row of controls above the card or the paper: Back, the Edit
 * toggle, and a third action the caller supplies. Shared by the invitation
 * editor and the print page, which take the same bar but differ only in what
 * that third segment does.
 */
export function HostBar({
  onBack,
  editing,
  onToggleEdit,
  thirdAction,
}: HostBarProps) {
  const t = useTranslations('HostEditor')

  return (
    <div className="flex justify-center">
      {/*
       * The bar does not answer to `editing` — the host keeps Back and the
       * third action within reach while the form is open, and the form opens
       * beside the bar rather than over it.
       */}
      <div className={`${HOST_BAR_TOP} mb-2 invite:mt-6 invite:mb-2`}>
        <button type="button" onClick={onBack} className={HOST_ACTION}>
          <ArrowLeftIcon size={14} />
          {t('back')}
        </button>
        {/*
         * A toggle, not a way in: it holds the hover fill while the form is
         * open and closes it again on a second click, so the segment always
         * says which state the host is in.
         */}
        <button
          type="button"
          aria-pressed={editing}
          data-active={editing ? 'true' : undefined}
          onClick={onToggleEdit}
          className={HOST_TOGGLE}
        >
          <PencilIcon size={14} />
          {t('edit')}
        </button>
        {thirdAction}
      </div>
    </div>
  )
}
