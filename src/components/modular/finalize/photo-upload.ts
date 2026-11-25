"use client";

import { createContext, useContext } from "react";

/** Saves a picked photo and answers its path, or throws with the reason. */
export type PhotoUpload = (photo: File) => Promise<string>;

/**
 * Dev only: given by `ModularEditor` on a template's preview, so the
 * Content tab's photo fields can take a new sample photo. Absent
 * everywhere else, and the fields keep "Change photo" off.
 */
export const PhotoUploadContext = createContext<PhotoUpload | null>(null);

export function usePhotoUpload() {
  return useContext(PhotoUploadContext);
}

/** Into `public/modular/samples/` through the dev server. */
export const uploadSamplePhoto: PhotoUpload = async (photo) => {
  const body = new FormData();
  body.append("photo", photo);
  const response = await fetch("/api/dev/sample-photo", {
    method: "POST",
    body,
  });
  const result = (await response.json()) as { path?: string; error?: string };
  if (!response.ok || !result.path)
    throw new Error(result.error ?? "Not saved.");
  return result.path;
};
