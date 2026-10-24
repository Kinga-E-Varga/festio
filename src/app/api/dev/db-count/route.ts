import { COUNTING } from "@/db/admin";
import { takeDbCount } from "@/db/count";

/**
 * Dev only: what this server asked of Firestore since the last call, then
 * zero again. The cost check reads it around each page it measures. Not
 * there unless counting is on and the server talks to the emulators.
 */
export function GET() {
  if (!COUNTING) return new Response(null, { status: 404 });
  return Response.json(takeDbCount());
}
