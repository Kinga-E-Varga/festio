import { expect, test } from "vitest";
import { clientIp } from "@/lib/client-ip";

/*
 * Expected values from what App Hosting really sent on festio-staging
 * (2026-11-27): the caller was 82.78.19.42; the caller wrote `1.2.3.4` into
 * `x-forwarded-for`, `5.6.7.8` into `x-real-ip` and `9.9.9.9` into
 * `x-fah-client-ip`, which App Hosting overwrote.
 */
const STAGING = {
  "x-fah-client-ip": "82.78.19.42",
  "x-forwarded-for": "1.2.3.4,82.78.19.42,35.219.200.119,66.249.81.4",
  "x-real-ip": "5.6.7.8",
};

test("on App Hosting, the caller's IP, not a Google proxy or a forged entry", () => {
  expect(clientIp(new Headers(STAGING))).toBe("82.78.19.42");
});

test("without App Hosting's header, or with it empty, the last x-forwarded-for entry", () => {
  expect(
    clientIp(new Headers({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" })),
  ).toBe("10.0.0.1");
  expect(
    clientIp(
      new Headers({
        "x-fah-client-ip": "",
        "x-forwarded-for": "1.2.3.4, 10.0.0.1",
      }),
    ),
  ).toBe("10.0.0.1");
});

test("x-real-ip is never trusted; nothing to go on is one shared count", () => {
  expect(clientIp(new Headers({ "x-real-ip": "5.6.7.8" }))).toBe("unknown");
  expect(clientIp(new Headers())).toBe("unknown");
});
