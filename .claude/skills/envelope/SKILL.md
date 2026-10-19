---
name: envelope
description: Maintain Festio's envelope-opening animation (src/components/envelope/) — rebuild the app's drawing from the editable SVG (.claude/skills/envelope/drawing/envelope-edit.svg) after the user changes it, or change the animation (timing, motion, hover) or the envelope colours. Use when the user mentions the envelope, its layers, flap, liner, pocket, tag or seal.
argument-hint: "[what changed, or the change you want]"
---

# Envelope

The guest's first sight of an invitation: a closed envelope in the invitation's colours,
over every simple and modular invitation, on the guest page and in both editors (the host
can switch it off in the Design tab). Hovered with a mouse it lifts and the tag drops; a
click turns the flap open, and once it settles the envelope fades into the page. Not built:
seal / string motion.

**Request:** $ARGUMENTS

## Where things are

| What                 | Where                                                                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The drawing (master) | `.claude/skills/envelope/drawing/envelope-edit.svg` — the user edits it in Inkscape                                                                                        |
| Last built drawing   | `.claude/skills/envelope/drawing/envelope-built.svg` — what the app was last built from (`diff` compares against it)                                                       |
| Built drawing (app)  | `src/components/envelope/drawing.generated.ts` — written by `build-app`, never edited by hand                                                                              |
| Layers + motion      | `src/components/envelope/Envelope.tsx` — the layers, hover, click, fade; `motion.ts` — timings, flap keyframes, fades; `tag.ts` — the tag's words                          |
| Colours              | `src/components/envelope/colors.ts` — roles → `--env-*` vars, the fixed shading; each palette's `envelope` (`src/modular/palettes/`) and each simple template's `envelope` |
| CSS                  | the envelope block at the end of `@layer components` in `src/app/globals.css`                                                                                              |
| Tools                | `.claude/skills/envelope/envelope.py` — `check`, `diff`, `build-app`, `mark-built`; `hover-click.mjs` — hover, click and screenshot in headless Chromium                   |
| History              | `context/handoffs/envelope-handoff.md` (git-ignored; read only when the user names it) — earlier decisions. History only, don't update it                                  |

Rounded corners in `envelope-edit.svg` are plain curves: the original drawing's live
Inkscape corner effects were flattened. Reshaping a rounded edge means editing its path.
The closed envelope's top corners are rounded 0.6 (closed flap and closed side flaps), the
bottom corners about 1.0; open, the side flaps' top corners stay sharp, so no liner shows.

Always work from the files as they are now — never from memory or earlier in the
conversation. The user edits the SVG by hand.

## The steps

Run the tools from the repo root with `python3 -I .claude/skills/envelope/envelope.py …`.

