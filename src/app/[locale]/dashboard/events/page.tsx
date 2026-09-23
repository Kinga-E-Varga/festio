import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CentreOnHash } from '@/components/dashboard/CentreOnHash'
import { HostToday } from '@/components/dashboard/HostToday'
import { EventGroups } from '@/components/dashboard/EventGroups'
import { EventRow } from '@/components/dashboard/EventRow'
import { EventTabs, type EventTab } from '@/components/dashboard/EventTabs'
import { FocusView } from '@/components/dashboard/FocusView'
import { Icon } from '@/components/icons'
import { EVENTS, findEvent } from '@/mock/dashboard'
import type { EventStatus } from '@/types/dashboard'

export const metadata: Metadata = {
  title: 'Events · Festio',
}

const ALL: EventStatus[] = ['active', 'draft', 'past']

export default async function EventsPage({
  searchParams,
}: PageProps<'/[locale]/dashboard/events'>) {
  /*
   * `?event=` is how another page hands one event over — the dashboard's own
   * cards do, from Manage this event. An id that matches nothing is simply
   * the whole list, which is what the address without the query already is.
   */
  const t = await getTranslations('Events')
  const { event: requested } = await searchParams
  const focused =
    typeof requested === 'string' ? findEvent(requested) : undefined

  const count = (status: EventStatus) =>
    EVENTS.filter((event) => event.status === status).length

  const tabs: EventTab[] = [
    {
      id: 'all',
      label: t('tabAll'),
      count: EVENTS.length,
      panel: (
        <EventGroups
          events={EVENTS}
          statuses={ALL}
          emptyMessage={t('emptyAll')}
        />
      ),
    },
    {
      id: 'active',
      label: t('tabActive'),
      count: count('active'),
      panel: (
        <EventGroups
          events={EVENTS}
          statuses={['active']}
          emptyMessage={t('emptyActive')}
        />
      ),
    },
    {
      id: 'drafts',
      label: t('tabDrafts'),
      count: count('draft'),
      panel: (
        <EventGroups
          events={EVENTS}
          statuses={['draft']}
          emptyMessage={t('emptyDrafts')}
        />
      ),
    },
    {
      id: 'past',
      label: t('tabPast'),
      count: count('past'),
      panel: (
        <EventGroups
          events={EVENTS}
          statuses={['past']}
          emptyMessage={t('emptyPast')}
        />
      ),
    },
  ]

  return (
    <div className="@container">
      {/* Arriving from a dashboard card, on that card rather than under the bar. */}
      <CentreOnHash />

      {/* The title block and the one primary action share a row. */}
      <header className="flex items-center gap-6">
        <div className="min-w-0 flex-1">
          <HostToday />
          <h1 className="mt-1.5 font-serif text-[34px] leading-[1.05] text-neutral-900 @min-[720px]:text-[46px]">
            {t('title')}
          </h1>
        </div>

        {/* Below 560 the label goes and the plus stands on its own. */}
        <button
          type="button"
          aria-label={t('newEvent')}
          className="flex shrink-0 items-center gap-2 rounded-md border border-forest-500 bg-forest-500 px-4 py-2.5 font-medium text-neutral-50 transition-colors hover:border-forest-600 hover:bg-forest-600 @max-[560px]:gap-0 @max-[560px]:p-[11px]"
        >
          <Icon name="plus" className="size-[18px]" strokeWidth={2} />
          <span className="@max-[560px]:hidden">{t('newEvent')}</span>
        </button>
      </header>

      <p className="mt-3.5 mb-[26px] text-neutral-700">{t('lede')}</p>

      <EventTabs
        tabs={tabs}
        label={t('tabsLabel')}
        // Arriving on one event, no pile is the one being looked at.
        initialId={focused ? null : undefined}
        fallback={
          focused ? (
            <FocusView
              note={t('focusNote')}
              href="/dashboard/events"
              linkLabel={t('focusLink')}
            >
              <EventRow event={focused} />
            </FocusView>
          ) : null
        }
      />
    </div>
  )
}
