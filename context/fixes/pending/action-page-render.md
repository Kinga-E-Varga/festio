# Actions on host pages render the page too

`loadLatestReplies` (the side panel's latest replies) costs one dashboard render on top
of its own reads: `npm run cost` → "panel: latest replies" went from 53 reads and 1
session check to 67 and 2, exactly the "page: dashboard home" row (14 reads, 1 check).

Found while building subdomain links. The test copy of the app used to start on
`127.0.0.1`, so Next sent every proxy rewrite back to itself over HTTP; that hop hid it.
It now starts on `localhost`, as in prod, and the baseline was accepted at the new
number.

## Likely cause

A Server Action is a POST to the page it runs on (`/dashboard`). next-intl rewrites
that to `/en/dashboard` inside the server, and the action answers with a fresh render of
the page as well as its own result. Prod most likely already pays this on every host
action.

## To check

- Whether it holds for every host action, not only this one (the cost report measures
  one).
- Why the render happens: whether the rewrite alone causes it, or the action asks for it.
- A fix that keeps the action's answer to its own data.
