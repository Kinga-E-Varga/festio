import type { z } from "zod";

/**
 * A card checked against its schema, or null when it fails: the issue goes
 * to the server log and the card reads as missing, so one hand-edited card
 * never takes down the page around it.
 */
export function parseCard<T>(
  schema: z.ZodType<T>,
  path: string,
  data: unknown,
): T | null {
  const parsed = schema.safeParse(data);
  if (parsed.success) return parsed.data;
  console.error(`${path} failed its schema`, parsed.error.issues);
  return null;
}

/** Each card of a query that passes its schema, with its ID; the rest are skipped. */
export function parseCards<T>(
  schema: z.ZodType<T>,
  docs: { id: string; ref: { path: string }; data(): unknown }[],
): (T & { id: string })[] {
  return docs.flatMap((doc) => {
    const card = parseCard(schema, doc.ref.path, doc.data());
    return card ? [{ ...card, id: doc.id }] : [];
  });
}
