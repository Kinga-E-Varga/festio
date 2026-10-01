import { useTranslations } from "next-intl";

/**
 * "Open in Maps" as a plain link. No map is embedded, so nothing reaches
 * Google before the guest taps this.
 */
export function MapsLink({
  query,
  className,
}: {
  query: string;
  className: string;
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
    </a>
  );
}
