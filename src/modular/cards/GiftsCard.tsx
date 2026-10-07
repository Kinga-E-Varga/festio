"use client";

import { useTranslations } from "next-intl";
import { useId, useState, type ReactNode } from "react";
import { isOn, safeLink, text } from "@/modular/content";
import {
  BODY_SM,
  CAPS,
  MUTED,
  OUTLINE_BUTTON,
  OUTLINE_SECONDARY,
} from "@/modular/styles";
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
 * The gift note with its buttons in the side column: the registry, and the
 * account details to open — each only while the host has it switched on
 * and filled in.
 */
export function GiftsCard({ values, label, ground }: GiftsCardProps) {
  return (
    <NoteCard
      icon="gift"
      tone="secondary"
      label={label}
      title={text(values, "title")}
      body={text(values, "body")}
      ground={ground}
      aside={
        hasGiftActions(values) ? (
          <GiftActions values={values} stacked />
        ) : undefined
      }
    />
  );
}

/** Whether there is a registry or an account to show under the note. */
export function hasGiftActions(values: SectionValues): boolean {
  return registryLink(values) !== null || hasAccount(values);
}

/** The registry's address: switched on, and a web address. */
function registryLink(values: SectionValues): string | null {
  return isOn(values, "showRegistry")
    ? safeLink(text(values, "registryLink"))
    : null;
}

/** Whether the account shows: switched on, with at least one line filled. */
function hasAccount(values: SectionValues): boolean {
  return (
    isOn(values, "showAccount") &&
    ["holder", "iban", "reference"].some((id) => text(values, id))
  );
}

/** The account to give to, each line only when filled, and Copy for the IBAN. */
function GiftAccount({
  values,
  stacked,
}: {
  values: SectionValues;
  stacked: boolean;
}) {
  const t = useTranslations("Sections");
  const holder = text(values, "holder");
  const iban = text(values, "iban");
  const reference = text(values, "reference");

  return (
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
      {iban ? (
        <CopyButton
          value={iban}
          className={stacked ? `${OUTLINE_SECONDARY} self-start` : undefined}
        />
      ) : null}
    </>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className={`${CAPS} ${MUTED} font-medium`}>{label}</dt>
      <dd className="text-[color:var(--m-ink)]">{children}</dd>
    </div>
  );
}

/**
 * The registry and the account as two buttons of one width — the wider
 * one's — side by side, or `stacked` and centred in a card's side column on
 * a wide page. The registry opens its page, the account opens its details
 * under the buttons.
 */
export function GiftActions({
  values,
  stacked = false,
}: {
  values: SectionValues;
  stacked?: boolean;
}) {
  const t = useTranslations("Sections");
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const link = registryLink(values);
  const account = hasAccount(values);

  return (
    <div
      className={`flex flex-col items-start gap-4 ${stacked ? "@5xl:items-center" : ""}`}
    >
      <div
        className={`grid gap-3 ${stacked ? "" : "@md:auto-cols-fr @md:grid-flow-col"}`}
      >
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={OUTLINE_BUTTON}
          >
            {t("seeRegistry")}
          </a>
        ) : null}
        {account ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={detailsId}
            onClick={() => setOpen(!open)}
            className={`${OUTLINE_BUTTON} cursor-pointer`}
          >
            {open ? t("hideAccount") : t("seeAccount")}
          </button>
        ) : null}
      </div>
      {account && open ? (
        <div id={detailsId} className="flex flex-col items-start gap-3">
          <GiftAccount values={values} stacked={stacked} />
        </div>
      ) : null}
    </div>
  );
}
