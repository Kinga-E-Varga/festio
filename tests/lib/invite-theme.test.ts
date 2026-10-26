import { expect, test } from "vitest";
import { inviteTheme } from "@/lib/invitation";
import type { InvitationTemplate } from "@/types/invitation";

/* Only what the theme reads: two faces, a palette, a ground. */
function template(
  background: InvitationTemplate["background"],
): InvitationTemplate {
  return {
    palette: { color1: "#111111", color2: "#222222" },
    fonts: {
      primary: { className: "face-a", cssVar: "--face-a" },
      secondary: { className: "face-b", cssVar: "--face-b" },
    },
    background,
  } as unknown as InvitationTemplate;
}

test("an invitation's theme wears its page ground", () => {
  const theme = inviteTheme(template({ kind: "solid", color: "color1" }));
  expect(theme.className).toBe("invite face-a face-b bg-[var(--c1)]");
});

test("the card alone wears the faces and palette, not the page ground", () => {
  const theme = inviteTheme(
    template({ kind: "image", src: "/paper.png", under: "color2" }),
    { ground: false },
  );
  expect(theme.className).toBe("invite face-a face-b");
  expect(theme.style).toEqual({
    "--c1": "#111111",
    "--c2": "#222222",
    "--font-primary": "var(--face-a)",
    "--font-secondary": "var(--face-b)",
  });
});
