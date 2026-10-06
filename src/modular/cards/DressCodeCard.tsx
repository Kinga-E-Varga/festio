import { list, text } from "@/modular/content";
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

/** A swatch's colour: its hex, or its palette role's; empty when it is neither. */
function swatchColor(color = ""): string {
  if (HEX.test(color)) return color;
  return SWATCH_ROLES.includes(color as ColorRole) ? `var(--m-${color})` : "";
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
        hasSwatches(values) ? <DressCodeSwatches values={values} /> : undefined
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

/** Whether there is a line or a colour to show beside what to wear. */
export function hasSwatches(values: SectionValues): boolean {
  return Boolean(text(values, "swatchLabel") || swatchesOf(values).length);
}

/** The line above the colours and the colours themselves. */
export function DressCodeSwatches({ values }: { values: SectionValues }) {
  const swatchLabel = text(values, "swatchLabel");
  const swatches = swatchesOf(values);

  return (
    <>
      {swatchLabel ? (
        <span className={`${CAPS} ${MUTED} font-medium`}>{swatchLabel}</span>
      ) : null}
      {swatches.length > 0 ? (
        <ul className="flex flex-wrap gap-2.5">
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
