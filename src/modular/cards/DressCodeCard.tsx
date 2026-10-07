import { isOn, list, text } from "@/modular/content";
import { CAPS, MUTED } from "@/modular/styles";
import type { ColorRole, Ground, SectionValues } from "@/types/modular";
import { NoteCard } from "./NoteCard";

const HEX = /^#[0-9a-f]{6}$/i;

/* The palette's roles a swatch may name in place of a hex colour, so it follows the palette. */
const SWATCH_ROLES: ColorRole[] = [
  "canvas",
  "surface",
  "ink",
  "accent",
  "secondary",
  "tertiary",
];

function isSwatchRole(color: string): color is ColorRole {
  return SWATCH_ROLES.includes(color as ColorRole);
}

/** A swatch's colour: its hex, or its palette role's; empty when it is neither. */
function swatchColor(color = ""): string {
  if (HEX.test(color)) return color;
  return isSwatchRole(color) ? `var(--m-${color})` : "";
}

/**
 * A swatch's colour as a hex, a role read from `colors` — what the editor's
 * colour picker opens on. Empty when it is neither.
 */
export function swatchHex(
  color: string,
  colors: Record<ColorRole, string>,
): string {
  if (HEX.test(color)) return color.toLowerCase();
  return isSwatchRole(color) ? colors[color].toLowerCase() : "";
}

interface DressCodeCardProps {
  /** The `dress-code` section's values, wherever the card is drawn. */
  values: SectionValues;
  label: string;
  ground: Ground;
}

/** What to wear, with the host's colour swatches beside it. */
export function DressCodeCard({ values, label, ground }: DressCodeCardProps) {
  return (
    <NoteCard
      icon="sparkle"
      tone="secondary"
      label={label}
      title={text(values, "title")}
      body={text(values, "body")}
      ground={ground}
      aside={
        hasSwatches(values) ? (
          <DressCodeSwatches values={values} column />
        ) : undefined
      }
    />
  );
}

/** The swatches' colours that can be drawn: a hex or a palette role each. */
function swatchesOf(values: SectionValues) {
  return list(values, "swatches")
    .map((swatch) => ({ name: swatch.name, color: swatchColor(swatch.color) }))
    .filter((swatch) => swatch.color);
}

/**
 * Whether there is a line or a colour to show beside what to wear: none
 * while the host has the swatches switched off.
 */
export function hasSwatches(values: SectionValues): boolean {
  return (
    isOn(values, "showSwatches") &&
    Boolean(text(values, "swatchLabel") || swatchesOf(values).length)
  );
}

/** The line above the colours and the colours themselves. */
export function DressCodeSwatches({
  values,
  column = false,
}: {
  values: SectionValues;
  /**
   * In a card's side column: a tighter gap so six fit on one line there,
   * centred on a wide page should they ever wrap.
   */
  column?: boolean;
}) {
  const swatchLabel = text(values, "swatchLabel");
  const swatches = swatchesOf(values);

  return (
    <>
      {swatchLabel ? (
        <span className={`${CAPS} ${MUTED} font-medium`}>{swatchLabel}</span>
      ) : null}
      {swatches.length > 0 ? (
        <ul
          className={`flex flex-wrap ${column ? "gap-2 @5xl:justify-center" : "gap-2.5"}`}
        >
          {swatches.map((swatch, index) => (
            <li
              key={index}
              title={swatch.name || undefined}
              aria-hidden={swatch.name ? undefined : true}
            >
              {/*
               * The one colour that may not be the palette's: what to
               * wear is the host's content, so it is set where it is
               * used. The defaults name palette roles instead.
               */}
              <span
                className="block size-7 rounded-full border-1 border-[var(--m-line)]"
                style={{ backgroundColor: swatch.color }}
              />
              {swatch.name ? (
                <span className="sr-only">{swatch.name}</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
