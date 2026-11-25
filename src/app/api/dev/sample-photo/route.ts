import { access, writeFile } from "node:fs/promises";
import path from "node:path";
import { SAMPLE_PHOTO_MAX_MB } from "@/lib/config";
import { normalizeSlug } from "@/lib/slug";

/** Where templates' sample photos live, served as `/modular/samples/…`. */
const SAMPLES = path.join(process.cwd(), "public", "modular", "samples");

const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function taken(file: string) {
  return access(file).then(
    () => true,
    () => false,
  );
}

/**
 * Dev only: a photo picked on a template's preview. Saved into
 * `public/modular/samples/` under its own name (a number added when that
 * is taken); answers the path a template's image field holds. 404 outside
 * development.
 */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development")
    return new Response(null, { status: 404 });

  const photo = (await request.formData()).get("photo");
  if (!(photo instanceof File))
    return Response.json({ error: "No photo sent." }, { status: 400 });
  const extension = TYPES[photo.type];
  if (!extension)
    return Response.json({ error: "Only JPEG, PNG or WebP." }, { status: 400 });
  if (photo.size > SAMPLE_PHOTO_MAX_MB * 1024 * 1024)
    return Response.json(
      { error: `At most ${SAMPLE_PHOTO_MAX_MB} MB.` },
      { status: 400 },
    );

  const base = normalizeSlug(photo.name.replace(/\.[^.]*$/, "")) || "photo";
  let name = `${base}.${extension}`;
  for (let n = 2; await taken(path.join(SAMPLES, name)); n++)
    name = `${base}-${n}.${extension}`;

  await writeFile(
    path.join(SAMPLES, name),
    Buffer.from(await photo.arrayBuffer()),
  );
  return Response.json({ path: `/modular/samples/${name}` });
}
