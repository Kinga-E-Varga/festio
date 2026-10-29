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
import { OPTION_CARD, OptionTip, RollOut } from "./RollOut";

/*
 * The roles a palette shows: squares in its box and on its cards, and
 * along the template cards' foot. Tailwind only sees whole class names, so
 * each fill is written out rather than built from the role.
 */
export const SWATCHES: [ColorRole, string][] = [
  ["surface", "bg-[var(--m-surface)]"],
  ["ink", "bg-[var(--m-ink)]"],
  ["accent", "bg-[var(--m-accent)]"],
  ["secondary", "bg-[var(--m-secondary)]"],
  ["tertiary", "bg-[var(--m-tertiary)]"],
];

/** A palette's colours as squares side by side in one frame, as on its cards. */
function Swatches({ palette }: { palette: ModularPalette }) {
  return (
    <span
      aria-hidden="true"
      style={paletteVars(palette)}
      className="flex shrink-0 overflow-hidden rounded-ui border border-neutral-400"
    >
      {SWATCHES.map(([role, fill]) => (
        <span key={role} className={`size-[18px] ${fill}`} />
      ))}
    </span>
  );
}

/**
 * Whole palettes only: the box shows the current one's colours, and its
 * cards are swatches — the same colours side by side, 112px wide as the
 * template cards and 24px tall, so inside the 1px border each of the five
 * is a 22px square. Picked, it shrinks as much as the others (0.83), not
 * by its own height, or it would look far smaller: its ring then runs about
 * 3px past it, into the space between the cards. No
 * names on show: hovering a card shows its name as a hint, and screen
 * readers get it.
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
      <EditorHeading id="design-heading-palette" title={t("palette")} />
      <RollOut
        id="design-palettes"
        label={`${t("palette")}: ${palette?.name ?? ""}`}
        icon="palette"
        summary={palette ? <Swatches palette={palette} /> : null}
      >
        {palettes.map((option) => (
          <OptionTip key={option.id} tip={option.name}>
            <button
              type="button"
              aria-pressed={option.id === current}
              aria-label={option.name}
              onClick={() => onPick(option.id)}
              style={paletteVars(option)}
              className={`${OPTION_CARD} w-[112px] overflow-hidden border border-neutral-400 [--card-h:24px]`}
            >
              {SWATCHES.map(([role, fill]) => (
                <span
                  key={role}
                  aria-hidden="true"
                  className={`flex-1 ${fill}`}
                />
              ))}
            </button>
          </OptionTip>
        ))}
      </RollOut>
    </div>
  );
}

/**
 * A pattern's sample: drawn in the app's secondary colour on the pale fill — the shape,
 * not the colours, which the palette sets. Patterns draw in `--m-pattern`,
 * and one that hides part of itself (Curvy, Waves) paints over it in `--m-surface`.
 */
const PATTERN_SAMPLE =
  "border border-neutral-400 bg-neutral-50 [--m-pattern:var(--color-neutral-400)] [--m-surface:var(--color-neutral-50)]";

/**
 * Every pattern's sample at half its size, the same for all: drawn on a layer
 * twice the card's size and shrunk into it, so more than a repeat shows.
 */
const SAMPLE_SCALE =
  "absolute top-0 left-0 isolate size-[200%] origin-top-left scale-50";

/**
 * Plain, or one of the patterns: the box with an icon and the pattern's
 * name, and its cards each a 60px square sample of one — Plain an empty one.
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
      <EditorHeading id="design-heading-pattern" title={t("pattern")} />
      <RollOut
        id="design-patterns"
        paged
        label={`${t("pattern")}: ${name}`}
        icon="pattern"
        summary={<span className="min-w-0">{name}</span>}
      >
        {options.map((option) => (
          <OptionTip key={option.id ?? "plain"} tip={option.name}>
            <button
              type="button"
              aria-pressed={option.id === current}
              aria-label={option.name}
              onClick={() => onPick(option.id)}
              className={`${OPTION_CARD} w-[60px] overflow-hidden ${PATTERN_SAMPLE}`}
            >
              <span
                aria-hidden="true"
                className={`${SAMPLE_SCALE} ${option.className}`}
              />
            </button>
          </OptionTip>
        ))}
      </RollOut>
    </div>
  );
}

/**
 * Whole pairs only: the box with an icon and the pair's name; its cards
 * each the pair's two faces named in themselves, one under the other —
 * the heading face, then the body face — each card 112 × 60px, as the
 * template cards; a name too long for it ends in an ellipsis.
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
      <EditorHeading id="design-heading-fontPair" title={t("fontPair")} />
      <RollOut
        id="design-font-pairs"
        label={`${t("fontPair")}: ${pair?.name ?? ""}`}
        icon="fonts"
        summary={<span className="min-w-0 truncate">{pair?.name ?? ""}</span>}
      >
        {fontPairs.map((option) => (
          <OptionTip key={option.id} tip={option.name}>
            <button
              type="button"
              aria-pressed={option.id === current}
              aria-label={option.name}
              onClick={() => onPick(option.id)}
              style={fontVars(option)}
              className={`${OPTION_CARD} w-[112px] flex-col items-center justify-center gap-0.5 border border-neutral-400 bg-neutral-50 px-2 py-1.5 text-center text-neutral-950 ${fontClasses(option)}`}
            >
              <span
                aria-hidden="true"
                className={`max-w-full truncate ${SERIF} text-[16px] leading-tight`}
              >
                {option.faceNames.secondary}
              </span>
              <span
                aria-hidden="true"
                className="max-w-full truncate font-[family-name:var(--font-primary)] text-[12.5px]"
              >
                {option.faceNames.primary}
              </span>
            </button>
          </OptionTip>
        ))}
      </RollOut>
    </div>
  );
}

/**
 * One corners step for the whole page: the box with an icon and the step's
 * name, and its cards each drawn with the step's box corners, 110 × 30px.
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
      <EditorHeading id="design-heading-corners" title={t("corners")} />
      <RollOut
        id="design-corners"
        label={`${t("corners")}: ${name}`}
        icon="corners"
        summary={<span className="min-w-0">{name}</span>}
      >
        {CORNER_IDS.map((id) => (
          <OptionTip key={id} tip={t(`corner.${id}`)}>
            <button
              type="button"
              aria-pressed={id === current}
              aria-label={t(`corner.${id}`)}
              onClick={() => onPick(id)}
              style={cornerVars(id)}
              className={`${OPTION_CARD} w-[110px] rounded-(--m-corner)! border [--card-h:30px] border-neutral-400 bg-neutral-50`}
            />
          </OptionTip>
        ))}
      </RollOut>
    </div>
  );
}
