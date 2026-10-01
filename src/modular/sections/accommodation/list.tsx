import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { list, safeLink, text } from "@/modular/content";
import { HEADING, PAD } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/* One grid for the header and every row, so the columns line up. */
const COLUMNS = "@3xl:grid-cols-[2fr_1.3fr_1fr_1.2fr_100px]";

/**
 * Compact rows, no photos. On a phone each row stacks and every cell names
 * itself; on a wide page the header names the columns and the cell labels
 * stay for screen readers only.
 */
export function Variant({ values }: VariantProps) {
  const t = useTranslations("Sections");

  return (
    <div
      className={`flex flex-col gap-6 bg-[var(--m1)] ${PAD} @5xl:px-[120px]`}
    >
      <h2
        className={`${HEADING} text-[28px] text-[color:var(--m8)] @3xl:text-[34px]`}
      >
        {text(values, "heading")}
      </h2>
      <div>
        <div
          aria-hidden="true"
          className={`hidden gap-5 pb-2.5 text-[11px] tracking-[0.18em] uppercase text-[color:var(--m10)] @3xl:grid ${COLUMNS}`}
        >
          <span>{t("place")}</span>
          <span>{t("distance")}</span>
          <span>{t("price")}</span>
          <span>{t("heldUntil")}</span>
          <span />
        </div>
        <ul className="flex flex-col border-b-1 border-[var(--m5)]">
          {list(values, "places").map((place, index) => {
            const link = safeLink(place.link);
            return (
              <li
                key={index}
                className={`grid gap-x-5 gap-y-1 border-t-1 border-[var(--m5)] py-3.5 text-[15px] @3xl:items-center ${COLUMNS}`}
              >
                <span className="font-semibold text-[color:var(--m8)]">
                  {place.name}
                </span>
                <Cell label={t("distance")}>{place.distance}</Cell>
                <Cell label={t("price")}>{place.price}</Cell>
                <Cell label={t("heldUntil")}>{place.until || "—"}</Cell>
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-[14px] font-semibold text-[color:var(--m13)] underline-offset-4 hover:underline"
                  >
                    {t("website")}
                  </a>
                ) : (
                  <span />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="text-[color:var(--m9)]">
      <span className="text-[color:var(--m10)] @3xl:sr-only">{label}: </span>
      {children}
    </span>
  );
}
