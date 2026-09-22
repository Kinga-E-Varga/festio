# Invitation print page

## Overview

These are the specs for the printing page of an invitation.

## Requirements

### Page specs

- should open when the print button is clicked on a card on the invitation edit page
- for now only the Maria & andrei will have its functional print page
- for the front part of the print use the @mock/ing-img/Screenshot 2026-07-27 213629.png for now
- the invitation print page acts similarly to the invitation editing page. It has it's own page, does not appear within the dashboard's layout.
- the page wil have a similar layout as the @src/components/invitation/HostInvitationEditor.tsx use the same action host bar design (but remove the x button, instead of edit write save, instead of save write print) and use the same editing panel design
- the print and save btns should only trigger a toast for now.
- the print editing panel will only collapse on small screens.

### Print edit form

Within the editing panel there will be a print edit form with the following settings:

- user chooses between 'flat card' or 'folded card'
- user can checks/unchecks 'coloured background' (dy default it's checked)
- user can fill 2 text inputs: 1st in a bigger font: by default it will be the user's rsvpMessage (read it from invitation's index.tsx) BUT it wont be the same data! the rsvpMessage is the fallback. 2nd in a smaller font: by default it will be 'Please respond on the link provided below.'
- the next part is the printing information. When 'flat card' is set the text should be: 'You will download two images: one for the front, one for the back. Print them on the two sides of a single sheet of paper — nothing to fold. Paper size: anything from A6 (smallest) to A5 (largest), or any size in between.' When 'folded card' is set the text is: 'You will download two images: one for each side of the sheet. Print them on the two sides of a single sheet, then fold it in half — the front of the invitation ends up on the outside.Paper size before folding: anything from A5 (smallest) to A4 (largest), or any size in between.' Put the text in a box and the box should not change size when the text changes within.
- the save btn of the form is the save button from the host action bar
- the form will have a view button bot only on small screens when the editing panel is collapsable.

### Main viewing area

- this is the area that has the 'TemplateCard' in the invitation editing version, but here it'll have an animation of the card
- when 'flat card' is selected a simple flip animation of the card should show (with a click to flip note under)
- when 'fold card' is selected a folding animation should show (with click to open/click to close note under)
- For reference of how they should look see the reference below, but only use parts of the code if you find any of it suitable for our environment.

## Reference for animation

### Flat card

```
<div style="display: flex; align-items: center; justify-content: center; min-height: 400px; background: var(--surface-0);">
  <div style="perspective: 1000px;">
    <div id="card" style="width: 280px; height: 360px; position: relative; cursor: pointer; transform-style: preserve-3d; transition: transform 0.8s ease-out;" onclick="toggleCard()">

      <!-- Front of card (closed) -->
      <div id="cardFront" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; background: linear-gradient(135deg, var(--surface-2) 0%, var(--surface-1) 100%); border: 0.5px solid var(--border); border-radius: 12px; padding: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; box-sizing: border-box;">
        <div style="font-size: 48px; margin-bottom: 1rem;">🎁</div>
        <p style="font-size: 18px; font-weight: 500; color: var(--text-primary); text-align: center; margin: 0;">Click to open</p>
      </div>

      <!-- Back of card (open) -->
      <div id="cardBack" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; transform: rotateY(180deg); background: linear-gradient(135deg, var(--surface-1) 0%, var(--surface-2) 100%); border: 0.5px solid var(--border); border-radius: 12px; padding: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; box-sizing: border-box; text-align: center;">
        <p style="font-size: 20px; font-weight: 500; color: var(--text-primary); margin: 0 0 1rem;">Surprise! 🎉</p>
        <p style="font-size: 14px; color: var(--text-secondary); margin: 0 0 1.5rem; line-height: 1.6;">You've unlocked something special. Click again to close.</p>
        <div style="width: 60px; height: 60px; background: var(--fill-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px;">✨</div>
      </div>

    </div>
  </div>
</div>

<script>
let isOpen = false;

function toggleCard() {
  const card = document.getElementById('card');
  isOpen = !isOpen;

  if (isOpen) {
    card.style.transform = 'rotateY(180deg)';
  } else {
    card.style.transform = 'rotateY(0deg)';
  }
}
</script>
```

### Fold card

```
<div style="padding: 1.5rem 0; display: flex; flex-direction: column; align-items: center; gap: 1.25rem;">

  <div style="perspective: 1600px; width: 100%; display: flex; justify-content: center;">
    <div id="stage" style="position: relative; width: 420px; height: 297px; transform: translateX(105px); transition: transform 0.9s cubic-bezier(0.22, 0.61, 0.36, 1); transform-style: preserve-3d;">

      <div style="position: absolute; left: 210px; top: 0; width: 210px; height: 297px; box-sizing: border-box; background: var(--surface-2); border: 0.5px solid var(--border); border-radius: 0 3px 3px 0; padding: 28px 24px; display: flex; flex-direction: column; justify-content: center; gap: 10px;">
        <p style="margin: 0; font-size: 15px; font-weight: 500; color: var(--text-primary);">Page 3 — inside right</p>
        <p style="margin: 0; font-size: 13px; line-height: 1.7; color: var(--text-secondary);">The right half of the sheet stays put. It is the back of the fold, so it never moves.</p>
      </div>

      <div id="flap" style="position: absolute; left: 210px; top: 0; width: 210px; height: 297px; transform-origin: left center; transform-style: preserve-3d; transition: transform 0.9s cubic-bezier(0.22, 0.61, 0.36, 1);">

        <div style="position: absolute; inset: 0; box-sizing: border-box; backface-visibility: hidden; background: var(--surface-1); border: 0.5px solid var(--border-strong); border-radius: 0 3px 3px 0; padding: 28px 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; text-align: center;">
          <i class="ti ti-book-2" style="font-size: 28px; color: var(--text-secondary);" aria-hidden="true"></i>
          <p style="margin: 0; font-size: 16px; font-weight: 500; color: var(--text-primary);">Front cover</p>
          <p style="margin: 0; font-size: 13px; color: var(--text-muted);">Hinge is on the left edge</p>
        </div>

        <div style="position: absolute; inset: 0; box-sizing: border-box; backface-visibility: hidden; transform: rotateY(180deg); background: var(--surface-2); border: 0.5px solid var(--border); border-radius: 3px 0 0 3px; padding: 28px 24px; display: flex; flex-direction: column; justify-content: center; gap: 10px;">
          <p style="margin: 0; font-size: 15px; font-weight: 500; color: var(--text-primary);">Page 2 — inside left</p>
          <p style="margin: 0; font-size: 13px; line-height: 1.7; color: var(--text-secondary);">This is the reverse of the front cover. It swings across to the left as the card opens.</p>
        </div>

      </div>
    </div>
  </div>

  <button id="toggle" onclick="toggleCard()" style="width: 150px;">Open card</button>

</div>

<script>
let open = false;
function toggleCard() {
  open = !open;
  const stage = document.getElementById('stage');
  const flap = document.getElementById('flap');
  const btn = document.getElementById('toggle');
  flap.style.transform = open ? 'rotateY(-180deg)' : 'rotateY(0deg)';
  stage.style.transform = open ? 'translateX(0px)' : 'translateX(105px)';
  btn.textContent = open ? 'Close card' : 'Open card';
}
document.getElementById('stage').addEventListener('click', toggleCard);
</script>
```
