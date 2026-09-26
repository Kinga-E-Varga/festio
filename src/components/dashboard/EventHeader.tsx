import { getLocale } from 'next-intl/server'
import type { ReactNode } from 'react'
import { BackButton } from '@/components/dashboard/BackButton'
import { formatDay, formatRelative } from '@/lib/event'
import type { DashboardEvent } from '@/types/dashboard'

interface EventHeaderProps {
  event: DashboardEvent
  /** The page's one action, beside the title — it drops under it when there's no room. */
  action?: ReactNode
}

/** The way back, the event's name and when it is — every event page opens so. */
export async function EventHeader({ event, action }: EventHeaderProps) {
  const locale = await getLocale()

  return (
    <>
      {/* The way back doubles as the page's eyebrow. */}
      <BackButton />

      {/* Laid out like the dashboard's greeting and its "New event". */}
      <div className="mt-[18px] mb-3 flex flex-wrap items-start gap-x-6 gap-y-4 @min-[520px]:items-center">
        <div className="min-w-0 flex-1 @max-[520px]:basis-full">
          <h1 className="font-serif text-[29px] leading-[1.08] text-balance text-neutral-900 @min-[720px]:text-[38px]">
            {event.title}
          </h1>

          {/* When it is, said the way the events list says it. */}
          <p className="mt-2.5 text-[14px] leading-none text-neutral-900">
            <span className="font-medium">{formatDay(event.date, locale)}</span>
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
        </div>
        {action}
      </div>
    </>
  )
}
