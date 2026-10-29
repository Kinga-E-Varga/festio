"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { isOn, safeLink, text } from "@/modular/content";
import {
  BODY_SM,
  CAPS,
  CORNER,
  GROUND,
  MUTED,
  OUTLINE_BUTTON,
  OUTLINE_SECONDARY,
  type TONES,
} from "@/modular/styles";
import type { Ground, SectionValues } from "@/types/modular";
import { CopyButton } from "./CopyButton";
import { twinIcon } from "@/modular/notes";
import { NoteCard } from "./NoteCard";

interface GiftsCardProps {
  /** The `gifts` section's values, wherever the card is drawn. */
  values: SectionValues;
  label: string;
  ground: Ground;
  /** The icon's colour: the secondary unless the list it sits in takes turns. */
  tone?: keyof typeof TONES;
}

/**
 * The gift note with its buttons in the side column: the registry, and the
 * account details to open — each only while the host has it switched on
 * and filled in.
 */
export function GiftsCard({
  values,
  label,
  ground,
  tone = "secondary",
}: GiftsCardProps) {
  return (
    <NoteCard
      icon={twinIcon(values)}
      tone={tone}
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
 * The registry and the account as two buttons side by side, sharing the
 * row, stacking once their words would wrap; or `stacked`, of one width,
 * one under the other: a card's side column, Helpful notes' Grid and
 * Cards. The registry opens its page; the account opens its details in a
 * box floating 8px under its button, on the page's surface. The box is
 * the browser's popover, drawn over the whole page so no parent clips it (a
 * grid with hairlines would), and closed by the button, Escape or a click
 * outside it; placed when it opens, and again on scroll or resize.
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
  const button = useRef<HTMLButtonElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const link = registryLink(values);
  const account = hasAccount(values);

  /*
   * Under the button, 8px from it, or over it when the screen has no room
   * below; across, centred on it or in line with one of its edges (`boxLeft`).
   */
  const place = () => {
    if (!button.current || !box.current) return;
    const at = button.current.getBoundingClientRect();
    const { offsetWidth: width, offsetHeight: height } = box.current;
    const left = boxLeft(at, width);
    const below = at.bottom + GAP;
    const top =
      below + height > window.innerHeight - EDGE &&
      at.top - GAP - height >= EDGE
        ? at.top - GAP - height
        : below;
    box.current.style.setProperty("--box-x", `${left}px`);
    box.current.style.setProperty("--box-y", `${top}px`);
  };

  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  });

  return (
    <div className={`gap-x-3 gap-y-4 ${stacked ? "grid" : "flex flex-wrap"}`}>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`${OUTLINE_BUTTON} ${stacked ? "" : SIDE_BY_SIDE}`}
        >
          <Labels
            shown={t("seeRegistry")}
            hidden={account ? [t("seeAccount"), t("hideAccount")] : []}
          />
        </a>
      ) : null}
      {account ? (
        <>
          <button
            ref={button}
            type="button"
            popoverTarget={detailsId}
            aria-expanded={open}
            className={`${OUTLINE_BUTTON} ${stacked ? "" : SIDE_BY_SIDE} cursor-pointer`}
          >
            {/* Opening never changes its width: Hide account is in it too, hidden. */}
            <Labels
              shown={open ? t("hideAccount") : t("seeAccount")}
              hidden={[
                open ? t("seeAccount") : t("hideAccount"),
                ...(link ? [t("seeRegistry")] : []),
              ]}
            />
          </button>
          {/*
           * No display on the box itself: the browser hides a closed popover
           * with `display: none`, which a `flex` here would override.
           */}
          <div
            ref={box}
            id={detailsId}
            popover="auto"
            onToggle={(event) => {
              const nowOpen =
                (event.nativeEvent as ToggleEvent).newState === "open";
              if (nowOpen) place();
              setOpen(nowOpen);
            }}
            className={`inset-auto top-(--box-y) left-(--box-x) m-0 max-h-[calc(100vh-1.5rem)] w-72 max-w-[calc(100vw-1.5rem)] overflow-auto ${CORNER} border-1 border-[var(--m-line)] p-5 text-left shadow-lg shadow-(color:--m-shadow)/20 ${GROUND.surface}`}
          >
            <div className="flex flex-col items-start gap-3">
              <GiftAccount values={values} stacked={stacked} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

/*
 * Side by side, the two share the row evenly but never get narrower than
 * their words, so they stack instead of wrapping them; stacked, each takes
 * the row. Not in a side column (`stacked`): there always one under the
 * other. Each holds the other's words too, hidden (`Labels`), so the two
 * are always as wide as each other.
 */
const SIDE_BY_SIDE = "min-w-max flex-1 basis-0";

/**
 * A button's words, and in the same cell, hidden, every other label the
 * buttons show: the button is as wide as the longest of them.
 */
function Labels({ shown, hidden }: { shown: string; hidden: string[] }) {
  return (
    <span className="grid text-center">
      <span className="col-start-1 row-start-1">{shown}</span>
      {hidden.map((label) => (
        <span
          key={label}
          aria-hidden="true"
          className="invisible col-start-1 row-start-1"
        >
          {label}
        </span>
      ))}
    </span>
  );
}

/**
 * The floating box's left edge: centred on its button; if that passes a
 * side of the screen, in line with the button's right edge, or else its
 * left; failing both, kept off the screen's edges.
 */
function boxLeft(at: DOMRect, width: number): number {
  const fits = (left: number) =>
    left >= EDGE && left + width <= window.innerWidth - EDGE;
  const centred = at.left + (at.width - width) / 2;
  if (fits(centred)) return centred;
  if (fits(at.right - width)) return at.right - width;
  if (fits(at.left)) return at.left;
  return Math.max(EDGE, Math.min(centred, window.innerWidth - width - EDGE));
}

/** The floating box's least distance from the screen's edges, in px. */
const EDGE = 12;
/** Between the floating box and its button, in px. */
const GAP = 8;
