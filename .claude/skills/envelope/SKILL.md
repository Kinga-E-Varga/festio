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

| What                 | Where                                                                                                                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The drawing (master) | `.claude/skills/envelope/drawing/envelope-edit.svg` — the user edits it in Inkscape                                                                                                      |
| Last built drawing   | `.claude/skills/envelope/drawing/envelope-built.svg` — what the app was last built from (`diff` compares against it)                                                                     |
| Built drawing (app)  | `src/components/envelope/drawing.generated.ts` — written by `build-app`, never edited by hand                                                                                            |
| Layers + motion      | `src/components/envelope/Envelope.tsx` — the layers, hover, click, fade; `motion.ts` — timings, flap keyframes, fades; `card.ts` — the simple card's way out; `tag.ts` — the tag's words |
| Colours              | `src/components/envelope/colors.ts` — roles → `--env-*` vars, the fixed shading; each palette's `envelope` (`src/modular/palettes/`) and each simple template's `envelope`               |
| CSS                  | the envelope block at the end of `@layer components` in `src/app/globals.css`                                                                                                            |
| Tools                | `.claude/skills/envelope/envelope.py` — `check`, `diff`, `build-app`, `mark-built`; `hover-click.mjs` — hover, click and screenshot in headless Chromium                                 |
| History              | `context/handoffs/envelope-handoff.md` (git-ignored; read only when the user names it) — earlier decisions. History only, don't update it                                                |

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

The one exception: the `inside shadow` keeps the colour it is drawn in (now `#776755`), not a
role. It falls on the card or page in the pocket too, so it stays neutral in every palette;
`check` allows any colour on that shape only. Its fill and its outline (stroke) are both
`#776755`: a role colour left on either still turns into that role, so `check` won't catch it.

Each modular palette (`src/modular/palettes/<id>.ts`) and each simple template carries an
`envelope`: `paper`, `liner`, `string`, `seal`, `tag`, `shadow`, each a 6-digit hex or
another envelope role's name (`seal: "liner"` follows the liner). A palette's may also name
one of its own colours (`seal: "secondary"`), so it follows the palette; `paletteEnvelope` in
`colors.ts` swaps those for their hex, an envelope role winning a shared name. A simple
template has no palette, so only hex or envelope roles. A loop, a bad hex or an unknown name
throws, naming the role (`roleColor`, `paletteEnvelope`).
A palette's envelope has a seventh colour, `ground`: what the envelope sits on (the guest
page's stage and the modular editor's area), never shaded, as `--env-ground`
(`envelopeGround`). A simple template has none: its envelope sits on the template's own page.
The tag's font is the invitation's `--font-primary` (a font pair's body face).

**Shading.** In the drawing, a shadow is its role colour multiplied onto itself and a
highlight is it screened onto itself — muddy on a dull palette. So the build gives every
multiply or screen shape (or shape inside a blended group) `var(--env-<role>-mul)` /
`var(--env-<role>-scr)` instead of `var(--env-<role>)` (`shading` in `envelope.py`);
opacities stay as drawn. `colors.ts` fills them, fixed at **Hue + Vivid**: shadows turn
10° toward cold (OKLCH hue 235), highlights 15° toward warm (55), the short way round and
stopping at the target; then highlights are mixed half with white and given chroma × 1.5,
shadows chroma × 1.15. Lightness never changes, no role's colour reaches another's
shading, and the cast shadows keep their own colour. The tag's own shadows (`shadow` and
`hole shadow` on its paper, `TAG_SHADES` in the build) take `var(--env-tag-shadow)`
instead: a tag is mostly light, and its colour multiplied onto itself hardly shows, so
it is the tag's colour darker (`TAG_SHADOW_DARKER`, 0.05 of OKLCH lightness), its chroma
times `TAG_SHADOW_VIVID` (now 0: a neutral grey of that lightness), in its own hue: left
out of the Hue + Vivid shading every other shadow gets. The maths is in TypeScript, not CSS:
a colour the screen can't show, blurred and blended, came out as cyan specks in Chrome, so
only its chroma gives way until it fits.

## The app

