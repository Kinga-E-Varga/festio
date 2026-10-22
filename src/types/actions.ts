/** What every Server Action returns: its data, or an error key the form turns into words. */
export type ActionResult<T = undefined, E extends string = string> =
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: E };
