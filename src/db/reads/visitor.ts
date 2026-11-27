import { headers } from "next/headers";
import { sign } from "@/db/secret";
import { clientIp } from "@/lib/client-ip";

/**
 * Who is asking, for the rate limits: their IP (`clientIp`), scrambled with
 * the server's secret, so the real one is never stored.
 */
export async function visitorKey(): Promise<string> {
  return sign(`ip:${clientIp(await headers())}`);
}
