# Envelope animation

The guest's first sight of an invitation: a closed envelope in the invitation's colours.
The guest opens it with a click to see the page. Moves the envelope from the prototype
(`prototypes/envelope/`, the `envelope` skill) into the app.

## Where it appears

- **Both kinds of invitation:** simple and modular, every package.
- **Guest page:** on every visit.
- **Protected invitations:** the password comes first. The envelope shows only after the
  password is accepted. (The password input itself is not part of this feature.)
- **Cancelled events:** no envelope.
- **Editors (simple and modular):** the preview shows the envelope just like the guest page.
  The host has to open it to see the invitation. No Replay button for now.
- **Print page and its preview:** no envelope.

## The host's switch

- A **Use envelope** switch in the editor's Design tab. **On by default.**
- Modular: placed before the section options.
- Simple: the first thing in the Design tab (which is empty today).
- Turning it off hides the envelope in the preview. Turning it on again brings the closed
  envelope back, and the host has to open it again.
- Saved with the event. Until Firestore is wired, it lives in the editor's state
  (`ModularState` for modular).

## Colours

The envelope can't use the palette's roles directly, so it has six roles of its own:

| Role   | Used for                                     |
| ------ | -------------------------------------------- |
| paper  | the envelope's paper                         |
| liner  | the liner; also the tag's stitching and text |
| string | the string                                   |
| seal   | the seal                                     |
| tag    | the tag's paper                              |
| shadow | the cast shadows, used as they are           |

- Each role is either a **hex value** or the **name of another envelope role**
  (e.g. `seal: "liner"`).
- **Modular:** every palette in `src/modular/palettes/` gets an envelope entry. Orchard takes
  the prototype's Olive Garden mapping. The other palettes get colours that suit them, for
  the user to review and fix later.
- **Simple:** the template's file carries its envelope roles, beside its own palette. Wolf
  Dance takes the prototype's mapping.
- The `palette` skill asks for envelope colours on every new palette.

## Shading

Fixed at **Hue + Vivid**: shadows turn 10° colder, highlights 15° warmer, then the Vivid boost
as in the prototype. These become constants; the prototype's shading options and sliders
don't come over. The cast shadows keep their own colour.

## The animation (first version)

- **Closed:** the envelope on the invitation's own ground (canvas and pattern), with the tag
  saying "Open me".
- **Hover** (mouse only): as in the prototype — the envelope lifts and grows a little, the
  tag drops.
- **Click:** the flap opens as in the prototype. Then the envelope fades into the
  invitation page. No card or page strip coming out of the envelope yet; that may come later.
- **Reduced motion:** a quick fade from the envelope to the page.

## Tag text

Guest-facing, so it follows the invitation's language (message catalog, guest side).

- EN: "Open / me" (two lines)
- RO: "Deschide-mă" (split as "Deschide- / mă" if it needs two lines)
- HU: "Nyiss / ki"

Font: the invitation's body font — the font pair's primary for modular, the template's
primary font for simple. Ink in the liner colour.

## The drawing and the `envelope` skill

- The drawing stays editable in Inkscape: `prototypes/envelope/envelope-edit.svg`.
- `envelope.py` gets a build target that writes the drawing's layers and constants into the
  app as a generated file. The app's envelope component reads it.
- The `envelope` skill is updated to maintain the app instead of the prototype page: check,
  diff, report and wait for the OK, build into the app, check it in the browser.
- The prototype page and its HTML template are no longer the target.

## Out of scope

- Card / page strip coming out of the envelope.
- Replay button.
- The password input for Protected invitations.
- Seal / string motion.
