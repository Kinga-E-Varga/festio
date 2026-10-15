import type { ReactNode } from "react";
import { WashedPhoto } from "@/modular/WashedPhoto";
import { INVITE_COLUMN } from "@/modular/vars";

/**
 * The cover's photo full width, shared by its variants, which draw their
 * content over it. The photo is required here; while it is missing the
 * accent stands in.
 */
export function CoverPhoto({
  photo,
  className,
  children,
}: {
  photo: string | null;
  /** Where the content sits: flex alignment. */
  className: string;
  children: ReactNode;
}) {
  return (
    /*
     * From `@3xl` the cover never runs past the first screen, less the
     * header (56px, 64px from `@5xl`), so a laptop's short screen still shows
     * the date at its foot; never shorter than a phone's 440px.
     */
    <div
      className={`relative flex min-h-110 overflow-hidden bg-[var(--m-accent)] @3xl:min-h-[clamp(440px,calc(100svh_-_56px),560px)] @5xl:min-h-[clamp(440px,calc(100svh_-_64px),648px)] ${className}`}
    >
      {/*
       * The title's ground over the photo, as on the split location. The
       * title always follows the cover, which breaks the surfaces' turns,
       * so its ground is always `surface`.
       */}
      {photo ? (
        <WashedPhoto
          src={photo}
          sizes={`(min-width: ${INVITE_COLUMN}px) ${INVITE_COLUMN}px, 100vw`}
          ground="surface"
          preload
        />
      ) : null}
      {children}
    </div>
  );
}
