# Look at a page — `npm run look`

Only against `npm run dev` (http://localhost:3000). Playwright and its Chromium are dev
dependencies; after a fresh clone, `npx playwright install chromium` once.

```
npm run look -- [path or url] [options]
```

| Option                 | What it does                                                        |
| ---------------------- | ------------------------------------------------------------------- |
| `--width 800,970,1200` | page widths, one browser for all (default 1200)                     |
| `--section playlist`   | the part to look at: `#<id>`, e.g. a modular section                |
| `--style "Full card"`  | pick that style for `--section` (its name in the Design tab)        |
| `--pattern Polka`      | pick a background pattern                                           |
| `--palette Peony`      | pick a colour palette                                               |
| `--measure "svg,h2"`   | selectors inside the part: x, y, width, height and padding          |
| `--shot`               | save a screenshot of the part to `<tmp>/festio-look/` (default: no) |
| `--out <dir>`          | where screenshots go                                                |

The path defaults to `/templates/olive-garden`, the modular preview: it runs in memory, so no
Firestore reads or writes. There the envelope is switched off, the picks are made in the
Design tab, and the side panel is closed before each width.

Example — the Playlist's Full card at two widths, the record and the heading measured:

```
npm run look -- --section playlist --style "Full card" --pattern Polka --width 970,1200 --measure "svg,h2"
```

```
970px: playlist w 970 h 460
  svg: x 165 y 100 w 260 h 260 pad 0px 0px 0px 0px
  h2: x 473 y 166 w 284 h 62 pad 0px 0px 0px 0px
```

Measure to confirm a fix (text is cheap); `--shot` only to find what is wrong, or when asked
to see it. Code: `scripts/look.mjs`.
