import { headers } from "next/headers";
import { sign } from "@/db/secret";

/**
 * Who is asking, for the rate limits: their IP, scrambled with the server's
 * secret, so the real one is never stored. The last `x-forwarded-for` entry
 * is the one Google's front end added; anything before it the caller can
 * write themselves, so trusting it would let a script reset its limit on
 * every request. Without the header, every such visitor shares one count.
 */
export async function visitorKey(): Promise<string> {
  const forwarded = (await headers()).get("x-forwarded-for");
  const ip = forwarded?.split(",").at(-1)?.trim() || "unknown";
  return sign(`ip:${ip}`);
}
