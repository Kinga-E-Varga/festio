import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { isOn, text } from "@/modular/content";
import { BODY_SM, CAPS, MUTED } from "@/modular/styles";
import type { Ground, SectionValues } from "@/types/modular";
import { CopyButton } from "./CopyButton";
import { NoteCard } from "./NoteCard";

interface GiftsCardProps {
  /** The `gifts` section's values, wherever the card is drawn. */
  values: SectionValues;
  label: string;
  ground: Ground;
}

/**
 * The gift note, with the account to give to beside it — each line only
 * when filled, and the column only while the host has it switched on.
 */
export function GiftsCard({ values, label, ground }: GiftsCardProps) {
  const t = useTranslations("Sections");
  const holder = text(values, "holder");
  const iban = text(values, "iban");
  const reference = text(values, "reference");
  const hasAside =
    isOn(values, "showAccount") && Boolean(holder || iban || reference);

  return (
    <NoteCard
      icon="gift"
      tone="secondary"
      label={label}
      title={text(values, "title")}
      body={text(values, "body")}
      ground={ground}
      aside={
        hasAside ? (
          <>
            <dl className={`${BODY_SM} flex flex-col gap-2`}>
              {holder ? <Row label={t("account")}>{holder}</Row> : null}
              {iban ? (
                <Row label={t("iban")}>
                  <span className="tracking-wider break-all tabular-nums">
                    {iban}
                  </span>
                </Row>
              ) : null}
              {reference ? <Row label={t("reference")}>{reference}</Row> : null}
            </dl>
            {iban ? <CopyButton value={iban} /> : null}
          </>
        ) : undefined
      }
    />
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className={`${CAPS} ${MUTED}`}>{label}</dt>
      <dd className="text-[color:var(--m-ink)]">{children}</dd>
    </div>
  );
}
