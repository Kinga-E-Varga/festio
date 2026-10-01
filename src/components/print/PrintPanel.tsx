"use client";

import { useTranslations } from "next-intl";
import {
  BANNER_TONE,
  LABEL,
  PANEL_INPUT,
} from "@/components/dashboard/event-editor/styles";
import { Icon } from "@/components/icons";
import { PanelViewButton, SidePanel } from "@/components/invitation/SidePanel";
import type { PrintSettings, PrintShape } from "@/types/print";

/**
 * Flat / Folded: ink in the panel's text colour either way, with a text
 * field's edge. Picked, a warm grey fill; otherwise the palest gold. Either
 * one fills with the edge's own grey on hover. As tall as a text field beside
 * them — its 9px padding, its 13.5px type and its 1px border.
 */
const CHOICE =
  "inline-flex cursor-pointer items-center justify-center border border-neutral-400 px-4 py-[9px] text-[13.5px] font-medium text-neutral-800 transition-colors hover:bg-neutral-400";
const CHOICE_ON = `${CHOICE} bg-neutral-300`;
const CHOICE_OFF = `${CHOICE} bg-mustard-50`;

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
 * Nothing in here submits: the top bar's Export is what the form is for.
 */
export function PrintPanel({
  settings,
  open,
  onChange,
  onClose,
}: PrintPanelProps) {
  const t = useTranslations("PrintPanel");

  return (
    <SidePanel panelClassName="sheet-form" open={open} onClose={onClose}>
      {/*
       * `w-full` is what makes it fill: the auto margins that centre it
       * also turn off the column's stretch, so without it the form would
       * only be as wide as its widest label.
       */}
      <div className="flex flex-col w-full max-w-[640px] mx-auto">
        <fieldset className="flex flex-col mb-6">
          <legend className={`${LABEL} mb-2`}>{t("cardStyle")}</legend>
          <div className="flex gap-1.5">
            {SHAPES.map((shape) => (
              <button
                key={shape}
                type="button"
                aria-pressed={settings.shape === shape}
                onClick={() => onChange("shape", shape)}
                className={settings.shape === shape ? CHOICE_ON : CHOICE_OFF}
              >
                {t(shape)}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col mb-6">
          <legend className={`${LABEL} mb-2`}>{t("background")}</legend>
          {/* The event editor's checkbox in the choice buttons' colours: the real input, drawn on, its tick laid over it. */}
          <label className="flex cursor-pointer items-start gap-[9px] text-[13.5px] leading-[1.45] text-neutral-800">
            <span className="relative mt-px grid size-4 shrink-0 place-items-center">
              <input
                type="checkbox"
                checked={settings.tinted}
                onChange={(control) =>
                  onChange("tinted", control.target.checked)
                }
                className="peer size-4 cursor-pointer appearance-none border-[1.5px] border-neutral-800 bg-mustard-50 transition-colors checked:bg-neutral-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mustard-400"
              />
              <Icon
                name="check"
                strokeWidth={3}
                className="pointer-events-none absolute size-3 text-neutral-800 opacity-0 peer-checked:opacity-100"
              />
            </span>
            {t("tinted")}
          </label>
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

        {/* The event editor's teal info banner. */}
        <div className={`flex flex-col border p-4 ${BANNER_TONE.info}`}>
          <p className="mb-3 border-b border-steel-400 pb-2 text-center text-[12.5px] font-semibold">
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

        <PanelViewButton onClose={onClose} className="mt-6" />
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
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <textarea
        id={id}
        rows={3}
        maxLength={120}
        placeholder={placeholder}
        value={value}
        onChange={(control) => onChange(control.target.value)}
        className={`${PANEL_INPUT} resize-none`}
      />
    </div>
  );
}
