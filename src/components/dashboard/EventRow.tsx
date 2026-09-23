import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { CopyButton } from '@/components/dashboard/CopyButton'
import { DatesThatMatter } from '@/components/dashboard/DatesThatMatter'
import { PasswordField } from '@/components/dashboard/PasswordField'
import { Icon } from '@/components/icons'
import { GUEST_DATA_RETENTION_DAYS } from '@/lib/config'
import {
  deletionDate,
  formatDay,
  formatEventDate,
  formatRelative,
  invitationLink,
  invitationPath,
  safeguardBarVars,
  safeguardReplyPercent,
} from '@/lib/event'
import { TIERS } from '@/mock/dashboard'
import type { DashboardEvent, EventStatus } from '@/types/dashboard'

/** The card's left edge says which pile the event is in, as the dashboard's does. */
const STATUS_EDGE: Record<EventStatus, string> = {
  active: 'border-l-forest-500',
  draft: 'border-l-terracotta-500',
  past: 'border-l-neutral-600',
}

/** The quiet heading that names each section, as the event editor sets it. */
const PANEL_LABEL =
  'mb-3.5 text-[10px] font-semibold tracking-[0.18em] text-mustard-500 uppercase'

/**
 * The rule between two of the card's sections. A pseudo-element rather than a
 * border, because a border runs the whole side of the box it is on and these
 * have to stop 20px short — of the card's own edges, and of each other where a
 * vertical rule comes down to meet a horizontal one at a row boundary. The
 * card itself stays unpadded, so nothing but the rules moves.
 *
 * Each section carries both and shows one: `before` across its top while the
 * sections are stacked, `after` down its left once they sit side by side. Two
 * pseudo-elements rather than one that turns, since turning it would mean
 * taking back `top` and `h-px` inside the same breakpoint, where Tailwind's
 * property order — not the class string — settles which wins.
 */
export const RULE = `relative before:pointer-events-none before:absolute before:inset-x-5 before:top-0 before:h-px before:bg-mustard-300 before:content-[''] after:pointer-events-none after:absolute after:inset-y-5 after:left-0 after:hidden after:w-px after:bg-mustard-300 after:content-['']`

/** Every section after the first hangs off a hairline of its own. */
const PANEL = 'min-w-0 border-t border-mustard-300 pt-5'

/** The six actions share one size and fill the width of their column. */
const ACTION =
  'inline-flex w-full min-w-[135px] items-center justify-center gap-2 rounded-md border border-forest-500 bg-mustard-50 px-2.5 py-[9px] text-center text-[13px] leading-[1.3] font-medium text-forest-500 transition-colors hover:border-forest-600 hover:bg-forest-200 hover:text-forest-600 disabled:cursor-not-allowed disabled:opacity-50'

const FIELD_BASE =
  'flex items-center gap-[9px] border border-mustard-300 px-3 py-2 text-[13px] text-neutral-900'
const FIELD = `${FIELD_BASE} bg-mustard-50`
/** Stands in for the link row when there is nothing to share yet. */
const FIELD_NOTE = `${FIELD_BASE} bg-terracotta-200`

function Tally({
  label,
  value,
  detail,
}: {
  label: string
  value: number
  /** Denominator kept small so four tallies fit the row, e.g. "/124". */
  detail?: string
}) {
  return (
    <div>
      <dt className="text-[10px] tracking-[0.1em] text-neutral-700 uppercase">
        {label}
      </dt>
      <dd className="mt-[3px] font-serif text-[22px] leading-none text-neutral-900 tabular-nums">
        {value}
        {detail ? (
          <span className="font-sans text-[11.5px] text-neutral-700">
            {detail}
          </span>
        ) : null}
      </dd>
    </div>
  )
}

/**
 * One event on the events page: the artwork on the far left, everything the
 * event says about itself stacked in the middle, and everything it can be
 * taken to in a column of its own on the right. Nothing here links to
 * somewhere else that repeats it, so the card takes no hover state.
 */
