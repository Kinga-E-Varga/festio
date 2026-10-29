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
     * The cover grows to fill the hero (`ModularInvitation`, `--hero`): up
     * to 1440px the header and the cover alone fill the first screen, the
     * title below. Never shorter than a phone's 440px. Once the page is
     * wider than `INVITE_COLUMN` (1440px), the photo stops at the column and
     * drops below the header as far as the page's margin beside it, at most
     * 80px (`--cover-top`), so it sits
     * on the band rather than looking cut off. There it is never
     * wider than 2:1 (720px tall) unless the screen is too short for that,
     * so the title joins the first screen only when the screen is tall
     * enough to hold it below such a photo.
     */
    <div
      data-cover
      className={`relative flex min-h-110 grow overflow-hidden @max-[1441px]/page:min-h-[max(440px,var(--hero))] @min-[1441px]/page:mt-(--cover-top) @min-[1441px]/page:min-h-[max(440px,min(var(--hero)-var(--cover-top),var(--invite-column)/2))] bg-[var(--m-accent)] ${className}`}
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