1. **Read the request** and sort it: a drawing change (the SVG), an animation or UI change
   (`Envelope.tsx`, `motion.ts`, `tag.ts`, the CSS), a colour change (a palette's or
   template's `envelope`, or the shading in `colors.ts`), or several.
2. **For a drawing change, run `check` and `diff`.** `check` lists missing or unknown
   layers and any colour that isn't a role. `diff` lists what changed against the last build:
   shapes, moves, opacity, blend, blur, clip.
3. **Report, then stop and wait for the user's OK.** Always, for every change. Say in plain
   words what you found and what you'll do, and ask about anything unclear. A new colour
   needs a role (an existing one or a new one); a changed shape whose closed and open
   versions should match needs the other version changed too. For an animation change, say
   what you'll change (timing, easing, which parts) and wait the same way.
4. **Build** (drawing changes only): `build-app` writes and formats `drawing.generated.ts`.
5. **Check it in the app** (see _Checking_): closed, mid-turn and open, on
   `/templates/wolf-dance` and `/templates/olive-garden`. Look at the part that changed.
6. **Run `mark-built`** (drawing changes only) so the next `diff` starts from what the app
   was built from.

Then tell the user what changed and what you checked. Don't commit; it follows the
project's feature workflow.

## The drawing

One coordinate system for everything: the file's viewBox (`92 178 116 124`). The fold the
flap turns on is y 214.514; the closed body spans x 103–197, y 214.514–274. Both are
constants at the top of `envelope.py` (`FOLD`, `BODY`) — update them if the user moves or
resizes the envelope.

### Layers, bottom to top

Each state's parts sit at their real depth, so a state is split over several layers. Hide
every `· open` layer to see it closed, every `· closed` layer to see it open.

| Layer                         | Holds                                                                                | In the app                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Background (locked)           | `#f0e9cf`, only to see the envelope against                                          | not used — the invitation's own ground                                 |
| Back · open                   | group `cast shadow`; group `inside + open flap`                                      | cast layer; split at the fold into the inside and the flap's back face |
| Back · closed                 | group `cast shadow`                                                                  | cast layer                                                             |
| Side flaps · shared           | `side flaps (closed)` — rounded top corners                                          | pocket                                                                 |
| Side flaps · open             | `side flaps (open)` — sharp corners, over the closed paper; the bottom flap's shadow | pocket, cross-fade                                                     |
| Side flaps · closed           | the bottom flap's shadow on them (closed version)                                    | pocket, cross-fade                                                     |
| Side flap shading · shared    | `side shadows` (one per side flap), then `side flap highlights`                      | pocket                                                                 |
| Bottom flap · shared          | `bottom flap`: paper, darken, the top flap's shadow                                  | pocket                                                                 |
| Bottom flap · open / · closed | its highlight                                                                        | pocket, cross-fade                                                     |
| Flap · closed                 | its shadow on the pocket, then group `closed flap`                                   | shadow → pocket; `closed flap` → the flap's front face                 |
| Decoration · shared           | four groups, by how they move (below)                                                | one layer per group; the tag's group gives two                         |

Layer names and the groups named above are what the build looks for — they must stay. So
must the label `inside shadow` (inside `inside + open flap`): the build lifts that shadow
into its own multiplied layer, `env-inside-shade`, above the inside and under the pocket
(`split_inside_shadow`).

### Decoration: the group decides how a shape moves

Decoration holds four groups (`DECO_GROUPS`), bottom to top exactly as the app stacks
them. The group a shape sits in decides where it goes and how it moves; its own label
doesn't matter. `check` flags a missing or doubled group, the wrong order, and any shape
outside all four.

| Group (bottom to top)            | App layer                      | Moves                                                                             |
| -------------------------------- | ------------------------------ | --------------------------------------------------------------------------------- |
| `tag shadow · lifts less, blurs` | `env-tag-shade` (multiply)     | swings with the tag; on hover rises 2%, grows 4%, blurs 6px — reads as lifted off |
| `tag · swings`                   | the group `tag` → `env-tag`    | swings around the hole; lifts with the envelope                                   |
|                                  | anything else → `env-tag-hard` | (multiply) exactly as the tag — shadows hugging it, like `tag hard shadow`        |
| `shadows on the envelope`        | `env-deco-shade` (multiply)    | lifts with the envelope; multiplies onto the tag too                              |
| `on the envelope`                | `env-deco`                     | lifts with the envelope; drawn over the tag (the strings run through its hole)    |

The tag shadow group and the shapes beside `tag` in `tag · swings` are cast shadows: the
cast colour (`#847246` → the shadow role) is allowed there, and shading never changes it.
Everything in the last two groups is trimmed past the hole (`trim_strings`): only the
strings reach onto the tag's paper, so nothing else loses anything.

Labels the build still reads: the group `tag` (inside `tag · swings`); inside it the paper,
a path labelled `tag` whose second subpath is the hole cut in it — the hole's centre is the
point the tag turns around (`hole_in`), and the paper-centre → hole direction is the
strings' side for the trim; `hole shadow`, a circle or a drawn shape (the app reads the
tag's direction from its box's centre). A clip path in the file's definitions is labelled
`tag` too: look for the paper inside the group only.

The tag's soft shadow: one light shadow (0.255, small blur). Keep shading inside the
paper: a multiply shape over nothing in an isolated layer shows its own colour. The build
also seals the tag's edge (`seal_tag_edge`): the tag sits on a copy of its paper spread 0.2
past the edge, and the whole tag is clipped to the paper's shape, so every pixel under the
darkening has paper below (otherwise a pale line shows along the darkened edges).

**Naming.** Groups say which part (`bottom flap`, `side flaps (open)`), the shapes in them
what they are: `paper`, `shadow`, `highlight`, `darken`, `shading`; pairs say which one
(`· left` / `· right`, `soft` / `tight` shadow). "Flap", never "flop". Give every new part
a name like these.

A paper shape with a closed and an open version keeps the closed one on the shared layer
underneath and the open one on the `· open` layer above it: one opaque paper is always
there, so nothing shows through while they cross-fade.

### Colour roles

The drawing uses one placeholder colour per role; the build swaps each for its role's
variable.

