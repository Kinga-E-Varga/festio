import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { safeLink } from "./content";

/**
 * "Open in Maps" as a plain link to the place the host pasted, never a
 * search built from the address, which a typo could send anywhere. Nothing
 * without one. No map is embedded, so nothing reaches a map provider before
 * the guest taps this.
 */
export function MapsLink({
  href,
  className,
  children,
}: {
  /** The host's maps link; anything but a web address is dropped. */
  href: string | undefined;
  className: string;
  /** Drawn after the words — an arrow, say. */
  children?: ReactNode;
}) {
  const t = useTranslations("Sections");
  const link = safeLink(href);
  if (!link) return null;
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {t("openInMaps")}
      {children}
    </a>
  );
}
