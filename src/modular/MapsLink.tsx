import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

/**
 * "Open in Maps" as a plain link. No map is embedded, so nothing reaches
 * Google before the guest taps this.
 */
export function MapsLink({
  query,
  className,
  children,
}: {
  query: string;
  className: string;
  /** Drawn after the words — an arrow, say. */
  children?: ReactNode;
}) {
  const t = useTranslations("Sections");
  return (
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {t("openInMaps")}
      {children}
    </a>
  );
}
