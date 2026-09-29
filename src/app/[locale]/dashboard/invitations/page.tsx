import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CentreOnHash } from '@/components/dashboard/CentreOnHash'
import { HostToday } from '@/components/dashboard/HostToday'
import { EventTabs, type EventTab } from '@/components/dashboard/EventTabs'
import { FocusView } from '@/components/dashboard/FocusView'
import { InvitationCard } from '@/components/dashboard/InvitationCard'
import { InvitationGroups } from '@/components/dashboard/InvitationGroups'
import { EVENTS, findEvent } from '@/mock/dashboard'
import type { EventStatus } from '@/types/dashboard'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Meta')
  return { title: t('invitations') }
}

/** One tab per pile: which statuses it holds and the texts it shows. */
const PILES = [
  { id: 'all', statuses: ['active', 'draft', 'past'], label: 'tabAll', empty: 'emptyAll' },
  { id: 'active', statuses: ['active'], label: 'tabActive', empty: 'emptyActive' },
  { id: 'drafts', statuses: ['draft'], label: 'tabDrafts', empty: 'emptyDrafts' },
  { id: 'past', statuses: ['past'], label: 'tabPast', empty: 'emptyPast' },
] as const satisfies readonly {
  id: string
  statuses: readonly EventStatus[]
  label: string
  empty: string
}[]

export default async function InvitationsPage({
  searchParams,
}: PageProps<'/[locale]/dashboard/invitations'>) {
  /*
   * `?event=` is how another page hands one invitation over — the events list
   * does, from its own Edit invitation. An id that matches nothing is simply
   * the whole list, which is what the address without the query already is.
   */
  const t = await getTranslations('Invitations')
  const { event: requested } = await searchParams
  const focused =
    typeof requested === 'string' ? findEvent(requested) : undefined

  const tabs: EventTab[] = PILES.map((pile) => {
    const statuses: EventStatus[] = [...pile.statuses]
    return {
      id: pile.id,
      label: t(pile.label),
      count: EVENTS.filter((event) => statuses.includes(event.status)).length,
      panel: (
        <InvitationGroups
          events={EVENTS}
          statuses={statuses}
          emptyMessage={t(pile.empty)}
        />
      ),
    }
  })

  return (
    <div className="@container">
      {/* Arriving from an event, on that invitation rather than at the top. */}
      <CentreOnHash />

      {/* No action lives up here, so the title block simply owns the row. */}
      <header className="min-w-0">
        <HostToday />
        <h1 className="mt-1.5 font-serif text-[34px] leading-[1.05] text-neutral-900 @min-[720px]:text-[46px]">
          {t('title')}
        </h1>
      </header>

      <p className="mt-3.5 mb-[26px] text-neutral-700">{t('lede')}</p>

      <EventTabs
        tabs={tabs}
        label={t('tabsLabel')}
        // Arriving on one invitation, no pile is the one being looked at.
        initialId={focused ? null : undefined}
        fallback={
          focused ? (
            <FocusView
              note={t('focusNote')}
              href="/dashboard/invitations"
              linkLabel={t('focusLink')}
            >
              {/*
               * Held to the width it would have had in the grid: the artwork
               * is a fixed A4 slot, so a card given the whole row would stand
               * a screen and a half tall.
               */}
              <div className="mx-auto max-w-[500px]">
                <InvitationCard event={focused} />
              </div>
            </FocusView>
          ) : null
        }
      />
    </div>
  )
}
