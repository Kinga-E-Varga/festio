import { useTranslations } from "next-intl";
import { CopyButton } from "@/components/dashboard/CopyButton";
import { PasswordField } from "@/components/dashboard/PasswordField";
import { invitationLink } from "@/lib/event";
import type { DashboardEvent } from "@/types/dashboard";

/**
 * One plain line each: a label, then the value and its buttons. The lines
 * share the stack's columns, so both values start at the same point.
 */
export const SHARE_LINE =
  "col-span-2 grid grid-cols-subgrid items-center text-[14px] text-neutral-950";
export const SHARE_VALUE = "flex min-w-0 items-center gap-2";
export const SHARE_LABEL = "shrink-0 text-neutral-800";

/**
 * How a guest reaches the event: the link with its copy button, the password
 * on the next line when it is Protected.
 */
export function ShareFields({
  event,
  className,
}: {
  event: DashboardEvent;
  /** Width and stacking for the stack, which each card sets its own way. */
  className: string;
}) {
  const t = useTranslations("Event");
  const link = invitationLink(event);

  return (
    <div
      className={`grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-1.5 ${className}`}
    >
      <p className={SHARE_LINE}>
        <span className={SHARE_LABEL}>{t("linkLabel")}:</span>
        <span className={SHARE_VALUE}>
          <span className="min-w-0 truncate">{link}</span>
          <CopyButton
            value={`https://${link}`}
            label={t("copyLinkFor", { title: event.title })}
            tone="text-neutral-600 hover:text-primary-800"
            copiedLabel={t("linkCopied")}
          />
        </span>
      </p>

      {event.password ? <PasswordField password={event.password} /> : null}
    </div>
  );
}
