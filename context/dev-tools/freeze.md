# Freeze the envelope's card — `?freeze=<ms>`

Only in `npm run dev`; never reaches guests.

Holds an invitation's card (simple) or page (modular) as it comes out of the envelope, so it
can be styled in DevTools (e.g. the shadow: `.env-card::after` on a simple card (the copy in the pocket, then the one in front),
`.env-strip-shade` on a modular page).

- Add it to the URL: `http://localhost:3000/templates/olive-garden?freeze=2000`
  (or `/templates/wolf-dance?freeze=2500`)
- Click the envelope. The animation stops that many ms after the click and stays there.
- Works from 1300 ms on, once the flap is open. Not for the flap itself.
- Simple: frozen once the reply panel has started sliding in, the panel still finishes its slide.
- Code: `freezeAt()` in `src/components/envelope/Envelope.tsx`.
