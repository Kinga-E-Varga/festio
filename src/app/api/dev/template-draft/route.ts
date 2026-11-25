import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { SLUG_PATTERN } from "@/lib/slug";
import { draftId, templateDraftSchema } from "@/lib/template-draft";
import { loadTemplate } from "@/templates";

/** Where drafts land, git-ignored. Nothing is written anywhere else. */
const DRAFTS = path.join(process.cwd(), "drafts", "templates");

/**
 * Dev only: the template preview's Finalize. Writes the editor's state to
 * `drafts/templates/<id>.json` for the `template` skill. 404 outside
 * development; 409 when a new template's id is already a template's.
 */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development")
    return new Response(null, { status: 404 });

  const parsed = templateDraftSchema.safeParse(await request.json());
  if (!parsed.success)
    return Response.json({ error: "The draft is not valid." }, { status: 400 });

  const draft = parsed.data;
  const id = draftId(draft);
  if (!SLUG_PATTERN.test(id))
    return Response.json(
      { error: "The name needs at least one letter or digit." },
      { status: 400 },
    );
  if (draft.mode === "new" && (await loadTemplate(id)))
    return Response.json(
      { error: `A template "${id}" already exists.` },
      { status: 409 },
    );

  await mkdir(DRAFTS, { recursive: true });
  const file = path.join(DRAFTS, `${id}.json`);
  await writeFile(
    file,
    `${JSON.stringify({ id, savedAt: new Date().toISOString(), ...draft }, null, 2)}\n`,
  );
  return Response.json({ id, file: path.relative(process.cwd(), file) });
}
