# Current Feature: Invitations Page

## Status

In Progress

## Goals

- Build the Invitations page in the user dashboard at `dashboard/invitations`
- Match the layout and design of the referenced prototype artifact (design only — the prototype code is throwaway)
- Render invitation cards with real images (no placeholders), locked to A4 ratio like elsewhere in the app
- Label the design action button "Edit design" (not "Edit template")

## Notes

- Scope: the invitations page only — ignore every other part of the artifact.
- Use the existing mock data in the codebase, not the artifact's data.
- Where the artifact's colors drift from the app palette, snap to the closest palette value (`context/project-overview.md`).
- Fix any wrong image aspect ratios from the artifact — A4, consistent with the other pictures.

## References

- Artifact: https://claude.ai/artifact/6HUtBx6ZYBL59aNkqP7DfZ?sk=vI_HeZlQmniErWvdTyBcaA
- Spec: `context/features/invitations-page.md`
- `context/project-overview.md`

## History

<!-- Keep this updated latest to earliest -->

- Dashboard & events UX fixes — header action, card restack, warning-only tags
- Dashboard design fixes — stats, card/list layout, editor banners, focus rings
- Invitation composition — card + reply in one component, one tree per panel
- Type 1 invitation page and editing platform
- Events list — "Edit invitation" label + safeguard/dates info
- Scanner fixes — cart badge + safeguard bar helper
- Dashboard events + event edit pages
- Dashboard redesign
- Dashboard UI
- Initial setup
