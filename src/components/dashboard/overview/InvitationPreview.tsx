"use client";

import { useMemo, type ReactNode } from "react";
import { PREVIEW_EDGE } from "@/components/dashboard/styles";
import { ScaledStage } from "@/components/invitation/ScaledStage";
import { ModularInvitation } from "@/components/modular/ModularInvitation";
import { inviteTheme } from "@/lib/invitation";
import type { Language } from "@/lib/language";
import { resolveDesign } from "@/modular/state";
import type { InvitationTemplate } from "@/types/invitation";
import type {
  InvitationBasics,
  ModularLibrary,
  ModularState,
} from "@/types/modular";

/**
 * The picture's frame: rounded and edged like the boxes, nothing inside it
 * reachable. `inert` takes clicks, focus and screen readers off the copy;
 * the frame itself is the one image they read. `isolate` keeps the copy's
 * own layers (a sticky header) under the Edit tag on its corner.
 */
const FRAME = `relative isolate w-full overflow-clip rounded-ui border ${PREVIEW_EDGE}`;

/**
 * A simple invitation as guests see it, the whole card shrunk to the box:
 * the template's own card, drawn live, so nothing is saved or goes stale.
 */
export function SimplePreview({
  template,
  label,
  children,
}: {
  template: InvitationTemplate;
  /** What the picture is, for screen readers. */
  label: string;
  /** The card, drawn on the server with the event's values. */
  children: ReactNode;
}) {
  const { width, height, shadow } = template.design;
  const theme = inviteTheme(template);

  return (
    <div
      role="img"
      aria-label={label}
      style={{ ...theme.style, aspectRatio: `${width} / ${height}` }}
      className={`${theme.className} ${FRAME} flex`}
    >
      <div inert className="flex min-h-0 min-w-0 flex-1">
        <ScaledStage width={width} height={height} minScale={0} shadow={shadow}>
          {children}
        </ScaledStage>
      </div>
    </div>
  );
}

/**
 * A modular invitation's top — header, cover, names — laid out at the box's
 * width and cut off at its foot. No envelope: the page itself shows.
 */
export function ModularPreview({
  library,
  state,
  basics,
  language,
  label,
}: {
  library: ModularLibrary;
  state: ModularState;
  basics: InvitationBasics;
  language: Language;
  label: string;
}) {
  const design = useMemo(
    () => resolveDesign({ ...state, envelope: false }, library),
    [state, library],
  );
  if (!design) return null;

  return (
    <div role="img" aria-label={label} className={`${FRAME} aspect-[3/4]`}>
      <div inert className="absolute inset-0">
        <ModularInvitation
          design={design}
          basics={basics}
          language={language}
        />
      </div>
    </div>
  );
}