export function EventRow({ event }: { event: DashboardEvent }) {
  const t = useTranslations('Event')
  const tTiers = useTranslations('Tiers')
  const tNotes = useTranslations('EventNotes')
  const locale = useLocale()
  const deletion = formatEventDate(deletionDate(event.date), locale)
  const link = invitationLink(event)
  const { cap } = event.safeguard
  const replied = event.rsvp.replied
  const safeguardPercent = safeguardReplyPercent(event)
  const barVars = safeguardBarVars(event)
  /* Past and past its retention date: the record is a stub, not a tool. */
  const archived = event.status === 'past' && event.dataDeleted
  const past = event.status === 'past'

  return (
    /*
     * The anchor the dashboard's cards aim at, held clear of the top bar so a
     * jump lands with the card's own head in view rather than under the chrome.
     */
    <article
      id={`event-${event.id}`}
      className={`@container scroll-mt-[88px] border border-mustard-300 border-l-4 bg-mustard-100 ${STATUS_EDGE[event.status]}`}
    >
      {/*
       * Three columns on a wide card, with the actions in the last of them.
       * Narrower, the actions leave that column and run as a strip along the
       * bottom of the whole card, breaking into fewer and fewer per row until
       * they are a single stack.
       */}
      <div className="grid grid-cols-1 @min-[720px]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] @min-[1000px]:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)_minmax(175px,0.6fr)]">
        {/* The artwork is the point of a record, so it is shown whole. */}
        <div className="flex items-center justify-center p-[18px] py-8 @min-[720px]:col-start-1 @min-[720px]:row-start-1 @min-[720px]:p-5 @min-[720px]:py-10">
          {/*
           * Invitations are portrait, so width alone would let a wide card
           * make the card taller than anything beside it. The height is what
           * is capped; the width follows the artwork's own proportions.
           */}
          <div className="flex w-full justify-center leading-none">
            <Image
              src={event.preview}
              alt={t('previewAlt', { title: event.title })}
              sizes="500px"
              className="h-auto max-h-[500px] w-auto max-w-full border border-mustard-300"
            />
          </div>
        </div>

        {/* What the event says about itself, section by section. */}
        <div
          className={`flex min-w-0 flex-col justify-center p-[18px] py-8 @min-[720px]:col-start-2 @min-[720px]:row-start-1 @min-[720px]:p-5 @min-[720px]:py-10 ${RULE} @min-[720px]:before:hidden @min-[720px]:after:block`}
        >
          <div className="mx-auto flex w-full max-w-[700px] flex-col gap-5">
            {/* 1 — what it is and when. */}
            <div className="min-w-0">
              <h3 className="font-serif text-[21px] leading-[1.2] text-neutral-900 @2xl:text-[23px]">
                {event.title}
              </h3>

              <p className="mt-2.5 text-[14px] leading-none text-neutral-900">
                <span className="font-medium">
                  {formatDay(event.date, locale)}
                </span>
                <span aria-hidden="true" className="text-neutral-700">
                  {' · '}
                </span>
                <span
                  className={
                    event.isNextUp
                      ? 'font-medium text-terracotta-600'
                      : 'text-neutral-700'
                  }
                >
                  {formatRelative(event.countdown, locale)}
                </span>
              </p>

              {/*
               * The edition alone. "Custom" on its own reads as a property of
               * the invitation rather than as what was bought, so it says so.
               */}
              <p className="mt-2.5 text-[13px] text-neutral-700">
                {t('edition', {
                  name: tTiers(`${TIERS[event.tier].key}.name`),
                })}
              </p>
            </div>

            {/* 2 — how a guest reaches it. */}
            {archived ? null : (
              <div className={PANEL}>
                <h4 className={PANEL_LABEL}>{t('sharing')}</h4>
                {/* Stacked fields butt together and share their edges. */}
                <div className="flex max-w-[340px] flex-col [&>*+*]:border-t-0">
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

            {/* 3 — how many have answered. */}
            {archived ? null : (
              <div className={PANEL}>
                <h4 className={PANEL_LABEL}>{t('replies')}</h4>

                {event.rsvp.invited === 0 ? (
                  <p className="text-[12.5px] leading-[1.45] text-neutral-700">
                    {t('nothingShared')}
                  </p>
                ) : (
                  <>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 @min-[400px]:grid-cols-4">
                      <Tally
                        label={t('replied')}
                        value={event.rsvp.replied}
                        detail={`/${event.rsvp.invited}`}
                      />
                      <Tally
                        label={t('attending')}
                        value={event.rsvp.attending}
                      />
                      <Tally
                        label={t('declined')}
                        value={event.rsvp.declined}
                      />
                      <Tally label={t('pending')} value={event.rsvp.pending} />
                    </dl>

                    <div
                      role="img"
                      aria-label={t('safeguardAria', {
                        attending: event.rsvp.attending,
                        declined: event.rsvp.declined,
                        cap,
                      })}
                      className="safeguard mt-3.5"
                      style={barVars}
                    >
                      <span aria-hidden="true" className="attending" />
                      <span aria-hidden="true" className="declined" />
                    </div>

                    <p className="mt-[9px] flex items-center gap-2 text-[11.5px] text-neutral-700">
                      <span className="flex-1">
                        {t('safeguardLine', {
                          replied,
                          cap,
                          percent: safeguardPercent,
                        })}
                      </span>
                      <button
                        type="button"
                        className="text-forest-500 underline underline-offset-2 transition-colors hover:text-forest-600"
                      >
                        {t('raiseCap')}
                      </button>
                    </p>
                  </>
                )}
              </div>
            )}

            {/* 4 — the deadlines that govern it. */}
            <div className={PANEL}>
              <h4 className={PANEL_LABEL}>{t('datesThatMatter')}</h4>
              {archived ? (
                <p className="text-[12.5px] leading-[1.45] text-neutral-700">
                  {t('dataDeletedOn', {
                    date: deletion,
                    days: GUEST_DATA_RETENTION_DAYS,
                  })}
                </p>
              ) : (
                <DatesThatMatter event={event} layout="row" />
              )}
            </div>
          </div>
        </div>

        {/*
         * Everything this event can be taken to: a column of its own on a wide
         * card, and a strip across the foot of the card below that. A record
         * whose guest data is gone has nothing left to act on, so it holds the
         * column empty instead — same track, no rule, so a deleted record
         * lines up with every other card rather than reflowing.
         */}
        {archived ? (
          <div
            aria-hidden="true"
            className="@min-[720px]:col-span-2 @min-[720px]:row-start-2 @min-[1000px]:col-span-1 @min-[1000px]:col-start-3 @min-[1000px]:row-start-1"
          />
        ) : (
          <div
            className={`block p-[18px] py-8 @min-[720px]:col-span-2 @min-[720px]:row-start-2 @min-[720px]:p-5 @min-[720px]:py-10 @min-[1000px]:col-span-1 @min-[1000px]:col-start-3 @min-[1000px]:row-start-1 @min-[1000px]:flex @min-[1000px]:items-center @min-[1000px]:justify-center ${RULE} @min-[1000px]:before:hidden @min-[1000px]:after:block`}
          >
            {/*
             * Six buttons, so the strip only ever runs 1, 2, 3 or 6 to a row —
             * every row stays full. Each step is the card width at which that
             * many buttons still clear 135px apiece. In its own column it is a
             * single stack, held to a readable button width.
             */}
            <div className="grid grid-cols-1 gap-3 @min-[340px]:grid-cols-2 @min-[500px]:grid-cols-3 @min-[920px]:grid-cols-6 @min-[1000px]:mx-auto @min-[1000px]:w-full @min-[1000px]:max-w-[190px] @min-[1000px]:grid-cols-1 @min-[1000px]:gap-6">
              {/* Editing closes with the event, but the record stays readable. */}
              {past ? (
                <button
                  type="button"
                  disabled
                  title={t('alreadyHappened')}
                  className={ACTION}
                >
                  <Icon name="pencil" className="size-[15px]" />
                  {t('editEvent')}
                </button>
              ) : (
                <Link href={`/dashboard/events/${event.id}`} className={ACTION}>
                  <Icon name="pencil" className="size-[15px]" />
                  {t('editEvent')}
                </Link>
              )}

              {/*
               * The invitation is managed on its own page, so this lands on
               * that event's card there rather than jumping straight into an
               * editor — what can be done to it is stated on the card. The
               * page arrives narrowed to that one invitation.
               */}
              {past ? (
                <button
                  type="button"
                  disabled
                  title={t('alreadyHappened')}
                  className={ACTION}
                >
                  <Icon name="layers" className="size-[15px]" />
                  {t('editInvitation')}
                </button>
              ) : (
                <Link
                  href={`/dashboard/invitations?event=${event.id}#focus`}
                  className={ACTION}
                >
                  <Icon name="layers" className="size-[15px]" />
                  {t('editInvitation')}
                </Link>
              )}

              {/*
               * The guest page itself, in a tab of its own so the host keeps
               * the dashboard behind it. It is drawn by the template, so an
               * invitation without one has nothing to show yet.
               */}
              {event.templateId ? (
                <a
                  href={invitationPath(event)}
                  target="_blank"
                  rel="noreferrer"
                  className={ACTION}
                >
                  <Icon name="eye" className="size-[15px]" />
                  {t('viewAsGuest')}
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  title={t('noDesign')}
                  className={ACTION}
                >
                  <Icon name="eye" className="size-[15px]" />
                  {t('viewAsGuest')}
                </button>
              )}
              <button type="button" className={ACTION}>
                <Icon name="printer" className="size-[15px]" />
                {t('print')}
              </button>
              <button type="button" className={ACTION}>
                <Icon name="guests" className="size-[15px]" />
                {t('guestList')}
              </button>
              <button
                type="button"
                disabled={!event.seatingAvailable}
                title={
                  event.seatingAvailable ? undefined : t('seatingPaidOnly')
                }
                className={ACTION}
              >
                <Icon name="seating" className="size-[15px]" />
                {t('seating')}
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
