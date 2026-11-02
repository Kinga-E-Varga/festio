import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { iconMode, itemMark } from "@/modular/item-marks";
import { DEFAULT_BASICS } from "@/modular/defaults";
import { sectionValues } from "@/modular/samples";
import { section as schedule } from "@/modular/sections/schedule";
import { turnTone } from "@/modular/styles";
import type { SectionValues, VariantModule } from "@/types/modular";

describe("iconMode", () => {
  test("a section saved before the switches: icons", () => {
    expect(iconMode({})).toBe("icons");
  });

  test("Use icons on, Use numbers off: icons", () => {
    expect(iconMode({ icons: true, numbers: false })).toBe("icons");
  });

  test("Use numbers on: numbers", () => {
    expect(iconMode({ icons: true, numbers: true })).toBe("numbers");
  });

  test("Use icons off: none, whatever Use numbers says", () => {
    expect(iconMode({ icons: false })).toBe("none");
    expect(iconMode({ icons: false, numbers: true })).toBe("none");
  });
});

describe("itemMark", () => {
  test("numbers: the item's place from 01, its icon ignored", () => {
    expect(itemMark("numbers", "heart", 0)).toEqual({ number: "01" });
    expect(itemMark("numbers", "", 1)).toEqual({ number: "02" });
    expect(itemMark("numbers", undefined, 9)).toEqual({ number: "10" });
  });

  test("icons: the item's own icon", () => {
    expect(itemMark("icons", "heart", 3)).toEqual({ icon: "heart" });
  });

  test("icons: no mark for no icon or an unknown one", () => {
    expect(itemMark("icons", "", 0)).toBeNull();
    expect(itemMark("icons", undefined, 0)).toBeNull();
    expect(itemMark("icons", "not-an-icon", 0)).toBeNull();
  });

  test("none: no mark, icon or not", () => {
    expect(itemMark("none", "heart", 0)).toBeNull();
  });
});

describe("turnTone", () => {
  test("by default the accent first, then the secondary in turn", () => {
    expect([0, 1, 2, 3].map((i) => turnTone(i))).toEqual([
      "accent",
      "secondary",
      "accent",
      "secondary",
    ]);
  });

  test("secondary first: the secondary, then the accent in turn", () => {
    expect([0, 1, 2, 3].map((i) => turnTone(i, "secondary"))).toEqual([
      "secondary",
      "accent",
      "secondary",
      "accent",
    ]);
  });
});

/*
 * Schedule with Use numbers on: two days of two events each. Numbered from
 * 01 again each day, every style that draws its events' icons shows 01 and
 * 02 twice and never 03.
 */
describe("Schedule numbers", () => {
  const sample = sectionValues(schedule, "en");
  const days = sample.days as { values: SectionValues; items: unknown[] }[];
  const event = days[0].items[0];
  const values: SectionValues = {
    ...sample,
    icons: true,
    numbers: true,
    days: [
      { values: days[0].values, items: [event, event] },
      { values: days[1].values, items: [event, event] },
    ],
  } as SectionValues;

  const marked = schedule.variants.filter(({ shows }) =>
    shows?.includes("days.items.icon"),
  );

  test("the styles that draw the events' icons", () => {
    expect(marked.map(({ id }) => id).sort()).toEqual([
      "1",
      "10",
      "11",
      "12",
      "4",
      "6",
    ]);
  });

  for (const { id } of marked) {
    test(`style ${id}: 01 and 02 each day, never 03`, async () => {
      const { Variant } = (await import(
        `@/modular/sections/schedule/${id}.tsx`
      )) as VariantModule;
      const html = renderToStaticMarkup(
        createElement(Variant, {
          values,
          basics: DEFAULT_BASICS,
          language: "en",
          related: {},
          ground: "surface",
        }),
      );
      const count = (n: string) => html.split(`>${n}<`).length - 1;
      expect([count("01"), count("02"), count("03")]).toEqual([2, 2, 0]);
    });
  }
});
