"use client";

import { useTranslations } from "next-intl";
import { EditorHeading } from "@/components/dashboard/event-editor/EditorSection";
import { CORNER_IDS, type CornersId, cornerVars } from "@/modular/corners";
import { SERIF } from "@/modular/styles";
import { fontClasses, fontVars, paletteVars } from "@/modular/vars";
import type {
  ColorRole,
  FontPair,
  ModularPalette,
  ModularPattern,
} from "@/types/modular";
import { OPTION_CARD, RollOut } from "./RollOut";

/*
 * The roles the palette row shows as dots. Tailwind only sees whole class
 * names, so each fill is written out rather than built from the role.
 */
const SWATCHES: [ColorRole, string][] = [
  ["surface", "bg-[var(--m-surface)]"],
  ["ink", "bg-[var(--m-ink)]"],
  ["accent", "bg-[var(--m-accent)]"],
  ["secondary", "bg-[var(--m-secondary)]"],
  ["tertiary", "bg-[var(--m-tertiary)]"],
];

/** A palette's colours as overlapping dots, in its own colours. */
function Swatches({ palette }: { palette: ModularPalette }) {
  return (
    <span
      aria-hidden="true"
      style={paletteVars(palette)}
      className="flex shrink-0 -space-x-1.5"
    >
      {SWATCHES.map(([role, fill]) => (
        <span
          key={role}
          className={`size-5 rounded-full border border-neutral-400 ${fill}`}
        />
      ))}
    </span>
  );
}

/**
 * Whole palettes only: the box shows the current one's colours, and its
 * cards are tiny invitations in each palette's colours — its page, two
 * lines of its ink, dots of its accents. No names on show; screen readers
 * get them.
 */
export function PalettePicker({
  palettes,
  current,
  onPick,
}: {
  palettes: ModularPalette[];
  current: string;
  onPick: (id: string) => void;
}) {
  const t = useTranslations("DesignTab");
  const palette = palettes.find(({ id }) => id === current);

  return (
    <div
      role="group"
      aria-labelledby="design-heading-palette"
      className="mb-8 flex flex-col"
    >
      <EditorHeading
        id="design-heading-palette"
        title={t("palette")}
        className="mb-[18px]"
      />
      <RollOut
        id="design-palettes"
        label={`${t("palette")}: ${palette?.name ?? ""}`}
        summary={palette ? <Swatches palette={palette} /> : null}
      >
        {palettes.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={option.id === current}
            aria-label={option.name}
            onClick={() => onPick(option.id)}
            style={paletteVars(option)}
            className={`${OPTION_CARD} h-[60px] flex-col justify-between border border-[var(--m-line)] bg-[var(--m-surface)] p-2.5`}
          >
            <span aria-hidden="true" className="flex flex-col gap-1.5">
              <span className="h-1 w-3/4 rounded-full bg-[var(--m-ink)]" />
              <span className="h-1 w-1/2 rounded-full bg-[var(--m-ink-muted)]" />
            </span>
            <span aria-hidden="true" className="flex gap-1">
              <span className="size-3 rounded-full bg-[var(--m-accent)]" />
              <span className="size-3 rounded-full bg-[var(--m-secondary)]" />
              <span className="size-3 rounded-full bg-[var(--m-tertiary)]" />
            </span>
          </button>
        ))}
      </RollOut>
    </div>
  );
}

/**
 * A pattern's sample: drawn in the app's gold on the pale fill — the shape,
 * not the colours, which the palette sets. Patterns draw in `--m-pattern`.
 */
const PATTERN_SAMPLE =
  "border border-mustard-300 bg-neutral-50 [--m-pattern:var(--color-mustard-400)]";

/**
 * Plain, or one of the patterns: the box with an icon and the pattern's
 * name, and its cards each a 60px square sample of one, as tall as the
 * palette's cards — Plain an empty one.
 */
