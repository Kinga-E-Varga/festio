import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { CopyButton } from '@/components/dashboard/CopyButton'
import { PasswordField } from '@/components/dashboard/PasswordField'
import { Icon } from '@/components/icons'
import {
  contentFreeze,
  formatDay,
  formatDeadline,
  formatRelative,
  invitationLink,
  safeguardBarVars,
  safeguardReplyPercent,
} from '@/lib/event'
import type { DashboardEvent, IconName } from '@/types/dashboard'

/** The card's left edge says at a glance which pile the event is in. */
/** How full the safeguard has to be before it is worth a chip of its own. */
const SAFEGUARD_WARNING = 80

const FIELD_BASE =
  'flex items-center gap-[9px] border border-mustard-300 px-3 py-2 text-[13px] text-neutral-900'
const FIELD = `${FIELD_BASE} bg-mustard-50`
/** Stands in for the link row when there is nothing to share yet. */
const FIELD_NOTE = `${FIELD_BASE} bg-terracotta-200`

interface Warning {
  icon: IconName
  /** A key in the `Event` namespace. */
  key: string
  /** Values the key takes, when it names a number. */
  values?: Record<string, number>
}

/**
 * The only tags the card carries. Each one names the deadline or the limit it
 * is about outright — a host reading "Edit locks soon" in passing should not
 * have to open the event to learn what locks. The exact hours are on the event
 * itself; the card only has to say it is close.
 */
function warningsFor(event: DashboardEvent, safeguardPercent: number) {
  const warnings: Warning[] = []

  if (!event.paid) {
    warnings.push({ icon: 'alert', key: 'paymentPending' })
  }

  if (event.locked) {
    warnings.push({ icon: 'lock', key: 'editingClosed' })
  } else if (event.isNextUp && event.locksIn) {
    warnings.push({ icon: 'clock', key: 'editLocksSoon' })
  }

  /* A cap nobody is near is a safeguard working, not news. */
  if (event.rsvp.replied > 0 && safeguardPercent >= SAFEGUARD_WARNING) {
    warnings.push({
      icon: 'shield',
      key: 'safeguardAt',
      values: { percent: safeguardPercent },
    })
  }

  return warnings
}

function Tally({
  label,
  value,
  detail,
}: {
  label: string
  value: number
  /** Denominator kept small so four tallies fit the column, e.g. "/124". */
  detail?: string
}) {
  return (
    // Narrow cards read better as label-left / value-right rows; once four fit
    // across, the value sits under its label instead.
    <div className="flex items-baseline justify-between gap-2.5 @2xl:block">
      <dt className="text-[10px] tracking-[0.1em] text-neutral-700 uppercase">
        {label}
      </dt>
      <dd className="font-serif text-[25px] leading-none text-neutral-900 tabular-nums @2xl:mt-1">
        {value}
        {detail ? (
          <span className="font-sans text-xs text-neutral-700">{detail}</span>
        ) : null}
      </dd>
    </div>
  )
}

