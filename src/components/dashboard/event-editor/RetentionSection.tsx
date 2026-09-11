import type { ReactNode } from "react";
import { EditorSection } from "@/components/dashboard/event-editor/EditorSection";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import type { DashboardEvent } from "@/types/dashboard";

interface RetentionSectionProps {
  event: DashboardEvent;
  /** Follows the date field, so moving the event moves the deletion date. */
  deletionLabel: string;
  dateLabel: string;
}

function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="px-[18px] py-[15px]">
      <h4 className="mb-1 text-sm font-bold">{title}</h4>
      <p className="text-[13.5px] leading-[1.55]">{children}</p>
    </div>
  );
}

export function RetentionSection({
  event,
  deletionLabel,
  dateLabel,
}: RetentionSectionProps) {
  const gone = event.dataDeleted;

  return (
    <EditorSection title="Data and retention">
      {/* Four labelled rows, with the deletion date lifted out as the thing to remember. */}
      <div className="border border-terracotta-400 bg-terracotta-200 text-terracotta-600">
        <Row
          title={`Everything ${gone ? "was" : "is"} deleted on ${deletionLabel}`}
        >
          The invitation, every reply and any image you uploaded {gone
            ? "went"
            : "go"}{" "}
          automatically, {GUEST_DATA_RETENTION_DAYS} days after {dateLabel}.
          Your account is not affected.
        </Row>

        <Row title={gone ? "Nothing left to save" : "Save what you want to keep"}>
          {gone
            ? "Anything not exported before that date is gone from Festio for good — we have no way to bring it back."
            : "Export the guest list, every reply, your seating chart and the printable invitation before then. Once the record is deleted it is gone from Festio for good — we have no way to bring it back."}
        </Row>

        <Row title="You are the data controller">
          Festio only processes this event&apos;s data for you, under the{" "}
          <a
            href="/legal/terms"
            className="underline underline-offset-[3px] hover:text-neutral-900"
          >
            DPA in the Terms
          </a>
          . What your guests tell you is theirs: use it to run this event and
          nothing else, never sell it or pass it to anyone who is not helping
          you host, and keep any copy you download to yourself.
        </Row>

        <Row title="Your guests are told this">
          The reply form names you as the person responsible for their details,
          and says what is collected and how long it is kept.
        </Row>
      </div>
    </EditorSection>
  );
}
