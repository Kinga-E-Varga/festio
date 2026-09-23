import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/icons";
import { invitationPath } from "@/lib/event";
import type { DashboardEvent, EventStatus } from "@/types/dashboard";

/**
 * The top edge says which pile the card is in — the events list's status
 * colours, turned onto the head of the card rather than its side.
 */
const STATUS_EDGE: Record<EventStatus, string> = {
  active: "border-t-forest-500",
  draft: "border-t-terracotta-500",
  past: "border-t-neutral-600",
};

/** One button, one size — the events list's own action, verbatim. */
const ACTION =
  "inline-flex w-full min-w-[135px] items-center justify-center gap-2 rounded-md border border-forest-500 bg-mustard-50 px-2.5 py-[9px] text-center text-[13px] leading-[1.3] font-medium text-forest-500 transition-colors hover:border-forest-600 hover:bg-forest-200 hover:text-forest-600 disabled:cursor-not-allowed disabled:opacity-50";

/**
 * One invitation: what it is and when, the artwork itself, and the handful of
 * places the host can be taken from it. The tab the card sits in already says
 * which pile it is in, so the head carries nothing else. Nothing on the card
 * links to somewhere that repeats it, so it takes no hover state.
 */
export function InvitationCard({ event }: { event: DashboardEvent }) {
  const t = useTranslations("Invitations");
  const tEvent = useTranslations("Event");
  /* Content freezes with the event; a past invitation is only downloadable. */
  const past = event.status === "past";

  return (
    <article
      className={`@container flex flex-col border border-mustard-300 border-t-4 bg-mustard-100 ${STATUS_EDGE[event.status]}`}
    >
      <div className="p-[18px]">
        {/*
         * One line, always: the cards sit in a grid, and a two-line title on
         * one of them would push its date, artwork and buttons out of step
         * with the rest of the row. The full title is on the tooltip.
         */}
        <h3
          title={event.title}
          className="truncate font-serif text-[21px] leading-[1.2] text-neutral-900"
        >
          {event.title}
        </h3>

        <p className="mt-2.5 text-[14px] leading-none text-neutral-900">
          <span className="font-medium">{event.dateLabel}</span>
          <span aria-hidden="true" className="text-neutral-700">
            {" · "}
          </span>
          <span
            className={
              event.isNextUp
                ? "font-medium text-terracotta-600"
                : "text-neutral-700"
            }
          >
            {event.countdownLabel}
          </span>
        </p>
      </div>

      {/*
       * The artwork hangs off a hairline of its own, as the actions below it
       * do. Invitations are printed on A4, so the slot is cut to that ratio
       * and every card in the row stands the same height.
       */}
      <figure className="mx-[18px] border-t border-mustard-300 pt-5">
        <div className="relative aspect-[1/1.4142] overflow-hidden border border-mustard-300 bg-mustard-50">
          <Image
            src={event.preview}
            alt={event.previewAlt}
            sizes="(min-width: 1400px) 300px, (min-width: 820px) 40vw, 90vw"
            className="h-full w-full object-cover"
          />
        </div>
      </figure>

      {/*
       * Two buttons to a row once the card is wide enough for both to clear
       * the 135px every action is held to, a single stack below that. A card
       * with one action keeps it full width rather than half a row.
       */}
      <div
        className={`mx-[18px] mt-[18px] grid gap-3 border-t border-mustard-300 pt-5 pb-[18px] ${
          past ? "grid-cols-1" : "grid-cols-1 @min-[340px]:grid-cols-2"
        }`}
      >
        {past ? (
          <button type="button" className={ACTION}>
            <Icon name="download" className="size-[15px]" />
            {t("downloadCard")}
          </button>
        ) : (
          <>
            {/* The wording lives in the invitation editor, which needs a design. */}
            {event.templateId ? (
              <Link href={`/invitations/${event.id}`} className={ACTION}>
                <Icon name="pencil" className="size-[15px]" />
                {t("editDetails")}
              </Link>
            ) : (
              <button
                type="button"
                disabled
                title={tEvent("noDesign")}
                className={ACTION}
              >
                <Icon name="pencil" className="size-[15px]" />
                {t("editDetails")}
              </button>
            )}

            <button type="button" className={ACTION}>
              <Icon name="layers" className="size-[15px]" />
              {t("editDesign")}
            </button>
            {/* The guest page itself, in a tab of its own. */}
            {event.templateId ? (
              <a
                href={invitationPath(event)}
                target="_blank"
                rel="noreferrer"
                className={ACTION}
              >
                <Icon name="eye" className="size-[15px]" />
                {tEvent("viewAsGuest")}
              </a>
            ) : (
              <button
                type="button"
                disabled
                title={tEvent("noDesign")}
                className={ACTION}
              >
                <Icon name="eye" className="size-[15px]" />
                {tEvent("viewAsGuest")}
              </button>
            )}
            {/* The printable is built from the design, so it needs one too. */}
            {event.templateId ? (
              <Link href={`/prints/${event.id}`} className={ACTION}>
                <Icon name="printer" className="size-[15px]" />
                {tEvent("print")}
              </Link>
            ) : (
              <button
                type="button"
                disabled
                title={tEvent("noDesign")}
                className={ACTION}
              >
                <Icon name="printer" className="size-[15px]" />
                {tEvent("print")}
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
}
