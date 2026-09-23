import { createNavigation } from 'next-intl/navigation'
import { routing } from '@/i18n/routing'

/** Locale-aware replacements for next/link and next/navigation, used by every host-app route under `[locale]`. */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
