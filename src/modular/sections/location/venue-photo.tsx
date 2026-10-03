import Image from "next/image";
import { imageSrc, text } from "@/modular/content";
import { Icon } from "@/modular/icons";
import { MapsLink } from "@/modular/MapsLink";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  ARROW_NUDGE,
  BODY,
  CAPS,
  GROUND,
  HEADING,
  LEAD,
  UNDERLINE_LINK,
  PAD,
  SERIF,
  SPLIT_COLUMNS,
  STACK,
} from "@/modular/styles";
import { otherGround } from "@/modular/ground";
import { INVITE_COLUMN } from "@/modular/vars";
import type { VariantProps } from "@/types/modular";

/*
 * The photo is the wide 3fr of `SPLIT_COLUMNS`, inside the column less its
 * 120px side padding (`PAD_X` on a wide page).
 */
const PHOTO_SIZES = `(min-width: ${INVITE_COLUMN}px) ${((INVITE_COLUMN - 240) * 3) / 5}px, (min-width: 768px) 60vw, 100vw`;

/**
 * The venue on the accent beside a photo of it. No map is embedded, so nothing reaches a map provider before the
 * guest taps "Open in Maps". The photo is required here; while it is
 * missing the alternate surface stands in.
 */
export function Variant({ values, basics, ground }: VariantProps) {
  const label = text(values, "label");
  const detail = text(values, "detail");
  const photo = imageSrc(text(values, "photo"));

  return (
    <div className={`${STACK} ${GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      <div className={`grid border-1 border-[var(--m-line)] ${SPLIT_COLUMNS}`}>
        <div className="flex flex-col items-start justify-center bg-[var(--m-accent)] p-8 text-[color:var(--m-accent-ink)] @3xl:px-12 @3xl:py-10">
          {label ? (
            <p
              className={`${CAPS} inline-flex items-center gap-2 text-[12px]!`}
            >
              <Icon name="pin" className="size-4.5 shrink-0" />
              {label}
            </p>
          ) : null}
          <h3
            className={`${HEADING} mt-6 mb-2 text-[36px] leading-[1.1] tracking-[-0.03em] @3xl:text-[40px]`}
          >
            {basics.venue}
          </h3>
          <p className={`${BODY} whitespace-pre-line opacity-80`}>
            {basics.address}
          </p>
          {detail ? (
            <p className={`${SERIF} ${LEAD} mt-4 italic`}>{detail}</p>
          ) : null}
          <MapsLink
            query={`${basics.venue}, ${basics.address.replace(/\n/g, ", ")}`}
            className={`${UNDERLINE_LINK} mt-4`}
          >
            <Icon name="arrow-up-right" className={ARROW_NUDGE} />
          </MapsLink>
        </div>
        <div
          className={`relative min-h-68 ${GROUND[otherGround(ground)]} @3xl:min-h-84`}
        >
          {photo ? (
            <Image
              src={photo}
              alt=""
              fill
              sizes={PHOTO_SIZES}
              className="object-cover"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
