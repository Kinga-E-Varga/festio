import type { Metadata } from 'next'
import { EventList } from '@/components/dashboard/EventList'
import { StatStrip } from '@/components/dashboard/StatStrip'
import { Icon } from '@/components/icons'
import { orderEvents } from '@/lib/event'
import { EVENTS, HOST } from '@/mock/dashboard'

export const metadata: Metadata = {
  title: 'Dashboard · Festio',
}

export default function DashboardPage() {
  const active = orderEvents(
    EVENTS.filter((event) => event.status === 'active'),
    'active',
  )

  return (
    <div className="@container">
      {/*
       * The greeting and the one thing a host starts from share a row, and the
       * action drops under the greeting rather than shrinking to a bare plus —
       * "New event" is the whole point of the page and has to stay readable.
       */}
      <header className="flex flex-wrap items-start gap-x-6 gap-y-4 @min-[520px]:items-center">
        <div className="min-w-0 flex-1 @max-[520px]:basis-full">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-forest-500 uppercase">
            {HOST.todayLabel}
          </p>
          <h1 className="mt-1.5 font-serif text-[34px] leading-[1.05] text-neutral-900 nav:text-[46px]">
            {HOST.greeting}
          </h1>
        </div>

        <button
          type="button"
          className="flex shrink-0 items-center gap-2 rounded-md border border-forest-500 bg-forest-500 px-4 py-2.5 font-medium text-neutral-50 transition-colors hover:border-forest-600 hover:bg-forest-600"
        >
          <Icon name="plus" className="size-[18px]" strokeWidth={2} />
          Add event
        </button>
      </header>

      <div className="mt-[26px]">
        <StatStrip />
      </div>

      <section>
        <h2 className="mt-[34px] mb-[18px] flex items-center gap-[18px] font-serif text-xl tracking-[0.14em] text-neutral-900 uppercase">
          Active events
          <span aria-hidden="true" className="h-px flex-1 bg-forest-500" />
        </h2>

        <EventList
          events={active}
          emptyMessage="Nothing live yet. Pick a template to start your first invitation."
        />
      </section>
    </div>
  )
}
