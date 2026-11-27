import { describe, expect, it } from "vitest";
import { eventStamp, stampWithoutData } from "@/lib/event-stamp";

describe("eventStamp", () => {
  it("joins the three versions", () => {
    expect(
      eventStamp({ version: 3, dataVersion: 12, invitationVersion: 1 }),
    ).toBe("3.12.1");
  });

  it("is 0.0.0 for a card never saved", () => {
    expect(
      eventStamp({ version: 0, dataVersion: 0, invitationVersion: 0 }),
    ).toBe("0.0.0");
  });

  it("differs when only dataVersion differs", () => {
    const a = eventStamp({ version: 1, dataVersion: 4, invitationVersion: 1 });
    const b = eventStamp({ version: 1, dataVersion: 5, invitationVersion: 1 });
    expect(a).not.toBe(b);
  });
});

describe("stampWithoutData", () => {
  it("joins version and invitationVersion", () => {
    expect(
      stampWithoutData({ version: 3, dataVersion: 12, invitationVersion: 1 }),
    ).toBe("3.1");
  });

  it("is the same when only dataVersion differs", () => {
    const a = stampWithoutData({
      version: 1,
      dataVersion: 4,
      invitationVersion: 2,
    });
    const b = stampWithoutData({
      version: 1,
      dataVersion: 5,
      invitationVersion: 2,
    });
    expect(a).toBe(b);
  });

  it("differs when version or invitationVersion differs", () => {
    const card = { version: 1, dataVersion: 4, invitationVersion: 2 };
    expect(stampWithoutData({ ...card, version: 2 })).not.toBe(
      stampWithoutData(card),
    );
    expect(stampWithoutData({ ...card, invitationVersion: 3 })).not.toBe(
      stampWithoutData(card),
    );
  });
});