Stacked layers sharing the viewBox, back to front: the cast shadow (closed, open), the
lining band under the fold's seam (`backSeam`), the inside and its top strip
(`insideEdge`), the card or page in the pocket, the inside shadow and its top strip, the
pocket (closed, then open over it, each whole), the flap's shadow and its spread copy
(`flapSpread`), the flap (an HTML box turned in CSS 3D, with a front and a back face, each its own SVG),
the tag's shadow, the tag's hard shadows, the tag, the other decoration shadows (string,
seal — they shade the tag too), the string and seal, an invisible button over the closed
body (`env-hit`) and a hover area over the tag (`env-hit-tag`). The tag sits under the
string so the string stays in its hole while it swings. Past the hole the string goes
behind the tag: the build trims it (and its `tight shadow`) to the seal's side of a line
through the hole, plus everywhere off the tag paper (`trim_strings`). In the drawing the
tag stays on top, so nothing changes there.

The envelope covers the invitation (`env-stage`, z-40, under the simple editor's panel at
z-50) on a ground: a simple template's own page, a palette's envelope `ground`. Until it has faded, the page under it is `inert`
(`useSealed`); turning the Design tab's switch off and on seals it again. In the modular
editor it covers the editor's whole area, the panel's room too, with no ground of its own
(the editor's area, in the same `ground`, shows through); the page stays hidden under it and fades in while it fades
out (`onFade`).

- **Hover** (mouse only, closed only, over the body or the tag — one hover, moving between
  them is no new turn; never with reduced motion): the lifted pose. Every layer grows 4%
  from the body's centre and rises 3%; the cast shadow grows 5.5% and rises only 2%, so a
  little more of it shows below; the tag's shadow rises 2%, grows 4% and blurs 6px. The
  numbers are `LIFTED` in `motion.ts`, read by the CSS as `--env-lift-*`; `--env-up` (0 or
  1. turns the pose on, in `@media (hover: hover) and (prefers-reduced-motion:
no-preference)`.
- **Stays lifted from the click** (`data-lifted` on the stage): the opening starts from the
  lifted pose, so nothing drops back. A tap, a key or a click that came before the hover
  eases into it (0.45 s), the tag dropping too, as the flap starts; whether it is already lifted is the hover
  itself, never a guess at the device. The card's motion goes on top of it: `--env-move`
  (and `--env-out`, each layer's fade) set on `.env` frame by frame, and `card.ts` places
  the card from the lifted envelope.
- **Tag drop:** on hover the tag and its shadows turn −25° around the hole, with a slight
  overshoot (0.55 s), and stay there while hovered; on leaving they turn back to 0 (0.45 s)
  (`SWING` in `motion.ts`). Each turn starts from where the tag is. Once clicked the tag
  stays turned; a tap or a key turns it as part of easing into the lifted pose. As the
  envelope slides down and off (modular, and the simple card's `slide`), the tag turns back
  past its drawn angle to +8°, over the slide (`SWING.slide`, `SLIDE_MS`).
- **Tag text:** the `Envelope.tag` message in the invitation's language (`\n` splits the
  lines: EN "Open / me", RO "Pentru / tine", HU "Nyiss / ki"), written along the tag from
  its bottom up toward the hole, ink in the liner colour, multiplied into the tag. The build
  puts an empty `<text class="env-tag-text">` in the tag group, over the paper and `darken`,
  under the highlights, in the paper's coordinates (`tag_text`), and marks the paper and
  `hole shadow`. `placeTag` finds the tag's direction from them (hole → the paper's centre),
  so a tag drawn at any angle works; the words sit at 0.53 of the tag's length from the
  hole and shrink to fit inside the stitching, again once the fonts load and when the font
  pair changes. Never above 28px on screen (`TAG_MAX_PX`), fitted again when the envelope
  resizes. A paper drawn scaled would shrink the text: `placeTag` undoes its scale.
- **Click** (anywhere on the envelope, or Enter / Space on `env-hit`): the flap turns
  0° → 180° on the fold, toward the viewer, then settles with a small bounce
  (180° → 173° → 180°): 1.3 s (`FLAP_MS`). Past 90° the front face hides and the back face
  shows. Then `data-state="open"` lays the flap flat again.
- **Fades,** on the flap's clock (`openingFades`). **Every fade is a whole layer's
  opacity, run as a Web Animation** (keyframes sampled from its curve, `FADE_STEPS`), so
  the graphics chip only blends layers it already has. Never change a part inside a
  layer, a blur or a mask frame by frame: that redraws the whole layer every frame, and a
  phone stutters (traced: rasterising went from about 1 s to 75 ms over the turn once
  everything fading became its own layer). While opening, every layer is
  `will-change: transform, opacity`.
  - The flap's shadow on the pocket spreads and fades as the flap lifts: its copy with
    the blur at 4× (`FLAP_BLUR`, `spread_copies` in the build) fades in as it fades out,
    both to 0, read from the flap's angle, done as it stands up at 90°.
  - The pocket is built twice, whole: closed (shared + closed parts) and open (shared +
    open parts). The open one fades in over the closed one; inside each, the shading
    blends onto that pocket's own paper.
  - The cast's closed and open shadows cross-fade, each its own layer. Two half-faded
    shadows over each other are lighter than one, so the closed one fades out on
    `castOut`, staying a little stronger, and the hard shadow (drawn at 0.5, `CAST_ALPHA`)
    keeps its strength through the cross-fade.
  - While the flap lies nearly flat, the mask `e-inside` (from `FOLD`, `BODY` and `EDGE`
    in `envelope.py`) hides a 0.75 strip along the top of the inside: its square corners,
    past the closed paper's 0.6 rounding, and its top edge, which the turning flap (its
    own 3D layer, a fraction of a pixel off) shows as a line. The mask never changes
    while the flap turns: a copy of just that strip of the inside and of the inside
    shadow (`insideEdge`, `insideShadeEdge`, clipped by `e-edge`) fades in as the flap
    goes from 55° to 90° (`INSIDE_EDGE_DEG`), when its back face takes over the fold;
    at 90° (`data-upright`, once, not frame by frame) the mask's strip goes and the
    copies hide: a copy beside the inside, its own layer, jogged the pattern a
    fraction of a pixel and left a light line where they met.
  - From then on a band of liner, 1 unit either side of the fold and inset 0.6 from the
    sides (`backSeam`), lies under the inside (its pattern stays whole), behind the seam
    between the inside and the back face (which reaches only 0.25 past the fold): while
    the flap turns, a phone draws its 3D layer softer and a little off, and the ground
    showed through as a light line. It never shows frozen, as the phone then draws the
    flap sharp; a screen recording catches it.
- **Into the page (no card or page measured, e.g. not laid out):** open and still for 0.15 s (`SETTLE_MS`), then the whole
  envelope fades out (0.6 s, `FADE_MS`) and unmounts; the page stops being inert.
- **The card coming out (simple), two ways to compare** (`CardOpening` in `card.ts`; the
  simple editor's Design tab picks one, not saved; the guest page takes `rise`). A copy of
  the page's card (`card` prop, the same children) lies landscape in the pocket, between
  the inside and the pocket, cut off below the envelope (`env-card-pocket`); once clear of
  the pocket a second copy in front of the stage (`env-card-front`) takes over.
  - `rise`: after the flap it rises out (0.9 s), the envelope sinking just enough to keep
    it on the stage; then it turns upright, growing to the page card's size, centred,
    while each envelope layer shrinks to 0.6 and fades (1.0 s).
  - `slide`: after the flap the card grows on one curve to the page card's size, rising
    toward the centre on the way (a little higher, then back; `OUT_MS`, `OUT_LIFT`). The
    envelope grows with it while it holds the card, then eases to a stop as the card
    clears (`softCap`), sliding down and off the stage all along (1.4 s). Once clear, the
    card turns upright (1.0 s).
  - Either way the card has a shadow of its own on the way out (`.env-card::before`): the
    page card's colour and blur (`--card-shadow-*`, the light one's without a template
    shadow), no offset, at 0.6 (`SHADE_OUT`). It comes in as the card starts out of the
    pocket, right after the flap, on both copies (0.3 s, `SHADE_MS`, `cardShadow`), and gives
    way to the page's own (`::after`) as the card moves beside the panel; none without a
    template shadow (`shadowless`).
  - Then, either way, the page's own reply panel slides in over the stage — from the right,
    or up from the bottom on a phone — and the card moves to where the page draws it
    (0.8 s); the envelope unmounts and the page takes over in place. Where the page draws
    its card and panel is measured on the click. Each layer moves and fades on its own:
    one fading wrapper would cut the shadows off the ground. Settled open, the flap drops
    behind the card (every layer but the cast, the inside and the flap is raised).
- **The page coming out (modular)** (`strip.ts`, the `strip` prop): copies of the page's
  sections and header, drawn by `ModularInvitation` (no anchors, no edit buttons, its own
  vars and fonts). The sections, laid out at the column's real width, stand upright in the
  pocket, scaled to 5 units in from the body's sides and cut off below the envelope. Past
  `INVITE_COLUMN` (1440px) the content's width, not the column's, fits the pocket: the side
  bands are clipped off (`clip`) and spread out to the edges over the final growth; so is
  the gap above the cover (measured from the page's `[data-cover]`), the card moved up so
  the cover starts at the pocket's top. The strip has a tight shadow and a small soft one in the envelope's
  shadow colour (`env-strip-shade`, its own box beside the clipped `env-strip-body`, so the
  cut never clips it): it comes in as the slide starts (0.3 s, `SHADE_MS`) and goes over the
  final growth, as the page has none. After
  the click, three steps: while the flap turns, the envelope grows a little, the strip with
  it, a quarter of the strip's growth (`CAP`, over `FLAP_MS`); then, at that size, the envelope slides
  down and off the stage (1.4 s, `SLIDE_MS`) while the strip moves up out of the pocket to
  where the page draws its sections, just under the header (`MOVE_EASE`, steady, there as
  the envelope leaves). Once the body's top (the fold) is past the stage's bottom
  (`growAt`: only the open flap still shows, mostly behind the strip), the strip grows to
  full size from its top centre (0.9 s, `FINAL_MS`), while the envelope slides on; the
  envelope's top is held against that growth, so it never rises back. The copy is always tall enough to reach the scroller's bottom at its size, so
  no edge shows once the envelope is gone. At full size the header shows above it (0.15 s, `HEADER_MS`), and
  the page takes over in place. The envelope's growth and drop go on each layer's own `scale`
  and `translate`, never transitioned, so a tap's ease into the lift doesn't smooth them.
  Every value set frame by frame here goes straight onto the element that uses it, never
  as an inherited var on what holds the page's copy: that had the whole copy's style
  worked out again every frame (traced: about 0.8 s over the turn). On a tap (not
  hovered first) the lift itself runs on that first growth's clock and curve
  (`LIFT_WITH_GROWTH` → `--env-lift-time`), so lift and growth read as one; it is set
  after measuring, as a style update in between would start the lift on its own 0.45 s. After a hover
  and a click (not a tap), over the first growth every shadow grows with the envelope and all but the tag's hard
  one blur more (the envelope's hard one and the tag's soft one, marked `env-blur-more`,
  by `MORE_BLUR`, the rest by `CAST_BLUR`; every shadow, the tag's hard one too, fades to
  half its own opacity (`SHADOW_OPACITY`, on the shapes, not their group, so they still
  multiply)
  times their own, on their `feGaussianBlur`s, set back at the end). The cast's tight and
  soft shadows and the tag's soft one sit in groups the build marks `env-cast-tight`, which
  can scale them on their own about their centres (`--env-cast-tight`, now 1). All in
  `castShadows` (`card.ts`), shared with the simple card's `slide`. The column, its header (its first child)
  and the scroller's bottom are measured on the click.
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
- **Chrome on Android draws nothing of a group that is clipped and blended at once**
  (desktop Chrome draws it). The build writes such a group as two: the blend (and the
  class) outside, the clip inside (`split_clip_blend`).
- **Nor of a blend with nothing drawn under it in its clipped group** (the inside
  shadow, the string's shadows): on desktop it draws as if unblended. The build drops
  that blend (`ser`, `clips`), keeping the shape's shading colour. A blend onto paper
  inside the same clipped group (the flap's shading, the tag) works on Android.
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
