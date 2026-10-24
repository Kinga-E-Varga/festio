import { expect, test } from "vitest";
import { mentions } from "./page-text";

/* How React and Next write "Ana & Ion's" into a page, by hand. */

test("finds text as written", () => {
  expect(mentions("<p>Ana Pop</p>", "Ana Pop")).toBe(true);
  expect(mentions("<p>Ion Rusu</p>", "Ana Pop")).toBe(false);
});

test("finds text escaped in HTML", () => {
  expect(mentions("<p>Ana &amp; Ion&#x27;s</p>", "Ana & Ion's")).toBe(true);
  expect(mentions('<meta content="Ana &amp; Ion&#39;s"/>', "Ana & Ion's")).toBe(
    true,
  );
});

test("finds text in the page data Next sends along", () => {
  expect(
    mentions('self.__next_f.push([1,"Ana \\u0026 Ion\'s"])', "Ana & Ion's"),
  ).toBe(true);
  expect(mentions('"say \\"hi\\" \\u003cb\\u003e"', 'say "hi" <b>')).toBe(true);
});
