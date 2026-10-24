# Coding Standards

## TypeScript

- Strict mode; no `any` — use proper types or `unknown`

## React

- React Compiler is on: never call React Hook Form's `reset()` in a `useEffect` — `useWatch` stops updating. To start a form fresh, remount it with a `key` (see `src/components/dashboard/event-editor/RollOut.tsx`)

## Next.js

- Server components by default
- Only use `'use client'` when needed (interactivity, hooks, browser APIs)
- Use Server Actions for form submissions and simple mutations
- API routes only for webhooks, uploads with progress, long-running work, specific status
  codes or headers, and third-party integrations; otherwise fetch in server components

## Tailwind CSS v4

**CRITICAL**: We are using Tailwind CSS v4, which uses CSS-based configuration.

- **DO NOT** create `tailwind.config.ts` or `tailwind.config.js` files (those are for v3)
- All theme configuration must be done in CSS using the `@theme` directive in `src/app/globals.css`

## File Organization

- Components: `src/components/[feature]/ComponentName.tsx`
- Pages: `src/app/[route]/page.tsx`
- Server Actions: `src/actions/[feature].ts`
- Types: `src/types/[feature].ts`
- Lib/Utils: `src/lib/[utility].ts`

## Naming

- Components: PascalCase (`ItemCard.tsx`)
- Files: Match component name or kebab-case
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase (no prefix)

## Styling

- Tailwind CSS for all styling
- No inline styles
- Only light mode as option
- Write each style once, in the one place that fits it. Check for an existing one first; extract a pattern on its second use; delete what ends up unused
  - **A value** (a colour, a size, a shadow, a padding the whole app shares): a token in `@theme` in `src/app/globals.css`
  - **A text style** (size, weight, colour, family, tracking, case): an `@utility` class in `globals.css` (`label-caps`, `card-title`). Utilities can build on each other (`card-title` is `card-face` plus a colour). Never a TS constant
  - **A bundle** (several classes that always go together: a field, a button, a box's frame and padding): a constant in a `styles.ts`, built from the tokens and utilities above (`INPUT`, `BUTTON`, `BOX_PAD`)
  - **Markup that repeats** (a box's head, a tag): a small shared component
- Never give a second name to something that already has one: a constant that is only one existing utility (`LABEL = "label-caps"`) hides the real class from search and autocomplete. Use the utility
- A bundle lives in the `styles.ts` of the folder that uses it. Used outside that folder, it moves up to the shared one (`src/components/dashboard/styles.ts`); never import another feature's local `styles.ts`
- Dashboard text scale: page 28 serif / card 17 serif / row 14 / field 13.5 / line 12.5 / item 12.5 semibold / hint 11.5 / caps 10, no 11px
- Line height doesn't count when matching text styles and stays with each use. It goes into a class only when many places use it for one reason (like `hint-text`'s 1.45)
- Invitations are excluded: when looking for matching text styles, skip `src/components/invitation/`, `src/modular/` and `src/templates/` entirely — they have their own fonts and palettes

## Database

- Use the Firebase Admin SDK for all server-side database operations
- Firestore is schemaless — enforce structure at the application layer with Zod schemas, not migrations
- Define Firestore security rules for every collection; never rely on client-side checks alone
- Keep `firestore.rules` and `firestore.indexes.json` in version control and review changes like schema changes
- Deploy rules/indexes with `firebase deploy --only firestore:rules,firestore:indexes` before the app depends on them
- Add composite indexes proactively for any query with multiple `where`/`orderBy` clauses — Firestore will throw at runtime if one is missing

## Data Fetching

- Server components fetch directly with the Firebase Admin SDK (bypasses security rules — validate access manually)
- Client components use the Firebase client SDK (`firebase/firestore`), respecting security rules
- Use `onSnapshot` for real-time data, one-time `getDoc`/`getDocs` otherwise
- Validate all inputs with Zod before writes, both client- and server-side

## Error Handling

- Use try/catch in Server Actions
- Return `{ success, data, error }` pattern from actions
- Display user-friendly error messages via toast

## Code Quality

- Formatting is Prettier's job (`.prettierrc.json`: double quotes, semicolons). Run `npm run format`; never hand-format against it
- No commented-out code unless specified
- When analyzing or reviewing code, judge it by what it does, not its comments — comments here are sometimes misleading. Check any claim about layout, alignment or behaviour against the classes and logic (do the arithmetic)
- No unused imports or variables
- Keep functions under 50 lines when possible
