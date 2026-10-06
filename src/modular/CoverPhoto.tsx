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
    <div
      className={`relative flex min-h-110 overflow-hidden bg-[var(--m-accent)] @3xl:min-h-140 @5xl:min-h-162 ${className}`}
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
