# Password screen: a dropped request says nothing

Found by the simplify review of the step-4 cleanup. Not built yet.

## The problem

On a Protected invitation, the guest's password goes to the server through
`unlockInvitation` (`src/components/invitation/PasswordGate.tsx`, `open`). The call has no
catch. When the request itself never gets an answer (offline, the server down), it throws:
the guest sees no message at all, and the form just stops.

The screen already has a `"failed"` error (`GateError`), so the words exist; only the path
to them is missing.

## Goals

- **A dropped request shows the `failed` message.** Wrap the call in `orFailed`
  (`src/lib/action.ts`), as every host save does, so it lands in the same error branch as a
  wrong password or too many tries.
- Nothing else changes: wrong password, too many tries and the unlock itself work as today.

## Notes

- Branch: `fix/password-gate-offline`.
- Check in the browser with the request blocked (e.g. Playwright `page.route` aborting the
  Server Action POST): the failed message shows, and a retry after unblocking opens the page.
