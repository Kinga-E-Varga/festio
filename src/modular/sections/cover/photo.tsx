import Image from "next/image";
import { imageSrc, longDate, text } from "@/modular/content";
import { Icon } from "@/modular/icons";
import { CAPS, CAPTION, FROSTED, HEADING, MUTED } from "@/modular/styles";
import { INVITE_COLUMN } from "@/modular/vars";
import type { VariantProps } from "@/types/modular";

/* The cover's frosted box, edged in the line. */
const BOX = `${FROSTED} border-1 border-[var(--m-line)] text-[color:var(--m-ink)]`;

/**
 * The photo full width, and low on it a frosted box with the kicker, the date
 * and a way down. The photo is required here; while it is missing the accent
 * stands in. The photo is mood, not content, so its alt is empty.
 */
export function Variant({ values, basics, language }: VariantProps) {
  const photo = imageSrc(text(values, "photo"));
  const kicker = text(values, "kicker");
  const date = text(values, "dateLine") || longDate(basics.date, language);
  const scroll = text(values, "scrollLabel");

  return (
    <div className="relative flex min-h-110 items-end justify-center overflow-hidden bg-[var(--m-accent)] @3xl:min-h-140 @5xl:min-h-162">
      {photo ? (
        <Image
          src={photo}
          alt=""
          fill
          preload
          sizes={`(min-width: ${INVITE_COLUMN}px) ${INVITE_COLUMN}px, 100vw`}
          className="object-cover"
        />
      ) : null}
      <div
        className={`${BOX} group relative mx-6 mb-20 flex flex-col items-center gap-3 px-6 py-5 text-center @3xl:px-9`}
      >
        {kicker ? <p className={CAPS}>{kicker}</p> : null}
        <p
          className={`${HEADING} text-[20px] leading-[1.4] tracking-[0.1em] @3xl:text-[22px]`}
        >
          {date}
        </p>
        {scroll ? (
          <a
            href="#title"
            className={`${CAPTION} ${MUTED} inline-flex items-center gap-2 transition-colors group-hover:text-[color:var(--m-secondary)] after:absolute after:inset-0`}
          >
            {scroll}
            <Icon name="arrow-down" className="size-3.5" />
          </a>
        ) : null}
      </div>
    </div>
  );
}
