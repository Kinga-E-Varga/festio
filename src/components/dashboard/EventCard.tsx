import Image from "next/image";
import { CopyButton } from "@/components/dashboard/CopyButton";
import { PasswordField } from "@/components/dashboard/PasswordField";
import { Icon } from "@/components/icons";
import type { DashboardEvent, IconName, Visibility } from "@/types/dashboard";

const VISIBILITY: Record<Visibility, { label: string; icon: IconName }> = {
  hidden: { label: "Hidden", icon: "eyeOff" },
  public: { label: "Public", icon: "globe" },
  protected: { label: "Protected", icon: "shield" },
};

const ACTION =
  "inline-flex items-center justify-center gap-2 rounded-md border border-linen-200 bg-cream-50 px-3 py-2 transition-colors hover:border-stone-400 hover:bg-cream-200";
const ACTION_DISABLED =
  "inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-md border border-linen-200 bg-cream-100 px-3 py-2 text-stone-400";

const STAT_LABEL =
  "text-[10px] font-medium tracking-[0.1em] text-stone-500 uppercase";

function Tally({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  /** Denominator kept small so four tallies fit the column, e.g. "/124". */
  detail?: string;
}) {
  return (
    <div>
      <dt className={STAT_LABEL}>{label}</dt>
      <dd className="mt-0.5 font-serif text-xl leading-none tabular-nums">
        {value}
        {detail ? (
          <span className="font-sans text-xs text-stone-500">{detail}</span>
        ) : null}
      </dd>
    </div>
  );
}

export function EventCard({ event }: { event: DashboardEvent }) {
  const visibility = VISIBILITY[event.visibility];
  const { confirmed, cap } = event.safeguard;
  const safeguardPercent = cap > 0 ? Math.round((confirmed / cap) * 100) : 0;
  const safeguardTight = safeguardPercent >= 80;

  return (
    <article className="flex overflow-hidden rounded-lg border border-linen-200 bg-cream-50 transition-colors hover:border-stone-400">
      {event.isNextUp ? (
        <span aria-hidden="true" className="w-0.5 shrink-0 bg-sage-600" />
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-5 p-4 lg:flex-row">
          <div className="w-24 shrink-0 overflow-hidden rounded border border-linen-200 sm:w-28">
            <Image
              src={event.preview}
              alt={event.previewAlt}
              sizes="112px"
              className="h-auto w-full"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-x-2 text-xs">
              <span className="text-stone-500">{event.dateLabel}</span>
              <span aria-hidden="true" className="text-stone-400">
                ·
              </span>
              <span
                className={
                  event.isNextUp
                    ? "font-medium text-sage-600"
                    : "text-stone-500"
                }
              >
                {event.isNextUp
                  ? `Next up, ${event.countdownLabel}`
                  : event.countdownLabel}
              </span>
            </p>

            <h3 className="mt-1 font-serif text-xl leading-snug sm:text-2xl">
              {event.title}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
              <span className="inline-flex items-center gap-1.5 text-stone-500">
                <Icon name={visibility.icon} className="size-3.5" />
                {visibility.label}
              </span>
              <span className="text-stone-500">{event.tierLabel}</span>
              {event.editLockLabel ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-honey-300 bg-cream-200 px-2 py-0.5 font-medium text-ink-700">
                  <Icon name="clock" className="size-3.5" />
                  {event.editLockLabel}
                </span>
              ) : null}
            </div>

            <div className="mt-3 flex flex-col items-start gap-2">
              <span className="inline-flex max-w-full items-center gap-2 rounded-md border border-linen-200 bg-cream-100 px-2.5 py-1.5 text-xs">
                <Icon name="link" className="size-3.5 shrink-0 text-stone-500" />
                <span className="truncate">{event.link}</span>
                <CopyButton
                  value={`https://${event.link}`}
                  label={`Copy invitation link for ${event.title}`}
                />
              </span>

              {event.password ? (
                <PasswordField password={event.password} />
              ) : null}

              {event.linkNote ? (
                <span className="inline-flex items-center gap-2 rounded-md border border-linen-200 bg-cream-100 px-2.5 py-1.5 text-xs text-stone-500">
                  <Icon name="eyeOff" className="size-3.5 shrink-0" />
                  {event.linkNote}
                </span>
              ) : null}
            </div>
          </div>

          <div className="shrink-0 border-t border-linen-200 pt-4 lg:w-72 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-5">
            <dl className="grid grid-cols-4 gap-3">
              <Tally
                label="Replied"
                value={event.rsvp.replied}
                detail={`/${event.rsvp.invited}`}
              />
              <Tally label="Attending" value={event.rsvp.attending} />
              <Tally label="Declined" value={event.rsvp.declined} />
              <Tally label="Pending" value={event.rsvp.pending} />
            </dl>

            <div className="mt-4">
              <progress
                className={`meter ${safeguardTight ? "text-clay-500" : "text-sage-500"}`}
                value={confirmed}
                max={cap}
                aria-label={`Attendee safeguard: ${confirmed} of ${cap}`}
              />
              <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs text-stone-500">
                <span>Attendee safeguard</span>
                <span className="flex items-center gap-2">
                  <span className="tabular-nums">
                    {confirmed} of {cap} · {safeguardPercent}%
                  </span>
                  <button
                    type="button"
                    className="font-medium text-sage-600 underline decoration-sage-300 underline-offset-2 transition-colors hover:text-sage-800 hover:decoration-sage-600"
                  >
                    Raise cap
                  </button>
                </span>
              </div>
            </div>

            {event.note ? (
              <div
                className={`mt-3 flex gap-2 rounded-md border px-3 py-2 text-xs ${
                  event.note.tone === "warning"
                    ? "border-clay-500/30 bg-peach-100 text-clay-600"
                    : "border-linen-200 bg-cream-100 text-stone-500"
                }`}
              >
                {event.note.tone === "warning" ? (
                  <Icon name="alert" className="mt-px size-3.5 shrink-0" />
                ) : null}
                <p className="leading-relaxed">
                  {event.note.text}
                  {event.note.actionLabel ? (
                    <>
                      {" "}
                      <button
                        type="button"
                        className="font-medium underline underline-offset-2"
                      >
                        {event.note.actionLabel}
                      </button>
                    </>
                  ) : null}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-linen-200 p-3 sm:grid-cols-3 lg:grid-cols-5">
          <button type="button" className={ACTION}>
            <Icon name="pencil" className="size-4 text-stone-500" />
            Edit
          </button>
          <button type="button" className={ACTION}>
            <Icon name="eye" className="size-4 text-stone-500" />
            View
          </button>
          <button type="button" className={ACTION}>
            <Icon name="list" className="size-4 text-stone-500" />
            Guest
          </button>
          {event.seatingAvailable ? (
            <button type="button" className={ACTION}>
              <Icon name="seating" className="size-4 text-stone-500" />
              Seating
            </button>
          ) : (
            <button
              type="button"
              disabled
              title="Seating charts come with paid invitations"
              className={ACTION_DISABLED}
            >
              <Icon name="seating" className="size-4" />
              Seating
            </button>
          )}
          <button type="button" className={ACTION}>
            <Icon name="printer" className="size-4 text-stone-500" />
            Print
          </button>
        </div>
      </div>
    </article>
  );
}
