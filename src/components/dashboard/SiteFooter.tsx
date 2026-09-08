import Image from "next/image";
import { Icon } from "@/components/icons";
import { FOOTER_COLUMNS } from "@/mock/dashboard";

export function SiteFooter() {
  return (
    <footer className="bg-neutral-900 text-neutral-50">
      <div className="mx-auto grid max-w-[1560px] grid-cols-2 gap-7 px-[18px] pt-8 pb-[26px] nav:grid-cols-[repeat(3,1fr)_1.2fr] nav:gap-10 nav:px-8 nav:pt-11 nav:pb-[34px]">
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.label}>
            <h2 className="mb-3.5 text-[10px] font-semibold tracking-[0.18em] text-neutral-600 uppercase">
              {column.label}
            </h2>
            <ul className="space-y-[9px]">
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[13px] text-neutral-300 transition-colors hover:text-mustard-500"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex flex-col items-center justify-center">
          <Image
            src="/festio-icon-colour.svg"
            alt="Festio"
            width={92}
            height={92}
            className="mb-[18px] h-[76px] w-auto"
          />
          <form role="search" className="w-full max-w-[260px]">
            <label htmlFor="footer-search" className="sr-only">
              Search Festio
            </label>
            <div className="flex items-center gap-2 border border-neutral-300/25 bg-neutral-50/5 px-2.5 py-[7px] transition-colors focus-within:border-neutral-300/60">
              <Icon
                name="search"
                className="size-4 shrink-0 text-neutral-300/55"
              />
              <input
                id="footer-search"
                type="search"
                placeholder="Search Festio"
                className="w-full bg-transparent text-xs placeholder:text-neutral-300/55 focus:outline-none"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 border-t border-neutral-300/15 px-[18px] py-4 text-xs text-neutral-300/60 nav:flex-nowrap nav:px-8">
        <p className="order-3 flex-1 basis-full text-center nav:order-none nav:basis-auto">
          © 2026 Festio
        </p>
        <div
          role="group"
          aria-label="Language"
          className="flex border border-neutral-300/25 text-[11px] tracking-[0.06em]"
        >
          <button
            type="button"
            aria-pressed="true"
            className="bg-neutral-50 px-2.5 py-1 font-semibold text-neutral-900"
          >
            RO
          </button>
          <button
            type="button"
            aria-pressed="false"
            className="px-2.5 py-1 text-neutral-300/70 transition-colors hover:text-neutral-50"
          >
            EN
          </button>
        </div>
      </div>
    </footer>
  );
}
