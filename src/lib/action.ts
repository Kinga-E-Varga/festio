import type { ActionResult } from "@/types/actions";

/**
 * A Server Action's result, or `failed` when the request itself never got
 * an answer (offline, the server down), so the caller has one error branch.
 */
export function orFailed<T, E extends string>(
  request: Promise<ActionResult<T, E>>,
): Promise<ActionResult<T, E | "failed">> {
  return request.catch(() => ({ success: false, error: "failed" }) as const);
}
