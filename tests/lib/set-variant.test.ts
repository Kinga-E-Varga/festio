import { expect, test } from "vitest";
import { setVariant } from "@/modular/state";
import type {
  ModularState,
  SectionDefinition,
  SectionValues,
} from "@/types/modular";

/*
 * A made-up section: "plain" shows the heading and each place's name;
 * "full" adds the photos switch, the eyebrow, each place's photo, the days' labels and their
 * items' times, and the tags list.
 */
const LABEL = { en: "x", ro: "x", hu: "x" };
const SECTION: SectionDefinition = {
  id: "s",
  name: LABEL,
  required: false,
  order: 0,
  variants: [
    {
      id: "plain",
      name: LABEL,
      shows: ["heading", "places.name"],
    },
    {
      id: "full",
      name: LABEL,
      shows: [
        "eyebrow",
        "heading",
        "photos",
        "places.name",
        "places.photo",
        "days.label",
        "days.items.time",
        "tags.word",
      ],
    },
  ],
  fields: [
    { id: "photos", label: LABEL, type: "toggle" },
    { id: "eyebrow", label: LABEL, type: "text", maxLength: 10 },
    { id: "heading", label: LABEL, type: "text", maxLength: 10 },
    {
      id: "places",
      label: LABEL,
      type: "list",
      maxItems: 3,
      item: [
        { id: "name", label: LABEL, type: "text", maxLength: 10 },
        { id: "photo", label: LABEL, type: "image", maxLength: 10 },
      ],
    },
    {
      id: "days",
      label: LABEL,
      type: "groups",
      maxGroups: 3,
      groupLabel: LABEL,
      addLabel: LABEL,
      group: [{ id: "label", label: LABEL, type: "text", maxLength: 10 }],
      items: {
        label: LABEL,
        itemLabel: LABEL,
        addLabel: LABEL,
        maxItems: 3,
        item: [{ id: "time", label: LABEL, type: "text", maxLength: 10 }],
      },
    },
    {
      id: "tags",
      label: LABEL,
      type: "list",
      maxItems: 3,
      item: [{ id: "word", label: LABEL, type: "text", maxLength: 10 }],
    },
  ],
};

const SAMPLES: SectionValues = {
  photos: true,
  eyebrow: "Sample eyebrow",
  heading: "Sample heading",
  places: [
    { name: "Hall", photo: "/hall.jpg" },
    { name: "Church", photo: "/church.jpg" },
  ],
  days: [
    {
      values: { label: "Day 1" },
      items: [{ time: "10:00" }, { time: "12:00" }],
    },
  ],
  tags: [{ word: "one" }, { word: "two" }],
};

function stateWith(variant: string, values: SectionValues): ModularState {
  return {
    palette: "p",
    fontPair: "f",
    pattern: null,
    corners: "sharp",
    envelope: true,
    sections: [{ section: "s", variant, on: true }],
    values: { s: values },
  };
}

test("picks the new variant", () => {
  const next = setVariant(stateWith("plain", {}), SECTION, "full", SAMPLES);
  expect(next.sections[0].variant).toBe("full");
});

test("an empty field only the new variant shows gets its sample", () => {
  const next = setVariant(
    stateWith("plain", { eyebrow: "" }),
    SECTION,
    "full",
    SAMPLES,
  );
  expect(next.values.s.eyebrow).toBe("Sample eyebrow");
});

test("a field missing from the values gets its sample too", () => {
  const next = setVariant(stateWith("plain", {}), SECTION, "full", SAMPLES);
  expect(next.values.s.eyebrow).toBe("Sample eyebrow");
});

test("a field only the new variant shows keeps the host's own text", () => {
  const next = setVariant(
    stateWith("plain", { eyebrow: "Mine" }),
    SECTION,
    "full",
    SAMPLES,
  );
  expect(next.values.s.eyebrow).toBe("Mine");
});

test("a field both variants show stays empty: the host cleared it", () => {
  const next = setVariant(
    stateWith("plain", { heading: "" }),
    SECTION,
    "full",
    SAMPLES,
  );
  expect(next.values.s.heading).toBe("");
});

test("a switch the host turned off stays off", () => {
  const next = setVariant(
    stateWith("plain", { photos: false }),
    SECTION,
    "full",
    SAMPLES,
  );
  expect(next.values.s.photos).toBe(false);
});

test("a newly shown switch the host never set is not filled from the samples", () => {
  const next = setVariant(stateWith("plain", {}), SECTION, "full", SAMPLES);
  expect(next.values.s.photos).toBeUndefined();
});

test("each list item's newly shown empty field gets the sample at its place", () => {
  const next = setVariant(
    stateWith("plain", {
      places: [
        { name: "Mine 1", photo: "" },
        { name: "Mine 2", photo: "/own.jpg" },
        { name: "Mine 3" },
      ],
    }),
    SECTION,
    "full",
    SAMPLES,
  );
  // The third has no sample of its own: the first sample's stands in.
  expect(next.values.s.places).toEqual([
    { name: "Mine 1", photo: "/hall.jpg" },
    { name: "Mine 2", photo: "/own.jpg" },
    { name: "Mine 3", photo: "/hall.jpg" },
  ]);
});

test("a newly shown empty list gets the sample list", () => {
  const next = setVariant(
    stateWith("plain", { tags: [] }),
    SECTION,
    "full",
    SAMPLES,
  );
  expect(next.values.s.tags).toEqual([{ word: "one" }, { word: "two" }]);
});

test("groups: a group's and its items' newly shown empty fields get their samples", () => {
  const next = setVariant(
    stateWith("plain", {
      days: [
        { values: { label: "" }, items: [{ time: "" }, { time: "9:00" }] },
      ],
    }),
    SECTION,
    "full",
    SAMPLES,
  );
  expect(next.values.s.days).toEqual([
    {
      values: { label: "Day 1" },
      items: [{ time: "10:00" }, { time: "9:00" }],
    },
  ]);
});

test("other sections' values are left as they are", () => {
  const state = stateWith("plain", {});
  state.values.other = { eyebrow: "" };
  const next = setVariant(state, SECTION, "full", SAMPLES);
  expect(next.values.other).toBe(state.values.other);
});

test("back to a variant showing less fills nothing", () => {
  const next = setVariant(
    stateWith("full", { eyebrow: "", heading: "" }),
    SECTION,
    "plain",
    SAMPLES,
  );
  expect(next.values.s).toEqual({ eyebrow: "", heading: "" });
});
