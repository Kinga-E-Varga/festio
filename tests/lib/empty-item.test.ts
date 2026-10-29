import { expect, test } from "vitest";
import { emptyItem } from "@/modular/fields";
import { LABELS } from "@/modular/labels";

test("a new item's icon field starts with the default icon, the rest empty", () => {
  const item = emptyItem([
    { id: "title", label: LABELS.title, type: "text", maxLength: 60 },
    { id: "icon", label: LABELS.icon, type: "icon", maxLength: 20 },
  ]);
  expect(item.title).toBe("");
  expect(item.icon).toBe("sparkle");
});
