import { useTranslations } from "next-intl";
import {
  openHref,
  type EventPageLink,
} from "@/components/dashboard/event-nav/pages";
import { LINK_TEXT } from "@/components/dashboard/styles";
import { Icon } from "@/components/icons";
import { Link } from "@/i18n/navigation";

/** A link that can't be opened: greyed, its reason on hover, as in the nav. */
const OFF = "meta-face cursor-not-allowed font-semibold text-neutral-500";

interface PageLinkProps {
  page: EventPageLink | undefined;
  label: string;
  /** Where it sits, e.g. Edit on the picture's corner. */
  className?: string;
  /** A fuller name, read out and shown on hover, where the label is short (Edit). */
  hint?: string;
}

/**
 * One of the event's pages as a text link: the guest page in a tab of its
 * own, with its arrow; greyed, with the nav's reason, when it can't be opened.
 */
export function PageLink({ page, label, className = "", hint }: PageLinkProps) {
  const t = useTranslations();
  const href = openHref(page);

  if (!href) {
    return (
      <span
        aria-disabled="true"
        aria-label={hint}
        title={page?.disabledKey ? t(page.disabledKey) : undefined}
        className={`${className} ${OFF}`}
      >
        {label}
      </span>
    );
  }

  return page?.external ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={hint}
      title={hint}
      className={`${className} inline-flex items-center gap-1 ${LINK_TEXT}`}
    >
      {label}
      <Icon name="arrowUpRight" className="size-3.5" strokeWidth={2} />
    </a>
  ) : (
    <Link
      href={href}
      aria-label={hint}
      title={hint}
      className={`${className} ${LINK_TEXT}`}
    >
      {label}
    </Link>
  );
}