| Placeholder | Role        | Notes                                                                                                                                            |
| ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `#ccb885`   | Paper       |                                                                                                                                                  |
| `#617140`   | Liner       | also the tag's text and stitching                                                                                                                |
| `#8c5a2b`   | String      |                                                                                                                                                  |
| `#d1c598`   | Tag         |                                                                                                                                                  |
| `#a02c2c`   | Seal        |                                                                                                                                                  |
| `#847246`   | Cast shadow | the shadow role as it is. Only in `cast shadow` groups, the tag shadow group and beside `tag` in `tag · swings` — `check` flags it anywhere else |

Each modular palette (`src/modular/palettes/<id>.ts`) and each simple template carries an
`envelope`: `paper`, `liner`, `string`, `seal`, `tag`, `shadow`, each a 6-digit hex or
another envelope role's name (`seal: "liner"` follows the liner) — never a palette
colour's name. A loop or a bad hex throws, naming the role (`roleColor` in `colors.ts`).
The tag's font is the invitation's `--font-primary` (a font pair's body face).

**Shading.** In the drawing, a shadow is its role colour multiplied onto itself and a
highlight is it screened onto itself — muddy on a dull palette. So the build gives every
multiply or screen shape (or shape inside a blended group) `var(--env-<role>-mul)` /
`var(--env-<role>-scr)` instead of `var(--env-<role>)` (`shading` in `envelope.py`);
opacities stay as drawn. `colors.ts` fills them, fixed at **Hue + Vivid**: shadows turn
10° toward cold (OKLCH hue 235), highlights 15° toward warm (55), the short way round and
stopping at the target; then highlights are mixed half with white and given chroma × 1.5,
shadows chroma × 1.15. Lightness never changes, no role's colour reaches another's
shading, and the cast shadows keep their own colour. The maths is in TypeScript, not CSS:
a colour the screen can't show, blurred and blended, came out as cyan specks in Chrome, so
only its chroma gives way until it fits.

## The app

Stacked layers sharing the viewBox, back to front: cast shadow, inside, inside shadow,
pocket, flap (an HTML box turned in CSS 3D, with a front and a back face, each its own SVG),
the tag's shadow, the tag's hard shadows, the tag, the other decoration shadows (string,
seal — they shade the tag too), the string and seal, an invisible button over the closed
body (`env-hit`) and a hover area over the tag (`env-hit-tag`). The tag sits under the
string so the string stays in its hole while it swings. Past the hole the string goes
behind the tag: the build trims it (and its `tight shadow`) to the seal's side of a line
through the hole, plus everywhere off the tag paper (`trim_strings`). In the drawing the
tag stays on top, so nothing changes there.

The envelope covers the invitation (`env-stage`, z-40, under the simple editor's panel at
z-50) on the invitation's own ground. Until it has faded, the page under it is `inert`
(`useSealed`); turning the Design tab's switch off and on seals it again.

- **Hover** (mouse only, closed only, over the body or the tag — one hover, moving between
  them is no new turn; never with reduced motion): every layer grows 4% from the body's
  centre and rises 3%; the cast shadow grows 5.5% and rises only 2%, so a little more of it
  shows below, as if lifted. The tag's shadow rises 2%, grows 4% and blurs 6px. CSS, in
  `@media (hover: hover) and (prefers-reduced-motion: no-preference)`.
- **Tag drop:** on hover the tag and its shadows turn −25° around the hole, with a slight
  overshoot (0.55 s), and stay there while hovered; on leaving or on the click they turn
  back to 0 (0.45 s) (`SWING` in `motion.ts`). Each turn starts from where the tag is.
- **Tag text:** the `Envelope.tag` message in the invitation's language (`\n` splits the
  lines: EN "Open / me", RO "Deschide- / mă", HU "Nyiss / ki"), written along the tag from
  its bottom up toward the hole, ink in the liner colour, multiplied into the tag. The build
  puts an empty `<text class="env-tag-text">` in the tag group, over the paper and `darken`,
  under the highlights, in the paper's coordinates (`tag_text`), and marks the paper and
  `hole shadow`. `placeTag` finds the tag's direction from them (hole → the paper's centre),
  so a tag drawn at any angle works; the words sit at 0.53 of the tag's length from the
  hole and shrink to fit inside the stitching, again once the fonts load and when the font
  pair changes. A paper drawn scaled would shrink the text: `placeTag` undoes its scale.
- **Click** (anywhere on the envelope, or Enter / Space on `env-hit`): the flap turns
  0° → 180° on the fold, toward the viewer, then settles with a small bounce
  (180° → 173° → 180°): 1.3 s (`FLAP_MS`). Past 90° the front face hides and the back face
  shows. Then `data-state="open"` lays the flap flat again.
