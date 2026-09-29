import { useTranslations } from 'next-intl'
import { CopyButton } from '@/components/dashboard/CopyButton'
import { PasswordField } from '@/components/dashboard/PasswordField'
import { Icon } from '@/components/icons'
import { invitationLink } from '@/lib/event'
import type { DashboardEvent } from '@/types/dashboard'

const FIELD_BASE =
  'flex items-center gap-[9px] border border-mustard-300 px-3 py-2 text-[13px] text-neutral-900'
const FIELD = `${FIELD_BASE} bg-mustard-50`
/** Stands in for the link row when there is nothing to share yet. */
const FIELD_NOTE = `${FIELD_BASE} bg-terracotta-200`

/**
 * How a guest reaches the event: the link with its copy button, the password
 * when it is Protected, and a note when there is nothing to share yet. Stacked
 * fields butt together and share their edges.
 */
export function ShareFields({
  event,
  className,
}: {
  event: DashboardEvent
  /** Width and stacking for the stack, which each card sets its own way. */
  className: string
}) {
  const t = useTranslations('Event')
  const tNotes = useTranslations('EventNotes')
  const link = invitationLink(event)

  return (
    <div className={`flex flex-col [&>*+*]:border-t-0 ${className}`}>
      <span className={FIELD}>
        <Icon name="link" className="size-3.5 shrink-0 text-forest-500" />
        <span className="flex-1 truncate">{link}</span>
        <CopyButton
          value={`https://${link}`}
          label={t('copyLinkFor', { title: event.title })}
        />
      </span>

      {event.password ? <PasswordField password={event.password} /> : null}

      {event.linkNoteKey ? (
        <span className={FIELD_NOTE}>
          <Icon name="eyeOff" className="size-3.5 shrink-0 text-neutral-700" />
          {tNotes(event.linkNoteKey)}
        </span>
      ) : null}
    </div>
  )
}
