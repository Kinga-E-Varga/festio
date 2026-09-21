# Design fixes in deashboard

## Overview

The following changes should be implemented.

## Changes

### In dashboard main page

- The sumup box 'Live invitations....unknown' Should show: live invitations (x of y ), next event (2 day), new replies (x since last last), unmatched names (x unknown, the unknown text should be the same style as the previous small texts)
- In the event card, on wide screens leave a little more space for the for the 'replies' section on the left
- In the event card the buttons should be the same style as the 'edit invitation' button in the Events page. In both cases make the buttons bg this #D6E2D2 color on hover.
- Event card - past event: IF data deleted it shouldn't have buttons, link password, and only the free/standard/custom tag . If data is not deleted yet the edit btn should be disabled.

### Events page

- Make the add event btn the same color ar the edit event btn. Also, make it stay on the left even on small screens (since it's only a + icon it has enough space)
- In the event list leave the picture on the left. Beside that on the right in a column add the date (only date, not in x weeks/days), the title, the tags without the 'locks in...', below that add the replies bar in the same way as the event editing page (82 replies received against a 100 cap), below that add the dates that matter section separated with a thin line. On the far right add the buttons (edit event, edit invitation) centered vertically. The date and tags of the event should be bigger than in the main dashboard page event card. Make decisions that make it look visually clean for everything I didn't directly specify.

### Event editing page

- Remove the Pending number from the summary card.
- Remove the unmatched names box (and shrink the picture according to these changes so that the buttons+picture visually match the height of left side of the card on wide screen).
- Instead of Design button should read Edit invitation.
- If an event is unpaid the Cancel the event shouldn't exist.
- Change color of 'This draft is unpaid...' banner to the same color as the 'Editing closes in 30 hours
  Event and invitation editing close ...' banner
- If an event is payed but hidden add a box (like the This draft is unpaid) warning to let the host know it's unreachable (same color as the other warning banner)
- Remove the 'open the invitation' btn.
- Invitation address > editable part should have the same light bg as other input fields
- If an input gets a thick outline when active it must always be the same color as the original border of the input.