export function PatternPicker({
  patterns,
  current,
  onPick,
}: {
  patterns: ModularPattern[];
  current: string | null;
  onPick: (id: string | null) => void;
}) {
  const t = useTranslations("DesignTab");
  const name =
    patterns.find(({ id }) => id === current)?.name ?? t("plainPattern");
  const options = [
    { id: null, name: t("plainPattern"), className: "" },
    ...patterns,
  ];

  return (
    <div
      role="group"
      aria-labelledby="design-heading-pattern"
      className="mb-8 flex flex-col"
    >
      <EditorHeading
        id="design-heading-pattern"
        title={t("pattern")}
        className="mb-[18px]"
      />
      <RollOut
        id="design-patterns"
        label={`${t("pattern")}: ${name}`}
        icon="pattern"
        summary={<span className="min-w-0">{name}</span>}
        layout="flex flex-wrap gap-3"
      >
        {options.map((option) => (
          <button
            key={option.id ?? "plain"}
            type="button"
            aria-pressed={option.id === current}
            aria-label={option.name}
            onClick={() => onPick(option.id)}
            className={`${OPTION_CARD} size-[60px] ${PATTERN_SAMPLE} ${option.className}`}
          />
        ))}
      </RollOut>
    </div>
  );
}

/**
 * Whole pairs only: the box with an icon and the pair's name; its cards
 * each the pair's two faces named in themselves, one under the other —
 * the heading face, then the body face — each card as wide as its names.
 */
export function FontPairPicker({
  fontPairs,
  current,
  onPick,
}: {
  fontPairs: FontPair[];
  current: string;
  onPick: (id: string) => void;
}) {
  const t = useTranslations("DesignTab");
  const pair = fontPairs.find(({ id }) => id === current);

  return (
    <div
      role="group"
      aria-labelledby="design-heading-fontPair"
      className="mb-8 flex flex-col"
    >
      <EditorHeading
        id="design-heading-fontPair"
        title={t("fontPair")}
        className="mb-[18px]"
      />
      <RollOut
        id="design-font-pairs"
        label={`${t("fontPair")}: ${pair?.name ?? ""}`}
        icon="fonts"
        summary={<span className="min-w-0 truncate">{pair?.name ?? ""}</span>}
        layout="flex flex-wrap gap-3"
      >
        {fontPairs.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={option.id === current}
            aria-label={option.name}
            onClick={() => onPick(option.id)}
            style={fontVars(option)}
            className={`${OPTION_CARD} h-[60px] max-w-full flex-col items-center justify-center gap-0.5 border border-mustard-300 bg-neutral-50 px-3 py-1.5 text-center text-neutral-900 ${fontClasses(option)}`}
          >
            <span
              aria-hidden="true"
              className={`max-w-full truncate ${SERIF} text-[15px] leading-tight sm:text-[18px]`}
            >
              {option.faceNames.secondary}
            </span>
            <span
              aria-hidden="true"
              className="max-w-full truncate font-[family-name:var(--font-primary)] text-[12px] sm:text-[14px]"
            >
              {option.faceNames.primary}
            </span>
          </button>
        ))}
      </RollOut>
    </div>
  );
}

/**
 * One corners step for the whole page: the box with an icon and the step's
 * name, and its cards each a 60px square drawn with the step's box corners,
 * as tall as the other pickers' cards.
 */
export function CornersPicker({
  current,
  onPick,
}: {
  current: CornersId;
  onPick: (id: CornersId) => void;
}) {
  const t = useTranslations("DesignTab");
  const name = t(`corner.${current}`);

  return (
    <div
      role="group"
      aria-labelledby="design-heading-corners"
      className="mb-8 flex flex-col"
    >
      <EditorHeading
        id="design-heading-corners"
        title={t("corners")}
        className="mb-[18px]"
      />
      <RollOut
        id="design-corners"
        label={`${t("corners")}: ${name}`}
        icon="corners"
        summary={<span className="min-w-0">{name}</span>}
        layout="flex flex-wrap gap-3"
      >
        {CORNER_IDS.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={id === current}
            aria-label={t(`corner.${id}`)}
            onClick={() => onPick(id)}
            style={cornerVars(id)}
            className={`${OPTION_CARD} size-[60px] rounded-(--m-corner)! border-2 border-mustard-400 bg-neutral-50`}
          />
        ))}
      </RollOut>
    </div>
  );
}
