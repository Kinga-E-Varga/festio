import { readFileSync } from "node:fs";
import type { DbCount } from "@/db/count";
import { APP_URL } from "./global";

/** A page of the app copy as a browser gets it, redirects not followed. */
export async function page(
  path: string,
  cookie?: string,
): Promise<{ status: number; body: string; location: string | null }> {
  const answer = await fetch(`${APP_URL}${path}`, {
    redirect: "manual",
    headers: cookie ? { Cookie: cookie } : {},
  });
  return {
    status: answer.status,
    body: await answer.text(),
    location: answer.headers.get("location"),
  };
}

/** What the app copy asked of Firestore since the last take, then zero again. */
export async function appDbCount(): Promise<DbCount> {
  const answer = await fetch(`${APP_URL}/api/dev/db-count`);
  return (await answer.json()) as DbCount;
}

/** The build's Server Actions, by file and exported name: how a browser's POST names one. */
const ACTIONS = ".next-test/server/server-reference-manifest.json";

interface ActionManifest {
  node: Record<string, { filename: string; exportedName: string }>;
}

/**
 * A Server Action of the app copy called as the browser calls it: a POST to
 * the page it runs on, `args` as its arguments. The answer is React's stream,
 * the action's return value inside it.
 */
export async function action(
  file: string,
  name: string,
  {
    path,
    cookie,
    args = [],
  }: { path: string; cookie?: string; args?: unknown[] },
): Promise<{ status: number; body: string; redirect: string | null }> {
  const manifest = JSON.parse(readFileSync(ACTIONS, "utf8")) as ActionManifest;
  const id = Object.entries(manifest.node).find(
    ([, found]) => found.filename === file && found.exportedName === name,
  )?.[0];
  if (!id) throw new Error(`No Server Action ${name} in ${file}`);
  const answer = await fetch(`${APP_URL}${path}`, {
    method: "POST",
    redirect: "manual",
    headers: {
      "Next-Action": id,
      Accept: "text/x-component",
      "Content-Type": "text/plain;charset=UTF-8",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(args),
  });
  return {
    status: answer.status,
    body: await answer.text(),
    /* An action's `redirect()` names its target here rather than in `Location`. */
    redirect: answer.headers.get("x-action-redirect"),
  };
}
