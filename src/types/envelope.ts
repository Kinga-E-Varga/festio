/**
 * The envelope's own colours. It can't wear the invitation's palette roles as
 * they are, so each palette (and each simple template) says which colour plays
 * each part. Ids are permanent.
 * `liner` also inks the tag's text and stitching; `shadow` is the cast shadows,
 * used as it is (no shading).
 */
export type EnvelopeRole =
  "paper" | "liner" | "string" | "seal" | "tag" | "shadow";

/** A 6-digit hex, or another envelope role's name ("liner") to follow it. */
export type EnvelopeColor = `#${string}` | EnvelopeRole;

export type EnvelopeColors = Record<EnvelopeRole, EnvelopeColor>;
