---
name: cover
description: Make or change a drawn (picture-free) modular cover — an SVG illustration from a reference card, its colours from the palette, scattered decorations like stars, optional hand-made imperfections, gentle motion — and check it at every screen size. Use when the user wants a new illustrated cover or to change the drawing, decorations or imperfections of one.
argument-hint: "[the idea, and a path / link to a reference card]"
---

# Drawn cover

A cover variant in `src/modular/sections/cover/` that needs no photo: a flat
illustration drawn in SVG, decorations scattered round it, the invitation's words
beside or below. Champagne (`3.tsx`, drawing in `Coupe.tsx`) is the first one.

**Brief:** $ARGUMENTS

Read `context/map/modular.md` first, then the existing drawn covers' files — they
may have changed since this skill was written.

## Mockup first — never straight into the app

A new cover (through `/feature` or not) starts as a mockup, not code. Show it in
the visual companion (the brainstorming skill's `visual-companion.md`; offer it in
one short line, start it on a yes, then keep using it): the drawing as a
standalone SVG on the palette's accent ground, with the decorations and the words
in the invitation's fonts, at a phone and a desktop size. Iterate there — shapes,
colours, imperfections, decorations, the words' levels — until the user approves.
Only then add it to `src/modular/sections/cover/` and carry on with the steps
below, checking the real thing at every size (step 7). The mockup is scratch,
never kept.

## The layout is the user's call

