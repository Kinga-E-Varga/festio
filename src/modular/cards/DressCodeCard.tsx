import { list, text } from "@/modular/content";
import { CAPS, MUTED } from "@/modular/styles";
import type { Ground, SectionValues } from "@/types/modular";
import { NoteCard } from "./NoteCard";

const HEX = /^#[0-9a-f]{6}$/i;

interface DressCodeCardProps {
  /** The `dress-code` section's values, wherever the card is drawn. */
  values: SectionValues;
  label: string;
  ground: Ground;
}

/** What to wear, with the host's colour swatches beside it. */
export function DressCodeCard({ values, label, ground }: DressCodeCardProps) {
  const swatchLabel = text(values, "swatchLabel");
  const swatches = list(values, "swatches").filter((swatch) =>
    HEX.test(swatch.color ?? ""),
  );
  const hasAside = Boolean(swatchLabel || swatches.length);

  return (
    <NoteCard
      icon="sparkle"
      tone="accent"
      label={label}
      title={text(values, "title")}
      body={text(values, "body")}
      ground={ground}
      aside={
        hasAside ? (
          <>
            {swatchLabel ? (
              <span className={`${CAPS} ${MUTED}`}>{swatchLabel}</span>
            ) : null}
            {swatches.length > 0 ? (
              <ul className="flex flex-wrap gap-2.5">
                {swatches.map((swatch, index) => (
                  <li key={index} title={swatch.name}>
                    {/*
                     * The one colour that is not the palette's: what to wear
                     * is the host's content, so it is set where it is used.
                     */}
                    <span
                      className="block size-7 rounded-full border-1 border-[var(--m-line)]"
                      style={{ backgroundColor: swatch.color }}
                    />
                    <span className="sr-only">{swatch.name}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : undefined
      }
    />
  );
}
