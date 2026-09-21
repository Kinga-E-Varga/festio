'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { trackHistoryEntry } from '@/lib/history'

/**
 * Renders nothing; it only keeps the depth in `lib/history` honest. It sits in
 * the root layout because it has to see every navigation in the app, not the
 * ones one page happens to make.
 *
 * `usePathname` alone, not `useSearchParams` — the latter would need a Suspense
 * boundary around the whole tree, and a query-only push it would have caught is
 * still an entry this app created, so missing it can only undercount by one.
 */
export function HistoryTracker() {
  const pathname = usePathname()

  useEffect(() => {
    trackHistoryEntry()
  }, [pathname])

  return null
}