export function EventCard({ event }: { event: DashboardEvent }) {
  const link = invitationLink(event)
  /* Past and past its retention date: the record is a stub, not a tool. */
  const archived = event.status === 'past' && event.dataDeleted
  const { cap } = event.safeguard
  const replied = event.rsvp.replied
  const safeguardPercent = safeguardReplyPercent(event)
  const barVars = safeguardBarVars(event)
  const t = useTranslations('Event')
  const tNotes = useTranslations('EventNotes')
  const warnings = warningsFor(event, safeguardPercent)
  const locale = useLocale()
  const replyCloses = formatDeadline(contentFreeze(event.date), locale)
  const safeguardValues = { replied, cap, percent: safeguardPercent }

  return (
    /*
     * The whole card leads to this event on the events page, where its actions
     * live. Hover is carried by the border, the shadow and the title rather
     * than by a fill: the card's own ground is how the pile reads at a glance,
     * and it may not move under the pointer. What the card leads to is said
     * outright at its foot, so the hover only has to confirm it.
     */
    <article className="group relative border border-mustard-300 bg-mustard-100 transition hover:shadow-[0_3px_16px_rgba(47,40,31,0.2)]">
      {/*
       * The nav and the activity rail both eat into the card's width, so its
       * layout keys off the card itself rather than the viewport.
       */}
      <div className="@container">
        {/*
         * The preview is sized on one axis at every width: the layout gives
         * its box a width and the image fills it, so the height always falls
         * out of the ratio and the box can never letterbox.
         *
         * The full-size preview only earns its place while the details beside
         * it can still hold the meta row on one line. That row needs 286px, so
         * with the 164 preview, the 26 gap and 32 of padding the card has to
         * be 508 wide; under that it falls back to the compact head, which
         * stacks instead: the date and title lead, the preview takes a row of
         * its own beneath them — capped at 300 so it does not swallow the
         * card on a phone — and the rest of the card follows.
         */}
        <div className="grid grid-cols-1 px-4 pt-[18px] pb-5 @min-[508px]:flex @min-[508px]:flex-wrap @min-[508px]:gap-x-[26px] @min-[508px]:gap-y-5 @min-[904px]:grid @min-[904px]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,2fr)] @2xl:px-6 @2xl:pt-[22px] @2xl:pb-[22px]">
          <div className="contents @min-[508px]:flex @min-[508px]:min-w-0 @min-[508px]:flex-1 @min-[508px]:gap-[26px] @min-[904px]:contents">
            <div className="col-start-1 row-start-2 mt-[18px] w-full max-w-[300px] self-start bg-neutral-50 mx-auto @min-[508px]:mx-0 @min-[508px]:mt-0 @min-[508px]:w-[164px] @min-[508px]:shrink-0 @min-[904px]:w-full @min-[904px]:row-start-1 @min-[904px]:max-w-[220px] @min-[904px]:self-center @min-[904px]:justify-self-center">
              <Image
                src={event.preview}
                alt={t('previewAlt', { title: event.title })}
                sizes="300px"
                className="h-auto w-full"
              />
            </div>

            {/* Nudged down so the date starts just below the preview's top edge. */}
            <div className="contents @min-[508px]:block @min-[508px]:min-w-0 @min-[508px]:flex-1 @min-[508px]:pt-1.5 @min-[904px]:col-start-2 @min-[904px]:row-start-1 @min-[904px]:self-center @min-[904px]:pt-0">
              {/* Date and title travel together: they lead the compact
               * stack, and sit centred against the preview once it moves
               * alongside them. */}
              <div className="col-start-1 row-start-1 @min-[508px]:self-center">
                <p className="mb-4 text-[12.5px] leading-none text-neutral-700">
                  <span className="font-medium text-neutral-900">
                    {formatDay(event.date, locale)}
                  </span>
                  <span aria-hidden="true">{' · '}</span>
                  <span
                    className={
                      event.isNextUp ? 'font-medium text-terracotta-600' : ''
                    }
                  >
                    {formatRelative(event.countdown, locale)}
                  </span>
                </p>

                {/* Wraps beside the compact preview; clipped beside the full one. */}
                <h3 className="text-justify font-serif text-[20px] leading-[1.2] text-neutral-900 transition-colors group-hover:text-forest-600 @min-[508px]:mb-[18px] @min-[508px]:truncate @2xl:text-2xl">
                  {/*
                   * The clamp sits on a child, not the heading: the heading is a
                   * grid item in the compact layout, and grid items blockify
                   * `-webkit-box` away, which would drop the clamp entirely.
                   */}
                  <span className="@max-[508px]:line-clamp-3">
                    {event.title}
                  </span>
                </h3>
              </div>

              {/*
               * Stacked, the tags and the line below them are separate grid
               * rows, whose margins do not collapse — so down there the row
               * below owns the whole gap.
               */}
              {warnings.length > 0 && !archived ? (
                <div className="col-span-full row-start-3 mt-4 mb-0 flex flex-wrap items-center gap-2 @min-[508px]:mt-0 @min-[508px]:mb-[18px]">
                  {warnings.map((warning) => (
                    <span
                      key={warning.key}
                      className="flex items-center gap-1.5 border border-terracotta-400 bg-terracotta-200 px-2.5 py-1 text-xs font-semibold text-terracotta-600"
                    >
                      <Icon name={warning.icon} className="size-3.5" />
                      {t(warning.key, warning.values)}
                    </span>
                  ))}
                </div>
              ) : null}

              {archived ? null : (
                <p className="col-span-full row-start-4 mt-4 mb-[18px] flex items-center gap-1.5 text-[12.5px] text-neutral-700 @min-[508px]:mt-0">
                  <Icon
                    name="calendar"
                    className="size-3.5 shrink-0 text-forest-500"
                  />
                  {t('replyFormClosesOn', { date: replyCloses })}
                </p>
              )}

              {/* Stacked fields butt together and share their edges. */}
              <div
                className={`relative z-10 col-span-full row-start-5 max-w-[330px] flex-col [&>*+*]:border-t-0 ${
                  archived ? 'hidden' : 'flex'
                }`}
              >
                <span className={FIELD}>
                  <Icon
                    name="link"
                    className="size-3.5 shrink-0 text-forest-500"
                  />
                  <span className="flex-1 truncate">{link}</span>
                  <CopyButton
                    value={`https://${link}`}
                    label={t('copyLinkFor', { title: event.title })}
                  />
                </span>

                {event.password ? (
                  <PasswordField password={event.password} />
                ) : null}

                {event.linkNoteKey ? (
                  <span className={FIELD_NOTE}>
                    <Icon
                      name="eyeOff"
                      className="size-3.5 shrink-0 text-neutral-700"
                    />
                    {tNotes(event.linkNoteKey)}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/*
           * Once all three fit side by side the card runs on fixed shares —
           * 1 for the preview, 2 for the details, 2 for the replies — so every
           * card in the pile lines up with the next.
           */}
          <div className="col-span-full row-start-6 mt-4 @min-[508px]:mt-0 @min-[508px]:w-full @min-[904px]:col-span-1 @min-[904px]:col-start-3 @min-[904px]:row-start-1 @min-[904px]:w-auto @min-[904px]:self-center @min-[904px]:border-l @min-[904px]:border-mustard-300 @min-[904px]:pl-[26px]">
            <dl className="mb-3 grid grid-cols-2 gap-x-5 gap-y-[9px] @2xl:grid-cols-4 @2xl:gap-1.5">
              <Tally
                label={t('replied')}
                value={event.rsvp.replied}
                detail={`/${event.rsvp.invited}`}
              />
              <Tally label={t('attending')} value={event.rsvp.attending} />
              <Tally label={t('declined')} value={event.rsvp.declined} />
              <Tally label={t('pending')} value={event.rsvp.pending} />
            </dl>

            <div
              role="img"
              aria-label={t('safeguardAria', {
                attending: event.rsvp.attending,
                declined: event.rsvp.declined,
                cap,
              })}
              className="safeguard"
              style={barVars}
            >
              <span aria-hidden="true" className="attending" />
              <span aria-hidden="true" className="declined" />
            </div>

            <p className="mt-[7px] text-[11.5px] text-neutral-700">
              {/* Roomy only while the column runs the full width of the card. */}
              <span className="hidden @2xl:inline @min-[904px]:hidden">
                {t('safeguardLine', safeguardValues)}
              </span>
              <span className="@2xl:hidden @min-[904px]:inline">
                {t('safeguardShort', safeguardValues)}
              </span>
            </p>

            {event.note ? (
              event.note.tone === 'warning' ? (
                <div className="mt-[18px] flex gap-[9px] border border-rust-400 bg-rust-200 px-[13px] py-[11px] text-[12.5px] leading-[1.45] text-rust-600">
                  <Icon name="alert" className="mt-px size-[15px] shrink-0" />
                  <p>{tNotes(event.note.key, event.note.values)}</p>
                </div>
              ) : (
                <p className="mt-[18px] border-l-[3px] border-neutral-600 py-0.5 pl-3 text-[12.5px] text-neutral-700">
                  {tNotes(event.note.key, event.note.values)}
                </p>
              )
            ) : null}

            {/*
             * Who is coming, under the count of how many. These sit last so the
             * numbers and anything wrong come first.
             */}
            {event.attendeeNotes?.length ? (
              <ul className="mt-[18px] flex flex-col gap-1.5 text-[12.5px] leading-[1.45] text-neutral-700">
                {event.attendeeNotes.map((note) => (
                  <li key={note.key} className="flex gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] size-1 shrink-0 rounded-full bg-mustard-400"
                    />
                    {tNotes(note.key, note.values)}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      {/*
       * The card's one destination, and the only thing on it that is clickable
       * — the arrow answers this bar alone, not the card around it. It leads to
       * the event's row on the events page, where all six of its actions are,
       * so it promises the whole set rather than any one of them. The page
       * arrives narrowed to that one event.
       */}
      <Link
        href={`/dashboard/events?event=${event.id}#focus`}
        className="group/bar flex items-center justify-center gap-2 border-t border-mustard-300 px-4 py-3 text-[11px] font-semibold tracking-[0.16em] text-mustard-600 bg-mustard-200/70 uppercase transition-colors hover:bg-mustard-300/50"
      >
        {t('manageEvent')}
        <span className="sr-only">: {event.title}</span>
        <Icon
          name="arrowRight"
          className="size-3.5 transition-transform group-hover/bar:translate-x-0.5"
        />
      </Link>
    </article>
  )
}
