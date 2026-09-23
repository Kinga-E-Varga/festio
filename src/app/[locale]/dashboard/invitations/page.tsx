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

export const metadata: Metadata = {
  title: 'Invitations · Festio',
}

const ALL: EventStatus[] = ['active', 'draft', 'past']

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

  const count = (status: EventStatus) =>
    EVENTS.filter((event) => event.status === status).length

  const tabs: EventTab[] = [
    {
      id: 'all',
      label: t('tabAll'),
      count: EVENTS.length,
      panel: (
        <InvitationGroups
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
        <InvitationGroups
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
        <InvitationGroups
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
        <InvitationGroups
          events={EVENTS}
          statuses={['past']}
          emptyMessage={t('emptyPast')}
        />
      ),
    },
  ]

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
        label="Invitation status"
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
