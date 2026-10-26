"use client";

import { useTranslations } from "next-intl";
import { INFO_SOFT, INPUT } from "@/components/dashboard/styles";
import { PickCard } from "@/components/modular/design/PickCard";
import { SwitchCard } from "@/components/modular/design/SwitchCard";
import { SidePanel } from "@/components/invitation/SidePanel";
import type { PrintSettings, PrintShape } from "@/types/print";

/*
 * Each shape's id is also its key into `PrintPanel` — its label, and under
 * `steps` what the host gets back from us once they print, a line per step:
 * what they download, what to do with it, what to print it on. Both shapes'
 * steps are rendered together because the box that shows them must not
 * resize when the host switches — see the note where it is rendered.
 */
const SHAPES: PrintShape[] = ["flat", "folded"];

interface PrintPanelProps {
  settings: PrintSettings;
  /** Whether the form is showing. Answered at every width. */
  open: boolean;
  onChange: <Key extends keyof PrintSettings>(
    key: Key,
    value: PrintSettings[Key],
  ) => void;
  onClose: () => void;
}

/**
 * The printable's settings. The same surface as the invitation's edit panel,
 * in Festio's own palette and the event editor's fields — but this form is
 * fixed rather than generated from `template.fields`, because what a
 * printable needs settling is the paper, not the template's copy.
 *
 * Nothing in here submits: Export, on the strip, is what the form is for.
 */
export function PrintPanel({
  settings,
  open,
  onChange,
  onClose,
}: PrintPanelProps) {
  const t = useTranslations("PrintPanel");
  const tHost = useTranslations("HostEditor");

  return (
    <SidePanel
      panelClassName="sheet-form"
      open={open}
      title={tHost("printSettings")}
      onClose={onClose}
    >
      {/*
       * `w-full` is what makes it fill: the auto margins that centre it
       * also turn off the column's stretch, so without it the form would
       * only be as wide as its widest label.
       */}
      <div className="flex flex-col w-full max-w-[640px] mx-auto">
        <fieldset className="flex flex-col mb-6">
          <legend className="mb-2.5 editor-heading">{t("cardStyle")}</legend>
          <PickCard
            id="print-shapes"
            label={t("cardStyle")}
            icon="card"
            name={t(settings.shape)}
            options={SHAPES.map((shape) => ({ value: shape, label: t(shape) }))}
            value={settings.shape}
            onPick={(shape) => onChange("shape", shape)}
          />
        </fieldset>

        <fieldset className="flex flex-col mb-6">
          <legend className="mb-2.5 editor-heading">{t("background")}</legend>
          <SwitchCard
            id="print-tinted"
            label={t("tinted")}
            checked={settings.tinted}
            onChange={(on) => onChange("tinted", on)}
          />
        </fieldset>

        <LineField
          id="print-headline"
          label={t("message")}
          placeholder={t("optional")}
          value={settings.headline}
          onChange={(value) => onChange("headline", value)}
        />

        <LineField
          id="print-note"
          label={t("secondLine")}
          placeholder={t("optional")}
          value={settings.note}
          onChange={(value) => onChange("note", value)}
        />

        {/* The event editor's info colours, its edge and rule a shade lighter than its words. */}
        <div
          className={`flex flex-col rounded-ui border border-info-600 p-4 ${INFO_SOFT}`}
        >
          <p className="mb-3 border-b border-info-600 pb-2 text-center text-[12.5px] font-semibold">
            {t("instructions")}
          </p>
          {/*
           * Both sets of instructions are laid in the same cell, the one the
           * host is not reading hidden rather than removed. The box is then
           * always as tall as the longer of the two and holds still when the
           * shape changes, which is what stops the form jumping under the
           * pointer that just changed it.
           *
           * The grid is this pair's own rather than the box's: a cell named
           * by `grid-area` is filled before anything that names none, so a
           * heading sharing that grid would be auto-placed into the row
           * below the lists however early it came in the markup.
           */}
          <div className="grid">
            {SHAPES.map((shape) => (
              <ul
                key={shape}
                aria-hidden={settings.shape !== shape}
                className={`[grid-area:1/1] space-y-2 text-[12.5px] leading-[1.5] text-justify ${
                  settings.shape === shape ? "" : "invisible"
                }`}
              >
                {(t.raw(`steps.${shape}`) as string[]).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </SidePanel>
  );
}

interface LineFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

/** One of the two printed lines: a label over a short textarea. */
function LineField({
  id,
  label,
  placeholder,
  value,
  onChange,
}: LineFieldProps) {
  return (
    <div className="mb-6 flex flex-col gap-1.5">
      <label htmlFor={id} className="editor-heading">
        {label}
      </label>
      <textarea
        id={id}
        rows={3}
        maxLength={120}
        placeholder={placeholder}
        value={value}
        onChange={(control) => onChange(control.target.value)}
        className={`${INPUT} resize-none`}
      />
    </div>
  );
}