- **Fades,** on the flap's clock, frame by frame (`openingFades`): the flap's shadow on the
  pocket spreads and fades as the flap lifts — its blur grows to 4× its own as its opacity
  goes to 0, both read from the flap's angle, done as it stands up at 90°. Each closed /
  open pair (pocket shading, cast shadow) cross-fades together, so the shading never goes
  missing.
- **Into the page:** open and still for 0.15 s (`SETTLE_MS`), then the whole envelope
  fades out (0.6 s, `FADE_MS`) and unmounts; the page stops being inert.
- **Reduced motion:** no flap, no swing, no lift: the closed envelope fades straight out
  (0.3 s, `REDUCED_FADE_MS`).

## Lessons — keep these

- **Every id, class and colour variable in the drawing is prefixed `env-`** (`for_app` in
  `envelope.py`), so nothing on the invitation's page reaches the drawing and the drawing's
  ids never clash. A new class the app needs goes into `APP_CLASSES`; the CSS and
  `motion.ts` / `tag.ts` use the prefixed names (`env-v-open`, `env-flap-shadow`…).
- **The global reduced-motion rule in `globals.css` doesn't reach the envelope** (its
  selector reads `i *`). The envelope handles reduced motion itself.
- **The page's own classes reach the envelope's layers.** A `.tag` rule for a page label
  once turned the tag's text into spaced capitals. Give page chrome names no layer uses.
- **Browsers ignore a clip path made of a group or a `<use>` of a group.** Inkscape allows
  both. Clip paths in the file are plain shapes; keep them that way.
- **A clipped group is drawn on its own,** so a multiply or screen inside it has nothing
  under it to blend with and vanishes. The blend goes on the clipped group itself. The build
  lifts it automatically when every child blends the same way; otherwise fix it in the file.
- **A fading group is drawn on its own too.** Fade each blended part, never a wrapper
  around it.
- **Each layer with a transform is drawn on its own,** so shadows that fall on another layer
  (the cast shadow, the decoration's shadows) sit on their own layer with
  `mix-blend-mode: multiply` on the whole layer.
- **Cross-fade closed and open versions at the same time.** One after the other leaves a
  moment with neither.
- **Keep transforms at full precision.** Rounding the seal's tiny scale moved it.
- **Every shape has its own blur filter.** Inkscape changes a shared filter for every shape
  using it, so one blur edit changed another part. A shape copied in Inkscape shares its
  original's filter: give the copy its own (same values) before building.
- **Saved as Plain SVG, every layer goes missing.** Plain SVG drops `inkscape:label` and the
  layer marks; ids survive. Put the names, `inkscape:groupmode` and the Background's lock
  back by id from `envelope-built.svg`, and tell the user to save as Inkscape SVG (and to
  reopen the file first, or the next save drops them again).
- **`diff` compares clips and blurs as raw text.** A definition can show as changed when
  Inkscape only rewrote its layout, or recalculated a blur's area after a move. Compare the
  real values (path, blur amount) before reporting one as a change.
- **Inkscape may write `mix-blend-mode:normal` on a shape inside a blended group.** It
  changes nothing in the drawing, so the build ignores it and keeps the group's blend (and
  the shading).
- **A colour set on a whole group never shows when every shape inside has its own.**
  Inkscape leaves one when a colour is picked with the group selected; the build drops it
  (`drop_dead_fills`) instead of flagging it.
- **Stroke to Path writes a black `stop-color` on the new shape.** It means something only
  on a gradient's stop, so it never shows; the build drops it (`drop_dead_stops`) instead of
  flagging `#000000` as a new colour.
- **The tag's paper may sit in a group of its own inside `tag`.** The build finds it at
  any depth and puts the text over every child holding the paper or a `darken`.

## Checking

Start `npm run dev`, then, with headless Chromium from Playwright's cache:

```bash
B=$(ls -d ~/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell | tail -1)
$B --no-sandbox --screenshot=<scratchpad>/closed.png --window-size=1280,860 --virtual-time-budget=6000 http://localhost:3000/templates/wolf-dance
node .claude/skills/envelope/hover-click.mjs "$B" http://localhost:3000/templates/olive-garden <scratchpad>/mid.png 500
```

`hover-click.mjs` moves the mouse over `env-hit`, clicks and screenshots after the given
ms: ~500 the flap turning, ~1400 settled open, ~2600 gone. The guest page is
`http://localhost:3000/maria-andrei` (Romanian).

Headless Chromium reports no hover-capable pointer, and CDP can't emulate one, so the
hover lift never shows in a screenshot. Check it in a real browser, or read the rule's
media condition from `document.styleSheets`.
