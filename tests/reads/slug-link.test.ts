import { afterEach, expect, test, vi } from "vitest";
import { eventIdBySlug, linkGone } from "@/db/reads/events";

/* Outside a request, `connection()` has nothing to wait for. */
vi.mock("next/server", () => ({ connection: async () => {} }));
/* The sign-in check needs Next's navigation; nothing here signs in. */
vi.mock("@/db/reads/session", () => ({ requireHostId: vi.fn() }));

afterEach(() => vi.restoreAllMocks());

test("a link nobody has is no link, not a broken card", async () => {
  const logged = vi.spyOn(console, "error").mockImplementation(() => {});
  expect(await eventIdBySlug("nobody-has-this")).toBeNull();
  expect(await linkGone("nobody-has-this")).toBe(false);
  expect(logged).not.toHaveBeenCalled();
});
