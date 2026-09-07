import { Icon } from "@/components/icons";
import { FOOTER_COLUMNS } from "@/mock/dashboard";

export function SiteFooter() {
  return (
    <footer className="bg-ink-700 text-linen-100">
      <div className="grid gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,17rem)_repeat(3,minmax(0,1fr))] lg:gap-12 lg:px-8">
        <div>
          <p className="font-serif text-lg tracking-[0.28em]">FESTIO</p>
          <form role="search" className="mt-4 max-w-xs">
            <label htmlFor="footer-search" className="sr-only">
              Search Festio
            </label>
            <div className="flex items-center gap-2 rounded-md border border-linen-100/25 px-3 py-2 transition-colors focus-within:border-linen-100/60">
              <Icon name="search" className="size-4 shrink-0 text-linen-100/70" />
              <input
                id="footer-search"
                type="search"
                placeholder="Search Festio"
                className="w-full bg-transparent placeholder:text-linen-100/60 focus:outline-none"
              />
            </div>
          </form>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.label}>
            <h2 className="text-[11px] font-medium tracking-[0.14em] text-linen-100/70 uppercase">
              {column.label}
            </h2>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="underline-offset-2 transition-colors hover:text-cream-50 hover:underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-linen-100/15 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-xs text-linen-100/70">© 2026 Festio</p>
          <div
            role="group"
            aria-label="Language"
            className="flex overflow-hidden rounded-md border border-linen-100/25 text-xs"
          >
            <button
              type="button"
              aria-pressed="true"
              className="bg-linen-100/15 px-2.5 py-1 font-medium"
            >
              RO
            </button>
            <button
              type="button"
              aria-pressed="false"
              className="px-2.5 py-1 text-linen-100/70 transition-colors hover:text-cream-50"
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
