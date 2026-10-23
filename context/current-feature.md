# Current Feature: Password screen offline message

## Status

Completed

## Goals

- **A dropped request shows the `failed` message.** On a Protected invitation the password
  goes through `unlockInvitation` (`src/components/invitation/PasswordGate.tsx`, `open`),
  with no catch: offline or with the server down, the guest sees nothing. Wrap the call in
  `orFailed` (`src/lib/action.ts`) so it lands in the same error branch as a wrong password
  or too many tries. The `"failed"` error (`GateError`) and its words already exist.
- Nothing else changes: wrong password, too many tries and the unlock itself work as today.

## Notes

- Spec: `context/fixes/password-gate-offline.md`.
- Branch: `fix/password-gate-offline`.
- Check in the browser with the request blocked (Playwright `page.route` aborting the
  Server Action POST): the failed message shows, and a retry after unblocking opens the page.
- Simplify: ran 2026-10-23
