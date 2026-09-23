import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Icon } from '@/components/icons'
import { NavLink } from '@/components/dashboard/NavLink'
import { NAV_SECTIONS } from '@/mock/dashboard'

export function SideNav() {
  const t = useTranslations('Nav')

  return (
    <nav
      aria-label={t('aria')}
      className="flex h-full flex-col bg-mustard-100 pb-4 text-neutral-900"
    >
      <div className="min-h-0 flex-1 overflow-y-auto pt-[22px] pb-3">
        {NAV_SECTIONS.map((section) => (
          <div key={section.labelKey} className="pb-[22px] last:pb-0">
            <h2 className="px-6 pb-2 text-[10px] font-semibold tracking-[0.18em] text-mustard-500 uppercase">
              {t(section.labelKey)}
            </h2>
            <ul>
              {section.items.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Link
        href="/"
        className="mx-4 flex items-center justify-center gap-3 rounded-[10px] bg-mustard-500 px-4 py-[13px] font-semibold text-neutral-950 transition-colors hover:bg-mustard-400"
      >
        <Icon name="arrowUpRight" className="size-[17px] shrink-0" />
        <span>{t('quit')}</span>
      </Link>
    </nav>
  )
}
