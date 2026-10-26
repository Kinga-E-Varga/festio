"use client";

import { useTranslations } from "next-intl";
import { EditorHeading } from "@/components/dashboard/event-editor/EditorSection";
import { Switch } from "@/components/invitation/PanelSwitch";
import {
  CARD_OPENINGS,
  DEFAULT_OPENING,
  type CardOpening,
} from "@/components/envelope/card";
import { PickCard } from "./PickCard";

/**
 * The Design tab's Envelope group: its switch on a card like a section's.
 * Given `opening`, the card, while on, rolls out how the card comes out of
 * the envelope. Shared by the simple and modular editors.
 */
export function EnvelopeCard({
  on,
  onChange,
  opening,
}: {
  on: boolean;
  onChange: (on: boolean) => void;
  opening?: { value: CardOpening; onPick: (way: CardOpening) => void };
}) {
  const t = useTranslations("DesignTab");

  return (
    <div
      role="group"
      aria-labelledby="design-heading-envelope"
      className="mb-8 flex flex-col"
    >
      <EditorHeading
        id="design-heading-envelope"
        title={t("envelopeHeading")}
      />
      <PickCard
        id="envelope-openings"
        label={t("opening")}
        mark={
          <Switch
            size="panel"
            tone="light"
            id="envelope-switch"
            label={t("envelope")}
            checked={on}
            onChange={onChange}
          />
        }
        name={t("envelope")}
        options={CARD_OPENINGS.map((way) => ({
          value: way,
          label: t(`openings.${way}`),
        }))}
        value={opening?.value ?? DEFAULT_OPENING}
        onPick={(way) => opening?.onPick(way)}
        rolls={on && opening !== undefined}
      />
    </div>
  );
}
