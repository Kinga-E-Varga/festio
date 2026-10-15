import type { ReactNode } from "react";
import { noticeHref } from "@/components/dashboard/notices";
import { Link } from "@/i18n/navigation";
import type { AttentionNotice } from "@/types/dashboard";

/**
 * A notice's action: a link to its page, or a plain button while it has none
 * yet (paying, exporting).
 */
export function NoticeAction({
  notice,
  className,
  children,
}: {
  notice: AttentionNotice;
  className: string;
  children: ReactNode;
}) {
  const href = noticeHref(notice);

  return href ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <button type="button" className={className}>
      {children}
    </button>
  );
}
