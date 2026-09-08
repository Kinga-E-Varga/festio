import type { ReactNode } from "react";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import { ATTENTION_NOTICES, RECENT_RSVPS } from "@/mock/dashboard";
import type { NoticeTone } from "@/types/dashboard";

/** Each notice's edge colour carries through to its call to action. */
const TONE: Record<NoticeTone, string> = {
  unmatched: "border-rust-500 text-rust-600",
  deadline: "border-mustard-500 text-mustard-600",
  safeguard: "border-terracotta-500 text-terracotta-600",
  billing: "border-steel-500 text-steel-600",
};

const PANEL_LABEL =
  "mb-3.5 text-[10px] font-semibold tracking-[0.18em] text-mustard-500 uppercase";

function Panel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="mb-[22px] border-b border-mustard-400 pb-[22px] last:mb-0 last:border-b-0 last:pb-0">
      <h2 className={PANEL_LABEL}>{label}</h2>
      {children}
    </section>
  );
}

export function NotificationsRail() {
  return (
    <div>
      <Panel label="Needs your attention">
        <ul>
          {ATTENTION_NOTICES.map((notice) => (
            <li
              key={notice.id}
              className={`mb-3.5 border-l-4 pb-3.5 pl-3.5 last:mb-0 last:pb-0 ${TONE[notice.tone]}`}
            >
              <p className="mb-[3px] font-semibold text-neutral-900">
                {notice.title}
                {notice.context ? (
                  <span className="font-normal"> {notice.context}</span>
                ) : null}
              </p>
              <p className="mb-1.5 text-[12.5px] leading-[1.45] text-neutral-700">
                {notice.body}
              </p>
              <button
                type="button"
                className="text-[12.5px] font-semibold text-current underline underline-offset-[3px] transition-colors hover:text-neutral-900"
              >
                {notice.actionLabel}
              </button>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel label="Recent RSVPs">
        <ul>
          {RECENT_RSVPS.map((entry) => (
            <li
              key={entry.id}
              className="flex gap-[11px] border-t border-neutral-300 py-3 first:border-t-0 first:pt-0"
            >
              <span
                aria-hidden="true"
                className={`grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${
                  entry.tag
                    ? "bg-terracotta-200 text-terracotta-600"
                    : "bg-forest-200 text-forest-600"
                }`}
              >
                {entry.initials}
              </span>
              <div className="min-w-0 text-[12.5px] leading-[1.45] text-neutral-700">
                <p>
                  <span className="font-semibold text-neutral-900">
                    {entry.actor}
                  </span>{" "}
                  {entry.summary}
                  {entry.subject ? (
                    <>
                      {" "}
                      <span className="font-semibold text-neutral-900">
                        {entry.subject}
                      </span>
                    </>
                  ) : null}
                  {entry.tag ? (
                    <>
                      {" "}
                      <span className="inline-block border border-terracotta-400 bg-terracotta-200 px-1.5 py-px align-[1px] text-[9.5px] font-semibold tracking-[0.1em] text-terracotta-600">
                        {entry.tag}
                      </span>
                    </>
                  ) : null}
                </p>
                <p className="mt-0.5 text-[11.5px]">{entry.meta.join(" · ")}</p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <section className="border border-terracotta-400 bg-terracotta-200 p-5 text-terracotta-600">
        <h2 className={`${PANEL_LABEL} text-terracotta-600`}>Data retention</h2>
        <p className="mb-3 text-[12.5px] leading-[1.5]">
          Each invitation and all its guest data is deleted automatically{" "}
          <span className="font-serif text-[22px] align-[-2px]">
            {GUEST_DATA_RETENTION_DAYS}
          </span>{" "}
          days after the event date. Your account and printable PNGs stay.
        </p>
        <p className="text-[12.5px] leading-[1.5]">
          You are the data controller; Festio processes on your behalf under the{" "}
          <a
            href="/legal/terms"
            className="font-bold underline underline-offset-[3px]"
          >
            DPA in the Terms
          </a>
          .
        </p>
      </section>
    </div>
  );
}
