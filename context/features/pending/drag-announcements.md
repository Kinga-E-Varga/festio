# Drag-and-drop announcements in the host's language

**Status: small fix, ready to load.** Left over from modular invitations phase 4 (modular RSVP).

## Why

The Replies tab reorders the host's questions with dnd-kit (`src/components/modular/replies/QuestionList.tsx`). Keyboard and screen-reader users drag with Space and the arrow keys. While they do, dnd-kit reads out instructions and what is happening ("Picked up draggable item …", "… was moved over droppable area …"). Those phrases are dnd-kit's English defaults, so a Romanian or Hungarian host hears English with internal ids in it.

## Goals

- Pass `accessibility.screenReaderInstructions` and `accessibility.announcements` to the `DndContext` in `QuestionList.tsx`. Write them in the host's locale (host chrome), from the `RepliesTab` messages in `messages/{en,ro,hu}.json`.
- Announce by the question's wording and place, never by its id. For example: "Picked up “Song request”. Position 2 of 4." / "Moved to position 3 of 4." / "Dropped at position 3 of 4." / "Move cancelled. Back at position 2."
- The instructions say how to drag: Space or Enter to pick up, the arrow keys to move, Space or Enter to drop, Escape to cancel.

## Notes

- About ten phrases, in three languages.
- dnd-kit docs: the `accessibility` prop of `DndContext` (`announcements`: `onDragStart`, `onDragOver`, `onDragEnd`, `onDragCancel`; `screenReaderInstructions.draggable`).
- The seating chart will reuse dnd-kit. If it lands first, share one helper for the announcements rather than writing them twice.
- Check with a screen reader (NVDA or VoiceOver) in each of the three languages.
