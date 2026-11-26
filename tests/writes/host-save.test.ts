import { expect, test, vi } from "vitest";
import { z } from "zod";
import { hostSave } from "@/actions/host-save";
import { newId } from "@/lib/id";

/* `hostSave` counts every host save, even one its schema refuses, before anything else. */

const signedIn = vi.hoisted(() => ({ hostId: "" }));
vi.mock("@/db/reads/session", () => ({
  requireHostId: async () => signedIn.hostId,
}));
vi.mock("next/cache", () => ({ refresh: () => {} }));

test("past 150 saves in an hour, a host save is refused as too many", async () => {
  signedIn.hostId = newId();
  const save = vi.fn(async () => {});
  const send = (input: unknown) => hostSave(z.literal("ok"), input, save);

  /* Refused by the schema, still counted. */
  for (let at = 0; at < 149; at++) {
    expect(await send("bad")).toEqual({ success: false, error: "invalid" });
  }
  expect(await send("ok")).toEqual({ success: true, data: undefined });
  expect(await send("ok")).toEqual({ success: false, error: "tooMany" });
  expect(save).toHaveBeenCalledTimes(1);
}, 60_000);

test("a lookup with limit: false is never counted", async () => {
  signedIn.hostId = newId();
  const look = () =>
    hostSave(z.literal("ok"), "ok", async () => {}, {
      refresh: false,
      limit: false,
    });
  for (let at = 0; at < 151; at++) {
    expect((await look()).success).toBe(true);
  }
  expect(await hostSave(z.literal("ok"), "ok", async () => {})).toEqual({
    success: true,
    data: undefined,
  });
}, 60_000);

test("ticks have their own count: 150 saves leave them free, and 600 ticks stop them", async () => {
  signedIn.hostId = newId();
  const save = () => hostSave(z.literal("ok"), "ok", async () => {});
  const tick = () =>
    hostSave(z.literal("ok"), "ok", async () => {}, { limit: "sent" });
  for (let at = 0; at < 150; at++) await save();
  expect((await save()).success).toBe(false);
  for (let at = 0; at < 600; at++) {
    expect((await tick()).success).toBe(true);
  }
  expect(await tick()).toEqual({ success: false, error: "tooMany" });
}, 120_000);
