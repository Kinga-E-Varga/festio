import type { ReactNode } from "react";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import { ATTENTION_NOTICES, RECENT_RSVPS } from "@/mock/dashboard";
import type { NoticeTone } from "@/types/dashboard";

const TONE_BAR: Record<NoticeTone, string> = {
  unmatched: "bg-clay-600",
  deadline: "bg-honey-300",
  safeguard: "bg-sage-500",
  billing: "bg-info",
};

function RailCard({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-linen-200 bg-cream-50">
      <h2 className="border-b border-linen-200 px-4 py-2.5 text-[11px] font-medium tracking-[0.14em] text-stone-500 uppercase">
        {label}
      </h2>
      {children}
    </section>
  );
}

export function NotificationsRail() {
  return (
    <div className="flex flex-col gap-4">
      <RailCard label="Needs your attention">
        <ul className="divide-y divide-linen-200">
          {ATTENTION_NOTICES.map((notice) => (
            <li key={notice.id} className="flex gap-3 px-3 py-3">
              <span
                aria-hidden="true"
                className={`w-0.5 shrink-0 rounded-full ${TONE_BAR[notice.tone]}`}
              />
              <div className="min-w-0">
                <p className="font-medium">
                  {notice.title}
                  {notice.context ? (
                    <span className="font-normal text-stone-500">
                      {" "}
                      {notice.context}
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-stone-500">
                  {notice.body}
                </p>
                <button
                  type="button"
                  className="mt-1.5 text-xs font-medium text-sage-600 underline decoration-sage-300 underline-offset-2 transition-colors hover:text-sage-800 hover:decoration-sage-600"
                >
                  {notice.actionLabel}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </RailCard>

      <RailCard label="Recent RSVPs">
        <ul className="divide-y divide-linen-200">
          {RECENT_RSVPS.map((entry) => (
            <li key={entry.id} className="flex gap-3 px-4 py-3">
              <span
                aria-hidden="true"
                className="grid size-6 shrink-0 place-items-center rounded-full bg-sage-100 text-[10px] font-medium text-sage-800"
              >
                {entry.initials}
              </span>
              <div className="min-w-0">
                <p className="leading-snug">
                  <span className="font-medium">{entry.actor}</span>{" "}
                  {entry.summary}
                  {entry.subject ? (
                    <>
                      {" "}
                      <span className="font-medium">{entry.subject}</span>
                    </>
                  ) : null}
                  {entry.tag ? (
                    <>
                      {" "}
                      <span className="rounded-sm border border-clay-500/40 bg-peach-100 px-1.5 py-0.5 text-[10px] font-medium tracking-[0.08em] text-clay-600">
                        {entry.tag}
                      </span>
                    </>
                  ) : null}
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  {entry.meta.join(" · ")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </RailCard>

      <section className="rounded-lg border border-honey-200 bg-cream-200 px-4 py-3.5">
        <h2 className="text-[11px] font-medium tracking-[0.14em] text-ink-700 uppercase">
          Data retention
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-ink-700">
          Each invitation and all its guest data is deleted automatically{" "}
          <span className="font-serif text-lg leading-none">
            {GUEST_DATA_RETENTION_DAYS}
          </span>{" "}
          days after the event date. Your account and printable PNGs stay.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ink-700">
          You are the data controller; Festio processes on your behalf under the{" "}
          <a
            href="/legal/terms"
            className="font-medium underline decoration-ink-700/40 underline-offset-2 hover:decoration-ink-700"
          >
            DPA in the Terms
          </a>
          .
        </p>
      </section>
    </div>
  );
}
