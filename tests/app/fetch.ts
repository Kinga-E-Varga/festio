import { readFileSync } from "node:fs";
import { request } from "node:http";
import type { DbCount } from "@/db/count";
import { APP_BASE, APP_URL } from "./global";

interface Answer {
  status: number;
  body: string;
  headers: Record<string, string | string[] | undefined>;
}

/**
 * One request to the app copy, redirects not followed. Through `node:http`,
 * not `fetch`: `fetch` drops a `Host` header and can't reach `*.localhost`,
 * and an invitation is only found by its host name.
 */
function send(
  path: string,
  {
    method = "GET",
    host,
    headers = {},
    body,
  }: {
    method?: string;
    host?: string;
    headers?: Record<string, string>;
    body?: string;
  },
): Promise<Answer> {
  return new Promise((resolve, reject) => {
    const outgoing = request(
      `${APP_URL}${path}`,
      { method, headers: { ...headers, ...(host ? { Host: host } : {}) } },
      (incoming) => {
        let text = "";
        incoming.setEncoding("utf8");
        incoming.on("data", (chunk: string) => (text += chunk));
        incoming.on("end", () =>
          resolve({
            status: incoming.statusCode ?? 0,
            body: text,
            headers: incoming.headers,
          }),
        );
      },
    );
    outgoing.on("error", reject);
    outgoing.end(body);
  });
}

/** One header of an answer as a single line. */
function header(answer: Answer, name: string): string | null {
  const value = answer.headers[name];
  return Array.isArray(value) ? value.join("\n") : (value ?? null);
}

/** An invitation's host name on the app copy. */
export function inviteHost(slug: string): string {
  return `${slug}.${APP_BASE}`;
}

/** A page of the app copy as a browser gets it, on the host app unless `host` says otherwise. */
export async function page(
  path: string,
  cookie?: string,
  host?: string,
): Promise<{ status: number; body: string; location: string | null }> {
  const answer = await send(path, {
    host,
    headers: cookie ? { Cookie: cookie } : {},
  });
  return {
    status: answer.status,
    body: answer.body,
    location: header(answer, "location"),
  };
}

/** An invitation as a guest opens it: `/` on its own subdomain. */
export function guestPage(slug: string, cookie?: string) {
  return page("/", cookie, inviteHost(slug));
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
 * the page it runs on (`host` for an invitation's), `args` as its arguments.
 * The answer is React's stream, the action's return value inside it.
 */
export async function action(
  file: string,
  name: string,
  {
    path,
    cookie,
    host,
    args = [],
  }: { path: string; cookie?: string; host?: string; args?: unknown[] },
): Promise<{
  status: number;
  body: string;
  redirect: string | null;
  setCookie: string | null;
}> {
  const manifest = JSON.parse(readFileSync(ACTIONS, "utf8")) as ActionManifest;
  const id = Object.entries(manifest.node).find(
    ([, found]) => found.filename === file && found.exportedName === name,
  )?.[0];
  if (!id) throw new Error(`No Server Action ${name} in ${file}`);
  const answer = await send(path, {
    method: "POST",
    host,
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
    body: answer.body,
    /* An action's `redirect()` names its target here rather than in `Location`. */
    redirect: header(answer, "x-action-redirect"),
    setCookie: header(answer, "set-cookie"),
  };
}
