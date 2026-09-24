import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { CopyButton } from '@/components/dashboard/CopyButton'
import { RULE } from '@/components/dashboard/EventRow'
import { PasswordField } from '@/components/dashboard/PasswordField'
import { Icon } from '@/components/icons'
import {
  formatDay,
  formatDeadline,
  formatRelative,
  expectedLevel,
  expectedPercent,
  invitationLink,
  replyClose,
  replyWindow,
  repliesBarVars,
  repliesPaused,
  type ExpectedLevel,
} from '@/lib/event'
import type { DashboardEvent, IconName } from '@/types/dashboard'

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
function warningsFor(
  event: DashboardEvent,
  percent: number,
  level: ExpectedLevel,
) {
  const warnings: Warning[] = []

  if (!event.paid) {
    warnings.push({ icon: 'alert', key: 'paymentPending' })
  }

  if (event.locked) {
    warnings.push({ icon: 'lock', key: 'editingClosed' })
  } else if (event.isNextUp && event.locksIn) {
    warnings.push({ icon: 'clock', key: 'editLocksSoon' })
  }

  /* Replies well short of expected guests are not news. */
  if (event.rsvp.replied > event.expectedGuests) {
    warnings.push({ icon: 'guests', key: 'overExpected' })
  } else if (event.rsvp.replied > 0 && level !== 'ok') {
    warnings.push({
      icon: 'guests',
      key: 'expectedAt',
      values: { percent },
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
    // Four in a row, value under label, whenever the replies are wide enough;
    // narrower, label-left / value-right rows instead.
    <div className="flex items-baseline justify-between gap-2.5 @min-[436px]:block">
      <dt className="text-[10px] tracking-[0.1em] text-neutral-700 uppercase">
        {label}
      </dt>
      <dd className="font-serif text-[25px] leading-none text-neutral-900 tabular-nums @min-[436px]:mt-1">
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
  const expected = event.expectedGuests
  const replied = event.rsvp.replied
  const percent = expectedPercent(replied, expected)
  const level = expectedLevel(percent)
  const barVars = repliesBarVars(event)
  const paused = repliesPaused(event)
  const t = useTranslations('Event')
  const tNotes = useTranslations('EventNotes')
  const tBanner = useTranslations('EventPage')
  const warnings = warningsFor(event, percent, level)
  const locale = useLocale()
  const replyCloses = formatDeadline(replyClose(event), locale)
  const replies = replyWindow(event)
  const expectedValues = { replied, expected, percent }

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
         * with the 164 preview and 18 of padding either side of both it and
         * the details the card has to be 522 wide; under that the sections
         * stack instead: the date and title lead, the preview follows — capped
         * at 180 so it does not swallow the card on a phone — then the rest of
         * the details and the replies, each section under a rule of its own.
         *
         * As on the events page, the card itself is unpadded: each section
         * pads itself, and the rules between them stop short of the edges.
         */}
        <div className="grid grid-cols-1 @min-[522px]:flex @min-[522px]:flex-wrap @min-[904px]:grid @min-[904px]:grid-cols-[minmax(0,0.9fr)_minmax(0,2.2fr)_minmax(0,1.9fr)]">
          <div className="contents @min-[522px]:flex @min-[522px]:w-full @min-[522px]:min-w-0 @min-[904px]:contents">
            <div
              className={`col-start-1 row-start-2 flex justify-center p-[18px] ${RULE} @min-[522px]:shrink-0 @min-[522px]:py-8 @min-[522px]:items-center @min-[522px]:before:hidden @min-[904px]:row-start-1 @min-[904px]:p-5 @min-[904px]:py-10`}
            >
              <div className="w-full max-w-[180px] border border-mustard-300 bg-neutral-50 @min-[522px]:w-[164px] @min-[904px]:w-full @min-[904px]:max-w-[220px]">
                <Image
                  src={event.preview}
                  alt={t('previewAlt', { title: event.title })}
                  sizes="300px"
                  className="h-auto w-full"
                />
              </div>
            </div>

            {/*
             * Stacked, the details split around the preview: the date and
             * title are a section of their own above it, the rest a section
             * below it. So down there the details are no box of their own —
             * only once the preview moves beside them.
             */}
            <div
              className={`contents ${RULE} before:hidden @min-[522px]:block @min-[522px]:min-w-0 @min-[522px]:flex-1 @min-[522px]:p-[18px] @min-[522px]:py-8 @min-[522px]:after:block @min-[904px]:col-start-2 @min-[904px]:row-start-1 @min-[904px]:flex @min-[904px]:flex-col @min-[904px]:justify-center @min-[904px]:p-5 @min-[904px]:py-10`}
            >
              <div className="row-start-1 px-[18px] py-8 @min-[522px]:p-0">
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

                {/* Three lines stacked, two once the preview sits beside it. */}
                <h3 className="line-clamp-3 font-serif text-[20px] leading-[1.2] text-neutral-900 transition-colors group-hover:text-forest-600 @min-[522px]:mb-[18px] @min-[522px]:line-clamp-2 @2xl:text-2xl">
                  {event.title}
                </h3>
              </div>

              {archived ? null : (
                <div
                  className={`row-start-3 px-[18px] py-8 ${RULE} @min-[522px]:p-0 @min-[522px]:before:hidden`}
                >
                  {warnings.length > 0 ? (
                    <div className="mb-[18px] flex flex-wrap items-center gap-2">
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

                  {/* Closing soon or closed reads in the countdown's own colour. */}
                  <p
                    className={`mb-[18px] flex items-center gap-1.5 text-[12.5px] ${
                      replies === 'open'
                        ? 'text-neutral-700'
                        : 'font-medium text-terracotta-600'
                    }`}
                  >
                    <Icon
                      name="calendar"
                      className={`size-3.5 shrink-0 ${
                        replies === 'open'
                          ? 'text-forest-500'
                          : 'text-terracotta-600'
                      }`}
                    />
                    {t(
                      replies === 'closed'
                        ? 'repliesClosedOn'
                        : 'replyFormClosesOn',
                      { date: replyCloses },
                    )}
                  </p>

                  {/* Stacked fields butt together and share their edges. */}
                  <div className="relative z-10 flex max-w-[330px] flex-col [&>*+*]:border-t-0">
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
              )}
            </div>
          </div>

          {/*
           * Once all three fit side by side the card runs on fixed shares —
           * 0.9 for the preview, 2.2 for the details, 1.9 for the replies — so every
           * card in the pile lines up with the next.
           *
           * The replies are a container of their own: the tallies and the
           * expected-guests line follow the room the replies actually have, not the
           * card's layout.
           */}
          <div
            className={`row-start-4 p-[18px] py-8 ${RULE} @min-[522px]:w-full @min-[904px]:col-span-1 @min-[904px]:col-start-3 @min-[904px]:row-start-1 @min-[904px]:flex @min-[904px]:w-auto @min-[904px]:flex-col @min-[904px]:justify-center @min-[904px]:p-5 @min-[904px]:py-10 @min-[904px]:before:hidden @min-[904px]:after:block`}
          >
            {/* The container sits inside, not on the section: the section's own
             * rules have to keep answering to the card. */}
            <div className="@container">
              {/*
               * 436 = four of the widest tally (Hungarian "Nem vesz részt", 100px)
               * plus three 12px gaps. Re-measure if a label gets longer.
               */}
              <dl className="mb-3 grid grid-cols-2 gap-x-5 gap-y-[9px] @min-[436px]:grid-cols-4 @min-[436px]:gap-x-3">
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
                aria-label={t('barAria', {
                  attending: event.rsvp.attending,
                  declined: event.rsvp.declined,
                  expected,
                })}
                className="replies-bar"
                data-level={level}
                style={barVars}
              >
                <span aria-hidden="true" className="attending" />
                <span aria-hidden="true" className="declined" />
              </div>

              <p className="mt-[7px] text-[11.5px] text-neutral-700">
                {/* Roomy only while the tallies have room for a single row. */}
                <span className="hidden @min-[436px]:inline">
                  {t('expectedLine', expectedValues)}
                </span>
                <span className="@min-[436px]:hidden">
                  {t('expectedShort', expectedValues)}
                </span>
              </p>

              {paused ? (
                <div className="mt-[18px] flex gap-[9px] border border-rust-400 bg-rust-200 px-[13px] py-[11px] text-[12.5px] leading-[1.45] text-rust-600">
                  <Icon name="alert" className="mt-px size-[15px] shrink-0" />
                  {/* The editor banner's own words, so every place reads alike. */}
                  <p>
                    <b className="block">{tBanner('pausedTitle')}</b>
                    {tBanner('pausedBody')}
                  </p>
                </div>
              ) : null}

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
