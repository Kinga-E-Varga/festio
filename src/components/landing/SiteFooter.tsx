import { useTranslations } from "next-intl";
import { Icon } from "@/components/icons";
import { LanguageSwitcher } from "@/components/dashboard/LanguageSwitcher";
import { FOOTER_COLUMNS } from "@/mock/dashboard";

export function SiteFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-secondary-400 text-neutral-950">
      <div className="mx-auto grid max-w-app grid-cols-2 gap-7 px-[18px] pt-8 pb-[26px] nav:grid-cols-[repeat(3,1fr)_1.2fr] nav:gap-10 nav:px-8 nav:pt-11 nav:pb-[34px]">
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.labelKey}>
            <h2 className="mb-3.5 label-caps">{t(column.labelKey)}</h2>
            <ul className="space-y-[9px]">
              {column.linkKeys.map((key) => (
                <li key={key}>
                  <a
                    href="#"
                    className="text-[12.5px] text-primary-900 transition-colors hover:text-secondary-700"
                  >
                    {t(key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex flex-col items-center justify-center">
          {/* One-colour artwork as a mask, filled with the top bar's primary. */}
          <span
            role="img"
            aria-label="Festio"
            className="mb-[18px] block size-[76px] bg-primary-900 mask-[url(/festio-icon-monochrome.svg)] mask-contain mask-center mask-no-repeat"
          />
          <form role="search" className="w-full max-w-[260px]">
            <label htmlFor="footer-search" className="sr-only">
              {t("search")}
            </label>
            <div className="flex h-input items-center gap-2 rounded-ui border border-secondary-500 bg-neutral-100 px-2.5 transition-colors focus-within:border-primary-900">
              <Icon
                name="search"
                className="size-4 shrink-0 text-neutral-800"
              />
              <input
                id="footer-search"
                type="search"
                placeholder={t("search")}
                className="w-full bg-transparent text-[11.5px] text-neutral-950 placeholder:text-neutral-800 focus:outline-none"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 border-t border-secondary-500 px-[18px] py-4 text-[11.5px] text-neutral-900 nav:flex-nowrap nav:px-8">
        <p className="order-3 flex-1 basis-full text-center nav:order-none nav:basis-auto">
          {t("copyright", { year: "2026" })}
        </p>
        <LanguageSwitcher />
      </div>
    </footer>
  );
}
