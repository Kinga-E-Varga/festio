# New modular covers: picture-free

**Status: brainstorming.** The ideas and how they work with the Title are agreed. Which covers to build first is not picked yet. Mocked up in the visual companion with Coastal, Peony, Noir and Sunset (Fraunces & Space Grotesk); the mockup is scratch, not kept.

## Why

Both cover variants today (Box `1`, Badge `2`) stand on a photo. Hosts without a good photo, or who want a drawn or typographic look, have nothing to pick. These covers need no photo.

## Goals

- New cover variants that need **no photo**: drawings, text only, or shapes.
- Every one takes its colours from the invitation's palette roles, so one design works in every palette.
- Some covers carry the names themselves (**poster covers**). The names still live in **one place**, the Title's fields.
- Existing events keep working: no change to stored ids or to the shape of saved data.

## Two kinds of cover

### Mood covers: the Title stays below

They set the scene like today's photo covers: a highlight line (`kicker`) and the date, no names. The Title section follows as now.

**Screen fill:** exactly as the photo covers (`CoverPhoto.tsx`). Up to 1440px wide the header plus the cover fill the first screen and the Title starts below. Wider, the cover stops at 2:1 (720px tall at most), so on a tall screen the Title joins the first screen. Never shorter than 440px. The 2:1 cap was made for photos; mood covers keep it anyway, to stay consistent.

### Poster covers: the Title moves onto the cover

The cover shows the names (and the eyebrow and title lines) itself.

- **Same fields, not copies.** While a poster cover is on, the Cover panel shows the Title's own fields: eyebrow, Use names, name / mark / name, the title lines. Editing them on the cover is editing the Title.
- **The Title steps aside** from both the invitation page and the editor's section list.
- **Switching back** to a photo or mood cover brings the Title back, with everything the host typed. Hiding it never deletes anything.
- **Screen fill:** a poster cover fills the whole first screen at every width, with no 2:1 cap, since there is no title to make room for. The next section starts below the fold.
- Its type must fit the 440px minimum, a short phone held sideways too: the text scales with the cover's box, not the screen width.
- The envelope's preview of the invitation will now show the names.

Open point: the Title's short message (`caption`). The poster cover could show it, or the Title could stay as a slim line holding just the message.

## The ideas

Sample text in the mockups: Anna & Mark, 14 June 2027.

### Mood covers

1. **Drawn scene**: a line drawing (like `wolf-dance`'s dancing animals) in palette colours. The host picks the drawing from a small set: rings, clinking glasses, cake, balloons, a stork, dancing animals.
2. **Landscape strip**: a drawn band along the bottom (hills, sea waves, skyline, garden), the text in the open sky above.
3. **Monogram**: initials in a double ring, the date under it. The full names come in the Title.
4. **Date as the hero**: the date as huge stacked numbers (`14 / 06 / 27`), a highlight line under them.
5. **Pattern field**: the whole cover in one of the existing patterns (`src/modular/patterns/`), a solid panel cut out for the text.
6. **Paper cut-outs**: big overlapping circles, arches and halves in palette colours, a Matisse or Bauhaus feel.
7. **Confetti**: shapes scattered over the cover, drifting down as the page opens.
8. **Soft glow**: blurry blobs of palette colours melting into each other, slowly moving.

### Poster covers

2. **Wreath**: leaves or flowers in a ring, the names inside.
3. **Small drawing, big names**: a little sketch (bow, heart, sparkle) above large names.
4. **Giant type**: the names huge, running off the edges, poster style, the date small in a corner.
5. **Ticket**: the cover as an event ticket. Could also be a postage stamp or a wax seal, which would fit the envelope.
6. **Arch window**: one tall arch in a palette colour, like a doorway, the text inside.

Some mood covers could get a poster version too (cut-outs or the pattern field with the names on them).

Any cover could get a small opening animation (shapes sliding in, lines drawing themselves).

## Not doing

- **Merging Cover and Title into one section.** Cleaner on paper, but it would change ids already stored on events and mean moving saved data.

## First to build (decided 2026-10-30)

**Champagne**, a drawn **poster** cover (the Title's names on it; first planned as a mood cover) for a dinner or birthday party, after [this Paper Culture card](https://paperculture.imgix.net/static/products/202308040825/T2491A-X.NUMBER_10_CARD_BACK.651.202308040825.png): a champagne coupe with a bow tie on the stem, fizz, rising bubbles and stars scattered over the cover. The ground is the accent and every colour of the drawing is mixed from it, like the playlist's record. The other covers come later.

## Still to decide

- The caption on poster covers (above).
- For drawn covers: how many drawings, and whether the drawing is a field (a pick from a set) or one drawing per variant.
- `project-overview.md` says the base sections are always present: it needs a line saying a poster cover shows the Title's content in its place.