Don't copy an existing cover's layout by default. Ask whether this cover repeats
one (and which) or gets its own. If it repeats one and the code for it lives in a
single cover's file, say that this is its second use and propose moving it to a
shared piece first (the project's "extract on second use" rule).

Either way, settle with the user: **poster cover** (shows the Title's lines, the
Title steps aside — see `project-overview.md`) or **mood cover** (sets the scene,
the Title follows).

## 1. Read the reference

The user usually brings a card (Paper Culture style) as a starting point, not
something to trace. Download it into its own folder in the scratchpad and look at
it. Note, in a few words to the user:

- **The objects** and how they're built from simple shapes: a bowl is a half
  ellipse, a stem a long thin trapezoid, a foot a low dome, a bow tie two
  triangles and a dot.
- **The palette:** cards like this use the ground plus very few flat colours —
  usually one or two light tints, one dark accent (the bow tie), sometimes one
  metallic. No gradients, no outlines, no shadows.
- **The character:** a little whimsy (a bow tie on a glass), objects drawn big and
  bold, the small things (bubbles, fizz, stars) light against the ground.
- **Small negative details:** dots in the ground's own colour inside a light shape
  (the fizz in the drink) read as holes. Cheap and charming.
- **The imperfections** it has (see below), even if the user hasn't asked for any —
  they may want them later.

## 2. Draw

- One component per drawing, in its own file next to the cover (`Coupe.tsx`).
  An inline `<svg>` with a `viewBox` in round numbers (e.g. 200 wide), the
  shapes as `<path>`s and `<circle>`s, `aria-hidden`.
- **Every colour mixed from the palette**, never a hex: the ground is the accent
  (`--m-accent`), and the drawing's parts are `color-mix(in oklab, var(--m-accent),
white N%)` for the light parts and `black N%` for the dark accent, set once as
  custom properties on the drawing (`COLORS` in `Coupe.tsx`). One drawing then
  works on every palette. Text on it uses `--m-accent-ink` (and its muted mix).
  Try it on two or three palettes with `npm run look -- --palette <name>`.
- Big and simple first. Shapes the user will want to change one by one (a wing, a
  foot) stay separate paths.
- The cover's own small decorations that belong to the object (bubbles over a
  glass, a few stars right beside it) go inside the drawing, so they move and
  scale with it.

## 3. Imperfections — only when asked

Not a default. When the user asks for imperfections, they mean the look of a
hand-cut paper card: **each shape slightly off true, never broken.**

- **Lines that should be level tilt** a little: a rim, a liquid's surface — and
  not by the same amount or the same way (a liquid tilting against its rim looks
  poured).
- **Pairs aren't equal:** one bow-tie wing bigger, one side of a bowl fuller.
- **Curves are lopsided:** the low point of a bowl or a liquid off centre, a dome
  steep on one side and long on the other — on its top curve; flat bottom edges
  stay flat (they stand on something).
- **Thin parts lean:** a stem slightly off vertical.
- **Stars are hand-cut:** a few star shapes with arms of different lengths, not
  quite evenly spaced, used in turn. Generate them (radius and angle jittered
  per point), don't hand-type five-fold symmetry.
- **A small tilt** on a separate part (the bow tie, 8° round its knot) adds life.

Dose: make a clear first version, then the user tunes it ("a little less",
"make it 70"). Keep the perfect shape and the full version in mind so a
percentage means "this far from perfect to full" — interpolate every number,
don't redraw. On Champagne the user settled at 70%.

## 4. Decorations (stars, dots, confetti…)

Placed by hand, but by a method:

- **Even, no pattern.** Spread over the free space with no rows, columns or
  symmetry. Check that several don't line up along an edge (on a phone five stars
  all 4–7% from the left looked wrong) and that the two sides don't mirror.
- **Only in free space, per layout.** List where the drawing and the words are in
  each layout (stacked phone, side by side, …) and place a set for each, shown
  with container queries (`@3xl:hidden` / `hidden @3xl:block`). One set for all
  layouts never works.
- **Relative to what they avoid.** Place them in the box the drawing and words
  live in, not the whole page, so a wider page can't push one onto the drawing.
  Room that depends on the drawing's size (left of the glass) is computed from it:
  expose the drawing's height as a variable (`--glass-h`) and place with
  `calc()`. Extra margins past a capped column get their own few, shown only once
  the margins are wide enough.
- **Keep a gap round the drawing and the words** — a star touching a bowl or the
  end of a text line looks like a mistake. Check the short phone: its words start
  higher.
- **Size by the box's shorter side** (`cqmin`), three sizes (small / medium /
  large). Sized by height alone they balloon on a tall tablet. Nothing tiny: the
  user's smallest liked size was about 18px on a phone, 21px on a laptop.
- **Fewer than you think.** Champagne ended at 10 on a phone, 12 side by side.
  When some are removed, look again for the gaps left behind.
- Tall layouts (a tablet held upright, side by side) have bigger empty bands; a
  few extra shown only there: `@3xl:[@container(aspect-ratio<=1)]:block`.

## 5. The words: levels and spacing

The words beside or under the drawing (eyebrow, names, date, a details line…)
need a clear order of reading. Ask the user what matters most after the names,
and what belongs together.

- **Not every small line in the same voice.** Three lines of small caps read as a
  stack of labels. Give the second most important one (Champagne: the date) the
  names' voice — the heading face, italic — much smaller; the small caps then only
  frame the block.
- **Make a line noticeable by size, not by space.** A line that's only a little
  bigger than its neighbour reads as its equal. Make it clearly bigger and the
  smaller line can sit close under it as its footnote without stealing from it.
- **Spacing says what belongs together.** A lead-in sits tight on what it leads
  into (eyebrow 12px over the names); a separate level gets room above it
  (24px); a footnote sits close under its parent (12px). Champagne ended:
  eyebrow 12 → names 24 → date 12 → details.
- **Equal pixels don't look equal.** Descenders ("g" in "getting") make a gap
  under large type look smaller; small caps have neither, so a gap round them
  looks bigger; a small line between two big gaps looks like it floats. Judge
  gaps on a screenshot, not by the numbers.
- **Sizes grow with the width** like the names (`clamp(min, Ncqw, max)`), never
  in steps, and a taller block costs the drawing height on a phone — check the
  short phone.

## 6. Motion

Gentle, looping a few times then resting on a still frame; nothing under
`prefers-reduced-motion` (`motion-safe:`). Paused while inert, under the envelope,
or out of view — reuse `PAUSE`, `TWINKLE` and the `--animate-*` keyframes in
`globals.css` (Champagne: bubbles rise and fade, stars twinkle, fizz shimmers),
and give each item its own delay so nothing pulses in step.

## 7. Check every size, every time

With `npm run look` (the `look` skill). Its height is fixed at 900; for other
heights run a copy with the height replaced, deleted after:

```bash
sed "s/height: 900/height: 844/g" scripts/look.mjs > scripts/.l.mjs
node scripts/.l.mjs --section cover --style "<name>" --width 390 --shot --out <scratchpad>
rm scripts/.l.mjs
```

| Screen         | Size        | Why                                        |
| -------------- | ----------- | ------------------------------------------ |
| Phone          | 390 × 844   | stacked                                    |
| Short phone    | 360 × 640   | words start higher, less room              |
| Upright tablet | 872 × 1180  | side by side but tall: big empty bands     |
| Laptop         | 1438 × 768  | the most common; short                     |
| Wide           | 2472 × 1000 | past every cap: margins, nothing stretched |

Measure first (`--measure`), screenshot to judge the look. Note the editor's
strip makes the invitation ~72px narrower than the screen.

## Things learned the hard way

- **Container units measure the nearest container.** `cqw`/`cqh` inside the
  drawing's box measure that box; on the box itself they measure its parent. A
  custom property holding `cqh` resolves where it's used — handy (`--glass-h`).
- **Padding on a size container shrinks what its children's `@3xl` sees** — at
  800px a padded grid fell under 768px inside and its children dropped to the
  phone layout. Put padding on the children.
- **Tailwind orders arbitrary container variants before named ones**, so
  `@min-[1441px]/page:h-…` loses to `@3xl:h-…`. Bound the other one
  (`@3xl:@max-[1441px]/page:`) instead.
- **A gap in `%` on a grid measures the grid** — use it, not `cqw`, when the grid
  can be wider than its container.
- **Words beside a drawing get half the width.** Sizes made for a full-width
  Title (`NAMES_SIZE`) wrap to four lines there; size them by the width they have
  (`min(80px, 4.5cqw)`), smooth, not in steps.
- **Sizes with breakpoints: list the steps and ask** before changing them.
- New variant = a new id in the section's `index.ts`, never reused; no change to
  stored ids or saved data's shape. Names in en, ro and hu.
